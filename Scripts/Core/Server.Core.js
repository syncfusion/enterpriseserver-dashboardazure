var userAgent = navigator.userAgent;
var regexIe8 = new RegExp("Trident(\/4.0)|(Trident\/5.0)");
var timeOut;
var searchId;
var isSafari = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
var clearSearch = false;

var keyCode = {
    Tab: 9,
    Enter: 13,
    Shift: 16,
    Ctrl: 17,
    Alt: 18,
    Pause: 19,
    CapsLock: 20,
    PageUp: 33,
    PageDown: 34,
    End: 35,
    Home: 36,
    LeftArrow: 37,
    UpArrow: 38,
    RightArrow: 39,
    DownArrow: 40,
    Insert: 45,
    LeftWindow: 91,
    RightWindow: 92
};

var excludedSearchKeys = [
    keyCode.Tab,
    keyCode.Shift,
    keyCode.Ctrl,
    keyCode.Alt,
    keyCode.Pause,
    keyCode.CapsLock,
    keyCode.PageUp,
    keyCode.PageDown,
    keyCode.End,
    keyCode.Home,
    keyCode.LeftArrow,
    keyCode.UpArrow,
    keyCode.RightArrow,
    keyCode.DownArrow,
    keyCode.Insert,
    keyCode.LeftWindow,
    keyCode.RightWindow
];

$(document).ready(function () {
    $("body, .login-main, #server-app-container").removeAttr("style");
    $("#layout-body-loader-icon").hide();
    $("form").attr("autocomplete", "off");
    $("input[type=text], input[type=password]").attr("autocomplete", "off");
    $("[data-toggle='tooltip']").tooltip();
    $(".dropdown-menu #notify_header").click(function (e) {
        e.stopPropagation();
    });
    $(document).on('click', '#notification-content-area.dropdown-menu', function (e) {
        e.stopPropagation();
    });

    $("#notification-icon").click(function (e) {
        if (!$("#notification-link").hasClass("open")) {

            var scope = angular.element($("#notification-content")).scope();
            scope.$apply(function () {
                scope.notifications = [];
                scope.isFinal = true;
                scope.skip = 0;
                scope.timerMinutes = 0;
            });   

            $("#notification-content-area").ejWaitingPopup();
            $("#notification-content-area").addClass("show");
            $("#notification-content-area").ejWaitingPopup("show");
            $("#notification-content-area").removeClass("show");
            getNotificationList();
        }
    });

    function getNotificationList() {
        $.ajax({
            type: "GET",
            url: getUserNotificationsPartialViewResultUrl,
            success: function (result) {
                if (result !== null) {
                    var scope = angular.element($("#notification-content")).scope();
                    bindNotificationContent(result.Data);
                    init();
                }
            }
        });
    }

    function bindNotificationContent(data) {
        var scope = angular.element($("#notification-content")).scope();
        parent.$("#notification-content-area").ejWaitingPopup("show");
        scope.$apply(function () {
            var skip = scope.skip;
            for (var i = 0; i < data.LogList.length; i++) {
                scope.notifications.push(data.LogList[i]);
            }
            scope.totalNotifications = data.LogCount;
            scope.skip = scope.skip + data.LogList.length;
            scope.isFinal = scope.skip == scope.totalNotifications;
            parent.$("#notification-content-area").ejWaitingPopup("hide");
            setTimeout(function () {
                var imagesgToBeLoadedLater = document.getElementsByTagName('img');
                for (var i = skip; i < imagesgToBeLoadedLater.length; i++) {
                    if (imagesgToBeLoadedLater[i].getAttribute('data-actual-image')) {
                        imagesgToBeLoadedLater[i].setAttribute('src', imagesgToBeLoadedLater[i].getAttribute('data-actual-image'));
                    }
                }
            }, 700);
        });
    }

    var notBackdrop =
      $('<div id="nav-backdrop" class="modal-backdrop" style="z-index: 50; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; color: #fff; opacity: 0; position: absolute"></div>');

    $("#upload-item-section, #notification-link, #account-profile").on('hidden.bs.dropdown', function (e) {
        if (e.target.id === "notification-link") {
            timer.stop();
        }
        parent.$("#nav-backdrop").hide();
    });

    $("#notification-link, #account-profile, #upload-item-section").click(function (e) {
        if ($(".dropdown-backdrop").length === 0) {
            $("body").append(notBackdrop);
        }
        if (!$("#notification-link").hasClass("open")) {
            notBackdrop.show();
        }
        else if (!$("#account-profile").hasClass("open")) {
            notBackdrop.show();
        } else {
            notBackdrop.show();
        }

        if (e.target.id === "notification-link" && !$("#notification-link").hasClass("open")) {
            timer.stop();
        }
    });

    $("#account-profile .dropdown-menu").click(function (e) {
        e.stopPropagation();
    });

    notBackdrop.click(function () {
        notBackdrop.hide();
    });

    $(document).on("click", ".dropdown-backdrop", function () {
        parent.$("#nav-backdrop").hide();
    });

    searchId = $("#search-area").children("input").attr("id");
    if ( searchId == "search-ump-users") {
        $.xhrPool = [];

        $.xhrPool.abortAll = function () {
            $(this).each(function (i, jqXHR) {
                jqXHR.abort();
            });
            $.xhrPool.length = 0;
        }

        $.ajaxSetup({
            beforeSend: function (jqXHR) {
                $.xhrPool.push(jqXHR);
            },
            complete: function (jqXHR) {
                var i = $.xhrPool.indexOf(jqXHR);
                if (i > -1) $.xhrPool.splice(i, 1);
            }
        });
    } else {
        $.xhrPool = [];

        $.xhrPool.abortAll = function () {
            $(this).each(function (i, jqXHR) {
                jqXHR.abort();
            });
            $.xhrPool.length = 0;
        };
        if (typeof ej != "undefined" && typeof ej.UrlAdaptor != "undefined") {
            ej.UrlAdaptor.prototype.beforeSend = function (dm, request) {
                $.xhrPool.push(request);
            }
            $.ajaxSetup({
                complete: function (jqXHR) {
                    var i = $.xhrPool.indexOf(jqXHR);
                    if (i > -1) $.xhrPool.splice(i, 1);
                }
            });
        }
    }
});

