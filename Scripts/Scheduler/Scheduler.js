var reportItemName = "";
var reportItemId = "";
var reportCategoryName = "";
var multiDashboardName = "";
var childId = "";
var createdItemId = "";
var url = "";
var alertChange = 1;
var dateFormat = "";
var timeFormat = "";
var listDashboards = "";
var childDashboards = "";
var item = "";
var condition = "";
var itemConditionArray = "";
var recurrence = "";
var endType = "";
var endDate = "";
var endAfter = "";
var startDate = "";
var itemRecurrence = "";
var frequency = "";
var exportType = "";
var subscriberExternalRecipient = "";
var subscriberGroup = "";
var subscriberUser = ""
var itemConditionCategory = "";
var itemWidgetName = "";
var emailContent = "";
var buttonValue = "";
$(document).ready(function () {
    dateFormat = $("#dateFormat").val();
    timeFormat = $("#timeFormat").val();
});

function createSchedule(itemId, itemName, categoryName, multidashboardname) {
    itemName != "" ? $(".schedule-popup-title").html(" " + itemName + " - Schedule") : $(".schedule-popup-title").html(" " + itemName + " Schedule");
    $(".schedule-popup-title").attr("title", itemName);
    parent.$("#popup-container_wrapper").ejWaitingPopup("hide");
    reportItemId = itemId;
    reportItemName = itemName;
    reportCategoryName = categoryName;
    multiDashboardName = multidashboardname;
    childId = itemId;
    $("#selected_dashboard").change();
}

function scheduleNameCheck(scheduleId, scheduleName) {
    $("#schedule-name-error-container").css("display", "none");
    $("span.loader-gif").remove();
    $("#schedule-name-error-container").parent().append($("<span class='col-sm-4 no-padding loader-gif' style='display:block; margin-left: -28px; height: 30px; background-size: contain; width: 30px; margin-top: 0;background-image:url(" + rootBaseUrl + "content/styles/essentialjs/images/waitingpopup.gif);'></span>"));
    $.ajax({
        type: "POST",
        url: checkScheduleNameExistUrl,
        data: { scheduleId: scheduleId, scheduleName: scheduleName },
        success: function (data) {
            if (data.Result) {
                $("span.loader-gif").remove();
                $("#schedule-name").closest("div").addClass("has-error");
                $("#schedule-name-error-container").css("display", "block");
                $("#schedule-name-error-container").css("margin-left", "-30px");
                $("#schedule-name-validator").html("[[[Schedule name already exists]]]");
            } else {
                $("#schedule-name").closest("div").removeClass("has-error");
                $("span.loader-gif").remove();
                $("#schedule-name-error-container").css("display", "none");
            }
        }
    });
}

