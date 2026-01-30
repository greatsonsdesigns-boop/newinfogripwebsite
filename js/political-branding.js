
    document.addEventListener('DOMContentLoaded', function() {
        // Existing Services Carousel
        const services = [
            {
                icon: 'fas fa-users',
                title: 'Social Media Reputation Management',
                description: 'Build and maintain a positive online presence across all platforms with 24/7 monitoring.'
            },
            {
                icon: 'fas fa-newspaper',
                title: 'Daily Campaign Updates & Graphics',
                description: 'Consistent, engaging content to keep your campaign top of mind with voters.'
            },
            {
                icon: 'fas fa-bullhorn',
                title: 'Voter Outreach Strategy',
                description: 'Targeted messaging to connect with different voter demographics and communities.'
            },
            {
                icon: 'fas fa-camera',
                title: 'Press & Event Coverage',
                description: 'Professional coverage of rallies, speeches, and public appearances with media coordination.'
            },
            {
                icon: 'fab fa-whatsapp',
                title: 'WhatsApp Broadcasting Setup',
                description: 'Automated messaging to reach voters directly on their phones with personalized updates.'
            },
            {
                icon: 'fas fa-shield-alt',
                title: 'Crisis Management',
                description: 'Rapid response strategies to protect your reputation during controversies and attacks.'
            },
            {
                icon: 'fas fa-video',
                title: 'Video Editing & Reels Creation',
                description: 'Compelling video content optimized for social media engagement and viral potential.'
            },
            {
                icon: 'fas fa-handshake',
                title: 'Influencer & Public Support Handling',
                description: 'Leverage endorsements from key community figures, celebrities, and influencers.'
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
                text: "InfoGrip transformed my political campaign completely. My social media reach increased by 400% and we connected with voters like never before. Their team understands the nuances of political communication.",
                author: "Arvind Sharma",
                role: "MLA Candidate",
                location: "Uttar Pradesh",
                avatar: "AS"
            },
            {
                text: "As a female politician, I needed a team that understands gender-specific campaigning. InfoGrip created a powerful narrative that resonated with women voters. We won with a historic margin!",
                author: "Dr. Priya Singh",
                role: "MP Candidate",
                location: "Rajasthan",
                avatar: "PS"
            },
            {
                text: "The WhatsApp automation and daily content strategy helped us maintain constant voter contact. Our campaign ran like a well-oiled machine. Highly recommended for any serious political candidate.",
                author: "Rahul Verma",
                role: "Youth Leader",
                location: "Delhi",
                avatar: "RV"
            },
            {
                text: "During the election crisis, InfoGrip's rapid response team protected my reputation and turned the narrative in our favor. Their crisis management is exceptional for political campaigns.",
                author: "Sanjay Patel",
                role: "Municipal Corporator",
                location: "Gujarat",
                avatar: "SP"
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
                    animateCounter(document.getElementById('campaigns-count'), 50);
                    animateCounter(document.getElementById('leaders-count'), 35);
                    animateCounter(document.getElementById('voters-reach'), 2500000);
                    animateCounter(document.getElementById('elections-count'), 75);
                    observer.unobserve(entry.target);
                }
            });
        });

        observer.observe(document.querySelector('.political-stats'));

        // Auto-typing text effect
        const typingText = document.getElementById('typing-text');
        const texts = ['Winning Campaigns', 'Digital Presence', 'Voter Connection', 'Political Legacy'];
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

        // Download Brochure
        document.getElementById('download-brochure').addEventListener('click', function(e) {
            e.preventDefault();
            alert('Political Campaign Brochure download will start shortly. For now, please contact us for detailed information.');
        });

        document.getElementById('brochure-download').addEventListener('click', function(e) {
            e.preventDefault();
            alert('Political Strategy Kit download will start shortly. For now, please contact us for detailed information.');
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

        // ==================== NEW FEATURES ====================

        // Blog Carousel
        const blogs = [
            {
                title: "How to Win Elections in India: Digital Strategy 2026",
                excerpt: "Learn the proven digital strategies that helped political candidates win elections across India. From social media dominance to WhatsApp campaigning, discover what works in 2026.",
                category: "Election Strategy",
                readLink: "../blog/how-to-win-elections-india.html",
                image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Political Branding vs Political Marketing: Key Differences",
                excerpt: "Understanding the crucial difference between building a political brand and marketing it. Learn why successful politicians master both for long-term success.",
                category: "Branding",
                readLink: "../blog/political-branding-vs-marketing.html",
                image: "https://images.unsplash.com/photo-1551135042-1035a519c37f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Digital Campaign Strategy for Indian Politicians",
                excerpt: "Step-by-step guide to creating effective digital campaigns for Indian elections. Budget allocation, platform selection, and measurement metrics explained.",
                category: "Digital Strategy",
                readLink: "../blog/digital-campaign-strategy.html",
                image: "https://images.unsplash.com/photo-1580136607996-cab1c2ef76dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Social Media Strategy for Political Leaders in Hindi Belt",
                excerpt: "How to effectively use social media to connect with Hindi-speaking voters. Language nuances, cultural references, and regional content strategies.",
                category: "Social Media",
                readLink: "../blog/hindi-social-media-strategy.html",
                image: "https://images.unsplash.com/photo-1590080876092-9667b2d6b668?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "2026 Election Preparation: 12-Month Timeline",
                excerpt: "Complete timeline for election preparation starting 12 months before polling day. What to do each month for maximum impact and voter connection.",
                category: "Planning",
                readLink: "../blog/2026-election-timeline.html",
                image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Hindi Political Campaigning: Language Strategy",
                excerpt: "How to craft political messages in Hindi that resonate with diverse audiences across North India. Balancing formal and colloquial language for maximum impact.",
                category: "Communication",
                readLink: "../blog/hindi-political-communication.html",
                image: "https://images.unsplash.com/photo-1551135042-1035a519c37f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Election Commission Guidelines for Digital Campaigns",
                excerpt: "Complete guide to Election Commission rules for digital political advertising. Spending limits, disclaimers, silence period, and compliance requirements.",
                category: "Legal",
                readLink: "../blog/eci-digital-guidelines.html",
                image: "https://images.unsplash.com/photo-1580136607996-cab1c2ef76dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Youth Voter Targeting: Strategies That Work",
                excerpt: "How to connect with 18-35 year old voters through digital channels. Understanding youth issues, communication style, and platform preferences.",
                category: "Targeting",
                readLink: "../blog/youth-voter-strategy.html",
                image: "https://images.unsplash.com/photo-1590080876092-9667b2d6b668?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
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
                question: "What is political branding?",
                answer: "Political branding is the process of creating a unique identity, narrative, and emotional connection for a political candidate or party. It goes beyond logos and colors to establish core values, messaging consistency, and voter trust that differentiates them from opponents in elections."
            },
            {
                question: "Is political branding legal in India?",
                answer: "Yes, political branding is completely legal in India as long as it follows Election Commission guidelines. Campaign spending must be within prescribed limits, content should not violate model code of conduct, and all advertisements require proper disclaimers and transparency about funding sources."
            },
            {
                question: "What's the difference between political marketing and political branding?",
                answer: "Political branding establishes who you are—your identity, values, and long-term reputation. Political marketing promotes that identity through campaigns, advertising, and voter outreach. Branding is strategic (long-term), while marketing is tactical (campaign-specific). Both are essential for election success."
            },
            {
                question: "When should a political campaign start?",
                answer: "For best results, political campaigns should start 6-12 months before elections. MLA/MP campaigns need 6-8 months for proper groundwork. Early start allows for voter research, narrative development, volunteer mobilization, and gradual brand building rather than rushed last-minute efforts."
            },
            {
                question: "What about political branding for first-time candidates?",
                answer: "First-time candidates need to establish name recognition and credibility. We focus on personal story narrative, community engagement, and consistent visibility. Digital platforms are particularly effective for new candidates to build following without large budgets."
            },
            {
                question: "What are digital campaigning rules by Election Commission of India?",
                answer: "ECI requires all political ads to carry disclaimer 'Paid for by...', spending records must be maintained, no anonymous donations above ₹2000, no campaigning 48 hours before polling (silence period), and social media posts during silence period must be pre-approved."
            },
            {
                question: "What is the cost of political branding in India?",
                answer: "Costs vary by scale: MLA campaigns ₹5-15 lakhs, MP campaigns ₹20-50 lakhs, comprehensive services ₹1-5 crores. Factors include constituency size, competition level, duration, and services needed (digital, ground, media, research). We offer packages starting from ₹25,000/month for basic digital presence."
            },
            {
                question: "What is the role of social media in elections?",
                answer: "Social media reaches 60-80% of urban voters and 40-60% of rural voters in India. It allows targeted messaging, real-time engagement, crisis management, and organic reach at low cost. Facebook, WhatsApp, and Instagram are most effective for Indian political campaigns."
            },
            {
                question: "Hindi vs English political messaging - which is better?",
                answer: "Use Hindi for emotional connection with masses, English for urban educated voters and media. Most successful campaigns use Hindi for rallies/social media, English for press releases/policy documents. Regional languages should be used where relevant for local connection."
            },
            {
                question: "What are local constituency targeting methods?",
                answer: "Effective methods include: 1) Ward-level WhatsApp groups 2) Hyper-local Facebook pages 3) Local issue content 4) Community influencer engagement 5) Area-specific problem-solving content 6) Vernacular language communication 7) Local event coverage and participation."
            },
            {
                question: "How to measure political campaign success?",
                answer: "Key metrics: 1) Social media reach/engagement 2) Website traffic 3) Volunteer signups 4) Donation amounts 5) Event attendance 6) Media mentions 7) Voter sentiment surveys 8) Name recognition growth 9) Polling data trends 10) Final election results."
            },
            {
                question: "Can political branding help between elections?",
                answer: "Absolutely. Consistent branding between elections maintains voter connection, builds credibility for future campaigns, establishes thought leadership, and creates a foundation for re-election. Year-round engagement prevents 'starting from zero' each election cycle."
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
            document.cookie = "politicalPopupClosed=true; max-age=604800; path=/";
        });

        popupLater.addEventListener('click', () => {
            politicalPopup.style.display = 'none';
            // Show again after 24 hours
            setTimeout(() => {
                if (!document.cookie.includes('politicalPopupClosed')) {
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
        if (document.cookie.includes('politicalPopupClosed')) {
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
        const backToTop = document.getElementById('backToTop');
        
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

        // Enhanced Chatbot (existing functionality preserved)
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
                    ? "Great! Let's continue in English. I'm here to help with your political campaign needs. What would you like to know?" 
                    : "बढ़िया! हिंदी में बातचीत जारी रखते हैं। मैं आपकी राजनीतिक अभियान आवश्यकताओं में मदद करने के लिए यहां हूं। आप क्या जानना चाहेंगे?";
                
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
                    case 'political-services':
                        message = selectedLanguage === 'english' 
                            ? "What political campaign services do you offer?" 
                            : "आप कौन सी राजनीतिक अभियान सेवाएं प्रदान करते हैं?";
                        break;
                    case 'campaign-pricing':
                        message = selectedLanguage === 'english' 
                            ? "What are your prices for political campaigns?" 
                            : "राजनीतिक अभियानों के लिए आपकी कीमतें क्या हैं?";
                        break;
                    case 'political-portfolio':
                        message = selectedLanguage === 'english' 
                            ? "Can I see examples of your political work?" 
                            : "क्या मैं आपके राजनीतिक काम के उदाहरण देख सकता हूं?";
                        break;
                    case 'contact-campaign':
                        message = selectedLanguage === 'english' 
                            ? "How can I contact your political campaign team?" 
                            : "मैं आपकी राजनीतिक अभियान टीम से कैसे संपर्क कर सकता हूं?";
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
                        ? "I'd be happy to help with that! Our political campaign services include digital strategy, social media management, voter outreach, and crisis management. Would you like specific details about any of these areas?" 
                        : "मुझे आपकी मदद करने में खुशी होगी! हमारी राजनीतिक अभियान सेवाओं में डिजिटल रणनीति, सोशल मीडिया प्रबंधन, मतदाता आउटरीच और संकट प्रबंधन शामिल हैं। क्या आप इनमें से किसी भी क्षेत्र के बारे में विशिष्ट विवरण चाहेंगे?";
                    
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
                            "That's an excellent question about political campaigning. Our team specializes in creating winning strategies for Indian elections. Would you like to schedule a free consultation?",
                            "Great question! For detailed political campaign advice, I recommend speaking with our campaign specialists. They can provide customized strategies for your specific constituency.",
                            "I understand your query about political marketing. Our experts have helped numerous candidates win elections across India. Let me connect you with our campaign team for personalized guidance."
                        ]
                        : [
                            "यह राजनीतिक अभियान के बारे में एक उत्कृष्ट प्रश्न है। हमारी टीम भारतीय चुनावों के लिए जीतने वाली रणनीतियाँ बनाने में माहिर है। क्या आप एक मुफ्त परामर्श शेड्यूल करना चाहेंगे?",
                            "बढ़िया सवाल! विस्तृत राजनीतिक अभियान सलाह के लिए, मैं हमारे अभियान विशेषज्ञों से बात करने की सलाह देता हूं। वे आपके विशिष्ट निर्वाचन क्षेत्र के लिए अनुकूलित रणनीतियां प्रदान कर सकते हैं।",
                            "मैं राजनीतिक मार्केटिंग के बारे में आपकी जिज्ञासा समझता हूं। हमारे विशेषज्ञों ने पूरे भारत में कई उम्मीदवारों को चुनाव जीतने में मदद की है। मुझे व्यक्तिगत मार्गदर्शन के लिए आपको हमारी अभियान टीम से जोड़ने दें।"
                        ];
                    
                    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                    
                    const botMessageDiv = document.createElement('div');
                    botMessageDiv.className = 'message bot-message';
                    botMessageDiv.innerHTML = `
                        ${randomResponse}
                        <div style="margin-top: 10px;">
                            <button class="action-btn" onclick="window.open('onboarding.html', '_blank')" style="margin-right: 10px;">
                                <i class="fas fa-file-alt"></i> Fill Form
                            </button>
                            <button class="action-btn" onclick="window.open('tel:+919928140288')">
                                <i class="fas fa-phone"></i> Call Now
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
        printButton.title = 'Print this page';
        printButton.addEventListener('click', () => window.print());
        document.body.appendChild(printButton);
    });