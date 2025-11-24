import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const qaSchema = new Schema({
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true }
}, { _id: false });

// Individual track report schema
const trackReportSchema = new Schema({
    track: {
        type: String,
        required: true,
        enum: [
            'SOFTWARE',
            'DIGITAL MARKETING',
            'AI & DATA SCIENCE',
            'DATA ANALYTICS',
            'SECURITY',
            'APPLIED TECHNOLOGIES'
        ]
    },
    questionsAndAnswers: { type: [qaSchema], required: true },
    weekNumber: { type: Number, required: true, min: 1, max: 14 },
    submittedAt: { type: Date, default: Date.now },

});

// Weekly report schema that aggregates all track reports for a specific week
const weeklyReportSchema = new Schema({
    weekNumber: { type: Number, required: true, min: 1, max: 14 },
    year: { type: Number, required: true, default: () => new Date().getFullYear() },
    trackReports: [{ type: Schema.Types.ObjectId, ref: 'TrackReport' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Add compound index for efficient querying
weeklyReportSchema.index({ weekNumber: 1, year: 1 }, { unique: true });
trackReportSchema.index({ track: 1, weekNumber: 1 }, { unique: true });

const TrackReport = model('TrackReport', trackReportSchema);
const WeeklyReport = model('WeeklyReport', weeklyReportSchema);

export { TrackReport, WeeklyReport };
export default TrackReport;
