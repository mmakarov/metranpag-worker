// InDesign CS6, CC+
// © Иванюшин М.Ю., 2018  ivanyushin#yandex.ru

#targetengine "footnotecontrol" 

myBinFileName = "FootnoteControl.jsxbin";
var myScriptFile = myGetScriptPath();
var myScriptFolder = decodeURI(myScriptFile.path);
var myFilePath = decodeURI(myScriptFolder + "/BIN/" + myBinFileName); 
var mySetFile = new File (myFilePath);
if (!mySetFile.exists) { // !.exists
    alert("Не найден файл " + myBinFileName);
    exit();
    } // !.exists
app.doScript(mySetFile);
///////
function myGetScriptPath() { //myGetScriptPath()
	try{
		return app.activeScript;
	}
	catch(myError){
		return File(myError.fileName);
	}
} //myGetScriptPath()
/////////
