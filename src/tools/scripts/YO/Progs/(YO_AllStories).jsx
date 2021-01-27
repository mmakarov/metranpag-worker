//DESCRIPTION: Программа анализирует слова, в которых есть буква 'е' и восстанавливает букву 'ё', если она должна быть в этом слове.
//
// Vernut'BukvuYO!.jsx
//
// Обработка выделенного текста, всей статьи, в которой стоит курсор, или всех статей документа, если ничего не выделено.
//
// © Михаил Иванюшин, 2011-2013 ivanyushin#yandex.ru
// InDesign CS4 -- InDesign CS6
//
// Описание программы
// Программа анализирует слова, в которых есть буква 'е' и восстанавливает букву 'ё', если она должна быть в этом слове.
// Все слова, в которых проведена такая замена, окрашиваются цветом myRightYOColor.
// Если программа находит слово, в котором могут быть обе буквы, например, <настойка 'белены'> и <стены 'белёны'>, или <полотна'смётаны'> и <чашка 'сметаны'>,
// то это слово окрашивается цветом myProblemYOColor. После обработки текста надо в режиме поиска найти эти слова и понять из контекста, какая буква там должна быть.
// Для поиска на вкладке GREP укажите шаблон поиска \b\w*\b
// и определите цвет искомого слова.
// Обрабатывается вся статья, включая таблицы и сноски, если курсор стоит в тексте, или только выделенный текст.
// Если ничего не выделено, проверяются все статьи документа.
// При запуске скрипта всегда есть пауза в несколько секунд -- это грузится база русских слов с буквой 'ё'. 
// Она не маленькая, так что наберитесь терпения на несколько секунд, пока не появится окно с градусником.
// Особенности программной реализации.
// Поиск слов, в которых возможно нахождение буквы 'ё' выполняется при помощи ассоциативного массива.
// myRight_YO_Word — функция, возвращающая результат обращения к ассоциативному массиву yo[ ].
// Ассоциативный массив отличается от обычного тем, что если в обычном к элементу массива обращаются, указав индекс,
// то в ассоциативном массиве для получения переменной массива надо указать входную переменную.
// Например, обращение myRight_YO_Word [ еще ]  вернет нам слово 'ещё'.
// Обращение myRight_YO_Word [ свет ]  вернет нам значение undefined, т.к. этого слова в массиве нет.
// Обращение myRight_YO_Word [ сметаны ]  вернет нам слово '*сметаны', т.к. это слово может быть как с буквой ё, так и без неё.
//
// Возможности развития программы
// Ассоциативный массив слов с буквой 'ё' сделан на базе информации с сайта http://python.anabar.ru/yo.htm.
// Собранные там 59746 словоформ — это практически все слова с буквой 'ё', имеющиеся в русском языке.
// При отладке добавилось ещё несколько словоформ.
// Удалено как крайне редкое слово 'лёт' (весенний лёт птиц/насекомых). Слово 'лет' (десять лет) встречается на порядки чаще.
// Ассоциативный массив хранится в файле YO_words.jsx. Его формат очень простой. Сложнее найти инструмент, при помощи которого можно пополнить этот массив.
// Для майксофтовского ворда этот файл слишком тяжел.
// Было бы хорошей идеей хранить на нашем сайте созданные пользователями версии ассоциативного массива. 
// В частности, русских имен и фамилий с буквой 'ё' вместе спадежными  словоформами тоже будет тысяч двадцать-тридцать.
//
#include YO_words.jsx

#target indesign
#targetengine "SaveYO"

win.close (); // закроем окно сообщения, появившееся в скрипте Vernut'BukvuYO(AllStories).jsx, этот скрипт и вызывает данный скрипт.
app.scriptPreferences.version = 6;
myProgramTitul = " Вернём букву Ё в издания на русском языке! |  © adobeindesign.ru, 2011, 2013 |  (v. 12.06.2013)";
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
//w.show();
//w.update();
};
this.hit = function() {++pb.value; w.update();};
this.hide = function() {w.hide();};
this.close = function() {w.close();};
} // ProgressBar

