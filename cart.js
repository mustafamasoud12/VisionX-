const cartContainer = document.getElementById("cart-container");

let cart = JSON.parse(localStorage.getItem("visionx-cart")) || [];

function renderCart() {

    if (!cartContainer) return;

    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <h2>Your cart is empty.</h2>
        `;

        updateCartCount();

        return;
    }

    let total = 0;

    cartContainer.innerHTML = "";

    cart.forEach((product, index) => {

        total += Number(product.price);

        const weightText =
            product.weight >= 1000
                ? `${product.weight / 1000} kg`
                : `${product.weight} g`;

        cartContainer.innerHTML += `

        <div class="product-card">

            <img src="${product.image}" alt="${product.name}">

            <h2>${product.name}</h2>

            <p><strong>Category:</strong> ${product.category}</p>

            <p><strong>Weight:</strong> ${weightText}</p>

            <p><strong>Price / kg:</strong> ${product.unitPrice} EGP</p>

            <h3>Total Price: ${product.price.toFixed(2)} EGP</h3>

            <button onclick="removeItem(${index})">
                Remove
            </button>

        </div>

        `;

    });

    cartContainer.innerHTML += `

    <div class="cart-total">

        <h2>Total: ${total.toFixed(2)} EGP</h2>

        <button onclick="checkout()">
            Checkout
        </button>

    </div>

    `;

    updateCartCount();
}

function removeItem(index) {

    cart.splice(index, 1);

    localStorage.setItem("visionx-cart", JSON.stringify(cart));

    renderCart();
}

function checkout() {

    alert("Order placed successfully!");

    cart = [];

    localStorage.removeItem("visionx-cart");

    renderCart();
}

function updateCartCount() {

    const cart = JSON.parse(localStorage.getItem("visionx-cart")) || [];

    const cartLink = document.querySelector('a[href="cart.html"]');

    if (cartLink) {

        cartLink.textContent = `Cart (${cart.length})`;

    }
}

renderCart();