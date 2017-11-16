﻿function getAllStaticData() {
    if (window.userList == undefined) {
        $.ajax({
            type: "POST",
            url: getActiveandInactiveUserUrl,
            data: {},
            async: false,
            success: function (result) {
                window.userList = result.data.users;
                window.groupList = result.data.groups;
            }
        });
    }
    $("#user-search").append(window.userList);
    $("#group-search").append(window.groupList);
    $("#image-export").prop("checked", true);
    $(".selectpicker").selectpicker("refresh");
    $("#schedule-submit").attr("data-report-id", createdItemId);
    $(".share-popup .bs-deselect-all").after("<div class='bs-select-all-custom'><span>[[[Select All]]]</span><span class='bs-select-custom-tick glyphicon glyphicon-ok' ></span></div>");
}

function validateExternalRecipient() {
    $(document).on("keypress", "#external-email", function (e) {
        if (e.which == 13) {
            e.preventDefault();
            $("#external-submit").click();
        }
    });

    $(document).on("click", "#external-submit", function (e) {
        var emailid = $("#external-email").val().toLowerCase();
        var selectedItems = $(".selected-recipients").children();
        if (IsEmail(emailid)) {
            var externalRecipientTile = $("<div>").attr("id", emailid).attr("data-searchtype", "externalRecipient").addClass("SelectedShareItems");
            externalRecipientTile.html("<div class='InstantSearch'><span class='details' title='" + emailid + "'>" + emailid
                + "</span><div style='width:auto' class='instant-cancel'><span class='su su-close i-selected-cancel'/></div></div>");
            for (var i = 0; i < selectedItems.length; i++) {
                if (selectedItems[i].getAttribute("data-searchtype") == "externalRecipient") {
                    if (emailid == selectedItems[i].id) {
                        $("#external-email").addClass("inactive-box");
                        $("#external-submit").addClass("inactive-icon");
                        $("#external-email-validation").html("<span class='validate-fail'>[[[Email address already exists]]]</span>");
                        return;
                    }
                }
            }
            $("#selected-users").append(externalRecipientTile);
            $("#external-email").val("");
            selectedItemsCount();
        }
        else {
            if (emailid != "") {
                $("#external-email").addClass("inactive-box");
                $("#external-submit").addClass("inactive-icon");
                $("#external-email-validation").html("<span class='validate-fail'>[[[Please enter a valid email address]]]</span>");
            }
            else {
                $("#external-email").removeClass("inactive-box");
                $("#external-submit").removeClass("inactive-icon");
                $("#external-email-validation").html();
            }
        }
    });

    $(document).on("keyup", "#external-email", function (e) {
        if (e.keyCode != 13) {
            $("#external-email").removeClass("inactive-box");
            $("#external-submit").removeClass("inactive-icon");
            $("#external-email-validation").html("");
        }
    });
}

function selectedItemsCount() {
    $("#selected-users-info").html("<span class='pull-left'>" + $(".SelectedShareItems[data-searchtype='userSearch']").length + " [[[User(s)]]] " + $(".SelectedShareItems[data-searchtype='groupSearch']").length + " [[[Group(s)]]] " + $(".SelectedShareItems[data-searchtype='externalRecipient']").length + " [[[External Recipient(s)]]]<span>").css({ "padding-top": "10px", "padding-left": "15px", "margin-top": "0" });
}

$(document).on("click", "#user-search-container .bs-select-all-custom", function (e) {
    $("#user-search-container").addClass("value-changed");
    $("#user-search").data("selectpicker").selectAll();
    $(this).removeClass("bs-select-all-custom").addClass("bs-deselect-all-custom");
    $($(this).children("span")[0]).text("[[[Clear All]]]");
    selectedItemsCount();
    e.stopPropagation();
});

$(document).on("click", "#group-search-container .bs-select-all-custom", function (e) {
    $("#group-search-container").addClass("value-changed");
    $("#group-search").data("selectpicker").selectAll();
    $(this).removeClass("bs-select-all-custom").addClass("bs-deselect-all-custom");
    $($(this).children("span")[0]).text("[[[Clear All]]]");
    selectedItemsCount();
    e.stopPropagation();
});

$(document).on("click", "#user-search-container .bs-deselect-all-custom", function (e) {
    $("#user-search-container").addClass("value-changed");
    $("#user-search").data("selectpicker").deselectAll();
    $(this).removeClass("bs-deselect-all-custom").addClass("bs-select-all-custom");
    $($(this).children("span")[0]).text("[[[Select All]]]");
    $(".SelectedShareItems[data-searchtype='userSearch']").remove();
    selectedItemsCount();
    e.stopPropagation();
});

