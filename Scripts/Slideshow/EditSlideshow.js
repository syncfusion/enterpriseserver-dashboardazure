function geteditSlideshowDetail(slideshowId) {
    isSlideshowEdited = true;
    $("#create-presentation-popup").ejDialog("open");
    showWaitingPopup("create-presentation-popup_wrapper");
    $("#slideshow-popup-container").hide();
    $(".slideshow-popup-title").text("[[[Edit Slideshow]]]");
    $.ajax({
        type: "POST",
        url: geteditSlideshowDetailUrl,
        data: { slideshowId: slideshowId},
        success: function (data) {
            categories = data.Categories;
            widgets = data.WidgetList;
            editSlideshowDetail = data.SlideshowDetail;
            var listCategories = "";
            for (var t = 0; t < categories.length; t++) {
                listCategories += '<option value="' + categories[t].Id + '">' + categories[t].Name + '</option>';
            }
            $("#select_category").html("");
            $("#select_category").html('<option value="" selected="selected" class="hide-option" disabled>[[[Select Category]]]</option>' + listCategories).selectpicker("refresh");
            resetSlideshowDialog();
            prepareEditSlideshow();
            $("#slideshow-popup-container").show();
            $("#sortable").css("height", $(".display-dashboard").height() - $("#add-dashboard-widgets").height());
            hideWaitingPopup("create-presentation-popup_wrapper");
            addTitleForCategorySlideshow();
            $(".slide-category-dropdown .btn-group .dropdown-toggle").attr("title", "").attr("data-original-title", "");
        }
    });
}

