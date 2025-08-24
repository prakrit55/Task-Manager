import express from 'express';
import { Request, Response } from 'express';
import { getUserProfile, loginUser, register, updateUserProfile } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

router.post('/upload-image', upload.single('image'), (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({message: "File not found !"})
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl })
})

export default router;
