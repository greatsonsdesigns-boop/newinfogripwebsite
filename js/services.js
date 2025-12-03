// Services Common JavaScript
const Services = {
    // Initialize service page
    init: function() {
        this.animateProcessSteps();
        this.setupFadeInAnimations();
        this.setupCTASidebar();
    },

    // Animate process steps on scroll
    animateProcessSteps: function() {
        const processSteps = document.querySelectorAll('.process-step');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        processSteps.forEach(step => {
            observer.observe(step);
        });
    },

    // Setup fade in animations
    setupFadeInAnimations: function() {
        const fadeElements = document.querySelectorAll('.carousel-card, .process-step, .addon-tag');

        const fadeInOnScroll = () => {
            fadeElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.style.opacity = "1";
                    element.style.transform = "translateY(0)";
                }
            });
        };

        // Set initial state for fade elements
        fadeElements.forEach(element => {
            element.style.opacity = "0";
            element.style.transform = "translateY(20px)";
            element.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        });

        window.addEventListener('scroll', fadeInOnScroll);
        window.addEventListener('load', fadeInOnScroll);
    },

    // Setup CTA sidebar interactions
    setupCTASidebar: function() {
        const ctaSidebar = document.getElementById('cta-sidebar');
        if (ctaSidebar) {
            // Add hover effect to buttons in sidebar
            const buttons = ctaSidebar.querySelectorAll('.btn');
            buttons.forEach(button => {
                button.addEventListener('mouseenter', () => {
                    button.style.transform = 'translateY(-3px)';
                });
                button.addEventListener('mouseleave', () => {
                    button.style.transform = 'translateY(0)';
                });
            });
        }
    },

    // Typing text effect
    createTypingEffect: function(elementId, texts, speed = 200, pause = 2000) {
        const typingText = document.getElementById(elementId);
        if (!typingText) return;

        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const type = () => {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingText.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingText.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(type, pause);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(type, 500);
            } else {
                setTimeout(type, isDeleting ? 100 : speed);
            }
        };

        type();
    }
};

// Initialize services when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    Services.init();
});

// Export for use in individual service pages
window.Services = Services;
