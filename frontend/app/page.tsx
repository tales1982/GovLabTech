"use client";

import { useState } from "react";
import axios from "axios";
import styled from "styled-components";

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

              <h3>Rubrique Types:</h3>
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
            </Card>
          );
        })}
      </CardsWrapper>
    </Container>
  );
}
