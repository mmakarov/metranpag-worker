try {
    if (arguments[7] == 'true') {
        var myFile = new File((new File($.fileName)).parent + '/fixquotes.jsx');
        if (myFile.exists) {
            app.doScript(myFile, ScriptLanguage.JAVASCRIPT)
        }

        //doquotes
        var doc = app.documents.item(0);
        var page = doc.pages[0];  
        var frame = page.textFrames[0];  
        //var selection = frame.texts.everyItem().select();  
        var selection = frame.parentStory.texts.everyItem().select();
        app.doScript(arguments[4], 1246973031);
    }
} catch (e) {
    alert(e);
}