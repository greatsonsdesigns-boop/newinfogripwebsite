document.addEventListener('DOMContentLoaded', function() {
            // Auto-typing effect for hero section
            const autoTypeElement = document.getElementById('auto-type');
            const phrases = [
                "Strategic Digital Campaigns",
                "Voter Outreach & Engagement",
                "Political Brand Building",
                "Election Success Planning",
                "Multi-State Campaigns"
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
            
            // States Carousel
            const statesData = [
                {
                    name: "Rajasthan",
                    hindiName: "राजस्थान",
                    icon: "fas fa-fort-awesome",
                    href: "political-marketing-rajasthan.html",
                    description: "Localized strategies for Rajputana political culture and desert demographics"
                },
                {
                    name: "Uttar Pradesh",
                    hindiName: "उत्तर प्रदेश",
                    icon: "fas fa-users",
                    href: "political-marketing-uttar-pradesh.html",
                    description: "High-density voter outreach strategies for India's most populous state"
                },
                {
                    name: "Madhya Pradesh",
                    hindiName: "मध्य प्रदेश",
                    icon: "fas fa-mountain",
                    href: "political-marketing-madhya-pradesh.html",
                    description: "Balanced strategies for tribal and urban voter segments"
                },
                {
                    name: "Haryana",
                    hindiName: "हरियाणा",
                    icon: "fas fa-tractor",
                    href: "political-marketing-haryana.html",
                    description: "Agricultural and industrial voter focus with Jat demographic expertise"
                },
                {
                    name: "Gujarat",
                    hindiName: "गुजरात",
                    icon: "fas fa-industry",
                    href: "political-marketing-gujarat.html",
                    description: "Business-oriented political strategies for industrial regions"
                },
                {
                    name: "Bihar",
                    hindiName: "बिहार",
                    icon: "fas fa-graduation-cap",
                    href: "political-marketing-bihar.html",
                    description: "Youth-focused campaigns for India's youngest demographic state"
                }
            ];
            
            const statesTrack = document.getElementById('states-track');
            const statesDots = document.getElementById('states-dots');
            let currentStateSlide = 0;
            let statesPerView = 3;
            let autoSlideInterval;
            
            // Update states per view based on screen size
            function updateStatesPerView() {
                if (window.innerWidth <= 768) {
                    statesPerView = 1;
                } else if (window.innerWidth <= 1024) {
                    statesPerView = 2;
                } else {
                    statesPerView = 3;
                }
                updateStatesCarousel();
            }
            
            // Create states carousel
            function createStatesCarousel() {
                statesTrack.innerHTML = '';
                statesDots.innerHTML = '';
                
                statesData.forEach((state, index) => {
                    const card = document.createElement('a');
                    card.className = 'state-card';
                    card.href = state.href;
                    card.innerHTML = `
                        <div class="state-icon">
                            <i class="${state.icon}"></i>
                        </div>
                        <h3>${state.name}</h3>
                        <p class="hindi-text" style="color: var(--blue); margin-bottom: 10px;">${state.hindiName}</p>
                        <p style="color: var(--text-color); font-size: 0.95rem;">${state.description}</p>
                        <div style="margin-top: 15px;">
                            <span style="color: var(--blue); font-weight: 600; font-size: 0.9rem;">
                                Explore Strategy <i class="fas fa-arrow-right"></i>
                            </span>
                        </div>
                    `;
                    statesTrack.appendChild(card);
                    
                    // Create dot
                    const dot = document.createElement('button');
                    dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
                    dot.addEventListener('click', () => goToStateSlide(index));
                    statesDots.appendChild(dot);
                });
                
                updateStatesCarousel();
                startAutoSlide();
            }
            
            function updateStatesCarousel() {
                if (!statesTrack.children.length) return;
                
                // Get the width of one card including gap
                const cardStyle = window.getComputedStyle(statesTrack.children[0]);
                const cardWidth = statesTrack.children[0].offsetWidth + 
                                 parseFloat(cardStyle.marginLeft || 0) + 
                                 parseFloat(cardStyle.marginRight || 0) +
                                 25; // gap
                
                const maxSlide = Math.max(0, statesData.length - statesPerView);
                
                // Ensure currentStateSlide is within bounds
                currentStateSlide = Math.max(0, Math.min(currentStateSlide, maxSlide));
                
                statesTrack.style.transform = `translateX(-${currentStateSlide * cardWidth}px)`;
                
                // Update dots
                const dots = document.querySelectorAll('#states-dots .carousel-dot');
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentStateSlide);
                });
            }
            
            function goToStateSlide(index) {
                const maxSlide = Math.max(0, statesData.length - statesPerView);
                currentStateSlide = Math.max(0, Math.min(index, maxSlide));
                updateStatesCarousel();
                resetAutoSlide();
            }
            
            function nextStateSlide() {
                const maxSlide = Math.max(0, statesData.length - statesPerView);
                if (currentStateSlide < maxSlide) {
                    goToStateSlide(currentStateSlide + 1);
                } else {
                    goToStateSlide(0);
                }
            }
            
            function startAutoSlide() {
                autoSlideInterval = setInterval(nextStateSlide, 4000);
            }
            
            function resetAutoSlide() {
                clearInterval(autoSlideInterval);
                startAutoSlide();
            }
            
            // Navigation buttons
            document.getElementById('states-prev').addEventListener('click', () => {
                if (currentStateSlide > 0) {
                    goToStateSlide(currentStateSlide - 1);
                } else {
                    const maxSlide = Math.max(0, statesData.length - statesPerView);
                    goToStateSlide(maxSlide);
                }
            });
            
            document.getElementById('states-next').addEventListener('click', () => {
                nextStateSlide();
            });
            
            // Pause auto-slide on hover
            statesTrack.addEventListener('mouseenter', () => {
                clearInterval(autoSlideInterval);
            });
            
            statesTrack.addEventListener('mouseleave', () => {
                startAutoSlide();
            });
            
            // Initialize carousel
            createStatesCarousel();
            updateStatesPerView();
            
            // Handle window resize
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    updateStatesPerView();
                    setTimeout(updateStatesCarousel, 100);
                }, 250);
            });
            
            // Impact Calculator - COMPLETELY FIXED
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
            
            // Calculate function
            function updateCalculator() {
                const budget = parseInt(budgetSlider.value);
                const duration = parseInt(durationSlider.value);
                const region = regionSelect.value;
                
                // Update displayed values
                budgetValue.textContent = '₹' + budget.toLocaleString();
                durationValue.textContent = duration + ' Month' + (duration > 1 ? 's' : '');
                
                // Region multipliers
                const multipliers = {
                    'north': 1.5,
                    'south': 1.3,
                    'east': 1.2,
                    'west': 1.4,
                    'pan': 2.0
                };
                
                const baseMultiplier = multipliers[region] || 1.5;
                
                // Calculate estimated reach (simple formula)
                const estimated = Math.round((budget * duration * baseMultiplier) / 10);
                
                // Calculate engagement rate (8-12% range)
                const engagement = (8 + Math.random() * 4).toFixed(1);
                
                // Calculate cost per voter (₹2-4 range)
                const cost = (2 + Math.random() * 2).toFixed(1);
                
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
                
                this.innerHTML = '<i class="fas fa-check"></i> Strategy Calculated!';
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
            
            // Bottom Hindi Popup - FIXED
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
            
            // Fix for statistics section alignment
            const statsSection = document.querySelector('.stats-highlight');
            if (statsSection) {
                statsSection.style.textAlign = 'center';
                statsSection.querySelector('.container').style.display = 'flex';
                statsSection.querySelector('.container').style.flexDirection = 'column';
                statsSection.querySelector('.container').style.alignItems = 'center';
            }
        });