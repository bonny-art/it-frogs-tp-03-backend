import nodemailer from "nodemailer";

const { META_PASSWORD, META_EMAIL, MAILTRAP_USER, MAILTRAP_PASS } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: META_EMAIL,
    pass: META_PASSWORD,
  },
  tls: { rejectUnauthorized: false },
};

// const nodemailerConfig = {
//   host: "sandbox.smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: MAILTRAP_USER,
//     pass: MAILTRAP_PASS,
//   },
// };

const transporter = nodemailer.createTransport(nodemailerConfig);

export const sendMail = async (data) => {
  const email = { ...data, from: META_EMAIL };
  await transporter.sendMail(email);
  return true;
};
