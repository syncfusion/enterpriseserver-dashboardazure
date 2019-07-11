var containSaveFilter = false;
var queryStringStatus = true;
var clearStatus = false;
var initialQueryString = ""
var initialQueryStringParameter = "";
var updateInitialQueryStringParameter = "";
var saveFilterName = "";
var list;
var currentQueryString = "";
var parentRefUrl = (window.location != window.parent.location) ? document.referrer : document.location.href.replace(document.location.pathname + document.location.search, "");
if (parentRefUrl == "") {
    var parentUrl = "";
}
else {
    var parentUrl = parentRefUrl.match(/:\/\/(.[^/]+)/)[1];
}
var iframeRefUrl = window.location.href;
var iframeUrl = iframeRefUrl.match(/:\/\/(.[^/]+)/)[1];
var sameOrigin = true;
$(document).ready(function () {
    var dashboardWaitingPopupTemplateId = createLoader("dashboard");
    $("#dashboard").ejWaitingPopup({ template: $("#" + dashboardWaitingPopupTemplateId) });
    var dashboardViewToggleWaitingPopupTemplateId = createLoader("dashboard-view-toogle");
    $("#dashboard-view-toogle").ejWaitingPopup({ template: $("#" + dashboardViewToggleWaitingPopupTemplateId) });
    $("#delete-div").ejDialog({
        width: (window.innerWidth > 460) ? "450px" : (window.innerWidth - 10),
        showOnInit: false,
        allowDraggable: false,
        enableResize: false,
        height: "auto",
        title: "[[[Delete View]]]",
        showHeader: false,
        enableModal: true,
        closeOnEscape: true,
        close: "onDeleteItemDialogClose",
        open: "onDeleteItemDialogOpen"
    });
    try {
        sameOrigin = window.parent.location.host == window.location.host;
    }
    catch (e) {
        sameOrigin = false;
    }

    var deleteDivWrapperWaitingPopupTemplateId = createLoader("delete-div_wrapper");
    $("#delete-div_wrapper").ejWaitingPopup({ template: $("#" + deleteDivWrapperWaitingPopupTemplateId) });

    $("#save-view-popup").ejDialog({
        width: "450px",
        height: "150px",
        showOnInit: false,
        allowDraggable: true,
        enableResize: false,
        title: "[[[Save View]]]",
        enableModal: true,
        showHeader: false,
    });
    var saveViewWaitingPopupTemplateId = createLoader("save-view-popup_wrapper");
    $("#save-view-popup_wrapper").ejWaitingPopup({ template: $("#" + saveViewWaitingPopupTemplateId) });
    $("#dashboard-view-toogle").mouseover(function () {
        var ele = document.getElementById("dashboard-views");
        var dashboardViewsEle = $("#dashboard-view-toogle");
        if (ele != null && !(ele.style.display == 'block' || ele.style.display == '')) {
            dashboardViewsEle.addClass("cursor-pointer");
            dashboardViewsEle.removeClass("cursor-default");
        } else {
            dashboardViewsEle.addClass("cursor-default");
            dashboardViewsEle.removeClass("cursor-pointer");
        }
    });
    $('#filter_name').keypress(function (e) {
        $('#filter-name-input').removeClass("has-error");
        if (e.which == 13) {//Enter key pressed
            $('#save-filter').click();
        }
    });
    $('[data-toggle="tooltip"]').tooltip();

    $.validator.addMethod("isValidName", function (value, element) {
        return IsValidName("name", value);
    }, "[[[Please avoid special characters]]]");

    $.validator.addMethod("isRequired", function (value, element) {
        return !isEmptyOrWhitespace(value);
    }, "[[[Please enter view name]]]");

    $("#save-view-form").validate({
        errorElement: "span",
        onkeyup: function (element, event) {
            if (event.keyCode != 9) {
                $(element).valid();
            }
        },
        onfocusout: function (element) { $(element).valid(); },
        rules: {
            "viewnewname": {
                isRequired: true,
                isValidName: true
            }
        },
        messages: {
            "viewnewname": {
                isRequired: "[[[Please enter view name]]]"
            }
        },
        highlight: function (element) {
            $(element).addClass("has-error");
        },
        unhighlight: function (element) {
            $(element).removeClass("has-error");
            $(element).closest("div").find("span").html("");
        },
        errorPlacement: function (error, element) {
            $(element).closest("div").find("span").html(error.html());
        }
    });

    if (typeof (isSlideshow) != "undefined" && isSlideshow) {
        $("#dashboard").swipeDetector().on("swipeLeft.sd swipeRight.sd swipeUp.sd swipeDown.sd", function (obj) {
            var evt = new CustomEvent('onSwipeDetected', { detail: obj })
            window.parent.document.dispatchEvent(evt)
        });
    }

    if (document.addEventListener) {
        document.addEventListener('webkitfullscreenchange', fullscreenExitHandler, false);
        document.addEventListener('mozfullscreenchange', fullscreenExitHandler, false);
        document.addEventListener('fullscreenchange', fullscreenExitHandler, false);
        document.addEventListener('MSFullscreenChange', fullscreenExitHandler, false);
    }
});

//Dashboard View Toggle when click outside
$(document).on('click', "#close-container,#close-filter,#close-comment", function (e) {
    if ($("#is_mobile").val() == "true") {
        $("#server-mobile-navbar .su-nav-dashboard").addClass('active');
        return;
    }

    var ele = document.getElementById("dashboard-views");
    if (ele != null && (ele.style.display == 'block' || ele.style.display == '') && (e.target.className.toLowerCase() != "su-view" && e.target.className.toLowerCase() != "options" && e.target.id.toLowerCase() != "views")) {
        var clickedOn = $(e.target);
        if (((!(clickedOn.parents().andSelf().is('#dashboard-view-toogle'))) && (!(clickedOn.parents().andSelf().is("#PopupContainerDelete"))) && (!(clickedOn.parents().andSelf().is("#messageBox")))) || ((clickedOn.parents().andSelf().is('#close-container')))) {
            CloseDashboardView();
        }
        $("#dashboard-view").removeClass("highlight-icon");
    } else {
        if (e.target.id == "dashboard-view-toogle") {
            if (containSaveFilter) {
                $("#saved-filter").show();
            }
            $("#dashboard").toggleClass("dashboard");
            $(".view-heading").toggle();
            $("#dashboard-views").toggle();
            $("#dashboard-view-toogle").addClass("cursor-default").removeClass("cursor-pointer").toggleClass("dashboard-view-toogle");
            refreshScroller();
        }
    }
    if (!$("#commentModuleContainer").hasClass("displayNone") && e.target.id.toLowerCase() != "comments" && !e.target.classList.contains("su-with-comment") && !e.target.classList.contains("su-without-comment") && e.target.className.toLowerCase() != "options") {
        if (enableComment == "true") {
            closeDashboardComment();
        }
        else {
            $("#close-filter a").css("display", "none");
        }
        setDashboardWidth();
        var data = $("#dashboard").data("ejDashboardDesigner");
        data.resizeDashboard();
    }
    $('[data-toggle="tooltip"]').tooltip();
});

//UnSaved filter on hover
$(document).on('mouseenter', '.border-division,.border-division-last', function () {
    $(this).children('.unsaved-opt').css("display", "block");
}).on('mouseleave', '.border-division,.border-division-last', function () {
    $(this).children('.unsaved-opt').css("display", "none");
});

var filtered_Values = "";
var dashboardviewerObj = null;

