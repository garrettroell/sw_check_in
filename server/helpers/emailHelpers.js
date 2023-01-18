require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendMonitoringEmail({ subject, text, attachments }) {
  let msg;
  if (attachments) {
    msg = {
      to: process.env.GARRETTS_EMAIL,
      from: process.env.SENDING_EMAIL,
      subject: subject,
      text: text,
      attachments: attachments,
    };
  } else {
    msg = {
      to: process.env.GARRETTS_EMAIL,
      from: process.env.SENDING_EMAIL,
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

async function sendUserEmail({ userEmail, subject, html, attachments }) {
  let msg;
  if (attachments) {
    msg = {
      to: userEmail, // Change to your recipient
      from: process.env.SENDING_EMAIL,
      subject: subject,
      html: html,
      // text: text,

      attachments: attachments,
    };
  } else {
    msg = {
      to: userEmail, // Change to your recipient
      from: process.env.SENDING_EMAIL,
      subject: subject,
      text: text,
    };
  }

  sgMail
    .send(msg)
    .then(() => {
      console.log(`User email sent to ${userEmail}`);
    })
    .catch((error) => {
      console.error(error);
    });
}

exports.sendMonitoringEmail = sendMonitoringEmail;
exports.sendUserEmail = sendUserEmail;