function main() {
app.scriptPreferences.version = 6;    
var myRezArray = [0,0]; // myCounterOK = 0 и myCounterProblem = 0
var myYO_Info;
var myStory;
var pBar;
var myTxtInfo = "";
var myLine, myPartOfLine, myPartOfWord;
//myRightYOColor — шаблон цвета для слов, где проведена замена 'е' на 'ё'
myRightYOColorSample = [100, 0, 100, 0]; 
//myProblemYOColor — шаблон цвета для слов, в которых может быть любая из букв
myProblemYOColorSample = [0, 100, 100, 0]; 
if(app.documents.length != 0) { // app.documents.length != 0
//////////if(app.selection.length != 0) { // app.selection.length != 0
var myDocument = app.documents[0];
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
myAllStories = false;
if (app.selection.length != 0) { // app.selection.length != 0
var mySelection = app.selection[0];	
if ((mySelection.constructor.name == "InsertionPoint") || (mySelection.constructor.name == "Text")) { // == "InsertionPoint"
	if (mySelection.constructor.name == "InsertionPoint") myStory = mySelection.parentStory;	
	if (mySelection.constructor.name == "Text") myStory = mySelection;
	pBar = new ProgressBar(myProgramTitul);
	var myRezArr = myFindChangeYU(myStory,myHour,myMinutes,myRezArray[0],myRezArray[1],pBar,myTxtInfo,0);
	myRezArray[0] = myRezArr[0]; // myCounterOK
	myRezArray[1]  = myRezArr[1]; // myCounterProblem
    var myFW = myRezArr[2]; 
} // == "InsertionPoint"
else {
	alert("Поместите курсор в текст для проверки всего текста, или выберите его часть, которую надо обработать.\nЕсли надо обработать все статьи, снимите выборку со всех объектов (клавиши Ctrl+Shift+A) и запустите скрипт.",myProgramTitul);	
	exit();
}
} // app.selection.length != 0
else { // обработка всех статей
    myAllStories = true;
    var myFW = 0;
	pBar = new ProgressBar(myProgramTitul);
	for (i = 0; i < app.documents[0].stories.length; i++) { // app.documents[0].stories
		myTxtInfo = "Статья " + String (i+1) + " из " + String (app.documents[0].stories.length) + ": ";
		var myTimeStartTmp = myDate.getTime();
		var myHourTmp = myDate.getHours();
		var myMinutesTmp = myDate.getMinutes();
		if (myHourTmp <10) myHour = "0" + myHourTmp;
		if (myMinutesTmp <10) myMinutesTmp = "0" + myMinutesTmp;
		myStory = app.documents[0].stories[i];
		var myRezArrTmp = myFindChangeYU(myStory,myHourTmp,myMinutesTmp,myRezArray[0],myRezArray[1],pBar,myTxtInfo,myFW);
		myRezArray[0] = myRezArrTmp[0]; // myCounterOK
		myRezArray[1]  = myRezArrTmp[1]; // myCounterProblem
         myFW = myRezArrTmp[2];
		} // app.documents[0].stories
	myTxtInfo = "Число обработанных статей: " + String(app.documents[0].stories.length);
} // обработка всех статей	
pBar.close();
a=0;
if (myRezArray[0] == 0 &&  myRezArray[1] == 0) {
	alert(" Не найдено ни одного слова, где требовалась бы замена.",myProgramTitul);
	exit();
	}
var myDateFinish = new Date;
var myTimeFinis = myDateFinish.getTime();
var myTime = myTimeFinis - myTimeStart;
var myTimeInSec = (myTime/1000).toFixed(1);
var mySpeed = (myTime/myFW).toFixed(1);
var myProcTime = myTxtInfo + "\n\nВремя работы программы: " +myTimeInSec + " секунд.\nТемп обработки: " + mySpeed + " миллисекунды на одно слово.\n";
var myOKInfo;
if (myRezArray[0] !=0) myOKInfo = "\n\nОднозначные замены буквы е на букву ё сделаны. Эти слова отмечены цветом 'myRightYOColor'. Число замен: " + myRezArray[0] + ".";
else myOKInfo = "\n\nНе найдено ни одного слова, где требовалась бы замена.";
var myProblemInfo;
if (myRezArray[1] != 0) {
	myProblemInfo = "\n\nСлова, в которых возможно написание обеих этих букв, отмечены цветом 'myProblemYOColor'. Таких слов: " + myRezArray[1]  + ".\nДля поиска этих слов используйте инструмент Поиск/Замена.";
	// следующие две строки кода нужны лишь для того, чтобы на GREP-вкладке окна поиска/замены в условиях поиска указать цвет искомого слова. Шаблон искомого слова там уже есть
	app.findGrepPreferences.fillColor = "myProblemYOColor";				
	myFoundedWords = myStory.findGrep();	
	////
	}
else myProblemInfo = "\n\nНе найдены слова, в которых возможно написание обеих этих букв.";
//alert(myProcTime + myOKInfo + myProblemInfo,myProgramTitul);
exit();
alert(" \nПоместите курсор в текст для проверки всего текста, или выберите его часть, которую надо обработать.\nЕсли надо обработать все статьи, снимите выборку со всех объектов (клавиши Ctrl+Shift+A) и запустите скрипт.",myProgramTitul);	
exit();
} // app.documents.length != 0
alert(" \nНет открытых документов.\n",myProgramTitul);	
exit();
} // main()

