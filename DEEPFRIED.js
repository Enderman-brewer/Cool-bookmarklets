javascript:(function() {
    // Function to deep fry an element
    function deepFryElement(element) {
        const randomColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`; // Random color

        // Apply random styles to make the element "deep fried"
        element.style.transition = 'all 0.2s ease-in-out';
        element.style.filter = 'brightness(1.5) contrast(150%) saturate(200%)'; // Less extreme filter
        element.style.backgroundColor = randomColor;
        element.style.color = randomColor;
        element.style.textShadow = `${Math.random() * 5}px ${Math.random() * 5}px 5px rgba(0, 0, 0, 0.5)`; // Less intense shadow
        element.style.boxShadow = `${Math.random() * 10}px ${Math.random() * 10}px 5px rgba(0, 0, 0, 0.5)`; // Less intense box shadow

        // Log the deep frying process
        console.log('Deep frying element:', element);
    }

    // Apply deep fry effect to a limited number of elements (to prevent overwhelming the page)
    const allElements = document.querySelectorAll('*');
    const limit = 50; // Limit to the first 50 elements to avoid performance issues
    console.log('Deep frying initial elements:', Math.min(allElements.length, limit), 'elements found.');
    Array.from(allElements).slice(0, limit).forEach(deepFryElement);

    // Listen for new elements being added and deep fry them as well
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Check if the node is an element
                    console.warn('New element added, deep frying:', node);
                    deepFryElement(node);
                }
            });
        });
    });

    // Configure the observer to watch for added elements in the document body
    observer.observe(document.body, { childList: true, subtree: true });

    console.log('Deep fry script is now active!');
})();
