import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IKnowledgeDocument extends Document {
  title: string;
  category: 'company' | 'services' | 'pricing' | 'tech_stack' | 'case_studies' | 'policies' | 'faqs' | 'recommendations';
  content: string;
  chunkSummary: string;
  tags: string[];
  sourceUrl?: string;
  version: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const KnowledgeDocumentSchema = new Schema<IKnowledgeDocument>(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['company', 'services', 'pricing', 'tech_stack', 'case_studies', 'policies', 'faqs', 'recommendations'],
      required: true,
      index: true
    },
    content: { type: String, required: true },
    chunkSummary: { type: String, required: true },
    tags: [{ type: String, trim: true }],
    sourceUrl: { type: String, default: '' },
    version: { type: Number, default: 1 },
    active: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

// Search index for RAG knowledge retrieval
KnowledgeDocumentSchema.index({ title: 'text', content: 'text', tags: 'text' });

export const KnowledgeDocument = mongoose.model<IKnowledgeDocument>('KnowledgeDocument', KnowledgeDocumentSchema);

export interface IChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  citations?: Array<{
    title: string;
    category: string;
    sourceUrl?: string;
  }>;
  intentDetected?: string;
  createdAt: Date;
}

export interface IChatSession extends Document {
  sessionId: string;
  visitorInfo?: {
    ip?: string;
    userAgent?: string;
    name?: string;
    email?: string;
    phone?: string;
  };
  messages: IChatMessage[];
  leadCaptured?: Types.ObjectId;
  status: 'active' | 'escalated_to_lead' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    citations: [
      {
        title: { type: String },
        category: { type: String },
        sourceUrl: { type: String }
      }
    ],
    intentDetected: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const ChatSessionSchema = new Schema<IChatSession>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    visitorInfo: {
      ip: { type: String, default: '' },
      userAgent: { type: String, default: '' },
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' }
    },
    messages: [ChatMessageSchema],
    leadCaptured: { type: Schema.Types.ObjectId, ref: 'Lead' },
    status: {
      type: String,
      enum: ['active', 'escalated_to_lead', 'closed'],
      default: 'active'
    }
  },
  { timestamps: true }
);

export const ChatSession = mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);