main();
/////
function myFindChangeYU(myStory,myHour,myMinutes,myCounterOK,myCounterProblem,pBar,myTxtInfo,myFW) { // myFindChangeYU
var myRezArray = [];
myRezArray[0] = myCounterOK;
myRezArray[1] = myCounterProblem;
myRezArray[2] = myFW;
pBar.reset(myTxtInfo + "Поиск слов, в которых есть буква 'е'...", 1);	
// ищем слово, в котором есть буква е или Е
// var mySampleForSearchWordWithCharE = '\\b\\w*[еЕ]\\w*\\b';  28.09.2011
var mySampleForSearchWordWithCharE = '\\b\\w*[еЕ]\\w*[-]?\\w*\\b';
app.findGrepPreferences = NothingEnum.nothing;
app.findGrepPreferences.findWhat = mySampleForSearchWordWithCharE;				
myFoundedWords = myStory.findGrep();
myRezArray[2] += myFoundedWords.length;
if (myFoundedWords.length != 0) { // != 0
var pBar = new ProgressBar(myProgramTitul);
pBar.reset(myTxtInfo + " Обработка началась. Время начала обработки [ч:м] " + myHour + ":" +myMinutes, myFoundedWords.length);
// цикл по числу элементов коллекции. Движение снизу вверх
    for (j=myFoundedWords.length-1; j >= 0; j--, pBar.hit()) { //  j >= 0
//    for (j = 0; j < myFoundedWords.length; j++, pBar.hit()) { //  j < 0			
		myLine = myFoundedWords[j];
		var myWord = myRight_YO_Word[myLine.contents.toLowerCase()]; // найденное слово переводится в нижний регистр и передается в ассоциативный массив
		if (myWord == undefined) continue; // такого слова в ассоциативном масиве нет
		if (myWord[0] == "*") { // возможны варианты написания этого слова
			//myLine.fillColor = "myProblemYOColor";
			myRezArray[1]++;
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
		//myLine.fillColor = "myRightYOColor";
		myRezArray[0]++;
	} // j >= 0
return myRezArray;
} // != 0
//if (myAllStories == false) alert(" \nНе найдено ни одного слова с буквой 'е'! Ну и тексты у вас, однако...  : ))\n",myProgramTitul);
return myRezArray;
} // myFindChangeYU
///////////