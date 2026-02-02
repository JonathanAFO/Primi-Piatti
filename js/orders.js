// Orders Page Logic
let currentStatusFilter = 'all';
let currentSearchTerm = '';
let currentOrder = null;

function getOrders() {
  // Dummy implementation for demonstration purposes
  return [
    { id: '1', customer: { name: 'John Doe', phone: '123456789' }, items: [{ name: 'Item 1', quantity: 2 }], total: 100, status: 'pending', createdAt: new Date(), delivery: { method: 'delivery', address: { street: 'Rua A', number: '100', neighborhood: 'Bairro B' } }, payment: { method: 'pix', change: 50 }, subtotal: 90, deliveryFee: 10 }
  ];
}

function formatCurrency(amount) {
  return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(date) {
  return date.toLocaleDateString('pt-BR');
}

function updateOrderStatus(orderId, status) {
  // Dummy implementation for demonstration purposes
  console.log(`Order ${orderId} status updated to ${status}`);
}

document.addEventListener('DOMContentLoaded', function() {
  renderOrders();
});

function renderOrders() {
  let orders = getOrders();
  
  // Apply status filter
  if (currentStatusFilter !== 'all') {
    orders = orders.filter(o => o.status === currentStatusFilter);
  }
  
  // Apply search
  if (currentSearchTerm) {
    const term = currentSearchTerm.toLowerCase();
    orders = orders.filter(o => 
      o.id.toLowerCase().includes(term) || 
      o.customer.name.toLowerCase().includes(term)
    );
  }
  
  const tbody = document.getElementById('ordersTableBody');
  
  if (orders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 40px; color: var(--gray-400);">
          Nenhum pedido encontrado
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = orders.map(order => `
    <tr>
      <td><span class="order-id">#${order.id}</span></td>
      <td>
        <div>${order.customer.name}</div>
        <div style="font-size: 12px; color: var(--gray-500);">${order.customer.phone}</div>
      </td>
      <td>${order.items.length} item(s)</td>
      <td>${formatCurrency(order.total)}</td>
      <td>
        <select class="status-select" style="width: auto; padding: 4px 8px;" onchange="changeOrderStatus('${order.id}', this.value)">
          <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pendente</option>
          <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>Preparando</option>
          <option value="ready" ${order.status === 'ready' ? 'selected' : ''}>Pronto</option>
          <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Entregue</option>
          <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelado</option>
        </select>
      </td>
      <td>${formatDate(order.createdAt)}</td>
      <td>
        <div class="actions-cell">
          <button class="action-btn" onclick="viewOrder('${order.id}')" title="Ver detalhes">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
          <button class="action-btn" onclick="viewOrder('${order.id}'); setTimeout(printOrder, 100);" title="Imprimir comanda">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function filterOrders(status, btn) {
  currentStatusFilter = status;
  
  // Update active button
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  
  renderOrders();
}

function searchOrders(term) {
  currentSearchTerm = term;
  renderOrders();
}

function changeOrderStatus(orderId, status) {
  updateOrderStatus(orderId, status);
  renderOrders();
}

function viewOrder(orderId) {
  const orders = getOrders();
  currentOrder = orders.find(o => o.id === orderId);
  
  if (!currentOrder) return;
  
  const modalBody = document.getElementById('orderModalBody');
  
  modalBody.innerHTML = `
    <div class="order-detail-row">
      <span class="order-detail-label">Pedido</span>
      <span class="order-detail-value">#${currentOrder.id}</span>
    </div>
    <div class="order-detail-row">
      <span class="order-detail-label">Cliente</span>
      <span class="order-detail-value">${currentOrder.customer.name}</span>
    </div>
    <div class="order-detail-row">
      <span class="order-detail-label">Telefone</span>
      <span class="order-detail-value">${currentOrder.customer.phone}</span>
    </div>
    <div class="order-detail-row">
      <span class="order-detail-label">Entrega</span>
      <span class="order-detail-value">${currentOrder.delivery.method === 'delivery' ? 'Entrega' : 'Retirada'}</span>
    </div>
    ${currentOrder.delivery.address ? `
    <div class="order-detail-row">
      <span class="order-detail-label">Endereco</span>
      <span class="order-detail-value">
        ${currentOrder.delivery.address.street}, ${currentOrder.delivery.address.number}
        ${currentOrder.delivery.address.complement ? ` - ${currentOrder.delivery.address.complement}` : ''}
        <br>${currentOrder.delivery.address.neighborhood}
      </span>
    </div>
    ` : ''}
    <div class="order-detail-row">
      <span class="order-detail-label">Pagamento</span>
      <span class="order-detail-value">${getPaymentLabel(currentOrder.payment.method)}</span>
    </div>
    ${currentOrder.payment.change ? `
    <div class="order-detail-row">
      <span class="order-detail-label">Troco para</span>
      <span class="order-detail-value">${currentOrder.payment.change}</span>
    </div>
    ` : ''}
    
    <h3 style="margin: 20px 0 12px; font-size: 14px; font-weight: 600;">Itens do Pedido</h3>
    <div class="order-items-list">
      ${currentOrder.items.map(item => `
        <div class="order-item-row">
          <span>
            <strong>${item.quantity}x</strong> ${item.name}
            <br><small style="color: var(--gray-500);">Guarnicao: ${item.garnish}</small>
            ${item.observations ? `<br><small style="color: var(--gray-500);">Obs: ${item.observations}</small>` : ''}
            ${item.cutlery > 0 ? `<br><small style="color: var(--gray-500);">Talheres: ${item.cutlery}</small>` : ''}
          </span>
          <span>${formatCurrency(item.price * item.quantity)}</span>
        </div>
      `).join('')}
    </div>
    
    <div class="order-detail-row">
      <span class="order-detail-label">Subtotal</span>
      <span class="order-detail-value">${formatCurrency(currentOrder.subtotal)}</span>
    </div>
    <div class="order-detail-row">
      <span class="order-detail-label">Taxa de entrega</span>
      <span class="order-detail-value">${currentOrder.deliveryFee > 0 ? formatCurrency(currentOrder.deliveryFee) : 'Gratis'}</span>
    </div>
    <div class="order-detail-row" style="font-weight: 700;">
      <span>Total</span>
      <span>${formatCurrency(currentOrder.total)}</span>
    </div>
    
    <div class="no-print">
      <label class="form-label" style="margin-top: 20px;">Alterar Status</label>
      <select class="status-select" id="modalStatusSelect" onchange="changeOrderStatus('${currentOrder.id}', this.value)">
        <option value="pending" ${currentOrder.status === 'pending' ? 'selected' : ''}>Pendente</option>
        <option value="preparing" ${currentOrder.status === 'preparing' ? 'selected' : ''}>Preparando</option>
        <option value="ready" ${currentOrder.status === 'ready' ? 'selected' : ''}>Pronto</option>
        <option value="delivered" ${currentOrder.status === 'delivered' ? 'selected' : ''}>Entregue</option>
        <option value="cancelled" ${currentOrder.status === 'cancelled' ? 'selected' : ''}>Cancelado</option>
      </select>
    </div>
  `;
  
  document.getElementById('orderModal').classList.add('active');
}

function closeOrderModal() {
  document.getElementById('orderModal').classList.remove('active');
  currentOrder = null;
}

function printOrder() {
  window.print();
}

function getPaymentLabel(method) {
  const labels = {
    pix: 'PIX',
    credit: 'Cartao de Credito',
    debit: 'Cartao de Debito',
    cash: 'Dinheiro',
    voucher: 'Vale Refeicao'
  };
  return labels[method] || method;
}
