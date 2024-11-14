let cart = JSON.parse(localStorage.getItem("cart")) || [];
const darkModeToggle = document.getElementById('darkModeToggle');
const currentTheme = localStorage.getItem('theme'); 

if (currentTheme === 'dark') {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}

darkModeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');  

    if (document.documentElement.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

function updateCartCount() {
    const cartCountElement = document.getElementById("cartCount");
    cartCountElement.textContent = cart.length;
}

updateCartCount();

function showNotification(message, isSuccess = true) {
    const notification = document.getElementById("notification");
    const notificationContent = notification.querySelector("div");
    notificationContent.textContent = message;
    notificationContent.className = `${
        isSuccess ? "bg-green-500" : "bg-red-500"
    } text-white px-6 py-3 rounded-lg shadow-lg`;
    notification.classList.remove("hidden");
    setTimeout(() => {
        notification.classList.add("hidden");
    }, 2000);
}

function isProductInCart(productId) {
    return cart.some((item) => item.id === productId);
}

function addToCart(product) {
    if (isProductInCart(product.id)) {
        showNotification("Product already in cart!", false);
        return;
    }

    cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        quantity: 1,
        discountPercentage: product.discountPercentage,
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    showNotification("Product added to cart!", true);
}

async function fetchProductDetail(productId) {
    try {
        const response = await fetch(`https://dummyjson.com/products/${productId}`);
        const product = await response.json();

        const discountedPrice = (
            product.price * (1 - product.discountPercentage / 100)
        ).toFixed(2);

        const productDetailContainer = document.getElementById("productDetail");

        const isInCart = isProductInCart(product.id);

        productDetailContainer.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-8">
                <div class="flex justify-center mb-8 md:mb-0">
                    <img src="${product.thumbnail}" alt="${product.title}" class="w-full max-w-[200px] md:max-w-[300px] object-cover rounded-lg bg-black hover:shadow-custom transition-shadow" />
                </div>

                <div class="space-y-4">
                    <h1 class="text-3xl font-bold text-gray-800 dark:text-white">${product.title}</h1>
                    <p class="text-gray-600 dark:text-gray-400 line-clamp-2 md:line-clamp-none">${product.description}</p>

                    <div class="space-y-2">
                        <p class="text-lg text-gray-700 dark:text-gray-300">Brand: <span class="font-semibold">${product.brand}</span></p>
                        <p class="text-lg text-gray-700 dark:text-gray-300">Category: <span class="font-semibold">${product.category}</span></p>
                        <p class="text-lg text-gray-700 dark:text-gray-300">Rating: <span class="font-semibold">${product.rating} ⭐</span></p>
                        <p class="text-lg text-gray-700 dark:text-gray-300">Stock: <span class="font-semibold">${product.stock}</span></p>
                    </div>

                    <div class="flex flex-col lg:flex-row items-start md:items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <span class="line-through text-red-500 text-2xl">$${
                                product.price
                            }</span>
                            <span class="text-3xl font-bold text-gray-900 dark:text-white">$${discountedPrice}</span>
                            <span class="text-lg text-green-600">-${product.discountPercentage}%</span>
                        </div>

                        <button 
                            id="addToCartButton"
                            class="${isInCart ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-500 hover:bg-gray-600'} w-full lg:max-w-[200px] text-white px-3 py-2 mt-8 lg:mt-0 rounded-lg text-lg font-semibold transition-colors duration-300"
                            ${isInCart ? 'disabled' : ''}>
                            ${isInCart ? 'In Cart' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        `;


        const addToCartButton = productDetailContainer.querySelector('#addToCartButton');
        addToCartButton.addEventListener('click', () => addToCart(product));

    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (productId) {
        fetchProductDetail(productId);
    } else {
        console.error("Product ID not found in URL");
    }
});
