// Main JavaScript file - Common functionality across all pages

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    const themeIcon = themeToggle.querySelector('i');

    // Check for saved theme preference or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });
}

// Custom Cursor (for non-mobile devices)
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

// Only initialize cursor on non-mobile devices
if (window.innerWidth > 768 && cursor && cursorFollower) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 100);
    });

    // Add hover effects for buttons and links
    const interactiveElements = document.querySelectorAll('button, a, .btn, .service-card, .feature-card, .faq-question');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorFollower.classList.add('hover');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorFollower.classList.remove('hover');
        });
    });

    // Add text hover effect
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, li');
    
    textElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('text-hover');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('text-hover');
        });
    });
}

// Sticky Header
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }
});

// Particles.js Initialization
if (document.getElementById('particles-js')) {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: "#fdcb54"
            },
            shape: {
                type: "circle",
                stroke: {
                    width: 0,
                    color: "#000000"
                }
            },
            opacity: {
                value: 0.5,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#fdcb54",
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "grab"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 1
                    }
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });
}

// Social Proof Popups
const socialProofMessages = [
    { name: "Rohit", action: "submitted a form" },
    { name: "Simran", action: "booked a free consultation" },
    { name: "Arjun", action: "downloaded a growth plan" },
    { name: "Priya", action: "requested a quote" },
    { name: "Amit", action: "signed up for newsletter" },
    { name: "Neha", action: "started a project" }
];

function showSocialProof() {
    const socialProofContainer = document.getElementById('social-proof-container');
    if (!socialProofContainer) return;
    
    const randomIndex = Math.floor(Math.random() * socialProofMessages.length);
    const message = socialProofMessages[randomIndex];
    
    const popup = document.createElement('div');
    popup.className = 'social-proof-popup';
    popup.innerHTML = `
        <div class="social-proof-avatar">${message.name.charAt(0)}</div>
        <div class="social-proof-content">
            <h4>${message.name}</h4>
            <p>${message.action}</p>
        </div>
    `;
    
    socialProofContainer.appendChild(popup);
    
    // Show popup
    setTimeout(() => {
        popup.classList.add('active');
    }, 100);
    
    // Hide and remove popup after delay
    setTimeout(() => {
        popup.classList.remove('active');
        setTimeout(() => {
            popup.remove();
        }, 500);
    }, 5000);
}

// Show first social proof after 3 seconds
setTimeout(showSocialProof, 3000);

// Show subsequent social proofs randomly
setInterval(showSocialProof, 10000 + Math.random() * 15000);

// Fade in elements on scroll
const fadeInOnScroll = () => {
    const fadeElements = document.querySelectorAll('.service-card, .feature-card, .faq-item, .stat-card');
    
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
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.service-card, .feature-card, .faq-item, .stat-card');
    fadeElements.forEach(element => {
        element.style.opacity = "0";
        element.style.transform = "translateY(20px)";
        element.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    });
    
    window.addEventListener('scroll', fadeInOnScroll);
    fadeInOnScroll(); // Initial check
});

// Section fade-in on scroll
const sections = document.querySelectorAll('section');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, {
    threshold: 0.1
});

sections.forEach(section => {
    sectionObserver.observe(section);
});

// Close popups with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close chatbot
        const chatbotOverlay = document.getElementById('chatbot-overlay');
        if (chatbotOverlay && chatbotOverlay.classList.contains('active')) {
            chatbotOverlay.classList.remove('active');
        }
        
        // Close popup
        const popup = document.getElementById('popup');
        if (popup && popup.classList.contains('active')) {
            popup.classList.remove('active');
        }
    }
});
