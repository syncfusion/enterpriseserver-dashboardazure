var changedValues = [];
var prevDataSourceName;
$(document).ready(function () {
    parent.$("#messageBox").ejWaitingPopup();
    if ($(parent.window).width() > 1400) {
        $("#datasource-update").addClass("iframe-content-height");
    }
    else {
        $("#datasource-update").removeClass("iframe-content-height");
    }
    bindAllGroups();
    window.parent.ShowWaitingProgress("#update-data-source-popup_wrapper", "hide");
    $(document).on("click", ".bootstrap-select ul li.add-new", function () {
        $(this).parent().prev().addClass("input-value");
        parent.$("#update-data-source-popup-iframe").contents().find(".bootstrap-select ul").find(".select-data-source").show();
        parent.$("#update-data-source-popup-iframe").contents().find(".bootstrap-select ul").find(".divider").show();
        parent.$("#datasource-popup").ejDialog("open");
        parent.$("#datasource-popup_wrapper").ejWaitingPopup("show");
    });
     $(document).on("click", "#add-new-datasource", function () {
        parent.$("#update-data-source-popup-iframe").contents().find("select").removeClass("current-select");
        $(this).parent().prev().children().find("select").addClass("current-select");
        parent.$("#update-data-source-popup-iframe").contents().find(".bootstrap-select ul").find(".select-data-source").show();
        parent.$("#update-data-source-popup-iframe").contents().find(".bootstrap-select ul").find(".divider").show();
        parent.$("#datasource-popup").ejDialog("open");
        parent.$("#datasource-popup_wrapper").ejWaitingPopup("show");
    });
     $(document).on("click", ".dropdown-toggle", function (e) {
        parent.$("#update-data-source-popup-iframe").contents().find("select").removeClass("current-select");
        $(".bootstrap-select.open ul .add-new").remove();
        $(this).parent().prev().addClass("current-select");
         parent.$("#update-data-source-popup-iframe").contents().find(".bootstrap-select ul").find(".select-data-source").show();
         parent.$("#update-data-source-popup-iframe").contents().find(".bootstrap-select ul").find(".divider").show();
    });
     $(document).on("keyup", ".update-datasource.bootstrap-select.open input", function () {
        var availableDataSources = [];
         $(".bootstrap-select.open ul .add-new").remove();
        var enteredValue = $(this).val();
        var compareValue = enteredValue.toLowerCase();
        if (enteredValue == "") {
            $(".select-data-source").show();
            $(".divider").show();
        }
        else {
            $(".select-data-source").hide();
            $(".divider").hide();
        }
        $(".bootstrap-select.open").find("ul li").each(function () {

            if ($(this).children("a").children("span.text").text() != "") {
                availableDataSources.push($(this).children("a").children("span.text").text().toLowerCase());
            }

        });
        var isValueEqual = $.inArray(compareValue, availableDataSources);
        if (compareValue != "") {
            if (isValueEqual == -1) {
                $(".bootstrap-select.open ul").prepend('<li class="add-new" data-original-index=""><a class="" tabindex="0"><span class="text">' + enteredValue + ' [[[(New Data Source)]]]</span><span class="glyphicon glyphicon-ok check-mark"></span></li>');
                if ($(".bootstrap-select.open").find("li:not('.hide')").length > 2) {
                    $(".bootstrap-select.open ul .divider").show();
                    if ($(".bootstrap-select.open ul li").hasClass("no-results")) {
                        $(".bootstrap-select.open ul .no-results").hide();
                        $(".bootstrap-select.open ul .divider").hide();
                    }
                }
                else {
                    $(".bootstrap-select.open ul .divider").hide();
                }
            }
            else {
                $(".bootstrap-select.open ul .add-new").remove();
                $(".bootstrap-select.open ul .divider").hide();

            }
        }
    });

    $(document).on("click", "#share-datasource-with-group", function () {
         parent.$("#update-data-source-popup_wrapper").ejWaitingPopup("show");
         var itemId = $(this).attr("data-item-id");
         var datasourceValidation = true;
         var selectContentsGroups = parent.$("#update-data-source-popup-iframe").contents().find("select#group-search");
         var selectedGroup = null;
         var isEmbedDataSource = false;
         if ($("#group-search-container").css("visibility") == "visible") {
             $(selectContentsGroups).each(function (index, value) {
                 selectedGroup = this.value;
             });
         }
         if (changedValues.length != 0) {
             for (var i = 0; i < changedValues.length; i++) {
                 if (changedValues[i].DataSourceId == "00000000-0000-0000-0000-000000000000") {
                     isEmbedDataSource = true;
                 }
             }
             if (changedValues.DataSourceId == undefined) {
                 $(".update-datasource").trigger("change");
                 isEmbedDataSource = false;
             }
             if (isEmbedDataSource && selectedGroup != null) {
                 parent.$("#update-data-source-popup_wrapper").ejWaitingPopup("hide");
                     parent.messageBox("su-update-data-source", "[[[Assigning embedded data source]]]", "[[[Assigning embedded data source to a group will remove the existing shared data source mapping with that group. Are you sure you want to continue?]]]", "error", function () {
                         parent.$("#messageBox").ejWaitingPopup("show");
                         $.ajax({
                             type: "POST",
                             url: updatedatasourceUrl,
                             data: { itemId: itemId, updatedDataSources: changedValues, groupId: selectedGroup },
                             success: function (data) {
                                 if (data.Success) {
                                     parent.$("#messageBox").ejWaitingPopup("hide");
                                     parent.$("#update-data-source-popup_wrapper").ejWaitingPopup("hide");
                                     parent.messageBox("su-update-data-source", "[[[Update Data Source(s)]]]", "[[[Data Source(s) has been Updated successfully.]]]", "success", function () {
                                         var categoryId = parent.window.CategoryId;
                                         var gridObj = parent.$("#items").data("ejGrid");
                                         if (typeof categoryId != "undefined") {
                                             if (categoryId != "") {
                                                 {
                                                     var dashboardScope = parent.angular.element(parent.document.getElementById("server-items-container")).scope();
                                                     var gridName = window.parent.$("#item-grid-container").attr("data-grid-name");
                                                     if (gridName == "dashboards") {
                                                         dashboardScope.refreshCategorySection(categoryId);
                                                     }
                                                     parent.window.CategoryId = "";
                                                 }
                                             }
                                         }
                                         parent.onCloseMessageBox();
                                         changedValues = [];
                                     });
                                 }
                                 else {
                                     parent.$("#messageBox").ejWaitingPopup("hide");
                                     parent.$("#update-data-source-popup_wrapper").ejWaitingPopup("hide");
                                     parent.messageBox("su-update-data-source", "[[[Unable to update Data Source(s)]]]", "[[[Internal server error. Please try again.]]]", "success", function () {
                                         parent.onCloseMessageBox();
                                         changedValues = [];
                                     });
                                 }
                             }
                         });
                     }, function () {
                         parent.$("#messageBox").ejWaitingPopup("show");
                         parent.onCloseMessageBox();
                         for (var i = 0; i < changedValues.length; i++) {
                             if (changedValues[i].DataSourceId == "00000000-0000-0000-0000-000000000000") {
                                 changedValues.splice(i, 1);
                             }
                         }
                         parent.$("#messageBox").ejWaitingPopup("hide");
                     });
             }
             else if (isEmbedDataSource && selectedGroup == null) {
                 parent.$("#update-data-source-popup_wrapper").ejWaitingPopup("hide");
                 parent.messageBox("su-update-data-source", "[[[Assigning embedded data source]]]", "[[[Assigning embedded data source to all users will remove the existing shared data source mapping. Are you sure you want to continue?]]]", "error", function () {
                     parent.$("#messageBox").ejWaitingPopup("show");
                     $.ajax({
                         type: "POST",
                         url: updatedatasourceUrl,
                         data: { itemId: itemId, updatedDataSources: changedValues, groupId: selectedGroup },
                         success: function (data) {
                             if (data.Success) {
                                 parent.$("#messageBox").ejWaitingPopup("hide");
                                 parent.$("#update-data-source-popup_wrapper").ejWaitingPopup("hide");
                                 parent.messageBox("su-update-data-source", "[[[Update Data Source(s)]]]", "[[[Data Source(s) has been Updated successfully.]]]", "success", function () {
                                     var categoryId = parent.window.CategoryId;
                                     var gridObj = parent.$("#items").data("ejGrid");
                                     if (typeof categoryId != "undefined") {
                                         if (categoryId != "") {
                                             {
                                                 var dashboardScope = parent.angular.element(parent.document.getElementById("server-items-container")).scope();
                                                 var gridName = window.parent.$("#item-grid-container").attr("data-grid-name");
                                                 if (gridName == "dashboards") {
                                                     dashboardScope.refreshCategorySection(categoryId);
                                                 }
                                                 parent.window.CategoryId = "";
                                             }
                                         }
                                     }
                                     parent.onCloseMessageBox();
                                     changedValues = [];
                                 });
                             }
                             else {
                                 parent.$("#messageBox").ejWaitingPopup("hide");
                                 parent.$("#update-data-source-popup_wrapper").ejWaitingPopup("hide");
                                 parent.messageBox("su-update-data-source", "[[[Unable to update Data Source(s)]]]", "[[[Internal server error. Please try again.]]]", "success", function () {
                                     parent.onCloseMessageBox();
                                     changedValues = [];
                                 });
                             }
                         }
                     });
                 }, function () {
                     parent.$("#messageBox").ejWaitingPopup("show");
                     parent.onCloseMessageBox();
                     for (var i = 0; i < changedValues.length; i++) {
                         if (changedValues[i].DataSourceId == "00000000-0000-0000-0000-000000000000") {
                             changedValues.splice(i, 1);
                         }
                     }
                     parent.$("#messageBox").ejWaitingPopup("hide");
                 });
             }
                 else {
                     $.ajax({
                         type: "POST",
                         url: updatedatasourceUrl,
                         data: { itemId: itemId, updatedDataSources: changedValues, groupId: selectedGroup },
                         success: function (data) {
                             if (data.Success) {
                                 parent.$("#update-data-source-popup_wrapper").ejWaitingPopup("hide");
                                 parent.messageBox("su-update-data-source", "[[[Update Data Source(s)]]]", "[[[Data Source(s) has been Updated successfully.]]]", "success", function () {
                                     var categoryId = parent.window.CategoryId;
                                     var gridObj = parent.$("#items").data("ejGrid");
                                     if (typeof categoryId != "undefined") {
                                         if (categoryId != "") {
                                             {
                                                 var dashboardScope = parent.angular.element(parent.document.getElementById("server-items-container")).scope();
                                                 var gridName = window.parent.$("#item-grid-container").attr("data-grid-name");
                                                 if (gridName == "dashboards") {
                                                     dashboardScope.refreshCategorySection(categoryId);
                                                 }
                                                 parent.window.CategoryId = "";
                                             }
                                         }
                                     }
                                     parent.onCloseMessageBox();
                                     changedValues = [];
                                 });
                             }
                             else {
                                 parent.$("#update-data-source-popup_wrapper").ejWaitingPopup("hide");
                                 parent.messageBox("su-update-data-source", "[[[Unable to update Data Source(s)]]]", "[[[Internal server error. Please try again.]]]", "success", function () {
                                     parent.onCloseMessageBox();
                                     changedValues = [];
                                 });
                             }
                         }
                     });
             }
             isEmbedDataSource = false;
             }
         else {
             parent.$("#update-data-source-popup_wrapper").ejWaitingPopup("hide");
             parent.messageBox("su-update-data-source", "[[[Unable to update Data Source(s)]]]", "[[[The selected data source is already assigned.]]]", "success", function () {
                 parent.onCloseMessageBox();
                 changedValues = [];
             });
         }                    
     });

     $("a[data-toggle='tab']").on('click', function (e) {
         if ($(this).attr("id") == "assigned-group") {
             loadGroupNames();
        }
    });
});

