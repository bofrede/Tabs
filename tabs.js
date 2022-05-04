/* jslint browser: true, plusplus: true, sloppy: true */
/* global document: false */
/* jshint -W100 */
/* Origin: https://github.com/bofrede/Tabs */

var Tabs = {
    className: "tabs",
    activeClass: "active",

    create: function (tabs, callbacks) {
        var active,
            tab,
            i;
        function tabClickHandler(e) {
            if (Tabs.callback(this, callbacks, "click", e, active)) {
                active.classList.remove(Tabs.activeClass);
                e.target.classList.add(Tabs.activeClass);
                var from = active;
                active = e.target;
                if (from !== active) {
                    if (Tabs.callback(e.target, callbacks, "show", e, from)) {
                        Tabs.setTabBodyActive(from);
                        Tabs.setTabBodyActive(active);
                    }
                }
            }
        }
        if (location.hash) {
            var activeTabInUrl = this.getTabByHash(location.hash.substr(1));
            if (activeTabInUrl) {
                active = activeTabInUrl;
            }
        }
        for (i = 0; i < tabs.length; i++) {
            tab = tabs[i];
            if (!active && tab.classList.contains(this.activeClass)) {
                active = tab;
            } else {
                tab.classList.remove(this.activeClass);
                Tabs.setTabBodyActive(tab);
            }
            tab.addEventListener("click", tabClickHandler);
        }
        if (!active) {
            active = tabs[0];
        }
        active.classList.add(this.activeClass);
        this.setTabBodyActive(active);
    },

    callback: function (element, callbacks, type, e, active) {
        return !(callbacks && callbacks[type] && callbacks[type].call(element, e, active));
    },

    getTarget: function (tab) {
        var match = /#([\w-]+)$/.exec(tab.href);
        if (match) {
            return document.getElementById(match[1]);
        }
    },

    getTabByHash: function (hash) {
        return document.querySelector('.' + this.className + ' a[href="#' + hash + '"]');
    },

    setTabBodyActive: function (tab) {
        var tabBody = this.getTarget(tab);
        if (tab.classList.contains(this.activeClass)) {
            tabBody.style.display = "";
            window.setTimeout(function() { // The focus is delayed a bit.
                let elementToFocus = tabBody.querySelector("[autofocus]");
                if (elementToFocus) {
                    elementToFocus.focus();
                }
            }, 100);
        } else {
            tabBody.style.display = "none";
        }
    }
};

(function () {
    var tabSetList = document.getElementsByClassName(Tabs.className),
        i,
        tabSet,
        tabs,
        group,
        t;
    for (i = 0; i < tabSetList.length; i++) {
        tabSet = tabSetList[i];
        tabs = tabSet.getElementsByTagName("a");
        if (tabs.length === 0) {
            tabs = tabSet.getElementsByTagName("area");
        }
        group = [];
        for (t = 0; t < tabs.length; t++) {
            if (Tabs.getTarget(tabs[t])) {
                group.push(tabs[t]); // Only group actual tab links.
            }
        }
        if (group.length) {
            Tabs.create(group);
        }
    }
}());
