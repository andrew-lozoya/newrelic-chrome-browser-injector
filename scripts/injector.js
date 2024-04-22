function stripToBaseDomain(target_site) {
  const protocolIndex = target_site.indexOf("://");
  const domainEndIndex = target_site.indexOf("/", protocolIndex + 3);
  if (domainEndIndex !== -1) {
    return target_site.substring(0, domainEndIndex);
  } else {
    return target_site;
  }
}

function instrument(target_site) {

console.log(loader_config);
  let nrLoaderInit = document.createElement("script");
  let base_domain = stripToBaseDomain(target_site);
  nrLoaderInit.setAttribute("type", "text/javascript");
  nrLoaderInit.innerHTML = `window.NREUM||(NREUM={});NREUM.init={session_replay:{enabled:${session_replay.enabled},collect_fonts:!0,inline_images:!0,inline_stylesheet:!0,sampling_rate:${session_replay.sampling_rate},error_sampling_rate:${session_replay.error_sampling_rate},mask_all_inputs:${session_replay.mask_all_inputs}},distributed_tracing:{enabled:!${dt},cors_use_newrelic_header:!0,cors_use_tracecontext_headers:!1,allowed_origins:["${base_domain}"]},privacy:{cookies_enabled:!${privacy}},ajax:{deny_list:["bam.nr-data.net"]}}`;

  let nrLoader = document.createElement("script");

  if (general == "pro") {
    nrLoader.setAttribute(
      "src",
      "https://js-agent.nr-assets.net/nr-loader-full-" + version + ".js"
    );
  } else {
    nrLoader.setAttribute(
      "src",
      "https://js-agent.nr-assets.net/nr-loader-spa-" + version + ".js"
    );
  }

  let nrLoaderConfig = document.createElement("script");
  nrLoaderConfig.setAttribute("type", "text/javascript");
  nrLoaderConfig.innerHTML = `NREUM.loader_config={accountID:"${loader_config.accountID}",trustKey:"${loader_config.accountID}",agentID:"${loader_config.accountID}",licenseKey:"${loader_config.licenseKey}",applicationID:"${loader_config.applicationID}"};NREUM.info={beacon:"bam.nr-data.net",errorBeacon:"bam.nr-data.net",licenseKey:"${loader_config.licenseKey}",applicationID:"${loader_config.applicationID}",sa:1}`;

  var headElement = document.head || document.documentElement;

  if (typeof window.NREUM == "undefined") {
    try {
      if (headElement.firstChild) {
        headElement.insertBefore(nrLoaderInit, headElement.firstChild);
      } else {
        headElement.appendChild(nrLoaderInit);
      }
      headElement.appendChild(nrLoader);
      headElement.appendChild(nrLoaderConfig);

      let consoleInit = document.createElement("script");
      consoleInit.setAttribute("type", "text/javascript");
      consoleInit.setAttribute("defer", "defer");
      consoleInit.innerHTML = `console.log(NREUM.init);`;
      headElement.appendChild(consoleInit);

      // EXPERIMENTAL: Determine if optional code blocks should be loaded to load additional javascript
      // Usage Example: customer-specific custom attribute captures
      if (optional_code !== "undefined") {
        let snippet = document.createElement("script");
        snippet.setAttribute("type", "text/javascript");
        snippet.setAttribute("defer", "defer");
        // TO DO: external script gist input
        // snippet.src = scriptUrl
        snippet.innerHTML = `${optional_code}`;
        headElement.appendChild(snippet);
      }
      // WARNING: May log once per frame
      // console.log('NR agent injected')
      return;
    } catch (e) {
      console.log(e);
    }
  } else {
    console.log("Existing NR agent detected");
    return;
  }
}

chrome.runtime.sendMessage({ enabled: 1 }, (response) => {
  if (response.enabled) {
    chrome.storage.sync.get(
      [
        "general",
        "general_dt",
        "general_privacy",
        "general_loader_config",
        "general_session_replay",
        "advanced_optional_code",
      ],
      function (result) {
        general = result.general;
        dt = result.general_dt;
        privacy = result.general_privacy;
        loader_config = result.general_loader_config;
        session_replay = result.general_session_replay;
        targets = loader_config.targets;
        version = loader_config.version;
        optional_code = result.advanced_optional_code;

        var target_sites = targets.split(", ");
        var match = false;

        if (general !== "off") {
          for (i = 0; i < target_sites.length; i++) {
            var re = new RegExp(target_sites[i].toString());
            console.log(re);
            if (re.test(window.location)) {
              match = true;
              break; // Break the loop once a match is found
            }
          }
          if (match) {
            instrument(target_sites[i].toString());
          }
        } else return;
      }
    );
  }
});
