function main(docPath, templatePath, importWordPath, doTextPath, doQuotesPath, yoPath, checkbox1, checkbox2, checkbox3, checkbox4, checkbox5) {
    try {
        if (checkbox1 == 'true') {
            var doc = app.documents.item(0);
            var page = doc.pages[0];  
            var frame = page.textFrames[0];  
            //var selection = frame.texts.everyItem().select();  
            var selection = frame.parentStory.texts.everyItem().select();
            app.doScript(doTextPath, 1246973031); //dotext
        }
    } catch (e) {
        alert(e);
    }
}