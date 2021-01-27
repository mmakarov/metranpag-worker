// DoTextOK 2012

#targetengine "dotextok2012" 

if (app.name != "Adobe InDesign") { alert ("Этот скрипт должен запускаться в программе InDesign."," Подготовка текста к вёрстке "); exit(); }
app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll; // см. http://adobeindesign.ru/2008/10/24/restore-ui/
if(app.documents.length == 0) {
    alert("Нет открытых документов.", " Подготовка текста к вёрстке ");	
    exit();    
    }
var parseIntAppVersion = parseInt (app.version); 
if (parseIntAppVersion < 6) { // app.version
	alert ("Этот скрипт предназначен для обработки текста в InDesign CS4+.", " Подготовка текста к вёрстке ");
    exit();
    } // app.version

//myFastUsage = false; // true -- скрипт запускается с текущими установками. false -- выводится окно выбора параметров
//myEditCurSet = true; // true - окно со списком созданных ранее dtok-файлов не выводится. Загружается текущий #DoTextOK.dtok файл

// Варианты скрипта: 
// [Make New Set]
myFastUsage = false;
myEditCurSet = true;

// [Use Current Set]
//myFastUsage = true; 
//myEditCurSet = true;

// [Load The Set]
//myFastUsage = false; 
//myEditCurSet = false; 

#include "DoTextOK.jsxinc"
