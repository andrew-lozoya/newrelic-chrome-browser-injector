let enabled = true

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.enabled == 1) {
            setTimeout(function() {
                sendResponse({ enabled: enabled })
            }, 1)
        } else {
            sendResponse({ enabled: disabled })
        }
        return true
    })

// Open options on installed.
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(null, (items) => {
        if (!Object.keys(items).length) {
            chrome.runtime.openOptionsPage();
        }
    })
})