$(document).on("keyup", "textarea", function (event) {
    if (event.keyCode != 8 && event.keyCode != 46) {
        var max = $(this).attr("maxlength");
        if (max != undefined && $(this).val().length >= max) {
            $(this).val($(this).val().substring(0, max));
        }
    }
});

function isEmptyOrWhitespace(value) {
    if ($.trim(value) == "")
        return true;
    else
        return false;
}

function convertToBoolean(value) {
    if (typeof (value) === "string") {
        value = value.toLowerCase();
    }
    switch (value) {
        case true:
        case "true":
        case 1:
        case "1":
        case "on":
        case "yes":
            return true;
        default:
            return false;
    }
}

//Handles Ajax error
function handleAjaxError() {
}

function refreshScroller() {
    var expandCollapseIconHeight = $(".collapseIcon").css("display") == "block" ? $(".collapseIcon").height() : 0;
    if ($(window).height() - ($("#CatergoryHeading").outerHeight() + $("#base_menu_container_Div").outerHeight() + $("#listing").outerHeight() + expandCollapseIconHeight) < 0) {
        var scrollerHeight = $(window).height() - ($("#CatergoryHeading").outerHeight() + $("#base_menu_container_Div").outerHeight() + expandCollapseIconHeight);
        var scrollerWidth = $("#CatergoryHeading").outerWidth();
        $("#ScrollElement").ejScroller({
            height: window.innerWidth < 1041 ? (scrollerHeight < 200 ? 200 : scrollerHeight) : scrollerHeight,
            width: scrollerWidth,
            buttonSize: 0,
            scrollerSize: 9
        });
    }
    else {
        if ($("#ScrollElement").data("ejScroller") != undefined) {
            $("#ScrollElement").data("ejScroller").destroy();
        }
    }
}

