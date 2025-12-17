// Initialize only on homepage
if (document.querySelector('.hero')) {

    // Add smooth badge transition when theme changes
const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
    // The badge will automatically transition due to CSS transitions
    // This ensures smooth animation
    const badge = document.querySelector('.hero-badge');
    
    // Add a temporary class to enhance the transition
    badge.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    
    // Remove the class after transition completes
    setTimeout(() => {
        badge.style.transition = '';
    }, 500);
});

// Ensure badge animates in after page load
window.addEventListener('load', () => {
    const badge = document.querySelector('.hero-badge');
    
    // Force reflow to restart animation if needed
    void badge.offsetWidth;
    
    // Add a class to trigger animation
    badge.style.animation = 'badgeFadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards';
});
      
    // Auto-typing text effect
    const words = [
  "Online",
  "Digitally",
  "Everywhere",
  "With Strategy",
  "With AI",
];

let wordIndex = 0;
let letterIndex = 0;
let isDeleting = false;

const typingText = document.getElementById("typing-text");

function startTyping() {
  const currentWord = words[wordIndex];

  if (!isDeleting) {
    // Typing
    typingText.textContent = currentWord.substring(0, letterIndex + 1);
    letterIndex++;

    if (letterIndex === currentWord.length) {
      setTimeout(() => (isDeleting = true), 1200);
    }
  } else {
    // Deleting
    typingText.textContent = currentWord.substring(0, letterIndex - 1);
    letterIndex--;

    if (letterIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }

  const speed = isDeleting ? 40 : 60;
  setTimeout(startTyping, speed);
}

window.addEventListener("DOMContentLoaded", startTyping);
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // Popup - Close when clicking on overlay or X button
    const popup = document.getElementById('popup');
    const popupClose = document.getElementById('popup-close');
    
    if (popup && popupClose) {
        // Show popup on page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                popup.classList.add('active');
            }, 1000);
        });
        
        // Close popup when clicking X
        popupClose.addEventListener('click', () => {
            popup.classList.remove('active');
        });
        
        // Close popup when clicking on overlay
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.classList.remove('active');
            }
        });
        
        // Show popup again after scrolling 40% down
        window.addEventListener('scroll', () => {
            const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            
            if (scrollPercentage > 40 && !popup.classList.contains('active') && !sessionStorage.getItem('popupShown')) {
                popup.classList.add('active');
                sessionStorage.setItem('popupShown', 'true');
            }
        });
    }
    
    // Chatbot Functionality
    const chatbotBtn = document.getElementById('chatbot-btn');
    const chatbotOverlay = document.getElementById('chatbot-overlay');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotOpen = document.getElementById('chatbot-open');
    
    if (chatbotBtn && chatbotOverlay && chatbotClose && chatbotOpen) {
        chatbotBtn.addEventListener('click', () => {
            chatbotOverlay.classList.add('active');
        });
        
        chatbotOpen.addEventListener('click', (e) => {
            e.preventDefault();
            chatbotOverlay.classList.add('active');
        });
        
        chatbotClose.addEventListener('click', () => {
            chatbotOverlay.classList.remove('active');
        });
        
        // Close chatbot with ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && chatbotOverlay.classList.contains('active')) {
                chatbotOverlay.classList.remove('active');
            }
        });
    }
    
    // Animated Counter
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
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(document.getElementById('projects-count'), 300);
                animateCounter(document.getElementById('leaders-count'), 150);
                animateCounter(document.getElementById('sectors-count'), 15);
                animateCounter(document.getElementById('clients-count'), 250);
                observer.unobserve(entry.target);
            }
        });
    });
    
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
    
    // Testimonial Carousel
    const testimonials = [
        {
            text: "InfoGrip transformed my gym completely. I used to get 5–7 enquiries a week, now I get 40+ consistent leads every single week.",
            author: "Rohit Sharma",
            role: "Fitness Coach (R-Fit Gym)"
        },
        {
            text: "We hired InfoGrip for social media marketing and within 30 days the page started getting reach like never before. Their reel editing is fire.",
            author: "Simran Kaur",
            role: "Beauty Salon Owner"
        },
        {
            text: "Our real estate project was stuck for months. After InfoGrip's lead generation funnel, we closed 11 bookings in 2 months.",
            author: "Rajeev Mehra",
            role: "Real Estate Agency"
        },
        {
            text: "I didn't expect results this fast. Their ads + chatbot automation makes our business run on auto-pilot now.",
            author: "Ananya Gupta",
            role: "Online Coach"
        },
        {
            text: "We saved so much time after they set up WhatsApp automation. Every customer gets replied instantly.",
            author: "Karan Patel",
            role: "Restaurant Owner (Delhi)"
        },
        {
            text: "The team is super supportive. They helped me redesign my website and guided me on how to scale my business online.",
            author: "Megha Arora",
            role: "Boutique Owner"
        }
    ];
    
    const testimonialTrack = document.getElementById('testimonial-track');
    const carouselNav = document.getElementById('carousel-nav');
    
    if (testimonialTrack && carouselNav) {
        let currentSlide = 0;
        
        // Create testimonial slides
        testimonials.forEach((testimonial, index) => {
            const slide = document.createElement('div');
            slide.className = 'testimonial-slide';
            slide.innerHTML = `
                <div class="testimonial-card">
                    <div class="testimonial-stars">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <p class="testimonial-text">"${testimonial.text}"</p>
                    <div class="testimonial-author">
                        <div class="testimonial-avatar">${testimonial.author.charAt(0)}</div>
                        <div class="testimonial-info">
                            <h4>${testimonial.author}</h4>
                            <p>${testimonial.role}</p>
                        </div>
                    </div>
                </div>
            `;
            testimonialTrack.appendChild(slide);
      // Features Carousel with Responsive Cards
const featuresData = [
    {
        icon: "fas fa-chart-line",
        title: "Result-driven Strategies",
        description: "We focus on delivering measurable results that align with your business goals."
    },
    {
        icon: "fas fa-paint-brush",
        title: "Modern Content Creation",
        description: "Our team creates engaging, high-quality content that resonates with your audience."
    },
    {
        icon: "fas fa-chart-pie",
        title: "Advanced Analytics",
        description: "We use data-driven insights to optimize campaigns and maximize performance."
    },
    {
        icon: "fas fa-rocket",
        title: "Fast Project Execution",
        description: "We deliver projects on time without compromising on quality or attention to detail."
    },
    {
        icon: "fas fa-comments",
        title: "Professional Communication",
        description: "We maintain transparent and regular communication throughout our collaboration."
    },
    {
        icon: "fas fa-building",
        title: "Long-term Brand Building",
        description: "We focus on sustainable growth strategies that build lasting brand value."
    }
];

const featuresTrack = document.getElementById('features-track');
const featuresDots = document.getElementById('features-dots');
let currentSlide = 0;
let slidesPerView = 3;
let totalSlides = featuresData.length;
let carouselInterval;

// Initialize carousel
function initCarousel() {
    // Clear existing content
    featuresTrack.innerHTML = '';
    featuresDots.innerHTML = '';
    
    // Update slides per view based on screen width
    updateSlidesPerView();
    
    // Create slides
    featuresData.forEach((feature, index) => {
        // Create slide
        const slide = document.createElement('div');
        slide.className = 'feature-slide';
        slide.innerHTML = `
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="${feature.icon}"></i>
                </div>
                <h3>${feature.title}</h3>
                <p>${feature.description}</p>
            </div>
        `;
        featuresTrack.appendChild(slide);
        
        // Create dot
        const dot = document.createElement('button');
        dot.className = 'features-dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        featuresDots.appendChild(dot);
    });
    
    // Reset to first slide
    goToSlide(0);
    
    // Start auto-slide
    startAutoSlide();
}

// Update slides per view based on screen width
function updateSlidesPerView() {
    if (window.innerWidth <= 768) {
        slidesPerView = 1;
    } else if (window.innerWidth <= 1200) {
        slidesPerView = 2;
    } else {
        slidesPerView = 3;
    }
}

// Go to specific slide
function goToSlide(slideIndex) {
    const maxSlide = Math.max(0, totalSlides - slidesPerView);
    currentSlide = Math.min(Math.max(0, slideIndex), maxSlide);
    
    // Calculate translateX value
    const slideWidth = 100 / slidesPerView;
    const gapPercentage = (25 / featuresTrack.offsetWidth) * 100; // 25px gap
    const translateX = -currentSlide * (slideWidth + gapPercentage);
    
    featuresTrack.style.transform = `translateX(${translateX}%)`;
    
    // Update active dots
    updateDots();
}

// Update active dots
function updateDots() {
    document.querySelectorAll('.features-dot').forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Next slide
function nextSlide() {
    const maxSlide = Math.max(0, totalSlides - slidesPerView);
    if (currentSlide >= maxSlide) {
        goToSlide(0);
    } else {
        goToSlide(currentSlide + 1);
    }
}

// Previous slide
function prevSlide() {
    const maxSlide = Math.max(0, totalSlides - slidesPerView);
    if (currentSlide <= 0) {
        goToSlide(maxSlide);
    } else {
        goToSlide(currentSlide - 1);
    }
}

// Auto-slide functionality
function startAutoSlide() {
    clearInterval(carouselInterval);
    carouselInterval = setInterval(nextSlide, 4000);
}

function stopAutoSlide() {
    clearInterval(carouselInterval);
}

// Event Listeners
document.querySelector('.features-arrow-prev').addEventListener('click', () => {
    stopAutoSlide();
    prevSlide();
    startAutoSlide();
});

document.querySelector('.features-arrow-next').addEventListener('click', () => {
    stopAutoSlide();
    nextSlide();
    startAutoSlide();
});

// Pause auto-slide on hover
featuresTrack.addEventListener('mouseenter', stopAutoSlide);
featuresTrack.addEventListener('mouseleave', startAutoSlide);

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        updateSlidesPerView();
        initCarousel();
    }, 250);
});

