var optional_code = []

function instrument() {
    let nrLoaderInit = document.createElement('script')
    nrLoaderInit.setAttribute('type', 'text/javascript')
    nrLoaderInit.innerHTML = `window.NREUM||(NREUM={});NREUM.init={distributed_tracing:{enabled:${dt}},privacy:{cookies_enabled:${privacy}}}`

    let nrLoader = document.createElement('script')

    if (general == "pro") {
        nrLoader.setAttribute('src', 'https://js-agent.nr-assets.net/nr-loader-full-' + version + '.js');
    } else {
        nrLoader.setAttribute('src', 'https://js-agent.nr-assets.net/nr-loader-spa-' + version + '.js');
    }

    let nrLoaderConfig = document.createElement('script')
    nrLoaderConfig.setAttribute('type', 'text/javascript')
    nrLoaderConfig.innerHTML = `NREUM.loader_config={accountID:"${loader_config.accountID}",trustKey:"${loader_config.accountID}",agentID:"${loader_config.accountID}",licenseKey:"${loader_config.licenseKey}",applicationID:"${loader_config.applicationID}"};NREUM.info={beacon:"bam.nr-data.net",errorBeacon:"bam.nr-data.net",licenseKey:"${loader_config.licenseKey}",applicationID:"${loader_config.applicationID}",sa:1}`

    var headElement = (document.head || document.documentElement)

    if (typeof window.NREUM == 'undefined') {
        try {
            if (headElement.firstChild) {
                headElement.insertBefore(nrLoaderInit, headElement.firstChild)
            } else {
                headElement.appendChild(nrLoaderInit)
            }
            headElement.appendChild(nrLoader)
            headElement.appendChild(nrLoaderConfig)

            // EXPERIMENTAL: Determine if optional code blocks should be loaded to load additional javascript
            // Usage Example: customer-specific custom attribute captures
            if (optional_code.indexOf("none") > -1) {
                let optional = document.createElement('script')
                optional.setAttribute('type', 'text/javascript')
                // TO DO: external script gist input
                optional.src = scriptUrl
                optional.innerHTML = optional_code
                headElement.appendChild(optional)
            }
            // WARNING: May log once per frame
            // console.log('NR agent injected')
            return

        } catch (e) {
            console.log(e);
        }
    } else {
        console.log('Existing NR agent detected')
        return
    }
}

chrome.runtime.sendMessage({ enabled: 1 }, (response) => {
    if (response.enabled) {
        chrome.storage.sync.get(['general', 'general_dt', 'general_privacy', 'general_loader_config'], function(result) {
            general = result.general
            dt = result.general_dt
            privacy = result.general_privacy
            loader_config = result.general_loader_config
            target_site = [loader_config.target_site]
            version = [loader_config.version]

            var match = false

            if (general !== "off") {
                for (i = 0; i < target_site.length; i++) {
                    var re = new RegExp(target_site[i])
                    if (re.test(window.location)) {
                        match = true
                    }
                }
                if (match) {
                    instrument()
                }
            } else
                return
        })
    }
})