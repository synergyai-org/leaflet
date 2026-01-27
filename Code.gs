
/**
 * GOOGLE APPS SCRIPT BACKEND (Code.gs)
 */

const ADMIN_SHEET = 'Admin';
const LEAFLETS_SHEET = 'Leaflets';

function initialize() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  let adminSheet = ss.getSheetByName(ADMIN_SHEET);
  if (!adminSheet) {
    adminSheet = ss.insertSheet(ADMIN_SHEET);
    adminSheet.getRange("A1:B1").setValues([["id", "password"]]);
    adminSheet.getRange("A2:B2").setValues([["admin", "synergy123"]]);
    adminSheet.setFrozenRows(1);
  }

  let leafletsSheet = ss.getSheetByName(LEAFLETS_SHEET);
  if (!leafletsSheet) {
    leafletsSheet = ss.insertSheet(LEAFLETS_SHEET);
    leafletsSheet.getRange("A1:D1").setValues([["id", "title", "config_json", "updated_at"]]);
    leafletsSheet.setFrozenRows(1);
    
    const sampleId = "main";
    const sampleTitle = "기본 리플렛 (Sample)";
    leafletsSheet.getRange(2, 1, 1, 4).setValues([[sampleId, sampleTitle, "{}", new Date()]]);
  }
}

function doGet(e) {
  initialize();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const action = e.parameter.action;
  
  if (action === 'login') {
    const inputId = String(e.parameter.id || "").trim();
    const inputPw = String(e.parameter.pw || "").trim();
    const adminSheet = ss.getSheetByName(ADMIN_SHEET);
    const data = adminSheet.getDataRange().getValues();
    let isAuthenticated = false;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === inputId && String(data[i][1]) === inputPw) {
        isAuthenticated = true; break;
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ success: isAuthenticated })).setMimeType(ContentService.MimeType.JSON);
  }

  if (action === 'list') {
    const sheet = ss.getSheetByName(LEAFLETS_SHEET);
    const data = sheet.getDataRange().getValues();
    const list = [];
    for (let i = 1; i < data.length; i++) {
      list.push({ id: data[i][0], title: data[i][1], updatedAt: data[i][3] });
    }
    return ContentService.createTextOutput(JSON.stringify(list)).setMimeType(ContentService.MimeType.JSON);
  }

  const slug = e.parameter.p || "main";
  const sheet = ss.getSheetByName(LEAFLETS_SHEET);
  const data = sheet.getDataRange().getValues();
  let foundConfig = "{}";
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === slug) {
      foundConfig = data[i][2]; break;
    }
  }
  return ContentService.createTextOutput(foundConfig).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  initialize();
  
  try {
    const contents = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(LEAFLETS_SHEET);
    const action = contents.action;
    const newId = String(contents.id).trim();
    const oldId = contents.oldId ? String(contents.oldId).trim() : newId;
    
    const data = sheet.getDataRange().getValues();
    
    // 중복 체크 로직 (신규 생성이거나 ID를 변경하는 경우)
    if (action === 'create' || (action === 'save' && newId !== oldId)) {
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === newId) {
          return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "이미 존재하는 ID입니다. 다른 ID를 사용해주세요." })).setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    if (action === 'save') {
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === oldId) {
          sheet.getRange(i + 1, 1).setValue(newId); // ID 업데이트 (ID가 변경되었을 수 있음)
          sheet.getRange(i + 1, 2).setValue(contents.title || data[i][1]);
          sheet.getRange(i + 1, 3).setValue(JSON.stringify(contents.config));
          sheet.getRange(i + 1, 4).setValue(new Date());
          return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
        }
      }
    } else if (action === 'create') {
      sheet.appendRow([newId, contents.title, JSON.stringify(contents.config), new Date()]);
      return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
    } else if (action === 'delete') {
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === newId) {
          sheet.deleteRow(i + 1);
          return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
        }
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "대상 리플렛을 찾을 수 없거나 요청이 잘못되었습니다." })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}