function prepareEditSlideshow() {
    window.isEdited = false;
    window.editData = {
        ItemId: editSlideshowDetail.SlideshowId,
        SlideshowName: editSlideshowDetail.Name,
        LoopInterval: editSlideshowDetail.LoopInterval,
        slideshowNameChanged: false,
        IsDurationChanged: false,
        IsSlideChanged: false,
        IsSortChanged: false
    }
    $(".slideshow-popup-title").text("[[[Edit Slideshow]]] - " + editSlideshowDetail.Name);
    $("#slideshow-name").val(editSlideshowDetail.Name);
    $('#loop_interval').val(editSlideshowDetail.LoopInterval);
    $('#loop_interval').selectpicker('render');
    $("#create-slideshow").hide();
    $("#edit-slideshow").show();

    for (var i = 0; i < editSlideshowDetail.SlideList.length; i++) {
        var tileContent = "";
        var tile = "";
        var title = "";
        if (editSlideshowDetail.SlideList[i].ItemType == 1) {
            title += "<b>[[[Dashboard]]]</b>: [[[All dashboards]]]<br>";
            tileContent = "<span class='tile-name'><span class='su su-nav-dashboard'></span>[[[All dashboards]]]</span>";
        } else if (editSlideshowDetail.SlideList[i].ItemType == 2) {
            title += "<b>[[[Dashboard]]]</b>: " + editSlideshowDetail.SlideList[i].ItemInfo.Name + "<br>";
            tileContent = "<span class='tile-name'><span class='su su-nav-dashboard'></span>" +
                editSlideshowDetail.SlideList[i].ItemInfo.Name +
                "</span>";
        }

        if (editSlideshowDetail.SlideList[i].ItemType != 8 && editSlideshowDetail.SlideList[i].ItemType != 1) {
            title += "<b>[[[Category]]]</b>: " + editSlideshowDetail.SlideList[i].ItemInfo.CategoryName + "<br>";
            tileContent += "<span class='tile-category'>" +
                editSlideshowDetail.SlideList[i].ItemInfo.CategoryName +
                "</span>";
        } else if (editSlideshowDetail.SlideList[i].ItemType == 1) {
            title += "<b>[[[Category]]]</b>: " + editSlideshowDetail.SlideList[i].ItemInfo.Name + "<br>";
            tileContent += "<span class='tile-category'>" +
                editSlideshowDetail.SlideList[i].ItemInfo.Name +
                "</span>";
        }

        if (editSlideshowDetail.SlideList[i].ItemType == 2) {
            if (!isNullOrWhitespace(editSlideshowDetail.SlideList[i].ItemInfo.TabId)) {
                title += "<b>[[[Tab]]]</b>: " + editSlideshowDetail.SlideList[i].ItemInfo.TabName + "<br>";
                tileContent += "<span class='tile-tab'><span class='tab-label'>[[[Tab]]]: </span>" +
                    editSlideshowDetail.SlideList[i].ItemInfo.TabName +
                    "</span>";
            } else if (editSlideshowDetail.SlideList[i].ItemInfo.IsMultiDashboard) {
                title += "<b>[[[Tab]]]</b>: [[[All tabs]]]<br>";
                tileContent += "<span class='tile-tab'><span class='tab-label'>[[[Tab]]]: </span>[[[All tabs]]]</span>";
            }
            
        }

        if (editSlideshowDetail.SlideList[i].ItemType == 2 && !isNullOrWhitespace(editSlideshowDetail.SlideList[i].ItemInfo.ViewId)) {
            title += "<b>[[[View]]]</b>: " + editSlideshowDetail.SlideList[i].ItemInfo.ViewName + "<br>";
            tileContent += "<span class='tile-view'><span class='view-label'>[[[View]]]: </span>" +
                editSlideshowDetail.SlideList[i].ItemInfo.ViewName  +
                "</span>";
        }

        if (editSlideshowDetail.SlideList[i].ItemType == 8) {
            title = "<b>[[[Widget]]]</b>: " + editSlideshowDetail.SlideList[i].ItemInfo.Name;
            tileContent = "<span class='tile-name'><span class='su su-nav-widgets' data-toggle='tooltip'></span>" +
                editSlideshowDetail.SlideList[i].ItemInfo.Name +
                "</span>";
        }

        if (editSlideshowDetail.SlideList[i].ItemType == 1) {
            tile = "<li class='slide-card col-xs-12 no-padding' data-toggle='tooltip' data-html='true' title='" + title + "' data-category-id='" +
                editSlideshowDetail.SlideList[i].ItemInfo.Id +
                "'data-category-name='" +
                editSlideshowDetail.SlideList[i].ItemInfo.Name +
                "' data-dashboard-id='all' data-dashboard-name='' data-ismultidashboard='false' data-tab-id=''data-tab-name='' data-view-id='' data-view-name='' data-item-type='" +
                editSlideshowDetail.SlideList[i].ItemType +
                "'><span class='card-sort su su-dragger' data-toggle='tooltip'  title='[[[Rearrange]]]'><span class='su-dragger path1'></span></span><span class='card-content' data-toggle='tooltip' data-html='true' title='" +
                title +
                "'>" +
                tileContent +
                "</span><span class='card-remove su su-minus-circle pull-right' data-toggle='tooltip' title='[[[Remove]]]'></span></li>";
        } else if (editSlideshowDetail.SlideList[i].ItemType == 2) {
            tile = "<li class='slide-card col-xs-12 no-padding' data-toggle='tooltip' data-html='true' title='" + title + "' data-category-id='" +
                editSlideshowDetail.SlideList[i].ItemInfo.CategoryId +
                "' data-category-name='" +
                editSlideshowDetail.SlideList[i].ItemInfo.CategoryName +
                "' data-dashboard-id='" +
                editSlideshowDetail.SlideList[i].ItemInfo.Id +
                "'data-dashboard-name='" +
                editSlideshowDetail.SlideList[i].ItemInfo.Name +
                "' data-ismultidashboard='" +
                editSlideshowDetail.SlideList[i].ItemInfo.IsMultiDashboard +
                "'data-tab-id='" +
                editSlideshowDetail.SlideList[i].ItemInfo.TabId +
                "'data-tab-name='" +
                editSlideshowDetail.SlideList[i].ItemInfo.TabName +
                "'data-view-id='" +
                editSlideshowDetail.SlideList[i].ItemInfo.ViewId +
                "'data-view-name='" +
                editSlideshowDetail.SlideList[i].ItemInfo.ViewName +
                "'data-item-type='" +
                editSlideshowDetail.SlideList[i].ItemType +
                "'><span class='card-sort su su-dragger' data-toggle='tooltip' title='[[[Rearrange]]]'><span class='su-dragger path1'></span></span><span class='card-content'>" +
                tileContent +
                "</span><span class='card-remove su su-minus-circle pull-right' data-toggle='tooltip' title='[[[Remove]]]'></span></li>";
        } else if (editSlideshowDetail.SlideList[i].ItemType == 8){
            tile = "<li class='slide-card slide-wiget-card col-xs-12 no-padding' data-toggle='tooltip' data-html='true' title='" + title + "'" +
                "' data-widget-id='" +
                editSlideshowDetail.SlideList[i].ItemInfo.Id +
                "'data-widget-name='" +
                editSlideshowDetail.SlideList[i].ItemInfo.Name +
                "'data-item-type='" +
                editSlideshowDetail.SlideList[i].ItemType +
                "' data-ismultidashboard='false'><span class='card-sort su su-dragger' data-toggle='tooltip' title='[[[Rearrange]]]'><span class='su-dragger path1'></span></span><span class='card-content'>" +
                tileContent +
                "</span><span class='card-remove su su-minus-circle pull-right' data-toggle='tooltip' title='[[[Remove]]]'></span></li>";
        }

        $(".display-dashboard-container").append(tile);
        $("[data-toggle='tooltip']").tooltip();
    }
};

function editSlideshow() {
    if (validateSlideshow()) {
        showWaitingPopup("create-presentation-popup_wrapper");
        var editSlideshowData = getSlideshowValues("edit");
        $.ajax({
            type: "POST",
            url: editSlideShowUrl,
            data: editSlideshowData,
            success: function (data) {
                if (data.StatusCode !== undefined && data.StatusCode === "ItemNameAlreadyExist") {
                    $("#name-validation-message").text(data.StatusMessage);
                } else {
                    if (data.Status) {
                        eDialog = $("#create-presentation-popup").data("ejDialog");
                        eDialog.close();
                        SuccessAlert("[[[Edit Slideshow]]]", "[[[Slideshow]]]" + " — <a target='_blank' href='" + slideshowListingPageUrl + "/" + editSlideshowData.ItemId + "/" + editSlideshowData.slideshowName + "'>" + editSlideshowData.slideshowName + "</a> " + "[[[has been modified successfully]]]", 7000);
                        onSuccessRefreshGrid(0);
                        onCloseMessageBox();
                    } else {
                        WarningAlert("[[[Edit Slideshow]]]", data.Message, 0);
                    }
                }

                hideWaitingPopup("create-presentation-popup_wrapper");
            }
        });
    }
}


function isNullOrWhitespace(value) {
    return (value == null || value == undefined || $.trim(value) == "");
}