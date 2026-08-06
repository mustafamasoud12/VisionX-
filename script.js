
const imageInput = document.getElementById('image-upload');
const previewArea = document.getElementById('preview-area');
const dropZone = document.getElementById('drop-zone');
const errorMsg = document.getElementById('error-msg');
const analyzeBtn = document.getElementById('analyze-btn');
const loading = document.getElementById('loading');
const resultsContent = document.getElementById('results-content');
const themeToggle = document.getElementById('theme-toggle');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history-btn');


const API_URL = "http://127.0.0.1:5000/predict"; 

let selectedFile = null;
let currentImageData = null;


const plantDatabase = {
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {
        name: "تبقع الأوراق السيركوسبوري (الرمادي) في الذرة",
        symptoms: "ظهور بقع مستطيلة ضيقة ذات لون بني إلى رمادي تمتد بين عروق أوراق الذرة، وتؤدي لجفاف الأوراق عند شدة الإصابة.",
        treatment: "استخدام أصناف مقاومة، التناوب الزراعي (الدورة الزراعية)، ورش المبيدات الفطرية مثل (Azoxystrobin أو Propiconazole)."
    },
    "Apple___Apple_scab": {
        name: "مرض جرب التفاح",
        symptoms: "ظهور بقع زيتونية إلى رمادية داكنة مخملية الملمس على الأوراق، مما يسبب تشوهها وجفافها وسقوطها المبكر.",
        treatment: "رش المبيدات الفطرية (مثل Difenoconazole أو Mancozeb)، وتجميع الأوراق المتساقطة وحرقها."
    },
    "Cherry_(including_sour)___Powdery_mildew": {
        name: "مرض البياض الدقيقي في الكرز",
        symptoms: "طبقة دقيقية بيضاء أو رمادية على السطح العلوي للأوراق والأغصان الحديثة تؤدي لتجعد الأوراق وجفافها.",
        treatment: "الرش بمبيدات الكبريت الميكروني وتقليم الأجزاء المصابة لزيادة تهوية الشجرة."
    }
};


function handleFile(file) {
    if (errorMsg) errorMsg.textContent = '';

    if (!file) return;

    if (!file.type.startsWith('image/')) {
        if (errorMsg) errorMsg.textContent = 'Please upload a valid image file (JPG, PNG, etc).';
        return;
    }

    selectedFile = file; 

    const reader = new FileReader();
    reader.onload = function (e) {
        currentImageData = e.target.result;
        
        if (previewArea) {
            previewArea.innerHTML = `<img src="${currentImageData}" alt="Uploaded plant photo" style="max-width: 100%; max-height: 250px; border-radius: 8px; margin: 15px 0;">`;
        }
        
        if (analyzeBtn) {
            analyzeBtn.style.display = 'inline-block';
            analyzeBtn.disabled = false;
        }
        
        if (resultsContent) {
            resultsContent.innerHTML = '<p class="placeholder-text">Click "Analyze Photo" to run the AI diagnosis.</p>';
        }
    };
    reader.readAsDataURL(file);
}

if (imageInput) {
    imageInput.addEventListener('change', function () {
        handleFile(this.files[0]);
    });
}

if (dropZone) {
    ['dragenter', 'dragover'].forEach(evt => {
        dropZone.addEventListener(evt, function (e) {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });
    });

    ['dragleave', 'drop'].forEach(evt => {
        dropZone.addEventListener(evt, function (e) {
            e.preventDefault();
            dropZone.classList.remove('dragover');
        });
    });

    dropZone.addEventListener('drop', function (e) {
        const file = e.dataTransfer.files[0];
        handleFile(file);
    });
}


if (analyzeBtn) {
    analyzeBtn.addEventListener('click', async function () {
        if (!selectedFile) return;

        
        if (loading) loading.style.display = 'block';
        if (resultsContent) resultsContent.innerHTML = '';
        analyzeBtn.disabled = true;

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            
            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error("Server response error");
            }

            const result = await response.json();

            
            const rawClass = result.disease_name || result.class || result.class_name || "";
            
            const localData = plantDatabase[rawClass] || {};

            const finalName = localData.name || rawClass;
            
            
            let finalSymptoms = result.symptoms || result.description;
            if (!finalSymptoms || finalSymptoms.includes("لا توجد تفاصيل")) {
                finalSymptoms = localData.symptoms || "ظهور بقع وتغير في ألوان الأوراق المصابة مع جفاف الأنسجة.";
            }

            let finalTreatment = result.treatment || result.recommendation;
            if (!finalTreatment || finalTreatment.includes("لا توجد توصيات")) {
                finalTreatment = localData.treatment || "يُنصح بعزل الجزء المصاب وتقليمه ورش مبيد فطري مناسب مع استشارة مهندس زراعي.";
            }

            if (resultsContent) {
                resultsContent.innerHTML = `
                    <div class="result-disease" style="color:#4ade80; font-size:1.2rem; font-weight:bold;">${finalName}</div>
                    <div class="result-confidence" style="margin: 5px 0;">نسبة الثقة: ${result.confidence}%</div>
                    <div class="confidence-bar" style="background:#334155; height:8px; border-radius:4px; overflow:hidden; margin-bottom:10px;">
                        <div class="confidence-fill" style="width:${result.confidence}%; background:#22c55e; height:100%;"></div>
                    </div>
                    <div class="result-tips" style="margin-top:8px;"><strong>الأعراض/الوصف:</strong> ${finalSymptoms}</div>
                    <div class="result-tips" style="margin-top:5px;"><strong>العلاج:</strong> ${finalTreatment}</div>
                `;
            }

            
            saveToHistory(currentImageData, finalName);

        } catch (error) {
            console.error("AI Analysis Error:", error);
            
            if (resultsContent) {
                resultsContent.innerHTML = `
                    <div style="color: #ef4444; border: 1px solid #ef4444; padding: 12px; border-radius: 8px;">
                        <p style="margin:0; font-weight:bold;">فشل الاتصال بسيرفر الذكاء الاصطناعي!</p>
                        <small>تأكد من تشغيل ملف Python (main.py أو predict.py) على الجهاز.</small>
                    </div>
                `;
            }
        } finally {
            if (loading) loading.style.display = 'none';
            analyzeBtn.disabled = false;
        }
    });
}