// Initialize carousel on load
window.addEventListener('load', initCarousel);

// Also initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
} else {
    initCarousel();
}
            
            // Create navigation dots
            const dot = document.createElement('div');
            dot.className = 'carousel-dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
            carouselNav.appendChild(dot);
        });
        
        // Carousel navigation functions
        function goToSlide(index) {
            currentSlide = index;
            testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Update active dot
            document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % testimonials.length;
            goToSlide(currentSlide);
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
            goToSlide(currentSlide);
        }
        
        // Auto-advance carousel
        setInterval(nextSlide, 5000);
        
        // Add event listeners for arrow buttons
        const prevArrow = document.querySelector('.carousel-arrow.prev');
        const nextArrow = document.querySelector('.carousel-arrow.next');
        
        if (prevArrow) prevArrow.addEventListener('click', prevSlide);
        if (nextArrow) nextArrow.addEventListener('click', nextSlide);
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
        
        const container = document.getElementById('social-proof-container');
        if (container) {
            container.appendChild(popup);
            
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
    }
    
    // Show first social proof after 3 seconds
    setTimeout(showSocialProof, 3000);
    
    // Show subsequent social proofs randomly
    setInterval(showSocialProof, 10000 + Math.random() * 15000);
    
    // Fade in elements on scroll
    const fadeElements = document.querySelectorAll('.service-card, .feature-card, .faq-item, .stat-card');
    
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
    
    window.addEventListener('scroll', fadeInOnScroll);
    window.addEventListener('load', fadeInOnScroll);
}
