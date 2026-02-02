// Checkout Page Logic
let deliveryMethod = 'delivery';
let paymentMethod = 'pix';

function getCart() {
  // Placeholder for getCart function implementation
  return [];
}

function formatCurrency(amount) {
  // Placeholder for formatCurrency function implementation
  return amount.toFixed(2);
}

function generateOrderId() {
  // Placeholder for generateOrderId function implementation
  return '12345';
}

function saveOrder(order) {
  // Placeholder for saveOrder function implementation
  console.log(order);
}

function clearCart() {
  // Placeholder for clearCart function implementation
  console.log('Cart cleared');
}

document.addEventListener('DOMContentLoaded', function() {
  const cart = getCart();
  
  if (cart.length === 0) {
    window.location.href = 'cart.html';
    return;
  }
  
  renderOrderSummary();
  setupPhoneMask();
  setupCepMask();
});

function renderOrderSummary() {
  const cart = getCart();
  const itemsContainer = document.getElementById('orderItems');
  
  itemsContainer.innerHTML = cart.map(item => `
    <div class="order-item">
      <div class="order-item-info">
        <span class="order-item-qty">${item.quantity}x</span>
        <div>
          <span class="order-item-name">${item.name}</span>
          <p class="order-item-garnish">Guarnição: ${item.garnish}</p>
        </div>
      </div>
      <span class="order-item-price">${formatCurrency(item.price * item.quantity)}</span>
    </div>
  `).join('');
  
  updateTotals();
}

function updateTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = deliveryMethod === 'delivery' ? 5.00 : 0;
  const total = subtotal + deliveryFee;
  
  document.getElementById('subtotal').textContent = formatCurrency(subtotal);
  document.getElementById('deliveryFee').textContent = deliveryFee > 0 ? formatCurrency(deliveryFee) : 'Grátis';
  document.getElementById('total').textContent = formatCurrency(total);
}

function selectDelivery(method) {
  deliveryMethod = method;
  
  // Update radio options UI
  document.querySelectorAll('#deliveryOptions .radio-option').forEach(opt => {
    opt.classList.remove('selected');
    if (opt.querySelector('input').value === method) {
      opt.classList.add('selected');
      opt.querySelector('input').checked = true;
    }
  });
  
  // Show/hide address section
  document.getElementById('addressSection').style.display = method === 'delivery' ? 'block' : 'none';
  
  updateTotals();
}

function selectPayment(method) {
  paymentMethod = method;
  
  // Update radio options UI
  document.querySelectorAll('#paymentOptions .radio-option').forEach(opt => {
    opt.classList.remove('selected');
    if (opt.querySelector('input').value === method) {
      opt.classList.add('selected');
      opt.querySelector('input').checked = true;
    }
  });
  
  // Show/hide change section for cash
  document.getElementById('changeSection').style.display = method === 'cash' ? 'block' : 'none';
}

function setupPhoneMask() {
  const phoneInput = document.getElementById('customerPhone');
  phoneInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 6) {
      value = `(${value.slice(0,2)}) ${value.slice(2,7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0,2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    
    e.target.value = value;
  });
}

function setupCepMask() {
  const cepInput = document.getElementById('cep');
  cepInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    
    if (value.length > 5) {
      value = `${value.slice(0,5)}-${value.slice(5)}`;
    }
    
    e.target.value = value;
  });
}

function validateForm() {
  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  
  if (!name) {
    alert('Por favor, informe seu nome');
    return false;
  }
  
  if (!phone || phone.length < 14) {
    alert('Por favor, informe um telefone válido');
    return false;
  }
  
  if (deliveryMethod === 'delivery') {
    const street = document.getElementById('street').value.trim();
    const number = document.getElementById('number').value.trim();
    const neighborhood = document.getElementById('neighborhood').value.trim();
    
    if (!street || !number || !neighborhood) {
      alert('Por favor, preencha o endereço completo');
      return false;
    }
  }
  
  return true;
}

function placeOrder() {
  if (!validateForm()) return;
  
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = deliveryMethod === 'delivery' ? 5.00 : 0;
  const total = subtotal + deliveryFee;
  
  const order = {
    id: generateOrderId(),
    customer: {
      name: document.getElementById('customerName').value.trim(),
      phone: document.getElementById('customerPhone').value.trim()
    },
    delivery: {
      method: deliveryMethod,
      address: deliveryMethod === 'delivery' ? {
        cep: document.getElementById('cep').value.trim(),
        street: document.getElementById('street').value.trim(),
        number: document.getElementById('number').value.trim(),
        complement: document.getElementById('complement').value.trim(),
        neighborhood: document.getElementById('neighborhood').value.trim()
      } : null
    },
    payment: {
      method: paymentMethod,
      change: paymentMethod === 'cash' ? document.getElementById('changeAmount').value.trim() : null
    },
    items: cart,
    subtotal: subtotal,
    deliveryFee: deliveryFee,
    total: total,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  // Save order
  saveOrder(order);
  
  // Clear cart
  clearCart();
  
  // Redirect to success page
  window.location.href = `success.html?order=${order.id}`;
}
