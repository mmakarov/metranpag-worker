try {
    var doc = app.documents.item(0);
    var page = doc.pages[0];
    var frame = page.textFrames[0];
    //var selection = frame.texts.everyItem().select();  
    var selection = frame.parentStory.texts.everyItem().select();
    var myFile = new File((new File($.fileName)).parent + '/DoMakeupOK-2/DoMakeupOK.jsx');
    if (myFile.exists) {
        app.doScript(myFile, ScriptLanguage.JAVASCRIPT)
    }
} catch (e) {
    alert(e);
}