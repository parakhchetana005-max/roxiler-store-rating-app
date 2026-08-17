import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { ownerDashboardCtrl } from '../controllers/ownerController.js';

const router = express.Router();
router.use(authenticate, authorize('owner'));
router.get('/dashboard', ownerDashboardCtrl);

export default router;