//close dashboard-view-toogle
function CloseDashboardView() {
    if ($("#dashboard").length != 0) {
        if (containSaveFilter) {
            $("#saved-filter").show();
        }
        $("#dashboard").toggleClass("dashboard");
        $(".view-heading").toggle();
        $("#dashboard-views").toggle();
        $("#dashboard-view-toogle").toggleClass("dashboard-view-toogle");
        $("#dashboard-view-toogle #close-container a").css("display", "none");
        setDashboardWidth();
        var data = $("#dashboard").data("ejDashboardDesigner");
        data.resizeDashboard();
    }
    else {
        var dashboard_render_iframe_element = $("#dashboard_render_iframe");
        if (containSaveFilter) {
            dashboard_render_iframe_element.contents().find("#saved-filter").show();
        }
        dashboard_render_iframe_element.contents().find("#dashboard").toggleClass("dashboard");
        dashboard_render_iframe_element.contents().find(".view-heading").toggle();
        dashboard_render_iframe_element.contents().find("#dashboard-views").toggle();
        dashboard_render_iframe_element.contents().find("#dashboard-view-toogle").toggleClass("dashboard-view-toogle");
        dashboard_render_iframe_element.contents().find("#dashboard-view-toogle #close-container a").css("display", "none");
    }
}

//Render on complete action
function filterView() {
    $("#dashboard-view-toogle").ejWaitingPopup();
    $("#dashboard-view-toogle").ejWaitingPopup("show");
    var parameters = getcurrentfilters();
    if (parameters != "" && parameters != null && parameters.masterData != null && parameters.masterData.length > 0) {
        SavedViewHeight();
        if ((viewId == null || viewId == "")) {
            if ($("#saved-filter-Saveas").css("display") == "none" &&
                $("#saved-filter-update").css("display") == "none") {
                $("#new-save").show();
                if (enableComment.toString().toLowerCase() == "true") {
                    $("#new-save").removeClass("pointer-events");
                    $("#new-save").css("opacity", 1);
                }
                $("#nofilters").css("display", "none");

            }
        }
    }
    else {
        $("#new-save").addClass("pointer-events");
        $("#new-save").css("opacity", 0.5);
        $("#nofilters").css("display", "block");
    }
    unsavedFilters();
    GetSavedFilter();
    refreshScroller();
    $("#dashboard-view-toogle").ejWaitingPopup("hide");
}

//Clear Filter
$(document).on("click", "#clear", function () {
    dashboardviewerObj = $('#dashboard').data("ejDashboardDesigner");
    dashboardviewerObj.refresh();
});

//Save filter post action
$(document).on("click", "#save-button", function () {
    name = $("#user-name").attr("value");
    id = $("#user-id").attr("value");
    saveFilterName = $("#view-name").val();
    AddView();
});

//Add View Name Function
function AddView() {
    var _data = "Datas";
    var link = "";
    var proxy = parent.$('#dashboard').data("ejDashboardDesigner");
    var queryString = getcurrentfilters().encryptedData;
    var userName = name;
    var userId = id;
    var dashboardViewDiv = document.getElementById("dashboard-views");
    pageurl = typeof pageurl != "undefined" ? pageurl : viewUrl;

    if ($("#save-view-form").valid()) {
        parent.$("#save-view-popup_wrapper").ejWaitingPopup("show");
        $.ajax({
            url: addViewUrl,
            data: { name: _data, ItemViewName: saveFilterName, QueryString: queryString, itemId: parent.$("#dashboard").prevAll("#favorite_Item").attr("data-item-id"), UserId: userId, UserName: userName, IsMultiDashboard: parent.$("#dashboard").prevAll("#isMultiDashboard").attr("data-item-id"), parentDashboardId: parent.$("#dashboard").prevAll("#isMultiDashboard").attr("data-parent-id") },
            type: "POST",
            beforeSend: function (req) {
                req.setRequestHeader('ejAuthenticationToken', proxy._authenticationToken);
            },
            success: function (data) {
                if (data.StatusMessage.trim().toLowerCase() == "name already exists") {
                    $(".validation-errors").html("View Name already exists.");
                    $("#view-name").addClass("has-error");
                }
                else {
                    closeSaveViewPopup();
                    clearStatus = true;
                    initialQueryString = queryString;
                    initialQueryStringParameter = JSON.stringify(updateInitialQueryStringParameter);
                    messageBox("su-filter", "[[[Add View]]]", "[[[View has been added successfully.]]]", "success", function () {
                        onCloseMessageBox();
                        var parentDashboardViewsEle = parent.$("#dashboard-view-toogle");
                        parentDashboardViewsEle.ejWaitingPopup("show");
                        parentDashboardViewsEle.find("#no-filters").css("display", "none");
                        parentDashboardViewsEle.ejWaitingPopup("hide");
                    });

                    var savedViewId = data.ItemsView[0].ViewId;
                    $("#update-view").attr("viewid", savedViewId);
                    $("#save-section").hide();
                    $("#save-lable-section label").html("");
                    link = '<a class="saved-view-link txt-overflow" href="' + pageurl + '?viewid=' +
                        savedViewId + '" target="_blank" data-toggle="tooltip" data-original-title="' + saveFilterName + '">' +
                        saveFilterName +
                        '</a>';
                    $("#save-lable-section label").append(link);
                    $("#save-lable-section").show();
                    $("#new-save").hide();
                    $("#saved-filter-update").show();
                    $("#update-view").addClass("pointer-events");
                    $("#update-view").css("opacity", 0.5);
                    $("#saved-filter-Saveas").hide();
                    GetSavedFilter();
                    refreshScroller();
                }
                parent.$('#dashboard').data("ejDashboardDesigner")._updateFilterOverview(saveFilterName, savedViewId);
                $("#dashboard-view-toogle").ejWaitingPopup("hide");
                parent.$("#save-view-popup_wrapper").ejWaitingPopup("hide");
            },
            error: function (data) {
                messageBox("su-filter", "[[[Add View]]]", "[[[Internal server error. Please try again.]]]", "success", function () {
                    onCloseMessageBox();
                });
                $("#dashboard-view-toogle").ejWaitingPopup("hide");
                parent.$("#save-view-popup_wrapper").ejWaitingPopup("hide");
            }
        });
    }
}

