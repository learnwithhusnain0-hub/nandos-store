// Authentication System
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const currentUser = JSON.parse(localStorage.getItem('nandos_current_user'));
    
    if (currentUser) {
        showMainContent(currentUser);
    } else {
        showLoginModal();
    }
    
    // Initialize authentication system
    initAuthSystem();
});

function showLoginModal() {
    const loginModal = document.getElementById('loginModal');
    const mainContent = document.getElementById('mainContent');
    
    if (loginModal) {
        loginModal.style.display = 'flex';
    }
    if (mainContent) {
        mainContent.style.display = 'none';
    }
}

function showMainContent(user) {
    const loginModal = document.getElementById('loginModal');
    const mainContent = document.getElementById('mainContent');
    
    if (loginModal) {
        loginModal.style.display = 'none';
    }
    if (mainContent) {
        mainContent.style.display = 'block';
    }
    
    // Update user info in header
    updateUserInfo(user);
}

function initAuthSystem() {
    const users = JSON.parse(localStorage.getItem('nandos_users')) || [];
    let verificationCode = null;
    let tempUser = null;
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = value.match(/.{1,4}/g).join(' ');
            }
            e.target.value = value;
        });
    }
    
    // Verification code input
    const codeInput = document.getElementById('code');
    if (codeInput) {
        codeInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
        });
    }
    
    // Send code button
    const sendCodeBtn = document.getElementById('sendCodeBtn');
    if (sendCodeBtn) {
        sendCodeBtn.addEventListener('click', function() {
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const countryCode = document.getElementById('countryCode').value;
            
            if (!validateEmail(email)) {
                showMessage('Please enter a valid email address', 'error');
                return;
            }
            
            if (!phone || phone.replace(/\s/g, '').length < 10) {
                showMessage('Please enter a valid phone number', 'error');
                return;
            }
            
            // Generate 4-digit code
            verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
            
            // Show SMS notification
            showSMSNotification(verificationCode);
            
            // Show verification section
            document.querySelector('.verification-code').style.display = 'block';
            sendCodeBtn.style.display = 'none';
            
            // Store temporary user data
            tempUser = {
                email: email,
                phone: countryCode + phone.replace(/\s/g, ''),
                timestamp: new Date().toISOString()
            };
            
            // Show success message
            showMessage('Verification code sent to your phone', 'success');
        });
    }
    
    // Verify button
    const verifyBtn = document.getElementById('verifyBtn');
    if (verifyBtn) {
        verifyBtn.addEventListener('click', function() {
            const enteredCode = document.getElementById('code').value;
            
            if (enteredCode.length !== 4) {
                showMessage('Please enter 4-digit code', 'error');
                return;
            }
            
            if (enteredCode === verificationCode) {
                loginUser(tempUser);
            } else {
                showMessage('Invalid verification code', 'error');
            }
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('nandos_current_user');
            showLoginModal();
            showMessage('Logged out successfully', 'success');
        });
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showSMSNotification(code) {
    const smsDiv = document.getElementById('smsNotification');
    if (!smsDiv) return;
    
    document.getElementById('smsCode').textContent = code;
    
    smsDiv.style.display = 'block';
    
    // Auto hide after 30 seconds
    setTimeout(() => {
        smsDiv.style.display = 'none';
    }, 30000);
    
    // Hide on click
    smsDiv.addEventListener('click', () => {
        smsDiv.style.display = 'none';
    });
}

function loginUser(userData) {
    const users = JSON.parse(localStorage.getItem('nandos_users')) || [];
    
    // Check if user exists
    let user = users.find(u => u.email === userData.email);
    
    if (!user) {
        // Create new user
        user = {
            id: 'user_' + Date.now(),
            email: userData.email,
            phone: userData.phone,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            orders: [],
            cards: []
        };
        users.push(user);
        localStorage.setItem('nandos_users', JSON.stringify(users));
    } else {
        // Update last login
        user.lastLogin = new Date().toISOString();
        localStorage.setItem('nandos_users', JSON.stringify(users));
    }
    
    // Set as current user
    localStorage.setItem('nandos_current_user', JSON.stringify(user));
    
    // Show success and redirect
    showMessage('Login successful! Welcome to Nandos UK', 'success');
    
    setTimeout(() => {
        showMainContent(user);
        initializeCart();
        loadProducts();
    }, 1500);
}

function updateUserInfo(user) {
    const userEmailElement = document.getElementById('userEmail');
    if (userEmailElement && user) {
        userEmailElement.textContent = user.email;
    }
}

function showMessage(message, type) {
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add styles for animation
    const style = document.createElement('style');
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
    `;
    document.head.appendChild(style);
    
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
}

// Initialize auth system when DOM is loaded
document.addEventListener('DOMContentLoaded', initAuthSystem);
