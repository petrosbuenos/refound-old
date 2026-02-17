function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    // Якщо шапки ще немає — створюємо потрібні колонки
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "name",
        "phone",
        "email",
        "lossAmount",
        "message",
        "Google Click ID",
        "Conversion Name",
        "Conversion Time",
        "Conversion Value",
        "Conversion Currency",
        "gbraid",
        "gad_campaignid",
        "gad_adgroupid",
        "gad_adid",
        "gad_source",
        "review"
      ]);
    }

    function getServerTimeString() {
      var now = new Date();
      var shifted = new Date(now.getTime() - 60 * 60000);
      var tz = Session.getScriptTimeZone();
      return Utilities.formatDate(shifted, tz, "yyyy-MM-dd HH:mm:ss");
    }

    function dayKeyFromTimeString(timeStr) {
      return (timeStr || "").toString().slice(0, 10); // "yyyy-MM-dd"
    }

    // Нормалізація email для порівняння (без пробілів по краях, нижній регістр)
    function normalizeEmail(emailStr) {
      return (emailStr || "").toString().trim().toLowerCase();
    }

    // Перевірка на дубль по електронній пошті
    var newEmail = normalizeEmail(data.email);
    if (newEmail) {
      var emailCol = 3;
      var lastRow = sheet.getLastRow();
      if (lastRow >= 2) {
        var numDataRows = lastRow - 1;
        var existingEmails = sheet.getRange(2, emailCol, numDataRows, 1).getValues();
        for (var i = 0; i < existingEmails.length; i++) {
          var existingEmail = normalizeEmail(existingEmails[i][0]);
          if (existingEmail && existingEmail === newEmail) {
            return ContentService.createTextOutput(
              JSON.stringify({ success: true, duplicate: true, skipped: true })
            ).setMimeType(ContentService.MimeType.JSON);
          }
        }
      }
    }

    var gclid = data.gclid || data.GCLID || "";
    var conversionTime = getServerTimeString();

    var row = [
      data.name || "",
      data.phone || "",
      data.email || "",
      data.lossAmount || "",
      data.message || "",
      data["Google Click ID"] || gclid,
      data["Conversion Name"] || "Lead_Opora_Prava",
      conversionTime,
      data["Conversion Value"] || "100",
      data["Conversion Currency"] || "USD",
      data.gbraid || "",
      data.gad_campaignid || "",
      data.gad_adgroupid || "",
      data.gad_adid || "",
      data.gad_source || "",
      data.review || ""
    ];

    sheet.appendRow(row);

    // ---- обробити всі дати: підсвітити останній рядок кожної доби ----
    formatAllDaysInSheet_(sheet);

    return ContentService.createTextOutput(
      JSON.stringify({ success: true })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Витягує ключ дня (yyyy-MM-dd) з комірки. Sheets повертає дати як Date, не рядок.
 */
function getDayKeyFromCellValue_(v) {
  if (!v) return "";
  if (v instanceof Date) {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  var s = (v || "").toString().trim();
  return s.length >= 10 ? s.slice(0, 10) : "";
}

/**
 * Обробляє всю таблицю: після останнього рядка кожної унікальної дати
 * додає підсвітку та нижню рамку для візуального відділення днів.
 * Викликається при кожній новій заявці, а також можна запустити вручну.
 */
function formatAllDaysInSheet_(sheet) {
  var HEADER_ROW = 1;
  var CONV_TIME_COL = 8;
  var FORMAT_END_COL = 15;  // колонка O — форматування тільки до O, P не виділяється
  var HIGHLIGHT_COLOR = "#fff2cc";

  var lastRow = sheet.getLastRow();
  if (lastRow <= HEADER_ROW) return;

  var numDataRows = lastRow - HEADER_ROW;
  var convTimes = sheet.getRange(HEADER_ROW + 1, CONV_TIME_COL, numDataRows, 1).getValues();

  // dayKey -> індекс останнього рядка цього дня (1-based)
  var lastRowByDay = {};
  for (var i = 0; i < convTimes.length; i++) {
    var v = convTimes[i][0];
    var key = getDayKeyFromCellValue_(v);
    if (key) {
      var rowIndex = HEADER_ROW + 1 + i;
      lastRowByDay[key] = rowIndex;
    }
  }

  // Знімаємо підсвітку та рамки тільки з колонок A–O
  var dataRange = sheet.getRange(HEADER_ROW + 1, 1, numDataRows, FORMAT_END_COL);
  dataRange.setBackground(null);
  dataRange.setBorder(null, null, false, null, null, null);

  // Підсвічуємо останній рядок кожної доби (тільки колонки A–O)
  for (var dayKey in lastRowByDay) {
    var targetRow = lastRowByDay[dayKey];
    var r = sheet.getRange(targetRow, 1, 1, FORMAT_END_COL);
    r.setBackground(HIGHLIGHT_COLOR);
    r.setBorder(null, null, true, null, null, null);
  }
}

/**
 * Запустити вручну: обробити всі дати в активній таблиці.
 * Розширення → Apps Script → вибрати formatAllDaysInSheet → Запустити.
 * Або: відкрити таблицю → меню «Форматування днів» → «Відділити доби».
 */
function formatAllDaysInSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  formatAllDaysInSheet_(sheet);
}

/**
 * Додає пункт меню при відкритті таблиці.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Форматування днів")
    .addItem("Відділити доби (підсвітити останній рядок кожної дати)", "formatAllDaysInSheet")
    .addToUi();
}
