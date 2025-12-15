// Initialize only on homepage
if (document.querySelector('.hero')) {
    
    // Custom Cursor
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    // Only initialize cursor on non-mobile devices
    if (window.innerWidth > 768 && cursor && cursorFollower) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            setTimeout(() => {
                cursorFollower.style.left = e.clientX + 'px';
                cursorFollower.style.top = e.clientY + 'px';
            }, 100);
        });
        
        // Add hover effects for buttons and links
        const interactiveElements = document.querySelectorAll('button, a, .btn, .service-card, .feature-card, .faq-question');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                cursorFollower.classList.add('hover');
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursorFollower.classList.remove('hover');
            });
        });
        
        // Add text hover effect
        const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, li');
        
        textElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('text-hover');
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('text-hover');
            });
        });
    }
      
    // Auto-typing text effect
    const words = [
  "Online",
  "Digitally",
  "Everywhere",
  "With Strategy",
  "With AI",
];

let wordIndex = 0;
let letterIndex = 0;
let isDeleting = false;

const typingText = document.getElementById("typing-text");

function startTyping() {
  const currentWord = words[wordIndex];

  if (!isDeleting) {
    // Typing
    typingText.textContent = currentWord.substring(0, letterIndex + 1);
    letterIndex++;

    if (letterIndex === currentWord.length) {
      setTimeout(() => (isDeleting = true), 1200);
    }
  } else {
    // Deleting
    typingText.textContent = currentWord.substring(0, letterIndex - 1);
    letterIndex--;

    if (letterIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }

  const speed = isDeleting ? 40 : 60;
  setTimeout(startTyping, speed);
}

window.addEventListener("DOMContentLoaded", startTyping);
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // Popup - Close when clicking on overlay or X button
    const popup = document.getElementById('popup');
    const popupClose = document.getElementById('popup-close');
    
    if (popup && popupClose) {
        // Show popup on page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                popup.classList.add('active');
            }, 1000);
        });
        
        // Close popup when clicking X
        popupClose.addEventListener('click', () => {
            popup.classList.remove('active');
        });
        
        // Close popup when clicking on overlay
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.classList.remove('active');
            }
        });
        
        // Show popup again after scrolling 40% down
        window.addEventListener('scroll', () => {
            const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            
            if (scrollPercentage > 40 && !popup.classList.contains('active') && !sessionStorage.getItem('popupShown')) {
                popup.classList.add('active');
                sessionStorage.setItem('popupShown', 'true');
            }
        });
    }
    
    // Chatbot Functionality
    const chatbotBtn = document.getElementById('chatbot-btn');
    const chatbotOverlay = document.getElementById('chatbot-overlay');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotOpen = document.getElementById('chatbot-open');
    
    if (chatbotBtn && chatbotOverlay && chatbotClose && chatbotOpen) {
        chatbotBtn.addEventListener('click', () => {
            chatbotOverlay.classList.add('active');
        });
        
        chatbotOpen.addEventListener('click', (e) => {
            e.preventDefault();
            chatbotOverlay.classList.add('active');
        });
        
        chatbotClose.addEventListener('click', () => {
            chatbotOverlay.classList.remove('active');
        });
        
        // Close chatbot with ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && chatbotOverlay.classList.contains('active')) {
                chatbotOverlay.classList.remove('active');
            }
        });
    }
    
    // Enhanced Chatbot Functionality
    document.addEventListener('DOMContentLoaded', function() {
        const chatMessages = document.getElementById('chatMessages');
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        const quickOptions = document.querySelectorAll('.quick-option');
        const languageOptions = document.querySelectorAll('.language-option');
        
        if (!chatMessages) return;
        
        let selectedLanguage = 'english';
        let userName = null;
        let userBusiness = null;
        let conversationContext = {
            currentTopic: null,
            previousQuestions: [],
            userMood: 'neutral',
            conversationDepth: 0
        };
        
        // Advanced conversation database
        const conversationDB = {
            greetings: {
                patterns: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
                responses: {
                    english: [
                        "Hey there! 👋 How can I help you today?",
                        "Hello! Great to see you here. What's on your mind?",
                        "Hi! Ready to boost your business? What can I assist with?",
                        "Hey! Lovely to chat with you. How can I help?"
                    ],
                    hindi: [
                        "नमस्ते! 👋 आज मैं आपकी क्या मदद कर सकता हूं?",
                        "हैलो! आपको यहां देखकर बहुत अच्छा लगा। आप क्या जानना चाहते हैं?",
                        "हाय! अपने व्यवसाय को बढ़ाने के लिए तैयार? मैं आपकी क्या सहायता कर सकता हूं?",
                        "अरे! आपसे बात करके अच्छा लगा। मैं कैसे मदद कर सकता हूं?"
                    ]
                }
            },
            howAreYou: {
                patterns: ['how are you', "how's it going", "how do you do", "what's up"],
                responses: {
                    english: [
                        "I'm doing great, thanks for asking! 😊 Just here helping businesses grow. How about you?",
                        "Doing wonderful! Helping clients with their marketing always puts me in a good mood. How are things on your end?",
                        "I'm fantastic! Been having some great conversations about business growth today. How are you doing?"
                    ],
                    hindi: [
                        "मैं बहुत अच्छा कर रहा हूं, पूछने के लिए धन्यवाद! 😊 बस यहां व्यवसायों को बढ़ने में मदद कर रहा हूं। आप कैसे हैं?",
                        "बहुत अच्छा कर रहा हूं! ग्राहकों को उनकी मार्केटिंग में मदद करना हमेशा मुझे अच्छे मूड में रखता है। आपके यहां चीजें कैसी चल रही हैं?",
                        "मैं शानदार हूं! आज व्यवसाय विकास के बारे में कुछ शानदार बातचीत हो रही है। आप कैसे हैं?"
                    ]
                }
            },
            thanks: {
                patterns: ['thanks', 'thank you', 'appreciate it', 'thx'],
                responses: {
                    english: [
                        "You're very welcome! 😊 Happy to help.",
                        "My pleasure! Is there anything else you'd like to know?",
                        "Anytime! Let me know if you need more information."
                    ],
                    hindi: [
                        "आपका स्वागत है! 😊 मदद करके खुशी हुई।",
                        "मेरी खुशी! क्या आप कुछ और जानना चाहेंगे?",
                        "कभी भी! अगर आपको और जानकारी चाहिए तो मुझे बताएं।"
                    ]
                }
            },
            compliments: {
                patterns: ['good bot', 'you are helpful', 'you are smart', 'awesome', 'great help'],
                responses: {
                    english: [
                        "Aww, thanks! I'm just doing my best to help. 😊",
                        "That means a lot! I'm here to make your life easier.",
                        "Thank you! I'm constantly learning to be more helpful."
                    ],
                    hindi: [
                        "अरे, धन्यवाद! मैं बस मदद करने की पूरी कोशिश कर रहा हूं। 😊",
                        "इसका मतलब बहुत कुछ है! मैं आपकी जिंदगी आसान बनाने के लिए यहां हूं।",
                        "धन्यवाद! मैं लगातार अधिक मददगार बनने के लिए सीख रहा हूं।"
                    ]
                }
            },
            smallTalk: {
                patterns: ['weather', 'weekend', 'day', 'today'],
                responses: {
                    english: [
                        "I'm focused on helping businesses grow, but I hope you're having a great day! 😊",
                        "As a bot, every day is a good day for helping entrepreneurs! How's your day going?",
                        "I don't experience time like humans do, but I'm here whenever you need me!"
                    ],
                    hindi: [
                        "मैं व्यवसायों को बढ़ने में मदद करने पर केंद्रित हूं, लेकिन मुझे आशा है कि आपका दिन अच्छा चल रहा है! 😊",
                        "एक बॉट के रूप में, उद्यमियों की मदद करने के लिए हर दिन एक अच्छा दिन है! आपका दिन कैसा चल रहा है?",
                        "मैं मनुष्यों की तरह समय का अनुभव नहीं करता, लेकिन जब भी आपको मेरी जरूरत हो, मैं यहां हूं!"
                    ]
                }
            }
        };
        
        // Advanced service knowledge base
        const knowledgeBase = {
            services: {
                socialMedia: {
                    description: {
                        english: "We create engaging content that actually converts followers into customers",
                        hindi: "हम आकर्षक सामग्री बनाते हैं जो वास्तव में अनुयायियों को ग्राहकों में बदल देती है"
                    },
                    benefits: {
                        english: ["3-5x more engagement", "Consistent brand voice", "Data-driven strategy"],
                        hindi: ["3-5x अधिक जुड़ाव", "सुसंगत ब्रांड आवाज", "डेटा-संचालित रणनीति"]
                    },
                    questions: {
                        'how often': {
                            english: "We recommend 3-5 posts per week for optimal engagement",
                            hindi: "इष्टतम जुड़ाव के लिए हम प्रति सप्ताह 3-5 पोस्ट की सलाह देते हैं"
                        },
                        'content types': {
                            english: "We create reels, stories, carousels, and engaging static posts",
                            hindi: "हम रील्स, स्टोरीज़, कैरोसेल और आकर्षक स्थिर पोस्ट बनाते हैं"
                        },
                        'platforms': {
                            english: "We specialize in Instagram, Facebook, LinkedIn, and Twitter",
                            hindi: "हम इंस्टाग्राम, फेसबुक, लिंक्डइन और ट्विटर में माहिर हैं"
                        }
                    }
                },
                website: {
                    description: {
                        english: "Fast, beautiful websites that convert visitors into leads",
                        hindi: "तेज, सुंदर वेबसाइटें जो आगंतुकों को लीड में बदल देती हैं"
                    },
                    benefits: {
                        english: ["Mobile-optimized", "SEO-friendly", "Lightning fast"],
                        hindi: ["मोबाइल-अनुकूलित", "एसईओ-अनुकूल", "बिजली की तरह तेज"]
                    },
                    questions: {
                        'timeline': {
                            english: "Typically 2-4 weeks depending on complexity",
                            hindi: "जटिलता के आधार पर आमतौर पर 2-4 सप्ताह"
                        },
                        'cost': {
                            english: "Starts at ₹15,000 for basic sites, up to ₹50,000+ for e-commerce",
                            hindi: "बुनियादी साइटों के लिए ₹15,000 से शुरू, ई-कॉमर्स के लिए ₹50,000+ तक"
                        },
                        'hosting': {
                            english: "We provide managed hosting with 99.9% uptime",
                            hindi: "हम 99.9% अपटाइम के साथ प्रबंधित होस्टिंग प्रदान करते हैं"
                        }
                    }
                },
                ads: {
                    description: {
                        english: "Targeted advertising that gets real results, not just clicks",
                        hindi: "लक्षित विज्ञापन जो वास्तविक परिणाम प्राप्त करते हैं, न कि केवल क्लिक"
                    },
                    benefits: {
                        english: ["Lead generation focused", "ROI tracking", "A/B testing"],
                        hindi: ["लीड जनरेशन पर केंद्रित", "आरओआई ट्रैकिंग", "ए/बी परीक्षण"]
                    },
                    questions: {
                        'budget': {
                            english: "We recommend starting with ₹5,000-10,000/month for testing",
                            hindi: "हम परीक्षण के लिए ₹5,000-10,000/माह से शुरू करने की सलाह देते हैं"
                        },
                        'platforms': {
                            english: "Facebook, Instagram, Google Ads, and LinkedIn",
                            hindi: "फेसबुक, इंस्टाग्राम, गूगल ऐड्स और लिंक्डइन"
                        },
                        'results': {
                            english: "Most clients see 3-5x return on ad spend",
                            hindi: "अधिकांश ग्राहकों को विज्ञापन खर्च पर 3-5x रिटर्न दिखता है"
                        }
                    }
                }
            },
            commonQuestions: {
                'how long': {
                    english: "It depends on the service! Social media usually shows results in 2-3 months, websites in 2-4 weeks, and ads can show results in days.",
                    hindi: "यह सेवा पर निर्भर करता है! सोशल मीडिया आमतौर पर 2-3 महीने में परिणाम दिखाता है, वेबसाइटें 2-4 सप्ताह में, और विज्ञापन दिनों में परिणाम दिखा सकते हैं।"
                },
                'how much': {
                    english: "Our pricing is customized based on your needs. Social media starts at ₹8,000/month, websites from ₹15,000, and ads management from ₹5,000/month.",
                    hindi: "हमारी कीमतें आपकी जरूरतों के आधार पर अनुकूलित हैं। सोशल मीडिया ₹8,000/माह से शुरू, वेबसाइटें ₹15,000 से, और विज्ञापन प्रबंधन ₹5,000/माह से।"
                },
                'why choose': {
                    english: "We focus on results, not just deliverables. We become your marketing partner and care about your business growth as much as you do!",
                    hindi: "हम परिणामों पर ध्यान केंद्रित करते हैं, न कि केवल डिलिवरेबल्स पर। हम आपके मार्केटिंग पार्टनर बन जाते हैं और आपके व्यवसाय की वृद्धि की परवाह करते हैं जितना आप करते हैं!"
                },
                'experience': {
                    english: "We've worked with 50+ clients across industries - from restaurants to politicians to e-commerce stores.",
                    hindi: "हमने 50+ ग्राहकों के साथ काम किया है - रेस्तरां से लेकर राजनेताओं तक और ई-कॉमर्स स्टोर तक।"
                },
                'process': {
                    english: "We start with understanding your goals, then create a custom strategy, execute with excellence, and track results continuously.",
                    hindi: "हम आपके लक्ष्यों को समझने से शुरू करते हैं, फिर एक कस्टम रणनीति बनाते हैं, उत्कृष्टता के साथ निष्पादित करते हैं, और परिणामों को लगातार ट्रैक करते हैं।"
                },
                'contact': {
                    english: "You can reach us at +91 6367556906, email info@infogrip.com, or fill out our onboarding form at infogrip.com/onboarding.html",
                    hindi: "आप हमें +91 6367556906 पर, ईमेल info@infogrip.com पर, या infogrip.com/onboarding.html पर हमारा ऑनबोर्डिंग फॉर्म भरकर संपर्क कर सकते हैं"
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
                    <div class="timestamp">${timestamp}</div>
                `;
            }
            
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        // Function to simulate human typing with variable delays
        function showTypingIndicator(minTime = 1000, maxTime = 3000) {
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
        
        // Advanced natural language processing
        function understandIntent(message) {
            const lowerMessage = message.toLowerCase();
            
            // Update conversation context
            conversationContext.previousQuestions.push(lowerMessage);
            conversationContext.conversationDepth++;
            
            // Check for greetings and small talk first
            for (const [category, data] of Object.entries(conversationDB)) {
                for (const pattern of data.patterns) {
                    if (lowerMessage.includes(pattern)) {
                        return {
                            type: 'conversation',
                            category: category,
                            confidence: 0.9
                        };
                    }
                }
            }
            
            // Check for service-related questions
            if (lowerMessage.includes('social media') || lowerMessage.includes('instagram') || lowerMessage.includes('facebook')) {
                return {
                    type: 'service',
                    service: 'socialMedia',
                    confidence: 0.95
                };
            }
            
            if (lowerMessage.includes('website') || lowerMessage.includes('web') || lowerMessage.includes('site')) {
                return {
                    type: 'service',
                    service: 'website',
                    confidence: 0.95
                };
            }
            
            if (lowerMessage.includes('ad') || lowerMessage.includes('ads') || lowerMessage.includes('advertising')) {
                return {
                    type: 'service',
                    service: 'ads',
                    confidence: 0.95
                };
            }
            
            // Check for common questions
            for (const [question, answer] of Object.entries(knowledgeBase.commonQuestions)) {
                if (lowerMessage.includes(question)) {
                    return {
                        type: 'commonQuestion',
                        question: question,
                        confidence: 0.8
                    };
                }
            }
            
            // Check for onboarding intent
            if (lowerMessage.includes('onboarding') || lowerMessage.includes('form') || lowerMessage.includes('get started') || lowerMessage.includes('sign up')) {
                return {
                    type: 'onboarding',
                    confidence: 0.9
                };
            }
            
            // Check for contact intent
            if (lowerMessage.includes('contact') || lowerMessage.includes('call') || lowerMessage.includes('phone') || lowerMessage.includes('email')) {
                return {
                    type: 'contact',
                    confidence: 0.9
                };
            }
            
            // Default to general inquiry
            return {
                type: 'general',
                confidence: 0.5
            };
        }
        
        // Generate human-like response
        function generateResponse(intent, userMessage) {
            const lowerMessage = userMessage.toLowerCase();
            
            switch (intent.type) {
                case 'conversation':
                    const responses = conversationDB[intent.category].responses[selectedLanguage];
                    return responses[Math.floor(Math.random() * responses.length)];
                    
                case 'service':
                    const service = knowledgeBase.services[intent.service];
                    let response = selectedLanguage === 'english' 
                        ? `For ${intent.service.replace(/([A-Z])/g, ' $1').toLowerCase()}, ${service.description.english}. `
                        : `${intent.service.replace(/([A-Z])/g, ' $1').toLowerCase()} के लिए, ${service.description.hindi}. `;
                    
                    // Add relevant benefits
                    const benefits = service.benefits[selectedLanguage];
                    response += selectedLanguage === 'english'
                        ? `You'll get ${benefits.join(', ')}. `
                        : `आपको ${benefits.join(', ')} मिलेगा। `;
                    
                    // Ask engaging follow-up question
                    const followUps = {
                        english: [
                            "What specific goals are you trying to achieve?",
                            "How's your current presence in this area?",
                            "What's your timeline for getting started?"
                        ],
                        hindi: [
                            "आप कौन से विशिष्ट लक्ष्य हासिल करने की कोशिश कर रहे हैं?",
                            "इस क्षेत्र में आपकी वर्तमान उपस्थिति कैसी है?",
                            "शुरुआत करने के लिए आपकी समयसीमा क्या है?"
                        ]
                    };
                    response += followUps[selectedLanguage][Math.floor(Math.random() * followUps[selectedLanguage].length)];
                    
                    return response;
                    
                case 'commonQuestion':
                    return knowledgeBase.commonQuestions[intent.question][selectedLanguage];
                    
                case 'onboarding':
                    const onboardingResponse = {
                        english: "Great! I'd love to help you get started. Our onboarding process is simple and helps us understand your business needs better. Would you like me to direct you to our onboarding form?",
                        hindi: "बढ़िया! मैं आपकी शुरुआत में मदद करना चाहूंगा। हमारी ऑनबोर्डिंग प्रक्रिया सरल है और हमें आपकी व्यावसायिक आवश्यकताओं को बेहतर ढंग से समझने में मदद करती है। क्या आप चाहेंगे कि मैं आपको हमारे ऑनबोर्डिंग फॉर्म पर निर्देशित करूं?"
                    };
                    return onboardingResponse[selectedLanguage];
                    
                case 'contact':
                    const contactResponse = {
                        english: "You can reach us at +91 6367556906, email info@infogrip.com, or fill out our onboarding form. We'd love to hear from you!",
                        hindi: "आप हमें +91 6367556906 पर, ईमेल info@infogrip.com पर, या हमारा ऑनबोर्डिंग फॉर्म भरकर संपर्क कर सकते हैं। हम आपसे सुनकर खुश होंगे!"
                    };
                    return contactResponse[selectedLanguage];
                    
                case 'general':
                    if (lowerMessage.includes('?')) {
                        const generalResponse = {
                            english: "That's an interesting question! While I specialize in marketing services, I'd be happy to connect you with our team who can give you a detailed answer. Is there anything specific about our services you'd like to know?",
                            hindi: "यह एक दिलचस्प सवाल है! हालांकि मैं मार्केटिंग सेवाओं में माहिर हूं, मैं आपको हमारी टीम से जोड़कर खुश होऊंगा जो आपको विस्तृत जवाब दे सकती है। क्या हमारी सेवाओं के बारे में कुछ विशिष्ट है जो आप जानना चाहेंगे?"
                        };
                        return generalResponse[selectedLanguage];
                    } else {
                        const generalResponse2 = {
                            english: "Thanks for sharing that! I'm here to help with your marketing needs. Would you like to know about our services, pricing, or see some examples of our work?",
                            hindi: "यह साझा करने के लिए धन्यवाद! मैं आपकी मार्केटिंग आवश्यकताओं में मदद करने के लिए यहां हूं। क्या आप हमारी सेवाओं, मूल्य निर्धारण के बारे में जानना चाहेंगे, या हमारे काम के कुछ उदाहरण देखना चाहेंगे?"
                        };
                        return generalResponse2[selectedLanguage];
                    }
            }
        }
        
        // Add action buttons to the chat
        function addActionButtons() {
            const buttonsHTML = `
                <div class="action-buttons">
                    <button class="action-btn" onclick="window.open('onboarding.html', '_blank')">
                        <i class="fas fa-file-alt"></i> Fill Onboarding Form
                    </button>
                    <button class="action-btn" onclick="window.open('tel:+916367556906')">
                        <i class="fas fa-phone"></i> Call Us
                    </button>
                    <button class="action-btn" onclick="window.open('https://wa.me/916367556906', '_blank')">
                        <i class="fab fa-whatsapp"></i> WhatsApp
                    </button>
                </div>
            `;
            return buttonsHTML;
        }
        
        // Advanced conversation flow
        async function processUserMessage(message) {
            // Add user message
            addMessage(message, true);
            messageInput.value = '';
            
            // Show typing with human-like delay
            await showTypingIndicator(800, 2500);
            hideTypingIndicator();
            
            // Understand user intent
            const intent = understandIntent(message);
            
            // Generate response
            let response = generateResponse(intent, message);
            
            // Add action buttons for specific intents
            if (intent.type === 'onboarding' || intent.type === 'contact' || conversationContext.conversationDepth > 3) {
                response += addActionButtons();
                addMessage(response, false, true);
            } else {
                addMessage(response);
            }
            
            // Update conversation context
            conversationContext.currentTopic = intent.type === 'service' ? intent.service : intent.type;
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
                    ? "Great! Let's continue in English." 
                    : "बढ़िया! हिंदी में बातचीत जारी रखते हैं।";
                const followUp = selectedLanguage === 'english'
                    ? "I'm here to have a natural conversation about your business needs. What would you like to know?"
                    : "मैं आपकी व्यावसायिक आवश्यकताओं के बारे में एक प्राकृतिक बातचीत करने के लिए यहां हूं। आप क्या जानना चाहेंगे?";
                
                messageDiv.innerHTML = `
                    <p>${greeting}</p>
                    <p>${followUp}</p>
                    <div class="timestamp">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                `;
            });
        });
        
        // Event listeners for quick options
        quickOptions.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                let message = '';
                
                switch(action) {
                    case 'services':
                        message = selectedLanguage === 'english' 
                            ? "Can you tell me about your services?" 
                            : "क्या आप मुझे अपनी सेवाओं के बारे में बता सकते हैं?";
                        break;
                    case 'pricing':
                        message = selectedLanguage === 'english' 
                            ? "What are your prices?" 
                            : "आपकी कीमतें क्या हैं?";
                        break;
                    case 'portfolio':
                        message = selectedLanguage === 'english' 
                            ? "Can I see some examples of your work?" 
                            : "क्या मैं आपके काम के कुछ उदाहरण देख सकता हूं?";
                        break;
                    case 'contact':
                        message = selectedLanguage === 'english' 
                            ? "How can I contact you?" 
                            : "मैं आपसे कैसे संपर्क कर सकता हूं?";
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
    
    // Animated Counter
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }
    
    // Initialize counters when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(document.getElementById('projects-count'), 300);
                animateCounter(document.getElementById('leaders-count'), 150);
                animateCounter(document.getElementById('sectors-count'), 15);
                animateCounter(document.getElementById('clients-count'), 250);
                observer.unobserve(entry.target);
            }
        });
    });
    
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
    
    // Testimonial Carousel
    const testimonials = [
        {
            text: "InfoGrip transformed my gym completely. I used to get 5–7 enquiries a week, now I get 40+ consistent leads every single week.",
            author: "Rohit Sharma",
            role: "Fitness Coach (R-Fit Gym)"
        },
        {
            text: "We hired InfoGrip for social media marketing and within 30 days the page started getting reach like never before. Their reel editing is fire.",
            author: "Simran Kaur",
            role: "Beauty Salon Owner"
        },
        {
            text: "Our real estate project was stuck for months. After InfoGrip's lead generation funnel, we closed 11 bookings in 2 months.",
            author: "Rajeev Mehra",
            role: "Real Estate Agency"
        },
        {
            text: "I didn't expect results this fast. Their ads + chatbot automation makes our business run on auto-pilot now.",
            author: "Ananya Gupta",
            role: "Online Coach"
        },
        {
            text: "We saved so much time after they set up WhatsApp automation. Every customer gets replied instantly.",
            author: "Karan Patel",
            role: "Restaurant Owner (Delhi)"
        },
        {
            text: "The team is super supportive. They helped me redesign my website and guided me on how to scale my business online.",
            author: "Megha Arora",
            role: "Boutique Owner"
        }
    ];
    
    const testimonialTrack = document.getElementById('testimonial-track');
    const carouselNav = document.getElementById('carousel-nav');
    
    if (testimonialTrack && carouselNav) {
        let currentSlide = 0;
        
        // Create testimonial slides
        testimonials.forEach((testimonial, index) => {
            const slide = document.createElement('div');
            slide.className = 'testimonial-slide';
            slide.innerHTML = `
                <div class="testimonial-card">
                    <div class="testimonial-stars">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <p class="testimonial-text">"${testimonial.text}"</p>
                    <div class="testimonial-author">
                        <div class="testimonial-avatar">${testimonial.author.charAt(0)}</div>
                        <div class="testimonial-info">
                            <h4>${testimonial.author}</h4>
                            <p>${testimonial.role}</p>
                        </div>
                    </div>
                </div>
            `;
            testimonialTrack.appendChild(slide);
      // Features Carousel with Responsive Cards
const featuresData = [
    {
        icon: "fas fa-chart-line",
        title: "Result-driven Strategies",
        description: "We focus on delivering measurable results that align with your business goals."
    },
    {
        icon: "fas fa-paint-brush",
        title: "Modern Content Creation",
        description: "Our team creates engaging, high-quality content that resonates with your audience."
    },
    {
        icon: "fas fa-chart-pie",
        title: "Advanced Analytics",
        description: "We use data-driven insights to optimize campaigns and maximize performance."
    },
    {
        icon: "fas fa-rocket",
        title: "Fast Project Execution",
        description: "We deliver projects on time without compromising on quality or attention to detail."
    },
    {
        icon: "fas fa-comments",
        title: "Professional Communication",
        description: "We maintain transparent and regular communication throughout our collaboration."
    },
    {
        icon: "fas fa-building",
        title: "Long-term Brand Building",
        description: "We focus on sustainable growth strategies that build lasting brand value."
    }
];

const featuresTrack = document.getElementById('features-track');
const featuresDots = document.getElementById('features-dots');
let currentSlide = 0;
let slidesPerView = 3;
let totalSlides = featuresData.length;
let carouselInterval;

// Initialize carousel
function initCarousel() {
    // Clear existing content
    featuresTrack.innerHTML = '';
    featuresDots.innerHTML = '';
    
    // Update slides per view based on screen width
    updateSlidesPerView();
    
    // Create slides
    featuresData.forEach((feature, index) => {
        // Create slide
        const slide = document.createElement('div');
        slide.className = 'feature-slide';
        slide.innerHTML = `
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="${feature.icon}"></i>
                </div>
                <h3>${feature.title}</h3>
                <p>${feature.description}</p>
            </div>
        `;
        featuresTrack.appendChild(slide);
        
        // Create dot
        const dot = document.createElement('button');
        dot.className = 'features-dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        featuresDots.appendChild(dot);
    });
    
    // Reset to first slide
    goToSlide(0);
    
    // Start auto-slide
    startAutoSlide();
}

// Update slides per view based on screen width
function updateSlidesPerView() {
    if (window.innerWidth <= 768) {
        slidesPerView = 1;
    } else if (window.innerWidth <= 1200) {
        slidesPerView = 2;
    } else {
        slidesPerView = 3;
    }
}

// Go to specific slide
function goToSlide(slideIndex) {
    const maxSlide = Math.max(0, totalSlides - slidesPerView);
    currentSlide = Math.min(Math.max(0, slideIndex), maxSlide);
    
    // Calculate translateX value
    const slideWidth = 100 / slidesPerView;
    const gapPercentage = (25 / featuresTrack.offsetWidth) * 100; // 25px gap
    const translateX = -currentSlide * (slideWidth + gapPercentage);
    
    featuresTrack.style.transform = `translateX(${translateX}%)`;
    
    // Update active dots
    updateDots();
}

// Update active dots
function updateDots() {
    document.querySelectorAll('.features-dot').forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Next slide
function nextSlide() {
    const maxSlide = Math.max(0, totalSlides - slidesPerView);
    if (currentSlide >= maxSlide) {
        goToSlide(0);
    } else {
        goToSlide(currentSlide + 1);
    }
}

// Previous slide
function prevSlide() {
    const maxSlide = Math.max(0, totalSlides - slidesPerView);
    if (currentSlide <= 0) {
        goToSlide(maxSlide);
    } else {
        goToSlide(currentSlide - 1);
    }
}

// Auto-slide functionality
function startAutoSlide() {
    clearInterval(carouselInterval);
    carouselInterval = setInterval(nextSlide, 4000);
}

function stopAutoSlide() {
    clearInterval(carouselInterval);
}

// Event Listeners
document.querySelector('.features-arrow-prev').addEventListener('click', () => {
    stopAutoSlide();
    prevSlide();
    startAutoSlide();
});

document.querySelector('.features-arrow-next').addEventListener('click', () => {
    stopAutoSlide();
    nextSlide();
    startAutoSlide();
});

// Pause auto-slide on hover
featuresTrack.addEventListener('mouseenter', stopAutoSlide);
featuresTrack.addEventListener('mouseleave', startAutoSlide);

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        updateSlidesPerView();
        initCarousel();
    }, 250);
});

