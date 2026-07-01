import { Router } from 'express';
import MessageController from '../controllers/message.controller';

const router = Router();

console.log("the route to get messages has been hit");
router.get('/:roomId', MessageController.getMessages);
router.post('/', MessageController.createMessage);

export default router;
