var doc = app.documents.item(0);

app.findGrepPreferences = NothingEnum.nothing; // now empty the find what field!!! that's important!!!
app.changeGrepPreferences = NothingEnum.nothing; // empties the change to field!!! that's important!!!

// some settings
app.findChangeGrepOptions.includeFootnotes = true;
app.findChangeGrepOptions.includeHiddenLayers = false;
app.findChangeGrepOptions.includeLockedLayersForFind = false;
app.findChangeGrepOptions.includeLockedStoriesForFind = true;
app.findChangeGrepOptions.includeMasterPages = true;

var greps = [
    { "findWhat": "(“|‘|~”|“|”|~’|‘|’|«|») (…)", "changeTo": "$1$2" },
    { "findWhat": "(…) (“|‘|~”|“|”|~’|‘|’|«|»)", "changeTo": "$1$2" },
    { "findWhat": "(?=^|\\!|\\?)\\s?(“|‘|~”|“|”|~’|‘|’|«|»)\\s?(…|“|‘|~”|“|”|~’|‘|’|«|»|[A-Za-zА-Яа-я0-9_])", "changeTo": "$1$2" },
    { "findWhat": "\\s(“|‘|~”|“|”|~’|‘|’|«|»)(?=\\.|\\,|\\!|\\?|\\:|\\;)", "changeTo": "\"" },
    { "findWhat": "(\\,|\\.|—|–|\\-|\\:|\\;)[^\\r]?(“|‘|~”|“|”|~’|‘|’|«|»)\\s?", "changeTo": "$1\\s$2" },

]

// loop thru the greps object
for (var i = 0; i < greps.length; i++) {
    // this is like entering the find what text in the UI
    app.findGrepPreferences.findWhat = greps[i].findWhat;
    // this is like entering text in the change to
    app.changeGrepPreferences.changeTo = greps[i].changeTo;
    // and now hit the button
    doc.changeGrep();

    app.findGrepPreferences = NothingEnum.nothing; // now empty the find what field!!! that's important!!!
    app.changeGrepPreferences = NothingEnum.nothing; // empties the change to field!!! that's important!!!
};