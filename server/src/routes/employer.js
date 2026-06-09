import { Router } from 'express';
import * as employerController from '../controllers/employerController.js';
import { authGuard } from '../middleware/authGuard.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { validate } from '../middleware/validate.js';
import { createProfileSchema, updateProfileSchema } from '../validators/employerValidator.js';

const router = Router();

router.post('/profile', authGuard, roleGuard('EMPLOYER'), validate(createProfileSchema), employerController.createProfile);
router.get('/profile', authGuard, roleGuard('EMPLOYER'), employerController.getProfile);
router.put('/profile', authGuard, roleGuard('EMPLOYER'), validate(updateProfileSchema), employerController.updateProfile);
router.get('/stats', authGuard, roleGuard('EMPLOYER'), employerController.getEmployerStats);
router.get('/jobs/recent', authGuard, roleGuard('EMPLOYER'), employerController.getRecentEmployerJobs);

export default router;
