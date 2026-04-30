import { Router } from 'express';
import { sessionController } from '../controllers/sessionController';

const router = Router();

router.post('/start', sessionController.startSession);
router.patch('/:token/step', sessionController.updateSessionStep);
router.patch('/:token/email', sessionController.captureEmail);
router.post('/mark-inactive', sessionController.markInactive);
router.get('/resume/:resumeToken', sessionController.resumeSession);

export default router;
