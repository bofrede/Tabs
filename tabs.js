/*jslint browser: true, plusplus: true, sloppy: true */
/*global document: false */
/* jshint -W100 */
/*
*    TABS
*    ---------------------------------------------------------------------------
*    Copyright (c) 2009-2013 Bo Frederiksen
*    https://github.com/bofrede/Tabs
*
*    Copyright (c) 2008 Dan Peverill
*    http://www.danpeverill.com
*
*    LICENSE
*    ---------------------------------------------------------------------------
*    The MIT License
*    http://www.opensource.org/licenses/mit-license.php
*
*    INSTALLATION
*    ---------------------------------------------------------------------------
*    Tabs are controlled with links. Each link has a target that it is attached to and specified
*    as an #anchor in the href attribute. Example: <a href="#tab">tab</a>. The #anchor
*    is the id of the actual target.
*
*    Tabs can be grouped or single. Grouping tabs you specify the parent
*    class of the tabs with the "tabs" class. For a single tab just add the class "tabs" to it.
*
*    Active tabs given the class "active" by default. Inactive tabs have no class. You may
*    specify the default active/inactive tabs by adding the class "active" to any of them in
*    your HTML.
*
*    Tab targets are automatically shown and hidden as you click the appropriate tabs. You can control
*    this behavior with callback functions (see below). It is up to you to style the tabs and tab targets
*    with CSS. This script only toggles the active class on tabs and shows/hides the tab targets.
*
*    You may add custom tabs yourself with Tabs.create(tabs, callbacks).
*
*    Callbacks is an optional argument. Callbacks is an object with two optional properties: click, show.
*    These options are a function that handles the appropriate callback. Each callback can accept
*    two arguments, the click event and the currently active tab target. "this" refers to the tab.
*    click: This callback is triggered just as a tab is clicked. Returning false cancels the entire event.
*    show: This callback is triggered after the active class and tab has been set, but just before the
*    tab targets are shown. Returning false means you handled the showing/hiding of the tab targets.
*/

var Tabs = {
    className: "tabs",
    activeClass: "active",

    create: function (tabs, callbacks) {
        if (!tabs.length) {
            this.createSingle(tabs, callbacks);
        } else {
            this.createGroup(tabs, callbacks);
        }
    },

    createSingle: function (tab, callbacks) {
        if (tab.classList.contains(this.activeClass)) {
            this.getTarget(tab).style.display = "";
        }
        tab.addEventListener("click", function (e) {
            if (Tabs.callback(this, callbacks, "click", e)) {
                e.target.classList.toggle(Tabs.activeClass);
                if (Tabs.callback(this, callbacks, "show", e)) {
                    var target = Tabs.getTarget(this);
                    target.style.display = (target.style.display !== "none") ? "none" : "";
                }
            }
            e.preventDefault();
        });
    },

    createGroup: function (tabs, callbacks) {
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
        if (tabSet.tagName === "A" || tabSet.tagName === "AREA") {
            Tabs.create(tabSet);
        } else { // Group
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
    }
}());
