// src/app/models/Port.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

interface IPort extends Document {
  port: number;
  application: string;
  purpose: string;
  addedBy: string;
  status: 'active' | 'available';
}

const portSchema = new Schema<IPort>({
  port: { type: Number, required: true, unique: true }, // Enforce unique port numbers
  application: { type: String, required: true },
  purpose: { type: String, required: true },
  addedBy: { type: String, required: true },
  status: { type: String, enum: ['active', 'available'], default: 'active' },
});

const Port: Model<IPort> = mongoose.models.Port || mongoose.model<IPort>('Port', portSchema);

export default Port;
export type { IPort };