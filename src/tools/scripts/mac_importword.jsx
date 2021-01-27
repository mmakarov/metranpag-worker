function main(docPath, templatePath, importWordPath, doTextPath, doQuotesPath, yoPath, checkbox1, checkbox2, checkbox3, checkbox4, checkbox5, styles) {
    try {
        var path = importWordPath.substring(0, importWordPath.lastIndexOf("/"))+"/setstyles.jsx";        
        app.doScript(importWordPath, 1246973031); //import word
        app.doScript(path, 1246973031); //set styles
    } catch (e) {
        alert("Launch error: " + e);
    }
}