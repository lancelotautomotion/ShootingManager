# PRD — Shooting Manager
**Version :** 1.0  
**Date :** 2026-04-09  
**Statut :** Validé  
**Méthode :** BMAD (Breakthrough Method for Agile AI-Driven Development)

---

## 1. Problème

Les assistants stylistes en mode photo gèrent des dizaines de marques par shooting : réception des samples, photos check-in/check-out, preuves de retour coursier ou drop, adresses de retour. Aujourd'hui ils font ça sur des notes papier, des sheets Google ou dans leur tête. Résultat : samples perdus, retours oubliés, tensions avec les marques.

---

## 2. Solution

**Shooting Manager** est une web-app SaaS mobile-first qui centralise la gestion des samples et retours pour assistants stylistes francophones. Elle stocke toutes les données dans le Google Drive de l'utilisateur (zéro serveur propriétaire), propose des photos synchronisées et un suivi retour clair.

---

## 3. Utilisateurs cibles

**Persona principal :** Assistante styliste free-lance ou en agence, francophone, 25–40 ans, travaille sur smartphone et laptop, gère 3 à 15 shootings par mois, 5 à 40 marques par shooting.

**Douleurs prioritaires :**
- Oublier de relancer un retour coursier
- Perdre la preuve photo d'un envoi
- Ne pas retrouver l'adresse de retour d'une marque
- Gérer plusieurs shootings en parallèle sans s'y perdre

---

## 4. Objectifs produit (ce sprint)

| # | Objectif | Métrique de succès |
|---|----------|--------------------|
| O1 | Refactoring propre de la codebase | Code séparé en modules CSS/JS, 0 inline-script critique |
| O2 | Sécurisation de l'app | Token OAuth non exposé dans l'URL, XSS mitigé, CSP en place |
| O3 | Landing page qui convertit | Taux de clic CTA > 15 %, fond clair, hiérarchie visuelle claire |
| O4 | Architecture scalable pour SaaS | Structure de fichiers prête à accueillir auth backend + pricing |

---

## 5. Périmètre — Dans le scope

- Refactoring de `shooting-manager.html`, `login.html`, `landing_page_app.html` en fichiers séparés (HTML + CSS + JS)
- Réécriture de la landing page avec fond clair et sections conversion-first
- Hardening sécurité : CSP, sanitisation HTML, gestion token
- Conservation intégrale du design (palette, typo, dark/light mode)
- Conservation de toutes les fonctionnalités v5.0

## 6. Périmètre — Hors scope (backlog futur)

- Système de paiement / abonnement
- Backend propriétaire (API Node/Python)
- Authentification autre que Google OAuth
- Notifications push / email
- Export PDF des retours
- Mode collaboratif multi-utilisateurs sur un même shooting

---

## 7. Contraintes techniques

| Contrainte | Détail |
|------------|--------|
| Pas de framework JS | Vanilla JS uniquement (choix existant à conserver) |
| Google Drive API v3 | Stockage données + photos dans le Drive utilisateur |
| Google OAuth 2.0 | Seule méthode d'auth disponible |
| Pas de build tool obligatoire | Le projet doit pouvoir tourner en ouvrant les fichiers HTML |
| Langues | Interface en français uniquement |

---

## 8. Critères de succès global

1. Un développeur externe peut comprendre la structure en < 10 min
2. La landing page est déployable statiquement (Netlify, Vercel, GitHub Pages)
3. Aucun token OAuth ne transite dans les URLs
4. Le score Lighthouse performance > 90 sur mobile
5. Les fonctionnalités v5.0 sont intégralement préservées

---

## 9. Hypothèses

- Les utilisateurs ont un compte Google
- Le navigateur cible est Chrome/Safari mobile + Chrome/Firefox desktop
- La langue de l'interface reste le français pour ce sprint
- Le Google Drive de l'utilisateur est le seul backend de données

---

## 10. Risques

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|-----------|
| Refactoring casse des fonctionnalités Google Drive | Moyen | Haut | Tests manuels story par story |
| Landing page trop différente déroute les utilisateurs existants | Faible | Moyen | Garder la même charte graphique |
| CSP bloque Google OAuth | Moyen | Haut | Whitelist explicite des domaines Google |
