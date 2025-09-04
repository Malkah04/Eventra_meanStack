import nodemailer from "nodemailer";

export async function sendTestEmail({
  from = process.env.APP_EMAIL,
  to = [],
  cc = [],
  bcc = [],
  subject = "Eventra",
  text = "",
  html = "",
  attachments = [],
} = {}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.APP_EMAIL, pass: process.env.APP_PASSWORD },
  });

  const info = await transporter.sendMail({ from: `"Eventra" <${from}>`, to, cc, bcc, subject, text, html, attachments });
  console.log("Message sent:", info.messageId);
}

export default sendTestEmail;
