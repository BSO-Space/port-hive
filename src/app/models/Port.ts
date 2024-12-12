// src/app/models/Port.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IPort extends Document {
    port: number;
    status: string;
    purpose: string;
    addedBy: string;
}

const PortSchema = new Schema<IPort>({
    port: { type: Number, required: true, unique: true },
    status: { type: String, required: true },
    purpose: { type: String, required: true },
    addedBy: { type: String, default: 'System' },
});

const Port = mongoose.models.Port || mongoose.model<IPort>('Port', PortSchema);
export default Port;