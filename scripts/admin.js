// Payment System
let paymentAttempts = 0;

function initializePayment() {
    // Card number formatting
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = value.match(/.{1,4}/g).join(' ');
            }
            e.target.value = value.slice(0, 19);
        });
    }
    
    // Expiry date formatting
    const expiryDateInput = document.getElementById('expiryDate');
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2);
            }
            e.target.value = value.slice(0, 5);
        });
    }
    
    // CVV formatting
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
        });
    }
    
    // Pay now button
    const payNowBtn = document.getElementById('payNowBtn');
    if (payNowBtn) {
        payNowBtn.addEventListener('click', function() {
            processPayment();
        });
    }
}

function validateCardDetails() {
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const cardName = document.getElementById('cardName').value.trim();
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    
    // Reset error states
    resetErrors();
    
    let isValid = true;
    
    // Validate card number (16 digits)
    if (!/^\d{16}$/.test(cardNumber)) {
        showError('cardNumber', 'Please enter a valid 16-digit card number');
        isValid = false;
    }
    
    // Validate card name
    if (!cardName || cardName.length < 3) {
        showError('cardName', 'Please enter cardholder name');
        isValid = false;
    }
    
    // Validate expiry date
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(expiryDate)) {
        showError('expiryDate', 'Please enter valid expiry date (MM/YY)');
        isValid = false;
    } else {
        // Check if card is expired
        const [month, year] = expiryDate.split('/');
        const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
        const today = new Date();
        if (expiry < today) {
            showError('expiryDate', 'Card has expired');
            isValid = false;
        }
    }
    
    // Validate CVV
    if (!/^\d{3}$/.test(cvv)) {
        showError('cvv', 'Please enter valid 3-digit CVV');
        isValid = false;
    }
    
    return isValid;
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.style.borderColor = '#f44336';
        
        // Create error message
        let errorDiv = field.parentNode.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            field.parentNode.appendChild(errorDiv);
        }
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        errorDiv.style.cssText = 'color: #f44336; font-size: 12px; margin-top: 5px;';
    }
}

function resetErrors() {
    const fields = ['cardNumber', 'cardName', 'expiryDate', 'cvv'];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.style.borderColor = '';
            
            const errorDiv = field.parentNode.querySelector('.error-message');
            if (errorDiv) {
                errorDiv.remove();
            }
        }
    });
}

function processPayment() {
    // Validate card details
    if (!validateCardDetails()) {
        return;
    }
    
    // Get user info
    const currentUser = JSON.parse(localStorage.getItem('nandos_current_user'));
    if (!currentUser) {
        showMessage('Please login to continue', 'error');
        return;
    }
    
    // Get cart total
    const cart = JSON.parse(localStorage.getItem('nandos_cart')) || [];
    if (cart.length === 0) {
        showMessage('Your cart is empty', 'error');
        return;
    }
    
    // Simulate payment processing
    paymentAttempts++;
    
    const paymentStatus = document.getElementById('paymentStatus');
    const payNowBtn = document.getElementById('payNowBtn');
    
    // Disable button during processing
    payNowBtn.disabled = true;
    payNowBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    // Simulate API call delay
    setTimeout(() => {
        if (paymentAttempts <= 2) {
            // First two attempts fail
            paymentStatus.className = 'payment-status error';
            paymentStatus.innerHTML = `
                <i class="fas fa-times-circle"></i> 
                Payment declined. Please check your card details and try again.
                <br><small>Attempt ${paymentAttempts}/3</small>
            `;
            paymentStatus.style.display = 'block';
            
            // Reset button
            payNowBtn.disabled = false;
            payNowBtn.innerHTML = `<i class="fas fa-lock"></i> Pay £${document.getElementById('payAmount').textContent}`;
            
            // Save failed payment attempt
            savePaymentAttempt(currentUser, false);
        } else {
            // Third attempt succeeds
            paymentStatus.className = 'payment-status success';
            paymentStatus.innerHTML = `
                <i class="fas fa-check-circle"></i> 
                Payment successful! Your order has been placed.
            `;
            paymentStatus.style.display = 'block';
            
            // Save card for future use
            saveCardDetails(currentUser);
            
            // Create order
            createOrder(currentUser);
            
            // Clear cart
            localStorage.removeItem('nandos_cart');
            
            // Update cart UI
            updateCartUI();
            
            // Redirect to home after 3 seconds
            setTimeout(() => {
                showMessage('Order placed successfully! Thank you for shopping with Nandos UK', 'success');
                showCartPage();
                paymentAttempts = 0; // Reset attempts for next order
            }, 3000);
        }
    }, 2000);
}

function saveCardDetails(user) {
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const cardName = document.getElementById('cardName').value.trim();
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('nandos_users')) || [];
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1) {
        // Add card to user's cards
        if (!users[userIndex].cards) {
            users[userIndex].cards = [];
        }
        
        // Check if card already exists
        const cardExists = users[userIndex].cards.some(card => 
            card.number === cardNumber && card.expiry === expiryDate
        );
        
        if (!cardExists) {
            users[userIndex].cards.push({
                number: cardNumber,
                name: cardName,
                expiry: expiryDate,
                cvv: cvv,
                addedAt: new Date().toISOString()
            });
            
            // Save updated users
            localStorage.setItem('nandos_users', JSON.stringify(users));
        }
    }
}

function savePaymentAttempt(user, success) {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('nandos_users')) || [];
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1) {
        // Initialize payment history if not exists
        if (!users[userIndex].paymentHistory) {
            users[userIndex].paymentHistory = [];
        }
        
        // Add payment attempt
        users[userIndex].paymentHistory.push({
            timestamp: new Date().toISOString(),
            success: success,
            attempts: paymentAttempts
        });
        
        // Save updated users
        localStorage.setItem('nandos_users', JSON.stringify(users));
    }
}

function createOrder(user) {
    const cart = JSON.parse(localStorage.getItem('nandos_cart')) || [];
    
    // Calculate totals
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    const vat = subtotal * 0.20;
    const total = subtotal + vat;
    
    // Create order object
    const order = {
        id: 'order_' + Date.now(),
        userId: user.id,
        items: [...cart],
        subtotal: subtotal,
        vat: vat,
        total: total,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        paymentMethod: 'card',
        paymentAttempts: paymentAttempts
    };
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('nandos_users')) || [];
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1) {
        // Add order to user's orders
        if (!users[userIndex].orders) {
            users[userIndex].orders = [];
        }
        users[userIndex].orders.push(order);
        
        // Save updated users
        localStorage.setItem('nandos_users', JSON.stringify(users));
        
        // Update current user
        localStorage.setItem('nandos_current_user', JSON.stringify(users[userIndex]));
    }
    
    // Update product stock
    updateProductStock(cart);
    
    return order;
}

function updateProductStock(cartItems) {
    const storedProducts = JSON.parse(localStorage.getItem('nandos_products')) || [];
    
    cartItems.forEach(cartItem => {
        const productIndex = storedProducts.findIndex(p => p.id === cartItem.id);
        if (productIndex !== -1) {
            storedProducts[productIndex].stock = Math.max(
                0,
                storedProducts[productIndex].stock - cartItem.quantity
            );
        }
    });
    
    localStorage.setItem('nandos_products', JSON.stringify(storedProducts));
}

// Initialize payment when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePayment();
});
