// OntoZ root source module.

const toast = document.querySelector('#toast');
let toastTimer = 0;

function refreshIcons() {
  if (!window.lucide?.createIcons) return;
  window.lucide.createIcons({
    attrs: {
      'aria-hidden': 'true',
      focusable: 'false',
      'stroke-width': 1.5
    }
  });
}

function showToast(message, duration = 2200) {
  window.clearTimeout(toastTimer);
  toast.querySelector('span').textContent = message;
  toast.classList.add('show');
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), duration);
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function renderIcon(name) {
  return `<i data-lucide="${escapeHTML(name)}"></i>`;
}
