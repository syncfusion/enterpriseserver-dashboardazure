var browser = ej.browserInfo();
$(document).ready(function () {
    var isFirstRequest = false;
    addPlacehoder("#search-area");

    $("#permission-popup").ejDialog({
        showOnInit: false,
        allowDraggable: true,
        enableResize: false,
        width: "900px",
        title: "",
        showHeader: false,
        enableModal: true,
        close: "DialogBoxClose",
        closeOnEscape: true
    });

    $("#item-delete-confirmation").ejDialog({
        width: "450px",
        showOnInit: false,
        allowDraggable: false,
        enableResize: false,
        height: "auto",
        title: "[[[Delete item]]]",
        showHeader: false,
        enableModal: true,
        close: "onDeleteItemDialogClose",
        open: "onDeleteItemDialogOpen"
    });

    $(document).on("click", ".edit-slideshow", function () {
        geteditSlideshowDetail($(this).attr("data-item-id"));
    });

    $(document).on("click", ".slideshow-delete", function (e) {
        $("#delete-item-name").html($(this).attr("data-name"));
        $("#delete-slideshow").attr("data-item-id", $(this).attr("data-item-id"));
        var itemId = $(this).attr("data-item-id");
        var itemName = $(this).attr("data-name");
        var itemTypeId = $(this).attr("data-itemtype");
        $("#item-delete-confirmation").ejDialog("open");
        $("#item-delete-confirmation_wrapper").ejWaitingPopup("show");
        $.ajax({
            type: "POST",
            url: deleteConfirmationUrl,
            data: { itemId: itemId, itemTypeId: itemTypeId, itemName: itemName },
            success: function (data) {
                $("#item-delete-confirmation").html(data);
                $("#item-delete-confirmation_wrapper").ejWaitingPopup("hide");
            }
        });
    });

    $(document).on("click", "#delete-slideshow", function (e) {
        $("#item-delete-confirmation_wrapper").ejWaitingPopup("show");
        var itemId = $(this).attr("data-item-id");
        var itemtype = $(this).attr("data-itemtype");

        var type = itemtype == "Category" ? "[[[Category]]]" : itemtype == "Dashboard" ? "[[[Dashboard]]]" : itemtype;
        $.ajax({
            type: "POST",
            url: deleteItemUrl,
            data: { itemId: itemId },
            success: function (data) {
                if (data.Success) {
                    $("#item-delete-confirmation_wrapper").ejWaitingPopup("hide");
                    SuccessAlert(itemtype + "[[[ deleted]]]", $("#delete-item-name").html() + "[[[ has been deleted successfully.]]]", 7000);
                    onSuccessRefreshGrid(1);
                }
                else if (data.Permission == false) {
                    $("#item-delete-confirmation_wrapper").ejWaitingPopup("hide");
                    WarningAlert("[[[Delete failed]]]", "[[[You do not have permission to delete the dashboard - ]]]" + $("#delete-item-name").html(), 7000);
                }
                else {
                    $("#item-delete-confirmation_wrapper").ejWaitingPopup("hide");
                    WarningAlert("[[[Delete failed]]]", $("#delete-item-name").html() + "[[[ has been failed to delete.]]]", 7000);
                }
                $("#item-delete-confirmation").ejDialog("close");
            }
        });
    });

    $.ajax({
        type: "Get",
        url: getLinkDialogViewUrl,
        success: function (data) {
            $("body").append(data);
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
                close: "onGetLinkDialogClose"
            });
            $("#get_item_link_wrapper").ejWaitingPopup();
        }
    });

    $("#item-delete-confirmation_wrapper").ejWaitingPopup();
    $("#permission-popup_wrapper").ejWaitingPopup();
});
function fnOnGridLoad(args) {
    args.model.dataSource.adaptor = new ej.UrlAdaptor();
    args.model.enableTouch = false;
}
function fnActionBegin(args) {
    isFirstRequest = true;
    var searchValue = $("#search-slideshows").val();
    this.model.query._params.push({ key: "searchKey", value: searchValue });
    var filerSettings = [], i;
    this.element.ejWaitingPopup();
    if (args.model.filterSettings.filteredColumns.length > 0) {
        for (i = 0; i < args.model.filterSettings.filteredColumns.length; i++) {
            var column = args.model.filterSettings.filteredColumns[i];
            filerSettings.push({ 'PropertyName': column.field, 'FilterType': column.operator, 'FilterKey': column.value });
        }

        this.model.query._params.push({ key: "filterCollection", value: filerSettings });
    }
}
function rowBound() {
    if (isFirstRequest) {
        isFirstRequest = false;
    }
}
function onDeleteItemDialogClose() {
    $("#item-delete-confirmation").ejDialog("close");
}
function onDeleteItemDialogOpen() {
    $("#item-delete-confirmation").ejDialog("open");
    $('#item-delete-confirmation').focus();
}
function onSuccessRefreshGrid(count) {
    var slideshowgrid = $('#slideshowGrid').data("ejGrid");
    var currentPage = slideshowgrid.model.pageSettings.currentPage;
    var pageSize = slideshowgrid.model.pageSettings.pageSize;
    var totalRecordsCount = slideshowgrid.model.pageSettings.totalRecordsCount;
    var lastPageRecordCount = slideshowgrid.model.pageSettings.totalRecordsCount % slideshowgrid.model.pageSettings.pageSize;
    if (lastPageRecordCount != 0 && lastPageRecordCount <= count) {
        slideshowgrid.model.pageSettings.currentPage = currentPage - 1;
    }
    slideshowgrid.refreshContent();
}
function onGetLinkDialogClose() {
    $("#get_item_link").ejDialog("close");
}
function onGetLinkDialogOpen() {
    $("#get_item_link").ejDialog("open");
    $("#get_item_link").show();
    $('#get_item_link').focus();
    $("#item-link").select();
    $(".get_link").show();
    if (browser.name.toLowerCase() == "msie") {
        $("#item-link").val(window.location.href.replace(window.location.pathname + window.location.search, "") + itemUrl.trim());
    }
    else {
        $("#item-link").val(window.location.origin + itemUrl.trim());
    }
    if (/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)) {
        $("#item-link-copy").removeClass("su su-copy");
        $("#item-link-copy").hide();
        $("#item-link-copy").attr("data-original-title", "");
    }
}
$(document).on("click", ".search-slideshows", function () {
    var gridObj = $("#slideshowGrid").data("ejGrid");
    gridObj.model.pageSettings.currentPage = 1;
    gridObj.refreshContent();
});
$(document).on("click", ".popup-close", function () {
    window.parent.$("#item-delete-confirmation").ejDialog("close");
});
$(document).on("click", ".get-slideshow-link", function (e) {
    var shareUrl = shareUrl = window.location.origin + $(this).attr("data-url").trim();
    var itemType = $(this).attr("data-itemtype").trim();
    if (itemType.toLowerCase() == "10") {
        $(".slideshow-link").show();
    }
    else {
        $(".link").show();
    }    
    var itemName = $(this).attr("data-name");   
    $(".private-note").show();
    $(".public-note").hide();
    $("#get_item_link").ejDialog("open");
    $("#get_item_link").show();
    $("#get_item_link_wrapper").ejWaitingPopup("show");
    $(".get_link").show();

    if (/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)) {
        $("#item-link-copy").removeClass("su su-copy");
        $("#item-link-copy").hide();
        $("#item-link").css({ width: "100%", borderRadius: "4px" });
        $("#item-link-copy").attr("data-original-title", "");
    }
    else {
        $("#item-link-copy").tooltip({
            animation: false
        });
    }
    $(".report-name").html(itemName);
    $(".report-name").attr("title", itemName);
    $("#item-link").val(shareUrl);
    $("#item-link").select();
    $(".modal-footer .validation-area").css("display", "block");
    $("#get_item_link_wrapper").ejWaitingPopup("hide");
});

$(document).on("click", "#item-link-copy", function (e) {
    $("#item-link").select();
    if (/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)) {
        $("#item-link-copy").removeClass("su su-copy");
        $("#item-link-copy").attr("data-original-title", "");
    }
    else {
        document.execCommand('copy');
        $("#item-link-copy").attr("data-original-title", "[[[Copied]]]");
        $("#item-link-copy").tooltip("hide").attr("data-original-title", "[[[Copied]]]").tooltip("fixTitle").tooltip("show");
        setTimeout(function () { $("#item-link-copy").attr("data-original-title", "[[[Click to copy]]]"); $("#item-link-copy").tooltip(); }, 3000);
    }
});