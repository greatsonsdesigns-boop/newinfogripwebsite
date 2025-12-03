// Service Carousels Functionality
const ServiceCarousels = {
    // Website Development Carousels
    initializeWebsiteCarousels: function() {
        // Features Carousel
        const websiteFeatures = [
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

        this.initializeCarousel('features-carousel', 'features-nav', websiteFeatures);

        // Advanced Features Carousel
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

        this.initializeCarousel('advanced-slider', 'advanced-nav', advancedFeatures);
    },

    // Social Media Management Carousels
    initializeSocialMediaCarousels: function() {
        // Features Carousel
        const socialMediaFeatures = [
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

        this.initializeCarousel('features-carousel', 'features-nav', socialMediaFeatures);

        // Platforms Carousel
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

        this.initializeCarousel('platforms-carousel', 'platforms-nav', platforms);
    },

    // Generic Carousel Initialization
    initializeCarousel: function(carouselId, navId, items) {
        const carousel = document.getElementById(carouselId);
        const nav = document.getElementById(navId);
        
        if (!carousel || !nav) return;

        // Clear existing content
        carousel.innerHTML = '';
        nav.innerHTML = '';

        let currentSlide = 0;

        // Create carousel items
        items.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'carousel-card';
            if (index === 0) card.classList.add('active');
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
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                this.goToSlide(carouselId, navId, index);
            });
            nav.appendChild(dot);
        });

        // Calculate items per view based on screen size
        const calculateItemsPerView = () => {
            if (window.innerWidth < 768) return 1;
            if (window.innerWidth < 992) return 2;
            return 3;
        };

        // Navigation functions
        window.goToSlide = (carouselId, navId, index) => {
            currentSlide = index;
            const itemsPerView = calculateItemsPerView();
            const translateX = -(currentSlide * (100 / itemsPerView));
            
            document.getElementById(carouselId).style.transform = `translateX(${translateX}%)`;
            
            // Update active card
            document.querySelectorAll(`#${carouselId} .carousel-card`).forEach((card, i) => {
                card.classList.toggle('active', i === currentSlide);
            });
            
            // Update active dot
            document.querySelectorAll(`#${navId} .carousel-dot`).forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        };

        window.nextSlide = (carouselId, navId) => {
            const itemsPerView = calculateItemsPerView();
            const totalItems = items.length;
            currentSlide = (currentSlide + 1) % Math.ceil(totalItems / itemsPerView);
            window.goToSlide(carouselId, navId, currentSlide);
        };

        window.prevSlide = (carouselId, navId) => {
            const itemsPerView = calculateItemsPerView();
            const totalItems = items.length;
            const totalSlides = Math.ceil(totalItems / itemsPerView);
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            window.goToSlide(carouselId, navId, currentSlide);
        };

        // Add event listeners for arrow buttons
        const container = carousel.closest('.service-carousel-container');
        if (container) {
            const prevBtn = container.querySelector('.carousel-arrow.prev');
            const nextBtn = container.querySelector('.carousel-arrow.next');
            
            if (prevBtn) {
                prevBtn.addEventListener('click', () => window.prevSlide(carouselId, navId));
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', () => window.nextSlide(carouselId, navId));
            }
        }

        // Auto-advance carousel
        setInterval(() => window.nextSlide(carouselId, navId), 5000);

        // Handle window resize
        window.addEventListener('resize', () => {
            window.goToSlide(carouselId, navId, currentSlide);
        });
    }
};

// Export functions for global use
window.initializeWebsiteCarousels = () => ServiceCarousels.initializeWebsiteCarousels();
window.initializeSocialMediaCarousels = () => ServiceCarousels.initializeSocialMediaCarousels();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Auto-initialize based on page
    if (document.title.includes('Website Development')) {
        ServiceCarousels.initializeWebsiteCarousels();
    } else if (document.title.includes('Social Media Management')) {
        ServiceCarousels.initializeSocialMediaCarousels();
    }
});
