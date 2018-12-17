function getRelativePath(commentText) {
    var itemType = $("#itemType").attr("data-item-type").toLowerCase().replace(/\b[a-z]/g, function (letter) {
        return letter.toUpperCase();
    });
    var stringMatches = commentText.match(/(?:\!\[\]\((.*?)\))/g);
    var tag = [];
    if (stringMatches != null) {
        for (var j = 0; j < stringMatches.length; j++) {
            tag[j] = stringMatches[j].split(/[\(\\!\[\ \]\\)\s]+/);
            tag[j] = $.grep(tag[j], function (n) {
                return (n);
            });
        }
    }
    return commentText;
}

function renderMde(id) {
    var simplemde = new SimpleMDE({
        element: $(id)[0],
        status: false,
        spellChecker: false,
        autoDownloadFontAwesome: false,
        toolbar: [{
            name: "bold",
            action: SimpleMDE.toggleBold,
            className: "su su-bold",
            title: "[[[Bold]]]",
        },
        {
            name: "italic",
            action: SimpleMDE.toggleItalic,
            className: "su su-italic",
            title: "[[[Italic]]]",
        },
        {
            name: "heading",
            action: SimpleMDE.toggleHeadingSmaller,
            className: "su su-header",
            title: "[[[Heading]]]",
        },
        "|",
        {
            name: "quote",
            action: SimpleMDE.toggleBlockquote,
            className: "su su-quote",
            title: "[[[Quote]]]",
        },
        {
            name: "unordered-list",
            action: SimpleMDE.toggleUnorderedList,
            className: "su su-list-ul",
            title: "[[[Generic List]]]",
        },
        {
            name: "ordered-list",
            action: SimpleMDE.toggleOrderedList,
            className: "su su-list-ol",
            title: "[[[Numbered List]]]",
        },
        "|",
        {
            name: "link",
            action: SimpleMDE.drawLink,
            className: "su su-link",
            title: "[[[Create Link]]]",
        },
        {
            name: "image",
            action: SimpleMDE.drawImage,
            className: "su su-image",
            title: "[[[Insert Image]]]",
        },
        {
            name: "preview",
            action: SimpleMDE.togglePreview,
            className: "su su-preview no-disable",
            title: "[[[Toggle Preview]]]",
        }
        ],
        previewRender: function (plainText) {
            return customMarkdownParser(plainText); // Returns HTML from a custom parser
        },
    });
    $('.su-upload-image').attr('id') == 'comment-image-file' ? $(".su-upload-image").attr('id', 'comment-image-edit-file') : $(".su-upload-image").attr('id', 'comment-image-file');
    return simplemde;
}

function customMarkdownParser(plainText) {
    var userStringMatches = [];
    var groupStringMatches = [];
    var allStringMatches = [];
    var userRegex = /(?:\@\ (.*?)\ )/g;
    var groupRegex = /(?:\@\ (.*?)\ )/g;
    var allregex = /(@all)/g;
    
    var itemType = $("#itemType").attr("data-item-type").toLowerCase().replace(/\b[a-z]/g, function (letter) {
        return letter.toUpperCase();
    });
    var simplemde = new SimpleMDE({
        element: $("#temp")[0],
        spellChecker: false,
        autoDownloadFontAwesome: false,
    });
    var htmlText = plainText;
    userStringMatches = htmlText.match(userRegex);
    if (userStringMatches != null) {
        userStringMatches = jQuery.unique(userStringMatches);
        for (var j = 0; j < userStringMatches.length; j++) {
            var regex = new RegExp(userStringMatches[j], 'g');
            htmlText = htmlText.replace(regex, "<span class='cm-usercontainer'>" + userStringMatches[j] + "</span>");
        }
    }
    groupStringMatches = htmlText.match(groupRegex);
    if (groupStringMatches != null) {
        groupStringMatches = jQuery.unique(htmlText.match(groupRegex));
        for (var j = 0; j < groupStringMatches.length; j++) {
            var regex = new RegExp(groupStringMatches[j], 'g');
            htmlText = htmlText.replace(regex, "<span class='cm-groupcontainer'>" + groupStringMatches[j] + "</span>");
        }
    }
    allStringMatches = htmlText.match(allregex);
    if (allStringMatches != null) {
        allStringMatches = jQuery.unique(allStringMatches);
        for (var j = 0; j < allStringMatches.length; j++) {
            var regex = new RegExp(allStringMatches[j], 'g');
            htmlText = htmlText.replace(allStringMatches[j], "<span class='cm-allcontainer'>" + allStringMatches[j] + "</span>");
        }
    }
    htmlText = simplemde.options.previewRender(htmlText);
    $("#toRemoveCulture").html(htmlText);
    splitter = window.location.href.split("/")[3] + "/";
    var anchors = $('#toRemoveCulture a');
    for (var i = 0; i < anchors.length; i++) {
        anchors[i].setAttribute('target', '_blank');
        anchors[i].href = anchors[i].href.split(splitter)[1];
    }
    htmlText = $("#toRemoveCulture").html();
    return htmlText;
}

