document.addEventListener('DOMContentLoaded', function() {
            // Accordion functionality
            const faqItems = document.querySelectorAll('.faq-item');
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question');
                question.addEventListener('click', () => {
                    // Close other items if open
                    const currentlyActive = document.querySelector('.faq-item.active');
                    if (currentlyActive && currentlyActive !== item) {
                        currentlyActive.classList.remove('active');
                    }
                    
                    // Toggle current item
                    item.classList.toggle('active');
                });
            });

            // Category filtering
            const filterButtons = document.querySelectorAll('.filter-btn');
            const categoryBlocks = document.querySelectorAll('.faq-category-block');
            const allFaqItems = document.querySelectorAll('.faq-item');
            const searchSuggestions = document.getElementById('searchSuggestions');
            const searchInput = document.getElementById('faqSearch');
            
            // All FAQ questions for search suggestions
            const allQuestions = Array.from(faqItems).map(item => {
                return {
                    question: item.querySelector('.faq-question span').textContent,
                    keywords: item.getAttribute('data-questions') || '',
                    category: item.closest('.faq-category-block').getAttribute('data-category')
                };
            });

            // Common question starters for suggestions
            const commonStarters = [
                'how', 'what', 'when', 'where', 'why', 'who', 
                'can', 'do', 'does', 'is', 'are', 'will'
            ];

            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Update active button
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    
                    const category = button.getAttribute('data-category');
                    
                    // Show/hide categories
                    categoryBlocks.forEach(block => {
                        if (category === 'all' || block.getAttribute('data-category') === category) {
                            block.style.display = 'block';
                        } else {
                            block.style.display = 'none';
                        }
                    });
                    
                    // Reset search
                    searchInput.value = '';
                    searchSuggestions.classList.remove('active');
                    document.getElementById('searchResults').innerHTML = '';
                    document.getElementById('noResults').style.display = 'none';
                });
            });

            // Search functionality with suggestions
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase().trim();
                
                // Clear suggestions if empty
                if (searchTerm.length === 0) {
                    searchSuggestions.classList.remove('active');
                    document.getElementById('searchResults').innerHTML = '';
                    document.getElementById('noResults').style.display = 'none';
                    
                    // Show all categories
                    categoryBlocks.forEach(block => {
                        block.style.display = 'block';
                    });
                    
                    // Reset filtering
                    filterButtons.forEach(btn => {
                        if (btn.getAttribute('data-category') === 'all') {
                            btn.classList.add('active');
                        } else {
                            btn.classList.remove('active');
                        }
                    });
                    
                    return;
                }
                
                // Show "All" filter when searching
                filterButtons.forEach(btn => {
                    if (btn.getAttribute('data-category') === 'all') {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
                
                // Generate suggestions
                let suggestions = [];
                
                // If search starts with common question words, show relevant questions
                if (commonStarters.some(starter => searchTerm.startsWith(starter))) {
                    suggestions = allQuestions.filter(q => {
                        const questionLower = q.question.toLowerCase();
                        const keywordsLower = q.keywords.toLowerCase();
                        return questionLower.includes(searchTerm) || 
                               keywordsLower.includes(searchTerm) ||
                               questionLower.startsWith(searchTerm);
                    }).slice(0, 8); // Limit to 8 suggestions
                } else {
                    // Regular keyword matching
                    suggestions = allQuestions.filter(q => {
                        const questionLower = q.question.toLowerCase();
                        const keywordsLower = q.keywords.toLowerCase();
                        return questionLower.includes(searchTerm) || 
                               keywordsLower.includes(searchTerm);
                    }).slice(0, 8);
                }
                
                // Update suggestions dropdown
                if (suggestions.length > 0) {
                    const suggestionsHTML = suggestions.map(suggestion => {
                        const highlightedQuestion = suggestion.question.replace(
                            new RegExp(`(${searchTerm})`, 'gi'),
                            '<span class="suggestion-highlight">$1</span>'
                        );
                        
                        // Map category to display name
                        const categoryNames = {
                            'services': 'Political Branding',
                            'social': 'Social Media',
                            'ads': 'Ads & Campaigns',
                            'pricing': 'Plans & Pricing',
                            'onboarding': 'Onboarding',
                            'legal': 'Legal & Compliance',
                            'support': 'Support & Contact'
                        };
                        
                        return `
                            <div class="suggestion-item" data-question="${suggestion.question}">
                                <div class="suggestion-question">${highlightedQuestion}</div>
                                <div class="suggestion-category">${categoryNames[suggestion.category] || suggestion.category}</div>
                            </div>
                        `;
                    }).join('');
                    
                    searchSuggestions.innerHTML = suggestionsHTML;
                    searchSuggestions.classList.add('active');
                    
                    // Add click handlers to suggestions
                    document.querySelectorAll('.suggestion-item').forEach(item => {
                        item.addEventListener('click', function() {
                            const questionText = this.getAttribute('data-question');
                            searchInput.value = questionText;
                            searchSuggestions.classList.remove('active');
                            performSearch(questionText);
                        });
                    });
                } else {
                    searchSuggestions.classList.remove('active');
                }
                
                // Perform actual search after delay
                clearTimeout(window.searchTimeout);
                window.searchTimeout = setTimeout(() => {
                    if (searchTerm.length >= 2) {
                        performSearch(searchTerm);
                    }
                }, 300);
            });

            // Click outside to close suggestions
            document.addEventListener('click', function(e) {
                if (!searchSuggestions.contains(e.target) && e.target !== searchInput) {
                    searchSuggestions.classList.remove('active');
                }
            });

            // Search button click
            document.getElementById('searchBtn').addEventListener('click', () => {
                searchInput.focus();
                if (searchInput.value.trim().length >= 2) {
                    performSearch(searchInput.value.trim());
                }
            });

            // Enter key in search
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    searchSuggestions.classList.remove('active');
                    if (searchInput.value.trim().length >= 2) {
                        performSearch(searchInput.value.trim());
                    }
                }
            });

            // Perform search function
            function performSearch(searchTerm) {
                let matchCount = 0;
                
                // Search through all FAQ items
                allFaqItems.forEach(item => {
                    const question = item.querySelector('.faq-question span').textContent.toLowerCase();
                    const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
                    const keywords = item.getAttribute('data-questions') || '';
                    const parentBlock = item.closest('.faq-category-block');
                    
                    if (question.includes(searchTerm) || answer.includes(searchTerm) || keywords.includes(searchTerm)) {
                        // Show parent category
                        parentBlock.style.display = 'block';
                        
                        // Highlight matching text in question
                        const questionText = item.querySelector('.faq-question span');
                        const answerText = item.querySelector('.faq-answer');
                        
                        const originalQuestion = questionText.textContent;
                        const originalAnswer = answerText.innerHTML;
                        
                        // Highlight in question
                        const regex = new RegExp(`(${searchTerm})`, 'gi');
                        questionText.innerHTML = originalQuestion.replace(regex, '<span class="highlight">$1</span>');
                        
                        // Reset answer to original before highlighting
                        answerText.innerHTML = originalAnswer;
                        
                        // Auto-expand matching item
                        item.classList.add('active');
                        
                        matchCount++;
                    } else {
                        // Hide non-matching items within visible categories
                        item.classList.remove('active');
                    }
                });
                
                // Show/hide categories based on matches
                categoryBlocks.forEach(block => {
                    const hasVisibleItems = Array.from(block.querySelectorAll('.faq-item')).some(item => 
                        item.style.display !== 'none'
                    );
                    
                    if (!hasVisibleItems && !block.querySelector('.faq-item.active')) {
                        block.style.display = 'none';
                    }
                });
                
                // Show results count
                const searchResults = document.getElementById('searchResults');
                const noResults = document.getElementById('noResults');
                
                if (matchCount > 0) {
                    searchResults.innerHTML = `<p>Found ${matchCount} matching question${matchCount > 1 ? 's' : ''}</p>`;
                    noResults.style.display = 'none';
                } else {
                    searchResults.innerHTML = '';
                    noResults.style.display = 'block';
                }
            }

            // Initialize with all categories visible
            filterButtons.forEach(btn => {
                if (btn.getAttribute('data-category') === 'all') {
                    btn.classList.add('active');
                }
            });
        });