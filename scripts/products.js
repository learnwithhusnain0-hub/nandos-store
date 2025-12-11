// Products Management System
const products = [
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
    },
    {
        id: 3,
        name: "Beef Shawarma Wrap",
        description: "Tender beef strips with vegetables and garlic sauce in pita bread",
        price: 7.49,
        discountPrice: 5.99,
        discount: 20,
        category: "wraps",
        image: "🌯",
        stock: 40,
        featured: true
    },
    {
        id: 4,
        name: "Loaded Nachos",
        description: "Crispy nachos with cheese, jalapeños, salsa, and sour cream",
        price: 6.99,
        discountPrice: 4.99,
        discount: 29,
        category: "snacks",
        image: "🥨",
        stock: 25,
        featured: true
    },
    {
        id: 5,
        name: "Fish & Chips",
        description: "Traditional British fish with crispy fries and tartar sauce",
        price: 10.99,
        discountPrice: 8.49,
        discount: 23,
        category: "seafood",
        image: "🐟",
        stock: 20,
        featured: true
    },
    {
        id: 6,
        name: "Vegetable Pizza",
        description: "12-inch pizza with fresh vegetables and mozzarella cheese",
        price: 11.99,
        discountPrice: 8.99,
        discount: 25,
        category: "pizza",
        image: "🍕",
        stock: 15,
        featured: true
    },
    {
        id: 7,
        name: "Chocolate Brownie",
        description: "Warm chocolate brownie with vanilla ice cream",
        price: 5.49,
        discountPrice: 3.99,
        discount: 27,
        category: "desserts",
        image: "🍫",
        stock: 35,
        featured: true
    },
    {
        id: 8,
        name: "Soft Drink 500ml",
        description: "Choice of Coke, Fanta, Sprite or Dr Pepper",
        price: 2.49,
        discountPrice: 1.99,
        discount: 20,
        category: "drinks",
        image: "🥤",
        stock: 100,
        featured: false
    }
];

// Save products to localStorage
localStorage.setItem('nandos_products', JSON.stringify(products));

function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    // Get products from localStorage
    const storedProducts = JSON.parse(localStorage.getItem('nandos_products')) || products;
    
    // Clear existing content
    productsGrid.innerHTML = '';
    
    // Filter featured products
    const featuredProducts = storedProducts.filter(product => product.featured);
    
    // Add products to grid
    featuredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    
    const discountBadge = product.discount > 0 
        ? `<span class="discount-badge">${product.discount}% OFF</span>`
        : '';
    
    const priceHTML = product.discountPrice 
        ? `
            <div class="price-section">
                <span class="original-price">£${product.price.toFixed(2)}</span>
                <span class="discounted-price">£${product.discountPrice.toFixed(2)}</span>
                ${discountBadge}
            </div>
        `
        : `
            <div class="price-section">
                <span class="discounted-price">£${product.price.toFixed(2)}</span>
            </div>
        `;
    
    card.innerHTML = `
        <div class="product-img" style="font-size: 80px; text-align: center; padding: 20px; background: #f8f9fa;">
            ${product.image}
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-desc">${product.description}</p>
            ${priceHTML}
            <button class="btn-add-cart" onclick="addToCart(${product.id})">
                <i class="fas fa-cart-plus"></i> Add to Cart
            </button>
        </div>
    `;
    
    return card;
}

function addToCart(productId) {
    const storedProducts = JSON.parse(localStorage.getItem('nandos_products')) || products;
    const product = storedProducts.find(p => p.id === productId);
    
    if (!product) {
        showMessage('Product not found', 'error');
        return;
    }
    
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('nandos_cart')) || [];
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity >= product.stock) {
            showMessage(`Only ${product.stock} items available in stock`, 'error');
            return;
        }
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.discountPrice || product.price,
            quantity: 1,
            image: product.image
        });
    }
    
    // Save cart
    localStorage.setItem('nandos_cart', JSON.stringify(cart));
    
    // Update cart UI
    updateCartUI();
    
    // Show success message
    showMessage(`${product.name} added to cart`, 'success');
    
    // Open cart sidebar on mobile
    if (window.innerWidth < 768) {
        document.getElementById('cartSidebar').classList.add('active');
    }
}

// Initialize products when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load products only if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('nandos_current_user'));
    if (currentUser) {
        loadProducts();
    }
});
