// Store Page Logic
let selectedProduct = null;
let selectedGarnish = null;
let quantity = 1;
let cutleryQty = 1;
let currentCategory = 'all';

// Declare variables
const updateCartCount = () => {
  const cart = getCart();
  document.getElementById('cartCount').textContent = cart.length;
};

const getProducts = () => {
  return [
    { id: 1, name: 'Product 1', image: 'image1.jpg', price: 10.00, category: 'carnes', special: false, paused: false },
    { id: 2, name: 'Product 2', image: 'image2.jpg', price: 15.00, category: 'frango', special: true, paused: false },
    // Add more products here
  ];
};

const formatCurrency = (value) => {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
};

const garnishes = ['Garnish 1', 'Garnish 2', 'Garnish 3']; // Add more garnishes here

const getCart = () => {
  return JSON.parse(localStorage.getItem('cart')) || [];
};

const saveCart = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  renderProducts();
  updateCartCount();
  setupCategoryFilters();
});

// Render products
function renderProducts() {
  const productsList = getProducts();
  
  // Special products
  const specialsGrid = document.getElementById('specialsGrid');
  if (specialsGrid) {
    const specials = productsList.filter(p => p.special && !p.paused);
    specialsGrid.innerHTML = specials.map(p => createProductCard(p)).join('');
    specialsGrid.closest('.products-section').style.display = specials.length ? 'block' : 'none';
  }
  
  // Category grids
  const categories = ['carnes', 'frango', 'peixes', 'vegetariano'];
  categories.forEach(cat => {
    const grid = document.getElementById(cat + 'Grid');
    if (grid) {
      const catProducts = productsList.filter(p => p.category === cat && !p.paused);
      grid.innerHTML = catProducts.map(p => createProductCard(p)).join('');
      grid.closest('.products-section').style.display = catProducts.length ? 'block' : 'none';
    }
  });
  
  filterByCategory(currentCategory);
}

// Create product card HTML
function createProductCard(product) {
  return `
    <div class="product-card" onclick="openProductModal(${product.id})">
      <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://placehold.co/400x300/f3f4f6/9ca3af?text=Sem+Imagem'">
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <div>
          <span class="product-price">${formatCurrency(product.price)}</span>
          ${product.oldPrice ? `<span class="product-price-old">${formatCurrency(product.oldPrice)}</span>` : ''}
        </div>
      </div>
    </div>
  `;
}

// Setup category filters
function setupCategoryFilters() {
  const categoryBtns = document.querySelectorAll('.category-btn');
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      categoryBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentCategory = this.dataset.category;
      filterByCategory(currentCategory);
    });
  });
}

// Filter products by category
function filterByCategory(category) {
  const sections = document.querySelectorAll('.products-section');
  
  if (category === 'all') {
    sections.forEach(section => {
      const grid = section.querySelector('.products-grid');
      if (grid && grid.children.length > 0) {
        section.style.display = 'block';
      }
    });
  } else {
    sections.forEach(section => {
      const title = section.querySelector('.section-title').textContent.toLowerCase();
      const isSpecial = title.includes('especiais');
      const isMatch = title.includes(category) || 
                      (category === 'vegetariano' && title.includes('vegetariano'));
      
      if (isMatch) {
        section.style.display = 'block';
      } else if (isSpecial) {
        // Show specials that match the category
        const productsList = getProducts();
        const specialsInCat = productsList.filter(p => p.special && p.category === category && !p.paused);
        const grid = section.querySelector('.products-grid');
        if (grid) {
          grid.innerHTML = specialsInCat.map(p => createProductCard(p)).join('');
          section.style.display = specialsInCat.length ? 'block' : 'none';
        }
      } else {
        section.style.display = 'none';
      }
    });
  }
}

// Open product modal
function openProductModal(productId) {
  const productsList = getProducts();
  selectedProduct = productsList.find(p => p.id === productId);
  if (!selectedProduct) return;
  
  // Reset state
  selectedGarnish = null;
  quantity = 1;
  cutleryQty = 1;
  
  // Update modal content
  document.getElementById('modalTitle').textContent = selectedProduct.name;
  document.getElementById('modalDescription').textContent = selectedProduct.description || 'Personalize seu pedido escolhendo as guarnições';
  document.getElementById('modalImage').style.backgroundImage = `url(${selectedProduct.image})`;
  document.getElementById('quantity').textContent = quantity;
  document.getElementById('cutleryQty').textContent = cutleryQty;
  document.getElementById('observations').value = '';
  document.getElementById('needsCutlery').checked = false;
  document.getElementById('cutleryQtyContainer').style.display = 'none';
  
  // Render garnish options
  const garnishContainer = document.getElementById('garnishOptions');
  garnishContainer.innerHTML = garnishes.map(g => `
    <button class="garnish-btn" onclick="selectGarnish('${g}', this)">${g}</button>
  `).join('');
  
  updateTotalPrice();
  updateAddButton();
  
  // Show modal
  document.getElementById('productModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
  document.getElementById('productModal').classList.remove('active');
  document.body.style.overflow = '';
  selectedProduct = null;
}

// Select garnish
function selectGarnish(garnish, button) {
  document.querySelectorAll('.garnish-btn').forEach(b => b.classList.remove('selected'));
  button.classList.add('selected');
  selectedGarnish = garnish;
  updateAddButton();
}

// Change quantity
function changeQuantity(delta) {
  quantity = Math.max(1, quantity + delta);
  document.getElementById('quantity').textContent = quantity;
  updateTotalPrice();
}

// Toggle cutlery quantity
function toggleCutleryQty() {
  const checked = document.getElementById('needsCutlery').checked;
  document.getElementById('cutleryQtyContainer').style.display = checked ? 'flex' : 'none';
}

// Change cutlery quantity
function changeCutleryQty(delta) {
  cutleryQty = Math.max(1, cutleryQty + delta);
  document.getElementById('cutleryQty').textContent = cutleryQty;
}

// Update total price
function updateTotalPrice() {
  if (!selectedProduct) return;
  const total = selectedProduct.price * quantity;
  document.getElementById('totalPrice').textContent = total.toFixed(2).replace('.', ',');
}

// Update add button state
function updateAddButton() {
  const btn = document.getElementById('addToCartBtn');
  btn.disabled = !selectedGarnish;
}

// Add to cart
function addToCart() {
  if (!selectedProduct || !selectedGarnish) return;
  
  const cart = getCart();
  const observations = document.getElementById('observations').value;
  const needsCutlery = document.getElementById('needsCutlery').checked;
  
  const cartItem = {
    id: Date.now(),
    productId: selectedProduct.id,
    name: selectedProduct.name,
    image: selectedProduct.image,
    price: selectedProduct.price,
    garnish: selectedGarnish,
    quantity: quantity,
    observations: observations,
    cutlery: needsCutlery ? cutleryQty : 0
  };
  
  cart.push(cartItem);
  saveCart(cart);
  closeModal();
  
  // Show feedback
  showToast('Produto adicionado ao carrinho!');
}

// Show toast notification
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: #1a1a1a;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    z-index: 2000;
    animation: fadeInUp 0.3s ease;
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// Navigate to cart
function goToCart() {
  window.location.href = 'cart.html';
}

// Add CSS for toast animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translate(-50%, 20px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;
document.head.appendChild(style);