//Get Saved Filters
function GetSavedFilter() {
    var dashboardviewerObj = $('#dashboard').data("ejDashboardDesigner");
    var dashboardEle = $("#dashboard");
    if (iframeUrl == parentUrl) {
        var parentDashboardEle = parent.$("#dashboard");        
        item_Id = typeof item_ID != "undefined" ? item_Id : parentDashboardEle.prevAll("#favorite_Item").attr("data-item-id") != undefined ? parentDashboardEle.prevAll("#favorite_Item").attr("data-item-id") : dashboardEle.prevAll("#favorite_Item").attr("data-item-id");
        isMultiDashboard = typeof isMultiDashboard != "undefined" ? isMultiDashboard : parentDashboardEle.prevAll("#isMultiDashboard").attr("data-item-id") != undefined ? parentDashboardEle.prevAll("#isMultiDashboard").attr("data-item-id") : dashboardEle.prevAll("#isMultiDashboard").attr("data-item-id");
        parentDashboardId = typeof parentDashboardId != "undefined" ? parentDashboardId : parentDashboardEle.prevAll("#isMultiDashboard").attr("data-parent-id") != undefined ? parentDashboardEle.prevAll("#isMultiDashboard").attr("data-parent-id") : dashboardEle.prevAll("#isMultiDashboard").attr("data-parent-id");
    } else {
        item_Id = typeof item_ID != "undefined" ? item_Id : dashboardEle.prevAll("#favorite_Item").attr("data-item-id") != undefined ? dashboardEle.prevAll("#favorite_Item").attr("data-item-id") : dashboardEle.prevAll("#favorite_Item").attr("data-item-id");
        isMultiDashboard = typeof isMultiDashboard != "undefined" ? isMultiDashboard : dashboardEle.prevAll("#isMultiDashboard").attr("data-item-id") != undefined ? dashboardEle.prevAll("#isMultiDashboard").attr("data-item-id") : dashboardEle.prevAll("#isMultiDashboard").attr("data-item-id");
        parentDashboardId = typeof parentDashboardId != "undefined" ? parentDashboardId : dashboardEle.prevAll("#isMultiDashboard").attr("data-parent-id") != undefined ? dashboardEle.prevAll("#isMultiDashboard").attr("data-parent-id") : dashboardEle.prevAll("#isMultiDashboard").attr("data-parent-id");
    }
    userName = typeof userName != "undefined" ? userName : name;
    userId = typeof userId != "undefined" ? userId : id;
    pageurl = typeof pageurl != "undefined" ? pageurl : viewUrl;
    var childDashboardName = isMultiDashboard.toLowerCase() == "true" ? dashboardEle.length != 0 ? dashboardEle.find("li.e-active").find("span").html().trim() : parent.$("#dashboard").find("li.e-active").find("span").html().trim() : "";
    $.ajax({
        url: getSavedViewUrl,
        data: { itemId: item_Id, UserId: userId, UserName: userName, IsMultiDashboard: isMultiDashboard, parentDashboardId: parentDashboardId },
        type: "POST",
        success: function (data) {
            $('#saved-filter').length > 0 ? $('#saved-filter').html("") : parent.$('#saved-filter').html("");
            var savedFilter =
                '<div id="saved-list" style="display: block"><div class="saved-list-content-div" style="float: left">'
            var Result = jQuery.parseJSON(data.Result);
            if (Result.length > 0) {
                containSaveFilter = true;
                $('#saved-filter').length > 0 ? $('#saved-filter').show() : parent.$('#saved-filter').show();
                for (var i = 0; i < Result.length; i++) {
                    var ViewId = Result[i].ViewId;
                    var savedFilterOptions = "";
                    if (Result[i].CanDelete && Result[i].CanShare) {
                        savedFilterOptions =
                            '<div class="saved-opt"><span class="opt" viewid="' +
                            ViewId +
                            '" itemId="' +
                            item_Id +
                            '" viewname="' +
                            Result[i].ViewName +
                            '"><span viewid="' +
                            ViewId +
                            '" itemId="' +
                            item_Id +
                            '" viewname="' +
                            Result[i].ViewName +
                            '"  class = "delete su su-delete cursor-pointer" data-toggle="tooltip" data-original-title="' + "[[[Delete]]]" + '" ></span></span><span class="opt" viewid="' +
                            ViewId +
                            '" itemId="' +
                            item_Id +
                            '" viewname="' +
                            Result[i].ViewName +
                            '"><span  viewid="' +
                            ViewId +
                            '" itemId="' +
                            item_Id +
                            '" viewname="' +
                            Result[i].ViewName +
                            '" class = "share su su-share  cursor-pointer" data-toggle="tooltip" data-original-title="' + "[[[Share]]]" + '"></span></span><span class="opt" viewid="' +
                            ViewId +
                            '" itemId="' +
                            item_Id +
                            '" viewname="' +
                            Result[i].ViewName +
                            '"><span  viewid="' +
                            ViewId +
                            '" itemId="' +
                            item_Id +
                            '" viewname="' +
                            Result[i].ViewName +
                        '" class ="su su-link View-link-copy cursor-pointer" data-original-title="' + "[[[Click to copy]]]" + '" data-toggle="tooltip" data-placement="top" title=""></span></span></div>';
                    } else if (Result[i].CanDelete) {
                        savedFilterOptions =
                            '<div class="saved-opt"><span class="opt" viewid="' +
                            ViewId +
                            '" itemId="' +
                            item_Id +
                            '" viewname="' +
                            Result[i].ViewName +
                            '"><span viewid="' +
                            ViewId +
                            '" itemId="' +
                            item_Id +
                            '" viewname="' +
                            Result[i].ViewName +
                            '"  class = "delete su su-delete cursor-pointer" data-toggle="tooltip" data-original-title="' + "[[[Delete]]]" + '" ></span></span><span class="opt" viewid="' +
                            ViewId +
                            '" itemId="' +
                            item_Id +
                            '" viewname="' +
                            Result[i].ViewName +
                            '"><span  viewid="' +
                            ViewId +
                            '" itemId="' +
                            item_Id +
                            '" viewname="' +
                            Result[i].ViewName +
                        '" class = "su su-link View-link-copy cursor-pointer" data-original-title="' + "[[[Click to copy]]]" + '" data-toggle="tooltip" data-placement="top" title=""></span></span></div>';
                    } else if (Result[i].CanShare) {
                        savedFilterOptions =
                            '<div class="saved-opt"><span class="opt" viewid="' + ViewId + '" itemId="' + item_Id + '" viewname="' + Result[i].ViewName + '"><span  viewid="' +
                            ViewId +
                            '" itemId="' +
                            item_Id +
                            '" viewname="' +
                            Result[i].ViewName +
                            '" class = "share su su-share  cursor-pointer" data-toggle="tooltip" data-original-title="' + "[[[Share]]]" + '"></span></span><span class="opt" viewid="' +
                            ViewId +
                            '" itemId="' +
                            item_Id +
                            '" viewname="' +
                            Result[i].ViewName +
                            '"><span  viewid="' +
                            ViewId +
                            '" itemId="' +
                            item_Id +
                            '" viewname="' +
                            Result[i].ViewName +
                        '" class = "su su-link View-link-copy cursor-pointer" data-original-title="' + "[[[Click to copy]]]" + '" data-toggle="tooltip" data-placement="top" title=""></span></span></div>';
                    } else {
                        savedFilterOptions =
                           '<div class="saved-opt"><span class="opt" viewid="' + ViewId + '" itemId="' + item_Id + '" viewname="' + Result[i].ViewName + '"><span  viewid="' +
                           ViewId +
                           '" itemId="' +
                           item_Id +
                           '" viewname="' +
                           Result[i].ViewName +
                        '" class = "su su-link View-link-copy cursor-pointer" data-original-title="' + "[[[Click to copy]]]" + '" data-toggle="tooltip" data-placement="top" title=""></span></span></div>';
                    }
                    if (pageurl.indexOf("/embed/") > -1) {
                        pageurl = pageurl.replace("/embed/", "/");
                    }
                    else {
                        pageurl = pageurl;
                    }
                    if (childDashboardName != "") {
                        savedFilter += '<li class="saved-view" viewid="' +
                        ViewId +
                        '">' + savedFilterOptions +
                        '<label class="saved-filter txt-overflow" viewid="' +
                        ViewId +
                        '" itemId="' +
                        item_Id +
                        '"><a class="view-link txt-overflow saved-filter-anchor"  href="' +
                        pageurl + '?tab=' + childDashboardName +
                        '&viewid=' +
                        ViewId +
                        '" data-url="' +
                        pageurl + '?tab=' + childDashboardName +
                        '&viewid=' +
                        ViewId +
                        '" target="_blank" data-toggle="tooltip" data-original-title="' + Result[i].ViewName + '">' +
                        Result[i].ViewName +
                        '</a></label></li>';
                    }
                    else {
                        savedFilter += '<li class="saved-view" viewid="' +
                     ViewId +
                     '">' + savedFilterOptions +
                     '<label class="saved-filter txt-overflow" viewid="' +
                     ViewId +
                     '" itemId="' +
                     item_Id +
                     '"><a class="view-link txt-overflow saved-filter-anchor"  href="' +
                     pageurl +
                     '?viewid=' +
                     ViewId +
                     '" data-url="' +
                     pageurl +
                     '?viewid=' +
                     ViewId +
                     '" target="_blank" data-toggle="tooltip" data-original-title="' + Result[i].ViewName + '">' +
                     Result[i].ViewName +
                     '</a></label></li>';
                    }
                }
                $('#saved-filter').length > 0 ? $('#saved-filter').append(savedFilter + '</div></div>') : parent.$('#saved-filter').append(savedFilter + '</div></div>');
                if ($('#saved-filter').length == 0) {
                    var links = parent.$('.view-link').attr('data-url');
                    for (var i = 0; i < links.length; i++) {
                        parent.$('.view-link').eq(i).attr('href', parent.$('.view-link').eq(i).attr('data-url'));
                    }
                }
                else {
                    var links = $('.view-link').attr('data-url');
                    for (var i = 0; i < links.length; i++) {
                        $('.view-link').eq(i).attr('href', $('.view-link').eq(i).attr('data-url'));
                    }
                }

                $("#dashboard-view-toogle").length > 0 ? $("#dashboard-view-toogle").find("#saved-list").length == 0 ? $("#dashboard-view-toogle").find("#no-filters").css("display", "block") : $("#dashboard-view-toogle").find("#no-filters").css("display", "none") : parent.$("#dashboard-view-toogle").find("#saved-list").length == 0 ? parent.$("#dashboard-view-toogle").find("#no-filters").css("display", "block") : parent.$("#dashboard-view-toogle").find("#no-filters").css("display", "none");
                if (/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)) {
                    $(".View-link-copy").removeClass("su su-link");
                    $(".View-link-copy").attr("data-original-title", "");
                }
                $("#dashboard-view-toogle").length > 0 ? $("#dashboard-view-toogle").show() : parent.$("#dashboard-view-toogle").show();
                iframeUrl == parentUrl ? parent.$('[data-toggle="tooltip"]').tooltip() : $('[data-toggle="tooltip"]').tooltip();
            } else {
                containSaveFilter = false;
                $('#saved-filter').length > 0 ? $('#saved-filter').hide() : parent.$('#saved-filter').hide();
                dashboardviewerObj = $('#dashboard').data("ejDashboardDesigner");
            }
            refreshScroller();
        },
        error: function (data) {
            resetViewPanel();
            SavedViewHeight();
            refreshScroller();
        }
    });
}

