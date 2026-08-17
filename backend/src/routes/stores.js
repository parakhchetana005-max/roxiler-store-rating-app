import express from 'express';
import { body, param, query } from 'express-validator';
import {
  listStoresCtrl,
  submitRatingCtrl,
  updateRatingCtrl,
} from '../controllers/storeController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Public list – optional auth to include myRating
router.get(
  '/',
  (req, res, next) => {
    // Optional auth: attach user if cookie present, else continue
    authenticate(req, res, (err) => {
      if (err) { req.user = null; }
      next();
    });
  },
  listStoresCtrl
);

// Rating routes – require auth
router.post(
  '/:id/ratings',
  authenticate,
  authorize('user'),
  [
    param('id').isUUID().withMessage('Invalid store ID'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  ],
  validate,
  submitRatingCtrl
);

router.put(
  '/:id/ratings',
  authenticate,
  authorize('user'),
  [
    param('id').isUUID().withMessage('Invalid store ID'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  ],
  validate,
  updateRatingCtrl
);

export default router;
