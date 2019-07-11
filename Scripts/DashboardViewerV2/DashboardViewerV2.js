var dashboardId = "";
var designerServiceUrl = "";
var dashboardServiceUrl = "";
var dashboardServerUrl = "";
var version = "";
var designerToken = "";
var dashboardName = "";
var isPublic = "";
var categoryName = "";
var dataServiceUrl = "";
var dataServiceHostUrl = "";
var dashboardDescription = "";
var datasourceId = "";
var browser = "";
var sameOrigin = true;

$(document).ready(function () {
    browser = ej.browserInfo();
    dashboardId = $('meta[name="dashboard:id"]').attr("content");
    dashboardName = $('meta[name="dashboard:name"]').attr("content");
    categoryName = $('meta[name="category:name"]').attr("content");
    designerServiceUrl = $('meta[name="designer_service:url"]').attr("content");
    dashboardServerUrl = $('meta[name="dashboard_server:url"]').attr("content");
    dashboardServiceUrl = $('meta[name="dashboard_service:url"]').attr("content");
    version = $("meta[name='dashboard:version']").attr("content");
    designerToken = $('meta[name="designer_service:access_token"]').attr("content");
    isPublic = $('meta[name="ispublic"]').attr("content");
    isUnlisted = $('meta[name="isunlisted"]').attr("content");
    unlistedCode = $('meta[name="unlistedcode"]').attr("content");
    dataServiceUrl = $("meta[name='data_service:url']").attr("content");
    dataServiceHostUrl = $("meta[name='data_service_host:url']").attr("content");
    dashboardDescription = $("meta[name='dashboard:description']").attr("content");
    datasourceId = $('meta[name="datasource:id"]').attr("content");

    try {
        sameOrigin = window.parent.location.host == window.location.host;
    }
    catch (e) {
        sameOrigin = false;
    }
        
    $("#commentImage_popup").show();
    $("#dashboard").width($(window).width());
    $("#dashboard").css("padding-left", $("#menu-area").width());
  
    var dateFormat = $('meta[name="globalization:date_format"]').attr("content");
    var timeFormat = $('meta[name="globalization:time_format"]').attr("content").toLowerCase() == "true" ? "HH:mm" : "hh:mm tt";

    setWidth();
    if (browser != null && browser.name === "msie" && parseFloat(browser.version) <= 8.0) {
        var divString = '<div style="top:20%;width:575px;margin:0px auto;position:relative;text-align:center">' +
            '<div style="padding:35px 68px 35px 68px;" class="e-dbrd-control-container">' +
            '<p style="font-size:18px;font-weight:bold">[[[Internet Explorer 8 and Internet Explorer 11 in Enterprise Mode are not supported]]]</p>' +
            '<p style="font-size:10px">[[[Please upgrade to a newer browser if you are using IE8 or turn off Enterprise Mode if you are using IE11 in Enterprise Mode.]]]</p>' +
            '<p style="text-align:left;margin-top:20px">[[[Supported Browsers:]]]</p><div class="alert-ie">' +
            '<div><span><img  src="' + commonImageIe + '" /></span><p>Internet Explorer 9+</p> </div> ' +
            '<div><span><img  src="' + commonImageEdge + '" /> </span><p>Microsoft Edge</p></div>' +
            '<div><span><img  src="' + commonImageFirefox + '" /></span><p>Mozilla Firefox 22+</p></div>' +
            '<div><span><img  src="' + commonImageChrome + '" /></span><p>Chrome 17+</p></div>' +
            '<div><span><img  src="' + commonImageOpera + '" /></span><p>Opera 12+</p></div>' +
            '<div><span><img  src="' + commonImageSafari + '" /></span><p>Safari 5+</p></div></div></div>';
        var body = document.getElementById("dashboard");
        body.style.backgroundColor = "white";
        body.innerHTML = divString;
    } else {
        if (viewId != null && viewId != "") {
            var viewName = "";
            var canUpdate = false;
            var link = "";
            $.ajax({
                type: "POST",
                url: getViewParameterUrl,
                data: { ViewId: viewId, UserId: userId, UserName: userName, itemid: dashboardId, IsMultiDashboard: isMultiDashboard, parentDashboardId: parentId },
                success: function (data) {
                    var viewDetails;
                    if (data.viewDetails != null && data.viewDetails != '') {
                        if (data.isPublic) {
                            viewDetails = data.viewDetails;
                            viewName = viewDetails.ViewName;
                            parameter = decodeURI(viewDetails.QueryString);
                            canUpdate = viewDetails.CanEdit;
                        } else {
                            viewDetails = JSON.parse(data.viewDetails);
                            viewName = viewDetails.ViewName;
                            parameter = decodeURI(viewDetails.QueryString);
                            canUpdate = viewDetails.CanEdit;
                        }
                    }
                    else {
                        window.location.href = window.location.href.replace(window.location.search, "");
                    }
                    $('#dashboard').ejDashboardDesigner({
                        serviceUrl: designerServiceUrl,
                        dataServiceUrl: dataServiceUrl,
                        serverUrl: dashboardServerUrl,
                        mode: ej.dashboardDesigner.mode.view,
                        itemId: dashboardId,
                        datasource: datasourceId,
                        dashboardPath: dashboardId + "/" + version,
                        dashboardName: dashboardName,
                        dashboardDescription: dashboardDescription,
                        serviceAuthorizationToken: designerToken,
                        bannerSettings: {
                            backButtonSettings: {
                                enable: showMyDashboards.toLowerCase() == "true" ? true : false,
                                URL: myDashboardsUrl,
                                tooltip:"BacktoAllDashboards"
                            },
                            dashboardInfo: dashboardDescription
                        },
                        _favoriteSettings: {
                            enabled: enableComment.toLowerCase() == "true",
                            isFavorite: isFavorite.toLowerCase() == "true"
                        },
                        _onFavoriteStateChange: "updatefavorite",
                        filterOverviewSettings: {
                            showSaveIcon: (isSlideshow) ? false : ($("#is_mobile").val() == "false" ? viewDetails.CanEdit : false),
                            showSaveAsIcon: (isSlideshow) ? false : ($("#is_mobile").val() == "false" ? isUserAuthenticated == "true" : false),
                            showViewSavedFilterIcon: !(isSlideshow),
                            viewName: viewDetails.ViewName,
                            viewId: viewId
                        },
                        _onSaveFilter: "saveFilter",
                        _onSaveAsFilter: "saveAsFilter",
                        _onViewSavedFilters: "openViewSection",
                        onBannerIconClick: "onBannerIconClick",
                        beforeWidgetIconRendered: "beforeWidgetIconRendered",
                        onWidgetIconClick: "onWidgetIconClick",
                        actionComplete: "onActionCompleteOfNewDashboardViewer",
                        filterParameters: parameter,
                        _isPublic: isPublic.toLowerCase() == "true",
                        _isUnlisted: isUnlisted.toLowerCase() == "true",
                        _unlistedCode: unlistedCode,
                        beforeBannerIconRender: "beforeBannerIconRender",
                        beforeOtherOptionContextMenuRender: "beforeOtherOptionContextMenuRender",
                        showGetLinkIcon: !isSlideshow,
                        serverSettings: {
                            backButtonSettingsURL: myDashboardsUrl
                        }
                    });

                    $("#current-view").show();
                    $("#current-view").html("");
                    if (canUpdate) {
                        $("#saved-filter-update").show();
                        $("#update-view").addClass("pointer-events");
                        $("#update-view").css("opacity", 0.5);
                    } else {
                        $("#saved-filter-Saveas").show();
                    }
                    $("#save-section").hide();
                    $("#save-lable-section label").html("");

                    link = '<a class="saved-view-link txt-overflow" href="' +
                        pageurl +
                        '?viewid=' +
                        viewId +
                        '" target="_blank" data-toggle="tooltip" data-original-title="' + viewName + '">' +
                        viewName +
                        '</a>';
                    $("#save-lable-section label").append(link);
                    $("#save-lable-section").show();
                    $("#new-save").hide();
                    $("#unsaved-filter,#unsaved-filter-title").show();
                    $('.saved-view[viewid="' + viewId + '"').css("background-color", "#f9f9f9");
                },
                error: function () {
                    window.location.href = window.location.href.replace(window.location.search, "");
                }
            });
        } else {
            $('#dashboard').ejDashboardDesigner({
                serviceUrl: designerServiceUrl,
                dataServiceUrl: dataServiceUrl,
                serverUrl: dashboardServerUrl,
                mode: ej.dashboardDesigner.mode.view,
                itemId: dashboardId,
                datasource: datasourceId,
                dashboardPath: dashboardId + "/" + version,
                dashboardName: dashboardName,
                dashboardDescription: dashboardDescription,
                serviceAuthorizationToken: designerToken,
                bannerSettings: {
                    backButtonSettings: {
                        enable: showMyDashboards.toLowerCase() == "true" ? true : false,
                        URL: myDashboardsUrl,
                        tooltip: "BacktoAllDashboards"
                    },
                    dashboardInfo: dashboardDescription
                },
                _favoriteSettings: {
                    enabled: enableComment.toLowerCase() == "true",
                    isFavorite: isFavorite.toLowerCase() == "true"
                },
                _onFavoriteStateChange: "updatefavorite",
                filterOverviewSettings: {
                    showSaveIcon: (isSlideshow ) ? false : ($("#is_mobile").val() == "false" ? isUserAuthenticated == "true" : false),
                    showSaveAsIcon: (isSlideshow) ? false : ($("#is_mobile").val() == "false" ? isUserAuthenticated == "true" : false),
                    showViewSavedFilterIcon: !(isSlideshow),
                    viewName: null,
                    viewId: null
                },
                _onSaveFilter: "saveFilter",
                _onSaveAsFilter: "saveAsFilter",
                _onViewSavedFilters: "openViewSection",
                onBannerIconClick: "onBannerIconClick",
                beforeWidgetIconRendered: "beforeWidgetIconRendered",
                onWidgetIconClick: "onWidgetIconClick",
                actionComplete: "onActionCompleteOfNewDashboardViewer",
                showGetLinkIcon: !isSlideshow,
                _isPublic: isPublic.toLowerCase() == "true",
                _isUnlisted: isUnlisted.toLowerCase() == "true",
                _unlistedCode: unlistedCode,
                beforeBannerIconRender: "beforeBannerIconRender",
                beforeOtherOptionContextMenuRender: "beforeOtherOptionContextMenuRender",
                serverSettings: {
                    backButtonSettingsURL: myDashboardsUrl
                }
            });
        }
    }

    $('.preloader-wrap').fadeOut();
    $("#menu-area").removeClass("display-none");

    var feedbackWaitingPopupTemplateId = createLoader("body");
    $("#body").ejWaitingPopup({ template: $("#" + feedbackWaitingPopupTemplateId) });

    $("[data-toggle='tooltip']").tooltip();
    $('.help-option [second-toggle="tooltip"]').tooltip();



    if (isSlideshow) {
        $("body").addClass("hide-dashboard-icons");
        //Remove side bar
        $("#dashboard-view-toogle").css("display", "none");
        $("#dashboard").css("margin-right", "0").css("width", $(window).width() + "px");
    }

    $(window).resize(function () {
        var dashboardEle = $("#dashboard");
        ResizePopup();
        if (isSlideshow) {
            dashboardEle.css("height", $(window).height() + "px").css("width", $(window).width() + "px");
        } else {
            if ($("#is_mobile").val() == "true") {
                dashboardEle.css("height", $(window).height() - $("#server-mobile-navbar").height() + "px");
            }
            if ((sameOrigin ? parent.$(".su-sidebar-collapse").length : $(".su-sidebar-collapse").length) <= 0) {
                setWidth();
            } else {
                if ($("#comments, #views").hasClass('active')) {
                    dashboardEle.css("width", $(window).width() - 450 + "px");
                }
            }
        }
    });
});

