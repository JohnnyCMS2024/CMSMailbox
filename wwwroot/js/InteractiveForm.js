//log update: 20260910-140pm-jk
// Drives the "Interactive Application" (IA) forms page: team access checks, saved search filters,
// the report/results grid (via xTable/njchart), the record view/edit form (dynamic sections, notes,
// file attachments, e-signature/submit flow), and record history.
sectionTitle = "Form Applications";
var jsCurAIR = [];
var jsCurStatus = [];
var dispStates = ["AK^Alaska", "AL^Alabama", "AR^Arkansas", "AZ^Arizona", "CA^California", "CO^Colorado", "CT^Connecticut", "DE^Delaware", "FL^Florida", "GA^Georgia", "HI^Hawaii", "IA^Iowa", "ID^Idaho", "IL^Illinois", "IN^Indiana", "KS^Kansas", "KY^Kentucky", "LA^Louisiana", "MA^Massachusetts", "MD^Maryland", "ME^Maine", "MI^Michigan", "MN^Minnesota", "MO^Missouri", "MS^Mississippi", "MT^Montana", "NC^North Carolina", "ND^North Dakota", "NE^Nebraska", "NH^New Hampshire", "NJ^New Jersey", "NM^New Mexico", "NV^Nevada", "NY^New York", "OH^Ohio", "OK^Oklahoma", "OR^Oregon", "PA^Pennsylvania", "RI^Rhode Island", "SC^South Carolina", "SD^South Dakota", "TN^Tennessee", "TX^Texas", "UT^Utah", "VA^Virginia", "VT^Vermont", "WA^Washington", "WI^Wisconsin", "WV^West Virginia", "WY^Wyoming"];
var dispFlds = [];
var availFlds = ["Company", "Loaded_By", "Released_Date", "Released_By", "Viewed"];
//code:20250517:127pm
var availFldTypes = ["Internal", "Internal", "Internal", "Internal", "Internal"];
var arrFilters = [];
var arrDTs = [];
var myFilters = [];
var curRecord = [];
var curMainID;
var justSigned = false;
var ftnSelectFormRecords;
var jsSelectFormRecords = [];
var jsTriggeredVals = [];
var jsSubformVals = [];
var currentSaveFormVals = {};
var jsDropDownValues = [];
var dontrun = false;
var exportJS = [], showAddtlInfo = false, jsRequestAdditionalInfo = [];
var LineClicked;

var BREAKDOWN = false;

console.log("interactive form: 20250818:835am:jk");

//jk update 20250813-1152am-jk
//code:20241108:jk:clone record
var cloneID;

var jsReportList = [];

var curCustom = ["", "", "", ""];

var current
var EditOnOff = false;

var TCountString = "";
var TCount = 0;

//JSON DATA
var jsNeo = {
    jsForm: [],
    jsForms: [],
    jsALL: [],
    jsMain: [],
    jsADD: [],
    jsChart: [],
    jsFiltered: [],
    jsCounts: []
};
var jsNotesFiles = [], jsAddtlInfo = [];
var init = true;

var jsForms = [];
var jsFields = [];
var jsFilterNames = [];
var jsFilters = [];
var jsCurrentFilters = [];
var currentFilterID;
var jsColumnsList = { ALL: [], Selected: [] };
var btnRunReportClicked = false;

if (document.getElementById("iaInnerSidePanel"))
    iaInnerSidePanel.style.width = "150px";



const pgObserver = new ResizeObserver(entries => {
    PageContainer.style.overflowY = "hidden";
});
var fc = document.getElementsByClassName("fittedContainer")[0];
pgObserver.observe(PageContainer);

// ============================================================
// SECTION: team-based access control, page bootstrap (iaStartMe), refresh counts
// ============================================================
function TeamAccess(main, teamid, elem) {
    if (!teamid) {
        console.log("teamaccess", { formid: currentFormID });
        getData(null, newFormData("_IAApplyTeams", { formid: currentFormID }), function (vr) {
            var js = jparse(vr);
            njchart(js, ["Applied", "Team", "Internal"], main, applyTeamAccess);
        });
    } else {
        
        console.log("err", "_IAApplyTeams", { formid: currentFormID, teamid: teamid }, elem);

        getData(null, newFormData("_IAApplyTeams", { formid: currentFormID, teamid:teamid }), function (vr) {
            var js = jparse(vr);
            console.log("err", js);
            elem.children[0].innerHTML = js[0].Applied;
        });
    }
}

function applyTeamAccess(xx, ix, fld) {
    console.log("err", xx, ix, fld)
    var rtn = {};
    
    if (fld == "Applied")
        if (!xx.Internal) {
            rtn.value = "Applied: not permitted to edit"; //"[ " + xx.Applied + " ]";
            rtn.title = "You do not have permission to edit this entry";
            //rtn.click = "alert(this.children[0].innerHTML)";
            //rtn.hover = ["ElemHover(this, true, 'gray')", "ElemHover(this, false)"];
        }
        else {
            rtn.class = "cursor";
            rtn.click = "TeamAccess(null, '" + xx.TeamID + "', this)";
            rtn.hover = ["ElemHover(this, true)", "ElemHover(this, false)"];
        }

    return rtn;
}
function hoverTeamAccess(elem, clr) {
    elem.parentElement.className = "simpleHover";
}

function setSessionFilterID() {
    //set currentFilterID in session
    var jsSessionIAFilters = [];
    var sessionIAFilters = sessionStorage.getItem("IAFilters");
    if (sessionIAFilters) {
        jsSessionIAFilters = jparse(sessionIAFilters).filter(d => d.currentFormID != currentFormID);
    }
    jsSessionIAFilters.push({ currentFormID: currentFormID, currentFilterID: (currentFilterID == "") ? "blank" : currentFilterID });
    sessionStorage.setItem("IAFilters", jstring(jsSessionIAFilters));
    console.log("session", jparse(sessionStorage.getItem("IAFilters")).filter(d => d.currentFormID == currentFormID));
    //*************/
}

function iaStartMe() {
    var PartFA = (ME.Security.filter(d => d.FormID == currentFormID).length > 0) ? true : false;
    if (!PartFA) {
        //alert("here");
        loc("Dashboard");
    }

    if (BREAKDOWN) alert("startme");

    getData(null, newFormData("_IAUpdateRecordStatus", {}), function (vr) {
        console.log(820, vr);
    });

    divBackButton.style.whiteSpace = "none";

    xsection(divBackButton, ["div|id=mainBtns|style=font-size:9px"]);
    xsection(mainBtns, [
        "label|icon=dashboard.png|icon.class=icon cursor|id=cdBackToDashboard|style=white-space:nowrap;|class=cursor|onclick=loc('Dashboard')|innerHTML=Dashboard",
        "br", "br",
        "label|icon=documentWhand.png|icon.class=icon cursor|id=cdReportList|style=white-space:nowrap;|class=cursor|onclick=PopUp('Saved Reports')|innerHTML=Saved Reports",
        "br", "br",
        "label|icon=expandPanel_rightarrow.png|icon.class=icon cursor|id=cdOtherForms|style=white-space:nowrap;|class=cursor|onclick=showHide('tdNextNav')|innerHTML=Applications",
        "br", "br",
        //((!ME.Security[0].MngFormApplications) ? "" : "div|||label|icon=teamsIcon.png|icon.style=height:15px; width:18px; cursor:pointer|class=cursor|onclick=PopUp('Team Access')|Set Team access|||br|||br"),

        "label|icon=3col-icon.png|icon.style=height:15px; width:18px; cursor:pointer|class=cursor|onclick=ManageColumns()|Manage Columns"
    ]);

    tdMainNav.style.display = "none";
    PageContainer.innerHTML = "";

    var ht = document.body.clientHeight - 200;
    var wd = PageContainer.clientWidth - 20;

    xsection(PageContainer, [
        "div|id=dispMain",
        "div|id=dispReportOuter|||div|id=dispReport"
    ]);

    if (LaunchMainID > 0) {
        dispReportOuter.style.visibility = "hidden";
    }

    xsection(dispReport, [
        "div|id=divIAMain|style=padding:10px; " +
        "" + "|||table|id=tblIAMain|style=width:85vw",
        "div|id=displayReport|style=border:solid 0px gray; padding:10px; height:48vw; width:85vw; ",
        "div|id=printReport|style=display:none",
    ]);

    //observer.observe(dispReport);

    xsection(tblIAMain, [
        "th|style=white-space:nowrap|id=placeFilters",
        "th|style=width:150px; white-space:nowrap",
        "th|style=border:text-align:right; white-space:nowrap;position:relative|id=tdRightOptions|"
    ])

    xsection(tdRightOptions, [
        //"label|icon=dashboardN.png|class=cursor padLeft5|onclick=PopUp('NeoData Dashboard', null, null, null, ['750px','900px'])|Create Dashboard",
        //"label|style=width:20px|",
        "div|style=display:inline-block" +
        "|||label|icon=print-icon.png|class=cursor padLeft5|onclick=exportReport()|Export to Excel" +
        "|||div|class=cursor|onclick=exportReport()|style=padding-left:20px; color:gray; font-size:9px|(Max 1000 Records)",
        "div|style=display:inline-block; width:20px|",
        "div|style=display:inline-block; vertical-align:top" +
        "|||label|icon=documentWhand.png|class=cursor padLeft5|onclick=exportFullReport()|Save Full Report",
        "br", "br",
        "label|class=sm|||label|id=displayRecordTotal|"
    ]);

    xsection(placeFilters, [
        "div|class=|Filters:" +
        "|||label|id=lblCustFilters|class=padLeft5 padRight5" +
        "|||img|style=padding-left:5px;padding-right:5px;height:15px;width:23px;cursor:pointer|title=Help with Search|src=help_icon.png|onclick=openSearchHelp()" +
        "|||input|id=txtFilters|onkeyup=NewFilter(event)|list=dataList_CustFilters|autocomplete=off|style=width:200px|placeholder=Search the results and press Enter" +
        "|||datalist|id=dataList_CustFilters" +
        "|||label|style=width:10px| " +
        "|||button|class=blueButton|id=btnRunReport|onclick=GetMain()|Run Report" +
        "|||label|class=sm cursor padLeft10|id=displayCurrentFilter|onclick=writeFilters()",
        "div|class=sm|Filters:|||label|id=displayFilterBtns|class=pad10|style=color:orange|Filters are loading ...",

    ]);

    xsection(lblCustFilters, ["select|id=custFilters|style=width:150px|onchange=custFilters_onchange()"]);



    var ht = (tdPageContainer.clientHeight / 2);
    xsection(IA_NavSect, [
        //"div|||label|icon=expandPanel_rightarrow.png|class=navsect|onclick=showHide('tdNextNav')|Other Forms",
        //"div|class=smhdr shadowSection|Available Forms",
        "div|style=height:" + ht + "px; overflow-y:auto|||" +
        "table|id=tblIA_NavSect|||td|id=loadingforms_pleasewait|class=pad10 sm|Loading Forms ..."
    ]);
    xsection(tblIA_NavSect, [
        "tr",
        "td|class=smhdr shadowSection|colspan=2|Forms",
        "td|class=shadowSection|Open"
    ]);

    RefreshCounts();
    GetFilters();

    //set currentFilterID as last in session
    var tmpFilterID;
    var sessionIAFilters = sessionStorage.getItem("IAFilters");
    console.log("session", currentFormID, sessionIAFilters);
    if (sessionIAFilters) {
        var jsSessionIAFilters = jparse(sessionIAFilters);
        var xx = jsSessionIAFilters.filter(d => d.currentFormID == currentFormID);
        console.log("session", xx);
        if (xx.length > 0)
            tmpFilterID = xx[0].currentFilterID;
    }
    console.log("session", tmpFilterID);
    currentFilterID = (!tmpFilterID) ? "INIT" : (tmpFilterID == "blank") ? "" : tmpFilterID;
    setSessionFilterID();
    //*************/

    GetMain();
}

var jsSectionForms = []
function RefreshCounts() {
    if (BREAKDOWN) alert("refreshcounts");
    RunMultiSP("_IAFormCounts", [{ formid: currentFormID }, {}], function (xx) {
        var js = xx[0];
        console.log(820, js);
        jsSectionForms = js;
        console.log(376, "formcounts", js, { formid: currentFormID });

        //populate nav panel forms list
        loadingforms_pleasewait.parentElement.removeChild(loadingforms_pleasewait);

        for (var i = 0; i < js.length; i++) {
            var xx = js[i];

            xsection(tblIA_NavSect, [
                "tr" +
                "|||td" + ((xx.FormID != currentFormID) ?
                    "|title=Add Record|class=sm cursor|style=color:blue|onclick=ViewDisp(0, '" + xx.FormID + "')|+" :
                    "") +
                "|||td|" + ((xx.FormID == currentFormID) ?
                    "title=Current Form|class=sm navlinkLeftSelected|" :
                    "title=Launch Form|class=sm navlinkLeft|onclick=LaunchApplication('InteractiveForm','" + xx.FormID + "')|") +
                "" + xx.FormName +
                "|||td|title=Total Open Records|class=sm|id=FormCount_" + xx.FormID + "|[" + xx.Cnt + "]"
            ]);
        }
    }, null, true);
}

// ============================================================
// SECTION: saved search filters — list/select/save/delete/edit named filter sets
// ============================================================
function SavedSearches(main) {
    if (BREAKDOWN) alert("savedsearches");
    if (jsFilters.findIndex(d => d.FilterID == "Latest") > -1)
        PopUpOpt(main, "button|class=longblueButton|onclick=PopUp('Save Latest Filters', null, null, ['200px','300px'])|Save Latest Filters");

    var js = [];
    for (var i = 0; i < jsFilters.length; i++) {
        js.push(jsFilters[i]);
        js[i].Delete = "x";
        js[i].Filter = js[i].Filter.toUpperCase();
    }

//    njchart(js, ["Delete", "FilterID", "FilterName", "FieldName", "Filter"], main, SavedSearches_click);
//=======
//    console.log(js)
//    njchart(js, ["Delete", "FilterID", "FilterName", "FieldName", "Filter"], main, SavedSearches_click); 
//>>>>>>> SO_DEV
//=======
    njchart(js, ["Delete", "FilterName", "FieldName", "Filter"], main, SavedSearches_click);
/*>>>>>>> b2753ab0309a5d109ba340b18f13a5dd9ec9df28*/
}


function SavedSearches_click(xx, rowix, fld) {
    var rtn = { style: "", class: "", click: "", value: null };

    if (fld == "Delete") {
        rtn.style = "color:red";
        rtn.click = "deleteFilter('" + xx.FtrID + "')";
        rtn.hover = ["ElemHover(this, true)", "ElemHover(this, false)"]
        rtn.class = "cursor";
    }
    else if (fld) {
        rtn.style = "";
        rtn.click = "closePopUp('Saved Searches'); selectFilter('" + xx.FilterID + "')";
        rtn.hover = ["ClassHover('savedSearch_" + xx.FilterID + "', true)", "ClassHover('savedSearch_" + xx.FilterID + "', false)"]
        rtn.class = "savedSearch_" + xx.FilterID + " cursor";
    }

    return rtn;
}

function deleteFilter(FtrID, gobaby) {
    if (BREAKDOWN) alert("deletefilter");
    if (!gobaby)
        xconfirm("Are you sure you want to delete this filter?", null, "deleteFilter(" + FtrID + ", true)");
    else
        RunMultiSP("_IADelFilter", [{ FtrID: FtrID }], function (js) {
            xconfirm();
            GetFilters(true);
        });
}

function SaveLatestFilters(main, ev, gobaby) {
    if (BREAKDOWN) alert("savelatestfilters");
    if (main) {
        PopUpOpt(main, "button|class=blueButton|onclick=SaveLatestFilters(null, null, true)|Save Filter")
        xsection(main, ["input|id=txtSaveFilter|style=width:100%|placeholder=Enter a new name for this filter|onkeyup=SaveLatestFilters(null, event)"]);
        txtSaveFilter.focus();
    }
    else {
        var kc = false;
        if (ev)
            if (ev.keyCode == 13)
                kc = true;

        if (kc || gobaby) {
            RunMultiSP("_IASaveFilter", [{ formid: currentFormID, name: txtSaveFilter.value }], function (js) {
                closePopUp("Save Latest Filters");
                GetFilters(true);
            });
        }
    }

}


function hoverFilter(filterid, overOut, del) {
    var elems = document.getElementsByClassName(filterid);
    for (var i = 0; i < elems.length; i++) {
        elems[i].style.background = (overOut == 0) ? "lightyellow" : elems[i].className.split(" ")[0];
    }
}

function selectFilter(FilterID) {
    if (BREAKDOWN) alert("selectfilter");
    currentFilterID = FilterID;
    setSessionFilterID();

    sessionStorage
    writeFilters();
    GetMain();
}

function custFilters_onchange() {
    if (BREAKDOWN)
        alert("custfiltersonchange");
    try {
        dataList_CustFilters.innerHTML = "";
        var filter = custFilters.value;

        if (filter == "Saved Search") {
            custFilters.value = "Quick Search";
            PopUp("Saved Searches");

        } else if (filter == "Search All Forms") {
            custFilters.value = "Quick Search";
            PopUp("Search All Forms");

        } else {
            //alert(filter);
            var js = jsDropDownValues.filter(d => d.FieldID == filter);
            console.log("custfilters", js, jsDropDownValues, filter);

            var arr = []
            if (js.length > 0)
                arr = js[0].FieldOptions.split("|");

            for (var i = 0; i < arr.length; i++) {
                xsection(dataList_CustFilters, ["option|value=" + arr[i] + "|" + arr[i]]);
            }
        }
    } catch (ex) {
        console.log("err", ex);
    }
}

var runOneOff = false;
function NewFilter(ev) {
    if (BREAKDOWN) alert("newfilter");
    var TF = (!ev) ? true : (ev.keyCode == 13) ? true : false;

    if (TF) {
        var FieldID = custFilters.value;
        var Filter = txtFilters.value;
        var FieldName = custFilters.options[custFilters.selectedIndex].innerHTML;
        //alert(FieldName + ":" + Filter);
        custFilters.value = "Quick Search";
        txtFilters.value = "";

        jsFilters.push({ FtrID: -1, Type: "Filters", FormID: currentFormID, FilterID: currentFilterID, FieldID: FieldID, FieldName: FieldName, Filter: Filter });
        console.log("err", jsFilters);
        DBEditFilter(-1, "A");
    }

}



function DBEditFilter(FtrID, editRemoveAdd) {
    if (BREAKDOWN) alert("DBEditFilter");
    var jo = jsFilters.filter(d => d.FtrID == FtrID)[0];
    var pram = { FtrID: FtrID, FormID: currentFormID, FilterID: jo.FilterID, FieldID: jo.FieldID, FieldName: jo.FieldName, Filter: jo.Filter, editRemoveAdd: editRemoveAdd };
    console.log(268, "_IAEditFilters", [pram]);
    //alert(jstring(pram));

    RunMultiSP("_IAEditFilters", [pram], function (js) {
        xconfirm();
        currentFilterID = (js[0].length > 0) ? js[0][0].FilterID : "";
        setSessionFilterID();
        GetFilters();
    });

}

function SearchAllForms(main) {
    var rpt = document.getElementById("safReport");

    if (!rpt)
        xsection(main, [
            "div|id=safSearch|Search: Field " +
            "|||label|class=padLeft10" +
            "|||input|id=safField" +
            "|||label|class=padLeft10|Value " +
            "|||label|class=padLeft10" +
            "|||input|id=safFilter" +
            "|||label|class=padLeft10" +
            "|||button|class=blueButton|onclick=SearchAllForms()|Search",
            "hr",
            "div|id=safReport|style=height:calc(100% - 50px)"
        ]);

    else {
        if (safFilter.value.trim() != "")
            getData(null, newFormData("_IASearchAllForms", { field: safField.value, filter: safFilter.value }), function (vr) {
                console.log("err saf", { field: safField.value, filter: safFilter.value }, jparse(vr));
                //njchart(jparse(vr), ["Application", "Form", "MainID", "Field_Name", "Value", "Date_Loaded"], rpt, safClick);
                jsDivChart = jsDivChart.filter(d => d.dv != rpt);
                divChart(rpt, jparse(vr), null, null, null, ["Application", "Form", "MainID", "Field_Name", "Value", "Date_Loaded"], safClick);
            });
    }
}

function safClick(xx, ix, fld) {
    return {
        class: "cursor",
        click: function () {
            safClickGO(xx.FormID + "^" + xx.MainID);
        }
    };
}
function safClickGO(launch) {
    document.location.href = "FormSend?Page=InteractiveForm&Launch=" + launch;
}


function GetFilters(getSavedFilters, wf) {
    if (BREAKDOWN) alert("getfilters");
    RunMultiSP("_IAGetFiltersNew,_IAGetDropdownValues", [{ formid: currentFormID }, { formid: currentFormID }], function (xx) {
        var js = xx[0];
        jsFilterNames = js.filter(d => d.Type == "FilterNames");
        jsFields = js.filter(d => d.Type == "FieldNames");
        jsFilters = js.filter(d => d.Type == "Filters");
        jsDropDownValues = xx[1];

        console.log(142, js, jsDropDownValues);

        //populate search filters
        custFilters.innerHTML = "";
        xsection(custFilters, ["option|value=Quick Search|Quick Search"]);
        xsection(custFilters, ["option|value=Saved Search|Saved Search"]);
        xsection(custFilters, ["option|value=Search All Forms|Search All Forms"]);

        var arr = [];
        for (var i = 0; i < jsFields.length; i++) {
            arr.push({ FieldID: jsFields[i].FieldID, FieldName: jsFields[i].FieldName.toUpperCase() });
        }
        sortJS(arr, "FieldName");

        for (var i = 0; i < arr.length; i++) {
            xsection(custFilters, ["option|value=" + arr[i].FieldID + "|" + arr[i].FieldName]);
        }

        if (!getSavedFilters || wf)
            writeFilters();
        else {
            renewPopUp("Saved Searches");
            writeFilters();
        }

    }, null, true);
}

function ClearFilters() {
    if (BREAKDOWN) alert("clearfilters");
    //displayCurrentFilter.innerHTML = ""; 
    currentFilterID = "";
    setSessionFilterID();

    runOneOff = false;
    RunMultiSP("_IAClearFilters", [{}], function (js) {
        writeFilters();
    });
}


function writeFilters(begin) {
    if (BREAKDOWN) alert("writefilters_" + begin + "_" + runOneOff);
    //alert("write filters for:" + currentFilterID);
    displayFilterBtns.innerHTML = "";
    var js = jsFilters.filter(d => d.FilterID == currentFilterID);
    console.log(195, js)
    btnRunReport.className = "orangeButton";
    //displayCurrentFilter.innerHTML = "";

    if (js.length > 0) {
        displayCurrentFilter.innerHTML = "Filter: " + js[0].FilterName;

        xsection(displayFilterBtns, [
            "button|class=smorangebutton|onclick=ClearFilters()|id=btnFilter_CLEAR|CLEAR FILTERS",
            "label|class=padLeft10|"
        ]);

        for (var i = 0; i < js.length; i++) {
            var btn = js[i];
            xsection(displayFilterBtns, [
                "button|class=filterButton|onclick=editFilters(" + btn.FtrID + ")|id=btnFilter_" + btn.FtrID,
                "label|class=padLeft10|"
            ]);
            document.getElementById("btnFilter_" + btn.FtrID).innerHTML = btn.FieldName.replace(/ /g, " ") + ": " + btn.Filter;
        }
        console.log("err", { formid: currentFormID, filters: js });
    }


    if (runOneOff)
        GetMain();
    else if (!GETTINGMAIN)
        getQS(true);


}

function editFilters(FtrID, editRemove) {
    if (BREAKDOWN) alert("editfilters");
    var jo = jsFilters.filter(d => d.FtrID == FtrID)[0];

    if (!editRemove) {
        xconfirm(null, [
            "div|<b>Edit Filter for: </b> " + jo.FieldName.replace(/ /g, " "),
            "label|class=padLeft10 padTop10|style=width:100%|||input|style=width:100%; height:40px|id=txtEditFilter",
        ]);

        txtEditFilter.value = jo.Filter;

        confirmFooter.innerHTML = "";
        xsection(confirmFooter, [
            "button|class=blueButton|onclick=xconfirm()|Cancel",
            "label|class=padLeft10|",
            "button|class=longorangeButton|style=width:150px|onclick=editFilters(" + FtrID + ", 'E')|Submit Edit",
            "label|class=padLeft10|",
            "button|class=longredButton|style=width:150px|onclick=editFilters(" + FtrID + ", 'R')|Remove Filter",
        ])

        confirmWindow.style.height = "170px";
        confirmWindowInner.style.height = "120px";

        txtEditFilter.value = jo.Filter.toUpperCase();
        txtEditFilter.focus();
    } else {
        if (editRemove == "E") {
            var ix = jsFilters.findIndex(d => d.FtrID == FtrID);
            jsFilters[ix].Filter = txtEditFilter.value;
            //alert(jstring(jsFilters[ix]));
        }

        DBEditFilter(FtrID, editRemove);
    }
}


