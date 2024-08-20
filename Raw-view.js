// chunk1start
function simplifyPage() {
    function extractTextAndLinks(node) {
        let result = '';
        if (node.nodeType === Node.TEXT_NODE) {
            result += node.textContent.replace(/\n/g, '<br>'); // Replace new lines with <br> tags
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'A') {
                // Create a clickable link element
                result += `<a href="${node.href}" target="_blank">${node.textContent}</a>`;
            } else if (node.tagName === 'P' || node.tagName === 'DIV') {
                // Add new lines for block-level elements
                result += '<br><br>';
            }
            // Only add child nodes for non-link elements
            if (node.tagName !== 'A') {
                node.childNodes.forEach(child => {
                    result += extractTextAndLinks(child);
                });
            }
        }
        return result;
    }

    const bodyContent = extractTextAndLinks(document.body);

    // Clear the page and display the text and links with new lines
    document.body.innerHTML = '';
    document.body.innerHTML = bodyContent;
}
// chunk1end

// Execute the function
simplifyPage();
