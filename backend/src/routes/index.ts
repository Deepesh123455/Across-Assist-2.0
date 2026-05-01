import { Router } from 'express';
import { authRouter } from './auth.routes';
import { userRouter } from './user.routes';
import { clientRouter } from './clients.routes';
import { productRouter } from './products.routes';
import { bundleRouter } from './bundles.routes';
import { recommendationRouter } from './recommendations.routes';
import { chatRouter } from './chat.routes';
import sessionRouter from './sessionRoutes';
import { trackingRouter } from './tracking.routes';
import { onboardingRouter } from './onboarding.routes';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/clients', clientRouter);
apiRouter.use('/products', productRouter);
apiRouter.use('/bundles', bundleRouter);
apiRouter.use('/recommendations', recommendationRouter);
apiRouter.use('/chat', chatRouter);
apiRouter.use('/sessions', sessionRouter);
apiRouter.use('/track', trackingRouter);
apiRouter.use('/onboarding', onboardingRouter);
