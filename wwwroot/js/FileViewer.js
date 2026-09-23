//log update: 20251024-234-jk
// File viewer popup windows: a generic viewer (ViewFile/FILEVIEWER) plus specialized variants per
// record type (IA/DR/dispute/exam/request/application/follow-up), each with its own close handler.
var lockFileViewer = false;


// ============================================================
// SECTION: generic file viewer window (open/load/resize), Excel chart popup
// ============================================================
function FILEVIEWER(main, FIDFilenameType) {
    getData(null, newFormData("_GetUserToken", {}), function (vr) {
        var tmpToken = jparse(vr)[0].Token

        var jo = jparse(FIDFilenameType);
        var fid = jo.fid;
        var filename = jo.filename;
        var type = jo.type;
        var closeBtn = document.getElementById("btnPopUpClose_" + main.id.split("_")[1]);
        closeBtn.setAttribute("onclick", "window.close()");
        console.log(type);
        if (type == "standard") {
            PopUpOpt(main, "button|class=blueButton|onclick=windowOpen('Download?fid~" + fid + "&dl~1')|Download");
            PopUpOpt(main, "button|class=blueButton|onclick=PopUp('File Options', " + fid + ",'" + filename + "', true)|Options");
            var y = document.body.clientHeight - 100;
            xsection(main, [
                "table|style=width:100%;height:100%" +
                "|||tr" +
                "|||append|td" +
                "|||append|iframe|id=iframe_" + fid + "|title=" + filename + "|src=Download?fid~" + fid + "dl~0&token~" + tmpToken + 
                "|style=background-color:white; overflow-x:auto; width:100%; height:85vh"// + y + "px"
            ]);
        }
        //else if (type == "dynamicreports") {
        //    console.log("1. dynamicreports branch reached");
        //    console.log("2. main =", main);
        //    console.log("3. main.id =", main.id);
        //    console.log("4. DynamicReports defined?", typeof DynamicReports);
        //    DynamicReports(main, false, null);
        //    console.log("5. DynamicReports called");
        //}
     
    });
}

function reportLoadFiles(fid, filename, type, nooptions) {
    //alert(type);
    
    try {
        //var js = jsOFiles.filter(d => d.FID == fid && d.LinkedFID != null && d.LinkedFID != "");
        //console.log("reportLoadFiles", jsOFiles.filter(d => d.FID == fid));

        //if (js.length > 0) {
        //    fid = js[0].LinkedFID;
        //    type = "File";
        //}

        if (!lockFileViewer) {
            lockFileViewer = true;

            if (type == "Dynamic") {
                if (jsPopUps.filter(d => d.Title == "Dynamic Record Options" && d.Data == fid).length == 0) {
                    closePopUp('Dynamic Record Options');
                    PopUp('Dynamic Record Options', fid, null, true, ['300px', '800px']);
                } else {
                    ViewFile(fid, filename, null, null, null, nooptions);
                }                
            }
            else if (filename.indexOf(".DynamicCMSFile") > 0) {
                ViewFile(fid, filename, null, null, null, nooptions);
            }
            else if (type == "Application") {
                fid = (fid > 0) ? fid * -1 : fid;
                ViewExamFile(fid, filename);
                //ViewApplicationFile(fid * -1, filename);
            }
            else {
                ViewFile(fid, filename, null, null, null, nooptions);
            }
        } else {
            smconfirm("Please wait while initial file is loading ...");
            setTimeout(function () { xconfirm(); }, 1000);
        }
    } catch (ex) {
        alert("err");
        console.log(ex);
    }
}

function FV_Bring2front(wo) {
    var exceptions = ["File Options"];
    var js = jsPopUps.filter(d => exceptions.indexOf(d.Title) == -1);
    if (js.length > 0) {
        sortJS(js, "ZIndex", true);
        var zindex = js[0].ZIndex;
        document.getElementById(wo).style.zIndex = zindex + 10;
    }
}

function resizeInner(fid) {
    var dvmain = document.getElementById("fileViewer_" + fid);
    var dvhdr = document.getElementById("fileViewer_" + fid + "_hdr");
    var dvgchart = document.getElementById("FileViewerGChart_" + fid);
    var dvinner = document.getElementById("fileViewer_" + fid + "_inner");
    var dviframe = document.getElementById("iframe_" + fid);

    var ht = (dvmain.clientHeight - dvhdr.clientHeight - 10);
    dvinner.style.height = ht + "px";

    try {
        dviframe.style.height = (ht - 40) + "px";
    } catch (ex) {}
    

    try {
        ht = ht - 80;
        dvgchart.style.height = ht + "px";

        var gc = document.getElementById("gchart-FileViewerGChart_" + fid);
        gc.style.height = ht + "px";
        var gcc = gc.children;
        for (var i = 0; i < gcc.length; i++) {
            gcc[i].style.height = ht + "px";
        }
    } catch (ex) {
        c_log(ex);
    }
}

function windowOpen(url) {
    getData(null, newFormData("_GetUserToken", {}), function (vr) {
        var tmpToken = jparse(vr)[0].Token
        window.open(url + "&token=" + tmpToken);
    });
}

