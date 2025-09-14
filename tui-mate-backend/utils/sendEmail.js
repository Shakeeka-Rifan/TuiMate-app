const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'shakeekarifan2@gmail.com',
        pass: 'orqsemdomwlgrftl', // ✅ App password without spaces
      },
    });

    const mailOptions = {
      from: '"TuiMate Admin" <shakeekarifan2@gmail.com>',
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
  }
};

module.exports = sendEmail;
