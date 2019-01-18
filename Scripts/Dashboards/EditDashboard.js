$(function () {
    $(document).on("keyup", ".text-field", function (e) {
        if ($(this).attr("id") === "file_name") {
            if (window.editData.Name !== $(this).val()) {
                $("#name_change_validation").val(true);
            }
            else {
                $("#name_change_validation").val(false);
            }
        }
        if ($(this).attr("id") === "file_description") {
            if (window.editData.Description !== $(this).val()) {
                $("#description_change_validation").val(true);
            }
            else {
                $("#description_change_validation").val(false);
            }
        }
        onChangeValidation();
    });

        $(document).on("keyup", ".draft-text-field", function (e) {
            if ($(this).attr("id") === "draft_file_name") {
                if (window.editData.Name !== $(this).val()) {
                    $("#draft_name_change_validation").val(true);
                }
                else {
                    $("#draft_name_change_validation").val(false);
                }
            }
            if ($(this).attr("id") === "draft_file_description") {
                if (window.editData.Description !== $(this).val()) {
                    $("#draft_description_change_validation").val(true);
                }
                else {
                    $("#draft_description_change_validation").val(false);
                }
            }
            onDraftChangeValidation();
        });

    $(document).on('change', '#browse_file', function (e) {
        if ($(this).val().substring($(this).val().lastIndexOf('.') + 1) == "sydx") {
            var value = $(this).val() == "" ? "[[[Browse file path]]]": $(this).val();
            $("#name").val(value.substring(value.lastIndexOf('\\') + 1));
            $(".fileUpload").removeClass("error-file-upload");
            $(".fileUpload").removeClass('no-left-border');
            $("#name").removeClass('error-file-upload');
            $("#name").closest('td').find("span.validation-message").html("");
        }
        else {
            $(".fileUpload").addClass("error-file-upload");
            $(".fileUpload").addClass('no-left-border');
            $("#name").addClass('error-file-upload');
            $("#validate-file").text("[[[Please choose a valid SYDX file to upload]]]");
            $("#name").val(window.editData.Name + ".sydx");
            $("#browse_file").val("");
            isValid = false;
        }
        $("#browse_file").val()==""?$("#source_change_validation").val(false):$("#source_change_validation").val(true);
        onChangeValidation();
    });

    $(document).on("change", "#selected_category", function (e) {
        if (window.editData.CategoryId !== $(this).val()) {
            $("#category_change_validation").val(true);
        }
        else {
            $("#category_change_validation").val(false);
        }
        onChangeValidation();
    });

    $(document).on("change", "#draft_selected_category", function (e) {
        if (window.editData.CategoryId !== $(this).val()) {
            $("#draft_category_change_validation").val(true);
        }
        else {
            $("#draft_category_change_validation").val(false);
        }
        onDraftChangeValidation();
    });

    $.validator.addMethod("isRequired", function (value, element) {
        return !parent.isEmptyOrWhitespace(value);
    }, "Please enter the name");

    $.validator.addMethod("isValidName", function (value, element) {
        return parent.IsValidName("name", value);
    }, "Please avoid special characters");

    $("#edit-dashboard-form").validate({
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
            "Name": {
                isRequired: true,
                isValidName: true
            }
        },
        messages: {
            "Name": {
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

    $("#edit-draft-form").validate({
        errorElement: 'div',
        onkeyup: function (element, event) {
            if (event.keyCode != 9) {
                $(element).valid();
            }
            if (event.keyCode == 8 || event.keyCode == 46 || !$(element).valid()) {
                $("#draft_validate-name").parent('span').removeClass('has-error');
                $("#draft_validate-name").text("");
            } else true;
        },
        onfocusout: function (element) { $(element).valid(); },
        rules: {
            "Name": {
                isRequired: true,
                isValidName: true
            }
        },
        messages: {
            "Name": {
                isRequired: "[[[Please enter dashboard name]]]"
            }
        },
        highlight: function (element) {
            $(element).closest('td').addClass("has-error");
        },
        unhighlight: function (element) {
            if ($(element).attr('id') == 'draft_file_name') {
                $(element).closest('td').removeClass('has-error');
                $(element).closest('td').find("div").html("");
            }
        },
        errorPlacement: function (error, element) {
            $(element).closest('td').find("div").html(error.html());
        }
    });

    window.parent.$('#edit-file-popup_wrapper').ejWaitingPopup("hide");
    window.parent.$('#publish-draft-popup_wrapper').ejWaitingPopup("hide");

    $('#file_name').bind("keypress", function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            if ($("#cancelEditFile").is(":focus")) {
                closeEditFilePopup();
            } else {
                validateNewFileForm();
            }
            return false;
        }
    });

    $('#draft_file_name').bind("keypress", function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            if ($("#canceldraftEdit").is(":focus")) {
                closePublishDraftPopup();
            } else {
                validateDraftFileForm();
            }
            return false;
        }
    });

    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            if (e.target.id != "browse_file")
                $('.PopupClose').click();
            else {
                $('#name').focus();
            }
        }
    });

    $(document).on("click", "#name", function () {
        $("#browse_file").trigger('click');
        $("#browse_file").focus();
    });
});

