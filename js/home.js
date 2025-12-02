// Homepage specific JavaScript

// Auto-typing text effect
document.addEventListener('DOMContentLoaded', function() {
    const typingText = document.getElementById('typing-text');
    if (typingText) {
        const texts = ['Jaipur', 'India', 'Your City'];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeText() {
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
                setTimeout(typeText, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(typeText, 500);
            } else {
                setTimeout(typeText, isDeleting ? 100 : 200);
            }
        }

        // Start typing effect
        typeText();
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
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const projectsCount = document.getElementById('projects-count');
                    const leadersCount = document.getElementById('leaders-count');
                    const sectorsCount = document.getElementById('sectors-count');
                    const clientsCount = document.getElementById('clients-count');
                    
                    if (projectsCount) animateCounter(projectsCount, 300);
                    if (leadersCount) animateCounter(leadersCount, 150);
                    if (sectorsCount) animateCounter(sectorsCount, 15);
                    if (clientsCount) animateCounter(clientsCount, 250);
                    
                    observer.unobserve(entry.target);
                }
            });
        });

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

    // Premium Popup
    const popup = document.getElementById('popup');
    const popupClose = document.getElementById('popup-close');

    // Show popup on page load
    if (popup) {
        setTimeout(() => {
            popup.classList.add('active');
        }, 1000);

        // Close popup when clicking X
        if (popupClose) {
            popupClose.addEventListener('click', () => {
                popup.classList.remove('active');
            });
        }

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
});
