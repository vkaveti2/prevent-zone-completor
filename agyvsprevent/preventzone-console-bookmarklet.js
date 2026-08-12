/**
 * Prevent Zone Automator Pro - Console / Bookmarklet Injector
 * 
 * Instructions:
 * 1. Copy the code below.
 * 2. Press F12 in your browser to open DevTools -> Console.
 * 3. Paste the code and press Enter.
 * 
 * OR create a new Bookmark in your browser, set the Name to "Prevent Zone Auto",
 * and set the URL to the JavaScript bookmarklet line at the top.
 */

/* === BOOKMARKLET ONE-LINER (Drag/Paste into Bookmark URL) ===
javascript:(function(){var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/...';document.head.appendChild(s);})();
*/

/* === DIRECT DEVTOOLS CONSOLE INJECTION CODE === */
(function () {
  'use strict';
  console.log('[PreventZoneConsole] Injecting 16x Speed & Auto-Next Engine...');

  // 1. Force 16x Playback Speed on Media
  function apply16xSpeed() {
    const media = document.querySelectorAll('video, audio');
    media.forEach(m => { try { m.playbackRate = 16; } catch(e){} });
    if (window.DS && window.DS.appState && typeof window.DS.appState.setPlaybackSpeed === 'function') {
      try { window.DS.appState.setPlaybackSpeed(16); } catch(e){}
    }
  }

  // 2. Inject 16x item into Storyline speed dropdown
  function inject16xMenuItem() {
    const speedItems = Array.from(document.querySelectorAll('.cs-listitem.menu-choice[data-speed], div[data-speed]'));
    if (!speedItems.length) return;
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
          item16.classList.add('selected');
          item16.setAttribute('aria-checked', 'true');
          const label = item16.querySelector('.label, [data-ref^="label"]');
          if (label) label.textContent = '16x Speed';
          parentLi.parentNode.insertBefore(newLi, parentLi.parentNode.firstChild);
          item16.addEventListener('click', () => apply16xSpeed());
        }
      }
    }
  }

  // 3. Smart Quiz Solver
  function solveQuiz() {
    let count = 0;
    const moodleQs = document.querySelectorAll('.que');
    moodleQs.forEach(q => {
      const validRadios = Array.from(q.querySelectorAll('input[type="radio"]:not([value="-1"])'));
      if (validRadios.length) {
        const r = validRadios[0];
        r.checked = true;
        r.dispatchEvent(new Event('change', { bubbles: true }));
        r.dispatchEvent(new Event('input', { bubbles: true }));
        r.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        count++;
      }
      const cbs = q.querySelectorAll('input[type="checkbox"]');
      cbs.forEach(cb => {
        cb.checked = true;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
        cb.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        count++;
      });
    });

    const storylineChoices = document.querySelectorAll('.choice-control, [role="radio"], [role="checkbox"]');
    storylineChoices.forEach(c => { try { c.click(); count++; } catch(e){} });
    console.log(`[PreventZoneConsole] Selected ${count} quiz answer option(s).`);
  }

  // 4. Auto Next Button Clicker
  function clickNext() {
    const selectors = [
      '#next:not([aria-disabled="true"]):not([disabled])',
      'button[aria-label*="Next"]:not([aria-disabled="true"])',
      '#submit:not([style*="display: none"])',
      'input[name="next"]',
      '#mod_quiz-next-nav',
      '.next-activity-link'
    ];
    for (const sel of selectors) {
      const btn = document.querySelector(sel);
      if (btn && btn.offsetWidth > 0 && btn.offsetHeight > 0) {
        btn.click();
        console.log('[PreventZoneConsole] Clicked Next element:', btn);
        return true;
      }
    }
    const storylineNext = document.querySelector('#next');
    if (storylineNext) {
      storylineNext.removeAttribute('disabled');
      storylineNext.setAttribute('aria-disabled', 'false');
      try { storylineNext.click(); } catch(e){}
    }
  }

  // Run immediately & set interval loops
  apply16xSpeed();
  inject16xMenuItem();
  setInterval(() => {
    apply16xSpeed();
    inject16xMenuItem();
  }, 300);

  // Expose global controller in console window
  window.PreventZoneAutomator = {
    setSpeed16: apply16xSpeed,
    solveQuiz: solveQuiz,
    clickNext: clickNext,
    startAutoNext: function(intervalMs = 1000) {
      if (window._pzaNextTimer) clearInterval(window._pzaNextTimer);
      window._pzaNextTimer = setInterval(clickNext, intervalMs);
      console.log('[PreventZoneConsole] Auto-Next loop STARTED.');
    },
    stopAutoNext: function() {
      if (window._pzaNextTimer) clearInterval(window._pzaNextTimer);
      console.log('[PreventZoneConsole] Auto-Next loop STOPPED.');
    }
  };

  console.log('[PreventZoneConsole] Injected successfully! Use PreventZoneAutomator in console:');
  console.log(' - PreventZoneAutomator.solveQuiz()');
  console.log(' - PreventZoneAutomator.startAutoNext()');
  console.log(' - PreventZoneAutomator.setSpeed16()');
})();
