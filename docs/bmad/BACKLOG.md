# Backlog — Shooting Manager
**Version :** 1.0  
**Date :** 2026-04-09  
**Méthode :** BMAD  
**Référence :** PRD v1.0

---

## Légende

| Statut | Signification |
|--------|--------------|
| `[ ]` | À faire |
| `[~]` | En cours |
| `[x]` | Terminé |

**Priorités :** P0 = bloquant / P1 = haute / P2 = normale / P3 = nice-to-have

---

## EPIC 1 — Refactoring structure (O1)

> Objectif : Séparer HTML, CSS et JS dans des fichiers distincts pour une maintenance propre.

---

### STORY 1.1 — Créer le design system partagé `tokens.css`
**Priorité :** P0  
**Dépendances :** aucune  
**Statut :** `[ ]`

**En tant qu'** architecte du projet,  
**Je veux** un fichier CSS unique contenant toutes les variables de design (couleurs, dark/light),  
**Afin que** les 3 pages utilisent la même source de vérité et qu'une modification de couleur ne nécessite qu'un seul changement.

**Critères d'acceptation :**
- [ ] Fichier `assets/css/tokens.css` créé avec toutes les variables `:root` et `[data-theme="light"]`
- [ ] Suppression des blocs `:root` dupliqués dans `shooting-manager.html`, `login.html`, `landing_page_app.html`
- [ ] Les 3 pages importent `tokens.css` en premier lien `<link>`
- [ ] Le design est visuellement identique avant/après

---

### STORY 1.2 — Extraire `base.css` (reset + typo)
**Priorité :** P0  
**Dépendances :** STORY 1.1  
**Statut :** `[ ]`

**En tant que** développeur,  
**Je veux** que le reset CSS, les imports Google Fonts et la typographie de base soient dans un fichier partagé,  
**Afin d'** éviter la duplication et de bénéficier du cache navigateur.

**Critères d'acceptation :**
- [ ] Fichier `assets/css/base.css` créé
- [ ] Contient : reset `*`, `html/body`, les imports fonts, les classes utilitaires communes
- [ ] Les 3 pages importent `base.css` après `tokens.css`
- [ ] Aucune régression visuelle

---

### STORY 1.3 — Extraire `assets/css/app.css`
**Priorité :** P1  
**Dépendances :** STORY 1.2  
**Statut :** `[ ]`

**En tant que** développeur,  
**Je veux** que tous les styles de `shooting-manager.html` soient dans `assets/css/app.css`,  
**Afin que** le fichier HTML ne contienne plus aucun `<style>` inline.

**Critères d'acceptation :**
- [ ] `assets/css/app.css` créé avec l'intégralité des styles de l'app
- [ ] `shooting-manager.html` ne contient plus de balise `<style>`
- [ ] `app.html` importe `tokens.css` + `base.css` + `app.css`
- [ ] Fonctionnement complet de l'app (dark/light mode, responsive, toutes les vues)

---

### STORY 1.4 — Extraire `assets/css/login.css` et `assets/css/landing.css`
**Priorité :** P1  
**Dépendances :** STORY 1.2  
**Statut :** `[ ]`

**Critères d'acceptation :**
- [ ] `assets/css/login.css` créé, `login.html` sans `<style>`
- [ ] `assets/css/landing.css` créé, `index.html` sans `<style>`
- [ ] Renommer `landing_page_app.html` → `index.html`
- [ ] Renommer `shooting-manager.html` → `app.html`
- [ ] Liens entre pages mis à jour (`login.html` ↔ `app.html` ↔ `index.html`)

---

### STORY 1.5 — Extraire `assets/js/config.js`
**Priorité :** P0  
**Dépendances :** aucune  
**Statut :** `[ ]`

**Critères d'acceptation :**
- [ ] `assets/js/config.js` contient `CLIENT_ID`, `SCOPES`, `DB_FILENAME`, `ROOT_FOLDER_NAME`
- [ ] Toutes les pages qui en ont besoin importent ce fichier
- [ ] Aucune constante dupliquée entre les pages

---

### STORY 1.6 — Extraire `assets/js/auth.js`
**Priorité :** P0  
**Dépendances :** STORY 1.5  
**Statut :** `[ ]`

**Critères d'acceptation :**
- [ ] `assets/js/auth.js` contient toute la logique OAuth (initTokenClient, handleToken, logout)
- [ ] `login.html` et `app.html` importent `auth.js` et l'utilisent
- [ ] Gestion de `token_expiry` ajoutée (voir ARCHITECTURE.md §4)
- [ ] La redirection post-login fonctionne correctement

