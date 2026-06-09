import { Router } from 'express';
import * as adminController from '../controllers/adminController.js';
import { authGuard } from '../middleware/authGuard.js';
import { roleGuard } from '../middleware/roleGuard.js';

const router = Router();

// Secure all admin routes
router.use(authGuard);
router.use(roleGuard('ADMIN'));

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.delete('/users/:id', adminController.deleteUser);
router.get('/jobs', adminController.getJobs);
router.delete('/jobs/:id', adminController.deleteJob);

export default router;
