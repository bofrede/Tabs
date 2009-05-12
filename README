TABS
---------------------------------------------------------------------------
Copyright (c) 2008 Dan Peverill
http://www.danpeverill.com

Copyright (c) 2009 Bo Frederiksen
http://www.bofrede.com

Copyright (c) 2005 John Resig
http://ejohn.org/projects/flexible-javascript-events/

LICENSE
---------------------------------------------------------------------------
The MIT License
http://www.opensource.org/licenses/mit-license.php

INSTALLATION
---------------------------------------------------------------------------
Tabs are controlled with links. Each link has a target that it is attached to and specified
as an #anchor in the href attribute. Example: <a href="#tab">tab</a>. The #anchor
is the id of the actual target.

Tabs can be grouped or single. Grouping tabs you specify the parent
class of the tabs with the "tabs" class. For a single tab just add the class "tabs" to it.

Active tabs given the class "active" by default. Inactive tabs have no class. You may
specify the default active/inactive tabs by adding the class "active" to any of them in
your HTML.

Tab targets are automatically shown and hidden as you click the appropriate tabs. You can control
this behavior with callback functions (see below). It is up to you to style the tabs and tab targets
with CSS. This script only toggles the active class on tabs and shows/hides the tab targets.

You may add custom tabs yourself with Tabs.create(tabs, callbacks).

Callbacks is an optional argument. Callbacks is an object with two optional properties: click, show.
These options are a function that handles the appropriate callback. Each callback can accept
two arguments, the click event and the currently active tab target. "this" refers to the tab.
click: This callback is triggered just as a tab is clicked. Returning false cancels the entire event.
show: This callback is triggered after the active class and tab has been set, but just before the
	tab targets are shown. Returning false means you handled the showing/hiding of the tab targets.
