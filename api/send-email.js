const nodemailer = require('nodemailer');
const moment = require('moment');

module.exports = async (req, res) => {
  // Pasang header CORS
  res.setHeader('Access-Control-Allow-Origin', '*'); // Ganti * kalau mau lebih aman dengan domain frontend kamu
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    // Preflight request CORS
    return res.status(200).end();
  }

  const method = req.method;
  const data = method === 'POST' ? req.body : req.query;
  const { to, subject, text } = data;

  if (!to || !subject || !text) {
    return res.status(400).json({ status: false, message: 'to, subject, dan text wajib diisi' });
  }

  const blockedDomain = 'example.com';
  const emailDomain = to.split('@')[1]?.toLowerCase();
  if (emailDomain === blockedDomain) {
    return res.status(403).json({ status: false, message: 'Domain email "example.com" tidak diizinkan' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sender.dy@gmail.com',
      pass: 'feofnfmppbfmbtfb',
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      text,
    });

    res.status(200).json({
      status: true,
      message: 'Email berhasil dikirim',
      detail: {
        to,
        subject,
        sent_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      },
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Gagal mengirim email',
      error: err.message,
    });
  }
};
