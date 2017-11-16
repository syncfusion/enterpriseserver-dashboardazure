var isValid = true;
$(function () {
    parent.$("#report_popup_wrapper").ejWaitingPopup("hide");

    $.validator.addMethod("isRequired", function (value, element) {
        return !parent.isEmptyOrWhitespace(value);
    }, "[[[Please enter the name]]]");

    $.validator.addMethod("isValidName", function (value, element) {
        return parent.IsValidName("name", value);
    }, "[[[Please avoid special characters]]]");

    $("#add-dashboard-form").validate({
        errorElement: 'div',
        onkeyup: function(element, event) {
            if (event.keyCode != 9) {
                $(element).valid();
            }
            if (event.keyCode == 8 || event.keyCode == 46 || !$(element).valid()) {
                $("#validate-name").parent('span').removeClass('has-error');
                $("#validate-name").text("");
            } else true;
        },
        onfocusout: function (element) { $(element).valid(); },
        rules: {
            "fileName": {
                isRequired: true,
                isValidName:true
            }
        },
        messages: {
            "fileName": {
                isRequired: "[[[Please enter dashboard name]]]"
            }
        },
        highlight: function (element) {
            $(element).closest('td').addClass("has-error");
        },
        unhighlight: function (element) {
            if ($(element).attr('id') == 'file_name') {
                $(element).closest('td').removeClass('has-error');
                $(element).closest('td').find("div").html("");
            }
        },
        errorPlacement: function (error, element) {
            $(element).closest('td').find("div").html(error.html());
        }
    });

    $('#file_name').bind("keypress", function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            addDashboardValidate();
            return false;
        }
    });

    $(document).on("click", "#filename", function () {
        $("#browse_file").trigger("click");
        $("#browse_file").focus();
    });

    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            if (e.target.id != "browse_file") {
                $('.PopupClose').click();
                window.parent.$("#createButton").focus();
            } else {
                window.$("#publish_file").focus();
            }
        }
    });

    $(document).on("change", "#browse_file", function () {
        if ($(this).val().substring($(this).val().lastIndexOf('.') + 1) == "sydx") {
            var value = $(this).val() == "" ? "[[[Browse file path]]]" : $(this).val();
            $("#filename").val(value.substring(value.lastIndexOf('\\') + 1));
            $(".fileUpload").removeClass("error-file-upload");
            $(".fileUpload").removeClass('no-left-border');
            $("#filename").removeClass('error-file-upload');
            $("#filename").closest('td').find("span.validation-message").html("");
        }
        else {
            $(".fileUpload").addClass('error-file-upload');
            $(".fileUpload").addClass('no-left-border');
            $("#filename").addClass('error-file-upload');
            $("#validate-file").html("[[[Please choose a valid SYDX file to upload]]]");
            $("#filename").val("[[[Browse file path]]]");
            $("#browse_file").val("");
            isValid = false;
        }
    });
});

function addDashboardValidate() {
    isValid = true;
    var canProceed = false;
    var fileName = $("#file_name").val().trim();
    if ($("#selected_category").val() == null || $("#selected_category").val() == "") {
        if ($("#emtpyCategoryList").length == 0) {
            $("#CategoryMessage").removeClass("hide").addClass("show");
        }
        isValid = false;
    } else {
        $("#CategoryMessage").removeClass("show").addClass("hide");
    }
    ValidateFile();
    if (!$("#add-dashboard-form").valid() || !ValidateFile()) {
        isValid = false;
    }
    if (isValid) {
        parent.$("#report_popup_wrapper").ejWaitingPopup("show");
        var categoryId = $("#selected_category option:selected").val();
        $.ajax({
            type: "POST",
            url: isitemexistinsamecategoryUrl,
            data: { categoryId: categoryId, itemName: fileName },
            async: false,
            success: function (data) {
                if (data.Data) {
                    $("#validate-name").parent('span').addClass("has-error");
                    $("#validate-name").text("[[[Dashboard with the same name already exists]]]");
                    $("#validate-name").css("display", "block");
                    $("#validate-file").css("display", "none");
                    parent.$("#report_popup_wrapper").ejWaitingPopup("hide");
                    canProceed = false;
                }
                else {
                    $("#validate-name").parent('span').removeClass("has-error");
                    $("#validate-name").text("");
                    $("#validate-file").text("");
                    canProceed = true;
                }
            }
        });
    }
    if (canProceed) {
        var categoryId = $("#selected_category option:selected").val();
        $('form').submit();
    }
    else {
        parent.$("#report_popup_wrapper").ejWaitingPopup("hide");
    }
}

function closeAddDashboardPopup() {
    parent.$("#report_popup").ejDialog("close");
}

function ValidateFile() {
    var isValidFile = true;
    var filename = $('#browse_file').val();
    if (filename == '') {
        $(".fileUpload").addClass('error-file-upload');
        $(".fileUpload").addClass('no-left-border');
        $("#filename").addClass('error-file-upload');
        $("#validate-file").html("[[[Please upload dashboard file]]]");
        $("#filename").val("[[[Browse file path]]]");
        $("#browse_file").val("");
        isValidFile = false;
    }
    else {
        $(".fileUpload").removeClass("error-file-upload");
        $(".fileUpload").removeClass('no-left-border');
        $("#filename").removeClass('error-file-upload');
        $("#filename").closest('td').find("span.validation-message").html("");
        isValidFile = true;
    }
    return isValidFile;
}