var jsExcelGChart = [];
//STANDARD
function ViewFile(fid, filename, dockme, dvPlaceMe, archived, nooptions, gchart) {
  
    getData(null, newFormData("_GetUserToken", {}), function (vr) {
        var tmpToken = jparse(vr)[0].Token
        
        if (fid != 0) {
            var fil = document.getElementById("fileViewer_" + fid);
            if (fil != null) {
                fil.parentElement.removeChild(fil);
            }
            fil = null;
            if (fil == null) {
                var doc = dyn("div", "id=fileViewer_" + fid + "|class=fileViewer|onmouseup=resizeInner(" + fid + ")|style=min-width:700px;position:;background-color:white;height:500px;width:900px;overflow:hidden;");
                extra(doc, true, true, dvPlaceMe);
                c_log(document.getElementById("fileViewer_" + fid).style.zIndex);

                var xx = dockedFiles.filter(d => d.fid != fid);
                dockedFiles = xx;
                //if (xx.length < 10) { dockedFiles.push({ fid: fid, filename: filename }); }

                var strDockedFiles = jstring(dockedFiles);
                if (dockme) { strDockedFiles = "[]"; }
                var js = {};
                js["js"] = strDockedFiles;

                var data = new FormData();
                data.append("strjson", jstring(js));

                getData("#getDockedFiles", data, function (vr) {
                    //c_log(vr);
                    var ht = 600 + "px";
                    var wd = 800 + "px";
                    var xx = divHt.filter(d => d.divName == "fileViewer");
                    if (xx.length > 0) {
                        ht = xx[0]["ht"];
                        wd = xx[0]["wd"];
                    }
                    //c_log("file ht = " + ht);


                    nsection("fileViewer_" + fid, [
                        "div|id=fileViewer_" + fid + "_hdr|onclick=FV_Bring2front('fileViewer_" + fid + "')|class=PopUpHdr|style=min-width:700px;cursor:pointer; font-weight:bold;font-size:10px" +
                        "" + "|||label|id=fileViewer_" + fid + "_hdrTitle|style=white-space:nowrap;width:250px;overflow-x:hidden|" + filename,
                        "div|id=fileViewer_" + fid + "_inner|class=pad10 xfileViewer_inner|style=width:100%; overflow:auto"
                    ]);
                    var dvmain = document.getElementById("fileViewer_" + fid);
                    var dvhdr = document.getElementById("fileViewer_" + fid + "_hdr");
                    var dvinner = document.getElementById("fileViewer_" + fid + "_inner");
                    dvinner.style.height = (dvmain.clientHeight - dvhdr.clientHeight - 10) + "px";

                    // Header styling
                    dvhdr.style.backgroundColor = "rgb(31, 41, 67)";
                    dvhdr.style.color = "white";
                    dvhdr.style.height = "50px";
                    dvhdr.style.borderRadius = "5px";
                    /*document.getElementById("btnPopUpClose_" + fid).className = "ugCancelBtn excludePrint";*/



                    //GET EXCEL FILE AS GCHART

                    var arrFN = filename.toLowerCase().split(".");
                    console.log(arrFN);
                    if (["xlsx", "xls"].indexOf(arrFN[arrFN.length - 1]) > -1 && gchart) {
                        nsection("fileViewer_" + fid + "_inner", [
                            "div|id=FileViewerGChart_" + fid + "_hdr", "hr",
                            "div|id=FileViewerGChart_" + fid + "|style=width:100%; height:" + (dvmain.clientHeight - dvhdr.clientHeight - 80) + "px"
                        ]);

                        getData("getExcelGChart", xFormData({ fid: fid }), function (vr) {
                            var js = jparse(vr);
                            if (jsExcelGChart.length > 0) { jsExcelGChart = jsExcelGChart.filter(d => d.FID != fid); }
                            jsExcelGChart.push({ FID: fid, JSON: js });

                            var sheets = [];
                            for (var key in js) {
                                sheets.push(key);
                                nsection("FileViewerGChart_" + fid + "_hdr", [
                                    //"button|class=longblueButton|onclick=popExcelGChart(" + fid + ",'" + key + "')|" + key,
                                    "button|class=ugCancelBtn excludePrint|onclick=popExcelGChart(" + fid + ",'" + key + "')|" + key,
                                    "label|class=padLeft10|"
                                ]);
                            }

                            popExcelGChart(fid, sheets[0]);
                        }, null, true);
                    } else {
                        //GET IFRAME
                        //if (["docx"].indexOf(arrFN[arrFN.length - 1]) > -1) {
                        //    getData("getDOCXComments", xFormData({ fid: fid }), function (vr) {
                        //        var js = jparse(vr);
                        //        console.log(js);
                        //    })
                        //}
                        var iframeLoading = "iframeLoading_" + fid.toString().replace("-", "N");

                        nsection("fileViewer_" + fid + "_inner", [
                            "table|style=width:100%;height:100%" +
                            "|||tr" +
                            "|||append|td" +
                            "|||append|img|id=" + iframeLoading + "|src=loading.gif|style=cursor:pointer;position:absolute;top:40%;left:40%|title=Click to remove loading image|onclick=iframeLoading_" + fid + ".style.display~\"none\"" +
                            "|||iframe|id=iframe_" + fid + "|title=" + filename + "|src=Download?fid~" + fid + "&dl~0&token~" + tmpToken +
                            "|style=background-color:white; overflow:auto; width:100%; " + (dvmain.clientWidth - 50) + "px;" +
                            "height:" + (dvmain.clientHeight - dvhdr.clientHeight - 40) + "px" +
                            "|onload=" + iframeLoading + ".style.display~'none'; getDocXComments(" + fid + ")" +
                            ((["docx"].indexOf(arrFN[arrFN.length - 1]) > -1) ?
                                "|||back|td|id=fileViewer_" + fid + "_comments|class=pad10|style=width:200px; height:400px; overflow-y:auto" : "")
                        ]);
                    }
                    dvinner.style.overflow = "hidden";


                    //document.getElementById("fileViewer_" + fid + "_hdr").innerHTML = "";
                    section("fileViewer_" + fid + "_hdr", [
                        "label|class=ugCancelBtn excludePrint|style=float:right|onclick=closeFileViewer(" + fid + ")|Close",
                        ((fid != 0) ? ((dvPlaceMe != null) ? "" : "label|style=float:right;width:10px|") : ""),
                        ((fid > 0 || 1 == 1) ? "label|class=ugSubmitBtn|style=float:right|onclick=windowOpen('Download?fid~" + fid + "&dl~1')|Download" : ""),
                        ((fid > 0) ? ((dvPlaceMe != null || archived) ? "" : "label|style=float:right;width:10px|") : ""),
                        ((fid > 0) ? ((dvPlaceMe != null || archived) ? "" : "label|class=ugCancelBtn excludePrint|style=float:right|onclick=PopUp('File Options', " + fid + ",'" + filename + "', true)|Options") : ""),
                        ((fid < 0) ? "label|style=float:right;width:10px|" : ""),
                        ((fid < 0 && nooptions == null) ?
                            "label|class=ugCancelBtn excludePrint|style=float:right; padding-right:10px|onclick=PopUp('Dynamic Record Options', " + fid + ", null, true, ['300px','800px'])|Options"
                            : ""),
                        ((fid < 0) ? "label|style=float:right;width:10px|" : ""),
                        ((!archived || nooptions != null) ? "" : "label|style=float:right;width:10px|"),
                        ((!archived || nooptions != null) ? "" : "label|class=ugCancelBtn excludePrint|style=float:right|onclick=NEO_ArchiveFile(" + fid + ",true,true)|UnArchive"),
                        "label|style=float:right;width:10px|",
                        "label|class=ugSubmitBtn|style=float:right|onclick=xpopout('FILE VIEWER', {fid:" + fid + ", filename:'" + filename + "', title:'" + filename + "', url:'Download?fid', type:'standard'})|PopOut",
                    ]);

                    var fv = document.getElementById("fileViewer_" + fid);
                    dragElement(fv);

                    if (dockme) {
                        var dock = document.getElementById("fileDock");
                        dock.appendChild(dyn("label", "id=dockedFile_" + fid + "|style=padding-left:1px;padding-right:1px",
                            dyn("label", "class=tab|onclick=unDockFileViewer(" + fid + ",'" + filename + "')|" + filename)));
                        fv.style.display = "none";
                    }
                    lockFileViewer = false;
                    //opts(false);
                }, null, true);
            } else {
                lockFileViewer = false;
                var dfil = document.getElementById("dockedFile_" + fid);
                if (dfil != null) { unDockFileViewer(fid, filename); }
            }
        } else
            lockFileViewer = false;


        FV_Bring2front('fileViewer_' + fid);

    });
}

