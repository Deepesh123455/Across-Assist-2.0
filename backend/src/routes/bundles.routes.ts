import { Router } from 'express';
import { getBundleBySlug, getBundles, getMyBundle } from '../controllers/bundleController';
import { authenticate } from '../middlewares/auth';

export const bundleRouter = Router();

bundleRouter.get('/', getBundles);
bundleRouter.get('/my-bundle', authenticate, getMyBundle);
bundleRouter.get('/:slug', getBundleBySlug);
