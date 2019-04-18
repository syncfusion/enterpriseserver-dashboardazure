$(document).ready(function () {
    $("#body").ejWaitingPopup();
});

$(document).on("click", "#update-dashboard-settings", function () {
    $(".confirmationMessage").html("");

    var dashboardSettings = {
      IsMarkItemsPublic: $("#restrict-makepublic-dashboard").is(":checked")
    };
    $("#body").ejWaitingPopup("show");
    $.ajax({
        type: "POST",
        url: $(this).data("url"),
        data: { dashboardSettingsData: dashboardSettings },
        success: function (result) {
            if (result.status) {
                SuccessAlert("[[[Dashboard Settings]]]", "[[[Settings has been updated successfully.]]]", 7000);
            } else {
                WarningAlert("[[[Dashboard Settings]]]", "[[[Error while updating settings.]]]", 7000);
            }
            $("#body").ejWaitingPopup("hide");
        }
    });
});