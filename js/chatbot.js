// Chatbot functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatbotBtn = document.getElementById('chatbot-btn');
    const chatbotOverlay = document.getElementById('chatbot-overlay');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotOpen = document.getElementById('chatbot-open');

    if (chatbotBtn && chatbotOverlay) {
        chatbotBtn.addEventListener('click', (e) => {
            e.preventDefault();
            chatbotOverlay.classList.add('active');
        });
    }

    if (chatbotOpen && chatbotOverlay) {
        chatbotOpen.addEventListener('click', (e) => {
            e.preventDefault();
            chatbotOverlay.classList.add('active');
        });
    }

    if (chatbotClose && chatbotOverlay) {
        chatbotClose.addEventListener('click', () => {
            chatbotOverlay.classList.remove('active');
        });
    }

    // Enhanced Chatbot Functionality
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    
    if (chatMessages && messageInput && sendButton) {
        const quickOptions = document.querySelectorAll('.quick-option');
        const languageOptions = document.querySelectorAll('.language-option');
        
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
                
                addMessage(message, true);
                setTimeout(() => {
                    let response = '';
                    switch(action) {
                        case 'services':
                            response = selectedLanguage === 'english'
                                ? "We offer social media management, website development, political branding, and ads campaign management. Which one interests you?"
                                : "हम सोशल मीडिया मैनेजमेंट, वेबसाइट डेवलपमेंट, पॉलिटिकल ब्रांडिंग और एड्स कैंपेन मैनेजमेंट प्रदान करते हैं। आपको कौन सा रुचिकर लगता है?";
                            break;
                        case 'pricing':
                            response = knowledgeBase.commonQuestions.howMuch[selectedLanguage];
                            break;
                        case 'contact':
                            response = selectedLanguage === 'english'
                                ? "You can reach us at +91 9928140288, email info@infogrip.com, or fill out our onboarding form at infogrip.com/onboarding.html"
                                : "आप हमें +91 9928140288 पर, ईमेल info@infogrip.com पर, या infogrip.com/onboarding.html पर हमारा ऑनबोर्डिंग फॉर्म भरकर संपर्क कर सकते हैं";
                            break;
                    }
                    addMessage(response);
                }, 1000);
            });
        });

        // Event listeners for input
        sendButton.addEventListener('click', () => {
            const message = messageInput.value.trim();
            if (message) {
                addMessage(message, true);
                messageInput.value = '';
                
                setTimeout(() => {
                    let response = '';
                    const lowerMessage = message.toLowerCase();
                    
                    if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
                        response = selectedLanguage === 'english'
                            ? "Hello! How can I help you with your digital marketing needs today?"
                            : "नमस्ते! आज मैं आपकी डिजिटल मार्केटिंग आवश्यकताओं में कैसे मदद कर सकता हूं?";
                    } else if (lowerMessage.includes('service') || lowerMessage.includes('what do you do')) {
                        response = selectedLanguage === 'english'
                            ? "We specialize in social media management, website development, political branding, and ads campaign management. Which area are you interested in?"
                            : "हम सोशल मीडिया मैनेजमेंट, वेबसाइट डेवलपमेंट, पॉलिटिकल ब्रांडिंग और एड्स कैंपेन मैनेजमेंट में विशेषज्ञ हैं। आप किस क्षेत्र में रुचि रखते हैं?";
                    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
                        response = knowledgeBase.commonQuestions.howMuch[selectedLanguage];
                    } else if (lowerMessage.includes('contact') || lowerMessage.includes('call') || lowerMessage.includes('email')) {
                        response = selectedLanguage === 'english'
                            ? "You can reach us at +91 9928140288, email info@infogrip.com, or fill out our onboarding form at infogrip.com/onboarding.html"
                            : "आप हमें +91 9928140288 पर, ईमेल info@infogrip.com पर, या infogrip.com/onboarding.html पर हमारा ऑनबोर्डिंग फॉर्म भरकर संपर्क कर सकते हैं";
                    } else {
                        response = selectedLanguage === 'english'
                            ? "Thanks for your message! I'm here to help with your marketing needs. Would you like to know about our services, pricing, or see some examples of our work?"
                            : "आपके संदेश के लिए धन्यवाद! मैं आपकी मार्केटिंग आवश्यकताओं में मदद करने के लिए यहां हूं। क्या आप हमारी सेवाओं, मूल्य निर्धारण के बारे में जानना चाहेंगे, या हमारे काम के कुछ उदाहरण देखना चाहेंगे?";
                    }
                    
                    addMessage(response);
                }, 1000);
            }
        });

        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendButton.click();
            }
        });
    }
});
