//Dialog Obj
var sharePermissionDlgObj = "";
var sharePermissionDlgWrapperObj = "";
var sharePermisisonDlgHeader = "";
var sharePermissionDlgHeaderItemName = "";

//Container Obj

var sharePermissionConatiner = "";
var accessModeContainer = "";
var dummyContainer = "";
var embedCodeContainer = "";

//Section Obj
var dashboardSettingSectionObj = "";
var sharePermissionPublicSectionObj = "";
var sharePermissionPrivateSectionObj = "";
var sharePermissionUserGroupSectionObj = "";
var manageUserGroupContainer = "";
var manageUserGroupBodySection = "";
var getEmbedLinkSection = "";

//Change indicator banner obj
var changeIndicatorBannerObj = "";

//Label Obj

var shareWithLabelObj = "";

//Get Link

var getLinkInputObj = "";
var getLinkCopyLinkobj = "";
var getEmbedCodeInputObj = "";
var getEmbedCodeCopyBtnobj = "";

//Link Obj
var accessModeChangeLink = "";

//Button Obj
var manageAccessButton = "";
var manageAccessBackButton = "";
var manageAccessSaveBtnObj = "";
var manageAccessCancelBtnObj = "";
var shareDoneBtnObj = "";
var shareBtnObj = "";
var accessModeChngBtnObj = "";
var accessModeCancelBtnObj = "";
var embedCodeDoneBtnObj = "";

//RadioButtonObj
var publicRadioBtnObj = "";
var privateRadioBtnObj = "";

//Boolean Values
var isItemPublic = $("#isdashboardpublic").val() == "true" ? true : false;
var isEntireDOMRendered = false;
var isItemUnlisted = $("#isunlisted").val() == "true" ? true : false;
var ismarkpublic = $("#ispublicsettings").val() == "true" ? true : false;

//Access Mode
var accessModeSelectionInput = "";

//Angular Definition
var sharedUserGroupsPreservedList = [];
var sharedAccessModePreservedList = [];

//Marked for delete
var markForDeleteBtnObj = "";
var removeMarkForDeleteBtnObj = "";

//toggle container obj

var toggleMarkForDeletionObj = "";

//Update Permission Variables
var modifiedItemIndex = [];
var addNewItemPermission = [];
var userMarkedForDeletionList = [];
var groupMarkedForDeletionList = [];

//SharedUserGroupInfoVariables
var showSharedUserGroupContainer = "";
var showSharedUserGroupNameSection = "";
var showSharedUserGroupName = "";
var showSharedUserGroupCountSection = "";
var showSharedUserGroupCount = "";

//Current Item Detail
var currentItemDetail = [];

////////////

var shareItem = angular.module('serverApp');

