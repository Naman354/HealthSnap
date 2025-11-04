import dotenv from "dotenv";
dotenv.config();
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const msg = {
      to,
      from: process.env.EMAIL_FROM,
      subject,
      text,
      html,
    };
    await sgMail.send(msg);
    console.log("Email sent successfully to:", to);
  } catch (error) {
    console.error("Error sending email:", error.response?.body || error);
    throw new Error("Email could not be sent");
  }
};
