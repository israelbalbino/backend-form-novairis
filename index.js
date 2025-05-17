require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const SHEET_ID = '1BE3iGg6DkNEhnR9wlPDJX27n-sxLt8qswqtcaJGL_Pk';

app.post('/enviar', async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).send('Todos os campos são obrigatórios.');
  }

  try {
    const doc = new GoogleSpreadsheet(SHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

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
