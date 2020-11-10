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

    { type: 'html', html: '</br>' },
    { name: 'dt', desc: 'Enable Distributed Tracing', default: true, disabled: false },
    { type: 'html', html: '<div><div>Monitor and analyze your Browser requests from end to end as they travel across distributed systems. </div><div><span><strong>Requires APM Pro agent and Browser Pro + SPA agent and account. </strong><!-- react-text: 77 -->To ensure that APM transaction data is collected as expected, please refer to the minimum required APM language agent versions under the "Requirements and compatibility" section of <!-- /react-text --></span><a target="_blank" href="https://docs.newrelic.com/docs/browser/new-relic-browser/browser-pro-features/browser-data-distributed-tracing">our config docs</a><span class="">.</span></div></div>' },

    { type: 'html', html: '</br>' },
    { name: 'privacy', desc: 'Enable Privacy Cookies', default: true, disabled: false },
    { type: 'html', html: '<div>By default, New Relic doesn&#39;t retain any <a target="_blank" href="https://docs.newrelic.com/docs/browser/new-relic-browser/page-load-timing-resources/new-relic-cookies-used-browser#gdpr">personal data</a> collected by the Browser agent. We use cookies to store a <a target="_blank" href="https://docs.newrelic.com/docs/browser/new-relic-browser/page-load-timing-resources/new-relic-cookies-used-browser#jsessionid">session identifier</a> and to provide <a target="_blank" href="https://docs.newrelic.com/docs/browser/new-relic-browser/page-load-timing-resources/new-relic-cookies-used-browser#nreum">navigation timing data</a> in some older browsers.</br></br><div><i class="material-icons" style="font-size:12px;color:#ffc107">warning</i> <strong>If cookie collection is off, data relying on these cookies will not be available.</strong> For more information on GDPR requirements, see the <a target="_blank" href="https://ico.org.uk/for-organisations/guide-to-data-protection/">ICO Guide to Data Protection</a>.</div></div>' },

    { type: 'html', html: '<i class="material-icons" style="font-size:14px">settings</i> <h3>License</h3>' },
    {
        name: 'loader_config',
        type: 'object',
        options: [
            { name: 'target_site', type: 'text', desc: 'target_site', singleline: true, default: 'https://personal-d9.lightning.force.com/*', disabled: false },
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
    { name: 'optional_code', type: 'text', desc: 'Experimental `optional_code` snippet', disabled: true, singleline: true }
]);