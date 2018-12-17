function CustomErrorMessage(ErrorCode, itemType) {
    if (ErrorCode != "") {
        switch (ErrorCode) {
            case window.publicItemSetttingOffWithoutLoginAndWithOutAccess:
                {
                    $("#header").html("[[[Failed to render public ]]]" + itemType + ".");
                    $("#ul-possible").html("<li>[[[System Administrator has disabled viewing of public ]]]" + itemType + ".</li>");
                    $("#ul-solution").html("<li>[[[If you have read access to this ]]]" + itemType + "[[[, you can set the authentication details in the embedded file. Click]]] <a href='https://help.syncfusion.com/dashboard-platform/dashboard-server/administration/manage-dashboards/embed-server-dashboards'>[[[here]]]</a>[[[ for more details.]]]</li>" +
                                             "<li>[[[Contact your System Administrator to enable the viewing of public ]]]" + itemType + "[[[s. Click ]]]<a href='https://help.syncfusion.com/dashboard-platform/dashboard-server/site-settings/dashboard-settings'>[[[here]]]</a>[[[ for more details.]]]</li>");
                    $("#custom-errors-embed-dashboard").css("display", "block");
                    $("#dashboard,#widget").css("display", "none");
                    $(".options").css("display", "none");
                } break;
            case window.publicItemSetttingOffWithLoginAndWithOutAccess:
                {
                    $("#header").html("[[[Failed to render public ]]]" + itemType + ".");
                    $("#ul-possible").html("<li>[[[System Administrator has disabled viewing of public ]]]" + itemType + "[[[ or invalid authorization.]]]</li>");
                    $("#ul-solution").html("<li>[[[Contact your System Administrator to enable the viewing of public ]]]" + itemType + "[[[s. Click ]]]<a href='https://help.syncfusion.com/dashboard-platform/dashboard-server/site-settings/dashboard-settings'>[[[here]]]</a>[[[ for more details.]]]</li>" +
                                             "<li>[[[You don't have access to this ]]]" + itemType + "[[[ in the Dashboard Server. Please contact your System Administrator to get access. Click ]]]<a href='https://help.syncfusion.com/dashboard-platform/dashboard-server/administration/manage-dashboards/share-dashboards'>[[[here]]]</a>[[[ to learn more about sharing a ]]]" + itemType + ".</li>");
                    $("#custom-errors-embed-dashboard").css("display", "block");
                    $("#dashboard,#widget").css("display", "none");
                    $(".options").css("display", "none");
                } break;
            case window.privateItemSetttingOnWithoutLoginAndWithOutAccessForWinAuth:
                {
                    $("#header").html("[[[Authentication failed to render ]]]" + itemType + ".");
                    $("#ul-possible").html("<li>[[[Invalid authentication.]]]</li>");
                    $("#ul-solution").html("<li>[[[If you have read access to this ]]]" + itemType + "[[[, you can set the authentication details in the embedded file. Click ]]]<a href='https://help.syncfusion.com/dashboard-platform/dashboard-server/administration/manage-dashboards/embed-server-dashboards'>[[[here]]]</a>[[[ for more details.]]]</li>");
                    $("#custom-errors-embed-dashboard").css("display", "block");
                    $("#dashboard,#widget").css("display", "none");
                    $(".options").css("display", "none");
                } break;
            case window.privateItemSetttingOnWithoutLoginAndWithOutAccessForWinADAuth:
                {
                    $("#header").html("[[[Authentication failed to render ]]]" + itemType + ".");
                    $("#ul-possible").html("<li>[[[Invalid authentication.]]]</li>");
                    $("#ul-solution").html("<li>[[[This ]]]" + itemType + "[[[ has been embedded using Windows AD authentication. Please make sure you are already logged in using Windows AD authentication and have access to the Dashboard Server.]]]</li>");
                    $("#custom-errors-embed-dashboard").css("display", "block");
                    $("#dashboard,#widget").css("display", "none");
                    $(".options").css("display", "none");
                } break;
            case window.privateItemSetttingOnWithoutLoginAndWithOutAccessForAzureADAuth:
                {
                    $("#header").html("[[[Authentication failed to render ]]]" + itemType + ".");
                    $("#ul-possible").html("<li>[[[Invalid authentication.]]]</li>");
                    $("#ul-solution").html("<li>[[[This ]]]" + itemType + "[[[ has been embedded using Azure AD authentication. Please make sure you are already logged in using Azure AD authentication and have access to the Dashboard Server.]]]</li>");
                    $("#custom-errors-embed-dashboard").css("display", "block");
                    $("#dashboard,#widget").css("display", "none");
                    $(".options").css("display", "none");
                } break;
            case window.privateItemSetttingOnWithLoginAndWithOutAccess:
                {
                    $("#header").html("[[[Authorization failed to render ]]]" + itemType + ".");
                    $("#ul-possible").html("<li>[[[Private Dashboards cannot be rendered without valid authorization.]]]</li>");
                    $("#ul-solution").html("<li>[[[You don't have access to this ]]]" + itemType + "[[[ in the Dashboard Server, please contact your System Administrator to get access. Click ]]]<a href='https://help.syncfusion.com/dashboard-platform/dashboard-server/administration/manage-dashboards/share-dashboards'>[[[here]]]</a>" + "[[[ to learn more about sharing a ]]]" + itemType + ".</li>");
                    $("#custom-errors-embed-dashboard").css("display", "block");
                    $("#dashboard,#widget").css("display", "none");
                    $(".options").css("display", "none");
                } break;
            case window.privateItemSetttingOffWithoutLoginAndWithOutAccessForWinAuth:
                {
                    $("#header").html("[[[Authentication failed to render ]]]" + itemType + ".");
                    $("#ul-possible").html("<li>[[[Invalid authentication.]]]</li>");
                    $("#ul-solution").html("<li>[[[If you have read access to this ]]]" + itemType + "[[[, you can set the authentication details in the embedded file. Click ]]]<a href='https://help.syncfusion.com/dashboard-platform/dashboard-server/administration/manage-dashboards/embed-server-dashboards'>[[[here]]]</a>[[[ for more details.]]]</li>");
                    $("#custom-errors-embed-dashboard").css("display", "block");
                    $("#dashboard,#widget").css("display", "none");
                    $(".options").css("display", "none");
                } break;
            case window.privateItemSetttingOffWithoutLoginAndWithOutAccessForWinADAuth:
                {
                    $("#header").html("[[[Authentication failed to render ]]]" + itemType + ".");
                    $("#ul-possible").html("<li>[[[Invalid authentication.]]]</li>");
                    $("#ul-solution").html("<li>[[[This ]]]" + itemType + "[[[ has been embedded using Windows AD authentication. Please make sure you are already logged in using Windows AD authentication and have access to the Dashboard Server.]]]</li>");
                    $("#custom-errors-embed-dashboard").css("display", "block");
                    $("#dashboard,#widget").css("display", "none");
                    $(".options").css("display", "none");
                } break;
            case window.privateItemSetttingOffWithoutLoginAndWithOutAccessForAzureADAuth:
                {
                    $("#header").html("[[[Authentication failed to render ]]]" + itemType + ".");
                    $("#ul-possible").html("<li>[[[Invalid authentication.]]]</li>");
                    $("#ul-solution").html("<li>[[[This ]]]" + itemType + "[[[ has been embedded using Azure AD authentication. Please make sure you are already logged in using Azure AD authentication and have access to the Dashboard Server.]]]</li>");
                    $("#custom-errors-embed-dashboard").css("display", "block");
                    $("#dashboard,#widget").css("display", "none");
                    $(".options").css("display", "none");
                } break;
            case window.privateItemSetttingOffWithLoginAndWithOutAccess:
                {
                    $("#header").html("[[[Authorization failed to render ]]]" + itemType + ".");
                    $("#ul-possible").html("<li>[[[Private Dashboards cannot be rendered without valid authorization.]]]</li>");
                    $("#ul-solution").html("<li>[[[You don't have access to this ]]]" + itemType + "[[[ in the Dashboard Server, please contact your System Administrator to get access. Click ]]]<a href='https://help.syncfusion.com/dashboard-platform/dashboard-server/administration/manage-dashboards/share-dashboards'>[[[here]]]</a>[[[ to learn more about sharing a ]]]" + itemType + ".</li>");
                    $("#custom-errors-embed-dashboard").css("display", "block");
                    $("#dashboard,#widget").css("display", "none");
                    $(".options").css("display", "none");
                } break;
            default:
                break;
        }
    }
}