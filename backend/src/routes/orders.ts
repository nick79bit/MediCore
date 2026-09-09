import express from 'express';
import { MOCK_ORDERS } from '../data/mockData.js';
import type { OrderRequest } from '../types.js';

const router = express.Router();

// In-memory order store (initialized from mock data)
let orders: OrderRequest[] = [...MOCK_ORDERS];

/** GET /api/orders */
router.get('/', (_req, res) => {
  res.json(orders);
});

/** GET /api/orders/:id */
router.get('/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  return res.json(order);
});

/** POST /api/orders — create a new order */
router.post('/', (req, res) => {
  const body = req.body as OrderRequest;
  if (!body || !body.id) {
    return res.status(400).json({ error: 'Invalid order payload' });
  }
  orders = [body, ...orders];
  return res.status(201).json(body);
});

/** PATCH /api/orders/:id — update order status / fields */
router.patch('/:id', (req, res) => {
  const idx = orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Order not found' });
  orders[idx] = { ...orders[idx], ...req.body };
  return res.json(orders[idx]);
});

export default router;
