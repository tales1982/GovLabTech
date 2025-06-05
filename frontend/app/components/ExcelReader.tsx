"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import * as XLSX from "xlsx";
import styled from "styled-components";

const Container = styled.div`
  min-width: 300px;
  max-width: 500px;
  padding: 1.5rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #0070f3;
  margin-bottom: 1rem;
`;

const FileInput = styled.input`
  display: block;
  margin-bottom: 1rem;
`;

export default function ExcelReader() {
  const [data, setData] = useState<any[]>([]);
  const router = useRouter();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const jsonData = XLSX.utils.sheet_to_json(ws);
      setData(jsonData);

      // Salvar no localStorage ou contexto (opcional)
      sessionStorage.setItem("excelData", JSON.stringify(jsonData));


      // Redirecionar após carregar os dados
      router.push("/visualizar");
    };

    reader.readAsBinaryString(file);
  };

  return (
    <Container>
      <Title>Importar Arquivo Excel</Title>
      <FileInput type="file" accept=".xlsx, .xls" onChange={handleFile} />
    </Container>
  );
}
