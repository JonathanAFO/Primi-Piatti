// Products Admin Page Logic
let currentCategoryFilter = 'all';
let currentProductSearch = '';
let editingProductId = null;

// Declare getProducts function
function getProducts() {
  // Placeholder implementation
  return [
    { id: 1, name: 'Product 1', category: 'carnes', price: 10.00, description: 'Description of Product 1', image: '', special: false, paused: false },
    { id: 2, name: 'Product 2', category: 'frango', price: 15.00, description: 'Description of Product 2', image: '', special: true, paused: true }
  ];
}

// Declare formatCurrency function
function formatCurrency(amount) {
  return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Declare updateProduct function
function updateProduct(productId, newData) {
  // Placeholder implementation
  console.log(`Updating product ${productId} with data:`, newData);
}

// Declare addProduct function
function addProduct(newProduct) {
  // Placeholder implementation
  console.log('Adding new product:', newProduct);
}

// Declare deleteProduct function
function deleteProduct(productId) {
  // Placeholder implementation
  console.log(`Deleting product ${productId}`);
}

document.addEventListener('DOMContentLoaded', function() {
  renderProductsAdmin();
});

function renderProductsAdmin() {
  let productsList = getProducts();
  
  // Apply category filter
  if (currentCategoryFilter !== 'all') {
    productsList = productsList.filter(p => p.category === currentCategoryFilter);
  }
  
  // Apply search
  if (currentProductSearch) {
    const term = currentProductSearch.toLowerCase();
    productsList = productsList.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.description?.toLowerCase().includes(term)
    );
  }
  
  const grid = document.getElementById('productsGrid');
  
  if (productsList.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--gray-400);">
        <p>Nenhum produto encontrado</p>
      </div>
    `;
    return;
  }
  
  grid.innerHTML = productsList.map(product => `
    <div class="product-admin-card ${product.paused ? 'product-paused' : ''}">
      <img src="${product.image || 'https://img.freepik.com/fotos-premium/a-autentica-marmita-brasileira-mais-conhecida-como-marmitex-feita-com-comida-tradicional-do-brasil_496782-2499.jpg?w=1480'}" 
           alt="${product.name}" 
           class="product-admin-image"
           onerror="this.src='https://i.pinimg.com/736x/27/23/ff/2723ff296e8a82e13c65753f9348b35b.jpg'">
      <div class="product-admin-content">
        <div class="product-admin-header">
          <span class="product-admin-name">
            ${product.name}
            ${product.paused ? '<span class="paused-badge">Pausado</span>' : ''}
          </span>
          <span class="product-admin-price">${formatCurrency(product.price)}</span>
        </div>
        <p class="product-admin-category">${getCategoryLabel(product.category)} ${product.special ? '| Especial' : ''}</p>
        <div class="product-admin-actions">
          <button class="btn-sm btn-edit" onclick="editProduct(${product.id})">Editar</button>
          ${product.paused 
            ? `<button class="btn-sm btn-activate" onclick="toggleProductPause(${product.id})">Ativar</button>`
            : `<button class="btn-sm btn-pause" onclick="toggleProductPause(${product.id})">Pausar</button>`
          }
          <button class="btn-sm btn-delete" onclick="confirmDeleteProduct(${product.id})">Excluir</button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterProducts(category, btn) {
  currentCategoryFilter = category;
  
  // Update active button
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  
  renderProductsAdmin();
}

function searchProducts(term) {
  currentProductSearch = term;
  renderProductsAdmin();
}

function getCategoryLabel(category) {
  const labels = {
    carnes: 'Carnes',
    frango: 'Frango',
    peixes: 'Peixes',
    vegetariano: 'Vegetariano'
  };
  return labels[category] || category;
}

function openProductModal(productId = null) {
  editingProductId = productId;
  
  // Reset form
  document.getElementById('productForm').reset();
  document.getElementById('productId').value = '';
  
  if (productId) {
    // Editing mode
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    
    if (product) {
      document.getElementById('productModalTitle').textContent = 'Editar Produto';
      document.getElementById('productId').value = product.id;
      document.getElementById('productName').value = product.name || '';
      document.getElementById('productDescription').value = product.description || '';
      document.getElementById('productPrice').value = product.price || '';
      document.getElementById('productOldPrice').value = product.oldPrice || '';
      document.getElementById('productCategory').value = product.category || '';
      document.getElementById('productImage').value = product.image || '';
      document.getElementById('productSpecial').checked = product.special || false;
    }
  } else {
    document.getElementById('productModalTitle').textContent = 'Novo Produto';
  }
  
  document.getElementById('productModal').classList.add('active');
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('active');
  editingProductId = null;
}

function editProduct(productId) {
  openProductModal(productId);
}

function saveProduct() {
  const name = document.getElementById('productName').value.trim();
  const description = document.getElementById('productDescription').value.trim();
  const price = parseFloat(document.getElementById('productPrice').value);
  const oldPrice = parseFloat(document.getElementById('productOldPrice').value) || null;
  const category = document.getElementById('productCategory').value;
  const image = document.getElementById('productImage').value.trim();
  const special = document.getElementById('productSpecial').checked;
  
  // Validation
  if (!name || !price || !category) {
    alert('Por favor, preencha os campos obrigatorios');
    return;
  }
  
  const productData = {
    name,
    description,
    price,
    oldPrice,
    category,
    image: image || 'https://placehold.co/400x300/f3f4f6/9ca3af?text=Sem+Imagem',
    special
  };
  
  if (editingProductId) {
    // Update existing product
    updateProduct(editingProductId, productData);
  } else {
    // Add new product
    addProduct(productData);
  }
  
  closeProductModal();
  renderProductsAdmin();
}

function toggleProductPause(productId) {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  
  if (product) {
    updateProduct(productId, { paused: !product.paused });
    renderProductsAdmin();
  }
}

function confirmDeleteProduct(productId) {
  if (confirm('Tem certeza que deseja excluir este produto?')) {
    deleteProduct(productId);
    renderProductsAdmin();
  }
}
