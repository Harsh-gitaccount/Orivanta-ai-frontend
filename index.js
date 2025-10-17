

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
        
        if (currentScroll > 100) {
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
    });

    // Close mobile menu on link click
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav?.classList.remove('active');
            mobileMenuToggle?.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
        if (!header?.contains(e.target) && nav?.classList.contains('active')) {
            nav?.classList.remove('active');
            mobileMenuToggle?.classList.remove('active');
            document.body.classList.remove('menu-open');
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
    const sections = document.querySelectorAll('section:not(.hero)');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// ===================================
// Smooth Scroll Polyfill
// ===================================

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// Performance Monitoring
// ===================================

function checkPerformance() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        const canvas = document.getElementById('particleCanvas');
        if (canvas) {
            canvas.style.display = 'none';
        }
        return false;
    }
    
    return true;
}

// ===================================
// Initialize on DOM Ready
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Load shared components
    loadSharedComponents();

    // Initialize particle animation if performance allows
    if (checkPerformance()) {
        const canvas = document.getElementById('particleCanvas');
        if (canvas) {
            new ParticleAnimation(canvas);
        }
    }

    // Initialize scroll animations
    initializeScrollAnimations();

    // Initialize smooth scroll
    initializeSmoothScroll();

    // Initialize industries carousel
    initializeIndustriesCarousel();
    // Initialize hero video
    initializeHeroVideo();
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
`;
document.head.appendChild(style);

// ===================================
// Cleanup on Page Unload
// ===================================

window.addEventListener('beforeunload', () => {
    // Cleanup particle animation if exists
    const canvas = document.getElementById('particleCanvas');
    if (canvas && canvas.particleAnimation) {
        canvas.particleAnimation.destroy();
    }
});
// ===================================
// Industries Carousel Functionality
// ===================================

function initializeIndustriesCarousel() {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const leftArrow = document.querySelector('.carousel-arrow-left');
    const rightArrow = document.querySelector('.carousel-arrow-right');
    
    if (!track || slides.length === 0) return;
    
    let currentSlide = 0;
    const slideCount = slides.length;
    let autoSlideInterval;
    
    // Move to specific slide
    function goToSlide(index) {
        // Update current slide
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = index;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        
        // Move track
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    
    // Next slide
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slideCount;
        goToSlide(nextIndex);
    }
    
    // Previous slide
    function prevSlide() {
        const prevIndex = (currentSlide - 1 + slideCount) % slideCount;
        goToSlide(prevIndex);
    }
    
    // Auto slide every 5 seconds
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Event Listeners
    rightArrow?.addEventListener('click', () => {
        nextSlide();
        stopAutoSlide();
        startAutoSlide();
    });
    
    leftArrow?.addEventListener('click', () => {
        prevSlide();
        stopAutoSlide();
        startAutoSlide();
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            stopAutoSlide();
            startAutoSlide();
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        }
    });
    
    // Pause on hover
    const carousel = document.querySelector('.industries-carousel');
    carousel?.addEventListener('mouseenter', stopAutoSlide);
    carousel?.addEventListener('mouseleave', startAutoSlide);
    
    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel?.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoSlide();
    });
    
    carousel?.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoSlide();
    });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) nextSlide();
        if (touchEndX > touchStartX + 50) prevSlide();
    }
    
    // Start auto slide
    startAutoSlide();
}
function initializeHeroVideo() {
    const video = document.querySelector('.hero-video');
    
    if (!video) return;
    
    // Ensure video plays on mobile
    video.play().catch(err => {
        console.log('Video autoplay failed:', err);
    });
    
    // Pause video when not in view (performance optimization)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                video.play();
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.25 });
    
    observer.observe(video);
}
