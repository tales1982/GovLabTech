const express = require('express');
const app = express();
const port = 3001;

app.get('/deputado', (req, res) => {
  const nome = req.query.nome;
  res.json({ nome, partido: 'Exemplo', idade: 50 });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