function beforeWidgetIconRendered(event) {
    $("#sample-data-notification").show();
    if (isSlideshow) {
        event.iconsinformation = [];
        event.iconsinformation.length = 0;
        return;
    }
    if (enableComment.toLowerCase() == "true" && ej.DashboardDesignerUtility.Serialization.getInstance().dashboardPropertyJson.EnableComments) {
        var currentWidgetGuid = event.widgetInformation.getReportItemJson().UniqueId;
        var enableWidgetComment = event.widgetInformation.getReportItemJson().ContainerSettings.EnableComment;
        //The below line needs to be removed once the widget guid added by the viewer team.
        $(event.widgetInformation.controlContainer).attr("data-widget-id", currentWidgetGuid);
        event.iconsinformation.push({
            "class": enableWidgetComment ? commentedWidgets.includes(currentWidgetGuid) ? "su-with-comment su-icon" : "su-without-comment su-icon" : "",
            "name": "comment",
            "tooltip": "Comment"
        });
    } else {
        $("#comments").remove();
    }
}

function onBannerIconClick(arg) {
    if (typeof (arg.name) != "undefined" && arg.name == "editdashboard") {
        arg.event.preventDefault();
    }

    var dashboardViewerInstance = $("#dashboard").data("ejDashboardDesigner");
    if (typeof (arg.name) != "undefined") {
        switch (arg.name.toLowerCase()) {
            case "getlink":
                var shareLinkDlg = $("#get_item_link");
                $(".dashboard-link, .private-note").show();
                itemUrl = window.location.href;
                shareLinkDlg.find(".report-name").html(dashboardViewerInstance.model.dashboardName).attr("title", dashboardViewerInstance.model.dashboardName);
                shareLinkDlg.ejDialog("open");
                break;

            case "editdashboard":
                $("body").ejWaitingPopup({ text: 'Preparing the dashboard to edit' }).ejWaitingPopup("show");
                var loaderEle = $("#body-loader-icon");
                $("#body-loader-icon").css("top", "39%");
                loaderEle.siblings("div.e-text").css("top", "39%").css("margin-top", "30px").css("font-size", "21px").css("font-family", "Roboto");
                $("#body_WaitingPopup").addClass("bg-color-white");
                parent.window.location.href = editDashboardUrl;
                break;

            case "dashboard-info":
                var itemInfoCtrl = angular.element($('[ng-controller=ItemInfoCtrl]')).scope();
                itemInfoCtrl.openInfoDialog(dashboardItemDetail, false);
                break;

            case "fullscreen":
                //close comment window
                $("#dashboard-comment").removeClass("highlight-icon");
                closeDashboardComment();
                //close views window
                $("#close-container").trigger("click");

                switchFullscreenMode();
                break;

            case "dashboardcomment":
                var src = $("#commentModuleContainer iframe").attr("src");
                if (src === undefined || src === "") {
                    $("#commentModuleContainer iframe").attr("src", commentPageUrl + "?itemId=" + $("#commentModuleContainer_iframe").attr("data-item-id") + "&viewer=v2");
                }
                if ($("#commentModuleContainer").hasClass("displayNone")) {
                    $("#close-container").trigger("click");
                    $("#dashboard-comment").addClass("highlight-icon");
                    $("#comment-module-container-loader-icon").show();
                    openDashboardComment(null);
                    $("#dashboard").css("width", $(window).width() - 410);
                }

                else {
                    $("#dashboard-comment").removeClass("highlight-icon");
                    closeDashboardComment();
                    $("#dashboard").css("width", $(window).width());
                }

                var data = $("#dashboard").data("ejDashboardDesigner");
                data.resizeDashboard();
                if (window.top != window.self && iframeUrl === parentUrl) {
                    if (!parent.$(".su-sidebar-collapse").is(":visible") || parent.$(".su-sidebar-collapse").is(":visible")) {
                        parent.$("#item-viewer").css({ "width": "100%" });
                        parent.$(".item-list-panel, .su-sidebar-collapse").css({ "display": "none" });
                        parent.$(".su-sidebar-expand").css({ "display": "block" });
                        parent.$("#item-viewer").css({ "height": $(window).height() - $("#header-area").outerHeight() - $("#base-footer-div").outerHeight(), "width": $(window).width() - parent.$("#main-nav").width() - parent.$(".su-sidebar-expand.category-collapse").width(), "top": $("#header-area").height() });
                        var windowwidth = parent.$("#dashboard_render_iframe").width();
                        parent.$("#dashboard_render_iframe").contents().find("#dashboard").css("width", windowwidth - 410);
                    }
                }
                break;

            case "dashboardviews":
                var dashboardViewPanelObj = $("#dashboard-view-toogle");
                if (!dashboardViewPanelObj.hasClass("dashboard-view-toogle")) {
                    $("#dashboard-comment").removeClass("highlight-icon");
                    closeDashboardComment();
                    $("#dashboard-view").addClass("highlight-icon");
                    $('body [data-toggle="tooltip"]').tooltip('hide');
                    dashboardViewPanelObj.toggleClass("dashboard-view-toogle");
                    dashboardViewPanelObj.show();
                    dashboardViewPanelObj.ejWaitingPopup("show");
                    GetSavedFilter();
                    $("#dashboard").toggleClass("dashboard");
                    $(".view-heading").toggle();
                    $("#dashboard-views").toggle();
                    if (dashboardViewPanelObj.hasClass("dashboard-view-toogle")) {
                        dashboardViewPanelObj.find("#close-container a").css("display", "block");
                    }
                    else {
                        dashboardViewPanelObj.find("#close-container a").css("display", "none");
                    }
                    refreshScroller();
                    dashboardViewPanelObj.find("#saved-list").length == 0 ? dashboardViewPanelObj.find("#no-filters").css("display", "block") : dashboardViewPanelObj.find("#no-filters").css("display", "none");
                    dashboardViewPanelObj.ejWaitingPopup("hide");
                    $("#dashboard").css("width", $(window).width() - 410);
                }
                else {
                    $("#close-container").trigger("click");
                    $("#dashboard-view").removeClass("highlight-icon");
                    $("#dashboard").css("width", $(window).width());
                }

                var data = $("#dashboard").data("ejDashboardDesigner");
                data.resizeDashboard();
                if (window.top != window.self && iframeUrl === parentUrl) {
                    if (!parent.$(".su-sidebar-collapse").is(":visible") || parent.$(".su-sidebar-collapse").is(":visible")) {
                        parent.$("#item-viewer").css({ "width": "100%" });
                        parent.$(".item-list-panel, .su-sidebar-collapse").css({ "display": "none" });
                        parent.$(".su-sidebar-expand").css({ "display": "block" });
                        parent.$("#item-viewer").css({ "height": $(window).height() - $("#header-area").outerHeight() - $("#base-footer-div").outerHeight(), "width": $(window).width() - parent.$("#main-nav").width() - parent.$(".su-sidebar-expand.category-collapse").width(), "top": $("#header-area").height() });
                        var windowwidth = parent.$("#dashboard_render_iframe").width();
                        parent.$("#dashboard_render_iframe").contents().find("#dashboard").css("width", windowwidth - 410);
                    }
                }
                break;

            case "sharedashboard":
                shareDashboardPermission(dashboardItemDetail);
                break;

            case "refreshdashboard":
                $("#dashboard").data("ejDashboardDesigner").updateDashboard();
                break;

            default:
                break;
        }        
    }
}

