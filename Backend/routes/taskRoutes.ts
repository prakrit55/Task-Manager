import express from 'express';
import { protect, adminonly } from '../middleware/authMiddleware';
import { createTasks, deleteTask, getDashboardData, getTasks, getTasksById, getUserDashboardData, updateTask, updateTaskChecklists, updateTaskStatus } from '../controllers/taskController';

const router = express.Router();


router.get('/dashboard-data', protect, getDashboardData);
router.get('/user-dashboard-data/:id', protect, getUserDashboardData);
router.get('/', protect, getTasks);
router.get('/:id', protect, getTasksById);
router.post('/', protect, adminonly, createTasks);
router.put('/:id', protect, updateTask)
router.delete('/:id', protect, adminonly, deleteTask);
router.put('/:id/status', protect, updateTaskStatus);
router.put('/:id/todo', protect, updateTaskChecklists)

export default router;

