import express from 'express';
import {
  MOCK_MEDICINES,
  MOCK_PHARMACIES,
  MOCK_INVENTORY,
  MOCK_ORDERS,
  MOCK_FEEDBACKS,
  MOCK_AUDIT_LOGS,
  MOCK_VERIFICATION_APPLICATIONS,
  MOCK_CUSTOMER_PROFILE,
  MOCK_PHARMACY_STAFF,
} from '../data/mockData.js';

const router = express.Router();

/**
 * GET /api/seed
 * Returns all initial mock data in a single payload for fast frontend bootstrap.
 */
router.get('/', (_req, res) => {
  res.json({
    medicines: MOCK_MEDICINES,
    pharmacies: MOCK_PHARMACIES,
    inventory: MOCK_INVENTORY,
    orders: MOCK_ORDERS,
    feedbacks: MOCK_FEEDBACKS,
    auditLogs: MOCK_AUDIT_LOGS,
    verificationApps: MOCK_VERIFICATION_APPLICATIONS,
    customerProfile: MOCK_CUSTOMER_PROFILE,
    pharmacyStaff: MOCK_PHARMACY_STAFF,
  });
});

export default router;
