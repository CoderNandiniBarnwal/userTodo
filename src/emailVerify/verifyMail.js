import nodemailer from "nodemailer";
import dotenv from "dotenv/config";

export const verifyEmail = async (token, email) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.mailUser,
      pass: process.env.mailPass,
    },
  });

  const mailConfiguration = {
    from: process.env.mailUser,
    to: email,
    subject: "Verification",
    text: `verify yourself ${token}`,
  };

  transport.sendMail(mailConfiguration, function (error, info) {
    if (error) {
      console.error("Email cannot sent!", error);
      throw new Error(error)
    }
    console.log("Email send successfully!");
    console.log(info);
  });
};