---

### STORY 1.7 — Extraire `assets/js/drive.js` et `assets/js/db.js`
**Priorité :** P1  
**Dépendances :** STORY 1.6  
**Statut :** `[ ]`

**Critères d'acceptation :**
- [ ] `drive.js` contient toutes les fonctions d'appel à l'API Google Drive (upload, list, delete, create folder, get file)
- [ ] `db.js` contient la logique de lecture/écriture du JSON dans AppData (loadDB, saveDB, debounce save)
- [ ] `app.js` orchestre drive.js et db.js
- [ ] Toutes les fonctionnalités Drive existantes opérationnelles

---

### STORY 1.8 — Extraire `assets/js/ui.js`, `shoots.js`, `brands.js`, `photos.js`, `app.js`
**Priorité :** P1  
**Dépendances :** STORY 1.7  
**Statut :** `[ ]`

**Critères d'acceptation :**
- [ ] `ui.js` : toast, spinner, modals, bottom sheets
- [ ] `shoots.js` : CRUD shootings, rendu liste
- [ ] `brands.js` : CRUD marques, rendu liste, filtres
- [ ] `photos.js` : upload, thumbnail, suppression, lazy loading
- [ ] `app.js` : init, routeur écrans (mobile/desktop), event listeners globaux
- [ ] L'app fonctionne de bout en bout sur mobile et desktop

---

## EPIC 2 — Sécurité (O2)

> Objectif : Durcir l'app pour une mise en ligne sans risques.

---

### STORY 2.1 — Ajouter Content Security Policy
**Priorité :** P0  
**Dépendances :** STORY 1.4 (pages renommées)  
**Statut :** `[ ]`

**Critères d'acceptation :**
- [ ] Balise `<meta http-equiv="Content-Security-Policy">` dans `index.html`, `login.html`, `app.html`
- [ ] Whitelist explicite des domaines Google (accounts.google.com, apis.google.com, fonts.googleapis.com, fonts.gstatic.com, www.googleapis.com, lh3.googleusercontent.com)
- [ ] Aucune erreur CSP dans la console sur le flow complet (login → app → upload photo)

---

### STORY 2.2 — Sanitisation des entrées utilisateur
**Priorité :** P1  
**Dépendances :** STORY 1.8  
**Statut :** `[ ]`

**Critères d'acceptation :**
- [ ] Audit de tous les `innerHTML = variable` dans le code
- [ ] Remplacement par `textContent` ou construction DOM (`createElement`) partout où la valeur vient de l'utilisateur
- [ ] Les noms de shootings, marques, notes, adresses sont tous traités comme texte brut
- [ ] Un test manuel avec `<script>alert(1)</script>` en nom de shooting n'exécute pas le script

---

### STORY 2.3 — Gestion robuste du token OAuth
**Priorité :** P1  
**Dépendances :** STORY 1.6  
**Statut :** `[ ]`

**Critères d'acceptation :**
- [ ] `token_expiry` stocké en `sessionStorage` avec le token
- [ ] Avant chaque appel Drive, vérification que `Date.now() < token_expiry`
- [ ] Si expiré : silent refresh automatique (si possible) sinon redirect vers login
- [ ] Sur logout : `sessionStorage.clear()` + révocation Google
- [ ] Le token n'apparaît jamais dans l'URL

---

## EPIC 3 — Landing page qui convertit (O3)

> Objectif : Refonte de la landing page avec fond clair, hiérarchie claire, CTA visible.

---

### STORY 3.1 — Refonte visuelle landing page (fond clair)
**Priorité :** P0  
**Dépendances :** STORY 1.4 (renommage en index.html)  
**Statut :** `[ ]`

**En tant que** visiteur qui découvre Shooting Manager,  
**Je veux** arriver sur une page claire, lisible, qui me montre immédiatement le bénéfice produit,  
**Afin de** comprendre en 5 secondes si c'est fait pour moi.

**Critères d'acceptation :**
- [ ] Fond crème chaud (`#FAF8F5`) au lieu du noir `#070707`
- [ ] Texte principal `#1A1714` (excellent contraste WCAG AA)
- [ ] Navigation fixe avec logo + CTA "Essayer gratuitement" toujours visible
- [ ] Hero : titre fort (bénéfice principal), sous-titre, 1 CTA primaire doré bien visible
- [ ] Police Cormorant Garamond conservée pour les titres
- [ ] DM Sans conservée pour les corps de texte
- [ ] Le design est cohérent avec l'identité visuelle de l'app (même or, même typo)

