import { Router } from 'express';
import * as jobController from '../controllers/jobController.js';
import { authGuard } from '../middleware/authGuard.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { validate } from '../middleware/validate.js';
import { createJobSchema, updateJobSchema } from '../validators/jobValidator.js';

const router = Router();

router.post('/jobs', authGuard, roleGuard('EMPLOYER'), validate(createJobSchema), jobController.createJob);
router.get('/employer/jobs', authGuard, roleGuard('EMPLOYER'), jobController.getEmployerJobs);
router.get('/jobs', authGuard, jobController.getJobs);
router.get('/jobs/:id', authGuard, jobController.getJobById);
router.put('/jobs/:id', authGuard, roleGuard('EMPLOYER'), validate(updateJobSchema), jobController.updateJob);
router.put('/jobs/:id/fill', authGuard, roleGuard('EMPLOYER'), jobController.fillJob);
router.delete('/jobs/:id', authGuard, roleGuard('EMPLOYER'), jobController.deleteJob);

export default router;
