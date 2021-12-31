// document.getElementById('searchnote').addEventListener('input', (event) => {
//     find() //it focuses on the note ;(
//   });
$(searchnote).on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        find();
    }
    if (e.key == "Escape") hidefind();
});
$(replacement).on('keyup', function (e) {
    if (e.key == "Escape") hidereplace();
});

var findbox = document.getElementById("findbox");
var search = document.getElementById("searchnote");
var replace = document.getElementById("replacement");
var searchx = document.getElementById("searchnotex");
var replacex = document.getElementById("replacementx");
var searchbtn = document.getElementById("searchnotebtn");
var replacebox = document.getElementById("replacebox");
var findbutton = document.getElementById("findbutton");

var notearea = document.getElementById("notearea");

function showfind() {
    var s = notearea.selectionStart;
    var e = notearea.selectionEnd;
    search.value = notearea.value.substring(s,e);
    findbox.style.display = "block";
    search.focus();
}

function hidefind() {
    findbox.style.removeProperty('display');
}
function showreplace() {
    findbutton.style.borderRadius = "0 5px 0 0"
    search.style.borderRadius = "5px 0 0 0"
    replace.style.borderRadius = "0 0 0 5px"
    searchx.style.display = "none"
    replacex.style.borderRadius = "0 5px 5px 0"
    searchbtn.style.display = "none"
    replacebox.style.display = "block"
    replacebox.style.marginTop = "-1px"
}
function hidereplace() {
    findbutton.style.borderRadius = "0"
    search.style.borderRadius = "5px 0 0 5px"
    searchx.style.removeProperty('display');
    searchbtn.style.removeProperty('display');
    replacebox.style.removeProperty('display');
}

document.addEventListener("keydown", function (zEvent) {
    if (zEvent.ctrlKey && zEvent.key == "f") {
        zEvent.preventDefault();
        showfind();
    }
});

function findinputClose(e) {
    if (e.key == "Escape") hidefind();
};

function replaceInNote() {
    var str = notearea.value;
    var n = str.replace(search.value, replace.value);
    notearea.value = n;
    $('.notearea').highlightWithinTextarea({
        highlight: replace.value
    });
}

function find() {
    var noteareatext = $("#notearea").val();
    var strSearchTerm = $("#searchnote").val();
    noteareatext = noteareatext.toLowerCase();
    strSearchTerm = strSearchTerm.toLowerCase();
    var cursorPos = ($("#notearea").getCursorPosEnd());
    var termPos = noteareatext.indexOf(strSearchTerm, cursorPos);
    if (termPos != -1) {
        $("#notearea").selectRange(termPos, termPos + strSearchTerm.length);
    } else {
        termPos = noteareatext.indexOf(strSearchTerm);
        if (termPos != -1) {
            $("#notearea").selectRange(termPos, termPos + strSearchTerm.length);
        } else {
            SendTooltip("not found");
        }
    }
};

function findAndReplace() {
    var noteareatext = $("#notearea").val();
    var strSearchTerm = $("#searchnote").val();
    var origTxt = $("#notearea").val();
    var isCaseSensitive = false;//($("#caseSensitive").attr('checked') == 'checked') ? true : false;
    var strReplaceWith = $("#replacement").val();
    var termPos;
    if (isCaseSensitive == false) {
        noteareatext = noteareatext.toLowerCase();
        strSearchTerm = strSearchTerm.toLowerCase();
    }
    var cursorPos = ($("#notearea").getCursorPosEnd());
    var termPos = noteareatext.indexOf(strSearchTerm, cursorPos);
    var newText = '';
    if (termPos != -1) {
        newText = origTxt.substring(0, termPos) + strReplaceWith + origTxt.substring(termPos + strSearchTerm.length, origTxt.length)
        $("#notearea").val(newText);
        $("#notearea").selectRange(termPos, termPos + strReplaceWith.length);
    } else {
        // not found from cursor pos, so start from beginning
        termPos = noteareatext.indexOf(strSearchTerm);
        if (termPos != -1) {
            newText = origTxt.substring(0, termPos) + strReplaceWith + origTxt.substring(termPos + strSearchTerm.length, origTxt.length)
            $("#notearea").val(newText);
            $("#notearea").selectRange(termPos, termPos + strReplaceWith.length);
        } else {
            SendTooltip("not found");
        }
    }
};
//unused
function replaceAll() {
    var noteareatext = $("#notearea").val();
    var strSearchTerm = $("#searchnote").val();
    var origTxt = $("#notearea").val();
    var isCaseSensitive = false;//($("#caseSensitive").attr('checked') == 'checked') ? true : false;
    var strReplaceWith = $("#replacement").val();
    if (isCaseSensitive == false) {
        noteareatext = noteareatext.toLowerCase();
        strSearchTerm = strSearchTerm.toLowerCase();
    }
    var matches = [];
    var pos = noteareatext.indexOf(strSearchTerm);
    while (pos > -1) {
        matches.push(pos);
        pos = noteareatext.indexOf(strSearchTerm, pos + 1);
    }
    for (var match in matches) {
        findAndReplace();
    }
};
$.fn.selectRange = function (start, end) {
    return this.each(function () {
        if (this.setSelectionRange) {
            this.focus();
            this.setSelectionRange(start, end);
        } else if (this.createTextRange) {
            var range = this.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    });
};
$.fn.getCursorPosEnd = function () {
    var pos = 0;
    var input = this.get(0);
    if (document.selection) {
        input.focus();
        var sel = document.selection.createRange();
        pos = sel.text.length;
    }
    else if (input.selectionStart || input.selectionStart == '0')
        pos = input.selectionEnd;
    return pos;
};