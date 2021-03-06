self.port.on("tabs", createTable);
self.port.on("favicon", onFavicon);

function createTable(tabs) {
  var table = document.createElement("table");

  var table_headers = ["#", "X", "", "Title & URL"];
  createHeaderRow(table, table_headers);

  var pinned_tabs = [];
  var not_pinned_tabs = [];
  for (let tab of tabs) {
    if (tab.pinned) {
      pinned_tabs.push(tab);
    } else {
      not_pinned_tabs.push(tab);
    }
  }

  if (pinned_tabs.length > 0) {
    createSeparatorRow(table, "Pinned:", table_headers.length);
    createBunchOfTabRows(table, pinned_tabs);
    createSeparatorRow(table, "Not pinned:", table_headers.length);
  }

  createBunchOfTabRows(table, not_pinned_tabs);

  document.body.appendChild(table);
}

function createHeaderRow(table, headers) {
  let row = table.insertRow(0);
  for (let i = 0; i < headers.length; i++) {
    let cell = row.insertCell(-1);
    cell.classList.add("header");
    cell.textContent = headers[i];
  }
}

function createSeparatorRow(table, text, cols) {
    let row = table.insertRow(-1);
    row.classList.add("separator");
    let cell = row.insertCell(-1);
    cell.classList.add("separator");
    cell.colSpan = cols;
    cell.textContent = text;
}

function createBunchOfTabRows(table, tabs) {
  for (let i = 0; i < tabs.length; i++) {
    let tab = tabs[i];
    createTabRow(table, tab.title, tab.url, i, tab.id);
  }
}

function createTabRow(table, title, url, index, id) {
  var row = table.insertRow(-1);
  row.classList.add("tab");

  getNewTabCell(row).appendChild(createActivateButton(index, id));
  getNewTabCell(row).appendChild(createCloseButton(id));
  getNewTabCell(row).appendChild(createFavicon(url));

  cell = getNewTabCell(row);
  cell.appendChild(createTitle(title));
  cell.appendChild(document.createElement("br"));
  cell.appendChild(createURL(url));
}

function getNewTabCell(row) {
  cell = row.insertCell(-1);
  cell.classList.add("tab");
  return cell;
}

function onActivateButtonAction() {
  self.port.emit("activate", this.name);
}

function onCloseButtonAction() {
  self.port.emit("close", this.name);
  this.disabled = true;
}

function createButton(name, text, handler) {
  var button = document.createElement("button");
  button.name = name;
  button.textContent = text;
  button.onclick = handler;
  button.classList.add("cellButton");
  return button;
}

function createActivateButton(index, id) {
  return createButton("" + id,
                      "" + index,
                      onActivateButtonAction);
}

function createCloseButton(id) {
  return createButton("" + id,
                      "X",
                      onCloseButtonAction);
}

function createTitle(title) {
  return document.createTextNode(title);
}

function createURL(url) {
  var a = document.createElement("a");
  a.classList.add("tabURL");
  a.text = decodeURI(url);
  a.href = url;
  return a;
}

function createFavicon(url) {
  var img = document.createElement("img");
  img.id = url;
  img.src = "";
  img.height = 16;
  img.width = 16;
  self.port.emit("getFavicon", url);
  return img;
}

function onFavicon(obj) {
  console.log("onFavicon called");
  img = document.getElementById(obj.url);
  img.id = null;
  img.src = obj.favicon;
}
