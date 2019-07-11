var designerServiceUrl = "";
var dashboardServiceUrl = "";
var dashboardServerUrl = "";
var designerToken = "";
var dataServiceUrl = "";
var editingUserList = "";
var isDraft = "";
var version = "";
var datasourceId = "";

$(document).ready(function () {
    designerServiceUrl = $('meta[name="designer_service:url"]').attr("content");
    dashboardServerUrl = $('meta[name="dashboard_server:url"]').attr("content");
    dashboardServiceUrl = $('meta[name="dashboard_service:url"]').attr("content");
    designerToken = $('meta[name="designer_service:access_token"]').attr("content");
    dataServiceUrl = $("meta[name='data_service:url']").attr("content");
    dashboardPageUrl = $("meta[name='dashboardpageUrl']").attr("content");
    dataStoreSettingUrl = $("meta[name='datastoreSettingUrl']").attr("content");
    datasourceId = $('meta[name="datasource:id"]').attr("content");
    isDraft = $('meta[name="isdraft"]').attr("content");
    version = $("meta[name='datasource:version']").attr("content");

    renderWebDesigner();

    $("#connectionDesigner #_new_datasetContainer").css("width", $(window).width());
    
    $("#connectionDesigner #_new_datasetContainer").css("height", $(window).height() - 44);
    parent.$("#connection-header").removeClass("display-none");
    parent.$("#create-connection-popup_wrapper").ejWaitingPopup("hide");
});

function renderWebDesigner() {

    var dateFormat = $('meta[name="globalization:date_format"]').attr("content");
    var timeFormat = $('meta[name="globalization:time_format"]').attr("content").toLowerCase() == "true" ? "HH:mm" : "hh:mm tt";

    var designerModel = {
        serviceUrl: designerServiceUrl,
        dataServiceUrl: dataServiceUrl,
        serverUrl: dashboardServerUrl,
        mode: ej.dashboardDesigner.mode.connection,
        itemId: datasourceId,
        serviceAuthorizationToken: designerToken,
        viewerSettings: {
            serviceUrl: dashboardServiceUrl
        },
        localeSettings: {
            culture: $('meta[name="user:culture"]').attr("content"),
            dateFormat: dateFormat,
            timeFormat: timeFormat
        },
        serverSettings: {
            backButtonSettingsURL: dashboardPageUrl,
            dataStoreSettingURL: dataStoreSettingUrl
        },
        actionComplete: $.proxy(onComplete, this)
    };
    var designer = new ejDashboardDesigner($('#connectionDesigner'), designerModel);
}

function onComplete(args) {
    if (args.data.event === "createConnection") {
        parent.$("#create-connection-popup_wrapper").ejWaitingPopup("show");
        parent.window.location.href = parent.window.location.origin + "/datasource-designer/" + args.data.source.data;
    }

    if (args.eventType === "ConnectionModeDialogClose") {
        parent.$("#create-connection-popup").ejDialog("close");
    }
}

$(document).keyup(function (e) {
    if (e.keyCode == 27) {
        var dialogData = parent.$("#create-connection-popup").data("ejDialog");
        if (dialogData != undefined) {
            window.parent.$("#create-connection-popup").ejDialog("close");
            parent.$("#create-connection-popup_wrapper").ejWaitingPopup("hide");
        }
    }
});

function openDatasource() {
    var item = getQueryVariable("itemType");
    if (item != null) {
        var idName = "#connectionDesigner_" + item + "_img";
        $(idName).trigger('click');
    }
    console.log(item);
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return null;
}