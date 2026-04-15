# IMPLEMENTATION — Template “No Shorts” (Safari Web Extension)

Ce document sert de brief “copiable” pour recréer une extension Safari (macOS + iOS + iPadOS + visionOS) sur le même modèle que ce projet, puis la décliner pour d’autres plateformes (Twitter/X, TikTok, etc.) en gardant :

- une architecture simple (peu de fichiers, logique centralisée),
- une UI de réglages identique (même design system),
- une maintenance facile (sélecteurs isolés, traitement idempotent, peu de permissions).

Référence de l’existant (dans ce repo) :
- Web Extension : `Shared (Extension)/Resources/manifest.json`, `content.js`, `popup.html`, `popup.css`, `popup.js`, `background.js`
- Native host (optionnel) : `Shared (Extension)/SafariWebExtensionHandler.swift`
- Apps conteneurs : `Shared (App)/ViewController.swift` + `Shared (App)/Base.lproj/Main.html`

---

## 1) Architecture cible (recommandée)

### 1.1 Composants et responsabilités

- `manifest.json` (MV3)
  - déclare `content_scripts` (injection), `action.default_popup` (UI), `background.service_worker` (optionnel)
  - permissions minimales (ici : uniquement `storage`)
- `content.js`
  - applique les règles sur le site (hide/replace/placeholder)
  - écoute les changements de settings via `storage.onChanged`
  - gère SPA + DOM dynamique (MutationObserver + hooks de navigation)
- `popup.html` / `popup.css` / `popup.js`
  - UI de réglages (design + toggles)
  - persistance via `storage` (sync si dispo, sinon local)
- `background.js` (optionnel)
  - utile uniquement si vous avez besoin d’événements de fond (alarms, messaging, etc.)
  - dans ce projet il est minimal
- `SafariWebExtensionHandler.swift` (optionnel)
  - pont “native messaging” si vous avez besoin de logique native (rare pour ce type d’extension)

### 1.2 Structure de fichiers pour un “template” multi-plateformes

Si vous prévoyez plusieurs extensions (YouTube, Twitter, TikTok) en gardant la même UI et le même socle, la structure la plus maintenable est :

```
Shared (Extension)/Resources/
  manifest.json
  popup.html
  popup.css
  popup.js
  background.js
  sites/
    youtube/
      content.js
      site.config.js
    twitter/
      content.js
      site.config.js
    tiktok/
      content.js
      site.config.js
  common/
    storage.js
    ui.js
    selectors.js
```

Notes :
- Safari Web Extension charge très bien plusieurs scripts ; l’important est de garder un “core” commun (storage, UI, patterns) et un “site package” (selectors + règles).
- Même si vous faites 1 repo par extension, cette structure reste utile (copier/coller de `common/` + `popup.*`).

---

## 2) Modèle “Settings” (contrat partagé popup ↔ content script)

### 2.1 Schéma + défauts

Le principe actuel (à conserver) :
- un objet `DEFAULT_SETTINGS` **unique**,
- clés stables (camelCase) et valeurs primitives (bool), faciles à migrer,
- utilisé à la fois dans `popup.js` et `content.js`.

Existant :
- `Shared (Extension)/Resources/popup.js`
- `Shared (Extension)/Resources/content.js`

Recommandation (template) :
- définir `DEFAULT_SETTINGS` et (optionnel) `SETTINGS_VERSION`
- si vous ajoutez des options plus tard : migration simple “best effort” (ne jamais casser si storage est vide/corrompu)

### 2.2 Persistance : sync → local → fallback

Pattern à réutiliser tel quel :
- détecter l’API (`browser` vs `chrome`)
- choisir `storage.sync` si disponible, sinon `storage.local`
- fallback en mémoire si storage indisponible (Safari “hardened” / contexte inhabituel)

Existant : `getStorageArea()`, `getStoredSettings()`, `saveSettings()` dans `popup.js` et `content.js`.

### 2.3 Réactivité côté page : `storage.onChanged`

Pour éviter un refresh de l’onglet :
- le popup écrit dans `storage`
- le content script écoute `storage.onChanged` et relance un traitement central (`processPage()`)

