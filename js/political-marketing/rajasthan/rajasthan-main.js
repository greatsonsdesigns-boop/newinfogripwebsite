document.addEventListener('DOMContentLoaded', function() {
            // Auto-typing effect for Rajasthan hero section
            const autoTypeElement = document.getElementById('auto-type');
            const phrases = [
                "Strategic Rajasthan Campaigns",
                "Local Voter Outreach",
                "Rajasthan Political Branding",
                "Regional Election Success",
                "Rajasthan-Specific Strategies"
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
            
            // Rajasthan Cities Carousel
            const citiesData = [
                {
                    name: "Jaipur",
                    hindiName: "जयपुर",
                    icon: "fas fa-chess-rook",
                    href: "political-marketing-in-jaipur.html",
                    description: "Capital city strategies for urban and peri-urban voter segments"
                },
                {
                    name: "Ajmer",
                    hindiName: "अजमेर",
                    icon: "fas fa-mosque",
                    href: "political-marketing-in-ajmer.html",
                    description: "Religious and cultural center with diverse voter demographics"
                },
                {
                    name: "Udaipur",
                    hindiName: "उदयपुर",
                    icon: "fas fa-lake",
                    href: "political-marketing-in-udaipur.html",
                    description: "Royal city strategies for Mewar region political dynamics"
                },
                {
                    name: "Jodhpur",
                    hindiName: "जोधपुर",
                    icon: "fas fa-fort-awesome",
                    href: "political-marketing-in-jodhpur.html",
                    description: "Marwar region strategies with focus on desert communities"
                },
                {
                    name: "Kota",
                    hindiName: "कोटा",
                    icon: "fas fa-graduation-cap",
                    href: "political-marketing-in-kota.html",
                    description: "Education hub strategies for youth and professional voters"
                },
                {
                    name: "Barmer",
                    hindiName: "बाड़मेर",
                    icon: "fas fa-wind",
                    href: "political-marketing-in-barmer.html",
                    description: "Desert region strategies for border area political dynamics"
                },
                {
                    name: "Jaisalmer",
                    hindiName: "जैसलमेर",
                    icon: "fas fa-monument",
                    href: "political-marketing-in-jaisalmer.html",
                    description: "Tourism and border region strategies for western Rajasthan"
                }
            ];
            
            const citiesTrack = document.getElementById('cities-track');
            const citiesDots = document.getElementById('cities-dots');
            let currentCitySlide = 0;
            let citiesPerView = 3;
            let cityAutoSlideInterval;
            
            // Update cities per view based on screen size
            function updateCitiesPerView() {
                if (window.innerWidth <= 768) {
                    citiesPerView = 1;
                } else if (window.innerWidth <= 1024) {
                    citiesPerView = 2;
                } else {
                    citiesPerView = 3;
                }
                updateCitiesCarousel();
            }
            
            // Create cities carousel
            function createCitiesCarousel() {
                citiesTrack.innerHTML = '';
                citiesDots.innerHTML = '';
                
                citiesData.forEach((city, index) => {
                    const card = document.createElement('a');
                    card.className = 'state-card';
                    card.href = city.href;
                    card.innerHTML = `
                        <div class="state-icon">
                            <i class="${city.icon}"></i>
                        </div>
                        <h3>${city.name}</h3>
                        <p class="hindi-text" style="color: var(--blue); margin-bottom: 10px;">${city.hindiName}</p>
                        <p style="color: var(--text-color); font-size: 0.95rem;">${city.description}</p>
                        <div style="margin-top: 15px;">
                            <span style="color: var(--blue); font-weight: 600; font-size: 0.9rem;">
                                Explore Strategy <i class="fas fa-arrow-right"></i>
                            </span>
                        </div>
                    `;
                    citiesTrack.appendChild(card);
                    
                    // Create dot
                    const dot = document.createElement('button');
                    dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
                    dot.addEventListener('click', () => goToCitySlide(index));
                    citiesDots.appendChild(dot);
                });
                
                updateCitiesCarousel();
                startCityAutoSlide();
            }
            
            function updateCitiesCarousel() {
                if (!citiesTrack.children.length) return;
                
                // Get the width of one card including gap
                const cardStyle = window.getComputedStyle(citiesTrack.children[0]);
                const cardWidth = citiesTrack.children[0].offsetWidth + 
                                 parseFloat(cardStyle.marginLeft || 0) + 
                                 parseFloat(cardStyle.marginRight || 0) +
                                 25; // gap
                
                const maxSlide = Math.max(0, citiesData.length - citiesPerView);
                
                // Ensure currentCitySlide is within bounds
                currentCitySlide = Math.max(0, Math.min(currentCitySlide, maxSlide));
                
                citiesTrack.style.transform = `translateX(-${currentCitySlide * cardWidth}px)`;
                
                // Update dots
                const dots = document.querySelectorAll('#cities-dots .carousel-dot');
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentCitySlide);
                });
            }
            
            function goToCitySlide(index) {
                const maxSlide = Math.max(0, citiesData.length - citiesPerView);
                currentCitySlide = Math.max(0, Math.min(index, maxSlide));
                updateCitiesCarousel();
                resetCityAutoSlide();
            }
            
            function nextCitySlide() {
                const maxSlide = Math.max(0, citiesData.length - citiesPerView);
                if (currentCitySlide < maxSlide) {
                    goToCitySlide(currentCitySlide + 1);
                } else {
                    goToCitySlide(0);
                }
            }
            
            function startCityAutoSlide() {
                cityAutoSlideInterval = setInterval(nextCitySlide, 4000);
            }
            
            function resetCityAutoSlide() {
                clearInterval(cityAutoSlideInterval);
                startCityAutoSlide();
            }
            
            // Navigation buttons
            document.getElementById('cities-prev').addEventListener('click', () => {
                if (currentCitySlide > 0) {
                    goToCitySlide(currentCitySlide - 1);
                } else {
                    const maxSlide = Math.max(0, citiesData.length - citiesPerView);
                    goToCitySlide(maxSlide);
                }
            });
            
            document.getElementById('cities-next').addEventListener('click', () => {
                nextCitySlide();
            });
            
            // Pause auto-slide on hover
            citiesTrack.addEventListener('mouseenter', () => {
                clearInterval(cityAutoSlideInterval);
            });
            
            citiesTrack.addEventListener('mouseleave', () => {
                startCityAutoSlide();
            });
            
            // Initialize carousel
            createCitiesCarousel();
            updateCitiesPerView();
            
            // Handle window resize
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    updateCitiesPerView();
                    setTimeout(updateCitiesCarousel, 100);
                }, 250);
            });
            
            // Rajasthan-Specific Calculator
            const budgetSlider = document.getElementById('budget');
            const durationSlider = document.getElementById('duration');
            const budgetValue = document.getElementById('budget-value');
            const durationValue = document.getElementById('duration-value');
            const estimatedReach = document.getElementById('estimated-reach');
            const engagementRate = document.getElementById('engagement-rate');
            const costPerVoter = document.getElementById('cost-per-voter');
            const calculateBtn = document.getElementById('calculate-btn');
            const regionSelect = document.getElementById('region');
            
            // Initialize calculator values
            budgetValue.textContent = '₹' + parseInt(budgetSlider.value).toLocaleString();
            durationValue.textContent = durationSlider.value + ' Months';
            
            // Calculate function for Rajasthan
            function updateCalculator() {
                const budget = parseInt(budgetSlider.value);
                const duration = parseInt(durationSlider.value);
                const region = regionSelect.value;
                
                // Update displayed values
                budgetValue.textContent = '₹' + budget.toLocaleString();
                durationValue.textContent = duration + ' Month' + (duration > 1 ? 's' : '');
                
                // Region multipliers for Rajasthan
                const multipliers = {
                    'jaipur': 1.6,
                    'jodhpur': 1.4,
                    'udaipur': 1.5,
                    'kota': 1.3,
                    'ajmer': 1.4,
                    'statewide': 1.8
                };
                
                const baseMultiplier = multipliers[region] || 1.5;
                
                // Calculate estimated reach for Rajasthan
                const estimated = Math.round((budget * duration * baseMultiplier) / 8);
                
                // Calculate engagement rate for Rajasthan (9-14% range)
                const engagement = (9 + Math.random() * 5).toFixed(1);
                
                // Calculate cost per voter for Rajasthan (₹2-3 range)
                const cost = (2 + Math.random() * 1).toFixed(1);
                
                // Update all values
                estimatedReach.textContent = estimated.toLocaleString();
                engagementRate.textContent = engagement + '%';
                costPerVoter.textContent = '₹' + cost;
                
                // Animate the number change
                animateNumber(estimatedReach, 0, estimated);
            }
            
            function animateNumber(element, start, end) {
                const duration = 1000;
                const startTime = performance.now();
                
                function updateNumber(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    const current = Math.floor(start + (end - start) * progress);
                    element.textContent = current.toLocaleString();
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateNumber);
                    }
                }
                
                requestAnimationFrame(updateNumber);
            }
            
            // Event listeners for calculator
            budgetSlider.addEventListener('input', updateCalculator);
            durationSlider.addEventListener('input', updateCalculator);
            regionSelect.addEventListener('change', updateCalculator);
            
            calculateBtn.addEventListener('click', function() {
                // Show success message
                const originalText = this.innerHTML;
                const originalBg = this.style.background;
                
                this.innerHTML = '<i class="fas fa-check"></i> Rajasthan Strategy Calculated!';
                this.style.background = 'var(--blue)';
                this.disabled = true;
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.background = originalBg;
                    this.disabled = false;
                }, 2000);
                
                // Scroll to calculator result
                document.querySelector('.calculator-result').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            });
            
            // Initialize calculator with default values
            updateCalculator();
            
            // Bottom Hindi Popup for Rajasthan
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
            
            // FAQ functionality
            const faqQuestions = document.querySelectorAll('.faq-question');
            faqQuestions.forEach(question => {
                question.addEventListener('click', () => {
                    const answer = question.nextElementSibling;
                    const icon = question.querySelector('i');
                    
                    // Toggle current FAQ
                    if (answer.style.maxHeight) {
                        answer.style.maxHeight = null;
                        answer.style.padding = '0 20px';
                        icon.style.transform = 'rotate(0deg)';
                    } else {
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                        answer.style.padding = '20px';
                        icon.style.transform = 'rotate(180deg)';
                    }
                });
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
        // Live Stats Counter - FIXED
            const statNumbers = document.querySelectorAll('.live-stat-number[data-count]');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.dataset.count);
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateStat = () => {
                    current += increment;
                    if (current < target) {
                        stat.textContent = Math.floor(current).toLocaleString();
                        requestAnimationFrame(updateStat);
                    } else {
                        stat.textContent = target.toLocaleString();
                    }
                };
                
                // Start counting when element is in viewport
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            updateStat();
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1 });
                
                observer.observe(stat);
            });