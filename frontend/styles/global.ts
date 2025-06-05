// styles/global.ts
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Open Sans', sans-serif;
    background-color: #f5f7fa;
    color: #212529;
  }

  h1, h2, h3 {
    color: #003366; /* Azul institucional */
  }

  strong {
    color: #555;
  }
`;

export default GlobalStyle;
