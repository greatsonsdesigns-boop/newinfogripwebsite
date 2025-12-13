// Theme Toggle
        const themeToggle = document.getElementById('theme-toggle');
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

        // Mobile Menu Toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-menu a').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));

        // Sticky Header
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            header.classList.toggle('scrolled', window.scrollY > 50);
        });

        // Scroll Animation
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

        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.story-image, .mission-card, .team-card, .feature-card');
        animatedElements.forEach(el => {
            observer.observe(el);
        });

        // Team Tabs Functionality
        const teamTabs = document.querySelectorAll('.team-tab');
        const teamCards = document.querySelectorAll('.team-card');
        
        teamTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                teamTabs.forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                tab.classList.add('active');
                
                const teamType = tab.getAttribute('data-team');
                
                // Show/hide team cards based on selected tab
                teamCards.forEach(card => {
                    if (teamType === 'all' || card.getAttribute('data-team') === teamType) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });

        // Carousel Functionality
        const carouselTrack = document.getElementById('features-carousel-track');
        const carouselPrev = document.getElementById('carousel-prev');
        const carouselNext = document.getElementById('carousel-next');
        const carouselDots = document.getElementById('carousel-dots');
        
        const featureCards = document.querySelectorAll('.feature-card');
        const cardCount = featureCards.length;
        let currentIndex = 0;
        let cardsPerView = 3;
        
        // Calculate cards per view based on screen width
        function calculateCardsPerView() {
            if (window.innerWidth <= 768) {
                return 1;
            } else if (window.innerWidth <= 992) {
                return 2;
            } else {
                return 3;
            }
        }
        
        // Create dots
        function createDots() {
            carouselDots.innerHTML = '';
            cardsPerView = calculateCardsPerView();
            const dotCount = Math.ceil(cardCount / cardsPerView);
            
            for (let i = 0; i < dotCount; i++) {
                const dot = document.createElement('div');
                dot.className = 'carousel-dot';
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    goToSlide(i);
                });
                carouselDots.appendChild(dot);
            }
        }
        
        // Update carousel position
        function updateCarousel() {
            const cardWidth = featureCards[0].offsetWidth + 30; // card width + gap
            const offset = -currentIndex * cardsPerView * cardWidth;
            carouselTrack.style.transform = `translateX(${offset}px)`;
            
            // Update dots
            const dots = document.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === Math.floor(currentIndex / cardsPerView));
            });
        }
        
        // Go to specific slide
        function goToSlide(index) {
            currentIndex = index * cardsPerView;
            updateCarousel();
        }
        
        // Next slide
        function nextSlide() {
            if (currentIndex < cardCount - cardsPerView) {
                currentIndex += cardsPerView;
            } else {
                currentIndex = 0;
            }
            updateCarousel();
        }
        
        // Previous slide
        function prevSlide() {
            if (currentIndex > 0) {
                currentIndex -= cardsPerView;
            } else {
                currentIndex = Math.floor((cardCount - 1) / cardsPerView) * cardsPerView;
            }
            updateCarousel();
        }
        
        // Initialize carousel
        function initCarousel() {
            createDots();
            updateCarousel();
        }
        
        // Event listeners
        carouselPrev.addEventListener('click', prevSlide);
        carouselNext.addEventListener('click', nextSlide);
        
        // Auto slide
        let autoSlideInterval = setInterval(nextSlide, 5000);
        
        // Pause auto slide on hover
        carouselTrack.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        
        carouselTrack.addEventListener('mouseleave', () => {
            autoSlideInterval = setInterval(nextSlide, 5000);
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            createDots();
            updateCarousel();
        });
        
        // Initialize on load
        window.addEventListener('load', initCarousel);
        
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
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(document.getElementById('projects-count'), 150);
                    animateCounter(document.getElementById('clients-count'), 120);
                    animateCounter(document.getElementById('years-count'), 5);
                    animateCounter(document.getElementById('audience-count'), 500);
                    counterObserver.unobserve(entry.target);
                }
            });
        });

        counterObserver.observe(document.querySelector('.impact-section'));
