(function() {
    const MOD_LIST_URL = "https://raw.githubusercontent.com/Enderman-brewer/Cool-bookmarklets/refs/heads/main/ModloaderDynamicLatestURL.txt";
    
    function showMessage(message, isError = false, duration = 2000) {
        const msgBox = document.createElement("div");
        msgBox.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 8px 12px;
            border-radius: 5px;
            z-index: 10001;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        `;
        if (isError) msgBox.style.color = "red";
        msgBox.textContent = message;
        document.body.appendChild(msgBox);
        msgBox.offsetHeight;
        msgBox.style.opacity = 1;
        setTimeout(() => {
            msgBox.style.opacity = 0;
            setTimeout(() => msgBox.remove(), 300);
        }, duration);
    }

    function loadMod(url) {
        fetch(url, { cache: "no-store" }).then(response => {
            if (!response.ok) throw new Error("Failed to fetch " + url);
            return response.text();
        }).then(scriptContent => {
            const scriptElement = document.createElement("script");
            scriptElement.textContent = scriptContent;
            document.body.appendChild(scriptElement);
            showMessage(`Loaded: ${url}`);
        }).catch(error => {
            console.error("Error loading mod:", error);
            showMessage(`Failed to load: ${url}`, true);
        });
    }

    function fetchAndLoadAllMods() {
        showMessage("Fetching mod list...");
        fetch(MOD_LIST_URL, { cache: "no-store" }).then(response => {
            if (!response.ok) throw new Error("Failed to fetch mod list");
            return response.text();
        }).then(data => {
            const mods = data.split("\n").map(line => line.split("<>")).filter(parts => parts.length === 2);
            if (mods.length === 0) {
                showMessage("No valid mods found.", true);
                return;
            }
            showMessage(`Loading ${mods.length} mods...`);
            mods.forEach(([name, url]) => loadMod(url.trim()));
        }).catch(error => {
            console.error("Error fetching mod list:", error);
            showMessage("Error fetching mod list.", true);
        });
    }

    fetchAndLoadAllMods();
})();
