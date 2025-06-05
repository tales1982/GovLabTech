"use client";

import { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  present: "#28a745",
  excused: "#ffc107",
  foreign_mission: "#17a2b8",
  absent: "#dc3545",
  publie: "#007bff",
  retire: "#ffc107",
  rejete: "#dc3545",
  autres: "#6c757d",
  oui: "#28a745",
  non: "#dc3545",
  abstention: "#ffc107",
};

const Container = styled.main`
  padding: 2rem;
  max-width: 100%;
  font-family: "Georgia", serif;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto 2rem auto;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.25rem;
  background-color: #8b1d41;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
`;

const DeputyGrid = styled.div`
  display: flex;
  gap: 2rem;
  overflow-x: auto;
`;

const Card = styled.div`
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  min-width: 350px;
  flex-shrink: 0;
`;

const ChartContainer = styled.div`
  margin-top: 1rem;
`;

export default function SearchDeputy() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deputies, setDeputies] = useState<any[]>([]);
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

  const renderPie = (title: string, data: any[]) => (
    <ChartContainer>
      <h4>{title}</h4>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={COLORS[entry.name] || "#999"} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );

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

            {renderPie(
              "Presences",
              Object.entries(data.presencas.status).map(([k, v]) => ({
                name: k,
                value: v,
              }))
            )}

            {renderPie("Projects", [
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

            {renderPie("Votes", [
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
