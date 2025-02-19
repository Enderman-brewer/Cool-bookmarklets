(function() {
  const styles = {
    container: `
      position: fixed;
      top: 10px;
      right: 10px;
      width: 300px;
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
    `,
    title: `
      font-size: 30px;
      margin-bottom: 10px;
    `,
    modItem: `
      margin-bottom: 5px;
      display: flex;
      align-items: center;
    `,
    modLabel: `
      margin-left: 5px;
    `,
    button: `
      font-size: 16px;
      padding: 8px 12px;
      background-color: #4CAF50;
      border: none;
      color: white;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      cursor: pointer;
      border-radius: 4px;
      margin-top: 10px;
    `,
    error: `
      color: red;
    `,
  };

  let messageQueue = [];
  let isDisplayingMessage = false;

  function displayMessage(message, isError = false, duration = 1000) {
    messageQueue.push({ message, isError, duration });
    if (!isDisplayingMessage) {
      displayNextMessage();
    }
  }

  function displayNextMessage() {
    if (messageQueue.length === 0) {
      isDisplayingMessage = false;
      return;
    }

    isDisplayingMessage = true;
    const { message, isError, duration } = messageQueue.shift();

    const messageContainer = document.createElement("div");
    messageContainer.style.cssText = `
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
    if (isError) {
      messageContainer.style.color = "red";
    }
    messageContainer.textContent = message;
    document.body.appendChild(messageContainer);
    messageContainer.offsetHeight;
    messageContainer.style.opacity = 1;

    setTimeout(() => {
      messageContainer.style.opacity = 0;
      setTimeout(() => {
        if (messageContainer.parentNode) {
          document.body.removeChild(messageContainer);
        }
        displayNextMessage();
      }, 300);
    }, duration);
  }

  const raw_request_url = "https://raw.githubusercontent.com/Enderman-brewer/Cool-bookmarklets/main/bookmarkrequesturlV3.txt";
  const fontSize = "16px"; // Font size for non-title text
  const titleFontSize = "30px"; // Font size for titles

  console.log("Loading mods");
  displayMessage("Loading Mods");

  function createUI(mods) {
    const ui = document.createElement('div');
    ui.style.cssText = styles.container;

    const title = document.createElement('h3');
    title.textContent = 'Mod Loader';
    title.style.cssText = styles.title;
    ui.appendChild(title);

    const urlDisplay = document.createElement('p');
    urlDisplay.textContent = `Request URL: ${raw_request_url}`;
    ui.appendChild(urlDisplay);
mods.forEach(mod => {
      const container = document.createElement('div');
      container.style.cssText = styles.modItem;

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
    loadButton.style.cssText = styles.button;
    loadButton.onclick = function() {
      console.log('Load button clicked.');
      const checkboxes = ui.querySelectorAll('input[type="checkbox"]:checked');
      checkboxes.forEach(checkbox => {
        console.log(`Attempting to load: ${checkbox.value}`);
        fetch(checkbox.value, { cache: "no-store" })
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
            displayMessage(`Successfully loaded and executed: ${checkbox.value}`);
          })
          .catch(error => {
            console.error(`Failed to load and execute: ${checkbox.value}`);
            console.error('Error details:', error);
            displayMessage(`Failed to load and execute: ${checkbox.value}`, true);
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
    displayMessage('Fetching mod list...');
    fetch(raw_request_url, { cache: "no-store" })
      .then(response => {
        if (!response.ok) {
          console.error('Failed to fetch:', response.statusText);
          displayMessage(`Failed to fetch: ${response.statusText}`, true);
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(content => {
        console.log('Successfully fetched mod list.');
        displayMessage('Mod list fetched.');
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
            displayMessage(`Skipping invalid line: ${line}`);
          }
        });

        if (mods.length > 0) {
          console.log('Mods found:', mods);
          displayMessage('Mods found, loading UI');
          createUI(mods);
        } else {
          console.error('No valid mods found.');
          displayMessage('No valid mods found.', true);
        }
      })
      .catch(error => {
        console.error('Error fetching mod list:', error);
        displayMessage('Error fetching mod list.', true);
      });
  }

  fetchModList();
})();
