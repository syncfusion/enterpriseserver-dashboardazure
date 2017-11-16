$(document).on("ready", function () {
    $("#edit-file-popup").ejDialog({
        width: "760px",
        showOnInit: false,
        allowDraggable: false,
        enableResize: false,
        title: "[[[Update Dashboard]]]",
        enableModal: true,
        showHeader: false
    });
    $("#edit-file-popup_wrapper").ejWaitingPopup();

    $("#update-data-source-popup").ejDialog({
        width: "760px",
        showOnInit: false,
        allowDraggable: true,
        enableResize: false,
        title: "[[[Update Datasource]]]",
        enableModal: true,
        showHeader: false
    });
    $("#update-data-source-popup_wrapper").ejWaitingPopup();
    $(window).resize(function () {
        var gridObj = $("#items").data("ejGrid");
        if (gridObj != null) {
            if (window.innerWidth < 1200) {
                if (typeof gridObj.model.columns[6] != "undefined") {
                    gridObj.model.columns[6].width = 25;
                    gridObj.columnsWidthCollection[6] = 25;
                    gridObj.hideColumns("Owner");
                }
            }
            else {
                if (typeof gridObj.model.columns[6] != "undefined") {
                    gridObj.model.columns[6].width = 15;
                    gridObj.columnsWidthCollection[6] = 15;
                    gridObj.showColumns("Owner");
                }
            }
            gridObj.setWidthToColumns();
            if (window.innerWidth < 1041) {
                gridObj.hideColumns("Description");
                gridObj.hideColumns("Category");
                $(".collapseIcon").show();
                ($(".collapseIcon").hasClass("expand-category")) ? collapeGrid() : expandGrid();
            } else {
                gridObj.showColumns("Description");
                gridObj.showColumns("Category");
                collapeGrid();
                $(".collapseIcon").hide();
            }

            var actionsDialogObj = $("#ItemAction").data("ejDialog");
            if (actionsDialogObj.isOpened()) {
                actionsDialogObj._dialogPosition();
            }
            var scheduleDialogObj = $("#popup-container").data("ejDialog");
            if (scheduleDialogObj.isOpened()) {
                scheduleDialogObj._dialogPosition();
            }
        }
    });
    $(".collapseIcon").on("click", function (e) {
        ($(this).hasClass("collapse-category")) ? collapeGrid() : expandGrid();
    });

    $("#SearchCategory").focusin(function () {
        if (window.innerWidth < 1041) {
            $("#FixedLeftSection").addClass("position");
            $("#mobile-menu, .mobile-menu-icon ").addClass("menu-position");
        }
    });

    $("#SearchCategory").focusout(function () {
        if (window.innerWidth < 1041) {
            $("#FixedLeftSection").removeClass("position");
            $("#mobile-menu, .mobile-menu-icon ").removeClass("menu-position");
        }
    });
});

$(document).on("click", ".item-edit", function () {
    var itemId = $(this).attr("data-item-id");
    $("#edit-file-popup").ejDialog("open");
    ShowWaitingProgress("#edit-file-popup_wrapper", "show");
    $("#edit-file-popup-iframe").attr("src", getdashboarddetailsUrl + "?itemId=" + itemId);
});

$(document).on("click", ".update-datasource", function () {
    var itemId = $(this).attr("data-item-id");
    $("#update-data-source-popup").ejDialog("open");
    ShowWaitingProgress("#update-data-source-popup_wrapper", "show");
    $("#update-data-source-popup-iframe").attr("src", getDataSourceDetailsUrl + "?itemId=" + itemId);
    $("#update-data-source-popup-iframe").attr("data-item-id", itemId);
    parent.window.IsUpdateDashboard = true;
});

function editFilePopup(Id, Name, Description) {
    $("#edit-file-popup").ejDialog("open");
    var iframe = $("#EditCategoryPopup_iframe").contents();
    iframe.find("#file_name").val(Name);
    iframe.find("#file_description").val(Description);
}

function OnEditFileDialogClose() {
    $("#edit-file-popup").find("iframe").contents().find("html").html("");
    $("#edit-file-popup").ejDialog("close");
}

function collapeGrid() {
    $(".collapseIcon").removeClass("collapse-category");
    $(".collapseIcon").addClass("expand-category");
    if (window.innerWidth < 1041) {
        $(".collapseIcon").html('<span class="su su-category-collapse-mobile"><i class="su su-category-collapse-mobile path1"></i><i class="su su-category-collapse-mobile path2"></i></span>');
    }
    else {
        $(".collapseIcon").html("<span class='su su-sidebar-collapse'></span>");
    }
    $(".item-listing").removeClass("expandedGrid");
    $("#base_footer_Div").removeClass("expandedGrid");
    $("#FixedLeftSection").removeClass("collapsed");
    refreshScroller();
}

function expandGrid() {
    $(".collapseIcon").removeClass("expand-category");
    $(".collapseIcon").addClass("collapse-category");
    if (window.innerWidth < 1041) {
        $(".collapseIcon").html('<span class="su su-category-expand-mobile"><i class="su su-category-expand-mobile path1"></i><i class="su su-category-expand-mobile path2"></i></span>');
    }
    else {
        $(".collapseIcon").html("<span class='su su-sidebar-expand'></span>");
    }
    $(".item-listing").addClass("expandedGrid");
    $("#base_footer_Div").addClass("expandedGrid");
    $("#FixedLeftSection").addClass("collapsed");
}

function initLayoutRender(onResize) {
    if (window.innerWidth < 1025) {
        expandGrid();
        $(".collapseIcon").show();
    }
    else {
        $(".collapseIcon").hide();
        collapeGrid();
    }
}