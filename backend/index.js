const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const app = express();
app.use(cors());

// =========================
// UTILS
// =========================

function readExcel(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });
}

function normalize(str) {
  return str
    ? str
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase()
    : '';
}

function generateNameVariations(name, firstname) {
  const variations = new Set();
  const full = `${firstname} ${name}`;
  variations.add(full);
  variations.add(`${name} ${firstname}`);
  variations.add(`madame ${full}`);
  variations.add(`monsieur ${full}`);
  variations.add(`${name}, ${firstname}`);
  variations.add(firstname);
  variations.add(name);
  return Array.from(variations).map(normalize);
}

function isDeputyMatch(row, nameVariations) {
  const rowName = normalize(row.name);
  const rowFirst = normalize(row.firstname);
  const fullName = normalize(`${rowFirst} ${rowName}`);
  return nameVariations.some(
    (v) =>
      rowName.includes(v) || rowFirst.includes(v) || fullName.includes(v)
  );
}

// =========================
// LOAD DATA
// =========================

const data107 = readExcel(path.join(__dirname, "db", "107-presence-seance-publique.xlsx"));
const data109 = readExcel(path.join(__dirname, "db", "109-votes.xlsx"));
const data112 = readExcel(path.join(__dirname, "db", "112-texte-loi.xlsx"));

// =========================
// API
// =========================

app.get("/deputado", (req, res) => {
  const nomeBusca = req.query.nome?.trim();
  if (!nomeBusca) return res.status(400).json({ error: "Name is required (use ?nome=Lastname Firstname)" });

  const partes = nomeBusca.split(" ");
  const [firstName, ...rest] = partes;
  const lastName = rest.join(" ") || firstName;

  const nameVariations = generateNameVariations(lastName, firstName);

  const registrosDeputado = data107.filter((row) => isDeputyMatch(row, nameVariations));

  if (registrosDeputado.length === 0) {
    return res.status(404).json({ error: "Deputy not found" });
  }

  const ref = registrosDeputado.find((r) => r.political_party || r.political_group);
  const partido = ref?.political_party || "Not informed";
  const grupo = ref?.political_group;

  const statusContagem = {
    present: 0,
    excused: 0,
    foreign_mission: 0,
    absent: 0,
  };

  registrosDeputado.forEach((r) => {
    const s = normalize(r.meeting_presence);
    if (statusContagem[s] !== undefined) statusContagem[s]++;
  });

  const votos = data109.filter((row) => isDeputyMatch(row, nameVariations));
  const votosStats = votos.reduce(
    (acc, v) => {
      const res = normalize(v.vote_result);
      if (res === "oui") acc.oui++;
      else if (res === "non") acc.non++;
      else if (res === "abstention") acc.abstention++;
      return acc;
    },
    { oui: 0, non: 0, abstention: 0 }
  );

  const projetos = data112.filter((row) => {
    const authors = normalize(row.law_authors || "");
    return nameVariations.some((v) => authors.includes(v));
  });

  res.json({
    deputado: `${firstName} ${lastName}`,
    grupo_politico: grupo,
    partido: partido,
    presencas: {
      total: registrosDeputado.length,
      status: statusContagem,
      sessoes: registrosDeputado.map((p) => ({
        data: p.meeting_date,
        sessao: p.meeting_number,
        status: p.meeting_presence,
      })),
    },
    projetos: {
      total: projetos.length,
      detalhes: projetos.map((p) => ({
        titulo: p.law_title,
        status: p.law_status,
        autores: p.law_authors,
      })),
    },
    votos: {
      total: votos.length,
      stats: votosStats,
      detalhes: votos.map((v) => ({
        data: v.meeting_date,
        votacao: v.vote_name,
        resultado: v.vote_result,
      })),
    },
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
