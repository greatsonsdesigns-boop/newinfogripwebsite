document.addEventListener('DOMContentLoaded', function() {
        // Auto-typing effect for Jaisalmer hero section
        const autoTypeElement = document.getElementById('auto-type');
        if (autoTypeElement) {
            const phrases = [
                "Strategic Jaisalmer Campaigns",
                "Cultural Voter Engagement",
                "Jaisalmer Political Branding",
                "Desert Community Strategies",
                "Jaisalmer-Focused Approaches"
            ];
            let phraseIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            let isEnd = false;
            
            function typeWriter() {
                const currentPhrase = phrases[phraseIndex];
                
                if (isDeleting) {
                    autoTypeElement.textContent = currentPhrase.substring(0, charIndex - 1);
                    charIndex--;
                } else {
                    autoTypeElement.textContent = currentPhrase.substring(0, charIndex + 1);
                    charIndex++;
                }
                
                if (!isDeleting && charIndex === currentPhrase.length) {
                    isEnd = true;
                    isDeleting = true;
                    setTimeout(typeWriter, 2000);
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    setTimeout(typeWriter, 500);
                } else {
                    const typeSpeed = isDeleting ? 50 : 100;
                    setTimeout(typeWriter, typeSpeed);
                }
            }
            
            // Start typing after a delay
            setTimeout(typeWriter, 1000);
        }

        // Live stats counter animation
        const counters = document.querySelectorAll('.live-stat-number');
        const speed = 200;
        
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-count');
            const count = +counter.innerText;
            
            if(count < target) {
                const inc = target / speed;
                const updateCount = () => {
                    const current = +counter.innerText;
                    if(current < target) {
                        counter.innerText = Math.ceil(current + inc);
                        setTimeout(updateCount, 1);
                    } else {
                        counter.innerText = target;
                    }
                }
                updateCount();
            }
        });
        
        // Bottom Hindi Popup for Jaisalmer
        const bottomPopup = document.getElementById('bottomPopup');
        const popupCloseBtn = document.getElementById('popupCloseBtn');
        let popupShown = false;
        
        function showBottomPopup() {
            if (!popupShown) {
                bottomPopup.classList.add('show');
                popupShown = true;
                
                // Auto hide after 15 seconds
                setTimeout(() => {
                    if (bottomPopup.classList.contains('show')) {
                        closeBottomPopup();
                    }
                }, 15000);
            }
        }
        
        function closeBottomPopup() {
            bottomPopup.classList.remove('show');
        }
        
        // Show popup after 40 seconds
        setTimeout(showBottomPopup, 40000);
        
        // Show popup at 60% scroll
        window.addEventListener('scroll', function() {
            if (popupShown) return;
            
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (window.scrollY / scrollHeight) * 100;
            
            if (scrollPercent >= 60) {
                showBottomPopup();
            }
        });
        
        // Close popup on button click
        popupCloseBtn.addEventListener('click', closeBottomPopup);
        
        // Close popup on click outside
        document.addEventListener('click', function(event) {
            if (bottomPopup.classList.contains('show') && 
                !bottomPopup.contains(event.target) && 
                event.target !== bottomPopup) {
                closeBottomPopup();
            }
        });
        
        // Fade in animations on scroll
        const fadeElements = document.querySelectorAll('.fade-in');
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeIn 0.8s ease forwards';
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        fadeElements.forEach(el => {
            fadeObserver.observe(el);
        });
    });
  