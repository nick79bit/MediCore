import express from 'express';
import { MOCK_MEDICINES } from '../data/mockData.js';

const router = express.Router();

/** GET /api/medicines — list all medicines */
router.get('/', (_req, res) => {
  res.json(MOCK_MEDICINES);
});

/** GET /api/medicines/:id — single medicine by ID */
router.get('/:id', (req, res) => {
  const med = MOCK_MEDICINES.find(m => m.id === req.params.id);
  if (!med) return res.status(404).json({ error: 'Medicine not found' });
  return res.json(med);
});

export default router;
