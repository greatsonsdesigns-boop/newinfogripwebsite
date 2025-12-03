// ============================================
// FIXED SERVICE CAROUSELS - ALL 4 PAGES WORKING
// ============================================

const ServiceCarousels = {
    
    // ============================================
    // 1. WEBSITE DEVELOPMENT CAROUSELS
    // ============================================
    initializeWebsiteCarousels: function() {
        console.log('Initializing Website Carousels...');
        
        const features = [
            {
                icon: 'fas fa-palette',
                title: 'Custom UI/UX Design',
                description: 'Beautiful, user-friendly interfaces designed to engage visitors and drive conversions.'
            },
            {
                icon: 'fas fa-mobile-alt',
                title: 'Mobile Responsive Layouts',
                description: 'Seamless experience across all devices - desktop, tablet, and mobile.'
            },
            {
                icon: 'fas fa-search',
                title: 'SEO Optimization',
                description: 'Built with SEO best practices to rank higher on search engines.'
            },
            {
                icon: 'fas fa-bolt',
                title: 'Fast Loading Speeds',
                description: 'Optimized for performance with fast loading times and smooth interactions.'
            },
            {
                icon: 'fas fa-shield-alt',
                title: 'Secure Hosting Setup',
                description: 'Secure hosting environment with SSL certificates and regular backups.'
            },
            {
                icon: 'fas fa-cogs',
                title: 'CMS Integration',
                description: 'Easy-to-use content management system for updating your website.'
            },
            {
                icon: 'fas fa-tools',
                title: 'Website Maintenance Plans',
                description: 'Ongoing support and maintenance to keep your website running smoothly.'
            },
            {
                icon: 'fas fa-shopping-cart',
                title: 'E-Commerce Development',
                description: 'Full-featured online stores with payment integration and inventory management.'
            }
        ];

        const advancedFeatures = [
            {
                icon: 'fas fa-laptop-code',
                title: 'Custom Web Applications',
                description: 'Interactive web applications with advanced functionality and user management.'
            },
            {
                icon: 'fas fa-chart-line',
                title: 'Admin Dashboards',
                description: 'Comprehensive dashboards for data visualization and business analytics.'
            },
            {
                icon: 'fas fa-plug',
                title: 'API Integrations',
                description: 'Seamless integration with third-party services and payment gateways.'
            },
            {
                icon: 'fas fa-mobile',
                title: 'Progressive Web Apps',
                description: 'App-like experiences in browsers with offline capabilities.'
            },
            {
                icon: 'fas fa-building',
                title: 'Corporate Website Redesigns',
                description: 'Modernize your corporate website with contemporary design and functionality.'
            },
            {
                icon: 'fas fa-database',
                title: 'Database Integration',
                description: 'Custom database solutions for managing complex data and user information.'
            }
        ];

        // Initialize both carousels
        this.createCarousel('features-carousel', 'features-nav', features);
        this.createCarousel('advanced-slider', 'advanced-nav', advancedFeatures);
        
        console.log('Website Carousels initialized successfully');
    },

    // ============================================
    // 2. SOCIAL MEDIA MANAGEMENT CAROUSELS
    // ============================================
    initializeSocialMediaCarousels: function() {
        console.log('Initializing Social Media Carousels...');
        
        const features = [
            {
                icon: 'fas fa-pen-fancy',
                title: 'Daily Content Creation',
                description: 'Consistent, high-quality content tailored to your brand voice and audience.'
            },
            {
                icon: 'fas fa-comments',
                title: 'Community Engagement',
                description: 'Active interaction with your audience to build relationships and loyalty.'
            },
            {
                icon: 'fas fa-hashtag',
                title: 'Hashtag Strategy',
                description: 'Strategic hashtag research and implementation to maximize reach.'
            },
            {
                icon: 'fas fa-film',
                title: 'Viral Reel Editing',
                description: 'Professional video editing optimized for maximum engagement and virality.'
            },
            {
                icon: 'fas fa-user-check',
                title: 'Profile Optimization',
                description: 'Complete profile makeover to maximize conversions and brand consistency.'
            },
            {
                icon: 'fas fa-chart-bar',
                title: 'Monthly Growth Reports',
                description: 'Detailed analytics and insights to track performance and growth.'
            },
            {
                icon: 'fas fa-camera',
                title: 'Story Design & Posting',
                description: 'Daily story content to keep your audience engaged and connected.'
            },
            {
                icon: 'fas fa-keyboard',
                title: 'Caption & Copywriting',
                description: 'Compelling copy that drives engagement and tells your brand story.'
            }
        ];

        const platforms = [
            {
                icon: 'fab fa-instagram',
                title: 'Instagram Management',
                description: 'Complete Instagram profile management, reels, stories, and grid optimization.'
            },
            {
                icon: 'fab fa-facebook',
                title: 'Facebook Management',
                description: 'Facebook page management, community building, and content strategy.'
            },
            {
                icon: 'fab fa-linkedin',
                title: 'LinkedIn Management',
                description: 'Professional LinkedIn presence for B2B marketing and networking.'
            },
            {
                icon: 'fab fa-twitter',
                title: 'Twitter Management',
                description: 'Twitter profile management, trending hashtags, and engagement.'
            },
            {
                icon: 'fab fa-youtube',
                title: 'YouTube Management',
                description: 'YouTube channel optimization, video strategy, and community management.'
            },
            {
                icon: 'fab fa-pinterest',
                title: 'Pinterest Management',
                description: 'Pinterest strategy for visual discovery and traffic generation.'
            }
        ];

        this.createCarousel('features-carousel', 'features-nav', features);
        this.createCarousel('platforms-carousel', 'platforms-nav', platforms);
        
        console.log('Social Media Carousels initialized successfully');
    },

    // ============================================
    // 3. POLITICAL BRANDING CAROUSELS
    // ============================================
    initializePoliticalCarousels: function() {
        console.log('Initializing Political Carousels...');
        
        const features = [
            {
                icon: 'fas fa-bullhorn',
                title: 'Strategic Messaging',
                description: 'Develop powerful messaging that resonates with voters and establishes political credibility.'
            },
            {
                icon: 'fas fa-users',
                title: 'Audience Research',
                description: 'In-depth voter analysis, demographic research, and sentiment tracking.'
            },
            {
                icon: 'fas fa-globe',
                title: 'Digital Presence',
                description: 'Complete digital ecosystem including website, social media, and online reputation.'
            },
            {
                icon: 'fas fa-newspaper',
                title: 'Media Relations',
                description: 'Press releases, media outreach, interview preparation, and crisis communication.'
            },
            {
                icon: 'fas fa-chart-pie',
                title: 'Campaign Analytics',
                description: 'Real-time tracking of voter sentiment, campaign performance, and public perception.'
            },
            {
                icon: 'fas fa-handshake',
                title: 'Community Engagement',
                description: 'Town halls, public meetings, voter outreach programs, and grassroots organizing.'
            },
            {
                icon: 'fas fa-video',
                title: 'Content Production',
                description: 'Speech writing, video content, campaign materials, and digital content creation.'
            },
            {
                icon: 'fas fa-shield-alt',
                title: 'Crisis Management',
                description: 'Rapid response strategies, reputation management, and damage control.'
            }
        ];

        const audience = [
            {
                icon: 'fas fa-user-tie',
                title: 'Political Candidates',
                description: 'Local, state, and national candidates seeking election or re-election.'
            },
            {
                icon: 'fas fa-landmark',
                title: 'Political Parties',
                description: 'Party branding, manifesto communication, and member engagement.'
            },
            {
                icon: 'fas fa-graduation-cap',
                title: 'Public Figures',
                description: 'CEOs, activists, thought leaders, and influential personalities.'
            },
            {
                icon: 'fas fa-briefcase',
                title: 'Government Officials',
                description: 'Serving officials needing ongoing public relations and communication.'
            },
            {
                icon: 'fas fa-hands-helping',
                title: 'Non-Profit Leaders',
                description: 'Advocacy groups, NGOs, and social impact organizations.'
            },
            {
                icon: 'fas fa-microphone',
                title: 'Media Personalities',
                description: 'Journalists, anchors, and commentators building personal brands.'
            }
        ];

        this.createCarousel('features-carousel', 'features-nav', features);
        this.createCarousel('audience-carousel', 'audience-nav', audience);
        
        console.log('Political Carousels initialized successfully');
    },

    // ============================================
    // 4. ADS CAMPAIGN MANAGEMENT CAROUSELS
    // ============================================
    initializeAdsCarousels: function() {
        console.log('Initializing Ads Carousels...');
        
        const features = [
            {
                icon: 'fas fa-bullseye',
                title: 'Audience Targeting',
                description: 'Precise demographic, interest, and behavioral targeting for maximum relevance.'
            },
            {
                icon: 'fas fa-paint-brush',
                title: 'Ad Creative Design',
                description: 'High-converting visuals, compelling copy, and attention-grabbing designs.'
            },
            {
                icon: 'fas fa-chart-line',
                title: 'Performance Analytics',
                description: 'Real-time tracking, conversion attribution, and ROI measurement.'
            },
            {
                icon: 'fas fa-cogs',
                title: 'Campaign Optimization',
                description: 'Continuous A/B testing, bid adjustments, and audience refinement.'
            },
            {
                icon: 'fas fa-sitemap',
                title: 'Funnel Strategy',
                description: 'Complete customer journey mapping from awareness to conversion.'
            },
            {
                icon: 'fas fa-money-bill-wave',
                title: 'Budget Management',
                description: 'Efficient budget allocation, spend optimization, and cost control.'
            },
            {
                icon: 'fas fa-retweet',
                title: 'Retargeting',
                description: 'Win back lost customers and maximize conversion rates.'
            },
            {
                icon: 'fas fa-file-alt',
                title: 'Detailed Reporting',
                description: 'Comprehensive performance reports with actionable insights.'
            }
        ];

        const platforms = [
            {
                icon: 'fab fa-google',
                title: 'Google Ads',
                description: 'Search, Display, Shopping, and YouTube advertising for maximum reach.'
            },
            {
                icon: 'fab fa-facebook',
                title: 'Meta Platforms',
                description: 'Facebook, Instagram, and WhatsApp advertising with precise targeting.'
            },
            {
                icon: 'fab fa-linkedin',
                title: 'LinkedIn Ads',
                description: 'B2B targeting, professional networking, and corporate branding.'
            },
            {
                icon: 'fab fa-twitter',
                title: 'Twitter Ads',
                description: 'Real-time engagement, trending topics, and conversation marketing.'
            },
            {
                icon: 'fab fa-pinterest',
                title: 'Pinterest Ads',
                description: 'Visual discovery, product promotion, and inspiration-driven marketing.'
            },
            {
                icon: 'fas fa-shopping-cart',
                title: 'E-commerce Platforms',
                description: 'Amazon, Flipkart, and other marketplace advertising solutions.'
            }
        ];

        this.createCarousel('features-carousel', 'features-nav', features);
        this.createCarousel('platforms-carousel', 'platforms-nav', platforms);
        
        // Add performance metrics
        this.addPerformanceMetrics();
        
        console.log('Ads Carousels initialized successfully');
    },

    // ============================================
    // UNIVERSAL CAROUSEL CREATION FUNCTION
    // ============================================
    createCarousel: function(carouselId, navId, items) {
        const carousel = document.getElementById(carouselId);
        const nav = document.getElementById(navId);
        
        if (!carousel || !nav) {
            console.error(`Carousel ${carouselId} or nav ${navId} not found`);
            return;
        }

        // Clear existing content
        carousel.innerHTML = '';
        nav.innerHTML = '';

        let currentSlide = 0;
        let autoSlideInterval;

        // Create carousel items
        items.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'carousel-card';
            card.innerHTML = `
                <div class="carousel-icon">
                    <i class="${item.icon}"></i>
                </div>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            `;
            carousel.appendChild(card);

            // Create navigation dots
            const dot = document.createElement('div');
            dot.className = 'carousel-dot';
            dot.addEventListener('click', () => {
                this.goToSlide(carouselId, index);
                this.resetAutoSlide();
            });
            nav.appendChild(dot);
        });

        // Initialize first slide
        this.goToSlide(carouselId, 0);
        
        // Set up auto slide
        this.startAutoSlide(carouselId);

        // Add event listeners for arrow buttons
        const container = carousel.closest('.service-carousel-container');
        if (container) {
            const prevBtn = container.querySelector('.carousel-arrow.prev');
            const nextBtn = container.querySelector('.carousel-arrow.next');
            
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    this.prevSlide(carouselId, items.length);
                    this.resetAutoSlide();
                });
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    this.nextSlide(carouselId, items.length);
                    this.resetAutoSlide();
                });
            }
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            this.goToSlide(carouselId, currentSlide);
        });
    },

    goToSlide: function(carouselId, index) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;
        
        const items = carousel.children;
        const navContainer = carousel.nextElementSibling;
        
        if (!items.length || !navContainer) return;
        
        // Calculate items per view
        const itemsPerView = this.getItemsPerView();
        
        // Update current slide
        window.currentSlide = index;
        
        // Calculate translateX
        const translateX = -(index * (100 / itemsPerView));
        carousel.style.transform = `translateX(${translateX}%)`;
        
        // Update active dots
        const dots = navContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        // Update card active states
        Array.from(items).forEach((card, i) => {
            card.classList.toggle('active', i >= index && i < index + itemsPerView);
        });
    },

    nextSlide: function(carouselId, totalItems) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;
        
        const itemsPerView = this.getItemsPerView();
        const maxIndex = Math.max(0, Math.ceil(totalItems / itemsPerView) - 1);
        
        window.currentSlide = (window.currentSlide + 1) % (maxIndex + 1);
        this.goToSlide(carouselId, window.currentSlide);
    },

    prevSlide: function(carouselId, totalItems) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;
        
        const itemsPerView = this.getItemsPerView();
        const maxIndex = Math.max(0, Math.ceil(totalItems / itemsPerView) - 1);
        
        window.currentSlide = (window.currentSlide - 1 + (maxIndex + 1)) % (maxIndex + 1);
        this.goToSlide(carouselId, window.currentSlide);
    },

    getItemsPerView: function() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 992) return 2;
        return 3;
    },

    startAutoSlide: function(carouselId) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;
        
        const items = carousel.children;
        if (!items.length) return;
        
        window.autoSlideInterval = setInterval(() => {
            this.nextSlide(carouselId, items.length);
        }, 5000);
    },

    resetAutoSlide: function() {
        clearInterval(window.autoSlideInterval);
        this.startAutoSlide();
    },

    addPerformanceMetrics: function() {
        const ctaContent = document.querySelector('.cta-content');
        if (ctaContent && !document.querySelector('.performance-metrics')) {
            const metricsHTML = `
                <div class="performance-metrics">
                    <div class="metric-card">
                        <div class="metric-value">3-5x</div>
                        <div class="metric-label">Average ROI</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">40%</div>
                        <div class="metric-label">Cost Reduction</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">24/7</div>
                        <div class="metric-label">Campaign Monitoring</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">95%</div>
                        <div class="metric-label">Client Satisfaction</div>
                    </div>
                </div>
            `;
            
            ctaContent.insertAdjacentHTML('beforeend', metricsHTML);
        }
    }
};

