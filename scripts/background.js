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

            const RSS_URL = `https://docs.newrelic.com/docs/release-notes/new-relic-browser-release-notes/browser-agent-release-notes/feed.xml`;

            $.ajax(RSS_URL, {
                accepts: {
                    xml: "application/rss+xml"
                },

                dataType: "xml",

                success: function(data) {
                    $(data)
                        .find("item").first()
                        .each(function() {
                            const el = $(this);

                            const template = `<a href="${el.find("link").text()}" target="_blank" rel="noopener">${el.find("title").text()}</a>`;
                            localStorage.setItem('template', template);

                            var version = `${el.find("title").text()}`
                            version = version.replace(/[^0-9]/g, '');

                            localStorage.setItem('version', version);
                        });
                    chrome.runtime.openOptionsPage();
                }
            });
        }
    })
})