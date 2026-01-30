
document.addEventListener('DOMContentLoaded', function() {
    // Services for campaign creative design
    const services = [
        {
            icon: 'fas fa-holly-berry',
            title: 'Political Campaign Creatives',
            description: 'Complete campaign visuals including posters, banners, and promotional materials designed for maximum impact.'
        },
        {
            icon: 'fab fa-facebook',
            title: 'Social Media Post & Banner Design',
            description: 'Platform-optimized creatives for Facebook, Instagram, WhatsApp, and Twitter with consistent branding.'
        },
        {
            icon: 'fas fa-calendar-alt',
            title: 'Festival & Jayanti Posters',
            description: 'Timely festival greetings and leader jayanti posters with your name and party logo included.'
        },
        {
            icon: 'fas fa-flag',
            title: 'Political Event & Rally Banners',
            description: 'Large format banners for public meetings, rallies, and constituency events.'
        },
        {
            icon: 'fas fa-id-card',
            title: 'Profile & Cover Image Design',
            description: 'Professional social media profile pictures and cover images that reflect your political identity.'
        },
        {
            icon: 'fas fa-calendar-check',
            title: 'Monthly Creative Support',
            description: 'Regular delivery of festival and occasion creatives to maintain consistent digital presence.'
        },
        {
            icon: 'fas fa-palette',
            title: 'Branding-Aligned Visuals',
            description: 'All creatives designed to align with your overall political branding and messaging strategy.'
        },
        {
            icon: 'fas fa-language',
            title: 'Hindi & Regional Language Versions',
            description: 'Creatives available in Hindi and regional languages to connect with diverse voter bases.'
        }
    ];

    // Creative showcase images
    const creativeShowcase = [
        {
            image: '../assets/creatives/festival-diwalipng.png',
            title: 'Diwali Festival Poster',
            description: 'Personalized Diwali greetings with leader name and party branding',
            type: 'Festival'
        },
        {
            image: '../assets/creatives/jayanti-banner.png',
            title: 'Leader Jayanti Banner',
            description: 'Respectful jayanti poster for national/local leader anniversaries',
            type: 'Jayanti'
        },
        {
            image: '../assets/creatives/campaign-banner.png',
            title: 'Election Campaign Banner',
            description: 'Large format campaign banner for rallies and public meetings',
            type: 'Campaign'
        },
        {
            image: '../assets/creatives/social-media-creative.png',
            title: 'Social Media Creative',
            description: 'Platform-optimized design for Facebook/Instagram engagement',
            type: 'Digital'
        },
        {
            image: '../assets/creatives/holi-poster.png',
            title: 'Holi Festival Poster',
            description: 'Colorful Holi greetings with personalized political messaging',
            type: 'Festival'
        },
        {
            image: '../assets/creatives/republic-day.png',
            title: 'Republic Day Special',
            description: 'Patriotic design for national occasions and celebrations',
            type: 'National'
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

    // NEW FEATURE: Creative Showcase Carousel
    const creativeTrack = document.getElementById('creative-track');
    const creativeNav = document.getElementById('creative-nav');
    let currentCreativeSlide = 0;

    // Create creative slides
    creativeShowcase.forEach((creative, index) => {
        const slide = document.createElement('div');
        slide.className = 'creative-slide';
        slide.innerHTML = `
            <div class="creative-card">
                <div class="creative-image">
                    <img src="${creative.image}" alt="${creative.title}" loading="lazy">
                    <div class="creative-badge">${creative.type}</div>
                </div>
                <div class="creative-content">
                    <h3>${creative.title}</h3>
                    <p>${creative.description}</p>
                </div>
            </div>
        `;
        creativeTrack.appendChild(slide);

        // Create navigation dots
        const dot = document.createElement('div');
        dot.className = 'carousel-dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            goToCreativeSlide(index);
        });
        creativeNav.appendChild(dot);
    });

    // Creative carousel functions
    function goToCreativeSlide(index) {
        currentCreativeSlide = index;
        creativeTrack.style.transform = `translateX(-${currentCreativeSlide * 100}%)`;
        
        document.querySelectorAll('#creative-nav .carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentCreativeSlide);
        });
    }

    function nextCreativeSlide() {
        currentCreativeSlide = (currentCreativeSlide + 1) % creativeShowcase.length;
        goToCreativeSlide(currentCreativeSlide);
    }

    function prevCreativeSlide() {
        currentCreativeSlide = (currentCreativeSlide - 1 + creativeShowcase.length) % creativeShowcase.length;
        goToCreativeSlide(currentCreativeSlide);
    }

    // Creative carousel event listeners
    document.querySelector('.creative-prev').addEventListener('click', () => {
        prevCreativeSlide();
    });
    
    document.querySelector('.creative-next').addEventListener('click', () => {
        nextCreativeSlide();
    });

    // Auto-advance creative carousel
    let creativeCarouselInterval = setInterval(nextCreativeSlide, 6000);

    // NEW FEATURE: Design Consistency Score Calculator
    const calculateScoreBtn = document.getElementById('calculate-score');
    const resetScoreBtn = document.getElementById('reset-score');
    const scoreValue = document.getElementById('score-value');
    const scoreMessage = document.getElementById('score-message');

    calculateScoreBtn.addEventListener('click', function() {
        let totalScore = 0;
        
        // Calculate scores from each question
        const q1 = document.querySelector('input[name="q1"]:checked');
        const q2 = document.querySelector('input[name="q2"]:checked');
        const q3 = document.querySelector('input[name="q3"]:checked');
        
        if (q1) totalScore += parseInt(q1.value);
        if (q2) totalScore += parseInt(q2.value);
        if (q3) totalScore += parseInt(q3.value);
        
        // Update score display
        scoreValue.textContent = `${totalScore}/6`;
        
        // Update message based on score
        if (totalScore >= 5) {
            scoreMessage.textContent = "Excellent! Your design consistency is strong.";
            scoreMessage.style.color = "#16a34a";
        } else if (totalScore >= 3) {
            scoreMessage.textContent = "Good, but there's room for improvement.";
            scoreMessage.style.color = "#f59e0b";
        } else {
            scoreMessage.textContent = "Start improving your visual consistency.";
            scoreMessage.style.color = "#dc2626";
        }
        
        // Show animation
        scoreValue.style.transform = 'scale(1.1)';
        setTimeout(() => {
            scoreValue.style.transform = 'scale(1)';
        }, 300);
    });

    resetScoreBtn.addEventListener('click', function() {
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.checked = false;
        });
        scoreValue.textContent = "0/6";
        scoreMessage.textContent = "Start improving your visual consistency";
        scoreMessage.style.color = "";
    });

    // NEW FEATURE: Enhanced Blog Section
    const blogs = [
        {
            title: "Political Creative Design Best Practices for Indian Leaders",
            excerpt: "Guide to creating effective political creatives that balance tradition, modernity, and voter psychology in the Indian context.",
            category: "Design Guide",
            readLink: "../blog/political-creative-design-best-practices.html",
            image: "https://images.unsplash.com/photo-1551135042-1035a519c37f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Festival Creatives for Politicians: Connecting with Voters Through Culture",
            excerpt: "How to design festival posters that respect traditions while strengthening political connection and brand visibility.",
            category: "Festival Strategy",
            readLink: "../blog/festival-creatives-for-politicians.html",
            image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Banner Design for Political Campaigns: Size, Color, and Message Optimization",
            excerpt: "Complete guide to creating effective political banners for rallies, meetings, and constituency visibility.",
            category: "Banner Design",
            readLink: "../blog/banner-design-political-campaigns.html",
            image: "https://images.unsplash.com/photo-1580136607996-cab1c2ef76dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "राजनीतिक डिज़ाइन और ब्रांडिंग: हिंदी में पूरी मार्गदर्शिका",
            excerpt: "हिंदी में विस्तृत मार्गदर्शन: राजनीतिक क्रिएटिव्स कैसे बनाएं जो मतदाताओं से जुड़ें और आपकी पहचान मजबूत करें।",
            category: "हिंदी मार्गदर्शन",
            readLink: "../blog/hindi-political-design-guide.html",
            image: "https://images.unsplash.com/photo-1590080876092-9667b2d6b668?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Visual Identity in Politics: Building Recognition Through Consistent Design",
            excerpt: "How consistent visual design builds political recognition and why it matters more than individual creative brilliance.",
            category: "Visual Identity",
            readLink: "../blog/visual-identity-politics.html",
            image: "https://images.unsplash.com/photo-1551135042-1035a519c37f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Monthly Creative Packages: Maintaining Digital Presence Between Elections",
            excerpt: "Why regular creative delivery matters for political leaders and how monthly packages maintain voter connection.",
            category: "Strategy",
            readLink: "../blog/monthly-creative-packages.html",
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

    // NEW FEATURE: FAQ Section for Creative Design
    const faqs = [
        {
            question: "What is campaign creative & design?",
            answer: "Campaign creative & design focuses on creating visual content such as banners, posters, and social media creatives that communicate political messages clearly and consistently as part of a comprehensive <a href='political-branding.html' class='internal-link'>political branding strategy</a>."
        },
        {
            question: "Do you provide daily festival creatives?",
            answer: "Yes, our monthly creative package includes daily festival posters for all major Indian festivals. We deliver timely, platform-optimized designs with your name and party logo for consistent social media presence and voter connection."
        },
        {
            question: "Can my name and party logo be added?",
            answer: "Absolutely. Every creative we design includes your name and party logo prominently positioned. This ensures brand consistency and helps voters recognize your content instantly across all platforms, strengthening your overall political identity."
        },
        {
            question: "Are creatives provided monthly?",
            answer: "Yes, we offer monthly creative packages that include festival posters, jayanti creatives, and special occasion designs delivered on a regular schedule. This maintains consistent digital presence between elections and during non-campaign periods."
        },
        {
            question: "Is this included in election campaigns?",
            answer: "Campaign creatives are a crucial part of election campaigns and are included in our comprehensive election packages. They work best when integrated with overall political branding and campaign strategy for maximum impact."
        },
        {
            question: "Do you follow party branding guidelines?",
            answer: "Yes, we strictly follow party branding guidelines including official colors, logos, typography, and messaging style. Our designs align with both party identity and your personal political branding for maximum consistency and recognition."
        },
        {
            question: "What formats do you deliver designs in?",
            answer: "We deliver designs in all required formats: JPG/PNG for digital use, PDF for printing, and source files (AI/PSD) for future modifications. All designs are optimized for specific platforms like Facebook, Instagram, WhatsApp, and print media."
        },
        {
            question: "How many revisions are included?",
            answer: "We include 3 rounds of revisions for all designs to ensure they perfectly match your requirements. Our goal is to deliver creatives that you're completely satisfied with and that align with your political communication objectives."
        },
        {
            question: "Do you design for regional languages?",
            answer: "Yes, we create designs in Hindi, English, and regional languages as needed. We work with native speakers to ensure accurate translations and cultural appropriateness for different constituencies and voter groups."
        },
        {
            question: "What's the turnaround time for designs?",
            answer: "Standard designs are delivered within 24-48 hours. For urgent festival creatives or campaign materials, we offer expedited delivery. Monthly packages follow a predetermined schedule for regular creative flow."
        },
        {
            question: "Can I use these designs for print media?",
            answer: "Yes, we provide print-ready versions of all designs with proper bleed, resolution, and color profiles. Our designs work equally well for digital platforms and physical banners, posters, and promotional materials."
        },
        {
            question: "Is there a minimum commitment period?",
            answer: "Monthly creative packages require a 3-month minimum commitment for consistency. Individual project-based designs have no minimum commitment. Both options include all revisions and format deliveries."
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
    const texts = ['Festival Posters', 'Campaign Banners', 'Social Creatives', 'Jayanti Designs'];
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
        alert('Creative Portfolio download will start shortly. For now, please contact us for detailed samples.');
    });

    document.getElementById('brochure-download').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Creative Kit download will start shortly. For now, please contact us for detailed information.');
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

    // Popup Modal (reuse with creative focus)
    const politicalPopup = document.getElementById('politicalPopup');
    const popupClose = document.getElementById('popupClose');
    const popupLater = document.getElementById('popupLater');

    setTimeout(() => {
        politicalPopup.style.display = 'flex';
    }, 5000);

    popupClose.addEventListener('click', () => {
        politicalPopup.style.display = 'none';
        document.cookie = "creativeDesignPopupClosed=true; max-age=604800; path=/";
    });

    popupLater.addEventListener('click', () => {
        politicalPopup.style.display = 'none';
        setTimeout(() => {
            if (!document.cookie.includes('creativeDesignPopupClosed')) {
                politicalPopup.style.display = 'flex';
            }
        }, 86400000);
    });

    politicalPopup.addEventListener('click', (e) => {
        if (e.target === politicalPopup) {
            politicalPopup.style.display = 'none';
        }
    });

    if (document.cookie.includes('creativeDesignPopupClosed')) {
        politicalPopup.style.display = 'none';
    }

    // Enhanced chatbot for creative focus
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

    // Creative-specific chatbot functionality
    const quickOptions = document.querySelectorAll('.quick-option');
    quickOptions.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            // Implementation similar to existing chatbot
        });
    });
});
