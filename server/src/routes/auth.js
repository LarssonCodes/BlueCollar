import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema, updatePasswordSchema, googleAuthSchema, updateRoleSchema, linkedinAuthSchema } from '../validators/authValidator.js';
import { authGuard } from '../middleware/authGuard.js';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/google', validate(googleAuthSchema), authController.googleAuth);
router.post('/linkedin', validate(linkedinAuthSchema), authController.linkedinAuth);
router.get('/me', authGuard, authController.me);
router.put('/password', authGuard, validate(updatePasswordSchema), authController.updatePassword);
router.put('/role', authGuard, validate(updateRoleSchema), authController.updateRole);

export default router;