//Open the Saved view in new tab
$(document).on("click", ".view", function () {
    var viewId = $(this).attr("viewid");
    window.open(window.location.pathname + '?viewid=' + viewId, '_blank');
});

//Share View Dialog box
$(document).on("click", ".share", function () {
    var viewId = $(this).attr("viewid");
    $("#dashboard-view-toogle").css("z-index", "999");
    ShareView(viewId);
});

//update view action
$(document).on("click", "#update-view", function () {
    $("#update-view").show();
    var dashboardViewDiv = document.getElementById("dashboard-views");
    if (dashboardViewDiv.style.display == 'block' || dashboardViewDiv.style.display == '') {
        $("#dashboard-view-toogle").ejWaitingPopup("show");
    }

    var proxy = $('#dashboard').data("ejDashboardDesigner");
    var queryString = getcurrentfilters().encryptedData;
    var dashboardviewerObj = $('#dashboard').data("ejDashboardDesigner");
    $.ajax({
        type: "POST",
        url: updateViewUrl,
        data: { itemId: item_Id, QueryString: queryString, ViewId: $(this).attr("viewid"), UserId: userId, UserName: userName, IsMultiDashboard: isMultiDashboard, parentDashboardId: parentDashboardId },
        beforeSend: function (req) {
            req.setRequestHeader('ejAuthenticationToken', proxy._authenticationToken);
        },
        success: function (data) {
            if (data.Result.Status == true) {
                queryStringStatus = true;
                if (queryStringStatus) {
                    queryStringStatus = false;
                    initialQueryStringParameter = JSON.stringify(updateInitialQueryStringParameter);
                    dashboardviewerObj.model.filterParameters = queryString;
                    dashboardviewerObj.redrawDashboard();
                }
                $("#update-view").addClass("pointer-events");
                $("#update-view").css("opacity", 0.5);
                messageBox("su-filter", "[[[Update View]]]", "[[[View has been updated successfully.]]]", "success", function () {
                    onCloseMessageBox();
                });
            }
            else {
                $("#save-section").hide();
                messageBox("su-filter", "[[[Update View]]]", "[[[Internal server error. Please try again.]]]", "success", function () {
                    onCloseMessageBox();
                });
            }
        },
        error: function () {
            messageBox("su-filter", "[[[Update View]]]", "[[[Internal server error. Please try again.]]]", "success", function () {
                onCloseMessageBox();
            });
            $("#dashboard-view-toogle").ejWaitingPopup("show");
        }
    });
    GetSavedFilter();
    refreshScroller();
});

//save-as-view action
$(document).on("click", "#save-as-view", function () {
    $("#view-name").hide();
    $("#filter_name").val("");
    $("#save-lable-section").hide();
    $("#save-section").show();
});

//Reset and clear Views
$(document).on("click", ".clear", function () {
    $("#dashboard-view-toogle").ejWaitingPopup("show");
    $("#filter_name").val("");
    clearAllFilters();
    $("#view-name").show();
    $("#save-section").hide();
    $("#unsaved-filter,#unsaved-filter-title").show();
    $("#save-lable-section").show();
});

$(document).on("click", "#clear-txt", function () {
    $("#filter_name").val("");
    $("#save-lable-section").show();
    $("#save-section").hide();
});

//Clear Individual filters
$(document).on("click", ".clear-filter", function (event) {
    var widgetId = event.target.attributes["widgetid"].value;
    var widgetType = event.target.attributes["widgettype"].value;
    clearWidgetFilter(widgetId, widgetType);
    var dashboardviewerObj = getcurrentfilters();
    if ((dashboardviewerObj == "" || dashboardviewerObj == "undefined" || dashboardviewerObj == null || dashboardviewerObj.masterData == null)) {
        $("#filter_name").val("");
        $("#save-lable-section").show();
        $("#save-section").hide();
    }
});

//Delete Dialog Close
function onDeleteItemDialogClose() {
    var dashboardViewsEle = $("#dashboard-view-toogle");
    $("#delete-div").ejDialog("close");
    dashboardViewsEle.ejWaitingPopup("show");
    dashboardViewsEle.find("#saved-list").length == 0 ? $("#no-filters").css("display", "block") : $("#no-filters").css("display", "none");
    dashboardViewsEle.ejWaitingPopup("hide");
}

//Delete dialog open
function onDeleteItemDialogOpen() {
    $("#dashboard").ejDashboardDesigner("instance").closeAllWindows();
    $("#delete-div").ejDialog("open");
    $("#delete-msg").show();
    $('#delete-div').focus();
}

function resetViewPanel() {
    if (typeof (isSlideshow) != "undefined" && isSlideshow) {
        return;
    }

    $("#save-lable-section label").html("");
    $("#entire-label-section label").html("[[[Unsaved View]]]");
    if ($("#is_mobile").val() == "true" || isUserAuthenticated == "false") {
        $("#dashboard").ejDashboardDesigner("instance").model.filterOverviewSettings.showSaveIcon = false;
    }
    else {
        $("#dashboard").ejDashboardDesigner("instance").model.filterOverviewSettings.showSaveIcon = true;
    }
    $("#new-save").css("display", "block");
    $("#saved-filter-update").css("display", "none");
    $("#saved-filter-Saveas").css("display", "none");
    $("#saved-filter").html("");
    $("#no-filters").css("display", "block");
    unsavedFilters();
}

