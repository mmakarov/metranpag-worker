app.open(arguments[1]);
var file = arguments[0];

var doc = app.documents.item(0);
var initPage = doc.pages.item(0);

var marginX = initPage.marginPreferences.left;
var marginY = initPage.marginPreferences.top;

app.wordRTFImportPreferences.convertPageBreaks = ConvertPageBreaks.none;
app.wordRTFImportPreferences.importEndnotes = true;
app.wordRTFImportPreferences.importFootnotes = true;
app.wordRTFImportPreferences.importIndex = true;
app.wordRTFImportPreferences.importTOC = true;
app.wordRTFImportPreferences.importUnusedStyles = false;
app.wordRTFImportPreferences.preserveGraphics = false;
app.wordRTFImportPreferences.convertBulletsAndNumbersToText = true;
app.wordRTFImportPreferences.removeFormatting = false;
app.wordRTFImportPreferences.preserveTrackChanges = false;
app.wordRTFImportPreferences.resolveParagraphStyleClash = ResolveStyleClash.resolveClashUseExisting;
app.wordRTFImportPreferences.useTypographersQuotes = false;

try {
    var showSettings = false;

    if (arguments[10] == 'false') {
        showSettings = true;
    }

    var story = initPage.place(file, [marginX, marginY], undefined, showSettings, true);

    var doc = app.documents.item(0);
    var page = doc.pages[0];
    var frame = page.textFrames[0];
    var selection = frame.parentStory.texts.everyItem().select();


    /*if (arguments[9] == 'true') {
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
    }*/

    var myDocument = app.documents.item(0);

    for (a = 0; a < myDocument.pages.length; a++) {
        for (b = 0; b < myDocument.pages[a].textFrames.length; b++) {

            for (c = 0; c < myDocument.pages[a].textFrames[b].paragraphs.length; c++)
                if (myDocument.pages[a].textFrames[b].paragraphs[c].appliedParagraphStyle.name === "Header") {
                    myDocument.pages[a].appliedMaster = myDocument.masterSpreads.item('B-Master');
                }
        }
    }
} catch (e) {
    alert(e);
}
