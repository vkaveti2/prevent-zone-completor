# Prevent Zone Training Automator Pro ⚡

A comprehensive automation suite for volleyball team training modules on **Prevent Zone / Moodle / Articulate Storyline 360**.

---

## 🌟 Key Features

1. **⚡ 16x Playback Speed & Speed Menu Injection**:
   - Injects a `16x Speed` item directly into Articulate Storyline's playback speed dropdown menu (`<div class="cs-listitem menu-choice" data-speed="16">16x Speed</div>`).
   - Automatically overrides all `<video>` and `<audio>` tags to `16x` playback rate.
   - Triggers internal Storyline `DS.appState.setPlaybackSpeed(16)` timeline sync.
   - Includes a **Skip / Fast-Forward Media** button to advance videos instantly.

2. **🎯 Smart Quiz Solver**:
   - Fixed quiz answer selection logic for Moodle quizzes (`.que` blocks) and Storyline embedded slides.
   - Correctly ignores hidden dummy inputs (`value="-1"`) and selects valid radio/checkbox answers.
   - Dispatches full DOM events (`click`, `change`, `input`) so Moodle/Storyline registers the selections.
   - Features **Submit Quiz Attempt** for single-click attempt completion.

3. **▶ Auto-Click Next Button**:
   - Continuous observer that monitors `#next`, `#submit`, `button[aria-label*="Next"]`, `#mod_quiz-next-nav`, and `.next-activity-link`.
   - Automatically unlocks disabled buttons (`aria-disabled="true"`) once media finishes and clicks Next.
   - Cross-frame iframe support (`@allFrames true`) enables auto-clicking inside `loadSCO.html` SCORM player frames.

4. **⚡ Floating Overlay Widget**:
   - Glassmorphic UI control panel fixed to the bottom-right corner of your browser window.
   - Quick speed selector (1x, 2x, 4x, 8x, 16x), Auto-Next toggle, Quiz solver button, and minimize controls.

---

## 🛠 Delivery Methods & How to Use

### Method 1: Tampermonkey Userscript (Recommended)
1. Install [Tampermonkey](https://www.tampermonkey.net/) in Chrome, Edge, or Firefox.
2. Open Tampermonkey dashboard -> **Add a new script**.
3. Copy the contents of `preventzone-automation.user.js` and paste it.
4. Save (<kbd>Ctrl + S</kbd>).
5. Open your Prevent Zone course module. The floating control panel will appear automatically!

### Method 2: Chrome / Edge Browser Extension
1. Open `chrome://extensions/` or `edge://extensions/`.
2. Turn on **Developer mode** (top right toggle).
3. Click **Load unpacked**.
4. Select the `chrome-extension` folder inside this directory.
5. The extension icon will appear in your toolbar with popup controls!

### Method 3: DevTools Console (Zero Install / Instant)
1. Open your training page in Chrome/Edge/Firefox.
2. Press <kbd>F12</kbd> (or Right-Click -> Inspect) and open the **Console** tab.
3. Open `preventzone-console-bookmarklet.js`, copy the code, paste into the console, and press <kbd>Enter</kbd>.

### Method 4: Local Web App Dashboard & Live Simulator
- Open your browser to `http://localhost:8080` (or double-click `index.html`).
- Test the 16x speed menu, quiz solver, and auto-next features live inside the interactive simulator frame.

---

## 📁 File Structure

- `preventzone-automation.user.js` — Main Userscript (v2.0 Pro)
- `chrome-extension/` — Manifest V3 Chrome/Edge extension folder
  - `manifest.json`
  - `content.js`
  - `popup.html`
  - `popup.js`
  - `styles.css`
- `preventzone-console-bookmarklet.js` — Single-file console injection script
- `index.html`, `style.css`, `app.js` — Interactive dashboard web app & live simulator
- `README-preventzone-automation.md` — Usage documentation
