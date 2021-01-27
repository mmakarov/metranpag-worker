try {
    var doc = app.documents.item(0);
    var page = doc.pages[0];
    var frame = page.textFrames[0];
    var selection = frame.parentStory.texts.everyItem().select();
    var i;

    applyStyles = arguments[11].split(":");
    //Loop thru styles that we need to change
    for (i = 0; i < applyStyles.length; i++) {
        var type = applyStyles[i].split(";")[0];
        var findStyle = applyStyles[i].split(";")[1];
        var applyStyle = applyStyles[i].split(";")[2];

        if (type === "paragraph") {
            for (var counter = 0; counter < doc.paragraphStyles.length; counter++) {
                var style = doc.paragraphStyles.item(counter);
                if (style.name == findStyle) {
                    for (var counter = 0; counter < doc.paragraphStyles.length; counter++) {
                        var style2 = doc.paragraphStyles.item(counter);
                        if (style2.name == applyStyle) {
                            app.findGrepPreferences = NothingEnum.nothing;
                            app.changeGrepPreferences = NothingEnum.nothing;

                            app.findChangeGrepOptions.includeFootnotes = false;
                            app.findChangeGrepOptions.includeHiddenLayers = false;
                            app.findChangeGrepOptions.includeLockedLayersForFind = false;
                            app.findChangeGrepOptions.includeLockedStoriesForFind = false;
                            app.findChangeGrepOptions.includeMasterPages = false;

                            app.findGrepPreferences.appliedParagraphStyle = style;

                            app.changeGrepPreferences.appliedParagraphStyle = style2;

                            doc.changeGrep();

                            app.findGrepPreferences = NothingEnum.nothing;
                            app.changeGrepPreferences = NothingEnum.nothing;
                        }
                    }
                }
            }
        } 
        if (type === "char") {
            for (var counter = 0; counter < doc.characterStyles.length; counter++) {
                var style = doc.characterStyles.item(counter);
                if (style.name == findStyle) {
                    for (var counter = 0; counter < doc.characterStyles.length; counter++) {
                        var style2 = doc.characterStyles.item(counter);
                        if (style2.name == applyStyle) {
                            app.findGrepPreferences = NothingEnum.nothing;
                            app.changeGrepPreferences = NothingEnum.nothing;

                            app.findChangeGrepOptions.includeFootnotes = false;
                            app.findChangeGrepOptions.includeHiddenLayers = false;
                            app.findChangeGrepOptions.includeLockedLayersForFind = false;
                            app.findChangeGrepOptions.includeLockedStoriesForFind = false;
                            app.findChangeGrepOptions.includeMasterPages = false;

                            app.findGrepPreferences.appliedCharacterStyle = style;

                            app.changeGrepPreferences.appliedCharacterStyle = style2;

                            doc.changeGrep();

                            app.findGrepPreferences = NothingEnum.nothing;
                            app.changeGrepPreferences = NothingEnum.nothing;
                        }
                    }
                }
            }
        }

        if (type === "textstyle" && findStyle === "italic") {
            for (var counter = 0; counter < doc.characterStyles.length; counter++) {
                var style = doc.characterStyles.item(counter);
                if (style.name.toUpperCase() == applyStyle.toUpperCase()) {
                    app.findGrepPreferences = NothingEnum.nothing;
                    app.changeGrepPreferences = NothingEnum.nothing;
        
                    app.findChangeGrepOptions.includeFootnotes = false;
                    app.findChangeGrepOptions.includeHiddenLayers = false;
                    app.findChangeGrepOptions.includeLockedLayersForFind = false;
                    app.findChangeGrepOptions.includeLockedStoriesForFind = false;
                    app.findChangeGrepOptions.includeMasterPages = false;
        
                    app.findGrepPreferences.fontStyle = "Italic";
        
                    app.changeGrepPreferences.appliedCharacterStyle = style;
        
                    doc.changeGrep();
        
                    app.findGrepPreferences = NothingEnum.nothing;
                    app.changeGrepPreferences = NothingEnum.nothing;
                }
            }
        }

        if (type === "textstyle" && findStyle === "bold") {
            for (var counter = 0; counter < doc.characterStyles.length; counter++) {
                var style = doc.characterStyles.item(counter);
                if (style.name.toUpperCase() == applyStyle.toUpperCase()) {
                    app.findGrepPreferences = NothingEnum.nothing;
                    app.changeGrepPreferences = NothingEnum.nothing;
        
                    app.findChangeGrepOptions.includeFootnotes = false;
                    app.findChangeGrepOptions.includeHiddenLayers = false;
                    app.findChangeGrepOptions.includeLockedLayersForFind = false;
                    app.findChangeGrepOptions.includeLockedStoriesForFind = false;
                    app.findChangeGrepOptions.includeMasterPages = false;
        
                    app.findGrepPreferences.fontStyle = "Bold";
        
                    app.changeGrepPreferences.appliedCharacterStyle = style;
        
                    doc.changeGrep();
        
                    app.findGrepPreferences = NothingEnum.nothing;
                    app.changeGrepPreferences = NothingEnum.nothing;
                }
            }
        }
        if (type === "textstyle" && findStyle === "underline") {
            for (var counter = 0; counter < doc.characterStyles.length; counter++) {
                var style = doc.characterStyles.item(counter);
                if (style.name.toUpperCase() == applyStyle.toUpperCase()) {
                    app.findGrepPreferences = NothingEnum.nothing;
                    app.changeGrepPreferences = NothingEnum.nothing;
        
                    app.findChangeGrepOptions.includeFootnotes = false;
                    app.findChangeGrepOptions.includeHiddenLayers = false;
                    app.findChangeGrepOptions.includeLockedLayersForFind = false;
                    app.findChangeGrepOptions.includeLockedStoriesForFind = false;
                    app.findChangeGrepOptions.includeMasterPages = false;
        
                    app.findGrepPreferences.underline = true;
        
                    app.changeGrepPreferences.appliedCharacterStyle = style;
        
                    doc.changeGrep();
        
                    app.findGrepPreferences = NothingEnum.nothing;
                    app.changeGrepPreferences = NothingEnum.nothing;
                }
            }
        }
        if (type === "textstyle" && findStyle === "strike") {
            for (var counter = 0; counter < doc.characterStyles.length; counter++) {
                var style = doc.characterStyles.item(counter);
                if (style.name.toUpperCase() == applyStyle.toUpperCase()) {
                    app.findGrepPreferences = NothingEnum.nothing;
                    app.changeGrepPreferences = NothingEnum.nothing;
        
                    app.findChangeGrepOptions.includeFootnotes = false;
                    app.findChangeGrepOptions.includeHiddenLayers = false;
                    app.findChangeGrepOptions.includeLockedLayersForFind = false;
                    app.findChangeGrepOptions.includeLockedStoriesForFind = false;
                    app.findChangeGrepOptions.includeMasterPages = false;
        
                    app.findGrepPreferences.strikeThru = true;
        
                    app.changeGrepPreferences.appliedCharacterStyle = style;
        
                    doc.changeGrep();
        
                    app.findGrepPreferences = NothingEnum.nothing;
                    app.changeGrepPreferences = NothingEnum.nothing;
                }
            }
        }

    };
} catch (e) {
    alert(e);
}