function popExcelGChart(FID, Sheet) {
    var js = jparse(jsExcelGChart.filter(d => d.FID == FID)[0].JSON[Sheet]);
    
    var newjs = [];
    for (var i = 0; i < js.length; i++) {
        var jo = {};
        for (var key in js[0]) {
            if (key.length > 2) {
                jo[key] = js[i][key];
            }
        }
        newjs.push(jo);
    }

    getGChartTable(newjs, [], document.getElementById("FileViewerGChart_" + FID), []);
}

//FOLLOWUPFILE
// ============================================================
// SECTION: type-specific viewers (follow-up/IA/DR/dispute/exam), e-signature request viewing/signing
// ============================================================
function ViewFollowUpFile(attachID, filename, EventID) {
    getData(null, newFormData("_GetUserToken", {}), function (vr) {
        var tmpToken = jparse(vr)[0].Token

        if (attachID != 0) {
            var fil = document.getElementById("fileFollowUpViewer_" + attachID);
            if (fil != null) {
                fil.parentElement.removeChild(fil);
            }
            fil = null;
            if (fil == null) {
                var doc = dyn("div", "id=fileFollowUpViewer_" + attachID + "|class=fileViewer|style=position:;background-color:white;height:500px;width:900px;overflow:hidden;");
                extra(doc, true, true);

                var ht = 600 + "px";
                var wd = 800 + "px";
                var xx = divHt.filter(d => d.divName == "fileViewer");
                if (xx.length > 0) {
                    ht = xx[0]["ht"];
                    wd = xx[0]["wd"];
                }
                //c_log("file ht = " + ht);


                nsection("fileFollowUpViewer_" + attachID, [
                    "div|id=fileFollowUpViewer_" + attachID + "_hdr|onclick=FV_Bring2front('fileFollowUpViewer_" + attachID + "')|class=PopUpHdr|style=cursor:pointer; font-weight:bold;font-size:10px" +
                    "" + "|||label|id=fileFollowUpViewer_" + attachID + "_hdrTitle|" + filename,
                    "div|id=fileFollowUpViewer_" + attachID + "_inner|style=width:100%;height:100%;"
                ]);

                var iframeLoading = "iframeLoading_" + attachID.replace(/-/g, "");

                section("fileFollowUpViewer_" + attachID + "_inner", [
                    //((fid > 0) ? 
                    "img|id=" + iframeLoading + "|src=loading.gif|style=cursor:pointer;position:absolute;top:40%;left:40%|title=Click to remove loading image|onclick=iframeLoading_" + attachID + ".style.display~\"none\"|",// :
                    //"div|class=sm|id=iframeLoading_" + fid + "|Please wait while data is loading ..."),
                    "iframe|id=iframe_" + attachID + "|title=" + filename + "|src=DownloadFollowupAttachment?attachID~" + attachID + "&dl~0&token~" + tmpToken + 
                    "|style=background-color:white;width:100%;height:100%; overflow:auto" +
                    "|onload=" + iframeLoading + ".style.display~\"none\""
                ]);

                //document.getElementById("fileFollowUpViewer_" + attachID + "_hdr").innerHTML = "";
                section("fileFollowUpViewer_" + attachID + "_hdr", [
                    "label|class=blueButton|style=float:right|onclick=closeFileFollowUpViewer('" + attachID + "')|Close",
                    "label|style=float:right; width:10px;|",
                    "label|class=blueButton|style=float:right|onclick=windowOpen('DownloadFollowupAttachment?attachID~" + attachID + "&dl~1')|Download",
                    "label|style=float:right; width:10px;|",
                    "label|class=blueButton|style=float:right|onclick=delFollowupAttachment('" + attachID + "','" + EventID + "')|Delete",
                    "label|style=float:right;width:10px|",
                    "label|class=blueButton|style=float:right|onclick=xpopout('FILE VIEWER', {fid:'" + attachID + "', filename:'" + filename + "', title:'" + filename + "', url:'DownloadFollowupAttachment?attachID', type:'followup'})|PopOut",
                ]);

                var fv = document.getElementById("fileFollowUpViewer_" + attachID);
                dragElement(fv);

                lockFileViewer = false;

            } else
                lockFileViewer = false;
        } else
            lockFileViewer = false;
    });
}

