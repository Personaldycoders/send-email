const nodemailer = require('nodemailer');
const moment = require('moment');
module.exports = async (req, res) => {
  const method = req.method;

  const data = method === 'POST'
    ? req.body
    : req.query;

  const { to, subject, text } = data;

  if (!to || !subject || !text) {
    return res.status(400).json({ status: false, message: 'to, subject, dan text wajib diisi' });
  }

  // Cek kalau email tujuan domain example.com
  const blockedDomain = 'example.com';
  const emailDomain = to.split('@')[1]?.toLowerCase();
  if (emailDomain === blockedDomain) {
    return res.status(403).json({ status: false, message: 'Domain email "example.com" tidak diizinkan' });
  }
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sender.dy@gmail.com',
    pass: 'feofnfmppbfmbtfb' // app password
  }
});

  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      text
    });

   res.status(200).json({
    status: true,
    message: 'Email berhasil dikirim',
    detail: {
      to,
      subject,
      sent_at: moment().format('YYYY-MM-DD HH:mm:ss') // atau pakai new Date().toISOString()
    }
  });
} catch (err) {
  res.status(500).json({
    status: false,
    message: 'Gagal mengirim email',
    error: err.message
  });
}};