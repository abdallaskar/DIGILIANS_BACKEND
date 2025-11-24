// controllers/docxController.js
import { generateWeeklyReportDocx } from '../services/docxService.js';

/**
 * Controller to handle the request for DOCX report export.
 */
export const exportWeeklyReportDocx = async (req, res) => {
    // Validate and parse week and year from query parameters or route params
    const weekNumber = parseInt(req.query.week) || parseInt(req.params.weekNumber);
    const year = parseInt(req.query.year) || parseInt(req.params.year) || new Date().getFullYear();

    if (!weekNumber) {
        return res.status(400).json({ message: 'Missing week number.' });
    }

    try {
        const docxBuffer = await generateWeeklyReportDocx(weekNumber, year);

        // Set headers for file download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename=weekly_report_W${weekNumber}_Y${year}.docx`);
        res.setHeader('Content-Length', docxBuffer.length);

        // Send the buffer as the response
        res.end(docxBuffer);

    } catch (error) {
        console.error('Error exporting DOCX:', error);
        if (error.message.includes('not found')) {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error generating report file.' });
    }
};