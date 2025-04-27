function loadCSS(url) {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
    });
}

function preloadImages(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const images = temp.getElementsByTagName('img');
    const imagePromises = Array.from(images).map(img => {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = img.src;
            image.onload = resolve;
            image.onerror = reject;
        });
    });
    return Promise.all(imagePromises);
}

function initializeTheme() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme') || 
        (prefersDarkScheme.matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', currentTheme);
    return currentTheme;
}


function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

async function loadContent() {
    const app = document.getElementById('app');
    const spinner = document.getElementById('loading-spinner');
    
    try {
        await loadCSS('/virtualResume/src/styles.css');
        await loadCSS('/virtualResume/sass/main.css');
        
        // Then load the content
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/virtualResume/src/app.html', true);
        xhr.onload = async function() {
            if (this.status === 200) {
                // Create a temporary container to parse the HTML
                const temp = document.createElement('div');
                temp.innerHTML = this.responseText;
                
                // Get the content from the resume-container
                const content = temp.querySelector('.resume-container');
                
                // Preload all images before showing content
                try {
                    await preloadImages(content.outerHTML);
                    
                    // Now set the content
                    app.innerHTML = content.outerHTML;
                    
                    // Initialize theme and setup toggle after content is loaded
                    initializeTheme();
                    setupThemeToggle();
                    
                    // Show content with a fade effect
                    requestAnimationFrame(() => {
                        app.classList.add('visible');
                    });
                    
                    // Hide the spinner with a fade effect
                    spinner.style.transition = 'opacity 0.5s ease';
                    spinner.style.opacity = '0';
                    
                    // Remove the spinner from DOM after fade
                    setTimeout(() => {
                        spinner.remove();
                        document.body.style.overflow = 'auto';
                    }, 500);
                } catch (error) {
                    console.error('Error preloading images:', error);
                    // Still show content even if some images fail to load
                    app.innerHTML = content.outerHTML;
                    app.classList.add('visible');
                    spinner.remove();
                    document.body.style.overflow = 'auto';
                }
            }
        }
        xhr.send();
    } catch (error) {
        console.error('Error loading resources:', error);
        spinner.innerHTML = 'Error loading resources. Please refresh the page.';
    }
}

// Start loading immediately
loadContent();

// Existing social icons hover functionality
const socialIconLinksChildren = document.querySelector('.socialIcons').children;

[...socialIconLinksChildren].forEach((icon) => {
    icon.addEventListener('mouseover', () => {
        icon.classList.toggle('socialIcons_icon--hover');
    });
    icon.addEventListener('mouseout', () => {
        icon.classList.toggle('socialIcons_icon--hover');
    });
});