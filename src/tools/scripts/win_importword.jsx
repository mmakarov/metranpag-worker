try {
    app.doScript(arguments[2], 1246973031); //import word
    app.doScript(arguments[2].substring(0, arguments[2].lastIndexOf("/"))+"/setstyles.jsx", 1246973031); //set styles
} catch (e) {
    alert(e);
}