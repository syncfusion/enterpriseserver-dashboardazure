serverApp.controller('ItemInfoCtrl', ["$scope", function ($scope) {
    $scope.ItemDetail = null;

    $scope.closeItemInfo = function() {
        $("#item-info-popup").ejDialog("close");
    };

    $scope.openInfoDialog = function (itemDetail, showDashboardLinkButton) {
        $scope.ItemDetail = itemDetail;
        $scope.showDashboardLinkButton = showDashboardLinkButton;
        $("#item-info-popup").ejDialog({
            width: window.innerWidth > 480 ? "480px" : window.innerWidth - 10 + "px",
            height: "auto",
            showOnInit: false,
            allowDraggable: false,
            enableResize: false,
            showHeader: false,
            enableModal: true
        });

        $("#item-info-popup").ejDialog("open");
        $("#item-info-popup").ejDialog("refresh");
        $scope.$apply();
    };

    $scope.viewDashboardUrl = function(id, categoryName, name, isDraft) {
        if (isDraft === true) {
            return encodeURI(editDashboardUrl + "/" + id + "/draft/" + name);
        }

        return encodeURI(viewDashboardUrl + "/" + id + "/" + categoryName + "/" + name + "?showmydashboards=1");
    };

    $scope.GetInfoButtonText = function(isDraft) {
        if (isDraft === true) {
            return "[[[Edit dashboard]]]";
        }

        return "[[[Open dashboard]]]";
    };
}]);