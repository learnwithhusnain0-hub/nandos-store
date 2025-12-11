// Admin Panel JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is on admin panel
    if (window.location.pathname.includes('admin/panel.html')) {
        initializeAdminPanel();
    }
});

function initializeAdminPanel() {
    // Check admin authentication
    const isAdminLoggedIn = localStorage.getItem('nandos_admin_logged_in') === 'true';
    
    if (!isAdminLoggedIn) {
        // Redirect to home page
        window.location.href = '../index.html';
        return;
    }
    
    // Display admin welcome message
    showAdminWelcome();
    
    // Initialize data loading
    loadAdminData();
    
    // Setup event listeners
    setupAdminEventListeners();
}

function showAdminWelcome() {
    console.log('Welcome to Nandos UK Admin Panel');
    
    // You can add a welcome notification here
    const adminName = 'Husnain';
    showMessage(`Welcome, ${adminName}!`, 'success');
}

function loadAdminData() {
    // This function is called from panel.html
    // Data loading is handled in admin.js
    console.log('Loading admin data...');
}

function setupAdminEventListeners() {
    // Add any additional admin panel event listeners here
    
    // Auto-refresh data every 30 seconds
    setInterval(() => {
        if (isDashboardVisible()) {
            loadAdminStats();
        }
    }, 30000);
}

function isDashboardVisible() {
    const dashboardSection = document.getElementById('dashboard');
    return dashboardSection && dashboardSection.style.display !== 'none';
}

// Export management functions
function exportUsersData() {
    const users = JSON.parse(localStorage.getItem('nandos_users')) || [];
    const csv = convertToCSV(users, ['id', 'email', 'phone', 'createdAt', 'lastLogin']);
    downloadCSV(csv, 'nandos_users.csv');
}

function exportProductsData() {
    const products = JSON.parse(localStorage.getItem('nandos_products')) || [];
    const csv = convertToCSV(products, ['id', 'name', 'price', 'discountPrice', 'stock', 'category']);
    downloadCSV(csv, 'nandos_products.csv');
}

function exportOrdersData() {
    const users = JSON.parse(localStorage.getItem('nandos_users')) || [];
    const allOrders = [];
    
    users.forEach(user => {
        if (user.orders) {
            user.orders.forEach(order => {
                order.userEmail = user.email;
                allOrders.push(order);
            });
        }
    });
    
    const csv = convertToCSV(allOrders, ['id', 'userEmail', 'total', 'status', 'createdAt']);
    downloadCSV(csv, 'nandos_orders.csv');
}

function convertToCSV(data, fields) {
    const headers = fields.join(',');
    const rows = data.map(item => {
        return fields.map(field => {
            let value = item[field] || '';
            // Handle nested objects
            if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
            // Escape commas and quotes
            value = String(value).replace(/"/g, '""');
            if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                value = `"${value}"`;
            }
            return value;
        }).join(',');
    });
    
    return [headers, ...rows].join('\n');
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showMessage(`Data exported as ${filename}`, 'success');
}

// Data backup and restore functions
function backupAllData() {
    const backup = {
        users: JSON.parse(localStorage.getItem('nandos_users')) || [],
        products: JSON.parse(localStorage.getItem('nandos_products')) || [],
        timestamp: new Date().toISOString()
    };
    
    const backupStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([backupStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nandos_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showMessage('All data backed up successfully', 'success');
}

function restoreData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!confirm('This will replace all current data. Are you sure?')) {
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const backup = JSON.parse(e.target.result);
            
            if (backup.users && backup.products) {
                localStorage.setItem('nandos_users', JSON.stringify(backup.users));
                localStorage.setItem('nandos_products', JSON.stringify(backup.products));
                
                // Refresh admin data
                loadAdminDashboard();
                
                showMessage('Data restored successfully', 'success');
            } else {
                showMessage('Invalid backup file format', 'error');
            }
        } catch (error) {
            showMessage('Error reading backup file', 'error');
        }
    };
    reader.readAsText(file);
}

// System reset function (use with caution!)
function resetSystem() {
    if (!confirm('WARNING: This will delete ALL data including users, products, and orders. This action cannot be undone. Are you absolutely sure?')) {
        return;
    }
    
    if (!confirm('Type "RESET" to confirm system reset:')) {
        return;
    }
    
    // Clear all Nandos-related data
    localStorage.removeItem('nandos_users');
    localStorage.removeItem('nandos_products');
    localStorage.removeItem('nandos_current_user');
    localStorage.removeItem('nandos_cart');
    localStorage.removeItem('nandos_admin_logged_in');
    
    // Initialize with default data
    const defaultProducts = [
        {
            id: 1,
            name: "Classic Chicken Burger",
            description: "Juicy grilled chicken breast with lettuce, tomato, and special sauce",
            price: 8.99,
            discountPrice: 6.99,
            discount: 22,
            category: "burgers",
            image: "🍔",
            stock: 50,
            featured: true
        },
        {
            id: 2,
            name: "Spicy Wings Combo",
            description: "10 pieces of spicy chicken wings with fries and dip",
            price: 12.99,
            discountPrice: 9.99,
            discount: 23,
            category: "wings",
            image: "🍗",
            stock: 30,
            featured: true
        }
    ];
    
    localStorage.setItem('nandos_products
