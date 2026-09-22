// Google Chart-based sortable data table widget (getGChartTable is the main entry point) — an older,
// simpler alternative to the jchart/njchart/xTable/divChart widgets in global.js.
var arrGChart = [];
var arrGChartSort = [];
var arrGChartIndex = [];
var jsStoreGCharts = [];
var GChartFocus;

var doneitonce = 0;
// ============================================================
// SECTION: table build/sort/draw, header+row extraction helper
// ============================================================
function getGChartTable(data, display, tableDiv, func, rplc, sort, desc, justDates, xsort, colStyles, ignoreSort, isEmpty, focus, dataName, onload, storeSortType) {
    GChartFocus = focus;
    isEmpty = (isEmpty == null) ? false : isEmpty;
    colStyles = (colStyles == null) ? [] : colStyles;

    if (sort == null) {//INITIAL BUILD
        arrGChartSort = [];
        tableDiv.innerHTML = "";
        if (display.length == 0) {//write all fields when display not specified
            for (var key in data[0]) {
                display.push(key);
            }
        } else {
            var tmpDisplay = display;
            display = [], removes = [];
            for (var i = 0; i < tmpDisplay.length; i++) {
                var xx = tmpDisplay[i];
                if (xx.indexOf("*") != 0) {
                    display.push(tmpDisplay[i]);
                } else {
                    removes.push(tmpDisplay[i]);
                }
            }
            if (display.length == 0) {//write all fields when display not specified
                for (var key in data[0]) {
                    if (removes.indexOf("*" + key) == -1) { display.push(key); }
                }
            }
            console.log(display, removes);
        }
        
        func = (func == null) ? [] : func;
        arrGChartSort = (xsort != null) ? xsort : [display[0], desc];//set initial sort as 1st element ascending
        arrGChart = [data, display, tableDiv, func, rplc, justDates, colStyles, isEmpty, dataName, onload, storeSortType];//set main array

    } else {//SORT AFTER BUILT
        var js = jsStoreGCharts.filter(d => d.dvID == tableDiv);
        if (js.length > 0) {
            arrGChart = js[0]["arrGChart"];
            arrGChartSort = js[0]["arrGChartSort"];
        }

        if (ignoreSort) {
            //do nothing
        } else if (arrGChartSort[0] == sort) {
            arrGChartSort[1] = (desc != null) ? true : (arrGChartSort[1] == null) ? true : null;
        } else {
            arrGChartSort = [sort, null];
        }

        getData(null, newFormData("_GetGChartSort", { div: tableDiv, type: arrGChart[10], field: arrGChartSort[0], desc: arrGChartSort[1] }), function (vr) { });
    }
    google.charts.load('current', { 'packages': ['table'] });
    google.charts.setOnLoadCallback(gChartDrawTable);
}

function gChartSortTable(tbID, dvID, sort, ignoreSort) {
    var tb = document.getElementById(tbID);
    tb.parentElement.removeChild(tb);
    getGChartTable(null, null, dvID, null, null, sort, null, null, null, null, ignoreSort);
}