var deletedViewId = "";
//Delete Saved View
$(document).on("click", ".delete", function (e) {
    onDeleteItemDialogOpen();
    var viewid = $(this).attr("viewid");
    var viewName = $(this).attr("viewname");
    $("#delete_item").attr("viewid", viewid);
    $("#delete_item_name").html(viewName);
    $("#delete-content").show();
    $(".validationArea").show();
    $("#delete-confirmation").hide();
    $("#delete-error").hide();
    $(".successArea").hide();
});

//Delete Confirm Action
$(document).on("click", "#delete_item", function () {
    var dashboardViewDiv = document.getElementById("dashboard-views");
    if (dashboardViewDiv.style.display == 'block' || dashboardViewDiv.style.display == '') {
        $("#delete-div_wrapper").ejWaitingPopup("show");
    }
    deletedViewId = $("#update-view").attr("viewid");
    var currentId = $(this).attr("viewid");
    $.ajax({
        type: "POST",
        url: deleteViewUrl,
        data: { ItemViewName: $("#filter_name").val(), itemId: item_Id, ViewId: $(this).attr("viewid"), UserId: userId, UserName: userName, IsMultiDashboard: isMultiDashboard, parentDashboardId: parentDashboardId },
        success: function (data) {
            if (data.Result.Status == true) {
                $("#delete-content").hide();
                $("#delete-confirmation").show();
                $("#delete-confirmation .deleteItem").show();
                $(".successArea").show();
                $(".validationArea").hide();
                if (currentId == deletedViewId) {
                    window.location.href = window.location.href.replace(window.location.search, "");
                }
                GetSavedFilter();

                var dashboardObj = $('#dashboard').data("ejDashboardDesigner");
                if (currentId == dashboardObj.model.filterOverviewSettings.viewId) {
                    dashboardObj._updateFilterOverview("[[[Unsaved View]]]", "");
                    dashboardObj.model.filterOverviewSettings.viewName = null;
                    dashboardObj.model.filterOverviewSettings.viewId = null;
                }
            }
            else {
                ("#delete-content").hide();
                $("#delete-confirmation").hide();
                $("#delete-error").show();
                $(".successArea").show();
            }
            $("#delete-div_wrapper").ejWaitingPopup("hide");
        },
        error: function (data) {
            messageBox("su-delete", "[[[Delete View]]]", "[[[Internal server error. Please try again.]]]", "success", function () {
                onCloseMessageBox();
            });
            $("#delete-div_wrapper").ejWaitingPopup("hide");
        }
    });
});

//Show Save text box section
$(document).on("click", "#save-view", function () {
    $("#save-section").show();
    $("#save-lable-section").hide();
    $("#filter_name").val("");
    $("#filter_name").focus();
});

//Copy View-Link
$(document).on("click", ".View-link-copy", function (e) {
    var browser = ej.browserInfo();
    if ($(e.target).parents().closest('li').length) {
        var parentElement = $(e.target).parents().closest('li');
        if (parentElement.find('.view-link').length) {
            var tempText = document.createElement("textarea");
            tempText.id = "copyTextArea";
            tempText.innerText = baseUrl + parentElement.find('.view-link').attr('href');
            document.querySelector("body").appendChild(tempText);
            var existsTextarea = document.getElementById("copyTextArea");
            existsTextarea.select();
            if (/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)) {
                $(this).removeClass("su su-link");
                $(this).attr("data-original-title", "");
            }
            else {
                // copy the text to the clipboard
                document.execCommand('copy');

                $(this).attr("data-original-title", "[[[Copied]]]").tooltip("show");

                setTimeout(function () {
                    $(".View-link-copy").attr("data-original-title", "[[[Click to copy]]]"); $(".View-link-copy").tooltip();
                }, 3000);
            }
            document.querySelector("body").removeChild(tempText);
        }

    }

});

//Saved Views List Height
function SavedViewHeight() {
    if ($('#saved-list').css('display') != "none") {
        var expandCollpase = iframeUrl == parentUrl ? (sameOrigin ? parent.$("#header-pane") : $("#header-pane")) : $("#header-pane");
        var savelabel = $("#entire-label-section");
        var unsaveFilter = $("#unsaved-filter");
        var unsaveFilterTitle = $("#unsaved-filter-title");
        var noFilter = $("#nofilters");
        var windowHeight = iframeUrl == parentUrl ? $((sameOrigin ? parent.window : window)).height() : $(window).height();
        var height = (windowHeight - expandCollpase.outerHeight() - savelabel.outerHeight() - (noFilter.css("display") != "none" ? noFilter.outerHeight() : 0) - (unsaveFilter.css("display") != "none" ? unsaveFilter.outerHeight() : 0) - (unsaveFilterTitle.css("display") != "none" ? unsaveFilterTitle.outerHeight() : 0));
        $("#saved-list").css("height", height);
        return height;
    }
}

function getFnObj(obj) {
    if (typeof obj === "function") return obj;
    if (typeof obj === "string" && window[obj])
        return obj;
}

function refreshScroller() {
    if ((typeof (isSlideshow) != "undefined" && isSlideshow)) {
        return;
    }

    var scrollerHeight = "";
    var scrollerWidth = 500;
    var scrollerHeightSavedFilter = "";
    if ($("#unsaved-filter-parameter").children().length) {
        scrollerHeight = $("#unsaved-filter-parameter").height() >= 230 ? 230 : $("#unsaved-filter-parameter").height() + 20;

        $("#unsaved-filter").ejScroller({
            height: scrollerHeight,
            width: scrollerWidth,
            scrollerSize: 7,
            buttonSize: 0,
            enableTouchScroll: false
        });
        var scrollercontrol = $("#unsaved-filter").ejScroller("instance");
        scrollercontrol.model.height = scrollerHeight;
        scrollercontrol.refresh();
        if ($("#unsaved-filter .e-vhandle").length) {
            var element = $("#unsaved-filter .e-vhandle");
            if (!(element.css('display') == "none")) {
                var height = element.height() + 29;
                element.css("height", height);
            }
        }
    }
    scrollerHeightSavedFilter = SavedViewHeight() - 10;
    if ($("#saved-list").length) {
        $("#saved-list")
            .ejScroller({
                height: scrollerHeightSavedFilter,
                width: scrollerWidth,
                scrollerSize: 9,
                buttonSize: 0,
                enableTouchScroll: iframeUrl == parentUrl ? (sameOrigin ? parent.$("#is_mobile").val() : $("#is_mobile").val()) != "false" : $("#is_mobile").val() != "false"
            });
        var scrollercontrolSaved = $("#saved-list").ejScroller("instance");
        scrollercontrolSaved.model.height = scrollerHeightSavedFilter;
        scrollercontrolSaved.refresh();
        if ($("#saved-filter .e-vhandle").length) {
            var element = $("#saved-filter .e-vhandle");
            if (!(element.css('display') == "none")) {
                var height = element.height() + 29;
                element.css("height", height);
            }
        }
    } else if (iframeUrl == parentUrl) {
        (sameOrigin ? parent.$("#saved-list") : $("#saved-list"))
            .ejScroller({
                height: scrollerHeightSavedFilter,
                width: scrollerWidth,
                scrollerSize: 9,
                buttonSize: 0,
                enableTouchScroll: iframeUrl == parentUrl ? parent.$("#is_mobile").val() != "false" : $("#is_mobile").val() != "false"
            });
        if ((sameOrigin ? parent.$("#saved-filter .e-vhandle") : $("#saved-filter .e-vhandle")).length) {
            var element = sameOrigin ? parent.$("#saved-filter .e-vhandle") : $("#saved-filter .e-vhandle");
            if (!(element.css('display') == "none")) {
                var height = element.height() + 29;
                element.css("height", height);
            }
        }
    }
}

