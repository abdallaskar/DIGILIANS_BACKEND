# Weekly Report API Documentation

## Overview

This API allows individual tracks to submit their own reports for specific weeks. Each track can create, update, and manage their own reports, and all reports for a week are aggregated into a weekly report.

## Track Types

- SOFTWARE
- DIGITAL MARKETING
- AI & DATA SCIENCE
- DATA ANALYTICS
- SECURITY
- APPLIED TECHNOLOGIES

## API Endpoints

### Track Report Endpoints

#### 1. Create or Update Track Report

**POST** `/api/reports/track`

Creates a new track report or updates an existing one for a specific week.

**Request Body:**

```json
{
  "track": "SOFTWARE",
  "weekNumber": 1,
  "questionsAndAnswers": [
    {
      "question": "What did you learn this week?",
      "answer": "I learned about React hooks and state management."
    }
  ],
  "status": "DRAFT" // Optional: "DRAFT" or "SUBMITTED"
}
```

**Response:**

```json
{
  "message": "Track report created/updated successfully",
  "trackReport": {
    "_id": "report_id",
    "track": "SOFTWARE",
    "weekNumber": 1,
    "questionsAndAnswers": [...],
    "status": "DRAFT",
    "submittedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### 2. Get All Track Reports

**GET** `/api/reports/track`

Retrieves all track reports across all users, tracks, and weeks.

**Response:**

```json
{
  "trackReports": [...],
  "count": 25
}
```

#### 3. Get Specific Track Report

**GET** `/api/reports/track/:track/:weekNumber`

Retrieves a specific track report by track and week.

**Example:** `/api/reports/track/SOFTWARE/1`

#### 4. Get Track Reports by Week

**GET** `/api/reports/track/week/:weekNumber`

Retrieves all track reports for a specific week.

**Response:**

```json
{
  "weekNumber": 1,
  "trackReports": [...],
  "count": 6
}
```

#### 5. Get Track Reports by Track

**GET** `/api/reports/track/track/:track`

Retrieves all reports for a specific track.

**Query Parameters:**

- `weekNumber` (optional): Filter by specific week

**Example:** `/api/reports/track/track/SOFTWARE?weekNumber=1`

#### 6. Update Track Report Status

**PATCH** `/api/reports/track/:trackReportId/status`

Updates the status of a track report.

**Request Body:**

```json
{
  "status": "SUBMITTED"
}
```

#### 7. Delete Track Report

**DELETE** `/api/reports/track/:trackReportId`

Deletes a track report.

### Weekly Report Endpoints

#### 8. Get Weekly Reports

**GET** `/api/reports/weekly/:weekNumber`

Retrieves all track reports for a specific week.

**Query Parameters:**

- `year` (optional): Filter by year (defaults to current year)

**Example:** `/api/reports/weekly/1?year=2024`

**Response:**

```json
{
  "_id": "weekly_report_id",
  "weekNumber": 1,
  "year": 2024,
  "trackReports": [
    {
      "_id": "track_report_id",
      "track": "SOFTWARE",
      "weekNumber": 1,
      "questionsAndAnswers": [...],
      "status": "SUBMITTED"
    }
  ],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### 9. Get Weekly Report Statistics

**GET** `/api/reports/weekly/:weekNumber/stats`

Retrieves statistics for a specific week.

**Response:**

```json
{
  "weekNumber": 1,
  "year": 2024,
  "totalTracks": 6,
  "submittedTracks": 4,
  "pendingTracks": 2,
  "trackStatus": [
    { "track": "SOFTWARE", "status": "SUBMITTED" },
    { "track": "DIGITAL MARKETING", "status": "SUBMITTED" },
    { "track": "AI & DATA SCIENCE", "status": "PENDING" },
    { "track": "DATA ANALYTICS", "status": "SUBMITTED" },
    { "track": "SECURITY", "status": "PENDING" },
    { "track": "APPLIED TECHNOLOGIES", "status": "SUBMITTED" }
  ]
}
```

## Usage Examples

### Creating a Track Report

```javascript
const response = await fetch('/api/reports/track', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    track: 'SOFTWARE',
    weekNumber: 1,
    questionsAndAnswers: [
      {
        question: 'What technologies did you work with this week?',
        answer: 'React, Node.js, and MongoDB',
      },
      {
        question: 'What challenges did you face?',
        answer: 'Understanding React hooks and state management',
      },
    ],
    status: 'SUBMITTED',
  }),
});
```

### Getting Weekly Reports

```javascript
const response = await fetch('/api/reports/weekly/1');
const weeklyReport = await response.json();
console.log(`Week 1 has ${weeklyReport.trackReports.length} track reports`);
```

### Getting Weekly Statistics

```javascript
const response = await fetch('/api/reports/weekly/1/stats');
const stats = await response.json();
console.log(`Week 1: ${stats.submittedTracks}/${stats.totalTracks} tracks submitted`);
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (missing or invalid data)
- `404` - Not Found
- `409` - Conflict (duplicate report)
- `500` - Internal Server Error

Error responses include a descriptive message:

```json
{
  "error": "Missing required fields: track, weekNumber, questionsAndAnswers"
}
```

## Database Schema

### TrackReport Schema

```javascript
{
  track: String (enum: ['SOFTWARE', 'DIGITAL MARKETING', 'AI & DATA SCIENCE', 'DATA ANALYTICS', 'SECURITY', 'APPLIED TECHNOLOGIES']),
  questionsAndAnswers: [{
    question: String,
    answer: String
  }],
  weekNumber: Number (1-14),
  submittedAt: Date,
  status: String (enum: ['DRAFT', 'SUBMITTED'])
}
```

### WeeklyReport Schema

```javascript
{
  weekNumber: Number (1-14),
  year: Number,
  trackReports: [ObjectId] (ref: 'TrackReport'),
  createdAt: Date,
  updatedAt: Date
}
```

## Notes

- Week numbers are validated to be between 1 and 14
- Each track can only have one report per week
- Track reports are automatically added to the corresponding weekly report
- The system supports both draft and submitted statuses
- All timestamps are in UTC
