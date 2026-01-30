// Products Database
const products = [
  {
    id: 1,
    name: "Bife a cebolado",
    description: "Bife bovino grelhado com cebolas caramelizadas",
    price: 18.99,
    oldPrice: 24.99,
    category: "carnes",
    special: true,
    image: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    name: "Frango grelhado",
    description: "Peito de frango grelhado com temperos especiais",
    price: 15.99,
    category: "frango",
    special: true,
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    name: "Picanha grelhada",
    description: "Picanha suculenta grelhada no ponto",
    price: 29.99,
    oldPrice: 35.99,
    category: "carnes",
    special: true,
    image: "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=400&h=300&fit=crop"
  },
  {
    id: 4,
    name: "Tilápia grelhada",
    description: "Filé de tilápia grelhado com ervas finas",
    price: 22.99,
    category: "peixes",
    special: true,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop"
  },
  {
    id: 5,
    name: "Contrafilé acebolado",
    description: "Contrafilé grelhado com cebolas",
    price: 19.99,
    category: "carnes",
    image: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400&h=300&fit=crop"
  },
  {
    id: 6,
    name: "Costela bovina",
    description: "Costela assada lentamente",
    price: 25.99,
    category: "carnes",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop"
  },
  {
    id: 7,
    name: "Strogonoff de carne",
    description: "Strogonoff cremoso de carne bovina",
    price: 17.99,
    category: "carnes",
    image: "https://images.unsplash.com/photo-1675937494385-9c2f60c5b2c7?w=400&h=300&fit=crop"
  },
  {
    id: 8,
    name: "Carne de panela",
    description: "Carne cozida com legumes",
    price: 16.99,
    category: "carnes",
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop"
  },
  {
    id: 9,
    name: "Frango à parmegiana",
    description: "Filé de frango empanado com molho e queijo",
    price: 18.99,
    category: "frango",
    image: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400&h=300&fit=crop"
  },
  {
    id: 10,
    name: "Strogonoff de frango",
    description: "Strogonoff cremoso de frango",
    price: 16.99,
    category: "frango",
    image: "https://images.unsplash.com/photo-1619221882220-947b3d3c8861?w=400&h=300&fit=crop"
  },
  {
    id: 11,
    name: "Frango xadrez",
    description: "Frango em cubos com legumes orientais",
    price: 17.99,
    category: "frango",
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop"
  },
  {
    id: 12,
    name: "Coxa de frango assada",
    description: "Coxa de frango temperada e assada",
    price: 14.99,
    category: "frango",
    image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop"
  },
  {
    id: 13,
    name: "Salmão grelhado",
    description: "Filé de salmão grelhado com limão",
    price: 34.99,
    category: "peixes",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop"
  },
  {
    id: 14,
    name: "Bacalhau ao forno",
    description: "Bacalhau assado com batatas",
    price: 39.99,
    category: "peixes",
    image: "https://images.unsplash.com/photo-1559742811-822873691df8?w=400&h=300&fit=crop"
  },
  {
    id: 15,
    name: "Camarão alho e óleo",
    description: "Camarões salteados no alho",
    price: 36.99,
    category: "peixes",
    image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=300&fit=crop"
  },
  {
    id: 16,
    name: "Legumes grelhados",
    description: "Mix de legumes da estação grelhados",
    price: 14.99,
    category: "vegetariano",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop"
  },
  {
    id: 17,
    name: "Berinjela à parmegiana",
    description: "Berinjela empanada com molho e queijo",
    price: 15.99,
    category: "vegetariano",
    image: "https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?w=400&h=300&fit=crop"
  },
  {
    id: 18,
    name: "Omelete de legumes",
    description: "Omelete recheado com legumes frescos",
    price: 13.99,
    category: "vegetariano",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop"
  }
];

// Garnish Options
const garnishes = [
  "Arroz",
  "Arroz Integral",
  "Feijão",
  "Feijão Tropeiro",
  "Purê",
  "Batata Frita",
  "Farofa",
  "Salada"
];

// Helper Functions
function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function generateOrderId() {
  return 'PP' + Date.now().toString(36).toUpperCase();
}

// Cart Management
function getCart() {
  const cart = localStorage.getItem('primipiatti_cart');
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem('primipiatti_cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countElements = document.querySelectorAll('#cartCount, .cart-count');
  countElements.forEach(el => {
    if (el) el.textContent = count;
  });
}

function clearCart() {
  localStorage.removeItem('primipiatti_cart');
  updateCartCount();
}

// Orders Management
function getOrders() {
  const orders = localStorage.getItem('primipiatti_orders');
  return orders ? JSON.parse(orders) : [];
}

function saveOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem('primipiatti_orders', JSON.stringify(orders));
}

function updateOrderStatus(orderId, status) {
  const orders = getOrders();
  const orderIndex = orders.findIndex(o => o.id === orderId);
  if (orderIndex !== -1) {
    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();
    localStorage.setItem('primipiatti_orders', JSON.stringify(orders));
  }
}

// Products Management (for admin)
function getProducts() {
  const stored = localStorage.getItem('primipiatti_products');
  if (stored) {
    return JSON.parse(stored);
  }
  return products;
}

function saveProducts(productsList) {
  localStorage.setItem('primipiatti_products', JSON.stringify(productsList));
}

function addProduct(product) {
  const productsList = getProducts();
  product.id = Date.now();
  productsList.push(product);
  saveProducts(productsList);
}

function updateProduct(productId, updates) {
  const productsList = getProducts();
  const index = productsList.findIndex(p => p.id === productId);
  if (index !== -1) {
    productsList[index] = { ...productsList[index], ...updates };
    saveProducts(productsList);
  }
}

function deleteProduct(productId) {
  const productsList = getProducts();
  const filtered = productsList.filter(p => p.id !== productId);
  saveProducts(filtered);
}
