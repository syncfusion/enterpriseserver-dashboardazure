$(function () {
    parent.$("#widget_popup_wrapper").ejWaitingPopup("hide");

    $.validator.addMethod("isValidName", function (value, element) {
        return parent.IsValidName("name", value);
    }, "[[[Please avoid special characters]]]");

    $.validator.addMethod("isRequired", function (value, element) {
        return !parent.isEmptyOrWhitespace(value);
    }, "[[[Please enter the name]]]");

    $("#addItemForm").validate({
        errorElement: "div",
        onkeyup: function (element, event) {
            if (event.keyCode != 9) {
                $(element).valid();
            }
            if (event.keyCode == 8 || event.keyCode == 46 || !$(element).valid()) {
                $("#validate-name").parent("span").removeClass("has-error");
                $("#validate-name").text("");
            } else true;
        },
        onfocusout: function (element) { $(element).valid(); },
        rules: {
            "widgetname": {
                isRequired: true,
                isValidName: true
            }
        },
        messages: {
            "widgetname": {
                isRequired: "[[[Please enter widget name]]]"
            }
        },
        highlight: function (element) {
            $(element).closest("td").addClass("has-error");
        },
        unhighlight: function (element) {
            if ($(element).attr("id") === "file_name") {
                $(element).closest("td").removeClass("has-error");
                $(element).closest("td").find("div").html("");
            }
        },
        errorPlacement: function (error, element) {
            $(element).closest("td").find("div").html(error.html());
        }
    });

    $("#file_name").bind("keypress", function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            if ($("#cancelAddFile").is(":focus")) {
                closeAddItemPopup();
            } else {
                addfileValidate();
            }
            return false;
        }
    });

    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            if (e.target.id != "browse_file") {
                closeAddItemPopup();
                window.parent.$("#createButton").focus();
            } else {
                window.$("#publish_file").focus();
            }
        }
    });
});

$(document).on("change", "#browse_file", function () {
    var value = $(this).val() === "" ? "[[[Browse file path]]]" : $(this).val();
    var fileNameWithExtension = value.substring(value.lastIndexOf("\\") + 1);
    $("#filename").val(fileNameWithExtension);
    validFileType();
    $("#filename").trigger("focus");
});

$(document).on("click", "#filename", function () {
    $("#browse_file").trigger("click");
    $("#browse_file").focus();
});

function closeAddItemPopup() {
    parent.$("#widget_popup").ejDialog("close");
    parent.$("#widget_popup").find("iframe").contents().find("html").html("");
}

function addfileValidate(e) {
    var canProceed = false;
    parent.$("#widget_popup_wrapper").ejWaitingPopup("show");
    validFileType();
    if (!$("#addItemForm").valid() || !validFileType()) {
        parent.$("#widget_popup_wrapper").ejWaitingPopup("hide");
        return false;
    }
    else {
        $.ajax({
            type: "POST",
            url: window.iswidgetexistUrl,
            data: { filename: $("#file_name").val() },
            async: false,
            success: function (data) {
                if (data.Data) {
                    $("#validate-name").parent("span").addClass("has-error");
                    $("#validate-name").text("[[[Widget name already exists]]]");
                    $("#validate-file").closest("td").removeClass("has-error");
                    canProceed = false;
                    parent.$("#widget_popup_wrapper").ejWaitingPopup("hide");
                } else {
                    $("#validate-name").parent("span").removeClass("has-error");
                    $("#validate-name").text("");
                    $("#validate-file").closest("td").removeClass("has-error");
                    $("#validate-file").text("");
                    canProceed = true;
                }
            }
        });
    }
    if (canProceed) {
        $("form").submit();
    }
    else {
        parent.$("#widget_popup_wrapper").ejWaitingPopup("hide");
        return false;
    }
}

function validFileType() {
    if ($("#browse_file").val() !== "") {
        if ($("#filename").val().split(".").pop().toLowerCase() !== "sydw" && $("#filename").val().indexOf(".") > -1 && $("#filename").val() !== "") {
            $(".fileUpload").addClass("error-file-upload").addClass("no-left-border");
            $("#filename").addClass("error-file-upload");
            $("#validate-file").html("[[[Please choose a valid SYDW file to upload]]]");
            $("#filename").val("[[[Browse file path]]]");
            $("#browse_file").val("");
            return false;
        }
        else {
            $(".fileUpload").removeClass("error-file-upload").removeClass("no-left-border");
            $("#filename").removeClass("error-file-upload");
            $("#validate-file").html("");
            return true;
        }
    }
    else {
        $(".fileUpload").addClass("error-file-upload");
        $(".fileUpload").addClass("no-left-border");
        $("#filename").addClass("error-file-upload");
        $("#filename").closest("td").find("span.validation-message").html("[[[Please upload widget file]]]");
        return false;
    }
}