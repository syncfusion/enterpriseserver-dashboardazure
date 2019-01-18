var gridObj;
var selectedgroupIdValues = [];
var selectedActivedirectorygroupIdValues = [];

function fnCreateGrid(args) {
    $("#Grid .checkboxRow").ejCheckBox({ "change": checkboxOnChange });
    $("#checkboxHeader").ejCheckBox({ "change": headCheckboxOnChange });
}
function dataBound(args) {
    $("#Grid .checkboxRow").ejCheckBox({ "change": checkboxOnChange });
    $("#checkboxHeader").ejCheckBox({ "change": headCheckboxOnChange });
    this.model.indexes = {}; /* Additional property*/
}
function refreshTemplate(args) {
    $("#Grid .checkboxRow").ejCheckBox({ "change": checkboxOnChange });
    $("#checkboxHeader").ejCheckBox({ "change": headCheckboxOnChange });
}
function actionbegin(args) {
    //Stores the selected index on paging starts.
    if (args.requestType == "paging" || args.requestType == "sorting") {
        //if (this.selectedRowsIndexes.length > 0)
        //    this.model.indexes[args.previousPage] = this.selectedRowsIndexes.slice(0, 20);
    }
}




$(document).ready(function () {

    


    var isFirstRequest = false;


});


function fnOnUserGridLoad(args) {
    args.model.dataSource.adaptor = new ej.UrlAdaptor();
    args.model.enableTouch = false;
}



function fnGroupRecordClick(args) {
    var checkbox = args.row.find('.groupList-grid-chkbx');
    checkbox.prop("checked", !checkbox.prop("checked"));
}

function fnOnGroupGridActionBegin(args) {
    isFirstRequest = true;
    var searchValue = $("#search-groups").val();
    refreshGroupFooterPosition();
    this.model.query._params.push({ key: "searchKey", value: searchValue });
    var filerSettings = [], i;

    if (args.model.filterSettings.filteredColumns.length > 0) {
        for (i = 0; i < args.model.filterSettings.filteredColumns.length; i++) {
            var column = args.model.filterSettings.filteredColumns[i];
            filerSettings.push({ "PropertyName": column.field, "FilterType": column.operator, "FilterKey": column.value });
        }

        this.model.query._params.push({ key: "filterCollection", value: filerSettings });
    }
}

function fnOnGroupGridActionComplete(args) {
    if (args.model.currentViewData.length == 0) {
        rowBound(38);
    }
    $('[data-toggle="tooltip"]').tooltip();
}
function rowBound() {
    if (isFirstRequest) {
        isFirstRequest = false;
        if (location.pathname.toLowerCase() === "/" || location.pathname.split("/")[location.pathname.split("/").length - 1].toLowerCase() == "dashboards") {
            refreshScroller();
        }
    }
}

$(document).on("click", ".search-group", function () {
    var gridObj = $("#Grid").data("ejGrid");
    gridObj.model.pageSettings.currentPage = 1;
    gridObj.refreshContent();
});





function refreshGroupFooterPosition(height) {
    var docHeight = $(window).height();
    var footerHeight = $("#base_footer_Div").height();
    $("#base_footer_Div").css("margin-top", "0");
    var footerTop = 322 + footerHeight;
    if (footerTop < docHeight) {
        $("#base_footer_Div").css("margin-top", (docHeight - footerTop - 40) + "px");
    }
}

$(document).on("click", "#group-synchronization", function () {
    $("body").ejWaitingPopup();
    $("body").ejWaitingPopup("show");
    $.ajax({
        type: "POST",
        url: getAllGroupsUrl,
        data: { reqList: "groups" },
        success: function (result) {
            if (result.isSuccess) {
                SuccessAlert("[[[Group Synchronization]]]", "[[[Groups has been synchronized successfully.]]]", 7000);
                var gridObj = $("#Grid").data("ejGrid");
                gridObj.refreshContent();
                $("#group-count").val(result.count);
                $("#group-count").html(result.count);
            }
            else {
                WarningAlert("[[[Group Synchronization]]]", "[[[Error while synchronizing groups.]]]", 7000);
            }
            $("body").ejWaitingPopup("hide");
        }
    });
});