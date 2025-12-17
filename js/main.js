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
    
    // ===== ELEMENTS =====
    const cylindricalHeader = document.querySelector('.cylindrical-header');
    const headerHamburger = document.getElementById('header-hamburger');
    const headerThemeToggle = document.getElementById('header-theme-toggle');
    const mobileOverlay = document.getElementById('mobile-menu-overlay');
    const mobileClose = document.getElementById('mobile-close');
    const mainLogo = document.getElementById('main-logo');
    const mobileLogo = document.querySelector('.mobile-logo-img');
    const allNavLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    // Check if elements exist
    if (!cylindricalHeader) {
        console.error('❌ Cylindrical header not found!');
        return;
    }
    
    console.log('✅ Header elements found:', {
        header: !!cylindricalHeader,
        hamburger: !!headerHamburger,
        themeToggle: !!headerThemeToggle,
        mobileOverlay: !!mobileOverlay,
        mainLogo: !!mainLogo
    });
    
    // ===== LOGO CONFIGURATION =====
    const LOGO_CONFIG = {
        light: '../assets/logo.png',
        dark: '../assets/white-logo.png' // Same for now
    };
    
    // Update logos for theme
    function updateLogos() {
        const isDark = document.body.classList.contains('dark-theme');
        const logoUrl = isDark ? LOGO_CONFIG.dark : LOGO_CONFIG.light;
        
        if (mainLogo) {
            mainLogo.src = logoUrl;
            if (isDark) {
                mainLogo.style.filter = 'brightness(0) invert(1)';
            } else {
                mainLogo.style.filter = 'none';
            }
        }
        
        if (mobileLogo) {
            mobileLogo.src = logoUrl;
            if (isDark) {
                mobileLogo.style.filter = 'brightness(0) invert(1)';
            } else {
                mobileLogo.style.filter = 'none';
            }
        }
    }
    
    // ===== MOBILE MENU =====
    if (headerHamburger && mobileOverlay && mobileClose) {
        console.log('✅ Mobile menu elements found');
        
        // Open mobile menu
        headerHamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('🍔 Hamburger clicked - Opening mobile menu');
            this.classList.add('active');
            mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        // Close mobile menu
        function closeMobileMenu() {
            console.log('📱 Closing mobile menu');
            headerHamburger.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        
        // Close with X button
        mobileClose.addEventListener('click', closeMobileMenu);
        
        // Close when clicking overlay
        mobileOverlay.addEventListener('click', function(e) {
            if (e.target === mobileOverlay) {
                closeMobileMenu();
            }
        });
        
        // Close when clicking nav links
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Close with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileOverlay.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    } else {
        console.warn('⚠️ Mobile menu elements missing');
    }
    
    // ===== THEME TOGGLE =====
    if (headerThemeToggle) {
        const themeIcon = headerThemeToggle.querySelector('i');
        
        // Check for saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
            console.log('🌙 Dark theme loaded from localStorage');
        } else {
            console.log('☀️ Light theme loaded');
        }
        
        // Update logos on initial load
        updateLogos();
        
        // Theme toggle click
        headerThemeToggle.addEventListener('click', function() {
            console.log('🎨 Theme toggle clicked');
            
            // Toggle theme
            document.body.classList.toggle('dark-theme');
            
            // Update icon
            if (themeIcon) {
                if (document.body.classList.contains('dark-theme')) {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                    localStorage.setItem('theme', 'dark');
                    console.log('🌙 Switched to dark theme');
                } else {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                    localStorage.setItem('theme', 'light');
                    console.log('☀️ Switched to light theme');
                }
            }
            
            // Update logos
            updateLogos();
        });
    } else {
        console.error('❌ Theme toggle button not found!');
    }
    
    // ===== SCROLL EFFECT =====
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            cylindricalHeader.classList.add('scrolled');
        } else {
            cylindricalHeader.classList.remove('scrolled');
        }
    });
    
    // Initialize scroll effect
    window.dispatchEvent(new Event('scroll'));
    
    // ===== ACTIVE LINK =====
    function setActiveLink() {
        const currentHash = window.location.hash || '#home';
        allNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentHash) {
                link.classList.add('active');
            }
        });
    }
    
    // Set active link on load
    setActiveLink();
    
    // Update active link on hash change
    window.addEventListener('hashchange', setActiveLink);
    
    // Also update when clicking links
    allNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                allNavLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // ===== INITIALIZATION COMPLETE =====
    console.log('✅ Premium Cylindrical Header initialized successfully!');
    
    // Add white logo later:
    console.log('📝 To add white logo for dark theme:');
    console.log('   1. Upload your white logo to an image host');
    console.log('   2. Update LOGO_CONFIG.dark with the URL');
    console.log('   3. Remove the filter line if using actual white logo');
});
// ===== FIX FOR HAMBURGER CLOSE =====
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for elements to load
    setTimeout(function() {
        const hamburger = document.querySelector('.cylindrical-header .hamburger');
        const navMenu = document.querySelector('.cylindrical-header .nav-menu');
        
        if (hamburger && navMenu) {
            console.log('✅ Found hamburger and nav-menu');
            
            // Close menu when clicking the X (pseudo-element)
            // We need to add a real close button
            const closeBtn = document.createElement('div');
            closeBtn.className = 'mobile-close-btn';
            closeBtn.innerHTML = '✕';
            closeBtn.style.cssText = `
                position: absolute;
                top: 30px;
                right: 30px;
                font-size: 2rem;
                color: var(--text-color);
                cursor: pointer;
                z-index: 999;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
                transition: all 0.3s ease;
            `;
            
            // Only add on mobile
            if (window.innerWidth <= 768) {
                navMenu.appendChild(closeBtn);
                
                // Close menu when clicking the X
                closeBtn.addEventListener('click', function() {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
                
                // Also close when clicking outside menu
                document.addEventListener('click', function(event) {
                    if (navMenu.classList.contains('active') && 
                        !navMenu.contains(event.target) && 
                        !hamburger.contains(event.target)) {
                        hamburger.classList.remove('active');
                        navMenu.classList.remove('active');
                    }
                });
            }
        }
    }, 100);
});
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".nav-menu a").forEach(link => {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

