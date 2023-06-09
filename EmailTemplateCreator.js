
var htmlContent = document.querySelector(".html-content");
var editorContent = document.querySelector(".editor");


syncEditorToHtml();

editorContent.addEventListener("input", function() {
	syncEditorToHtml();
}, false);


function syncHtmlToEditor() {
	var textSource = htmlContent.textContent;
	editorContent.style.display = "block";	
	editorContent.innerHTML = textSource;
}

function syncEditorToHtml() {
	var htmlSource = editorContent.innerHTML;
	var splitLines = htmlSource.replace("</p>", "</p>\n").split("</p>");

    console.log(splitLines);
	htmlContent.innerHTML = "";
	$.each(splitLines, function(splitLine){
		var div = document.createElement("div");
		div.classList.add("cm-line");
        var stringVal = splitLines[splitLine];
        var addClosingParagraph = "";
        if(stringVal.indexOf("<p>") > -1) {
            addClosingParagraph = "</p>";
        }
        console.log("add closing? for" + stringVal + " - closing? " + addClosingParagraph)
		div.innerText = stringVal  + addClosingParagraph;
		htmlContent.append(div);

	});

	htmlContent.style.display = "block";

}

function link() {
    var url = prompt("Enter the URL");
    document.execCommand("createLink", false, url);
}

function copy() {
    document.execCommand("copy", false, "");
}

function changeColor() {
    var color = prompt("Enter your color in hex ex:#f1f233");
    document.execCommand("foreColor", false, color);
}


function getImage() {
    var file = document.querySelector("input[type=file]").files[0];

    var reader = new FileReader();

    let dataURI;

    reader.addEventListener(
        "load",
        function() {
            dataURI = reader.result;

            const img = document.createElement("img");
            img.src = dataURI;
            editorContent.appendChild(img);
        },
        false
    );

    if (file) {
        console.log("s");
        reader.readAsDataURL(file);
    }
}

function printMe() {    
	window.print();
	return false;  
}


// RESIZABLE -----------------------------------------


// Query the element
const resizer = document.getElementById('dragMe');
const leftSide = resizer.previousElementSibling;
const rightSide = resizer.nextElementSibling;

// The current position of mouse
let x = 0;
let y = 0;

// Width of left side
let leftWidth = 0;

// Handle the mousedown event
// that's triggered when user drags the resizer
const mouseDownHandler = function (e) {
    // Get the current mouse position
    x = e.clientX;
    y = e.clientY;
    leftWidth = leftSide.getBoundingClientRect().width;

    // Attach the listeners to `document`
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
};

const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dx = e.clientX - x;
    const dy = e.clientY - y;

    const newLeftWidth = ((leftWidth + dx) * 100) / resizer.parentNode.getBoundingClientRect().width;
    leftSide.style.width = `${newLeftWidth}%`;
};

const mouseUpHandler = function () {
    resizer.style.removeProperty('cursor');
    document.body.style.removeProperty('cursor');

    leftSide.style.removeProperty('user-select');
    leftSide.style.removeProperty('pointer-events');

    rightSide.style.removeProperty('user-select');
    rightSide.style.removeProperty('pointer-events');

    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
};

// Attach the handler
resizer.addEventListener('mousedown', mouseDownHandler);

// RESIZABLE -----------------------------------------



// Lined text


!(function (e) {
  (e.fn.linedTextEditor = function (t) {
    t = e.extend({}, e.fn.linedTextEditor.defaults, t);
    var n = function (e, n, i) {
      for (; e.height() - n < 0; )
        e.append(
          i == t.selectedLine
            ? "<div class='line-number lineselect'>" + i + "</div>"
            : "<div class='line-number'>" + i + "</div>"
        ),
          i++;
      return i;
    };
    return this.each(function () {
      var i = 11,  a = e(this);

      var r = a.parent();

      var l = r.find(".lines");

      var s = l.find(".linesContainer");

      var d = parseInt(
        e(".lined-textarea-container")
          .parent()
          .css("font-size")
          .replace("px", "")
      );

      d -= 2;
      var o = d + 4;
      if (
        (e(".lined-textarea-container").attr(
          "style",
          "line-height:" + o + "px;font-size:" + d + "px"
        ),
        (lineNo = n(s, l.height(), i, o, d)),
        -1 != t.selectedLine && !isNaN(t.selectedLine))
      ) {
        var d = parseInt(a.height() / lineNo),
          c = d * t.selectedLine;
        a[0].scrollTop = c;
      }
      a.scroll(function () {
        var t = e(this)[0],
          i = t.scrollTop,
          a = t.clientHeight;
        s.css({ "margin-top": -1 * i + "px" }),
          (lineNo = n(s, i + a, lineNo, o));
      });
    });
  }),
    (e.fn.linedTextEditor.defaults = { selectedLine: -1 });
})(jQuery);

function formatHTML(html, htmlEditor) {
    var indent = '\n';
    var tab = '\t';
    var i = 0;
    var pre = [];

    html = html
        .replace(new RegExp('<pre>((.|\\t|\\n|\\r)+)?</pre>'), function (x) {
            pre.push({ indent: '', tag: x });
            return '<--TEMPPRE' + i++ + '/-->'
        })
        .replace(new RegExp('<[^<>]+>[^<]?', 'g'), function (x) {
            var ret;
            var tag = /<\/?([^\s/>]+)/.exec(x)[1];
            var p = new RegExp('<--TEMPPRE(\\d+)/-->').exec(x);

            if (p) 
                pre[p[1]].indent = indent;

            if (['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr'].indexOf(tag) >= 0) // self closing tag
                ret = indent + x;
            else {
                if (x.indexOf('</') < 0) { //open tag
                    if (x.charAt(x.length - 1) !== '>')
                        ret = indent + x.substr(0, x.length - 1) + indent + tab + x.substr(x.length - 1, x.length);
                    else 
                        ret = indent + x;
                    !p && (indent += tab);
                }
                else {//close tag
                    indent = indent.substr(0, indent.length - 1);
                    if (x.charAt(x.length - 1) !== '>')
                        ret =  indent + x.substr(0, x.length - 1) + indent + x.substr(x.length - 1, x.length);
                    else
                        ret = indent + x;
                }
            }

			
            return ret;
        });

    for (i = pre.length; i--;) {
        html = html.replace('<--TEMPPRE' + i + '/-->', pre[i].tag.replace('<pre>', '<pre>\n').replace('</pre>', pre[i].indent + '</pre>'));
    }

    return html.charAt(0) === '\n' ? html.substr(1, html.length - 1) : html;
}

function unformatHTML(html) {
    var i = 0;
    var pre = [];

    html = html.replace(new RegExp('<pre>((.|\\t|\\n|\\r)+)?</pre>'), function (x) {
        pre.push(x);
        return '<--TEMPPRE' + i++ + '/-->'
    }).replace(/\n/g, '').replace(/\t/g, '');

    for (i = pre.length; i--;) {
        html = html.replace('<--TEMPPRE' + i + '/-->', pre[i]);
    }

    html = html.replace(new RegExp('<pre>\\n'), '<pre>').replace(new RegExp('\\n\\t*</pre>'), '</pre>');
    return html;
}

