var addScheduleDetail = "";

//remove Dialog box and its elements
    $("#StartDate_popup").remove();
    $("#EndDate_popup").remove();
    $("#popup-container_wrapper").remove();
    $("#PopupContainer_overLay").remove();
    $("#editpopup-container_wrapper").remove();

    var recurrenceTypeList = "";
    var days = "";
    var weeks = "";
    var months = "";
    var zoneDateTime = "";
    var sysTime = "";
    var time = new Date();
    if (timeFormat == "True") {
        sysTime = DateCustomFormat(dateFormat + " HH:mm", time,timeFormat);
    }
    else {
        sysTime = DateCustomFormat(dateFormat + " hh:mm", time,timeFormat);
        sysTime += (time.getHours() >= 12) ? " PM" : " AM";
    }
    $.ajax({
        type: "POST",
        data: { date: sysTime },
        url: getRecurrenceTypeUrl,
        async: false,
        success: function (data) {
            ShowWaitingProgress(".share-popup-header", "hide");
            if (data.RecurrenceType != null && data.RecurrenceType.length > 0) {
                recurrenceTypeList = "<option value= " + data.RecurrenceType[4] + ">" + "[[[Hourly]]]" + "</option>"
                                        + "<option value= " + data.RecurrenceType[0] + ">" + "[[[Daily]]]" + "</option>"
                                        + "<option value= " + data.RecurrenceType[1] + ">" + "[[[Weekly]]]" + "</option>"
                                        + "<option value= " + data.RecurrenceType[2] + ">" + "[[[Monthly]]]" + "</option>"
                                        + "<option value= " + data.RecurrenceType[3] + ">" + "[[[Yearly]]]" + "</option>";
            }

            for (var t = 0; t < data.Days.length; t++) {
                if (data.Days[t].toString().toLowerCase() == "weekendday"
                    || data.Days[t].toString().toLowerCase() == "day"
                    || data.Days[t].toString().toLowerCase() == "weekday") {
                    if (data.Days[t].toString().toLowerCase() == "weekendday") {
                        days += "<option value= " + data.Days[t] + ">weekendday</option>";
                    } else {
                        if (data.Days[t].toString().toLowerCase() == "weekday") {
                            days += "<option value= " + data.Days[t] + ">" + "[[[weekday]]]" + "</option>";
                        }
                        if (data.Days[t].toString().toLowerCase() == "day") {
                            days += "<option value= " + data.Days[t] + ">" + "[[[day]]]" + "</option>";
                        }
                    }
                }
            }

            for (var t = 0; t < data.Days.length; t++) {
                if (data.Days[t].toString().toLowerCase() != "weekendday"
                    && data.Days[t].toString().toLowerCase() != "day"
                    && data.Days[t].toString().toLowerCase() != "weekday") {
                    if (data.Days[t].toString().toLowerCase() == "sunday") {
                        days += "<option value= " + data.Days[t] + ">" + "[[[Sunday]]]" + "</option>";
                    }
                    if (data.Days[t].toString().toLowerCase() == "monday") {
                        days += "<option value= " + data.Days[t] + ">" + "[[[Monday]]]" + "</option>";
                    }
                    if (data.Days[t].toString().toLowerCase() == "tuesday") {
                        days += "<option value= " + data.Days[t] + ">" + "[[[Tuesday]]]" + "</option>";
                    }
                    if (data.Days[t].toString().toLowerCase() == "wednesday") {
                        days += "<option value= " + data.Days[t] + ">" + "[[[Wednesday]]]" + "</option>";
                    }
                    if (data.Days[t].toString().toLowerCase() == "thursday") {
                        days += "<option value= " + data.Days[t] + ">" + "[[[Thursday]]]" + "</option>";
                    }
                    if (data.Days[t].toString().toLowerCase() == "friday") {
                        days += "<option value= " + data.Days[t] + ">" + "[[[Friday]]]" + "</option>";
                    }
                    if (data.Days[t].toString().toLowerCase() == "saturday") {
                        days += "<option value= " + data.Days[t] + ">" + "[[[Saturday]]]" + "</option>";
                    }
                }
            }

            weeks = "<option value= " + data.Weeks[0] + ">" + "[[[first]]]" + "</option>"
		            + "<option value= " + data.Weeks[1] + ">" + "[[[second]]]" + "</option>"
		            + "<option value= " + data.Weeks[2] + ">" + "[[[third]]]" + "</option>"
		            + "<option value= " + data.Weeks[3] + ">" + "[[[fourth]]]" + "</option>"
		            + "<option value= " + data.Weeks[4] + ">" + "[[[last]]]" + "</option>";

            months = "<option value= " + data.Months[0] + ">" + "[[[January]]]" + "</option>"
				    + "<option value= " + data.Months[1] + ">" + "[[[February]]]" + "</option>"
				    + "<option value= " + data.Months[2] + ">" + "[[[March]]]" + "</option>"
				    + "<option value= " + data.Months[3] + ">" + "[[[April]]]" + "</option>"
				    + "<option value= " + data.Months[4] + ">" + "[[[May]]]" + "</option>"
				    + "<option value= " + data.Months[5] + ">" + "[[[June]]]" + "</option>"
				    + "<option value= " + data.Months[6] + ">" + "[[[July]]]" + "</option>"
				    + "<option value= " + data.Months[7] + ">" + "[[[August]]]" + "</option>"
				    + "<option value= " + data.Months[8] + ">" + "[[[September]]]" + "</option>"
				    + "<option value= " + data.Months[9] + ">" + "[[[October]]]" + "</option>"
				    + "<option value= " + data.Months[10] + ">" + "[[[November]]]" + "</option>"
				    + "<option value= " + data.Months[11] + ">" + "[[[December]]]" + "</option>";

            var dateTime = data.TimeZoneDateTime.toString();

            if (dateFormat == "dd/MM/yyyy") {
                var date = dateTime.split('/');
                var dd = date[0];
                var mm = date[1];
                var yyyy = date[2]
                var newdate = mm + '/' + dd + '/' + yyyy;
                var zoneTime = new Date(newdate);
            }
            else {
                var zoneTime = new Date(dateTime);
            }
           
            if (timeFormat == "True") {
                var applicationTime = DateCustomFormat(dateFormat + " HH:mm", zoneTime,timeFormat);
            }
            else {
                var applicationTime = DateCustomFormat(dateFormat + " hh:mm", zoneTime,timeFormat);
                applicationTime += (zoneTime.getHours() >= 12) ? " PM" : " AM";
            }

            zoneDateTime = applicationTime;

            $("#time").html(sysTime);
            $("#zone").html(String(String(time).split("(")[1]).split(")")[0]);
            $("#hour-difference").val(data.HourDifference);
            $("#minute-difference").val(data.MinuteDifference);
        }
    });
    $("#recurrence-type").append(recurrenceTypeList);
    $("#monthly-dow-week").append(weeks);
    $("#monthly-dow-day").append(days);
    $("#yearly-month").append(months);
    $("#yearly-dow-week").append(weeks);
    $("#yearly-dow-day").append(days);
    $("#yearly-dow-month").append(months);
    $("#popup-container_wrapper").ejWaitingPopup("hide");
    $("#daily-every-x-days").prop("checked", true);
    $("#monthly").prop("checked", true);
    $("#yearly").prop("checked", true);
    $("#every-x-days, #monthly-date, #yearly-day").ejNumericTextbox({ name: "numeric", value: 1, minValue: 1, maxValue: 31, width: "65px", height: "34px", incrementStep: 1 });
    $("#every-x-weeks, #every-x-years").ejNumericTextbox({ name: "numeric", value: 1, minValue: 1, maxValue: 99, width: "65px", height: "34px", incrementStep: 1 });
    $("#occurence-count").ejNumericTextbox({ name: "numeric", value: 1, minValue: 1, maxValue: 999, width: "65px", height: "34px", incrementStep: 1 });
    $('#monthly-dow-every-x-months, #monthly-every-x-months').ejNumericTextbox({ name: "numeric", value: 1, minValue: 1, maxValue: 12, width: "65px", height: "34px", incrementStep: 1 });
    Globalize.addCultureInfo("en-US", "default", {
        name: "en-US",
        englishName: "English (United States)",
        nativeName: "English (United States)",
        language: "en",
        calendars: {
            standard: {
                "/": ".",
                firstDay: 1,
                days: {
                    names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                    namesAbbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                    namesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
                },
                months: {
                    names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""],
                    namesAbbr: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""]
                },
            }
        }
    });
    if (timeFormat == "True") {
        $("#start-date").ejDateTimePicker({ dateTimeFormat: dateFormat + " HH:mm", timeDisplayFormat: " HH:mm" });
        $("#end-date").ejDateTimePicker({ dateTimeFormat: dateFormat + " HH:mm", timeDisplayFormat: " HH:mm" });
    }
    else {
        $("#start-date").ejDateTimePicker({ dateTimeFormat: dateFormat + " hh:mm tt", timeDisplayFormat: " hh:mm tt" });
        $("#end-date").ejDateTimePicker({ dateTimeFormat: dateFormat + " hh:mm tt", timeDisplayFormat: " hh:mm tt" });
    }

    $("#start-date").ejDateTimePicker({
        interval: 10,
        value: zoneDateTime,
        change: validateDateTimePicker,
        enableStrictMode: false,
        locale: "en-US",
        timePopupWidth: 108,
        buttonText: { today: "[[[Today]]]", timeNow: "[[[Now]]]", done: "[[[Done]]]", timeTitle: "[[[Time]]]" },
        change: function (args) {
            var scheduleMessage = createScheduleMessage(false);
            $("#schedule-message").text(scheduleMessage);
        }
    });
    $("#end-date").ejDateTimePicker({
        interval: 10,
        value: zoneDateTime,
        enableStrictMode: false,
        locale: "en-US",
        timePopupWidth: 108,
        buttonText: { today: "[[[Today]]]", timeNow: "[[[Now]]]", done: "[[[Done]]]", timeTitle: "[[[Time]]]" },
        change: function (args) {
            var scheduleMessage = createScheduleMessage(false);
            $("#schedule-message").text(scheduleMessage);
        }
    });

    $("#start-date,#end-date").attr("disabled", "disabled");
    $("#start-date,#end-date").css({ cursor: "default" });