$(document).on("change", ".update-datasource", function () {
    updateDatasource($(this))
});

function updateDatasource(selectpicker) {
    var dataSourceId = $(selectpicker).val();
    var name = $(selectpicker).attr("name");
    var selectedDataSourceName = $(selectpicker).find('option:selected').html();
    var dropDownElement = $(selectpicker);
    var isReplaced = false;
    if (changedValues.length != 0) {
        for (var i = 0; i < changedValues.length; i++) {
            if ((changedValues[i].Name != undefined) && (name != undefined)) {
                if (changedValues[i].Name.toLowerCase() == name.toLowerCase()) {
                    changedValues[i].DataSourceId = dataSourceId;
                    changedValues[i].Name = name;
                    isReplaced = true;
                }
            }
        }
        if (isReplaced == false) {
            changedValues.push({ DataSourceId: dataSourceId, Name: name });
        }
    }
    else {
        changedValues.push({ DataSourceId: dataSourceId, Name: name });
    }
}

$(document).on("click", "button.dropdown-toggle", function () {
    prevDataSourceName = $(this).attr("title");
 });

$(document).on("change", ".save-mode select", function () {
    var groupId = null;
    if ($(this).val().toLowerCase() == "group") {
        $("#group-search-container").css("visibility", "visible");
        groupId = parent.$("#update-data-source-popup-iframe").contents().find("select#group-search").val();
    } else {
        $("#group-search-container").css("visibility", "hidden");
        groupId = 0;
    }
    getDatasourceForGroup(groupId);
});

