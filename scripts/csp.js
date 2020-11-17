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

        chrome.storage.sync.get(['general_loader_config', 'general_csp'], function(result) {
            var loader_config = result.general_loader_config
            var csp = result.general_csp
            if (typeof loader_config !== 'undefined' || typeof csp !== 'undefined') {
                var target_site = [loader_config.target_site]
                var match = urlmatch(target_site, domainurl);
                if (match == true && csp == true) {
                    attachHeaderListener(tab)
                    IconStatus = true
                    updateCSPIcon(IconStatus);
                }
                else if (match == false && csp == true) {
                    IconStatus = false
                    updateCSPIcon(IconStatus);
                }
                else if (match == true && csp == false) {
                    removeHeaderListener(tab);
                    IconStatus = true
                    updateIcon(IconStatus);
                }
                else if (match == false && csp == false) {
                    IconStatus = false
                    updateIcon(IconStatus);
                }
            } else {
                IconStatus = false
                updateIcon(IconStatus);
            }
        });
    };
}
/* -------------------- Functions -------------------- */

//Converts URL to domain name
function urltodomain(url) {
    var result = url.toLowerCase().match(/https?:\/\/(.[^\/]+)/);
    return (result && result[0] || "");
    alert()
}

//Returns true/false if the 2 domain urls match
function urlmatch(url1, url2) {
    return (url1 == url2);
}

//Update icon
function updateIcon(IconStatus) {
    const iconName = IconStatus ? "on" : "off"
    chrome.browserAction.setIcon({ path: "icons/logo-text-128-" + iconName + ".png" })
}

//Update icon
function updateCSPIcon(IconStatus) {
    const iconName = IconStatus ? "on" : "off"
    chrome.browserAction.setIcon({ path: "icons/logo-csp-128-" + iconName + ".png" })
}

/* -------------------- Main Process -------------------- */

var init = function() {

    var cspman = new CSPManager();

    let activeTabId, lastUrl, lastTitle;

    function getTabInfo(tabId) {
        chrome.tabs.get(tabId, function(tab) {
            if (lastUrl != tab.url || lastTitle != tab.title)
                cspman.setcurrent(tab);
        });
    }

    chrome.tabs.onActivated.addListener(function(activeInfo) {
        getTabInfo(activeTabId = activeInfo.tabId);
    });

    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        if (activeTabId == tabId) {
            getTabInfo(tabId);
        }

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
    chrome.webRequest.onHeadersReceived.addListener(
        onHeadersReceived, onHeaderFilter, ['blocking', 'responseHeaders']
    );
};

var removeHeaderListener = function(tab) {
    // Sites that use Application Cache to cache their HTML document means this
    // extension is not able to alter HTTP response headers (as there is no HTTP
    // request when serving documents from the cache).
    //
    // An example page that this fixes is https://web.whatsapp.com
    // chrome.browsingData.remove({}, { serviceWorkers: true }, function() {});
    chrome.webRequest.onBeforeRequest.removeListener(tab);
    chrome.webRequest.onHeadersReceived.removeListener(tab);
    chrome.webRequest.handlerBehaviorChanged();
};