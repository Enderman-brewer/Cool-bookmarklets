javascript:void function () {
    (function () {
        "use strict";

        // Dispatches a mouse event at the given element.
        function fireEvent(el, type, x, y) {
            const evt = new MouseEvent(type, {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: x,
                clientY: y,
                screenX: x,
                screenY: y
            });
            el.dispatchEvent(evt);
        }

        // Performs the actual autoclicker action.
        function doClick() {
            // Slight random offset for element detection
            const el = document.elementFromPoint(
                mouseX + (2 * (Math.random() * jitter) - jitter),
                mouseY + (2 * (Math.random() * jitter) - jitter)
            );

            if (el) {
                ["mouseover", "mousemove", "mousedown", "mouseup", "click"]
                    .forEach(ev => {
                        fireEvent(el, ev, mouseX, mouseY);
                    });
            }
        }

        // Toggles autoclicker on/off
        function toggle() {
            if (running) {
                clearInterval(interval);
                running = false;
                console.log("Autoclicker stopped");
            } else {
                interval = setInterval(doClick, intervalMs);
                running = true;
                console.log("Autoclicker started");
            }
        }

        let interval = null;
        let running = false;
        let mouseX = 0;
        let mouseY = 0;

        const intervalMs = 100; // How often clicks occur
        const jitter = 5;       // Random offset

        // Track mouse position
        document.addEventListener("mousemove", e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Press "C" to toggle
        document.addEventListener("keydown", e => {
            if (e.key.toLowerCase() === "c") {
                toggle();
            }
        });

        console.log("Autoclicker ready. Hover mouse over target and press 'C' to toggle.");

    })();
}();
