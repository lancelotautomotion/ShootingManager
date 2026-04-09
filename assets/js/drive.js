/* ================================================================
   SHOOTING MANAGER — Google Drive API
   Dépend de : config.js, ui.js
================================================================ */

// ── Requête Drive authentifiée ──
async function driveReq(path, opts = {}) {
  const r = await fetch('https://www.googleapis.com/drive/v3' + path, {
    ...opts,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(opts.headers || {}),
    },
  });
  if (r.status === 401) {
    accessToken = null;
    sessionStorage.removeItem('sm_token');
    sessionStorage.removeItem('sm_token_expiry');
    showScreen('login');
    toast('Session expirée', 'error');
    throw new Error('401');
  }
  return r;
}

// ── Créer un dossier Drive ──
async function createFolder(name, parentId = null) {
  const meta = { name, mimeType: 'application/vnd.google-apps.folder' };
  if (parentId) meta.parents = [parentId];
  const r = await driveReq('/files?fields=id', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(meta),
  });
  return (await r.json()).id;
}

// ── Supprimer un fichier / dossier Drive ──
async function deleteDriveItem(fileId) {
  if (!fileId) return;
  try { await driveReq('/files/' + fileId, { method: 'DELETE' }); }
  catch (e) { console.warn('Drive delete failed', fileId, e); }
}

// ── Uploader une photo dans un dossier Drive ──
async function uploadPhoto(file, folderId) {
  const meta = { name: file.name, parents: [folderId] };
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(meta)], { type: 'application/json' }));
  form.append('file', file);
  const r = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,thumbnailLink',
    { method: 'POST', headers: { Authorization: `Bearer ${accessToken}` }, body: form }
  );
  return r.json();
}

// ── Générer un thumbnail local (300×300 JPEG) ──
function generateThumb(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const size = 300;
        const c = document.createElement('canvas');
        c.width = c.height = size;
        const min = Math.min(img.width, img.height);
        c.getContext('2d').drawImage(
          img,
          (img.width  - min) / 2, (img.height - min) / 2, min, min,
          0, 0, size, size
        );
        resolve(c.toDataURL('image/jpeg', 0.75));
      };
      img.onerror = () => resolve('');
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}
