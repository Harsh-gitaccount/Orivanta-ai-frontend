// ===================================
// Products Page JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Load shared components
    loadSharedComponents();

    // Initialize scroll animations
    initializeScrollAnimations();

    // Handle plan anchor links
    handlePlanAnchors();

    // Track page view
    OrivantaUtils.trackPageView('/products');
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
        if (linkHref === currentPage || linkHref === 'products.html') {
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
    const sections = document.querySelectorAll('section:not(.products-hero)');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Observe pricing cards with stagger effect
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
        observer.observe(card);
    });

    // Observe feature items with stagger effect
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });
}

// ===================================
// Handle Plan Anchor Links
// ===================================

function handlePlanAnchors() {
    // Check if URL has hash (e.g., #lite, #pro, #enterprise)
    const hash = window.location.hash;
    
    if (hash) {
        setTimeout(() => {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
                OrivantaUtils.scrollToElement(targetElement, 100);
                
                // Highlight the selected plan
                highlightPlan(targetElement);
            }
        }, 500);
    }

    // Handle clicks on pricing links
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (link) {
            const hash = link.getAttribute('href');
            const targetElement = document.querySelector(hash);
            
            if (targetElement && targetElement.classList.contains('pricing-card')) {
                e.preventDefault();
                OrivantaUtils.scrollToElement(targetElement, 100);
                highlightPlan(targetElement);
                
                // Update URL without page reload
                history.pushState(null, null, hash);
            }
        }
    });
}

// ===================================
// Highlight Selected Plan
// ===================================

function highlightPlan(planElement) {
    // Remove existing highlights
    document.querySelectorAll('.pricing-card').forEach(card => {
        card.classList.remove('plan-highlight');
    });

    // Add highlight to selected plan
    planElement.classList.add('plan-highlight');

    // Remove highlight after animation
    setTimeout(() => {
        planElement.classList.remove('plan-highlight');
    }, 2000);
}

// ===================================
// CTA Button Tracking
// ===================================

document.addEventListener('click', (e) => {
    if (e.target.matches('.btn-primary, .btn-secondary, .btn-outline')) {
        const buttonText = e.target.textContent.trim();
        const buttonHref = e.target.getAttribute('href');
        
        // Get plan name if button is inside pricing card
        const pricingCard = e.target.closest('.pricing-card');
        const planName = pricingCard ? pricingCard.querySelector('.plan-name')?.textContent : 'General';
        
        OrivantaUtils.trackEvent('CTA', 'Click', `Products Page - ${planName} - ${buttonText}`, buttonHref);
    }
});

// ===================================
// Pricing Card Interaction Tracking
// ===================================

const pricingCards = document.querySelectorAll('.pricing-card');
pricingCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const planName = card.querySelector('.plan-name')?.textContent;
        OrivantaUtils.trackEvent('Engagement', 'Hover', `Pricing Card - ${planName}`);
    });
});

// ===================================
// Compare Plans Toggle (Optional)
// ===================================

function initializeCompareToggle() {
    // This can be used for a "Compare Plans" feature in the future
    const compareButton = document.getElementById('comparePlans');
    
    if (compareButton) {
        compareButton.addEventListener('click', () => {
            document.querySelector('.pricing-grid')?.classList.toggle('compare-mode');
            OrivantaUtils.trackEvent('Interaction', 'Click', 'Compare Plans Toggle');
        });
    }
}

// ===================================
// Fade-in CSS Class and Highlight Effect
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
    
    .plan-highlight {
        animation: planPulse 2s ease;
    }
    
    @keyframes planPulse {
        0%, 100% {
            box-shadow: 0 10px 40px rgba(6, 182, 212, 0.15);
        }
        50% {
            box-shadow: 0 15px 60px rgba(6, 182, 212, 0.4);
            transform: translateY(-6px);
        }
    }
    
    @media (prefers-reduced-motion: reduce) {
        .plan-highlight {
            animation: none;
            border-color: var(--color-accent);
        }
    }
`;
document.head.appendChild(style);

// ===================================
// Store Plan Selection
// ===================================

function storePlanSelection(planName) {
    OrivantaUtils.setStorage('selectedPlan', {
        name: planName,
        timestamp: new Date().toISOString()
    });
}

// Load stored plan preference
const storedPlan = OrivantaUtils.getStorage('selectedPlan');
if (storedPlan) {
    console.log('Previously viewed plan:', storedPlan.name);
}

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

