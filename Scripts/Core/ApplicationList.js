var userApplicationList;
var applicationListRequest = false;

$(document).on("click", ".application-navigation", function () {
    userApplicationList = "";
    if (!applicationListRequest) {
        $.ajax({
            type: "POST",
            url: userapplicationlistUrl,
            data: "",
            success: function (data) {
                var userAppList = data;
                for (var i = 0; i < userAppList.length ; i++) {
                    if (userAppList[i].Url.toString().indexOf(',') != -1) {
                        userApplicationList += '<li data-app-selected="' + userAppList[i].IsSelected + '"><a class="popover-link" title= "' + userAppList[i].Name + '"role="button" data-html="true" data-toggle="popover" data-placement="right" data-content="' + getAnchorUrls(userAppList[i].Url.toString()) + '"><img alt="Application Logo" class="app-icon" src="' + userAppList[i].IconUrl + '"><span class="app-name">' + userAppList[i].Name + '</span></a>' + '</li>';
                    }
                    else {
                     
                        userApplicationList += "<li data-app-selected='" + userAppList[i].IsSelected + "'>" + "<a href= '" + userAppList[i].Url + "' target='_blank' title= '" + userAppList[i].Name + '<br/>' + userAppList[i].Url + "'data-html='true' data-toggle='tooltip' data-container='body' data-placement='top'><img alt='Application Logo' class='app-icon' src='" + userAppList[i].IconUrl + "'><span class='app-name'>" + userAppList[i].Name + "</span></a>" + "</li>";
                    }
                }
                $(".app-loading-text").addClass("hidden");
                $("#application-list").html(userApplicationList);
                $("#app-list").show();
                var windowHeight = window.innerHeight;
                var headerAreaHeight = $("#header-area").height();
                $("#application-list").css("max-height", windowHeight - headerAreaHeight);
                if ($("#application-list").innerHeight() >= windowHeight - headerAreaHeight) {
                    $("#application-list").css("max-width", 340);
                }
                applicationListRequest = true;
                $("[data-toggle='tooltip']").tooltip();                
                $('[data-toggle="popover"]').popover({ html: true });
            }
        });
    }
});

$(document).on('click', function (e) {
    if ($("#app-list").length > 0 && $("#app-list").css("display") !== "none") {
        if (($('.popover').has(e.target).length == 0) || $(e.target).is('.close')) {
            $('.popover').popover('hide');
        }

        if (e.target.className !== "popover-link" && e.target.className !== "app-icon" && e.target.className !== "app-name" && e.target.className !== "application-navigation" && e.target.className !== "su su-apps-menu application-navigation-logo") {
            $("#app-list").css("display", "none");
        }
    }
});

$(document).on('click', "li a", function (e) {
    if ($("#app-list").length > 0 && $("#app-list").css("display") !== "none") {
        e.stopPropagation();
        $('.popover').not($(this).next(".popover")).popover('hide');
        $('[data-toggle="tooltip"]').tooltip();
    }
});

$(document).on('click', ".application-navigation-logo", function (e) {
    if ($("#app-list").css("display") === "none") {
        $("#app-list").css("display", "block");
    } else {
        $("#app-list").css("display", "none");
    }
});

$(document).on("click", ".popover a", function () {
    $('.tooltip').css('display', 'none');
});

function getAnchorUrls(url) {
    var urlList = getUrlList(url);
    var htmlUrl = '';
    for (var i = 0; i < urlList.length; i++) {
        htmlUrl += '<a href= \'' + urlList[i] + '\' target=\'_blank\' title= \'' + urlList[i] + '\' data-html=\'true\' data-toggle=\'tooltip\' data-container=\'body\' data-placement= \'top\'>' + urlList[i] + '</a>';
    }

    return htmlUrl;
}

function getUrlList(url) {
    var urlList = [];
    for (var i = 0; i < url.length; i++) {
        if (url.indexOf(',') != -1) {
            if (url[i] == ',') {
                urlList.push(url.substr(0, i));
                url = url.replace(url.slice(0, url.substr(0, i + 1).length), '');
                i = 0;
            }
        }
        else {
            urlList.push(url);
            url = '';
        }
    }

    return urlList;
}