Existant : `registerSettingsListener()` dans `Shared (Extension)/Resources/content.js`.

---

## 3) Content script : règles robustes (DOM dynamique + SPA)

Objectif : “ça marche même si le site est une SPA et rerender en permanence”.

### 3.1 Point d’entrée unique : `processPage()`

Le content script doit avoir une fonction centrale, idempotente :
- lit l’état courant (`currentSettings`)
- applique ou restaure chaque feature sans dépendre de l’ordre de chargement du DOM

Existant : `processPage()` dans `Shared (Extension)/Resources/content.js`.

### 3.2 Anti “flash” : CSS critique injectée dès `document_start`

Sur les sites qui affichent vite (YouTube/Twitter), il faut éviter le flash de contenu :
- déclarer `run_at: "document_start"` dans `manifest.json`
- injecter des styles “critique” immédiatement (avant que le DOM complet n’arrive)

Existant :
- `manifest.json` (`run_at: "document_start"`)
- `injectCriticalStyles()` + `CRITICAL_HIDE_STYLE_ID` dans `content.js`

Règle : la CSS critique ne doit contenir que les sélecteurs “sûrs” (ceux qui matchent tôt et souvent).

### 3.3 DOM qui bouge : `MutationObserver` + debounce

Pattern recommandé :
- un `MutationObserver` sur `document.body` (subtree)
- dès qu’il y a des `addedNodes`, appeler `processPageDebounced()`
- debouncer (ex : 100–200ms) pour éviter de saturer

Existant : `MutationObserver` + `debounce()` + `processPageDebounced` dans `content.js`.

### 3.4 Navigation SPA : hooks `history` + événements custom

Pour les routes internes (sans reload) :
- wrapper `history.pushState` / `replaceState`
- écouter `popstate`
- écouter les événements custom du site si connus (YouTube : `yt-navigate-finish`, `yt-page-data-updated`)

Existant : `installNavigationHooks()` + `handleNavigation()` dans `content.js`.

### 3.5 Cacher / restaurer proprement (idempotent)

Ne pas “perdre” l’état original :
- marquer les éléments cachés via `data-*` (raison)
- restaurer uniquement ceux marqués par l’extension

Existant : `hideElement(element, reason)` + `restoreElements(selector, reason)` dans `content.js`.

### 3.6 Placeholder (optionnel) quand on vide un écran

Quand vous masquez un feed complet (home, sidebar…), ajouter un placeholder évite un “vide blanc” :
- insertion d’un container dédié (ex: `#nyts-placeholder`)
- palette light/dark (déduite du thème du site ou via `prefers-color-scheme`)
- suppression quand la feature est off

Existant : `injectHomePlaceholder()` dans `content.js`.

---

## 4) UI : “modale” de réglages (popup) — design à reproduire

Dans Safari, le “popup” de la toolbar est la modale de réglages. Ici, le design est volontairement :
- “card UI” (container arrondi + ombre légère),
- typographie système (look natif),
- responsive (plus large sur desktop),
- compatible light/dark automatiquement.

Fichiers de référence :
- `Shared (Extension)/Resources/popup.html`
- `Shared (Extension)/Resources/popup.css`
- `Shared (Extension)/Resources/popup.js`

### 4.1 Structure HTML (à conserver)

Le layout est stable :
- `.popup-container`
  - `.header` : icône + titre + sous-titre
  - `.content`
    - `.description` : texte + `.status`
    - `.toggles` : liste de `label.toggle`
  - `.footer` : support / CTA

Chaque toggle est un `label` qui contient :
- `.toggle-copy` (title + description)
- `.switch` (input + slider)

Avantages :
- clic large (tout le label clique le checkbox),
- structure très simple pour ajouter/supprimer une option.

### 4.2 Design system CSS (tokens + composants)

Tokens (dans `:root`) à reprendre :
- `color-scheme: light dark` (la base)
- couleurs : `--primary-color` / `--primary-hover` / `--success-color`
- surfaces : `--background-light` / `--background-dark`
- textes : `--text-primary-*`, `--text-secondary-*`
- bordures/ombres : `--border-*`, `--card-shadow*`

