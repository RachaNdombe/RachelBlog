// ====================================
// Rachel Ndombe Portfolio - JavaScript
// ====================================

const SKILLS_DATA = {
    fullstack: {
        title: 'Fullstack Development',
        icon: 'bi-code-slash',
        description: 'Conception et développement d\'applications web complètes, de l\'interface utilisateur aux APIs backend sécurisées.',
        level: 80,
        technologies: ['PHP', 'Laravel', 'JavaScript', 'AngularJS', 'TypeScript', 'AdonisJS', 'HTML5', 'CSS3', 'Bootstrap', 'Tailwind CSS'],
        achievements: [
            'Développement d\'applications web de gestion',
            'Systèmes d\'authentification JWT',
            'APIs REST sécurisées',
            'Intégration Frontend / Backend',
            'Applications de suivi et reporting',
            'Développement d\'interfaces responsives'
        ]
    },
    'cloud-computing': {
        title: 'Cloud Computing',
        icon: 'bi-cloud-arrow-up',
        description: 'Maîtrise des fondamentaux du cloud, de l\'architecture aux déploiements applicatifs et à la supervision.',
        level: 70,
        technologies: ['AWS Cloud Fundamentals', 'Architecture Cloud', 'Virtualisation', 'Services Cloud', 'Déploiement d\'applications', 'Monitoring et supervision'],
        achievements: [
            'Déploiement de sites web sur AWS',
            'Configuration CloudFront',
            'Utilisation d\'API Gateway',
            'Déploiement Serverless avec Lambda',
            'Hébergement de sites statiques sur S3'
        ]
    },
    linux: {
        title: 'Linux System Administration',
        icon: 'bi-terminal',
        description: 'Administration de serveurs Linux, gestion des utilisateurs, automatisation et surveillance des systèmes.',
        level: 70,
        technologies: ['Linux (installation & graphique, hyperviseurs)', 'Gestion des utilisateurs', 'Permissions Linux', 'Bash Scripting', 'Gestion des services'],
        achievements: [
            'Configuration de serveurs Linux',
            'Administration système',
            'Gestion des processus',
            'Surveillance système',
            'Automatisation de tâches'
        ]
    },
    cybersecurity: {
        title: 'Networking & Cybersecurity',
        icon: 'bi-shield-lock',
        description: 'Sécurisation des infrastructures, analyse réseau et application des bonnes pratiques de cybersécurité.',
        level: 70,
        technologies: ['TCP/IP', 'DNS', 'DHCP', 'VPN', 'Firewall', 'Sécurité réseau', 'Analyse des vulnérabilités', 'Contrôle d\'accès'],
        achievements: [
            'Analyse de trafic réseau',
            'Configuration réseau',
            'Études de cybersécurité',
            'Application du principe du moindre privilège',
            'Sensibilisation à la sécurité informatique'
        ]
    },
    aws: {
        title: 'Cloud (AWS)',
        icon: 'bi-cloud-check',
        description: 'Conception et déploiement de solutions sur Amazon Web Services, de l\'hébergement à l\'architecture serverless.',
        level: 70,
        technologies: ['EC2', 'S3', 'IAM', 'Lambda', 'API Gateway', 'CloudFront', 'Elastic Beanstalk', 'CloudWatch'],
        achievements: [
            'Déploiement WordPress avec Beanstalk',
            'Architecture Serverless',
            'Distribution CloudFront',
            'Gestion des accès IAM',
            'Hébergement d\'applications web'
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Gestion du login admin (toujours prioritaire)
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMsg = document.getElementById('login-error');
            errorMsg.textContent = '';

            try {
                const response = await fetch('/admin-login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
                const result = await response.json();
                if (result.success) {
                    window.location.href = 'admin.html';
                } else {
                    errorMsg.textContent = 'Identifiants incorrects';
                }
            } catch (err) {
                errorMsg.textContent = 'Erreur serveur';
            }
        });
    }

    initCustomCursor();
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initActiveNavLink();
    initContactForm();
    initSkillModals();
});

// ====================================
// Skill Modals
// ====================================
function initSkillModals() {
    const modal = document.getElementById('skillModal');
    const skillButtons = document.querySelectorAll('.skill-item[data-skill]');

    if (!modal || !skillButtons.length) return;

    const titleEl = document.getElementById('skillModalTitle');
    const descEl = document.getElementById('skillModalDesc');
    const iconEl = document.querySelector('#skillModalIcon i');
    const levelEl = document.getElementById('skillModalLevel');
    const levelBar = document.getElementById('skillModalLevelBar');
    const techEl = document.getElementById('skillModalTech');
    const achievementsEl = document.getElementById('skillModalAchievements');
    const ctaEl = document.getElementById('skillModalCta');

    function openSkillModal(skillId) {
        const data = SKILLS_DATA[skillId];
        if (!data) return;

        titleEl.textContent = data.title;
        descEl.textContent = data.description;
        iconEl.className = `bi ${data.icon}`;
        levelEl.textContent = `${data.level}%`;
        levelBar.style.width = '0';

        techEl.innerHTML = data.technologies.map(t => `<li>${t}</li>`).join('');
        achievementsEl.innerHTML = data.achievements.map(a => `<li>${a}</li>`).join('');

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        requestAnimationFrame(() => {
            levelBar.style.width = `${data.level}%`;
        });
    }

    function closeSkillModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        levelBar.style.width = '0';
    }

    skillButtons.forEach(btn => {
        btn.addEventListener('click', () => openSkillModal(btn.dataset.skill));
    });

    modal.querySelectorAll('[data-close-modal]').forEach(el => {
        el.addEventListener('click', closeSkillModal);
    });

    ctaEl.addEventListener('click', closeSkillModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeSkillModal();
        }
    });
}

