// Function to create a TinyURL using fetch
async function createTinyURL(url) {
    const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);

    if (!response.ok) {
        throw new Error('Failed to create TinyURL');
    }

    const tinyURL = await response.text();
    return tinyURL;
}

// Prompt the user for a URL
const defaultURL = window.location.href;
const userURL = prompt('Enter a URL to shorten:', defaultURL);

// Create the TinyURL and display it
createTinyURL(userURL)
    .then(tinyURL => {
        console.log('TinyURL:', tinyURL);
        alert(`TinyURL: ${tinyURL}`);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to create TinyURL');
    });
