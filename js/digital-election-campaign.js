document.addEventListener('DOMContentLoaded', function() {
        // Campaign Phases Carousel
        const services = [
            {
                icon: 'fas fa-user-tie',
                title: 'Pre-Election Positioning',
                description: 'पहचान, छवि और डिजिटल उपस्थिति तैयार करना - Building political identity, digital presence, and voter recognition before official campaigning begins.'
            },
            {
                icon: 'fas fa-bullhorn',
                title: 'Narrative & Messaging Strategy',
                description: 'मुख्य चुनावी संदेश और मुद्दे तय करना - Defining core election messages, issue priorities, and political narrative framework.'
            },
            {
                icon: 'fas fa-video',
                title: 'High-Reach Content & Reels',
                description: 'रील्स, वीडियो और विजुअल कैंपेन - Creating viral reels, emotional videos, and visual content for maximum voter engagement.'
            },
            {
                icon: 'fas fa-bullseye',
                title: 'Audience Targeting & Amplification',
                description: 'सही मतदाता तक सही संदेश - Identifying voter segments, customizing messages, and amplifying reach through strategic distribution.'
            },
            {
                icon: 'fas fa-reply-all',
                title: 'Rapid Response & Counter Messaging',
                description: 'विपक्षी नैरेटिव का तुरंत जवाब - Monitoring opposition, responding to attacks, and controlling narrative in real-time.'
            },
            {
                icon: 'fas fa-flag-checkered',
                title: 'Election-Day & Result-Phase Strategy',
                description: 'चुनाव दिवस और परिणाम के समय रणनीति - Specialized content for polling day, result announcements, and post-election positioning.'
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

        // Election Testimonials Carousel
        const electionTestimonials = [
            {
                text: "The digital campaign strategy transformed our election outcome. We reached 3x more voters than our opponent at half the cost. The real-time response system handled opposition attacks perfectly.",
                author: "Vikram Singh",
                role: "MLA Candidate",
                location: "Rajasthan",
                avatar: "VS"
            },
            {
                text: "As a first-time candidate, I needed digital presence that built trust quickly. InfoGrip's campaign strategy made me recognizable in my constituency within 60 days. We won with a comfortable margin.",
                author: "Anjali Sharma",
                role: "Municipal Candidate",
                location: "Uttar Pradesh",
                avatar: "AS"
            },
            {
                text: "The bilingual campaign content connected with both urban educated voters and rural masses. Our reels strategy went viral, reaching young voters who never attend political rallies.",
                author: "Rajesh Kumar",
                role: "MP Candidate",
                location: "Madhya Pradesh",
                avatar: "RK"
            },
            {
                text: "During the critical election phase, the rapid response team managed three major controversies without damage to our reputation. Digital crisis management saved our campaign.",
                author: "Sanjay Patel",
                role: "District President",
                location: "Gujarat",
                avatar: "SP"
            }
        ];

        const politicalTestimonialTrack = document.getElementById('political-testimonial-track');
        const politicalCarouselNav = document.getElementById('political-carousel-nav');
        let currentPoliticalSlide = 0;

        // Create election testimonial slides
        electionTestimonials.forEach((testimonial, index) => {
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
            currentPoliticalSlide = (currentPoliticalSlide + 1) % electionTestimonials.length;
            goToPoliticalSlide(currentPoliticalSlide);
        }

        function prevPoliticalSlide() {
            currentPoliticalSlide = (currentPoliticalSlide - 1 + electionTestimonials.length) % electionTestimonials.length;
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
                    animateCounter(document.getElementById('campaigns-count'), 47);
                    animateCounter(document.getElementById('leaders-count'), 62);
                    animateCounter(document.getElementById('voters-reach'), 8500000);
                    animateCounter(document.getElementById('elections-count'), 89);
                    observer.unobserve(entry.target);
                }
            });
        });

        observer.observe(document.querySelector('.political-stats'));

        // Auto-typing text effect
        const typingText = document.getElementById('typing-text');
        const texts = ['Winning Trust', 'Reaching Voters', 'Building Narrative', 'Delivering Votes'];
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

        // Download Campaign Plan
        document.getElementById('download-brochure').addEventListener('click', function(e) {
            e.preventDefault();
            alert('Digital Election Campaign Plan PDF will start downloading. For now, please contact us for detailed campaign planning.');
        });

        document.getElementById('brochure-download').addEventListener('click', function(e) {
            e.preventDefault();
            alert('Election Playbook download will start shortly. For now, please contact us for detailed election strategy.');
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

        // ==================== ELECTION CAMPAIGN FEATURES ====================

        // Blog Carousel
        const blogs = [
            {
                title: "How Digital Campaigns Influence Voters: Psychology & Strategy",
                excerpt: "Understanding how digital content shapes voter perception, builds trust, and influences voting decisions. Psychological principles behind successful election campaigns.",
                category: "Voter Psychology",
                readLink: "../blog/digital-campaigns-influence-voters.html",
                image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Election Reels Strategy Explained: Winning Young Voters",
                excerpt: "How to use Instagram Reels, YouTube Shorts, and TikTok for election campaigns. Content formats, timing, and messaging that resonate with young Indian voters.",
                category: "Reels Strategy",
                readLink: "../blog/election-reels-strategy.html",
                image: "https://images.unsplash.com/photo-1551135042-1035a519c37f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Social Media Mistakes During Elections: What to Avoid",
                excerpt: "Common digital campaign mistakes that cost elections: inconsistent messaging, poor crisis response, wrong platform focus, and failing to adapt to voter feedback.",
                category: "Campaign Mistakes",
                readLink: "../blog/election-social-media-mistakes.html",
                image: "https://images.unsplash.com/photo-1580136607996-cab1c2ef76dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "डिजिटल चुनाव प्रचार की रणनीति: हिंदी में विस्तृत गाइड",
                excerpt: "भारतीय चुनावों के लिए डिजिटल प्रचार की पूरी रणनीति। सोशल मीडिया, कंटेंट प्लानिंग, और वोटर एंगेजमेंट के तरीके हिंदी में समझाए गए।",
                category: "हिंदी गाइड",
                readLink: "../blog/digital-chunav-prasar-strategy.html",
                image: "https://images.unsplash.com/photo-1590080876092-9667b2d6b668?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Election Commission Guidelines for Digital Campaigning",
                excerpt: "Complete guide to Election Commission rules for digital political advertising. Spending limits, disclaimers, silence period, and compliance requirements explained.",
                category: "Legal Guidelines",
                readLink: "../blog/eci-digital-campaign-guidelines.html",
                image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Local Election Digital Strategy: Winning Municipal & Panchayat",
                excerpt: "How to adapt digital campaigning for local elections. Hyper-local content, community-specific messaging, and ward-level targeting strategies.",
                category: "Local Elections",
                readLink: "../blog/local-election-digital-strategy.html",
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
                question: "What is a digital election campaign?",
                answer: "A digital election campaign uses online platforms, content strategy, and data analytics to influence voter perception and win elections. It complements traditional campaigning with systematic digital outreach across social media, messaging apps, and digital advertising."
            },
            {
                question: "Is digital campaigning legal in India?",
                answer: "Yes, digital campaigning is completely legal in India when following Election Commission guidelines. All political ads require 'Paid for by' disclaimers, spending must be within prescribed limits, and content must comply with model code of conduct during election periods."
            },
            {
                question: "Is this useful for local elections?",
                answer: "Absolutely. Digital campaigns are particularly effective for local elections (municipal, panchayat) where voters are highly engaged with local issues. Hyper-local content, community-specific messaging, and ward-level targeting make digital campaigning crucial for local electoral success."
            },
            {
                question: "Do you manage content in Hindi?",
                answer: "Yes, we provide bilingual campaign content in both Hindi and English. Hindi content focuses on emotional voter connection, local issues, and cultural context. English content addresses formal communication, policy details, and educated urban voters."
            },
            {
                question: "How early should a digital campaign start?",
                answer: "Optimal timeline: 6-12 months before elections for comprehensive campaigns, 3-6 months for focused digital presence, and minimum 90 days for basic election campaigns. Early start allows narrative building, audience growth, and systematic voter connection."
            },
            {
                question: "Who manages the campaign execution?",
                answer: "Our specialized election campaign team designs and executes the strategy. We provide daily content, real-time monitoring, rapid response management, and performance optimization. Regular coordination with your team ensures alignment with ground campaigning."
            },
            {
                question: "What's different from normal social media management?",
                answer: "Election campaigns are time-bound, high-intensity, and outcome-focused. Every post targets voter conversion, messaging aligns with electoral goals, and response time is critical. Normal social media management focuses on brand building; election campaigns focus on winning votes."
            },
            {
                question: "Can you handle crisis during elections?",
                answer: "Yes. We have pre-defined crisis protocols for opposition attacks, controversies, and unexpected developments. Rapid response teams, approved messaging templates, and escalation matrices ensure reputation protection during critical election phases."
            },
            {
                question: "What about Election Commission guidelines?",
                answer: "We ensure complete compliance with ECI guidelines. All content includes required disclaimers, spending is tracked as per limits, and silence period restrictions are strictly followed. We provide compliance reports for campaign transparency."
            },
            {
                question: "How do you measure campaign success?",
                answer: "We track quantitative metrics (reach, engagement, follower growth) and qualitative impact (sentiment analysis, voter recall, media mentions). Pre- and post-campaign surveys measure shifts in voter perception and likelihood to vote."
            },
            {
                question: "Can existing teams be trained?",
                answer: "Yes. We provide comprehensive training for your campaign teams covering digital strategy, content creation, platform management, and crisis response. This ensures smooth coordination and effective campaign execution."
            },
            {
                question: "What's the typical campaign budget?",
                answer: "Budgets vary by constituency size and campaign scope: ₹5-15 lakhs for MLA campaigns, ₹20-50 lakhs for MP campaigns, and ₹1-5 crores for comprehensive campaigns. We provide detailed budget planning based on electoral goals and competition level."
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
            document.cookie = "electionCampaignPopupClosed=true; max-age=604800; path=/";
        });

        popupLater.addEventListener('click', () => {
            politicalPopup.style.display = 'none';
            // Show again after 24 hours
            setTimeout(() => {
                if (!document.cookie.includes('electionCampaignPopupClosed')) {
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
        if (document.cookie.includes('electionCampaignPopupClosed')) {
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

        // Enhanced Chatbot for Election Campaigns
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
                    ? "Excellent! Let's continue in English. I'm here to help with your digital election campaign needs. What would you like to know about winning elections through digital strategy?" 
                    : "बहुत बढ़िया! हिंदी में बातचीत जारी रखते हैं। मैं आपकी डिजिटल चुनाव अभियान आवश्यकताओं में मदद करने के लिए यहां हूं। आप डिजिटल रणनीति के माध्यम से चुनाव जीतने के बारे में क्या जानना चाहेंगे?";
                
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
                    case 'campaign-services':
                        message = selectedLanguage === 'english' 
                            ? "What does your digital election campaign service include?" 
                            : "आपकी डिजिटल चुनाव अभियान सेवा में क्या शामिल है?";
                        break;
                    case 'campaign-pricing':
                        message = selectedLanguage === 'english' 
                            ? "What are your pricing options for election campaigns?" 
                            : "चुनाव अभियानों के लिए आपकी कीमतें क्या हैं?";
                        break;
                    case 'campaign-portfolio':
                        message = selectedLanguage === 'english' 
                            ? "Can I see examples of election campaigns you've managed?" 
                            : "क्या मैं आपके द्वारा प्रबंधित चुनाव अभियानों के उदाहरण देख सकता हूं?";
                        break;
                    case 'contact-campaign':
                        message = selectedLanguage === 'english' 
                            ? "How can I contact your election campaign team?" 
                            : "मैं आपकी चुनाव अभियान टीम से कैसे संपर्क कर सकता हूं?";
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
                        ? "Great question! Our digital election campaign service includes six core phases: Pre-Election Positioning, Narrative Strategy, High-Reach Content, Audience Targeting, Rapid Response, and Election-Day Strategy. Each phase is customized for your specific electoral goals. Would you like details on any specific phase?" 
                        : "बढ़िया सवाल! हमारी डिजिटल चुनाव अभियान सेवा में छह मुख्य चरण शामिल हैं: पूर्व-चुनाव स्थिति, नैरेटिव रणनीति, उच्च-पहुंच सामग्री, दर्शक लक्ष्यीकरण, त्वरित प्रतिक्रिया, और चुनाव-दिवस रणनीति। प्रत्येक चरण आपके विशिष्ट चुनावी लक्ष्यों के लिए अनुकूलित किया जाता है। क्या आप किसी विशिष्ट चरण के बारे में विवरण चाहेंगे?";
                    
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
                            "That's an excellent question about election campaign strategy. Our phased approach ensures systematic voter connection from pre-election positioning to result announcement. Would you like to schedule a free campaign assessment with our election strategy team?",
                            "Great inquiry about digital election campaigns! For detailed campaign planning, I recommend our personalized campaign audit. Our experts analyze your constituency, competition, and voter demographics to provide customized campaign recommendations.",
                            "I understand your query about election campaigning. Our data-driven approach has helped numerous candidates win elections across India. Let me connect you with our campaign strategy team for personalized electoral guidance."
                        ]
                        : [
                            "चुनाव अभियान रणनीति के बारे में यह एक उत्कृष्ट प्रश्न है। हमारा चरणबद्ध दृष्टिकोण पूर्व-चुनाव स्थिति से लेकर परिणाम घोषणा तक व्यवस्थित मतदाता जुड़ाव सुनिश्चित करता है। क्या आप हमारी चुनाव रणनीति टीम के साथ एक मुफ्त अभियान मूल्यांकन शेड्यूल करना चाहेंगे?",
                            "डिजिटल चुनाव अभियानों के बारे में बढ़िया जिज्ञासा! विस्तृत अभियान योजना के लिए, मैं हमारे व्यक्तिगत अभियान ऑडिट की सलाह देता हूं। हमारे विशेषज्ञ आपके निर्वाचन क्षेत्र, प्रतिस्पर्धा और मतदाता जनसांख्यिकी का विश्लेषण करते हैं और अनुकूलित अभियान सिफारिशें प्रदान करते हैं।",
                            "मैं चुनाव अभियान के बारे में आपकी जिज्ञासा समझता हूं। हमारे डेटा-संचालित दृष्टिकोण ने पूरे भारत में कई उम्मीदवारों को चुनाव जीतने में मदद की है। मुझे व्यक्तिगत चुनावी मार्गदर्शन के लिए आपको हमारी अभियान रणनीति टीम से जोड़ने दें।"
                        ];
                    
                    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                    
                    const botMessageDiv = document.createElement('div');
                    botMessageDiv.className = 'message bot-message';
                    botMessageDiv.innerHTML = `
                        ${randomResponse}
                        <div style="margin-top: 10px;">
                            <button class="action-btn" onclick="window.open('onboarding.html', '_blank')" style="margin-right: 10px;">
                                <i class="fas fa-file-alt"></i> Book Campaign Assessment
                            </button>
                            <button class="action-btn" onclick="window.open('tel:+919928140288')">
                                <i class="fas fa-phone"></i> Call Campaign Expert
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
        printButton.title = 'Print this campaign page';
        printButton.addEventListener('click', () => window.print());
        document.body.appendChild(printButton);
    });