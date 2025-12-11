// Admin Panel System - FIXED VERSION
const ADMIN_CREDENTIALS = {
    username: 'Husnain',
    password: '03038776223'
};

function initializeAdminSystem() {
    console.log("Initializing Admin System...");
    
    // Hidden admin access text - FIXED SELECTOR
    const adminAccessText = document.getElementById('adminAccess');
    
    if (adminAccessText) {
        console.log("Admin access text found, adding click event...");
        
        adminAccessText.style.cursor = 'pointer';
        adminAccessText.style.opacity = '0.5';
        adminAccessText.style.transition = 'all 0.3s';
        
        adminAccessText.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("Admin access clicked!");
            promptAdminLogin();
        });
        
        adminAccessText.addEventListener('mouseover', function() {
            this.style.opacity = '1';
            this.style.color = '#d32f2f';
        });
        
        adminAccessText.addEventListener('mouseout', function() {
            this.style.opacity = '0.5';
            this.style.color = '#999';
        });
    } else {
        console.log("Admin access text NOT FOUND!");
        // Try alternative selectors
        const altAdminAccess = document.querySelector('.hidden-admin-text');
        if (altAdminAccess) {
            console.log("Found with alternative selector");
            setupAdminClick(altAdminAccess);
        }
    }
    
    // Admin logout button
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', function() {
            localStorage.removeItem('nandos_admin_logged_in');
            window.location.href = 'index.html';
        });
    }
}

function setupAdminClick(element) {
    element.style.cursor = 'pointer';
    element.style.opacity = '0.5';
    
    element.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        promptAdminLogin();
    });
    
    element.addEventListener('mouseover', function() {
        this.style.opacity = '1';
        this.style.color = '#d32f2f';
    });
    
    element.addEventListener('mouseout', function() {
        this.style.opacity = '0.5';
        this.style.color = '#999';
    });
}

function promptAdminLogin() {
    console.log("Showing admin login prompt...");
    
    // Create modal for admin login
    const modalHTML = `
        <div class="admin-login-modal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            backdrop-filter: blur(5px);
        ">
            <div style="
                background: white;
                padding: 40px;
                border-radius: 15px;
                width: 90%;
                max-width: 400px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                animation: modalSlide 0.3s ease-out;
            ">
                <h2 style="color: #d32f2f; margin-bottom: 20px; text-align: center;">
                    <i class="fas fa-crown"></i> Admin Login
                </h2>
                
                <div class="form-group" style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; color: #555;">
                        <i class="fas fa-user"></i> Username
                    </label>
                    <input type="text" id="adminUsernameInput" 
                        style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px;"
                        placeholder="Enter admin username">
                </div>
                
                <div class="form-group" style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 8px; color: #555;">
                        <i class="fas fa-lock"></i> Password
                    </label>
                    <input type="password" id="adminPasswordInput" 
                        style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px;"
                        placeholder="Enter admin password">
                </div>
                
                <div id="adminLoginError" style="
                    color: #f44336;
                    margin-bottom: 15px;
                    padding: 10px;
                    background: #ffebee;
                    border-radius: 5px;
                    display: none;
                "></div>
                
                <div style="display: flex; gap: 15px;">
                    <button id="adminLoginSubmit" style="
                        flex: 1;
                        background: #d32f2f;
                        color: white;
                        border: none;
                        padding: 12px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                    ">
                        <i class="fas fa-sign-in-alt"></i> Login
                    </button>
                    
                    <button id="adminLoginCancel" style="
                        background: #f5f5f5;
                        color: #666;
                        border: none;
                        padding: 12px 20px;
                        border-radius: 8px;
                        cursor: pointer;
                    ">
                        Cancel
                    </button>
                </div>
                
                <p style="margin-top: 20px; font-size: 12px; color: #999; text-align: center;">
                    <i class="fas fa-info-circle"></i> Restricted access - authorized personnel only
                </p>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes modalSlide {
            from {
                transform: translateY(-50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Focus on username input
    setTimeout(() => {
        const usernameInput = document.getElementById('adminUsernameInput');
        if (usernameInput) usernameInput.focus();
    }, 100);
    
    // Add event listeners
    document.getElementById('adminLoginSubmit').addEventListener('click', handleAdminLogin);
    document.getElementById('adminLoginCancel').addEventListener('click', closeAdminModal);
    
    // Allow Enter key to submit
    document.getElementById('adminUsernameInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleAdminLogin();
    });
    
    document.getElementById('adminPasswordInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleAdminLogin();
    });
}

function handleAdminLogin() {
    const username = document.getElementById('adminUsernameInput').value.trim();
    const password = document.getElementById('adminPasswordInput').value.trim();
    const errorDiv = document.getElementById('adminLoginError');
    
    console.log("Login attempt:", { username, password });
    
    // Clear previous error
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
    
    // Validate credentials
    if (!username || !password) {
        errorDiv.textContent = 'Please enter both username and password';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Successful login
        console.log("Admin login successful!");
        localStorage.setItem('nandos_admin_logged_in', 'true');
        
        // Close modal
        closeAdminModal();
        
        // Redirect to admin panel
        window.location.href = 'admin/panel.html';
    } else {
        // Failed login
        errorDiv.textContent = 'Invalid username or password';
        errorDiv.style.display = 'block';
        
        // Shake animation
        const modal = document.querySelector('.admin-login-modal > div');
        modal.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            modal.style.animation = '';
        }, 500);
        
        // Add shake animation
        const shakeStyle = document.createElement('style');
        shakeStyle.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(shakeStyle);
        
        // Clear password field
        document.getElementById('adminPasswordInput').value = '';
        document.getElementById('adminPasswordInput').focus();
    }
}

function closeAdminModal() {
    const modal = document.querySelector('.admin-login-modal');
    if (modal) {
        modal.remove();
    }
}

function checkAdminAuth() {
    const isAdminLoggedIn = localStorage.getItem('nandos_admin_logged_in') === 'true';
    
    if (!isAdminLoggedIn) {
        // Redirect to home page if not logged in
        window.location.href = '../index.html';
        return false;
    }
    
    return true;
}

// Make sure admin system initializes when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing admin system...");
    initializeAdminSystem();
});

// Also initialize when page is fully loaded
window.addEventListener('load', function() {
    console.log("Page fully loaded, checking admin system...");
    // Re-check admin access in case it was added dynamically
    setTimeout(initializeAdminSystem, 100);
});
