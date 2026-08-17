import express from 'express';
import { body } from 'express-validator';
import {
  loginCtrl,
  signupCtrl,
  meCtrl,
  updatePasswordCtrl,
  logoutCtrl,
} from '../controllers/authController.js';
import { validate } from '../middleware/validation.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

const pwdRules = (fieldName = 'password') =>
  body(fieldName)
    .isLength({ min: 8, max: 16 })
    .withMessage(`${fieldName === 'newPassword' ? 'New password' : 'Password'} must be 8-16 characters`)
    .matches(/[A-Z]/)
    .withMessage(`${fieldName === 'newPassword' ? 'New password' : 'Password'} must contain at least one uppercase letter`)
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
    .withMessage(`${fieldName === 'newPassword' ? 'New password' : 'Password'} must contain at least one special character`);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  validate,
  loginCtrl
);

router.post(
  '/signup',
  [
    body('name')
      .isLength({ min: 20, max: 60 })
      .withMessage('Name must be 20-60 characters'),
    body('email').isEmail().withMessage('Valid email required'),
    pwdRules('password'),
    body('address').optional({ nullable: true }).isLength({ max: 400 }).withMessage('Address max 400 characters'),
  ],
  validate,
  signupCtrl
);

router.get('/me', authenticate, meCtrl);

router.put(
  '/update-password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('Current password required'),
    pwdRules('newPassword'),
  ],
  validate,
  updatePasswordCtrl
);

router.post('/logout', logoutCtrl);

export default router;
