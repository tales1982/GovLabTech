# 🇱🇺 GovLabTech Hackathon – Project DevCity

🚀 **Civic Tech Platform for Legislative Transparency in Luxembourg**

[![Next.js](https://img.shields.io/badge/Next.js-React--Framework-blue)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-green)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)](https://www.postgresql.org/)
[![Hackathon](https://img.shields.io/badge/Hackathon-2025-lightgrey)]()

---

## 🔍 Problem Tackled

Luxembourgish citizens face limited and unintuitive access to their parliamentary representatives' performance. Our challenge was to transform raw legislative data into a **user-friendly, visually engaging, and insightful experience**, fostering **transparency**, **civic engagement**, and **public trust**.

---

## 💡 Our Solution

We built an **interactive web platform** that allows users to search for any deputy in the Luxembourg Parliament and view, in a clear and structured way:

- ✅ Attendance in public sessions
- 🗳️ Full voting history (Yes / No / Abstentions)
- 📜 Authored or co-authored legislation
- 🧑‍💼 Contact info, political party and group
- 🖼️ Photo and parliamentary details

This approach makes it easier for any citizen to **assess real political performance**.

[GovTech Lab](https://govtechlab.vercel.app/)

---

## 🛠️ Technologies Used

**Frontend:**
- React (Next.js)
- Styled-Components
- Responsive CSS with Dark Mode

**Backend:**
- Node.js with Express
- XLSX parsing for spreadsheet data
- RESTful API for filtered queries

**Other:**
- Integrated public datasets from the Chamber of Deputies
- Modular layout optimized for performance

---

## 🧪 Key Features

- 🔍 Smart name search with linguistic variations (e.g., “Monsieur”, “Madame”)
- 📊 Charts and dashboards (coming in future version)
- 📂 Filtering by party or session type
- 📅 Interface built on Agile sprints during the hackathon

---

## ⚙️ Agile Methodology

We adopted a **hybrid Agile workflow**, combining both **Kanban** and **Scrum** practices, to maximize productivity and collaboration during the 48-hour hackathon.

### 🧭 Sprints Overview

- **Sprint 1**: Data exploration, repo setup, architecture planning
- **Sprint 2**: Initial backend pipeline + basic frontend layout
- **Sprint 3**: API core and basic visualization
- **Sprint 4**: UX refinement and basic validation
- **Sprint 5**: Final MVP + pitch preparation
- **Sprint 6**: Slide deck and live demo structure
- **Sprint 7**: Final bugfixing and rehearsal

### 📋 Kanban Board

| Backlog | To Do | Doing | Review/Test | Done ✅ |
|--------|-------|-------|-------------|--------|

Used to manage tasks like:
- Civic problem definition
- Dataset selection
- Building backend endpoints
- Creating UI with React
- Integrating filters and visuals
- Writing pitch and storytelling
- Running demo and dry-run

---

## 🗂️ Datasets Used

All datasets were sourced from the official Luxembourg open data portal: [data.public.lu](https://data.public.lu/)

- `105-depute.xlsx` – Official list of deputies
- `107-presence-seance-publique.xlsx` – Attendance records for public sessions
- `109-votes.xlsx` – Voting records
- `112-texte-loi.xlsx` – Legislative texts proposed or passed
- `deputy-photos.json` – Official deputy photos (custom compiled)

---

## 🎯 Social Impact

This solution empowers citizens to engage with political processes, increases pressure for transparent governance, and serves as a model for **open government** and **open data** initiatives globally.

---

## 🧑‍🤝‍🧑 Team DevCity

- **Tales** – Full Stack Developer  
- **Sandro** – Front-end Developer  
- **Andre** – Product Owner  
- **Filipe** – Quality Assurance & Tester  

---

## 🗓️ Event

**GovLabTech Hackathon – Luxembourg 🇱🇺**  
📅 **Date:** June 5–6, 2025  
📍 **Location:** Luxembourg  

This project was conceived, designed, developed, and presented within 48 hours of intense interdisciplinary collaboration.

---

## 📌 How to Run Locally

```bash
# Backend
cd backend
yarn install
yarn start

# Frontend
cd frontend
yarn install
yarn dev
```

> Ensure that `.xlsx` files are placed in the `/db` folder and structured as expected by the server.

---

## 📢 Want to Contribute?

We welcome ideas, feedback, and future collaboration. This project is a **functional prototype with high expansion potential** — adaptable for other countries or public sectors.

---
