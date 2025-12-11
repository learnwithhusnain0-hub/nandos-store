// Admin Panel System
const ADMIN_CREDENTIALS = {
    username: 'Husnain',
    password: '03038776223'
};

function initializeAdminSystem() {
    // Hidden admin access text
    const adminAccessText = document.getElementById('adminAccess');
    if (adminAccessText) {
        adminAccessText.addEventListener('click', function() {
            promptAdminLogin();
        });
    }
    
    // Admin logout button (if on admin page)
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', function() {
            localStorage.removeItem('nandos_admin_logged_in');
            window.location.href = 'index.html';
        });
    }
}

function promptAdminLogin() {
    const username = prompt('Enter Admin Username:');
    if (!username) return;
    
    const password = prompt('Enter Admin Password:');
    if (!password) return;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Set admin login flag
        localStorage.setItem('nandos_admin_logged_in', 'true');
        
        // Redirect to admin panel
        window.location.href = 'admin/panel.html';
    } else {
        alert('Invalid admin credentials');
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

function loadAdminDashboard() {
    if (!checkAdminAuth()) return;
    
    // Load statistics
    loadAdminStats();
    
    // Load products
    loadAdminProducts();
    
    // Load users
    loadAdminUsers();
    
    // Load orders
    loadAdminOrders();
}

function loadAdminStats() {
    const users = JSON.parse(l
