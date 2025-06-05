import { createGlobalStyle } from "styled-components";
import { theme } from "./themes";

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: sans-serif;
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

export default GlobalStyle;
