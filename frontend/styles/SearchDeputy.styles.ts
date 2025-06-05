// styles/SearchDeputy.styles.ts
import styled from "styled-components";

export const Container = styled.main`
  padding: 2rem;
  max-width: 100%;
  font-family: "Georgia", serif;

  h1{
    text-align: center;
  }
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
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 100%;
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
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
`;


export const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  &:hover {
    transform: translateY(-4px);
  }
`;

export const ChartContainer = styled.div`
  flex: 1;
  min-width: 300px;
  max-width: 400px;
`;


export const ChartRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding-top: 1rem;
`;