//filter details
function getcurrentfilters() {
    var dashboardElement = $('#dashboard');
    var dashboardObj = $('#dashboard').data("ejDashboardDesigner");
    if (iframeUrl == parentUrl) {
        var dashboardviewerObj = (sameOrigin ? parent.$('#dashboard').length : dashboardElement.length) > 0 ? (sameOrigin ? parent.$('#dashboard').data("ejDashboardDesigner").getCurrentFilters() : dashboardObj.getCurrentFilters()) : dashboardObj.getCurrentFilters();
    } else {
        var dashboardviewerObj = dashboardElement.length > 0 ? dashboardObj.getCurrentFilters() : dashboardObj.getCurrentFilters();
    }
    return dashboardviewerObj;
}

function clearAllFilters() {
    var dashboardviewerObj = $('#dashboard').data("ejDashboardDesigner");
    if ((viewId != null && viewId != "") || clearStatus) {
        dashboardviewerObj.model.filterParameters = initialQueryString;
        dashboardviewerObj.redrawDashboard();
    } else {
        $("#dashboard-view-toogle").ejWaitingPopup("hide");
    }
}

function getWidgetTitle(widgetId) {
    var widgetTitle = $('#dashboard').data("ejDashboardDesigner").getWidgetTitle(widgetId);
    return widgetTitle;
}

function clearWidgetFilter(widgetId, widgetType) {
    $('#dashboard').data("ejDashboardDesigner").clearWidgetFilter(widgetId, widgetType);
}

function onFilterOverviewUpdated(currentMasterData) {
    unsavedFilters(currentMasterData);
    $('[data-toggle="tooltip"]').tooltip();
    refreshScroller();
}

function unsavedFilters(currentMasterData) {
    var dashboardviewerObj = getcurrentfilters();
    if (dashboardviewerObj != "" && dashboardviewerObj != "undefined" && dashboardviewerObj != null) {
        if (currentMasterData != "" && currentMasterData != "undefined" && currentMasterData != null) {
            var querystring = currentMasterData.currentFilterData;
            updateInitialQueryStringParameter = querystring;
            if (queryStringStatus) {
                queryStringStatus = false;
                initialQueryString = dashboardviewerObj.encryptedData;
                initialQueryStringParameter = JSON.stringify(querystring);
            }
            if (initialQueryStringParameter === JSON.stringify(querystring)) {
                $("#update-view").addClass("pointer-events");
                $("#update-view").css("opacity", 0.5);
            } else {
                if (enableComment.toString().toLowerCase() == "true") {
                    $("#update-view").removeClass("pointer-events");
                    $("#update-view").css("opacity", 1);
                }
            }
        }
    }
    $('#unsaved-filter-parameter').html('');
    var unsavedFilterOptions = "";
    var widgetDetails = "";
    var widgetTitle = "";
    var widgetType = "";
    var widgetId = "";
    var item = "";
    var result = "";
    if (dashboardviewerObj != "" && dashboardviewerObj != "undefined" && dashboardviewerObj != null && dashboardviewerObj.masterData != null && dashboardviewerObj.masterData.length > 0) {
        result = dashboardviewerObj.masterData;
        if (result.length > 0) {
            $("#unsaved-filter-parameter").show();
            for (var i = 0; i < result.length; i++) {
                var entireItem = ""
                var listItem = "";
                widgetId = result[i].Control;
                widgetDetails = getWidgetTitle(widgetId);
                widgetTitle = widgetDetails.title;
                widgetType = widgetDetails.type;
                item = result[i].Data;
                if (i != result.length - 1) {
                    unsavedFilterOptions +=
                        '<div class="cursor-default border-division"><div class="unsaved-opt"style="float: right;"><span class="opt"><span class="su su-close clear-filter cursor-pointer" data-toggle="tooltip" data-placement="left" data-original-title="' + "[[[Clear]]]" + '" widgetId ="' + widgetId + '"widgetType ="' + widgetType + '" style="float:right"></span></span></div><label class="cursor-default txt-overflow unsaved-filter-head">' + widgetTitle + '</label>';
                } else {
                    unsavedFilterOptions +=
                        '<div class="cursor-default border-division-last"><div class="unsaved-opt"style="float: right;"><span class="opt"><span class="su su-close clear-filter cursor-pointer" data-toggle="tooltip" data-placement="left" data-original-title="' + "[[[Clear]]]" + '" widgetId ="' + widgetId + '"widgetType ="' + widgetType + '" style="float:right"></span></span></div><label class="cursor-default txt-overflow unsaved-filter-head">' + widgetTitle + '</label>';
                }
                if (item.length) {
                    for (var j = 0; j < item.length; j++) {
                        entireItem = entireItem + item[j] + ",";
                        listItem = listItem + item[j] + "<br>";

                    }
                }
                entireItem = entireItem.slice(0, -1)
                unsavedFilterOptions +=
                    '<div id="sub-item"><label class="cursor-default txt-overflow unsavedfilter-font-content" rel="tooltip" data-placement="left" data-original-title="' + listItem + '">' + entireItem + '</label></div>';
                unsavedFilterOptions += '<br style="clear: both"></div>';
            }
            $("#unsaved-filter,#unsaved-filter-title").css("display", "block");
            $("#unsaved-filter-parameter").append(unsavedFilterOptions);
            refreshScroller();
            if (enableComment.toString().toLowerCase() == "true") {
                $("#new-save,#saved-filter-update,#saved-filter-Saveas,#save-filter,#filter_name").removeClass("pointer-events").css("opacity", 1);
            } else {
                $("#new-save,#saved-filter-update,#saved-filter-Saveas,#save-filter,#filter_name").addClass("pointer-events").css("opacity", 0.5);
            }
            $("#nofilters").css("display", "none");
            $("[rel=tooltip]").tooltip({ html: true });
        }
    } else {
        $("#new-save,#saved-filter-update,#saved-filter-Saveas,#save-filter,#filter_name").addClass("pointer-events").css("opacity", 0.5);
        $("#nofilters").css("display", "block");
        $("#unsaved-filter,#unsaved-filter-title").css("display", "none");
    }
}

//MessageBox

function onCloseMessageBox() {
    parent.$("#messageBox").ejDialog("close");
}

function onMessageDialogClose() {
    parent.$("#messageBox").find(".message-content").text("");
    $(".message-box-btn-holder").html("");
    $(".message-box-close").html("");
}

