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
                active = this;
                if (Tabs.callback(this, callbacks, "show", e, from)) {
                    Tabs.getTarget(from).style.display = "none";
                    Tabs.getTarget(this).style.display = "";
                }
            }
            //e.preventDefault();
        }
        for (i = 0; i < tabs.length; i++) {
            tab = tabs[i];
            if (tab.classList.contains(this.activeClass)) {
                active = tab;
                tab.classList.add(Tabs.activeClass);
                this.getTarget(tab).style.display = "";
            } else {
                this.getTarget(tab).style.display = "none";
            }
            tab.addEventListener("click", tabClickHandler);
        }
        if (!active) {
            tab = tabs[0];
            active = tab;
            tab.classList.add(this.activeClass);
            this.getTarget(tab).style.display = "";
        }
    },

    callback: function (element, callbacks, type, e, active) {
        return !(callbacks && callbacks[type] && callbacks[type].call(element, e, active));
    },

    getTarget: function (tab) {
        var match = /#([\w-]+)$/.exec(tab.href);
        if (match) {
            return document.getElementById(match[1]);
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
