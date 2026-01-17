// FAQ Accordion
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        });
        
        // Scroll Animations
        const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');
        
        const checkScroll = () => {
            animateOnScrollElements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.2;
                
                if (elementPosition < screenPosition) {
                    element.classList.add('visible');
                }
            });
        };
        
        // Initial check
        checkScroll();
        
        // Check on scroll
        window.addEventListener('scroll', checkScroll);
        
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                if (this.getAttribute('href') === '#') return;
                
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Image hover effect enhancement
        const blogImages = document.querySelectorAll('.blog-image, .blog-hero-image');
        blogImages.forEach(img => {
            img.addEventListener('mouseenter', () => {
                img.style.transform = 'translateY(-8px)';
            });
            
            img.addEventListener('mouseleave', () => {
                img.style.transform = 'translateY(0)';
            });
        });
        
        // Bottom Popup Functionality
        const bottomPopup = document.getElementById('bottomPopup');
        const popupClose = document.getElementById('popupClose');
        
        // Show popup after page loads
        window.addEventListener('load', () => {
            setTimeout(() => {
                bottomPopup.classList.add('show');
            }, 1500);
        });
        
        // Close popup on button click
        popupClose.addEventListener('click', () => {
            bottomPopup.classList.remove('show');
        });
        
        // Auto hide popup after 5 seconds
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (bottomPopup.classList.contains('show')) {
                    bottomPopup.classList.remove('show');
                }
            }, 8000); // 8 seconds
        });
        
        // Close popup when clicking outside (optional)
        document.addEventListener('click', (e) => {
            if (!bottomPopup.contains(e.target) && bottomPopup.classList.contains('show')) {
                bottomPopup.classList.remove('show');
            }
        });