$(document).on("click", "#group-search-container .bs-deselect-all-custom", function (e) {
    $("#group-search-container").addClass("value-changed");
    $("#group-search").data("selectpicker").deselectAll();
    $(this).removeClass("bs-deselect-all-custom").addClass("bs-select-all-custom");
    $($(this).children("span")[0]).text("[[[Select All]]]");
    $(".SelectedShareItems[data-searchtype='groupSearch']").remove();
    selectedItemsCount();
    e.stopPropagation();
});

$(document).on("click", "#user-search-container .bootstrap-select li a", function (e) {
    $("#user-search-container").addClass("value-changed");;
    var selectedCount = $("#user-search-container .bootstrap-select li.selected").length;
    var allListCount = $("#user-search-container .bootstrap-select li").length;

    if (selectedCount == allListCount) {
        $($("#user-search-container div.bs-select-all-custom").children("span")[0]).text("[[[Clear All]]]");
        $("#user-search-container div.bs-select-all-custom").removeClass("bs-select-all-custom").addClass("bs-deselect-all-custom");
    }
    if ($(this).parent().hasClass("selected")) {
        var selectedUser = $("#user-search").find("option")[parseInt($(this).parent().attr("data-original-index"))];
        var userTile = $("<div>").attr("id", $(selectedUser).val()).attr("data-searchtype", "userSearch").addClass("SelectedShareItems");
        userTile.html("<div class='InstantSearch'><span class='details' title='" + $(selectedUser).text() + "'>" + $(selectedUser).text() + "</span><div style='width:auto' class='instant-cancel'><span class='su su-close i-selected-cancel'/></div></div>");
        $("#selected-users").append(userTile);
    }
    else {
        var selectedUser = $("#user-search").find("option")[parseInt($(this).parent().attr("data-original-index"))];
        $(".SelectedShareItems[id='" + $(selectedUser).val() + "']").remove();
        $($("#user-search-container .bs-deselect-all-custom").children("span")[0]).text("[[[Select All]]]");
        $("#user-search-container .bs-deselect-all-custom").removeClass("bs-deselect-all-custom").addClass("bs-select-all-custom");
    }
    $(this).parent().addClass("active");
    selectedItemsCount();
    e.stopPropagation();
});

$(document).on("click", "#group-search-container .bootstrap-select .dropdown-menu .selectpicker li a", function (e) {
    $("#group-search-container").addClass("value-changed");;
    var selectedCount = $("#group-search-container .bootstrap-select li.selected").length;
    var allListCount = $("#group-search-container .bootstrap-select li").length;
    if (selectedCount == allListCount) {
        $($("#group-search-container div.bs-select-all-custom").children("span")[0]).text("[[[Clear All]]]");
        $("#group-search-container div.bs-select-all-custom").removeClass("bs-select-all-custom").addClass("bs-deselect-all-custom");
    }

    if ($(this).parent().hasClass("selected")) {
        var selectedGroup = $("#group-search").find("option")[parseInt($(this).parent().attr("data-original-index"))];
        var groupTile = $("<div>").attr("id", $(selectedGroup).val()).attr("data-searchtype", "groupSearch").addClass("SelectedShareItems");
        groupTile.html("<div class='InstantSearch'><span class='details' title='" + $(selectedGroup).text() + "'>" + $(selectedGroup).text() + "</span><div style='width:auto' class='instant-cancel'><span class='su su-close i-selected-cancel'/></div></div>");
        $("#selected-users").append(groupTile);
    }
    else {
        var selectedGroup = $("#group-search").find("option")[parseInt($(this).parent().attr("data-original-index"))];
        $(".SelectedShareItems").filter("[data-searchtype='groupSearch']").filter("#" + $(selectedGroup).val()).remove();
        $($("#group-search-container .bs-deselect-all-custom").children("span")[0]).text("[[[Select All]]]");
        $("#group-search-container .bs-deselect-all-custom").removeClass("bs-deselect-all-custom").addClass("bs-select-all-custom");
    }
    $(this).parent().addClass("active");
    selectedItemsCount();
    e.stopPropagation();
});

