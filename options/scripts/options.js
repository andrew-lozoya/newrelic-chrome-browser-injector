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

chrome.options.addTab('General', [
    { type: 'html', html: '<i class="material-icons" style="font-size:14px">build</i> <h3>Experimental Options</h3>' },
    { type: 'html', html: '<div>This will deploy the agent via one of the option you select by dom injection.</div>' },
    {
        type: 'radio',
        desc: '',
        options: [
            { type: 'radio', value: 'off', desc: 'Off - Disables Browser Application Monitoring instrumentation.' },
            { type: 'radio', value: 'lite', desc: 'Lite - Basic page load timing instrumentation.' },
            { type: 'radio', value: 'pro', desc: 'Pro - Instrumentation supporting all Pro features.' },
            { type: 'radio', value: 'pro+spa', desc: 'Pro + SPA - Instrumentation supporting all Pro and SPA features. To learn more about SPA, visit our documentation.' }
        ],
        disabled: false,
        default: 'pro+spa'
    },

    { type: 'html', html: '</br>', hidden: false },
    { name: 'csp', desc: 'Enable Content Security Policy (CSP) Bypass', default: true, disabled: true, hidden: false },
    { type: 'html', html: `<div><a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP">Content Security Policy (CSP)</a> is an added layer of security on some websites that can help to detect and mitigate certain types of data injection. Thus preventing client side injection of the New Relic Browser Agent.</br>If CSP is not bypassed you may see the following console log: <pre><code style="overflow-x:auto;padding:0.5em;color:#383a42;background:#fafafa"><i><span style="color:#FF0000;">"Refused to load the script</span> 'https://js-agent.newrelic.com/nr-spa-${version}.min.js' <span style="color:#FF0000;">because it violoates the following Content Security Policy directive"</i></span></code></pre></div>`, hidden: false },

    { type: 'html', html: '</br>' },
    { name: 'dt', desc: 'Enable Distributed Tracing', default: true, disabled: false },
    { type: 'html', html: '<div><div>Monitor and analyze your Browser requests from end to end as they travel across distributed systems. </div><div><span><strong>Requires APM Pro agent and Browser Pro + SPA agent and account. </strong><!-- react-text: 77 -->To ensure that APM transaction data is collected as expected, please refer to the minimum required APM language agent versions under the "Requirements and compatibility" section of </span><a target="_blank" href="https://docs.newrelic.com/docs/browser/new-relic-browser/browser-pro-features/browser-data-distributed-tracing">our config docs</a><span class="">.</span></div></div>' },

    { type: 'html', html: '</br>' },
    { name: 'privacy', desc: 'Enable Privacy Cookies', default: true, disabled: false },
    { type: 'html', html: '<div>By default, New Relic doesn&#39;t retain any <a target="_blank" href="https://docs.newrelic.com/docs/browser/new-relic-browser/page-load-timing-resources/new-relic-cookies-used-browser#gdpr">personal data</a> collected by the Browser agent. We use cookies to store a <a target="_blank" href="https://docs.newrelic.com/docs/browser/new-relic-browser/page-load-timing-resources/new-relic-cookies-used-browser#jsessionid">session identifier</a> and to provide <a target="_blank" href="https://docs.newrelic.com/docs/browser/new-relic-browser/page-load-timing-resources/new-relic-cookies-used-browser#nreum">navigation timing data</a> in some older browsers.</br></br><div><i class="material-icons" style="font-size:12px;color:#ffc107">warning</i> <strong>If cookie collection is off, data relying on these cookies will not be available.</strong> For more information on GDPR requirements, see the <a target="_blank" href="https://ico.org.uk/for-organisations/guide-to-data-protection/">ICO Guide to Data Protection</a>.</div></div>' },

    { type: 'html', html: '<i class="material-icons" style="font-size:14px">settings</i> <h3>License</h3>' },
    {
        name: 'loader_config',
        type: 'object',
        options: [
            { name: 'target_site', type: 'text', desc: 'target_site', singleline: true, default: 'https://newrelic-neworg.lightning.force.com/*', disabled: false },
            { name: 'accountID', type: 'text', desc: 'accountID', singleline: true, default: '2075557', disabled: false },
            { name: 'trustkey', type: 'text', desc: 'trustkey', singleline: true, default: '2075557', disabled: false },
            { name: 'agentID', type: 'text', desc: 'agentID', singleline: true, default: '1042750645', disabled: false },
            { name: 'licenseKey', type: 'text', desc: 'licenseKey', singleline: true, default: 'b3855b2deb', disabled: false },
            { name: 'applicationID', type: 'text', desc: 'applicationID', singleline: true, default: '1042750645', disabled: false },
            { type: 'html', html: '<i class="material-icons" style="font-size:14px;color:#0ab0bf;">bookmark_border</i> See current: ' + `${template}` + ' release notes' },
            { name: 'version', type: 'text', desc: 'version', singleline: true, default: `${version}`, disabled: false }
        ],
        desc: 'New Relic `loader_config` (this is an object type)',
        hidden: false
    },

]);

chrome.options.addTab('Advanced', [
    { name: 'optional_code', type: 'text', desc: 'Experimental `optional_code` snippet', disabled: false, singleline: true },
    { type: 'html', html: `<table>
    <tbody>
        <tr>
            <td><i class="material-icons" style="font-size:12px;color:#ffc107">warning</i><strong> Keep in mind:</strong> Loading script files dynamically can sometimes be tricky, below is an example snippet of the <i style="color:#c18401;">setTimeout(function, milliseconds)</i> method, which waits for the <a target="_blank" href="https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_methods_system_sobject.htm#apex_methods_system_sobject">$SObject Class</a> in Salesforce Lightning to become globally available in the <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/Window">Window</a> object, after waiting for a specified number of milliseconds.</td>
        </tr>
    </tbody>
</table>`, hidden: false },
    { type: 'html', html: `<table>
    <tbody>
        <tr>
            <td><pre><code style="display:block;overflow-x:auto;padding:0.5em;color:#383a42;background:#fafafa"><span style="color:#a626a4">var</span> timeout;

<span class="hljs-function"><span style="color:#a626a4">function</span> <span style="color:#4078f2">waitForAura</span>(<span class="hljs-params"></span>) </span>{
    <span style="color:#a626a4">if</span> (<span style="color:#c18401">window</span>[<span style="color:#50a14f">"$A"</span>]) {
        clearTimeout(timeout);
        newrelic.setCustomAttribute(<span style="color:#50a14f">"userEmail"</span>, $A.get(<span style="color:#50a14f">"$SObjectType.CurrentUser.Email"</span>));
        newrelic.setCustomAttribute(<span style="color:#50a14f">"userId"</span>, $A.get(<span style="color:#50a14f">"$SObjectType.CurrentUser.Id"</span>));
    } <span style="color:#a626a4">else</span> {
        timeout = setTimeout(waitForAura, <span style="color:#986801">1000</span>);
    }
}
waitForAura();</code></pre></td>
        </tr>
    </tbody>
</table>`, hidden: false }


]);