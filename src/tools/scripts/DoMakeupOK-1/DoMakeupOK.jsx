// DoMakeupOK
//  
// Информация от 2016 года, как работать с этой программой, размещена на сайте adobeindesign.ru:  http://adobeindesign.ru/
// На youtube.com есть подборка видео по всем вопросам работы с этой программой
// © Михаил Иванюшин, 2011-2017  ivanyushin#yandex.ru  m.ivanyushin#gmail.com
//

//#target indesign
#targetengine "domakeupok"

var timesProcessed = 0;
myMinValueRight = 4 //  расстояние между последним знаком абзаца и правым краем полосы, мм. Если последний знак абзаца в этой области, абзац надо выключить на формат
myMinValueLeft = 10  //  длина текста в последней строке абзаца, на эти строки надо обратить внимание. Часто там оказывются сокращения "и т.п" или "и т.д." и прочие, которые обычно легко втягиваются в прыдыдущую строку
// оба этих параметра должны быть числами. Если содержимое этих переменных не будет числом, программа установит их значения по умолчанию myMinValueRight = 3 и myMinValueLeft = 20.
// Пользователь может ввести нулевое значение для любого из параметров. И когда значение параметра равно нулю, эта проверка не выполняется.
var ButtonSize = 189; // ширина кнопок 
var buttonInsets = 4; // это своего рода формфактор кнопок меню демонстрации результатов поиска. 
// Хочется, чтобы они были квадратной формы.На машине с экраном 1366х768 эти кнопки квадратные, когда данное значение равно 4.
var HelpMessage_value = false; // false - всплывающие подсказки кнопок появляются, true -- этих подсказок нет.



////>>>> темный экран / светлый экран >>>>>
// defSelColor: цвет фона кнопки, когда в её пространстве окажется курсор. Первые три числа: RGB, 0 - мин, 1 - макс.
// defBgColor:  цвет, который приобретёт фон кнопки, когда курсор покинет её пространство.
try {
    var uiBr = app.generalPreferences.uiBrightnessPreference;
}
catch (e) {  // до СС темного варианта интерфейса не было
    uiBr = 0.6;
}
if (uiBr == 1 || uiBr > 0.67) {
    defBgColor = [.85, .85, .85, 1]; defSelColor = [.15, .15, .15, 1];
}
else if (uiBr == 0.67 || uiBr > 0.33) {
    defBgColor = [.7, .7, .7, 1]; defSelColor = [.3, .3, .3, 1];
}
else if (uiBr == 0.33 || uiBr > 0) {
    defBgColor = [.34, .34, .34, 1]; defSelColor = [.66, .66, .66, 1];
}
else {
    /* if (uiBr == 0) */ defBgColor = [.2, .2, .2, 1]; defSelColor = [.8, .8, .8, 1];
}
////>>>> темный экран / светлый экран >>>>>


//////
var Text1 = "В процессе работы с текстом может появиться множество мелких огрехов, которые верстальщику сложно выловить уставшим от работы взглядом, но если они пролезут в тираж, то будут серьёзными ошибками. Этот скрипт помогает найти многие ошибки вёрстки. Предполагается, что первоначально текст был обработан скриптом DoTextOK, что гарантирует, что в нём нет вообще уж детских ошибок, таких как повторяющиеся пробелы, дефисы вместо тире, неправильные сокращения «2-ых, 5-ым», и пр.\nТребующие внимания строки на время работы скрипта окрашиваются красным цветом. После завершения работы скрипта этот именованный цвет будет удалён, и текст перекрасится в чёрный цвет. Если ищутся висячие строки, абзацы с короткой последней строкой, то предполагается, что пользователь примет решение по избавлению от таких строк; а окрашивание последних строк абзацев с почти полными строками — это визуальное информирование, какие абзацы были выключены на полный формат. \nПереход по страницам выполняется при помощи стрелок вверх и вниз. Перемещение по списку закольцовано: при достижении начала или конца списка в окне отображения информации о текущей странице трижды мигнут строки '<<#>>' и '######', а затем отобразится конец или начало списка. При работе с висячими строками целесообразно идти по тексту от начала к концу. В других случаях, например, при обработке абзацев с короткой последней строкой лучше идти от конца к началу: если короткое слово будет втянуто, это не повлияет на перетекание предыдущих строк.\nОкно просмотра можно перемещать, и его размещение на экране, в котором была нажата кнопка завершения работы, будет запомнено. При очередном просмотре окно откроется на этом месте.\n\nПодробное описание каждой процедуры приведено в PDF-файле описания программы. Краткие описания проверок есть в справочных окнах, появляющихся в процессе работы программы.\n\n";
////////////
myCurrentVersionData_xx_xx_xx = "05.03.2019";
var ScriptName = " Приведение вёрстки в порядок ";
//var UseColor_value = true; // true - если решено на время работы скрипта отмечать цветом требующие внимания ситуации. Они будут отмечаться цветом MakeupColor
//var HelpMessage_value = false; // false - всплывающие подсказки кнопок появляются, true -- этих подсказок нет.
//  шаблон цвета для MakeupColor
var myStyleIndex = 0;
var usedStyleName;
MakeupColorSample = [0, 100, 100, 0];
var GlyphFontsAsAr = {}; // ассоциативный массив с названиями шрифтов с нулевыми глифами
var GlyphFonts = []; // обычный массив шрифтов с нулевыми глифами. Его constructor.name = Font
var GlyphFontsNames = []; // обычный массив имен шрифтов с нулевыми глифами. Нужен для вывода в меню.
// Формируется во время поиска нулевых глифов. 
// Нужен для исключения их из общего списка шрифтов, чтобы для замены глифов в меню были только полные шрифты.
var ProblemFontsFound = false; // эта переменная равна false при запуске. При обнаружении проблемных шрифтов она устанавливается в true. 
// Есть проблема, что если пользователь, не выходя из скрипта, устранит проблему со шрифтами, то возможен повтор имен шрифтов с глифами.
// Чтобы избежать этого, при обнаружении, что проблемных шрифтов нет, будет проверяться и условие, что ProblemFontsFound == false.
// Это гарантирует, что работа скрипта не будет продолжена после обнаружения проблемных шрифтов и наведения порядка с ними, не останавливая работу этой программы.
var GlifColors = []; // тут будут запоминаться цвета обновлённых глифов. На время работы подпрограммы обновления найденные глифы будут окрашены красным цветом,
// но при завершении работы этой подпрограммы будет возвращён первоначальный цвет.
var myParaStyleNames = [];
app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll; // см. http://adobeindesign.ru/2008/10/24/restore-ui/
if (app.documents.length == 0) {
    alert("Нет открытых документов.", ScriptName);
    exit();
}
var myS = app.selection[0];
//var ButtonSize = [ 189,"2560, 189", "1600,189", "1680, 189","1920, 189", "1366,189", "1280,185" ]; // ширина кнопок 
var MainWinLocation = [-1, -1]; // положение на экране основного окна программы
var ActionWinLocation = [-1, -1]; // положение на экране окна перемещения по страницам
var GlphsAndFntsLocation = [-1, -1]; // положение на экране окна показа проблем с глифами и шрифтами
var SmallGlphsAndFntsLocation = [-1, -1]; // положение на экране служебного окна показа проблем с глифами и шрифтами

if (app.name != "Adobe InDesign") { alert("Этот скрипт должен запускаться в программе InDesign.", ScriptName); exit(); }
InCopyIsUsed = false;

var parseIntAppVersion = parseInt(app.version);
if (parseIntAppVersion < 6) { // app.version
    alert("Этот скрипт предназначен для работы с текстом в InDesign CS4+.", ScriptName);
    exit();
} // app.version
var mySelection = app.selection[0];
if (app.documents[0].stories.length == 0) {
    alert("В открытом документе нет статей.", ScriptName);
    exit();
}
var myFirstProcFileName = app.documents[0].name;
var myDefSetName = "#DoMakeupOK.ini"; // это файл установок программы
var myScriptFile = myGetScriptPath();
var myScriptFolder = decodeURI(myScriptFile.path);
var myFilePath = decodeURI(myScriptFolder + "/" + myDefSetName);
var myDataFile = new File(myFilePath);
var myDataFileExists = false;
getParaStyleList(myParaStyleNames);
if (myDataFile.open("r")) { // такой файл есть
    myDataFileExists = true;
    MainWinLocation[0] = myDataFile.readln();
    MainWinLocation[1] = myDataFile.readln();
    ActionWinLocation[0] = myDataFile.readln();
    ActionWinLocation[1] = myDataFile.readln();
    GlphsAndFntsLocation[0] = myDataFile.readln();
    GlphsAndFntsLocation[1] = myDataFile.readln();
    SmallGlphsAndFntsLocation[0] = myDataFile.readln();
    SmallGlphsAndFntsLocation[1] = myDataFile.readln();
    var hlp_value = myDataFile.readln();
    hlp_value == 1 ? HelpMessage_value = true : HelpMessage_value = false;
    myStyleIndex = myDataFile.readln();
    usedStyleName = myDataFile.readln();
    if (myParaStyleNames[myStyleIndex] != usedStyleName) myStyleIndex = 0;
    myDataFile.close();
}
tmpValue = Number(myMinValueRight);
if (isNaN(tmpValue) == true || myMinValueRight < 0) myMinValueRight = 3;
tmpValue = Number(myMinValueLeft);
if (isNaN(tmpValue) == true || myMinValueLeft < 0) myMinValueLeft = 10;

