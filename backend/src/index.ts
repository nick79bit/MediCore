import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import seedRouter from './routes/seed.js';
import medicinesRouter from './routes/medicines.js';
import pharmaciesRouter from './routes/pharmacies.js';
import inventoryRouter from './routes/inventory.js';
import ordersRouter from './routes/orders.js';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || [
    'http://localhost:3000', // Vite dev server
    'http://localhost:4173', // Vite preview
  ],
  credentials: true,
}));

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'MediCore Backend', timestamp: new Date().toISOString() });
});

// ── API Routes ─────────────────────────────────────────────────────────────────
app.use('/api/seed',       seedRouter);
app.use('/api/medicines',  medicinesRouter);
app.use('/api/pharmacies', pharmaciesRouter);
app.use('/api/inventory',  inventoryRouter);
app.use('/api/orders',     ordersRouter);

// ── 404 catch-all ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Start ──────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  MediCore Backend running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   Seed:   http://localhost:${PORT}/api/seed`);
});

export default app;
