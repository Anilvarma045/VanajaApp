// Function to rotate testimonials
function rotateTestimonials() {
    const boxes = document.querySelectorAll('.testimonial-box');
    let index = 0;

    // Hide all testimonials
    function hideAll() {
        boxes.forEach(box => {
            box.style.display = 'none';
        });
    }

    // Show the current testimonial
    function showCurrent() {
        hideAll();
        boxes[index].style.display = 'block';
    }

    // Start rotating
    showCurrent();
    setInterval(() => {
        index = (index + 1) % boxes.length; // Move to the next testimonial
        showCurrent();
    }, 5000); // Change every 5 seconds
}

// Initialize testimonials rotation on page load
document.addEventListener('DOMContentLoaded', rotateTestimonials);

// Handle review form submission
document.getElementById('review-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('review-name').value;
    const text = document.getElementById('review-text').value;

    // Log the data (for demonstration purposes)
    console.log('Review submitted:', { name, text });

    // You would typically send this data to a server here

    // Optionally, clear the form fields
    document.getElementById('review-form').reset();
});



// cart page css code

let cart = JSON.parse(localStorage.getItem('cart')) || [];

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
        setTimeout(function(){
            notification.className = notification.className.replace("show", ""); 
        }, 3000);
    }
}

// Function to update cart count
function updateCartCount() {
    // Reload cart from localStorage to ensure it's up-to-date
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    let cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.innerText = cartCount;
    } else {
        console.error("Cart count element not found");
    }
}

// Ensure cart count is updated on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount(); // Make sure to call this on all pages where cart count needs to be displayed
    loadCart();
});

// Attach event listeners to "Add to Cart" buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        let productId = button.closest('.box').id;
        addToCart(productId);
    });
});

// Function to load and display cart items on the cart page
function loadCart() {
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
    let total = cart.reduce((sum, item) => {
        let price = parseFloat(item.price.replace('₹', ''));
        return sum + (price * item.quantity);
    }, 0);
    
    document.querySelector('.total-price').innerText = `Total: ₹${total.toFixed(2)}`;
}

// Function to remove item from cart
function removeItemFromCart(index) {
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

    cart[index].quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateTotal();
    updateCartCount(); // Update cart count after quantity change
}

// Attach event listeners to cart items
function attachCartEventListeners() {
    document.querySelectorAll('.cart-remove').forEach(button => {
        button.addEventListener('click', (event) => {
            let index = button.getAttribute('data-index');
            removeItemFromCart(index);
        });
    });

    document.querySelectorAll('.cart-quantity').forEach(input => {
        input.addEventListener('change', quantityChanged);
    });
}

// Trigger a thank you message after a purchase
document.querySelector('.btn-purchase').addEventListener('click', function() {
    alert('Thank you for your purchase!');
    // Additional purchase logic here
});


document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();  // Ensure cart count is updated on page load
});

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