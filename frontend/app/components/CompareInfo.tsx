import styled from "styled-components";

const InfoBox = styled.div`
  background-color: #e6f0ff;
  text-align: center;
  color: #003366;
  padding: 1rem 1.25rem;
  border-left: 5px solid #003366;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
`;

export default function CompareInfo() {
  return (
    <InfoBox>
📊 You can add multiple deputies to compare your presence,
votes and projects.Just enter the full name and click "Search".
    </InfoBox>
  );
}