$(document).on("change", "#update-data-source-popup #group-search-container select", function () {
    var groupId = $(this).val();
    getDatasourceForGroup(groupId);
});

function getDatasourceForGroup(groupId) {
    $.ajax({
        type: "POST",
        url: getDatasourceUrl,
        data: { itemId: dashboardItemId, groupId: groupId },
        success: function (result) {
            var dataSources = result.data;
            var selectContents = parent.$("#update-data-source-popup-iframe").contents().find("select");
            $(selectContents).each(function (index, value) {
                if ($(this).hasClass("update-datasource")) {
                    $(this).attr("data-original-value", "00000000-0000-0000-0000-000000000000");
                    $(this).val("00000000-0000-0000-0000-000000000000");
                    $(this).selectpicker("refresh");
                    if (dataSources != undefined) {
                        for (var i = 0; i < dataSources.length; i++) {
                            if (this.name == dataSources[i].DataSourceName) {
                                $(this).attr("data-original-value", dataSources[i].DataSourceId);
                                $(this).val(dataSources[i].DataSourceId);
                                $(this).selectpicker("refresh");
                                break;
                            }
                        }
                    }
                }
            });
        }
    });
}

function refreshSelectPicker() {
    $("select.update-datasource").selectpicker("refresh");
    parent.$("#update-data-source-popup-iframe").contents().find("#share-datasource").attr("disabled", false);
    parent.$("#update-data-source-popup-iframe").contents().find(".input-value").removeClass("input-value");
    window.parent.ShowWaitingProgress("#update-data-source-popup_wrapper", "hide");
}

