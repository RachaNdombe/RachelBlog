# Portfolio Personnel - Rachel Ndombe

Un portfolio/blog personnel moderne et élégant avec un design sombre et des accents colorés, incluant un backend pour la gestion des messages.

## Aperçu

Ce portfolio présente :
- **Section Hero** - Présentation avec animations fluides
- **À propos** - Biographie et compétences
- **Projets** - Galerie de projets avec hover effects
- **Blog** - Articles récents
- **Contact** - Formulaire de contact avec validation

## Technologies utilisées

- HTML5 sémantique
- CSS3 (Variables CSS, Flexbox, Grid, Animations)
- JavaScript Vanilla (ES6+)
- Google Fonts (Playfair Display, Outfit)

## Fonctionnalités

- Design responsive (mobile-first)
- Curseur personnalisé (sur desktop)
- Animations au scroll
- Navigation fluide avec smooth scroll
- Menu mobile avec overlay
- Formulaire de contact avec validation
- Gestion des messages avec backend Node.js (envoi et réponse)
- Effets parallax sur les éléments du hero
- Thème sombre avec palette de couleurs cohérente

## Installation

1. Clonez ou téléchargez ce repository
2. Installez les dépendances : `npm install`
3. Configurez l'email dans `server.js` (remplacez `'YOUR_APP_PASSWORD'` par votre mot de passe d'application Gmail)
4. Lancez le serveur : `npm start`
5. Ouvrez `http://localhost:3000` dans votre navigateur
6. Pour accéder à l'admin des messages : `http://localhost:3000/admin`

## Personnalisation

### Modifier les couleurs

Les couleurs sont définies comme variables CSS dans `styles.css` :

```css
:root {
    --bg-primary: #0a0a0f;
    --accent-primary: #e8a87c;
    --accent-secondary: #c38d9e;
    --accent-tertiary: #41b3a3;
    /* ... */
}
```

### Ajouter des projets

Dans `index.html`, dupliquez une carte projet et modifiez le contenu :

```html
<article class="project-card">
    <div class="project-image">
        <div class="project-placeholder gradient-1">
            <span>N°</span>
        </div>
    </div>
    <div class="project-info">
        <span class="project-category">Catégorie</span>
        <h3>Titre du projet</h3>
        <p>Description du projet...</p>
        <div class="project-tech">
            <span>Tech 1</span>
            <span>Tech 2</span>
        </div>
    </div>
</article>
```

### Ajouter des articles de blog

Même principe que pour les projets - dupliquez une carte blog et personnalisez.

## Structure des fichiers

```
RachBlog/
├── index.html      # Structure HTML
├── styles.css      # Styles et animations
├── script.js       # Interactions JavaScript
└── README.md       # Documentation
```

## Prochaines étapes suggérées

1. **Ajouter vos images** - Remplacez les placeholders par vos vraies images
2. **Personnaliser le contenu** - Mettez à jour les textes avec vos informations
3. **Ajouter un CMS** - Pour gérer facilement les articles de blog
4. **Déployer** - Utilisez un service comme Heroku, Vercel ou un VPS pour le backend

## Licence

Ce projet est libre d'utilisation pour un usage personnel.

---

Créé avec ❤️ par Rachel Ndombe

