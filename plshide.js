(function() {
    // Create the element
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'white';
    overlay.style.opacity = '0'; // Invisible by default
    overlay.style.pointerEvents = 'none'; // Prevent clicking on the element
    overlay.style.transition = 'opacity 0.3s'; // Smooth transition for visibility change
    document.body.appendChild(overlay);

    // Function to handle keydown events
    function handleKeyDown(event) {
        if (event.shiftKey) {
            overlay.style.opacity = '1'; // Make the element fully visible
        }
    }

    // Function to handle keyup events
    function handleKeyUp(event) {
        if (!event.shiftKey) {
            overlay.style.opacity = '0'; // Make the element invisible
        }
    }

    // Attach event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
})();
