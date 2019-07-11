$(document).ready(function () {
    if ($("#is_mobile").val() == "true") {
        var mobHeight = $(window).height() - 50;
        $("#widget").css("height", mobHeight);
    }
});

$(window).on("orientationchange", function () {
    if ($("#is_mobile").val() == "true") {
        var mobHeight = $(window).height() - 50;
        $("#widget").css("height", mobHeight);
    }
});

function openWidgetComment(obj) {
    var itemId = $("#widget_Comment").attr("data-item-id");
    var isMultiDashboard = $("#isMultiDashboard").attr("data-item-id");
    var dashboardItemId = $("#dashboard_Comment").attr("data-item-id");
    $("#commentModuleContainer").toggleClass("displayNone");
    if ($("#commentModuleContainer").hasClass("displayNone")) {
        closeWidgetComment();
    } else {
        $("#commentModuleContainer").css({ 'height': $(window).height() - 4 });
        if (typeof (window.frames[0].GetAllComments) === 'function') {
            window.frames[0].GetAllComments(itemId, "widget", dashboardItemId, "desc", isMultiDashboard);
        } else {
            $('#commentModuleContainer_iframe').on('load', function () {
                window.frames[0].GetAllComments(itemId, "widget", dashboardItemId, "desc", isMultiDashboard);
            });
        }
    }
};

function closeWidgetComment() {
    $("#commentImage_popup").ejDialog("close");
    $("#commentModuleContainer").addClass("displayNone");
    $("#delete_popup_iframe").addClass("displayNone");

    if ($("#is_mobile").val() == "true") {
        $('#widget').show();
        $("#server-mobile-navbar a.active").removeClass("active");
        $("#server-mobile-navbar .su-nav-widgets").addClass('active');
    }
}
function closeCommentOnResize() {
    closeWidgetComment();
    $('#widget').data("ejDashboardViewer").removeCommentToggleState();
}

function openComments() {
    if (isSlideshow != undefined && isSlideshow) {
        parent.$('body').trigger('dashboardRenderComplete');
    }
    var commentId = getUrlVars(window.location.href.split('#')[0])["comment"];
    if (typeof (commentId) !== "undefined") {
        if ($("#is_mobile").val() == "true") {
            if (window.innerWidth < 410) {
                $("#widget").hide();
            }
            $("#server-mobile-navbar").find(".server-comment").trigger("click");
        } else {
            $(".e-dbrd-banner-widget-withcomments").trigger("click");
        }
    }
}

function getUrlVars(url) {
    var vars = {};
    var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}