function delFollowupAttachment(attachID,EventID,go) {
    if (!go) {
        xconfirm("Are you sure you want to delete this attachment?", null, "delFollowupAttachment('" + attachID + "','" + EventID + "',  true)");
    } else {
      
        getData(null, newFormData("_DeleteFollowupAttachment", { attachID: attachID }), function (vr) {
            var js = jparse(vr);
            xconfirm();
            console.log("attachID", attachID);
            console.log("EventID", EventID);
            console.log("go", go);
            console.log("274", js);
            closeFileFollowUpViewer(attachID);
                     //repopulate the gchart section
            GetFollowupAttachments(EventID);
            console.log("277", js);
        });
    }
}

//IAFILE
function ViewIAFile(fid, filename) {
    getData(null, newFormData("_GetUserToken", {}), function (vr) {
        var tmpToken = jparse(vr)[0].Token

        if (fid != 0) {
            var fil = document.getElementById("fileIAViewer_" + fid);
            if (fil != null) {
                fil.parentElement.removeChild(fil);
            }
            fil = null;
            if (fil == null) {
                var doc = dyn("div", "id=fileIAViewer_" + fid + "|class=fileViewer|style=position:;background-color:white;height:500px;width:900px;overflow:hidden;");
                extra(doc, true, true);

                var ht = 600 + "px";
                var wd = 800 + "px";
                var xx = divHt.filter(d => d.divName == "fileViewer");
                if (xx.length > 0) {
                    ht = xx[0]["ht"];
                    wd = xx[0]["wd"];
                }
                //c_log("file ht = " + ht);


                nsection("fileIAViewer_" + fid, [
                    "div|id=fileIAViewer_" + fid + "_hdr|onclick=FV_Bring2front('fileIAViewer_" + fid + "')|class=PopUpHdr|style=cursor:pointer; font-weight:bold;font-size:10px" +
                    "" + "|||label|id=fileIAViewer_" + fid + "_hdrTitle|" + filename.replace(/=/g, "~"),
                    "div|id=fileIAViewer_" + fid + "_inner|style=width:100%;height:100%;"
                ]);

                var iframeLoading = "iframeLoading_" + fid.replace(/-/g, "");

                // CMSMailbox adaptation: DownloadIA has no messageItemId of its own to
                // gate on (this is built directly, not via newFormData()), so append
                // it explicitly — the server re-derives which record this fid should
                // belong to from it before proxying to CMSNEO. Also added &token~ to
                // the Download link below, which CMS's own copy omits — CMSMailbox has
                // no session-based fallback auth for a plain window.open(), so it needs
                // the one-off token to authenticate at all.
                var mbxCtx = (typeof MBX_CurrentMessageItemId !== "undefined" && MBX_CurrentMessageItemId) ? "&messageItemId~" + MBX_CurrentMessageItemId : "";

                section("fileIAViewer_" + fid + "_inner", [
                    //((fid > 0) ?
                    "img|id=" + iframeLoading + "|src=loading.gif|style=cursor:pointer;position:absolute;top:40%;left:40%|title=Click to remove loading image|onclick=iframeLoading_" + fid + ".style.display~\"none\"|",// :
                    //"div|class=sm|id=iframeLoading_" + fid + "|Please wait while data is loading ..."),
                    "iframe|id=iframe_" + fid + "|title=" + filename + "|src=DownloadIA?fid~" + fid + "&dl~0&token~" + tmpToken + mbxCtx +
                    "|style=background-color:white;width:100%;height:100%; overflow:auto" +
                    "|onload=" + iframeLoading + ".style.display~\"none\""
                ]);

                //document.getElementById("fileIAViewer_" + fid + "_hdr").innerHTML = "";
                section("fileIAViewer_" + fid + "_hdr", [
                    "label|class=blueButton|style=float:right|onclick=closeFileIAViewer('" + fid + "')|Close",
                    "label|style=float:right; width:10px;|",
                    "label|class=blueButton|style=float:right|onclick=windowOpen('DownloadIA?fid~" + fid + "&dl~1&token~" + tmpToken + mbxCtx + "')|Download",
                    "label|style=float:right;width:10px|",
                    "label|class=blueButton|style=float:right|onclick=xpopout('FILE VIEWER', {fid:'" + fid + "', filename:'" + filename + "', title:'" + filename + "', url:'DownloadIA?fid', type:'ia'})|PopOut",
                ]);

                var fv = document.getElementById("fileIAViewer_" + fid);
                dragElement(fv);

                lockFileViewer = false;

            } else
                lockFileViewer = false;
        } else
            lockFileViewer = false;
    });
}

