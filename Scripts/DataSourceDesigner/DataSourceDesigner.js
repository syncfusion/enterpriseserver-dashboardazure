var designerServiceUrl = "";
var dashboardServiceUrl = "";
var dashboardServerUrl = "";
var designerToken = "";
var dataServiceUrl = "";
var editingUserList = "";
var isUrlChange = "";
var isDraft = "";
var version = "";
var datasourceId = "";
var datasourceName = "";
var datasourceDescription = "";

$(document).ready(function () {
    refreshDashboarDesigner();
    designerServiceUrl = $('meta[name="designer_service:url"]').attr("content");
    dashboardServerUrl = $('meta[name="dashboard_server:url"]').attr("content");
    dashboardServiceUrl = $('meta[name="dashboard_service:url"]').attr("content");
    designerToken = $('meta[name="designer_service:access_token"]').attr("content");
    dataServiceUrl = $("meta[name='data_service:url']").attr("content");

    datasourceId = $('meta[name="datasource:id"]').attr("content");
    datasourceName = $('meta[name="datasource:name"]').attr("content");
    isUrlChange = "true";
    isDraft = $('meta[name="datasource:is_draft"]').attr("content");
    version = $("meta[name='datasource:version']").attr("content");
    datasourceDescription = $("meta[name='datasource:discription']").attr("content");
    dashboardPageUrl = $("meta[name='dashboardpageUrl']").attr("content");
    updateURL(datasourceName, datasourceId);

    $("#datasourceDesigner").width($(window).width() - $("#menu-area").width());
    $("#datasourceDesigner").css("padding-left", $("#menu-area").width());

    renderWebDesigner();

    $('.preloader-wrap').fadeOut();
    $("#menu-area").removeClass("display-none");

    if (isDebug.toLowerCase() == "false") {
        $("body").append($("<link rel='stylesheet' href= '" + viewerStyles + "' type='text/css' />"));
        $("body").append($("<script src='" + viewerScript + "'></script>"));
    }

    // Declare a proxy to reference the hub.
    var connectedUser = $.connection.connectedUsersHub;

    connectedUser.client.sendNotification = function (userlist) {
        if ($("#datasourceDesigner_designerContainer #datasourceDesigner_toolBar ul #users-container #users").find("li").length == 0) {
            for (var i = 0; userlist.length > i; i++) {
                if (userlist[i].DisplayName != displayName) {
                    editingUserList += "<li data-connectionid='" + userlist[i].ConnectionId + "'><img title='" + userlist[i].DisplayName + "' src='" + idpUrl + "/User/Avatar?id=" + userlist[i].IdpReferenceId + "'> <span class='user-name-padding'>" + userlist[i].DisplayName + "</span></li>";
                }
            }

            if (editingUserList != "") {
                $("#datasourceDesigner_designerContainer #datasourceDesigner_toolBar").append('<ul class="e-reportdesigner-toolbarul e-ul e-horizontal" style="float: right;"><div id="users-container"><span class="dropdown-toggle su su-group-1" data-toggle="dropdown"></span><span class="users-count"></span><ul class="dropdown-menu" id="users" role="menu"><li class="editing-message"> Others editing this dashboard </li><li class="users-list"><ul id="editing-users"></li></ul><li role="separator" class="divider"></li><li class="notification-message">Note: Your changes will be saved separately as a new version if their changes have already been saved.</li></ul></div></ul>');
                document.getElementById("editing-users").innerHTML += editingUserList;
                var length = $("#datasourceDesigner_designerContainer #datasourceDesigner_toolBar ul #users-container #users #editing-users").find("li:not(.editing-message)").length;
                $("#datasourceDesigner_designerContainer #datasourceDesigner_toolBar ul #users-container .users-count").html(length);
            }
        }
        else {
            editingUserList = "";
            for (var i = 0; userlist.length > i; i++) {
                if (userlist[i].DisplayName != displayName) {
                    editingUserList += "<li data-connectionid='" + userlist[i].ConnectionId + "'><img title='" + userlist[i].DisplayName + "' src='" + idpUrl + "/User/Avatar?id=" + userlist[i].IdpReferenceId + "'> <span class='user-name-padding'>" + userlist[i].DisplayName + "</span></li>";
                }
            }

            document.getElementById("editing-users").innerHTML = '';
            document.getElementById("editing-users").innerHTML += editingUserList;
            var length = $("#datasourceDesigner_designerContainer #datasourceDesigner_toolBar ul #users-container #users #editing-users").find("li:not(.editing-message)").length;
            $("#datasourceDesigner_designerContainer #datasourceDesigner_toolBar ul #users-container .users-count").html(length);
        }
    };

    connectedUser.client.sendRemovedNotification = function (user) {
        for (var i = 0; i < $("#editing-users").find("li").length; i++) {
            if ($("#editing-users").find("li").eq(i).attr('data-connectionid') == user.ConnectionId) {
                $("#editing-users").find("li").eq(i).remove();
            }
        }

        var length = $("#datasourceDesigner_designerContainer #datasourceDesigner_toolBar ul #users-container #users #editing-users").find("li:not(.editing-message)").length;
        if (length == 0) {
            $("#users-container").remove();
            editingUserList = "";
        }
        else {
            $("#datasourceDesigner_designerContainer #datasourceDesigner_toolBar ul #users-container .users-count").html(length);
        }
    }

    $.connection.hub.start().done(function () {
        connectedUser.server.adduserToGroup(datasourceId, displayName, userId, userName);
    });

    $(window).resize(function () {
        refreshDashboarDesigner();
    });
});

