// document.addEventListener('DOMContentLoaded', () => {

//     /* === 1. СООДА АРАБАСЫ (КОРЗИНА) ФУНКЦИЯСЫ === */

//     // localStorageдон корзинаны алуу
//     let cart = JSON.parse(localStorage.getItem('cart')) || [];

//     const cartIconBtn = document.getElementById('cart-icon');
//     const cartContainer = document.getElementById('cart-container');
//     const cartList = document.getElementById('cart-list');
//     const cartTotalSpan = document.getElementById('cart-total');
//     const cartCountSpan = document.getElementById('cart-count');
//     const checkoutBtn = document.getElementById('checkout-btn');
//     const clearCartBtn = document.getElementById('clear-cart-btn');

//     // Корзинаны көрсөтүү/жашыруу
//     cartIconBtn.addEventListener('click', () => {
//         cartContainer.classList.toggle('hidden');
//     });

//     // Продукт кошуу
//     document.querySelectorAll('.add-to-cart-btn').forEach(button => {
//         button.addEventListener('click', (event) => {
//             const card = event.target.closest('.product-card');
//             const id = card.dataset.productId;
//             const name = card.dataset.name;
//             const price = parseFloat(card.dataset.price);

//             addToCart(id, name, price);
//         });
//     });

//     function addToCart(id, name, price) {
//         const existingItem = cart.find(item => item.id === id);

//         if (existingItem) {
//             existingItem.quantity += 1;
//         } else {
//             cart.push({ id, name, price, quantity: 1 });
//         }

//         saveCart();
//         updateCartDisplay();
//     }

//     // Корзинаны сактоо
//     function saveCart() {
//         localStorage.setItem('cart', JSON.stringify(cart));
//     }

//     // Корзинаны тазалоо
//     clearCartBtn.addEventListener('click', () => {
//         cart = [];
//         saveCart();
//         updateCartDisplay();
//     });

//     // Корзинаны жаңыртуу
//     function updateCartDisplay() {
//         cartList.innerHTML = '';
//         let total = 0;
//         let itemCount = 0;

//         if (cart.length === 0) {
//             cartList.innerHTML = '<li class="empty-cart-message">Корзина бош</li>';
//             checkoutBtn.disabled = true;
//         } else {
//             cart.forEach(item => {
//                 const itemTotal = item.price * item.quantity;
//                 total += itemTotal;
//                 itemCount += item.quantity;

//                 const listItem = document.createElement('li');
//                 listItem.innerHTML = `
//                     <span class="cart-item-name">${item.name}</span>
//                     <span class="cart-item-qty">x${item.quantity}</span>
//                     <span class="cart-item-total">${itemTotal} ₸</span>
//                 `;
//                 cartList.appendChild(listItem);
//             });
//             checkoutBtn.disabled = false;
//         }

//         cartTotalSpan.textContent = total.toLocaleString('ru-RU');
//         cartCountSpan.textContent = itemCount;
//     }

//     // Баштап кошуу
//     updateCartDisplay();


//     /* === 2. СКРОЛЛ АНИМАЦИЯСЫ === */

//     const productCards = document.querySelectorAll('.product-card');

//     const observerOptions = {
//         root: null,
//         rootMargin: '0px',
//         threshold: 0.1
//     };

//     const observer = new IntersectionObserver((entries, observer) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 entry.target.classList.add('visible');
//                 observer.unobserve(entry.target);
//             }
//         });
//     }, observerOptions);

//     productCards.forEach(card => {
//         observer.observe(card);
//     });


//     /* === 3. CHECKOUT ПАНЕЛИ === */

//     const checkoutList = document.getElementById('checkout-list');
//     const checkoutTotal = document.getElementById('checkout-total');

//     function updateCheckout() {
//         let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
//         checkoutList.innerHTML = '';

//         if (currentCart.length === 0) {
//             checkoutList.innerHTML = '<li class="empty-cart-message">Ваша корзина пока пуста</li>';
//             checkoutTotal.textContent = '0';
//             return;
//         }

//         let total = 0;
//         currentCart.forEach(item => {
//             const li = document.createElement('li');
//             li.textContent = `${item.name} x ${item.quantity} - ${item.price * item.quantity} ₸`;
//             checkoutList.appendChild(li);
//             total += item.price * item.quantity;
//         });

//         checkoutTotal.textContent = total;
//     }

//     updateCheckout();

//     /* === 4. ФОРМАНЫ ЖӨНӨТҮҮ === */

//     const checkoutForm = document.getElementById('checkout-form');
//     checkoutForm.addEventListener('submit', function (e) {
//         e.preventDefault();

//         document.getElementById('order-success').style.display = 'block';

//         localStorage.removeItem('cart');
//         cart = [];

//         updateCartDisplay();
//         updateCheckout();
//         checkoutForm.reset();
//     });

// });
document.addEventListener('DOMContentLoaded', () => {

    /* === 1. КОРЗИНА (СООДА АРАБАСЫ) ФУНКЦИЯСЫ === */

    // 1.1. Элементтерди инициализациялоо
    const cartIconBtn = document.getElementById('cart-icon');
    const cartContainer = document.getElementById('cart-container');
    const cartList = document.getElementById('cart-list');
    const cartTotalSpan = document.getElementById('cart-total');
    const cartCountSpan = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');

    // localStorage'дан корзинаны жүктөө же бош массив түзүү
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // 1.2. Корзинаны көрсөтүү/жашыруу
    cartIconBtn.addEventListener('click', () => {
        cartContainer.classList.toggle('hidden');
    });

    // 1.3. Корзинаны жаңыртуу
    function updateCartDisplay() {
        cartList.innerHTML = '';
        let total = 0;
        let itemCount = 0;

        if (cart.length === 0) {
            cartList.innerHTML = '<li class="empty-cart-message">Корзина бош</li>';
            checkoutBtn.disabled = true;
        } else {
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                itemCount += item.quantity;

                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-qty">x${item.quantity}</span>
                    <span class="cart-item-total">${itemTotal} ₸</span>
                `;
                cartList.appendChild(listItem);
            });
            checkoutBtn.disabled = false;
        }

        cartTotalSpan.textContent = total.toLocaleString('ru-RU');
        cartCountSpan.textContent = itemCount;

        // localStorage'ды дайыма жаңыртуу
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // 1.4. Продуктуларды кошуу логикасы
    function addToCart(id, name, price) {
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            // Price мааниси санды (number) экенин текшерүү
            cart.push({ id, name, price: parseFloat(price), quantity: 1 });
        }

        updateCartDisplay();
    }

    // 1.5. "Корзинага кошуу" баскычтарына окуя кошуу
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const card = event.target.closest('.product-card');
            const id = card.dataset.productId;
            const name = card.dataset.name;
            const price = parseFloat(card.dataset.price);

            addToCart(id, name, price);
        });
    });

    // Барак жүктөлгөндө корзинаны жаңыртуу
    updateCartDisplay();


    /* === 2. СКРОЛЛ АНИМАЦИЯСЫ (Intersection Observer) === */

    // Бул код .product-card элементтерине 'visible' классын кошуп, аларды көрсөтөт.
    const productCards = document.querySelectorAll('.product-card');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // 10% бөлүгү көрүнгөндө иштетүү
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Көрүнгөндөн кийин токтотот
            }
        });
    }, observerOptions);

    productCards.forEach(card => {
        observer.observe(card);
    });
});
