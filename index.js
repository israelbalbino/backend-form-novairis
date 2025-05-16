require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/enviar', async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  // Configuração do transporte SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Conteúdo do e-mail
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // você mesmo
    subject: 'Novo formulário  - Novairis',
    text: `Nome: ${name}\nEmail: ${email}\nCelular: ${phone}`,
  };

  try {
    await transporter.sendMail(mailOptions);
      // Redirecionar para uma página externa
  res.redirect('https://istechsolucoesdigitais.online/vcl2/');
   
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).json({ error: 'Erro ao enviar email.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
