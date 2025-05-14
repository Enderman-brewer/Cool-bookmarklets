fetch("https://www.cs.cmu.edu/~biglou/resources/bad-words.txt")
  .then(res => res.text())
  .then(text => {
    const words = text.split("\n").filter(w => w.trim());
    const regex = new RegExp("\\b(" + words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join("|") + ")\\b", "gi");

    function censorTextNode(node) {
      const original = node.nodeValue;
      node.nodeValue = original.replace(regex, match => "*".repeat(match.length));
    }

    function walk(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        censorTextNode(node);
      } else if (node.nodeType === Node.ELEMENT_NODE && !['SCRIPT', 'STYLE', 'TEXTAREA'].includes(node.tagName) && node.tagName !== 'A') {
        for (const child of node.childNodes) walk(child);
      }
    }

    // Function to observe new nodes being added
    function observeDOM() {
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
              censorTextNode(node);
            } else if (node.nodeType === Node.ELEMENT_NODE && !['SCRIPT', 'STYLE', 'TEXTAREA'].includes(node.tagName) && node.tagName !== 'A') {
              walk(node);
            }
          });
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }

    // Start the initial censorship and the observer
    walk(document.body);
    observeDOM();
  });
