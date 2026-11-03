/** ElectroNovela · receptor exclusivo de robótica 6A y 6B.
 * Implementar como una aplicación web de Google Apps Script
 * vinculada al archivo de Google Sheets existente.
 */
const SPREADSHEET_ID = '1_FriwhMI3d5NZ-t15X71xknGjVB_hs0YYh6YdZ5lpkY';
const TAB_NAME = 'Resultados Robótica 6B';
const HEADERS = ['Fecha y hora','Estudiante','Grupo','Aciertos','Total preguntas','Nota /5,0','Estado','ID de intento','Detalle de respuestas'];
function doPost(e) {
  const lock=LockService.getScriptLock();
  try {
    const data=JSON.parse((e&&e.postData&&e.postData.contents)||'{}');
    const nombre=String(data.nombre||'').trim();
    const grado=String(data.grado||'').trim();
    const total=Number(data.total), aciertos=Number(data.aciertos);
    const id=String(data.intentoId||'').trim();
    if(data.juego!=='robotica'||!['6A','6B'].includes(grado)||!nombre||!id||data.completado!==true||total!==15||!Number.isInteger(aciertos)||aciertos<0||aciertos>total){
      return json_({ok:false,error:'Datos inválidos'});
    }
    lock.waitLock(20000);
    const book=SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet=book.getSheetByName(TAB_NAME);
    if(!sheet){sheet=book.insertSheet(TAB_NAME);sheet.appendRow(HEADERS);}
    const rows=sheet.getLastRow();
    if(rows>1){const ids=sheet.getRange(2,8,rows-1,1).getValues();if(ids.some(r=>String(r[0])===id))return json_({ok:true,duplicate:true});}
    const detail=JSON.stringify(data.respuestas||[]);
    const safeName=nombre.replace(/^[=+@\-]/,'\u0027$&');
    sheet.appendRow([new Date(),safeName,grado,aciertos,total,Math.round(aciertos/total*500)/100,'Completado',id,detail]);
    return json_({ok:true,id:id});
  } catch(err) {return json_({ok:false,error:String(err)});}
  finally{try{lock.releaseLock()}catch(_){}}
}
function doGet(e){
  const id=String((e&&e.parameter&&e.parameter.id)||'');
  if(!id)return json_({ok:false,error:'Falta ID'});
  const sheet=SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(TAB_NAME);
  if(!sheet||sheet.getLastRow()<2)return json_({ok:true,found:false});
  const values=sheet.getRange(2,8,sheet.getLastRow()-1,1).getValues();
  return json_({ok:true,found:values.some(r=>String(r[0])===id)});
}
function json_(x){return ContentService.createTextOutput(JSON.stringify(x)).setMimeType(ContentService.MimeType.JSON);}
