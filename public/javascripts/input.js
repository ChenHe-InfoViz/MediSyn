document.onkeydown = keyDown;

function keyDown(e)
{
   var evtobj = window.event? event : e;
   if (evtobj.keyCode == 90 && evtobj.ctrlKey) {
    //alert("Ctrl+z");
    var obj = actionStack.pop();
    cancelAction(obj)
 }
}

function cancelAction(obj){
   console.log("cancel");
   d3.select(obj.objFore).attr(obj.attr, obj.state);
   d3.select(obj.objBack).attr(obj.attr, obj.state);
   paraRecoverDrug(obj.drug);
}
