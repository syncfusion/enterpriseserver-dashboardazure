$(function () {
    $("#datasource-edit-popup").ejDialog({
        width: "650px",
        showOnInit: false,
        allowDraggable: false,
        enableResize: false,
        enableModal: true,
		showHeader:false,
        close: "OnEditFileDialogClose",
        closeOnEscape: true
    });
    $("#datasource-edit-popup_wrapper").ejWaitingPopup();
    $(window).resize(function () {
        var gridObj = $("#items").data("ejGrid");
        (window.innerWidth < 1200) ? gridObj.hideColumns("Owner") : gridObj.showColumns("Owner");
    });
});

$(document).on('click', '.item-edit', function () {
     var itemId = $(this).attr("data-item-id");
    $("#datasource-edit-popup").ejDialog("open");
	$("#datasource-edit-popup_wrapper").ejWaitingPopup("show");
	$("#datasource-edit-popup-iframe").attr("src", getDataSourceDetailsUrl + "?itemId=" + itemId);
});

function OnEditFileDialogClose() {
    $("#datasource-edit-popup").ejDialog("close");
}

$(document).on("click", ".items", function () {
    $(".e-waitpopup-pane").css("display", "none");
});