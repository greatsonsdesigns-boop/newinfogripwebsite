

document.body.classList.add("header-ready");

// Common utility functions and shared functionality

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Check if element is partially in viewport
function isPartiallyInViewport(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
    const windowWidth = (window.innerWidth || document.documentElement.clientWidth);
    
    const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
    const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
    
    return (vertInView && horInView);
}

// Format number with commas
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Sanitize input
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    if (type === 'success') {
        notification.style.backgroundColor = '#10b981';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#ef4444';
    } else {
        notification.style.backgroundColor = '#3b82f6';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for notifications if not present
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}
// Custom Cursor (Desktop Only)
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

// Initialize only on non-mobile devices
if (window.innerWidth > 768 && cursor && cursorFollower) {

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 100);
    });

    // Hover effect on interactive elements
    const interactiveElements = document.querySelectorAll(
        'button, a, .btn, .service-card, .feature-card, .faq-question'
    );

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

    // Text hover effect
    const textElements = document.querySelectorAll(
        'h1, h2, h3, h4, h5, h6, p, span, li'
    );

    textElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('text-hover');
        });

        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('text-hover');
        });
    });
}

// ===== CYLINDRICAL HEADER FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Premium Cylindrical Header...');
    
    // ===== ELEMENTS - MATCHING YOUR HTML =====
    const cylindricalHeader = document.querySelector('.cylindrical-header');
    const headerHamburger = document.querySelector('.hamburger');
    const headerThemeToggle = document.querySelector('#theme-toggle'); // This should work
    const navMenu = document.querySelector('.nav-menu');
    const mainLogo = document.querySelector('.logo-img');
    const allNavLinks = document.querySelectorAll('.nav-menu a');
    
    console.log('✅ Header elements found:', {
        header: !!cylindricalHeader,
        hamburger: !!headerHamburger,
        themeToggle: !!headerThemeToggle,
        navMenu: !!navMenu,
        mainLogo: !!mainLogo
    });
    
    // Debug: Log the theme toggle element
    console.log('🎯 Theme toggle element:', headerThemeToggle);
    console.log('🎯 Theme toggle HTML:', headerThemeToggle?.outerHTML);
    
    // ===== MOBILE MENU FUNCTIONALITY =====
    function initMobileMenu() {
        if (!headerHamburger || !navMenu) {
            console.warn('⚠️ Mobile menu elements missing');
            return;
        }
        
        console.log('✅ Initializing mobile menu...');
        
        // Create mobile overlay if it doesn't exist
        let mobileOverlay = document.querySelector('.mobile-overlay');
        if (!mobileOverlay) {
            mobileOverlay = document.createElement('div');
            mobileOverlay.className = 'mobile-overlay';
            
            const mobileMenuContent = document.createElement('div');
            mobileMenuContent.className = 'mobile-menu-content';
            
            const mobileNav = navMenu.cloneNode(true);
            mobileNav.className = 'mobile-nav';
            
            const closeBtn = document.createElement('button');
            closeBtn.className = 'mobile-close';
            closeBtn.innerHTML = '✕';
            closeBtn.setAttribute('aria-label', 'Close menu');
            
            mobileMenuContent.appendChild(closeBtn);
            mobileMenuContent.appendChild(mobileNav);
            mobileOverlay.appendChild(mobileMenuContent);
            document.body.appendChild(mobileOverlay);
            
            console.log('📱 Created mobile overlay dynamically');
        }
        
        const mobileClose = document.querySelector('.mobile-close');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
        
        // Open mobile menu
        headerHamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            console.log('🍔 Hamburger clicked - Opening mobile menu');
            
            this.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            if (mobileOverlay.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close mobile menu function
        function closeMobileMenu() {
            console.log('📱 Closing mobile menu');
            headerHamburger.classList.remove('active');
            mobileOverlay.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        
        // Close with X button
        if (mobileClose) {
            mobileClose.addEventListener('click', function(e) {
                e.stopPropagation();
                closeMobileMenu();
            });
        }
        
        // Close when clicking overlay
        mobileOverlay.addEventListener('click', function(e) {
            if (e.target === mobileOverlay) {
                closeMobileMenu();
            }
        });
        
        // Close when clicking mobile nav links
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    setTimeout(closeMobileMenu, 300);
                }
            });
        });
        
        // Close with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileOverlay.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }
    
    // ===== THEME TOGGLE - FIXED VERSION =====
    function initThemeToggle() {
        if (!headerThemeToggle) {
            console.error('❌ Theme toggle button not found! Searching for #theme-toggle...');
            
            // Try alternative selectors
            const themeToggleAlt = document.querySelector('.theme-toggle');
            if (themeToggleAlt) {
                console.log('✅ Found theme toggle using .theme-toggle class');
                headerThemeToggle = themeToggleAlt;
            } else {
                console.error('❌ Theme toggle not found with any selector!');
                return;
            }
        }
        
        console.log('✅ Theme toggle initialized:', headerThemeToggle);
        
        // Get the icon element
        const themeIcon = headerThemeToggle.querySelector('i');
        console.log('🎯 Theme icon found:', !!themeIcon);
        
        // Function to apply theme
        function applyTheme(theme) {
            if (theme === 'dark') {
                document.body.classList.add('dark-theme');
                if (themeIcon) {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                }
                console.log('🌙 Applied dark theme');
            } else {
                document.body.classList.remove('dark-theme');
                if (themeIcon) {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                }
                console.log('☀️ Applied light theme');
            }
            
            // Save to localStorage
            localStorage.setItem('theme', theme);
        }
        
        // Check for saved theme or system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        let initialTheme = 'light';
        if (savedTheme) {
            initialTheme = savedTheme;
            console.log('📁 Using saved theme from localStorage:', savedTheme);
        } else if (prefersDark) {
            initialTheme = 'dark';
            console.log('🖥️ Using system preference: dark');
        }
        
        // Apply initial theme
        applyTheme(initialTheme);
        
        // Theme toggle click - SIMPLIFIED VERSION
        headerThemeToggle.addEventListener('click', function() {
            console.log('🎨 Theme toggle clicked');
            
            // Check current theme
            const isDark = document.body.classList.contains('dark-theme');
            console.log('Current is dark theme?', isDark);
            
            // Toggle theme
            if (isDark) {
                applyTheme('light');
            } else {
                applyTheme('dark');
            }
            
            // Debug: Verify theme was applied
            setTimeout(() => {
                console.log('✅ Theme after toggle:', 
                    document.body.classList.contains('dark-theme') ? 'dark' : 'light');
                console.log('✅ Icon classes:', themeIcon?.className);
            }, 100);
        });
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) { // Only if user hasn't set preference
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
        
        // Debug function to test theme
        window.testThemeToggle = function() {
            console.log('🧪 Testing theme toggle...');
            console.log('1. Theme button:', headerThemeToggle);
            console.log('2. Has click event?', headerThemeToggle.onclick);
            console.log('3. Current theme:', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
            console.log('4. Icon:', themeIcon?.outerHTML);
            console.log('5. localStorage theme:', localStorage.getItem('theme'));
            
            // Simulate a click
            headerThemeToggle.click();
        };
    }
    
    // ===== SCROLL EFFECT =====
    function initScrollEffect() {
        window.addEventListener('scroll', function() {
    if (window.scrollY > 150) {
        cylindricalHeader.classList.add('scrolled');
    } else {
        cylindricalHeader.classList.remove('scrolled');
    }
});
    }
    // ===== ACTIVE LINK MANAGEMENT =====
    function initActiveLinks() {
        function setActiveLink() {
            const currentHash = window.location.hash || '';
            const currentPage = window.location.pathname.split("/").pop() || "index.html";
            
            allNavLinks.forEach(link => {
                const href = link.getAttribute('href');
                link.classList.remove('active');
                
                if (href === currentHash) {
                    link.classList.add('active');
                }
                else if (href === currentPage || 
                        (href === 'index.html' && currentPage === '') ||
                        (href === currentPage.replace('.html', ''))) {
                    link.classList.add('active');
                }
            });
            
            const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
            mobileNavLinks.forEach(link => {
                const href = link.getAttribute('href');
                link.classList.remove('active');
                
                if (href === currentHash) {
                    link.classList.add('active');
                }
                else if (href === currentPage || 
                        (href === 'index.html' && currentPage === '')) {
                    link.classList.add('active');
                }
            });
        }
        
        setActiveLink();
        window.addEventListener('hashchange', setActiveLink);
        
        allNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                const href = this.getAttribute('href');
                
                if (href && href.startsWith('#')) {
                    allNavLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    
                    const mobileLinks = document.querySelectorAll('.mobile-nav a');
                    mobileLinks.forEach(mobileLink => {
                        if (mobileLink.getAttribute('href') === href) {
                            mobileLink.classList.add('active');
                        } else {
                            mobileLink.classList.remove('active');
                        }
                    });
                }
            });
        });
    }
    
    // ===== ADD REQUIRED CSS FOR THEME =====
    function addThemeCSS() {
        if (!document.querySelector('#theme-styles')) {
            const style = document.createElement('style');
            style.id = 'theme-styles';
            style.textContent = `
                /* Dark theme variables - add your own colors */
                .dark-theme {
                    --bg-color: #121212;
                    --text-color: #ffffff;
                    --header-bg: rgba(18, 18, 18, 0.95);
                    --primary-color: #7c3aed;
                    --secondary-color: #a855f7;
                }
                
                /* Light theme variables */
                :root {
                    --bg-color: #ffffff;
                    --text-color: #333333;
                    --header-bg: rgba(255, 255, 255, 0.95);
                    --primary-color: #4f46e5;
                    --secondary-color: #6366f1;
                }
                
                /* Theme toggle button styling */
                .theme-toggle {
                    background: var(--primary-color);
                    border: none;
                    color: white;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .theme-toggle:hover {
                    transform: scale(1.1);
                    background: var(--secondary-color);
                }
                
                /* Apply theme to body and header */
                body.dark-theme {
                    background-color: var(--bg-color);
                    color: var(--text-color);
                }
                
                .dark-theme .cylindrical-header {
                    background: var(--header-bg);
                }
                
                /* Mobile overlay in dark theme */
                .dark-theme .mobile-overlay {
                    background: rgba(0, 0, 0, 0.98);
                }
                
                .dark-theme .mobile-menu-content {
                    background: #1a1a1a;
                }
                
                .dark-theme .mobile-nav a {
                    color: #ffffff;
                }
                
                .dark-theme .mobile-close {
                    color: #ffffff;
                }
            `;
            document.head.appendChild(style);
            console.log('🎨 Added theme CSS');
        }
    }
    
    // ===== ADD REQUIRED CSS FOR MOBILE MENU =====
    function addMobileMenuCSS() {
        if (!document.querySelector('#mobile-menu-styles')) {
            const style = document.createElement('style');
            style.id = 'mobile-menu-styles';
            style.textContent = `
                .mobile-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.95);
                    z-index: 9998;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .mobile-overlay.active {
                    opacity: 1;
                    visibility: visible;
                }
                
                .mobile-menu-content {
                    background: var(--bg-color, #ffffff);
                    border-radius: 20px;
                    padding: 40px 30px;
                    max-width: 90%;
                    max-height: 90%;
                    overflow-y: auto;
                    position: relative;
                    transform: translateY(20px);
                    transition: transform 0.3s ease;
                }
                
                .mobile-overlay.active .mobile-menu-content {
                    transform: translateY(0);
                }
                
                .mobile-close {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: none;
                    border: none;
                    font-size: 28px;
                    color: var(--text-color, #333);
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                }
                
                .mobile-close:hover {
                    background: rgba(0, 0, 0, 0.1);
                }
                
                .mobile-nav {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    text-align: center;
                }
                
                .mobile-nav li {
                    margin: 15px 0;
                }
                
                .mobile-nav a {
                    color: var(--text-color, #333);
                    text-decoration: none;
                    font-size: 24px;
                    font-weight: 600;
                    padding: 10px 20px;
                    display: block;
                    border-radius: 10px;
                    transition: all 0.3s ease;
                }
                
                .mobile-nav a:hover,
                .mobile-nav a.active {
                    background: var(--primary-color, #4f46e5);
                    color: white;
                }
                
                .hamburger.active .bar:nth-child(1) {
                    transform: rotate(45deg) translate(6px, 6px);
                }
                
                .hamburger.active .bar:nth-child(2) {
                    opacity: 0;
                }
                
                .hamburger.active .bar:nth-child(3) {
                    transform: rotate(-45deg) translate(6px, -6px);
                }
                
                @media (min-width: 769px) {
                    .mobile-overlay {
                        display: none !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // ===== INITIALIZE ALL FUNCTIONALITIES =====
    initMobileMenu();
    initThemeToggle(); // Make sure this is called!
    initScrollEffect();
    initActiveLinks();
    addThemeCSS();
    addMobileMenuCSS();
    
    // ===== WINDOW RESIZE HANDLER =====
    window.addEventListener('resize', function() {
        const mobileOverlay = document.querySelector('.mobile-overlay');
        if (window.innerWidth > 768 && mobileOverlay && mobileOverlay.classList.contains('active')) {
            headerHamburger.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // ===== DEBUGGING HELPERS =====
    console.log('✅ Premium Cylindrical Header initialized successfully!');
    
    // Add global debug function
    window.debugHeader = function() {
        console.log('🔍 Header Debug Info:');
        console.log('- Theme toggle exists:', !!headerThemeToggle);
        console.log('- Current theme:', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        console.log('- localStorage theme:', localStorage.getItem('theme'));
        console.log('- Theme icon:', headerThemeToggle?.querySelector('i')?.className);
        
        // Test theme toggle
        if (headerThemeToggle) {
            console.log('- Theme toggle clickable: YES');
            console.log('- Theme toggle position:', headerThemeToggle.getBoundingClientRect());
        }
    };
});

// Simple theme test - add this after your main JS loads
setTimeout(function() {
    console.log('🧪 Testing theme functionality...');
    
    // Check if theme toggle exists
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) {
        console.error('❌ theme-toggle not found in HTML!');
        console.log('Looking for theme toggle...', document.querySelectorAll('[id*="theme"], [class*="theme"]'));
        return;
    }
    
    console.log('✅ Found theme toggle:', themeToggle);
    
    // Manually add click event as test
    themeToggle.addEventListener('click', function() {
        console.log('🎨 Manual test: Theme toggle clicked!');
        document.body.classList.toggle('dark-theme');
        
        // Toggle icon
        const icon = this.querySelector('i');
        if (icon) {
            if (document.body.classList.contains('dark-theme')) {
                icon.className = 'fas fa-sun';
                localStorage.setItem('theme', 'dark');
            } else {
                icon.className = 'fas fa-moon';
                localStorage.setItem('theme', 'light');
            }
        }
    });
    
    console.log('✅ Added manual theme toggle handler');
    
}, 2000);

