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

        // Auto-typing text effect
        const typingText = document.getElementById('typing-text');
        const texts = ['Affordable', 'Competitive', 'Budget-friendly', 'Reasonable'];
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

        // Animated Counter for Statistics
        function animateCounter(elementId, target, suffix = '', duration = 2000) {
            const element = document.getElementById(elementId);
            let start = 0;
            const increment = target / (duration / 16);
            
            const timer = setInterval(() => {
                start += increment;
                if (start >= target) {
                    element.textContent = target + suffix;
                    clearInterval(timer);
                } else {
                    if (suffix === '%') {
                        element.textContent = Math.floor(start) + suffix;
                    } else {
                        element.textContent = Math.floor(start);
                    }
                }
            }, 16);
        }

        // Trigger number animation when hero section is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate all statistics
                    animateCounter('stat1', 3.5, 'x');
                    animateCounter('stat2', 40, '%');
                    animateCounter('stat3', 8);
                    animateCounter('stat4', 24, '/7');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(document.querySelector('.social-hero'));

        // Carousel Data
        const carouselData = [
            {
                icon: 'fas fa-users',
                title: 'Reach Your Audience',
                text: '4.9 billion people use social media worldwide. Your potential customers are already there - you just need to reach them effectively.'
            },
            {
                icon: 'fas fa-chart-line',
                title: 'Build Brand Authority',
                text: 'Consistent, valuable content establishes you as an expert in your field and builds trust with your audience.'
            },
            {
                icon: 'fas fa-shopping-cart',
                title: 'Drive Sales & Leads',
                text: 'Social media is the #1 channel for discovering new products. Proper management converts followers into customers.'
            },
            {
                icon: 'fas fa-heart',
                title: 'Create Loyal Community',
                text: 'Engaged followers become brand advocates who promote your business organically and provide valuable feedback.'
            },
            {
                icon: 'fas fa-search',
                title: 'Improve SEO & Visibility',
                text: 'Social signals boost your search engine rankings and increase your online visibility across platforms.'
            },
            {
                icon: 'fas fa-bullhorn',
                title: 'Amplify Your Message',
                text: 'Share company news, promotions, and updates instantly with your entire audience at once.'
            }
        ];

        // Initialize Carousel
        const carouselTrack = document.getElementById('carousel-track');
        const carouselNav = document.getElementById('carousel-nav');
        let currentCarouselSlide = 0;

        // Create carousel slides
        carouselData.forEach((item, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.innerHTML = `
                <div class="carousel-card">
                    <div class="carousel-icon">
                        <i class="${item.icon}"></i>
                    </div>
                    <h3>${item.title}</h3>
                    <p>${item.text}</p>
                </div>
            `;
            carouselTrack.appendChild(slide);

            // Create navigation dots
            const dot = document.createElement('div');
            dot.className = 'carousel-dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToCarouselSlide(index);
            });
            carouselNav.appendChild(dot);
        });

        // Carousel navigation functions
        function goToCarouselSlide(index) {
            currentCarouselSlide = index;
            carouselTrack.style.transform = `translateX(-${currentCarouselSlide * 100}%)`;
            
            // Update active dot
            document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentCarouselSlide);
            });
        }

        function nextCarouselSlide() {
            currentCarouselSlide = (currentCarouselSlide + 1) % carouselData.length;
            goToCarouselSlide(currentCarouselSlide);
        }

        function prevCarouselSlide() {
            currentCarouselSlide = (currentCarouselSlide - 1 + carouselData.length) % carouselData.length;
            goToCarouselSlide(currentCarouselSlide);
        }

        // Auto-advance carousel
        let carouselInterval = setInterval(nextCarouselSlide, 5000);

        // Pause carousel on hover
        carouselTrack.addEventListener('mouseenter', () => {
            clearInterval(carouselInterval);
        });

        carouselTrack.addEventListener('mouseleave', () => {
            carouselInterval = setInterval(nextCarouselSlide, 5000);
        });

        // Add event listeners for arrow buttons
        document.querySelector('.carousel-arrow.prev').addEventListener('click', () => {
            prevCarouselSlide();
            clearInterval(carouselInterval);
            carouselInterval = setInterval(nextCarouselSlide, 5000);
        });

        document.querySelector('.carousel-arrow.next').addEventListener('click', () => {
            nextCarouselSlide();
            clearInterval(carouselInterval);
            carouselInterval = setInterval(nextCarouselSlide, 5000);
        });    

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