function bindAllGroups() {
    $("#group-search").append(window.groupList);
    $("#group-search").selectpicker("refresh");
}

function getAllStaticData() {
    $.ajax({
        type: "POST",
        url: getActiveandInactiveUserUrl,
        data: {},
        async: false,
        success: function (result) {
            window.groupList = result.data.groups;
            bindAllGroups();
        }
    });

    $(document).on("keyup", ".selectpicker", function () {
        var enteredValue = $(this).val();
        if (enteredValue == "") {
            $(".dropdown-menu li a").show();
        }
        else {
            $(".dropdown-menu li a").hide();
        }
    });
}

$(document).on("click", "#delete-assigned-group", function () {
    var itemId = $(this).find("a").attr("data-item-id");
    var groupId = $(this).find("a").attr("data-group-id");
    var groupName = $(this).parents("tr").find("td:first-child").html();
    var dataSourceId = $(this).find("a").attr("data-datasource-id");
    var dataSourceName = $(this).find("a").attr("data-datasource-name");
    parent.messageBox("su-delete", "[[[Delete group data source assignment]]]", "[[[Are you sure you want to delete the data source assigned to group – ]]]" + "<span style='color: #009aef; font-style: italic'>" + groupName + "</span>[[[ ?]]]", "error", function () {
        parent.showWaitingPopup("messageBox_wrapper");
        $.ajax({
            type: "POST",
            url: deleteAssignedGroupUrl,
            data: { itemId: itemId, datasourceId: dataSourceId, groupId: groupId, dataSourceName: dataSourceName },
            success: function (result, data) {
                if (result.Success == true) {
                    $("#clear-search").click();
                    loadGroupNames();
                    parent.hideWaitingPopup("messageBox_wrapper");
                    parent.onCloseMessageBox();
                    getDatasourceForGroup(groupId);
                }
            }
        });
    });
});

$(document).on("click", "#edit-assigned-group", function () {
    $("#assign-group").trigger("click");
    var groupId = $(this).find("a").attr("data-group-id");
    var groupName = $(this).find("a").attr("data-group-name");
    if (groupId != undefined) {
        if (groupId != 0) {
            $("#group-search-container").css("visibility", "visible");
            $("#group-search-container .dropdown-menu li").each(function () {
                $(this).removeClass("selected active");
                if ($(this).find(".text").html() == groupName) {
                    $(this).addClass("selected active");
                    $("#group-search-container .filter-option").html(groupName);
                }
            });
            $(".save-mode .dropdown-menu li").each(function () {
                if ($(this).find(".text").html() != "Group") {
                    $(this).removeClass("selected");
                    $(".save-mode .filter-option").html("Group");
                }
                else {
                    $(this).addClass("selected");
                }
            });
        }
        else {
            $("#group-search-container").css("visibility", "hidden");
            $(".save-mode .dropdown-menu li").each(function () {
                if ($(this).find(".text").html() != "All Users") {
                    $(this).removeClass("selected");
                    $(".save-mode .filter-option").html("All Users");
                }
                else {
                    $(this).addClass("selected");
                }
            });
        }
        parent.$("#update-data-source-popup-iframe").contents().find("select#group-search").val(groupId);
        getDatasourceForGroup(groupId);
    }
});

function closeUpdateDataSourcePopup() {
    parent.window.IsUpdateDashboard = false;
    parent.$("#update-data-source-popup").ejDialog("close");
    parent.$("#update-data-source-popup-iframe").contents().find("html").text("");
};
