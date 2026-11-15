# Prompt pour Lovable - Redesign LogEngine Admin Dashboard

## 🎯 Contexte du Projet

Je travaille sur **LogEngine**, une plateforme de gestion et visualisation de logs d'applications. Le projet est un monorepo avec :
- **Backend** : Go (Gin framework) sur le port 8080
- **Frontend Admin** : React 19 + Vite + React Router 7 + TailwindCSS
- **Landing Page** : Next.js 15 avec le même design system

L'application permet aux utilisateurs de :
1. **Visualiser et filtrer les logs** de leurs applications (feature principale)
2. Gérer leurs applications et récupérer des API keys
3. Gérer les utilisateurs (admin only)

## 📁 Structure du Projet Admin

```
apps/ui/admin/
├── src/
│   ├── pages/
│   │   ├── Dashboard.tsx       # Page d'accueil
│   │   ├── LogExplorer.tsx     # Page principale (logs + filtres)
│   │   ├── Applications.tsx    # Gestion des apps
│   │   └── Users.tsx           # Gestion utilisateurs (admin)
│   ├── components/
│   │   └── Layout.tsx          # Layout avec sidebar
│   ├── services/
│   │   ├── logService.ts
│   │   ├── applicationService.ts
│   │   └── userService.ts
│   └── index.css               # Design system actuel
├── tailwind.config.js
└── package.json
```

## 🎨 Design System Actuel

### Couleurs (basées sur shadcn/ui)
```css
/* Light Mode */
--primary: 142 76% 36%;           /* Vert brand #2D7D4D */
--secondary: 0 0% 96%;            /* Gris clair */
--destructive: 0 84.2% 60.2%;    /* Rouge */
--muted: 0 0% 96%;
--border: 0 0% 90%;
--background: 0 0% 100%;          /* Blanc */

/* Dark Mode */
--primary: 142 76% 45%;           /* Vert plus clair */
--background: 0 0% 5%;            /* Presque noir */
--border: 0 0% 15%;
```

### Typographie
- **Font Family** : Arial, Helvetica, sans-serif
- **Headings** :
  - H1: `text-4xl font-bold tracking-tight`
  - H2: `text-2xl font-semibold`
- **Body** : `text-base`
- **Code/Logs** : `font-mono`

### Composants
- **Border Radius** : `0.5rem` (8px)
- **Espacement** : `p-6`, `gap-4`, `space-y-6`
- **Cards** : `bg-card border border-border rounded-lg`
- **Buttons** : `bg-primary text-primary-foreground rounded-md hover:bg-primary/90`

## 🎯 Objectif du Redesign

Je veux un design **ultra-épuré, moderne et minimaliste** inspiré de :
- **Vercel Dashboard** : Clean, spacieux, focus sur le contenu
- **Linear App** : Minimaliste, élégant, animations subtiles
- **Stripe Dashboard** : Professional, lisible, organisation claire

### Principes de Design Souhaités
1. **Minimalisme radical** : Retirer tout élément non essentiel
2. **Espace blanc généreux** : Respiration visuelle
3. **Typographie hiérarchisée** : Tailles claires, poids variés
4. **Microanimations** : Transitions subtiles, hover effects
5. **Focus sur les logs** : C'est le cœur du produit

## 📋 Pages à Redesigner

### 1. Dashboard (Page d'accueil)
**État actuel** : Simple avec CTA vers logs + liste des 10 derniers logs

**Amélioration souhaitée** :
- Hero section avec CTA principal vers Log Explorer
- Quick stats discrètes (optionnel) : nombre de logs aujourd'hui, erreurs critiques
- Timeline des derniers logs avec design épuré
- Utiliser des cards avec shadows subtiles
- Animations d'entrée (fade in, slide up)

### 2. Log Explorer (⭐ PAGE PRINCIPALE)
**État actuel** : Filtres en haut (app, level, dates, search) + liste de logs + pagination

**Amélioration souhaitée** :
- **Barre de recherche centrale** et prominent (comme Google)
- **Filtres avancés** dans un drawer/sidebar collapsible
- **Table de logs moderne** :
  - Colonnes : Timestamp, Level (badge coloré), Message, Application
  - Hover effects avec elevation
  - Ligne expansible pour voir les détails (PID, hostname, etc.)
  - Monospace pour les messages
- **Filtres rapides** : Chips pour levels (ERROR, WARN, INFO, etc.)
- **Export button** discret (CSV, JSON)
- **Live refresh** toggle (optionnel)
- **Pagination** moderne avec "Load more" ou infinite scroll

**Design de log entry** :
```
[TIMESTAMP]  [BADGE LEVEL]  [MESSAGE EN MONO]                    [APP NAME]
12:34:56     ERROR          Database connection timeout          web-api
             └─ Click to expand for full details
```

