import { Router } from 'express';
import * as applicationController from '../controllers/applicationController.js';
import { authGuard } from '../middleware/authGuard.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { validate } from '../middleware/validate.js';
import { applyToJobSchema } from '../validators/applicationValidator.js';

const router = Router();

router.post('/jobs/:id/apply', authGuard, roleGuard('WORKER'), validate(applyToJobSchema), applicationController.applyToJob);
router.get('/worker/applications', authGuard, roleGuard('WORKER'), applicationController.getWorkerApplications);

router.get('/jobs/:id/applications', authGuard, roleGuard('EMPLOYER'), applicationController.getJobApplications);
router.put('/applications/:id/shortlist', authGuard, roleGuard('EMPLOYER'), applicationController.shortlistApplication);
router.put('/applications/:id/reject', authGuard, roleGuard('EMPLOYER'), applicationController.rejectApplication);

export default router;
