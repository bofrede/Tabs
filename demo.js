/*jslint browser: true, sloppy: true */
/*global Tabs: false */
(function () {
	var links = document.getElementById("gallery-preview").getElementsByTagName("a"),
		loading = new Image();
	loading.src = "images/loading.png";
	Tabs.create(links, {
		show: function () {
			Tabs.getTarget(this).src = loading.src;
			Tabs.getTarget(this).src = this.href.replace(/#[\w-]+$/, "");
			return false;
		}
	});
}());