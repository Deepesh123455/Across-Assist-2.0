import { NextFunction, Request, Response } from 'express';
import { ChatRole } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { groqService, isBlockedMessage, BLOCKED_RESPONSE } from '../services/groqService';

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { sessionToken, message } = req.body;

    if (!sessionToken || !message) {
      res.status(400).json({ success: false, error: 'sessionToken and message are required' });
      return;
    }
    const trimmed = String(message).trim();
    if (!trimmed) {
      res.status(400).json({ success: false, error: 'sessionToken and message are required' });
      return;
    }
    if (trimmed.length > 2000) {
      res.status(400).json({ success: false, error: 'Message too long. Please keep it under 2000 characters.' });
      return;
    }

    const session = await prisma.session.findUnique({ where: { sessionToken } });
    if (!session) {
      res.status(404).json({ success: false, error: 'Session not found. Please refresh and try again.' });
      return;
    }

    // Fetch existing history — provides nextIndex and Groq context in one query
    const existingMessages = await prisma.chatMessage.findMany({
      where: { sessionId: session.id },
      orderBy: { messageIndex: 'asc' },
    });
    const nextIndex =
      existingMessages.length > 0
        ? (existingMessages[existingMessages.length - 1].messageIndex ?? 0) + 1
        : 1;

    if (isBlockedMessage(trimmed)) {
      await prisma.chatMessage.createMany({
        data: [
          { sessionId: session.id, role: ChatRole.USER, content: trimmed, messageIndex: nextIndex },
          {
            sessionId: session.id,
            role: ChatRole.ASSISTANT,
            content: BLOCKED_RESPONSE,
            messageIndex: nextIndex + 1,
          },
        ],
      });
      res.json({ success: true, data: { message: BLOCKED_RESPONSE, messageIndex: nextIndex + 1 } });
      return;
    }

    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: ChatRole.USER,
        content: trimmed,
        messageIndex: nextIndex,
      },
    });

    const formData = session.formData as Record<string, unknown> | null;
    const recommendation = await prisma.recommendation.findUnique({
      where: { sessionId: session.id },
      select: { bundleName: true },
    });

    const sessionContext = {
      partnerType: (formData?.clientType ?? formData?.partnerType) as string | null | undefined,
      products: (formData?.gadgetCategories ?? formData?.products) as string[] | undefined,
      volume: (formData?.monthlyVolume ?? formData?.volume) as string | null | undefined,
      goal: (formData?.primaryGoal ?? formData?.goal) as string | null | undefined,
      distribution: (formData?.distributionModel ?? formData?.distribution) as string | null | undefined,
      recommendedBundle: recommendation?.bundleName ?? null,
      segment: (formData?.segment) as string | null | undefined,
    };

    // Last 20 messages for Groq context (excludes the user message just saved)
    const history = existingMessages.slice(-20).map((m) => ({
      role: m.role === ChatRole.USER ? ('user' as const) : ('assistant' as const),
      content: m.content,
    }));

    const groqResponse = await groqService.generateChatResponse(history, trimmed, sessionContext);

    const assistantIndex = nextIndex + 1;
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: ChatRole.ASSISTANT,
        content: groqResponse.content,
        messageIndex: assistantIndex,
        tokensUsed: groqResponse.tokensUsed,
        modelUsed: groqResponse.modelUsed,
        responseMs: groqResponse.responseMs,
      },
    });

    // Touch session to reset @updatedAt — active chat should not be flagged as abandoned
    await prisma.session.update({
      where: { id: session.id },
      data: { status: session.status },
    });

    res.json({
      success: true,
      data: {
        message: groqResponse.content,
        messageIndex: assistantIndex,
        tokensUsed: groqResponse.tokensUsed,
        modelUsed: groqResponse.modelUsed,
        responseMs: groqResponse.responseMs,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { sessionToken } = req.params;

    const session = await prisma.session.findUnique({ where: { sessionToken } });
    if (!session) {
      res.status(404).json({ success: false, error: 'Session not found' });
      return;
    }

    const messages = await prisma.chatMessage.findMany({
      where: { sessionId: session.id },
      orderBy: { messageIndex: 'asc' },
      select: {
        id: true,
        role: true,
        content: true,
        messageIndex: true,
        tokensUsed: true,
        modelUsed: true,
        responseMs: true,
        isError: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      data: {
        sessionToken,
        messages: messages.map((m) => ({
          id: m.id,
          role: m.role.toLowerCase() as 'user' | 'assistant',
          content: m.content,
          messageIndex: m.messageIndex,
          isError: m.isError,
          createdAt: m.createdAt,
          ts: new Date(m.createdAt).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        })),
        count: messages.length,
      },
    });
  } catch (error) {
    next(error);
  }
};
