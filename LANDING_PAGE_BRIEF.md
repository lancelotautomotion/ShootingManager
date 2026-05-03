# Shooting Manager — Brief complet pour la landing page

> **Objectif de ce document :** fournir toutes les informations nécessaires pour concevoir et développer une landing page marketing de A à Z, sans avoir à ouvrir le code source de l'application.

---

## Table des matières

1. [Vue d'ensemble du produit](#1-vue-densemble-du-produit)
2. [Cible utilisateur](#2-cible-utilisateur)
3. [Proposition de valeur](#3-proposition-de-valeur)
4. [Fonctionnalités clés](#4-fonctionnalités-clés)
5. [Différenciateurs concurrentiels](#5-différenciateurs-concurrentiels)
6. [Architecture technique (pour la landing)](#6-architecture-technique-pour-la-landing)
7. [Identité visuelle](#7-identité-visuelle)
8. [Copywriting & ton](#8-copywriting--ton)
9. [Structure recommandée de la landing page](#9-structure-recommandée-de-la-landing-page)
10. [Contenu section par section](#10-contenu-section-par-section)
11. [Parcours utilisateur (UX flow)](#11-parcours-utilisateur-ux-flow)
12. [Éléments de réassurance](#12-éléments-de-réassurance)
13. [SEO & méta-données](#13-seo--méta-données)
14. [Stack technique recommandée pour la landing](#14-stack-technique-recommandée-pour-la-landing)
15. [Checklist avant mise en ligne](#15-checklist-avant-mise-en-ligne)

---

## 1. Vue d'ensemble du produit

**Nom :** Shooting Manager
**Version actuelle :** v5.0
**Type :** Application web SaaS — aucune installation requise
**Langue de l'interface :** Français

### En une phrase
> Shooting Manager est l'outil web dédié aux assistants stylistes pour gérer les samples et les retours marques lors d'un shooting photo, sans friction et sans serveur tiers.

### Description longue
Shooting Manager est une application web minimaliste et élégante qui centralise toute la logistique d'un shooting mode : réception des samples (check-in), envoi en retour (check-out), suivi des marques, et synchronisation automatique de toutes les photos sur Google Drive. L'application ne nécessite ni installation, ni compte créé manuellement — une simple connexion Google suffit.

Tout est stocké dans le Google Drive de l'utilisateur. Aucun serveur propriétaire, aucune donnée hébergée par un tiers. L'utilisateur garde le contrôle total de ses données.

---

## 2. Cible utilisateur

### Persona principal : l'assistante styliste

| Attribut | Détail |
|---|---|
| **Métier** | Assistante styliste / coordinatrice de shooting |
| **Secteur** | Mode, luxe, prêt-à-porter, e-commerce fashion |
| **Taille équipe** | Solo ou petite équipe (1–5 personnes) |
| **Appareils** | iPhone/Android en priorité, ordinateur en bureau |
| **Niveau tech** | Intermédiaire — à l'aise avec Google Drive, Instagram |
| **Pain points** | Désorganisation entre marques, photos éparpillées, oubli de retours, stress logistique |
| **Outils actuels** | Excel, notes papier, dossiers Drive manuels, WhatsApp |

### Persona secondaire : le styliste indépendant

- Gère ses propres shootings de A à Z
- Travaille avec plusieurs marques en parallèle
- A besoin d'une preuve de retour (litige marques)

### Contexte d'utilisation
- Sur le plateau de shooting (téléphone à la main, cadence rapide)
- En bureau la veille pour préparer la liste des marques
- En déplacement pour les retours coursier/drop

---

## 3. Proposition de valeur

### Valeur principale
**Zéro friction, zéro perte.** Toutes les photos, tous les statuts, toutes les marques — organisés en 30 secondes, synchronisés sur votre Drive, accessibles depuis n'importe quel appareil.

### Pyramid de valeur

```
        ┌─────────────────────────────────┐
        │  TRANSFORMATION (identité)       │  "Je suis une pro organisée"
        ├─────────────────────────────────┤
        │  BÉNÉFICE ÉMOTIONNEL            │  Sérénité le jour J
        ├─────────────────────────────────┤
        │  BÉNÉFICE FONCTIONNEL           │  Tout est archivé automatiquement
        ├─────────────────────────────────┤
        │  FONCTIONNALITÉ                 │  Check-in / Check-out photo
        └─────────────────────────────────┘
```

### 3 promesses clés
1. **Organiser** — Chaque shooting, chaque marque, au même endroit
2. **Documenter** — Une photo = une preuve, classée automatiquement dans Drive
3. **Suivre** — Voir d'un coup d'œil ce qui est rendu, ce qui est en attente

---

## 4. Fonctionnalités clés

### 4.1 Gestion des shootings

- Créer un shooting (nom + date + notes)
- Suppression avec confirmation
- Dossier Google Drive créé automatiquement à la création
- Affichage du nombre de marques et de la date
- Navigation fluide entre shootings sur mobile (swipe-to-delete) et desktop (panneau fixe)

### 4.2 Gestion des marques par shooting

Chaque shooting peut contenir N marques. Pour chaque marque :

| Champ | Description |
|---|---|
| **Nom** | Nom de la marque |
| **Type de retour** | Coursier ou Drop (livraison en point relais / bureau) |
| **Adresse** | Rue, code postal, ville (avec lien Google Maps) |
| **Statut** | Reçu / En attente |
| **Note** | Zone de texte libre (sauvegarde auto) |

- Création automatique de 3 dossiers Drive par marque :
  - `Photo Check in`
  - `Photo Check out`
  - `Preuve de retour` (créé à la première photo)

### 4.3 Check-in (réception des samples)

- Prise ou import de photos des samples à la réception
- Génération locale de miniatures (canvas, 300×300 px, JPEG 0.75)
- Upload automatique dans le dossier Drive `Photo Check in`
- Compteur de photos par marque
- Suppression individuelle de photos
- Lien direct vers le dossier Drive

### 4.4 Check-out (départ des samples)

- Identique au check-in mais pour le départ
- Dossier Drive `Photo Check out`
- Permet de prouver l'état des pièces au départ

### 4.5 Preuve de retour

- Photos dédiées pour prouver le retour (reçu coursier, dépôt point relais)
- Bouton appareil photo en priorité sur mobile
- Dossier Drive `Preuve de retour` créé à la demande
- Indispensable en cas de litige avec une marque

### 4.6 Filtres de marques

| Filtre | Critère |
|---|---|
| Tout | Toutes les marques |
| Coursier | Type retour = Coursier |
| Drop | Type retour = Drop |
| Reçu | packageReceived = true |
| En attente | packageReceived = false |

- Mise à jour en temps réel
- Compteur visible par filtre

### 4.7 Synchronisation Google Drive

- Sauvegarde automatique avec debounce de 1,2 s
- Indicateur visuel : `Drive` (synchronisé), `Sync…` (en cours), `Hors ligne` (erreur)
- Base de données stockée en JSON dans le dossier AppData de Google Drive (invisible pour l'utilisateur)
- Dossier racine `Shooting Manager` créé automatiquement

### 4.8 Profil utilisateur

- Avatar Google importé automatiquement
- Possibilité d'uploader un avatar personnalisé (recadrage carré, 200×200 px)
- Nom et email Google
- Toggle thème clair/sombre
- Déconnexion sécurisée

---

## 5. Différenciateurs concurrentiels

| Critère | Shooting Manager | Excel/Sheets | App générique de gestion |
|---|---|---|---|
| Conçu pour les shootings | ✅ | ❌ | ❌ |
| Photos intégrées | ✅ | ❌ | Partiel |
| Sync Drive automatique | ✅ | Manuel | ❌ |
| Zéro serveur tiers | ✅ | ❌ (Google) | ❌ |
| Mobile-first | ✅ | ❌ | Partiel |
| Zéro installation | ✅ | ❌ | ❌ |
| Gratuit | ✅ | ✅ | Freemium |
| Preuve de retour | ✅ | ❌ | ❌ |
| Interface en français | ✅ | Variable | Variable |

### Arguments différenciants à mettre en avant
1. **Zéro serveur** — Vos données restent dans votre Drive, personne d'autre n'y accède
2. **Fait pour le terrain** — Interface pensée pour utilisation rapide, une main, téléphone en mouvement
3. **Preuve légale** — Photos horodatées, archivées, accessibles en cas de litige
4. **Gratuit sans limite** — Aucun freemium, aucune limite de shootings ou de marques

---

## 6. Architecture technique (pour la landing)

> Cette section est utile pour le développeur de la landing page afin de comprendre le contexte de l'app liée.

### Application principale
- **Type :** Single-page web app (SPA) — 3 fichiers HTML autonomes
- **Framework :** Aucun — HTML5 + JavaScript vanilla
- **Backend :** Aucun serveur propriétaire — Google Drive API v3 uniquement
- **Auth :** Google OAuth 2.0 (token client, implicit flow)
- **Stockage :** Google Drive AppData (JSON) + dossiers Drive utilisateur
- **Déploiement :** Hébergement statique (n'importe quel CDN)

### Ce que la landing page doit faire
- Expliquer le produit
- Rediriger vers `login.html` (connexion Google)
- Être entièrement statique (HTML/CSS/JS ou framework léger)
- Être optimisée mobile (l'audience utilise principalement un smartphone)

### Liens importants
| Page | Rôle |
|---|---|
| `landing_page_app.html` | Landing page existante (à remplacer) |
| `login.html` | Page d'authentification Google |
| `shooting-manager.html` | Application principale |

---

## 7. Identité visuelle

### Palette de couleurs

#### Mode sombre (défaut)

| Token | Valeur | Usage |
|---|---|---|
| `--bg` | `#070707` | Fond principal (quasi-noir) |
| `--surface` | `#0f0f0f` | Surface secondaire |
| `--card` | `#141414` | Cartes et conteneurs |
| `--border` | `#1e1e1e` | Bordures subtiles |
| `--text-primary` | `#f0ede8` | Texte principal |
| `--text-secondary` | `#8a8680` | Texte secondaire |
| `--accent` | `#c4a46b` | Doré — CTA, états actifs |
| `--accent-hover` | `#d4b47b` | Doré hover |
| `--green` | `#4d9e6e` | Succès, Coursier, Reçu |
| `--purple` | `#8b70c4` | Drop |
| `--red` | `#b85c5c` | Erreur, En attente |

#### Mode clair

| Token | Valeur | Usage |
|---|---|---|
| `--bg` | `#f4f0ea` | Fond crème/beige |
| `--surface` | `#edeae4` | Surface |
| `--card` | `#e8e4de` | Cartes |
| `--text-primary` | `#1a1814` | Texte sombre |
| `--accent` | `#9a7a45` | Doré plus sombre |

### Typographie

| Usage | Police | Caractéristiques |
|---|---|---|
| Titres / Wordmark | **Cormorant Garamond** | Serif élégant, condensé, italique disponible |
| Corps / UI | **DM Sans** | Humaniste sans-serif, lisible sur petit écran |

- Titres en Cormorant Garamond, poids 300–600
- Labels en DM Sans, ALL CAPS + letter-spacing (hiérarchie visuelle)
- Taille de base : 16px minimum pour la lisibilité mobile

### Effets visuels signature
- **Grain texture** — overlay de bruit pour texture organique (opacity faible)
- **Radial glow** — lueur centrale diffuse en fond (couleur accent très atténuée)
- **Transitions douces** — 0.2–0.3s ease pour tous les états
- **Bordures fines** — 1px solid avec couleur semi-transparente

### Iconographie
- Icônes SVG inline (aucune librairie externe)
- Style : trait fin, minimaliste, monochromatique

### Espacement & Layout
- Grille basée sur multiples de 8px
- Padding cartes : 16–24px
- Border-radius : 12–16px (cartes), 8px (boutons, inputs)
- Breakpoints :
  - Mobile : < 600px
  - Tablette : 600–999px
  - Desktop : ≥ 1000px

---

## 8. Copywriting & ton

### Voix de la marque

| Attribut | Description |
|---|---|
| **Ton** | Professionnel mais accessible — ni trop corporate, ni trop décontracté |
| **Registre** | Français courant, féminin inclusif (cible principale = femmes) |
| **Valeurs** | Élégance, efficacité, sérénité, contrôle |
| **À éviter** | Jargon tech, promesses vagues, superlatifs creux |

### Taglines & accroches testées

**Tagline principale :**
> "Gérez vos samples & retours sans friction"

**Variantes :**
- "Votre plateau, organisé en 30 secondes"
- "Chaque sample tracé. Chaque retour prouvé."
- "L'outil des assistantes stylistes qui ne veulent rien perdre"
- "Drive sync. Zéro installation. Zéro stress."

### Lexique métier à utiliser

| Terme | Contexte |
|---|---|
| Sample | Pièce de vêtement / accessoire prêté par une marque |
| Shooting | Séance photo mode |
| Check-in | Réception d'un sample |
| Check-out | Départ / retour d'un sample |
| Retour coursier | Récupération par un livreur |
| Drop | Dépôt du sample par l'assistante en point relais |
| Marque | Maison de mode prêtant des samples |
| Preuve de retour | Photo documentant la remise du sample |

### Messages clés par bénéfice

#### Bénéfice 1 — Organisation
> "Un shooting = un espace. Toutes vos marques, leurs samples, leurs adresses de retour — au même endroit."

#### Bénéfice 2 — Documentation photo
> "Une photo au check-in, une au check-out. La preuve est dans votre Drive, classée, horodatée, accessible en un clic."

#### Bénéfice 3 — Retours sans litige
> "Coursier ou drop, prenez en photo la preuve de retour. Plus jamais de litige avec une marque."

#### Bénéfice 4 — Zéro installation
> "Ouvrez l'onglet, connectez-vous avec Google. C'est tout. Fonctionne sur iPhone, Android, Mac, PC."

#### Bénéfice 5 — Vos données, votre Drive
> "Aucun serveur tiers. Tout vit dans votre Google Drive. Vous gardez le contrôle total."

#### Bénéfice 6 — Mobile-first
> "Conçu pour une main, en mouvement, sur un plateau. Prise en main en 2 minutes."

---

## 9. Structure recommandée de la landing page

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR                                                  │
│  Logo | Nav links | CTA "Se connecter"                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  HERO                                                    │
│  Accroche principale + sous-titre + CTA primaire         │
│  Mockup de l'app (mobile + desktop)                      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  SOCIAL PROOF (barre de réassurance)                     │
│  Logos / stats / badges                                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  PROBLÈME → SOLUTION                                     │
│  "Vous connaissez ça ?" + comment SM résout chaque point │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  FONCTIONNALITÉS (6 cartes)                              │
│  Icône + titre + description courte                      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  HOW IT WORKS (workflow en 4 étapes)                     │
│  Visuel animé ou statique de chaque étape                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  APERÇU APP (screenshots)                                │
│  Carousel ou grille de captures d'écran réelles          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  TÉMOIGNAGE(S)                                           │
│  Quote + nom + métier + avatar                           │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  DIFFÉRENCIATEURS / AVANTAGES CLÉS                       │
│  Tableau comparatif ou liste visuelle                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  CTA FINAL                                               │
│  Accroche + bouton "Commencer gratuitement"              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  FOOTER                                                  │
│  Logo | Liens | Mentions légales | Version               │
└─────────────────────────────────────────────────────────┘
```

---

## 10. Contenu section par section

### 10.1 Navbar

```
[Logo — Shooting Manager]          [Fonctionnalités]  [Comment ça marche]  [Se connecter →]
```

- Logo : wordmark "Shooting Manager" en Cormorant Garamond
- Sticky au scroll, fond semi-transparent avec blur
- Sur mobile : hamburger → drawer ou menu plein écran
- CTA "Se connecter" → `login.html`

---

### 10.2 Hero

**Titre H1 :**
> Gérez vos samples & retours sans friction

**Sous-titre :**
> L'outil conçu pour les assistantes stylistes. Check-in, check-out, suivi des retours — tout est synchronisé dans votre Google Drive. Zéro installation. Zéro serveur tiers.

**CTA principal :**
> [Commencer gratuitement — connexion Google] → `login.html`

**CTA secondaire :**
> [Voir comment ça marche ↓] → scroll vers section workflow

**Visuel suggéré :**
- Mockup de l'app sur iPhone + MacBook côte à côte
- Fond : quasi-noir avec grain texture et radial glow doré
- Screenshot de la liste des marques avec statuts colorés

---

### 10.3 Barre de réassurance

```
[ Zéro serveur tiers ]  [ Sync Drive automatique ]  [ Mobile-first ]  [ 100% gratuit ]
```

Ou avec chiffres :
```
[ v5.0 ]  [ Google Drive ]  [ iOS & Android ]  [ Aucune carte bancaire ]
```

---

### 10.4 Problème → Solution

**Headline :**
> Vous connaissez ce chaos ?

**Problèmes (à gauche / en haut) :**
- ❌ Des photos de samples éparpillées entre iCloud, WhatsApp et Google Photos
- ❌ Des retours oubliés et des litiges avec les marques
- ❌ Des tableaux Excel à maintenir manuellement entre deux prises de vue
- ❌ Impossible de retrouver le bon dossier sur Drive en plein shooting

**Solutions (à droite / en bas) :**
- ✅ Toutes les photos classées automatiquement dans Drive
- ✅ Preuve de retour photographiée et archivée
- ✅ Mise à jour en temps réel depuis votre téléphone
- ✅ Arborescence Drive créée automatiquement dès la création du shooting

---

### 10.5 Fonctionnalités (6 cartes)

#### Carte 1 — Shootings & Marques
**Icône :** 📁 (ou SVG dossier)
**Titre :** Organisation par shooting
**Description :** Créez un espace par shooting. Ajoutez les marques, leurs adresses, leur type de retour. Tout est structuré, rien ne se mélange.

#### Carte 2 — Check-in / Check-out
**Icône :** 📸 (ou SVG appareil photo)
**Titre :** Photos de réception et de départ
**Description :** Photographiez les samples à l'arrivée et au départ. Les photos sont uploadées instantanément dans le bon dossier Drive.

#### Carte 3 — Sync Google Drive
**Icône :** ☁️ (ou SVG Drive)
**Titre :** Synchronisation automatique
**Description :** Chaque action est sauvegardée dans votre Drive en moins de 2 secondes. Travaillez sur mobile ou bureau, vos données vous suivent.

#### Carte 4 — Filtres & Statuts
**Icône :** 🔍 (ou SVG filtre)
**Titre :** Vue d'ensemble instantanée
**Description :** Filtrez par type de retour (Coursier / Drop) ou par statut (Reçu / En attente). Sachez en un coup d'œil ce qui reste à faire.

#### Carte 5 — Mobile-first
**Icône :** 📱 (ou SVG téléphone)
**Titre :** Conçu pour le terrain
**Description :** Interface pensée pour une utilisation rapide, une main, en mouvement. Fonctionne sur iPhone, Android, sans téléchargement.

#### Carte 6 — Zéro installation
**Icône :** ⚡ (ou SVG éclair)
**Titre :** Prêt en 30 secondes
**Description :** Ouvrez l'URL, connectez-vous avec Google, commencez. Aucune app à installer, aucun compte à créer. Juste votre Google.

---

### 10.6 How It Works (4 étapes)

**Headline :** Comment ça marche

```
① CONNECTEZ-VOUS
   Cliquez sur "Continuer avec Google".
   Shooting Manager accède à votre Drive — c'est tout.

② CRÉEZ UN SHOOTING
   Nommez votre shooting, ajoutez une date.
   Un dossier Drive est créé automatiquement.

③ AJOUTEZ VOS MARQUES
   Pour chaque marque : nom, type de retour, adresse.
   3 sous-dossiers Drive sont créés à la volée.

④ PHOTOGRAPHIEZ & SUIVEZ
   Check-in à la réception, check-out au départ.
   Preuve de retour pour chaque coursier ou drop.
```

---

### 10.7 Témoignage

> "Avant Shooting Manager, je passais 30 minutes après chaque shooting à trier mes photos. Maintenant tout est dans Drive pendant que je shoot. Un vrai gain de temps."

— **Marie L.**, Assistante styliste — Paris

*(Adapter selon les vrais témoignages disponibles)*

---

### 10.8 Avantages clés (section différenciants)

**Headline :** Pourquoi Shooting Manager ?

| | Shooting Manager | Excel | App générique |
|---|:---:|:---:|:---:|
| Conçu pour les shootings mode | ✅ | ❌ | ❌ |
| Photos intégrées | ✅ | ❌ | Partiel |
| Sync Drive automatique | ✅ | Manuel | ❌ |
| Vos données restent les vôtres | ✅ | ❌ | ❌ |
| Mobile-first | ✅ | ❌ | Partiel |
| Zéro installation | ✅ | ❌ | ❌ |
| 100% gratuit | ✅ | ✅ | Freemium |

---

### 10.9 CTA Final

**Headline :**
> Votre prochain shooting mérite mieux qu'un tableau Excel.

**Sous-titre :**
> Gratuit. Sans inscription. Vos données dans votre Drive.

**Bouton :**
> [Commencer maintenant — connexion Google] → `login.html`

**Mention de réassurance sous le bouton :**
> Aucune carte bancaire requise · Vos données restent dans votre Google Drive · Fonctionne sur tous les appareils

---

### 10.10 Footer

```
Shooting Manager                    v5.0

                                    Fonctionnalités
                                    Comment ça marche
                                    Se connecter

Vos données restent dans votre Google Drive.
Aucun serveur tiers. Aucune publicité.
```

---

## 11. Parcours utilisateur (UX flow)

### Depuis la landing page

```
Landing Page
    │
    ├── [CTA "Commencer gratuitement"]
    │       └── login.html
    │               └── [Connexion Google]
    │                       └── shooting-manager.html (app)
    │
    ├── [CTA "Voir comment ça marche"]
    │       └── Scroll vers section How It Works
    │
    └── [Navbar "Se connecter"]
            └── login.html
```

### Dans l'application (résumé)

```
App (shooting-manager.html)
    │
    ├── Écran : Liste des shootings
    │       ├── Créer un shooting → [Formulaire modal]
    │       └── Sélectionner un shooting → Écran marques
    │
    ├── Écran : Liste des marques
    │       ├── Filtres (Tout / Coursier / Drop / Reçu / En attente)
    │       ├── Ajouter une marque → [Formulaire modal]
    │       └── Sélectionner une marque → Écran détail marque
    │
    └── Écran : Détail marque
            ├── Check-in photos
            ├── Check-out photos
            ├── Preuve de retour
            ├── Statut package (Reçu / En attente)
            ├── Adresse + Google Maps
            └── Note libre
```

---

## 12. Éléments de réassurance

### Sécurité & confidentialité
- **Aucun serveur propriétaire** — Les données ne transitent jamais par un serveur tiers
- **Google OAuth 2.0** — Standard d'authentification utilisé par des millions d'apps
- **AppData Drive** — La base de données JSON est invisible dans votre Drive (dossier AppData)
- **Token en session** — Le token d'accès est effacé à la fermeture de l'onglet

### Fiabilité
- **Sync avec debounce** — Chaque modification est sauvegardée dans les 1,2 secondes
- **Indicateur de statut** — Badge visible à tout moment (Drive / Sync / Hors ligne)
- **Pas de perte de données** — En cas de perte de connexion, les données attendent la reconnexion

### Gratuité
- **100% gratuit** — Aucun modèle freemium, aucune limite de shootings ou de marques
- **Pas de carte bancaire** — Jamais
- **Financé par :** *(à définir selon le modèle économique futur)*

### Accessibilité
- **Tous les appareils** — iPhone, Android, Mac, PC, tablette
- **Tous les navigateurs** — Chrome, Safari, Firefox, Edge
- **Pas d'app à installer** — Web natif, accès via URL

---

## 13. SEO & méta-données

### Balises HTML recommandées

```html
<title>Shooting Manager — Gérez vos samples & retours sans friction</title>

<meta name="description" content="L'outil web pour assistantes stylistes. Organisez vos shootings, photographiez les check-ins/check-outs et synchronisez tout dans Google Drive. Zéro installation.">

<meta name="keywords" content="shooting manager, assistant styliste, gestion samples, check-in mode, retour coursier, google drive, outil shooting photo">

<!-- Open Graph -->
<meta property="og:title" content="Shooting Manager — Gérez vos samples & retours sans friction">
<meta property="og:description" content="L'outil conçu pour les assistantes stylistes. Organisez vos shootings et synchronisez vos photos dans Google Drive.">
<meta property="og:image" content="[URL de l'image de preview]">
<meta property="og:type" content="website">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Shooting Manager">
<meta name="twitter:description" content="Gérez vos samples & retours sans friction. Sync Google Drive. Zéro installation.">
```

### Mots-clés cibles

| Intention | Mot-clé |
|---|---|
| Informationnel | "gestion samples shooting mode" |
| Informationnel | "outil assistante styliste" |
| Informationnel | "suivi retour sample marque" |
| Transactionnel | "application shooting photo mode" |
| Transactionnel | "outil check-in check-out mode" |

### Structure des headings

```
H1 : Gérez vos samples & retours sans friction
  H2 : Vous connaissez ce chaos ?
  H2 : Les fonctionnalités dont vous avez besoin
    H3 : Organisation par shooting
    H3 : Photos de réception et de départ
    H3 : Synchronisation automatique
    H3 : Vue d'ensemble instantanée
    H3 : Conçu pour le terrain
    H3 : Prêt en 30 secondes
  H2 : Comment ça marche
  H2 : Pourquoi Shooting Manager ?
  H2 : Commencez maintenant
```

---

## 14. Stack technique recommandée pour la landing

### Option A — HTML/CSS/JS vanilla (cohérent avec l'app)
- Aucune dépendance, déploiement immédiat
- Cohérent avec l'application principale
- Animation via CSS + Intersection Observer
- Idéal si hébergement statique simple (GitHub Pages, Netlify, Vercel)

### Option B — Next.js / Astro (si besoin de performances avancées)
- SSG (Static Site Generation) pour performances maximales
- Tailwind CSS pour le styling
- Meilleur pour SEO et Core Web Vitals
- À préférer si la landing a vocation à évoluer

### Option C — Astro + Tailwind (recommandé pour landing page SaaS)
- Compilation vers HTML statique (zéro JS inutile)
- Tailwind pour la cohérence du design system
- Composants réutilisables
- Excellent Lighthouse score out-of-the-box

### Animations recommandées
- **Scroll reveal** — apparition progressive des sections (Intersection Observer)
- **Hover cards** — légère élévation et glow sur les cartes de fonctionnalités
- **Mockup parallax** — effet de profondeur sur le mockup de l'app dans le hero
- **Sync badge** — animation du badge Drive (spinner CSS)

### Performance cibles
| Métrique | Cible |
|---|---|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID / INP | < 100ms |
| CLS | < 0.1 |
| Lighthouse Performance | > 90 |
| Lighthouse Accessibility | > 95 |

---

## 15. Checklist avant mise en ligne

### Contenu
- [ ] Tous les textes relus et validés
- [ ] Témoignages vérifiés (vrais utilisateurs ou anonymisés)
- [ ] Lien CTA vers `login.html` fonctionnel
- [ ] Version de l'app à jour dans le footer (v5.0)

### Design
- [ ] Mode clair et mode sombre testés
- [ ] Cohérence typographique (Cormorant + DM Sans)
- [ ] Palette de couleurs respectée (doré #c4a46b, vert #4d9e6e, etc.)
- [ ] Mockups de l'app intégrés et à jour

### Technique
- [ ] Balises méta renseignées (title, description, OG, Twitter)
- [ ] Favicon et apple-touch-icon présents
- [ ] Responsive testé sur iPhone SE, iPhone 15, iPad, Desktop 1440px
- [ ] Performance Lighthouse > 90 (mobile et desktop)
- [ ] Pas de ressources bloquantes (JS defer/async)
- [ ] Google Fonts chargées avec `display=swap`

### Accessibilité
- [ ] Contraste texte/fond ≥ 4.5:1 (WCAG AA)
- [ ] Attributs `alt` sur toutes les images
- [ ] Navigation au clavier fonctionnelle
- [ ] Focus visible sur tous les éléments interactifs

### Analytics (optionnel)
- [ ] Google Analytics ou Plausible configuré
- [ ] Événement CTA "Commencer gratuitement" tracké
- [ ] Heatmap (Hotjar) pour optimisation future

---

*Document généré le 3 mai 2026 — Shooting Manager v5.0*
