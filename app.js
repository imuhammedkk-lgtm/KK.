const products = [
    {
        id: 1,
        title: "Pet Hair Removal Glove - Universal Fit",
        category: "Pet Supplies",
        price: 229,
        rating: 4.8,
        image: "https://i.postimg.cc/ZK4JY7MZ/shopping.webp",
        images: [
            "https://i.postimg.cc/ZK4JY7MZ/shopping.webp",
            "https://i.postimg.cc/HnGX7D7V/61Hg-O7fsn-L-SL1024.jpg",
            "https://i.postimg.cc/2yFbbqY5/295a2da7-6dd3-45d7-8bf7-7f3c5774277a-CR0-0-1464-600-PT0-SX1464-V1-(1).jpg"
        ],
        description: "Mimics the touch of your hand for a soft and relaxing massage; This flexible, slip-on grooming gloves allow you to brush away dirt, dander and loose hair from cats and dogs. Perfect for long, short and curly haired dogs, cats, horses, and other pets, grooming the hair quickly, gently and effectively; The shedding hair sticks to the glove, making it easy to peel and throw hair away."
    },
    {
        id: 2,
        title: "Pet Grooming Glove - Massage & Deshedding",
        category: "Pet Grooming",
        price: 229,
        rating: 4.9,
        image: "images/product2.jpg"
    },
    {
        id: 3,
        title: "Furniture Protection Kit",
        category: "Home Cleaning",
        price: 499,
        rating: 4.7,
        image: "images/product3.jpg"
    },
    {
        id: 4,
        title: "Adopt A Pet Starter Kit",
        category: "Pet Care",
        price: 999,
        rating: 5.0,
        image: "images/product4.jpg"
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
const cartEta = document.getElementById('cart-eta');
const searchInput = document.getElementById('search-input');

// Initialize Products
function displayProducts(filteredProducts = products) {
    productGrid.innerHTML = '';
    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image-container" onclick="openProductModal(${product.id})">
                 <img src="${product.image}" alt="${product.title}" class="product-image">
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title" onclick="openProductModal(${product.id})" style="cursor:pointer">${product.title}</h3>
                <div class="product-rating">
                    ${renderStars(product.rating)} <span>(${product.rating})</span>
                </div>
                <div class="product-price-row">
                    <span class="product-price">₹${product.price}</span>
                    <button class="add-to-cart" onclick="addToCart(${product.id}); event.stopPropagation();">
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
                    <span class="cart-item-price">₹${item.price} x ${item.quantity}</span>
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

    totalAmountSpan.innerText = `₹${total}`;
    cartCountSpan.innerText = count;
    // Show estimated delivery in the cart footer when there are items
    if (cartEta) {
        if (cart.length > 0) {
            cartEta.innerText = `Estimated delivery: ${getEstimatedDelivery(10)} (within 10 days)`;
        } else {
            cartEta.innerText = '';
        }
    }
}

// ETA helpers
function formatDate(date) {
    const opts = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, opts);
}

function getEstimatedDelivery(days = 10) {
    const now = new Date();
    const arrival = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return formatDate(arrival);
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
            summary += `- ${item.title} (x${item.quantity}) - ₹${(item.price * item.quantity)}\n`;
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
                setTimeout(() => {
                    orderBtn.classList.remove('animate');
                    alert("Success! Your order has been placed.");

                    // Update Location in Header
                    const city = formData.get('City');
                    const pincode = formData.get('Pincode');
                    if (city && pincode) {
                        const locationEl = document.querySelector('.location-info strong');
                        if (locationEl) {
                            locationEl.innerText = `${city}, ${pincode}`;
                        }
                    }

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

// Product Modal Logic
const productModal = document.getElementById('product-modal');
const closeProductModal = document.getElementById('close-product-modal');
const modalMainImage = document.getElementById('modal-main-image');
const modalTitle = document.getElementById('modal-title');
const modalPrice = document.getElementById('modal-price');
const modalDescription = document.getElementById('modal-description');
const modalThumbnails = document.getElementById('modal-thumbnails');
const modalAddToCart = document.getElementById('modal-add-to-cart');

function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    modalTitle.innerText = product.title;
    modalPrice.innerText = '?' + product.price;
    modalDescription.innerText = product.description || 'No description available.';
    modalMainImage.src = product.image;

    // Setup Add to Cart button in modal
    modalAddToCart.onclick = () => {
        addToCart(product.id);
        productModal.classList.remove('open');
    };

    // Render Thumbnails
    modalThumbnails.innerHTML = '';
    const images = product.images || [product.image];

    images.forEach(imgSrc => {
        const thumb = document.createElement('img');
        thumb.src = imgSrc;
        thumb.className = 'modal-thumbnail';
        if (imgSrc === product.image) thumb.classList.add('active');

        thumb.onclick = () => {
            modalMainImage.src = imgSrc;
            document.querySelectorAll('.modal-thumbnail').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        };

        modalThumbnails.appendChild(thumb);
    });

    productModal.classList.add('open');
}

if (closeProductModal) {
    closeProductModal.addEventListener('click', () => {
        productModal.classList.remove('open');
    });
}

window.addEventListener('click', (e) => {
    if (e.target === productModal) {
        productModal.classList.remove('open');
    }
});

// Address Modal Logic
const addressModal = document.getElementById('address-modal');
const closeAddressModal = document.getElementById('close-address-modal');
const locationPicker = document.querySelector('.location-picker');
const addressForm = document.getElementById('address-form');

// Open Address Modal
if (locationPicker) {
    locationPicker.addEventListener('click', () => {
        addressModal.style.display = 'flex';
        // Pre-fill if data exists
        const savedAddress = localStorage.getItem('kk_delivery_address');
        if (savedAddress) {
            const addr = JSON.parse(savedAddress);
            document.getElementById('addr-name').value = addr.name || '';
            document.getElementById('addr-phone1').value = addr.phone1 || '';
            document.getElementById('addr-phone2').value = addr.phone2 || '';
            document.getElementById('addr-house').value = addr.house || '';
            document.getElementById('addr-road').value = addr.road || '';
            document.getElementById('addr-pincode').value = addr.pincode || '';
            document.getElementById('addr-city').value = addr.city || '';
            document.getElementById('addr-state').value = addr.state || 'Kerala';
        }
    });
}

// Close Address Modal
if (closeAddressModal) {
    closeAddressModal.addEventListener('click', () => {
        addressModal.style.display = 'none';
    });
}

// Close on outside click
window.addEventListener('click', (e) => {
    if (e.target === addressModal) {
        addressModal.style.display = 'none';
    }
});

// Save Address
if (addressForm) {
    addressForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const addressData = {
            name: document.getElementById('addr-name').value,
            phone1: document.getElementById('addr-phone1').value,
            phone2: document.getElementById('addr-phone2').value,
            house: document.getElementById('addr-house').value,
            road: document.getElementById('addr-road').value,
            pincode: document.getElementById('addr-pincode').value,
            city: document.getElementById('addr-city').value,
            state: document.getElementById('addr-state').value
        };

        // Save to LocalStorage
        localStorage.setItem('kk_delivery_address', JSON.stringify(addressData));

        // Update UI
        updateLocationHeader(addressData.city, addressData.pincode);

        // Close Modal
        addressModal.style.display = 'none';
        alert('Address Saved Successfully!');
    });
}

function updateLocationHeader(city, pincode) {
    const locationEl = document.querySelector('.location-info strong');
    if (locationEl && city && pincode) {
        locationEl.innerText = city + ', ' + pincode;
    }
}

// Load Saved Address on Init
document.addEventListener('DOMContentLoaded', () => {
    const savedAddress = localStorage.getItem('kk_delivery_address');
    if (savedAddress) {
        const addr = JSON.parse(savedAddress);
        updateLocationHeader(addr.city, addr.pincode);
    }
});

// Auto-fill Order Form when opened
const checkoutBtnRef = document.querySelector('.checkout-btn');
if (checkoutBtnRef) {
    checkoutBtnRef.addEventListener('click', () => {
        const savedAddress = localStorage.getItem('kk_delivery_address');
        if (savedAddress) {
            const addr = JSON.parse(savedAddress);
            // Fill the order form fields by name attribute
            const form = document.getElementById('order-form');
            if (form) {
                if (addr.name) form.querySelector('[name=\"Full_Name\"]').value = addr.name;
                if (addr.phone1) form.querySelector('[name=\"Phone_1\"]').value = addr.phone1;
                if (addr.phone2) form.querySelector('[name=\"Phone_2\"]').value = addr.phone2;
                if (addr.house) form.querySelector('[name=\"House_Building_Details\"]').value = addr.house;
                if (addr.road) form.querySelector('[name=\"Road_Area_Colony\"]').value = addr.road;
                if (addr.pincode) form.querySelector('[name=\"Pincode\"]').value = addr.pincode;
                if (addr.city) form.querySelector('[name=\"City\"]').value = addr.city;
                if (addr.state) form.querySelector('[name=\"State\"]').value = addr.state;
            }
        }
    });
}

