import { Router } from 'express';
import * as workerController from '../controllers/workerController.js';
import { authGuard } from '../middleware/authGuard.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { validate } from '../middleware/validate.js';
import { createProfileSchema, updateProfileSchema } from '../validators/workerValidator.js';

const router = Router();

router.post('/profile', authGuard, roleGuard('WORKER'), validate(createProfileSchema), workerController.createProfile);
router.get('/profile', authGuard, roleGuard('WORKER'), workerController.getProfile);
router.put('/profile', authGuard, roleGuard('WORKER'), validate(updateProfileSchema), workerController.updateProfile);
router.get('/stats', authGuard, roleGuard('WORKER'), workerController.getWorkerStats);
router.get('/applications/recent', authGuard, roleGuard('WORKER'), workerController.getRecentWorkerApplications);

export default router;