function refreshDashboarDesigner() {
    var windowHeight = $(window).innerHeight();
    var headerHeight = $("#designer-header").outerHeight();
    var containerHeight = windowHeight - headerHeight;
    $("#datasourceDesigner").height(containerHeight);
    $("#datasourceDesigner").width($(window).width() - $("#menu-area").width());
}

function renderWebDesigner() {
    var dateFormat = $('meta[name="globalization:date_format"]').attr("content");
    var timeFormat = $('meta[name="globalization:time_format"]').attr("content").toLowerCase() == "true" ? "HH:mm" : "hh:mm tt";

    var designerModel = {
        serviceUrl: designerServiceUrl,
        dataServiceUrl: dataServiceUrl,
        serverUrl: dashboardServerUrl,
        itemId: datasourceId,
        mode: ej.dashboardDesigner.mode.datasource,
        datasource: datasourceId,
        isDraft: isDraft.toLowerCase() == "true",
        datasourceName: datasourceName,
        datasourceDescription: datasourceDescription,
        serviceAuthorizationToken: designerToken,
        viewerSettings: {
            serviceUrl: dashboardServiceUrl
        },
        serverSettings: {
            backButtonSettingsURL: dashboardPageUrl
        },
        localeSettings: {
            culture: $('meta[name="user:culture"]').attr("content"),
            dateFormat: dateFormat,
            timeFormat: timeFormat
        },
        actionComplete: $.proxy(onComplete, this)
    };
    var designer = new ejDashboardDesigner($('#datasourceDesigner'), designerModel);
}

function onComplete(args) {
    if (args.data.event === "saveDataSource") {
        window.location.href = dataSourcesPageUrl + "?datasourceName=" + args.model.datasourceName + "&datasourceId=" + args.data.source.data;
    }
    else if (args.data.event === "ContinueToDashboard") {
        window.location.href = dashboardDesignerUrl + "?datasourceId=" + args.data.source.data;
    }
    else if (args.data.event === "cancelDataSource") {
        window.location.href = dataSourcesPageUrl;
    }
}

function updateURL(datasourceName, datasourceId, version) {
    if (history.pushState != undefined) {
        // Getting the culture info from requested url
        var culture = currentUrl.split("/");

        var newdesignerurl = "";
        var splittedbaseUrls = baseUrl.split("/");

        // while push the url in java script have to add bi/{culture} in url.So, here added culure manually in url.
        //In local development no need to add bi in URL.So,here checked the base url legnth.
        if (splittedbaseUrls.length > 3) {
            newdesignerurl = baseUrl + "/" + culture[2];
        }
        else {
            newdesignerurl = baseUrl + "/" + culture[1];
        }

        if (version != undefined) {
            newdesignerurl = newdesignerurl + "/datasource-designer/" + datasourceId + "/" + datasourceName + "?v=" + version;
        }
        else {
            newdesignerurl = newdesignerurl + "/datasource-designer/" + datasourceId + "/" + datasourceName;
        }

        history.pushState({}, "", newdesignerurl);

    }
}

function SuccessAlert(header, content, duration) {
    window.top.$("#success-alert").css("display", "table");
    window.top.$("#message-header").html(header);
    window.top.$("#message-content").html(content);
    setTimeout(function () {
        window.top.$('#success-alert').fadeOut()
    }, duration);
}

function WarningAlert(header, content, duration) {
    parent.$("#warning-alert").css("display", "table");
    parent.$("#warning-alert #message-header").html(header);
    parent.$(" #warning-alert #message-content").html(content);
    if (duration != null && duration != "") {
        setTimeout(function () {
            parent.$('#warning-alert').fadeOut()
        }, duration);
    }
    $(document).on("click", ".close-div", function () {
        parent.$('#warning-alert').fadeOut()
    });
}
