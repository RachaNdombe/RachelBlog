const express = require('express');
const session = require('express-session');


const app = express();
app.use(express.json()); // Doit être AVANT les routes qui utilisent req.body
app.use(session({
  secret: 'votre_secret_admin',
  resave: false,
  saveUninitialized: true
}));

// Connexion à la base MySQL
const mysql = require('mysql2');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // à adapter si besoin
  password: '', // à adapter si besoin
  database: 'blog-chella'
});
db.connect((err) => {
  if (err) {
    console.error('Erreur connexion MySQL:', err);
  } else {
    console.log('Connecté à MySQL blog-chella');
  }
});

// Route de login admin
app.post('/admin-login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM admin WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err) {
      console.error('Erreur requête admin:', err);
      return res.status(500).json({ success: false, error: 'Erreur serveur' });
    }
    if (results.length > 0) {
      req.session.isAdmin = true;
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
});

// Gestion globale des erreurs pour le debug
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

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


// Middleware pour protéger admin.html
app.get('/admin.html', (req, res, next) => {
  if (req.session && req.session.isAdmin) {
    res.sendFile(path.join(__dirname, 'admin.html'));
  } else {
    res.redirect('/admin-login.html');
  }
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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  setInterval(() => {
    console.log('Serveur toujours actif...');
  }, 5000);
});