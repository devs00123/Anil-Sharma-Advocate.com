# Quick Fix Guide - Data Not Appearing in Google Sheet

If data is still not appearing, follow these steps **in order**:

## Step 1: Verify Your Setup

1. **Check SPREADSHEET_ID** in Google Apps Script:
   - Open your Google Apps Script editor
   - Make sure `SPREADSHEET_ID` is set to your actual spreadsheet ID
   - The ID is in the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit`

2. **Check SHEET_NAME**:
   - Make sure `SHEET_NAME` matches your actual sheet tab name
   - Default is `'Sheet1'` - check if your sheet tab is named differently

## Step 2: Update and Redeploy (CRITICAL)

1. **Copy the updated code** from `google-apps-script.js`
2. **Paste it into Google Apps Script editor**
3. **Save the script** (Ctrl+S or Cmd+S)
4. **Redeploy the Web App**:
   - Click **Deploy** → **Manage deployments**
   - Click the **edit icon** (pencil) next to your deployment
   - Click **Deploy**
   - **IMPORTANT**: Copy the NEW URL if it changed
   - Update `config.js` with the new URL if it changed

## Step 3: Check Execution Log

1. Open Google Apps Script editor
2. Go to **View** → **Execution log**
3. Submit a test form from your website
4. Check the log for:
   - `=== NEW REQUEST ===`
   - What's in `e.parameter`
   - The data being saved
   - Any error messages

## Step 4: Test Directly in Browser

Open this URL in your browser (replace with your actual values):

```
YOUR_GOOGLE_APPS_SCRIPT_URL?timestamp=2024-01-01&name=Test&email=test@test.com&phone=123&message=Test message
```

Check your Google Sheet - you should see a row appear immediately.

## Step 5: Common Issues

### Issue: "Sheet not found" error
- **Solution**: Check that `SHEET_NAME` matches your actual sheet tab name exactly (case-sensitive)

### Issue: "Spreadsheet not found" error
- **Solution**: Verify `SPREADSHEET_ID` is correct in the script

### Issue: Data shows in log but not in sheet
- **Solution**: Make sure you have write permissions to the spreadsheet
- Check if the script is authorized to access the spreadsheet

### Issue: Only timestamp appears
- **Solution**: Check the execution log - see what data is in `e.parameter`
- If `e.parameter` is empty, the GET request might not be working
- Try the direct browser test (Step 4)

## Step 6: Manual Test Function

In Google Apps Script editor, run this function to test:

```javascript
function testDirectWrite() {
  const sheet = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID').getSheetByName('Sheet1');
  sheet.appendRow(['Test', 'Name', 'email@test.com', '123', 'Test message']);
}
```

Replace `YOUR_SPREADSHEET_ID` with your actual ID. If this works, the script can write to the sheet.

## Still Not Working?

1. **Double-check all IDs and names** - one typo can break everything
2. **Make sure you redeployed** after updating the script
3. **Check the execution log** for specific error messages
4. **Verify the Web App URL** in `config.js` matches your deployed URL

