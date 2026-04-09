/* ================================================================
   SHOOTING MANAGER — Auth, Theme & Avatars
   Dépend de : config.js, ui.js
================================================================ */

// ── Theme ──
function applyTheme(light) {
  document.documentElement.setAttribute('data-theme', light ? 'light' : 'dark');
  const meta = document.getElementById('meta-theme');
  if (meta) meta.content = light ? '#f4f0ea' : '#070707';
  const toggle = document.getElementById('theme-toggle');
  if (toggle) toggle.checked = light;
  localStorage.setItem('sm_theme', light ? 'light' : 'dark');
}

// ── Google OAuth ──
function initGoogleAuth() {
  const tryInit = () => {
    if (!window.google?.accounts?.oauth2) { setTimeout(tryInit, 100); return; }
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CONFIG.CLIENT_ID,
      scope:     CONFIG.SCOPES,
      callback:  handleToken,
    });
  };
  tryInit();

  // Reprendre la session si token en cours de validité
  const saved  = sessionStorage.getItem('sm_token');
  const expiry = sessionStorage.getItem('sm_token_expiry');
  if (saved) {
    accessToken = saved;
    // On essaie même si le token est potentiellement expiré ;
    // driveReq() gère le 401 et redirige vers login.
    resumeSession();
  }
}

async function handleToken(resp) {
  if (resp.error) { toast('Erreur d\'authentification', 'error'); return; }
  accessToken = resp.access_token;
  sessionStorage.setItem('sm_token',        accessToken);
  sessionStorage.setItem('sm_token_expiry', Date.now() + (resp.expires_in || 3600) * 1000);
  await resumeSession();
}

async function resumeSession() {
  setLoading(true, 'Connexion en cours');
  try {
    const user = await fetchUserInfo();
    if (!user) throw new Error('userinfo failed');
    currentUser = user;
    setLoading(true, 'Chargement de vos shootings');
    await loadDBFromDrive();
    if (!db.rootFolderId) {
      setLoading(true, 'Création du dossier racine Drive');
      db.rootFolderId = await createFolder(CONFIG.ROOT_FOLDER_NAME);
      saveDB();
    }
    updateAllAvatars();
    showScreen('shootings');
    renderShootings();
    toast('Bonjour, ' + (user.given_name || user.name));
  } catch (e) {
    accessToken = null;
    sessionStorage.removeItem('sm_token');
    sessionStorage.removeItem('sm_token_expiry');
    toast('Session expirée', 'error');
  } finally {
    setLoading(false);
  }
}

async function fetchUserInfo() {
  const r = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return r.ok ? r.json() : null;
}

// ── Logout ──
function logout() {
  if (!confirm('Se déconnecter ?')) return;
  if (accessToken) {
    try { google.accounts.oauth2.revoke(accessToken); } catch (_) {}
  }
  accessToken   = null;
  currentUser   = null;
  dbFileId      = null;
  db            = { shootings: [], userProfile: {}, rootFolderId: null };
  sessionStorage.clear();
  closeSheet('profile');
  showScreen('login');
  toast('Déconnecté');
}

// ── Avatars ──
function getAvatarSrc()  { return db.userProfile?.customPhoto || currentUser?.picture || null; }
function getInitials()   { return (currentUser?.name || '').split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase() || '?'; }

function updateAllAvatars() {
  const src = getAvatarSrc();
  const ini = getInitials();

  const tbImg = document.getElementById('topbar-avatar-img');
  const tbIni = document.getElementById('topbar-avatar-initials');
  if (src) { tbImg.src = src; tbImg.style.display = 'block'; tbIni.style.display = 'none'; }
  else     { tbImg.style.display = 'none'; tbIni.style.display = 'block'; tbIni.textContent = ini; }

  const pImg = document.getElementById('profile-avatar-img');
  const pIni = document.getElementById('profile-initials');
  if (src) { pImg.src = src; pImg.style.display = 'block'; pIni.style.display = 'none'; }
  else     { pImg.style.display = 'none'; pIni.style.display = 'block'; pIni.textContent = ini; }

  document.getElementById('profile-name').textContent  = currentUser?.name  || '—';
  document.getElementById('profile-email').textContent = currentUser?.email || '—';
}
