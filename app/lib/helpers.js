(function ($) {
    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
    $.fn.highlightWords = function (words) {
        var TEXT_NODE = 3;

        var $that = $(this);

        function getTextNodesIn(node, includeWhitespaceNodes) {
            var textNodes = [], whitespace = /^\s*$/;

            function getTextNodes(node) {
                if (node.nodeType === TEXT_NODE) {
                    if (includeWhitespaceNodes || !whitespace.test(node.nodeValue)) {
                        textNodes.push(node);
                    }
                } else {
                    for (var i = 0, len = node.childNodes.length; i < len; ++i) {
                        getTextNodes(node.childNodes[i]);
                    }
                }
            }

            getTextNodes(node);
            return textNodes;
        }

        function removeHighlights() {
            var tables = $that;

            for (var k = 0; k < tables.length; k++) {
                var nodes = getTextNodesIn(tables[k]);
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes[i];
                    var parentNode = node.parentNode;

                    if (parentNode.className && parentNode.className.indexOf('highlight') !== -1) {
                        // node = "Hello world"
                        // parentNode = "<span class="highlight">Hello world</span>"
                        // parentNode.parentNode.replaceChild(node, parentNode)
                        var gpNode = parentNode.parentNode;
                        gpNode.replaceChild(node, parentNode);
                    }
                }
            }
        }

        function makeTextNodeContiguous(re, litUp) {
            var $t = $(this);
            var contiguous = [];

            // join separate text nodes into a single continual node.
            // e.g. "j" "ohn" becomes "john"
            // should remove the subsequent nodes and leave only the first
            // node which is replaced with the joined content
            function joinContiguous(contiguous) {
                if (!contiguous.length) {
                    return;
                }

                // add them all together
                var condensedValue = $.map(contiguous, function (el) {
                    return el.nodeValue;
                });

                // the first element is the one we will replace so get a
                // reference
                var el = contiguous.pop();

                //  remove all the other nodes
                var e;
                while ((e = contiguous.pop())) {
                    $t[0].removeChild(e);
                }
                var replacable = condensedValue.join('');
                $t.find(el).replaceWith(replacable.replace(re, litUp));
            }

            // for each direct child node, let's check if it's text. add all
            // those to a collection and then join once we meet a non-text node
            $t.contents().each(function () {
                if (this.nodeType === TEXT_NODE) {
                    contiguous.push(this);
                } else {
                    joinContiguous(contiguous);
                }
            });
            joinContiguous(contiguous);
        }

        function highlightWord(word) {
            // http://stackoverflow.com/a/6969486/6084 - escape regex chars
            var wordre = word.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            var re = new RegExp('(' + wordre + ')', 'gi');
            var litUp = '<span class="highlight">$1</span>';
            $(':icontains(' + word + ')', $that).not('.highlight').each(function () {
                makeTextNodeContiguous.call(this, re, litUp);
            });
        }

        words = $.map(words.split(' '), function (word) {
            return (word) ? word : null;
        });

        removeHighlights();

        for (var i = 0; i < words.length; i++) {
            var word = words[i];
            highlightWord(word);
        }

    };
})(jQuery);

// http://css-tricks.com/snippets/jquery/make-jquery-contains-case-insensitive/
$.expr[":"].icontains = $.expr.createPseudo(function (arg) {
    return function (elem) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});

// http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format/4673436#4673436
if (!String.prototype.format) {
    var re = new RegExp('{(\\d+)}', 'g');
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(re, function (match, number) {
            return typeof args[number] !== 'undefined' ? args[number] : match;
        });
    };
}

Balanced.Helpers = (function () {
    // example of how to parse and format iso8601 dates. will parse the
    // specified format and then attach the original unparsed date as a title
    // attribute. may not be needed since we don't render the time info on the
    // server.
    function parseDateTime() {
        var $t = $(this);
        var dt = $t.attr('datetime');
        var format = $t.data('format');
        if (!dt || dt.indexOf('T') === -1) {
            return;
        }
        var x = Date.parseISO8601(dt).strftime(format);
        if (x.toUpperCase().indexOf('UNDEFINED') === -1 && x.toUpperCase().indexOf('NAN') === -1) {
            $t.text(x);
            if (!$t.attr('title')) {
                $t.attr('title', dt);
            }
        }
    }

    function calculateContentHeight() {
        var $content = $('#content');
        if (!$content.length) {
            return;
        }
        var height = $content.height();
        var padding = (+$content.css('padding-top').replace('px', '')) + (+$content.css('padding-bottom').replace('px', ''));
        return (+height + (+padding)) + 'px';
    }

    return {
        init: function () {
            $('time[data-format]').each(parseDateTime);
            Balanced.Helpers.navigationTimer = setInterval(Balanced.Helpers.updateNavigationHeight, 50);
        },

        updateNavigationHeight: function () {
            var height = calculateContentHeight();
            if (height) {
                $('#marketplace-nav').height(height);
            }
        }
    };
})();

Balanced.Utils = {
    uriToDashboardFragment: function (uri) {
        // have to strip off the API version
        return uri.substring(3);
    },

    toTitleCase: function (str) {
        if (!str) {
            return str;
        }
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    },

    getParamByName: function (uri, name) {
        name = name.replace(/[\[]/, "\\\\[").replace(/[\]]/, "\\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(uri);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },

    /*
     * Inserts or updates a single query string parameter
     */
    updateQueryStringParameter: function (uri, key, value) {
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf("?") > -1 ? "&" : "?";
        if (uri.match(re)) {
            return uri.replace(re, "$1" + key + "=" + value + "$2");
        }
        else {
            return uri + separator + key + "=" + value;
        }
    },

    sortDict: function (dict) {
        var sorted = [];
        for (var key in dict) {
            sorted[sorted.length] = key;
        }
        sorted.sort();

        var tempDict = {};
        for (var i = 0; i < sorted.length; i++) {
            tempDict[sorted[i]] = dict[sorted[i]];
        }

        return tempDict;
    },

    formatCurrency: function (cents) {
        if (cents !== null) {
            return '$' + (cents / 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        }
    },

    dollarsToCents: function (dollars) {
        return parseInt(dollars * 100, 10);
    },

    toGravatar: function (emailHash) {
        var placeholder = 'https://dashboard.balancedpayments.com/images/user_icon-01-3c142d4f.png';
        if (!emailHash) {
            return placeholder;
        }
        return 'https://secure.gravatar.com/avatar/{0}?s=30&d={1}'.format(emailHash, placeholder);
    }
};
