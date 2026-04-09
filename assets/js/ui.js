/* ================================================================
   SHOOTING MANAGER — UI Utilities
   Toast, loader, screens, sheets, sync status.
================================================================ */

const DESKTOP_BP = 1000;
function isDesktop() { return window.innerWidth >= DESKTOP_BP; }

// ── Screens ──
function showScreen(id) {
  if (isDesktop()) {
    const isLogin = id === 'login';
    document.getElementById('screen-login').classList.toggle('active', isLogin);
    document.getElementById('screen-brands').classList.toggle('active', !isLogin && id === 'brands');
    document.getElementById('screen-brand').classList.toggle('active',  !isLogin && id === 'brand');
    const rw = document.getElementById('desktop-right-welcome');
    if (rw) rw.classList.toggle('hidden', isLogin || id === 'brands' || id === 'brand');
  } else {
    ['login', 'shootings', 'brands', 'brand'].forEach(s =>
      document.getElementById('screen-' + s).classList.toggle('active', s === id)
    );
  }
}

// ── Toast ──
let _toastTimer;
function toast(msg, type = '') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'show' + (type ? ' ' + type : '');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { el.className = ''; }, 3200);
}

// ── Loader ──
function setLoading(show, msg = '') {
  document.getElementById('loader').classList.toggle('show', show);
  if (msg) document.getElementById('loader-text').textContent = msg;
}

// ── Sheets ──
function openSheet(n) {
  document.getElementById('overlay-' + n).classList.add('open');
  document.getElementById('sheet-' + n).classList.add('open');
}
function closeSheet(n) {
  document.getElementById('overlay-' + n).classList.remove('open');
  document.getElementById('sheet-' + n).classList.remove('open');
}

// ── Sync badge ──
function setSyncStatus(state) {
  const dot = document.getElementById('sync-dot');
  const lbl = document.getElementById('sync-label');
  dot.className = 'sync-dot' + (state === 'syncing' ? ' syncing' : '');
  if (state === 'syncing')    { lbl.textContent = 'Sync';       dot.style.background = ''; }
  else if (state === 'error') { lbl.textContent = 'Hors ligne'; dot.style.background = 'var(--red)'; }
  else                        { lbl.textContent = 'Drive';      dot.style.background = ''; }
}
