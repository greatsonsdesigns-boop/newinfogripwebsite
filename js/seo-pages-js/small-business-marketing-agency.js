

         // ===== THEME TOGGLE =====
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = themeToggle.querySelector('i');

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

        // ===== AUTO TYPING TEXT EFFECT =====
        const typingText = document.getElementById('typing-text');
        const texts = ['Social Media', 'Ads Management', 'Lead Generation', 'Website Creation', 'Branding'];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function typeText() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingText.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingText.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }
            
            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                typingSpeed = 1000;
                setTimeout(typeText, typingSpeed);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingSpeed = 500;
                setTimeout(typeText, typingSpeed);
            } else {
                setTimeout(typeText, typingSpeed);
            }
        }

        // Start typing effect
        setTimeout(typeText, 1000);

        // ===== PROBLEM CAROUSEL =====
        const problemData = [
            {
                icon: 'fas fa-chart-line',
                title: 'Inconsistent Revenue',
                description: 'Feast-or-famine cycles with no predictable customer flow or steady income streams.'
            },
            {
                icon: 'fas fa-user-friends',
                title: 'Limited Visibility',
                description: 'Potential customers can\'t find you online, going to competitors instead.'
            },
            {
                icon: 'fas fa-clock',
                title: 'Time Constraints',
                description: 'Too busy running daily operations to focus on marketing and growth.'
            },
            {
                icon: 'fas fa-wallet',
                title: 'Budget Limitations',
                description: 'Traditional agencies are too expensive for small business budgets.'
            },
            {
                icon: 'fas fa-chart-pie',
                title: 'No Data Tracking',
                description: 'Not knowing what marketing efforts are actually working for your business.'
            },
            {
                icon: 'fas fa-bullhorn',
                title: 'Ineffective Advertising',
                description: 'Wasting money on ads that don\'t reach the right audience or convert.'
            }
        ];

        const problemTrack = document.getElementById('problem-track');
        const problemNav = document.getElementById('problem-nav');
        let currentProblemSlide = 0;

        // Create problem slides
        problemData.forEach((problem, index) => {
            const slide = document.createElement('div');
            slide.className = 'problem-slide';
            slide.innerHTML = `
                <div class="problem-card">
                    <div class="problem-icon">
                        <i class="${problem.icon}"></i>
                    </div>
                    <h3>${problem.title}</h3>
                    <p>${problem.description}</p>
                </div>
            `;
            problemTrack.appendChild(slide);

            // Create navigation dots
            const dot = document.createElement('div');
            dot.className = 'carousel-dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToProblemSlide(index);
            });
            problemNav.appendChild(dot);
        });

        // Problem carousel navigation functions
        function goToProblemSlide(index) {
            currentProblemSlide = index;
            problemTrack.style.transform = `translateX(-${currentProblemSlide * 100}%)`;
            
            // Update active dot
            document.querySelectorAll('#problem-nav .carousel-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentProblemSlide);
            });
        }

        function nextProblemSlide() {
            currentProblemSlide = (currentProblemSlide + 1) % problemData.length;
            goToProblemSlide(currentProblemSlide);
        }

        function prevProblemSlide() {
            currentProblemSlide = (currentProblemSlide - 1 + problemData.length) % problemData.length;
            goToProblemSlide(currentProblemSlide);
        }

        // Auto-advance problem carousel
        let problemCarouselInterval = setInterval(nextProblemSlide, 4000);

        // Pause carousel on hover
        const problemCarousel = document.querySelector('.problem-carousel');
        problemCarousel.addEventListener('mouseenter', () => {
            clearInterval(problemCarouselInterval);
        });

        problemCarousel.addEventListener('mouseleave', () => {
            problemCarouselInterval = setInterval(nextProblemSlide, 4000);
        });

        // Add event listeners for arrow buttons
        document.querySelector('.problem-carousel .prev').addEventListener('click', prevProblemSlide);
        document.querySelector('.problem-carousel .next').addEventListener('click', nextProblemSlide);

        // ===== BENEFITS CAROUSEL =====
        const benefitsData = [
            {
                icon: 'fas fa-rupee-sign',
                title: 'Affordable Pricing',
                description: 'Packages designed for small business budgets with transparent pricing.'
            },
            {
                icon: 'fas fa-bullseye',
                title: 'Results-Focused',
                description: 'We measure success by your growth, not just deliverables.'
            },
            {
                icon: 'fas fa-clock',
                title: 'Fast Onboarding',
                description: 'Get started in days, not weeks. Quick setup for faster results.'
            },
            {
                icon: 'fas fa-chart-bar',
                title: 'Monthly Reporting',
                description: 'Clear reports showing exactly how your investment is performing.'
            },
            {
                icon: 'fas fa-user-tie',
                title: 'Dedicated Account Manager',
                description: 'One point of contact who understands your business goals.'
            },
            {
                icon: 'fas fa-sync-alt',
                title: 'Flexible Packages',
                description: 'Mix and match services based on what your business needs most.'
            },
            {
                icon: 'fas fa-shield-alt',
                title: '30-Day Guarantee',
                description: 'Try our services risk-free with our 30-day results guarantee.'
            },
            {
                icon: 'fas fa-rocket',
                title: 'Quick Results',
                description: 'Most clients see measurable improvements within the first month.'
            }
        ];

        const benefitsTrack = document.getElementById('benefits-track');
        const benefitsNav = document.getElementById('benefits-nav');
        let currentBenefitsSlide = 0;
        let slidesPerView = 3;

        function updateSlidesPerView() {
            if (window.innerWidth < 768) {
                slidesPerView = 2;
            }
            if (window.innerWidth < 576) {
                slidesPerView = 1;
            }
        }

        // Create benefits slides
        benefitsData.forEach((benefit, index) => {
            const slide = document.createElement('div');
            slide.className = 'benefits-slide';
            slide.innerHTML = `
                <div class="benefit-card">
                    <div class="benefit-icon">
                        <i class="${benefit.icon}"></i>
                    </div>
                    <h3>${benefit.title}</h3>
                    <p>${benefit.description}</p>
                </div>
            `;
            benefitsTrack.appendChild(slide);

            // Create navigation dots (only show if we have more slides than visible)
            if (index < Math.ceil(benefitsData.length / slidesPerView)) {
                const dot = document.createElement('div');
                dot.className = 'carousel-dot';
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    goToBenefitsSlide(index);
                });
                benefitsNav.appendChild(dot);
            }
        });

        // Benefits carousel navigation functions
        function goToBenefitsSlide(index) {
            currentBenefitsSlide = index;
            benefitsTrack.style.transform = `translateX(-${currentBenefitsSlide * (100 / slidesPerView)}%)`;
            
            // Update active dot
            document.querySelectorAll('#benefits-nav .carousel-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentBenefitsSlide);
            });
        }

        function nextBenefitsSlide() {
            const totalSlides = Math.ceil(benefitsData.length / slidesPerView);
            currentBenefitsSlide = (currentBenefitsSlide + 1) % totalSlides;
            goToBenefitsSlide(currentBenefitsSlide);
        }

        function prevBenefitsSlide() {
            const totalSlides = Math.ceil(benefitsData.length / slidesPerView);
            currentBenefitsSlide = (currentBenefitsSlide - 1 + totalSlides) % totalSlides;
            goToBenefitsSlide(currentBenefitsSlide);
        }

        // Update slides per view on resize
        window.addEventListener('resize', () => {
            updateSlidesPerView();
            goToBenefitsSlide(0);
        });

        // Auto-advance benefits carousel
        let benefitsCarouselInterval = setInterval(nextBenefitsSlide, 3500);

        // Pause carousel on hover
        const benefitsCarousel = document.querySelector('.benefits-carousel');
        benefitsCarousel.addEventListener('mouseenter', () => {
            clearInterval(benefitsCarouselInterval);
        });

        benefitsCarousel.addEventListener('mouseleave', () => {
            benefitsCarouselInterval = setInterval(nextBenefitsSlide, 3500);
        });

        // Add event listeners for arrow buttons
        document.querySelector('.benefits-prev').addEventListener('click', prevBenefitsSlide);
        document.querySelector('.benefits-next').addEventListener('click', nextBenefitsSlide);

        // Initialize
        updateSlidesPerView();
        goToBenefitsSlide(0);

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

        // ===== STICKY HEADER =====
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            header.classList.toggle('scrolled', window.scrollY > 50);
        });

        // ===== ANIMATED COUNTERS =====
        function animateCounter(element, target, duration = 2000) {
            let start = 0;
            const increment = target / (duration / 16);
            const timer = setInterval(() => {
                start += increment;
                if (start >= target) {
                    if (element.id === 'stat1') {
                        element.textContent = '3-5x';
                    } else if (element.id === 'stat2') {
                        element.textContent = '40%';
                    } else if (element.id === 'stat3') {
                        element.textContent = '2-4x';
                    } else if (element.id === 'stat4') {
                        element.textContent = '85%';
                    }
                    clearInterval(timer);
                } else {
                    if (element.id === 'stat1') {
                        element.textContent = Math.floor(start) + 'x';
                    } else if (element.id === 'stat2') {
                        element.textContent = Math.floor(start) + '%';
                    } else if (element.id === 'stat3') {
                        element.textContent = Math.floor(start) + 'x';
                    } else if (element.id === 'stat4') {
                        element.textContent = Math.floor(start) + '%';
                    }
                }
            }, 16);
        }

        // Initialize counters when in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(document.getElementById('stat1'), 5);
                    animateCounter(document.getElementById('stat2'), 40);
                    animateCounter(document.getElementById('stat3'), 4);
                    animateCounter(document.getElementById('stat4'), 85);
                    observer.unobserve(entry.target);
                }
            });
        });

        observer.observe(document.querySelector('.stats-smb'));
        // Function to simulate typing
        function showTyping() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'typing-indicator';
            typingDiv.id = 'typingIndicator';
            typingDiv.innerHTML = `
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            `;
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            return new Promise(resolve => {
                setTimeout(resolve, 1000 + Math.random() * 1000);
            });
        }

        // Function to remove typing indicator
        function hideTyping() {
            const typingIndicator = document.getElementById('typingIndicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }

        // Function to get bot response
        function getBotResponse(userMessage) {
            const lowerMessage = userMessage.toLowerCase();
            
            if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
                return smallBusinessKnowledge.greetings[Math.floor(Math.random() * smallBusinessKnowledge.greetings.length)];
            }
            
            if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
                return smallBusinessKnowledge.pricing[Math.floor(Math.random() * smallBusinessKnowledge.pricing.length)];
            }
            
            if (lowerMessage.includes('service') || lowerMessage.includes('what do you offer') || lowerMessage.includes('help')) {
                return smallBusinessKnowledge.services[Math.floor(Math.random() * smallBusinessKnowledge.services.length)];
            }
            
            if (lowerMessage.includes('result') || lowerMessage.includes('how long') || lowerMessage.includes('time')) {
                return smallBusinessKnowledge.results[Math.floor(Math.random() * smallBusinessKnowledge.results.length)];
            }
            
            if (lowerMessage.includes('start') || lowerMessage.includes('begin') || lowerMessage.includes('onboarding')) {
                return smallBusinessKnowledge.onboarding[Math.floor(Math.random() * smallBusinessKnowledge.onboarding.length)];
            }
            
            if (lowerMessage.includes('contact') || lowerMessage.includes('call') || lowerMessage.includes('email')) {
                return "You can reach us at +91 9928140288 or email info@infogrip.com. We typically respond within 2 hours during business days.";
            }
            
            return smallBusinessKnowledge.default[Math.floor(Math.random() * smallBusinessKnowledge.default.length)];
        }

        // Process user message
        async function processMessage() {
            const userMessage = messageInput.value.trim();
            if (!userMessage) return;
            
            // Add user message
            addMessage(userMessage, true);
            messageInput.value = '';
            
            // Show typing indicator
            await showTyping();
            
            // Get and add bot response
            const botResponse = getBotResponse(userMessage);
            hideTyping();
            addMessage(botResponse);
        }

        // Send message on button click
        sendButton.addEventListener('click', processMessage);

        // Send message on Enter key
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                processMessage();
            }
        });

        // Quick options functionality
        quickOptions.forEach(option => {
            option.addEventListener('click', () => {
                const action = option.getAttribute('data-action');
                let message = '';
                
                switch(action) {
                    case 'pricing':
                        message = "What are your prices for small businesses?";
                        break;
                    case 'services':
                        message = "What services do you offer for small businesses?";
                        break;
                    case 'portfolio':
                        message = "Do you have case studies or examples of your work?";
                        break;
                    case 'contact':
                        message = "How can I contact you for a consultation?";
                        break;
                }
                
                // Add quick option as user message
                addMessage(message, true);
                
                // Show typing, then response
                setTimeout(async () => {
                    await showTyping();
                    const botResponse = getBotResponse(message);
                    hideTyping();
                    addMessage(botResponse);
                }, 500);
            });
        });

        // ===== SMOOTH SCROLLING =====
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
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

        // ===== FADE IN ANIMATIONS =====
        const fadeElements = document.querySelectorAll('.solution-card, .testimonial-card, .stat-smb-card');

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
        
        // Initial fade in
        setTimeout(fadeInOnScroll, 100);

