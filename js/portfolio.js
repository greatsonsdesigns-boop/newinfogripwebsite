// Portfolio Filtering Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Portfolio Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const portfolioGrid = document.getElementById('portfolioGrid');
    
    // Add click event to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Show/hide portfolio items based on filter
            portfolioItems.forEach(item => {
                if (filterValue === 'all') {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    const categories = item.getAttribute('data-category').split(' ');
                    if (categories.includes(filterValue)) {
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
                }
            });
            
            // Reinitialize animations for visible items
            setTimeout(() => {
                const visibleItems = document.querySelectorAll('.portfolio-item[style*="display: block"]');
                visibleItems.forEach((item, index) => {
                    item.style.animationDelay = `${index * 0.1}s`;
                    item.classList.add('fade-in-up');
                });
            }, 100);
        });
    });
    
    // Load More Functionality
    const loadMoreBtn = document.getElementById('loadMore');
    let currentItems = 8;
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            const portfolioItems = document.querySelectorAll('.portfolio-item');
            
            // Show next 4 items
            for (let i = currentItems; i < currentItems + 4 && i < portfolioItems.length; i++) {
                if (portfolioItems[i].style.display !== 'none') {
                    portfolioItems[i].style.display = 'block';
                    portfolioItems[i].style.animationDelay = `${(i - currentItems) * 0.1}s`;
                    portfolioItems[i].classList.add('fade-in-up');
                }
            }
            
            currentItems += 4;
            
            // Hide button if all items are shown
            if (currentItems >= portfolioItems.length) {
                loadMoreBtn.style.display = 'none';
            }
        });
    }
    
    // Initialize animations on page load
    setTimeout(() => {
        const fadeElements = document.querySelectorAll('.fade-in-up');
        fadeElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.1}s`;
        });
    }, 100);
    
    // View Details Button Click
    document.querySelectorAll('.btn-view').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const portfolioItem = this.closest('.portfolio-item');
            const title = portfolioItem.querySelector('h3').textContent;
            const description = portfolioItem.querySelector('p').textContent;
            
            // Create modal or redirect to detailed page
            alert(`Viewing details for: ${title}\n\n${description}`);
            // In a real implementation, you might want to:
            // 1. Open a modal with more details
            // 2. Redirect to a case study page
            // 3. Show a lightbox with project images
        });
    });
    
    // Portfolio Item Click (opens detail view)
    portfolioItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (!e.target.closest('.btn-view')) {
                const title = this.querySelector('h3').textContent;
                const description = this.querySelector('p').textContent;
                
                // Create modal for project details
                createProjectModal(this);
            }
        });
    });
    
    // Function to create project modal
    function createProjectModal(item) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.project-modal');
        if (existingModal) existingModal.remove();
        
        // Get project data
        const title = item.querySelector('h3').textContent;
        const description = item.querySelector('p').textContent;
        const tags = Array.from(item.querySelectorAll('.tag')).map(tag => tag.textContent);
        const imageSrc = item.querySelector('img').src;
        const category = item.getAttribute('data-category');
        
        // Create modal HTML
        const modalHTML = `
            <div class="project-modal-overlay">
                <div class="project-modal">
                    <button class="modal-close">&times;</button>
                    <div class="modal-image">
                        <img src="${imageSrc}" alt="${title}">
                    </div>
                    <div class="modal-content">
                        <div class="modal-header">
                            <span class="modal-category">${getCategoryLabel(category)}</span>
                            <h3>${title}</h3>
                        </div>
                        <div class="modal-body">
                            <p>${description}</p>
                            <div class="modal-tags">
                                ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                            </div>
                            <div class="modal-stats">
                                <div class="stat">
                                    <h4>Client</h4>
                                    <p>Confidential</p>
                                </div>
                                <div class="stat">
                                    <h4>Timeline</h4>
                                    <p>2-4 Weeks</p>
                                </div>
                                <div class="stat">
                                    <h4>Results</h4>
                                    <p>Significant Improvement</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <a href="onboarding.html" class="btn btn-primary">Start Similar Project</a>
                            <button class="btn btn-secondary modal-close-btn">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add modal styles
        const modalStyles = `
            .project-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                padding: 20px;
                animation: fadeIn 0.3s ease;
            }
            
            .project-modal {
                background: var(--card-bg);
                border-radius: 20px;
                max-width: 900px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                animation: slideUp 0.3s ease;
                border: 1px solid var(--glass-border);
            }
            
            .modal-close {
                position: absolute;
                top: 20px;
                right: 20px;
                background: none;
                border: none;
                font-size: 2rem;
                color: var(--text-color);
                cursor: pointer;
                z-index: 10;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: var(--transition);
            }
            
            .modal-close:hover {
                background: var(--light-blue);
                color: var(--orange);
            }
            
            .modal-image {
                height: 300px;
                overflow: hidden;
                border-radius: 20px 20px 0 0;
            }
            
            .modal-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .modal-content {
                padding: 30px;
            }
            
            .modal-header {
                margin-bottom: 20px;
            }
            
            .modal-category {
                display: inline-block;
                background: var(--orange);
                color: var(--dark-blue);
                padding: 5px 15px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: 600;
                margin-bottom: 15px;
            }
            
            .modal-header h3 {
                font-size: 1.8rem;
                margin-bottom: 10px;
            }
            
            .modal-body p {
                color: var(--blue);
                line-height: 1.6;
                margin-bottom: 20px;
            }
            
            .modal-tags {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
                margin-bottom: 25px;
            }
            
            .modal-stats {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
                margin-bottom: 30px;
                padding: 20px 0;
                border-top: 1px solid var(--light-blue);
                border-bottom: 1px solid var(--light-blue);
            }
            
            .modal-stats .stat h4 {
                font-size: 0.9rem;
                color: var(--blue);
                margin-bottom: 5px;
            }
            
            .modal-stats .stat p {
                font-size: 1.1rem;
                color: var(--text-color);
                font-weight: 600;
                margin: 0;
            }
            
            .modal-footer {
                display: flex;
                gap: 15px;
                justify-content: flex-end;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            @media (max-width: 768px) {
                .project-modal {
                    max-height: 95vh;
                }
                
                .modal-image {
                    height: 200px;
                }
                
                .modal-stats {
                    grid-template-columns: 1fr;
                }
                
                .modal-footer {
                    flex-direction: column;
                }
                
                .modal-footer .btn {
                    width: 100%;
                }
            }
        `;
        
        // Add styles
        const styleSheet = document.createElement('style');
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);
        
        // Add event listeners for modal
        document.querySelector('.modal-close').addEventListener('click', closeModal);
        document.querySelector('.modal-close-btn').addEventListener('click', closeModal);
        document.querySelector('.project-modal-overlay').addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        const modal = document.querySelector('.project-modal-overlay');
        if (modal) {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
            }, 300);
        }
    }
    
    function getCategoryLabel(category) {
        const categories = {
            'web': 'Web Development',
            'social': 'Social Media',
            'branding': 'Branding',
            'political': 'Political Campaigns',
            'ecommerce': 'E-commerce'
        };
        
        return categories[category.split(' ')[0]] || 'Project';
    }
    
    // Add CSS for fadeOut animation
    const fadeOutStyle = document.createElement('style');
    fadeOutStyle.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(fadeOutStyle);
});