Composants (règles clés) :
- container : border radius `12px`, bordure fine, ombre douce
- toggles : “cards” avec hover (desktop), gap et padding constants
- switch : 44×24, thumb 18, animation simple (0.2s)
- status : badge vert avec point pulsé (animation `pulse`)
- dark mode : `@media (prefers-color-scheme: dark)` en surcharge

Responsive :
- base `max-width: 420px`
- sur desktop : media query `(hover: hover) and (pointer: fine)` → `width/max-width: 520px`

### 4.3 Logique JS du popup (binding simple)

Pattern à réutiliser :
- lire settings au `DOMContentLoaded`
- `wireToggle(id, key, settings)` pour binder chaque checkbox
- au change : `saveSettings({ [key]: checked })`

Existant : `wireToggle(...)` dans `Shared (Extension)/Resources/popup.js`.

### 4.4 Comment ajouter une option (sans casser la maintenance)

Checklist :
- ajouter la clé + default dans `DEFAULT_SETTINGS` (popup + content)
- ajouter un nouveau bloc `label.toggle` dans `popup.html` (id unique)
- binder via `wireToggle("id", "key", settings)` dans `popup.js`
- implémenter la feature dans `content.js` dans `processPage()` :
  - `if (currentSettings.newKey) { ... } else { ...restore... }`
- (si nécessaire) ajouter la restauration via `restoreElements(selector, "reason")`

---

## 5) Décliner vers Twitter/X, TikTok : règles de maintenance

### 5.1 Séparer “core” et “site”

Pour chaque plateforme, évitez d’éparpiller :
- le core = storage + hooks SPA + observer + helpers hide/restore
- le site = sélecteurs + détection de pages + règles par feature

Concrètement :
- `common/` ne doit pas contenir de sélecteurs spécifiques (ou alors dans des fichiers dédiés)
- `sites/<name>/content.js` ne fait que :
  - déclarer les sélecteurs et heuristiques,
  - appeler les helpers du core,
  - exposer un `processPage()` local.

### 5.2 Adapter les hooks SPA par site

- Twitter/X : navigation via History API + DOM rerenders fréquents → MutationObserver indispensable
- TikTok : beaucoup de virtualisation + route changes → observer + timers/heuristiques (avec debounce)

Le pattern “wrap history + popstate + observer” reste le socle ; vous ajoutez des événements custom seulement si utiles.

### 5.3 Garder les permissions minimales

Recommandation :
- `permissions`: `["storage"]` uniquement tant que possible
- pas de `tabs`, pas de `webRequest`, etc. sauf besoin réel

### 5.4 Validation manuelle (à noter dans le nouveau projet)

- Vérifier au minimum : page d’accueil, page “watch”, recherche, navigation interne (SPA)
- Tester light/dark
- Tester activer/désactiver chaque toggle sans reload
- Tester mobile (`m.`) si applicable (YouTube a des sélecteurs `ytm-*` par ex.)

---

## 6) Notes Safari/Xcode (conteneur + préférences)

Le modèle Xcode multi-plateformes est standard :
- l’app conteneur sert surtout à guider l’utilisateur vers l’activation de l’extension
- sur macOS : `SFSafariApplication.showPreferencesForExtension(...)` (voir `Shared (App)/ViewController.swift`)

À garder en tête lors d’un fork :
- mettre à jour `extensionBundleIdentifier` dans `Shared (App)/ViewController.swift`
- aligner avec les identifiants de bundle dans Xcode

---

## 7) “Prompt” court à donner à un agent IA (nouveau projet)

Contraintes non négociables :
- UI de popup identique au template : même structure (`.popup-container`, `.header`, `.toggles`, `.footer`) et mêmes tokens CSS (variables `:root`, dark mode via `prefers-color-scheme`, largeur 420/520, radius 12, switch 44×24).
- Storage : fallback `sync → local` + defaults robustes, aucune exception non gérée.
- Content script : `document_start` + CSS critique + `MutationObserver` + hooks SPA + `processPage()` idempotent.
- Maintenance : sélecteurs isolés par site/feature, et restaurations via `data-*` + `restoreElements`.

