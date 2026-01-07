const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files

// Configure nodemailer (update with your email credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rachelndombe64@gmail.com', // Your email
    pass: 'kjcpyugzgqomywtq' // Use Gmail app password (no spaces)
  }
});

// Endpoint for contact form
app.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  // Send email to owner
  const mailOptions = {
    from: 'rachelndombe64@gmail.com',
    replyTo: email,
    to: 'rachelndombe64@gmail.com',
    subject: `Contact: ${subject}`,
    text: `From: ${name} (${email})\n\n${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    // Store message
    let messages = [];
    try {
      messages = JSON.parse(fs.readFileSync('messages.json', 'utf8'));
    } catch (e) {
      // File doesn't exist or empty
    }
    messages.push({ id: Date.now(), name, email, subject, message, date: new Date().toISOString() });
    fs.writeFileSync('messages.json', JSON.stringify(messages, null, 2));

    res.json({ success: true, message: 'Message sent successfully' });
  });
});

// Admin page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Get messages (for admin)
app.get('/messages', (req, res) => {
  let messages = [];
  try {
    messages = JSON.parse(fs.readFileSync('messages.json', 'utf8'));
  } catch (e) {}
  res.json(messages);
});

// Reply endpoint
app.post('/reply', (req, res) => {
  const { id, replyMessage } = req.body;

  let messages = [];
  try {
    messages = JSON.parse(fs.readFileSync('messages.json', 'utf8'));
  } catch (e) {}
  const msg = messages.find(m => m.id == id);
  if (!msg) return res.status(404).json({ error: 'Message not found' });

  const mailOptions = {
    from: 'rachelndombe64@gmail.com',
    to: msg.email,
    subject: `Re: ${msg.subject}`,
    text: replyMessage
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to send reply' });
    }

    // Mark as replied or add reply to storage
    msg.replied = true;
    msg.replyDate = new Date().toISOString();
    fs.writeFileSync('messages.json', JSON.stringify(messages, null, 2));

    res.json({ success: true });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));