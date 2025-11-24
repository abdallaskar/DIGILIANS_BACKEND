import { TrackReport, WeeklyReport } from '../model/Report.js';

const TRACKS = [
    'SOFTWARE',
    'DIGITAL MARKETING',
    'AI & DATA SCIENCE',
    'DATA ANALYTICS',
    'SECURITY',
    'APPLIED TECHNOLOGIES'
];

// Create or update a track report for a specific week
export async function createOrUpdateTrackReportService({ track, weekNumber, questionsAndAnswers }) {
    const year = new Date().getFullYear();

    // Check if track report already exists
    let trackReport = await TrackReport.findOne({
        track,
        weekNumber
    });

    if (trackReport) {
        // Update existing report
        trackReport.questionsAndAnswers = questionsAndAnswers;
        trackReport.submittedAt = new Date();
        await trackReport.save();
    } else {
        // Create new track report
        trackReport = new TrackReport({
            track,
            weekNumber,
            questionsAndAnswers
        });
        await trackReport.save();
    }

    // Add to weekly report
    await addTrackReportToWeeklyReport(trackReport._id, weekNumber, year);

    return await TrackReport.findById(trackReport._id);
}

// Add track report to weekly report
async function addTrackReportToWeeklyReport(trackReportId, weekNumber, year) {
    let weeklyReport = await WeeklyReport.findOne({ weekNumber, year });

    if (!weeklyReport) {
        weeklyReport = new WeeklyReport({ weekNumber, year });
    }

    // Add track report if not already present
    if (!weeklyReport.trackReports.includes(trackReportId)) {
        weeklyReport.trackReports.push(trackReportId);
        await weeklyReport.save();
    }
}

// Get all track reports for a specific week
export async function getWeeklyReportsService(weekNumber, year = new Date().getFullYear()) {
    const weeklyReport = await WeeklyReport.findOne({
        weekNumber: weekNumber,
        year: year
    })
        .populate('trackReports')
        .lean();

    return weeklyReport;
}

// Get track report by track and week
export async function getTrackReportService(track, weekNumber) {
    return await TrackReport.findOne({
        track: track,
        weekNumber: weekNumber
    }).lean();
}

// Get all track reports by week
export async function getTrackReportsByWeekService(weekNumber) {
    return await TrackReport.find({ weekNumber })
        .sort({ track: 1 })
        .lean();
}

// Get all track reports by track
export async function getTrackReportsByTrackService(track, weekNumber = null) {
    const query = { track };
    if (weekNumber) {
        query.weekNumber = weekNumber;
    }

    return await TrackReport.find(query)
        .sort({ weekNumber: -1, submittedAt: -1 })
        .lean();
}

// Get all reports (all track reports)
export async function getAllTrackReportsService() {
    return await TrackReport.find()
        .sort({ weekNumber: -1, track: 1, submittedAt: -1 })
        .lean();
}

// Delete track report
export async function deleteTrackReportService(trackReportId) {
    const trackReport = await TrackReport.findById(trackReportId);
    if (!trackReport) {
        throw new Error('Track report not found');
    }

    // Remove from weekly report
    await WeeklyReport.updateMany(
        { trackReports: trackReportId },
        { $pull: { trackReports: trackReportId } }
    );

    return await TrackReport.findByIdAndDelete(trackReportId);
}

// Get weekly report statistics
export async function getWeeklyReportStatsService(weekNumber, year = new Date().getFullYear()) {
    const weeklyReport = await WeeklyReport.findOne({ weekNumber, year })
        .populate('trackReports')
        .lean();

    if (!weeklyReport) {
        return {
            weekNumber,
            year,
            totalTracks: TRACKS.length,
            submittedTracks: 0,
            pendingTracks: TRACKS.length,
            trackStatus: TRACKS.map(track => ({ track, submitted: false }))
        };
    }

    const submittedTracks = weeklyReport.trackReports.map(tr => tr.track);
    const pendingTracks = TRACKS.filter(track => !submittedTracks.includes(track));

    return {
        weekNumber,
        year,
        totalTracks: TRACKS.length,
        submittedTracks: submittedTracks.length,
        pendingTracks: pendingTracks.length,
        trackStatus: [
            ...weeklyReport.trackReports.map(tr => ({ track: tr.track, submitted: true })),
            ...pendingTracks.map(track => ({ track, submitted: false }))
        ]
    };
}
