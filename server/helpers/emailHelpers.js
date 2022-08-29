require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendMonitoringEmail({ subject, text, attachments }) {
  let msg;
  if (attachments) {
    msg = {
      to: "garrettroell@gmail.com", // Change to your recipient
      from: "garrettroell@gmail.com", // Change to your verified sender
      subject: subject,
      text: text,
      attachments: attachments,
    };
  } else {
    msg = {
      to: "garrettroell@gmail.com", // Change to your recipient
      from: "garrettroell@gmail.com", // Change to your verified sender
      subject: subject,
      text: text,
    };
  }

  sgMail
    .send(msg)
    .then(() => {
      //
    })
    .catch((error) => {
      console.error(error);
    });
}

async function sendUserEmail({ userEmail, subject, text, attachments }) {
  let msg;
  if (attachments) {
    msg = {
      to: userEmail, // Change to your recipient
      from: "garrettroell@gmail.com", // Change to your verified sender
      subject: subject,
      text: text,
      attachments: attachments,
    };
  } else {
    msg = {
      to: userEmail, // Change to your recipient
      from: "garrettroell@gmail.com", // Change to your verified sender
      subject: subject,
      text: text,
    };
  }

  sgMail
    .send(msg)
    .then(() => {
      //
    })
    .catch((error) => {
      console.error(error);
    });
}

exports.sendMonitoringEmail = sendMonitoringEmail;
exports.sendUserEmail = sendUserEmail;