function refreshScrollerForCategory() {
    var scrollContentHeight = 0;
    for (var i = 0; i < $("#scroll-content #listing>li").length; i++) {
        scrollContentHeight += $($("#scroll-content #listing>li")[i]).outerHeight();
    }
    if ($(window).height() - ($(".item-navigation").outerHeight() + $("#header-area").outerHeight() + $("#category-listing").outerHeight() + scrollContentHeight + $("#create-new-category").outerHeight()) < 0) {
        var scrollerHeight = $(window).height() - ($(".item-navigation").outerHeight() + $("#header-area").outerHeight() + $("#category-listing").outerHeight() + $("#create-new-category").outerHeight());
        var scrollerWidth = $(".item-navigation").outerWidth();

        if ($(".all-items").hasClass("active") && $("#category-list").is(":visible")) {
            $("#scroll-content").ejScroller({
                height: scrollerHeight,
                buttonSize: 0,
                scrollerSize: 9,
                autoHide: true
            });
            var scrollerObject = $("#scroll-content").data("ejScroller");
            if (scrollerObject != undefined && scrollerObject != null) {
                scrollerObject.refresh();
            }
        }
    }
    else {
        if ($("#scroll-content").data("ejScroller") != undefined) {
            $("#scroll-content").data("ejScroller").destroy();
        }
    }
}

function addPlacehoder(object) {
    if (regexIe8.test(userAgent)) {
        $(object).find("input[type=text],input[type=password],textarea").each(function () {
            if ($(this).val() === "") {
                $($("<div>", { "class": "placeholder", text: $(this).attr("placeholder") })).insertAfter(this).show();
            }
            else {
                $($("<div>", { "class": "placeholder", text: $(this).attr("placeholder") })).insertAfter(this).hide();
            }
        });
    }
}

$("textarea").keyup(function (event) {
    if (event.keyCode != 8 && event.keyCode != 46) {
        var max = 255;
        if ($(this).attr("maxlength") != undefined) {
            max = $(this).attr("maxlength");
        }
        if ($(this).val().length >= max) {
            $(this).val($(this).val().substring(0, max));
        }
    }
});

$(document).on("focus", "input[type=text],input[type=password],textarea", function () {
    if (regexIe8.test(userAgent)) {
        $(this).next(".placeholder").removeClass("show").addClass("hide");
    }
});

$(document).on("focusout", "input[type=text],input[type=password],textarea", function () {
    if (regexIe8.test(userAgent) && $(this).val() === "") {
        $(this).next(".placeholder").removeClass("hide").addClass("show");
    }
});
$(document).on("focus", ".placeholder", function () {
    $(this).prev("input").focus();
});

function doAjaxPost(type, url, data, onSuccess, onError, onComplete, element, processData, contentType, passDataToCallbackFn) {
    if (element) {
        if (element.is(":input:button") || element.is("button"))
            element.prop({ "disabled": true });
        else {
            showWaitingPopup(element);
        }
    }
    if (processData === undefined || processData === null) processData = true;
    if (contentType === undefined || contentType === null) contentType = "application/x-www-form-urlencoded; charset=UTF-8";
    $.ajax({
        type: type,
        url: url,
        context: this,
        processData: processData,
        contentType: contentType,
        data: data,
        success: (passDataToCallbackFn === true) ? $.proxy(getFnObj(onSuccess), window, data) : $.proxy(getFnObj(onSuccess), window),
        error: $.proxy(function (error, status, errorThrown) {
            if (error.statusText != "abort") {
            }
            if (onError)
                getFnObj(onError).call(window, error, status, errorThrown);
        }, this),
        complete: $.proxy(function (e) {
            try {
                var response = JSON.parse(e.responseText);
                if (response.data != undefined && response.data != null
                    && response.data.Message != undefined && response.data.Message != null
                    && response.data.Message.toLowerCase() == "unauthorized") {
                    window.location.replace(window.location.href);
                }
            } catch (exception) {
            }

            if (element) {
                if (element.is(":input:button") || element.is("button"))
                    element.prop({ "disabled": false });
                else
                    hideWaitingPopup(element);
            }
            if (onComplete)
                getFnObj(onComplete).call(window, e);
        }, this)
    });
};

function ShowWaitingProgress(selector, show) {
    if (show == "show") {
        $(selector).ejWaitingPopup();
        $(selector).ejWaitingPopup("show");
    } else
        $(selector).ejWaitingPopup("hide");
};

function getFnObj(obj) {
    if (typeof obj === "function") return obj;
    if (typeof obj === "string" && window[obj])
        return obj;
};

