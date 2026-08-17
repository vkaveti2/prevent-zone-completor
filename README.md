# Prevent Zone Training Automator Pro ⚡

> **A simple, powerful browser tool designed to accelerate and automate Prevent Zone, Moodle, and Articulate Storyline 360 training modules.**

---

## ⚠️ Important Disclaimer & How to Use This Tool

> [!IMPORTANT]
> **This tool is not 100% foolproof, and you should partially monitor it while it runs.**
>
> While this script automates playback speed, video skipping, answer selection, and slide transitions, certain training modules contain unique interactive components (such as custom drag-and-drop exercises, clickable hotspots, branching dialogs, or mandatory popup agreements) that require a manual click.
>
> **Best Practice (Supervised Auto-Pilot):**
> Keep your Prevent Zone training tab open on your screen (or on a second monitor / split window) while you work or study. The automator will handle the bulk of videos, timers, and transitions automatically. If you notice a slide pause on an interactive prompt, simply click it, and the automator will pick right back up and continue advancing!

---

## 🌟 What This Tool Does

When you open any Prevent Zone course, a sleek dark-blue control widget will appear in the bottom-right corner of your screen:

- ⚡ **16x Playback Speed**: Accelerates audio narration and video playback by up to 16 times normal speed.
- ⏩ **Instant Media Skip**: Jumps long audio/video narrations directly to the end so you don't have to wait.
- ▶ **Auto-Click Next**: Continuously detects and clicks "Next", "Submit", and "Continue" buttons as soon as slides finish.
- 🎯 **Smart Quiz Solver**: Automatically selects valid choices for multiple-choice, checkbox, and dropdown questions in Moodle and Storyline quizzes.
- 📤 **One-Click Quiz Submission**: Auto-confirms and submits quiz attempts.
- 🎛️ **Draggable Floating Panel**: Conveniently move or minimize the dashboard anywhere on your screen.

---

## 🚀 Beginner's Step-by-Step Setup Guide (Google Chrome)

You do **not** need any coding experience to use this. Just follow these simple steps:

### Step 1: Install Tampermonkey in Google Chrome
1. Open Google Chrome.
2. Visit the official [Tampermonkey Chrome Web Store Page](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo).
3. Click the blue **Add to Chrome** button, then click **Add extension** when prompted.

---

### Step 2: Open Tampermonkey & Create a New Script
1. In Google Chrome, click the **Extensions icon** (the puzzle piece 🧩 located in the top-right corner of your browser toolbar).
2. Click on **Tampermonkey**.
3. From the popup menu, click **Create a new script...** (or open the **Dashboard** and click the **`+`** tab).

---

### Step 3: Copy & Paste the Automator Script
1. Open the script file:
   `preventzone-automation.user.js` (located inside the `agyvsprevent` folder).
2. Select **all** the text in that file (<kbd>Ctrl</kbd> + <kbd>A</kbd>) and **Copy** it (<kbd>Ctrl</kbd> + <kbd>C</kbd>).
3. In the Tampermonkey script editor in Chrome:
   - Select and delete any default placeholder code that is already in the editor box.
   - **Paste** the copied script (<kbd>Ctrl</kbd> + <kbd>V</kbd>).
4. Save the script by pressing <kbd>Ctrl</kbd> + <kbd>S</kbd> (or click **File** > **Save** in the Tampermonkey editor menu).
5. You should now see **Prevent Zone Training Automator Pro** enabled in your Tampermonkey list!

---

