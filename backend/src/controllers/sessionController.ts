import { Request, Response } from 'express';
import { sessionService } from '../services/sessionService';

export class SessionController {
  async startSession(req: Request, res: Response): Promise<void> {
    try {
      const ipAddress = req.headers['x-forwarded-for'] as string || req.ip;
      const userAgent = req.headers['user-agent'];

      const session = await sessionService.createSession(ipAddress, userAgent);
      res.status(201).json({ success: true, data: session });
    } catch (error) {
      console.error('Error starting session:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  async updateSessionStep(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.params;
      const { step, formData } = req.body;

      if (!token || step === undefined) {
        res.status(400).json({ success: false, error: 'Token and step are required' });
        return;
      }

      const updatedSession = await sessionService.updateStep(token, step, formData || {});
      res.status(200).json({ success: true, data: updatedSession });
    } catch (error: any) {
      console.error('Error updating session step:', error);
      if (error.message === 'Session not found') {
        res.status(404).json({ success: false, error: 'Session not found' });
        return;
      }
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  async captureEmail(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.params;
      const { email } = req.body;

      if (!token || !email) {
        res.status(400).json({ success: false, error: 'Token and email are required' });
        return;
      }

      const updatedSession = await sessionService.captureEmail(token, email);
      res.status(200).json({ success: true, data: updatedSession });
    } catch (error) {
      console.error('Error capturing email:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  async markInactive(req: Request, res: Response): Promise<void> {
    try {
      // sendBeacon may send as text/plain — handle both parsed JSON and raw string
      let token = req.body.sessionToken ?? req.body.token;

      if (!token && typeof req.body === 'string') {
        try {
          const parsed = JSON.parse(req.body);
          token = parsed.sessionToken ?? parsed.token;
        } catch {
          // ignore parse error
        }
      }

      if (!token) {
        res.status(400).json({ success: false, error: 'Token is required' });
        return;
      }

      await sessionService.markSessionInactive(token);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error marking session inactive:', error);
      res.status(200).json({ success: true }); // always 200 for beacon
    }
  }

  async resumeSession(req: Request, res: Response): Promise<void> {
    try {
      const { resumeToken } = req.params;

      if (!resumeToken) {
        res.status(400).json({ success: false, error: 'Resume token is required' });
        return;
      }

      const data = await sessionService.getSessionByResumeToken(resumeToken);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error('Error resuming session:', error);

      if (error.message === 'Resume link expired') {
        res.status(410).json({ success: false, error: 'This resume link has expired. Please start a new recommendation.' });
        return;
      }
      if (error.message === 'Invalid or expired resume token') {
        res.status(404).json({ success: false, error: 'Invalid or expired resume link' });
        return;
      }
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
}

export const sessionController = new SessionController();