function showWaitingPopup(element) {
    if (typeof element === "string")
        element = $((element.indexOf(".") === 0) ? element : "#" + element);
    element.ejWaitingPopup();
    element.ejWaitingPopup("show");
};

function hideWaitingPopup(element) {
    if (typeof element === "string")
        element = $((element.indexOf(".") === 0) ? element : "#" + element);
    element.ejWaitingPopup("hide");
};

function redirect(url, interval) {
    if (interval)
        setTimeout(function () { window.location.assign(url) }, interval);
    else
        window.location.assign(url);
};

function DateCustomFormat(formatString, dateValue, isTimeFormat) {
    var yyyy, yy, MMMM, MMM, MM, M, dddd, ddd, dd, d, hhh, hh, h, mm, m, ss, s, ampm, AMPM, dMod, th,HH;
    var dateObject = new Date(dateValue);
    var datetime = formatString;
    //var dateObject = MilltoDate.toString();
    yy = ((yyyy = dateObject.getFullYear()) + "").slice(-2);
    MM = (M = dateObject.getMonth() + 1) < 10 ? ("0" + M) : M;
    MMM = (MMMM = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][M - 1]).substring(0, 3);
    dd = (d = dateObject.getDate()) < 10 ? ("0" + d) : d;
    ddd = (dddd = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dateObject.getDay()]).substring(0, 3);
    th = (d >= 10 && d <= 20) ? "th" : ((dMod = d % 10) == 1) ? "st" : (dMod == 2) ? "nd" : (dMod == 3) ? "rd" : "th";
    formatString = formatString.replace("yyyy", yyyy).replace("yy", yy).replace("MMMM", MMMM).replace("MMM", MMM).replace("MM", MM).replace("dddd", dddd).replace("ddd", ddd).replace("dd", dd).replace("d", d).replace("th", th);
    if(isTimeFormat == "True")
    {
        h = (hhh = dateObject.getHours());
            HH = h < 10 ? ("0" + h) : h;
            mm = (m = dateObject.getMinutes()) < 10 ? ("0" + m) : m;
            ss = (s = dateObject.getSeconds()) < 10 ? ("0" + s) : s;
           datetime = formatString.replace("HH", HH).replace("mm", mm).replace("ss", ss);
         }
    else{
        h = (hhh = dateObject.getHours());
        if (h == 0) h = 24;
        if (h > 12) h -= 12;
        hh = h < 10 ? ("0" + h) : h;
        AMPM = (ampm = hhh < 12 ? "am" : "pm").toUpperCase();
        mm = (m = dateObject.getMinutes()) < 10 ? ("0" + m) : m;
        ss = (s = dateObject.getSeconds()) < 10 ? ("0" + s) : s;
        datetime = formatString.replace("hhh", hhh).replace("hh", hh).replace("h", h).replace("mm", mm).replace("m", m).replace("ss", ss).replace("s", s).replace("ampm", ampm).replace("AMPM", AMPM);
    }
    return datetime;
}

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

function validateUserName(userName) {
    if (/\s/g.test(userName)) {
        return { isValid: false, message: "[[[Username should not contain white space]]]" };
    }
    if (/[^a-zA-Z0-9]/.test(userName)) {
        return { isValid: false, message: "[[[Username should not contain special characters]]]" };
    }
    return { isValid: true, message: "valid" };
}

function isValidUrl(url) {
    var regexExpression = /^(?!(ftp|https?):\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-]+(\.[a-z]{2,6})?(:\d{1,5})?(\/[a-zA-Z0-9]+[a-zA-Z0-9]*(\.[a-z]{2,8})?)*?$/gm;
    if (!regexExpression.test(url)) {
        return false;
    } else {
        return true;
    }
}

function getMaxZIndex() {
    var maxZIndex = 0;
    $("div").each(function () {
        var currentZIndex = parseInt($(this).css("zIndex"), 10);
        if (currentZIndex > maxZIndex) {
            maxZIndex = currentZIndex;
        }
    });
    return maxZIndex;
}

function IsEmail(email) {
    var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (filter.test(email)) {
        return true;
    }
    else {
        return false;
    }
}