shareItem.controller('shareItemController', ["$scope", function ($scope) {   
    $scope.currentUserId = window.currentUserId;
    $scope.sharedUserGroups = window.sharedUserGroupList;
    $scope.accessModes = window.accessModeList;
    $scope.showPopover = false;
    $scope.formatAccessModeString = function (key) {
        return key.toString();
    };
    $scope.ImageLink = function (idpRefrenceId) {

        return umsUrl + "/User/Avatar?Username=" + idpRefrenceId + "&ImageSize=64";
    };
    var colorCodes = ['#4FDFDB', '#BDDF4F', '#F3DF4C', '#FC9C61', '#CBA6FF', '#77BDFF'];

    $scope.GetGroupColor = function (targetGroupColor, index) {
        var color = colorCodes[((index + 1) % colorCodes.length) - 1];
        if (targetGroupColor != "") {
            return { 'background-color': '#dfdfdf' };
        } else {
            return { 'background-color': '#dfdfdf' };
        }
    };

    $scope.typeOptions = [{ Key: 2, Value: 'Read' }];

    $scope.parseInt = function (number) {
        return parseInt(number, 10);
    };

    $scope.updateValue = function (newValue, index) {
        $scope.CheckForModification(newValue, index);
    };

    $scope.MarkForDeletion = function (event, newValue, index) {
        $scope.AddItemInUserGroupDeletionList(index);
        //Remove Index Change
        $scope.RemoveFromModified(index);
        var childElems = angular.element(event.currentTarget).parents(".shared-user-group-list-section").children()
        childElems.find('.action-for-delete-container').hide();
        childElems.find('.marked-for-delete-container').show();
        childElems.find(".change-indicator").show();
        $scope.ShowChangeIndicatorBanner();
    };

    $scope.RemoveMarkForDeletion = function (event, newValue, index) {
        $scope.RemoveItemInUserGroupDeletionList(index);
        var childElems = angular.element(event.currentTarget).parents(".shared-user-group-list-section").children()
        childElems.find('.marked-for-delete-container').hide();
        childElems.find('.action-for-delete-container').show();
        childElems.find(".change-indicator").hide();
        $scope.CheckForModification(newValue, index);
    };

    $scope.CheckForModification = function (newValue, index) {
        if (sharedUserGroupsPreservedList[index].PermissionAccess != newValue) {
            $scope.AddToModified(index);
            $("#select_" + index).parents(".shared-user-group-list-section").children().find(".change-indicator").show();
        } else if ((sharedUserGroupsPreservedList[index].PermissionAccess == newValue)) {
            $scope.RemoveFromModified(index);
            $("#select_" + index).parents(".shared-user-group-list-section").children().find(".change-indicator").hide();
        }

        $scope.ShowChangeIndicatorBanner();
    };

    $scope.ShowChangeIndicatorBanner = function () {
        if ($(".change-indicator").is(":visible")) {
            changeIndicatorBannerObj.css("visibility", "visible");
            manageAccessSaveBtnObj.show();
            manageAccessCancelBtnObj.show();
            shareDoneBtnObj.hide();
            disableAutomCompleteControl();
            disableAutocompleteAccessModeSelection()
        } else {
            changeIndicatorBannerObj.css("visibility", "hidden");
            resetPreRequestValues();
            manageAccessSaveBtnObj.hide();
            manageAccessCancelBtnObj.hide();
            shareDoneBtnObj.show();
            enableAutomCompleteControl();
            enableAutocompleteAccessModeSelection();
        }
    };

    $scope.AddItemInUserGroupDeletionList = function (index) {

        //check for user deletion
        if ($scope.IsUserItem(index)) {
            if (jQuery.inArray(sharedUserGroupsPreservedList[index].PermissionId, userMarkedForDeletionList) == -1) {
                userMarkedForDeletionList.push(sharedUserGroupsPreservedList[index].PermissionId);
            }
        }
        else if ($scope.IsGroupItem(index)) {
            //check for group deletion
            if (jQuery.inArray(sharedUserGroupsPreservedList[index].PermissionId, groupMarkedForDeletionList) == -1) {
                groupMarkedForDeletionList.push(sharedUserGroupsPreservedList[index].PermissionId);
            }
        }
    };

    $scope.RemoveItemInUserGroupDeletionList = function (index) {

        //check for user deletion
        if ($scope.IsUserItem(index)) {
            if (jQuery.inArray(sharedUserGroupsPreservedList[index].PermissionId, userMarkedForDeletionList) != -1) {
                userMarkedForDeletionList = jQuery.grep(userMarkedForDeletionList, function (value) {
                    return value != sharedUserGroupsPreservedList[index].PermissionId;
                });
            }
        }
        else if ($scope.IsGroupItem(index)) {
            //check for group deletion
            if (jQuery.inArray(sharedUserGroupsPreservedList[index].PermissionId, groupMarkedForDeletionList) != -1) {
                groupMarkedForDeletionList = jQuery.grep(groupMarkedForDeletionList, function (value) {
                    return value != sharedUserGroupsPreservedList[index].PermissionId;
                });
            }
        }
    };

    $scope.AddToModified = function (index) {
        //Change Happended
        if (jQuery.inArray(index, modifiedItemIndex) == -1) {
            modifiedItemIndex.push(index);
        }
    };

    $scope.RemoveFromModified = function (index) {
        //Remove from Modified
        modifiedItemIndex = jQuery.grep(modifiedItemIndex, function (value) {
            return value != index;
        });
    }

    $scope.IsUserItem = function (index) {
        return sharedUserGroupsPreservedList[index].Email != null && sharedUserGroupsPreservedList[index].IsUserPermission && sharedUserGroupsPreservedList[index].TargetUserId > 0;
    };

    $scope.IsGroupItem = function (index) {
        return sharedUserGroupsPreservedList[index].Email == null && !sharedUserGroupsPreservedList[index].IsUserPermission && sharedUserGroupsPreservedList[index].TargetGroupId > 0;
    };

    $scope.GetManagePermisisionContent = function (index) {
        var content = "You cannot remove access to this ";
        if ($scope.IsUserItem(index)) {
            content = content + "user because this permission is assigned globally - <strong>" + sharedUserGroupsPreservedList[index].PermissionEntityDescription + "</strong>.</br></br>";


            if (isAdmin) {
                var userEditLink = editUserPermissionUrl + "?userId=" + sharedUserGroupsPreservedList[index].TargetUserId;
                return content + "To manage permission for this user please go <a target='_blank' href='" + userEditLink + "'>here</a>."
            } else {
                return content + "To manage access for this user, please contact your System Administrator.";
            }

        } else {
            content = content + "group because this permission is assigned globally - <strong>" + sharedUserGroupsPreservedList[index].PermissionEntityDescription + "</strong>.</br></br>";

            if (isAdmin) {
                var groupEditLink = editGroupPermissionUrl + "?groupId=" + sharedUserGroupsPreservedList[index].TargetGroupId;
                return content + "To manage permission for this group please go <a target='_blank' href='" + groupEditLink + "'>here</a>."
            } else {
                return content + "To manage access for this group, please contact your System Administrator.";
            }
        }
    }
}]);

