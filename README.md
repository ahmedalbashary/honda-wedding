# Wedding Invitation - Updated Version

All changes requested have been applied to this folder: `files5-english-updated`.

---

## 📋 Summary of Changes Applied

1. **QUEST 1 (Location):**
   - Title changed from `QUEST 1: The Ceremony` to `QUEST 1: The Location`.
   - Removed `7:00 PM`.
   - Changed venue from `Grand Celebration Hall / Flowers Street, Uptown District — The City` to `Tree House Orabi`.
   - Updated map link button to `https://maps.app.goo.gl/gmbt4o8Fr2iAh7eN6`.

2. **QUEST 2 (Timing):**
   - Title changed from `QUEST 2: The Banquet` to `QUEST 2: The Timing`.
   - Subtitle changed from `Immediately after the ceremony — 9:00 PM` to `Bonus points for those who arrive on time`.
   - Venue info changed to `4:00 PM`.
   - Countdown timer target in `script.js` synchronized to `4:00 PM` (16:00).

3. **Level 4 (Theme & Colors):**
   - Section heading changed from `Our Moments` to `Our Theme`.
   - Subtitle changed from `Tap each slot to unlock a memory` to:
     > `Tap each slot to unlock the colors that will make your pictures instagram worthy!`
   - Reduced from 6 slots to **3 slots**:
     - **1. Olive Green** (`#556B2F`)
     - **2. Maroon** (`#800000`)
     - **3. Navy Blue** (`#002366`)
   - Tapping each slot reveals its color, theme icon, and name with retro pop animation and sound effect.

4. **RSVP Form:**
   - **Removed Email Address** input completely.
   - **Number of Guests** updated to exactly 2 options:
     - `Just me`
     - `Two guests`

5. **RSVP Google Sheets Integration:**
   - Prepared export to sheet: `https://docs.google.com/spreadsheets/d/1Udd9Bj1yKndK8-7nke1rCDV5dhcqGEhgDpyINjDHQl4/edit?usp=sharing`.
   - Included `GoogleAppsScript.gs` ready to copy and paste.
   - Submissions are also automatically backed up to browser `localStorage` (`wedding_rsvps`).

---

## 🚀 How to Connect the Google Sheet (1-Minute Setup)

1. Open your Google Sheet:
   [Honda&Salma Google Sheet](https://docs.google.com/spreadsheets/d/1Udd9Bj1yKndK8-7nke1rCDV5dhcqGEhgDpyINjDHQl4/edit?usp=sharing)
2. In the top toolbar, click **Extensions** → **Apps Script**.
3. Delete any placeholder code and paste the code from [GoogleAppsScript.gs](file:///c:/Users/ia7me/Downloads/files5-english-updated/GoogleAppsScript.gs).
4. Click the blue **Deploy** button (top right) → **New deployment**.
5. Click the gear icon ⚙️ next to *Select type* and select **Web app**.
6. Set:
   - **Description**: `RSVP Webhook`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone` *(Allows guests to submit without needing a Google sign-in)*
7. Click **Deploy**, authorize permissions when prompted, and copy the **Web app URL** (ends in `/exec`).
8. Open [script.js](file:///c:/Users/ia7me/Downloads/files5-english-updated/script.js) and paste your URL into:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
   ```
