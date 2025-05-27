require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para tratar JSON e dados do formulário
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ID da planilha
const SHEET_ID = '1BE3iGg6DkNEhnR9wlPDJX27n-sxLt8qswqtcaJGL_Pk';

app.post('/enviar', async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).send('Todos os campos são obrigatórios.');
  }

  try {
    const doc = new GoogleSpreadsheet(SHEET_ID);

    // Autenticação com a conta de serviço
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0]; // Primeira aba da planilha

    // Adiciona os dados na planilha
    await sheet.addRow({
      Nome: name,
      Email: email,
      Celular: phone
    });

    // Redireciona após sucesso
    res.redirect('https://novarisia.online/vcl2/');
  } catch (error) {
    console.error('Erro ao gravar na planilha:', error);
    res.status(500).send('Erro ao gravar na planilha.');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