$(function () {
    //Dialog Obj
    sharePermissionDlgObj = $("#share-permission-popup");
    sharePermisisonDlgHeader = $("#share-permission-dialog-header");
    sharePermissionDlgHeaderItemName = $("#item-name-header");

    //Container Obj

    sharePermissionConatiner = $("#share-permission-container");
    accessModeContainer = $("#access-mode-container");
    dummyContainer = $("#dummy-container");
    embedCodeContainer = $("#get-embed-code-container");

    //Section Obj
    dashboardSettingSectionObj = $(".dashboard-setting-section");
    sharePermissionPublicSectionObj = $(".share-permission-public-section");
    sharePermissionPrivateSectionObj = $(".share-permission-private-section");
    sharePermissionUnlistedSectionObj = $(".share-permission-unlisted-section");
    sharePermissionUserGroupSectionObj = $("#assign-user-group-container");
    manageUserGroupContainer = $("#manage-user-group-container");
    manageUserGroupBodySection = $(".manage-user-group-body-section");
    getEmbedLinkSection = $(".get-item-embed-link-section");

    //Change indicator banner obj

    changeIndicatorBannerObj = $(".changes-indicator-banner");

    //Label Obj
    shareWithLabelObj = $(".share-with-label");

    //Get Link
    getLinkInputObj = $("#item-url");
    getLinkCopyLinkobj = $("#item-url-copy");
    getEmbedCodeInputObj = $("#embed-code");
    getEmbedCodeCopyBtnobj = $("#copy-embed-code");

    //Link Obj
    accessModeChangeLink = $("#access-mode-change-link");

    //Button Obj
    manageAccessButton = $("#manage-access-button");
    manageAccessBackButton = $("#manage-access-back-button");
    manageAccessSaveBtnObj = $("#manage-access-save-button");
    manageAccessCancelBtnObj = $("#manage-access-cancel-button");
    shareDoneBtnObj = $("#share-done-popup-button");
    shareBtnObj = $("#share-permission-button");
    accessModeChngBtnObj = $("#access-mode-change-button");
    accessModeChangePublicSectionObj = $("#access-mode-change-public-section");
    accessModeCancelBtnObj = $("#access-mode-cancel-button");
    embedCodeDoneBtnObj = $("#copy-embed-code-done-button");

    //RadioButtonObj
    publicRadioBtnObj = $("#public-access-mode");
    privateRadioBtnObj = $("#private-access-mode");
    unlistedRadioBtnObj = $("#unlisted-access-mode");

    //Access Mode
    accessModeSelectionInput = $("#access-mode-selection");

    //Marked for delete
    markForDeleteBtnObj = $(".mark-for-deletion-icon");
    removeMarkForDeleteBtnObj = $(".remove-mark-for-deletion-icon");

    //SharedUserGroupInfoVariables
    showSharedUserGroupContainer = $("#show-shared-user-group-container");
    showSharedUserGroupNameSection = $(".shared-user-group-name-section");
    showSharedUserGroupName = $(".shared-user-group-name");
    showSharedUserGroupCountSection = $(".shared-user-group-count-section");
    showSharedUserGroupCount = $(".shared-user-group-count");

    //toggle container obj

    toggleMarkForDeletionObj = $('.action-for-delete-container, .marked-for-delete-container');

    $("#permission-popup").ejDialog({
        showOnInit: false,
        allowDraggable: true,
        enableResize: false,
        width: "900px",
        title: "",
        showHeader: false,
        enableModal: true,
        close: "DialogBoxClose",
        closeOnEscape: true
    });

    var permissionWaitingPopupTemplateId = createLoader("permission-popup_wrapper");
    $("#permission-popup_wrapper").ejWaitingPopup({ template: $("#" + permissionWaitingPopupTemplateId) });

    ////Share Permission Dialog
    sharePermissionDlgObj.ejDialog({
        width: '560px',
        showOnInit: false,
        allowDraggable: false,
        enableResize: false,
        showHeader: false,
        enableModal: true,
        closeOnEscape: false,
        close: "onSharePermissionPopupClose",
        open: "onSharePermissionPopupOpen",
        closeOnEscape: true
    });
    sharePermissionDlgWrapperObj = $("#share-permission-popup_wrapper");
    var sharePermissionLinkWaitingPopupTemplateId = createLoader("share-permission-popup_wrapper");
    sharePermissionDlgWrapperObj.ejWaitingPopup({ template: $("#" + sharePermissionLinkWaitingPopupTemplateId) });

    $("#share-close-popup, #share-done-popup-button").on("click", function () {
        sharePermissionDlgObj.ejDialog("close");
    });

    accessModeCancelBtnObj.on("click", function () {
        showSharePermissionContainer();
    });

    manageAccessButton.on("click", function () {       
        showManageAccessContainer();
        sharePermissionDlgObj.ejDialog({
            width: '560px'
        });
    });

    manageAccessBackButton.on("click", function () {
        showSharePermissionContainerWithRefresh();
        sharePermissionDlgObj.ejDialog({
            width: '560px'
        });
    });

    manageAccessSaveBtnObj.on("click", function () {
        $('[data-toggle="popover"]').popover('hide');
        sharePermissionDlgWrapperObj.ejWaitingPopup("show");
        prepareRequestForAddItemPermission();
        updateBulkItemPermission();
    });

    manageAccessCancelBtnObj.on("click", function () {
        $('[data-toggle="popover"]').popover('hide');
        resetToActualScope();
        enableAutomCompleteControl();
        enableAutocompleteAccessModeSelection();
    });

    //Get Link

    getLinkCopyLinkobj.on("click", function (e) {
        getLinkInputObj.select();
        if (/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)) {
            getLinkCopyLinkobj.attr("data-original-title", "");
        }
        else {
            document.execCommand('copy');
            getLinkCopyLinkobj.attr("data-original-title", "[[[Copied]]]");
            getLinkCopyLinkobj.tooltip("hide").attr("data-original-title", "[[[Copied]]]").tooltip("fixTitle").tooltip("show");
            setTimeout(function () { getLinkCopyLinkobj.attr("data-original-title", "[[[Click to copy]]]"); getLinkCopyLinkobj.tooltip(); }, 3000);
        }
    });

    getLinkCopyLinkobj.removeClass("focusdiv");
    getLinkInputObj.on("focusin", function () {
        getLinkCopyLinkobj.addClass("focusdiv");
    });
    getLinkInputObj.on("focusout", function () {
        getLinkCopyLinkobj.removeClass("focusdiv");
    });

    //Access Mode

    $("input[type=radio][name=access-mode]").on("change", function () {
        isItemPublic = $("#isdashboardpublic").val() == "true" ? true : false;
        isItemUnlisted = $("#isunlisted").val() == "true" ? true : false;
        if ((isItemPublic && privateRadioBtnObj.prop('checked')) || (!isItemPublic && publicRadioBtnObj.prop('checked') && ismarkpublic) || (isItemUnlisted && privateRadioBtnObj.prop('checked')) || (!isItemUnlisted && unlistedRadioBtnObj.prop('checked'))) {
            accessModeChngBtnObj.removeAttr('disabled');
        } else {
            accessModeChngBtnObj.attr('disabled', true);
        }
    });

    $(document).on("click", "#access-mode-change-button", function (e) {
        var ispreviouslyPublic = false;
        var ispreviouslyUnlist = false;
        var itemId = $(this).attr("data-item-id");
        var itemName = $(this).attr("data-name");
        var itemTypeId = $(this).attr("data-itemtype");
        var requestUrl = "";
        if (isItemPublic && privateRadioBtnObj.prop('checked')) {
            requestUrl = removeItemPublicUrl;
            $("#isunlisted").val("false");
            $("#isdashboardpublic").val("false");
        } else if (isItemUnlisted && privateRadioBtnObj.prop('checked')) {
            requestUrl = removeItemUnlistedUrl;
            $("#isunlisted").val("false");
            $("#isdashboardpublic").val("false");
        }
        else if (!isItemPublic && publicRadioBtnObj.prop('checked')) {
            ispreviouslyUnlist = isItemUnlisted;
            requestUrl = makeItemPublicUrl;
            $("#isunlisted").val("false");
            $("#isdashboardpublic").val("true");
            $("#ispublicsettings").val("true");
        } else if (!isItemUnlisted && unlistedRadioBtnObj.prop('checked')) {
            ispreviouslyPublic = isItemPublic;
            requestUrl = makeItemUnlistedUrl;
            $("#isunlisted").val("true");
            $("#isdashboardpublic").val("false");
        }

        $.ajax({
            type: "POST",
            url: requestUrl,
            data: { itemId: itemId, itemTypeId: itemTypeId, itemName: itemName, isPublic: ispreviouslyPublic, isUnlisted: ispreviouslyUnlist },
            success: function (data) {
                if (data.validation && data.result) {
                    if (typeof (ResetGrid) == 'function') {
                        ResetGrid();
                    }
                    if (typeof (currentItemDetail) != "undefined" && typeof (currentItemDetail.IsPublic) != "undefined") {
                        currentItemDetail.IsPublic = !currentItemDetail.IsPublic;
                    }
                } else {
                    WarningAlert("", "[[[Internal server error. Please try again.]]]", 7000);
                }
            },
            error: function () {
                WarningAlert("", "[[[Internal server error. Please try again.]]]", 7000);
            }
        });

        if (isItemPublic && privateRadioBtnObj.prop('checked')) {
            showSharePermissionContainer();
            showPrivateContent();
            isItemPublic = false;
        }
        else if (!isItemPublic && publicRadioBtnObj.prop('checked')) {
            showSharePermissionContainer();
            showPublicContent();
            isItemPublic = true;
        }
        else if (isItemUnlisted && privateRadioBtnObj.prop('checked')) {
            showSharePermissionContainer();
            showPrivateContent();
            isItemPublic = false;
        } else if (!isItemUnlisted && unlistedRadioBtnObj.prop('checked')) {
            showSharePermissionContainer();
            showUnlistedContent();
            isItemPublic = false;
        } 
        $("#item-url").val(getLinkURL());
    });

    $(document).on('shown.bs.dropdown', '.user-group-scroll-content .change-access-mode-select', function () {
        $(".tooltip").hide();
        if ($(this).find(".change-access-mode-selection").length > 0) {
            var parentElement = manageUserGroupBodySection;
            var availableTopHeight = $(this).offset().top + $(this).outerHeight(true) / 2 - parentElement.offset().top;
            var availableBottomHeight = parentElement.height() - ($(this).offset().top - parentElement.offset().top + $(this).outerHeight(true) / 2);
            var dropDownHeight = $(this).find(".change-access-mode-selection .dropdown-menu").outerHeight(true);
            if (availableBottomHeight <= dropDownHeight && availableTopHeight >= dropDownHeight) {
                $(this).find(".change-access-mode-selection").removeClass("dropdown").addClass("dropup");
            } else {
                refreshUserGroupScroll();
            }
        }
    });

    $.views.helpers({
        getUserGroupLogo: function (Type) {

            if (Type == 'user') {
                return "<img src='' alt='Profile Picture' id='' onerror='' >";
            } else {
                return "<div class='group-logo' style=''> <i class='su su-group-1'></i></div >";
            }
        }

    });

    $('body').on('click', function (e) {
        if ($(e.target).data('toggle') !== 'popover'
            && $(e.target).parents('[data-toggle="popover"]').length === 0
            && $(e.target).parents('.popover.in').length === 0) {
            $('[data-toggle="popover"]').popover('hide');
        } else if ($(e.target).data('toggle') == 'popover') {
            $(".access-info-icon").not(e.target).popover('hide');
        }
    });

    getEmbedCodeInputObj.on("click", function (e) {
        getEmbedCodeInputObj.select();
    });

    getEmbedCodeCopyBtnobj.on("click", function (e) {
        getEmbedCodeInputObj.select();
        document.execCommand('copy');
        var embedSuccess = $(".embed-copy-success");
        embedSuccess.show();
        setTimeout(function () {
            embedSuccess.fadeOut(3000);
        }, 3000);
    });

    embedCodeDoneBtnObj.on("click", function () {
        sharePermissionDlgObj.ejDialog("close");
    });

    $(".embed-configuration [type='checkbox']").on("change", function (e) {
        $("#embed-code").val(generateEmbedCode(currentItemDetail));
    });
});