// ====================================
// Custom Cursor
// ====================================
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (!cursor || !follower) return;
    
    // Check if device has fine pointer (mouse)
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        cursor.style.display = 'none';
        follower.style.display = 'none';
        return;
    }
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor animation
    function animateCursor() {
        // Cursor follows mouse instantly
        cursorX = mouseX;
        cursorY = mouseY;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        // Follower follows with delay
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Cursor interactions
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .blog-card, .skill-item');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
            follower.style.borderColor = 'var(--accent-secondary)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            follower.style.transform = 'translate(-50%, -50%) scale(1)';
            follower.style.borderColor = 'var(--accent-primary)';
        });
    });
}

// ====================================
// Navbar Scroll Effect
// ====================================
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class when scrolling down
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ====================================
// Mobile Menu
// ====================================
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.navbar .nav-links');

    if (!menuToggle || !navLinks) return;

    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    mobileNav.setAttribute('aria-hidden', 'true');
    mobileNav.innerHTML = `
        <div class="mobile-nav-header">
            <a href="#accueil" class="logo">R<span class="logo-dot">.</span>N</a>
            <div class="mobile-nav-actions">
                <button type="button" class="mobile-nav-close" aria-label="Fermer le menu">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
                <a href="#contact" class="mobile-nav-cta">Me contacter</a>
            </div>
        </div>
    `;

    const mobileNavBody = document.createElement('nav');
    mobileNavBody.className = 'mobile-nav-body';
    mobileNavBody.innerHTML = navLinks.outerHTML;

    const mobileNavList = mobileNavBody.querySelector('.nav-links');
    if (mobileNavList) {
        mobileNavList.classList.remove('nav-links');
        mobileNavList.classList.add('mobile-nav-links');
    }

    mobileNav.appendChild(mobileNavBody);
    document.body.appendChild(mobileNav);

    const closeBtn = mobileNav.querySelector('.mobile-nav-close');
    const mobileNavLinks = mobileNav.querySelectorAll('.nav-link');
    const mobileNavLogo = mobileNav.querySelector('.mobile-nav-header .logo');
    const mobileNavCta = mobileNav.querySelector('.mobile-nav-cta');

    function closeMobileNav() {
        mobileNav.classList.remove('active');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function openMobileNav() {
        mobileNav.classList.add('active');
        mobileNav.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    menuToggle.addEventListener('click', openMobileNav);
    closeBtn.addEventListener('click', closeMobileNav);

    [...mobileNavLinks, mobileNavLogo, mobileNavCta].forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMobileNav();
        }
    });
}

// ====================================
// Smooth Scroll
// ====================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (!target) return;
            
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// ====================================
// Scroll Animations
// ====================================
function initScrollAnimations() {
    // Elements to animate
    const animateElements = document.querySelectorAll(
        '.section-header, .about-image, .about-content, .project-card, .cert-card, .certifications-cta, .blog-card, .contact-info, .contact-form, .skill-item'
    );
    
    // Add fade-in class
    animateElements.forEach((el, index) => {
        el.classList.add('fade-in');
        // Add stagger class for grouped elements
        if (el.classList.contains('skill-item') || el.classList.contains('project-card') || el.classList.contains('cert-card') || el.classList.contains('blog-card')) {
            el.classList.add(`stagger-${(index % 4) + 1}`);
        }
    });
    
    // Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animateElements.forEach(el => observer.observe(el));
}

// ====================================
// Active Nav Link on Scroll
// ====================================
function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!sections.length || !navLinks.length) return;
    
    function updateActiveLink() {
        const scrollPosition = window.pageYOffset + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Initial check
}

// ====================================
// Contact Form
// ====================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.name || !data.email || !data.subject || !data.message) {
            showNotification('Veuillez remplir tous les champs.', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Veuillez entrer une adresse email valide.', 'error');
            return;
        }
        
        // Get submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span>Envoi en cours...</span>';
        submitBtn.disabled = true;
        
        try {
            // Send to backend
            const response = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (response.ok && result.success) {
                showNotification('Message envoyé avec succès ! Je vous répondrai bientôt.', 'success');
                form.reset();
            } else {
                throw new Error(result.error || 'Erreur lors de l\'envoi');
            }
        } catch (error) {
            showNotification('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ====================================
// Notification System
// ====================================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Style the notification
    // Layout handled by .notification in styles.css
    
    // Type-specific styles
    if (type === 'success') {
        notification.style.background = 'var(--accent-tertiary)';
        notification.style.color = 'var(--bg-primary)';
    } else if (type === 'error') {
        notification.style.background = '#e27d60';
        notification.style.color = 'var(--bg-primary)';
    } else {
        notification.style.background = 'var(--accent-primary)';
        notification.style.color = 'var(--bg-primary)';
    }
    
    // Close button styles
    const closeBtn = notification.querySelector('.notification-close');
    Object.assign(closeBtn.style, {
        background: 'none',
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer',
        color: 'inherit',
        opacity: '0.8'
    });
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Close functionality
    const closeNotification = () => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    };
    
    closeBtn.addEventListener('click', closeNotification);
    
    // Auto close after 5 seconds
    setTimeout(closeNotification, 5000);
}

// ====================================
// Parallax Effect for Hero Orbs
// ====================================
(function initParallax() {
    const orbs = document.querySelectorAll('.gradient-orb');
    
    if (!orbs.length) return;
    
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX - window.innerWidth / 2) / 50;
        const y = (e.clientY - window.innerHeight / 2) / 50;
        
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.5;
            orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });
})();

// ====================================
// Typing Effect (Optional - for hero)
// ====================================
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ====================================
// Utility: Debounce
// ====================================
function debounce(func, wait = 20) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ====================================
// Utility: Throttle
// ====================================
function throttle(func, limit = 100) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

