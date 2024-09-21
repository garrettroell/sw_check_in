require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail({
  to,
  subject,
  text,
  html,
  attachments,
  isMonitoring = false,
}) {
  let msg = {
    to: isMonitoring ? process.env.GARRETTS_EMAIL : to,
    from: process.env.SENDING_EMAIL,
    subject: subject,
  };

  // Only add text or html if they are defined
  if (text) {
    msg.text = text;
  }
  if (html) {
    msg.html = html;
  }

  if (attachments) {
    msg.attachments = attachments;
  }

  sgMail
    .send(msg)
    .then(() => {
      if (isMonitoring) {
        console.log(`Monitoring email sent to ${process.env.GARRETTS_EMAIL}`);
      } else {
        console.log(`User email sent to ${to}`);
      }
    })
    .catch((error) => {
      console.error(`Error sending email: ${error}`);
    });
}

exports.sendEmail = sendEmail;