function sharePermission(itemId) {
    $("#permission-popup iframe").attr("src", permissionIframeUrl + "?itemId=" + itemId);
    $("#permission-popup").ejDialog("open");    
    ShowWaitingProgress("#permission-popup_wrapper", "show");
}

function shareDashboardPermission(itemDetail) {
    currentItemDetail = itemDetail;
    sharePermissionDlgHeaderItemName.text(currentItemDetail.Name);
    sharePermissionDlgObj.show();
    $("#share-permission-popup_wrapper, #user-group-search-input_suggestion").addClass("custom-bootstrap-styles");
    sharePermissionDlgObj.ejDialog("open");
    isItemUnlisted = $("#isunlisted").val() == "true" ? true : false;
    //Show Hide Public Private section
    if (itemDetail.CreatedById == currentUserId) {
        if ($("#isdashboardpublic").val() == "true") {
            showPublicContent();
            if ($("#ispublicsettings").val() == "true") {
                dashboardSettingSectionObj.hide();
            }
        } else if (isItemUnlisted) {
            showUnlistedContent();
        } else {
            showPrivateContent();
        }
        addAttributeValueToBtnEle(itemDetail);
    } else {
        hidePublicPrivateContent();
    }

    //Show Hide Share Permsission Section
    if (itemDetail.CreatedById == currentUserId || isAdmin) {
        showShareUserGroupPermissionSection();
        getShareItemPermission(itemDetail.Id);
        addAttributeValueToBtnEle(itemDetail);
        addAttributeValueToAutoCompleteEle(itemDetail);
    } else {
        hideShareUserGroupPermissionSection();
    }

    if (/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)) {
        $("#item-url-copy").hide();
        $("#item-url").css({ width: "100%", borderRadius: "4px" });
        $("#item-url-copy").attr("data-original-title", "");
    }
    else {
        $("#item-url-copy").tooltip({
            animation: false
        });
    }
    $("#item-url").val(getLinkURL());
}

