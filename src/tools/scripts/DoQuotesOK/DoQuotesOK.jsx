//  DoQuotesOK.jsx
// InDesign CS4 - InDesign CC
// © Mikhail Ivanyushin  ivanyushin#yandex.ru   m.ivanyushin#gmail.com
// adobeindesign.ru
//
// Script to put in order quotes in text
// 
//#target indesign
//*
// myRightChars - line of text symbols. If program marks a symbol by color as unaccounted  and stops text processing add it in the sting and run script again
var myRightChars = "йцукеёнгшщзхъфывапролджэячсмитьбюЙЦУКЕЁНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮЄєЇїўЎЂђЃѓЉљЊњЋћЌќЏџҐґәqwertyuiopasdfghjklzxcvbnmüäößQWERTYUIOPASDFGHJKLZXCVBNMÜÄÖ~@#$%‰^&_¡¿ְֱֲֳִֵֶַָֹֺֻּֽ֑֖֛֢֣֤֥֦֧֪֚֭֮֒֓֔֕֗֘֙֜֝֞֟֠֡֨֩֫֬֯־ֿ׀ׁׂ׃ׅׄ׆ׇאﭏבגדהוזחטיךכלםמןנסעףפץצקרשתװױײ׳״יִﬞײַﬠﬡﬢﬣﬤﬥﬦﬧﬨ﬩שׁשׂשּׁשּׂאַאָאּבּגּדּהּוּזּטּיּךּכּלּמּנּסּףּפּצּקּרּשּתּוֹבֿכֿפֿ]";// ATENTION!!  Don't place in this string asterisk, minus, plus, ellipsis, all kinds of brackets, defis, en-dash, em-dash ets. All its taken into account in code of this program
var myDigits = "1234567890";
///////
INDEX_SIGN = "\uFEFF";
AnkhoredObject = "\uFFFC";
// myMissedSpecChar - an array of characters what may be situated near quotes but script don't take its into account
var myMissedSpecChar = [SpecialCharacters.ZERO_WIDTH_NONJOINER, SpecialCharacters.END_NESTED_STYLE, INDEX_SIGN, AnkhoredObject];

// Special colors for this script
MistakeInQuoteUsageColorSample = [255, 0, 0];  // red - error in quote usage
NewCharColorSample = [0, 0, 255]; // blue - script found missing in string myRightChars characer
OpenOrCloseQuoteColorSample = [0, 255, 0];  // green -- it is impossible to understand kind of quote: open or close
//
// Special colors for menu
blueClr = [0.0, 0.0, 1.0]; // blue
blackClr = [0.0, 0.0, 0.0]; // black
redClr = [1.0, 0.0, 0.0]; // red
yellowClr = [1.0, 1.0, 0.0]; // желтый цвет 
cyanClr = [0.0, 1.0, 1.0]; // циановый цвет 
greenClr = [0.0, 1.0, 0.0]; // green
whiteClr = [1.0, 1.0, 1.0]; // white
//var myMenuColor = blackClr;  
var myMenuColor = blueClr;
///
defSelColor = [.65, .65, .65, 1]; // button background color when cursor in it space 
defBgColor = [.29, .29, .29, 1]; // button background color when cursor leave the space
//*/

////>>>> dark screen / light screen >>>>>
try {
    var uiBr = app.generalPreferences.uiBrightnessPreference;
}
catch (e) {  // before CC
    uiBr = 0.6;
}
if (uiBr > 0.67) {
    defBgColor = [.95, .95, .95, 1]; defSelColor = [.25, .25, .25, 1];
}
else if (uiBr < 0.67 && uiBr >= 0.51) {
    defBgColor = [.7, .7, .7, 1]; defSelColor = [.3, .3, .3, 1];
}
else if (uiBr >= 0.33 && uiBr < 0.51) {
    defBgColor = [.34, .34, .34, 1]; defSelColor = [.66, .66, .66, 1];
}
else {
    /* if (uiBr == 0) */ defBgColor = [.2, .2, .2, 1]; defSelColor = [.8, .8, .8, 1];
}
if (uiBr < 0.51) myMenuColor = cyanClr;
////>>>> dark screen / light screen >>>>>

// Button size
var myButtonSize = [0, 0, 174, 30]
myProgramTitul = "Put quotes in order";

myCurrentVersionData_xx_xx_xx = " (05.12.2018)";
myRightProgramTitul = myProgramTitul + myCurrentVersionData_xx_xx_xx
///
if (app.name != "Adobe InDesign") { 
    //alert("This script is for InDesign only.", myProgramTitul); exit(); 
} // Этот скрипт должен запускаться в программе InDesign.

if (app.documents.length == 0) {
    //alert("No open document.", myRightProgramTitul); // Нет открытых документов.
    exit();
}

app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll; // http://adobeindesign.ru/2008/10/24/restore-ui/
app.activeDocument.textPreferences.typographersQuotes = false;

///////////////////////////////////////
/*
The program is designed to organize the types of quotes in the text.
It is assumed that there can be no more than three levels of enclosing quotes in the text.
The program searches for every occurrence of quotation marks in the text.
Based on the analysis of the characters next to the quotes is determined, first, whether it is worth it.
Secondly, it is determined which quote is opening or closing.
When you want to control whether the opening and closing quotes match, you must select the «Сheck quote pair» check box.
What quotes will be at each level is determined in the menu by the user.
The program finds all double quotes in the text and collects them into an array of indexes in the article.
Then look for single quotes - an array of indices of single quotes is collected in another array. Both arrays are combined into one, in which the numbers — the quotes indexes in the text — are ordered in ascending order.
Since to determine the type of quotation mark — opening or closing-it is necessary to analyze the characters on the left and right quotes, add a space at the beginning and end of the text, because the text can begin and end with a quotation mark.
To determine which quote — opening or closing — the program analyzes the characters to the left and right of that quote. 
All characters that can appear on the left and right can be divided into eight groups:
1) gaps (these are all kinds of spaces)
2) letters and numbers
3) punctuation marks
4) line breaks (Enter, Shift + Enter, column breaks, frame breaks etc.)
5) quotation mark
6) dot
7) left bracket
8) right bracket
Therefore, before you can infer which quote it is, you must read the characters to the left and right of the quote and determine which of the following categories each belongs to. Let’s call this process normalization.
Whether the adjacent character is a quotation mark can be understood by comparing the index of the current quotation mark to the index of the adjacent quotation mark array.
Set the current quote level to 0.
Take the array of the first quote, make sure that it opens.
Replace it with the kind of opening quote selected by the user for quotes of this level.
Increase the current quote level by 1. 
Select the index of the next quote from the array.
if it is closing, reduce the current level of quotes by 1, replace it in the text with a quote selected by the user for quotes of this level, etc. 
If the check of parity of quotation marks is not specified, i.e. it is allowed that the text can be omitted a closing quotation mark, when meeting another closing quotation marks quotation marks the level of current falls on the unit as usual, but two. This is necessary to force the transition to the previous level of quotes.
*/
// 
var InCopyIsUsedInWorkflow_value = 0;
var myApostrofIsQuote_value = 0;
var ShowHelp_value = 1;
// Символы категории 'Пробелы'
myTab = "\u0009"; //знак табуляции, другой вариант задания:  "^t"
mySpace = " "; // пробел
myNonBreakableSpaceVariableWidth = 1397645907; //"\u00A0";                
myNonBreakableSpaceFixedWidth = 1399746146; //"\u202F";
myHairSpace = 1397256787; //"\u200A";
myThinSpace = 1398042195; //"\u2009";
mySixthSpace = 1397975379; // "\u2006";
myQuadSpace = 1397847379; // "\u2005";
myThirdSpace = 1398040659; // "\u2004";
myPunktSpace = 1397780051; //"\u2008";
myFigureSpace = 1397122899; // "\u2007";
myFlushSpace = 1397124179; //"\u2001";
myEm = 1397058899; //"\u2003";
myEn = 1397059155; // "\u2002";
my_INDENT_HERE_TAB = 1397319796;
//
// Символы категории 'Переводы строки'
myLineBreak = "\u000D";
//myForcedLineBreak = 1397124194;
my_COLUMN_BREAK = 1396927554;
my_FRAME_BREAK = 1397125698;
my_PAGE_BREAK = 1397778242;
my_ODD_PAGE_BREAK = 1397715010;
my_EVEN_PAGE_BREAK = 1397059650;
my_DISCRETIONARY_LINE_BREAK = 1397777484;
my_FORCED_LINE_BREAK = 1397124194;
//
my_ZERO_WIDTH_NONJOINER = "\u200C"; // символ нулевой ширины   "\u0009"
//my_ZERO_WIDTH_NONJOINER = 1397780074; // символ нулевой ширины
//
myTire = 1397058884;
myMinus = 1397059140;

var myValue;
var myMinutes;
var mySecondes;
var myHour;
var tmpData;

var SDLq = 1396984945 // SpecialCharacters.DOUBLE_LEFT_QUOTE	Inserts a double left quote. 
var SDRq = 1396986481 //SpecialCharacters.DOUBLE_RIGHT_QUOTE	Inserts a double right quote.
var SDSq = 1396986737 //SpecialCharacters.DOUBLE_STRAIGHT_QUOTE	Inserts a double straight quote.

var SSLq = 1397967985  //SpecialCharacters.SINGLE_LEFT_QUOTE	Inserts a single left quote.
var SSRq = 1397969521  //SpecialCharacters.SINGLE_RIGHT_QUOTE	Inserts a single right quote.
var SSSq = 1397969777 //SpecialCharacters.SINGLE_STRAIGHT_QUOTE	Inserts a single straight quote.


myDefis = "-";
var P0 = "";
var P1 = "";
var P2 = "";
var P3 = "";
var P4 = "";
myDISCRETIONARY_HYPHEN = 1396983920;
my_NONBREAKING_HYPHEN = 1397645928; // "\u2011";

// Ellipsis and footnote may be placed as before qoute as and after it.
my_ELLIPSIS_CHARACTER = 1397518451;
my_FOOTNOTE_SYMBOL = 1399221837;
//INDEX_SIGN = "\uFEFF"; 

// Array of various spaces	
//var mySet_S = [mySpace,myNonBreakableSpaceVariableWidth,myNonBreakableSpaceFixedWidth,myTab,myHairSpace,myThinSpace,mySixthSpace,myQuadSpace,myThirdSpace,myPunktSpace,myFigureSpace,myFlushSpace,myEm,myEn,myTire,myMinus,myDefis,my_NONBREAKING_HYPHEN,myDISCRETIONARY_HYPHEN,my_INDENT_HERE_TAB];
var mySet_S = [mySpace, myNonBreakableSpaceVariableWidth, myNonBreakableSpaceFixedWidth, myTab, myHairSpace, myThinSpace, mySixthSpace, myQuadSpace, myThirdSpace, myPunktSpace, myFigureSpace, myFlushSpace, myEm, myEn, my_INDENT_HERE_TAB];
//
//
// Array of punctuation chars
var mySet_P = ["?", ".", ",", ":", ";", "!", "_", "+", my_FOOTNOTE_SYMBOL];
//
var mySet_T = [1397058884, 1397059140, 1396983920, 1397645928, "-"];  // тире минус дискр.перенос  неразр.перенос  (возвращает маску Т)

// массив вариантов перевода строки, разрыва фрейма и пр.	
var mySet_B = [myLineBreak, my_FORCED_LINE_BREAK, my_COLUMN_BREAK, my_FRAME_BREAK, my_PAGE_BREAK, my_ODD_PAGE_BREAK, my_EVEN_PAGE_BREAK, my_DISCRETIONARY_LINE_BREAK, "\u0016"];
// "\u0016" -- отладчик показывает, что это служебный знак пустой ячейки таблицы. Добавлен в конец этого массива
//
// script refers these special characters to letters in word
my_PARAGRAPH_SYMBOL = 1397776754;
my_REGISTERED_TRADEMARK = 1397904493;
my_SECTION_SYMBOL = 1400073811;
my_TRADEMARK_SYMBOL = 1398041963;
my_BULLET_CHARACTER = 1396862068;
my_COPYRIGHT_SYMBOL = 1396929140;
my_DEGREE_SYMBOL = 1396991858;
//my_EM_DASH = 1397058884;
//my_EN_DASH = 1397059140;
//my_DISCRETIONARY_HYPHEN = 1396983920;
//var my5Set = [my_BULLET_CHARACTER,my_COPYRIGHT_SYMBOL,my_DEGREE_SYMBOL,my_EM_DASH,my_EN_DASH,my_DISCRETIONARY_HYPHEN,my_NONBREAKING_HYPHEN];
var my5Set = [my_BULLET_CHARACTER, my_COPYRIGHT_SYMBOL, my_DEGREE_SYMBOL, my_PARAGRAPH_SYMBOL, my_REGISTERED_TRADEMARK, my_SECTION_SYMBOL, my_TRADEMARK_SYMBOL];
//
// open brackets
var my6Set = "<([{/";

// close brackets
var my7Set = ">)]}/";
var BadQuoteUsage = "\\s[\"\']+[\\?\\.,:;!_+>\\)\\]}/\\s]" // mySet_P and my7Set
//var BadQuoteUsage  = "\\s[\"\\']+[\\?\\.,:;!_+>\\)\\]}/\\s]" // mySet_P and my7Set

//
// Options for normalizing characters before and after quotation marks:
//  These characters combine various masks for matrix of text processing
// S-indicates that this character belongs to a group of characters used as spaces
// L-indicates that this character is a letter
// F-indicates that this character is a digit
// P-indicates that this character is one of the punctuation (or footnote) characters)
// // B - a sign that this symbol refers to a group of characters that are used as translated, a line break, speaker, etc.
// Q-indicates that this character is a quotation mark
// E-indicates that this character is an ellipsis
// C-indicates that this character is a left bracket
// V-indicates that this character is a right bracket 
// I-indicates that this character is an index 
//
// 12.02.2015 -- added two more options to the normalization:
// T - dash (hyphen, minus) - a group of mySet_T
// The result will be two more opening quote masks: BT, ST, and TL
//
// В начале работы скрипта выполняется grep-замена: <многоточие><кавычка><буква>  на  <многоточие><ВолосянаяШпация><кавычка><буква> # Зачем??  Достаточно ситуацию EL перенести в открывающие кавычки
///======================================================
//

//  Masks for matrix of text processing:

var myMaskErrorInText = ["SS", "SP", "SB", "PL", "BS", "BP", "BB", "EE", "LL", "ET", "TP", "FF", "LF", "FL", "PF", "VL", "VF"]; // the combination of the symbols to the left and right quotation marks, which are considered to be incorrect use of quotation marks 9/2/2015 -- "PE" taken from here and transferred to the closing quotation mark
//
var myMaskOpenQuote = ["SL", "SQ", "BL", "BQ", "QL", "SE", "QE", "BE", "SC", "BC", "QC", "CL", "CC", "CQ", "BT", "ST", "TL", "CT", "TC", "PC", "EL", "CE", "SF", "BF", "QF", "CF", "TF", "EF"]; // the combination of the symbols to the left and right quotes that are valid for the open quote
//
var myMaskCloseQuote = ["LS", "LP", "LB", "LE", "LQ", "PS", "PB", "PQ", "QS", "QP", "QB", "ES", "EB", "EP", "VS", "VP", "VB", "VQ", "LV", "LC", "EV", "PV", "QV", "VV", "PE", "PP", "LT", "PT", "QT", "VT", "TS", "TB", "TQ", "TE", "TV", "EQ", "FS", "FP", "FB", "FE", "FQ", "FV", "FC", "FT"]; // the combination of the symbols to the left and right quotes that are valid for the close quotation mark

//  Incorrect use of quotation marks: "SS","SP","SB","PL","BS","BP","BB","EE","LL","ET","TP", "FF", "LF", "FL", "PF";

//var myTestSS = "[\\s][\"\']+[\\s]";
//var BadQuoteUsage  = "\\s[\"\']+[\\?\\.,:;!_+>\\)\\]}/\\s]" ;
var BadQuoteUsage = "(\\s[\"\']+[\\?\\.,:;!_+>\\)\\]}/\\s])|([\\?\\.,:;!_+>][\"\']+[\\u|\\l|\\d])|([\\u|\\l][\"\']+\\d)|(\\d[\"\']+[\\u|\\l])"
//var BadQuoteUsage  = "(\\s[\"\\']+[\\?\\.,:;!_+>\\)\\]}/\\s])|([\\?\\.,:;!_+>][\"\\']+[\\u|\\l|\\d])|([\\u|\\l][\"\\']+\\d)|(\\d[\"\\']+[\\u|\\l])" 