// идея прогресс-бара взята отсюда: http://forums.adobe.com/message/3152162#3152162
var ProgressBar = function (title) { // ProgressBar
    var w = new Window('palette', title, { x: 0, y: 0, width: 700, height: 100 }, { closeButton: true }),
        //var w = new Window('palette', title, {x:0, y:0, width:700, height:100},{closeButton: true}),     
        /* tl = w.add('statictext', {x:20, y:12, width:660, height:20}); */
        st = w.add('statictext', { x: 20, y: 22, width: 660, height: 20 });
    pb = w.add('progressbar', { x: 20, y: 42, width: 660, height: 12 }),
        ms = w.add('statictext', { x: 20, y: 62, width: 660, height: 20 });
    /*fc = w.add('statictext', {x:20, y:82, width:660, height:20});*/
    st.justify = 'left';
    w.center();
    this.reset = function (msg, maxValue) {
        /*tl.text = "";*/
        st.text = msg;
        pb.value = 0;
        pb.maxvalue = maxValue;
        pb.visible = maxValue;
        w.show();
    };
    this.info = function (msg) {
        ms.text = msg;
        w.show();
    };
    this.set = function (step) { pb.value = step };
    this.hit = function () { ++pb.value; };
    this.close = function () { w.close(); };
} // ProgressBar
////////
function main() {
    var pBar;
    var programTitul = "DoMakeupOK.jsx" + ScriptName + "( " + myCurrentVersionData_xx_xx_xx + " )";
    myDiscretionaryHyphen = "\u00AD";
    myNonbreakingHyphen = "\u2011";
    myWinWordHyphen = "\u00AC";
    myNonbreakingSpace = "~S";
    var myStory;
    var myStartOfFragment;
    var myEndOfFragment;
    var myIndxStart;
    myFragment = false;
    var myProblemPages = [];
    var mySel;
    var myCharsOrig;
    var myParsOrig;
    var myIndxStart;
    myLastSelectedCharIsLastCharOfStory = true;
    ////
    // определим шрифт диалогов
    //var dialogFont = File.fs == "Macintosh" ? "Lucida Grande" : "Verdana";
    var dialogFont = File.fs == "Windows" ? "Verdana" : "Lucida Grande";
    ///
    function SelectionAtFirst() { // SelectionAtFirst 
        mySelection = app.selection[0];
        if (app.documents[0].activeLayer.locked == true || app.documents[0].activeLayer.visible == false) { // locked or notvisible
            alert("При запуске скрипта должен быть выбран видимый незаблокированный слой.\nАктивный сейчас слой '" + app.documents[0].activeLayer.name + "' не отвечает этому требованию.", programTitul);
            exit();
        } // locked or notvisible
        if (mySelection == undefined || (mySelection.parent.constructor.name != "Story" && mySelection.parent.constructor.name != "Footnote" && mySelection.constructor.name != "Table" && mySelection.parent.constructor.name != "Table" && mySelection.parent.parent.constructor.name != "Table")) { // mySelection == ...
            alert("Перед запуском программы поставьте курсор в текст для подготовки всей статьи к вёрстке.\nВыделите часть текста для проверки только её.", programTitul);
            exit();
        } // mySelection == ...
        if ((mySelection.parent.constructor.name == "Story" || mySelection.parent.constructor.name == "Footnote") && (InCopyIsUsed == true && mySelection.parent.lockState == LockStateValues.CHECKED_IN_STORY)) { // == LockStateValues.CHECKED_IN_STORY
            alert("Приведение вёрстки в порядок предполагает внесение исправлений в вёрстку. Но у выбранной статьи установлен указатель, извещающий, что в него вносить правку нельзя, возможно, у неё сейчас состояние 'Редактирование в программе InCopy'.\nВизуально статус всех статей отображается в панели 'Окно>Правка>Подборки' (Window>Editorial>Assignments).", programTitul);
            exit();
        } // == LockStateValues.CHECKED_IN_STORY  
        if (app.selection[0].parentTextFrames[0].constructor.name != "TextFrame") { //  constructor.name != "TextFrame"
            alert("Текст, размещенный на контуре объекта или линии, этой программой не обрабатывается.\nЕго можно проверить визуально.", programTitul);
            exit();
        } // constructor.name != "TextFrame"
        if (mySelection.parentStory.overflows == true) { // overflows 
            alert("В статье не должно быть переполнения.", programTitul);
            exit();
        } // overflows
        //var myZoom = app.documents[0].layoutWindows[0].zoomPercentage;
        if (mySelection != undefined) { // mySelection != undefined
            if (mySelection.parent.constructor.name != "Story" && mySelection.parent.constructor.name != "Footnote") { // это таблица
                var myStartNmr;
                if (mySelection.constructor.name == "Table") { mySelection.storyOffset.select(); myStartNmr = mySelection.storyOffset.index; }
                if (mySelection.parent.constructor.name == "Table") { mySelection.parent.storyOffset.select(); myStartNmr = mySelection.parent.storyOffset.index; }
                if (mySelection.parent.parent.constructor.name == "Table") { mySelection.parent.parent.storyOffset.select(); myStartNmr = mySelection.parent.parent.storyOffset.index; }
                mySelection = app.selection[0];
                mySelection.parent.characters.itemByRange(myStartNmr, myStartNmr).select();
                myStory = mySelection.parentStory;
                myStartOfFragment = mySelection.paragraphs[0].characters.firstItem().index;
                myEndOfFragment = mySelection.paragraphs[mySelection.paragraphs.length - 1].characters.lastItem().index;
                myIndxStart = myStartOfFragment;
                myFragment = true;
                mySelection.parent.characters.itemByRange(myStartOfFragment, myEndOfFragment).select();
            } // это таблица
            else { // курсор в тексте статьи или в сноске
                myStory = mySelection.parentStory;
                if (mySelection.parent.constructor.name == "Footnote") { // == "Footnote"
                    try { while (mySelection.parent.characters[-1].contents == myEnter) mySelection.parent.characters.lastItem().remove(); } catch (e) { }
                    mySelection.parent.characters.itemByRange(0, -1).select();
                    mySelection = app.selection[0];
                } // == "Footnote"
                myCharsOrig = mySelection.characters.length;
                myParsOrig = mySelection.paragraphs.length;
                if (myStory.characters.length <= 1) { // 0 - ничего нет. 1 - только один знак перевода строки
                    alert("В фрейме текста нет.\n", programTitul);
                    exit();
                } //0  	
                if (myCharsOrig == 0) { // myCharsOrig == 0   // не выделен ни один символ, значит, обрабатывается вся статья
                    myText = myStory;
                    myCharsOrig = myStory.characters.length;
                    myParsOrig = myStory.paragraphs.length;
                    myIndxStart = 0;
                    myFragment = false;
                    myStartOfFragment = 0;
                    myEndOfFragment = myStory.length - 1;
                    myLastSelectedCharIsLastCharOfStory = false;
                } //myCharsOrig == 0
                else { // myCharsOrig != 0
                    myFragment = true;
                    myStartOfFragment = mySelection.characters.firstItem().index;
                    if (myStartOfFragment != myStory.characters[0].index && (myStory.characters[myStartOfFragment].contents == "\r" || myStory.characters[myStartOfFragment].contents == "\n") && myStory.characters[myStartOfFragment].paragraphs[0].contents.length > 1) myStartOfFragment++; // не должен перевод строки предыдущего абзаца быть в выборке на обработку
                    myIndxStart = myStartOfFragment;
                    myEndOfFragment = mySelection.characters.lastItem().index;
                    if (myEndOfFragment == myStory.characters[-1].index) myLastSelectedCharIsLastCharOfStory = true; // в фрагмент выборки попал конец статьи
                    else if (myStory.characters[myEndOfFragment].contents == "\r" || myStory.characters[myEndOfFragment].contents == "\n") myEndOfFragment--;  // не должен перевод строки последнего абзаца быть в выборке на обработку. Если его оставить, то последний выделенный абзац подхватит оформление того абзаца, что идёт за ним. А это совсем не нужно.
                } // myCharsOrig != 0
                mySelection.parent.characters.itemByRange(myStartOfFragment, myEndOfFragment).select();
                mySel = app.selection[0]; // сохраним выборку для того, чтобы восстановить её при возврате в основное меню
            } // курсор в тексте статьи или в сноске    
        }  // mySelection != undefined
        testColor();
    } // SelectionAtFirst
    //////
    SelectionAtFirst();
    var myWin = myScriptWindow();
    myWin.show();
    /////
    function testColor() { // testColor
        try { app.documents[0].colors.item("MakeupColor").remove(); } catch (e) { } // цвета удаляются, чтобы снять выделение цветом
        //try { app.documents[0].swatches.item("MakeupColor").remove(); } catch (e) { }  
        try {
            MakeupColor = app.documents[0].colors.item("MakeupColor").name;
        }
        catch (e) {
            MakeupColor = app.documents[0].colors.add({ name: "MakeupColor", model: ColorModel.process, space: ColorSpace.CMYK, colorValue: MakeupColorSample });
        }
    } // testColor
    //=================
    function myScriptWindow() { // myScriptWindow
        var win = new Window("palette", programTitul, undefined, { closeButton: false });
        if (MainWinLocation[0] != -1) win.location = MainWinLocation;
        win.alignChildren = ["fill", "fill"];
        var myRadioButtons1 = win.add("group");
        var WrongHeaders = win.add("group");
        WrongHeaders.orientation = "row";
        var myRadioButtons2 = win.add("group");
        myRadioButtons1.alignChildren = ["fill", "fill"];
        //myRadioButtons.alignChildren = ["fill", "fill"];
        myRadioButtons2.alignChildren = ["fill", "fill"];
        myRadioButtons1.orientation = "column";
        myRadioButtons2.orientation = "column";
        var ProblemGlyphs = myRadioButtons1.add("radiobutton", undefined, "Поиск не полностью установленных шрифтов и потерянных глифов");
        //ProblemGlyphs.helpTip = "Эта проверка игнорирует выделение в тексте, проверяется вся статья.";

        var DefisMinusTire = myRadioButtons1.add("radiobutton", undefined, "Поиск строк внутри абзаца, начинающихся с дефиса, минуса, тире или знака переноса");

        var partHE = myRadioButtons1.add("radiobutton", undefined, "Поиск переносов '-НЕ', 'НЕ-' и частицы 'НЕ' в конце строки");

        var OneWord = myRadioButtons1.add("radiobutton", undefined, "Поиск абзацев с короткой последней строкой");
        //OneWord.helpTip = "Ищутся как целые слова, так и разделённые переносом.\nКроме того, пользователь может определить в строках запускающей программы длину текста, меньше которой последняя строка абзаца быть не может. Часто там оказывются сокращения \"и т.п\" или \"и т.д.\" и прочие, которые обычно легко втягиваются в предыдущую строку.";

        var LastLines = myRadioButtons1.add("radiobutton", undefined, "Поиск абзацев с почти полными последними строками");
        LastLines.value = false;
        if (myMinValueRight == 0) LastLines.enabled = false;
        //LastLines.helpTip = "В абзацах с выравниванием 'Выключка влево' ('Left Justify') проверяется расстояние от последнего символа абзаца до правого края колонки.\nЕсли оно равно или меньше заданного пользователем значения, можно в режиме просмотра результатов поиска выровнять каждой такой абзац на полный формат 'Выключка по формату' ('Full Justify').";

        var WrHdSearch = WrongHeaders.add("radiobutton", undefined, "Поиск заголовка внизу полосы");
        var ParaStyleList = WrongHeaders.add("dropdownlist", undefined, myParaStyleNames, { multiselect: false });
        ParaStyleList.selection = myStyleIndex;
        ///
        var WidowAndOrphan = myRadioButtons2.add("radiobutton", undefined, "Поиск висячей строки");
        var BadHyphenInSpread = myRadioButtons2.add("radiobutton", undefined);
        app.documents[0].documentPreferences.facingPages == true ? BadHyphenInSpread.text = "Поиск переносов в последней строке разворота" : BadHyphenInSpread.text = "Поиск переносов в последней строке страницы";

        ///////////
        //var UseColor = win.add ("checkbox", undefined, "На время работы скрипта отмечать цветом требующий внимания текст");
        //UseColor.value = UseColor_value;
        var HelpMessage = win.add("checkbox", undefined, "Отключить всплывающие подсказки кнопок");
        HelpMessage.value = HelpMessage_value;
        setHelpMes();
        ///
        function setHelpMes() { // setHelpMes
            if (!HelpMessage_value) ProblemGlyphs.helpTip = "Эта проверка игнорирует выделение в тексте, проверяется вся статья."; else ProblemGlyphs.helpTip = "";
            if (!HelpMessage_value) OneWord.helpTip = "Ищутся как целые слова, так и разделённые переносом.\nКроме того, пользователь может определить в строках запускающей программы длину текста, меньше которой последняя строка абзаца быть не может. Часто там оказываются сокращения \"и т.п\" или \"и т.д.\" и прочие, которые обычно легко втягиваются в предыдущую строку."; else OneWord.helpTip = "";
            if (!HelpMessage_value) LastLines.helpTip = "В абзацах с выравниванием 'Выключка влево' ('Left Justify') проверяется расстояние от последнего символа абзаца до правого края колонки.\nЕсли оно равно или меньше заданного пользователем значения, можно в режиме просмотра результатов поиска выровнять каждый такой абзац на полный формат 'Выключка по формату' ('Full Justify')."; else LastLines.helpTip = "";
            if (!HelpMessage_value) WrHdSearch.helpTip = "В автоматическом процессе вёрстки возможна ситуация, что заголовок окажется внизу полосы.\nЧтобы не ломать глаза в поиск таких случаев выберите один из стилей абзаца, и программа найдёт такой заголовок, если он есть."; else WrHdSearch.helpTip = "";
            if (!HelpMessage_value) partHE.helpTip = "В практике книгоиздания известны два редких случая упущений в вёрстке, из-за которых при быстром чтении можно понять текст неправильно. Это может случиться, если: 1) частица ‘не’ оказалась в конце строки; 2) буквы ‘не’ — первая или последняя часть разделённого переносом слова."; else partHE.helpTip = "";
        } // setHelpMes
        ///
        function ResetAllButtons() { // ResetAllButtons
            ProblemGlyphs.value = false;
            DefisMinusTire.value = false;
            OneWord.value = false;
            LastLines.value = false;
            BadHyphenInSpread.value = false;
            WidowAndOrphan.value = false;
            WrHdSearch.value = false;
            partHE.value = false;
        } // ResetAllButtons
        ///
        WrHdSearch.onClick = function () { // WrHdSearch.onClick
            ResetAllButtons();
            WrHdSearch.value = true;
            myOKButon.enabled = true;
            SelectionAtFirst();
            //~ getParaStyleList(myParaStyleNames);
            //~ if (myParaStyleNames[myStyleIndex] != usedStyleName) {
            //~     myStyleIndex = 0;
            //~     ParaStyleList.selection = myStyleIndex; 
            //~     }
            if (myFirstProcFileName != app.documents[0].name) {
                alert("Список стилей сформирован для другого открытого ранее файла, поэтому этой опцией можно воспользоваться только после повторного запуска скрипта с этим файлом.\nДругие опции программы по-прежнему доступны.", programTitul);
                ResetAllButtons();
                myOKButon.enabled = false;
                return;
            }
            if (myStory.textColumns.length == 1) { // textColumns.length == 1
                alert("Нет текстовой цепочки, всего один фрейм.", programTitul);
                return;
            } // textColumns.length == 1  
        } // WrHdSearch.onClick
        ///
        HelpMessage.onClick = function () { // HelpMessage
            if (HelpMessage.value == true) HelpMessage_value = true;
            else HelpMessage_value = false;
            setHelpMes();
            //~     if (!HelpMessage_value) ProblemGlyphs.helpTip = "Эта проверка игнорирует выделение в тексте, проверяется вся статья."; else ProblemGlyphs.helpTip = "";
            //~     if (!HelpMessage_value) OneWord.helpTip = "Ищутся как целые слова, так и разделённые переносом.\nКроме того, пользователь может определить в строках запускающей программы длину текста, меньше которой последняя строка абзаца быть не может. Часто там оказываются сокращения \"и т.п\" или \"и т.д.\" и прочие, которые обычно легко втягиваются в предыдущую строку."; else OneWord.helpTip = "";
            //~     if (!HelpMessage_value) LastLines.helpTip = "В абзацах с выравниванием 'Выключка влево' ('Left Justify') проверяется расстояние от последнего символа абзаца до правого края колонки.\nЕсли оно равно или меньше заданного пользователем значения, можно в режиме просмотра результатов поиска выровнять каждой такой абзац на полный формат 'Выключка по формату' ('Full Justify')."; else  LastLines.helpTip = "";    
        } // HelpMessage
        separator_2 = win.add("panel"); // Помещаем на экран горизонтальную линию.  
        separator_2.minimumSize.height = separator_2.maximumSize.height = 3;
        ///===============
        var myAllButtonsAndCopyrightInfo = win.add("group");
        myAllButtonsAndCopyrightInfo.alignChildren = ["fill", "fill"];
        myAllButtonsAndCopyrightInfo.orientation = "row";
        var mySetFile;
        var myScriptFile = myGetScriptPath();
        var myScriptFolder = decodeURI(myScriptFile.path);
        var myButtonSize = [0, 0, ButtonSize, 30];
        var myInfo = File(decodeURI(myScriptFolder + "/Picts/" + "InfoPict.png"));
        //var mySettings = myAllButtonsAndCopyrightInfo.add ("button", myButtonSize, "Параметры");
        myOKButon = myAllButtonsAndCopyrightInfo.add("button", myButtonSize, "Начать поиск", { name: "ok" });
        myOKButon.enabled = false;
        //try { var myWelcomeInfo = myAllButtonsAndCopyrightInfo.add("iconbutton", [0,0,33,25], myInfo); } catch (e) { var myWelcomeInfo = myAllButtonsAndCopyrightInfo.add ("button", [0,0,33,25], "Info"); }
        var myWelcomeInfo = makeImageButton(myInfo, true, buttonInsets, myAllButtonsAndCopyrightInfo, myWelcomeInfoOnClick); // это обращение к функции создания кнопки
        myCancelButon = myAllButtonsAndCopyrightInfo.add("button", myButtonSize, "Закончить работу", { name: "cancel" });
        ////
        //changed
        timesProcessed = 0;
        ResetAllButtons();
        WidowAndOrphan.value = true;
        myOKButon.enabled = true;
        SelectionAtFirst();
        if (myStory.textColumns.length == 1) { // textColumns.length == 1
            alert("Нет текстовой цепочки, всего один фрейм.", programTitul);
            return;
        } // textColumns.length == 1    

        WidowAndOrphan.onClick = function () { // WidowAndOrphan.onClick   
            ResetAllButtons();
            WidowAndOrphan.value = true;
            myOKButon.enabled = true;
            SelectionAtFirst();
            if (myStory.textColumns.length == 1) { // textColumns.length == 1
                alert("Нет текстовой цепочки, всего один фрейм.", programTitul);
                return;
            } // textColumns.length == 1    
        } // WidowAndOrphan.onClick
        ///
        BadHyphenInSpread.onClick = function () { // BadHyphenInSpread.onClick
            ResetAllButtons();
            BadHyphenInSpread.value = true;
            myOKButon.enabled = true;
            SelectionAtFirst();
            if (myStory.textColumns.length == 1) { // textColumns.length == 1
                alert("Нет текстовой цепочки, всего один фрейм.", programTitul);
                return;
            } // textColumns.length == 1    
        } // BadHyphenInSpread.onClick
        ///
        LastLines.onClick = function () { // LastLines.onClick
            if (myMinValueRight == 0) {
                LastLines.enabled = false;
                LastLines.value = false;
                return;
            }
            else myOKButon.enabled = true;
            ResetAllButtons();
            LastLines.value = true;
            SelectionAtFirst();
            return;
        } // LastLines.onClick
        ///
        partHE.onClick = function () { // partHE.onClick
            ResetAllButtons();
            partHE.value = true;
            myOKButon.enabled = true;
            SelectionAtFirst();
        } // partHE.onClick
        ///
        OneWord.onClick = function () { // OneWord.onClick
            ResetAllButtons();
            OneWord.value = true;
            myOKButon.enabled = true;
            SelectionAtFirst();
        } // OneWord.onClick
        ////
        DefisMinusTire.onClick = function () { // DefisMinusTire.onClick
            ResetAllButtons();
            DefisMinusTire.value = true;
            myOKButon.enabled = true;
            SelectionAtFirst();
        } // DefisMinusTire.onClick
        ////
        ProblemGlyphs.onClick = function () { // ProblemGlyphs.onClick   
            ResetAllButtons();
            ProblemGlyphs.value = true;
            myOKButon.enabled = true;
            SelectionAtFirst();
        } // ProblemGlyphs.onClick
        ///
        myCancelButon.onClick = function () { // myCancelButon.onClick
            try { app.documents[0].colors.item("MakeupColor").remove(); } catch (e) { }
            try { app.documents[0].swatches.item("MakeupColor").remove(); } catch (e) { }
            tt = myDataFile.open("w");
            myDataFile.writeln(win.location[0]);
            myDataFile.writeln(win.location[1]);
            myDataFile.writeln(ActionWinLocation[0]);
            myDataFile.writeln(ActionWinLocation[1]);
            myDataFile.writeln(GlphsAndFntsLocation[0]);
            myDataFile.writeln(GlphsAndFntsLocation[1]);
            myDataFile.writeln(SmallGlphsAndFntsLocation[0]);
            myDataFile.writeln(SmallGlphsAndFntsLocation[1]);
            //UseColor.value == true ? myDataFile.writeln(1) : myDataFile.writeln(0);
            HelpMessage.value == true ? myDataFile.writeln(1) : myDataFile.writeln(0);
            myDataFile.writeln(ParaStyleList.selection.index);
            myDataFile.writeln(String(ParaStyleList.selection));
            myDataFile.close();
            win.close();
            exit();
        } // myCancelButon.onClick
        ///
        ////
        //myWelcomeInfo.onClick = function() { // myWelcomeInfo.onClick 
        function myWelcomeInfoOnClick() { // myWelcomeInfo.onClick     
            alert(Text1, programTitul);
        } // myWelcomeInfo.onClick 
        ///
        //myOKButon.onClick = function () { // myOKButon.onClick

        var myInfoArray = [];
        var myContainerId = []; // тут будут собраны уникальные идентификаторы фреймов, в которых есть висячие строки
        var myContainerOnPage = []; // тут будут собраны уникальные идентификаторы фреймов, по одному на каждую страницу. Этого достаточно для выбора фрейма и перехода на страницу, где этот фрейм
        var myPages = [];
        while (myInfoArray.length > 0) myInfoArray.shift();
        while (myContainerId.length > 0) myContainerId.shift();
        while (myContainerOnPage.length > 0) myContainerOnPage.shift();
        while (myPages.length > 0) myPages.shift();
        while (myProblemPages.length > 0) myProblemPages.shift();
        testColor(); // на случай, если будет повторный запуск выбранной ранее команды. При выборе разных команд цвет сбрасывается в процедуре SelectionAtFirst(), но тут, коль скоро нет смены кнопки, цвет удалён не будет. Поэтому надо это сделать специально.
        ////
        if (ProblemGlyphs.value == true) { // ProblemGlyphs.value == true
            win.hide();
            GlyphsAndFontsProcessing();
        } // ProblemGlyphs.value == true
        function GlyphsAndFontsProcessing() { // GlyphsAndFontsProcessing
            var allFound = [];
            var myF = [];
            var numFonts = app.documents[0].fonts.length;
            var FontsWithProblemGlyphsLine = "";
            var ProblemFonts = "";
            myF = app.documents[0].fonts.everyItem().getElements();
            var pBar = new ProgressBar(programTitul);
            //pBar.reset(" Поиск ошибок в использовании шрифтов и поиск потерянных глифов", myF.length);
            //pBar.info(" Обрабатывается вся статья, независимо от того, выделена или нет часть текста.");
            while (GlyphFontsNames.length > 0) GlyphFontsNames.shift();
            for (var z = 0; z < myF.length; z++) { // z++
                a = 0;
                if (myF[z].status != FontStatus.INSTALLED) { // != FontStatus.INSTALLED
                    ProblemFonts += app.documents[0].fonts[z].fontFamily + "\n";
                    continue;
                } // != FontStatus.INSTALLED
                app.findGlyphPreferences = null;
                app.findGlyphPreferences.glyphID = 0;
                // app.findGlyphPreferences.appliedFont = app.documents[0].fonts[z].name; // эта строка некорректно обрабатывает некоторые шрифты, в частности Lasursky BoldBold
                app.findGlyphPreferences.appliedFont = myF[z].fontFamily;
                app.findGlyphPreferences.fontStyle = myF[z].fontStyleName;
                allFound = app.documents[0].findGlyph();
                try {
                    var mySelStoryId = app.selection[0].parentStory.id;
                }
                catch (e) {
                    //pBar.close();
                    alert("Потеряна выборка текста. Перезапустите скрипт.");
                    exit();
                }
                if (allFound.length > 0) { // allFound.length > 0
                    var allFoundInStory = [];
                    for (var d = 0; d < allFound.length; d++) { // d++
                        if (allFound[d].parentStory.id == mySelStoryId) allFoundInStory.push(allFound[d]);
                    } // d++
                    if (allFoundInStory.length > 0) { // allFoundInStory.length > 0
                        LineChars = " ) : ";
                        for (var y = 0; y < allFoundInStory.length; y++) { // y++
                            LineChars += allFoundInStory[y].contents + "  ";
                        } // y++   
                    } // allFoundInStory.length > 0
                    GlyphFontsAsAr[z] = true;
                    GlyphFonts.push(myF[z]);
                    GlyphFontsNames.push(myF[z].name);
                    FontsWithProblemGlyphsLine += myF[z].fontFamily + " " + myF[z].fontStyleName + " ( документ: " + allFound.length + " / статья: " + allFoundInStory.length + LineChars + "\n";
                } // allFound.length > 0
            }  // z++
            //pBar.close();
            // Если длина массива FontsWithProblemGlyphsLine  больше нуля, это значит, что к этому моменту в этом массиве собрана информация о шрифтах с проблемными глифами.
            var myLinesArray = [];
            var ProblemFontsArray = [];
            if (FontsWithProblemGlyphsLine.length == 0 && ProblemFonts.length == 0) { // FontsWithProblemGlyphsLine.length == 0
                alert("Потерянных глифов и проблемных шрифтов не найдено.", programTitul);
                win.show();
                return;
            } // FontsWithProblemGlyphsLine.length == 0
            else if (FontsWithProblemGlyphsLine.length != 0) { // FontsWithProblemGlyphsLine.length != 0
                // Длина массива FontsWithProblemGlyphsLine  больше нуля
                myLinesArray = FontsWithProblemGlyphsLine.split("\n");
            } // FontsWithProblemGlyphsLine.length != 0
            if (ProblemFonts.length != 0) { // ProblemFonts.length != 0
                // Длина массива ProblemFonts  больше нуля
                ProblemFontsArray = ProblemFonts.split("\n");
            } // FontsWithProblemGlyphsLine.length != 0
            /////
            if (ProblemFontsFound == true && ProblemFonts.length == 0) { // true && == 0
                alert("Перед наведением порядка в шрифтах следовало закрыть эту программу.\nПерезапустите её сейчас для продолжения приведения вёрстки в порядок.", ScriptName);
                exit();
            } //  // true && == 0
            if (ProblemFonts.length != 0) WindowTitul = "Неполностью установленные шрифты";
            if (ProblemFonts.length == 0 && FontsWithProblemGlyphsLine.length != 0) WindowTitul = "Потерянные глифы";
            function missedGlyphsAndFonts(myLinesArrayLength) { // missedGlyphsAndFonts()
                var GlphsAndFnts = new Window("palette", WindowTitul, undefined, { closeButton: false });
                //var GlphsAndFnts = new Window ("palette", WindowTitul, undefined, {closeButton: true});
                if (GlphsAndFntsLocation[0] != -1) GlphsAndFnts.location = GlphsAndFntsLocation;
                GlphsAndFnts.alignChildren = "left";
                if (ProblemFonts.length != 0) { // ProblemFonts.length != 0
                    var h2 = GlphsAndFnts.add("statictext", undefined, "Проблемы с шрифтами: шрифт или не установлен, или ошибка в указании начертания.");
                    var h3 = GlphsAndFnts.add("statictext", undefined, "Смотрите 'Текст > Найти шрифт...'  (Text > Find font...)");
                    //~     h2.graphics.font = ScriptUI.newFont (dialogFont, 'BOLD', 12);
                    //~     h3.graphics.font = ScriptUI.newFont (dialogFont, 'BOLD', 12);    
                    //~     h4.graphics.font = ScriptUI.newFont (dialogFont, 'BOLD', 12);        
                    for (var i = 0; i < ProblemFontsArray.length; i++) { // i++
                        var tmpInfoLine = GlphsAndFnts.add("statictext", undefined, ProblemFontsArray[i]);
                        tmpInfoLine.graphics.font = ScriptUI.newFont(dialogFont, 'BOLD', 12);
                    } // i++
                    var h4 = GlphsAndFnts.add("statictext", undefined, "Выйдите из программы, устраните проблему с шрифтами и запустите скрипт снова.");
                    ProblemFontsFound = true;
                } // ProblemFonts.length != 0
                if (ProblemFonts.length == 0 && FontsWithProblemGlyphsLine.length != 0) { // FontsWithProblemGlyphsLine.length != 0
                    var h1 = GlphsAndFnts.add("statictext", undefined, "Шрифт, в котором потеряны глифы (число потерь в документе / в статье) : вид отсутствующих знаков");
                    h1.graphics.font = ScriptUI.newFont("Verdana", 'BOLD', 12);
                    for (var i = 0; i < myLinesArrayLength; i++) { // i++
                        //GlphsAndFnts.add("statictext", undefined, myLinesArray[i]) + "##";
                        GlphsAndFnts.add("statictext", undefined, myLinesArray[i]) + "\u00A0";
                    } // i++
                } // FontsWithProblemGlyphsLine.length != 0
                //////>>>>>>>>>>>>
                var myAllButtonsAndCopyrightInfo = GlphsAndFnts.add("group");
                myAllButtonsAndCopyrightInfo.alignChildren = ["fill", "fill"];
                myAllButtonsAndCopyrightInfo.orientation = "row";
                var mySetFile;
                var myScriptFile = myGetScriptPath();
                var myScriptFolder = decodeURI(myScriptFile.path);
                var myButtonSize = [0, 0, ButtonSize, 30];
                var myInfo = File(decodeURI(myScriptFolder + "/Picts/" + "InfoPict.png"));
                myButtonSize2 = [0, 0, Number(ButtonSize) * 2, 30];
                OKButton = myAllButtonsAndCopyrightInfo.add("button", myButtonSize2, "Приступить к возвращению глифов в текст", { name: "ok" });
                //try { var myInfoAboutGlyph = myAllButtonsAndCopyrightInfo.add("iconbutton", [0,0,33,25], myInfo); } catch (e) { var myInfoAboutGlyph = myAllButtonsAndCopyrightInfo.add ("button", [0,0,33,25], "Info"); }
                var myInfoAboutGlyph = makeImageButton(myInfo, true, buttonInsets, myAllButtonsAndCopyrightInfo, myInfoAboutGlyphOnClick);
                CancelButton = myAllButtonsAndCopyrightInfo.add("button", myButtonSize2, "Закончить работу с глифами и шрифтами", { name: "cancel" });
                ///
                HelpInfoAboutGlyph = "'Поиск не полностью установленных шрифтов и поиск потерянных глифов' — эта проверка выполняется так:\n- обрабатывается вся статья. Сначала ищутся проблемные шрифты, те, что в меню ‘Текст > Найти шрифт…’ (в английской версии ‘Type > Find Font…’ отмечены желтым треугольником с восклицательным знаком. Конечно, верстальщик узнал бы об этой проблеме в момент генерации PDF-файла, но зачем ждать, ведь эта ситуация должна быть решена как можно быстрее.\nЕсли такие «неблагополучные» шрифты обнаружены, скрипт предлагает закончить его работу, решить обнаруженную шрифтовую проблему, а потом перезапустить скрипт.\nПерезапуск скрипта после обновления шрифтов обязателен. Если вопрос со шрифтами снят без прекращения работы скрипта, эта ситуация будет обнаружена, и программа сама завершит работу.\n- потерянные глифы, если таковые будут найдены, можно вернуть только если в работе нет проблемных шрифтов.\nГлиф — это графический знак символа, и имеющиеся в каждой гарнитуре символы отображаются в панели глифов: Текст > Глифы (Type > Glyphs). Два параметра однозначно описывают такой знак: 1) юникод символа, например, у латинской буквы ‘a’ он 0061; 2) одно из чисел пары индексов GID/CID: GID (Glyph ID) — позиция или индекс этого глифа в таблице символов конкретного шрифта, CID (Character ID) — идентификатор знака. В этом скрипте используется только индекс GID. Индексы одинаковых по юникоду глифов в разных гарнитурах не совпадают, так для латинской ‘a’ в гарнитуре Times New Roman этот индекс равен 68, в гарнитуре Minion Pro он будет 66, в Baskerville значение индекса этой буквы 73. А если глиф в таблице шрифтов отсутствует, то его индекс там равен нулю.\nТак, например, если текст набирался шрифтом Times New Roman и в тексте есть французские буквы, то при оформлении этого текста гарнитурой Лазурского все французские буквы исчезнут. Но с точки зрения индизайна шрифт с нулевыми глифами не является проблемным. Проблема — вёрстка с такими исчезнувшими символами. Не все потерянные глифы отмечаются перечёркнутым прямоугольником, могут быть случаи, что это просто розовые полоски, исчезающие в режиме предварительного просмотра. И от того, что мы их не видим, эта ситуация становится отложенной ошибкой. Поэтому потерянные глифы (те, что имеют нулевой индекс в конкретной гарнитуре, назовём их нулевыми глифами) надо найти и вернуть в текст. Обычно это делается заменой на сходную по рисунку гарнитуру. В этом скрипте шрифт на замену выбирается не из необозримого списка всех шрифтов приложения, а из шрифтов документа. Поэтому если будут потери и в шрифте с засечками, и в рубленом шрифте, надо для обоих вариантов включить в работу варианты шрифтов, имеющих нужные глифы.\nВ окне 'Потерянные глифы' отображаются потерянные знаки, и обычно это узнаваемые символы. Но если на месте знака точка, то это, скорее всего, символ из шрифта Windings или какого-то другого с глифами-картинками.\nВозврат отображения потерянных глифов выполняется в окне «Замена шрифтов нулевых глифов», перед началом обработки надо выделить текст. На время обработки найденные нулевые глифы окрашиваются цветом 'MakeupColor', а при завершении обработки им возвращается цвет, который глиф имел в вёрстке.";
                //myInfoAboutGlyph.onClick = function() { //  myInfoAboutGlyph.onClick
                function myInfoAboutGlyphOnClick() { //  myInfoAboutGlyph.onClick    
                    myInfoAboutGlyph.helpTip = "";  // чтобы это сообщение не появлялось поверх информационного окна во время отображения справки
                    alert(HelpInfoAboutGlyph, programTitul);
                    myInfoAboutGlyph.helpTip = "Информация о программе";
                } //  myInfoAboutGlyph.onClick
                ///
                if (ProblemFonts.length != 0) OKButton.enabled = false;
                ///
                OKButton.onClick = function () { // OKButton.onClick
                    //GlphsAndFntsLocation = GlphsAndFnts.location;
                    var SGA = SmallGlphsAndFntsShow(); // маленькое меню показа шрифтов глифов и нармальных шрифтов
                    SGA.show();
                    GlphsAndFnts.hide();
                    function SmallGlphsAndFntsShow() { // SmallGlphsAndFntsShow()  
                        var SmallGlphsAndFnts = new Window("palette", "Замена шрифтов нулевых глифов", undefined, { closeButton: false });
                        //var SmallGlphsAndFnts = new Window ("palette" , "Замена шрифтов нулевых глифов");      
                        if (SmallGlphsAndFntsLocation[0] != -1) SmallGlphsAndFnts.location = SmallGlphsAndFntsLocation;
                        SmallGlphsAndFnts.alignChildren = "fill";
                        var RightFontsArray = []; //тут имена шрифтов, в которых все глифы. Каждый элемент массива имеет тип [Font]
                        var FontNamesArray = [];  // тут имена шрифтов для вывода меню
                        var AsArrayObj = {};  // ассоциативный массив
                        //    RightFontsArray[0] = myF[0].fontFamily;
                        while (RightFontsArray.length > 0) RightFontsArray.shift();
                        while (FontNamesArray.length > 0) FontNamesArray.shift();
                        for (var i = 0; i < myF.length; i++) { // i++
                            if (GlyphFontsAsAr[i]) {
                                continue; // пропускаем шрифты, которые есть в массиве GlyphFontsAsAr 
                            }
                            if (!AsArrayObj[i]) { // if
                                AsArrayObj[i] = true;
                                RightFontsArray.push(myF[i]);
                                var tmpArr = ["", "", ""];
                                try { tmpArr[0] = myF[i].fullNameNative } catch (e) { tmpArr[0] = "" }
                                try { tmpArr[1] = myF[i].postscriptName } catch (e) { tmpArr[1] = "" }
                                try { tmpArr[2] = myF[i].name } catch (e) { tmpArr[2] = "" }
                                tmpArr.sort(myCompare);
                                function myCompare(a, b) { // myCompare
                                    if (String(a) > String(b)) return -1;
                                    else if (String(a) < String(b)) return 1;
                                    else return 0
                                } // myCompare
                                FontNamesArray.push(tmpArr[0]); // для отображения в меню выбрано самое длинное название             
                            } // if
                        } // i++    
                        //    for (var i = 0; i < myF.length; i++) RightFontsArray[i] = myF[i].fontFamily;
                        var GlProc = SmallGlphsAndFnts.add("panel", undefined);
                        //var GlProc = SmallGlphsAndFnts.add("panel", undefined, "Шрифт для глифа");    
                        GlProc.alignChildren = "fill";
                        GlProc.add("statictext", undefined, "Шрифт с нулевыми глифами:");
                        var myGlyphFontsList = GlProc.add("dropdownlist", undefined, GlyphFontsNames /*myLinesArray*/, { multiselect: false }); // GlyphFonts[myGlyphFontsList.selection.index]
                        myGlyphFontsList.selection = 0;
                        GlProc.add("statictext", undefined, "Шрифт для замены:");
                        var myAllFontsList = GlProc.add("dropdownlist", undefined, FontNamesArray, { multiselect: false }); // FontNamesArray[myAllFontsList.selection.index]
                        myAllFontsList.selection = 0;
                        //~     ChangeFontOneGlyph = GlProc.add ("radiobutton", undefined, "Изменить шрифт глифа");     
                        //~     ChangeFontAllGlyphes = GlProc.add ("radiobutton", undefined, "Изменить шрифт всех глифов");  
                        //~     ChangeFontOneGlyph.value = true;
                        ChangeFontButton = GlProc.add("button", undefined, "Изменить шрифт глифов");
                        SmallCancelButton = SmallGlphsAndFnts.add("button", undefined, "Возврат погашенного окна");
                        if (!HelpMessage.value) SmallCancelButton.helpTip = "Эта кнопка для возврата на экран временно погашенного окна работы с глифами и шрифтами";
                        else SmallCancelButton.helpTip = "";
                        while (GlifColors.length > 0) GlifColors.shift();
                        SmallCancelButton.onClick = function () { // SmallCancelButton.onClick 
                            SmallGlphsAndFntsLocation = SmallGlphsAndFnts.location;
                            GlphsAndFnts.show();
                            SmallGlphsAndFnts.close();
                        } // SmallCancelButton.onClick 
                        ///
                        ChangeFontButton.onClick = function () { // ChangeFontButton.onClick 
                            myS = app.selection[0];
                            if (myS.length == 0) {
                                alert("Нет выделенного текста.", programTitul);
                                return;
                            }
                            app.findGlyphPreferences = null;
                            app.findGlyphPreferences.appliedFont = GlyphFonts[myGlyphFontsList.selection.index].fontFamily;
                            app.findGlyphPreferences.fontStyle = GlyphFonts[myGlyphFontsList.selection.index].fontStyleName;
                            app.findGlyphPreferences.glyphID = 0;
                            var gl = myS.findGlyph();
                            if (gl.length == 0) {
                                alert("Не найдены глифы с равным нулю идентификатором GID/CID.", programTitul);
                                return;
                            }
                            for (var i = 0; i < gl.length; i++) { //  i < gl.length
                                gl[i].appliedFont = app.documents[0].fonts.item(RightFontsArray[myAllFontsList.selection.index].fontFamily);
                                // if (UseColor.value == true) { // UseColor.value == true
                                GlifColors.push(gl[i].index);
                                GlifColors.push(gl[i].fillColor);
                                gl[i].fillColor = "MakeupColor";
                                //    } // UseColor.value == true
                            } //  i < gl.length
                        } // ChangeFontButton.onClick
                        return SmallGlphsAndFnts;
                    } // SmallGlphsAndFntsShow()
                } // OKButton.onClick
                CancelButton.onClick = function () { // CancelButton.onClick
                    GlphsAndFntsLocation = GlphsAndFnts.location;
                    GlphsAndFnts.close();
                    while (GlifColors.length > 0) { // GlifColors.length > 0
                        var myClr = GlifColors.pop();
                        var myIndx = GlifColors.pop();
                        //app.selection[0].parentStory.characters[myIndx].fillColor = myClr;
                        myS.parentStory.characters[myIndx].fillColor = myClr;
                    } // GlifColors.length > 0
                    win.show();
                    return;
                } // CancelButton.onClick
                ////////>>>>>>>>>>>>>>>
                return GlphsAndFnts;
            } // missedGlyphsAndFonts()
            ///
            var R = missedGlyphsAndFonts(myLinesArray.length);
            R.show();
        } // GlyphsAndFontsProcessing
        /////
        if (LastLines.value == true) { // LastLines.value == true
            win.hide();

            LEFT_ALIGN = 1818584692
            LEFT_JUSTIFIED = 1818915700
            FULLY_JUSTIFIED = 1718971500

            var InfoLine = "";
            var myRememberedPages = [];
            while (myRememberedPages.length > 0) myRememberedPages.shift();
            TestFramesOnPasteboard();
            var mySt = app.selection[0];
            //var pBar = new ProgressBar(programTitul);
            //pBar.reset(" Поиск абзацев с почти полными последними строками", mySt.paragraphs.length);
            var myNumberOfActions = 0;
            for (i = 0; i < mySt.paragraphs.length; i++) { // myStory.paragraphs.length
                var myCurrParagraph = mySt.paragraphs[i];
                if (myCurrParagraph.justification != LEFT_JUSTIFIED) continue;
                if (myCurrParagraph.lines.length == 1 || myCurrParagraph.lines[0].length == 0) { continue; } // проверка myCurrParagraph.lines[0].length == 0 обусловлена тем, что был тест, в котором длина строки была нулевой. В той строке был один символ с кодом 0x17 
                myAppliedParagraphStyle = myCurrParagraph.appliedParagraphStyle;
                myFirstLineIndent = myAppliedParagraphStyle.firstLineIndent;
                // if (myFirstLineIndent == 0) continue; // при обработке всей статьи встречен абзац с нулевым абзацным отступом /* эта проверка исключена, т.к. может быть абзац с нулевым отступом, но проблемами в последней строке    */
                var myTopLine = myCurrParagraph.lines[-2]; // это предпоследняя строка. Первоначально была идея сравнивать правые Х-координаты первой и последней строк, но это давало ошибку для абзацев, казмещенных в разных колонках.
                var myBottomLine = myCurrParagraph.lines[-1];
                myRightPosition1 = myTopLine.characters.lastItem().horizontalOffset; // предполагается, что первая строка абзаца имеет полную длину, поэтому интересна Х-координата последнего знака в ней.
                myRightPosition2 = myBottomLine.characters.lastItem().horizontalOffset; // Х-координата последнего знака абзаца 
                var myDiff = Math.abs(myRightPosition1 - myRightPosition2).toFixed(2);
                if ((myDiff - myMinValueRight) < 0) { // myMinValueRight
                    myCurrParagraph.justification = FULLY_JUSTIFIED;
                    myBottomLine.fillColor = "MakeupColor";
                    myNumberOfActions++;
                    InfoLine = "," + myBottomLine.parentTextFrames[0].id;
                    parseIntAppVersion == 6 ? myRememberedPages.push(myBottomLine.parentTextFrames[0].parent.name + InfoLine) : myRememberedPages.push(myBottomLine.parentTextFrames[0].parentPage.name + InfoLine);
                } // myMinValueRight
            } // myStory.paragraphs.length
            //pBar.close();
            if (myNumberOfActions == 0) { // myNumberOfActions == 0
                alert("Не найдено абзацев, требующих изменения форматирования.", programTitul);
                mySel.select();
                win.show();
                return;
            } // myNumberOfActions == 0
            var myInfoArrayLength = myRememberedPages.length;
            for (var j = 0; j < myInfoArrayLength; j++) { // j++
                myPages[j] = myRememberedPages[j].split(",")[0];
                myContainerId[j] = myRememberedPages[j].split(",")[1];
            } // j++ 
            ProblemPagesAndContainers();
            myShowPage("Просмотр абзацев с почти полными последними строками");
        } //     
        ////
        if (WidowAndOrphan.value == true) { // WidowAndOrphan.value == true
            //changed
            for (var y = 0; y < 7; y++) { //может быть всего 7 шагов для решения (0 -> -35, ++ 5)
                timesProcessed = timesProcessed + 1;
                win.hide();
                myInfoArray = WidowAndOrphanProcessing();
                var myInfoArrayLength = myInfoArray.length;
                for (var j = 0; j < myInfoArrayLength; j++) { // j++
                    myPages[j] = myInfoArray[j].split(",")[0];
                    myContainerId[j] = myInfoArray[j].split(",")[1];
                } // j++
                ArrSize = myPages.length;
                /*if (ArrSize == 0) {
                    alert("В выбранном тексте нет висячих строк.", programTitul);
                    mySel.select();
                    win.show();
                    return;
                }*/
                //ProblemPagesAndContainers();
                var SearchWidAndOrh = "Страница с висячей строкой";
                //myShowPage(SearchWidAndOrh);

                myInfoArray = [];
                myContainerId = []; // тут будут собраны уникальные идентификаторы фреймов, в которых есть висячие строки
                myContainerOnPage = []; // тут будут собраны уникальные идентификаторы фреймов, по одному на каждую страницу. Этого достаточно для выбора фрейма и перехода на страницу, где этот фрейм
                myPages = [];
                while (myInfoArray.length > 0) myInfoArray.shift();
                while (myContainerId.length > 0) myContainerId.shift();
                while (myContainerOnPage.length > 0) myContainerOnPage.shift();
                while (myPages.length > 0) myPages.shift();
                while (myProblemPages.length > 0) myProblemPages.shift();
            }
            exit();
            ////////////////
        } // WidowAndOrphan.value == true
        ////
        if (WrHdSearch.value == true) { // WrHdSearch.value == true
            if (myFirstProcFileName != app.documents[0].name) {
                alert("Список стилей сформирован для другого открытого ранее файла, поэтому этой опцией можно воспользоваться только после повторного запуска скрипта с этим файлом.\nДругие опции программы по-прежнему доступны.", programTitul);
                ResetAllButtons();
                myOKButon.enabled = false;
                return;
            }
            win.hide();
            myInfoArray = SearchBottomHeader();
            var myInfoArrayLength = myInfoArray.length;
            for (var j = 0; j < myInfoArrayLength; j++) { // j++
                myPages[j] = myInfoArray[j].split(",")[0];
                myContainerId[j] = myInfoArray[j].split(",")[1];
            } // j++
            ArrSize = myPages.length;
            if (ArrSize == 0) {
                alert("В выбранном тексте внизу полос не найден заголовок указанного стиля.", programTitul);
                mySel.select();
                win.show();
                return;
            }
            ProblemPagesAndContainers();
            myShowPage("Страница с заголовком внизу полосы");
            ////////////////
        } // WrHdSearch.value == true
        ////
        if (BadHyphenInSpread.value == true) { // BadHyphenInSpread.value == true
            win.hide();
            try { app.documents[0].characterStyles.item("DiscretionaryHyphen").name; } catch (e) { app.documents[0].characterStyles.add({ name: "DiscretionaryHyphen" }); }
            myInfoArray = BrokenLinesProcessing();
            var myInfoArrayLength = myInfoArray.length;
            for (var j = 0; j < myInfoArrayLength; j++) { // j++
                myPages[j] = myInfoArray[j].split(",")[0];
                myContainerId[j] = myInfoArray[j].split(",")[1];
            } // j++
            ArrSize = myPages.length;
            if (ArrSize == 0) {
                alert("Строки с переносом слова на другую страницу не найдены.", programTitul);
                mySel.select();
                win.show();
                return;
            }
            ProblemPagesAndContainers();
            var SearchWidAndOrh = "";
            //app.documents[0].documentPreferences.facingPages == true ? SearchWidAndOrh = "Просмотр разворотов, где есть перенос в последней строке правой страницы" : SearchWidAndOrh = "Просмотр страниц, где есть перенос в последней строке";      
            app.documents[0].documentPreferences.facingPages == true ? SearchWidAndOrh = "Просмотр разворотов с переносом в последней строке правой страницы" : SearchWidAndOrh = "Просмотр страниц, где есть перенос в последней строке";
            myShowPage(SearchWidAndOrh);
            ////////////////
        } // BadHyphenInSpread.value == true
        ////
        if (OneWord.value == true) { // OneWord.value == true
            win.hide();
            myInfoArray = OneWordProcessing();
            var myInfoArrayLength = myInfoArray.length;
            for (var j = 0; j < myInfoArrayLength; j++) { // j++
                myPages[j] = myInfoArray[j].split(",")[0];
                myContainerId[j] = myInfoArray[j].split(",")[1];
            } // j++
            ArrSize = myPages.length;
            /*if (ArrSize == 0) {
                // alert ("В выбранном тексте нет абзацев с одним словом в последней строке." ,programTitul);
                alert("В выбранном тексте нет абзацев с короткой последней строкой.", programTitul);
                mySel.select();
                win.show();
                return;
            }*/
            //ProblemPagesAndContainers();
            var SearchOneWord = "Найденные абзацы с короткой последней строкой";
            //myShowPage(SearchOneWord);
        } // OneWord.value == true
        ////
        if (partHE.value == true) { // partHE.value == true
            win.hide();
            myInfoArray = SearchPartHE();
            var myInfoArrayLength = myInfoArray.length;
            for (var j = 0; j < myInfoArrayLength; j++) { // j++
                myPages[j] = myInfoArray[j].split(",")[0];
                myContainerId[j] = myInfoArray[j].split(",")[1];
            } // j++
            ArrSize = myPages.length;
            if (ArrSize == 0) {
                alert("В выбранном тексте нет строк с частицей НЕ в конце строки, начала слова НЕ- в конце строки или конца слова -НЕ в начале строки также не найдено.", programTitul);
                mySel.select();
                win.show();
                return;
            }
            ProblemPagesAndContainers();
            var SearchOneWord = "Результаты поиска частицы НЕ в конце строки и слов с переносами НЕ- или -НЕ";
            myShowPage(SearchOneWord);
        } // partHE.value == true
        ////
        if (DefisMinusTire.value == true) { // DefisMinusTire.value == true
            win.hide();
            myInfoArray = DefisMinusTireProcessing();
            var myInfoArrayLength = myInfoArray.length;
            for (var j = 0; j < myInfoArrayLength; j++) { // j++
                myPages[j] = myInfoArray[j].split(",")[0];
                myContainerId[j] = myInfoArray[j].split(",")[1];
            } // j++
            ArrSize = myPages.length;
            if (ArrSize == 0) {
                alert("В выбранном тексте нет абзацев, в которых в начале строк с второй по последнюю есть дефис, минус, тире или знак переноса.", programTitul);
                mySel.select();
                win.show();
                return;
            }
            ProblemPagesAndContainers();
            var SearchOneWord = "Внутриабзацные строки, начинающиеся с дефиса, минуса, тире, переноса";
            //        var SearchOneWord = "Абзацы со строками, начинающимися с дефиса, минуса, тире, переноса";
            //~      var SearchOneWord = "Внутриабзацные строки, начинающимися с дефиса, минуса или тире";
            //var SearchOneWord = "Внутриабзацные строки, начинающиеся с -, – , —";     
            myShowPage(SearchOneWord);
        } // DefisMinusTire.value == true
        ////
        function ProblemPagesAndContainers() { // ProblemPagesAndContainers
            NmbrOfRepeat = -1;
            ArrSize = myPages.length;
            for (var i = 0, j = 0; i < ArrSize; i++) { // ArrSize > 0
                /*
                    Следующая процедура учитывает случаи, когда на одной странице встречается несколько случаев наличия висячих строк. Например, многоколонники, или отдельные фреймы.
                    Предположим, поиск висячих строк вернул такой массив myPages : 1, 1, 1, 2
                    Т.е. на первой странице есть три висячих строки, и одна на второй странице.
                    В результате обработки в массиве myProblemPages будет такая информация: 1, 2
                    В массиве myContainerOnPage будут идентификаторы фреймов, размещенных на каждой из страниц, указанных в массиве myProblemPages
                    */
                if (NmbrOfRepeat == -1) { // == -1
                    myProblemPages[j] = myPages[i];
                    myContainerOnPage[j] = myContainerId[i];
                    NmbrOfRepeat++;
                    continue;
                } // == -1
                if (NmbrOfRepeat == 0) { // == 0
                    if (myPages[i] == myProblemPages[j]) { // i == j
                        NmbrOfRepeat++;
                        continue;
                    }  // i-- == j
                    else { // j++
                        j++;
                        myProblemPages[j] = myPages[i];
                        myContainerOnPage[j] = myContainerId[i];
                        continue;
                    } // j++
                } // == 0
                if (NmbrOfRepeat > 0) { // > 0
                    if (myPages[i] == myProblemPages[j]) { // [i] == [j]
                        NmbrOfRepeat++;
                        continue;
                    }  // [i--] == [j]
                    else { // else
                        NmbrOfRepeat++; // до этого момента эта переменная хранила число совпадений. Но надо учесть и первое одинаковое значение         
                        j++;
                        myProblemPages[j] = myPages[i];
                        myContainerOnPage[j] = myContainerId[i];
                        NmbrOfRepeat = 0;
                    } // else
                } // > 0
            } // ArrSize > 0
        } // ProblemPagesAndContainers
        ////
        function myShowPage(NameOfAction) { // myShowPage
            var ShowPage = new Window("palette", programTitul, undefined, { closeButton: false });
            if (ActionWinLocation[0] != -1) ShowPage.location = ActionWinLocation;
            ShowPage.alignChildren = ["fill", "fill"];
            var myBtnUp = File(decodeURI(myScriptFolder + "/Picts/" + "ArrowUp-16.png"));
            var myBtnDn = File(decodeURI(myScriptFolder + "/Picts/" + "ArrowDn-16.png"));
            var myBtnDel = File(decodeURI(myScriptFolder + "/Picts/" + "DelBtn.png"));
            myMess = ShowPage.add("statictext", undefined, NameOfAction);
            separator_1 = ShowPage.add("panel"); // Помещаем на экран горизонтальную линию.  Для программы этот параметр высота, но по сути это ширина линии
            separator_1.minimumSize.height = separator_1.maximumSize.height = 1;
            var ShowTools = ShowPage.add("group");
            ShowTools.orientation = "row";
            ShowTools.alignChildren = ["fill", "fill"];
            var myProblemPagesLength = myProblemPages.length;
            var StartInd = 1;
            InfoFieldLine = StartInd + "/" + myProblemPagesLength;
            var InfoPanel = ShowTools.add("panel");
            var InfoField = InfoPanel.add("statictext", undefined, InfoFieldLine);
            InfoField.characters = 10;
            if (!HelpMessage.value) InfoField.helpTip = "Тут нет данных о числе найденных одиночных слов, висячих строк и пр.\nИнформация о текущем отображении страницы — её номер в списке найденных страниц / общее число таких страниц";
            else InfoField.helpTip = "";
            //try { var myUpButton = ShowTools.add("iconbutton", [0,0,25,25], myBtnUp); } catch (e) { var myUpButton = ShowTools.add ("button", [0,0,25,25], "Up"); } 
            var myUpButton = makeImageButton(myBtnUp, true, buttonInsets, ShowTools, myUpButtonOnClick);
            if (!HelpMessage.value) myUpButton.helpTip = "Перемещение на предыдущую страницу";
            else myUpButton.helpTip = "";
            if (BadHyphenInSpread.value == true) { // BadHyphenInSpread.value == true
                var myBtnKeepWord = File(decodeURI(myScriptFolder + "/Picts/" + "RingChain.png"));
                //try { var myButtonKeepWord = ShowTools.add("iconbutton", [0,0,25,25], myBtnKeepWord); } catch (e) { var myButtonKeepWord = ShowTools.add ("button", [0,0,25,25], "<<"); }  
                var myButtonKeepWord = makeImageButton(myBtnKeepWord, true, buttonInsets, ShowTools, myButtonKeepWordOnClick);
                if (!HelpMessage.value) myButtonKeepWord.helpTip = "При щелчке на этой кнопке перед последним словом страницы ставится дискреционный перенос. В результате это слово или втягивается на текущую страницу, или уходит на следующую.";
                else myButtonKeepWord.helpTip = "";
                ///
                //myButtonKeepWord.onClick = function() { // myButtonKeepWord.onClick      
                function myButtonKeepWordOnClick() { // myButtonKeepWord.onClick              
                    var myLocalIndx = app.documents[0].pageItems.itemByID(Number(myContainerOnPage[StartInd - 1])).words[-1].index;
                    if (app.documents[0].pageItems.itemByID(Number(myContainerOnPage[StartInd - 1])).words[-1].fillColor.name != "MakeupColor") { // != MakeupColor
                        alert("Последнее слово не окрашено цветом 'MakeupColor'.\nПохоже, в результате предыдущей правки произошёл сдвиг строк. Это может быть причиной появления висячих строк.", ScriptName);
                        return;
                    } // != MakeupColor
                    var FirstCharPage, LastCharPage;
                    parseIntAppVersion == 6 ? FirstCharPage = app.documents[0].pageItems.itemByID(Number(myContainerOnPage[StartInd - 1])).words[-1].characters[0].parentTextFrames[0].parent.name : FirstCharPage = app.documents[0].pageItems.itemByID(Number(myContainerOnPage[StartInd - 1])).words[-1].characters[0].parentTextFrames[0].parentPage.name;
                    parseIntAppVersion == 6 ? LastCharPage = app.documents[0].pageItems.itemByID(Number(myContainerOnPage[StartInd - 1])).words[-1].characters[-1].parentTextFrames[0].parent.name : LastCharPage = app.documents[0].pageItems.itemByID(Number(myContainerOnPage[StartInd - 1])).words[-1].characters[-1].parentTextFrames[0].parentPage.name;
                    if (app.documents[0].pageItems.itemByID(Number(myContainerOnPage[StartInd - 1])).parentStory.insertionPoints[myLocalIndx].contents != myDiscretionaryHyphen && FirstCharPage != LastCharPage) { // != myDiscretionaryHyphen && FirstCharPage != LastCharPage
                        app.documents[0].pageItems.itemByID(Number(myContainerOnPage[StartInd - 1])).parentStory.insertionPoints[myLocalIndx].contents = myDiscretionaryHyphen;
                        app.documents[0].pageItems.itemByID(Number(myContainerOnPage[StartInd - 1])).parentStory.characters[myLocalIndx].appliedCharacterStyle = app.documents[0].characterStyles.item("DiscretionaryHyphen");
                    } // != myDiscretionaryHyphen && FirstCharPage != LastCharPage
                    // эта проверка сделана на случай, если ранее уже поставлен знак, а проверка пошла по новому кругу
                } // myButtonKeepWord.onClick
                ///
            } // BadHyphenInSpread.value == true  
            // try { var myDnButton = ShowTools.add("iconbutton", [0,0,25,25], myBtnDn); } catch (e) { var myDnButton = ShowTools.add ("button", [0,0,25,25], "Dn"); }
            var myDnButton = makeImageButton(myBtnDn, true, buttonInsets, ShowTools, myDnButtonOnClick);
            if (!HelpMessage.value) myDnButton.helpTip = "Перемещение на следующую страницу";
            else myDnButton.helpTip = "";
            //try { var myDelButton = ShowTools.add("iconbutton", [0,0,25,25], myBtnDel); } catch (e) { var myDelButton = ShowTools.add ("button", [0,0,25,25], "X"); }
            var myDelButton = makeImageButton(myBtnDel, true, buttonInsets, ShowTools, myDelButtonOnClick);
            if (!HelpMessage.value) myDelButton.helpTip = "Завершение просмотра";
            else myDelButton.helpTip = "";
            //try { var myShortInfo = ShowTools.add("iconbutton", [0,0,33,25], myInfo); } catch (e) { var myShortInfo = ShowTools.add ("button", [0,0,33,25], "Info"); }
            var myShortInfo = makeImageButton(myInfo, true, buttonInsets, ShowTools, myShortInfoOnClick);
            if (!HelpMessage.value) myShortInfo.helpTip = "Информация о программе";
            else myShortInfo.helpTip = "";
            app.documents[0].pageItems.itemByID(Number(myContainerOnPage[0])).select();
            parseIntAppVersion == 6 ? app.activeWindow.activePage = app.selection[0].parent : app.activeWindow.activePage = app.selection[0].parentPage;
            app.documents[0].layoutWindows[0].zoom(ZoomOptions.FIT_SPREAD);
            app.documents[0].select(NothingEnum.nothing);

            //myDelButton.onClick = function() { //  myDelButton.onClick
            function myDelButtonOnClick() { //  myDelButton.onClick        
                ActionWinLocation = ShowPage.location;
                ShowPage.close();
                mySel.select();
                win.show();
            } //  myDelButton.onClick
            ///////
            //myDnButton.onClick = function() { //  myDnButton.onClick
            function myDnButtonOnClick() { //  myDnButton.onClick        
                StartInd++;
                if (StartInd > myProblemPagesLength) { // StartInd > myProblemPagesLength
                    for (var ii = 0; ii < 3; ii++) { // ii++ 
                        InfoFieldLine = "<<#>>";
                        InfoField.text = InfoFieldLine;
                        $.sleep(300);   // 300 ms timer
                        InfoFieldLine = "######";
                        InfoField.text = InfoFieldLine;
                        $.sleep(300);   // 300 ms timer           
                    } // i++
                    StartInd = 1;
                } // StartInd > myProblemPagesLength
                //InfoFieldLine = StartInd +"/" + myProblemPagesLength + " # " + myProblemPages[StartInd-1];
                InfoFieldLine = StartInd + "/" + myProblemPagesLength;
                InfoField.text = InfoFieldLine;
                app.documents[0].pageItems.itemByID(Number(myContainerOnPage[StartInd - 1])).select();
                parseIntAppVersion == 6 ? app.activeWindow.activePage = app.selection[0].parent : app.activeWindow.activePage = app.selection[0].parentPage;
                app.documents[0].layoutWindows[0].zoom(ZoomOptions.FIT_SPREAD);
                app.documents[0].select(NothingEnum.nothing);
            }  //  myDnButton.onClick
            //////
            //myUpButton.onClick = function() { //  myUpButton.onClick
            function myUpButtonOnClick() { //  myUpButton.onClick        
                StartInd--;
                if (StartInd == 0) { // StartInd == 0
                    for (var ii = 0; ii < 3; ii++) { // ii++ 
                        InfoFieldLine = "<<#>>";
                        InfoField.text = InfoFieldLine;
                        $.sleep(300);   // 300 ms timer
                        InfoFieldLine = "######";
                        InfoField.text = InfoFieldLine;
                        $.sleep(300);   // 300 ms timer     
                    } // i++          
                    StartInd = myProblemPagesLength;
                } // StartInd == 0
                InfoFieldLine = StartInd + "/" + myProblemPagesLength;
                InfoField.text = InfoFieldLine;
                app.documents[0].pageItems.itemByID(Number(myContainerOnPage[StartInd - 1])).select();
                parseIntAppVersion == 6 ? app.activeWindow.activePage = app.selection[0].parent : app.activeWindow.activePage = app.selection[0].parentPage;
                app.documents[0].layoutWindows[0].zoom(ZoomOptions.FIT_SPREAD);
                //app.documents[0].select(NothingEnum.nothing);
            }  //  myUpButton.onClick
            //////
            HelpLastLineHyphenated = "«Поиск переносов в последней строке страницы/разворота»\nНазвание этой процедуры поиска изменяется в зависимости от того, где выполняется поиск — на странице или на развороте. При работе с разворотом отмечаются только переносы в последней строке правой страницы, т.к. в случае переноса с левой страницы на правую видны одновременно обе части слова, и дискомфорта при чтении не возникает.\nС переносом в последней строке можно при желании расстаться: щелчок на пиктограмме ‘цепь’ ставит перед последним словом на странице дискреционный перенос. В результате это слово или будет втянуто на текущую страницу, или переместится на следующую. Очень редко, но бывает, что после этого перемещения слова на том же месте появится другое слово с переносом. С ним надо поработать отдельно. Другой возможный случай — после обработки переноса из-за втяжки или разгонки изменяется число строк, что может стать причиной появления висячих строк. Скрипт сообщит об этом изменении числа строк, возникшем на предыдущем  шаге обработки. Как вариант решения этой ситуации — откатить на предыдущий шаг, отменив обработку переноса, и попробовать как-то иначе решить эту задачу. Все дискреционные переносы, добавленные этим скриптом, отмечены символьным стилем “DiscretionaryHyphen”, и при необходимости их можно все удалить, например, если книга делается ещё и в формате ePub."
            HelpInfo = "Программа ищет «неблагополучные случаи вёрстки» или во всей статье, или в выделенном тексте. В процессе поиска создается массив номеров страниц, на которых есть по крайней мере одна требующая внимания ситуация. Уточнение «по крайней мере» — это учёт того, что в многоколоннике, например, висячих строк может быть несколько, но запомнена такая страница будет только один раз.\nТребующие внимания строки на время работы скрипта окрашиваются красным цветом. После завершения работы скрипта этот именованный цвет будет удалён, и текст перекрасится в чёрный цвет. Если ищутся висячие строки, абзацы с короткой последней строкой, то предполагается, что пользователь примет решение по избавлению от таких строк; а окрашивание последних строк абзацев с почти полными строками — это визуальное информирование, какие абзацы были выключены на полный формат. \nПереход по страницам выполняется при помощи стрелок вверх и вниз. Перемещение по списку закольцовано: при достижении начала или конца списка в окне отображения информации о текущей странице трижды мигнут строки '<<#>>' и '######', а затем отобразится конец или начало списка. При работе с висячими строками целесообразно идти по тексту от начала к концу. В других случаях, например, при обработке абзацев с короткой последней строкой лучше идти от конца к началу: если короткое слово будет втянуто, это не повлияет на перетекание предыдущих строк.\nОкно просмотра можно перемещать, и его размещение на экране, в котором была нажата кнопка завершения работы, будет запомнено. При очередном просмотре окно откроется на этом месте.";
            //myShortInfo.onClick = function() { //  myShortInfo.onClick
            function myShortInfoOnClick() { //  myShortInfo.onClick        
                myShortInfo.helpTip = "";  // чтобы это сообщение не появлялось поверх информационного окна во время отображения справки
                if (BadHyphenInSpread.value == true) alert(HelpLastLineHyphenated, programTitul);
                else alert(HelpInfo, programTitul);
                myShortInfo.helpTip = "Информация о программе";
            } //  myShortInfo.onClick
            //////
            //return;
            //ShowPage.show();
        }  // myShowPage
        ////
        //} // myOKButon.onClick 
        //////////////////////////
        function getPreviousPara(text) {
            return text.parent.characters.item(text.paragraphs[0].index - 1).paragraphs[0];
        }

        function WidowAndOrphanProcessing() { // WidowAndOrphanProcessing
            //changed
            app.documents[0].pages[0].textFrames[0].parentStory.texts.everyItem().select();
            var myStory = app.selection[0];
            var InfoLine = "";
            var myPages = [];
            while (myPages.length > 0) myPages.shift();
            TestFramesOnPasteboard();
            ff = 1;
            //$.bp(ff==1);
            //var pBar = new ProgressBar(programTitul);
            //pBar.reset(" Поиск висячей строки в выбранном тексте", myStory.textColumns.length);
            for (var i = 1; i < myStory.textColumns.length; i++) { // myStory.textColumns.length	 
                var myCurrentColumn = myStory.textColumns[i];
                var myPreviousColumn = myStory.textColumns[i - 1];
                if ((myCurrentColumn.characters.length < 3) || (myPreviousColumn.characters.length < 3)) continue; // на случай, если в цепочке есть пустые фреймы
                var myFirstCharInBottomLine = myPreviousColumn.lines.lastItem().characters[0].index; // индекс первого символа нижней строки предыдущей колонки
                var myFirstCharInTopLine = myCurrentColumn.lines.firstItem().characters[0].index; // индекс первого символа первой строки текущей колонки
                var myLastCharInTopLine = myCurrentColumn.lines.firstItem().characters.lastItem().index; // индекс последнего символа первой строки текущей колонки
                myCurrentColumn.lines.firstItem().characters[0].select();
                var myP = app.selection[0].paragraphs[0]; // myP -- ссылка на абзац, у которого по крайней мере один символ размещен в первой строке текущего фрейма
                var myParaFirst = myP.characters.firstItem().index;
                var myParaLast = myP.characters.lastItem().index;

                /*if (myP.tracking > -35) {
                    myP.tracking = myP.tracking - 5;
                }

                if (myP.tracking == -35 && timesProcessed == 7) {
                    myP.tracking = 0;
                }*/

                if (myP.length < 4) continue;

                if (myFirstCharInTopLine == myParaFirst) continue;	// абзац начинается с первой строки текущей колонки
                if (myFirstCharInBottomLine == myParaFirst) { // обнаружена висячая строка внизу полосы    
                    if (getPreviousPara(app.selection[0]).tracking > -35) {
                        getPreviousPara(app.selection[0]).tracking = getPreviousPara(app.selection[0]).tracking - 5;
                    }

                    if (getPreviousPara(app.selection[0]).tracking == -35 && timesProcessed == 7) {
                        getPreviousPara(app.selection[0]).tracking = 0;
                    }

                    // окрасим её:
                    //if (UseColor.value == true) { // UseColor.value
                    //myPreviousColumn.lines.lastItem().fillColor = app.documents[0].colors.item("MakeupColor");
                    //    } // UseColor.value
                    InfoLine = "," + myP.characters.firstItem().parentTextFrames[0].id;
                    parseIntAppVersion == 6 ? myPages.push(myPreviousColumn.parentTextFrames[0].parent.name + InfoLine) : myPages.push(myPreviousColumn.parentTextFrames[0].parentPage.name + InfoLine);
                    // номер страницы с этой полосой сохранен в массиве плюс информация об идентификаторе фрейма
                    break;
                }  // обнаружена висячая строка внизу полосы
                if (myLastCharInTopLine == myParaLast) { // обнаружена висячая строка вверху полосы
                    if (myP.tracking > -35) {
                        myP.tracking = myP.tracking - 5;
                    }

                    if (myP.tracking == -35 && timesProcessed == 7) {
                        myP.tracking = 0;
                    }
                    // окрасим её:
                    // if (UseColor.value == true) { // UseColor.value            
                    //myCurrentColumn.lines.firstItem().fillColor = app.documents[0].colors.item("MakeupColor");
                    //    } // UseColor.value            
                    InfoLine = "," + myP.characters.lastItem().parentTextFrames[0].id;
                    parseIntAppVersion == 6 ? myPages.push(myCurrentColumn.parentTextFrames[0].parent.name + InfoLine) : myPages.push(myCurrentColumn.parentTextFrames[0].parentPage.name + InfoLine);
                    // номер страницы с этой полосой сохранен в массиве плюс информация об идентификаторе фрейма
                    break;
                }  // обнаружена висячая строка вверху полосы

            } //myStory.textColumns.length
            //$.bp(ff==1);
            return myPages;
        } // WidowAndOrphanProcessing
        ////
        function SearchBottomHeader() { // SearchBottomHeader
            var myStory = app.selection[0];
            var InfoLine = "";
            var myPages = [];
            var StyleForSearch = String(ParaStyleList.selection);
            while (myPages.length > 0) myPages.shift();
            TestFramesOnPasteboard();
            //var pBar = new ProgressBar(programTitul);
            //pBar.reset(" Поиск заголовка внизу полосы", myStory.textColumns.length);
            for (var i = 0; i < myStory.textColumns.length; i++) { // myStory.textColumns.length	 
                var myCurrentColumn = myStory.textColumns[i];
                var myBottomLine = myCurrentColumn.lines.lastItem(); // последняя строка текущей колонки
                if (myBottomLine.length < 3) continue;
                var myFirstCharInBottomLine = myBottomLine.characters[0]; // первый символ последней строки
                if (myFirstCharInBottomLine.appliedParagraphStyle.name == StyleForSearch) { //  == ParaStyleList.selection
                    InfoLine = "," + myFirstCharInBottomLine.parentTextFrames[0].id;
                    myBottomLine.fillColor = app.documents[0].colors.item("MakeupColor");
                    parseIntAppVersion == 6 ? myPages.push(myCurrentColumn.parentTextFrames[0].parent.name + InfoLine) : myPages.push(myCurrentColumn.parentTextFrames[0].parentPage.name + InfoLine);
                    // номер страницы с этой полосой сохранен в массиве плюс информация об идентификаторе фрейма
                    break;
                }   //  == ParaStyleList.selection
            } //myStory.textColumns.length
            return myPages;
        } // SearchBottomHeader
        ////
        function BrokenLinesProcessing() { // BrokenLinesProcessing
            var myStory = app.selection[0];
            var InfoLine = "";
            var myPages = [];
            while (myPages.length > 0) myPages.shift();
            TestFramesOnPasteboard();
            app.documents[0].documentPreferences.facingPages == true ? myDocIsSpread = true : myDocIsSpread = false;
            //var pBar = new ProgressBar(programTitul);
            //pBar.reset(" Поиск слов с переносом в последней строке страницы", myStory.textColumns.length);
            //цикл по числу колонок статьи. Движение сверху вниз
            for (var i = 0; i < myStory.textColumns.length - 1; i++) { // i < myStory.textColumns.length		
                // в цикле в условии окончания 'myStory.textColumns.length - 1' указана '-1', т.к. не надо анализировать перенос в последнем слове последнего фрейма.
                myCurrentColumn = myStory.textColumns[i]; // ссылка на очередную колонку
                myNextColumn = myStory.textColumns[i + 1]; // ссылка на следующую  колонку 
                parseIntAppVersion == 6 ? myPageOfCurrColumn = myCurrentColumn.parentTextFrames[0].parent.name : myPageOfCurrColumn = myCurrentColumn.parentTextFrames[0].parentPage.name;
                parseIntAppVersion == 6 ? myPageOfNextColumn = myNextColumn.parentTextFrames[0].parent.name : myPageOfNextColumn = myNextColumn.parentTextFrames[0].parentPage.name;
                if (myPageOfCurrColumn == myPageOfNextColumn) continue; // если колонки на одной странице, повторяем цикл
                if (myDocIsSpread == true) { // myDocIsSpread == true
                    if (myPageOfCurrColumn % 2 == 0) { // == 0, если текстовый фрейм на четной, т.е. левой полосе
                        continue;
                    }  // == 0, если текстовый фрейм на четной, т.е. левой полосе
                } // myDocIsSpread == true
                // В случае многоколонника перед тем, как запрещать перенос последнего слова в колонке, надо убедиться, что это слово действительно последнее на этой странице.
                try { var myLastWordInCurrentColumn = myCurrentColumn.words[-1].contents; } // последнее слово в текущей колонке
                catch (e) { continue; }
                try { var myFirstWordInNextColumn = myNextColumn.words[0].contents; } // первое слово в следующей колонке
                catch (e) { continue; }
                // если слово переносится, то myLastWordInCurrentColumn и myFirstWordInNextColumn совпадают. Критерий совпадения -- равенство индексов слов в статье.
                var myIndexOfLastWordInCurrentColumn = myCurrentColumn.words[-1].index;
                var myIndexOfFirstWordInNextColumn = myNextColumn.words[0].index;
                if (myIndexOfLastWordInCurrentColumn != myIndexOfFirstWordInNextColumn) continue;
                // окрасим её:
                //if (UseColor.value == true) { // UseColor.value
                myCurrentColumn.lines.lastItem().fillColor = app.documents[0].colors.item("MakeupColor");
                //    } // UseColor.value    
                InfoLine = "," + myCurrentColumn.lines.lastItem().parentTextFrames[0].id;
                parseIntAppVersion == 6 ? myPages.push(myCurrentColumn.parentTextFrames[0].parent.name + InfoLine) : myPages.push(myCurrentColumn.parentTextFrames[0].parentPage.name + InfoLine);
                // номер страницы с этой полосой сохранен в массиве плюс информация об идентификаторе фрейма
            } // i < myStory.textColumns.length
            a = 0;
            ///////////////
            return myPages;
        } // BrokenLinesProcessing
        ////
        function TestFramesOnPasteboard() { // TestFramesOnPasteboard() 
            //цикл по числу колонок статьи. Цикл начинается со второй колонки
            var myPageStrart = -1;
            //var pBar = new ProgressBar(programTitul);
            //pBar.reset(" Поиск фреймов на рабочем столе в выбранной текстовой цепочке. Их быть не должно", myStory.textColumns.length);
            for (var i = 0; i < myStory.textColumns.length; i++) { // поиск фреймов на рабочем столе    
                try {
                    parseIntAppVersion == 6 ? myPageStrart = myStory.textColumns[i].parentTextFrames[0].parent.name : myPageStrart = myStory.textColumns[i].parentTextFrames[0].parentPage.name;
                }
                catch (e) {
                    //pBar.close();
                    if (myPageStrart != -1) alert("Встречен фрейм на рабочем столе.\nПоследняя страница текстовой цепочки, на которой фрейм размещён на полосе — " + myPageStrart + ".", programTitul);
                    else alert("Первый же фрейм выбранной текстовой цепочки лежит на рабочем столе.", programTitul);
                    exit();
                }
            } // поиск фреймов на рабочем столе
        } // TestFramesOnPasteboard()
        ////
        function OneWordProcessing() { //OneWordProcessing
            var myStory = app.selection[0];
            var InfoLine = "";
            var myPages = [];
            while (myPages.length > 0) myPages.shift();
            TestFramesOnPasteboard();
            //var pBar = new ProgressBar(programTitul);
            //pBar.reset(" Поиск абзацев с короткой последней строкой", myStory.paragraphs.length);
            for (var i = 1; i < myStory.paragraphs.length; i++) { // myStory.paragraphs.length
                //pBar.info(" Фреймы на рабочем столе отсутствуют. Теперь ищем абзацы с одним словом в последней строке.");			
                var myPara = myStory.paragraphs[i];
                if (myPara.lines.length == 1) continue;  // это один абзац из одной строки
                var myLastLine = myPara.lines[myPara.lines.length - 1];
                var myLastWordinPara = myLastLine.words[-1];
                if (myLastLine.words.length == 1) { // words.length == 1
                    //if (UseColor.value == true) myLastWordinPara.fillColor = "MakeupColor";
                    myLastWordinPara.fillColor = "MakeupColor";
                    InfoLine = "," + myLastWordinPara.parentTextFrames[0].id;
                    parseIntAppVersion == 6 ? myPages.push(myLastWordinPara.parentTextFrames[0].parent.name + InfoLine) : myPages.push(myLastWordinPara.parentTextFrames[0].parentPage.name + InfoLine);
                    continue;
                } // words.length == 1 
                if (myMinValueLeft == 0) continue;
                if ((myLastLine.characters[-1].horizontalOffset - myLastLine.characters[0].horizontalOffset) < myMinValueLeft) { // < myMinValueLeft
                    myLastLine.fillColor = "MakeupColor";
                    InfoLine = "," + myLastLine.parentTextFrames[0].id;
                    parseIntAppVersion == 6 ? myPages.push(myLastLine.parentTextFrames[0].parent.name + InfoLine) : myPages.push(myLastLine.parentTextFrames[0].parentPage.name + InfoLine);
                } // < myMinValueLeft
            } //myStory.paragraphs.length
            return myPages;
        } // OneWordProcessing    
        //////////////////////////
        function DefisMinusTireProcessing() { //DefisMinusTireProcessing
            var myStory = app.selection[0];
            var InfoLine = "";
            var myPages = [];
            while (myPages.length > 0) myPages.shift();
            TestFramesOnPasteboard();
            //var pBar = new ProgressBar(programTitul);
            //pBar.reset(" Поиск строк, начинающихся с дефиса, минуса, тире или знака переноса", myStory.textColumns.length);
            //pBar.info(" При поиске первые строки абзацев не рассматриваются.");
            for (var i = 0; i < myStory.textColumns.length; i++) { // myStory.textColumns.length	
                var myCurrentColumn = myStory.textColumns[i];
                var myNumberOfLines = myCurrentColumn.lines;
                //цикл по числу строк в текущей колонке    
                for (var j = 0; j < myNumberOfLines.length; j++) { // myNumberOfLines.length
                    var myLine = myCurrentColumn.lines.item(j);
                    try { var myFrstChar = myLine.characters.item(0).contents }
                    catch (e) { continue }
                    if ((myFrstChar != 1397058884) && myFrstChar != 1397059140 && myFrstChar != "-" && myFrstChar != 1397645928) continue; // 1397058884 - код тире  1397059140 - код минуса   1397645928 -- NONBREAKING_HYPHEN
                    if (myLine.characters[0] == myLine.paragraphs[0].characters[0]) continue;  // пропускаем случаи, когда строка начинается с тире диалога
                    //myLine.characters.item(0).fillColor = "MakeupColor";
                    //if (UseColor.value == true) myLine.fillColor = "MakeupColor";   
                    myLine.fillColor = "MakeupColor";
                    InfoLine = "," + myLine.parentTextFrames[0].id;
                    parseIntAppVersion == 6 ? myPages.push(myLine.parentTextFrames[0].parent.name + InfoLine) : myPages.push(myLine.parentTextFrames[0].parentPage.name + InfoLine);
                } // myNumberOfLines.length
            } // myStory.textColumns.length     
            return myPages;
        } // DefisMinusTireProcessing    
        ////////////////////////
        function SearchPartHE() { //SearchPartHE
            var myStory = app.selection[0];
            var InfoLine = "";
            var myPages = [];
            while (myPages.length > 0) myPages.shift();
            TestFramesOnPasteboard();
            // var pBar = new ProgressBar(programTitul);
            var nmbrOfLines = myStory.lines.length;
            //pBar.reset(" Поиск частицы НЕ в конце строки; поиск переносов НЕ- и -НЕ", nmbrOfLines);
            //pBar.info("");
            for (var i = 0; i < nmbrOfLines - 1; i++) { // nmbrOfLines	
                try { lineLength = myStory.lines[i].length; } catch (e) { continue }
                try { lineLength = myStory.lines[i + 1].length; } catch (e) { continue }
                var myLine1 = myStory.lines[i];
                var w1 = myLine1.words[-1];
                var myLine2 = myStory.lines[i + 1];
                var w2 = myLine2.words[0];
                try { w1i = w1.index; w2i = w2.index; } catch (e) { continue; }
                if (w1.index == w2.index) { // слово переносится
                    a = 0;
                    if ((isSelectionAspace(myLine2.characters[2]) != 0) && (w1.characters[-2].contents == 'н' || w1.characters[-2].contents == 'Н' && w1.characters[-1].contents == 'е' || w1.characters[-1].contents == 'Е')) { // перенос -НЕ                    
                        w1.fillColor = "MakeupColor";
                        InfoLine = "," + myLine2.parentTextFrames[0].id;
                        parseIntAppVersion == 6 ? myPages.push(myLine2.parentTextFrames[0].parent.name + InfoLine) : myPages.push(myLine2.parentTextFrames[0].parentPage.name + InfoLine);
                        continue;
                    }  // перенос  -НЕ
                    a = 0;
                    if ((isSelectionAspace(myLine1.characters[-3]) != 0) && (w2.characters[0].contents == 'н' || w2.characters[0].contents == 'Н' && w2.characters[1].contents == 'е' || w2.characters[1].contents == 'Е')) { // перенос  НЕ-
                        w1.fillColor = "MakeupColor";
                        InfoLine = "," + myLine2.parentTextFrames[0].id;
                        parseIntAppVersion == 6 ? myPages.push(myLine2.parentTextFrames[0].parent.name + InfoLine) : myPages.push(myLine2.parentTextFrames[0].parentPage.name + InfoLine);
                        continue;
                    } // перенос  НЕ-
                    if ((myLine1.characters[-1].contents == SpecialCharacters.DISCRETIONARY_HYPHEN && isSelectionAspace(myLine1.characters[-4]) != 0) && (w2.characters[0].contents == 'н' || w2.characters[0].contents == 'Н' && w2.characters[1].contents == 'е' || w2.characters[1].contents == 'Е')) { // перенос  НЕ-  "0x00AD"
                        //if (( isSelectionAspace(myLine2.characters[2] ) != 0) && (w2.characters[0].contents == 'н' || w2.characters[0].contents == 'Н' && w2.characters[1].contents == 'е' || w2.characters[1].contents == 'Е')) { // перенос -НЕ                    
                        w1.fillColor = "MakeupColor";
                        InfoLine = "," + myLine2.parentTextFrames[0].id;
                        parseIntAppVersion == 6 ? myPages.push(myLine2.parentTextFrames[0].parent.name + InfoLine) : myPages.push(myLine2.parentTextFrames[0].parentPage.name + InfoLine);
                        continue;
                    } // перенос  НЕ- "0x00AD"                 
                } // слово переносится
                if (w1.length == 1) continue;
                if ((w1.length == 2) && (w1.characters[0].contents == 'н' || w1.characters[0].contents == 'Н' && w1.characters[1].contents == 'е' || w1.characters[1].contents == 'Е')) { // НЕ в конце строки
                    w1.fillColor = "MakeupColor";
                    InfoLine = "," + myLine2.parentTextFrames[0].id;
                    parseIntAppVersion == 6 ? myPages.push(myLine2.parentTextFrames[0].parent.name + InfoLine) : myPages.push(myLine2.parentTextFrames[0].parentPage.name + InfoLine);
                    continue;
                }  // НЕ в конце строки       
            } // nmbrOfLines     
            return myPages;
        } // SearchPartHE  ////////////////////////
        ////
        function isSelectionAspace(mySample) { // isSelectionAspace
            SpacePosix = "[[:space:]]";
            app.findGrepPreferences = NothingEnum.nothing;
            app.changeGrepPreferences = NothingEnum.nothing;
            app.findGrepPreferences.findWhat = SpacePosix;
            myFoundSamples = mySample.findGrep();
            return myFoundSamples.length;
        } //isSelectionAspace
        return win;
    } // myScriptWindow
} // main
main();
/////////
function myFile(myFileName) {
    var myScriptFile = myGetScriptPath();
    var myScriptFolder = decodeURI(myScriptFile.path);
    var myFilePath = decodeURI(myScriptFolder + "/" + myFileName);
    return myFilePath;
} //myFile
//
function myGetScriptPath() {
    try {
        return app.activeScript;
    }
    catch (myError) {
        return File(myError.fileName);
    }
} //myGetScriptPath()
////
// В индизайне СС2015 что-то улучшили, и в результате картинка, помещенная в кнопку инструкцией "iconbutton", оказалась сдвинутой вправо.
// Поэтому был долгий поиск, как обойти эту ситуацию.
// идея найдена тут: http://www.indiscripts.com/post/2011/04/sprite-buttons-in-scriptui
////
/// Функция makeImageButton - сделана на базе этого скрипта Марка Аутрета.
// imageButton = makeImageButton (myPngButton, buttonBorder, buttonInset, winLink, imageButtonAction)
// myPngButton -- имя файла с видом кнопки,
// buttonBorder -- если true, вокруг рисунка нужна рамка
// borderInset -- величина отступа вокруг картинки кнопки (отступ будет добавлен, даже если buttonBorder = false)
// winLink -- объект в описании окна, с которым будет связана эта кнопка
// imageButtonAction -- название функции, которая будет выполнена при щелчке на кнопке.
//=-
// imageButton -- процедура возвращает ссылку на созданную кнопку
///
// Таким образом, это уже готовый программный модуль.
// Ниже есть пример его применения.
///
// Цвета фона выбранной кнопки и фона, когда курсор выходит за границу кнопки
//~ defSelColor = [.65,.65,.65, 1]; // цвет фона кнопки, когда в её пространстве окажется курсор. Первые три числа: RGB, 0 - мин, 1 - макс.
//~ defBgColor = [.9,.9,.9, 1]; // цвет, который приобретёт фон кнопки, когда курсор покинет её пространство. 

