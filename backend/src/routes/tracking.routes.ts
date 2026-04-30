import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { env } from '../config/env';

const trackingRouter = Router();

const TRANSPARENT_GIF = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64',
);

trackingRouter.get('/email-open/:abandonedEmailId', async (req: Request, res: Response) => {
  res.set('Content-Type', 'image/gif');
  res.send(TRANSPARENT_GIF);

  // Update open tracking asynchronously — don't block the GIF response
  const { abandonedEmailId } = req.params;
  prisma.abandonedSessionEmail
    .update({
      where: { id: abandonedEmailId },
      data: { openedAt: new Date() },
    })
    .then((ase) =>
      prisma.session.update({
        where: { id: ase.sessionId },
        data: { followUpOpened: true },
      }),
    )
    .catch(() => {});
});

trackingRouter.get('/email-click/:abandonedEmailId', async (req: Request, res: Response) => {
  try {
    const { abandonedEmailId } = req.params;

    const record = await prisma.abandonedSessionEmail.update({
      where: { id: abandonedEmailId },
      data: { clickedAt: new Date() },
    });

    await prisma.session.update({
      where: { id: record.sessionId },
      data: { followUpClicked: true, followUpOpened: true },
    });

    const resumeUrl = `${env.FRONTEND_URL}/resume?token=${record.resumeToken}`;
    res.redirect(302, resumeUrl);
  } catch {
    res.redirect(302, `${env.FRONTEND_URL}/advisor`);
  }
});

export { trackingRouter };
