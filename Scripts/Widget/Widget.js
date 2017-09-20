$(function () {
    $("#widget_edit_popup").ejDialog({
        width: "651px",
        showOnInit: false,
        allowDraggable: false,
        enableResize: false,
        enableModal: true,
        showHeader: false,
        close: "OnEditFileDialogClose",
        closeOnEscape: true
    });
    $("#widget_edit_popup_wrapper").ejWaitingPopup();
    $(window).resize(function () {
        var gridObj = $("#items").data("ejGrid");
        (window.innerWidth < 1200) ? gridObj.hideColumns("Owner") : gridObj.showColumns("Owner");
    });
});

$(document).on("click", ".item-edit", function () {
    var itemId = $(this).attr("data-item-id");
    $("#widget_edit_popup").ejDialog("open");
    $("#widget_edit_popup_wrapper").ejWaitingPopup("show");
    $("#widget_edit_popup_iframe").attr("src", getwidgetDetailsUrl + "?itemId=" + itemId);
});

function OnEditFileDialogClose() {
    $("#datasource_edit_popup").ejDialog("close");
}