$(document).on("click", "#subscribers-panel .i-selected-cancel", function (event) {
    var key = $(this).parents(".SelectedShareItems").attr("id");
    var searchType = $(this).parents(".SelectedShareItems").attr("data-searchtype");
    if (searchType == "userSearch") {
        currentElementIndex = $("#user-search").find("[value='" + key + "']").index();
        $("#user-search-container .bootstrap-select li").filter("[data-original-index='" + currentElementIndex + "']").find("a").click();
    }
    else if (searchType == "groupSearch") {
        currentElementIndex = $("#group-search").find("[value='" + key + "']").index();
        $("#group-search-container .bootstrap-select li").filter("[data-original-index='" + currentElementIndex + "']").find("a").click();
    }
    else {
        if (searchType == "externalRecipient") {
            $(".SelectedShareItems[id='" + key + "']").remove();
        }
    }
    selectedItemsCount();$("#selected_childdashboard").attr("disabled", false);
});

$(document).on("hide.bs.dropdown", "#user-search-container", function (e) {
    if ($("#user-search-container").hasClass("value-changed")) {
        $("#user-search-container").removeClass("value-changed");
        e.stopPropagation();
    }
});

$(document).on("hide.bs.dropdown", "#group-search-container", function (e) {
    if ($("#group-search-container").hasClass("value-changed")) {
        $("#group-search-container").removeClass("value-changed");
        e.stopPropagation();
    }
});

$(document).on("show.bs.dropdown", "#user-search-container", function (e) {
    $("#user-search").next("div").find(".dropdown-menu").addClass("dropdown-width");
});

$(document).on("show.bs.dropdown", "#group-search-container", function (e) {
    $("#group-search").next("div").find(".dropdown-menu").addClass("dropdown-width");
});

