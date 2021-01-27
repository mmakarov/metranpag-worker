function main(docPath, templatePath, importWordPath, doTextPath, doQuotesPath, yoPath, checkbox1, checkbox2, checkbox3, checkbox4, checkbox5) {
    try {
        if (checkbox2 == 'true') {
            var myFile = new File((new File($.fileName)).parent + '/fixquotes.jsx');
            if (myFile.exists) {
                app.doScript(myFile, ScriptLanguage.JAVASCRIPT)
            }

            var doc = app.documents.item(0);
            var page = doc.pages[0];
            var frame = page.textFrames[0];
            var selection = frame.parentStory.texts.everyItem().select();
            app.doScript(doQuotesPath, 1246973031);
        }
    } catch (e) {
        alert(e);
    }
}