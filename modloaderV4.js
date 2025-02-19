(function () {
  "use strict";

  const modListUrl =
    "https://raw.githubusercontent.com/Enderman-brewer/Cool-bookmarklets/main/bookmarkrequesturlV4.txt";

  // ─── NOTIFICATION SYSTEM ─────────────────────────────────────────────
  const notifications = [];
  let notificationActive = false;

  function showNotification(
    message,
    isError = false,
    duration = 1000,
    immediate = false
  ) {
    if (immediate) {
      // Immediately remove any currently displayed notifications.
      document.querySelectorAll(".mod-loader-notification").forEach((n) =>
        n.remove()
      );
      // Clear the notification queue.
      notifications.length = 0;
      // Create and display the notification immediately (no fade-out).
      const notif = document.createElement("div");
      notif.className = "mod-loader-notification";
      notif.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background-color: rgba(0,0,0,0.8);
        color: ${isError ? "red" : "white"};
        padding: 8px 12px;
        border-radius: 5px;
        font-size: 14px;
        z-index: 10001;
        opacity: 1;
      `;
      notif.textContent = message;
      document.body.appendChild(notif);
      setTimeout(() => {
        notif.remove();
      }, duration);
    } else {
      notifications.push({ message, isError, duration });
      if (!notificationActive) displayNextNotification();
    }
  }

  function displayNextNotification() {
    if (notifications.length === 0) {
      notificationActive = false;
      return;
    }
    notificationActive = true;
    const { message, isError, duration } = notifications.shift();
    const notif = document.createElement("div");
    notif.className = "mod-loader-notification";
    notif.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      background-color: rgba(0,0,0,0.8);
      color: ${isError ? "red" : "white"};
      padding: 8px 12px;
      border-radius: 5px;
      font-size: 14px;
      z-index: 10001;
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
    `;
    notif.textContent = message;
    document.body.appendChild(notif);
    requestAnimationFrame(() => (notif.style.opacity = "1"));
    setTimeout(() => {
      notif.style.opacity = "0";
      setTimeout(() => {
        if (notif.parentNode) {
          notif.parentNode.removeChild(notif);
        }
        displayNextNotification();
      }, 300);
    }, duration);
  }

  // ─── DRAGGABLE FUNCTIONALITY ──────────────────────────────────────────
  function makeDraggable(el, handle) {
    let isDragging = false,
      offsetX = 0,
      offsetY = 0;

    handle.style.cursor = "move";
    handle.addEventListener("mousedown", (e) => {
      isDragging = true;
      const rect = el.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        el.style.left = `${e.clientX - offsetX}px`;
        el.style.top = `${e.clientY - offsetY}px`;
        el.style.right = "auto";
      }
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });
  }

  // ─── RESIZABLE HANDLES (ALL FOUR CORNERS) ─────────────────────────────
  function addResizeHandles(container) {
    const handles = [
      { position: "top-left", cursor: "nwse-resize" },
      { position: "top-right", cursor: "nesw-resize" },
      { position: "bottom-left", cursor: "nesw-resize" },
      { position: "bottom-right", cursor: "nwse-resize" },
    ];

    handles.forEach((handleInfo) => {
      const handle = document.createElement("div");
      handle.className = `resize-handle ${handleInfo.position}`;
      handle.style.cssText = `
        position: absolute;
        width: 10px;
        height: 10px;
        background: rgba(255,255,255,0.5);
        z-index: 10002;
        cursor: ${handleInfo.cursor};
      `;
      if (handleInfo.position === "top-left") {
        handle.style.top = "0";
        handle.style.left = "0";
      } else if (handleInfo.position === "top-right") {
        handle.style.top = "0";
        handle.style.right = "0";
      } else if (handleInfo.position === "bottom-left") {
        handle.style.bottom = "0";
        handle.style.left = "0";
      } else if (handleInfo.position === "bottom-right") {
        handle.style.bottom = "0";
        handle.style.right = "0";
      }

      container.appendChild(handle);

      handle.addEventListener("mousedown", function (e) {
        e.stopPropagation();
        e.preventDefault();

        const startX = e.clientX;
        const startY = e.clientY;
        const rect = container.getBoundingClientRect();
        const startWidth = rect.width;
        const startHeight = rect.height;
        const startLeft = rect.left;
        const startTop = rect.top;

        function onMouseMove(e) {
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          let newWidth = startWidth,
            newHeight = startHeight,
            newLeft = startLeft,
            newTop = startTop;

          if (handleInfo.position.indexOf("right") !== -1) {
            newWidth = startWidth + dx;
          }
          if (handleInfo.position.indexOf("left") !== -1) {
            newWidth = startWidth - dx;
            newLeft = startLeft + dx;
          }
          if (handleInfo.position.indexOf("bottom") !== -1) {
            newHeight = startHeight + dy;
          }
          if (handleInfo.position.indexOf("top") !== -1) {
            newHeight = startHeight - dy;
            newTop = startTop + dy;
          }

          newWidth = Math.max(newWidth, 150);
          newHeight = Math.max(newHeight, 150);

          container.style.width = newWidth + "px";
          container.style.height = newHeight + "px";
          container.style.left = newLeft + "px";
          container.style.top = newTop + "px";
        }

        function onMouseUp() {
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
        }

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      });
    });
  }

  // ─── TAG PARSER ───────────────────────────────────────────────────────
  // Expects a tag string like:
  // <"conflict"="SimpleMod","OtherMod";"tag"="AdvancedMod";"log"="1.5";"allowinterupt"="true","2">
  function parseTags(tagString) {
    const tags = {};
    if (tagString.startsWith("<") && tagString.endsWith(">")) {
      tagString = tagString.substring(1, tagString.length - 1);
    }
    const pairs = tagString.split(";");
    pairs.forEach((pair) => {
      pair = pair.trim();
      if (!pair) return;
      const equalIndex = pair.indexOf("=");
      if (equalIndex === -1) return;
      let key = pair.substring(0, equalIndex).trim();
      let valuePart = pair.substring(equalIndex + 1).trim();
      if (key.startsWith('"') && key.endsWith('"')) {
        key = key.substring(1, key.length - 1);
      }
      const values = [];
      const rawValues = valuePart.split(",");
      rawValues.forEach((val) => {
        val = val.trim();
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.substring(1, val.length - 1);
        }
        if (val) values.push(val);
      });
      if (key === "tag") {
        tags[key] = values[0] || null;
      } else {
        tags[key] = values;
      }
    });
    return tags;
  }

  // ─── CONFLICT HANDLING ────────────────────────────────────────────────
  // Checks conflicts between modA and modB
  function checkConflict(modA, modB) {
    if (modA.conflicts) {
      for (const conf of modA.conflicts) {
        if (!isNaN(Number(conf)) && Number(conf) === modB.order) {
          return true;
        }
        if (isNaN(Number(conf)) && modB.tag && conf === modB.tag) {
          return true;
        }
      }
    }
    if (modB.conflicts) {
      for (const conf of modB.conflicts) {
        if (!isNaN(Number(conf)) && Number(conf) === modA.order) {
          return true;
        }
        if (isNaN(Number(conf)) && modA.tag && conf === modA.tag) {
          return true;
        }
      }
    }
    return false;
  }

  // ─── MOD LOADER UI ─────────────────────────────────────────────────────
  function createModLoaderUI(mods) {
    const container = document.createElement("div");
    container.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      width: 320px;
      height: auto;
      padding: 20px;
      background-color: #333;
      color: white;
      border: 2px solid black;
      z-index: 10000;
      font-family: sans-serif;
      font-weight: bold;
      font-size: 16px;
      max-height: 90vh;
      overflow-y: auto;
      opacity: 0;
      transition: opacity 1s;
      box-sizing: border-box;
    `;
    addResizeHandles(container);

    // Title bar (drag handle)
    const titleBar = document.createElement("div");
    titleBar.style.cssText = `
      font-size: 24px;
      margin-bottom: 5px;
      border-bottom: 1px solid white;
      padding-bottom: 5px;
      user-select: none;
      cursor: move;
    `;
    titleBar.textContent = "Mod Loader V4";

    // Close button
    const closeButton = document.createElement("span");
    closeButton.textContent = "✕";
    closeButton.style.cssText = `
      float: right;
      cursor: pointer;
      font-size: 20px;
    `;
    closeButton.addEventListener("click", () => {
      container.style.opacity = "0";
      setTimeout(() => container.remove(), 1000);
    });
    titleBar.appendChild(closeButton);
    container.appendChild(titleBar);

    // Request URL display
    const requestUrlDisplay = document.createElement("p");
    requestUrlDisplay.textContent = "Request URL: " + modListUrl;
    requestUrlDisplay.style.cssText =
      "font-size: 12px; margin: 5px 0; color: #ccc;";
    container.appendChild(requestUrlDisplay);

    // Filter input
    const filterInput = document.createElement("input");
    filterInput.type = "text";
    filterInput.placeholder = "Filter mods...";
    filterInput.style.cssText = `
      width: calc(100% - 10px);
      padding: 5px;
      margin-bottom: 10px;
      border: none;
      border-radius: 3px;
      font-size: 14px;
    `;
    container.appendChild(filterInput);

    // Container for mod list
    const modsListContainer = document.createElement("div");
    container.appendChild(modsListContainer);

    // Array for checkboxes (used in conflict handling)
    const checkboxes = [];

    // Render mod items
    function renderModItems(filterText = "") {
      modsListContainer.innerHTML = "";
      const lowerFilter = filterText.toLowerCase();
      mods.forEach((mod, index) => {
        if (mod.name.toLowerCase().includes(lowerFilter)) {
          mod.order = index + 1;
          const modItemLabel = document.createElement("label");
          modItemLabel.style.cssText = `
            display: flex;
            align-items: center;
            margin-bottom: 5px;
            cursor: pointer;
          `;
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.value = mod.url;
          checkbox.style.marginRight = "5px";
          checkbox.modData = mod;
          modItemLabel.appendChild(checkbox);

          const textSpan = document.createElement("span");
          // Initially show only the mod name (conflict details appear when disabled)
          textSpan.textContent = mod.name;
          modItemLabel.appendChild(textSpan);

          // Save reference to the text span for later updates
          checkbox.textSpan = textSpan;

          modsListContainer.appendChild(modItemLabel);
          checkboxes.push(checkbox);
          checkbox.addEventListener("change", recalcConflicts);
        }
      });
    }

    // Recalculate conflicts and update checkboxes
    function recalcConflicts() {
      checkboxes.forEach((cb) => {
        if (!cb.checked) {
          let conflicts = [];
          checkboxes.forEach((otherCb) => {
            if (
              otherCb.checked &&
              otherCb !== cb &&
              checkConflict(otherCb.modData, cb.modData)
            ) {
              conflicts.push(otherCb.modData.name);
            }
          });
          if (conflicts.length > 0) {
            cb.disabled = true;
            cb.textSpan.textContent =
              cb.modData.name + " (Conflicts with: " + conflicts.join(", ") + ")";
          } else {
            cb.disabled = false;
            cb.textSpan.textContent = cb.modData.name;
          }
        } else {
          cb.disabled = false;
          cb.textSpan.textContent = cb.modData.name;
        }
      });
    }

    renderModItems();
    filterInput.addEventListener("input", (e) => {
      renderModItems(e.target.value);
      recalcConflicts();
    });

    // Load button – on click, the UI fades out and selected mods are loaded.
    const loadButton = document.createElement("button");
    loadButton.textContent = "Load Selected Mods";
    loadButton.style.cssText = `
      font-size: 16px;
      padding: 8px 12px;
      background-color: #4CAF50;
      border: none;
      color: white;
      cursor: pointer;
      border-radius: 4px;
      margin-top: 10px;
      width: 100%;
    `;
    loadButton.addEventListener("click", async () => {
      container.style.opacity = "0";
      setTimeout(() => container.remove(), 100);
      const selectedCheckboxes = checkboxes.filter((cb) => cb.checked);
      for (const checkbox of selectedCheckboxes) {
        const modData = checkbox.modData;
        let logDuration = 1000;
        let allowInterupt = false;
        if (modData.log) {
          if (modData.log[0] === "off") {
            logDuration = null;
          } else {
            let t = parseFloat(modData.log[0]);
            if (isNaN(t)) t = 1;
            if (t === 0) t = 1;
            logDuration = t * 1000;
          }
        }
        if (modData.allowinterupt) {
          allowInterupt = true;
          if (modData.allowinterupt.length > 1) {
            let interruptTime = parseFloat(modData.allowinterupt[1]);
            if (isNaN(interruptTime)) {
              interruptTime = logDuration || 1000;
            } else {
              interruptTime = interruptTime * 1000;
            }
            logDuration = interruptTime;
          }
        }
        try {
          const response = await fetch(checkbox.value);
          if (!response.ok) {
            throw new Error(
              `Network response was not ok for ${checkbox.value}`
            );
          }
          const scriptContent = await response.text();
          const scriptEl = document.createElement("script");
          scriptEl.textContent = scriptContent;
          scriptEl.onerror = function (e) {
            console.log("Mod script error logged:", e);
            console.warn("Mod script warning:", e);
            console.error("Mod script error:", e);
            if (logDuration !== null) {
              showNotification(
                `Error in script: ${checkbox.value}`,
                true,
                logDuration,
                allowInterupt
              );
            }
          };
          document.body.appendChild(scriptEl);
          showNotification(`Successfully loaded: ${checkbox.value}`);
        } catch (error) {
          console.log(`Error loading ${checkbox.value}:`, error);
          console.warn(`Warning while loading ${checkbox.value}:`, error);
          console.error(`Failed to load ${checkbox.value}:`, error);
          if (logDuration !== null) {
            showNotification(
              `Failed to load: ${checkbox.value}`,
              true,
              logDuration,
              allowInterupt
            );
          }
        }
      }
    });
    container.appendChild(loadButton);

    document.body.appendChild(container);
    requestAnimationFrame(() => (container.style.opacity = "1"));
    makeDraggable(container, titleBar);
  }

  // ─── FETCH MOD LIST AND PARSE LINES ───────────────────────────────────
  async function fetchModList(url) {
    try {
      showNotification("Fetching mod list...");
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      const text = await response.text();
      showNotification("Mod list fetched.");
      return text;
    } catch (error) {
      console.error("Error fetching mod list:", error);
      showNotification("Error fetching mod list.", true);
      return null;
    }
  }

  // ─── MAIN ENTRY POINT ─────────────────────────────────────────────────
  async function main() {
    showNotification("Loading Mods...");
    const modListText = await fetchModList(modListUrl);
    if (!modListText) return;
    const modLines = modListText.split("\n");
    const mods = [];
    modLines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      let modObj = null;
      // Simple format: "modName <> modUrl"
      if (trimmed.includes("<>")) {
        const parts = trimmed.split("<>");
        if (parts.length >= 2) {
          const modName = parts[0].trim();
          const modUrl = parts[1].trim();
          modObj = { name: modName, url: modUrl, conflicts: [], tag: null };
        }
      }
      // Event tag format: "modName <event tags> modUrl"
      else if (trimmed.includes("<") && trimmed.includes(">")) {
        const firstAngle = trimmed.indexOf("<");
        const lastAngle = trimmed.indexOf(">");
        if (firstAngle !== -1 && lastAngle !== -1 && lastAngle > firstAngle) {
          const modName = trimmed.slice(0, firstAngle).trim();
          const tagString = trimmed.slice(firstAngle, lastAngle + 1).trim();
          const modUrl = trimmed.slice(lastAngle + 1).trim();
          modObj = { name: modName, url: modUrl, conflicts: [], tag: null };
          if (tagString) {
            const parsedTags = parseTags(tagString);
            if (parsedTags.conflict) {
              modObj.conflicts = parsedTags.conflict;
            }
            if (parsedTags.tag) {
              modObj.tag = parsedTags.tag;
            }
            if (parsedTags.log) {
              modObj.log = parsedTags.log;
            }
            if (parsedTags.allowinterupt) {
              modObj.allowinterupt = parsedTags.allowinterupt;
            }
          }
        }
      } else {
        console.log(`Skipping invalid line: ${line}`);
        showNotification(`Skipping invalid line: ${line}`, true);
      }
      if (modObj) {
        mods.push(modObj);
      }
    });
    if (mods.length > 0) {
      console.log("Mods found:", mods);
      showNotification("Mods found, loading UI...");
      createModLoaderUI(mods);
    } else {
      console.error("No valid mods found.");
      showNotification("No valid mods found.", true);
    }
  }

  // Execute main as soon as possible. If document.body exists, run immediately;
  // otherwise, wait for DOMContentLoaded.
  if (document.body) {
    main();
  } else {
    document.addEventListener("DOMContentLoaded", main);
  }
})();
