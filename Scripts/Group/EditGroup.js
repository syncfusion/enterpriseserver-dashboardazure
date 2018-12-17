
function RefreshGroupUsers(groupId, gridObj) {
    gridObj.refreshContent();
}

function fnOnEditGroupActionBegin(args) {
    var searchValue = $("#search-group-users").val();
    this.model.query._params.push({ key: "searchKey", value: searchValue });
    var filerSettings = [], i;
    if (args.model.filterSettings.filteredColumns.length > 0) {
        for (i = 0; i < args.model.filterSettings.filteredColumns.length; i++) {
            var column = args.model.filterSettings.filteredColumns[i];
            filerSettings.push({ 'PropertyName': column.field, 'FilterType': column.operator, 'FilterKey': column.value });
        }

        this.model.query._params.push({ key: "filterCollection", value: filerSettings });
    }
}

function fnOnUserGridActionComplete(args) {
    $('[data-toggle="tooltip"]').tooltip();
}

$(document).on("click", ".search-group-users", function () {
    var gridObj = $("#Grid").data("ejGrid");
    gridObj.model.pageSettings.currentPage = 1;
    gridObj.refreshContent();
});
$(document).on('hide.bs.dropdown', "#people-container", function (e) {
    if ($("#people-container").hasClass("value-changed")) {
        $("#people-container").removeClass("value-changed");
        e.preventDefault();
    }
});
$(document).on("change", "#user-list", function () {
    $("#people-container").addClass("value-changed");
});
