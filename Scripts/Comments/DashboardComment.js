﻿$(document).ready(function () {
    var popupHeight = $("#viewShare_popup").height();
    $("#sharepopup_wrapper_WaitingPopup .e-image").css("top", parseInt(parseInt(popupHeight) / 2) - 30);

    if ($("#is_mobile").val() == "true") {
        var mobHeight = $(window).height() - 50;
        $("#dashboard").css("height", mobHeight);
        $(".server-dashboard-view").css("height", mobHeight);
    }
});

$(window).on("orientationchange", function () {
    if ($("#is_mobile").val() == "true") {
        var mobHeight = $(window).height() - 50;
        $("#dashboard").css("height", mobHeight);
        $(".server-dashboard-view").css("height", mobHeight);
    }
});

function ShareView(obj) {
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var popupWidth = $("#viewShare_popup").width();
    var popupHeight = $("#viewShare_popup").height();
    var leftPostition = (parseInt(windowWidth) - parseInt(popupWidth)) / 2;
    var topPostition = (parseInt(windowHeight) - parseInt(popupHeight)) / 2;
    if (topPostition < 0) {
        topPostition = 0;
    }
    $("#viewShare_popup").css({ "left": leftPostition, "top": topPostition });
    $("#viewShare_popup,.ViewShare_popup_shadow").css("display", "block");
    $("#sharepopup_wrapper_WaitingPopup").css("display", "block");
    $("#viewShare_popup_iframe").attr("src", itemViewShareIframeUrl + "?itemId=" + obj.viewId);
}
function ResizePopup() {
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var popupWidth = $("#viewShare_popup").width();
    var popupHeight = $("#viewShare_popup").height();
    var leftPostition = (parseInt(windowWidth) - parseInt(popupWidth)) / 2;
    var topPostition = (parseInt(windowHeight) - parseInt(popupHeight)) / 2;
    if (topPostition < 0) {
        topPostition = 0;
    }
    $("#viewShare_popup").css({ "left": leftPostition, "top": topPostition });
}

function openDashboardComment(obj) {
    var itemId = $("#dashboard_Comment").attr("data-item-id");
    var isMultiDashboard = $("#isMultiDashboard").attr("data-item-id");
    $("#commentModuleContainer").toggleClass("displayNone");
    if ($("#commentModuleContainer").hasClass("displayNone")) {
        closeDashboardComment();
    } else {
        closeWidgetComment();
        if (typeof (window.frames[0].GetAllComments) === 'function') {
            window.frames[0].GetAllComments(itemId, "dashboard", itemId, "desc", isMultiDashboard);
        } else {
            $('#commentModuleContainer_iframe').on('load', function () {
                window.frames[0].GetAllComments(itemId, "dashboard", itemId, "desc", isMultiDashboard);
            });
        }
    }
};

function openWidgetComment(obj) {
    var itemId = (obj != null) ? obj.reportGuid : $("#comment_Type").attr("data-item-id");
    if (!$("#widgetCommentModuleContainer").hasClass("displayNone")) {
        closeWidgetComment();
    } else {
        var positionX = $('#' + itemId).offset().left + $('#' + itemId).width();
        var positionY = $('#' + itemId).offset().top;
        var right = $(window).width() - (positionX + 350);
        if (right < 0) {
            right = $(window).width() - (positionX - ($(window).width() < 450 ? 0 : 75));
            if ($(window).width() < 375) {
                right = 0;
            }
        }

        $('#widgetCommentModuleContainer').css({ 'top': positionY, 'right': right, 'position': 'absolute', 'min-height': '152px', 'height': '152px' });
        $("#widgetCommentModuleContainer").toggleClass("displayNone");
        var frameDoc = document.getElementById("widgetCommentModuleContainer_iframe");
        if (frameDoc != null && $("#widgetCommentModuleContainer_iframe").attr("src") != null) {
            if (typeof (frameDoc.contentWindow.GetAllComments) === 'function') {
                frameDoc.contentWindow.itemId = itemId;
                frameDoc.contentWindow.GetAllComments(itemId, "widget", $("#dashboard_Comment").attr("data-item-id"), "desc", $("#isMultiDashboard").attr("data-item-id"))
            } else {
                $('#commentModuleContainer_iframe').on('load', function () {
                    frameDoc.contentWindow.itemId = itemId;
                    frameDoc.contentWindow.GetAllComments(itemId, "widget", $("#dashboard_Comment").attr("data-item-id"), "desc", $("#isMultiDashboard").attr("data-item-id"))
                });
            }
        } else {
            $("#widgetCommentModuleContainer_iframe").attr("src", Commentswidgets + "?itemId=" + itemId);
        }
    }
}

