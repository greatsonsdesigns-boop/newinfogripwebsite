// About Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Scroll Animation for About Page
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    // Observe elements for animation on About page
    const animatedElements = document.querySelectorAll('.story-image, .mission-card, .team-card, .feature-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Animated Counter for Impact Section
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }

    // Initialize counters when in view
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(document.getElementById('projects-count'), 50);
                animateCounter(document.getElementById('clients-count'), 40);
                animateCounter(document.getElementById('years-count'), 2);
                animateCounter(document.getElementById('audience-count'), 100);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const impactSection = document.querySelector('.impact-section');
    if (impactSection) {
        counterObserver.observe(impactSection);
    }

    // Team Card Hover Effects
    const teamCards = document.querySelectorAll('.team-card');
    teamCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            if (card.classList.contains('in-view')) {
                card.style.transform = 'translateY(0)';
            }
        });
    });

    // Mission Card Hover Effects
    const missionCards = document.querySelectorAll('.mission-card');
    missionCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            if (card.classList.contains('in-view')) {
                card.style.transform = 'translateY(0)';
            }
        });
    });

    // Feature Card Hover Effects
    const featureCards = document.querySelectorAll('.why-choose-section .feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            if (card.classList.contains('in-view')) {
                card.style.transform = 'translateY(0)';
            }
        });
    });

    // Story Image Hover Effect
    const storyImage = document.querySelector('.story-image');
    if (storyImage) {
        storyImage.addEventListener('mouseenter', () => {
            const img = storyImage.querySelector('img');
            img.style.transform = 'scale(1.05)';
        });
        
        storyImage.addEventListener('mouseleave', () => {
            const img = storyImage.querySelector('img');
            img.style.transform = 'scale(1)';
        });
    }

    // Newsletter Form Submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // In a real application, you would send this to your server
                console.log('Newsletter subscription:', email);
                alert('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
            }
        });
    }

    // Initialize animations on page load for already visible elements
    function checkInitialVisibility() {
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            
            if (rect.top <= windowHeight * 0.9) {
                el.classList.add('in-view');
            }
        });
    }

    // Check visibility on page load
    checkInitialVisibility();

    // Update counter values based on actual data
    const counterValues = {
        projects: 50,     // Update with actual number
        clients: 40,      // Update with actual number
        years: 2,         // Update with actual number
        audience: 100     // Update with actual number
    };

    // You can update these values dynamically from your database or API
    // Example: fetch('/api/stats').then(response => response.json()).then(data => {...});
});
