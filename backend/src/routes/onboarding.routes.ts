import { Router } from 'express';
import {
  getSegments,
  getQuestions,
  saveAnswer,
  getRecommendation,
  getProfileStatus,
  getAddOns,
} from '../controllers/onboardingController';

export const onboardingRouter = Router();

onboardingRouter.get('/segments',                    getSegments);
onboardingRouter.get('/questions/:segment',          getQuestions);
onboardingRouter.post('/answer',                     saveAnswer);
onboardingRouter.post('/recommend',                  getRecommendation);
onboardingRouter.get('/profile/:sessionToken',       getProfileStatus);
onboardingRouter.get('/addons/:segment',             getAddOns);
