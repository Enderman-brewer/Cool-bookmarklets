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
      } else if (node.nodeType === Node.ELEMENT_NODE && !['SCRIPT', 'STYLE', 'TEXTAREA'].includes(node.tagName)) {
        for (const child of node.childNodes) walk(child);
      }
    }

    walk(document.body);
  });
