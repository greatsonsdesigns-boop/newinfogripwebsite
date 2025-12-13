 // ===== EXACTLY LIKE YOUR WEBSITE'S JAVASCRIPT =====
        
        // Theme Toggle
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = themeToggle.querySelector('i');

        // Check for saved theme preference
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

        // ===== TYPING EFFECT =====
        const politicalTerms = [
            "Election Poster Design",
            "राजनीतिक नारे बनाना",
            "Campaign Video Making",
            "वोटर टारगेटिंग",
            "Social Media Management",
            "चुनावी रणनीति",
            "Political Branding",
            "राजनीतिक पहचान"
        ];
        
        let termIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        const typingText = document.getElementById('typing-text');

        function typePoliticalTerm() {
            const currentTerm = politicalTerms[termIndex];
            
            if (isDeleting) {
                typingText.textContent = currentTerm.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingText.textContent = currentTerm.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }
            
            if (!isDeleting && charIndex === currentTerm.length) {
                isDeleting = true;
                typingSpeed = 1000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                termIndex = (termIndex + 1) % politicalTerms.length;
                typingSpeed = 500;
            }
            
            setTimeout(typePoliticalTerm, typingSpeed);
        }

        // Start typing effect
        setTimeout(typePoliticalTerm, 1000);

        // ===== ANIMATE STATS =====
        function animateStats() {
            const statsSection = document.querySelector('.hero-stats');
            const statsPosition = statsSection.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (statsPosition < screenPosition) {
                document.querySelectorAll('.stat-number').forEach(stat => {
                    if (!stat.classList.contains('animated')) {
                        stat.classList.add('animated');
                        const finalValue = stat.textContent;
                        stat.textContent = '0';
                        
                        let startValue = 0;
                        const duration = 2000;
                        const increment = parseInt(finalValue) / (duration / 16);
                        
                        const timer = setInterval(() => {
                            startValue += increment;
                            if (startValue >= parseInt(finalValue)) {
                                stat.textContent = finalValue;
                                clearInterval(timer);
                            } else {
                                stat.textContent = Math.floor(startValue) + (finalValue.includes('+') ? '+' : '');
                            }
                        }, 16);
                    }
                });
            }
        }

        window.addEventListener('scroll', animateStats);
        window.addEventListener('load', animateStats);

        // ===== SMOOTH SCROLL =====
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

        // ===== HINDI POPUP MESSAGE =====
        const hindiPopup = document.getElementById('hindi-popup');
        
        // Show Hindi popup after 3 seconds
        setTimeout(() => {
            hindiPopup.classList.add('active');
        }, 3000);
        
        // Hide Hindi popup after 8 seconds
        setTimeout(() => {
            hindiPopup.classList.remove('active');
        }, 8000);
        
        // Show again after 30 seconds
        setInterval(() => {
            hindiPopup.classList.add('active');
            setTimeout(() => {
                hindiPopup.classList.remove('active');
            }, 8000);
        }, 30000);

