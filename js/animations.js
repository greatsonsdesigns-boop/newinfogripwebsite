// Animations for Service Pages
const ServiceAnimations = {
    init: function() {
        this.setupFloatingShapes();
        this.setupParallaxEffects();
        this.setupScrollAnimations();
    },

    // Setup floating shapes animation
    setupFloatingShapes: function() {
        const shapes = document.querySelectorAll('.service-shape');
        shapes.forEach((shape, index) => {
            // Set random initial position and animation delay
            const randomX = Math.random() * 100;
            const randomY = Math.random() * 100;
            const randomDelay = Math.random() * 5;
            
            shape.style.left = `${randomX}%`;
            shape.style.top = `${randomY}%`;
            shape.style.animationDelay = `${randomDelay}s`;
        });
    },

    // Setup parallax effects
    setupParallaxEffects: function() {
        const hero = document.querySelector('.service-hero');
        if (hero) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                hero.style.transform = `translate3d(0px, ${rate}px, 0px)`;
            });
        }
    },

    // Setup scroll animations
    setupScrollAnimations: function() {
        const animateOnScroll = function() {
            const elements = document.querySelectorAll('.section-title, .overview-content, .cta-content');
            
            elements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.3;
                
                if (elementPosition < screenPosition) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        };

        // Set initial state
        const elements = document.querySelectorAll('.section-title, .overview-content, .cta-content');
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });

        window.addEventListener('scroll', animateOnScroll);
        window.addEventListener('load', animateOnScroll);
    },

    // Add hover animations to cards
    setupCardAnimations: function() {
        const cards = document.querySelectorAll('.carousel-card, .step-content, .addon-tag');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.boxShadow = '';
                if (!this.classList.contains('active')) {
                    this.style.transform = '';
                }
            });
        });
    }
};

// Initialize animations
document.addEventListener('DOMContentLoaded', function() {
    ServiceAnimations.init();
    ServiceAnimations.setupCardAnimations();
});
