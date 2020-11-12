const nodeMailer = require("nodemailer");

exports.sendEmailWithNodemailer = (req, res, emailData) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
        auth: {
            user: "theprograds@gmail.com",
            pass: process.env.PASS
    },
         tls: {
      ciphers: "SSLv3",
    },
  });

  return transporter
    .sendMail(emailData)
    .then((info) => {
      console.log(`Message sent: ${info.response}`);
      return res.json({
        success: 'Message sent successfully',
      });
    })
    .catch((err) => console.log(`Problem sending email: ${err}`));
};