import express from 'express';
import { adminonly, protect } from '../middleware/authMiddleware';
import { getUserById, getUsers } from '../controllers/userController';

const router = express.Router()

router.get('/', protect, adminonly, getUsers);
router.get('/:id', protect, getUserById)
// router.get('/:id', protect,)
// router.get('/:id', protect,)

export default router;