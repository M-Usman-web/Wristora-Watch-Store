// Cart functionality for Watch Store
let cart = [];
let cartOpen = false;

document.addEventListener('DOMContentLoaded', function() {
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('watchStoreCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }

    // Add event listener to cart icon
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', toggleCart);
    }

    // Add event listeners to all "Buy Now" buttons
    const buyButtons = document.querySelectorAll('.add-to-cart-btn');
    buyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const productCard = e.target.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('p').textContent;
            const productImage = productCard.querySelector('img').src;
            
            // Extract numeric price (remove 'PKR' and any commas)
            const priceText = productPrice.replace('PKR', '').replace(',', '').trim();
            const price = parseFloat(priceText);
            
            addToCart(productName, price, productImage);
        });
    });

    // Create cart container if it doesn't exist
    if (!document.getElementById('cart-container')) {
        createCartContainer();
    }
});

function createCartContainer() {
    const cartContainer = document.createElement('div');
    cartContainer.id = 'cart-container';
    cartContainer.className = 'cart-container';
    cartContainer.style.display = 'none';
    
    cartContainer.innerHTML = `
        <div class="cart-header">
            <h3>Your Cart</h3>
            <button id="close-cart">×</button>
        </div>
        <div id="cart-items" class="cart-items">
            <!-- Cart items will be displayed here -->
        </div>
        <div class="cart-footer">
            <div class="cart-total">
                <span>Total:</span>
                <span id="cart-total-price">PKR 0</span>
            </div>
            <button id="place-order-btn" class="place-order-btn">Place Order</button>
        </div>
    `;  
    document.body.appendChild(cartContainer);
    
    // Add event listeners for cart functionality
    document.getElementById('close-cart').addEventListener('click', toggleCart);
    document.getElementById('place-order-btn').addEventListener('click', placeOrder);
}

function addToCart(name, price, image) {
    // Check if item is already in cart
    const existingItemIndex = cart.findIndex(item => item.name === name);
    
    if (existingItemIndex !== -1) {
     
        cart[existingItemIndex].quantity += 1;
    } else {
        // Add new item if it doesn't exist
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    // Save cart to localStorage
    localStorage.setItem('watchStoreCart', JSON.stringify(cart));
    
    // Update cart UI
    updateCartCount();
    renderCartItems();
    
    // Show notification
    showNotification(`${name} added to cart!`);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('watchStoreCart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

function updateItemQuantity(index, change) {
    // Make sure we have a valid item
    if (index >= 0 && index < cart.length) {
        // Update quantity
        cart[index].quantity += change;
        
        // If quantity reaches 0 or less, remove the item
        if (cart[index].quantity <= 0) {
            removeFromCart(index);
            return;
        }
        
        // Save cart to localStorage
        localStorage.setItem('watchStoreCart', JSON.stringify(cart));
        
        // Update UI
        updateCartCount();
        renderCartItems();
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        let totalItems = 0;
        cart.forEach(item => {
            totalItems += item.quantity;
        });
        cartCount.textContent = totalItems;
    }
}

function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    
    if (cartItemsContainer) {
        // Clear current items
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
        } else {
            // Add each item to the cart UI
            cart.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>PKR ${item.price.toLocaleString()}</p>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn decrease-btn" data-index="${index}">-</button>
                            <span class="item-quantity">${item.quantity}</span>
                            <button class="quantity-btn increase-btn" data-index="${index}">+</button>
                        </div>
                    </div>
                    <button class="remove-item-btn" data-index="${index}">×</button>
                `;
                
                cartItemsContainer.appendChild(cartItem);
            });
            
            // Add event listeners to remove buttons
            const removeButtons = document.querySelectorAll('.remove-item-btn');
            removeButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    const index = parseInt(e.target.getAttribute('data-index'));
                    removeFromCart(index);
                });
            });
            
            // Add event listeners to increase and decrease buttons
            const increaseButtons = document.querySelectorAll('.increase-btn');
            increaseButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    const index = parseInt(e.target.getAttribute('data-index'));
                    updateItemQuantity(index, 1);
                });
            });
            
            const decreaseButtons = document.querySelectorAll('.decrease-btn');
            decreaseButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    const index = parseInt(e.target.getAttribute('data-index'));
                    updateItemQuantity(index, -1);
                });
            });
        }
        
        // Update total price
        if (cartTotalPrice) {
            cartTotalPrice.textContent = `PKR ${calculateTotal().toLocaleString()}`;
        }
    }
}

function toggleCart() {
    const cartContainer = document.getElementById('cart-container');
    if (cartContainer) {
        cartOpen = !cartOpen;
        cartContainer.style.display = cartOpen ? 'block' : 'none';
        
        if (cartOpen) {
            renderCartItems();
        }
    }
}

function placeOrder() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    // Clear the cart
    cart = [];
    localStorage.setItem('watchStoreCart', JSON.stringify(cart));
    
    // Update UI
    updateCartCount();
    renderCartItems();
    
    // Show success message
    showNotification('Order placed successfully!', 'success');
    
    // Close cart after order
    setTimeout(() => {
        toggleCart();
    }, 2000);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after a delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}