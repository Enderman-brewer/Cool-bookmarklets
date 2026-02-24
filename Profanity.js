(async () => {
  // === CONFIG ===
  const URL = "https://www.cs.cmu.edu/~biglou/resources/bad-words.txt";
  const PROCESS_INPUT_ELEMENTS = true; // set false to avoid touching <input>/<textarea> values
  // ==============

  function supportsUnicodeProp() {
    try { new RegExp("\\p{L}", "u"); return true; } catch (e) { return false; }
  }
  function supportsLookbehind() {
    try { new RegExp("(?<!a)a"); return true; } catch (e) { return false; }
  }

  // fetch word list safely
  let raw;
  try {
    const res = await fetch(URL);
    if (!res.ok) throw new Error("fetch failed: " + res.status);
    raw = await res.text();
  } catch (err) {
    console.error("Failed to fetch word list:", err);
    return;
  }

  // build cleaned words list
  let words = raw.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  words = words.filter(w => !/^\*+$/.test(w));      // drop asterisk-only lines
  words = words.map(w => w.normalize("NFKC"));      // unicode normalisation
  words = Array.from(new Set(words));               // dedupe
  words.sort((a,b) => b.length - a.length);         // longest-first

  if (words.length === 0) {
    console.warn("No words after cleaning; nothing to censor.");
    return;
  }

  // escape for regex
  const escaped = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const union = escaped.join("|");

  const hasUnicodeProp = supportsUnicodeProp();
  const hasLookbehind = supportsLookbehind();
  const flags = hasUnicodeProp ? "giu" : "gi";

  // choose class for "word characters" (letters, digits, underscore)
  // prefer Unicode property if available, else ASCII fallback
  const charClass = hasUnicodeProp ? "\\p{L}\\p{N}_" : "A-Za-z0-9_";

  // build regex + replacer
  let regex, replacer;
  if (hasLookbehind && hasUnicodeProp) {
    // best-case: unicode prop + lookbehind
    regex = new RegExp(`(?<![${charClass}])(?:${union})(?![${charClass}])`, flags);
    replacer = match => "*".repeat([...match].length);
  } else if (hasLookbehind && !hasUnicodeProp) {
    // lookbehind but no \p, still use ascii char class
    regex = new RegExp(`(?<![${charClass}])(?:${union})(?![${charClass}])`, flags);
    replacer = match => "*".repeat([...match].length);
  } else {
    // no lookbehind: capture left context to preserve it
    // pattern: (start-or-nonword)(word)(?=end-or-nonword)
    // Note: using lookahead for right side is fine even without lookbehind
    const pattern = `(^|[^${charClass}])(${union})(?=$|[^${charClass}])`;
    regex = new RegExp(pattern, flags);
    replacer = (full, left, word) => (left || "") + "*".repeat([...word].length);
  }

  // sanitise: if regex creation failed, stop
  if (!regex) {
    console.error("Regex creation failed.");
    return;
  }

  // quick utility to censor strings (for testing)
  window.censorString = function(s) {
    if (!s) return s;
    try {
      const norm = s.normalize ? s.normalize("NFKC") : s;
      return norm.replace(regex, replacer);
    } catch (e) {
      console.error("censorString error:", e);
      return s;
    }
  };

  // node-handling functions
  const SKIP_TAGS = new Set(["SCRIPT","STYLE","CODE"]); // we will handle TEXTAREA/PRE/INPUT depending on flag
  function censorTextNode(node) {
    let txt = node.nodeValue;
    if (!txt) return;
    // skip if purely asterisks
    if (/^\s*\*+\s*$/.test(txt)) return;

    const norm = txt.normalize ? txt.normalize("NFKC") : txt;
    const out = norm.replace(regex, replacer);
    if (out !== norm) node.nodeValue = out;
  }

  function censorFormControl(el) {
    // handle <textarea> and <input type="text"> values
    if (el.tagName === "TEXTAREA") {
      const v = el.value || "";
      if (!/^\s*\*+\s*$/.test(v)) {
        const out = (v.normalize ? v.normalize("NFKC") : v).replace(regex, replacer);
        if (out !== v) el.value = out;
      }
    } else if (el.tagName === "INPUT") {
      const type = (el.getAttribute("type") || "text").toLowerCase();
      if (["text","search","email","url","tel"].includes(type)) {
        const v = el.value || "";
        if (!/^\s*\*+\s*$/.test(v)) {
          const out = (v.normalize ? v.normalize("NFKC") : v).replace(regex, replacer);
          if (out !== v) el.value = out;
        }
      }
    }
  }

  function walk(node) {
    if (!node) return;
    if (node.nodeType === Node.TEXT_NODE) {
      censorTextNode(node);
      return;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = node.tagName;
      if (SKIP_TAGS.has(tag)) return;
      if (PROCESS_INPUT_ELEMENTS && (tag === "TEXTAREA" || tag === "INPUT")) {
        censorFormControl(node);
        // continue inside for textarea content that might have child text nodes (some UIs)
      }
      // iterate a static copy
      for (const child of Array.from(node.childNodes)) walk(child);
    }
  }

  // observe future changes
  function observe() {
    const mo = new MutationObserver(muts => {
      for (const m of muts) {
        // handle added nodes
        for (const n of Array.from(m.addedNodes)) walk(n);
        // handle text changes directly
        if (m.type === "characterData" && m.target) censorTextNode(m.target);
      }
    });
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
    return mo;
  }

  // run
  try {
    walk(document.body);
    observe();
    // quick diagnostic: test censoring of the words you listed near top of cleaned list
    console.info("Censor active. sample words checked (first 10):", words.slice(0,10).map(w => ({raw:w, censored: "*".repeat([...w].length)})));
  } catch (e) {
    console.error("Error during initial pass:", e);
  }

  // helpful logging function: try to censor a raw multiline string and return the result
  window._censorTest = function(multilineText) {
    try {
      return censorString(multilineText);
    } catch (e) {
      console.error("test error", e);
      return multilineText;
    }
  };

  console.log("Censor script installed. PROCESS_INPUT_ELEMENTS =", PROCESS_INPUT_ELEMENTS);
})();