function validateNewFileForm() {
    window.parent.IsVersionNotChanged = parent.$("#edit-file-popup-iframe").contents().find("#version_comment").prop("disabled");
    window.parent.ItemId = parent.$("#edit-file-popup-iframe").contents().find("tbody").prev().val();
    var canProceed = false;
    var isValid = $("#edit-dashboard-form").valid();
    var fileName = $("#file_name").val();
    if (isValid) {
        parent.$("#edit-file-popup_wrapper").ejWaitingPopup("show");
        if ($("#name_change_validation").val() == "true" || $("#category_change_validation").val() == "true") {
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
                        parent.$("#edit-file-popup_wrapper").ejWaitingPopup("hide");
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
        else {
            canProceed = true;
        }
    }
    if (canProceed) {
        $('form').submit();
    }
    else {
        parent.$("#edit-file-popup_wrapper").ejWaitingPopup("hide");
    }
}

function validateDraftFileForm() {
    window.parent.ItemId = parent.$("#publish-draft-popup-iframe").contents().find("tbody").prev().val();
    var canProceed = false;
    var isValid = $("#edit-draft-form").valid();
    var fileName = $("#draft_file_name").val();
    if (isValid) {
        parent.$("#publish-draft-popup_wrapper").ejWaitingPopup("show");
        if ($("#draft_name_change_validation").val() == "true" || $("#draft_category_change_validation").val() == "true") {
            var categoryId = $("#draft_selected_category option:selected").val();
            $.ajax({
                type: "POST",
                url: isitemexistinsamecategoryUrl,
                data: { categoryId: categoryId, itemName: fileName },
                async: false,
                success: function (data) {
                    if (data.Data) {
                        $("#draft_validate-name").parent('span').addClass("has-error");
                        $("#draft_validate-name").text("[[[Dashboard with the same name already exists]]]");
                        $("#draft_validate-name").css("display", "block");
                        parent.$("#publish-draft-popup_wrapper").ejWaitingPopup("hide");
                        canProceed = false;
                    }
                    else {
                        $("#draft_validate-name").parent('span').removeClass("has-error");
                        $("#draft_validate-name").text("");
                        canProceed = true;
                    }
                }
            });
        }
        else {
            canProceed = true;
        }
    }
    if (canProceed) {
        $('form').submit();
    }
    else {
        parent.$("#publish-draft-popup_wrapper").ejWaitingPopup("hide");
    }
}

function closeEditFilePopup() {
    parent.$("#edit-file-popup").ejDialog("close");
}

function closePublishDraftPopup() {
    parent.$("#publish-draft-popup").ejDialog("close");
}

function onChangeValidation() {
    if ($("#name_change_validation").val() == "true" || $("#description_change_validation").val() == "true" || $("#source_change_validation").val() == "true" || $("#category_change_validation").val() == "true") {
        $("#publish_file").attr("disabled", false);
    }
    else {
        $("#publish_file").attr("disabled", true);
    }
    if ($("#source_change_validation").val() == "true") {
        $("#version_comment").attr("disabled", false);
    }
}

function onDraftChangeValidation() {
    if (($("#draft_name_change_validation").val() == "true" || $("#draft_description_change_validation").val() == "true" || $("#draft_category_change_validation").val() == "true") && $("#draft_selected_category option:selected").val()) {
        $("#publish_file").attr("disabled", false);
    }
    else {
        $("#publish_file").attr("disabled", true);
    }
}

function getDashboardDatasource(categoryId, itemId, dashboardscope) {
    parent.$("#update-data-source-popup").ejDialog("open");
    parent.ShowWaitingProgress("#update-data-source-popup_wrapper", "show");
    parent.$("#update-data-source-popup-iframe").attr("src", getUpdateDataSourceUrl + "?itemId=" + itemId);
    parent.$("#update-data-source-popup-iframe").attr("data-item-id", itemId);
    parent.window.CategoryId = categoryId;
    parent.window.IsUpdateDashboard = true;
}