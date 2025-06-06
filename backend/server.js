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
        .replace(/[̀-ͯ]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase()
    : '';
}

function generateNameVariations(lastname, firstname) {
  const variations = new Set();
  const full = `${firstname} ${lastname}`;
  variations.add(full);
  variations.add(`${lastname} ${firstname}`);
  variations.add(`madame ${full}`);
  variations.add(`monsieur ${full}`);
  variations.add(`${lastname}, ${firstname}`);
  variations.add(firstname);
  variations.add(lastname);
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

const dataPresence = readExcel(path.join(__dirname, "db", "107-presence-seance-publique.xlsx"));
const dataVotes = readExcel(path.join(__dirname, "db", "109-votes.xlsx"));
const dataLaws = readExcel(path.join(__dirname, "db", "112-texte-loi.xlsx"));

// =========================
// API
// =========================

const dataPhotos = JSON.parse(
  fs.readFileSync(path.join(__dirname, "db", "deputy-photos.json"), "utf-8")
);


function findPhotoUrl(firstname, lastname) {
  const fullName = normalize(`${firstname} ${lastname}`);
  const found = dataPhotos.find((p) => normalize(p.name) === fullName);
  return found ? found.img : null;
}



app.get("/deputy", (req, res) => {
  const searchName = req.query.name?.trim();
  if (!searchName) {
    return res.status(400).json({ error: "Name is required (use ?name=Lastname Firstname)" });
  }

  const parts = searchName.split(" ");
  const [firstName, ...rest] = parts;

  if (!firstName || rest.length === 0) {
    return res.status(400).json({ error: "Please provide both first name and last name" });
  }

  const lastName = rest.join(" ");
  const nameVariations = generateNameVariations(lastName, firstName);

  const matchedPresence = dataPresence.filter((row) => isDeputyMatch(row, nameVariations));

  if (matchedPresence.length === 0) {
    return res.status(404).json({ error: "Deputy not found" });
  }

  const ref = matchedPresence.find((r) => r.political_party || r.political_group);
  const party = ref?.political_party || "Not informed";
  const group = ref?.political_group;

  const presenceStats = {
    present: 0,
    excused: 0,
    foreign_mission: 0,
    absent: 0,
  };

  matchedPresence.forEach((r) => {
    const s = normalize(r.meeting_presence);
    if (presenceStats[s] !== undefined) presenceStats[s]++;
  });

  const matchedVotes = dataVotes.filter((row) => isDeputyMatch(row, nameVariations));
  const voteStats = matchedVotes.reduce(
    (acc, v) => {
      const res = normalize(v.vote_result);
      if (res === "oui") acc.oui++;
      else if (res === "non") acc.non++;
      else if (res === "abstention") acc.abstention++;
      return acc;
    },
    { oui: 0, non: 0, abstention: 0 }
  );

  const matchedLaws = dataLaws.filter((row) => {
    const authors = normalize(row.law_authors || "");
    return nameVariations.some((v) => authors.includes(v));
  });

  res.json({
    name: lastName,
    firstname: firstName,
    political_group: group,
    political_party: party,
    presence: {
      total: matchedPresence.length,
      status: presenceStats,
      sessions: matchedPresence.map((p) => ({
        date: p.meeting_date,
        session: p.meeting_number,
        status: p.meeting_presence,
      })),
    },
    laws: {
      total: matchedLaws.length,
      details: matchedLaws.map((p) => ({
        title: p.law_title,
        status: p.law_status,
        authors: p.law_authors,
      })),
    },
    votes: {
      total: matchedVotes.length,
      stats: voteStats,
      details: matchedVotes.map((v) => ({
        date: v.meeting_date,
        vote_name: v.vote_name,
        result: v.vote_result,
      })),
    },
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
