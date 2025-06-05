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

// Fixed colors per status
const COLORS_MAP: Record<string, string> = {
  Approved: "#28a745",   // green
  Rejected: "#dc3545",   // red
  Withdrawn: "#ffc107",  // yellow
};

const highlightColor = "#d4edda";

const Container = styled.main`
  width: 100vw;
  margin: 4rem auto;
  padding: 2rem;
  font-family: "Georgia", serif;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputGroup = styled.div`
  width: 400px;
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
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
  cursor: pointer;

  &:hover {
    background-color: #6c1733;
  }
`;

const CardsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
`;

const Card = styled.div`
  background: #f1f1f1;
  padding: 1.5rem;
  border-radius: 8px;
  flex: 1 1 300px;
  max-width: 300px;
  box-sizing: border-box;
`;

const List = styled.ul`
  padding-left: 1.5rem;
`;

const HighlightLine = styled.p<{ $highlight?: boolean }>`
  background-color: ${({ $highlight }) =>
    $highlight ? highlightColor : "transparent"};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
`;

export default function SearchDeputy() {
  const [name, setName] = useState("");
  const [deputies, setDeputies] = useState<any[]>([]);
  const [error, setError] = useState("");

  const getRepeatedParties = () => {
    const counts: Record<string, number> = {};
    deputies.forEach((dep) => {
      const party = dep.parties?.[0]?.trim();
      if (party) counts[party] = (counts[party] || 0) + 1;
    });
    return Object.fromEntries(
      Object.entries(counts).filter(([_, count]) => count > 1)
    );
  };

  const repeatedParties = getRepeatedParties();

  const fetchDeputy = async () => {
    try {
      setError("");
      const res = await axios.get("http://localhost:3001/deputado", {
        params: { nome: name },
      });

      const alreadyAdded = deputies.find(
        (d) => d.full_name === res.data.full_name
      );
      if (alreadyAdded) {
        setError("This deputy is already in the list.");
        return;
      }

      if (deputies.length >= 4) {
        setError("You can only add up to 4 deputies.");
        return;
      }

      setDeputies([...deputies, res.data]);
      setName("");
    } catch (err) {
      setError("Deputy not found");
    }
  };

  return (
    <Container>
      <h1>Search Deputy</h1>

      <InputGroup>
        <Input
          type="text"
          placeholder="Enter deputy name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={fetchDeputy}>Search</Button>
      </InputGroup>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <CardsWrapper>
        {deputies.map((deputy) => {
          const party = deputy.parties?.[0]?.trim() || "";
          const isHighlighted = repeatedParties[party] > 1;

          const projectStats = deputy.projetos || {};
          const chartData = [
            { name: "Approved", value: projectStats.aprovados || 0 },
            { name: "Rejected", value: projectStats.rejeitados || 0 },
            { name: "Withdrawn", value: projectStats.retirados || 0 },
          ];

          return (
            <Card key={deputy.full_name}>
              <h2>{deputy.full_name}</h2>
              <HighlightLine $highlight={isHighlighted}>
                <strong>Party:</strong> {deputy.parties?.join(", ")}
              </HighlightLine>

              <p>
                <strong>Total Interventions:</strong>{" "}
                {deputy.total_interventions}
              </p>

              {deputy.presenca && (
                <>
                  <p>
                    <strong>Total Days Present:</strong>{" "}
                    {deputy.presenca.total_present}
                  </p>
                  <p>
                    <strong>Total Days Absent:</strong>{" "}
                    {deputy.presenca.total_absent}
                  </p>
                </>
              )}

              <h3>Rubric Types:</h3>
              <List>
                {(Object.entries(deputy.rubrique_types || {}) as [
                  string,
                  number
                ][]).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value}
                  </li>
                ))}
              </List>

              <p style={{ fontSize: "0.9rem", marginTop: "1rem" }}>
                <em>
                  <strong>Note:</strong> The number of "Projet de loi" above
                  refers to all sessions in which the deputy participated
                  discussing laws — it does not necessarily mean authorship.
                </em>
              </p>

              {chartData.some((d) => d.value > 0) && (
                <>
                  <h3 style={{ marginTop: "1rem" }}>
                    Bills (Distribution as Author/Coauthor):
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        label
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS_MAP[entry.name] || "#999"}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <p style={{ fontSize: "0.9rem" }}>
                    <em>
                      This chart shows only the bills in which the deputy is
                      listed as an author or co-author, based on the{" "}
                      <code>law_authors</code> field.
                    </em>
                  </p>
                </>
              )}
            </Card>
          );
        })}
      </CardsWrapper>
    </Container>
  );
}
