function main(docPath, templatePath, importWordPath, doTextPath, doQuotesPath, yoPath, checkbox1, checkbox2, checkbox3, checkbox4, checkbox5) {
    try {
        var myDocument = app.documents.item(0);
        //alert(app.documents[0].tocStyles.everyItem().name);  
        //app.activeDocument.pages.add(LocationOptions.BEFORE, app.activeDocument.pages[0]);
        //myDocument.createTOC(myDocument.tocStyles[1], true)

        function myGetBounds(myDocument, myPage) {
            var myWidth = myDocument.documentPreferences.pageWidth; var myHeight = myDocument.documentPreferences.pageHeight; var myX1 = myPage.marginPreferences.left;
            var myY1 = myPage.marginPreferences.top;
            var myX2 = myWidth - myPage.marginPreferences.right;
            var myY2 = myHeight - myPage.marginPreferences.bottom; return [myY1, myX1, myY2, myX2];
        }

        function toc() {
            //    Set MyTOCStyle = myDoc.TOCStyles.Add 
            //Set myPage = myDocument.Pages.Item(1) 
            var myTOCStyle = myDocument.tocStyles.itemByName("TOC Style");
            //var myTocPage = myDocument.pages.add(LocationOptions.AT_END);
            var myTocPage = app.activeDocument.pages.add(LocationOptions.BEFORE, app.activeDocument.pages[0]);
            var myBounds = myGetBounds(myDocument, myTocPage);
            var myX1 = myBounds[1];
            var myY1 = myBounds[0];
            var myStory = myDocument.createTOC(myTOCStyle, true, undefined, [myX1, myY1]);
        }

        toc();
    } catch (e) {
        alert(e);
    }
}