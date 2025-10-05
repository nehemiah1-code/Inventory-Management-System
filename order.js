import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { addOrder,  getOrder } from '../controllers/orderController.js';

const router = express.Router();

router.post('/add',authMiddleware, addOrder);
router.get('/',authMiddleware, getOrder);
// router.put('/:id',authMiddleware, updateOrder);
// router.delete('/:id',authMiddleware, deleteOrder);

export default router;