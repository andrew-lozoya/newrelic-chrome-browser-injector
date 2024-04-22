const cspDirectives = ['default-src', 'script-src', 'connect-src']
const bypassDomains = ['https://bam.nr-data.net', 'https://js-agent.newrelic.com']
let domainUrl = ''

/* -------------------- Main Process -------------------- */
const init = function() {
    const cspman = new CSPManager()

    function getTabInfo(tabId) {
        chrome.tabs.get(tabId, function(tab) {
            CSPManager(tab)
        })
    }

    chrome.tabs.onActivated.addListener(function(activeInfo) {
        getTabInfo(activeInfo.tabId)
    })
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        getTabInfo(tabId)
    })

    chrome.webRequest.onHeadersReceived.addListener(
        function(details) {
            const cspHeader = 'content-security-policy'
            for (let i = 0; i < details.responseHeaders.length; i++) {
                if (details.responseHeaders[i].name.toLowerCase() === cspHeader) {
                    const csp = details.responseHeaders[i].value
                    if (csp) {
                        details.responseHeaders[i].value = cspValues(csp)
                    }
                }
            }
            return { responseHeaders: details.responseHeaders }
        }, { urls: ['<all_urls>'], types: ['main_frame', 'sub_frame', 'script'] },
        ['blocking', 'responseHeaders']
    );
}
init()
/* -------------------- Classes -------------------- */
function CSPManager(tab) {
    // Quey current url from tab object

    chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
        // concatenate '/*' string to match options target_domain input
        domainUrl = urltodomain(tabs[0].url) + '/*'
    })

    chrome.storage.sync.get(['general_loader_config', 'general_csp'], function(result) {
      const loader_config = result.general_loader_config;
      csp = result.general_csp;

      // Check for undefined on openOptionsPage()
      if (typeof loader_config !== "undefined" || typeof csp !== "undefined") {
        const sites = loader_config.targets;
        const target_sites = sites.split(", ");

        let matchFound = false;

        target_sites.forEach(function (target_site) {
          if (matchFound) return; // If match already found, exit loop

          const match = urlmatch(target_site, domainUrl);

          if (match === true && csp === true) {
            IconStatus = true;
            updateCSPIcon(IconStatus);
            matchFound = true; // Set flag to true to indicate match found
          } else if (match === false && csp === true) {
            IconStatus = false;
            updateCSPIcon(IconStatus);
          } else if (match === true && csp === false) {
            IconStatus = true;
            updateIcon(IconStatus);
            matchFound = true; // Set flag to true to indicate match found
          } else if (match === false && csp === false) {
            IconStatus = false;
            updateIcon(IconStatus);
          }
        });
      } else {
        IconStatus = false;
        updateIcon(IconStatus);
      }
    })
};

/* -------------------- Functions -------------------- */
// Converts URL to domain name
const urltodomain = function(url) {
    const result = url.toLowerCase().match(/https?:\/\/(.[^\/]+)/)
    return (result && result[0])
}

// Returns true/false if the 2 domain urls match
const urlmatch = function(url1, url2) {
    return (url1 === url2)
}

// Update icon
const updateIcon = function(IconStatus) {
    const iconName = IconStatus ? 'on' : 'off'
    chrome.browserAction.setIcon({ path: 'icons/logo-text-' + iconName + '.png' })
}

// Update icon
const updateCSPIcon = function(IconStatus) {
    const iconName = IconStatus ? 'on' : 'off'
    chrome.browserAction.setIcon({ path: 'icons/logo-csp-' + iconName + '.png' })
}

const cspValues = function(csp) {
    const domainString = bypassDomains.join(' ')
    for (let i = 0; i < cspDirectives.length; i++) {
        const directive = cspDirectives[i]
        if (csp.indexOf(directive) > -1) {
            csp = csp.replace(directive, directive + ' ' + domainString)
        }
    }
    return csp
}