import styled from "styled-components";

const InfoBox = styled.div`
  background-color: #f3eaec;
  text-align: center;
  color: #351219;
  padding: 1rem 1.25rem;
  border-left: 5px solid #893040;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.6;
`;

export default function CompareInfo() {
  return (
    <InfoBox>
      <p>« Ce n'est pas un système de notation. Il ne s'agit pas de savoir qui est bon ou mauvais.»</p>
      <p>« Il s'agit d'accès. Donner aux citoyens, aux étudiants et aux journalistes un moyen de consulter les faits réels.»</p>
      <p>« La transparence renforce la démocratie, et des outils comme celui-ci la facilitent. »</p>
    </InfoBox>
  );
}