---

### STORY 3.2 — Section "Pourquoi Shooting Manager" (bénéfices)
**Priorité :** P1  
**Dépendances :** STORY 3.1  
**Statut :** `[ ]`

**Critères d'acceptation :**
- [ ] 3 à 4 bénéfices clés présentés en grid (pas de liste à puces)
- [ ] Chaque bénéfice a un titre court + 1-2 phrases max
- [ ] Les bénéfices répondent à de vraies douleurs (voir PRD §3)
- [ ] Icônes SVG simples (pas d'images externes)

---

### STORY 3.3 — Section workflow "Comment ça marche"
**Priorité :** P1  
**Dépendances :** STORY 3.1  
**Statut :** `[ ]`

**Critères d'acceptation :**
- [ ] 3 étapes numérotées (Créer un shooting → Ajouter les marques → Suivre les retours)
- [ ] Visuellement distinct de la section features
- [ ] Responsive mobile (colonne unique)

---

### STORY 3.4 — Section preuve sociale / crédibilité
**Priorité :** P2  
**Dépendances :** STORY 3.1  
**Statut :** `[ ]`

**Critères d'acceptation :**
- [ ] Au moins 1 témoignage styliste (réel ou placeholder réaliste)
- [ ] OU stats crédibles (ex : "Zéro données sur nos serveurs", "100% dans votre Drive")
- [ ] Ton professionnel, pas de chiffres inventés

---

### STORY 3.5 — CTA final et footer
**Priorité :** P1  
**Dépendances :** STORY 3.1  
**Statut :** `[ ]`

**Critères d'acceptation :**
- [ ] Section CTA finale avec titre accrocheur et bouton principal
- [ ] Mention "Gratuit · Aucune carte de crédit · Données dans votre Drive"
- [ ] Footer avec lien mentions légales, politique de confidentialité (pages vides OK pour v1)
- [ ] Footer avec copyright LancelotAutomotion

---

### STORY 3.6 — Optimisation SEO et meta tags
**Priorité :** P2  
**Dépendances :** STORY 3.1  
**Statut :** `[ ]`

**Critères d'acceptation :**
- [ ] `<title>` descriptif (ex : "Shooting Manager — Gérez vos samples et retours photo")
- [ ] `<meta name="description">` pertinente (150-160 caractères)
- [ ] Open Graph tags (`og:title`, `og:description`, `og:image`)
- [ ] `<html lang="fr">`

---

## EPIC 4 — Qualité & déploiement (O4)

---

### STORY 4.1 — Vérification Lighthouse mobile
**Priorité :** P2  
**Dépendances :** Toutes les stories EPIC 1, 2, 3  
**Statut :** `[ ]`

**Critères d'acceptation :**
- [ ] Score Performance > 90 sur landing page (mobile)
- [ ] Score Accessibility > 85
- [ ] Score Best Practices > 90

---

### STORY 4.2 — Guide de déploiement Netlify
**Priorité :** P2  
**Dépendances :** STORY 1.4  
**Statut :** `[ ]`

**Critères d'acceptation :**
- [ ] Fichier `docs/DEPLOY.md` créé avec les étapes pour déployer sur Netlify
- [ ] Instructions pour configurer les origines OAuth dans Google Cloud Console
- [ ] Instructions pour configurer un domaine custom (optionnel)

---

## Ordre de traitement recommandé

```
Sprint 1 — Fondations (EPIC 1 + EPIC 2 en parallèle)
  STORY 1.1 → 1.2 → 1.5 (parallèle)
  STORY 1.3 → 1.4 → 1.6 → 1.7 → 1.8
  STORY 2.1 + 2.2 + 2.3 (après EPIC 1)

Sprint 2 — Landing page (EPIC 3)
  STORY 3.1 → 3.2 → 3.3 → 3.4 → 3.5 → 3.6

Sprint 3 — Qualité & déploiement (EPIC 4)
  STORY 4.1 → 4.2
```

---

## Backlog futur (non planifié)

- [ ] **F1** — Système d'abonnement (Stripe, plans Free/Pro)
- [ ] **F2** — Rappels automatiques de retours (email via Netlify Function)
- [ ] **F3** — Export PDF récapitulatif de shooting
- [ ] **F4** — Mode partage (lien read-only d'un shooting)
- [ ] **F5** — Multi-langues (EN)
- [ ] **F6** — PWA offline complète (Service Worker)
- [ ] **F7** — Authentification backend propriétaire (abandon dépendance Google Drive)
