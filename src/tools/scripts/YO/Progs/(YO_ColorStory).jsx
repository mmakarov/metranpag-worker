//DESCRIPTION: Программа анализирует слова, в которых есть буква 'е' и восстанавливает букву 'ё', если она должна быть в этом слове. При этом собирается информация о цвете изменяемых слов, чтобы позже восстановить его при помощи скрипта VernutOriginalColors.jsx
//
// Vernut'BukvuYO!.jsx
//
// © Михаил Иванюшин, 2011 ivanyushin#yandex.ru
// InDesign CS4, InDesign CS5
//
// Описание программы
// Программа анализирует слова, в которых есть буква 'е' и восстанавливает букву 'ё', если она должна быть в этом слове.
// Все слова, в которых проведена такая замена, окрашиваются цветом myRightYOColor.
// Если программа находит слово, в котором могут быть обе буквы, например, <настойка 'белены'> и <стены 'белёны'>, или <полотна'смётаны'> и <чашка 'сметаны'>,
// то это слово окрашивается цветом myProblemYOColor. После обработки текста надо в режиме поиска найти эти слова и понять из контекста, какая буква там должна быть.
// Для поиска на вкладке GREP укажите шаблон поиска \b\w*\b
// и определите цвет искомого слова.
// Обрабатывается вся статья, включая таблицы и сноски, если курсор стоит в тексте, или только выделенный текст.
// При запуске скрипта всегда есть пауза в несколько секунд -- это грузится база русских слов с буквой 'ё'. 
// Она не маленькая, так что наберитесь терпения на несколько секунд, пока не появится окно с градусником.
//
// Особенности программной реализации
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
// При отладке добавилось ещё три словоформы.
// Ассоциативный массив хранится в файле YO_words.jsx. Его формат очень простой. Сложнее найти инструмент, при помощи которого можно пополнить этот массив.
// Для майксофтовского ворда этот файл слишком тяжел.
// Было бы хорошей идеей хранить на нашем сайте созданные пользователями версии ассоциативного массива. 
// В частности, русских иимен и фамилий с буквой 'ё' вместе спадежными  словоформами тоже будет тысяч двадцать-тридцать.
//

#include YO_words.jsx

#target indesign
#targetengine "SaveYO"
app.scriptPreferences.version = 6;
win.close ();
myProgramTitul = " Вернём букву Ё в цветные издания на русском языке!   |    © adobeindesign.ru, 2013   |   (v. 12.06.2013)";
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
app.scriptPreferences.version = 6;
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
pBar.reset("Поиск слов, в которых есть буква 'е'...", 1);	
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
// ищем слово, в котором есть буква е или Е
var mySampleForSearchWordWithCharE = '\\b\\w*[еЕ]\\w*\\b';
app.findGrepPreferences = NothingEnum.nothing;
app.findGrepPreferences.findWhat = mySampleForSearchWordWithCharE;				
myFoundedWords = myStory.findGrep();
if (myFoundedWords.length != 0) { // != 0
var myCounterOK = 0;
var myCounterProblem = 0;
///---    
var myDefSetName  = "InfoAboutBykvaYO.ini"
var myScriptFile = myGetScriptPath();
var myScriptFolder = decodeURI(myScriptFile.path);
var myFilePath = decodeURI(myScriptFolder + "/" + myDefSetName); 
var mySetInfoFile = new File (myFilePath);
tt = mySetInfoFile.open("w");
mySetInfoFile.writeln(myDocument.name);
///---
var myCurLineInfo = [];
var pBar = new ProgressBar(myProgramTitul);
pBar.reset(" Обработка началась. Время начала обработки [ч:м] " + myHour + ":" +myMinutes, myFoundedWords.length);
// цикл по числу элементов коллекции. Движение снизу вверх
    //for (j=myFoundedWords.length-1; j >= 0; j--, pBar.hit()) { //  j >= 0
for (j = 0; j < myFoundedWords.length; j++, pBar.hit()) { //  j < 0			
		myLine = myFoundedWords[j];
		a=0;
		var myWord = myRight_YO_Word[myLine.contents.toLowerCase()]; // найденное слово переводится в нижний регистр и передается в ассоциативный массив
		if (myWord == undefined) continue; // такого слова в ассоциативном масиве нет
///=-   сохраним информацию об индексе и цвете каждой буквы слова     
          while (myCurLineInfo.length != 0) myCurLineInfo.pop();
         myCurLineInfo.push(String(myLine.index));
         for (c = 0; c < myLine.length; c++) { 
             myCurLineInfo.push(myLine.characters[c].fillColor.name); 
         } 
         var myLineForSave = myCurLineInfo.join(",");
         mySetInfoFile.writeln(myLineForSave);
///=-                
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
mySetInfoFile.close();
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
if (myCounterOK !=0) myOKInfo = "\nОднозначные замены буквы е на букву ё сделаны. Эти слова отмечены цветом 'myRightYOColor'. Число замен: " + myCounterOK + ".";
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
var myColorBack = "\n\n---------------\n\nДля возврата цвета всех измененных при проверке слов служит программа BackColorsToStory.jsx.";
alert(myProcTime + myOKInfo + myProblemInfo + myColorBack,myProgramTitul);
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
