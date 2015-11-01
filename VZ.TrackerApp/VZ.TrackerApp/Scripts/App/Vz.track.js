var Tracker = [];
Event = function () {
    this.Name = "";
    this.ElementName = "";
}
Navigation = function () {
    this.PagePath = "";
    this.StartTime = null;
    this.EndTime = null;
    this.PageLoadTime = null;
    this.IsAjaxRequest = false;
    this.AjaxRequestStatus = null;
}
Tracker = function () {
    this.TrackerId = "";
    this.Events = [];
    this.Navigations = [];
    this.DomainName = "";
    this.BrowserInfo = "";
}
PagePerformance = function () {
    this.PagePath = "";
    this.StartTime = "";
    this.EndTime = "";
    this.LoadTime = 0.0;
    this.BrowserInfo = "";
};
UserActivity = function () {
    this.ActivityType = "";
    this.TrackerId = "";
    this.DomainName = "";
    this.Date = "";
    this.PagePath = "";
    this.PageTitle = "";
    this.PageType = "";
    this.State = "";
    this.Country = "";
    this.IPAddress = "";
    this.SessionId = "";
    this.UserId = "";
    this.ElementName = "";
    this.ElementType = "";
};
var objTrack = null;
var objUserAct = new UserActivity();
var objPagePer = new PagePerformance();
var lstPagePerf = null;
function UniqID(idlength) {
    var charstoformid = '_0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
    if (!idlength) {
        idlength = Math.floor(Math.random() * charstoformid.length);
    }
    var uniqid = '';
    for (var i = 0; i < idlength; i++) {
        uniqid += charstoformid[Math.floor(Math.random() * charstoformid.length)];
    }
    // one last step is to check if this ID is already taken by an element before 
    if (jQuery("#" + uniqid).length == 0)
        return uniqid;
    else
        return UniqID(10)
}
$(document).ajaxComplete(function (event, xhr, settings) {
    var objNavigation = new Navigation();
    objNavigation.PagePath = settings.url;
    objNavigation.PageLoadTime = (new Date().getTime() - event.timeStamp);
    objNavigation.IsAjaxRequest = true;
    objNavigation.AjaxRequestStatus = xhr.status;
    objTrack.Navigations.push(objNavigation);

    objPagePer.PagePath = settings.url;
    objPagePer.StartTime = (new Date(event.timeStamp)).toISOString();
    objPagePer.LoadTime = (new Date().getTime() - event.timeStamp);
    objPagePer.EndTime = new Date().toISOString();
    objPagePer.BrowserInfo = GetUserAgent();

    if (settings.url.indexOf("InsertUserActivity") == -1 && settings.url.indexOf("InsertPagePerformance") == -1 && settings.url.indexOf("GetPagePerformance") == -1)
        InsertPagePerformance();
});
function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //document.getElementById("demo").innerHTML = xhttp.responseText;
        }
    }
    xhttp.open("GET", $("#homeURL").val(), true);
    xhttp.send();
}
function JqAjax() {
    $.ajax({

        url: $("#homeURL").val(),

        context: document.body

    }).done(function () {



    });



}
function AjaxPost() {
    $("#homePostURL").val("/Home/Tracker");
    var request = $.ajax({

        url: $("#homePostURL").val(),

        method: "POST",

        data: objTrack,

        dataType: "html"

    });

}
function getIPAddress() {
    $.getJSON("http://jsonip.com?callback=?", function (data) {
        objUserAct.IPAddress = data.ip;
    });
}
GetUserAgent = function () {
    var ua = navigator.userAgent, tem,
    M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(' ');
};

