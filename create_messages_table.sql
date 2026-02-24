-- Script de création de la table messages pour blog-chella
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  date DATETIME NOT NULL,
  replied TINYINT(1) DEFAULT 0,
  replyDate DATETIME NULL
);