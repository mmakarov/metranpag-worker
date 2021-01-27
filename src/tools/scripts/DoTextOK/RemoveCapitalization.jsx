// RemoveCapitalization.jsx

// В свойствах абзаца есть установка запрета переноса слов, набранных прописными буквами.
// Но если слово искусственно оформлено как написанное прописными, это можно сделать при помощи опции ALL_CAPS,
// то на него установка запрета переноса слов из прописных букв действовать не будет.
// И такие слова иногда приходят в текстах, набранных в ворде.
// Чтобы исключить эту неоднозначность, придуман этот скрипт.
// Программа ищет во всей статье символы, которые из строчных при помощи опции ВСЕ ПРОПИСНЫЕ сделаны прописными,
// и на место каждой искусственно созданной прописной буквы помещает настоящую прописную букву.
// Статус ВСЕ ПРОПИСНЫЕ при этом снимается.
//
// Эта программа является своего рода помощником скрипта "Инспектор переносов", см. https://www.facebook.com/longliveindesign/

app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll; // см. http://adobeindesign.ru/2008/10/24/restore-ui/

// Letter файл-ассоциативный массив для перевода строчных букв в прописные
var Letter = {'а':'А','б':'Б','в':'В','г':'Г','д':'Д','е':'Е','ё':'Ё','ж':'Ж','з':'З','и':'И','й':'Й','к':'К','л':'Л','м':'М','н':'Н','о':'О','п':'П','р':'Р','с':'С','т':'Т','у':'У','ф':'Ф','х':'Х','ц':'Ц','ч':'Ч','ш':'Ш','щ':'Щ','ь':'Ь','ы':'Ы','ъ':'Ъ','э':'Э','ю':'Ю','я':'Я','a':'A','b':'B','c':'C','d':'D','i':'I','f':'F','g':'G','h':'H','i':'I','j':'J','k':'K','l':'L','m':'M','n':'N','o':'O','p':'P','q':'Q','r':'R','s':'S','t':'T','u':'U','v':'V','w':'W','x':'X','y':'Y','z':'Z','А':'А','Б':'Б','В':'В','Г':'Г','Д':'Д','Е':'Е','Ё':'Ё','Ж':'Ж','З':'З','И':'И','Й':'Й','К':'К','Л':'Л','М':'М','Н':'Н','О':'О','П':'П','Р':'Р','С':'С','Т':'Т','У':'У','Ф':'Ф','Х':'Х','Ц':'Ц','Ч':'Ч','Ш':'Ш','Щ':'Щ','Ь':'Ь','Ы':'Ы','Ъ':'Ъ','Э':'Э','Ю':'Ю','Я':'Я','A':'A','B':'B','C':'C','D':'D','I':'I','F':'F','G':'G','H':'H','I':'I','J':'J','K':'K','L':'L','M':'M','N':'N','O':'O','P':'P','Q':'Q','R':'R','S':'S','T':'T','U':'U','V':'V','W':'W','X':'X','Y':'Y','Z':'Z'};

myNonbreakingSpace = "\u00A0"; // SpecialCharacters.NONBREAKING_SPACE;
myNonbreakingSpaceFixedWidth = "\u202F"; // SpecialCharacters.FIXED_WIDTH_NONBREAKING_SPACE;
myThinSpace = "\u2009";  // SpecialCharacters.THIN_SPACE;
myHairSpace = "\u200A"; // SpecialCharacters.HAIR_SPACE;
myFigureSpace = "\u2007"; // SpecialCharacters.FIGURE_SPACE;
myPunctuationSpace = "\u2008"; // SpecialCharacters.PUNCTUATION_SPACE;
myThirdSpace = "\u2004";  // SpecialCharacters.THIRD_SPACE;
myQuarterSpace = "\u2005"; // SpecialCharacters.QUARTER_SPACE;
mySixSpace = "\u2006"; // SpecialCharacters.SIXTH_SPACE;
mySpace = "\u0020";
myEnSpace = "\u2002";  // SpecialCharacters.EN_SPACE;
myEmSpace = "\u2003";  // SpecialCharacters.EM_SPACE;
var myAllSpacesValues = [myHairSpace, mySpace, myNonbreakingSpaceFixedWidth, myNonbreakingSpace, mySixSpace, myThinSpace, myQuarterSpace, myThirdSpace, myPunctuationSpace, myEnSpace, myEmSpace];
var SpacesDigitsAndPunctuation =  myAllSpacesValues.join("") + "0123456789.,\"\'?!~e\[\(\)\]";

var ProgressBar = function(title) { // ProgressBar
var w = new Window('palette', title, {x:0, y:0, width:800, height:60},{closeButton: true}),
pb = w.add('progressbar', {x:20, y:32, width:760, height:12}),
st = w.add('statictext', {x:20, y:12, width:760, height:20});
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
this.info = function(msg)  {
    st.text = msg;
    w.show();
};
} // ProgressBar
var pBar;

myCurrentVersionData_xx_xx_xx = "13.03.2016"
var myProgramTitul = " Избавление от ALL_CAPS ( " +myCurrentVersionData_xx_xx_xx +" )" ;

if (app.documents.length == 0) {
    alert ("Нет открытых документов",myProgramTitul);
    exit();
    }
var mySel = app.selection[0];
var myStory = mySel.parentStory;
if (app.selection.length == 0) { // app.selection.length == 0
  alert("Ничего не выбрано.",myProgramTitul);
  exit();      
} // app.selection.length == 0  
if (mySel == undefined || (mySel.parent.constructor.name != "Story")) { //  != "Story"
            alert("Перед запуском программы поставьте курсор в текст для подготовки всей статьи к вёрстке.\nВыделите часть текста для проверки только её.", myProgramTitul);	
            exit();
            } //  != "Story"
if (mySel.constructor.name == "InsertionPoint") { // == "InsertionPoint"
    mySel.parent.characters.itemByRange(0,-1).select(); // выделен весь текст    
    mySel = app.selection[0];
    } // == "InsertionPoint"
app.findGrepPreferences = NothingEnum.nothing;
app.changeGrepPreferences = NothingEnum.nothing;
app.findGrepPreferences.findWhat='.';     
app.findGrepPreferences.capitalization = Capitalization.ALL_CAPS;
app.findChangeGrepOptions.includeFootnotes = true;
myFoundSamples = mySel.findGrep();
var numberOfChars = myFoundSamples.length;
pBar = new ProgressBar(myProgramTitul);
pBar.reset(" Замена символов с атрибутом \"Все прописные\" (ALL_CAPS) на такие же по начертанию, но настоящие прописные буквы", numberOfChars);
for (var j = 0; j < numberOfChars; j++, pBar.hit()) { // j++
    var myChar = myFoundSamples[j];
    var charIndex = myChar.index;
    var parentArea = myChar.parent;
    myChar.capitalization = Capitalization.NORMAL;    
    if (SpacesDigitsAndPunctuation.match(myChar.contents) != null ) continue; // это шпация или цифра        
    var BigChar = Letter[myChar.contents];
    try {
        parentArea.characters[charIndex].contents = BigChar; 
        } 
    catch (e) {
        alert("Неучтённый знак: " + myChar.contents+ "\r\rЕго придётся найти и привести в нужный вид самостоятельно. И надо добавить этот символ в строку Letter, чтобы на нём программа больше не останавливалась.", myProgramTitul);
        }
    } // j++
pBar.close();
alert("Готово!",myProgramTitul);
app.documents[0].select(NothingEnum.nothing);
exit();  
////




