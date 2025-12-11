// Cart Management System
function initializeCart() {
    // Cart icon click event
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            toggleCart();
        });
    }
    
    // Close cart button
    const closeCart = document.getElementById('closeCart');
    if (closeCart) {
        closeCart.addEventListener('click', function() {
            closeCartSidebar();
        });
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            proceedToCheckout();
        });
    }
    
    // Back to cart button
    const backToCart = document.getElementById('backToCart');
    if (backToCart) {
        backToCart.addEventListener('click', function() {
            showCartPage();
        });
    }
    
    // Initial cart update
    updateCartUI();
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('active');
        updateCartItems();
    }
}

function closeCartSidebar() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.remove('active');
    }
}

function updateCartUI() {
    const cart = JSON.parse(localStorage.getItem('nandos_cart')) || [];
    const cartCount = document.querySelector('.cart-count');
    
    // Update cart count
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    
    // Update cart items if cart is open
    if (document.getElementById('cartSidebar').classList.contains('active')) {
        updateCartItems();
    }
}

function updateCartItems() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;
    
    const cart = JSON.parse(localStorage.getItem('nandos_cart')) || [];
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        updateCartSummary(0, 0, 0);
        return;
    }
    
    let itemsHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        itemsHTML += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-img" style="font-size: 30px; text-align: center; padding: 10px; background: #f8f9fa;">
                    ${item.image}
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">£${item.price.toFixed(2)}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `;
    });
    
    cartItems.innerHTML = itemsHTML;
    
    // Calculate VAT and total
    const vat = subtotal * 0.20; // 20% VAT
    const total = subtotal + vat;
    
    updateCartSummary(subtotal, vat, total);
}

function updateCartSummary(subtotal, vat, total) {
    const subtotalElement = document.getElementById('subtotal');
    const vatElement = document.getElementById('vat');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) subtotalElement.textContent = subtotal.toFixed(2);
    if (vatElement) vatElement.textContent = vat.toFixed(2);
    if (totalElement) totalElement.textContent = total.toFixed(2);
}

function updateQuantity(productId, change) {
    let cart = JSON.parse(localStorage.getItem('nandos_cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex === -1) return;
    
    const newQuantity = cart[itemIndex].quantity + change;
    
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    // Check stock availability
    const storedProducts = JSON.parse(localStorage.getItem('nandos_products')) || [];
    const product = storedProducts.find(p => p.id === productId);
    
    if (product && newQuantity > product.stock) {
        showMessage(`Only ${product.stock} items available in stock`, 'error');
        return;
    }
    
    cart[itemIndex].quantity = newQuantity;
    localStorage.setItem('nandos_cart', JSON.stringify(cart));
    updateCartUI();
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('nandos_cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('nandos_cart', JSON.stringify(cart));
    updateCartUI();
    showMessage('Item removed from cart', 'success');
}

function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem('nandos_cart')) || [];
    
    if (cart.length === 0) {
        showMessage('Your cart is empty', 'error');
        return;
    }
    
    // Close cart sidebar
    closeCartSidebar();
    
    // Show checkout page
    showCheckoutPage();
}

function showCheckoutPage() {
    const mainContent = document.querySelector('.main-content');
    const checkoutPage = document.getElementById('checkoutPage');
    
    if (mainContent) mainContent.style.display = 'none';
    if (checkoutPage) checkoutPage.style.display = 'block';
    
    // Update checkout summary
    updateCheckoutSummary();
}

function showCartPage() {
    const mainContent = document.querySelector('.main-content');
    const checkoutPage = document.getElementById('checkoutPage');
    
    if (mainContent) mainContent.style.display = 'block';
    if (checkoutPage) checkoutPage.style.display = 'none';
}

function updateCheckoutSummary() {
    const checkoutSummary = document.getElementById('checkoutSummary');
    const payAmount = document.getElementById('payAmount');
    
    if (!checkoutSummary || !payAmount) return;
    
    const cart = JSON.parse(localStorage.getItem('nandos_cart')) || [];
    let subtotal = 0;
    let summaryHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        summaryHTML += `
            <div class="summary-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>£${itemTotal.toFixed(2)}</span>
            </div>
        `;
    });
    
    const vat = subtotal * 0.20;
    const total = subtotal + vat;
    
    summaryHTML += `
        <div class="summary-divider"></div>
        <div class="summary-total">
            <span>Subtotal:</span>
            <span>£${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-total">
            <span>VAT (20%):</span>
            <span>£${vat.toFixed(2)}</span>
        </div>
        <div class="summary-total grand-total">
            <span>Total:</span>
            <span>£${total.toFixed(2)}</span>
        </div>
    `;
    
    checkoutSummary.innerHTML = summaryHTML;
    payAmount.textContent = total.toFixed(2);
    
    // Add CSS for summary
    const style = document.createElement('style');
    style.textContent = `
        .summary-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }
        .summary-divider {
            margin: 20px 0;
            border-top: 2px solid #eee;
        }
        .summary-total {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        .grand-total {
            font-weight: bold;
            font-size: 18px;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
        }
    `;
    document.head.appendChild(style);
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart only if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('nandos_current_user'));
    if (currentUser) {
        initializeCart();
    }
});