// Initialize carousel on load
window.addEventListener('load', initCarousel);

// Also initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
} else {
    initCarousel();
}
            
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
            testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Update active dot
            document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % testimonials.length;
            goToSlide(currentSlide);
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
            goToSlide(currentSlide);
        }
        
        // Auto-advance carousel
        setInterval(nextSlide, 5000);
        
        // Add event listeners for arrow buttons
        const prevArrow = document.querySelector('.carousel-arrow.prev');
        const nextArrow = document.querySelector('.carousel-arrow.next');
        
        if (prevArrow) prevArrow.addEventListener('click', prevSlide);
        if (nextArrow) nextArrow.addEventListener('click', nextSlide);
    }
    
    // Social Proof Popups
    const socialProofMessages = [
        { name: "Rohit", action: "submitted a form" },
        { name: "Simran", action: "booked a free consultation" },
        { name: "Arjun", action: "downloaded a growth plan" },
        { name: "Priya", action: "requested a quote" },
        { name: "Amit", action: "signed up for newsletter" },
        { name: "Neha", action: "started a project" }
    ];
    
    function showSocialProof() {
        const randomIndex = Math.floor(Math.random() * socialProofMessages.length);
        const message = socialProofMessages[randomIndex];
        
        const popup = document.createElement('div');
        popup.className = 'social-proof-popup';
        popup.innerHTML = `
            <div class="social-proof-avatar">${message.name.charAt(0)}</div>
            <div class="social-proof-content">
                <h4>${message.name}</h4>
                <p>${message.action}</p>
            </div>
        `;
        
        const container = document.getElementById('social-proof-container');
        if (container) {
            container.appendChild(popup);
            
            // Show popup
            setTimeout(() => {
                popup.classList.add('active');
            }, 100);
            
            // Hide and remove popup after delay
            setTimeout(() => {
                popup.classList.remove('active');
                setTimeout(() => {
                    popup.remove();
                }, 500);
            }, 5000);
        }
    }
    
    // Show first social proof after 3 seconds
    setTimeout(showSocialProof, 3000);
    
    // Show subsequent social proofs randomly
    setInterval(showSocialProof, 10000 + Math.random() * 15000);
    
    // Fade in elements on scroll
    const fadeElements = document.querySelectorAll('.service-card, .feature-card, .faq-item, .stat-card');
    
    const fadeInOnScroll = () => {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = "1";
                element.style.transform = "translateY(0)";
            }
        });
    };
    
    // Set initial state for fade elements
    fadeElements.forEach(element => {
        element.style.opacity = "0";
        element.style.transform = "translateY(20px)";
        element.style.transition = "opacity 0.5s ease, transform 0.5s ease";
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
    
    window.addEventListener('scroll', fadeInOnScroll);
    window.addEventListener('load', fadeInOnScroll);
}