function IsValidContactNumber(contactNumber) {
    var regex = /^(?:|[0-9\-\+]{9,15})$/;
    if (regex.test(contactNumber)) {
        return true;
    }
    else {
        return false;
    }
}

function onCloseMessageBox() {
    $("#messageBox").ejDialog("close");
}

function onMessageDialogClose() {
    $("#messageBox").find(".message-content").text("");
    $(".message-box-btn-holder").html("");
    $(".message-box-close").html("");
}

function messageBox(messageIcon, messageHeader, messageText, type, successCallback, errorCallback, width, height, maxHeight, cssClass) {
    $("#messageBox").find(".message-content").text("");
    $(".message-box-btn-holder").html("");
    $(".message-box-close").html("");
    $("#messageBox").find(".message-header").html("<span class='su " + messageIcon + "'></span> <span class='modal-title' data-toggle='tooltip' data-placement='bottom' data-container='body' title='" + messageHeader + "'  >" + messageHeader + "</h2>");
    $("#messageBox").find(".message-content").html(messageText);
    $("#messageBox").find(".message-content").removeClass("text-left");
    if (type == "error") {
        var successButton;
        var closeIcon;
        var errorButton;
        if (successCallback != undefined) {
            successButton = $("<input type='button' class='critical-action-button pull-right' value='[[[Yes]]]'></input>");
            successButton.bind("click", $.proxy(getFnObj(successCallback), window));
        }
        if (errorCallback != undefined) {
            errorButton = $("<input type='button' class='secondary-button pull-right' value='[[[No]]]'></input>");
            errorButton.bind("click", $.proxy(getFnObj(errorCallback), window));
            closeIcon = $('<span class="su su-close"></span>');
            closeIcon.bind("click", $.proxy(getFnObj(errorCallback), window));
        }
        else {
            errorButton = $("<input type='button' class='secondary-button pull-right' value='[[[No]]]'></input>");
            closeIcon = $('<span class="su su-close"></span>');
            errorButton.click(function () {
                onCloseMessageBox();
            });
            closeIcon.click(function () {
                onCloseMessageBox();
            });
        }
        $(".message-box-close").html(closeIcon);
        $(".message-box-btn-holder").append(errorButton, successButton);
        $("#messageBox").unbind("keydown");
    }
    else {
        var successButton;
        var closeIcon;
        if (successCallback != undefined) {
            successButton = $("<input type='button' class='secondary-button' value='[[[OK]]]'></input>");
            successButton.bind("click", $.proxy(getFnObj(successCallback), window));
            closeIcon = $('<span class="su su-close"></span>');
            closeIcon.bind("click", $.proxy(getFnObj(successCallback), window));
        }
        else {
            successButton = $("<input type='button' class='secondary-button' value='[[[OK]]]'></input>");
            closeIcon = $('<span class="su su-close"></span>');
            successButton.click(function () {
                onCloseMessageBox();
            });
            closeIcon.click(function () {
                onCloseMessageBox();
            });
        }
        $(".message-box-close").html(closeIcon);
        $(".message-box-btn-holder").append(successButton);
        $("#messageBox").on("keydown", function (event) {
            switch (event.keyCode) {
                case 13:
                case 27:
                    successButton.click();
            }
        });
    }

    $('[data-toggle="tooltip"]').tooltip();
    $("#messageBox").ejDialog("open");
    $("#messageBox").focus();
    var sizeobj = $("#messageBox").data("ejDialog");
    setTimeout(function () {        
        if (width != undefined)
            sizeobj.option("width", width);
        if (window.innerWidth > 1040) {
            if (height == undefined)
                height = $("#messageBox").find(".modal-content").height() + 135 + "px";
        }
        sizeobj.option("height", height);
        if (maxHeight != undefined)
            sizeobj.option("maxHeight", maxHeight);
    }, 50);
    if (cssClass != null && cssClass != undefined) {
        sizeobj.option("cssClass", cssClass);
    }
}