function onSharePermissionPopupOpen(args) {
    $('[data-toggle="popover"]').popover('hide');
    sharePermissionDlgWrapperObj.ejWaitingPopup("refresh");
    showSharePermissionContainer();
}

function onSharePermissionPopupClose(args) {
    currentItemDetail = [];
    $(".embed-configuration [type='checkbox']").removeAttr("checked");
    $('[data-toggle="popover"]').popover('hide');
    showSharePermissionContainer();
    sharePermissionDlgWrapperObj.ejWaitingPopup("refresh");
    sharePermissionDlgWrapperObj.ejWaitingPopup("hide");
    refreshDialogBoxPosition();
}

function showAccessModeContainer() {
    sharePermisisonDlgHeader.text("[[[Access mode]]]");
    accessModeContainer.show();
    accessModeChngBtnObj.show();
    accessModeCancelBtnObj.show();
    sharePermissionConatiner.hide();
    manageAccessButton.hide();
    shareBtnObj.hide();
    shareDoneBtnObj.hide();
    refreshDialogBoxPosition();
}
function showManageAccessContainer() {
    hidePublicPrivateContent();
    showSharedUserGroupContainer.hide();  
    shareBtnObj.text("[[[Add]]]");
    sharePermisisonDlgHeader.text("[[[Manage Access]]]");
    dummyContainer.hide();
    if (autoCompleteInstance.getValue() == "") {
        shareBtnObj.hide();
    }
    manageAccessBackButton.show();
    manageUserGroupContainer.show();
    manageAccessButton.hide();
    refreshUserGroupScroll();
    refreshDialogBoxPosition();
}

function hideManageAccessContainer() {
    manageUserGroupContainer.hide();
    manageAccessSaveBtnObj.hide();
    manageAccessCancelBtnObj.hide();
    embedCodeDoneBtnObj.hide();
    embedCodeContainer.hide();
    changeIndicatorBannerObj.css("visibility", "hidden");
    resetPreRequestValues();
}

function showSharePermissionContainer() {
    sharePermisisonDlgHeader.text("[[[Share with others]]]");
    dummyContainer.show();
    //shareWithLabelObj.text(window.Server.App.LocalizationContent.ShareInviteLabel);
    shareBtnObj.text("[[[Share]]]");
    enableAutocompleteAccessModeSelectionWithoutReset();
    refreshAutoComplete();
    sharePermissionConatiner.show();
    manageAccessButton.show();
    shareDoneBtnObj.show();
    manageAccessBackButton.hide();
    hideManageAccessContainer();
    accessModeContainer.hide();
    accessModeChngBtnObj.hide();
    accessModeCancelBtnObj.hide();
    displaySharedUserGroupInfo();
    if (typeof (currentItemDetail.Extension) != "undefined" && currentItemDetail.Extension.toLowerCase() == ".sydj") {
        getEmbedLinkSection.show();
    } else {
        getEmbedLinkSection.hide();
    }

    embedCodeDoneBtnObj.hide();
    sharePermissionDlgHeaderItemName.show();
    sharePermisisonDlgHeader.css("line-height", "")
    refreshDialogBoxPosition();
}

function showSharePermissionContainerWithRefresh() {
    $('[data-toggle="popover"]').popover('hide');
    resetToActualScope();
    hideManageAccessContainer();
    enableAutocompleteAccessModeSelectionWithoutReset();
    sharePermisisonDlgHeader.text("[[[Share with others]]]");
    displaySharedUserGroupInfo();
    dummyContainer.show();
    shareBtnObj.text("[[[Share]]]");
    showPublicPrivateContent();
    sharePermissionConatiner.show();
    manageAccessButton.show();
    if (autoCompleteInstance.getValue() != "") {
        shareBtnObj.show();
        manageAccessCancelBtnObj.show();
        shareDoneBtnObj.hide();
    } else {
        shareDoneBtnObj.show();
    }

    manageAccessBackButton.hide();
    accessModeContainer.hide();
    accessModeChngBtnObj.hide();
    accessModeCancelBtnObj.hide();
    refreshDialogBoxPosition();
}

