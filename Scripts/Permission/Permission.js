var scope = 0;
var selectText = "";
var selectAll;
var scopeValue, selectedCount;
var selectedList, count;
var allScopes = [];
$(document).ready(function () {
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
    $("#multiple-permission-delete-confirmation").ejDialog({
        width: "400px",
        showOnInit: false,
        showHeader: false,
        allowDraggable: false,
        enableResize: false,
        title: "[[[Delete Permission]]]",
        enableModal: true,
        close: "onDeleteMultiplePermissionDialogClose"
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
        $(".bs-select-all-custom").remove();
        $(".bs-deselect-all-custom").remove();
        $(".noResult").remove();
        var entityType = $('option:selected', this).attr("data-entity-type");
        var entityModId = $(this).val();
        selectedList = "";
        $("#scope-selection").find('option').not(':first').remove();
        
        $.ajax({
            type: "POST",
            url: getItemScopeAccessUrl,
            data: { entityId: entityModId },
            success: function (result, data) {
                var items = JSON.parse(result);
                scope = items[0];
                var access = items[1];
                if ($.isEmptyObject(scope) && $.isEmptyObject(access)) {
                    $("#save-permission").attr("disabled", "disabled")
                }
                else {
                    $("#save-permission").removeAttr("disabled")
                }
                var optionsWithOutHeader = "";
                var options = "<option value='' data-hidden='true'></option>";
                if (scope !== null && scope != undefined && scope.length != 0) {
                    for (var t = 0; t < scope.length; t++) {
                        var previousCategoryId = scope[0].CategoryId;
                        if (scope[t].ItemType == 2) {
                            if (scope[t].CategoryId != previousCategoryId) {
                                options = options + '<optgroup label="' + scope[t - 1].CategoryName + '">' + optionsWithOutHeader + '</optgroup>';
                                previousCategoryId = scope[t].CategoryId;
                                optionsWithOutHeader = "";
                            }

                            if (t == 0) {
                                optionsWithOutHeader += '<option value=' + scope[t].Id + ' selected="selected">' + scope[t].Name + '</option>';
                            }
                            else
                            {
                                optionsWithOutHeader += '<option value=' + scope[t].Id + '>' + scope[t].Name + '</option>';
                            }

                            if (t == (scope.length - 1)) {
                                options = options + '<optgroup label="' + scope[t].CategoryName + '">' + optionsWithOutHeader + '</optgroup>';
                            }
                        }
                        else
                        {
                            if (t == 0) {
                                options += '<option value=' + scope[t].Id + ' selected="selected">' + scope[t].Name + '</option>';
                            }
                            else
                            {
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
                if (scope != null && scope != undefined) {
                    $(".scope-selection .bs-deselect-all").after("<div class='bs-select-all-custom'><span>[[[Select All]]]</span><span class='bs-select-custom-tick glyphicon glyphicon-ok'></span></div>");
                }
                else {
                    $(".scope-selection .bs-deselect-all").after("<span class='noResult'>[[[No Results Found]]]</span>");
                }                            

                selectedCount = $(".scope-selection .drop-up .dropdown-menu .inner").find('li').not(".dropdown-header").not(".hide").not(".divider");
                count = selectedCount;
                
                function addSelected(count, index) {
                 
                        selectedList = $(this).addClass("selected").addClass("item-selected");
                                       
                    return selectedList;
                }

                function removeSelected(count, index) {
                    var unSelectedList = $(this).removeClass("selected").removeClass("item-selected");
                    return unSelectedList;
                }

                $(".selection").on('click', ".bs-select-all-custom", function (e) {
                    count.map(addSelected).get();
                    for (var x = 0; x < scope.length ; x++) {
                        if (selectText == undefined || selectText == "") {
                            selectText = $(".scope-selection .drop-up .dropdown-menu .inner").find('li.selected').not(".hide").not(".divider")[x].textContent;
                        }
                        else {
                            selectText += "," + ($(".scope-selection .drop-up .dropdown-menu .inner").find('li.selected').not(".hide").not(".divider")[x].textContent);
                        }
                    }

                    $(".scope-selection .dropup.btn-group.bootstrap-select").find(".filter-option").html(selectText);
                    $(this).removeClass("bs-select-all-custom").addClass("bs-deselect-all-custom");
                    $($(this).children("span")[0]).text("[[[Clear All]]]");
                    selectAll = true;
                    selectText = "";
                    selectedCount = "";
                    selectedList = "";
                    $("#save-permission").attr("disabled", false);
                    e.stopPropagation();
                });
              
                $(".selection").on('click', ".bs-deselect-all-custom", function (e) {
                    count.map(removeSelected).get();
                    $(".scope-selection .dropup.btn-group.bootstrap-select").find(".filter-option").html("Select scope");
                    $(this).removeClass("bs-deselect-all-custom").addClass("bs-select-all-custom");
                    $($(this).children("span")[0]).text("[[[Select All]]]");
                    $("#save-permission").attr("disabled", true);
                    e.stopPropagation();
                });
               
                $(".scope-selection").on('click', ".bootstrap-select li.item-selected a", function (e) {

                    if ($(this).parent().hasClass("selected")) {
                        $(this).parent().removeClass("selected");
                    }
                    else {
                        $(this).parent().addClass("selected");
                    }

                    var selectedCount = $(".scope-selection .drop-up .dropdown-menu .inner").find('li.selected').not(".hide").not(".divider").length;
                    var allListCount = scope.length;

                    if (selectedCount == allListCount) {
                        $($(".scope-selection div.bs-select-all-custom").children("span")[0]).text("[[[Clear All]]]");
                        $(".scope-selection div.bs-select-all-custom").removeClass("bs-select-all-custom").addClass("bs-deselect-all-custom");
                        $("#save-permission").attr("disabled", false);
                    }
                    else {
                        $($(".scope-selection div.bs-deselect-all-custom").children("span")[0]).text("[[[Select All]]]");
                        $(".scope-selection div.bs-deselect-all-custom").removeClass("bs-deselect-all-custom").addClass("bs-select-all-custom");
                        if (selectedCount != 0) {
                            for (var x = 0; x < selectedCount ; x++) {
                                if (selectText == undefined || selectText == "") {
                                    selectText = $(".scope-selection .drop-up .dropdown-menu .inner").find('li.selected').not(".hide").not(".divider")[x].textContent;
                                }
                                else {
                                    selectText += "," + ($(".scope-selection .drop-up .dropdown-menu .inner").find('li.selected').not(".hide").not(".divider")[x].textContent);
                                }
                            }

                            $(".scope-selection .dropup.btn-group.bootstrap-select").find(".filter-option").html(selectText);
                            selectText = "";
                        }
                        else {
                            $(".scope-selection .dropup.btn-group.bootstrap-select").find(".filter-option").html("Select scope");
                            $("#save-permission").attr("disabled", true);
                        }                       
                      }
                    e.stopPropagation();
                });

                $(".scope-selection").on('click', ".bootstrap-select li a", function (e) {
                    selectAll = false;
                    var selectedCount = $(".scope-selection .drop-up .dropdown-menu .inner").find('li.selected').not(".hide").not(".divider").length;
                    var allListCount = scope.length;
                   
                    if (selectedCount == allListCount) {
                        $($(".scope-selection div.bs-select-all-custom").children("span")[0]).text("[[[Clear All]]]");
                        $(".scope-selection div.bs-select-all-custom").removeClass("bs-select-all-custom").addClass("bs-deselect-all-custom");
                        $("#save-permission").attr("disabled", false);
                    }
                    else {
                        $($(".scope-selection div.bs-deselect-all-custom").children("span")[0]).text("[[[Select All]]]");
                        $(".scope-selection div.bs-deselect-all-custom").removeClass("bs-deselect-all-custom").addClass("bs-select-all-custom");
                        if (selectedCount != 0) {
                            for (var x = 0; x < selectedCount ; x++) {
                                if (selectText == undefined || selectText == "") {
                                    selectText = $(".scope-selection .drop-up .dropdown-menu .inner").find('li.selected').not(".hide").not(".divider")[x].textContent;
                                }
                                else {
                                    selectText += "," + ($(".scope-selection .drop-up .dropdown-menu .inner").find('li.selected').not(".hide").not(".divider")[x].textContent);
                                }
                            }

                            $(".scope-selection .dropup.btn-group.bootstrap-select").find(".filter-option").html(selectText);
                            selectText = "";
                        }
                        else {
                            $(".scope-selection .dropup.btn-group.bootstrap-select").find(".filter-option").html("Select scope");
                            $("#save-permission").attr("disabled", true);
                        }
                    }
                    e.stopPropagation();
                });               
            }
        });
    });

    $(".scope-selection").change(function () {
        $("#save-permission").attr("disabled", false);
    });
   
    $("#add-permission-controller").on("click", "#save-permission", function () {
        window.top.$("#success-alert").css("display", "none");
        parent.$("#warning-alert").css("display", "none");
        var accessMode = $("#access-selection").val();
        var entityModel = $("#entity-selection").val();
        if (selectAll) {
            if(scope != null)
            {
                for (var a = 0; a < scope.length; a++) {
                    allScopes[a] = $("#scope-selection").find("option").eq(a + 2).val();
                }
                scopeValue = allScopes;             
            }
            else {
                scopeValue = $("#scope-selection").val();
            }          
        }
        else {
             scopeValue = $("#scope-selection").val();          
        }

        var selectedScope = $("#scope-selection option:selected").length;
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
                    if (selectedScope == 1) {
                        if (entityType == 0 || entityType == 2) {
                            message += "— <span class='highlight-name'>" + $("#scope-selection option:selected").text() + "</span>  [[[has been added successfully.]]]";
                        }
                    }
                    else {
                        message = "<span class='highlight-name'>[[[All selected permissions has been added successfully]]]</span> ";
                    }

                    if (!$("#addanother").is(":checked")) {
                        parent.$("#add-permission").ejDialog("close");
                    }
                    SuccessAlert("[[[Add Permission]]]", message, 7000);
                }
                else {
                    WarningAlert("[[[Add Permission]]]", "[[[Permission Entity already exists]]]", 7000);
                }
                parent.$("#add-permission_wrapper").ejWaitingPopup("hide");
            }
        });
    });
    $(document).on("click", ".close-div", function () {
        parent.$('#warning-alert').fadeOut();
        parent.$('#success-alert').fadeOut();
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
    isFirstRequest = false;
}
function rowBound() {
    if (isFirstRequest) {
        isFirstRequest = true;
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
function fnPermissionRecordClick(args) {
    var checkbox = args.row.find('.permissionList-grid-chkbx');
    checkbox.prop("checked", !checkbox.prop("checked"));
}
function onDeleteMultiplePermissionDialogClose() {
    $("#multiple-permission-delete-confirmation").ejDialog("close");
}
function fnOnUserPermissionActionComplete(args) {
    $('[data-toggle="tooltip"]').tooltip();
    if (args.model.currentViewData.length == 0) {
        rowBound();
    }
    var userPermissiongrid = $('#Grid').data("ejGrid");
    if (userPermissiongrid.getSelectedRecords().length != 0) {
        $("#delete-multiple-permission").removeClass("hide").addClass("show");
    }
    else {
        $("#delete-multiple-permission").removeClass("show").addClass("hide");
    }
}

function fnPermissionRowSelected(args) {
    var permissiongrid = $('#Grid').data("ejGrid");
    var selectedPermissions = permissiongrid.getSelectedRecords();   
    if (selectedPermissions.length > 0) {
        for (var x = 0; x < selectedPermissions.length; x++) {
            if (selectedPermissions[x].IsUserPermission == true) {
                $('#delete-multiple-permission').removeClass("hide").addClass("show");
            }
            else {
                $('#delete-multiple-permission').removeClass("show").addClass("hide");
            }
        }
    }   
    else {
        $('#delete-multiple-permission').removeClass("show").addClass("hide");
    }
}
$(document).on("click", "#delete-multiple-permission", function () {
    $("#multiple-permission-delete-confirmation").ejDialog("open");
});
$(document).on("click", "#delete-multiple-user-permission", function () {
    $("#multiple-permission-delete-confirmation-wrapper").ejWaitingPopup("show");
    var permissiongrid = $('#Grid').data("ejGrid");
    var selectedPermissions = permissiongrid.getSelectedRecords();
    var permissionList;
    jQuery.each(selectedPermissions, function (index, record) {
        if (permissionList == undefined) {
            permissionList = record.PermissionId;
        }
        else {
            permissionList += "," + record.PermissionId;
        }
    });
    var values = "Permissions=" + permissionList;
    doAjaxPost("POST", deleteMultipleUserPermissionUrl, values, function (data) {
        if (data) {
            parent.messageBox("su-open", "[[[Delete Permission(s)]]]", "[[[Permission(s) has been deleted successfully.]]]", "success", function () {
                var gridObj = parent.$("#Grid").ejGrid("instance");
                var currentPage = gridObj.model.pageSettings.currentPage;
                var pageSize = gridObj.model.pageSettings.pageSize;
                var totalRecordsCount = gridObj.model.pageSettings.totalRecordsCount;
                var lastPageRecordCount = gridObj.model.pageSettings.totalRecordsCount % gridObj.model.pageSettings.pageSize;
                if (lastPageRecordCount != 0 && lastPageRecordCount <= 1) {
                    gridObj.model.pageSettings.currentPage = currentPage - 1;
                }
                parent.onCloseMessageBox();
                gridObj.refreshContent()
            });
            $("#multiple-permission-delete-confirmation-wrapper").ejWaitingPopup("hide");
            $("#multiple-permission-delete-confirmation").ejDialog("close");
        }
        else {
            parent.messageBox("su-open", "[[[Delete permission(s)]]]", "[[[Failed to delete permission(s), please try again later.]]]", "success", function () {
                $("#multiple-permission-delete-confirmation").ejDialog("close");
                parent.onCloseMessageBox();
            });
        }
    }, function () {
        parent.messageBox("su-open", "[[[Delete permission(s)]]]", "[[[Failed to delete permission(s), please try again later.]]]", "error", function () {
            $("#multiple-permission-delete-confirmation").ejDialog("close");
            parent.onCloseMessageBox();
        });
    });
});