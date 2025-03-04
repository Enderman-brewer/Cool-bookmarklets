javascript:void function(){
(function(){
"use strict";

// Utility functions for persisting UI position/size
function persistUI(element) {
    try {
        const settings = {
            top: element.style.top,
            left: element.style.left,
            right: element.style.right,
            width: element.style.width,
            height: element.style.height
        };
        localStorage.setItem("modLoaderUISettings", JSON.stringify(settings));
    } catch(e){
        console.error("Error saving UI settings:", e);
    }
}
function loadUISettings(element) {
    try {
        const settings = localStorage.getItem("modLoaderUISettings");
        if(settings) {
            const s = JSON.parse(settings);
            if(s.top) element.style.top = s.top;
            if(s.left) { element.style.left = s.left; element.style.right = ""; }
            else if(s.right) { element.style.right = s.right; element.style.left = ""; }
            if(s.width) element.style.width = s.width;
            if(s.height) element.style.height = s.height;
        }
    } catch(e){
        console.error("Error loading UI settings:", e);
    }
}
// Functions to persist custom UI style settings
function updateUICustomizations(){
    try {
        var custom = localStorage.getItem("modLoaderUICustom");
        if(custom && modLoaderUI) {
            var settings = JSON.parse(custom);
            if(settings.backgroundColor) modLoaderUI.style.backgroundColor = settings.backgroundColor;
            if(settings.borderColor) modLoaderUI.style.borderColor = settings.borderColor;
            if(settings.fontSize) modLoaderUI.style.fontSize = settings.fontSize;
            if(settings.color) modLoaderUI.style.color = settings.color;
        }
    } catch(e){ console.error("Error updating UI customizations:", e); }
}

// Listen for changes in other tabs
window.addEventListener("storage", function(event) {
    if(event.key === "modLoaderUISettings" && modLoaderUI) {
        loadUISettings(modLoaderUI);
    }
    if(event.key === "modLoaderUICustom" && modLoaderUI) {
        updateUICustomizations();
    }
});

// Notification function
function a(msg, isError = false, duration = 1000, suppressQueue = false){
    if(suppressQueue){
        document.querySelectorAll(".mod-loader-notification").forEach(el=>el.remove());
        k.length = 0;
        const div = document.createElement("div");
        div.className = "mod-loader-notification";
        div.style.cssText = `position: fixed; top: 10px; right: 10px; background-color: rgba(0,0,0,0.8); color: ${isError?"red":"white"}; padding: 8px 12px; border-radius: 5px; font-size: 14px; z-index: 10001; opacity: 1;`;
        div.textContent = msg;
        document.body.appendChild(div);
        setTimeout(()=>{div.remove()}, duration);
    } else {
        k.push({message: msg, isError: isError, duration: duration});
        l || b();
    }
}
function b(){
    if(k.length === 0) { l = false; return; }
    l = true;
    const {message, isError, duration} = k.shift(),
          div = document.createElement("div");
    div.className = "mod-loader-notification";
    div.style.cssText = `position: fixed; top: 10px; right: 10px; background-color: rgba(0,0,0,0.8); color: ${isError?"red":"white"}; padding: 8px 12px; border-radius: 5px; font-size: 14px; z-index: 10001; opacity: 0; transition: opacity 0.3s ease-in-out;`;
    div.textContent = message;
    document.body.appendChild(div);
    requestAnimationFrame(()=> div.style.opacity = "1");
    setTimeout(()=>{
        div.style.opacity = "0";
        setTimeout(()=>{
            div.parentNode && div.parentNode.removeChild(div);
            b();
        },300);
    }, duration);
}
function c(container, header){
    let dragging = false, offsetX = 0, offsetY = 0;
    header.style.cursor = "move";
    header.addEventListener("mousedown", evt=>{
        dragging = true;
        const rect = container.getBoundingClientRect();
        if(container.style.right && !container.style.left) {
            container.style.left = (window.innerWidth - container.offsetWidth - parseFloat(container.style.right)) + "px";
            container.style.right = "";
        }
        offsetX = evt.clientX - rect.left;
        offsetY = evt.clientY - rect.top;
        evt.preventDefault();
    });
    document.addEventListener("mousemove", evt=>{
        if(dragging) {
            container.style.left = (evt.clientX - offsetX) + "px";
            container.style.top = (evt.clientY - offsetY) + "px";
        }
    });
    document.addEventListener("mouseup", ()=>{
        if(dragging){
            dragging = false;
            persistUI(container);
        }
    });
}
function d(container){
    [
        {position:"top-left", cursor:"nwse-resize"},
        {position:"top-right", cursor:"nesw-resize"},
        {position:"bottom-left", cursor:"nesw-resize"},
        {position:"bottom-right", cursor:"nwse-resize"}
    ].forEach(handleInfo=>{
        const handle = document.createElement("div");
        handle.className = "resize-handle " + handleInfo.position;
        handle.style.cssText = `position: absolute; width: 10px; height: 10px; background: rgba(255,255,255,0.5); z-index: 10002; cursor: ${handleInfo.cursor};`;
        if(handleInfo.position === "top-left"){
            handle.style.top = "0";
            handle.style.left = "0";
        } else if(handleInfo.position === "top-right"){
            handle.style.top = "0";
            handle.style.right = "0";
        } else if(handleInfo.position === "bottom-left"){
            handle.style.bottom = "0";
            handle.style.left = "0";
        } else if(handleInfo.position === "bottom-right"){
            handle.style.bottom = "0";
            handle.style.right = "0";
        }
        container.appendChild(handle);
        handle.addEventListener("mousedown", function(evt){
            evt.stopPropagation();
            evt.preventDefault();
            const startX = evt.clientX,
                  startY = evt.clientY,
                  rect = container.getBoundingClientRect(),
                  startWidth = rect.width,
                  startHeight = rect.height,
                  startLeft = rect.left,
                  startTop = rect.top;
            function doResize(e) {
                let newWidth = startWidth, newHeight = startHeight, newLeft = startLeft, newTop = startTop;
                const dx = e.clientX - startX,
                      dy = e.clientY - startY;
                if(handleInfo.position.indexOf("right") !== -1){
                    newWidth = startWidth + dx;
                }
                if(handleInfo.position.indexOf("left") !== -1){
                    newWidth = startWidth - dx;
                    newLeft = startLeft + dx;
                }
                if(handleInfo.position.indexOf("bottom") !== -1){
                    newHeight = startHeight + dy;
                }
                if(handleInfo.position.indexOf("top") !== -1){
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
            function stopResize(){
                document.removeEventListener("mousemove", doResize);
                document.removeEventListener("mouseup", stopResize);
                persistUI(container);
            }
            document.addEventListener("mousemove", doResize);
            document.addEventListener("mouseup", stopResize);
        });
    });
}
function e(str){
    const obj = {};
    if(str.startsWith("<") && str.endsWith(">"))
        str = str.substring(1, str.length - 1);
    const parts = str.split(";");
    parts.forEach(part=>{
        part = part.trim();
        if(!part)return;
        const idx = part.indexOf("=");
        if(idx === -1)return;
        let key = part.substring(0, idx).trim(),
            value = part.substring(idx+1).trim();
        if(key.startsWith(`"`) && key.endsWith(`"`))
            key = key.substring(1, key.length - 1);
        const arr = [];
        value.split(",").forEach(v=>{
            v = v.trim();
            if(v.startsWith(`"`) && v.endsWith(`"`))
                v = v.substring(1, v.length - 1);
            if(v) arr.push(v);
        });
        obj[key] = key === "tag" ? (arr[0]||null) : arr;
    });
    return obj;
}
function f(modA, modB){
    if(modA.conflicts)
        for(const conflict of modA.conflicts){
            if(!isNaN(+conflict) && conflict === modB.order) return true;
            if(isNaN(+conflict) && modB.tag && conflict === modB.tag) return true;
        }
    if(modB.conflicts)
        for(const conflict of modB.conflicts){
            if(!isNaN(+conflict) && conflict === modA.order) return true;
            if(isNaN(+conflict) && modA.tag && conflict === modA.tag) return true;
        }
    return false;
}

// Open an in-page modal editor that inherits the mod loader UI's CSS and uses advanced button styling
function openUIEditor(){
    // Create overlay
    const overlay = document.createElement("div");
    overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 100000; display: flex; align-items: center; justify-content: center;";
    
    // Create modal dialog that reuses mod loader UI styling
    const modal = document.createElement("div");
    modal.style.cssText = "background: #333; color: white; border: 2px solid black; border-radius: 5px; width: 300px; padding: 20px; box-sizing: border-box; font-family: sans-serif; font-weight: bold; font-size: 16px; box-shadow: 0 0 10px rgba(0,0,0,0.5);";
    
    // Use input type=color for hex code fields so that clicking opens the selector
    modal.innerHTML = `
      <h2 style="margin: 0 0 15px; font-size: 18px; text-align: center;">Edit UI</h2>
      <label style="display: block; margin-bottom: 10px; font-size: 14px;">
        Background Colour:
        <input type="color" id="bgColor" style="width: calc(100% - 10px); padding: 5px; margin-top: 5px; border: none; border-radius: 3px; font-size: 14px;" value="#333"/>
      </label>
      <label style="display: block; margin-bottom: 10px; font-size: 14px;">
        Border Colour:
        <input type="color" id="borderColor" style="width: calc(100% - 10px); padding: 5px; margin-top: 5px; border: none; border-radius: 3px; font-size: 14px;" value="black"/>
      </label>
      <label style="display: block; margin-bottom: 10px; font-size: 14px;">
        Font Size:
        <input type="text" id="fontSize" style="width: calc(100% - 10px); padding: 5px; margin-top: 5px; border: none; border-radius: 3px; font-size: 14px;" placeholder="16px"/>
      </label>
      <label style="display: block; margin-bottom: 10px; font-size: 14px;">
        Text Colour:
        <input type="color" id="textColor" style="width: calc(100% - 10px); padding: 5px; margin-top: 5px; border: none; border-radius: 3px; font-size: 14px;" value="white"/>
      </label>
      <div style="text-align: center; margin-top: 15px;">
        <button id="saveBtn" style="background: #4CAF50; border: none; color: white; padding: 8px 12px; font-size: 14px; border-radius: 4px; cursor: pointer; margin-right: 10px;">Save</button>
        <button id="closeEditorBtn" style="background: #F44336; border: none; color: white; padding: 8px 12px; font-size: 14px; border-radius: 4px; cursor: pointer;">Close</button>
      </div>
    `;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Load any saved custom settings into the modal fields
    (function loadCustom(){
        var custom = localStorage.getItem("modLoaderUICustom");
        if(custom) {
            var settings = JSON.parse(custom);
            if(settings.backgroundColor) document.getElementById("bgColor").value = settings.backgroundColor;
            if(settings.borderColor) document.getElementById("borderColor").value = settings.borderColor;
            if(settings.fontSize) document.getElementById("fontSize").value = settings.fontSize;
            if(settings.color) document.getElementById("textColor").value = settings.color;
        }
    })();
    
    // Save button handler – persist settings and update mod loader UI; show notification using a()
    document.getElementById("saveBtn").addEventListener("click", function(){
        var settings = {
            backgroundColor: document.getElementById("bgColor").value,
            borderColor: document.getElementById("borderColor").value,
            fontSize: document.getElementById("fontSize").value,
            color: document.getElementById("textColor").value
        };
        localStorage.setItem("modLoaderUICustom", JSON.stringify(settings));
        updateUICustomizations();
        a("Settings saved.", false, 1500);
    });
    // Close button handler – remove the modal overlay
    document.getElementById("closeEditorBtn").addEventListener("click", function(){
        overlay.remove();
    });
}

function g(mods){
    // Outer container (draggable/resizable)
    const container = document.createElement("div");
    container.style.cssText = "position: fixed; top: 10px; right: 10px; width: 320px; height: auto; padding: 0; background-color: #333; color: white; border: 2px solid black; z-index: 10000; font-family: sans-serif; font-weight: bold; font-size: 16px; max-height: 90vh; overflow: hidden; transition: opacity 1s; box-sizing: border-box;";
    loadUISettings(container);
    modLoaderUI = container;
    d(container);
    
    // Header with title, Edit UI and Close buttons
    const header = document.createElement("div");
    header.style.cssText = "font-size: 24px; margin: 0; padding: 5px 10px; border-bottom: 1px solid white; user-select: none; cursor: move; display: flex; justify-content: space-between; align-items: center;";
    const title = document.createElement("span");
    title.textContent = "Mod Loader V5"; // Title updated to V5
    header.appendChild(title);
    const btnGroup = document.createElement("div");
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit UI";
    editBtn.style.cssText = "margin-right:5px; padding:2px 5px; font-size:12px; background: #4CAF50; border: none; color: white; border-radius: 4px; cursor: pointer;";
    editBtn.addEventListener("click", openUIEditor);
    btnGroup.appendChild(editBtn);
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "✕";
    closeBtn.style.cssText = "padding:2px 5px; font-size:12px; background: #F44336; border: none; color: white; border-radius: 4px; cursor: pointer;";
    closeBtn.addEventListener("click", ()=>{
        container.style.opacity = "0";
        setTimeout(()=> container.remove(), 1000);
    });
    btnGroup.appendChild(closeBtn);
    header.appendChild(btnGroup);
    container.appendChild(header);
    
    // Inner content container for other UI elements
    const contentDiv = document.createElement("div");
    contentDiv.style.cssText = "padding: 10px; overflow-y: auto; max-height: calc(90vh - 50px);";
    
    const urlP = document.createElement("p");
    urlP.textContent = "Request URL: https://raw.githubusercontent.com/Enderman-brewer/Cool-bookmarklets/main/bookmarkrequesturlV5.txt"; // Hello modders and code reusers, I have an issue, the current code is too large for my normal methods of upgrades, so I need to either manually upgrade from here on, or do a full recode
    urlP.style.cssText = "font-size: 12px; margin: 5px 0; color: #ccc;";
    contentDiv.appendChild(urlP);
    
    const filterInput = document.createElement("input");
    filterInput.type = "text";
    filterInput.placeholder = "Filter mods...";
    filterInput.style.cssText = "width: calc(100% - 10px); padding: 5px; margin-bottom: 10px; border: none; border-radius: 3px; font-size: 14px;";
    contentDiv.appendChild(filterInput);
    
    const listDiv = document.createElement("div");
    contentDiv.appendChild(listDiv);
    
    const checkboxes = [];
    function populateList(filter=""){
        listDiv.innerHTML = "";
        const lowerFilter = filter.toLowerCase();
        mods.forEach((mod, idx)=>{
            if(mod.name.toLowerCase().includes(lowerFilter)){
                mod.order = idx+1;
                const label = document.createElement("label");
                label.style.cssText = "display: flex; align-items: center; margin-bottom: 5px; cursor: pointer;";
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.value = mod.url;
                checkbox.style.marginRight = "5px";
                checkbox.modData = mod;
                label.appendChild(checkbox);
                const span = document.createElement("span");
                span.textContent = mod.name;
                label.appendChild(span);
                listDiv.appendChild(label);
                checkbox.textSpan = span;
                checkboxes.push(checkbox);
                checkbox.addEventListener("change", function(){
                    checkboxes.forEach(cb=>{
                        if(!cb.checked){
                            const conflicts = [];
                            checkboxes.forEach(other=>{
                                if(other.checked && other!==cb && f(other.modData, cb.modData))
                                    conflicts.push(other.modData.name);
                            });
                            if(conflicts.length > 0){
                                cb.disabled = true;
                                cb.textSpan.textContent = cb.modData.name + " (Conflicts with: " + conflicts.join(", ") + ")";
                            } else {
                                cb.disabled = false;
                                cb.textSpan.textContent = cb.modData.name;
                            }
                        } else {
                            cb.disabled = false;
                            cb.textSpan.textContent = cb.modData.name;
                        }
                    });
                });
            }
        });
    }
    populateList();
    filterInput.addEventListener("input", evt=>{
        populateList(evt.target.value);
    });
    
    const loadBtn = document.createElement("button");
    loadBtn.textContent = "Load Selected Mods";
    loadBtn.style.cssText = "font-size: 16px; padding: 8px 12px; background-color: #4CAF50; border: none; color: white; cursor: pointer; border-radius: 4px; margin-top: 10px; width: 100%;";
    loadBtn.addEventListener("click", async ()=>{
        container.style.opacity = "0";
        setTimeout(()=> container.remove(), 100);
        const selected = checkboxes.filter(cb=>cb.checked);
        for(const cb of selected){
            const mod = cb.modData;
            let delay = 1000, allowInterrupt = false;
            if(mod.log){
                if(mod.log[0] === "off") {
                    delay = null;
                } else {
                    let dVal = parseFloat(mod.log[0]);
                    if(isNaN(dVal) || dVal === 0) dVal = 1;
                    delay = 1000 * dVal;
                }
            }
            if(mod.allowinterupt && (allowInterrupt = true, mod.allowinterupt.length > 1)){
                let aVal = parseFloat(mod.allowinterupt[1]);
                if(isNaN(aVal)){
                    aVal = delay || 1000;
                } else {
                    aVal *= 1000;
                }
                delay = aVal;
            }
            try{
                const res = await fetch(cb.value);
                if(!res.ok) throw new Error("Network response was not ok for " + cb.value);
                const txt = await res.text();
                const script = document.createElement("script");
                script.textContent = txt;
                script.onerror = function(e){
                    console.error("Mod script error:", e);
                    if(delay!==null) a("Error in script: " + cb.value, true, delay, allowInterrupt);
                };
                document.body.appendChild(script);
                a("Successfully loaded: " + cb.value);
            } catch(err){
                console.error("Error loading " + cb.value + ":", err);
                if(delay!==null) a("Failed to load: " + cb.value, true, delay, allowInterrupt);
            }
        }
    });
    contentDiv.appendChild(loadBtn);
    
    container.appendChild(contentDiv);
    document.body.appendChild(container);
    requestAnimationFrame(()=> container.style.opacity = "1");
    c(container, header);
    
    updateUICustomizations();
}
async function h(url){
    try{
        a("Fetching mod list...");
        const res = await fetch(url);
        if(!res.ok) throw new Error("Failed to fetch: " + res.statusText);
        const txt = await res.text();
        a("Mod list fetched.");
        return txt;
    } catch(err){
        console.error("Error fetching mod list:", err);
        a("Error fetching mod list.", true);
        return null;
    }
}
async function i(){
    a("Loading Mods...");
    const modListText = await h(j);
    if(!modListText) return;
    const lines = modListText.split("\n"),
          mods = [];
    lines.forEach(line=>{
        const trimmed = line.trim();
        if(!trimmed) return;
        let modObj = null;
        if(trimmed.includes("<>")){
            const parts = trimmed.split("<>");
            if(parts.length >= 2){
                const name = parts[0].trim(),
                      url = parts[1].trim();
                modObj = { name: name, url: url, conflicts: [], tag: null };
            }
        } else if(trimmed.includes("<") && trimmed.includes(">")){
            const aIdx = trimmed.indexOf("<"),
                  bIdx = trimmed.indexOf(">");
            if(aIdx !== -1 && bIdx !== -1 && bIdx > aIdx){
                const name = trimmed.slice(0, aIdx).trim(),
                      tagStr = trimmed.slice(aIdx, bIdx+1).trim(),
                      url = trimmed.slice(bIdx+1).trim();
                modObj = { name: name, url: url, conflicts: [], tag: null };
                if(tagStr){
                    const params = e(tagStr);
                    if(params.conflict) modObj.conflicts = params.conflict;
                    if(params.tag) modObj.tag = params.tag;
                    if(params.log) modObj.log = params.log;
                    if(params.allowinterupt) modObj.allowinterupt = params.allowinterupt;
                }
            }
        } else {
            console.log("Skipping invalid line: " + trimmed);
            a("Skipping invalid line: " + trimmed, true);
        }
        if(modObj) mods.push(modObj);
    });
    if(mods.length > 0){
        console.log("Mods found:", mods);
        a("Mods found, loading UI...");
        g(mods);
    } else {
        console.error("No valid mods found.");
        a("No valid mods found.", true);
    }
}
const j = "https://raw.githubusercontent.com/Enderman-brewer/Cool-bookmarklets/main/bookmarkrequesturlV4.txt", // URL is V4 as requested
      k = [];
let l = false;
let modLoaderUI = null;

// Directly call i() to load mods immediately
i();

})();
}();