function saveToHistory(imageData, diseaseName) {
    let history = JSON.parse(localStorage.getItem('visionx-history') || '[]');
    history.unshift({ image: imageData, disease: diseaseName, date: new Date().toLocaleDateString() });
    history = history.slice(0, 3);
    localStorage.setItem('visionx-history', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    if (!historyList) return;
    const history = JSON.parse(localStorage.getItem('visionx-history') || '[]');

    if (history.length === 0) {
        historyList.innerHTML = '<p class="placeholder-text">No history yet.</p>';
        return;
    }

    historyList.innerHTML = history.map(item => `
        <div class="history-item" style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
            <img src="${item.image}" alt="${item.disease}" style="width:40px; height:40px; border-radius:4px; object-fit:cover;">
            <span>${item.disease}</span>
        </div>
    `).join('');
}

if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', function () {
        localStorage.removeItem('visionx-history');
        renderHistory();
    });
}


function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark');
        if (themeToggle) themeToggle.textContent = '☀️';
    } else {
        document.body.classList.remove('dark');
        if (themeToggle) themeToggle.textContent = '🌙';
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', function () {
        const isDark = document.body.classList.contains('dark');
        const newTheme = isDark ? 'light' : 'dark';
        localStorage.setItem('visionx-theme', newTheme);
        applyTheme(newTheme);
    });
}


function setupSectionNavigation() {
    const navLinks = document.querySelectorAll('header nav a, .nav-links a, a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}


document.addEventListener('DOMContentLoaded', function () {
    const savedTheme = localStorage.getItem('visionx-theme') || 'dark';
    applyTheme(savedTheme);
    renderHistory();
    setupSectionNavigation();
});
// ================= STORE =================

let cart = JSON.parse(localStorage.getItem("visionx-cart")) || [];

document.querySelectorAll(".buy-btn").forEach(button => {

    button.addEventListener("click", function () {

        const card = this.parentElement;

        const product = {
            name: card.querySelector("h2").innerText,
            price: card.querySelector("h3").innerText,
            image: card.querySelector("img").src
        };

        cart.push(product);

        localStorage.setItem("visionx-cart", JSON.stringify(cart));

        alert(product.name + " added to cart!");
    });

});
// ================= CART =================

const cartContainer = document.getElementById("cart-container");

if(cartContainer){

    const cart = JSON.parse(localStorage.getItem("visionx-cart")) || [];

    if(cart.length===0){

        cartContainer.innerHTML="<h2>Your cart is empty.</h2>";

    }else{

        cart.forEach(product=>{

            cartContainer.innerHTML+=`

            <div class="product-card">

            <img src="${product.image}">

            <h2>${product.name}</h2>

            <h3>${product.price}</h3>

            <button>Checkout</button>

            </div>

            `;

        });

    }

}
// Search Products

const searchInput = document.getElementById("searchInput");

if(searchInput){

searchInput.addEventListener("keyup",function(){

const value=this.value.toLowerCase();

const cards=document.querySelectorAll(".product-card");

cards.forEach(card=>{

const name=card.querySelector("h2").innerText.toLowerCase();

if(name.includes(value)){

card.style.display="block";

}else{

card.style.display="none";

}

});

});

}
// ================= STORE =================

const products = [

{
    id:1,
    name:"NPK Fertilizer",
    category:"fertilizer",
    price:220,
    image:"images/npk.jpg"
},

{
    id:2,
    name:"Organic Compost",
    category:"fertilizer",
    price:150,
    image:"images/compost.jpg"
},

{
    id:3,
    name:"Calcium Nitrate",
    category:"fertilizer",
    price:260,
    image:"images/calcium.jpg"
},

{
    id:4,
    name:"Copper Oxychloride",
    category:"fungicide",
    price:170,
    image:"images/copper.jpg"
},

{
    id:5,
    name:"Mancozeb",
    category:"fungicide",
    price:120,
    image:"images/mancozeb.jpg"
},

{
    id:6,
    name:"Abamectin",
    category:"insecticide",
    price:140,
    image:"images/abamectin.jpg"
}

];

const storeContainer=document.getElementById("store-container");
const searchInput=document.getElementById("searchInput");

function displayProducts(list){

    if(!storeContainer) return;

    storeContainer.innerHTML="";

    list.forEach(product=>{

        storeContainer.innerHTML+=`

        <div class="product-card">

            <img src="${product.image}" alt="${product.name}">

            <h2>${product.name}</h2>

            <p>${product.category}</p>

            <h3>${product.price} EGP</h3>

            <button class="buy-btn">
            Add To Cart
            </button>

        </div>

        `;

    });

}

if(storeContainer){

displayProducts(products);

searchInput.addEventListener("input",()=>{

const value=searchInput.value.toLowerCase();

const filtered=products.filter(product=>

product.name.toLowerCase().includes(value)

);

displayProducts(filtered);

});

}