(function() {
    // Create the overlay element
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw'; // Ensure it covers the viewport width
    overlay.style.height = '100vh'; // Ensure it covers the viewport height
    overlay.style.backgroundColor = 'white';
    overlay.style.opacity = '0'; // Start as invisible
    overlay.style.pointerEvents = 'none'; // Prevent interaction
    overlay.style.zIndex = '9999'; // Ensure it appears on top of other elements
    overlay.style.transition = 'opacity 0.3s'; // Smooth transition for visibility change

    // Append the overlay to the body
    document.body.appendChild(overlay);

    // Handle keydown events
    function handleKeyDown(event) {
        if (event.shiftKey) {
		  const element = document.documentElement
            overlay.style.opacity = '1'
		  element.requestFullscreen(); // Show the overlay
        }
    }

    // Handle keyup events
    function handleKeyUp(event) {
        if (!event.shiftKey) {
            overlay.style.opacity = '0'
		  document.exitFullscreen(); // Hide the overlay
        }
    }

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
})();
