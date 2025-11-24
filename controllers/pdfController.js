// controllers/weeklyReport.controller.js (Updated)
import { generateWeeklyReportPdf } from '../services/pdfService.js'; // Import the new service function

// ... (keep exportWeeklyReportDocx function here)

/**
 * Controller to handle the request for PDF report export.
 */
export const exportWeeklyReportPdf = async (req, res) => {
    const weekNumber = parseInt(req.query.week) || parseInt(req.params.weekNumber);
    const year = parseInt(req.query.year) || parseInt(req.params.year) || new Date().getFullYear();

    if (!weekNumber) {
        return res.status(400).json({ message: 'Missing week number.' });
    }

    try {
        const pdfBuffer = await generateWeeklyReportPdf(weekNumber, year);

        // Set headers for PDF download
        res.setHeader('Content-Type', 'application/pdf'); // Crucial change: MIME type for PDF
        res.setHeader('Content-Disposition', `attachment; filename=weekly_report_W${weekNumber}_Y${year}.pdf`);
        res.setHeader('Content-Length', pdfBuffer.length);

        // Send the buffer as the response
        res.end(pdfBuffer);

    } catch (error) {
        console.error('Error exporting PDF:', error);
        if (error.message.includes('not found')) {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error generating PDF report file.' });
    }
};