// System instructions
const systemPrompt = "System Instructions: This is a contextual analysis of the page, use the info to answer the user's question(s).";

// Ask the user for their input
const userPrompt = prompt("Enter your prompt for the system:");

// Ensure the user provided a prompt
if (!userPrompt) {
    alert("User prompt is required.");
} else {
    // Copy the stripped webpage content
    const strippedHTML = document.body.innerText.trim();

    // Get all input-related fields
    const inputs = Array.from(document.querySelectorAll('input, textarea, select')).map(el => {
        const label = el.labels?.[0]?.innerText || ''; // Try to find a label for input
        const value = el.value || 'No value';
        return `Label: ${label}, Value: ${value}`;
    }).join('\n');

    // Get the current URL
    const pageURL = window.location.href;

    // Format the content in the specified order
    const formattedContent = `
Stripped HTML:
${strippedHTML}

Page URL:
${pageURL}

Inputs and Related Content:
${inputs}

${systemPrompt}

This next part is the user talking (a part of the system instructions):
${userPrompt}
`.trim();

    // Encode the formatted content for URL use
    const queryString = encodeURIComponent(formattedContent);

    // Construct the final URL
    const finalURL = `https://chatgpt.com?q=${queryString}`;

    // Open the final URL in a new tab
    window.open(finalURL, '_blank');
}
