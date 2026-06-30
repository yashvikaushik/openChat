import { Router } from 'express';
import MessageController from '../controllers/message.controller';

const router = Router();

router.get('/:roomId', MessageController.getMessages);
router.post('/', MessageController.createMessage);

export default router;
