import mongoose, { Schema, Document } from 'mongoose';
import { DriftIssue } from '@alignui/shared';

export interface IssueDocument extends DriftIssue, Document {}

const IssueSchema = new Schema<IssueDocument>(
  {
    tokenName: { type: String, required: true },
    expected: { type: String, required: true },
    actual: { type: String, required: true },
    file: { type: String, required: true },
    line: { type: Number, required: true },
  },
  { timestamps: true }
);

IssueSchema.index({ file: 1, tokenName: 1 });

export const IssueModel = mongoose.model<IssueDocument>('Issue', IssueSchema);
