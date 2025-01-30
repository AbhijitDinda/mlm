import nodemailer from "nodemailer";
import EmailDocument from "../email/EmailDocument";
import { getSettingInstance } from "../models/setting.model";

const sendMail = async ({
  email,
  subject,
  document,
}: {
  email: string;
  subject: string;
  document: string;
}) => {
  const setting = await getSettingInstance();
  const mail = setting.mail;
  if (!mail) throw new Error("Email settings have not configured");
  const { encryption, host, password, port, userName } = mail;
  const appName = setting.appName;

  const transporter = nodemailer.createTransport({
    port,
    host,
    auth: {
      user: userName,
      pass: password,
    },
    secure: encryption === "ssl",
  });
  const html = await EmailDocument(document);
  const mailOptions = {
    from: `${appName} ${userName}`,
    subject,
    html,
    to: email,
  };

  return transporter.sendMail(mailOptions);
};

export default sendMail;