### 3. Applications
**État actuel** : Grid de cards avec nom, API key, date de création

**Amélioration souhaitée** :
- Cards avec design moderne (elevation, hover effect)
- API Key avec bouton copy stylisé
- Modal de création avec animations
- Icône distinctive par app (avatar généré ou emoji)
- Stats par app (nombre de logs, dernière activité)

### 4. Users (Admin only)
**État actuel** : Table avec username, role, apps assignées

**Amélioration souhaitée** :
- Table épurée avec avatars
- Badges pour les rôles
- Actions inline (edit, delete) au hover
- Modal de création moderne

### 5. Layout/Sidebar
**État actuel** : Sidebar fixe à gauche avec navigation

**Amélioration souhaitée** :
- **Sidebar collapsible** (version compacte avec icons seulement)
- Navigation avec icons + labels
- Active state clair
- User menu en bas avec avatar
- Dark mode toggle

## 🛠 Stack Technique à Utiliser

### Obligatoire
- **React 19** (déjà installé)
- **TailwindCSS 3.4** (déjà configuré)
- **React Router 7** pour la navigation
- **Lucide React** pour les icons (déjà installé)

### Recommandé (à installer si nécessaire)
- **Framer Motion** : Animations fluides
- **Recharts** : Si on ajoute des graphiques
- **React Hot Toast** : Notifications modernes
- **Headless UI** ou **Radix UI** : Composants accessibles (dropdowns, modals, etc.)

### À ÉVITER
- Font Awesome (remplacer par Lucide React icons)
- Composants lourds non nécessaires

## 📐 Spécifications Techniques

### Responsive Design
- **Mobile First** : Design adaptatif
- **Breakpoints** :
  - `sm: 640px` : Mobile landscape
  - `md: 768px` : Tablet
  - `lg: 1024px` : Desktop
  - `xl: 1280px` : Large desktop

### Performance
- **Lazy loading** des pages
- **Virtualization** pour les grandes listes de logs
- **Optimistic UI** pour les mutations
- **Skeleton loaders** pendant le chargement

### Animations
- **Transitions** : 150-300ms ease-out
- **Hover effects** : Scale légère (1.02), border highlight
- **Page transitions** : Fade in/out
- **Micro-interactions** : Button press, checkbox check, etc.

## 🎨 Inspirations Visuelles

### Composants spécifiques à s'inspirer :

1. **Vercel** :
   - Hero section du dashboard
   - Cards de projets
   - Navigation sidebar

2. **Linear** :
   - Barre de recherche avec filtres
   - Table/liste d'items
   - Animations subtiles

3. **Stripe** :
   - Tables de données
   - Code display (API keys)
   - Organization des pages

4. **GitHub** :
   - Log viewer (monospace, syntax highlight)
   - Filtres avec chips

## 📝 Livrables Attendus

1. **Fichiers mis à jour** :
   - `src/pages/Dashboard.tsx`
   - `src/pages/LogExplorer.tsx`
   - `src/pages/Applications.tsx`
   - `src/pages/Users.tsx`
   - `src/components/Layout.tsx`
   - `src/index.css` (si modifications du design system)
   - `tailwind.config.js` (si extensions nécessaires)

2. **Nouveaux composants réutilisables** dans `src/components/` :
   - `Button.tsx` (variantes : primary, secondary, ghost, destructive)
   - `Card.tsx`
   - `Badge.tsx`
   - `Input.tsx` / `Select.tsx`
   - `Modal.tsx`
   - `Table.tsx`
   - `LogEntry.tsx` (affichage d'un log)
   - `Sidebar.tsx` (collapsible)
   - Tout autre composant utile

3. **Documentation** :
   - README avec screenshots (optionnel)
   - Commentaires dans le code pour les sections complexes

## ⚠️ Contraintes

1. **Garder la couleur verte brand** (`#2D7D4D`) pour la primary
2. **Ne pas modifier les appels API** (logService, applicationService, userService)
3. **Conserver la structure des routes** existantes
4. **Rester compatible** avec les types TypeScript existants
5. **Accessibilité** : ARIA labels, keyboard navigation, contraste

## 🚀 Points de Focus Prioritaires

### 🥇 Priority 1 : Log Explorer
C'est LA page principale. Elle doit être exceptionnelle.

### 🥈 Priority 2 : Dashboard
Première impression de l'app, doit donner envie.

### 🥉 Priority 3 : Applications + Users
Fonctionnalités importantes mais secondaires.

---

**Question finale** : Peux-tu créer un design system complet et redesigner toutes ces pages en suivant ces guidelines ? Focus sur l'épuré, le moderne et la mise en valeur des logs.
