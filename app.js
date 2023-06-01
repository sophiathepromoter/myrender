const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const axios = require('axios');
require('dotenv').config();

// Set up body parsing middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle form submission
app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const text = `New contact form submission:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;

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
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Prepare the email message
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
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
    from: process.env.EMAIL_ADDRESS,
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

  setTimeout(() => {
    res.send(`
      <script>
        window.location.href = '/';
      </script>
    `);
  }, 2000);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