### Step 4: Launch Your Prevent Zone Course
1. Go to your Prevent Zone portal (e.g., `psu.prevent.zone` or your institution's Prevent Zone link).
2. Open any course activity or training module (such as *Hazing Prevention*, *Brave & Bold Dialogues*, etc.).
3. Look at the **bottom-right corner** of your browser window. You will see the **⚡ Prevent Zone Auto** floating panel!

---

## 🎮 Control Panel & Button Guide

Here is a breakdown of what every element on the floating control panel does:

```
┌───────────────────────────────────────────────────┐
│ ⋮⋮  ⚡ Prevent Zone Auto        [Main Window]  —  │
├───────────────────────────────────────────────────┤
│ PLAYBACK SPEED                                    │
│ [ 1x ]  [ 2x ]  [ 4x ]  [ 8x ]  [ 16x (Active) ] │
├───────────────────────────────────────────────────┤
│ [ ⏩ Skip / Fast-Forward Media                  ] │
│ [ ▶ Auto-Click Next: OFF / ON                   ] │
│ [ 🎯 Solve & Select Quiz Answers                ] │
│ [ 📤 Submit Quiz Attempt                        ] │
├───────────────────────────────────────────────────┤
│ Status: Playback speed set to 16x                 │
└───────────────────────────────────────────────────┘
```

### 1. Panel Header & Controls
- **Drag Handle (`⋮⋮`)**: Click and hold anywhere on the blue header bar to drag the widget to any location on your screen so it never blocks your course content. Your chosen position is automatically saved for future sessions!
- **Context Badge (`Main Window` / `iFrame`)**: Indicates whether the widget is communicating with the main training portal or the embedded video/SCORM course player.
- **Minimize Button (`—` / `+`)**: Click the minus sign to collapse the panel into a slim header bar. Click the plus sign to expand it again.

### 2. Playback Speed Selector (`1x`, `2x`, `4x`, `8x`, `16x`)
- Automatically accelerates narration, audio clips, and slide animations.
- **Default Speed**: Starts automatically at **16x**.
- **Storyline Speed Menu Sync**: Also injects a **16x Speed** option directly into Articulate Storyline’s native settings gear menu on the course player bar.
- **Customizable**: If you want to listen to a specific section at normal speed, click **1x**; you can switch back to **16x** at any time.

### 3. ⏩ Skip / Fast-Forward Media Button
- Instantly jumps the currently playing video or audio track to its final fraction of a second.
- Ideal for long narrated slides where the "Next" button remains locked until the speaker finishes talking. Clicking this fast-forwards the timer and immediately unlocks the slide.

### 4. ▶ Auto-Click Next (Toggle Button)
- **OFF** (Grey) / **ON** (Green): Click to enable or disable automatic navigation.
- When turned **ON**, the script continuously monitors the page for active "Next", "Submit", "Continue", or activity transition buttons across both the main window and embedded player frames.
- Automatically unlocks Storyline Next buttons once the media finishes and clicks them for you.

### 5. 🎯 Solve & Select Quiz Answers Button
- Designed for quiz assessments and check-on-learning knowledge questions.
- Automatically scans for multiple-choice questions, radio buttons, checkboxes, and dropdown lists across Moodle quiz containers (`.que` blocks) and Storyline slides.
- Smartly avoids hidden dummy/placeholder inputs (e.g. `value="-1"`) and triggers native browser events (`click`, `input`, `change`) so the platform registers the selection properly.

### 6. 📤 Submit Quiz Attempt Button
- Single-click quiz submission tool.
- Clicks the Moodle **"Finish attempt..."** button and automatically confirms the **"Submit all and finish"** dialog.

### 7. Status Text Bar (Footer)
- Displays real-time updates of actions being performed (e.g., *"Playback speed set to 16x"*, *"Fast-forwarded 1 media item"*, *"Clicked Next"*).

---

## 💡 Recommended Workflow for Quickest Completion

1. **Start the Module**: Open your Prevent Zone course module in Google Chrome.
2. **Turn on Auto-Next**: Click the **`▶ Auto-Click Next`** button on the widget so it turns **green (ON)**.
3. **Speed Enforcement**: Playback speed defaults to **16x** automatically. If you want to speed up a slide instantly, click **`⏩ Skip / Fast-Forward Media`**.
4. **When You Reach a Quiz**:
   - Click **`🎯 Solve & Select Quiz Answers`** to auto-populate answers.
   - Click **`📤 Submit Quiz Attempt`** to finish and submit the quiz.
5. **Keep an Eye on Special Slides**: If a module stops on an interactive card or drag-and-drop exercise, perform that click manually; the automator will resume advancing as soon as you proceed to the next slide.

---

## 🛠️ Alternative Setup Methods (For Advanced Users)

While Tampermonkey (Method 1 above) is the easiest and recommended approach, three other methods are available:

<details>
<summary><b>Method 2: Load as an Unpacked Chrome Extension</b></summary>

1. In Google Chrome, go to URL: `chrome://extensions/`
2. Turn on the **Developer mode** toggle in the top-right corner.
3. Click the **Load unpacked** button in the top-left corner.
4. Browse to and select the `chrome-extension` folder located inside this repository.
5. The **Prevent Zone Automator** extension icon will appear in your Chrome toolbar with popup controls!
</details>

<details>
<summary><b>Method 3: DevTools Console (Zero Install / Instant)</b></summary>

1. Open your Prevent Zone course module in Google Chrome.
2. Press <kbd>F12</kbd> (or right-click anywhere on the page and select **Inspect**), then click the **Console** tab.
3. Open `preventzone-console-bookmarklet.js`, copy the entire code, paste it into the console, and press <kbd>Enter</kbd>.
</details>

<details>
<summary><b>Method 4: Local Simulator Dashboard</b></summary>

- Double-click `index.html` (or host via local server) to test the 16x speed menu, quiz solver, and auto-next features in an interactive simulation environment.
</details>

---

## ❓ Frequently Asked Questions & Troubleshooting

### Q1: The dark-blue floating widget is not showing up on the page.
- **Check Tampermonkey is Enabled**: Click the Tampermonkey extension icon in Chrome and verify that the switch next to *Prevent Zone Training Automator Pro* is **ON (Green)**.
- **Refresh the Page**: Press <kbd>Ctrl</kbd> + <kbd>F5</kbd> or <kbd>F5</kbd> to reload the Prevent Zone tab.
- **URL Match**: Ensure the course URL contains `prevent.zone` or `psu.prevent.zone`.

### Q2: Why did the module stop on a slide?
- The slide likely contains a custom interactive element (such as a clickable card, branching question, or drag-and-drop activity).
- **Fix**: Simply click the required interactive element on the slide. Once completed, the automator will continue advancing automatically.

### Q3: How do I disable the automator or change back to normal speed?
- To return to normal speed, click **`1x`** in the Playback Speed grid on the widget.
- To pause auto-advancing, click **`▶ Auto-Click Next`** so it switches to **OFF**.
- To completely disable the tool, open the Tampermonkey menu in Chrome and toggle the script off.

### Q4: Can I run this in the background while doing other tasks?
- **Yes!** For best results, keep the Chrome window visible on a portion of your screen or a second monitor. If a browser tab is completely hidden or minimized, Google Chrome may throttle background timers, slowing down video playback.

---

## 📁 Repository Structure

- `agyvsprevent/preventzone-automation.user.js` — Main Userscript (v2.2 Pro with draggable UI & cross-frame sync)
- `chrome-extension/` — Standalone Manifest V3 Chrome Extension folder
- `preventzone-console-bookmarklet.js` — Single-file instant browser console script
- `index.html`, `style.css`, `app.js` — Local test dashboard and interactive simulator

---

## 📄 License & Terms

This script is provided for educational and accessibility convenience purposes. Users are responsible for ensuring compliance with their relevant institutional training guidelines.
