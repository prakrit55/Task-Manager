import express from 'express';
import { protect, adminonly } from '../middleware/authMiddleware';
import { exportTasksReport, usersReport } from '../controllers/reportsController';

const router = express.Router();

router.get('/export/tasks', protect, adminonly, exportTasksReport);
router.get('/export/users', protect, adminonly, usersReport);

export default router;