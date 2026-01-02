    
        // Services Carousel
        const services = [
            {
                icon: 'fas fa-users',
                title: 'Social Media Reputation Management',
                description: 'Build and maintain a positive online presence across all platforms with 24/7 monitoring.'
            },
            {
                icon: 'fas fa-newspaper',
                title: 'Daily Campaign Updates & Graphics',
                description: 'Consistent, engaging content to keep your campaign top of mind with voters.'
            },
            {
                icon: 'fas fa-bullhorn',
                title: 'Voter Outreach Strategy',
                description: 'Targeted messaging to connect with different voter demographics and communities.'
            },
            {
                icon: 'fas fa-camera',
                title: 'Press & Event Coverage',
                description: 'Professional coverage of rallies, speeches, and public appearances with media coordination.'
            },
            {
                icon: 'fab fa-whatsapp',
                title: 'WhatsApp Broadcasting Setup',
                description: 'Automated messaging to reach voters directly on their phones with personalized updates.'
            },
            {
                icon: 'fas fa-shield-alt',
                title: 'Crisis Management',
                description: 'Rapid response strategies to protect your reputation during controversies and attacks.'
            },
            {
                icon: 'fas fa-video',
                title: 'Video Editing & Reels Creation',
                description: 'Compelling video content optimized for social media engagement and viral potential.'
            },
            {
                icon: 'fas fa-handshake',
                title: 'Influencer & Public Support Handling',
                description: 'Leverage endorsements from key community figures, celebrities, and influencers.'
            }
        ];

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

        // Carousel navigation functions
        function goToSlide(index) {
            currentSlide = index;
            const slideWidth = servicesTrack.children[0].offsetWidth;
            servicesTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
            
            // Update active dot
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

        // Political Testimonials Carousel
        const politicalTestimonials = [
            {
                text: "InfoGrip transformed my political campaign completely. My social media reach increased by 400% and we connected with voters like never before. Their team understands the nuances of political communication.",
                author: "Arvind Sharma",
                role: "MLA Candidate",
                location: "Uttar Pradesh",
                avatar: "AS"
            },
            {
                text: "As a female politician, I needed a team that understands gender-specific campaigning. InfoGrip created a powerful narrative that resonated with women voters. We won with a historic margin!",
                author: "Dr. Priya Singh",
                role: "MP Candidate",
                location: "Rajasthan",
                avatar: "PS"
            },
            {
                text: "The WhatsApp automation and daily content strategy helped us maintain constant voter contact. Our campaign ran like a well-oiled machine. Highly recommended for any serious political candidate.",
                author: "Rahul Verma",
                role: "Youth Leader",
                location: "Delhi",
                avatar: "RV"
            },
            {
                text: "During the election crisis, InfoGrip's rapid response team protected my reputation and turned the narrative in our favor. Their crisis management is exceptional for political campaigns.",
                author: "Sanjay Patel",
                role: "Municipal Corporator",
                location: "Gujarat",
                avatar: "SP"
            }
        ];

        const politicalTestimonialTrack = document.getElementById('political-testimonial-track');
        const politicalCarouselNav = document.getElementById('political-carousel-nav');
        let currentPoliticalSlide = 0;

        // Create political testimonial slides
        politicalTestimonials.forEach((testimonial, index) => {
            const slide = document.createElement('div');
            slide.className = 'testimonial-slide';
            slide.innerHTML = `
                <div class="testimonial-card">
                    <div class="testimonial-avatar">
                        <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--orange); color: var(--dark-blue); font-weight: bold; font-size: 1.5rem;">
                            ${testimonial.avatar}
                        </div>
                    </div>
                    <div class="testimonial-stars">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <p class="testimonial-text">"${testimonial.text}"</p>
                    <div class="testimonial-author">
                        <div class="testimonial-info">
                            <h4>${testimonial.author}</h4>
                            <p>${testimonial.role}, ${testimonial.location}</p>
                        </div>
                    </div>
                </div>
            `;
            politicalTestimonialTrack.appendChild(slide);

            // Create navigation dots
            const dot = document.createElement('div');
            dot.className = 'carousel-dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToPoliticalSlide(index);
            });
            politicalCarouselNav.appendChild(dot);
        });

        // Political carousel navigation functions
        function goToPoliticalSlide(index) {
            currentPoliticalSlide = index;
            politicalTestimonialTrack.style.transform = `translateX(-${currentPoliticalSlide * 100}%)`;
            
            // Update active dot
            document.querySelectorAll('#political-carousel-nav .carousel-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentPoliticalSlide);
            });
        }

        function nextPoliticalSlide() {
            currentPoliticalSlide = (currentPoliticalSlide + 1) % politicalTestimonials.length;
            goToPoliticalSlide(currentPoliticalSlide);
        }

        function prevPoliticalSlide() {
            currentPoliticalSlide = (currentPoliticalSlide - 1 + politicalTestimonials.length) % politicalTestimonials.length;
            goToPoliticalSlide(currentPoliticalSlide);
        }

        // Auto-advance political carousel
        let politicalCarouselInterval = setInterval(nextPoliticalSlide, 6000);

        // Add event listeners for arrow buttons
        document.querySelectorAll('.testimonial-carousel .carousel-arrow.prev')[0].addEventListener('click', () => {
            prevPoliticalSlide();
            resetPoliticalCarouselInterval();
        });
        
        document.querySelectorAll('.testimonial-carousel .carousel-arrow.next')[0].addEventListener('click', () => {
            nextPoliticalSlide();
            resetPoliticalCarouselInterval();
        });

        function resetPoliticalCarouselInterval() {
            clearInterval(politicalCarouselInterval);
            politicalCarouselInterval = setInterval(nextPoliticalSlide, 6000);
        }

        // Animated Counters
        function animateCounter(element, target, duration = 2000) {
            let start = 0;
            const increment = target / (duration / 16);
            const timer = setInterval(() => {
                start += increment;
                if (start >= target) {
                    element.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(start).toLocaleString();
                }
            }, 16);
        }

        // Initialize counters when in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(document.getElementById('campaigns-count'), 50);
                    animateCounter(document.getElementById('leaders-count'), 35);
                    animateCounter(document.getElementById('voters-reach'), 2500000);
                    animateCounter(document.getElementById('elections-count'), 75);
                    observer.unobserve(entry.target);
                }
            });
        });

        observer.observe(document.querySelector('.political-stats'));

        // Auto-typing text effect
        const typingText = document.getElementById('typing-text');
        const texts = ['Winning Campaigns', 'Digital Presence', 'Voter Connection', 'Political Legacy'];
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
                setTimeout(typeText, isDeleting ? 100 : 200);
            }
        }

        // Start typing effect
        typeText();

        // Download Brochure
        document.getElementById('download-brochure').addEventListener('click', function(e) {
            e.preventDefault();
            alert('Political Campaign Brochure download will start shortly. For now, please contact us for detailed information.');
            // In production, replace with actual download link
            // window.location.href = 'brochures/political-campaign-brochure.pdf';
        });

        document.getElementById('brochure-download').addEventListener('click', function(e) {
            e.preventDefault();
            alert('Political Strategy Kit download will start shortly. For now, please contact us for detailed information.');
        });

        // Scroll Animation
        const processObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe process steps for animation
        const processSteps = document.querySelectorAll('.process-step');
        processSteps.forEach(step => {
            processObserver.observe(step);
        });

        // Observe addon cards for animation
        const addonCards = document.querySelectorAll('.addon-card');
        const addonObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('in-view');
                    }, 100 * Array.from(addonCards).indexOf(entry.target));
                }
            });
        }, {
            threshold: 0.1
        });

        addonCards.forEach(card => {
            addonObserver.observe(card);
        });

        // Section fade-in on scroll
        const sections = document.querySelectorAll('section');

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, {
            threshold: 0.1
        });

        sections.forEach(section => {
            sectionObserver.observe(section);
        });

        // Chatbot Functionality
        const chatbotBtn = document.getElementById('chatbot-btn');
        const chatbotOverlay = document.getElementById('chatbot-overlay');
        const chatbotClose = document.getElementById('chatbot-close');

        chatbotBtn.addEventListener('click', () => {
            chatbotOverlay.classList.add('active');
        });

        chatbotClose.addEventListener('click', () => {
            chatbotOverlay.classList.remove('active');
        });

        // Close chatbot with ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                chatbotOverlay.classList.remove('active');
            }
        });

        // Enhanced Chatbot for Political Campaigning
        document.addEventListener('DOMContentLoaded', function() {
            const chatMessages = document.getElementById('chatMessages');
            const messageInput = document.getElementById('messageInput');
            const sendButton = document.getElementById('sendButton');
            const quickOptions = document.querySelectorAll('.quick-option');
            const languageOptions = document.querySelectorAll('.language-option');
            
            let selectedLanguage = 'english';
            let conversationContext = {
                currentTopic: null,
                previousQuestions: [],
                userType: null, // candidate, party-worker, supporter
                conversationDepth: 0
            };

            // Political campaign conversation database
            const politicalConversationDB = {
                greetings: {
                    patterns: ['hi', 'hello', 'hey', 'namaste', 'नमस्ते', 'प्रणाम'],
                    responses: {
                        english: [
                            "नमस्ते! 👋 I'm your political campaign assistant. How can I help you today?",
                            "Hello! Ready to build a winning political campaign? What can I assist with?",
                            "Hi! Great to connect with a future leader. What's on your mind?"
                        ],
                        hindi: [
                            "नमस्ते! 👋 मैं आपका राजनीतिक अभियान सहायक हूं। आज मैं आपकी क्या मदद कर सकता हूं?",
                            "हैलो! क्या आप एक जीतने वाला राजनीतिक अभियान बनाने के लिए तैयार हैं? मैं किस बात में सहायता कर सकता हूं?",
                            "हाय! भविष्य के नेता से जुड़कर अच्छा लगा। आप क्या सोच रहे हैं?"
                        ]
                    }
                },
                services: {
                    patterns: ['services', 'service', 'what do you offer', 'क्या सेवाएं', 'सेवाएं'],
                    responses: {
                        english: [
                            "We offer complete political campaign management including digital branding, social media management, voter outreach, crisis management, and real-time analytics. Which area interests you?",
                            "Our political services include campaign strategy, content creation, social media management, reputation protection, and election war room setup. What specific help do you need?"
                        ],
                        hindi: [
                            "हम पूर्ण राजनीतिक अभियान प्रबंधन प्रदान करते हैं जिसमें डिजिटल ब्रांडिंग, सोशल मीडिया प्रबंधन, मतदाता आउटरीच, संकट प्रबंधन और रीयल-टाइम विश्लेषण शामिल हैं। आपको किस क्षेत्र में रुचि है?",
                            "हमारी राजनीतिक सेवाओं में अभियान रणनीति, सामग्री निर्माण, सोशल मीडिया प्रबंधन, प्रतिष्ठा सुरक्षा और चुनाव वार रूम सेटअप शामिल हैं। आपको किस विशिष्ट मदद की आवश्यकता है?"
                        ]
                    }
                },
                pricing: {
                    patterns: ['price', 'cost', 'how much', 'कीमत', 'लागत', 'कितना'],
                    responses: {
                        english: [
                            "Political campaign pricing depends on scale, duration, and services needed. Basic social media management starts at ₹25,000/month, while complete campaign management ranges from ₹1-5 lakhs/month. Would you like a customized quote?",
                            "We offer flexible political campaign packages based on your budget and goals. Basic digital presence starts at ₹20,000, comprehensive campaigns from ₹75,000. Let me connect you with our campaign specialist."
                        ],
                        hindi: [
                            "राजनीतिक अभियान मूल्य निर्धारण पैमाने, अवधि और आवश्यक सेवाओं पर निर्भर करता है। बुनियादी सोशल मीडिया प्रबंधन ₹25,000/माह से शुरू होता है, जबकि पूर्ण अभियान प्रबंधन ₹1-5 लाख/माह तक होता है। क्या आप एक अनुकूलित उद्धरण चाहेंगे?",
                            "हम आपके बजट और लक्ष्यों के आधार पर लचीले राजनीतिक अभियान पैकेज प्रदान करते हैं। बुनियादी डिजिटल उपस्थिति ₹20,000 से शुरू होती है, व्यापक अभियान ₹75,000 से। मुझे आपको हमारे अभियान विशेषज्ञ से जोड़ने दें।"
                        ]
                    }
                },
                contact: {
                    patterns: ['contact', 'call', 'phone', 'meet', 'संपर्क', 'कॉल', 'मिलना'],
                    responses: {
                        english: [
                            "You can reach our political campaign team at +91 9928140288, email political@infogrip.com, or fill our political onboarding form. We offer free initial consultation for serious candidates.",
                            "Contact our campaign specialists at +91 9928140288. We're available 9 AM to 9 PM, 7 days a week during election seasons."
                        ],
                        hindi: [
                            "आप हमारी राजनीतिक अभियान टीम को +91 9928140288 पर, ईमेल political@infogrip.com पर, या हमारा राजनीतिक ऑनबोर्डिंग फॉर्म भरकर संपर्क कर सकते हैं। हम गंभीर उम्मीदवारों के लिए मुफ्त प्रारंभिक परामर्श प्रदान करते हैं।",
                            "हमारे अभियान विशेषज्ञों से +91 9928140288 पर संपर्क करें। हम चुनाव के मौसम के दौरान सप्ताह के 7 दिन, सुबह 9 बजे से रात 9 बजे तक उपलब्ध हैं।"
                        ]
                    }
                }
            };

            // Function to add a message to the chat
            function addMessage(text, isUser = false, isHTML = false) {
                const messageDiv = document.createElement('div');
                messageDiv.className = isUser ? 'message user-message' : 'message bot-message';
                
                const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                
                if (isHTML) {
                    messageDiv.innerHTML = text;
                } else {
                    messageDiv.innerHTML = `
                        ${text}
                        <div style="font-size: 0.7rem; opacity: 0.7; margin-top: 5px; text-align: right;">${timestamp}</div>
                    `;
                }
                
                chatMessages.appendChild(messageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }

            // Function to simulate typing
            function showTypingIndicator(minTime = 800, maxTime = 2000) {
                const typingDiv = document.createElement('div');
                typingDiv.className = 'typing-indicator';
                typingDiv.id = 'typingIndicator';
                typingDiv.innerHTML = `
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                `;
                chatMessages.appendChild(typingDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                return new Promise(resolve => {
                    setTimeout(resolve, Math.random() * (maxTime - minTime) + minTime);
                });
            }

            // Function to hide typing indicator
            function hideTypingIndicator() {
                const typingIndicator = document.getElementById('typingIndicator');
                if (typingIndicator) {
                    typingIndicator.remove();
                }
            }

            // Process user message
            function understandPoliticalIntent(message) {
                const lowerMessage = message.toLowerCase();
                
                // Update conversation context
                conversationContext.previousQuestions.push(lowerMessage);
                conversationContext.conversationDepth++;
                
                // Check for different intents
                for (const [category, data] of Object.entries(politicalConversationDB)) {
                    for (const pattern of data.patterns) {
                        if (lowerMessage.includes(pattern)) {
                            return {
                                type: category,
                                confidence: 0.9
                            };
                        }
                    }
                }
                
                // Check for specific political terms
                if (lowerMessage.includes('campaign') || lowerMessage.includes('election') || lowerMessage.includes('vote')) {
                    return {
                        type: 'campaign',
                        confidence: 0.8
                    };
                }
                
                if (lowerMessage.includes('social media') || lowerMessage.includes('facebook') || lowerMessage.includes('instagram')) {
                    return {
                        type: 'social',
                        confidence: 0.85
                    };
                }
                
                if (lowerMessage.includes('whatsapp') || lowerMessage.includes('broadcast')) {
                    return {
                        type: 'whatsapp',
                        confidence: 0.9
                    };
                }
                
                return {
                    type: 'general',
                    confidence: 0.5
                };
            }

            // Generate response
            function generatePoliticalResponse(intent, userMessage) {
                if (politicalConversationDB[intent.type]) {
                    const responses = politicalConversationDB[intent.type].responses[selectedLanguage];
                    return responses[Math.floor(Math.random() * responses.length)];
                }
                
                // Default responses for other intents
                const defaultResponses = {
                    campaign: {
                        english: "For political campaigns, we recommend starting at least 3-6 months before elections. Our team creates a comprehensive strategy including ground outreach, digital presence, and media management. Would you like to know more about our campaign packages?",
                        hindi: "राजनीतिक अभियानों के लिए, हम चुनाव से कम से कम 3-6 महीने पहले शुरू करने की सलाह देते हैं। हमारी टीम एक व्यापक रणनीति बनाती है जिसमें जमीनी आउटरीच, डिजिटल उपस्थिति और मीडिया प्रबंधन शामिल है। क्या आप हमारे अभियान पैकेजों के बारे में अधिक जानना चाहेंगे?"
                    },
                    social: {
                        english: "Political social media requires consistent posting, engagement with voters, and crisis monitoring. We manage 3-5 posts daily across platforms, with special focus during rallies and events. Our team handles both Hindi and English content.",
                        hindi: "राजनीतिक सोशल मीडिया के लिए लगातार पोस्टिंग, मतदाताओं के साथ जुड़ाव और संकट निगरानी की आवश्यकता होती है। हम प्लेटफॉर्म पर प्रतिदिन 3-5 पोस्ट प्रबंधित करते हैं, रैलियों और कार्यक्रमों के दौरान विशेष ध्यान देते हैं। हमारी टीम हिंदी और अंग्रेजी दोनों सामग्री को संभालती है।"
                    },
                    whatsapp: {
                        english: "WhatsApp is crucial for political campaigns. We set up automated broadcasts, group management, and personal messaging systems. Our typical political WhatsApp strategy reaches 85-95% of voters in a constituency.",
                        hindi: "राजनीतिक अभियानों के लिए व्हाट्सएप महत्वपूर्ण है। हम स्वचालित प्रसारण, समूह प्रबंधन और व्यक्तिगत मैसेजिंग सिस्टम स्थापित करते हैं। हमारी विशिष्ट राजनीतिक व्हाट्सएप रणनीति एक निर्वाचन क्षेत्र में 85-95% मतदाताओं तक पहुंचती है।"
                    },
                    general: {
                        english: "I specialize in political campaign assistance. You can ask me about campaign strategy, social media for politicians, voter outreach, crisis management, or pricing. What specific aspect of political campaigning interests you?",
                        hindi: "मैं राजनीतिक अभियान सहायता में विशेषज्ञता रखता हूं। आप मुझसे अभियान रणनीति, राजनेताओं के लिए सोशल मीडिया, मतदाता आउटरीच, संकट प्रबंधन, या मूल्य निर्धारण के बारे में पूछ सकते हैं। राजनीतिक अभियान का कौन सा विशिष्ट पहलू आपको रुचिकर लगता है?"
                    }
                };
                
                if (defaultResponses[intent.type]) {
                    return defaultResponses[intent.type][selectedLanguage];
                }
                
                return selectedLanguage === 'english' 
                    ? "I'm here to help with political campaign queries. Could you rephrase your question about campaigning, or ask about our specific political services?"
                    : "मैं राजनीतिक अभियान प्रश्नों में मदद करने के लिए यहां हूं। क्या आप अपना प्रश्न अभियान के बारे में फिर से बना सकते हैं, या हमारी विशिष्ट राजनीतिक सेवाओं के बारे में पूछ सकते हैं?";
            }

            // Process user message with typing simulation
            async function processUserMessage(message) {
                // Add user message
                addMessage(message, true);
                messageInput.value = '';
                
                // Show typing with delay
                await showTypingIndicator();
                hideTypingIndicator();
                
                // Understand intent and generate response
                const intent = understandPoliticalIntent(message);
                let response = generatePoliticalResponse(intent, message);
                
                // Add action buttons for specific intents
                if (intent.type === 'pricing' || intent.type === 'contact' || conversationContext.conversationDepth > 2) {
                    const actionButtons = `
                        <div class="action-buttons">
                            <button class="action-btn" onclick="window.open('onboarding.html', '_blank')">
                                <i class="fas fa-file-alt"></i> Fill Political Form
                            </button>
                            <button class="action-btn" onclick="window.open('tel:+919928140288')">
                                <i class="fas fa-phone"></i> Call Campaign Team
                            </button>
                            <button class="action-btn" onclick="window.open('https://wa.me/919928140288', '_blank')">
                                <i class="fab fa-whatsapp"></i> WhatsApp
                            </button>
                        </div>
                    `;
                    response += actionButtons;
                    addMessage(response, false, true);
                } else {
                    addMessage(response);
                }
                
                // Update conversation context
                conversationContext.currentTopic = intent.type;
            }

            // Event listeners for language selection
            languageOptions.forEach(option => {
                option.addEventListener('click', function() {
                    selectedLanguage = this.getAttribute('data-lang');
                    
                    // Remove language options
                    document.querySelectorAll('.language-option').forEach(opt => {
                        opt.remove();
                    });
                    
                    // Update message
                    const messageDiv = document.querySelector('.bot-message');
                    const greeting = selectedLanguage === 'english' 
                        ? "Great! Let's continue in English. I'm here to help with your political campaign needs. What would you like to know?" 
                        : "बढ़िया! हिंदी में बातचीत जारी रखते हैं। मैं आपकी राजनीतिक अभियान आवश्यकताओं में मदद करने के लिए यहां हूं। आप क्या जानना चाहेंगे?";
                    
                    messageDiv.innerHTML = `
                        <p>${greeting}</p>
                        <div style="font-size: 0.7rem; opacity: 0.7; margin-top: 5px; text-align: right;">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    `;
                });
            });

            // Event listeners for quick options
            quickOptions.forEach(button => {
                button.addEventListener('click', function() {
                    const action = this.getAttribute('data-action');
                    let message = '';
                    
                    switch(action) {
                        case 'political-services':
                            message = selectedLanguage === 'english' 
                                ? "What political campaign services do you offer?" 
                                : "आप कौन सी राजनीतिक अभियान सेवाएं प्रदान करते हैं?";
                            break;
                        case 'campaign-pricing':
                            message = selectedLanguage === 'english' 
                                ? "What are your prices for political campaigns?" 
                                : "राजनीतिक अभियानों के लिए आपकी कीमतें क्या हैं?";
                            break;
                        case 'political-portfolio':
                            message = selectedLanguage === 'english' 
                                ? "Can I see examples of your political work?" 
                                : "क्या मैं आपके राजनीतिक काम के उदाहरण देख सकता हूं?";
                            break;
                        case 'contact-campaign':
                            message = selectedLanguage === 'english' 
                                ? "How can I contact your political campaign team?" 
                                : "मैं आपकी राजनीतिक अभियान टीम से कैसे संपर्क कर सकता हूं?";
                            break;
                    }
                    
                    processUserMessage(message);
                });
            });

            // Event listeners for input
            sendButton.addEventListener('click', () => {
                const message = messageInput.value.trim();
                if (message) {
                    processUserMessage(message);
                }
            });

            messageInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    const message = messageInput.value.trim();
                    if (message) {
                        processUserMessage(message);
                    }
                }
            });
        });
