// ================================
// SAFE & COMPLETE BLOG FUNCTIONALITY JS
// (No functions removed)
// ================================
document.addEventListener("DOMContentLoaded", function () {

    

    // ================================
    // FAQ Accordion
    // ================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;

        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            item.classList.toggle('active');
        });
    });


    // ================================
    // Scroll Animations
    // ================================
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

    checkScroll();
    window.addEventListener('scroll', checkScroll);


    // ================================
    // Smooth scroll for anchor links
    // ================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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


    // ================================
    // Image hover effect enhancement
    // ================================
    const blogImages = document.querySelectorAll('.blog-image, .blog-hero-image');

    blogImages.forEach(img => {
        img.addEventListener('mouseenter', () => {
            img.style.transform = 'translateY(-5px)';
        });

        img.addEventListener('mouseleave', () => {
            img.style.transform = 'translateY(0)';
        });
    });


    // ================================
    // Bottom Popup Functionality
    // ================================
    const bottomPopup = document.getElementById('bottomPopup');
    const popupClose = document.getElementById('popupClose');

    if (bottomPopup && popupClose) {

        // Show popup after page load
        setTimeout(() => {
            bottomPopup.classList.add('show');
        }, 2000);

        // Close popup on button click
        popupClose.addEventListener('click', () => {
            bottomPopup.classList.remove('show');
        });

        // Auto hide popup after 7 seconds
        setTimeout(() => {
            bottomPopup.classList.remove('show');
        }, 7000);

        // Close popup when clicking outside
        document.addEventListener('click', (e) => {
            if (!bottomPopup.contains(e.target) && !e.target.closest('.floating-cta')) {
                bottomPopup.classList.remove('show');
            }
        });
    }

});
