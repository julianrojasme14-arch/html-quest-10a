/** ElectroNovela 6B — instalar como implementación web en Apps Script.
 * Esta implementación es exclusiva de Robótica 6B.
 * Implementar como: Ejecutar como yo; acceso: cualquier persona (solo si la política escolar lo permite).
 */
const SPREADSHEET_ID = "1_FriwhMI3d5NZ-t15X71xknGjVB_hs0YYh6YdZ5lpkY";
const SHEET_NAME = "Resultados Robótica 6B";
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    if (!e || !e.postData || !e.postData.contents) throw new Error("Solicitud vacía");
    const p = JSON.parse(e.postData.contents);
    if (p.juego !== "robotica" || p.grado !== "6B") throw new Error("Juego o grupo inválido");
    const name = String(p.nombre || "").trim().slice(0,90);
    const aciertos = Number(p.aciertos), total = Number(p.total);
    const attempt = String(p.intentoId || "").slice(0,100);
    if (name.length < 5 || !attempt || total !== 20 || !Number.isInteger(aciertos) || aciertos < 0 || aciertos > total) throw new Error("Datos inválidos");
    lock.waitLock(10000);
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error("No existe la pestaña");
    const last = sheet.getLastRow();
    if (last > 1) {
      const ids = sheet.getRange(2,8,last-1,1).getValues().flat().map(String);
      if (ids.includes(attempt)) return output({ok:true,duplicate:true});
    }
    const nota = Math.round(aciertos / total * 500)/100;
    const detail = JSON.stringify({personaje:p.personaje||"",alias:p.nombrePersonaje||"",color:p.color||"",respuestas:p.respuestas||[]}).slice(0,40000);
    sheet.appendRow([new Date(),name,"6B",aciertos,total,nota,"REGISTRADO",attempt,detail]);
    return output({ok:true,nota:nota});
  } catch(err) {
    return output({ok:false,error:String(err.message)});
  } finally {try {lock.releaseLock()}catch(e){}}
}
function doGet() { return output({ok:true,app:"ElectroNovela 6B"}); }
function output(x) { return ContentService.createTextOutput(JSON.stringify(x)).setMimeType(ContentService.MimeType.JSON); }
