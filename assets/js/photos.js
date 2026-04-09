/* ================================================================
   SHOOTING MANAGER — Photos & Brand detail
   Dépend de : config.js, ui.js, drive.js, db.js
================================================================ */

// ── Upload de photos ──
async function handleUpload(files, type) {
  if (!files.length) return;
  const shooting = db.shootings.find(s => s.id === currentShootingId);
  const brand    = shooting?.brands.find(b => b.id === currentBrandId);
  if (!brand) return;

  let folderId;
  if (type === 'rp') {
    if (!brand.returnProofFolderId) {
      setLoading(true, 'Création du dossier Drive');
      brand.returnProofFolderId = await createFolder('Preuve de retour', brand.brandFolderId);
      saveDB();
    }
    folderId = brand.returnProofFolderId;
  } else {
    folderId = type === 'ci' ? brand.checkInFolderId : brand.checkOutFolderId;
  }

  const photosKey = type === 'ci' ? 'checkInPhotos' : (type === 'co' ? 'checkOutPhotos' : 'returnProofPhotos');
  setLoading(true, `Upload 0 / ${files.length}`);
  let done = 0;

  for (const f of files) {
    try {
      document.getElementById('loader-text').textContent = `Upload ${++done} / ${files.length}`;
      const [res, thumb] = await Promise.all([uploadPhoto(f, folderId), generateThumb(f)]);
      brand[photosKey].push({ driveId: res.id, name: res.name, thumb, webViewLink: res.webViewLink || null });
    } catch {
      toast('Erreur upload : ' + f.name, 'error');
    }
  }

  saveDB();
  setLoading(false);
  renderBrandDetail();
  toast(done + ' photo' + (done > 1 ? 's' : '') + ' uploadée' + (done > 1 ? 's' : ''), 'success');
}

// ── Supprimer une photo ──
async function deletePhoto(type, idx) {
  const b   = findBrand();
  if (!b) return;
  const key = type === 'ci' ? 'checkInPhotos' : (type === 'co' ? 'checkOutPhotos' : 'returnProofPhotos');
  const photo = b[key][idx];
  if (photo?.driveId) deleteDriveItem(photo.driveId);
  b[key].splice(idx, 1);
  saveDB();
  renderBrandDetail();
  toast('Photo supprimée');
}

// ── Render détail d'une marque ──
function renderBrandDetail() {
  const shooting = db.shootings.find(s => s.id === currentShootingId);
  const brand    = shooting?.brands.find(b => b.id === currentBrandId);
  if (!brand) return;

  // Topbar — textContent = safe
  document.getElementById('brand-detail-topbar').textContent = brand.name;

  // Contrôles
  document.getElementById('ctrl-coursier').className = 'ctrl-btn' + (brand.returnType === 'coursier' ? ' on-coursier' : '');
  document.getElementById('ctrl-drop').className     = 'ctrl-btn' + (brand.returnType === 'drop'     ? ' on-drop'     : '');
  const cr = document.getElementById('ctrl-recv');
  cr.className  = 'ctrl-btn' + (brand.packageReceived ? ' on-recv' : '');
  cr.textContent = brand.packageReceived ? 'Colis reçu' : 'Colis reçu ?';

  // Adresse
  if (brand.rue || brand.cp || brand.ville) {
    const l1 = document.getElementById('addr-line1');
    const l2 = document.getElementById('addr-line2');
    l1.textContent = brand.rue || '';
    l1.className   = 'address-line' + (brand.rue ? '' : ' empty');
    l2.textContent = [brand.cp, brand.ville].filter(Boolean).join(' ');
    l2.className   = 'address-line' + (brand.cp || brand.ville ? '' : ' empty');
    const addr = encodeURIComponent([brand.rue, brand.cp, brand.ville].filter(Boolean).join(' '));
    document.getElementById('maps-link').href = 'https://www.google.com/maps/dir/?api=1&destination=' + addr;
    document.getElementById('address-block').style.display = 'flex';
  } else {
    document.getElementById('address-block').style.display = 'none';
  }

  // Grilles photos
  renderGrid('ci', brand.checkInPhotos    || []);
  renderGrid('co', brand.checkOutPhotos   || []);
  renderGrid('rp', brand.returnProofPhotos || []);

  // Liens Drive
  const ciL = document.getElementById('ci-drive-link');
  const coL = document.getElementById('co-drive-link');
  const rpL = document.getElementById('rp-drive-link');
  if (brand.checkInFolderId)      { ciL.href = driveUrl(brand.checkInFolderId);      ciL.style.display = 'flex'; }
  if (brand.checkOutFolderId)     { coL.href = driveUrl(brand.checkOutFolderId);     coL.style.display = 'flex'; }
  if (brand.returnProofFolderId)  { rpL.href = driveUrl(brand.returnProofFolderId);  rpL.style.display = 'flex'; }

  document.getElementById('brand-note').value = brand.note || '';
}

// ── Render grille de photos (sans innerHTML ni onerror inline) ──
function renderGrid(type, photos) {
  const grid = document.getElementById(type + '-grid');
  const cnt  = document.getElementById(type + '-count');
  cnt.textContent = photos.length + ' photo' + (photos.length !== 1 ? 's' : '');
  grid.innerHTML  = '';

  photos.forEach((p, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'photo-thumb';

    const img = document.createElement('img');
    img.src     = p.thumb || p.localUrl || '';
    img.loading = 'lazy';
    img.addEventListener('error', () => { img.style.background = 'var(--surface)'; });

    const del = document.createElement('div');
    del.className = 'thumb-del';
    del.innerHTML = '<svg width="8" height="8" viewBox="0 0 8 8" fill="none"><line x1="1" y1="1" x2="7" y2="7" stroke="white" stroke-width="1.4" stroke-linecap="round"/><line x1="7" y1="1" x2="1" y2="7" stroke="white" stroke-width="1.4" stroke-linecap="round"/></svg>';
    del.addEventListener('click', e => {
      e.stopPropagation();
      deletePhoto(type, i);
    });

    wrap.append(img, del);
    grid.appendChild(wrap);
  });
}
