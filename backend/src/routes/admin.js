import express from 'express';
import { body, query } from 'express-validator';
import {
  dashboardCtrl,
  createUserCtrl,
  createStoreCtrl,
  listUsersCtrl,
  listStoresCtrl,
  userDetailCtrl,
} from '../controllers/adminController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate, authorize('admin'));

router.get('/dashboard', dashboardCtrl);

router.post(
  '/users',
  [
    body('name').isLength({ min: 20, max: 60 }).withMessage('Name must be 20-60 characters'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password')
      .isLength({ min: 8, max: 16 }).withMessage('Password must be 8-16 characters')
      .matches(/[A-Z]/).withMessage('Password must have an uppercase letter')
      .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/).withMessage('Password must have a special character'),
    body('address').optional({ nullable: true }).isLength({ max: 400 }).withMessage('Address max 400 chars'),
    body('role').optional().isIn(['admin', 'user', 'owner']).withMessage('Role must be admin, user, or owner'),
  ],
  validate,
  createUserCtrl
);

router.post(
  '/stores',
  [
    body('name').notEmpty().withMessage('Store name required'),
    body('email').isEmail().withMessage('Valid store email required'),
    body('address').notEmpty().isLength({ max: 400 }).withMessage('Address required (max 400 chars)'),
    body('owner_id').isUUID().withMessage('owner_id must be a valid UUID'),
  ],
  validate,
  createStoreCtrl
);

router.get(
  '/users',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1 }).toInt(),
  ],
  validate,
  listUsersCtrl
);

router.get(
  '/stores',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1 }).toInt(),
  ],
  validate,
  listStoresCtrl
);

router.get('/users/:id', userDetailCtrl);

export default router;
