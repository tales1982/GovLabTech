"use client";

import styled from "styled-components";

const Button = styled.a`
  display: inline-block;
  min-width: 200px;
  text-align: center;
  padding: 12px 24px;
  background-color: #0070f3;
  color: #fff;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    background-color: #005ec2;
  }
`;


export default function DownloadButton() {
  return (
    <Button
      href="https://gd.lu/81NWKP"
      target="_blank"
      rel="noopener noreferrer"
      download
    >
      Baixar Arquivo Excel
    </Button>
  );
}
