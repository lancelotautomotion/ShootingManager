/* ================================================================
   SHOOTING MANAGER — Shootings (CRUD + render)
   Dépend de : config.js, ui.js, drive.js, db.js
================================================================ */

// ── Créer un shooting ──
async function createShooting(name, date, notes) {
  setLoading(true, 'Création du dossier Drive');
  try {
    const folderId = await createFolder(name + (date ? ' — ' + date : ''), db.rootFolderId);
    db.shootings.unshift({
      id: uid(), name, date, notes,
      driveFolderId: folderId,
      createdAt:     new Date().toISOString(),
      brands:        [],
    });
    saveDB();
    closeSheet('shooting');
    renderShootings();
    toast('Shooting créé', 'success');
  } catch (e) {
    toast('Erreur : ' + e.message, 'error');
  } finally {
    setLoading(false);
  }
}

// ── Supprimer un shooting ──
async function deleteShooting(id) {
  const s = db.shootings.find(x => x.id === id);
  if (!s) return;
  if (s.driveFolderId) deleteDriveItem(s.driveFolderId);
  db.shootings = db.shootings.filter(x => x.id !== id);
  saveDB();
  renderShootings();
  toast('Shooting supprimé');
}

// ── Render liste des shootings ──
function renderShootings() {
  const list  = document.getElementById('shootings-list');
  const count = document.getElementById('shootings-count');
  const hint  = document.getElementById('swipe-hint');
  const n     = db.shootings.length;

  count.textContent  = n + ' shooting' + (n > 1 ? 's' : '');
  hint.style.display = (n > 0 && !isDesktop()) ? 'block' : 'none';

  list.innerHTML = '';

  if (!n) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = '<div class="empty-state-line"></div>'
      + '<div class="empty-state-title">Aucun shooting</div>'
      + '<div class="empty-state-text">Appuyez sur + pour créer<br>votre premier shooting.</div>';
    list.appendChild(empty);
    return;
  }

  db.shootings.forEach(s => {
    const bc    = s.brands.length;
    const parts = [];
    if (s.date) {
      parts.push(fmtDate(s.date));
    } else {
      parts.push(new Date(s.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }));
    }
    if (s.notes) parts.push(esc(s.notes));

    // wrap
    const wrap  = document.createElement('div');
    wrap.className  = 'shooting-wrap';
    wrap.dataset.id = s.id;

    // swipe bg
    const bg = document.createElement('div');
    bg.className = 'shooting-del-bg';
    bg.innerHTML = '<span class="shooting-del-label">Supprimer</span>'
      + '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 4h10M6 4V3h4v1M5 4l.5 9h5l.5-9" stroke="var(--red)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    // card
    const card      = document.createElement('div');
    card.className  = 'shooting-card';
    card.dataset.id = s.id;

    // info
    const info    = document.createElement('div');
    info.className = 'shooting-card-info';

    const nameEl      = document.createElement('div');
    nameEl.className  = 'shooting-card-name';
    nameEl.textContent = s.name;

    const meta      = document.createElement('div');
    meta.className  = 'shooting-card-meta';
    meta.textContent = `${bc} marque${bc !== 1 ? 's' : ''} · ${parts.join(' · ')}`;

    info.appendChild(nameEl);
    info.appendChild(meta);

    // desktop delete button
    const delBtn      = document.createElement('button');
    delBtn.className  = 'shooting-del-desktop';
    delBtn.title      = 'Supprimer';
    delBtn.innerHTML  = '<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3h6M4 3V2h2v1M3 3l.4 6h3.2L7 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    // chevron
    const chevron = document.createElement('svg');
    chevron.className = 'shooting-chevron';
    chevron.setAttribute('width', '14'); chevron.setAttribute('height', '14');
    chevron.setAttribute('viewBox', '0 0 14 14'); chevron.setAttribute('fill', 'none');
    chevron.style.cssText = 'color:var(--muted2);flex-shrink:0';
    chevron.innerHTML = '<polyline points="5,2 9,7 5,12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>';

    card.append(info, delBtn, chevron);
    wrap.append(bg, card);
    list.appendChild(wrap);

    // events
    attachSwipe(wrap, card, s.id);

    card.addEventListener('click', e => {
      if (e.target.closest('.shooting-del-desktop')) return;
      if (card._didSwipe) return;
      currentShootingId = s.id;
      document.getElementById('brands-shooting-name').textContent = s.name;
      activeFilter = 'all';
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.toggle('active', p.dataset.filter === 'all'));
      if (isDesktop()) {
        document.querySelectorAll('.shooting-card').forEach(c => c.classList.toggle('desktop-selected', c.dataset.id === s.id));
      }
      showScreen('brands');
      renderBrands();
    });

    delBtn.addEventListener('click', async e => {
      e.stopPropagation();
      if (!confirm(`Supprimer "${s.name}" ?`)) return;
      await deleteShooting(s.id);
    });
  });
}

// ── Swipe-to-delete (mobile) ──
function attachSwipe(wrap, card, id) {
  let x0 = 0, y0 = 0, dx = 0, dragging = false;
  const TRIGGER = 80, MAX = 110;
  card._didSwipe = false;

  card.addEventListener('touchstart', e => {
    x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    dragging = true; dx = 0; card._didSwipe = false;
    card.classList.add('swiping');
  }, { passive: true });

  card.addEventListener('touchmove', e => {
    if (!dragging) return;
    const ddx = e.touches[0].clientX - x0;
    const ddy = e.touches[0].clientY - y0;
    if (Math.abs(ddy) > Math.abs(ddx)) { dragging = false; card.classList.remove('swiping'); return; }
    if (ddx > 0) return;
    card._didSwipe = true;
    dx = Math.max(ddx, -MAX);
    card.style.transform = `translateX(${dx}px)`;
  }, { passive: true });

  card.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false; card.classList.remove('swiping');
    if (dx < -TRIGGER) {
      card.classList.add('snap-del');
      card.style.transform = 'translateX(-120%)';
      setTimeout(() => deleteShooting(id), 190);
    } else {
      card.classList.add('snap-back');
      card.style.transform = 'translateX(0)';
      setTimeout(() => { card.classList.remove('snap-back'); dx = 0; }, 280);
    }
  });
}