function gChartDrawTable() {
    var dt = arrGChart[0];
    var dsp = arrGChart[1];
    var dv = arrGChart[2];
    var func = arrGChart[3];
    var rplc = (arrGChart[4] == null) ? [] : arrGChart[4];
    var justDates = (!arrGChart[5]) ? false : true;
    var sort = arrGChartSort[0];
    var sortDesc = arrGChartSort[1];
    var colStyles = arrGChart[6];
    var isEmpty = arrGChart[7];
    var dataName = arrGChart[8];
    var onload = arrGChart[9];

    deNullJS(dt, true);
    
    //sortJS(dt, sort, sortDesc);
    NewSortJS(dt, sort, sortDesc);

    if (dataName != null) {
        window[dataName] = dt;
        //console.log(window[dataName]);
    }

    var hhr = getGchartHdrsNRows(dt, dsp, rplc, justDates);
    var hdrs = hhr[0];
    var rows = hhr[1];

    //BEGIN BUILDING TABLE
    try {
        var data = new google.visualization.DataTable();
        for (var i = 0; i < hdrs.length; i++) {
            var str = hdrs[i].replace(/_/g, " ");
            console.log("102 this string", str)
            data.addColumn('string', str.toString());
        }
        data.addRows(rows);
    } catch (ex) {
        console.log(ex, rows);
    }
    var dvHt = (dv.clientHeight - 10); // + "px";
    var table = new google.visualization.Table(dv);
    table.draw(data, {
        showRowNumber: true, width: '100%', height: dvHt,
        allowHtml: true,
        cssClassNames: {
            tableCell: 'tdHeightLimited'
        }
    });

    //assign ids to outer and inner containers
    var tb = dv.childNodes[0];
    var tmp = tb.childNodes[0];
    var tbb = tmp.childNodes[0];
    tb.id = "gchart-" + dv.id;
    tbb.id = tb.id + "-table";

    

    //take over header onclick events
    var rows = tbb.rows;
    var cells = rows[0].cells;
    if (cells.length > 0)
        cells[0].style.width = "20px";

    for (var ii = 1; ii < cells.length; ii++) {
        ignoreSort = false;
        //if (colStyles.length > 0) { ignoreSort = true; }
        cells[ii].setAttribute("onclick", "gChartSortTable('" + tbb.id + "', '" + dv.id + "','" + hdrs[ii - 1] + "', " + ignoreSort + ")");

        cells[ii].style.textAlign = "left";
        cells[ii].style.fontWeight = (hdrs[ii - 1] == arrGChartSort[0]) ? "bold" : "normal";

        ////example: colStyles.push({ row: i+1, col: 0, style: "text-decoration:line-through; ", class: "" });
        //for (var hsIX = 0; hsIX < colStyles.length; hsIX++) {
        //    var hs = colStyles[hsIX];
        //    if (hs.row == 0) {
        //        if ([0, ii].indexOf(hs.col) > -1) {
        //            cells[ii].className = (hs.class == "") ? cells[ii].className : cells[ii].className + " " + hs.class;
        //            cells[ii].style = (hs.style == "") ? cells[ii].style : cells[ii].style + ";" + hs.style;
                    
        //            c_log(hs.row, cells[ii].innerHTML, hs.style);
        //        }
        //    }
        //}
    }

    //assign row onclick events
    console.log("start assigning row events:", rows, dt);

    for (var i = 1; i < rows.length; i++) {
        var row = rows[i];
        var cells = row.cells;

        for (var ii = 0; ii < cells.length; ii++) {//loop through columns
            cells[ii].innerHTML = cells[ii].innerHTML.replace(/ZREMOVE/g, ""); // + "." + ii;
            for (var hsIX = 0; hsIX < colStyles.length; hsIX++) {
                var hs = colStyles[hsIX];
                try {
                    if (i == 0 && hs.rowParam == "header") {
                        //headers
                        console.log("got here", hs);
                        if ([0, ii].indexOf(hs.col) > -1) {
                            if (hs.class != null) { cells[ii].className = (hs.class == "") ? cells[ii].className : cells[ii].className + " " + hs.class; }
                            if (hs.style != null) { cells[ii].style = (hs.style == "") ? cells[ii].style : cells[ii].style + ";" + hs.style; }
                            if (hs.title != null) { cells[ii].title = hs.title; }
                        }

                    } else if (dt[i - 1][hs.rowParam] == hs.rowVal) {
                        //columns
                        if ([0, ii].indexOf(hs.col * 1) > -1) {
                            if (hs.class != null) { cells[ii].className = (hs.class == "") ? cells[ii].className : cells[ii].className + " " + hs.class; }
                            if (hs.style != null) { cells[ii].style = (hs.style == "") ? cells[ii].style : cells[ii].style + "; abc:123;" + hs.style; }
                            if (hs.title != null) { cells[ii].title = hs.title; }
                            //if (doneitonce < 5 && hs.style != "") {
                            //    alert(cells[ii].style);
                            //    doneitonce++;
                            //}

                        }
                    }
                } catch (ex) {}
            }

            //console.log(func);
            var jsFunc = func.filter(d => (d.Cols.indexOf(ii) > -1 || d.Cols.indexOf(0) > -1) && (d.Rows == null || d.Rows.indexOf(i) > -1));

            if (jsFunc.length > 0) {
                //c_log(jsFunc);
                var arrParams = jsFunc[0]["Params"], arrVals = [];
                var setFunc = false;

                for (var x = 0; x < arrParams.length; x++) {
                    //c_log(arrParams[x]);
                    var val = "";
                    try { val = dt[i - 1][arrParams[x]]; } catch (ex) {
                        //console.log("gchart err", arrParams[x], i, dt)
                    }

                    var val = (arrParams[x] == "+cell") ?
                        ii :
                        (arrParams[x] == "+row") ?
                            i :
                            (arrParams[x] == "*event") ?
                                "_event" :
                                (arrParams[x].indexOf("*") == 0) ?
                                    arrParams[x].split("*")[1] :
                                    val;

                    //c_log(val);
                    val = (val == null) ? "null" :
                        (val == "_event") ?
                            "event" :
                            (!isNaN(val)) ? val :
                                (isNaN(val) && val != "null") ? "\"" + val + "\"" :
                                    (val == "") ? "\"\"" :
                                        val;

                    if (jsFunc[0].Rows != null) {
                        //c_log("jsfunc check row and col", jsFunc[0].Rows[0], i, jsFunc[0].Cols[0], ii);
                        if (jsFunc[0].Rows.indexOf(i) > -1) {
                            arrVals.push(val);
                            setFunc = true;
                        }
                    } else {
                        //c_log(val);
                        arrVals.push(val);
                        setFunc = true;
                    }
                }

                if (setFunc) {
                    var fidIX = arrParams.indexOf("FID");
                    if (fidIX > -1) {
                        row.setAttribute("onmouseover", "FileHover(event, 0, " + arrVals[fidIX] + ")");
                        row.setAttribute("onmouseout", "FileHover(event, 1, " + arrVals[fidIX] + ")");
                    }

                    cells[ii].setAttribute("onclick", jsFunc[0]["Func"] + "(" + arrVals.join(",") + ")");
                    cells[ii].className += " cursor tdLimitHeight";
                    //c_log("jsfunc Row set", i, jsFunc[0]["Func"] + "(" + arrVals.join(",") + ")");
                    //c_log(cells[ii]);
                }
            }
        }
    }

    tb.style.height = dv.style.height;

    if (isEmpty) {
        var tr = document.getElementsByClassName("google-visualization-table-tr-even");
        tr[0].innerHTML = "";
        var num = 0; for (var key in dt[0]) { num++ };
        xsection(tr[0], ["td", "td|colspan=" + (num - 1) + "|class=sm pad10|<br>&nbsp;&nbsp;&nbsp;No results found"]);
    }

    jsStoreGCharts = jsStoreGCharts.filter(d => d.dvID != dv.id);
    jsStoreGCharts.push({ dvID: dv.id, dvHTML: dv.innerHTML, arrGChart: arrGChart, arrGChartSort: arrGChartSort });
    if (GChartFocus != null) {
        window[GChartFocus]();
    }
    if (onload != null) {
        onload();
    }
}

