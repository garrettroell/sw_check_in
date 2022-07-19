require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail({ subject, text, attachments }) {
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

exports.sendEmail = sendEmail;
