javascript:(function() {
    var raw_request_url = "https://raw.githubusercontent.com/Enderman-brewer/Cool-bookmarklets/main/bookmarkrequesturl.txt";
    console.log("Loading mods")
    function createUI(mods) {
        const ui = document.createElement('div');
        ui.style.position = 'fixed';
        ui.style.top = '10px';
        ui.style.right = '10px';
        ui.style.width = '300px';
        ui.style.padding = '20px';
        ui.style.backgroundColor = '#f0f0f0';
        ui.style.border = '2px solid black';
        ui.style.zIndex = 10000;
        ui.style.fontFamily = 'Arial, sans-serif';
        ui.style.maxHeight = '90vh';
        ui.style.overflowY = 'auto';

        const title = document.createElement('h3');
        title.textContent = 'Mod Loader';
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

            container.appendChild(checkbox);
            container.appendChild(label);
            ui.appendChild(container);
        });

        const loadButton = document.createElement('button');
        loadButton.textContent = 'Load Selected Mods';
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
            document.body.removeChild(ui);
        };
        ui.appendChild(loadButton);

        document.body.appendChild(ui);
        console.log('UI created and appended to the document.');
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
                    const [name, url] = line.split('<>');
                    if (name && url) {
                        mods.push({ name: name.trim(), url: url.trim() });
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