my_SINGLE_LEFT_QUOTE = 1397967985; // одиночная левая кавычка
my_SINGLE_RIGHT_QUOTE = 1397969521; // одиночная правая кавычка
my_SINGLE_STRAIGHT_QUOTE = 1397969777; // my_Apostrophe = "\u0027";

var myQ0 = 0; // main quote index
var myQ1 = 1; // the index quotes the first level
var myQ2 = 2; // the index quotes the second level
var myQ3 = 6; // the index quotes the third level
var myQP = 1; // the check box match quotes 0 - reset 1 - set
var myOddQuotes = false; // = false, if all quotes are matched
myLitQuotes_value = 1;
myPrTbl_value = 1;
var myInfoLineAboutError = "";
var myInfoLineAboutRezult = "";
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
myInfoLineAboutError = "";
var myRezS = 0;
var myRezF = 0;
var myRezT = 0;
var myPr = "";
//myInfoColorSample = [0, 100, 100, 0];
//var myDoubleQuotes = new Array; // an array of double quotes
//var mySingleQuotes = new Array; // an array of single quotes
var myAllQuotes = new Array; // an array of all quotes in story
var myOpenContinuousQuotes = [];
var myAllQuotesLength; // number characters in stoty
//var myOpenQuoteNumberIndex = 0;
var myNextSingleQuotePosition;
var myNextDoubleQuotePosition;
var myLine;
var myIndex;
var myColorTmp;
var myPrevChar;
var myCurrChar;
var myNextChar;
var myRealCurrChar;
var myRealPrevChar;
var myRealNextChar;
var myStopProcessing; 	// 0 -previous processing of the file was completed
// 1 - previous file processing was suspended due to an erro
var myCurIndex;
var myStartOfFragment;
var myEndOfFragment;
myProgressbarShow = false;
var myProgresspanel;
var myFirstChar;
var myFirstCharColor;
var myProcFork1, myProcFork2;
var StoryHasQuotes = false;
//
myFoundNonjoinerIndex = new Array; // an array of zero-length character indexes. 
// They can be next to quotes, from the program's point of view it is a single character, but it will not allow to define the type of quotes. Instead of bothering with checking,
// is the read character a zero-width character, and if such a character is selected, read the next (and there can be several such characters in a row),
// it is easier to collect their indexes in the file before processing, and delete these characters for the duration of processing.
var myMask;
var mySubmask;
var myCurrQuotesLevel;
var myOpenQuoteNumber; // number of open quotes encountered
var myCloseQuoteNumber; // the number of close quotation mark
var myLevelMax; // the maximum level of nesting quotation marks in the document
// варианты кавычек
myOpnTypoQ = "«";
myClsTypoQ = "»";
myBtm99Q = "„";
myTp66Q = "“";
myTp99Q = "”";
myBtm9Q = "‚";
myTp6Q = "‘";
myTp9Q = "’";
myLftAnglQ = "‹";
myRghtAnglQ = "›";
mySmplSnglQ = "\'";
//mySmplSnglQ  = "\\'";
mySmplDblQ = "\"";
myDots = "………………";
//var myQuotesList = [myOpnTypoQ+myDots+myClsTypoQ, myBtm99Q+myDots+myTp66Q, myBtm9Q+myDots+myTp6Q, myTp99Q+myDots+myTp99Q, myTp6Q+myDots+myTp9Q, myTp66Q+myDots+myTp99Q, myLftAnglQ+myDots+myRghtAnglQ, myClsTypoQ+myDots+myOpnTypoQ, mySmplDblQ+myDots+mySmplDblQ, mySmplSnglQ+myDots+mySmplSnglQ];
var myQuotesList = [myOpnTypoQ + myDots + myClsTypoQ,
myBtm99Q + myDots + myTp66Q,
myTp6Q + myDots + myTp9Q,
myBtm9Q + myDots + myTp6Q,
myTp99Q + myDots + myTp99Q,
myTp66Q + myDots + myTp99Q,
myLftAnglQ + myDots + myRghtAnglQ,
myRghtAnglQ + myDots + myLftAnglQ,
myClsTypoQ + myDots + myOpnTypoQ,
mySmplDblQ + myDots + mySmplDblQ,
myBtm99Q + myDots + myTp99Q,
mySmplSnglQ + myDots + mySmplSnglQ
];
var myOpenQuote1Level = "«";
var myCloseQuote1Level = "»";
var myOpenQuote2Level = "„";
var myCloseQuote2Level = "“";
var myOpenQuote3Level = "‘";
var myCloseQuote3Level = "’";
var myOpenQuote4Level = "‹";
var myCloseQuote4Level = "›";
var myCurrOpenQuote = new Array; // the array chosen by the user open quotes
var myCurrCloseQuote = new Array; // the array chosen by the user close quotes
var CurDocName = "";
var myNewAbzatc = true;
var myOpenQuoteIndex = -1;
var myCloseQuoteIndex = -1;
var myQuoteLineIsOpen = false;
///////
//var ShowHelp;
////
var ProgressBar = function (title) { // ProgressBar
    var w = new Window('palette', title, { x: 0, y: 0, width: 740, height: 60 }, { closeButton: true });
    pb = w.add('progressbar', { x: 20, y: 32, width: 700, height: 12 });
    st = w.add('statictext', { x: 20, y: 12, width: 700, height: 20 });
    st.justify = 'left';
    w.center();
    this.reset = function (msg, maxValue) {
        st.text = msg;
        pb.value = 0;
        pb.maxvalue = maxValue;
        //w.show();
        w.update();
    }
    this.hit = function () { ++pb.value; w.update(); }
    this.hide = function () { w.hide(); } // эта функция гасит окно процесса исполнения задания
    this.close = function () { w.close(); }
    this.info = function (msg) {
        st.text = msg;
        //w.show();
        w.update();
    }
} // ProgressBar
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.doScript(
    myTextProcessingAction,  // The script to execute. Can accept: File, String or JavaScript Function.
    ScriptLanguage.JAVASCRIPT,    // The language of the script to execute.
    [],                           // An array of arguments passed to the function 
    UndoModes.ENTIRE_SCRIPT, // How to undo this script.
    'myTextProcessingAction'   // The name of the undo step for entire script undo mode. 
);
app.activeDocument.textPreferences.typographersQuotes = true;
exit();
////////////
function myTextProcessingAction() { // myTextProcessingAction 
    if (app.documents.length == 0) {
        //alert("No open document.", myRightProgramTitul);
        exit();
    }
    var myDocument = app.documents.item(0);
    var mySelection = app.selection[0];
    if (app.selection.length == 0) {
        //alert("Place cursor in text.", myRightProgramTitul);
        exit();
    }
    /////////
    var myScriptFile = myGetScriptPath();
    var myScriptFolder = decodeURI(myScriptFile.path);
    myIniPath = myScriptFolder + "/" + "QuotesSetting.ini";
    var myIniFilePath = decodeURI(myIniPath);
    var mySetIniFile = File(myIniFilePath);
    if (mySetIniFile.exists) { // mySetIniFile.exists	
        mySetIniFile.open("r");
        InCopyIsUsedInWorkflow_value = mySetIniFile.readln();
        myApostrofIsQuote_value = mySetIniFile.readln();
        ShowHelp_value = mySetIniFile.readln();
        ///
        myQ0 = mySetIniFile.readln(); // main quote index
        myQ1 = mySetIniFile.readln(); // the index quotes the first level
        myQ2 = mySetIniFile.readln(); // the index quotes the second level
        myQ3 = mySetIniFile.readln(); // the index quotes the third level
        myLitQuotes_value = mySetIniFile.readln();
        myPrTbl_value = mySetIniFile.readln();
        // correction of incorrect data, if any
        myQ0 = Number(myQ0);
        if (myQ0 > 10 || isNaN(myQ0) == true) myQ0 = 0;
        myQ1 = Number(myQ1);
        if (myQ1 > 10 || isNaN(myQ1) == true) myQ1 = 1;
        myQ2 = Number(myQ2);
        if (myQ2 > 10 || isNaN(myQ2) == true) myQ2 = 2;
        myQ3 = Number(myQ3);
        if (myQ3 > 10 || isNaN(myQ3) == true) myQ3 = 6;
        //~ 	/////
        try { myStopProcessing = mySetIniFile.readln() } catch (e) { myStopProcessing = 0; }
        try { myStartOfFragment = mySetIniFile.readln() } catch (e) { myStartOfFragment = 0; }
        try { myEndOfFragment = mySetIniFile.readln() } catch (e) { myEndOfFragment = 0; }
        try { myCurrQuotesLevel = mySetIniFile.readln() } catch (e) { myCurrQuotesLevel = 0; }
        try { myLevelMax = mySetIniFile.readln() } catch (e) { myLevelMax = 0; }
        try { myOpenQuoteNumber = mySetIniFile.readln() } catch (e) { myOpenQuoteNumber = 0; }
        try { myCloseQuoteNumber = mySetIniFile.readln() } catch (e) { myCloseQuoteNumber = 0; }
        try { myOpenQuote1Level = mySetIniFile.readln() } catch (e) { myOpenQuote1Level = "«"; }
        try { myCloseQuote1Level = mySetIniFile.readln() } catch (e) { myCloseQuote1Level = "»"; }
        try { myOpenQuote2Level = mySetIniFile.readln() } catch (e) { myOpenQuote2Level = "„"; }
        try { myCloseQuote2Level = mySetIniFile.readln() } catch (e) { myCloseQuote2Level = "“"; }
        try { myOpenQuote3Level = mySetIniFile.readln() } catch (e) { myOpenQuote3Level = "‘"; }
        try { myCloseQuote3Level = mySetIniFile.readln() } catch (e) { myCloseQuote3Level = "’"; }
        try { myOpenQuote4Level = mySetIniFile.readln() } catch (e) { myOpenQuote4Level = "‹"; }
        try { myCloseQuote4Level = mySetIniFile.readln() } catch (e) { myCloseQuote4Level = "›"; }
/*
        myOpnTypoQ = "«";
myClsTypoQ = "»";
myBtm99Q = "„";
myTp66Q = "“";
myTp99Q = "”";
myBtm9Q = "‚";
myTp6Q = "‘";
myTp9Q = "’";
myLftAnglQ = "‹";
myRghtAnglQ = "›";
mySmplSnglQ = "\'";*/

        switch (myQ0) {
            case 0:
                myOpenQuote1Level = "«";
                myCloseQuote1Level = "»";
                break;

            case 1:
                myOpenQuote1Level = "„";
                myCloseQuote1Level = "“";
                break;

            case 2:
                myOpenQuote1Level = "‘";
                myCloseQuote1Level = "’";
                break;

            case 3:
                myOpenQuote1Level = "”";
                myCloseQuote1Level = "”";
                break;

            case 4:
                myOpenQuote1Level = "“";
                myCloseQuote1Level = "”";
                break;

            case 5:
                myOpenQuote1Level = "‹";
                myCloseQuote1Level = "›";
                break;

            case 6:
                myOpenQuote1Level = "›";
                myCloseQuote1Level = "‹";
                break;

            case 7:
                myOpenQuote1Level = "»";
                myCloseQuote1Level = "«";
                break;

            case 8:
                myOpenQuote1Level = "\"";
                myCloseQuote1Level = "\"";
                break;

            case 9:
                myOpenQuote1Level = "„";
                myCloseQuote1Level = "”";
                break;

            case 10:
                myOpenQuote1Level = "\'";
                myCloseQuote1Level = "\'";
                break;

        }

        switch (myQ1) {
            case 0:
                myOpenQuote2Level = "«";
                myCloseQuote2Level = "»";
                break;

            case 1:
                myOpenQuote2Level = "„";
                myCloseQuote2Level = "“";
                break;

            case 2:
                myOpenQuote2Level = "‘";
                myCloseQuote2Level = "’";
                break;

            case 3:
                myOpenQuote2Level = "”";
                myCloseQuote2Level = "”";
                break;

            case 4:
                myOpenQuote2Level = "“";
                myCloseQuote2Level = "”";
                break;

            case 5:
                myOpenQuote2Level = "‹";
                myCloseQuote2Level = "›";
                break;

            case 6:
                myOpenQuote2Level = "›";
                myCloseQuote2Level = "‹";
                break;

            case 7:
                myOpenQuote2Level = "»";
                myCloseQuote2Level = "«";
                break;

            case 8:
                myOpenQuote2Level = "\"";
                myCloseQuote2Level = "\"";
                break;

            case 9:
                myOpenQuote2Level = "„";
                myCloseQuote2Level = "”";
                break;

            case 10:
                myOpenQuote2Level = "\'";
                myCloseQuote2Level = "\'";
                break;

        }

        switch (myQ2) {
            case 0:
                myOpenQuote3Level = "«";
                myCloseQuote3Level = "»";
                break;

            case 1:
                myOpenQuote3Level = "„";
                myCloseQuote3Level = "“";
                break;

            case 2:
                myOpenQuote3Level = "‘";
                myCloseQuote3Level = "’";
                break;

            case 3:
                myOpenQuote3Level = "”";
                myCloseQuote3Level = "”";
                break;

            case 4:
                myOpenQuote3Level = "“";
                myCloseQuote3Level = "”";
                break;

            case 5:
                myOpenQuote3Level = "‹";
                myCloseQuote3Level = "›";
                break;

            case 6:
                myOpenQuote3Level = "›";
                myCloseQuote3Level = "‹";
                break;

            case 7:
                myOpenQuote3Level = "»";
                myCloseQuote3Level = "«";
                break;

            case 8:
                myOpenQuote3Level = "\"";
                myCloseQuote3Level = "\"";
                break;

            case 9:
                myOpenQuote3Level = "„";
                myCloseQuote3Level = "”";
                break;

            case 10:
                myOpenQuote3Level = "\'";
                myCloseQuote3Level = "\'";
                break;

        }

        switch (myQ3) {
            case 0:
                myOpenQuote4Level = "«";
                myCloseQuote4Level = "»";
                break;

            case 1:
                myOpenQuote4Level = "„";
                myCloseQuote4Level = "“";
                break;

            case 2:
                myOpenQuote4Level = "‘";
                myCloseQuote4Level = "’";
                break;

            case 3:
                myOpenQuote4Level = "”";
                myCloseQuote4Level = "”";
                break;

            case 4:
                myOpenQuote4Level = "“";
                myCloseQuote4Level = "”";
                break;

            case 5:
                myOpenQuote4Level = "‹";
                myCloseQuote4Level = "›";
                break;

            case 6:
                myOpenQuote4Level = "›";
                myCloseQuote4Level = "‹";
                break;

            case 7:
                myOpenQuote4Level = "»";
                myCloseQuote4Level = "«";
                break;

            case 8:
                myOpenQuote4Level = "\"";
                myCloseQuote4Level = "\"";
                break;

            case 9:
                myOpenQuote4Level = "„";
                myCloseQuote4Level = "”";
                break;

            case 10:
                myOpenQuote4Level = "\'";
                myCloseQuote4Level = "\'";
                break;
        }

        tmpData = mySetIniFile.readln();
        tmpData == 1 ? myNewAbzatc = true : myNewAbzatc = false;
        myOpenQuoteIndex = mySetIniFile.readln();
        myCloseQuoteIndex = mySetIniFile.readln();
        tmpData = mySetIniFile.readln();
        tmpData == 1 ? myQuoteLineIsOpen = true : myQuoteLineIsOpen = false;
        try { CurDocName = mySetIniFile.readln() } catch (e) { CurDocName = "’"; }
        mySetIniFile.close();
    } // mySetIniFile.exists
    else {
        InCopyIsUsedInWorkflow_value = 0;
        myApostrofIsQuote_value = 0;
        ShowHelp_value = 1;
        /////////////
        myQ0 = 0;
        myQ1 = 1;
        myQ2 = 2;
        myQ3 = 6;
        myLitQuotes_value = 1;
        myPrTbl_value = 1;
        myStopProcessing = 0;
        myStartOfFragment = 0;
        myEndOfFragment = 0;
        myLevelMax = 0;
        myOpenQuoteNumber = 0;
        myCloseQuoteNumber = 0;
        myOpenQuote1Level = "«";
        myCloseQuote1Level = "»";
        myOpenQuote2Level = "„";
        myCloseQuote2Level = "“";
        myOpenQuote3Level = "‘";
        myCloseQuote3Level = "’";
        myOpenQuote4Level = "‹";
        myCloseQuote4Level = "›";
        ///////
        myNewAbzatc = true;
        myOpenQuoteIndex = -1;
        myCloseQuoteIndex = -1;
        myQuoteLineIsOpen = false;
    }
    //*/
    switch (mySelection.constructor.name) { // Switch
        case "Text":
        case "InsertionPoint":
        case "Character":
        case "Word":
        // case "Cell":        
        // case "Table":               
        case "Line":
        case "Paragraph":
        case "TextColumn":
        case "TextFrame":
            var myStory;
            myStory = mySelection.parentStory;
            if (myStory.overflows == true) { // overflows 
                //alert("Overflow detected. The program is stopped, because if this error is detected, it is not possible to specify which page the problem quote is on.", myRightProgramTitul);
                exit();
            }  // overflows
            //var myNumberOfSelectedPars = mySelection.paragraphs.length;
            if (myStory.characters.length <= 1 && mySelection.parent.constructor.name != "Cell") { // 0 - ничего нет. 1 - только один знак перевода строки
                //alert("No text.", myRightProgramTitul);
                exit();
            } // 0
            mySetColor();
            myFirstChar = myStory.characters[0]; // кавычки, о которых не ясно, открывающие они или закрывающие, программа красит в цвет MistakeInQuoteUsage. После исправления ошибки кавычка окрашенная этим цветом, должна стать обычного цвета. Поскольку этот цвет может быть как [Black] так и [Черный], решено просто брать цвет последнего символа статьи в качестве цвета перекраски. Первый символ брать нельзя - при повтрном запуске программы он уже может оказаться красным и восстановления цвета кавычек уже не получится. Если последний символ в статье -- кавычка, и она в процессе обрботки окрашивалась в красный цвет, то она может так и остаться окрашенной. Чтобы этого не случилось, в конце работы сравниваются цвета последей и предпоследней кавычек. Если они не совпадают, последней кавычке присваивается цвет предпоследней.
            myFirstCharColor = myFirstChar.fillColor;
            var myWrongQuoteUsage = myQuAndChTest(myStory, BadQuoteUsage);
            if (myWrongQuoteUsage != 0) { // myQuAndDgValue
                //alert("The text found cases of invalid combinations of whitespace, quotation marks or quotation marks and whitespace, or closing parentheses, or punctuation. All of them " + myWrongQuoteUsage + ", all those combinations painted color 'MistakeInQuoteUsage'. Most likely, there is a random space before or after the quote. Put the text in order and run the script again.", myRightProgramTitul);
                ResetParameters();
                //mySaveProcQuoteParameters(myStory);
                exit();
            } // myQuAndDgValue
            //////////////////////////////////////////   тут надо проверять myStopProcessing и принимать решение, что делать дальше
            if (mySelection.length == 0 && myStopProcessing == 1 && CurDocName == myDocument.name) { // myStopProcessing == 1
                myProcFork2 = confirm("During the previous session, the processing of this text was not completed. Click 'Yes' if you want to continue processing, or 'No' if no processing is needed.", "", myProgramTitul);
                if (!myProcFork2) { // myProcFork2 == false
                    ResetParameters();
                    //mySaveProcQuoteParameters(myStory);
                    exit();
                } // myProcFork2 == false  
                myStory.characters.itemByRange(mySelection.index, myStory.characters.lastItem().index - myEndOfFragment).select();
                //alert("myOpenQuoteNumber = " + myOpenQuoteNumber +"\rmyCloseQuoteNumber = " + myCloseQuoteNumber +"\rmyCurrQuotesLevel = " + myCurrQuotesLevel + "\rmyLevelMax = " + myLevelMax);
            } // myStopProcessing == 1
            else { // начало обработки
                myOpenQuoteNumber = 0; // число встреченных открывающих кавычек
                myCloseQuoteNumber = 0; // число встреченных закрывающих кавычек
                myCurrQuotesLevel = 0;
                myLevelMax = 0;
                myStopProcessing = 0;
                myNewAbzatc = true;
                myQuoteLineIsOpen = false;
            } // начало обработки
            TextAboutAction = "Click OK to continue or Cancel to cancel processing";
            InfoAboutStoryProcesing = "Could not find out whether the article is given in the program InCopy or not";
            var myTbl = myTableForProc(mySelection);
            if (myTbl.constructor.name == "Table") { // == "Table"
                var myWin = mySelectParametersDialog(myIniPath);
                //if (myWin.show() == 2) exit(); // ==2  -- это щелчок на красном крестике в правом верхнем угле окна   
                if (InCopyIsUsedInWorkflow_value == 1) { // InCopyIsUsedInWorkflow == true
                    try { /// try
                        if (myStory.lockState != LockStateValues.NONE) { // != LockStateValues.NONE
                            ResetParameters();
                            //mySaveProcQuoteParameters(myStory);
                            //alert("Putting quotes in order involves making corrections to the layout. But the selected text has a pointer indicating that it can not be edited, perhaps it is still on editing in the InCopy program.\the status of all articles is displayed in the 'Window>Editorial>Assignments'panel.", myRightProgramTitul);
                            exit();
                        } // != LockStateValues.NONE
                    } /// try
                    catch (e) { /// e   
                        makeDecision = prompt(InfoAboutStoryProcesing, TextAboutAction, myRightProgramTitul);
                        if (makeDecision == null) exit();
                    } ///e
                } // InCopyIsUsedInWorkflow == true     
                myDateS = new Date();
                myValue = myDateS.getTime();
                mySelTablePros(myTbl, myStory, myLocTextProc, myProcFinish);
                myShInf = "Table processed."
                if (myOddQuotes == true) myShInf += "\nThe unmatched opening quotation marks stained color 'MistakeInQuoteUsage'.";
                myProcFinish(myShInf);
            } // == "Table"
            //mySaveProcQuoteParameters(myStory);
            if (myStopProcessing == 0) { // myStopProcessing == 0
                var myWin = mySelectParametersDialog(myIniPath);
                //if (myWin.show() == 2) exit(); // ==2  -- это щелчок на красном крестике в правом верхнем угле окна 
            } // myStopProcessing == 0  
            if (InCopyIsUsedInWorkflow_value == 1) { // InCopyIsUsedInWorkflow == true
                try { /// try
                    if (myStory.lockState != LockStateValues.NONE) { // != LockStateValues.NONE
                        ResetParameters();
                        //mySaveProcQuoteParameters(myStory);
                        //alert("Putting quotes in order involves making corrections to the layout. But the selected text has a pointer indicating that it can not be edited, perhaps it is still on editing in the InCopy program.\the status of all articles is displayed in the 'Window>Editorial>Assignments'panel.", myRightProgramTitul);
                        exit();
                    } // != LockStateValues.NONE
                } /// try
                catch (e) { /// e   
                    makeDecision = prompt(InfoAboutStoryProcesing, TextAboutAction, myRightProgramTitul);
                    if (makeDecision == null) exit();
                } ///e
            } // InCopyIsUsedInWorkflow == true   
            myDateW = new Date();
            myValue = myDateW.getTime();
            mySelection = app.selection[0];
            var myNumberOfSelectedChars = mySelection.characters.length;
            if (myNumberOfSelectedChars == 0) { //ON   // не выделен ни один символ, значит, обрабатывается вся статья
                myStartOfFragment = myStory.characters.firstItem().index;
                myEndOfFragment = myStory.characters.lastItem().index;
            } //ON
            else { //KV
                myStartOfFragment = mySelection.characters.firstItem().index;
                myEndOfFragment = mySelection.characters.lastItem().index;
            } //KV
            //} //MZ
            var myMathMinIndex = Math.min(myEndOfFragment, myStory.characters.lastItem().index);
            var myMathMaxIndex = Math.max(myStartOfFragment, myStory.characters.firstItem().index);
            myStory.insertionPoints[myMathMaxIndex].contents = mySpace;
            myStory.insertionPoints[myMathMinIndex + 2].contents = mySpace;
            myStory.characters.itemByRange(myMathMaxIndex, myMathMinIndex + 2).select(); // будет выделен или фрагмент незаконченной обработки, или новый фрагмент
            var mySelFragment = app.selection[0];
            ///==========###
            myPr = "s";
            myRezS = myLocTextProc(mySelFragment, "Putting quotes in order", myPr);
            myStory.characters[myMathMinIndex + 2].remove();
            myStory.characters[myMathMaxIndex].remove();
            if (myRezS == 1) { // myRezS == 1
                myStopProcessing = 1;
                myProcFinish("Article processing:\n" + myInfoLineAboutError);
            } // myRezS == 1
            else { ///= else
                myShInf = "\nThe maximum level of nesting quotation marks in the document: " + myLevelMax + ".";
                //if (myOddQuotes == true) myShInf += "\nНепарные открывающие кавычки окрашены цветом 'MistakeInQuoteUsage'.";
                if (myOddQuotes == true) myShInf += "\nNonmatched quotes are painted in 'MistakeInQuoteUsage'.";
                myInfoLineAboutRezult = "\nNumber of open quotes: " + myOpenQuoteNumber + ",\nnumber of close quotes: " + myCloseQuoteNumber + "." + myShInf;
            }  ///= else      
            app.findTextPreferences = NothingEnum.nothing;
            app.changeTextPreferences = NothingEnum.nothing;
            app.findTextPreferences.findWhat = '^F'; // ищем знак сноски
            var myFoundSamplesF = mySelFragment.findText();
            var myFoundSamplesFLength = myFoundSamplesF.length;
            if (myFoundSamplesFLength != 0) myPr = "f";
            for (var ii = 0; ii < myFoundSamplesFLength; ii++) { // myFoundSamplesF.length - 1    
                var myFound = myFoundSamplesF[ii];
                if (myFound.parent.constructor.name == "Footnote") continue; // знаки сноски будут найдены и в самих блоках сносок, но их обрабатывать в этом скрипте не надо :)
                ResetParameters(); // для каждой сноски все установки, как будто это обработка статьи с самого сначала ( при отладке была ситуация, что ошибка в сноске и установленный  в значение 1 myStopProcessing были причиной того, что в сноске были неверно обработаны вложенные кавычки)
                myFound.characters.firstItem().select();
                var myCurFnIsSelected = app.selection[0];
                myCurFnIsSelected.footnotes[0].insertionPoints[0].contents = mySpace;
                myCurFnIsSelected.footnotes[0].insertionPoints[-1].contents = mySpace;
                myCurFnIsSelected.footnotes[0].characters.itemByRange(0, -1).select();
                var myTmpFootnote = app.selection[0];
                myInfoLineAboutError = "";
                myRezF = myLocTextProc(myTmpFootnote, "Handling footnotes", myPr);
                myCurFnIsSelected.footnotes[0].characters[-1].remove();
                myCurFnIsSelected.footnotes[0].characters[0].remove();
                myStory.recompose();
                if (myRezF == 1) { // myRezF == 1
                    myStopProcessing = 1;
                    var curF = ii;
                    curF++;
                    myProcFinish("Handling the footnote" + String(curF) + ":\n" + myInfoLineAboutError);
                }  // myRezF == 1    
            } // myFoundSamplesF.length - 1
            if (myPr == "f") myInfoLineAboutRezult += "\nFootnotes are processed.";

            if (myPrTbl_value == 1) { // myPrTbl_value == 1
                var myTabNumber = myStory.tables.length;
                ProblemWithTable = false;
                for (var tt = 0; tt < myTabNumber; tt++) { // tt++ // цикл по таблицам статьи
                    var myCurTable = myStory.tables[tt];
                    if (myCurTable.isValid == false) {
                        ProblemWithTable = true;
                        continue;
                    }
                    else mySelTablePros(myCurTable, myStory, myLocTextProc, myProcFinish);
                } // tt++
                var myAllPageItems = myStory.allPageItems.length;
                for (var tt = 0; tt < myAllPageItems; tt++) { // цикл по привязанным элементам
                    try { if (myStory.allPageItems[tt].tables.length == 0) continue; }
                    catch (e) { continue };
                    var myCurTable = myStory.allPageItems[tt].tables[0];
                    if (myCurTable.isValid == false) { // .isValid == false
                        ProblemWithTable = true;
                        continue;
                    } // .isValid == false
                    else mySelTablePros(myCurTable, myStory, myLocTextProc, myProcFinish);
                } // цикл по привязанным элементам
                if (myPr == "t" && ProblemWithTable == false) myInfoLineAboutRezult += "\nAll tables of the article are processed.";
                else if (ProblemWithTable == true) myInfoLineAboutRezult += "\nCould not process all tables at once. :(  You will have to process them one by one.";
            }   // myPrTbl_value == 1
            if (myInfoLineAboutError.length == 0) myStopProcessing = 0;
            myProcFinish(myInfoLineAboutRezult);
    }  // Switch
    //alert("Before running the script, place the cursor in the text.", myRightProgramTitul); // это на случай, если выбран иллюстрационный фрейм :)    
    exit();
    ////
    function myLetterAndQuoteChars(myStory, myPointer) { //myLetterAndQuoteChars
        var myCounter;
        // шаблоны GREP-поиска буквы s или S и одиночные кавычки (учтены все варианты), после которых возможны любая из шпаций,  некоторые знаки пунктуации и указатель, что эти буквы стоят в конце строки
        var myLetters_S = '([sS][\'´][\\s.,;:!?…–—-])';
        var myLetters_N = '([nN][\'´][\\s.,;:!?…–—-])';

        myCounter1 = myL_QC(myStory, myLetters_S, myPointer);
        myCounter2 = myL_QC(myStory, myLetters_N, myPointer);
        myCounter = myCounter1 + myCounter2;
        return myCounter;
    } //myLetterAndQuoteChars
    //////
    function myL_QC(myStory, myLetters, myPointer) { //myL_QC
        var myCounter_L_QC = 0;
        app.findGrepPreferences = NothingEnum.nothing;
        app.findGrepPreferences.findWhat = myLetters;
        myFoundSamples = myStory.findGrep();
        if (myFoundSamples.length != 0) {
            // цикл по числу элементов коллекции. Движение снизу вверх
            for (j = myFoundSamples.length - 1; j >= 0; j--) {
                if (myPointer == "s" && myFoundSamples[j].parent.constructor.name != "Story") continue;
                if (myPointer == "t" && myFoundSamples[j].parent.constructor.name != "Cell") continue;
                var myLine = myFoundSamples[j];
                myLine.characters.itemByRange(0, (myLine.length - 1)).fillColor = "MistakeInQuoteUsage";
                myCounter_L_QC++;
            }
        }
        return myCounter_L_QC;
    } // myL_QC
    /////////
    function myQuAndChTest(myStory, myLetters) { //myQuAndChTest
        var myCounter_QA = 0;
        var UtilityTitul = "Collecting information about invalid combinations of spaces, quotes, and a number of characters";
        var myWinQ = new Window("palette", UtilityTitul);
        app.findGrepPreferences = NothingEnum.nothing;
        app.findGrepPreferences.findWhat = myLetters;
        myFoundSamples = myStory.findGrep();
        myWinQ.close();
        if (myFoundSamples.length != 0) { //  != 0
            var pBarq = new ProgressBar(myProgramTitul);
            pBarq.reset("Staining found signs. Such problem cases in the article " + myFoundSamples.length, myFoundSamples.length);
            // цикл по числу элементов коллекции. Движение снизу вверх
            for (j = myFoundSamples.length - 1; j >= 0; j-- , pBarq.hit()) { // j--
                var myLine = myFoundSamples[j];
                myLine.characters.itemByRange(0, (myLine.length - 1)).fillColor = "MistakeInQuoteUsage";
                myCounter_QA++;
            } // j--
            pBarq.close();
        } //  != 0
        return myCounter_QA;
    } // myQuAndChTest
    /////////
    function myCharTest(myCh, myCurStory, myLocIndex) { // myCharTest
        //  нормализуются переданные при вызове  функции символы и на основе этого делается заключение —
        // открывающая это кавычка, закрывающая или она поставлена в тексте с нарушением правил грамматики.
        // В первом случае возвращается символ "O" (opened), во втором "C" (closed), в третьем "N" (no).
        //
        if ((mySet2Estimate(myCh)) == true) { // FZ
            return ("L"); // L - признак, что встреченный специальный символ программа должна рассматривать как букву.
        } // FZ
        else if ((mySet1Estimate(myCh)) == true) { //YV
            return ("S"); // S - признак, что этот символ относится к группе знаков, использующихся как пробелы
        } //YV
        else if ((mySet3Estimate(myCh)) == true) { //NS
            return ("P"); // P - признак, что этот символ -- один из знаков пунктуации
        } //NS
        else if ((mySetTEstimate(myCh)) == true) { // FU
            return ("T"); // T - признак, что встреченный символ программа должна рассматривать как черту (дефис, тире, минус...)
        } // FU
        else if ((mySet2AEstimate(myCh)) == true) { //ciFra
            return ("F"); // F - признак, что этот символ -- цифра
        } // ciFra
        else if ((mySet5Estimate(myCh)) == true) { // Letter
            return ("L"); // L - признак, что этот символ -- буква
        } // Letter
        else if ((mySet6Estimate(myCh)) == true) { // FC
            return ("C"); // C - признак, что встреченный символ программа должна рассматривать как открывающую скобку
        } // FC
        else if ((mySet7Estimate(myCh)) == true) { // FU
            return ("V"); // V - признак, что встреченный символ программа должна рассматривать как закрывающую скобку
        } // FU
        else if ((mySet4Estimate(myCh)) == true) { //NS
            return ("B"); // B - признак, что этот символ относится к группе знаков, использующихся как перевод или разрыв строки, колонки и пр.
        } //NS
        else if ((myCh == my_ELLIPSIS_CHARACTER) == true) { // FZ
            return ("E"); // L - признак, что встреченный специальный символ -- многоточие
        } // FZ
        else if ((myCh == my_FOOTNOTE_SYMBOL) == true) { // FF
            return ("P"); // P - сноска, как и знак пунктуации, может быть как до, так и после закрывающей скобки
        } // FF
        try { //try
            myColor = myDocument.colors.item("ThisIsNewChar");
            myName = myColor.name;
        }  //try
        catch (myError) { //catch
            myColor = myDocument.colors.add({ name: "ThisIsNewChar", model: ColorModel.process, space: ColorSpace.RGB, colorValue: NewCharColorSample });
        } //catch
        myCurStory.characters[myLocIndex].fillColor = "ThisIsNewChar";
        if (parseInt(app.version) == 6) var myP1 = myCurStory.characters[myLocIndex].parentTextFrames[0].parent.name;
        else var myP1 = myCurStory.characters[myLocIndex].parentTextFrames[0].parentPage.name;
        myInfoLineAboutError = "On page " + String(myP1) + " unaccounted character is found. Find the color 'NewCharColorSample'. This color of quote next to which there is a symbol that caused the stop. May be this character does not belong next to the quote, or it is one of the letters of the extended character set. If so add this character to the 'myRightChars' line and run the program again.\n";
        return null;
    } // myCharTest
    //////
    function mySet1Estimate(myChar) { //1
        for (i = 0; i < mySet_S.length; i++) { //F1
            if (myChar == mySet_S[i]) return (true);
        } //F1
        return (false);
    } // 1
    ////
    function mySet2Estimate(myChar) { //2
        var myR;
        //if (myChar == SpecialCharacters.HEBREW_GERESH) return(true);
        try {
            myR = myRightChars.indexOf(myChar)
        }
        catch (e) {
            return (false)
        }; // -1, если символ не найден     
        if (myR != -1) return (true);
        else return (false);
    } //2
    /// 6.4.2015 -- решено разделить буквы и цифры   
    function mySet2AEstimate(myChar) { //2A
        var myR;
        try { myR = myDigits.indexOf(myChar) } catch (e) { return (false) }; // -1, если символ не найден     
        if (myR != -1) return (true);
        else return (false);
    } //2A
    ///
    function mySet3Estimate(myChar) { //3
        if ((myChar == SpecialCharacters.HEBREW_GERESH) || (myChar == SpecialCharacters.HEBREW_GERSHAYIM)) return (true);
        for (i = 0; i < mySet_P.length; i++) { //F1
            if (myChar == mySet_P[i]) return (true);
        } //F1
        return (false);
    } //3
    ///
    function mySet4Estimate(myChar) { //4
        for (i = 0; i < mySet_B.length; i++) { //F4
            if (myChar == mySet_B[i]) return (true);
        } //F4
        return (false);
    } // 4
    ///
    function mySet5Estimate(myChar) { //5
        for (i = 0; i < my5Set.length; i++) { //F5
            if (myChar == my5Set[i]) return (true);
        } //F5
        return (false);
    } // 5
    ///
    function mySet6Estimate(myChar) { //6
        for (i = 0; i < my6Set.length; i++) { //F6
            if (myChar == my6Set[i]) return (true);
        } //F6
        return (false);
    } //6
    ///
    function mySet7Estimate(myChar) { //7
        for (i = 0; i < my7Set.length; i++) { //F7
            if (myChar == my7Set[i]) return (true);
        } //F7
        return (false);
    } // 7
    ///
    function mySetTEstimate(myChar) { //T
        for (i = 0; i < mySet_T.length; i++) { //F7
            if (myChar == mySet_T[i]) return (true);
        } //F7
        return (false);
    } // T
    ///
    function myEstimateErrorInText(myChar) { //TE
        for (i = 0; i < myMaskErrorInText.length; i++) { //F~
            if (myChar == myMaskErrorInText[i]) return (true);
        } //F~
        return (false);
    } // TE
    ////
    function myEstimateOpenQuote(myChar) { //TO
        for (i = 0; i < myMaskOpenQuote.length; i++) { //FO
            if (myChar == myMaskOpenQuote[i]) return (true);
        } //FO
        return (false);
    } // TO
    //
    function myEstimateCloseQuote(myChar) { //TC
        for (i = 0; i < myMaskCloseQuote.length; i++) { //FC
            if (myChar == myMaskCloseQuote[i]) return (true);
        } //FC
        return (false);
    } // TC
    /////
    function myMakeDecisionAboutQuote(myChars, myTmpStory, myTmpCurIndex) { // myMakeDecisionAboutQuote
        if (myEstimateErrorInText(myChars) == true) { // проблемная кавычка - из контекста неясно, открывающая или закрывающая
            try { //try
                myColor = myDocument.colors.item("OpenOrCloseQuote");
                myName = myColor.name;
            }  //try
            catch (myError) { //catch
                myColor = myDocument.colors.add({ name: "OpenOrCloseQuote", model: ColorModel.process, space: ColorSpace.RGB, colorValue: OpenOrCloseQuoteColorSample });
            } //catch
            myTmpStory.characters[myTmpCurIndex].fillColor = "OpenOrCloseQuote";
            if (parseInt(app.version) == 6) var myP1 = myTmpStory.characters[myTmpCurIndex].parentTextFrames[0].parent.name;
            else var myP1 = myTmpStory.characters[myTmpCurIndex].parentTextFrames[0].parentPage.name;
            myStopProcessing = 1;
            myStory.recompose();
            myInfoLineAboutError = "On page " + String(myP1) + " a quotation mark is encountered that cannot be uniquely assigned to an opening or closing quote. Find color 'OpenOrCloseQuote' used to paint this quote character. Correct the text and run the program again.";
            return 1;
        } //  // проблемная кавычка - из контекста неясно, открывающая или закрывающая
        if (myEstimateOpenQuote(myChars) == true) { // myEstimateOpenQuote
            myOpenQuoteIndex = myTmpCurIndex;  // сохранен индекс текущей открывающей кавычки
            myOpenContinuousQuotes.push(myTmpCurIndex); // запомним индекс этой открывающей кавычки. Если они будут идти подряд, эта информация поможет покрасить их в тексте
            if (myCurrQuotesLevel > 3) { // уровень вложения кавычек превысил три, значит, число открывающих кавычек, для которых нет парной закрывающей, достигло числа пять           
                myOpenQuoteNumber++;
                for (i = 0; i < myOpenContinuousQuotes.length; i++) { myTmpStory.characters[myOpenContinuousQuotes[i]].fillColor = "MistakeInQuoteUsage"; }
                if (parseInt(app.version) == 6) {
                    try { myP0 = myTmpStory.characters[myOpenContinuousQuotes[0]].parentTextFrames[0].parent.name; } catch (e) { myP0 = ""; }
                    try { myP1 = myTmpStory.characters[myOpenContinuousQuotes[1]].parentTextFrames[0].parent.name; } catch (e) { myP1 = ""; }
                    try { myP2 = myTmpStory.characters[myOpenContinuousQuotes[2]].parentTextFrames[0].parent.name; } catch (e) { myP2 = ""; }
                    try { myP3 = myTmpStory.characters[myOpenContinuousQuotes[3]].parentTextFrames[0].parent.name; } catch (e) { myP3 = ""; }
                    try { myP4 = myTmpStory.characters[myOpenContinuousQuotes[4]].parentTextFrames[0].parent.name; } catch (e) { myP4 = ""; }
                }
                else {
                    try { myP0 = myTmpStory.characters[myOpenContinuousQuotes[0]].parentTextFrames[0].parentPage.name; } catch (e) { myP0 = ""; }
                    try { myP1 = myTmpStory.characters[myOpenContinuousQuotes[1]].parentTextFrames[0].parentPage.name; } catch (e) { myP1 = ""; }
                    try { myP2 = myTmpStory.characters[myOpenContinuousQuotes[2]].parentTextFrames[0].parentPage.name; } catch (e) { myP2 = ""; }
                    try { myP3 = myTmpStory.characters[myOpenContinuousQuotes[3]].parentTextFrames[0].parentPage.name; } catch (e) { myP3 = ""; }
                    try { myP4 = myTmpStory.characters[myOpenContinuousQuotes[4]].parentTextFrames[0].parentPage.name; } catch (e) { myP4 = ""; }
                }
                var myQuotePages = myP0 + ", " + myP1 + ", " + myP2 + ", " + myP3 + ", " + myP4;
                myInfoLineAboutError = "Met the fifth consecutive open quote. These quotes are located on p. " + String(myQuotePages) + " colored 'MistakeInQuoteUsage'.";
                myStopProcessing = 0; // при такой ошибке повторную обработку текста надо начинать сначала				
                return 1;
            }   // число открывающих кавычек, для которых нет парной закрывающей, достигло числа пять            
            else if (myLitQuotes_value == 0) { // myLitQuotes = 0
                myOpenQuoteNumber++;
                myTmpStory.characters[myTmpCurIndex].contents = myCurrOpenQuote[myCurrQuotesLevel];
                myCurrQuotesLevel++;
                if (myCurrQuotesLevel > myLevelMax) myLevelMax++;
                myQuoteLineIsOpen = true;
                return 0;
            } // myLitQuotes = 0
            else if (myLitQuotes_value == 1) { // myLitQuotes_value == 1   
                if (myNewAbzatc == true) { //myNewAbzatc == true && myQuoteLineIsOpen == false                      
                    myCurrQuotesLevel = 0;
                    myLevelMax = 0;
                    // if (myCloseQuoteIndex != -1) myTmpStory.characters[myCloseQuoteIndex].contents = myCurrCloseQuote[myCurrQuotesLevel]; // если после запуска скрипта на продолжение обнаружится, что текущая позиция курсора в момент начала продолжения обработки больше значения myCloseQuoteIndex, то будет ошибка: myTmpStory.characters[myCloseQuoteIndex] находится уже за пределами обрабатываемой области. Поэтому try/catch
                    if (myCloseQuoteIndex != -1) try { myTmpStory.characters[myCloseQuoteIndex].contents = myCurrCloseQuote[myCurrQuotesLevel]; } catch (e) { }
                } // myNewAbzatc == true && myQuoteLineIsOpen == false
                myNewAbzatc = false;
                myQuoteLineIsOpen = true;
                myTmpStory.characters[myTmpCurIndex].contents = myCurrOpenQuote[myCurrQuotesLevel];
                myCurrQuotesLevel++;
                if (myCurrQuotesLevel > myLevelMax) myLevelMax++;
                myOpenQuoteNumber++;
                return 0;
            } //  myLitQuotes_value == 1
        } // myEstimateOpenQuote
        if (myEstimateCloseQuote(myChars) == true) { // myEstimateCloseQuote
            /// 8/2/2015                
            if (myCurrQuotesLevel == 0) myTmpStory.characters[myTmpCurIndex].fillColor = "MistakeInQuoteUsage";  // это непарная закрывающая кавычкац
            myCloseQuoteIndex = myTmpCurIndex;  // сохранен индекс текущей закрывающей кавычки  
            myQuoteLineIsOpen = false;
            if (myOpenContinuousQuotes.length > 0) {
                myOpenContinuousQuotes.pop(); // удалим из массива индексов открывающих кавычек, для которых нет парной закрывающей, последний добавленный индекс, т.к. только что была встречена закрывающая кавычка       
            }
            if (myCurrQuotesLevel > 0) myCurrQuotesLevel--;
            myTmpStory.characters[myTmpCurIndex].contents = myCurrCloseQuote[myCurrQuotesLevel];
            myCloseQuoteNumber++;
            return 0;
        } // myEstimateCloseQuote
        myTmpStory.characters[myTmpCurIndex].fillColor = "MistakeInQuoteUsage";
        if (parseInt(app.version) == 6) var myP1 = myTmpStory.characters[myTmpCurIndex].parentTextFrames[0].parent.name;
        else var myP1 = myTmpStory.characters[myTmpCurIndex].parentTextFrames[0].parentPage.name;
        myStopProcessing = 1;
        myStory.recompose();
        myInfoLineAboutError = "In the processing of the quotes on the page " + String(myP1) + " the program created an unaccounted mask: " + myChars + ".";
        return 1;
    }  // myMakeDecisionAboutQuote
    ///
    function myProcFinish(myInfoLine) { // myProcFinish
        var myDateF = new Date;
        var FinValue = myDateF.getTime();
        var myTimeInSec = (FinValue - myValue) / 1000;
        var myMinutesFinis = ((FinValue - myValue) / 60000).toFixed(0);
        myRate = (myAllQuotesLength / myTimeInSec).toFixed(2);
        var myProcTime = "";
        try { pBar.close(); } catch (e) { }
        if (myStopProcessing == 0 && myAllQuotesLength != 0) { // myStopProcessing == 0
            if (isNaN(myAllQuotesLength) != true) myProcTime = "\n\nProcessing time approximately " + myMinutesFinis + " min (exactly " + myTimeInSec.toFixed(0) + " sec.).";
            if (isNaN(myAllQuotesLength) != true) myProcTime += "\nQuote processing speed " + myRate + " char/sec.";
        } // myStopProcessing == 0
        //mySaveProcQuoteParameters(myStory); /// <<<
        ///=- снимем текущее выделение    
        try {
            mySelection = app.selection[0];
            mySelection.insertionPoints[0].select();
            app.documents[0].select(NothingEnum.nothing);
        }
        catch (e) { }
        if (myRezT == 1) myInfoLine += "\nThis table is selected now.";
        ///=-
        if (myInfoLine.length == 0) myInfoLine = "Text is processed.";
        myInfoLine += myProcTime;
        //alert(myInfoLine, myRightProgramTitul);
        exit();
    } // myProcFinish
    /////////////////  
    function mySelectParametersDialog(myPath) { // mySelectParametersDialog
        var win = new Window("dialog", myRightProgramTitul);
        var myRedColor = win.graphics.newPen(win.graphics.PenType.SOLID_COLOR, [1.0, 0.0, 0.0], 1);
        var myGreenColor = win.graphics.newPen(win.graphics.PenType.SOLID_COLOR, [0.0, 0.7, 0.0], 1)
        var myInfolineColor = win.graphics.newPen(win.graphics.PenType.SOLID_COLOR, myMenuColor, 1)
        win.alignChildren = "top";
        win.orientation = "column";
        var topPanel = win.add("panel");
        topPanel.orientation = "column";
        topPanel.alignChildren = ["fill", "fill"];
        topPanel.alignment = "left";
        myWhiteSpace = "\u00A0";
        var infoLine1 = topPanel.add("statictext", undefined, "Basic settings for handling quotes:");
        infoLine1.graphics.foregroundColor = myInfolineColor;
        var InCopyIsUsedInWorkflow = topPanel.add("checkbox", undefined, myWhiteSpace + "Use the combination of InDesign + InCopy");
        InCopyIsUsedInWorkflow_value == 1 ? InCopyIsUsedInWorkflow.value = true : InCopyIsUsedInWorkflow.value = false;

        InCopyIsUsedInWorkflowMessage = "If InDesign and InCopy are running at the same time, there is a chance that you can start processing quotes in the file that InCopy is working with. To keep this situation under control, this check box is added. When it is installed, the script displays a message and stops working in all cases when the status of the selected article is displayed in the 'Window>Editorial>Assignments' panel by one of the icons of interaction between InDesign and InCopy programs. Obviously, if you clear this check box, you can try to process the article from the InDesign+InCopy technology chain. But the result may not be saved, or a system message will appear that the article is locked.";
        myApostrofIsQuoteMessage = "When the check box is cleared, if we find a single quote surrounded by letters, we consider it an apostrophe, and we do not consider this sign as a quotation mark. Examples: Sheila O'Neill, Scarlett O'Hara, etc. Use this check box to check that there are no quotes between letters in the work if it is known that some author sins of losing spaces before or after quotes."

        var myApostrofIsQuote = topPanel.add("checkbox", undefined, myWhiteSpace + "Consider an apostrophe in a word as a quotation mark and report it");
        myApostrofIsQuote_value == 1 ? myApostrofIsQuote.value = true : myApostrofIsQuote.value = false;

        var ShowHelp = topPanel.add("checkbox", undefined, myWhiteSpace + "Display information about the purpose of the check boxes in the program window");
        ShowHelp_value == 1 ? ShowHelp.value = true : ShowHelp.value = false;
        if (ShowHelp_value == 1) {
            myApostrofIsQuote.helpTip = myApostrofIsQuoteMessage;
            InCopyIsUsedInWorkflow.helpTip = InCopyIsUsedInWorkflowMessage;
        }
        else {
            myApostrofIsQuote.helpTip = "";
            InCopyIsUsedInWorkflow.helpTip = "";
        }
        ////////////////////
        myApostrofIsQuote.onClick = function () { // myApostrofIsQuote.onClick 
            if (myApostrofIsQuote.value != false) {
                myApostrofIsQuote_value = 1;
            }
            else {
                myApostrofIsQuote_value = 0;
            }
        } // myApostrofIsQuote.onClick
        /////////////////// 
        InCopyIsUsedInWorkflow.onClick = function () { // InCopyIsUsedInWorkflow.onClick 
            if (InCopyIsUsedInWorkflow.value != false) {
                InCopyIsUsedInWorkflow_value = 1;
            }
            else {
                InCopyIsUsedInWorkflow_value = 0;
            }
        } // InCopyIsUsedInWorkflow.onClick
        separator1 = topPanel.add("panel"); // Помещаем на экран горизонтальную линию
        separator1.minimumSize.height = separator1.maximumSize.height = 1;
        separator1.alignment = ["fill", "fill"];
        var infoLine2 = topPanel.add("statictext", undefined, "Select the type of quotes for different attachment levels:");
        infoLine2.graphics.foregroundColor = myInfolineColor;
        var Group1 = topPanel.add("group");
        Group1.orientation = "row";
        var myDropdown1 = Group1.add("dropdownlist", undefined, myQuotesList);
        Group1.add("statictext", undefined, "Main quotes in the text");
        myDropdown1.selection = myQ0;
        ///
        var Group2 = topPanel.add("group");
        Group2.orientation = "row";
        var myDropdown2 = Group2.add("dropdownlist", undefined, myQuotesList);
        Group2.add("statictext", undefined, "Quotes the first level of nesting");
        myDropdown2.selection = myQ1;
        ///
        var Group3 = topPanel.add("group");
        Group3.orientation = "row";
        var myDropdown3 = Group3.add("dropdownlist", undefined, myQuotesList);
        Group3.add("statictext", undefined, "Quotes the second level of nesting");
        myDropdown3.selection = myQ2;
        ///
        var Group4 = topPanel.add("group");
        Group4.orientation = "row";
        var myDropdown4 = Group4.add("dropdownlist", undefined, myQuotesList);
        Group4.add("statictext", undefined, "Quotes the third level of nesting");
        myDropdown4.selection = myQ3;
        separatorL = topPanel.add("panel"); // Помещаем на экран горизонтальную линию
        separatorL.minimumSize.height = separatorL.maximumSize.height = 1;
        separatorL.alignment = ["fill", "fill"];
        ///
        myLitQuotesMessage = "When the check box is selected, the first opening quotation mark of the next paragraph and the previous closing quotation mark correspond to the main quotation marks in the text. Also, this setting is irreplaceable in the case when each paragraph in a multiparagraph quote begins with a quote, and the closing quote is only one at the end of the last sentence of the quote.";
        myPrTblMessage = "The selection is active only if there are tables in the article. When the check box is selected, all tables are processed with the article, regardless of whether part of the article or the entire article is selected. If the cursor is in the table when the script is run, only the table will be processed, regardless of this check box.";
        var myLitQuotes = topPanel.add("checkbox", undefined, "The first opening quotation mark of a paragraph is always the main quotation mark");
        myLitQuotes_value == 1 ? myLitQuotes.value = true : myLitQuotes.value = false;
        myLitQuotes.alignment = "left";
        if (ShowHelp_value == 1) myLitQuotes.helpTip = myLitQuotesMessage;
        else myLitQuotes.helpTip = "";
        ///
        //if (myStory.tables.length == 0) myPrTbl_value = 0;
        var myPrTbl = topPanel.add("checkbox", undefined, "Process tables along with the article");
        myPrTbl_value == 1 ? myPrTbl.value = true : myPrTbl.value = false;
        myPrTbl.alignment = "left";
        if (myStory.tables.length == 0) { myPrTbl.enabled = false; myPrTbl.value = false; }
        if (ShowHelp_value == 1) myPrTbl.helpTip = myPrTblMessage;
        else myPrTbl.helpTip = "";
        ////////////////////     
        ShowHelp.onClick = function () { // ShowHelp.onClick 
            if (ShowHelp.value != false) {
                ShowHelp.value = true;
                ShowHelp_value = 1;
                myApostrofIsQuote.helpTip = myApostrofIsQuoteMessage;
                InCopyIsUsedInWorkflow.helpTip = InCopyIsUsedInWorkflowMessage;
                myLitQuotes.helpTip = myLitQuotesMessage;
                myPrTbl.helpTip = myPrTblMessage;
                myWelcomeInfo.helpTip = myWelcomeInfoHelp;
            }
            else {
                ShowHelp.value = false;
                ShowHelp_value = 0;
                myApostrofIsQuote.helpTip = "";
                InCopyIsUsedInWorkflow.helpTip = "";
                myLitQuotes.helpTip = "";
                myPrTbl.helpTip = "";
                myWelcomeInfo.helpTip = "";
            }
        } // ShowHelp.onClick
        ////
        var wbtn = win.add("group");
        wbtn.alignChildren = ["fill", "fill"];
        wbtn.orientation = "row";
        var myOKButon = wbtn.add("button", myButtonSize, "Process text", { name: "ok" });
        const myInfo = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00 \x00\x00\x00\x12\b\x06\x00\x00\x00:\u00C8\u00DCR\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\nOiCCPPhotoshop ICC profile\x00\x00x\u00DA\u009DSgTS\u00E9\x16=\u00F7\u00DE\u00F4BK\u0088\u0080\u0094KoR\x15\b RB\u008B\u0080\x14\u0091&*!\t\x10J\u0088!\u00A1\u00D9\x15Q\u00C1\x11EE\x04\x1B\u00C8\u00A0\u0088\x03\u008E\u008E\u0080\u008C\x15Q,\f\u008A\n\u00D8\x07\u00E4!\u00A2\u008E\u0083\u00A3\u0088\u008A\u00CA\u00FB\u00E1{\u00A3k\u00D6\u00BC\u00F7\u00E6\u00CD\u00FE\u00B5\u00D7>\u00E7\u00AC\u00F3\u009D\u00B3\u00CF\x07\u00C0\b\f\u0096H3Q5\u0080\f\u00A9B\x1E\x11\u00E0\u0083\u00C7\u00C4\u00C6\u00E1\u00E4.@\u0081\n$p\x00\x10\b\u00B3d!s\u00FD#\x01\x00\u00F8~<<+\"\u00C0\x07\u00BE\x00\x01x\u00D3\x0B\b\x00\u00C0M\u009B\u00C00\x1C\u0087\u00FF\x0F\u00EAB\u0099\\\x01\u0080\u0084\x01\u00C0t\u00918K\b\u0080\x14\x00@z\u008EB\u00A6\x00@F\x01\u0080\u009D\u0098&S\x00\u00A0\x04\x00`\u00CBcb\u00E3\x00P-\x00`'\x7F\u00E6\u00D3\x00\u0080\u009D\u00F8\u0099{\x01\x00[\u0094!\x15\x01\u00A0\u0091\x00 \x13e\u0088D\x00h;\x00\u00AC\u00CFV\u008AE\x00X0\x00\x14fK\u00C49\x00\u00D8-\x000IWfH\x00\u00B0\u00B7\x00\u00C0\u00CE\x10\x0B\u00B2\x00\b\f\x000Q\u0088\u0085)\x00\x04{\x00`\u00C8##x\x00\u0084\u0099\x00\x14F\u00F2W<\u00F1+\u00AE\x10\u00E7*\x00\x00x\u0099\u00B2<\u00B9$9E\u0081[\b-q\x07WW.\x1E(\u00CEI\x17+\x146a\x02a\u009A@.\u00C2y\u0099\x192\u00814\x0F\u00E0\u00F3\u00CC\x00\x00\u00A0\u0091\x15\x11\u00E0\u0083\u00F3\u00FDx\u00CE\x0E\u00AE\u00CE\u00CE6\u008E\u00B6\x0E_-\u00EA\u00BF\x06\u00FF\"bb\u00E3\u00FE\u00E5\u00CF\u00ABp@\x00\x00\u00E1t~\u00D1\u00FE,/\u00B3\x1A\u0080;\x06\u0080m\u00FE\u00A2%\u00EE\x04h^\x0B\u00A0u\u00F7\u008Bf\u00B2\x0F@\u00B5\x00\u00A0\u00E9\u00DAW\u00F3p\u00F8~<<E\u00A1\u0090\u00B9\u00D9\u00D9\u00E5\u00E4\u00E4\u00D8J\u00C4B[a\u00CAW}\u00FEg\u00C2_\u00C0W\u00FDl\u00F9~<\u00FC\u00F7\u00F5\u00E0\u00BE\u00E2$\u00812]\u0081G\x04\u00F8\u00E0\u00C2\u00CC\u00F4L\u00A5\x1C\u00CF\u0092\t\u0084b\u00DC\u00E6\u008FG\u00FC\u00B7\x0B\u00FF\u00FC\x1D\u00D3\"\u00C4Ib\u00B9X*\x14\u00E3Q\x12q\u008ED\u009A\u008C\u00F32\u00A5\"\u0089B\u0092)\u00C5%\u00D2\u00FFd\u00E2\u00DF,\u00FB\x03>\u00DF5\x00\u00B0j>\x01{\u0091-\u00A8]c\x03\u00F6K'\x10Xt\u00C0\u00E2\u00F7\x00\x00\u00F2\u00BBo\u00C1\u00D4(\b\x03\u0080h\u0083\u00E1\u00CFw\u00FF\u00EF?\u00FDG\u00A0%\x00\u0080fI\u0092q\x00\x00^D$.T\u00CA\u00B3?\u00C7\b\x00\x00D\u00A0\u0081*\u00B0A\x1B\u00F4\u00C1\x18,\u00C0\x06\x1C\u00C1\x05\u00DC\u00C1\x0B\u00FC`6\u0084B$\u00C4\u00C2B\x10B\nd\u0080\x1Cr`)\u00AC\u0082B(\u0086\u00CD\u00B0\x1D*`/\u00D4@\x1D4\u00C0Qh\u0086\u0093p\x0E.\u00C2U\u00B8\x0E=p\x0F\u00FAa\b\u009E\u00C1(\u00BC\u0081\t\x04A\u00C8\b\x13a!\u00DA\u0088\x01b\u008AX#\u008E\b\x17\u0099\u0085\u00F8!\u00C1H\x04\x12\u008B$ \u00C9\u0088\x14Q\"K\u00915H1R\u008AT UH\x1D\u00F2=r\x029\u0087\\F\u00BA\u0091;\u00C8\x002\u0082\u00FC\u0086\u00BCG1\u0094\u0081\u00B2Q=\u00D4\f\u00B5C\u00B9\u00A87\x1A\u0084F\u00A2\x0B\u00D0dt1\u009A\u008F\x16\u00A0\u009B\u00D0r\u00B4\x1A=\u008C6\u00A1\u00E7\u00D0\u00ABh\x0F\u00DA\u008F>C\u00C70\u00C0\u00E8\x18\x073\u00C4l0.\u00C6\u00C3B\u00B18,\t\u0093c\u00CB\u00B1\"\u00AC\f\u00AB\u00C6\x1A\u00B0V\u00AC\x03\u00BB\u0089\u00F5c\u00CF\u00B1w\x04\x12\u0081E\u00C0\t6\x04wB a\x1EAHXLXN\u00D8H\u00A8 \x1C$4\x11\u00DA\t7\t\x03\u0084Q\u00C2'\"\u0093\u00A8K\u00B4&\u00BA\x11\u00F9\u00C4\x18b21\u0087XH,#\u00D6\x12\u008F\x13/\x10{\u0088C\u00C47$\x12\u0089C2'\u00B9\u0090\x02I\u00B1\u00A4T\u00D2\x12\u00D2F\u00D2nR#\u00E9,\u00A9\u009B4H\x1A#\u0093\u00C9\u00DAdk\u00B2\x079\u0094, +\u00C8\u0085\u00E4\u009D\u00E4\u00C3\u00E43\u00E4\x1B\u00E4!\u00F2[\n\u009Db@q\u00A4\u00F8S\u00E2(R\u00CAjJ\x19\u00E5\x10\u00E54\u00E5\x06e\u00982AU\u00A3\u009AR\u00DD\u00A8\u00A1T\x115\u008FZB\u00AD\u00A1\u00B6R\u00AFQ\u0087\u00A8\x134u\u009A9\u00CD\u0083\x16IK\u00A5\u00AD\u00A2\u0095\u00D3\x1Ah\x17h\u00F7i\u00AF\u00E8t\u00BA\x11\u00DD\u0095\x1EN\u0097\u00D0W\u00D2\u00CB\u00E9G\u00E8\u0097\u00E8\x03\u00F4w\f\r\u0086\x15\u0083\u00C7\u0088g(\x19\u009B\x18\x07\x18g\x19w\x18\u00AF\u0098L\u00A6\x19\u00D3\u008B\x19\u00C7T071\u00EB\u0098\u00E7\u0099\x0F\u0099oUX*\u00B6*|\x15\u0091\u00CA\n\u0095J\u0095&\u0095\x1B*/T\u00A9\u00AA\u00A6\u00AA\u00DE\u00AA\x0BU\u00F3U\u00CBT\u008F\u00A9^S}\u00AEFU3S\u00E3\u00A9\t\u00D4\u0096\u00ABU\u00AA\u009DP\u00EBS\x1BSg\u00A9;\u00A8\u0087\u00AAg\u00A8oT?\u00A4~Y\u00FD\u0089\x06Y\u00C3L\u00C3OC\u00A4Q\u00A0\u00B1_\u00E3\u00BC\u00C6 \x0Bc\x19\u00B3x,!k\r\u00AB\u0086u\u00815\u00C4&\u00B1\u00CD\u00D9|v*\u00BB\u0098\u00FD\x1D\u00BB\u008B=\u00AA\u00A9\u00A19C3J3W\u00B3R\u00F3\u0094f?\x07\u00E3\u0098q\u00F8\u009CtN\t\u00E7(\u00A7\u0097\u00F3~\u008A\u00DE\x14\u00EF)\u00E2)\x1B\u00A64L\u00B91e\\k\u00AA\u0096\u0097\u0096X\u00ABH\u00ABQ\u00ABG\u00EB\u00BD6\u00AE\u00ED\u00A7\u009D\u00A6\u00BDE\u00BBY\u00FB\u0081\x0EA\u00C7J'\\'Gg\u008F\u00CE\x05\u009D\u00E7S\u00D9S\u00DD\u00A7\n\u00A7\x16M=:\u00F5\u00AE.\u00AAk\u00A5\x1B\u00A1\u00BBDw\u00BFn\u00A7\u00EE\u0098\u009E\u00BE^\u0080\u009ELo\u00A7\u00DEy\u00BD\u00E7\u00FA\x1C}/\u00FDT\u00FDm\u00FA\u00A7\u00F5G\fX\x06\u00B3\f$\x06\u00DB\f\u00CE\x18<\u00C55qo<\x1D/\u00C7\u00DB\u00F1QC]\u00C3@C\u00A5a\u0095a\u0097\u00E1\u0084\u0091\u00B9\u00D1<\u00A3\u00D5F\u008DF\x0F\u008Ci\u00C6\\\u00E3$\u00E3m\u00C6m\u00C6\u00A3&\x06&!&KM\u00EAM\u00EE\u009ARM\u00B9\u00A6)\u00A6;L;L\u00C7\u00CD\u00CC\u00CD\u00A2\u00CD\u00D6\u00995\u009B=1\u00D72\u00E7\u009B\u00E7\u009B\u00D7\u009B\u00DF\u00B7`ZxZ,\u00B6\u00A8\u00B6\u00B8eI\u00B2\u00E4Z\u00A6Y\u00EE\u00B6\u00BCn\u0085Z9Y\u00A5XUZ]\u00B3F\u00AD\u009D\u00AD%\u00D6\u00BB\u00AD\u00BB\u00A7\x11\u00A7\u00B9N\u0093N\u00AB\u009E\u00D6g\u00C3\u00B0\u00F1\u00B6\u00C9\u00B6\u00A9\u00B7\x19\u00B0\u00E5\u00D8\x06\u00DB\u00AE\u00B6m\u00B6}agb\x17g\u00B7\u00C5\u00AE\u00C3\u00EE\u0093\u00BD\u0093}\u00BA}\u008D\u00FD=\x07\r\u0087\u00D9\x0E\u00AB\x1DZ\x1D~s\u00B4r\x14:V:\u00DE\u009A\u00CE\u009C\u00EE?}\u00C5\u00F4\u0096\u00E9/gX\u00CF\x10\u00CF\u00D83\u00E3\u00B6\x13\u00CB)\u00C4i\u009DS\u009B\u00D3Gg\x17g\u00B9s\u0083\u00F3\u0088\u008B\u0089K\u0082\u00CB.\u0097>.\u009B\x1B\u00C6\u00DD\u00C8\u00BD\u00E4Jt\u00F5q]\u00E1z\u00D2\u00F5\u009D\u009B\u00B3\u009B\u00C2\u00ED\u00A8\u00DB\u00AF\u00EE6\u00EEi\u00EE\u0087\u00DC\u009F\u00CC4\u009F)\u009EY3s\u00D0\u00C3\u00C8C\u00E0Q\u00E5\u00D1?\x0B\u009F\u00950k\u00DF\u00AC~OCO\u0081g\u00B5\u00E7#/c/\u0091W\u00AD\u00D7\u00B0\u00B7\u00A5w\u00AA\u00F7a\u00EF\x17>\u00F6>r\u009F\u00E3>\u00E3<7\u00DE2\u00DEY_\u00CC7\u00C0\u00B7\u00C8\u00B7\u00CBO\u00C3o\u009E_\u0085\u00DFC\x7F#\u00FFd\u00FFz\u00FF\u00D1\x00\u00A7\u0080%\x01g\x03\u0089\u0081A\u0081[\x02\u00FB\u00F8z|!\u00BF\u008E?:\u00DBe\u00F6\u00B2\u00D9\u00EDA\u008C\u00A0\u00B9A\x15A\u008F\u0082\u00AD\u0082\u00E5\u00C1\u00AD!h\u00C8\u00EC\u0090\u00AD!\u00F7\u00E7\u0098\u00CE\u0091\u00CEi\x0E\u0085P~\u00E8\u00D6\u00D0\x07a\u00E6a\u008B\u00C3~\f'\u0085\u0087\u0085W\u0086?\u008Ep\u0088X\x1A\u00D11\u00975w\u00D1\u00DCCs\u00DFD\u00FAD\u0096D\u00DE\u009Bg1O9\u00AF-J5*>\u00AA.j<\u00DA7\u00BA4\u00BA?\u00C6.fY\u00CC\u00D5X\u009DXIlK\x1C9.*\u00AE6nl\u00BE\u00DF\u00FC\u00ED\u00F3\u0087\u00E2\u009D\u00E2\x0B\u00E3{\x17\u0098/\u00C8]py\u00A1\u00CE\u00C2\u00F4\u0085\u00A7\x16\u00A9.\x12,:\u0096@L\u0088N8\u0094\u00F0A\x10*\u00A8\x16\u008C%\u00F2\x13w%\u008E\ny\u00C2\x1D\u00C2g\"/\u00D16\u00D1\u0088\u00D8C\\*\x1EN\u00F2H*Mz\u0092\u00EC\u0091\u00BC5y$\u00C53\u00A5,\u00E5\u00B9\u0084'\u00A9\u0090\u00BCL\rL\u00DD\u009B:\u009E\x16\u009Av m2=:\u00BD1\u0083\u0092\u0091\u0090qB\u00AA!M\u0093\u00B6g\u00EAg\u00E6fv\u00CB\u00ACe\u0085\u00B2\u00FE\u00C5n\u008B\u00B7/\x1E\u0095\x07\u00C9k\u00B3\u0090\u00AC\x05Y-\n\u00B6B\u00A6\u00E8TZ(\u00D7*\x07\u00B2geWf\u00BF\u00CD\u0089\u00CA9\u0096\u00AB\u009E+\u00CD\u00ED\u00CC\u00B3\u00CA\u00DB\u00907\u009C\u00EF\u009F\u00FF\u00ED\x12\u00C2\x12\u00E1\u0092\u00B6\u00A5\u0086KW-\x1DX\u00E6\u00BD\u00ACj9\u00B2<qy\u00DB\n\u00E3\x15\x05+\u0086V\x06\u00AC<\u00B8\u008A\u00B6*m\u00D5O\u00AB\u00EDW\u0097\u00AE~\u00BD&zMk\u0081^\u00C1\u00CA\u0082\u00C1\u00B5\x01k\u00EB\x0BU\n\u00E5\u0085}\u00EB\u00DC\u00D7\u00ED]OX/Y\u00DF\u00B5a\u00FA\u0086\u009D\x1B>\x15\u0089\u008A\u00AE\x14\u00DB\x17\u0097\x15\x7F\u00D8(\u00DCx\u00E5\x1B\u0087o\u00CA\u00BF\u0099\u00DC\u0094\u00B4\u00A9\u00AB\u00C4\u00B9d\u00CFf\u00D2f\u00E9\u00E6\u00DE-\u009E[\x0E\u0096\u00AA\u0097\u00E6\u0097\x0En\r\u00D9\u00DA\u00B4\r\u00DFV\u00B4\u00ED\u00F5\u00F6E\u00DB/\u0097\u00CD(\u00DB\u00BB\u0083\u00B6C\u00B9\u00A3\u00BF<\u00B8\u00BCe\u00A7\u00C9\u00CE\u00CD;?T\u00A4T\u00F4T\u00FAT6\u00EE\u00D2\u00DD\u00B5a\u00D7\u00F8n\u00D1\u00EE\x1B{\u00BC\u00F64\u00EC\u00D5\u00DB[\u00BC\u00F7\u00FD>\u00C9\u00BE\u00DBU\x01UM\u00D5f\u00D5e\u00FBI\u00FB\u00B3\u00F7?\u00AE\u0089\u00AA\u00E9\u00F8\u0096\u00FBm]\u00ADNmq\u00ED\u00C7\x03\u00D2\x03\u00FD\x07#\x0E\u00B6\u00D7\u00B9\u00D4\u00D5\x1D\u00D2=TR\u008F\u00D6+\u00EBG\x0E\u00C7\x1F\u00BE\u00FE\u009D\u00EFw-\r6\rU\u008D\u009C\u00C6\u00E2#pDy\u00E4\u00E9\u00F7\t\u00DF\u00F7\x1E\r:\u00DAv\u008C{\u00AC\u00E1\x07\u00D3\x1Fv\x1Dg\x1D/jB\u009A\u00F2\u009AF\u009BS\u009A\u00FB[b[\u00BAO\u00CC>\u00D1\u00D6\u00EA\u00DEz\u00FCG\u00DB\x1F\x0F\u009C4<YyJ\u00F3T\u00C9i\u00DA\u00E9\u0082\u00D3\u0093g\u00F2\u00CF\u008C\u009D\u0095\u009D}~.\u00F9\u00DC`\u00DB\u00A2\u00B6{\u00E7c\u00CE\u00DFj\x0Fo\u00EF\u00BA\x10t\u00E1\u00D2E\u00FF\u008B\u00E7;\u00BC;\u00CE\\\u00F2\u00B8t\u00F2\u00B2\u00DB\u00E5\x13W\u00B8W\u009A\u00AF:_m\u00EAt\u00EA<\u00FE\u0093\u00D3O\u00C7\u00BB\u009C\u00BB\u009A\u00AE\u00B9\\k\u00B9\u00EEz\u00BD\u00B5{f\u00F7\u00E9\x1B\u009E7\u00CE\u00DD\u00F4\u00BDy\u00F1\x16\u00FF\u00D6\u00D5\u009E9=\u00DD\u00BD\u00F3zo\u00F7\u00C5\u00F7\u00F5\u00DF\x16\u00DD~r'\u00FD\u00CE\u00CB\u00BB\u00D9w'\u00EE\u00AD\u00BCO\u00BC_\u00F4@\u00EDA\u00D9C\u00DD\u0087\u00D5?[\u00FE\u00DC\u00D8\u00EF\u00DC\x7Fj\u00C0w\u00A0\u00F3\u00D1\u00DCG\u00F7\x06\u0085\u0083\u00CF\u00FE\u0091\u00F5\u008F\x0FC\x05\u008F\u0099\u008F\u00CB\u0086\r\u0086\u00EB\u009E8>99\u00E2?r\u00FD\u00E9\u00FC\u00A7C\u00CFd\u00CF&\u009E\x17\u00FE\u00A2\u00FE\u00CB\u00AE\x17\x16/~\u00F8\u00D5\u00EB\u00D7\u00CE\u00D1\u0098\u00D1\u00A1\u0097\u00F2\u0097\u0093\u00BFm|\u00A5\u00FD\u00EA\u00C0\u00EB\x19\u00AF\u00DB\u00C6\u00C2\u00C6\x1E\u00BE\u00C9x31^\u00F4V\u00FB\u00ED\u00C1w\u00DCw\x1D\u00EF\u00A3\u00DF\x0FO\u00E4| \x7F(\u00FFh\u00F9\u00B1\u00F5S\u00D0\u00A7\u00FB\u0093\x19\u0093\u0093\u00FF\x04\x03\u0098\u00F3\u00FCc3-\u00DB\x00\x00\x00 cHRM\x00\x00z%\x00\x00\u0080\u0083\x00\x00\u00F9\u00FF\x00\x00\u0080\u00E9\x00\x00u0\x00\x00\u00EA`\x00\x00:\u0098\x00\x00\x17o\u0092_\u00C5F\x00\x00\x04\u00E8IDATx\u00DA\u00A4\u0093[lTU\x14\u0086\u00BF\u00BD\u00CF\u009CNg\u00CE\u009CSJ\u00DB\u0099RJK\x11\x19n\x15,\u009D\u009A61\u00A2-E\u0081\u0080\u0089\"\u00C2\u0083\x06\x1F\x14\u0089\x0641\u008A\x11\u0095H\u0088&\x02j\u0088\x100\u00BE\x18C\x02\u0088\\\x05\u0093\u00CA-$\u00F4B@Z(\u0081\u00B6vJi\x0B\u00A5\u00D0\u0096\u00E9L;\u0097\u00CE\u00F6\x01\n\u00B5b2\u0089\u00EBi\u00AF\u00BD\u00B3\u00D6\u00FF\u00ED\x7F\u00EF%\u0094R\u008C\u008C\u009C\u00D2\u00ADHG26\u00D3\u00C06*\x05\u00E1\x10\\?\u00F8\x19}\u008D\u0095\x00\u00AB\u0081}\u0080\x7FD\u00D9d\u00A0\f\u00D8Rd\u00B8Y;v\x12\x0E[\x1F\u0083\u00F2.0\b@y\u009D\u00FF_Z\u00E2?\x00&HG\u00B2\u00CFf\x1A74\u00CBU\u00AB\u00A7\u008D\u00EE\u00D6,\x07\u00AD\u00BF\u00AC\u00A5\u00FB\u00ECA/\u00F0,\u00B0mD\u00D9;\u00C0\u00C19\u00E6\u0084\u0096\u008F\u00C6\u00E4#e/\x11\u00D1\u009D\u0082\x16x\x02\x06\u00B3\u0080s\u00E5u\u00FE\u0086\u0084\x00r\u00E7\u00EE\u00B8\u00AC\u00B9\u009C\u00935\u0097\x13\u00CD\u00E5\u00EC\u00D4L\u00E3\u0090\u009E6z\u00ABf\u00B9\u00CE6\u00FF\u00F8.\u00DD\u00D5\x07\u00CA\u00816\u00E0\u00D2\u00FD\u0092\x02 \u00A5\u00CC\u00E5=\u00FEIf\tJ\u00DE\u0099\x19\x15=o#\u00FB\x16\"\u0083\u0099J\f\x00\u00AA\u00B1\u00BC\u00CE\u00FFxB\x00y/\u00FE\u00E4\u00D7\\\u00CE\\\u00CDt\u00A2\u00B9\f4\u0097\x03\u00CDe([\u008A\u00B5S\u00A9\u00F8{M[\u00DE\u00E8\u00EA\u00AD\u00FDc\x11p\x14\u00D0\u0081\u00E7J\x1C\u00DE}\u00EB=\u00F3\u00D2\u00A4\u00D6\u00FBuT\u00F4\u00BE\u0086\fJ%\u0082 \u0083(\u00D9\x07\"\u00DCZ^\u00E7\u00CFI\b`\u00E2\u00B2\u00DD\x1B\u00A4\u00CB\u00B9\u00C6f:\u00B9\u00E7\u0082\u00814\x1C\bMC\u00EA\u00F6k\u00B1`\u00CFKW7.i\t\u00B5\u00D4M\x054oR\u00D6\u00F9\u00CD\u009E\u00D7\u00C7\u00B94\u00B57\"z\x1EC\x06y(\x1E\x04\u00D1\u0087\u0092\u00A1o\u00CB/^Y\u009D\x10\u0080w\u00E5Q\u0087\u00D4m\u00BFi.c\u00F6\u0090\x0BB\u00B7\u00DD?U\u00A8\u00E4\u0094\u00AE\u00C0\u00E5\u00D3E\u008D_-Z\u0089$\u00B0\u00C3\u00F3\u00E6\x0F\u00D3evMH\u008Bd!\u00FA\u00EF\u00DD\u00F8\x1F\u00E2\u00C13\u0088\u00C8\u00DC9\u00F55\u0081\u0084\x00\u00A6\x7FZ\x05\u0090#\u0093\u00F4J\u00CD4\u00C6\u00C8d\u00FB\x03\u00F1(:\u00E3L\u008D\u00EC\u008E\x13\u00F5\u00FB7\u00AC\u00F0\b\u00CB\fo|\u00E1\u00FD\x1B\u00E3\u00AB\u00E3\x05\u0091\u00B6^\u00E2I\ndh\u00B8x\x17\"\\\x024\u0094]9\u0092\u00D8\x14\u00CC\u00DCt\u00F9\u00DE\u00A1\x14\x1Bd\u00B2}\rB\x00\x10\x156\u00F2\x1D\u00BDLi?J_\u00FAd\x02\u00A1\u00BB\u00F8\u00FEl\u00C0nZ\u00B4\u00A5\u00F63\u00EBL2\u00E2\u00C2\x1D\u00E2I\u00F1a\x0E\u0084\u00BES\u00C4W\x01\u00945\u00EEL\f`\u00D6\u00B6\u00E6\u00A1\u00E5|\u00848\x04\x10\u008DC\u008E)(n\u00DBCsv\x195j\"y='Y\u00B6\u00EF\x14\x13/\u00BA\u00B85\u00DB\u00A4vr\u0088\u00E2#6\u00C2\u00AD\u00BD\b=~\u00FF)\u00FA\x17\u0083\u00D8\x03P\u00DA\u00B4=A\u0080\u00ED-C\u00CBt\x14\u00B5\b\u00C6\u00A8$\u0083\u00E7\u00A25(!\u00F8]/A\u00C5\x07\u00F1\u0086\u00AAX\u00BA\u00FF$9\u00E7\u00EDhB\u00D2\u00B0\u00D8\u0085\x1E\u0095\u008C=\x1C\u00A0_\u00C6@Fn+\x11\u0099q\x7Fd)\u00F5oL\x10`G\u00EB\u00B0L-\x14J\u00AD\u008C\x05n\u00CF\u00F0u\u00EC\u00CF\u00B4O(\u00A4K\u00CB\u00C0\u00A6\u00EB\u00D0V\u00C5\u00B4\u00B3\x7F1>\u0090E,\x16#8N\u00D1\u00A4\u00AESx\u00CC\u00DE\u0091\u00E9p^\u008C\u00C5\u00C4v\x14{\u0086:\u0095^_\u0097\x18\u00C03K\u00DE\x1A\u00A6\x1Fw\u00A4\x18\u00CE\x15\x06\u00FDKS\u00935\u009FF\u009C`_/\u009Af\u00A3?,)\u009E=@\u0081/D,\x16\u00E5F\u00BB\u0087\u00F3U!\u00E6\u00E7\x1F\u00AF\u00CC\n\u00A7\u00EF\u00ED\u00EFrlcP\x04\u00B8\u00F7\u0085\u0098\u00FA\u00E1\u00F9\u00C4\x00\ng\u00E6\x0FO\u00A7\u0098\u0096u!{\\\u00AE^PXH}\u00FDe***\x10B0\u00C9\u00EBc\u00FD\u00BA\u009B\x14\x16\u009D\x04\u00A0\u00E2\u00D8+\u00C8\u0080\u0081/{\x17\u009D\u00CD\x06\u00B1\u0080m\x16p\u00EE\u00C1x/oK\f 77\u00F7\u00A1\x01J\u008D6\f\u00A3>--\u00CDSPP\u0080\u00C7\u00E3\u00A1\u00BA\u00BA\u009A\u00DA\u00DAZ&M\u00F2\u00F1\u00C5\u00E7\u009D\x14\x15\u009F\u00A4\u00F5Z\x01\u00BBv\u00CDc\u0089\u00EF0\u00E1\u00F6k\ftZ\u00DD\u00B1\u00A06\rA\u00C7P\u00AF\x19k\x1A\x12\x03\u00B0,k8\x00\u00BA\u00AE\u00EFv\u00BB\u00DD/\u00BB\u00DDn\u008A\u008B\u008B1M\u0093\u00E6\u00E6f\x06\x06\x04\u00CB\u0096\u00F60*UQyf*\u00CFO?\u008B\x19\u00A8!\u00D0n\x11\u00EE\u00B2\x1F\u008EG\u00E4\u0082!\u00FB\x01\n\u00BF\u00BC\u0094\x18\u0080\u0094r\u00E4V\u0089eY'<\x1E\u008F\u00EEv\u00BB\u00C9\u00CF\u00CF\u00C7\u00EB\u00F5\u00C6\u00F7\u00FEz \u00E4\u00B0\x07\x07?^\u00F5\u00A4\u0099gTJ\u00D5\u00D9\u00CA\u00DDv\u008B\u00F0-{|0h\u009B\x03\x1C\x1B\u00DE\u00A4hs]b\x00B\b\x1E\x11\u00CB-\u00CB\u00FA\u00DE\u00E3\u00F1$\u00A7\u00A7\u00A7\u0093\u0097\u0097\x178u\u00FA\u00DC!\u00DF\u0094+\u00B1\u009F7\u00B8\x16t\\\u00B5\u00A7\u00F6\u00DF4\x19\u00B8e\u008F\x0E\x06m\u00AB\x10l\x1D\u00D9\u00A0h\u00D3\u00FF\x03@J\u0099gY\u00D6\u00EA\u008C\u008C\u008C\u00A7\u00B2\u00B2\u00C6ZM\u00FE\u008E\u0085\u00AF>\u00ED\x0F\x7F\u00B08\u00ED\u00D0-\u00BF=\x12\u00EE\u00B2W\u00C5\u00FAl\u00DF\x00\u008D\u008F\u00AA\x7F\x14\u00C0\u00DF\x03\x00\u0083<\x0E\u00FBs\x11\u00C9%\x00\x00\x00\x00IEND\u00AEB`\u0082";
        myWelcomeInfo = makeImageButton(myInfo, true, 4, wbtn, infoMes);
        var myCancelButon = wbtn.add("button", myButtonSize, "Not now", { name: "cancel" });
        win.add("statictext", undefined, "DoQuotesOK | © Mikhail Ivanyushin, 2014-2018 | adobeindesign.ru");
        ////
        function infoMes() { // myWelcomeInfo.onClick
            //alert("The program is designed to organize the types of quotes in the text.\nAs all custom scripts, preserving their settings, this script should be placed in the User folder.\nThe program supports up to three levels of enclosing quotes and you need to select the desired option for used levels.\nScript processed all story if cursor in text or selected part of it.\nThere are several check boxes to set condition of text processing. Each such box has own tooltip.\n\nIn 11th text line of this script, string ‘myRightChars’, there are all used text characters.\nIf you found some missed one you may very easy to add it. \nThis line is here to see what text characters are token into account:\nvar myRightChars= \"йцукеёнгшщзхъфывапролджэячсмитьбюЙЦУКЕЁНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮ\nЄєЇїўЎЂђЃѓЉљЊњЋћЌќЏџҐґә\nqwertyuiopasdfghjklzxcvbnmüäößQWERTYUIOPASDFGHJKLZXCVBNMÜÄÖ\n~@#$%‰^&_¡¿\";\nYou don’t find in this line such characters as asterisk, minus, plus, ellipsis, all kinds of brackets, defis, en-dash, em-dash etc.\nAll its taken into account in code of the program.\nDigits are collected in another line.\nIf script can’t recognize kind of quote open or close, it say about it. \nSuch situation may be when missed space before/after quote, as result the words and the quote stuck together: word\"word.\nThere are a few more situations caused by errors in the mutual placement of words and quotes. \nIn each of these cases an explanatory message will be displayed.\nAfter fixing the error you may continue handling text or run processing from scratch.\nCurrent settings are remembered to be active in next run.\n\nThe project was started in 2014 and still alive thanks to donations.\nIf you may support it — my Paypal account: m.ivanyushin@gmail.com\n\nQuestions, ideas? Write me:  m.ivanyushin@gmail.com\nMikhail Ivanyushin", myRightProgramTitul);
        } // myWelcomeInfo.onClick 
        ////
        myOKButon.onClick = function () { // myOKButon.onClick    
            myQ0 = myDropdown1.selection.index;
            myQ1 = myDropdown2.selection.index;
            myQ2 = myDropdown3.selection.index;
            myQ3 = myDropdown4.selection.index;

            myOpenQuote1Level = myQuotesList[myQ0][0];
            myCloseQuote1Level = myQuotesList[myQ0][7];
            myOpenQuote2Level = myQuotesList[myQ1][0];
            myCloseQuote2Level = myQuotesList[myQ1][7];
            myOpenQuote3Level = myQuotesList[myQ2][0];
            myCloseQuote3Level = myQuotesList[myQ2][7];
            myOpenQuote4Level = myQuotesList[myQ3][0];
            myCloseQuote4Level = myQuotesList[myQ3][7];
            exit();
        } // myOKButon.onClick  
        ////
        myLitQuotes.onClick = function () { // myLitQuotes.onClick 
            if (myLitQuotes.value != false) {
                myLitQuotes.value = true;
                myLitQuotes_value = 1;
            }
            else {
                myLitQuotes.value = false;
                myLitQuotes_value = 0;
            }
        } // myLitQuotes.onClick 
        ////
        myPrTbl.onClick = function () { // myPrTbl.onClick 
            if (myPrTbl.value != false) {
                myPrTbl.value = true;
                myPrTbl_value = 1;
            }
            else {
                myPrTbl.value = false;
                myPrTbl_value = 0;
            }
        } // myPrTbl.onClick 
        ////
        myCancelButon.onClick = function () { // myCancelButon.onClick  
            exit();
        } // myCancelButon.onClick    
        /////////
        return win;
    } // mySelectParametersDialog
    ///////
    function myFile(myFileName) { // myFileName
        var myScriptFile = myGetScriptPath();
        var myScriptFolder = decodeURI(myScriptFile.path);
        var myFilePath = decodeURI(myScriptFolder + "/" + myFileName);
        return myFilePath;
    } // myFileName
    //
    function myGetScriptPath() { // myGetScriptPath
        try {
            return app.activeScript;
        }
        catch (myError) {
            return File(myError.fileName);
        }
    } // myGetScriptPath
    function myLocTextProc(myLocStory, myLocProgramTitul, myPointer) { // myLocTextProc
        ///////////////////////////////////   
        StoryHasQuotes = false;
        var myP = myPointer;
        if (myStopProcessing == 0) { // myStopProcessing == 0
            myOpenQuoteNumber = 0; // число встреченных открывающих кавычек
            myCloseQuoteNumber = 0; // число встреченных закрывающих кавычек
            myCurrQuotesLevel = 0;
            myLevelMax = 0;
            myCloseQuoteIndex = -1;
        } // myStopProcessing == 0

        if (myLetterAndQuoteChars(myLocStory, myPointer) != 0) { // myLetterAndQuoteChars() != 0	
            myProcFork1 = confirm("The text contains words ending with the letters 's' or 'n' followed by a quotation mark. In place of this quote can be both an apostrophe and a single closing quote, but the problem is that it is impossible to automatically determine — what kind of character should be here. Known examples that require attention — 'Monkeys' Business',' Guns N' Roses', perhaps in this text there are the same cases. At the time of the script processing quotes apostrophes must be replaced by some character, then to return them to the text. Press 'Yes' if you want to continue, or 'No' if you want to work with the text. Letters painted the color 'MistakeInQuoteUsage'.", "", "Problem with English text");
            if (myProcFork1 == false) { //  Останов работы программы
                myStory.characters[myMathMinIndex + 2].remove();
                myStory.characters[myMathMaxIndex].remove();
                exit();
            } //  Останов работы программы
        } // myLetterAndQuoteChars() != 0

        //В начале работы скрипта выполняется grep-замена: <многоточие><кавычка><буква>  на  <многоточие><ВолосянаяШпация><кавычка><буква>  #  Вместо этой замены перенес ситуацию EL в события открыващей кавычки
        //~ app.findGrepPreferences = NothingEnum.nothing;
        //~ app.changeGrepPreferences = NothingEnum.nothing;
        //~ app.findChangeGrepOptions.includeFootnotes = false;
        //~ app.findGrepPreferences.findWhat = "(…)([„|“|«|»|”|‚|‘|’|\'|\"])([\\u|\\l])";
        //~ app.changeGrepPreferences.changeTo = "$1" + "~|" + "$2" + "$3"; 
        //~ myLocStory.changeGrep();

        // сохранены выбранные пользователем варианты кавычек 
        myCurrOpenQuote.push(myOpenQuote1Level);
        myCurrOpenQuote.push(myOpenQuote2Level);
        myCurrOpenQuote.push(myOpenQuote3Level);
        myCurrOpenQuote.push(myOpenQuote4Level);
        myCurrCloseQuote.push(myCloseQuote1Level);
        myCurrCloseQuote.push(myCloseQuote2Level);
        myCurrCloseQuote.push(myCloseQuote3Level);
        myCurrCloseQuote.push(myCloseQuote4Level);
        var myStartOfLocFragment = myLocStory.insertionPoints[0].index;
        var myEndOfLocFragment = myLocStory.insertionPoints[-1].index;
        /////////
        while (myAllQuotes.length > 0) myAllQuotes.shift();
        app.findGrepPreferences = NothingEnum.nothing;
        app.changeGrepPreferences = NothingEnum.nothing;
        app.findChangeGrepOptions.includeFootnotes = false;
        app.findGrepPreferences.findWhat = "[\\r\\n\'\"]";
        //app.findGrepPreferences.findWhat = "[\\r|\\n|\\'|\"]";
        myFound = myLocStory.findGrep();  //собрана коллекция кавычек и переводов строки в статье
        if (myFound.length != 0) { // myFound.length != 0
            // цикл по числу элементов коллекции
            var myWin1 = new Window("palette", "Gathering information about quotes");
            myWin1.orientation = "row";
            myWin1.add("statictext", undefined, "Processed characters:");
            var myText1 = myWin1.add("edittext", undefined, "0");
            myText1.characters = 5;
            myWin1.add("statictext", undefined, "Total characters:" + String(myFound.length));
            //myWin1.show();
            for (j = 0; j < myFound.length; j++) { // j < myFound.length
                myLine = myFound[j];
                if (myPointer == "s") if (myLine.parent.constructor.name != "Story") continue; // учитываем только знаки в статье, в сносках и таблицах пропускаем
                myIndex = myLine.index;
                myText1.text = j;
                var myLineCont = myLine.contents;
                if (myIndex < myStartOfLocFragment) continue;
                if (myIndex > myEndOfLocFragment) break;
                myAllQuotes.push(myIndex);
                //if (StoryHasQuotes == false)  if (myLineCont == "«" || myLineCont =="»" || myLineCont == "\"" || myLineCont == "\'" || myLineCont == "„" || myLineCont == "“" || myLineCont == "’" || myLineCont == "‘" || myLineCont == "‚" || myLineCont == "”") StoryHasQuotes = true;  // („|“|«|»|”|‚|‘|’|\'|\")
                if (StoryHasQuotes == false) if (myLineCont == SDLq || myLineCont == SDRq || myLineCont == SDSq || myLineCont == SSLq || myLineCont == SSRq || myLineCont == SSSq || myLineCont == "«" || myLineCont == "»" || myLineCont == "\"" || myLineCont == "\'" || myLineCont == "„" || myLineCont == "“" || myLineCont == "’" || myLineCont == "‘" || myLineCont == "‚" || myLineCont == "”" || myLineCont == "›" || myLineCont == "‹") StoryHasQuotes = true;
                //if (StoryHasQuotes == false)  if (myLineCont == SDLq || myLineCont == SDRq || myLineCont == SDSq || myLineCont == SSLq || myLineCont == SSRq || myLineCont == SSSq) StoryHasQuotes = true; 
            }  // j < myFound.length
            myWin1.close();
        } // myFound.length != 0
        if (myPointer == "s") myAllQuotesLength = myAllQuotes.length;
        if (StoryHasQuotes == false) return 0;
        var pBar = new ProgressBar(myLocProgramTitul);
        //-1- Узнаем время начала работы скрипта
        var myDate = new Date;
        myHour = myDate.getHours();
        myMinutes = myDate.getMinutes();
        mySecondes = myDate.getSeconds();
        //-1-
        if (myHour < 10) myTwoDigitHour = "0" + myHour else myTwoDigitHour = myHour;
        if (myMinutes < 10) myTwoDigitMinutes = "0" + myMinutes else myTwoDigitMinutes = myMinutes;
        var myInfoProgressLine = " Start time: " + myTwoDigitHour + ":" + myTwoDigitMinutes;
        pBar.reset(myInfoProgressLine, myAllQuotes.length);

        // handling an array of ordered quotes
        /*
        4.2.15 -- decided in the array myAllQuotes to collect not only the indices of all the quotes, but also the indices of all line breaks.
        When you search another quotes, if you meet the sign of the line will set the pointer myNewAbzatc = true. 
        When you read the next quotation mark, if it opens, its index will be stored in a variable myOpenQuoteIndex, if the closing-in myCloseQuoteIndex.
        In addition, after processing each opening quotation mark will be to set the check box myQuoteLineIsOpen, and after processing any closing quotation marks, this check box will reset.
        If you check "First the opening quotation mark of a paragraph is always the main quote, and dropped the box myQuoteLineIsOpen, discovery another opening quotation marks tests and levels level basic quotes. 
        If Yes, then the only thing to be done is reset the box myNewAbzatc to false and the checkbox myQuoteLineIsOpen.
        If the level of quotation marks does not match the level of the main quotes, it will reset variables 
        myCurrQuotesLevel
        myLevelMax
        that is, the state is reduced to such that occurs when the script is run. In addition, the quote posted at myCloseQuoteIndex, shall the closing quotation mark of the main text. 
        Actually, for the sake of the idea to close each paragraph with a quotation mark of the main figure 
        (if there is a closing quotation mark) and the beginning of the quotation in the next paragraph from the level of the main quotation marks and caused all this new idea 
        to include in the array of myAllQuotes also the indexes of line translations.
        */

        var EstimatePoint = (myAllQuotes.length / 8).toFixed(0);
        for (var jj = 0; jj < myAllQuotes.length; jj++ , pBar.hit()) { //  jj < myAllQuotes.length 
            if (jj == EstimatePoint) { // jj     
                var myDateT = new Date;
                var TmpValue = myDateT.getTime();
                var TmpMs = TmpValue - myValue; // промежyточное время [мс]
                var SecRest = (8 * TmpMs) / 1000; // предполагаемое время [c]     
                var HrRest = (SecRest / 3600).toFixed(0);
                var MnRest = Math.abs(((SecRest - 3600 * HrRest) / 60).toFixed(0));
                MnRest++; // просто так :) типа округлим чуть вперед
                var MnEst = Number(MnRest) + Number(myMinutes);
                if (MnEst >= 60) { // MnEst >= 60
                    MnEst -= 60;
                    HrRest++;
                } // MnEst >= 60
                var HrEst = Number(myHour) + Number(HrRest);
                if (HrEst >= 24) HrEst -= 24;
                var HrEstS = "";
                var MnEstS = "";
                if (HrEst < 10) HrEstS = "0" + HrEst else HrEstS = HrEst;
                if (MnEst < 10) MnEstS = "0" + MnEst else MnEstS = MnEst;

                var TimeForJob = "";
                if (myPointer == "s") TimeForJob = " # Expected end time: " + HrEstS + ":" + MnEstS + ".";
                pBar.info(myInfoProgressLine + TimeForJob);
            } // jj == 1000
            myCurIndex = myGetQuIndex(myLocStory, myAllQuotes[jj], myPointer); // индекс очередной кавычки в тексте   
            if (myCurIndex == -1) continue; // Значение -1 возвращается функцией myGetQuIndex, если [jj] указывает в массиве myAllQuotes на знак перевода строки
            if (myCurIndex < myStartOfLocFragment) continue; // обработка начнется только когда индекс очередной кавычки окажется больше индекса начала выделенного фрагмента
            if (myCurIndex > myEndOfLocFragment) break; // обработка прекратится как только индекс очередной кавычки окажется больше индекса конца выделенного фрагмента
            var myLocCurIndex = myCurIndex - myStartOfLocFragment;
            myRealCurrChar = myLocStory.characters[myLocCurIndex].contents;
            myRealPrevChar = getRealPrevChar(myLocStory, myLocCurIndex - 1);
            myRealNextChar = getRealNextChar(myLocStory, myLocCurIndex + 1);
            // для каждой кавычки выполняем нормализацию соседних знаков — считываем их и определяем, к какой из групп каждый их них относится.
            if ((jj > 0) && myGetQuIndex(myLocStory, myAllQuotes[jj - 1], myPointer) + 1 == myGetQuIndex(myLocStory, myAllQuotes[jj], myPointer)) myPrevChar = "Q"; // если индекс предыдущей кавычки меньше индекса текущей на единицу, значит, первый символ -- тоже кавычка (Q)
            else
                myPrevChar = myCharTest(myRealPrevChar, myLocStory, myLocCurIndex); // варианты возвращенного символа: S, L, P, B и F
            if (myPrevChar == null) return 1;
            if (jj < myAllQuotes.length - 1 && (myGetQuIndex(myLocStory, myAllQuotes[jj + 1], myPointer) - 1) == myGetQuIndex(myLocStory, myAllQuotes[jj], myPointer)) myNextChar = "Q"; // если индекс следующей кавычки больше индекса текущей на единицу, значит, третий символ -- тоже кавычка
            else
                myNextChar = myCharTest(myRealNextChar, myLocStory, myLocCurIndex); // варианты возвращенного символа: S, L, P, B и F
            if (myNextChar == null) return 1;
            myMask = myPrevChar + myNextChar; // подготовлена маска нормализации символов, окружающих кавычку. 
            // На основе анализа маски будет принято решение, какая это кавычка — открывающая, закрывающая или кавычка поставлена с нарушением правил грамматики.
            if ((myMask == "LL") && (myApostrofIsQuote_value == false)) continue; // когда этот флажок сброшен, при обнаружении кавычки, окруженной буквами, считаем, что это апостроф, и не рассматриваем этот знак как кавычку
            if (myMask == "QQ") { // myMask == "QQ"
                // три кавычки подряд — особый случай. Чтобы понять, текущая кавычка — открывающая или закрывающая — 
                // надо проанализировать буквы, отстоящие от этой кавычки на две позиии символа вперед и назад.
                if ((jj > 1) && myGetQuIndex(myLocStory, myAllQuotes[jj - 2], myPointer) + 2 == myGetQuIndex(myLocStory, myAllQuotes[jj], myPointer)) myPrevChar = "Q"; // если индекс второй кавычки перед текущей меньше индекса текущей на два, 
                //значит, символ, отстоящий на две позиции до текущей кавычки -- тоже кавычка
                else {
                    myRealPrevChar = getRealPrevChar(myLocStory, myLocCurIndex - 2);
                    myPrevChar = myCharTest(myRealPrevChar, myLocStory, myLocCurIndex); // варианты возвращенного символа: S, L, P, B  и F
                }
                if (myPrevChar == null) return 1;
                if (myGetQuIndex(myLocStory, myAllQuotes[jj + 2], myPointer) - 2 == myGetQuIndex(myLocStory, myAllQuotes[jj], myPointer)) myNextChar = "Q"; // если индекс второй кавычки после текущей больше индекса текущей на два, 
                // значит, символ, отстоящий на две позиции после текущей кавычки -- тоже кавычка
                else {
                    myRealNextChar = getRealNextChar(myLocStory, myLocCurIndex + 2);
                    myNextChar = myCharTest(myRealNextChar, myLocStory, myLocCurIndex);  // варианты возвращенного символа: S, L, P, B и F
                }
                if (myNextChar == null) return 1;
                mySubmask = myPrevChar + myNextChar; // подготовлена маска нормализации символов, окружающих три идущие подряд кавычки
                if (mySubmask == "QQ") { // mySubmask == "QQ"
                    // в тексте пять подряд идущих кавычек. Ну это явно перебор!
                    myLocStory.characters[myLocCurIndex].fillColor = "MistakeInQuoteUsage";
                    myStopProcessing = 0;
                    if (parseInt(app.version) == 6) var myP1 = myLocStory.characters[myLocCurIndex].parentTextFrames[0].parent.name;
                    else var myP1 = myLocStory.characters[myLocCurIndex].parentTextFrames[0].parentPage.name;
                    myInfoLineAboutError = "On page " + myP1 + " more than four consecutive quotes were found. Work on the definition of the type of enclosed quotes in this exotic text should be entrusted to the author. :) ";
                    return 1;
                } // mySubmask == "QQ"
                if (myMakeDecisionAboutQuote(mySubmask, myLocStory, myLocCurIndex) == 1) return 1;  /// <<<
                continue;
            } // myMask == "QQ"
            else { //-* 
                if (myMakeDecisionAboutQuote(myMask, myLocStory, myLocCurIndex) == 1) return 1; /// <<<
                continue;
            } //-*
        }  //  jj < myAllQuotes.length
        if (myLitQuotes_value == 1 && myQuoteLineIsOpen == false && myCloseQuoteIndex != -1) myLocStory.characters[myCloseQuoteIndex].contents = myCurrCloseQuote[0];
        myLevelMax--;
        myLocStory.recompose();
        if (myOpenQuoteNumber != myCloseQuoteNumber) { // myOpenQuoteNumber != myCloseQuoteNumber
            for (i = 0; i < myOpenContinuousQuotes.length; i++) {
                myLocStory.characters[myOpenContinuousQuotes[i]].fillColor = "MistakeInQuoteUsage";
            }
            myOddQuotes = true;
        }  // myOpenQuoteNumber != myCloseQuoteNumber
        while (myOpenContinuousQuotes.length > 0) myOpenContinuousQuotes.shift();
        return 0;
    } // myLocTextProc
    //////////////////
    function myGetQuIndex(myTmpStory, myInd, myPtr) {  // myGetQuIndex
        var myS;
        if (myPtr == "s") myS = myTmpStory.parent else myS = myTmpStory;
        try {
            var myChQ = myS.characters[myInd].contents;
        }
        catch (e) {
            return -1;
        }
        if (mySet4Estimate(myChQ) == true) { // == \r || == \n
            myNewAbzatc = true;
            return -1;
        } // == \r || == \n
        return myInd;
    } // myGetQuIndex
    /////////////////
    function mySetColor() { // mySetColor
        try { myDocument.colors.item("MistakeInQuoteUsage").remove(); } catch (e) { };
        try { myDocument.colors.item("ThisIsNewChar").remove(); } catch (e) { };
        try { myDocument.colors.item("OpenOrCloseQuote").remove(); } catch (e) { };
        try { //try
            myColor = myDocument.colors.item("MistakeInQuoteUsage");
            myName = myColor.name;
        }  //try
        catch (myError) { //catch
            myColor = myDocument.colors.add({ name: "MistakeInQuoteUsage", model: ColorModel.process, space: ColorSpace.RGB, colorValue: MistakeInQuoteUsageColorSample });
        } //catch
    }  // mySetColor
    ////
} // myTextProcessingAction
//////
function mySelTablePros(myCurTable, myStory, myLocTextProc, myProcFinish) { // mySelTablePros
    for (var ll = 0; ll < myCurTable.cells.length; ll++) { // ll++ // цикл по ячейкам текущей таблицы
        var myCellText = myCurTable.cells[ll].texts[0];
        if (myCellText.length == 0) continue;
        myCellText.insertionPoints[-1].contents = " ";
        myCellText.insertionPoints[0].contents = " ";
        myStory.recompose();
        myCellText.characters.itemByRange(0, -1).select();
        var myTmpCell = app.selection[0];
        myInfoLineAboutError = "";
        myPr = "t";
        myRezT = myLocTextProc(myTmpCell, "Proccessing of tables", myPr);
        myCellText.characters[-1].remove();
        myCellText.characters[0].remove();
        myStory.recompose();
        if (myRezT == 1) { // myRezF == 1
            myStopProcessing = 1;
            var curT = ll;
            curT++;
            myCurTable.select();
            myProcFinish("Table processing:\n" + myInfoLineAboutError);
        }  // myRezF == 1              
    } // ll++
} // mySelTablePros    
/////
function myTableForProc(mySelection) { // 
    if (mySelection.constructor.name == "Table") return (mySelection);
    if (mySelection.parent.constructor.name == "Table") return (mySelection.parent);
    if (mySelection.parent.parent.constructor.name == "Table") return (mySelection.parent.parent);
    return -1;
} //myTableForProc
/////
function getRealPrevChar(myLocStory, myTmpInd) { // getRealPrevChar
    var Ind = myTmpInd;
    var Ch = "";
    do {
        Ch = myLocStory.characters[Ind].contents;
        Ind--;
    }
    while (myTestCurrChar(Ch) == 0);
    return Ch;
} // getRealPrevChar
////
function getRealNextChar(myLocStory, myTmpInd) { // getRealNextChar
    var Ind = myTmpInd;
    var Ch = "";
    do {
        Ch = myLocStory.characters[Ind].contents;
        Ind++;
    }
    while (myTestCurrChar(Ch) == 0);
    return Ch;
} // getRealNextChar 
////
function myTestCurrChar(Char) { // myTestCurrChar
    var arrLength = myMissedSpecChar.length;
    if (arrLength == 0) return 1; // =1 - символ не найден
    for (var a = 0; a < arrLength; a++) { // a++
        if (myMissedSpecChar[a] == Char) return 0;
    } // a++
    return 1;
} // myTestCurrChar
/////
function ResetParameters() { // ResetParameters
    myStopProcessing = 0;
    myOpenQuoteNumber = 0; // число встреченных открывающих кавычек
    myCloseQuoteNumber = 0; // число встреченных закрывающих кавычек
    myCurrQuotesLevel = 0;
    myLevelMax = 0;
} // ResetParameters
///////////////////////////////////////
function mySaveProcQuoteParameters(myStory) { // mySaveProcQuoteParameters()
    var mySetIniFile = new File(myIniPath);
    mySetIniFile.open("w");
    mySetIniFile.writeln(InCopyIsUsedInWorkflow_value);
    mySetIniFile.writeln(myApostrofIsQuote_value);
    mySetIniFile.writeln(ShowHelp_value);
    /////////////
    mySetIniFile.writeln(myQ0);
    mySetIniFile.writeln(myQ1);
    mySetIniFile.writeln(myQ2);
    mySetIniFile.writeln(myQ3);
    mySetIniFile.writeln(myLitQuotes_value);
    mySetIniFile.writeln(myPrTbl_value);
    mySetIniFile.writeln(myStopProcessing);
    myStartOfFragment--;
    mySetIniFile.writeln(myStartOfFragment);
    myEndOfFragment = myStory.characters.lastItem().index - myEndOfFragment;
    mySetIniFile.writeln(myEndOfFragment);
    mySetIniFile.writeln(myCurrQuotesLevel);
    mySetIniFile.writeln(myLevelMax);
    mySetIniFile.writeln(myOpenQuoteNumber);
    mySetIniFile.writeln(myCloseQuoteNumber);
    mySetIniFile.writeln(myOpenQuote1Level);
    mySetIniFile.writeln(myCloseQuote1Level);
    mySetIniFile.writeln(myOpenQuote2Level);
    mySetIniFile.writeln(myCloseQuote2Level);
    mySetIniFile.writeln(myOpenQuote3Level);
    mySetIniFile.writeln(myCloseQuote3Level);
    mySetIniFile.writeln(myOpenQuote4Level);
    mySetIniFile.writeln(myCloseQuote4Level);
    ////////////////
    myNewAbzatc == true ? mySetIniFile.writeln(1) : mySetIniFile.writeln(0);
    mySetIniFile.writeln(myOpenQuoteIndex);
    mySetIniFile.writeln(myCloseQuoteIndex);
    myQuoteLineIsOpen == true ? mySetIniFile.writeln(1) : mySetIniFile.writeln(0);
    mySetIniFile.writeln(app.documents[0].name);
    mySetIniFile.close();
    return;
} // mySaveProcQuoteParameters()
/////
//////////
// Поначалу была просто нерешаемая проблема, как добиться, чтобы в СС2015 бабочка и другие рисунки на кнопках были по центру, как это есть в версиях вплоть до СС2015.
// идея найдена тут: http://www.indiscripts.com/post/2011/04/sprite-buttons-in-scriptui
////
/// Функция makeImageButton - сделана на базе этого скрипта Марка Аутрета.
// imageButton = makeImageButton (myPngButton, buttonBorder, buttonInset, winLink, imageButtonAction)
// myPngButton -- имя файла с видом кнопки,
// buttonBorder - если true, вокруг рисунка нужна рамка
// borderInset -- величина отступа вокруг картинки кнопки (отступ будет добавлен, даже если buttonBorder = false)
// winLink -- объект в описании окна, с которым будет связана эта кнопка
// imageButtonAction -- название функции, которая будет выполнена при щелчке на кнопке.
//=-
// imageButton -- процедура возвращает ссылку на созданную кнопку
///
function makeImageButton(myPngButton, buttonBorder, buttonInset, winLink, imageButtonAction) { // makeImageButton
    ///
    // InDesign CC Flag
    const CC_FLAG = +(9 <= parseFloat(app.version));
    ///
    // ScriptUI Image Offset Fixer in InDesign CS6 and earlier
    // (This bug has been solved in CC i.e. ScriptUI 6.2.x)
    const FIX_OFFSET = CC_FLAG ? 0 : 1;
    ///
    // Force an Image widget to repaint (= onDraw trigger)
    // CS4-CS6  ->  just reassigning this.size
    // CC             ->  we need to temporarily *change* the size
    // Note: using layout.layout(1) would not work anymore in CC
    // ---
    // Create the UI
    if (buttonBorder) var winImageButton = winLink.add("panel");
    else var winImageButton = winLink.add("group");
    imageButton = winImageButton.add('image', undefined, myPngButton);
    imageSize = imageButton.image.size;
    Image.prototype.refresh = CC_FLAG ?
        function () {
            var wh = this.size;
            this.size = [1 + wh[0], 1 + wh[1]];
            this.size = [wh[0], wh[1]];
            wh = null;
        } :
        function () { this.size = [this.size[0], this.size[1]]; };
    // Window settings
    try { winImageButton.margins = buttonInset; } catch (e) { }
    winImageButton.alignChildren = ['center', 'center'];
    imageButton.size = [imageSize[0], imageSize[1]];
    imageButton.onDraw = function () {
        var dy = 0 + FIX_OFFSET;
        this.graphics.drawImage(this.image, 0, -dy);
        // winLink.graphics.backgroundColor = winLink.graphics.newBrush(0, [.92,.94,.96,1]);
    };
    var mouseEventHandler = function (ev) { // mouseEventHandler
        if (ev.type == 'mouseover') winImageButton.graphics.backgroundColor = winImageButton.graphics.newBrush(0, defSelColor);
        //else winImageButton.graphics.backgroundColor = winImageButton.graphics.newBrush(0, [.92,.94,.96,1]); 
        else winImageButton.graphics.backgroundColor = winImageButton.graphics.newBrush(0, defBgColor);
        //else winImageButton.graphics.backgroundColor = defBgColor;      
        this.refresh();
    } // mouseEventHandler
    ///
    imageButton.addEventListener('mouseover', mouseEventHandler);
    imageButton.addEventListener('mousedown', mouseEventHandler);
    imageButton.addEventListener('mouseup', mouseEventHandler);
    imageButton.addEventListener('mouseout', mouseEventHandler);
    // Let's go!
    imageButton.addEventListener('click', function () { imageButtonAction() });
    ///
    return imageButton;
} // makeImageButton
///

// 