//DYNAMICFILE
function ViewDRFile(fid, filename) {
    getData(null, newFormData("_GetUserToken", {}), function (vr) {
        var tmpToken = jparse(vr)[0].Token

        if (fid != 0) {
            var fil = document.getElementById("fileDRViewer_" + fid);
            if (fil != null) {
                fil.parentElement.removeChild(fil);
            }
            fil = null;
            if (fil == null) {
                var doc = dyn("div", "id=fileDRViewer_" + fid + "|class=fileViewer|style=position:;background-color:white;height:500px;width:900px;overflow:hidden;");
                extra(doc, true, true);

                var ht = 600 + "px";
                var wd = 800 + "px";
                var xx = divHt.filter(d => d.divName == "fileViewer");
                if (xx.length > 0) {
                    ht = xx[0]["ht"];
                    wd = xx[0]["wd"];
                }
                //c_log("file ht = " + ht);


                nsection("fileDRViewer_" + fid, [
                    "div|id=fileDRViewer_" + fid + "_hdr|onclick=FV_Bring2front('fileDRViewer_" + fid + "')|class=PopUpHdr|style=cursor:pointer; font-weight:bold;font-size:10px" +
                    "" + "|||label|id=fileDRViewer_" + fid + "_hdrTitle|" + filename,
                    "div|id=fileDRViewer_" + fid + "_inner|style=width:100%;height:100%;"
                ]);

                var iframeLoading = "iframeLoading_dr_" + fid;

                section("fileDRViewer_" + fid + "_inner", [
                    //((fid > 0) ? 
                    "img|id=" + iframeLoading + "|src=loading.gif|style=cursor:pointer;position:absolute;top:40%;left:40%|title=Click to remove loading image|onclick=iframeLoading_" + fid + ".style.display~\"none\"|",// :
                    //"div|class=sm|id=iframeLoading_" + fid + "|Please wait while data is loading ..."),
                    "iframe|id=iframe_" + fid + "|title=" + filename + "|src=DownloadDR?fid~" + fid + "&dl~0&token~" + tmpToken + 
                    "|style=background-color:white;width:100%;height:100%; overflow:auto" +
                    "|onload=" + iframeLoading + ".style.display~\"none\""
                ]);

                //document.getElementById("fileDRViewer_" + fid + "_hdr").innerHTML = "";
                section("fileDRViewer_" + fid + "_hdr", [
                    "label|class=blueButton|style=float:right|onclick=closeFileDRViewer('" + fid + "')|Close",
                    "label|style=float:right; width:10px;|",
                    "label|class=blueButton|style=float:right|onclick=windowOpen('DownloadDR?fid~" + fid + "&dl~1')|Download",
                    "label|style=float:right;width:10px|",
                    "label|class=blueButton|style=float:right|onclick=deleteRecordAttachment(" + fid + ",'" + filename + "')|Delete",
                    "label|style=float:right;width:10px|",
                    "label|class=blueButton|style=float:right|onclick=xpopout('FILE VIEWER', {fid:'" + fid + "', filename:'" + filename + "', title:'" + filename + "', url:'DownloadDR?fid', type:'dr'})|PopOut",

                ]);

                var fv = document.getElementById("fileDRViewer_" + fid);
                dragElement(fv);

                FV_Bring2front('fileDRViewer_' + fid);
                lockFileViewer = false;
            } else
                lockFileViewer = false;
        } else
            lockFileViewer = false;
    });
}

