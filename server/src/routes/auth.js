import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema, updatePasswordSchema } from '../validators/authValidator.js';
import { authGuard } from '../middleware/authGuard.js';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authGuard, authController.me);
router.put('/password', authGuard, validate(updatePasswordSchema), authController.updatePassword);

export default router;
