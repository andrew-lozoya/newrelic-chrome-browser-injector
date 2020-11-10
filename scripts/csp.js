/* -------------------- PreProcess -------------------- */

var domainurl = ""

Array.prototype.first = function() { return this[0] };

/* -------------------- Classes -------------------- */
function CSPManager() {
    //# Variables
    var self = this;

    //Gets current url from focused tab
    chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
        if (tabs.length) self.setcurrent(tabs.first());
    });

    //Sets current focused or updated tab
    this.setcurrent = function(tab) {
        //concatenate /* string to match options target_domain input
        domainurl = urltodomain(tab.url) + '/*';

        chrome.storage.sync.get(['general_loader_config'], function(result) {
            var loader_config = result.general_loader_config
            if (typeof loader_config !== 'undefined') {
                var target_site = [loader_config.target_site]
                
                if (urlmatch(target_site, domainurl)) {
                    attachHeaderListener(tab)
                    IconStatus = true
                    updateUI(IconStatus);
                } else {
                    IconStatus = false
                    updateUI(IconStatus);
                }
            } else {
                IconStatus = false
                updateUI(IconStatus);
            }
        });
    };
}

/* -------------------- Functions -------------------- */

//Converts URL to domain name
function urltodomain(url) {
    var result = url.toLowerCase().match(/https?:\/\/(.[^\/]+)/);
    return (result && result[0] || "");
}

//Returns true/false if the 2 domain urls match
function urlmatch(url1, url2) {
    return (url1 == url2);
}

//Update icon
function updateUI(IconStatus) {
    const iconName = IconStatus ? "on" : "off"
    chrome.browserAction.setIcon({ path: "icons/logo-text-128-" + iconName + ".png" })
}

/* -------------------- Main Process -------------------- */

var init = function() {

    var cspman = new CSPManager();

    //Tab focus
    chrome.tabs.onActivated.addListener(function(info) {
        chrome.tabs.get(info.tabId, tab => cspman.setcurrent(tab));
    });

    //Tab update
    chrome.tabs.onUpdated.addListener(function(tabid, info, tab) {
        cspman.setcurrent(tab);
    });
}

init();

/* -------------------- CSP -------------------- */

var onHeadersReceived = function(details) {
    for (var i = 0; i < details.responseHeaders.length; i++) {
        if (details.responseHeaders[i].name.toLowerCase() === 'content-security-policy') {
            details.responseHeaders[i].value = '';
        }
    }

    return {
        responseHeaders: details.responseHeaders
    };
};

var attachHeaderListener = function(tab) {
    var onHeaderFilter = { urls: ['*://*/*'], types: ['main_frame', 'sub_frame'] };
    // Id like to wire in an equivalent `removeListener` but it's not possible
    // since the `removeListener` signature does not include the header filters.
    // See https://bugs.chromium.org/p/chromium/issues/detail?id=107368
    chrome.webRequest.onHeadersReceived.addListener(
        onHeadersReceived, onHeaderFilter, ['blocking', 'responseHeaders']
    );
};