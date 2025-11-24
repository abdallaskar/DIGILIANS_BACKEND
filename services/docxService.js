// services/report.service.js
import { WeeklyReport } from '../model/Report.js'; // Adjust path as needed
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

/**
 * Fetches the report data and generates a DOCX document buffer.
 * @param {number} weekNumber - The week number of the report.
 * @param {number} year - The year of the report.
 * @returns {Promise<Buffer>} The generated DOCX file buffer.
 */
export const generateWeeklyReportDocx = async (weekNumber, year) => {
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

    // 2. Build Document Content
    const children = [];

    // Title
    children.push(
        new Paragraph({
            text: `Weekly Report - Week ${weeklyReport.weekNumber}, ${weeklyReport.year}`,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 } // Add space after the title
        })
    );

    // Track Reports Sections
    for (const trackReport of weeklyReport.trackReports) {
        // Track Subtitle
        children.push(
            new Paragraph({
                text: `${trackReport.track} Track`,
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 400, after: 200 } // Add space around the track heading
            })
        );

        // Questions and Answers
        for (const qa of trackReport.questionsAndAnswers) {
            // Question
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Question: `,
                            bold: true,
                            color: '0070C0', // Blue color for question
                        }),
                        new TextRun({
                            text: qa.question,
                        }),
                    ],
                    spacing: { after: 100 }
                })
            );

            // Answer
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Answer: `,
                            bold: true,
                            color: '00B050', // Green color for answer
                        }),
                        new TextRun({
                            text: qa.answer,
                        }),
                    ],
                    spacing: { after: 300 }
                })
            );
        }
    }

    // 3. Create Document
    const doc = new Document({
        sections: [{
            children: children,
        }],
    });

    // 4. Pack and return buffer
    return Packer.toBuffer(doc);
};