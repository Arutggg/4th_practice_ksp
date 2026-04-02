const products = [
    {
        id: 1,
        name: "Кофе в зернах 'Эфиопия Сидамо'",
        price: 890,
        category: "зерновой",
        image: "images/sidamo-dark-1kg-700.jpg"
    },
    {
        id: 2,
        name: "Молотый кофе 'Колумбия Супремо'",
        price: 650,
        category: "молотый",
        image: "images/colombia-supremo-200g-ground.jpg"
    },
    {
        id: 3,
        name: "Кофе в капсулах 'Итальянский бленд'",
        price: 1200,
        category: "капсульный",
        image: "images/images.jpeg"
    }
];


// Загрузка корзины из LocalStorage при старте
const savedCart = localStorage.getItem("cart");
let cart = savedCart ? JSON.parse(savedCart) : [];

// Сохранение корзины в LocalStorage
const saveCart = () => {
    localStorage.setItem("cart", JSON.stringify(cart));
};


document.addEventListener('DOMContentLoaded', function() {

    const filterButtons = document.querySelectorAll('.filter-btn');
    const productItems = document.querySelectorAll('.catalog-item');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    if (!cartItemsContainer) return;

    updateCart();

    const filterProducts = (category) => {
        productItems.forEach(item => {
            const itemCategory = item.dataset.category;
            if (category === 'all' || itemCategory === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    };

    if (filterButtons) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.filter;
                filterProducts(category);
            });
        });
    }

    const addToCart = (productId) => {
        const product = products.find(p => p.id === productId);

        if (product) {
            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1
                });
            }

            saveCart(); 
            updateCart();
        }
    };

    const removeFromCart = (productId) => {
        cart = cart.filter(item => item.id !== productId);
        saveCart(); 
        updateCart();
    };

    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const calculateCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    function updateCart() {
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Корзина пуста</p>';
            cartTotalElement.textContent = '0';
            cartCountElement.textContent = '0';
            return;
        }

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <p><b>${item.name}</b> | ${item.price} руб. x ${item.quantity}</p>
                <button class="remove-item" data-id="${item.id}">Удалить</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = Number(btn.dataset.id);
                removeFromCart(id);
            });
        });

        const total = calculateTotal();
        const count = calculateCount();

        cartTotalElement.textContent = total;
        cartCountElement.textContent = count;
    }

    if (addToCartButtons) {
        addToCartButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = Number(btn.dataset.id);
                addToCart(id);
            });
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Корзина пуста');
            } else {
                alert('Спасибо за покупку!');
                cart = [];
                saveCart(); 
                updateCart();
            }
        });
    }

    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                cart = [];
                saveCart(); 
                updateCart();
            }
        });
    }
});