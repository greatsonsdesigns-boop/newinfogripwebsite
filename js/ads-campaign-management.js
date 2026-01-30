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
        const texts = ['Management', 'Optimization', 'Performance', 'ROI', 'Scaling'];
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

        // Features Carousel
        const features = [
            {
                icon: 'fas fa-chart-line',
                title: 'Campaign Strategy & Planning',
                description: 'Comprehensive campaign planning with clear objectives, KPIs, and budget allocation.'
            },
            {
                icon: 'fas fa-users',
                title: 'Target Audience Research',
                description: 'In-depth audience analysis to identify and target your ideal customers.'
            },
            {
                icon: 'fas fa-paint-brush',
                title: 'Ad Creative Design',
                description: 'Eye-catching ad creatives designed to stop scrolling and drive engagement.'
            },
            {
                icon: 'fas fa-vial',
                title: 'A/B Testing & Experiments',
                description: 'Continuous testing of ad copy, visuals, and audiences to optimize performance.'
            },
            {
                icon: 'fas fa-cogs',
                title: 'Daily Optimization',
                description: 'Regular monitoring and optimization to improve results and reduce costs.'
            },
            {
                icon: 'fas fa-code',
                title: 'Conversion Tracking Setup',
                description: 'Pixel and event tracking implementation to measure campaign performance accurately.'
            },
            {
                icon: 'fas fa-sync-alt',
                title: 'Retargeting Campaigns',
                description: 'Strategic retargeting to re-engage website visitors and boost conversions.'
            },
            {
                icon: 'fas fa-chart-bar',
                title: 'Monthly Performance Reports',
                description: 'Detailed monthly reports with insights, analysis, and recommendations.'
            }
        ];

        const featuresCarousel = document.getElementById('features-carousel');
        const featuresNav = document.getElementById('features-nav');
        let currentFeature = 0;

        // Create feature slides
        features.forEach((feature, index) => {
            const slide = document.createElement('div');
            slide.className = 'feature-card';
            slide.innerHTML = `
                <div class="feature-icon">
                    <i class="${feature.icon}"></i>
                </div>
                <div class="feature-content">
                    <h3>${feature.title}</h3>
                    <p>${feature.description}</p>
                </div>
            `;
            featuresCarousel.appendChild(slide);

            // Create navigation dots
            const dot = document.createElement('div');
            dot.className = 'carousel-dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToFeature(index);
            });
            featuresNav.appendChild(dot);
        });

        // Carousel navigation functions
        function goToFeature(index) {
            currentFeature = index;
            featuresCarousel.style.transform = `translateX(-${currentFeature * 100}%)`;
            
            // Update active dot
            document.querySelectorAll('#features-nav .carousel-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentFeature);
            });
        }

        function nextFeature() {
            currentFeature = (currentFeature + 1) % features.length;
            goToFeature(currentFeature);
        }

        function prevFeature() {
            currentFeature = (currentFeature - 1 + features.length) % features.length;
            goToFeature(currentFeature);
        }

        // Auto-advance carousel
        setInterval(nextFeature, 5000);

        // Add event listeners for arrow buttons
        document.querySelector('.carousel-arrow.prev').addEventListener('click', prevFeature);
        document.querySelector('.carousel-arrow.next').addEventListener('click', nextFeature);

        // Fade in elements on scroll
        const fadeElements = document.querySelectorAll('.feature-card, .addon-tag');

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