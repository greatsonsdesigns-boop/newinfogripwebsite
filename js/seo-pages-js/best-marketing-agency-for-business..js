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

        // Sticky Header
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            header.classList.toggle('scrolled', window.scrollY > 50);
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

        // Animate elements on scroll
        const animateOnScroll = () => {
            const elements = document.querySelectorAll('.feature-card, .service-card, .comparison-card, .stat-item');
            
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.style.opacity = "1";
                    element.style.transform = "translateY(0)";
                }
            });
        };

        // Set initial state
        document.querySelectorAll('.feature-card, .service-card, .comparison-card, .stat-item').forEach(element => {
            element.style.opacity = "0";
            element.style.transform = "translateY(20px)";
            element.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        });

        window.addEventListener('scroll', animateOnScroll);
        window.addEventListener('load', animateOnScroll);

        // Typing Animation Effect
        const typingText = document.getElementById('typing-text');
        const texts = ['Businesses', 'Startups', 'E-commerce', 'Brands', 'Companies'];
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
                typingSpeed = 1500;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingSpeed = 500;
            }
            
            setTimeout(typeText, typingSpeed);
        }

        // Start typing effect after page load
        setTimeout(typeText, 1000);

        // Animate stats numbers
        function animateStats() {
            const statItems = document.querySelectorAll('.stat-item');
            const stats = [
                { id: 'rating-stat', value: '4.9/5' },
                { id: 'projects-stat', value: '300+' },
                { id: 'retention-stat', value: '97%' },
                { id: 'support-stat', value: '24/7' }
            ];
            
            statItems.forEach((item, index) => {
                const numberElement = item.querySelector('.stat-number');
                const originalValue = stats[index].value;
                
                // Reset for animation
                numberElement.textContent = '0';
                numberElement.classList.add('animate');
                
                // Animate counting
                if (originalValue.includes('/')) {
                    // For ratings like 4.9/5
                    setTimeout(() => {
                        numberElement.textContent = originalValue;
                    }, index * 300);
                } else if (originalValue.includes('+')) {
                    // For values like 300+
                    const numValue = parseInt(originalValue);
                    let count = 0;
                    const increment = Math.ceil(numValue / 20);
                    
                    const counter = setInterval(() => {
                        count += increment;
                        if (count >= numValue) {
                            count = numValue;
                            clearInterval(counter);
                            numberElement.textContent = originalValue;
                        } else {
                            numberElement.textContent = count + '+';
                        }
                    }, 50);
                } else if (originalValue.includes('%')) {
                    // For percentages like 97%
                    const numValue = parseInt(originalValue);
                    let count = 0;
                    
                    const counter = setInterval(() => {
                        count += 3;
                        if (count >= numValue) {
                            count = numValue;
                            clearInterval(counter);
                            numberElement.textContent = originalValue;
                        } else {
                            numberElement.textContent = count + '%';
                        }
                    }, 30);
                } else {
                    // For regular numbers
                    setTimeout(() => {
                        numberElement.textContent = originalValue;
                    }, index * 300);
                }
            });
        }

        // Click Popup Message
        const clickPopup = document.getElementById('clickPopup');
        let clickCount = 0;
        let popupShown = false;

        function showPopup() {
            if (!popupShown) {
                clickPopup.classList.add('show');
                popupShown = true;
                
                // Hide after 5 seconds
                setTimeout(() => {
                    clickPopup.classList.remove('show');
                    popupShown = false;
                }, 5000);
            }
        }

        // Show popup on first few clicks
        document.addEventListener('click', (e) => {
            // Don't show popup if clicking on buttons or chatbot
            if (e.target.closest('.btn') || e.target.closest('#chatbot-btn') || 
                e.target.closest('#chatbot-overlay') || e.target.closest('.floating-btn')) {
                return;
            }
            
            clickCount++;
            
            // Show popup on 3rd, 6th, and 9th click
            if (clickCount % 3 === 0 && clickCount <= 9) {
                setTimeout(showPopup, 1000);
            }
        });

        // Initialize animations on page load
        window.addEventListener('load', () => {
            // Trigger initial animation
            animateOnScroll();
            
            // Add fade-in class to first sections
            sections[0].classList.add('fade-in');
            sections[1].classList.add('fade-in');
            
            // Animate stats after a delay
            setTimeout(animateStats, 1500);
        });
        

