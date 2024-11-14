let cart = JSON.parse(localStorage.getItem("cart")) || [];

const darkModeToggle = document.getElementById("darkModeToggle");
const currentTheme = localStorage.getItem("theme");

if (currentTheme === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

darkModeToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");

  if (document.documentElement.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});



function updateCartCount() {
  const cartCountElement = document.getElementById("cartCount");
  cartCountElement.textContent = cart.length;
}

updateCartCount();

function calculateItemTotal(item) {
  const discountedPrice = item.price * (1 - item.discountPercentage / 100);
  return (discountedPrice * item.quantity).toFixed(2);
}

function calculateCartTotal() {
  return cart
    .reduce((total, item) => {
      return total + parseFloat(calculateItemTotal(item));
    }, 0)
    .toFixed(2);
}

function updateQuantity(index, change) {
  const newQuantity = cart[index].quantity + change;

  if (newQuantity >= 1) {
    cart[index].quantity = newQuantity;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

function renderCart() {
  const tableBody = document.getElementById("cartTableBody");
  const cartTotal = document.getElementById("cartTotal");

  tableBody.innerHTML = cart
    .map(
      (item, index) => `
    <tr class="bg-white dark:bg-gray-800">
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                    <img class="h-10 w-10 rounded-full object-cover" src="${
                      item.thumbnail
                    }" alt="${item.title}">
                </div>
                <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">${
                      item.title
                    }</div>
                </div>
            </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900 dark:text-white">$${(
              item.price *
              (1 - item.discountPercentage / 100)
            ).toFixed(2)}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
                <span class="line-through">$${item.price}</span>
                <span class="text-green-600">-${item.discountPercentage}%</span>
            </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center space-x-2">
                <button 
                    onclick="updateQuantity(${index}, -1)"
                    class="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                    <i class="fas fa-minus"></i>
                </button>
                <span class="text-sm text-gray-900 dark:text-white w-full max-w-[20px] text-center">${
                  item.quantity 
                }</span>
                <button 
                    onclick="updateQuantity(${index}, 1)"
                    class="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
            $${calculateItemTotal(item)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button 
                onclick="removeFromCart(${index})"
                class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-600"
            >
                <i class="fas fa-trash"></i>
            </button>
        </td>
    </tr>
`
    )
    .join("");

  cartTotal.textContent = calculateCartTotal();
}

renderCart();
