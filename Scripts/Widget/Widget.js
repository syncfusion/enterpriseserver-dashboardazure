﻿$(function () {
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

    $.ajax({
        type: "Get",
        url: embedLinkDialogViewUrl,
        success: function (data) {
            $("body").append(data);
            $("#get-embed-code").ejDialog({
                width: (window.innerWidth > 460) ? "470px" : (window.innerWidth - 10),
                showOnInit: false,
                allowDraggable: false,
                enableResize: false,
                height: "auto",
                title: "[[[Get Embed Code]]]",
                showHeader: false,
                enableModal: true,
                closeOnEscape: true,
                close: "onGetEmbedDialogClose",
                open: "onGetEmbedDialogOpen"
            });

            $("#get_item_link_wrapper").ejWaitingPopup();
        }
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