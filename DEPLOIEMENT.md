# ImmoBénin — Guide de déploiement Vercel

## Étape 1 — Créer un compte GitHub (si vous n'en avez pas)
Allez sur https://github.com → Sign up → créez un compte gratuit.

## Étape 2 — Créer un nouveau repository
1. Cliquez sur le bouton **+** en haut à droite → **New repository**
2. Nom : `immobenin`
3. Laissez "Public" sélectionné
4. NE cochez PAS "Add a README" (nous en avons déjà un)
5. Cliquez **Create repository**

## Étape 3 — Uploader les fichiers
Sur la page de votre nouveau repository vide, GitHub propose un lien
**"uploading an existing file"** — cliquez-le.

Glissez-déposez TOUS les fichiers et dossiers de ce projet :
- `public/index.html`
- `src/App.js`
- `src/index.js`
- `package.json`

Puis cliquez **Commit changes** en bas de la page.

## Étape 4 — Connecter Vercel
1. Allez sur https://vercel.com → **Sign up** → choisissez **"Continue with GitHub"**
2. Une fois connecté, cliquez **Add New... → Project**
3. Vercel affiche la liste de vos repositories GitHub → trouvez `immobenin` → cliquez **Import**
4. Vercel détecte automatiquement que c'est un projet "Create React App" — ne changez rien
5. Cliquez **Deploy**

## Étape 5 — Attendre ~1-2 minutes
Vercel installe les dépendances et construit votre site. Une fois terminé,
vous obtenez une URL publique du type :

```
https://immobenin-xxxx.vercel.app
```

## Étape 6 — Tester
Ouvrez cette URL — vous devriez voir la bannière verte
"✅ Supabase connecté" et vos annonces réelles.

---

## Mises à jour futures
Chaque fois que vous modifiez un fichier sur GitHub (via "Edit" directement
dans l'interface GitHub, ou en re-uploadant), Vercel redéploie
AUTOMATIQUEMENT votre site en quelques secondes. Pas besoin de refaire
les étapes Vercel.

## Domaine personnalisé (optionnel, plus tard)
Dans Vercel → votre projet → **Settings → Domains**, vous pourrez brancher
un nom de domaine comme `immobenin.bj` si vous en achetez un.
