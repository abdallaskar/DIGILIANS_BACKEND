// routes/report.routes.js (or wherever you manage report routes)
import express from 'express';
import { exportWeeklyReportDocx } from '../controllers/docxController.js'; // Adjust path

const docxRouter = express.Router();

// Route to download the weekly report as a DOCX file
// Example usage: GET /api/reports/export?week=10&year=2025
docxRouter.get('/export', exportWeeklyReportDocx);
// or if you prefer a parameterized route:
// router.get('/:year/:weekNumber/export', exportWeeklyReportDocx);

export default docxRouter;