function validateDateTimePicker() {
    var startDate = $("#start-date").data("ejDateTimePicker");
    var endDate = $("#end-date").data("ejDateTimePicker");
    var startValue = $("#start-date").data("ejDateTimePicker").getValue();
    var mindateVal = new Date(startValue);
    var formattedString = "";
    $("#end-date").ejDateTimePicker({ minDateTime: new Date(mindateVal.getFullYear(), mindateVal.getMonth(), mindateVal.getDate()), value: new Date(startValue) });
    var hours = parseInt($("#hour-difference").val());
    var mins = parseInt($("#minute-difference").val());
    mindateVal.setHours(mindateVal.getHours() + hours);
    mindateVal.setMinutes(mindateVal.getMinutes() + mins);
    if (timeFormat == "True") {
        formattedString = DateCustomFormat(dateFormat + " HH:mm", mindateVal,timeFormat);
    }
    else {
        formattedString = DateCustomFormat(dateFormat + " hh:mm", mindateVal,timeFormat);
        formattedString += (mindateVal.getHours() >= 12) ? " PM" : " AM";
    }
    $("#time").html(formattedString);
}

function createScheduleMessage(isPopupMessage) {
    var scheduleItem = {};
    var scheduleMessage = "[[[Occurs ]]]";
    scheduleItem.RecurrenceFactor = $("#occurence-count").val();
    switch ($("#recurrence-type").val().toString().toLowerCase()) {
        case "daily":
            if ($("#daily-every-x-days").prop("checked")) {
                scheduleItem.RecurrenceType = "Daily";
                scheduleItem.RecurrenceInterval = $("#every-x-days").val();
                if (scheduleItem.RecurrenceInterval == 1)
                    addScheduleDetail = "[[[every day]]]";
                else
                    addScheduleDetail = "[[[every]]] " + scheduleItem.RecurrenceInterval.toString() + " [[[days]]]";
            }
            else {
                scheduleItem.RecurrenceType = "DailyWeekDay";
                addScheduleDetail = "[[[every weekday]]]";
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
            var daysDetail = "";
            var selectDays = $(".daygroup:checked");
            for (var i = 0; i < selectDays.length; i++) {
                if (selectDays.length == 1 || i == 0)
                    daysDetail = $(selectDays[i]).parent().text().trim();
                else if (i > 0 && i != selectDays.length - 1)
                    daysDetail = daysDetail + ", " + $(selectDays[i]).parent().text().trim();
                else
                    daysDetail = daysDetail + " [[[and]]] " + $(selectDays[i]).parent().text().trim();
            }
            if (scheduleItem.RecurrenceInterval == 1) {
                addScheduleDetail = "[[[every week ]]]";
            }
            else {
                addScheduleDetail = "[[[every ]]] " + scheduleItem.RecurrenceInterval.toString() + " [[[week(s)]]] ";
            }
            addScheduleDetail += daysDetail != "" ? "[[[on ]]]" + daysDetail : "";
            break;
        case "monthly":
            if ($("#monthly").prop("checked")) {
                scheduleItem.RecurrenceType = "Monthly";
                scheduleItem.DaysOfMonth = $("#monthly-date").val();
                scheduleItem.RecurrenceInterval = $("#monthly-every-x-months").val();
                addScheduleDetail = "[[[day]]] " + scheduleItem.DaysOfMonth.toString() + " [[[of every]]] " + scheduleItem.RecurrenceInterval.toString() + " [[[month(s)]]]";
            }
            else {
                scheduleItem.RecurrenceType = "MonthlyDOW";
                scheduleItem.WeekOfMonth = $("#monthly-dow-week").find('option:selected').text();
                scheduleItem.DayOfWeek = $("#monthly-dow-day").find('option:selected').text();
                scheduleItem.RecurrenceInterval = $("#monthly-dow-every-x-months").val();
                addScheduleDetail = "[[[the]]] " + scheduleItem.WeekOfMonth.toString() + " " + $("#monthly-dow-day").find('option:selected').text() + " [[[of every]]] " + scheduleItem.RecurrenceInterval.toString() + " [[[month(s)]]]";
            }
            break;
        case "yearly":
            scheduleItem.RecurrenceInterval = $("#every-x-years").val();
            if ($("#yearly").prop("checked")) {
                scheduleItem.RecurrenceType = "Yearly";
                scheduleItem.DaysOfMonth = $("#yearly-day").val();
                scheduleItem.MonthOfYear = $("#yearly-month").find('option:selected').text();
                if (scheduleItem.RecurrenceInterval == 1)
                    addScheduleDetail = "[[[every]]] " + scheduleItem.MonthOfYear.toString() + " " + scheduleItem.DaysOfMonth.toString();
                else
                    addScheduleDetail = "[[[every]]] " + scheduleItem.RecurrenceInterval.toString() + " [[[years on]]] " + scheduleItem.MonthOfYear.toString() + " " + scheduleItem.DaysOfMonth.toString();
            }
            else {
                scheduleItem.RecurrenceType = "YearlyDOW";
                scheduleItem.WeekOfMonth = $("#yearly-dow-week").find('option:selected').text();
                scheduleItem.DayOfWeek = $("#yearly-dow-day").find('option:selected').text();
                scheduleItem.MonthOfYear = $("#yearly-dow-month").find('option:selected').text();
                if (scheduleItem.RecurrenceInterval == 1)
                    addScheduleDetail = "[[[the]]] " + scheduleItem.WeekOfMonth.toString() + " " + $("#yearly-dow-day option:selected").text() + " [[[of]]] " + scheduleItem.MonthOfYear.toString();
                else
                    addScheduleDetail = "[[[every]]] " + scheduleItem.RecurrenceInterval.toString() + " [[[years on]]] " + scheduleItem.WeekOfMonth.toString() + " " + $("#yearly-dow-day option:selected").text() + " [[[of]]] " + scheduleItem.MonthOfYear.toString();
            }
            break;
        case "hourly":
            scheduleItem.RecurrenceType = "Hourly";
            scheduleItem.Frequency = $(".time-width").val();
            scheduleItem.RecurrenceInterval = $("#every-x-hours-value").val();
            var timesplit = scheduleItem.Frequency.split(':');
            var minutes = (timesplit[0]) + timesplit[1];
            var timeText = "";
            if (parseInt(timesplit[0]) > 0)
                timeText += timesplit[0] + " hour(s) ";
            if (parseInt(timesplit[1]) > 0)
                timeText += timesplit[1] + " minute(s)";
            addScheduleDetail = "[[[every ]]]" + timeText;
            break;
    }
    var startDate = $("#start-date").val();
    var endDate = $("#end-date").val();
    switch ($("input[name=end-type]:checked", "#schedule-end-type").val().toString()) {
        case "never":
            addScheduleDetail = addScheduleDetail + " [[[effective from]]] " + startDate;
            break;
        case "endafter":
            addScheduleDetail = addScheduleDetail + " [[[effective from]]] " + startDate + " [[[and ends after]]] " + scheduleItem.RecurrenceFactor + " [[[occurrences.]]]";
            break;
        case "endBy":
            addScheduleDetail = addScheduleDetail + " [[[effective from]]] " + startDate + " [[[until]]] " + endDate;
            break;
    }
    return (alertChange == 2 && isPopupMessage) ? addScheduleDetail : scheduleMessage + addScheduleDetail;
}

$(document).on("change", "#recurrence-type", function () {
    var selected = $(this).find("option:selected").val();
    $("#daily-schedule-option, #weekly-schedule-option, #monthly-schedule-option, #yearly-schedule-option,#frequency").css("display", "none");
    switch (selected.toString().toLowerCase()) {
        case "daily":
            $("#daily-schedule-option").css("display", "block");
            $("#no-view-start,#no-view-end,#time-zone").css("display", "inline");
            break;
        case "weekly":
            $("#weekly-schedule-option").css("display", "block");
            $("#no-view-start,#no-view-end,#time-zone").css("display", "inline");
            break;
        case "monthly":
            $("#monthly-schedule-option").css("display", "block");
            $("#no-view-start,#no-view-end,#time-zone").css("display", "inline");
            break;
        case "yearly":
            $("#yearly-schedule-option").css("display", "block");
            $("#no-view-start,#no-view-end,#time-zone").css("display", "inline");
            break;
        case "hourly":
            $("#frequency").css("display", "block");
            $("#no-view-start,#no-view-end,#time-zone").css("display", "inline");
            break;
    }
    var scheduleMessage = createScheduleMessage(false);
    $("#schedule-message").text(scheduleMessage);
});

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

//To  stop animation in radio-button on page rendering
$(document).on("click", ".css-radio", function () {
    $(this).siblings("label").removeClass("notransition");
});

function DateTimeParser(dateTime) {
    if (dateTime == undefined) {
        return "";
    }
    var pattern = /Date\(([^)]+)\)/;
    var resultStrs = pattern.exec(dateTime);

    if (resultStrs != null) {
        var dtObj = new Date(parseInt(resultStrs[1]));
        return dtObj;
    }
    else {
        return dateTime;
    }
}

function validateNextSchedule() {
    var scheduleItem = {};
    scheduleItem.ScheduleName = $("#schedule-name").val();
    scheduleItem.ItemId = createdItemId;
    scheduleItem.StartDate = $("#start-date").val();
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
    $.ajax({
        type: "POST",
        url: getNextScheduleUrl,
        async:false,
        data: {
            scheduleList: JSON.stringify({ ScheduleItem: scheduleItem, alert: alertChange })
        },
        beforeSend: function () {
            parent.$("#popup-container_wrapper").ejWaitingPopup("show");
        },
        success: function (data) {
            parent.$("#popup-container_wrapper").ejWaitingPopup("hide");
            if (data == "") {
                $("#end-date-validator").html("[[[Invalid end date]]]").css("display", "inline");
            }
            else 
            {
                $("#end-date-validator").css("display","none");
                url = scheduleRecipients;
                enableSubscribeOption();
            }
        }
    });
}

$(document).on("change", ".change-event, input[type=radio][name=daily-recurrence-type], input[type=radio][name=end-type], input[type=radio][name=monthly], input[type=radio][name=yearly]", function () {
    var scheduleMessage = createScheduleMessage(false);
    $("#schedule-message").text(scheduleMessage);
});