/*jslint browser: true, plusplus: true, sloppy: true */
/*
*    TABS
*    ---------------------------------------------------------------------------
*    Copyright (c) 2008 Dan Peverill
*    http://www.danpeverill.com
*
*    Copyright (c) 2009 Bo Frederiksen
*    http://www.bofrede.com
*
*    Copyright (c) 2005 John Resig
*    http://ejohn.org/projects/flexible-javascript-events/
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
*        tab targets are shown. Returning false means you handled the showing/hiding of the tab targets.
*/

var Tabs = {
    className: "tabs",
    activeClass: "active",

    addEvent: function (obj, type, fn) {
        if (obj.attachEvent) {
            obj['e' + type + fn] = fn;
            obj[type + fn] = function () {
                obj['e' + type + fn](window.event);
            };
            obj.attachEvent('on' + type, obj[type + fn]);
        } else {
            obj.addEventListener(type, fn, false);
        }
    },

    create: function (tabs, callbacks) {
        if (!tabs.length) {
            this.createSingle(tabs, callbacks);
        } else {
            this.createGroup(tabs, callbacks);
        }
    },

    createSingle: function (tab, callbacks) {
        if (this.Element.hasClass(tab, this.activeClass)) {
            this.Element.show(this.getTarget(tab));
        }
        this.addEvent(tab, "click", function (e) {
            if (Tabs.callback(this, callbacks, "click", e)) {
                Tabs.Element.toggleClass(this, Tabs.activeClass);
                if (Tabs.callback(this, callbacks, "show", e)) {
                    Tabs.Element.toggleVisibility(Tabs.getTarget(this));
                }
            }
            if (e.preventDefault) { // For DOM compliant browsers http://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/events.html#Events-Event-preventDefault
                e.preventDefault();
            } else { // For MSIE http://msdn2.microsoft.com/en-us/library/ms536913.aspx
                e.returnValue = false;
            }
        });
    },

    createGroup: function (tabs, callbacks) {
        var active,
            tab,
            i;
        for (i = 0; i < tabs.length; i++) {
            tab = tabs[i];
            if (this.Element.hasClass(tab, this.activeClass)) {
                active = tab;
                this.Element.addClass(tab);
                this.Element.show(this.getTarget(tab));
            } else {
                this.Element.hide(this.getTarget(tab));
            }
            this.addEvent(tab, "click", function (e) {
                if (Tabs.callback(this, callbacks, "click", e, active)) {
                    Tabs.Element.removeClass(active, Tabs.activeClass);
                    Tabs.Element.addClass(this, Tabs.activeClass);
                    var from = active;
                    active = this;
                    if (Tabs.callback(this, callbacks, "show", e, from)) {
                        Tabs.Element.hide(Tabs.getTarget(from));
                        Tabs.Element.show(Tabs.getTarget(this));
                    }
                }
                if (e.preventDefault) { // For DOM compliant browsers http://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/events.html#Events-Event-preventDefault
                    e.preventDefault();
                } else { // For MSIE http://msdn2.microsoft.com/en-us/library/ms536913.aspx
                    e.returnValue = false;
                }
            });
        }
        if (!active) {
            tab = tabs[0];
            active = tab;
            this.Element.addClass(tab, this.activeClass);
            this.Element.show(this.getTarget(tab));
        }
    },

    callback: function (element, callbacks, type, e, active) {
        return !(callbacks && callbacks[type] && callbacks[type].call(element, e, active));
    },

    getTarget: function (tab) {
        var match = /#(.*)$/.exec(tab.href),
            target;
        if (match && (target = document.getElementById(match[1]))) {
            return target;
        }
    },

    getElementsByClassName: function (className, tag) {
        var elements = document.getElementsByTagName(tag || "*"),
            list = [],
            i;
        for (i = 0; i < elements.length; i++) {
            if (this.Element.hasClass(elements[i], this.className)) {
                list.push(elements[i]);
            }
        }
        return list;
    }
};

Tabs.Element = {
    addClass: function (element, className) {
        element.className += (element.className ? " " : "") + className;
    },

    removeClass: function (element, className) {
        element.className = element.className.replace(new RegExp("(^|\\s)" + className + "(\\s|$)"), "$1");
        if (element.className === " ") {
            element.className = "";
        }
    },

    hasClass: function (element, className) {
        return element.className && (new RegExp("(^|\\s)" + className + "(\\s|$)")).test(element.className);
    },

    toggleClass: function (element, className) {
        if (this.hasClass(element, className)) {
            this.removeClass(element, className);
        } else {
            this.addClass(element, className);
        }
    },

    getStyle: function (element, property) {
        if (element.style[property]) {
            return element.style[property];
        }
        if (element.currentStyle) {    // IE.
            return element.currentStyle[property];
        }
        property = property.replace(/([A-Z])/g, "-$1").toLowerCase();    // Turns propertyName into property-name.
        var style = document.defaultView.getComputedStyle(element, "");
        if (style) {
            return style.getPropertyValue(property);
        }
    },

    show: function (element) {
        element.style.display = "";
        if (this.getStyle(element, "display") === "none") {
            element.style.display = "block";
        }
    },

    hide: function (element) {
        element.style.display = "none";
    },

    isVisible: function (element) {
        return this.getStyle(element, "display") !== "none";
    },

    toggleVisibility: function (element) {
        if (this.isVisible(element)) {
            this.hide(element);
        } else {
            this.show(element);
        }
    }
};

Tabs.addEvent(window, "load", function () {
    var elements = Tabs.getElementsByClassName(Tabs.className),
        i,
        element,
        tabs,
        group,
        t;
    for (i = 0; i < elements.length; i++) {
        element = elements[i];
        if (element.tagName === "A" || element.tagName === "AREA") {
            Tabs.create(element);
        } else {    // Group
            tabs = element.getElementsByTagName("a");
            if (tabs.length === 0) {
                tabs = element.getElementsByTagName("area");
            }
            group = [];
            for (t = 0; t < tabs.length; t++) {
                if (Tabs.getTarget(tabs[t])) {
                    group.push(tabs[t]);    // Only group actual tab links.
                }
            }
            if (group.length) {
                Tabs.create(group);
            }
        }
    }
});
