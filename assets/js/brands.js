/* ================================================================
   SHOOTING MANAGER — Brands (CRUD + render)
   Dépend de : config.js, ui.js, drive.js, db.js
================================================================ */

// ── Créer une marque ──
async function createBrand(name, rt, rue, cp, ville) {
  const shooting = db.shootings.find(s => s.id === currentShootingId);
  if (!shooting) return;
  setLoading(true, 'Création des dossiers Drive');
  try {
    const brandFid    = await createFolder(name, shooting.driveFolderId);
    const checkInFid  = await createFolder('Photo Check in',  brandFid);
    const checkOutFid = await createFolder('Photo Check out', brandFid);
    shooting.brands.push({
      id: uid(), name, returnType: rt, packageReceived: false,
      rue, cp, ville,
      brandFolderId:      brandFid,
      checkInFolderId:    checkInFid,
      checkOutFolderId:   checkOutFid,
      checkInPhotos:      [],
      checkOutPhotos:     [],
      returnProofPhotos:  [],
      returnProofFolderId: null,
      note: '',
    });
    saveDB();
    closeSheet('brand');
    renderBrands();
    toast('Marque ajoutée', 'success');
  } catch (e) {
    toast('Erreur : ' + e.message, 'error');
  } finally {
    setLoading(false);
  }
}

// ── Supprimer une marque ──
async function deleteBrand(shootingId, brandId) {
  const shooting = db.shootings.find(s => s.id === shootingId);
  if (!shooting) return;
  const brand = shooting.brands.find(b => b.id === brandId);
  if (brand?.brandFolderId) deleteDriveItem(brand.brandFolderId);
  shooting.brands = shooting.brands.filter(b => b.id !== brandId);
  saveDB();
}

// ── Render liste des marques ──
function renderBrands() {
  const shooting = db.shootings.find(s => s.id === currentShootingId);
  if (!shooting) return;

  let brands = shooting.brands;
  if (activeFilter === 'coursier') brands = brands.filter(b => b.returnType === 'coursier');
  else if (activeFilter === 'drop')      brands = brands.filter(b => b.returnType === 'drop');
  else if (activeFilter === 'received')  brands = brands.filter(b => b.packageReceived);
  else if (activeFilter === 'pending')   brands = brands.filter(b => !b.packageReceived);

  document.getElementById('brands-count').textContent = brands.length + ' marque' + (brands.length !== 1 ? 's' : '');
  const list = document.getElementById('brands-list');
  list.innerHTML = '';

  if (!brands.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    const titleMsg = activeFilter !== 'all' ? 'Aucun résultat' : 'Aucune marque';
    const textMsg  = activeFilter !== 'all'
      ? 'Aucune marque pour ce filtre.'
      : 'Appuyez sur + pour ajouter<br>une marque à ce shooting.';
    empty.innerHTML = `<div class="empty-state-line"></div><div class="empty-state-title">${titleMsg}</div><div class="empty-state-text">${textMsg}</div>`;
    list.appendChild(empty);
    return;
  }

  brands.forEach(b => {
    const ci = (b.checkInPhotos  || []).length;
    const co = (b.checkOutPhotos || []).length;

    const card = document.createElement('div');
    card.className  = 'brand-card';
    card.dataset.id = b.id;

    // header
    const header = document.createElement('div');
    header.className = 'brand-card-header';

    const nameEl = document.createElement('div');
    nameEl.className  = 'brand-name';
    nameEl.textContent = b.name;   // textContent = safe, pas d'XSS

    const tags = document.createElement('div');
    tags.className = 'brand-tags';

    const rtTag = document.createElement('span');
    rtTag.className  = b.returnType === 'coursier' ? 'tag tag-coursier' : 'tag tag-drop';
    rtTag.textContent = b.returnType === 'coursier' ? 'Coursier' : 'Drop';

    const rcTag = document.createElement('span');
    rcTag.className  = b.packageReceived ? 'tag tag-recv' : 'tag tag-wait';
    rcTag.textContent = b.packageReceived ? 'Reçu' : 'En attente';

    const delBtn = document.createElement('button');
    delBtn.className     = 'brand-del-btn';
    delBtn.dataset.brandId = b.id;
    delBtn.title         = 'Supprimer';
    delBtn.innerHTML     = '<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3h6M4 3V2h2v1M3 3l.4 6h3.2L7 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    tags.append(rtTag, rcTag);
    header.append(nameEl, tags, delBtn);

    // footer stats
    const footer = document.createElement('div');
    footer.className = 'brand-card-footer';
    footer.innerHTML = `<div class="photo-stat"><div class="stat-dot${ci > 0 ? ' has' : ''}"></div><span class="photo-stat-label">Check in</span>&nbsp;${ci}</div>`
      + `<div class="photo-stat"><div class="stat-dot${co > 0 ? ' has' : ''}"></div><span class="photo-stat-label">Check out</span>&nbsp;${co}</div>`;

    card.append(header, footer);
    list.appendChild(card);

    // events
    card.addEventListener('click', e => {
      if (e.target.closest('.brand-del-btn')) return;
      currentBrandId = b.id;
      showScreen('brand');
      renderBrandDetail();
    });

    delBtn.addEventListener('click', async e => {
      e.stopPropagation();
      if (!confirm(`Supprimer "${b.name}" ? Le dossier Drive sera également supprimé.`)) return;
      setLoading(true, 'Suppression en cours');
      await deleteBrand(currentShootingId, b.id);
      setLoading(false);
      renderBrands();
      toast('Marque supprimée');
    });
  });
}