function ViewDisputeFile(fid, filename, signRID) {
    getData(null, newFormData("_GetUserToken", {}), function (vr) {
        var tmpToken = jparse(vr)[0].Token

        if (fid > 0) {
            var fil = document.getElementById("disputeFileViewer_" + fid);
            if (fil == null) {
                var ht = 800 + "px";
                var wd = 1200 + "px";

                var doc = dyn("div", "id=disputeFileViewer_" + fid + "|class=fileViewer|style=background-color:white;height:500px;width:800px;overflow:hidden;");
                extra(doc, true, true);

                section("disputeFileViewer_" + fid, [
                    "div|id=disputeFileViewer_" + fid + "_hdr|onclick=FV_Bring2front('disputeFileViewer_" + fid + "')|class=PopUpHdr|style=cursor:pointer; font-weight:bold;font-size:10px|" + filename,
                    "div|id=disputeFileViewer_" + fid + "_inner|style=width:100%;height:100%; overflow-x:auto;"
                ]);

                section("disputeFileViewer_" + fid + "_inner", [
                    "iframe|title=" + filename + "|src=DownloadRequestFile?fid~" + fid + "&dl~0&token~" + tmpToken + "|style=background-color:white;width:100%;height:100%"
                ]);

                section("disputeFileViewer_" + fid + "_hdr", [
                    "label|class=blueButton|style=float:right|onclick=closeDisputeFileViewer(" + fid + ")|Close",
                    "label|style=float:right;width:10px|",
                    "label|class=blueButton|style=float:right|onclick=windowOpen('DownloadRequestFile?fid~" + fid + "&dl~1')|Download",
                    ((signRID == null) ? "" : "label|style=float:right;width:10px|"),
                    ((signRID == null) ? "" : "label|class=blueButton|style=float:right|onclick=NeoSignRequest(" + fid + "," + signRID + ")|Sign"),
                ]);



                var fv = document.getElementById("disputeFileViewer_" + fid);
                dragElement(fv);

            }
        }
    });
}

//EXAMFILE
function ViewExamFile(fid, filename) {
    getData(null, newFormData("_GetUserToken", {}), function (vr) {
        var tmpToken = jparse(vr)[0].Token

        fid = fid * -1;
        //alert(fid);
        if (fid > 0) {
            var fil = document.getElementById("examFileViewer" + fid);

            if (fil == null) {
                var ht = 800 + "px";
                var wd = 1200 + "px";

                var doc = dyn("div", "id=examFileViewer" + fid + "|class=fileViewer|style=background-color:white;height:500px;width:800px;overflow:hidden;");
                extra(doc, true, true);

                section("examFileViewer" + fid, [
                    "div|id=examFileViewer" + fid + "_hdr|onclick=FV_Bring2front('examFileViewer" + fid + "')|class=PopUpHdr|style=cursor:pointer; font-weight:bold;font-size:10px|" + filename,
                    "div|id=examFileViewer" + fid + "_inner|style=width:100%;height:100%;"
                ]);

                section("examFileViewer" + fid + "_inner", [
                    "iframe|title=" + filename + "|src=DownloadExamFile?fid~" + fid + "&dl~0&token~" + tmpToken + 
                    "|style=background-color:white;width:100%;height:100%"
                ]);

                //document.getElementById("examFileViewer" + fid + "_hdr").innerHTML = "";
                section("examFileViewer" + fid + "_hdr", [
                    "label|class=blueButton|style=float:right|onclick=closeExamFileViewer(" + fid + ")|Close",
                    "label|style=float:right;width:10px|",
                    "label|class=blueButton|style=float:right|onclick=windowOpen('DownloadExamFile?fid~" + fid + "&dl~1')|Download",
                    "label|style=float:right;width:10px|",
                    "label|class=blueButton|style=float:right|onclick=xpopout('FILE VIEWER', {fid:" + fid + ", filename:'" + filename + "', title:'" + filename + "', url:'DownloadExamFile?fid', type:'exam'})|PopOut",
                ]);



                var fv = document.getElementById("examFileViewer" + fid);
                dragElement(fv);

                lockFileViewer = false;
            } else
                lockFileViewer = false;
        } else
            lockFileViewer = false;
    });
}

function SignRequestFile(fid, rid) {
    getData(null, newFormData("_GetCDTracker", { rid: rid }), function (vr) {
        var js = jparse(vr);
        var status = js[0]["Status"];
        var stage = js[0]["Stage"];
        var isMCID = js[0]["isMCID"];
        var signers = [];

        var data = new FormData();
        data.append("FID", fid);
        data.append("RID", rid);


        if (stage == 4) {
            signers = [{ Name: js[0]["ParticipantName"], Email: js[0]["ParticipantEmail"] }, { Name: js[0]["MyName"], Email: js[0]["MyEmail"] }];
        }
        if (stage == 3) {
            signers = [{ Name: js[0]["ParticipantName"], Email: js[0]["ParticipantEmail"] }];
        }
        if (stage == 3) {
            signers = [{ Name: js[0]["MyName"], Email: js[0]["MyEmail"] }];
        }
        if (stage == 2) {
            signers = [{ Name: js[0]["MyName"], Email: js[0]["MyEmail"] }];
        }

        if (signers.length > 0) {
            data.append("strSigners", jstring(signers));
            getData("SignRequestDocX", data, function (vr) {
                c_log(vr);
                xconfirm(null, [
                    "div|The signature request has been sent.",
                    "br",
                    "div|Please check your email for instructions on signing this file."
                ]);
            });
        }

    });
}

