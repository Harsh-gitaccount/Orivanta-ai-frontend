// ===================================
// 404 Page JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Load shared components
    loadSharedComponents();

    // Initialize animations
    initializeAnimations();

    // Log 404 error
    log404Error();

    // Track page view
    OrivantaUtils.trackPageView('/404');

    // Track referrer
    trackReferrer();
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
// Initialize Animations
// ===================================

function initializeAnimations() {
    // Fade in error content
    const errorContent = document.querySelector('.error-content');
    const helpfulLinks = document.querySelector('.helpful-links');
    
    if (errorContent) {
        errorContent.style.opacity = '0';
        errorContent.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            errorContent.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            errorContent.style.opacity = '1';
            errorContent.style.transform = 'translateY(0)';
        }, 100);
    }

    if (helpfulLinks) {
        helpfulLinks.style.opacity = '0';
        helpfulLinks.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            helpfulLinks.style.transition = 'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s';
            helpfulLinks.style.opacity = '1';
            helpfulLinks.style.transform = 'translateY(0)';
        }, 100);
    }

    // Animate link cards
    const linkCards = document.querySelectorAll('.link-card');
    linkCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            card.style.transition = `opacity 0.4s ease ${0.5 + index * 0.1}s, transform 0.4s ease ${0.5 + index * 0.1}s`;
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100);
    });
}

// ===================================
// Log 404 Error
// ===================================

function log404Error() {
    const errorData = {
        url: window.location.href,
        referrer: document.referrer || 'Direct',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    };

    // Store in localStorage for debugging
    const errors404 = OrivantaUtils.getStorage('404Errors') || [];
    errors404.push(errorData);
    
    // Keep only last 10 errors
    if (errors404.length > 10) {
        errors404.shift();
    }
    
    OrivantaUtils.setStorage('404Errors', errors404);

    // Track 404 event
    OrivantaUtils.trackEvent('Error', '404', window.location.pathname, null);

    console.log('404 Error logged:', errorData);
}

// ===================================
// Track Referrer
// ===================================

function trackReferrer() {
    const referrer = document.referrer;
    
    if (referrer) {
        OrivantaUtils.trackEvent('404', 'Referrer', referrer);
    } else {
        OrivantaUtils.trackEvent('404', 'Source', 'Direct');
    }
}

// ===================================
// Button Click Tracking
// ===================================

document.addEventListener('click', (e) => {
    if (e.target.matches('.btn-primary, .btn-secondary')) {
        const buttonText = e.target.textContent.trim();
        const buttonHref = e.target.getAttribute('href');
        
        OrivantaUtils.trackEvent('404', 'Click', `${buttonText} - ${buttonHref}`);
    }
});

// ===================================
// Link Card Click Tracking
// ===================================

const linkCards = document.querySelectorAll('.link-card');
linkCards.forEach(card => {
    card.addEventListener('click', () => {
        const linkText = card.querySelector('.link-text')?.textContent;
        const linkHref = card.getAttribute('href');
        
        OrivantaUtils.trackEvent('404', 'Helpful Link', `${linkText} - ${linkHref}`);
    });
});

// ===================================
// Redirect Timer (Optional)
// ===================================

function initializeRedirectTimer() {
    // Uncomment to enable auto-redirect after 10 seconds
    /*
    let countdown = 10;
    const timerElement = document.createElement('p');
    timerElement.className = 'redirect-timer';
    timerElement.style.cssText = `
        text-align: center;
        color: var(--color-gray-600);
        font-size: 0.9375rem;
        margin-top: var(--spacing-md);
    `;
    
    const errorText = document.querySelector('.error-text');
    errorText?.appendChild(timerElement);

    const interval = setInterval(() => {
        countdown--;
        timerElement.textContent = `Redirecting to homepage in ${countdown} seconds...`;
        
        if (countdown <= 0) {
            clearInterval(interval);
            window.location.href = 'index.html';
        }
    }, 1000);

    timerElement.textContent = `Redirecting to homepage in ${countdown} seconds...`;
    */
}

// Uncomment to enable auto-redirect
// initializeRedirectTimer();

// ===================================
// Search Functionality (Optional Enhancement)
// ===================================

function addSearchBox() {
    const errorText = document.querySelector('.error-text');
    if (!errorText) return;

    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.style.cssText = `
        max-width: 400px;
        margin: var(--spacing-xl) auto 0;
    `;

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search our website...';
    searchInput.className = 'search-input';
    searchInput.style.cssText = `
        width: 100%;
        padding: 0.875rem 1rem;
        border: 2px solid var(--color-gray-300);
        border-radius: 0.5rem;
        font-size: 1rem;
    `;

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                OrivantaUtils.trackEvent('404', 'Search', query);
                // Redirect to search page or homepage with query
                window.location.href = `index.html?search=${encodeURIComponent(query)}`;
            }
        }
    });

    searchContainer.appendChild(searchInput);
    errorText.appendChild(searchContainer);
}

// Uncomment to enable search box
// addSearchBox();

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
