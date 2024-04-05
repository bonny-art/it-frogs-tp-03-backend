// import nodemailer from "nodemailer";

// const { META_PASSWORD, META_EMAIL } = process.env;

// const nodemailerConfig = {
//   host: "smtp.meta.ua",
//   port: 465,
//   secure: true,
//   auth: {
//     user: META_EMAIL,
//     pass: META_PASSWORD,
//   },
//   tls: { rejectUnauthorized: false },
// };

// const transporter = nodemailer.createTransport(nodemailerConfig);

// export const sendMail = async (data) => {
//   const email = { ...data, from: META_EMAIL };
//   await transporter.sendMail(email);
//   return true;
// };
