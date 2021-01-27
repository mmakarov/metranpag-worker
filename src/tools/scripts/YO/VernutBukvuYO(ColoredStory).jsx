//Vernut'BukvuYO(ColoredStory).jsx

#target indesign
#targetengine "SaveYO"
app.scriptPreferences.version = 6;
myProgramTitul = " Вернём букву Ё в цветные издания на русском языке! |  © adobeindesign.ru, 2011, 2013  |  (v. 12.06.2013)";

if(app.documents.length == 0) { // app.documents.length == 0
  alert(" Нет открытых документов.",myProgramTitul);
  exit();  
} // app.documents.length == 0
if (app.selection.length == 0) { // app.selection.length == 0
  alert(" Ничего не выбрано.",myProgramTitul);
  exit();      
} // app.selection.length == 0    
if (app.selection.length != 0) { // app.selection.length != 0
var mySelection = app.selection[0];	
if ((mySelection.constructor.name != "InsertionPoint") && (mySelection.constructor.name != "Text")) { // !=
	alert("Поместите курсор в текст для проверки всего текста, или выберите его часть, которую надо обработать.\n",myProgramTitul);	
	exit();
} // !=
} // app.selection.length != 0

var win = new Window('palette', "Подготовка к работе скрипта, возвращающего в текст слова с буквой Ё", {x:0, y:0, width:690, height:40},{closeButton: false});
st = win.add('statictext', {x:10, y:10, width:680, height:30});
st.text = "Минутку-другую терпения. Выполняется загрузка всех слов с буквой Ё, это порядка 60 тысяч словоформ.";
win.center();
win.show ();

var myScriptForYO  = "(YO_ColorStory).jsx";
var myScriptPath = myGetScriptPath();
var myScriptFolder = decodeURI(myScriptPath.path);
var myFilePath = decodeURI(myScriptFolder + "/Progs/" + myScriptForYO); 
var myScript = File (myFilePath);
if (myScript.exists) {
	try { 
		app.doScript(myScript);
	} 
    catch (e) {
		alert("Ошибка в файле " + myScriptForYO  + ":\n" + e.message);
		exit();
	}
} 
else {
	alert("Не найден файл  " + myScriptForYO  + ".\nОн должен быть в том же каталоге, где размещен выполняемый сейчас скрипт.");
	exit(); 
}   
exit();
//////////////////
function myFile(myFileName) {
var myScriptPath = myGetScriptPath();
var myScriptFolder = decodeURI(myScriptPath.path);
var myFilePath = decodeURI(myScriptFolder + "/" +myFileName);
return myFilePath;
} //myFile
//////
function myGetScriptPath() {
	try{
		return app.activeScript;
	}
	catch(myError){
		return File(myError.fileName);
	}
} //myGetScriptPath()
//////
