﻿$(document).ready(function () {
    var isFirstRequest = false;
    
    if (($(parent.window).width()) > 1400) {
        $("#add-user-permission").addClass("lg-flexible");
    }
    if (($(parent.window).width()) < 1400) {
            $("#add-user-permission").removeClass("lg-flexible");
    }

    $("#permission-delete-confirmation").ejDialog({
        width: "400px",
        showOnInit: false,
        showHeader: false,
        allowDraggable: false,
        enableResize: false,
        title: "[[[Delete item]]]",
        enableModal: true,
        close: "onPermissionDialogClose"
    });
    $("#permission-delete-confirmation-wrapper").ejWaitingPopup();

    $("#add-permission-button-top").click(function () {
        eDialog = $("#add-permission").data("ejDialog");
        eDialog.open();
        var user = $("#user-id-hidden").val();
        $("#add-permission-iframe").attr("src", addUserPermissionViewIframeUrl + "?userId=" + user);
        $("#add-permission_wrapper").ejWaitingPopup("show");
    });

    $(document).on("click", ".popup-close", function (e) {
        eDialog = parent.$("#add-permission").data("ejDialog");
        eDialog.close();
        parent.$("#add-permission iframe").attr("src", "");
    });

    $("#entity-selection").change(function () {
        $(".success-message, .error-message").html("");
        var entityType = $('option:selected', this).attr("data-entity-type");
        var entityModId = $(this).val();
        $("#scope-selection").find('option').not(':first').remove();

        $.ajax({
            type: "POST",
            url: getItemScopeAccessUrl,
            data: { entityId: entityModId },
            success: function (result, data) {
                var items = JSON.parse(result);
                var scope = items[0];
                var access = items[1];
                if ($.isEmptyObject(scope) && $.isEmptyObject(access)) {
                    $("#save-permission").attr("disabled", "disabled")
                }
                else {
                    $("#save-permission").removeAttr("disabled")
                }
                var optionsWithOutHeader = "";
                var options = "<option value='' data-hidden='true'></option>";
                if (scope !== null && scope.length > 0) {
                    var previousCategoryId = scope[0].CategoryId;
                    for (var t = 0; t < scope.length; t++) {
                        if (scope[t].ItemType == 2) {
                            if (scope[t].CategoryId != previousCategoryId) {
                                options = options + '<optgroup label="' + scope[t - 1].CategoryName + '">' + optionsWithOutHeader + '</optgroup>';
                                previousCategoryId = scope[t].CategoryId;
                                optionsWithOutHeader = "";
                            }

                            if (t == 0) {
                                optionsWithOutHeader += '<option value=' + scope[t].Id + ' selected="selected">' + scope[t].Name + '</option>';
                            } else {
                                optionsWithOutHeader += '<option value=' + scope[t].Id + '>' + scope[t].Name + '</option>';
                            }

                            if (t == (scope.length - 1)) {
                                options = options + '<optgroup label="' + scope[t].CategoryName + '">' + optionsWithOutHeader + '</optgroup>';
                            }
                        } else {
                            if (t == 0) {
                                options += '<option value=' + scope[t].Id + ' selected="selected">' + scope[t].Name + '</option>';
                            } else {
                                options += '<option value=' + scope[t].Id + '>' + scope[t].Name + '</option>';
                            }
                        }
                    }
                    $("#scope-selection").append(options).attr("disabled", false).selectpicker("refresh");
                }
                else {
                    $("#scope-selection").append(options).attr("disabled", true).selectpicker("refresh");
                }
                
                var accessOptions = "";
                if (access !== null && access.length > 0) {
                    for (var t = 0; t < access.length; t++) {
                        accessOptions += '<option value=' + access[t].Id + '>' + access[t].Name + '</option>';
                    }                                        
                    $("#save-permission").attr("disabled", false);
                    $("#access-selection").html(accessOptions).attr("disabled", false).selectpicker("refresh");
                }
                
                if (entityType != 1 && $.isEmptyObject(scope)) {
                    $("#save-permission").attr("disabled", "disabled");
                }
            }
        });            
    });

    $("#scope-selection").change(function () {
        $("#save-permission").attr("disabled", false);
    });

    $("#add-permission-controller").on("click", "#save-permission", function () {
        $(".success-message, .error-message").html("");
        var accessMode = $("#access-selection").val();
        var entityModel = $("#entity-selection").val();
        var scopeValue = $("#scope-selection").val();
        var entityType = $('option:selected', '#entity-selection').attr("data-entity-type");
        parent.$("#add-permission_wrapper").ejWaitingPopup("show");
        var user = $("#user-id-hidden").val();
        $.ajax({
            type: "POST",
            url: addnewuserpermissionUrl,
            data: { mode: accessMode, entity: entityModel, scopeId: scopeValue, userId: user },
            success: function (result, data) {
                if (result.toLowerCase() == "true") {
                    var gridObj = parent.$("#Grid").ejGrid("instance");
                    gridObj.refreshContent();
                    var selectedEntity = $("#entity-selection option:selected").text().replace("Specific ", "");
                    var message = $("#access-selection option:selected").text() + " [[[permission for]]] " + selectedEntity + " ";
                    var titlemessage = message;
                    if (entityType == 0 || entityType == 2) {
                        message += "— <span class='highlight-name'>" + $("#scope-selection option:selected").text() + "</span> ";
                        titlemessage += "— " + $("#scope-selection option:selected").text() + " ";
                    }
                    message += "[[[has been added successfully.]]]";
                    titlemessage += "[[[has been added successfully.]]]";
                    $(".success-message").attr("title", titlemessage);
                    if (message.length > 110) {
                        message = message.substr(0, 110);
                        message += "...";
                    }
                    $(".success-message").html(message).css("display", "block");
                    $(".success-message").attr({ "data-toggle": "tooltip" });
                    $(".success-message[data-toggle='tooltip']").tooltip('fixTitle');
                    $(".error-message").css("display", "none");
                  } else {
                    $(".error-message").html("[[[Permission Entity already exists]]]").css("display", "block");
                    $(".success-message").css("display", "none");
               }
                parent.$("#add-permission_wrapper").ejWaitingPopup("hide");
            }
        });
    });

    $("#permission-app-container").on("click", ".delete-permission", function () {
        var permId = $(this).attr("data-permission-id");
        $("#delete-permission").attr("permissionId", permId);
        $("#permission-delete-confirmation").ejDialog("open");
    });
})

