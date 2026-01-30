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

        // Auto-typing text effect
        const typingText = document.getElementById('typing-text');
        const texts = ['Growth', 'Engagement', 'Branding', 'Viral Strategy', 'Content Excellence', '24/7 Management'];
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

        // Carousel Functionality
        const features = [
            {
                icon: 'fas fa-pen-fancy',
                title: 'Daily Post Creation',
                description: 'Consistent, high-quality content tailored to your brand voice and audience.'
            },
            {
                icon: 'fas fa-comments',
                title: 'Community Engagement',
                description: 'Active interaction with your audience to build relationships and loyalty.'
            },
            {
                icon: 'fas fa-hashtag',
                title: 'Hashtag Strategy',
                description: 'Strategic hashtag research and implementation to maximize reach.'
            },
            {
                icon: 'fas fa-film',
                title: 'Viral Reel Editing',
                description: 'Professional video editing optimized for maximum engagement and virality.'
            },
            {
                icon: 'fas fa-user-check',
                title: 'Profile Optimization',
                description: 'Complete profile makeover to maximize conversions and brand consistency.'
            },
            {
                icon: 'fas fa-chart-bar',
                title: 'Monthly Growth Reports',
                description: 'Detailed analytics and insights to track performance and growth.'
            },
            {
                icon: 'fas fa-camera',
                title: 'Story Design & Posting',
                description: 'Daily story content to keep your audience engaged and connected.'
            },
            {
                icon: 'fas fa-keyboard',
                title: 'Caption & Copywriting',
                description: 'Compelling copy that drives engagement and tells your brand story.'
            }
        ];

        const carousel = document.getElementById('carousel');
        const carouselNav = document.getElementById('carousel-nav');
        let currentSlide = 0;

        // Create carousel cards
        features.forEach((feature, index) => {
            const card = document.createElement('div');
            card.className = 'carousel-card';
            if (index === 0) card.classList.add('active');
            card.innerHTML = `
                <div class="carousel-icon">
                    <i class="${feature.icon}"></i>
                </div>
                <h3>${feature.title}</h3>
                <p>${feature.description}</p>
            `;
            carousel.appendChild(card);

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
            carousel.style.transform = `translateX(-${currentSlide * 33.333}%)`;
            
            // Update active card
            document.querySelectorAll('.carousel-card').forEach((card, i) => {
                card.classList.toggle('active', i === currentSlide);
            });
            
            // Update active dot
            document.querySelectorAll('#carousel-nav .carousel-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % features.length;
            goToSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + features.length) % features.length;
            goToSlide(currentSlide);
        }

        // Auto-advance carousel
        setInterval(nextSlide, 4000);

        // Add event listeners for arrow buttons
        document.querySelector('.carousel-arrow.prev').addEventListener('click', prevSlide);
        document.querySelector('.carousel-arrow.next').addEventListener('click', nextSlide);

        // Animate process steps on scroll
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

        // Fade in elements on scroll
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