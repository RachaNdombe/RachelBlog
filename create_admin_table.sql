-- Script de création de la table admin pour blog-chella
CREATE TABLE IF NOT EXISTS admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

-- Ajout d'un utilisateur admin par défaut (mot de passe en clair pour test, à hasher en prod)
INSERT INTO admin (username, password) VALUES ('admin', 'admin123')
  ON DUPLICATE KEY UPDATE username=username;