function showPublicContent() {
    sharePermissionPublicSectionObj.show();
    sharePermissionPrivateSectionObj.hide();
    sharePermissionUnlistedSectionObj.hide();
    isItemPublic = true;
}

function showPrivateContent() {
    sharePermissionPublicSectionObj.hide();
    sharePermissionPrivateSectionObj.show();
    sharePermissionUnlistedSectionObj.hide();
    isItemPublic = false;
}

function showUnlistedContent() {
    sharePermissionPublicSectionObj.hide();
    sharePermissionPrivateSectionObj.hide();
    sharePermissionUnlistedSectionObj.show();
    isItemPublic = false;
}

function showPublicOrPrivateContent() {
    if (isItemPublic) {
        showPublicContent();
    } else if (isItemUnlisted) {
        showUnlistedContent();
    } else {
        showPrivateContent();
    }
}

function showShareUserGroupPermissionSection() {
    sharePermissionUserGroupSectionObj.show();
}

function hideShareUserGroupPermissionSection() {
    sharePermissionUserGroupSectionObj.hide();
}

function hidePublicPrivateContent() {
    sharePermissionPublicSectionObj.hide();
    sharePermissionPrivateSectionObj.hide();
    sharePermissionUnlistedSectionObj.hide();
    sharePermissionDashboardSettingSectionObj.hide();
}

function showPublicPrivateContent() {
    if (currentItemDetail.CreatedById == currentUserId) {
        if (isItemPublic) {
            sharePermissionPublicSectionObj.show();
        } else if (isItemUnlisted) {
            sharePermissionUnlistedSectionObj.show();
        } else {
            sharePermissionPrivateSectionObj.show();
        }
    } else {
        hidePublicPrivateContent();
    }
}

function changeAccessMode() {  
    sharePermissionDlgWrapperObj.ejWaitingPopup("show");
    showAccessModeContainer();
    if ($("#ispublicsettings").val() == "true") {
        $(".public-content,.public-icon-section").css('opacity', '1');       
        dashboardSettingSectionObj.hide();   
        publicRadioBtnObj.prop("disabled", false);
    }
    else {
        $(".public-content,.public-icon-section").css('opacity', '0.5');      
        dashboardSettingSectionObj.show();        
        publicRadioBtnObj.prop("disabled", true);
    }
   if ($("#isunlisted").val() == "true") {
        unlistedRadioBtnObj.prop("checked", true);
    } else if ($("#isdashboardpublic").val() == "true") {
        publicRadioBtnObj.prop("disabled", false);
        publicRadioBtnObj.prop("checked", true);
    }else {
        privateRadioBtnObj.prop("checked", true);
    }

    accessModeChngBtnObj.attr('disabled', true);
    sharePermissionDlgWrapperObj.ejWaitingPopup("hide");
}

function getEmbedCode() {
    $("#embed-code").val(generateEmbedCode(currentItemDetail));
    embedCodeContainer.show();
    sharePermisisonDlgHeader.text("[[[Embed Code]]]");
    if (/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)) {
        getEmbedCodeCopyBtnobj.hide();
    }

    if (currentItemDetail.IsPublic) {
        $(".private-embed-code-note").hide();
        $(".public-embed-code-note").show();
    } else {
        $(".private-embed-code-note").show();
        $(".public-embed-code-note").hide();
    }

    embedCodeDoneBtnObj.show()
    manageAccessBackButton.hide();
    manageAccessSaveBtnObj.hide();
    manageAccessCancelBtnObj.hide();
    sharePermissionDlgHeaderItemName.hide();
    sharePermisisonDlgHeader.css("line-height", "32px")
    sharePermissionConatiner.hide();
    manageAccessButton.hide();
    shareBtnObj.hide();
    shareDoneBtnObj.hide();
    refreshDialogBoxPosition();
}

function addAttributeValueToBtnEle(itemDetail) {
    accessModeChngBtnObj.attr('data-item-id', itemDetail.Id);
    accessModeChngBtnObj.attr('data-name', itemDetail.Name);
    accessModeChngBtnObj.attr('data-itemtype', itemDetail.ItemType);
    shareBtnObj.attr('data-item-id', itemDetail.Id);
    shareBtnObj.attr('data-name', itemDetail.Name);
    shareBtnObj.attr('data-itemtype', itemDetail.ItemType);
}

function addAttributeValueToAutoCompleteEle(itemDetail) {
    autoCompleteHiddenEle.attr('data-item-id', itemDetail.Id);
    autoCompleteHiddenEle.attr('data-itemtype', itemDetail.ItemType);
}

function getShareItemPermission(itemId) {
    sharePermissionDlgWrapperObj.ejWaitingPopup("show");
    $.ajax({
        type: "get",
        url: getShareItemPermissionUrl,
        data: {
            itemId: itemId
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result.status) {

                var scope = angular.element(manageUserGroupBodySection).scope();
                scope.$apply(function () {
                    angular.copy(result.SharedUserGroupList, sharedUserGroupsPreservedList);
                    scope.sharedUserGroups = result.SharedUserGroupList;
                });

                scope.$apply(function () {
                    angular.copy(result.AccessModeOptionList, sharedAccessModePreservedList);
                    scope.accessModes = result.AccessModeOptionList;
                });
                $(".change-access-mode-selection").selectpicker("refresh");
                $(".change-access-mode-selection .selectpicker").removeAttr("title");
                //AutoComplete AccessMode
                accessModeSelectionInput.html("");
                accessModeSelectionInput.append(result.AccessModeList);
                accessModeSelectionInput.selectpicker("refresh");
                refreshUserGroupScroll();
                sharePermissionDlgWrapperObj.ejWaitingPopup("hide");
                displaySharedUserGroupInfo();
                isEntireDOMRendered = true;
                $('[data-toggle="tooltip"]').tooltip();
                $('[data-toggle="popover"]').popover();
            }
        },
        error: function () {
            WarningAlert("", "[[[Internal server error. Please try again.]]]", 7000);
            sharePermissionDlgWrapperObj.ejWaitingPopup("hide");
        }
    });
}