$(document).on("click", "#delete-permission", function () {
    $("#permission-delete-confirmation-wrapper").ejWaitingPopup("show");
    var permId = $(this).attr("permissionid");
    $.ajax({
        type: "POST",
        url: deleteuserPermissionUrl,
        data: { permissionId: permId },
        success: function (result, data) {
            if (result.toLowerCase() == "true") {
                var user = $("#user-id-hidden").val();
                var gridObj = parent.$("#Grid").ejGrid("instance");
                var currentPage = gridObj.model.pageSettings.currentPage;
                var pageSize = gridObj.model.pageSettings.pageSize;
                var totalRecordsCount = gridObj.model.pageSettings.totalRecordsCount;
                var lastPageRecordCount = gridObj.model.pageSettings.totalRecordsCount % gridObj.model.pageSettings.pageSize;

                if (lastPageRecordCount != 0 && lastPageRecordCount <= 1) {
                    gridObj.model.pageSettings.currentPage = currentPage - 1;
                }
                gridObj.refreshContent()
            }
            $("#permission-delete-confirmation-wrapper").ejWaitingPopup("hide");
            $("#permission-delete-confirmation").ejDialog("close");
        }
    });
});
function fnOnUserPermissionActionBegin() {
    isFirstRequest = true;
}
function rowBound() {
    if (isFirstRequest) {
        isFirstRequest = false;
    }
}
function onPermissionDialogClose() {
    $("#permission-delete-confirmation").ejDialog("close");
}

$(document).keyup(function (e) {
    if (e.keyCode == 27) {
        window.parent.$("#add-permission").ejDialog("close");
    }
});