// ===================================
// Contact Page JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Load shared components
    loadSharedComponents();

    // Initialize scroll animations
    initializeScrollAnimations();

    // Initialize form handling
    initializeContactForm();

    // Track page view
    OrivantaUtils.trackPageView('/contact');
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
        if (linkHref === currentPage || linkHref === 'contact.html') {
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
    const sections = document.querySelectorAll('section:not(.contact-hero)');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// ===================================
// Contact Form Handling
// ===================================

function initializeContactForm() {
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (!form) return;

    // Real-time validation
    const inputs = form.querySelectorAll('.form-input, .form-textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });

        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                OrivantaUtils.clearError(input);
            }
        });
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous messages
        hideFormMessage();
        
        // Validate all fields
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            showFormMessage('Please fix the errors above and try again.', 'error');
            return;
        }

        // Get form data
        const formData = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            company: form.company.value.trim(),
            notes: form.notes.value.trim(),
            timestamp: new Date().toISOString()
        };

        // Submit form
        await submitForm(formData);
    });
}

// ===================================
// Field Validation
// ===================================

function validateField(input) {
    const value = input.value.trim();
    const fieldName = input.name;
    
    // Clear previous errors
    OrivantaUtils.clearError(input);

    // Check if required field is empty
    if (input.hasAttribute('required') && !OrivantaUtils.validateRequired(value)) {
        OrivantaUtils.showError(input, 'This field is required.');
        return false;
    }

    // Email validation
    if (fieldName === 'email' && value) {
        if (!OrivantaUtils.validateEmail(value)) {
            OrivantaUtils.showError(input, 'Please enter a valid email address.');
            return false;
        }
    }

    // Name validation (minimum 2 characters)
    if (fieldName === 'name' && value) {
        if (value.length < 2) {
            OrivantaUtils.showError(input, 'Name must be at least 2 characters.');
            return false;
        }
    }

    // Company validation (minimum 2 characters)
    if (fieldName === 'company' && value) {
        if (value.length < 2) {
            OrivantaUtils.showError(input, 'Company name must be at least 2 characters.');
            return false;
        }
    }

    // Notes validation (minimum 10 characters)
    if (fieldName === 'notes' && value) {
        if (value.length < 10) {
            OrivantaUtils.showError(input, 'Message must be at least 10 characters.');
            return false;
        }
    }

    return true;
}

// ===================================
// Form Submission
// ===================================

async function submitForm(formData) {
    const submitButton = document.querySelector('.btn-submit');
    
    // Show loading state
    OrivantaUtils.showLoading(submitButton, 'Sending...');

    try {
        // Send to backend API
        const response = await fetch('https://orivanta-ai-backend.vercel.app/api/contact/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to send message');
        }

        // Track event
        OrivantaUtils.trackEvent('Form', 'Submit', 'Contact Form', null);

        // Show success message
        showFormMessage(result.message, 'success');

        // Reset form
        document.getElementById('contactForm').reset();

        // Scroll to message
        setTimeout(() => {
            const messageElement = document.getElementById('formMessage');
            if (messageElement) {
                OrivantaUtils.scrollToElement(messageElement, 100);
            }
        }, 100);

    } catch (error) {
        console.error('Form submission error:', error);
        showFormMessage(error.message || 'Something went wrong. Please email us at hello@orivanta.ai', 'error');
        
        // Track error
        OrivantaUtils.trackEvent('Form', 'Error', 'Contact Form', error.message);
    } finally {
        // Hide loading state
        OrivantaUtils.hideLoading(submitButton);
    }
}

// ===================================
// Form Message Display
// ===================================

function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    if (!formMessage) return;

    formMessage.textContent = message;
    formMessage.className = `form-message ${type} show`;
}

function hideFormMessage() {
    const formMessage = document.getElementById('formMessage');
    if (!formMessage) return;

    formMessage.className = 'form-message';
    formMessage.textContent = '';
}

// ===================================
// CTA Button Tracking
// ===================================

document.addEventListener('click', (e) => {
    if (e.target.matches('.btn-primary, .btn-secondary, .method-link')) {
        const buttonText = e.target.textContent.trim();
        const buttonHref = e.target.getAttribute('href');
        
        OrivantaUtils.trackEvent('CTA', 'Click', `Contact Page - ${buttonText}`, buttonHref);
    }
});

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
// Auto-save Form Data (Optional)
// ===================================

function autoSaveFormData() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const inputs = form.querySelectorAll('.form-input, .form-textarea');
    
    inputs.forEach(input => {
        // Load saved data
        const savedValue = OrivantaUtils.getStorage(`contact_${input.name}`);
        if (savedValue && !input.value) {
            input.value = savedValue;
        }

        // Save on input
        input.addEventListener('input', OrivantaUtils.debounce(() => {
            if (input.value.trim()) {
                OrivantaUtils.setStorage(`contact_${input.name}`, input.value.trim());
            }
        }, 500));
    });

    // Clear saved data on successful submission
    form.addEventListener('submit', () => {
        setTimeout(() => {
            inputs.forEach(input => {
                OrivantaUtils.removeStorage(`contact_${input.name}`);
            });
        }, 2000);
    });
}

// Initialize auto-save
autoSaveFormData();