var GETTINGMAIN = false;
// ============================================================
// SECTION: main report query building/execution (GetMain/getQS/Report) and results-grid interaction
// ============================================================
function GetMain(includeMainID, wentBack, func) {
    console.log("sec", ME);
    if (BREAKDOWN)
        alert("gettingmain");

    if (!GETTINGMAIN) {
        runOneOff = false;

        displayReport.innerHTML = "";
        xsection(displayReport, ["div|class=sm pad10|Please wait while the report is loading ..."]);


        if (LaunchMainID > 0) {
            includeMainID = LaunchMainID;
        }
        LaunchMainID = -1;


        if (txtFilters.value != "") {
            runOneOff = true;
            NewFilter();
        } else {
            var tmpIncludeMainID = includeMainID;
            includeMainID = (!includeMainID) ? 0 : (includeMainID == -1) ? 0 : includeMainID;
            var useFormID = (!currentSaveFormVals.FormID) ? currentFormID : currentSaveFormVals.FormID;
            var getcache = (includeMainID > 0 || !wentBack) ? 0 : 1;

            //var prms = { formid: useFormID, FilterID: currentFilterID, MainID: includeMainID, GETCACHE: getcache };
            var prms = { formid: useFormID, FilterID: currentFilterID, MainID: includeMainID, GETCACHE: getcache };
            console.log(376, "_IAGETALLDATA260903", [prms]);
            GETTINGMAIN = true;
            getData(null, newFormData("_IAGETALLDATA260903", prms), function (vr) {
                var js = jparse(vr);
                
                console.log("err ftr", js);
                includeMainID = tmpIncludeMainID;

                btnRunReport.className = "blueButton";
                GETTINGMAIN = false;
                if (BREAKDOWN)
                    alert("gotmain");

                
                var FieldIDs = js.filter(d => d.RecordType == "FieldIDs")[0];
                var FieldTypes = js.filter(d => d.RecordType == "FieldTypes")[0];
                var ShortNames = js.filter(d => d.RecordType == "ShortNames")[0];
                var jsValues = js.filter(d => d.RecordType == "Values");

                try {
                    if (jsFilters.filter(d => d.FilterID == currentFilterID).length == 0)
                        displayCurrentFilter.innerHTML = "";

                    displayRecordTotal.innerHTML = (jsValues.length == 0) ?
                        "Retrieved 0 of 0 records" :
                        (jsValues.filter(d => d.MainID > 0).length < + jsValues[0].TotalCount) ?
                            "Retrieved and sorting on <b style=\"color:red\">" + jsValues.filter(d => d.MainID > 0).length + "</b> most recent of <b style=\"color:red\">" + jsValues[0].TotalCount + "</b> records.<br>Download full report to sort on entire dataset." :
                            "Retrieved " + (jsValues.filter(d => d.MainID > 0).length) + " of " + jsValues[0].TotalCount + " records";

                } catch (ex) { }
                

                jsValues = (jsValues.length == 0) ? js.filter(d => d.RecordType == "Values") : jsValues;

                showButtons();

                var excludeFields = ("Application_Type,CacheUID,FormID,hasDoc,FieldIDs,FieldTypes,MGTs,Filters,TotalCount,RecordType,strMainID").split(",");

                var includeFields = [];
                var includeCols = [];
                var KeyVals = [];
                for (var key in ShortNames) {
                    if (excludeFields.indexOf(key) == -1 && key.indexOf("Col") == -1)
                        includeFields.push(key);

                    if (key.indexOf("Col") == 0 && ShortNames[key] != null) {
                        KeyVals.push({ key: key, val: ShortNames[key] });
                        includeCols.push(ShortNames[key]);
                    }
                }

                var cols = includeFields.concat(includeCols);
                jsColumnsList.ALL = cols;
                jsColumnsList.ALL.sort();

                var njs = [];
                exportJS = [];
                for (var i = 0; i < jsValues.length; i++) {
                    var xx = jsValues[i];
                    var jo = {};
                    var ejo = {};
                    for (var key in ShortNames) {
                        if (key.indexOf("Col") != 0)
                            jo[key] = xx[key];

                        if (key.indexOf("Col") != 0 && excludeFields.indexOf(key) == -1)
                            ejo[key] = xx[key];
                    }

                    for (var ii = 0; ii < KeyVals.length; ii++) {
                        jo[KeyVals[ii].val] = xx[KeyVals[ii].key];
                        ejo[KeyVals[ii].val] = xx[KeyVals[ii].key];
                    }

                    njs.push(jo);
                    exportJS.push(ejo);
                }


                deNullJS(njs, true);
                jsNeo.jsALL = njs;
                console.log("err ftr", njs);

                
                var dofunc = function (includeMainID) {
                    getQS();
                    includeMainID = (!includeMainID) ? 0 : includeMainID;
                    if (includeMainID != 0)
                        ViewDisp(includeMainID, useFormID, null, func);
                    else if (jsColumnsList.Selected.length == 0)
                        Report(includeMainID);
                }
                
                JustGetDisplayFields(dofunc, includeMainID);

                // else
                //     getQS();
                //else
                //    Report(null, includeMainID);


                includeMainID = 0;

                RunMultiSP("_IAGetTriggered,_IAGetSubforms", [{ formid: useFormID }, { formid: useFormID }, { formid: useFormID }], function (xx) {
                    try {
                        jsTriggeredVals = normalizeJS(xx[0], "T_Headers", "TCol", ["T_FormMainID", "T_MainID"]);
                        jsSubformVals = normalizeJS(xx[1], "Headers", "FCol", ["FormMainID"]);
                    } catch (ex) {
                        console.log("err", ex, js);
                    }
                }, null, true);
            });            
        }
    } else {
        smconfirm("Please wait until records have been retrieved ...");
        setTimeout(function () { xconfirm(); }, 2500);
    }
}

function getQS(runReport) {
    //alert("here");
    try {
        if (BREAKDOWN) alert("getqs_" + runReport);

        getData(null, newFormData("_IAQuickSearch", { formid: currentFormID, filterid: currentFilterID }), function (vr) {
            var xx = jparse(vr);
            js = jsNeo.jsALL;
            var arr = [];
            for (var i = 0; i < xx.length; i++) { arr.push(xx[i].MainID); }
            jsNeo.jsFiltered = (xx[0].QS == 0) ? js : js.filter(d => arr.indexOf(d.MainID) > -1);

            console.log("err ftrs", { filterid: currentFilterID, xx: xx, jsFiltered:jsNeo.jsFiltered, arr: arr });

            Report();
        });
        // var js = jsFilters.filter(d => d.FilterID == currentFilterID && d.FieldName == "Quick Search");

        // var holdJSFiltered = jsNeo.jsFiltered;

        // console.log(517, js, jsFilters);
        // var ftrs = [];
        // for (var i = 0; i < js.length; i++) {
        //     ftrs.push(js[i].Filter);
        // }
        // if (ftrs.length > 0) {
        //     js = jsNeo.jsALL.filter(item => {
        //         // Get an array of all values for the current item
        //         const values = Object.values(item);

        //         // Check if any of these values match the searchValue (case-insensitive)
        //         return values.some(value =>
        //             typeof value === 'string' && value.toLowerCase().includes(ftrs[0].toLowerCase())
        //         );
        //     });

        //     for (var i = 1; i < ftrs.length; i++) {
        //         js = js.filter(item => {
        //             // Get an array of all values for the current item
        //             const values = Object.values(item);

        //             // Check if any of these values match the searchValue (case-insensitive)
        //             return values.some(value =>
        //                 typeof value === 'string' && value.toLowerCase().includes(ftrs[i].toLowerCase())
        //             );
        //         });
        //     }

        //     jsNeo.jsFiltered = js;
        // } else {
        //     jsNeo.jsFiltered = jsNeo.jsALL;
        // }


        // if (runReport && holdJSFiltered != jsNeo.jsFiltered)
        //     Report();
    } catch (ex) {
        console.log("err ftr", ex);
    }

}

function GetDisplayFields(includeMainID) {
    if (BREAKDOWN) alert("GetDisplayFields");
    RunMultiSP("_IAGetDisplayFields", [{ formid: currentFormID }], function (js) {
        var flds = ("MainID,Company,Loaded_By,Date_Loaded,Modified_By,Date_Modified,Status,Open_Closed").split(",");
        if (js[0].length > 0)
            if (js[0][0].DisFlds != "")
                flds = js[0][0].DispFlds.replace(/ /g, "_").split(",");

        //alert(flds.toString());
        jsColumnsList.Selected = flds;
        Report(null, includeMainID);
    });
}

function JustGetDisplayFields(func, pram) {
    if (BREAKDOWN) alert("GetDisplayFields");
    RunMultiSP("_IAGetDisplayFields", [{ formid: currentFormID }], function (js) {
        var flds = ("MainID,Company,Loaded_By,Date_Loaded,Modified_By,Date_Modified,Status,Open_Closed").split(",");
        if (js[0].length > 0)
            if (js[0][0].DisFlds != "")
                flds = js[0][0].DispFlds.replace(/ /g, "_").split(",");

        //alert(flds.toString());
        jsColumnsList.Selected = flds;

        func(pram);
    });
}

var mainSort = { sort: "MainID", desc: true };
var jsLineClick = {};
var ignore1stWindowResize
function Report(sort, includeMainID) {
    displayReport.innerHTML = "";
    displayReport.style.height = (window.innerHeight - 250) + "px";
    jsJChart = jsJChart.filter(d => d.dv != "displayReport");
    xtFilterState = null; closeDropMenu();

    if (BREAKDOWN)
        alert("report");

    sortJS(jsNeo.jsFiltered, mainSort.sort, mainSort.desc);
    console.log(5170, jsCurrentFilters);
    var js = jsNeo.jsFiltered.filter(d => d.MainID != 0);
    console.log(js);
    if (js.length == 0)
        xsection(displayReport, ["div|class=sm padLeft10|There are no records to display"]);

    else {
        currentReportName = js[0].Application_Type;
        console.log(currentReportName);
        if (js.length == 0)
            js = jsNeo.jsFiltered;

        if (sort)
            if (sort == mainSort.sort)
                mainSort.desc = (mainSort.desc) ? false : true;
            else
                mainSort = { sort: sort, desc: false };


        jsColumnsList.Selected = (jsColumnsList.Selected.length == 0) ? ["MainID", "Company", "Open_Closed", "Loaded_By", "Modified_By", "Date_Loaded", "Date_Modified"] : jsColumnsList.Selected;

        //getGChartTable(js, jsColumnsList.Selected, displayReport, []);
        var norecsfound = false;
        setTimeout(function () {
            jsDashboardData = js;
            //njchart(js, jsColumnsList.Selected, displayReport, Report_Click, function () {
            //    for (var i = 0; i < js.length; i++) {
            //        var line = document.getElementsByName("col_displayReport_" + (i + 1));

            //        if (js[i].MainID * 1 == 0 && !norecsfound) {
            //            var x = line[0].parentElement.parentElement;
            //            x.innerHTML = "";
            //            xsection(x, ["td|colspan=" + line.length + "|class=sm pad10|No records found"]);
            //            norecsfound = true;
            //        }
            //    }
            //    if (LineClicked)
            //        PaintLineClick();
            //});


            //getData(null, newFormData("_GetJChartSort", { dvid: displayReport.id, xtra: currentFormID }), function (vr) {
            //    var jsSort = jparse(vr);
            //    var sort = "MainID", sortDesc = true;
            //    if (jsSort.length > 0) {
            //        sort = jsSort[0].SortCol;
            //        sortDesc = (jsSort[0].SortDesc == "") ? false : true;
            //    }


            var xtStuff = jsXTable.filter(d => d.main == displayReport);
            xtStuff = (xtStuff.length > 0) ? xtStuff[0].jo : {
                js: js,
                hdrs: jsColumnsList.Selected,
                allhdrs: jsColumnsList.ALL,
                wds: {},
                //persist a column width whenever the user finishes dragging a header edge
                onColResize: function (hdr, wd, wds) { SaveIAColSizes(wds); },
                func: function (jo, rowix, fld) {
                    return {
                        style: "",
                        class: "cursor lineclick lineclickrow_" + rowix,
                        mouseover: function () { ClassHover("lineclickrow_" + rowix, true, "lightblue"); },
                        mouseout: function () { ClassHover("lineclickrow_" + rowix, false); },
                        click: function () {
                            LineClick(this, jo.MainID, jo.FormID);
                        }
                    };
                },
                onload: function (jo) {
                    getData(null, newFormData("_IAGetDisplayFields", { formid: currentFormID, dispFlds: jo.hdrs.join(",") }), function (vr) {
                        //do nothing
                    }, null, true);
                }
            }
            xtStuff.js = js;

            console.log("xtable xtstuff", xtStuff);
            //load any saved column widths for this form, then render
            ApplySavedIAColSizes(xtStuff, function () {
                xTable(displayReport, xtStuff);
            });

                jsDivChart = jsDivChart.filter(d => d.dv != displayReport);

                //if (xChartOrDivChart == 1)
                //    divChart(displayReport, js, null, null, null, jsColumnsList.Selected, Report_Click,
                //        function () {
                //            for (var i = 0; i < js.length; i++) {
                //                var line = document.getElementsByName("col_displayReport_" + (i + 1));

                //                if (js[i].MainID * 1 == 0 && !norecsfound) {
                //                    var x = line[0].parentElement.parentElement;
                //                    x.innerHTML = "";
                //                    xsection(x, ["td|colspan=" + line.length + "|class=sm pad10|No records found"]);
                //                    norecsfound = true;
                //                }
                //            }
                //            if (LineClicked)
                //                PaintLineClick();
                //        }
                //    );
                //else
                //    xChart({
                //        main: displayReport, dv: displayReport.id, js: js, hdrs: jsColumnsList.Selected, func: Report_Click,
                //        onload: function () {
                //            for (var i = 0; i < js.length; i++) {
                //                var line = document.getElementsByName("col_displayReport_" + (i + 1));

                //                if (js[i].MainID * 1 == 0 && !norecsfound) {
                //                    var x = line[0].parentElement.parentElement;
                //                    x.innerHTML = "";
                //                    xsection(x, ["td|colspan=" + line.length + "|class=sm pad10|No records found"]);
                //                    norecsfound = true;
                //                }
                //            }
                //            if (LineClicked)
                //                PaintLineClick();
                //        }
                //    });
            //});

            
        }, 100);
    }
    //window.addEventListener('resize', njchart_Hdrs_Widths(displayReport));
}

// ============================================================
// SECTION: remembered main-report column widths (NEO_IAFormColSizes / NEO_IAGetEditColSizes)
// ============================================================
//cache of the saved widths for the form currently open, so re-renders don't re-hit the DB
var jsIAColSizes = { formid: null, sizes: [] };

//load saved column widths for the current form into jo.wds, then invoke cb() to render
function ApplySavedIAColSizes(jo, cb) {
    jo.wds = jo.wds || {};

    function apply(sizes) {
        for (var i = 0; i < sizes.length; i++) {
            var hid = sizes[i].HeaderID;
            var hsz = parseFloat(sizes[i].HeaderSize);
            if (hid && !isNaN(hsz))
                jo.wds[hid] = hsz;
        }
        cb();
    }

    if (jsIAColSizes.formid === currentFormID) {
        apply(jsIAColSizes.sizes);
        return;
    }

    getData(null, newFormData("_IAGetEditColSizes", { formid: currentFormID }), function (vr) {
        var rows = [];
        try { rows = jparse(vr); } catch (ex) { rows = []; }
        jsIAColSizes = { formid: currentFormID, sizes: rows };
        jo.wds = {}; //dropping widths from a previously viewed form
        apply(rows);
    }, null, true);
}

//persist the current column widths (jo.wds) for the current form
function SaveIAColSizes(wds) {
    if (!wds) return;

    var parts = [];
    var sizes = [];
    for (var k in wds) {
        var v = Math.round(parseFloat(wds[k]));
        if (k && !isNaN(v)) {
            parts.push(k + "=" + v);
            sizes.push({ HeaderID: k, HeaderSize: String(v) });
        }
    }
    if (parts.length === 0) return;

    //keep the cache in sync so the next render uses these without another round trip
    jsIAColSizes = { formid: currentFormID, sizes: sizes };

    getData(null, newFormData("_IAGetEditColSizes", { formid: currentFormID, headers: parts.join("|") }), function () { }, null, true);
}

function Report_Click(jo, rowix, fld) {
    if (rowix < 5)
        console.log(760, { jo: jo, rowix: rowix, fld: fld });

    return {
        style: "",
        class: "cursor lineclick lineclickrow_" + rowix,
        mouseover: function () { ClassHover("lineclickrow_" + rowix, true, "lightblue"); },
        mouseout: function () { ClassHover("lineclickrow_" + rowix, false); },
        click: function () {
            LineClick(this, jo.MainID, jo.FormID);
        }
    };
}

function SwitchReport() {
    if (BREAKDOWN) alert("switchrepprt");
    dispMain.innerHTML = "";
    dispReportOuter.style.visibility = "";

    Report();
}

function PaintLineClick() {
    var classes = LineClicked.split(" ");
    var thisClass = classes[classes.findIndex(item => item.startsWith("lineclickrow_"))];

    var line = document.getElementsByClassName(thisClass);
    for (var i = 0; i < line.length; i++) {
        line[i].style.backgroundColor = "lightyellow";
    }
}

function LineClick(elem, MainID, FormID) {
    LineClicked = elem.className;
    ViewDisp(MainID, FormID);
}


function ManageColumns() {
    var arr = jsColumnsList.ALL; final = jsColumnsList.Selected;

    PopUp("SortTable", {
        title: "Manage Columns",
        type: "Columns",
        arr: arr.join("|").replace(/_/g, " ").split("|"),
        final: final.join("|").replace(/_/g, " ").split("|"),
        func: "execManageColumns()"
    }, null, true);
}

function execManageColumns() {
    var x = [];
    for (var i = 0; i < datSortTableFinal.length; i++) {
        x.push(datSortTableFinal[i].val);
    }
    dispFlds = x.join("|").replace(/ /g, "_").split("|");
    jsColumnsList.Selected = dispFlds;
    var xt = jsXTable.findIndex(d => d.main == displayReport)
    if (xt > -1)
        jsXTable[xt].jo.hdrs = dispFlds;

    Report();
    closePopUp("SortTable");
    
    getData(null, newFormData("_IAGetDisplayFields", { formid: currentFormID, dispFlds: dispFlds.join(",") }), function (vr) {
        //do nothing
    }, null, true);
}


// ============================================================
// SECTION: page (re)initialization — builds the results grid/report UI and column management
// ============================================================
function xStartMe(goMainID, dontpaint, wentBack) {
    currentSaveFormVals = {}
    //goMainID = 56;
    console.log("Hmmnnnn");
    wentBack = (!wentBack) ? 0 : 1;
    divBackButton.innerHTML = "";

    if (!dontpaint || goMainID != null) {
        xsection(divBackButton, [
            "label|icon=dashboard.png|icon.class=icon cursor|id=cdBackToDashboard|style=white-space:nowrap;|class=cursor|onclick=loc('Dashboard')|innerHTML=Dashboard",
            "br", "br",
            "label|icon=documentWhand.png|icon.class=icon cursor|id=cdReportList|style=white-space:nowrap;|class=cursor|onclick=PopUp('Saved Reports')|innerHTML=Saved Reports",
            "br", "br",
            "label|icon=expandPanel_rightarrow.png|icon.class=icon cursor|id=cdOtherForms|style=white-space:nowrap;|class=cursor|onclick=showHide('tdNextNav')|innerHTML=Applications",
            "br", "br",

        ]);

        tdMainNav.style.display = "none";
    }
    
    if (wentBack == 1) {
        beginGettingMain(null, null, wentBack);
    } else {


        //search main dates
        //var inputSearches = document.getElementsByName("cbSearchDT");
        //var arrSearchDTs = [];
        //for (var i = 0; i < inputSearches.length; i++) { arrSearchDTs.push(inputSearches[i].value); }
        //console.log(dateFilters);

        if (curCustom[0] != "") {
            var inputSearches = document.getElementsByName("cbSearchCustom");
            for (var i = 1; i < inputSearches.length; i++) {
                curCustom[i + 1] = inputSearches[i].value;
            }

        }

        var arr = [""]; // arrSearchDTs.concat(curCustom);
        arrSearchDTs = arr;
        arrSearchDTs = (init) ? [""] : arrSearchDTs;

        console.log(55, "_IAGet,_IAFormDisplay,_IAGetReportList,_IAGetDropdownValues,_IAUpdateRecordACS", //,_IAUpdateRecordStatus", //,_IAFormCounts", //_GetNewDashboardCounts,
            [
                { action: "Forms", formid: currentFormID },
                { formid: currentFormID },
                {},
                { formid: currentFormID },
                {},
                {}
                //{ formid: currentFormID }
                //{ FormOnly: 1 },

            ]);

        //BEGIN FROM DATABASE
        RunMultiSP("_IAGet,_IAFormDisplay,_IAGetReportList,_IAGetDropdownValues,_IAUpdateRecordACS", "_IAUpdateRecordStatus", //,_IAFormCounts", //_GetNewDashboardCounts,
            [
                { action: "Forms", formid: currentFormID },
                { formid: currentFormID },
                {},
                { formid: currentFormID },
                {},
                {},
                {}
                //{ formid: currentFormID }
                //{ FormOnly: 1 },

            ],
            function (js) {
                console.log("820", js);
                isMGT = (js[0][0].SectionCID == myCID) ? true : false;

                var sectID = js[0].filter(d => d.FormID == currentFormID)[0].SectionID;
                jsNeo.jsForm = js[0].filter(d => d.FormID == currentFormID || d.SectionID == currentFormID);
                jsNeo.jsForms = js[0].filter(d => d.SectionID == sectID);
                jsNeo.jsALL = []; //tmpCurRecords;
                jsDispFlds = js[1];
                jsReportList = js[2];
                jsDropDownValues = js[3];
                //jsNeo.jsCounts = js[3];
                //jsNeo.jsCounts = js[3]; //[{ Box: null, Type: null, FormID: null, Cnt: null }];
                jsNeo.jsCounts = [{ Box: null, Type: null, FormID: null, Cnt: null }];

                beginGettingMain(null, null, wentBack);


            }
        );
    }
}

function showButtons() {
    var btns = document.getElementsByName("hdrSection");
    for (var i = 0; i < btns.length; i++) { btns[i].style.display = ""; }
}

var CachedResults = false;
var includeMainID = 0;


//function beginGettingMain(goMainID, dontpaint, wentBack) {
//    wentBack = (!wentBack) ? 0 : 1;
//    CachedResults = (wentBack == 1) ? true : false;

//    try {
//        var MainFunc = function (js) {
//            includeMainID = 0;

//            var njs = [];
//            var FieldIDs = [];

//            if (js.length > 0)
//                FieldIDs = js[0].FieldIDs.split(",");

//            //set Col fields to X_[FldID]
//            for (var i = 0; i < js.length; i++) {
//                var jo = {};
//                for (var key in js[i]) {
//                    if (key.indexOf("Col") == 0) {
//                        var ix = (key.replace("Col", "") * 1) - 1;
//                        if (ix < FieldIDs.length)
//                            jo[FieldIDs[ix]] = js[i][key];
//                    } else {
//                        jo[key] = js[i][key];
//                    }
//                }
//                njs.push(jo);
//            }

//            showButtons();
//            beginWritingMain(goMainID, dontpaint, njs)
//        }


//        var useFormID = (!currentSaveFormVals.FormID) ? currentFormID : currentSaveFormVals.FormID;


//        var getcache = (includeMainID > 0 || !wentBack) ? 0 : 1;
//        var prms = { formid: useFormID, Init: (init) ? 1 : 0, MainID: includeMainID, GETCACHE: getcache };


//        if (dontrun) {
//            dontrun = false;
//            btnRunReport.className = "orangeButton";

//        } else {
//            console.log(1353, "_IAGETALLDATA260903", [prms]);
//            RunMultiSP("_IAGETALLDATA260903", [prms], function (js) {
//                console.log(1353, js);
//                RunMultiSP("_IAGetTriggered,_IAGetSubforms", [{ formid: useFormID }, { formid: useFormID }, { formid: useFormID }], function (xx) {
//                    try {
//                        jsTriggeredVals = normalizeJS(xx[0], "T_Headers", "TCol", ["T_FormMainID", "T_MainID"]);
//                        jsSubformVals = normalizeJS(xx[1], "Headers", "FCol", ["FormMainID"]);
//                    } catch (ex) {
//                        console.log(291, ex, js);
//                    }
//                    MainFunc(js[0]);
//                });

//            });
//        }

//    } catch (ex) {
//        console.log(291, ex);
//    }
//}

//function beginWritingMain(goMainID, dontpaint, js) {

//    try {
//        console.log("app3", js);

//        //var jsDispFlds = [];
//        var tmpCurRecords = js;

//        var tmpFlds = ["MainID", "Open_Closed", "Viewed", "Company", "Loaded_By", "Date_Loaded", "Modified_By", "Date_Modified", "Released_Date", "Released_By", "Status", "Info_Req", "Date_Locked"];
//        //set display fields
//        dispFlds = ["MainID", "Viewed", "Company", "Loaded_By", "Date_Loaded", "Modified_By", "Date_Modified", "Released_Date", "Status", "Info_Req", "Open_Closed", "Date_Locked"];
//        for (var i = 0; i < jsDispFlds.length; i++) {
//            if (dispFlds.indexOf(jsDispFlds[i].FieldName.replace(/ /g, "_")) == -1) {
//                dispFlds.push(jsDispFlds[i].FieldName.replace(/ /g, "_"));
//            }
//        }

//        //code:20240524:104pm - remove display field dupes
//        dispFlds = removeDupesFromArray(dispFlds);


//        //code: 20250517: 127pm switch to using shortnames
//        //var jsK = tmpCurRecords.filter(d => d.RecordType == "Fields");
//        var jsK = tmpCurRecords.filter(d => d.RecordType == "ShortNames");
//        var jsV = tmpCurRecords.filter(d => d.RecordType == "Values");
//        TCount = tmpCurRecords[0].TotalCount;
//        TCountString = (jsV.length - 1) + " of " + ((!TCount) ? 0 : TCount) + " records";

//        console.log(jsK, jsV);

//        var newJS = [];
//        try {
//            for (var i = 0; i < jsV.length; i++) {
//                var xx = jsV[i];
//                var kk = jsK[0];
//                var jo = {};
//                //console.log(xx);

//                //set main
//                //jo["strMainID"] = xx.strMainID;
//                //jo["Filters"] = xx.Filters;

//                for (var field in xx) {
//                    if (tmpFlds.indexOf(field) > -1) {
//                        //fields from tmp fields above
//                        jo[field] = xx[field];
//                    } else if (field.indexOf("X_") == 0) {
//                        //F and K fields
//                        var id = field.split("_")[1];
//                        jo[kk[field]] = xx["X_" + id];
//                        jo["F_" + id] = xx[field];
//                        jo["K_" + id] = kk[field];
//                    } else {
//                        jo[field] = xx[field];
//                    }
//                }
//                newJS.push(jo);
//            }
//            console.log(newJS);
//        } catch (e) {
//            console.log(e);
//        }
//        jsNeo.jsALL = newJS;
//        js = newJS;
//        deNullJS(js, true);


//        //set titles
//        currentSectionName = jsNeo.jsForm[0].SectionName;
//        currentFormName = jsNeo.jsForm[0].FormName;

//        if (!dontpaint || goMainID != null) {
//            IA_SectionName.innerHTML = "";
//            xsection(IA_SectionName, [
//                "label|style=color:orange|" + currentSectionName.replace(/_/g, " "),
//            ]);

//            IA_NavSect.innerHTML = "";
//            //showHide('tdNextNav')
//            var ht = (tdPageContainer.clientHeight / 2);
//            xsection(IA_NavSect, [
//                //"div|||label|icon=expandPanel_rightarrow.png|class=navsect|onclick=showHide('tdNextNav')|Other Forms",
//                //"div|class=smhdr shadowSection|Available Forms",
//                "div|style=height:" + ht + "px; overflow-y:auto|||" +
//                "table|id=tblIA_NavSect"
//            ]);
//            xsection(tblIA_NavSect, [
//                "tr",
//                "td|class=smhdr shadowSection|colspan=2|Forms",
//                "td|class=shadowSection|Open"
//            ]);

//            if (jsNeo.jsForms.length == 1) {
//                var xx = jsNeo.jsForms[0];
//                var jsc = jsNeo.jsCounts.filter(d => d.FormID == xx.FormID);
//                var cnt = (jsc.length > 0) ? "|||td|class=sm|style=taxt-align:right|[" + jsc[0].Cnt + "]" : "";

//                xsection(tblIA_NavSect, [
//                    "tr" +
//                    "|||td|class=sm|colspan=2|style=background-color:whitesmoke; border:solid 2px rgb(229, 233, 240);|" + xx.FormName +
//                    "|||td|class=sm|id=FormCount_" + xx.FormID + "|[...]"
//                ]);
//            } else {

//                for (var i = 0; i < jsNeo.jsForms.length; i++) {
//                    var xx = jsNeo.jsForms[i];
//                    var jsc = jsNeo.jsCounts.filter(d => d.FormID == xx.FormID);
//                    var cnt = (jsc.length > 0) ? "|||td|class=sm|style=taxt-align:right|[" + jsc[0].Cnt + "]" : "";

