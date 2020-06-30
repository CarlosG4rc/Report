function doGet() {
    var template =  HtmlService.createTemplateFromFile('index'); // Método para la creación del  template
    return template.evaluate().addMetaTag('viewport', 'width=device-width, initial-scale=1.0'); // se evalua la metadata de la cabecera
}
function include (filename) {
    return HtmlService.createTemplateFromFile(filename).getRawContent();
}
function completar(){
    var ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/16PoeOrXVkD46N3tOzxNbtBHSOdHuw6cB9oW12AO8gHY/edit#gid=0');
    var sheet = ss.getSheetByName('Grupos');
    var data = sheet.getRange(1,1).getDataRegion().getValues();
    var grupo = {};
    data.forEach(function(n){
        grupo[n[8]] = null;
        });
    return grupo;
}
function autocompletar(clase){
    var ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/16PoeOrXVkD46N3tOzxNbtBHSOdHuw6cB9oW12AO8gHY/edit#gid=0');
    var sheet = ss.getSheetByName(clase);
    var data = sheet.getRange(1,1).getDataRegion().getValues();
    var nombre = {};
    data.forEach(function(n){
        nombre[n[1]] = null;
        });
    return nombre;
}
function getfemail (alumno){
    var ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/16PoeOrXVkD46N3tOzxNbtBHSOdHuw6cB9oW12AO8gHY/edit#gid=0');
    var sheet = ss.getSheetByName(alumno.grupo);
    var lastrowbd = sheet.getDataRange().getNumRows();
    var column = sheet.getDataRange();
    var value = column.getValues();
    for(var i = 0; i < lastrowbd; i++)
    {
      if(value[i][1] == alumno.nombre)
      {
        var femail = value[i] && value[i][4];
        i = lastrowbd + 1;
      }
    }
    return femail;
}
function enviarreporte(infReporte){
    var ssrep = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1-S-e9_uWrQlgPUdZ8BT6KBlsO78HXgh9EJNwPfLeKRE/edit#gid=0');
    var sheet = ssrep.getSheetByName('BDRep');
    var lastrow = sheet.getDataRange().getNumRows();
    var row = lastrow + 1;
    sheet.getRange("A" + row).setValue(infReporte.nombre);
    sheet.getRange("B" + row).setValue(infReporte.grupo);
    sheet.getRange("C" + row).setValue(infReporte.profe);
    sheet.getRange("D" + row).setValue(infReporte.descripcion);
    sheet.getRange("E" + row).setValue(infReporte.status);
    var curDate = Utilities.formatDate(new Date(), "GMT-5", "dd/MM/yyyy' 'HH:mm:ss' '");
    var account = Session.getActiveUser().getEmail();
    sheet.getRange("F" + row).setValue(curDate);
    sheet.getRange("G" + row).setValue(account);

    
    var estilo = {};
        estilo[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.CENTER;
        estilo[DocumentApp.Attribute.FONT_FAMILY] = 'Arial';
        estilo[DocumentApp.Attribute.FOREGROUND_COLOR] = '#4a86e8';
        estilo[DocumentApp.Attribute.FONT_SIZE] = 20;
        estilo[DocumentApp.Attribute.BOLD] = true;
    var estilo1 = {};
        estilo1[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.CENTER;
        estilo1[DocumentApp.Attribute.FONT_FAMILY] = 'Arial';
        estilo1[DocumentApp.Attribute.FOREGROUND_COLOR] = '#434343';
        estilo1[DocumentApp.Attribute.FONT_SIZE] = 14;
        estilo1[DocumentApp.Attribute.ITALIC] = true ;
        estilo1[DocumentApp.Attribute.BOLD] = false;
    var estilo2 = {};
        estilo2[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.CENTER;
        estilo2[DocumentApp.Attribute.FONT_FAMILY] = 'Arial';
        estilo2[DocumentApp.Attribute.FOREGROUND_COLOR] = '#434343';
        estilo2[DocumentApp.Attribute.FONT_SIZE] = 18;
        estilo2[DocumentApp.Attribute.BOLD] = true;


// Plantilla de archivo
 
        var doc = DocumentApp.create(infReporte.nombre + '|' + infReporte.status).addViewer(infReporte.femail);
            //Header
        var url = doc.getUrl();
        sheet.getRange("H" + row).setValue(url);
            
        var ifp =      doc.addHeader().appendParagraph('Instituto Francisco Possenti');
        var frase =    doc.getHeader().appendParagraph('Per Crucem ad lucem ');
        var sec =      doc.getHeader().appendParagraph('Secundaria');
        var nom =      doc.getHeader().appendParagraph(infReporte.status);
                       doc.appendHorizontalRule();
            //Body
                       doc.getBody().appendParagraph('Nombre del alumno:  ' + infReporte.nombre);
                       doc.getBody().appendParagraph('    ');
                        doc.getBody().appendParagraph('Grupo:  ' + infReporte.grupo);
                       doc.getBody().appendParagraph('    ');
                       doc.getBody().appendParagraph('Profesor/autoridad:  ' + infReporte.profe);
                       doc.getBody().appendParagraph('    ');
                       doc.getBody().appendParagraph('Descripción de los hechos:  ' + infReporte.descripcion);
                       doc.getBody().appendParagraph('    ');
        
            //Footer  
                       doc.addFooter().appendHorizontalRule();
          var dep =    doc.getFooter().appendParagraph('Citas 55 95 01 23 Ext. 110 ');

    // Asignación de atributos

        ifp.setAttributes(estilo);
        frase.setAttributes(estilo1);
        sec.setAttributes(estilo2);
        nom.setAttributes(estilo2);
        dep.setAttributes(estilo);

    // Obtención de los argumentos del archivo

        
        var subject = infReporte.status + ' '  + infReporte.nombre;
        var body = infReporte.status + ' ' + url;
    
    // Tiempo de espera para el servidor

        Utilities.sleep(3000);
        GmailApp.sendEmail(infReporte.femail,subject,body); 
        
        
}

