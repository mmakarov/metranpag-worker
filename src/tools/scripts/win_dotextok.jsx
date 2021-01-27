try {
    if (arguments[6] == 'true') {
        var doc = app.documents.item(0);
        var page = doc.pages[0];  
        var frame = page.textFrames[0];  
        //var selection = frame.texts.everyItem().select();  
        var selection = frame.parentStory.texts.everyItem().select();
        app.doScript(arguments[3], 1246973031); //dotext
    }
} catch (e) {
    alert(e);
}