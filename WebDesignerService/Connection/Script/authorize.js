﻿/// <reference path="jquery-2.2.4.min.js" />
'use strict'
function initialize(data) {
    window.authData = data;
}
function authorize() {
    this.api = {
        validate: '/v1.0/connection/validate',
        oauthLogin: '/v1.0/oauth/authenticate',
        getOAuthAccounts: '/v1.0/design/linked-accounts/',
        oauthReAuthUrl: '/v1.0/oauth/re-authorize',
        validateCredentials: '/v1.0/connection/validate-credentials',
        getAccountSettings: '/v1.0/connection/analytics/list-accounts',
        getWebProperties: '/v1.0/connection/analytics/list-properties',
        getViews: '/v1.0/connection/analytics/list-views'
    };
    this.isOAuthConnection = false;
    this.accounts = [];
    this.selectedAccount = null;
    this.accountId = null;
    this.propertyId = null;
    this.viewId = null;
    this.initialize = function () {
        this.disableContinueBtn();
        if (window.authData && typeof window.authData === "object") {
            window.authData.service = window.authData.service.toLowerCase();
            window.authData.provider = window.authData.provider.toLowerCase();
            this.init();
            this.initTemplate();
            if (this.isOAuthConnection) {
                this.getAccountsForProvider();
            } else {
                this.enableContinueBtn();
            }
        } else {
            var payload = this.getUrlParameter('payload');
            if (payload) {
                this.isOAuthConnection = true;
                var obj = JSON.parse(payload);
                this.selectedAccount = {
                    Provider: obj.provider,
                    Service: obj.service,
                    Id: obj.serviceId
                };
                window.authData = {
                    provider: obj.provider.toLowerCase(),
                    designerService: obj.serviceUrl,
                    origin: obj.origin,
                    service: obj.service,
                    server: obj.server,
                    token: obj.token,
                    isRedirect: true
                };
                this.onOkBtnClick(null);
            }

        }
        this.wireEvents();
    };
    this.init = function () {
        $(".e-auth-content-wrapper .e-auth-content-header .e-ds-icon").addClass(window.authData.service);
        $(".e-auth-content-wrapper .e-auth-content-header .e-ds-name").html(this.getServiceName(window.authData.provider, window.authData.service));
        $('.e-auth-content-wrapper .e-auth-content').html(this.getTemplate(this.getServiceName(window.authData.provider, window.authData.service)));
    }
    this.wireEvents = function () {
        $('.e-auth-content-wrapper .e-auth-content-footer .e-ok-btn').on('click', $.proxy(this.onOkBtnClick, this));
        $('.e-auth-content-wrapper #re-authorize').on('click', $.proxy(this.reAuthorizeClick, this));
        $('.e-auth-content-wrapper #oauth-account').on('change', $.proxy(this.onAccSelectionChange, this));
        $('.e-auth-content-wrapper .e-auth-content-footer .e-new-account').on('click', $.proxy(this.onNewAccountClick, this));
        $('.e-auth-content-wrapper').on('keyup', $.proxy(this.keyHandler, this));      
        $('.e-auth-content-wrapper .e-auth-content-footer .e-back-btn').on('click', $.proxy(this.onBackBtnClick, this));
    };
    this.unwireEvents = function () {
        $('.e-auth-content-wrapper .e-auth-content-footer .e-ok-btn').off('click', $.proxy(this.onOkBtnClick, this));
        $('.e-auth-content-wrapper #re-authorize').off('click', $.proxy(this.reAuthorizeClick, this));
        $('.e-auth-content-wrapper #oauth-account').off('change', $.proxy(this.onAccSelectionChange, this));
        $('.e-auth-content-wrapper .e-auth-content-footer .e-new-account').off('click', $.proxy(this.onNewAccountClick, this));
        $('.e-auth-content-wrapper').off('keyup', $.proxy(this.keyHandler, this));
        $('.e-account-settings-content-wrapper #list-accounts').off('change', $.proxy(this.onAccSelection, this));
        $('.e-account-settings-content-wrapper #list-properties').off('change', $.proxy(this.onPropertySelection, this));
        $('.e-account-settings-content-wrapper #list-views').off('change', $.proxy(this.onViewSelection, this));
        $('.e-auth-content-wrapper .e-auth-content-footer .e-back-btn').off('click', $.proxy(this.onBackBtnClick, this));
    };
    this.wireGASettings = function () {
        $('.e-account-settings-content-wrapper #list-accounts').on('change', $.proxy(this.onAccSelection, this));
        $('.e-account-settings-content-wrapper #list-properties').on('change', $.proxy(this.onPropertySelection, this));
        $('.e-account-settings-content-wrapper #list-views').on('change', $.proxy(this.onViewSelection, this));
    }

    this.onAccFetchSuccess = function (data, args) {
        if (args.Status) {
            if (args.Data && args.Data.length !== 0) {
                this.enableContinueBtn();
                var accList = $('#oauth-account');
                $('#no-acc-container').hide();
                $('#acc-container').show();
                for (var i = 0; i < args.Data.length; i++) {
                    accList.append($('<option>').html($('<div>').html(args.Data[i].Name)).data('data', args.Data[i]).attr('value', args.Data[i].Id));
                }
                if (window.authData.isRedirect && this.selectedAccount) {
                    var currentAcc = accList.find('option[value=' + this.selectedAccount.Id + ']');
                    if (currentAcc.length !== 0) {
                        currentAcc.attr('selected', 'selected');
                        $('#continue-btn').trigger('click');
                    }
                } else {
                    this.onAccSelectionChange({ currentTarget: accList[0] });
                }
            } else {
                $('#acc-container').hide();
                $('#no-acc-container').show();
                this.disableContinueBtn();
            }
        } else {
            this.disableContinueBtn();
            $('#error-msg').html(args.Message);
        }
    }
    this.onAccSelectionChange = function (args) {
        this.hideErrorMsg();
        var value = args.currentTarget.value;
        this.selectedAccount = $(args.currentTarget).find('option[value=' + value + ']').data('data');
        this.validateSelectedAccount(this.selectedAccount);
        if ($('#continue-btn')[0].hasAttribute('disabled')) {
            this.removeErrorNotification();
            this.hideErrorMsg();
            this.enableContinueBtn();
            $('.e-add-auth-req-wrapper').css('display', 'none');
        }
        if ($('.e-add-auth-req-wrapper').css('display') !== 'none') {
            this.disableContinueBtn();
        }
    }
    this.validateSelectedAccount = function (data) {
        if (data && data.Services.indexOf(window.authData.service) === -1) {
            $('.e-add-auth-req-wrapper').show();
        } else {
            $('.e-add-auth-req-wrapper').hide();
        }
    }
    this.onNewAccountClick = function (args) {
        window.location.href = this.getOAuthLoginUrl(null);
    }
    this.reAuthorizeClick = function (args) {
        window.location.href = this.getOAuthLoginUrl(this.selectedAccount.Id);
    }
    this.onOkBtnClick = function (args) {
        this.removeErrorNotification();
        this.hideErrorMsg();
        var serviceName = window.authData.service;
        if (serviceName !== undefined && serviceName.toLowerCase() === 'analytics' && $('#account-settings-container').css('display') === "none") {
            if (args === null) {
                this.init();
                this.getAccountsForProvider();
            } else {
                if ($("#account-settings-container").find('.e-account-settings-content-wrapper').length <= 0) {
                    $("#account-settings-container").append(this.renderGAAccountSettings());
                }
                this.wireGASettings();
                this.getAccountsSettings();
            }
        } else {
            if (args === null) {
                this.showLoader('Redirecting please wait...');
                this.hideAuthContainer();
            }
            this.validateConnectionInfo();
        }
    };
    this.portObjToUrl = function (obj) {
        var request = {
            provider: window.authData.provider,
            service: window.authData.service,
            data: obj,
            origin: window.authData.origin
        };
        var url = '';
        var keys = Object.keys(request);
        for (var i = 0; i < keys.length; i++) {
            url += keys[i] + '=' + request[keys[i]] + '&';
        }
        return url;
    };
    this.getServiceName = function (provider, service) {
        switch (provider) {
            case "jira":
                return "Jira";
            case "google":
                if (service === 'youtube') {
                    return "YouTube";
                }
                else {
                    return "Google Analytics";
                }
            case "salesforce":
                return "Salesforce";
            case 'mailchimp':
                return 'Mail Chimp';
            case 'zendesk':
                return 'Zendesk';
            case 'stripe':
                return 'Stripe';
            case "github":
                return "Github";
            case "sendgrid":
                return "SendGrid";
            case 'youtube':
                return 'YouTube';
            case 'twilio':
                return 'Twilio';


        }
    };
    this.validateConnectionInfo = function () {
        switch (window.authData.provider.toLowerCase()) {
            case 'jira':
            case 'zendesk':
                this.validateDomainBasicAuthConnection();
                break;
            case 'salesforce':
            case 'google':
            case'youtube':
                this.validateOAuthConnection();
                break;
            case 'mailchimp':
            case 'sendgrid':
            case 'github':
            case 'stripe':
            case 'twilio':
                this.validateBasicAuthConnection();
                break;
        }
    };
    this.initTemplate = function () {
        switch (window.authData.provider.toLowerCase()) {
            case 'jira':
                $('#url').focus();
                break;
            case 'salesforce':
                break;
        }
    };
    this.getTemplate = function (service) {
        switch (service) {
            case 'Jira':
                return this.getDomainBasicAuthTemplate('https://yourdomain.atlassian.net');
            case 'Zendesk':
                return this.getDomainBasicAuthTemplate('https://company.zendesk.com');
            case 'Salesforce':
            case 'Google Analytics':
            case 'YouTube':
                this.isOAuthConnection = true;
                $('.e-new-account').css('display', 'inline-block');
                return this.getOAuthTemplate();
            case 'Mail Chimp':
            case 'Github':
            case 'Twilio':
            case 'Stripe':
            case 'SendGrid':
                return this.getBasicAuthTemplate(service);
        }
    };
    this.validateBasicAuthConnection = function () {
        $('.e-auth-content-wrapper').removeClass('e-req-error');
        var obj = { status: false, data: '' };
        var data = {};
        var isRequiredFieldEmpty = false;
        var requiredFields = $('input.e-required');
        for (var i = 0; i < requiredFields.length; i++) {
            if (requiredFields.eq(i).val().trim() === '') {
                isRequiredFieldEmpty = true;
                break;
            }
        }
        if ($("#username").val().trim() !== '') {
            data.username = $('#username').val().trim();
        }
        if ($("#password").val().trim() !== '') {
            data.password = $('#password').val().trim();
        }
        if ($('#repositoryname').length) {
            if ($("#repositoryname").val().trim() !== '') {
                data.repositoryURL = $('#repositoryname').val().trim();
            }
        }
       
        obj.status = true;
        obj.data = JSON.stringify(data);
        if (isRequiredFieldEmpty) {
            $('.e-auth-content-wrapper').addClass('e-req-error');
            obj.status = false;
        }
        if (obj.status) {
            var request = {
                provider: window.authData.provider,
                service: window.authData.service,
                data: obj.data,
                origin: window.authData.origin
            };
            this.doAjaxPost('GET', window.authData.designerService + this.api.validateCredentials + '?' + this.portObjToUrl(obj.data), obj.data, this.onFetchSuccess);
        }
    };
    this.validateDomainBasicAuthConnection = function () {
        $('.e-domain-url').removeClass('e-req-error');
        $('.e-domain-username').removeClass('e-req-error');
        $('.e-domain-pwd').removeClass('e-req-error');
        var obj = { status: false, data: '' };
        var data = {};
        if ($("#url").val().trim() !== '' && this.validateUrl($("#url").val().trim()) && $("#username").val().trim() !== '' && $("#password").val().trim() !== '') {
            data.url = $('#url').val().trim();
            data.username = $('#username').val().trim();
            data.password = $('#password').val().trim();
            obj.status = true;
            obj.data = JSON.stringify(data);
        } else {
            obj.status = false;
            if ($("#url").val().trim() === '' || !this.validateUrl($("#url").val().trim())) {
                $('.e-domain-url').addClass('e-req-error');
            }
            if ($("#username").val().trim() === '') {
                $('.e-domain-username').addClass('e-req-error');
            }
            if ($("#password").val().trim() === '') {
                $('.e-domain-pwd').addClass('e-req-error');
            }
        }
        if (obj.status) {
            var request = {
                provider: window.authData.provider,
                service: window.authData.service,
                data: obj.data,
                origin: window.authData.origin
            };
            this.doAjaxPost('GET', window.authData.designerService + this.api.validateCredentials + '?' + this.portObjToUrl(obj.data), obj.data, this.onFetchSuccess);
        }
    }

    this.onFetchSuccessForSalesforce = function (data, args) {
        if (args !== null && args !== undefined) {
            if (args.ApiStatus === true) {               
                    window.location.href = window.authData.designerService + this.api.validate + '?' + this.portObjToUrl(data);
                } else {
                $('.e-add-auth-req-wrapper').css('display', 'block');
                this.disableContinueBtn();
            }
        }
    }
    this.onFetchSuccess = function (data, args) {
        if (args !== null && args !== undefined) {
            if (args.ApiStatus === true) {
                window.location.href = window.authData.designerService + this.api.validate + '?' + this.portObjToUrl(data);
            } else {
                        this.showErrorMsg(args.Message);
                }
            }
    }
    this.showErrorMsg = function (msg) {
        $('#error-msg').html(msg).show();
    };
    this.hideErrorMsg = function () {
        $('#error-msg').hide();
    };
    this.validateOAuthConnection = function () {
        if (this.selectedAccount === null || this.selectedAccount === undefined) {
            this.showErrorMsg('Please connect an account to continue.');

        } else {
            var obj = { status: false, data: {} };
            var data = {};
            if (this.selectedAccount !== null || this.selectedAccount !== undefined) {
                obj.status = true;
                var serviceName = window.authData.service;
                if (serviceName !== undefined && serviceName.toLowerCase() === 'analytics') {
                    obj.data = JSON.stringify({
                        serviceId: this.selectedAccount.Id,
                        accountId: this.accountId,
                        propertyId: this.propertyId,
                        viewId: this.viewId
                    });
                }
                else {
                    obj.data = JSON.stringify({
                        serviceId: this.selectedAccount.Id
                    });
                }
            }
            this.doAjaxPost('GET', window.authData.designerService + this.api.validateCredentials + '?' + this.portObjToUrl(obj.data), obj.data, this.onFetchSuccessForSalesforce);
        }
    }
    this.removeErrorNotification = function () {
        $('.e-auth-content-wrapper').removeClass('e-error');
    };
    this.showLoader = function (text) {
        $('#loader').css('display', 'table').find('.e-loader-text').html(text || '');

    }
    this.hideLoader = function () {
        $('#loader').hide();
    }
    this.hideAuthContainer = function () {
        $('#auth-container').hide();
    };
    this.getDomainBasicAuthTemplate = function (domainUrl) {
        return '<div class="e-div">' +
            '<span>' +
            '<label>Url</label>' +
            '</span>' +
            '<input type="text" class="e-domain-url e-required" id="url" placeholder="' + domainUrl + '"/>' +
            '</div>' +
            '<div class="e-div">' +
            ' <span>' +
            '<label>Username</label>' +
            '</span>' +
            ' <input type="text" class=" e-domain-username e-required" id="username" placeholder="username"/>' +
            '</div>' +
            '<div class="e-div">' +
            '<span>' +
            ' <label>Password</label>' +
            '</span>' +
            ' <input type="password" class="e-domain-pwd e-required" id="password" placeholder="**********"/>' +
            ' </div>';
    };
    this.getBasicAuthTemplate = function (serviceProvider) {
        switch (serviceProvider) {
            case 'Twilio':
                return '<div class="e-div">' +
                    ' <span>' +
                    '<label>Account SID</label>' +
                    '</span>' +
                    ' <input type="text" class="e-required" id="username" placeholder="account SID"/>' +
                    '</div>' +
                    '<div class="e-div">' +
                    '<span>' +
                    ' <label>Auth Token</label>' +
                    '</span>' +
                    ' <input type="password" class="e-required" id="password" placeholder="**********"/>' +
                    ' </div>';
            case 'Mail Chimp':
                return '<div class="e-div">' +
                    ' <span>' +
                    '<label>Username</label>' +
                    '</span>' +
                    ' <input type="text" class="e-required" id="username" placeholder="username"/>' +
                    '</div>' +
                    '<div class="e-div">' +
                    '<span>' +
                    ' <label>API Key</label>' +
                    '</span>' +
                    ' <input type="password" class="e-required" id="password" placeholder="**********"/>' +
                    ' </div>';
            case 'Github':
                return '<div class="e-div">' +
                    '<span>' +
                    ' <label>Repository Name</label>' +
                    '</span>' +
                    ' <input type="text" style="font-size:12px;" class="e-domain-repository e-required" id="repositoryname" placeholder="repository name"/>' +
                    '</div>' +
                    '<div class="e-div">' +
                    '<span>' +
                    '<label>Username</label>' +
                    '</span>' +
                    '<input type="text" class="e-domain-username e-required" id="username" placeholder="username"/>' +
                    '</div>' +
                    '<div class="e-div">' +
                    ' <span>' +
                    '<label>Password</label>' +
                    '</span>' +
                    ' <input type="password" class=" e-domain-username e-required" id="password" placeholder="**********"/>' +
                    '</div>';
            default:
                return '<div class="e-div">' +
                    ' <span>' +
                    '<label>Username</label>' +
                    '</span>' +
                    ' <input type="text" class="e-required" id="username" placeholder="username"/>' +
                    '</div>' +
                    '<div class="e-div">' +
                    '<span>' +
                    ' <label>Password</label>' +
                    '</span>' +
                    ' <input type="password" class="e-required" id="password" placeholder="**********"/>' +
                    ' </div>';
        }
    };
    this.getOAuthTemplate = function () {
        return '<div class="e-div" id="acc-container">' +
            '<span>' +
            ' <label>Account Selected</label>' +
            '</span>' +
            ' <select id = "oauth-account" class="e-list">' +
            '</select >' +
            ' <div class="e-add-auth-req-wrapper">' +
            ' <lable class="e-label e-warn"> Additional permission is required for this account.</lable>' +
            ' <button id = "re-authorize" class="e-ok-btn e-authorize-btn e-right-align"> Authorize</button>' +
            '</div>' +
            '</div>' +
            '<div style="display:none;" class="e-no-acc-label e-div" id="no-acc-container"><label id="no-accounts-label">Please connect an account to continue.<label/></div>';
    };

    this.getOAuthLoginUrl = function (reauthId) {
        let url = window.authData.designerService + (reauthId ? this.api.oauthReAuthUrl: this.api.oauthLogin) + '?';
        if (window.authData.provider) {
            url += 'provider=' + window.authData.provider;
        }
        if (window.authData.service) {
            url += '&service=' + window.authData.service;
        }
        if (window.authData.token) {
            url += '&token=' + window.authData.token;
        }
        url += '&origin=' + window.authData.origin;
        if (window.authData.server) {
            url += '&server=' + window.authData.server;
        }
        if (reauthId) {
            url += '&id=' + reauthId;
        }
        url += '&pageredirect=' + window.location.origin + window.location.pathname;
        return url;
    }
    this.getAccountsForProvider = function () {
        this.doAjaxPost('GET', window.authData.designerService + this.api.getOAuthAccounts + window.authData.provider, null, this.onAccFetchSuccess);
    }

    this.doAjaxPost = function (method, url, data, success) {
        this.showLoader();
        $.ajax({
            type: method,
            url: url,
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(data),
            beforeSend: $.proxy(function (req) {
                req.setRequestHeader('Caller', window.authData.server);
                req.setRequestHeader('Authorization', window.authData.token);
            }),
            success: $.proxy(function (args) {
                this.hideLoader();
                success.call(this, data, args);
            }, this),
            error: $.proxy(function (evt) {
                this.hideLoader();
                this.showErrorMsg('An error occured while fetching the data.' + evt.status + ':' + evt.statusText);
            }, this)
        });
    }
    this.getUrlParameter = function (name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };
    this.enableContinueBtn = function () {
        $('#continue-btn').removeAttr('disabled');
    };
    this.disableContinueBtn = function () {
        $('#continue-btn').attr('disabled', 'disabled');
    }
    this.validateUrl = function (url) {
        var regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        return regexp.test(url);
    };
    this.keyHandler = function (evt) {
        if (evt.which === 13 || evt.keyCode === 13) {
            $('#continue-btn').trigger('click');
        }
    };
	
	this.renderGAAccountSettings = function(){
		return   '<div class="e-account-settings-content-wrapper">' +
                 '<div class="e-account-settings-content">' + 
                 '<div class="e-account-settings-dropdown-div">'  +
                 '<div class="e-account-settings-dropdown-label-div"><label>Analytics Account :</label></div>' + 
                 '<select id="list-accounts" class="e-account-settings"></select>' +
                 '</div>' + '<div class="e-account-settings-dropdown-div">' +
                 '<div class="e-account-settings-dropdown-label-div">' + '<label>Web Property :</label>' + '</div>' +
                 '<select id="list-properties" class="e-account-settings"></select>' + '</div>' + '<div class="e-account-settings-dropdown-div">' +
                 '<div class="e-account-settings-dropdown-label-div">' + '<label>Analytics Profile :</label>' + '</div>' +
                 '<select id="list-views" class="e-account-settings"></select>' + '</div>' + '</div>' + '</div>';
	}

    this.getAccountsSettings = function (args) {
        var id = 'list-accounts';
        var request = {
            provider: window.authData.provider,
            serviceId: this.selectedAccount.Id,
        };
        this.AjaxPost('POST', window.authData.designerService + this.api.getAccountSettings, request, this.onFetchGASettings, id);
    }

    this.onAccSelection = function (args) {
        var id = 'list-properties';
        var value = args.currentTarget.value;
        this.accountId = $(args.currentTarget).find('option[value=' + value + ']').data('data').id;
        var request = {
            provider: window.authData.provider,
            serviceId: this.selectedAccount.Id,
            accountId: this.accountId
        };
        this.AjaxPost('POST', window.authData.designerService + this.api.getWebProperties, request, this.onFetchGASettings, id);
    }
	
    this.onPropertySelection = function (args) {
        var id = 'list-views';
        var value = args.currentTarget.value;
        this.propertyId = $(args.currentTarget).find('option[value=' + value + ']').data('data').id;
        var request = {
            provider: window.authData.provider,
            serviceId: this.selectedAccount.Id,
            accountId: this.accountId,
            propertyId: this.propertyId
        };
        this.AjaxPost('POST', window.authData.designerService + this.api.getViews, request, this.onFetchGASettings, id);
    }

    this.onViewSelection = function (args) {
        var value = args.currentTarget.value;
        this.viewId = $(args.currentTarget).find('option[value=' + value + ']').data('data').id;
    }

    this.onFetchGASettings = function (data, id, args) {
        var accList = $('#' + id);
        var optionList = [];
        if (args.Status) {
            if (args.Data && args.Data.length !== 0) {
                data = JSON.parse(args.Data);
                if (data.items.length !== 0) {
                    accList.html('');
                    for (var i = 0; i < data.items.length; i++) {
                       optionList.push($('<option>').html($('<div>').html(data.items[i].name)).data('data', data.items[i]).attr('value', data.items[i].id));
                    }
                    accList.append(optionList);
                    switch (id) {
                        case 'list-accounts':
                            this.onAccSelection({ currentTarget: accList[0] });
                            $('.e-auth-content, .e-new-account').css('display', 'none');
                            $('#account-settings-container, .e-back-btn-div').css('display', 'inline');
                            break;
                        case 'list-properties':
                            this.onPropertySelection({ currentTarget: accList[0] });
                            break;
                        case 'list-views':
                            this.onViewSelection({ currentTarget: accList[0] });
                            this.hideLoader();
                            break;                     
                    }                      
                }
                else {
                    this.hideLoader();
                    $('#error-msg').html('');
                    this.showErrorMsg('You may not have any Google Analytics account.');
                }
            }
        } else {
            this.hideLoader();   
            $('#error-msg').html('');
            var errorMsg = null;
            try {
                errorMsg = JSON.parse(args.Message).error.message;
            }
            catch (e) {
                errorMsg = args.Message;
            }
            this.showErrorMsg(errorMsg);
        }      
    }

    this.onBackBtnClick = function () {
        $('.e-auth-content,.e-new-account').css('display', 'inline');
        $('#account-settings-container,.e-back-btn-div').css('display', 'none');
    }

    this.AjaxPost = function (method, url, data, success, id) {
         $.ajax({
            type: method,
            url: url,
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(data),
            beforeSend: $.proxy(function (req, evt) {
                this.showLoader();
                req.setRequestHeader('Caller', window.authData.server);
                req.setRequestHeader('Authorization', window.authData.token);
            }, this),
            success: $.proxy(success, this, data, id),
            error: $.proxy(function (evt) {
                this.showErrorMsg('An error occured while fetching the data.' + evt.status + ':' + evt.statusText);
             }, this),
         });
    }
 };
$(function () {
    var obj = new authorize();
    obj.initialize();
});
