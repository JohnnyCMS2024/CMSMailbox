// Core AJAX helper used throughout the app: getData() posts a FormData payload to a controller
// action and calls back with the response, with a loading-spinner + request-index guard against
// stale/out-of-order responses; RunMultiSP batches several stored-proc calls in one round trip.
var ajax_IX = 0;
var ajaxTimes = [];



function getData(url, data, func, json, noload, actionIndex) {
    ajax_IX++;
    var currentAjaxIX = ajax_IX;

    var nullData = false;
    var arrData = [url];
    if (data != null) {
        for (var pair of data.entries()) {
            arrData.push([pair[0] + "=" + pair[1]]);
            console.log("ajax csrf 15", pair[0], pair[1]);
        }
    } else {
        nullData = true;
    }

    if (data) {
        var dataObject = Object.fromEntries(data.entries());
        console.log("ajax csrf 21", dataObject);
    }

    if (url == null) { url = "#adHoc";}
    
    url = "../" + url.replace(/#/, "main/");

    try { document.getElementById("loading").style.display = "none"; } catch (ex) {}
    if (noload == null) {
        xloading(true, currentAjaxIX);        
    }
    try {
        if (url != "../main/heartbeat") {
            if (!nullData && ["_GetSystemNotificationsx"].indexOf(data.get("action")) == -1) {
                var thisDT = new Date();
                ajaxTimes.push({ ix: currentAjaxIX, DT1: thisDT });
                console.log("ajax xxx START", currentAjaxIX, data.get("action"), data.get("strjson"), thisDT);
            }
        } else {
            console.log("ajax loading", "Heartbeat");
        }
    } catch (e) { console.log(e); }

    try {
        var xx = new XMLHttpRequest();
        xx.onreadystatechange = function () {
            try {

                //console.log("err", this);

                if ([4].indexOf(this.readyState) > -1 && this.status == 200) {
                    console.log("ajax success", { readyState: this.readyState, url:url, status: this.status, action: data.get("action"), strjson: data.get("strjson"), return: this.responseText });
                    try { document.getElementById("loading").style.display = "none"; } catch (ex) { }

                    if (noload == null) {
                        xloading(false, currentAjaxIX);
                    }
                    try {
                        if (data.get("action") != "_GetSystemNotifications") {
                            var thisDT = new Date();
                            var ix = ajaxTimes.findIndex(d => d.ix == currentAjaxIX);
                            var thenDT = ajaxTimes[ix].DT1;
                            const timeDiff = Math.abs(thisDT.getTime() - thenDT.getTime());

                            console.log("ajax xxx returned", currentAjaxIX, data.get("action"), thisDT)
                            console.log("ajax ending", currentAjaxIX, thisDT, timeDiff);
                        }
                    } catch (e) { }
                    var vr = this.responseText;
                    if (vr == "logout") {
                        sessionStorage.clear();
                        window.location.href = "Login";
                    } else if (vr.split(":")[0] == "error") {
                        console.log(vr);
                    }
                    else {
                        //console.log("err", jparse(vr));
                        func(vr, actionIndex);
                    }
                } else if (this.readyState == 4 && this.status != 200) {
                    document.getElementById("loading").style.display = "none";
                    xloading(false, currentAjaxIX);
                    try {
                        console.log("ajax: The current process returned an error.  Please contact your system administrator for further assistance. " + this.status)
                    }
                    catch {
                        //c_log("xconfirm not installed in this section");
                    }
                    console.log("This process returned the following status code: " + this.responseText);
                } else {
                    var vr = this.responseText;
                    //func(vr);
                    //console.log("ajax err", { readyState: this.readyState, status: this.status, action: data.get("action"), strjson: data.get("strjson"), return: vr });
                }
            } catch (e) {
                console.log("ajax error at : " + url, e);
                //c_log(e);
                //for (var pair of data.entries()) {
                //    //c_log(pair[0] + ', ' + pair[1]);
                //}
                //c_log(e);
            }
        };

        var uToken = sessionStorage.getItem("UserToken");
        //alert(uToken);
        xx.open("POST", url, true);
        xx.setRequestHeader('Authorization', 'Bearer ' + uToken);
        //if (url.indexOf("adHocAttach") > -1)
        //    alert(uToken);

        xx.onerror = function (e) {
            //c_log(e);
        };

        if (data == null) {
            data = new FormData();
        }
        data.append("csrf", document.getElementById("csrfToken").value);
        console.log("ajax csrf 117", url, Object.fromEntries(data.entries()));

        if (data != null) {
            console.log("ajax csrf sending not null");
            xx.send(data);
        } else {
            console.log("ajax csrf sending null");
            xx.send();
        }
    } catch (e) {
        //c_log(e);
    }
}

function RunMultiSP(strActions, Params, Func, addtl, noload) {
    var Actions = strActions.split(",");
    for (var i = 0; i < Actions.length; i++) {
        if (i > Params.length - 1) {
            Params.push({});
        }
    }

    var results = [];
    var js = [];
    for (var i = 0; i < Actions.length; i++) {
        js.push({ Action: Actions[i], Params: Params[i], Done: false });
    }
    console.log(strActions, noload);

    const delay = ms => new Promise(res => setTimeout(res, ms));

    async function processArray(js) {
        for (var i = 0; i < js.length; i++) {
            var x = js[i];
            getData(null, newFormData(x.Action, x.Params), function (vr, ix) {
                results.push({ ix: ix, result: jparse(vr) });
                js[ix].Done = true;

                if (js.filter(d => !d.Done).length == 0) {
                    var newResults = [];
                    for (var ii = 0; ii < results.length; ii++) {
                        newResults.push(results.filter(d => d.ix == ii)[0].result);
                    }
                    //console.log("err", vr);
                    Func(newResults, addtl);
                }
            }, null, noload, i);

            await delay(200);
        }
    };

    processArray(js);
}

function xloading(showme, ix) {
    var elemLoading = document.getElementById("adhocLoading_" + ix);
    try { PageContainer.removeChild(elemLoading); } catch (e) { };

    if (showme) {
        xsection(PageContainer, ["img|id=adhocLoading_" + ix + "|style=z-index:3000;position:absolute;top:60px;left:45%;|src=loading.gif"]);
    }
}

function godat(jo) {
    var keys = []; for (var key in jo) { keys.push(key); }
    if (keys.indexOf("ps") == -1) { jo["ps"] = {} }
    if (keys.indexOf("method") == -1) { jo["method"] = 0 }
    if (keys.indexOf("func") == -1) {
        jo["func"] = function (vr) {
            //c_log(jparse(vr));
        }
    }

    var method = jo["method"];   //defaults to SP
    var action = jo["action"];      //required
    var params = jo["ps"];          //defaults to empty
    var func = jo["func"];           //defaults write results      

    if (method == 0) {
        getData(null, newFormData(action, params), func); //standard adhoc

    } else {
        var data = new FormData;    //set plain form data
        var keys = []; for (var key in params) { keys.push(key); } //get array of keys in params
        for (var i = 0; i < keys.length; i++) {
            data.append(key, params[key]);  //loop through keys and apply to form data
        }
        getData(action, data, func);
    } 
}

