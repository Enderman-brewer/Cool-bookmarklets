javascript:(function() {
    // Make everything editable
    document.body.contentEditable = true;

    // Create a toolbar
    const toolbar = document.createElement('div');
    toolbar.style.position = 'fixed';
    toolbar.style.top = '10px';
    toolbar.style.left = '10px';
    toolbar.style.backgroundColor = 'white';
    toolbar.style.padding = '10px';
    toolbar.style.border = '1px solid black';
    toolbar.style.zIndex = 10000;

    // Font size input
    const fontSizeLabel = document.createElement('label');
    fontSizeLabel.innerText = 'Font Size: ';
    const fontSizeInput = document.createElement('input');
    fontSizeInput.type = 'number';
    fontSizeInput.min = '1';
    fontSizeInput.value = '16';
    fontSizeInput.style.marginRight = '10px';

    // Bold button
    const boldButton = document.createElement('button');
    boldButton.innerText = 'Bold';
    boldButton.onclick = function() {
        document.execCommand('bold');
    };

    // Italic button
    const italicButton = document.createElement('button');
    italicButton.innerText = 'Italic';
    italicButton.onclick = function() {
        document.execCommand('italic');
    };

    // Underline button
    const underlineButton = document.createElement('button');
    underlineButton.innerText = 'Underline';
    underlineButton.onclick = function() {
        document.execCommand('underline');
    };

    // Hyperlink button
    const hyperlinkButton = document.createElement('button');
    hyperlinkButton.innerText = 'Hyperlink';
    hyperlinkButton.onclick = function() {
        const url = prompt('Enter URL:');
        if (url) {
            document.execCommand('createLink', false, url);
        }
    };

    // Image button
    const imageButton = document.createElement('button');
    imageButton.innerText = 'Image';
    imageButton.onclick = function() {
        const imageUrl = prompt('Enter Image URL:');
        if (imageUrl) {
            document.execCommand('insertImage', false, imageUrl);
            addImageResizeSupport();
        }
    };

    // Apply font size
    fontSizeInput.onchange = function() {
        document.execCommand('fontSize', false, '7'); // Apply size
        const fontElements = document.getElementsByTagName('font');
        for (let i = 0; i < fontElements.length; i++) {
            if (fontElements[i].size === '7') {
                fontElements[i].removeAttribute('size');
                fontElements[i].style.fontSize = fontSizeInput.value + 'px';
            }
        }
    };

    // Function to add image resizing support
    function addImageResizeSupport() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.style.resize = 'both';
            img.style.overflow = 'auto';
            img.style.cursor = 'nwse-resize';
            img.addEventListener('mousedown', function() {
                img.style.outline = '2px dashed red'; // Highlight selected image
            });
            img.addEventListener('mouseup', function() {
                img.style.outline = 'none'; // Remove highlight
            });
        });
    }

    // Append elements to toolbar
    toolbar.appendChild(fontSizeLabel);
    toolbar.appendChild(fontSizeInput);
    toolbar.appendChild(boldButton);
    toolbar.appendChild(italicButton);
    toolbar.appendChild(underlineButton);
    toolbar.appendChild(hyperlinkButton);
    toolbar.appendChild(imageButton);

    // Append toolbar to body
    document.body.appendChild(toolbar);

    // Add resizing support to any existing images
    addImageResizeSupport();

    // ESC key to remove the toolbar and disable editing
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            document.body.contentEditable = false;
            toolbar.remove();
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                img.style.resize = '';
                img.style.overflow = '';
                img.style.cursor = '';
                img.style.outline = '';
            });
        }
    });
})();