// ============================================
// GLOBAL INITIALIZATION FUNCTIONS
// ============================================
window.initializeWebsiteCarousels = () => ServiceCarousels.initializeWebsiteCarousels();
window.initializeSocialMediaCarousels = () => ServiceCarousels.initializeSocialMediaCarousels();
window.initializePoliticalCarousels = () => ServiceCarousels.initializePoliticalCarousels();
window.initializeAdsCarousels = () => ServiceCarousels.initializeAdsCarousels();

// ============================================
// AUTO-DETECT AND INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing carousels...');
    
    // Check which page we're on and initialize appropriate carousels
    const path = window.location.pathname;
    const title = document.title;
    
    if (path.includes('website-development') || title.includes('Website Development')) {
        ServiceCarousels.initializeWebsiteCarousels();
    } else if (path.includes('social-media-management') || title.includes('Social Media Management')) {
        ServiceCarousels.initializeSocialMediaCarousels();
    } else if (path.includes('political-branding') || title.includes('Political & Personal Branding')) {
        ServiceCarousels.initializePoliticalCarousels();
    } else if (path.includes('ads-campaign-management') || title.includes('Ads Campaign Management')) {
        ServiceCarousels.initializeAdsCarousels();
    }
    
    // Add hover effects to all carousel cards
    const cards = document.querySelectorAll('.carousel-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            
            const icon = this.querySelector('.carousel-icon');
            if (icon) {
                icon.style.transform = 'rotate(5deg) scale(1.1)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = '';
                this.style.boxShadow = '';
            }
            
            const icon = this.querySelector('.carousel-icon');
            if (icon) {
                icon.style.transform = '';
            }
        });
    });
});