function onWidgetIconClick(information) {
    if (typeof (information.name) != "undefined") {
        switch (information.name) {
            case "pin widget":
                var pinWidgetPopupEle = $("#pin-widget-popup");
                pinWidgetPopupEle.ejDialog("open");
                $("#pin-widget-popup_wrapper").ejWaitingPopup("show");
                $("#pin-widget-popup-iframe").attr("src", pinWidgetToHomepageUrl + "?itemId=" + $("#pin-widget-popup").attr("data-item-id") + "&version=" + version);
                pinWidgetPopupEle.attr("data-widget-id", information.widgetId).attr("data-widget-name", information.headertext);
                pinWidgetPopupEle.attr("data-tab-id", information.tabId != null ? information.tabId : null);
                break;
            case "comment":
                openWidgetComment(information);
                break;
            default:
                break;
        }
    }
}

function refreshDashboarDesigner() {
    var windowHeight = $(window).innerHeight();
    var headerHeight = $("#designer-header").outerHeight();
    var containerHeight = windowHeight - headerHeight;
    $("#dashboard").height(containerHeight);
    $("#dashboard").width($(window).width());
}

function onActionCompleteOfNewDashboardViewer(arg) {
    if (typeof (arg) != "undefined") {
        switch (arg.eventType) {
            case "renderDashboard":                
                    openComments();
                    //TODO: Browser History maintenance
                    //updateNavigationHistory();
                    resetViewPanel();             
                break;
            case "resizeDashboard":
                closeCommentOnResize();
                break;
            default:
                break;
        }
    }
}

