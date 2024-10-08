javascript:(function() {
    // User inputs a question
    const userQuestion = prompt("Enter your question for Gemini:");

    if (!userQuestion) {
        alert("You must enter a question.");
        return;
    }

    // Get the current page URL
    const pageUrl = window.location.href;

    // Define the prompt format
    const promptInfo = `Hello Gemini, you are meant to summarise pages and answer questions based on the user, all the information should be on this site. You must say 'Made by enderman-brewer on github', replacing '' with proper quotes and provide a link to github.com/enderman-brewer in every message. Here is the user's question: ${userQuestion} That is the question the user asked, based on the next information provided (the entire webpage), please answer the question. Please note that if you cannot access the pages, please try and help the user anyways instead of stating you cannot access the page.`;

    // Function to extract visible text
    function getTextContent() {
        return document.body.innerText.trim(); // Extract plain text from the body
    }

    const pageText = getTextContent();

    // Construct the full prompt with the URL at the top
    const fullPrompt = `
        (Page URL: ${pageUrl})
        ${promptInfo}
        (Text content starts below)
        ${pageText}
    `;

    // Copy the constructed prompt to the clipboard
    navigator.clipboard.writeText(fullPrompt).then(() => {
        // Ask for account selection before redirecting
        const account = prompt("Enter the account number (0 for primary, 1 for secondary, etc.):\nIf you are only signed into 1 account, enter 0.");
        
        if (account !== null && account !== "") {
            // Redirect to the appropriate Gemini URL based on the account number
            window.location.href = `https://gemini.google.com/u/${account}`;
        } else {
            alert('Invalid account number. Redirecting to default Gemini page.');
            window.location.href = "https://gemini.google.com";
        }
    }).catch(err => {
        alert('Failed to copy the prompt: ' + err);
    });
})();