//                    xsection(tblIA_NavSect, [
//                        "tr" +
//                        "|||td" + ((xx.FormID != currentFormID) ?
//                            "|title=Add Record|class=sm cursor|style=color:blue|onclick=ViewDisp(0, '" + xx.FormID + "')|+" :
//                            "") +
//                        "|||td|" + ((xx.FormID == currentFormID) ?
//                            "title=Current Form|class=sm navlinkLeftSelected|" :
//                            "title=Launch Form|class=sm navlinkLeft|onclick=LaunchApplication('InteractiveForm','" + xx.FormID + "')|") +
//                        "" + xx.FormName +
//                        "|||td|title=Total Open Records|class=sm|id=FormCount_" + xx.FormID + "|[...]"
//                    ]);
//                }
//                //ViewDisp()
//            }
//            getData(null, newFormData("_IAFormCounts", {}), function (vr) {
//                var js = jparse(vr);
//                for (var i = 0; i < js.length; i++) {
//                    var xx = js[i];
//                    if (document.getElementById("FormCount_" + xx.FormID) != null)
//                        document.getElementById("FormCount_" + xx.FormID).innerHTML = "[" + xx.Cnt + "]";
//                }
//            }, null, true);


//        }

//        //set array filters
//        arrFilters = js[0].Filters.split("|")[4].split("~");

//        //set dates
//        try {
//            var dts = [];
//            dts.push(js[0].Filters.split("|")[0]);
//            dts.push(js[0].Filters.split("|")[1]);
//            dts.push(js[0].Filters.split("|")[2]);
//            dts.push(js[0].Filters.split("|")[3]);
//            arrDTs = dts;

//        } catch (ex) {
//            console.log(ex);
//        }

//        console.log("here");

//        //Create New JS replacing F_FieldID with FieldDescription
//        var tmpFlds = ["MainID", "Open_Closed", "Viewed", "Company", "Loaded_By", "Date_Loaded", "Modified_By", "Date_Modified", "Released_Date", "Released_By", "Status", "Info_Req", "Date_Locked"];
//        availFlds = tmpFlds;
//        var jsChart = [];
//        console.log(js);

//        //code:20250517:127pm do not display Info fields as available
//        //set availflds
//        var xx = js[0];
//        console.log(350, xx);
//        var ft = xx.FieldTypes.toLowerCase().split(",");
//        var mgts = xx.MGTs.split(",");
//        var i = 0;
//        for (var key in xx) {
//            if (key.indexOf("K") == 0) {
//                if (ft[i] != "info" && (mgts[i] == "0" || isMGT))
//                    availFlds.push(xx[key].replace(/ /g, "_"));

//                i++;
//            }
//        }

//        var newJS = [];
//        for (var i = 0; i < js.length; i++) {
//            var xx = js[i];
//            var jo = {};
//            var chartJO = {};

//            //set main
//            chartJO["strMainID"] = xx.strMainID;
//            var af = 0;
//            for (var field in xx) {
//                //code:20250517:127pm removed and set above

//                //set available fields
//                //console.log(xx.FieldTypes.split(",")[af]);
//                //if (field.indexOf("K") == 0 && i == 0) {
//                //    if (availFlds.indexOf(xx[field].replace(/ /g, "_")) == -1) {
//                //        availFlds.push(xx[field].replace(/ /g, "_"));
//                //        availFldTypes.push(xx.FieldTypes.replace(/ /g, "_"));
//                //        af++;
//                //    }
//                //}

//                //set jschart
//                if (tmpFlds.indexOf(field) > -1) {
//                    //fields from tmp fields above
//                    chartJO[field] = xx[field];
//                } else if (field.indexOf("K") == 0) {
//                    //F and K fields
//                    var key = xx[field].replace(/ /g, "_");
//                    var val = xx[field.replace("K", "F")];
//                    chartJO[key] = val;
//                }

//                jo[field] = xx[field];
//            }
//            newJS.push(jo);
//            jsChart.push(chartJO);
//        }
//        js = newJS;

//        //code:20250517:127pm set where recordtype not shortnames
//        jsNeo.jsALL = js;
//        jsNeo.jsChart = jsChart.filter(d => d.MainID != 0 && d.RecordType != "ShortNames");
//        jsNeo.jsADD = js.filter(d => d.MainID == 0 && d.RecordType != "ShortNames");
//        jsNeo.jsChart = (jsNeo.jsChart.length == 0) ? jsNeo.jsADD : jsNeo.jsChart;
//        jsNeo.jsFiltered = jsNeo.jsChart;
//        //end New JS

//        console.log(1353, jsNeo.jsFiltered);

//        if (!dontpaint || goMainID != null) {
//            console.log(dispFlds);
//            dispBuildSearch(js, availFlds);
//            PageContainer.style = "";
//        }
//        if (goMainID != null) { ViewDisp(goMainID); }
//    } catch (err) {
//        console.log(1353, err);
//        //alert(err);
//    }

//    init = false;


//}

//code:20240522:1000am - Sort Columns function

function selectManageColumnsCheckboxes() {
    //code:20240524:104pm - make sure checked fields match dispFlds
    var opts = document.getElementsByName("ddDisplayFields");

    for (var i = 0; i < opts.length; i++) {
        opts[i].checked = false;
    }

    for (var i = 0; i < opts.length; i++) {
        if (dispFlds.indexOf(opts[i].value.replace(/ /g, "_")) > -1)
            opts[i].checked = true;
    }
}
// ============================================================
// SECTION: report rendering (DrawIAReport) and filter-chip UI (add/edit/run date & quick-search filters)
// ============================================================
function DrawIAReport() {
    getData(null, newFormData("_IAGetDisplayFields", { formid: currentFormID }), function (vr) {
        var js = jparse(vr);
        if (js.length > 0)
            dispFlds = js[0].DispFlds.split(",");
        //code:20240524:104pm - remove display field dupes
        dispFlds = removeDupesFromArray(dispFlds);

        selectManageColumnsCheckboxes();




        displayReport.innerHTML = "";
        console.log(jsNeo.jsFiltered);
        //if (dispFlds.indexOf("TotalCount") == -1) { dispFlds.unshift("TotalCount"); }
        //alert(dispFlds.toString());

        if (jsNeo.jsFiltered.filter(d => d.MainID != 0).length > 0) {
            jsExportGChart = jsNeo.jsFiltered;

            //main report headers
            var hdrs = [];
            for (var key in jsExportGChart[0]) {
                hdrs.push(key);
            }

            //add empty values for trigger fields
            for (var i = 0; i < jsExportGChart.length; i++) {
                var xx = jsExportGChart[i];
                for (var key in jsTriggeredVals[0]) {
                    if (hdrs.indexOf(key) == -1)
                        xx[key] = "";
                }
            }
            //add empty values for subform fields
            for (var i = 0; i < jsExportGChart.length; i++) {
                var xx = jsExportGChart[i];
                for (var key in jsSubformVals[0]) {
                    if (hdrs.indexOf(key) == -1)
                        xx[key] = "";
                }
            }

            //update trigger values when mainid matches
            for (var i = 0; i < jsTriggeredVals.length; i++) {
                var xx = jsTriggeredVals[i];
                var ix = jsExportGChart.findIndex(d => d.MainID == xx.T_FormMainID);

                if (ix > -1) {
                    for (var key in xx) {
                        if (hdrs.indexOf(key) == -1)
                            jsExportGChart[ix][key] = xx[key];
                    }
                }
            }
            //update subform values when mainid matches
            for (var i = 0; i < jsSubformVals.length; i++) {
                var xx = jsSubformVals[i];
                var ix = jsExportGChart.findIndex(d => d.MainID == xx.FormMainID);

                if (ix > -1) {
                    for (var key in xx) {
                        if (hdrs.indexOf(key) == -1)
                            jsExportGChart[ix][key] = xx[key];
                    }
                }
            }

            console.log(242, dispFlds, jsExportGChart);

            getData(null, newFormData("_GetGChartSort", { div: "displayReport", type: currentFormID }), function (vr) {
                var js = jparse(vr);
                var xsort;
                if (js.length == 0)
                    xsort = ["MainID", true];
                else
                    xsort = [js[0].Field, js[0].FieldDesc];

                xsort[1] = (!xsort[1]) ? null : xsort[1];

                console.log(613, js);
                getGChartTable(jsExportGChart, dispFlds, displayReport,
                    [{ Func: "ViewDisp", Params: ["MainID", "FormID"], Cols: [0] }], [{ a: "MainID", b: "strMainID" }],
                    null, null, true, xsort, null, null, null, null, null, null, currentFormID
                );
            });
        } else {
            var xx = jsNeo.jsADD[0];
            var jo = {};
            for (var key in xx) {
                jo[key] = "";
            }
            var js = [jo];
            jsExportGChart = js;
            //console.log(dispFlds);
            getGChartTable(js, dispFlds, displayReport, []);
        }


        if (LaunchMainID * 1 > 0) {
            //alert(LaunchMainID);
            ViewDisp(LaunchMainID);
        }

        LaunchMainID = 0;

    }, null, true);
}

function displayFilters(dateState) {
    //DISPLAY FILTERS

    lblFilters.innerHTML = "";
    console.log(arrFilters);
    for (var i = 0; i < arrFilters.length; i++) {
        var dsp = "";
        if (arrFilters[i] != "") {
            var arr = arrFilters[i].split("^");
            if (arr[1] == "Quick Search") { dsp = arr[2]; }
            else { dsp = arr[1] + ": " + arr[2]; }

            xsection(lblFilters, ["label|class=padLeft10", "button|style=border:solid 1px orange|onclick=editFilterChart(null, null, '" + arrFilters[i] + "')|" + dsp]);
        }
    }
    if (dateState) {
        var dts = dateFilters;
    } else {
        var dts = arrDTs;
    }
    //console.log(dateState, dts, arrDTs);
    //for (var i = 0; i < dts.length; i++) {
    //    if (dts[i] != "") {
    //        //var date = new Date(dts[i] + " 23:59:59.100").toISOString().split('T')[0];
    //        var date = new Date(dts[i]).toISOString().split('T')[0];
    //        console.log(768, dts[i], date);
    //        dbn("cbSearchDT")[i].value = date;
    //        //alert(date);
    //    }
    //}
}

var dateFilters = [];

var newFilter;

function runEditFilter() {
    custFilters.value = ((newFilter.split("^")[0] == "Quick Search") ? "" : newFilter.split("^")[0]) + ":" + newFilter.split("^")[1];
    txtFilters.value = newFilter.split("^")[2];

    newFilter = null;
    filterChart(null, true);
}

function txtEditFilter_keyup(e) {
    if (e.keyCode == 13) {

    }
}

function editFilterChart(e, go, str, gogo) {
    var arr = str.split("^");
    if (!go) {
        xconfirm(null, [
            "div|<b>Edit Filter for: </b> " + arr[1],
            "label|class=padLeft10 padTop10|style=width:100%|||input|style=width:100%; height:40px|id=txtEditFilter",
        ]);

        confirmFooter.innerHTML = "";
        xsection(confirmFooter, [
            "button|class=blueButton|onclick=xconfirm()|Cancel",
            "label|class=padLeft10|",
            "button|class=longorangeButton|style=width:150px|onclick=dontrun~true; editFilterChart(null, true, '" + str + "')|Submit Edit",
            "label|class=padLeft10|",
            "button|class=longredButton|style=width:150px|onclick=dontrun~true; xconfirm(); filterChart(null, true, '" + str + "')|Remove Filter",
        ])

        confirmWindow.style.height = "170px";
        confirmWindowInner.style.height = "120px";

        txtEditFilter.value = arr[2].toUpperCase();
        txtEditFilter.focus();
    } else {
        newFilter = arr[0] + "^" + arr[1] + "^" + txtEditFilter.value;
        xconfirm();
        filterChart(null, true, str);
    }
}
function filterChart(e, go, str, gogo, func) {
    try {
        if (!go) { go = (e.keyCode == 13) ? true : false }

        if (go) {
            var type = custFilters.value;
            var ftr = txtFilters.value;
            custFilters.selectedIndex = 0;
            txtFilters.value = "";
            //alert(type);
            console.log(689, custFilters);

            var fullStr = (str != null) ? str : (ftr == "") ? "" : type.replace(":", "^") + "^" + ftr.replace(/:/g, "").replace(/^/g, "").replace(/~/g, "");


            var ix = arrFilters.indexOf(fullStr);
            if (ix > -1) {
                arrFilters.splice(ix, 1);
            } else {
                if (fullStr != "") { arrFilters.push(fullStr); }
            }

            var reloadMe = false;
            if (fullStr.split("^")[1] != "Quick Search") {
                reloadMe = true;
            }

            var dts = ["", "", "", ""]; // document.getElementsByName("cbSearchDT");
            var filters = [];
            for (var i = 0; i < dts.length; i++) {
                filters.push(dts[i].value);
            }
            dateFilters = filters;
            filters.push(arrFilters.join("~"));
            console.log(filters);
            //alert(reloadMe);
            //alert(gogo);


            if (fullStr != "" || gogo) {
                getData(null, newFormData("_IAUpdateFilters", { formid: currentFormID, filters: filters.join("|") }), function (vr) {
                    if (newFilter) {
                        runEditFilter();
                    } else {
                        if (reloadMe) {
                            beginGettingMain(null, null, 0);
                            runQuickSearch(arrFilters, true);
                        }
                        else {
                            runQuickSearch();
                        }
                    }
                }, null, true);
            } else {
                runQuickSearch();
            }
        }
    } catch (ex) {
        alert(ex);
    }
}




function runQuickSearch(arr, dateState) {
    jsNeo.jsFiltered = jsNeo.jsChart;

    displayFilters(dateState);
    var js = jsNeo.jsChart;
    
    getData(null, newFormData("_IAQuickSearch", { formid: currentFormID }), function (vr) {
        var xx = jparse(vr);
        console.log("err ftrs", xx, js);
        var arr = [];
        for (var i = 0; i < xx.length; i++) { arr.push(xx[i].MainID); }
        jsNeo.jsFiltered = (xx[0].QS == 0) ? js : js.filter(d => arr.indexOf(d.MainID) > -1);

    
        // var runarr = [];
        // for (var i = 0; i < arrFilters.length; i++) {
        //     var arr = arrFilters[i].split("^");
        //     if (arr.length == 3) {
        //         var type = arr[1];
        //         var ftr = arr[2].toLowerCase();
        //         if (type == "Quick Search") {
        //             runarr.push(arrFilters[i]);
        //         }
        //     }
        // }

        // var newJS = (runarr.length == 0) ? js : [];

        // var qfilters = [];
        // for (var i = 0; i < arrFilters.length; i++) {
        //     var arr = arrFilters[i].split("^");

        //     if (arr.length == 3) {
        //         var type = arr[1];
        //         var ftr = arr[2].toLowerCase();
        //         if (type == "Quick Search") {
        //             qfilters.push(ftr.toLowerCase());
        //         }
        //     }
        // }
        // console.log("qsearch", qfilters);

        // var unmatchedIDs = [];
        // for (var i = 0; i < js.length; i++) {
        //     var xx = js[i];

        //     var matches = [];
        //     if (qfilters.length > 0) {
        //         for (var ii = 0; ii < qfilters.length; ii++) {
        //             var tmpMatched = false;
        //             var tmpMatchedOn = [];
        //             for (var key in xx) {
        //                 if (xx[key].toString().toLowerCase().indexOf(qfilters[ii]) > -1) {
        //                     tmpMatched = true;
        //                     tmpMatchedOn.push(key);
        //                     tmpMatchedOn.push(qfilters[ii]);
        //                     break;
        //                 }
        //             }
        //             matches.push({ matched: tmpMatched, matchedOn: tmpMatchedOn });
        //         }
        //     }

        //     if (matches.filter(d => d.matched == false).length > 0) { unmatchedIDs.push(xx.MainID); }
        //     //console.log("qsearch", jstring(matches), xx.MainID);
        // }

        // newJS = js.filter(d => unmatchedIDs.indexOf(d.MainID) == -1);

        // if (newJS.length == 0) { newJS = jsNeo.jsADD; }
            //SET JSFILTERED

        //jsNeo.jsFiltered = newJS;

        if (!dontrun)
            DrawIAReport();
        else if (arrFilters.length > 0)
            if (arrFilters[arrFilters.length - 1].split("^")[1] == "Quick Search")
                    DrawIAReport();
    });
}

// ============================================================
// SECTION: opening a record for view/edit (ViewDisp/ViewDispGO — the big one), approval status
// ============================================================
function tableLineSelect(MainID) {
    if (MainID == 0) { AddDisp(); }
    else { ViewDisp(MainID); }
}

var jsInnerFormData = [];

function ViewDisp(MainID, FormID, clone, sentfunc) {
    MainID = (!MainID) ? 0 : (MainID == -1) ? 0 : MainID;
    xtFilterState = null; closeDropMenu();

    dispMain.innerHTML = "";
    dispReportOuter.style.visibility = "hidden";
    console.log("err", jsNeo.jsALL);
    console.log(1475, jsNeo.jsALL, jsNeo.jsFiltered);
    console.log(1475, jsNeo.jsALL[jsNeo.jsALL.findIndex(d => d.MainID == MainID)], jsNeo.jsALL.findIndex(d => d.MainID == MainID), MainID);
    jsNeo.jsALL[jsNeo.jsALL.findIndex(d => d.MainID == MainID)].Viewed = "TRUE";
    try { jsNeo.jsFiltered[jsNeo.jsFiltered.findIndex(d => d.MainID == MainID)].Viewed = "TRUE" } catch (ex) { };
    exportJS[exportJS.findIndex(d => d.MainID == MainID)].Viewed = "TRUE";


    cloneID = (!clone) ? null : MainID;

    curMainID = MainID;
    jsInnerFormData = [];
    FormID = (!FormID) ? currentFormID : FormID;

    console.log("app3", "_IAGetFormData,_IAGetJoinRecord,_IAGetFieldMGTData,_IAGetMultiAnswers,_IAGetDataBlanks", [
        { MainID: MainID, FormID: FormID },
        { MainID: MainID },
        { MainID: MainID },
        { MainID: MainID },
        { FormID: FormID }
    ]);

    try {
        RunMultiSP("_IAGetFormData,_IAGetJoinRecord,_IAGetFieldMGTData,_IAGetMultiAnswers,_IAGetDataBlanks,_IAGetSetAprovalBy", [
            { MainID: MainID, FormID: FormID },
            { MainID: MainID },
            { MainID: MainID },
            { MainID: MainID },
            { FormID: FormID },
            { FormID: FormID, Fieldname: "", MainID: MainID }
        ], function (js) {
            console.log("app3", FormID, js);
            var jsSingle = js[0];
            var jsJoin = js[1];
            var jsMgtData = js[2];
            var jsMultiAnswers = js[3];
            var jsBlanks = js[4];
            var joSetApprovalBy = js[5][0];

            jsSingle[0].ApprovalBy = joSetApprovalBy;

            var njo = jsBlanks[0];
            console.log("app3", njo);
            try {
                for (var i = 0; i < jsBlanks.length; i++) {
                    var jo = jsBlanks[i];
                    var ff = jo.FieldIDs.replace(/X_/g, "F_").split(",");
                    var kf = jo.FieldIDs.replace(/X_/g, "K_").split(",");
                    njo[ff[jo.ix]] = "";
                    njo[kf[jo.ix]] = jo.FieldName;
                    njo[jo.FieldName] = "";
                }
            } catch (err) {
                console.log("app3", err)
            }



            var JoinedID, JoinedTitle;
            if (jsJoin.length > 0) {
                JoinedID = jsJoin[0].JoinedID;
                JoinedTitle = jsJoin[0].JoinedTitle;
            }

            var exJS = []
            if (MainID > 0)
                exJS = jsNeo.jsALL.filter(d => d.MainID == MainID && d.FormID == jsSingle[0].FormID)[0];
            else
                exJS = njo;

            console.log("err", jsSectionForms, FormID);
            currentSaveFormVals.SectionID = js[0].SectionID; // jsSectionForms.filter(d => d.FormID == FormID)[0].SectionID;
            currentSaveFormVals.FormID = FormID;

            ViewDispGO(exJS, jsSingle, JoinedID, JoinedTitle, jsMgtData, jsMultiAnswers, sentfunc);

        });
        //});
    } catch (ex) {
        console.log(ex);
    }
}

function SetApprovalStatus(main, mainid, go, AD, gobaby) {
    if (!go) {
        var ix = main.id.split("_")[1];
        document.getElementById("btnPopUpClose_" + ix).innerHTML = "Cancel";

        xsection(main, [
            "br",
            "button|class=blueButton|onclick=SetApprovalStatus(null, " + mainid + ", true, 0)|Approve",
            "br", "br", "br",
            "button|class=blueButton|onclick=SetApprovalStatus(null, " + mainid + ", true, 1)|Decline"
        ]);
    } else if (!gobaby) {
        xconfirm("Are you sure you want to " + ((AD == 0) ? "Approve" : "Decline") + " this record?",
            null,
            "SetApprovalStatus(null, " + mainid + ", true, " + AD + ", true)");
    } else {
        //alert("_IAApproveDecline mainid: " + mainid + ", ad: " + AD );
        getData(null, newFormData("_IAApproveDecline", { mainid: mainid, ad: AD }), function(vr) {
            console.log("approvalBy", "_IAApproveDecline", { mainid: mainid, ad: AD }, vr);
            xconfirm();
            closePopUp("Set Approval Status");
            GetMain(mainid);
            SendEmailAlert("Form Applications", mainid.toString());
        });
    }
}

function showHideAddtlInfo() {
    dispAddtlInfo_inner.style.display = (showAddtlInfo) ? "none" : "";
    dispAddtlInfo_Button.style.display = (showAddtlInfo) ? "none" : "";
    showAddtlInfo = (showAddtlInfo) ? false : true;
}

function EditAdditionalInfo(RecordAddtlInfoID) {
    var recordid = jsRequestAdditionalInfo.filter(d => d.RecordAddtlInfoID == RecordAddtlInfoID)[0].RecordID;
    PopUp("Request Additional Info", [recordid, RecordAddtlInfoID], null, null, ["300px", "700px"]);
}

function RequestAdditionalInfo(main, dat, go) {
    if (!go) {
        var txt = "", accepted = 0;
        if (dat[1] != "") {
            var js = jsRequestAdditionalInfo.filter(d => d.RecordAddtlInfoID == dat[1])[0];
            txt = (!isMGT) ? js.Response : (dat[3] != null) ? js.Response : js.Details;
            accepted = (js.Accepted) ? 1 : 0;
        }

        var rr = (dat[3] == null) ? "null" : "true";
        PopUpOpt(main, "button|class=blueButton|onclick=RequestAdditionalInfo(null, ['" + dat.join("', '") + "'," + accepted + "," + rr + "], true)|Submit");
        if (isMGT) { PopUpOpt(main, "button|class=longblueButton|onclick=RequestAdditionalInfo(null, ['" + dat.join("', '") + "',1," + rr + "], true)|Submit & Accept"); }
        if (isMGT && dat[1] != "" && dat[3] == null) {
            PopUpOpt(main, "button|class=blueButton|" +
                "onclick=closePopUp('Request Additional Info'); PopUp('Request Additional Info', ['" + dat.join("', '") + "'," + accepted + ", true], null, null, ['300px','700px'])|Respond");
        }

        xsection(main, [
            "textarea|id=txtAddtlInfo|style=resize:none; width:100%;height:100%|" + txt
        ]);

    } else {
        var subData = [{
            RecordID: dat[0],
            RecordAddtlInfoID: dat[1],
            details: (!isMGT) ? "" : (dat[3] != null) ? "" : txtAddtlInfo.value,
            response: (!isMGT) ? txtAddtlInfo.value : (dat[3] != null) ? txtAddtlInfo.value : "",
            accepted: dat[2]
        }, { RecordID: dat[0] }];
        console.log(subData);

        getData("#adHocMulti", newFormData("_IARequestAddtlInfo,_IAGetAdditionalInfo", subData), function (vr) {
            var js = jparse(vr);
            var jsNotification = js[0];
            var jsInfo = js[1];
            jsRequestAdditionalInfo = jsInfo;
            console.log(jsInfo);

            //SEND EMAIL NOTIFICATION
            if (jsNotification.length > 0) {
                //var msgJS = { msgTo: jsNotification[0].msgTo, msgSubject: jsNotification[0].msgSubject, msgBody: jsNotification[0].msgBody };
                //var data = newFormData("adHocSendMail", msgJS);
                //getData("#adHocSendMail", data, function (vr) {
                //    console.log("Sent Email", msgJS);
                //}, null, true);
                SendEmailAlert("Form Applications", curMainID.toString());
            }

            dispAddtlInfo_inner.innerHTML = "";
            if (jsInfo.length == 0) {
                xsection(dispAddtlInfo_inner, ["div|class=sm pad10|There is no additional info requested for this record"]);
            } else {
                getGChartTable(jsInfo, ("Details,Details_By,Details_Modified,Response,Response_By,Response_Modified,Accepted").split(","), dispAddtlInfo_inner,
                    [{ Func: "EditAdditionalInfo", Params: ["RecordAddtlInfoID"], Cols: [0] }], null, null, null, null, ["Details_Modified", true]);
            }
            closePopUp("Request Additional Info");

            dispAddtlInfo_status.innerHTML = "";
            console.log(1003, jsInfo.filter(d => !d.Accepted));
            if (jsInfo.filter(d => !d.Accepted).length > 0) {
                dispAddtlInfo_status.innerHTML = " Additional Info Pending"
            }
        }, null, true);
    }
}

//code:20240522:825am - Prev Next buttons
function DisplayPrevNext(MainID, PN) {
    var ix = jsNeo.jsFiltered.findIndex(d => d.MainID == MainID);
    MainID = jsNeo.jsFiltered[ix + PN].MainID
    ViewDisp(MainID);
}


function IAViewPDF(MainID, Filename, hasDoc) {
    if (!hasDoc) {
        PopUp("View PDF", Filename, null, true);
    }
    else {
        xconfirm(null, [
            "button|class=longblueButton|style=width:95%|onclick=exportDoc(" + MainID + ", '" + Filename + "'); xconfirm();|Export Merged Document",
            "br",
            "button|class=longblueButton|style=width:95%|onclick=PopUp('View PDF', '" + Filename + ".pdf', null, true); xconfirm();|View CMS Document",
        ], "cancel");
    }

}


// ============================================================
// SECTION: Share to Mailbox — composes a message in the separate CMSMailbox
// companion app referencing this IA Form Application record (FormID+MainID).
// Deliberately built as a small self-contained modal (own overlay/DOM) rather than
// through PopUp()'s named-section dispatch, since that system's registration
// internals weren't traced as part of this change and this keeps the new feature
// isolated from it. Uses plain fetch() against MailboxShareController's routes
// directly (main/GetMailboxRecipientCandidates, main/SubmitMailboxMessage) rather
// than the generic adHoc()/getData() helper, since those routes are NOT part of the
// "_"-prefixed generic stored-proc dispatch the rest of this app's AJAX calls use.
//
// IMPORTANT: this only creates a notification/pointer in CMSMailbox — it does not
// itself grant the recipient any access. CMSMailbox independently re-verifies the
// recipient's own CMSNEO permissions every time they try to open the shared record.
// ============================================================
function ShareToMailbox(MainID, FormID, Label) {
    var existing = document.getElementById("shareMailboxOverlay");
    if (existing) existing.parentNode.removeChild(existing);

    var overlay = document.createElement("div");
    overlay.id = "shareMailboxOverlay";
    overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.4);z-index:9999;display:flex;align-items:center;justify-content:center";

    var box = document.createElement("div");
    box.style.cssText = "background:#fff;border-radius:4px;padding:20px;min-width:420px;max-width:90%;box-shadow:0 4px 20px rgba(0,0,0,0.3)";
    box.id = "shareMailboxBox";
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    xsection(box, [
        "div|style=font-size:16px;font-weight:bold;margin-bottom:10px|Share to Mailbox",
        "label|Recipients:", "br",
        "select|id=shareMailboxRecipients|multiple=true|style=width:100%;height:90px", "br", "br",
        "label|Subject:", "br",
        "input|id=shareMailboxSubject|style=width:100%|value=Shared: " + Label, "br", "br",
        "label|Message:", "br",
        "textarea|id=shareMailboxBody|style=width:100%;height:70px", "br", "br",
        "div|id=shareMailboxError|class=red", "br",
        "button|class=blueButton|onclick=CloseShareToMailbox()|Cancel",
        "label|class=padLeft10",
        "button|class=longblueButton|onclick=SubmitShareToMailbox(" + MainID + ",'" + FormID + "','" + Label + "')|Send"
    ]);

    fetch("../main/GetMailboxRecipientCandidates?mainId=" + MainID, {
        headers: { "Authorization": "Bearer " + UserToken }
    })
        .then(function (r) { return r.text(); })
        .then(function (vr) {
            var dat = jparse(vr);
            var sel = document.getElementById("shareMailboxRecipients");
            for (var i = 0; i < dat.length; i++) {
                var opt = document.createElement("option");
                opt.value = dat[i].UID;
                opt.text = dat[i].Name + " <" + dat[i].Email + ">";
                sel.appendChild(opt);
            }
        })
        .catch(function (ex) { console.log("GetMailboxRecipientCandidates failed", ex); });
}

