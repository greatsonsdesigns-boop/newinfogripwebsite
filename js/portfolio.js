// Portfolio Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio page loaded');
    
    // Portfolio Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    // Add click event to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Show/hide portfolio items
            portfolioItems.forEach(item => {
                const categories = item.getAttribute('data-category');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Load More Button
    const loadMoreBtn = document.getElementById('loadMore');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // In a real implementation, this would load more projects from a server
            alert('In a real implementation, this would load more projects. For now, all projects are shown.');
            this.style.display = 'none';
        });
    }
    
    // View Details Buttons
    document.querySelectorAll('.btn-view').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const portfolioItem = this.closest('.portfolio-item');
            const title = portfolioItem.querySelector('h3').textContent;
            
            alert(`Viewing details for: ${title}\n\nThis would open a detailed project view.`);
        });
    });
    
    // Initialize animations
    const portfolioItemsArray = Array.from(portfolioItems);
    portfolioItemsArray.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Chatbot functionality for portfolio page
    const chatbotBtn = document.getElementById('chatbot-btn');
    const chatbotOverlay = document.getElementById('chatbot-overlay');
    const chatbotClose = document.getElementById('chatbot-close');
    
    if (chatbotBtn && chatbotOverlay) {
        chatbotBtn.addEventListener('click', function(e) {
            e.preventDefault();
            chatbotOverlay.classList.add('active');
        });
    }
    
    if (chatbotClose) {
        chatbotClose.addEventListener('click', function() {
            chatbotOverlay.classList.remove('active');
        });
    }
    
    // Close chatbot when clicking outside
    if (chatbotOverlay) {
        chatbotOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    }
    
    // Simple chatbot message sending
    const chatInput = document.querySelector('.chat-input');
    const sendButton = document.querySelector('.send-button');
    
    if (chatInput && sendButton) {
        sendButton.addEventListener('click', function() {
            const message = chatInput.value.trim();
            if (message) {
                // Add user message
                const chatMessages = document.querySelector('.chat-messages');
                const userMessage = document.createElement('div');
                userMessage.className = 'message';
                userMessage.style.marginLeft = 'auto';
                userMessage.style.background = 'var(--blue)';
                userMessage.style.color = 'white';
                userMessage.textContent = message;
                chatMessages.appendChild(userMessage);
                
                // Clear input
                chatInput.value = '';
                
                // Add bot response
                setTimeout(() => {
                    const botMessage = document.createElement('div');
                    botMessage.className = 'message bot-message';
                    botMessage.textContent = 'Thanks for your message! For detailed portfolio inquiries, please contact us at info@infogrip.com';
                    chatMessages.appendChild(botMessage);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1000);
                
                // Scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        });
        
        // Send message on Enter key
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendButton.click();
            }
        });
    }
});
