import { Router } from 'express';
import { sendMessage, getHistory } from '../controllers/chatController';

export const chatRouter = Router();

chatRouter.post('/message', sendMessage);
chatRouter.get('/:sessionToken/history', getHistory);
