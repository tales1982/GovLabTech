"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "../styles/themes";
import GlobalStyle from "../styles/global";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
