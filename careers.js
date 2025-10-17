// ===================================
// Careers Page JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Load shared components
    loadSharedComponents();

    // Initialize scroll animations
    initializeScrollAnimations();

    // Track page view
    OrivantaUtils.trackPageView('/careers');
});

// ===================================
// Load Shared Header and Footer
// ===================================

function loadSharedComponents() {
    // Load header
    fetch('shared/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            initializeHeader();
            setActiveNavLink();
        })
        .catch(error => console.error('Error loading header:', error));

    // Load footer
    fetch('shared/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
}

// ===================================
// Header Functionality
// ===================================

function initializeHeader() {
    const header = document.querySelector('header');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav-menu');

    // Sticky header on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    mobileMenuToggle?.addEventListener('click', () => {
        nav?.classList.toggle('active');
        mobileMenuToggle?.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        const isExpanded = nav?.classList.contains('active');
        mobileMenuToggle?.setAttribute('aria-expanded', isExpanded);
    });

    // Close mobile menu on link click
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav?.classList.remove('active');
            mobileMenuToggle?.classList.remove('active');
            document.body.classList.remove('menu-open');
            mobileMenuToggle?.setAttribute('aria-expanded', 'false');
        });
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
        if (!header?.contains(e.target) && nav?.classList.contains('active')) {
            nav?.classList.remove('active');
            mobileMenuToggle?.classList.remove('active');
            document.body.classList.remove('menu-open');
            mobileMenuToggle?.setAttribute('aria-expanded', 'false');
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav?.classList.contains('active')) {
            nav?.classList.remove('active');
            mobileMenuToggle?.classList.remove('active');
            document.body.classList.remove('menu-open');
            mobileMenuToggle?.setAttribute('aria-expanded', 'false');
        }
    });
}

// ===================================
// Set Active Navigation Link
// ===================================

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || linkHref === 'careers.html') {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

// ===================================
// Intersection Observer for Animations
// ===================================

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections
    const sections = document.querySelectorAll('section:not(.careers-hero)');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Observe benefit cards with stagger effect
    const benefitCards = document.querySelectorAll('.benefit-card');
    benefitCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe position cards (for future use)
    const positionCards = document.querySelectorAll('.position-card');
    positionCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
        observer.observe(card);
    });
}

// ===================================
// CTA Button Tracking
// ===================================

document.addEventListener('click', (e) => {
    if (e.target.matches('.btn-primary, .btn-secondary')) {
        const buttonText = e.target.textContent.trim();
        const buttonHref = e.target.getAttribute('href');
        
        OrivantaUtils.trackEvent('CTA', 'Click', `Careers Page - ${buttonText}`, buttonHref);
    }
});

// ===================================
// Benefit Card Interaction Tracking
// ===================================

const benefitCards = document.querySelectorAll('.benefit-card');
benefitCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const benefitTitle = card.querySelector('.benefit-title')?.textContent;
        OrivantaUtils.trackEvent('Engagement', 'Hover', `Benefit - ${benefitTitle}`);
    });
});

// ===================================
// Position Card Click Tracking (Future Use)
// ===================================

function initializePositionTracking() {
    const positionCards = document.querySelectorAll('.position-card');
    
    positionCards.forEach(card => {
        // Track position view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const positionTitle = card.querySelector('.position-info h3')?.textContent;
                    OrivantaUtils.trackEvent('Careers', 'View Position', positionTitle);
                    observer.unobserve(card);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(card);

        // Track position click
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.btn')) {
                const positionTitle = card.querySelector('.position-info h3')?.textContent;
                OrivantaUtils.trackEvent('Careers', 'Click Position', positionTitle);
            }
        });
    });
}

// Call this when positions are added
initializePositionTracking();

// ===================================
// Store Career Interest
// ===================================

function storeCareerInterest() {
    const careerInterest = {
        visited: true,
        timestamp: new Date().toISOString(),
        source: document.referrer || 'direct'
    };
    
    OrivantaUtils.setStorage('careerInterest', careerInterest);
}

storeCareerInterest();

// ===================================
// Job Alert Signup (Future Use)
// ===================================

function initializeJobAlertSignup() {
    const alertForm = document.getElementById('jobAlertForm');
    
    if (alertForm) {
        alertForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = alertForm.querySelector('input[type="email"]');
            const email = emailInput?.value.trim();
            
            if (!email || !OrivantaUtils.validateEmail(email)) {
                OrivantaUtils.showToast('Please enter a valid email address', 'error');
                return;
            }

            // Store job alert subscription
            const subscription = {
                email: email,
                timestamp: new Date().toISOString()
            };
            
            OrivantaUtils.setStorage('jobAlertSubscription', subscription);
            OrivantaUtils.trackEvent('Careers', 'Job Alert Signup', email);
            
            OrivantaUtils.showToast('Thank you! We\'ll notify you when positions open up.', 'success');
            alertForm.reset();
        });
    }
}

initializeJobAlertSignup();

// ===================================
// Fade-in CSS Class
// ===================================

const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .nav-link.active {
        color: var(--color-primary);
        background-color: var(--color-gray-100);
    }
`;
document.head.appendChild(style);

// ===================================
// Performance Monitoring
// ===================================

if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
            console.log('Page Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
        }
    });
}
