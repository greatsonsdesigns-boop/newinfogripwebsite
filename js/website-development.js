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
        const texts = ['Innovation', 'Transformation', 'Pixel Perfection', 'Code Crafting', 'Digital Magic'];
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
                icon: 'fas fa-palette',
                title: 'Custom UI/UX Design',
                description: 'Beautiful, user-friendly interfaces designed to engage visitors and drive conversions.'
            },
            {
                icon: 'fas fa-mobile-alt',
                title: 'Mobile Responsive Layouts',
                description: 'Seamless experience across all devices - desktop, tablet, and mobile.'
            },
            {
                icon: 'fas fa-search',
                title: 'SEO Optimization',
                description: 'Built with SEO best practices to rank higher on search engines.'
            },
            {
                icon: 'fas fa-bolt',
                title: 'Fast Loading Speeds',
                description: 'Optimized for performance with fast loading times and smooth interactions.'
            },
            {
                icon: 'fas fa-shield-alt',
                title: 'Secure Hosting Setup',
                description: 'Secure hosting environment with SSL certificates and regular backups.'
            },
            {
                icon: 'fas fa-cogs',
                title: 'CMS Integration',
                description: 'Easy-to-use content management system for updating your website.'
            },
            {
                icon: 'fas fa-tools',
                title: 'Website Maintenance Plans',
                description: 'Ongoing support and maintenance to keep your website running smoothly.'
            },
            {
                icon: 'fas fa-shopping-cart',
                title: 'E-Commerce Development',
                description: 'Full-featured online stores with payment integration and inventory management.'
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

        // Advanced Features Slider
        const advancedFeatures = [
            {
                icon: 'fas fa-laptop-code',
                title: 'Custom Web Apps',
                description: 'Interactive web applications with advanced functionality and user management.'
            },
            {
                icon: 'fas fa-chart-line',
                title: 'Admin Dashboards',
                description: 'Comprehensive dashboards for data visualization and business analytics.'
            },
            {
                icon: 'fas fa-plug',
                title: 'API Integrations',
                description: 'Seamless integration with third-party services and payment gateways.'
            },
            {
                icon: 'fas fa-mobile',
                title: 'App-Style Websites',
                description: 'Progressive Web Apps that deliver app-like experiences in browsers.'
            },
            {
                icon: 'fas fa-building',
                title: 'Corporate Website Redesigns',
                description: 'Modernize your corporate website with contemporary design and functionality.'
            },
            {
                icon: 'fas fa-database',
                title: 'Database Integration',
                description: 'Custom database solutions for managing complex data and user information.'
            }
        ];

        const advancedSlider = document.getElementById('advanced-slider');
        const advancedNav = document.getElementById('advanced-nav');
        let currentAdvanced = 0;

        // Create advanced feature cards
        advancedFeatures.forEach((feature, index) => {
            const card = document.createElement('div');
            card.className = 'advanced-feature-card';
            if (index === 0) card.classList.add('active');
            card.innerHTML = `
                <div class="advanced-feature-icon">
                    <i class="${feature.icon}"></i>
                </div>
                <h3>${feature.title}</h3>
                <p>${feature.description}</p>
            `;
            advancedSlider.appendChild(card);

            // Create navigation dots
            const dot = document.createElement('div');
            dot.className = 'advanced-dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToAdvanced(index);
            });
            advancedNav.appendChild(dot);
        });

        // Advanced slider navigation functions
        function goToAdvanced(index) {
            currentAdvanced = index;
            advancedSlider.style.transform = `translateX(-${currentAdvanced * 33.333}%)`;
            
            // Update active card
            document.querySelectorAll('.advanced-feature-card').forEach((card, i) => {
                card.classList.toggle('active', i === currentAdvanced);
            });
            
            // Update active dot
            document.querySelectorAll('#advanced-nav .advanced-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentAdvanced);
            });
        }

        function nextAdvanced() {
            currentAdvanced = (currentAdvanced + 1) % advancedFeatures.length;
            goToAdvanced(currentAdvanced);
        }

        function prevAdvanced() {
            currentAdvanced = (currentAdvanced - 1 + advancedFeatures.length) % advancedFeatures.length;
            goToAdvanced(currentAdvanced);
        }

        // Auto-advance advanced features
        setInterval(nextAdvanced, 4000);

        // Add event listeners for arrow buttons
        document.querySelector('.advanced-arrow.prev').addEventListener('click', prevAdvanced);
        document.querySelector('.advanced-arrow.next').addEventListener('click', nextAdvanced);

        // Fade in elements on scroll
        const fadeElements = document.querySelectorAll('.feature-card, .advanced-feature-card');

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