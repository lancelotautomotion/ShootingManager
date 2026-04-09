/* ================================================================
   SHOOTING MANAGER — Config & State partagé
   Chargé en premier. Définit les constantes et l'état mutable
   accessible par tous les modules suivants (scope global).
================================================================ */

const CONFIG = {
  CLIENT_ID:        '244908797063-fkd3v7nehp6kcmojvtsqdm189cthhauu.apps.googleusercontent.com',
  SCOPES:           'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata openid profile email',
  DB_FILENAME:      'shooting_manager_db.json',
  ROOT_FOLDER_NAME: 'Shooting Manager',
};

// ── État mutable partagé ──
let tokenClient       = null;
let accessToken       = null;
let currentUser       = null;
let db                = { shootings: [], userProfile: {}, rootFolderId: null };
let dbFileId          = null;
let currentShootingId = null;
let currentBrandId    = null;
let activeFilter      = 'all';
let newBrandReturnType = null;
let saveTimer         = null;

// ── Utilitaires purs (sans dépendances) ──

/** Génère un ID unique court */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/** Échappe les caractères HTML pour prévenir les injections XSS */
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

/** Formate une date ISO (YYYY-MM-DD) en français lisible */
function fmtDate(d) {
  if (!d) return '';
  try {
    return new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch { return d; }
}

/** Retourne l'URL Google Drive d'un dossier */
function driveUrl(id) {
  return `https://drive.google.com/drive/folders/${id}`;
}

/** Retourne la marque courante depuis la DB */
function findBrand() {
  const s = db.shootings.find(x => x.id === currentShootingId);
  return s?.brands.find(b => b.id === currentBrandId);
}
