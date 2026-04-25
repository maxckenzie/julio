// Ju+ Lanches Main Script

// Data
const menuItems = [
    {
        id: 'o1',
        name: '🔥 Oferta: Smash Duplo + Fritas',
        description: 'Nosso famoso Smash Duplo Glow com uma porção de batata frita Led. Oferta imperdível do dia!',
        price: 34.90,
        image: './assets/burger.png',
        category: 'oferta'
    },
    {
        id: 'c1',
        name: 'Combo Casal Night',
        description: '2 X-Neon Burgers, 1 Batata Frita Led Grande e 2 Bebidas (Refrigerante ou Suco).',
        price: 79.90,
        image: './assets/burger.png',
        category: 'casal'
    },
    {
        id: 'f1',
        name: 'Combo Família Bus',
        description: '4 Burgers (escolha entre Neon ou Chicken), 2 Batatas Fritas Grandes e 1 Refrigerante 2L.',
        price: 129.90,
        image: './assets/burger.png',
        category: 'familia'
    },
    {
        id: 'p1',
        name: 'X-Neon Burger',
        description: 'Hambúrguer artesanal 200g, queijo cheddar derretido, bacon crocante, molho especial da casa em um pão brioche dourado.',
        price: 32.90,
        image: './assets/burger.png',
        category: 'lanches'
    },
    {
        id: 'p2',
        name: 'Smash Duplo Glow',
        description: 'Dois smash burgers de 90g, queijo prato, cebola roxa caramelizada e maionese verde no pão brioche.',
        price: 28.50,
        image: './assets/burger.png',
        category: 'lanches'
    },
    {
        id: 'p3',
        name: 'Chicken Crispy Bus',
        description: 'Filé de frango empanado super crocante, alface americana, tomate e maionese defumada.',
        price: 25.90,
        image: './assets/burger.png',
        category: 'lanches'
    },
    {
        id: 'p4',
        name: 'Hot Dog Night',
        description: 'Salsicha Frankfurt, purê de batata cremoso, vinagrete, milho, ervilha e batata palha extrafina.',
        price: 18.00,
        image: './assets/hot_dog.png',
        category: 'lanches'
    },
    {
        id: 'p5',
        name: 'Batata Frita Led',
        description: 'Porção generosa de batatas fritas onduladas, super crocantes por fora e macias por dentro.',
        price: 15.00,
        image: './assets/burger.png',
        category: 'lanches'
    },
    {
        id: 'p6',
        name: 'Milkshake Cosmic',
        description: 'Milkshake de morango com chantilly, confeitos coloridos e calda neon de cereja.',
        price: 16.50,
        image: './assets/burger.png',
        category: 'bebidas'
    },
    {
        id: 'p7',
        name: 'Açaí Tradicional 500ml',
        description: 'Açaí puro e cremoso, acompanhado de leite em pó, banana e leite condensado.',
        price: 22.00,
        image: './assets/acai_bowl.png',
        category: 'acai'
    },
    {
        id: 'p8',
        name: 'Açaí Supremo 700ml',
        description: 'Açaí trufado com Nutella, morangos frescos, kiwi, granola e paçoca.',
        price: 34.90,
        image: './assets/acai_bowl.png',
        category: 'acai'
    },
    {
        id: 'p9',
        name: 'Coca-Cola Lata 350ml',
        description: 'Bem gelada!',
        price: 6.00,
        image: './assets/drinks.png',
        category: 'bebidas'
    },
    {
        id: 'p10',
        name: 'Suco Natural de Laranja',
        description: 'Feito na hora, 500ml.',
        price: 9.00,
        image: './assets/drinks.png',
        category: 'bebidas'
    }
];

// State
let cart = [];
let orders = {}; // Simulated backend database { "PED-123": { status: 2, ... } }
let currentCategory = 'lanches';

// DOM Elements
const menuGrid = document.getElementById('menu-grid');
const cartModal = document.getElementById('cart-modal');
const successModal = document.getElementById('success-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCountElement = document.getElementById('cart-count');
const proceedCheckoutBtn = document.getElementById('proceed-checkout-btn');
const checkoutForm = document.getElementById('checkout-form');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    setupEventListeners();
    setupParallax();
});

function setupParallax() {
    const heroBg = document.querySelector('.hero-bg');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
            heroBg.style.transform = `scale(1.05) translateY(${scrollY * 0.3}px)`;
        }
    });
}

