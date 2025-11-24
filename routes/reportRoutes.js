import express from 'express';
import {
    createOrUpdateTrackReport,
    getWeeklyReports,
    getTrackReport,
    getTrackReportsByWeek,
    getTrackReportsByTrack,
    getAllTrackReports,
    deleteTrackReport,
    getWeeklyReportStats
} from '../controllers/reporterController.js';

const reportRouter = express.Router();
// Track Report Routes
// Create or update a track report for a specific week
reportRouter.post('/track', createOrUpdateTrackReport);

// Get all track reports
reportRouter.get('/track', getAllTrackReports);

// Get all track reports by week (must come before /track/:track/:weekNumber)
reportRouter.get('/track/week/:weekNumber', getTrackReportsByWeek);

// Get all track reports by track (must come before /track/:track/:weekNumber)
reportRouter.get('/track/track/:track', getTrackReportsByTrack);

// Get specific track report by track and week
// URL encode track names with spaces (e.g., "DIGITAL MARKETING" becomes "DIGITAL%20MARKETING")
reportRouter.get('/track/:track/:weekNumber', getTrackReport);

// Delete track report
reportRouter.delete('/track/:trackReportId', deleteTrackReport);

// Weekly Report Routes
// Get all track reports for a specific week
reportRouter.get('/weekly/:weekNumber', getWeeklyReports);

// Get weekly report statistics
reportRouter.get('/weekly/:weekNumber/stats', getWeeklyReportStats);

export default reportRouter;
