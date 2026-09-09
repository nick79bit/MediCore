import express from 'express';
import { MOCK_INVENTORY } from '../data/mockData.js';

const router = express.Router();

/** GET /api/inventory */
router.get('/', (_req, res) => {
  res.json(MOCK_INVENTORY);
});

/** GET /api/inventory?pharmacyId=xxx */
router.get('/pharmacy/:pharmacyId', (req, res) => {
  const items = MOCK_INVENTORY.filter(i => i.pharmacyId === req.params.pharmacyId);
  res.json(items);
});

export default router;
