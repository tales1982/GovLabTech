"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  ChartRow,
} from "../../styles/SearchDeputy.styles";
import CompareInfo from "./CompareInfo";

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
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("deputies");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setDeputies(parsed);
        }
      } catch (err) {
        console.error("Erro ao parsear deputies:", err);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("deputies", JSON.stringify(deputies));
    }
  }, [deputies, hydrated]);

  const fetchDeputy = async () => {
    try {
      setError("");
      const parts = searchTerm.trim().split(" ");
      if (parts.length < 2) {
        setError("Please enter both first name and last name");
        return;
      }
      const name = parts.join(" ");

      const res = await axios.get("http://localhost:3001/deputy", {
        params: { name },
      });

      const alreadyExists = deputies.find(
        (d) => d.name === res.data.name && d.firstname === res.data.firstname
      );
      if (alreadyExists) {
        setError("This deputy has already been added.");
        return;
      }

      setDeputies([res.data, ...deputies]);
      setSearchTerm("");
    } catch (err) {
      setError("Deputy not found or error fetching data");
    }
  };

  const clearDeputies = () => {
    localStorage.removeItem("deputies");
    setDeputies([]);
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
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={60}
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

  if (!hydrated) return null;

  return (
    <Container>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#003366", marginBottom: "1rem" }}>
        Deputies Comparison
      </h1>
      <CompareInfo />
      <InputGroup>
        <Input
          placeholder="Full name (Firstname Lastname)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button style={{ backgroundColor: "#003366" }} onClick={fetchDeputy}>
          Search
        </Button>
        <ToggleButton
          onClick={() => setChartType(chartType === "pie" ? "bar" : "pie")}
        >
          Toggle to {chartType === "pie" ? "Bar Chart" : "Pie Chart"}
        </ToggleButton>
        <Button
          style={{ backgroundColor: "#dc3545", marginLeft: "0.5rem", color: "#fff" }}
          onClick={clearDeputies}
        >
          Clear All
        </Button>
      </InputGroup>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <DeputyGrid>
        {deputies.map((data, index) => (
          <Card key={index}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ margin: 0 }}>{data.firstname} {data.name}</h2>
              <Link href={`/projects/${encodeURIComponent(`${data.firstname}-${data.name}`)}`}>
                <Button style={{ marginLeft: "1rem", backgroundColor: "#0d6efd" }}>
                  View Projects
                </Button>
              </Link>
            </div>

            <p>
              <strong>Party:</strong> {data.political_party}
              <br />
              {data.political_group && (
                <>
                  <strong>Group:</strong> {data.political_group}
                </>
              )}
            </p>

            <ChartRow>
              {renderChart("Presences", Object.entries(data.presence.status).map(([k, v]) => ({
                name: k,
                value: v,
              })))}
              {renderChart("Projects", [
                { name: "publie", value: data.laws.details.filter((p: any) => p.status?.toLowerCase().includes("publie")).length },
                { name: "retire", value: data.laws.details.filter((p: any) => p.status?.toLowerCase().includes("retire")).length },
                { name: "rejete", value: data.laws.details.filter((p: any) => p.status?.toLowerCase().includes("rejete")).length },
                { name: "autres", value: data.laws.details.filter((p: any) => {
                  const s = p.status?.toLowerCase() || "";
                  return !s.includes("publie") && !s.includes("retire") && !s.includes("rejete");
                }).length },
              ])}
              {renderChart("Votes", [
                { name: "oui", value: data.votes.stats.oui },
                { name: "non", value: data.votes.stats.non },
                { name: "abstention", value: data.votes.stats.abstention },
              ])}
            </ChartRow>
          </Card>
        ))}
      </DeputyGrid>
    </Container>
  );
}