$(document).on("click", "#schedule-submit", function () {
    validateSubscriber();
    var scheduleMessage = ""
    var alertmessage = "";
    var scheduleUrl = "";
    if (alertChange == 2) {
        scheduleMessage = "[[[This condition will be evaluated ]]]"
        successMessage = "[[[Data alert has been configured successfully. ]]]";
        alertmessage = "[[[ , and the recipients will be notified when the condition has been satisfied.]]]";
        var frequencyValue = $(".time-width").val();
    }
    var scheduleItem = {};
    scheduleItem.ScheduleName = $("#schedule-name").val();
    scheduleItem.ItemId = $(this).attr("data-report-id");
    scheduleItem.ExportType = $("input[name=exportFormats]:checked", "#export-format-container").val().toString();
    if (actionType == "Create") {
        successMessage = "[[[Dashboard has been scheduled successfully. ]]]";
        scheduleUrl = addScheduleUrl;
    }
    else {
        successMessage = "[[[Schedule has been updated successfully. ]]]";
        scheduleItem.ScheduleId = $(this).attr("data-schedule-id");
        scheduleUrl = updateScheduleUrl;
    }
    var commentText = "";
    if (alertChange == 2) {
        commentText = cursorPos.value();
        commentText = getRelativePath(commentText);
        itemDetails = $("#selected-items").find("option:selected").val();
    }
    else {
        commentText = "Hi {:Username},\n\nThe configured data notification condition has been met. \n \nPlease find a snapshot of the current state of the dashboard attached.\n\nRegards,\n\n{:OrganizationName}";
        itemDetails = "";
    }
    scheduleItem.EmailContent = commentText;
    var conditionCategory = $("#condition-category").find("option:selected").val();
    var columnInfo = $("#serialize-columninfo").text();
    var conditionInfo = $("#serialize-conditioninfo").text();
    var result = $("#alert-value").text();
    var validationDetails = $("#previous-data").text()
    switch ($("#recurrence-type").val().toString().toLowerCase()) {
        case "daily":
            if ($("#daily-every-x-days").prop("checked")) {
                scheduleItem.RecurrenceType = "Daily";
                scheduleItem.RecurrenceInterval = $("#every-x-days").val();
            }
            else {
                scheduleItem.RecurrenceType = "DailyWeekDay";
            }
            break;
        case "weekly":
            scheduleItem.RecurrenceType = "Weekly";
            scheduleItem.RecurrenceInterval = $("#every-x-weeks").val();
            scheduleItem.Sunday = $("#sun").prop("checked");
            scheduleItem.Monday = $("#mon").prop("checked");
            scheduleItem.Tuesday = $("#tues").prop("checked");
            scheduleItem.Wednesday = $("#wed").prop("checked");
            scheduleItem.Thursday = $("#thu").prop("checked");
            scheduleItem.Friday = $("#fri").prop("checked");
            scheduleItem.Saturday = $("#sat").prop("checked");
            break;
        case "monthly":
            if ($("#monthly").prop("checked")) {
                scheduleItem.RecurrenceType = "Monthly";
                scheduleItem.DaysOfMonth = $("#monthly-date").val();
                scheduleItem.RecurrenceInterval = $("#monthly-every-x-months").val();
            }
            else {
                scheduleItem.RecurrenceType = "MonthlyDOW";
                scheduleItem.WeekOfMonth = $("#monthly-dow-week").find('option:selected').text();
                scheduleItem.DayOfWeek = $("#monthly-dow-day").find('option:selected').text();
                scheduleItem.RecurrenceInterval = $("#monthly-dow-every-x-months").val();
            }
            break;
        case "yearly":
            scheduleItem.RecurrenceInterval = $("#every-x-years").val();
            if ($("#yearly").prop("checked")) {
                scheduleItem.RecurrenceType = "Yearly";
                scheduleItem.DaysOfMonth = $("#yearly-day").val();
                scheduleItem.MonthOfYear = $("#yearly-month").find('option:selected').text();
            }
            else {
                scheduleItem.RecurrenceType = "YearlyDOW";
                scheduleItem.WeekOfMonth = $("#yearly-dow-week").find('option:selected').text();
                scheduleItem.DayOfWeek = $("#yearly-dow-day").find('option:selected').text();
                scheduleItem.MonthOfYear = $("#yearly-dow-month").find('option:selected').text();
            }
            break;
        case "hourly":
            scheduleItem.RecurrenceType = "Hourly";
            scheduleItem.Frequency = $(".time-width").val();
            scheduleItem.RecurrenceInterval = $("#every-x-hours-value").val();
            break;
    }

    scheduleItem.IsEnabled = $("#enable-schedule").prop("checked");

    scheduleItem.StartDate = $("#start-date").val();

    switch ($("input[name=end-type]:checked", "#schedule-end-type").val().toString()) {
        case "never":
            scheduleItem.ScheduleEndType = "NoEnd";
            break;
        case "endafter":
            scheduleItem.ScheduleEndType = "EndAfter";
            scheduleItem.RecurrenceFactor = $("#occurence-count").val();
            break;
        case "endBy":
            scheduleItem.ScheduleEndType = "EndBy";
            scheduleItem.EndDate = $("#end-date").val();
            break;
    }

    var selectedItems = $(".selected-recipients").children();

    var userlist = Array();
    var grouplist = Array();
    var externalrecipientlist = Array();
    var a = 0, b = 0, c = 0;
    for (var i = 0; i < selectedItems.length; i++) {
        if (selectedItems[i].getAttribute("data-searchtype") == "userSearch") {
            if (a != -1) {
                userlist[a] = selectedItems[i].id;
                a++;
            }
        }
        if (selectedItems[i].getAttribute("data-searchtype") == "groupSearch") {
            if (b != -1) {
                grouplist[b] = selectedItems[i].id;
                b++;
            }
        }
        if (selectedItems[i].getAttribute("data-searchtype") == "externalRecipient") {
            if (c != -1) {
                externalrecipientlist[c] = selectedItems[i].id;
                c++;
            }
        }
    }
    if (selectedItems.length) {
        $.ajax({
            type: "POST",
            url: scheduleUrl,
            data: {
                scheduleList: JSON.stringify({ ScheduleItem: scheduleItem, UserList: userlist, GroupList: grouplist, ExternalRecipientList: externalrecipientlist, columnInfo: columnInfo, conditionInfo: conditionInfo, result: result, category: conditionCategory, alert: alertChange, itemName: itemDetails, previousData: validationDetails })
            },
            beforeSend: function () {
                parent.$("#popup-container_wrapper").ejWaitingPopup("show");
            },
            success: function (data) {
                scheduleDetail = createScheduleMessage(true);
                parent.$("#popup-container_wrapper").ejWaitingPopup("hide");
                var scheduleName = $(".schedule-popup-title").text();
                closePopupContainer();
                var messageBody = successMessage + scheduleMessage + scheduleDetail + alertmessage;
                var popupClass = messageBody.length > 140 ? "success-message-large" : "success-message-small";
                parent.messageBox("su-calendar-1", scheduleName, messageBody, "success", function () {
                    parent.onCloseMessageBox();
                    parent.refreshScheduleGrid();
                }, undefined, undefined, undefined, undefined, popupClass);
            }
        });
    }
    else {
        $("#selected-users-validation").css("visibility", "visible");
    }
});

function validateSubscriber() {
    if (!$("#selected-users").children().length > 0) {
        $("#selectedRecipientErrorContainer").css("display", "block");
        $("#selectedRecipientValidator").html("[[[Please select atleast one recipient]]]");
        return false;
    } else {
        $("#selectedRecipientErrorContainer").css("display", "none");
    }
}