function ViewRequestFile(fid, filename, rid) {
    var gobaby = true;
    getData(null, newFormData("_GetCDTracker", { rid: rid }), function (vr) {//reset jsneo[js] and send current js
        js = jparse(vr)[0];
        var ix = jsNeo["js"].findIndex(d => d.Request_ID == rid)
        jsNeo["js"][ix] = js;

        c_log(js);
        var isMine = js["isMine"];
        var envID = js["DSEnvelopeID"];
        var status = js["Status"];
        var stage = js["Stage"];
        c_log("Request Stage:", stage);

        if (([2, 3, 4]).indexOf(stage) > -1 && envID != null) {//if awaiting signature
            var data = new FormData()
            data.append("EnvelopeID", envID);
            getData("GetAllSignedByEnvelope", data, function (vr) {//check if signed
                if (jparse(vr).length > 0) {
                    getData(null, newFormData("_GetCDTracker", { rid: rid }), function (vr) {//reset jsneo[js] and send current js
                        js = jparse(vr)[0];
                        var ix = jsNeo["js"].findIndex(d => d.Request_ID == rid)
                        jsNeo["js"][ix] = js;

                        xconfirm("The document has been signed");

                        if (isMine) {
                            EditRequestGO(js);
                        } else {
                            ViewRequestGO(js);
                        }
                    });
                } else {
                    ViewRequestFileGO(fid, filename, rid)
                }
            });
        } else {
            ViewRequestFileGO(fid, filename, rid)
        }
    });
}


function ViewRequestFileGO(fid, filename, rid) {
    getData(null, newFormData("_GetUserToken", {}), function (vr) {
        var tmpToken = jparse(vr)[0].Token

        rid = (rid == null) ? 0 : rid;
        if (fid > 0) {
            var fil = document.getElementById("requestFileViewer_" + fid);
            if (fil == null) {
                var ht = 800 + "px";
                var wd = 1200 + "px";

                var doc = dyn("div", "id=requestFileViewer_" + fid + "|class=fileViewer|style=background-color:white;height:500px;width:800px;overflow:hidden;");
                extra(doc, true, true);

                section("requestFileViewer_" + fid, [
                    "div|id=requestFileViewer_" + fid + "_hdr|onclick=FV_Bring2front('requestFileViewer_" + fid + "')|class=PopUpHdr|style=cursor:pointer; font-weight:bold;font-size:10px|" + filename,
                    "div|id=requestFileViewer_" + fid + "_inner|style=width:100%;height:100%;"
                ]);

                section("requestFileViewer_" + fid + "_inner", [
                    "iframe|id=requestIframe_" + fid + "|title=" + filename + "|src=DownloadRequest?fid~" + fid + "&rid~" + rid + "&dl~0&token~" + tmpToken + 
                    "|style=background-color:white;width:100%;height:100%"
                ]);

                section("requestFileViewer_" + fid + "_hdr", [
                    "label|class=blueButton|style=float:right|onclick=closeRequestFileViewer(" + fid + ")|Close",
                    "label|style=float:right;width:10px|",
                    ((rid != 0) ?
                        "label|class=blueButton|style=float:right|onclick=SignRequestFile(" + fid + "," + rid + ")|Sign" :
                        "label|class=blueButton|style=float:right|onclick=windowOpen('DownloadRequest?fid~" + fid + "&rid~" + rid + "&dl~1')|Download"
                    ),
                ]);


                var fv = document.getElementById("requestFileViewer_" + fid);
                dragElement(fv);

            }
        }
    });
}

// ============================================================
// SECTION: application-file viewer/signing, viewer docking, and the per-type close handlers
// ============================================================
function SignApplicationFile(FID) {
    var data = new FormData();
    data.append("FID", FID);
    getData("SignApplicationFile", data, function (vr) {
        var elems = (vr == "done") ?
            [
                "div|The application has been sent for signatures.",
                "br", "br",
                "div|You will be notified by email for document signing instructions."
            ] :
            [
                "div|An unknown error has occurred.  Contact your system administrator."
            ];
        xconfirm(null, elems);
    });
}

function RemoveApplicationDoc(FID) {
    godat({
        action: "_RemoveApplication", ps: { fid: FID }, func: function (vr) {
            closeApplicationFileViewer(" + FID + ");
            if (!renewPopUp("Application Documents")) { PopUp("Application Documents"); }
        }
    });
}