function updateNavigationHistory() {
    var currentUrl = parent.$("#current-url").attr("data-url");
    var stateObj = window.top.history.state;
    if (parent.window.innerWidth >= 1041 && history.pushState != undefined) {
        if (currentUrl != undefined) {
            var currentQuery = getQueryWithoutViewCommentTab(parent.window.location.search.substring(1));
            window.top.history.replaceState(stateObj, "DashboardViewer", parent.window.location.pathname + currentQuery /*+ "&tab=" + tabName*/);
        } else {
            var currentQuery = getQueryWithoutViewCommentTab(window.location.search.substring(1));
            if (currentQuery === "") {
                window.top.history.replaceState(stateObj, "DashboardViewer", window.location.pathname /*+ "?tab=" + tabName*/);
            }
            else {
                window.top.history.replaceState(stateObj, "DashboardViewer", window.location.pathname + currentQuery /*+ "&tab=" + tabName*/);
            }
        }
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

function createLoader(element) {
    var returnId = "";
    if (typeof element === "string") {
        var selector = (element.indexOf(".") === 0) ? "." : "#";
        element = (element.indexOf(".") === 0) ? element.slice(1, element.length) : (element.indexOf("#") === 0) ? element.slice(1, element.length) : element;
        returnId = element + "-loader-icon";

        if ($("#" + returnId).length == 0 && $(selector + element).length != 0) {
            var template = $("<div class='loader-blue loader-icon' id='" + returnId + "'><svg class='circular'><circle class='path' cx='27' cy='27' r='20' fill='none' stroke-width='4' stroke-miterlimit='10'></circle></svg></div>");
            $("body").append(template);
        }
        return returnId;
    }
    else {
        element = element.selector;
        var selector = (element.indexOf(".") === 0) ? "." : "#";
        element = element.slice(1, element.length);
        returnId = element + "-loader-icon";
        if ($("#" + returnId).length == 0 && $(selector + element).length != 0) {
            var template = $("<div class='loader-blue loader-icon' id='" + returnId + "'><svg class='circular'><circle class='path' cx='27' cy='27' r='20' fill='none' stroke-width='4' stroke-miterlimit='10'></circle></svg></div>");
            $("body").append(template);
        }
    }

    return returnId;
}

function setWidth() {
    var dashboardElement = $("#dashboard");
    if (isSlideshow) {
        dashboardElement.css("width", $(window).width() + "px");
    } else {
        dashboardElement.css("width", $(window).width() + "px");
        if ($(".server-banner-icon").hasClass('highlight-icon')) {
            dashboardElement.css("width", $(window).width() - 410 + "px");
        }
    }
}

function commentImageDialogClose() {
    $("#commentImage_popup").ejDialog("close");
    $("#commentImage_popup_image").attr('src', "");
}

function getQueryWithoutViewCommentTab(queryString) {
    var returnString = '', queries, temp, i, l;
    if (queryString !== "") {
        queries = queryString.split("&");
        for (i = 0, l = queries.length; i < l; i++) {
            temp = queries[i].split('=');
            if (temp[0].toLowerCase() !== "tab" && temp[0].toLowerCase() !== "viewid" && temp[0].toLowerCase() !== "comment" && temp[0] !== "filterQuery") {
                returnString += (returnString === '' ? '?' : '&') + queries[i];
            }
        }
    }
    return returnString;
}

function beforeBannerIconRender(args) {
    if ($("#is_mobile").val() == "false") {
        var filterOverviewOption = args.iconsinformation.shift();
        var commentAndView = {
            groupId: "dashboard-comment-view",
            groupName: "Dashboard Comment & Views",
            items: [
                createBannerIcon("<div/>", "dashboard-refresh", "e-dbrd-banner-refresh", "Refresh", "refreshdashboard", true, false, { "font-size": "14px" })
            ],
        };

        if (!isSlideshow) {
            if (enableComment.toLowerCase() == "true" && ej.DashboardDesignerUtility.Serialization.getInstance().dashboardPropertyJson.EnableComments) {
                commentAndView.items.push(createBannerIcon("<div/>", "dashboard-comment", isDashboardCommented ? "su su-with-comment" : "su su-without-comment", "Comment", "dashboardcomment", true, false, { "font-size": "15px" }));
            }

           
                commentAndView.items.push(createBannerIcon("<div/>", "dashboard-view", "su su-view", "Views", "dashboardviews", true, false, { "font-size": "17px" }));
           

            commentAndView.items.push(createBannerIcon("<div/>", "dashboard-fullscreen", "su su-maximize-1 tv-mode-icon", "Fullscreen", "fullscreen", true, false, { "font-size": "14px" }));

            args.iconsinformation.unshift(commentAndView);

            if ((canEdit || isAdmin || dashboardItemDetail.CreatedById == userId)) {

                var editShareIconGroup = {
                    groupId: "dashboard-share-edit",
                    groupName: "Dashboard Share & Edit",
                    items: [],
                }

                if (canEdit) {
                    editShareIconGroup.items.push(createBannerIcon("<a/>", "dashboard-edit", "su su-edit", "Edit", "editdashboard", true, true, { "width": "65px", "font-size": "13px", "padding-left": "7px" }, editDashboardUrl));
                }

                if (isAdmin || dashboardItemDetail.CreatedById == userId) {
                    editShareIconGroup.items.push(createBannerIcon("<span/>", "dashboard-share", "su su-share", "Share", "sharedashboard", true, true, { "width": "70px", "font-size": "13px", "padding-left": "7px" }));
                }

                args.iconsinformation.unshift(editShareIconGroup);
            }
        } else {
            args.iconsinformation.unshift(commentAndView);
        }

        args.iconsinformation.unshift(filterOverviewOption);
    }
}

function beforeOtherOptionContextMenuRender(args) {
    
    if (isUserAuthenticated.toLowerCase() == "true") {
        args.iconsinformation.push(
            {
                groupId: "other-option-info",
                groupName: "Info",
                items: [
                    {
                        id: "dashboard-info",
                        text: "Info",
                        class: ""
                    }
                ]
            }
        );
    }
}

function createBannerIcon(tag, id, className, label, dataName, dataEvent, showText, css, href) {
    if (showText) {
        return jQuery(tag, {
            id: id,
            html: jQuery('<span/>', { "class": "icon-with-label", text: label, css: { "font-family": "Roboto", "padding": "10px" } }),
            "class": "server-banner-icon e-dashboard-banner-icon e-dbrd-designer-hoverable " + className,
            "data-name": dataName,
            "data-event": dataEvent,
            "href": href,
            css: css
        });
    } else {
        return jQuery(tag, {
            id: id,
            "class": "server-banner-icon e-dashboard-banner-icon e-dbrd-designer-hoverable " + className,
            "data-tooltip": label,
            "data-name": dataName,
            "data-event": dataEvent,
            css: css
        });
    }
}