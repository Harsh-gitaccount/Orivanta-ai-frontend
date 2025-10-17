// ===================================
// Shared Utility Functions
// ===================================

const OrivantaUtils = {
    
    // ===================================
    // Form Validation Utilities
    // ===================================
    
    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },

    validatePhone(phone) {
        const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return re.test(String(phone).replace(/\s/g, ''));
    },

    validateRequired(value) {
        return value !== null && value !== undefined && String(value).trim().length > 0;
    },

    // ===================================
    // Form Error Display
    // ===================================
    
    showError(input, message) {
        const formGroup = input.closest('.form-group') || input.parentElement;
        const existingError = formGroup.querySelector('.error-message');
        
        if (existingError) {
            existingError.remove();
        }

        input.classList.add('error');
        input.setAttribute('aria-invalid', 'true');

        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.setAttribute('role', 'alert');
        
        formGroup.appendChild(errorElement);
    },

    clearError(input) {
        const formGroup = input.closest('.form-group') || input.parentElement;
        const errorMessage = formGroup.querySelector('.error-message');
        
        if (errorMessage) {
            errorMessage.remove();
        }

        input.classList.remove('error');
        input.removeAttribute('aria-invalid');
    },

    // ===================================
    // Local Storage Utilities
    // ===================================
    
    setStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    },

    getStorage(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Storage error:', e);
            return null;
        }
    },

    removeStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    },

    // ===================================
    // URL Parameter Utilities
    // ===================================
    
    getUrlParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    },

    setUrlParam(param, value) {
        const url = new URL(window.location);
        url.searchParams.set(param, value);
        window.history.pushState({}, '', url);
    },

    // ===================================
    // Debounce & Throttle
    // ===================================
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // ===================================
    // Device Detection
    // ===================================
    
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    isTablet() {
        return /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent);
    },

    isDesktop() {
        return !this.isMobile() && !this.isTablet();
    },

    // ===================================
    // Scroll Utilities
    // ===================================
    
    scrollToElement(element, offset = 80) {
        if (!element) return;
        
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    },

    getScrollPosition() {
        return {
            x: window.pageXOffset || document.documentElement.scrollLeft,
            y: window.pageYOffset || document.documentElement.scrollTop
        };
    },

    // ===================================
    // String Utilities
    // ===================================
    
    truncate(str, length, suffix = '...') {
        if (str.length <= length) return str;
        return str.substring(0, length - suffix.length) + suffix;
    },

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    slugify(str) {
        return str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    },

    // ===================================
    // Date Utilities
    // ===================================
    
    formatDate(date, format = 'YYYY-MM-DD') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');

        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day);
    },

    // ===================================
    // Analytics & Tracking (Placeholder)
    // ===================================
    
    trackEvent(category, action, label = null, value = null) {
        // Placeholder for analytics integration
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label,
                value: value
            });
        }
        
        console.log('Track Event:', { category, action, label, value });
    },

    trackPageView(pagePath) {
        // Placeholder for analytics integration
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_path: pagePath
            });
        }
        
        console.log('Track Page View:', pagePath);
    },

    // ===================================
    // Loading State Management
    // ===================================
    
    showLoading(element, text = 'Loading...') {
        if (!element) return;
        
        element.disabled = true;
        element.dataset.originalText = element.textContent;
        element.innerHTML = `<span class="loading-spinner"></span> ${text}`;
        element.classList.add('loading');
    },

    hideLoading(element) {
        if (!element) return;
        
        element.disabled = false;
        element.textContent = element.dataset.originalText || 'Submit';
        element.classList.remove('loading');
        delete element.dataset.originalText;
    },

    // ===================================
    // Toast Notifications
    // ===================================
    
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');

        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    // ===================================
    // Copy to Clipboard
    // ===================================
    
    copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text)
                .then(() => true)
                .catch(() => false);
        } else {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            
            try {
                const success = document.execCommand('copy');
                document.body.removeChild(textarea);
                return Promise.resolve(success);
            } catch (e) {
                document.body.removeChild(textarea);
                return Promise.resolve(false);
            }
        }
    },

    // ===================================
    // Performance Monitoring
    // ===================================
    
    measurePerformance(name) {
        if ('performance' in window && 'measure' in window.performance) {
            try {
                performance.mark(`${name}-start`);
                
                return {
                    end: () => {
                        performance.mark(`${name}-end`);
                        performance.measure(name, `${name}-start`, `${name}-end`);
                        const measure = performance.getEntriesByName(name)[0];
                        console.log(`${name}: ${measure.duration.toFixed(2)}ms`);
                        return measure.duration;
                    }
                };
            } catch (e) {
                console.warn('Performance measurement not supported');
                return { end: () => {} };
            }
        }
        return { end: () => {} };
    }
};

// ===================================
// Global Styles for Utilities
// ===================================

const utilityStyles = document.createElement('style');
utilityStyles.textContent = `
    /* Error States */
    .error {
        border-color: #ef4444 !important;
    }

    .error-message {
        display: block;
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.375rem;
    }

    /* Loading Spinner */
    .loading-spinner {
        display: inline-block;
        width: 14px;
        height: 14px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: #ffffff;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    /* Toast Notifications */
    .toast {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        background-color: var(--color-gray-800);
        color: var(--color-white);
        border-radius: 0.5rem;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        z-index: 10000;
        max-width: 400px;
        font-size: 0.9375rem;
    }

    .toast.show {
        opacity: 1;
        transform: translateY(0);
    }

    .toast-success {
        background-color: #10b981;
    }

    .toast-error {
        background-color: #ef4444;
    }

    .toast-warning {
        background-color: #f59e0b;
    }

    .toast-info {
        background-color: #3b82f6;
    }

    @media (max-width: 640px) {
        .toast {
            bottom: 1rem;
            right: 1rem;
            left: 1rem;
            max-width: none;
        }
    }
`;

document.head.appendChild(utilityStyles);

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OrivantaUtils;
}

// Make available globally
window.OrivantaUtils = OrivantaUtils;
