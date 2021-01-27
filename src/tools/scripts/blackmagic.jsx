try {
    var doc = app.documents.item(0);

    for (var counter = 0; counter < doc.paragraphStyles.length; counter++) {
        var style = doc.paragraphStyles.item(counter);

        app.findGrepPreferences = NothingEnum.nothing;
        app.changeGrepPreferences = NothingEnum.nothing;

        app.findChangeGrepOptions.includeFootnotes = false;
        app.findChangeGrepOptions.includeHiddenLayers = false;
        app.findChangeGrepOptions.includeLockedLayersForFind = false;
        app.findChangeGrepOptions.includeLockedStoriesForFind = false;
        app.findChangeGrepOptions.includeMasterPages = false;

        app.findGrepPreferences.appliedParagraphStyle = style;

        app.changeGrepPreferences.appliedParagraphStyle = style;

        doc.changeGrep();

        app.findGrepPreferences = NothingEnum.nothing;
        app.changeGrepPreferences = NothingEnum.nothing;
    }
    //remove unused styles
    var myDoc = app.activeDocument;
    var myParStyles = myDoc.paragraphStyles;
    var myCharStyles = myDoc.characterStyles;

    for (j = myParStyles.length - 1; j >= 2; j--) {
        removeUnusedParaStyle(myParStyles[j]);
    }

    for (i = myCharStyles.length - 1; i >= 1; i--) {
        removeUnusedCharStyle(myCharStyles[i]);
    }

    function removeUnusedParaStyle(myPaStyle) {
        app.findTextPreferences = NothingEnum.nothing;
        app.changeTextPreferences = NothingEnum.nothing;
        app.findTextPreferences.appliedParagraphStyle = myPaStyle;
        var myFoundStyles = myDoc.findText();
        if (myFoundStyles == 0) {
            myPaStyle.remove();
        }
        app.findTextPreferences = NothingEnum.nothing;
        app.changeTextPreferences = NothingEnum.nothing;
    }

    function removeUnusedCharStyle(myChStyle) {
        app.findTextPreferences = NothingEnum.nothing;
        app.changeTextPreferences = NothingEnum.nothing;
        app.findTextPreferences.appliedCharacterStyle = myChStyle;
        var myFoundStyles = myDoc.findText();
        if (myFoundStyles == 0) {
            myChStyle.remove();
        }
        app.findTextPreferences = NothingEnum.nothing;
        app.changeTextPreferences = NothingEnum.nothing;
    }
} catch (e) {
    alert(e);
}
