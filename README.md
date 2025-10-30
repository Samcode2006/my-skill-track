# AI Skill Tracker (Front-end)

This is a small React + Vite front-end for tracking practice time per skill with a local "AI-like" summarizer (client-side heuristics only).

Quick start

1. Install dependencies

```pwsh
npm install
```

2. Run dev server

```pwsh
npm run dev
# open http://localhost:5174
```

3. Build for production

```pwsh
npm run build
```

How to publish to GitHub / Vercel / Netlify

- Push this repo to GitHub, then connect to Vercel or Netlify for automatic deploys. Vercel will typically auto-detect Vite and use:

	- Build command: `npm run build`
	- Output directory: `dist`

- Or use Surge for a one-off deploy:

```pwsh
npm run build
# if you have surge installed
surge ./dist
```

One-line to create local git repo and commit (run in project root):

```pwsh
git init
git add .
git commit -m "Initial commit: AI Skill Tracker"
```

To push to a new GitHub repo (after creating the repo on github.com):

```pwsh
git remote add origin https://github.com/<your-username>/<repo-name>.git
git branch -M main
git push -u origin main
```

If you use the GitHub CLI (gh) you can create the repo and push with:

```pwsh
gh repo create <repo-name> --public --source=. --remote=origin --push
```

Notes
- Data persists in localStorage under the key `ai-skill-tracker-logs-v1`.
- The "AI summary" is generated client-side with simple heuristics — no external AI calls.

If you want, I can push this project to a GitHub repo for you — I can't create the remote repo without your GitHub credentials, but I can prepare everything locally and give you the single command to run to publish.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
