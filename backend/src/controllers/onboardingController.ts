import { NextFunction, Request, Response } from 'express';
import { Segment, getQuestionsForSegment, SEGMENT_OPTIONS } from '../onboarding/questions';
import { onboardingService } from '../services/onboardingService';

const VALID_SEGMENTS: Segment[] = ['travel', 'gadget', 'automobile'];

// GET /onboarding/segments — returns the 3 segment options
export const getSegments = (_req: Request, res: Response, next: NextFunction): void => {
  try {
    res.json({ success: true, data: { segments: SEGMENT_OPTIONS } });
  } catch (error) {
    next(error);
  }
};

// GET /onboarding/questions/:segment — returns question set for a segment
export const getQuestions = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const segment = req.params.segment as Segment;
    if (!VALID_SEGMENTS.includes(segment)) {
      res.status(400).json({ success: false, error: `Invalid segment. Must be one of: ${VALID_SEGMENTS.join(', ')}` });
      return;
    }
    const questions = getQuestionsForSegment(segment);
    res.json({ success: true, data: { segment, questions, totalSteps: questions.length } });
  } catch (error) {
    next(error);
  }
};

// POST /onboarding/answer — saves a single question answer
export const saveAnswer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sessionToken, segment, questionId, answer } = req.body;

    if (!segment || !questionId || !answer) {
      res.status(400).json({ success: false, error: 'segment, questionId, and answer are required' });
      return;
    }
    if (!VALID_SEGMENTS.includes(segment as Segment)) {
      res.status(400).json({ success: false, error: 'Invalid segment' });
      return;
    }

    const result = await onboardingService.saveAnswer(sessionToken, segment as Segment, questionId, answer);
    // result may contain a new sessionToken if the old session was COMPLETED
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};


// POST /onboarding/recommend — runs rule engine, saves Recommendation
export const getRecommendation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sessionToken, segment } = req.body;

    if (!sessionToken || !segment) {
      res.status(400).json({ success: false, error: 'sessionToken and segment are required' });
      return;
    }
    if (!VALID_SEGMENTS.includes(segment as Segment)) {
      res.status(400).json({ success: false, error: 'Invalid segment' });
      return;
    }

    const result = await onboardingService.generateRecommendation(sessionToken, segment as Segment);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// GET /onboarding/profile/:sessionToken — returns full onboarding status
export const getProfileStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sessionToken } = req.params;
    if (!sessionToken) {
      res.status(400).json({ success: false, error: 'sessionToken is required' });
      return;
    }

    const status = await onboardingService.getProfileStatus(sessionToken);
    res.json({ success: true, data: status });
  } catch (error) {
    next(error);
  }
};

// GET /onboarding/addons/:segment — returns contextual add-ons
export const getAddOns = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const segment = req.params.segment as Segment;
    const bundleSlug = req.query.bundleSlug as string | undefined;

    if (!VALID_SEGMENTS.includes(segment)) {
      res.status(400).json({ success: false, error: 'Invalid segment' });
      return;
    }

    const addOns = await onboardingService.getAddOnsForSegment(segment, bundleSlug);
    res.json({ success: true, data: { segment, addOns } });
  } catch (error) {
    next(error);
  }
};
