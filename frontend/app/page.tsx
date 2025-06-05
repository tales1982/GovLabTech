"use client";

import { Section, DivMain } from "@/styles/stylerMain";
import DownloadButton from "./components/DownloadButton";
import ExcelReader from "./components/ExcelReader";

export default function Home() {
  return (
    <Section>
      <DivMain>
        <DownloadButton />
        <ExcelReader />
      </DivMain>
    </Section>
  );
}