function addTitleForCategory() {
    $("#selected_category").selectpicker("refresh");
    for (var i = 0; i < $(".category-dropdown  .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $(".category-dropdown .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $(".category-dropdown .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
    }
}

function addTitleForDashboard() {
    $("#selected_dashboard").selectpicker("refresh");
    for (var i = 0; i < $(".dashboard-dropdown  .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $(".dashboard-dropdown .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $(".dashboard-dropdown .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
    }
}

function addTitleForChildDashboards() {
    $("#selected_childdashboard").selectpicker("refresh");
    for (var i = 0; i < $(".childdashboard-dropdown  .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $(".childdashboard-dropdown .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $(".childdashboard-dropdown .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
    }
}

function validateSchedule(current) {
    var startDateTimeObj = $("#start-date").data("ejDateTimePicker");
    var scheduleName = $("#schedule-name").val();
    if (!($("#schedule-name-error-container").css("display") == "block") && !($("body .loader-gif").length) && $("#selected_category option:selected").val() != "" && $("#selected_dashboard option:selected").val() != "" && scheduleName) {
        if (!parent.IsValidName("name", scheduleName)) {
            $("#schedule-name-error-container").css("display", "block");
            $("#schedule-name-error-container").css("margin-left", "-44px");
            $("#schedule-name-validator").html("[[[Please avoid special characters]]]");
            return false;
        }
        if ($(current).hasClass("subscribe-body")) {
            switch ($("#recurrence-type").val().toString().toLowerCase()) {
                case "daily":
                    break;
                case "weekly":
                    if (!$('#days-check-box input[type="checkbox"]').is(":checked")) {
                        $("#weekly-day-error-container").css("display", "block");
                        $("#weekly-days-validator").html("[[[Please select at least one day.]]]");
                        return false;
                    }
                    else {
                        $("#weekly-day-error-container").css("display", "none");
                    }
                    break;
                case "monthly":
                    break;
                case "yearly":
                    var currentMonth = $("#yearly-month").val().toString();
                    var day = parseInt($("#yearly-day").val());
                    var dayObject = $("#yearly-day").data("ejNumericTextbox");
                    switch (currentMonth.toLowerCase()) {
                        case "february":
                            if (day > 28) {
                                dayObject.option("value", 28);
                            }
                            break;

                        case "april":
                        case "june":
                        case "september":
                        case "november":
                            if (day > 30) {
                                dayObject.option("value", 30);
                            }
                            break;

                        case "january":
                        case "march":
                        case "may":
                        case "july":
                        case "august":
                        case "october":
                        case "december":
                            if (day > 31) {
                                dayObject.option("value", 31);
                            }
                            break;
                    }
                    break;
                case "hourly":
                    if ($(".time-width").val() == "") {
                        $(".frequency-error").css("display", "inline");
                        $(".time-width").parent("span").addClass("validation-error");
                        return false;
                    }
                    else {
                        var time = $(".time-width").val();
                        var timesplit = time.split(':');
                        var minutes = (timesplit[0] * 60) + timesplit[1];
                        if (minutes > 3) {
                            $(".frequency-error").css("display", "none");
                            $(".time-width").parent("span").removeClass("validation-error");
                        } else {
                            $(".frequency-error").css("display", "inline");
                            $(".time-width").parent("span").addClass("validation-error");
                            return false;
                        }
                    }
                    break;
            }

            if (!startDateTimeObj.model.dateTimeFormat == "M/d/yyyy h:mm tt") {
                $("#start-date-error-container").css("display", "block");
                $("#start-date-validator").html("[[[Please enter schedule name]]]");
                return false;
            }
            else {
                $("#start-date-error-container").css("display", "none");
            }

            switch ($('input[name=end-type]:checked', "#schedule-end-type").val().toLowerCase()) {
                case "endby":
                    var endDateTimeObj = $("#end-date").data("ejDateTimePicker");
                    if (!endDateTimeObj.model.dateTimeFormat == "M/d/yyyy h:mm tt") {
                        $("#end-date-error-container").css("display", "block");
                        $("#end-date-validator").html("[[[Please enter schedule name]]]");
                        return false;
                    }
                    else {
                        $("#end-date-error-container").css("display", "none");
                    }
                    break;
            }
            return true;
        }
    } else {
        if ($("#selected_category option:selected").val() == "") {
            $("#category-message").css("display", "block");
        }
        if ($("#selected_dashboard option:selected").val() == "") {
            $("#dashboard-message").css("display", "block");
        }
        if (!scheduleName) {
            $("#schedule-name-error-container").css("display", "block");
            $("#schedule-name-error-container").css("margin-left", "-44px");
            $("#schedule-name-validator").html("[[[Please enter schedule name]]]");
        }
        return false;
    }
    return true;
}

$(document).on("click", "#schedule-submit-cancel,#schedule-popup,#schedule-next-cancel", function (event) {
    closePopupContainer();
});

$(document).keyup(function (e) {
    if (e.keyCode == 27) closePopupContainer();
});

function closePopupContainer() {
    parent.$("#popup-container").ejDialog("close");
}

$(document).on("change", "#selected_category", function () {
    reportCategoryName = "";
    itemName = "";
    var selected = $(this).find("option:selected").text();
    if ($(this).find("option:selected").val() == "" || $(this).find("option:selected").val() != "") {
        $(".schedule-popup-title").html(" [[[Schedule]]]");
        $(".schedule-popup-title").attr("title", "");
    }
    $("#selected_dashboard").attr("disabled", true);
    $(".dashboard-dropdown").append($("<span class='col-sm-4 no-padding loader-gif' style='display:block; background-image:url(" + rootBaseUrl + "content/styles/essentialjs/images/waitingpopup.gif); background-size:cover; left:255px; position:absolute; height:30px; width:30px; top:3px'></span>"));
    var filterSettings = [];
    filterSettings.push({ PropertyName: "CategoryName", FilterType: "equals", FilterKey: selected });
    var invalid = undefined;
    if (itemId != null) {
        listDashboards = "";
    }
    $.ajax({
        type: "POST",
        url: getDashboardUrl,
        async:false,
        data: { searchKey: invalid, skip: 0, take: 20, sorted: invalid, filterCollection: filterSettings, displayCategory: "SpecificCategory" },
        success: function (result, data) {
            $("#selected_dashboard").attr("disabled", false);
            $(".dashboard-dropdown span.loader-gif").remove();
            var dashboards = result.result;
            for (var t = 0; t < dashboards.length; t++) {
                listDashboards += '<option value="' + dashboards[t].Id + '">' + dashboards[t].Name + '</option>';
            }
            $("#selected_dashboard").html("");
            $("#selected_dashboard").html('<option value="" selected="selected" class="hide-option" disabled>[[[Select dashboard]]]</option>' + listDashboards).selectpicker("refresh");
            $("#selected_childdashboard").attr("disabled", true);
            $("#selected_childdashboard").html("");
            $("#selected_childdashboard").html('<option value="" selected="selected" class="hide-option" disabled="disabled">[[[Select dashboard]]]</option>').selectpicker("refresh");
            addTitleForDashboard();
        }
    });
    if ($("#selected_category option:selected").val() != "") {
        $("#category-message").css("display", "none");
    }
});

$(document).on("change", "#selected_dashboard", function () {
    $("#selected_childdashboard").attr("disabled", true);
    var selected = $(this).find("option:selected").text();
    var itemId = $(this).find("option:selected").val();
    createdItemId = itemId;
    $(".childdashboard-dropdown .bootstrap-select").append($("<span class='no-padding loader-gif' style='display:block; background-image:url(" + rootBaseUrl + "content/styles/essentialjs/images/waitingpopup.gif); background-size:cover; left:110px; position:absolute; height:30px; width:30px; top:0px;'></span>"));
    var filterSettings = [];
    filterSettings.push({ PropertyName: "Name", FilterType: "equals", FilterKey: selected });
    var invalid = undefined;
    var listItems = "";
    var childItems = "";
    if (itemId != "") {
        $(".schedule-popup-title").html(" " + selected + " - [[[Schedule]]]");
        $(".schedule-popup-title").attr("title", selected);
    }
    else {
        $(".schedule-popup-title").html(" [[[Schedule]]]");
        $(".schedule-popup-title").attr("title", "");
    }
    $(".items-dropdown select").html("");
    $(".items-dropdown").append($("<span class='no-padding loader-gif' style='display:block; background-image:url(" + rootBaseUrl + "content/styles/essentialjs/images/waitingpopup.gif); background-size:cover; left:70px; position:absolute; height:30px; width:30px; top:8px;'></span>"));
    $(".items-dropdown").find("select").attr("disabled", true);
    if (itemId != "") {
        $.ajax({
            type: "POST",
            url: getChildDashboardUrl,
            data: { parentId: itemId },
            success: function (result, data) {
                $(".childdashboard-dropdown span.loader-gif").remove();
                var dashboards = result.result;
                if (dashboards !== null) {
                    $("#selected_childdashboard").attr("disabled", false);
                    for (var t = 0; t < dashboards.length; t++) {
                        if (dashboards[t].DashboardId !== childId) {
                            childItems += '<option data-designerid=' +
                                dashboards[t].DesignerId +
                                ' value="' +
                                dashboards[t].DashboardId +
                                '">' +
                                dashboards[t].Name +
                                '</option>';
                        } else {
                            childItems += '<option data-designerid=' +
                                dashboards[t].DesignerId +
                                ' value="' +
                                dashboards[t].DashboardId +
                                '" selected="selected">' +
                                dashboards[t].Name +
                                '</option>';
                        }
                    }
                }
                $("#selected_childdashboard").html("");
                $("#selected_childdashboard").append('<option value="" selected=selected>[[[All]]]</option>' + childItems).selectpicker("refresh");
                addTitleForChildDashboards();
                $("#selected_childdashboard").trigger('change');
            }
        });
    }
    if ($("#data-changes-container").length > 0) {
        $.ajax({
            type: "POST",
            url: getwidgetUrl,
            data: { itemId: itemId },
            success: function (data) {
                var widget = data;
                var listWidgets = "";
                for (var t = 0; t < widget.data.length; t++) {
                    var parentName = "";
                    var parentId = "";
                    if (widget.isMultiDashboard == true) {
                        parentName = " (" + widget.data[t].ParentName + ")";
                        parentId = "data-itemid=" + widget.data[t].ParentId;
                    }

                    listWidgets += '<option ' + parentId + '  value="' + widget.data[t].Name + '">' + widget.data[t].Name + ' ' + parentName + '</option>';
                }
                $(".items-dropdown select").append('<option disabled class="hide-option" selected="selected" value="">[[[Select Widget]]]</option>' + listWidgets).selectpicker("refresh");
                addTitleForWidgets();
                $("#selected-items").change();
                $("#data-changes-container #condition-div #measure-div,#data-changes-container #condition-div #dimension-div").html("");
                $("#data-changes-container #condition-div #add-condition,#data-changes-container #add-dimension-condition").css("display", "none");
                refreshConditionCategory();
                $("span.loader-gif").remove();
                $(".items-dropdown").find("select").removeAttr("disabled");
                $(".items-dropdown").find(".bootstrap-select li,.bootstrap-select .btn-default").removeClass("disabled");
                $(".items-dropdown").find(".dropdown-menu").addClass("alignment-dropdown");
                $(".items-dropdown").find(".dropdown-menu .inner").addClass("alignment-dropdown-inner");
                $(".items-dropdown").find(".dropdown-menu li:first").css("height", "0px");
            }
        });
    }
    $("#schedule-submit").attr("data-report-id", itemId);
    $("#schedule-submit").attr("data-item-id", itemId);
    if ($("#selected_dashboard option:selected").val() != "") {
        $("#dashboard-message").css("display", "none");
    }
});

$(document).on("change", "#selected_childdashboard", function () {
    var selected = $(this).find("option:selected").text();
    var itemId = $(this).find("option:selected").val();
    if (selected == "All") {
        itemId = $("#selected_dashboard").find("option:selected").val();
        selected = $("#selected_dashboard").find("option:selected").text();
        createdItemId = itemId;
    }
    else {
        itemId = $("#selected_childdashboard").find("option:selected").val();
        selected = $("#selected_childdashboard").find("option:selected").text();
        createdItemId = itemId;
    }
    if (itemId != "") {
        $(".schedule-popup-title").html(" " + selected + " - [[[Schedule]]]");
        $(".schedule-popup-title").attr("title", selected);
    }
    else {
        $(".schedule-popup-title").html(" [[[Schedule]]]");
        $(".schedule-popup-title").attr("title", "");
    }
    $(".items-dropdown select").html("");
    $(".items-dropdown").append($("<span class='no-padding loader-gif' style='display:block; background-image:url(" + rootBaseUrl + "content/styles/essentialjs/images/waitingpopup.gif); background-size:cover; left:70px; position:absolute; height:30px; width:30px; top:0px;'></span>"));
    $(".items-dropdown").find("select").attr("disabled", true);
    if ($("#data-changes-container").length > 0) {
        $.ajax({
            type: "POST",
            url: getwidgetUrl,
            data: { itemId: itemId },
            success: function (data) {
                var widget = data;
                var listWidgets = "";
                for (var t = 0; t < widget.data.length; t++) {
                    var parentName = "";
                    var parentId = "";
                    if (widget.isMultiDashboard == true) {
                        parentName = " (" + widget.data[t].ParentName + ")";
                        parentId = "data-itemid=" + widget.data[t].ParentId;
                    }

                    listWidgets += '<option ' + parentId + '  value="' + widget.data[t].Name + '">' + widget.data[t].Name + ' ' + parentName + '</option>';
                }
                $(".items-dropdown select").append('<option disabled class="hide-option" selected="selected" value="">[[[Select Widget]]]</option>' + listWidgets).selectpicker("refresh");
                addTitleForWidgets();
                $("#selected-items").change();
                $("#data-changes-container #condition-div #measure-div,#data-changes-container #condition-div #dimension-div").html("");
                $("#data-changes-container #condition-div #add-condition,#data-changes-container  #add-dimension-condition").css("display", "none");
                refreshConditionCategory();
                $("span.loader-gif").remove();
                $(".items-dropdown").find("select").removeAttr("disabled");
                $(".items-dropdown").find(".bootstrap-select li,.bootstrap-select .btn-default").removeClass("disabled");
                $(".items-dropdown").find(".dropdown-menu").addClass("alignment-dropdown");
                $(".items-dropdown").find(".dropdown-menu .inner").addClass("alignment-dropdown-inner");
                $(".items-dropdown").find(".dropdown-menu li:first").css("height", "0px");
            }
        });
    }
    $("#schedule-submit").attr("data-report-id", itemId);
    $("#schedule-submit").attr("data-item-id", itemId);
    $(".childdashboard-dropdown .btn-group .dropdown-menu.open").removeAttr("style");
    $(".childdashboard-dropdown .btn-group .dropdown-menu.open").css("overflow", "hidden");
});

$(document).on("focusout", "#schedule-name", function (event) {
    var scheduleName = $("#schedule-name").val().trim();
    var idSchedule = "";
    if (actionType == "Create") {
       idSchedule = $("#schedule-submit").attr("data-schedule-id");
    }
    else {
        idSchedule = scheduleId;
    }
    
    if ($.trim(scheduleName) != "") {
        $("#schedule-name").closest("div").removeClass("has-error");
        $("#schedule-name-error-container").css("display", "none");
        if (scheduleName) {
            scheduleNameCheck(idSchedule, scheduleName);
        } else {
            $("#schedule-name-error-container").css("display", "none");
        }
    }
    else {
        $("#schedule-name").closest("div").addClass("has-error");
        $("#schedule-name-error-container").css("display", "block");
        $("#schedule-name-error-container").css("margin-left", "-30px");
        $("#schedule-name-validator").html("[[[Please enter schedule name]]]");
    }
});

$(document).on("keyup", "#schedule-name", function (event) {
    if ($.trim($("#schedule-name").val()) != "") {
        $("#schedule-name").closest("div").removeClass("has-error");
        $("#schedule-name-error-container").css("display", "none");
    }
    else {
        $("#schedule-name").closest("div").addClass("has-error");
        $("#schedule-name-error-container").css("display", "block");
        $("#schedule-name-error-container").css("margin-left", "-30px");
        $("#schedule-name-validator").html("[[[Please enter schedule name]]]");
    }
});

function validateSchedule(current) {
   var scheduleName = $("#schedule-name").val();
    if (!($("#schedule-name-error-container").css("display") == "block") && !($("body .loader-gif").length) && $("#selected_category option:selected").val() != "" && $("#selected_dashboard option:selected").val() != "" && scheduleName) {
        if (!parent.IsValidName("name", scheduleName)) {
            $("#schedule-name-error-container").css("display", "block");
            $("#schedule-name-error-container").css("margin-left", "-44px");
            $("#schedule-name-validator").html("[[[Please avoid special characters]]]");
            return false;
        }
        } else {
        if ($("#selected_category option:selected").val() == "") {
            $("#category-message").css("display", "block");
        }
        if ($("#selected_dashboard option:selected").val() == "") {
            $("#dashboard-message").css("display", "block");
        }
        if (!scheduleName) {
            $("#schedule-name-error-container").css("display", "block");
            $("#schedule-name-error-container").css("margin-left", "-44px");
            $("#schedule-name-validator").html("[[[Please enter schedule name]]]");
        }
        return false;
    }
    return true;
}

$(document).on("click", "#schedule-next", function (event) {
    var scheduleMessage = "";
    if (validateSchedule(this)) {
        if (alertChange == 2) {
            $(".column-condition").change();
            if ($(this).hasClass("time-interval-body")) {
                saveCondition();
                if (validation != 1) {
                    var filters = $(".filterareainput");
                    var selectOptions = "";
                    for (var t = 0; t < filters.length; t++) {
                        selectOptions += "<optgroup data-id=" + filters.eq(t).val() + " label='Filter : " + filters.eq(t).val() + "'>";
                        var selectedColumns = filters.eq(t).parents(".condition-div-statement").find(".measure-statement select.select-condition");
                        for (var i = 0; i < selectedColumns.length; i++) {
                            if (selectedColumns.eq(i).val() != null) {
                                selectOptions += "<option value='" + selectedColumns.eq(i).val() + "'>" + selectedColumns.eq(i).find("[value='" + selectedColumns.eq(i).val() + "']").text() + "</option>"
                            }
                        }
                        selectOptions += "</optgroup>";
                    }
                    $("#widget-items").html(selectOptions).selectpicker("refresh");
                }
                else {
                    saveCondition();
                }
            }
            else if ($(this).hasClass("subscribe-body")) {
                validateNextSchedule();
            }
            else if ($(this).hasClass("email-editor-body")) {
                url = emailEditor;
                var commentText = cursorPos.value();
                var commentHTML = cursorPos.options.previewRender(commentText).replace("#", "");
                commentText = getRelativePath(commentText);
                var commentOriginalValue = commentText;
                var commentTextValue = commentOriginalValue.replace("http://", '')
                                                           .replace("https://", '')
                                                           .replace("(", '')
                                                           .replace(")", '')
                                                           .replace("![]", '');
                if (isEmptyOrWhitespace(commentHTML.replace(/<[^>]*>!/ig, "")) || isEmptyOrWhitespace(commentTextValue)) {
                    $("#email-content-validation").html("[[[Email message should not be blank]]]");
                    return;
                }
                if (commentText.length > 4000) {
                    $("#email-content-validation").html("[[[Email message is too long]]]");
                    return;
                } else {
                    $("#email-content-validation").html("");
                    url = recurrenceType;
                    enableTimeIntervalOption();
                }
                $("#schedule-next").removeClass("email-editor-body");
            }
            else {
                url = dataChanges;
                enableDataNotificationOption();
            }
        }
        else {
            var frequecy = $("#frequency").css("display")
            if (frequecy == "block") {
                $("#recurrence-type option[value='Hourly']").attr("selected", "selected");
                $("#recurrence-type").selectpicker("refresh");
            }
            if ($(this).hasClass("time-interval-body")) {
                url = recurrenceType;
                enableTimeIntervalOption();
                }
            else if ($(this).hasClass("subscribe-body")) {
                validateNextSchedule();
                
            }
            else {
                url = recurrenceType;
                enableTimeIntervalOption();
            }
        }
        }
});

$(document).on("click", "#schedule-back", function (event) {
    if ($("#schedule-next").parent("div").css("display") == "none") {
        enableTimeIntervalOption();
    }
    else {
        if ($("#schedule-next").hasClass("subscribe-body")) {
            if (alertChange == 1) {
                enableScheduleOption();
            }
            else {
                enableEmailEditor();
            }
            $("#schedule-next").removeClass("subscribe-body");
        }
        else if ($("#schedule-next").hasClass("time-interval-body")) {
            enableScheduleOption();
        }
        else if ($("#schedule-next").hasClass("email-editor-body")) {
            enableDataNotificationOption();
            $("#schedule-next").removeClass("email-editor-body");
        }
    }
});

$(document).on("click", "#data-alerts", function () {
    if ($("#data-alerts").prop("checked") == true) {
        alertChange = 2;
    }
    else {
        alertChange = 1;
    }
    if ($("#schedule-next").hasClass("subscribe-body") || $("#schedule-next").hasClass("time-interval-body")) {
        $("#schedule-next").removeClass("subscribe-body");
        $("#schedule-next").removeClass("time-interval-body");
    }
});

function enableTimeIntervalOption() {
    $(".schedule-popup-body").css("display", "none");
    $("#windowCaption").html("[[[Choose the recurrence intervals for the dashboard server to start scheduling]]]");
    $(".schedule-dialog .modal-body #time-intervals-div").css("display", "inline");
    $(".schedule-dialog #data-changes-div-container,.schedule-dialog #data-changes-container,.schedule-dialog #email-editor-panel").css("display", "none");
    $(".subscribe-popup-body").css("display", "none");
    $("#next-container").css("display", "block");
    $("#submit-container").css("display", "none");
    if ($("#schedule-next").hasClass("time-interval-body")) {
        $("#schedule-next").removeClass("time-interval-body");
    }
    $("#schedule-next").addClass("subscribe-body");
    $("#schedule-back").css("display", "inline");
    className = "time-intervals-div";
    if ($(".schedule-dialog").find("#time-intervals-div").length <= 0) {
        partialPost(url, className);
    }
}

function enableDataNotificationOption() {
    $("#windowCaption").html("[[[Set a condition for which you need alerts]]]");
    $(".schedule-popup-body,#email-editor-panel").css("display", "none");
    $(".schedule-dialog #data-changes-div-container,.schedule-dialog #data-changes-container").css("display", "inline");
    $("#data-changes-container_wrapper,#data-changes-container,#data-changes-div-container").css("display", "inline");
    $("#time-intervals-div").css("display", "none");
    $(".subscribe-popup-body").css("display", "none");
    $("#next-container").css("display", "block");
    $("#submit-container").css("display", "none");
    if ($("#schedule-next").hasClass("subscribe-body")) {
        $("#schedule-next").removeClass("subscribe-body");
    }
    $("#schedule-next").addClass("time-interval-body");
    $("#schedule-back").css("display", "inline");
    className = "data-changes-container";
    if ($(".schedule-dialog").find("#data-changes-container").length <= 0) {
          partialPostDataChanges(url, className);
        }  
}

function enableSubscribeOption() {
    $("#windowCaption").html("[[[Choose the subscribers and export format]]]");
    $(".schedule-popup-body").css("display", "none");
    $(".schedule-dialog .modal-body #email-editor-panel,.schedule-dialog .modal-body #time-intervals-div").css("display", "none");
    $(".schedule-dialog #data-changes-div-container,.schedule-dialog #data-changes-container").css("display", "none");
    $(".subscribe-popup-body").fadeIn();
    $("#next-container").css("display", "none");
    $("#submit-container").css("display", "block");
    $("#schedule-back").css("display", "inline");
    className = "subscribers-panel";
    if ($(".schedule-dialog").find("#subscribers-panel").length <= 0) {
        partialPost(url, className);
    }
}

function enableScheduleOption() {
    $("#windowCaption").html("[[[Create a data driven or a time based schedule]]]");
    $(".subscribe-popup-body, #next-container, #submit-container,#time-intervals-div,#data-changes-container").css("display", "none");
    $(".schedule-popup-body").fadeIn();
    $("#next-container").css("display", "block");
    $("#schedule-back").css("display", "none");
    if ($("#schedule-next").hasClass("subscribe-body") || $("#schedule-next").hasClass("time-interval-body")) {
        $("#schedule-next").removeClass("subscribe-body");
        $("#schedule-next").removeClass("time-interval-body");
        $("#schedule-next").removeClass("email-editor-body");
    }
}

function enableEmailEditor() {
    $("#windowCaption").html("[[[Enter the alert message to be added in the scheduled email]]]");
    $(".schedule-popup-body").css("display", "none");
    $(".schedule-dialog .modal-body #time-intervals-div,.schedule-dialog .modal-body #subscribers-panel").css("display", "none");
    $(".schedule-dialog #data-changes-div-container,.schedule-dialog #data-changes-container").css("display", "none");
    $("#email-editor-panel").css("opacity", "1");
    $("#email-editor-panel").fadeIn();
    $("#next-container").css("display", "block");
    $("#submit-container").css("display", "none");
    if ($("#schedule-next").hasClass("subscribe-body") || $("#schedule-next").hasClass("time-interval-body")) {
        $("#schedule-next").removeClass("subscribe-body");
        $("#schedule-next").removeClass("time-interval-body");
        $("#schedule-next").addClass("email-editor-body");
    }
    $("#schedule-back").css("display", "inline");
    className = "email-editor-panel";
    if ($(".schedule-dialog").find("#email-editor-panel").length <= 0) {
        partialPost(url, className);
    }
}

function partialPost(url, className) {
    if (!$(".schedule-dialog").hasClass(className)) {
        parent.$("#popup-container_wrapper").ejWaitingPopup("show");
        $.ajax({
            type: "POST",
            url: url,
            data: {},
            cache: false,
            dataType: 'html',
            success: function (data) {
                $(".modal-body").append(data);
                if (className == "subscribers-panel") {
                    $(".schedule-dialog #subscribers-panel").css("display", "inline");
                    getAllStaticData();
                    if (actionType == "Create") {
                        $("select#user-search option").each(function (i) {
                            if ($(this).val().toLowerCase() == $("#userName").val().toLowerCase()) {
                                var currentuser = $(this).text();
                                $(this).attr("selected", true);
                                $("#user-search").selectpicker("refresh");
                                var userTile = $("<div>").attr("id", $(this).val()).attr("data-searchtype", "userSearch").addClass("SelectedShareItems");
                                userTile.html("<div class='InstantSearch'><span class='details' title='" + currentuser + "'>" + currentuser
                                    + "</span><div style='width:auto' class='instant-cancel'><span class='su su-close i-selected-cancel'/></div></div>");
                                $("#selected-users").append(userTile);
                            }
                        });
                    }
                    else {
                        for (var i = 0; i < subscriberUser.length; i++) {
                            $("#user-search option[value='" + subscriberUser[i] + "']").attr("selected", true);
                            $("#user-search").selectpicker("refresh");
                            var user = $("#user-search option[value='" + subscriberUser[i] + "']").text();
                            var userTile = $("<div>").attr("id", subscriberUser[i]).attr("data-searchtype", "userSearch").addClass("SelectedShareItems");
                            userTile.html("<div class='InstantSearch'><span class='details' title='" + user.trim() + "'>" + user.trim() + "</span><div style='width:auto' class='instant-cancel'><span class='su su-close i-selected-cancel'/></div></div>");
                            $("#selected-users").append(userTile);
                        }

                        oldUserSelected = $("#user-search").val();
                        for (var i = 0; i < subscriberGroup.length; i++) {
                            $("#group-search option[value='" + subscriberGroup[i] + "']").attr("selected", true);
                            $("#group-search").selectpicker("refresh");
                            var group = $("#group-search option[value='" + subscriberGroup[i] + "']").text();
                            var groupTile = $("<div>").attr("id", subscriberGroup[i]).attr("data-searchtype", "groupSearch").addClass("SelectedShareItems");
                            groupTile.html("<div class='InstantSearch'><span class='details' title='" + group.trim() + "'>" + group.trim() + "</span><div style='width:auto' class='instant-cancel'><span class='su su-close i-selected-cancel'/></div></div>");
                            $("#selected-users").append(groupTile);
                        }
                        oldGroupSelected = $("#group-search").val();

                        for (var i = 0; i < subscriberExternalRecipient.length; i++) {
                            var emailid = subscriberExternalRecipient[i];
                            var externalRecipientTile = $("<div>").attr("id", subscriberExternalRecipient[i]).attr("data-searchtype", "externalRecipient").addClass("SelectedShareItems");
                            externalRecipientTile.html("<div class='InstantSearch'><span class='details'title='" + emailid + "'>" + emailid + "</span><div style='width:auto' class='instant-cancel'><span class='su su-close i-selected-cancel'/></div></div>");
                            $("#selected-users").append(externalRecipientTile);
                        }

                        var selectedCountGroup = $("#group-search-container .bootstrap-select li.selected").length;
                        var allListCountGroup = $("#group-search-container .bootstrap-select li").length;
                        var selectedCountUser = $("#user-search-container .bootstrap-select li.selected").length;
                        var allListCountUser = $("#user-search-container .bootstrap-select li").length;
                        if (selectedCountGroup === allListCountGroup) {
                            $("#group-search-container .bs-select-all-custom").removeClass('bs-select-all-custom').addClass('bs-deselect-all-custom');
                        }
                        if (selectedCountUser === allListCountUser) {
                            $("#user-search-container .bs-select-all-custom").removeClass('bs-select-all-custom').addClass('bs-deselect-all-custom');
                        }
                        $("#image-export").prop("checked", exportType.toLowerCase() == "image");
                        $("#pdf-export").prop("checked", exportType.toLowerCase() == "pdf");
                        $("#excel-export").prop("checked", exportType.toLowerCase() == "excel");
                        $("#schedule-submit").attr("data-schedule-id", scheduleId);
                    }
                    selectedItemsCount();
                    validateExternalRecipient();
                    addTitleForUsersAndGroups();
                     }
                else if (className == "email-editor-panel") {
                    $(".schedule-dialog #email-editor-panel").css("display", "inline");
                    var filters = $(".filterareainput");
                    var selectOptions = "";
                    for (var t = 0; t < filters.length; t++) {
                        selectOptions += "<optgroup data-id=" + filters.eq(t).val() + " label='Filter : " + filters.eq(t).val() + "'>";
                        var selectedColumns = filters.eq(t).parents(".condition-div-statement").find(".measure-statement select.select-condition");
                        for (var i = 0; i < selectedColumns.length; i++) {
                            if (selectedColumns.eq(i).val() != null) {
                                selectOptions += "<option value='" + selectedColumns.eq(i).val() + "'>" + selectedColumns.eq(i).find("[value='" + selectedColumns.eq(i).val() + "']").text() + "</option>"
                            }
                        }
                        selectOptions += "</optgroup>";
                    }
                    $("#widget-items").html(selectOptions).selectpicker("refresh");
                    cursorPos = renderMde("#rte-post");
                    if (actionType == "Create") {
                        //Do not add localization here, since it has been added for mail content
                        cursorPos.value("Hi {:Username},\n\nThe configured data notification condition has been met. \n \nPlease find a snapshot of the current state of the dashboard attached.\n\nRegards,\n\n{:OrganizationName}");
                    }
                    else {
                        if (emailContent == null) {
                            //Do not add localization here, since it has been added for mail content
                            cursorPos.value("Hi {:Username},\n\nThe configured data notification condition has been met. \n \nPlease find a snapshot of the current state of the dashboard attached.\n\nRegards,\n\n{:OrganizationName}");
                        }
                        else {
                            cursorPos.value(emailContent);
                        }
                    }
                    cursorPos.codemirror.refresh();
                }
                else if (className == "time-intervals-div") {
                    $(".schedule-dialog #time-intervals-div").css("display", "inline");
                    $(".time-width").ejTimePicker({
                        timeFormat: "HH:mm",
                        minutesInterval: 5,
                        minTime: "00:10",
                        change: function (args) {
                            var scheduleMessage = createScheduleMessage(false);
                            $("#schedule-message").text(scheduleMessage);
                        }
                    });
                    $("#weekly-schedule-option,#monthly-schedule-option,#yearly-schedule-option,#daily-schedule-option").css("display", "none");
                    if (actionType == "Create") {
                        scheduleMessage = createScheduleMessage(false);
                        $("#schedule-message").text(scheduleMessage);
                    }
                    else {
                        $("#frequency").css("display", "none");
                        switch ((recurrence).toLowerCase()) {
                            case "hourly":
                                recurrenceType = "Hourly";
                                $("#frequency").css("display", "block");
                                $("#hourly-schedule-option").css("display", "block");
                                var mins = (frequency % 60) < 10 ? ("0" + (frequency % 60)) : frequency % 60;
                                var hours = (parseInt(frequency / 60) < 10) ? ("0"+ parseInt(frequency/60)) : parseInt(frequency / 60);
                                conversionToMinutes = hours + ":" + mins;
                                $("#frequency").find("input").val(conversionToMinutes);
                                break;
                            case "daily":
                                recurrence = "Daily";
                                $("#daily-schedule-option").css("display", "block");
                                $("#daily-every-x-days").prop("checked", true);
                                var everyXDaysObj = $("#every-x-days").data("ejNumericTextbox");
                                everyXDaysObj.option("value", itemRecurrence.DailySchedule.DaysInterval);
                                break;

                            case "dailyweekday":
                                recurrence = "Daily";
                                $("#daily-schedule-option").css("display", "block");
                                $("#daily-weekdays").prop("checked", true);
                                break;

                            case "weekly":
                                recurrence = "Weekly";
                                $("#weekly-schedule-option").css("display", "block");
                                var everyXWeeksObj = $("#every-x-weeks").data("ejNumericTextbox");
                                everyXWeeksObj.option("value", itemRecurrence.WeeklySchedule.WeeksInterval);
                                $("#sun").prop("checked", itemRecurrence.WeeklySchedule.DaysOfWeek.Sunday);
                                $("#mon").prop("checked", itemRecurrence.WeeklySchedule.DaysOfWeek.Monday);
                                $("#tues").prop("checked", itemRecurrence.WeeklySchedule.DaysOfWeek.Tuesday);
                                $("#wed").prop("checked", itemRecurrence.WeeklySchedule.DaysOfWeek.Wednesday);
                                $("#thu").prop("checked", itemRecurrence.WeeklySchedule.DaysOfWeek.Thursday);
                                $("#fri").prop("checked", itemRecurrence.WeeklySchedule.DaysOfWeek.Friday);
                                $("#sat").prop("checked", itemRecurrence.WeeklySchedule.DaysOfWeek.Saturday);
                                break;

                            case "monthly":
                                recurrence = "Monthly";
                                $("#monthly-schedule-option").css("display", "block");
                                $("#monthly").prop("checked", true);
                                var monthlyDateObj = $("#monthly-date").data("ejNumericTextbox");
                                monthlyDateObj.option("value", itemRecurrence.MonthlySchedule.DayOfMonth);
                                var monthlyEveryXMonthsObj = $("#monthly-every-x-months").data("ejNumericTextbox");
                                monthlyEveryXMonthsObj.option("value", itemRecurrence.MonthlySchedule.Months);
                                break;

                            case "monthlydow":
                                recurrence = "Monthly";
                                $("#monthly-schedule-option").css("display", "block");
                                $("#monthly-dow").prop("checked", true);
                                $("#monthly-dow-week option[value='" + itemRecurrence.MonthlyDowSchedule.WeeksOfTheMonth + "']").attr("selected", true);
                                $("#monthly-dow-week").selectpicker("refresh");
                                $("#monthly-dow-day option[value='" + itemRecurrence.MonthlyDowSchedule.DaysOfTheWeek + "']").attr("selected", true);
                                $("#monthly-dow-day").selectpicker("refresh");
                                var monthlyDOWEveryXMonthsObj = $("#monthly-dow-every-x-months").data("ejNumericTextbox");
                                monthlyDOWEveryXMonthsObj.option("value",itemRecurrence.MonthlyDowSchedule.Months);
                                break;

                            case "yearly":
                                recurrence = "Yearly";
                                $("#yearly-schedule-option").css("display", "block");
                                $("#yearly").prop("checked", true);
                                var everyXYearsObj = $("#every-x-years").data("ejNumericTextbox");
                                everyXYearsObj.option("value", itemRecurrence.YearlySchedule.YearsInterval);
                                $("#yearly-month option[value='" + itemRecurrence.YearlySchedule.MonthsOfTheYear + "']").attr("selected", true);
                                $("#yearly-month").selectpicker("refresh");
                                var yearlyDayObj = $("#yearly-day").data("ejNumericTextbox");
                                yearlyDayObj.option("value", itemRecurrence.YearlySchedule.DayOfMonth);
                                break;

                            case "yearlydow":
                                recurrence = "Yearly";
                                $("#yearly-schedule-option").css("display", "block");
                                $("#yearly-dow").prop("checked", true);
                                var everyXYearsObj = $("#every-x-years").data("ejNumericTextbox");
                                everyXYearsObj.option("value", itemRecurrence.YearlyDowSchedule.YearsInterval);
                                $("#yearly-dow-week option[value='" + itemRecurrence.YearlyDowSchedule.WeeksOfTheMonth + "']").attr("selected", true);
                                $("#yearly-dow-week").selectpicker("refresh");
                                $("#yearly-dow-day option[value='" + itemRecurrence.YearlyDowSchedule.DaysOfTheWeek + "']").attr("selected", true);
                                $("#yearly-dow-day").selectpicker("refresh");
                                $("#yearly-dow-month option[value='" + itemRecurrence.YearlyDowSchedule.MonthsOfTheYear + "']").attr("selected", true);
                                $("#yearly-dow-month").selectpicker("refresh");
                                break;
                        }
                        $("#enable-sunday,#enable-monday,#enable-tuesday,#enable-wednesday,#enable-thursday,#enable-friday,#enable-saturday").on("click", function () {
                            if (isSafari) {
                                $(this).find("label").toggleClass("check");
                            }
                        });

                        $("#recurrence-type option[value='" + recurrence + "']").attr("selected", true);
                        $("#recurrence-type").selectpicker("refresh");

                        $("#enable-schedule").prop("checked", item.IsEnabled);

                        $("#start-date").ejDateTimePicker({ value: startDate});
                        switch (endType.toString().toLowerCase()) {
                            case "noenddate":
                                $("#no-end-date").prop("checked", true);
                                var startObj = $("#start-date").data("ejDateTimePicker").model.value;
                                break;
                            case "enddate":
                                $("#endBy").prop("checked", true);
                                $("#end-date").ejDateTimePicker({ value: endDate });
                                break;
                            case "endafter":
                                $("#end-after").prop("checked", true);
                                var occurenceCountObj = $("#occurence-count").data("ejNumericTextbox");
                                occurenceCountObj.option("value", endAfter);
                                break;
                        }
                    }
                    addTitleForRecurrenceType();
                }
                parent.$("#popup-container_wrapper").ejWaitingPopup("hide");
            }
        });
    }
}

function partialPostDataChanges(url, className) {
    if (!$(".schedule-dialog").hasClass(className)) {
        parent.$("#popup-container_wrapper").ejWaitingPopup("show");
        $.ajax({
            type: "POST",
            url:url,
            data: {},
            dataType: 'html',
            success: function (data) {
                $(".modal-body").append(data);
                $("#data-changes-div-container").css("display", "inline");
                if (actionType == "Edit") {
                    if (item.ItemName != null) {
                        widgetNames();
                        $("#data-changes-container .items-dropdown").find(".bootstrap-select li").each(function () {
                            if ($(this).hasClass("disabled selected active")) {
                                $(this).removeClass("selected active");
                            }
                            if ($(this).find("span .text").text().trim() == item.ItemName.trim()) {
                                $(this).addClass("selected active");
                                var widgetValue = $(this).find(".text").text();
                                $(this).parents(".bootstrap-select").find(".filter-option").html(widgetValue);
                            }
                        });
                        $("#data-changes-container .items-dropdown").find("select option").each(function () {
                            if ($(this).val() == "") {
                                $(this).removeAttr("selected");
                            }
                            if ($(this).text().trim() == item.ItemName.trim()) {
                                $(this).attr("selected", "selected");
                            }
                            $("#selected-items").selectpicker("refresh");
                        });
                        $("#data-changes-container .condition-category-changes").find(".bootstrap-select li").each(function () {
                            if ($(this).hasClass("disabled selected active")) {
                                $(this).removeClass("selected active");
                            }
                            if ($(this).attr("data-original-index") == item.ConditionCategory) {
                                $(this).addClass("selected active");
                                var value = $(this).find(".text").text();
                                $(this).parents(".bootstrap-select").find(".filter-option").html(value);
                            }
                        });
                        $("#data-changes-container .condition-category-changes").find("select option").attr("selected", false);
                        $("#data-changes-container .condition-category-changes").find("select option").each(function () {
                            if ($(this).val() == "") {
                                $(this).removeAttr("selected");
                            }
                            if ($(this).val() == item.ConditionCategory) {
                                $(this).attr("selected", "selected");
                            }
                        });
                        $("#data-changes-container .condition-category-changes select").selectpicker("refresh");
                        renderDataCondition(itemConditionCategory, itemConditionArray, itemWidgetName.trim());
                        addTitleForWidgets();
                    }
                    else {
                        getWidgets();
                    }
                }
                else {
                    getWidgets();
                     }
                }
             
        });
    }
}

$("#scheduleSearch_global").on("keyup", "#scheduleSearch_formfield", function () {
    var searchText = $(this).val();
    if (searchText.length > 2) {
        $("#scheduleGrid").data("ejGrid").search(searchText);
    } else {
        $("#scheduleGrid").data("ejGrid").search("");
    }
});

function refreshScheduleGridItem(scheduleId) {
    //change the loading icon to play icon
    var scheduleGridObj = $("#scheduleGrid").data("ejGrid");
    for (var i = 0; i < scheduleGridObj.model.currentViewData.length; i++) {
        if (scheduleGridObj.model.currentViewData[i].Id == scheduleId) {
            $("span span[data-scheduleid =" + scheduleId + "]").removeClass("loader-gif").addClass("su-play-folder");
        }
    }
}

function editSchedule(id, itemId, itemName, categoryName, multidashboardname) {
    if (multidashboardname == null || multidashboardname == "undefined" || multidashboardname == "") {
        reportItemId = "";
        reportCategoryName = categoryName;
        multidashboardName = "";
        itemId = "";
    }
    else {
        reportItemId = "";
        reportCategoryName = categoryName;
        multiDashboardName = multidashboardname;
        childId = itemId;
    }
    itemName != "" ? $(".schedule-popup-title").html(" " + itemName + " - Schedule") : $(".schedule-popup-title").html(" " + itemName + " Schedule");
    $(".schedule-popup-title").attr("title", itemName);
    scheduleId = id;
    reportItemName = itemName;
    var filterSettings = [];
    filterSettings.push({ PropertyName: "CategoryName", FilterType: "equals", FilterKey: reportCategoryName });
    var invalid = undefined;
    var listItems = "";
    var childItems = "";
    var listCategories = "";
    $.ajax({
        type: "POST",
        url: getScheduleInfoUrl,
        data: { scheduleId: id },
        success: function (data) {
            parent.$("#popup-container_wrapper").ejWaitingPopup("hide");
            item = data.ScheduleItem;
            condition = data.Condition;
            itemConditionArray = JSON.parse(condition);
            recurrence = item.RecurrenceType;
            endType = item.EndType;
            endDate = item.EndDateString;
            endAfter = item.EndAfter;
            startDate = item.StartDateString;
            createdItemId = item.ItemId;
            itemRecurrence = item.Recurrence;
            if (recurrence.toLowerCase() == "hourly") {
                frequency = item.Recurrence.HourlySchedule.MinutesInterval;
            }
            exportType = item.ExportType;
            subscriberExternalRecipient = data.SubscribedExternalRecipient;
            subscriberGroup = data.SubscribedGroup;
            subscriberUser = data.SubscribedUser
            itemConditionCategory = item.ConditionCategory;
            itemWidgetName = item.ItemName;
            emailContent = item.EmailContent;
            buttonValue = $("#add-alert-rule").val();
            $("#selected-items[value='" + item.ItemName + "']").attr("selected", true);
            if (item.IsDataChanges == true) {
                $("#data-alerts").prop("checked", "checked");
                alertChange = 2;
            }
            else {
                //  cursorPos.value("Hi {:Username},\n\nThe configured data notification condition has been met. \n \nPlease find a snapshot of the current state of the dashboard attached.\n\nRegards,\n\n{:OrganizationName}");
                $('#data-changes-div,#time-intervals-div').css("display", "none");
                alertChange = 1;
            }
            $("#schedule-name").val(item.Name);

        }
    });
   if (multidashboardname != "") {
    $.ajax({
        type: "POST",
        url: getDashboardUrl,
        async:false,
        data: { searchKey: invalid, skip: 0, take: 20, sorted: invalid, filterCollection: filterSettings, displayCategory: "SpecificCategory" },
        success: function (result, data) {
            var dashboards = result.result;
            for (var t = 0; t < dashboards.length; t++) {
                if (dashboards[t].Name.toLowerCase() == multidashboardname.toLowerCase()) {
                    listItems +=  '<option value="' + dashboards[t].Id +'" selected=selected>' + dashboards[t].Name + '</option>';
                }
            }
            $("#selected_dashboard").html("");
            $("#selected_dashboard").html(listItems).selectpicker("refresh");
        }
    });
    $("#selected_childdashboard").attr("disabled", false);
        }
   var itemId = $("#selected_dashboard").find("option:selected").val();
   $.ajax({
       type: "POST",
       url: getChildDashboardUrl,
       data: { parentId: itemId },
       async: false,
       success: function (result, data) {
           childDashboards = result.result;
           if (childDashboards != null) {
               $("#selected_childdashboard").attr("disabled", false);
           }
       }
   });
 }

function refreshConditionCategory() {
    $(".condition-category-changes").find("select").html("");
    $(".condition-category-changes").find("select").append('<option value="5" data-title="[[[Checks whether the filtered value changes.]]]" name="ValueChanges" selected="selected">Value Changes</option>' +
                                        '<option value="1" data-title="[[[Checks whether the filtered value increases once.]]]" name="Increases">Increases</option>' +
                                        '<option value="2" data-title="[[[Checks whether the filtered value increases continuously.]]]" name="ContinousIncreases">Continuously Increases</option>' +
                                        '<option value="3" data-title="[[[Checks whether the filtered value decreases once." name="Decreases]]]">Decreases</option>' +
                                        '<option value="4" data-title="[[[Checks whether the filtered value decreases continuously.]]]" name="ContinousDecreases">Continuously Decreases</option>').selectpicker("refresh");
    $("#selected-option").selectpicker("refresh");
    for (var i = 0; i < $(".condition-category-changes select option").length; i++) {
        var hoveredtext = $(".condition-category-changes select option").eq(i).attr("data-title");
        $(".condition-category-changes .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr({ "title": hoveredtext, "data-toggle": "tooltip", "data-container": "body", "data-placement": "right" });
    }
    $(".condition-category-changes .btn-group .dropdown-menu .selectpicker li a").tooltip();
}

function addTitleForWidgets() {
    $("#selected-items").selectpicker("refresh");
    for (var i = 0; i < $(".items-dropdown  .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $(".items-dropdown .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $(".items-dropdown .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
    }
}

function addTitleForUsersAndGroups() {
    $("#user-search").selectpicker("refresh");
    for (var i = 0; i < $("#user-search-container .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $("#user-search-container .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $("#user-search-container .btn-group .dropdown-menu .selectpicker li").eq(i).find("a").attr("title", hoveredtext);
    }
    $("#group-search").selectpicker("refresh");
    for (var i = 0; i <= $("#group-search-container .btn-group .dropdown-menu  li").length; i++) {
        var hoveredtext = $("#group-search-container .btn-group .dropdown-menu  li").eq(i).find("a .text").text();
        $("#group-search-container .btn-group .dropdown-menu li ").eq(i).find("a").attr("title", hoveredtext);
    }
}

function addTitleForRecurrenceType() {
    $("#recurrence-type").selectpicker("refresh");
    $("#recurrence-type-container").find(".dropdown-menu").addClass("dropdown-height");
    for (var i = 0; i < $("#recurrence-type-container .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $("#recurrence-type-container .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $("#recurrence-type-container .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
    }

    $("#monthly-dow-week").selectpicker("refresh");
    for (var i = 0; i < $("#monthly-dow-week-container .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $("#monthly-dow-week-container .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $("#monthly-dow-week-container .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
    }
    $("#monthly-dow-day").selectpicker("refresh");
    $("#monthly-dow-day-container").find(".dropdown-menu").addClass("day-dropdown-width");
    for (var i = 0; i < $("#monthly-dow-day-container .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $("#monthly-dow-day-container .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $("#monthly-dow-day-container .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
    }
    $("#yearly-dow-week").selectpicker("refresh");
    for (var i = 0; i < $("#yearly-dow-week-container .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $("#yearly-dow-week-container .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $("yearly-dow-week-container .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
    }
    $("#yearly-dow-day").selectpicker("refresh");
    $("#yearly-dow-day-container").find(".dropdown-menu").addClass("day-dropdown-width");
    for (var i = 0; i < $("#yearly-dow-day-container .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $("#yearly-dow-day-container .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $("#yearly-dow-day-container .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
    }
    $("#yearly-dow-month").selectpicker("refresh");
    $("#yearly-dow-month-ccontainer").find(".dropdown-menu").addClass("day-dropdown-width");
    for (var i = 0; i < $("#yearly-dow-month-ccontainer .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $("#yearly-dow-month-ccontainer .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $("#yearly-dow-month-ccontainer .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
    }
    $("#yearly-month").selectpicker("refresh");
    $("#yearly-month").next("div").find(".dropdown-menu").addClass("day-dropdown-width");
    for (var i = 0; i < $("#yearly-schedule-option .btn-group .dropdown-menu .selectpicker li").length; i++) {
        var hoveredtext = $("#yearly-schedule-option .btn-group .dropdown-menu .selectpicker li").eq(i).find("a .text").text();
        $("#yearly-schedule-option .btn-group .dropdown-menu .selectpicker li ").eq(i).find("a").attr("title", hoveredtext);
    }
}

var listCategories = "";
$(document).on('show.bs.dropdown', '.category-dropdown', function () {
    $(".category-dropdown").find(".open,.bootstrap-select").removeClass("dropdown-alignment");
    if (listCategories == "") {
        $(".category-dropdown .bootstrap-select").append($("<span class='no-padding loader-gif' style='display:block; background-image:url(" + rootBaseUrl + "content/styles/essentialjs/images/waitingpopup.gif); background-size:cover; left:110px; position:absolute; height:30px; width:30px; top:0px;z-index:10001'></span>"));
        $(".category-dropdown .bootstrap-select .open").hide();
        var filterSettings = [];
        filterSettings.push({ PropertyName: "CategoryName", FilterType: "equals", FilterKey: reportCategoryName });
        var invalid = undefined;
        $.ajax({
            type: "POST",
            url: getCategoryUrl,
            success: function (data) {
                var categories = data;
                for (var t = 0; t < categories.data.length; t++) {
                    if (categories.data[t].Name == reportCategoryName) {
                        listCategories += '<option value="' + categories.data[t].Id + '" selected= "selected">' + categories.data[t].Name + '</option>';
                    }
                    else {
                        listCategories += '<option value="' + categories.data[t].Id + '">' + categories.data[t].Name + '</option>';
                    }
                }
                $("#selected_category").html("");
                if (reportItemId == "") {
                    $("#selected_category").html('<option value="" disabled="disabled" class="hide-option" selected="selected">[[[Select Category]]]</option>' + listCategories)
                  .selectpicker("refresh");
                }
                else {
                    $("#selected_category").html(listCategories)
                                  .selectpicker("refresh");
                }
                addTitleForCategory();
                $(".category-dropdown .bootstrap-select ul li").each(function () {
                    if($(this).hasClass("selected")){
                        $(this).addClass("active");
                    }
                })
                if (listCategories != "") {
                    $(".category-dropdown .bootstrap-select .open").show();
                }
                $(".category-dropdown span.loader-gif").remove();
                }
        });
    }
    $(".category-dropdown").find(".open").addClass("dropdown-alignment");
});

$(document).on('show.bs.dropdown', '.dashboard-dropdown', function () {
    $(".dashboard-dropdown").find(".open,.bootstrap-select").removeClass("dropdown-alignment");
    if ($("#selected_category").find("option:selected").val() == "" && multiDashboardName == null) {
        $("#category-message").css("display", "block");
        $("#selected_dashboard").attr("disabled", false);
    }
    else {
        if (listDashboards == "") {
            $(".dashboard-dropdown .bootstrap-select").append($("<span class='no-padding loader-gif' style='display:block; background-image:url(" + rootBaseUrl + "content/styles/essentialjs/images/waitingpopup.gif); background-size:cover; left:110px; position:absolute; height:30px; width:30px; top:0px;z-index:10001'></span>"));
            $(".dashboard-dropdown .bootstrap-select .open").hide();

            var filterSettings = [];
            filterSettings.push({ PropertyName: "CategoryName", FilterType: "equals", FilterKey: reportCategoryName });
            var invalid = undefined;
            var listItems = "";
            var childItems = "";
            if ((reportItemId == "" || reportItemId != "") && (itemName != "" && reportCategoryName != "")) {
                $.ajax({
                    type: "POST",
                    url: getDashboardUrl,
                    data: { searchKey: invalid, skip: 0, take: 20, sorted: invalid, filterCollection: filterSettings, displayCategory: "SpecificCategory" },
                    success: function (result, data) {
                        var dashboards = result.result;
                        for (var t = 0; t < dashboards.length; t++) {
                            if (multiDashboardName == null || multiDashboardName == "undefined" || multiDashboardName == "") {
                                listDashboards += (dashboards[t].Name.toLowerCase() == itemName.toLowerCase())
                                    ? '<option value="' +
                                    dashboards[t].Id +
                                    '" selected=selected>' +
                                    dashboards[t].Name +
                                    '</option>'
                                    : '<option value="' + dashboards[t].Id + '">' + dashboards[t].Name + '</option>';
                            }
                            else {
                                listDashboards += (dashboards[t].Name.toLowerCase() == multiDashboardName.toLowerCase())
                                    ? '<option value="' +
                                    dashboards[t].Id +
                                    '" selected=selected>' +
                                    dashboards[t].Name +
                                    '</option>'
                                    : '<option value="' + dashboards[t].Id + '">' + dashboards[t].Name + '</option>';
                            }
                        }
                        $("#selected_dashboard").html("");
                        if (reportItemId == "") {
                            $("#selected_dashboard")
                                .html('<option value="" disabled="disabled" class="hide-option"selected="selected">[[[Select dashboard]]]</option>' + listDashboards)
                                .selectpicker("refresh");
                        }
                        else {
                            $("#selected_dashboard")
                                .html(listDashboards)
                                .selectpicker("refresh");
                        }
                        addTitleForDashboard();
                        $(".dashboard-dropdown ul li").each(function () {
                            if ($(this).hasClass("selected")) {
                                $(this).addClass("active");
                            }
                        });
                        if (listDashboards != "") {
                            $(".dashboard-dropdown .bootstrap-select .open").show();
                            }
                       
                        $(".dashboard-dropdown span.loader-gif").remove();
                      }
                });
            } else {
                $("#selected_dashboard").html('<option value="" disabled="disabled" class="hide-option"selected="selected">[[[Select dashboard]]]</option>').selectpicker("refresh");
                $(".dashboard-dropdown .bootstrap-select .open").show();
                $(".dashboard-dropdown .btn-group .dropdown-menu.open").removeAttr("style");
                $(".dashboard-dropdown .btn-group .dropdown-menu.open").css("overflow", "hidden");
                $(".dashboard-dropdown span.loader-gif").remove();
            }
        } 
    }
    $(".dashboard-dropdown").find(".open").addClass("dropdown-alignment");
});

$(document).on('show.bs.dropdown', '.childdashboard-dropdown', function () {
    if (actionType == "Edit" && $("#selected_childdashboard").find("option").length <= 1) {
        $(".childdashboard-dropdown .bootstrap-select").append($("<span class='no-padding loader-gif' style='display:block; background-image:url(" + rootBaseUrl + "content/styles/essentialjs/images/waitingpopup.gif); background-size:cover; left:110px; position:absolute; height:30px; width:30px; top:0px;z-index:10001'></span>"));
        $(".childdashboard-dropdown .bootstrap-select .open").hide();
        var itemId = $("#selected_dashboard").find("option:selected").val();
        var childItems = "";
        for (var t = 0; t < childDashboards.length; t++) {
            if (childDashboards[t].Name.toLowerCase() == itemName.toLowerCase()) {
                childItems += '<option data-designerid=' + childDashboards[t].DesignerId + ' value="' + childDashboards[t].DashboardId + '" selected="selected">' + childDashboards[t].Name + '</option>';
            }
            else {
                childItems += '<option data-designerid=' + childDashboards[t].DesignerId + ' value="' + childDashboards[t].DashboardId + '">' + childDashboards[t].Name + '</option>';
            }
        }
        $("#selected_childdashboard").html("");
        $("#selected_childdashboard").append('<option value="">[[[All]]]</option>' + childItems).selectpicker("refresh");
        addTitleForChildDashboards();
        $(".childdashboard-dropdown ul li").each(function () {
            if ($(this).hasClass("selected")) {
                $(this).addClass("active");
            }
        });
        $(".childdashboard-dropdown span.loader-gif").remove();
        if (childItems != "") {
            $(".childdashboard-dropdown .bootstrap-select .open").show();
        }
    }
});