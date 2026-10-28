// Lilly's Command Center sync for her phone and computer.
// Paste this whole file into a new Apps Script project at https://script.google.com
// Then change FAMILY_KEY below to a private word only your family knows.

const FAMILY_KEY = 'CHANGE-ME-TO-A-SECRET-WORD';
const FILE_NAME = 'lilly-command-center-save.json';   // created in your Google Drive

function doPost(e) {
  let req = {};
  try { req = JSON.parse(e.postData.contents); } catch (err) { return out({ ok: false, error: 'bad_request' }); }
  if (FAMILY_KEY === 'CHANGE-ME-TO-A-SECRET-WORD' || req.key !== FAMILY_KEY) return out({ ok: false, error: 'bad_key' });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const file = getFile();
    const stored = read(file);
    if (req.action === 'save') {
      const incoming = req.state;
      if (!incoming || typeof incoming !== 'object') return out({ ok: false, error: 'bad_request' });
      // never let an older device overwrite newer play
      if (stored && (stored.savedAt || 0) > (incoming.savedAt || 0)) return out({ ok: true, stale: true, state: stored });
      file.setContent(JSON.stringify(incoming));
      return out({ ok: true, savedAt: incoming.savedAt || 0 });
    }
    return out({ ok: true, state: stored });
  } finally {
    lock.releaseLock();
  }
}

function doGet() { return out({ ok: true, service: 'lilly-command-center-sync' }); }

function read(file) {
  try { return JSON.parse(file.getBlob().getDataAsString()); } catch (err) { return null; }
}

function getFile() {
  const it = DriveApp.getFilesByName(FILE_NAME);
  return it.hasNext() ? it.next() : DriveApp.createFile(FILE_NAME, 'null', MimeType.PLAIN_TEXT);
}

function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

// Run once from the editor (choose "setup", press Run) to approve access and create the save file.
function setup() { getFile(); Logger.log('Ready. Save file: ' + FILE_NAME); }

// Setup (once, about 5 minutes, done by a parent):
// 1. script.google.com > New project > paste this file > change FAMILY_KEY.
// 2. Choose "setup" in the toolbar, press Run, and approve access.
// 3. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone.
// 4. Copy the Web app URL. On each device, open the Command Center, tap the sync button
//    (top right), paste the URL and the family key, then tap "Turn on sync".
