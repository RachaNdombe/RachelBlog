require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2');
const { google } = require('googleapis');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev_session_secret_change_me';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'blog-chella';
const MAIL_USER = process.env.MAIL_USER || 'rachelndombe64@gmail.com';

const oauth2Client = new google.auth.OAuth2(
  process.env.OAUTH_CLIENT_ID,
  process.env.OAUTH_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
  refresh_token: process.env.OAUTH_REFRESH_TOKEN
});

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

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

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

app.use(cors());
app.use(express.static('.'));

function buildRawEmail(from, to, replyTo, subject, message) {
  const emailLines = [
    `From: ${from}`,
    `To: ${to}`,
    `Reply-To: ${replyTo}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset=utf-8',
    '',
    message
  ];
  return Buffer.from(emailLines.join('\n'))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

app.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  const emailContent = `From: ${name} (${email})\n\n${message}`;
  const raw = buildRawEmail(MAIL_USER, MAIL_USER, email, `Contact: ${subject}`, emailContent);

  gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw }
  })
  .then(() => {
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
  })
  .catch((err) => {
    console.error('Erreur API Gmail:', err);
    return res.status(500).json({ error: 'Failed to send email via API' });
  });
});

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
    const raw = buildRawEmail(MAIL_USER, msg.email, MAIL_USER, `Re: ${msg.subject}`, replyMessage);

    gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw }
    })
    .then(() => {
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
    })
    .catch((err) => {
      console.error('Erreur API Gmail (Reply):', err);
      return res.status(500).json({ error: 'Failed to send reply' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
