// src/models/sequenceModel.ts
import { Schema, model, Document } from "mongoose";

interface ISequence extends Document {
  _id: string;
  seq: number;
}

const sequenceSchema = new Schema<ISequence>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Sequence = model<ISequence>("Sequence", sequenceSchema);
export default Sequence;
