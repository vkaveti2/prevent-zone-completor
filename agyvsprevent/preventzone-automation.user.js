// ==UserScript==
// @name         Prevent Zone Training Automator Pro
// @namespace    https://github.com/preventzone-automator
// @version      2.2
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

  // Configuration & State
  const CONFIG = {
    targetSpeed: 16,
    autoNextEnabled: false,
    autoNextIntervalMs: 800,
    mediaSyncIntervalMs: 250
  };

  const isIframe = window.self !== window.top;
  const frameLabel = isIframe ? 'iFrame (Player)' : 'Main Window';
  let autoNextTimer = null;
  let mediaSyncTimer = null;

  const log = (...args) => console.log(`[PreventZoneAuto | ${frameLabel}]`, ...args);

  // Status Logger Function
  function updateStatus(msg) {
    const statusEl = document.getElementById('pza-status-text');
    if (statusEl) {
      statusEl.textContent = msg;
    }
    log(msg);
  }

  // -------------------------------------------------------------
  // CROSS-FRAME COMMUNICATION & STATE SYNC
  // -------------------------------------------------------------

  window.addEventListener('message', (event) => {
    if (!event.data || typeof event.data !== 'object') return;
    
    if (event.data.type === 'PZA_SET_AUTONEXT') {
      CONFIG.autoNextEnabled = !!event.data.enabled;
      syncAutoNextLoop();
    } else if (event.data.type === 'PZA_TRIGGER_NEXT') {
      runAutoNextCheck();
    } else if (event.data.type === 'PZA_SOLVE_QUIZ') {
      autoSolveQuiz();
    } else if (event.data.type === 'PZA_SET_SPEED') {
      setSpeed(event.data.speed || 16);
    }
  });

  function isAutoNextActive() {
    try {
      return localStorage.getItem('pza_autonext_active') === 'true' || CONFIG.autoNextEnabled;
    } catch(e) {
      return CONFIG.autoNextEnabled;
    }
  }

  function setAutoNextState(enabled) {
    CONFIG.autoNextEnabled = enabled;
    try {
      localStorage.setItem('pza_autonext_active', enabled ? 'true' : 'false');
    } catch(e) {}

    // Broadcast to iframe children
    const iframes = document.querySelectorAll('iframe, frame');
    iframes.forEach((iframe) => {
      try {
        iframe.contentWindow.postMessage({ type: 'PZA_SET_AUTONEXT', enabled: enabled }, '*');
      } catch(e) {}
    });

    syncAutoNextLoop();
  }

  function syncAutoNextLoop() {
    const active = isAutoNextActive();
    const btn = document.getElementById('pza-btn-autonext');
    if (btn) {
      btn.textContent = `▶ Auto-Click Next: ${active ? 'ON' : 'OFF'}`;
      if (active) btn.classList.add('active');
      else btn.classList.remove('active');
    }

    if (active) {
      if (!autoNextTimer) {
        autoNextTimer = setInterval(() => {
          runAutoNextCheck();
        }, CONFIG.autoNextIntervalMs);
      }
    } else {
      if (autoNextTimer) {
        clearInterval(autoNextTimer);
        autoNextTimer = null;
      }
    }
  }

  // -------------------------------------------------------------
  // 1. SPEED ENFORCEMENT & 16X MENU ITEM INJECTION
  // -------------------------------------------------------------

  function applyPlaybackRateToMedia(speed = CONFIG.targetSpeed) {
    const mediaElements = Array.from(document.querySelectorAll('video, audio'));
    mediaElements.forEach((media) => {
      try {
        if (media.playbackRate !== speed) {
          media.playbackRate = speed;
        }
      } catch (e) {}
    });

    if (window.DS && window.DS.appState && typeof window.DS.appState.setPlaybackSpeed === 'function') {
      try {
        window.DS.appState.setPlaybackSpeed(speed);
      } catch (e) {}
    }

    return mediaElements.length;
  }

  function inject16xSpeedMenuItem() {
    const speedItems = Array.from(document.querySelectorAll('.cs-listitem.menu-choice[data-speed], div[data-speed]'));
    if (!speedItems.length) return false;

    let item16 = document.querySelector('.cs-listitem.menu-choice[data-speed="16"]');
    if (!item16) {
      const template = speedItems.find(el => el.getAttribute('data-speed') === '1') || speedItems[0];
      const parentLi = template.closest('li');

      if (parentLi && parentLi.parentNode) {
        const newLi = parentLi.cloneNode(true);
        item16 = newLi.querySelector('.cs-listitem.menu-choice') || newLi.querySelector('[data-speed]');
        
        if (item16) {
          item16.setAttribute('data-speed', '16');
          item16.setAttribute('aria-label', '16');
          item16.setAttribute('data-index', '99');
          item16.classList.remove('selected');
          item16.setAttribute('aria-checked', 'false');

          const label = item16.querySelector('.label, [data-ref^="label"]');
          if (label) {
            label.textContent = '16x Speed';
            label.setAttribute('data-ref', 'label16');
          }

          parentLi.parentNode.insertBefore(newLi, parentLi.parentNode.firstChild);

          item16.addEventListener('click', (e) => {
            e.stopPropagation();
            setSpeed(16);
            updateSpeedMenuUI(16);
          });

          log('Successfully injected 16x speed option into Storyline menu!');
        }
      }
    }
    return true;
  }

  function updateSpeedMenuUI(speed) {
    const speedItems = Array.from(document.querySelectorAll('.cs-listitem.menu-choice[data-speed]'));
    speedItems.forEach((item) => {
      const itemSpeed = parseFloat(item.getAttribute('data-speed'));
      if (itemSpeed === speed) {
        item.classList.add('selected');
        item.setAttribute('aria-checked', 'true');
      } else {
        item.classList.remove('selected');
        item.setAttribute('aria-checked', 'false');
      }
    });
  }

  function setSpeed(speed = 16) {
    CONFIG.targetSpeed = speed;
    applyPlaybackRateToMedia(speed);
    inject16xSpeedMenuItem();
    updateSpeedMenuUI(speed);

    if (mediaSyncTimer) clearInterval(mediaSyncTimer);
    mediaSyncTimer = setInterval(() => {
      applyPlaybackRateToMedia(CONFIG.targetSpeed);
      inject16xSpeedMenuItem();
    }, CONFIG.mediaSyncIntervalMs);

    updateStatus(`Playback speed set to ${speed}x`);
  }

  function skipMedia() {
    const mediaElements = Array.from(document.querySelectorAll('video, audio'));
    let skipped = 0;
    mediaElements.forEach((media) => {
      if (media.duration && !isNaN(media.duration) && media.currentTime < media.duration - 0.5) {
        media.currentTime = media.duration - 0.2;
        skipped++;
      }
    });
    updateStatus(`Fast-forwarded ${skipped} media item(s)`);
  }

  // -------------------------------------------------------------
  // 2. SMART QUIZ SOLVER
  // -------------------------------------------------------------

  function triggerInputEvents(element) {
    if (!element) return;
    try {
      element.checked = true;
      element.dispatchEvent(new Event('change', { bubbles: true }));
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    } catch (e) {}
  }

  function autoSolveQuiz() {
    let answeredCount = 0;

    const moodleQuestions = Array.from(document.querySelectorAll('.que'));
    if (moodleQuestions.length) {
      moodleQuestions.forEach((q) => {
        const validRadios = Array.from(q.querySelectorAll('input[type="radio"]:not([value="-1"])'));
        if (validRadios.length) {
          const targetRadio = validRadios.find(r => r.checked) || validRadios[0];
          triggerInputEvents(targetRadio);
          answeredCount++;
        }

        const checkboxes = Array.from(q.querySelectorAll('input[type="checkbox"]'));
        checkboxes.forEach((cb) => {
          if (!cb.checked) {
            triggerInputEvents(cb);
            answeredCount++;
          }
        });

        const selects = Array.from(q.querySelectorAll('select'));
        selects.forEach((select) => {
          if (select.options.length > 1 && select.selectedIndex <= 0) {
            select.selectedIndex = 1;
            select.dispatchEvent(new Event('change', { bubbles: true }));
            answeredCount++;
          }
        });
      });
    }

    const storylineChoices = Array.from(document.querySelectorAll(
      '.choice-control, [role="radio"]:not([aria-checked="true"]), [role="checkbox"]:not([aria-checked="true"]), .cs-choice'
    ));
    if (storylineChoices.length) {
      storylineChoices.forEach((choice) => {
        try {
          choice.click();
          answeredCount++;
        } catch (e) {}
      });
    }

    if (!moodleQuestions.length && !storylineChoices.length) {
      const genericRadios = Array.from(document.querySelectorAll('input[type="radio"]:not([value="-1"])'));
      const names = new Set();
      genericRadios.forEach((r) => {
        if (!names.has(r.name)) {
          names.add(r.name);
          triggerInputEvents(r);
          answeredCount++;
        }
      });
    }

    updateStatus(`Selected ${answeredCount} quiz answer option(s)`);
    return answeredCount;
  }

  function submitQuizAttempt() {
    const finishBtn = document.querySelector('#mod_quiz-next-nav, input[name="next"][value*="Finish"], input[type="submit"][value*="Finish attempt"]');
    if (finishBtn) {
      finishBtn.click();
      updateStatus('Clicked "Finish attempt ..."');
      return true;
    }

    const submitAllBtn = document.querySelector('input[type="submit"][value*="Submit all"], button.btn-finishattempt, .confirmation-buttons input[type="submit"]');
    if (submitAllBtn) {
      submitAllBtn.click();
      updateStatus('Clicked "Submit all and finish"');
      return true;
    }

    updateStatus('No quiz submission button found');
    return false;
  }

  // -------------------------------------------------------------
  // 3. AUTO-NEXT NAVIGATOR (MULTI-FRAME & IFRAME INSPECTION)
  // -------------------------------------------------------------

  function runAutoNextCheck() {
    let clicked = tryClickNextButtonInDoc(document);
    
    // If top window and next button not found in top document, search inside iframe documents
    if (!clicked && window.self === window.top) {
      const iframes = Array.from(document.querySelectorAll('iframe, frame'));
      for (const iframe of iframes) {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
          if (iframeDoc && tryClickNextButtonInDoc(iframeDoc)) {
            clicked = true;
            break;
          }
        } catch(e) {
          try {
            iframe.contentWindow.postMessage({ type: 'PZA_TRIGGER_NEXT' }, '*');
          } catch(err) {}
        }
      }
    }
    return clicked;
  }

  function tryClickNextButtonInDoc(doc) {
    if (!doc) return false;

    const selectors = [
      '#next:not([aria-disabled="true"]):not([disabled])',
      'button[aria-label*="Next"]:not([aria-disabled="true"])',
      '#submit:not([style*="display: none"]):not([style*="display:none"])',
      'button[aria-label*="Submit"]:not([style*="display: none"])',
      'input[name="next"]',
      '#mod_quiz-next-nav',
      '.next-activity-link',
      'a[aria-label*="Next"]',
      'a.btn-primary[href*="mod/scorm"]',
      'a.btn-primary[href*="mod/quiz"]'
    ];

    for (const selector of selectors) {
      const btn = doc.querySelector(selector);
      if (btn && isVisible(btn)) {
        try {
          btn.click();
          log('Clicked Next button via selector:', selector);
          updateStatus(`Clicked: ${btn.id || btn.getAttribute('aria-label') || btn.innerText || btn.value || 'Next'}`);
          return true;
        } catch (e) {
          log('Click failed on selector:', selector, e);
        }
      }
    }

    const storylineNext = doc.querySelector('#next');
    if (storylineNext && isVisible(storylineNext)) {
      storylineNext.removeAttribute('disabled');
      storylineNext.setAttribute('aria-disabled', 'false');
      try {
        storylineNext.click();
        updateStatus('Enabled & clicked Storyline #next button');
        return true;
      } catch (e) {}
    }

    return false;
  }

  function isVisible(el) {
    if (!el) return false;
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetWidth > 0 && el.offsetHeight > 0;
  }

  // -------------------------------------------------------------
  // 4. FLOATING OVERLAY WIDGET (DRAGGABLE & SINGLE TOP-FRAME UI)
  // -------------------------------------------------------------

  function makeElementDraggable(root, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    handle.style.cursor = 'grab';
    handle.addEventListener('mousedown', dragMouseDown);

    function dragMouseDown(e) {
      if (e.target.closest('.pza-toggle-btn')) return;
      e.preventDefault();
      handle.style.cursor = 'grabbing';
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.addEventListener('mouseup', closeDragElement);
      document.addEventListener('mousemove', elementDrag);
    }

    function elementDrag(e) {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      const rect = root.getBoundingClientRect();
      const newTop = rect.top - pos2;
      const newLeft = rect.left - pos1;

      root.style.bottom = 'auto';
      root.style.right = 'auto';
      root.style.top = Math.max(0, Math.min(window.innerHeight - rect.height, newTop)) + 'px';
      root.style.left = Math.max(0, Math.min(window.innerWidth - rect.width, newLeft)) + 'px';
    }

    function closeDragElement() {
      handle.style.cursor = 'grab';
      document.removeEventListener('mouseup', closeDragElement);
      document.removeEventListener('mousemove', elementDrag);
      try {
        localStorage.setItem('pza_pos_top', root.style.top);
        localStorage.setItem('pza_pos_left', root.style.left);
      } catch (err) {}
    }

    try {
      const savedTop = localStorage.getItem('pza_pos_top');
      const savedLeft = localStorage.getItem('pza_pos_left');
      if (savedTop && savedLeft) {
        root.style.bottom = 'auto';
        root.style.right = 'auto';
        root.style.top = savedTop;
        root.style.left = savedLeft;
      }
    } catch (err) {}
  }

  function createFloatingUI() {
    const legacyPanel = document.getElementById('preventzone-automation-panel');
    if (legacyPanel) legacyPanel.remove();

    // Only render visual UI card in TOP window
    if (window.self !== window.top) {
      log('Player iframe context active (suppressing duplicate UI).');
      return;
    }

    if (document.getElementById('preventzone-automator-root')) return;

    const style = document.createElement('style');
    style.textContent = `
      #preventzone-automator-root {
        position: fixed;
        bottom: 18px;
        right: 18px;
        z-index: 2147483647;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        color: #f1f5f9;
        user-select: none;
      }
      .pza-card {
        background: rgba(15, 23, 42, 0.94);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 14px;
        box-shadow: 0 16px 36px rgba(0, 0, 0, 0.55);
        width: 290px;
        overflow: hidden;
      }
      .pza-header {
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        padding: 10px 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: 600;
        font-size: 13px;
        letter-spacing: 0.3px;
        cursor: grab;
      }
      .pza-header:active { cursor: grabbing; }
      .pza-drag-icon { opacity: 0.6; margin-right: 4px; }
      .pza-badge {
        background: rgba(255,255,255,0.2);
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 6px;
        font-weight: 500;
      }
      .pza-toggle-btn {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 14px;
        line-height: 1;
        padding: 2px 6px;
        opacity: 0.85;
      }
      .pza-toggle-btn:hover { opacity: 1; background: rgba(255,255,255,0.2); border-radius: 4px; }
      .pza-body {
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .pza-section-title {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        color: #94a3b8;
        margin-bottom: 4px;
      }
      .pza-speed-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 4px;
      }
      .pza-speed-btn {
        background: #1e293b;
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: #cbd5e1;
        padding: 6px 0;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        text-align: center;
      }
      .pza-speed-btn:hover {
        background: #334155;
        color: white;
      }
      .pza-speed-btn.active {
        background: #2563eb;
        color: white;
        border-color: #3b82f6;
        box-shadow: 0 0 10px rgba(37, 99, 235, 0.4);
      }
      .pza-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        width: 100%;
        padding: 8px 10px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: #1e293b;
        color: #f1f5f9;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
      }
      .pza-btn:hover { background: #334155; }
      .pza-btn.active {
        background: #059669;
        border-color: #10b981;
        color: white;
      }
      .pza-btn-primary {
        background: #2563eb;
        border-color: #3b82f6;
      }
      .pza-btn-primary:hover { background: #1d4ed8; }
      .pza-footer {
        font-size: 11px;
        color: #64748b;
        border-top: 1px solid rgba(255, 255, 255, 0.06);
        padding-top: 8px;
        text-align: center;
        word-break: break-word;
      }
    `;
    document.head.appendChild(style);

    const root = document.createElement('div');
    root.id = 'preventzone-automator-root';
    root.innerHTML = `
      <div class="pza-card" id="pza-card">
        <div class="pza-header" id="pza-header">
          <div class="pza-header-title">
            <span class="pza-drag-icon">⋮⋮</span> ⚡ Prevent Zone Auto <span class="pza-badge">${frameLabel}</span>
          </div>
          <button class="pza-toggle-btn" id="pza-minimize-btn" title="Minimize">—</button>
        </div>
        <div class="pza-body" id="pza-body-content">
          <div>
            <div class="pza-section-title">Playback Speed</div>
            <div class="pza-speed-grid">
              <button class="pza-speed-btn" data-speed="1">1x</button>
              <button class="pza-speed-btn" data-speed="2">2x</button>
              <button class="pza-speed-btn" data-speed="4">4x</button>
              <button class="pza-speed-btn" data-speed="8">8x</button>
              <button class="pza-speed-btn active" data-speed="16">16x</button>
            </div>
          </div>
          <button class="pza-btn" id="pza-btn-skip">⏩ Skip / Fast-Forward Media</button>
          <button class="pza-btn" id="pza-btn-autonext">▶ Auto-Click Next: OFF</button>
          <button class="pza-btn pza-btn-primary" id="pza-btn-solvequiz">🎯 Solve & Select Quiz Answers</button>
          <button class="pza-btn" id="pza-btn-submitquiz">📤 Submit Quiz Attempt</button>
          <div class="pza-footer" id="pza-status-text">Draggable Control Bar</div>
        </div>
      </div>
    `;
    document.body.appendChild(root);

    const bodyContent = document.getElementById('pza-body-content');
    const minBtn = document.getElementById('pza-minimize-btn');
    const header = document.getElementById('pza-header');

    makeElementDraggable(root, header);

    minBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (bodyContent.style.display === 'none') {
        bodyContent.style.display = 'flex';
        minBtn.textContent = '—';
      } else {
        bodyContent.style.display = 'none';
        minBtn.textContent = '+';
      }
    });

    const speedBtns = Array.from(document.querySelectorAll('.pza-speed-btn'));
    speedBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        speedBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const speed = parseFloat(btn.getAttribute('data-speed'));
        setSpeed(speed);
      });
    });

    document.getElementById('pza-btn-skip').addEventListener('click', skipMedia);

    document.getElementById('pza-btn-autonext').addEventListener('click', () => {
      const newState = !isAutoNextActive();
      setAutoNextState(newState);
    });

    document.getElementById('pza-btn-solvequiz').addEventListener('click', () => {
      autoSolveQuiz();
      // Broadcast to frames as well
      const iframes = document.querySelectorAll('iframe, frame');
      iframes.forEach((iframe) => {
        try { iframe.contentWindow.postMessage({ type: 'PZA_SOLVE_QUIZ' }, '*'); } catch(e){}
      });
    });

    document.getElementById('pza-btn-submitquiz').addEventListener('click', submitQuizAttempt);
  }

  // -------------------------------------------------------------
  // INITIALIZATION
  // -------------------------------------------------------------

  function init() {
    log('Initializing Prevent Zone Automator Pro...');
    createFloatingUI();
    setSpeed(16);
    syncAutoNextLoop();
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
