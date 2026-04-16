# AlignUI — Design-to-Code Sync Engine

AlignUI detects UI inconsistencies (design drift) between Figma designs and your React/Tailwind codebase, surfacing mismatches directly inside VS Code.

---

## How It Works

```
Figma Plugin → exports design tokens (JSON)
     ↓
Backend API → stores tokens, runs AST analysis
     ↓
VS Code Extension → shows drift warnings inline
```

---

## Monorepo Structure

```
AlignUI/
├── figma-plugin/       Figma plugin — extracts design tokens
├── backend/            Node.js + Express API — stores tokens, runs diff engine
├── vscode-extension/   VS Code extension — displays drift issues inline
└── shared/             Shared TypeScript types (DesignToken, DriftIssue)
```

---

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Figma desktop app
- VS Code

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the backend

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/alignui
API_KEY=your-secret-api-key-here
```

### 3. Start the backend

```bash
npm run start --workspace=backend
```

Backend runs on `http://localhost:3000`.

---

## Figma Plugin

### Build

```bash
npm run build --workspace=figma-plugin
```

### Load in Figma

1. Open Figma desktop app
2. Go to **Plugins → Development → Import plugin from manifest**
3. Select `figma-plugin/manifest.json`
4. Open any file, select elements, run **AlignUI**
5. Enter your API key and click **Export Tokens**

---

## VS Code Extension

### Build & Package

```bash
npm run package --workspace=vscode-extension
```

This generates `alignui-0.1.0.vsix`.

### Install

1. Open VS Code
2. Go to **Extensions → ⋯ → Install from VSIX**
3. Select the generated `.vsix` file

### Configure

In VS Code settings (`Cmd+,`), search for **AlignUI**:

| Setting | Description | Default |
|---|---|---|
| `alignui.backendUrl` | Backend URL | `http://localhost:3000` |
| `alignui.apiKey` | API key (must match `API_KEY` in `.env`) | _(empty)_ |

### Usage

- Save any `.tsx` or `.jsx` file — analysis runs automatically
- Or run the command: **AlignUI: Analyze Current File for Drift**
- Drift issues appear as yellow warnings in the Problems panel

---

## API Reference

All endpoints require the `x-api-key` header.

### `POST /api/tokens`
Store design tokens exported from Figma.

```json
{
  "tokens": [
    { "name": "Button/color", "type": "color", "value": "#18a0fb", "source": "figma" }
  ]
}
```

### `GET /api/tokens`
Retrieve all stored tokens.

### `POST /api/analyze`
Analyze a React component file for drift.

```json
{
  "code": "<file contents>",
  "filePath": "src/components/Button.tsx"
}
```

**Response:**
```json
{
  "issues": [
    {
      "tokenName": "Button/color",
      "expected": "#18a0fb",
      "actual": "bg-blue-400",
      "file": "src/components/Button.tsx",
      "line": 12
    }
  ],
  "scanned": 8
}
```

### `GET /health`
Health check — no auth required.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Figma Plugin | Figma Plugin API + TypeScript + esbuild |
| Backend | Node.js + Express + Zod + Mongoose |
| Code Analysis | @babel/parser + @babel/traverse |
| Editor Integration | VS Code Extension API |
| Database | MongoDB |
| Shared Types | TypeScript workspace package |
