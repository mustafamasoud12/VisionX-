// ======================================
// VisionX Store
// ======================================

const products = [

    // ================= Fertilizers =================

    {
        id: 1,
        name: "NPK 20-20-20",
        category: "fertilizer",
        price: 220,
        image: "images/npk.jpg.png"
    },

    {
        id: 2,
        name: "Urea 46%",
        category: "fertilizer",
        price: 430,
        image: "images/urea.jpg.png"
    },

    {
        id: 3,
        name: "Ammonium Nitrate",
        category: "fertilizer",
        price: 350,
        image: "images/ammonium_nitrate.jpg.png"
    },

    {
        id: 4,
        name: "Calcium Nitrate",
        category: "fertilizer",
        price: 260,
        image: "images/calcium_nitrate.jpg.png"
    },

    {
        id: 5,
        name: "Potassium Sulfate",
        category: "fertilizer",
        price: 390,
        image: "images/potassium_sulfate.jpg.png"
    },

    {
        id: 6,
        name: "Mono Potassium Phosphate (MKP)",
        category: "fertilizer",
        price: 340,
        image: "images/mkp.jpg.png"
    },

    {
        id: 7,
        name: "MAP Fertilizer",
        category: "fertilizer",
        price: 330,
        image: "images/map.jpg.png"
    },

    {
        id: 8,
        name: "DAP Fertilizer",
        category: "fertilizer",
        price: 360,
        image: "images/dap.jpg.png"
    },

    {
        id: 9,
        name: "Magnesium Sulfate",
        category: "fertilizer",
        price: 170,
        image: "images/magnesium.jpg.png"
    },

    {
        id: 10,
        name: "Organic Compost",
        category: "fertilizer",
        price: 160,
        image: "images/compost.jpg.png"
    },
            // ================= Fungicides =================

    {
        id: 11,
        name: "Mancozeb",
        category: "fungicide",
        price: 130,
        image: "images/mancozeb.jpg.png"
    },

    {
        id: 12,
        name: "Copper Oxychloride",
        category: "fungicide",
        price: 180,
        image: "images/copper.jpg.png"
    },

    {
        id: 13,
        name: "Propiconazole",
        category: "fungicide",
        price: 240,
        image: "images/propiconazole.jpg.png"
    },

    {
        id: 14,
        name: "Wettable Sulfur",
        category: "fungicide",
        price: 110,
        image: "images/sulfur.jpg.png"
    },

    {
        id: 15,
        name: "Metalaxyl",
        category: "fungicide",
        price: 210,
        image: "images/metalaxyl.jpg.png"
    },

    {
        id: 16,
        name: "Azoxystrobin",
        category: "fungicide",
        price: 290,
        image: "images/azoxystrobin.jpg.png"
    },

    {
        id: 17,
        name: "Carbendazim",
        category: "fungicide",
        price: 150,
        image: "images/carbendazim.jpg.png"
    },

    {
        id: 18,
        name: "Difenoconazole",
        category: "fungicide",
        price: 230,
        image: "images/difenoconazole.jpg.png"
    },

    {
        id: 19,
        name: "Chlorothalonil",
        category: "fungicide",
        price: 210,
        image: "images/chlorothalonil.jpg.png"
    },

    {
        id: 20,
        name: "Cymoxanil",
        category: "fungicide",
        price: 250,
        image: "images/cymoxanil.jpg.png"
    },
            // ================= Insecticides =================

    {
        id: 21,
        name: "Imidacloprid",
        category: "insecticide",
        price: 165,
        image: "images/imidacloprid.jpg.png"
    },

    {
        id: 22,
        name: "Abamectin",
        category: "insecticide",
        price: 145,
        image: "images/abamectin.jpg.png"
    },

    {
        id: 23,
        name: "Lambda Cyhalothrin",
        category: "insecticide",
        price: 175,
        image: "images/lambda.jpg.png"
    },

    {
        id: 24,
        name: "Acetamiprid",
        category: "insecticide",
        price: 180,
        image: "images/acetamiprid.jpg.png"
    },

    {
        id: 25,
        name: "Emamectin Benzoate",
        category: "insecticide",
        price: 200,
        image: "images/emamectin.jpg.png"
    },

    {
        id: 26,
        name: "Chlorpyrifos",
        category: "insecticide",
        price: 195,
        image: "images/chlorpyrifos.jpg.png"
    },

    {
        id: 27,
        name: "Deltamethrin",
        category: "insecticide",
        price: 140,
        image: "images/deltamethrin.jpg.png"
    },

    {
        id: 28,
        name: "Spinosad",
        category: "insecticide",
        price: 290,
        image: "images/spinosad.jpg.png"
    },

    {
        id: 29,
        name: "Thiamethoxam",
        category: "insecticide",
        price: 220,
        image: "images/thiamethoxam.jpg.png"
    },

    {
        id: 30,
        name: "Bifenthrin",
        category: "insecticide",
        price: 240,
        image: "images/bifenthrin.jpg.png"
    }

];
// =============================
// Store Logic
// =============================

const storeContainer = document.getElementById("store-container");
const searchInput = document.getElementById("searchInput");

function displayProducts(productsList) {

    if (!storeContainer) return;

    storeContainer.innerHTML = "";

    productsList.forEach(product => {

        storeContainer.innerHTML += `

        <div class="product-card">

            <img src="${product.image}" alt="${product.name}">

            <h2>${product.name}</h2>

            <p>${product.category}</p>

            <h3>${product.price} EGP / kg</h3>

<div class="weight-box">

    <label>Weight:</label>

    <select id="weight-${product.id}" class="weight-select">

        <option value="250">250 g</option>
        <option value="500">500 g</option>
        <option value="1000" selected>1 kg</option>
        <option value="2000">2 kg</option>
        <option value="5000">5 kg</option>

    </select>

</div>

<button
    class="buy-btn"
    onclick="addToCart(${product.id})">

    Add To Cart

</button>

        </div>

        `;

    });

}
// =============================
// Search
// =============================

if (searchInput) {

    searchInput.addEventListener("input", function () {

        const value = this.value.toLowerCase();

        const filtered = products.filter(product =>

            product.name.toLowerCase().includes(value) ||

            product.category.toLowerCase().includes(value)

        );

        displayProducts(filtered);

    });

}

// =============================
// Filter
// =============================

function filterProducts(category) {

    if (category === "all") {

        displayProducts(products);

        return;

    }

    const filtered = products.filter(product => product.category === category);

    displayProducts(filtered);

}
// =============================
// Cart
// =============================

function addToCart(id){

    const product = products.find(p => p.id === id);

    const weight = Number(document.getElementById(`weight-${id}`).value);

    const finalPrice = (product.price * weight) / 1000;

    let cart = JSON.parse(localStorage.getItem("visionx-cart")) || [];

    cart.push({

        id: product.id,
        name: product.name,
        image: product.image,

        category: product.category,

        weight: weight,

        unitPrice: product.price,

        price: finalPrice

    });

    localStorage.setItem("visionx-cart", JSON.stringify(cart));

    updateCartCount();

    alert(`${product.name} (${weight} g) added successfully.`);

}

// =============================
// Cart Counter
// =============================

function updateCartCount() {

    const cart = JSON.parse(localStorage.getItem("visionx-cart")) || [];

    const cartLink = document.querySelector('a[href="cart.html"]');

    if (cartLink) {

        cartLink.textContent = `Cart (${cart.length})`;

    }

}

// =============================
// Start
// =============================

document.addEventListener("DOMContentLoaded", () => {

    displayProducts(products);

    updateCartCount();

});
