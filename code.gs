// Configuration
const SHEET_NAME = "FormResponses";
const FOLDER_NAME = "UserUploads";
const SPREADSHEET_ID = "10jGFiXWLVT49yJv27QSQTgmJo-QrJM0RqDamfHM3TyU"; // Your spreadsheet ID

// Handle GET requests (for serving HTML form if needed)
function doGet() {
  return HtmlService.createHtmlOutputFromFile("form")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Handle POST requests from the frontend form
function doPost(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
function processFormSubmission(formData) {
  try {
    // Get or create the sheet
    const sheet = getOrCreateSheet();
    
    // Process the data
    const rowData = prepareRowData(formData);
    
    // Append data
    sheet.appendRow(rowData);
    
    return { success: true };
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to process submission: ' + error.message);
  }
}

// Main function to process form submission
function processFormSubmission(formData) {
  try {
    // Get or create the spreadsheet and sheet
    const sheet = getOrCreateSheet();
    
    // Get or create the Drive folder for file uploads
    const folder = getOrCreateFolder(FOLDER_NAME);
    
    // Process file uploads and get their URLs
    const fileUrls = processFileUploads(folder, formData);
    
    // Prepare the row data for the spreadsheet
    const rowData = prepareRowData(formData, fileUrls);
    
    // Add header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      addHeaderRow(sheet);
    }
    
    // Append the data to the sheet
    sheet.appendRow(rowData);
    
    // Log the submission
    console.log('Form submitted successfully:', formData.fullName);
    
    return {
      success: true,
      message: "Form submitted successfully!",
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error processing form submission:', error);
    throw new Error('Failed to process form submission: ' + error.message);
  }
}

// Get or create the spreadsheet sheet
function getOrCreateSheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById('10jGFiXWLVT49yJv27QSQTgmJo-QrJM0RqDamfHM3TyU');
    let sheet = spreadsheet.getSheetByName('FormResponses');
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }
    
    return sheet;
  } catch (error) {
    throw new Error('Could not access spreadsheet: ' + error.message);
  }
}

// Process file uploads and return URLs
function processFileUploads(folder, formData) {
  const fileUrls = {};
  
  const fileFields = [
    'bankProofFile', //added
  ];
  
  fileFields.forEach(fieldName => {
    if (formData[fieldName] && formData[fieldName].data) {
      try {
        const fileUrl = saveFileToDrive(
          folder, 
          formData[fieldName].data, 
          formData[fieldName].name || `${fieldName}_${formData.fullName || 'unknown'}`
        );
        fileUrls[fieldName] = fileUrl;
      } catch (error) {
        console.error(`Error uploading ${fieldName}:`, error);
        fileUrls[fieldName] = 'Upload failed: ' + error.message;
      }
    } else {
      fileUrls[fieldName] = '';
    }
  });
  
  return fileUrls;
}

// Save file to Google Drive and return URL
function saveFileToDrive(folder, base64Data, filename) {
  try {
    // Extract content type and data from base64 string
    const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 data format');
    }
    
    const contentType = matches[1];
    const data = matches[2];
    
    // Create blob and file
    const blob = Utilities.newBlob(
      Utilities.base64Decode(data), 
      contentType, 
      filename
    );
    
    const file = folder.createFile(blob);
    
    // Make file viewable by anyone with the link (optional)
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    return file.getUrl();
    
  } catch (error) {
    throw new Error('Failed to save file to Drive: ' + error.message);
  }
}

// Get or create folder in Google Drive
function getOrCreateFolder(folderName) {
  try {
    const folders = DriveApp.getFoldersByName(folderName);
    
    if (folders.hasNext()) {
      return folders.next();
    } else {
      return DriveApp.createFolder(folderName);
    }
  } catch (error) {
    throw new Error('Could not create/access folder: ' + error.message);
  }
}

// Add header row to the sheet
function addHeaderRow(sheet) {
  const headers = [
    'TimeStamp',
    'Full Name',
    'Father\'s Full Name', 
    'Date of Birth',
    'Address',
    'Mobile Number',
    'Email',
    'Emergency Contact',
    'Aadhaar Card Number',
    //'Aadhaar Card File',
    'PAN Card Number',
    //'PAN Card File',
    //'Photo File',
    //'Blood Group',
    'Joining Date',
    //'Experience',
    //'Qualification',
    //'Passing Date',
    //'Degree File',
    //'Resume',
    //'Experience Certificate',
    //'Salary Slip',
    'Account Name',
    'Bank Name',
    'IFSC Code',
    'Account Number',
    'Bank Proof File',
    'Designation',
    'Salary',
    'Site Name'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
}

// Prepare row data for spreadsheet
function prepareRowData(formData, fileUrls) {
  return [
    new Date().toISOString(), // Add timestamp
    formData.fullName || '',
    formData.fatherFullName || '',
    formData.dob || '',
    formData.address || '',
    formData.mobileNumber || '',
    formData.email || '',
    formData.emergencyContact || '',
    formData.aadharCardNumber || '',
    //fileUrls.aadharCardFile || '',
    formData.panCardNumber || '',
   // fileUrls.panCardFile || '',
    //fileUrls.photoFile || '',
    //formData.bloodGroup || '',
    formData.joiningDate || '',
    // formData.experience || '',
    // formData.qualification || '',
    // fileUrls.degreeFile || '',
    // fileUrls.resume || '',
    // fileUrls.experienceCertificate || '',
    // fileUrls.salarySlip || '',
    formData.accountName || '',
    formData.bankName || '',
    formData.ifscCode || '',
    formData.accountNumber || '',
    (fileUrls && fileUrls.bankProofFile) || '',
    formData.salary || '',
    formData.designation || '',
    formData.siteName || '',
  ];
}

// Function to handle PDF acknowledgment (if needed)
function submitAcknowledgement(userData) {
  try {
    // Log the acknowledgment
    console.log('PDF acknowledged by:', userData);
    
    return { success: true, message: "Acknowledgment recorded" };
    
  } catch (error) {
    console.error('Error recording acknowledgment:', error);
    return { success: false, error: error.message };
  }
}

// Test function to verify setup
function testSetup() {
  try {
    const sheet = getOrCreateSheet();
    const folder = getOrCreateFolder(FOLDER_NAME);
    
    console.log('Sheet name:', sheet.getName());
    console.log('Folder name:', folder.getName());
    console.log('Setup test completed successfully');
    
    return { success: true, message: "Setup is working correctly" };
    
  } catch (error) {
    console.error('Setup test failed:', error);
    return { success: false, error: error.message };
  }
}

