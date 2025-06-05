// styles/SearchDeputy.styles.ts
import styled from "styled-components";

export const Container = styled.main`
  padding: 2rem;
  max-width: 100%;
  font-family: "Georgia", serif;
`;

export const InputGroup = styled.div`
  display: flex;
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto 2rem auto;
  flex-wrap: wrap;
  justify-content: center;
`;

export const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  font-size: 1rem;
  min-width: 220px;
`;

export const Button = styled.button`
  padding: 0.75rem 1.25rem;
  background-color: #8b1d41;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
`;

export const ToggleButton = styled(Button)`
  background-color: #007bff;
`;

export const DeputyGrid = styled.div`
  display: flex;
  gap: 2rem;
  overflow-x: auto;
`;

export const Card = styled.div`
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  min-width: 350px;
  flex-shrink: 0;
`;

export const ChartContainer = styled.div`
  margin-top: 1rem;
`;
