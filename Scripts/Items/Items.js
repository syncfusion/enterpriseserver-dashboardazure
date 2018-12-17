var itemUrl;
var browser = ej.browserInfo();
var isFirstRequest = false;

$(function () {
    addPlacehoder("#input-div");
    $("#item-viewer").css({ "height": $(window).height() - $("#header-area").outerHeight() - $("#base-footer-div").outerHeight(), "width": $(window).width() - $("#main-nav").width() - $(".item-list-panel").width() });
    $("#create-new-category").css("width", $(".item-list-panel").outerWidth());
    $("#input-div").find(".placeholder").hide();
    $("#item-grid-container").ejWaitingPopup();
    $(".item-list-panel").ejWaitingPopup();
    $("#item-viewer").ejWaitingPopup();
    $(".search-area").removeClass("focusdiv");
    var ScheduleId, ItemId, ItemName, CategoryName, MultiDashboardName;
    $(".item-list-panel").css("height", window.innerHeight - $("#header-area").outerHeight());
    $("#datasource-popup").ejDialog({
        width: "650px",
        showOnInit: false,
        allowDraggable: false,
        enableResize: false,
        enableModal: true,
        showHeader: false,
        close: "onDataSourceDialogClose",
        open: "onDataSourceDialogOpen"
    });
    $("#widget_popup").ejDialog({
        width: "651px",
        showOnInit: false,
        allowDraggable: false,
        enableResize: false,
        enableModal: true,
        showHeader: false,
        close: "onWidgetDialogClose",
        open: "onWidgetDialogOpen"
    });
    $("#popup-container").ejDialog({
        allowDraggable: false,
        enableResize: false,
        enableModal: true,
        showHeader: false,
        showOnInit: false,
        close: "onSchedulerDialogClose",
        open: "onSchedulerDialogOpen",
        width: "876px"
    });
    $("#popup-container_wrapper").ejWaitingPopup();
    $("#report_popup").ejDialog({
        width: "760px",
        showOnInit: false,
        allowDraggable: false,
        enableResize: false,
        title: "[[[Add Dashboard]]]",
        enableModal: true,
        showHeader: false,
        open: "onDashboardDialogOpen"
    });

    $("#select_datasource_popup").ejDialog({
        width: "800px",
        showOnInit: false,
        allowDraggable: true,
        enableResize: false,
        height: "530px",
        showHeader: false,
        enableModal: true,
        closeOnEscape: true,
        close: 'closeNewDataSourcePopup'
    });
    $("#AddCategoryPopup").ejDialog({
        width: "600px",
        showOnInit: false,
        allowDraggable: false,
        enableResize: false,
        showHeader: false,
        enableModal: true,
        closeOnEscape: true,
        close: "onCategoryDialogBoxClose",
        open: "onCategoryDialogOpen"
    });
    $("#file-popup").ejDialog({
        width: "650px",
        showOnInit: false,
        allowDraggable: false,
        enableResize: false,
        title: "[[[Add File]]]",
        enableModal: true,
        showHeader: false,
        open: "onNewFileDialogOpen",
        close: "onNewFileDialogClose"
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
    $("#version-window-container").ejDialog({
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
    $("#ItemAction").ejDialog({
        showOnInit: false,
        allowDraggable: true,
        enableResize: false,
        width: "525px",
        title: "",
        showHeader: false,
        enableModal: true,
        close: "itemActionEmpty",
        closeOnEscape: true
    });
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

    $("#make_item_public").ejDialog({
        width: (window.innerWidth > 460) ? "450px" : (window.innerWidth - 10),
        showOnInit: false,
        allowDraggable: false,
        enableResize: false,
        height: "auto",
        title: "[[[Make Public]]]",
        showHeader: false,
        enableModal: true,
        closeOnEscape: true,
        close: "onMakePublicDialogClose",
        open: "onMakePublicDialogOpen"
    });
    $("#remove_item_public").ejDialog({
        width: (window.innerWidth > 460) ? "450px" : (window.innerWidth - 10),
        showOnInit: false,
        allowDraggable: false,
        enableResize: false,
        height: "auto",
        title: "[[[Remove Public]]]",
        showHeader: false,
        enableModal: true,
        closeOnEscape: true,
        close: "onRemovePublicDialogClose",
        open: "onRemovePublicDialogOpen"
    });
    $("#make_item_unlist").ejDialog({
        width: (window.innerWidth > 460) ? "450px" : (window.innerWidth - 10),
        showOnInit: false,
        allowDraggable: false,
        enableResize: false,
        height: "auto",
        title: "[[[Unlist Dashboard]]]",
        showHeader: false,
        enableModal: true,
        closeOnEscape: true,
        close: "onMakeUnlistDialogClose",
        open: "onMakeUnlistDialogOpen"
    });

    $("#privacy-settings-container").ejDialog({
        width: "560px",
        showOnInit: false,
        allowDraggable: true,
        enableResize: false,
        height: "auto",
        title: "[[[Privacy Settings]]]",
        showHeader: false,
        enableModal: true,
        close: "onPrivacySettingsDialogClose",
        open: "onPrivacySettingsDialogOpen"
    });

    $("#create-connection-popup").ejDialog({
        width: $(window).width(),
        height: $(window).height(),
        showOnInit: false,
        allowDraggable: false,
        enableResize: false,
        enableModal: true,
        showHeader: false,
        close: "onCreateConnectionDialogClose",
        closeOnEscape: true,
        beforeClose: function (args) {
            parent.$("#create-connection-popup_wrapper").ejWaitingPopup("hide");
            $("#create-connection-popup").addClass("display-none");
        }
    });

    $("#report_popup_wrapper").ejWaitingPopup();
    $("#widget_popup_wrapper").ejWaitingPopup();
    $("#select_datasource_popup_wrapper").ejWaitingPopup();
    $("#file-popup_wrapper").ejWaitingPopup();
    $("#item-delete-confirmation_wrapper").ejWaitingPopup();
    $("#AddCategoryPopup_wrapper").ejWaitingPopup();
    $("#datasource-popup_wrapper").ejWaitingPopup();
    $("#ItemAction_wrapper").ejWaitingPopup();
    $("#permission-popup_wrapper").ejWaitingPopup();
    $("#make_item_public_wrapper").ejWaitingPopup();
    $("#remove_item_public_wrapper").ejWaitingPopup();
    $("#make_item_unlist_wrapper").ejWaitingPopup();
    $("#privacy-settings-container_wrapper").ejWaitingPopup();
    $("#create-connection-popup_wrapper").ejWaitingPopup();

    $(document).on("click", "#context-menu", function (e) {
        refreshScrollerForCategory();
    });

    $(document).on("click", ".options-area", function (e) {
        setTimeout(function () { $(".tooltip").hide(); }, 50);
    });

    $("#search-home-page").on("focusin", function () {
        $(".search-area").addClass("focusdiv");
    });
    $("#search-home-page").on("focusout", function () {
        $(".search-area").removeClass("focusdiv");
    });

    $(document).on("click", ".item-delete", function (e) {
        $("#delete-item-name").html($(this).attr("data-name"));
        $("#delete-item").attr("data-item-id", $(this).attr("data-item-id"));
        var itemId = $(this).attr("data-item-id");
        var itemName = $(this).attr("data-name");
        var itemTypeId = $(this).attr("data-itemtype");
        var datasourceType = "";
        if (itemTypeId == "4") {
            datasourceType = $(this).attr("data-datasource-type")
        }
        $("#item-delete-confirmation").ejDialog("open");
        $("#item-delete-confirmation_wrapper").ejWaitingPopup("show");
        $.ajax({
            type: "POST",
            url: deleteConfirmationUrl,
            data: { itemId: itemId, itemTypeId: itemTypeId, itemName: itemName, datasourceType: datasourceType },
            success: function (data) {
                    $("#item-delete-confirmation").html(data);
                    $("#item-delete-confirmation_wrapper").ejWaitingPopup("hide");
            }
        });
    });

    $(document).on("click", "#delete-item", function (e) {
        $("#item-delete-confirmation_wrapper").ejWaitingPopup("show");
        var itemId = $(this).attr("data-item-id");
        var itemtype = $(this).attr("data-itemtype");
        var datasourceType = "";
        if (itemtype == "Datasource") {
            datasourceType = $(this).attr("data-datasource-type")
        }
        var type = itemtype == "Category" ? "[[[Category]]]" : itemtype == "Dashboard" ? "[[[Dashboard]]]" : itemtype;
        $.ajax({
            type: "POST",
            url: deleteItemUrl,
            data: { itemId: itemId, datasourceType: datasourceType },
            success: function (data) {
                if (data.Success) {
                    $("#item-delete-confirmation_wrapper").ejWaitingPopup("hide");
                    SuccessAlert(type + "[[[ deleted]]]", $("#delete-item-name").html() + "[[[ has been deleted successfully.]]]", 7000);
                    if (itemtype == "Category" || $(".all-items").hasClass("active")) {
                        if ($(".all-items").hasClass("active")) {
                            $(".all-items").trigger("click");
                        }
                        else {
                            var categoryScope = parent.angular.element(parent.document.getElementById("server-items-container")).scope();
                            categoryScope.refreshCategorySection();
                        }
                    }
                    else if (itemtype == "Dashboard") {
                        onSuccessDeleteItem();
                        $("#favoriteitemCount").text(data.Value);
                    } else {
                        onSuccessDeleteItem();
                    }
                }
                else if (data.HasPermission == false) {
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
    addPlacehoder("#search-area");

    $(document).on("click", ".version-button", function () {
        var itemId = $(this).attr("data-item-id");
        var itemName = $(this).attr("data-itemname");
        var versionGrid = $("#grid").data("ejGrid");
        var logGrid = $("#loggrid").data("ejGrid");     
        $("#version-window-container").ejDialog("open");
        $(".modal-header .modal-title").html(itemName);
        $("#version-tab").parent("li").addClass("active");
        $("#item-log-tab").parent("li").removeClass("active");
        $("#item-version-container").removeClass("hidden").addClass("show");
        $("#item-log-container").removeClass("show").addClass("hidden");
        var dataManager_version = ej.DataManager({ url: "/items/versionitems?ItemId="+ itemId, adaptor: new ej.UrlAdaptor() });
        versionGrid.dataSource(dataManager_version);
        var dataManager_log = ej.DataManager({ url: "/items/itemlogs?ItemId=" + itemId, adaptor: new ej.UrlAdaptor() });
        logGrid.dataSource(dataManager_log);
    });

    $(document).on("click", ".item-permissions", function () {
        var ownerId = $(this).attr("data-owner-id");
        var userId = $("#user-id").val();
        var itemId = $(this).attr("data-item-id");
        var itemName = $(this).attr("data-itemname");
        var itemTypeId = $(this).attr("data-item-type");
        $("#item-id-hidden").val(itemId);
        $("#item-type-id-hidden").val(itemTypeId);
        $("#permission-popup").ejDialog("open");
        ShowWaitingProgress("#permission-popup_wrapper", "show");
        $.ajax({
            type: "POST",
            url: permissionUrl,
            data: { itemId: itemId },
            success: function (data) {
                if (($(parent.window).width()) > 1400) {
                    $("#permission-container").addClass("permissions");
                }

                if (($(parent.window).width()) < 1400) {
                    $("#permission-container").removeClass("permissions");
                }

                $(".modal-header .modal-title").html("Manage Permissions - " + itemName);
                if ((ownerId == userId) || (data.IsAdmin)) {
                    $("#is-owner").val("true");
                    $(".isviewer-header").hide();
                    $(".isviewer-group").hide();
                } else {
                    $("#is-owner").val("false");
                    $(".isowner-header").hide();
                    $(".isowner-body").hide();
                    $(".isowner-action").hide();
                }

                $("#groups-tab").parent().removeClass("active");
                $("#users-tab").parent().addClass("active");
                $("#item-user-permission-container").removeClass("hidden").addClass("show");
                $("#item-group-permission-container").removeClass("show").addClass("hidden");
                $("#group-search-area").removeClass("show").addClass("hidden");
                $("#user-search-area").removeClass("hidden").addClass("show");
                $(" .modal-body #user-search-area #clear-search").click();
                addPlacehoder("body");
                $('#user-search').find('option').remove().end();
                $('#access-selection-container').find('option').remove().end();
                $('.bs-select-all-custom').remove();
                $('.noResult').remove();
                $('.bs-deselect-all-custom').remove();
                $("#group-search").find('option').remove().end();
                $("#access-selection").find('option').remove().end();
                $("#access-selection").append(data.Access);
                $("#user-search").append(data.User);
                $("#group-search").append(data.Group);                
                $('#user-search').selectpicker("refresh");
                $('#group-search').selectpicker("refresh");
                $('#access-selection').selectpicker("refresh");

                if ($("#user-search option").length > 0)
                    $(".share-popup #user-search-container .bs-deselect-all").after("<div class='bs-select-all-custom'><span>[[[Select All]]]</span><span class='bs-select-custom-tick glyphicon glyphicon-ok'></span></div>");
                else
                    $(".share-popup #user-search-container .bs-deselect-all").after("<span class='noResult'>[[[No Results Found]]]</span>");

                if ($("#group-search option").length > 0)
                    $(".share-popup #group-search-container .bs-deselect-all").after("<div class='bs-select-all-custom'><span>[[[Select All]]]</span><span class='bs-select-custom-tick glyphicon glyphicon-ok'></span></div>");
                else
                    $(".share-popup #group-search-container .bs-deselect-all").after("<span class='noResult'>[[[No Results Found]]]</span>");

                var userPermission = $("#itempermissiongrid").data("ejGrid");
                var groupPermission = $("#itemgrouppermissiongrid").data("ejGrid");
                if ($("#is-owner").val() == false)
                {
                    groupPermission.model.columns[3].visible = false;
                }
                var dataManager_users = ej.DataManager({ url: "/items/itemuserpermissionlist?ItemId=" + itemId, adaptor: new ej.UrlAdaptor() });
                userPermission.dataSource(dataManager_users);
                userPermission.model.pageSettings.currentPage = 1;
                var dataManager_groups = ej.DataManager({ url: "/items/itemgrouppermissionlist?ItemId=" + itemId, adaptor: new ej.UrlAdaptor() });
                groupPermission.dataSource(dataManager_groups);
                groupPermission.model.pageSettings.currentPage = 1;
                $("#permission-popup_wrapper").ejWaitingPopup("hide");
            }
        });
    });

    //dummy click event added for move dashboard issue
    $(document).on("click", ".layout", function () {
        $("#container iframe").attr("src", window.location.href + "?itemId=" + $(this).attr("data-item-id") + "&itemAction=" + $(this).attr("data-action"));
    });

    $(document).on("click", ".moveItem", function () {
        var itemId = $(this).attr("data-itemId");
        var itemAction = $(this).attr("data-action");
        $("#ItemAction").ejDialog("open");
        $("#ItemAction_wrapper").ejWaitingPopup("show");
        $.ajax({
            type: "POST",
            url: moveIframeUrl,
            data: { itemId: itemId, itemAction: itemAction },
            success: function (data) {
                $("#ItemAction").html(data);
                $("#ItemAction_wrapper .e-dialog-scroller").attr("style", "overflow:inherit; border:none");
                $("#ItemAction_wrapper").ejWaitingPopup("hide");
            }
        });
    });

    $(document).on("click", ".copyItem", function () {
        var itemId = $(this).attr("data-itemId");
        var itemAction = $(this).attr("data-action");
        $("#ItemAction").ejDialog("open");
        $("#ItemAction_wrapper").ejWaitingPopup("show");
        $.ajax({
            type: "POST",
            url: copyIframeUrl,
            data: { itemId: itemId, itemAction: itemAction },
            success: function (data) {
                $("#ItemAction").html(data);
                $("#ItemAction_wrapper .e-dialog-scroller").attr("style", "overflow:inherit;border:none");
                $("#ItemAction_wrapper").ejWaitingPopup("hide");
            }
        });
    });

    $(document).on("click", ".favorite-item", function (e) {
        $("#items").ejWaitingPopup("show");
        var gridObj = $("#items").data("ejGrid");
        var itemId = $(this).attr("data-itemid");
        var value = $(this).attr("data-value");
        $.ajax({
            type: "POST",
            url: favoriteItemUrl,
            data: { itemId: itemId, value: value, },
            success: function (data) {
                if (data.Success) {
                    var currentData = $(".favorite-item").filter("[data-itemid='" + itemId + "']");
                    if (value == "True") {
                        $(currentData[0]).addClass("favorite");
                        $(currentData[0]).attr("data-value", "False");
                        $(currentData[0]).attr("data-original-title", "[[[Remove from favorites]]]");
                    }
                    else {
                        $(currentData[0]).removeClass("favorite");
                        $(currentData[0]).attr("data-value", "True");
                        $(currentData[0]).attr("data-original-title", "[[[Mark as favorite]]]");
                    }
                    if ($("#item-grid-container").data("gridName") === "dashboards") {
                        var dashboardScope = angular.element(document.getElementById("server-items-container")).scope();
                        gridObj.model.query._params.push({
                            key: "displayCategory",
                            value: dashboardScope.itemRequestType
                        });

                    }
                    if (dashboardScope.itemRequestType == "100") {
                        gridObj.model.filterSettings.filteredColumns = [{ field: "CategoryName", operator: "equal", value: dashboardScope.category }];
                    }
                    gridObj.refreshContent();
                }
                else {
                    messageBox("", "[[[Unable to update favorite]]]", "[[[Internal server error. Please try again.]]]", "success", function () {
                        onCloseMessageBox();
                    });
                }
            }
        });
    });

    $(window).resize(function () {
        var versionDialogObj = $("#version-window-container").data("ejDialog");
        if (versionDialogObj != null && versionDialogObj.isOpened()) {
            versionDialogObj._dialogPosition();
        }
        var gridObj = $("#items").data("ejGrid");
        if (gridObj != null) {
            if (window.innerWidth < 1041) {
                gridObj.hideColumns("Description");
                gridObj.hideColumns("Last Modified");
            } else {
                gridObj.showColumns("Description");
                gridObj.showColumns("Last Modified");
            }
            if ($("#clear-search").css("display") == "block" || $("#clear-search").css("display") == "inline-block") {
                $("#search-items").css("display", "block");
            }
            $(".item-list-panel").css("height", window.innerHeight - $("#header-area").outerHeight());
            $("#create-new-category").css("width", $(".item-list-panel").outerWidth());

            var gridHeight = $(window).height() - ($(".item-navigation").outerHeight() + $("#header-area").outerHeight() + $("#category-listing").outerHeight());

            gridObj.option({ scrollSettings: { height: gridHeight } });

            if (!$(".su-sidebar-collapse").is(":visible")) {
                $("#item-viewer").css({ "height": $(window).height() - $("#header-area").outerHeight() - $("#base-footer-div").outerHeight(), "width": $(window).width() - $("#main-nav").width() - $(".su-sidebar-expand.category-collapse").width(), "top": $("#header-area").height() });
                return false;
            }
            else {
                $("#item-viewer").css({ "height": $(window).height() - $("#header-area").outerHeight() - $("#base-footer-div").outerHeight(), "width": $(window).width() - $("#main-nav").width() - $(".item-list-panel").width() });
                return false;
            }
        }
    });

    $(window).load(function () {
        refreshScrollerForCategory();
    });

    $(document).on("click", "#make-public", function (e) {
        $("#item_name").html($(this).attr("data-name"));
        itemUrl = $(this).attr("data-url");
        var itemId = $(this).attr("data-item-id");
        var itemName = $(this).attr("data-name");
        var itemTypeId = $(this).attr("data-itemtype");
        var itemType = $(this).attr("data-item-type").trim();
        var unlistedcode = "";
        var isPublic = $(this).attr("ispublic");
        var isUnlisted = $(this).attr("data-isunlisted");
        $("#make_item_public_wrapper").ejWaitingPopup("show");
        $.ajax({
            type: "POST",
            url: makeItemPublicUrl,
            data: { itemId: itemId, itemTypeId: itemTypeId, itemName: itemName, isPublic: isPublic, isUnlisted: isUnlisted },
            success: function (data) {
                if (data.validation && data.result) {
                    onPrivacySettingsDialogClose();
                    onMakePublicDialogClose();
                    onGetLinkDialogOpen(unlistedcode);
                    $(".report-name").html(itemName);
                    $(".report-name").attr("data-original-title", itemName);
                    $("." + itemType.toLowerCase() + "-link").show();
                    $(".private-note").hide();
                    $(".unlist-note").hide();
                    $(".public-note").show();
                    $("#item-link-copy").tooltip();
                    var maxIndex = getMaxZIndex() + 2;
                    $("#get_item_link a.PopupClose").trigger('mouseover').mouseover(function () { $(".tooltip").css("z-index", maxIndex); });
                    $("#get_item_link .report-name").trigger('mouseover').mouseover(function () { $(".tooltip").css("z-index", maxIndex); });
                    $("#change-privacy").attr("data-ispublic", true);
                    $("#change-privacy").attr("data-isunlisted", false);
                    ResetGrid();
                } else {
                    $("#makepublicitem").hide();
                    $("#select-area").hide();
                    $("#close").show();
                    $(".error-msg").show();
                    ResetGrid();
                }
                $("#make_item_public_wrapper").ejWaitingPopup("hide");
            }
        });
    });

    $(document).on("click", "#remove-public", function (e) {
        $("#item_name").html($(this).attr("data-name"));
        itemUrl = $(this).attr("data-url");
        var itemId = $(this).attr("data-item-id");
        var itemName = $(this).attr("data-name");
        var itemTypeId = $(this).attr("data-itemtype");
        $("#remove_item_public_wrapper").ejWaitingPopup("show");
        $.ajax({
            type: "POST",
            url: removeItemPublicUrl,
            data: { itemId: itemId, itemTypeId: itemTypeId, itemName: itemName },
            success: function (data) {
                if (data.validation && data.result) {
                    $("#removepublicitem").hide();
                    $("#remove-select-area").hide();
                    $("#remove-close").show();
                    $("#success-msg").show();
                    $("#change-privacy").attr("data-ispublic", false);
                    ResetGrid();
                } else {
                    $("#removepublicitem").hide();
                    $("#remove-select-area").hide();
                    $("#success-msg").hide();
                    $("#remove-close").show();
                    $("#error-msg").show();
                    ResetGrid();
                }
                onPrivacySettingsDialogClose();
                $("#remove_item_public_wrapper").ejWaitingPopup("hide");
            }
        });
    });

    $(document).on("click", ".get-link", function (e) {
        itemUrl = $(this).attr("data-url").trim();
        var itemType = $(this).attr("data-itemtype").trim();
        if (itemType.toLowerCase() == "2") {
            $(".dashboard-link").show();
        }
        else if (itemType.toLowerCase() == "6") {
            $(".file-link").show();            
            $("#compressed-link").prop("checked", true);
        }
        else if (itemType.toLowerCase() == "8") {
            $(".widget-link").show();
        }
        else {
            $(".link").show();
        }

        var shareUrl = "";

        var itemName = $(this).attr("data-name");
        var isPublic = $(this).attr("ispublic");
        var isUnlisted = $(this).attr("data-isunlisted");
        var unlistedCode = $(this).attr("data-unlistedCode");

        var itemId = $(this).attr("data-item-id");

        var iframe = document.getElementById("dashboard_render_iframe");

        if (iframe != null) {
            var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
            var renderedDashboard = $(innerDoc).find("#favorite_Item").attr("data-item-id");
            var parentDashbaord = $(innerDoc).find("#favorite_Item").attr("data-parent-id");
            var dashboardQuery = "";
            if (parentDashbaord !== "" && parentDashbaord !== undefined) {
                dashboardQuery = "tab=" + document.getElementById("dashboard_render_iframe").contentWindow.$("#dashboard").data("ejDashboardViewer").getCurrentTab().tabName.trim();
            }
            if ($(innerDoc).find("#favorite_Item").length > 0 && document.getElementById("dashboard_render_iframe").contentWindow.getcurrentfilters() !== null) {
                dashboardQuery += (dashboardQuery === "" ? "" : "&") + document.getElementById("dashboard_render_iframe").contentWindow
                    .getcurrentfilters().encryptedData;
            }

            if ((renderedDashboard === itemId || parentDashbaord === itemId) && dashboardQuery !== "") {
                if (browser.name.toLowerCase() === "msie") {
                    shareUrl = window.location.href.replace(window.location.pathname + window.location.search, "") +
                        itemUrl.trim() +
                        "?" +
                        dashboardQuery;
                    if (isUnlisted == "true") {
                        shareUrl += (dashboardQuery === "" ? "?unlistedCode=" : "&unlistedCode=") + unlistedCode;
                    }
                } else {
                    shareUrl = window.location.origin + itemUrl + "?" + dashboardQuery;
                    if (isUnlisted == "true") {
                        shareUrl += (dashboardQuery === "" ? "?unlistedCode=" : "&unlistedCode=") + unlistedCode;
                    }
                }
            } else {
                if (browser.name.toLowerCase() === "msie") {
                    shareUrl = window.location.href.replace(window.location.pathname + window.location.search, "") +
                        itemUrl.trim();
                    if (isUnlisted == "true") {
                        shareUrl += "?unlistedCode=" + unlistedCode;
                    }
                }
                else {
                    shareUrl = window.location.origin + itemUrl;
                    if (isUnlisted == "true") {
                        shareUrl += "?unlistedCode=" + unlistedCode;
                    }

                }
            }
        }
        else {
            if (browser.name.toLowerCase() === "msie") {
                shareUrl = window.location.href.replace(window.location.pathname + window.location.search, "") +
                    itemUrl.trim();
                if (isUnlisted == "true") {
                    shareUrl += "?unlistedCode=" + unlistedCode;
                }
            }
            else {
                shareUrl = window.location.origin + itemUrl;
                if (isUnlisted == "true") {
                    shareUrl += "?unlistedCode=" + unlistedCode;
                }
            }
        }
        
        $("#get_item_link").ejDialog("open");
        $("#get_item_link").show();
        $("#get_item_link_wrapper").ejWaitingPopup("show");
        $(".get_link").show();
        if (isPublic == "true") {
            $(".private-note").hide();
            $(".unlist-note").hide();
            $(".public-note").show();
        }
        else if (isUnlisted == "true") {
            $(".private-note").hide();
            $(".public-note").hide();
            $(".unlist-note").show();
        }
        else {
            $(".private-note").show();
            $(".public-note").hide();
            $(".unlist-note").hide();
        }
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
            var maxIndex = getMaxZIndex() + 2;
            $("#get_item_link a.PopupClose").trigger('mouseover').mouseover(function () { $(".tooltip").css("z-index", maxIndex); }).trigger('mouseout');
            $("#get_item_link .report-name").removeAttr("title");
            $("#get_item_link .report-name").trigger('mouseover').mouseover(function () { $(".tooltip").css("z-index", maxIndex); }).trigger('mouseout');
        }
        $(".report-name").html(itemName);
        $(".report-name").attr("data-original-title", itemName);
        
        $("#item-link").val(shareUrl);
        
        $("#item-link").select();
        $(".modal-footer .validation-area").css("display", "block");
        $("#get_item_link_wrapper").ejWaitingPopup("hide");
    });

    $(document).on("click", "#compressed-link", function () {
        var link = $("#item-link").val().split("?")[0];
        if ($(this).prop("checked") == true) {
            link += "?compress=true";
        }
        $("#item-link").val(link);
        $(".update-link").css("visibility", "visible");
        if (timer != 0) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            $(".update-link").css("visibility", "hidden");
            timer = 0;
        }, 7000);
    });

    $(document).on("click", ".embed-code", function (e) {
        itemUrl = $(this).attr("data-url").trim();
        var itemType = $(this).attr("data-itemtype").trim();
        var itemName = $(this).attr("data-name");
        var windowHeight = $(window).height();
        var dialogHeight = $("#get-embed-code_wrapper").height();
        var differenceheight = windowHeight - dialogHeight;
        if (differenceheight < 0) {
            ($("#get-embed-code_wrapper").css({ 'height': "300px", 'overflow-y': "scroll" }));
        }

        $("#get-embed-code").ejDialog("open");
        $("#get-embed-code").show();
        if (/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)) {
            $("#item-embed-link-copy").removeClass("su su-copy");
            $("#item-embed-link-copy").hide();
            $("#item-embed-link").css({ width: "100%", borderRadius: "4px" });
            $("#item-embed-link-copy").attr("data-original-title", "");
        }
        else {
            $("#item-embed-link-copy").tooltip({
                animation: false
            });
            var maxIndex = getMaxZIndex() + 2;
            $("#get-embed-code a.PopupClose").trigger('mouseover').mouseover(function () { $(".tooltip").css("z-index", maxIndex); });
            $("#get-embed-code .report-name").removeAttr("title");
            $("#get-embed-code .report-name").trigger('mouseover').mouseover(function () { $(".tooltip").css("z-index", maxIndex); });
        }
        $(".report-name").html(itemName);
        $(".report-name").attr("data-original-title", itemName);
        if (itemType.toLowerCase() == "8") {
            var embedLink = itemUrl.replace('/widgets/', '/widgets/embed/');
            if (browser.name.toLowerCase() == "msie") {
                linkUrl = window.location.href.replace(window.location.pathname + window.location.search, "") + embedLink + "?hascomments=true&hassso=false";
            }
            else {
                linkUrl = window.location.origin + embedLink + "?hascomments=true&hassso=false";
            }
            $(".enable-view-div").css("display", "none");
        }
        else {
            var embedLink = itemUrl.replace('/dashboards/', '/dashboards/embed/');
            if (browser.name.toLowerCase() == "msie") {
                linkUrl = window.location.href.replace(window.location.pathname + window.location.search, "") + embedLink + "?hascomments=true&hasviews=true&hassso=false";
            }
            else {
                linkUrl = window.location.origin + embedLink + "?hascomments=true&hasviews=true&hassso=false";
            }
            $(".enable-view-div").css("display", "inline");
        }
        if ($(this).attr("data-isunlisted") == "true") {
            linkUrl = linkUrl + "&unlistedCode=" + $(this).attr("data-unlistedcode");
        }

       $("#enable-comment,#enable-view").prop("checked", true);
        $("#enable-SSO").prop("checked", false);
        $(".modal-footer .validation-area").css("display", "block");
        var embedUrl = "<iframe id='frame-div' width='100%' height='100%' frameborder='0' src='" + linkUrl + "'></iframe>";
        $("#item-embed-link").val(embedUrl);
        $("#item-embed-link").select();
        $("#item-embed-link").focus();
        $(".options select").removeClass("current-select");
        $(".SSO-dropdown").css("visibility","hidden");
        $(".bs-searchbox").css("display", "none");
    });

    $(document).on("click", "#create-datasource-connection, .create-datasource-connection", function (e) {        
        if (window.datasourceQueryString != null && window.datasourceQueryString != undefined && window.datasourceQueryString != "") {
            $("#create-connection-iframe").attr("src", createDatasourceIframeUrl + "?" + window.datasourceQueryString);
        }
        else {
            $("#create-connection-iframe").attr("src", createDatasourceIframeUrl);
        }
        $("#connection-header").addClass("display-none");
        $("#create-connection-popup").removeClass("display-none");
        $("#create-connection-popup").ejDialog("open");
        $("#create-connection-popup_wrapper #create-connection-popup #create-connection-iframe").css("height", $(window).height() - 44);
        $("#create-connection-popup_wrapper").ejWaitingPopup("show");
    });
});

function onSuccessDeleteItem() {
    var gridObj = $("#items").data("ejGrid");
    gridObj.model.sortSettings.sortedColumns = [];
    gridObj.model.filterSettings.filteredColumns = [];
    $("#search-items").find("input[type=text]").val('');
    var currentPage = gridObj.model.pageSettings.currentPage;
    var pageSize = gridObj.model.pageSettings.pageSize;
    var totalRecordsCount = gridObj.model.pageSettings.totalRecordsCount;
    var lastPageRecordCount = gridObj.model.pageSettings.totalRecordsCount % gridObj.model.pageSettings.pageSize;

    if (lastPageRecordCount != 0 && lastPageRecordCount <= 1) {
        gridObj.model.pageSettings.currentPage = currentPage - 1;
    }

    if ($("#item-grid-container").attr("data-grid-name").toLowerCase() === "dashboards") {
        var dashboardScope = parent.angular.element(parent.document.getElementById("server-items-container")).scope();
        gridObj.model.query._params.push({
            key: "displayCategory",
            value: dashboardScope.itemRequestType
        });
    }

    gridObj.refreshContent();
    $("#dashboard_render_iframe").attr("src", "");
    $("#iframe-content").css("display", "block");
}
function onNewFileDialogOpen() {
    $("#file-popup-iframe").attr("src", addFileIframeUrl);
}

function onSchedulerDialogClose() {
    $("#popup-container").find("iframe").contents().find("html").html("");
}

function onSchedulerDialogOpen() {
    $("#scheduler-popup-iframe").attr("src", schedulerIframeUrl + "?itemName=" + ItemName + "&&itemId=" + ItemId + "&&categoryName=" + CategoryName + "&&categoryId=" + CategoryId + "&&scheduleId=" + ScheduleId + "&&multiDashboardName=" + MultiDashboardName + "&&actionType=Create");
    $("#popup-container_wrapper").ejWaitingPopup("show");
}
function onNewFileDialogClose() {
    $("#file-popup").find("iframe").contents().find("html").html("");
    $("#file-popup").ejDialog("close");
}

function onDashboardDialogClose() {
    $("#report_popup").find("iframe").contents().find("html").html("");
}

function openNewDataSourcePopup() {
    $("#datasource-popup-iframe").addClass("add-datasource-frame");
    $("#datasource-popup").ejDialog("open");
    $("#datasource-popup_wrapper").ejWaitingPopup("show");
}

function openNewCategoryPopup() {
    $("#AddCategoryPopup").ejDialog("open");
    $("#AddCategoryPopup_wrapper").ejWaitingPopup("show");
}

function openNewFilePopup() {
    $("#file-popup").ejDialog("open");
    $("#file-popup_wrapper").ejWaitingPopup("show");
}

function onCategoryDialogOpen() {
    $("#AddCategoryPopup_iframe").attr("src", addCategoryIframeUrl);
}

function onCategoryDialogBoxClose() {
    $("#AddCategoryPopup").find("iframe").contents().find("html").html("");
    $("#AddCategoryPopup").ejDialog("close");
}

function onDataSourceDialogOpen() {
    $("#datasource-popup-iframe").attr("src", addDatasourceIframeUrl).addClass("add-datasource-frame");
}

function onDataSourceDialogClose() {
    $("#datasource-popup").find("iframe").contents().find("html").html("");
    $("#datasource-popup").ejDialog("close");
}

function onWidgetDialogOpen() {
    $("#widget_popup_iframe").attr("src", addWidgetUrl);
}

function onWidgetDialogClose() {
    $("#widget_popup").find("iframe").contents().find("html").html("");
    $("#widget_popup").ejDialog("close");
}

function onDeleteItemDialogClose() {
    $("#item-delete-confirmation").ejDialog("close");
}

function onDeleteItemDialogOpen() {
    $("#item-delete-confirmation").ejDialog("open");
    $('#item-delete-confirmation').focus();
}

function onReportDialogOpen() {
    //$("#report_popup_wrapper").ejWaitingPopup("hide");
}

function openNewDashboardPopup() {
    $("#report_popup").ejDialog("open");
    $("#report_iframe").attr("src", addDashboardIframeUrl);
    $("#report_popup_wrapper").ejWaitingPopup("show");
}

function openNewWidgetPopup() {
    $("#widget_popup").ejDialog("open");
    $("#widget_popup_wrapper").ejWaitingPopup("show");
}

function fnActionBegin(args) {

    var datagridName = $("#item-grid-container").data("gridName");
    if (datagridName.toLowerCase() === "dashboards" || datagridName.toLowerCase() === "widgets") {
        if (args.requestType == "refresh" && !this.initialRender)
            $("#items").find(".e-gridcontent").css("visibility", "hidden");

        if ($('#server-items-container .category-collapse').css('display') == 'none') {
            $("#item-grid-container").ejWaitingPopup("show");
        }
    }

    var searchValue = "";
    if ($("#search-home-page").is(":visible")) {
        searchValue = $("#search-home-page").val();
    }
    else {
        if (datagridName.toLowerCase() == "schedules") {
            searchValue = $("#search-schedules").val();
        } else {
            searchValue = $("#search-items").val();
        }
    }
    if (searchValue !== "Search") {
        this.model.query._params.push({ key: "searchKey", value: searchValue });
    }
    var filerSettings = [], i;

    if (args.model.filterSettings.filteredColumns.length > 0) {
        for (i = 0; i < args.model.filterSettings.filteredColumns.length; i++) {
            var column = args.model.filterSettings.filteredColumns[i];
            filerSettings.push({ "PropertyName": column.field, "FilterType": column.operator, "FilterKey": column.value });
           
        }
        this.model.query._params.push({ key: "filterCollection", value: filerSettings });
    }
    if (datagridName === "dashboards" || datagridName === "widgets") {
        var dashboardScope = angular.element(document.getElementById("server-items-container")).scope();
        args.model.query._params.push({
            key: "displayCategory",
            value: dashboardScope.itemRequestType

        });
    }
}

function fnActionComplete(args) {
    $("#item-list-panel > .item-navigation, #item-list-panel > #category-listing").css("visibility", "visible");
    $("[data-toggle='tooltip']").tooltip();
    var gridObj = $("#items").data("ejGrid");
    if (gridObj._gridRecordsCount == 0) {
        if (gridName = $('#item-grid-container').attr("data-grid-name") == 'datasources') {
            var message = "";
            message = "[[[No datasources available to display]]]";
            $("#server-app-container").addClass("avoid-overflow");
        }
        else if (gridName = $('#item-grid-container').attr("data-grid-name") == 'files') {
            var message = "";
            message = "[[[No files available to display]]]";
        }
        else
        {
            $("#server-app-container").removeClass("avoid-overflow");
            var message = "";
            if ($("ul.item-navigation li.active").attr("data-section").toLowerCase() == 'favorite dashboards') {
                message = "[[[No favorite dashboards available to display]]]";
            }
            else if ($("ul.item-navigation li.active").attr("data-section").toLowerCase() == 'recent dashboards') {
                message = "[[[No recent dashboards available to display]]]";
            }
            else if ($("ul.item-navigation li.active").attr("data-section").toLowerCase() == 'public dashboards') {
                message = "[[[No public dashboards available to display]]]";
            }
            else if ($("ul.item-navigation li.active").attr("data-section").toLowerCase() == 'all dashboards') {
                message = "[[[No dashboards available to display]]]";
            }
            else if ($("ul.item-navigation li.active").attr("data-section").toLowerCase() == 'all widgets') {
                message = "[[[No widgets available to display]]]";
            }
            else if ($("ul.item-navigation li.active").attr("data-section").toLowerCase() == 'public widgets') {
                message = "[[[No public widgets available to display]]]";
            }
            else if ($("ul.item-navigation li.active").attr("data-section").toLowerCase() == 'all categories') {
                message = "[[[No dashboards available to display]]]";
            }
            else if ($("ul.item-navigation li.active").attr("data-section").toLowerCase() == 'draft dashboards') {
                message = "[[[No drafts available to display]]]";
            }
        }
         this.getContentTable().find("tbody .emptyrecord").html(message);
    }
    var gridName = $('#item-grid-container').attr("data-grid-name");
    var publicWidget = $("ul.item-navigation li.public-widgets").hasClass("active");
    var publicDashboard = $("ul.item-navigation li.public-items").hasClass("active");
    var isMarkItemsPublic = $("#isMarkItemspublic").val();
    if (gridName.toLowerCase() == "dashboards" || gridName.toLowerCase() == "widgets") {
        if (!navigator.userAgent.match(/Windows Phone/i)) { // To avoid tooltips in windows phone.
            $("[data-toggle='tooltip']").tooltip();
        }

        if ($(".e-content").height() != $(".e-scrollbar").height()) {
            $(".e-scrollbar .e-vscroll").css("height", $(".e-content").height());
        }

        if ($("#items .e-gridcontent").data("ejScroller"))
            $("#items .e-gridcontent").ejScroller("refresh");

        if ($("ul.item-navigation li.active").length > 0 && $("ul.item-navigation li.active").attr("data-section").toLowerCase() == 'draft dashboards') {
            $(".item-link").each(function () {
                $(this).attr("href", $(this).attr("data-culture") + "/dashboard-designer/" + $(this).attr("data-itemid") + "/draft/" + $(this).attr("data-name"));
            });
        }
        else if (gridName.toLowerCase() == "dashboards" && window.innerWidth >= 1041) {
            $(".item-link").each(function () {
                $(this).attr("href", $(this).attr("data-culture") + "/dashboards?category=" + $(this).attr("data-category-name") + "&dashboard=" + $(this).attr("data-name") + "&view=" + $(".item-navigation li.active").attr("data-value"));
            });
        }

        var gridHeight = $(window).height() - ($(".item-navigation").outerHeight() + $("#header-area").outerHeight() + $("#category-listing").outerHeight());

        gridObj.option({ scrollSettings: { height: gridHeight } });
        if (publicWidget == true && gridObj._gridRecordsCount > 0 && isMarkItemsPublic == "False") {
            $(".tool-tip").show();
        }
        else if (publicDashboard == true && gridObj._gridRecordsCount > 0 && isMarkItemsPublic == "False") {
            $(".tool-tip").show();
        }
        else {
            $(".tool-tip").hide();
        }
        setTimeout(function () { $("#item-grid-container").ejWaitingPopup("hide"); }, 500);

        $(".tooltip").hide();
    }
    if (args.requestType == "refresh" && !this.initialRender)
        $("#items").find(".e-gridcontent").css("visibility", "visible");
}

function rowBound() {
    if (isFirstRequest) {
        isFirstRequest = false;
        if (location.pathname.toLowerCase() === "/" || location.pathname.split("/")[location.pathname.split("/").length - 1].toLowerCase() == "dashboards") {
            refreshScroller();
        }
    }
}

$(document).on("click", ".category-link", function (e) {
    $('.e-filtericon').removeClass('e-filteredicon e-filternone');
    e.preventDefault();
});

$(document).on("click", ".item-navigation li:not(:last)", function (e) {
    e.preventDefault();
    var gridObj = $("#items").data("ejGrid");
    if ($(this).hasClass("active") == false) {
        $(".item-navigation li").removeClass("active");
        $(this).addClass("active");
    }
    if ($(this).hasClass("all-items")) {
        $("#category-listing").addClass("category-section");
    }
    else {
        $("#category-listing").removeClass("category-section");
    }

    var gridHeight = $(window).height() - ($(".item-navigation").outerHeight() + $("#header-area").outerHeight() + $("#category-listing").outerHeight());
    var gridObj = $("#items").data("ejGrid");
    gridObj.option({ scrollSettings: { height: gridHeight } });

    var url = $(this).attr("href");
    var currentUrl = window.location.pathname + window.location.search;
    if (currentUrl != url && window.innerWidth >= 1041) {
        if (history.pushState != undefined && $("#item-grid-container").data("gridName") === "dashboards") {
            history.pushState({}, "", url);
        }
    }
});

$(document).on("click", ".popup-close", function () {
    window.parent.$("#item-delete-confirmation").ejDialog("close");
});

$(document).on("click", "#open-dashboard, #open-widget", function (e) {
    if ($(this).attr("id") == "open-dashboard") {
        if ($(this).attr("data-href").indexOf("?") == -1) {
            window.open($(this).attr("data-href") + "?showmydashboards=1", "_blank");
        }
        else {
            window.open($(this).attr("data-href") + "&showmydashboards=1", "_blank");
        }
    }
    else {
        window.open($(this).attr("data-href"), "_blank");
    }
});

$(document).on("click", ".dashboard-sort-options, #order", function (e) {
    var orderChange;
    if ($(this).attr("id") != "order") {
        $('.dashboard-sort-options').removeClass("selected");
        $(this).addClass("selected");
    }

    $(this).parents("ul").prevAll().find("span.selected").text($(this).text()).attr("data-value", $(this).attr("data-value"));

    if (e.target.id == "order" || e.target.parentElement.id == "order") {
        orderChange = true;
        $(".sorting-icon.path1").toggleClass("opacity");
        $(".sorting-icon.path2").toggleClass("opacity");
    }

    var dashboardScope = angular.element(document.getElementById("server-items-container")).scope();

    var gridObj = $("#items").data("ejGrid");

    var fieldValue = $(".selected-field:visible").text().toLowerCase().trim();
    var orderValue = $("#order").attr("data-value").toLowerCase().trim();
    var order;
    if (orderChange) {
        if (orderValue == "descending") {
            order = "ascending";
        }
        else
            order = "descending";
    }
    else
        order = orderValue;
    $("#order").attr("data-value", order);

    if ($(".all-items").hasClass("active") && !$("#category-list").is(":visible")) {
        gridObj.model.filterSettings.filteredColumns = [{ field: "CategoryName", operator: "equal", value: $("#category-section-name").html() }];
        gridObj.model.sortSettings.sortedColumns = [{ field: $(".selected-field:visible").attr("data-value"), direction: order }];
        gridObj.refreshContent();
    }
    else if ($(".all-items").hasClass("active") && $("#category-list").is(":visible")) {
        var sorted = [{ name: $(".selected-field:visible").attr("data-value"), direction: order }];
        $.ajax({
            type: "POST",
            url: getCategoryItem,
            data: { sorted: sorted },
            success: function (data) {
                dashboardScope.$apply(function () {
                    dashboardScope.categories = data;
                });
            }
        });
    }
    else {
        gridObj.model.query._params.push({
            key: "displayCategory",
            value: dashboardScope.itemRequestType
        });
        gridObj.model.sortSettings.sortedColumns = [{ field: $(".selected-field:visible").attr("data-value"), direction: order }];

        gridObj.refreshContent();
    }
});

function ResetGrid() {
    var gridObj = $("#items").data("ejGrid");
    gridObj.model.sortSettings.sortedColumns = [];
    if (!$(".all-items").hasClass("active")) {
        gridObj.model.filterSettings.filteredColumns = [];
    }
    $("#search-items").find("input[type=text]").val('');
    gridObj.refreshContent();
    $(".e-filtericon").removeClass('e-filteredicon e-filternone');
}

$(document).on("click", ".search-item", function (e) {
    e.stopPropagation();
    if ($(".search-area").hasClass("add-background")) {
        if ($(".search-home-section").val() !== "") {
            $(".search-home-section").val("");
            if (!$("#category-list").is(":visible") || $("#category-list").length <= 0) {
                gridObj = $("#items").data("ejGrid");
                gridObj.model.pageSettings.currentPage = 1;
                gridObj.refreshContent();
            }
            else {
                $(".category").trigger("click");
            }
        }
        $(".search-area").removeClass("add-background");
        $(".placeholder, .close-icon").hide();
        if ($(".all-items").hasClass("active") && !$("#category-list").is(":visible")) {
            setTimeout(function() {
                $(".search-area").prevAll().show().parent().removeClass("pull-right");
                $("#category-section-name").show();
                var isMarkItemsPublic = $("#isMarkItemspublic").val();
                if (($("ul.item-navigation li.public-items").hasClass("active") || $("ul.item-navigation li.public-widgets").hasClass("active")) && $("#items").data("ejGrid")._gridRecordsCount > 0 && isMarkItemsPublic == "False") {
                    $(".tool-tip").show();
                }
                else
                {
                    $(".tool-tip").hide();
                }
            }, 300);
        }
        else {
            setTimeout(function() {
                $(".search-area").prevAll(":not(#back-icon)").show().parent().removeClass("pull-right");
                $("#category-section-name").show();
                var isMarkItemsPublic = $("#isMarkItemspublic").val();
                if (($("ul.item-navigation li.public-items").hasClass("active") || $("ul.item-navigation li.public-widgets").hasClass("active")) && $("#items").data("ejGrid")._gridRecordsCount > 0 && isMarkItemsPublic == "False") {
                    $(".tool-tip").show();
                }
                else
                {
                    $(".tool-tip").hide();
                }
            }, 300);
        }
        setTimeout(function () { $(".search-home-section:visible").removeClass("show"); }, 300);
    }
    else {
        $(".search-area").addClass("add-background");
        $(".placeholder").show();
        setTimeout(function () { $(".close-icon").show() }, 300);
        if ($(".all-items").hasClass("active") && !$("#category-list").is(":visible")) {
            $(".search-area").prevAll().hide().parent().addClass("pull-right");
            $("#category-section-name").hide();
            var isMarkItemsPublic = $("#isMarkItemspublic").val();
            if (($("ul.item-navigation li.public-items").hasClass("active") || $("ul.item-navigation li.public-widgets").hasClass("active")) && $("#items").data("ejGrid")._gridRecordsCount > 0 && isMarkItemsPublic == "False") {
                $(".tool-tip").show();
            }
            else {
                $(".tool-tip").hide();
            }
        }
        else {
            $(".search-area").prevAll(":not(#back-icon)").hide().parent().addClass("pull-right");
            $("#category-section-name").hide();
            var isMarkItemsPublic = $("#isMarkItemspublic").val();
            if (($("ul.item-navigation li.public-items").hasClass("active") || $("ul.item-navigation li.public-widgets").hasClass("active")) && $("#items").data("ejGrid")._gridRecordsCount > 0 && isMarkItemsPublic == "False") {
                $(".tool-tip").show();
            }
            else {
                $(".tool-tip").hide();
            }
        }
        $("#search-home-page").focus();
        setTimeout(function () { $(".search-home-section:visible").addClass("show"); }, 300);
    }
    setTimeout(function () { $(".clear-search").hide(); }, 300);
    return false;
});

$(document).on("click", ".schedule-dashboards", function () {
    ItemId = $(this).attr("data-item-id")
    ItemName = $(this).attr("data-itemname");
    CategoryName = $(this).attr("data-category-name");
    CategoryId = $(this).attr("data-category-id");
    ScheduleId = "";
    MultiDashboardName = $(this).attr("data-multidashboard-name");
    $("#popup-container").ejDialog("open");
});

$(document).on("click", "#create_schedule", function () {
    ItemId = "";
    ItemName = "";
    CategoryName = "";
    ScheduleId = "";
    CategoryId = "";
    MultiDashboardName = $(this).attr("data-multidashboard-name");;
    $("#popup-container").ejDialog("open");
});

function onMakePublicDialogClose() {
    $("#make_item_public").ejDialog("close");
}
function onMakePublicDialogOpen() {
    load();
    $("#make_item_public").ejDialog("open");
    $('#make_item_public').focus();
}
function onRemovePublicDialogClose() {
    $("#remove_item_public").ejDialog("close");
}
function onRemovePublicDialogOpen() {
    load();
    $("#remove_item_public").ejDialog("open");
    $('#remove_item_public').focus();
}
function onGetLinkDialogClose() {
    $("#get_item_link").ejDialog("close");
}
function onGetLinkDialogOpen(unlistedcode) {
    $("#get_item_link").ejDialog("open");
    $("#get_item_link").show();
    $('#get_item_link').focus();
    $("#item-link").select();
    $(".get_link").show();
    if (browser.name.toLowerCase() == "msie") {
        (unlistedcode != "") ? $("#item-link").val(window.location.href.replace(window.location.pathname + window.location.search, "") + itemUrl.trim() + "?unlistedCode=" + unlistedcode) : $("#item-link").val(window.location.href.replace(window.location.pathname + window.location.search, "") + itemUrl.trim());
    }
    else {
        (unlistedcode != "") ? $("#item-link").val(window.location.origin + itemUrl.trim() + "?unlistedCode=" + unlistedcode) : $("#item-link").val(window.location.origin + itemUrl.trim());
    }
    if (/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)) {
        $("#item-link-copy").removeClass("su su-copy");
        $("#item-link-copy").hide();
        $("#item-link-copy").attr("data-original-title", "");
    }
}

function fnAdjustRowHeight(args) {
    var gridName = $('#item-grid-container').attr("data-grid-name");
    if (gridName == "dashboards") {
        if (args.model.currentViewData.length == 0) {
            rowBound();
        }
    }
}


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

$(document).on("focusin", "#item-embed-link", function (e) {
    $("#item-embed-link").select();
});

$(document).on("click", "#item-embed-link-copy", function (e) {
    $("#item-embed-link").select();
    if (/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)) {
        $("#item-embed-link-copy").removeClass("su su-copy");
        $("#item-embed-link-copy").attr("data-original-title", "");
    }
    else {
        document.execCommand('copy');
        $("#item-embed-link-copy").attr("data-original-title", "[[[Copied]]]");
        $("#item-embed-link-copy").tooltip("hide").attr("data-original-title", "[[[Copied]]]").tooltip("fixTitle").tooltip("show");
        setTimeout(function () { $("#item-embed-link-copy").attr("data-original-title", "[[[Click to copy]]]"); $("#item-embed-link-copy").tooltip(); }, 3000);
    }
    $("#item-embed-link-copy").addClass("focus-div");
});

$(document).on("click", ".item-link", function (e) {
    e.preventDefault();
    var isDraft = $(this).attr("data-isdraft");
    if (isDraft.toLowerCase() == "true") {
        window.open($(this).attr("href"), "_self");
    }
    else {
        var iframe = document.getElementById("dashboard_render_iframe");
        if (window.innerWidth < 1041 || e.target.id == "open-dashboard" || e.target.id == "open-widget" || e.target.id == "context-menu" || $(e.target).hasClass("favorite-item")) {
            e.stopPropagation();
        }
        else {
            iframe.contentWindow.location.replace(decodeURI($(this).find("span").attr("data-href")));
            $("#item-viewer").ejWaitingPopup("show");
            $("#item-viewer").css({ "height": $(window).height() - $("#header-area").outerHeight() - $("#base-footer-div").outerHeight(), "width": $(window).width() - $("#main-nav").width() - $(".item-list-panel").width() });
            $("#iframe-content").css("display", "none");

            var url = $(this).attr("href");
            var currentUrl = window.location.pathname + window.location.search;
            if (currentUrl != url) {
                $("#current-url").attr("data-url", url);
                if (history.pushState != undefined && $("#item-grid-container").data("gridName") === "dashboards") {
                    history.pushState({}, "", url);
                }
            }
        }
        if ($(this).parents("td").hasClass("active") == false) {
            $(".item-link").parents("td").removeClass("active");
            $(this).parents("td").addClass("active");
        }
        else {
            if (window.innerWidth < 1041) {
                $(".item-link").parents("td").removeClass("active");
                $(".tooltip").hide();
            }
        }
    }
});

$(document).on("click", ".category-collapse", function (e) {
    if ($(".su-sidebar-collapse").is(":visible")) {
        $("#item-viewer").css("width", "100%");
        $(".item-list-panel, .su-sidebar-collapse").css({ "display": "none" });
        $(".su-sidebar-expand").css({ "display": "block" });
        $("#item-viewer").addClass("expanded");
        $("#item-viewer").css({ "height": $(window).height() - $("#header-area").outerHeight() - $("#base-footer-div").outerHeight(), "width": $(window).width() - $("#main-nav").width() - $(".su-sidebar-expand.category-collapse").width(), "top": $("#header-area").height() });
        var windowwidth = $("#dashboard_render_iframe").width();
        $("#dashboard_render_iframe").contents().find("#dashboard").css("width", windowwidth - 30);
        $("#item-viewer").ejWaitingPopup('refresh').css("width", windowwidth);
        return false;
    }
    else {
       if ($("#dashboard_render_iframe").contents().find("#dashboard-view-toogle").hasClass("dashboard-view-toogle")) {
          CloseDashboardView();
        }
       $("#dashboard_render_iframe").contents().find("#filter-view").hide();
       $("#dashboard_render_iframe").contents().find("#commentModuleContainer").addClass("displayNone")
       $("#dashboard_render_iframe").contents().find("ul.options").css("right", "0px")
       $("#item-viewer").css({ "left": "initial" });
       $("#dashboard_render_iframe").contents().find("ul.options li").removeClass("active");
       $("#item-viewer").css({"width": "70%"});
       $(".item-list-panel, .su-sidebar-collapse").css({ "display": "block" });
       $(".su-sidebar-expand").css({ "display": "none" });
       $("#item-viewer").removeClass("expanded");
       $("#item-viewer").css({ "height": $(window).height() - $("#header-area").outerHeight() - $("#base-footer-div").outerHeight(), "width": $(window).width() - $("#main-nav").width() - $(".item-list-panel").width() });
       var windowwidth = $("#dashboard_render_iframe").width();
       $("#dashboard_render_iframe").contents().find("#dashboard").css("width", windowwidth - 30);
       $("#item-viewer").ejWaitingPopup('refresh').css("width", windowwidth);
       return false;
    }
});

$(document).on('show.bs.dropdown', '#listing, #items .e-row', function () {
    if ($(this).find("#context-menu").length > 0) {
        var availableTopHeight = $(this).offset().top + $(this).outerHeight(true) / 2 - $("#header-area").outerHeight(true) - $(".item-navigation").outerHeight(true) - $("#category-listing").outerHeight(true);
        var availableBottomHeight = $(window).height() - $(this).offset().top - $(this).outerHeight(true) / 2;
        var dropDownHeight = $(this).find(".dashboard-options").outerHeight(true);
        if (availableBottomHeight <= dropDownHeight && availableTopHeight >= dropDownHeight) {
            $(this).find("#context-menu").removeClass("dropdown").addClass("dropup");
        }
    }

    if ($(this).hasClass("e-row")) {
        $(".item-link").each(function () {
            $(this).removeClass("active-category-setting");
            if ($(this).find(".open").length > 0) {
                $(this).addClass("active-category-setting");
            }
        });
    }
    else {
        $(".category-section").each(function () {
            $(this).removeClass("active-category-setting");
            if ($(this).find(".open").length > 0) {
                $(this).addClass("active-category-setting");
            }
        });
    }
    refreshScrollerForCategory();
});

$(document).on('hide.bs.dropdown', '#listing, #items .e-row', function () {
    if ($(this).find("#context-menu").length > 0) {
        $(this).find("#context-menu").removeClass("dropup").addClass("dropdown");
    }
    if ($(this).hasClass("e-row")) {
        $(".item-link").removeClass("active-category-setting");
    }
    else {
        $(".category-section").removeClass("active-category-setting");
    }
    refreshScrollerForCategory();
});

$(document).on('shown.bs.dropdown', '#scroll-content li, #items .e-row', function () {
    var gridName = $('#item-grid-container').attr("data-grid-name");
    if ($("#category-list").is(":visible")) {
        refreshScrollerForCategory();
        return false;
    }
    else if (gridName.toLowerCase() == "dashboards" || gridName.toLowerCase() == "widgets") {
        $(".e-gridcontent").ejScroller();
        $(".e-gridcontent").ejScroller("refresh");
    }
});

$(document).on('hidden.bs.dropdown', '#scroll-content li, #items .e-row', function () {
    var gridName = $('#item-grid-container').attr("data-grid-name");
    if ($("#category-list").is(":visible")) {
        refreshScrollerForCategory();
        return false;
    }
    else if (gridName.toLowerCase() == "dashboards" || gridName.toLowerCase() == "widgets") {
        $(".e-gridcontent").ejScroller();
        $(".e-gridcontent").ejScroller("refresh");
    }
});

$(document).on('mouseenter', ".category-section, #items .e-row", function () {
    if ($(this).hasClass("e-row")) {
        $(".item-link").each(function () {
            $(this).removeClass("active-category-setting");
            if ($(this).find(".open").length > 0) {
                $(this).addClass("active-category-setting");
            }
        });
    }
    else {
        $(".category-section").each(function () {
            $(this).removeClass("active-category-setting");
            if ($(this).find(".open").length > 0) {
                $(this).addClass("active-category-setting");
            }
        });
    }
});

$(document).on('mouseleave', ".category-section, #items .e-row", function () {
    if ($(this).hasClass("e-row")) {
        $(".item-link").each(function () {
            $(this).removeClass("active-category-setting");
            if ($(this).find(".open").length > 0) {
                $(this).addClass("active-category-setting");
            }
        });
    }
    else {
        $(".category-section").each(function () {
            $(this).removeClass("active-category-setting");
            if ($(this).find(".open").length > 0) {
                $(this).addClass("active-category-setting");
            }
        });
    }
});

$(document).on('mouseenter', "#open-dashboard, #open-widget", function () {
    $(this).parents("a").tooltip('hide');
});

$(document).on('mouseleave', "#open-dashboard, #open-widget", function () {
    $(this).parents("a").tooltip('show');
});

$(document).on("mouseover", ".dashboard-views", function () {
    var itemId = $(this).find(".views").attr("data-item-id");
    var loadViews = $(this).attr("data-load");
    var element = $(this).find("ul");
    var options = "";
    var isChildDashboard = $(this).find(".views").attr("data-is-childdashboard");
    var parentCategoryName = $(this).find(".views").attr("data-parent-category-name");
    var parentDashboardName = $(this).find(".views").attr("data-parent-itemname");
    var childDashboardName = isChildDashboard != undefined && isChildDashboard.toLowerCase() == "true" ? $(this).find(".views").attr("data-child-dashboard-name") : "";

    if (loadViews == "true") {
        $(this).attr("data-load", false);
        $(".dashboard-views").addClass("views-loader");
        $.ajax({
            type: "POST",
            url: getViewsByItemIdUrl,
            data: { itemId: itemId },
            success: function (data) {
                if (data != null && data.result != null && data.result.length > 0) {
                    if (isChildDashboard != undefined && isChildDashboard != null && isChildDashboard.toLowerCase() == "true") {
                        for (i = 0; i < data.result.length; i++) {
                            options += "<li><a class='view-name' href='" + dashboards + "/" + parentCategoryName + "/" + parentDashboardName + "?tab=" + childDashboardName + "&viewid=" + data.result[i].ViewId + "' target='_blank' data-toggle='tooltip' data-placement='top' data-original-title='" + data.result[i].ViewName + "' data-itemid='" + data.result[i].ItemId + "'>" + data.result[i].ViewName + "</a></li>";
                        }
                    }
                    else {
                        for (i = 0; i < data.result.length; i++) {
                            options += "<li><a class='view-name' href='" + dashboards + "/" + data.result[i].CategoryName + "/" + data.result[i].ItemName + "?viewid=" + data.result[i].ViewId + "' target='_blank' data-toggle='tooltip' data-placement='top' data-original-title='" + data.result[i].ViewName + "' data-itemid='" + data.result[i].ItemId + "'>" + data.result[i].ViewName + "</a></li>";
                        }
                    }
                } else {
                    options = "<li><span class='view-name' href='javascript:void(0);'><span>[[[No Views found]]]</span></span></li>";
                }
                element.html(options);
                $(".dashboard-views").removeClass("views-loader");
                $(".dashboard-views").addClass(".no-loader");
                $('[data-toggle="tooltip"]').tooltip();
            }
        });
    }
});

$(document).on("mouseleave", ".dropdown .dashboard-views", function () {
    $(this).attr("data-load", "true");
});

$(document).on("click", ".dashboard-options li > span", function (e) {
    e.stopPropagation();
    return false;
});

$(document).on("click", ".download-item", function (e) {
    window.location = $(this).attr("href");
});

$(document).on("click", ".open-item", function (e) {
    var url = $(this).attr("href");
    window.open(url, "_blank");
});

$(document).on("click", ".option-click", function () {
    $(this).closest(".dropdown-menu").prev().dropdown("toggle");
});

$(document).on("click", ".dropdown-backdrop", function (e) {
    e.stopPropagation();
    return false;
});


$(document).on("show.bs.tooltip", function () {
    $(".tooltip").not(this).hide();
});

//To hide the dropdown after selecting options
$(document).on("mouseleave", ".designer-page-views, .edit-dashboard-option", function () {
    $(".designer-page-views").hide();
});

$(document).on("mouseover", ".designer-page-views, .edit-dashboard-option", function () {
    $(".designer-page-views").show().focus();
});

//Web Designer option in "Edit"
$(document).on("click", ".web-designer", function (e) {
    window.location.href = $(this).attr("href");
});

function DashboardRender(absolutePath, category, itemName, section, tabName) {
    absolutePath = decodeURI(absolutePath);
    category = decodeURI(category);
    itemName = decodeURI(itemName);
    tabName = decodeURI(tabName);

    var query = window.location.search.substring(1);
    var vars = query.split("&");
    var queryStringUrl = "?";
    for(var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] !== "category" && pair[0] !== "dashboard" && pair[0] !== "view") {
            if (i !== vars.length - 1) {
                queryStringUrl += pair[0] + "=" + pair[1] + "&";
            } else {
                queryStringUrl += pair[0] + "=" + pair[1];
            }            
        }
    }

    var iFrame = document.getElementById("dashboard_render_iframe");
    tabName = tabName != "" && tabName != null && tabName != "null" ? "?tab=" + tabName : "";
    $("#current-url").attr("data-url", absolutePath + "?category=" + category + "&dashboard=" + itemName + "&view=" + section);
    if (iframeUrl == parentUrl) {
        culture = parent.$("#dropdown-lang span").attr("title");
    }
    else {
        culture = $("#dropdown-lang span").attr("title");
    }
    if ($(".item-navigation li[data-value='" + section + "']").hasClass("active") == false) {
        $(".item-navigation li").removeClass("active");
        $(".item-navigation li[data-value='" + section + "']").addClass("active");
        
        var dashboardScope = parent.angular.element(parent.document.getElementById("server-items-container")).scope();
        dashboardScope.onClickDisplayCategory("", section);
    }

    if ($(".item-navigation li[data-value='" + section + "']").hasClass("all-items")) {
        $("#category-listing").addClass("category-section");
    }
    else {
        $("#category-listing").removeClass("category-section");
    }
    
    if (section == "categories") {
        var dashboardScope = parent.angular.element(parent.document.getElementById("server-items-container")).scope();
        dashboardScope.getItemsInCategory("", category);

        $("#search-home-page").focus();
        setTimeout(function () { $(".search-home-section:visible").addClass("show"); }, 300);
        iFrame.contentWindow.location.replace(absolutePath + "/" + category + "/" + itemName + queryStringUrl);
        $("#item-viewer").ejWaitingPopup("show");
        $("#item-viewer").css({ "height": $(window).height() - $("#header-area").outerHeight() - $("#base-footer-div").outerHeight(), "width": $(window).width() - $("#main-nav").width() - $(".item-list-panel").width() });
        $("#iframe-content").css("display", "none");
    }
    else if ((itemName != "")) {
        $("#search-home-page").focus();
        setTimeout(function () { $(".search-home-section:visible").addClass("show"); }, 300);
        iFrame.contentWindow.location.replace(absolutePath + "/" + category + "/" + itemName + queryStringUrl);
        $("#item-viewer").ejWaitingPopup("show");
        $("#item-viewer").css({ "height": $(window).height() - $("#header-area").outerHeight() - $("#base-footer-div").outerHeight(), "width": $(window).width() - $("#main-nav").width() - $(".item-list-panel").width() });
        $("#iframe-content").css("display", "none");
    }

    if ($(".item-navigation li").hasClass("all-items")) {
        $("#category-listing").addClass("category-section");
    }
    else {
        $("#category-listing").removeClass("category-section");
    }

    var currentItem = $(".item-link[data-name='" + itemName + "']");
    if (currentItem.parents("td").hasClass("active") == false) {
        $(".item-link").parents("td").removeClass("active");
        currentItem.parents("td").addClass("active");
    }
    else {
        if (window.innerWidth < 1041) {
            $(".item-link").parents("td").removeClass("active");
            $(".tooltip").hide();
        }
    }

    if ($('#server-items-container .category-collapse').css('display') == 'block') {
        $("#item-viewer").css("width", "100%");
        $("#item-viewer").addClass("expanded");
        $("#item-viewer").css({ "height": $(window).height() - $("#header-area").outerHeight() - $("#base-footer-div").outerHeight(), "width": $(window).width() - $("#main-nav").width() - $(".su-sidebar-expand.category-collapse").width(), "top": $("#header-area").height() });
        var windowwidth = $("#dashboard_render_iframe").width();
        $("#dashboard_render_iframe").contents().find("#dashboard").css("width", windowwidth - 30);
    }

    return false;
}
var changes = 1;
var linkUrl = "";
var timer;
$(document).on("click", ".item-enabler", function () {
    var url = "";
    
    url = linkUrl;
    var getId = $(this).attr("id");
    if (getId == "enable-comment") {
        if ($(this).prop("checked") == true) {
            linkUrl = url.replace("hascomments=false", "hascomments=true");
        }
        else {
            linkUrl = url.replace("hascomments=true", "hascomments=false");
        }
        
    }
    else if (getId == "enable-view") {
        if ($(this).prop("checked") == true) {
           linkUrl = url.replace("hasviews=false", "hasviews=true");
        }
        else {
            linkUrl = url.replace("hasviews=true", "hasviews=false");
        }
    }
    else {
        if ($(this).prop("checked") == true) {
            linkUrl = url.replace("hassso=false", "hassso=true");
            if ($(".options").find("option:selected").val() == "0") {
                linkUrl += "&externallogin=windowsAd";
            }
            else {
                linkUrl += "&externallogin=azureAd";
            }
            $(".SSO-dropdown").css("visibility","visible");
        }
        else {
            linkUrl = url.replace("hassso=true", "hassso=false");
            linkUrl = linkUrl.substring(0, linkUrl.lastIndexOf('&'));
            $(".SSO-dropdown").css("visibility", "hidden");
        }
    }
    $(".update-comment").css("visibility", "visible");
    if (timer != 0) {
        clearTimeout(timer);
    }
    timer = setTimeout(function () {
        $(".update-comment").css("visibility", "hidden");
        timer = 0;
    }, 7000);
    $("#item-embed-link").val("");
    var embedUrl = "<iframe id='frame-div' width='100%' height='100%' frameborder='0' src='" + linkUrl + "'></iframe>"; 
    $("#item-embed-link").val(embedUrl);
    changes = 2;
});

$(document).on("change", ".options", function () {
    if ($(this).find("option:selected").val() == "0") {
        linkUrl = linkUrl.replace("azureAd", "windowsAd");
    }
    else {
        linkUrl = linkUrl.replace("windowsAd", "azureAd");
    }
    var embedUrl = "<iframe id='frame-div' width='100%' height='100%' frameborder='0' src='" + linkUrl + "'></iframe>";
    $("#item-embed-link").val(embedUrl);
    $(".selectpicker").selectpicker("refresh");
    $(".update-comment").css("visibility", "visible");
    if (timer != 0) {
        clearTimeout(timer);
    }
    timer = setTimeout(function () {
        $(".update-comment").css("visibility", "hidden");
        timer = 0;
    }, 7000);
});

function onGetEmbedDialogClose() {
    $("#get-embed-code").ejDialog("close");
}

function onGetEmbedDialogOpen() {
    $("#get-embed-code").ejDialog("open");
}

$(document).on("focusin","#item-embed-link", function () {
    $("#item-embed-link-copy").addClass("focus-div");
});

$(document).on("focusout", "#item-embed-link", function () {
    $("#item-embed-link-copy").removeClass("focus-div");
});

$(document).on("mousedown", "#items .e-gridcontent .e-vscrollbar", function () {
    $("#item-viewer iframe").addClass("pointer-event");
    var isEdge = (navigator.userAgent.indexOf("Edge") != -1);
    if (isEdge) {
        $("#item-viewer iframe").addClass("display");
    }
});

$(document).on('mouseup', function () {
    if ($("#item-viewer iframe").hasClass("pointer-event")) {
        $("#item-viewer iframe").removeClass("pointer-event");
        var isEdge = (navigator.userAgent.indexOf("Edge") != -1);
        if (isEdge) {
            $("#item-viewer iframe").removeClass("display");
        }
    }
});


$(document).on("click", "#make-unlist", function (e) {
    $("#item_name").html($(this).attr("data-name"));
    itemUrl = $(this).attr("data-url");
    var itemId = $(this).attr("data-item-id");
    var itemName = $(this).attr("data-name");
    var itemTypeId = $(this).attr("data-itemtype");
    var itemType = $(this).attr("data-item-type").trim();
    var isPublic = $(this).attr("data-ispublic");
    var isUnlisted = $(this).attr("data-isunlisted");
    $("#make_item_unlist_wrapper").ejWaitingPopup("show");
    var unlistedcode = "";
    $.ajax({
        type: "POST",
        url: makeItemUnlistUrl,
        data: { itemId: itemId, itemTypeId: itemTypeId, itemName: itemName, isPublic: isPublic, isUnlisted: isUnlisted },
        success: function (data) {
            if (data.validation && data.result) {
                unlistedcode = data.unlistedCode;
                onPrivacySettingsDialogClose();
                onMakeUnlistDialogClose();
                onGetLinkDialogOpen(unlistedcode);
                $(".report-name").html(itemName);
                $(".report-name").attr("data-original-title", itemName);
                $("." + itemType.toLowerCase() + "-link").show();
                $(".private-note").hide();
                $(".public-note").hide();
                $(".unlist-note").show();
                $("#item-link-copy").tooltip();
                var maxIndex = getMaxZIndex() + 2;
                $("#get_item_link a.PopupClose").trigger('mouseover').mouseover(function () { $(".tooltip").css("z-index", maxIndex); });
                $("#get_item_link .report-name").trigger('mouseover').mouseover(function () { $(".tooltip").css("z-index", maxIndex); });
                $("#change-privacy").attr("data-ispublic", false);
                $("#change-privacy").attr("data-isunlisted", true);
                ResetGrid();
            } else {
                $("#makeunlistitem").hide();
                $("#select-area").hide();
                $("#close").show();
                $(".error-msg").show();
                ResetGrid();
            }
            $("#make_item_unlist_wrapper").ejWaitingPopup("hide");

        }
    });
});

$(document).on("click", "#remove-unlist", function (e) {
    $("#item_name").html($(this).attr("data-name"));
    itemUrl = $(this).attr("data-url");
    var itemId = $(this).attr("data-item-id");
    var itemName = $(this).attr("data-name");
    var itemTypeId = $(this).attr("data-itemtype");
    $("#remove_item_unlist_wrapper").ejWaitingPopup("show");
    $.ajax({
        type: "POST",
        url: removeItemUnlistUrl,
        data: { itemId: itemId, itemTypeId: itemTypeId, itemName: itemName },
        success: function (data) {
            MakePrivateComplete(data);
        }
    });
});

function onMakeUnlistDialogClose() {
    $("#make_item_unlist").ejDialog("close");
}
function onMakeUnlistDialogOpen() {
    load();
    $("#make_item_unlist").ejDialog("open");
    $('#make_item_unlist').focus();
}
function onRemoveUnlistDialogClose() {
    $("#remove_item_unlist").ejDialog("close");
}

//Privacy Settings functions and events


$(document).on("click", ".privacy-settings", function () {
    itemUrl = $(this).attr("data-url");
    var itemId = $(this).attr("data-item-id");
    var itemName = $(this).attr("data-name");
    var itemTypeId = $(this).attr("data-itemtype");
    var isPublic = $(this).attr("data-ispublic");
    var isUnlisted = $(this).attr("data-isunlisted");
    $.ajax({
        type: "POST",
        url: privacySettinsUrl,
        data: { itemId: itemId, itemTypeId: itemTypeId, itemName: itemName, isPublic: isPublic, isUnlisted: isUnlisted },
        success: function (data) {           
            $("#privacy-settings-container").html(data);            
            $(".report-name").html(itemName);
            $('[data-toggle="tooltip"]').tooltip();
            var maxIndex = getMaxZIndex() + 2;
            $("#privacy-settings-container a.PopupClose").trigger('mouseover').mouseover(function () { $(".tooltip").css("z-index", maxIndex); });
            $("#privacy-settings-container").ejDialog("open");
            
            $("#privacy-settings-container_wrapper").ejWaitingPopup("hide");
        }
    });
});

$(document).on("click", "#change-privacy", function () {
    var action = $("input:radio[name=privacysettings]:checked").val();
    var itemId = $(this).attr("data-item-id");
    var itemName = $(this).attr("data-name");
    var itemTypeId = $(this).attr("data-itemtype");
    var isUnlisted = $(this).attr("data-isunlisted");
    var isPublic = $(this).attr("data-ispublic");

    if (action.toLowerCase() == "public") {
        MakePublic(itemName, itemId, itemTypeId, isPublic, isUnlisted);
    }
    if (action.toLowerCase() == "unlisted") {
        MakeUnlist(itemName, itemId, itemTypeId, isPublic, isUnlisted);
    }
    if (action.toLowerCase() == "private") {
        MakePrivate(itemName, itemId, itemTypeId, isPublic, isUnlisted);
    }
});

function MakePublic(itemName, itemId, itemTypeId, isPublic, isUnlisted) {
    $("#item_name").html(itemName);
    load();
    $("#make_item_public").ejDialog("open");
    $("#make_item_public_wrapper").ejWaitingPopup("show");
    $.ajax({
        type: "POST",
        url: makePublicUrl,
        data: { itemId: itemId, itemTypeId: itemTypeId, itemName: itemName, isPublic: isPublic, isUnlisted: isUnlisted },
        success: function (data) {
            $("#make_item_public").html(data);
            $("#make_item_public_wrapper").ejWaitingPopup("hide");
            $("#make-public").attr("data-itemtype", itemTypeId);
            $("#make-public").attr("data-url", itemUrl);
        }
    });
}

function MakePrivate(itemName, itemId, itemTypeId, isPublic, isUnlisted) {
    $("#item_name").html(itemName);
    load();
    $("#remove_item_public").ejDialog("open");
    $("#remove_item_public_wrapper").ejWaitingPopup("show");
    $.ajax({
        type: "POST",
        url: removePublicUrl,
        data: { itemId: itemId, itemTypeId: itemTypeId, itemName: itemName, isPublic: isPublic, isUnlisted: isUnlisted },
        success: function (data) {
            $("#remove_item_public").html(data);
            $("#remove_item_public_wrapper").ejWaitingPopup("hide");
            $("#remove-public").attr("data-itemtype", itemTypeId);
            $("#remove-public").attr("data-url", itemUrl);
            $("#remove-unlist").attr("data-itemtype", itemTypeId);
            $("#remove-unlist").attr("data-url", itemUrl);
        }
    });
}

function MakeUnlist(itemName, itemId, itemTypeId, isPublic, isUnlisted) {
    $("#item_name").html(itemName);
    load();
    $("#make_item_unlist").ejDialog("open");
    $("#make_item_unlist_wrapper").ejWaitingPopup("show");
    $.ajax({
        type: "POST",
        url: makeUnlistUrl,
        data: { itemId: itemId, itemTypeId: itemTypeId, itemName: itemName, isPublic: isPublic, isUnlisted: isUnlisted },
        success: function (data) {
            $("#make_item_unlist").html(data);
            $("#make_item_unlist_wrapper").ejWaitingPopup("hide");
            $("#make-unlist").attr("data-itemtype", itemTypeId);
            $("#make-unlist").attr("data-url", itemUrl);
        }
    });
}

function MakePrivateComplete(data) {
    if (data.validation && data.result) {
        $("#removepublicitem").hide();
        $("#remove-select-area").hide();
        $("#remove-close").show();
        $("#success-msg").show();
        $("#change-privacy").attr("data-isunlisted", false);
        $("#change-privacy").attr("data-ispublic", false);
        ResetGrid();
    } else {
        $("#removepublicitem").hide();
        $("#remove-select-area").hide();
        $("#success-msg").hide();
        $("#remove-close").show();
        $("#error-msg").show();
        ResetGrid();
    }
    onPrivacySettingsDialogClose();
    $("#remove_item_public_wrapper").ejWaitingPopup("hide");
}

function onPrivacySettingsDialogClose() {
    $("#privacy-settings-container").ejDialog("close");
}


function onPrivacySettingsDialogOpen() {
    $("#privacy-settings-container").ejDialog("open");
    $('#privacy-settings-container').focus();
}

function onCreateConnectionDialogClose() {
    $("#create-connection-popup").ejDialog("close");
}