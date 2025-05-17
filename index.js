const express = require('express');
const bodyParser = require('body-parser');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require(`${process.env.CREDS}`); // substitua pelo nome correto do JSON

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const SHEET_ID = process.env.SHEET_ID; // copie o ID da URL da sua planilha

app.post('/enviar', async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).send('Todos os campos são obrigatórios.');
  }

  try {
    const doc = new GoogleSpreadsheet(SHEET_ID);
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0]; // primeira aba da planilha

    await sheet.addRow({ Nome: name, Email: email, Celular: phone });

    res.redirect('https://istechsolucoesdigitais.online/vcl2/');
  } catch (error) {
    console.error('Erro ao gravar na planilha:', error);
    res.status(500).send('Erro ao gravar na planilha.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
