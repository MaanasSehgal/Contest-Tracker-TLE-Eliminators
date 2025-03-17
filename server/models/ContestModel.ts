import mongoose, { Schema, Document } from 'mongoose';

export interface Contest extends Document {
    contestName: string;
    platform: string;
    contestId: string;
    contestStartDate: Date;
    contestEndDate: Date;
    contestDuration: number;
    contestUrl: string;
    solutionVideoInfo?: {
        title: string;
        url: string;
        thumbnail: string;
    }
}

const ContestSchema: Schema = new Schema({
    contestId: { type: String, required: true },
    contestName: { type: String, required: true },
    platform: { type: String, required: true },
    contestStartDate: { type: Date, required: true },
    contestEndDate: { type: Date, required: true },
    contestDuration: { type: Number, required: true },
    contestUrl: { type: String, required: true },
    solutionVideoInfo: {
        title: { type: String, required: false },
        url: { type: String, required: false },
        thumbnail: { type: String, required: false }
    }
});

export default mongoose.model<Contest>('Contest', ContestSchema);