function renderMenu() {
    const filteredItems = menuItems.filter(item => item.category === currentCategory);
    
    if (filteredItems.length === 0) {
        menuGrid.innerHTML = '<p style="color: #fff; text-align: center; width: 100%;">Nenhum item encontrado nesta categoria.</p>';
        return;
    }

    menuGrid.innerHTML = filteredItems.map(item => `
        <div class="menu-card">
            <div class="menu-card-img" style="background-image: url('${item.image}')"></div>
            <div class="menu-card-content">
                <h3 class="menu-card-title">${item.name}</h3>
                <p class="menu-card-desc">${item.description}</p>
                <div class="menu-card-footer">
                    <span class="menu-card-price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                    <button class="add-to-cart-btn" onclick="addToCart('${item.id}')" title="Adicionar ao carrinho">
                        <i data-lucide="plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    // Re-initialize icons for dynamic content
    lucide.createIcons();
}

function setupEventListeners() {
    // Menu Tabs
    const tabs = document.querySelectorAll('.menu-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            // Remove active class from all
            tabs.forEach(t => t.classList.remove('active'));
            // Add to clicked
            e.target.classList.add('active');
            // Update state and render
            currentCategory = e.target.getAttribute('data-category');
            renderMenu();
        });
    });

    // Modals
    document.getElementById('open-cart-btn').addEventListener('click', () => {
        cartModal.classList.add('active');
    });
    
    document.getElementById('close-cart-btn').addEventListener('click', () => {
        cartModal.classList.remove('active');
        // Reset checkout form if it was open
        checkoutForm.classList.add('hidden');
        proceedCheckoutBtn.classList.remove('hidden');
    });

    // Close on overlay click
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) cartModal.classList.remove('active');
    });
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) successModal.classList.remove('active');
    });

    // Proceed to checkout
    proceedCheckoutBtn.addEventListener('click', () => {
        proceedCheckoutBtn.classList.add('hidden');
        checkoutForm.classList.remove('hidden');
    });

    // Form Submission
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        finalizeOrder();
    });

    // Tracking
    document.getElementById('track-btn').addEventListener('click', trackOrder);
    
    // Success Modal Buttons
    document.getElementById('close-success-btn').addEventListener('click', () => {
        successModal.classList.remove('active');
    });
    
    document.getElementById('track-now-btn').addEventListener('click', () => {
        successModal.classList.remove('active');
        document.getElementById('rastreio').scrollIntoView({ behavior: 'smooth' });
    });
}

// Cart Logic
window.addToCart = function(productId) {
    const product = menuItems.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    
    // Show quick feedback (could be a toast, here we just bounce the cart icon)
    const cartBtn = document.getElementById('open-cart-btn');
    cartBtn.style.transform = 'scale(1.2)';
    setTimeout(() => cartBtn.style.transform = '', 200);
}

window.updateQuantity = function(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }
    
    updateCartUI();
}

function updateCartUI() {
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;

    // Update Cart Modal Content
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg" style="text-align: center; color: var(--text-muted); margin-top: 2rem;">Seu carrinho está vazio</div>';
        proceedCheckoutBtn.disabled = true;
        cartTotalElement.textContent = 'R$ 0,00';
    } else {
        proceedCheckoutBtn.disabled = false;
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-img" style="background-image: url('${item.image}')"></div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</div>
                </div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)"><i data-lucide="minus" size="16"></i></button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)"><i data-lucide="plus" size="16"></i></button>
                </div>
            </div>
        `).join('');
        lucide.createIcons();

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalElement.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
}

// Order Simulation
function finalizeOrder() {
    const name = document.getElementById('c-name').value;
    const whatsapp = document.getElementById('c-whatsapp').value;
    const address = document.getElementById('c-address').value;
    
    // Generate Order ID
    const orderId = 'PED-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    // Save to simulated DB
    orders[orderId] = {
        id: orderId,
        status: 1, // 1: Recebido, 2: Em preparo, 3: Pronto, 4: A caminho, 5: Entregue
        name: name,
        address: address,
        items: [...cart]
    };

    // Reset Cart
    cart = [];
    updateCartUI();
    
    // Close cart modal, show success modal
    cartModal.classList.remove('active');
    document.getElementById('success-order-id').textContent = orderId;
    successModal.classList.add('active');
    
    // Pre-fill tracking input
    document.getElementById('order-id-input').value = orderId;
    
    // Reset forms
    checkoutForm.reset();
    checkoutForm.classList.add('hidden');
    proceedCheckoutBtn.classList.remove('hidden');

    // Simulate order progression
    simulateOrderProgress(orderId);
}

function simulateOrderProgress(orderId) {
    const stages = [
        { status: 2, delay: 5000 },   // Em preparo após 5s
        { status: 3, delay: 15000 },  // Pronto após 15s
        { status: 4, delay: 20000 },  // A caminho após 20s
        { status: 5, delay: 30000 }   // Entregue após 30s
    ];

    stages.forEach(stage => {
        setTimeout(() => {
            if (orders[orderId]) {
                orders[orderId].status = stage.status;
                // If tracking this exact order currently, update UI
                if (document.getElementById('display-order-id').textContent === orderId) {
                    updateTrackingUI(stage.status);
                }
            }
        }, stage.delay);
    });
}

function trackOrder() {
    const inputId = document.getElementById('order-id-input').value.trim().toUpperCase();
    const statusContainer = document.getElementById('tracking-status-container');
    const orderDisplay = document.getElementById('display-order-id');
    
    if (!inputId) return;

    if (orders[inputId]) {
        orderDisplay.textContent = inputId;
        statusContainer.classList.remove('hidden');
        updateTrackingUI(orders[inputId].status);
    } else {
        alert('Pedido não encontrado! Verifique o ID digitado.');
        statusContainer.classList.add('hidden');
    }
}

function updateTrackingUI(statusLevel) {
    const statusNames = ["", "Recebido", "Em preparo", "Pronto", "A caminho", "Entregue"];
    
    document.getElementById('current-status-badge').textContent = statusNames[statusLevel];
    
    // Reset all steps
    for (let i = 1; i <= 5; i++) {
        const step = document.getElementById(`step-${i}`);
        const conn = document.getElementById(`conn-${i}`);
        
        step.classList.remove('active', 'current');
        if (conn) conn.classList.remove('active');
        
        if (i <= statusLevel) {
            step.classList.add('active');
            if (i < statusLevel && conn) {
                conn.classList.add('active');
            }
        }
        
        if (i === statusLevel && i < 5) {
            step.classList.add('current'); // Pulse animation
        }
    }
}
