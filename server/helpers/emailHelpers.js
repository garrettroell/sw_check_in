require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail({ text }) {
  const msg = {
    to: "garrettroell@gmail.com", // Change to your recipient
    from: "garrettroell@gmail.com", // Change to your verified sender
    subject: "Southwest Check In",
    text: text,
    // html: "<strong>We'll email you when you are officially checked in</strong>",
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}

exports.sendEmail = sendEmail;
