import { Router } from 'express';
import { getClientBySlug, getClients } from '../controllers/clientController';

export const clientRouter = Router();

clientRouter.get('/', getClients);
clientRouter.get('/:slug', getClientBySlug);
