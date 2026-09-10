import { Request, Response, NextFunction } from 'express';
import { ChatSession } from '../models/KnowledgeAndChat';
import { AiRagService } from '../services/aiRagService';
import { chatMessageSchema } from '../utils/validators';
import { AppError } from '../middleware/errorHandler';
import crypto from 'crypto';

export class ChatController {
  /**
   * Start or retrieve a chat session
   */
  public static async initSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const existingSessionId = req.body.sessionId;
      let session;

      if (existingSessionId) {
        session = await ChatSession.findOne({ sessionId: existingSessionId });
      }

      if (!session) {
        const newSessionId = `ses_${crypto.randomUUID()}`;
        session = await ChatSession.create({
          sessionId: newSessionId,
          visitorInfo: {
            ip: req.ip,
            userAgent: req.headers['user-agent'] || ''
          },
          messages: [
            {
              role: 'assistant',
              content:
                "Welcome to SoloNomous Labs. I am Solo, your engineering and architecture assistant. How can we help turn your technology vision into a high-performance production reality?",
              citations: [],
              createdAt: new Date()
            }
          ]
        });
      }

      res.json({
        success: true,
        data: {
          sessionId: session.sessionId,
          messages: session.messages
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Send message, run RAG retrieval, generate AI response
   */
  public static async sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = chatMessageSchema.parse(req.body);
      const { sessionId, message, visitorInfo } = validated;

      let session = await ChatSession.findOne({ sessionId });
      if (!session) {
        session = await ChatSession.create({
          sessionId,
          visitorInfo: {
            ...visitorInfo,
            ip: req.ip,
            userAgent: req.headers['user-agent'] || ''
          },
          messages: []
        });
      }

      // Record user message
      session.messages.push({
        role: 'user',
        content: message,
        createdAt: new Date()
      });

      // Prepare conversation history
      const history = session.messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content
      }));

      // Generate RAG response
      const result = await AiRagService.generateResponse(message, history);

      // Record assistant response
      session.messages.push({
        role: 'assistant',
        content: result.reply,
        citations: result.citations,
        intentDetected: result.intentDetected,
        createdAt: new Date()
      });

      await session.save();

      res.json({
        success: true,
        data: {
          reply: result.reply,
          citations: result.citations,
          intentDetected: result.intentDetected,
          leadPromptSuggested: result.leadPromptSuggested,
          suggestedAction: result.suggestedAction
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Stream response via Server-Sent Events (SSE)
   */
  public static async streamMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    const sessionId = (req.body?.sessionId || req.query?.sessionId) as string;
    const message = (req.body?.message || req.query?.message) as string;

    if (!sessionId || !message) {
      res.status(400).json({ success: false, message: 'sessionId and message are required' });
      return;
    }

    // Set SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no'
    });
    res.flushHeaders?.();

    const sendEvent = (data: any) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    let isClosed = false;
    req.on('close', () => {
      isClosed = true;
    });

    try {
      let session = await ChatSession.findOne({ sessionId });
      if (!session) {
        session = await ChatSession.create({
          sessionId,
          visitorInfo: {
            ip: req.ip,
            userAgent: req.headers['user-agent'] || ''
          },
          messages: []
        });
      }

      // Record user message
      session.messages.push({
        role: 'user',
        content: message,
        createdAt: new Date()
      });

      // Prepare conversation history
      const history = session.messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content
      }));

      // Stream generation from AiRagService
      await AiRagService.streamResponse(
        message,
        history,
        (event) => {
          if (!isClosed) {
            sendEvent(event);
          }
        },
        async (finalResult) => {
          session.messages.push({
            role: 'assistant',
            content: finalResult.reply,
            citations: finalResult.citations,
            intentDetected: finalResult.intentDetected,
            createdAt: new Date()
          });
          await session.save();
        }
      );

      if (!isClosed) {
        res.end();
      }
    } catch (error: any) {
      if (!isClosed) {
        sendEvent({ type: 'error', error: error?.message || 'Streaming failure' });
        res.end();
      }
    }
  }

  /**
   * Escalate chat session to a qualified Lead
   */
  public static async escalateToLead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId, fullName, email, phone, company, summary } = req.body;
      if (!email || !fullName) {
        throw new AppError('Full name and email are required for project consultation', 400);
      }

      const lead = await AiRagService.captureChatLead({
        fullName,
        email,
        phone,
        company,
        summary: summary || 'Escalated from Ask Solo AI Chat Assistant',
        source: 'ai_chatbot_ask_solo'
      });

      const session = await ChatSession.findOne({ sessionId });
      if (session) {
        session.leadCaptured = lead._id as any;
        session.status = 'escalated_to_lead';
        session.messages.push({
          role: 'assistant',
          content: `Thank you, ${fullName}! Your consultation request has been forwarded to our lead engineering architect. We will review your inquiry and follow up shortly at ${email}.`,
          createdAt: new Date()
        });
        await session.save();
      }

      res.status(201).json({
        success: true,
        message: 'Lead inquiry registered successfully. An engineer will reach out.',
        data: { leadId: lead._id }
      });
    } catch (error) {
      next(error);
    }
  }
}