function messageBox(messageIcon, messageHeader, messageText, type, successCallback, errorCallback, width, height, maxHeight, cssClass) {
    parent.$("#messageBox").find(".message-content").text("");

    if (messageHeader === "[[[Delete Comment]]]") {
        parent.$("#messageBox_wrapper").addClass("delete-comment");
    }

    parent.$(".message-box-btn-holder").html("");
    parent.$(".message-box-close").html("");
    parent.$("#messageBox").find(".message-header").html("<span class='su " + messageIcon + "'></span> <span class='modal-title' data-toggle='tooltip' data-placement='bottom' data-container='body' title='" + messageHeader + "'  >" + messageHeader + "</h2>");
    parent.$("#messageBox").find(".message-content").html(messageText);
    if (type == "error") {
        var successButton;
        var closeIcon;
        var errorButton;
        if (successCallback != undefined) {
            successButton = $("<input type='button' class='critical-action-button pull-right' value='" + "[[[Yes]]]" + "'></input>");
            successButton.bind("click", $.proxy(getFnObj(successCallback), window));
        }
        if (errorCallback != undefined) {
            errorButton = $("<input type='button' class='secondary-button pull-right' value='" + "[[[No]]]" + "'></input>");
            errorButton.bind("click", $.proxy(getFnObj(errorCallback), window));
            closeIcon = $('<span class="su su-close"></span>');
            closeIcon.bind("click", $.proxy(getFnObj(errorCallback), window));
        }
        else {
            errorButton = $("<input type='button' class='secondary-button pull-right' value='" + "[[[No]]]" + "'></input>");
            closeIcon = $('<span class="su su-close"></span>');
            errorButton.click(function () {
                onCloseMessageBox();
            });
            closeIcon.click(function () {
                onCloseMessageBox();
            });
        }
        parent.$(".message-box-close").html(closeIcon);
        parent.$(".message-box-btn-holder").append(errorButton, successButton);
        parent.$("#messageBox").unbind("keydown");
    }
    else {
        var successButton;
        var closeIcon;
        if (successCallback != undefined) {
            successButton = $("<input type='button' class='secondary-button' value='" + "[[[OK]]]" + "'></input>");
            successButton.bind("click", $.proxy(getFnObj(successCallback), window));
            closeIcon = $('<span class="su su-close"></span>');
            closeIcon.bind("click", $.proxy(getFnObj(successCallback), window));
        }
        else {
            successButton = $("<input type='button' class='secondary-button' value='" + "[[[OK]]]" + "'></input>");
            closeIcon = $('<span class="su su-close"></span>');
            successButton.click(function () {
                onCloseMessageBox();
            });
            closeIcon.click(function () {
                onCloseMessageBox();
            });
        }
        parent.$(".message-box-close").html(closeIcon);
        parent.$(".message-box-btn-holder").append(successButton);
        parent.$("#messageBox").on("keydown", function (event) {
            switch (event.keyCode) {
                case 13:
                case 27:
                    successButton.click();
            }
        });
    }

    $('[data-toggle="tooltip"]').tooltip();
    parent.$("#messageBox").ejDialog("open");
    parent.$("#messageBox").focus();
    var sizeobj = parent.$("#messageBox").data("ejDialog");
    setTimeout(function () {
        if (width != undefined)
            sizeobj.option("width", width);
        if (window.innerWidth > 1040) {
            if (height == undefined)
                height = parent.$("#messageBox").find(".modal-content").height() + 135 + "px";
        }
        sizeobj.option("height", height);
        if (maxHeight != undefined)
            sizeobj.option("maxHeight", maxHeight);
    }, 50);
    if (cssClass != null && cssClass != undefined) {
        sizeobj.option("cssClass", cssClass);
    }
}

function setDashboardWidth() {
    var dashboardElement = $("#dashboard");
    if ((typeof (isSlideshow) != "undefined" && isSlideshow)) {
        dashboardElement.css("width", $(window).width() + "px");
        return;
    }

    if (window.top == window.self) {
        dashboardElement.css("width", $(window).width() + "px");
    }
    else {
        var parentRefUrl = (window.location != window.parent.location) ? document.referrer : document.location.href.replace(document.location.pathname + document.location.search, "");
        if (parentRefUrl == "") {
            var parentUrl = "";
        }
        else {
            var parentUrl = parentRefUrl.match(/:\/\/(.[^/]+)/)[1];
        }
        var iframeRefUrl = window.location.href;
        var iframeUrl = iframeRefUrl.match(/:\/\/(.[^/]+)/)[1];
        if (iframeUrl == parentUrl) {
            if (!parent.$(".su-sidebar-collapse").is(":visible")) {
                dashboardElement.css("width", $(window).width());
            }
        }
        else {
            dashboardElement.css("width", $(window).width());
        }
    }
}

function saveFilter(args) {
    currentQueryString = args.data.encryptedData;
    var dashboardElement = $('#dashboard');
    var proxy = dashboardElement.data("ejDashboardDesigner");
    var dashboardviewerObj = dashboardElement.data("ejDashboardDesigner");
    var itemId = dashboardElement.prevAll("#favorite_Item").attr("data-item-id");
    var IsMultiDashboard = dashboardElement.prevAll("#isMultiDashboard").attr("data-item-id");
    var parentDashboardId = dashboardElement.prevAll("#isMultiDashboard").attr("data-parent-id");
    if (args.viewId == null) {
        $("#save-view-popup").ejDialog("open");
        $("#save-view-popup_wrapper").ejWaitingPopup("show");
        $("#save-view-popup-iframe").attr("src", saveViewPopup + "?itemId=" + itemId + "&isMultidashboardId=" + IsMultiDashboard + "&parentId=" + parentDashboardId + "&viewer=v2");
    }
    else {
        dashboardElement.ejWaitingPopup("show");
        $.ajax({
            type: "POST",
            url: updateViewUrl,
            data: { itemId: item_Id, QueryString: currentQueryString, ViewId: args.viewId, UserId: userId, UserName: userName, IsMultiDashboard: isMultiDashboard, parentDashboardId: parentDashboardId },
            beforeSend: function (req) {
                req.setRequestHeader('ejAuthenticationToken', proxy._authenticationToken);
            },
            success: function (data) {
                if (data.Result.Status == true) {
                    initialQueryStringParameter = JSON.stringify(updateInitialQueryStringParameter);
                    dashboardviewerObj.model.filterParameters = currentQueryString;
                    dashboardElement.ejWaitingPopup("hide");
                    messageBox("su-filter", "[[[Update View]]]", "[[[View has been updated successfully.]]]", "success", function () {
                        onCloseMessageBox();
                    });
                }
                else {
                    $("#save-section").hide();
                    dashboardElement.ejWaitingPopup("hide");
                    messageBox("su-filter", "[[[Update View]]]", "[[[Internal server error. Please try again.]]]", "success", function () {
                        onCloseMessageBox();
                    });
                }
            },
            error: function () {
                dashboardElement.ejWaitingPopup("hide");
                messageBox("su-filter", "[[[Update View]]]", "[[[Internal server error. Please try again.]]]", "success", function () {
                    onCloseMessageBox();
                });
            }
        });
        GetSavedFilter();
        refreshScroller();
    }
}

function saveAsFilter(args) {
    currentQueryString = args.data.encryptedData;
    var itemId = $("#dashboard").prevAll("#favorite_Item").attr("data-item-id");
    var IsMultiDashboard = $("#dashboard").prevAll("#isMultiDashboard").attr("data-item-id");
    var parentDashboardId = $("#dashboard").prevAll("#isMultiDashboard").attr("data-parent-id");
    $("#save-view-popup").ejDialog("open");
    $("#save-view-popup_wrapper").ejWaitingPopup("show");
    $("#save-view-popup-iframe").attr("src", saveViewPopup + "?itemId=" + itemId + "&isMultidashboardId=" + IsMultiDashboard + "&parentId=" + parentDashboardId + "&viewer=v2");
}

function closeSaveViewPopup() {
    parent.$("#save-view-popup-iframe").contents().find("#save-view-form").html("");
    parent.$("#save-view-popup_wrapper").ejWaitingPopup("hide");
    parent.$("#save-view-popup").ejDialog("close");
}

function openViewSection() {
    $("#dashboard-view").trigger("click");
}

