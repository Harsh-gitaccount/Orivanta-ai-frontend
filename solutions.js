// ===================================
// Solutions Page JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Load shared components
    loadSharedComponents();

    // Initialize scroll animations
    initializeScrollAnimations();

    // Handle solution anchor links
    handleSolutionAnchors();

    initializeIntegrationHub();

    // Track page view
    OrivantaUtils.trackPageView('/solutions');
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
        if (linkHref === currentPage || linkHref === 'solutions.html') {
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
    const sections = document.querySelectorAll('section:not(.solutions-hero)');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Observe solution cards with stagger effect
    const solutionCards = document.querySelectorAll('.solution-card');
    solutionCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.8s ease ${index * 0.2}s, transform 0.8s ease ${index * 0.2}s`;
        observer.observe(card);
    });

    // Observe use case cards
    const useCaseCards = document.querySelectorAll('.use-case-card');
    useCaseCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe integration categories
    const integrationCategories = document.querySelectorAll('.integration-category');
    integrationCategories.forEach((category, index) => {
        category.style.opacity = '0';
        category.style.transform = 'translateY(20px)';
        category.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(category);
    });
}

// ===================================
// Handle Solution Anchor Links
// ===================================

function handleSolutionAnchors() {
    // Check if URL has hash (e.g., #conversational-ai, #workflow-automation)
    const hash = window.location.hash;
    
    if (hash) {
        setTimeout(() => {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
                OrivantaUtils.scrollToElement(targetElement, 100);
                highlightSolution(targetElement);
            }
        }, 500);
    }

    // Handle clicks on solution anchor links
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (link) {
            const hash = link.getAttribute('href');
            const targetElement = document.querySelector(hash);
            
            if (targetElement && targetElement.classList.contains('solution-card')) {
                e.preventDefault();
                OrivantaUtils.scrollToElement(targetElement, 100);
                highlightSolution(targetElement);
                
                // Update URL without page reload
                history.pushState(null, null, hash);
            }
        }
    });
}

// ===================================
// Highlight Selected Solution
// ===================================

function highlightSolution(solutionElement) {
    // Remove existing highlights
    document.querySelectorAll('.solution-card').forEach(card => {
        card.classList.remove('solution-highlight');
    });

    // Add highlight to selected solution
    solutionElement.classList.add('solution-highlight');

    // Remove highlight after animation
    setTimeout(() => {
        solutionElement.classList.remove('solution-highlight');
    }, 2000);
}

// ===================================
// CTA Button Tracking
// ===================================

document.addEventListener('click', (e) => {
    if (e.target.matches('.btn-primary, .btn-secondary')) {
        const buttonText = e.target.textContent.trim();
        const buttonHref = e.target.getAttribute('href');
        
        OrivantaUtils.trackEvent('CTA', 'Click', `Solutions Page - ${buttonText}`, buttonHref);
    }
});

// ===================================
// Use Case Card Interaction Tracking
// ===================================

const useCaseCards = document.querySelectorAll('.use-case-card');
useCaseCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const useCaseTitle = card.querySelector('.use-case-title')?.textContent;
        OrivantaUtils.trackEvent('Engagement', 'Hover', `Use Case - ${useCaseTitle}`);
    });
});

// ===================================
// Solution Card Click Tracking
// ===================================

const solutionCards = document.querySelectorAll('.solution-card');
solutionCards.forEach(card => {
    card.addEventListener('click', (e) => {
        // Only track if not clicking a link
        if (!e.target.closest('a')) {
            const solutionTitle = card.querySelector('.solution-title')?.textContent;
            OrivantaUtils.trackEvent('Engagement', 'Click', `Solution Card - ${solutionTitle}`);
        }
    });
});

// ===================================
// Store Solution Interest
// ===================================

function storeSolutionInterest(solutionName) {
    const interests = OrivantaUtils.getStorage('solutionInterests') || [];
    
    if (!interests.includes(solutionName)) {
        interests.push(solutionName);
        OrivantaUtils.setStorage('solutionInterests', interests);
    }
}

// Track solution views
const solutionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const solutionTitle = entry.target.querySelector('.solution-title')?.textContent;
            if (solutionTitle) {
                storeSolutionInterest(solutionTitle);
                OrivantaUtils.trackEvent('Engagement', 'View', `Solution - ${solutionTitle}`);
            }
        }
    });
}, { threshold: 0.5 });

solutionCards.forEach(card => solutionObserver.observe(card));

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
    
    .solution-highlight {
        animation: solutionPulse 2s ease;
    }
    
    @keyframes solutionPulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.02);
            box-shadow: 0 15px 50px rgba(6, 182, 212, 0.2);
        }
    }
    
    @media (prefers-reduced-motion: reduce) {
        .solution-highlight {
            animation: none;
            outline: 3px solid var(--color-accent);
            outline-offset: 4px;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// Scroll Progress Indicator (Optional)
// ===================================

function initializeScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
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
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    }, 50));
}

// Initialize scroll progress on desktop
if (OrivantaUtils.isDesktop()) {
    initializeScrollProgress();
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
// ===================================
// Interactive Integration Hub
// ===================================

function initializeIntegrationHub() {
    const integrationCards = document.querySelectorAll('.integration-card');
    const hubLogo = document.querySelector('.hub-logo');
    
    if (!integrationCards.length || !hubLogo) return;
    
    // Add hover effect to hub logo when hovering cards
    integrationCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            hubLogo.style.transform = 'scale(1.1)';
            hubLogo.style.boxShadow = '0 15px 50px rgba(94, 79, 194, 0.6)';
        });
        
        card.addEventListener('mouseleave', () => {
            hubLogo.style.transform = 'scale(1)';
            hubLogo.style.boxShadow = '0 10px 40px rgba(94, 79, 194, 0.4)';
        });
        
        // Track card flip
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            OrivantaUtils.trackEvent('Integration', 'View', category);
        });
    });
    
    // Learn More button tracking
    const learnMoreButtons = document.querySelectorAll('.btn-integrate');
    learnMoreButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = e.target.closest('.integration-card');
            const category = card.getAttribute('data-category');
            OrivantaUtils.trackEvent('Integration', 'Learn More', category);
            
            // Add your learn more logic here
            console.log(`Learn more about ${category}`);
        });
    });

}

//
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card-modern');
    const prevBtn = document.querySelector('.nav-prev');
    const nextBtn = document.querySelector('.nav-next');
    const dotsContainer = document.querySelector('.carousel-dots-modern');
    const total = cards.length;
    let current = 0;
    let autoplayInterval;

    // Create dots
    for (let i = 0; i < total; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot-modern');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll('.dot-modern');

    function updateCards() {
        cards.forEach((card, i) => {
            card.classList.remove('active', 'next', 'prev');
            
            if (i === current) {
                card.classList.add('active');
            } else if (i === (current + 1) % total) {
                card.classList.add('next');
            } else if (i === (current - 1 + total) % total) {
                card.classList.add('prev');
            }
        });

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === current);
        });
    }

    function goToSlide(index) {
        current = index;
        updateCards();
        resetAutoplay();
    }

    function next() {
        current = (current + 1) % total;
        updateCards();
    }

    function prev() {
        current = (current - 1 + total) % total;
        updateCards();
    }

    function startAutoplay() {
        autoplayInterval = setInterval(next, 4000);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    prevBtn.addEventListener('click', () => {
        prev();
        resetAutoplay();
    });

    nextBtn.addEventListener('click', () => {
        next();
        resetAutoplay();
    });

    // Pause on hover
    const wrapper = document.querySelector('.cards-wrapper');
    wrapper.addEventListener('mouseenter', stopAutoplay);
    wrapper.addEventListener('mouseleave', startAutoplay);

    // Initialize
    updateCards();
    startAutoplay();
});
