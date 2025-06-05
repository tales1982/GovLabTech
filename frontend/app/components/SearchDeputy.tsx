"use client";

import { useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import {
  Container,
  InputGroup,
  Input,
  Button,
  ToggleButton,
  DeputyGrid,
  Card,
  ChartContainer,
} from "../../styles/SearchDeputy.styles";

// Cores distintas e não repetidas
const COLORS: Record<string, string> = {
  present: "#28a745",
  excused: "#ffc107",
  foreign_mission: "#17a2b8",
  absent: "#ff6347",
  publie: "#007bff",
  retire: "#f0ad4e",
  rejete: "#c82333",
  autres: "#6c757d",
  oui: "#20c997",
  non: "#e83e8c",
  abstention: "#fd7e14",
};

export default function SearchDeputy() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deputies, setDeputies] = useState<any[]>([]);
  const [chartType, setChartType] = useState<"bar" | "pie">("pie");
  const [error, setError] = useState("");

  const fetchDeputy = async () => {
    try {
      setError("");
      const [lastname, ...firstnameParts] = searchTerm.trim().split(" ");
      const firstname = firstnameParts.join(" ");
      if (!lastname || !firstname) {
        setError("Please enter both last name and first name");
        return;
      }

      const res = await axios.get("http://localhost:3001/deputado", {
        params: { nome: lastname, firstname },
      });

      const alreadyExists = deputies.find(
        (d) => d.deputado === res.data.deputado
      );
      if (alreadyExists) {
        setError("This deputy has already been added.");
        return;
      }

      setDeputies([...deputies, res.data]);
      setSearchTerm("");
    } catch (err) {
      setError("Deputy not found or error fetching data");
    }
  };

  const getDataWithEmojis = (rawData: any[]) => {
    const max = Math.max(...rawData.map((d) => d.value));
    const min = Math.min(...rawData.map((d) => d.value));

    return rawData.map((entry) => {
      let label = entry.name;
      if (entry.value === max && max !== min) label = `🥇 ${label}`;
      else if (entry.value === min && max !== min) label = `😞 ${label}`;

      return {
        ...entry,
        label,
        fill:
          entry.value === max && max !== min
            ? "#28a745"
            : entry.value === min && max !== min
            ? "#dc3545"
            : COLORS[entry.name] || "#999",
      };
    });
  };

  const renderPie = (title: string, rawData: any[]) => {
    const data = getDataWithEmojis(rawData);

    const legendPayload = rawData.map((entry) => ({
      value: entry.name,
      type: "square" as const,
      color: COLORS[entry.name] || "#999",
    }));

    return (
      <ChartContainer>
        <h4>{title}</h4>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
            <Legend payload={legendPayload} />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  };

  const renderBar = (title: string, rawData: any[]) => {
    const data = getDataWithEmojis(rawData);
    return (
      <ChartContainer>
        <h4>{title}</h4>
        <ResponsiveContainer width="100%" height={40 * data.length + 40}>
          <BarChart data={data} layout="vertical">
            <XAxis type="number" />
            <YAxis type="category" dataKey="label" />
            <Tooltip />
            <Legend />
            <Bar dataKey="value">
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  };

  const renderChart = (title: string, data: any[]) =>
    chartType === "pie" ? renderPie(title, data) : renderBar(title, data);

  return (
    <Container>
      <h1>Compare Deputies</h1>
      <InputGroup>
        <Input
          placeholder="Full name (e.g. Cahen Corinne)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={fetchDeputy}>Search</Button>
        <ToggleButton
          onClick={() => setChartType(chartType === "pie" ? "bar" : "pie")}
        >
          Toggle to {chartType === "pie" ? "Bar Chart" : "Pie Chart"}
        </ToggleButton>
      </InputGroup>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <DeputyGrid>
        {deputies.map((data, index) => (
          <Card key={index}>
            <h2>{data.deputado}</h2>
            <p>
              <strong>Party:</strong> {data.partido}
              <br />
              {data.grupo_politico && (
                <>
                  <strong>Group:</strong> {data.grupo_politico}
                </>
              )}
            </p>

            {renderChart(
              "Presences",
              Object.entries(data.presencas.status).map(([k, v]) => ({
                name: k,
                value: v,
              }))
            )}

            {renderChart("Projects", [
              {
                name: "publie",
                value: data.projetos.detalhes.filter((p: any) =>
                  p.status?.toLowerCase().includes("publie")
                ).length,
              },
              {
                name: "retire",
                value: data.projetos.detalhes.filter((p: any) =>
                  p.status?.toLowerCase().includes("retire")
                ).length,
              },
              {
                name: "rejete",
                value: data.projetos.detalhes.filter((p: any) =>
                  p.status?.toLowerCase().includes("rejete")
                ).length,
              },
              {
                name: "autres",
                value: data.projetos.detalhes.filter((p: any) => {
                  const s = p.status?.toLowerCase() || "";
                  return (
                    !s.includes("publie") &&
                    !s.includes("retire") &&
                    !s.includes("rejete")
                  );
                }).length,
              },
            ])}

            {renderChart("Votes", [
              { name: "oui", value: data.votos.stats.oui },
              { name: "non", value: data.votos.stats.non },
              { name: "abstention", value: data.votos.stats.abstention },
            ])}
          </Card>
        ))}
      </DeputyGrid>
    </Container>
  );
}
