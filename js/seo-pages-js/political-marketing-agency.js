 // Create animated political elements
        function createPoliticalElements() {
            const flagAnimation = document.getElementById('flagAnimation');
            
            // Create flag strips
            for (let i = 0; i < 15; i++) {
                const flagStrip = document.createElement('div');
                flagStrip.className = 'flag-strip';
                flagStrip.style.left = Math.random() * 100 + 'vw';
                flagStrip.style.top = '-300px';
                flagStrip.style.animation = `fall ${10 + Math.random() * 20}s linear infinite`;
                flagStrip.style.animationDelay = Math.random() * 5 + 's';
                flagAnimation.appendChild(flagStrip);
                
                // Add animation
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes fall {
                        0% {
                            transform: translateY(-300px) rotate(${Math.random() * 30 - 15}deg);
                        }
                        100% {
                            transform: translateY(100vh) rotate(${Math.random() * 30 - 15}deg);
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Create Ashoka Chakras
            for (let i = 0; i < 8; i++) {
                const chakra = document.createElement('div');
                chakra.className = 'chakra';
                chakra.style.left = Math.random() * 90 + 5 + 'vw';
                chakra.style.top = Math.random() * 90 + 5 + 'vh';
                chakra.style.animation = `spin ${20 + Math.random() * 30}s linear infinite`;
                chakra.style.animationDelay = Math.random() * 10 + 's';
                flagAnimation.appendChild(chakra);
            }
            
            // Add spin animation
            const spinStyle = document.createElement('style');
            spinStyle.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(spinStyle);
        }
        
        // Auto typing effect
        const typingText = document.getElementById('typing-text');
        const politicalPhrases = [
            "Election Campaigns",
            "Social Media for Leaders",
            "Voter Targeting",
            "Political Branding",
            "चुनावी विज्ञापन",
            "राजनीतिक ब्रांडिंग",
            "मतदाता जुड़ाव",
            "Digital जनसंपर्क"
        ];
        
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isWaiting = false;
        
        function typePoliticalText() {
            const currentPhrase = politicalPhrases[phraseIndex];
            
            if (isDeleting) {
                typingText.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingText.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }
            
            if (!isDeleting && charIndex === currentPhrase.length) {
                isWaiting = true;
                setTimeout(() => {
                    isWaiting = false;
                    isDeleting = true;
                    setTimeout(typePoliticalText, 500);
                }, 2000);
                return;
            }
            
            if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % politicalPhrases.length;
                setTimeout(typePoliticalText, 500);
                return;
            }
            
            const speed = isDeleting ? 50 : 100;
            setTimeout(typePoliticalText, speed);
        }
        
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
        
        // Quick options
        quickOptions.forEach(option => {
            option.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                const responses = chatbotResponses[action];
                if (responses) {
                    addMessage(`Tell me about ${action} for political campaigns`, true);
                    setTimeout(() => {
                        addMessage(responses[0]);
                    }, 1000);
                }
            });
        });
        
        // Send message
        sendButton.addEventListener('click', () => {
            const message = messageInput.value.trim();
            if (message) {
                handleUserMessage(message);
            }
        });
        
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const message = messageInput.value.trim();
                if (message) {
                    handleUserMessage(message);
                }
            }
        });
        
        // Fade in elements on scroll
        const fadeElements = document.querySelectorAll('.service-card, .why-card, .benefit-item, .stat-card');
        
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
        
        // Smooth scrolling for anchor links
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
        
        // Initialize everything when page loads
        document.addEventListener('DOMContentLoaded', function() {
            createPoliticalElements();
            typePoliticalText();
            window.addEventListener('scroll', fadeInOnScroll);
            window.addEventListener('load', fadeInOnScroll);
        });
