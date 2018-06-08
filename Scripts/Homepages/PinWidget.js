$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();

    $('input[type=radio][name=pin-widget-option]').change(function () {
        if (this.value == 'pin-exist') {
            $("#input-content").addClass("hidden");
            $("#select-content").removeClass("hidden").find("span.validation-errors").html("");
            $("#select-homepage").prop("disabled", false).val("").selectpicker("refresh");
            for (var i = 0; i < $(".dropdown-menu .selectpicker li").length; i++) {
                var title = $(".dropdown-menu .selectpicker li").eq(i).find("a .text").text();
                $(".dropdown-menu .selectpicker li ").eq(i).find('a').attr("title", title);
            }
        }
        else if (this.value == 'pin-new') {
            $("#select-content").addClass("hidden");
            $("#input-content").removeClass("hidden");
            $("#new-homepage-name").focus().val("").next("span.validation-errors").html("").parent().removeClass("has-error");
        }
    });

    $(document).on("click", "#save-button", function () {
        var itemName = parent.window.IsDashboard ? "Dashboard" : "Widget";
        parent.$("#pin-widget-popup_wrapper").ejWaitingPopup("show");
        var dashboardItemId = parent.$("#pin-widget-popup").attr("data-item-id");
        var tabId = parent.$("#pin-widget-popup").attr("data-tab-id");
        var widgetItemId = parent.$("#pin-widget-popup").attr("data-widget-id");
        var isKeepFilterEnabled = $("#keepfilter").prop("checked");
        var filterQueryString = isKeepFilterEnabled ? parent.$('#dashboard').data("ejDashboardViewer").getCurrentFilters() != null ? parent.$('#dashboard').data("ejDashboardViewer").getCurrentFilters().encryptedData : null : null;
        var homepageItemType = $('#select-homepage option:selected').data('item');
        var isVirtualHomepage = $('#select-homepage option:selected').data('virtual-homepage');
        var widgetName = $("#widget-name").val().trim();
        var isValid = $("#pin-widget-form").valid();
        var isTwoColumn = window.screen.availWidth >= 1366 ? false : true;
        if ($('input[name=pin-widget-option]:checked').val() == "pin-exist") {
            if (isValid) {
                if ($('#select-homepage').val() != "" || isVirtualHomepage) {
                    var homepageItemId = $('#select-homepage').val();
                    if ((homepageItemId != "" && dashboardItemId != "" && widgetItemId != "") || isVirtualHomepage) {
                        if (homepageItemType == "Dashboard") {
                            $("#select-content").find("span.validation-errors").html(itemName + "[[[ cannot be pinned to a homepage that already contains a dashboard.]]]");
                            parent.$("#pin-widget-popup_wrapper").ejWaitingPopup("hide");
                        }
                        else {
                            if (isVirtualHomepage) {
                                $.ajax({
                                    type: "POST",
                                    url: addHomepageUrl,
                                    async: false,
                                    data: { homepageName: "Homepage1", checkedStatus: true, isDashboardHomepage: false, isTwoColumn: isTwoColumn },
                                    success: function (result) {
                                        if (result.Success) {
                                            homepageItemId = result.Value;
                                        }
                                    }
                                });
                            }
                            $.ajax({
                                type: "POST",
                                url: pinWidgetUrl,
                                data: { homepageId: homepageItemId, widgetId: widgetItemId != undefined ? widgetItemId : null, dashboardId: dashboardItemId != undefined ? dashboardItemId : null, tabId: tabId != null ? tabId : null, widgetName: widgetName, queryString: filterQueryString },
                                success: function (result) {
                                    if (result.Success) {
                                        SuccessAlert(itemName + "[[[ has been pinned successfully.]]]", "", 7000);
                                    }
                                    else if (!result.Success && result.Value == "Pinned Widgets Limit Exceeded") {
                                        WarningAlert("[[[Unable to pin widget to the homepage. Widget limit exceeded.]]]", "", 7000);
                                    }
                                    else {
                                        WarningAlert("[[[Error while pinning ]]]" + itemName + "[[[ to the homepage.]]]", "", 7000);
                                    }
                                    closePinWidgetPopup();
                                }
                            });
                        }
                    }
                }
                else {
                    $("#select-content").find("span.validation-errors").html("[[[Please select homepage]]]");
                    parent.$("#pin-widget-popup_wrapper").ejWaitingPopup("hide");
                }
            }
            else {
                parent.$("#pin-widget-popup_wrapper").ejWaitingPopup("hide");
            }
        }
        else if ($('input[name=pin-widget-option]:checked').val() == "pin-new") {
            if (isValid) {
                var newHomepageName = $("#new-homepage-name").val().trim();
                if (newHomepageName != "") {
                    $.ajax({
                        type: "POST",
                        url: checkHomepageNameExistUrl,
                        data: { homepageName: newHomepageName },
                        success: function (result) {
                            if (result) {
                                $("#new-homepage-name").next("span.validation-errors").html("[[[Homepage name already exists.]]]").parent().addClass("has-error");
                                parent.$("#pin-widget-popup_wrapper").ejWaitingPopup("hide");
                            }
                            else {
                                $.ajax({
                                    type: "POST",
                                    url: addHomepageUrl,
                                    data: { homepageName: newHomepageName, checkedStatus: false, isDashboardHomepage: false, isTwoColumn: isTwoColumn },
                                    success: function (result) {
                                        if (result.Success) {
                                            var homepageItemId = result.Value;
                                            $.ajax({
                                                type: "POST",
                                                url: pinWidgetUrl,
                                                data: { homepageId: homepageItemId, widgetId: widgetItemId != undefined ? widgetItemId : null, dashboardId: dashboardItemId != undefined ? dashboardItemId : null, tabId: tabId != null ? tabId : null, widgetName: widgetName, queryString: filterQueryString },
                                                success: function (result) {
                                                    if (result.Success) {
                                                        SuccessAlert(itemName + "[[[ has been pinned successfully.]]]", "", 7000);
                                                    }
                                                    else {
                                                        WarningAlert("[[[Homepage has been added successfully. Error while pinning ]]]" + itemName + "[[[ to the homepage.]]]", "", 7000);
                                                    }
                                                }
                                            });
                                        }
                                        else {
                                            WarningAlert("[[[Error while adding a new homepage.]]]", "", 7000);
                                        }
                                        closePinWidgetPopup();
                                    }
                                });
                            }
                        }
                    });
                }
            }
            else {
                parent.$("#pin-widget-popup_wrapper").ejWaitingPopup("hide");
            }
        }
        else {
            $("#select-content").find("span.validation-errors").html("[[[Please pin to existing homepage or add a new one.]]]");
            parent.$("#pin-widget-popup_wrapper").ejWaitingPopup("hide");
        }
    });

    $(document).on("click", "#dashboard-homepage-save-button", function () {
        var isValidForm = $("#dashboard-homepage-form").valid();
        if (isValidForm) {
            var newHomepageName = $("#homepage-name").val().trim();
            var dashboardItemId = $("#dashboard-homepage-popup").attr("data-item-id");
            var dashboardInfo = $('#dashboard').data("ejDashboardViewer");
            var isMultiTabDashboard = isMultiDashboard.toLowerCase() == "true" ? true : false;
            var tabId = !window.PinParentDashboard ? isMultiTabDashboard ? dashboardInfo._getCurrentDashboardGuid() : null : null;
            var isMakeDefault = $("#makedefault").prop("checked");
            var isMultitabbedParentDashboard = isMultiTabDashboard && tabId == null ? true : false;
            var isKeepFilterEnabled = $("#keepfilter").prop("checked");
            var filterQueryString = isKeepFilterEnabled ? isMultitabbedParentDashboard ? dashboardInfo.getCurrentDashboardFilters() != null ? dashboardInfo.getCurrentDashboardFilters().encryptedData : null : dashboardInfo.getCurrentFilters() != null ? dashboardInfo.getCurrentFilters().encryptedData : null : null;
            var isTwoColumn = window.screen.availWidth >= 1366 ? false : true;
            if (newHomepageName != "") {
                $.ajax({
                    type: "POST",
                    url: checkHomepageNameExistUrl,
                    data: { homepageName: newHomepageName },
                    success: function (result) {
                        if (result) {
                            $("#homepage-name").next("span.validation-errors").html("[[[Homepage name already exists.]]]").parent().addClass("has-error");
                            $("#dashboard-homepage-popup_wrapper").ejWaitingPopup("hide");
                        }
                        else {
                            $.ajax({
                                type: "POST",
                                url: addHomepageUrl,
                                data: { homepageName: newHomepageName, checkedStatus: isMakeDefault, isDashboardHomepage: true, isTwoColumn: isTwoColumn },
                                success: function (result) {
                                    if (result.Success) {
                                        var homepageItemId = result.Value;
                                        $.ajax({
                                            type: "POST",
                                            url: pinDashboardUrl,
                                            data: { homepageId: homepageItemId, widgetId: null, dashboardId: dashboardItemId != undefined ? dashboardItemId : null, tabId: tabId, widgetName: null, queryString: filterQueryString },
                                            success: function (result) {
                                                if (result.Success) {
                                                    parent.$("#success-alert").addClass("pin-dashboard");
                                                    SuccessAlert("[[[Dashboard has been pinned successfully.]]]", "", 7000);
                                                }
                                                else {
                                                    WarningAlert("[[[Homepage has been added successfully. Error while pinning Dashboard to the homepage.]]]", "", 7000);
                                                }
                                            }
                                        });
                                    }
                                    else {
                                        WarningAlert("[[[Error while adding a new homepage.]]]", "", 7000);
                                    }
                                    closeDashboardHomepagePopup();
                                }
                            });
                        }
                    }
                });
            }
        }
        else {
            $("#dashboard-homepage-popup_wrapper").ejWaitingPopup("hide");
        }
    });

    $.validator.addMethod("isRequired", function (value, element) {
        return ($.trim(value) == "") ? false : true;
    }, "[[[Please enter homepage name]]]");

    $.validator.addMethod("IsValidName", function (value, element) {
        return !new RegExp(/[*\[\\\]\|\/\:\<\>\%\+\#\?\'\"\;\,]/).test(value);
    }, "[[[Please avoid special characters]]]");

    $("#pin-widget-form").validate({
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
            "newhomepagename": {
                isRequired: true,
                IsValidName: true
            },
            "widgetname": {
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
        },
        errorPlacement: function (error, element) {
            $(element).next("span.validation-errors").html(error);
        },
        messages: {
            "newhomepagename": {
                isRequired: "[[[Please enter homepage name]]]"
            },
            "widgetname": {
                isRequired: "[[[Please enter widget name]]]"
            }
        }
    });

    $("#dashboard-homepage-form").validate({
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
            "dashboardhomepagename": {
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
        },
        errorPlacement: function (error, element) {
            $(element).next("span.validation-errors").html(error);
        },
        messages: {
            "dashboardhomepagename": {
                isRequired: "[[[Please enter homepage name]]]"
            }
        }
    });

    $(document).on('change', '#select-homepage', function () {
        $("#select-content").find("span.validation-errors").html("");
    });

    $('#new-homepage-name').bind("keypress", function (e) {
        if (e.keyCode == 13) {
            $("#save-button").click();
        }
    });

    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            if (e.target.id == "dashboard-homepage-popup" || e.target.id == "homepage-name") {
                closeDashboardHomepagePopup();
            }
            else {
                closePinWidgetPopup();
            }
        }
    });
    $(document).on("click", "#dashboard-homepage-popup, #pin-widget-form", function (event) {
        if (event.target.id != "filter-info" && event.target.className != "popover-content") {
            $("#filter-info").popover("hide");
        }
    });

    $(document).on("click", ".css-radio", function () {
        $(this).siblings("label").removeClass("notransition");
    });

});

