let isCSPDisabled = true

const onHeadersReceived = function(details) {
    if (!isCSPDisabled) return

    for (let i = 0; i < details.responseHeaders.length; i++)
        if (details.responseHeaders[i].name.toLowerCase() === "content-security-policy")
            details.responseHeaders[i].value = ""

    return {
        responseHeaders: details.responseHeaders,
    }
}

const updateUI = function() {
    const iconName = isCSPDisabled ? "on" : "off"
    chrome.browserAction.setIcon({ path: "icons/logo-text-128-" + iconName + ".png" })
}

const filter = {
    urls: ["*://*/*"],
    types: ["main_frame", "sub_frame"],
}

chrome.webRequest.onHeadersReceived.addListener(onHeadersReceived, filter, [
    "blocking",
    "responseHeaders",
])

if (isCSPDisabled) chrome.browsingData.remove({}, { serviceWorkers: true }, () => null)

updateUI()