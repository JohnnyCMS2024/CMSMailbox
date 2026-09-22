// Generic drag-to-move behavior for popup windows: dragElement() wires mouse-based dragging (by
// header if present), touchDragElement() wires the touch-based equivalent.
var touchList = [];

function touchDragElement(elmntID) {
    try {
        var elmnt = (document.getElementById(elmntID + "_hdr")) ?
            document.getElementById(elmntID + "_hdr") :
            document.getElementById(elmntID);

        elmnt.setAttribute("ontouchstart", "touchDragElement_START()");
        elmnt.setAttribute("ontouchmove", "touchDragElement_MOVE(event)");
        elmnt.setAttribute("ontouchend", "touchDragElement_END(event, '" + elmntID + "')");
    } catch (ex) {
        c_log(ex);
    } 
}
function touchDragElement_START() {
    c_log("start drag & drop by touch");
    touchList = jparse("[]");
}
function touchDragElement_MOVE(ev) {
    ev.preventDefault();
    //collect x,y locations
    touchList.push({
        x: ev.changedTouches[event.changedTouches.length - 1].clientX,
        y: ev.changedTouches[event.changedTouches.length - 1].clientY
    });
}
function touchDragElement_END(ev, elmntID) {
    var elmnt = document.getElementById(elmntID);
    try {
        c_log("end drag & drop by touch");

        var divPosX = elmnt.offsetLeft;
        var divPosY = elmnt.offsetTop;
        var tchPosX = touchList[0]["x"];
        var tchPosY = touchList[0]["y"];
        var enTchPosX = touchList[touchList.length - 1]["x"];
        var enTchPosY = touchList[touchList.length - 1]["y"];

        if (enTchPosX > tchPosX) { elmnt.style.left = (divPosX + (enTchPosX - tchPosX)) + "px"; }
        else { elmnt.style.left = (divPosX - (tchPosX - enTchPosX)) + "px"; }
        if (enTchPosY > tchPosY) { elmnt.style.top = (divPosY + (enTchPosY - tchPosY)) + "px"; }
        else { elmnt.style.top = (divPosY - (tchPosY - enTchPosY)) + "px"; }
    } catch (e) {
        //do nothing
    }
    touchList = jparse("[]");
}

function dragElement(elmnt) {
    touchDragElement(elmnt.id);
    //c_log(elmnt);

    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "_hdr")) {
        // if present, the header is where you move the DIV from:
        c_log("draggable header found: " + elmnt.id + "_hdr");
        document.getElementById(elmnt.id + "_hdr").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        c_log("no draggable header found: " + elmnt.id + "_hdr");
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

        var fileOptions = document.getElementById("fileOptions");
        //var optWindow = document.getElementById("optWindow");
        if (elmnt == fileOptions) {
            foPosX = elmnt.style.left;
            foPosY = elmnt.style.top;
        }
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
        var top = elmnt.style.top.replace("px", "") * 1;
        elmnt.style.top = ((top < 0) ? 0 : top) + "px";
    }
}