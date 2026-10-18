/**
 * Google Apps Script for Wedding RSVP Form
 * Spreadsheet: https://docs.google.com/spreadsheets/d/1Udd9Bj1yKndK8-7nke1rCDV5dhcqGEhgDpyINjDHQl4/edit?usp=sharing
 *
 * HOW TO SET UP (Takes 1 Minute):
 * 1. Open your Google Sheet in your browser:
 *    https://docs.google.com/spreadsheets/d/1Udd9Bj1yKndK8-7nke1rCDV5dhcqGEhgDpyINjDHQl4/edit?usp=sharing
 * 2. In the top menu, click "Extensions" -> "Apps Script".
 * 3. Delete any default code in Code.gs, paste this entire script, and click the Save icon (💾).
 * 4. Click the blue "Deploy" button (top right) -> "New deployment".
 * 5. Click the gear icon next to "Select type" and choose "Web app".
 * 6. Set:
 *    - Description: "RSVP Submissions"
 *    - Execute as: "Me" (your email)
 *    - Who has access: "Anyone" (important so guests can submit without signing into Google)
 * 7. Click "Deploy", review permissions and allow access.
 * 8. Copy the "Web app URL" (it ends with /exec).
 * 9. Paste that URL into script.js at:
 *    const GOOGLE_APPS_SCRIPT_URL = 'PASTE_YOUR_URL_HERE';
 */

const SPREADSHEET_ID = "1Udd9Bj1yKndK8-7nke1rCDV5dhcqGEhgDpyINjDHQl4";

function doGet(e) {
  return ContentService
    .createTextOutput("Wedding RSVP API is active and ready to receive submissions!")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(15000);

  try {
    let sheet;
    try {
      sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    } catch (err) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    }

    // Parse incoming submission
    let data = {};
    if (e.parameter && Object.keys(e.parameter).length > 0) {
      data = e.parameter;
    } else if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    }

    // Auto-create header row if sheet is fresh/empty
    if (sheet.getLastRow() === 0) {
      const headers = [
        "Timestamp",
        "Guest Name",
        "Attending?",
        "Number of Guests",
        "Message for the Couple"
      ];
      sheet.appendRow(headers);

      // Style header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#FFF7E0");
      headerRange.setFontColor("#4A1E12");
      sheet.setFrozenRows(1);
    }

    // Format attending response
    let attendanceText = "";
    if (data.attending === "yes") {
      attendanceText = "Yes - Attending 🎉";
    } else if (data.attending === "no") {
      attendanceText = "No - Cannot make it 💛";
    } else {
      attendanceText = data.attending || "";
    }

    // Append new RSVP row
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString(),
      data.name || "",
      attendanceText,
      data.count || "",
      data.message || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "RSVP recorded successfully" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
