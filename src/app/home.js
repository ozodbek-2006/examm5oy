const productsContainer = document.getElementById('products');
let cart = JSON.parse(localStorage.getItem('cart')) || [];
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
    const cartCountElement = document.getElementById('cartCount');
    cartCountElement.textContent = cart.length;
}
updateCartCount();  



async function fetchProducts() {
    try {
        const response = await fetch('https://dummyjson.com/products');
        const data = await response.json();
        const products = data.products.slice(4, 16);


        products.forEach(product => {
            const discountedPrice = (product.price * (1 - product.discountPercentage / 100)).toFixed(2);

            const card = document.createElement('div');
            card.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300';


            card.innerHTML = `
                <img
                onclick="window.location.href='/src/pages/singleproduct.html?id=${product.id}'"
                 src="${product.thumbnail}" alt="${product.title}" class="w-full h-56 object-contain bg-black"/>

                <div class="p-4">
                    <h3 class="text-xl font-semibold text-gray-800 mb-2 min-h-[50px] ">${product.title}</h3>
                    <p class="text-gray-600 text-sm mb-4 line-clamp-3">${product.description}</p>
                    <div class="flex items-center mb-4">
                        <span class="line-through text-red-500 text-lg mr-2">$${product.price}</span>
                        <span class="text-lg font-bold text-gray-900">$${discountedPrice}</span>
                        <span class="ml-2 text-sm text-green-600">-${product.discountPercentage}%</span>
                    </div>
                    <div class="flex flex-col gap-2">
                        <button id="addToCartButton" class="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition-colors duration-300 w-full">
                            Buy Now
                        </button>
                    </div>
                </div>
            `;

            productsContainer.appendChild(card);

            const addToCartButton = card.querySelector("#addToCartButton");
            addToCartButton.addEventListener('click', () => addToCart(product));
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function isProductInCart(productId) {
    return cart.some(item => item.id === productId);
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
    updateCartCount();  
}

function showNotification(message, isSuccess = true) {
    const notification = document.getElementById("notification");
    const notificationContent = notification.querySelector("div");
    notificationContent.textContent = message;
    notificationContent.className = `${isSuccess ? "bg-green-500" : "bg-red-500"} text-white px-6 py-3 rounded-lg shadow-lg`;
    notification.classList.remove("hidden");
    setTimeout(() => {
        notification.classList.add("hidden");
    }, 2000);
}

fetchProducts();
