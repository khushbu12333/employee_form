## Exellar Employee Form

A Google Apps Script web app + HTML form for collecting employee details, saving records to Google Sheets, and uploading files to Google Drive.

### Files
- `form.html`: Client UI served by Apps Script (`HtmlService`). Uses `google.script.run` to submit data and uploads.
- `code.gs`: Server-side Apps Script. Writes rows to the spreadsheet and stores uploaded files in Drive.

### Prerequisites
- Google account with access to Google Drive and Google Sheets
- A Google Spreadsheet to receive submissions
- Apps Script permissions (the script will request Drive and Sheets access)

### Configure Constants
In `code.gs`, update these as needed:
- `SHEET_NAME` (default: `FormResponses`)
- `FOLDER_NAME` (default: `UserUploads`)
- `SPREADSHEET_ID` (set to your target Google Sheet ID)

### One-time Setup (Apps Script)
1. Create/open your target Google Sheet and copy its ID from the URL.
2. Open `script.google.com` → New project.
3. Add a file named `code.gs` and paste contents from this repo's `code.gs`.
4. Add a file named `form.html` and paste contents from this repo's `form.html`.
   - Ensure the HTML filename is exactly `form` (without extension in `HtmlService.createHtmlOutputFromFile("form")`).
5. In `code.gs`, set `SPREADSHEET_ID` to your sheet’s ID.
6. Save the project.
7. Optional: Run `testSetup()` from the Apps Script editor to verify Drive/Sheet access.

### Deploy as Web App
1. In Apps Script: Deploy → New deployment → Select type: Web app.
2. Execute as: Me.
3. Who has access: Anyone with the link (or your org as needed).
4. Deploy and copy the Web App URL.

Open the Web App URL to use the form. On successful submit:
- A row is appended to the sheet (headers added on first run).
- Uploads (e.g., bank proof) are saved into the Drive folder `FOLDER_NAME` (auto-created if missing).

### Common Issues
- "Submission failed" or no rows written: confirm `SPREADSHEET_ID` is correct and you have access.
- `google.script.run` is undefined: the HTML must be served by Apps Script (`doGet`)—don’t open the raw file locally.
- File upload URL empty: ensure the file input had a value and Drive permissions were granted on first deployment.

### Local Development Notes
This project is designed to run in Apps Script. If you want to host the HTML elsewhere, you must replace `google.script.run` with a network call to your backend and handle CORS, authentication, and file uploads there.

### Git
```
git clone https://github.com/khushbu12333/employee_form.git
cd employee_form
```

### License
Proprietary (internal use). Update as appropriate for your organization.