function CloseShareToMailbox() {
    var overlay = document.getElementById("shareMailboxOverlay");
    if (overlay) overlay.parentNode.removeChild(overlay);
}

function SubmitShareToMailbox(MainID, FormID, Label) {
    var sel = document.getElementById("shareMailboxRecipients");
    var recipients = [];
    for (var i = 0; i < sel.options.length; i++) {
        if (sel.options[i].selected) recipients.push(parseInt(sel.options[i].value));
    }

    var errDiv = document.getElementById("shareMailboxError");
    if (recipients.length == 0) {
        errDiv.innerHTML = "Select at least one recipient.";
        return;
    }

    var payload = {
        subject: document.getElementById("shareMailboxSubject").value,
        body: document.getElementById("shareMailboxBody").value,
        recipients: recipients,
        items: [{
            ItemType: "IAFormRecord",
            ItemID: String(MainID),
            ItemLabel: Label,
            OwnerCID: myCID,
            FormID: FormID
        }]
    };

    var fd = new FormData();
    fd.append("strjson", JSON.stringify(payload));

    fetch("../main/SubmitMailboxMessage", {
        method: "POST",
        headers: { "Authorization": "Bearer " + UserToken },
        body: fd
    })
        .then(function (r) { return r.text(); })
        .then(function (vr) {
            var res = jparse(vr);
            if (res.status == "ok") {
                CloseShareToMailbox();
            } else {
                errDiv.innerHTML = "Could not send: " + res.status;
            }
        })
        .catch(function (ex) {
            errDiv.innerHTML = "Send failed — see console.";
            console.log("SubmitMailboxMessage failed", ex);
        });
}


