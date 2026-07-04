// JavaScript for Watches.html page

document.addEventListener('DOMContentLoaded', function() {
    // Initialize sidebar functionality
    initSidebar();
    
    // Make sure regular "Add to Cart" buttons on this page also work
    const addToCartButtons = document.querySelectorAll('.watch-info .add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const watchItem = this.closest('.watch-item');
            const productName = watchItem.querySelector('h3').textContent;
            const priceText = watchItem.querySelector('.watch-price').textContent.replace('PKR', '').replace(',', '').trim();
            const price = parseFloat(priceText);
            const image = watchItem.querySelector('img').src;
            
            // Use the addToCart function from cart.js
            if (typeof addToCart === 'function') {
                addToCart(productName, price, image);
            } else {
                console.error('addToCart function not found. Make sure cart.js is loaded properly.');
            }
        });
    });
    
    // Scroll effect for header
    window.addEventListener('scroll', function() {
        const header = document.getElementById('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});

function initSidebar() {
    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchBtn && searchInput) {
        // Search when button is clicked
        searchBtn.addEventListener('click', function() {
            searchWatches(searchInput.value);
        });
        
        // Search when Enter key is pressed
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchWatches(searchInput.value);
            }
        });
    }
    
    // Category filter links
    const categoryLinks = document.querySelectorAll('.sidebar-categories a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('href').substring(1); // Remove the # from href
            filterWatchesByCategory(category);
            
            // Highlight active category
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Function to search watches by name
function searchWatches(query) {
    query = query.toLowerCase().trim();
    
    // If search query is empty, show all watches
    if (query === '') {
        resetFilters();
        return;
    }
    
    const watches = document.querySelectorAll('.watch-item');
    let foundMatches = false;
    
    watches.forEach(watch => {
        const title = watch.querySelector('h3').textContent.toLowerCase();
        if (title.includes(query)) {
            watch.style.display = 'block';
            foundMatches = true;
        } else {
            watch.style.display = 'none';
        }
    });
    
    // Show message if no watches match the search
    displayNoResultsMessage(!foundMatches);
}

// Function to filter watches by category
function filterWatchesByCategory(category) {
    const sectionTitle = document.querySelector('.section-title');
    let foundMatches = false;
    
    if (category === 'all') {
        sectionTitle.textContent = 'All Watches';
        const watches = document.querySelectorAll('.watch-item');
        watches.forEach(watch => {
            watch.style.display = 'block';
        });
        foundMatches = true;
    } else {
        if (category === 'men') {
            sectionTitle.textContent = 'Men\'s Watches';
        } else if (category === 'women') {
            sectionTitle.textContent = 'Women\'s Watches';
        } else if (category === 'smart') {
            sectionTitle.textContent = 'Smart Watches';
        }
        
        const watches = document.querySelectorAll('.watch-item');
        
        watches.forEach(watch => {
            const hasClass = watch.classList.contains(category);
            const title = watch.querySelector('h3').textContent.toLowerCase();
            let titleMatch = false;
            
            if (category === 'men') {
                titleMatch = (title.includes('men') && !title.includes('women'));
            } else if (category === 'women') {
                titleMatch = title.includes('women');
            } else if (category === 'smart') {
                titleMatch = (
                    title.includes('smart') || 
                    title.includes('digital') || 
                    title.includes('tech') || 
                    title.includes('track') ||
                    title.includes('ultra')
                );
            }
            
            if (hasClass || titleMatch) {
                watch.style.display = 'block';
                foundMatches = true;
            } else {
                watch.style.display = 'none';
            }
        });
    }
    
    displayNoResultsMessage(!foundMatches);
}

// Function to reset all filters
function resetFilters() {
    const watches = document.querySelectorAll('.watch-item');
    watches.forEach(watch => {
        watch.style.display = 'block';
    });
    
    const sectionTitle = document.querySelector('.section-title');
    if (sectionTitle) {
        sectionTitle.textContent = 'All Watches';
    }
    
    displayNoResultsMessage(false);
}

// Function to display "No results found" message
function displayNoResultsMessage(show) {
    const existingMessage = document.querySelector('.no-results-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    if (show) {
        const watchesGrid = document.querySelector('.watches-grid');
        if (watchesGrid) {
            const messageElement = document.createElement('div');
            messageElement.className = 'no-results-message';
            messageElement.textContent = 'No watches found matching your criteria.';
            messageElement.style.textAlign = 'center';
            messageElement.style.padding = '30px 0';
            messageElement.style.width = '100%';
            messageElement.style.color = '#666';
            
            watchesGrid.appendChild(messageElement);
        }
    }
}
