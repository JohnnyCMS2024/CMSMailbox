// Core popup-window infrastructure: PopUp() builds/opens a draggable modal, closePopUp/renewPopUp
// manage its lifecycle, PopOut spawns a separate browser window (see wwwroot/js/popout.js), and
// popupList renders a simple list-selection popup.
var MainContainer = "PageContainer";
var jsPopUps = [], ixPopUps = -1, numPopups = 0;
var cancelPopUpFocus = false;

// ============================================================
// SECTION: popup lifecycle (open/focus/renew/close), PopOut window launch, list-selection popup
// ============================================================
function removeElem(strElem) {
    try {
        var elem = document.getElementById(strElem);
        document.getElementById(elem).parentNode.removeChild(elem);
    } catch (e) {}
}

function closeEmptyPopups() {
    var x = document.getElementsByClassName("PopUp");
    for (var i = 0; i < x.length; i++) {
        var id = x[i].id;
        var ix = id.split("_")[1];
        var xx = document.getElementById("PopUp_" + ix);
        if (xx.innerHTML = "") {
            xx.parentElement.removeChild(xx);
            jsPopUps = jsPopUps.filter(d => d.ix != ix);
        }
    }
}

function PopUpOpt(main, btn, clear) {
    try {
        var opts = main.id.replace("Contents", "Opts");
        console.log("njs 29", main.id, document.getElementById(opts), btn);

        if (clear) opts.innerHTML = "";

        nsection(opts, [
            "label|style=width:10px", btn
        ]);
    } catch (ex) {
        console.log("njs 34", ex);
    }
}

function PopUpFocus(ix) {
    try {
        c_log("popupfocus", ix);
        if (!cancelPopUpFocus) {
            var js = jsPopUps, zindex = 3500;
            if (js.length > 0) {
                sortJS(js, "ZIndex", true);
                zindex = js[0]["ZIndex"] + 10;
            }
            var x = jsPopUps.findIndex(d => d.ix == ix);
            if (x > -1) {
                jsPopUps[x]["ZIndex"] = zindex;
                if (document.getElementById("PopUp_" + ix) != null) {
                    document.getElementById("PopUp_" + ix).style.zIndex = zindex;
                }
            }
        }
    } catch (ex) {

    }

    cancelPopUpFocus = false;
}

function renewPopUp(Title) {
    var xx = jsPopUps.filter(d => d.Title == Title);

    var div = null;
    if (xx.length > 0) { div = xx[0]["Div"] }
    var Data, AppendTitle, Scroll, HeightWidth;

    if (div != null) {//close if already open
        var Data = xx[0]["Data"];
        var AppendTitle = xx[0]["AppendTitle"];
        var Scroll = xx[0]["Scroll"];
        var HeightWidth = xx[0]["HeightWidth"];
        var iMC = xx[0]["MC"];
        var dontMove = xx[0]["dontMove"];

        jsPopUps = jsPopUps.filter(d => d.Div != div);
        var mc = document.getElementById(div);
        console.log(mc);
        mc.parentElement.removeChild(mc);

        console.log(jsPopUps);
        console.log(Title, Data, AppendTitle, Scroll, HeightWidth, iMC, dontMove);
        PopUp(Title, Data, AppendTitle, Scroll, HeightWidth, iMC, dontMove)
    } else {
        return false;
    }
}

function closePopUp(Title, ix) {
    var js, div;
    if (Title != null) { //remove by title
        js = jsPopUps.filter(d => d.Title == Title)[0];
        div = (js != null) ? js["Div"] : null; //get ix by title
    } else {
        div = "PopUp_" + ix;
    }

    if (div != null) {
        try {
            MC = document.getElementById(div);
            MC.parentElement.removeChild(MC);
            jsPopUps = jsPopUps.filter(d => d.Title != Title);
        } catch (e) { }        
    }
    console.log("here");
    var removes = [];
    for (var i = 0; i < jsPopUps.length; i++) {
        var x = jsPopUps[i];
        var d = x.Div;
        if (document.getElementById(d) == null) {removes.push(d)}
    }
    console.log(removes);
    for (var i = 0; i < removes.length; i++) {
        jsPopUps = jsPopUps.filter(d => d.Div != removes[i]);
    }

    var xx = jsPopUps;
    var ix = 0;
    if (xx.length > 0) {
        sortJS(xx, "ix", true);
        ix = xx[0].ix * 1 + 1;
    }
    ixPopUps = ix;
    numPopups = jsPopUps.length;
}

