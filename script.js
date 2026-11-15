/**
 * Pujan Bhandari — Quality Assurance Engineer Portfolio
 * Interactivity & Micro-Interactions Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // 1. Theme Management (Monochrome Dark / Light)
    // --------------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('themeToggle');
    const rootHtml = document.documentElement;

    // Check system preference or saved preference
    const savedTheme = localStorage.getItem('pb_theme');
    if (savedTheme) {
        rootHtml.setAttribute('data-theme', savedTheme);
    } else {
        // Default to dark monochrome
        rootHtml.setAttribute('data-theme', 'dark');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = rootHtml.getAttribute('data-theme');
            const targetTheme = currentTheme === 'light' ? 'dark' : 'light';
            rootHtml.setAttribute('data-theme', targetTheme);
            localStorage.setItem('pb_theme', targetTheme);
            showToast(`Theme switched to ${targetTheme === 'dark' ? 'Obsidian Dark' : 'Minimal Light'}`);
        });
    }

    // --------------------------------------------------------------------------
    // 2. Reading Progress Bar
    // --------------------------------------------------------------------------
    const progressBar = document.getElementById('progressBar');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }, { passive: true });

    // --------------------------------------------------------------------------
    // 3. Mobile Navigation Drawer
    // --------------------------------------------------------------------------
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    const toggleDrawer = (open) => {
        const isOpen = open !== undefined ? open : !mobileDrawer.classList.contains('open');
        if (mobileDrawer) {
            mobileDrawer.classList.toggle('open', isOpen);
            mobileDrawer.setAttribute('aria-hidden', String(!isOpen));
        }
        if (mobileMenuBtn) {
            mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
        }
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => toggleDrawer());
    }

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => toggleDrawer(false));
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
            toggleDrawer(false);
        }
    });

    // --------------------------------------------------------------------------
    // 4. Smooth Anchor Scrolling & Active Nav Highlighting
    // --------------------------------------------------------------------------
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Smooth scroll for in-page links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // IntersectionObserver for highlighting active nav item
    const navObserverOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => navObserver.observe(section));

    // --------------------------------------------------------------------------
    // 5. Copy to Clipboard Utility & Toast System
    // --------------------------------------------------------------------------
    const toast = document.getElementById('toast');
    let toastTimeout = null;

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');

        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }

        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2800);
    }

    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const textToCopy = btn.getAttribute('data-copy');
            if (!textToCopy) return;

            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(textToCopy);
                } else {
                    // Fallback
                    const textarea = document.createElement('textarea');
                    textarea.value = textToCopy;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                }
                showToast(`Copied: ${textToCopy}`);
            } catch (err) {
                showToast(`Unable to copy to clipboard`);
            }
        });
    });

    // --------------------------------------------------------------------------
    // 6. Interactive Contact Form to Mailto
    // --------------------------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('senderName').value.trim();
            const subject = document.getElementById('senderSubject').value.trim();
            const message = document.getElementById('senderMessage').value.trim();

            if (!name || !subject || !message) {
                showToast('Please fill out all fields.');
                return;
            }

            const encodedSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject} - from ${name}`);
            const encodedBody = encodeURIComponent(`Hi Pujan,\n\n${message}\n\nBest regards,\n${name}`);
            
            const mailtoUrl = `mailto:bhandaripujan321@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;
            
            showToast('Opening your email client...');
            setTimeout(() => {
                window.location.href = mailtoUrl;
            }, 600);
        });
    }

    // --------------------------------------------------------------------------
    // 7. Scroll Reveal Animation
    // --------------------------------------------------------------------------
    const revealElements = document.querySelectorAll(
        '.stat-card, .pillar-item, .skill-category-card, .timeline-card, .project-card, .cert-card, .edu-card, .contact-card'
    );

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(16px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, background 0.2s ease';
        revealObserver.observe(el);
    });
});
