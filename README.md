# GitHub Pages Portfolio

This site lists your projects as large cards (image + name), automatically pulling public repositories from:

`https://github.com/LorenzoBerto-Eduzz`

## Files

- `index.html` - page structure
- `styles.css` - visual style
- `script.js` - loads repos from GitHub API and renders cards

## Publish as your account page

To publish as your main GitHub Pages URL (`https://LorenzoBerto-Eduzz.github.io`), use a repository named exactly:

`LorenzoBerto-Eduzz.github.io`

Then from this folder:

```powershell
git init
git add .
git commit -m "Create GitHub Pages portfolio"
git branch -M main
git remote add origin https://github.com/LorenzoBerto-Eduzz/LorenzoBerto-Eduzz.github.io.git
git push -u origin main
```

GitHub usually publishes it in under a minute.

## Add external projects (optional)

In `script.js`, edit the `EXTRA_PROJECTS` array with objects containing:

- `name`
- `description`
- `url`
- `image` (optional)
