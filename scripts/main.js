// Main JavaScript File - Initializes all systems
document.addEventListener('DOMContentLoaded', function() {
    console.log('Nandos UK Website Initializing...');
    
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('nandos_current_user'));
    
    if (currentUser) {
        // User is logged in - show main content
        initializeLoggedInState(currentUser);
    } else {
        // User is not logged in - show login modal
        showLoginModal();
    }
    
    // Initialize all systems
    initializeNavigation();
    initializeCartSystem();
    initializePaymentSystem();
    initializeAdminSystem();
    initializeEventListeners();
    
    console.log('Nandos UK Website Ready!');
});

function initializeLoggedInState(user) {
    // Hide login modal
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.style.display = 'none';
    }
    
    // Show main content
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        mainContent.style.display = 'block';
    }
    
    // Update user info
    updateUserInfo(user);
    
    // Load products
    loadProducts();
    
    // Initialize cart
    initializeCart();
}

function updateUserInfo(user) {
    const userEmailElement = document.getElementById('userEmail');
    if (userEmailElement && user) {
        userEmailElement.textContent = user.email;
    }
}

function initializeNavigation() {
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Handle different pages
            const page = this.getAttribute('data-page');
            handlePageNavigation(page);
        });
    });
}

function handlePageNavigation(page) {
    switch(page) {
        case 'home':
            // Already on home page
            break;
        case 'menu':
            // Could load different product categories
            showMessage('Menu page coming soon!', 'info');
            break;
        case 'deals':
            // Could show special deals
            showMessage('Check out our hot deals!', 'info');
            break;
        case 'contact':
            // Could show contact form
            showMessage('Contact us at +44 20 7123 4567', 'info');
            break;
    }
}

function initializeCartSystem() {
    // Cart icon click
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', toggleCart);
    }
    
    // Close cart button
    const closeCart = document.getElementById('closeCart');
    if (closeCart) {
        closeCart.addEventListener('click', closeCartSidebar);
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }
    
    // Back to cart button
    const backToCart = document.getElementById('backToCart');
    if (backToCart) {
        backToCart.addEventListener('click', showCartPage);
    }
    
    // Update cart count
    updateCartCount();
}

function initializePaymentSystem() {
    // Card number formatting
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', formatCardNumber);
    }
    
    // Expiry date formatting
    const expiryDateInput = document.getElementById('expiryDate');
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', formatExpiryDate);
    }
    
    // CVV formatting
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', formatCVV);
    }
    
    // Pay now button
    const payNowBtn = document.getElementById('payNowBtn');
    if (payNowBtn) {
        payNowBtn.addEventListener('click', processPayment);
    }
}

function initializeAdminSystem() {
    // Hidden admin access
    const adminAccess = document.getElementById('adminAccess');
    if (adminAccess) {
        adminAccess.addEventListener('click', promptAdminLogin);
    }
}

function initializeEventListeners() {
    // Window resize handling
    window.addEventListener('resize', handleResize);
    
    // Click outside cart to close
    document.addEventListener('click', function(e) {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartIcon = document.getElementById('cartIcon');
        
        if (cartSidebar && cartSidebar.classList.contains('active') && 
            !cartSidebar.contains(e.target) && 
            !cartIcon.contains(e.target)) {
            closeCartSidebar();
        }
    });
    
    // Escape key to close cart
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCartSidebar();
        }
    });
}

function handleResize() {
    // Adjust UI based on screen size
    const cartSidebar = document.getElementById('cartSidebar');
    if (window.innerWidth < 768 && cartSidebar.classList.contains('active')) {
        cartSidebar.style.width = '100%';
    } else if (cartSidebar) {
        cartSidebar.style.width = '400px';
    }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('nandos_cart')) || [];
    const cartCount = document.querySelector('.cart-count');
    
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Utility Functions
function formatCardNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
        value = value.match(/.{1,4}/g).join(' ');
    }
    e.target.value = value.slice(0, 19);
}

function formatExpiryDate(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }
    e.target.value = value.slice(0, 5);
}

function formatCVV(e) {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
}

function showMessage(message, type) {
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
        background: ${type === 'success' ? '#4caf50' : 
                     type === 'error' ? '#f44336' : 
                     type === 'info' ? '#2196f3' : '#ff9800'};
        color: white;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    // Add to document
    document.body.appendChild(messageDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 3000);
    
    // Add animation styles if not already present
    if (!document.querySelector('#messageStyles')) {
        const style = document.createElement('style');
        style.id = 'messageStyles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}
// Main JavaScript میں admin access fix شامل کریں
function initializeAdminAccess() {
    console.log("Setting up admin access...");
    
    const adminAccess = document.getElementById('adminAccess');
    
    if (adminAccess) {
        // Make sure it's clickable
        adminAccess.style.cursor = 'pointer';
        adminAccess.style.userSelect = 'none';
        
        // Remove any existing event listeners
        const newAdminAccess = adminAccess.cloneNode(true);
        adminAccess.parentNode.replaceChild(newAdminAccess, adminAccess);
        
        // Add click event
        newAdminAccess.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("Admin access clicked from main.js");
            promptAdminLogin();
        });
        
        // Add hover effects
        newAdminAccess.addEventListener('mouseover', function() {
            this.style.opacity = '1';
            this.style.color = '#d32f2f';
        });
        
        newAdminAccess.addEventListener('mouseout', function() {
            this.style.opacity = '0.3';
            this.style.color = '#999';
        });
        
        console.log("Admin access setup complete");
    } else {
        console.log("Admin access element not found!");
        // Try to find it after a delay
        setTimeout(() => {
            const foundAdmin = document.getElementById('adminAccess');
            if (foundAdmin) {
                initializeAdminAccess(); // Retry
            }
        }, 1000);
    }
}

// DOM loaded پر initialize کریں
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminAccess();
    
    // Alternative: Direct onclick attribute (simplest solution)
    const adminAccess = document.getElementById('adminAccess');
    if (adminAccess) {
        adminAccess.setAttribute('onclick', 'showAdminLogin()');
    }
});

// Simple admin login function
function showAdminLogin() {
    const username = prompt("Enter Admin Username:");
    if (!username) return;
    
    const password = prompt("Enter Admin Password:");
    if (!password) return;
    
    if (username === "Husnain" && password === "03038776223") {
        localStorage.setItem('nandos_admin_logged_in', 'true');
        window.location.href = 'admin/panel.html';
    } else {
        alert("Invalid admin credentials");
    }
}
// Export functions to global scope for HTML onclick attributes
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.viewUserDetails = viewUserDetails;
window.addNewProduct = addNewProduct;
window.saveProductChanges = saveProductChanges;
window.closeModal = closeModal;

// Make sure essential functions are available
if (typeof addToCart === 'undefined') {
    window.addToCart = function(productId) {
        // Fallback function
        showMessage('Product added to cart', 'success');
    };
}
