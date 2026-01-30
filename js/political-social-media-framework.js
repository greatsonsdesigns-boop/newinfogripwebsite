document.addEventListener('DOMContentLoaded', function() {
        // Framework Components Carousel
        const services = [
            {
                icon: 'fas fa-user-tie',
                title: 'Political Identity Mapping',
                description: 'नेता की सोच, छवि और विचारधारा की पहचान - Comprehensive analysis of political persona, ideology, and target voter psychology.'
            },
            {
                icon: 'fas fa-layer-group',
                title: 'Content Pillar Strategy',
                description: 'विकास, जनता, संगठन, विचार, उपलब्धियां - Five core content pillars defining political narrative across all platforms.'
            },
            {
                icon: 'fas fa-th',
                title: 'Platform-Wise Planning',
                description: 'Facebook, Instagram, X, YouTube के लिए अलग रणनीति - Platform-specific strategies maximizing each channel\'s unique political potential.'
            },
            {
                icon: 'fas fa-palette',
                title: 'Visual & Messaging Consistency',
                description: 'डिज़ाइन, भाषा और टोन में निरंतरता - Unified visual identity and messaging framework across all political communication.'
            },
            {
                icon: 'fas fa-brain',
                title: 'Audience Psychology & Timing',
                description: 'सही संदेश, सही समय पर - Data-driven scheduling based on voter behavior patterns and political news cycles.'
            },
            {
                icon: 'fas fa-chart-line',
                title: 'Monitoring & Optimization',
                description: 'डेटा के आधार पर निरंतर सुधार - Continuous framework refinement based on engagement metrics and political impact.'
            }
        ];

        const servicesTrack = document.getElementById('services-track');
        const carouselNav = document.getElementById('carousel-nav');
        let currentSlide = 0;

        // Create service slides
        services.forEach((service, index) => {
            const slide = document.createElement('div');
            slide.className = 'service-slide';
            slide.innerHTML = `
                <div class="service-card">
                    <div class="service-icon">
                        <i class="${service.icon}"></i>
                    </div>
                    <h3>${service.title}</h3>
                    <p>${service.description}</p>
                </div>
            `;
            servicesTrack.appendChild(slide);

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
            const slideWidth = servicesTrack.children[0].offsetWidth;
            servicesTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
            
            // Update active dot
            document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % services.length;
            goToSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + services.length) % services.length;
            goToSlide(currentSlide);
        }

        // Auto-advance carousel
        let carouselInterval = setInterval(nextSlide, 5000);

        // Add event listeners for arrow buttons
        document.querySelector('.carousel-arrow.prev').addEventListener('click', () => {
            prevSlide();
            resetCarouselInterval();
        });
        
        document.querySelector('.carousel-arrow.next').addEventListener('click', () => {
            nextSlide();
            resetCarouselInterval();
        });

        function resetCarouselInterval() {
            clearInterval(carouselInterval);
            carouselInterval = setInterval(nextSlide, 5000);
        }

        // Political Testimonials Carousel
        const politicalTestimonials = [
            {
                text: "The framework transformed my social media from random posts to strategic communication. My approval ratings increased by 35% in 6 months. Every post now advances my political narrative systematically.",
                author: "Rajesh Kumar",
                role: "MLA Candidate",
                location: "Madhya Pradesh",
                avatar: "RK"
            },
            {
                text: "As a young politician, I needed structure. InfoGrip's framework gave me clear content pillars and platform strategies. Now my digital presence builds authority consistently across all channels.",
                author: "Priya Sharma",
                role: "Youth Leader",
                location: "Uttar Pradesh",
                avatar: "PS"
            },
            {
                text: "The bilingual framework solved our Hindi-English communication dilemma. We now connect with both educated urban voters and rural masses effectively. Our engagement doubled in 3 months.",
                author: "Amit Patel",
                role: "Party Secretary",
                location: "Gujarat",
                avatar: "AP"
            },
            {
                text: "Before the framework, we posted randomly. Now every piece of content has purpose and placement. Our political messaging reaches the right voters at the right time with strategic precision.",
                author: "Sanjay Singh",
                role: "District President",
                location: "Rajasthan",
                avatar: "SS"
            }
        ];

        const politicalTestimonialTrack = document.getElementById('political-testimonial-track');
        const politicalCarouselNav = document.getElementById('political-carousel-nav');
        let currentPoliticalSlide = 0;

        // Create political testimonial slides
        politicalTestimonials.forEach((testimonial, index) => {
            const slide = document.createElement('div');
            slide.className = 'testimonial-slide';
            slide.innerHTML = `
                <div class="testimonial-card">
                    <div class="testimonial-avatar">
                        <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--orange); color: var(--dark-blue); font-weight: bold; font-size: 1.5rem;">
                            ${testimonial.avatar}
                        </div>
                    </div>
                    <div class="testimonial-stars">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <p class="testimonial-text">"${testimonial.text}"</p>
                    <div class="testimonial-author">
                        <div class="testimonial-info">
                            <h4>${testimonial.author}</h4>
                            <p>${testimonial.role}, ${testimonial.location}</p>
                        </div>
                    </div>
                </div>
            `;
            politicalTestimonialTrack.appendChild(slide);

            // Create navigation dots
            const dot = document.createElement('div');
            dot.className = 'carousel-dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToPoliticalSlide(index);
            });
            politicalCarouselNav.appendChild(dot);
        });

        // Political carousel navigation functions
        function goToPoliticalSlide(index) {
            currentPoliticalSlide = index;
            politicalTestimonialTrack.style.transform = `translateX(-${currentPoliticalSlide * 100}%)`;
            
            // Update active dot
            document.querySelectorAll('#political-carousel-nav .carousel-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentPoliticalSlide);
            });
        }

        function nextPoliticalSlide() {
            currentPoliticalSlide = (currentPoliticalSlide + 1) % politicalTestimonials.length;
            goToPoliticalSlide(currentPoliticalSlide);
        }

        function prevPoliticalSlide() {
            currentPoliticalSlide = (currentPoliticalSlide - 1 + politicalTestimonials.length) % politicalTestimonials.length;
            goToPoliticalSlide(currentPoliticalSlide);
        }

        // Auto-advance political carousel
        let politicalCarouselInterval = setInterval(nextPoliticalSlide, 6000);

        // Add event listeners for arrow buttons
        document.querySelectorAll('.testimonial-carousel .carousel-arrow.prev')[0].addEventListener('click', () => {
            prevPoliticalSlide();
            resetPoliticalCarouselInterval();
        });
        
        document.querySelectorAll('.testimonial-carousel .carousel-arrow.next')[0].addEventListener('click', () => {
            nextPoliticalSlide();
            resetPoliticalCarouselInterval();
        });

        function resetPoliticalCarouselInterval() {
            clearInterval(politicalCarouselInterval);
            politicalCarouselInterval = setInterval(nextPoliticalSlide, 6000);
        }

        // Animated Counters
        function animateCounter(element, target, duration = 2000) {
            let start = 0;
            const increment = target / (duration / 16);
            const timer = setInterval(() => {
                start += increment;
                if (start >= target) {
                    element.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(start).toLocaleString();
                }
            }, 16);
        }

        // Initialize counters when in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(document.getElementById('campaigns-count'), 68);
                    animateCounter(document.getElementById('leaders-count'), 42);
                    animateCounter(document.getElementById('voters-reach'), 340);
                    animateCounter(document.getElementById('elections-count'), 125);
                    observer.unobserve(entry.target);
                }
            });
        });

        observer.observe(document.querySelector('.political-stats'));

        // Auto-typing text effect
        const typingText = document.getElementById('typing-text');
        const texts = ['Strategic Systems', 'Political Authority', 'Digital Influence', 'Lasting Legacy'];
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

        // Download Framework
        document.getElementById('download-brochure').addEventListener('click', function(e) {
            e.preventDefault();
            alert('Political Social Media Framework PDF will start downloading. For now, please contact us for detailed framework information.');
        });

        document.getElementById('brochure-download').addEventListener('click', function(e) {
            e.preventDefault();
            alert('Framework Guide download will start shortly. For now, please contact us for detailed framework guide.');
        });

        // Scroll Animation for existing sections
        const processObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe process steps for animation
        const processSteps = document.querySelectorAll('.process-step');
        processSteps.forEach(step => {
            processObserver.observe(step);
        });

        // Observe addon cards for animation
        const addonCards = document.querySelectorAll('.addon-card');
        const addonObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('in-view');
                    }, 100 * Array.from(addonCards).indexOf(entry.target));
                }
            });
        }, {
            threshold: 0.1
        });

        addonCards.forEach(card => {
            addonObserver.observe(card);
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

        // Chatbot Functionality
        const chatbotBtn = document.getElementById('chatbot-btn');
        const chatbotOverlay = document.getElementById('chatbot-overlay');
        const chatbotClose = document.getElementById('chatbot-close');

        chatbotBtn.addEventListener('click', () => {
            chatbotOverlay.classList.add('active');
        });

        chatbotClose.addEventListener('click', () => {
            chatbotOverlay.classList.remove('active');
        });

        // Close chatbot with ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                chatbotOverlay.classList.remove('active');
            }
        });

        // ==================== FRAMEWORK-SPECIFIC FEATURES ====================

        // Blog Carousel
        const blogs = [
            {
                title: "Digital Branding for Politicians: Framework Approach",
                excerpt: "Learn how structured digital branding differs from random social media activity for political leaders. Framework-based approach to building lasting political authority online.",
                category: "Digital Branding",
                readLink: "../blog/digital-branding-politicians.html",
                image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Social Media Mistakes Political Leaders Make",
                excerpt: "Common framework violations by politicians on social media—from inconsistent messaging to wrong platform usage. Learn how to avoid these and build systematic digital influence.",
                category: "Strategy",
                readLink: "../blog/political-social-media-mistakes.html",
                image: "https://images.unsplash.com/photo-1551135042-1035a519c37f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Election-Focused Content Strategy Framework",
                excerpt: "How to adapt your social media framework for election campaigns. Content frequency acceleration, targeted messaging, and voter outreach optimization strategies.",
                category: "Election Strategy",
                readLink: "../blog/election-content-framework.html",
                image: "https://images.unsplash.com/photo-1580136607996-cab1c2ef76dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Political Content Pillars: The 5 Essential Categories",
                excerpt: "Every political leader needs these 5 content pillars. Learn how to balance development updates, public connection, ideology, achievements, and organizational strength.",
                category: "Content Strategy",
                readLink: "../blog/political-content-pillars.html",
                image: "https://images.unsplash.com/photo-1590080876092-9667b2d6b668?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Hindi vs English Political Communication Framework",
                excerpt: "Structured approach to bilingual political messaging. When to use Hindi for emotional connection, English for policy detail, and how to maintain consistency across languages.",
                category: "Communication",
                readLink: "../blog/bilingual-political-framework.html",
                image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Visual Consistency in Political Branding",
                excerpt: "How unified visual identity across social media builds political authority. Color psychology, typography systems, and graphic templates for political leaders.",
                category: "Visual Identity",
                readLink: "../blog/political-visual-consistency.html",
                image: "https://images.unsplash.com/photo-1551135042-1035a519c37f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            }
        ];

        const blogTrack = document.getElementById('blog-track');
        const blogNav = document.getElementById('blog-nav');
        let currentBlogSlide = 0;
        const blogsPerSlide = 3;

        // Create blog slides
        for (let i = 0; i < blogs.length; i += blogsPerSlide) {
            const slide = document.createElement('div');
            slide.className = 'blog-slide';
            slide.style.minWidth = '100%';
            slide.style.display = 'flex';
            slide.style.gap = '30px';
            slide.style.padding = '0 10px';
            
            for (let j = i; j < Math.min(i + blogsPerSlide, blogs.length); j++) {
                const blog = blogs[j];
                const blogCard = document.createElement('div');
                blogCard.className = 'blog-card';
                blogCard.innerHTML = `
                    <div class="blog-image">
                        <img src="${blog.image}" alt="${blog.title}" loading="lazy">
                    </div>
                    <div class="blog-content">
                        <div class="blog-meta">
                            <span class="blog-category">${blog.category}</span>
                            <span>${Math.floor(Math.random() * 30) + 1} min read</span>
                        </div>
                        <h3>${blog.title}</h3>
                        <p>${blog.excerpt}</p>
                        <a href="${blog.readLink}" class="btn btn-outline btn-small" style="margin-top: 15px;">Read More</a>
                    </div>
                `;
                slide.appendChild(blogCard);
            }
            blogTrack.appendChild(slide);

            // Create navigation dots
            const dot = document.createElement('div');
            dot.className = 'carousel-dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToBlogSlide(Math.floor(i / blogsPerSlide));
            });
            blogNav.appendChild(dot);
        }

        // Blog carousel navigation
        function goToBlogSlide(index) {
            currentBlogSlide = index;
            blogTrack.style.transform = `translateX(-${currentBlogSlide * 100}%)`;
            
            // Update active dot
            document.querySelectorAll('#blog-nav .carousel-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentBlogSlide);
            });
        }

        function nextBlogSlide() {
            const totalSlides = Math.ceil(blogs.length / blogsPerSlide);
            currentBlogSlide = (currentBlogSlide + 1) % totalSlides;
            goToBlogSlide(currentBlogSlide);
        }

        function prevBlogSlide() {
            const totalSlides = Math.ceil(blogs.length / blogsPerSlide);
            currentBlogSlide = (currentBlogSlide - 1 + totalSlides) % totalSlides;
            goToBlogSlide(currentBlogSlide);
        }

        // Blog carousel event listeners
        document.querySelector('.blog-prev').addEventListener('click', () => {
            prevBlogSlide();
        });
        
        document.querySelector('.blog-next').addEventListener('click', () => {
            nextBlogSlide();
        });

        // FAQ Section
        const faqs = [
            {
                question: "What is a Political Social Media Framework?",
                answer: "A Political Social Media Framework is a structured system defining messaging, platforms, content types, frequency, and tone for political leaders to systematically build trust and authority online. It transforms random posts into cohesive digital identity that resonates with voters consistently across all platforms."
            },
            {
                question: "Is this service useful for new politicians?",
                answer: "Yes, especially for new politicians. A framework provides structured foundation, prevents common mistakes, accelerates authority building, and ensures consistent messaging from the start—crucial for establishing political identity when you have limited recognition."
            },
            {
                question: "Is content provided in Hindi or English?",
                answer: "Both. Our framework includes bilingual strategy—English for formal communication, press releases, and educated urban voters; Hindi for emotional connection, rallies, and rural masses. We provide content calendars in both languages with cultural and regional context considerations."
            },
            {
                question: "How is this different from social media management?",
                answer: "Social media management focuses on daily posting and engagement metrics. Our framework focuses on strategic authority building—defining narrative pillars, messaging hierarchy, platform-specific roles, audience psychology, and long-term political identity development beyond just social media."
            },
            {
                question: "Can this help during elections?",
                answer: "Absolutely. The framework includes election-specific modules with accelerated content frequency, targeted messaging, crisis communication protocols, opposition response strategies, and voter outreach optimization—transforming regular strategy into high-impact campaign machinery."
            },
            {
                question: "Who manages the strategy?",
                answer: "Our political strategy team designs and oversees the framework, while your team implements daily activities. We provide comprehensive training, weekly content plans, monthly performance reviews, and quarterly framework optimization. For full management, we offer dedicated political digital teams."
            },
            {
                question: "What's the timeframe for seeing results?",
                answer: "Initial framework implementation takes 2-4 weeks. Visible authority building starts in 1-2 months. Significant political impact and voter recognition typically emerge within 3-6 months of consistent framework execution."
            },
            {
                question: "Can existing social media accounts be integrated?",
                answer: "Yes. We audit existing accounts, identify strengths to preserve, and systematically integrate them into the new framework. This ensures continuity while upgrading to strategic systematic approach."
            },
            {
                question: "How often is the framework updated?",
                answer: "Monthly optimizations based on performance data, quarterly major reviews incorporating political developments, and annual complete framework refresh to align with changing voter behavior and platform algorithms."
            },
            {
                question: "What about crisis situations or opposition attacks?",
                answer: "The framework includes pre-defined crisis communication protocols with escalation matrices, approved messaging templates, and rapid response strategies specifically designed for political controversies and opposition attacks."
            },
            {
                question: "Is training provided for our team?",
                answer: "Yes. Comprehensive training covers framework philosophy, content creation guidelines, platform-specific strategies, engagement protocols, and performance monitoring—ensuring your team can execute the framework effectively."
            },
            {
                question: "How do you measure framework success?",
                answer: "We track both quantitative metrics (reach, engagement, follower growth) and qualitative impact (sentiment analysis, authority perception surveys, media mentions, voter recall studies) to measure political influence growth systematically."
            }
        ];

        const faqContainer = document.getElementById('faq-container');

        faqs.forEach((faq, index) => {
            const faqItem = document.createElement('div');
            faqItem.className = 'faq-item';
            faqItem.innerHTML = `
                <div class="faq-question">
                    <span>${faq.question}</span>
                    <span class="faq-icon">+</span>
                </div>
                <div class="faq-answer">
                    <p>${faq.answer}</p>
                </div>
            `;
            
            faqItem.addEventListener('click', () => {
                faqItem.classList.toggle('active');
            });
            
            faqContainer.appendChild(faqItem);
        });

        // Popup Modal
        const politicalPopup = document.getElementById('politicalPopup');
        const popupClose = document.getElementById('popupClose');
        const popupLater = document.getElementById('popupLater');

        // Show popup after 5 seconds
        setTimeout(() => {
            politicalPopup.style.display = 'flex';
        }, 5000);

        popupClose.addEventListener('click', () => {
            politicalPopup.style.display = 'none';
            // Set cookie to not show again for 7 days
            document.cookie = "politicalFrameworkPopupClosed=true; max-age=604800; path=/";
        });

        popupLater.addEventListener('click', () => {
            politicalPopup.style.display = 'none';
            // Show again after 24 hours
            setTimeout(() => {
                if (!document.cookie.includes('politicalFrameworkPopupClosed')) {
                    politicalPopup.style.display = 'flex';
                }
            }, 86400000);
        });

        // Close popup when clicking outside
        politicalPopup.addEventListener('click', (e) => {
            if (e.target === politicalPopup) {
                politicalPopup.style.display = 'none';
            }
        });

        // Check if popup was previously closed
        if (document.cookie.includes('politicalFrameworkPopupClosed')) {
            politicalPopup.style.display = 'none';
        }

        // Progress Bar
        const progressBar = document.getElementById('progressBar');
        
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });

        // Back to Top Button
        const backToTop = document.createElement('div');
        backToTop.id = 'backToTop';
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
        document.body.appendChild(backToTop);
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Share Buttons
        const currentUrl = encodeURIComponent(window.location.href);
        const pageTitle = encodeURIComponent(document.title);
        
        document.getElementById('shareFacebook').href = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
        document.getElementById('shareTwitter').href = `https://twitter.com/intent/tweet?url=${currentUrl}&text=${pageTitle}`;
        document.getElementById('shareLinkedIn').href = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`;
        document.getElementById('shareWhatsApp').href = `https://wa.me/?text=${pageTitle}%20${currentUrl}`;

        // Enhanced Chatbot for Framework
        const chatMessages = document.getElementById('chatMessages');
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        const quickOptions = document.querySelectorAll('.quick-option');
        const languageOptions = document.querySelectorAll('.language-option');
        
        let selectedLanguage = 'english';
        let conversationContext = {
            currentTopic: null,
            previousQuestions: [],
            userType: null,
            conversationDepth: 0
        };

        // Language selection
        languageOptions.forEach(option => {
            option.addEventListener('click', function() {
                selectedLanguage = this.getAttribute('data-lang');
                
                document.querySelectorAll('.language-option').forEach(opt => {
                    opt.remove();
                });
                
                const messageDiv = document.querySelector('.bot-message');
                const greeting = selectedLanguage === 'english' 
                    ? "Excellent! Let's continue in English. I'm here to help with your political social media framework needs. What would you like to know about systematic digital authority building?" 
                    : "बहुत बढ़िया! हिंदी में बातचीत जारी रखते हैं। मैं आपकी राजनीतिक सोशल मीडिया फ्रेमवर्क आवश्यकताओं में मदद करने के लिए यहां हूं। आप व्यवस्थित डिजिटल अथॉरिटी बिल्डिंग के बारे में क्या जानना चाहेंगे?";
                
                messageDiv.innerHTML = `
                    <p>${greeting}</p>
                    <div style="font-size: 0.7rem; opacity: 0.7; margin-top: 5px; text-align: right;">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                `;
            });
        });

        // Quick options
        quickOptions.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                let message = '';
                
                switch(action) {
                    case 'framework-services':
                        message = selectedLanguage === 'english' 
                            ? "What does your political social media framework include?" 
                            : "आपके राजनीतिक सोशल मीडिया फ्रेमवर्क में क्या शामिल है?";
                        break;
                    case 'framework-pricing':
                        message = selectedLanguage === 'english' 
                            ? "What are your pricing options for the framework?" 
                            : "फ्रेमवर्क के लिए आपकी कीमतें क्या हैं?";
                        break;
                    case 'framework-portfolio':
                        message = selectedLanguage === 'english' 
                            ? "Can I see examples of political frameworks you've built?" 
                            : "क्या मैं आपके द्वारा बनाए गए राजनीतिक फ्रेमवर्क के उदाहरण देख सकता हूं?";
                        break;
                    case 'contact-framework':
                        message = selectedLanguage === 'english' 
                            ? "How can I contact your framework strategy team?" 
                            : "मैं आपकी फ्रेमवर्क रणनीति टीम से कैसे संपर्क कर सकता हूं?";
                        break;
                }
                
                // Simulate chatbot response
                const userMessageDiv = document.createElement('div');
                userMessageDiv.className = 'message user-message';
                userMessageDiv.innerHTML = `
                    ${message}
                    <div style="font-size: 0.7rem; opacity: 0.7; margin-top: 5px; text-align: right;">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                `;
                chatMessages.appendChild(userMessageDiv);
                
                // Bot response
                setTimeout(() => {
                    const botResponse = selectedLanguage === 'english' 
                        ? "Great question! Our political social media framework includes six core components: Political Identity Mapping, Content Pillar Strategy, Platform-Wise Planning, Visual & Messaging Consistency, Audience Psychology & Timing, and Monitoring & Optimization. Would you like details on any specific component?" 
                        : "बढ़िया सवाल! हमारे राजनीतिक सोशल मीडिया फ्रेमवर्क में छह मुख्य घटक शामिल हैं: राजनीतिक पहचान मैपिंग, कंटेंट पिलर रणनीति, प्लेटफॉर्म-वार योजना, विजुअल और मैसेजिंग निरंतरता, दर्शक मनोविज्ञान और समय, और निगरानी और अनुकूलन। क्या आप किसी विशिष्ट घटक के बारे में विवरण चाहेंगे?";
                    
                    const botMessageDiv = document.createElement('div');
                    botMessageDiv.className = 'message bot-message';
                    botMessageDiv.innerHTML = `
                        ${botResponse}
                        <div style="font-size: 0.7rem; opacity: 0.7; margin-top: 5px; text-align: right;">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    `;
                    chatMessages.appendChild(botMessageDiv);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1000);
                
                chatMessages.scrollTop = chatMessages.scrollHeight;
            });
        });

        // Chat input
        sendButton.addEventListener('click', () => {
            const message = messageInput.value.trim();
            if (message) {
                const userMessageDiv = document.createElement('div');
                userMessageDiv.className = 'message user-message';
                userMessageDiv.innerHTML = `
                    ${message}
                    <div style="font-size: 0.7rem; opacity: 0.7; margin-top: 5px; text-align: right;">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                `;
                chatMessages.appendChild(userMessageDiv);
                messageInput.value = '';
                
                // Bot response
                setTimeout(() => {
                    const responses = selectedLanguage === 'english' 
                        ? [
                            "That's an excellent question about political framework strategy. Our systematic approach transforms random social media activity into structured authority building. Would you like to schedule a free framework assessment with our political strategy team?",
                            "Great inquiry about political digital frameworks! For detailed framework development advice, I recommend our personalized framework audit. Our experts analyze your current digital presence and provide customized framework recommendations.",
                            "I understand your query about political social media frameworks. Our structured approach has helped numerous political leaders build systematic digital authority across India. Let me connect you with our framework strategy team for personalized guidance."
                        ]
                        : [
                            "राजनीतिक फ्रेमवर्क रणनीति के बारे में यह एक उत्कृष्ट प्रश्न है। हमारी व्यवस्थित दृष्टिकोण अनियमित सोशल मीडिया गतिविधि को संरचित अधिकार निर्माण में बदल देता है। क्या आप हमारी राजनीतिक रणनीति टीम के साथ एक मुफ्त फ्रेमवर्क आकलन शेड्यूल करना चाहेंगे?",
                            "राजनीतिक डिजिटल फ्रेमवर्क के बारे में बढ़िया जिज्ञासा! विस्तृत फ्रेमवर्क विकास सलाह के लिए, मैं हमारे व्यक्तिगत फ्रेमवर्क ऑडिट की सलाह देता हूं। हमारे विशेषज्ञ आपकी वर्तमान डिजिटल उपस्थिति का विश्लेषण करते हैं और अनुकूलित फ्रेमवर्क सिफारिशें प्रदान करते हैं।",
                            "मैं राजनीतिक सोशल मीडिया फ्रेमवर्क के बारे में आपकी जिज्ञासा समझता हूं। हमारे संरचित दृष्टिकोण ने पूरे भारत में कई राजनीतिक नेताओं को व्यवस्थित डिजिटल अधिकार बनाने में मदद की है। मुझे व्यक्तिगत मार्गदर्शन के लिए आपको हमारी फ्रेमवर्क रणनीति टीम से जोड़ने दें।"
                        ];
                    
                    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                    
                    const botMessageDiv = document.createElement('div');
                    botMessageDiv.className = 'message bot-message';
                    botMessageDiv.innerHTML = `
                        ${randomResponse}
                        <div style="margin-top: 10px;">
                            <button class="action-btn" onclick="window.open('onboarding.html', '_blank')" style="margin-right: 10px;">
                                <i class="fas fa-file-alt"></i> Book Framework Audit
                            </button>
                            <button class="action-btn" onclick="window.open('tel:+919928140288')">
                                <i class="fas fa-phone"></i> Call Framework Expert
                            </button>
                        </div>
                        <div style="font-size: 0.7rem; opacity: 0.7; margin-top: 5px; text-align: right;">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    `;
                    chatMessages.appendChild(botMessageDiv);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1500);
                
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        });

        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendButton.click();
            }
        });

        // Print-friendly page
        const printButton = document.createElement('button');
        printButton.innerHTML = '<i class="fas fa-print"></i>';
        printButton.style.cssText = 'position:fixed;bottom:140px;right:20px;width:45px;height:45px;border-radius:50%;background:var(--card-bg);color:var(--text-color);border:none;box-shadow:var(--shadow);z-index:1000;cursor:pointer;';
        printButton.title = 'Print this framework page';
        printButton.addEventListener('click', () => window.print());
        document.body.appendChild(printButton);
    });