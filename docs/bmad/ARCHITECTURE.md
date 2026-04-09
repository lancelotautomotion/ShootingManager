# Architecture — Shooting Manager
**Version :** 1.0  
**Date :** 2026-04-09  
**Statut :** Validé  
**Méthode :** BMAD

---

## 1. État actuel (As-Is)

```
ShootingManager/
├── shooting-manager.html    # App principale — 1 050 lignes (HTML + CSS + JS inline)
├── login.html               # Écran de connexion — 412 lignes (HTML + CSS + JS inline)
├── landing_page_app.html    # Landing page — 717 lignes (HTML + CSS + JS inline)
└── _public_html (1).zip     # Archive de déploiement
```

**Problèmes identifiés :**

| Problème | Impact |
|----------|--------|
| CSS/JS inline dans chaque fichier | Maintenance difficile, aucune réutilisation, cache navigateur inutilisable |
| Duplication de variables CSS (`:root`) dans chaque fichier | Désynchronisation du design system possible |
| Token OAuth stocké brut dans `sessionStorage` | Risque si XSS présent |
| Pas de Content Security Policy | Fenêtre ouverte aux injections de scripts tiers |
| `innerHTML` utilisé sans sanitisation systématique | Vecteur XSS potentiel |
| Pas de séparation des responsabilités | Logique métier, UI et API Drive mélangées |

---

## 2. Architecture cible (To-Be)

```
ShootingManager/
├── index.html                  # Landing page (renommée, SEO-friendly)
├── login.html                  # Connexion (HTML uniquement)
├── app.html                    # App principale (HTML uniquement)
│
├── assets/
│   ├── css/
│   │   ├── tokens.css          # Variables CSS partagées (design tokens)
│   │   ├── base.css            # Reset, typographie, utilitaires
│   │   ├── landing.css         # Styles landing page
│   │   ├── login.css           # Styles écran login
│   │   └── app.css             # Styles application
│   │
│   └── js/
│       ├── config.js           # Constantes (CLIENT_ID, SCOPES, etc.)
│       ├── auth.js             # OAuth flow, gestion token
│       ├── drive.js            # Toutes les interactions Google Drive API
│       ├── db.js               # Lecture/écriture JSON en Drive (AppData)
│       ├── ui.js               # Composants UI réutilisables (toast, modal, spinner)
│       ├── shoots.js           # Logique métier shootings
│       ├── brands.js           # Logique métier marques
│       ├── photos.js           # Upload, thumbnail, suppression photos
│       └── app.js              # Point d'entrée, routeur écrans, init
│
└── docs/
    └── bmad/
        ├── PRD.md
        ├── ARCHITECTURE.md
        └── BACKLOG.md
```

---

## 3. Design system partagé (tokens.css)

Un seul fichier `:root` est source de vérité pour toute la palette.  
Les 3 pages (landing, login, app) importent `tokens.css` + `base.css` en premier.

```css
/* tokens.css — extrait */
:root {
  --bg: #070707;
  --gold: #c4a46b;
  /* ... */
}
[data-theme="light"] {
  --bg: #f4f0ea;
  /* ... */
}
```

---

## 4. Gestion du token OAuth

**Règle :** le token ne doit jamais apparaître dans l'URL (hash ou query param).

```
Flux actuel :
  OAuth popup → callback → sessionStorage.setItem('sm_token', token) → redirect

Flux cible (identique, mais renforcé) :
  OAuth popup → callback → sessionStorage uniquement (pas localStorage)
             → token validé côté client avant toute requête Drive
             → expiration gérée proprement (token_expiry)
             → révocation au logout
```

**À faire :**
- Stocker aussi `token_expiry = Date.now() + expires_in * 1000`
- Vérifier l'expiration avant chaque appel Drive, déclencher un silent refresh si nécessaire
- Sur logout : `sessionStorage.clear()` + `google.accounts.oauth2.revoke(token)`

---

## 5. Content Security Policy

À ajouter dans chaque `<head>` :

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' https://accounts.google.com https://apis.google.com;
  style-src 'self' https://fonts.googleapis.com 'unsafe-inline';
  font-src https://fonts.gstatic.com;
  connect-src 'self' https://www.googleapis.com https://accounts.google.com;
  img-src 'self' data: blob: https://lh3.googleusercontent.com;
  frame-src https://accounts.google.com;
">
```

> Note : `unsafe-inline` sur `style-src` est temporaire. À terme, externaliser tout le CSS inline restant.

---

## 6. Sanitisation HTML

Remplacer tous les `element.innerHTML = userContent` par une fonction utilitaire :

```js
// ui.js
function setHTML(el, raw) {
  // Sanitisation minimale sans dépendance externe
  const tmp = document.createElement('div');
  tmp.textContent = raw;
  el.textContent = tmp.textContent; // Si texte pur
  // Pour du HTML structuré : utiliser DOMParser + whitelist d'attributs
}
```

Pour les cas où du HTML structuré est nécessaire (ex : affichage de nom de marque avec badges) :  
utiliser `textContent` pour les valeurs utilisateur et construire la structure par `createElement`.

---

## 7. Landing page — Architecture visuelle cible

**Problème actuel :** fond `#070707` (quasi-noir), texte sur fond sombre = difficile à lire en lumière ambiante, peu engageant pour une première visite.

**Cible :** fond clair (crème/blanc chaud), sections aérées, hiérarchie visuelle claire, CTA visible immédiatement.

```
Structure de la landing page :
  1. Nav fixe               — logo gauche, CTA "Essayer gratuitement" doré à droite
  2. Hero                   — titre fort, sous-titre bénéfice, 1 CTA primaire, 1 secondaire
  3. Preuve sociale/stats   — chiffres clés (ex : "500+ shootings gérés", "Zéro serveur")
  4. Features grid          — 3-4 bénéfices clés avec icônes
  5. Workflow               — 3 étapes illustrées (Créer → Ajouter → Suivre)
  6. Témoignage             — citation styliste
  7. CTA final              — "Commencer maintenant, c'est gratuit"
  8. Footer                 — liens légaux, crédits
```

**Palette landing (mode clair forcé) :**

```css
:root {
  --lp-bg: #FAF8F5;        /* crème chaud */
  --lp-surface: #FFFFFF;
  --lp-text: #1A1714;
  --lp-text-2: #6B6560;
  --lp-gold: #B8903E;      /* doré légèrement assombri pour lisibilité sur clair */
  --lp-border: #E8E3DC;
}
```

---

## 8. Déploiement statique

L'app reste 100% statique (pas de build, pas de serveur).  
Déploiement cible : **Netlify** ou **GitHub Pages**.

```
Pré-requis pour déployer :
  - Fichiers dans /public ou à la racine
  - index.html = landing page
  - Configurer les origines OAuth autorisées dans Google Cloud Console
    (ajouter le domaine Netlify/custom domain)
```

**Variables sensibles :**  
Le `CLIENT_ID` Google est public par design (c'est une clé OAuth publique).  
Il n'y a pas de secret côté client à protéger.  
Les restrictions sont côtées Google Console (domaines autorisés).

---

## 9. Évolutions futures (hors scope sprint 1)

| Évolution | Impact architecture |
|-----------|---------------------|
| Abonnement SaaS (Stripe) | Ajout `backend/` (Netlify Functions ou Supabase) |
| Auth multi-provider | Abstraction `auth.js` avec provider pattern |
| Notifications email retours | Netlify Functions + Resend/Postmark |
| Export PDF | Client-side via `jsPDF` ou server-side PDF lambda |
| Mode collaboratif | Partage Drive folder + WebSocket ou polling |