function getGchartHdrsNRows(dt, dsp, rplc, justDates) {
    var hdrs = [], hdrSort = []; rows = [];
    //c_log(dt);
    for (var key in dt[0]) {
        if (dsp.indexOf(key) > -1) {
            hdrs.push(key);
        };
    }

    for (var i = 0; i < dsp.length; i++) {
        if (hdrs.indexOf(dsp[i]) > -1) {
            hdrSort.push(dsp[i]);
        }
    }

    hdrs = hdrSort;

    for (var i = 0; i < dt.length; i++) {
        var irow = [];
        for (var ii = 0; ii < hdrs.length; ii++) {
            var tmpix = rplc.findIndex(d => d.a == hdrs[ii]);
            var tmp = (tmpix > -1) ? rplc[tmpix]["b"] : hdrs[ii];

            //console.log(tmp, dt[i][tmp]);
            var str = (dt[i][hdrs[ii]] == null) ? "" :
                (tmp.toLowerCase().indexOf("date") > -1 && tmp.toLowerCase().indexOf("update") == -1) ?
                    convertDT(dt[i][tmp], justDates).replace(/_/g, " ") :
                    dt[i][tmp].toString();
            //str = str.replace(/</g, "&lt;").replace(/>/g, "&gt;");

            str = (str == "false") ? "FALSE" : (str == "true") ? "TRUE" : str;

            irow.push(str);
        }
        rows.push(irow);
    }
    //c_log(dt);
    return [hdrs, rows];
}

//alert((" EXEMPT" > ""));
