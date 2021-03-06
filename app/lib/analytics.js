window.mixpanel = window.mixpanel || [];
window._gaq = window._gaq || [];

Balanced.Analytics = (function () {
    var testing = false;
    var fieldsToExclude = [
        'card_number', 'account_number', 'password', 'security_code'
    ];

    // This page will almost always be over https, so can just load this directly.
    $.getScript('https://ssl.google-analytics.com/ga.js', { cache: true });

    // filters any number that is in the form of a string and longer than 4 digits (bank codes, ccard numbers etc)
    function filter(text) {
        if (typeof text === 'string') {
            return text.replace(/([0-9])[\s+\-]([0-9])/g, '$1$2').replace(/([0-9]*)([0-9]{4})/g, 'XX-HIDE-XX-$2');
        }
        var ret = {};
        for (var name in text) {
            // fields to exclude
            if (fieldsToExclude.indexOf(name) !== -1) {
                continue;
            }
            ret[name] = filter(text[name]);
        }
        return ret;
    }

    // links the current id with this specific id
    function trackLogin(email) {
        try {
            window.mixpanel.alias(email);
        } catch (err) {
            // TODO: is this indicative of a bug?
            // Mixpanel error: Attempting to create alias for existing People user - aborting.
        }
    }

    return {
        init: function (settings) {
            window.mixpanel.init(settings.MIXPANEL);
            testing = window.TESTING;

            window._gaq.push(['_setAccount', settings.GOOGLE_ANALYTICS]);
            window._gaq.push(['_setDomainName', 'balancedpayments.com']);
            window._gaq.push(['_trackPageview']);

            Balanced.Auth.on('signInSuccess', _.debounce(function () {
                var user = this.get('_session').get('user');
                trackLogin(user.email_address);
            }, 450));

            if (testing) {
                return;
            }

            // HACK: can't find an good way to track all events in ember atm
            // to track all click events
            $(document).on('click', 'a,.btn,button', function () {
                var e = $(this);
                // trims text contained in element
                var tt = e.text().replace(/^\s*([\S\s]*?)\s*$/, '$1');
                var values = {};
                for (var a = 0; a < e[0].attributes.length; a++) {
                    values[e[0].attributes[a].nodeName] = e[0].attributes[a].nodeValue;
                }
                window.mixpanel.track('click ' + tt, values);
                window._gaq.push(['_trackEvent', 'dashboard', 'click ' + tt]);
            });
        },
        trackPage: _.debounce(function (page) {
            var currentLocation = page + location.hash;
            if (testing) {
                return;
            }
            window._gaq.push(['_trackPageview', currentLocation]);
            window.mixpanel.track_pageview(currentLocation);
        }, 500),
        trackEvent: function (name, data) {
            data = filter(data);
            if (testing) {
                return;
            }
            window.mixpanel.track(name, data);
        },
        trackAjax: function (data) {
            if (data.type === 'GET' || !data.data) {
                return;
            }
            var dat = JSON.parse(data.data);
            dat._type = data.type;
            dat = filter(dat);
            if (testing) {
                return;
            }
            window._gaq.push(['_trackEvent', 'dashboard', dat._type, data.url]);
            window.mixpanel.track(dat._type, dat);
        }
    };

})();
