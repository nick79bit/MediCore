# MediCore GenericMed

> AI-powered bioequivalent generic medicine matching, transparent DPCO price comparison, and instant stock reservation at verified Nashik pharmacies.

## Project Structure

```
MediCore/
├── frontend/        # React + Vite SPA (TypeScript)
├── backend/         # Express REST API (TypeScript)
├── README.md
└── .gitignore
```

---

## Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

---

## Installation

### Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Install Backend Dependencies

```bash
cd backend
npm install
```

---

## Environment Variables

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:4000
```

### Backend (`backend/.env`)

```env
PORT=4000
# GEMINI_API_KEY=your_key_here   # Optional: for server-side AI features
# CORS_ORIGIN=https://your-domain.com  # Optional: production CORS origin
```

---

## Running the Application

### Start the Backend

```bash
cd backend
npm run dev
```

The backend starts at **http://localhost:4000**

Verify it's running:
```
GET http://localhost:4000/health
```

### Start the Frontend

In a **separate terminal**:

```bash
cd frontend
npm run dev
```

The frontend starts at **http://localhost:3000**

> The Vite dev server automatically proxies all `/api/*` requests to the backend at `localhost:4000` — no manual configuration needed.

---

## Running Both Together (Concurrently)

From the project root, you can install `concurrently` globally and run both:

```bash
npm install -g concurrently
concurrently "cd backend && npm run dev" "cd frontend && npm run dev"
```

Or add a root-level `package.json`:

```json
{
  "scripts": {
    "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm run dev\""
  }
}
```

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/api/seed` | All initial data (fast bootstrap) |
| `GET` | `/api/medicines` | All medicines |
| `GET` | `/api/medicines/:id` | Single medicine |
| `GET` | `/api/pharmacies` | All pharmacies |
| `GET` | `/api/pharmacies/:id` | Single pharmacy |
| `GET` | `/api/inventory` | All inventory items |
| `GET` | `/api/orders` | All orders |
| `POST` | `/api/orders` | Create order |
| `PATCH` | `/api/orders/:id` | Update order |

---

## Building for Production

### Build Frontend

```bash
cd frontend
npm run build
```

Output goes to `frontend/dist/`. Serve it with any static host (Vercel, Netlify, etc.).

### Build Backend

```bash
cd backend
npm run build
```

Output goes to `backend/dist/`. Start with:
```bash
node backend/dist/index.js
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite 6, Tailwind CSS v4 |
| Backend | Express 4, TypeScript, tsx |
| Styling | Tailwind CSS + custom CSS design system |
| Icons | Lucide React |
| Fonts | Inter, Outfit, JetBrains Mono (Google Fonts) |

---

*MediCore is a Nashik pilot prototype for the CDSCO/DPCO generic medicine ecosystem.*
