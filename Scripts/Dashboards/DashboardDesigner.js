﻿var dashboardId = "";
var dashboardServerUrl = "";
var designerServiceUrl = "";
var dashboardServiceUrl = "";
var version = "";
var designerToken = "";
var dashboardName = "";
var isUrlChange = "";
var isDraft = "";
var isPublic = "";
var categoryName = "";
var dataServiceUrl = "";
var dashboardDescription = "";
var editingUserList = "";
var umsUrl = "";
var canMarkDashboardAsPublic = "";
var isAdmin = "";
var datasourceId = "";
var datasourceVersion = "";
var canCreateDatasource = "";

$(document).ready(function () {
    refreshDashboarDesigner();
    dashboardId = $('meta[name="dashboard:id"]').attr("content");
    dashboardName = $('meta[name="dashboard:name"]').attr("content");
    categoryName = $('meta[name="category:name"]').attr("content");
    dashboardServerUrl = $('meta[name="dashboard_server:url"]').attr("content");
    designerServiceUrl = $('meta[name="designer_service:url"]').attr("content");
    dashboardServiceUrl = $('meta[name="dashboard_service:url"]').attr("content");
    version = $("meta[name='dashboard:version']").attr("content");
    designerToken = $('meta[name="designer_service:access_token"]').attr("content");
    isUrlChange = $('meta[name="isurlchange"]').attr("content");
    isDraft = $('meta[name="isdraft"]').attr("content");
    isPublic = $('meta[name="ispublic"]').attr("content");
    isUnlisted = $('meta[name="isunlisted"]').attr("content");
    dataServiceUrl = $("meta[name='data_service:url']").attr("content");
    dashboardDescription = $("meta[name='dashboard:discription']").attr("content");
    umsUrl = $("meta[name='ums:url']").attr("content");
    canMarkDashboardAsPublic = $('meta[name="dashboards:allow_public_dashboards"]').attr("content");
    isAdmin = $('meta[name="user:is_admin"]').attr("content");
    canCreateDatasource = $('meta[name="datasource:allow_create_datasource"]').attr("content");
    datasourceId = $('meta[name="datasource:id"]').attr("content");
    datasourceVersion = $("meta[name='datasource:version']").attr("content");

    if (isUrlChange.toLowerCase() != "false") {
        updateURL(categoryName, dashboardName, dashboardId, datasourceId);
    }

    renderWebDesigner();

    $('.preloader-wrap').fadeOut();

    if (isDebug.toLowerCase() == "false") {
        $("body").append($("<link rel='stylesheet' href= '" + viewerStyles + "' type='text/css' />"));
        $("body").append($("<script src='" + viewerScript + "'></script>"));
    }


    // Declare a proxy to reference the hub.
    var connectedUser = $.connection.connectedUsersHub;

    connectedUser.client.sendNotification = function (userlist) {
        if ($("#dashboardDesigner_designerContainer #dashboardDesigner_toolBar ul #users-container #users").find("li").length == 0) {
            for (var i = 0; userlist.length > i; i++) {
                if (userlist[i].DisplayName != displayName) {
                    editingUserList += "<li data-connectionid='" + userlist[i].ConnectionId + "'><img title='" + userlist[i].DisplayName + "' src='" + umsUrl + "/User/Avatar?Username=" + userlist[i].UserName + "&ImageSize=64' > <span class='user-name-padding'>" + userlist[i].DisplayName + "</span></li > ";
                }
            }

            if (editingUserList != "") {
                $("#dashboardDesigner_designerContainer #dashboardDesigner_toolBar").append('<ul class="e-reportdesigner-toolbarul e-ul e-horizontal" style="float: right;"><div id="users-container"><span class="dropdown-toggle su su-group-1" data-toggle="dropdown"></span><span class="users-count"></span><ul class="dropdown-menu" id="users" role="menu"><li class="editing-message"> [[[Others editing this dashboard]]] </li><li class="users-list"><ul id="editing-users"></li></ul><li role="separator" class="divider"></li><li class="notification-message">[[[Note: Your changes will be saved separately as a new version if their changes have already been saved.]]]</li></ul></div></ul>');
                document.getElementById("editing-users").innerHTML += editingUserList;
                var length = $("#dashboardDesigner_designerContainer #dashboardDesigner_toolBar ul #users-container #users #editing-users").find("li:not(.editing-message)").length;
                $("#dashboardDesigner_designerContainer #dashboardDesigner_toolBar ul #users-container .users-count").html(length);
            }
        }
        else {
            editingUserList = "";
            for (var i = 0; userlist.length > i; i++) {
                if (userlist[i].DisplayName != displayName) {
                    editingUserList += "<li data-connectionid='" + userlist[i].ConnectionId + "'><img title='" + userlist[i].DisplayName + "' src='" + umsUrl + "/User/Avatar?Username=" + userlist[i].UserName + "&ImageSize=64'> <span class='user-name-padding'>" + userlist[i].DisplayName + "</span></li>";
                }
            }

            document.getElementById("editing-users").innerHTML = '';
            document.getElementById("editing-users").innerHTML += editingUserList;
            var length = $("#dashboardDesigner_designerContainer #dashboardDesigner_toolBar ul #users-container #users #editing-users").find("li:not(.editing-message)").length;
            $("#dashboardDesigner_designerContainer #dashboardDesigner_toolBar ul #users-container .users-count").html(length);
        }
    };

    connectedUser.client.sendRemovedNotification = function (user) {
        for (var i = 0; i < $("#editing-users").find("li").length; i++) {
            if ($("#editing-users").find("li").eq(i).attr('data-connectionid') == user.ConnectionId) {
                $("#editing-users").find("li").eq(i).remove();
            }
        }

        var length = $("#dashboardDesigner_designerContainer #dashboardDesigner_toolBar ul #users-container #users #editing-users").find("li:not(.editing-message)").length;
        if (length == 0) {
            $("#users-container").remove();
            editingUserList = "";
        }
        else {
            $("#dashboardDesigner_designerContainer #dashboardDesigner_toolBar ul #users-container .users-count").html(length);
        }
    }

    $.connection.hub.start().done(function () {
        connectedUser.server.adduserToGroup(dashboardId, displayName, userId, userName);
    });

    $(window).resize(function () {
        refreshDashboarDesigner();
    });
});

