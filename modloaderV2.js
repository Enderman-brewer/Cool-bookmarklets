(function() {
    var raw_request_url = "https://raw.githubusercontent.com/Enderman-brewer/Cool-bookmarklets/main/bookmarkrequesturlV2.txt";
    var fontSize = "16px"; // Font size for non-title text
    var titleFontSize = "30px"; // Font size for titles
    console.log("Loading mods");

    function createUI(mods) {
        const ui = document.createElement('div');
        ui.style.position = 'fixed';
        ui.style.top = '10px';
        ui.style.right = '10px';
        ui.style.width = '300px';
        ui.style.padding = '20px'; // Added padding
        ui.style.backgroundColor = '#333'; // Dark background
        ui.style.color = 'white'; // White text
        ui.style.border = '2px solid black';
        ui.style.zIndex = 10000;
        ui.style.fontFamily = "'Comic Sans MS', sans-serif"; // Comic Sans MS font
        ui.style.fontWeight = "bold"; // Bold text
        ui.style.fontSize = fontSize; // Apply general font size
        ui.style.maxHeight = '90vh';
        ui.style.overflowY = 'auto';
        ui.style.opacity = '0'; // Start fully transparent
        ui.style.transition = 'opacity 1s'; // Transition effect for fading in and out

        const title = document.createElement('h3');
        title.textContent = 'Mod Loader';
        title.style.fontSize = titleFontSize; // Apply title font size
        ui.appendChild(title);

        const urlDisplay = document.createElement('p');
        urlDisplay.textContent = `Request URL: ${raw_request_url}`;
        ui.appendChild(urlDisplay);

        mods.forEach(mod => {
            const container = document.createElement('div');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = mod.url;

            const label = document.createElement('label');
            label.textContent = mod.name;

            // Highlight mods with conflicts
            if (mod.conflicts.length > 0) {
                container.style.color = "red";
                label.textContent += ` (Conflicts: ${mod.conflicts.join(", ")})`;
            }

            container.appendChild(checkbox);
            container.appendChild(label);
            ui.appendChild(container);
        });

        const loadButton = document.createElement('button');
        loadButton.textContent = 'Load Selected Mods';
        loadButton.style.fontSize = fontSize; // Apply font size to button
        loadButton.onclick = function() {
            console.log('Load button clicked.');
            const checkboxes = ui.querySelectorAll('input[type="checkbox"]:checked');
            checkboxes.forEach(checkbox => {
                console.log(`Attempting to load: ${checkbox.value}`);
                fetch(checkbox.value)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.text();
                    })
                    .then(scriptContent => {
                        const script = document.createElement('script');
                        script.textContent = scriptContent;
                        document.body.appendChild(script);
                        console.log(`Successfully loaded and executed: ${checkbox.value}`);
                    })
                    .catch(error => {
                        console.error(`Failed to load and execute: ${checkbox.value}`);
                        console.error('Error details:', error);
                    });
            });

            // Fade out the UI
            ui.style.opacity = '0'; // Start fading out
            setTimeout(() => {
                document.body.removeChild(ui);
                console.log('UI removed from document.');
            }, 1000); // Wait for the fade-out transition to complete
        };
        ui.appendChild(loadButton);

        document.body.appendChild(ui);

        // Fade in the UI
        setTimeout(() => {
            ui.style.opacity = '1'; // Fade in
        }, 100); // Adjust timing as needed
    }

    function fetchModList() {
        console.log('Fetching mod list from:', raw_request_url);
        fetch(raw_request_url)
            .then(response => {
                if (!response.ok) {
                    console.error('Failed to fetch:', response.statusText);
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(content => {
                console.log('Successfully fetched mod list.');
                const lines = content.split('\n');
                const mods = [];

                lines.forEach(line => {
                    // Skip empty lines
                    if (!line.trim()) return;

                    const [name, url] = line.split('<>');
                    if (name && url) {
                        mods.push({ name: name.trim(), url: url.trim(), conflicts: [] });
                    } else {
                        console.log(`Skipping invalid line: ${line}`);
                    }
                });

                if (mods.length > 0) {
                    console.log('Mods found:', mods);
                    createUI(mods);
                } else {
                    console.error('No valid mods found.');
                }
            })
            .catch(error => {
                console.error('Error fetching mod list:', error);
            });
    }

    fetchModList();
})();
