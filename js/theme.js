// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
let themeIcon = null;

if (themeToggle) {
    themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
            // Dispatch custom event for theme change
            document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: 'dark' } }));
        } else {
            localStorage.setItem('theme', 'light');
            if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
            // Dispatch custom event for theme change
            document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: 'light' } }));
        }
    });
}

// Listen for theme changes to update components
document.addEventListener('themeChanged', (e) => {
    console.log(`Theme changed to: ${e.detail.theme}`);
    // You can add additional theme-dependent functionality here
});