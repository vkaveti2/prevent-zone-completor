document.addEventListener('DOMContentLoaded', () => {
  const statusEl = document.getElementById('ext-status');

  function sendToActiveTab(codeSnippet, successMsg) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id, allFrames: true },
        func: codeSnippet
      }, () => {
        if (statusEl) statusEl.textContent = successMsg;
      });
    });
  }

  document.getElementById('btn-16x').addEventListener('click', () => {
    sendToActiveTab(() => {
      if (window.setSpeed) window.setSpeed(16);
      const media = document.querySelectorAll('video, audio');
      media.forEach(m => { try { m.playbackRate = 16; } catch(e){} });
    }, 'Speed: 16x');
  });

  document.getElementById('btn-autonext').addEventListener('click', () => {
    sendToActiveTab(() => {
      const btn = document.getElementById('pza-btn-autonext');
      if (btn) btn.click();
    }, 'Auto-Next Toggled');
  });

  document.getElementById('btn-solve').addEventListener('click', () => {
    sendToActiveTab(() => {
      const btn = document.getElementById('pza-btn-solvequiz');
      if (btn) btn.click();
    }, 'Quiz Answers Selected');
  });

  document.getElementById('btn-submit').addEventListener('click', () => {
    sendToActiveTab(() => {
      const btn = document.getElementById('pza-btn-submitquiz');
      if (btn) btn.click();
    }, 'Quiz Submitted');
  });
});
