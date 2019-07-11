var isKeyUp = false;
$(document).ready(function () {
    $("#content-area").ejWaitingPopup();
    addPlacehoder("body");
    var loginFileExtension;
    var mainFileExtension;
    var favExtension;
    var loginFileName;
    var mainFileName;
    var favName;
    var currentDate = $.now();
    var isNewDatabase = $('input[name=databaseType]:checked').val() == "0" ? true : false ;
    if ($("#time_format").is(":checked")) {
        $(".time").html("[[[13:00]]]");
    } else {
        $(".time").html("[[[1:00 PM]]]");
    }
    $("#mail-password").show();
    $(".input-group-addon .btn.selectpicker").css("height", window.innerWidth <= 1366 ? "28" : "32");
    $("#upload-login-image").ejUploadbox({
        saveUrl: window.fileUploadUrl + "?imageType=loginlogo&&timeStamp=" + currentDate,
        autoUpload: true,
        showFileDetails: false,
        buttonText: { browse: ".  .  ." },
        extensionsAllow: ".PNG,.png,.jpg,.JPG,.jpeg,.JPEG",
        height: window.innerWidth <= 1366 ? 26 : 30,
        begin: function () {
            ShowWaitingProgress("#content-area", "show");
        },
        fileSelect: function (e) {
            loginFileExtension = e.files[0].extension.toLowerCase();
            loginFileName = e.files[0].name;
        },
        error: function () {
            if (loginFileExtension !== ".png" && loginFileExtension !== ".jpg" && loginFileExtension !== ".jpeg") {
                $("#upload-login-image-textbox").addClass("validation-error-image").val("[[[Invalid file format]]]");
                $("#upload-login-image-textbox").closest("div").addClass("has-error");
                $("#upload-login-image-textbox").parent().find(".e-box").addClass("upload-error-border");
            }
        },
        complete: function () {
            window.SystemSettingsProperties.LoginLogo = "login_logo_" + currentDate + ".png";
            var imageUrl = window.baseRootUrl + "/Content/Images/Application/" + "login_logo_" + currentDate + ".png?v=" + $.now();
            $("#display-login-logo").attr("src", imageUrl);
            $("#upload-login-image-textbox").removeClass("ValidationErrorImage").val(loginFileName);
            $("#upload-login-image-textbox").closest("div").removeClass("has-error");
            $("#upload-login-image-textbox").parent().find(".e-box").removeClass("upload-error-border");
            ShowWaitingProgress("#content-area", "hide");
        }
    });

    $("#upload-Main-screen-image").ejUploadbox({
        saveUrl: window.fileUploadUrl + "?imageType=mainlogo&&timeStamp=" + currentDate,
        autoUpload: true,
        showFileDetails: false,
        buttonText: { browse: ".  .  ." },
        extensionsAllow: ".PNG,.png,.jpg,.JPG,.jpeg,.JPEG",
        height: window.innerWidth <= 1366 ? 26 : 30,
        begin: function () {
            ShowWaitingProgress("#content-area", "show");
        },
        fileSelect: function (e) {
            mainFileExtension = e.files[0].extension.toLowerCase();
            mainFileName = e.files[0].name;
        },
        error: function () {
            if (mainFileExtension !== ".png" && mainFileExtension !== ".jpg" && mainFileExtension !== ".jpeg") {
                $("#upload-main-screen-image-textbox").addClass("validation-error-image").val("[[[Invalid file format]]]");
                $("#upload-main-screen-image-textbox").closest("div").addClass("has-error");
                $("#upload-main-screen-image-textbox").parent().find(".e-box").addClass("upload-error-border");
            }
        },
        complete: function () {
            window.SystemSettingsProperties.MainScreenLogo = "main_logo_" + currentDate + ".png";
            var imageUrl = window.baseRootUrl + "/Content/Images/Application/" + "main_logo_" + currentDate + ".png?v=" + $.now();
            $("#mainscreen_logo_img").attr("src", imageUrl);
            $("#upload-main-screen-image-textbox").removeClass("ValidationErrorImage").val(mainFileName);
            $("#upload-main-screen-image-textbox").closest("div").removeClass("has-error");
            $("#upload-main-screen-image-textbox").parent().find(".e-box").removeClass("upload-error-border");
            ShowWaitingProgress("#content-area", "hide");
        }
    });

    $("#upload-favicon-image").ejUploadbox({
        saveUrl: window.fileUploadUrl + "?imageType=favicon&&timeStamp=" + currentDate,
        autoUpload: true,
        showFileDetails: false,
        buttonText: { browse: ".  .  ." },
        extensionsAllow: ".PNG,.png,.jpg,.JPG,.jpeg,.JPEG",
        height: window.innerWidth <= 1366 ? 26 : 30,
        begin: function () {
            ShowWaitingProgress("#content-area", "show");
        },
        fileSelect: function (e) {
            favExtension = e.files[0].extension.toLowerCase();
            favName = e.files[0].name;
        },
        error: function (e) {
            if (favExtension !== ".png" && favExtension !== ".jpg" && favExtension !== ".jpeg") {
                $("#upload-favicon-image-textbox").addClass("validation-error-image").val("[[[Invalid file format]]]");
                $("#upload-favicon-image-textbox").closest("div").addClass("has-error");
                $("#upload-favicon-image-textbox").parent().find(".e-box").addClass("upload-error-border");
            }
        },
        complete: function () {
            window.SystemSettingsProperties.FavIcon = "favicon_" + currentDate + ".png";
            var imageUrl = window.baseRootUrl + "/Content/Images/Application/" + "favicon_" + currentDate + ".png?v=" + $.now();
            $("#favicon_logo_img").attr("src", imageUrl);
            $("#upload-favicon-image-textbox").removeClass("ValidationErrorImage").val(favName);
            $("#upload-favicon-image-textbox").closest("div").removeClass("has-error");
            $("#upload-favicon-image-textbox").parent().find(".e-box").removeClass("upload-error-border");
            ShowWaitingProgress("#content-area", "hide");
        }
    });

    $("div.date-format-radio input[type=radio]").each(function () {
        if (this.value == window.SystemSettingsProperties.DateFormat) {
            $("#" + this.id).attr("checked", "checked");
        }
    });

    $(".mail-settings-fields:not('#mail-password')").keyup(function (e) {
        getEmailPassword();
    });

    $("#enable-ssl").on("change", function () {
        if ($(this).val() === "https") {
            $("#help_text").css("display", "block");
        } else {
            $("#help_text").css("display", "none");
        }
    });

    $("#database-type").on("change", function () {
        var checkedVal = $("#database-type").val().toLowerCase();
        if (checkedVal == "mssql") {
            $("#db-content-holder").removeClass("display-none");
        }
        else {
            $("#db-content-holder").addClass("display-none");
            $("#database-name").html("<option value='' class='display-none'>[[[Select a database]]]</option>").selectpicker("refresh");
            $("#txt-servername").val("");
            $("#txt-dbname").val("");
            $("#txt-login").val("");
            $("#txt-password-db").val("");            
        }
    });

    $("#check-windows").on("click change", function () {
        var windowsCheck = $("#check-windows").val() == "windows";
        var databaseType = $("#database-type").val();
        if (windowsCheck) {
            $("#txt-login").val("").attr("disabled", true);
            $("#txt-password-db").val("").attr("disabled", true);
        }
        else {
            $("#txt-login").attr("disabled", false);
            $("#txt-password-db").attr("disabled", false);
        }
        $(".has-error").removeClass("has-error");
        $(".validation-txt-errors").hide();
    });

    $('input[type=radio][name=databaseType]').change(function () {
        if ($(this).val() === "0") {
            $("#existing-db-form").addClass("display-none");
            $("#new-db-form").removeClass("display-none");
            $("#database-name").html("<option value='' class='display-none'>[[[Select a database]]]</option>").selectpicker("refresh");
            isNewDatabase = true;
        } else {
            $("#txt-dbname").val("");
            $("#existing-db-form").removeClass("display-none");
            $("#new-db-form").addClass("display-none");
            isNewDatabase = false;
        }
    });

    $.validator.addMethod("isValidDatabaseName", function (value, element) {
        if (/^[a-zA-Z_0-9@~!#\$\^&()+=\-,\.\/\{\} ]+$/.test(value) && !/^[\s]+|[\s]+$/g.test(value)) {
            return true;
        }
    }, "[[[Please avoid special characters, Leading and Trailing spaces]]]");

    $.validator.addMethod("sqlUsernamevalidation", function (value, element) {
        if (/^[a-zA-Z_0-9@`~!#\$\^%&*()+=\-\[\]\\\',\.\/\{\}\|:<>\? ]+$/.test(value) && !/^[\s]/g.test(value)) {
            return true;
        }
    }, "[[[Please avoid special characters and Leading spaces]]]");

    $.validator.addMethod("isValidCredentials", function (value, element) {
        return /^[a-zA-Z_0-9@`~!#\$\^%&*()+=\-\[\]\\\',\.\/\{\}\|:<>\? ]+$/.test(value);
    }, "[[[Please avoid special characters]]]");

    $("#db-content-holder").validate({
        errorElement: "span",
        onkeyup: function (element, event) {
            if (event.keyCode != 9) {
                isKeyUp = true;
                $(element).valid();
                isKeyUp = false;
            }
            else
                true;
        },
        onfocusout: function (element) { $(element).valid(); },
        rules: {
            servername: {
                isRequired: true
            },
            username: {
                required: true,
                sqlUsernamevalidation: true
            },
            password: {
                required: true,
                isValidCredentials: true
            },
            dbname: {
                required: {
                    depends: function () {
                        return ($("input[name='databaseType']:checked").val() === "0");
                    }
                },
                isValidDatabaseName: {
                    depends: function () {
                        return ($("input[name='databaseType']:checked").val() === "0");
                    }
                }
            }
        },
        highlight: function (element) {
            $(element).closest(".txt-holder").addClass("has-error");
            $(element).closest(".text-holder").addClass("has-error");
            $(element).parent().find(">.startup-validation").show();
        },
        unhighlight: function (element) {
            $(element).closest(".txt-holder").removeClass("has-error");
            $(element).closest(".text-holder").removeClass("has-error");
            $(element).parent().find(">.startup-validation").hide();
        },
        errorPlacement: function (error, element) {
            $(element).parent().find(">.startup-validation").html(error.html());
        },
        messages: {
            servername: {
                isRequired: "[[[Please enter server name]]]"
            },
            username: {
                required: "[[[Please enter username]]]"
            },
            password: {
                required: "[[[Please enter password]]]"
            },
            dbname: {
                required: "[[[Please enter the database name]]]"
            }
        }
    });

    $(document).on("click", ".databse-dropdown .dropdown-toggle", function () {
        $(".databse-dropdown ul").html("");
        $("#database-name").html("<option value='' class='display-none'>[[[Select a database]]]</option>").selectpicker("refresh");
        var iswindows = $("#check-windows").val() === "windows";
        if (!iswindows) {
            $("#txt-login").valid();
            $("#txt-servername").valid();
            $("#txt-password-db").valid();
            if ($("#txt-login").val() !== "" && $("#txt-servername").val() !== "" && $("#txt-password-db").val() !== "") {
                var canProceed = true;
            } else
                var canProceed = false;
        }
        else if ($("#txt-servername").valid()) {
            var canProceed = true;
        } else
            var canProceed = false;

        if (canProceed) {
            $("#waiting-icon").show();
            window.serverName = $("#txt-servername").val();
            window.IsWindowsAuthentication = $("#check-windows").val() == "windows";
            window.login = $("#txt-login").val();
            window.password = $("#txt-password-db").val();
            var databaseType = $("#database-type").val();
            window.databaseName = $("#txt-dbname").val();
            doAjaxPost("POST", getAllDatabaseUrl,
                {
                    data: JSON.stringify({ ServerType: databaseType, serverName: window.serverName, userName: window.login, password: window.password, IsWindowsAuthentication: window.IsWindowsAuthentication })
                },
                function (result) {
                    if (result.Data.key) {
                        $("#database-error").hide();
                        $("#connection-validation").addClass("display-none");
                        var items = result.Data.value;
                        var option = "";
                        if (items.length > 0) {
                            for (var t = 0; t < items.length; t++) {
                                option += '<option value=\"' + items[t] + '\">' + items[t] + "</option>";
                            }
                            $("#connection-validation").find(".validation-errors").html("");
                            $("#database-name").append(option).selectpicker("refresh");
                            for (var i = 0; i < $("#db-content-holder .databse-dropdown .bootstrap-select li a .text").length ; i++) {
                                var dbTitle = $("#db-content-holder .databse-dropdown .bootstrap-select li a .text").eq(i).text();
                                $("#db-content-holder .databse-dropdown .bootstrap-select li a").eq(i).attr("title", dbTitle);
                            }
                        } else {
                            $("#database-name").selectpicker("refresh").html("<option value='' class='display-none'>[[[Select a database]]]</option>").selectpicker("refresh");
                            $(".databse-dropdown ul").html("<li class='no-results active' title='[[[no database found]]]' style='display: list-item;'>[[[No database found]]]</li>");
                        }
                        $("#waiting-icon").hide();
                    } else {
                        $("#database-name").html("<option value='' class='display-none'>[[[Select a database]]]</option>").selectpicker("refresh");
                        $("#connection-validation").find(".validation-errors").html(result.Data.value).css("display", "block");
                        $("#waiting-icon").hide();
                    }
                }
            );
        }
    });

    function createNewDatabase() {
        $(".has-error").removeClass("has-error");
        $(".validation-txt-errors").hide();
        $(".validation-errors").html("");
        $("#connection-validation").addClass("display-none");
        $("#update-datastore-settings").prop("disabled", true);
        var canProceed = $("#db-content-holder").valid();
        if (canProceed) {
            $("#content-area").ejWaitingPopup("show");
            window.serverName = $("#txt-servername").val();
            window.IsWindowsAuthentication = $("#check-windows").val() == "windows";
            window.login = $("#txt-login").val();
            window.password = $("#txt-password-db").val();
            var databaseType = "MSSQL";//$("#database-type").val();
            window.databaseName = $("#txt-dbname").val();
            doAjaxPost("POST", connectDatabaseUrl,
                {
                    data: JSON.stringify({ ServerType: databaseType, serverName: window.serverName, userName: window.login, password: window.password, IsWindowsAuthentication: window.IsWindowsAuthentication, databaseName: window.databaseName })
                },
                function (result) {
                    if (result.Data.key) {
                        doAjaxPost("POST", generateIntermediateDatabaseUrl,
                            {
                                data: JSON.stringify({ ServerType: databaseType, serverName: window.serverName, userName: window.login, password: window.password, IsWindowsAuthentication: window.IsWindowsAuthentication, databaseName: window.databaseName, Prefix: "" })
                            },
                            function (result) {
                                if (result.Data.key) {
                                    $(".selected").removeClass("selected");
                                    window.connectionString = result.Data.value;
                                    doAjaxPost("POST", updateIntermediateDBUrl,
                                        {
                                            data: JSON.stringify({ ServerType: databaseType, serverName: window.serverName, userName: window.login, password: window.password, IsWindowsAuthentication: window.IsWindowsAuthentication, databaseName: window.databaseName, Prefix:"" })
                                        },
                                        function (result) {
                                            if (result.Data.key) {
                                                SuccessAlert("[[[Database Settings]]]", "[[[Settings have been updated successfully.]]]", 7000);
                                            }
                                            else {
                                                WarningAlert("[[[Database Settings]]]", "[[[Error while updating settings.]]]", 7000);
                                            }
                                            $("#content-area").ejWaitingPopup("hide");
                                        });
                                    $("#txt-username").focus();
                                    delete window.serverName;
                                    delete window.login;
                                    delete window.password;
                                    delete window.databaseName;
                                }
                                else {
                                    $("#content-area").ejWaitingPopup("hide");
                                    $("#connection-validation").removeClass("display-none");
                                    $("#connection-validation").find(".validation-errors").html(result.Data.value).css("display", "block");
                                }
                            }
                        );
                        $("#txt-dbname").focus();
                    }
                    else {
                        $("#content-area").ejWaitingPopup("hide");
                        $("#connection-validation").removeClass("display-none");
                        $("#connection-validation").find(".validation-errors").html(result.Data.value).css("display", "block");
                    }
                }

                
            );
        }
    }

    $("#update-datastore-settings").on("click", function () {
        if (isNewDatabase) {
            createNewDatabase();
            $("#update-datastore-settings").prop("disabled", false);
        }
        else {
            $(".has-error").removeClass("has-error");
            $(".validation-txt-errors").hide();
            $(".validation-errors").html("");
            $("#connection-validation").addClass("display-none");
            var canProceed = $("#db-content-holder").valid();
            if ($("#database-name").val() == "") {
                $("#database-error").html("[[[Please select a database]]]").show();
                return;
            }
            if (canProceed) {
                $("#content-area").ejWaitingPopup("show");
                $("#update-datastore-settings").prop("disabled", true);
                window.serverName = $("#txt-servername").val();
                window.IsWindowsAuthentication = $("#check-windows").val() == "windows";
                window.login = $("#txt-login").val();
                window.password = $("#txt-password-db").val();
                var databaseType = "MSSQL"; //$("#database-type").val();
                databaseType = databaseType == "SQLite" ? "MSSQLCE" : databaseType;
                window.databaseName = $("#database-name").val() == "" ? $("#txt-dbname").val() : $("#database-name").val();
                //if (databaseType == "MSSQL") {
                    doAjaxPost("POST", connectDatabaseUrl,
               {
                   data: JSON.stringify({ ServerType: databaseType, serverName: window.serverName, userName: window.login, password: window.password, IsWindowsAuthentication: window.IsWindowsAuthentication, databaseName: window.databaseName })
               },
               function (result) {
                   if (result.Data.key) {
                       doAjaxPost("POST", updateIntermediateDBUrl,
                           {
                               data: JSON.stringify({ ServerType: databaseType, serverName: window.serverName, userName: window.login, password: window.password, IsWindowsAuthentication: window.IsWindowsAuthentication, databaseName: window.databaseName, Prefix: "" })
                           },
                           function (result) {
                               if (result.Data.key) {
                                   SuccessAlert("[[[Database Settings]]]", "[[[Settings have been updated successfully.]]]", 7000);
                               }
                               else {
                                   WarningAlert("[[[Database Settings]]]", "[[[Error while updating settings.]]]", 7000);
                               }
                               $("#update-datastore-settings").prop("disabled", false);
                               $("#content-area").ejWaitingPopup("hide");
                           });
                       delete window.serverName;
                       delete window.login;
                       delete window.password;
                       delete window.databaseName;
                   }
                   else {
                       $("#update-datastore-settings").prop("disabled", false);
                       $("#connection-validation").removeClass("display-none");
                       $("#connection-validation").find(".validation-errors").html(result.Data.value).css("display", "block");
                       $("#content-area").ejWaitingPopup("hide");
                   }
               })
                //}
                //else {
                //    doAjaxPost("POST", updateIntermediateDBUrl,
                //           {
                //               data: JSON.stringify({ ServerType: databaseType, serverName: window.serverName, userName: window.login, password: window.password, IsWindowsAuthentication: window.IsWindowsAuthentication, databaseName: window.databaseName, Prefix: "" })
                //           },
                //           function (result) {
                //               if (result.Data.key) {
                //                   SuccessAlert("[[[Database Settings]]]", "[[[Settings have been updated successfully.]]]", 7000);
                //               }
                //               else {
                //                   WarningAlert("[[[Database Settings]]]", "[[[Error while updating settings.]]]", 7000);
                //               }
                //               $("#update-datastore-settings").prop("disabled", false);
                //               $("#content-area").ejWaitingPopup("hide");
                //           });
                //}
                
            }
        }
    });

    $("#help_text").on("click", function () {
        $("#ssl-help-message").toggle();
    });

    $("#UpdateSystemSettings,#UpdateSystemSettings-bottom,#UpdateDatabaseSettings-bottom,#update-mail-settings").on("click", function () {
        var messageHeader = $(this).hasClass("update-system-settings") ? "Site Settings" : "Email Settings";
        var enableSecureMail = $("#secure-mail-authentication").is(":checked");
        RemoveUploadBoxError();
        if (!$("#look-and-feel-form").valid() || !$("#email-setting-form").valid()) {
            return;
        }

        var isUrlChange = false;
        if ($("#site_url").attr("data-original-value") != $("#site_url").val()) {
            isUrlChange = true;
        }
        var isReloadPage = false;
        if ($("#enable-ssl").val() != $("#scheme_value").attr("data-value") || $("#site_url").attr("data-original-value") !== $("#site_url").val()) {
            isReloadPage = true;
        }
        var siteURL = $("#site_url").val();
        var isMailSettingsChanged = false;
        var isMailPasswordChanged = false;
        var mailSettings = new Object;
        if (parseInt($("#port-number").val()) != window.SystemSettingsProperties.MailSettingsPort
            || $("#smtp-address").val() != window.SystemSettingsProperties.MailSettingsHost
            || $("#mail-display-name").val() != window.SystemSettingsProperties.MailSettingsSenderName
            || $("#mail-user-name").val() != window.SystemSettingsProperties.MailSettingsAddress
            || enableSecureMail != window.SystemSettingsProperties.MailSettingsIsSecureAuthentication) {
            isMailSettingsChanged = true;

            mailSettings = {
                Address: $("#mail-user-name").val(),
                Password: $("#mail_password").val(),
                Host: $("#smtp-address").val(),
                SenderName: $("#mail-display-name").val(),
                Port: parseInt($("#port-number").val()),
                IsSecureAuthentication: enableSecureMail
            }
        }

        if ($("#mail-password").val() !== "") {
            isMailPasswordChanged = true;
        }

        var systemSettingsData = {
            OrganizationName: $("#site-orgname").val(),
            LoginLogo: window.SystemSettingsProperties.LoginLogo,
            MainScreenLogo: window.SystemSettingsProperties.MainScreenLogo,
            FavIcon: window.SystemSettingsProperties.FavIcon,
            WelcomeNoteText: $("#txt_welcome_note").val(),
            TimeZone: $("#time-zone").val(),
            DateFormat: $("input:radio[name=date_format]:checked").val(),
            MailSettingsAddress: $("#mail-user-name").val(),
            MailSettingsAuthType: parseInt($("#mail-authentication-type").val()),
            MailSettingsUserName: parseInt($("#mail-authentication-type").val()) === 1 ? $("#sender-user-name").val() : "",
            MailSettingsPassword: parseInt($("#mail-authentication-type").val()) === 1 ? $("#mail-password").val() : "",
            MailSettingsHost: $("#smtp-address").val(),
            MailSettingsSenderName: $("#mail-display-name").val(),
            MailSettingsPort: parseInt($("#port-number").val()),
            MailSettingsIsSecureAuthentication: enableSecureMail,
            BaseUrl: $("#enable-ssl").val() + "://" + $("#site_url").val(),
            MachineName: $("#machineName").val(),
            HostDomain: $("#hostDomain").val(),
            IsSecureConnection: $("#enable-ssl").val() === "https",
            Language: $("#language").val(),
            IsEnablePoweredBySyncfusion: $("#enablepoweredbysyncfusion").is(":checked"),
            IsEnableCopyrightInfo: $("#enablecopyrightinfo").is(":checked"),
            IsShowServerVersion: $("#enableserverversioninfo").is(":checked"),
            TimeFormat: $("#time_format").is(":checked")
            };

        $.ajax({
            type: "POST",
            url: window.updateSystemSettingsUrl,
            data: { systemSettingsData: JSON.stringify(systemSettingsData) },
            beforeSend: showWaitingPopup($("#server-app-container")),
            success: function (result) {
                if (isReloadPage) {
                    if (isUrlChange) {
                        window.location.href = $("#enable-ssl").val() + "://" + siteURL + "/administration";
                    }
                    else {
                        window.location.href = $("#enable-ssl").val() + "://" + location.host + location.pathname;
                    }
                } else {
                    $("#main_screen_logo a img").attr("src", window.baseRootUrl + "/Content/Images/Application/" + systemSettingsData.MainScreenLogo);
                    var link = document.createElement("link");
                    link.type = "image/x-icon";
                    link.rel = "shortcut icon";
                    link.href = window.baseRootUrl + "/Content/Images/Application/" + systemSettingsData.FavIcon;
                    document.getElementsByTagName("head")[0].appendChild(link);
                    var pageTitle = $("#site-orgname").val() + " - " + document.title.split("-")[1];
                    document.title = pageTitle;
                }

                if (result.status) {
                   if($("#enablepoweredbysyncfusion").is(":checked")){
                            $("#poweredbysyncfusion").removeClass("hide").addClass("show");
                        } else {
                            $("#poweredbysyncfusion").removeClass("show").addClass("hide");
                        }
                   if ($("#enablecopyrightinfo").is(":checked")) {
                            $("#copyrightinfo").removeClass("hide").addClass("show");
                        } else {
                            $("#copyrightinfo").removeClass("show").addClass("hide");
                        }
                   if ($("#enablepoweredbysyncfusion").is(":checked") && $("#enablecopyrightinfo").is(":checked")) {
                            $("#footer-separator").removeClass("hide").addClass("show");
                        } else {
                            $("#footer-separator").removeClass("show").addClass("hide");
                    }
                    if ($("#enableserverversioninfo").is(":checked") == false) {
                        $("#serverversioninfo").removeClass("show").hide();                        
                    }
                    else {
                        $("#serverversioninfo").removeClass("hide").show();                        
                    }    
                    if ($("#enablepoweredbysyncfusion").is(":checked") && $("#enableserverversioninfo").is(":checked")) {
                        $("#footer-separator-server-version").removeClass("hide").show();
                    } else {
                        $("#footer-separator-server-version").removeClass("show").hide();
                    }
                    SuccessAlert(messageHeader, "[[[Settings has been updated successfully.]]]", 7000);
                    SetCookie();
                } else {
                    WarningAlert(messageHeader, "[[[Error while updating settings.]]]", 7000);
                    $(".error-message, .success-message").css("display", "none");
                }
                hideWaitingPopup($("#server-app-container"));
            }
        });
    });

    $(document).on("click", "#time_format", function () {
        if ($("#time_format").is(":checked")) {
            $(".time").html("[[[13:00]]]");
        } else {
            $(".time").html("[[[1:00 PM]]]");
        }
    });
    $("#update-ump-settings").on("click", function () {
        var postData = {
            umsUrl: $("#umpurl").val().trim(),
            clientId: $("#clientid").val().trim(),
            clientSecret: $("#clientsecret").val().trim()
        };

        $.ajax({
            type: "POST",
            url: window.updateUmsSettingsUrl,
            data: postData,
            beforeSend: showWaitingPopup($("#server-app-container")),
            success: function (result) {
                if (result.status) {
                    SuccessAlert("[[[UMS Settings]]]", "[[[Settings has been updated successfully.]]]", 7000);
                }
                else {
                    WarningAlert("[[[UMS Settings]]]", "[[[Error while updating settings.]]]", 7000);
                }
                $(".error-message, .success-message").css("display", "none");
            },
            complete: function () {
                hideWaitingPopup($("#server-app-container"));
            }
        });
    });

    $.validator.addMethod("isValidUrl", function (value, element) {
        var givenUrl = $("#enable-ssl").val() + "://" + $("#site_url").val();
        var url = parseURL(givenUrl);
        if (isValidUrl(value) == false || parseInt(url.port) > 65535)
            return false;
        else
            return true;
    }, "[[[Please enter valid URL]]]");

    $.validator.addMethod("isRequired", function (value, element) {
        return !isEmptyOrWhitespace(value);
    }, "[[[Please enter the name]]]");

    $.validator.addMethod("isValidName", function (value, element) {
        return IsValidName("name", value);
    }, "[[[Please avoid special characters]]]");

    $.validator.addMethod("isValidEmail", function (value, element) {
        return IsEmail(value);
    }, "[[[Invalid email address]]]");

    $("#look-and-feel-form").validate({
        errorElement: "span",
        onkeyup: function (element, event) {
            if (event.keyCode !== 9)
                $(element).valid();
            else
                true;
        },
        onfocusout: function (element) { $(element).valid(); },
        rules: {
            "site_url": {
                isRequired: true,
                isValidUrl: true
            }
        },
        highlight: function (element) {
            $(element).closest("div").addClass("has-error");
        },
        unhighlight: function (element) {
            $(element).closest("div").removeClass("has-error");
            $(element).parent().parent().next().next().find("span.validation-errors").html("");
        },
        errorPlacement: function (error, element) {
            $(element).parent().parent().next().next().find("span.validation-errors").html(error);
        },
        messages: {
            "site_url": {
                isRequired: "[[[Please enter URL]]]"
            }
        }
    });

    $("#email-setting-form").validate({
        errorElement: "span",
        onkeyup: function (element, event) {
            if (event.keyCode != 9) {
                isKeyUp = true;
                if (element.id !== "mail-password") {
                    $(element).valid();
                }
                else {
                    if ($(element).val() !== "") {
                        $(element).valid();
                    }
                }
                isKeyUp = false;
            }
            else
                true;
        },
        onfocusout: function (element) {
            if (element.id !== "mail-password") {
                $(element).valid();
            }
            else {
                if ($(element).val() === "") {
                    $(element).valid();
                }
            }
        },
        rules: {
            "smtp_address": {
                isRequired: true
            },
            "port_number": {
                isRequired: true
            },
            "mail_display_name": {
                isRequired: true,
                isValidName: true
            },
            "mail_user_name": {
                isRequired: true,
                isValidEmail: true
            },
            "mail_password": {
                required: true
            },
            "sender_user_name": {
                required: true
            }
        },
        highlight: function (element) {
            $(element).closest(".form-group").addClass("has-error");
        },
        unhighlight: function (element) {
            $(element).closest(".form-group").removeClass("has-error");
            $(element).parent().find("span.validation-errors").html("");
        },
        errorPlacement: function (error, element) {
            $(element).parent().find("span.validation-errors").html(error);
        },
        messages: {
            "smtp_address": {
                isRequired: "[[[Please enter SMTP server]]]"
            },
            "port_number": {
                isRequired: "[[[Please enter SMTP port]]]"
            },
            "mail_display_name": {
                isRequired: "[[[Please enter sender name]]]"
            },
            "mail_user_name": {
                isRequired: "[[[Please enter sender email address]]]"
            },
            "mail_password": {
                required: "[[[Please enter password]]]"
            },
            "sender_user_name": {
                required: "[[[Please enter username]]]"
            }
        }
    });

    $(document).on("change", "#mail-password , #sender-user-name",function () {
        if ($("#mail-password").val() !== "" )
            $("#mail-password-error").remove();
        if ($("#sender-user-name").val() !== "")
            $("#sender-user-name-error").remove();
            });
  

    $(document).ready(function () {
        if ($("#active-directory-container").is(":visible")) {         
             if (location.href.match(/ump-settings-tab/)) {
                $("#ump-tab").tab("show");          
            }
        }
    });

    $(document).on("change", "#enablepoweredbysyncfusion", function () {
        if ($("#enablepoweredbysyncfusion").is(":checked") == false) {
            $("#poweredbysyncfusion").removeClass("show").hide();
        }
        else {
            $("#poweredbysyncfusion").removeClass("hide").show();
        }
        if ($("#enablepoweredbysyncfusion").is(":checked") && $("#enableserverversioninfo").is(":checked")) {
            $("#footer-separator-server-version").removeClass("hide").show();
        } else {
            $("#footer-separator-server-version").removeClass("show").hide();
        }
    });

    $(document).on("change", "#enablecopyrightinfo", function () {
        if ($("#enablecopyrightinfo").is(":checked") == false) {
            $("#copyrightinfo").removeClass("show").hide();
        }
        else {
            $("#copyrightinfo").removeClass("hide").show();
        }
        addFooterSeparator();
    });

    $(document).on("change", "#enableserverversioninfo", function () {
        if ($("#enableserverversioninfo").is(":checked") == false) {
            $("#serverversioninfo").removeClass("show").hide();
        }
        else {
            $("#serverversioninfo").removeClass("hide").show();
        }
        if ($("#enablepoweredbysyncfusion").is(":checked") && $("#enableserverversioninfo").is(":checked")) {
            $("#footer-separator-server-version").removeClass("hide").show();
        } else {
            $("#footer-separator-server-version").removeClass("show").hide();
        }
    });

    $("#mail-authentication-type").selectpicker("refresh");
});

$(document).on("change", "#secure-mail-authentication", function () {
    getEmailPassword();
});

$(document).on("change", "#mail-authentication-type", function () {
    var authTextBoxes = $(".mail-credentials");

    if (parseInt($(this).val()) === 1) {
        authTextBoxes.removeAttr("disabled");
    } else {
        authTextBoxes.attr("disabled", "disabled").val("").parent().parent().removeClass("has-error");
        authTextBoxes.siblings(".validation-errors").text("");
    }
});

$(document).on("mouseenter", ".highlight-image", function () {
    var image = $(this).attr("data-image").toLowerCase();

    $("#image-container").find(".tooltip-container[data-image='" + image + "']").tooltip("show");
});

$(document).on("mouseleave", ".highlight-image", function () {
    var image = $(this).attr("data-image").toLowerCase();

    $("#image-container").find(".tooltip-container[data-image='" + image + "']").tooltip("hide");
});

$(document).on("mouseenter", ".tooltip-container", function () {
    var image = $(this).attr("data-image").toLowerCase();

    $(".highlight-image[data-image='" + image + "']").find(".form-control, .input-group-addon").css({ "border-color": "#009AEF", "box-shadow": "0 2px 2px 2px #E8F9FF" });
});

$(document).on("mouseleave", ".tooltip-container", function () {
    var image = $(this).attr("data-image").toLowerCase();

    $(".highlight-image[data-image='" + image + "']").find(".form-control, .input-group-addon").removeAttr("style");
});

function UmsSettingsFormValidate() {
    var postData = {
        umsUrl: $("#umpurl").val().trim(),
        clientId: $("#clientid").val().trim(),
        clientSecret: $("#clientsecret").val().trim()
    };

    $.ajax({
        type: "POST",
        url: window.umsTestConnectionUrl,
        data: postData,
        beforeSend: showWaitingPopup($("#server-app-container")),
        success: function (data) {
            var umsSettings = $("#ump-settings");
            if (data.status) {
                umsSettings.find(".success-message").html("<span style='color:green'>" + data.value + "</span>").css("display", "block");
                umsSettings.find(".error-message").css("display", "none");
            }
            else {
                umsSettings.find(".error-message").html("<span style='color:red'>" + data.value + "</span>").css("display", "block");;
                umsSettings.find(".success-message").css("display", "none");
            }
        },
        complete: function () {
            hideWaitingPopup($("#server-app-container"));
        }
    });
}

function RemoveUploadBoxError() {
    $("#upload-login-image-textbox").removeClass("ValidationErrorImage").val("[[[Browse file path]]]");
    $("#upload-login-image-textbox").closest("div").removeClass("has-error");
    $("#upload-login-image-textbox").parent().find(".e-box").removeClass("upload-error-border");
    $("#upload-main-screen-image-textbox").removeClass("ValidationErrorImage").val("[[[Browse file path]]]");
    $("#upload-main-screen-image-textbox").closest("div").removeClass("has-error");
    $("#upload-main-screen-image-textbox").parent().find(".e-box").removeClass("upload-error-border");
    $("#upload-favicon-image-textbox").removeClass("ValidationErrorImage").val("[[[Browse file path]]]");
    $("#upload-favicon-image-textbox").closest("div").removeClass("has-error");
    $("#upload-favicon-image-textbox").parent().find(".e-box").removeClass("upload-error-border");
}

function parseURL(str) {
    var o = parseURL.options,
		m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
		uri = {},
		i = 14;

    while (i--) uri[o.key[i]] = m[i] || "";

    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
        if ($1) uri[o.q.name][$1] = $2;
    });

    return uri;
};

parseURL.options = {
    strictMode: true,
    key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
    q: {
        name: "queryKey",
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
};

function SetCookie() {
    if ($("#lang_tag").val() !== $("#language").val()) {
        $.ajax({
            type: "POST",
            url: window.setLanguageUrl,
            data: { langtag: $("#language").val(), returnUrl: $("#return_url").val() + "/administration" },
            success: function (result) {
                window.location.href = result.Data;
            }
        });
    }
}



function getEmailPassword() {
    var mailPassword = $("#mail-password");
    if (mailPassword.val() === "") {
        if (parseInt($("#port-number").val()) !== window.SystemSettingsProperties.MailSettingsPort ||
            $("#smtp-address").val() !== window.SystemSettingsProperties.MailSettingsHost ||
            $("#mail-display-name").val() !== window.SystemSettingsProperties.MailSettingsSenderName ||
            $("#mail-user-name").val() !== window.SystemSettingsProperties.MailSettingsAddress ||
            $("#secure-mail-authentication").is(":checked") !== window.SystemSettingsProperties.MailSettingsIsSecureAuthentication) {
            mailPassword.attr("placeholder", "[[[Password]]]").siblings(".placeholder").html("[[[Password]]]");
        } else {
            mailPassword.attr("placeholder", "●●●●●●●●").siblings(".placeholder").html("●●●●●●●●");
        }
    }
}

function addPlacehoder(object) {
    if (regexIe8.test(userAgent)) {
        $(object).find("input[type=text][class!='hidden-input'],input[type=password][class!='hidden-input'],textarea[id='txt_welcome_note']").each(function () {
            if ($(this).val() === "") {
                $($("<div>", { "class": "placeholder", text: $(this).attr("placeholder") })).insertAfter(this).show();
            }
            else {
                $($("<div>", { "class": "placeholder", text: $(this).attr("placeholder"), "style":"display:block" })).insertAfter(this).hide();
            }
        });
    }
}

function addFooterSeparator() {
    if ($("#enablepoweredbysyncfusion").is(":checked") == true && $("#enablecopyrightinfo").is(":checked") == true) {
        $("#footer-separator").removeClass("hide").show();
    }
    else {
        $("#footer-separator").removeClass("show").hide();
    }
}