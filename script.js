// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Download CV functionality
const downloadCvLink = document.getElementById('downloadCV');
if (downloadCvLink) {
    downloadCvLink.setAttribute('href', 'QA CV.pdf');
    downloadCvLink.setAttribute('download', 'QA CV.pdf');
}

// Smooth scroll navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Active nav indicator on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 250) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.style.color = 'var(--text-primary)';
        if (link.getAttribute('href').slice(1) === current) {
            link.style.color = 'var(--secondary)';
        }
    });
});

// Experience toggle interaction
const experienceCards = document.querySelectorAll('.experience-toggle');

experienceCards.forEach(card => {
    const description = document.createElement('div');
    description.className = 'experience-description';
    description.textContent = card.dataset.description || 'No description available.';
    card.appendChild(description);

    card.addEventListener('click', () => {
        const isOpen = card.classList.contains('active');
        experienceCards.forEach(item => item.classList.remove('active'));
        if (!isOpen) {
            card.classList.add('active');
        }
    });
});

// Skill details interaction
const skillDetail = document.getElementById('skillDetail');
const skillName = document.getElementById('skillName');
const skillDescription = document.getElementById('skillDescription');

const setSkillDetail = (button) => {
    if (!button || !skillName || !skillDescription) return;

    const name = button.dataset.skill || 'Skill';
    const description = button.dataset.description || 'This skill helps improve software quality and testing effectiveness.';

    skillName.textContent = name;
    skillDescription.textContent = description;

    document.querySelectorAll('.skill-box').forEach(skill => {
        skill.classList.toggle('active', skill === button);
    });
};

document.querySelectorAll('.skill-box').forEach(button => {
    button.addEventListener('click', () => setSkillDetail(button));
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
        }
    });
}, observerOptions);

document.querySelectorAll('.experience-card, .skill-box, .project-card, .education-card').forEach(el => {
    observer.observe(el);
});

const defaultSkill = document.querySelector('.skill-box');
if (defaultSkill) {
    setSkillDetail(defaultSkill);
}
