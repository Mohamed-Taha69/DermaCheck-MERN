import { Schema, model, Document } from 'mongoose';

export interface IMedicalAdvice {
  assessment: string;
  key_features: string[];
  recommendations: string[];
}

export interface IHistory extends Document {
  user_id: string;
  image_url: string;
  diagnosis: string;
  confidence: number;
  medical_advice: IMedicalAdvice;
}

const HistorySchema = new Schema<IHistory>(
  {
    user_id:       { type: String, required: true },
    image_url:     String,
    diagnosis:     String,
    confidence:    Number,
    medical_advice: {
      assessment:      String,
      key_features:    [String],
      recommendations: [String],
    },
  },
  { timestamps: true }
);

const History = model<IHistory>('History', HistorySchema);
export default History;
