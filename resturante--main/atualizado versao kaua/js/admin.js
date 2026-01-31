// Admin Common Functions

// Function to get orders (dummy implementation for illustration)
function getOrders() {
  return [
    { id: 1, customer: { name: 'John Doe' }, total: 100, status: 'pending', createdAt: '2023-10-01T10:00:00' },
    { id: 2, customer: { name: 'Jane Smith' }, total: 200, status: 'preparing', createdAt: '2023-10-02T11:00:00' },
    // Add more orders as needed
  ];
}

// Function to format currency (dummy implementation for illustration)
function formatCurrency(amount) {
  return `R$ ${amount.toFixed(2)}`;
}

// Toggle sidebar on mobile
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  
  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
}

// Close sidebar when clicking outside
document.addEventListener('click', function(e) {
  const sidebar = document.getElementById('sidebar');
  const menuBtn = document.querySelector('.mobile-menu-btn');
  
  if (sidebar && sidebar.classList.contains('open')) {
    if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
      toggleSidebar();
    }
  }
});

// Dashboard Stats
function updateDashboardStats() {
  const orders = getOrders();
  
  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const preparingOrders = orders.filter(o => o.status === 'preparing').length;
  
  const totalOrdersEl = document.getElementById('totalOrders');
  const totalSalesEl = document.getElementById('totalSales');
  const pendingOrdersEl = document.getElementById('pendingOrders');
  const preparingOrdersEl = document.getElementById('preparingOrders');
  
  if (totalOrdersEl) totalOrdersEl.textContent = totalOrders;
  if (totalSalesEl) totalSalesEl.textContent = formatCurrency(totalSales);
  if (pendingOrdersEl) pendingOrdersEl.textContent = pendingOrders;
  if (preparingOrdersEl) preparingOrdersEl.textContent = preparingOrders;
}

// Render recent orders on dashboard
function renderRecentOrders() {
  const orders = getOrders().slice(0, 5);
  const tbody = document.getElementById('recentOrdersBody');
  
  if (!tbody) return;
  
  if (orders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 40px; color: var(--gray-400);">
          Nenhum pedido ainda
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = orders.map(order => `
    <tr>
      <td><span class="order-id">#${order.id}</span></td>
      <td>${order.customer.name}</td>
      <td>${formatCurrency(order.total)}</td>
      <td><span class="status-badge status-${order.status}">${getStatusLabel(order.status)}</span></td>
      <td>${formatDate(order.createdAt)}</td>
    </tr>
  `).join('');
}

// Get status label in Portuguese
function getStatusLabel(status) {
  const labels = {
    pending: 'Pendente',
    preparing: 'Preparando',
    ready: 'Pronto',
    delivered: 'Entregue',
    cancelled: 'Cancelado'
  };
  return labels[status] || status;
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Simple chart
function renderChart() {
  const canvas = document.getElementById('chartCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const orders = getOrders();
  
  // Get last 7 days data
  const days = [];
  const values = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayStr = date.toLocaleDateString('pt-BR', { weekday: 'short' });
    days.push(dayStr);
    
    // Calculate sales for this day
    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));
    
    const daySales = orders
      .filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate >= dayStart && orderDate <= dayEnd;
      })
      .reduce((sum, o) => sum + o.total, 0);
    
    values.push(daySales);
  }
  
  // Clear canvas
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 200;
  
  ctx.clearRect(0, 0, width, height);
  
  // Draw chart
  const maxValue = Math.max(...values, 100);
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const barWidth = chartWidth / days.length - 10;
  
  // Draw bars
  values.forEach((value, i) => {
    const x = padding + i * (chartWidth / days.length) + 5;
    const barHeight = (value / maxValue) * chartHeight;
    const y = height - padding - barHeight;
    
    // Bar
    ctx.fillStyle = '#F5C518';
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barHeight, 4);
    ctx.fill();
    
    // Day label
    ctx.fillStyle = '#6b7280';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(days[i], x + barWidth / 2, height - 10);
    
    // Value label
    if (value > 0) {
      ctx.fillStyle = '#1f2937';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(formatCurrency(value).replace('R$', ''), x + barWidth / 2, y - 5);
    }
  });
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
  updateDashboardStats();
  renderRecentOrders();
  renderChart();
});