function IsValidName(validationType, inputString) {
    var regex;
    if (validationType.toLowerCase() === "username") {
        regex = new RegExp(/[*\[\\\]\|\/\:\<\>\%\+\#\&\?\'\"\@\;\,]/);
    }
    else {
        regex = new RegExp(/[*\[\\\]\|\/\:\<\>\%\+\#\?\'\"\;\,]/);
    }
    return !regex.test(inputString);
}

function GridLocalization() {
    ej.Grid.Locale["en-US"] = {
        EmptyRecord: "[[[No records to display]]]",
        StringMenuOptions: [{ text: "[[[StartsWith]]]", value: "StartsWith" }, { text: "[[[EndsWith]]]", value: "EndsWith" }, { text: "[[[Contains]]]", value: "Contains" }, { text: "[[[Equal]]]", value: "Equal" }, { text: "[[[NotEqual]]]", value: "NotEqual" }],
        FilterMenuCaption: "[[[Filter Value]]]",
        Filter: "[[[Filter]]]",
        Clear: "[[[Clear]]]"
    };
    ej.Pager.Locale["en-US"] = {
        pagerInfo: "[[[{0} of {1} pages ({2} items)]]]",
        firstPageTooltip: "[[[Go to first page]]]",
        lastPageTooltip: "[[[Go to last page]]]",
        nextPageTooltip: "[[[Go to next page]]]",
        previousPageTooltip: "[[[Go to previous page]]]"
    };
}

$(document).on("keyup", "#SearchCategory, #search-groups, #search-group-users, #userSearchKey,#groupSearchKey,  #searchItems, #search-slideshows, #search-schedules, #search-users,  #search-user-permission, #search-group-permission, #search-tree, #search-home-page, #search-items, .search-user-holder, .tree-view-search-holder", function (e) {
    var element = "#" + this.id;
    if ($(element).val() != "") {
        if (element == "#search-home-page") {
            $(element).parent().siblings("span.close-icon").css("display", "block");
        }
        else {
            $(element).siblings("span.close-icon").css("display", "block");
            $(element).siblings("span.search-user").css("display", "none");
            $(element).siblings("span.search-group").css("display", "none");
            $(element).siblings("span.search-group-users").css("display", "none");
            $(element).siblings("span.search-icon").css("display", "none");
            $(element).siblings("span.search-item").css("display", "none");
            $(element).siblings("span.search-schedule").css("display", "none");
            $(element).siblings("span.search-slideshows").css("display", "none");
            $(element).siblings("span.search").css("display", "none");
        }
    } else {
        if (element == "#search-home-page") {
            $(element).parent().siblings("span.su-search").css("display", "block");
        }
        else {
            $(element).siblings("span.close-icon").css("display", "none");
            $(element).siblings("span.su-search").css("display", "block");
        }
    }
});

$(document).on("click", "#clear-search,.clear-search", function () {
    var currentElement = $(this).prevAll("input");
    if (currentElement == "" || currentElement == null || currentElement == undefined || currentElement.length <= 0) {
        currentElement = $(this).prev("div").find("input");
    }
    var currentId = "#" + currentElement.attr("id");
    currentElement.val("");

    if (!clearSearch) {
        if (currentId == "#search-user-permission") {
            $(".modal-body #user-search-area #clear-search").css("display", "none");
        }
        else if(currentId == "#search-group-permission")
        {
            $(".modal-body #group-search-area #clear-search").css("display", "none");
        }
        else {
            $("#clear-search").css("display", "none");
        }
    }

    if (currentElement.val() == "") {
        if (currentId == "#search-home-page" && !clearSearch) {
            $("#clear-search").parent().siblings("span.su-search").css("display", "block");
            $(".search-area").removeClass("add-background");
            $(".placeholder, #clear-search").hide();
            if ($(".all-items").hasClass("active") && !$("#category-list").is(":visible")) {
                setTimeout(function () { $(".search-area").prevAll().show().parent().removeClass("pull-right"); $("#category-section-name").show(); }, 300);
            }
            else {
                setTimeout(function () { $(".search-area").prevAll(":not(#back-icon)").show().parent().removeClass("pull-right"); $("#category-section-name").show(); }, 300);
            }
            setTimeout(function () { $(".search-home-section:visible").removeClass("show"); }, 300);
        }
        else {
            if (currentId == "#search-user-permission") {
                $(".modal-body #user-search-area #clear-search").siblings("span.su-search").css("display", "block");
            }
            else if(currentId == "#search-group-permission")
            {
                $(".modal-body #group-search-area #clear-search").siblings("span.su-search").css("display", "block");
            }
            else {
                $("#clear-search").siblings("span.su-search").css("display", "block");
            }
        }

         if (!clearSearch) {

            PerformSearch(currentId);
        }

    }
    else {
        currentElement.val("");
    }
});

$(document).on("keydown", "#search-groups, #search-group-users, #searchItems, #search-schedules, #search-slideshows, #userSearchKey,#groupSearchKey, #search-users, #search-user-permission, #search-group-permission, #search-home-page, #search-items, #search-ump-users", function (e) {
    $.xhrPool.abortAll();
    var currentKeyCode = parseInt(e.which);
    var element = "#" + this.id;
    if (timeOut != null) {
        clearTimeout(timeOut);
        timeOut = null;
    }
    if (currentKeyCode === keyCode.Enter) {
        PerformSearch(element);
    }
    else if (excludedSearchKeys.indexOf(currentKeyCode) === -1) {
        timeOut = setTimeout(function () {
            PerformSearch(element);
        }, 900);
    }
});

function PerformSearch(currentId) {
    var gridObj;

    if (currentId == "#search-schedules") {
        gridObj = $("#scheduleGrid").data("ejGrid");
        gridObj.search($("#search-schedules").val());
    }
    else if (currentId == "#search-slideshows") {
        gridObj = $("#slideshowGrid").data("ejGrid");
        gridObj.model.pageSettings.currentPage = 1;
        gridObj.refreshContent();
    }
    else if (currentId == "#search-users") {
        gridObj = $("#user_grid").data("ejGrid");
        gridObj.model.pageSettings.currentPage = 1;
        gridObj.refreshContent();
    }
    else if (currentId == "#search-items") {
        gridObj = $("#items").data("ejGrid");
        gridObj.model.pageSettings.currentPage = 1;
        gridObj.refreshContent();
    }
    else if (currentId == "#search-home-page") {
        gridObj = $("#items").data("ejGrid");
        gridObj.model.filterSettings.filteredColumns = [];
        if (!$("#category-list").is(":visible") || $("#category-list").length <= 0) {
            if ($(".all-items").hasClass("active")) {
                gridObj.model.filterSettings.filteredColumns = [{ field: "CategoryName", operator: "equal", value: $("#category-section-name").html() }];
            }
            gridObj.model.pageSettings.currentPage = 1;
            gridObj.refreshContent();
        }
    }
    else if (currentId == "#search-group-users" || currentId == "#search-groups") {
        gridObj = $("#Grid").data("ejGrid");
        gridObj.model.pageSettings.currentPage = 1;
        gridObj.refreshContent();
    }
    else if (currentId == "#search-user-permission") {
        gridObj = $("#itempermissiongrid").data("ejGrid");
        gridObj.refreshContent();
    }
    else if (currentId == "#search-group-permission") {
        gridObj = $("#itemgrouppermissiongrid").data("ejGrid");
        gridObj.refreshContent();
    }
    else if (currentId == "#userSearchKey") {
        gridObj = $("#UserGrid").data("ejGrid");
        gridObj.refreshContent();
    }
    else if (currentId == "#groupSearchKey") {
        gridObj = $("#GroupGrid").data("ejGrid");
        gridObj.refreshContent();
    }
    else if (currentId == "#search-ump-users") {
        gridObj = $("#add_admins_grid").data("ejGrid");
        gridObj.search($("#search-ump-users").val());
    }
}

function SuccessAlert(header, content, duration) {
    content = content || null;
    window.top.$("#success-alert #message-header").html(header);
    if (content != null) {
        window.top.$("#success-alert #message-content").html(content).show();
    }
    else {
        window.top.$("#success-alert #message-content").hide();
    }

    window.top.$("#success-alert").css("display", "table");
    setTimeout(function () {
        window.top.$('#success-alert').fadeOut()
    }, duration);
    $(document).on("click", ".close-div", function () {
        parent.$('#success-alert').fadeOut()
    });
}

function WarningAlert(header, content, duration) {
    content = content || null;
    parent.$("#warning-alert #message-header").html(header);
    if (content != null) {
        parent.$("#warning-alert #message-content").html(content).show();
    }
    else {
        parent.$("#warning-alert #message-content").hide();
    }

    parent.$("#warning-alert").css("display", "table");
    if (duration != null && duration != "") {
        setTimeout(function () {
            parent.$('#warning-alert').fadeOut()
        }, duration);
    }
    $(document).on("click", ".close-div", function () {
        parent.$('#warning-alert').fadeOut()
    });
}

function MobileAlert(message, duration) {
    parent.$("#mobile-alert").fadeIn();
    parent.$("#mobile-alert #message").html(message);
    if (duration != null && duration != "") {
        setTimeout(function () {
            parent.$('#mobile-alert').fadeOut(1000)
        }, duration);
    }
}

window.onpopstate = function (e) {
    var queryString = window.location.search;
    var url = window.location.pathname;
    var pathArray = url.split('/');
    e.preventDefault();

    var section = getQueryVariable("view");
    var categoryName = getQueryVariable("category");
    var dashboardName = getQueryVariable("dashboard");
    var tabName = getQueryVariable("tab");

    if (section != null && categoryName != null && dashboardName != null) {
        var previousUrl = $("#current-url").attr("data-url");
        var previousCategoryName = getUrlQueryVariable(previousUrl, "category");
        var previousDashboardName = getUrlQueryVariable(previousUrl, "dashboard");
        if (decodeURI(dashboardName) !== decodeURI(previousDashboardName) || decodeURI(categoryName) !== decodeURI(previousCategoryName)) {
            DashboardRender(url, categoryName, dashboardName, section, tabName);
        } else {
            $("#current-url").attr("data-url", decodeURI(url) + "?category=" + decodeURI(categoryName) + "&dashboard=" + decodeURI(dashboardName) + "&view=" + decodeURI(section));
        }
    }
    else if (section != null && categoryName == null && dashboardName == null) {
        if ($(".item-navigation li[data-value='" + section + "']").hasClass("active") == false) {
            $(".item-navigation li").removeClass("active");
            $(".item-navigation li[data-value='" + section + "']").addClass("active");
        }
        $(".item-navigation li[data-value='" + section + "']").trigger("click");
        var iFrame = document.getElementById("dashboard_render_iframe");
        iFrame.contentWindow.location.href = "about:blank";
        $("#item-viewer #iframe-content").css("display", "block");
    }
    else if (queryString == "" && categoryName == null && section == null && pathArray.length < 5) {
        if ($(".item-navigation li[data-value='categories']").hasClass("active") == false) {
            $(".item-navigation li").removeClass("active");
            $(".item-navigation li[data-value='categories']").addClass("active");
        }
        $(".item-navigation li[data-value='categories']").trigger("click");
        var category = decodeURI(pathArray[pathArray.length - 1]);
        $(".category-link[data-category='" + category + "']").trigger("click");
    }
    if (e.state !== null && (JSON.stringify(e.state) !== JSON.stringify({}) || tabName !== null)) {
        document.getElementById('dashboard_render_iframe').contentWindow.postMessage('filter', "*");
    }
};

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return null;
}
function getUrlQueryVariable(url, variable) {
    var query = url.substring(url.indexOf('?') + 1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return null;
}
function getCurrentPageNumber(pageSize, selectedRecordsCount, totalRecordsCount, currentPage) {
    var difference = totalRecordsCount - selectedRecordsCount;
    if (difference > pageSize) {
        var lastPage = difference % pageSize == 0 ? difference / pageSize : Math.floor((difference / pageSize) + 1);
        if (currentPage > lastPage) {
            return lastPage;
        } else {
            return currentPage;
        }
    }
    else {
        return 1;
    }
}

$(window).load(function () {
    if (typeof (getNotificationCountUrl) != "undefined") {
        $.ajax({
            type: "Post",
            url: getNotificationCountUrl,
            success: function (data) {
                if (data != null && data != undefined) {
                    if (data.notificationCount > 0) {
                        $("#notification-section").find("#notification-icon").append($("<span>").attr({
                            "id": "notification-indicator"
                        }));
                    }
                    else {
                        $("#notification-section").find("#notification-indicator").remove();
                    }
                }
            }
        });
    }
});