window.onload = function () {
    var mapUrls = document.getElementsByName("dashboard_designer:maps:shapes");

    for (i = 0; i < mapUrls.length; i++) {
        if (mapUrls[i].content != "") {
            var script = document.createElement('script');
            script.src = mapUrls[i].content;
            script.async = true;
            document.getElementsByTagName('head')[0].appendChild(script);
        }
    }
}

function refreshDashboarDesigner() {
    var windowHeight = $(window).innerHeight();
    var headerHeight = $("#designer-header").outerHeight();
    var containerHeight = windowHeight - headerHeight;
    $("#dashboardDesigner").height(containerHeight);
    $("#dashboardDesigner").width($(window).width());
}

function renderWebDesigner() {
    /*
    When user opens the draft dashboards, we will set itemId and left the dashboardPath and dashboardName as empty since we have not yet saved the dashboard. When saving the dashboard, designer team will call the Update Dashboard API.

    var designerModel  = {
        itemId: "e7fa3fe7-29a5-4775-a441-62a523d852ac", //Sample Item Id
        dashboardPath: "",
        dashboardName: ""
    };


    When user opens already published dashboard in designer, we will set itemId ,itemPath and dashboardName properties. When saving the dashboard, designer team will call the Update Dashboard API.

    var designerModel  = {
        itemId: "e7fa3fe7-29a5-4775-a441-62a523d852ac", //Sample Item Id
        dashboardPath: "e7fa3fe7-29a5-4775-a441-62a523d852ac/2" //Here itemPath is set as itemId/latestVersion.
        dashboardName: saveddashboardname //Samplename
    };
    */
    var dateFormat = $('meta[name="globalization:date_format"]').attr("content");
    var timeFormat = $('meta[name="globalization:time_format"]').attr("content").toLowerCase() == "true" ? "HH:mm" : "hh:mm tt";

    var designerModel = {
        serverUrl: dashboardServerUrl,
        serviceUrl: designerServiceUrl,
        dataServiceUrl: dataServiceUrl,
        itemId: dashboardId,
        datasource: datasourceId,
        dashboardPath: isDraft.toLowerCase() == "true" ? "" : dashboardId + "/" + version,
        dashboardName: isDraft.toLowerCase() == "true" ? "" : dashboardName,
        isPublic: isPublic.toLowerCase() == "true" ? true : false,
        dashboardDescription: dashboardDescription,
        serviceAuthorizationToken: designerToken,
        serverSettings: {
            isPublic: canMarkDashboardAsPublic.toLowerCase() == "true" && isPublic.toLowerCase() == "true",
            isUnlisted: isUnlisted.toLowerCase() == "true",
            enableMarkAsPublic: canMarkDashboardAsPublic.toLowerCase() == "true",
            warningMessage: isAdmin.toLocaleLowerCase() == "true" ? "Public dashboards are disabled in <a href='" + dashboardServerUrl + "/administration/dashboard-settings' target='_blank'> dashboard settings" : "Public Dashboards are disabled by the system administrator. Please contact your system administrator to enable this.",
            dataStoreSettingURL: dataStoreSettingUrl
        },
        viewerSettings: {
            serviceUrl: dashboardServiceUrl
        },
        localeSettings: {
            culture: $('meta[name="user:culture"]').attr("content"),
            dateFormat: dateFormat,
            timeFormat: timeFormat
        },
        features: {
            datasource: {
                create: canCreateDatasource.toLowerCase() == "true"
            }
        },
        actionComplete: $.proxy(onSaveDashboard, this)
    };
    var designer = new ejDashboardDesigner($('#dashboardDesigner'), designerModel);
}