$(document).on("click", "#pin-parent-dashboard", function () {
    $("#dashboard-homepage-popup").ejDialog("open");
    $("#dashboard-homepage-popup_wrapper").ejWaitingPopup("show");
    $("#dashboard-homepage-container #homepage-name").val(ReportName);
    window.PinParentDashboard = true;
    $("#dashboard-homepage-container #filter-info").popover();
    $("#dashboard-homepage-popup_wrapper").ejWaitingPopup("hide");
});

function closePinWidgetPopup() {
    parent.$('#pin-widget-popup').attr("data-widget-id", null);
    parent.window.IsDashboard = false;
    parent.$("#pin-widget-popup-iframe").contents().find("#pin-widget-form").html("");
    parent.$("#pin-widget-popup_wrapper").ejWaitingPopup("hide");
    parent.$("#pin-widget-popup").ejDialog("close");
}

function closeDashboardHomepagePopup() {
    $("#dashboard-homepage-container #homepage-name").val("").next(".validation-errors").find(".error").remove();
    $("#dashboard-homepage-container #homepage-name").parent().removeClass("has-error");
    window.PinParentDashboard = false;
    $("#dashboard-homepage-container #makedefault").prop("checked", false);
    $("#dashboard-homepage-container #keepfilter").prop("checked", true);
    $("#dashboard-homepage-container #filter-info").popover("hide");
    $("#dashboard-homepage-popup_wrapper").ejWaitingPopup("hide");
    $("#dashboard-homepage-popup").ejDialog("close");
}

function SuccessAlert(header, content, duration) {
    parent.$("#success-alert").css("display", "table");
    parent.$("#message-header").html(header);
    parent.$("#message-content").html(content);
    setTimeout(function () {
        parent.$('#success-alert').fadeOut()
    }, duration);
}
function WarningAlert(header, content, duration) {
    parent.$("#warning-alert").css("display", "table");
    parent.$("#warning-alert #message-header").html(header);
    parent.$(" #warning-alert #message-content").html(content);
    if (duration != null && duration != "") {
        setTimeout(function () {
            parent.$('#warning-alert').fadeOut()
        }, duration);
    }
    $(document).on("click", ".close-div", function () {
        parent.$('#warning-alert').fadeOut()
    });
}