﻿$(document).ready(function () {

    $(document).on("click", "a", function (event) {
        if (hasWidgetLink === true) {
            event.preventDefault();
            hasWidgetLink = false;
        }
    });

    if (allHomepages.length < 1) {
        $("#homepage-list").selectpicker("refresh");
        $("#homepage-list").next().find(".dropdown-menu > .bs-searchbox").after("<span class='no-result-found'>[[[No Results Found]]]</span>");
    }
    else if (allHomepages.length >= 1 && allHomepages.length <= 10) {
        $("#homepage-list").selectpicker("refresh");
        $("#homepage-list").next().find(".dropdown-menu > .bs-searchbox").hide();
    }
    var isSafari = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    $("#homepage-action-popup").ejDialog({
        width: "476px",
        height: "160px",
        showOnInit: false,
        allowDraggable: true,
        enableResize: false,
        title: "[[[Homepage]]]",
        enableModal: true,
        showHeader: false
    });

    $("#homepage-action-popup_wrapper").ejWaitingPopup();

    $("#homepage-list-container").on('click', ".bootstrap-select li a", function (e) {
        var homepageName = $("#homepage-list").val();
        location.href = baseUrl + homepages + "/" + homepageName;
    });

    $(document).on('keyup', '.bootstrap-select.open input', function () {
        $('.bootstrap-select.open ul .add-new').remove();
    });

    $("#add-item-popup").ejDialog({
        width: "900px",
        showOnInit: false,
        allowDraggable: true,
        enableResize: false,
        title: "[[[Homepage]]]",
        closeOnEscape: false,
        enableModal: true,
        showHeader: false
    });
    $("#add-item-popup_wrapper").ejWaitingPopup();

    var fromColumn, toColumn, fromPosition, toPosition = null;
    $(document).on("click", "#layout-items span", function () {
        var currentLayout = $("#widget-container").attr("data-current-layout");
        $("#widget-container").attr("data-current-layout", $(this).attr("id"));
        $("#layout-items span").removeClass("active");
        $(this).addClass("active");
        switch ($(this).attr("id")) {
            case "1":
                if (currentLayout != "1") {
                    changeLayout(1);
                    if (currentLayout == "111") {
                        appendListItem(1, 2);
                    }
                    else if (currentLayout == "11" || currentLayout == "12" || currentLayout == "21") {
                        appendListItem(1, 1);
                    }
                    setLayout(1);
                }
                break;
            case "11":
                if (currentLayout != "11") {
                    changeLayout(11);
                    if (currentLayout == "111") {
                        appendListItem(2, 1);
                    }
                    else if (currentLayout == "1") {
                        createEmptyList(2, 2);
                    }
                    setLayout(11);
                }
                break;
            case "12":
                if (currentLayout != "12") {
                    changeLayout(12);
                    if (currentLayout == "111") {
                        appendListItem(2, 1);
                    }
                    else if (currentLayout == "1") {
                        createEmptyList(2, 2);
                    }
                    setLayout(12);
                }
                break;
            case "21":
                if (currentLayout != "21") {
                    changeLayout(21);
                    if (currentLayout == "111") {
                        appendListItem(2, 1);
                    }
                    else if (currentLayout == "1") {
                        createEmptyList(2, 2);
                    }
                    setLayout(21);
                }
                break;
            case "111":
                if (currentLayout != "111") {
                    changeLayout(111);
                    if (currentLayout == "1") {
                        createEmptyList(2, 3);
                    }
                    else if (currentLayout == "11" || currentLayout == "12" || currentLayout == "21") {
                        createEmptyList(3, 3);
                    }
                    setLayout(111);
                }
                break;
        }
    });

    $(document).on("click", "#options li", function () {
        var homepageItemId = $("#widget-container").attr("data-homepage-id");
        var isVirtualHomepage = $("#widget-container").attr("data-virtual-homepage");
        if (homepageItemId == "" && isVirtualHomepage == "true") {
            homepageItemId = saveVirtualHomepage();
            $("#initial-message").hide();
            if (homepageItemId != "") {
                afterVirtualHomepageSave(homepageItemId);
            }
        }
        switch ($(this).attr("id")) {
            case "delete":
                messageBox("su-delete", "[[[Delete Homepage]]]", "[[[Are you sure you want to delete this homepage?]]]", "error", function () {
                    $.ajax({
                        type: "POST",
                        url: deleteHomepageUrl,
                        data: { homepageId: homepageItemId },
                        success: function (result) {
                            if (result) {
                                SuccessAlert("[[[Delete Homepage]]]", "[[[Homepage has been deleted successfully.]]]", 7000);
                                window.location.href = baseUrl + homepages;
                            }
                            else {
                                WarningAlert("[[[Delete Homepage]]]", "[[[Unable to delete homepage. Internal server error. Please try again.]]]", 7000);
                            }
                        }
                    });
                    onCloseMessageBox();
                });
                $(".message-content").addClass("text-left");
                break;
            case "rename":
                $("#homepage-action-popup").ejDialog("open");
                $("#homepage-action-popup_wrapper").ejWaitingPopup("show");
                homepageActionPopup("rename");
                break;
            case "duplicate":
                $("#homepage-action-popup").ejDialog("open");
                $("#homepage-action-popup_wrapper").ejWaitingPopup("show");
                homepageActionPopup("duplicate");
                break;
            case "make-default":
                setOrRemoveDefaultHomepage(homepageItemId);
                break;
            case "remove-default":
                setOrRemoveDefaultHomepage(null);
                break;
        }
    });

    $(document).on("click", "#add-homepage-options li", function () {
        switch ($(this).attr("id")) {
            case "add-homepage":
                $("#homepage-action-popup").ejDialog("open");
                $("#homepage-action-popup_wrapper").ejWaitingPopup("show");
                homepageActionPopup("newhomepage");
                break;
            case "add-dashboard-homepage":
                window.IsPinDashboard = true;
                $("#add-item-popup").ejDialog("open");
                $("#add-item-popup_wrapper").ejWaitingPopup("show");
                $("#add-item-popup-iframe").attr("src", homepageAddItemUrl);
                break;
        }
    });

    function setOrRemoveDefaultHomepage(homepageId) {
        ShowWaitingProgress("#content-area", "show");
        $.ajax({
            type: "POST",
            url: setRemoveDefaultHomepageUrl,
            data: { homepageItemId: homepageId },
            success: function (result) {
                if (result.Success) {
                    if (!window.IsMobile) {
                        SuccessAlert("[[[Default Homepage]]]", homepageId != null ? "[[[Default homepage has been added successfully.]]]" : "[[[Default homepage has been removed successfully.]]]", 7000);
                    }
                    else {
                        MobileAlert(homepageId != null ? "[[[Default homepage has been added successfully.]]]" : "[[[Default homepage has been removed successfully.]]]", 3000);
                    }
                    window.location.href = baseUrl + homepages;
                }
                else {
                    if (!window.IsMobile) {
                        WarningAlert("[[[Default Homepage]]]", homepageId != null ? "[[[Unable to create a default homepage.]]]" : "[[[Unable to remove the default homepage.]]]", 7000);
                    }
                    else {
                        MobileAlert(homepageId != null ? "[[[Unable to create a default homepage.]]]" : "[[[Unable to remove the default homepage.]]]", 3000);
                    }
                }
            }
        });
        ShowWaitingProgress("#content-area", "hide");
    }

    $(document).on("click", "#add-item, span.add-widget", function (event) {
        var itemType = $("#widget-container").attr("data-item-type").toLowerCase();
        if (itemType == "dashboard") {
            parent.window.IsPinDashboard = true;
        }
        else if (itemType == "widget") {
            parent.window.IsPinWidget = true;
            parent.window.PinColumn = $(this).parents(".empty").parent().data("column-id");
        }
        $("#add-item-popup").ejDialog("open");
        $("#add-item-popup_wrapper").ejWaitingPopup("show");
        $("#add-item-popup-iframe").attr("src", homepageAddItemUrl);
    });

    $(document).on("click", ".close-div", function () {
        parent.$('#warning-alert').fadeOut();
    });

    $(document).keyup("#add-item-popup_overLay", function (e) {
        if (e.keyCode == 27 && $("#homepage-action-popup_wrapper").css("display") == "none") {
            closeAddItemPopup();
        }
    });

    $(document).on("click", "#button-container #layout", function () {
        $("#success-alert, #warning-alert").hide();
    });

    $(document).on("click", "#wrapper-div, #maximize_container .su-close", function () {
        $("#maximize_container").contents().remove();
        $("#maximize").addClass("display-none");
    });

    $(document).keyup("#homepage-action-popup_overLay", function (e) {
        if (e.keyCode == 27) {
            closeHomepageActionPopup();
        }
    });

    $(window).resize(function () {
        changeListOnWindowResize();
    });

    $(document).keyup("#maximize", function (e) {
        if (e.keyCode == 27) {
            $("#maximize_container").contents().remove();
            $("#maximize").addClass("display-none");
        }
    });

    $(document).on("click", "#set-default-button", function () {
        var homepageItemId = $("#select-default-homepage").val();
        if (homepageItemId != "") {
            setOrRemoveDefaultHomepage(homepageItemId);
        }
    });

    $(document).keyup("#messageBox_overLay", function (e) {
        if (e.keyCode == 27) {
            onCloseMessageBox();
        }
    });

    $(document).on("click", "#initial-message #close-icon", function () {
        $("#initial-message").hide();
        var virtualHomepageInitialMessage = getCookie("virtualhomepageinitialmessage");
        if (virtualHomepageInitialMessage == null) {
            setCookie("virtualhomepageinitialmessage", true, 30);
        }
    });

    $.validator.addMethod("isRequired", function (value, element) {
        return !isEmptyOrWhitespace(value);
    }, "[[[Please enter homepage name]]]");

    $.validator.addMethod("IsValidName", function (value, element) {
        return IsValidName(name, value);
    }, "[[[Please avoid special characters]]]");

    $("#homepage-option-form").validate({
        errorElement: "span",
        onkeyup: function (element, event) {
            if (event.keyCode !== 9 && event.keyCode !== 13) {
                $(element).valid();
            }
            else
                true;
        },
        onfocusout: function (element) { $(element).valid(); },
        rules: {
            "homepagenewname": {
                isRequired: true,
                IsValidName: true
            }
        },
        highlight: function (element) {
            $(element).closest("div").addClass("has-error");
        },
        unhighlight: function (element) {
            $(element).closest("div").removeClass("has-error");
            $(element).next("span.validation-errors").html("");
            $("#default-homepage-section").css("top", "0px");
        },
        errorPlacement: function (error, element) {
            $(element).next("span.validation-errors").html(error);
        },
        messages: {
            "homepagenewname": {
                isRequired: "[[[Please enter homepage name]]]"
            }
        }
    });

    $(document).on("click", "#save-button", function () {
        var isValidForm = $("#homepage-option-form").valid();
        if (isValidForm) {
            $("#homepage-action-popup_wrapper").ejWaitingPopup("show");
            var homepageItemId = $("#homepage-option-form").attr("data-homepage-id");
            var homepageName = $("#homepage-new-name").val().trim();
            var itemAction = $(this).attr("data-value").trim();
            var checked = $("#default-homepage-checkbox").prop("checked");

            if (homepageItemId != "" && homepageName != "" && itemAction != "") {
                $.ajax({
                    type: "POST",
                    url: checkHomepageNameExistsUrl,
                    data: { homepageName: homepageName },
                    success: function (result) {
                        if (result) {
                            $("#homepage-new-name").next("span.validation-errors").html("[[[Homepage name already exists.]]]").parent().addClass("has-error");
                            $("#homepage-action-popup_wrapper").ejWaitingPopup("hide");
                        }
                        else {
                            $.ajax({
                                type: "POST",
                                url: itemAction.toLowerCase() == "rename" ? renameHomepageUrl : duplicateHomepageUrl,
                                data: { homepageId: homepageItemId, homepageName: homepageName },
                                success: function (result) {
                                    var header = itemAction.toLowerCase() == "rename" ? "[[[Rename Homepage]]]" : "[[[Duplicate Homepage]]]";
                                    var successMessage = itemAction.toLowerCase() == "rename" ? "[[[Homepage has been renamed successfully.]]]" : "[[[Homepage has been duplicated successfully.]]]"
                                    $("#homepage-action-popup_wrapper").ejWaitingPopup("hide");
                                    closeHomepageActionPopup();
                                    if (result) {
                                        if (itemAction.toLowerCase() == "rename") {
                                            parent.$("#homepage-name").text(homepageName).attr("data-original-title", homepageName);
                                        }
                                        parent.window.location.href = baseUrl + homepages + "/" + homepageName;
                                        SuccessAlert(header, successMessage, 7000);
                                    }
                                    else {
                                        var errorMessage = "[[[Internal server error. Please try again.]]]";
                                        WarningAlert(header, errorMessage, 7000);
                                    }

                                }
                            });
                        }
                    }
                });
            }
            else if (homepageItemId == "") {
                var isDashboardHomepage = false;
                var dashboardItemId = "";
                var parentItemId = "";
                var isTwoColumn = false;
                var isGetDashboardHomepageName = parent.window.GetDashboardHomepageName;
                if (isGetDashboardHomepageName) {
                    isDashboardHomepage = true;
                    parentItemId = parent.window.ParentId;
                    dashboardItemId = parent.window.DashboardId;
                }
                else {
                    isTwoColumn = window.screen.availWidth >= 1366 ? false : true;
                }

                $.ajax({
                    type: "POST",
                    url: checkHomepageNameExistsUrl,
                    data: { homepageName: homepageName },
                    success: function (result) {
                        if (result) {
                            $("#homepage-new-name").next("span.validation-errors").html("[[[Homepage name already exists.]]]").parent().addClass("has-error");
                            parent.$("#homepage-action-popup_wrapper").ejWaitingPopup("hide");
                        }
                        else {
                            $.ajax({
                                type: "POST",
                                url: addHomepageUrl,
                                data: { homepageName: homepageName, checkedStatus: checked, isDashboardHomepage: isDashboardHomepage, isTwoColumn: isTwoColumn },
                                success: function (result) {
                                    parent.$("#homepage-action-popup_wrapper").ejWaitingPopup("hide");
                                    closeHomepageActionPopup();
                                    if (result.Success) {
                                        homepageItemId = result.Value;
                                        if (isGetDashboardHomepageName) {
                                            $.ajax({
                                                type: "POST",
                                                url: pinWidgetUrl,
                                                data: { homepageId: homepageItemId, widgetId: null, dashboardId: parentItemId != "" || undefined ? parentItemId : dashboardItemId, tabId: parentItemId != "" || undefined ? dashboardItemId : null },
                                                success: function (result) {
                                                    if (result.Success) {
                                                        SuccessAlert("[[[Pin Dashboard to the Homepage]]]", "[[[Dashboard has been pinned successfully.]]]", 7000);
                                                        parent.closeAddItemPopup();
                                                        if (checked == true) {
                                                            parent.window.location.href = baseUrl + homepages;
                                                        }
                                                        else {
                                                            parent.window.location.href = baseUrl + homepages + "/" + homepageName;
                                                        }
                                                    }
                                                    else {
                                                        WarningAlert("[[[Pin Dashboard to the Homepage]]]", "[[[Homepage has been added successfully. Error while pinning dashboard to the homepage.]]]", 7000);
                                                    }
                                                }
                                            });
                                        }
                                        else {
                                            if (checked == true) {
                                                parent.window.location.href = baseUrl + homepages;
                                            }
                                            else {
                                                parent.window.location.href = baseUrl + homepages +"/"+ homepageName;
                                            }
                                            SuccessAlert("[[[Add new Homepage]]]", "[[[Homepage has been added successfully.]]]", 7000);
                                        }
                                    }
                                    else {
                                        var errorMessage = "[[[Error while adding a homepage.]]]";
                                        WarningAlert(header, errorMessage, 7000);
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });

    $(document).on("keydown", "#homepage-new-name", function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            $("#save-button").trigger("click");
        }
    });

    $("#default-homepage-label").on("click", function () {
        if (!$("#default-homepage-checkbox").is(":checked"))
            $("#default-homepage-checkbox").prop("checked", true);
        else
            $("#default-homepage-checkbox").prop("checked", false);
    });

    $("#default-homepage-label").on("click", function () {
        if (isSafari) {
            $(this).toggleClass("check");
        }
    });
});

function changeListOnWindowResize() {
    var currentLayout = $("#widget-container").attr("data-current-layout");
    if (window.innerWidth <= 1040 && window.innerWidth > 768) {
        parent.$("#widget-container ul li.empty").removeClass("click-container");
        parent.$("#column-1, #column-2, #column-3").sortable("disable");
        if (currentLayout == "111") {
            if ($("#column-1 li").hasClass("empty") && $("#column-2 li").hasClass("empty") && $("#column-3 li").hasClass("empty")) {
                $("#column-1").css("width", "100%");
                $("#column-1 li.empty").show();
            }
            else if (!$("#column-1 li").hasClass("empty") && $("#column-2 li").hasClass("empty") && $("#column-3 li").hasClass("empty")) {
                $("#column-2 li.empty").show();
                $("#widget-container ul li.empty").css("border", "none");
                $("#widget-container ul li.empty .empty-content").hide();
            }
            else if ($("#column-1 li").hasClass("empty") && (!$("#column-2 li").hasClass("empty") || !$("#column-3 li").hasClass("empty"))) {
                $("#column-1 li.empty").show();
                $("#widget-container ul li.empty").css("border", "none");
                $("#widget-container ul li.empty .empty-content").hide();
            }
        }
        else if (currentLayout == "11" || currentLayout == "12" || currentLayout == "21") {
            if ($("#column-1 li").hasClass("empty") && $("#column-2 li").hasClass("empty")) {
                $("#column-1").css("width", "100%");
                $("#column-1 li.empty").show();
            }
            else if (!$("#column-1 li").hasClass("empty") && $("#column-2 li").hasClass("empty")) {
                $("#column-2 li.empty").show();
                $("#widget-container ul li.empty").css("border", "none");
                $("#widget-container ul li.empty .empty-content").hide();
            }
            else if ($("#column-1 li").hasClass("empty") && !$("#column-2 li").hasClass("empty")) {
                $("#column-1 li.empty").show();
                $("#widget-container ul li.empty").css("border", "none");
                $("#widget-container ul li.empty .empty-content").hide();
            }
        }
    }
    else if (window.innerWidth <= 768) {
        parent.$("#widget-container ul li.empty").removeClass("click-container");
        parent.$("#column-1, #column-2, #column-3").sortable("disable");
        if (currentLayout == "111") {
            if ($("#column-1 li").hasClass("empty") && $("#column-2 li").hasClass("empty") && $("#column-3 li").hasClass("empty")) {
                $("#column-1 li.empty").show();
            }
        }
        else if (currentLayout == "11" || currentLayout == "12" || currentLayout == "21") {
            if ($("#column-1 li").hasClass("empty") && $("#column-2 li").hasClass("empty")) {
                $("#column-1 li.empty").show();
            }
        }
    }
    else {
        parent.$("#widget-container ul li.empty").addClass("click-container");
        parent.$("#column-1, #column-2, #column-3").sortable("enable");
    }
}

function closeAddItemPopup() {
    $("#add-item-popup_wrapper").ejWaitingPopup("hide");
    $("#add-item-popup-iframe").contents().find("#items-container, #preview-container").html("");
    parent.window.PinColumn = "";
    parent.window.IsPinWidget = false;
    parent.window.IsPinDashboard = false;
    parent.window.GetDashboardHomepageName = false;
    parent.window.ParentName = "";
    $("#success-alert, #warning-alert").hide();
    $("#add-item-popup").ejDialog("close");
}

function createEmptyList(from, to) {
    for (var i = from; i <= to; i++) {
        $("#widget-container").append("<ul id='column-" + i + "' data-column-id='" + i + "' data-child-count='0'><li class='empty click-container'><div class='empty-content empty-homepage'><span class='drag-widget'>[[[Drag your widgets here to customize layout]]]</span></div></li></ul>");
    }
}
function appendListItem(appendTo, count) {
    for (var i = appendTo + 1; i <= appendTo + count; i++) {
        if ($("#column-" + i + " li:not(.empty)").length > 0) {
            $("#column-" + appendTo + " li.empty").remove();
        }
        $("#column-" + appendTo).append($("#column-" + i + " li:not(.empty)"));
        $("#column-" + i).remove();
    }
}

function changeLayout(layout) {
    var homepageItemId = $("#widget-container").attr("data-homepage-id");
    var isVirtualHomepage = $("#widget-container").attr("data-virtual-homepage");
    if (homepageItemId == "" && isVirtualHomepage == "true") {
        homepageItemId = saveVirtualHomepage();
        $("#initial-message").hide();
    }
    $.ajax({
        type: "POST",
        async: true,
        url: changeLayoutUrl,
        data: { homepageId: homepageItemId, layout: layout },
        success: function (result) {
            if (result.Success && homepageItemId != "" && isVirtualHomepage == "true") {
                afterVirtualHomepageSave(homepageItemId);
            }
            else if (!result.Success) {
                WarningAlert("[[[Change Layout]]]", "[[[Unable to change layout. Internal server error. Please try again.]]]", 7000);
            }
        }
    });
}

function setLayout(layout) {
    var itemType = $("#widget-container").attr("data-item-type").toLowerCase();
    $("#layout-items").find("span#" + layout).addClass("active");
    switch (layout) {
        case 1:
            $("#column-1").removeClass().addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12");
            break;
        case 11:
            $("#column-1,#column-2").removeClass().addClass("col-lg-6 col-md-6 col-sm-6 col-xs-6");
            break;
        case 12:
            $("#column-1").removeClass().addClass("col-lg-4 col-md-4 col-sm-4 col-xs-4");
            $("#column-2").removeClass().addClass("col-lg-8 col-md-8 col-sm-8 col-xs-8");
            break;
        case 21:
            $("#column-1").removeClass().addClass("col-lg-8 col-md-8 col-sm-8 col-xs-8");
            $("#column-2").removeClass().addClass("col-lg-4 col-md-4 col-sm-4 col-xs-4");
            break;
        case 111:
            $("#column-1,#column-2,#column-3").removeClass().addClass("col-lg-4 col-md-4 col-sm-4 col-xs-4");
            break;
    }
    var isEmptyHomepage = checkEmptyHomepage();
    if (isEmptyHomepage) {
        if (!window.IsMobile) {
            $("#widget-container ul li.empty .empty-content").find(".drag-widget").hide();
            $("#widget-container ul li.empty .empty-content").removeClass("non-empty-homepage").addClass("empty-homepage");
        }
        else {
            $("#widget-container ul li.empty .empty-content").removeClass("non-empty-homepage").addClass("mobile-empty-homepage");
            $("#widget-container ul li.empty .empty-content").find(".drag-widget").text("[[[Log in using a desktop client to add widgets on this homepage.]]]").show();
            $("#widget-container ul li.empty").css("border", "none");
        }
    }
    if (itemType != "dashboard") {
        enableSorting();
        setListMinimumHeight();
        $('.e-dashboardviewer').each(function () {
            var data = $(this).data("ejDashboardViewer");
            data.resizeDashboard();
        });
    }
}

function checkEmptyHomepage() {
    var length = 0;
    var isEmptyHomepage = false;
    $("#widget-container ul").each(function (i) {
        length = $("#column-" + (i + 1) + " li:not('.empty')").length;
        isEmptyHomepage = length > 0 ? false : true;
        return length > 0 ? false : true;
    });
    return isEmptyHomepage;
}

var hasWidgetLink = false;
function renderItem(itemDetail) {
    var isEmptyHomepage = checkEmptyHomepage();
    var dateFormat = $("#dateFormat").val();
    var timeFormat = $("#timeFormat").val();
    if (timeFormat == "True")
    {
        timeFormat = "HH:mm";
    }
    else
    {
        timeFormat = "hh:mm tt";
    }
    if (isEmptyHomepage) {
        $("#widget-container ul li.empty .empty-content").find(".drag-widget").hide();
        $("#widget-container ul li.empty .empty-content").removeClass("non-empty-homepage").addClass("empty-homepage");
    }
    
    $("#widget-container").hide();
    if (itemDetail.ItemType.toLowerCase() == "widget") {
        setLayout(itemDetail.ColumnInfo.Layout, true);
        var column = itemDetail.ColumnInfo.Column;
        $.each(column, function (i) {
            if (column[i].Item.length > 0) {
                $.each(column[i].Item, function (j) {
                    $("#widget_" + (i + 1) + "_" + (j + 1)).ejDashboardViewer({
                        serviceUrl: dashboardServiceUrl,
                        dashboardPath: column[i].Item[j].Path,
                        reportName: "",
                        reportDescription: "",
                        enableExport: true,
                        enablePrint: false,
                        actionBegin: function (args) {
                            if (args.eventType === "beforeNavigate") {
                                hasWidgetLink = true;
                            }
                        },
                        localeSettings: {
                            resourcePath: ""
                        },
                        enableWidgetMode: column[i].Item[j].Id == null ? false : true,
                        showTab: column[i].Item[j].TabId == null ? true : false,
                        widgetModeSettings: {
                            name: "",
                            id: column[i].Item[j].Id == null ? "" : column[i].Item[j].Id,
                            title: column[i].Item[j].Name
                        },
                        _selectedTabGuid: column[i].Item[j].TabId == null ? "" : column[i].Item[j].TabId,
                        afterWidgetRender: $.proxy(function (args, param) {
                            if (param.data.controlType.toLowerCase() == "card") {
                                $("#widget_" + (i + 1) + "_" + (j + 1) + " .e-control-heading span").hasClass("e-control-title") == false ? $("#widget_" + (i + 1) + "_" + (j + 1) + " .e-control-heading").text(args[i].Item[j].Name) : "";
                            }
                            if (args[i].Item[j].IsActive && !args[i].Item[j].IsHavingPermission) {
                                $("#widget_" + (i + 1) + "_" + (j + 1)).find(".e-dbrd-control").remove();
                                $("#widget_" + (i + 1) + "_" + (j + 1)).find(".e-dbrd-control-container").append("<div class='no-permission'><span class='message'>[[[You do not have permission to view this widget.]]]</span></div>");
                            }
                            else if (!args[i].Item[j].IsActive && !args[i].Item[j].IsHavingPermission) {
                                $("#widget_" + (i + 1) + "_" + (j + 1)).find(".e-dbrd-control").remove();
                                $("#widget_" + (i + 1) + "_" + (j + 1)).find(".e-dbrd-control-container").append("<div class='no-permission'><span class='message'>[[[This widget has been deleted.]]]</span></div>");
                            }
                        }, this, column),
                        beforeWidgetIconRendered: $.proxy(function (args, event) {
                            if (event.widgetInformation.Name.toLowerCase() != "widget not configured") {
                                if (!window.IsMobile) {
                                    if (event.widgetInformation.Name.toLowerCase() != "card") {
                                        $("#widget_" + (i + 1) + "_" + (j + 1)).data("ejDashboardViewer").model.size.height = "400px";
                                    }
                                    else {
                                        $("#widget_" + (i + 1) + "_" + (j + 1)).data("ejDashboardViewer").model.size.height = "250px";
                                    }
                                }
                                else {
                                    $("#widget_" + (i + 1) + "_" + (j + 1)).data("ejDashboardViewer").model.size.height = "250px";
                                }
                            }
                            else {
                                $("#widget_" + (i + 1) + "_" + (j + 1)).data("ejDashboardViewer").model.size.height = "200px";
                                $("#widget_" + (i + 1) + "_" + (j + 1)).find(".e-dbrd-control-container").append("<div class='no-permission'><span class='message'>[[[This Widget has been deleted.]]]</span></div>");
                            }
                            $("#widget_" + (i + 1) + "_" + (j + 1)).data("ejDashboardViewer").resizeDashboard();
                            if (args[i].Item[j].IsActive && args[i].Item[j].IsHavingPermission && event.widgetInformation.Name.toLowerCase() != "widget not configured") {
                                event.iconsinformation.unshift({ "classname": "su su-maximize unpin", "name": "Maximize Widget", "datatooltip": "Maximize Widget", "marginright": "-18px", "margintop": "4px" });
                            }
                            if (!window.IsMobile) {
                                event.iconsinformation.unshift({ "classname": "su su-delete unpin", "name": "Unpin Widget", "datatooltip": "Unpin Widget", "marginright": "-18px", "margintop": "4px" });
                            }
                            $("#widget-container").show();
                            hideWaitingPopup("content-area");
                        }, this, column),
                        onMenuIconClick: function (information) {
                            if (information.name.toLowerCase() == "unpin widget") {
                                ShowWaitingProgress("#content-area", "show");
                                var column = information.target.parents("ul").data("column-id");
                                var position = information.target.parents("li").index() + 1;
                                unPinItem(column, position, information.event);
                            }
                            else if (information.name.toLowerCase() == "maximize widget") {
                                parent.$("#maximize").removeClass("display-none");
                                var currentElement = information.target.parents(".widget").attr("id");
                                var control = parent.$("#" + currentElement).data('ejDashboardViewer').getWidgetDataByReportName(information.widgetId);
                                var header = information.headertext;
                                maximizeWidget(header, control, information.event, information.serviceUrl, information.dashboardPath);
                            }
                        }
                    });
                });
            }
            else {
                $("#widget-container").show();
                hideWaitingPopup("content-area");
            }
        });
        enableSorting();
        setListMinimumHeight();
    }
    else if (itemDetail.ItemType.toLowerCase() == "dashboard") {
        var column = itemDetail.ColumnInfo.Column;
        $("#dashboard_1_1").css({ "height": $(window).height() - $("#header-area").outerHeight() - $("#base-footer-div").outerHeight() - $("#homepage-header").outerHeight() - 30, "width": $("#content-area").width() });
        if (column[0].Item[0].IsActive && column[0].Item[0].IsHavingPermission) {
            $("#dashboard_1_1").ejDashboardViewer({
                serviceUrl: dashboardServiceUrl,
                dashboardPath: itemDetail.ColumnInfo.Column[0].Item[0].Path,
                reportName: "",
                reportDescription: "",
                enableExport: true,
                enablePrint: false,
                showGetLinkIcon: false,
                localeSettings: {
                    resourcePath: ""
                 },
                interactionSettings: {
                    allowHistoryMaintenance: false,
                    handleHistoryEvent: false
                },
                enableWidgetMode: false,
                showTab: itemDetail.ColumnInfo.Column[0].Item[0].TabId != null ? false : true,
                _selectedTabGuid: itemDetail.ColumnInfo.Column[0].Item[0].TabId != null ? itemDetail.ColumnInfo.Column[0].Item[0].TabId : "",
                beforeControlMenuOpen: function (e) {
                    e.menuData.splice(1, 1);
                },
                onTabSelectionFailure : "OnFailtoLoadChildDashboard",
                beforeContextMenuOpen: function (e) {
                    var removeByAttr = function (arr, attr, value) {
                        var i = arr.length;
                        while (i--) {
                            if (arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === value)) {
                                arr.splice(i, 1);
                            }
                        }
                        return arr;
                    }
                    removeByAttr(e.menuData, "text", "Export");
                }
            });
        }
        else {
            if (column[0].Item[0].IsActive && !column[0].Item[0].IsHavingPermission) {
                $("#dashboard_1_1").append("<div class='no-permission'><span class='message'>[[[You do not have permission to view this dashboard.]]]</span></div>");
            }
            else if (!column[0].Item[0].IsActive && !column[0].Item[0].IsHavingPermission) {
                $("#dashboard_1_1").append("<div class='no-permission'><span class='message'>[[[This dashboard has been deleted.]]]</span></div>");
            }
        }
        $("#widget-container").show();
        hideWaitingPopup("content-area");
    }
}

function maximizeWidget(header, control, event, serviceUrl, dashboardPath) {
    ShowWaitingProgress("#maximize_container", "show");
    $('#maximize_container').ejDashboardViewer({
        serviceUrl: serviceUrl,
        dashboardPath: dashboardPath,
        _dashboardData: {
            loadFromData: true,
            isControl: true,
            controlHeader: header,
            layout: [{ "Key": "Culture", "Value": "en-US" },
                   { "Key": "Layout", "Value": "{\"RowCount\":6,\"ColumnCount\":12,\"Background\":\"#FFFFFFFF\",\"HasFZone\":false,\"CanvasLayout\":\"DesktopGridCanvas\"}" },
                   { "Key": "LayoutInformation", "Value": "[{\"ParameterColumns\":{\"Title\":[]},\"Column\":2,\"Row\":0,\"ColumnSpan\":5,\"RowSpan\":3,\"Label\":{\"ContentPaddingBottom\":0,\"ContentPaddingLeft\":0,\"ContentPaddingRight\":0,\"ContentPaddingTop\":0,\"ControlPaddingBottom\":0,\"ControlPaddingLeft\":0,\"ControlPaddingRight\":0,\"ControlPaddingTop\":0,\"CornerRadius\":0,\"Description\":\"Grid control monitors variables through Column vise\",\"EnableComment\":true,\"EnableCsvExport\":true,\"EnableExcelExport\":true,\"EnableImageExport\":true,\"EnablePdfExport\":true,\"HeaderHeight\":20,\"HeaderLabelBackground\":\"#FFFFFFFF\",\"HeaderLabelForeground\":\"#FF161616\",\"HeaderText\":\"Grid_1\",\"IsBold\":false,\"IsItalic\":false,\"LabelAlignment\":0,\"ShowBorder\":false,\"ShowDescription\":false,\"ShowHeader\":true,\"ShowMaximize\":true,\"TextAlignment\":null},\"Name\":\"Grid\",\"IsMaster\":false,\"Guid\":\"9929e1a5-c00b-414a-9262-fd3e474a456c\",\"ReportName\":\"Grid_1\",\"IsStandardSize\":false}]" }],
            widgetData: [control]
        },
        afterWidgetRender: function (args) {
            ShowWaitingProgress("#maximize_container", "hide");
        }
    });
    $("#maximize_container .e-control-heading div").append("<span class='su su-close' title='[[[close]]]'></span>");
    event.preventDefault();
}

function OnFailtoLoadChildDashboard(args) {
    var isTabMismatch = (args.selectedTabGuid != args.currentTabGuid);
    if (isTabMismatch == true) {
        $("#dashboard_1_1").data("ejDashboardViewer").stopRendering = true;
        $("#dashboard_1_1").html("").append("<div class='no-permission'><span class='message'>[[[This dashboard has been deleted/updated.]]]</span></div>");
    }
}

function createHomepageDom(itemDetail) {
    $("#homepage-name").text(itemDetail.Name).attr("data-original-title", itemDetail.Name).css("float", "left");
    $("#widget-container").attr("data-homepage-id", itemDetail.Id).attr("data-current-layout", itemDetail.ColumnInfo.Layout).attr("data-item-type", itemDetail.ItemType).attr("data-virtual-homepage", itemDetail.IsVirtualHomepage);
    var addItemPopup = $("#add-item-popup_wrapper").css("display").toLowerCase();
    if (addItemPopup == "none") {
        showWaitingPopup("content-area");
    }
    if (itemDetail.ItemType.toLowerCase() == "widget") {
        var column = itemDetail.ColumnInfo.Column;
        $.each(column, function (i) {
            $('#widget-container').append('<ul id=column-' + (i + 1) + ' class="widget-list" data-column-id=' + (i + 1) + '></ul>');
            if (column[i].Item.length > 0) {
                $.each(column[i].Item, function (j) {
                    var item = column[i].Item[j].Id == null ? widgets : dashboards;
                    var href = column[i].Item[j].TabId == null ? item + '/view?id=' + column[i].Item[j].ItemId : item + '/view?id=' + column[i].Item[j].ItemId + '&tab=' + column[i].Item[j].TabId;
                    $('#column-' + (i + 1)).append('<li class="list-item"><a class="redirect" href="' + href + '" data-url='+ href +' target="_blank"><div class="widget" id=widget_' + (i + 1) + '_' + (j + 1) + ' style="height:100%"></div></a></li>');
                });
            }
            else {
                $('#column-' + (i + 1)).append("<li class='empty click-container'><div class='empty-content empty-homepage'><span class='drag-widget'>Drag your widgets here to customize layout</span></div></li>");
            }
        });
        var listItems = $("li.list-item a");
        for (var t = 0; t < listItems.length; t++) {
            $("li.list-item a").eq(t).attr("href", $("li.list-item a").eq(t).attr("data-url"));
        }
    }
    else if (itemDetail.ItemType.toLowerCase() == "dashboard") {
        $("#add-item, #layout-container, #divider").hide();
        $('#widget-container')
            .append('<ul id="column-1" class="dashboard-column col-lg-12 col-md-12 col-sm-12 col-xs-12" data-column-id="1"><li class="dashboard-list"><div class="dashboard" id="dashboard_1_1" style="height:100%;width:100%"></div></li></ul>');
    }
}

function enableSorting() {
    $("#column-1, #column-2, #column-3").sortable({
        connectWith: "ul",
        placeholder: ".placeholder",
        handle: ".e-control-heading",
        cancel: ".empty",
        containment: "#content-area",
        cursor: "move",
        tolerance: "pointer",
        scroll: true,
        scrollSensitivity: 10,
        scrollSpeed: 20,
        update: function (event, ui) {
            toColumn = $(event.target).data("column-id");
            toPosition = ui.item.index() + 1;
        },
        start: function (event, ui) {
            $("li.ui-sortable-placeholder").append("<div class='placeholder-text'>Drag your widgets here to customize layout</div>");
            $("li.ui-sortable-placeholder").css('height', ui.item.height().toString() + "px");
            $('#widget-container ul li.empty').remove();
            fromColumn = $(event.target).data("column-id");
            fromPosition = ui.item.index() + 1;
            toColumn = $(event.target).data("column-id");
            toPosition = ui.item.index() + 1
        },
        stop: function (event, ui) {
            showEmptyList();
            if (!(fromColumn == toColumn && fromPosition == toPosition)) {
                if (fromColumn != toColumn) {
                    $(ui.item).find(".widget").data("ejDashboardViewer").resizeDashboard();
                }
                dragAndDrop(fromColumn, toColumn, fromPosition, toPosition);
            }
            setListMinimumHeight();
        }
    });
    $("#column-1, #column-2, #column-3").disableSelection();
}

function dragAndDrop(fromColumn, toColumn, fromPosition, toPosition) {
    var homepageItemId = $("#widget-container").attr("data-homepage-id");
    var from = { Column: fromColumn, Position: fromPosition };
    var to = { Column: toColumn, Position: toPosition };
    $.ajax({
        type: "POST",
        async: true,
        url: dragAndDropUrl,
        data: { homepageId: homepageItemId, moveFrom: from, moveTo: to },
        success: function (result) {
            if (!result.Success) {
                WarningAlert("[[[Drag and Drop]]]", "[[[Drag and drop failure. Internal server error. Please try again.]]]", 7000);
            }
        }
    });
}

function setListMinimumHeight() {
    var tempArr = [];
    $('#widget-container > ul').each(function (i) {
        var tempVar = 0;
        $(this).find("li").each(function (j) {
            tempVar = tempVar + $(this).innerHeight() + 20;
        });
        tempArr[i] = tempVar;
    });
    var minimumHeight = Math.max.apply(Math, tempArr) > 400 ? Math.max.apply(Math, tempArr) : 440;
    $('#widget-container > ul').css("min-height", minimumHeight);
}

function unPinItem(column, position, event) {
    var homepageItemId = $("#widget-container").attr("data-homepage-id");
    var unpinPosition = { Column: column, Position: position };
    $.ajax({
        type: "POST",
        url: unPinUrl,
        data: { homepageId: homepageItemId, position: unpinPosition },
        success: function (result) {
            if (result.Success) {
                $("#column-" + column + " li:eq(" + (position - 1) + ")").remove();
                showEmptyList();
                var isEmptyHomepage = checkEmptyHomepage();
                if (isEmptyHomepage) {
                    $("#widget-container ul li.empty .empty-content").find(".drag-widget").hide();
                    $("#widget-container ul li.empty .empty-content").removeClass("non-empty-homepage").addClass("empty-homepage");
                }
            }
        }
    });
    ShowWaitingProgress("#content-area", "hide");
    event.preventDefault();
}

function showEmptyList() {
    $("#widget-container ul").each(function (i) {
        if ($("#column-" + (i + 1) + " li").length < 1) {
            $('#column-' + (i + 1)).append("<li class='empty click-container'><div class='empty-content empty-homepage'><span class='drag-widget'>[[[Drag your widgets here to customize layout]]]</span></div></li>");
        }
    });
}

function addToolTip() {
    $("select").each(function () {
        var dataId = $(this).attr("id");
        $("#" + dataId).selectpicker("refresh");
        for (var i = 0; i < $("button[data-id=" + dataId + "]").next().find("ul li").length; i++) {
            var title = $("button[data-id=" + dataId + "]").next().find(".dropdown-menu.selectpicker li").eq(i).find("a .text").text();
            $("button[data-id=" + dataId + "]").next().find(".dropdown-menu.selectpicker li").eq(i).find('a').attr("title", title);
        }
    });
}

function createVirtualHomepage() {
    var Column = [
            { Item: {} },
            { Item: {} }
    ];
    var windowWidth = window.screen.availWidth;
    window.screen.availWidth >= 1366 ? Column.push({ Item: {} }) : "";
    var virtualHomepageInfo = {
        ColumnInfo: {
            Column: Column,
            Layout: window.screen.availWidth >= 1366 ? 111 : 11
        },
        Id: "",
        IsDefaultHomepage: false,
        ItemType: "Widget",
        Name: "Homepage1",
        IsVirtualHomepage: true
    };
    $("#homepage-list").val(virtualHomepageInfo.Name);
    $("#homepage-list").selectpicker("refresh");
    createHomepageDom(virtualHomepageInfo);
    renderItem(virtualHomepageInfo);
    var virtualHomepageInitialMessage = getCookie("virtualhomepageinitialmessage");
    if (virtualHomepageInitialMessage == null) {
        $("#initial-message").removeClass("hidden");
    }
}

function saveVirtualHomepage() {
    var homepageName = $("#homepage-name").text().trim();
    var isTwoColumn = window.screen.availWidth >= 1366 ? false : true;
    var virtualHomepageId = "";
    $.ajax({
        type: "POST",
        url: addHomepageUrl,
        async: false,
        data: { homepageName: homepageName, checkedStatus: true, isDashboardHomepage: false, isTwoColumn: isTwoColumn },
        success: function (result) {
            if (result.Success) {
                virtualHomepageId = result.Value;
            }
        }
    });
    return virtualHomepageId;
}

function getCookie(cookie_name) {
    var cookie_value = document.cookie;
    var cookie_start = cookie_value.indexOf(" " + cookie_name + "=");
    if (cookie_start == -1) {
        cookie_start = cookie_value.indexOf(cookie_name + "=");
    }
    if (cookie_start == -1) {
        cookie_value = null;
    }
    else {
        cookie_start = cookie_value.indexOf("=", cookie_start) + 1;
        var cookie_end = cookie_value.indexOf(";", cookie_start);
        if (cookie_end == -1) {
            cookie_end = cookie_value.length;
        }
        cookie_value = unescape(cookie_value.substring(cookie_start, cookie_end));
    }
    return cookie_value;
}

function setCookie(initialmessage, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays++);
    var cookie_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = initialmessage + "=" + cookie_value;
}

function afterVirtualHomepageSave(homepageItemId) {
    $.ajax({
        type: "POST",
        url: getHomepageDetails,
        async: true,
        data: { homepageId: homepageItemId },
        success: function (result) {
            $("#widget-container").contents().remove();
            $("#widget-container").attr("data-virtual-homepage", "");
            createHomepageDom(result);
            renderItem(result);
            $("#options li#duplicate,#options li#delete").show();
            $("#options li.make-default").remove();
            $("#options").append("<li id='remove-default' class='make-default'>[[[Remove default homepage]]]</li>");
            $("#homepage-list").append("<option data-homepage-id='" + result.Id + "' value='" + result.Name + "'>" + result.Name + "</option>");
            $("#homepage-list").val(result.Name).selectpicker("refresh");
            $("#homepage-list").next().find(".dropdown-menu > .bs-searchbox").hide();
            $("#homepage-list").next().find(".dropdown-menu > .no-result-found").remove();
        }
    });
}

function closeHomepageActionPopup() {
    parent.window.GetDashboardHomepageName = false;
    parent.window.IsNewHomepageName = "";
    parent.window.DashboardId = "";
    $("#default-homepage-checkbox").prop("checked", false);
    $("#homepage-option-form").attr("data-homepage-id", "");
    $("#homepage-action-popup #save-button").attr("data-value", "");
    $("#homepage-action-popup").ejDialog("close");
}

function homepageActionPopup(action) {
    var homepageAction = action.toLowerCase();
    var header = homepageAction.toLowerCase() == "rename" ? "Rename" : "Duplicate";
    var homepageName = $("#homepage-name").text().trim();
    switch (homepageAction) {
        case "rename":
        case "duplicate":
            $("#homepage-option-container .PopupTitle").text(header + " [[[Homepage]]]");
            $("#homepage-action-popup #default-homepage-section").hide();
            $("#homepage-action-popup #item-name-division").addClass("top-padding");
            $("#homepage-action-popup #save-button").attr("data-value", homepageAction);
            $("#homepage-option-form").attr("data-homepage-id", $("#widget-container").attr("data-homepage-id"));
            $("#homepage-option-container #homepage-new-name").val(homepageAction == "rename" ? homepageName : homepageName + " - Copy");
            $("#homepage-option-form").valid();
            break;
        case "newhomepage":
            $("#homepage-option-container .PopupTitle").text("[[[New Homepage]]]");
            $("#homepage-option-container #homepage-new-name").val("").next(".validation-errors").find(".error").remove();
            $("#homepage-option-container #homepage-new-name").parent().removeClass("has-error");
            $("#homepage-action-popup #default-homepage-section").show();
            $("#homepage-action-popup #item-name-division").removeClass("top-padding");
            break;
        case "newdashboardhomepage":
            $("#homepage-option-container .PopupTitle").text("[[[New Homepage]]]");
            $("#homepage-action-popup #default-homepage-section").show();
            $("#homepage-action-popup #item-name-division").removeClass("top-padding");
            $("#homepage-option-container #homepage-new-name").val(parent.window.IsNewHomepageName);
            $("#homepage-option-form").valid();
            break;
    }
    $("#homepage-action-popup_wrapper").ejWaitingPopup("hide");
}