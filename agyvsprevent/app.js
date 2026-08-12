document.addEventListener('DOMContentLoaded', () => {

  // Fetch Code Files for Previews & Clipboard
  const userjsCode = `// ==UserScript==
// @name         Prevent Zone Training Automator Pro
// @namespace    https://github.com/preventzone-automator
// @version      2.0
// @description  Automate 16x speed playback, auto-next navigation, and quiz completion for Prevent Zone / Storyline / Moodle training modules.
// @match        *://*.prevent.zone/*
// @match        *://psu.prevent.zone/*
// @include      file://*preventzone*
// @include      file://*loadSCO*
// @run-at       document-end
// @allFrames    true
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  // Configured with 16x playback speed, smart quiz solver, and auto-next observer
  console.log('[PreventZoneAuto] Active on frame:', window.location.href);
  // Full script available in preventzone-automation.user.js
})();`;

  const consoleCode = `(function () {
  'use strict';
  console.log('[PreventZoneConsole] Enforcing 16x speed & quiz solver...');

  function apply16x() {
    document.querySelectorAll('video, audio').forEach(m => { try { m.playbackRate = 16; } catch(e){} });
    if (window.DS && window.DS.appState) { try { window.DS.appState.setPlaybackSpeed(16); } catch(e){} }
  }

  function solveQuiz() {
    document.querySelectorAll('.que').forEach(q => {
      const radios = Array.from(q.querySelectorAll('input[type="radio"]:not([value="-1"])'));
      if (radios.length) { radios[0].checked = true; radios[0].dispatchEvent(new Event('change', {bubbles:true})); }
    });
  }

  apply16x();
  solveQuiz();
  setInterval(apply16x, 300);
})();`;

  // Populate Code Previews
  const previewUserjs = document.getElementById('code-preview-userjs');
  const previewConsole = document.getElementById('code-preview-console');
  if (previewUserjs) previewUserjs.textContent = userjsCode;
  if (previewConsole) previewConsole.textContent = consoleCode;

  // Toast Functionality
  const toast = document.getElementById('toast');
  function showToast(msg = 'Code copied to clipboard!') {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // Copy Clipboard Helper
  function copyTextToClipboard(text, msg) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => showToast(msg));
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast(msg);
    }
  }

  // Event Listeners for Copy Buttons
  document.getElementById('copy-userscript-btn').addEventListener('click', () => {
    fetch('preventzone-automation.user.js')
      .then(r => r.text())
      .then(code => copyTextToClipboard(code, 'Prevent Zone Userscript copied!'))
      .catch(() => copyTextToClipboard(userjsCode, 'Userscript snippet copied!'));
  });

  document.getElementById('copy-console-btn').addEventListener('click', () => {
    fetch('preventzone-console-bookmarklet.js')
      .then(r => r.text())
      .then(code => copyTextToClipboard(code, 'Console script copied!'))
      .catch(() => copyTextToClipboard(consoleCode, 'Console snippet copied!'));
  });

  document.querySelectorAll('[data-copy="userjs"]').forEach(btn => {
    btn.addEventListener('click', () => {
      fetch('preventzone-automation.user.js')
        .then(r => r.text())
        .then(code => copyTextToClipboard(code, 'Userscript copied!'))
        .catch(() => copyTextToClipboard(userjsCode, 'Userscript snippet copied!'));
    });
  });

  document.querySelectorAll('[data-copy="console"]').forEach(btn => {
    btn.addEventListener('click', () => {
      fetch('preventzone-console-bookmarklet.js')
        .then(r => r.text())
        .then(code => copyTextToClipboard(code, 'Console script copied!'))
        .catch(() => copyTextToClipboard(consoleCode, 'Console snippet copied!'));
    });
  });

  document.getElementById('copy-ext-guide').addEventListener('click', () => {
    const tabGuideBtn = document.querySelector('[data-tab="guide"]');
    if (tabGuideBtn) tabGuideBtn.click();
  });

  // Tab Navigation
  const tabBtns = document.querySelectorAll('.tab-btn');
  const viewPanels = document.querySelectorAll('.view-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      viewPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(`tab-${tabId}`);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // Live Simulator Frame Switching
  const simTabs = document.querySelectorAll('.sim-tab');
  const simFrame = document.getElementById('sim-frame');

  simTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      simTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const simType = tab.getAttribute('data-sim');
      if (simType === 'loadsco') {
        simFrame.src = '3. The Impact on Athletics _ Hazing Prevention_ Athletics 2026-2027 _ Prevent Zone PSU_files/loadSCO.html';
      } else if (simType === 'quiz') {
        simFrame.src = '5. Quiz _ Prevent Zone PSU.html';
      }
    });
  });
});
