document.addEventListener('DOMContentLoaded', function() {
        // Communication Framework Carousel
        const services = [
            {
                icon: 'fas fa-comments',
                title: 'Message Architecture',
                description: 'मुख्य राजनीतिक संदेश और प्राथमिकताएं तय करना - Defining core political messages, priorities, and communication hierarchy for consistent public messaging.'
            },
            {
                icon: 'fas fa-pen-fancy',
                title: 'Narrative & Tone Definition',
                description: 'भाषा, टोन और संवाद शैली तय करना - Establishing communication style, tone of voice, and narrative approach that resonates with target audiences.'
            },
            {
                icon: 'fas fa-th',
                title: 'Platform-Specific Communication',
                description: 'हर प्लेटफॉर्म के लिए अलग संदेश रणनीति - Customizing messages for different platforms (Facebook, Instagram, X, YouTube) based on audience behavior.'
            },
            {
                icon: 'fas fa-palette',
                title: 'Visual & Content Alignment',
                description: 'विजुअल और कंटेंट में एकरूपता - Ensuring visual consistency, brand alignment, and message unity across all communication touchpoints.'
            },
            {
                icon: 'fas fa-handshake',
                title: 'Public Engagement Strategy',
                description: 'जनता से संवाद और प्रतिक्रिया प्रबंधन - Structured approach to public comments, questions, feedback, and community building.'
            },
            {
                icon: 'fas fa-chart-line',
                title: 'Monitoring & Message Optimization',
                description: 'प्रभाव के आधार पर सुधार - Continuous tracking of message effectiveness, sentiment analysis, and strategic optimization.'
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

        // Communication Testimonials Carousel
        const communicationTestimonials = [
            {
                text: "The communication framework transformed how our party approaches public messaging. Our message consistency improved by 80%, and public trust in our leadership increased significantly within 4 months.",
                author: "Rajesh Verma",
                role: "Party Spokesperson",
                location: "Uttar Pradesh",
                avatar: "RV"
            },
            {
                text: "As a minister, every word matters. InfoGrip's communication strategy helped me deliver clear, consistent messages across all platforms. Our public approval ratings improved by 35% in 6 months.",
                author: "Dr. Anita Sharma",
                role: "State Minister",
                location: "Rajasthan",
                avatar: "AS"
            },
            {
                text: "The crisis communication protocols saved our campaign during a major controversy. The strategic response minimized damage and actually improved our public perception. Highly recommended for any political leader.",
                author: "Vikram Singh",
                role: "MP Candidate",
                location: "Madhya Pradesh",
                avatar: "VS"
            },
            {
                text: "The bilingual communication strategy connected us with both Hindi and English speaking voters. Our messages now resonate across demographics, increasing our political reach by 60%.",
                author: "Sanjay Patel",
                role: "MLA Candidate",
                location: "Gujarat",
                avatar: "SP"
            }
        ];

        const politicalTestimonialTrack = document.getElementById('political-testimonial-track');
        const politicalCarouselNav = document.getElementById('political-carousel-nav');
        let currentPoliticalSlide = 0;

        // Create communication testimonial slides
        communicationTestimonials.forEach((testimonial, index) => {
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
            currentPoliticalSlide = (currentPoliticalSlide + 1) % communicationTestimonials.length;
            goToPoliticalSlide(currentPoliticalSlide);
        }

        function prevPoliticalSlide() {
            currentPoliticalSlide = (currentPoliticalSlide - 1 + communicationTestimonials.length) % communicationTestimonials.length;
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
                    animateCounter(document.getElementById('campaigns-count'), 58);
                    animateCounter(document.getElementById('leaders-count'), 73);
                    animateCounter(document.getElementById('voters-reach'), 4200);
                    animateCounter(document.getElementById('elections-count'), 96);
                    observer.unobserve(entry.target);
                }
            });
        });

        observer.observe(document.querySelector('.political-stats'));

        // Auto-typing text effect
        const typingText = document.getElementById('typing-text');
        const texts = ['Shaping Perception', 'Building Trust', 'Controlling Narrative', 'Managing Crisis'];
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

        // Download Communication Playbook
        document.getElementById('download-brochure').addEventListener('click', function(e) {
            e.preventDefault();
            alert('Political Digital Communication Playbook PDF will start downloading. For now, please contact us for detailed communication strategy.');
        });

        document.getElementById('brochure-download').addEventListener('click', function(e) {
            e.preventDefault();
            alert('Messaging Framework download will start shortly. For now, please contact us for detailed messaging strategy.');
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

        // ==================== POLITICAL COMMUNICATION FEATURES ====================

        // Blog Carousel
        const blogs = [
            {
                title: "Political Digital Communication Strategy: Framework & Execution",
                excerpt: "Complete guide to strategic political digital communication. Learn how to build messaging frameworks, control narratives, and manage public perception effectively.",
                category: "Communication Strategy",
                readLink: "../blog/political-digital-communication-strategy.html",
                image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Managing Public Perception Online: Political Leader's Guide",
                excerpt: "How political leaders can shape and manage public perception through strategic digital communication. Techniques for building trust and credibility online.",
                category: "Public Perception",
                readLink: "../blog/managing-public-perception-online.html",
                image: "https://images.unsplash.com/photo-1551135042-1035a519c37f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Crisis Communication in Politics: When Things Go Wrong",
                excerpt: "Strategic approaches to political crisis communication. How to respond to controversies, opposition attacks, and unexpected developments while protecting reputation.",
                category: "Crisis Communication",
                readLink: "../blog/political-crisis-communication.html",
                image: "https://images.unsplash.com/photo-1580136607996-cab1c2ef76dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "डिजिटल राजनीतिक संवाद की रणनीति: हिंदी में विस्तृत मार्गदर्शन",
                excerpt: "भारतीय राजनीतिक संदर्भ में डिजिटल संवाद की पूरी रणनीति। संदेश निर्माण, जनता से जुड़ाव, और संकट प्रबंधन के तरीके हिंदी में समझाए गए।",
                category: "हिंदी गाइड",
                readLink: "../blog/digital-rajnitik-samvad-strategy.html",
                image: "https://images.unsplash.com/photo-1590080876092-9667b2d6b668?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Message Consistency in Political Communication: Why It Matters",
                excerpt: "How consistent messaging builds political credibility and trust. Techniques for maintaining message integrity across platforms, time, and audience segments.",
                category: "Message Consistency",
                readLink: "../blog/political-message-consistency.html",
                image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Tone of Voice in Political Communication: Finding the Right Balance",
                excerpt: "How to establish the perfect communication tone for political leadership. Balancing authority with approachability, formality with connection, and vision with practicality.",
                category: "Communication Tone",
                readLink: "../blog/political-communication-tone.html",
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
                question: "What is political digital communication?",
                answer: "Political digital communication is the planned use of digital platforms to deliver consistent, clear, and credible political messages to the public. It transforms spontaneous political statements into strategic communication that builds public trust and controls narrative."
            },
            {
                question: "How is this different from social media management?",
                answer: "Social media management focuses on posting and engagement. Political digital communication focuses on strategic messaging, narrative control, public perception management, and crisis communication. It's about what you say, how you say it, and when you say it for maximum political impact."
            },
            {
                question: "Is this useful for local leaders?",
                answer: "Absolutely. Local leaders benefit most from strategic communication. Clear messaging on local issues, consistent public engagement, and effective crisis management are crucial for municipal, panchayat, and ward-level political success."
            },
            {
                question: "Do you provide Hindi communication support?",
                answer: "Yes. We provide bilingual communication strategies with Hindi for emotional public connection and English for formal communication. Our team includes native Hindi speakers who understand cultural nuances and regional communication styles."
            },
            {
                question: "How do you handle political crises online?",
                answer: "We have pre-defined crisis communication protocols including rapid response templates, escalation matrices, sentiment monitoring, and strategic silence planning. Our team manages the situation while protecting reputation and controlling narrative."
            },
            {
                question: "Who manages messaging decisions?",
                answer: "We develop the messaging framework in collaboration with you, then our communication team executes it with daily monitoring. You retain final approval on all major messages while we handle execution, optimization, and crisis management."
            },
            {
                question: "What about regional language communication?",
                answer: "We provide communication support in major regional languages including Hindi, Marathi, Gujarati, Bengali, and Tamil. Our team includes regional language experts who understand local cultural context and communication preferences."
            },
            {
                question: "How do you measure communication effectiveness?",
                answer: "We track message reach, engagement metrics, sentiment analysis, public feedback, and perception shifts. Regular reports show how communication impacts public opinion and political objectives."
            },
            {
                question: "Can you train our existing team?",
                answer: "Yes. We provide comprehensive communication training covering messaging frameworks, platform strategies, crisis protocols, and public engagement techniques. This ensures your team can execute the communication strategy effectively."
            },
            {
                question: "What's the typical timeline for results?",
                answer: "Initial framework development takes 2-3 weeks. Visible improvements in message consistency appear within 1 month. Significant public perception shifts typically occur within 3-6 months of consistent strategic communication."
            },
            {
                question: "How do you handle negative comments or trolling?",
                answer: "We have structured response protocols: ignore trivial trolling, respond professionally to genuine criticism, and escalate serious threats. The goal is maintaining dignity while addressing legitimate concerns."
            },
            {
                question: "What about confidentiality and message security?",
                answer: "We follow strict confidentiality protocols. All communication strategies are protected by NDA, our team undergoes security training, and sensitive messages are handled through secure channels with limited access."
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
            document.cookie = "politicalCommunicationPopupClosed=true; max-age=604800; path=/";
        });

        popupLater.addEventListener('click', () => {
            politicalPopup.style.display = 'none';
            // Show again after 24 hours
            setTimeout(() => {
                if (!document.cookie.includes('politicalCommunicationPopupClosed')) {
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
        if (document.cookie.includes('politicalCommunicationPopupClosed')) {
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

        // Enhanced Chatbot for Political Communication
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
                    ? "Excellent! Let's continue in English. I'm here to help with your political digital communication needs. What would you like to know about strategic messaging and public perception management?" 
                    : "बहुत बढ़िया! हिंदी में बातचीत जारी रखते हैं। मैं आपकी राजनीतिक डिजिटल संवाद आवश्यकताओं में मदद करने के लिए यहां हूं। आप रणनीतिक संदेश और सार्वजनिक धारणा प्रबंधन के बारे में क्या जानना चाहेंगे?";
                
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
                    case 'communication-services':
                        message = selectedLanguage === 'english' 
                            ? "What does your political digital communication service include?" 
                            : "आपकी राजनीतिक डिजिटल संवाद सेवा में क्या शामिल है?";
                        break;
                    case 'communication-pricing':
                        message = selectedLanguage === 'english' 
                            ? "What are your pricing options for communication services?" 
                            : "संवाद सेवाओं के लिए आपकी कीमतें क्या हैं?";
                        break;
                    case 'communication-portfolio':
                        message = selectedLanguage === 'english' 
                            ? "Can I see examples of political communication you've managed?" 
                            : "क्या मैं आपके द्वारा प्रबंधित राजनीतिक संवाद के उदाहरण देख सकता हूं?";
                        break;
                    case 'contact-communication':
                        message = selectedLanguage === 'english' 
                            ? "How can I contact your communication strategy team?" 
                            : "मैं आपकी संवाद रणनीति टीम से कैसे संपर्क कर सकता हूं?";
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
                        ? "Great question! Our political digital communication service includes six core components: Message Architecture, Narrative Definition, Platform-Specific Communication, Visual Alignment, Public Engagement Strategy, and Monitoring & Optimization. Each component ensures systematic and effective public messaging. Would you like details on any specific component?" 
                        : "बढ़िया सवाल! हमारी राजनीतिक डिजिटल संवाद सेवा में छह मुख्य घटक शामिल हैं: संदेश वास्तुकला, कथा परिभाषा, प्लेटफॉर्म-विशिष्ट संचार, दृश्य संरेखण, सार्वजनिक जुड़ाव रणनीति, और निगरानी और अनुकूलन। प्रत्येक घटक व्यवस्थित और प्रभावी सार्वजनिक संदेश सुनिश्चित करता है। क्या आप किसी विशिष्ट घटक के बारे में विवरण चाहेंगे?";
                    
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
                            "That's an excellent question about political communication strategy. Our systematic approach transforms random political statements into strategic messaging that builds public trust. Would you like to schedule a free communication assessment with our strategy team?",
                            "Great inquiry about political digital communication! For detailed communication planning, I recommend our personalized communication audit. Our experts analyze your current messaging, public perception, and communication gaps to provide customized recommendations.",
                            "I understand your query about political communication. Our strategic approach has helped numerous political leaders shape public perception across India. Let me connect you with our communication strategy team for personalized guidance."
                        ]
                        : [
                            "राजनीतिक संवाद रणनीति के बारे में यह एक उत्कृष्ट प्रश्न है। हमारा व्यवस्थित दृष्टिकोण अनियमित राजनीतिक बयानों को रणनीतिक संदेश में बदल देता है जो सार्वजनिक विश्वास बनाता है। क्या आप हमारी रणनीति टीम के साथ एक मुफ्त संवाद मूल्यांकन शेड्यूल करना चाहेंगे?",
                            "राजनीतिक डिजिटल संवाद के बारे में बढ़िया जिज्ञासा! विस्तृत संवाद योजना के लिए, मैं हमारे व्यक्तिगत संवाद ऑडिट की सलाह देता हूं। हमारे विशेषज्ञ आपके वर्तमान संदेश, सार्वजनिक धारणा और संचार अंतराल का विश्लेषण करते हैं और अनुकूलित सिफारिशें प्रदान करते हैं।",
                            "मैं राजनीतिक संवाद के बारे में आपकी जिज्ञासा समझता हूं। हमारे रणनीतिक दृष्टिकोण ने पूरे भारत में कई राजनीतिक नेताओं को सार्वजनिक धारणा को आकार देने में मदद की है। मुझे व्यक्तिगत मार्गदर्शन के लिए आपको हमारी संवाद रणनीति टीम से जोड़ने दें।"
                        ];
                    
                    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                    
                    const botMessageDiv = document.createElement('div');
                    botMessageDiv.className = 'message bot-message';
                    botMessageDiv.innerHTML = `
                        ${randomResponse}
                        <div style="margin-top: 10px;">
                            <button class="action-btn" onclick="window.open('onboarding.html', '_blank')" style="margin-right: 10px;">
                                <i class="fas fa-file-alt"></i> Book Communication Audit
                            </button>
                            <button class="action-btn" onclick="window.open('tel:+919928140288')">
                                <i class="fas fa-phone"></i> Call Communication Expert
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
        printButton.title = 'Print this communication page';
        printButton.addEventListener('click', () => window.print());
        document.body.appendChild(printButton);
    });