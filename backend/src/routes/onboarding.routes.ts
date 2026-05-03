import { Router } from 'express';
import {
  getSegments,
  getQuestions,
  saveAnswer,
  getRecommendation,
  getProfileStatus,
  getAddOns,
} from '../controllers/onboardingController';
import { optionalAuthenticate } from '../middlewares/auth';

export const onboardingRouter = Router();

onboardingRouter.get('/segments',                    getSegments);
onboardingRouter.get('/questions/:segment',          getQuestions);
onboardingRouter.post('/answer',                     optionalAuthenticate, saveAnswer);
onboardingRouter.post('/recommend',                  optionalAuthenticate, getRecommendation);
onboardingRouter.get('/profile/:sessionToken',       getProfileStatus);
onboardingRouter.get('/addons/:segment',             getAddOns);
