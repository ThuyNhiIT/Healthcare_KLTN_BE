const { google } = require("googleapis");
const fs = require("fs");
const XLSX = require('xlsx');

// file credentials.json tải từ Google Cloud Console
const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

// 🟢 map 1 dòng dữ liệu → object món ăn
function mapRowToFood(row) {
  return {
    name: row[1],               // Tên EN
    weight: 100,
    calo: Number(row[3]),
    chat_dam: Number(row[5]),
    duong_bot: Number(row[2]),
    chat_beo: Number(row[6]),
    image: `https://example.com/com-trang.jpg`, // ảnh demo
  };
}

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

    // Bỏ dòng tiêu đề (nếu có) → rows.slice(1)
    const foods = rows.slice(1).map(mapRowToFood);

    console.log(`✅ Lấy ${foods.length} món ăn từ Google Sheets`);
    return foods;

  } catch (error) {
    console.error("❌ Lỗi khi đọc Google Sheets:", error.message);
    console.log("⚠️ Sử dụng file local thay thế...");
    return getFromLocalSheet();
  }
}

// đọc data từ file Excel/CSV local
function getFromLocalSheet() {
  try {
    const workbook = XLSX.readFile('./data/foods.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // mảng mảng
    
    if (!rows || rows.length === 0) {
      console.log("❌ Không có dữ liệu trong file local.");
      return [];
    }

    const foods = rows.slice(1).map(mapRowToFood);
    console.log("✅ Đọc dữ liệu từ file local thành công:", foods.length, "món ăn");
    return foods;

  } catch (error) {
    console.error("❌ Lỗi khi đọc file local:", error.message);
    return [];
  }
}

module.exports = {
  getFromSheet,
  getFromLocalSheet
};