function closeWidgetComment() {
    if (!$("#widgetCommentModuleContainer").hasClass("displayNone")) {
        var frameDoc = document.getElementById("widgetCommentModuleContainer_iframe");
        if (frameDoc != null && $("#widgetCommentModuleContainer_iframe").attr("src") != null && typeof (frameDoc.contentWindow.GetAllComments) === 'function') {
            frameDoc.contentWindow.$("#commentList").html("");
            frameDoc.contentWindow.$('.additional-content').html("");
            frameDoc.contentWindow.$('#comment_action_area').show().removeClass('isHide');
            frameDoc.contentWindow.$('#comment_submit_container').hide();
            frameDoc.contentWindow.$('#comment_count').text('0');
            frameDoc.contentWindow.refreshCommentScroller();
            frameDoc.contentWindow.getAllCommentAjax.onreadystatechange = null;
            frameDoc.contentWindow.getAllCommentAjax.abort();
        }
        $("#widgetCommentModuleContainer").addClass("displayNone");
        $("#delete_popup_iframe").addClass("displayNone");
    }
}

function closeDashboardComment() {
    $("#commentImage_popup").ejDialog("close");
    $("#commentModuleContainer").addClass("displayNone");
    $("#delete_popup_iframe").addClass("displayNone");

    if ($("#is_mobile").val() == "true") {
        $('#dashboard').show();
        if ($("#server-mobile-navbar .server-comment").hasClass('active')) {
            $("#server-mobile-navbar a.active").removeClass("active");
            $("#server-mobile-navbar .su-nav-dashboard").addClass('active');
        }
    }
}

function closeComment() {
    closeWidgetComment();
    $('#dashboard').data("ejDashboardViewer").removeCommentToggleState();
}

function closeCommentOnResize() {
    if ($("#is_mobile").val() == "false") {
        closeWidgetComment();
        $('#dashboard').data("ejDashboardViewer").removeCommentToggleState();
    }
}

function openComments() {
    if (isSlideshow != undefined && isSlideshow) {
        parent.$('body').trigger('dashboardRenderComplete');
    }

    if (isMultiDashboard.toLowerCase() == "true") {
        item_Id = $("#dashboard").data("ejDashboardViewer")._getCurrentDashboardGuid();
        $("#dashboard_Comment").attr("data-item-id", item_Id);
        $("#favorite_Item").attr("data-item-id", item_Id);
    }

    var designerValues = $("#dashboard").data("ejDashboardViewer");
    var designerArray = designerValues.currentReport.layout;
    for (i = 0; i < designerArray.length; ++i) {
        if (designerArray[i].Key == "EnableComment") {
            var commentValue = designerArray[i].Value;
            if (!commentValue) {
                $("#comments").remove();
            }
        }
    }

    filterView();
    var commentId = getUrlVars(window.location.href.split('#')[0])["comment"];
    if (typeof (commentId) !== "undefined" && $("#comment_Type").attr("data-item-type").toLowerCase() == "dashboard") {
        if ($("#is_mobile").val() == "true") {
            if (window.innerWidth < 410) {
                $("#dashboard").hide();
            }
        } else {
            $(".options li#comments").trigger("click");
        }
    } else {
        $("#commentModuleContainer iframe").attr("src", commentPageUrl + "?itemId=" + $("#commentModuleContainer_iframe").attr("data-item-id"));
    }

    if (typeof (commentId) !== "undefined" && $("#comment_Type").attr("data-item-type").toLowerCase() == "widget") {
        var itemId = $("#comment_Type").attr("data-item-id");
        $('#' + itemId).find(".e-dbrd-banner-widget-withcomments").click();
        if ($('#' + itemId).length == 0) {
            $('#filters').click();
            $('#' + itemId).find(".e-dbrd-filterPanel-widget-withcomments").click();
        }
    } else {
        $("#widgetCommentModuleContainer_iframe").attr("src", Commentswidgets + "?itemId=" + itemId);
    }
    var currentTabId = $("#dashboard").data("ejDashboardViewer")._getCurrentDashboardGuid();
    $("#current-selected-tab-id").attr("data-tab-id", currentTabId);
}

function getUrlVars(url) {
    var vars = {};
    var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function updatefavorite() {
    var itemId = $("#favorite_Item").attr("data-item-id");
    var parentId = $("#favorite_Item").attr("data-parent-id");
    var isFavorite = $("#favorite_Item").attr("data-favorite-value").toLowerCase();
    var targetValue = isFavorite == "true" ? false : true;
    var isMultiDashboard = $("#isMultiDashboard").attr("data-item-id");
    $.ajax({
        type: "POST",
        url: favoriteItemUrl,
        data: { itemId: itemId, value: targetValue, isMultiDashboard: isMultiDashboard, parentId: parentId },
        success: function (data) {
            if (data.Success) {
                $("#favorite_Item").attr("data-favorite-value", targetValue);
                $('#dashboard').data("ejDashboardViewer").toggleFavoriteIcon();
            }
            else {
                $("#delete_popup_iframe").removeClass("displayNone");
                frames[1].messageBox("", "[[[Unable to update favorite]]]", "[[[Internal server error. Please try again.]]]", "success", function () {
                    $("#delete_popup_iframe").addClass("displayNone");
                });
            }
        }
    });
}

$(window).on("orientationchange", function () {
    closeComment();
});