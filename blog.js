// ===================================
// Blog Page JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Load shared components
    loadSharedComponents();

    // Initialize scroll animations
    initializeScrollAnimations();

    // Initialize newsletter form
    initializeNewsletterForm();

    // Track page view
    OrivantaUtils.trackPageView('/blog');
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
        if (linkHref === currentPage || linkHref === 'blog.html') {
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
    const sections = document.querySelectorAll('section:not(.blog-hero)');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Observe blog cards (for future use)
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// ===================================
// Newsletter Form Handling
// ===================================

function initializeNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    const emailInput = document.getElementById('newsletter-email');
    const messageContainer = document.getElementById('newsletterMessage');
    
    if (!form) return;

    // Real-time validation
    emailInput?.addEventListener('blur', () => {
        validateNewsletterEmail(emailInput);
    });

    emailInput?.addEventListener('input', () => {
        if (emailInput.classList.contains('error')) {
            OrivantaUtils.clearError(emailInput);
        }
        hideNewsletterMessage();
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput?.value.trim();
        
        // Clear previous messages
        hideNewsletterMessage();
        
        // Validate email
        if (!email || !OrivantaUtils.validateEmail(email)) {
            OrivantaUtils.showError(emailInput, 'Please enter a valid email address.');
            showNewsletterMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Submit newsletter subscription
        await submitNewsletterSubscription(email);
    });
}

// ===================================
// Validate Newsletter Email
// ===================================

function validateNewsletterEmail(input) {
    const value = input.value.trim();
    
    OrivantaUtils.clearError(input);

    if (!value) {
        OrivantaUtils.showError(input, 'Email is required.');
        return false;
    }

    if (!OrivantaUtils.validateEmail(value)) {
        OrivantaUtils.showError(input, 'Please enter a valid email address.');
        return false;
    }

    return true;
}

// ===================================
// Submit Newsletter Subscription
// ===================================

async function submitNewsletterSubscription(email) {
    const submitButton = document.querySelector('#newsletterForm button[type="submit"]');
    
    // Show loading state
    OrivantaUtils.showLoading(submitButton, 'Subscribing...');

    try {
        // Auto-detect environment (dev vs production)
        const isDevelopment = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
        const API_URL = isDevelopment 
            ? 'http://localhost:3000/api/newsletter/subscribe' 
            : 'https://yourdomain.com/api/newsletter/subscribe';

        // Call backend API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email,
                timestamp: new Date().toISOString(),
                source: 'blog_page'
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Subscription failed');
        }

        // Store subscription in localStorage
        const subscription = {
            email: email,
            timestamp: new Date().toISOString(),
            source: 'blog_page'
        };
        
        OrivantaUtils.setStorage('newsletterSubscription', subscription);

        // Track event
        OrivantaUtils.trackEvent('Newsletter', 'Subscribe', 'Blog Page', email);

        // Show success message
        showNewsletterMessage('🎉 Success! You\'re now subscribed to our newsletter.', 'success');

        // Reset form
        document.getElementById('newsletterForm').reset();

        // Show toast notification
        OrivantaUtils.showToast('Thank you for subscribing!', 'success');

        // Log success
        console.log('✅ Newsletter subscription successful:', email);

    } catch (error) {
        console.error('❌ Newsletter subscription error:', error);
        showNewsletterMessage('Oops! Something went wrong. Please try again.', 'error');
        
        // Track error
        OrivantaUtils.trackEvent('Newsletter', 'Error', 'Blog Page', error.message);
    } finally {
        // Hide loading state
        OrivantaUtils.hideLoading(submitButton);
    }
}

// ===================================
// Newsletter Message Display
// ===================================

function showNewsletterMessage(message, type) {
    const messageContainer = document.getElementById('newsletterMessage');
    if (!messageContainer) return;

    messageContainer.textContent = message;
    messageContainer.className = `form-message ${type} show`;
    
    // Auto-hide success message after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            hideNewsletterMessage();
        }, 5000);
    }
}

function hideNewsletterMessage() {
    const messageContainer = document.getElementById('newsletterMessage');
    if (!messageContainer) return;

    messageContainer.className = 'form-message';
    messageContainer.textContent = '';
}

// ===================================
// CTA Button Tracking
// ===================================

document.addEventListener('click', (e) => {
    if (e.target.matches('.btn-primary, .btn-secondary')) {
        const buttonText = e.target.textContent.trim();
        const buttonHref = e.target.getAttribute('href');
        
        OrivantaUtils.trackEvent('CTA', 'Click', `Blog Page - ${buttonText}`, buttonHref);
    }
});

// ===================================
// Blog Card Click Tracking (Future Use)
// ===================================

function initializeBlogCardTracking() {
    const blogCards = document.querySelectorAll('.blog-card');
    
    blogCards.forEach(card => {
        // Track blog post view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const blogTitle = card.querySelector('.blog-card-title')?.textContent;
                    OrivantaUtils.trackEvent('Blog', 'View Post', blogTitle);
                    observer.unobserve(card);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(card);

        // Track blog post click
        card.addEventListener('click', () => {
            const blogTitle = card.querySelector('.blog-card-title')?.textContent;
            OrivantaUtils.trackEvent('Blog', 'Click Post', blogTitle);
        });
    });
}

// Call this when blog posts are added
initializeBlogCardTracking();

// ===================================
// Check for Existing Subscription
// ===================================

function checkExistingSubscription() {
    const existingSubscription = OrivantaUtils.getStorage('newsletterSubscription');
    
    if (existingSubscription) {
        const emailInput = document.getElementById('newsletter-email');
        const submitButton = document.querySelector('#newsletterForm button[type="submit"]');
        
        // Pre-fill email if subscribed
        if (emailInput && existingSubscription.email) {
            emailInput.value = existingSubscription.email;
        }
        
        console.log('User already subscribed:', existingSubscription.email);
    }
}

checkExistingSubscription();


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
