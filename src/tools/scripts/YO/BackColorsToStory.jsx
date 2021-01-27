// VernutOriginalColors.jsx
//
//DESCRIPTION: Скрипт возвращает сохраненные скриптом Vernut'BukvuYO(TakeColorsIntoAccount).jsx цвета всеx измененных при проверке слов.
//
// Vernut'BukvuYO!.jsx
//
// © Михаил Иванюшин, 2013 ivanyushin#yandex.ru
// InDesign CS4, InDesign CS5
// 
// 
#target indesign
#targetengine "SaveYO"
app.scriptPreferences.version = 6;
myProgramTitul = " Восстановление цвета слов  |  © adobeindesign.ru, 2013 | (v. 11.06.2013)";
// идея прогресс-бара взята отсюда: http://forums.adobe.com/message/3152162#3152162
var ProgressBar = function(title) {
var w = new Window('palette', title, {x:0, y:0, width:640, height:60},{closeButton: false}),
pb = w.add('progressbar', {x:20, y:32, width:600, height:12}),
st = w.add('statictext', {x:20, y:12, width:600, height:20});
st.justify = 'left';
w.center();
this.reset = function(msg,maxValue) {
st.text = msg;
pb.value = 0;
pb.maxvalue = maxValue;
w.show();
w.update();
};
this.hit = function() {++pb.value; w.update();};
this.hide = function() {w.hide();};
this.close = function() {w.close();};
} // ProgressBar

function main() {
var myStory;
var myLine;
if(app.documents.length == 0) { // app.documents.length == 0
  alert(" Нет открытых документов.",myProgramTitul);
  exit();  
} // app.documents.length == 0
app.scriptPreferences.version = 6;
var mySelection = app.selection[0];
var myDocument = app.documents[0];
if(app.selection.length == 0) { // app.selection.length == 0
  alert(" Ничего не выделено.",myProgramTitul);
  exit();      
}  // app.selection.length == 0    
if(app.selection.length != 0) { // app.selection.length != 0
if (mySelection.constructor.name != "InsertionPoint") { // != "InsertionPoint"
  alert(" Курсор должен быть в статье. Ничего выделять не надо.",myProgramTitul);
  exit();  
} // != "InsertionPoint"
} // app.selection.length != 0
myStory = mySelection.parentStory;	
var myDate = new Date;
var myTimeStart = myDate.getTime();
var myHour = myDate.getHours();
var myMinutes = myDate.getMinutes();
if (myHour <10) myHour = "0" + myHour;
if (myMinutes <10) myMinutes = "0" + myMinutes;
var myDefSetName  = "InfoAboutBykvaYO.ini"
var myScriptPath = myGetScriptPath();
var myScriptFolder = decodeURI(myScriptPath.path);
var myFilePath = decodeURI(myScriptFolder + "/Progs/" + myDefSetName); 
var myInfoFile = new File (myFilePath);
var myF = myInfoFile.open("r");
if (myF == false) { // == false
  alert(" Не найден файл InfoAboutBykvaYO.ini.\nОн создаётся скриптом Vernut'BukvuYO(ColoredStory).jsx при обработке цветных текстов.",myProgramTitul);
  exit(); 
} // == false  
a=0;
var myLineArray = [];
var myTmp = "";
do {
    myTmp = myInfoFile.readln();
    myLineArray.push(myTmp); 
    }
while (myTmp.length != 0);
myLineArray.pop();
if (myLineArray[0] != myDocument.name) { // !=
  alert("Последний файл, обработанный скриптом Vernut'BukvuYO(ColoredStory).jsx,\nназывался '" + decodeURI(myLineArray[0]) + "'.\nЭто совсем не тот файл, что сейчас на экране.",myProgramTitul);
  exit();     
}
myLineArray.shift(); // удалим имя работы из массива
var myNumberOfStep = myLineArray.length;
///---
var myInfoArray = [];
var pBar = new ProgressBar(myProgramTitul);
pBar.reset(" Восстановление цвета началось. Время начала обработки [ч:м] " + myHour + ":" +myMinutes, myNumberOfStep);
for ( i = 0; i < myNumberOfStep; i++) { // i++
while (myInfoArray.length != 0)  myInfoArray.pop();
var myInfo = myLineArray.shift(); // считана строка. Она хранит информацию: индекс первой буквы слова, название цвета этой буквы, название цвета следующей буквы, ...
myInfoArray = myInfo.split(","); // превращаем строку в массив
var myCurIndex = myInfoArray[0]; // это индекс первой буквы слова в статье
var myCurLineLength = myInfoArray.length - 1; // длина слова
for (j = 0; j < myCurLineLength; j++) { // j++
   myStory.characters[Number(myCurIndex)+j].fillColor = myDocument.swatches.item(myInfoArray [j+1]); // каждой букве слова её первоначальный цвет
    } // j++
} // i++
myInfoFile.close();
pBar.close();
alert("Готово!",myProgramTitul);
exit();
} // main()
////////////
function myGetScriptPath() { //myGetScriptPath()
	try{
		return app.activeScript;
	}
	catch(myError){
		return File(myError.fileName);
	}
} //myGetScriptPath()
///////////

main();
/////