//APPLICATIONFILE
function ViewApplicationFile(FID, ExamName, ExamID, xCID, DTCompleted, needsAttn, dontload) {
    getData(null, newFormData("_GetUserToken", {}), function (vr) {
        var tmpToken = jparse(vr)[0].Token

        //try { if (!renewPopUp("Application Documents")) { PopUp("Application Documents"); } } catch (ex) {}
        c_log(FID, ExamName, ExamID, xCID, DTCompleted, needsAttn);

        var fil = document.getElementById("ApplicationFileViewer");
        if (fil == null && !dontload) {
            var doc = dyn("div", "id=ApplicationFileViewer|class=fileViewer|style=background-color:white;height:500px;width:900px;overflow:hidden;");
            extra(doc, true, true);

            section("ApplicationFileViewer", [
                "div|id=ApplicationFileViewer_hdr|onclick=FV_Bring2front('ApplicationFileViewer')|class=PopUpHdr|style=cursor:pointer; font-weight:bold;font-size:10px|" + ExamName,
                "div|id=ApplicationFileViewer_inner|style=width:100%;height:100%;"
            ]);

            section("ApplicationFileViewer_inner", [
                "iframe|id=ApplicationFileViewerIframe|title=" + ExamName + "|src=DownloadApplication?fid~" + FID + "&dl~&token~" + tmpToken + 
                "|style=background-color:white;width:100%;height:100%"
            ]);

            section("ApplicationFileViewer_hdr", [
                "label|class=blueButton|style=float:right|onclick=closeApplicationFileViewer(" + FID + ")|Close",
                "label|style=float:right;width:10px|",
                "label|class=blueButton|style=float:right|onclick=windowOpen('DownloadApplication?fid~" + FID + "&dl~" + ExamName.replace(/'/g, "") + ".pdf')|Download",
                "label|style=float:right;width:10px|",
                ((DTCompleted == null && !examNeedsAttn) ?
                    "label|class=blueButton|style=float:right|onclick=SignApplicationFile(" + FID + ")|Sign" :
                    "label|class=sm padLeft30|Document signed: " + ((DTCompleted == null) ? "na" : DTCompleted)
                ),
                "label|style=float:right;width:10px|",
                ((DTCompleted == null) ?
                    "label|class=blueButton|style=float:right|onclick=RemoveApplicationDoc(" + FID + ")|Delete" :
                    ""
                ),
            ]);


            var fv = document.getElementById("ApplicationFileViewer");
            dragElement(fv);
            appFV_Bring2front();
        } else if (dontload) {
            var data = new FormData();
            data.append("fid", FID);
            getData("DownloadApplication", data, function (vr) {
                //c_log("downloadapplication", vr);
            })
        }
    });
}

function dockFileViewer(fid, filename) {
    //c_log(fid + " ... " + filename);
    //var dock = document.getElementById("fileDock");
    //var fil = document.getElementById("fileViewer_" + fid);
    //dock.appendChild(dyn("label", "id=dockedFile_" + fid + "|style=padding-left:1px;padding-right:1px",
    //    dyn("label", "class=tab|onclick=unDockFileViewer(" + fid + ",'" + filename + "')|" + filename)));
    //fil.parentElement.removeChild(fil);
}

function unDockFileViewer(fid, filename, close) {

    var dock = document.getElementById("fileDock");
    var dfil = document.getElementById("dockedFile_" + fid);    
    dock.removeChild(dfil);
    ViewFile(fid, filename)
    if (close) { closeFileViewer(fid);}
}

function closeFileViewer(fid) {
    var xx = dockedFiles.filter(d => d.fid != fid);
    dockedFiles = xx;
    if (dockedFiles.length == 0) {
        dockedFiles.push({ fid: 0, filename: "" });
    }

    var strDockedFiles = jstring(dockedFiles);
    var js = {};
    js["js"] = strDockedFiles;

    var data = new FormData();
    data.append("strjson", jstring(js));

    getData("#getDockedFiles", data, function (vr) {
        var ex = document.getElementById("extras");
        var xx = document.getElementById("fileViewer_" + fid);

        try { xx.parentElement.removeChild(xx); } catch (ex) { }
    });
}


function closeDisputeFileViewer(fid) {
    var xx = document.getElementById("disputeFileViewer_" + fid);
    xx.parentElement.removeChild(xx);
}

function closeFileIAViewer(fid) {
    var xx = document.getElementById("fileIAViewer_" + fid);
    xx.parentElement.removeChild(xx);
}


function closeFileDRViewer(fid) {
    var xx = document.getElementById("fileDRViewer_" + fid);
    xx.parentElement.removeChild(xx);
}

function closeExamFileViewer(fid) {
    var xx = document.getElementById("examFileViewer" + fid);
    xx.parentElement.removeChild(xx);
}

function closeRequestFileViewer(fid) {
    var xx = document.getElementById("requestFileViewer_" + fid);
    xx.parentElement.removeChild(xx);
}

function closeMercFileViewer(fid) {
    var xx = document.getElementById("mercFileViewer_" + fid);
    xx.parentElement.removeChild(xx);
}

function closeAdlFileViewer(fid) {
    var xx = document.getElementById("adlFileViewer_" + fid);
    xx.parentElement.removeChild(xx);
}

function closeAttorneyFileViewer(fid) {
    var xx = document.getElementById("attorneyFileViewer_" + fid);
    xx.parentElement.removeChild(xx);
}

function closeApplicationFileViewer() {
    var xx = document.getElementById("ApplicationFileViewer");
    xx.parentElement.removeChild(xx);
    //if (!renewPopUp("Application Documents")) { PopUp("Application Documents"); }
}

function closeFileFollowUpViewer(attachID) {
    var xx = document.getElementById("fileFollowUpViewer_" + attachID);
    xx.parentElement.removeChild(xx);

}