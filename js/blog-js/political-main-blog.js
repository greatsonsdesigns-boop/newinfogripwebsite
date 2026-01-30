// ==========================================
        // BLOG DATA - COMPREHENSIVE POLITICAL BLOGS
        // ==========================================
        const allBlogs = [
            {
                id: 1,
                title: "Digital Marketing Tips for Politicians in Rajasthan, India",
                excerpt: "Complete guide to leveraging social media, targeted ads, and digital outreach for election campaigns. Learn proven strategies used by successful candidates.",
                content: "Digital marketing has revolutionized political campaigning. This comprehensive guide covers everything from social media strategy to targeted advertising for election success.",
                image: "/assets/blog-images/blog-image(5).png",
                category: "Election Promotion",
                tags: ["election", "digital", "strategy", "campaign"],
                date: "Mar 15, 2025",
                readTime: "8 min",
                language: "english",
                featured: true,
                link: "/blog/political/digital-marketing-tips-for-politicians/"
            
            },
            {
                id: 2,
                title: "Social Media Strategy for Political Leaders: Complete Blueprint",
                excerpt: "Build a powerful social media presence that connects with voters, builds trust, and drives political engagement.",
                content: "A step-by-step framework for political leaders to build an effective social media strategy that resonates with voters.",
                image: "https://images.unsplash.com/photo-1611605698335-8b1569810432?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                category: "Social Media",
                tags: ["social media", "strategy", "engagement", "voters"],
                date: "Mar 10, 2025",
                readTime: "6 min",
                language: "english",
                featured: true
            },
            {
                id: 3,
                title: "Political Branding: How to Create a Strong Personal Brand as a Leader",
                excerpt: "From logo design to consistent messaging, learn how to build a political brand that resonates with your constituency.",
                content: "Building a strong personal brand is essential for political leaders. This guide covers everything from visual identity to messaging.",
                image: "https://images.unsplash.com/photo-1551836026-d5c2c5af78e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                category: "Branding",
                tags: ["branding", "personal brand", "identity", "messaging"],
                date: "Mar 5, 2025",
                readTime: "7 min",
                language: "english",
                featured: true
            },
            {
                id: 4,
                title: "5 Digital Tools Every Political Candidate Must Use",
                excerpt: "Essential digital tools and platforms for modern political campaigning and voter outreach.",
                content: "Discover the must-have digital tools that can streamline your campaign and improve voter engagement.",
                image: "https://images.unsplash.com/photo-1551135049-8a33b2fb2f5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                category: "Strategy",
                tags: ["tools", "technology", "productivity", "campaign"],
                date: "Feb 28, 2025",
                readTime: "5 min",
                language: "english"
            },
            {
                id: 5,
                title: "चुनाव प्रचार में सोशल मीडिया का सही इस्तेमाल कैसे करें?",
                excerpt: "चुनावी अभियान के लिए फेसबुक, व्हाट्सएप और इंस्टाग्राम का प्रभावी उपयोग। मतदाताओं तक पहुंच बढ़ाने के आसान तरीके।",
                content: "सोशल मीडिया का सही इस्तेमाल करके चुनाव प्रचार को नई ऊँचाइयों पर ले जाएँ।",
                image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                category: "Social Media",
                tags: ["सोशल मीडिया", "चुनाव", "प्रचार", "हिंदी"],
                date: "Feb 25, 2025",
                readTime: "6 min",
                language: "hindi"
            },
            {
                id: 6,
                title: "Targeted Facebook Ads for Political Campaigns: Step-by-Step Guide",
                excerpt: "Learn how to create, target, and optimize Facebook ads for maximum political impact and voter reach.",
                content: "Facebook advertising can be a game-changer for political campaigns when done correctly.",
                image: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                category: "Social Media",
                tags: ["facebook", "ads", "targeting", "campaign"],
                date: "Feb 22, 2025",
                readTime: "9 min",
                language: "english"
            },
            {
                id: 7,
                title: "नेताओं के लिए डिजिटल ब्रांडिंग गाइड",
                excerpt: "डिजिटल युग में अपनी पहचान कैसे बनाएं? ऑनलाइन छवि निर्माण और विश्वसनीयता बढ़ाने के उपाय।",
                content: "डिजिटल ब्रांडिंग के माध्यम से अपनी पहचान मजबूत करें और मतदाताओं का विश्वास जीतें।",
                image: "https://images.unsplash.com/photo-1551836026-d5c2c5af78e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                category: "Branding",
                tags: ["ब्रांडिंग", "डिजिटल", "पहचान", "हिंदी"],
                date: "Feb 20, 2025",
                readTime: "7 min",
                language: "hindi"
            },
            {
                id: 8,
                title: "WhatsApp Campaigning for Political Outreach",
                excerpt: "Effective strategies for using WhatsApp to connect with voters, share updates, and build community support.",
                content: "WhatsApp has become a crucial tool for political communication and voter engagement.",
                image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                category: "Strategy",
                tags: ["whatsapp", "messaging", "outreach", "community"],
                date: "Feb 18, 2025",
                readTime: "5 min",
                language: "english"
            },
            {
                id: 9,
                title: "युवा मतदाताओं तक कैसे पहुंचें?",
                excerpt: "18-35 आयु वर्ग के मतदाताओं के साथ जुड़ाव बढ़ाने की रणनीतियाँ। डिजिटल माध्यमों का कुशल प्रयोग।",
                content: "युवा मतदाताओं को समझें और उन तक पहुँचने के आधुनिक तरीके अपनाएँ।",
                image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                category: "Strategy",
                tags: ["युवा", "मतदाता", "रणनीति", "हिंदी"],
                date: "Feb 15, 2025",
                readTime: "6 min",
                language: "hindi"
            },
            {
                id: 10,
                title: "Instagram Reels for Political Leaders: A Complete Guide",
                excerpt: "How to create engaging reels that connect with younger voters and build political influence.",
                content: "Instagram Reels offer a powerful way to reach younger demographics and share your political message.",
                image: "https://images.unsplash.com/photo-1611605698335-8b1569810432?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                category: "Social Media",
                tags: ["instagram", "reels", "youth", "content"],
                date: "Feb 12, 2025",
                readTime: "6 min",
                language: "english"
            },
            {
                id: 11,
                title: "व्हाट्सएप ब्रॉडकास्ट से मतदाताओं तक कैसे पहुंचें",
                excerpt: "WhatsApp broadcasting strategies for political communication and voter engagement.",
                content: "WhatsApp broadcasting का उपयोग करके बड़ी संख्या में मतदाताओं तक पहुँच स्थापित करें।",
                image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                category: "Strategy",
                tags: ["व्हाट्सएप", "ब्रॉडकास्ट", "संचार", "हिंदी"],
                date: "Feb 10, 2025",
                readTime: "5 min",
                language: "hindi"
            },
            {
                id: 12,
                title: "Creating a Consistent Political Message Across Platforms",
                excerpt: "Maintaining message consistency from posters to social media for maximum impact.",
                content: "Consistency in political messaging builds trust and reinforces your core values with voters.",
                image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                category: "Branding",
                tags: ["messaging", "consistency", "communication", "brand"],
                date: "Feb 8, 2025",
                readTime: "7 min",
                language: "english"
            }
        ];
        
        const categories = [
            {
                icon: "fas fa-vote-yea",
                title: "Election Promotion",
                description: "Digital strategies for election campaigns and voter outreach"
            },
            {
                icon: "fas fa-hashtag",
                title: "Social Media for Politicians",
                description: "Building presence on Facebook, Instagram, WhatsApp"
            },
            {
                icon: "fas fa-user-tie",
                title: "Political Branding",
                description: "Creating strong personal brands for leaders"
            },
            {
                icon: "fas fa-bullhorn",
                title: "Digital Campaign Tips",
                description: "Practical advice for online political campaigns"
            },
            {
                icon: "fas fa-language",
                title: "Hindi Blogs",
                description: "Digital marketing guidance in Hindi for leaders"
            },
            {
                icon: "fas fa-chart-bar",
                title: "Analytics & Data",
                description: "Measuring campaign performance and voter sentiment"
            }
        ];
        
        const typingTexts = [
            "Election Promotion",
            "Social Media Strategy", 
            "Digital Campaigning",
            "Political Branding",
            "Voter Outreach",
            "Hindi Content"
        ];
        
        // ==========================================
        // GLOBAL STATE VARIABLES
        // ==========================================
        let currentFilter = "all";
        let currentSearch = "";
        let currentCategorySlide = 0;
        let autoSlideInterval;
        let popupTimeout;
        let popupAutoCloseTimeout;
        
        // ==========================================
        // TYPING EFFECT FOR HERO SECTION
        // ==========================================
        let typingIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typingSpeed = 100;
        const deleteSpeed = 50;
        const pauseBetween = 1500;
        
        function typeEffect() {
            const currentText = typingTexts[typingIndex];
            const typingElement = document.getElementById('typing-text');
            
            if (!typingElement) return;
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                
                if (charIndex === 0) {
                    isDeleting = false;
                    typingIndex = (typingIndex + 1) % typingTexts.length;
                    setTimeout(typeEffect, 500);
                } else {
                    setTimeout(typeEffect, deleteSpeed);
                }
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                
                if (charIndex === currentText.length) {
                    isDeleting = true;
                    setTimeout(typeEffect, pauseBetween);
                } else {
                    setTimeout(typeEffect, typingSpeed);
                }
            }
        }
        
        // ==========================================
        // SEARCH RESULTS DROPDOWN
        // ==========================================
        function showSearchResults(query) {
            const resultsContainer = document.getElementById('searchResults');
            if (!resultsContainer) return;
            
            if (!query || query.trim() === "") {
                resultsContainer.classList.remove('active');
                document.body.classList.remove('search-results-open');
                return;
            }
            
            const searchTerm = query.toLowerCase();
            const searchResults = allBlogs.filter(blog => 
                blog.title.toLowerCase().includes(searchTerm) ||
                blog.excerpt.toLowerCase().includes(searchTerm) ||
                blog.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                blog.category.toLowerCase().includes(searchTerm)
            ).slice(0, 6); // Show max 6 results in dropdown
            
            if (searchResults.length === 0) {
                resultsContainer.innerHTML = `
                    <div class="no-search-results">
                        <i class="fas fa-search"></i>
                        <p>No blogs found for "<strong>${query}</strong>"</p>
                        <p>Try different keywords or browse categories</p>
                    </div>
                `;
            } else {
                resultsContainer.innerHTML = searchResults.map(blog => `
                    <div class="search-result-item" data-id="${blog.id}">
                        <div class="search-result-image">
                            <img src="${blog.image}" alt="${blog.title}">
                        </div>
                        <div class="search-result-content">
                            <h4>${blog.title}</h4>
                            <p>${blog.excerpt}</p>
                            <span class="search-result-category">${blog.category}</span>
                        </div>
                    </div>
                `).join('');
                
                // Add click events to search results
                resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
                    item.addEventListener('click', function() {
                        const blogId = this.dataset.id;
                        const blog = allBlogs.find(b => b.id == blogId);
                        if (blog) {
                            // In real implementation, navigate to blog page
                            // For now, just filter to show this blog
                            currentSearch = blog.title.split(' ')[0];
                            document.getElementById('searchInput').value = currentSearch;
                            filterAndSearchBlogs();
                            hideSearchResults();
                        }
                    });
                });
            }
            
            resultsContainer.classList.add('active');
            document.body.classList.add('search-results-open');
        }
        
        function hideSearchResults() {
            const resultsContainer = document.getElementById('searchResults');
            if (resultsContainer) {
                resultsContainer.classList.remove('active');
                document.body.classList.remove('search-results-open');
            }
        }
        
        // ==========================================
        // RENDER BLOG CARDS
        // ==========================================
        function renderBlogCards(blogs) {
            const container = document.getElementById('blogsGrid');
            if (!container) return;
            
            if (blogs.length === 0) {
                container.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-search"></i>
                        <h3>No blogs found</h3>
                        <p>Try adjusting your search or filter to find what you're looking for.</p>
                        <button class="btn btn-primary" onclick="resetFilters()">Reset Filters</button>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = blogs.map(blog => `
    <article class="blog-card fade-in" 
        data-id="${blog.id}" 
        data-language="${blog.language}" 
        data-category="${blog.category.toLowerCase()}" 
        data-tags="${blog.tags.join(',')}"
        onclick="window.location.href='${blog.link}'">

        <div class="blog-image">
            <img src="${blog.image}" alt="${blog.title}" loading="lazy">
        </div>

        <div class="blog-content">
            <div class="blog-meta">
                <span class="blog-date">${blog.date} • ${blog.readTime} read</span>
                <span class="blog-category">${blog.category}</span>
            </div>

            <h3>${blog.title}</h3>
            <p>${blog.excerpt}</p>

            ${blog.tags && blog.tags.length > 0 ? `
                <div class="blog-tags">
                    ${blog.tags.slice(0, 3).map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                </div>
            ` : ''}

            <a href="${blog.link}" class="read-more">
                Read More <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    </article>
`).join('');

        }
        
        // ==========================================
        // RENDER HINDI BLOG CARDS
        // ==========================================
        function renderHindiBlogCards() {
            const container = document.getElementById('hindiGrid');
            if (!container) return;
            
            const hindiBlogs = allBlogs.filter(blog => blog.language === "hindi").slice(0, 3);
            
            container.innerHTML = hindiBlogs.map(blog => `
                <article class="hindi-card fade-in" data-id="${blog.id}">
                    <div class="blog-image">
                        <img src="${blog.image}" alt="${blog.title}" loading="lazy">
                    </div>
                    <div class="blog-content">
                        <div class="hindi-indicator">
                            <i class="fas fa-language"></i> Hindi Blog
                        </div>
                        <div class="blog-meta">
                            <span class="blog-date">${blog.date} • ${blog.readTime} read</span>
                            <span class="blog-category">${blog.category}</span>
                        </div>
                        <h3>${blog.title}</h3>
                        <p>${blog.excerpt}</p>
                        <a href="#" class="read-more">पढ़ें <i class="fas fa-arrow-right"></i></a>
                    </div>
                </article>
            `).join('');
        }
        
        // ==========================================
        // FILTER AND SEARCH FUNCTIONALITY
        // ==========================================
        function filterAndSearchBlogs() {
            let filteredBlogs = [...allBlogs];
            
            // Apply search filter
            if (currentSearch.trim() !== "") {
                const searchTerm = currentSearch.toLowerCase();
                filteredBlogs = filteredBlogs.filter(blog => 
                    blog.title.toLowerCase().includes(searchTerm) ||
                    blog.excerpt.toLowerCase().includes(searchTerm) ||
                    blog.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                    blog.category.toLowerCase().includes(searchTerm)
                );
            }
            
            // Apply category filter
            if (currentFilter !== "all") {
                if (currentFilter === "hindi") {
                    filteredBlogs = filteredBlogs.filter(blog => blog.language === "hindi");
                } else if (currentFilter === "english") {
                    filteredBlogs = filteredBlogs.filter(blog => blog.language === "english");
                } else {
                    filteredBlogs = filteredBlogs.filter(blog => 
                        blog.category.toLowerCase().includes(currentFilter) ||
                        blog.tags.some(tag => tag.toLowerCase().includes(currentFilter))
                    );
                }
            }
            
            // Update results count
            updateResultsCount(filteredBlogs.length);
            
            // Render filtered blogs
            renderBlogCards(filteredBlogs);
            
            // Update URL without page reload
            updateURL();
        }
        
        function updateResultsCount(count) {
            const resultsElement = document.getElementById('resultsCount');
            const totalElement = document.getElementById('totalBlogs');
            
            if (resultsElement) {
                resultsElement.textContent = count;
            }
            
            if (totalElement) {
                totalElement.textContent = `${count} blogs found`;
            }
        }
        
        function resetFilters() {
            currentFilter = "all";
            currentSearch = "";
            
            // Reset UI
            document.querySelectorAll('.filter-tab').forEach(tab => {
                tab.classList.toggle('active', tab.dataset.filter === "all");
            });
            
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = "";
            }
            
            // Hide search results
            hideSearchResults();
            
            // Update blogs
            filterAndSearchBlogs();
        }
        
        // ==========================================
        // BOTTOM CTA POPUP - FIXED
        // ==========================================
        function initBottomCTA() {
            const ctaPopup = document.getElementById('bottom-cta');
            const closeBtn = document.getElementById('cta-close');
            
            if (!ctaPopup || !closeBtn) return;
            
            // Show popup after delay
            popupTimeout = setTimeout(() => {
                ctaPopup.classList.add('show');
                
                // Auto close after 8 seconds
                popupAutoCloseTimeout = setTimeout(() => {
                    closePopup();
                }, 8000);
            }, 3000);
            
            // Close button event
            closeBtn.addEventListener('click', closePopup);
            
            // Close popup when clicking outside (on mobile)
            ctaPopup.addEventListener('click', (e) => {
                if (e.target === ctaPopup) {
                    closePopup();
                }
            });
        }
        
        function closePopup() {
            const ctaPopup = document.getElementById('bottom-cta');
            if (ctaPopup) {
                ctaPopup.classList.remove('show');
                
                // Clear any existing timeouts
                if (popupTimeout) clearTimeout(popupTimeout);
                if (popupAutoCloseTimeout) clearTimeout(popupAutoCloseTimeout);
                
                // Reappear after 30 seconds if user stays on page
                popupTimeout = setTimeout(() => {
                    ctaPopup.classList.add('show');
                    
                    // Auto close again after 8 seconds
                    popupAutoCloseTimeout = setTimeout(() => {
                        closePopup();
                    }, 8000);
                }, 30000);
            }
        }
        
        // ==========================================
        // CATEGORY CAROUSEL
        // ==========================================
        function initCategoryCarousel() {
            const carousel = document.getElementById('category-carousel');
            const dotsContainer = document.getElementById('category-dots');
            
            if (!carousel || !dotsContainer) return;
            
            // Clear existing content
            carousel.innerHTML = '';
            dotsContainer.innerHTML = '';
            
            // Calculate visible items based on screen width
            let itemsPerView = 4;
            if (window.innerWidth <= 992) itemsPerView = 3;
            if (window.innerWidth <= 768) itemsPerView = 2;
            if (window.innerWidth <= 576) itemsPerView = 1;
            
            const totalSlides = Math.ceil(categories.length / itemsPerView);
            
            // Create slides
            for (let i = 0; i < totalSlides; i++) {
                const slide = document.createElement('div');
                slide.className = 'category-slide';
                slide.style.display = 'flex';
                slide.style.gap = '30px';
                
                // Add items to this slide
                for (let j = 0; j < itemsPerView; j++) {
                    const index = i * itemsPerView + j;
                    if (index >= categories.length) break;
                    
                    const category = categories[index];
                    const card = document.createElement('div');
                    card.className = 'category-card fade-in';
                    card.style.animationDelay = `${j * 0.1}s`;
                    
                    card.innerHTML = `
                        <div class="category-icon">
                            <i class="${category.icon}"></i>
                        </div>
                        <h3>${category.title}</h3>
                        <p>${category.description}</p>
                    `;
                    
                    // Add click event to filter by category
                    card.addEventListener('click', () => {
                        const filterTab = document.querySelector(`.filter-tab[data-filter="${category.title.toLowerCase().split(' ')[0]}"]`);
                        if (filterTab) {
                            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                            filterTab.classList.add('active');
                            currentFilter = filterTab.dataset.filter;
                            filterAndSearchBlogs();
                        }
                    });
                    
                    slide.appendChild(card);
                }
                
                carousel.appendChild(slide);
            }
            
            // Create dots
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('div');
                dot.className = `dot ${i === 0 ? 'active' : ''}`;
                dot.dataset.index = i;
                dot.addEventListener('click', () => goToCategorySlide(i));
                dotsContainer.appendChild(dot);
            }
            
            // Set initial position
            updateCategoryCarousel();
            
            // Start auto sliding
            startAutoSlide();
        }
        
        function goToCategorySlide(index) {
            const carousel = document.getElementById('category-carousel');
            const totalSlides = document.querySelectorAll('.category-slide').length;
            
            currentCategorySlide = index;
            if (currentCategorySlide >= totalSlides) currentCategorySlide = 0;
            if (currentCategorySlide < 0) currentCategorySlide = totalSlides - 1;
            
            updateCategoryCarousel();
            resetAutoSlide();
        }
        
        function nextCategorySlide() {
            const totalSlides = document.querySelectorAll('.category-slide').length;
            goToCategorySlide(currentCategorySlide + 1);
        }
        
        function prevCategorySlide() {
            const totalSlides = document.querySelectorAll('.category-slide').length;
            goToCategorySlide(currentCategorySlide - 1);
        }
        
        function updateCategoryCarousel() {
            const carousel = document.getElementById('category-carousel');
            const dots = document.querySelectorAll('.carousel-dots .dot');
            
            if (!carousel || !dots) return;
            
            carousel.style.transform = `translateX(-${currentCategorySlide * 100}%)`;
            
            // Update active dot
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentCategorySlide);
            });
        }
        
        function startAutoSlide() {
            autoSlideInterval = setInterval(nextCategorySlide, 5000);
        }
        
        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }
        
        // ==========================================
        // URL MANAGEMENT
        // ==========================================
        function updateURL() {
            const params = new URLSearchParams();
            if (currentFilter !== "all") params.set('filter', currentFilter);
            if (currentSearch) params.set('search', currentSearch);
            
            const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
            window.history.replaceState({}, '', newURL);
        }
        
        function readURLParams() {
            const params = new URLSearchParams(window.location.search);
            const filterParam = params.get('filter');
            const searchParam = params.get('search');
            
            if (filterParam && document.querySelector(`.filter-tab[data-filter="${filterParam}"]`)) {
                currentFilter = filterParam;
                document.querySelectorAll('.filter-tab').forEach(tab => {
                    tab.classList.toggle('active', tab.dataset.filter === filterParam);
                });
            }
            
            if (searchParam) {
                currentSearch = searchParam;
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.value = searchParam;
                }
            }
        }
        
        // ==========================================
        // THEME TOGGLE
        // ==========================================
        function initThemeToggle() {
            const themeToggle = document.getElementById('theme-toggle');
            const icon = themeToggle?.querySelector('i');
            
            if (!themeToggle || !icon) return;
            
            // Check for saved theme or prefer-color-scheme
            const savedTheme = localStorage.getItem('theme') || 
                              (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-theme');
                icon.className = 'fas fa-sun';
            }
            
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-theme');
                
                if (document.body.classList.contains('dark-theme')) {
                    localStorage.setItem('theme', 'dark');
                    icon.className = 'fas fa-sun';
                } else {
                    localStorage.setItem('theme', 'light');
                    icon.className = 'fas fa-moon';
                }
            });
        }
        
        // ==========================================
        // MOBILE MENU TOGGLE
        // ==========================================
        function initMobileMenu() {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            
            if (!hamburger || !navMenu) return;
            
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
            
            // Close menu when clicking on a link
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        }
        
        // ==========================================
        // SCROLL ANIMATIONS
        // ==========================================
        function initScrollAnimations() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                    }
                });
            }, observerOptions);
            
            // Observe all cards
            document.querySelectorAll('.blog-card, .hindi-card, .trust-card').forEach(card => {
                observer.observe(card);
            });
        }
        
        // ==========================================
        // INITIALIZE EVERYTHING
        // ==========================================
        document.addEventListener('DOMContentLoaded', () => {
            // Start typing effect
            setTimeout(typeEffect, 1000);
            
            // Read URL parameters
            readURLParams();
            
            // Initialize components
            initCategoryCarousel();
            renderHindiBlogCards();
            initBottomCTA();
            initThemeToggle();
            initMobileMenu();
            initScrollAnimations();
            
            // Initial blog render
            filterAndSearchBlogs();
            
            // Search functionality
            const searchInput = document.getElementById('searchInput');
            const searchButton = document.getElementById('searchButton');
            
            if (searchInput && searchButton) {
                // Real-time search with debounce
                let searchTimeout;
                searchInput.addEventListener('input', (e) => {
                    currentSearch = e.target.value;
                    
                    // Clear previous timeout
                    if (searchTimeout) clearTimeout(searchTimeout);
                    
                    // Show search results dropdown
                    if (currentSearch.trim() !== "") {
                        searchTimeout = setTimeout(() => {
                            showSearchResults(currentSearch);
                        }, 300);
                    } else {
                        hideSearchResults();
                    }
                    
                    // Update main grid
                    filterAndSearchBlogs();
                });
                
                searchButton.addEventListener('click', () => {
                    filterAndSearchBlogs();
                    if (currentSearch.trim() !== "") {
                        showSearchResults(currentSearch);
                    }
                });
                
                searchInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        filterAndSearchBlogs();
                        if (currentSearch.trim() !== "") {
                            showSearchResults(currentSearch);
                        }
                    }
                });
                
                // Hide search results when clicking outside
                document.addEventListener('click', (e) => {
                    if (!searchInput.contains(e.target) && !searchButton.contains(e.target)) {
                        const resultsContainer = document.getElementById('searchResults');
                        if (resultsContainer && !resultsContainer.contains(e.target)) {
                            hideSearchResults();
                        }
                    }
                });
            }
            
            // Filter tabs functionality
            document.querySelectorAll('.filter-tab').forEach(tab => {
                tab.addEventListener('click', function() {
                    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    currentFilter = this.dataset.filter;
                    filterAndSearchBlogs();
                    hideSearchResults();
                });
            });
            
            // Carousel arrows
            const prevArrow = document.querySelector('.category-prev');
            const nextArrow = document.querySelector('.category-next');
            
            if (prevArrow) prevArrow.addEventListener('click', prevCategorySlide);
            if (nextArrow) nextArrow.addEventListener('click', nextCategorySlide);
            
            // Pause auto slide on hover
            const carouselWrapper = document.querySelector('.category-carousel-wrapper');
            if (carouselWrapper) {
                carouselWrapper.addEventListener('mouseenter', () => {
                    clearInterval(autoSlideInterval);
                });
                
                carouselWrapper.addEventListener('mouseleave', () => {
                    resetAutoSlide();
                });
            }
            
            // Close popup when clicking outside (for mobile)
            document.addEventListener('click', (e) => {
                const ctaPopup = document.getElementById('bottom-cta');
                if (ctaPopup && !ctaPopup.contains(e.target) && ctaPopup.classList.contains('show')) {
                    // Only close if clicking far away (not on interactive elements)
                    const interactiveElements = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'];
                    if (!interactiveElements.includes(e.target.tagName)) {
                        closePopup();
                    }
                }
            });
            
            // Handle window resize
            window.addEventListener('resize', () => {
                initCategoryCarousel();
            });
            
            // Handle escape key to close search results
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    hideSearchResults();
                }
            });
        });