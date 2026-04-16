import mongoose, { Schema, Document } from 'mongoose';
import { ValidatedToken } from '../validators/tokenValidator';

export interface TokenDocument extends ValidatedToken, Document {
  createdAt: Date;
  updatedAt: Date;
}

const TokenSchema = new Schema<TokenDocument>(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['color', 'spacing', 'typography', 'border-radius'],
      required: true,
    },
    value: { type: String, required: true },
    source: { type: String, enum: ['figma'], required: true },
  },
  { timestamps: true }
);

// Unique index on name — one token per name
TokenSchema.index({ name: 1 }, { unique: true });

export const TokenModel = mongoose.model<TokenDocument>('Token', TokenSchema);
