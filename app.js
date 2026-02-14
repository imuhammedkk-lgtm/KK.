const products = [
    {
        id: 1,
        title: "X-Phone Pro Ultra",
        category: "Electronics",
        price: 999.00,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        title: "SonicWave Wireless Headphones",
        category: "Audio",
        price: 249.50,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        title: "Lumina Smart Watch Series 5",
        category: "Wearables",
        price: 199.00,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        title: "Apex Gaming Laptop",
        category: "Computers",
        price: 1499.00,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5,
        title: "Minimalist Desk Lamp",
        category: "Home",
        price: 45.00,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 6,
        title: "Classic Leather Sneakers",
        category: "Fashion",
        price: 85.00,
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 7,
        title: "Organic Cotton Hoodie",
        category: "Fashion",
        price: 59.99,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 8,
        title: "4K Action Camera",
        category: "Electronics",
        price: 129.00,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1526170375885-4d8ecbc6058c?auto=format&fit=crop&w=500&q=80"
    }
];

let cart = [];

// DOM Elements
const productGrid = document.getElementById('product-list');
const cartButton = document.getElementById('cart-button');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cart-items');
const totalAmountSpan = document.getElementById('total-amount');
const cartCountSpan = document.querySelector('.cart-count');
const searchInput = document.getElementById('search-input');

// Initialize Products
function displayProducts(filteredProducts = products) {
    productGrid.innerHTML = '';
    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.title}</h3>
                <div class="product-rating">
                    ${renderStars(product.rating)} <span>(${product.rating})</span>
                </div>
                <div class="product-price-row">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Cart Logic
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    toggleCart(true);
}

function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
    } else {
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <span class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</span>
                </div>
                <button onclick="removeFromCart(${item.id})" style="background:none; border:none; color:#ef4444; cursor:pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItemsContainer.appendChild(itemElement);
            total += item.price * item.quantity;
            count += item.quantity;
        });
    }

    totalAmountSpan.innerText = `$${total.toFixed(2)}`;
    cartCountSpan.innerText = count;
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function toggleCart(show) {
    if (show) {
        cartSidebar.classList.add('open');
        overlay.classList.add('open');
    } else {
        cartSidebar.classList.remove('open');
        overlay.classList.remove('open');
    }
}

// Event Listeners
cartButton.addEventListener('click', () => toggleCart(true));
closeCart.addEventListener('click', () => toggleCart(false));
overlay.addEventListener('click', () => toggleCart(false));

searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = products.filter(p =>
        p.title.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
    );
    displayProducts(filtered);
});

// Back to top
document.querySelector('.back-to-top').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Initialize
displayProducts();
updateCartUI();

// Order Modal Logic
const orderModal = document.getElementById('order-modal');
const closeOrderModal = document.getElementById('close-order-modal');
const checkoutBtn = document.querySelector('.checkout-btn');

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        // Generate Order Summary string
        let summary = "Order Details:\n";
        cart.forEach(item => {
            summary += `- ${item.title} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}\n`;
        });
        const orderSummaryField = document.getElementById('order-summary');
        if (orderSummaryField) {
            orderSummaryField.value = summary;
        }

        orderModal.classList.add('open');
        toggleCart(false); // Close cart sidebar when opening checkout
    });
}

if (closeOrderModal) {
    closeOrderModal.addEventListener('click', () => {
        orderModal.classList.remove('open');
    });
}

window.addEventListener('click', (e) => {
    if (e.target === orderModal) {
        orderModal.classList.remove('open');
    }
});

// Web3Forms Order Submission Logic
const orderForm = document.getElementById('order-form');
if (orderForm) {
    const orderBtn = orderForm.querySelector('.order');

    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(orderForm);
        const orderBtn = orderForm.querySelector('.order');

        if (!orderBtn.classList.contains('animate')) {
            orderBtn.classList.add('animate');
        }

        // Disable button to prevent double submit during animation
        orderBtn.disabled = true;

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                // Wait for animation to finish (approx 10s) or at least show it for a while
                // The animation logic from the user snippet removes the class after 10s.
                // We should probably wait for the animation to complete before showing the success alert/resetting.

                setTimeout(() => {
                    orderBtn.classList.remove('animate');
                    alert("Success! Your order has been placed.");
                    orderForm.reset();

                    // Close the modal
                    const orderModal = document.getElementById('order-modal');
                    if (orderModal) {
                        orderModal.classList.remove('open');
                    }
                    orderBtn.disabled = false;
                }, 10000);

            } else {
                orderBtn.classList.remove('animate');
                orderBtn.disabled = false;
                alert("Error: " + data.message);
            }

        } catch (error) {
            orderBtn.classList.remove('animate');
            orderBtn.disabled = false;
            alert("Something went wrong. Please try again.");
            console.error(error);
        }
    });
}
