# Skill Tracker – AI-Powered Learning Companion

A lightweight **React + Vite** front-end web app to log and track your daily practice time across multiple skills. Get instant summaries, insights, and track your progress over time with a clean, dark-themed interface.

**Live Demo**: [Deployed on Vercel](https://my-skill-track.vercel.app/)

## Features

✨ **Log Your Work**
- Enter skill name, hours worked, and optional notes
- Real-time validation and error handling
- Clean, intuitive form interface

📊 **Track Daily Progress**
- See all today's logged entries at a glance
- Instant total hours calculation
- Easy remove/delete entries
- Data persists across sessions (localStorage)

🤖 **Smart Summaries & Insights**
- Auto-generated daily summary (skill-by-skill breakdown)
- Total hours and top skill stats
- Curated insights and learning tips (deterministic, no external API calls)
- Notes snippets extracted from your entries

🎨 **Dark Theme UI**
- Modern, responsive design
- Works on desktop and mobile
- Accessible, high-contrast colors

## Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation & Development

1. Install dependencies

```pwsh
npm install
```

2. Run dev server

```pwsh
npm run dev
# Browser opens http://localhost:5174 (or 5173 if 5174 is in use)
```

3. Build for production (creates `dist/` folder)

```pwsh
npm run build
```

4. Preview production build locally

```pwsh
npm run preview
```

## Usage

1. **Log a Skill**: Fill in the form on the left — skill name, hours, and optional notes. Click "Add Log".
2. **View Today's Logs**: See entries on the right panel. Each entry shows hours worked and notes (if any).
3. **Get Insights**: The Summary panel at the bottom shows total hours, skill breakdown, and smart learning tips.
4. **Persistence**: Your data is saved in the browser's localStorage. Refresh the page and your logs stay.

### Example Workflow
- Morning: Log "React" + 2 hours + "Learned hooks and state management"
- Afternoon: Log "Prompt Engineering" + 1.5 hours + "Fine-tuned GPT prompts"
- View summary: "Worked 3.5 hours today on 2 skills. Most time on React. Tips: break sessions into 25–60 min blocks."

## Data & Storage

- **Format**: Entries stored as JSON in browser localStorage under key `ai-skill-tracker-logs-v1`
- **Scope**: Logs are filtered by date (YYYY-MM-DD), so each day has its own summary
- **No cloud sync**: This is a front-end-only app; data lives in your browser

## Deployment

### Option 1: GitHub Pages (Automatic with Actions)

This repo includes a GitHub Actions workflow (`.github/workflows/deploy-pages.yml`) that:
- Builds the app on every push to `main`
- Deploys `dist/` to GitHub Pages
- Live site: **https://samcode2006.github.io/skill-track**

Workflow runs automatically after you push. Watch progress in the **Actions** tab of the repo.

### Option 2: Vercel (Recommended for Preview Deployments)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project" → Import Git Repository → select `skill-track`
3. Vercel auto-detects Vite. Accept defaults:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Click Deploy — done! You'll get a live URL and preview on each pull request

### Option 3: Netlify

1. Go to [netlify.com](https://netlify.com) and sign in with GitHub
2. Click "New site from Git" → connect your `skill-track` repo
3. Set build command to `npm run build` and publish directory to `dist`
4. Deploy — Netlify publishes on every push

### Option 4: One-Off Static Deploy (Surge)

```pwsh
npm run build
npm install -g surge
surge ./dist
```

## Project Structure

```
my-react-app/
├── src/
│   ├── App.jsx              # Main app component
│   ├── SkillForm.jsx        # Form to add entries
│   ├── DailyLog.jsx         # Display today's logs
│   ├── Summary.jsx          # AI-like summarizer & insights
│   ├── ErrorBoundary.jsx    # Error UI component
│   ├── Header.jsx           # Top navigation
│   ├── Footer.jsx           # Footer
│   ├── index.css            # Global styles (dark theme)
│   ├── main.jsx             # React entry point
│   └── utils/
│       └── storage.js       # localStorage helpers
├── public/
│   └── vite.svg             # Project icon (favicon)
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── package.json             # Dependencies
├── .github/
│   └── workflows/
│       └── deploy-pages.yml # GitHub Actions workflow
└── README.md                # This file
```

## Technical Stack

- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.12
- **Styling**: Vanilla CSS (dark theme with CSS variables)
- **Storage**: Browser localStorage (no server needed)
- **Linting**: ESLint

## Development & Contributing

Want to improve the tracker? Here's how:

1. Fork the repo and clone locally
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Make changes, test locally
5. Push to your branch and open a pull request

### Future Ideas
- Date navigation to view past logs
- CSV/JSON export of logs
- Skill categories and filtering
- Time-series charts (visualize progress over weeks/months)
- Real LLM integration for better summaries (OpenAI, Claude, etc.)
- PWA support (offline mode, install as app)
- Dark/light theme toggle

## License & Acknowledgments

Built with [React](https://react.dev) and [Vite](https://vitejs.dev).

## Troubleshooting

**Data not persisting after refresh?**
- Check if localStorage is enabled in your browser
- Open DevTools → Application → Local Storage to inspect `ai-skill-tracker-logs-v1`

**Port 5174 already in use?**
- Vite will automatically pick a free port. Check the terminal output for the actual URL

**Entries disappear when switching days?**
- This is expected — the app filters logs by date. Come back tomorrow and add new entries

**Form validation errors?**
- Skill name required, hours must be a positive number

## Questions?

Feel free to open an issue on GitHub or reach out!

📧 Contact: samcode2006
