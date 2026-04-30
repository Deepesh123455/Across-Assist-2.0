import { Router } from 'express';
import { generate, submitFeedback } from '../controllers/recommendationController';

export const recommendationRouter = Router();

recommendationRouter.post('/generate', generate);
recommendationRouter.post('/feedback', submitFeedback);
