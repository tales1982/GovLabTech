"use client";

import { useEffect, useState } from "react";

export default function VisualizarPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("excelData");
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  return (
    <main>
      <h1>Dados Importados</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
