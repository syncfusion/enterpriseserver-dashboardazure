var browser = ej.browserInfo();
var itemUrl;

$(document).ready(function () {
    $("#get_item_link").ejDialog({
        width: (window.innerWidth > 460) ? "450px" : (window.innerWidth - 10),
        showOnInit: false,
        allowDraggable: false,
        enableResize: false,
        height: "auto",
        title: "[[[Get Link]]]",
        showHeader: false,
        enableModal: true,
        closeOnEscape: true,
        close: "onGetLinkDialogClose",
        open: "onGetLinkDialogOpen"
    });
});

function onGetLinkDialogClose() {
    $("#get_item_link").ejDialog("close");
}
function onGetLinkDialogOpen() {
    var shareLinkDlg = $("#get_item_link");

    shareLinkDlg.ejDialog("open");
    shareLinkDlg.show();
    shareLinkDlg.focus();

    $(".get_link").show();

    var itemLink = $("#item-link");
    var getlink = window.location.href.replace(window.location.search, "");
    var newQuery = "?";
    if (isMultiDashboard.toLocaleLowerCase() === 'true') {
        newQuery += "tab=" + $("#dashboard").data("ejDashboardViewer").getCurrentTab().tabName.trim() + "&";
    }
    var query = location.search.substring(1);
    if (query != "") {
        var queryList = getQueryVariable(query);
        $.each(queryList, function (index, element) {
            if (index !== "filterQuery" && index !== "tab" && index !== "viewid") {
                newQuery += index + '=' + element + '&';
            }
        });
    }
    getlink += newQuery;

    if (getcurrentfilters() != null) {
        getlink += getcurrentfilters().encryptedData;
    } else {
        getlink = getlink.slice(0, -1);
    }
    
    itemLink.val(getlink);

    if (/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)) {
        $("#item-link-copy").removeClass("su su-copy").attr("data-original-title", "").hide();
        itemLink.css({ width: "100%", borderRadius: "4px" });
    }
    else {
        $("#item-link-copy").tooltip({
            animation: false
        });
    }

    document.getElementById("item-link").setSelectionRange(0, itemUrl.length);
}

function getQueryVariable(queryString) {
    var params = {}, queries, temp, i, l;
    queries = queryString.split("&");
    for (i = 0, l = queries.length; i < l; i++) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }
    return params;
}

$(document).on("click", "#item-link-copy", function () {
    $("#item-link").select();

    var copyBtn = $("#item-link-copy");

    if (/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)) {
        copyBtn.removeClass("su su-copy").attr("data-original-title", "");
    }
    else {
        document.execCommand("copy");
        copyBtn.tooltip("hide").attr("data-original-title", "[[[Copied]]]").tooltip("fixTitle").tooltip("show");
        setTimeout(function() {
            copyBtn.attr("data-original-title", "[[[Click to copy]]]");
            copyBtn.tooltip();
        }, 3000);
    }
});

function fnOnDashboardBegin(args) {
    if (args.eventType === "getLinkDialogOpen") {
        var shareLinkDlg = $("#get_item_link");
        $(".dashboard-link, .private-note").show();
        args.source.data.handled = true;
        itemUrl = args.source.data.url;
        shareLinkDlg.find(".report-name").html(args.model.reportName).attr("title", args.model.reportName);
        shareLinkDlg.ejDialog("open");
    }
}

