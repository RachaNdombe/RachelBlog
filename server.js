const express = require('express');
const session = require('express-session');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev_session_secret_change_me';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'blog-chella';
const MAIL_USER = process.env.MAIL_USER || 'rachelndombe64@gmail.com';
const MAIL_PASS = process.env.MAIL_PASS || 'kjcpyugzgqomywtq';

app.use(express.json()); // Doit être AVANT les routes qui utilisent req.body
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Connexion à la base MySQL
const db = mysql.createConnection({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME
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

app.post('/admin-login-form', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM admin WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err) {
      console.error('Erreur requête admin (form):', err);
      return res.redirect('/admin-login.html?error=1');
    }
    if (results.length > 0) {
      req.session.isAdmin = true;
      return res.redirect('/admin.html');
    }
    return res.redirect('/admin-login.html?error=1');
  });
});

function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  return res.status(401).json({ success: false, error: 'Unauthorized' });
}

// Gestion globale des erreurs pour le debug
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

app.use(cors());
app.use(express.static('.')); // Serve static files

// Configure nodemailer (update with your email credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS
  }
});

// Endpoint for contact form
app.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  // Send email to owner
  const mailOptions = {
    from: MAIL_USER,
    replyTo: email,
    to: MAIL_USER,
    subject: `Contact: ${subject}`,
    text: `From: ${name} (${email})\n\n${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    db.query(
      'INSERT INTO messages (name, email, subject, message, date, replied) VALUES (?, ?, ?, ?, NOW(), 0)',
      [name, email, subject, message],
      (dbErr) => {
        if (dbErr) {
          console.error('Erreur insertion message:', dbErr);
          return res.status(500).json({ error: 'Failed to store message' });
        }
        return res.json({ success: true, message: 'Message sent successfully' });
      }
    );
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

app.get('/admin', (req, res) => {
  if (req.session && req.session.isAdmin) {
    return res.redirect('/admin.html');
  }
  return res.redirect('/admin-login.html');
});

// Get messages (for admin)
app.get('/messages', requireAdmin, (req, res) => {
  db.query(
    'SELECT id, name, email, subject, message, date, replied, replyDate FROM messages ORDER BY date DESC',
    (err, results) => {
      if (err) {
        console.error('Erreur lecture messages:', err);
        return res.status(500).json({ success: false, error: 'Erreur serveur' });
      }
      return res.json(results);
    }
  );
});

// Reply endpoint
app.post('/reply', requireAdmin, (req, res) => {
  const { id, replyMessage } = req.body;
  db.query('SELECT id, email, subject FROM messages WHERE id = ?', [id], (findErr, findRows) => {
    if (findErr) {
      console.error('Erreur recherche message:', findErr);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    if (!findRows.length) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const msg = findRows[0];
    const mailOptions = {
      from: MAIL_USER,
      to: msg.email,
      subject: `Re: ${msg.subject}`,
      text: replyMessage
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to send reply' });
      }

      db.query(
        'UPDATE messages SET replied = 1, replyDate = NOW() WHERE id = ?',
        [id],
        (updateErr) => {
          if (updateErr) {
            console.error('Erreur update reply:', updateErr);
            return res.status(500).json({ error: 'Failed to update message' });
          }
          return res.json({ success: true });
        }
      );
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  setInterval(() => {
    console.log('Serveur toujours actif...');
  }, 5000);
});