var userAgent = navigator.userAgent;
var regexIe8 = new RegExp("Trident(\/4.0)|(Trident\/5.0)");
var isSafari = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') != -1;
var ruleName, rules, needMargin = true;
var containerAdjusted;

$(document).ready(function () {
    $("body").ejWaitingPopup();
    $("body").ejWaitingPopup("show");
    $("body").ejWaitingPopup("hide");
    addPlacehoder("body");

    if (i_am_ie9) {
        $(".login-container").addClass("height-adjust");
    }
    else {
        $(".login-container").removeClass("height-adjust");
    }

    if (regexIe8.test(userAgent)) {
        if (window.innerWidth > 1400) {
                $(".login-form").css("margin-bottom", "-50px");
                $("#login-button").css("margin-top", "10px");
        }
        else {
                $(".login-form").css("margin-bottom", "-50px");
        }
    }
    else {
            $(".login-form").css("margin-bottom", "0px");
    }

    $("#remember-me").on("click", function () {
        if (isSafari) {
            $(this).find("label").toggleClass("check");
        }
    });

    $(document).on("click", "  #mail-resend, .redirect-login", function () {
        $("body").ejWaitingPopup("show");
    });
});

$(window).load(function () {
    var docWidth = window.innerWidth;
    if (docWidth < 480) {
        $(".ad-text").css('width', '80%');
    }
});


$(window).resize(function () {
    var docHeight = window.innerHeight;
    var docWidth = window.innerWidth;
    if (docWidth < 550) {
        $(".ad-text").css('margin-left', '10%');
    }
    else {
        $(".ad-text").css('margin-left', '0');
    }
});

function IsValidUserNameOrEmail(inputString) {
    var regex = new RegExp(/[#\%\&\*\|\:\"\'\<\>\?\[\]\\\/\+]/);
    return !regex.test(inputString);
}

//IE9 placeholder support function
function addPlacehoder(object) {
    if (regexIe8.test(userAgent)) {        
        $(object).find("input[type=text],input[type=password]").each(function () {
            if ($(this).val() === "") {
                $($("<div>", { "class": "placeholder", text: $(this).attr("placeholder") })).insertAfter(this).show();
            }
            else {
                $($("<div>", { "class": "placeholder", text: $(this).attr("placeholder") })).insertAfter(this).hide();
            }
        });
    }
}

$(document).on("focus", "input[type=text],input[type=password]", function () {
    if (regexIe8.test(userAgent)) {
        $(this).next(".placeholder").removeClass("show").addClass("hide");
    }
});
$(document).on("focusout", "input[type=text],input[type=password]", function () {
    if (regexIe8.test(userAgent) && $(this).val() === "") {
        $(this).next(".placeholder").removeClass("hide").addClass("show");
    }
});
$(document).on("focus", ".placeholder", function () {
    $(this).prev("input").focus();
});


function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    var urlValue = match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    if (urlValue == null)
        urlValue = dashboardUrl;
    return urlValue;
}