import {
    createOrUpdateTrackReportService,
    getWeeklyReportsService,
    getTrackReportService,
    getTrackReportsByWeekService,
    getTrackReportsByTrackService,
    getAllTrackReportsService,
    deleteTrackReportService,
    getWeeklyReportStatsService
} from '../services/reportService.js';

// Create or update a track report for a specific week
export async function createOrUpdateTrackReport(req, res) {
    try {
        const { track, weekNumber, questionsAndAnswers } = req.body;

        // Validate required fields
        if (!track || !weekNumber || !questionsAndAnswers) {
            return res.status(400).json({
                error: 'Missing required fields: track, weekNumber, questionsAndAnswers'
            });
        }

        // Validate week number
        if (weekNumber < 1 || weekNumber > 14) {
            return res.status(400).json({
                error: 'Week number must be between 1 and 14'
            });
        }

        const trackReport = await createOrUpdateTrackReportService({
            track,
            weekNumber,
            questionsAndAnswers
        });

        res.status(201).json({
            message: 'Track report created/updated successfully',
            trackReport
        });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(409).json({ error: 'Track report already exists for this track and week' });
        }
        res.status(500).json({ error: 'Failed to create/update track report' });
    }
}

// Get all track reports for a specific week
export async function getWeeklyReports(req, res) {
    try {
        const { weekNumber } = req.params;
        const { year } = req.query;

        const weeklyReport = await getWeeklyReportsService(weekNumber, year);

        if (!weeklyReport) {
            return res.status(404).json({
                message: `No reports found for week ${weekNumber}`
            });
        }

        res.status(200).json(weeklyReport);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch weekly reports' });
    }
}

// Get specific track report by track and week
export async function getTrackReport(req, res) {
    try {
        let { track, weekNumber } = req.params;

        // Decode URL-encoded track name (handles spaces and special characters)
        track = decodeURIComponent(track);

        // Convert weekNumber to integer
        const weekNum = parseInt(weekNumber, 10);

        if (isNaN(weekNum) || weekNum < 1 || weekNum > 14) {
            return res.status(400).json({
                error: 'Invalid week number. Must be between 1 and 14'
            });
        }

        const trackReport = await getTrackReportService(track, weekNum);

        if (!trackReport) {
            return res.status(404).json({
                message: 'Track report not found'
            });
        }

        res.status(200).json(trackReport);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch track report' });
    }
}

// Get all track reports by week
export async function getTrackReportsByWeek(req, res) {
    try {
        const { weekNumber } = req.params;

        const trackReports = await getTrackReportsByWeekService(weekNumber);

        res.status(200).json({
            weekNumber,
            trackReports,
            count: trackReports.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch track reports by week' });
    }
}

// Get all track reports by track
export async function getTrackReportsByTrack(req, res) {
    try {
        const { track } = req.params;
        const { weekNumber } = req.query;

        const trackReports = await getTrackReportsByTrackService(track, weekNumber);

        res.status(200).json({
            track,
            weekNumber: weekNumber || 'all',
            trackReports,
            count: trackReports.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch track reports by track' });
    }
}

// Get all track reports
export async function getAllTrackReports(req, res) {
    try {
        const trackReports = await getAllTrackReportsService();

        res.status(200).json({
            trackReports,
            count: trackReports.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch all track reports' });
    }
}

// Delete track report
export async function deleteTrackReport(req, res) {
    try {
        const { trackReportId } = req.params;

        const trackReport = await deleteTrackReportService(trackReportId);

        if (!trackReport) {
            return res.status(404).json({
                message: 'Track report not found'
            });
        }

        res.status(200).json({
            message: 'Track report deleted successfully',
            trackReport
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete track report' });
    }
}

// Get weekly report statistics
export async function getWeeklyReportStats(req, res) {
    try {
        const { weekNumber } = req.params;
        const { year } = req.query;

        const stats = await getWeeklyReportStatsService(weekNumber, year);

        res.status(200).json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch weekly report statistics' });
    }
}
