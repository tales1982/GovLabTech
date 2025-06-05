const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());

const normalize = (str) =>
  str
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z\s]/gi, "")
    .replace(/\s+/g, " ")
    .trim();

// 📁 Leitura dos arquivos JSON
const deputadosData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "db", "deputados.json"))
);
const presencasData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "db", "presence_presence.json"))
);
const projetosData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "db", "leis_propostas.json"))
);

app.get("/deputado", (req, res) => {
  const nomeBusca = req.query.nome?.toLowerCase();
  if (!nomeBusca) return res.status(400).json({ error: "Nome é obrigatório" });

  const deputado = deputadosData.find((d) =>
    d.full_name.toLowerCase().includes(nomeBusca)
  );

  if (!deputado) {
    return res.status(404).json({ error: "Deputado não encontrado" });
  }

  const normalizedDeputy = normalize(deputado.full_name);

  // 📊 PRESENÇA
  const presencasDeputado = presencasData.filter((p) => {
    const fullNameFromPresence = normalize(`${p.firstname} ${p.name}`);
    return normalizedDeputy.includes(fullNameFromPresence);
  });

  const totalPresent = presencasDeputado.filter(
    (p) => p.meeting_presence === "PRESENT"
  ).length;

  const totalAbsent = presencasDeputado.filter(
    (p) => p.meeting_presence === "ABSENT"
  ).length;

  // 📊 PROJETOS DE LEI — contar todas as participações (inclusive coautoria)
  const projetosDeputado = projetosData.filter((p) => {
    const autores = normalize(p.law_authors || "");
    return autores.includes(normalizedDeputy);
  });

  const totalProjetos = projetosDeputado.length;
  const aprovados = projetosDeputado.filter((p) =>
    p.law_status?.toLowerCase().includes("publie")
  ).length;
  const rejeitados = projetosDeputado.filter((p) =>
    p.law_status?.toLowerCase().includes("rejete")
  ).length;
  const retirados = projetosDeputado.filter((p) =>
    p.law_status?.toLowerCase().includes("retire")
  ).length;
  const outros = projetosDeputado.filter(
    (p) =>
      !p.law_status?.toLowerCase().includes("publie") &&
      !p.law_status?.toLowerCase().includes("rejete") &&
      !p.law_status?.toLowerCase().includes("retire")
  ).length;

  res.json({
    ...deputado,
    presenca: {
      total_present: totalPresent,
      total_absent: totalAbsent,
    },
    projetos: {
      total: totalProjetos,
      aprovados,
      rejeitados,
      retirados,
      outros,
    },
    projetos_detalhes: projetosDeputado,
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
