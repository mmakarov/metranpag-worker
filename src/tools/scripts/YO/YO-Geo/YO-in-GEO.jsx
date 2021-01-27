//DESCRIPTION: Программа анализирует слова, в которых есть буква 'е' и восстанавливает букву 'ё', если она должна быть в этом слове.
//
// YO-in-GEO.jsx
//
// © Михаил Иванюшин, 2012 ivanyushin#yandex.ru
// InDesign CS4, InDesign CS5
//
// Это вариант, работающий с файлом географических названий
//
// Описание программы в скрипте Vernut'BukvuYO!.jsx
// myRight_YO_GEOWord - так назван массив географических названий, в которых есть буква ё.
// Эта программа ищет массив с именно этим названием.
// Массив хранится в файле YO&GEO-words.jsx
//
#include YO&GEO-words.jsx

#target indesign
#targetengine "YOinGEO"

myProgramTitul = " Буква Ё в географических названиях  |  © adobeindesign.ru, 2012   |   (v. 24.04.2012)";
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
};
this.hit = function() {++pb.value;};
this.hide = function() {w.hide();};
this.close = function() {w.close();};
} // ProgressBar

function main() {
var myYO_Info;
var myStory;
var myLine, myPartOfLine, myPartOfWord;
//myRightYOColor — шаблон цвета для слов, где проведена замена 'е' на 'ё'
myRightYOColorSample = [100, 0, 100, 0]; 
//myProblemYOColor — шаблон цвета для слов, в которых может быть любая из букв
myProblemYOColorSample = [0, 100, 100, 0]; 

if(app.documents.length != 0) { // app.documents.length != 0
if(app.selection.length != 0) { // app.selection.length != 0
var mySelection = app.selection[0];
var myDocument = app.documents[0];
if ((mySelection.constructor.name == "InsertionPoint") || (mySelection.constructor.name == "Text")) { // == "InsertionPoint"
if (mySelection.constructor.name == "InsertionPoint") myStory = mySelection.parentStory;	
if (mySelection.constructor.name == "Text") myStory = mySelection;
var pBar = new ProgressBar(myProgramTitul);
pBar.reset("Поиск слов, начинающихся с прописной...", 1);	
var myDate = new Date;
var myTimeStart = myDate.getTime();
var myHour = myDate.getHours();
var myMinutes = myDate.getMinutes();
if (myHour <10) myHour = "0" + myHour;
if (myMinutes <10) myMinutes = "0" + myMinutes;
try{
	myColor = myDocument.colors.item("myRightYOColor");
	myName = myColor.name;
    }
catch (myError) {
	myColor = myDocument.colors.add ({name:"myRightYOColor", model:ColorModel.process, space:ColorSpace.CMYK, colorValue:myRightYOColorSample});
    }
try{
	myColor = myDocument.colors.item("myProblemYOColor");
	myName = myColor.name;
    }
catch (myError) {
	myColor = myDocument.colors.add ({name:"myProblemYOColor", model:ColorModel.process, space:ColorSpace.CMYK, colorValue:myProblemYOColorSample});
    }

var mySampleForSearchWordWithCharE = '(\\b\\u\\l*)(-\\w*\\b)*(-\\w*\\b)*(-\\w*\\b)*';
app.findGrepPreferences = NothingEnum.nothing;
app.findGrepPreferences.findWhat = mySampleForSearchWordWithCharE;				
myFoundedWords = myStory.findGrep();
if (myFoundedWords.length != 0) { // != 0
var myCounterOK = 0;
var myCounterProblem = 0;
var pBar = new ProgressBar(myProgramTitul);
pBar.reset(" Обработка началась. Время начала обработки [ч:м] " + myHour + ":" +myMinutes, myFoundedWords.length);
// цикл по числу элементов коллекции. Движение снизу вверх
    for (j=myFoundedWords.length-1; j >= 0; j--, pBar.hit()) { //  j >= 0
//    for (j = 0; j < myFoundedWords.length; j++, pBar.hit()) { //  j < 0			
		myLine = myFoundedWords[j];
		//var myWord = myRight_YO_GEOWord[myLine.contents.toLowerCase()]; // найденное слово переводится в нижний регистр и передается в ассоциативный массив
         var myWord = myRight_YO_GEOWord[myLine.contents]; // найденное слово передается в ассоциативный массив таким как есть!
		if (myWord == undefined) continue; // такого слова в ассоциативном масиве нет
		if (myWord[0] == "*") { // возможны варианты написания этого слова
			myLine.fillColor = "myProblemYOColor";
			myCounterProblem++;
			continue;
			}
		// замена слова
		if (myLine.contents[0] == myWord[0]) 	myLine.contents = myWord;
		else { // else
		var myArrLine = [];
		var myArrWord = [];
		myArrLine = myLine.contents.split("");
		myArrWord = myWord.split("");
		var myFirstOriginalChar = myArrLine.shift(); // Б ("Березово") | Е ("Елки")
		var myFirstNewChar = myArrWord.shift(); // б ("берёзово")  |  ё ("ёлки")
		if ((myLine.contents[0] == 'Е') && (myWord[0] == 'ё'))  myFirstOriginalChar = 'Ё'; 
		if ((myLine.contents[0] == 'е') && (myWord[0] == 'ё'))  myFirstOriginalChar = 'ё'; 
		myArrWord.unshift(myFirstOriginalChar); // Б,е,р,ё,з,о,в,о | Ё,л,к,и
		myLine.contents = myArrWord.join("");
		} // else
		myLine.fillColor = "myRightYOColor";
		myCounterOK++;
	} // j >= 0
pBar.close();
if (myCounterProblem == 0 &&  myCounterOK == 0) {
	alert(" Не найдено ни одного слова, где требовалась бы замена.",myProgramTitul);
	exit();
	}
var myDateFinish = new Date;
var myTimeFinis = myDateFinish.getTime();
var myTime = myTimeFinis - myTimeStart;
var myTimeInSec = (myTime/1000).toFixed(1);
var mySpeed = (myTime/myFoundedWords.length).toFixed(1);
var myProcTime = "\n\nВремя работы программы: " +myTimeInSec + " секунд.\nТемп обработки: " + mySpeed + " миллисекунды на одно слово.\n";
var myOKInfo;
if (myCounterOK !=0) myOKInfo = "\n\nОднозначные замены буквы е на букву ё сделаны. Эти слова отмечены цветом 'myRightYOColor'. Число замен: " + myCounterOK + ".";
else myOKInfo = "\n\nНе найдено ни одного слова, где требовалась бы замена.";
var myProblemInfo;
if (myCounterProblem != 0) {
	myProblemInfo = "\n\nСлова, в которых возможно написание обеих этих букв, отмечены цветом 'myProblemYOColor'. Таких слов: " + myCounterProblem + ".\nДля поиска этих слов используйте инструмент Поиск/Замена.";
	// следующие две строки кода нужны лишь для того, чтобы на GREP-вкладке окна поиска/замены в условиях поиска указать цвет искомого слова. Шаблон искомого слова там уже есть
	app.findGrepPreferences.fillColor = "myProblemYOColor";				
	myFoundedWords = myStory.findGrep();	
	////
	}
else myProblemInfo = "\n\nНе найдены слова, в которых возможно написание обеих этих букв.";
alert(myProcTime + myOKInfo + myProblemInfo,myProgramTitul);
exit();
} // != 0
alert(" \nНе найдено ни одного слова! Ну и тексты у вас, однако...  : ))\n",myProgramTitul);	
exit();
} // == "InsertionPoint"
alert(" \nПоместите курсор в текст для проверки всего текста, или выберите его часть, которую надо обработать.\n",myProgramTitul);	
exit();
} // app.selection.length != 0
alert(" \nНичего не выбрано.\nПоместите курсор в текст для проверки всего текста, или выберите его часть, которую надо обработать.\n",myProgramTitul);	
exit();
} // app.documents.length != 0
alert(" \nНет открытых документов.\n",myProgramTitul);	
exit();
} // main()

main();
/////
