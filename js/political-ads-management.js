
document.addEventListener('DOMContentLoaded', function() {
    // Services for ads management
    const services = [
        {
            icon: 'fab fa-facebook',
            title: 'Meta (Facebook & Instagram) Ads Setup',
            description: 'Complete campaign setup, audience targeting, creative development, and optimization for Meta platforms.'
        },
        {
            icon: 'fab fa-google',
            title: 'Google Search & Display Ads',
            description: 'Keyword-based political advertising on Google Search, YouTube, and Display Network.'
        },
        {
            icon: 'fas fa-chess',
            title: 'Political Campaign Ad Strategy',
            description: 'Comprehensive advertising strategy aligned with your overall political branding objectives.'
        },
        {
            icon: 'fas fa-crosshairs',
            title: 'Audience Targeting & Retargeting',
            description: 'Precise voter segmentation and remarketing campaigns for maximum message recall.'
        },
        {
            icon: 'fas fa-palette',
            title: 'Ad Creative Direction',
            description: 'Design and copywriting for ads that align with your political branding and messaging.'
        },
        {
            icon: 'fas fa-chart-line',
            title: 'Budget Optimization & Performance Tracking',
            description: 'Daily monitoring, budget reallocation, and performance optimization across platforms.'
        },
        {
            icon: 'fas fa-file-alt',
            title: 'Campaign Reports & Insights',
            description: 'Detailed analytics, compliance reports, and actionable insights for future campaigns.'
        },
        {
            icon: 'fas fa-shield-alt',
            title: 'Compliance & Policy Management',
            description: 'Ensuring all ads meet Election Commission and platform policy requirements.'
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

    // NEW FEATURE: Dashboard Tabs
    const dashboardTabs = document.querySelectorAll('.dashboard-tab');
    const dashboardContents = document.querySelectorAll('.dashboard-content');

    dashboardTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            // Update active tab
            dashboardTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding content
            dashboardContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });

    // NEW FEATURE: Campaign Impact Calculator
    const budgetSlider = document.getElementById('budget');
    const budgetValue = document.getElementById('budget-value');
    const platformSelect = document.getElementById('platform');
    const constituencySelect = document.getElementById('constituency');
    const calculateBtn = document.getElementById('calculate-btn');
    
    // Result elements
    const estimatedReach = document.getElementById('estimated-reach');
    const estimatedClicks = document.getElementById('estimated-clicks');
    const estimatedCPC = document.getElementById('estimated-cpc');
    const estimatedEngagement = document.getElementById('estimated-engagement');

    // Update budget display
    budgetSlider.addEventListener('input', function() {
        const value = parseInt(this.value);
        budgetValue.textContent = value.toLocaleString('en-IN');
        calculateMetrics();
    });

    // Recalculate when platform or constituency changes
    platformSelect.addEventListener('change', calculateMetrics);
    constituencySelect.addEventListener('change', calculateMetrics);

    // Calculate metrics function
    function calculateMetrics() {
        const budget = parseInt(budgetSlider.value);
        const platform = platformSelect.value;
        const constituency = constituencySelect.value;
        
        // Base metrics based on platform
        let reachMultiplier, clickMultiplier, cpcMultiplier, engagementMultiplier;
        
        switch(platform) {
            case 'meta':
                reachMultiplier = 1.68;
                clickMultiplier = 0.084;
                cpcMultiplier = 0.42;
                engagementMultiplier = 1.0;
                break;
            case 'google':
                reachMultiplier = 0.56;
                clickMultiplier = 0.037;
                cpcMultiplier = 0.96;
                engagementMultiplier = 0.6;
                break;
            case 'both':
                reachMultiplier = 1.12;
                clickMultiplier = 0.061;
                cpcMultiplier = 0.69;
                engagementMultiplier = 0.8;
                break;
        }
        
        // Adjust for constituency type
        switch(constituency) {
            case 'urban':
                reachMultiplier *= 1.2;
                clickMultiplier *= 1.3;
                cpcMultiplier *= 0.9;
                engagementMultiplier *= 0.9;
                break;
            case 'semi-urban':
                reachMultiplier *= 1.0;
                clickMultiplier *= 1.0;
                cpcMultiplier *= 1.0;
                engagementMultiplier *= 1.0;
                break;
            case 'rural':
                reachMultiplier *= 0.8;
                clickMultiplier *= 0.7;
                cpcMultiplier *= 1.1;
                engagementMultiplier *= 1.1;
                break;
        }
        
        // Calculate final metrics
        const reach = Math.round(budget * reachMultiplier);
        const clicks = Math.round(budget * clickMultiplier);
        const cpc = (budget * cpcMultiplier / clicks).toFixed(2);
        const engagement = (3.8 * engagementMultiplier).toFixed(1);
        
        // Update display
        estimatedReach.textContent = reach.toLocaleString('en-IN');
        estimatedClicks.textContent = clicks.toLocaleString('en-IN');
        estimatedCPC.textContent = `₹${cpc}`;
        estimatedEngagement.textContent = `${engagement}%`;
    }

    // Initialize calculator
    calculateMetrics();

    // NEW FEATURE: Enhanced Blog Section
    const blogs = [
        {
            title: "How Political Ads Influence Voter Decisions in Indian Elections",
            excerpt: "Research-backed analysis of how digital political advertising affects voter perception, recall, and decision-making in Indian electoral contexts.",
            category: "Voter Psychology",
            readLink: "../blog/how-political-ads-influence-voters.html",
            image: "https://images.unsplash.com/photo-1580136607996-cab1c2ef76dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Meta Ads vs Google Ads for Political Campaigns: Which Performs Better?",
            excerpt: "Comparative analysis of platform performance, targeting capabilities, and cost efficiency for political advertising in India.",
            category: "Platform Strategy",
            readLink: "../blog/meta-vs-google-political-ads.html",
            image: "https://images.unsplash.com/photo-1551135042-1035a519c37f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Common Mistakes in Political Advertising and How to Avoid Them",
            excerpt: "Analysis of frequent errors in political ad campaigns, from poor targeting to compliance issues, with actionable solutions.",
            category: "Best Practices",
            readLink: "../blog/political-advertising-mistakes.html",
            image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "डिजिटल राजनीतिक विज्ञापन की रणनीति: हिंदी में मार्गदर्शन",
            excerpt: "हिंदी में विस्तृत मार्गदर्शन: राजनीतिक विज्ञापनों की रणनीति, लक्ष्यीकरण, और प्रभावी संदेश वितरण के तरीके।",
            category: "हिंदी मार्गदर्शन",
            readLink: "../blog/hindi-political-ad-strategy.html",
            image: "https://images.unsplash.com/photo-1590080876092-9667b2d6b668?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Political Ad Compliance in India: Complete ECI Guidelines 2026",
            excerpt: "Updated guide to Election Commission advertising rules, spending limits, disclaimers, and platform-specific requirements.",
            category: "Legal & Compliance",
            readLink: "../blog/political-ad-compliance-2026.html",
            image: "https://images.unsplash.com/photo-1580136607996-cab1c2ef76dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Measuring ROI in Political Advertising: Metrics That Matter",
            excerpt: "Guide to tracking meaningful metrics beyond impressions and clicks to measure true political campaign impact.",
            category: "Analytics",
            readLink: "../blog/political-ad-roi-metrics.html",
            image: "https://images.unsplash.com/photo-1551135042-1035a519c37f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
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

    // NEW FEATURE: FAQ Section for Ads
    const faqs = [
        {
            question: "What is political ads management?",
            answer: "Political ads management involves planning, executing, and optimizing paid political advertisements on platforms like Meta and Google to increase reach, visibility, and message recall among targeted voters as part of a comprehensive political branding strategy."
        },
        {
            question: "Are political ads allowed in India?",
            answer: "Yes, political ads are allowed in India with proper compliance. All advertisements must include 'Paid for by' disclaimers, adhere to Election Commission spending limits, follow platform policies, and respect the 48-hour silence period before voting."
        },
        {
            question: "Do ads work without political branding?",
            answer: "Ads work best when integrated with a strong <a href='political-branding.html' class='internal-link'>political branding strategy</a>. Without cohesive branding, ads may deliver inconsistent messaging. We recommend combining ads execution with comprehensive political branding for maximum impact."
        },
        {
            question: "Which platform is better – Meta or Google?",
            answer: "Meta (Facebook/Instagram) is better for emotional connection and brand building, while Google Ads excels at intent-based targeting. Most successful campaigns use both platforms strategically based on campaign objectives within their overall <a href='political-branding.html' class='internal-link'>political branding</a> framework."
        },
        {
            question: "Is this service election-only?",
            answer: "No, political ads management is valuable year-round for maintaining visibility, promoting issues, and building supporter bases between elections. Consistent advertising supports long-term political branding and influence."
        },
        {
            question: "Who manages ad strategy and compliance?",
            answer: "Our certified Meta and Google Ads specialists handle everything: strategy development, campaign setup, audience targeting, creative alignment, budget optimization, compliance monitoring, and performance reporting as part of your integrated political communication approach."
        },
        {
            question: "What's the minimum budget for effective political ads?",
            answer: "Effective political advertising starts at ₹50,000 per month for focused campaigns. MLA campaigns typically require ₹2-5 lakhs, while MP campaigns benefit from ₹5-20 lakhs monthly budgets during peak election periods."
        },
        {
            question: "How quickly can we launch political ads?",
            answer: "We can launch initial campaigns within 48 hours after receiving creative assets and approvals. Full strategic campaigns with compliance setup typically take 5-7 days for comprehensive implementation."
        },
        {
            question: "Do you handle Election Commission compliance?",
            answer: "Yes, we manage all compliance requirements including ad authorization, 'Paid for by' disclaimers, spending limit tracking, silence period adherence, and transparency reporting as per Election Commission guidelines."
        },
        {
            question: "Can we target specific voter demographics?",
            answer: "Absolutely. We can target by location (constituency/ward level), age, gender, interests, language, device type, and even create lookalike audiences based on your existing supporter base."
        },
        {
            question: "How do you measure ad campaign success?",
            answer: "We track multiple metrics: reach, impressions, clicks, engagement rate, cost per result, conversion rate, and sentiment analysis. We also correlate ad performance with overall <a href='political-branding.html' class='internal-link'>political branding</a> objectives."
        },
        {
            question: "Do you provide campaign performance reports?",
            answer: "Yes, we provide daily performance dashboards, weekly optimization reports, and comprehensive monthly analysis with actionable insights for campaign improvement and future strategy."
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
    const texts = ['Meta & Google Ads', 'Targeted Voter Reach', 'Compliant Campaigns', 'Measurable Results'];
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
        alert('Political Ads Strategy download will start shortly. For now, please contact us for detailed information.');
    });

    document.getElementById('brochure-download').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Political Ads Playbook download will start shortly. For now, please contact us for detailed information.');
    });

    // Add mobile-friendly labels for comparison table
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.comparison-row').forEach(row => {
            const cells = row.querySelectorAll('.comparison-platform');
            cells[0].setAttribute('data-label', 'Meta Ads');
            cells[1].setAttribute('data-label', 'Google Ads');
            cells[2].setAttribute('data-label', 'Recommendation');
        });
    }

    // Initialize calculator button
    calculateBtn.addEventListener('click', function() {
        const budget = parseInt(budgetSlider.value);
        const platform = platformSelect.options[platformSelect.selectedIndex].text;
        const constituency = constituencySelect.options[constituencySelect.selectedIndex].text;
        
        alert(`Campaign Analysis Complete!\n\nBudget: ₹${budget.toLocaleString('en-IN')}\nPlatform: ${platform}\nConstituency: ${constituency}\n\nEstimated Results:\n• Reach: ${estimatedReach.textContent} voters\n• Clicks: ${estimatedClicks.textContent}\n• Avg. CPC: ${estimatedCPC.textContent}\n• Engagement: ${estimatedEngagement.textContent}\n\nContact us to implement this strategy!`);
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

    // Popup Modal (reuse with ads focus)
    const politicalPopup = document.getElementById('politicalPopup');
    const popupClose = document.getElementById('popupClose');
    const popupLater = document.getElementById('popupLater');

    setTimeout(() => {
        politicalPopup.style.display = 'flex';
    }, 5000);

    popupClose.addEventListener('click', () => {
        politicalPopup.style.display = 'none';
        document.cookie = "politicalAdsPopupClosed=true; max-age=604800; path=/";
    });

    popupLater.addEventListener('click', () => {
        politicalPopup.style.display = 'none';
        setTimeout(() => {
            if (!document.cookie.includes('politicalAdsPopupClosed')) {
                politicalPopup.style.display = 'flex';
            }
        }, 86400000);
    });

    politicalPopup.addEventListener('click', (e) => {
        if (e.target === politicalPopup) {
            politicalPopup.style.display = 'none';
        }
    });

    if (document.cookie.includes('politicalAdsPopupClosed')) {
        politicalPopup.style.display = 'none';
    }

    // Enhanced chatbot for ads focus
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

    // Ads-specific chatbot functionality
    const quickOptions = document.querySelectorAll('.quick-option');
    quickOptions.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            // Implementation similar to existing chatbot
        });
    });
});
