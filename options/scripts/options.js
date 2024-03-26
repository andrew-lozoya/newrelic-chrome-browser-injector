/* global chrome */
//chrome.options.opts.saveDefaults = false

var version = localStorage.getItem('version');
var template = localStorage.getItem('template');
var refresh = localStorage.getItem('refresh');


if (`${version}` == 'null' && `${refresh}` == 'null') {
    localStorage.setItem('refresh', 1);
    location.reload();
} else if (`${version}` == 'null' && `${refresh}` == 1) {
    version = 'current'
    chrome.options.opts.saveDefaults = true
} else {
    chrome.options.opts.saveDefaults = true
}

chrome.options.opts.license = `<p>New Relic Browser Injector for Chromium is licensed under the <a href="http://apache.org/licenses/LICENSE-2.0.txt" rel="nofollow">Apache 2.0</a> License.</p>`;

chrome.options.addTab("General", [
  {
    type: "html",
    html: '<i class="material-icons" style="font-size:15px">build</i> <h3>Experimental Options</h3>',
  },
  {
    type: "html",
    html: "<div>This will deploy the agent via one of the option you select by dom injection.</div>",
  },
  {
    type: "radio",
    desc: "",
    options: [
      {
        type: "radio",
        value: "off",
        desc: "Off - Disables Browser Application Monitoring instrumentation.",
      },
      {
        type: "radio",
        value: "lite",
        desc: "Lite - Basic page load timing instrumentation.",
      },
      {
        type: "radio",
        value: "pro",
        desc: "Pro - Instrumentation supporting all Pro features.",
      },
      {
        type: "radio",
        value: "pro+spa",
        desc: "Pro + SPA - Instrumentation supporting all Pro and SPA features. To learn more about SPA, visit our documentation.",
      },
    ],
    disabled: false,
    default: "pro+spa",
  },

  { type: "html", html: "</br>", hidden: false },
  {
    name: "csp",
    desc: "Enable Content Security Policy (CSP) Bypass",
    default: true,
    disabled: true,
    hidden: false,
  },
  {
    type: "html",
    html: `<div><a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP">Content Security Policy (CSP)</a> is an added layer of security on some websites that can help to detect and mitigate certain types of data injection. Thus preventing client side injection of the New Relic Browser Agent.</br>If CSP is not bypassed you may see the following console log: </br><div style="box-shadow: inset 0 0 15px rgba(135, 135, 135, .1), 0 0 18px 3px rgba(0, 0, 0, .3); padding: 6px;background:#141A1F;border-radius: 8px;border:1px solid #878A8D; width: fit-content; margin-top: 10px;"><pre><code style="overflow-x:auto;padding:0.5em;color:#878A8D;background:#1D252C;border-radius: 4px;"><i><span style="color:#FF40B4;">"Refused to load the script</span> 'https://js-agent.newrelic.com/nr-spa-${version}.min.js' <span style="color:#FF40B4;">because it violoates the following Content Security Policy directive"</i></span></code></pre></div></div>`,
    hidden: false,
  },

  { type: "html", html: "</br>" },
  {
    name: "dt",
    desc: "Enable Distributed Tracing",
    default: true,
    disabled: false,
  },
  {
    type: "html",
    html: '<div><div>Monitor and analyze your Browser requests from end to end as they travel across distributed systems. </div><div><span><strong>Requires APM Pro agent and Browser Pro + SPA agent and account. </strong><!-- react-text: 77 -->To ensure that APM transaction data is collected as expected, please refer to the minimum required APM language agent versions under the "Requirements and compatibility" section of </span><a target="_blank" href="https://docs.newrelic.com/docs/browser/new-relic-browser/browser-pro-features/browser-data-distributed-tracing">our config docs</a><span class="">.</span></div></div>',
  },

  { type: "html", html: "</br>" },
  {
    name: "privacy",
    desc: "Enable Privacy Cookies",
    default: true,
    disabled: false,
  },
  {
    type: "html",
    html: '<div>By default, New Relic doesn&#39;t retain any <a target="_blank" href="https://docs.newrelic.com/docs/browser/new-relic-browser/page-load-timing-resources/new-relic-cookies-used-browser#gdpr">personal data</a> collected by the Browser agent. We use cookies to store a <a target="_blank" href="https://docs.newrelic.com/docs/browser/new-relic-browser/page-load-timing-resources/new-relic-cookies-used-browser#jsessionid">session identifier</a> and to provide <a target="_blank" href="https://docs.newrelic.com/docs/browser/new-relic-browser/page-load-timing-resources/new-relic-cookies-used-browser#nreum">navigation timing data</a> in some older browsers.</br></br><div><i class="material-icons" style="font-size:15px;color:#FFD23D;">warning</i> <strong>If cookie collection is off, data relying on these cookies will not be available.</strong> For more information on GDPR requirements, see the <a target="_blank" href="https://ico.org.uk/for-organisations/guide-to-data-protection/">ICO Guide to Data Protection</a>.</div></div>',
  },
  { type: "html", html: "</br>" },
  {
    name: "session_replay",
    desc: "Enable Session Replay",
    default: false,
    disabled: false,
    options: [
      {
        name: "sampling_rate",
        type: "text",
        desc: "Sampling Rate",
        singleline: true,
        default: "100.0",
        disabled: false,
      },
      {
        name: "error_sampling_rate",
        type: "text",
        desc: "Error Sampling Rate",
        singleline: true,
        default: "100.0",
        disabled: false,
      },
      {
        name: "mask_all_inputs",
        type: "checkbox",
        desc: "Mask All Inputs",
        default: true,
        disabled: false,
      },
    ],
  },
  {
    type: "html",
    html: "<div>Session replay to track your users' interactions and engagment with the target site. Allowing you to review these sessions to troubleshoot errors, incidents, and other performance issues.</div>",
  },
  { type: "html", html: "</br>" },
  {
    type: "html",
    html: '<i class="material-icons" style="font-size:15px">key</i><h3>License Input</h3>',
  },
  {
    name: "loader_config",
    type: "object",
    options: [
      {
        name: "target_site",
        type: "text",
        desc: "target_site",
        singleline: true,
        default: "https://example.com/*",
        disabled: false,
      },
      {
        type: "html",
        html: '<i class="material-icons" style="font-size:15px;color:#878A8D;">description</i>Note: the <i>target_site</i> must contain a trailing slash and wildcard ("/*").</div>',
      },
      {
        name: "accountID",
        type: "text",
        desc: "accountID",
        singleline: true,
        default: "",
        disabled: false,
      },
      {
        name: "trustkey",
        type: "text",
        desc: "trustkey",
        singleline: true,
        default: "",
        disabled: false,
      },
      {
        name: "agentID",
        type: "text",
        desc: "agentID",
        singleline: true,
        default: "",
        disabled: false,
      },
      {
        name: "licenseKey",
        type: "text",
        desc: "licenseKey",
        singleline: true,
        default: "",
        disabled: false,
      },
      {
        name: "applicationID",
        type: "text",
        desc: "applicationID",
        singleline: true,
        default: "",
        disabled: false,
      },
      {
        type: "html",
        html:
          '<i class="material-icons" style="font-size:15px;color:#878A8D;">bookmark</i> See current: ' +
          `${template}` +
          " release notes",
      },
      {
        name: "version",
        type: "text",
        desc: "version",
        singleline: true,
        default: `${version}`,
        disabled: false,
      },
    ],
    desc: "`NREUM.loader_config`:",
    hidden: false,
  },
]);

