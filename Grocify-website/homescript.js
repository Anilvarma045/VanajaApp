// JavaScript code to handle menu toggle and header scroll effects
let menu = document.querySelector('#menu-bar');
let navbar = document.querySelector('.navbar');
let header = document.querySelector('.header-2');

// Add click event listener to the menu icon
menu.addEventListener('click', () => {
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
});

// Optional: Close the menu when clicking outside
document.addEventListener('click', (event) => {
    if (!menu.contains(event.target) && !navbar.contains(event.target)) {
        menu.classList.remove('fa-times');
        navbar.classList.remove('active');
    }
});

// Add scroll event listener to the window
window.onscroll = () => {
    // Remove classes when scrolling to close the menu and hide the navbar
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');

    // Add 'active' class to the header when scrolled past 150px
    if (window.scrollY > 150) {
        header.classList.add('active');
    } else {
        header.classList.remove('active');
    }
};

// Swiper configuration (uncomment if needed)
var swiper = new Swiper(".home-slider", {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    loop: true,
});

// Account page login and register page JS
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// Cart page functionality
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    let cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.innerText = cartCount;
    } else {
        console.error("Cart count element not found");
    }
}

// Function to add product to cart
function addToCart(productId) {
    let product = document.getElementById(productId);
    if (!product) {
        console.log('Product not found: ' + productId);
        return;
    }

    let title = product.querySelector('h3').innerText;
    let price = product.querySelector('.price').innerText;
    let quantity = product.querySelector('.cart-quantity').value;
    let imgSrc = product.querySelector('img').src;

    let productObj = {
        title: title,
        price: price,
        quantity: parseInt(quantity),
        imgSrc: imgSrc
    };

    // Check if product already exists in the cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let existingProductIndex = cart.findIndex(item => item.title === productObj.title);
    if (existingProductIndex !== -1) {
        // Update quantity if product exists
        cart[existingProductIndex].quantity += productObj.quantity;
    } else {
        // Add new product if it doesn't exist in the cart
        cart.push(productObj);
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartCount();  // Update cart count after adding product
    showNotification(); // Show notification after adding product
}

// Function to display a notification
function showNotification() {
    alert("Your product has been added to the cart!");

    var notification = document.getElementById("cart-notification");
    if (notification) {
        notification.className = "notification show";

        // Hide the notification after 3 seconds
        setTimeout(() => {
            notification.className = notification.className.replace("show", ""); 
        }, 3000);
    }
}

// Function to load and display cart items on the cart page
function loadCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartContainer = document.querySelector('.cart-contant');
    if (!cartContainer) return;  // Return if the cart container is not present

    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cart.forEach((item, index) => {
            cartContainer.innerHTML += `
                <div class="cart-box">
                    <img src="${item.imgSrc}" alt="${item.title}" class="product-img">
                    <div class="detail-box">
                        <div class="cart-product-title">${item.title}</div>
                        <div class="cart-price">${item.price}</div>
                        <input type="number" value="${item.quantity}" class="cart-quantity" data-index="${index}">
                    </div>
                    <i class="fa fa-trash cart-remove" data-index="${index}"></i>
                </div>
            `;
        });
    }

    updateTotal();
    attachCartEventListeners(); // Attach event listeners to cart items
}

// Function to update total price
function updateTotal() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = cart.reduce((sum, item) => {
        let price = parseFloat(item.price.replace('₹', ''));
        return sum + (price * item.quantity);
    }, 0);
    
    document.querySelector('.total-price').innerText = `Total: ₹${total.toFixed(2)}`;
}

// Function to remove item from cart
function removeItemFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

// Function to handle quantity changes in the cart
function quantityChanged(event) {
    const input = event.target;
    const index = input.getAttribute('data-index');
    let newQuantity = parseInt(input.value);

    if (isNaN(newQuantity) || newQuantity <= 0) {
        newQuantity = 1;
        input.value = 1;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart[index].quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateTotal();
    updateCartCount(); // Update cart count after quantity change
}

// Attach event listeners to cart items
function attachCartEventListeners() {
    document.querySelectorAll('.cart-remove').forEach(button => {
        button.addEventListener('click', () => {
            let index = button.getAttribute('data-index');
            removeItemFromCart(index);
        });
    });

    document.querySelectorAll('.cart-quantity').forEach(input => {
        input.addEventListener('change', quantityChanged);
    });
}

// Trigger a thank you message after a purchase
document.querySelector('.btn-purchase')?.addEventListener('click', function() {
    alert('Thank you for your purchase!');
    // Additional purchase logic here
});

// Ensure cart count is updated on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();  // Ensure cart count is updated on page load
    if (document.querySelector('.cart-contant')) {
        loadCart();  // Load cart items if on cart page
    }
});
