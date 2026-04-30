import { Router } from 'express';
import { getBundleBySlug, getBundles } from '../controllers/bundleController';

export const bundleRouter = Router();

bundleRouter.get('/', getBundles);
bundleRouter.get('/:slug', getBundleBySlug);
