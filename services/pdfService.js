// services/report.service.js (Corrected Version)

// Add new imports
import PDFDocument from 'pdfkit';

// FIX 1: Import the get-stream utility function and use it correctly.
// We use the named export for v9+.
import { getStreamAsBuffer } from 'get-stream';

import { WeeklyReport } from '../model/Report.js';

// NOTE: You should keep your generateWeeklyReportDocx function here if you are using this file for both.

/**
 * Fetches the report data and generates a PDF document buffer.
 * @param {number} weekNumber - The week number of the report.
 * @param {number} year - The year of the report.
 * @returns {Promise<Buffer>} The generated PDF file buffer.
 */
export const generateWeeklyReportPdf = async (weekNumber, year) => {
    // 1. Fetch Data
    const weeklyReport = await WeeklyReport.findOne({ weekNumber, year })
        .populate({
            path: 'trackReports',
            select: 'track questionsAndAnswers'
        })
        .exec();

    if (!weeklyReport) {
        throw new Error(`Weekly Report for week ${weekNumber}, year ${year} not found.`);
    }

    // 2. Initialize PDF Document
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // 3. Define content structure
    // Title
    doc.fontSize(24)
        .text(`Weekly Report`, { align: 'center' })
        .moveDown(0.5);

    doc.fontSize(16)
        .text(`Week ${weeklyReport.weekNumber}, ${weeklyReport.year}`, { align: 'center' })
        .moveDown(1.5);

    // Track Reports Sections
    for (const trackReport of weeklyReport.trackReports) {
        // Track Subtitle
        doc.fontSize(18)
            .fillColor('blue')
            .text(trackReport.track, { underline: true })
            .moveDown(0.5);

        // Questions and Answers
        for (const qa of trackReport.questionsAndAnswers) {
            // Check if page break is needed
            if (doc.y > doc.page.height - 100) {
                doc.addPage();
            }

            // Question
            doc.fontSize(12)
                .fillColor('black');

            // Text styling (bold) is handled via explicit font change
            doc.font('Helvetica-Bold').text(`Question: `, { continued: true })
                .font('Helvetica').text(qa.question, { continued: false }) // End the continued text
                .moveDown(0.2);

            // Answer
            doc.fontSize(12)
                .fillColor('green')
                .font('Helvetica-Bold').text(`Answer: `, { continued: true })
                .font('Helvetica').text(qa.answer, { continued: false }) // End the continued text
                .moveDown(1); // Add space after Q&A block
        }
        doc.moveDown(1); // Space between tracks
    }

    // Finalize PDF and convert stream to buffer
    doc.end();

    // FIX 1: Correct usage of get-stream function for v9+.
    // Call the buffer method directly.
    return getStreamAsBuffer(doc);
};