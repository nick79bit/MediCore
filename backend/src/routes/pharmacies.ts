import express from 'express';
import { MOCK_PHARMACIES } from '../data/mockData.js';

const router = express.Router();

/** GET /api/pharmacies */
router.get('/', (_req, res) => {
  res.json(MOCK_PHARMACIES);
});

/** GET /api/pharmacies/:id */
router.get('/:id', (req, res) => {
  const pharmacy = MOCK_PHARMACIES.find(p => p.id === req.params.id);
  if (!pharmacy) return res.status(404).json({ error: 'Pharmacy not found' });
  return res.json(pharmacy);
});

export default router;
