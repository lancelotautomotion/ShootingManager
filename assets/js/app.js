/* ================================================================
   SHOOTING MANAGER — Point d'entrée & event listeners
   Dépend de : config.js, ui.js, auth.js, drive.js, db.js,
               shoots.js, brands.js, photos.js
================================================================ */

// ── Theme (appliqué aussi inline dans <head> pour éviter le FOUC) ──
(function initTheme() {
  const isLight = localStorage.getItem('sm_theme') === 'light';
  applyTheme(isLight);
  const toggle = document.getElementById('theme-toggle');
  if (toggle) toggle.addEventListener('change', () => applyTheme(toggle.checked));
}());

// ── Date input — placeholder fix ──
(function initDatePlaceholder() {
  const dateEl = document.getElementById('inp-shooting-date');
  const ph     = document.getElementById('date-placeholder');
  if (!dateEl || !ph) return;
  function syncPH() { ph.style.opacity = dateEl.value ? '0' : '1'; }
  dateEl.addEventListener('change', syncPH);
  dateEl.addEventListener('input',  syncPH);
  // Masque le texte natif webkit quand vide
  const style = document.createElement('style');
  style.textContent = '#inp-shooting-date:not([value])::-webkit-datetime-edit{color:transparent}'
    + '#inp-shooting-date[value=""]::-webkit-datetime-edit{color:transparent}';
  document.head.appendChild(style);
}());

// ── Sheet close on overlay click ──
['profile', 'shooting', 'brand'].forEach(n => {
  document.getElementById('overlay-' + n).addEventListener('click', () => closeSheet(n));
});

// ── Profile ──
document.getElementById('btn-open-profile').addEventListener('click', () => {
  document.getElementById('profile-sync-info').textContent = dbFileId
    ? 'Google Drive · appdata · synchronisé'
    : 'Google Drive · non synchronisé';
  openSheet('profile');
});
document.getElementById('btn-logout').addEventListener('click', logout);

// ── Avatar upload ──
document.getElementById('profile-avatar-wrap').addEventListener('click', () => {
  document.getElementById('upload-avatar').click();
});
document.getElementById('upload-avatar').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => {
      const c   = document.createElement('canvas');
      c.width   = c.height = 200;
      const min = Math.min(img.width, img.height);
      c.getContext('2d').drawImage(img, (img.width - min) / 2, (img.height - min) / 2, min, min, 0, 0, 200, 200);
      db.userProfile.customPhoto = c.toDataURL('image/jpeg', .82);
      saveDB();
      updateAllAvatars();
      toast('Photo de profil mise à jour');
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
  e.target.value = '';
});

// ── In-app Google login button ──
document.getElementById('btn-google-login').addEventListener('click', () => {
  if (!tokenClient) { toast('Configuration manquante', 'error'); return; }
  tokenClient.requestAccessToken({ prompt: 'consent' });
});

// ── New shooting ──
document.getElementById('btn-new-shooting').addEventListener('click', () => {
  ['inp-shooting-name', 'inp-shooting-notes'].forEach(id => document.getElementById(id).value = '');
  const dateEl = document.getElementById('inp-shooting-date');
  dateEl.value = '';
  document.getElementById('date-placeholder').style.opacity = '1';
  openSheet('shooting');
  setTimeout(() => document.getElementById('inp-shooting-name').focus(), 300);
});
document.getElementById('btn-create-shooting').addEventListener('click', async () => {
  const name = document.getElementById('inp-shooting-name').value.trim();
  if (!name) { toast('Nom requis', 'error'); return; }
  await createShooting(
    name,
    document.getElementById('inp-shooting-date').value,
    document.getElementById('inp-shooting-notes').value.trim()
  );
});
document.getElementById('inp-shooting-name').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('btn-create-shooting').click();
});

// ── Navigation ──
document.getElementById('btn-back-brands').addEventListener('click', () => showScreen('shootings'));
document.getElementById('btn-back-brand').addEventListener('click',  () => { showScreen('brands'); renderBrands(); });

// ── Filters ──
document.querySelectorAll('.filter-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    activeFilter = pill.dataset.filter;
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.toggle('active', p === pill));
    renderBrands();
  });
});

// ── New brand ──
document.getElementById('btn-new-brand').addEventListener('click', () => {
  ['inp-brand-name', 'inp-brand-rue', 'inp-brand-cp', 'inp-brand-ville'].forEach(id => document.getElementById(id).value = '');
  newBrandReturnType = null;
  document.querySelectorAll('.rt-btn').forEach(b => b.className = 'rt-btn');
  openSheet('brand');
  setTimeout(() => document.getElementById('inp-brand-name').focus(), 300);
});
document.querySelectorAll('.rt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    newBrandReturnType = btn.dataset.rt;
    document.querySelectorAll('.rt-btn').forEach(b => b.className = 'rt-btn' + (b === btn ? ` sel-${newBrandReturnType}` : ''));
  });
});
document.getElementById('btn-create-brand').addEventListener('click', async () => {
  const name = document.getElementById('inp-brand-name').value.trim();
  if (!name)              { toast('Nom requis', 'error');                       return; }
  if (!newBrandReturnType){ toast('Sélectionnez Coursier ou Drop', 'error');   return; }
  await createBrand(
    name, newBrandReturnType,
    document.getElementById('inp-brand-rue').value.trim(),
    document.getElementById('inp-brand-cp').value.trim(),
    document.getElementById('inp-brand-ville').value.trim()
  );
});

// ── Brand controls ──
['coursier', 'drop'].forEach(type => {
  document.getElementById('ctrl-' + type).addEventListener('click', () => {
    const b = findBrand(); if (!b) return;
    b.returnType = type; saveDB(); renderBrandDetail();
  });
});
document.getElementById('ctrl-recv').addEventListener('click', () => {
  const b = findBrand(); if (!b) return;
  b.packageReceived = !b.packageReceived;
  saveDB(); renderBrandDetail();
  toast(b.packageReceived ? 'Colis marqué comme reçu' : 'Marqué non reçu', b.packageReceived ? 'success' : '');
});

// ── Photo uploads ──
['ci', 'co', 'rp'].forEach(type => {
  document.getElementById('upload-' + type).addEventListener('change', async e => {
    await handleUpload(Array.from(e.target.files), type);
    e.target.value = '';
  });
});

// ── Brand note (debounced) ──
let noteTimer;
document.getElementById('brand-note').addEventListener('input', () => {
  const b = findBrand(); if (!b) return;
  b.note = document.getElementById('brand-note').value;
  clearTimeout(noteTimer);
  noteTimer = setTimeout(saveDB, 1200);
});

// ── Delete brand (depuis detail) ──
document.getElementById('btn-del-brand').addEventListener('click', async () => {
  const b = findBrand(); if (!b) return;
  if (!confirm(`Supprimer "${b.name}" ? Le dossier Drive sera également supprimé.`)) return;
  setLoading(true, 'Suppression en cours');
  await deleteBrand(currentShootingId, currentBrandId);
  setLoading(false);
  showScreen('brands');
  renderBrands();
  toast('Marque supprimée');
});

// ── Init ──
window.addEventListener('load', initGoogleAuth);