//After completing 'save' and 'saveas' action in designer
function onSaveDashboard(args) {
    var savedDashboardDetails = args.data;
    if (args.eventType == "SaveAs") {
        var savedDashboardDetails = args.data;
        isDraft = "false";
        var designer = $('#dashboardDesigner').data('ejDashboardDesigner');
        var newTitle = savedDashboardDetails.dashboardName + '- Design Dashboard - ' + organizationName;
        document.title = newTitle;
        $('.edit-dashboard').html(savedDashboardDetails.dashboardName);
        $('.dashboard-status').html('(Saved)');
        updateURL(savedDashboardDetails.categoryName, savedDashboardDetails.dashboardName, savedDashboardDetails.dashboardId);

        //Initializing saved itemId and dashboardPath to designer model
        designer.model.itemId = savedDashboardDetails.dashboardId;
        designer.model.dashboardPath = savedDashboardDetails.dashboardId + "/" + savedDashboardDetails.version;
    }
    if (args.eventType == "Save") {
        if (savedDashboardDetails.categoryName != "") {
            categoryName = savedDashboardDetails.categoryName;
        }
        updateURL(categoryName, savedDashboardDetails.dashboardName, savedDashboardDetails.dashboardId, undefined, savedDashboardDetails.version);
        var newTitle = savedDashboardDetails.dashboardName + '- Design Dashboard - ' + organizationName;
        document.title = newTitle;
        $('.edit-dashboard').html(savedDashboardDetails.dashboardName);
        $('.dashboard-status').html('(Saved)');
    }
}

function updateURL(categoryName, dashboardName, dashboardId, datasourceId, version) {
    if (history.pushState != undefined) {
        // Getting the culture info from requested url
        var culture = currentUrl.split("/");

        var newdesignerurl = "/" + culture[1];

        categoryName = isDraft.toLowerCase() == "true" ? "draft" : categoryName;

        if (datasourceId != undefined) {
            if (version != undefined) {
                newdesignerurl = newdesignerurl + "/dashboard-designer/" + dashboardId + "/" + categoryName + "/" + dashboardName + "?v=" + version + "&datasourceId=" + datasourceId;
            }
            else {
                newdesignerurl = newdesignerurl + "/dashboard-designer/" + dashboardId + "/" + categoryName + "/" + dashboardName + "?datasourceId=" + datasourceId;
            }
        }
        else {
            if (version != undefined) {
                newdesignerurl = newdesignerurl + "/dashboard-designer/" + dashboardId + "/" + categoryName + "/" + dashboardName + "?v=" + version;
            }
            else {
                newdesignerurl = newdesignerurl + "/dashboard-designer/" + dashboardId + "/" + categoryName + "/" + dashboardName;
            }
        }

        history.pushState({}, "", newdesignerurl);

    }
}