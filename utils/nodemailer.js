const nodemailer = require('nodemailer');


// Create a nodemailer transporter with your email service details
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'parthasarathi',
    pass: '588558',
  },
});

module.exports = transporter;