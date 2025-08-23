const { google } = require("googleapis");
const fs = require("fs");
const XLSX = require('xlsx');

// file credentials.json tải từ Google Cloud Console
const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

// đọc data sheet từ Google Sheets
async function getFromSheet(spreadsheetId, range) {
    try {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });
      const rows = res.data.values;
      if (!rows || rows.length === 0) {
        console.log("❌ Không có dữ liệu trong sheet.");
        return [];
      }
      return rows;
    } catch (error) {
      console.error("❌ Lỗi khi đọc Google Sheets:", error.message);
      console.log("⚠️ Sử dụng file local thay thế...");
    //   return getFromLocalSheet();
    }
  }

// đọc data từ file Excel/CSV local
function getFromLocalSheet() {
  try {
    // Đọc file Excel/CSV từ thư mục data
    const workbook = XLSX.readFile('./data/foods.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Chuyển đổi thành JSON
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    if (!data || data.length === 0) {
      console.log("❌ Không có dữ liệu trong file local.");
      return [];
    }
    
    console.log("✅ Đọc dữ liệu từ file local thành công:", data.length, "món ăn");
    return data;
  } catch (error) {
    console.error("❌ Lỗi khi đọc file local:", error.message);
    return [];
  }
}

module.exports = {
  getFromSheet,
  getFromLocalSheet
};
