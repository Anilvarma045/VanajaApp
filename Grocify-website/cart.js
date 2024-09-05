

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



//searchbar js  
document.addEventListener('DOMContentLoaded', () => {
    const searchBox = document.getElementById("search-box");

    searchBox.addEventListener("input", () => {
        const searchQuery = searchBox.value.toLowerCase();
        const productBoxes = document.querySelectorAll(".box");

        productBoxes.forEach(box => {
            const productName = box.querySelector("h3").textContent.toLowerCase();
            
            if (productName.includes(searchQuery)) {
                box.style.display = "block"; // Show product
            } else {
                box.style.display = "none"; // Hide product
            }
        });
    });
});



// cart and wishlist js code


// Initialize wishlist and cart
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to load and display wishlist items
function loadWishlist() {
    let wishlistContainer = document.querySelector('.wishlist-items');
    
    if (!wishlistContainer) return;

    wishlistContainer.innerHTML = '';

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = '<p>Your wishlist is empty.</p>';
    } else {
        wishlist.forEach((item, index) => {
            wishlistContainer.innerHTML += `
                <div class="wishlist-box">
                    <img src="${item.imgSrc}" alt="${item.title}" class="product-img">
                    <div class="detail-box">
                        <div class="wishlist-product-title">${item.title}</div>
                        <div class="wishlist-price">${item.price}</div>
                        <!-- Add quantity input for wishlist items -->
                        <input type="number" value="1" class="wishlist-quantity" data-index="${index}">
                    </div>
                    <div class="wishlist-actions">
                        <button class="add-to-cart-button" data-index="${index}">Add to Cart</button>
                        <i class="fa fa-trash wishlist-remove" data-index="${index}"></i>
                    </div>
                </div>
            `;
        });
    }

    attachWishlistEventListeners();
}

// Function to remove item from wishlist
function removeItemFromWishlist(index) {
    wishlist.splice(index, 1);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    loadWishlist();
}

// Function to add product to wishlist
function addToWishlist(productId) {
    let product = document.getElementById(productId);
    if (!product) {
        console.error('Product not found: ' + productId);
        return;
    }

    let title = product.querySelector('h3').innerText;
    let price = product.querySelector('.price').innerText;
    let imgSrc = product.querySelector('img').src;

    let productObj = { title, price, imgSrc };

    let existingProductIndex = wishlist.findIndex(item => item.title === productObj.title);
    if (existingProductIndex === -1) {
        wishlist.push(productObj);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
        showWishlistNotification();
    } else {
        alert("This item is already in your wishlist.");
    }
}

// Function to update wishlist count
function updateWishlistCount() {
    let wishlistCount = wishlist.length;
    let wishlistCountElement = document.getElementById('wishlist-count');
    
    if (wishlistCountElement) {
        wishlistCountElement.innerText = wishlistCount;
    } else {
        console.error("Wishlist count element not found");
    }
}

// Function to display a notification when an item is added to the wishlist
function showWishlistNotification() {
    var notification = document.getElementById("wishlist-notification");
    if (notification) {
        notification.classList.add("show");

        setTimeout(() => {
            notification.classList.remove("show");
        }, 3000);
    }
}

// Attach event listeners to wishlist items
function attachWishlistEventListeners() {
    let removeButtons = document.querySelectorAll('.wishlist-remove');
    let addToCartButtons = document.querySelectorAll('.add-to-cart-button');
    
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            let index = button.getAttribute('data-index');
            removeItemFromWishlist(index);
        });
    });
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            let index = button.getAttribute('data-index');
            addToCartFromWishlist(index);
        });
    });
}

// Function to add item to cart from wishlist
function addToCartFromWishlist(index) {
    let item = wishlist[index];
    if (!item) {
        console.error("Item not found in wishlist.");
        return;
    }

    // Get the quantity from the wishlist item
    let quantityInput = document.querySelector(`.wishlist-quantity[data-index="${index}"]`);
    let quantity = parseInt(quantityInput.value) || 1;

    let existingProductIndex = cart.findIndex(cartItem => cartItem.title === item.title);
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += quantity;
    } else {
        item.quantity = quantity;
        cart.push(item);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    removeItemFromWishlist(index);
}

