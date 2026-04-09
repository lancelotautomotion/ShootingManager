/* ================================================================
   SHOOTING MANAGER — Base de données (Google Drive AppData)
   Dépend de : config.js, ui.js, drive.js
================================================================ */

// ── Charger la DB depuis Drive ──
async function loadDBFromDrive() {
  const r     = await driveReq(`/files?spaces=appDataFolder&q=name='${CONFIG.DB_FILENAME}'&fields=files(id,name)`);
  const files = (await r.json()).files || [];

  if (files.length) {
    dbFileId    = files[0].id;
    const content = await driveReq(`/files/${dbFileId}?alt=media`);
    try {
      const parsed = await content.json();
      db = parsed;
      if (!db.shootings)    db.shootings    = [];
      if (!db.userProfile)  db.userProfile  = {};
      if (!db.rootFolderId) db.rootFolderId = null;
    } catch {
      db = { shootings: [], userProfile: {}, rootFolderId: null };
    }
  } else {
    db       = { shootings: [], userProfile: {}, rootFolderId: null };
    dbFileId = await createDBFileOnDrive();
  }

  setSyncStatus('synced');
}

// ── Créer le fichier DB dans Drive AppData ──
async function createDBFileOnDrive() {
  const meta = { name: CONFIG.DB_FILENAME, parents: ['appDataFolder'] };
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(meta)], { type: 'application/json' }));
  form.append('file',     new Blob([JSON.stringify(db)],   { type: 'application/json' }));
  const r = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
    { method: 'POST', headers: { Authorization: `Bearer ${accessToken}` }, body: form }
  );
  return (await r.json()).id;
}

// ── Sauvegarder la DB dans Drive ──
async function saveDBToDrive() {
  if (!dbFileId) return;
  setSyncStatus('syncing');
  try {
    await fetch(`https://www.googleapis.com/upload/drive/v3/files/${dbFileId}?uploadType=media`, {
      method:  'PATCH',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify(db),
    });
    setSyncStatus('synced');
  } catch {
    setSyncStatus('error');
  }
}

// ── Debounced save (1.2s) ──
function saveDB() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveDBToDrive, 1200);
}
