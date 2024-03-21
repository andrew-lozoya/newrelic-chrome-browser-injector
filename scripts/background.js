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
          xml: "application/rss+xml",
        },

        dataType: "xml",

        success: function (data) {
          const versions = [];
          $(data)
            .find("item")
            .each(function () {
              const el = $(this);
              const title = el.find("title").text();
              const versionMatch = title.match(/\d+\.\d+\.\d+/);
              if (versionMatch) {
                const version = versionMatch[0];
                versions.push({ version, title });
              }
            });

          // Sort the versions array to get the highest version number
          versions.sort((a, b) => {
            const versionA = a.version.split(".").map(Number);
            const versionB = b.version.split(".").map(Number);
            for (let i = 0; i < 3; i++) {
              if (versionA[i] !== versionB[i]) {
                return versionB[i] - versionA[i];
              }
            }
            return 0;
          });

          if (versions.length > 0) {
            const highestVersion = versions[0].version;
            const highestTitle = versions[0].title;

            const template = `<a href="${highestTitle}" target="_blank" rel="noopener">${highestTitle}</a>`;
            localStorage.setItem("template", template);

            localStorage.setItem("version", highestVersion);
          }

          chrome.runtime.openOptionsPage();
        },
      });
    }
  });
});