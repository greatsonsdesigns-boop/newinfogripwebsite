
document.addEventListener('DOMContentLoaded', function() {
    // Services for WhatsApp voter outreach
    const services = [
        {
            icon: 'fas fa-comments',
            title: 'WhatsApp Message Planning',
            description: 'Strategic planning of message content, timing, and frequency for maximum voter engagement.'
        },
        {
            icon: 'fas fa-chess',
            title: 'Voter Communication Strategy',
            description: 'Complete strategy for voter segmentation, messaging approach, and engagement goals.'
        },
        {
            icon: 'fas fa-broadcast-tower',
            title: 'Broadcast & Group Messaging Support',
            description: 'Setup and management of WhatsApp broadcasts and group communications for targeted outreach.'
        },
        {
            icon: 'fas fa-language',
            title: 'Hindi & English Message Content',
            description: 'Professional message writing in both Hindi and English based on voter language preferences.'
        },
        {
            icon: 'fas fa-calendar-alt',
            title: 'Festival & Campaign Updates',
            description: 'Timely festival greetings and campaign update messages to maintain regular voter connection.'
        },
        {
            icon: 'fas fa-headset',
            title: 'Response Handling Guidelines',
            description: 'Professional guidelines for managing voter responses, questions, and feedback on WhatsApp.'
        },
        {
            icon: 'fas fa-chart-bar',
            title: 'Outreach Performance Reports',
            description: 'Detailed reports on message delivery, read rates, and engagement metrics for campaign improvement.'
        },
        {
            icon: 'fas fa-shield-alt',
            title: 'Compliance & Best Practices',
            description: 'Ensuring all WhatsApp communication follows legal guidelines and respects voter privacy.'
        }
    ];

    // Initialize services carousel
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

    // Carousel functions
    function goToSlide(index) {
        currentSlide = index;
        const slideWidth = servicesTrack.children[0].offsetWidth;
        servicesTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
        
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

    // NEW FEATURE: WhatsApp Reach Calculator
    const voterBaseSlider = document.getElementById('voter-base');
    const voterBaseValue = document.getElementById('voter-base-value');
    const whatsappPenetration = document.getElementById('whatsapp-penetration');
    const messageFrequency = document.getElementById('message-frequency');
    const calculateReachBtn = document.getElementById('calculate-reach');
    
    // Result elements
    const reachableVoters = document.getElementById('reachable-voters');
    const monthlyMessages = document.getElementById('monthly-messages');
    const readRate = document.getElementById('read-rate');
    const engagement = document.getElementById('engagement');

    // Update voter base display
    voterBaseSlider.addEventListener('input', function() {
        const value = parseInt(this.value);
        voterBaseValue.textContent = value.toLocaleString('en-IN');
        calculateReach();
    });

    // Recalculate when options change
    whatsappPenetration.addEventListener('change', calculateReach);
    messageFrequency.addEventListener('change', calculateReach);

    // Calculate reach function
    function calculateReach() {
        const baseVoters = parseInt(voterBaseSlider.value);
        const penetration = parseFloat(whatsappPenetration.value);
        const frequency = parseInt(messageFrequency.value);
        
        // Calculate metrics
        const reachable = Math.round(baseVoters * penetration);
        const messages = reachable * frequency;
        const readRateValue = 98; // WhatsApp average read rate
        const engagementValue = Math.min(15 + (frequency * 2), 35); // Higher frequency = higher engagement
        
        // Update display
        reachableVoters.textContent = reachable.toLocaleString('en-IN');
        monthlyMessages.textContent = messages.toLocaleString('en-IN');
        readRate.textContent = `${readRateValue}%`;
        engagement.textContent = `${engagementValue}%`;
    }

    // Initialize calculator
    calculateReach();

    // Calculate button functionality
    calculateReachBtn.addEventListener('click', function() {
        const baseVoters = parseInt(voterBaseSlider.value);
        const penetration = parseFloat(whatsappPenetration.options[whatsappPenetration.selectedIndex].text);
        const frequency = messageFrequency.options[messageFrequency.selectedIndex].text;
        
        alert(`WhatsApp Reach Analysis Complete!\n\nVoter Base: ${baseVoters.toLocaleString('en-IN')}\nWhatsApp Penetration: ${penetration}\nMessage Frequency: ${frequency}\n\nEstimated Results:\n• Reachable Voters: ${reachableVoters.textContent}\n• Monthly Messages: ${monthlyMessages.textContent}\n• Read Rate: ${readRate.textContent}\n• Engagement: ${engagement.textContent}\n\nContact us to implement this WhatsApp outreach strategy!`);
    });

    // NEW FEATURE: Enhanced Blog Section
    const blogs = [
        {
            title: "WhatsApp Voter Outreach Strategy for Indian Political Campaigns",
            excerpt: "Complete guide to planning and executing effective WhatsApp outreach campaigns for political leaders at all levels.",
            category: "Strategy Guide",
            readLink: "../blog/whatsapp-voter-outreach-strategy.html",
            image: "https://images.unsplash.com/photo-1551135042-1035a519c37f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Political Communication on WhatsApp: Best Practices and Pitfalls",
            excerpt: "How to communicate effectively with voters on WhatsApp while avoiding common mistakes that damage political reputation.",
            category: "Best Practices",
            readLink: "../blog/political-communication-on-whatsapp.html",
            image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Common Mistakes in WhatsApp Political Campaigns and How to Avoid Them",
            excerpt: "Analysis of frequent WhatsApp campaign errors including spam, poor timing, and inappropriate content with solutions.",
            category: "Mistakes to Avoid",
            readLink: "../blog/whatsapp-campaign-mistakes.html",
            image: "https://images.unsplash.com/photo-1580136607996-cab1c2ef76dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "WhatsApp चुनाव प्रचार कैसे करें: हिंदी में पूरी मार्गदर्शिका",
            excerpt: "हिंदी में विस्तृत मार्गदर्शन: WhatsApp के माध्यम से प्रभावी चुनाव प्रचार की रणनीति और तकनीकें।",
            category: "हिंदी मार्गदर्शन",
            readLink: "../blog/whatsapp-election-campaign-hindi.html",
            image: "https://images.unsplash.com/photo-1590080876092-9667b2d6b668?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "WhatsApp vs Social Media for Political Outreach: Comparative Analysis",
            excerpt: "Detailed comparison of WhatsApp and social media platforms for voter outreach, engagement rates, and campaign effectiveness.",
            category: "Platform Comparison",
            readLink: "../blog/whatsapp-vs-social-media.html",
            image: "https://images.unsplash.com/photo-1551135042-1035a519c37f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Building Voter Trust Through WhatsApp: Case Studies from Indian Elections",
            excerpt: "Real examples of successful WhatsApp outreach campaigns in Indian elections and how they built voter trust.",
            category: "Case Studies",
            readLink: "../blog/whatsapp-trust-case-studies.html",
            image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
    ];

    // Initialize blog carousel
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

    // NEW FEATURE: FAQ Section for WhatsApp Outreach
    const faqs = [
        {
            question: "What is WhatsApp voter outreach?",
            answer: "WhatsApp voter outreach is a digital method where political leaders communicate directly with voters using WhatsApp messages, updates, and campaign information to build personal connections and trust as part of their overall communication strategy."
        },
        {
            question: "Is WhatsApp outreach legal in India?",
            answer: "Yes, WhatsApp outreach is completely legal in India when done properly. Messages should respect privacy, include opt-out options, avoid spam, and follow election commission guidelines during election periods. We ensure all communication is compliant with Indian regulations."
        },
        {
            question: "Can messages be sent in Hindi?",
            answer: "Yes, we create messages in both Hindi and English based on voter preferences. Regional language messages are more effective for connecting with local communities and we can create content in multiple Indian languages as needed for your constituency."
        },
        {
            question: "Is WhatsApp useful for local elections?",
            answer: "WhatsApp is especially effective for local elections where personal connection matters most. It allows direct communication with voters in specific wards or constituencies and helps build the personal rapport that wins local elections."
        },
        {
            question: "How often should messages be sent?",
            answer: "We recommend 1-2 messages per week during normal periods and 3-4 messages per week during campaigns. Quality matters more than quantity to avoid overwhelming voters. Messages should be timely, relevant, and respectful of voters' attention."
        },
        {
            question: "Who manages message content?",
            answer: "Our team creates and manages all message content after understanding your political messaging, brand identity, and voter communication goals. All content aligns with your overall <a href='political-branding.html' class='internal-link'>political branding strategy</a> for consistency."
        },
        {
            question: "Do voters need to opt-in for messages?",
            answer: "Yes, we follow best practices by only sending messages to voters who have explicitly opted-in to receive communication. This ensures compliance and maintains positive relationships with voters."
        },
        {
            question: "Can WhatsApp be used during election silence periods?",
            answer: "During official election silence periods (48 hours before voting), no political communication is allowed, including WhatsApp. We schedule messages accordingly and respect all Election Commission guidelines."
        },
        {
            question: "What types of messages work best?",
            answer: "Festival greetings, local issue updates, campaign event reminders, and public service announcements work best. Messages should be short, respectful, and provide value to voters rather than just asking for votes."
        },
        {
            question: "How do you measure WhatsApp campaign success?",
            answer: "We track message delivery rates, read receipts, response rates, and engagement metrics. We also monitor voter feedback and sentiment to continuously improve communication effectiveness."
        },
        {
            question: "Can WhatsApp integrate with other campaign activities?",
            answer: "Yes, WhatsApp outreach works best when integrated with other campaign activities like social media, events, and traditional campaigning. It should be part of a comprehensive <a href='political-branding.html' class='internal-link'>political communication strategy</a>."
        },
        {
            question: "What's the cost of WhatsApp outreach services?",
            answer: "Costs depend on voter base size, message frequency, and service level. Basic packages start at ₹25,000/month for up to 10,000 voters. Contact us for a customized quote based on your specific needs."
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

    // Typing text effect for hero
    const typingText = document.getElementById('typing-text');
    const texts = ['Direct Voter Messages', 'Campaign Updates', 'Festival Greetings', 'Issue Communication'];
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
            setTimeout(typeText, isDeleting ? 100 : 150);
        }
    }

    // Start typing effect
    typeText();

    // Download buttons
    document.getElementById('download-brochure').addEventListener('click', function(e) {
        e.preventDefault();
        alert('WhatsApp Outreach Guide download will start shortly. For now, please contact us for detailed information.');
    });

    document.getElementById('brochure-download').addEventListener('click', function(e) {
        e.preventDefault();
        alert('WhatsApp Kit download will start shortly. For now, please contact us for detailed information.');
    });

    // Scroll animations (reuse from existing)
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Process steps animation
    const processSteps = document.querySelectorAll('.process-step');
    const processObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    processSteps.forEach(step => {
        processObserver.observe(step);
    });

    // Popup Modal (reuse with WhatsApp focus)
    const politicalPopup = document.getElementById('politicalPopup');
    const popupClose = document.getElementById('popupClose');
    const popupLater = document.getElementById('popupLater');

    setTimeout(() => {
        politicalPopup.style.display = 'flex';
    }, 5000);

    popupClose.addEventListener('click', () => {
        politicalPopup.style.display = 'none';
        document.cookie = "whatsappPopupClosed=true; max-age=604800; path=/";
    });

    popupLater.addEventListener('click', () => {
        politicalPopup.style.display = 'none';
        setTimeout(() => {
            if (!document.cookie.includes('whatsappPopupClosed')) {
                politicalPopup.style.display = 'flex';
            }
        }, 86400000);
    });

    politicalPopup.addEventListener('click', (e) => {
        if (e.target === politicalPopup) {
            politicalPopup.style.display = 'none';
        }
    });

    if (document.cookie.includes('whatsappPopupClosed')) {
        politicalPopup.style.display = 'none';
    }

    // Enhanced chatbot for WhatsApp focus
    const chatbotBtn = document.getElementById('chatbot-btn');
    const chatbotOverlay = document.getElementById('chatbot-overlay');
    const chatbotClose = document.getElementById('chatbot-close');

    chatbotBtn.addEventListener('click', () => {
        chatbotOverlay.classList.add('active');
    });

    chatbotClose.addEventListener('click', () => {
        chatbotOverlay.classList.remove('active');
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            chatbotOverlay.classList.remove('active');
        }
    });

    // WhatsApp-specific chatbot functionality
    const quickOptions = document.querySelectorAll('.quick-option');
    quickOptions.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            // Implementation similar to existing chatbot
        });
    });
});
