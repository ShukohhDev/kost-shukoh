/**
 * UI Utilities & Design System Components
 */

export function formatRupiah(number) {
  if (number === null || number === undefined || isNaN(number)) return 'Rp 0';
  return 'Rp ' + Number(number).toLocaleString('id-ID');
}

export function formatTanggal(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const typeStyles = {
    success: 'bg-emerald-900/90 text-white border-emerald-700/50',
    danger: 'bg-rose-900/90 text-white border-rose-700/50',
    warning: 'bg-amber-900/90 text-white border-amber-700/50',
    info: 'bg-brand-900/90 text-white border-brand-700/50',
  };

  const icons = {
    success: `<svg class="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`,
    danger: `<svg class="w-5 h-5 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`,
    warning: `<svg class="w-5 h-5 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`,
    info: `<svg class="w-5 h-5 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
  };

  toast.className = `pointer-events-auto flex items-center gap-3 p-4 rounded-xl shadow-modal backdrop-blur-md border text-sm font-medium transition-all duration-300 transform translate-y-3 opacity-0 ${typeStyles[type] || typeStyles.info}`;
  toast.innerHTML = `
    ${icons[type] || icons.info}
    <div class="flex-1">${message}</div>
  `;

  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-3', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });

  // Auto remove after 3.5s
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-3');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

export function showConfirmModal({ title, message, confirmText = 'Ya, Lanjutkan', confirmClass = 'btn-primary', onConfirm }) {
  const modalId = 'confirm-modal-wrapper';
  let modal = document.getElementById(modalId);
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = modalId;
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-modal border border-slate-200 transform transition-all">
      <h3 class="text-lg font-bold text-slate-900 mb-2">${title}</h3>
      <p class="text-sm text-slate-600 mb-6 leading-relaxed">${message}</p>
      <div class="flex items-center justify-end gap-3">
        <button id="modal-cancel-btn" class="btn-secondary px-4 py-2">Batal</button>
        <button id="modal-confirm-btn" class="${confirmClass} px-4 py-2">${confirmText}</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const close = () => modal.remove();
  modal.querySelector('#modal-cancel-btn').onclick = close;
  modal.querySelector('#modal-confirm-btn').onclick = () => {
    close();
    if (onConfirm) onConfirm();
  };
}

export function getStatusBadge(status, type = 'room') {
  const map = {
    // Rooms
    AVAILABLE: '<span class="badge-success"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Tersedia</span>',
    OCCUPIED: '<span class="badge-info"><span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>Terisi</span>',
    BOOKED: '<span class="badge-warning"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Dipesan</span>',
    MAINTENANCE: '<span class="badge-danger"><span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>Perbaikan</span>',
    INACTIVE: '<span class="badge-neutral">Nonaktif</span>',
    
    // Bookings
    PENDING: '<span class="badge-warning"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Menunggu Review</span>',
    APPROVED: '<span class="badge-info">Disetujui</span>',
    AWAITING_DP: '<span class="badge-warning">Menunggu DP</span>',
    CONFIRMED: '<span class="badge-success"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Terkonfirmasi</span>',
    REJECTED: '<span class="badge-danger">Ditolak</span>',
    CANCELLED: '<span class="badge-neutral">Dibatalkan</span>',
    CONVERTED: '<span class="badge-success">Sudah Check-In</span>',

    // Bills
    UNPAID: '<span class="badge-danger"><span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>Belum Dibayar</span>',
    PARTIAL: '<span class="badge-warning">Dibayar Sebagian</span>',
    PAID: '<span class="badge-success"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Lunas</span>',

    // Payments
    VERIFIED: '<span class="badge-success">Terverifikasi</span>',

    // Complaints
    NEW: '<span class="badge-info">Tiket Baru</span>',
    IN_PROGRESS: '<span class="badge-warning"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Sedang Dikerjakan</span>',
    RESOLVED: '<span class="badge-success"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Selesai</span>',
  };

  return map[status] || `<span class="badge-neutral">${status}</span>`;
}