function displaySharedUserGroupInfo() {
    var scope = angular.element(manageUserGroupBodySection).scope();
    var sharedUserGroupInfo = scope.sharedUserGroups;

    if (sharedUserGroupInfo.length > 0) {
        var elem = "";
        $.each(sharedUserGroupInfo, function (i, value) {
            var divElem = "<div class='shared-user-group-name'><span class='shared-user-group-name-label'>";
            if (i < 3) {

                if (value.TargetUserId > 0) {
                    divElem += value.DisplayName + "</span>"
                } else {
                    divElem += value.TargetGroupName + "</span>"
                }


                if (i != sharedUserGroupInfo.length - 1) {
                    divElem += "<span class='shared-user-group-name-comma'>,</span> </div>";
                } else {
                    divElem += "</div>";
                }

                elem += divElem;
            }
        });

        showSharedUserGroupNameSection.html(elem);
        if (!manageUserGroupContainer.is(":visible")) {
            showSharedUserGroupContainer.show();
        }
    } else {
        showSharedUserGroupContainer.hide();
    }

    if (sharedUserGroupInfo.length > 3) {
        var count = sharedUserGroupInfo.length - 3;
        showSharedUserGroupCount.text(count);
        showSharedUserGroupCountSection.show();
    } else {
        showSharedUserGroupCountSection.hide();
    }

}

function saveItemPermission() {
    sharePermissionDlgWrapperObj.ejWaitingPopup("show");
    splitUserGroupList();
    var userlist = userEmailList;
    var grouplist = groupIdList;
    var accessMode = accessModeSelectionInput.val();
    var itemId = shareBtnObj.attr("data-item-id");
    var itemType = shareBtnObj.attr("data-itemtype");
    $.ajax({
        type: "POST",
        url: sharepermissionUrl,
        data: { permissionList: JSON.stringify({ mode: accessMode, itemType: itemType, UserList: userlist, GroupList: grouplist }), itemId: itemId },
        success: function (result, data) {
            if (result.toLowerCase() == "true") {
                getShareItemPermission(itemId);
                refreshAutoComplete();
                refreshAutocompleteAccessModeSelection();
            } else {
                WarningAlert("", "[[[Internal server error. Please try again.]]]", 7000);
            }
        },
        error: function () {
            WarningAlert("", "[[[Internal server error. Please try again.]]]", 7000);
        }
    });
}

function updateBulkItemPermission() {
    var itemId = shareBtnObj.attr("data-item-id");
    $.ajax({
        type: "POST",
        url: updateBulkItemPermissionUrl,
        data: { permissionList: addNewItemPermission, userMarkedForDeletionList: userMarkedForDeletionList, groupMarkedForDeletionList: groupMarkedForDeletionList, itemId: itemId },
        success: function (result, data) {
            if (result.toLowerCase() == "true") {
                getShareItemPermission(itemId);
                changeIndicatorBannerObj.css("visibility", "hidden");
                resetPreRequestValues();
                manageAccessSaveBtnObj.hide();
                manageAccessCancelBtnObj.hide();
                shareDoneBtnObj.show();
                enableAutomCompleteControl();
                enableAutocompleteAccessModeSelection();
            } else {
                WarningAlert("", "[[[Internal server error. Please try again.]]]", 7000);
            }
        },
        error: function () {
            WarningAlert("", "[[[Internal server error. Please try again.]]]", 7000);
        }
    });
}

function refreshDialogBoxPosition() {
    if (isEntireDOMRendered) {
        sharePermissionDlgObj.ejDialog({ width: 529 });
        sharePermissionDlgObj.ejDialog({ width: 530 });
    }

    sharePermissionDlgWrapperObj.ejWaitingPopup("refresh");
    sharePermissionDlgObj.ejDialog("refresh");
}

function prepareRequestForAddItemPermission() {
    if (modifiedItemIndex.length > 0) {
        var scope = angular.element(manageUserGroupBodySection).scope();
        var possibleAccessModes = scope.accessModes;
        var lastModifiedValue = scope.sharedUserGroups;
        var itemType = shareBtnObj.attr("data-itemtype");

        $.each(possibleAccessModes, function (x, value) {
            var accessMode = value.Key;
            var userList = [];
            var groupList = [];

            $.each(modifiedItemIndex, function (i, item) {
                if (lastModifiedValue[item].PermissionAccess != sharedUserGroupsPreservedList[item].PermissionAccess && lastModifiedValue[item].PermissionAccess == value.Key) {
                    if (scope.IsUserItem(item)) {
                        if (jQuery.inArray(lastModifiedValue[item].Email, userList) == -1) {
                            userList.push(lastModifiedValue[item].Email);
                        }
                    }
                    else if (scope.IsGroupItem(item)) {
                        if (jQuery.inArray(lastModifiedValue[item].TargetGroupId, groupList) == -1) {
                            groupList.push(lastModifiedValue[item].TargetGroupId);
                        }
                    }
                }
            });

            if (userList.length > 0 || groupList.length > 0) {
                addNewItemPermission.push(JSON.stringify({ mode: accessMode, itemType: itemType, UserList: userList, GroupList: groupList }));
            }
        });

        //Mark for deletion
        $.each(modifiedItemIndex, function (i, value) {
            if (lastModifiedValue[value].PermissionAccess != sharedUserGroupsPreservedList[value].PermissionAccess) {
                if (scope.IsUserItem(value)) {
                    if (jQuery.inArray(sharedUserGroupsPreservedList[value].PermissionId, userMarkedForDeletionList) == -1) {
                        userMarkedForDeletionList.push(sharedUserGroupsPreservedList[value].PermissionId);
                    }
                }
                else if (scope.IsGroupItem(value)) {
                    if (jQuery.inArray(sharedUserGroupsPreservedList[value].PermissionId, groupMarkedForDeletionList) == -1) {
                        groupMarkedForDeletionList.push(sharedUserGroupsPreservedList[value].PermissionId);
                    }
                }
            }
        });
    }
}