$(document).on("click", ".saved-view", function (e) {
    if (e.target.className == "saved-view" || e.target.className == "saved-opt" || e.target.className == "saved-filter txt-overflow") {
        var currentTarget = $(this);
        if ($(currentTarget).find(".applied-filters").length == 0) {
            var viewId = $(this).attr("viewid").trim();
            if ($(".saved-list-content-div").find(".applied-filters").length > 0) {
                $(".applied-filters").remove()
            }
            $(".saved-list-content-div").find(".saved-view").css("background-color", "initial").css("border-top", "0");
            $(currentTarget).append($("<span class='col-sm-4 no-padding loader-gif' style='display:inline; background-image:url(" + dashboardServerResourceUrl + "/images/waitingpopup.gif); background-size:cover; position:absolute; height:25px; width:25px;'></span>"));
            $.ajax({
                url: getViewParameterUrl,
                data: { itemId: item_Id, UserId: userId, UserName: userName, IsMultiDashboard: isMultiDashboard, ViewId: viewId, parentDashboardId: parentDashboardId },
                type: "POST",
                success: function (data) {
                    var Result = jQuery.parseJSON(data.viewDetails);
                    var viewerObj = $("#dashboard").data("ejDashboardDesigner");
                    if (viewerObj) {
                        var result = viewerObj._parseParameterQuery(Result.QueryString);
                        if (result != null && result.length > 0) {
                           
                            for (var i = 0; i < result.length; i++) {
                                list = "<div class='applied-filters'><label class='list-items'>" + result[i].ColumnName + "</label><br />";
                                for (var j = 0; j < result[i].Data.length; j++) {
                                    list += "<label class='list-items'>" + result[i].Data[j] + "</label><br />";
                                }
                                list += "</div>";
                                currentTarget.find(".applied-filters").length == 0 ? currentTarget.append(list) : $(".applied-filters").last().after(list);
                            }

                        }
                    }
                    $(currentTarget).css("background-color", "#f2f2f2");
                    $(currentTarget).css("border-top", "0.5px solid #C4CED7");
                    $("span.loader-gif").remove();
                }
            });
        }
    }
});

$(document).on("keydown", "#view-name", function (e) {
    if (e.keyCode == 13) {
        e.preventDefault();
        $("#save-button").trigger("click");
    }
});

function switchFullscreenMode() {
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else {
            if ("ActiveXObject" in window) {
                var wscript = new ActiveXObject("Wscript.shell");
                wscript.SendKeys("{F11}");
                setTimeout(function () {
                    if ((screen.availHeight || screen.height - 30) <= window.innerHeight) {
                        $("body").addClass("hide-dashboard-icons");
                        $(".tv-mode-icon").removeClass("su-maximize-1").addClass("su-minimize").attr("data-tooltip", "[[[Exit Fullscreen]]]");
                    } else {
                        $("body").removeClass("hide-dashboard-icons");
                        $(".tv-mode-icon").addClass("su-maximize-1").removeClass("su-minimize").attr("data-tooltip", "[[[Fullscreen]]]");
                    }
                }, 400);
            }
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}

function createLoader(element) {
    var returnId = "";
    if (typeof element === "string") {
        var selector = (element.indexOf(".") === 0) ? "." : "#";
        element = (element.indexOf(".") === 0) ? element.slice(1, element.length) : (element.indexOf("#") === 0) ? element.slice(1, element.length) : element;
        returnId = element + "-loader-icon";

        if ($("#" + returnId).length == 0 && $(selector + element).length != 0) {
            var template = $("<div class='loader-blue loader-icon' id='" + returnId + "'><svg class='circular'><circle class='path' cx='27' cy='27' r='20' fill='none' stroke-width='4' stroke-miterlimit='10'></circle></svg></div>");
            $("body").append(template);
        }
        return returnId;
    }
    else {
        element = element.selector;
        var selector = (element.indexOf(".") === 0) ? "." : "#";
        element = element.slice(1, element.length);
        returnId = element + "-loader-icon";
        if ($("#" + returnId).length == 0 && $(selector + element).length != 0) {
            var template = $("<div class='loader-blue loader-icon' id='" + returnId + "'><svg class='circular'><circle class='path' cx='27' cy='27' r='20' fill='none' stroke-width='4' stroke-miterlimit='10'></circle></svg></div>");
            $("body").append(template);
        }
    }

    return returnId;
}
function fullscreenExitHandler() {
    if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        $("body").removeClass("hide-dashboard-icons");
        $(".tv-mode-icon").addClass("su-maximize-1").removeClass("su-minimize").attr("data-tooltip", "[[[Fullscreen]]]");
    } else {
        $("body").addClass("hide-dashboard-icons");
        $(".tv-mode-icon").removeClass("su-maximize-1").addClass("su-minimize").attr("data-tooltip", "[[[Exit Fullscreen]]]");
    }

    var data = $("#dashboard").ejDashboardDesigner();
    data.resize();
    if (window.top != window.self && iframeUrl === parentUrl) {
        var windowwidth = parent.$("#dashboard_render_iframe").width();
        parent.$("#dashboard_render_iframe").contents().find("#dashboard").css("width", windowwidth);        
    }
}

(function ($) {
    $.fn.swipeDetector = function (options) {
        var swipeState = 0;
        var startX = 0;
        var startY = 0;
        var pixelOffsetX = 0;
        var pixelOffsetY = 0;
        var swipeTarget = this;
        var defaultSettings = {
            swipeThreshold: 70,
            useOnlyTouch: false
        };

        (function init() {
            options = $.extend(defaultSettings, options);
            swipeTarget.on('mousedown touchstart', swipeStart);
            $('html').on('mouseup touchend', swipeEnd);
            $('html').on('mousemove touchmove', swiping);
        })();

        function swipeStart(event) {
            if (options.useOnlyTouch && !event.originalEvent.touches)
                return;

            if (event.originalEvent.touches)
                event = event.originalEvent.touches[0];

            if (swipeState === 0) {
                swipeState = 1;
                startX = event.clientX;
                startY = event.clientY;
            }
        }

        function swipeEnd(event) {
            if (swipeState === 2) {
                swipeState = 0;

                if (Math.abs(pixelOffsetX) > Math.abs(pixelOffsetY) &&
                    Math.abs(pixelOffsetX) > options.swipeThreshold) {
                    if (pixelOffsetX < 0) {
                        swipeTarget.trigger($.Event('swipeLeft.sd'));
                    } else {
                        swipeTarget.trigger($.Event('swipeRight.sd'));
                    }
                } else if (Math.abs(pixelOffsetY) > options.swipeThreshold) {
                    if (pixelOffsetY < 0) {
                        swipeTarget.trigger($.Event('swipeUp.sd'));
                    } else {
                        swipeTarget.trigger($.Event('swipeDown.sd'));
                    }
                }
            }
        }

        function swiping(event) {
            if (swipeState !== 1)
                return;


            if (event.originalEvent.touches) {
                event = event.originalEvent.touches[0];
            }

            var swipeOffsetX = event.clientX - startX;
            var swipeOffsetY = event.clientY - startY;

            if ((Math.abs(swipeOffsetX) > options.swipeThreshold) ||
                (Math.abs(swipeOffsetY) > options.swipeThreshold)) {
                swipeState = 2;
                pixelOffsetX = swipeOffsetX;
                pixelOffsetY = swipeOffsetY;
            }
        }

        return swipeTarget;
    }
}(jQuery));

function PreloadResources(resourceLinkArray, resourceType) {
    setTimeout(function () {
        var isSafariOrEdge = (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) || (navigator.userAgent.indexOf("Edge") != -1);
        for (var resource = 0; resource < resourceLinkArray.length; resource++) {
            var preloadLink = document.createElement("link");
            preloadLink.href = resourceLinkArray[resource];
            preloadLink.rel = isSafariOrEdge ? "preload" : "prefetch";
            preloadLink.as = resourceType;
            document.head.appendChild(preloadLink);
        }
    });
}