function PopUp(Title, Data, AppendTitle, Scroll, HeightWidth, MC, dontMove) {
    cancelPopUpFocus = true;
    console.log(jsPopUps);

    var removePopUp = jsPopUps.filter(d => d.Title == Title);
    if (removePopUp.length > 0) {
        renewPopUp(Title);
    } else {
        //build new popup
        MC = (MC == null) ? "PageContainer" : MC;
        var js = jsPopUps, ix = 0; zindex = 2500;
        if (js.length > 0) {
            sortJS(js, "ZIndex", true);
            zindex = js[0]["ZIndex"] + 10;

            sortJS(js, "ix", true);
            ix = js[0].ix + 10;
        }

        jsPopUps.push({ Title: Title, ix: ix * 1, Div: ("PopUp_" + ix).replace(/ /g, ""), Data: Data, AppendTitle: AppendTitle, Scroll: Scroll, HeightWidth: HeightWidth, MC: MC, ZIndex: zindex, dontMove: dontMove });

        HeightWidth = (HeightWidth == null) ? ["500px", "60%"] : HeightWidth;
        var ht = HeightWidth[0].replace("px", "").replace("%", "") * 1;

        ix = ix * 1;
        nsection(MC, [
            "div|id=PopUp_" + ix + "|class=PopUp|style=overflow:hidden; resize:both; z-index:" + zindex + ";height:" + HeightWidth[0] + ";width:" + HeightWidth[1]
        ]);

        nsection("PopUp_" + ix, [
            "div|id=PopUp_" + ix + "_hdr|onclick=PopUpFocus(" + ix + ")|class=PopUpHdr|style=position: relative; background-color: rgb(31, 41, 67); color: white; height: 50px; border-radius: 5px;|||label|id=PopUp_" + ix + "_hdrTitle|" + Title + "&nbsp;",
            "div|id=PopUp_" + ix + "_Contents|style=border:solid 0px gray; position:relative;padding:10px;width:100%; height: calc(100% - 45px); overflow:auto"
        ]);

        section("PopUp_" + ix + "_hdr", [
            "label|id=PopUp_" + ix + "_hdr_appendTitle|" + ((AppendTitle == null) ? "" : " - " + AppendTitle),
            "div|style=inline-block|id=PopUp_" + ix + "_hdrOpts|class=excludePrint|style=float:right"
        ]);

        dragElement(document.getElementById("PopUp_" + ix));

        section("PopUp_" + ix + "_hdrOpts", [
            "label|style=padding-right:10px|id=PopUp_" + ix + "_Opts",//this is where you add extra buttons; i.e. submit, delete, etc
            //"label|style=padding-left:10px",
            "label|id=btnPopUpClose_" + ix + "|class=blueButton excludePrint|onclick=closePopUp(null, " + ix + ")|innerHTML=Close"
        ]);

        document.getElementById("PopUp_" + ix + "_Contents").style.overflowY = (Scroll) ? "auto" : "";

        var topLeft = 100;
        topLeft = (!dontMove) ? topLeft + (numPopups * 20) : topLeft;

        document.getElementById("PopUp_" + ix).style.top =
            topLeft + "px";

        document.getElementById("PopUp_" + ix).style.left =
            topLeft + "px";

        //fix broken ix
        var xx = jsPopUps.findIndex(d => d.Title == Title);
        jsPopUps[xx].ix = jsPopUps[xx].Div.split("_")[1] * 1;

        console.log("window open", Title.replace(/ /g, "").replace(/\//g, ""))
        window[Title.replace(/ /g, "").replace(/\//g, "")](document.getElementById("PopUp_" + ix + "_Contents"), Data);
        
    }

}

function PopOut(Title, Data) {
    var MC = (MC == null) ? "PageContainer" : MC;
    var js = jsPopUps, ix = 0; zindex = 2500;
    if (js.length > 0) {
        sortJS(js, "ZIndex", true);
        zindex = js[0]["ZIndex"] + 10;

        sortJS(js, "ix", true);
        ix = js[0].ix + 10;
    }

    jsPopUps.push({ Title: Title, ix: ix * 1, Div: ("PopUp_" + ix).replace(/ /g, ""), Data: Data, AppendTitle: null, Scroll: null, HeightWidth: null, MC: MC, ZIndex: 1000, dontMove: null });

    ix = ix * 1;
    nsection(MC, [
        "div|id=PopUp_" + ix + "|style=height:100%"
    ]);

    nsection("PopUp_" + ix, [
        "input|type=hidden|id=PopUp_" + ix + "_PopOut|value=true",
        "div|id=PopUp_" + ix + "_hdr|onclick=PopUpFocus(" + ix + ")|class=PopUpHdr|||label|id=PopUp_" + ix + "_hdrTitle|" + Title + "&nbsp;",
        "div|id=PopUp_" + ix + "_Contents|style=padding:10px"
    ]);

    document.getElementById("PopUp_" + ix + "_Contents").style.height = "100%";

    section("PopUp_" + ix + "_hdr", [
        "label|id=PopUp_" + ix + "_hdr_appendTitle|",
        "label|id=PopUp_" + ix + "_hdrOpts|class=excludePrint|style=float:right"
    ]);


    section("PopUp_" + ix + "_hdrOpts", [
        "label|style=float:right;padding-right:10px|id=PopUp_" + ix + "_Opts",//this is where you add extra buttons; i.e. submit, delete, etc
        "label|style=padding-left:10px",
        "label|id=btnPopUpClose_" + ix + "|class=blueButton excludePrint|onclick=closePopUp(null, " + ix + ")|innerHTML=Close"
    ]);

    //fix broken ix
    var xx = jsPopUps.findIndex(d => d.Title == Title);
    jsPopUps[xx].ix = jsPopUps[xx].Div.split("_")[1] * 1;

    window[Title.replace(/ /g, "").replace(/\//g, "")](document.getElementById("PopUp_" + ix + "_Contents"), Data);
}


//main popuplist functions
//these would go in their own .js file
function popupList(arr, listName, selectFunc, unselectFunc, MC, TL, HW, Padded) {
    var oArr = [arr, listName, selectFunc, unselectFunc, Padded];
    HW = (HW == null) ? ["400px", "300px"] : HW;
    PopUp("popupListInner", oArr, null, true, HW, MC);

    var js = jsPopUps.filter(d => d.Title == "popupListInner");
    var ix;
    if (js.length > 0) {
        ix = js[0]["ix"];
        var pu = document.getElementById("PopUp_" + ix);
        if (TL != null) {
            pu.style.top = TL[0];
            pu.style.left = TL[1];
        }
    }
}
function popupListInner(main, oArr) {
    var arr = oArr[0].split("="), listName = oArr[1], selectFunc = oArr[2], unselectFunc = oArr[3], Padded = oArr[4];

    var hdr = document.getElementById(main.id.replace("Contents", "hdrTitle"));
    hdr.innerHTML = listName;

    for (var i = 0; i < arr.length; i++) {
        var splitArr = arr[i].split("^");
        var displayItem = arr[i];
        var unavailable = (splitArr.length > 2) ? splitArr[2] : "";
        displayItem = (splitArr.length > 1) ? splitArr[1] : displayItem;

        if (unavailable != "") {
            xsection(main, ["li|class=sm pad" + ((Padded) ? "" : "Left") + "10|name=popupListItems|" + displayItem + "<br>[" + unavailable + "]"]);
        } else {
            xsection(main, ["li|class=alink pad" + ((Padded) ? "" : "Left") + "10|name=popupListItems|onclick=popupListInnerFunc(" + i + ",'" + selectFunc + "','" + unselectFunc + "','" + arr[i] + "')|" + displayItem]);
        }
        
    }
}
function popupListInnerFunc(ix, selectFunc, unselectFunc, item) {
    unselectFunc = (unselectFunc == "null") ? null : unselectFunc;
    if (unselectFunc == null) {
        window[selectFunc](item);
    } else {
        var fld = document.getElementsByName("popupListItems")[ix];
        if (fld.style.textDecoration == "line-through") {
            fld.style.textDecoration = "";
            window[unselectFunc](item);
        } else {
            fld.style.textDecoration = "line-through";
            window[selectFunc](item);
        }
    }
}