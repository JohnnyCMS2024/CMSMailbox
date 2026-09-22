//log update: 20260911-1102pm-jk
// Shared client-side library loaded on every page (via _Layout.cshtml and per-page <script> tags).
// Holds global session/UI state and the app's core building blocks: the "type|attr=val|..." spec-string
// DOM builder (ndyn/xsection/nsection and the newer xsectionFast* fast-path variants), popup/confirm
// dialogs, the custom table/chart widgets (xTable, jchart/njchart, divChart, xChart, SortTable), the
// dynamic-folder/exam-matrix builders, and misc formatting/AJAX/export helpers used across the app.
var UserToken = "";
var jsOFiles = [];
var jsSECURITY = [];
var clogs = [];
var jssGA = false, jssUA = false, jssMGT = false, jssMyCID = 0, jssMyUID = 0, jssMyName = "", jssMyCompany = ""
var showingNotificationsList = false;
var notificationsList = [];
var seenNotificationsIDs = [];
var OpenCloseFolderDisplays = 0;
var hold_expandCollapseFolders = false;
var jsHowTo = [];
var wtf = "NINI!!!";
var opt = document.getElementById("optWindow");

var xChartOrDivChart = 1;

var ME = {};

var displayDetailsOnOff = false;

var currentFormID, currentSectionName, currentFormName;
var currentReportID;
var curSystemLinkFID, curSystemLinkFileType, curSystemLinkTypeID;

var jsLaunch = [];
var LaunchMainID = 0;
var hasLaunched = false;
var LaunchRequest = 0;
var njchart_wds = [];

var jsData = [];
var myCID, mgtCID, isMGT, GlobalFName, GlobalLName, GlobalCompany, myUID;

var refreshLoaction = "File Explorer";

var sectionTitle = "Dashboard";
var divHt = JSON.parse("[]");
var dockedFiles = JSON.parse("[]");
var statelist = ["AL - Alabama", "AK - Alaska", "AZ - Arizona", "AR - Arkansas", "CA - California", "CO - Colorado", "CT - Connecticut", "DE - Delaware", "DC - Washington DC", "FL - Florida", "GA - Georgia", "HI - Hawaii", "ID - Idaho", "IL - Illinois", "IN - Indiana", "IA - Iowa", "KS - Kansas", "KY - Kentucky", "LA - Louisiana", "ME - Maine", "MD - Maryland", "MA - Massachusetts", "MI - Michigan", "MN - Minnesota", "MS - Mississippi", "MO - Missouri", "MT - Montana", "NE - Nebraska", "NV - Nevada", "NH - New Hampshire", "NJ - New Jersey", "NM - New Mexico", "NY - New York", "NC - North Carolina", "ND - North Dakota", "OH - Ohio", "OK - Oklahoma", "OR - Oregon", "PA - Pennsylvania", "PR - Puerto Rico", "RI - Rhode Island", "SC - South Carolina", "SD - South Dakota", "TN - Tennessee", "TX - Texas", "UT - Utah", "VT - Vermont", "VA - Virginia", "WA - Washington", "WV - West Virginia", "WI - Wisconsin", "WY - Wyoming"];
var jsStates = { AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California", CO: "Colorado", CT: "Connecticut", DE: "Delaware", DC: "District of Columbia", FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", PR: "Puerto Rico", RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming" };
var jsStateAbrev = [{ abrev: "AL", state: "Alabama" }, { abrev: "AK", state: "Alaska" }, { abrev: "AZ", state: "Arizona" }, { abrev: "AR", state: "Arkansas" }, { abrev: "CA", state: "California" }, { abrev: "CO", state: "Colorado" }, { abrev: "CT", state: "Connecticut" }, { abrev: "DE", state: "Delaware" }, { abrev: "DC", state: "Washington DC" }, { abrev: "FL", state: "Florida" }, { abrev: "GA", state: "Georgia" }, { abrev: "HI", state: "Hawaii" }, { abrev: "ID", state: "Idaho" }, { abrev: "IL", state: "Illinois" }, { abrev: "IN", state: "Indiana" }, { abrev: "IA", state: "Iowa" }, { abrev: "KS", state: "Kansas" }, { abrev: "KY", state: "Kentucky" }, { abrev: "LA", state: "Louisiana" }, { abrev: "ME", state: "Maine" }, { abrev: "MD", state: "Maryland" }, { abrev: "MA", state: "Massachusetts" }, { abrev: "MI", state: "Michigan" }, { abrev: "MN", state: "Minnesota" }, { abrev: "MS", state: "Mississippi" }, { abrev: "MO", state: "Missouri" }, { abrev: "MT", state: "Montana" }, { abrev: "NE", state: "Nebraska" }, { abrev: "NV", state: "Nevada" }, { abrev: "NH", state: "New Hampshire" }, { abrev: "NJ", state: "New Jersey" }, { abrev: "NM", state: "New Mexico" }, { abrev: "NY", state: "New York" }, { abrev: "NYC", state: "New York City" }, { abrev: "NC", state: "North Carolina" }, { abrev: "ND", state: "North Dakota" }, { abrev: "OH", state: "Ohio" }, { abrev: "OK", state: "Oklahoma" }, { abrev: "OR", state: "Oregon" }, { abrev: "PA", state: "Pennsylvania" }, { abrev: "PR", state: "Puerto Rico" }, { abrev: "RI", state: "Rhode Island" }, { abrev: "SC", state: "South Carolina" }, { abrev: "SD", state: "South Dakota" }, { abrev: "TN", state: "Tennessee" }, { abrev: "TX", state: "Texas" }, { abrev: "UT", state: "Utah" }, { abrev: "VT", state: "Vermont" }, { abrev: "VA", state: "Virginia" }, { abrev: "WA", state: "Washington" }, { abrev: "WV", state: "West Virginia" }, { abrev: "WI", state: "Wisconsin" }, { abrev: "WY", state: "Wyoming" }];
var FolderMaps = [];
var jsFolderMapFiles = [];

var heartbeatInterval = setInterval(heartbeat, 60000);
var pageCompliance, pageManagement;
var jsLicenseStates = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "PR", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"];
var jsMapStates = [];
var pageHeight;
var jsSiteAdmin;
var globalUsername = null;
var globalManagement = null;
var jsUserParts = [];
var jsMyCreds = [];
var complianceColors = ["white", "rgb(140, 197, 131)", "yellow", "rgb(211, 63, 100)"];
var imgsFolder = "images/";
var setSystemNotificationsInterval;
var setSystemSendMailInterval;
var setSystemSignedAppInterval;
var setDSOutstandingInterval;
var jsDCIX = [];

var myCID, myCompany, mgtCID, isMGT;
var jsButtonText = [];

const PRIVATE_BADGE_URL = "private_badge.png"
const SHARED_OUTBOUND_BADGE_URL = "shared_outbound_badge_LR.png"
const SHARED_INDOUND_BADGE_URL = "shared_inbound_badge_LR.png"
const SHARED_BIDIRECTIONAL_BADGE_URL = "shared_bidirectional_badge_LR.png"
const FOLDER_MANILLA_URL = "folder-manilla.png"
const FOLDER_MANILLA_EMPTY_URL = "folder-manilla-empty.png"
const FOLDER_MANILLA_RECEIVING_URL = "folder-manilla-receiving.png"
const FOLDER_MANILLA_RECEIVING_EMPTY_URL = "folder-manilla-receiving-empty.png"

var EventFilter;
var EventOpenClosed = true;

var GlobalFName, GlobalLName;
var jsExportGChart = [];
var jsExportGChart_ColStyles = "";
//code:20240614:125pm
var jsAccessTreeTiers = [];
var ByFolderByCompany;
var jsDashboardData = [];
let currentReportName = "";
var isDynamicReportsPopOut = false;
var jsGetSystemLink = null;
var jsFileActionRequestIDs = null;
var userColors = [
    { "Letter": "A", "Color": "Alice Blue", "RGB": { r: 240, g: 248, b: 255 }, "ContrastColor": "black" },
    { "Letter": "B", "Color": "Beige", "RGB": { r: 245, g: 245, b: 220 }, "ContrastColor": "black" },
    { "Letter": "C", "Color": "Chartreuse", "RGB": { r: 127, g: 255, b: 0 }, "ContrastColor": "black" },
    { "Letter": "D", "Color": "Dark Orange", "RGB": { r: 255, g: 140, b: 0 }, "ContrastColor": "black" },
    { "Letter": "E", "Color": "Emerald", "RGB": { r: 80, g: 200, b: 120 }, "ContrastColor": "black" },
    { "Letter": "F", "Color": "Fuchsia", "RGB": { r: 255, g: 0, b: 255 }, "ContrastColor": "white" },
    { "Letter": "G", "Color": "Gold", "RGB": { r: 255, g: 215, b: 0 }, "ContrastColor": "black" },
    { "Letter": "H", "Color": "Hot Pink", "RGB": { r: 255, g: 105, b: 180 }, "ContrastColor": "white" },
    { "Letter": "I", "Color": "Indigo", "RGB": { r: 75, g: 0, b: 130 }, "ContrastColor": "white" },
    { "Letter": "J", "Color": "Jade", "RGB": { r: 0, g: 168, b: 107 }, "ContrastColor": "white" },
    //{ "Letter": "K", "Color": "Hot Pink", "RGB": {r:255, g:105, b:180}, "ContrastColor": "white" },
    { "Letter": "K", "Color": "Khaki", "RGB": { r: 240, g: 230, b: 140 }, "ContrastColor": "black" },
    { "Letter": "L", "Color": "Lavender", "RGB": { r: 230, g: 230, b: 250 }, "ContrastColor": "black" },
    { "Letter": "M", "Color": "Magenta", "RGB": { r: 255, g: 0, b: 255 }, "ContrastColor": "white" },
    { "Letter": "N", "Color": "Navy Blue", "RGB": { r: 0, g: 0, b: 128 }, "ContrastColor": "white" },
    { "Letter": "O", "Color": "Olive", "RGB": { r: 128, g: 128, b: 0 }, "ContrastColor": "white" },
    { "Letter": "P", "Color": "Plum", "RGB": { r: 221, g: 160, b: 221 }, "ContrastColor": "black" },
    { "Letter": "Q", "Color": "Quartz", "RGB": { r: 81, g: 72, b: 79 }, "ContrastColor": "white" },
    { "Letter": "R", "Color": "Royal Blue", "RGB": { r: 65, g: 105, b: 225 }, "ContrastColor": "white" },
    { "Letter": "S", "Color": "Salmon", "RGB": { r: 250, g: 128, b: 114 }, "ContrastColor": "black" },
    { "Letter": "T", "Color": "Teal", "RGB": { r: 0, g: 128, b: 128 }, "ContrastColor": "white" },
    { "Letter": "U", "Color": "Ultramarine", "RGB": { r: 18, g: 10, b: 143 }, "ContrastColor": "white" },
    { "Letter": "V", "Color": "Violet", "RGB": { r: 238, g: 130, b: 238 }, "ContrastColor": "black" },
    { "Letter": "W", "Color": "White Smoke", "RGB": { r: 245, g: 245, b: 245 }, "ContrastColor": "black" },
    { "Letter": "X", "Color": "Xanthic", "RGB": { r: 238, g: 237, b: 9 }, "ContrastColor": "black" },
    { "Letter": "Y", "Color": "Yellow", "RGB": { r: 255, g: 255, b: 0 }, "ContrastColor": "black" },
    { "Letter": "Z", "Color": "Zucchini", "RGB": { r: 80, g: 75, b: 48 }, "ContrastColor": "white" }
];
//var lastReportFdrID = null;

// ============================================================
// SECTION: color helpers (contrast text color, RGB parsing, hex conversion)
// ============================================================
function getContrastColorNonRGB(colorName) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = colorName;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    //return { r, g, b, a };
    return getContrastColor(r, g, b);
}

function getContrastColor(r, g, b) {
    const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });

    // 3. Calculate relative luminance (L)
    const luminance = 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];

    // 4. Return black for light backgrounds, white for dark
    console.log("err lum", luminance);
    return luminance > 0.379 ? "black" : "white";
}

function getRGBfromColor(colorStr) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = colorStr;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return { r, g, b };
}

function getRGB(clrs) {
    var clr = clrs[0];
    var rgb = getRGBfromColor(clr);

    for (var i = 1; i < clrs.length; i++) {
        var rgb2 = getRGBfromColor(clrs[i]);
        var hc = {
            r: Math.floor((rgb.r + rgb2.r) / 2),
            g: Math.floor((rgb.g + rgb2.g) / 2),
            b: Math.floor((rgb.b + rgb2.b) / 2)
        };
        rgb = hc;
    }
    return "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
}

function colorToHex(clr) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillStyle = clr;
    const computed = ctx.fillStyle;
    if (computed.startsWith("#")) return computed;
    const match = computed.match(/\d+/g);
    if (match) {
        return "#" + match.slice(0, 3)
            .map(n => parseInt(n).toString(16).padStart(2, "0"))
            .join("");
    }
    return null;
}



// ============================================================
// SECTION: session bootstrap, main nav bar, security/export polling, alerts, DocuSign queue status
// ============================================================
function setUserInitials(txt, DV) {
    txt = (!txt) ? "Calculating timeout ..." : txt;
    DV = (!DV) ? txtSessionTimeout : DV;
    DV.innerHTML = "";
    var initials = ME.Security[0].Initials;
    var i = initials[1]
    var c = ME.Security[0].Company[0].toUpperCase();
    console.log(118, ME.Security[0]);



    var initClr, compClr;
    try { initClr = userColors.filter(d => d.Letter == i)[0].RGB; } catch (ex) { initClr = { r: 240, g: 248, b: 255 } }
    try { compClr = userColors.filter(d => d.Letter == c)[0].RGB; } catch (ex) { compClr = { r: 80, g: 75, b: 48 } }

    const hc = {
        r: Math.floor((initClr.r + compClr.r) / 2),
        g: Math.floor((initClr.g + compClr.g) / 2),
        b: Math.floor((initClr.b + compClr.b) / 2)
    };

    var clr = getContrastColor(hc.r, hc.g, hc.b);
    var bclr = "rgb(" + hc.r + ", " + hc.g + ", " + hc.b + ")";

    DV.style.whiteSpace = "nowrap";
    DV.style.padding = "5px";

    xsection(DV, [
        ((DV == document.getElementById("txtSessionTimeout")) ? "" : "label|class=normal circle-with-text|style=background-color:" + bclr + "; color:" + clr + "|" + initials),
        "label|class=padLeft10|" + txt
    ]);
}


function divResized(dv, w, h) {
    if (dv.id == "dispReport") {
        displayReport.style.width = (w - 40) + "px";
        displayReport.style.height = (document.body.scrollHeight - 250) + "px";

        dv = displayReport;
        if (dv) {
            var dvhdrs = document.getElementById("dvHdrs_" + dv.id);
            var dvtbl = document.getElementById("dvTbl_" + dv.id);

            var tblHdrs = document.getElementById(dv.id + "_hdrs");
            var tblRpt = document.getElementById(dv.id + "_tbl");

            ////set col widths
            //var sticky = document.getElementsByClassName(dv.id + "_sticky");
            //var nonsticky = document.getElementsByClassName(dv.id + "_nonsticky");
            //sticky[0].style.width = "10px";
            //nonsticky[0].style.width = "10px";
            //////alert(sticky.length);
            //for (var i = 0; i < sticky.length; i++) {
            //    sticky[i].style.width = (nonsticky[i].clientWidth + 0) + "px";
            //    sticky[i].parentElement.style.width = sticky[i].style.width;
            //    nonsticky[i].parentElement.style.width = nonsticky[i].style.width;
            //}

            //set table and div widths
            if (tblRpt.clientWidth < dv.clientWidth) {
                tblRpt.style.width = dv.clientWidth + "px";
                dvtbl.style.width = dv.clientWidth + "px";
            } else {
                tblRpt.style.width = tblRpt.clientWidth + "px";
                dvtbl.style.width = (tblRpt.clientWidth + 70) + "px";
            }

            dvhdrs.style.width = dvtbl.clientWidth + "px";
            tblHdrs.style.width = tblRpt.clientWidth + "px";
        }
    } else {
        console.log("xbserver", dv.id, w, h, document.body.scrollHeight)
    }
}

function GetFile(url, joParams) {
    var uToken = sessionStorage.getItem("UserToken");

    // Function to handle the authenticated download
    const viewXFile = async (url, accessToken) => {
        try {
            // 1. Fetch the resource with your custom header
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                }
            });

            // Handle non-OK responses (e.g., 401 Unauthorized)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // 2. Get the response as a blob
            const xblob = await response.blob();

            // 3. Create a temporary local URL for the blob
            const xblobUrl = window.URL.createObjectURL(xblob);

            // 4. Open the new window with the temporary URL
            const xnewWindow = window.open(xblobUrl, "_blank");
            if (xnewWindow) {
                xnewWindow.focus();
            } else {
                alert("Popup blocked! Please allow popups for this site.");
            }

            // Optional: Revoke the object URL after a delay
            // to free up memory.
            // setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);

        } catch (err) {
            console.error("Error fetching or opening the file:", err);
        }
    };
    var ui = 0
    for (var key in joParams) {
        url += ((ui == 0) ? "?" : "&") + key + "=" + joParams[key];
    }

    viewXFile(url, uToken);
}

//var exportInterval = setInterval(LookForExport, 15000);
function LookForExport(go) {
    getData("FindExportCRS", null, function (vr) {
        if (vr != "not yet") {
            windowOpen("ExportCRS?CRS_ReportID=" + vr, "taget=_blank");
            smconfirm("Your Compare Report is downloading", null, 3500);
            //exportInterval.clearInterval();
        }
        console.log("Finding CRS Exports:" + vr);

        setTimeout(LookForExport, 15000);
    }, null, true);
    //smconfirm("Looking", null, 1000);
}

function secCheck(sec) {
    var rtn = (!sec.Team &&
        !sec.OurDocs &&
        !sec.OutsideDocs &&
        !sec.FileMGT &&
        !sec.FolderMGT &&
        !sec.Exams &&
        !sec.FollowUps &&
        !sec.DynamicReports &&
        !sec.CompareReports &&
        !sec.MngFormApplications &&
        !sec.RlsFormApplications &&
        !sec.FormApplications &&
        !sec.SectionID)
        ? true : false;

    console.log("err seccheck", sec, rtn);
    //alert(rtn);
    return rtn;
}

//START INTERVALS
var rsTryAgain = true;
var testTryAgain = false;
var ixTryAgain = 11;

function ftnTryAgain() {
    ixTryAgain--;
    if (ixTryAgain > 0) {
        //smconfirm("Security check failed. &nbsp;Retrying in " + ixTryAgain + " seconds");
        setTimeout(ftnTryAgain, 1000);
    } else {
        //xconfirm();
        setTimeout(reloadSecurity, 10000);
    }
}

function reloadSecurity() {
    getData(null, newFormData("_NewSecurity", {}), function (vr) {
        try {
            ME.Security = jparse(vr);
            //xconfirm();
            console.log(ME.Security);
            //logout for no access
            var sec = ME.Security[0];
            ixTryAgain = 11;

            if (testTryAgain) {
                testTryAgain = false;
                sec = {};
            }
            if (secCheck(sec)) {
                rsTryAgain = false;
                if (!rsTryAgain) {
                    alert("Your permissions have changed.  You will be logged out now.");
                    logout();
                } else {
                    rsTryAgain = false;
                    ftnTryAgain();
                }
            } else {
                rsTryAgain = true;
                setTimeout(reloadSecurity, 30000);
            }
        } catch (ex) {
            logout();
        }
    }, null, true);
}

function getSystemNotifications(func, ps) {
    //if (setSystemNotificationsInterval == null) {
    //    setSystemNotificationsInterval = setInterval(getSystemNotifications, 10000);
    //}
    console.log("launching GetSystemNotifications now")
    getData(null, newFormData("_GetSystemNotifications", {}), function (vr) {
        var js = jparse(vr);
        console.log("err notifications", js);
        var gobaby = true;
        try {
            if (js[0].msg == "try again") {
                console.log("launching GetSystemNotifications in 2 seconds")
                setTimeout(function () { getSystemNotifications(); }, 2000);
                gobaby = false;
            }
        } catch (ex) {
            //console.log("GetSystemNotifications: err", ex);
        }

        if (js.length == 0) {
            notificationCnt.style.display = "none";
        } else if (!js[0].msg) {
            notificationsList = js;
            var cnt = notificationsList.length;
            var dsp = (cnt == 0) ? "none" : "";
            notificationCnt.innerHTML = cnt;
            notificationCnt.style.display = dsp;
        }

        if (gobaby) {
            console.log("launching GetSystemNotifications in 60 seconds")
            setTimeout(function () { getSystemNotifications(); }, 60000);
        }
    }, null, true);
}

function SendMail() {
    if (setSystemSendMailInterval == null) {
        setSystemSendMailInterval = setInterval(SendMail, 12000);
    }
    if (1 == 1) {
        getData("SendMail", null, function (vr) {
            //c_log("Mail Sent");
        }, null, true);
    }
}

function GetGetSignedApplicationFILES() {
    if (setSystemSignedAppInterval == null) {
        setSystemSignedAppInterval = setInterval(GetGetSignedApplicationFILES, 14000);
    }//GetDSOutstanding
    getData("GetGetSignedApplicationFILES", null, function (vr) {
        //c_log("Got Signed Applications");
    }, null, true);
}

function SignDSQueue() {
    if (setDSOutstandingInterval == null) {
        setDSOutstandingInterval = setInterval(SignDSQueue, 16000);
    }//GetDSOutstanding
    getData("SignDSQueue", null, function (vr) {
        //c_log("Got DS Outstanding");
    }, null, true);
}

//END INTERVALS

function GetDSOutstanding(main, js) {
    if (js == null) {
        getData("GetDSOutstanding", null, function (vr) {
            var js = jparse(vr);
            PopUp("Get DS Outstanding", js);
        });
    } else {
        js.filter(d => d.Date_Sent = d.SentDT);
        js.filter(d => d.Date_Signed = d.SignedDT);
        js.filter(d => d.Date_Created = d.DTCreated);
        getGChartTable(js, ["DSEnvelopeID", "Status", "SignerName", "SignerEmail", "Date_Created", "Date_Sent", "Date_Signed"], main, []);
    }
}

var jsGlobalUser = [];


var containers = [];
var divSpanOnOffs = [];
const observer = new ResizeObserver(entries => {
    for (let entry of entries) {
        //divChart_Span(entry.target.id.split("_")[0]);
    }
});

const xChartObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
        //const rect = entry.target.getBoundingClientRect();
        //var ht = window.innerHeight - rect.top;
        //var wd = window.innerWidth - rect.left;
        //entry.target.style.maxWidth = (wd - 40) + "px";
        //entry.target.style.maxHeight = (ht - 40) + "px";
    }
});


const MainObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
        const rect = PageContainer.getBoundingClientRect();
        var ht = window.innerHeight - rect.top;
        var wd = window.innerWidth - rect.left;

        //PageContainer.style.height = (ht - 0) + "px";
        //PageContainer.style.maxHeight = (ht - 0) + "px";
        //PageContainer.style.width = (wd - 0) + "px";
        //PageContainer.style.maxWidth = (wd - 0) + "px";

        document.getElementsByClassName("fittedContainer")[0].style.height = "calc(100% - 10px)";
        document.getElementsByClassName("mainBody")[0].style.height = "calc(100% - 10px)";
        PageContainer.style.height = "100%";
        PageContainer.style.width = "100%";

    }
});

const ContainerObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
        for (var i = 0; i < containers.length; i++) {
            var xx = containers[i];
            var elem = document.getElementById(xx.elem);
            if (elem) {
                const rect = elem.getBoundingClientRect();
                var ht = window.innerHeight - rect.top;
                var wd = window.innerWidth - rect.left;
                elem.style.width = (wd - 20) + "px";
                elem.style.maxWidth = (wd - 20) + "px";
                elem.style.height = (ht - 20) + "px";
                elem.style.maxHeight = (ht - 20) + "px";
            }
        }
    }
    if (document.getElementById("displayReport")) {
        displayReport.style.height = (window.innerHeight - 200) + "px";
        displayReport.style.width = (window.innerWidth - 200) + "px";
    }
});


//MAIN NAV
function build_mainNav() {

    MainObserver.observe(disappearAll);
    ContainerObserver.observe(PageContainer);
    containers.push({ elem: "bcrReport", wd: 20, ht: 20 });





    if (sectionTitle != "Login" && document.getElementById("PageContainer") != null) {
        LookForExport();

        getData(null, newFormData("_GetScribes", {}), function (vr) {
            var js = jparse(vr);
            jsHowTo = js;
            console.log("getscribes", js);
        });

        var ht = document.getElementById("PageContainer").clientHeight;
        document.getElementById("PageContainer").style.height = (ht - 30) + "px";
        document.getElementById("PageContainer").style.overflowY = "auto";

        xsection(mainNav, ["div|class=pad10 sm|id=mainNavWaiting|Please wait while navigation panel is loading ..."]);
        //getData(null, newFormData("_SECURITY", {}), function (vr)
        if (1 == 1) {
            mainNav.removeChild(mainNavWaiting);

            //jsSECURITY = jparse(vr);
            //jsGlobalUser = jsSECURITY[0];
            //console.log(190, jsSECURITY);

            //jssGA = (jsSECURITY.filter(d => d.Section == "Administrators" && d.Action == "Global Administrator").length > 0) ? true : false;
            //jssUA = (jsSECURITY.filter(d => d.Section == "Administrators" && d.Action == "User Administrator").length > 0 || jssGA) ? true : false;
            ////jssUA = jsGlobalUser.isUA;
            //console.log(jssGA, jssUA);

            //jssMGT = jsGlobalUser.isMGT;
            //jssMyCID = jsGlobalUser.CID;
            //jssMyUID = jsGlobalUser.UID;
            //jssMyName = jsGlobalUser.Name;
            //jssMyCompany = jsGlobalUser.Company;

            var username = ME.Security[0].UserName;
            globalUsername = ME.Security[0].Name;
            globalManagement = ME.Security[0].Company;

            if (sectionTitle == "Calendar") {
                //set calendar banner username
                LayoutBanner.style.display = "none";
                try { loading2.style.display = "none"; } catch (e) { c_log(e); }
                calendar.innerHTML = "";
                calUserName.innerHTML = username;
            } else {
                //set banner logo and username

                section("poweredBy", ["img|src=logo_" + mgtCID + ".png|style=width:70%;height:70%"]);
               // let lblUserName = document.getElementById("lblUserName");
                console.log(lblUserName);
                setUserInitials(username, lblUserName);
                //lblUserName.appendChild(dyn("label", "innerHTML=" + username));


                //build notification tray
                nsection("lblNotifications", [
                    "label|title=System Notifications|style=cursor:pointer|id=bell_notification_btn|onclick=toggleNotificationTray(event)" +
                    //"|||append|label|id=bell_notification|icon=bell_notification.png|icon.style=width:25px; height:18px",
                    "|||append|label|id=bell_notification|icon=bell_notification.png|icon.style=width:35px; height:28px",
                    "div|id=main_container_top_nav_dropdown|class=main_container_top_nav_dropdown",
                ]);

                nsection("bell_notification_btn", [
                    "span|id=notificationCnt|style=display:|class=notification__badge|..."
                ]);

                ////important stuff
                getSystemNotifications();
                SignDSQueue();
                //SendMail();
                //GetGetSignedApplicationFILES();
            }

            //jsUserParts = jparse(vr);
            //jsMyCreds = jparse(vr);
            //c_log(jsMyCreds);

            //if (jsSECURITY.length > 0) {
            //var PartDoc = (jsSECURITY.filter(d => d.Section == "Documents" && d.Assigned).length > 0) ? true : false;
            //var PartMgt = (jsSECURITY.filter(d => d.Section == "3rd Party Management" && d.Assigned).length > 0) ? true : false;
            //c_log(jsSECURITY[0].isUA);

            var sec = ME.Security[0];
            var PartDoc = (sec.OurDocs || sec.OutsideDocs || sec.FileMGT || sec.FolderMGT || sec.Exams || sec.FollowUps) ? true : false;
            var isUA = sec.isUA;

            section("mainNav", [
                "div|class=sm padLeft10|id=txtSessionTimeout|",
                "div|onclick=showHideMaiNav()|style=color:steelblue|class=innerDiv|<<",//code: 20240806: 0318pm place the collapse arrows "<<"
                "div|icon=power.png|class=optSidebar|onclick=logout()|innerHTML=Log out",
                //"li|onclick=PopUp('PowerBIExample')|PowerBI",
                //code: 20240807: 0220pm remove the ID attribute in the "<<" div
                //((myCID == 1518) ? "div|icon=gearbox.png|class=optSidebar|onclick=PopUp('Update Scribes')|Update Scribes" : ""),
                "div|icon=help_icon.png|class=optSidebar|onclick=popupHelpMenu('Help Section', 'popHelpSection', 'unPopHelpSection', null, null, '500px', '500px')|Help",
                //  "div|icon=sendSupportRequest.png|class=optSidebar|style=border-bottom:solid 0px gray|onclick=showOpts('Send Support Request')|innerHTML=Send Support Request",
                // "div|icon=systemAdministration.png|class=optSidebar|onclick=PopUp('User Administration', null, null, null, ['200px','500px'])|innerHTML=" +
                "div|icon=systemAdministration.png|class=optSidebar|onclick=PopUp('User Administration', null, null, null, ['600px','600px'])|innerHTML=" +
                ((sec.isUA) ? "System Administration" : "User Administration"),
                "div|icon=mail.png|name=navOpts|class=optSidebar|onclick=OpenNEOMail()|innerHTML=Mailbox",
                //"div|icon=li|name=navOpts|class=optSidebar|onclick=LoadMGTExam()|innerHTML=Load Exam",
                //"div|icon=li|name=navOpts|class=optSidebar|onclick=xconfirm('Feature pending ...')|innerHTML=Contacts",
                ((!sec.DynamicReports) ? "" : "div|icon=displayDetails.png|name=navOpts|class=optSidebar|onclick=PopUp('Dynamic Reports', null, null, null, ['750px','900px'])|innerHTML=Dynamic Reports"),
                ((!sec.DynamicReports) ? "" : "div|icon=compareReportsIcon.png|name=navOpts|class=optSidebar|onclick=LoadCompareFileAPI();|innerHTML=Compare Reports"),
                ((!sec.FormApplications) ? "" : "div|icon=documentWhand_bw.png|name=navOpts|class=optSidebar|onclick=PopUp('Saved Reports')|innerHTML=Saved Reports"),
                //((jssMGT) ? "div|icon=teamMembers.png|name=navOpts|class=optSidebar|onclick=PopUp('Team Members', null, null, null, ['500px','900px'])|innerHTML=Team Members" : ""),
                //((jssMGT) ? "div|icon=applicationAccess.png|name=navOpts|class=optSidebar|onclick=PopUp('Application Access', null, null, null, ['500px','900px'])|innerHTML=Application Access" : ""),
                ((sec.isMGT) ? "div|icon=teamMembers.png|name=navOpts|class=optSidebar|onclick=PopUp('Access', null, null, null, ['200px','300px'])|innerHTML=Display Access" : ""),

                //"div|icon=li|name=navOpts|class=optSidebar|onclick=PopUp('Notifications Matrix', null, null, null, ['500px','900px'])|innerHTML=Notifications Matrix",

                // "div|icon=history.png|name=navOpts|class=optSidebar|onclick=DropMenu(event, '<b>History</b>', DMHistory, [])|innerHTML=History",
                "div|icon=icoAlert.png|icon.name=icoAlert|name=navOpts|class=optSidebar iao_icon|style=border-bottom:solid 0px gray|onclick=openSplitScreen('PopOut?main~ItemsAlertedOn&var~{}&csrf~" + csrfToken.value + "')|innerHTML=Alert Items",
                "div|icon=calendar.png|name=navOpts|class=optSidebar|style=border-bottom:solid 1px gray|onclick=window.open('Calendar')|innerHTML=Calendar",
                //"div|icon=calendar.png|name=navOpts|class=optSidebar|style=border-bottom:solid 1px gray|onclick=PopUp('Select Color', ['orange', function(clr){alert(clr)}])|innerHTML=colorpicker",
                //"div|icon=dashboardN.png|name=navOpts|class=optSidebar|onclick=PopUp('NeoData Dashboard', null, null, null, ['750px','900px'])|Create Dashboard",
                //"div|icon=calendar.png|name=navOpts|class=optSidebar|style=border-bottom:solid 1px gray|onclick=sendemailsOneOff()|innerHTML=send emails",
                //"div|icon=exam.png|name=navOpts|class=optSidebar|style=border-bottom:solid 1px gray|onclick=PopUp('Exam', { ExamID: '', xCID: 0, PU: true });|innerHTML=Exams",
                "div|icon=viewNetwork.png|name=navOpts|class=optSidebar|style=border-bottom:solid 1px gray|onclick=PopUp('Network View', null, null, true)|innerHTML=View Network",
            ]);

            setUserInitials();

            section("mainNav", [
                "div|icon=dashboard.png|class=optSidebar|onclick=loc('Dashboard')|innerHTML=Dashboard",
                //"div|icon=dashboard.png|class=optSidebar|onclick=PopUp('Debt Management', null, null, true, ['500px','1000px'])|innerHTML=Debt Management",
                ((!PartDoc) ? "" : "div|icon=folder-yellow-ftp-empty.png|class=optSidebar|onclick=loc('Documents')|Document Management"),
                //((!PartMgt) ? "" : "div|icon=thirdPartyManagement.png|class=optSidebar|onclick=loc('Management')|3rd Party Management"),
                ((!sec.FormApplications) ? "" : "div|icon=expandPanel_rightarrow.png|class=optSidebar|onclick=showHide('tdNextNav')|Form Applications"),
                "div|icon=merc.png|class=optSidebar|onclick=LaunchMercury()|Mercury",
                //"div|icon=merc.png|class=optSidebar|onclick=PopUp('xChart')|test new table",
                //"label|class=alink|onclick=uploadWelcome()|Upload Welcome"
                //"div|icon=warning-triangle.png|Icon for warning messages"
            ]);
            //PopUp("pig", null, null, true, ['500px','1000px'])

            //code: 20240830: 0117pm Update entire mainHidNav Section
            section("mainHidNav", [
                //code: 20240807: 0220pm remove the ID attribute in the ">>" div
                "div|onclick=showHideMaiNav()|style=color:steelblue|class=xxinnerDiv|>>",//code: 20240806: 0318pm place the expand arrows ">>"
                "div|class=sm|id=txtSessionTimeout2",
                "div|icon=power.png|class=optSidebar navicon0|style=cursor:pointer;|onclick=logout()|onmouseover=showNavIconDescription(this)|onmouseout=hideNavIconDescription(this)|title=Log Out", //"br",
                "div|class=navIconDescription navicon1|id=navIconDescription1|style=display:none;|Log Out",
                "div|style=height:5px|",

                "div|icon=help_icon.png|name=navOpts|class=optSidebar navicon0|style=cursor:pointer;|onclick=popupHelpMenu('Help Section', 'popHelpSection', 'unPopHelpSection', null, null, '500px', '500px')|onmouseover=showNavIconDescription(this)|onmouseout=hideNavIconDescription(this)|title=Help", //"br",
                "div|class=navIconDescription navicon1|id=navIconDescription2|style=display:none;|Help",
                "div|style=height:5px|",

                "div|icon=systemAdministration.png|class=optSidebar navicon0|onclick=PopUp('User Administration', null, null, null, ['600px','600px'])|onmouseover=showNavIconDescription(this)|onmouseout=hideNavIconDescription(this)", //"br",
                "div|class=navIconDescription navicon1|id=navIconDescription3|style=display:none;|User Administration",
                "div|style=height:3px|",

                "div|icon=mail.png|name=navOpts|class=optSidebar navicon0|style=cursor:pointer;|onclick=OpenNEOMail()|onmouseover=showNavIconDescription(this)|onmouseout=hideNavIconDescription(this)|title=Mailbox", //"br",
                "div|class=navIconDescription navicon1|id=navIconDescription4|style=display:none;|Mail",
                "div|style=height:10px|",

                ((!sec.DynamicReports) ? "" : "div|icon=displayDetails.png|name=navOpts|class=navlink|style=cursor:pointer;|onclick=PopUp('Dynamic Reports', null, null, null, ['500px', '900px'])|onmouseover=showNavIconDescription(this)|onmouseout=hideNavIconDescription(this)|title=Dynamic Reports"), //"br",
                ((!sec.DynamicReports) ? "" : "div|class=navIconDescription navicon1|id=navIconDescription5|style=display:none;|Dynamic Reports"),
                ((!sec.DynamicReports) ? "" : "div|style=height:5px|"),

                ((!sec.CompareReports) ? "" : "div|icon=compareReportsIcon.png|name=navOpts|class=optSidebar navicon0|style=cursor:pointer;|onclick=LoadCompareFileAPI()|onmouseover=showNavIconDescription(this)|onmouseout=hideNavIconDescription(this)|title=Compare Reports"),
                ((!sec.CompareReports) ? "" : "div|class=navIconDescription navicon1|id=navIconDescription6|style=display:none;|Compare Reports"),
                ((!sec.CompareReports) ? "" : "div|style=height:5px|"),

                ((!sec.CompareReports) ? "" : "div|icon=documentWhand_bw.png|name=navOpts|class=optSidebar navicon0|style=cursor:pointer;|onclick=PopUp('Saved Reports')|onmouseover=showNavIconDescription(this)|onmouseout=hideNavIconDescription(this)|title=Saved Reports"),
                ((!sec.CompareReports) ? "" : "div|class=navIconDescription navicon1|id=navIconDescription7|style=display:none;|Saved Reports"),
                ((!sec.CompareReports) ? "" : "div|style=height:5px|"),

                //((!sec.FormApplications) ? "" : "div|icon=documentWhand_bw.png|name=navOpts|class=optSidebar|onclick=PopUp('Saved Reports')|innerHTML=Saved Reports"),

                ((sec.isMGT) ? "div|icon=teamMembers.png|name=navOpts|class=optSidebar navicon0|style=cursor:pointer;|onclick=PopUp('Access', null, null, null, ['200px','300px'])|onmouseover=showNavIconDescription(this)|onmouseout=hideNavIconDescription(this)|title=Display Access" : ""),
                ((sec.isMGT) ? "div|class=navIconDescription navicon1|id=navIconDescription7|style=display:none;|Display Access" : ""),
                ((sec.isMGT) ? "div|style=height:5px|" : ""),

                "div|icon=icoAlert.png|icon.name=icoAlert|id=iao_icon|name=navOpts|class=optSidebar navIcon16 iao_icon|style=cursor:pointer;|title=Alert Items|onclick=openSplitScreen('PopOut?main~ItemsAlertedOn&var~{}&csrf~" + csrfToken.value + "')",

                "div|icon=calendar.png|name=navOpts|class=optSidebar navicon0|style=cursor:pointer;|onclick=window.open('Calendar')|onmouseover=showNavIconDescription(this)|onmouseout=hideNavIconDescription(this)|title=Calendar", //"br",
                "div|class=navIconDescription navicon1|id=navIconDescription8|style=display:none;|Calendar",
                "div|style=height:10px|",

                //"div|icon=dashboardN.png|name=navOpts|class=optSidebar navicon0|onclick=PopUp('NeoData Dashboard', null, null, null, ['750px','900px'])|onmouseover=showNavIconDescription(this)|onmouseout=hideNavIconDescription(this)", //"br",
                //"div|class=navIconDescription navicon1|id=navIconDescription8|style=display:none;|Create Dashboard",
                //"div|style=height:10px|",

                /*               "div|icon=dashboardN.png|name=navOpts|class=optSidebar|onclick=PopUp('NeoData Dashboard', null, null, null, ['750px','900px'])|Create Dashboard",*/

                //"div|icon=exam.png|name=navOpts|class=optSidebar navicon0|onclick=PopUp('Exam', { ExamID: '', xCID: 0, PU: true });|onmouseover=showNavIconDescription(this)|onmouseout=hideNavIconDescription(this)", //"br",
                //"div|class=navIconDescription navicon1|id=navIconDescription8|style=display:none;|Exam",
                //"div|style=height:10px|",

                "div|icon=viewNetwork.png|name=navOpts|class=optSidebar navicon0 navicon0|style=cursor:pointer;|style=border-top:solid 1px gray|onclick=PopUp('Network View', null, null, true)|onmouseover=showNavIconDescription(this)|onmouseout=hideNavIconDescription(this)|title=View Network", //"br",
                "div|class=navIconDescription navicon1|id=navIconDescription9|style=display:none;|View Network",
                "div|style=height:10px; border-bottom:solid 1px gray;|",

                "div|style=height:10px|",
                "div|icon=dashboard.png|name=navOpts|class=navlink navicon0|style=cursor:pointer;|onclick=loc('Dashboard')|onmouseover=showNavIconDescription(this)|onmouseout=hideNavIconDescription(this)|title=Dashboard", //"br",
                "div|class=navIconDescription navicon1|id=navIconDescription10|style=display:none;|Dashboard",
                "div|style=height:5px|",

                ((!PartDoc) ? "" : "div|icon=folder-yellow-ftp-empty.png|class=optSidebar navicon0|style=cursor:pointer;|onclick=loc('Documents')|onmouseover=showNavIconDescription(this)|onmouseout=hideNavIconDescription(this)|title=Document Managemnt"), //"br",
                "div|class=navIconDescription navicon1|id=navIconDescription11|style=display:none;|Document Managemnt",
                "div|style=height:5px|",

                //((!PartMgt) ? "" : "div|icon=thirdPartyManagement.png|class=optSidebar navicon0|onclick=loc('Management')|onmouseover=showNavIconDescription(this)|onmouseout=hideNavIconDescription(this)"), //"br",
                //"div|class=navIconDescription navicon1|id=navIconDescription12|style=display:none;|3rd Party Management",
                //"div|style=height:5px|",

                ((!sec.FormApplications) ? "" : "div|icon=expandPanel_rightarrow.png|title=Form Applications|class=optSidebar navicon0|style=cursor:pointer;|onclick=showHide('tdNextNav')|onmouseover=showNavIconDescription(this)|onmouseout=hideNavIconDescription(this)"),
                "div|class=navIconDescription navicon1|id=navIconDescription13|style=display:none;|Form Applications",
                "div|style=height:5px|",
                "div|style=height:5px|",
                "div|icon=merc.png|class=optSidebar cursor|style=cursor:pointer;|onclick=LaunchMercury()|title=Mercury",
                //"label|class=alink|onclick=uploadWelcome()|Upload Welcome"
                //"div|icon=warning-triangle.png|Icon for warning messages"
            ]);



            tdNextNav.style.width = "200px";
            nsection("nextNav", [
                "div|class=smhdr|style=width:200px|Form Applications|||label|style=float:right;|class=sm redlink pad5|onclick=showHide('tdNextNav')|x",
                ((!sec.MngFormApplications) ? "" : "hr"),
                ((!sec.MngFormApplications) ? "" : "label|icon=gearbox.png|icon.class=icon cursor|name=hdrSection|class=sm optSidebar|onclick=loc('Interactive')|Manage Applications"),
                "hr",
            ]);

            //getData(null, newFormData("_IAGet", { action: "Forms" }), function (vr) {
            var jsIAForms = ME.Security.filter(d => d.FormID);
            var sectsUsed = [];
            for (var i = 0; i < jsIAForms.length; i++) {
                var xx = jsIAForms[i];
                var sectID = xx.SectionID;

                //if (jsSECURITY.filter(d => d.PartID == xx.FormID && d.Assigned).length > 0) {
                nsection("nextNav", [
                    ((sectsUsed.indexOf(sectID) == -1 && i > 0) ? "br" : ""),
                    ((sectsUsed.indexOf(sectID) == -1) ?
                        "div|class=sm bold padTop5 xxxoptSidebar|xxxonclick=LaunchApplication('InteractiveForm','" + xx.SectionID + "')|<b>" + xx.SectionName.replace(/_/g, " ") + "</b>" : ""),
                    "li|class=sm navlink|onclick=LaunchApplication('InteractiveForm','" + xx.FormID + "')|" + xx.FormName
                ]);
                sectsUsed.push(sectID);
                //}
            }
            //});

            getData("#adHoc", newFormData("getMsgLink", {}), function (vr) {
                var js = jparse(vr);
                for (var i = 0; i < js.length; i++) {
                    var link = js[i]["link"];
                    var msg = js[i]["msg"];
                    if (msg != "") {
                        mainNav.appendChild(dyn("div", "icon=li|class=optSidebarYellow|" +
                            ((i == 0) ? "style=border-top:solid 1px gray|" : "") +
                            "onclick=window.open('" + link + "')|innerHTML=" + msg));
                    }
                }
            });


            //}
        }
    }
}

// ============================================================
// SECTION: top-nav interactions (split screen, alerts, mercury launch, nav icon tooltips, app access)
// ============================================================
function openSplitScreen(url) {
    // 1. Get available screen dimensions (accounting for taskbars)
    const screenWidth = window.screen.availWidth;
    const screenHeight = window.screen.availHeight;

    // 2. Define size for half the screen
    const halfWidth = screenWidth / 2;

    // 3. Set features: position it at the far right (left = halfWidth)
    const features = `width=${halfWidth},height=${screenHeight},left=${halfWidth},top=0`;

    // 4. Open the window
    window.open(url, '_blank', features);
}

//function GetMyAlerts() {
//    getData(null, newFormData("_GetMyAlerts2", { onlyUnviewed: 1 }), function (vr) {
//        var js = jparse(vr).filter(d => d.Viewed == "False");
//        console.log("err my alerts", js);
//        if (js.length > 0) {
//            if (sectionTitle == "Dashboard") {
//                dbAlert.style.display = "";
//                dbAlert.innerHTML = "Click here to view your new alerts ...";
//            }
//            var elems = document.getElementsByClassName("iao_icon");
//            for (var i = 0; i < elems.length; i++) {
//                var img = elems[i].parentElement.firstElementChild;
//                img.src = "images/icoAlert_orange.png";
//            }
//        }
//    });
//}

function GetMyAlerts() {
    getData(null, newFormData("_GetMyAlerts2", { onlyUnviewed: 1 }), function (vr) {
        var js = jparse(vr).filter(d => d.Viewed == "False");
        if (js.length > 0) {
            if (sectionTitle == "Dashboard") {
                dbAlert.style.display = "";
                dbAlert.innerHTML = "&#9888; " + js.length + " new alert" + (js.length !== 1 ? "s" : "") + " — Click to view";
            }
            var elems = document.getElementsByClassName("iao_icon");
            for (var i = 0; i < elems.length; i++) {
                var img = elems[i].parentElement.firstElementChild;
                img.src = "images/icoAlert_orange.png";
            }
        }
    });
}

function LaunchMercury() {
    window.open('https://mercury.cms-services.net');
}
function Access(main) {
    xsection(main, [

        "br",
        ((jssMGT) ? "button|class=longblueButton|style=width:100%|onclick=PopUp('Team Members', null, null, null, ['500px','900px'])|innerHTML=Team Members" : ""),
        "br", "br",
        ((jssMGT) ? "button|class=longblueButton|style=width:100%|onclick=PopUp('Application Access', null, null, null, ['500px','900px'])|innerHTML=Application Access" : ""),
    ]);
}

function showNavIconDescription(elem) {
    var elems0 = document.getElementsByClassName("navicon0");
    var elems1 = document.getElementsByClassName("navicon1");
    for (var i = 0; i < elems0.length; i++) {
        if (elems0[i] == elem) {
            elems1[i].style.display = "block";
        }
    }
    //var descriptionId = "navIconDescription" + descriptionNumber;
    //document.getElementById(descriptionId).style.display = "block";

}

function hideNavIconDescription(elem) {
    var elems0 = document.getElementsByClassName("navicon0");
    var elems1 = document.getElementsByClassName("navicon1");
    for (var i = 0; i < elems0.length; i++) {
        if (elems0[i] == elem) {
            elems1[i].style.display = "none";
        }
    }
    //var descriptionId = "navIconDescription" + descriptionNumber;
    //document.getElementById(descriptionId).style.display = "none";
}
var jsApplicationAccess = [];
function ApplicationAccess(main,) {
    xsection(main, ["div|class=sm pad10|Please wait while data is loading ..."]);
    getData(null, newFormData("_IAFormCompanies", {}), function (vr) {
        var js = jparse(vr);
        main.innerHTML = "";
        jsApplicationAccess = js;
        xsection(main, [
            "div|style=text-align:right|Available Forms:" +
            "|||label|style=width:10px" +
            "|||select|style=width:300px|id=txtApplicationAccessForm|onchange=ApplicationAccessGO()|options=~" + js[0].Forms,
            "hr",
            "div|id=dvApplicationAccess|style=height:400px"
        ]);
        ApplicationAccessGO(main);
    });
}
function ApplicationAccessGO() {
    var FormID = txtApplicationAccessForm.value
    console.log(FormID);
    var js = jsApplicationAccess;
    js = (FormID == "") ? jsApplicationAccess : jsApplicationAccess.filter(d => d.FormID == FormID);
    dvApplicationAccess.innerHTML = "";
    getGChartTable(js, ["Application", "Form", "Company"], dvApplicationAccess, []);
}

function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
}

// ============================================================
// SECTION: file history, bulk-select checkboxes, generic AJAX GET helper, div resize/extra-panel toggling
// ============================================================
function buildFileHistory(main, fid) {
    var js = {}; js["fid"] = fid;
    var data = new FormData();
    data.append("action", "getFileHistory");
    data.append("strjson", jstring(js));

    godat({
        action: "_GetFileHistory", ps: { fid: fid }, func: function (vr) {
            var js = jparse(vr);
            c_log(js);
            nsection(main, ["div|id=eventShowHistory|style=height:250px"]);
            getGChartTable(js, ["Action", "Action_Date"], eventShowHistory, [{ Func: "ViewFile", Cols: [0], Params: ["FID", "Filename", "dockMe", "divPlaceMe"] }], null, null, null, null, ["Action_Date", true]);

        }
    });
}


function cbMultiSelect(e, elem, ix, func) {
    var cb = document.getElementsByName(elem);
    var checked = cb[ix].checked;

    if (e.shiftKey) {
        for (var i = ix - 1; i > -1; i--) {
            if (cb[i].checked == checked) {
                break;
            } else {
                cb[i].checked = checked;
            }
        }
    }

    if (func != null) {
        func();
    }
}

function cbMultiSelectClass(e, elem, ix, func, prams) {
    var cb = document.getElementsByClassName(elem);
    console.log(cb[ix]);
    var checked = cb[ix].checked;
    //checked = (checked) ? false : true;

    if (e.shiftKey) {
        for (var i = ix - 1; i > -1; i--) {
            console.log("cbmultiselect", i, ix, cb[i].checked);
            if (cb[i].checked == checked) {
                break;
            } else {
                cb[i].checked = checked;
            }
        }
    }
    if (func != null) {
        ////alert("func = " + func);

        if (prams != null) {
            func(prams);
        } else {
            func();
        }
    }
}

function cbMultiSelectThis(e, cls, elem, func, prams) {
    var cb = document.getElementsByClassName(cls);
    var ix = 0;
    for (var i = 0; i < cb.length; i++) {
        console.log("cbmultiselect", cb[i].id, elem.id);
        if (cb[i].id == elem.id) {
            ix = i;
            break;
        }
    }

    console.log(cb[ix]);
    var checked = cb[ix].checked;

    console.log("cbmultiselect", { ix: ix, checked: checked, shift: e.shiftKey });

    if (e.shiftKey) {
        for (var i = ix - 1; i > -1; i--) {
            console.log("cbmultiselect", i, ix, cb[i].checked);
            if (cb[i].checked == checked) {
                break;
            } else {
                cb[i].checked = checked;
            }
        }
    }
    if (func != null) {
        ////alert("func = " + func);

        if (prams != null) {
            func(prams);
        } else {
            func();
        }
    }
}

function openFile(fid, filename) {
    window.open("Download?fid=" + fid, "target=_blank", "width=800 height=600");
}

function getStoredData(func, params) {
    //////alert(func);
    pageHeight = document.body.scrollHeight;
    var json = {};
    json["screen"] = pageHeight;
    json["js"] = "[]";

    var data = new FormData();
    data.append("strjson", JSON.stringify(json));
    //console.log("MAC", "get docked files");
    //getData("#getDockedFiles", data, function (vr) {
    //    console.log("MAC", "g0t docked files");
    //    try {
    //        dockedFiles = null;
    //        dockedFiles = JSON.parse(vr);

    //    } catch (e) {
    //        dockedfiles = JSON.parse("[]");
    //    }


    //}, null, "noload");

    //getData("#getDivHt", data, function (vr) {
    //    divHt = JSON.parse(vr);
    //    ////alert(pageHeight);
    //    c_log(func, params);
    window[func](params);
    //}, null, "noload");
}

function resizeDiv(dv, plus, sides) {
    sides = (sides == null) ? 0 : sides;
    var main = document.getElementById(dv);

    var ht = main.style.height.replace("px", "") * 1;
    var wd = main.style.width.replace("px", "") * 1;
    var newHt = (ht + plus) + "px";
    var newWd = (wd + sides) + "px";

    dv = (dv.indexOf("fileViewer") == 0) ? "fileViewer" : dv;

    var xx = divHt.filter(d => d.divName != dv);
    xx.push({ divName: dv, ht: newHt, wd: newWd });
    divHt = xx;

    var strDivHt = JSON.stringify(divHt);
    var js = {};
    js["screen"] = pageHeight;
    js["js"] = strDivHt;

    var data = new FormData();
    data.append("strjson", JSON.stringify(js));

    getData("#getDivHt", data, function (vr) {
        //c_log("resize div:" + dv + " by " + plus + " from " + main.style.height);
        //c_log("page height: " + document.body.scrollHeight);

        main.style.height = newHt;
        if (sides != 0) { main.style.width = newWd; }
    }, null, "noload");
}

function extra(xx, onOff, appendNew, dvPlaceMe) {
    var ex = document.getElementById("PageContainer");
    var alt = document.getElementById(dvPlaceMe);
    ex = (alt != null) ? alt : ex;
    c_log("place window in", dvPlaceMe, ex, onOff);

    if (onOff) {
        ex.style.display = "";
        ex.appendChild(xx);
    } else {
        //ex.style.display = "none";
        ex.removeChild(xx);
    }
}

function closePopUps() {
    var x = document.getElementsByClassName("PopUp");
    for (var i = 0; i < x.length; i++) {
        x.parentElement.removeChild(x)
    }
    var x = document.getElementsByClassName("fileViewer");
    for (var i = 0; i < x.length; i++) {
        x.parentElement.removeChild(x)
    }
    opts(false);
    jsPopUps = [];
}


// ============================================================
// SECTION: date formatting/parsing helpers, JSON parse/stringify shortcuts
// ============================================================
function convertDT(DT, justDate) {
    //c_log("DT", DT);
    try {
        var yr = DT.split("-")[0];
        var mo = DT.split("-")[1];
        var da = DT.split("T")[0].split("-")[2];
        var tm = DT.split("T")[1];
        var strDT = mo + "/" + da + "/" + yr + ((justDate) ? "" : " " + tm + " UTC");
        //var strDT = mo + "/" + da + "/" + yr + " " + tm + " UTC";
        if (yr == "1900") {
            return "";
        } else {

            var date = new Date(strDT);
            //c_log("date parts put together as", date);
            if (tm != null) {
                //c_log(jstring({ DT: DT, strDT: strDT, date: date.toString(), DT0: DT.split("T")[0], DT1: DT.split("T")[1] }));
                //c_log(tm);
                if (tm.indexOf("00") == 0) {
                    //c_log(jstring({ DT: DT, strDT: strDT, date: date.toString(), DT0: DT.split("T")[0], DT1: DT.split("T")[1] }));
                    //c_log(tm);
                }
            }


            if (date instanceof Date && !isNaN(date.valueOf())) {
                strDT = date.toString();
                var daa = strDT.split(" ")[0];
                mo = strDT.split(" ")[1];
                da = strDT.split(" ")[2];
                yr = strDT.split(" ")[3];
                tm = strDT.split(" ")[4];
                var amPM = (tm.split(":")[0] * 1 > 11) ? "PM" : "AM"
                //c_log("amPM", amPM, "strTM", strTM);
                var strTM = ((amPM == "PM") ? tm.split(":")[0] * 1 - 12 : tm.split(":")[0]) + ":" + tm.split(":")[1] + " " + amPM;
                //c_log("strTM", strTM)
                strTM = (strTM.split(":")[0].indexOf("00") == 0) ? "12:" + strTM.split(":")[1] : strTM;
                //c_log("strTM", strTM)


                strDT = mo + " " + da + ", " + yr + ((!justDate) ? " " + strTM : "");

                //return strDT;
                return date.toISOString().split("T")[0];

            } else {
                return DT;
            }
        }
    } catch (e) {
        return DT;
    }
}

function fieldDT(DT) {
    DT = DT.trim();
    try {
        var yr = DT.split("-")[0];
        var mo = DT.split("-")[1];
        var da = DT.split("T")[0].split("-")[2];
        var strDT = mo + "/" + da + "/" + yr;

        var date = new Date(strDT);

        if (date instanceof Date && !isNaN(date.valueOf())) {
            strDT = yr + "-" + mo + "-" + da;

            //c_log("is date: " + strDT);
            return strDT;
        } else {
            //c_log("not date");
            return DT;
        }
    } catch (e) {
        //c_log("not date: " + e);
        return DT;
    }
}

function standardDT(DT) {
    c_log(DT);
    var dd = String(DT.getDate()).padStart(2, '0');
    var mm = String(DT.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = DT.getFullYear();

    return yyyy + '-' + mm + '-' + dd;
}

function stringDT(DT) {
    try {
        var mos = (",Jan,Feb,Mar,Apr,May,June,July,Aug,Sept,Oct,Nov,Dec").split(",");
        var yr = DT.split("-")[0];
        var mo = DT.split("-")[1];
        var da = DT.split("T")[0].split("-")[2];
        var strDT = mos[mo * 1] + " " + da + " " + yr;
        return strDT;
    } catch (e) {
        return DT;
    }
}

//converts a server DateTime value (returned as a zoneless UTC string, e.g. "2024-05-01T14:23:00") into
//US Central time (America/Chicago), correctly accounting for the CST/CDT switch, formatted as
//"yyyy-mm-dd hh:mm ampm ct". A value with no time component (a plain "2024-05-01" date) is left as-is —
//there's no time to shift across timezones, and reformatting it risks shifting the date itself.
function convertDTCentral(DT) {
    if (!DT || !/T\d{2}:\d{2}/.test(DT))
        return DT;

    try {
        var iso = (DT.indexOf("Z") > -1 || DT.indexOf("+") > -1) ? DT : DT + "Z"; //treat zoneless input as UTC
        var date = new Date(iso);

        if (!(date instanceof Date) || isNaN(date.valueOf()))
            return DT;

        if (date.getUTCFullYear() == 1900)
            return "";

        var parts = {};
        new Intl.DateTimeFormat("en-US", {
            timeZone: "America/Chicago",
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit", hour12: true
        }).formatToParts(date).forEach(function (p) { parts[p.type] = p.value; });

        var hh = (parts.hour.length < 2) ? "0" + parts.hour : parts.hour;

        return parts.year + "-" + parts.month + "-" + parts.day + " " +
            hh + ":" + parts.minute + " " + parts.dayPeriod.toLowerCase() + " ct";
    } catch (e) {
        return DT;
    }
}

function jparse(vr) {
    try { var x = JSON.parse(vr) } catch (ex) { vr = vr.replace(/&quot;/ig, '"'); c_log("err parsing", vr, ex) };
    //c_log(vr, vr.replace(/&quot;/ig, '"'));
    return JSON.parse(vr);
}
function jstring(js) {
    return JSON.stringify(js);
}

// ============================================================
// SECTION: popup/confirm dialogs (smconfirm/xconfirm/yconfirm), heartbeat keepalive, misc UI toggles
// ============================================================
function smconfirm(msg, ht, tim) {
    var arr = [];
    if (Array.isArray(msg))
        arr = msg;
    else
        arr.push("div|" + msg);

    ht = (ht == null) ? 100 : ht;
    xconfirm(null, arr);
    confirmWindow.style.height = ht + "px";
    xconfirmOK.style.display = "none";

    if (tim != null)
        setTimeout(function (vr) { xconfirm(); }, tim);
}

function xconfirm(msg, elems, funcname, dontblur) {
    var prnt = confirmWindow.parentElement;
    prnt.removeChild(confirmWindow);
    xsection(prnt, ["div|class=confirmWindow|id=confirmWindow|style=z-index: 2700; display:none"]);
    xsection(confirmWindow, ["div|id=confirmWindow_hdr"]);

    var main = document.getElementById("confirmWindow");
    main.style.zIndex = 4000;
    //dragElement(main);

    //main.innerHTML = "";
    main.style.display = "";
    main.style.width = "600px";
    main.style.height = "450px";

    xsection(main, ["div|id=confirmWindowInner|style=height:400px; overflow-y:auto"]);
    main = confirmWindowInner;

    if (msg != null || elems != null) {
        if (!dontblur) {
            document.getElementById("PageContainer").style.opacity = ".3";
            document.getElementById("optWindow").style.opacity = ".6";
        }

        if (msg != null) {
            main.appendChild(dyn("div", "innerHTML=" + msg.replace("---", "\\n")));
        }
        else {
            nsection("confirmWindowInner", elems);
        }

        //bottom buttons
        var inner = dyn("div", "style=position:absolute; bottom:5px;");
        confirmWindow.appendChild(inner);
        inner.appendChild(dyn("div", "id=confirmFooter"));

        if (funcname == "xconfirm()" || funcname == null) {
            //only one option ... window is purely informational
            confirmFooter.appendChild(dyn("label", "style=padding-right:10px",
                dyn("button", "id=xconfirmOK|class=blueButton|onclick=xconfirm()|innerHTML=OK")
            ));
            xconfirmOK.focus();
        } else if (funcname == "cancel") {
            //only one option ... window is purely informational
            confirmFooter.appendChild(dyn("label", "style=padding-right:10px",
                dyn("button", "id=xconfirmOK|class=blueButton|onclick=xconfirm()|innerHTML=Cancel")
            ));
            xconfirmOK.focus();
        } else {
            //provides option other than cancel ... window requires confirmation
            confirmFooter.appendChild(dyn("label", "style=padding-right:10px",
                dyn("button", "id=xconfirmCancel|class=blueButton|onclick=xconfirm()|innerHTML=Cancel")
            ));
            confirmFooter.appendChild(dyn("label", "style=padding-right:10px",
                dyn("button", "id=xconfirmContinue|class=blueButton|onclick=" + funcname + "|innerHTML=Continue")
            ));
            xconfirmCancel.focus();
        }
    } else {
        document.getElementById("PageContainer").style.opacity = "1";
        document.getElementById("optWindow").style.opacity = "1";
        confirmWindow.style.display = "none";
    }

}


function yconfirm(msg, elems, funcname) {
    var main = document.getElementById("confirmWindow2");
    main.style.zIndex = 5000;

    main.innerHTML = "";
    main.style.display = "";
    main.style.width = "40%";
    main.style.height = "150px";
    main.style.zIndex = "6000";

    xsection(main, ["div|id=confirmWindow2_Inner|style=border:solid 0px red; height:110px;overflow-y:auto"]);
    main = document.getElementById("confirmWindow2_Inner");

    if (msg != null || elems != null) {
        if (msg != null) {
            main.appendChild(dyn("div", "innerHTML=" + msg.replace("---", "\\n")));
        }
        else {
            nsection(main.id, elems);
        }
        //c_log(msg);

        //bottom buttons
        var inner = dyn("div", "style=position:absolute; bottom:5px;");
        confirmWindow2.appendChild(inner);
        inner.appendChild(dyn("div", "id=confirmFooter2"));

        if (funcname == "yconfirm()" || funcname == null) {
            //only one option ... window is purely informational
            confirmFooter2.appendChild(dyn("label", "style=padding-right:10px",
                dyn("button", "id=xconfirmOK2|class=blueButton|onclick=yconfirm()|innerHTML=OK")
            ));
            xconfirmOK2.focus();
        } else if (funcname == "cancel") {
            //only one option ... window is purely informational
            confirmFooter2.appendChild(dyn("label", "style=padding-right:10px",
                dyn("button", "id=xconfirmOK2|class=blueButton|onclick=yconfirm()|innerHTML=Cancel")
            ));
            xconfirmOK2.focus();
        } else {
            //provides option other than cancel ... window requires confirmation
            confirmFooter.appendChild(dyn("label", "style=padding-right:10px",
                dyn("button", "id=xconfirmCancel2|class=blueButton|onclick=yconfirm()|innerHTML=Cancel")
            ));
            confirmFooter.appendChild(dyn("label", "style=padding-right:10px",
                dyn("button", "id=xconfirmContinue2|class=blueButton|onclick=" + funcname + "|innerHTML=Continue")
            ));
            xconfirmCancel2.focus();
        }
    } else {
        confirmWindow2.style.display = "none";
    }

}

function Options(main) {
}

var msgDelivered = false;
function heartbeat() {
    if (sectionTitle != "Login" && sectionTable != "Validate") {
        getData("#heartbeat", null, function (vr) {
            console.log(vr);
            if (vr == "Heartbeat flatlined") {
                ////alert("flatlined");
                window.location.href = "/Login";
            }
        }, null, "noload");
    } else {
        console.log("Heartbeat flatlined");
    }
}
function waffle_mouseover() {
    var main = document.getElementById("waffleIcon");
    main.innerHTML = "";
    main.appendChild(dyn("img", "src=waffleGold.png"));
}
function waffle_mouseout() {
    var main = document.getElementById("waffleIcon");
    main.innerHTML = "";
    main.appendChild(dyn("img", "src=waffle.png"));
}

// ============================================================
// SECTION: print-a-div helpers (note: xprintDiv is defined twice in this file — see the second
// definition further down, which silently wins; printDiv in between is a third, differently-named variant)
// ============================================================
/* UNUSED — this is the first of two `function xprintDiv` declarations in this file. JS function
   declarations with the same name silently overwrite each other, so this one is permanently shadowed
   by the second xprintDiv further below and can never run.
function xprintDiv(divName, preFunc, postFunc) {
    if (preFunc != null) { preFunc(); }
    var exclude = document.getElementsByClassName("excludePrint");
    var exlcudeDisplay = [];
    for (var i = 0; i < exclude.length; i++) {
        exlcudeDisplay.push(exclude[i].style.display);
        exclude[i].style.display = "none";
    }

    var overflow = document.getElementById(divName).style.overflowY;
    document.getElementById(divName).style.overflowY = "";

    var printContents = document.getElementById(divName).innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;

    document.getElementById(divName).style.overflowY = overflow;
    for (var i = 0; i < exclude.length; i++) {
        exclude[i].style.display = exlcudeDisplay[i];
    }

    if (postFunc != null) { postFunc(); }

}
*/

function printDiv(divName, preFunc, postFunc) {
    if (preFunc != null) { preFunc(); }

    PageContainer.style.display = "none";
    tdMainNav.style.display = "none";

    document.body.appendChild(dyn("div", "id=printMe"));
    document.getElementById("printMe").innerHTML = document.getElementById(divName).innerHTML;
    document.getElementById("printMe").style.width = "100%";

    var exclude = document.getElementsByClassName("excludePrint");
    var exlcudeDisplay = [];
    for (var i = 0; i < exclude.length; i++) {
        exlcudeDisplay.push(exclude[i].style.display);
        exclude[i].style.display = "none";
    }

    var func = function (elms, w) {
        for (var i = 0; i < elms.length; i++) {
            elms[i].style.overflowY = "hidden";
            elms[i].style.height = "";
            elms[i].style.width = "";
        }
    }
    func(document.getElementById("printMe").getElementsByTagName("div", true));
    func(document.getElementById("printMe").getElementsByTagName("td"), true);
    func(document.getElementById("printMe").getElementsByTagName("label", true));

    window.print();
    //exportHTML2PDF("printMe", "CMSNEO_PrintOut.pdf");

    document.body.removeChild(document.getElementById("printMe"));
    PageContainer.style.display = "";

    for (var i = 0; i < exclude.length; i++) {
        exclude[i].style.display = exlcudeDisplay[i];
    }

    if (postFunc != null) { postFunc(); }

}

function xprintDiv(divName, preFunc, postFunc) {
    if (preFunc != null) { preFunc(); }

    var tags = document.getElementsByTagName("div");
    var tagsStyle = [];
    for (var i = 0; i < tags.length; i++) {
        if (tags[i].style.overflowY == "scroll") {
            //c_log(tags[i].id);
            tagsStyle.push({ tag: tags[i].id, height: tags[i].style.height });
            tags[i].style.height = "100%";
            tags[i].style.overFlowY = "hidden";
        }
    }


    var exclude = document.getElementsByClassName("excludePrint");
    var exlcudeDisplay = [];
    for (var i = 0; i < exclude.length; i++) {
        exlcudeDisplay.push(exclude[i].style.display);
        exclude[i].style.display = "none";
    }

    var printContents = document.getElementById(divName).innerHTML;
    var originalContents = document.body.innerHTML;

    window.print();

    for (var i = 0; i < exclude.length; i++) {
        exclude[i].style.display = exlcudeDisplay[i];
    }

    for (var i = 0; i < tagsStyle.length; i++) {
        //c_log(tagsStyle);
        document.getElementById(tagsStyle[i]["tag"]).style.height = tagsStyle[i]["height"];
        document.getElementById(tagsStyle[i]["tag"]).style.overflowY = "scroll";
    }

    if (postFunc != null) { //
        postFunc();
    }
}

function logout() {
    getData("#Logout", null, function (vr) { c_log(vr); });
}
function showHideMaiNav() {
    if (sectionTitle != "Login") {
        tdMainNav.style.display = (tdMainNav.style.display == 'none') ? '' : 'none';
        tdMainHidNav.style.display = (tdMainNav.style.display == 'none') ? '' : 'none';
    }
}

//compliance and management nav
function selectedNavOpts(x) {
    var navOpts = document.getElementsByName("navOpts");
    for (var i = 0; i < navOpts.length; i++) {
        navOpts[i].style.borderLeft = "0px";
    }
    navOpts[x].style.borderLeft = "solid 2px lightblue";
}

//DIRECT TO LOCATION
function loc(pg) {
    if (pg.indexOf("DownloadFullIAReport") == -1) {
        var x = window.location.href;
        xconfirm("Loading \"" + pg + "\" ...");
        confirmWindow.style.height = "100px";
        xconfirmOK.style.display = "none";
    } else {
        xconfirm("Your report will begin downloading in a moment ...");
        confirmWindow.style.height = "100px";
        xconfirmOK.style.display = "none";
        setTimeout(function () { xconfirm(); }, 3000);
    }

    sessionStorage.setItem("jsLoc", jstring({ Location: pg }));
    //window.location.href = pg;
    //xconfirm();

    //windowLoad(pg);
    window.location.href = pg;
    xconfirm();
}

/* UNUSED — first of two `function DMHistory` declarations in this file; permanently shadowed by
   the second DMHistory further below (same name, JS function declarations overwrite each other).
function DMHistory() {
    var js = jparse(sessionStorage.getItem("jsLoc"))

    var rtn = [];
    if (js != null) {
        for (var i = 0; i < js.length; i++) {
            "div|Navigated to: " + js[i].Location;
        }
    } else {
        rtn = ["div|class=sm pad10|There is no stored history on this browser"]
    }
    return rtn;
}
*/

function extLoc(pg) {
    window.open("https://" + pg);
}

//Dynamic set
function joinDyn(outer, arrDyns) {
    for (var i = 0; i < arrDyns.length; i++) {
        var main = (i == 0) ? outer : arrDyns[i - 1];
        main.appendChild(arrDyns[i]);
    }
}

//DYNAMIC TEXT ELEMENT
function dynT(txt) {
    var xx = document.createTextNode(txt);
    return xx;
}

//SECONDARY DYNAMIC ELEMENTS
function dyn2(type, attStr) {
    try {
        var xx = document.createElement(type);

        if (attStr != null) {
            var arr = attStr.split("|");
            for (var i = 0; i < arr.length; i++) {
                var att = arr[i].split("=");
                if (att[0] == "innerHTML") {
                    xx.innerHTML = att[1].replace(/\\/g, "|");
                } else if (type == "img" && att[0] == "src") {
                    xx.setAttribute("src", "../images/" + att[1]);
                } else {
                    att[1] = att[1].replace(/~/g, "=");
                    xx.setAttribute(att[0], att[1]);
                }
            }
        }
    } catch (e) {
        //c_log("dyn error: type=" + type + ", attStr=" + attStr + " : e=" + e);
    }

    return xx;
}
//DYNAMIC ELEMENTS
function dyn(type, attStr, appnd) {
    if (type.indexOf("|") > 0) {
        appnd = attStr;
        attStr = type.substring(type.indexOf("|") + 1, type.length);
        type = type.split("|")[0];
        //c_log("dynstr = " + type + ", " + attStr + ", " + ((appnd == null) ? "null" : appnd));
    }

    try {
        if (type == "date") {
            type = "input";
            attStr = attStr + "|type=date";
        }

        var xx = document.createElement(type);
        if (type == "input" && attStr.indexOf("autocomplete") == -1) {
            xx.setAttribute("autocomplete", "off");
        }
        var icon = "", btn = "", iAttr = "", iHTML = "", iid = "", iClass = "", xClass = "", iSize = "", iiSize = "", iBorder = "", iClick = "", id = "", iStyle = "", options = [], righted = false;

        //c_log("HERE HERE HERE", type, attStr);

        if (attStr != null) {
            var arr = attStr.split("|");
            for (var i = 0; i < arr.length; i++) {
                var att = arr[i].split("=");
                if (att.length == 1) {
                    //if (att.substring(0) == ">") {
                    //    att = att.substring(1);
                    //    xx.setAttribute("align", right);
                    //}
                    att = ("innerHTML=" + arr[i]).split("=");
                }
                att[1] = att[1].replace(/\/\//g, "|");

                if (att[0] == "innerHTML") {
                    iHTML = att[1].replace(/\\/g, "|").replace(/&nbsp;/g, " ");
                    iHTML = (iHTML == "_") ? "&nbsp;" : iHTML;
                } else if (att[0] == "ihtml") {
                    iHTML = att[1].replace(/\\/g, "|").replace(/&nbsp;/g, " ");
                } else if (att[0] == "icon") {
                    icon = att[1];
                } else if (att[0] == "btn") {
                    btn = att[1];
                    icon = att[1];
                } else if (att[0] == "class") {
                    xClass = att[1];
                } else if (att[0] == "options") {
                    options = att[1].split("^");
                    //c_log(options);
                    for (var dd = 0; dd < options.length; dd++) {
                        var ddOpt = document.createElement("option");
                        ddOpt.setAttribute("value", options[dd]);
                        ddOpt.innerHTML = options[dd];
                        xx.appendChild(ddOpt);
                    }
                    //c_log("finished loading options");
                } else if (att[0] == "isize") {
                    iSize = att[1];
                } else if (att[0] == "iisize") {
                    iSize = att[1]; iiSize = att[1];
                } else if (att[0] == "iborder") {
                    iBorder = att[1];
                } else if (att[0] == "iclick") {
                    iClick = att[1];
                } else if (att[0] == "iid") {
                    iid = att[1];
                } else if (att[0] == "iclass") {
                    iClass = att[1];
                } else if (att[0] == "iAttr") {
                    iAttr = att[1];
                } else if (type == "img" && att[0] == "src") {
                    xx.setAttribute("src", "../images/" + att[1]);
                } else if (att[0] == "id") {
                    att[1] = att[1].replace(/~/g, "=").replace(/`/g, "'");
                    id = att[1];
                    xx.setAttribute(att[0], att[1]);
                } else {
                    att[1] = att[1].replace(/~/g, "=").replace(/`/g, "'");
                    xx.setAttribute(att[0], att[1]);
                }

                //one off
                if (att[0] == "istyle") {
                    iStyle = att[1];
                }
            }
        }
    } catch (e) {
        //c_log("dyn error: type=" + type + ", attStr=" + attStr + " : e=" + e);
    }

    if (xClass != "" && icon == "") { xx.setAttribute("class", xClass); }

    if (type == "textarea" && iHTML != "") {
        xx.innerHTML = iHTML;
    } else if (icon == "" && iHTML != "") {
        var xhtml = document.createElement("L");
        xhtml.innerHTML = iHTML;
        xx.appendChild(xhtml);
    } else if (icon == "") {
        xx.appendChild(dynT(iHTML));
    } else if (btn != "") {
        //c_log("btn activated");
        //c_log(type, attStr);
        iSize = (iiSize == "") ? ((iSize == "") ? "20" : "30") : iiSize;

        xx.appendChild(dyn2("img",
            ((iid != "") ? "id=" + iid + "|" : "") +
            ((iClick != "") ? "onclick=" + iClick + "|" : "") +
            ((iClass != "") ? "class=" + iClass + "|" : "class=iBtn|") +
            "style=cursor:pointer;width:" + iSize + "px; height:" + iSize + "px; " +
            ((iBorder != "") ? iBorder + ";" : "") +
            ((iStyle != "") ? iStyle + ";" : "") +
            "padding-right:0px|src=" + btn));
        //xx.appendChild(dyn2(((type == "a") ? "a" : "label"), ((xClass != "") ? "class=" + xClass + "|" : "") +
        //    ((id != "") ? "id=" + id + "_HTML|" : "") +
        //    "style=padding-left:5px;padding-right:5px;" + ((iStyle != "") ? iStyle : "") + "|innerHTML=" + iHTML));
    } else {
        //c_log(icon);
        var img = true;
        if (icon.indexOf(".") == -1) { img = false; }
        //c_log(iClick);

        if (img) {
            iSize = (iiSize == "") ? ((iSize == "") ? "20" : "30") : iiSize;

            xx.appendChild(dyn2("img",
                ((iid != "") ? "id=" + iid + "|" : "") +
                ((iClick != "") ? "onclick=" + iClick + "|" : "") +
                ((iClass != "") ? "class=" + iClass + "|" : "") +
                "style=width:" + iSize + "px; height:" + iSize + "px; " +
                ((iBorder != "") ? iBorder + ";" : "") +
                ((iStyle != "") ? iStyle + ";" : "") +
                "padding-right:0px|src=" + icon));
            xx.appendChild(dyn2(((type == "a") ? "a" : "label"), ((xClass != "") ? "class=" + xClass + "|" : "") +
                ((id != "") ? "id=" + id + "_HTML|" : "") +
                "style=padding-left:5px;padding-right:5px;" + ((iStyle != "") ? iStyle : "") + "|innerHTML=" + iHTML));
        }
        else {
            xx.appendChild(dyn2(icon,
                ((xClass != "") ? "class=" + xClass + "|" : "") +
                ((iClick != "") ? "onclick=" + iClick + "|" : "") +
                ((id != "") ? "id=" + id + "_HTML|" : "") +
                "innerHTML=" + iHTML));
            //c_log(iHTML);
        }
    }

    if (appnd != null) { xx.appendChild(appnd); }

    return xx;
}

// ============================================================
// SECTION: misc JS-array/section-builder utilities (section/arrsection/sectionTable wrap xsection for common layouts)
// ============================================================
function txtRight(txt, ix) {
    return txt.substring(txt - ix);
}

function normalizeJS(js, hdrsIdentitfier, colIdentitifier, keep) {
    var njs = [];
    if (js.length > 0) {
        var hdrs = js[0][hdrsIdentitfier].split("|");

        for (var i = 0; i < js.length; i++) {
            var jo = {};
            for (var ii = 0; ii < hdrs.length; ii++) {
                jo[hdrs[ii]] = js[i][colIdentitifier + (ii + 1)];
            }
            for (var ii = 0; ii < keep.length; ii++) {
                jo[keep[ii]] = js[i][keep[ii]];
            }
            njs.push(jo);
        }
    }
    return njs;
}

function deNullJS(js, isArray) {
    if (!isArray) {
        for (var key in js) {
            //c_log(key, js[key]);
            js[key] = (js[key] == null) ? "" : js[key];
        }
    } else {
        for (var i = 0; i < js.length; i++) {
            for (var key in js[i]) {
                //c_log(key, js[key]);
                js[i][key] = (js[i][key] == null) ? "" : js[i][key];
            }
        }
    }

    return js;
}

function chgIcon(iid, img) {
    //c_log(iid, img);
    document.getElementById(iid).src = "../images/" + img;
}

//CREATE MAIN SECTIONS
function section(container, elems) {
    var main = document.getElementById(container);

    for (var i = 0; i < elems.length; i++) {
        if (elems[i] != "") {
            var arr = elems[i].split("|");
            //type = 1st elem
            var type = arr[0];
            //remove 1st elem from array
            arr.shift();
            //create string from arr
            var elem = arr.join("|");
            ////c_log("29: " + elem);

            var link = dyn(type, elem);
            try { main.appendChild(link); }
            catch (e) {
                c_log("section error:", container, elems);
                c_log(e);
                break;
            }
        }
    }
}
function arrsection(container, elems) {
    var main = document.getElementById(container);
    var link;
    for (var i = 0; i < elems.length; i++) {
        var els = elems[i].split("^");
        var type = [], elem = [];

        for (var x = 0; x < els.length; x++) {
            var arr = els[x].split("|");
            type.push(arr[0]);
            arr.shift();
            elem.push(arr.join("|"));

            link = dyn(type[x], elem[x]);
            main.appendChild(link);
            main = link;
        }
    }
}
//function xsection(container, elems) {
//    var main = container;

//    for (var i = 0; i < elems.length; i++) {
//        var arr = elems[i].split("|");
//        //type = 1st elem
//        var type = arr[0];
//        //remove 1st elem from array
//        arr.shift();
//        //create string from arr
//        var elem = arr.join("|");
//        ////c_log("29: " + elem);

//        var link = dyn(type, elem);
//        main.appendChild(link);

//        return main;
//    }
//}

//CREATE SECTION TABLES
function sectionTable(container, table, tx, txAttr, txAppend, tbAttr) {
    //container for table
    var main = null;
    if (container != "") { main = document.getElementById(container); }

    //get or create table
    var tb = null;
    if (document.getElementById(table) != null) {
        //get
        tb = document.getElementById(table);
    }
    else {
        //create
        tb = dyn("table", "id=" + table);
        if (tbAttr != null) {
            var arr = tbAttr.split("|");
            for (var i = 0; i < arr.length; i++) {
                var att = arr[i].split("=");
                att[1] = att[1].replace(/~/g, "=");
                tb.setAttribute(att[0], att[1]);
            }
        }
    }

    //name TR segment
    if (tx == "tr") {
        txAttr = (txAttr == null) ? "" : txAttr;
        txAttr = "name=" + table + "_TR" + ((txAttr != "") ? "|" : "") + txAttr;
    }

    //build segment
    var sect = dyn(tx);
    if (txAttr != null) {
        txAttr = txAttr.replace(/~/g, "<");

        var arr = txAttr.split("|");
        for (var i = 0; i < arr.length; i++) {
            var att = arr[i].split("=");
            if (att.length == 1) {
                att = ("innerHTML=" + att[0]).split("=");
            }

            if (att[0] == "innerHTML") {
                att[1] = (att[1] == "_") ? "&nbsp;" : att[1];
                sect.innerHTML = att[1];
            } else {
                try {
                    att[1] = att[1].replace(/~/g, "=");
                    sect.setAttribute(att[0], att[1]);
                } catch (ex) { }
            }
            if (txAppend != null) {
                sect.appendChild(txAppend);
            }
        }
    }

    //insert TR or TD
    if (tx == "tr") {
        tb.appendChild(sect);
    } else if (tx == "td") {
        var arrTR = document.getElementsByName(table + "_TR");
        var tr = arrTR[arrTR.length - 1];
        tr.appendChild(sect);
    }

    if (main != null) { main.appendChild(tb); }
}

var jsFileAFNCounts = [];
function FileAFNCounts(FID) {
    var func = function () {
        return jsFileAFNCounts.filter(d => d.FID == FID);
    }

    if (jsFileAFNCounts.length == 0) {
        getData(null, newFormData("_GetFileAFNCounts", {}), function (vr) {
            jsFileAFNCounts = jparse(vr);
            func();
        });
    } else {
        func();
    }
}

function concatJS(json1, json2, id) {
    json1.map(x => Object.assign(x, json2.find(y => y[id] == x[id])));
    return json1;
}

// ============================================================
// SECTION: JS-array sorting, generic AJAX form-data builders, learning-center link
// ============================================================
function sortJS(js, fld, desc) {
    var hold = js;
    var newjs = [];

    for (var i = 0; i < js.length; i++) {
        var jo = js[i];
        jo[fld] = (!jo[fld]) ? "" : jo[fld];

        for (var ii = i + 1; ii < js.length; ii++) {
            var jo2 = js[ii];
            jo2[fld] = (!jo2[fld]) ? "" : jo2[fld];

            if (
                (!desc && jo2[fld].toString().toLowerCase().trim() < jo[fld].toString().toLowerCase().trim()) ||
                (desc && jo2[fld].toString().toLowerCase().trim() > jo[fld].toString().toLowerCase().trim())
            ) {
                var tmp = jo;
                jo = jo2;
                jo2 = tmp;
                js[i] = jo;
                js[ii] = jo2;
            }
        }
    }
    newjs = js;

    return newjs;
}

function xsortJS(objArray, prop, descending) {

    for (var i = 0; i < objArray.length; i++) {
        if (objArray[i][prop] == "") {
            objArray[i][prop] = " ";
        }
    }

    prop = 'attributes.' + prop;
    if (arguments.length < 2) throw new Error("sortJsonArrayByProp requires 2 arguments");
    var direct = (descending != null) ? -1 : 1; //Default to ascending

    if (objArray && objArray.constructor === Array) {
        var propPath = (prop.constructor === Array) ? prop : prop.split(".");

        objArray.sort(function (a, b) {
            for (var p in propPath) {
                if (a[propPath[p]] && b[propPath[p]]) {
                    a = a[propPath[p]];
                    b = b[propPath[p]];
                }
            }
            // convert numeric strings to integers
            a = a.toString();
            aa = aa.toLowerCase();
            b = b.toString();
            bb = bb.toLowerCase();
            a = aa.match(/^\d+$/) ? +a : a;
            b = b.match(/^\d+$/) ? +b : b;
            return ((a < b) ? -1 * direct : ((a > b) ? 1 * direct : 0));
        });
    }

    for (var i = 0; i < objArray.length; i++) {
        if (objArray[i][prop] == " ") {
            objArray[i][prop] = "";
        }
    }
}

function LoadGeneric300(js, type, func) {
    var data = new FormData();
    data.append("strJson", jstring(js));
    data.append("type", type);

    getData("LoadGeneric300", data, func);
}

function newFormData(action, js) {
    var data = new FormData();
    data.append("action", action);
    data.append("strjson", jstring(js));

    // CMSMailbox adaptation (port-by-copy from CMS's global.js): every adHoc-style
    // call must be re-scoped to the message item the viewer was opened for, so the
    // server can re-derive MainID/FormID itself and re-run its own access gates
    // rather than trusting anything the client claims about which record this is.
    if (typeof MBX_CurrentMessageItemId !== "undefined" && MBX_CurrentMessageItemId) {
        data.append("messageItemId", MBX_CurrentMessageItemId);
    }

    return data;
}
function xFormData(js) {
    var data = new FormData();
    for (var key in js) {
        data.append(key, js[key]);
    }

    return data;
}


function openLearningCenter() {
    var data = newFormData("LC_OpenApplication", {});
    getData(null, data, function (vr) {
        var str = "https://cmslearningcenter.azurewebsites.net/?passport=" + jparse(vr)[0]["passport"];
        //c_log(str);
        window.open(str);
    });

}

// ============================================================
// SECTION: ad-hoc email sending, company/network view widget (NetworkView/xNetworkView), Mercury access toggles
// ============================================================
function adHocSendMail(sp, js) {
    //c_log(sp, js);
    var data = newFormData(sp, js);
    getData(null, data, function (vr) {
        js = jparse(vr);
        //c_log(js);
        var msgJS = { msgTo: js[0]["msgTo"], msgSubject: js[0]["msgSubject"], msgBody: js[0]["msgBody"] };
        var data = newFormData("adHocSendMail", msgJS);
        getData("#adHocSendMail", data, function (vr) {
            //c_log(vr);
        });
    })
}

function SendEmailGO(msgTo, msgSubject, msgBody) {
    // //alert("here");
    var msgJS = { msgTo: msgTo, msgSubject: msgSubject, msgBody: msgBody };
    var data = newFormData("adHocSendMail", msgJS);
    getData("#adHocSendMail", data, function (vr) {
        console.log("Sent Email", msgJS);
    });
}



//function NetworkView(main) {
//    getData(null, newFormData("_NetworkNEW", {}), function (vr) {
//        var js = jparse(vr);
//        //sortJS(js, "Companies");

//        xsection(main, ["table|id=main_netview"]);

//        for (var i = 0; i < js.length; i++) {
//            var xCID, xCompany, Tier, isMine, xUID;
//            xCID = js[i].CID;
//            xCompany = js[i].Company;
//            Tier = js[i].Tier;
//            isMine = js[i].isMine;
//            xUID = js[i].UID;
//            var clr = (isMine) ? "green" : (xUID) ? "steelblue" : "black";
//            var xclass = (isMine) ? "" : (xUID) ? "cursor" : "";
//            var xclick = (isMine) ? "" : (xUID) ? "toggleComp(" + xCID + ")" : "";
//            var padleft = (Tier - 1) * 100;
//            xsection(main_netview, ["tr"]);
//            for (var t = 0; t < Tier - 1; t++) {
//                xsection(main_netview, ["td|"]);
//            }
//            xsection(main_netview, ["td|style=color:" + clr + "; font-size:12px; padding-top:10px; xpadding-left:" + padleft + "px|class=" + xclass + "|onclick=" + xclick + "|" + xCompany]);
//        }
//    });
//}

function NetworkView(main) {
    getData(null, newFormData("_GetMyNetwork", {}), function (vr) {
        var mainjs = jparse(vr);
        //sortJS(js, "Companies");

        xsection(main, [
            "div|id=filter_netview|Filter:&nbsp;|||input|id=txtFilterNetView|style=width:calc(100% - 60px)",
            "hr",
            "div|id=main_netview|style=height:calc(100% - 60px); overflow:auto"
        ]);

        var func = function (js) {
            for (var i = 0; i < js.length; i++) {
                var xx = js[i];
                var Togglers = xx.Togglers.split("|");
                var Tiers = xx.Tiers.split("|");
                var xUIDs = xx.UIDs.split("|");
                var xCIDs = xx.CIDs.split("|");
                var xCompanies = xx.Companies.split("|");

                for (var ii = 0; ii < xCIDs.length; ii++) {
                    var Tier = ii + 1;
                    var xUID = (Togglers[ii] * 1 == 1) ? xUIDs[ii] : 0;
                    var xCID = xCIDs[ii];
                    var xCompany = xCompanies[ii];
                    var title = xCompanies.slice(0, Tier).join(" / ");
                    var isMine = (xx.MyCID == xCID) ? true : false;
                    var docid = xCIDs.slice(0, Tier).join("_");

                    if (!document.getElementById("network_" + docid)) {
                        var clr = (isMine) ? "green" : (xUID > 0) ? "steelblue" : "gray";
                        var xclass = (isMine) ? "" : (xUID > 0) ? "cursor" : "";
                        var xclick = (isMine) ? "" : (xUID > 0) ? "toggleComp(" + xCID + ")" : "";
                        var padleft = (Tier - 1) * 100;
                        //xsection(main_netview, ["tr"]);
                        //for (var t = 0; t < Tier - 1; t++) {
                        //    xsection(main_netview, ["td|"]);
                        //}
                        xsection(main_netview, [
                            "div|id=network_" + docid + "|style=color:" + clr + "; font-size:12px; padding-top:10px; padding-left:" + padleft + "px|title=" + title + "|class=" + xclass + "|onclick=" + xclick + "|" +
                            xCompany// + " ... " + xCIDs.join("_") + " ... " + docid
                        ]);
                    }
                }
            }
        }

        func(mainjs);

        txtFilterNetView.addEventListener('keyup', function () {
            var js = mainjs.filter(d => d.Companies.toLowerCase().indexOf(txtFilterNetView.value.toLowerCase()) > -1);
            main_netview.innerHTML = "";
            func(js);
        });

        txtFilterNetView.focus();

        //for (var i = 0; i < js.length; i++) {
        //    var xCID, xCompany, Tier, isMine, xUID;
        //    xCID = js[i].CID;
        //    xCompany = js[i].Company;
        //    Tier = js[i].Tier;
        //    isMine = js[i].isMine;
        //    xUID = js[i].UID;
        //    var clr = (isMine) ? "green" : (xUID) ? "steelblue" : "black";
        //    var xclass = (isMine) ? "" : (xUID) ? "cursor" : "";
        //    var xclick = (isMine) ? "" : (xUID) ? "toggleComp(" + xCID + ")" : "";
        //    var padleft = (Tier - 1) * 100;
        //    xsection(main_netview, ["tr"]);
        //    for (var t = 0; t < Tier - 1; t++) {
        //        xsection(main_netview, ["td|"]);
        //    }
        //    xsection(main_netview, ["td|style=color:" + clr + "; font-size:12px; padding-top:10px; xpadding-left:" + padleft + "px|class=" + xclass + "|onclick=" + xclick + "|" + xCompany]);
        //}
    });
}


function xNetworkView(main) {
    var data = newFormData("GetNetwork", {});
    xsection(main, ["div|class=sm pad10|Please wait while network is loading ..."]);

    getData(null, data, function (vr) {
        console.log(vr);
        main.innerHTML = "";
        var jsMyNetwork = jparse(vr).filter(d => d.tier > 90);
        if (jsMyNetwork[0].requireEmailVerify) {
            xsection(main, [
                "div|class=pad10 shadowSection red|In order to toggle between companies from this account, you must verify your email address." +
                "|||button|class=blueButton floatright|onclick=showOpts('Network View', null, null, true); showOpts('Network View', null, null, true)|Refresh"
            ]);
            OpenNEOMail();
        }

        var arrTreeids = []
        for (var i = 0; i < jsMyNetwork.length; i++) {
            var treeid = jsMyNetwork[i]["treeid"]
            if (arrTreeids.indexOf(treeid) == -1) {
                arrTreeids.push(jsMyNetwork[i]["treeid"]);
            }
        }

        var arrNetlabels = []
        for (var i = 0; i < jsMyNetwork.length; i++) {
            var netLabel = jsMyNetwork[i]["netLabel"].replace(/-/g, "_");
            if (arrNetlabels.indexOf(netLabel) == -1) {
                arrNetlabels.push(jsMyNetwork[i]["netLabel"].replace(/-/g, "_"));
            }
        }

        for (var i = 0; i < arrNetlabels.length; i++) {
            var strNetLabel = arrNetlabels[i];
            main.appendChild(dyn("div", "id=netvw_" + strNetLabel + "|class=vnBunch|style=border:solid 0px black|" + ""));
        }

        for (var i = 0; i < arrTreeids.length; i++) {
            var js = jsMyNetwork.filter(d => d.treeid == arrTreeids[i]);


            for (var ii = 0; ii < js.length && js.length > 1; ii++) {
                var strNetLabel = js[ii]["netLabel"].replace(/-/g, "_");
                var xcid = js[ii]["cid"];
                var xcompany = js[ii]["company"];
                var tier = js[ii]["tier"];
                var treeid = js[ii]["treeid"];
                var isMine = js[ii]["isMine"];
                var toggle = js[ii]["Toggle"];
                var color = (isMine) ? "green" : (toggle) ? "steelblue; cursor:pointer" : "black";
                var click = (toggle) ? "onclick=toggleComp(" + xcid + ")|" : "";

                var mainDV = document.getElementById("netvw_" + strNetLabel);

                var dv = document.getElementById("netvw_" + xcid + "_" + ii + "_" + strNetLabel);
                if (dv == null && mainDV != null) {
                    mainDV.appendChild(dyn("div", "id=netvw_" + xcid + "_" + ii + "_" + strNetLabel +
                        "|style=color:" + color + ";padding-left:" + (ii * 100) + "px|" + click + xcompany));

                    var curClass = mainDV.className;
                    if (curClass == "vnBunch") {
                        mainDV.className = "vnBunch " + xcid;
                    } else {
                        mainDV.className = curClass + "_" + xcid;
                    }

                } else {
                    //c_log(xcid, tier, xcompany, treeid, strNetLabel);
                }
            }
        }

        //get rid of duplicates
        var dvVNBunch = document.getElementsByClassName("vnBunch");
        var bunches = [];
        for (var i = 0; i < dvVNBunch.length; i++) {
            try {
                var cnID = dvVNBunch[i].id;
                var cn = document.getElementById(cnID).className.split(" ");
                if (cn.length > 1) {
                    if (cn[1] != "vnBunch") { bunches.push(cn[1]); }
                }
            } catch (e) {
                //do nothing
            }
        }
        for (var i = 0; i < bunches.length - 1; i++) {
            if (bunches[i + 1].indexOf(bunches[i]) == 0) {
                document.getElementsByClassName(bunches[i])[0].style.display = "none";
            }
        }
        //c_log(bunches);
    });
}

function toggleComp(xcid) {
    var strjson = { xcid: xcid };
    var data = new FormData();
    data.append("strjson", jstring(strjson));
    ////alert(csrfToken.value);
    getData("#toggleLogin", data, function (vr) {
        var arr = vr.split(" ");
        if (arr[0] == "reload") {
            sessionStorage.setItem('UserToken', arr[1]);
            sessionStorage.setItem('csrfToken', arr[2]);
            csrfToken.value = arr[2];
            ////alert(arr[2]);
            windowLoad("Dashboard");
        }
    });
}

function SetMercuryAccess(main) {
    soSubmit.appendChild(dyn("label", "class=blueButton|onclick=SetMercuryAccessGO()|Submit"));

    var data = newFormData("CMS_GetLinkedCompanies", {});
    getData("#adHocMerc", data, function (vr) {
        var js = jparse(vr);

        main.appendChild(dyn("table", "id=tblSetMercAcs|style=width:100%"));
        sectionTable("", "tblSetMercAcs", "tr");
        sectionTable("", "tblSetMercAcs", "td", "class=smhdr");
        sectionTable("", "tblSetMercAcs", "td", "class=smhdr|Mangement Company");
        sectionTable("", "tblSetMercAcs", "td", "class=smhdr|Client / Agency");

        var bgclr = "white";
        for (var i = 0; i < js.length; i++) {
            bgclr = (bgclr == "white") ? "whitesmoke" : "white";
            var clr = (js[i]["NCID"] == 0) ? "maroon;font-weight:bold" : "black";

            sectionTable("", "tblSetMercAcs", "tr", "style=background-color:" + bgclr);
            sectionTable("", "tblSetMercAcs", "td", "id=tdSetMercAcs_" + i + "|style=background-color:" + bgclr);
            sectionTable("", "tblSetMercAcs", "td", "onclick=cbSetMercAcsClick(" + i + ")|style=cursor:pointer;color:" + clr + ";background-color:" + bgclr + "|" + js[i]["ManagementCompany"]);
            sectionTable("", "tblSetMercAcs", "td", "onclick=cbSetMercAcsClick(" + i + ")|style=cursor:pointer;background-color:" + bgclr + "|" + js[i]["ManagedCompany"]);

            section("tdSetMercAcs_" + i, [
                "input|type=checkbox|id=cbSetMercAcs_" + i + "|name=cbSetMercAcs|value=" + js[i]["CID"] + "," + js[i]["NCID"] + "|onclick=cbMultiSelect(event, 'cbSetMercAcs', " + i + ")"
            ]);
            document.getElementsByName("cbSetMercAcs")[i].checked = (js[i]["Linked"]) ? true : false;
        }

    });
}

function cbSetMercAcsClick(i) {
    var x = document.getElementById("cbSetMercAcs_" + i);
    x.checked = (x.checked) ? false : true;
}

function SetMercuryAccessGO() {
    var nc = document.getElementsByName("cbSetMercAcs");
    var cids = [], ncids = [];

    for (var i = 0; i < nc.length; i++) {
        var cid = nc[i].value.split(",")[0];
        var ncid = nc[i].value.split(",")[1];

        if (nc[i].checked) {
            cids.push(cid);
            ncids.push(ncid);
        }
    }

    cids = (cids.length == 0) ? [0] : cids;
    ncids = (ncids.length == 0) ? [0] : ncids;

    var strCIDs = cids.toString().replace(/ /g, "").replace(/,/g, "~");
    var strNCIDs = ncids.toString().replace(/ /g, "").replace(/,/g, "~");

    var data = newFormData("CMS_UpdateLinkedCompanies", { cids: strCIDs, ncids: strNCIDs });
    getData("#adHocMerc", data, function (vr) {
        opts(false);
        showOpts("Set Mercury Access", null, null, true);
        xconfirm("Mercury access settings have been updated");
    })
}


//SECTION FUNCTION FOR CREATING BLOCKS OF DYNAMIC ELEMENTS
// ============================================================
// SECTION: core DOM-builder engine — nsection/xsection append elements built from "type|attr=val|..."
// spec strings (see ndyn below) directly to the live DOM; htmlElem/getElem/writeElem are an older,
// separate string-concatenation-based element builder.
// ============================================================
function nsection(container, elems, vars) {
    var main = document.getElementById(container);
    if (main) {
        for (var i = 0; i < elems.length; i++) {
            if (elems[i] != "") {
                var elem = ndyn(elems[i], vars);
                main.appendChild(elem);
            }
        }
    }
}

function xsection(main, elems, vars) {
    var tmp = main;
    if (typeof tmp != "object") {
        if (vars)
            for (var key in vars) {
                tmp = tmp.replace(new RegExp("@" + key, "g"), vars[key]);
            };


        main = document.getElementById(tmp);
    }

    if (main) {
        for (var i = 0; i < elems.length; i++) {
            if (elems[i] != "") {
                var elem = ndyn(elems[i], vars);
                main.appendChild(elem);
                //try { main.appendChild(elem); } catch (e) { console.log(e, main);}
            }
        }
    }
}


//DYNAMIC FUNCTION FOR CREATING ELEMENTS
function ndyn(strElem, vars) {
    var returnVal, initVal;
    var curElem, appendElem = [];

    if (vars)
        for (var key in vars) {
            strElem = strElem.replace(new RegExp("@" + key, "g"), vars[key]);
        };


    var elems = strElem.split("|||");	///split initial string by "|||"
    for (var e = 0; e < elems.length; e++) {
        var appnd = false;	//defaults that additional elements are appended to the initial element ... else append sets the main element to the previous from here
        var cancAppnd = false; //cancels a previous append statement and resets it to the initial element
        var backAppnd = false; //reverts to previous appendElem value

        var atts = elems[e].split("|");	//split inner elements by "|"

        //set append when specified in the beginning and then remove from element
        if (atts[0] == "append") {
            appnd = true;
            atts.shift();
        }

        //set cancAppend when specified in the beginning and then remove from element
        if (atts[0] == "cancel") {
            cancAppnd = true;
            atts.shift();
        }

        //set backAppend when specified in the beginning and then remove from element
        if (atts[0] == "back") {
            backAppnd = true;
            atts.shift();
        }



        //set type to initial array element
        var type = atts[0];

        //set attributes to remainder of array elements
        atts.shift();

        //attribute ID
        var attID = "";

        //build icon element and use if specified
        var icon = document.createElement("img");
        icon.setAttribute("class", "icon");

        //create element
        //c_log(type, "*" + strElem + "*");
        var elem = document.createElement(type);
        var hasIcon = false;
        var onEvents = [];

        for (var i = 0; i < atts.length; i++) {
            var att = atts[i].split("=");	//separate attribute array by "="
            if (att.length == 1) {		//if no "=", set attribute to "innerHTML"
                att = ["innerHTML", att[0]]
            }

            //set img src to images folder
            if (type == "img" && att[0] == "src") {
                att[1] = imgsFolder + att[1];
            }
            //set img src to images folder
            if (type == "img" && att[0] == "isrc") {
                att[0] = "src";
            }
            if (type == "iframe" && att[0] == "src") {
                att[1] = att[1].replace(/~/g, "=");
            }

            //set icon
            if (att[0] == "icon") {
                hasIcon = true;
                icon.setAttribute("src", imgsFolder + att[1]);
                console.log("err dot", att[1]);

                if (att[1].indexOf("dot-") == 0) {
                    console.log("err dot", att[1].split("-")[1].split(".")[0]);
                    icon = document.createElement("div");
                    icon.setAttribute("style", "display:inline-block; width:8px;height:8px;border-radius:50%;background:" + att[1].split("-")[1].split(".")[0] + ";")
                }
            }

            var dropdownSelected;

            if (att[0] == "id") {
                //set element ID and will apply last
                attID = att[1];
            } else if (att[0] == "innerHTML") {
                //set innerHTML
                //if you want to display a "|", use "//" instead
                //if you want to display a "=", use "~" instead
                att[1] = att[1].replace(/\/\//g, "|").replace(/~/g, "=");
                elem.innerHTML = att[1];
            } else if (att[0] == "placeholder") {
                //set innerHTML
                //if you want to display a "|", use "//" instead
                //if you want to display a "=", use "~" instead
                att[1] = att[1].replace(/\/\//g, "|").replace(/~/g, "=");
                elem.setAttribute("placeholder", att[1]);
            } else if (att[0].indexOf("on") == 0) {
                //set on... events with use of "=" by using "~" instead
                att[1] = att[1].replace(/~/g, "=");

                if (hasIcon) {
                    onEvents.push([att[0], att[1]]);
                } else {
                    elem.setAttribute(att[0], att[1]);
                }
            } else if (att[0] == "serversrc") {
                elem.setAttribute("src", "https://devcmsneo.azurewebsites.net/images/" + att[1]);
            } else {
                //set attribute
                if (att[0].split("icon.").length > 1) {
                    //set attribute for icon when specified
                    att[0] = att[0].split(".")[1];
                    icon.setAttribute(att[0], att[1]);

                } else if (att[0].split("both.").length > 1) {
                    //set attribute for icon and elem when specified
                    att[0] = att[0].split(".")[1];
                    icon.setAttribute(att[0], att[1]);
                    elem.setAttribute(att[0], att[1]);

                } else if (att[0] == "selected" && type == "select") {
                    dropdownSelected = att[1];

                } else if (att[0] == "options") {
                    //append options for dropdowns
                    var opts = att[1].split("~");
                    for (var ii = 0; ii < opts.length; ii++) {
                        //allow for value and innerHTML
                        var opt = opts[ii].split("^");
                        if (opt.length == 1) {
                            opt.push(opt[0]);
                        }
                        var optElem = document.createElement("option")
                        optElem.setAttribute("value", opt[0]);
                        optElem.innerHTML = opt[1];
                        if (dropdownSelected == opt[0]) {
                            optElem.setAttribute("selected", "true");
                        }
                        elem.appendChild(optElem);
                    }

                } else if (att[0] == "dloptions") {
                    //append options for input datalists
                    var opts = att[1].split("~");
                    for (var ii = 0; ii < opts.length; ii++) {
                        //allow for value and innerHTML
                        var opt = opts[ii].split("^");
                        if (opt.length == 1) {
                            opt.push(opt[0]);
                        }
                        var optElem = document.createElement("option")
                        optElem.setAttribute("data-customvalue", opt[0]);
                        optElem.setAttribute("value", opt[1]);
                        elem.appendChild(optElem);
                    }

                } else {
                    //set attribute to element when icon not specified
                    //c_log(att);
                    elem.setAttribute(att[0], att[1])
                }
            }
        }

        //set elem id
        if (attID != "") {
            //set elem id
            elem.setAttribute("id", attID);
        }

        var main;
        if (!hasIcon) {
            main = elem;
        } else {
            main = document.createElement("elem");
            if (onEvents.length > 0) {
                main.setAttribute("style", "cursor:pointer");
                for (var oe = 0; oe < onEvents.length; oe++) {
                    main.setAttribute(onEvents[oe][0], onEvents[oe][1]);
                }
            }
            if (attID != "") {
                //set ids for main and icon
                main.setAttribute("id", attID + "_elem");
                icon.setAttribute("id", attID + "_icon");
                //elem id already set
            }
            main.appendChild(icon);
            main.appendChild(elem);
        }


        //set returnVal either to main when first of array
        //or append for additional elements
        if (returnVal == null) {//first time through ...returnval and initval have not been set
            returnVal = main; //This cannot change because everything goes inside of it and it is the one that we return
            initVal = main;
            appendElem = [main];
        } else {
            if (appnd) {
                appendElem.push(curElem);
            } if (cancAppnd) {
                appendElem = [initVal];
            } if (backAppnd) {
                var mvBack = appendElem.slice(0, -1);
                appendElem = mvBack;
            }

            appendElem[appendElem.length - 1].appendChild(main);
        }

        //set current element
        curElem = main;
        var arr = [];
        for (var z = 0; z < appendElem.length; z++) {
            arr.push(appendElem[z].id);
        }
        //c_log("append:" + appnd, "back:" + backAppnd, "cancel:" + cancAppnd, arr);
    }

    return returnVal;
}


function htmlElem(type, att, elem) {
    var jo = {};
    if (typeof type != "object") {
        jo.type = type;
        jo.str = "<" + type + ">";
        jo.atts = [];
        jo.text = "";
        jo.strend = "";
        if (["input", "br", "select", "img"].indexOf(type) == -1)
            jo.strend = "</" + type + ">";

        jo.elem = jo.str + jo.text + jo.strend;

        return jo;
    }
    else {
        jo = type;
        var atts = jo.atts;

        if (att) {
            var iarr = att.split("|");
            for (var x = 0; x < iarr.length; x++) {
                var arr = iarr[x].split("=");
                if (arr.length == 1)
                    jo.text = iarr[x].replace(/~/g, "=").replace(/\/\//g, "|");
                else {
                    arr[1] = "\"" + arr[1] + "\"";
                    atts.push(arr.join("="));
                    jo.atts = atts;
                }
            }
        }

        if (elem)
            jo.text = elem.join("");

        jo.str = "<" + jo.type + " " + jo.atts.join(" ") + ">";
        jo.elem = jo.str + jo.text + jo.strend;

        type = jo;
    }
}

function getElem(type, atts, elem) {
    var xx = htmlElem(type);
    htmlElem(xx, atts, elem);
    return xx;
}
function writeElem(elem) {
    if (!elem.length)
        return elem.elem;
    else {
        var arr = [];
        for (var i = 0; i < elem.length; i++) {
            arr.push(elem[i].elem);
        }
        return arr.join("");
    }

}




// ============================================================
// SECTION: PDF export, DocuSign send/rename/manage-file-options, email alerts, document search
// ============================================================
function exportPDFDoc(divName, pdfDoc, header, footer, filename) {
    pdfDoc = (pdfDoc == null) ? "iPDF" : pdfDoc;
    filename = (filename == null) ? "ExportPDF" : filename;
    pdfDoc = (pdfDoc == "PDF") ? "iPDF" : pdfDoc;

    var HTML = document.getElementById(divName).innerHTML;

    windowLoad("Build" + pdfDoc, {
        HTML: HTML,
        filename: filename,
        header: header,
        footer: footer
    }, true);
}








function NeoSignRequest(fid, rid) {
    var data = newFormData("sendRequestPDF", { FID: fid, RID: rid });

    getData("DSActions", data, function (vr) {
        var js = jparse(vr);
        c_log(js);
        if (js == null) {
            xconfirm("Error: This document could not be sent for signatures");
        } else {
            xconfirm(null, [
                "div|The signature request has been sent.",
                "br",
                "div|Please check your email for instructions on signing this file."
            ], "NeoSignRequest_Signed(" + rid + ")");
            xconfirmCancel.parentElement.removeChild(xconfirmCancel);
            xconfirmOK.focus();
        }
    });
}
function NeoSignRequest_Signed(rid) {
    //closeDisputeFileViewer(rid);
    ViewRequest(rid);
}

function NeoSignFile(fid, filename, go) {
    console.log("NeoSignFile");
    if (!go) {
        getData(null, newFormData("_GetSigners", {}), function (vr) {
            NEO_Signers = jparse(vr);
            NEO_SignersSelected = [];

            var elems = [
                "div|class=smhdr|Request signatures on doc [" + filename + "]",
                "div|class=sm padLeft10|Select signers in the order you would like them to sign the document",
                "hr",
                "div|id=divNeoSigners|style=height:160px;overflow-y:scroll",
                "hr",
                "div|id=divNeoSignersSelected|style=height:120px;overflow-y:scroll"
            ];

            xconfirm(null, elems, "NeoSignFile(" + fid + ",'" + filename + "',true)");
            document.getElementById("optWindow").style.opacity = "1";

            for (var i = 0; i < NEO_Signers.length; i++) {
                section("divNeoSigners", [
                    "label|class=alink padLeft5 dim|onclick=NeoSignFileSelectSigners(" + i + ")|" + NEO_Signers[i]["Name"] + " [" + NEO_Signers[i]["Email"] + "]",
                    "br"
                ]);
            }
        });
    } else {
        xconfirm();
        if (NEO_SignersSelected.length > 0) {
            var data = newFormData("send", { FID: fid, Signers: NEO_SignersSelected });

            getData("DSActions", data, function (vr) {
                var js = jparse(vr);
                var err = false;
                if (js == null) {
                    xconfirm("Error: This document could not be sent for signatures");
                } else {
                    xconfirm("Signature Request Sent");
                    RunMultiSP("_GetCacheFiles,_GetFolderMapFiles", [{}, {}], function (js) {
                        jsOFiles = js[0].filter(d => d.fileIsMine);
                        jsFolderMapFiles = js[1];
                        LoadFiles("folder");
                        clrSubmit();
                        PopUp('File Options');
                    })
                }
            });
        } else {
            xconfirm("You have not selected any signers yet.")
        }
    }
}

function NeoSignFileSelectSigners(ix) {
    divNeoSignersSelected.innerHTML = "";
    var xx = NEO_SignersSelected.findIndex(d => d.Email == NEO_Signers[ix]["Email"]);
    if (xx == -1) {
        NEO_SignersSelected.push(NEO_Signers[ix]);
    } else {
        NEO_SignersSelected.splice(xx, 1);
    }
    for (var i = 0; i < NEO_SignersSelected.length; i++) {
        section("divNeoSignersSelected", ["label|class=pad5 dim|" + NEO_SignersSelected[i]["Name"], "label|style=width:10px|"]);
    }
}

function NeoRenameFile(e, fid, DM) {
    if (e.keyCode == 13) {
        manageFileOptions(fid, "rename", DM);
    }
}

//code:20240524:104pm - code to remove dupes from arrays
function removeDupesFromArray(arr) {
    var newarr = [];
    for (var i = 0; i < arr.length; i++) {
        if (newarr.indexOf(arr[i]) == -1)
            newarr.push(arr[i]);
    }
    return newarr;
}

function manageFileOptions(dat, opt, DM) {
    if (opt == "rename") {
        closeDropMenu();
        var rname = (DM) ? DM_txtNeoFileoptionsRename : txtNeoFileoptionsRename;
        smconfirm("Please wait while the file is being renamed ...", 100);
        console.log("err rename file", "_RenameFile", { fid: dat, filename: rname.value });
        getData(null, newFormData("_RenameFile", { fid: dat, filename: rname.value }), function (vr) {
            SendEmailAlert("File:has been renamed", dat);

            //code:20240523 101pm - fix for file rename
            console.log(vr);
            var filename = jparse(vr)[0]["Filename"];

            //update file explorer
            var elems = document.getElementsByClassName("cbBMF_File_" + dat);
            for (var i = 0; i < elems.length; i++) { elems[i].innerHTML = filename };

            //update js
            for (var i = 0; i < jsOFiles.length; i++) {
                if (jsOFiles[i]["FID"] == dat) {
                    jsOFiles[i]["FileName"] = filename;
                }
            }

            //if file viewer is open, change filename
            try { document.getElementById("fileViewer_" + dat + "_hdrTitle").innerHTML = filename; } catch (ex) { }

            xconfirm();
            closePopUp("Rename Dm File");
            renewPopUp('File Options');
        });
    }
    else if (opt == "setremediation") {
        xconfirm(null, [
            "div|class=smhdr|Enter a \"Name\" for this event:",
            "br",
            "input|id=txtEventName|style=width:100%"
        ], "manageFileOptions('" + dat + "','setremediationGO')");

    } else if (opt == "setremediationGO") {
        try {
            //closePopUps();
            closeDropMenu();
            closeFileViewer(dat);
            closePopUp("File Options");
            closePopUp("Dynamic Record Options");
        } catch (e) {
            console.log(e);
        }

        var eventname = txtEventName.value;

        smconfirm("Please wait while the event is loading ...", 100);

        getData(null, newFormData("_CreateFileRemediation", { fid: dat, name: eventname }), function (vr) {
            SendEmailAlert("File:has had a remediation set", eventid);

            smconfirm("Event loaded.  Please wait for the File to be updated.", 100);
            var eventid = jparse(vr)[0]["EventID"];

            getData(null, newFormData("_GetFiles8", { dontDisplay: 0, fid: dat }), function (vr) {
                xconfirm();
                ////alert("here");
                xjsOFiles = jparse(vr);
                console.log(2274, jsOFiles);
                selectMainWindow('Event', eventid);
            });
        });
    } else if (opt == "openremediation") {
        //code:240327:445p-JK
        EventFilter = dat[0];
        closeDropMenu();
        closeFileViewer(dat[0]);
        closePopUp("File Options");
        closePopUp("Dynamic Record Options");

        if (dat[1] == "Multiple") {
            selectMainWindow('Event');
        } else {
            selectMainWindow('Event', dat[1]);
        }
    }
}

function SendEmailAlert(Type, ItemID, xCID) {
    console.log("SendEmailAlert", Type, ItemID);
    getData(null, newFormData("_GetEmailAlert", { Type: Type, ItemID: ItemID, xCID: xCID }), function (vr) {
        var js = jparse(vr).filter(d => d.Active);
        console.log("SendEmailAlert", js);
        if (js.length > 0) {
            var xx = js[0];
            var Subject = xx.Subject;
            var Message = xx.Message;

            var msgBcc = [];
            for (var i = 0; i < js.length; i++) { msgBcc.push(js[i].Email); }

            var jo = {
                msgTo: msgBcc.join(";"),
                msgSubject: Subject,
                msgBody: Message
            };

            var data = new FormData();
            data.append("strjson", jstring(jo));

            console.log("SendEmailAlert", jo);
            getData("#adHocsendMail", data, function (vr) { console.log("SendEmailAlert", vr); }, null, true);
        }
    }, null, true);
}
function searchDoc_onkeyup(e, mgt) {
    var js = [];
    var go = false;
    console.log(jsFolders);
    console.log(FolderMaps);

    var srch = txtSearchDocuments.value.toLowerCase().replace(/ /g, "");
    if (srch != "") {
        js = jsOFiles;

        //code:240327:209p-JK
        try {
            if (ByFolderByCompany == 1 && xcid != null && xcid != 0) {
                js = jsOFiles.filter(d => [myCID, xcid].indexOf(d.FileCID) > -1);
            }
        } catch (ex) { }

        js = js.filter(d => d.FileName != null).filter(d =>
            d.FileName.toLowerCase().indexOf(srch) > -1 ||
            (d.StatusColor.toLowerCase() == "red" && srch == "alert") ||
            (d.StatusColor.toLowerCase() == "yellow" && srch == "warning") ||
            d.Folder.toLowerCase().indexOf(srch) > -1 ||
            d.Company.toLowerCase().indexOf(srch) == 0
        );
        if (js.length > 0) { go = true; }
    }

    if (!go) {
        var x = document.getElementById("divDocSearchResults");
        if (x != null) { x.parentElement.removeChild(x) }
    } else {
        var x = document.getElementById("divDocSearchResults");
        if (x == null) {
            nsection("ContentWindow", [//code:20240619:318pm apply z-index to search box so it covers search input
                "div|id=divDocSearchResults|class=shadowSection|style=z-index:3000; border:solid 2px black;position:absolute; top:240px; left:20%; height:400px; width:600px; background-color:white" +
                "|||div|id=divDocSearchResults_hdr|class=shadowSection smhdr|Document Search Results" +
                "" + "|||append|button|class=blueButton padRight10|style=float:right|onclick=divDocSearchResults.parentElement.removeChild(divDocSearchResults); searchDoc_showhide()|Close" +
                "|||back|div|id=divDocSearchResults_contents|class=pad10|style=height:360px;"
            ]);
            dragElement(divDocSearchResults);
        }
        var xx = [];
        for (var i = 0; i < js.length; i++) {
            if (xx.filter(d => d.FID == js[i]["FID"]).length == 0) {
                if (jsFolders.filter(d => d.FdrID == js[i].FdrID).length > 0) {
                    var map = FolderMaps.filter(d => d.FdrID == js[i].FdrID);
                    if (map.length > 0) {
                        js[i].Folder = map[0].Map;
                    }
                }
                //js[i].Folder = map;
                js[i].Exp_Date = js[i].ExpDT;
                xx.push(js[i]);
            }
        }

        var dfields = ["Company", "Folder", "FileName", "Exp_Date"];
        //getGChartTable(xx, dfields, divDocSearchResults_contents, [{ Func: "showDocResult", Cols: [0], Params: ["FID"] }], null, null, null, true);
        getGChartTable(xx, dfields, divDocSearchResults_contents, [{ Func: "tmpLoadFile", Cols: [0], Params: ["FID", "FileName", "Type"] }], null, null, null, true);
    }
}

// ============================================================
// SECTION: notification tray (bell icon dropdown, mark read/remove), app launch routing
// ============================================================
function tmpLoadFile(FID, Filename, Type) {
    reportLoadFiles(FID, Filename, Type);
}


function toggleNotificationTray(ev) {
    if (!showingNotificationsList) {
        showNotificationsList();
        bell_notification_btn.style.backgroundColor = "white";
    } else {
        hideNotificationsList();
        bell_notification_btn.style.backgroundColor = "";
    }
    showingNotificationsList = (showingNotificationsList) ? false : true;
}

function showNotificationsList() {
    getData(null, newFormData("_ViewNotifications", {}), function (vr) {

        try {
            nsection("main_container_top_nav_dropdown", [
                "div|id=preview_list|style=background-color:white;overflow-y:auto"
            ]);

            if (notificationsList.length > 0) {
                nsection("preview_list", [
                    "a|style=color:red; cursor:pointer; font-size:10px; float:right; padding-right:10px|onclick=removeAllFromNotifications()|Remove All Notifications"
                ]);

                console.log(2313, notificationsList);
                for (var i = 0; i < notificationsList.length; i++) {
                    let idToString = notificationsList[i].id.toString();

                    //add notifications for applications...
                    var ftn = (notificationsList[i].Type == "Mail") ?
                        "OpenNEOMail()" :
                        (notificationsList[i].Type == "Applications" && notificationsList[i].isMine) ?
                            "LaunchApplication('Documents','Application," + notificationsList[i].TypeID2 + "')" :
                            (notificationsList[i].Type == "Folders" && notificationsList[i].isMine) ?
                                "loc('FormSend?Page~Documents&Launch~File:" + notificationsList[i].TypeID + "')" :
                                (notificationsList[i].Type == "Folders" && !notificationsList[i].isMine) ?
                                    "loc('FormSend?Page~Documents&Launch~File:" + notificationsList[i].TypeID + "')" :
                                    (notificationsList[i].Type == "Applications" && !notificationsList[i].isMine) ?
                                        "LaunchApplication('Documents','Application," + notificationsList[i].TypeID + "," + notificationsList[i].TypeID2 + "')" :
                                        (notificationsList[i].Type == "App Signer" && notificationsList[i].isMine) ?
                                            "PopUp('Manage Company Signers', null, null, null, ['400px','900px'])" :
                                            (notificationsList[i].Type == "App Signer" && !notificationsList[i].isMine) ?
                                                "xconfirm('" + notificationsList[i].alertMsg + "')" :
                                                (notificationsList[i].Type == "Addtl Info") ?
                                                    "LaunchApplication('InteractiveForm','" + notificationsList[i].TypeID2 + "'," + notificationsList[i].TypeID + ")" :
                                                    (notificationsList[i].Type == "Form Applications") ?
                                                        "LaunchApplication('InteractiveForm','" + notificationsList[i].TypeID2 + "'," + notificationsList[i].TypeID + ")" :
                                                        (notificationsList[i].Type == "Form Applications") ?
                                                            "LaunchApplication('InteractiveForm','" + notificationsList[i].TypeID2 + "'," + notificationsList[i].TypeID + ")" :
                                                            (notificationsList[i].Type == "Dynamic") ?
                                                                "reportLoadFiles(" + notificationsList[i].TypeID + ",'" + notificationsList[i].TypeID2 + "','Dynamic'))" :
                                                                "";


                    nsection("preview_list", [
                        "div|id=notification_sect_" + i + "|class=xnotification_preview notification_preview_line|style=cursor:pointer" +
                        // "|||" + "div|"
                        "|||" + "div|class=xprofile_pic" +
                        "|||" + "div|class=xnotification_preview_text|id=notification_preview_text_" + idToString + "|style=width:100%;" +
                        "|||" + "div|class=xnotification_preview_text_actions|id=notification_preview_text_actions_" + i
                    ]);

                    var firstLine = notificationsList[i].Details.split('\n')[0];
                    var firstLine = notificationsList[i].Details.split('<br>')[0];
                    var lastViewed = (notificationsList[i].Date_Last_Viewed == null) ? "" : " - Last viewed: " + convertDT(notificationsList[i].Date_Last_Viewed);

                    var isNew = (!notificationsList[i].DisplayedActive) ? true : false;

                    // c_log("firstLine ", firstLine)
                    var remFtn = (notificationsList[i].canRemove) ? "removeFromNotifications(" + i + "," + notificationsList[i].TypeID + ",'" + notificationsList[i].TypeID2 + "')" : "";

                    //set to table 20250716:1140am - jk
                    nsection("notification_preview_text_" + idToString, ["table|id=notification_preview_textBox_" + idToString]);
                    nsection("notification_preview_textBox_" + idToString, [
                        "td|class=" + ((remFtn != "") ? "redx" : "sm") + "|onclick=" + remFtn + "| x",
                        "td|class=navlinkLeft|onclick=" + ftn +
                        "" + "|||label|style=font-weight: bold; color:" + ((isNew) ? "red" : "black") +
                        "" + "" + "| " + notificationsList[i].Title +
                        "" + "|||br" +
                        "" + "|||label| " + firstLine +
                        "" + ((lastViewed != "") ?
                            "div|class=xnotification_preview_text|" + lastViewed :
                            ""
                        )
                    ]);

                    if (seenNotificationsIDs.includes(idToString)) {
                        document.getElementById("notification_preview_check_" + idToString).checked = true;
                    }
                }
            } else {
                nsection("preview_list", [
                    "div|class=empty_preview_list" +
                    "|||p|class=pad10 sm|No new notifications"
                ]);
            }

        } catch (e) {
            console.error("error ", e)
        }
    });
}

function removeFromNotifications(ix, TypeID, TypeID2) {
    preview_list.removeChild(document.getElementById("notification_sect_" + ix));

    getData(null, newFormData("_RemoveNotifications", { TypeID: TypeID, TypeID2: TypeID2 }), function (vr) {
        notificationsList = notificationsList.filter(d => (d.TypeID != TypeID && TypeID != 0) || (d.TypeID2 != TypeID2 && TypeID2 != ""));
        var newcnt = notificationsList.length;
        notificationCnt.innerHTML = newcnt;
    })
}
function removeAllFromNotifications(go) {
    if (!go) {
        xconfirm("Are you sure you want to remove all notifications?", null, "removeAllFromNotifications(true)");
    } else {
        xconfirm();
        hideNotificationsList();
        getData(null, newFormData("_RemoveAllNotifications", {}), function (vr) {
            notificationsList = [];
            notificationCnt.innerHTML = "";
        });
    }
}
function hideNotificationsList() {
    main_container_top_nav_dropdown.innerHTML = "";
}

function LaunchApplication(loc, launch, launchID) {
    launchID = (!launchID) ? 0 : launchID;

    xconfirm("Loading " + ((["Documents", "Management"].indexOf(loc) != -1) ? "\"" + loc + "\"" : "\"Form Application\"") + " ...");
    confirmWindow.style.height = "100px";
    xconfirmOK.style.display = "none";

    windowLoad(loc, {
        launch: launch,
        MainID: launchID
    });
}


function ftnIsDate(strDate) {
    var actualDate = new Date(strDate);
    return (actualDate instanceof Date && !isNaN(actualDate.valueOf())) ? true : false
}

// ============================================================
// SECTION: export helpers (HTML→PDF, JS-array→Excel, Google Chart export), misc string/array/number utilities
// ============================================================
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}


function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left,
        top: rect.top
    };
}

function exportHTML2PDF(container, filename, excludes) {
    excludes = (excludes == null) ? "" : excludes;
    var arrExcludes = excludes.split(",");
    if (arrExcludes[0] != "") { for (var i = 0; i < arrExcludes.length; i++) { document.getElementById(arrExcludes[i]).style.display = "none"; } }

    var html = document.getElementById(container).innerHTML;

    var data = new FormData();
    data.append("HTML", html);
    data.append("filename", filename);

    getData("storeHTML", data, function (vr) {
        windowLoad("ExportHTML2PDF", null, true);
    });

    if (arrExcludes[0] != "") { for (var i = 0; i < arrExcludes.length; i++) { document.getElementById(arrExcludes[i]).style.display = ""; } }
}

//code:20240522:814am - colStyles
function ftnExportJS(exportJS, filename, colStyles) {
    jsExportGChart = exportJS;
    jsExportGChart_ColStyles = colStyles;

    ExportGChart(filename);
}

function ExportGChart(filename, cols) {
    var js = jsExportGChart;
    var newjs = [];
    if (cols == null) {
        cols = [];
        for (var key in js[0]) {
            cols.push(key);
        }
    }
    if (cols != null) {
        for (var i = 0; i < js.length; i++) {
            var row = js[i];
            var jo = {};
            for (var ii = 0; ii < cols.length; ii++) {
                var col = cols[ii];
                jo[col] = (col.toLowerCase().indexOf("date") > -1) ? convertDT(row[col], true) : row[col];
                console.log(jo[col]);
            }
            newjs.push(jo);
        }
    } else {
        newjs = js;
    }

    //code:20240522:814am - colStyles
    ExportJS2Excel(newjs, filename, jsExportGChart_ColStyles);
}


function dbn(nm) { return document.getElementsByName(nm); }
function inputDate(str) {
    str = str.replace(/ /g, "");
    try {
        var dt = new date(str);
        return dt.toISOString().split('T')[0];
    } catch (ex) {
        return str;
    }

    //if (str == null) { dt = new Date() } else { dt = new Date(str); }

    //var strDate = dt.toLocaleDateString('en-US', {
    //    year: 'numeric',
    //    month: '2-digit',
    //    day: '2-digit',
    //});
    //return strDate.split('/')[2] + "-" + strDate.split('/')[0] + "-" + strDate.split('/')[1];
}
function showHideSection(sect) {
    var x = document.getElementById(sect);
    var onoff = (x.style.display == "none") ? "" : "none";
    x.style.display = onoff;

    var btn = document.getElementById("shIcon_" + sect);
    if (btn != null) {
        btn.src = "images/mini-" + ((onoff) ? "down" : "up") + "arrow.png";
    }
}


function showHide(fld) {
    var x = document.getElementById(fld);
    x.style.display = (x.style.display == "") ? "none" : "";
}

//function isdate(dt) {
//    var yr = dt.split("-")[0] * 1;
//    var mo = dt.split("-")[1] * 1;
//    var da = dt.split("-")[2] * 1;

//    //c_log(dt.split("-"), yr, yr > 1900, mo, mo > 0, da, da > 0);
//    var tf = (yr > 1900 && mo > 0 && da > 0) ? true : false;
//    return tf;
//}

function isdate(dt) {
    var date = new Date(dt);
    return (date.toString() == "Invalid Date") ? false : true;
}

function getJSARR(js, fld) {
    var x = [];
    for (var i = 0; i < js.length; i++) {
        x.push(js[i][fld]);
    }
    return x;
}

function prms(arr) {
    var newArr = []
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == null)
            newArr.push("null");
        else if (arr[i] == "null")
            newArr.push("null");
        else if (!isNaN(arr[i]))
            newArr.push(arr[i])
        else
            newArr.push("'" + arr[i] + "'");
    }
    console.log(newArr);
    return newArr;
}

function arr2str(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] != null && isNaN(arr[i])) {
            arr[i] = "'" + arr[i] + "'";
        }
    }
    return arr.join(",");
}

function callFTNwArray(func, arr) {
    window[func](prms(arr));
}


function jprms(js) {
    return jstring(js).replace(/"/g, "'");
}

function getAssignedWizards(FUNC) {
    //getData(null, newFormData("_WizardGetDownstream", {}), function (vr) {
    //    var tmp = jparse(vr);
    //    var js = [];

    //    //STRUCTURE JSON
    //    for (var i = 0; i < tmp.length; i++) {
    //        var xx = tmp[i];
    //        var ix = 0, tix = 0;

    //        //LOAD WIZARD MAIN DETAILS
    //        if (js.filter(d => d.WizardID == xx.WizardID).length == 0) {
    //            js.push({
    //                WizardID: xx.WizardID, WizardName: xx.WizardName, WizardCreatedBy: xx.WizardCreatedBy, WizardCreatedByCompany: xx.WizardCreatedByCompany,
    //                WizardCompanyGroups: [], WizardTasks: [], isGlobalAdmin: xx.isGlobalAdmin
    //            });
    //        }

    //        //SET JS LOCATION
    //        ix = js.findIndex(d => d.WizardID == xx.WizardID)

    //        //LOAD WIZARD COMPANY GROUPS
    //        if (js[ix].WizardCompanyGroups.filter(d => d.GroupID == xx.WizardCompanyGroupID).length == 0) {
    //            js[ix].WizardCompanyGroups.push({ GroupID: xx.WizardCompanyGroupID, GroupName: xx.WizardCompanyGroup });
    //        }

    //        //LOAD WIZARD TASK DETAILS
    //        if (js[ix].WizardTasks.filter(d => d.TaskID == xx.WizardTaskID).length == 0) {
    //            js[ix].WizardTasks.push({
    //                TaskID: xx.WizardTaskID,
    //                Assigned: xx.WizardTaskAssignedToMe,
    //                Type: xx.WizardTaskType,
    //                Instruction: xx.Instruction,
    //                Folder: xx.Folder,
    //                Application: xx.ExamName,
    //                FdrID: xx.FdrID,
    //                AppID: xx.ExamID,
    //                Action: xx.Action,
    //                ActionTakenBy: xx.ActionTakenBy,
    //                Completed: xx.Completed,
    //                Teams: []
    //            });
    //        }

    //        //SET JS TASK LOCATION
    //        tix = js[ix].WizardTasks.findIndex(d => d.TaskID == xx.WizardTaskID);

    //        //LOAD WIZARD TASK TEAMS
    //        if (js[ix].WizardTasks[tix].Teams.filter(d => d.GroupID == xx.WizardTaskTeamGroupID).length == 0) {
    //            js[ix].WizardTasks[tix].Teams.push({ GroupID: xx.WizardTaskTeamGroupID, GroupName: xx.WizardTaskTeamGroup });
    //        }
    //    }

    //    FUNC(js);
    //});
}


//code:20240522:814am - colStyles
//code:20240522:827am - enter filename
var JS2Excel = [], passColStyles, ExportJS2Excel_Func;
function ExportJS2Excel_onkeyup(e) {
    var Filename = document.getElementById("txtExportJSFilename");
    if (e.keyCode == 13 && Filename != "")
        ExportJS2Excel();
}
var excelXconfirmHdr = "";
function ExportJS2Excel(js, FN, colStyles, func) {
    //discard init FN
    var Filename = document.getElementById("txtExportJSFilename");
    let excelHdr = (excelXconfirmHdr == "" || excelXconfirmHdr == null) ? "Save .xlsx File" : excelXconfirmHdr;
    if (!Filename) {
        ExportJS2Excel_Func = func;
        JS2Excel = js;
        passColStyles = colStyles;

        //xconfirm(null, [
        //    "div|class=smhdr|Enter a filename to save file as:",
        //    "br",
        //    "input|id=txtExportJSFilename|style=width:100%|placeholder=ex. Filename_20240501.xlsx|onkeyup=ExportJS2Excel_onkeyup(event)"
        //], "ExportJS2Excel()");
        var elems = [
            // Header
            "div|style=background:rgb(31, 41, 67);padding:10px;height:50px;|class=ua-card-hdr" +
            "|||label|icon=excel.png|icon.style=background:white;height:30px;width:25px;padding:2px;" +
            "|||span|style=color:#FFF;|class=ua-card-title|" + excelHdr,


            "div|style=height:300px;padding:30px;|class=cr-card" +
            "|<b>Enter a filename to save file as:</b><br><br>"+
            "|||input|id=txtExportJSFilename|style=width:100%;padding:10px;border:1px solid #ccc;border-radius:4px;box-sizing:border-box;font-size:14px;|placeholder=ex. Filename_20240501.xlsx|onkeyup=ExportJS2Excel_onkeyup(event)",
            "br"
        ];

        xconfirm(null, elems, "ExportJS2Excel()");
        document.getElementById("xconfirmCancel").className = "ugDeleteBtn";
        document.getElementById("xconfirmContinue").className = "ugSubmitBtn";

        txtExportJSFilename.focus();

    } else {
        FN = Filename.value;

        if (FN != "") {
            xconfirm();

            if (FN.toLowerCase().split(".xlsx").length == 1)
                FN = FN + ".xlsx";



            getData(null, newFormData("_GetCleanFilename", { filename: FN }), function (vr) {
                FN = jparse(vr)[0].Filename;
                var data = new FormData();
                data.append("strJson", jstring(JS2Excel).replace(/ZREMOVE/g, ""));
                data.append("FN", FN);
                data.append("colStyles", passColStyles);

                getData("BuildExportExcel", data, function (vr) {
                    windowOpen("ExportExcel?FN=" + vr);
                    if (ExportJS2Excel_Func)
                        ExportJS2Excel_Func();

                    ExportJS2Excel_Func = null;
                });
            });
        }
    }
}

// ============================================================
// SECTION: export format window, team members, management-exam loading/caching, welcome-upload flow
// ============================================================
function showFormatWindow() {
    var elems = [
        "div|class=pageBreak|style=font-weight:bold|SCOPE OF ENGAGEMENT",
        "br",
        "div|style=font-weight:bold|We were engaged to assess  <Company being Audited>''s familiarity and compliance with the standards established in the CFPB''s Compliance Management Review Manual.  The purpose of this Compliance Management review is to:",
        "br",
        "div|1. Determine the likelihood of risk to a consumer by company''s acts or practices that might be considered Unfair, Deceptive or Abusive. ",
        "div|2.  Determine the adequacy of controls implemented by the company to prevent identified risks.",
        "br",
        "div|Compliance violations may occur through a failure to recognize a risk, an intentional act or as the result of an unintentional consequence of a process.  This review will consider each of these scenarios for the company and its vendors.",
        "br",
        "br",
        "div|class=pageBreak|style=font-weight:bold|Summary of Expectations:",
        "br",
        "div|style=font-weight:bold|The Fundamental Elements of an Effective Compliance Program ",
        "div|1. Implementing written policies, procedures and standards of conduct. ",
        "div|2. Designating a compliance officer and compliance committee. ",
        "div|3. Conducting effective training and education. ",
        "div|4. Developing effective lines of communication. ",
        "div|5. Conducting internal monitoring and auditing. ",
        "div|6. Enforcing standards through well-publicized disciplinary guidelines. ",
        "div|7. Responding promptly to detected offenses and undertaking corrective action. ",
        "br",
        "div|style=font-weight:bold|Practical Tips for Creating A Culture of Compliance ",
        "div|1. Make compliance plans a priority now. ",
        "div|2. Know your fraud and abuse risk areas. ",
        "div|3. Manage your financial relationships.",
        "br",
        "div|class=pageBreak|style=font-weight:bold|RESIDUAL RISK SCALE	",
        "br",
        "div|Each module was evaluated to determine the severity of potential risk, the liklihood of risk, and, where risk existed, the adequacy of controls and their implementation. The final score for an item is a Residual Risk Score and is graded as shown in the chart below:	",
        "br",
        "table|id=scoringDefs",
        "tr",
        "td|Score",
        "td|Meaning",
        "tr",
        "td|style=background-color:red; color:white|40-50: Very High",
        "td|Organization does not exhibit a compliance culture and needs significant changes to ensure proper compliance with consumer protection laws.",
        "tr",
        "td|style=background-color:orange; color:black|30-39:  High",
        "td|Organization needs significant updates to its compliance policies and procedures to ensure proper compliance with consumer protection laws",
        "tr",
        "td|style=background-color:yellow; color:black|20-29: Elevated",
        "td|While technically compliant, organization’s compliance policies and procedures should be upgraded to ensure proper compliance with consumer protection laws",
        "tr",
        "td|style=background-color:lightgreen; color:black|10-19: Moderate",
        "td|Organization has an effective set of compliance policies and procedures designed for compliance with consumer protection laws",
        "tr",
        "td|style=background-color:green; color:white|0-9:  Low",
        "td|Organization demonstrated a strong set of compliance policies and procedures designed for compliance with consumer protection laws",
    ];

    xconfirm(null, elems);
}

function TeamMembers(main) {
    getData(null, newFormData("_DisplayTeamMembers", {}), function (vr) {
        var js = jparse(vr);
        main.style.height = "450px";
        getGChartTable(js, [], main, []);
    })
}

function refreshOFiles() {
    console.log("refreshOFiles");
    RunMultiSP("_GetFiles8,_GetFolderMapFiles,_GetSystemLinks", [{}, {}, {}], function (js) {
        jsOFiles = js[0];
        jsFolderMapFiles = js[1];
        jsGetSystemLink = js[2];
        console.log(jsOFiles);
    }, null, true);
}


var jsLoadMGTExam = [], jsLoadMGTKeys = [];
function LoadMGTExam(go) {
    if (!go) {
        var x = document.getElementById("fileMGTExam");
        if (x != null) { x.parentElement.removeChild(x); }
        xsection(PageContainer, ["input|type=file|id=fileMGTExam|style=display:none|onchange=LoadMGTExam(true)|accept=.xlsx"]);
        fileMGTExam.click();
    } else {
        fileMGTExam.parentElement.removeChild(fileMGTExam);

        var fil = fileMGTExam.files[0];
        var data = new FormData;
        data.append(fil.name, fil);
        getData("NEO_GetDataFromExcel", data, function (vr) {
            jsLoadMGTExam = jparse(vr);
            PopUp("Init Exam");
        });
    }
}

function InitExam(main) {
    PopUpOpt(main, "button|class=blueButton|onclick=LoadMGTExamGO()|Submit");

    var ht = main.clientHeight - 50;
    xsection(main, [
        "div|class=shadowSection|||label|class=padRight10|Exam Name:|||input|style=width:300px|id=loadExamName",
        "div|id=loadExamInner|style=height:" + ht + "px;"
    ]);

    var js = jsLoadMGTExam;
    var keys = [];
    for (var key in js[0]) {
        keys.push(key);
    }

    var en = 0;
    for (var i = 0; i < keys.length; i++) {
        if (keys[i].length == 2) { en = i; break; }
    }
    keys.splice(en, keys.length - en);
    jsLoadMGTKeys = keys;

    c_log(keys, js);
    var newjs = [], mod = "", modnum = "";
    for (var i = 0; i < js.length; i++) {
        var x = js[i];
        var jo = {};

        if (x[keys[0]] == null || x[keys[0]] == "") { x[keys[0]] = mod; }
        if (x[keys[1]] == null || x[keys[1]] == "") { x[keys[1]] = modnum; }
        mod = x[keys[0]];
        modnum = x[keys[1]];

        for (var ii = 0; ii < keys.length; ii++) {
            jo[keys[ii]] = x[keys[ii].replace(/\|/g, " ")];
        }
        newjs.push(jo);
    }

    jsLoadMGTExam = newjs;
    getGChartTable(newjs, [], loadExamInner, []);
}

function LoadMGTExamGO() {
    if (loadExamName.value.trim() != "") {
        var data = new FormData();
        data.append("name", loadExamName.value);
        data.append("strkeys", jsLoadMGTKeys.join("|"));
        data.append("strjson", jstring(jsLoadMGTExam));
        getData("LoadMGTExam", data, function (vr) {
            xconfirm("Data loaded successfully");
        });
    }
}

function uploadWelcome(GO) {
    if (!GO) {
        xsection(PageContainer, ["input|type=file|id=file_welcome|style=display:none|onchange=uploadWelcome(true)"]);
        file_welcome.click();
    } else {
        var file = file_welcome.files[0];
        var data = newFormData("_UploadWELCOME", {});
        data.append(file.name, file);
        getData("#adHocAttach", data, function (vr) {
            xconfirm("Done");
        });
    }
}

// ============================================================
// SECTION: debug logging, DOCX comment loading/adding, client-side cache (deleteCache/resetCache/CompareCache/compareJS)
// ============================================================
function c_log() {
    var ix = clogs.length;
    clogs.push({ ix: ix, log: arguments });

    //if (arguments[0] == "signers") { console.log(myUID, arguments[1]); }
    //console.log(arguments[1]);
}

function getDocXComments(fid) {
    var ht = document.getElementById("fileViewer_" + fid + "_inner").clientHeight;

    var iframe = document.getElementById("iframe_" + fid);
    var iframePs = iframe.contentWindow.document.getElementsByTagName("P");


    for (var i = 0; i < iframePs.length; i++) {
        var p = iframePs[i];
        p.setAttribute("class", "docxParagraph");
        p.style = "cursor:pointer";
        p.tabIndex = i;
        p.title = "Click here to add comments";
        p.setAttribute("onmouseover", "this.style.textDecoration='underline'");
        p.setAttribute("onmouseout", "this.style.textDecoration='none'");
        p.setAttribute("onclick", "parent.PopUp('Add Comments To DocX', [" + fid + "," + i + "])");
        //p.innerHTML = "<a tabindex=" + i + " class=\"docxParagraph\" style=\"color:red; cursor:pointer\" title=\"Click here to add comments\" " +
        //    "onmouseover=\"this.style.textDecoration='underline'\" " +
        //    "onmouseout=\"this.style.textDecoration='none'\" " +
        //    "onclick=\"parent.PopUp('Add Comments To DocX', [" + fid + "," + i + "])\">" + p.innerHTML + "</a>"
    }

    var commContainer = document.getElementById("fileViewer_" + fid + "_comments");
    if (commContainer != null) {
        xsection(commContainer, [
            "div|class=smhdr|Comments", //|||label|class=longblueButton floatright|onclick=PopUp('Add Comments To DocX', [" + fid + "," + 0 + "])|+",
            "div|class=padLeft10 sm|Click a paragraph in the document to add comments to it",
            "hr",
            "div|id=innerfileViewer_" + fid + "_comments|style=height:" + (ht - 90) + "px; overflow-y:scroll"]);

        getData("getDOCXComments", xFormData({ fid: fid }), function (vr) {
            var js = jparse(vr);
            console.log(js);

            if (js.length == 0) {
                nsection("innerfileViewer_" + fid + "_comments", ["div|class=sm pad10|No comments have been added to this file"]);
            } else {
                js = jparse(js[0].JS).filter(d => d.Comment != "");
            }
            console.log(js);

            for (var i = 0; i < js.length; i++) {
                try {
                    var xx = js[i];
                    console.log(xx);
                    var onclick = "iframe_" + fid + ".contentDocument.getElementsByClassName('docxParagraph')[" + xx.PIX + "].focus();";
                    //var onclick = "iframe_" + fid + ".contentDocument.getElementsByClassName('docxParagraph')[" + xx.PIX + "].focus();";
                    var onclick = "console.log(document.getElementById('iframe_" + fid + "').contentWindow.document.getElementsByTagName('P')[" + xx.PIX + "]);" +
                        "document.getElementById('iframe_" + fid + "').contentWindow.document.getElementsByTagName('P')[" + xx.PIX + "].focus(); ";

                    nsection("innerfileViewer_" + fid + "_comments", [
                        ((xx.Resolved) ? "div|class=sm|style=background-color:whitesmoke|border-bottom:solid silver 1px|Resolved" : ""),
                        "div|class=shadowSection cursor|onclick=" + onclick +
                        "|||div|" + xx.Comment +
                        "|||div|class=sm padLeft10|By:" + xx.Author +
                        "|||div|class=sm padLeft10|" + ((xx.Date != "") ? convertDT(xx.Date) : "") //+
                        //"|||div|class=sm padLeft10|Resolved:" + xx.Resolved +
                        //"|||div|class=sm padLeft10|Paragraph:" + xx.Paragraph
                    ]);
                } catch (e) {
                    //console.log(e);
                }
            }
        });
    }
}
function AddCommentsToDocX(main, fidpix, go) {
    var fid = fidpix[0];
    var pix = fidpix[1];

    if (!go) {
        PopUpOpt(main, "button|class=blueButton|onclick=AddCommentsToDocX(null, [" + fidpix.join(",") + "], true)|Submit");

        xsection(main, [
            "textarea|style=height:400px; width:100%|id=txtComments"
        ]);
    } else {
        console.log({ fid: fid, pix: pix, comments: txtComments.value });

        getData("AddComments2DocX", xFormData({ fid: fid, pix: pix, comments: txtComments.value }), function (vr) {
            var js = jparse(vr);
            //xconfirm("Your comment has been added to the document.");
            closePopUp('Add Comments To DocX');

            var filename = jsOFiles.filter(d => d.FID == fid)[0].FileName;
            var type = jsOFiles.filter(d => d.FID == fid)[0].Type;
            reportLoadFiles(fid, filename, type)
        });
    }
}

function deleteCache() {
    getData(null, newFormData("_ResetCacheFull", {}), function (vr) {
        //RunMultiSP("_GetCacheFolders,_GetCacheFiles", [{}, {}], function (js) { }, null, true);
        //resetCache(true, "GetFiles");
    });
}
function resetCache(covert, wo, mgt, func, funcParams) {
    RunMultiSP("_GetCacheFolders,_GetCacheFiles", [{}, {}], function (results, addtl) {
        try {
            jsFolders = results[0];
            jsOFiles = results[1];

            sortJS(jsOFiles, "FileName");
            setFolders(jsFolders);
        } catch (ex) {
            //do nothing
        }
    });
}

function DisplayProdOrDev(HeaderColor) {
    //alert(HeaderColor);
    if (["red", "orange"].indexOf(HeaderColor) > -1) {
        LayoutBanner.style.borderBottom = "solid 2px " + HeaderColor;
        xsection(lblSiteVersion, ["label|class=pad5|style=color:white;background-color:" + HeaderColor + "|" + ((HeaderColor == "red") ? "DEV" : "QA")]);
    }
}

function CompareCache() {
    console.log("Compare Cache", "Getting Current Cache");

    xsection(LayoutBanner, ["label|class=pad10 sm|id=absInfo|style=z-index:4000; position:absolute; top:50px; right:10px"]);
    absInfo.innerHTML = "Getting latest cache ...";

    //RunMultiSP("_GetCacheFolders,_GetCacheFiles", [{}, {}], function (jsBefore) {
    console.log("Compare Cache", "Resetting Cache");
    getData(null, newFormData("_ResetCacheFull", {}), function (vr) {
        console.log("Compare Cache", "Getting New Cache");
        RunMultiSP("_GetCacheFolders,_GetCacheFiles", [{}, {}], function (jsAfter) {
            try {
                var compare1 = (
                    compareJS(
                        jsAfter[0],
                        jsFoldersINIT,
                        ["FdrID"],
                        ["id", "FileCount", "StatusColor", "LinkedFolderIDs", "sortParent", "TeamIDs", "GroupIDs", "Teams"],
                        "_GetCacheFolders"));
                var compare2 = (
                    compareJS(
                        jsAfter[1],
                        jsOFilesINIT,
                        ["FID", "FdrID"],
                        ("NID,Last_Note,Note_Created_By,Note_Shared_With,Date_Note_Created,FileShared,sortParent").split(","),
                        //("FileShared,sortParent").split(","),
                        "_GetCacheFiles"
                    )
                );

                if (!compare1 || !compare2) {
                    console.log("Compare Cache", "Cache Out of Date", compare1, compare2, [jsFolders, jsOFiles], jsAfter);
                    lblResetCache_HTML.style.backgroundColor = "red";
                    lblResetCache_HTML.style.color = "white";
                    absInfo.innerHTML = "Cache is not synched ...";
                    absInfo.style.color = "red";

                } else {
                    console.log("Compare Cache", "Cache Up To Date");
                    absInfo.innerHTML = "Cache is up to date ...";
                    absInfo.style.color = "green";

                }
                //setTimeout(function () { PageContainer.removeChild(absInfo); }, 5000);
            } catch (err) {
                console.log("Compare Cache", err);
            }
        }, null, true);
    }, null, true);
    //}, null, true);
}
function compareJS(js1, js2, uniqueFlds, ignoreKeys, wo) {
    ignoreKeys = (!ignoreKeys) ? [] : ignoreKeys;
    var rtn = true;
    for (var i = 0; i < js1.length; i++) {
        var tmp = js2;
        for (var ix = 0; ix < uniqueFlds.length; ix++) {
            tmp = tmp.filter(d => d[uniqueFlds[ix]] == js1[i][uniqueFlds[ix]]);
            //console.log("compare cache", "init compare pass #" + (ix + 1), tmp.length, uniqueFlds[ix], js1[i][uniqueFlds[ix]], tmp);
        }

        if (tmp.length < 1) {
            rtn = false;
            console.log("compare cache", "record missing", js1[i], "wo:", wo);
            break;
        } else {
            if (jstring(js1[i]) == jstring(tmp[0])) {
                //matched
            } else {
                for (var key in js1[i]) {
                    if (ignoreKeys.indexOf(key) == -1) {
                        if (
                            (js1[i][key] == null && tmp[0][key] == "") ||
                            js1[i][key] == "" && tmp[0][key] == null
                        ) {
                            //do nothing
                        } else if (js1[i][key] != tmp[0][key]) {
                            rtn = false;
                            console.log("compare cache", "elems unequal", key, js1[i][key], js2[ix][key], "wo:", wo); //, js1[i][uniqueID], js1[i].FileName);
                            break;
                        }
                    }
                }
            }
        }
    }
    return rtn;
}
// ============================================================
// SECTION: folder-tree expand/collapse state (open/close persistence, "expand all" for a company)
// ============================================================
function setOpenCloseFolders(js) {
    js = jsFolders;
    console.log(companyDisplays);
    var xcids = jsFolders[0].xCIDs.split(",");
    if (companyDisplays.length == 0) {
        for (var i = 0; i < xcids.length; i++) {
            companyDisplays.push({ xcid: xcids[i], dsp: "none" });
        }
    }
    console.log(companyDisplays);

    if (OpenCloseFolderDisplays == 1) {
        folderDisplays = [];
        for (var i = 0; i < js.length; i++) {
            folderDisplays.push(js[i].FdrID);
        }
        fileDisplays = [];

        for (var i = 0; i < jsOFiles.length; i++) {
            fileDisplays.push(jsOFiles[i].FdrID);
        }

        for (var i = 0; i < companyDisplays.length; i++) {
            companyDisplays[i].dsp = "";
        }


    } else if (OpenCloseFolderDisplays == 2) {
        folderDisplays = [];
        fileDisplays = [];
        for (var i = 0; i < companyDisplays.length; i++) {
            companyDisplays[i].dsp = "none";
        }
    }
    OpenCloseFolderDisplays = 0;
}


//function expandCollapseFolders(ec) {
//    hold_expandCollapseFolders = ec;

//    btnExpandAll.style.display = "none";
//    btnCollapseAll.style.display = "none";
//    if (ec) {
//        btnCollapseAll.style.display = "";
//    } else {
//        btnExpandAll.style.display = "";
//    }

//    //do stuff
//    try {
//        folderDisplays = [];
//        fileDisplays = [];
//        var x = document.getElementsByClassName("showHideAll");
//        for (var i = 0; i < x.length; i++) {
//            var xx = x[i];
//            xx.style.display = (ec) ? "" : "none";

//            var arr = xx.id.split("_");
//            if (ec) {
//                if (arr[1] == "file") {
//                    fileDisplays.push(arr[2] * 1)
//                } else {
//                    folderDisplays.push(arr[1] * 1);
//                }
//            }
//            //console.log("setting display", xx.id, (ec) ? "show" : "hide")
//        }
//    } catch (ex) {
//        console.log(ex);
//        alert("err");
//    }
//}

var FoldersExpanded = { Folder: false, Company: false };
function expandCollapseFolders(ec) {
    const btnExpandAll = document.getElementById("btnExpandAll");
    const btnCollapseAll = document.getElementById("btnCollapseAll");

    var fc = (byFolderCompany == 0) ? "Folder" : "Company";
    FoldersExpanded[fc] = (ec != null) ? ec : FoldersExpanded[fc];
    var expanded = FoldersExpanded[fc];

    btnExpandAll.style.display = (expanded) ? "none" : "";
    btnCollapseAll.style.display = (!expanded) ? "none" : "";

    if (ec != null) {
        //if the bcf ("by company") folder view is on-screen, show the same "please wait" placeholder
        //bcf() uses while it builds the tree, since toggling every section below can be slow on a
        //large tree — deferred one tick so the browser actually paints the message first
        var bcfFoldersEl = document.getElementById("bcfFolders");
        if (bcfFoldersEl) {
            bcfFoldersEl.innerHTML = "";
            xsection(bcfFoldersEl, ["div|id=pleasewait|class=sm pad10|Please wait while the view is building ..."]);
        }

        setTimeout(function () {
            var elems = document.getElementsByClassName("bcfSubfolderSection");
            for (var i = 0; i < elems.length; i++) {
                var dsp = (ec) ? "" : "none";
                elems[i].style.display = dsp;

                bcfDisplays = bcfDisplays.filter(d => d.sect != elems[i].id);
                bcfDisplays.push({ sect: elems[i].id, dsp: dsp });
            }

            if (bcfFoldersEl && document.getElementById("pleasewait"))
                bcfFoldersEl.removeChild(pleasewait);
        }, 50);
    }

}

function xxexpandCollapseFolders(ec) {
    hold_expandCollapseFolders = ec;

    // Handle buttons
    try {
        const btnExpandAll = document.getElementById("btnExpandAll");
        const btnCollapseAll = document.getElementById("btnCollapseAll");
        const btnExpandAllCompany = document.getElementById("btnExpandAllCompany");
        const btnCollapseAllCompany = document.getElementById("btnCollapseAllCompany");

        // Hide all buttons initially
        [btnExpandAll, btnCollapseAll, btnExpandAllCompany, btnCollapseAllCompany].forEach(btn => {
            if (btn) btn.style.display = "none";
        });

        // Show appropriate buttons
        if (ec) {
            if (btnCollapseAll) btnCollapseAll.style.display = "";
            if (btnCollapseAllCompany) btnCollapseAllCompany.style.display = "";
        } else {
            if (btnExpandAll) btnExpandAll.style.display = "";
            if (btnExpandAllCompany) btnExpandAllCompany.style.display = "";
        }
    } catch (ex) {
        console.error("Error handling expand/collapse buttons:", ex);
    }

    // Handle folder view
    try {
        folderDisplays = [];
        fileDisplays = [];
        const elements = document.getElementsByClassName("showHideAll");
        for (let i = 0; i < elements.length; i++) {
            const el = elements[i];
            el.style.display = ec ? "" : "none";
            const [_, type, id] = el.id.split("_");
            if (ec) {
                if (type === "file") {
                    fileDisplays.push(parseInt(id));
                } else {
                    folderDisplays.push(parseInt(id));
                }
            }
        }
    } catch (ex) {
        console.error("Error in folder view expand/collapse:", ex);
    }

    // Handle company view
    try {
        const companyContainers = document.querySelectorAll('[id^="mnCompany_"]');
        const loadPromises = [];

        for (let i = 0; i < companyContainers.length; i++) {
            const container = companyContainers[i];
            const cid = container.id.replace("mnCompany_", "");

            if (ec) {
                container.style.display = "";
                if (container.children.length === 0) {
                    const companyIx = jsDirectories.findIndex(d => d.cid == cid);
                    if (companyIx !== -1) {
                        if (jsDirectories[companyIx]["jsdirectory"] == null) {
                            // Wrap async operation in a Promise
                            loadPromises.push(
                                new Promise(resolve => {
                                    setFileExplorerDocumentView(companyIx, cid, () => {
                                        buildFileExplorerDocumentView(cid);
                                        expandAllCompanyFolders(cid, ec);
                                        resolve();
                                    });
                                })
                            );
                        } else {
                            buildFileExplorerDocumentView(cid);
                            expandAllCompanyFolders(cid, ec);
                        }
                    }
                } else {
                    expandAllCompanyFolders(cid, ec);
                }

                // Update tracking
                const trackIx = companyDisplays.findIndex(d => d.xcid == cid);
                if (trackIx === -1) {
                    companyDisplays.push({ xcid: cid, dsp: "" });
                } else {
                    companyDisplays[trackIx].dsp = "";
                }
            } else {
                container.style.display = "none";
                const trackIx = companyDisplays.findIndex(d => d.xcid == cid);
                if (trackIx === -1) {
                    companyDisplays.push({ xcid: cid, dsp: "none" });
                } else {
                    companyDisplays[trackIx].dsp = "none";
                }
            }
        }

        // Wait for all lazy-loaded content to finish before proceeding
        Promise.all(loadPromises).then(() => {
            console.log("All company content loaded and expanded");
        }).catch(err => {
            console.error("Error loading company content:", err);
        });
    } catch (ex) {
        console.error("Error expanding/collapsing companies:", ex);
    }
}

// Helper function to expand/collapse all folders within a company
function expandAllCompanyFolders(cid, expand) {
    try {
        const folderElements = document.querySelectorAll(`[id^="folder_"][id$="_${cid}"]`);
        for (let i = 0; i < folderElements.length; i++) {
            const folderElement = folderElements[i];
            const fdrid = folderElement.id.split("_")[1];

            if (expand) {
                folderElement.style.display = "";
                const iconElement = document.getElementById(`dropFolder_${fdrid}_${cid}_icon`);
                const fileCountElement = document.getElementById(`folder_${fdrid}_${cid}_fileCnt`);
                const hasFiles = fileCountElement && parseInt(fileCountElement.textContent) > 0;
                if (iconElement) {
                    iconElement.src = hasFiles ? "images/folder-manilla.png" : "images/folder-manilla-empty.png";
                }

                const fileContainer = document.getElementById(`folder_file_${fdrid}_${cid}`);
                if (fileContainer) {
                    fileContainer.style.display = "";
                    if (fileContainer.children.length === 0) {
                        LoadFilesCompany("folder", cid, fdrid);
                    }
                }

                if (!folderDisplays.includes(parseInt(fdrid))) {
                    folderDisplays.push(parseInt(fdrid));
                }
                if (!fileDisplays.includes(parseInt(fdrid))) {
                    fileDisplays.push(parseInt(fdrid));
                }
            } else {
                folderElement.style.display = "none";
                const fileContainer = document.getElementById(`folder_file_${fdrid}_${cid}`);
                if (fileContainer) {
                    fileContainer.style.display = "none";
                }

                const folderIx = folderDisplays.indexOf(parseInt(fdrid));
                if (folderIx !== -1) {
                    folderDisplays.splice(folderIx, 1);
                }
                const fileIx = fileDisplays.indexOf(parseInt(fdrid));
                if (fileIx !== -1) {
                    fileDisplays.splice(fileIx, 1);
                }
            }
        }
    } catch (ex) {
        console.error(`Error in expandAllCompanyFolders for company ${cid}:`, ex);
    }
}

// ============================================================
// SECTION: right-click/dropdown context menus (DropMenu), navigation history, folder file counts
// ============================================================
function DropMenu(e, title, func, params, strCloseFunc) {
    if (e && typeof e.stopPropagation === 'function') {
        e.stopPropagation();
    }
    //get mouse position
    var x = e.clientX - 10;
    var y = e.clientY - 10;

    //get js from function and parameters sent
    js = func(params);

    //close when null
    if (!js) {
        closeDropMenu();
    } else {

        //remove if exists elsewhere
        var cur = document.getElementById("GlobalDropMenu");
        if (cur != null) { closeDropMenu(); }

        //build container
        xsection(PageContainer, [
            "div|id=GlobalDropMenu|class=DropMenu|style=top:" + y + "px; left:" + x + "px;"
        ]);

        //build draggable header
        strCloseFunc = (!strCloseFunc) ? "" : strCloseFunc + "; ";
        xsection(GlobalDropMenu, [
            "div|id=GlobalDropMenu_hdr|class=shadowSection cursor dm-header|" + title +
            "" + "|||label|class=pad5 floatright redlink|style=background:white;font-size:17px;text-align:center;|id=btnCloseDropMenu|onclick=" + strCloseFunc + "closeDropMenu()|x",
            "div|id=GlobalDropMenu_contents|class=pad10"
        ]);
        dragElement(GlobalDropMenu);

        //populate container
        xsection(GlobalDropMenu_contents, js);

        //change position if below deck
        var elemHt = GlobalDropMenu.clientHeight + 20;
        var bodyHt = document.body.scrollHeight;
        if (elemHt + y + 10 > bodyHt) {
            GlobalDropMenu.style.top = (bodyHt - elemHt - 50) + "px";
        }

        //change position if off the right edge of the screen
        var elemWd = GlobalDropMenu.clientWidth + 20;
        if (x + elemWd > window.innerWidth) {
            GlobalDropMenu.style.left = Math.max(10, window.innerWidth - elemWd - 10) + "px";
        }
    }
}

function closeDropMenu() {
    try { PageContainer.removeChild(GlobalDropMenu); } catch (ex) { }
}

function DMHistory() {
    var jsLocString = sessionStorage.getItem("jsLoc");
    console.log(jsLocString);

    var js = JSON.parse(sessionStorage.getItem('actionLog'));
    console.log(js);

    var rtn = [];
    if (js != null) {
        for (var i = 0; i < js.length; i++) {
            switch (js[i].Action) {
                case "Location":
                    rtn.push("div|class=sm pad10 alink|Navigated to: " + js[i].Details);
                    break;
                case "Upload":
                    rtn.push("div|class=sm pad10 alink|Uploaded file: " + js[i].Details);
                    break;
                case "Rename":
                    rtn.push("div|class=sm pad10 alink|Renamed file to: " + js[i].Details);
                    break;
                case "Download":
                    rtn.push("div|class=sm pad10 alink|Downloaded file: " + js[i].Details);
                    break;

                case "DeleteApplication":
                    rtn.push("div|class=sm pad10 alink|Deleted Application formid: " + js[i].Details);
                    break;

                case "SubmitIA":
                    rtn.push("div|class=sm pad10 alink|Submitted Application formid: " + js[i].Details);
                    break;
                case "RenameIAReport":
                    rtn.push("div|class=sm pad10 alink|Renamed IA report to: " + js[i].Details);
                    break;
                case "DeleteFile":
                    rtn.push("div|class=sm pad10 alink|Deleted File: " + js[i].Details);
                    break;
                case "ViewIAForm":
                    rtn.push("div|class=sm pad10 alink|Viewed Interactive Form: " + js[i].Details);
                    break;
                case "ExportReport":
                    rtn.push("div|class=sm pad10 alink|Export report: " + js[i].Details);
                    break;
                case "SearchCriteria":
                    rtn.push("div|class=sm pad10 alink|Search: " + js[i].Details);
                    break;
                default:
                    // Handle the default case if needed
                    break;
            }
        }
    } else {
        rtn = ["div|class=sm pad10|There is no stored history on this browser"]
    }
    return rtn;
}



function storeAction(actionType, details) {
    // Get existing log from sessionStorage or initialize an empty array
    let log = JSON.parse(sessionStorage.getItem('actionLog')) ? JSON.parse(sessionStorage.getItem('actionLog')) : [];


    // Create a new log entry
    const logEntry = {
        timestamp: new Date().toISOString(),
        Action: actionType,
        Details: details,
    };

    // Add the new entry to the log
    log.push(logEntry);

    // Save the updated log back to sessionStorage
    sessionStorage.setItem('actionLog', JSON.stringify(log));
}

/* UNUSED — first of two `function rightString` declarations in this file (different param names,
   same name — JS doesn't overload on that); permanently shadowed by the second rightString further below.
function rightString(str, num) {
    var arr = str.split("").reverse();
    str = "";
    for (var i = 0; i < num; i++) {
        str = str + arr[i];
    }
    var rtn = str.split("").reverse().join("");
    return rtn;
}
*/

function GetFolderCount(FdrID, CID) {
    var js = jsFolderMapFiles;
    //js = jsOFiles;

    console.log(257, jsOFiles, js, FdrID, CID);
    var distFIDs = [];

    if (CID == null) {
        //Our Documents
        if (jsFilters.FileCID.length > 0) {
            js = js.filter(d => jsFilters.FileCID.indexOf(d.FileCID) > -1 && d.FdrID == FdrID);
        } else {
            js = js.filter(d => d.FdrID == FdrID);
        }

    } else {
        //3rd Party Management
        console.log(js);
        try {
            js = js.filter(d =>
                d.FdrID == FdrID &&
                (d.FdrID > 0 || !d.Internal) && (d.FileShared || !d.Internal) &&
                (CID == 0 || d.xCIDs.split(",").indexOf(CID.toString()) > -1) &&
                (
                    d.FileCID == CID
                    || (CID == 0 && d.FileCID != myCID)
                    || (d.FileCID == myCID && d.FileShared)
                )
            );
        } catch (ex) {
            console.log(ex);
        }
    }

    for (var i = 0; i < js.length; i++) {
        if (distFIDs.indexOf(js[i].FID) == -1)
            distFIDs.push(js[i].FID);
    }

    //console.log("GetFolderCount", FdrID, CID, js, distFIDs);
    return distFIDs.length;
}


// ============================================================
// SECTION: scribe (note-taker) management, popout windows, misc UI helpers (class toggling, enter-key, sticky header scroll)
// ============================================================
function popoutUpdateScribes() {
    closePopUp("Update Scribes");

    windowLoad("PopOut", {
        main: "Update Scribes",
        var: "",
        csrf: csrfToken.value
    }, true);
}

function UpdateScribes(main) {
    var ix = main.id.split("_")[1];
    document.getElementById("PopUp_" + ix + "_hdr").style.backgroundColor = "rgb(31, 41, 67)";
    document.getElementById("PopUp_" + ix + "_hdr").style.color = "white";
    document.getElementById("PopUp_" + ix + "_hdr").style.height = "50px";
    document.getElementById("PopUp_" + ix + "_hdr").style.borderRadius = "5px";
    document.getElementById("btnPopUpClose_" + ix).className = "ugCancelBtn excludePrint";
    var func = function () {
        PopUpOpt(main, "button|class=ugSubmitBtn|onclick=UpdateThisScribe(null, '')|New Scribe");

        //if (document.getElementById(main.id.replace("Contents", "PopOut")) == null)
        //    PopUpOpt(main, "button|class=blueButton|onclick=popoutUpdateScribes()|Pop Out");

        getGChartTable(jsHowTo, ["Sort", "Type", "URL"], main, [{ Func: "UpdateThisScribe", Params: ["*null", "ScribeID"], Cols: [0] }]);
    }

    if (jsHowTo.length == 0) {
        getData(null, newFormData("_GetScribes", {}), function (vr) {
            jsHowTo = jparse(vr);
            func();
        });
    } else {
        func();
    }
}

function UpdateThisScribe(main, ScribeID) {
   
    if (main == null) {
        PopUp("Update This Scribe", ScribeID);
    } else {
        console.log(main);
        var ix = main.id.split("_")[1];
        document.getElementById("PopUp_" + ix + "_hdr").style.backgroundColor = "rgb(31, 41, 67)";
        document.getElementById("PopUp_" + ix + "_hdr").style.color = "white";
        document.getElementById("PopUp_" + ix + "_hdr").style.height = "50px";
        document.getElementById("PopUp_" + ix + "_hdr").style.borderRadius = "5px";
        document.getElementById("btnPopUpClose_" + ix).className = "ugCancelBtn excludePrint";


        xsection(main, ["table|id=tblUpdScribe|class=ua-card ua-card-timeout|style=width:100%;height:95%;"]);

        if (ScribeID == "") PopUpOpt(main, "button|class=ugSubmitBtn|onclick=UpdateSingleScribe('" + ScribeID + "')|Add")
        if (ScribeID != "") PopUpOpt(main, "button|class=ugSubmitBtn|onclick=UpdateSingleScribe('" + ScribeID + "')|Update")
        if (ScribeID != "") PopUpOpt(main, "button|class=ugDeleteBtn|onclick=UpdateSingleScribe('" + ScribeID + "', 1)|Delete")

        var js = jsHowTo.filter(d => d.ScribeID == ScribeID);
        var xx = { Sort: 0, Type: "", URL: "" };
        if (js.length > 0) { xx = js[0]; }

        xx.Sort = (isNaN(xx.Sort)) ? 0 : xx.Sort;

        xsection(tblUpdScribe, [
            "tr",
            "td|class=ua-label|style=width:70px|Sort Index:", "td|||input|class=ua-number-input|id=updScribeSort|type=number|style=width:100%|value=" + xx.Sort,
            "tr",
            "td|class=ua-label|Definition:", "td|||input|class=ua-number-input|id=updScribeType|style=width:100%|value=" + xx.Type,
            "tr",
            "td|class=ua-label|URL:", "td|||input|class=ua-number-input|id=updScribeURL|style=width:100%|value=" + xx.URL,
        ]);
       
    }
}

function UpdateSingleScribe(ScribeID, Del, go) {
    Del = (Del == null) ? 0 : 1;
    var js = { Sort: updScribeSort.value, Type: updScribeType.value, URL: updScribeURL.value, ScribeID: ScribeID, del: Del };

    if (Del == 0 || (Del == 1 && go)) {
        xconfirm();
        getData(null, newFormData("_AddEditDelScribes", js), function (vr) {
            jsHowTo = jparse(vr);
            closePopUp("Update This Scribe");
            renewPopUp("Update Scribes");
        });
    } else if (Del == 1 && !go) {
       // xconfirm("Are you sure you want to delete this scribe?", null, "UpdateSingleScribe('" + ScribeID + "',1, true)");

        var elems = [
            // Header
            "div|style=background:rgb(31, 41, 67);padding:10px;height:50px;|class=ua-card-hdr" +
            "|||label|icon=deleteIcon.png|icon.style=background:white;height:30px;width:25px;padding:2px;" +
            "|||span|style=color:#FFF;|class=ua-card-title|Delete Scribe",

            "div|style=height:300px;padding:30px;background:#FAEEDA;|class=cr-card" +
            "|||label|icon=icoAlert_orange.png|icon.style=height:30px;width:25px;padding:2px;" +
            "|||span|style=padding-left:5px;padding-top:5px;|<b>Are you sure you want to delete this scribe?</b>",
            "br"
        ];

        xconfirm(null, elems, "UpdateSingleScribe('" + ScribeID + "',1, true)");
        document.getElementById("xconfirmCancel").className = "ugDeleteBtn";
        document.getElementById("xconfirmContinue").className = "ugSubmitBtn";
    }
}


function xpopout(title, jo) {
    var customWindowIX = jo.type + "_" + jo.fid;
    //alert(customWindowIX);

    //xsection(PageContainer, [
    //    "form|id=popoutForm|action=PopOut|method=post|target=customWindow_" + customWindowIX +
    //    "|||input|type=hidden|name=main|value=" + title +
    //    "|||input|type=hidden|name=var|value=" + jstring(jo) +
    //    "|||input|type=hidden|name=csrf|value=" + csrfToken.value
    //]);
    console.log(jo);

    windowLoad("PopOut", {
        main: title,
        var: jstring(jo),
        csrf: csrfToken.value
    }, true);
}


//code:20240614:125pm
function isDownstream(xCID) {
    var mCID = jsAccessTreeTiers[0].MyCID;
    var rtn = false;
    console.log("isDownstream", mCID, xCID, jsAccessTreeTiers);
    for (var i = 0; i < jsAccessTreeTiers.length; i++) {
        var arr = jsAccessTreeTiers[i].CIDs.split(",");
        if (arr.indexOf(mCID.toString()) < arr.indexOf(xCID.toString())) {
            rtn = true;
            break;
        }
    }
    return rtn;
}


function turnOnOffByClass(xclass, onOff) {
    var classes = document.getElementsByClassName(xclass);
    for (var i = 0; i < classes.length; i++) {
        classes[i].disabled = (onOff == "on") ? false : true;
    }
}

function keyEnter(e, func) {
    if (e.keyCode == 13) {
        func();
    }
}

function scrollHeader(dvmain, dvsticky) {
    var dv = document.getElementById(dvmain);
    var dvs = document.getElementById(dvsticky);

    setTimeout(function () {
        dvs.style.top = dv.scrollTop + "px";
        console.log("sticky", { stickyTop: dvs.style.top, dvmainTop: dvs.scrollTop });
    }, 250);
}

var jsJChart = [];
var jchartSortFunc = [];

// ============================================================
// SECTION: jchart/njchart data-grid widget — a large family of functions building/sorting/filtering/
// resizing a custom scrollable table ("chart") from a JS array, with draggable column headers
// ============================================================
function jchart(js, hdrs, dv, func, onload, sort, sortDesc) {
    try {
        //init
        jsJChart = jsJChart.filter(d => d.dv != dv.id);
        jsJChart.push({ js: js, hdrs: hdrs, dv: dv.id, func: func, onload: onload, sort: sort, sortDesc: sortDesc });

        //define Row Identifier
        var RowIdentifier
        for (var key in js[0]) {
            if (key.indexOf("*") == 0) {
                RowIdentifier = key; //.replace("*", "");
            }
        }

        hdrs = (!hdrs) ? [] : hdrs;
        func = (!func) ? [] : func;

        if (hdrs.length == 0) {
            for (var key in js[0]) {
                hdrs.push(key);
            }
        }

        //init when sort not specified
        //if (!sort) for (var key in js[0]) {
        //    sort = (hdrs.length == 0) ? key : hdrs[0];
        //    sortDesc = null;
        //    break;
        //}
        if (sort)
            js = NewSortJS(js, sort, sortDesc);

        //dv styles
        dv.style.position = "relative";
        dv.style.overflow = "auto";
        dv.innerHTML = "";

        //build main tables
        xsection(dv, [
            "table|id=" + dv.id + "_hdrs|style=position:absolute",
            "div|id=" + dv.id + "_spacer|style=height:50px|&nbsp;",
            "table|id=" + dv.id + "_tbl|style=width:100%;",
        ]);

        //dv vars
        var dvhdrs = document.getElementById(dv.id + "_hdrs");
        var dvspacer = document.getElementById(dv.id + "_spacer");
        var dvtbl = document.getElementById(dv.id + "_tbl");

        //set scroll
        dv.setAttribute("onscroll", dvhdrs.id + ".style.top=" + dv.id + ".scrollTop + 'px'");

        //build lines
        var bgclr = "whitesmoke";
        //loop thru rows
        for (var i = 0; i < js.length; i++) {
            bgclr = (bgclr == "whitesmoke") ? "white" : "whitesmoke";

            //new line plus sorting header
            xsection(dvtbl, ["tr", "td|style=background-color:" + bgclr + "|tabindex=0|class=" + dv.id + "_ix|" + (i + 1)]);


            //loop thru cols
            for (var ci = 0; ci < hdrs.length; ci++) {
                var colIX = ci + 1;
                var key = hdrs[ci];

                //build func parameters
                var Ps = [];
                if (func.length > 0) {
                    for (var ii = 0; ii < func[0].Params.length; ii++) {
                        Ps.push(js[i][func[0].Params[ii]]);
                    }
                }

                //set null to blank
                var ans = (!js[i][key]) ? "" : js[i][key];
                if (ci == 0) console.log("219 first", ans, key, js[i]);

                //add lines to main
                var lineIndex = (!RowIdentifier) ? i : js[i][RowIdentifier];
                try {
                    xsection(dvtbl, [
                        "td|style=background-color:" + bgclr + ";" +
                        "|||div|name=col_" + dv.id + "_" + (i + 1) + "|style=padding-left:15px;|id=" + dvtbl.id + "_" + lineIndex + "_" + colIX + "|" +
                        "class=" + dvtbl.id + "_col_" + (ci) +
                        ((func.length == 0) ? "" :
                            (func[0].Cols.indexOf(0) == -1 && func[0].Cols.indexOf(colIX) == -1) ? "" :
                                " cursor|onclick=" + func[0].Func + "('" + Ps.join(',') + "')") + "|" + ans
                    ]);

                    //document.getElementById(dvtbl.id + "_" + lineIndex + "_" + colIX).innerHTML = ans;

                } catch (ex) {
                    console.log("err 3670", ex);
                }
            }
        }

        //build key headers and get widths
        xsection(dvtbl, ["tr|id=" + dvtbl.id + "_hdrRow"]);
        var hdrRow = document.getElementById(dvtbl.id + "_hdrRow");

        xsection(hdrRow, ["th|class=jchartHdrsOuter|||label|style=visibility:hidden|id=" + dv.id + "_th_ix|"]);

        var widths = [];
        for (var h = 0; h < hdrs.length; h++) {
            var key = hdrs[h];
            xsection(hdrRow, [
                "th|class=jchartHdrsOuter" +
                "|||div|id=" + dvtbl.id + "_hdrRow_" + h + "|class=jchartHdrs cursor|" + key.replace(/_/g, " ")
            ]);

            var wt = document.getElementById(hdrRow.id + "_" + h).clientWidth;
            widths.push(wt);
        }


        //set widths
        var leftHdr = document.getElementById(dv.id + "_th_ix");
        var leftHdrs = document.getElementsByClassName(dv.id + "_ix");
        leftHdr.style.width = leftHdrs[leftHdrs.length - 1].clientWidth + "px";

        console.log("err", widths);
        for (var h = 0; h < hdrs.length; h++) {
            //hdr
            var hdr = document.getElementById(hdrRow.id + "_" + h);
            hdr.style.width = widths[h] + "px";
            //cols
            var cols = document.getElementsByClassName(dvtbl.id + "_col_" + h);
            for (var x = 0; x < cols.length; x++) { cols[x].style.width = widths[h] + "px"; }
        }


        ////move hdrs to tblhdrs
        //dvtbl.removeChild(hdrRow);
        dvhdrs.appendChild(hdrRow);


        //set spacer height
        dvspacer.style.height = (hdrRow.clientHeight + 0) + "px";

        //run onload function
        if (onload != null) onload();
    } catch (err) {
        console.log("JCHART ERROR", err);
    }
}

var jsNJchartFilters = [{ table: "", col: "", arr: [], arrSlctd: [] }];
function FilterColumn(main, dkk) {
    //filterNJchart(main, dkk.dvid, dkk.key, dkk.kix);
}
cbMultiSelect
function filterNJchart_select(e, jsix, cb) {
    var esk = (!e) ? false : e.shiftKey;
    if (!esk) {
        var cb_checked = cb.checked;
        if (cb_checked)
            jsNJchartFilters[jsix].arrSlctd.push(cb.value);
        else {
            var ix = jsNJchartFilters[jsix].arrSlctd.indexOf(cb.value);
            jsNJchartFilters[jsix].arrSlctd.splice(ix, 1);
        }

        var jsTable = jsJChart.filter(d => d.dv == jsNJchartFilters[jsix].table)[0];
        //alert(4113);
        njchart(jsTable.js, jsTable.hdrs, document.getElementById(jsTable.dv), jsTable.func, jsTable.onload, jsTable.sort, jsTable.sortDesc);
    }
}

function filterNJchart(main, dvid, col, kix) {
    //get jsix
    var jsix = jsNJchartFilters.findIndex(d => d.table == dvid && d.col == col);

    //get arr of cols
    var js = jsJChart.filter(d => d.dv == dvid)[0].js;
    var arr = [];
    for (var i = 0; i < js.length; i++) {
        if (arr.indexOf(js[i][col]) == -1)
            arr.push(js[i][col]);
    }
    arr.sort();

    //add or update js
    if (jsix == -1)
        jsNJchartFilters.push({ table: dvid, col: col, arr: arr, arrSlctd: arr })
    else
        jsNJchartFilters[jsix].arr = arr;

    //reset js arr
    jsix = jsNJchartFilters.findIndex(d => d.table == dvid && d.col == col);

    //build elems
    var elems = [];
    for (var i = 0; i < arr.length; i++) {
        elems.push(
            "div|class=navlink" +
            "|||input|type=checkbox|id=cbNJchartFilters_" + i + "|name=cbNJchartFilters|value=" + i +
            "" + "|onclick=cbMultiSelect(event, 'cbNJchartFilters', " + i + ", filterNJchart_select(null, " + jsix + ",this))|value=" + ((arr[i] == "") ? "[ Blank ]" : arr[i]) +
            "|||label|class=padLeft10|for=cbNJchartFilters_" + i + "|" + ((arr[i] == "") ? "[ Blank ]" : arr[i])
        );
    }

    //populate list
    xsection(main, elems);

    //set checked
    var cbs = document.getElementsByName("cbNJchartFilters");
    for (var i = 0; i < cbs.length; i++) {
        var cb = cbs[i];
        cb.checked = (jsNJchartFilters[jsix].arrSlctd.indexOf(arr[i]) > -1) ? true : false;
    }
}

function njChartDragHdrs(njs) {
    var isDragging = false;
    var startX = 0;
    var distance = 0;
    var hasMoved = false; // Add a new flag to track movement
    const clickThreshold = 5;

    //console.log("err draggers", njs.dragger);

    // Step 1: Detect the mouse click and reset state
    njs.dragger.addEventListener('mousedown', (e) => {
        e.preventDefault();
        console.log("dragging");
        isDragging = true;
        hasMoved = false; // Reset the movement flag
        startX = e.clientX; // Get the initial horizontal mouse position
        njs.dragger.style.cursor = 'grabbing';
    });

    // Step 2: Track mouse movement while dragging
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        e.preventDefault();
        distance = e.clientX - startX;
        console.log("err moving", distance);
        // Check if the movement exceeds the threshold
        if (Math.abs(distance) > clickThreshold) {
            hasMoved = true;
        }
    });

    // Step 3: Stop tracking and handle the event
    document.addEventListener('mouseup', () => {
        if (isDragging && hasMoved) {
            isDragging = false;
            njs.dragger.style.cursor = 'grab';

            var hdrwd = njs.sticky.clientWidth;
            njs.wd = distance;

            var xx = njs;
            var wd = njs.nonsticky.parentElement.parentElement.parentElement.clientWidth + distance;
            njs.wd = wd;

            njs.sticky.style.width = wd + "px";
            njs.sticky.parentElement.parentElement.parentElement.style.width = (wd + 10) + "px";

            var wd2 = (wd + 10);
            njs.nonsticky.style.width = wd + "px";
            njs.nonsticky.parentElement.parentElement.parentElement.style.width = (wd = 10) + "px";

            njchart_resetWidths(njs.dv, true);
        }
    });
}


function njchart_scroll(dvid) {
    var dv = document.getElementById(dvid);
    var dvtr = document.getElementById(dvid + "_tbl_hdrRow2");
    //alert(dvtr.style.position);
    setTimeout(function () {
        dvtr.position = "absolute";
        dvtr.style.top = dv.scrollTop + "px";
    }, 100);
}

var jsNJChartDetails = [];
function njchart(js, hdrs, dv, func, onload, sort, sortDesc, sendParams) {
    try {
        //dv styles
        dv.innerHTML = "";
        dv.style.position = "relative";
        dv.style.overflow = "auto";
        dv.style.width = "98%";
        //dv.style.width = (dv.clientWidth - 0) + "px";

        var njIXWD = njchart_wds.filter(d => d.dv == dv);

        console.log("njs", js);
        //initalert
        if (!js) {
            var xx = jsJChart.filter(d => d.dv == dv.id)[0];
            js = xx.js; hdrs = xx.hdrs; func = xx.func; onload = xx.onload; sort = xx.sort; sortDesc = xx.sortDesc;
        } else {
            jsJChart = jsJChart.filter(d => d.dv != dv.id);
            jsJChart.push({ js: js, hdrs: hdrs, dv: dv.id, func: func, onload: onload, sort: sort, sortDesc: sortDesc });
        }
        //console.log("err 4150", dv.id, js, jsJChart);

        if (!sort) {
            getData(null, newFormData("_GetJChartSort", { dvid: dv.id, xtra: currentFormID }), function (vr) {
                var saved = jparse(vr);
                var row = Array.isArray(saved) ? saved[0] : saved;
                if (row && row.SortCol) {
                    sort = row.SortCol;
                    sortDesc = (row.SortDesc && row.SortDesc.trim() != "") ? row.SortDesc : null;

                    // keep jsJChart in sync with actual sort values
                    var jix = jsJChart.findIndex(d => d.dv == dv.id);
                    if (jix > -1) {
                        jsJChart[jix].sort = sort;
                        jsJChart[jix].sortDesc = sortDesc;
                    }
                }
                njchartRender(js, hdrs, dv, func, onload, sort, sortDesc, sendParams);
            });
        } else {
            njchartRender(js, hdrs, dv, func, onload, sort, sortDesc, sendParams);
        }
    } catch (err) {                          // ← njchart's own catch
        console.log("JCHART ERROR", err);
    }
}

function njchartRender(js, hdrs, dv, func, onload, sort, sortDesc, sendParams) {
    console.log(sort, sortDesc);
    var njIXWD = njchart_wds.filter(d => d.dv == dv);
    try {
        //apply filters
        var xjs = js;
        var filters = jsNJchartFilters.filter(d => d.table == dv.id);
        if (filters.length > 0) {
            for (var i = 0; i < filters.length; i++) {
                xjs = xjs.filter(d => filters[i].arrSlctd.indexOf(d[filters[i].col]) > -1);
            }
        }
        js = xjs;

        //define Row Identifier
        var RowIdentifier
        for (var key in js[0]) {
            if (key.indexOf("*") == 0) {
                RowIdentifier = key; //.replace("*", "");
            }
        }

        hdrs = (!hdrs) ? [] : hdrs;
        //func = (!func) ? [] : func;

        if (hdrs.length == 0) {
            for (var key in js[0]) {
                hdrs.push(key);
            }
        }

        if (sort)
            js = NewSortJS(js, sort, sortDesc);


        /************************************************** DIVS *************************************************************************************** */
        xsection(dv, [
            "div|id=dvTbl_" + dv.id + "|style=z-index:400;position:xabsolute; top:0px; left:10px; width:" + (dv.clientWidth) + "px; xheight:" + (dv.clientHeight - 30) + "px; overflow:hidden",
        ]);
        var dvtbl = document.getElementById("dvTbl_" + dv.id);
        var dvtblid = dv.id + "_tbl";


        /************************************************** TABLES *************************************************************************************** */
        xsection(dvtbl, [
            "br",
            "table|id=" + dv.id + "_tblHdr|style=border:solid 0px gray; z-index:100; min-width:" + dvtbl.clientWidth + "px; width:100%; xtable-layout: fixed;",
            "table|id=" + dv.id + "_tbl|style=z-index:100; min-width:" + dvtbl.clientWidth + "px; width:100%; xtable-layout: fixed;"
        ]);
        var tblRptHdr = document.getElementById(dv.id + "_tblHdr");
        var tblRpt = document.getElementById(dv.id + "_tbl");

        //insert column group




        var CGS = ndyn("colgroup");
        var CGN = ndyn("colgroup");
        //console.log("err cols", hdrs);
        for (var i = 0; i < hdrs.length + 1; i++) {
            var val = (i == 0) ? js.length : hdrs[i - 1];
            var elem = ndyn("label|style=font-zixe:12px; visibility:hidden|" + val);
            PageContainer.appendChild(elem);
            var wd = elem.clientWidth;
            PageContainer.removeChild(elem);
            //console.log("err cols ", i, val, wd);
            CGS.appendChild(ndyn("col|id=" + dv.id + "_CGSticky_" + i));
            CGN.appendChild(ndyn("col|id=" + dv.id + "_CGNonSticky_" + i));
        }
        tblRptHdr.appendChild(CGS);
        tblRpt.appendChild(CGN);

        //scroll

        /************************************************** REPORT *************************************************************************************** */
        var arrTR = [], arrMainTD = [];

        //clear to load lines
        arrTR = [getElem("br").elem];

        var CGS = ndyn("colgroup");
        var CGN = ndyn("colgroup");
        //console.log("err cols", hdrs);
        for (var i = 0; i < hdrs.length + 1; i++) {
            var val = (i == 0) ? js.length : hdrs[i - 1];
            var elem = ndyn("label|style=font-zixe:12px; visibility:hidden|" + val);
            PageContainer.appendChild(elem);
            var wd = elem.clientWidth;
            PageContainer.removeChild(elem);
            //console.log("err cols ", i, val, wd);
            CGS.appendChild(ndyn("col|id=" + dv.id + "_CGSticky_" + i));
            CGN.appendChild(ndyn("col|id=" + dv.id + "_CGNonSticky_" + i));
        }
        tblRptHdr.appendChild(CGS);
        tblRpt.appendChild(CGN);

        //scroll

        /************************************************** REPORT *************************************************************************************** */
        var arrTR = [], arrMainTD = [];


        //build lines
        var bgclr = "whitesmoke";
        //loop thru rows
        var incrIX = 0;
        var addLine50 = 0;
        for (var i = 0; i < js.length; i++) {
            bgclr = (bgclr == "whitesmoke") ? "white" : "whitesmoke";

            ////new line plus sorting header
            var details = { style: "", class: "", click: "", value: null };
            if (func)
                details = func(js[i], i, null);

            var minWD = "40px;";

            details = (!details) ? {} : details;
            var arrTD = [], hrTD = [];
            arrTD.push(
                getElem("td",
                    "style=background-color:" + bgclr + "; border:solid 0px gray; min-width:30px;" +
                    ((details.style) ? details.style : "") +
                    ((details.title) ? "|title=" + details.title : "") +
                    ((details.class) ? "|class=" + details.class : "") +
                    ((details.hover) ? "|onmouseover=" + details.hover[0] : "") +
                    ((details.hover) ? "|onmouseout=" + details.hover[1] : "") +
                    ((details.other) ? "|" + details.other : "") +
                    ((details.click) ? "|onclick=" + details.click : "") + "|tabindex=0",
                    [getElem("div", "name=col_" + dv.id + "_" + (i + 1) + "|class=" + dv.id + "_row_" + i + "|style=width:10px|" + bgclr + " " + dv.id + "_ix|" +
                        ((details.value) ? details.value : (i + 1))).elem]
                ).elem);

            //loop thru cols
            for (var ci = 0; ci < hdrs.length; ci++) {
                var colIX = ci + 1;
                var key = hdrs[ci];

                //set null to blank   
                // Regular expression to match the start of an ISO 8601 date string (YYYY-MM-DD followed by 'T')
                const isoDatePattern = /^\d{4}-\d{2}-\d{2}T/;

                var ans = (!js[i][key]) ? "" : js[i][key];
                ans = ans.toString().replace(/\|/g, "//").replace("ZREMOVE", "");

                try {
                    if (typeof ans === 'string' && isoDatePattern.test(ans)) {
                        let dt = new Date(ans);
                        if (dt instanceof Date && !isNaN(dt.getTime())) {
                            ans = ans.split("T")[0];
                        }
                    }
                } catch (ex) {
                    console.log("isodatepattern", ex);
                }


                //add lines to main
                var lineIndex = (!RowIdentifier) ? i : js[i][RowIdentifier];
                try {
                    var nj = njIXWD.filter(d => d.ix == ci);
                    var wd = (nj[0]) ? nj[0].wd + "px" : "";
                    var minWD = "40px";



                    var details;
                    if (func)
                        details = func(js[i], i, key, sendParams);

                    if (details)
                        if (details.value)
                            ans = details.value;

                    details = (!details) ? {} : details;

                    var tdDiv = getElem(
                        "div",
                        "name=col_" + dv.id + "_" + (i + 1) + "|style=display:inline; min-width:" + wd + "; width:" + wd + "; padding-left:0px;|id=" + dvtblid + "_" + lineIndex + "_" + colIX +
                        "|class=" + bgclr + " " + dv.id + "_row_" + (i) + " " + dvtblid + "_col_" + (ci) + "|" + ans,
                    );

                    //console.log("err hdrhtml", document.getElementsByClassName(dv.id + "_sticky")[(ci + 1)].innerHTML);

                    if (details)
                        arrTD.push(getElem("td",
                            "tabindex=0|style=border:solid 0px gray; background-color:" + bgclr + "; min-width:30px; width:" + wd + "; " +
                            ((details.style) ? details.style : "") +
                            ((details.title) ? "|title=" + details.title : "") +
                            ((details.class) ? "|class=" + details.class : "") +
                            ((details.hover) ? "|onmouseover=" + details.hover[0] : "") +
                            ((details.hover) ? "|onmouseout=" + details.hover[1] : "") +
                            ((details.click) ? "|onclick=" + details.click : ""), [tdDiv.elem]).elem);
                    else
                        arrTD.push(getElem("td", "tabindex=0|style=border:solid 0px gray; background-color:" + bgclr, [tdDiv.elem]).elem);

                } catch (ex) {
                    console.log("err 3670", ex);
                }
            }

            arrTR.push(getElem("tr", "style=opacity:1", arrTD).elem);
            incrIX = (i + 1);

            //load in blocks of 50
            if (addLine50 == 50) {
                tblRpt.insertAdjacentHTML("beforeEnd", arrTR.join(""));
                arrTR = [];
                addLine50 = -1;
                //alert("wait");
            }
            addLine50++;
        }
        incrIX++;

        //load last bit
        if (arrTR.length > 0)
            tblRpt.insertAdjacentHTML("beforeEnd", arrTR.join(""));

        arrTR = [];


        /************************************************** HEADERS *************************************************************************************** */

        //alert("resetting njs");
        var brdr = 0;
        var trHdrRow = ndyn("tr|id=" + dv.id + "_tbl_hdrRow2|style=xposition:absolute; top:0px; left:10px; xwidth:" + tblRpt.clientWidth + "px");
        tblRptHdr.appendChild(trHdrRow);

        var trOffset = ndyn("tr|id=" + dv.id + "_tbl_offset|style=visibility:hidden; xwidth:" + tblRpt.clientWidth + "px");
        tblRpt.appendChild(trOffset);

        var elemHdr = ndyn("td|class=jchartHdrsOuter|style=width:35px");

        var elemOffset = ndyn("td|class=jchartHdrsOuter|style=width:35px");

        trHdrRow.appendChild(elemHdr);
        trOffset.appendChild(elemOffset);


        //******************************* BEGIN LOOPING THRU HEADERS *********************************************
        for (var h = 0; h < hdrs.length; h++) {
            var key = hdrs[h];

            //var elem = ndyn("label|style=font-zixe:12px; visibility:hidden|" + key);
            //PageContainer.appendChild(elem);
            //var wd = elem.clientWidth + "px";
            //PageContainer.removeChild(elem);

            var wd = "";

            var njs = njchart_wds.filter(d => d.dv == dv && d.key == key);
            if (njs.length > 0) {
                wd = njs.wd + "px";
                wd2 = (njs.wd + 10) + "px";
            }
            //if (h == 0)
            //    alert(sort);
            var bgClass = "jchartHdrsOuter" + ((key == sort) ? "Sorted" : "");

            elemHdr = ndyn(
                "td|onmouseover=" + dv.id + "_dragger_" + (h + 1) + ".style.visibility~''|onmouseout=" + dv.id + "_dragger_" + (h + 1) + ".style.visibility~'hidden'|" +
                "id=" + dv.id + "_stickyTD_" + (h) + "|class=" + bgClass + "|style=z-index:; position:relative; height:0px; white-space:nowrap;border:solid " + brdr + "px gray;" +
                "|||table|style=width:100%; white-space:none;" +
                "|||append|td|class=padLeft5 cursor|onclick=jchartSort('" + dv.id + "','" + key + "')" +
                "|||append|div|style=width:" + wd + "; overflow:hidden||id=" + dv.id + "_stickyCol_" + (h + 1) + "| " + key.replace(/_/g, " ") +
                "|||back|td|style=width:10px; text-align:right" +
                "|||append|img|id=" + dv.id + "_dragger_" + (h + 1) + "|ondragstart=return false;|src=dragLines.png|class=dragLinesIcon|style=visibility:hidden"
            );

            elemOffset = ndyn(
                "td|id=" + dv.id + "_nonstickyTD_" + (h) + "|class=jchartHdrsOuter|style=z-index:; position:relative; height:0px; white-space:nowrap;border:solid " + brdr + "px gray;" +
                "|||table|style=width:100%; white-space:none;" +
                "|||append|td|class=padLeft5 cursor" +
                "|||append|div|style=width:" + wd + ";|id=" + dv.id + "_nstickyCol_" + (h + 1) + "| " + key.replace(/_/g, " ") +
                "|||back|td|style=width:10px; text-align:right" +
                "|||append|img|src=dragLines.png|class=dragLinesIcon"
            );

            trHdrRow.appendChild(elemHdr);
            trOffset.appendChild(elemOffset);

            //***********************************  SET NJS VALUES AGAIN *****************************************************
            if (njs.length == 0)
                njchart_wds.push({
                    dv: dv,
                    sticky: document.getElementById(dv.id + "_stickyCol_" + (h + 1)),
                    nonsticky: document.getElementById(dv.id + "_nstickyCol_" + (h + 1)),
                    dragger: document.getElementById(dv.id + "_dragger_" + (h + 1)),
                    ix: (h + 1),
                    hdrs: hdrs,
                    key: key,
                    wd: 0,
                    rptLen: js.length
                });
            else {
                njs[0].sticky = document.getElementById(dv.id + "_stickyCol_" + (h + 1));
                njs[0].nonsticky = document.getElementById(dv.id + "_nstickyCol_" + (h + 1));
                njs[0].dragger = document.getElementById(dv.id + "_dragger_" + (h + 1));
            }
        }



        xsection(trHdrRow, ["td|"]);
        xsection(trOffset, ["td|"]);

        //set scroll        
        dv.setAttribute("onscroll", "njchart_scroll('" + dv.id + "')");

        var njs = njchart_wds.filter(d => d.dv == dv && d.dragger);
        for (var h = 0; h < njs.length; h++) {
            try { njChartDragHdrs(njs[h]); } catch (ex) { console.log("err", ex); }
        }




        //reset widths
        for (var i = 0; i < njchart_wds.length; i++) {
            var njs = njchart_wds[i];
            var wd = (njs.wd != 0) ? njs.wd : njs.sticky.clientWidth;

            njs.sticky.style.width = wd + "px";
            njs.sticky.parentElement.parentElement.parentElement.style.width = (wd + 10) + "px";

            var wd2 = (wd + 10);
            njs.nonsticky.style.width = wd + "px";
            njs.nonsticky.parentElement.parentElement.parentElement.style.width = (wd = 10) + "px";
        }

        njchart_resetWidths(dv);


        /************************************************** RUN ONLOAD *************************************************************************************** */
        console.log(onload);

        if (onload != null) onload();


    } catch (err) {
        console.log("JCHART ERROR", err);
    }

}

function njchart_resetWidths(dv, timout) {
    try {
        dv.style.width = "100%";
        dv.style.width = dv.clientWidth + "px"; // (document.body.clientWidth - 250) + "px";

        var dvtbl = document.getElementById("dvTbl_" + dv.id);
        var tblRpt = document.getElementById(dv.id + "_tbl");
        var tblHdr = document.getElementById(dv.id + "_tblHdr");
        var trRpt = document.getElementById(dv.id + "_tbl_hdrRow2");

        var hdrTR = document.getElementById(dv.id + "_tbl_hdrRow2");
        hdrTR.style.position = "";
        hdrTR.style.width = tblRpt.clientWidth + "px";

        var njs = njchart_wds.filter(d => d.dv == dv);
        var rptLen = njs[0].rptLen;

        var initSizing = function () {
            for (var h = 0; h < njs.length; h++) {
                var xx = njs[h];
                //var sticky = document.getElementById(dv.id + "_CGSticky_" + xx.ix);
                //var nsticky = document.getElementById(dv.id + "_CGNonSticky_" + xx.ix);

                //sticky.style.width = nsticky.clientWidth + "px";

                var wd = xx.nonsticky.clientWidth;
                var wd2 = xx.nonsticky.parentElement.clientWidth;
                var wd3 = xx.nonsticky.parentElement.parentElement.clientWidth;
                var wd4 = xx.nonsticky.parentElement.parentElement.parentElement.clientWidth;

                xx.sticky.parentElement.parentElement.parentElement.style.width = wd4 + "px";
                xx.sticky.parentElement.parentElement.style.width = wd3 + "px";
                xx.sticky.parentElement.style.width = wd2 + "px";
                xx.sticky.style.width = wd + "px";



            }
        }

        //if (njs.filter(d => d.wd != 0).length == 0) {
        //    //alert("init")
        //    initSizing();
        //}

        //// njs = njs.filter(d => d.wd != 0);
        //if (njs.length > 0) {
        //    for (var h = 0; h < njs.length; h++) {
        //        var xx = njs[h];

        //        if (xx.wd != 0) {
        //            var wd = xx.nonsticky.parentElement.parentElement.parentElement.clientWidth + xx.wd;

        //            xx.sticky.style.width = wd + "px";
        //            xx.sticky.parentElement.parentElement.parentElement.style.width = (wd + 10) + "px";

        //            var wd2 = (wd + 10);

        //            xx.nonsticky.style.width = wd + "px";
        //            xx.nonsticky.parentElement.parentElement.parentElement.style.width = (wd = 10) + "px";

        //            xx.wd = 0;
        //        }
        //        ////setTimeout(function () { alert(xx.sticky.parentElement.parentElement.parentElement.clientWidth + " ... " + xx.nonsticky.parentElement.parentElement.parentElement.clientWidth); }, 2000);
        //    }           

        //}

        initSizing();

        hdrTR.style.position = "absolute";


        //1st hdr element that keeps being a pain
        var stickyCol = document.getElementById(dv.id + "_CGSticky_0");
        var nstickyCol = document.getElementById(dv.id + "_CGNonSticky_0");

        var elem = ndyn("label|style=visibility:hidden|" + rptLen);
        PageContainer.appendChild(elem);
        var wd = elem.clientWidth;
        PageContainer.removeChild(elem);

        stickyCol.style.width = wd + ".px";
        nstickyCol.style.width = wd + ".px";

        //table lengths
        var fullLength = hdrTR.clientWidth;
        dvtbl.style.width = fullLength + "px";
        tblRpt.style.width = fullLength + "px";


    } catch (ex) {
        console.log("err 46", ex);
    }

}

function isCheckbox(element) {
    return element instanceof HTMLInputElement && element.type === 'checkbox';
}


function jchartSort(dvID, sort) {
    console.log("0000", jsJChart);
    var ix = jsJChart.findIndex(d => d.dv == dvID);

    if (jsJChart[ix].sort == sort) {
        jsJChart[ix].sortDesc = (!jsJChart[ix].sortDesc) ? "desc" : null;

        //if (jsJChart[ix].sort == sort) {
        //      jo.sortDesc = jo.sortDesc === "desc" ? null : "desc";

    } else {
        jsJChart[ix].sort = sort;
        jsJChart[ix].sortDesc = null;
    }

    //alert(jsJChart[ix].sortDesc);

    var jo = jsJChart[ix];
    // jo.dv.innerHTML = "";
    document.getElementById(jo.dv).innerHTML = "";

    // njchart(jo.js, jo.hdrs, document.getElementById(jo.dv), jo.func, jo.onload, jo.sort, jo.sortDesc);

    console.log(760, dvID, sort);

    //STORE SORT DETAILS
    var storeSortIX = jchartSortFunc.findIndex(d => d.dvID == dvID);
    if (storeSortIX == -1)
        jchartSortFunc.push({ dvID: dvID, sort: jo.sort, sortDesc: jo.sortDesc });

    else {
        jchartSortFunc[storeSortIX].sort = jo.sort;
        jchartSortFunc[storeSortIX].sortDesc = jo.sortDesc;
    }

    //getData(null, newFormData("_StoreJChartSort", jchartSortFunc.filter(d => d.dvID == dvID)[0]), function (vr) {
    //    console.log("err", vr);
    //})

    getData(null, newFormData("_StoreJChartSort", {
        dvid: dvID,
        sortcol: jo.sort,
        sortdesc: jo.sortDesc ? jo.sortDesc : "",   // send empty string for null
        xtra: currentFormID
    }), function (vr) {
        var saved = jparse(vr);
        console.log("stored sort", saved, vr);
        njchart(jo.js, jo.hdrs, document.getElementById(jo.dv), jo.func, jo.onload, jo.sort, jo.sortDesc);
    });

}

var ssBkgClrs = [];

function ElemHover(elem, hover, clr) {
    clr = (!clr) ? "lightyellow" : clr;

    if (hover) {
        ssBkgClrs = ssBkgClrs.filter(d => d.elem != elem);
        ssBkgClrs.push({ elem: elem, clr: elem.style.backgroundColor });
        elem.style.backgroundColor = clr;
    } else {
        elem.style.backgroundColor = ssBkgClrs.filter(d => d.elem == elem)[0].clr;
    }
}

function ClassHover(iclass, hover, clr) {
    var elems = document.getElementsByClassName(iclass);
    for (var i = 0; i < elems.length; i++) {
        ElemHover(elems[i], hover, clr)
    }
}


// ============================================================
// SECTION: confirm-dialog resize, generic 300-row data fetch helpers
// ============================================================
function xconfirmResize(ht, wd) {
    if (ht) {
        confirmWindow.style.height = ht + "px";
        confirmWindowInner.style.height = (ht - 50) + "px;"
    }
    if (wd)
        confirmWindow.style.width = wd + "px";

    ////alert(ht + " " + wd);
}

function getGeneric300(js) {
    var njs = [];
    var hdrs = [];
    for (var key in js[0]) {
        if (js[0][key] != null)
            hdrs.push(js[0][key]);
    }
    for (var i = 1; i < js.length; i++) {
        var jo = {};
        var ix = 0;
        for (var key in js[0]) {
            if (js[0][key] != null) {
                jo[hdrs[ix]] = js[0][key];
                ix++;
            }
        }
        njs.push(jo);
    }
    return njs;
}

function getDT100(js) {
    var njs = [];
    var hdrs = [];
    for (var key in (js[0])) {
        hdrs.push(key);
    }

    //headers
    var njo = { Hdr: 1 };
    for (var i = 0; i < 100; i++) {
        if (i < hdrs.length - 1 && js[0][hdrs[i]] != null)
            njo["Col" + (i + 1)] = hdrs[i];
        else
            njo["Col" + (i + 1)] = "";
    }
    njs.push(njo);

    //data
    for (var i = 0; i < js.length; i++) {
        var njo = { Hdr: 0 };
        for (var ii = 0; ii < 100; ii++) {
            if (ii < hdrs.length - 1)
                njo["Col" + (ii + 1)] = js[i][hdrs[ii]];
            else
                njo["Col" + (ii + 1)] = "";
        }
        njs.push(njo);
    }

    return njs;
}



var jsMFC = [], MFCID, MFCFormID, MFCFunc;
// ============================================================
// SECTION: Interactive Application merge-field matrix (mapping form fields to counts/merge data for exports)
// ============================================================
function SelectMergeFieldCounts(main, xx, getFinal) {
    if (!getFinal) {
        jsMFC = [];

        if (!main) {
            MFCFormID = xx;
            console.log(888, "_IAGetRecordMergeFields", { formid: xx });
            getData(null, newFormData("_IAGetRecordMergeFields", { formid: xx }), function (vr) {
                var js = jparse(vr);
                var jo = js[0];

                if (js.length == 0)
                    xconfirm("No Merge IDs have been set for this form");
                else if (!jo.MergeField_1) {
                    PopUp("Select Merge Field Counts", js, null, true);
                } else {
                    jo = {};
                    for (var key in js[0]) {
                        jo[js[0][key]] = "";
                    }

                    if (!MFCFunc) {
                        jsExportGChart = [jo];
                        ExportGChart("CMS_Export_MergeFields.xlsx");
                    } else {
                        MFCFunc(jo);
                        MFCFunc = null;
                    }
                }
            });
        } else {
            jsMFC = xx;
            MFCID = main.id;
            PopUpOpt(main, "button|class=blueButton|onclick=SelectMergeFieldCounts('" + main.id + "', null, true)|Submit")
            console.log(888, xx);
            jchart(xx, ["Section", "Field_Count"], main, [], function () {
                var tbl = MFCID + "_tbl";
                console.log("jchart", tbl)
                for (var i = 0; i < jsMFC.length; i++) {
                    var TDTitle = document.getElementById(tbl + "_" + i + "_" + 1);
                    TDTitle.title = jsMFC[i].Fields;

                    var strTD = tbl + "_" + i + "_" + 2;
                    var td = document.getElementById(strTD);
                    //td.innerHTML = "";
                    xsection(td, [
                        "input|name=MFC_Count|type=number|style=width:50px|min=1|onchange=MFCCountChange(" + i + ")|value=1",
                        "input|name=MFC_Table|type=hidden|value=" + jsMFC[i].Section
                    ]);
                }
            });
        }
    } else {
        try {
            var tables = [], cnts = [];
            var t = document.getElementsByName("MFC_Table");
            var c = document.getElementsByName("MFC_Count");
            for (var i = 0; i < t.length; i++) {
                tables.push(t[i].value);
                cnts.push((c[i].value == "") ? 1 : c[i].value);
            }

            console.log("jchart", "_IAGetRecordMergeFields", { formid: MFCFormID, tables: tables.join("|"), cnts: cnts.join("|") });
            getData(null, newFormData("_IAGetRecordMergeFields", { formid: MFCFormID, tables: tables.join("|"), cnts: cnts.join("|") }), function (vr) {
                var js = jparse(vr);
                console.log("jchart", js);

                var jo = js[0];
                if (!jo.MergeField_1) {
                    PopUp("Select Merge Field Counts", js, null, true);
                } else {
                    jo = {};
                    for (var key in js[0]) {
                        jo[js[0][key]] = "";
                    }

                    if (!MFCFunc) {
                        jsExportGChart = [jo];
                        ExportGChart("CMS_Export_MergeFields.xlsx");
                    } else {
                        MFCFunc(jo);
                        MFCFunc = null;
                    }

                    closePopUp(null, main.split("_")[1] * 1);
                }
            });
        } catch (ex) {
            console.log("jchart", ex);
        }
    }
}

function MFCCountChange(ix) {
    var elem = document.getElementsByName("MFC_Count")[ix];
    if (elem.value < 1)
        elem.value = 1;
}




var jsMatrixForm = []; jsMatrixDoc = [];
function GoIAMatrix(FormID, MergeFields, Counts) {
    MergeFields = (!MergeFields) ? "" : MergeFields;
    Counts = (!Counts) ? "" : Counts;

    getData(null, newFormData("_IAGetRecordMergeFieldsALL", { formid: FormID, MergeFields: MergeFields, Counts: Counts }), function (vr) {
        jsMatrixForm = jparse(vr);

        if (jsMatrixDoc.length == 0) {
            var data = new FormData();
            data.append("FormID", FormID);
            getData("IAFormFieldMatrix", data, function (vr) {
                jsMatrixDoc = jparse(vr);
                if (jsMatrixDoc.length == 0) {
                   // xconfirm("There are no Document Fields to match.<br><br>Either no template document has been loaded or no form fields have been applied.");


                var elems = [
                    // Header
                    "div|style=background:rgb(31, 41, 67);padding:10px;height:50px;|class=ua-card-hdr" +
                    "|||label|icon=matrix.png|icon.style=background:white;height:30px;width:25px;padding:2px;" +
                    "|||span|style=color:#FFF;|class=ua-card-title|Merge Field Matrix",


                    "div|style=height:300px;padding:30px;|class=cr-card" +
                    "|<b>There are no Document Fields to match.</b><br><br>Either no template document has been loaded or no form fields have been applied.",
                    "br"
                ];

                xconfirm(null, elems, "xconfirm()");
                document.getElementById("xconfirmOK").className = "ugSubmitBtn";
                } else {
                    PopUp("Application Matrix", FormID, null, null, ["500px", "1000px"]);
                }
            });
        } else {
            PopUp("Application Matrix", FormID, null, null, ["500px", "1000px"]);
        }
    });
}

var matrixBgClr = "", matrixRow;
function ApplicationMatrix(main, FormID) {
    console.log("matrix", jsMatrixDoc, jsMatrixForm);
    //PopUpOpt(main, "label|icon=excel.png|onclick=exportMatrixFields()|Export Merge Fields")
    PopUpOpt(main, "button|class=longblueButton|onclick=Matrix_Counts('" + FormID + "')|Select Form Field Counts")
    //PopUpOpt(main, "button|class=longblueButton|onclick=Matrix_OrderMatch()|Match by Order")
    //PopUpOpt(main, "button|class=longblueButton|onclick=Matrix_OrderMatch(true)|Clear Matches")
    PopUpOpt(main, "button|class=blueButton|onclick=Matrix_Submit('" + FormID + "')|Submit")
    xsection(main, [
        "table|style=width:100%" +
        "|||td" +
        "|||append|div|id=matrixGchart|style=height:420px; width:720px" +
        "|||back|td" +
        "|||append|div|class=smhdr padBottom10|CMS Merge IDs" +
        "|||div|id=matrixFormFields|style=height:400px; width:250px; overflow-y:auto; padding-left:10px; border-left:solid 1px gray"
    ]);

    Matrix_PopOptions();
    Matrix_PopJChart();

    console.log("matrix", arrTables)
}

function Matrix_OrderMatch(clear) {
    if (!clear) {
        var formIX = 0;
        for (var i = 0; i < jsMatrixDoc.length; i++) {
            var jd = jsMatrixDoc[i];
            if (jd.MatchedFieldname == "" && i <= jsMatrixForm.length) {
                jd.MatchedFieldname = jsMatrixForm[formIX].val;
            } else {
                formIX = jsMatrixForm.findIndex(d => d.val == jd.MatchedFieldname);
            }

            formIX++;
        }
    } else {
        for (var i = 0; i < jsMatrixDoc.length; i++) {
            jsMatrixDoc[i].MatchedFieldname = "";
        }
    }

    Matrix_PopJChart(clear);
}

function Matrix_Counts(FormID) {
    MFCFunc = function (jo) {
        console.log("MFCFunc", jo, jsMatrixForm);
        var njs = [];

        var sorted = 1, prevTableName = "", prevTier = 0;
        for (var key in jo) {
            var ix = jsMatrixForm.findIndex(d => d.val == key);
            if (ix > -1) {
                var njo = jsMatrixForm[ix];
                njs.push({ Sorted: sorted, MergeField: "MergeField_" + sorted, TableName: njo.TableName, Tier: njo.Tier, val: njo.val });
                prevTableName = njo.TableName;
                prevTier = njo.Tier;
            }
            else
                njs.push({ Sorted: sorted, MergeField: "MergeField_" + sorted, TableName: prevTableName, Tier: prevTier, val: key });
        };

        jsMatrixForm = njs;

        Matrix_PopOptions();
    }
    SelectMergeFieldCounts(null, FormID);
    Matrix_PopJChart();
}

function Matrix_PopOptions() {
    console.log("jsmatrixform", jsMatrixForm);

    matrixFormFields.innerHTML = "";
    xsection(matrixFormFields, ["div|class=cursor alink|onclick=Matrix_ApplyMerge(0,'')|[ EMPTY ]"]);
    for (var i = 0; i < jsMatrixForm.length; i++) {
        var jo = jsMatrixForm[i];
        xsection(matrixFormFields, ["div|class=cursor alink|onclick=Matrix_ApplyMerge(" + i + ",'" + jo.val + "')|" + jo.val]);
    }
}

function matchMatrix() {
    for (var i = 0; i < jsMatrixDoc.length; i++) {
        var jo = jsMatrixDoc[i];
        console.log("MM4000", jo);
        if (jo.MatchedFieldname == "") {
            var xx = jsMatrixForm.findIndex(d => d.val == jo.FormFieldname);
            console.log("MM4000", xx, jo.FormFieldname);
            if (xx > -1)
                jsMatrixDoc[i].MatchedFieldname = jo.FormFieldname;
        }
    }
}

function Matrix_PopJChart(cleared) {
    if (!cleared)
        matchMatrix();

    console.log("MM4000", jsMatrixDoc);
    try {
        var jsMatrixJChart = [];
        for (var i = 0; i < jsMatrixDoc.length; i++) {
            var jo = jsMatrixDoc[i];
            jsMatrixJChart.push({ Field_Order: jo.Sorted, Doc_Field_Name: jo.FormFieldname, Matched_Field_Name: jo.MatchedFieldname }); //, Preview_Data: jo.PreviewData });
        }
        matrixGchart.innerHTML = "";
        jchart(jsMatrixJChart, [], matrixGchart, [], function () {
            for (var i = 0; i < jsMatrixJChart.length; i++) {
                var jo = jsMatrixJChart[i];
                var ix = 1;
                for (var key in jo) {
                    var elem = document.getElementById("matrixGchart_tbl_" + i + "_" + ix);
                    elem.setAttribute("class", elem.className + "; cursor");
                    if (key == "Preview_Data")
                        elem.setAttribute("onclick", "Matrix_PreviewData(" + i + ")");
                    else
                        elem.setAttribute("onclick", "Matrix_click(" + (i + 1) + ")");
                    ix++;
                }
            }

        });
    } catch (ex) {
        console.log("MM4000", ex);
    }
}

function exportMatrixFields() {
    var js = [], jo = {};
    for (var i = 0; i < jsMatrixForm.length; i++) {
        jo[jsMatrixForm[i].val] = "";
    }
    js.push(jo);
    jsExportGChart = js;
    ExportGChart("");
}

function Matrix_PreviewData(row, submit) {
    if (!submit) {
        xconfirm(null, [
            "div|smhdr|Enter data to display in the Document Preview",
            "textarea|id=matrixPData|style=width:100%; height:300px|" + jsMatrixDoc[row].PreviewData
        ], "Matrix_PreviewData(" + row + ",true)");

        matrixPData.focus();
    } else {
        jsMatrixDoc[row].PreviewData = matrixPData.value;
        document.getElementById("matrixGchart_tbl_" + row + "_4").innerHTML = matrixPData.value;
        xconfirm();
        //renewPopUp("Application Matrix");
    }
}

function Matrix_ApplyMerge(row, fld) {
    jsMatrixDoc[matrixRow - 1].MatchedFieldname = fld;
    document.getElementById("matrixGchart_tbl_" + (matrixRow - 1) + "_3").innerHTML = fld;
    Matrix_click(0, true);
    console.log("matdoc", jsMatrixDoc);
}

function Matrix_click(row, cancel) {
    if (matrixRow) {
        var elem = document.getElementsByName("col_matrixGchart_" + matrixRow);
        for (var i = 0; i < elem.length; i++) {
            elem[i].style.backgroundColor = matrixBgClr;
        }
    }
    if (!cancel) {
        var elem = document.getElementsByName("col_matrixGchart_" + row);
        matrixBgClr = elem[0].style.backgroundColor;
        matrixRow = row;
        for (var i = 0; i < elem.length; i++) {
            elem[i].style.backgroundColor = "lightgreen";
        }
    }
}

function Matrix_Submit(FormID) {
    var arr = [];
    for (var i = 0; i < jsMatrixDoc.length; i++) {
        var jo = jsMatrixDoc[i];
        arr.push(jo.FormFieldname + "=" + jo.MatchedFieldname + "=" + jo.PreviewData);
    }
    console.log("submit", arr);

    getData(null, newFormData("_IAGetFormFieldMatrix", { formid: FormID, matches: arr.join("|") }), function (vr) {
        smconfirm("The matrix has been updated", null, 1500);
    });
}

function PowerBIExample(main) {
    xsection(main, [
        "iframe|title=AllGateComplaintsMap|style=width:100%;height=100%|src=https://app.powerbi.com/reportEmbed?reportId=59988bcd-bc0a-426a-85ac-5d747962e36d&autoAuth=true&ctid=6373be8a-7e4b-4d01-b260-46c21fabe3b0|frameborder=0|allowFullScreen=true"
    ]);
}

function jsRemoveColumn(jsonArray, columnToRemove) {
    return jsonArray.map(obj => {
        const newObj = { ...obj };
        delete newObj[columnToRemove];
        return newObj;
    });
}
// ============================================================
// SECTION: OSA (Online Standards Assessment?) folder listing, array element removal by value
// ============================================================
function OSAFolders(main) {
    RunMultiSP("_GetOSAFolders,_GetOSAFiles", [{}, {}], function (js) {
        var jsFolders = js[0];
        var jsFiles = js[1]

        js = jsFolders;
        console.log("osa", js);

        for (var i = 0; i < js.length; i++) {
            var xx = js[i];
            var FdrIDs = xx.FdrIDs.split("|");
            var Folders = xx.Map.split("|");
            var OSAs = xx.OwnedSharedAssigned.split("|");

            for (var tier = 0; tier < FdrIDs.length; tier++) {
                var ParentClass = (tier == 0) ? "" : "OSAParent_" + FdrIDs[tier - 1];
                var FileClass = "OSAFiles_" + FdrIDs[tier];
                var FdrID = FdrIDs[tier];
                var Folder = Folders[tier];
                var OSA = OSAs[tier] * 1;

                if (OSA > -1) {
                    var icon = (OSA == 3) ? "folder-manilla.png" : "OSAFolder_" + OSA + ".png";
                    var elem = document.getElementById("OSAFolder_" + FdrID);
                    var dv = (tier == 0) ? main : document.getElementById("OSAFolder_" + FdrIDs[tier - 1]);
                    var dsp = (tier == 0) ? "" : "none";

                    if (dv && !elem) {
                        xsection(dv, [
                            "div|style=padding:10px; display:" + dsp + "|class=" + ParentClass + "|id=OSAFolder_" + FdrID +
                            "|||div|class=cursor|id=OSAInnerFolder_" + FdrID + "|style=padding-left:" + (tier * 30) + "px" +
                            "|||append|label|class=cursor|icon=" + icon + "|icon.style=width:30px; height:30px|" + Folder// + "_" + FdrID
                        ]);

                        elem = document.getElementById("OSAInnerFolder_" + FdrID);
                        elem.addEventListener("click", function () {
                            ////alert(this.id);
                            var id = this.id.split("_")[1];
                            var elems = document.getElementsByClassName("OSAParent_" + id);
                            ////alert(elems.length);
                            for (var x = 0; x < elems.length; x++) {
                                elems[x].style.display = (elems[x].style.display == "") ? "none" : "";
                            }

                            elems = document.getElementsByClassName("OSAFiles_" + id);
                            ////alert(elems.length);
                            for (var x = 0; x < elems.length; x++) {
                                elems[x].style.display = (elems[x].style.display == "") ? "none" : "";
                            }
                        });

                        var xx = jsFiles.filter(d => d.FdrID == FdrID);
                        for (var f = 0; f < xx.length; f++) {
                            var fil = xx[f];

                            xsection(elem, [
                                "div|class=padLeft30 " + FileClass + "|style=display:none" +
                                "|||append|label|class=cursor|icon=document-white.png|icon.style=width:30px; height:30px|" + fil.Filename
                            ]);
                        }
                    }
                }
            }
        }
    });
}

//PopUp("OSA Folders", null, null, true);


function rightString(str, chr) {
    return str.slice(str.length - chr, str.length);
}

function removeArrElement(arr, value) { //remove array element by value
    const index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    console.log("err removeArrElement", value, index);
}

//var datSortTable = [], datSortTableAR, datSortTableUD, datSortTableFinal;
//function SortTable(main, dat) {//main popup - in case there's a need to rebuild it, can be done using execSortTable
//    //dat consists of [arr:[], final:[], func:""]
//    //arr: this is the main list of elements to add/remove into/from final; leave null if you only want to sort Up and Down
//    //final: this is the main output and begins as the current array.  You may provide a full list in "arr" and we will exclude from that anything in final
//    //func: this is the string value function to run on "Submit"

//    PopUpOpt(main, "button|class=blueButton|onclick=" + dat.func + "|Submit");

//    var pu = main.id.split("_")[1];
//    document.getElementById("btnPopUpClose_" + pu).innerHTML = "CANCEL"; //CHANGE CLOSE BUTTON TO CANCEL

//    if (dat.title) //CHANGE TITLE OF POPUP
//        document.getElementById("PopUp_" + pu + "_hdrTitle").innerHTML = dat.title;

//    //label assigned when displaying; i.e. "folders" or "columns", etc.
//    dat.type = (!dat.type) ? "" : dat.type;

//    //carry to exec function
//    datSortTable = dat;
//    datSortTable.main = main; //add container to dat   
//    execSortTable();
//}

var datSortTable = [], datSortTableAR, datSortTableUD, datSortTableFinal;

// ============================================================
// SECTION: SortTable widget — a reorderable/checkbox-driven list picker (used e.g. for column selection)
// ============================================================
function SortTable(main, dat) {
    PopUpOpt(main, "button|class=ugSubmitBtn|id=btnSubmitSortTable|onclick=" + dat.func + "|Submit");
    if (typeof dat.func === 'function')
        btnSubmitSortTable.addEventListener("click", dat.func);
    else
        btnSubmitSortTable.setAttribute("onclick", dat.func);


    var pu = main.id.split("_")[1];
    document.getElementById("btnPopUpClose_" + pu).innerHTML = "Cancel";
    document.getElementById("PopUp_" + pu + "_hdr").style.backgroundColor = "rgb(31, 41, 67)";
    document.getElementById("PopUp_" + pu + "_hdr").style.color = "white";
    document.getElementById("PopUp_" + pu + "_hdr").style.height = "50px";
    document.getElementById("PopUp_" + pu + "_hdr").style.borderRadius = "5px";
    //main.style.height = "500px";
    //main.style.overflow = "auto";
    document.getElementById("btnPopUpClose_" + pu).className = "ugCancelBtn excludePrint";

    if (dat.title)
        document.getElementById("PopUp_" + pu + "_hdrTitle").innerHTML = dat.title;

    dat.type = (!dat.type) ? "" : dat.type;
    datSortTable = dat;
    datSortTable.main = main;
    execSortTable();
}



//function execSortTable() {
//    var dat = datSortTable;
//    var main = dat.main;
//    var arr = dat.arr;
//    var arrIDs = dat.arrIDs;
//    var final = dat.final;
//    var finalIDs = dat.finalIDs;
//    var onlyUpDown = (!arr) ? true : false; //only displays Up/Down list if arr = null


//    arr = (!arr) ? [] : arr;    //set to empty arr when null so nothing breaks
//    arrIDs = (!arrIDs) ? arr : arrIDs;
//    finalIDs = (!finalIDs) ? final : finalIDs;


//    var xfin = [];
//    for (var i = 0; i < final.length; i++) {
//        xfin.push({ val: final[i], valID: finalIDs[i] });
//    }
//    datSortTableFinal = xfin; //final output



//    for (var i = 0; i < final.length; i++) {//remove arr elements that exist in final
//        removeArrElement(arr, final[i]);
//    }

//    xsection(main, [ //main table
//        "table|id=tblSortTable|style=height:100%; width:100%; border:solid 1px gray"
//    ]);

//    var ht = ((main.style.height.replace("px", "") * 1) - 50); //set height of columns

//    xsection(tblSortTable, [ //will not display left columns when only using Up/Down
//        "tr",
//        //available header
//        "td|class=smhdr pad5|colspan=2|style=height:20px; border-right:solid 1px gray; display:" + ((onlyUpDown) ? "none" : "") + "|  Available " + dat.type,
//        //sort header
//        "td|class=smhdr pad5|colspan=2|style=height:20px;|  Sort " + dat.type,
//        "tr",
//        //available columns
//        "td|style=width:30%; display:" + ((onlyUpDown) ? "none" : "") + ";" +
//        "|||div|id=tdSortTableLeft|style=overflow:auto; height:calc(100% - 10px); padding:10px",
//        //add/remove buttons
//        "td|style=border-right:solid 1px gray; display:" + ((onlyUpDown) ? "none" : "") + ";" +
//        "|||div|id=tdSortTableAR|style=padding:10px; ",
//        //sort columns
//        "td|style=width:30%" +
//        "|||div|id=tdSortTableRight|style=overflow:auto; height:calc(100% - 10px); padding:10px",
//        //up/down buttons
//        "td|||div|id=tdSortTableUD|style=padding:10px;"
//    ]);

//    //build Add/Remove buttons
//    xsection(tdSortTableAR, [
//        "button|id=btnSortTableAdd|disabled=true|class=blueButton|onclick=execSortTableAR(0)|Add",
//        "br", "br",
//        "button|id=btnSortTableRem|disabled=true|class=blueButton|onclick=execSortTableAR(1)|Remove"
//    ]);

//    //build Up/Down buttons
//    xsection(tdSortTableUD, [
//        "button|id=btnSortTableUp|disabled=true|class=blueButton|onclick=execSortTableUD(0)|UP",
//        "br", "br",
//        "button|id=btnSortTableDown|disabled=true|class=blueButton|onclick=execSortTableUD(1)|DOWN"
//    ]);

//    //build Add/Remove column
//    for (var i = 0; i < arr.length; i++) {
//        execSortTableAddLeft(arr[i], arrIDs[i]); //function also used when adding/removing
//    }

//    //build Up/Down column
//    for (var i = 0; i < final.length; i++) {
//        execSortTableAddRight(final[i], finalIDs[i]); //function also used when adding/removing or sorting up/down
//    }
//}

function execSortTable() {
    var dat = datSortTable;
    var main = dat.main;
    var arr = dat.arr;
    var arrIDs = dat.arrIDs;
    var final = dat.final;
    var finalIDs = dat.finalIDs;
    var onlyUD = (!arr);


    arr = arr || [];
    arrIDs = arrIDs || arr;
    finalIDs = finalIDs || final;

    var xfin = [];
    for (var i = 0; i < final.length; i++)
        xfin.push({ val: final[i], valID: finalIDs[i] });
    datSortTableFinal = xfin;
    console.log("err execsorttable", final, arr);

    var narr = [];
    for (var i = 0; i < arr.length; i++) {
        if (final.indexOf(arr[i]) == -1)
            narr.push(arr[i]);
    }
    arr = narr;
    // for (var i = 0; i < final.length; i++) {
    //     //removeArrElement(arr, final[i]);
    //     var index = arr.indexOf(value);
    //     if (index > -1) {
    //         arr.splice(index, 1);
    //     }
    // }
    var hide = onlyUD ? "none" : "";

    // ── Root flex container ────────────────────────────────
    xsection(main, ["div|id=tblSortTable|class=st-layout"]);

    // ── LEFT PANEL — Available ─────────────────────────────
    xsection(tblSortTable, [
        "div|id=stPanelLeft|class=tg-panel|style=flex:1; display:" + hide
    ]);
    xsection(stPanelLeft, [
        "div|id=stHdrLeft|class=tg-panel-hdr",
        "div|id=tdSortTableLeft|class=st-panel-list"
    ]);
    xsection(stHdrLeft, [
        "div|class=tg-panel-hdr-icon|📋",
        "span|class=tg-panel-title|Available " + dat.type
    ]);

    // ── ADD / REMOVE button column ─────────────────────────
    xsection(tblSortTable, [
        "div|id=tdSortTableAR|class=st-btn-col|style=display:" + (onlyUD ? "none" : "flex")
    ]);
    xsection(tdSortTableAR, [
        "button|id=btnSortTableAdd|disabled=true|class=st-icon-btn|onclick=execSortTableAR(0)|→ Add",
        "button|id=btnSortTableRem|disabled=true|class=st-icon-btn|onclick=execSortTableAR(1)|← Remove"
    ]);

    // ── RIGHT PANEL — Sort Order ───────────────────────────
    xsection(tblSortTable, ["div|id=stPanelRight|class=tg-panel|style=flex:1"]);
    xsection(stPanelRight, [
        "div|id=stHdrRight|class=tg-panel-hdr",
        "div|id=tdSortTableRight|class=st-panel-list"
    ]);
    xsection(stHdrRight, [
        "div|class=tg-panel-hdr-icon|↕",
        "span|class=tg-panel-title|Sort " + dat.type
    ]);

    // ── UP / DOWN button column ────────────────────────────
    // NOTE: id=tdSortTableUD intentionally kept — xsection(tdSortTableUD,...)
    // works via the ID global; getElementsByName("tdSortTableUD") fetches items.
    xsection(tblSortTable, ["div|id=tdSortTableUD|class=st-btn-col"]);
    // ── UP / DOWN button column ────────────────────────────
    xsection(tdSortTableUD, [
        "button|id=btnSortTableUp|disabled=true|class=st-icon-btn|onclick=execSortTableUD(0)|▲ Up",
        "button|id=btnSortTableDown|disabled=true|class=st-icon-btn|onclick=execSortTableUD(1)|▼ Down"
    ]);

    // ── Populate lists ─────────────────────────────────────
    for (var i = 0; i < arr.length; i++)
        execSortTableAddLeft(arr[i], arrIDs[i]);

    for (var i = 0; i < final.length; i++)
        execSortTableAddRight(final[i], finalIDs[i]);
}

//function execSortTableAddLeft(val, valID) {
//    console.log(4679, val, valID)
//    xsection(tdSortTableLeft, [
//        "tr|name=trSortTableAR" +
//        "|||td|class=pad5|name=tdSortTableAR|class=cursor navlink" + "|onclick=execSortTableSelect('AR', this)|" + val.toString() + //note, we use "this" to send the actual "td" element
//        "|||append|input|type=hidden|value=" + val +
//        "|||input|type=hidden|value=" + valID
//    ]);
//}
//function execSortTableAddRight(val, valID) {
//    //console.log("sort table", val);
//    xsection(tdSortTableRight, [
//        "tr|name=trSortTableUD" +
//        "|||td|class=pad5|name=tdSortTableUD|class=cursor navlink" + "|onclick=execSortTableSelect('UD', this)|" + val.toString() +
//        "|||append|input|type=hidden|value=" + val +
//        "|||input|type=hidden|value=" + valID
//    ]);
//}

function execSortTableAddLeft(val, valID) {
    xsection(tdSortTableLeft, [
        "div|name=trSortTableAR" +
        "|||div|name=tdSortTableAR|class=cr-assign-item|tabindex=0" +
        "|onclick=execSortTableSelect('AR', this)|" + val.toString() +
        "|||append|input|type=hidden|value=" + val +
        "|||input|type=hidden|value=" + valID
    ]);
}

function execSortTableAddRight(val, valID) {
    xsection(tdSortTableRight, [
        "div|name=trSortTableUD" +
        "|||div|name=tdSortTableUD|class=cr-assign-item|tabindex=0" +
        "|onclick=execSortTableSelect('UD', this, event)|" + val.toString() +
        "|||append|input|type=hidden|value=" + val +
        "|||input|type=hidden|value=" + valID
    ]);
}

//function execSortTableSelect(ArUd, elem) {
//    //reset elem appearances
//    var elems = document.getElementsByName("tdSortTable" + ArUd);
//    var ix;
//    for (var i = 0; i < elems.length; i++) {
//        if (elems[i] == elem)
//            ix = i; //used below to know if elem is first or last

//        elems[i].className = "cursor " + ((elems[i] == elem) ? "navlinkSelected" : "navlink");
//    }

//    //making selection and setting buttons
//    if (ArUd == "AR") {
//        btnSortTableAdd.disabled = false;
//        btnSortTableRem.disabled = true;
//        datSortTableAR = elem;

//    } else {
//        btnSortTableRem.disabled = false;
//        btnSortTableUp.disabled = (ix == 0) ? true : false;
//        btnSortTableDown.disabled = (ix == elems.length - 1) ? true : false;
//        datSortTableUD = elem;
//    }

//    elem.focus();
//}


function execSortTableSelect(ArUd, elem, e) {
    var elems = document.getElementsByName("tdSortTable" + ArUd);


    if (ArUd != "AR" && ((e) ? e.shiftKey : false)) {
        var udix, thisix;
        for (var i = 0; i < datSortTableFinal.length; i++) {
            if (datSortTableFinal[i].elem == datSortTableUD) udix = i;
        }
        for (var i = 0; i < datSortTableFinal.length; i++) {
            if (datSortTableFinal[i].elem == elem) thisix = i;
        } 

        var stix = (thisix < udix) ? thisix : udix;
        var enix = (thisix > udix) ? thisix : udix;
        console.log("err sorting", stix, enix);

        for (var i = stix; i < enix + 1; i++) {
            datSortTableUD = datSortTableFinal[i].elem;
            console.log("err sorting", elems[i]);

            var val = datSortTableUD.children[0].value;
            var valID = datSortTableUD.children[1].value;
            datSortTableUD.parentElement.parentElement.removeChild(datSortTableUD.parentElement);
            datSortTableUD = null;
            execSortTableAddLeft(val, valID);
            btnSortTableRem.disabled = true;
            btnSortTableUp.disabled = true;
            btnSortTableDown.disabled = true;
        }

        execSortTableReset();

    } else {
        var ix;
        for (var i = 0; i < elems.length; i++) {
            if (elems[i] == elem) ix = i;
            elems[i].className = "cr-assign-item" + (elems[i] == elem ? " cr-selected" : "");
        }

        if (ArUd == "AR") {
            btnSortTableAdd.disabled = false;
            btnSortTableRem.disabled = true;
            datSortTableAR = elem;
        } else {
            btnSortTableRem.disabled = false;
            btnSortTableUp.disabled = (ix == 0);
            btnSortTableDown.disabled = (ix == elems.length - 1);
            datSortTableUD = elem;
        }

        elem.focus();
    }
}

//function execSortTableAR(AR) {
//    if (AR == 0) {//add element to the right
//        var val = datSortTableAR.children[0].value; //set val before removing element
//        var valID = datSortTableAR.children[1].value; //set val before removing element
//        datSortTableAR.parentElement.parentElement.removeChild(datSortTableAR.parentElement); //remove element
//        datSortTableAR = null; //reset selected to null
//        execSortTableAddRight(val, valID); //build element on the right
//        btnSortTableAdd.disabled = true; //disable add button
//        var elems = document.getElementsByName("tdSortTableUD");
//        execSortTableSelect("UD", elems[elems.length - 1]);

//    } else {//remove element from the right
//        var val = datSortTableUD.children[0].value; //set val before removing element
//        var valID = datSortTableUD.children[1].value; //set val before removing element
//        datSortTableUD.parentElement.parentElement.removeChild(datSortTableUD.parentElement); //remove element
//        datSortTableUD = null; //reset selected to null
//        execSortTableAddLeft(val, valID); //build element on the left

//        //disable remove and up/down buttons
//        btnSortTableRem.disabled = true;
//        btnSortTableUp.disabled = true;
//        btnSortTableDown.disabled = true;
//    }

//    //reset final output
//    execSortTableReset();
//}

//function execSortTableUD(UD) {
//    //get elems by name and index of selected elem
//    var ix;
//    var elems = document.getElementsByName("tdSortTableUD");
//    for (var i = 0; i < elems.length; i++) {
//        if (elems[i] == datSortTableUD)
//            ix = i;
//    }

//    if (UD == 0) { //previous elem and selected elem will switch values
//        var elem0 = elems[ix - 1];
//        var elem1 = datSortTableUD;
//        var tmp = elem0.innerHTML;
//        elem0.innerHTML = elem1.innerHTML;
//        elem1.innerHTML = tmp;
//        execSortTableSelect("UD", elem0); //reset selected to the switched elem

//    } else { //selected elem and next elem will switch values
//        var elem0 = datSortTableUD;
//        var elem1 = elems[ix + 1];
//        var tmp = elem0.innerHTML;
//        elem0.innerHTML = elem1.innerHTML;
//        elem1.innerHTML = tmp;
//        execSortTableSelect("UD", elem1); //reset selected to the switched elem
//    }

//    //reset final output
//    execSortTableReset();
//}

//function execSortTableReset() { //reset final output
//    var elems = document.getElementsByName("tdSortTableUD");

//    datSortTableFinal = [];
//    for (var i = 0; i < elems.length; i++) {
//        //console.log("sorted folders", elems[i], elems[i].children);
//        datSortTableFinal.push({ val: elems[i].children[0].value, valID: elems[i].children[1].value });
//    }
//}



function execSortTableAR(AR) {
    if (AR == 0) { // → add to right
        var val = datSortTableAR.children[0].value;
        var valID = datSortTableAR.children[1].value;
        datSortTableAR.parentElement.parentElement.removeChild(datSortTableAR.parentElement);
        datSortTableAR = null;
        execSortTableAddRight(val, valID);
        btnSortTableAdd.disabled = true;
        var elems = document.getElementsByName("tdSortTableUD");
        execSortTableSelect("UD", elems[elems.length - 1]);

    } else { // ← remove to left
        var val = datSortTableUD.children[0].value;
        var valID = datSortTableUD.children[1].value;
        datSortTableUD.parentElement.parentElement.removeChild(datSortTableUD.parentElement);
        datSortTableUD = null;
        execSortTableAddLeft(val, valID);
        btnSortTableRem.disabled = true;
        btnSortTableUp.disabled = true;
        btnSortTableDown.disabled = true;
    }

    execSortTableReset();
}

function execSortTableUD(UD) {
    var ix;
    var elems = document.getElementsByName("tdSortTableUD");
    for (var i = 0; i < elems.length; i++)
        if (elems[i] == datSortTableUD) ix = i;

    if (UD == 0) { // move up
        var e0 = elems[ix - 1], e1 = datSortTableUD;
        var tmp = e0.innerHTML; e0.innerHTML = e1.innerHTML; e1.innerHTML = tmp;
        execSortTableSelect("UD", e0);
    } else { // move down
        var e0 = datSortTableUD, e1 = elems[ix + 1];
        var tmp = e0.innerHTML; e0.innerHTML = e1.innerHTML; e1.innerHTML = tmp;
        execSortTableSelect("UD", e1);
    }

    execSortTableReset();
}

function execSortTableReset() {
    var elems = document.getElementsByName("tdSortTableUD");
    datSortTableFinal = [];
    for (var i = 0; i < elems.length; i++)
        datSortTableFinal.push({
            elem: elems[i],
            val: elems[i].children[0].value,
            valID: elems[i].children[1].value
        });
}

function dateAddDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

//function NewSortJS(js, fld, desc) {
//    //desc = true;
//    for (var i = 0; i < js.length; i++) {
//        for (var ii = i + 1; ii < js.length; ii++) {
//            if (!isNaN(Date.parse(js[i][fld])) && !isNaN(Date.parse(js[ii][fld]))) {
//                var dt_i = new Date(js[i][fld]);
//                var dt_ii = new Date(js[ii][fld]);
//                if (
//                    (!desc && dt_ii < dt_i) ||
//                    (desc && dt_ii > dt_i)
//                ) {
//                    var tmp = js[i];
//                    js[i] = js[ii];
//                    js[ii] = tmp;
//                };

//            } else {
//                if (
//                    (!desc && js[ii][fld].toString().toUpperCase() < js[i][fld].toString().toUpperCase()) ||
//                    (desc && js[ii][fld].toString().toUpperCase() > js[i][fld].toString().toUpperCase())
//                ) {
//                    var tmp = js[i];
//                    js[i] = js[ii];
//                    js[ii] = tmp;
//                };
//            }
//        }
//    }

//    return js
//}

function NewSortJS(js, fld, desc) {

    for (var i = 0; i < js.length; i++) {
        for (var ii = i + 1; ii < js.length; ii++) {
            var a = js[i][fld];
            var b = js[ii][fld];
            var swapped = false;

            // numeric check
            if (!isNaN(parseFloat(a)) && !isNaN(parseFloat(b))) {
                swapped = (!desc && parseFloat(b) < parseFloat(a)) ||
                    (desc && parseFloat(b) > parseFloat(a));

                // date check - only if value contains date separators
            } else if (
                typeof a === 'string' && typeof b === 'string' &&
                /\d{4}-\d{2}-\d{2}/.test(a) && /\d{4}-\d{2}-\d{2}/.test(b)
            ) {
                var dt_a = new Date(a);
                var dt_b = new Date(b);
                swapped = (!desc && dt_b < dt_a) ||
                    (desc && dt_b > dt_a);

                // string fallback
            } else {
                var sa = (a || "").toString().toUpperCase();
                var sb = (b || "").toString().toUpperCase();
                swapped = (!desc && sb < sa) ||
                    (desc && sb > sa);
            }

            if (swapped) {
                var tmp = js[i];
                js[i] = js[ii];
                js[ii] = tmp;
            }
        }
    }
    return js;
}



function IntSortJS(js, fld, desc) {
    //desc = true;
    for (var i = 0; i < js.length; i++) {
        for (var ii = i + 1; ii < js.length; ii++) {
            if (
                (!desc && js[ii][fld] < js[i][fld]) ||
                (desc && js[ii][fld] > js[i][fld])
            ) {
                var tmp = js[i];
                js[i] = js[ii];
                js[ii] = tmp;
            };
        }
    }
    return js
}


// ============================================================
// SECTION: sticky-header table scroll sync, popout window loading, report-list check, GLOBALSTART app bootstrap
// ============================================================
function tnsScroll(main) {
    tnsHdrs.style.top = main.scrollTop + "px";
}
function testNewSticky(main, js) {
    try {
        main.style.overflow = "auto";
        main.setAttribute("onscroll", "tnsHdrs.style.top=" + main.id + ".scrollTop + 'px'");

        xsection(main, [
            "table|id=tnsHdrs|style=position:absolute; ",
            "div|id=tnsSpacer|style=height:50px|&nbsp;",
            //"div|id=tnsMain|style=height:" + (main.clientHeight - 50) + "px; overflow-y:auto|||" +
            "table|id=tnsRpt|style=width:100%"
        ]);

        var hdrs = [];
        for (var key in js[0]) {
            hdrs.push(key);
        }

        //rows
        for (var i = 0; i < js.length; i++) {
            xsection(tnsRpt, ["tr|id=tnsRow_" + i]);

            var xx = js[i];
            var cols = []
            for (var h = 0; h < hdrs.length; h++) {
                cols.push("td|||div|class=tnsCol_" + h + "|" + xx[hdrs[h]]);
            }
            nsection("tnsRow_" + i, cols);
        }

        //hdrs
        var widths = [];
        xsection(tnsRpt, ["tr|id=tnsHdr"]);
        for (var h = 0; h < hdrs.length; h++) {
            xsection(tnsHdr, ["th|||div|id=tnsHdr_" + h + "|" + hdrs[h]]);
            widths.push(document.getElementById("tnsHdr_" + h).clientWidth);
        }

        //move hdrs to hdrs table
        var hdr = tnsHdr
        tnsRpt.removeChild(tnsHdr);
        tnsHdrs.appendChild(hdr);

        //set widths
        for (var h = 0; h < hdrs.length; h++) {
            //hdr
            var hdr = document.getElementById("tnsHdr_" + h);
            hdr.style.width = widths[h] + "px";
            //cols
            var cols = document.getElementsByClassName("tnsCol_" + h);
            for (var x = 0; x < cols.length; x++) { cols[x].style.width = widths[h] + "px"; }
        }

        //set spacer height
        tnsSpacer.style.height = tnsHdrs.clientHeight + "px";


    } catch (ex) {
        console.log("sticky", ex);
    }
}

function windowLoad(pg, jo, popout) {
    console.log(jo);
    getData(null, newFormData("_GetUserToken", {}), function (vr) {
        var tmpToken = jparse(vr)[0].Token
        ////alert(tmpToken);

        xsection(PageContainer, ["form|id=frmLaunch|method=post|action=" + pg + ((popout) ? "|target=_blank" : "")]);
        if (jo)
            for (var key in jo) {
                xsection(frmLaunch, ["input|type=hidden|id=frmLaunch_" + key + "|name=" + key + "|value="]);
                document.getElementById("frmLaunch_" + key).value = jo[key];
            }

        xsection(frmLaunch, ["input|type=hidden|name=token|value=" + tmpToken]);

        localStorage.setItem('UserToken', sessionStorage.getItem("UserToken"));
        localStorage.setItem('csrfToken', sessionStorage.getItem("csrfToken"));
        //alert(localStorage.getItem("UserToken"));

        console.log(55, frmLaunch);
        frmLaunch.submit();
        frmLaunch.parentElement.removeChild(frmLaunch);
    });
}

function xwindowLoad(pg, jo, popout) {
    var data = new FormData();
    if (jo)
        for (var key in jo) {
            data.append(key, jo[key]);
        };

    //const newWindow = window.open('about:blank', '_blank'); // _blank will open in a new tab/window

    fetch(pg, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${UserToken}`,
        },
        body: data
    })
    //.then(response => window.location.href = response.url);
    ////.then(response => {
    ////    if (!response.ok) {
    ////        throw new Error(`Response status: ${response.status}`);
    ////    }
    ////    return response.text(); // Or response.json() depending on your server response
    ////})
    ////.then(data => {
    ////    // Write the response data to the new window
    ////    //newWindow.
    ////        document.write(data);
    ////})
    //////.then(data => {
    //////    if (popout) {
    //////        const newWindow = window.open('about:blank', '_blank'); // _blank will open in a new tab/window
    //////        newWindow.document.write(data); // Write the response data to the new window)
    //////    } 
    //////    console.log(data);
    //////})
    ////.catch(error => {
    ////    console.error('Error:', error);
    ////    // Handle errors in the new window or an alert
    ////    newWindow.document.write('Error: ' + error.message);
    ////});
}


function CheckReportList() {
    getData(null, newFormData("_IACheckReportList", {}), function (vr) {
        var LaunchThis = jparse(vr)[0].Launch
        if (LaunchThis)
            PopUp('Saved Reports');

        setTimeout(CheckReportList, 15000);
    }, null, true);
}



let _sessionCheckInterval = null;

function ftnCloseChild() {
    if (!window.opener || window.opener.closed ||
        !window.opener.sessionStorage.getItem('UserToken')) {
        clearInterval(_sessionCheckInterval);
        window.close();
        return;
    }
}

function GLOBALSTART() {
    if (sectionTitle == "Login") {
        sessionStorage.clear();
        localStorage.clear();

    } else {
        if (window.opener && !window.opener.closed) {
            ftnCloseChild(); // check immediately on load
            _sessionCheckInterval = setInterval(ftnCloseChild, 10000);
        }

        if (localStorage.getItem("UserToken")) {
            sessionStorage.setItem('UserToken', localStorage.getItem("UserToken"));
            sessionStorage.setItem('csrfToken', localStorage.getItem("csrfToken"));
            localStorage.clear();
        }

        UserToken = sessionStorage.getItem("UserToken");
        csrfToken.value = sessionStorage.getItem("csrfToken");

        setTimeout(CheckReportList, 5000);

        //alert(UserToken);
        try {
            ////alert(UserToken);
            getData("creds", null, function (vr) {
                var js = jparse(vr);
                console.log(5722, js);
                //alert(jstring(js));
                if (js.length == 0) {
                    logout();
                }
                else {
                    try {
                        var xx = js[0];
                        getData(null, newFormData("_NewSecurity", {}), function (vr) {

                            ME = { Creds: xx, Security: jparse(vr) };

                            //logout for no access
                            var sec = ME.Security[0];
                            console.log("err", sec);
                            if (secCheck(sec))
                                logout();

                            GetMyAlerts();

                            reloadSecurity();

                            var opt = document.getElementById("optWindow");
                            var chartList = ["scatter chart", "timeline chart", "vertical bar chart", "stepped area chart", "pie chart"]
                            var documentTypes = ["Files", "Remediations", "Applications"]

                            let divFileReport = document.getElementById("PageContainer");

                            var selectedFileID = undefined
                            var selectedCompanyID = undefined
                            var selectedCompany = jsData[0]
                            var selectedChartType = undefined

                            console.log(55, sectionTitle);
                            if (["Calendar", "PopOut", "Form Send"].indexOf(sectionTitle) == -1)
                                tdMainHidNav.style.display = "none";

                            myCID = xx.MyCID;
                            myCompany = xx.MyCompany;
                            mgtCID = xx.MgtCID;
                            isMGT = (xx.isMGT == 1) ? true : false;
                            GlobalFName = xx.FName;
                            GlobalLName = xx.LName;
                            GlobalCompany = xx.Company;
                            myUID = xx.myUID * 1;

                            //alert(sectionTitle);
                            if (["PopOut", "Form Send"].indexOf(sectionTitle) == -1) {
                                build_mainNav();
                                DisplayProdOrDev(xx.HeaderColor);
                            }
                            console.log(55, GlobalFName, GlobalLName, GlobalCompany);

                            if (["Dashboard", "Calendar", "PopOut", "Form Send"].indexOf(sectionTitle) == -1)
                                showHideMaiNav();

                            //alert(sectionTitle);

                            if (sectionTitle == "Dashboard") {
                                RenderDashboard();
                            } else if (sectionTitle == "Our Documents") {
                                startMe(Launch);
                            } else if (sectionTitle == "3rd Party Management") {
                                startMe(Launch);
                            } else if (sectionTitle == "Form App Management") {
                                StartMe();
                            } else if (sectionTitle == "Form Applications") {
                                //alert("quanini???");
                                iaStartMe(Launch);
                            } else if (sectionTitle == "Calendar") {
                                alert(calendar);
                                startme();
                            } else if (sectionTitle == "Form Send") {
                                startme();
                            }
                            else {
                                start_popout(main, pram, csrf);
                            }
                        });
                    } catch (ex) {
                        console.log(55, ex);
                    }
                }
            });
        } catch (ex) {
            console.log(55, ex);
        }
    }
}


//xsection(PageContainer, [
//    "div|id=jkwtf|this is a test" +
//    "|||append|input|type=hidden|value=jkwtf" +
//    "|||input|type=hidden|value=1234"
//]);

//console.log("jkwtf", jkwtf.children[0].value, jkwtf.children[1].value);


// ============================================================
// SECTION: exam builder/viewer (Exam widget, new-exam creation, heatmap, saved/full IA reports)
// ============================================================
function uppercaseKeys(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj; // Return non-object values as is
    }

    if (Array.isArray(obj)) {
        return obj.map(item => uppercaseKeys(item)); // Process array elements
    }

    const newObj = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const newKey = key.toUpperCase().replace(/ /g, "_");
            newObj[newKey] = uppercaseKeys(obj[key]); // Recursively process values
        }
    }
    return newObj;
}





/***************************************************************************************** NEW EXAM PROCESS ********************************************************************************/
/***************************************************************************************** NEW EXAM PROCESS ********************************************************************************/
/***************************************************************************************** NEW EXAM PROCESS ********************************************************************************/
/***************************************************************************************** NEW EXAM PROCESS ********************************************************************************/
var curNewExamID, curNewXCID;
var curNewExam = [];
var curNewExamSH = {};
var ExamMainDiv;

function Exam_click1(xx, ix, fld) {
    return { class: "cursor", click: "Exam(" + ExamMainDiv.id + ", {ExamID:'', xCID:" + xx.CID + "})" }
}
function Exam_click2(xx, ix, fld) {
    return { class: "cursor", click: "Exam(" + ExamMainDiv.id + ", {ExamID:'" + xx.ExamID + "', xCID:" + xx.xCID + ", PU:true})" }
}

function Exam(main, prms) {
    ExamMainDiv = main;
    var ExamID = prms.ExamID;
    var xCID = prms.xCID;
    var pu = prms.PU;

    curNewExamID = ExamID;
    curNewXCID = xCID;
    main.innerHTML = ""
    jsJChart = jsJChart.filter(d => d.dv != main.id);

    if (!pu)
        main.style.padding = "20px";

    var sp = "_GetExamNEW" + ((ExamID == "") ? "_INIT" : "");
    getData(null, newFormData(sp, { examid: ExamID, xcid: xCID }), function (vr) {
        var js = jparse(vr);
        var modules = [];
        var lines = [];


        var GetExams = function (xCID) {
            curNewXCID = xCID;
            js = js.filter(d => d.CID == xCID);
            var examids = js[0].ExamIDs.split(",")
            var examnames = js[0].ExamNames.split("|");

            var njs = [];
            for (var i = 0; i < examids.length; i++) {
                njs.push({ xCID: xCID, ExamID: examids[i], Exam_Name: examnames[i] });
            }

            njchart(njs, ["Exam_Name"], main, Exam_click2);
        }

        if (xCID == 0) {
            if (js.length == 0)
                xsection(main, ["div|class=sm pad10|There are no exams available"]);

            if (js.length == 1 && js[0].CID == myCID)
                GetExams(myCID);

            else
                njchart(js, ["Company"], main, Exam_click1);

        } else if (ExamID == "") {
            GetExams(xCID);

        } else {
            main.style.width = "100%";

            if (pu)
                PopUpOpt(main, "button|class=blueButton|onclick=xpopout('EXAM', {ExamID:'" + ExamID + "', xCID:" + xCID + ", PU:false})|Pop Out");

            curNewExam = js;

            //build Exam header and buttons
            var jsX = js.filter(d => d.Type == "MGMT");
            var qTyps = [];
            for (var i = 0; i < jsX.length; i++) {
                var xx = jsX[i];
                if (qTyps.indexOf(xx.QuestType) == -1)
                    qTyps.push(xx.QuestType);
            }
            xsection(main, [
                "div|class=pad10|Exam: " + js[0].ExamName,
                "div|id=dvNewExamBtns",
                "hr",
                "div|id=newExamMain|style=height:calc(100% - 100px); overflow:auto"
            ]);
            for (var i = 0; i < qTyps.length; i++) {
                xsection(dvNewExamBtns, [
                    "button|class=longblueButton|onclick=" +
                    ((qTyps[i] != "Heatmap Statement") ?
                        "newExamSH(this, '" + qTyps[i] + "')" :
                        "onclick=PopUp('new Exam Heatmap')") + "|" +
                    qTyps[i],
                    "label|class=padLeft10|"
                ]);
            }


            //build Exam Modues and Questions with dv Sections
            var jsM = js.filter(d => d.Type == "MAIN");
            for (var i = 0; i < jsM.length; i++) {
                var xx = jsM[i];
                if (lines.indexOf(xx.LineID) == -1) {
                    lines.push(xx.LineID);

                    if (modules.findIndex(d => d.Module == xx.Module && d.ModNum == xx.ModNum) == -1) {
                        modules.push({ Module: xx.Module, ModNum: xx.ModNum });
                        xsection(newExamMain, ["div|class=smhdr shadowSction|" + xx.ModNum + ": " + xx.Module]);
                    }

                    xsection(newExamMain, ["div|id=dvNewExam_" + xx.LineID]);
                    var dvLine = document.getElementById("dvNewExam_" + xx.LineID);

                    xsection(dvLine, [
                        "br",
                        "div|style=padding-left:10px; border-top:solid 1px whitesmoke;|id=dvNewExamQuestion_" + xx.LineID + "|" + xx.QuestNum + ": " + xx.Question,
                        "div|class=dvNewExamLine|style=padding-left:10px;|id=dvNewExamQuestionAnswer_" + xx.LineID + "|||textarea|onchange=newExamUpdate(this)|id=txtNewExamQuestionAnswer_" + xx.LineID + "_" + xx.ElemID + "|style=width:100%; height:40px;",
                        "div|class=dvNewExamLine|style=padding-left:30px; border-top:solid 1px whitesmoke;|id=dvNewExamAnswer_" + xx.LineID,
                        "div|class=dvNewExamLine|style=padding-left:60px; border-top:solid 1px whitesmoke;|id=dvNewExamMGMT_" + xx.LineID,
                        "div|class=dvNewExamLine|style=padding-left:30px; border-top:solid 1px whitesmoke;|id=dvNewExamScoring_" + xx.LineID,
                    ]);
                }
            }

            //set showHides
            var jsX = js.filter(d => d.Type == "MGMT");
            for (var i = 0; i < jsX.length; i++) {
                var xx = jsX[i];
                if (!curNewExamSH[xx.QuestType])
                    curNewExamSH[xx.QuestType] = "none";
            }

            NewExamPopAnswers();
        }
    });
}


function newExamSH(btn, typ) {
    var xx = document.getElementsByClassName("dvNewExamMGMT_" + typ.replace(/ /g, "_"));
    var dsp = (xx[0].style.display == "none") ? "" : "none";
    btn.className = (dsp == "") ? "longorangeButton" : "longblueButton";
    btn.blur();

    curNewExamSH[typ] = dsp;

    for (var i = 0; i < xx.length; i++) {
        xx[i].style.display = dsp;
    }
}

function newExamUpdate(elem) {
    var elemid = elem.id.split("_")[2];
    var answer = (!isCheckbox(elem)) ? elem.value : (elem.checked) ? "checked" : "";

    console.log("err 2706", { examid: curNewExamID, xcid: curNewXCID, elemid: elemid, answer: answer })
    getData(null, newFormData("_ExamNewUpdateAnswers", { examid: curNewExamID, xcid: curNewXCID, elemid: elemid, answer: answer }), function (vr) {
        curNewExam = jparse(vr);
        console.log("err 2706", vr);
        NewExamPopAnswers();
    });
}

function NewExamPopAnswers() {
    var js = curNewExam;
    var jsM = js.filter(d => d.Type == "MAIN");
    var jsA = jsM.filter(d => d.Answer);
    var jsX = js.filter(d => d.Type == "MGMT");

    //clear sections
    for (var i = 0; i < jsA.length; i++) {
        var xx = jsA[i];
        var dvAnswer = document.getElementById("dvNewExamAnswer_" + xx.LineID);
        dvAnswer.innerHTML = "";
    }
    for (var i = 0; i < jsX.length; i++) {
        var xx = jsX[i];
        var dvMGMT = document.getElementById("dvNewExamMGMT_" + xx.LineID);
        dvMGMT.innerHTML = "";
    }
    console.log("ans 2706", curNewExamSH);

    //populate Exam Answers
    for (var i = 0; i < jsA.length; i++) {
        var xx = jsA[i];
        var dvAnswer = document.getElementById("dvNewExamAnswer_" + xx.LineID);

        xsection(dvAnswer, [
            ((i > 0) ? "hr" : ""),
            "div|class=normal|" + xx.Answer,
            "div|class=sm|style=padding: 5px; background-color: rgb(213, 246, 206);|By: " + xx.AnsweredBy + " with " + xx.AnsweredByCompany + " on " + convertDT(xx.DTAnswered),
        ]);
    }

    //populate Exam MGMT
    var typs = [];
    for (var i = 0; i < jsX.length; i++) {
        var xx = jsX[i];
        var dvMGMT = document.getElementById("dvNewExamMGMT_" + xx.LineID);
        var dvMGMTInner = document.getElementById("dvNewExamMGMT_" + xx.LineID + "_" + xx.QuestType.replace(/ /g, "_"));

        var dsp = curNewExamSH[xx.QuestType];

        if (!dvMGMTInner) {
            xsection(dvMGMT, [
                "div|class=padLeft30|style=display:" + dsp + "|class=dvNewExamMGMT_" + xx.QuestType.replace(/ /g, "_") + "|id=dvNewExamMGMT_" + xx.LineID + "_" + xx.QuestType.replace(/ /g, "_") +
                ((i > 0) ? "|||hr" : "") +
                "|||div|class=smhdr|" + xx.QuestType
            ]);

            dvMGMTInner = document.getElementById("dvNewExamMGMT_" + xx.LineID + "_" + xx.QuestType.replace(/ /g, "_"));
        }

        var ansID = "dvNewExamMGMT_" + xx.LineID + "_" + xx.ElemID + "_" + i;

        xsection(dvMGMTInner, [
            ((i > 0) ? "br" : ""),
            ((["checkbox", "FILE"].indexOf(xx.AnswerType) == -1) ? "div|" + xx.Question : ""),
            "div|style=padding:5px|||" + (
                (xx.AnswerType == "FILE") ?
                    "button|id=" + ansID + "|style=width:100%|+ " + xx.Question :
                    (xx.AnswerType == "checkbox") ?
                        "input|onchange=newExamUpdate(this)|id=" + ansID + "|type=checkbox|||label|class=padLeft10|" + xx.Question :
                        "textarea|onchange=newExamUpdate(this)|id=" + ansID + "|style=width:100%; height:40px|" + ((xx.Answer) ? xx.Answer : "")
            ),
            ((xx.Answer && xx.AnswerType == "FILE") ? "div|class=alink|" + xx.Answer : ""),
            ((xx.Answer) ? "div|class=sm|style=padding: 5px; background-color: rgb(213, 246, 206);|By: " + xx.AnsweredBy + " with " + xx.AnsweredByCompany + " on " + convertDT(xx.DTAnswered) : "")
        ]);
        if (xx.AnswerType == "checkbox" && xx.Answer)
            document.getElementById(ansID).checked = true;
    }

    //populate Exam Scoring
    var lins = [];
    for (var i = 0; i < jsM.length; i++) {
        var xx = jsM[i];

        if (lins.indexOf(xx.LineID) == -1) {
            lins.push(xx.LineID);
            var sf = xx.ScoringFields.split(",");
            var sfv = xx.ScoringFieldValues.split("|");
            var xsv = xx.ScoringValues;

            nsection("dvNewExamScoring_" + xx.LineID, ["br", "br", "div|class=smhdr shadowSection|Scoring"]);

            nsection("dvNewExamScoring_" + xx.LineID, [
                "table|id=tblNewExamScoring_" + xx.LineID + "|style=width:100%" +
                "|||tr|id=trNewExamScoring_" + xx.LineID + "_0" +
                "|||tr|id=trNewExamScoring_" + xx.LineID + "_1"]);

            for (var s = 0; s < sf.length; s++) {
                nsection("trNewExamScoring_" + xx.LineID + "_0", ["td|class=smhdr center|" + sf[s]]);
            }

            nsection("trNewExamScoring_" + xx.LineID + "_0", ["td|class=smhdr center|Net Score"]);

            for (var s = 0; s < sf.length; s++) {
                var av = sfv[s].split(",");
                nsection("trNewExamScoring_" + xx.LineID + "_1", ["td|style=white-space:none; width:100px|id=tdNewExamScoring_" + xx.LineID + "_" + s]);
                for (var ss = 0; ss < av.length; ss++) {
                    nsection("tdNewExamScoring_" + xx.LineID + "_" + s, [
                        "input|type=radio|id=rdoNewExamScoring_" + xx.LineID + "_" + s + "_" + ss + "|name=rdoNewExamScoring_" + xx.LineID + "_" + s + "|value=" + ss,
                        "label|class=padLeft10|for=rdoNewExamScoring_" + xx.LineID + "_" + s + "_" + ss + "|" + av[ss],
                        "div|"// + av.toString()
                    ]);
                }
            }

            nsection("trNewExamScoring_" + xx.LineID + "_1", ["td|id=tdNewExamScoring_" + xx.LineID + "_" + sf.length + "|" + ((xx.NetScore < 1) ? "" : xx.NetScore) + "|||div|class=pad10|" + xx.NetText]);
        }
    }
}
var curNewExamForm = {};
function newExamHeatmap(main) {
    RunMultiSP("_GetExamNEWHeatmap,_GetExamNEWHeatmap,_GetExamNEWHeatmap",
        [{ examid: curNewExamID, xcid: curNewXCID, wo: 0 }, { examid: curNewExamID, xcid: curNewXCID, wo: 1 }, { examid: curNewExamID, xcid: curNewXCID, wo: 2 }],
        function (js) {
            curNewExamForm = js[0][0];
            var jsStatic = js[1];
            var jsDetails = js[2];

            //if (!document.getElmentById("NewExamHeatmap"))
            //    xsection(PageContainer, ["div|id=NewExamHeatmap|style=display:none"]);

            var dv = main; // NewExamHeatmap;


            //BUILD STATIC PAGES
            var elems = [];
            for (var i = 0; i < jsStatic.length; i++) {
                var xx = jsStatic[i];
                var dn = (!xx.DivName) ? dv.id : xx.DivName;

                var ielems = xx.Elems.split("+++");

                for (var ii = 0; ii < ielems.length; ii++) {
                    ielems[ii] = getNewExamHeatmapElements(ielems[ii]);
                }
                elems.push({ dv: dn, elems: ielems });
            }

            for (var i = 0; i < elems.length; i++) {
                nsection(elems[i].dv, elems[i].elems);
            }

            /**********************************************************************/
            /**********************************************************************/


            //BUILD DETAILS
            //start with dashboard
            xsection(dv, [
                "p|||br",
                "div|style=page-break-before:always; font-weight:bold|Assessment Dashboard",
                "table|id=NewExamHeatmap_Dashboard|style=width:100%; border:solid 1px gray"
            ]);

            var js = jsDetails.filter(d => d.Type == "Dashboard");
            var bclr = "lightblue";
            var ttls = []
            for (var i = 0; i < js.length; i++) {
                bclr = (bclr == "white") ? "lightblue" : "white";
                var xx = js[i];
                xsection(NewExamHeatmap_Dashboard, [
                    "tr" +
                    "|||td|style=padding:5px; border:solid 1px gray; background-color:" + bclr + "|" + xx.ModNum + " - " + xx.Module +
                    "|||td|style=padding:5px; border:solid 1px gray; background-color:" + xx.color + "; color:" + ((xx.color == "yellow") ? "black" : "white") + "|" + ((xx.NetScore) ? xx.NetScore : 0)
                ]);
                if (xx.NetScore)
                    ttls.push(xx.NetScore);
            }
            //we choose not to display the total for all modules

            /**********************************************************************/
            /**********************************************************************/


            //next build sections
            var js = jsDetails.filter(d => d.Type == "Dashboard");
            for (var i = 0; i < js.length; i++) {
                var xx = js[i];
                xsection(dv, [
                    "p|||br",
                    "div|style=page-break-before:always; font-weight:bold|" + xx.ModNum + " - " + xx.Module + " Residual Risk Heatmap",
                    "table|id=NewExamHeatmap_Module_" + xx.ModNum + "|style=width:100%; border:solid 1px gray",
                    "div|style=font-weight:bold|Recommended Remediation: " + xx.ModNum + " - " + xx.Module,
                    "div|style=padding-left:10px|id=NewExamHeatmap_Remediations_" + xx.ModNum + "|No High Risk Recommended Remediation"
                ]);

                var ijs = jsDetails.filter(d => d.Type == "Module" && d.ModNum == xx.ModNum);
                for (var ii = 0; ii < ijs.length; ii++) {
                    var ixx = ijs[ii];
                    nsection("NewExamHeatmap_Module_" + ixx.ModNum, [
                        "tr" +
                        "|||td|style=padding:5px; border:solid 1px gray; width:90%|" + ixx.Statement +
                        "|||td|style=padding:5px; border:solid 1px gray; width:10%; background-color:" + ixx.color + "; color:" + ((ixx.color == "yellow") ? "black" : "white") + "|" + ixx.NetScore
                    ]);
                }
                var ijs = jsDetails.filter(d => d.Type == "Dashboard" && d.ModNum == xx.ModNum);
                var ixx = ijs[0];
                nsection("NewExamHeatmap_Module_" + ixx.ModNum, [
                    "tr" +
                    "|||td|style=padding:5px; border:solid 1px gray; width:90%; background-color:gray; color:white; text-align:right|Composite Residual Risk Score" +
                    "|||td|style=padding:5px; border:solid 1px gray; width:10%; background-color:" + ixx.color + "; color:" + ((ixx.color == "yellow") ? "black" : "white") + "|" + ixx.NetScore
                ]);
            }

            /**********************************************************************/
            /**********************************************************************/


            //last build remediations
            var js = jsDetails.filter(d => d.Type == "Remediation");
            for (var i = 0; i < js.length; i++) {
                var xx = js[i];
                var dv = document.getElementById("NewExamHeatmap_Remediations_" + xx.ModNum);
                if (dv.innerHTML == "No High Risk Recommended Remediation")
                    dv.innerHTML = "";

                nsection("NewExamHeatmap_Remediations_" + xx.ModNum, [
                    "div|style=padding-left:10px|" + xx.Statement + " (" + xx.LineNum + ")"
                ]);
            }


            //export
            exportPDFDoc(main.id, "PDF", "", "", myCompany + " - " + curNewExam[0].ExamName + " Heatmap.pdf");

        }
    );
}

function getNewExamHeatmapElements(str) {
    var x = str.replace(/AGENCY/g, curNewExamForm["Agency"])
        .replace(/ONSITEDATEFROM/g, convertDT(curNewExamForm["OnsiteDateFrom"], true))
        .replace(/ONSITEDATETO/g, convertDT(curNewExamForm["OnsiteDateTo"], true))
        .replace(/ONSITEADDR1/g, curNewExamForm["OnsiteAddr1"])
        .replace(/ONSITEADDR2/g, curNewExamForm["OnsiteAddr2"])
        .replace(/ONSITECITY/g, curNewExamForm["OnsiteZip"])
        .replace(/ONSITESTATE/g, curNewExamForm["OnsiteState"])
        .replace(/ONSITEZIP/g, curNewExamForm["OnsiteZip"])
        .replace(/COMPANYPARTICIPANTS/g, curNewExamForm["CompanyParticipants"].split("~").join("<br>"))
        .replace(/EXAMINERNAMES/g, curNewExamForm["ExaminerNames"].split("~").join("<br>"));

    return x.replace("^^^", "");
}






function SavedReports(main, addFullBtn) {
    xconfirm();

    if (addFullBtn)
        PopUpOpt(main, "button|class=longblueButton|onclick=ExportAllIA()|Get Data for ALL Forms");

    getData(null, newFormData("_IAGetReportList", {}), function (vr) {
        jsReportList = jparse(vr);

        if (jsReportList.length == 0) {
            xsection(main, ["div|class=sm pad10|You do not have any saved reports"]);
        } else {
            var colStyles = [];
            for (var i = 0; i < jsReportList.length; i++) {
                var xx = jsReportList[i];
                colStyles.push({
                    rowParam: "FID", rowVal: xx.FID, col: 1, style: "color:red", class: ""
                });
            }
            console.log(colStyles);

            getGChartTable(
                jsReportList,
                ["Filename", "Date_Loaded"],
                main,
                [
                    { Func: "ApplicationReport", Params: ["*null", "FID"], Cols: [0] }
                ], null, null, null, null, ["Date_Loaded", true], null);
        }
    });
}


function getReportList() {
    getData(null, newFormData("_IAGetReportList", {}), function (vr) {
        var js = jparse(vr);
        console.log("report list", js, jsReportList, (js.length != jsReportList.length));

        if (js.length != jsReportList.length) {
            jsReportList = js;
            //xconfirm("Your report is ready");
            closePopUp("Saved Reports");
            PopUp("Saved Reports");
        }

        setTimeout(function () { getReportList(); }, 30000);
    }, null, true);
}

function DeleteFullIAReport(FID, go) {
    if (!go) {
        xconfirm("Are you sure you want to delete this report?", null, "DeleteFullIAReport(" + FID + ", true)");
    } else {
        xconfirm();

        getData(null, newFormData("_IADeleteReport", { FID: FID }), function (vr) {
            jsReportList = jparse(vr);
            renewPopUp("Saved Reports");
            closePopUp("Application Report");
        });
    }
}

function RenameFullIAReport(FID) {
    var NewFilename = txtRenameFullReport.value;
    if (NewFilename != "") {
        NewFilename = (NewFilename.indexOf(".xlsx") == -1 && NewFilename.indexOf(".csv") == -1) ? NewFilename + ".xlsx" : NewFilename;


        getData(null, newFormData("_IARenameReport", { FID: FID, NewFilename: NewFilename }), function (vr) {
            jsReportList = jparse(vr);
            renewPopUp("Saved Reports");
            renewPopUp("Application Report");
        });
    }
}

function ApplicationReport(main, FID) {
    var Filename = jsReportList.filter(d => d.FID == FID)[0].Filename;
    var FormID = jsReportList.filter(d => d.FID == FID)[0].FormID;
    console.log("jsReportList", jsReportList, currentFormID);

    if (!main) {
        PopUp("Application Report", FID, Filename);
    } else {
        xsection(main, ["table|style=width:100%|id=tblAppReport"])
        xsection(tblAppReport, [
            "tr|style=padding-bottom:10px",
            ((currentFormID == FormID) ? "" : "td|colspan=3|||button|class=longblueButton|style=width:100%|onclick=LaunchApplication('InteractiveForm','" + FormID + "')|Launch Application"),
            ((currentFormID == FormID) ? "" : "tr"),
            ((currentFormID == FormID) ? "" : "td|colspan=3|||hr"),
            ((currentFormID == FormID) ? "" : "tr"),
            "td|Download:",
            "td|colspan=2|style=width:30px|||label|class=alink|onclick=DownloadFullIAReport(" + FID + ")|" + Filename,
            "tr", "td|colspan=3|||hr", "tr",
            "td|Rename:",
            "td|||append|input|style=width:100%|id=txtRenameFullReport|value=" + Filename,
            "td|||button|class=blueButton|onclick=RenameFullIAReport(" + FID + ")|Rename",
            "tr", "td|colspan=3|||hr", "tr", "td|Delete:",
            "td|||button|class=blueButton|onclick=DeleteFullIAReport(" + FID + ")|Delete"
        ]);
    }
}

function DownloadFullIAReport(FID, GO) {
    if (!GO) {
        smconfirm(["div|Your report will begin downloading in just a moment"], null, 2500);
        DownloadFullIAReport(FID, true);
    } else
        windowOpen("DownloadFullIAReport?FID=" + FID);
}



//******************************************************************   Map Exam Docs To CMS   ***************************************************************************
//******************************************************************   Map Exam Docs To CMS   ***************************************************************************
//******************************************************************   Map Exam Docs To CMS   ***************************************************************************
//******************************************************************   Map Exam Docs To CMS   ***************************************************************************
//MEDTC

var medtc_Main, medtc_Title, medtc_FdrID = -1, medtc_Prms, medtc_ExamSelections = [];
var jsMedtc = [], jsMedtcFolders = [];
var medtc_AllUnmapped = 0;

// ============================================================
// SECTION: MEDTC — mapping exam documents to CMS folders/exams (medtc_* helpers + MapExamDocsToCMS)
// ============================================================
function medtc_DisplayDetails() {
    //displayDetailsOnOff = (displayDetailsOnOff) ? false : true;
    displayDetails();
    medtc_btnDD.innerHTML = (displayDetailsOnOff) ? "Hide Folder Details" : "Display Folder Details";
    medtc_BuildFolders();
}

function medtc_display(fdrid) {
    var dv = document.getElementById("medtc_dv_" + fdrid);
    var fdr = document.getElementById("medtc_fdr_" + fdrid);
    var fdrs = document.getElementsByClassName("medtc_fdrs");

    for (var i = 0; i < fdrs.length; i++) {
        fdrs[i].style.backgroundColor = "";
    }

    if (fdrid == 0) {
        medtc_Title.innerHTML = "";
    } else {
        medtc_FdrID = fdrid;
        fdr.style.backgroundColor = "orange";
        medtc_Title.innerHTML = " - [" + jsMedtcFolders.filter(d => d.FdrID == fdrid)[0].Folder + "]";
        medtc_Prms.FdrID = fdrid;

        if (dv) {
            var dsp = (dv.style.display == "none") ? "" : "none";
            dv.style.display = dsp;
        }
    }
}

function medtc_expall_click() {
    var fdrs = document.getElementsByClassName("medtc_dv");
    var dsp;

    if (medtc_upDown.value == 0) {
        medtc_upDown.value = 1;
        medtc_upDown_img.src = "images/expandCollapseUP.png";
        dsp = "";
    } else {
        medtc_upDown.value = 0;
        medtc_upDown_img.src = "images/expandCollapseDOWN.png";
        dsp = "none";
    }

    for (var i = 0; i < fdrs.length; i++) {
        fdrs[i].style.display = dsp;
    }
}

function medtc_selectExam(elem, guid, type) {
    //set everything to off
    for (var i = 0; i < medtc_ExamSelections.length; i++) {
        medtc_ExamSelections[i].elem.style.backgroundColor = "";
    }

    //check if elem is already selected
    if (medtc_ExamSelections.findIndex(d => d.elem == elem) > -1) {
        //remove only if exists along with the selected guid
        var rem = medtc_ExamSelections.filter(d => d.elem == elem && d.guid == guid);
        medtc_ExamSelections = medtc_ExamSelections.filter(d => rem.findIndex(e => e.elem == d.elem && e.guid == d.guid) == -1);

        //do the same for class elems
        var classElems = document.getElementsByClassName(guid);
        for (var i = 0; i < classElems.length; i++) {
            var rem = medtc_ExamSelections.filter(d => d.elem == classElems[i] && d.guid == guid);
            medtc_ExamSelections = medtc_ExamSelections.filter(d => rem.findIndex(e => e.elem == d.elem && e.guid == d.guid) == -1);
        }
        console.log("medtc, rem guid", guid, medtc_ExamSelections);

    } else {
        //remove elem if exists with another guid
        medtc_ExamSelections = medtc_ExamSelections.filter(d => d.elem != elem);
        //add elem with selected guid
        medtc_ExamSelections.push({ elem: elem, guid: guid });


        //do the same for class elems
        var classElems = document.getElementsByClassName(guid);
        for (var i = 0; i < classElems.length; i++) {
            medtc_ExamSelections = medtc_ExamSelections.filter(d => d.elem != classElems[i]);
            medtc_ExamSelections.push({ elem: classElems[i], guid: guid });
        }
    }

    //set everything to on
    //set everything to off
    for (var i = 0; i < medtc_ExamSelections.length; i++) {
        medtc_ExamSelections[i].elem.style.backgroundColor = "orange";
    }

    console.log("medtc", medtc_ExamSelections);
}

function medtc_examExpandCollapse(cls) {
    var arrUD = ["UP", "DOWN"];
    var img = document.getElementById(cls + "_img");
    var ud = document.getElementById(cls + "_input");
    var elems = document.getElementsByClassName(cls);
    for (var i = 0; i < elems.length; i++) {
        elems[i].style.display = (ud.value == 0) ? "none" : "";
    }
    ud.value = (ud.value == 1) ? 0 : 1;
    img.src = "images/expandCollapse" + arrUD[ud.value] + ".png";
}

function MapExamDocsToCMS(main, prms) {
    try {
        var FdrID = prms.FdrID;
        var FIDs = prms.FIDs;
        medtc_Prms = prms;
        medtc_Main = main;

        if (!FdrID) {

            main.style.height = "calc(100% - 50px)";
            main.style.width = "100%";
            main.style.overflow = "hidden";
            medtc_Title = document.getElementById("PopUp_" + main.id.split("_")[1] + "_hdr_appendTitle");
            var tblMinus = 100;
            if (!medtc_Title) {
                main.style.height = "calc(100% - 120px)";
                PageContainer.style.overflowY = "hidden";
                tblMinus = 0;
                xsection(main, [
                    "div|style=text-align:right" +
                    "|||button|class=longblueButton|onclick=MapExamDocsToCMS(null, medtc_Prms)|Submit Mapping" +
                    "|||label|class=padLeft10" +
                    "|||button|id=medtc_btnDD|class=longblueButton|onclick=medtc_DisplayDetails()|Display Folder Details",
                    "div|||label|Selected Folder|||label|id=" + main.id + "_hdr_appendTitle",
                    "hr"
                ]);
                medtc_Title = document.getElementById(main.id + "_hdr_appendTitle");

            } else {
                PopUpOpt(main, "button|class=longblueButton|onclick=MapExamDocsToCMS(null, medtc_Prms)|Submit Mapping");
                PopUpOpt(main, "button|id=medtc_btnDD|class=longblueButton|onclick=medtc_DisplayDetails()|Display Folder Details");
            }
            medtc_Title.className = "sm";
            medtc_Title.style.display = "";
            medtc_FdrID = -1

            xsection(main, [
                "div|style=height:100%|||table|id=medtc_main_tbl|style=width:100%; height:90%; border:solid 1px gray",
            ]);

            xsection(medtc_main_tbl, [
                "td|style=height:29px; width:500px; border-right:solid 1px gray;" +
                "|||div|style=border-bottom:solid 1px gray; text-align:right; padding:5px|||append|button|id=medtc_btnDisplayAllUnmapped|class=longblueButton|onclick=medtc_DisplayAllUnmapped()|Display " + ((medtc_AllUnmapped == 0) ? "Unmapped ONLY" : "ALL") +
                "|||back|div|id=medtc_exam|style=height:95%; overflow:auto",

                "td|style=width:500px)" +
                "|||div|class=cursor|onclick=medtc_expall_click()|style=height:29px; background-color:whitesmoke; border-bottom:solid 1px gray; padding:5px;" +
                "|||append|img|id=medtc_upDown_img|src=expandCollapseDOWN.png|style=height:10px; width:12px" +
                "|||input|type=hidden|id=medtc_upDown|value=0" +

                "|||cancel|div|id=medtc_main|style=padding:5px; height:95%; overflow:auto"
            ]);

            //main.parentElement.style.height = (main.parentElement.clientHeight + 50) + "px";

            RunMultiSP("_GetMapExamDocFolder,_GetCacheFolders", [{}, {}], function (results) {
                var js = results[0];
                jsMedtcFolders = results[1];
                jsMedtc = js;
                console.log("medtc 123", results);
                //BEGIN WITH EXAM PORTION
                medtc_BuildExams();

                //NOW GET FOLDERS  
                deNullJS(jsMedtcFolders, true);
                medtc_BuildFolders();
            });
        } else {
            var guids = [];
            for (var i = 0; i < medtc_ExamSelections.length; i++) {
                var xx = medtc_ExamSelections[i];
                if (guids.indexOf(xx.guid) == -1)
                    guids.push(xx.guid);
            }
            if (guids.length > 0) {
                console.log("medtc map", "_MapExamDocFolder", { guids: guids.join(","), fdrid: FdrID });
                getData(null, newFormData("_MapExamDocFolder", { guids: guids.join(","), fdrid: FdrID }), function (vr) {
                    jsMedtc = jparse(vr);

                    //update files
                    //update files
                    getData(null, newFormData("_GetFiles8", {}), function (vr) {
                        var tmpFiles = jparse(vr);
                        sortJS(tmpFiles, "FileName");
                        jsOFiles = tmpFiles;
                    }, null, true);

                    //unset folder
                    medtc_display(0);

                    //set everything to off and populate new maps
                    for (var i = 0; i < medtc_ExamSelections.length; i++) {
                        var xx = medtc_ExamSelections[i];
                        xx.elem.style.backgroundColor = "";

                        var maps = document.getElementsByClassName("medtc_" + xx.guid);
                        for (var m = 0; m < maps.length; m++) {
                            maps[m].innerHTML = jsMedtcFolders.filter(d => d.FdrID == FdrID)[0].Map;
                        }
                    }
                    medtc_ExamSelections = [];
                });
            }
        }
    } catch (ex) {
        console.log("err", ex);
    }
}

function medtc_DisplayAllUnmapped() {
    medtc_AllUnmapped = (medtc_AllUnmapped == 0) ? 1 : 0;
    medtc_btnDisplayAllUnmapped.innerHTML = (medtc_AllUnmapped == 0) ? "Display Unmapped ONLY" : "Display ALL";
    medtc_BuildExams();
}

function medtc_BuildExams() {
    var js = (medtc_AllUnmapped == 0) ? jsMedtc : jsMedtc.filter(d => !d.Map);
    var main = medtc_exam.parentElement.parentElement.parentElement;
    console.log("medtc main", js, medtc_Main, medtc_exam.parentElement.parentElement.parentElement); //, medtc_main.id);

    medtc_exam.innerHTML = "";
    xsection(medtc_exam, [
        "table|id=medtc_exam_tbl|style=height:" + (main.clientHeight - 20) + "px; width:100%"
    ]);

    if (js.length == 0)
        xsection(medtc_exam_tbl, ["tr|||td|class=pad10 sm|" + ((medtc_AllUnmapped == 0) ? "There are no exams available for this account" : "There are no unmapped exam document requests")]);

    var ExamID = "", LineID = "", DocReqID = "", mFdrID, ExamName, Module, ModNum = "", Question, QuestNum, DocRequest, xMap;
    for (var i = 0; i < js.length; i++) {
        var xx = js[i];
        //console.log("medtc", xx, { ExamID: ExamID, xxExamID: xx.ExamID, LineID: LineID, ModNum: ModNum, DocReqID: DocReqID });

        ExamName = (xx.ExamID == ExamID) ? "" : xx.Exam_Name.replace(/\|/g, "//").replace(/=/g, "~");
        Module = (xx.ExamID == ExamID && xx.ModNum == ModNum) ? "" : xx.Module.replace(/\|/g, "//").replace(/=/g, "~");
        Question = (xx.LineID == LineID) ? "" : xx.Question.replace(/\|/g, "//").replace(/=/g, "~");
        QuestNum = (xx.LineID == LineID) ? "" : xx.QuestNum.replace(/\|/g, "//").replace(/=/g, "~");
        DocRequest = (xx.DocReqID == DocReqID) ? "" : xx.Document_Request.replace(/\|/g, "//").replace(/=/g, "~");
        xMap = (!xx.Map) ? "NOT MAPPED" : xx.Map;
        ExamID = xx.ExamID;
        ModNum = xx.ModNum;
        LineID = xx.LineID;
        DocReqID = xx.DocReqID;

        console.log("medtc buildexam", { ExamName: ExamName, Module: Module, Question: Question, QuestNum: QuestNum, DocRequest: DocRequest, xMap: xMap, ExamID: ExamID, ModNum: ModNum, LineID: LineID, DocReqID: DocReqID });
        xsection(medtc_exam_tbl, [
            ((ExamName != "") ? "tr" +
                "|||td|style=border-bottom:solid 1px silver|class=navlink|onclick=medtc_examExpandCollapse('medtc_ec_" + ExamID + "')" +
                "|||append|img|class=cursor|id=medtc_ec_" + ExamID + "_img|style=height:10px; width:12px|src=expandCollapseDOWN.png" +
                "|||input|type=hidden|id=medtc_ec_" + ExamID + "_input|value=1" +
                "|||label|class=cursor bold padLeft10|Exam: " + ExamName : ""),
            ((Module != "") ? "tr" +
                "|||td|class=medtc_ec_" + ExamID + " bold cursor|style=display:none; padding-left:15px|onclick=medtc_selectExam(this, '" + ExamID + "_" + ModNum.trim() + "','Mod')|Module: " + ModNum + ": " + Module : ""),
            ((QuestNum != "") ? "tr" +
                "|||td|class=medtc_ec_" + ExamID + " " + ExamID + "_" + ModNum.trim() +
                " bold cursor|style=display:none; padding-left:30px|onclick=medtc_selectExam(this, '" + LineID + "','Line')|Question: " + QuestNum + ": " + Question : ""),
            ((DocRequest != "") ? "tr" +
                "|||td|class=medtc_ec_" + ExamID + " " + ExamID + "_" + ModNum.trim() + " " + LineID +
                " cursor|style=display:none; padding-left:45px|onclick=medtc_selectExam(this, '" + DocReqID + "','Doc')|Doc Request: " + DocRequest +
                //map
                "|||td|style=display:none; width:200px|" +
                //doc classes
                "class=medtc_ec_" + ExamID +
                " medtc_map" +
                " medtc_" + ExamID + "_" + ModNum.trim() +
                " medtc_" + ModNum.trim() +
                " medtc_" + LineID +
                " medtc_" + DocReqID +
                //display map
                "|" + xMap : ""),
        ]);
    }
}

function medtc_BuildFolders() {
    medtc_main.innerHTML = "";
    var maxTier = 1;
    var jsf = jsMedtcFolders.filter(d => d.isMine);

    for (var i = 0; i < jsf.length; i++) {
        maxTier = (maxTier < jsf[i].FdrIDs.split(",").length) ? jsf[i].FdrIDs.split(",").length : maxTier;
    }
    for (var i = 0; i < maxTier; i++) {
        var Tier = i + 1;
        var js = jsf.filter(d => d.FdrIDs.split(",").length == Tier && d.FdrID > 0);

        for (var ii = 0; ii < js.length; ii++) {
            var xx = js[ii];
            var sect = (Tier == 1) ? medtc_main : document.getElementById("medtc_dv_" + xx.Parent);

            //get badges
            var private, sharedBidirectional, sharedOutBound, sharedInBound, privateIconURL = "", iconOverlayURL = "";
            var thisJO = {}, isMine = true;

            thisJO = xx;
            isMine = (thisJO.CID == myCID) ? true : false;
            private = thisJO["Private"];
            sharedBidirectional = thisJO["UpDown"];
            sharedOutBound = (sharedBidirectional) ? true : thisJO["Up"];
            sharedInBound = (sharedBidirectional) ? true : thisJO["Down"];

            if (private) { privateIconURL = PRIVATE_BADGE_URL }
            if (sharedOutBound) { iconOverlayURL = SHARED_OUTBOUND_BADGE_URL }
            if (sharedInBound) { iconOverlayURL = SHARED_INDOUND_BADGE_URL }
            if (sharedBidirectional) { iconOverlayURL = SHARED_BIDIRECTIONAL_BADGE_URL }
            //end badges

            xsection(sect, [
                "div|style=padding-left:" + ((30 * i) + 10) + "px|class=medtc_fdrs|id=medtc_fdr_" + xx.FdrID +
                "|||div|id=medtc_xfdr_" + xx.FdrID + "|style=position:relative;" +
                "|||append|label|class=cursor|onclick=medtc_display(" + xx.FdrID + ")|icon=folder-" + ((xx.isMine) ? "manilla" : "notmine") + ".png|" + xx.Folder +
                //details
                "|||div|class=sm details|style=padding-bottom:10px; padding-left:20px; display:" + ((displayDetailsOnOff) ? "" : "none") + "|" +
                ((!thisJO.Company) ? "" :
                    "[" + thisJO.Company + "]" +
                    ((thisJO.RosettaMap == "") ? "" : " [Folder mapped to: " + thisJO.RosettaMap.replace(/~/g, " and ") + "]") +
                    ((!isMine || thisJO.Groups == "") ? "" : " [Groups: " + thisJO.Groups + "]") +
                    ((thisJO.Teams == "") ? "" : " [Teams: " + thisJO.Teams + "]")),
                "div|style=padding-left:" + ((30 * i) + 10) + "px;|||div|style=display:none|class=medtc_dv|id=medtc_dv_" + xx.FdrID
            ]);

            var xfdr = document.getElementById("medtc_xfdr_" + xx.FdrID);

            if (privateIconURL != "") // && 1 == 2)
                xsection(xfdr, ["img|src=" + privateIconURL + "|style=z-index:1000; width:12px; height:12px; top:0px; left:-7px;position:absolute;display:inline-block"]);

            if (iconOverlayURL != "")
                xsection(xfdr, ["img|src=" + iconOverlayURL + "|style=z-index:1000; width:11px; height:11px; top:2px; left:2px;position:absolute;display:inline-block"]);


        }
    }
}















// ============================================================
// SECTION: divChart widget — another custom scrollable/sortable data-grid family (parallel to jchart/njchart above)
// ============================================================
function dynElems(elems, main) {
    var arr = [];
    for (var i = 0; i < elems.length; i++) {
        var xx = elems[i];
        arr.push(xx.parent + "," + xx.id);
    }

    console.log("htmTest", arr.join("|"));
    getData(null, newFormData("_GetHTMLMaps", { elems: arr.join("|") }), function (vr) {
        try {
            var js = jparse(vr);

            for (var i = 0; i < js.length; i++) {
                var xx = js[i];
                var elem = elems.filter(d => d.id == xx.id)[0];
                xx.map = xx.map.split("|");
                xx.str = elem.str;
                xx.strEnd = elem.strEnd;
            }

            for (var i = js.length; i > 0; i--) {
                var xx = js[i - 1];
                var parent = js.filter(d => d.id == xx.parent);
                if (parent.length > 0) {
                    parent[0].str += xx.str + xx.strEnd;
                }
            }


            var rtn = "";
            var xjs = js.filter(d => d.parent == "");
            for (var i = 0; i < xjs.length; i++) {
                rtn = rtn + xjs[i].str + xjs[i].strEnd;
            }
            console.log("htmTest", rtn, js);
            main.insertAdjacentHTML("beforeEnd", rtn);
        } catch (ex) {
            console.log("htmTest", ex);
        }
    });
}

function strDynElems(jo) {
    var prnt = jo.parent, id = jo.id, str = jo.str;

    var type = str.split("|")[0];
    var arr = str.split("|");
    var nstr = "<" + type + " id=\"" + id + "\" ";
    var iHTML = "";

    for (var i = 1; i < arr.length; i++) {
        var attVal = arr[i].split("=");
        if (attVal.length == 1)
            iHTML = arr[i];
        else {
            var att = attVal[0];
            var val = attVal[1];
            if (att != "id") {
                var qut = (isNaN(val)) ? "\"" : "";
                nstr += att + "=" + qut + val + qut + " ";
            }
        }
    }
    nstr += ">" + iHTML;

    var nstrEnd = "";
    if (["input", "br", "select", "img"].indexOf(type) == -1)
        nstrEnd = "</" + type + ">";

    return { parent: prnt, id: id, str: nstr, strEnd: nstrEnd };
}
























var jsDivChart = [], jsDivChartWDs = [], jsDivChartWDVars = [], keepWDS = [];
function divChart_scroll(scrollDiv, hdrDiv) {
    console.log("err", scrollDiv, hdrDiv);
    setTimeout(function () {
        var dv = hdrDiv.id.split("_")[0];
        document.getElementById(dv + "_trFake").style.display = ""; //row in between header and top
        hdrDiv.style.position = "absolute";
        hdrDiv.style.top = (scrollDiv.scrollTop - 0) + "px";
    }, .5);
}


function divChartSort(main, sort) {
    var dcix = jsDivChart.findIndex(d => d.dv == main);
    var jo = jsDivChart[dcix];
    var js = jo.js;
    var sortDesc = jo.sortDesc; // == null) ? false : (sort != jo.sort) ? false : (jo.sortDesc) ? false : true;

    if (!sort)
        for (var key in js[0]) {
            sort = key;
            break;
        }

    try {
        if (js.length > 0)
            if (Object.keys(js[0]).indexOf(sort) > -1) {
                //NewSortJS(js, sort, sortDesc);
                console.log("err", sort, sortDesc, js);
                if (!sortDesc)
                    js.sort((a, b) => {
                        const valA = ((a[sort] == null) ? "" : a[sort]).toString().replace(/ /g, "").replace(/_/g, "");
                        const valB = ((b[sort] == null) ? "" : b[sort]).toString().replace(/ /g, "").replace(/_/g, "");
                        const result = valA.localeCompare(valB, undefined, { sensitivity: 'base' });
                        //console.log(`"${valA}" vs "${valB}" = ${result}`);
                        return result;
                    });
                else
                    js.sort((a, b) => {
                        const valA = ((a[sort] == null) ? "" : a[sort]).toString().replace(/ /g, "").replace(/_/g, "");
                        const valB = ((b[sort] == null) ? "" : b[sort]).toString().replace(/ /g, "").replace(/_/g, "");
                        const result = valB.localeCompare(valA, undefined, { sensitivity: 'base' });
                        //console.log(`"${valA}" vs "${valB}" = ${result}`);
                        return result;
                    });
            };
        //console.log("err", js, sort, sortDesc);
    } catch (ex) {
        console.log("err", ex, js);
    }

    jo.js = js;
    return jo
}


function sort_divChart(dv, main, sort) {
    document.getElementById(dv + "_mainRendering").style.display = "";
    document.getElementById(dv + "_tblOuter").style.visibility = "hidden";
    var dcix = jsDivChart.findIndex(d => d.dv == main);
    var hdrs = null;
    //alert(dcix);
    if (dcix > -1) {
        var sortDesc = (jsDivChart[dcix].sort != sort) ? jsDivChart[dcix].sortDesc : (jsDivChart[dcix].sortDesc) ? false : true;
        jsDivChart[dcix].sort = sort;
        jsDivChart[dcix].sortDesc = sortDesc;
        hdrs = jsDivChart[dcix].hdrs;
        //alert(sortDesc);
    }
    console.log("err sort", jsDivChart);
    setTimeout(function () { divChart(main, null, sort, ((!sortDesc) ? null : sortDesc), null, hdrs, null, onload); }, 100);

}

function systemResize(main, div, wd) {
    observer.disconnect();
    var elemName = div.getAttribute('name');
    var elems = document.getElementsByName(elemName);
    elems.forEach(function (d) { d.style.width = wd; });

    try {
        var kwdix = keepWDS.findIndex(d => d.name == elemName);
        if (kwdix > -1) {
            keepWDS[kwdix].wd = div.offsetWidth;
        }
    } catch (ex) {
    }

    var wdix = jsDivChartWDs.findIndex(d => d.elemName == elemName);
    if (wdix > -1)
        jsDivChartWDs[wdix].wd = div.offsetWidth;

    var dsix = divSpanOnOffs.findIndex(d => d.dv == main.id.split("_")[0]);
    divSpanOnOffs[dsix].onOff = false;
    console.log("err dvname", div);
    setTimeout(function () {
        observer.observe(main);
    }, 500);
}

function makeResizable(main, div, minWidth = 50, maxWidth = Infinity) {
    //console.log("observe", main);
    const handle = document.createElement('div');
    handle.style.cssText = `
        position: absolute;
        right: 0;
        top: 0;
        width: 5px;
        height: 100%;
        cursor: ew-resize;
        background: transparent;
        z-index: 999;
    `;
    div.style.position = 'relative';
    div.appendChild(handle);

    // Overlay to block all mouse events during resize
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        cursor: ew-resize;
    `;
    document.body.appendChild(overlay);

    let isResizing = false;
    let startX, startWidth;

    handle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startWidth = div.offsetWidth;
        observer.disconnect();
        overlay.style.display = 'block'; // block everything underneath
        e.preventDefault();
        e.stopPropagation();
    });

    overlay.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + (e.clientX - startX)));
        div.style.width = newWidth + 'px';

        var elemName = div.getAttribute('name');
        var elems = document.getElementsByName(elemName);
        elems.forEach(function (d) { d.style.width = newWidth + "px"; });
    });

    overlay.addEventListener('mouseup', (e) => {
        if (!isResizing) return;
        isResizing = false;
        overlay.style.display = 'none'; // remove blocker
        document.body.style.cursor = 'default';
        document.body.style.userSelect = '';
        // Swallow the click after drag
        document.addEventListener('click', blockClick, true);

        var elemName = div.getAttribute('name');
        console.log("resize", main, elemName);
        var elems = document.getElementsByName(elemName);
        elems.forEach(function (d) { d.style.width = div.offsetWidth + "px"; });
        console.log("err", div);
        try {
            var kwdix = keepWDS.findIndex(d => d.name == elemName);
            if (kwdix > -1) {
                keepWDS[kwdix].wd = div.offsetWidth;
            }
            console.log("err keepwds", kwdix, keepWDS, elemName);
        } catch (ex) {
            console.log("err keepwds", ex, keepWDS, elemName);
        }

        var wdix = jsDivChartWDs.findIndex(d => d.elemName == elemName);
        if (wdix > -1)
            jsDivChartWDs[wdix].wd = div.offsetWidth;

        console.log("uncaught", divSpanOnOffs, main.id.split("_")[0]);
        var dsix = divSpanOnOffs.findIndex(d => d.dv == main.id.split("_")[0]);
        divSpanOnOffs[dsix].onOff = false;

        setTimeout(function () {
            observer.observe(main);
        }, 500);
    });
}

/* UNUSED — exact duplicate of the blockClick declared immediately below; the second one wins and
   this one can never run.
function blockClick(e) {
    e.stopPropagation();
    e.preventDefault();
    document.removeEventListener('click', blockClick, true);
}
*/
// Capture and swallow the click that fires after mouseup
function blockClick(e) {
    e.stopPropagation();
    e.preventDefault();
    document.removeEventListener('click', blockClick, true);
}

function divChartSelectCols(dcix) {
    var xx = jsDCIX[dcix];
    console.log("err dc", xx);

    PopUp("SortTable", {
        title: "Manage Columns",
        type: "Columns",
        final: xx.hdrs,
        arr: xx.slctHdrs,
        func: "divChartSelectColsGO(" + dcix + ")"
    }, null, true);
}

function divChartSelectColsGO(dcix) {
    var x = [];
    for (var i = 0; i < datSortTableFinal.length; i++) {
        x.push(datSortTableFinal[i].val);
    }
    var xx = jsDivChart[dcix];
    var zz = jsDCIX[dcix];
    xx.hdrs = x;
    zz.hdrs = x;
    divChart(xx.dv);
    closePopUp("SortTable");
}

var runspan = true;
function divChart(main, js, sort, sortDesc, scrollIX, hdrs, func, onload, data, slctCols) {
    main.innerHTML = "";
    console.log("err onload", sort, sortDesc, onload);

    //get stored sort data at the bottom first
    var runDivChart = function () {
        //set js
        var dcix = jsDivChart.findIndex(d => d.dv == main);

        if (dcix == -1) {
            //add new js
            const guid = crypto.randomUUID();
            hdrs = (!hdrs) ? Object.keys(js[0]) : hdrs
            jsDivChart.push({ id: guid, dv: main, js: js, sort: sort, sortDesc: sortDesc, hdrs: hdrs, slctHdrs: hdrs, func: func, data: data, onload: onload, slctCols: slctCols });
            jsDCIX.push({ dcix: dcix, hdrs: hdrs, slctHdrs: Object.keys(js[0]) });

        } else {
            //get existing js
            var xx = jsDivChart[dcix];
            js = xx.js;
            sortDesc = xx.sortDesc; // (sort != xx.sort) ? false : (!xx.sortDesc) ? true : false;
            sort = xx.sort; // (!sort) ? xx.sort : sort;
            hdrs = xx.hdrs;
            func = xx.func;
            data = xx.data;
            onload = xx.onload;
            slctCols = xx.slctCols;

            //set edited vals for existing js
            xx.js = js;
            xx.sort = sort;
            xx.sortDesc = sortDesc;
        }
        //reset js ix
        var dcix = jsDivChart.findIndex(d => d.dv == main);

        //clear dv
        main.innerHTML = "";


        //get id
        var dv = "dc" + dcix;
        if (!data)
            data = {};
        data.thisDV = dv;

        //set divSpans onOff
        var dsix = divSpanOnOffs.findIndex(d => d.dv == dv);
        if (dsix == -1)
            divSpanOnOffs.push({ dv: dv, onOff: true });


        //set main containers
        xsection(main, [
            "div|id=" + dv + "_mainRendering|class=sm padLeft10|Please wait while the report is rendering ...",
            "div|id=" + dv + "_tblOuter|style=visibility:hidden; height:calc(100% - 10px); width:calc(100%-10px); width:100%" +
            "|||div|id=" + dv + "_tblMain|style=position:relative; height:calc(100% - 10px); overflow:auto; width:100%; white-space:nowrap" //+
            //"|||div|style=text-align:right|class=padRight10|||button|id=" + dv + "_spanPage|disabled=true|Span Page"
        ]);
        main.style.overflow = "hidden";

        //run sort
        var jo = divChartSort(main, sort);
        js = jo.js;

        //Headers 
        var wds = [];
        var xx = js[0];
        nsection(dv + "_tblMain", [
            "div|id=" + dv + "_trHdr|class=bold|style=z-index:2000; background-color:white; position:relative; top:0px; left:0px",

        ]);
        nsection(dv + "_trHdr", [
            "div|style=white-space:nowrap; padding:5px;display:inline-block; width:40px" +
            "|class=jchartHdrsOuter" +
            "|name=xx" + dv + "_tdCol_x|id=xx" + dv + "_tdHdrCol_x" +
            ((slctCols) ?
                "|||img|src=3col-icon.png|class=icon cursor|style=height:12px|onclick=divChartSelectCols(" + dcix + ")" :
                "|||br|||div|style=visibility:hidden|Index")
        ]);



        //headers
        for (var ix = 0; ix < hdrs.length; ix++) {
            var arr = hdrs[ix].split(":");
            key = arr[0];
            var keyDisplay = (arr.length > 1) ? arr[1] : key;

            var xclass = (sort == key) ? "jchartHdrsOuterSorted" : "jchartHdrsOuter";

            nsection(dv + "_trHdr", [
                "div|style=border-right:solid 1px white; padding:5px; display:inline-block|class=cursor " + xclass +
                "|onclick=runspan~false; sort_divChart('" + dv + "'," + main.id + ", '" + key + "')" +
                "|name=" + dv + "_tdCol_" + ix + "|id=" + dv + "_tdHdrCol_" + ix +
                "|||div|style=display:inline-block; width:calc(100% - 2px); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; |id=" + dv + "_tdHdrCol_" + ix + "_txt"
            ]);


            var col = document.getElementById(dv + "_tdHdrCol_" + ix);
            var colTxt = document.getElementById(dv + "_tdHdrCol_" + ix + "_txt");
            colTxt.innerHTML = keyDisplay.replace(/_/g, " ");

            //col.parentElement.addEventListener("click", function () {
            //    runspan = false;
            //    sort_divChart(dv, main, key, onload);
            //})

            //left right buttons
            xsection(col, [
                "div|id=" + dv + "_tdHdrCol_" + ix + "_btns|class=padLeft10|style=display:none; white-space:nowrap; user-select: none; -webkit-user-select: none;" +
                "|||label|id=" + dv + "_col_LRL_" + ix + "|class=sm pad5 cursor|onclick=divChartHdrLR(event, '" + dv + "_tdCol_" + ix + "', -10, '" + dv + "')|ondblclick=divChartHdrLR(event, '" + dv + "_tdCol_" + ix + "', -1000, '" + dv + "')|<" +
                //"|||label|&nbsp;&nbsp;" +
                "|||label|id=" + dv + "_col_LRR_" + ix + "|class=sm pad5 cursor|onclick=divChartHdrLR(event, '" + dv + "_tdCol_" + ix + "', 10, '" + dv + "')|ondblclick=divChartHdrLR(event, '" + dv + "_tdCol_" + ix + "', 200, '" + dv + "')|>"
            ]);


            makeResizable(document.getElementById(dv + '_tblMain'), col, 60);


            //get col width
            var keepwdix = keepWDS.findIndex(d => d.name == col.getAttribute("name"))
            if (keepwdix == -1) {
                wds.push({ name: col.getAttribute("name"), wd: col.offsetWidth });
                keepWDS.push({ name: col.getAttribute("name"), wd: col.offsetWidth });
            } else
                wds.push(keepWDS[keepwdix]);


        }

        //set onscroll to reposition the header row
        document.getElementById(dv + "_tblMain").addEventListener("scroll", function () {
            divChart_scroll(document.getElementById(dv + "_tblMain"), document.getElementById(dv + "_trHdr"))
        });

        nsection(dv + "_tblMain", [
            "div|id=" + dv + "_trFake|style=display:none;height:fit-content",
        ]);
        nsection(dv + "_trFake", [
            "div|style=white-space:nowrap; overflow:hidden; text-overflow:ellipsis; padding:10px;display:inline-block; height:fit-content; width:40px;|&nbsp;"
        ]);

        //Cols
        var bgclr = "whitesmoke";
        for (var i = 0; i < js.length; i++) {
            bgclr = (bgclr == "whitesmoke") ? "white" : "whitesmoke";
            var xx = js[i];
            nsection(dv + "_tblMain", [
                "div|id=" + dv + "_trLine_" + i + "|style=height:fit-content",
            ]);
            nsection(dv + "_trLine_" + i, [
                "div|style=white-space:nowrap; overflow:hidden; text-overflow:ellipsis; background-color:" + bgclr + "; padding:5px;display:inline-block; height:fit-content; width:40px;" +
                "|name=" + dv + "_tdCol_x|" + (i + 1)
            ]);

            for (var ix = 0; ix < hdrs.length; ix++) {
                var key = hdrs[ix].split(":")[0];

                //set style and class from func
                var xstyle = "";
                var xclass = "";
                var fjo = { style: null, class: null, text: null, title: null, elem: null, elemFunc: null };
                if (func) {
                    fjo = func(xx, i, key, data);
                    //console.log("err fjo", fjo);
                    if (fjo) {
                        if (fjo.style)
                            xstyle = fjo.style;
                        if (fjo.class)
                            xclass = fjo.class;
                    }
                }
                fjo = (!fjo) ? {} : fjo;

                const isoDatePattern = /^\d{4}-\d{2}-\d{2}T/;
                var ans = xx[key];

                if (typeof ans === 'string' && isoDatePattern.test(ans)) {
                    let dt = new Date(ans);
                    if (dt instanceof Date && !isNaN(dt.getTime())) {
                        ans = ans.split("T")[0];
                    }
                }

                ans = (fjo.text) ? fjo.text : (ans == "ZREMOVE") ? "" : ans;
                var elem = fjo.elem;
                var elemFunc = fjo.elemFunc;

                nsection(dv + "_trLine_" + i, ["div|style=border-right:solid 1px " + ((bgclr == "white") ? "whitesmoke" : "white") + "; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; background-color:" + bgclr + "; min-height:25px; height:fit-content; padding:5px;display:inline-block; " + xstyle +
                    "|class=" + xclass + "|name=" + dv + "_tdCol_" + ix + "|id=" + dv + "_tdCol_" + i + "_" + ix]);
                var thisCol = document.getElementById(dv + "_tdCol_" + i + "_" + ix);

                if (!elem)
                    thisCol.innerHTML = ans;
                else
                    xsection(thisCol, elem);
                
                if (elemFunc != null)
                    elemFunc();

                thisCol.title = ((!fjo) ? ans : (fjo.title) ? fjo.title : ans);

                makeResizable(document.getElementById(dv + '_tblMain'), thisCol, 60);

                //set events from func
                if (fjo)
                    for (var fKey in fjo) {
                        //console.log("err", fjo, fKey);
                        if (["style", "class", "title", "text", "elem", "elemFunc"].indexOf(fKey) == -1)
                            thisCol.addEventListener(fKey, fjo[fKey]);
                    }
            }
        }


        //format the chart
        setTimeout(function () {
            //set widths
            for (var i = 0; i < wds.length; i++) {
                var wdix = jsDivChartWDs.findIndex(d => d.elemName == wds[i].name);
                if (wdix > -1)
                    wds[i].wd = jsDivChartWDs[wdix].wd

                document.getElementsByName(wds[i].name).forEach(function (d) {
                    d.style.width = wds[i].wd + "px";
                });
            }

            //set widths to span the page
            jsDivChartWDVars = jsDivChartWDVars.filter(d => d.dv != dv);
            jsDivChartWDVars.push({ main: main, dv: dv, hdrs: hdrs, wds: wds });

            divChart_Span(dv);


            //resizeobsever
            const div = document.getElementById(dv + '_tblMain');
            observer.observe(div);
            //end span

            // Observe parent for popup resize → re-span columns to fill width
            if (main._dcResizeObs) main._dcResizeObs.disconnect();
            main._dcResizeObs = new ResizeObserver(function () {
                divChart_Span(dv);
            });
            main._dcResizeObs.observe(main);

            //remove rendering msg and display chart
            document.getElementById(dv + "_mainRendering").style.visibility = "hidden";
            document.getElementById(dv + "_tblOuter").style.visibility = "";

            //scroll into view after sort
            if (scrollIX)
                document.getElementById(dv + "_tblMain").scrollLeft = scrollIX;

            if (typeof SiteHeader !== "undefined" && SiteHeader)
                SiteHeader.scrollTop = 0;
            if (onload)
                onload(dv);

            //document.getElementById(dv + "_spanPage").addEventListener("click", function () { divChart_Span(main, dv, hdrs, wds); });
            //document.getElementById(dv + "_spanPage").disabled = false;
        }, 100);
    }
    var xtra = currentFormID; // (main.id == "ldr_main") ? currentReportID : currentFormID;
    //alert(currentReportID);
    getData(null, newFormData("_GetJChartSort", { dvid: main.id, xtra: xtra }), function (vr) {
        jsDivChart = jsDivChart.filter(d => d.dv != main.id);
        var jsSort = jparse(vr);
        //alert(sort + "..." + vr);
        if (!sort) {
            if (jsSort.length > 0) {
                sort = jsSort[0].SortCol;
                sortDesc = (jsSort[0].SortDesc == "desc") ? true : false;
            }
            console.log("err", main, sort, sortDesc);
            runDivChart();
        } else {
            //alert(sortDesc + "..." + ((sortDesc != null) ? "desc" : "false"));
            getData(null, newFormData("_StoreJChartSort", { dvid: main.id, sortcol: sort, sortdesc: (sortDesc != null) ? "desc" : "", xtra: currentFormID }), function (vr) {
                runDivChart();
            });
        }
    });


}

function divChart_Span(dv) {
    const now = Date.now();

    var dvix = jsDivChartWDVars.findIndex(d => d.dv == dv);
    var dc = jsDivChartWDVars[dvix];
    console.log("uncaught", dv, jsDivChartWDVars);
    var main = dc.main;
    var hdrs = dc.hdrs;
    var wds = dc.wds;
    var mainWidth = main.clientWidth - 50;

    var dsix = divSpanOnOffs.findIndex(d => d.dv == dv);
    var onOff = divSpanOnOffs[dsix].onOff;


    //span the page
    if (onOff) {
        var maxwd = 40;
        for (var ix = 0; ix < hdrs.length; ix++) {
            var elem = document.getElementById(dv + "_tdHdrCol_" + ix);
            try { maxwd += elem.offsetWidth; } catch (ex) { }
        }
        if (maxwd > mainWidth + 20 || maxwd < mainWidth - 50) {
            var addwd;
            if (maxwd < mainWidth)
                addwd = ((mainWidth - maxwd) / (hdrs.length + 1));
            else
                addwd = ((maxwd - mainWidth) / (hdrs.length + 1));


            var xtralen = main.clientWidth - maxwd;
            var dividedBy = hdrs.length + 1;
            addwd = (xtralen < 0) ? addwd * -1 : addwd;

            //alert(jstring({ xtralen: xtralen, dividedBy: dividedBy, addwd: addwd }));

            for (var i = 0; i < wds.length; i++) {
                wds[i].wd += addwd;
                //wds[i].wd = (wds[i].wd < 60) ? 60 : wds[i].wd;
                //wds[i].wd = (wds[i].wd > 200) ? 200 : wds[i].wd;
            }

            //reset widths
            for (var i = 0; i < wds.length; i++) {
                var wdix = jsDivChartWDs.findIndex(d => d.elemName == wds[i].name);
                if (wdix > -1)
                    wds[i].wd = jsDivChartWDs[wdix].wd

                document.getElementsByName(wds[i].name).forEach(function (d) {
                    d.style.width = wds[i].wd + "px";
                });
            }
        }
    } else
        divSpanOnOffs[dsix].onOff = true;
}

/**************************************** xChart **************************************************************/


var xChartWds = [], xChartGotDBWds = false;

// ============================================================
// SECTION: xChart widget — a third custom data-grid variant (parallel to jchart/njchart and divChart above)
// ============================================================
function xChart_scroll(scrollDiv, hdrDiv) {
    setTimeout(function () {
        hdrDiv.style.position = "absolute";
        hdrDiv.style.top = (scrollDiv.scrollTop - 0) + "px";
    }, .5);
}

function xChartSort(main, elem, x) {
    if (x.js.length > 0) {
        var hdrs = x.hdrs;
        var elemName = elem.getAttribute("name");
        var arr = elemName.split("_");
        var sortIX = arr[arr.length - 1] * 1;
        var sortDesc = (x.sortIX != sortIX) ? false : (x.sortDesc) ? false : true;
        x.sortIX = sortIX;
        x.sortDesc = sortDesc;
        var sort = hdrs[x.sortIX];
        console.log("xchart", main, elem, x, sortIX, sortDesc);
        //alert(sort);
        getData(null, newFormData("_StoreJChartSort", { dvid: x.dv, sortcol: sort, sortdesc: (sortDesc != null) ? "desc" : "", xtra: currentFormID }), function (vr) {
            //alert(x.sortDesc + " " + sortDesc);

            try {
                if (Object.keys(x.js[0]).indexOf(sort) > -1) {
                    if (!sortDesc)
                        x.js.sort((a, b) => {
                            const valA = ((a[sort] == null) ? "" : a[sort]).toString().replace(/ /g, "").replace(/_/g, "");
                            const valB = ((b[sort] == null) ? "" : b[sort]).toString().replace(/ /g, "").replace(/_/g, "");
                            const result = valA.localeCompare(valB, undefined, { sensitivity: 'base' });
                            //console.log(`"${valA}" vs "${valB}" = ${result}`);
                            return result;
                        });
                    else
                        x.js.sort((a, b) => {
                            const valA = ((a[sort] == null) ? "" : a[sort]).toString().replace(/ /g, "").replace(/_/g, "");
                            const valB = ((b[sort] == null) ? "" : b[sort]).toString().replace(/ /g, "").replace(/_/g, "");
                            const result = valB.localeCompare(valA, undefined, { sensitivity: 'base' });
                            //console.log(`"${valA}" vs "${valB}" = ${result}`);
                            return result;
                        });
                };
            } catch (ex) {
                console.log("err", ex);
            }

            //console.log("xchart", x, Object.keys(x.js[0]).indexOf(sort), sortIX, sortDesc, sort);
            xChart(x);
        });
    }
}


function xChart(x) {
    var funcRunXChart = function () {
        observer.disconnect();
        //console.log("xchart", x, xChartWds);
        getData(null, newFormData("_GetJChartSort", { dvid: x.dv, xtra: (!x.xtra) ? currentFormID : x.xtra }), function (vr) {
            var js = jparse(vr);
            //if (x.sortIX == null) {
            x.sortIX = 0;
            x.sortDesc = false;
            //}
            console.log("err _GetJChartSort", { dvid: x.dv, xtra: x.xtra }, js);
            if (js.length > 0) {
                x.sortIX = x.hdrs.indexOf(js[0].SortCol);
                x.sortDesc = js[0].SortDesc;
            }

            x.main.innerHTML = "";
            deNullJS(x.js, true);

            //get headers
            var hdrs = [], hdrCntStr = ["60px"];
            if (x.hdrs) {
                for (var i = 0; i < x.hdrs.length; i++) {
                    hdrs.push(x.hdrs[i]);
                    var wdix = xChartWds.findIndex(d => d.dv == x.dv && d.ix == i);
                    if (wdix == -1)
                        hdrCntStr.push("1fr");
                    else
                        hdrCntStr.push(xChartWds[wdix].wd + "px");
                }
            } else {
                for (var key in x.js[0]) {
                    hdrCntStr.push("1fr")
                    hdrs.push(key);
                }
            }

            //build container
            xsection(x.main, [
                "div|id=@dv_tblMainWrap|class=dcTbl-wrap|style=max-width:" + x.main.clientWidth + "px;" +
                "|||div|id=@dv_tblMain|class=dcTbl|style=grid-template-columns:@gtc"
            ], { dv: x.dv, gtc: hdrCntStr.join(" ") });

            xChartObserver.observe(document.getElementById(x.dv + "_tblMainWrap"));

            // Observe parent for popup resize → update wrap max-width
            var xWrap = document.getElementById(x.dv + "_tblMainWrap");
            if (x.main._xResizeObs) x.main._xResizeObs.disconnect();
            x.main._xResizeObs = new ResizeObserver(function () {
                xWrap.style.maxWidth = x.main.clientWidth + "px";
            });
            x.main._xResizeObs.observe(x.main);

            //build headers
            xsection("@dv_tblMain", ["div|id=@dv_tblHead|class=dcTbl-head|||div|class=cell|"], { dv: x.dv });
            console.log("err sort on hdr", x.sortIX, x.hdrs[x.sortIX]);
            for (var ix = 0; ix < hdrs.length; ix++) {
                var key = hdrs[ix];
                var elemName = x.dv + "_tblCol_" + ix;
                //console.log("err xsort", x.sortIX, ix);
                //write header
                xsection("@dv_tblHead", ["div|id=@dv_tblHdr_@ix|name=@elemName|class=xChartHdr cell" + ((x.sortIX == ix) ? "Sorted" : "") + " cursor|@key"], { dv: x.dv, ix: ix, key: key, elemName: elemName });


                //make headers sortable
                document.getElementById(x.dv + "_tblHdr_" + ix).addEventListener("click",
                    function () {
                        xChartSort(x.main, this, x);
                    }
                );

                //make headers resizable
                xChartResizable(document.getElementById(x.dv + '_tblMain'), document.getElementById(x.dv + "_tblHdr_" + ix), 60, Infinity);

            }

            //scroll sticky header
            document.getElementById(x.dv + "_tblMainWrap").addEventListener("scroll", function () {
                xChart_scroll(this, document.getElementById(x.dv + "_tblHead"));
            });

            //build columns
            for (var i = 0; i < x.js.length; i++) {
                var xx = x.js[i];
                xsection("@dv_tblMain", ["div|id=@dv_tblRow_@i|class=dcTbl-row|||div|class=cell|@x"], { dv: x.dv, i: i, x: i + 1 });

                for (var ix = 0; ix < hdrs.length; ix++) {
                    var key = hdrs[ix];
                    var ans = (xx[key] == null) ? "" : convertDT(xx[key].toString().replace("ZREMOVE", ""));

                    var settings = {};
                    if (x.func)
                        settings = x.func(xx, i, key, x.data);

                    xsection("@dv_tblRow_@i", ["div|id=@dv_tblCol_@i_@ix|name=@dv_tblCol_@ix|class=cursor cell|@key"], { dv: x.dv, ix: ix, i: i, key: ans });
                    var elem = document.getElementById(x.dv + "_tblCol_" + i + "_" + ix);

                    //apply settings
                    elem.style += (settings.style) ? "; " + settings.style : "";
                    elem.className += (settings.class) ? " " + settings.class : "";
                    elem.title = (settings.title) ? settings.title : ans;

                    for (var key in settings) {
                        if (["click", "mouseover", "mouseout"].indexOf(key) > -1)
                            elem.addEventListener(key, settings[key]);
                    }
                }
            }
        });
    }

    if (xChartGotDBWds) {//already got ... now store wds
        getData(null, newFormData("_GetSetxChartWds", { js: jstring(xChartWds) }), function (vr) {
            funcRunXChart();
        });
    } else {//get wds
        getData(null, newFormData("_GetSetxChartWds", {}), function (vr) {
            xChartGotDBWds = true;
            console.log("err xChart Got from DB", jparse(vr)[0].JS);
            xChartWds = jparse(jparse(vr)[0].JS);
            console.log("err xChart Got from DB", xChartWds);
            funcRunXChart();
        });
    }
}

function xChartResizable(main, div, minWidth = 50, maxWidth = Infinity, x) {
    console.log("observe", main);
    const handle = document.createElement('div');
    handle.style.cssText = `
        position: absolute;
        right: 0;
        top: 0;
        width: 5px;
        height: 100%;
        cursor: ew-resize;
        background: transparent;
        z-index: 999;
    `;
    //div.style.position = 'relative';
    div.appendChild(handle);

    // Overlay to block all mouse events during resize
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        cursor: ew-resize;
    `;
    document.body.appendChild(overlay);

    let isResizing = false;
    let startX, startWidth;

    handle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startWidth = div.getBoundingClientRect().width;

        // Freeze the width so grid/table doesn't control it anymore
        div.style.width = startWidth + 'px';

        overlay.style.display = 'block'; // block everything underneath
        e.preventDefault();
        e.stopPropagation();
    });

    overlay.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        const delta = e.clientX - startX;
        const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + delta));
        div.style.width = newWidth + 'px';

        var elemName = div.getAttribute('name');
        var elems = document.getElementsByName(elemName);
        elems.forEach(function (d) { d.style.width = newWidth + "px"; });
    });

    overlay.addEventListener('mouseup', (e) => {
        if (!isResizing) return;
        isResizing = false;
        overlay.style.display = 'none'; // remove blocker
        document.body.style.cursor = 'default';
        document.body.style.userSelect = '';
        // Swallow the click after drag
        document.addEventListener('click', blockClick, true);

        var elemName = div.getAttribute('name');
        var elems = document.getElementsByName(elemName);
        elems.forEach(function (d) { d.style.width = div.offsetWidth + "px"; });

        var dv = elemName.split("_")[0];
        var ix = elemName.split("_")[elemName.split("_").length - 1] * 1;
        var wdix = xChartWds.findIndex(d => d.dv == dv && d.ix == ix);
        if (wdix > -1)
            xChartWds[wdix].wd = div.offsetWidth;
        else
            xChartWds.push({ dv: dv, ix: ix, wd: div.offsetWidth });



        //getData(null, )
        //xChart(x);
        console.log("xchart wds", xChartWds);
    });
}


var jsMyAlerts = [];
// ============================================================
// SECTION: "items alerted on" widget (compliance alert threshold picker) and color-picker popup
// ============================================================
function ItemsAlertedOn(main) {
    getData(null, newFormData("_GetMyAlerts2", {}), function (vr) {
        jsMyAlerts = jparse(vr);


        //PopUpOpt(main, "button|id=iao_True|class=longblueButton|onclick=ItemsAlertedOnGO(document.getElementById('" + main.id + "'), 'True')|Display Viewed Items");
        //PopUpOpt(main, "button|id=iao_False|class=longblueButton|style=display:none|onclick=ItemsAlertedOnGO(document.getElementById('" + main.id + "'), 'False')|Display UnViewed Items");
        xsection(PageContainer, [
            "table|style=width:100%; background-color:whitesmoke; padding:5px; border:solid 1px gray; box-shadow: 4px 4px 10px gray;|||tr|id=tblPCMain",
            //"hr",
            "div|id=pcMain|style=padding:20px; height:calc(100% - 20px); overflow:hidden"
        ])



        xsection(tblPCMain, [
            "td|class=smhdr bold pad5|style=font-size:14px|Items Alerted On",
            "td|style=text-align:right; padding-top:10px; padding-right:20px" +
            "|||append|button|id=iao_True|class=longblueButton|style=|onclick=ItemsAlertedOnGO(pcMain, 'True')|Display Viewed Items" +
            "|||button|id=iao_False|class=longblueButton|style=display:none|onclick=ItemsAlertedOnGO(pcMain, 'False')|Display UnViewed Items" +
            "|||label|class=padLeft10|&nbsp;" +
            "|||button|id=iao_Remove|class=longblueButton|style=display:none|onclick=IAORemoveItems()|Remove Selected Items"
        ])

        ItemsAlertedOnGO(pcMain, 'False');
    });
}

var iaoUV = false;
function ItemsAlertedOnGO(main, uv, filters) {
    main.innerHTML = "";
    iaoUV = uv;

    var js = jsMyAlerts.filter(d => d.Viewed == uv);
    iao_True.style.display = "";
    iao_False.style.display = "";
    document.getElementById('iao_' + uv).style.display = "none";
    console.log("err iao", jsMyAlerts);

    xsection(main, [
        "div|id=iao_Filters|style=padding:10px; border-bottom:1px solid #ccc;",
        "div|id=iao_Contents|style=height:calc(100% - 30px)"
    ]);
    if (jsDivChart.length > 0)
        jsDivChart[0].js = js;

    for (var i = 0; i < js.length; i++) {
        js[i].Remove = js[i].MainID + '_' + js[i].Type;
    }

    divChart(main, js, "DTAlerted", true, null, ["Remove", "Date_Alerted", "Type", "Item", "addtl_Info"],
    //xTable(main, {
    //    js: js,
    //    hdrs: ["Remove", "Date_Alerted", "Type", "Item", "addtl_Info"],
    //    sort: "DTAlerted",
        //    func: 
        function (xx, ix, key) {
            var Details = (xx.Details) ? xx.Details : "";
            var addtlInfo = (xx.addtl_Info) ? xx.addtl_Info : "";
            var addtlDates = (xx.addtlDates) ? xx.addtlDates : "";

            Details = xx.Item +
                ((Details == "") ? "" :
                    "\n-------------------------------------------------------\n" +
                    Details.replace(/\|/g, "\n")) +
                ((addtlInfo == "") ? "" :
                    "\n-------------------------------------------------------\n" +
                    addtlInfo.replace(/\|/g, "\n-------------------------------------------------------\n").replace(/~/g, "\n"));

            var rtn = {
                style: "font-size:10px; " + ((key == "Color") ? "background-color:" + xx.Color + "; color:" + getContrastColorNonRGB(xx.Color) + ";" : ""),
                class: "cursor lineclickrow_" + ix,
                mouseover: function () { ClassHover("lineclickrow_" + ix, true, "lightblue"); },
                mouseout: function () { ClassHover("lineclickrow_" + ix, false); },
                title: Details,
                click: function () {
                    if (key != "Remove")
                        window.opener.document.location.href = xx.URL;
                }
            }

            if (key == "Remove")
                rtn.text = xx.MainID + "_" + xx.Type;

            return rtn;
        }, function (dv) {
            systemResize(document.getElementById("dc0_tblMain"), dc0_tdHdrCol_0_txt.parentElement, 80);

            dc0_tdHdrCol_0_txt.style.fontSize = "12px";
            dc0_tdHdrCol_1_txt.style.fontSize = "12px";
            dc0_tdHdrCol_2_txt.style.fontSize = "12px";
            dc0_tdHdrCol_3_txt.style.fontSize = "12px";
            dc0_tdHdrCol_4_txt.style.fontSize = "12px";
            xxdc0_tdHdrCol_x.style.fontSize = "12px";
            xxdc0_tdHdrCol_x.style.padding = "8px";
            xxdc0_tdHdrCol_x.innerHTML = "&nbsp;";
            dc0_tdHdrCol_1_txt.innerHTML = "Date Alerted"
            dc0_tdHdrCol_4_txt.innerHTML = "Details";

            systemResize(document.getElementById("dc0_tblMain"), dc0_tdHdrCol_0, "100px");
            systemResize(document.getElementById("dc0_tblMain"), dc0_tdHdrCol_1, "100px");
            systemResize(document.getElementById("dc0_tblMain"), dc0_tdHdrCol_2, "100px");
            systemResize(document.getElementById("dc0_tblMain"), dc0_tdHdrCol_3, "300px");
            //systemResize(document.getElementById("dc0_tblMain"), dc0_tdHdrCol_3, "calc(100% - 550px)");
            var leftCol = document.getElementsByName("dc0_tdCol_x");
            for (var i = 0; i < leftCol.length; i++) {
                leftCol[i].style.fontSize = "10px";
            }

            var elems = document.getElementsByName("dc0_tdCol_0");
            for (var i = 1; i < elems.length; i++) {
                var elem = elems[i];
                var ei = elem.innerHTML.split("<")[0];
                elem.innerHTML = "";
                xsection(elem, ["input|type=checkbox|class=cbIAO|onclick=cbMultiSelectClass(event, 'cbIAO', " + (i - 1) + ", function(){cbIAO_click()})|value=" + (ei)])
            }
        }
    );
}

function cbIAO_click() {
    var elems = document.getElementsByClassName("cbIAO");
    var chkd = false;
    for (var i = 0; i < elems.length; i++) {
        if (elems[i].checked) {
            chkd = true;
            break;
        }
    }
    iao_Remove.style.display = (chkd) ? "" : "none";
}

function IAORemoveItems() {
    var elems = document.getElementsByClassName("cbIAO");
    var remItems = [];
    for (var i = 0; i < elems.length; i++) {
        if (elems[i].checked) {
            remItems.push(elems[i].value);
        }
    }
    iao_Remove.style.display = "none";
    jsMyAlerts = jsMyAlerts.filter(d => remItems.indexOf(d.MainID + "_" + d.Type) == -1);

    getData(null, newFormData("_RemoveAlertItems", { str: remItems.join(",") }), function (vr) {
        //console.log(vr)
        //done; do nothing
    });

    ItemsAlertedOnGO(pcMain, iaoUV);
}

//function colorPicker(main, func) {
//    main.style.overflow = "hidden";
//    main.parentElement.style.width = "345px";
//    main.parentElement.style.height = "495px";
//    func = function () {
//        alert("here");
//    };



function SelectColor(main, dat) {
    main.style.overflow = "hidden";
    main.parentElement.style.width = "310px";
    main.parentElement.style.height = "410px";
    document.getElementById("btnPopUpClose_" + main.id.split("_")[1]).innerHTML = "Cancel"

    var callback = dat[1];

    // ── State ────────────────────────────────────────────────────────────────
    let currentHex = colorToHex(dat[0]).toUpperCase(); // "#378ADD";

    // ── Helper functions ─────────────────────────────────────────────────────
    const PRESETS = [
        "#E24B4A", "#D85A30", "#EF9F27", "#639922",
        "#1D9E75", "#378ADD", "#7F77DD", "#D4537E",
        "#F0997B", "#FAC775", "#97C459", "#5DCAA5",
        "#85B7EB", "#AFA9EC", "#ED93B1", "#888780"
    ];

    function hexToHSL(hex) {
        let r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, s = 0, h = 0;
        if (max !== min) {
            let d = max - min; s = d / (l > 0.5 ? 2 - max - min : max + min);
            if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
            else if (max === g) h = ((b - r) / d + 2) / 6;
            else h = ((r - g) / d + 4) / 6;
        }
        return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
    }

    function hslToHex(h, s, l) {
        s /= 100; l /= 100;
        let c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2;
        let r = 0, g = 0, b = 0;
        if (h < 60) { r = c; g = x; } else if (h < 120) { r = x; g = c; } else if (h < 180) { g = c; b = x; }
        else if (h < 240) { g = x; b = c; } else if (h < 300) { r = x; b = c; } else { r = c; b = x; }
        return '#' + [r + m, g + m, b + m].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
    }

    function selectColor(hex) {
        currentHex = hex;
        updatePreview(hex);
    }

    function updatePreview(hex) {
        divBigPreview.style.background = hex;
        spnHexVal.textContent = hex.toUpperCase();
        const [h, s, l] = hexToHSL(hex);
        spnHslVal.textContent = `hsl(${h}, ${s}%, ${l}%)`;
        sH.value = h; vH.textContent = h;
        sS.value = s; vS.textContent = s + '%';
        sL.value = l; vL.textContent = l + '%';
        divPresets.querySelectorAll(".cp-dot").forEach(d => {
            d.classList.toggle("selected", d.dataset.hex === hex.toLowerCase());
        });
    }

    function onSlider() {
        const h = +sH.value, s = +sS.value, l = +sL.value;
        vH.textContent = h;
        vS.textContent = s + '%';
        vL.textContent = l + '%';
        const hex = hslToHex(h, s, l);
        currentHex = hex;
        divBigPreview.style.background = hex;
        spnHexVal.textContent = hex.toUpperCase();
        spnHslVal.textContent = `hsl(${h}, ${s}%, ${l}%)`;
        divPresets.querySelectorAll(".cp-dot").forEach(d => d.classList.remove("selected"));
        //if (callback) callback(hex.toUpperCase());
    }

    // ── Structure ────────────────────────────────────────────────────────────
    xsection(main, [
        "div|id=divPickerPanel|style=background:var(--color-background-primary);border-radius:12px;padding:1.25rem;width:280px",
    ]);

    xsection(divPickerPanel, [
        "div|id=divPresets",
        "div|id=divSliders|style=display:flex;flex-direction:column;gap:10px;margin:1rem 0",
        "div|id=divPreviewRow|style=display:flex;align-items:center;gap:12px"
    ]);

    // Preset swatches
    PRESETS.forEach(hex => {
        const dot = document.createElement("div");
        dot.className = "cp-dot";
        dot.style.cssText = "width:28px;height:28px;border-radius:50%;cursor:pointer;border:1.5px solid transparent;display:inline-block;margin:3px";
        dot.style.background = hex;
        dot.dataset.hex = hex.toLowerCase();
        dot.addEventListener("click", () => selectColor(hex));
        divPresets.appendChild(dot);
    });

    // HSL sliders
    xsection(divSliders, [
        "div|id=divRowH|style=display:flex;align-items:center;gap:10px",
        "div|id=divRowS|style=display:flex;align-items:center;gap:10px",
        "div|id=divRowL|style=display:flex;align-items:center;gap:10px"
    ]);

    xsection(divRowH, [
        "label|style=font-size:12px;color:var(--color-text-secondary);width:14px|H",
        "input|id=sH|type=range|min=0|max=360|step=1|style=flex:1",
        "span|id=vH|style=font-size:12px;color:var(--color-text-secondary);min-width:28px;text-align:right"
    ]);
    xsection(divRowS, [
        "label|style=font-size:12px;color:var(--color-text-secondary);width:14px|S",
        "input|id=sS|type=range|min=0|max=100|step=1|style=flex:1",
        "span|id=vS|style=font-size:12px;color:var(--color-text-secondary);min-width:28px;text-align:right"
    ]);
    xsection(divRowL, [
        "label|style=font-size:12px;color:var(--color-text-secondary);width:14px|L",
        "input|id=sL|type=range|min=5|max=95|step=1|style=flex:1",
        "span|id=vL|style=font-size:12px;color:var(--color-text-secondary);min-width:28px;text-align:right"
    ]);

    // Preview row
    xsection(divPreviewRow, [
        "div|id=divBigPreview|style=width:44px;height:44px;border-radius:8px;border:0.5px solid var(--color-border-tertiary);flex-shrink:0",
        "div|id=divHexInfo",
        "button|id=btnCopy|class=blueButton|SELECT"
    ]);

    xsection(divHexInfo, [
        "span|id=spnHexVal|style=font-size:13px;font-weight:500;font-family:var(--font-mono)",
        "span|id=spnHslVal|style=font-size:12px;color:var(--color-text-tertiary);margin-top:2px;display:block"
    ]);

    const sH = divPickerPanel.querySelector("#sH");
    const sS = divPickerPanel.querySelector("#sS");
    const sL = divPickerPanel.querySelector("#sL");
    const vH = divPickerPanel.querySelector("#vH");
    const vS = divPickerPanel.querySelector("#vS");
    const vL = divPickerPanel.querySelector("#vL");

    const btnCopy = divPickerPanel.querySelector("#btnCopy");


    // ── Event listeners ──────────────────────────────────────────────────────
    sH.addEventListener("input", (e) => { e.stopPropagation(); onSlider(); });
    sS.addEventListener("input", (e) => { e.stopPropagation(); onSlider(); });
    sL.addEventListener("input", (e) => { e.stopPropagation(); onSlider(); });

    btnCopy.addEventListener("click", (e) => {
        if (e.target === btnCopy)
            callback(currentHex.toUpperCase());
    });

    // ── Init ─────────────────────────────────────────────────────────────────
    updatePreview(currentHex);
}





var jsXTable = [];


// ============================================================
// SECTION: xTable widget — a fourth custom data-grid variant, with resizable/draggable columns and
// per-cell custom styling/events via a caller-supplied jo.func. Its row-building loop batches all
// rows into a DocumentFragment via xsectionFastElem (single DOM write) rather than appending live.
// ============================================================
function xTable(main, jo) {
    main.innerHTML = "";

    //save js vars
    var xtix = jsXTable.findIndex(d => d.main === main);
    if (xtix > -1 && !jo)
        jo = jsXTable[xtix].jo;
    else if (xtix > -1)
        jsXTable[xtix].jo = jo; //update in place rather than piling up stale duplicate entries for this same DOM node
    else
        jsXTable.push({ main: main, jo: jo });
    xtix = jsXTable.findIndex(d => d.main === main);


    //set values when empty
    jo.hdrs = (!jo.hdrs && jo.js.length > 0) ? Object.keys(jo.js[0]) : jo.hdrs;
    jo.sort = (jo.js.length == 0) ? jo.sort : (jo.sort) ? jo.sort : jo.hdrs[0];
    jo.wds = (!jo.wds) ? {} : jo.wds;
    jo.colFilters = (!jo.colFilters) ? {} : jo.colFilters;



    //sort js
    if (jo.js.length > 0 && jo.sort) {
        sortJS(jo.js, jo.sort, jo.sortDesc);
    }

    //apply any active column filters (Excel-style) for display only — jo.js stays the full set
    var xtJS = xtApplyColFilters(jo.js, jo.colFilters);

    //keep the Export-to-Excel/GChart source in sync with whatever xTable is currently showing (filtered or not)
    jsExportGChart = xtJS;


    //get id shortcut
    function getid(str, id) {
        return document.getElementById(str.replace(/@id/g, id));
    }



    //get id
    var dv = "xt" + xtix;
    if (!jo.data)
        jo.data = {};
    jo.data.thisDV = dv;

    //set divSpans onOff
    var dsix = divSpanOnOffs.findIndex(d => d.dv == dv);
    if (dsix == -1)
        divSpanOnOffs.push({ dv: dv, onOff: true });


    //drag and drop headers + click sorting event
    function dnd(el, i, hdr) {
        el.addEventListener('mousedown', function (e) {
            // Only trigger the resize if the user clicks near the right edge (within 10px)
            const rect = el.getBoundingClientRect();
            const clickX = e.clientX - rect.left;

            //sort by header
            if (rect.width - clickX > 10) {
                if (hdr != "xCorner") {
                    if (jo.sort == hdr)
                        jo.sortDesc = (jo.sortDesc) ? null : true;
                    else
                        jo.sortDesc = null;

                    jo.sort = hdr;
                    xTable(main);
                }
                window.getSelection().removeAllRanges();
            }

            // Store starting width and mouse position
            const startWidth = rect.width;
            const startX = e.clientX;
            let didResize = false;

            // Change the cursor for the whole page during the drag

            function onMouseMove(moveEvent) {
                // Calculate how far the mouse moved (positive for right, negative for left)
                window.getSelection().removeAllRanges();
                const currentX = moveEvent.clientX;
                const deltaX = currentX - startX;
                el.style.cursor = 'col-resize';

                // Set new width, ensuring it doesn't shrink below a minimum size (e.g., 30px)
                const newWidth = Math.max(30, startWidth + deltaX);
                el.style.width = newWidth + 'px';
                document.querySelectorAll('.' + main.id + '_xtCol_' + i).forEach(div => {
                    div.style.width = newWidth + "px";
                });
                jo.wds[hdr] = newWidth;
                didResize = true;
            }

            function onMouseUp() {
                // Clean up listeners and reset global cursor when user releases mouse
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                el.style.cursor = "pointer";
                window.getSelection().removeAllRanges();

                // notify the caller so column widths can be persisted (opt-in via jo.onColResize)
                if (didResize && typeof jo.onColResize === 'function')
                    jo.onColResize(hdr, jo.wds[hdr], jo.wds);
            }

            // Attach listeners to document so dragging works even if mouse leaves the div
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    //********************************************************************* BEGIN XTABLE ************************************************************/


    //MAIN SETTINGS
    main.style.whiteSpace = "nowrap";
    main.style.position = "relative";
    main.style.overflow = "hidden";

    //HEADER AND BODY
    xsection(main, ["div|id=" + main.id + "_xtHdrs|style=width:calc(100% - 5px); overflow:hidden"]);
    var xtHdrs = getid(main.id + "_xtHdrs", "");
    xsection(main, ["div|id=" + main.id + "_xtBody|style=width:calc(100% - 25px); height:calc(100% - " + (xtHdrs.clientHeight + 50) + "px); overflow:auto"]);
    var xtBody = getid(main.id + "_xtBody", "");


    //HEADERS

    //top corner
    xsection(xtHdrs, [
        "div|class=xtableHdr " + main.id + "_xtCol_1000|id=" + main.id + "_xtHdr_1000|style=cursor:pointer;|&nbsp;"
    ]);
    var xCorner = getid(main.id + "_xtHdr_@id", 1000)
    dnd(xCorner, 1000, "xCorner");
    xCorner.style.display = "inline-flex";
    xCorner.style.alignItems = "center";
    xCorner.style.justifyContent = "center";

    if (jo.allhdrs) {
        xsection(xCorner, ["img|class=cursor|style=height:12px; width:10px|src=3col-icon.png|id=" + main.id + "_colSelect"])
        getid(main.id + "_colSelect", "").addEventListener("click", function () {
            PopUp("SortTable", {
                title: "Manage Columns",
                type: "Columns",
                arr: jo.allhdrs,
                final: jo.hdrs,
                func: function () {
                    var x = [];
                    for (var i = 0; i < datSortTableFinal.length; i++) {
                        x.push(datSortTableFinal[i].val);
                    }
                    jo.hdrs = x;
                    xTable(main, jo);
                    closePopUp("SortTable");
                }
            }, null, true, null);
        });

    }

    //actual headers
    console.log(1035, "hdrs", jo.hdrs);
    for (var i = 0; i < jo.hdrs.length; i++) {
        var srt = (jo.sort == jo.hdrs[i]) ? "Sort" : "";

        xsection(xtHdrs, [
            "div|class=xtableHdr" + srt + " " + main.id + "_xtCol_" + i + "|id=" + main.id + "_xtHdr_" + i + "|style=cursor:pointer;"
        ]);
        var hdr = getid(main.id + "_xtHdr_@id", i);
        var hdrHasFilter = !!jo.colFilters[jo.hdrs[i]];
        hdr.style.display = "inline-flex";
        hdr.style.alignItems = "center";
        hdr.style.justifyContent = "space-between";
        hdr.style.overflow = "hidden";
        hdr.innerHTML = "<span style='overflow:hidden; text-overflow:ellipsis; white-space:nowrap;'>" + jo.hdrs[i] + "</span>" +
            "<span class='xtFilterIcon' title='Filter' style='flex:0 0 auto; margin-left:4px; width:16px; height:15px; display:inline-flex; align-items:center; justify-content:center; box-sizing:border-box; border:1px solid " +
            (hdrHasFilter ? "#ff8c00" : "#999999") + "; border-radius:3px; font-size:11px; line-height:1; font-weight:" +
            (hdrHasFilter ? "bold" : "normal") + "; color:" +
            (hdrHasFilter ? "#ffffff" : "#333333") + "; background-color:" +
            (hdrHasFilter ? "#ff8c00" : "#e8e8e8") + "; box-shadow: inset 0 -1px 1px rgba(0,0,0,0.12);'>&#9662;</span>";
        dnd(hdr, i, jo.hdrs[i]);

        (function (hdrName) {
            var icon = hdr.querySelector(".xtFilterIcon");
            icon.addEventListener("mousedown", function (e) { e.stopPropagation(); });
            icon.addEventListener("click", function (e) { xtOpenColFilter(e, main, jo, hdrName); });
        })(jo.hdrs[i]);
    }

    //COLUMNS
    var ws = 0; //alternating white/whitesmoke lines
    var xtBodyFrag = document.createDocumentFragment(); //build the whole body off-DOM, attach once
    var pendingElemFuncs = []; //elemFunc callbacks often re-query by id, so run them only after the fragment is live

    for (var b = 0; b < xtJS.length; b++) {
        var rowDiv = xsectionFastElem("div|id=" + main.id + "_xtableLine_" + b);

        //row number
        var elem = xsectionFastElem(
            "div|class=xtableCol xtableCol" + ws + " " + main.id + "_xtCol_1000|id=" + main.id + "_xtCol_" + b + "_1000|style=cursor:pointer;|" + (b + 1)
        );
        rowDiv.appendChild(elem);

        var dt = (!jo.func) ? {} : jo.func(xtJS[b], b, jo.hdrs[i], elem, jo.data);
        for (var key in dt) {
            if (key == "style")
                elem.style += ";" + dt[key];
            else if (key == "class")
                elem.className += " " + dt[key];
            else if (key == "text")
                elem.innerHTML = dt[key];
            else if (typeof dt[key] === 'function')
                elem.addEventListener(key, dt[key]);
            else
                elem.setAttribute(key, dt[key]);
        }

        //actual columns
        for (var i = 0; i < jo.hdrs.length; i++) {
            var elem = xsectionFastElem(
                "div|class=xtableCol xtableCol" + ws + " " + main.id + "_xtCol_" + i + "|id=" + main.id + "_xtCol_" + b + "_" + i
            );
            rowDiv.appendChild(elem);

            var val = xtJS[b][jo.hdrs[i]]
            val = (jo.hdrs[i].toLowerCase().indexOf("date") > -1) ? convertDTCentral(val) : val;
            val = (!val) ? "&nbsp;" : val;
            elem.innerHTML = String(val).replace(/ZREMOVE/g, "&nbsp;");

            var dt = (!jo.func) ? {} : jo.func(xtJS[b], b, jo.hdrs[i], elem, jo.data);
            var elemFunc;
            for (var key in dt) {
                if (key == "style")
                    elem.style += ";" + dt[key];
                else if (key == "class")
                    elem.className += " " + dt[key];
                else if (key == "text")
                    elem.innerHTML = dt[key];
                else if (key == "append")
                    xsection(elem, dt[key]);
                else if (key == "elemFunc")
                    elemFunc = dt[key];
                else if (typeof dt[key] === 'function')
                    elem.addEventListener(key, dt[key]);
                else
                    elem.setAttribute(key, dt[key]);
            }

            if (elemFunc)
                pendingElemFuncs.push(elemFunc);
        }

        xtBodyFrag.appendChild(rowDiv);
        ws = (ws == 0) ? 1 : 0;
    }

    xtBody.appendChild(xtBodyFrag); //single DOM write for the whole table body
    for (var pf = 0; pf < pendingElemFuncs.length; pf++)
        pendingElemFuncs[pf](); //run only once every row/cell is live, since these often look elements up by id

    console.log("xtable isScroll", jo.scrollTop, jo.scrollLeft);
    if (jo.scrollLeft)
        xtBody.scrollLeft = jo.scrollLeft;
    if (jo.scrollTop)
        xtBody.scrollTop = jo.scrolTop;


    xtBody.addEventListener('scroll', () => {
        //xtHdrs.style.width = xtBody.clientWidth + "px";
        xtHdrs.style.width = xtBody.clientWidth + "px";
        xtHdrs.scrollLeft = xtBody.scrollLeft;

        jo.scrollLeft = xtBody.scrollLeft;
        jo.scrollTop = xtBody.scrollTop;
        
        jsXTable[xtix].jo = jo;
    }, { passive: true }); // Passive improves scroll performance

    //MAIN RESIZER
    const ro = new ResizeObserver(entries => {
        xtHdrs.style.width = xtBody.clientWidth + "px";

        var wd = (jo.wds.xCorner) ? jo.wds.xCorner : 40; // (main.clientWidth - (hdrs.length * 2) - 10) / (hdrs.length + 0);
        document.querySelectorAll('.' + main.id + '_xtCol_' + 1000).forEach(div => {
            div.style.width = wd + "px";
        });

        for (var i = 0; i < jo.hdrs.length; i++) {
            var wd = (jo.wds[jo.hdrs[i]]) ? jo.wds[jo.hdrs[i]] : (main.clientWidth - (jo.hdrs.length * 2) - 90) / (jo.hdrs.length + 0);
            document.querySelectorAll('.' + main.id + '_xtCol_' + i).forEach(div => {
                div.style.width = wd + "px";
            });
        }
    });
    ro.observe(main);

    if (jo.onload)
        jo.onload(jo);
}


//returns jo.js rows matching every active column filter except excludeHdr (excludeHdr lets the
//open dropdown for a column show that column's own full unique-value list while still respecting
//filters on the OTHER columns — the same cross-filtering behavior Excel's AutoFilter uses)
function xtApplyColFilters(js, colFilters, excludeHdr) {
    var keys = Object.keys(colFilters || {});
    if (keys.length == 0)
        return js;

    return js.filter(function (row) {
        for (var k = 0; k < keys.length; k++) {
            var hdr = keys[k];
            if (hdr == excludeHdr)
                continue;

            var rule = colFilters[hdr];
            if (!rule)
                continue;

            var v = row[hdr];
            if (Array.isArray(rule)) {
                //Excel-style "select values" list
                v = (v === null || v === undefined || v === "") ? "(Blank)" : String(v);
                if (rule.indexOf(v) == -1)
                    return false;
            } else if (rule.custom) {
                //Excel-style "Custom Filter" (equals/contains/between/etc, optionally 2 conditions joined by And/Or)
                v = (v === null || v === undefined) ? "" : String(v);
                if (!xtCustomFilterPass(v, rule))
                    return false;
            }
        }
        return true;
    });
}

//operator list shared by the Custom Filter dropdown and its evaluator (value^label pairs for the xsection "options" DSL)
var xtCustomOps = "^Select..." +
    "~eq^equals~neq^does not equal" +
    "~begins^begins with~nbegins^does not begin with" +
    "~ends^ends with~nends^does not end with" +
    "~contains^contains~ncontains^does not contain" +
    "~gt^is greater than~gte^is greater than or equal to" +
    "~lt^is less than~lte^is less than or equal to" +
    "~between^is between~nbetween^is not between";

//compares two cell values numerically, then as dates, falling back to case-insensitive string compare
function xtCompareVal(a, b) {
    a = (a === null || a === undefined) ? "" : String(a);
    b = (b === null || b === undefined) ? "" : String(b);

    var numRE = /^-?\d+(\.\d+)?$/;
    if (numRE.test(a.trim()) && numRE.test(b.trim()))
        return parseFloat(a) - parseFloat(b);

    var ad = Date.parse(a), bd = Date.parse(b);
    if (!isNaN(ad) && !isNaN(bd))
        return ad - bd;

    return a.toLowerCase().localeCompare(b.toLowerCase());
}

//evaluates a single Custom Filter condition ({op, val1, val2}) against a cell's string value
function xtEvalCond(v, cond) {
    if (!cond || !cond.op)
        return true;

    var lv = v.toLowerCase();
    var b = (cond.val1 || "");
    var lb = b.toLowerCase();

    switch (cond.op) {
        case "eq": return lv == lb;
        case "neq": return lv != lb;
        case "begins": return lv.indexOf(lb) == 0;
        case "nbegins": return lv.indexOf(lb) != 0;
        case "ends": return b == "" || lv.slice(-b.length) == lb;
        case "nends": return !(b == "" || lv.slice(-b.length) == lb);
        case "contains": return lv.indexOf(lb) > -1;
        case "ncontains": return lv.indexOf(lb) == -1;
        case "gt": return xtCompareVal(v, b) > 0;
        case "gte": return xtCompareVal(v, b) >= 0;
        case "lt": return xtCompareVal(v, b) < 0;
        case "lte": return xtCompareVal(v, b) <= 0;
        case "between": return xtCompareVal(v, b) >= 0 && xtCompareVal(v, cond.val2 || "") <= 0;
        case "nbetween": return !(xtCompareVal(v, b) >= 0 && xtCompareVal(v, cond.val2 || "") <= 0);
        default: return true;
    }
}

//evaluates a Custom Filter rule ({custom:true, cond1, andOr, cond2}) against a cell's string value
function xtCustomFilterPass(v, rule) {
    var r1 = xtEvalCond(v, rule.cond1);
    if (!rule.cond2 || !rule.cond2.op)
        return r1;

    var r2 = xtEvalCond(v, rule.cond2);
    return (rule.andOr == "or") ? (r1 || r2) : (r1 && r2);
}

var xtFilterState = null;

function xtFilterVisibleValues() {
    var st = xtFilterState;
    var s = st.search.toLowerCase();
    return st.uniq.filter(function (v) { return s == "" || v.toLowerCase().indexOf(s) > -1; });
}

function xtRenderFilterList() {
    var st = xtFilterState;
    if (!st)
        return;

    var container = document.getElementById("xtFilterList");
    if (!container)
        return;
    container.innerHTML = "";

    var visible = xtFilterVisibleValues();
    for (var i = 0; i < visible.length; i++) {
        (function (val, ix) {
            var row = document.createElement("div");
            row.style.whiteSpace = "nowrap";

            var cb = document.createElement("input");
            cb.type = "checkbox";
            cb.id = "xtFCB_" + ix;
            cb.name = "xtFilterCB";
            cb.checked = !!st.selected[val];
            cb.addEventListener("click", function (e) { cbMultiSelect(e, "xtFilterCB", ix, xtSyncFilterSelected); });

            var lbl = document.createElement("label");
            lbl.htmlFor = cb.id;
            lbl.style.marginLeft = "4px";
            lbl.textContent = val;

            row.appendChild(cb);
            row.appendChild(lbl);
            container.appendChild(row);
        })(visible[i], i);
    }
}

function xtSyncFilterSelected() {
    var st = xtFilterState;
    if (!st)
        return;

    var visible = xtFilterVisibleValues();
    for (var i = 0; i < visible.length; i++) {
        var cb = document.getElementById("xtFCB_" + i);
        if (cb) st.selected[visible[i]] = cb.checked;
    }
}

//Excel-style "select values to keep" filter dropdown for an xTable column
function xtOpenColFilter(e, main, jo, hdr) {
    e.stopPropagation();

    var others = xtApplyColFilters(jo.js, jo.colFilters, hdr);
    var uniq = [];
    for (var i = 0; i < others.length; i++) {
        var v = others[i][hdr];
        v = (v === null || v === undefined || v === "") ? "(Blank)" : String(v);
        if (uniq.indexOf(v) == -1)
            uniq.push(v);
    }
    uniq.sort(function (a, b) { return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }); });

    var active = jo.colFilters[hdr];
    var activeIsList = Array.isArray(active); //custom-rule filters (see xtOpenCustomFilter) aren't a value list, so default to all-checked here
    var selected = {};
    for (var i = 0; i < uniq.length; i++) {
        selected[uniq[i]] = (!activeIsList) ? true : (active.indexOf(uniq[i]) > -1);
    }

    xtFilterState = { main: main, jo: jo, hdr: hdr, uniq: uniq, selected: selected, search: "" };

    DropMenu(e, "Filter: " + hdr, function () {
        return [
            "div|style=margin-bottom:6px" +
            "|||input|id=xtFilterSearch|type=text|placeholder=Search...|style=width:180px;",
            "div|style=margin-bottom:6px" +
            "|||label|class=alink sm|id=xtFilterSelectAll|Select All" +
            "|||label|class=alink sm padLeft10|id=xtFilterClearAll|Clear All",
            "div|id=xtFilterList|style=max-height:220px; overflow:auto; border:1px solid #ccc; padding:4px; background:white;",
            "div|style=margin-top:8px; text-align:right;" +
            "|||label|class=alink sm|id=xtFilterCustom|Custom Filter..." +
            "|||label|class=alink sm padLeft10|id=xtFilterClearCol|Clear Filter" +
            "|||button|id=xtFilterOK|class=longblueButton|style=margin-left:10px;padding:2px 10px;|OK"
        ];
    }, [], "xtFilterState ~ null");

    xtFilterCustom.addEventListener("click", function (e) {
        xtFilterState = null;
        closeDropMenu();
        xtOpenCustomFilter(e, main, jo, hdr);
    });

    xtFilterSearch.addEventListener("keyup", function () {
        var wasEmpty = xtFilterState.search === "";
        xtFilterState.search = this.value;
        if (wasEmpty && this.value !== "") {
            for (var i = 0; i < xtFilterState.uniq.length; i++) xtFilterState.selected[xtFilterState.uniq[i]] = false;
        }
        xtRenderFilterList();
    });
    xtFilterSelectAll.addEventListener("click", function () {
        var visible = xtFilterVisibleValues();
        for (var i = 0; i < visible.length; i++) xtFilterState.selected[visible[i]] = true;
        xtRenderFilterList();
    });
    xtFilterClearAll.addEventListener("click", function () {
        var visible = xtFilterVisibleValues();
        for (var i = 0; i < visible.length; i++) xtFilterState.selected[visible[i]] = false;
        xtRenderFilterList();
    });
    xtFilterClearCol.addEventListener("click", function () {
        delete jo.colFilters[hdr];
        closeDropMenu();
        xtFilterState = null;
        xTable(main, jo);
    });
    xtFilterOK.addEventListener("click", function () {
        var sel = [];
        for (var i = 0; i < xtFilterState.uniq.length; i++) {
            var v = xtFilterState.uniq[i];
            if (xtFilterState.selected[v]) sel.push(v);
        }

        if (sel.length == xtFilterState.uniq.length)
            delete jo.colFilters[hdr];
        else
            jo.colFilters[hdr] = sel;

        closeDropMenu();
        xtFilterState = null;
        xTable(main, jo);
    });

    xtRenderFilterList();
}


//Excel-style "Custom Filter" dialog for an xTable column (equals/contains/greater than/between/etc,
//optionally 2 conditions joined by And/Or) — reached via "Custom Filter..." in the value-list dropdown above
function xtOpenCustomFilter(e, main, jo, hdr) {
    var existing = jo.colFilters[hdr];
    existing = (existing && existing.custom) ? existing : { cond1: {}, andOr: "and", cond2: {} };

    DropMenu(e, "Custom Filter: " + hdr, function () {
        return [
            "div|style=margin-bottom:8px; font-weight:bold;|Show items where:",
            "div|id=xtCustomRow1|style=display:flex;align-items:center;gap:6px;margin-bottom:10px;" +
            "|||select|id=xtCustomOp1|style=min-width:170px;|options=" + xtCustomOps +
            "|||input|id=xtCustomVal1a|type=text|style=width:130px;" +
            "|||label|id=xtCustomAndLbl1|class=padLeft5|style=display:none;|and" +
            "|||input|id=xtCustomVal1b|type=text|style=width:130px; display:none;",
            "div|id=xtCustomAndOrRow|style=margin:0 0 10px 0;" +
            "|||input|type=radio|id=xtCustomAndRdo|name=xtCustomAndOr" +
            "|||label|for=xtCustomAndRdo|class=padLeft5|And" +
            "|||input|type=radio|id=xtCustomOrRdo|name=xtCustomAndOr|style=margin-left:14px;" +
            "|||label|for=xtCustomOrRdo|class=padLeft5|Or",
            "div|id=xtCustomRow2|style=display:flex;align-items:center;gap:6px;margin-bottom:10px;" +
            "|||select|id=xtCustomOp2|style=min-width:170px;|options=" + xtCustomOps +
            "|||input|id=xtCustomVal2a|type=text|style=width:130px;" +
            "|||label|id=xtCustomAndLbl2|class=padLeft5|style=display:none;|and" +
            "|||input|id=xtCustomVal2b|type=text|style=width:130px; display:none;",
            "div|style=text-align:right;margin-top:6px;" +
            "|||button|id=xtCustomCancel|class=longblueButton|style=padding:2px 10px;|Cancel" +
            "|||button|id=xtCustomOK|class=longblueButton|style=margin-left:8px;padding:2px 10px;|OK"
        ];
    }, [], null);

    //prefill from any existing custom rule for this column (values set directly to dodge the "|"/"=" DSL delimiters)
    xtCustomOp1.value = existing.cond1.op || "";
    xtCustomVal1a.value = existing.cond1.val1 || "";
    xtCustomVal1b.value = existing.cond1.val2 || "";
    xtCustomOp2.value = existing.cond2.op || "";
    xtCustomVal2a.value = existing.cond2.val1 || "";
    xtCustomVal2b.value = existing.cond2.val2 || "";
    xtCustomAndRdo.checked = (existing.andOr != "or");
    xtCustomOrRdo.checked = (existing.andOr == "or");

    function toggleBetweenUI(opSelect, andLbl, val2Input) {
        var isBetween = (opSelect.value == "between" || opSelect.value == "nbetween");
        andLbl.style.display = isBetween ? "inline" : "none";
        val2Input.style.display = isBetween ? "inline-block" : "none";
    }
    toggleBetweenUI(xtCustomOp1, xtCustomAndLbl1, xtCustomVal1b);
    toggleBetweenUI(xtCustomOp2, xtCustomAndLbl2, xtCustomVal2b);
    xtCustomOp1.addEventListener("change", function () { toggleBetweenUI(xtCustomOp1, xtCustomAndLbl1, xtCustomVal1b); });
    xtCustomOp2.addEventListener("change", function () { toggleBetweenUI(xtCustomOp2, xtCustomAndLbl2, xtCustomVal2b); });

    xtCustomCancel.addEventListener("click", function () { closeDropMenu(); });
    xtCustomOK.addEventListener("click", function () {
        var cond1 = { op: xtCustomOp1.value, val1: xtCustomVal1a.value, val2: xtCustomVal1b.value };
        var cond2 = { op: xtCustomOp2.value, val1: xtCustomVal2a.value, val2: xtCustomVal2b.value };
        var andOr = xtCustomOrRdo.checked ? "or" : "and";

        if (!cond1.op)
            delete jo.colFilters[hdr];
        else
            jo.colFilters[hdr] = { custom: true, cond1: cond1, andOr: andOr, cond2: cond2 };

        closeDropMenu();
        xTable(main, jo);
    });
}




// ============================================================
// SECTION: experimental virtual-node builder (hsection/buildHTML/hsFunc/vCreate/vSetAttr/vSetHTML/
// vAppend/vEscapeAttr/vSerialize) — see the unused-code check below; this looks like an abandoned
// alternate approach to xsection, superseded by ndynHTML/xsectionHTML/xsectionFast* further down.
// ============================================================
/* UNUSED — verified zero call sites anywhere in the active codebase for hsection, buildHTML, and
   hsFunc (the only usage is the commented-out example directly below this block). vCreate/vSetAttr/
   vSetHTML/vAppend/vEscapeAttr/vSerialize further down are a DIFFERENT, still-live set of helpers
   (used by ndynHTML/xsectionHTML/xsectionFast) — do not confuse the two.
function hsection(rootId, init) {
    var arr = [];
    //console.log("err", init);

    for (var i = 0; i < init.length; i++) {
        var xx = init[i].el;
        var iarr = xx.split("|");
        var jo = {
            id: iarr[0], tag: iarr[1], settings: {}, events: init[i].ev };

        for (var ii = 2; ii < iarr.length; ii++) {
            if (iarr[ii].split("=").length == 1)
                iarr[ii] = "innerHTML=" + iarr[ii];

            var part = iarr[ii].split("=")[0];
            var val = ((part == "src") ? "images/" : "") + iarr[ii].split("=")[1];

            jo.settings[part] = val;
        }

        arr.push(jo);
    }

    return arr;
}

function buildHTML(rootId, arr) {
    var voidTags = {
        br: 1, hr: 1, img: 1, input: 1, meta: 1, link: 1,
        area: 1, base: 1, col: 1, embed: 1, source: 1, track: 1, wbr: 1
    };

    function render(parentId) {
        return arr
            .filter(function (item) { return item.id === parentId; })
            .map(function (item) {
                var s = item.settings || {};

                var attrs = Object.keys(s)
                    .filter(function (k) { return k !== "innerHTML"; })
                    .map(function (k) { return " " + k + '="' + s[k] + '"'; })
                    .join("");

                // void elements: no closing tag, no content, no children
                if (voidTags[item.tag]) {
                    return "<" + item.tag + attrs + ">";
                }

                var children = s.id ? render(s.id) : "";

                return "<" + item.tag + attrs + ">" +
                    (s.innerHTML || "") + children +
                    "</" + item.tag + ">";
            })
            .join("");
    }

    document.getElementById(rootId).innerHTML = render(rootId);
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].events) {
            for (var key in arr[i].events) {
                arr[i].events[key]();
            }
        }
    }
}

function hsFunc(rootId, type, func) {
    return function () { document.getElementById(rootId).addEventListener(type, func) };
}
*/


//setTimeout(function () {
//    PageContainer.innerHTML = "";
//    var func = hsFunc("div4", "click", function () { alert("div4 clicked"); });

//    var arr = hsection("PageContainer", [
//        { el: "PageContainer|div|id=divMain" },
//        { el: "divMain|div|id=div2|class=padLeft10|this is div2" },
//        { el: "div2|div|id=div3|class=padLeft10|this is div3" },
//        { el: "divMain|div|id=div4|class=padLeft10|this is div4", ev: { click: func } },
//        { el: "divMain|br" },
//        { el: "divMain|div|id=div5|class=padLeft10|this is div5" },
//        { el: "div2|div|id=div6|class=padLeft10|this is div6" }
//    ]);

//    buildHTML("PageContainer", arr);
//}, 1500)






//////////////////////////////////////////////////////////
// Virtual-node helpers (stand-ins for createElement/appendChild/etc.)
//////////////////////////////////////////////////////////

var VOID_TAGS = {
    area: 1, base: 1, br: 1, col: 1, embed: 1, hr: 1, img: 1,
    input: 1, link: 1, meta: 1, param: 1, source: 1, track: 1, wbr: 1
};

// ============================================================
// SECTION: virtual-node helpers + ndynHTML/xsectionHTML/xsectionFast* — the "build HTML as a string/
// batch, write once" fast-path family. vCreate/vSetAttr/vSetHTML/vAppend build a lightweight plain-
// object node tree (mirroring ndyn's real-DOM-element building) that vSerialize turns into an HTML
// string; ndynHTML/xsectionHTML use these to batch many elements into one insertAdjacentHTML call.
// xsectionFastElem(s) is a separate variant that returns real (detached) DOM elements instead of a
// string, for callers that still need to run JS (event listeners, etc.) on each element before a
// single batched attach — see xTable's row-building loop above for that pattern in use.
// ============================================================
function vCreate(tag) {
    return { tag: tag, attrs: [], children: [] };
}

function vSetAttr(node, name, value) {
    for (var i = 0; i < node.attrs.length; i++) {
        if (node.attrs[i][0] === name) { node.attrs[i][1] = value; return; }
    }
    node.attrs.push([name, value]);
}

// mirrors elem.innerHTML = content -> replaces all existing content
function vSetHTML(node, content) {
    node.children = [{ __isText: true, text: content }];
}

function vAppend(parent, child) {
    parent.children.push(child);
}

function vEscapeAttr(str) {
    return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function vSerialize(node) {
    if (node.__isText) return node.text; // raw HTML/text, not escaped (matches innerHTML semantics)

    var out = "<" + node.tag;
    for (var i = 0; i < node.attrs.length; i++) {
        out += " " + node.attrs[i][0] + "=\"" + vEscapeAttr(node.attrs[i][1]) + "\"";
    }
    out += ">";

    if (VOID_TAGS[node.tag]) return out; // no closing tag / children for void elements

    for (var c = 0; c < node.children.length; c++) {
        out += vSerialize(node.children[c]);
    }
    out += "</" + node.tag + ">";
    return out;
}

//////////////////////////////////////////////////////////
// ndynHTML — same DSL parsing as ndyn(), but builds a virtual node
// tree instead of touching the real DOM.
//////////////////////////////////////////////////////////

function ndynHTML(strElem, vars) {
    var returnVal, initVal;
    var curElem, appendElem = [];

    if (vars)
        for (var key in vars) {
            strElem = strElem.replace(new RegExp("@" + key, "g"), vars[key]);
        }

    var elems = strElem.split("|||");
    for (var e = 0; e < elems.length; e++) {
        var appnd = false, cancAppnd = false, backAppnd = false;

        var atts = elems[e].split("|");

        if (atts[0] == "append") { appnd = true; atts.shift(); }
        if (atts[0] == "cancel") { cancAppnd = true; atts.shift(); }
        if (atts[0] == "back") { backAppnd = true; atts.shift(); }

        var type = atts[0];
        atts.shift();

        var attID = "";

        var icon = vCreate("img");
        vSetAttr(icon, "class", "icon");

        var elem = vCreate(type);
        var hasIcon = false;
        var onEvents = [];

        for (var i = 0; i < atts.length; i++) {
            var att = atts[i].split("=");
            if (att.length == 1) { att = ["innerHTML", att[0]]; }

            if (type == "img" && att[0] == "src") { att[1] = imgsFolder + att[1]; }
            if (type == "img" && att[0] == "isrc") { att[0] = "src"; }
            if (type == "iframe" && att[0] == "src") { att[1] = att[1].replace(/~/g, "="); }

            if (att[0] == "icon") {
                hasIcon = true;
                vSetAttr(icon, "src", imgsFolder + att[1]);

                if (att[1].indexOf("dot-") == 0) {
                    icon = vCreate("div");
                    vSetAttr(icon, "style",
                        "display:inline-block; width:8px;height:8px;border-radius:50%;background:" +
                        att[1].split("-")[1].split(".")[0] + ";");
                }
            }

            var dropdownSelected;

            if (att[0] == "id") {
                attID = att[1];
            } else if (att[0] == "innerHTML") {
                att[1] = att[1].replace(/\/\//g, "|").replace(/~/g, "=");
                vSetHTML(elem, att[1]);
            } else if (att[0] == "placeholder") {
                att[1] = att[1].replace(/\/\//g, "|").replace(/~/g, "=");
                vSetAttr(elem, "placeholder", att[1]);
            } else if (att[0].indexOf("on") == 0) {
                att[1] = att[1].replace(/~/g, "=");
                if (hasIcon) { onEvents.push([att[0], att[1]]); }
                else { vSetAttr(elem, att[0], att[1]); }
            } else if (att[0] == "serversrc") {
                vSetAttr(elem, "src", "https://devcmsneo.azurewebsites.net/images/" + att[1]);
            } else {
                if (att[0].split("icon.").length > 1) {
                    att[0] = att[0].split(".")[1];
                    vSetAttr(icon, att[0], att[1]);
                } else if (att[0].split("both.").length > 1) {
                    att[0] = att[0].split(".")[1];
                    vSetAttr(icon, att[0], att[1]);
                    vSetAttr(elem, att[0], att[1]);
                } else if (att[0] == "selected" && type == "select") {
                    dropdownSelected = att[1];
                } else if (att[0] == "options") {
                    var opts = att[1].split("~");
                    for (var ii = 0; ii < opts.length; ii++) {
                        var opt = opts[ii].split("^");
                        if (opt.length == 1) { opt.push(opt[0]); }
                        var optElem = vCreate("option");
                        vSetAttr(optElem, "value", opt[0]);
                        vSetHTML(optElem, opt[1]);
                        if (dropdownSelected == opt[0]) { vSetAttr(optElem, "selected", "true"); }
                        vAppend(elem, optElem);
                    }
                } else if (att[0] == "dloptions") {
                    var opts = att[1].split("~");
                    for (var ii = 0; ii < opts.length; ii++) {
                        var opt = opts[ii].split("^");
                        if (opt.length == 1) { opt.push(opt[0]); }
                        var optElem = vCreate("option");
                        vSetAttr(optElem, "data-customvalue", opt[0]);
                        vSetAttr(optElem, "value", opt[1]);
                        vAppend(elem, optElem);
                    }
                } else {
                    vSetAttr(elem, att[0], att[1]);
                }
            }
        }

        if (attID != "") {
            vSetAttr(elem, "id", attID);
        }

        var main;
        if (!hasIcon) {
            main = elem;
        } else {
            main = vCreate("elem");
            if (onEvents.length > 0) {
                vSetAttr(main, "style", "cursor:pointer");
                for (var oe = 0; oe < onEvents.length; oe++) {
                    vSetAttr(main, onEvents[oe][0], onEvents[oe][1]);
                }
            }
            if (attID != "") {
                vSetAttr(main, "id", attID + "_elem");
                vSetAttr(icon, "id", attID + "_icon");
            }
            vAppend(main, icon);
            vAppend(main, elem);
        }

        if (returnVal == null) {
            returnVal = main;
            initVal = main;
            appendElem = [main];
        } else {
            if (appnd) { appendElem.push(curElem); }
            if (cancAppnd) { appendElem = [initVal]; }
            if (backAppnd) { appendElem = appendElem.slice(0, -1); }

            vAppend(appendElem[appendElem.length - 1], main);
        }

        curElem = main;
    }

    return returnVal; // a virtual node tree, not yet a string
}

//////////////////////////////////////////////////////////
// xsectionHTML — same "list of top-level items" API as xsection,
// but returns one big HTML string instead of touching the DOM.
//////////////////////////////////////////////////////////

function xsectionHTML(elems, vars) {
    var html = "";
    for (var i = 0; i < elems.length; i++) {
        if (elems[i] != "") {
            html += vSerialize(ndynHTML(elems[i], vars));
        }
    }
    return html;
}

//////////////////////////////////////////////////////////
// Optional convenience wrapper matching xsection's original
// signature — resolves `main` the same way, then writes the
// whole batch in a single DOM operation.
//////////////////////////////////////////////////////////

function xsectionFast(main, elems, vars) {
    var tmp = main;
    if (typeof tmp != "object") {
        if (vars) {
            for (var key in vars) {
                tmp = tmp.replace(new RegExp("@" + key, "g"), vars[key]);
            }
        }
        main = document.getElementById(tmp);
    }

    if (main) {
        // beforeend = append, like appendChild did — but in one parse pass
        main.insertAdjacentHTML("beforeend", xsectionHTML(elems, vars));
    }
}

//////////////////////////////////////////////////////////
// xsectionFastElem(s) — same spec-string input as xsection/ndyn, but
// returns the built element(s) WITHOUT touching the live DOM. Unlike
// xsectionFast/xsectionHTML (which serialize to an HTML string and
// lose anything that isn't a string, like addEventListener functions
// or elemFunc closures), these return real elements so you can still
// run per-element JS (style, class, events, nested xsection appends)
// on them before attaching everything in one batched DOM write.
//////////////////////////////////////////////////////////

function xsectionFastElems(elems, vars) {
    var out = [];
    for (var i = 0; i < elems.length; i++) {
        if (elems[i] != "")
            out.push(ndyn(elems[i], vars));
    }
    return out;
}

function xsectionFastElem(elemSpec, vars) {
    return ndyn(elemSpec, vars);
}


