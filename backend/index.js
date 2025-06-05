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
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-z\s]/gi, "") // remove pontuação
    .replace(/\s+/g, " ") // normaliza espaços
    .trim();

const deputadosData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "db", "deputados.json"))
);
const presencasData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "db", "presence_presence.json"))
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

  res.json({
    ...deputado,
    presenca: {
      total_present: totalPresent,
      total_absent: totalAbsent,
    },
  });
});

app.listen(3001, () => {
  console.log("Servidor rodando em http://localhost:3001");
});
