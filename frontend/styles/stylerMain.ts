"use client";

import styled from "styled-components";

export const Section = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-height: 100vh;
  background: beige;
`;

export const DivMain = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center; /* <- Alinha verticalmente */
  gap: 2rem;
  flex-wrap: wrap;
`;