function GetPerformanceActivity() {
    $.ajax({
        url: "http://localhost:53373/TrackerRestService.svc/GetPagePerformance",
        method: "GET",
        success: function (lstPagePer) {
            lstPagePerf = lstPagePer;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }

    });
}
function InsertUserActivity() {
    $.ajax({
        url: "http://localhost:53373/TrackerRestService.svc/InsertUserActivity",
        method: "POST",
        data: JSON.stringify(objUserAct),
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        success: function (res) {
            var res = res;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }

    });
}
function InsertPagePerformance() {

    $.ajax({
        url: "http://localhost:53373/TrackerRestService.svc/InsertPagePerformance",
        method: "POST",
        data: JSON.stringify(objPagePer),
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        success: function (res) {
            var res = res;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }

    });

}
UserActivityPerformance=function()
{
    this.Activity = null;
    this.Performance = null;

}
function InsertUserActivityPerformance() {
    var objUserActivityPerformance = new UserActivityPerformance();
    objUserActivityPerformance.Activity = objUserAct;
    objUserActivityPerformance.Performance = objPagePer;
    $.ajax({
        url: "http://localhost:53373/TrackerRestService.svc/UserActivityPerformance",
        method: "POST",
        data: JSON.stringify(objUserActivityPerformance),
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        success: function (res) {
            var res = res;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }

    });
}
$(function () {
    //loadDoc();
    // JqAjax();
    //GetPerformanceActivity();
    getIPAddress();
    objUserAct.TrackerId = UniqID(10);
    $.cookie.json = true;
    objTrack = new Tracker();
    objTrack.TrackerId = UniqID(10);
    objTrack.BrowserInfo = GetUserAgent();
    if ($.cookie("Tracker") != null || $.cookie("Tracker") != undefined) {
        objTrack = $.cookie("Tracker");
    }
    var objNavigation = new Navigation();
    objNavigation.PagePath = $(location).attr("href");
    objNavigation.StartTime = new Date().toISOString();
    objTrack.Navigations.push(objNavigation);
    $(window).unload(function () {
        objNavigation.EndTime = new Date().toISOString();
        objPagePer.EndTime = new Date().toISOString();
        objPagePer.BrowserInfo = GetUserAgent();
        // AjaxPost();
        objUserAct.ActivityType = "PageType";
        objUserAct.DomainName = $(location).attr("hostname");//.domain;// e.target.domain;
        objUserAct.Date = new Date().toISOString();
        objUserAct.PagePath = $(location).attr("href");
        objUserAct.PageTitle = $(document).attr('title');
        objUserAct.PageType = "";
        //InsertUserActivity();
        //InsertPagePerformance();
        InsertUserActivityPerformance();
    });
    var befretime = new Date().getTime();

    $(window).load(GetTimeLoad);

    function GetTimeLoad() {
        objUserAct.ActivityType = "PageType";
        objUserAct.DomainName = $(location).attr("hostname");//.domain;// e.target.domain;
        objUserAct.Date = new Date().toISOString();
        objUserAct.PagePath = $(location).attr("href");
        objUserAct.PageTitle = $(document).attr('title');
        objUserAct.PageType = "";
        var aftertime = new Date().getTime();
        time = (aftertime - befretime) / 1000;
        objNavigation.PageLoadTime = time;
        objPagePer.PagePath = $(location).attr("href");
        objPagePer.StartTime = new Date().toISOString();
        objPagePer.LoadTime = time;
        objPagePer.BrowserInfo = GetUserAgent();
    }

    // $.cookie("Tracker", objTrack);
    $(document).on("click keypress", function (e) {
        objUserAct.ActivityType = "Action";
        objUserAct.DomainName = $(location).attr("hostname");//.domain;// e.target.domain;
        objUserAct.Date = new Date().toISOString();
        objUserAct.PagePath = $(location).attr("href");
        objUserAct.PageTitle = $(document).attr('title');
        objUserAct.PageType = "";
        objUserAct.ElementType = e.target.nodeName;
        var nodeName = e.target.nodeName.toLowerCase();;
        if ($(e.target).text() != "")
            objUserAct.ElementName = $(e.target).text();
        else
            objUserAct.ElementName = $(e.target).val();
        if ($(e.target).attr("type") != undefined) {
            objUserAct.ElementType = $(e.target).attr("type");
        }
        //AjaxPost();
        InsertUserActivity();
        objTrack.DomainName = e.target.domain;
        var objEvent = new Event();
        objEvent.Name = e.type;
        objEvent.ElementName = e.target.nodeName;
        objTrack.Events.push(objEvent);
        $.cookie("Tracker", objTrack);
    });
});