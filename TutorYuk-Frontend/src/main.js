import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// ============================================
// TOAST NOTIFICATION & CONFIRM MODAL
// Pengganti alert() dan confirm() native browser
// ============================================

const injectStyles = () => {
  if (document.getElementById('toast-styles')) return
  const style = document.createElement('style')
  style.id = 'toast-styles'
  style.textContent = `
    @keyframes toastIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes toastOut { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(20px); } }
    @keyframes modalIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    @keyframes backdropIn { from { opacity: 0; } to { opacity: 1; } }
    #toast-container { position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; pointer-events: none; max-width: calc(100vw - 40px); }
    @media (max-width: 600px) { #toast-container { top: 12px; right: 12px; left: 12px; } }
  `
  document.head.appendChild(style)
}

// === TOAST (pengganti alert) ===
window.$toast = function (message, type) {
  injectStyles()
  if (!type) {
    if (/gagal|error|salah|silakan login|wajib/i.test(message)) type = 'error'
    else if (/berhasil|sukses|resmi/i.test(message)) type = 'success'
    else type = 'info'
  }
  const colors = {
    success: { border: '#1e40af', icon: '✓', iconBg: '#dbeafe' },
    error:   { border: '#ef4444', icon: '✕', iconBg: '#fee2e2' },
    info:    { border: '#64748b', icon: 'i', iconBg: '#f1f5f9' },
  }
  const c = colors[type] || colors.info
  let container = document.getElementById('toast-container')
  if (!container) {
    container = document.createElement('div')
    container.id = 'toast-container'
    document.body.appendChild(container)
  }
  const toast = document.createElement('div')
  toast.style.cssText = `background:white;border-left:4px solid ${c.border};border-radius:10px;padding:12px 16px;box-shadow:0 4px 12px rgba(0,0,0,0.08),0 2px 4px rgba(0,0,0,0.05);min-width:280px;max-width:400px;font-family:'Inter',sans-serif;font-size:14px;color:#0f172a;pointer-events:auto;animation:toastIn 0.3s ease;display:flex;align-items:flex-start;gap:10px;line-height:1.4;`
  toast.innerHTML = `<span style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:${c.iconBg};color:${c.border};font-weight:bold;font-size:13px;flex-shrink:0;margin-top:1px">${c.icon}</span><span style="flex:1">${message}</span>`
  container.appendChild(toast)
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards'
    setTimeout(() => toast.remove(), 300)
  }, 3500)
}

// === CONFIRM (pengganti confirm) - returns Promise<boolean> ===
window.$confirm = function (message, options) {
  injectStyles()
  options = options || {}
  const okLabel = options.okLabel || 'Ya'
  const cancelLabel = options.cancelLabel || 'Batal'
  const danger = options.danger !== false
  return new Promise((resolve) => {
    const backdrop = document.createElement('div')
    backdrop.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:10000;display:flex;align-items:center;justify-content:center;animation:backdropIn 0.2s ease;padding:20px;`
    const modal = document.createElement('div')
    modal.style.cssText = `background:white;border-radius:14px;padding:24px;max-width:380px;width:100%;box-shadow:0 20px 40px rgba(0,0,0,0.15);font-family:'Inter',sans-serif;animation:modalIn 0.2s ease;`
    const okColor = danger ? '#ef4444' : '#1e40af'
    const okHover = danger ? '#dc2626' : '#1e3a8a'
    modal.innerHTML = `<p style="margin:0 0 20px;color:#0f172a;font-size:15px;line-height:1.5">${message}</p><div style="display:flex;gap:8px;justify-content:flex-end"><button id="confirm-cancel" style="padding:9px 18px;border:1px solid #e2e8f0;background:white;color:#475569;font-weight:600;border-radius:8px;cursor:pointer;font-family:inherit;font-size:14px;">${cancelLabel}</button><button id="confirm-ok" style="padding:9px 18px;border:none;background:${okColor};color:white;font-weight:600;border-radius:8px;cursor:pointer;font-family:inherit;font-size:14px;">${okLabel}</button></div>`
    backdrop.appendChild(modal)
    document.body.appendChild(backdrop)
    const cleanup = (value) => { backdrop.remove(); resolve(value) }
    modal.querySelector('#confirm-ok').onclick = () => cleanup(true)
    modal.querySelector('#confirm-cancel').onclick = () => cleanup(false)
    backdrop.onclick = (e) => { if (e.target === backdrop) cleanup(false) }
    const okBtn = modal.querySelector('#confirm-ok')
    okBtn.onmouseenter = () => okBtn.style.background = okHover
    okBtn.onmouseleave = () => okBtn.style.background = okColor
    okBtn.focus()
  })
}

const app = createApp(App)
app.use(router)
app.mount('#app')
