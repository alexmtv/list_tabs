var buttons = require("sdk/ui/button/action");
var tabs = require("sdk/tabs");
var self = require("sdk/self");
var windows = require("sdk/windows").browserWindows;
let { getFavicon } = require("sdk/places/favicon");

var button = buttons.ActionButton({
  id: "list-tabs",
  label: "List tabs",
  icon: {
    "32": "./icon-32.png"
  },
  onClick: handleClick
});

function handleClick(state) {
  tabs.open("./page.html");
}

tabs.on("open", function(tab) {
  tab.on("ready", function(tab) {
    if (tab.url == self.data.url("page.html")) {
      var worker = tab.attach({
        contentScriptFile: "./buildpage.js"
      });
      var tabs_list = [];
      for (tab of windows.activeWindow.tabs) {
        tabs_list.push({
          title: tab.title,
          url: tab.url,
          id: tab.id,
          pinned: tab.isPinned
        });
      }
      worker.port.emit("tabs", tabs_list);
      worker.port.on("activate", activateTab);
      worker.port.on("close", closeTab);
      worker.port.on("getFavicon", function(pageUrl) {
        getFavicon(pageUrl, function(faviconUrl) {
          console.log(worker);
          worker.port.emit("favicon", {
            url: pageUrl,
            favicon: faviconUrl
          });
        });
      });
    }
  });
});

function activateTab(id) {
  for (let tab of tabs) {
    if (tab.id == id) {
      tab.activate();
    }
  }
}

function closeTab(id) {
  for (let tab of tabs) {
    if (tab.id == id) {
      tab.close();
    }
  }
}
