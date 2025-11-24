// routes/docx.routes.js (Updated assuming you rename it to reports.routes.js or similar)
import express from 'express';
import { exportWeeklyReportPdf } from '../controllers/pdfController.js';

const pdfRouter = express.Router();

// New Route for PDF export
// Example usage: GET /api/pdf/pdf?week=10&year=2025
pdfRouter.get('/export', exportWeeklyReportPdf);

export default pdfRouter;