var isReleased, displayMergeFields, displayFieldIDs;
function ViewDispGO(js, jsVals, JoinedID, JoinedTitle, jsMgtData, jsMultiAnswers, sentfunc) {
    curRecord = jsVals;
    console.log("err", js, jsVals);
    //currentFormID
    var RecordCID = jsVals[0].MainCID;
    var AdminCID = jsVals[0].FormCID;
    var SystemLinkType = jsVals[0].SystemLinkType;
    var SystemLinkFID = jsVals[0].SystemLinkFID;
    var SystemLinkFilename = jsVals[0].SystemLinkFilename;

    try {
        jsNeo.jsALL.filter(d => d.MainID == jsVals[0].MainID)[0].UnreadNotes = "";
        jsNeo.jsALL.filter(d => d.MainID == jsVals[0].MainID)[0].UnseenAttachments = "";
        jsNeo.jsFiltered.filter(d => d.MainID == jsVals[0].MainID)[0].UnreadNotes = "";
        jsNeo.jsFiltered.filter(d => d.MainID == jsVals[0].MainID)[0].UnseenAttachments = "";
    } catch (ex) { }


    displayMergeFields = {};
    displayFieldIDs = {};
    console.log("err", jsVals)
    for (var i = 0; i < jsVals.length; i++) {
        var jo = jsVals[i];
        var fn = (jo.ShortName != "") ? jo.ShortName : jo.FieldName;

        if (jo.FormFieldName != "" && jo.FieldType.toLowerCase() != "form")
            displayMergeFields[jo.FormFieldName] = jo.Val;

        if (["form", "existing", "info", "static"].indexOf(jo.FieldType.toLowerCase()) == -1)
            displayFieldIDs[fn] = jo.FieldID;
    }

    dispMain.innerHTML = "";
    var tw = "100%";
    var cw = "150px";
    deNullJS(js);
    console.log(94777, js, jsVals);
    try {
        EditOnOff = (jsVals[0].MainCID == myCID && !jsVals[0].RecordLocked) ? true :
            (jsVals[0].RecordLocked) ? false :
                (jsVals.filter(d => ["both", "only"].indexOf(d.MGMT.toLowerCase()) > -1) && isMGT) ? true :
                    (jsVals.filter(d => d.NetMGT)) ? true :
                        (justSigned) ? false :
                            (js.Locked) ? false :
                                (js.CID == myCID) ? true :
                                    false;

        var MGTEditOnOff = (jsVals[0].RecordLocked) ? false :
            (jsVals.filter(d => isMGT && d.MGT && js.Released_Date != "").length > 0) ? true :
                false;
    } catch (ex) {
        console.log(94777, ex);
    }
    console.log(94777, dispMain);
    //alert(document.body.clientHeight - 500);
    xsection(dispMain, [
        "div|id=dispTopPanner|class=shadowSection",
        "br",
        "div|id=ViewDispute|class=pad10|style=height:" + (document.body.clientHeight - 200) + "px; overflow-y:auto"]);


    console.log("err 1997", js);
    if (justSigned) {
        js.Status = "Signature queued."
    } else if (js.Status == "Not sent for signatures") {
        exportDoc(js.MainID, js.Application_Type.replace(/ /g, "_") + ".pdf")
        xconfirm(null, [
            "div|Please review this document and click \"Send for Signatures\" when ready to sign.",
            "br", "br",
            "div|The signature process will notify the default signer set up in System Administration."
        ]);
    }
    justSigned = false;

    //BUILD BANNER
    xsection(dispTopPanner, [
        //code:20241108:jk:clone record
        "table|style=width:100%|||tr|||append|" +
        "td|class=smhdr|MainID: " + ((cloneID != null) ? " [ New ] " : (js.MainID == 0) ? " [ NEW ] " : js.strMainID) +
        "|||append|label|id=IARecordStatus|style=font-size:10px; color:red|class=padLeft10|" + ((cloneID != null) ? "cloned from " + js.MainID : (js.Status != "") ? js.Status : " ") +
        "|||label|id=IARecordApproveDecline|class=padLeft10" +
        "|||label|id=dispButtons|class=padRight10|style=float:right; white-space:nowrap",
        ((SystemLinkFID) ? "div|id=dispSystemLink|Filename:|||label|class=alink padLeft10|onclick=reportLoadFiles(" + SystemLinkFID + ",'" + SystemLinkFilename + "','" + SystemLinkType + "')|Filename:" + SystemLinkFilename : "")
        
    ]);



    //BUILD BUTTONS
    if (js.MainID > 0) {
        xsection(dispButtons, [
            "button|id=btnHistory|icon=history.png|class=cursor|onclick=PopUp('Record History'," + js.MainID + ")|",
            "label|class=padRight10"
        ]);
        btnHistory.style.display = "none";
    }

    if (JoinedID != null) {
        xsection(dispButtons, [
            "button|class=longblueButton|onclick=PopUp('Joined', " + JoinedID + ", '" + JoinedTitle + " [" + JoinedID + "]', null, ['600px','1000px'])|" + JoinedTitle,
            "label|class=padLeft10"
        ]);

    }

    xsection(dispButtons, [
        "button|id=iaBackBtn|class=blueButton|onclick=SwitchReport()|<-- Back",
        "label|class=padLeft10"
    ]);
    console.log("approvalBy", jsVals[0].ApprovalBy, myCID);
    if (js.Status == "Pending approval" && jsVals[0].ApprovalBy.ApprovalCID == myCID) {
        xsection(dispButtons, [
            "button|class=longblueButton|onclick=PopUp('Set Approval Status', " + js.MainID + ", null, null, ['150px','400px'])|Approve / Decline",
            "label|class=padLeft10"
        ]);
    }

    var unlocked = !jsVals[0].RecordLocked

    console.log(864, jsVals[0]);
    if (cloneID != null) {
        isReleased = false;
        unlocked = true;
        EditOnOff = true;
        js.Released_Date = "";
    }
    console.log(899, jsVals[0].MainCID, myCID);
    console.log(967, EditOnOff, unlocked, isReleased);

    if (cloneID != null) {
        xsection(dispButtons, [
            "button|class=longblueButton btnIASave|onclick=SubmitRecord(" + js.MainID + ", false)|Save & Review"
        ]);
    } else {
        if (EditOnOff && unlocked) {
            isReleased = (js.Released_Date != "") ? 1 : 0;
            xsection(dispButtons, [
                //"button|class=blueButton|onclick=PrintRecord(" + js.MainID + ")|Print",
                //"label|class=padLeft10",
                ((!isReleased) ?
                    "button|class=longblueButton btnIASave|onclick=SubmitRecord(" + js.MainID + ", " + isReleased + ")|Save & Review" :
                    "button|name=btnSave|class=btnIASave blueButton|onclick=SubmitRecord(" + js.MainID + ", " + isReleased + ")|Save"),
                "label|class=padLeft10",

                ((js.MainID == 0) ? "" : (!isReleased) ? "" : (!isMGT) ? "" : "button|name=btnSave|class=blueButton btnIASave|onclick=LockRecord(" + js.MainID + ")|Save & Lock"),
                ((js.MainID == 0) ? "" : (!isReleased) ? "" : "label|class=padLeft10"),

                ((js.MainID == 0) ? "" : (isReleased == 1) ? "" : (!ME.Security[0].RlsFormApplications) ? "" : "button|name=btnSave|class=btnIASave longblueButton|style=width:100px|onclick=SubmitRecord(" + js.MainID + ", 1)|Save for Use"),
                ((js.MainID == 0) ? "" : (isReleased == 1) ? "" : (ME.Security[0].RlsFormApplications) ? "" : "button|disabled=true|title=You do not have permission to release this application|class=longblueButton|style=width:100px|Save for Use"),
                ((js.MainID != 0) ? "label|class=padLeft10" : ""),

                //code:20241108:jk:clone record
                ((js.MainID != 0 && jsVals[0].MainCID == myCID) ? "button|class=blueButton|onclick=ViewDisp(" + js.MainID + ", null, true)|Clone" : ""),
                ((js.MainID != 0 && jsVals[0].MainCID == myCID) ? "label|class=padLeft10" : ""),

            ]);
        } else if (MGTEditOnOff && unlocked) {
            xsection(dispButtons, [
                "button|name=btnSave|class=blueButton btnIASave|onclick=SubmitRecord(" + js.MainID + ", true)|Save",
                "label|class=padLeft10",
            ]);
        } else if (!unlocked) {
            xsection(dispButtons, [
                "label|class=red padRight10|Record Locked",
                ((js.MainID != 0 && isMGT) ? "label|class=padLeft10" : ""),
                ((js.MainID != 0 && jsVals[0].MainCID == myCID) ? "button|class=blueButton|onclick=ViewDisp(" + js.MainID + ", null, true)|Clone" : ""),
                ((js.MainID != 0 && jsVals[0].MainCID == myCID) ? "label|class=padLeft10" : ""),
            ]);
        }
        //alert(js.Open_Closed);
        xsection(dispButtons, [
            //((js.MainID != 0) ? "label|class=padLeft10" : ""),
            ((js.MainID != 0) ? "button|class=blueButton|style=width:100px|onclick=IAViewPDF(" + js.MainID + ", '" + js.Application_Type.replace(/ /g, "_") + ".pdf', " + js.hasDoc + ")|View PDF" : ""),
            ((js.MainID != 0) ? "label|class=padLeft10" : ""),
            // ((js.MainID != 0 && !js.hasDoc) ? "button|class=blueButton|style=width:100px|onclick=ViewPDF(" + js.MainID + ", '" + js.Application_Type.replace(/ /g, "_") + ".pdf')|View PDF" : ""),
            //((js.MainID != 0 && !js.hasDoc) ? "button|class=blueButton|style=width:100px|onclick=PopUp('View PDF', '" + js.Application_Type.replace(/ /g, "_") + ".pdf', null, true)|View PDF" : ""),//code: 20240815: 0412pm adding View PDF PopUp Button
            //((js.MainID != 0 && !js.hasDoc) ? "label|class=padLeft10" : ""),////code: 20240815: 0412pm
            ((js.MainID != 0) ? "button|class=longblueButton|style=width:100px|id=btnOpenClose|onclick=OpenCloseRecord(" + js.MainID + ", '" + js.Open_Closed + "')|" +
                    ((js.Open_Closed == "CLOSED") ? "Set as Open" : "Set as Closed") : ""),
            ((js.MainID != 0 && jsVals[0].MainCID == myCID) ? "label|class=padLeft10" : ""),
            // CMSMailbox adaptation (port-by-copy from CMS's InteractiveForm.js):
            // Delete and Share-to-Mailbox are both deliberately unavailable from
            // within CMSMailbox — composing/attaching only ever happens in CMSNEO
            // itself (see MailboxShareController), and record deletion is out of
            // scope for a reply-only mailbox viewer. The server-side dispatcher
            // also rejects both actions independently (not on its own allowlist),
            // so this is a UX suppression, not the enforcement point.
        ]);
    }
    OpenCloseRecord()


    ////BUILD ADDITIONAL INFO BAR
    //xsection(ViewDispute, [
    //    "div|id=dispAddtlInfo|class=singleDspTables", "br",
    //]);
    //if (js.MainID != 0)
    //    xsection(dispAddtlInfo, [
    //        "div|class=navlinkLeft shadowSection|onclick=showHideAddtlInfo()|<b>Additional Info</b>" +
    //        "|||label|id=dispAddtlInfo_status|class=floatright red|icon.class=floatright|icon.style=height:15px;width:20px|icon=dropdown-downarrow.png| " +
    //        ((js.Info_Req == "YES") ? "Additional Info Pending" : ""),
    //        "div|id=dispAddtlInfo_Button|class=|style=display:" + ((showAddtlInfo) ? "" : "none") +
    //        "" + ((!isMGT) ? "" : "|||button|class=longblueButton|onclick=PopUp('Request Additional Info', ['" + js.RecordID + "',''], null, null, ['300px','700px'])|Request Additional Info"),
    //        "div|id=dispAddtlInfo_inner|style=height:300px; display:" + ((showAddtlInfo) ? "" : "none")
    //    ]);
    //else
    //    xsection(dispAddtlInfo, [
    //        "div|class=smhdr|Additional Info",
    //        "div|class=padLeft10 padTop5 red|You may add addtional info once the record has been saved"
    //    ]);

    if (js.MainID != 0 && (js.Info_Req == "YES" || jsVals[0].UnreadNotes || jsVals[0].UnseenAttachments)) {
        xsection(ViewDispute, [
            "div|id=dispAddtlInfo|class=singleDspTables" +
            "|||table|style=width:100%|||append|tr|id=trActionRequred",
            "br",
        ]);

        if (js.Info_Req == "YES")
            xsection(trActionRequred, ["td|class=pad10", "td|class=sm red navlink pad10|style=color:red; text-align:center|onclick=addtlinfoFocus.focus()|Click here to view Additional Info Requests"]);

        if (jsVals[0].UnreadNotes)
            xsection(trActionRequred, ["td|class=pad10", "td|class=sm red navlink pad10|style=color:red; text-align:center|onclick=document.getElementsByClassName('iaNote')[0].focus()|Click here to view Unread Notes"]);

        if (jsVals[0].UnseenAttachments)
            xsection(trActionRequred, ["td|class=pad10", "td|class=sm red navlink pad10|style=color:red; text-align:center|onclick=document.getElementsByClassName('iaAttachment')[0].focus()|Click here to view Unseen Attachments"]);

        xsection(trActionRequred, ["td|class=pad10"]);
    }


    //code:20240522:825am - Prev Next buttons
    console.log(1353, jsNeo)
    var PNIX = jsNeo.jsFiltered.findIndex(d => d.MainID == js.MainID);
    if (PNIX > 0) {
        xsection(dispButtons, [
            "label|class=padLeft10",
            "button|class=blueButton|onclick=DisplayPrevNext(" + js.MainID + ",-1)|<-- Prev"
        ]);
    }
    if (PNIX < jsNeo.jsFiltered.length - 1) {
        xsection(dispButtons, [
            "label|class=padLeft10",
            "button|class=blueButton|onclick=DisplayPrevNext(" + js.MainID + ",1)|Next -->"
        ]);
    }



    //getData(null, newFormData("_IAGetAdditionalInfo", { recordid: js.RecordID }), function (vr) {
    //    var jsInfo = jparse(vr);
    //    jsRequestAdditionalInfo = jsInfo;

    //    if (jsInfo.length == 0) {
    //        xsection(dispAddtlInfo_inner, ["div|class=sm pad10|There is no additional info requested for this record"]);
    //    } else {
    //        getGChartTable(jsInfo, ("Details,Details_By,Details_Modified,Response,Response_By,Response_Modified,Accepted").split(","), dispAddtlInfo_inner,
    //            [{ Func: "EditAdditionalInfo", Params: ["RecordAddtlInfoID"], Cols: [0] }], null, null, null, null, ["Details_Modified", true]);
    //    }
    //})

    //alert(js.Application_Type);
    console.log(1315, js);

    //BUILD MANAGEMENT BAR
    xsection(ViewDispute, [
        "div|id=dispManagement|class=singleDspTables", "br",
    ]);
    var FormColor = (js.FormID == currentFormID) ? "black" : "red";

    xsection(dispManagement, [
        "table|style=width:" + tw +
        "" + "|||append|tr" +
        "" + "" + "|||append|" +
        "" + "" + "td|style=width:" + cw + "|<b>Form</b>|||append|br|||label|style=color:" + FormColor + "|" + jsVals[0].FormName +
        "" + "" + "|||back|td|<b>Created By</b><br>" + js.Loaded_By +
        "" + "" + "|||td|<b>From</b><br>" + js.Company +
        "" + "" + "|||td|<b>Date Loaded</b><br>" + convertDT(js.Date_Loaded, true) +
        //"" + "" + "|||td|<b>Last Updated</b><br>" + convertDT(js.Date_Modified, true) +
        "" + "" + "|||td|<b>Date Released</b><br>" + ((js.Released_Date == null) ? "" : convertDT(js.Released_Date, true)) +
        "" + "" + "|||td|<b>Released By</b><br>" + ((js.Released_By == null) ? "" : js.Released_By)
    ]);

    var fieldids = js.FieldIDs.split(",");

    var sects = [];
    for (var i = 0; i < jsVals.length; i++) {
        var jo = jsVals[i];
        console.log(983, jo);
        var sect = jo.TableName.replace(/ /g, "_")
        if (sects.indexOf(sect) == -1) {
            if (jo.FieldType.toLowerCase() == "form" && !unlocked) {
                //don't add
            } else if (jo.FieldType.toLowerCase() == "trigger") {
                //don't add
            } else {
                sects.push(sect);
            }
        }
    }


    //BUILD SECTION CONTAINERS
    for (var i = 0; i < sects.length; i++) {
        try {
            var dspSect = sects[i].replace(/_/g, " ");
            sects[i] = sects[i].replace(/'/g, '');
            //alert(i);
            //code:20241111:202pm:jk:collapsible sections
            xsection(ViewDispute, [
                "div|class=singleDspTables" +
                "|||label|class=cursor floatright pad5|onclick=collapseSection('" + sects[i] + "')|||append|img|id=icon_" + sects[i] + "|src=collapse-up.png|style=height:15px;width:15px" +
                "|||back|div|class=smhdr padBottom10|" + dspSect +
                "|||div|id=disp" + sects[i] + "|class=iasection" +
                "|||append|br" +
                "|||table|id=tbl_" + sects[i] + "|style=width:" + tw, "br"
            ]);
            //nsection("tbl_" + sects[i], ["td|colspan=2|class=smhdr padBottom10|" + dspSect]);
        } catch (ex) {
            console.log(1019, ex);
        }
    }


    //array of sections with loaded data
    var arrLoadedSects = [];

    //BUILD SECTION ELEMENTS
    var wroteSections = [];
    var records = "";
    console.log("1092", jsVals);
    for (var i = 0; i < jsVals.length; i++) {
        try {
            var jo = jsVals[i];//.filter(d => d.FldID.toString() == fieldids[i].replace("X_", "") * 1)[0];
            var ddOptions = jo.FieldOptions.split("|").join("~");
            ddOptions = (jo.FieldType.toLowerCase() == "state") ? statelist.join("~") : ddOptions;

            console.log(947, jo, ddOptions);
            var Showing = (jsMgtData.filter(d => d.FieldID == jo.FieldID && !d.Showing).length > 0) ? false : true;

            var Unlocked = (jsMgtData.filter(d => d.FieldID == jo.FieldID && !d.Unlocked).length > 0) ? false : true;


            try {
                var SectionLine = {
                    Section: "",
                    MainID: jo.MainID,
                    FieldID: jo.FieldID,
                    intFieldID: jo.FldID,
                    FieldID: jo.FieldID,
                    Text: jo.FieldName, //jo.FieldDescription,
                    Val: jo.Val,
                    Type: jo.FieldType.toLowerCase(),
                    Options: ddOptions.split("~"),
                    Showing: Showing,
                    Unlocked: Unlocked,
                    MGT: jo.MGT,
                    MGMT: (jo.MGMT == null) ? "" : jo.MGMT,
                    MainCID: jo.MainCID,
                    EditOnOff: EditOnOff,
                    MGTEditOnOff: MGTEditOnOff,
                    NetMGT: jo.NetMGT,
                    RecordLocked: (cloneID != null) ? false : jo.RecordLocked,
                    Required: jo.Required
                };
            } catch (ex) {
                console.log(ex);
            }
            wroteSections.push(jo.TableName);

            if (jo.FieldType.toLowerCase() != "trigger") {
                var thisTblName = "tbl_" + jo.TableName.replace(/ /g, "_").replace(/'/g, "");
                console.log(1132, SectionLine);
                ftnSelectFormRecords = null;
                var sectArr = buildIASectionLine(SectionLine);

                if (SectionLine.Text.toLowerCase() == "manager")
                    console.log("manager", sectArr);

                if (arrLoadedSects.indexOf(thisTblName) == -1) {
                    arrLoadedSects.push(thisTblName);
                } else if (records != jo.Records) {
                    nsection(thisTblName, ["tr|||td|colspan=3|||append|hr"]);
                }
                records = jo.Records;

                //if (jo.NetMGT || jo.MGT || ddOptions.split("~").indexOf("multi") != 0)
                nsection(thisTblName, sectArr[0]);

                console.log("sectArr", thisTblName, sectArr);
            }

            try {
                if (sectArr[1] != null) {
                    nsection(thisTblName, [sectArr[1]]);
                    console.log(1836, SectionLine);
                    if (SectionLine.Type == "checkbox" && ["☒", "Yes", "True"].indexOf(SectionLine.Val) > -1) {
                        document.getElementById("input_X_" + SectionLine.intFieldID).checked = true;
                    }
                }
                if (ftnSelectFormRecords != null)
                    ftnSelectFormRecords();

            } catch (err) {
                console.log(793, err);
            }

            //check checkboxes
            for (var cbix = 0; cbix < document.getElementsByClassName("checkbox").length; cbix++) {
                var cb = document.getElementsByClassName("checkbox")[cbix];
                console.log(1836, cb, cb.value);
                if (cb.value == "true")
                    cb.checked = true;
            }

            console.log(1700, "mgtdata", jsMgtData, jo.FormCID, EditOnOff, MGTEditOnOff, js.CID, myCID)
            if (myCID == jo.FormCID) {
                populateIAMultiText(jsMgtData, jo.FieldID);
                populateIAHideLock(jsMgtData, jo.FieldID, 0);
                populateIAHideLock(jsMgtData, jo.FieldID, 1);
            }



            //code:20241108:jk:clone record
            if (cloneID != null) {
                curMainID = 0;
            }
        } catch (ex) {
            console.log(947, "single error", ex);
        }
    }
    disEnableSaveButtons(true);

    //fix for blank spaces in values
    var elem = document.getElementsByClassName("submitInputField");
    for (var e = 0; e < elem.length; e++) {
        var el = elem[e];
        var val = el.value;
        if (el.tagName.toLowerCase() != 'select') {
            el.value = val.trim();
            //console.log("el trimmed", val);
        } else {
            console.log("el not trimmed", val);
        }
    }

    //if (!internalDispAttachments)
    //BUILD ATTACHMENTS & NOTES CONTAINERS
    xsection(ViewDispute, [
        "div|id=internalDispAttachments|class=singleDspTables", "br",
        "div|id=internalDispNotes|class=singleDspTables", "br",
        "div|id=internalDispTriggered|class=singleDspTables|style=display:none", "br",
    ]);

    if (AdminCID == myCID) {
        xsection(ViewDispute, [
            "div|id=dispMergeFields|class=singleDspTables|style=text-align:right|||" +
            "label|class=padRight10|||append|" +
            //"br|||" +
            "label|icon=matrix.png|class=cursor padBottom10|onclick=GoIAMatrix('" + currentFormID + "')|Merge Field Matrix|||" +
            "label|class=padLeft10|||" +
            "label|class=padLeft10|||" +
            "label|icon=excel.png|class=cursor|onclick=exportMergeFields(0)|Merge Fields|||" +
            "label|class=padLeft10|||" +
            "label|class=padLeft10|||" +
            "label|icon=excel.png|class=cursor|onclick=exportMergeFields(1)|Field IDs",
            "br"
        ]);
    }

    //MULTI ANSWERS
    popMultiAnswers(js.MainID, jsMultiAnswers);



    //BUILD ATTACHMENTS
    xsection(internalDispAttachments, [
        "table|style=width:" + tw +
        "" + "|||append|tr" +
        "" + "" + "|||append|" +
        "" + "" + "td|class=bold|Attachments" +
        "" + "|||cancel|td" +
        "" + "" + "|||append|" +
        "" + "" + "td|style=width:0%|class=questionTD dontcolor|colspan=2" +//code: 20240909: 0400pm
        "" + "" + "|||td|id=iaAttachmentsSection|style=width:100%" + ((js.MainID == 0) ? "|||append|label|class=red|You may load attachments once the record has been saved" : "")
    ]);

    //BUILD NOTES
    xsection(internalDispNotes, [
        "table|style=width:" + tw +
        "" + "|||append|tr" +
        "" + "" + "|||append|" +
        "" + "" + "td|class=bold|Notes" +
        "" + "|||cancel|td" +
        "" + "" + "|||append|" +
        "" + "" + "td|style=width:0%|class=questionTD dontcolor|colspan=2" +//code: 20240909: 0400pm
        "" + "" + "|||td|id=iaNotesSection|style=width:100%" + ((js.MainID == 0) ? "|||append|label|class=red|You may apply notes once the record has been saved" : " ")
    ]);

    buildNotesFileSection(js.MainID);

    normalizeQuestionLengths();

    triggerForm(js, tw, cw);



    if (sentfunc)
        sentfunc();
}

// ============================================================
// SECTION: multi-answer fields (repeatable question groups), form-triggering logic (conditional show/hide)
// ============================================================
function popMultiAnswers(MainID, jsMultiAnswers) {
    if (jsMultiAnswers.length > 0) {
        console.log(1701, jsMultiAnswers);

        //clear existing for updated
        for (var i = 0; i < jsMultiAnswers.length; i++) {
            try {
                var jo = jsMultiAnswers[i];
                var dv = document.getElementById("multi_" + jo.InputID);
                dv.innerHTML = "";
            } catch (ex) {
                console.log(1701, ex);
                //do nothing; not all fields are available downstream
            }
        }
        //populate multi
        for (var i = 0; i < jsMultiAnswers.length; i++) {
            try {
                var jo = jsMultiAnswers[i];
                var ans = document.getElementById("input_X_" + jo.InputID);
                var dv = document.getElementById("multi_" + jo.InputID);
                console.log(1701, jo, ans, dv);
                ans.value = "";
                dv.className = "pad10";

                console.log("val xxx before", jo.Answer);
                var val = jo.Answer;
                var arrVal = val.split("\n");
                for (var v = 0; v < arrVal.length; v++) {
                    var av = arrVal[v];
                    console.log("val xxx av", "1" + av.split("*")[0].trim() + "2", av.split("*")[0].trim() == "");

                    if (av.split("*")[0].trim() == "")
                        av = "<li>" + av.replace("*", "") + "</li>";
                    else
                        av = "<br>" + av;

                    arrVal[v] = av;
                }
                val = arrVal.join("");
                console.log("val xxx after", val);

                xsection(dv, [
                    "div|||" + ((jo.CanDelete) ?
                        "label|class=red cursor|onclick=DeleteMultiAnswer(" + MainID + "," + jo.FDID + ")|x|||" :
                        "") +
                    "label|class=padLeft10|id=" + dv.id + "_" + i + "|",
                    "div|class=sm padLeft10|Answered by: " + jo.AnsweredBy + " with " + jo.AnsweredByCompany + " on " + convertDT(jo.DTAnswered),
                    "br"
                ]);

                document.getElementById(dv.id + "_" + i).innerHTML = val; // jo.Answer;

            } catch (ex) {
                console.log(1701, ex);
                //do nothing; not all fields are available downstream
            }
        }
    }
}

function DeleteMultiAnswer(MainID, FDID, go) {
    if (!go) {
        xconfirm("Are you sure you want to delete this value?", null, "DeleteMultiAnswer(" + MainID + "," + FDID + ",true)");
    } else {
        xconfirm();
        getData(null, newFormData("_IADeleteMultiAnswer", { mainid: MainID, fdid: FDID }), function (vr) {
            var jsMultiAnswers = jparse(vr);
            popMultiAnswers(MainID, jsMultiAnswers);
            IAResetCache(MainID);
        });
    }
}

//function IAResetCache(MainID) {
//    //getData(null, newFormData("_IABuildCache", { formid: currentFormID, includeMainID: MainID }), function (vr) {

//    //});
//    if (dontrun)
//        dontrun = false;
//    else {
//        getData(null, newFormData("_IAGETALLDATA260903", { formid: currentFormID }), function (vr) {

//        }, null, true);
//    }
//}

function triggerForm(js, tw, cw) {
    //TRIGGER FORMS
    tw = (tw.replace("px", "") * 1) - 100;
    getData(null, newFormData("_IAGetTriggeredRecord", { mainid: js.MainID }), function(vr) {
        console.log(vr);
        var triggeredID = null; // jparse(vr)[0].MainID;

        if (triggeredID != null) {
            internalDispTriggered.style.display = "";
            //BUILD APPLIED RECORDS
            xsection(internalDispTriggered, [
                "div" +
                "" + "|||div|class=bold|Applied Record MainID: " + triggeredID +
                "" + "|||br" +
                "" + "|||div|id=iaTriggerSection|style=width:98%;" +
                "" + "" + "|||append|div|class=sm pad10|Please wait while applied record is loading ..."
            ]);

            console.log(1157, "_IAGetFormData", { mainid: triggeredID });
            RunMultiSP("_IAGetFormData,_IAGetMultiAnswers", [{ mainid: triggeredID }, { mainid: triggeredID }], function (js) {
                var jsTrigger = js[0].filter(d => d.FieldType.toLowerCase() != "form");
                var jsTriggerMulti = js[1];
                var jo = jsTrigger[0];
                console.log(11570, jsTrigger, jsTriggerMulti);

                iaTriggerSection.innerHTML = "";
                try {
                    //BUILD MANAGEMENT BAR
                    //xsection(iaTriggerSection, [
                    //    "div|id=dispTrigger|class=singleDspTables|style=width:300px", "br",
                    //]);
                    xsection(iaTriggerSection, [
                        "table|class=singleDspTables|style=width:100%" +
                        "" + "|||append|tr" +
                        "" + "" + "|||append|" +
                        "" + "" + "td|<b>Application Type</b><br>" + jsTrigger[0].FormName +
                        "" + "" + "|||td|<b>Created By</b><br>" + jsTrigger[0].Loaded_By +
                        "" + "" + "|||td|<b>Management</b><br>" + jsTrigger[0].Company +
                        "" + "" + "|||td|<b>Date Loaded</b><br>" + convertDT(jo.Date_Loaded, true) +
                        //"" + "" + "|||td|<b>Last Updated</b><br>" + convertDT(js.Date_Modified, true) +
                        "" + "" + "|||td|<b>Date Released</b><br>" + ((jsTrigger[0].DTReleased == null) ? "" : convertDT(jsTrigger[0].DTReleased, true)) +
                        "" + "" + "|||td|<b>Released By</b><br>" + ((jsTrigger[0].Released_By == null) ? "" : jsTrigger[0].Released_By)
                    ]);

                    //set the table
                    xsection(iaTriggerSection, [
                        "div|||table|id=tbl_iaTriggerSection"
                    ]);

                    //build sections
                    var tsects = [];
                    for (var i = 0; i < jsTrigger.length; i++) {
                        var jo = jsTrigger[i];
                        var tsIndex = tsects.findIndex(d => d.Sect == jo.TableName);
                        if (tsIndex == -1) {
                            tsects.push({ Sect: jo.TableName, Recs: [{ FieldName: jo.FieldName, FldID: jo.FldID, FieldType: jo.FieldType, Val: jo.Val }] });
                        } else {
                            tsects[tsIndex].Recs.push({ FieldName: jo.FieldName, FldID: jo.FldID, FieldType: jo.FieldType, Val: jo.Val })
                        }
                    }

                    tsects.push({ Sect: "Attachments", Recs: [] });
                    tsects.push({ Sect: "Notes", Recs: [] });

                    //write sections
                    for (var i = 0; i < tsects.length; i++) {
                        var tableName = tsects[i].Sect;
                        var trecs = tsects[i].Recs;

                        xsection(tbl_iaTriggerSection, ["tr|||td|id=tdTrigger_" + i + "|colspan=2|class=smhdr shadowSection|" + tableName]);

                        //write elems
                        for (var ii = 0; ii < trecs.length; ii++) {
                            var jo = trecs[ii];
                            var val = jo.Val;

                            xsection(tbl_iaTriggerSection, [
                                "tr",
                                (jo.FieldType.toLowerCase() != "info") ?
                                    "td|class=padLeft30 padRight10|style=width:300px|" + jo.FieldName :
                                    "td|class=padLeft30|colspan=2|" + jo.FieldName,
                                (jo.FieldType.toLowerCase() != "info") ?
                                    "td|id=triggerVal_" + i + "_" + ii + "|class=padLeft10|style=width:300px; border:solid 1px silver|" + jo.Val :
                                    ""
                            ]);

                            var multi = jsTriggerMulti.filter(d => d.InputID == jo.FldID);
                            if (multi.length > 0) {
                                var elemVal = document.getElementById("triggerVal_" + i + "_" + ii);
                                elemVal.innerHTML = "";
                                for (var m = 0; m < multi.length; m++) {
                                    xsection(elemVal, [
                                        "div|" + multi[m].Answer,
                                        "div|class=padLeft10 sm|By: " + multi[m].AnsweredBy + " with " + multi[m].AnsweredByCompany,
                                        "div|class=padLeft10 sm|On: " + convertDT(multi[m].DTAnswered),
                                        "hr"
                                    ]);
                                }
                            }
                        }

                    }

                    var triggerAttachIX = tsects.length - 2;
                    var triggerNotesIX = tsects.length - 1;
                    var triggerAttachments = document.getElementById("tdTrigger_" + triggerAttachIX);
                    var triggerNotes = document.getElementById("tdTrigger_" + triggerNotesIX);
                    triggerAttachments.innerHTML = "";
                    triggerNotes.innerHTML = "";
                    xsection(triggerAttachments, [
                        "hr",
                        "div|Attachments",
                        "div|class=pad10 padLeft30 normal|id=div_triggerAttachments"
                    ]);
                    xsection(triggerNotes, [
                        "div|Notes",
                        "div|class=pad10 padLeft30 normal||id=div_triggerNotes"
                    ]);

                    getData(null, newFormData("_IAGetFilesNotes", { mainid: triggeredID }), function (vr) {
                        var jsTriggerAttachNotes = jparse(vr);
                        var jsTriggerAttach = jsTriggerAttachNotes.filter(d => d.Type == "Files");
                        var jsTriggerNotes = jsTriggerAttachNotes.filter(d => d.Type == "Notes");

                        for (var i = 0; i < jsTriggerAttach.length; i++) {
                            //display files
                            var xx = jsTriggerAttach[i];

                            //code:20250517:127pm onclick for AssignFile2Line
                            xsection(div_triggerAttachments, [
                                (i > 0) ? "hr" : "",
                                "div|||" +
                                "label|class=padLeft10|||" +
                                "label|class=alink padLeft10|onclick=ViewIAFile('" + xx.FileNoteID + "','" + xx.Filename + "')|" + xx.Filename + "|||" +
                                "br|||" +
                                "label|class=sm padLeft10|Created by:" + xx.CreatedBy + " with " + xx.CreatedByCompany + " at " + convertDT(xx.DTCreated)
                            ]);
                        }

                        for (var i = 0; i < jsTriggerNotes.length; i++) {
                            //display notes
                            var xx = jsTriggerNotes[i];

                            xsection(div_triggerNotes, [
                                (i > 0) ? "hr" : "",
                                "div|||" +
                                "label|class=padLeft10|||" +
                                "label|class=padLeft10|" + xx.Note.replace(/\n/g, "<br>") + "|||" +
                                "br|||" +
                                "label|class=sm padLeft10|Created by:" + xx.CreatedBy + " with " + xx.CreatedByCompany + " at " + convertDT(xx.DTCreated)
                            ]);
                        }
                    });

                } catch (ex) {
                    console.log(1157, ex);
                }
            });
        }
    }, null, true);
}


function collapseSection(sect) {
    //code:20241111:202pm:jk:collapsible sections
    var elem = document.getElementById("disp" + sect);
    var icon = document.getElementById("icon_" + sect);
    var onOff = (elem.style.display == "none") ? "" : "none";
    elem.style.display = onOff;
    icon.src = "images/collapse-" + ((onOff == "none") ? "down" : "up") + ".png";
}

// Function to toggle visibility of a section code: 20241031: 0200pm
function toggleSection(id) {
    console.log("HALLLUUUUUUU!!!!!!");
    var section = document.getElementById(id);
    var labelIcon = document.getElementById("lbl_" + id);
    console.log(section);
    if (section.style.display === "none") {
        labelIcon.innerHTML = "&#9650";
        section.style.display = "block"; // Expand section
    } else {
        labelIcon.innerHTML = "&#9660";
        section.style.display = "none"; // Collapse section
    }
}

function exportMergeFields(MF) {

    jsExportGChart = [];
    if (MF == 0) {
        excelXconfirmHdr = "Merge Fields";
        jsExportGChart.push(displayMergeFields);
    } else { 
        excelXconfirmHdr = "Field IDs";
        jsExportGChart.push(displayFieldIDs);
    }

    //PopUp("selectMergeFieldCount", null, null, true);
    ExportGChart('FormMergeFields.xlsx')
}

function selectMergeFieldCount(main) {
    xsection(main, ["table|id=tblMFC|||th|Name"]);
    for (var key in displayMergeFields) {
        var arr = key.split("_");
        if (arr[arr.length - 1] == "0")
            xsection(tblMFC, ["tr|||td|" + key]);
    }
}

function normalizeQuestionLengths() {
    //NORMALIZE QUESTION LENGTHS
    var xlen = 0;
    var qTD = document.getElementsByClassName("questionTD");
    var aTD = document.getElementsByClassName("answerTD");
    for (var i = 0; i < qTD.length; i++) {
        var len = qTD[i].clientWidth;
        xlen = (len > xlen) ? len : xlen;
    }
    var clr = "white";
    for (var i = 0; i < qTD.length; i++) {
        var cl = qTD[i].classList.toString().split(" ");
        //c_log(cl);
        if (cl.indexOf("dontcolor") == -1) {
            clr = (clr == "white") ? "whitesmoke" : "white";
            // clr = (clr == "whitesmoke") ? "white" : "whitesmoke";
            qTD[i].style.width = xlen + "px";
            qTD[i].style.backgroundColor = clr;
            //try { aTD[i].style.backgroundColor = clr; } catch (ex) { }
        }
    }
}

// ============================================================
// SECTION: MGT-data field population (multi-text/hide-lock overrides), save-button state, dynamic
// section-line building for the record edit form
// ============================================================
function populateIAMultiText(jsMgtData, FieldID) {
    var jsmd = jsMgtData.filter(d => d.FieldID == FieldID && d.Val != null);
    var elem = document.getElementById("multi_" + FieldID);

    if (elem != null) {
        console.log(1700, "single lines jsMgtData", jsMgtData, FieldID);
        elem.innerHTML = "";

        for (var jj = 0; jj < jsmd.length; jj++) {
            var xx = jsmd[jj];
            console.log(1700, xx);

            var val = xx.Val;
            var arrVal = val.split("\n");
            for (var v = 0; v < arrVal.length; v++) {
                var av = arrVal[v];
                if (av.substr(0, 1) == "*")
                    av = "<li>" + av.replace("*", "") + "</li>";
                else
                    av = "<br>" + av;

                arrVal[v] = av;
            }
            val = arrVal.join("");

            if (xx.FieldID != null) {
                xsection(elem, ["div|class=shadowSection|style=width:300px|id=multi_" + xx.GUID]);
                nsection("multi_" + xx.GUID, [
                    "label|class=padRight10 red cursor|onclick=delMGTData(" + xx.MainID + ",'" + xx.GUID + "','" + FieldID + "')|x",
                    "label|class=sm|id=multi_" + xx.GUID + "_answer|",
                    "div|class=padLeft10 sm| - " + xx.Created_By,
                    "div|class=padLeft10 sm| - " + convertDT(xx.Date_Created)
                ]);
                document.getElementById("multi_" + xx.GUID + "_answer").innerHTML = val; // xx.Val.replace(/\n/g, "<br>");
            }
        }
    }
}

function delMGTData(MainID, GUID, FieldID, GO) {
    if (!GO) {
        xconfirm("Are you sure you want to delete this line?", null, "delMGTData(" + MainID + ",'" + GUID + "','" + FieldID + "', true)");
    } else {
        getData(null, newFormData("_IADeleteMGTData", { mainid: MainID, guid: GUID }), function (vr) {
            var js = jparse(vr);
            xconfirm();
            populateIAMultiText(js, FieldID);
        });
    }
}

function populateIAHideLock(jsMgtData, FieldID, HL) {
    var jsmd = (HL == 0) ?
        jsMgtData.filter(d => d.FieldID == FieldID && d.Showing != null) :
        jsMgtData.filter(d => d.FieldID == FieldID && d.Unlocked != null);

    var elem = document.getElementById("hideLock_" + HL + "_" + FieldID);
    console.log("popHideLock", elem, jsMgtData);

    if (elem != null) {
        elem.innerHTML = "";

        if (jsmd.length == 0) {
            if (HL == 0) {
                elem.innerHTML = "Showing";
                elem.style.color = "green";
            } else {
                elem.innerHTML = "Unlocked";
                elem.style.color = "green";
            }
        } else {
            var xx = jsmd[0];

            if (HL == 0) {
                xx.Showing = (xx.Showing == null) ? true : xx.Showing;
                elem.innerHTML = (xx.Showing) ? "Showing" : "Hidden";
                elem.style.color = (xx.Showing) ? "green" : "red";
            } else {
                xx.Unlocked = (xx.Unlocked == null) ? true : xx.Unlocked;
                elem.innerHTML = (xx.Unlocked) ? "Unlocked" : "Locked";
                elem.style.color = (xx.Unlocked) ? "green" : "red";
            }
        }
    }
}

function LoadIAMultiText(MainID, FieldID, InputID) {
    var x = document.getElementById(InputID);
    console.log("single lines setID", MainID, FieldID, InputID);
    getData(null, newFormData("_IALoadMGTData", { mainid: MainID, fieldid: FieldID, val: x.value }), function (vr) {
        var js = jparse(vr);
        x.value = "";
        populateIAMultiText(js, FieldID);
    }, null, true);
}

function LoadIAHideLock(MainID, FieldID, HL, InputID) {
    var x = document.getElementById(InputID);
    console.log("single lines setID", MainID, FieldID, InputID);
    getData(null, newFormData("_IALoadMGTData_HideLock", { mainid: MainID, fieldid: FieldID, HideLock: HL }), function (vr) {
        var js = jparse(vr);
        populateIAHideLock(js, FieldID, 0);
        populateIAHideLock(js, FieldID, 1);
    }, null, true);
}

function disEnableSaveButtons(gonow) {
    var btns = document.getElementsByName("btnSave");
    var elems = document.getElementsByClassName("RequiredInput");
    var offOn = false;
    for (var i = 0; i < elems.length; i++) {
        if (isCheckbox(elems[i])) {
            if (!elems[i].checked) {
                offOn = true;
            }
        }
        else if (elems[i].value == "") {
            offOn = true;
        }
        console.log("err required", elems[i].value, offOn);
    }
    for (var i = 0; i < btns.length; i++) {
        btns[i].title = (!offOn) ? "" : "Record cannot be released until required fields have been filled in";
        btns[i].disabled = offOn;
    }
}

function buildIASectionLine(jo, join) {
    try {
        console.log(1179, jo);
        if (!isMGT && !jo.NetMGT && jo.MGMT.toLowerCase() == "only") {
            return [[], null];

        } else {
            var rtn = [];
            var setID = ((!join) ? "" : "join") + "input_X_" + jo.intFieldID;
            //multi
            //if (join)
            console.log("single lines JO", jo, jo.intFieldID);
            try {
                jo.Val = (jo.Val == null) ? "" : jo.Val;
                var private = false;

                if (jo.Type.indexOf("private:") == 0) {
                    private = true;
                    jo.Type = jo.Type.split(":").slice(1).join(":");
                    //console.log("single lines FIELDTYPE", jo.Type.split(":").slice(1).join(":"), jo.Type.split(":").slice(1))

                } else {
                    if (jo.Type == "network" && jo.Val != "" && jo.Options.indexOf(jo.Val) == -1)
                        jo.Type = "entity";

                    if (jo.EditOnOff == false && (jo.MGTEditOnOff = false || jo.MGT == false))
                        jo.Type = "static";

                    if (jo.Type.indexOf("join:") == 0)
                        jo.Type = "static";
                }

                console.log(1612, jo);

                //display section header
                //build field types

                var thisVal = ((jo.EditOnOff || jo.Showing) ? jo.Val : "");
                thisVal = thisVal.replace(/=/g, "~").replace(/\|/g, "/").trim();
                
                var thisClass = "onchange=disEnableSaveButtons()|class=submitInputField" + ((jo.Required) ? " RequiredInput" : "");

                var FieldType = "textarea|style=width:100%;margin-bottom:5px;padding-left:10px|" + thisClass + "|id=" + setID + "|" + thisVal; // + "|" + jo.Val; //default type is textarea //Stiwa Mwenyewe
                var joText = jo.Text, joType = jo.Type;

                if (["static", "info", "existing", "fixed"].indexOf(jo.Type) > -1)
                    // FieldType = "label|style=width:300px|id=" + setID + "|" + thisVal.replace(/\n/g, "<br>");  //type is info
                    FieldType = "label|style=width:100%;margin-bottom:15px; padding-left:30px|id=" + setID + "|" + thisVal.replace(/\n/g, "<br>");  //type is info//Stiwa Mwenyewe
                if (["network", "dropdown", "state"].indexOf(jo.Type) > -1) {

                    var thisVal = ((jo.EditOnOff || jo.Showing) ? jo.Val : "");
                    thisVal = thisVal.replace(/=/g, "~").replace(/\|/g, "/");
                    
                    FieldType = "select|style=width:100%;margin-bottom:5px; padding-left:10px|" + thisClass + "|id=" + setID + "|selected=" + thisVal + "|xyzval=" + thisVal + "|xyzfix=123";    //type is dropdown//Stiwa Mwenyewe

                }
                if (["checkbox"].indexOf(jo.Type) > -1)
                    //FieldType = "input|type=checkbox|style=width:300px|" + thisClass + " checkbox|value=" +
                    FieldType = "input|type=checkbox|style=width:100%;margin-bottom:5px; padding-left:10px|" + thisClass + " checkbox|value=" +//Stiwa Mwenyewe
                        ((["Yes", "True"].indexOf(thisVal) > -1) ? "true" : "false") +
                        "|id=" + setID;    //type is checkbox

                if (["entity", "dropdown+"].indexOf(jo.Type) > -1)
                    // FieldType = "input|style=width:300px|" + thisClass + "|id=" + setID + "|list=DataList_" + jo.intFieldID + "|value=" + thisVal;    //type is datalist
                    FieldType = "input|style=width:100%;margin-bottom:5px;padding-left:10px|" + thisClass + "|id=" + setID + "|list=DataList_" + jo.intFieldID + "|value=" + thisVal + "|x=x";    //type is datalist//Stiwa Mwenyewe
                if (["calendar", "date"].indexOf(jo.Type.toLowerCase()) > -1)
                    //  FieldType = "input|type=date|style=width:300px|value=" + inputDate(thisVal) + "|id=" + setID + "|" + thisClass + "";     //type is date
                    FieldType = "input|type=date|style=width:100%;margin-bottom:5px;padding-left:10px|value=" + inputDate(thisVal) + "|id=" + setID + "|" + thisClass + "";     //type is date//Stiwa Mwenyewe
                var formDiv, toclr = "";
                if (jo.Type.toLowerCase() == "form") {
                    FieldType = "label|||append|input|type=hidden|" + thisClass + "|id=" + setID + "|value=" + thisVal +
                        ((!jo.NetMGT && (jo.MainCID != myCID || jo.RecordLocked)) ?
                            "" :
                            "|||button|class=longblueButton|onclick=PopUp('Select Form Records', ['" + setID + "','" + jo.FieldID + "'])|Select Records to Display"
                        );
                    formDiv = ""; // "tr|||td|colspan=2|||append|div|id=FormFill_" + setID;
                    //joText = "";
                    joType = "static";
                    toclr = "dontcolor";
                    //ftnSelectFormRecords = function () { SelectFormRecords(null, [setID, jo.Options[0]]); }
                }

                jo.Val = thisVal;


                if (jo.NetMGT) console.log("94777", jo.Text, jo, FieldType);
                //if (jo.Type.toLowerCase() != "form") {
                if ((isMGT && ["only", "both"].indexOf(jo.MGMT.toLowerCase()) > -1) || jo.NetMGT) {
                    //MGT can edit types, Both and Only
                }
                else if ((jo.MGMT != "" && !jo.NetMGT)
                    || (!isMGT && ["only", "both"].indexOf(jo.MGMT.toLowerCase()) > -1)
                    || (jo.MainCID != myCID && ["only", "both"].indexOf(jo.MGMT.toLowerCase()) == -1 && !jo.NetMGT)
                    || (jo.RecordLocked)
                ) {
                    FieldType = (joType == "checkbox" && thisVal == "Yes") ?
                        "label|style=width:300px; padding-bottom:15px; padding-left:30px; font-size:16px|id=" + setID + "|" + "☒" :
                        (joType == "checkbox") ?
                            "label|style=width:300px; padding-bottom:15px; padding-left:30px; font-size:16px|id=" + setID + "|" + "☐" :
                            (jo.Type.toLowerCase() == "form") ?
                                "label" :
                                (jo.Options.indexOf("multi") == 0) ?
                                    "label|id=" + setID :
                                    "label|style=width:300px; padding-bottom:15px; padding-left:30px|id=" + setID + "|" + thisVal.replace(/\n/g, "<br>");
                }
                //}

                if (joType.trim() == "existing") {
                    FieldType = "label|style=width:300px; padding-bottom:15px; padding-left:30px|id=" + setID + "|" + thisVal.replace(/\n/g, "<br>");
                    console.log("FieldTypes", { joType: joType, joText: joText, isMGT: isMGT, MGMT: jo.MGMT, NetMGT: jo.NetMGT, FieldType: FieldType });

                }


                console.log("793x", FieldType);

                console.log(9477, { MainCID: jo.MainCID, myCID: myCID, MGMT: jo.MGMT });

                //build field options
                //var FieldOptions = (["static", "info", "existing", "fixed", "date"].indexOf(jo.Type) > -1) ? "" :
                //    (jo.Options.length == 0 || jo.Type == "entity") ? "" : "|options=~" + jo.Options.join("~");
                //var DataList = (["static", "info", "existing", "fixed"].indexOf(jo.Type) > -1) ? "" : (jo.Type != "entity") ? "" : "|||datalist|style=z-index:5000|id=DataList_" + jo.intFieldID + "|options=~" + jo.Options.join("~");

                var FieldOptions = (FieldType.indexOf("select") != 0 && FieldType.indexOf("DataList") == -1) ? "" :
                    (jo.Options.length == 0 || jo.Type == "entity") ? "" : "|options=~" + jo.Options.join("~");

                var DataList = (FieldType.indexOf("select") != 0 && FieldType.indexOf("DataList") == -1) ? "" :
                    (["entity"].indexOf(jo.Type) == -1) ? "" : "|||datalist|style=z-index:5000|id=DataList_" + jo.intFieldID + "|options=~" + jo.Options.join("~");

                DataList = (joType.toLowerCase() == "dropdown+") ? "|||datalist|style=z-index:5000|id=DataList_" + jo.intFieldID : DataList;


                console.log("datalist", { type: joType.toLowerCase(), text: FieldType, datalist: DataList, options: jo.Options });

                if (!jo.EditOnOff && !jo.Unlocked)
                    console.log("HideLock", jo);

                //connect field type and options
                FieldType += (!jo.EditOnOff && !jo.Unlocked) ? "|disabled=true" : "";
                FieldType += DataList + FieldOptions;
                console.log("single lines", jo.Text, FieldType);

                console.log("793x", FieldType);

                //add multi notes section
                if (jo.Type.indexOf("multi") == 0) {
                    FieldType = "textarea|placeholder=Data will save automatically when you exit the field|style=width:300px|" + thisClass + "|id=" + setID
                    FieldType += "|onchange=LoadIAMultiText(" + jo.MainID + ",'" + jo.FieldID + "','" + setID + "')|||div|id=multi_" + jo.FieldID + "|class=sm";
                    console.log(1700, "single lines Multi Line Section", FieldType);
                }
                console.log("793x", FieldType, jo);

                jo.MGMT = jo.MGMT.toLowerCase();

                //build array
                if (jo.Section != "")
                    rtn.push("tr|||append|td|colspan=2|class=smhdr padBottom10|" + jo.Section.replace(/_/g, " ") + "|||br");
                //rtn.push("tr");//Stiwa Mwenyewe
                //rtn.push("tr|style=width:20px");//Stiwa Mwenyewe

                //rtn.push("tr");//code: 31012025 1630
                // rtn.push("tr|id=stiwa1");//code: 31012025 1630
                var strRTN = "tr|id=stiwa2|class=" + toclr + " " +
                    ((joText == "") ?
                        "xyz" :
                        (join) ?
                            "joinQuestionTD" :
                            ""
                    ) +
                    " padLeft30 questionTD|style=height:20px;|" +
                    ((joType == "info") ?
                        "colspan=3|" :
                        "colspan=2|"
                    ) + ((jo.Required) ? "<label class~\"red\">*&nbsp;</label>" : "") + joText.replace(/\n/g, "<br>").replace(/•/g, "&nbsp;&nbsp;&nbsp;&nbsp;•")
                    +
                    (
                        (jo.NetMGT && jo.MGMT == "only") ?
                            "|||append|label|class=floatright sm" +
                            "" + "|||append|label|class=sm padRight10|id=hideLock_" + jo.FieldID + "_txt" + //|Management Only" +
                            "" + "|||label|class=redlink|title=Click to make available to ALL|id=hideLock_" + jo.FieldID +
                            "" + "" + "|onclick=toggleMGMT(" + jo.MainID + ",'" + jo.FieldID + "', this)|Available to Management Only" :
                            ""
                    )
                    +
                    (
                        (jo.NetMGT && jo.MGMT == "both") ?
                            "|||append|label|class=floatright sm" +
                            "" + "|||append|label|class=sm padRight10|id=hideLock_" + jo.FieldID + "_txt" + //|Available to ALL" +
                            "" + "|||label|class=greenlink|title=Click to make available to Management Only|id=hideLock_" + jo.FieldID +
                            "" + "" + "|onclick=toggleMGMT(" + jo.MainID + ",'" + jo.FieldID + "', this)|Available to ALL" :
                            ""
                    ) + "[[[ANSWERTD]]]"
                
                if (jo.Type != "info" && 1 == 1)
                    strRTN = strRTN.replace("[[[ANSWERTD]]]", "|||cancel|div|style=width:100%; xpadding-left:30px; xpadding-bottom:10px|class=" + ((join) ? "joinAnswerTD" : "answerTD") + "|||append|" + FieldType + "|xyz=123|||div|id=multi_" + jo.intFieldID);

                strRTN = strRTN.replace("[[[ANSWERTD]]]", "");

                rtn.push(strRTN);

                //if (private && !isMGT)
                //    rtn = [];

            } catch (ex) {
                console.log("buildIASection", ex);
            }

            console.log(793, "single lines", rtn, jo.Type);
            return [rtn, formDiv];
        }
    } catch (err) {
        console.log("793 err", err);
    }
}

// ============================================================
// SECTION: record content selection/cloning, dispute-record dynamic form-line building
// ============================================================
function toggleMGMT(MainID, FieldID, elem) {
    var txt = document.getElementById(elem.id + "_txt");
    getData(null, newFormData("_IAToggleMGMT", { MainID: MainID, FieldID: FieldID }), function (vr) {
        var jo = jparse(vr)[0];
        console.log(1696, jo, elem, txt);
        elem.className = (!jo.ShowField) ? "redlink" : "greenlink";
        elem.innerHTML = (jo.ShowField) ? "Available to ALL" : "Available to Management Only";
        elem.title = (!jo.ShowField) ? "Click to make available to ALL" : "Click to make available to Management Only";
        //txt.innerHTML = (jo.ShowField) ? "Available to ALL" : "Management Only";
    });
}

function SelectFormRecords(main, arr) {
    if (curMainID == 0) {
        xsection(main, ["div|style=padding:30px; color:red; font-size:10px|You must save this record before applying records"]);
    } else {
        try {
            console.log("SelectFormRecords", arr);
            var setID = arr[0];
            var fieldid = arr[1];
            var selected = document.getElementById(setID).value.split(",");

            PopUpOpt(main, "button|class=longblueButton|onclick=SetFormContent(" + curMainID + ",'" + fieldid + "','" + setID + "', true)|Submit and Save Record");

            getData(null, newFormData("_IAGetAppliedRecords3", { mainid: curMainID, fieldid: fieldid }), function (vr) {
                var js = jparse(vr);
                document.getElementById("PopUp_" + main.id.split("_")[1] + "_hdr_appendTitle").innerHTML = " - " + js[0].FormName;

                var jsF = js.filter(d => d.RecordType == "FieldIDs");
                var jsN = js.filter(d => d.RecordType == "FieldNames");
                var jsT = js.filter(d => d.RecordType == "FieldTypes");
                var jsV = js.filter(d => d.RecordType == "FieldValues" && d.MainID != null);

                if (jsV.length == 0) {
                    xsection(main, [
                        "div|class=pad10 sm red|There are no records available",
                        "br",
                        "div|class=pad10 sm red|If the applied form requires approval, records will need to be approved before they can be applied here"
                    ]);
                } else {
                    var FieldIDs = [], FieldNames = [], ShortNames = [], FieldCols = [], FieldTypes = [];
                    for (var key in jsF[0]) {
                        if (key.indexOf("Col_") == 0 && jsF[0][key] != null) {
                            FieldIDs.push(jsF[0][key]);
                            FieldNames.push(jsN[0][key]);
                            ShortNames.push()
                            FieldTypes.push(jsT[0][key]);
                            FieldCols.push(key);
                        }
                    }

                    main.style.overflow = "auto";

                    xsection(main, ["table|style=width:100%|id=tblFormRecords" +
                        "|||th" +
                        "|||th|class=smhdr|MainID" +
                        "|||th|class=smhdr|Company"
                    ]);

                    //write headers
                    for (var i = 0; i < FieldIDs.length; i++) {
                        if (FieldTypes[i].toLowerCase() != "form") {
                            var hdr = FieldNames[i];
                            xsection(tblFormRecords, ["th|class=smhdr|" + hdr]);
                        }
                    };

                    //write values
                    for (var i = 0; i < jsV.length; i++) {
                        var jo = jsV[i];

                        //begin line with checkbox at beginning
                        xsection(tblFormRecords, [
                            "tr|id=trFormRecords_" + i +
                            "|||td|class=pad5|||append|input|type=checkbox|id=cbForm_" + jo["MainID"] + "|name=cbForm_" + setID + "|value=" + jo["MainID"]
                        ]);
                        var cb = document.getElementById("cbForm_" + jo["MainID"])
                        if (selected.indexOf(jo["MainID"].toString()) > -1)
                            cb.checked = true;

                        cb.setAttribute("onchange", "SetFormContent(" + curMainID + ",'" + fieldid + "','" + setID + "')");

                        //add mainid and company to line
                        nsection("trFormRecords_" + i, ["td|class=pad5|" + jo["MainID"]]);
                        nsection("trFormRecords_" + i, ["td|class=pad5|" + jo["Company"]]);

                        for (var ii = 0; ii < FieldIDs.length; ii++) {
                            //add rest of fields to line
                            var val = jo[FieldCols[ii]];
                            val = (!val) ? "" : val;
                            if (FieldTypes[ii].toLowerCase() != "form")
                                nsection("trFormRecords_" + i, ["td|class=pad5|" + val]);
                        }
                    }
                }
            }, null, true);
        } catch (ex) {
            console.log(793, ex);
        }
    }
}

function SetFormContent(MainID, fieldid, setID, GO) {
    var elem = document.getElementById(setID);
    var vals = elem.value.split(",");

    var cb = document.getElementsByName("cbForm_" + setID);
    for (var i = 0; i < cb.length; i++) {
        var v = cb[i].value;
        var loc = vals.indexOf(v);
        var chkd = cb[i].checked;

        if (loc > -1 && !chkd)
            vals.splice(loc, 1)
        if (loc == -1 && chkd)
            vals.push(v);
    }

    elem.value = vals.join(",");

    if (GO) {
        console.log("setformcontent", { mainid: MainID, fieldid: fieldid, vals: vals.join(",") });
        getData(null, newFormData("_IASetFormContent", { mainid: MainID, fieldid: fieldid, vals: vals.join(",") }), function (vr) {
            var js = jparse(vr);
            console.log(1507, js);

            //ViewDisp(MainID);
            closePopUp("Select Form Records");
            SubmitRecord(MainID, 0);
        });
    }
}

function fillForm(setID, formid) {
    var elem = document.getElementById(setID);
    var cbs = document.getElementsByName("cbForm_" + setID);
    var selected = [];
    for (var i = 0; i < cbs.length; i++) {
        if (cbs[i].checked)
            selected.push(cbs[i].value);
    }
    elem.value = selected.join(",");
    SelectFormRecords(null, [setID, formid]);
}

function buildDisputeSectionLine(begin, js, cw, title, fldname, type, type2, line, options, id, dbtype, dboption, val, MGTEditOnOff, MGTField) {
    val = (val == null) ? "" : val;
    type2 = (type2 == "") ? "hidden" : type2;

    console.log(options);
    var datalist = (type == "withDataList") ? "|list=" + id + "_datalist|||datalist|id=" + id + "_datalist|options=" + options : "";
    options = (type == "withDataList") ? "" : options;
    type = (type == "withDataList") ? "input" : type;

    var rtn = [];
    if (EditOnOff || (MGTEditOnOff && MGTField)) {
        rtn = [
            ((title != "") ? "tr|||append|td|colspan=2|class=smhdr padBottom10|" + title.replace(/_/g, " ") + "|||br" : ""),
            "tr" +
            "" + "" + "|||td|" + ((dbtype.toLowerCase() == "info") ? "colspan=2|" : "") + "class=padLeft30 questionTD|style=height:20px|" + fldname.replace(/_/g, " ") +
            ((dbtype.toLowerCase() == "info") ?
                "|||td|class=answerTD|id=" + id + ", " :
                "|||td|class=answerTD" + "|||append|" +
                ((line != null) ?
                    line :
                    type + ((type2 != null) ? "|type=" + type2 : "") +
                    ((
                        ["existing", "fixed"].indexOf(dbtype.toLowerCase()) > -1 ||
                        dbtype.toLowerCase().indexOf("join") == 0) ? "|disabled=true|placeholder= [" + dboption.replace(/_/g, " ") + " ]" : "") +
                    "|" + thisClass + "|id=" + id + "|style=width:300px|value=" +
                    ((fldname.toLowerCase().indexOf("date") == -1) ? val : inputDate(val)) +
                    ((options != null) ? "|options=" + options : "")) +
                datalist
            )
        ];

    } else {
        rtn = [
            ((title != "") ? "tr|||append|td|colspan=2|class=smhdr|" + cw + title.replace(/_/g, " ") + "|||br" : ""),
            "tr" +
            "" + "" + "|||td|" + ((dbtype.toLowerCase() == "info") ? "colspan=2|" : "") + "class=padLeft30 questionTD|" + fldname.replace(/_/g, " ") +
            ((dbtype.toLowerCase() == "info") ?
                "|||td|class=answerTD|id=" + id + ", " :
                "|||td|class=answerTD|style=width:500px|id=" + id + "|" + ((fldname.toLowerCase().indexOf("date") == -1) ? val : convertDT(val, true))
            )
        ];
    }
    return rtn;
}


function OpenCloseRecord(mainid, openClose) {
    if (mainid)
        getData(null, newFormData("_IAOpenCloseRecord", { mainid: mainid }), function (vr) {
            SendEmailAlert("Form Applications", mainid.toString());
            btnOpenClose.innerHTML = (openClose == "OPEN") ? "Set as Open" : "Set as Closed";

            SubmitRecord(mainid, 0);
        });
}

//code:20250517:127pm added features for AssignFile2Line
var value2send;
function AssignFile2Line(FileID, GO, CANCEL) {
    var dv = document.getElementById("divAssignFile2Line_" + FileID.replace(/-/g, ""));

    if (CANCEL) {
        dv.innerHTML = "";
        dv.style.display = "none";

    } else if (GO) {
        if (value2send != "")
            getData(null, newFormData("_IADocAssign", { fileid: FileID, fieldid: value2send }), function (vr) {
                buildNotesFileSection(curRecord[0].MainID);
                dv.innerHTML = "";
                dv.style.display = "none";

            }, null, true);
    } else {
        dv.innerHTML = "";
        dv.style.display = "";
        xsection(dv, [
            "label|class=padRight10|Assign file to line from above:",
            "input|id=txtAssignFile2Line|list=listAssignFile2Line|onchange=AssignFile2Line_onchange()|placeholder=Begin typing or select from the dropdown list|style=width:300px",
            "datalist|id=listAssignFile2Line",
            "input|id=valAssignFile2Line|type=hidden",
            "label|class=padLeft10|",
            "button|class=blueButton|onclick=AssignFile2Line('" + FileID + "', true)|Submit",
            "button|class=blueButton|onclick=AssignFile2Line('" + FileID + "', null, true)|Cancel"
        ]);
        for (var i = 0; i < curRecord.length; i++) {
            var xx = curRecord[i];
            if (xx.FieldType.toLowerCase() != "info")
                xsection(listAssignFile2Line, ["option|data-value=" + xx.FieldID + "|value=" + xx.FieldDescription]);
        }
        txtAssignFile2Line.focus();
        console.log(curRecord);
    }
}


function AssignFile2Line_onchange() {
    var shownVal = document.getElementById("txtAssignFile2Line").value;
    try {
        value2send = document.querySelector("#listAssignFile2Line option[value='" + shownVal + "']").dataset.value;
        valAssignFile2Line.value = value2send;
    } catch (ex) {
        txtAssignFile2Line.value = "";
        valAssignFile2Line.value = "";
        txtAssignFile2Line.placeholder = "Invalid value";
    }

}

function buildNotesFileSection(MainID) {
    //BUILD ATTACHMENTS AND NOTES LOADING AND DISPLAY
    if (MainID > 0) {
        iaAttachmentsSection.innerHTML = "";
        iaNotesSection.innerHTML = "";
        setupIADragDrop(MainID);

        RunMultiSP("_IAGetFilesNotes,_IAGetAddtlInfo", [{ mainid: MainID }, { mainid: MainID }], function (js) {
            jsNotesFiles = js[0];
            jsAddtlInfo = js[1];
            console.log("jsNotesFiles", { NotesFiles: jsNotesFiles, AddtlInfo: jsAddtlInfo });

            // try {
            //     xsection(iaAttachmentsSection, [
            //         "div|class=righted" +
            //         "|||button|class=daButton longblueButton|style=display:none; width:150px|onclick=DownloadAttachments(" + MainID + ")|Download Zipped Files" +
            //         "|||label|class=daButton padLeft10|style=display:none" +
            //         "|||button|class=longblueButton|style=width:150px|onclick=IALoadAttachments(" + MainID + ")|Upload Attachments"
            //     ]);
            // } catch (ex) { console.log("ERROR", ex); }

            try {
                xsection(iaAttachmentsSection, [
                    "div|style=margin-bottom:15px;|class=righted" +
                    "|||button|class=daButton longblueButton|style=display:none; width:150px|onclick=DownloadAttachments(" + MainID + ")|Download Zipped Files" +
                   // "|||button|class=daButton cr-btn cr-btn cr-btn-ghost|style=display:none;background:#0fa0a0;color:#fff;flex-shrink:0;margin-left:auto;width:150px|onclick=DownloadAttachments(" + MainID + ")|Download Zipped Files" +
                    "|||label|class=daButton padLeft10|style=display:none;",
                    "div|id=iaAttachDropzone|class=cr-dropzone|style=padding:11px 14px;text-align:left;display:flex;align-items:center;gap:10px;margin-bottom:8px",
                ]);

                xsection(iaAttachDropzone, [
                    "label|icon=modernUploadIcon.png|icon.style=width:40px;height:30px",
                    "div|class=cr-dropzone-title|style=font-size:12px;margin-bottom:2px|Attachments",
                    "div|class=cr-dropzone-sub|style=margin:0|Click \"Upload Attachments\" to browse or drag and drop the attachment ",
                   // "button|class=cr-btn cr-btn cr-btn-ghost|style=background:#0fa0a0;color:#fff;flex-shrink:0;margin-left:auto;width:150px|onclick=IALoadAttachments(" + MainID + ")|Upload Attachments",
                    "button|class=longblueButton|style=margin-left:auto;width:150px;|onclick=IALoadAttachments(" + MainID + ")|Upload Attachments",
                ]);

                setupIADragDrop(MainID);
            } catch (ex) { console.log("ERROR", ex); }
            var xjs = jsNotesFiles.filter(d => d.Type == "Files");
            if (xjs.length > 1) {
                var dab = document.getElementsByClassName("daButton");
                dab[0].style.display = "";
                dab[1].style.display = "";
            }

            for (var i = 0; i < xjs.length; i++) {
                //display files
                var xx = xjs[i];
                c_log(xx);

                //code:20250517:127pm onclick for AssignFile2Line                
                xsection(iaAttachmentsSection, [
                    "div|class=shadowSection iaAttachment|tabindex=0|||" +
                    ((xx.isMine) ? "label|class=redlink|onclick=delFileNote('" + xx.FileNoteID + "','File', " + MainID + ")|x|||" : "") +
                    "label|class=padLeft10|||" +
                    "label|class=alink padLeft10|onclick=ViewIAFile('" + xx.FileNoteID + "','" + xx.Filename.replace(/=/g, "~") + "')|" + xx.Filename.replace(/=/g, "~") + "|||" +
                    "label|class=padLeft10 cursor sm|onclick=AssignFile2Line('" + xx.FileNoteID + "')|...|||" +
                    "div|id=divAssignFile2Line_" + xx.FileNoteID.replace(/-/g, "") + "|style=display:none|||" +
                    "br|||" +
                    "label|class=sm padLeft10|Created by:" + xx.CreatedBy + " with " + xx.CreatedByCompany + " at " + convertDT(xx.DTCreated) +
                    ((xx.FieldName != null) ? "|||br|||" : "") +
                    ((xx.FieldName != null) ?
                        "label|class=sm padLeft10|Associated with: " + xx.FieldName :
                        "")
                ]);

            }

            var arrAddtlInfo = [];
            for (var i = 0; i < jsAddtlInfo.length; i++) {
                arrAddtlInfo.push(jsAddtlInfo[i].NoteID);
            }
            console.log("jsNotesFiles", arrAddtlInfo);

            var xjs = jsNotesFiles.filter(d => d.Type == "Notes" && arrAddtlInfo.indexOf(d.FileNoteID) == -1);
            console.log("jsNotesFiles", xjs);

           xsection(iaNotesSection, ["div|class=righted|||button|id=iaAttachBtn|class=longblueButton|style=width:150px|onclick=PopUp('Apply Notes', [" + MainID + ", ''])|Apply Notes"]);
            
//xsection(iaNotesSection, ["div|class=righted|||button|id=iaAttachBtn|class=cr-btn cr-btn cr-btn-ghost|style=background:#0fa0a0;color:#fff;flex-shrink:0;margin-left:auto;width:150px|onclick=PopUp('Apply Notes', [" + MainID + ", ''])|Apply Notes"]);

            if (jsAddtlInfo.length > 0)
                xsection(iaNotesSection, ["div|class=sm red|id=addtlinfoFocus|tabindex=0|style=padding-bottom:5px|Requests for Additional Info"]);

            for (var i = 0; i < jsAddtlInfo.length; i++) {
                var xx = jsAddtlInfo[i];

                var isnew = 0;
                if (!document.getElementById("addtl_" + xx.AddtlID.replace(/-/g, ""))) {
                    isnew = 1;
                    xsection(iaNotesSection, [
                        "div|id=addtl_" + xx.AddtlID.replace(/-/g, "") + "|class=pad10|style=border:solid 1px gray" +
                        "|||div|id=addtl_inner_" + xx.AddtlID.replace(/-/g, "") +
                        "|||div|id=addtl_btns_" + xx.AddtlID.replace(/-/g, "") +
                        "|||br",
                        "div|&nbsp;"
                    ]);
                }

                var elem = document.getElementById("addtl_inner_" + xx.AddtlID.replace(/-/g, ""));
                var btnelem = document.getElementById("addtl_btns_" + xx.AddtlID.replace(/-/g, ""));

                xsection(elem, [
                    //"div|class=shadowSection|||" +
                    //((xx.isMine) ? "label|class=redlink|onclick=delFileNote('" + xx.FileNoteID + "','Note', " + MainID + ")|x|||" : "") +
                    //"label|class=padLeft10", 
                    "div|class=padLeft10|" + xx.Note.replace(/\n/g, "<br>").replace(/\|/g, "//"),
                    "div|class=sm padLeft10|Created by:" + xx.NoteBy + " with " + xx.NoteByCompany + " on " + convertDT(xx.DTNoteCreated),
                    "div|class=sm padLeft10|" + xx.MsgType,
                    "hr"
                ]);
                if (isnew) {
                    xsection(btnelem, [
                        "div" +
                        "|||label|class=sm padLeft10|Public:" + xx.Shared +
                        "|||label|class=padLeft10" +
                        ((!xx.AcceptedBy) ?
                            "|||label|class=sm red|Not Accepted" :
                            "|||label|class=sm green|Accepted by: " +
                            xx.AcceptedBy + " with " + xx.AcceptedByCompany + " on " + convertDT(xx.DTAccepted)),
                        ((!xx.AcceptedBy && xx.initCID == myCID) ?
                            "button|id=addtlAccept|class=floatright blueButton|onclick=ADAddtlInfo(" + MainID + ",'" + xx.AddtlID + "')|Accept" :
                            ""),
                        ((myCID == xx.initCID || myCID == xx.xCID) ? "label|class=floatright padLeft10" : ""),
                        ((myCID == xx.initCID || myCID == xx.xCID) ?
                            "button|id=addtlRespond|class=floatright blueButton|onclick=PopUp('Apply Notes', [" + MainID + ",'" + xx.AddtlID + "'])|Respond" :
                            ""),
                        "div|&nbsp;"
                    ])
                }
            }


            for (var i = 0; i < xjs.length; i++) {
                //display notes
                var xx = xjs[i];
                xsection(iaNotesSection, [
                    "div|class=shadowSection iaNote|tabindex=0|||" +
                    ((xx.isMine) ? "label|class=redlink|onclick=delFileNote('" + xx.FileNoteID + "','Note', " + MainID + ")|x|||" : "") +
                    "label|class=padLeft10|||" +
                    "label|class=padLeft10|id=noteDisplay_" + xx.FileNoteID + "|||" + //xx.Note.replace(/\n/g, "<br>").replace(/\|/g, "//") + "|||" +
                    "br|||" +
                    "label|class=sm padLeft10|Created by:" + xx.CreatedBy + " with " + xx.CreatedByCompany + " at " + convertDT(xx.DTCreated)
                ]);

                document.getElementById("noteDisplay_" + xx.FileNoteID).innerHTML = xx.Note.replace(/\n/g, "<br>").replace(/\|/g, "//");
            }
        }, null, true);
    }
}

// ============================================================
// SECTION: notes/file attachments for a record — add/delete notes, upload/drag-drop attachments
// ============================================================
function ADAddtlInfo(mainid, addtlID, go) {
    if (!go) {
        xconfirm("Would you like to accept the additional info provided?", null, "ADAddtlInfo(" + mainid + ",'" + addtlID + "', true)");

    }
    else {
        xconfirm();
        getData(null, newFormData("_IAAcceptAddtlInfo", { mainid: mainid, addtlID: addtlID }), function (vr) {
            buildNotesFileSection(mainid);
            console.log("msg", addtlID);
            getData(null, newFormData("_IAGetAddtlInfoEmails", { addtlID: addtlID }), function (vr) {
                //var msg = jparse(vr)[0];
                //console.log("msg", msg);
                //getData("#AdHocSendMail", newFormData("adHocSendMail", msg), function (vr) {
                //    //do nothing
                //});;
                SendEmailAlert("Form Applications", mainid.toString());
            });
        });
    }

}

function delFileNote(fnid, type, mainid, go) {
    if (!go) {
     //   xconfirm("Are you sure you want to delete this " + type + "?", null, "delFileNote('" + fnid + "','" + type + "'," + mainid + ", true)");

        var elems = [
            // Header
            "div|style=background:rgb(31, 41, 67);padding:10px;height:50px;|class=ua-card-hdr" +
            "|||label|icon=deleteIcon.png|icon.style=background:white;height:30px;width:25px;padding:2px;" +
            "|||span|style=color:#FFF;|class=ua-card-title|Delete " + type,

            "div|style=height:300px;padding:30px;background:#FAEEDA;|class=cr-card" +
            "|||label|icon=icoAlert_orange.png|icon.style=height:30px;width:25px;padding:2px;" +
            "|||span|style=padding-left:5px;padding-top:5px;|<b>Are you sure you want to delete this " + type + "?</b>",
            "br"
        ];

        xconfirm(null, elems, "delFileNote('" + fnid + "','" + type + "'," + mainid + ", true)");
        document.getElementById("xconfirmCancel").className = "ugDeleteBtn";
        document.getElementById("xconfirmContinue").className = "ugSubmitBtn";
    } else {
        xconfirm();
        getData(null, newFormData("_IADelFileNote", { mainid: mainid, fnid: fnid }), function (vr) {
            buildNotesFileSection(mainid);
        });
    }
}

// function IALoadAttachments(mainid, go, ix) {
//     ix = (ix == null) ? 0 : ix;
//     if (!go) {
//         if (document.getElementById("IALoadFiles") != null) { PageContainer.removeChild(IALoadFiles) }
//         xsection(PageContainer, ["input|type=file|id=IALoadFiles|style=display:none|multiple=true|onchange=IALoadAttachments(" + mainid + ",true)"]);
//         IALoadFiles.click();
//     } else {
//         var files = IALoadFiles.files;
//         var arr = []; for (var i = 0; i < files.length; i++) { arr.push(files[i].name); }; // already existing filenames

//         var xjs = jsNotesFiles.filter(d => d.Type == "Files" && arr.indexOf(d.Filename) > -1);
//         if (xjs.length > 0) {
//             xconfirm("You have included files with duplicate filenames from the existing files attached to this record.  Do you want to continue?", null,
//                 "IALoadAttachmentsGO(" + mainid + "," + 0 + ")");
//         } else {
//             IALoadAttachmentsGO(mainid, 0);
//         }
//     }
// }

// function IALoadAttachmentsGO(mainid, ix) {
//     var files = IALoadFiles.files;
//     xconfirm();
//     //alert(ix + " of " + files.length);
//     if (ix < files.length) {
//         //getData(null, newFormData("_IAGetDupeFilenames", { mainid: mainid, filename: files[ix].name }), function (vr) {
//         //    var isDupe = jparse(vr)[0].isDupe;
//         var data = newFormData("_IALoadFiles", { mainid: mainid, shared: 1 });
//         data.append(files[ix].name, files[ix]);

//         getData("#adHocAttach", data, function (vr) {
//             c_log(vr);
//             jsNotesFiles = jparse(vr);
//             ix++;
//             IALoadAttachmentsGO(mainid, ix);
//         });
//         //});
//     } else {
//         buildNotesFileSection(mainid);
//     }
// }



function IALoadAttachments(mainid, go, ix) {
    ix = (ix == null) ? 0 : ix;
    if (!go) {
        if (document.getElementById("IALoadFiles") != null) { PageContainer.removeChild(IALoadFiles) }
        xsection(PageContainer, ["input|type=file|id=IALoadFiles|style=display:none|multiple=true|onchange=IALoadAttachments(" + mainid + ",true)"]);
        IALoadFiles.click();
    } else {
        ProcessIAFiles(mainid, Array.from(IALoadFiles.files));
    }
}

function ProcessIAFiles(mainid, fileArr) {
    // fileArr is a plain array of File objects — from either the <input> picker or a drop event
    window["_iaPendingFiles_" + mainid] = fileArr;

    var arr = fileArr.map(f => f.name); // filenames being added

    var xjs = jsNotesFiles.filter(d => d.Type == "Files" && arr.indexOf(d.Filename) > -1);
    if (xjs.length > 0) {
        xconfirm("You have included files with duplicate filenames from the existing files attached to this record.  Do you want to continue?", null,
            "IALoadAttachmentsGO(" + mainid + "," + 0 + ")");
    } else {
        IALoadAttachmentsGO(mainid, 0);
    }
}

function IALoadAttachmentsGO(mainid, ix) {
    var files = window["_iaPendingFiles_" + mainid] || [];
    xconfirm();
    if (ix < files.length) {
        var data = newFormData("_IALoadFiles", { mainid: mainid, shared: 1 });
        data.append(files[ix].name, files[ix]);

        getData("#adHocAttach", data, function (vr) {
            c_log(vr);
            jsNotesFiles = jparse(vr);
            ix++;
            IALoadAttachmentsGO(mainid, ix);
        });
    } else {
        window["_iaPendingFiles_" + mainid] = null;
        buildNotesFileSection(mainid);
    }
}

function setupIADragDrop(MainID) {
    if (iaAttachmentsSection.dataset.dragBound == "1") return; // avoid double-binding across rebuilds
    iaAttachmentsSection.dataset.dragBound = "1";

    iaAttachmentsSection.addEventListener("dragover", function (e) {
        e.preventDefault();
        e.stopPropagation();
        iaAttachmentsSection.classList.add("iaDragHighlight");
    });

    iaAttachmentsSection.addEventListener("dragleave", function (e) {
        e.preventDefault();
        e.stopPropagation();
        iaAttachmentsSection.classList.remove("iaDragHighlight");
    });

    iaAttachmentsSection.addEventListener("drop", function (e) {
        e.preventDefault();
        e.stopPropagation();
        iaAttachmentsSection.classList.remove("iaDragHighlight");

        var dropped = Array.from(e.dataTransfer.files || []);
        if (dropped.length > 0) {
            ProcessIAFiles(MainID, dropped);
        }
    });
}
function ApplyNotes(main, arr, go) {
    var mainid = arr[0];
    var addtlID = arr[1];

    if (!go) {
        getData(null, newFormData("_IAGetCIDs", { mainid: mainid }), function (vr) {
            var jsXCIDs = jparse(vr);

            PopUpOpt(main, "button|class=blueButton|onclick=ApplyNotes(null, [" + mainid + ",'" + addtlID + "'],true)|Submit");

            var ht = main.clientHeight - 40;
            xsection(main, [
                "textarea|id=iaNotes|style=resize:none;width:100%; height:" + ht + "px",
                "input|type=checkbox|style=display:" + ((addtlID != "") ? "none" : "") + "|id=iaNotesShared",
                ((addtlID != "") ? "" : "label|for=iaNotesShared|class=padLeft10|Make Public?"),
                ((addtlID != "") ? "input|id=iaNotesAddtlInfo|type=hidden" :
                    "label|class=floatright" +
                    "|||label|class=padRight10|Request Info from:" +
                    "|||select|id=iaNotesAddtlInfo"),
            ]);

            iaNotesShared.checked = true;
            iaNotes.focus();

            xsection(iaNotesAddtlInfo, ["option|value=0|"]);
            for (var i = 0; i < jsXCIDs.length; i++) {
                xsection(iaNotesAddtlInfo, ["option|value=" + jsXCIDs[i].xCID + "|" + jsXCIDs[i].xCompany]);
            }
        });
    } else {
        var shared = (iaNotesShared.checked) ? 1 : 0;
        getData(null, newFormData("_IALoadNotes", { Note: iaNotes.value, mainid: mainid, shared: shared, addtlInfo: iaNotesAddtlInfo.value, addtlID: addtlID }), function (vr) {
            jsNotesFiles = jparse(vr);
            if (addtlID != "" || iaNotesAddtlInfo.value != "")
                getData(null, newFormData("_IAGetAddtlInfoEmails", { addtlID: addtlID }), function (vr) {
                    SendEmailAlert("Request for Info", mainid.toString());
                });
            else
                SendEmailAlert("Form Applications", mainid.toString());

            closePopUp("Apply Notes");
            buildNotesFileSection(mainid);

        })
    }
}

function LockRecord(mainid, go) {
    if (!go) {
        // xconfirm(null, [
        //     "div|You are about to Lock this record.  Once locked, the record cannot be edited further.",
        //     "br",
        //     "div|Do you want to continue?"
        // ], "LockRecord(" + mainid + ", true)");

        var elems = [
            // Header
            "div|style=background:rgb(31, 41, 67);padding:10px;height:50px;|class=ua-card-hdr" +
            "|||label|icon=private_badge.png|icon.style=background:white;height:30px;width:25px;padding:2px;" +
            "|||span|style=color:#FFF;|class=ua-card-title|Save & Lock",

            "div|style=height:300px;padding:30px;background:#FAEEDA;|class=cr-card" +
            "|||label|icon=icoAlert_orange.png|icon.style=height:30px;width:25px;padding:2px;" +
            "|||span|style=padding-left:5px;padding-top:5px;|<b>You are about to Lock this record.  Once locked, the record cannot be edited further.<br>Do you want to continue?</b>",
            "br"
        ];

        xconfirm(null, elems, "LockRecord(" + mainid + ", true)");
        document.getElementById("xconfirmCancel").className = "ugDeleteBtn";
        document.getElementById("xconfirmContinue").className = "ugSubmitBtn";
    } else {
        xconfirm();
        getData(null, newFormData("_IALockRecord", { mainid: mainid }), function (vr) {
            SubmitRecord(mainid, 1);
        })
    }
}
function SubmitRecord(mainid, released) {
    //code:20241108:jk:clone record
    if (cloneID != null)
        mainid = 0;

    var sectionid, formid, recordid, fieldids;
    var js = jsNeo.jsALL.filter(d => d.MainID == mainid)[0];
    console.log("submit record", js, mainid, curRecord, jsNeo.jsALL);

    var sectionid = (!currentSaveFormVals.SectionID) ? js.SectionID : currentSaveFormVals.SectionID;
    var formid = (!currentSaveFormVals.FormID) ? js.FormID : currentSaveFormVals.FormID;
    var recordid = js.RecordID;
    var recordid = (recordid == null) ? "" : recordid;

    //var fieldids = [], fieldtypes = [], fieldnames = [];
    //for (var i = 0; i < curRecord.length; i++) {
    //    var x = curRecord[i];
    //    fieldids.push("X_" + x.FldID);
    //    fieldtypes.push(x.FieldType);
    //    fieldnames.push(x.FieldName);
    //}

    var fieldids = [];
    var cls = document.getElementsByClassName("submitInputField");

    var upl = [];
    for (var i = 0; i < cls.length; i++) {
        var val = cls[i].value;
        val = (!isCheckbox(cls[i])) ? val : (cls[i].checked) ? "Yes" : "";
        upl.push({ id: cls[i].id, val: val });

    }
    console.log(3372, upl);

    if (upl.length == 0)
        xconfirm(null, [
            "div|There are no assigned fields to save.",
            "br",
            "div|This is a View Only record."
        ]);

    if (upl.length > 0)
        RunMultiSP("_GetGUIDs", [{ cnt: 1 }], function (xx) {
            recordid = (recordid == "") ? xx[0][0].GUID : recordid;

            var data = new FormData();
            data.append("strJson", jstring(upl));
            data.append("type", recordid);
            console.log("0000", "_IASubmitDataByGen300", { formid: currentSaveFormVals.FormID, recordid: recordid, released: released });
            console.log(data);
            getData("LoadGeneric300", data, function (vr) {
                console.log("=== SUBMITRECORD DEBUG START ===");
                console.log("upl (field changes):", upl);
                console.log("jstring(upl):", jstring(upl));
                console.log("recordid before LoadGeneric300:", recordid);
                console.log("FormData contents:");
                getData(null, newFormData("_IASubmitDataByGen300_2", { formid: currentSaveFormVals.FormID, recordid: recordid, released: released }), function (vr) {
                    try {
                        var js = jparse(vr)[0];
                        

                        var isnew = (mainid == 0) ? true : false;
                        mainid = js.MainID;

                        if (curSystemLinkFID)
                            getData(null,
                                newFormData("_IAGetSetSystemLinks", { getSet: 1, TypeID: curSystemLinkTypeID, ElemType: curSystemLinkFileType, ElemID: curSystemLinkFID.toString(), MainID: mainid }),
                                function (vr) {
                                    console.log("err SystemLinkSet", vr);
                                }
                            );



                        console.log(js);
                        if (cloneID != null) {
                            PopUp("Clone Record Attachments and Notes", [mainid, cloneID], null, null, ["150px", "500px"]);
                        }

                        //alert(mainid);
                        if (currentSaveFormVals.FormID == currentFormID)
                            GetMain(mainid);

                        if (released == 1)
                            SendEmailAlert("Form Applications", mainid.toString());

                    } catch (ex) {
                        console.log("err", ex);
                    }
                });
            });
        });


    //for (var i = 0; i < cls.length; i++) {
    //    var id = cls[i].id;
    //    if (id.indexOf("input") == 0 && !cls[i].disabled) { fieldids.push(id.replace("input_", "")); }
    //}

    //var subJO = { sectionid: sectionid, formid: formid, recordid: recordid, released: released, fieldids: fieldids.join("|") };
    //for (var i = 0; i < fieldids.length; i++) {
    //    var val = document.getElementById("input_" + fieldids[i]).value;
    //    if (document.getElementById("input_" + fieldids[i]).type == "checkbox") {
    //        if (document.getElementById("input_" + fieldids[i]).checked)
    //            val = "Yes";
    //        else
    //            val = "";
    //    }

    //    subJO["Val" + (i + 1)] = val;

    //    //var val = "";
    //    //if (fieldtypes[i].toLowerCase() != "info") {
    //    //    c_log(fieldids[i], fieldtypes[i], fieldnames[i]);

    //    //    val = document.getElementById("input_" + fieldids[i]).value;
    //    //    val = (document.getElementById("input_" + fieldids[i]).checked) ? "1" : val;
    //    //}
    //    //val = (val == null) ? "nochange" : val;
    //    //subJO["Val" + (i + 1)] = val;
    //}
    //console.log("app3", subJO);
    //getData(null, newFormData("_IASubmitData", subJO), function (vr) {
    //    console.log(793, vr);
    //    var js = jparse(vr)[0];

    //    var isnew = (mainid == 0) ? true : false;
    //    mainid = js.MainID;

    //    //code:20241108:jk:clone record
    //    if (cloneID != null) {
    //        PopUp("Clone Record Attachments and Notes", [mainid, cloneID], null, null, ["150px", "500px"]);
    //    } else {
    //        if (!isnew && 1 == 2) {
    //            IAResetCache(mainid);
    //            ViewDisp(mainid, formid);
    //        } else {
    //            includeMainID = mainid;
    //            beginGettingMain(mainid, true, 1);
    //            if (released == 1) 
    //                SendEmailAlert("Form Applications", mainid.toString());
    //        }
    //    }
    //});
}



//******************************************************************************************************************************
//******************************************************************************************************************************
//******************************************************************************************************************************
//*****************************************  SEARCH SECTION  *********************************************************************

// ============================================================
// SECTION: report export, advanced search-builder UI (dispBuildSearch/openSearchHelp/SortColumns)
// ============================================================
function exportFullReport() {
    //xconfirm("Your request has been submitted.\n\nYou will be notified when your report is available.")
    //getData("GetFullIAReport", xFormData({ FormID: currentFormID }), function (str) {
    getData(null, newFormData("_SetUniversalTimer", { FormID: currentFormID }), function (vr) {
        xconfirm(jparse(vr)[0].msg);
        getData("RunIAUnivTimer", null, function () {
            //getReportList();
        });
        //renewPopUp("Saved Reports");
    }, null, true);
}

function exportReport(allorselected) {
    //first click: ask whether to export every field (default) or only the displayed columns
    if (allorselected == null) {
        xconfirm(null, [
            "div|style=background:rgb(31, 41, 67);padding:10px;height:50px;|class=ua-card-hdr" +
            "|||label|icon=excel.png|icon.style=background:white;height:30px;width:25px;padding:2px;" +
            "|||span|style=color:#FFF;|class=ua-card-title|Export to Excel",

            "div|style=padding:30px;|class=cr-card" +
            "|<b>Which fields would you like to export?</b><br><br>" +
            "|||div|style=color:#555|Choose <b>All Fields</b> to export every field (the default), or " +
            "<b>Displayed Fields Only</b> to export just the columns currently shown in the report."
        ]);

        confirmFooter.innerHTML = "";
        xsection(confirmFooter, [
            "button|class=blueButton|onclick=xconfirm()|Cancel",
            "label|class=padLeft10|",
            "button|class=longblueButton|style=width:170px|onclick=exportReport('displayed')|Displayed Fields Only",
            "label|class=padLeft10|",
            "button|class=longorangeButton|style=width:150px|onclick=exportReport('all')|All Fields",
        ]);
        return;
    }

    xconfirm(); //close the chooser
    excelXconfirmHdr = ""; //filename dialog shows the default "Save .xlsx File" header (not a stale Merge Fields/Field IDs one)

    var js = exportJS.filter(d => jsExportGChart.findIndex(e => e.MainID == d.MainID) != -1);
    //alert("count:" + js.length);
    if (js.length == 0)
        return;

    if (allorselected == "displayed")
        js = exportReportDisplayedOnly(js);

    var formNm = (typeof currentFormName === "string" && currentFormName != "") ? currentFormName :
        (jsNeo && jsNeo.jsForm && jsNeo.jsForm[0] && jsNeo.jsForm[0].FormName) ? jsNeo.jsForm[0].FormName : "Report";

    //ftnExportJS reassigns the global jsExportGChart to whatever we hand it; the projected
    //"displayed only" rows can be missing MainID, which later export/grid code matches on,
    //so restore the full row set once ExportGChart has captured its copy for the spreadsheet
    var savedExportGChart = jsExportGChart;
    ftnExportJS(js, "CMS_Export_" + formNm + ".xlsx");
    jsExportGChart = savedExportGChart;
}

//reduce each export row to just the columns currently shown in the report grid
function exportReportDisplayedOnly(rows) {
    if (rows.length == 0)
        return rows;

    //what the grid is actually showing right now
    var disp = [];
    try {
        var xt = jsXTable.filter(d => d.main == displayReport);
        if (xt.length > 0 && xt[0].jo && xt[0].jo.hdrs && xt[0].jo.hdrs.length > 0)
            disp = xt[0].jo.hdrs.slice();
    } catch (ex) { }
    if (disp.length == 0 && jsColumnsList && jsColumnsList.Selected && jsColumnsList.Selected.length > 0)
        disp = jsColumnsList.Selected.slice();
    if (disp.length == 0)
        disp = dispFlds.slice();
    if (disp.length == 0)
        return rows;

    //displayed field names are underscored; export-row keys may use spaces (custom columns) — match on the underscored form
    var keyByNorm = {};
    for (var k in rows[0])
        keyByNorm[String(k).replace(/ /g, "_")] = k;

    var outKeys = [];
    for (var i = 0; i < disp.length; i++) {
        var norm = String(disp[i]).replace(/ /g, "_");
        if (keyByNorm.hasOwnProperty(norm) && outKeys.indexOf(keyByNorm[norm]) == -1)
            outKeys.push(keyByNorm[norm]);
    }
    if (outKeys.length == 0)
        return rows;

    return rows.map(function (r) {
        var o = {};
        for (var i = 0; i < outKeys.length; i++)
            o[outKeys[i]] = r[outKeys[i]];
        return o;
    });
}

var dateRangeState = {
    loadedFrom: "",
    loadedTo: "",
    releasedFrom: "",
    releasedTo: ""
};

var ColumnVals = [];
function dispBuildSearch(js, flds) {
    PageContainer.innerHTML = "";
    flds.sort();
    ColumnVals = flds;

    var ht = document.body.clientHeight - 250;
    xsection(PageContainer, [
        "table|style=width:100%" +
        "|||tr" +
        "|||append|td|id=tdDisplayFields|style=display:none; border:solid 1px gray|id=tdDisplayFields" +
        "|||td|id=dispMain"
    ]);


    xsection(dispMain, [
        "div|style=padding:10px; border:solid 1px gray; " +
        "|||append|table|style=width:100%" +
        "" + "|||append|tr" +
        "" + "" + "|||" + "td|style=width:150px;|||append|label|class=cursor|icon=3col-icon.png|onclick=ManageColumns()|Manage Columns" + "|||back|L" +
        "" + "" + "|||" + "td|name=tdSrchBlank" +
        "" + "" + "|||" + "td|style=white-space:nowrap|id=placeFilters" +
        "" + "" + "|||" + "td|style=width:150px; white-space:nowrap" +
        "" + "" + "" + "|||br" +
        "" + "" + "" + "|||br" +
        "" + "" + "" + ((CachedResults) ? "|||div|style=color:red|Cached Results" : "") +
        "" + "" + "" + ((init) ? "|||div|style=color:red|DISPLAYING FILTERED RECORDS MODIFIED IN THE LAST 5 DAYS.<br>SELECT <b>RUN REPORT</b> TO OBTAIN FULL FILTERED LIST." : "") +
        "" + "" + "|||" + "td|style=text-align:right; white-space:nowrap;position:relative|id=tdRightOptions" +
        "|||cancel|span|id=lblFilters|||button|class=blueButton|onclick=PopUp('Sort Columns', null, null, true, ['500px','600px'])|style=display:none;float:right|Sort Columns",
        "div|id=displayReport|style=padding:10px;height:" + ht + "px",
        "div|id=printReport|style=display:none",
    ]);

    xsection(placeFilters, [
        "div|class=|Filters:" +
        "|||label|id=lblCustFilters|class=padLeft5 padRight5" +
        "|||img|style=padding-left:5px;padding-right:5px;height:15px;width:23px;cursor:pointer|title=Help with Search|src=help_icon.png|onclick=openSearchHelp()" +
        "|||input|id=txtFilters|onkeyup=dontrun~true; filterChart(event)|list=dataList_CustFilters|style=width:200px|placeholder=Search the results and press Enter" +
        "|||datalist|id=dataList_CustFilters" +
        "|||label|style=width:10px| " +
        "|||button|class=blueButton|id=btnRunReport|onclick=filterChart(null, true, null, true)|Run Report"

    ]);

    init = false;

    var x = [];
    for (var i = 0; i < availFlds.length; i++) {
        if (x.indexOf(availFlds[i]) == -1) { x.push(availFlds[i]); }
    }
    console.log(jsNeo.jsADD[0]);
    var FieldIDs = jsNeo.jsADD[0].FieldIDs.split(",");
    var FieldDescriptions = []; // = jsNeo.jsADD[0].FieldDescriptions.split("|");

    for (var key in jsNeo.jsADD[0]) {
        if (key.indexOf("K_") == 0 && key != "K_MainID") {
            //c_log(key);
            FieldDescriptions.push(jsNeo.jsADD[0][key].replace(/ /g, "_"));
        }
    }

    //for (var i = 0; i < FieldIDs.length; i++) {
    //    FieldDescriptions.push(jsNeo.jsADD[0][FieldIDs[i].replace("F_", "K_")].replace(/ /g, "_"));
    //}


    c_log(x, FieldDescriptions);

    for (var i = 0; i < x.length; i++) {
        var val = x[i];
        var ix = FieldDescriptions.indexOf(val);
        var id = FieldIDs[ix];
        id = (ix == -1) ? val : id;
        //c_log(val);
        var str = id + ":" + val + "^" + val.replace(/_/g, " ");
        x[i] = str;
    }

    console.log(689, x);
    xsection(lblCustFilters, ["select|id=custFilters|style=width:150px|onchange=custFilters_onchange()|options=:Quick Search^Quick Search~" + x.join("~")]);

    xsection(tdRightOptions, [
        //"label|icon=dashboardN.png|class=cursor padLeft5|onclick=PopUp('NeoData Dashboard', null, null, null, ['750px','900px'])|Create Dashboard",
        //"label|style=width:20px|",
        "label|icon=print-icon.png|class=cursor padLeft5|onclick=exportReport()|Export to Excel",
        "label|style=width:20px|",
        "label|icon=documentWhand.png|class=cursor padLeft5|onclick=exportFullReport()|Save Full Report",
        "br", "br",
        "label|class=sm|Retrieved: |||label|id=id=displayRecordTotal|" + TCountString // +
        //((CachedResults) ? "|||div|style=color:red|Cached Results" : "")
    ]);

    //if (TCount > 1000) {
    //    xsection(tdRightOptions, [
    //        "br", "br",
    //        "label|icon=print-icon.png|class=cursor padLeft10|onclick=exportFullReport()|Get Full Report",
    //    ]);
    //}

    c_log(dispFlds);
    var ht = dispMain.clientHeight - 45;
    xsection(tdDisplayFields, [
        "div|id=divDisplayFields_hdr|class=smhdr shadowSection cursor|Manage Columns" +
        "" + "|||append|label|class=redlink|style=font-weight:normal; float:right|onclick=showHideSection('tdDisplayFields')|x",
        "div|id=divDisplayFieldsInner|class=padLeft10 padTop10|style=white-space:nowrap; width:100%; height:" + ht + "px; overflow-y:auto"
    ]);
    for (var i = 0; i < flds.length; i++) {
        xsection(divDisplayFieldsInner, [
            "div|style=text-align:left" +
            "|||input|type=checkbox|name=ddDisplayFields|id=ddDisplayFields_" + i + "|onchange=ddDisplayFields_Change(" + i + ", '" + flds[i].replace(/=/g, "~") + "')|onclick=cbMultiSelect(event, 'ddDisplayFields', " + i + ")|value=" + flds[i] +
            "|||label|class=padLeft10|for=ddDisplayFields_" + i + "|" + flds[i].replace(/_/g, " ").replace(/=/g, "~")
        ]);
    }
    var i = flds.length;
    for (var key in jsTriggeredVals[0]) {
        if (flds.indexOf(key) == -1)
            ColumnVals.push(key);

        xsection(divDisplayFieldsInner, [
            "div|style=text-align:left" +
            "|||input|type=checkbox|name=ddDisplayFields|id=ddDisplayFields_" + i + "|onchange=ddDisplayFields_Change(" + i + ", '" + key + "')|onclick=cbMultiSelect(event, 'ddDisplayFields', " + i + ")|value=" + key +
            "|||label|class=padLeft10|for=ddDisplayFields_" + i + "|" + key.replace(/_/g, " ")
        ]);
        i++;
    }
    var i = flds.length;
    for (var key in jsSubformVals[0]) {
        if (flds.indexOf(key) == -1) {
            ColumnVals.push(key);

            xsection(divDisplayFieldsInner, [
                "div|style=text-align:left" +
                "|||input|type=checkbox|name=ddDisplayFields|id=ddDisplayFields_" + i + "|onchange=ddDisplayFields_Change(" + i + ", '" + key + "')|onclick=cbMultiSelect(event, 'ddDisplayFields', " + i + ")|value=" + key +
                "|||label|class=padLeft10|for=ddDisplayFields_" + i + "|" + key.replace(/_/g, " ")
            ]);
        }
        i++;
    }
    console.log(dispFlds);

    //xsection(tdSrchDTLoaded, ["div|class=padTop10|||label|class=padRight10|From|||input|type=date|name=cbSearchDT|value"]);
    //xsection(tdSrchDTLoaded, ["div|||label|style=padding-right:25px|To|||input|type=date|name=cbSearchDT|value="]);

    //xsection(tdSrchDTReleased, ["div|class=padTop10|||label|class=padRight10|From|||input|type=date|name=cbSearchDT|value="]);
    //xsection(tdSrchDTReleased, ["div|||label|style=padding-right:25px|To|||input|type=date|name=cbSearchDT|value="]);



    filterChart(null, true);
}

function openSearchHelp() {
    xconfirm(null, [
        "div|class=shadowSection bold|Help with Searching",
        "br", "li|class=med|<b>Quick Search:</b> This allows you to filter the results already returned from the database.  The search will include a wildcard at the beginning and end of the text so, to search for data containing \"Request\", you only need to type \"request\".  The search text is NOT case sensitive.",
        "br", "li|class=med|<b>Column Search:</b> This allows you to filter the results at the database level.  The search will include a \"wildcard\" at the end of the text so, to search for data beginning with \"Requested Information\",  just type \"requested info\".  The search text is NOT case sensitive.",
        "br", "li|class=med|<b>Column Search with Delimited String:</b> This allows you to enter multiple expressions separated by a pipe; i.e. \"Priority\" is selected as the column and you would enter as a string, \"medium//high\".  This method does NOT use \"wildcards\" so each value needs to be written as it is stored in the database but NOT case sensitive."
    ]);
}

//code:20240522:1000am - Sort Columns function
//function SortColumns(main, ix, ud) {
//    if (ix != null) {
//        var ixx = (ud == "U") ? ix - 1 : ix + 1;

//        var a = dispFlds[ix];
//        var b = dispFlds[ixx];
//        dispFlds[ix] = b;
//        dispFlds[ixx] = a;

//        getData(null, newFormData("_IAGetDisplayFields", { formid: currentFormID, dispFlds: dispFlds.join(",") }), function (vr) {
//            DrawIAReport();
//        }, null, true);
//    }

//    main.innerHTML = "";
//    xsection(main, ["table|id=tblSortColumns"]);
//    for (var i = 0; i < dispFlds.length; i++) {
//        if (i > 0)
//            xsection(tblSortColumns, ["tr", "td|colspan=2|||hr"]);

//        xsection(tblSortColumns, [
//            "tr",
//            "td" +
//            ((i > 0) ? "|||label|class=alink|onclick=SortColumns(document.getElementById('" + main.id + "'), " + i + ", 'U')|UP" + "|||br" : "") +
//            ((i < dispFlds.length - 1) ? "|||label|class=alink|onclick=SortColumns(document.getElementById('" + main.id + "'), " + i + ", 'D')|DOWN" : ""),
//            "td|style=vertical-align:center|class=smhdr padLeft30|" + dispFlds[i]
//        ]);
//    }
//}

//code:20240523:1246pm - Sort Columns - apply dragndrop
//function SortColumns(main, ix, ud) {
//    //code:20240524:104pm - remove display field dupes
//    dispFlds = removeDupesFromArray(dispFlds);

//    // Update display fields and redraw the report
//    getData(null, newFormData("_IAGetDisplayFields", { formid: currentFormID, dispFlds: dispFlds.join(",") }), function (vr) {
//        DrawIAReport();
//    }, null, true);

//    // Clear and rebuild the table
//    main.innerHTML = "";
//    xsection(main, [
//        "div|class=shadowSection|Drag and drop columns to reset their position in the main report",
//        "div|style=height:380px;overflow-y:scroll|||br|||table|id=tblSortColumns|style=width:100%;padding-top:10px"]);

//    for (var i = 0; i < dispFlds.length; i++) {
//        if (i > 0) xsection(tblSortColumns, ["tr", "td|colspan=4|||hr"]);

//        xsection(tblSortColumns, [
//            "tr",
//            "td|class=shadowSection pad10|style=text-align:center;width:100%;cursor:pointer;|class=smhdr padLeft30|" + dispFlds[i] +
//            "|draggable=true|data-index=" + i,
//            //"hr"
//        ]);
//    }

//    // Add event listeners for drag-and-drop functionality
//    Array.from(document.querySelectorAll('[data-index]')).forEach(function (td) {
//        td.addEventListener('dragstart', function (e) {
//            e.dataTransfer.setData('text/plain', e.target.dataset.index);
//            e.target.style.color = "blue"; // Set the color of the dragged element to blue
//            e.target.style.backgroundColor = "aliceblue"; // Set the color of the dragged element to blue
//        });

//        td.addEventListener('dragover', function (e) {
//            e.preventDefault();
//        });

//        td.addEventListener('drop', function (e) {
//            e.preventDefault();
//            var dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
//            var dropIndex = parseInt(e.target.dataset.index);

//            if (dragIndex !== dropIndex) {
//                var dragElement = document.querySelector('[data-index="' + dragIndex + '"]');
//                var dropElement = e.target;

//                // Reorder the elements in the DOM
//                var parent = dropElement.parentNode;
//                parent.insertBefore(dragElement, dropElement);

//                // Update the data-index attributes to reflect new order
//                Array.from(document.querySelectorAll('[data-index]')).forEach(function (td, index) {
//                    td.dataset.index = index;
//                });

//                // Optionally update the dispFlds array to reflect new order
//                dispFlds.splice(dropIndex, 0, dispFlds.splice(dragIndex, 1)[0]);

//                // Update display fields and redraw the report
//                getData(null, newFormData("_IAGetDisplayFields", { formid: currentFormID, dispFlds: dispFlds.join(",") }), function (vr) {
//                    DrawIAReport();
//                }, null, true);

//                // Redraw the columns after reordering
//                SortColumns(main);
//            }
//        });

//        // Reset color on dragend
//        td.addEventListener('dragend', function (e) {
//            e.target.style.color = "";
//            e.target.style.backgroundColor = "";
//        });
//    });
//}

function updateDateState(key, value) {
    dateRangeState[key] = value;
    console.log("Date state updated:", dateRangeState); // Optional: Log the state for debugging
}

//code:20240524 201pm Changes That Include the drag Icon
function SortColumns(main, ix, ud) {
    // Update display fields and redraw the report
    getData(null, newFormData("_IAGetDisplayFields", { formid: currentFormID, dispFlds: dispFlds.join(",") }), function (vr) {
        DrawIAReport();
    }, null, true);
    console.log("sort", dispFlds);

    // Clear and rebuild the table
    main.innerHTML = "";
    xsection(main, [
        "div|class=shadowSection|Drag and drop columns to reset their position in the main report",
        "div|style=height:380px;overflow-y:scroll|||br|||table|id=tblSortColumns|style=width:100%;padding-top:10px"]);

    dispFlds = dispFlds.filter(item => item !== "Application_Type");//code: 20240523 500pm. filter out the "Application_Type option

    for (var i = 0; i < dispFlds.length; i++) {
        if (i > 0) xsection(tblSortColumns, ["tr", "td|colspan=4|||hr"]);

        //code:20240524 201pm Changes That Include the drag Icon
        xsection(tblSortColumns, [
            "tr",
            "td|style=width:100%;cursor:pointer;|class=smhdr padLeft30 dragIcon colSort|" + dispFlds[i] +
            "|draggable=true|data-index=" + i,
        ]);
    }
    xsection(tblSortColumns, [
        "tr", "td|colspan=4|||hr",
        "tr",
        "td|style=width:100%;cursor:pointer;color:white; background-color:silver;|class=smhdr padLeft30 colSort|[End]|data-index=" + dispFlds.length,
    ]);

    // Add event listeners for drag-and-drop functionality
    Array.from(document.querySelectorAll('[data-index]')).forEach(function (td) {
        td.addEventListener('dragstart', function (e) {
            e.dataTransfer.setData('text/plain', e.target.dataset.index);
            e.target.style.color = "blue"; // Set the color of the dragged element to blue
            e.target.style.backgroundColor = "aliceblue";
            e.target.style.height = "50px";//code: 20240523 500pm. Move the entire td

        });

        td.addEventListener('dragover', function (e) {
            e.preventDefault();
        });

        td.addEventListener('drop', function (e) {
            e.preventDefault();
            var dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
            var dropIndex = parseInt(e.target.dataset.index);

            //code:20240527:236pm - fix drag drop locations
            if (dragIndex !== dropIndex) {
                dragIndex = dragIndex * 10;
                dropIndex = dropIndex * 10;

                var colSort = document.getElementsByClassName("colSort");
                var jsDF = [];
                for (var i = 0; i < colSort.length; i++) {
                    jsDF.push({ ix: i * 10, fld: colSort[i].innerHTML })
                }

                jsDF[jsDF.findIndex(d => d.ix == dragIndex)].ix = jsDF[jsDF.findIndex(d => d.ix == dropIndex)].ix - 5;

                var newdf = [];

                sortJS(jsDF, "ix");
                for (var i = 0; i < jsDF.length; i++) {
                    if (jsDF[i].fld.trim() != "" && jsDF[i].fld != "[End]")
                        newdf.push(jsDF[i].fld);
                }
                console.log(2410, dispFlds, jsDF, newdf);


                //for (var i = 0; i < dispFlds.length + 1; i++) {
                //    if (i == dropIndex * 1) {
                //        newdf.push(dispFlds[dragIndex]);
                //    }
                //    if (i != dragIndex * 1) {
                //        //if (i < dispFlds.length)
                //            newdf.push(dispFlds[i]);
                //    }
                //}
                dispFlds = newdf;

                //var dragElement = document.querySelector('[data-index="' + dragIndex + '"]');
                //var dropElement = e.target;

                //// Reorder the elements in the DOM
                //var parent = dropElement.parentNode;
                //parent.insertBefore(dragElement, dropElement);

                //// Update the data-index attributes to reflect new order
                //Array.from(document.querySelectorAll('[data-index]')).forEach(function (td, index) {
                //    td.dataset.index = index;
                //});

                //// Optionally update the dispFlds array to reflect new order
                //dispFlds.splice(dropIndex, 0, dispFlds.splice(dragIndex, 1)[0]);

                //// Update display fields and redraw the report

                console.log(2410, "_IAGetDisplayFields", { formid: currentFormID, dispFlds: dispFlds.join(",") });
                getData(null, newFormData("_IAGetDisplayFields", { formid: currentFormID, dispFlds: dispFlds.join(",") }), function (vr) {
                    DrawIAReport();
                }, null, true);

                // Redraw the columns after reordering
                SortColumns(main);
            }
        });

        // Reset color on dragend
        td.addEventListener('dragend', function (e) {
            e.target.style.color = "";
            e.target.style.backgroundColor = "";
        });
    });
};

function ddCustomOnchange() {
    var FieldIDs = jsNeo.jsADD[0].FieldIDs.split("|");
    var FieldNames = jsNeo.jsADD[0].FieldNames.split("|");

    var x = ddCustomSearch.value;
    var ix = FieldIDs.indexOf(x);
    var z = FieldNames[ix];
    z = (ix == -1) ? x : z;
    curCustom = [x, z, "", ""];
    c_log(curCustom);
    console.log("curCustom");

    divSrchDTCustom.innerHTML = "";

    if (z.toLowerCase().indexOf("date") > -1) {
        xsection(divSrchDTCustom, ["div|class=padTop10|||label|class=padRight10|From|||input|type=date|name=cbSearchCustom"]);
        xsection(divSrchDTCustom, ["div|||label|style=padding-right:25px|To|||input|type=date|name=cbSearchCustom"]);
    } else if (x != "") {
        xsection(divSrchDTCustom, ["div|||label|icon=magGlass.png|||input|name=cbSearchCustom|onkeyup=cbSearchCustom_onkeyup(event)"]);
        document.getElementsByName("cbSearchCustom")[1].focus();
    } else {
        curCustom = ["", "", "", ""];
    }
}

function cbSearchCustom_onkeyup(e) {
    if (e.keyCode == 13) { beginGettingMain(null, null, 0); }
}

function ddDisplayFields_Change(i, val) {
    //code:20240524:104pm - redo change of columns
    var opts = document.getElementsByName("ddDisplayFields");

    //set array for everything checked
    var disp = [];
    for (var i = 0; i < opts.length; i++) {
        if (opts[i].checked)
            disp.push(opts[i].value);
    }

    //set new array removing anything not checked
    var ndisp = [];
    for (var i = 0; i < dispFlds.length; i++) {
        if (disp.indexOf(dispFlds[i]) != -1)
            ndisp.push(dispFlds[i]);
    }

    //append to end of new array anything new
    for (var i = 0; i < disp.length; i++) {
        if (ndisp.indexOf(disp[i]) == -1)
            ndisp.push(disp[i]);
    }

    //set new maintaining previous order
    dispFlds = ndisp;

    //doe not allow an empty array
    dispFlds = (dispFlds.length > 0) ? dispFlds : ["MainID", "Date_Loaded"];

    selectManageColumnsCheckboxes();
    console.log(dispFlds);

    //code:20240524:104pm - disable checkboxes until db call returns
    for (var i = 0; i < opts.length; i++) { opts[i].disabled = true; }

    getData(null, newFormData("_IAFormDisplay", { formid: currentFormID, fields: dispFlds.join(","), go: 1 }), function (vr) {
        //code:20240524:104pm - disable checkboxes until db call returns
        for (var i = 0; i < opts.length; i++) { opts[i].disabled = false; }

        //code:20240524:104pm - make sure checked fields match db return - exists in DrawIAReport as well
        selectManageColumnsCheckboxes();
        DrawIAReport();
    }, null, true);

}
function dispSetSearch(js) {
    //var dts = js[0].Filters.split("|");
    //for (var i = 0; i < dbn("cbSearchDT").length; i++) {
    //    if (dts[i] != "") {
    //        var date = new Date(dts[i]).toISOString().substring(0, 10);
    //        dbn("cbSearchDT")[i].value = date;
    //    }
    //}
}
function clearDates() {
    //for (var i = 0; i < dbn("cbSearchDT").length; i++) {
    //    dbn("cbSearchDT")[i].value = null;
    //}
}

//function AddBulkDisp() {
//    xconfirm("Feature pending...");
//}

var jsCurrentFormSigners = [];
// ============================================================
// SECTION: e-signature flow (signDoc/recallSignature), PDF viewing/export, record actions (print/
// clone/delete/lock/submit), record history
// ============================================================
function signDoc(MainID, Filename) {
    var data = new FormData();
    data.append("MainID", MainID);
    data.append("Filename", Filename);
    getData("SendPDF2Queue", data, function (vr) {
        xconfirm(vr);
        justSigned = true;
        beginGettingMain(MainID, null, 0);
    });
}

function exportDoc(MainID, filename) {
    getData(null, newFormData("_GetUserToken", {}), function (vr) {
        var tmpToken = jparse(vr)[0].Token

        getData(null, newFormData("_IAGetDataByMainID", { mainid: MainID, nodoc: 1 }), function (vr) {
            //alert(vr);
            var js = jparse(vr)[0];
            var envid = js.EnvelopeID;
            var signed = js.Signed;
            var releasedDate = jsNeo.jsALL.filter(d => d.MainID == MainID)[0].Released_Date;
            var released = (releasedDate == "" || releasedDate == null) ? false : true;

            console.log("export", js);

            if (released) {
                if (signed) {
                    xconfirm("The document has been signed");
                } else if (envid != null) {
                    xconfirm("The document is awaiting signatures")
                }
            }

            //windowOpen("GetIAPDF?MainID=" + MainID);
            var fil = document.getElementById("IAPDF");
            if (fil != null) { fil.parentElement.removeChild(fil); }

            var doc = dyn("div", "id=IAPDF|class=fileViewer|style=position:;background-color:white;height:500px;width:900px;overflow:hidden;");
            extra(doc, true, true);

            var ht = 600 + "px";
            var wd = 800 + "px";


            xsection(IAPDF, [
                "div|id=IAPDF_hdr|onclick=FV_Bring2front('IAPDF')|class=PopUpHdr|style=cursor:pointer; font-weight:bold;font-size:10px" +
                "" + "|||label|id=IAPDF_hdrTitle|" + filename,
                "div|id=IAPDF_inner|style=width:100%;height:100%;"
            ]);

            var iframeLoading = "iframeLoading_IAPDF";

            section("IAPDF_inner", [
                //((fid > 0) ?
                "img|id=" + iframeLoading + "|src=loading.gif|style=cursor:pointer;position:absolute;top:40%;left:40%|title=Click to remove loading image|onclick=iframeLoading_GetIAPDF.style.display~\"none\"|",// :
                //"div|class=sm|id=iframeLoading_" + fid + "|Please wait while data is loading ..."),
                "iframe|id=iframe_IAPDF|title=" + filename + "|src=GetIAPDF?MainID~" + MainID + "&filename~" + filename + "&token~" + tmpToken +
                "|style=background-color:white;width:100%;height:100%; overflow:auto" +
                "|onload=" + iframeLoading + ".style.display~\"none\""
            ]);

            console.log(signed, released, envid);
            section("IAPDF_hdr", [
                "label|class=blueButton|style=float:right|onclick=closeIAPDF()|Close",
                "label|style=float:right; width:10px;|",
                ((signed) ? "" : (!released) ? "" : (envid != null) ? "" : "label|class=longblueButton|style=float:right|onclick=signDoc(" + MainID + ",'" + filename + "')|Send for Signatures"),
                ((signed) ? "" : (!released) ? "" : (envid == null) ? "" : "label|class=longblueButton|style=float:right|onclick=recallSignature(" + MainID + ")|Recall Signatures")
            ]);

            dragElement(IAPDF);
        });
    });
}

////code: 20240902 2:20pm
function ViewPDF(main, filename) {
    main.parentElement.style.width = "1050px";//code: 20240904 4:02pm SO
    xsection(main, [
        "div|id=exportedDivIA",
    ]);
    xsection(exportedDivIA, [
        "div|id=printHdrDivIA|style=display:flex;padding-bottom:10px;",
        "div|id=printDivIA",
    ]);

    // Get the content to be cloned
    var contentDivIA = document.getElementById('ViewDispute');
    // contentDivIA.style.overflow = "hidden";
    var newDivIA = document.getElementById('printDivIA');
  

    // Clone the content
    var clonedContentIA = contentDivIA.cloneNode(true);
    // clonedContentIA.style.width = "100%";

    console.log(contentDivIA.innerHTML);
    console.log(clonedContentIA.innerHTML);

    var dateInputs = clonedContentIA.querySelectorAll('input[type="date"]');

    dateInputs.forEach((input) => {
        var value = input.value || '';
        // code: 20240904 4:02pm SO Check if the value is a valid date
        var dateValue = new Date(value);
        if (!value || isNaN(dateValue.getTime())) {
            console.warn("Invalid or undefined date in input:" + input.outerHTML);
            // You can replace the invalid date with a default value or an empty string
            value = '';  // Or you could use a default like `value = new Date().toISOString().split('T')[0];`
        } else {
            // Format the date as yyyy-MM-dd
            value = dateValue.toISOString().split('T')[0];
        }
        // Replace the input element with the formatted value as a text node
        var textNode = document.createTextNode(value);
        input.parentNode.replaceChild(textNode, input);
    });

    // Remove buttons and redlink elements
    var buttonsIA = clonedContentIA.querySelectorAll('button');
    var redlinkIcons = clonedContentIA.querySelectorAll('.redlink');
    var iaDropZoneOnPDFs=clonedContentIA.querySelectorAll('#iaAttachDropzone');
    iaDropZoneOnPDFs.forEach((iaDropZoneOnPDF) => iaDropZoneOnPDF.remove());
    buttonsIA.forEach((button) => button.remove());
    redlinkIcons.forEach((redlinkIcon) => redlinkIcon.remove());

    // Replace select dropdowns with their selected values
    var selects = clonedContentIA.querySelectorAll('select');
    selects.forEach((select) => {
        var selectedText = select.options[select.selectedIndex].textContent || '';
        var textNode = document.createTextNode(selectedText);
        select.parentNode.replaceChild(textNode, select);
    });

    // Replace textareas with their values
    var textareas = clonedContentIA.querySelectorAll('textarea');
    textareas.forEach((textarea) => {
        var textNode = document.createTextNode(textarea.value || '');
        textarea.parentNode.replaceChild(textNode, textarea);
    });

    // Replace text inputs and date inputs with their values
    var textInputs = clonedContentIA.querySelectorAll('input[type="text"], input[type="date"]');
    textInputs.forEach((input) => {
        var textNode = document.createTextNode(input.value || '');
        input.parentNode.replaceChild(textNode, input);
    });

    // Handle input elements with datalist
    var datalistInputs = clonedContentIA.querySelectorAll('input[list]');
    datalistInputs.forEach((input) => {
        var value = input.value || '';
        var textNode = document.createTextNode(value);
        input.parentNode.replaceChild(textNode, input);
    });

    // Remove empty option elements
    var emptyOptionsIA = clonedContentIA.querySelectorAll('option');
    emptyOptionsIA.forEach((option) => {
        if (!option.value.trim()) {
            option.remove();
        }
    });

    var answers = clonedContentIA.querySelectorAll('.answerTD');    
    for (var i = 0; i < answers.length; i++) {
        answers[i].style.paddingLeft = "30px";
        answers[i].style.fontWeight = "bold";
    }

    var questions = clonedContentIA.querySelectorAll('.singleDspTables');
    for (var i = 0; i < questions.length; i++) {
        questions[i].style.paddingTop = "10px";
    }

    console.log("chldrn", questions, answers);

    // Append the modified content to the new div
    newDivIA.appendChild(clonedContentIA);

    // Add the button to export the HTML to PDF
    PopUpOpt(main, "button|id=exportButton|class=blueButton|onclick=exportHTML2PDF('exportedDivIA', '" + filename + "')|Print PDF");

    //getData(null, newFormData("_IAGetDataByMainID", { mainid: curMainID, nodoc: 1 }), function (vr) {
    //    //alert(vr);
    //    console.log("err", jparse(vr));
    //    var js = jparse(vr)[0];
    //    var envid = js.EnvelopeID;
    //    var signed = js.Signed;
    //    var releasedDate = jsNeo.jsALL.filter(d => d.MainID == MainID)[0].Released_Date;
    //    var released = (releasedDate == "" || releasedDate == null) ? false : true;

    //    console.log(signed, released, envid);
    //    if (!signed && released && envid == null)
    //        PopUpOpt(main, "label|class=longblueButton|style=float:right|onclick=signDoc(" + MainID + ",'" + filename + "')|Send for Signatures");

    //    if (!signed && released && envid != null)
    //        PopUpOpt(main, "label|class=longblueButton|style=float:right|onclick=recallSignature(" + MainID + ")|Recall Signatures");
    //});

}



function recallSignature(mainid, GO) {
    if (!GO) {
        xconfirm("Are you sure you want to recall this signature?", null, "recallSignature(" + mainid + ",true)");
    } else {
        xconfirm();
        getData(null, newFormData("_IARecallSignature", { mainid: mainid }), function (vr) {
            beginGettingMain(mainid, null, 0);
        })
    }
}
function closeIAPDF() {
    var fil = document.getElementById("IAPDF");
    if (fil != null) { fil.parentElement.removeChild(fil); }
}

function DownloadAttachments(mainid) {
    //prompt for a filename the same way the Export to Excel feature does
    var strMainID = rightString("000000000" + mainid, 9);
    var formNm = (typeof currentFormName === "string" && currentFormName != "") ? currentFormName :
        (jsNeo && jsNeo.jsForm && jsNeo.jsForm[0] && jsNeo.jsForm[0].FormName) ? jsNeo.jsForm[0].FormName : "Form";
    var defaultFN = formNm.replace(/ /g, "_") + "_No_" + strMainID + "_Attachments.zip";

    var elems = [
        // Header
        "div|style=background:rgb(31, 41, 67);padding:10px;height:50px;|class=ua-card-hdr" +
        "|||label|icon=zip.png|icon.style=background:white;height:30px;width:25px;padding:2px;" +
        "|||span|style=color:#FFF;|class=ua-card-title|Save .zip File",

        "div|style=height:300px;padding:30px;|class=cr-card" +
        "|<b>Enter a filename to save file as:</b><br><br>" +
        "|||input|id=txtZipFilename|style=width:100%;padding:10px;border:1px solid #ccc;border-radius:4px;box-sizing:border-box;font-size:14px;|placeholder=ex. Attachments_20240501.zip|onkeyup=DownloadAttachments_onkeyup(event," + mainid + ")",
        "br"
    ];

    xconfirm(null, elems, "DownloadAttachmentsGo(" + mainid + ")");
    document.getElementById("xconfirmCancel").className = "ugDeleteBtn";
    document.getElementById("xconfirmContinue").className = "ugSubmitBtn";

    txtZipFilename.value = defaultFN;
    txtZipFilename.focus();
}

function DownloadAttachments_onkeyup(e, mainid) {
    if (e.keyCode == 13 && document.getElementById("txtZipFilename").value != "")
        DownloadAttachmentsGo(mainid);
}

function DownloadAttachmentsGo(mainid) {
    var FN = document.getElementById("txtZipFilename").value;
    if (FN == "") { return; }

    if (FN.toLowerCase().split(".zip").length == 1)
        FN = FN + ".zip";

    xconfirm();

    getData(null, newFormData("_GetCleanFilename", { filename: FN }), function (vr) {
        FN = jparse(vr)[0].Filename;
        SaveXFile("GetIAZipFile", { mainid: mainid }, FN);
    });
}

//like GetFile, but downloads the blob under a caller-supplied filename
function SaveXFile(url, joParams, filename) {
    var uToken = sessionStorage.getItem("UserToken");

    var ui = 0;
    for (var key in joParams) {
        url += ((ui == 0) ? "?" : "&") + key + "=" + joParams[key];
        ui++;
    }

    fetch(url, { method: "GET", headers: { "Authorization": "Bearer " + uToken } })
        .then(function (response) {
            if (!response.ok) { throw new Error("HTTP error! status: " + response.status); }

            //on failure (e.g. no attachments loaded) the server returns a plain-text/HTML
            //error "file" with a 200 status instead of a zip — don't silently save that
            //under a .zip filename, surface it instead
            var ct = (response.headers.get("Content-Type") || "").toLowerCase();
            if (ct.indexOf("zip") == -1) {
                return response.text().then(function (txt) {
                    throw new IAXFileError(txt);
                });
            }

            return response.blob();
        })
        .then(function (xblob) {
            var xblobUrl = window.URL.createObjectURL(xblob);
            var a = document.createElement("a");
            a.href = xblobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(function () { window.URL.revokeObjectURL(xblobUrl); }, 10000);
        })
        .catch(function (err) {
            console.error("Error fetching or saving the file:", err);
            var msg = (err instanceof IAXFileError) ? err.message : "The file could not be downloaded.";
            //the server wraps these messages in a full <html><body> doc (meant to be shown standalone) —
            //strip that wrapper since we're injecting it into the confirm dialog's own markup
            msg = msg.replace(/<\/?(html|head|body)[^>]*>/gi, "").trim();
            xconfirm(msg.replace(/\n/g, "<br>"));
        });
}

//marker so the catch() above can tell "server returned a readable error message" apart from a network/HTTP failure
function IAXFileError(message) {
    this.message = message;
    this.name = "IAXFileError";
}
IAXFileError.prototype = Object.create(Error.prototype);



function PrintRecord(mainid) {
    var strMainID = rightString("000000000" + mainid, 9);
    var filename = currentFormName.replace(/ /g, "_") + "_No_" + strMainID + ".pdf";
    var strHTML = ViewDispute.innerHTML;
    strHTML = strHTML.replace(/xpadding/g, "padding");
    console.log(4221, strHTML);

    var data = new FormData();
    data.append("HTML", strHTML);
    data.append("filename", filename);
    getData("storeHTML", data, function (vr) {
        windowOpen("ExportHTML2PDF");
    });
}

function CloneRecordAttachmentsandNotes(main, mc) {
    //code:20241108:jk:clone record
    var mainid = mc[0];
    var cloneid = mc[1];
    if (main != null) {
        PopUpOpt(main, "button|class=blueButton|onclick=CloneRecordAttachmentsandNotes(null, [" + mainid + "," + cloneid + ",'" + main.id + "'])|Submit");
        var ix = main.id.split("_")[1] * 1;
        document.getElementById("btnPopUpClose_" + ix).setAttribute("onclick", "beginGettingMain(" + mainid + ", true, 0); closePopUp(null, " + ix + ")");

        xsection(main, [
            "br",
            "div|class=padLeft10|||input|id=cloneAttachments|type=checkbox|||label|class=padLeft10|for=cloneAttachments|Attachments",
            "br",
            "div|class=padLeft10|||input|id=cloneNotes|type=checkbox|||label|class=padLeft10|for=cloneNotes|Notes",
        ]);
    } else {
        var n = (cloneNotes.checked) ? 1 : 0;
        var a = (cloneAttachments.checked) ? 1 : 0;
        var ix = mc[2].split("_")[1] * 1;
        //alert(jstring({ cloneID: cloneid, mainID: mainid, n: n, a: a }));
        getData(null, newFormData("_IACloneNotesAttachments", { cloneID: cloneid, mainID: mainid, n: n, a: a }), function (vr) {
            //alert(mainid);
            buildNotesFileSection(mainid);
            closePopUp(null, ix);
        });
    }
}

function deleteRecord(mainid, go) {
    if (!go) {
       // xconfirm("Are you sure you want to delete this record?", null, "deleteRecord(" + mainid + ", true)");

        var elems = [
            // Header
            "div|style=background:rgb(31, 41, 67);padding:10px;height:50px;|class=ua-card-hdr" +
            "|||label|icon=deleteIcon.png|icon.style=background:white;height:30px;width:25px;padding:2px;" +
            "|||span|style=color:#FFF;|class=ua-card-title|Delete Record",


            "div|style=height:300px;padding:30px;background:#FAEEDA;|class=cr-card" +
            "|||label|icon=icoAlert_orange.png|icon.style=height:30px;width:25px;padding:2px;" +
            "|<b>Are you sure you want to delete this record?</b><br><br>",
            "br"
        ];

        xconfirm(null, elems, "deleteRecord(" + mainid + ", true)");
        document.getElementById("xconfirmCancel").className = "ugDeleteBtn";
        document.getElementById("xconfirmContinue").className = "ugSubmitBtn";
    } else {
        xconfirm();

        getData(null, newFormData("_IADeleteRecord", { mainid: mainid }), function (vr) {
            LineClicked = null;
            jsNeo.jsALL = jsNeo.jsALL.filter(d => d.MainID != mainid);
            jsNeo.jsFiltered = jsNeo.jsFiltered.filter(d => d.MainID != mainid);
            xconfirm();
            SwitchReport();
            window.close();//Close the popOut Window

        })
    }

}

function RecordHistory(main, mainid) {
    getData(null, newFormData("_IAGetHistory", { mainid: mainid }), function (vr) {
        var js = jparse(vr);
        xsection(main, ["div|id=rhMain|style=height:calc(100%-10px)"]);
        //njchart(js, [], rhMain);
        xTable(main, {
            js: js,
            hdrs: ["FieldName", "Answer", "Answered_By", "Date_Answered"],
            sort: "Date_Answered",
            sortDesc: true
        });
        //getGChartTable(js, [], main, []);
    });
}