chrome.options.addTab("Advanced", [
  {
    name: "optional_code",
    type: "text",
    desc: "Experimental `optional_code` snippet",
    disabled: false,
    singleline: true,
  },
  {
    type: "html",
    html: `<table>
    <tbody>
        <tr>
            <td><i class="material-icons" style="font-size:15px;color:#ffc107">warning</i><strong> Keep in mind:</strong> Loading script files dynamically can sometimes be tricky, below is an example snippet of the <i style="color:#c18401;">setTimeout(function, milliseconds)</i> method, which waits for the <a target="_blank" href="https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_methods_system_sobject.htm#apex_methods_system_sobject">$SObject Class</a> in Salesforce Lightning to become globally available in the <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/Window">Window</a> object, after waiting for a specified number of milliseconds.</td>
        </tr>
    </tbody>
</table>`,
    hidden: false,
  },
  {
    type: "html",
    html: `<table>
    <tbody>
        <tr>
            <td><pre><code style="display:block;overflow-x:auto;padding:0.5em;color:#abb2bf;background:#282c34"><span style="color:#c678dd">var</span> timeout;

<span class="hljs-function"><span style="color:#c678dd">function</span> <span style="color:#61aeee">waitForAura</span>(<span class="hljs-params"></span>) </span>{
    <span style="color:#c678dd">if</span> (<span style="color:#e6c07b">window</span>[<span style="color:#98c379">"$A"</span>]) {
        clearTimeout(timeout);
        newrelic.setCustomAttribute(<span style="color:#98c379">"userEmail"</span>, $A.get(<span style="color:#98c379">"$SObjectType.CurrentUser.Email"</span>));
        newrelic.setCustomAttribute(<span style="color:#98c379">"userId"</span>, $A.get(<span style="color:#98c379">"$SObjectType.CurrentUser.Id"</span>));
    } <span style="color:#c678dd">else</span> {
        timeout = setTimeout(waitForAura, <span style="color:#d19a66">1000</span>);
    }
}
waitForAura();</code></pre></td>
        </tr>
    </tbody>
</table>`,
    hidden: false,
  },
]);