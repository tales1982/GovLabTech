
import styled from "styled-components";


export const ListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 2rem 0;
  justify-content: center;
`;

export const Card = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  border: 1px solid #ccc;
  transition: background 0.2s, transform 0.2s;

  &:hover {
    background: #e2e6ea;
    transform: scale(1.02);
  }
`;

export const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

export const Name = styled.p`
  font-weight: 500;
  font-size: 1rem;
  color: #351219;
`;