function makeImageButton(myPngButton, buttonBorder, buttonInset, winLink, imageButtonAction) { // makeImageButton

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
    winImageButton.margins = buttonInset;
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
function getParaStyleList(myParaStyleNames) { // getParaStyleList
    var myParagraphStyles = app.activeDocument.allParagraphStyles;
    var myParagraphStyleName, obj;
    for (var i = 0; i < myParagraphStyles.length; i++) {
        myParagraphStyleName = myParagraphStyles[i].name;
        obj = myParagraphStyles[i];
        while (obj.parent instanceof ParagraphStyleGroup) {
            myParagraphStyleName = obj.parent.name + ":" + myParagraphStyleName;
            obj = obj.parent;
        }
        myParaStyleNames.push(myParagraphStyleName);
    } // for
    myParaStyleNames.shift(); // удаление стиля No Paragraph Style
} // getParaStyleList
///////////////////////////////
//  myMinValueRight -- допустимое расстояние между последним знаком абзаца и правым краем полосы. /
//   myMinValueLeft   --  минимальная длина текста в последней строке абзаца
/* предусмотреть проверку на адекватность ввода данных */


// myBtnSel = true -- обрабатываются только параграфы, абзацный стиль которых совпадает со стилем абзаца, в котором стоит курсор. = false -- обрабатывается весь текст.
