// ===================================
// Privacy Page JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Load shared components
    loadSharedComponents();

    // Initialize scroll animations
    initializeScrollAnimations();

    // Initialize smooth scroll for anchor links
    initializeSmoothScroll();

    // Track page view
    OrivantaUtils.trackPageView('/privacy');

    // Track scroll depth
    trackScrollDepth();
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
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === 'privacy.html') {
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

    // Observe policy sections
    const sections = document.querySelectorAll('.policy-section, .policy-intro');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
        observer.observe(section);
    });
}

// ===================================
// Smooth Scroll for Anchor Links
// ===================================

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                OrivantaUtils.scrollToElement(target, 100);
            }
        });
    });
}

// ===================================
// Track Scroll Depth
// ===================================

function trackScrollDepth() {
    let maxScroll = 0;
    const milestones = [25, 50, 75, 100];
    const tracked = new Set();

    const calculateScrollPercentage = () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset;
        return Math.round((scrollTop / documentHeight) * 100);
    };

    window.addEventListener('scroll', OrivantaUtils.throttle(() => {
        const scrollPercentage = calculateScrollPercentage();
        
        if (scrollPercentage > maxScroll) {
            maxScroll = scrollPercentage;
        }

        milestones.forEach(milestone => {
            if (scrollPercentage >= milestone && !tracked.has(milestone)) {
                tracked.add(milestone);
                OrivantaUtils.trackEvent('Engagement', 'Scroll Depth', `Privacy Policy - ${milestone}%`, milestone);
            }
        });
    }, 250));

    // Track time spent on page
    let startTime = Date.now();
    
    window.addEventListener('beforeunload', () => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        OrivantaUtils.trackEvent('Engagement', 'Time on Page', 'Privacy Policy', timeSpent);
    });
}

// ===================================
// Link Click Tracking
// ===================================

document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href) {
        const linkText = link.textContent.trim();
        const linkHref = link.getAttribute('href');
        
        if (linkHref.startsWith('mailto:')) {
            OrivantaUtils.trackEvent('Contact', 'Click', `Privacy Page - Email Link`, linkHref);
        } else if (linkHref.includes('contact.html')) {
            OrivantaUtils.trackEvent('Contact', 'Click', `Privacy Page - Contact Form`, linkHref);
        } else if (link.classList.contains('btn')) {
            OrivantaUtils.trackEvent('CTA', 'Click', `Privacy Page - ${linkText}`, linkHref);
        }
    }
});

// ===================================
// Reading Progress Indicator
// ===================================

function initializeReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 72px;
        left: 0;
        width: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--color-accent), var(--color-primary));
        z-index: 999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', OrivantaUtils.throttle(() => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset;
        const scrollPercent = (scrollTop / documentHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    }, 50));
}

// Initialize reading progress
initializeReadingProgress();

// ===================================
// Store Privacy Policy View
// ===================================

function storePrivacyView() {
    const privacyView = {
        viewed: true,
        timestamp: new Date().toISOString()
    };
    
    OrivantaUtils.setStorage('privacyPolicyViewed', privacyView);
}

storePrivacyView();

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
// Print Button (Optional Enhancement)
// ===================================

function addPrintButton() {
    const contentWrapper = document.querySelector('.content-wrapper');
    if (!contentWrapper) return;

    const printButton = document.createElement('button');
    printButton.className = 'btn-print';
    printButton.innerHTML = '🖨️ Print Policy';
    printButton.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 0.875rem 1.5rem;
        background-color: var(--color-accent);
        color: var(--color-white);
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.2s ease;
        z-index: 100;
    `;

    printButton.addEventListener('click', () => {
        OrivantaUtils.trackEvent('Action', 'Print', 'Privacy Policy');
        window.print();
    });

    printButton.addEventListener('mouseenter', () => {
        printButton.style.transform = 'translateY(-2px)';
        printButton.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
    });

    printButton.addEventListener('mouseleave', () => {
        printButton.style.transform = 'translateY(0)';
        printButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    });

    document.body.appendChild(printButton);

    // Hide on mobile
    if (OrivantaUtils.isMobile()) {
        printButton.style.display = 'none';
    }
}

// Add print button on desktop
if (OrivantaUtils.isDesktop()) {
    addPrintButton();
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