function resetPreRequestValues() {
    modifiedItemIndex = [];
    addNewItemPermission = [];
    userMarkedForDeletionList = [];
    groupMarkedForDeletionList = [];
}

function resetToActualScope() {
    var scope = angular.element(manageUserGroupBodySection).scope();
    scope.$apply(function () {
        angular.copy(sharedUserGroupsPreservedList, scope.sharedUserGroups);
    });

    scope.$apply(function () {
        angular.copy(sharedAccessModePreservedList, scope.accessModes);
    });

    $(".change-access-mode-selection").selectpicker("refresh");
    $(".change-access-mode-selection .selectpicker").removeAttr("title");
    changeIndicatorBannerObj.css("visibility", "hidden");
    resetPreRequestValues();
    $('[data-toggle="tooltip"]').tooltip();
    manageAccessSaveBtnObj.hide();
    manageAccessCancelBtnObj.hide();
    shareBtnObj.hide();
    shareDoneBtnObj.show();
}

//AutoComplete

function enableAutocompleteAccessModeSelectionWithoutReset() {
    autoCompleteControlEle.ejAutocomplete("enable");
    autoCompleteControlWrapperEle.find(".e-in-wrap.e-box.e-corner").removeClass("disable-autocomplete");
    accessModeSelectionInput.prop("disabled", false);
    $(".selectpicker[data-id='access-mode-selection']").removeClass("disabled");
    $(".selectpicker[data-id='access-mode-selection']").removeClass("disable-autocomplete-access-mode-selection");
    accessModeSelectionInput.selectpicker("refresh");
}

function refreshAutocompleteAccessModeSelection() {
    accessModeSelectionInput.prop('selectedIndex', 0);
    accessModeSelectionInput.selectpicker("refresh");
}


function enableAutocompleteAccessModeSelection() {
    accessModeSelectionInput.prop("disabled", false);
    $(".selectpicker[data-id='access-mode-selection']").removeClass("disabled");
    $(".selectpicker[data-id='access-mode-selection']").removeClass("disable-autocomplete-access-mode-selection");
    refreshAutocompleteAccessModeSelection();
}

function disableAutocompleteAccessModeSelection() {
    accessModeSelectionInput.prop("disabled", true);
    $(".selectpicker[data-id='access-mode-selection']").addClass("disabled");
    $(".selectpicker[data-id='access-mode-selection']").addClass("disable-autocomplete-access-mode-selection");
    refreshAutocompleteAccessModeSelection();
}

function onSuggestionListOpen() {
    manageUserGroupContainer.addClass("disable-element-opacity");
}

function onSuggestionListClose() {
    if (autoCompleteInstance.getValue() == "") {
        manageUserGroupContainer.removeClass("disable-element-opacity");
    }
}

function refreshUserGroupScroll() {
    if (manageUserGroupBodySection.is(":visible")) {
        $('.tooltip').tooltip('hide');
        var scrollerHeight = 225;
        manageUserGroupBodySection.ejScroller({
            height: scrollerHeight,
            width: "100%",
            scrollerSize: 7,
            buttonSize: 0,
            enableTouchScroll: true,
            scrollOneStepBy: 20,
            scroll: function () {
                $('.tooltip').tooltip('hide');
                $('[data-toggle="popover"]').popover('hide');
            }
        });

        var scrollercontrol = manageUserGroupBodySection.ejScroller("instance");
        scrollercontrol.model.height = scrollerHeight;
        scrollercontrol.refresh();
        $(".manage-user-group-body-section .e-scrollbar").show();
    }
}

function generateEmbedCode(itemDetail) {
    var embedDashboardUrl = getDashboardShareLink(itemDetail.Id, itemDetail.CategoryName, itemDetail.Name) + "?isembed=true";

    embedDashboardUrl += $("#embed-dashboard-comments").is(":checked") ? "&dashboard_comments=true" : "";
    embedDashboardUrl += $("#embed-widget-comments").is(":checked") ? "&widget_comments=true" : "";
    embedDashboardUrl += $("#embed-views").is(":checked") ? "&views=true" : "";
    embedDashboardUrl += $("#embed-export").is(":checked") ? "&export=true" : "";

    var embedFrameCode = '<iframe src="' + embedDashboardUrl + '" id="dashboard-frame" width="800px" height="600px" allowfullscreen frameborder="0"></iframe>';
    return embedFrameCode;
}

function ResetGrid() {
    var gridObj = (iframeUrl == parentUrl) ? parent.$("#items").data("ejGrid") : $("#items").data("ejGrid");
    if (gridObj != null) {
        gridObj.model.sortSettings.sortedColumns = [];
        if (!$(".all-items").hasClass("active")) {
            gridObj.model.filterSettings.filteredColumns = [];
        }
        $("#search-items").find("input[type=text]").val('');
        gridObj.refreshContent();
        $(".e-filtericon").removeClass('e-filteredicon e-filternone');
    }
}