// Function to update cart count
function updateCartCount() {
    let cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    let cartCountElement = document.getElementById('cart-count');
    
    if (cartCountElement) {
        cartCountElement.innerText = cartCount;
    } else {
        console.error("Cart count element not found");
    }
}

// Load and display cart items on the cart page
function loadCart() {
    let cartContainer = document.querySelector('.cart-contant');
    if (!cartContainer) return;

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
    attachCartEventListeners();
}

// Function to update total price
function updateTotal() {
    let total = cart.reduce((sum, item) => {
        let price = parseFloat(item.price.replace('₹', ''));
        return sum + (price * item.quantity);
    }, 0);
    
    document.querySelector('.total-price').innerText = `Total:₹${total.toFixed(2)}`;
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
    updateCartCount();
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

// Function to show notification after adding to cart
function showNotification() {
    alert("Your product has been added to the cart!");

    var notification = document.getElementById("cart-notification");
    if (notification) {
        notification.className = "notification show";

        setTimeout(() => {
            notification.className = notification.className.replace("show", "");
        }, 3000);
    }
}

document.querySelector('.btn').addEventListener('click', function() {
    // Clear cart items from the cart array
    cart = [];

    // Clear cart items from the page
    document.querySelector('.cart-contant').innerHTML = '<p>Your cart is empty.</p>';

    // Clear cart items from local storage
    localStorage.removeItem('cart'); // Use the correct key, which is 'cart'

    // Reset the total, GST, and grand total prices
    document.querySelector('.total-price').textContent = '₹0';
   
    // Optionally, show a message to the user that the cart is cleared
    alert('Your cart has been cleared!');
});
// Add to cart from product page
function addToCart(productId) {
    let product = document.getElementById(productId);
    if (!product) {
        console.log('Product not found: ' + productId);
        return;
    }

    let title = product.querySelector('h3').innerText;
    let price = product.querySelector('.price').innerText;
    let quantity = parseInt(product.querySelector('.cart-quantity').value) || 1;
    let imgSrc = product.querySelector('img').src;

    let productObj = { title, price, quantity, imgSrc };

    let existingProductIndex = cart.findIndex(item => item.title === productObj.title);
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += productObj.quantity;
    } else {
        cart.push(productObj);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification();
}

// Event listeners for "Add to Wishlist" and "Add to Cart" buttons
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.box .fa-heart').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            let productId = button.closest('.box').id;
            addToWishlist(productId);
        });
    });

    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            let productId = button.closest('.box').id;
            addToCart(productId);
        });
    });

    updateWishlistCount();
    loadWishlist();
    updateCartCount();
    loadCart();
});




//edit js 

document.getElementById('edit-profile-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Retrieve form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const location = document.getElementById('location').value;

    // You can save the data to a database here or use localStorage for a simple demo
    localStorage.setItem('profileName', name);
    localStorage.setItem('profileEmail', email);
    localStorage.setItem('profilePhone', phone);
    localStorage.setItem('profileLocation', location);

    // Redirect back to profile page
    window.location.href = 'profile.html';
});




// profile  js code


document.addEventListener('DOMContentLoaded', () => {
    fetchOrders();
});
function logout() {
    alert('Logged out successfully!');
    window.location.href = 'login.html'; // Redirect to login page
}





//review js code

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











// account js code signin and signup


const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const forgotPasswordLink = document.getElementById('forgot-password-link');
const backToSignInLink = document.getElementById('back-to-sign-in');

// Handle Register button click
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

// Handle Login button click
loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// Handle Forgot Password link click
forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.form-container.sign-in').style.display = 'none';
    document.querySelector('.form-container.sign-up').style.display = 'none';
    document.querySelector('.form-container.forgot-password').style.display = 'block';
});

// Handle Back to Sign In link click
backToSignInLink.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.form-container.forgot-password').style.display = 'none';
    document.querySelector('.form-container.sign-in').style.display = 'block';
});


