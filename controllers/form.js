const { sendEmailWithNodemailer } = require("../helpers/nodemailer");

exports.contactForm = async (req, res) => {
try {
    console.log(req.body);
  const { name, email, message } = req.body;

  const emailData = {
    from: email, 
    to: process.env.EMAIL_TO , 
    subject: "Website Contact Form",
    text: `Email received from contact from \n Sender name: ${name} \n Sender email: ${email} \n Sender message: ${message}`,
    html: `
        <h4>Email received from contact form:</h4>
        <p>Sender name: ${name}</p>
        <p>Sender email: ${email}</p>
        <p>Sender message: ${message}</p>
        <hr />
        <p>This email may contain sensitive information</p>
        <p>https://theprograd.com</p>
    `,
  };

  sendEmailWithNodemailer(req, res, emailData)
   
} catch (err) {
   console.error(err.message);
   res.status(500).send('Server error');
}
};


exports.contactBlogAuthorForm =async (req, res) => {
  try {
  const {authorEmail, name, email, message } = req.body;
  let mailList = [authorEmail, process.env.EMAIL_TO];

  const emailData = {
    from: process.env.EMAIL_TO, 
    to: mailList, 
    subject: `Someone messaged you from ${process.env.APP_NAME}`,
    text: `Email received from contact from \n Sender name: ${name} \n Sender email: ${email} \n Sender message: ${message}`,
    html: `
        <h4>Email received from contact form:</h4>
        <p>Sender name: ${name}</p>
        <p>Sender email: ${email}</p>
        <p>Sender message: ${message}</p>
        <hr />
        <p>This email may contain sensitive information</p>
        <p>https://theprograd.com</p>
    `,
  };

  sendEmailWithNodemailer(req, res, emailData);
  } catch (err) {
     console.error(err.message);
   res.status(500).send('Server error');
  }
};
