     // ===== THEME TOGGLE =====
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

        // ===== MOBILE MENU TOGGLE =====
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

        // ===== STICKY HEADER =====
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            header.classList.toggle('scrolled', window.scrollY > 50);
        });

        // ===== SERVICES CAROUSEL =====
        const servicesTrack = document.getElementById('services-track');
        const servicesSlides = document.querySelectorAll('.service-slide');
        const servicesPrevBtn = document.querySelector('.services-carousel-container .prev');
        const servicesNextBtn = document.querySelector('.services-carousel-container .next');
        const servicesNav = document.getElementById('services-nav');

        let currentServiceSlide = 0;
        const totalServiceSlides = servicesSlides.length;
        let slidesPerView = 3;

        // Update slides per view based on screen size
        function updateSlidesPerView() {
            if (window.innerWidth <= 768) {
                slidesPerView = 1;
            } else if (window.innerWidth <= 992) {
                slidesPerView = 2;
            } else {
                slidesPerView = 3;
            }
            updateServiceCarousel();
        }

        // Create navigation dots for services
        function createServiceDots() {
            servicesNav.innerHTML = '';
            const totalDots = Math.ceil(totalServiceSlides / slidesPerView);
            
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('div');
                dot.className = 'carousel-dot';
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    goToServiceSlide(i * slidesPerView);
                });
                servicesNav.appendChild(dot);
            }
        }

        // Update services carousel
        function updateServiceCarousel() {
            const slideWidth = servicesSlides[0].offsetWidth + 30; // including gap
            servicesTrack.style.transform = `translateX(-${currentServiceSlide * slideWidth}px)`;
            
            // Update dots
            const currentDot = Math.floor(currentServiceSlide / slidesPerView);
            document.querySelectorAll('.services-carousel-container .carousel-dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentDot);
            });
        }

        // Go to specific slide
        function goToServiceSlide(index) {
            currentServiceSlide = Math.min(Math.max(index, 0), totalServiceSlides - slidesPerView);
            updateServiceCarousel();
        }

        // Next slide
        function nextServiceSlide() {
            if (currentServiceSlide < totalServiceSlides - slidesPerView) {
                currentServiceSlide += slidesPerView;
            } else {
                currentServiceSlide = 0;
            }
            updateServiceCarousel();
        }

        // Previous slide
        function prevServiceSlide() {
            if (currentServiceSlide > 0) {
                currentServiceSlide -= slidesPerView;
            } else {
                currentServiceSlide = Math.max(0, totalServiceSlides - slidesPerView);
            }
            updateServiceCarousel();
        }

        // Initialize services carousel
        updateSlidesPerView();
        createServiceDots();

        // Event listeners for services carousel
        servicesPrevBtn.addEventListener('click', prevServiceSlide);
        servicesNextBtn.addEventListener('click', nextServiceSlide);

        // Auto-advance services carousel
        let servicesCarouselInterval = setInterval(nextServiceSlide, 5000);

        // Pause auto-advance on hover
        servicesTrack.addEventListener('mouseenter', () => {
            clearInterval(servicesCarouselInterval);
        });

        servicesTrack.addEventListener('mouseleave', () => {
            servicesCarouselInterval = setInterval(nextServiceSlide, 5000);
        });

        // ===== CLIENTS CAROUSEL =====
        const clientsTrack = document.getElementById('clients-track');
        const clientSlides = document.querySelectorAll('.client-slide');
        const clientsPrevBtn = document.querySelector('.clients-carousel-container .prev');
        const clientsNextBtn = document.querySelector('.clients-carousel-container .next');
        const clientsNav = document.getElementById('clients-nav');

        let currentClientSlide = 0;
        const totalClientSlides = clientSlides.length;

        // Create navigation dots for clients
        function createClientDots() {
            clientsNav.innerHTML = '';
            
            for (let i = 0; i < totalClientSlides; i++) {
                const dot = document.createElement('div');
                dot.className = 'carousel-dot';
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    goToClientSlide(i);
                });
                clientsNav.appendChild(dot);
            }
        }

        // Update clients carousel
        function updateClientCarousel() {
            clientsTrack.style.transform = `translateX(-${currentClientSlide * 100}%)`;
            
            // Update dots
            document.querySelectorAll('.clients-carousel-container .carousel-dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentClientSlide);
            });
        }

        // Go to specific slide
        function goToClientSlide(index) {
            currentClientSlide = Math.min(Math.max(index, 0), totalClientSlides - 1);
            updateClientCarousel();
        }

        // Next slide
        function nextClientSlide() {
            if (currentClientSlide < totalClientSlides - 1) {
                currentClientSlide++;
            } else {
                currentClientSlide = 0;
            }
            updateClientCarousel();
        }

        // Previous slide
        function prevClientSlide() {
            if (currentClientSlide > 0) {
                currentClientSlide--;
            } else {
                currentClientSlide = totalClientSlides - 1;
            }
            updateClientCarousel();
        }

        // Initialize clients carousel
        createClientDots();
        updateClientCarousel();

        // Event listeners for clients carousel
        clientsPrevBtn.addEventListener('click', prevClientSlide);
        clientsNextBtn.addEventListener('click', nextClientSlide);

        // Auto-advance clients carousel
        let clientsCarouselInterval = setInterval(nextClientSlide, 6000);

        // Pause auto-advance on hover
        clientsTrack.addEventListener('mouseenter', () => {
            clearInterval(clientsCarouselInterval);
        });

        clientsTrack.addEventListener('mouseleave', () => {
            clientsCarouselInterval = setInterval(nextClientSlide, 6000);
        });

        // ===== FAQ ACCORDION =====
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

        // ===== POPUP =====
        const popup = document.getElementById('popup');
        const popupClose = document.getElementById('popup-close');

        // Show popup on page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                popup.classList.add('active');
            }, 1500);
        });

        popupClose.addEventListener('click', () => {
            popup.classList.remove('active');
        });

        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.classList.remove('active');
            }
        });

        // ===== RESPONSIVE UPDATES =====
        window.addEventListener('resize', () => {
            updateSlidesPerView();
            createServiceDots();
            updateServiceCarousel();
        });

        // ===== ANIMATIONS =====
        // Fade in elements on scroll
        const fadeElements = document.querySelectorAll('.service-card, .pricing-card, .faq-item');

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

        // ===== CHATBOT FUNCTIONALITY =====
        document.getElementById('chatbot-btn').addEventListener('click', (e) => {
            e.preventDefault();
            window.open('https://wa.me/919928140288', '_blank');
        });

        // ===== INITIALIZE =====
        window.addEventListener('scroll', fadeInOnScroll);
        window.addEventListener('load', fadeInOnScroll);

        // Show popup again after scrolling 50% down
        window.addEventListener('scroll', () => {
            const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            
            if (scrollPercentage > 50 && !popup.classList.contains('active') && !sessionStorage.getItem('jaipurPopupShown')) {
                popup.classList.add('active');
                sessionStorage.setItem('jaipurPopupShown', 'true');
            }
        });
