const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const axios = require('axios');

// Set up body parsing middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle form submission
app.post('/send-email', (req, res) => {
  const { name, email, phone, message } = req.body;
  const chatId = '@sophiathepromoter';
  const botToken = '6031687053:AAEzZ1dy3Z0Lxg4tl0VXm0a9NT2HJ_vpGog';
  const text = `New contact form submission:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`;

  // Send message to Telegram bot
  axios
    .post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: text,
    })
    .then(() => {
      console.log('Message sent to Telegram bot');
    })
    .catch((error) => {
      console.log('Error sending message to Telegram bot:', error.message);
    });

  // Create a transporter using your email service provider details
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'jd4946469@gmail.com',
      pass: 'nbtfuecckhgcltib',
    },
  });

  // Prepare the email message
  const mailOptions = {
    from: 'jd4946469@gmail.com',
    to: email,
    subject: 'Thank You for Contacting Us',
    text: `Dear ${name},\n\nThank you for contacting us. We appreciate your message.\n\nBest regards,\nYour Company`,
  };

  // Send the email to the user
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error occurred while sending the email to the user:', error);
    } else {
      console.log('Email sent to the user: ' + info.response);
    }
  });

  // Prepare the email message for the thank you message
  const thankYouMailOptions = {
    from: 'jd4946469@gmail.com',
    to: email,
    subject: 'Thank You for Contacting Us',
    text: `Dear ${name},\n\nThank you for contacting us. We appreciate your message and will get back to you shortly.\n\nBest regards,\nYour Company`,
  };

  // Send the thank you email to the user
  transporter.sendMail(thankYouMailOptions, (error, info) => {
    if (error) {
      console.log('Error occurred while sending the thank you email to the user:', error);
    } else {
      console.log('Thank you email sent to the user: ' + info.response);
    }
  });

  res.send('Thank you for contacting us. We will get back to you shortly.');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
