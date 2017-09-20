$(document).on("click", "#server-mobile-navbar .server-comment", function () {
    if (!$(this).hasClass("active")) {
        $("a.active").removeClass("active");
        $("#dashboard-view-toogle").removeClass("dashboard-view-toogle");
        $(this).addClass('active');
        if ($("#comment_Type").attr("data-item-type") == "individual-widget") {
            $(".e-dbrd-banner-widget-withoutcomments, .e-dbrd-banner-widget-withcomments").click();
        } else {
            $("#comments .su-without-comment, #comments .su-with-comment").click();
        }
        if ($("#is_mobile").val() == "true" && window.innerWidth < 410) {
            $("#dashboard, #widget").hide();
        }
    } else {
        showRenderTab();
    }
});

$(document).on("click", "#server-mobile-navbar .su-nav-dashboard, #server-mobile-navbar .su-nav-widgets", function () {
    showRenderTab();
});

$(document).on("click", "#server-mobile-navbar .server-item-view", function (e) {
    if (!$(this).hasClass("active")) {
        $("a.active").removeClass("active");
        $("#dashboard, #widget").show();
        $("#comment_Type").attr("data-item-type") == "individual-widget" ? closeWidgetComment() : closeComment();
        $(this).addClass('active');
        $("li#filters").click();
        $("span.view-heading").css("display", "block");
    } else {
        showRenderTab();
    }
});

$(document).on("click", "#server-mobile-navbar .su-view", function (e) {
    if (!$(this).hasClass("active")) {
        $("a.active").removeClass("active");
        $("#dashboard, #widget").show();
        $("#comment_Type").attr("data-item-type").toLowerCase() == "individual-widget" ? closeWidgetComment() : closeComment();
        $(this).addClass('active');
        $("li#views").click();
    } else {
        showRenderTab();
    }
});

$(document).on("click", "#server-mobile-navbar .su-nav-home", function (e) {
    if (!$(this).hasClass("active")) {
        $("a.active").removeClass("active");
        $(this).addClass('active');
    }
});

function showRenderTab() {
    $("a.active").removeClass("active");
    $(".su-nav-dashboard, .su-nav-widgets").addClass('active');
    $("#dashboard-view-toogle").removeClass("dashboard-view-toogle");
    $("#dashboard, #widget").show();
    $("#comment_Type").attr("data-item-type") == "individual-widget" ? closeWidgetComment() : closeComment();
}

$(document).on("touchend", "[data-toggle='tooltip']", function (e) {
    if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i))) {
        $(this).click();
    }
});

$(document).on("click", "#close-filter", function () {
    $("#filter-view").css("display", "none");

    if ($("#is_mobile").val() == "true") {
        $('#dashboard').show();
        if ($("#server-mobile-navbar .server-item-view").hasClass('active')) {
            $("#server-mobile-navbar a.active").removeClass("active");
            $("#server-mobile-navbar .su-nav-dashboard").addClass('active');
        }
    }

    $(".options").css("right", "0px");
    $(".options li").removeClass("active");
});

$(document).on("click", "#close-container", function () {
    CloseDashboardView();
    if ($("#is_mobile").val() == "true") {
        $('#dashboard').show();
        if ($("#server-mobile-navbar .su-view").hasClass('active')) {
            $("#server-mobile-navbar a.active").removeClass("active");
            $("#server-mobile-navbar .su-nav-dashboard").addClass('active');
        }
    }
    $(".options").css("right", "0px");
    $(".options li").removeClass("active");
});