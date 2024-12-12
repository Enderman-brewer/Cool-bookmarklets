javascript:(function() {
    let canvasLeft;
    let canvasRight;

    const visualiser = document.createElement('div');
    visualiser.id = 'audioVisualiser';
    visualiser.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background-color: rgba(0, 0, 0, 0.7);
        padding: 10px;
        border-radius: 5px;
        z-index: 2147483647;
        display: flex;
        flex-direction: column;
        gap: 5px;
    `;

    const canvasContainer = document.createElement('div');
    canvasContainer.style.display = 'flex';
    canvasContainer.style.gap = "10px";

    canvasLeft = document.createElement('canvas');
    canvasLeft.width = 100;
    canvasLeft.height = 50;
    canvasLeft.style.backgroundColor = '#333';
    canvasContainer.appendChild(canvasLeft);

    canvasRight = document.createElement('canvas');
    canvasRight.width = 100;
    canvasRight.height = 50;
    canvasRight.style.backgroundColor = '#333';
    canvasContainer.appendChild(canvasRight);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "10px";

    const mutePageButton = document.createElement('button');
    mutePageButton.textContent = 'Mute Page';
    buttonContainer.appendChild(mutePageButton);

    visualiser.appendChild(canvasContainer);
    visualiser.appendChild(buttonContainer);
    document.body.appendChild(visualiser);

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let analyserLeft;
    let analyserRight;
    let source = null;
    let currentAudioElement = null;
    let animationFrameId;


    function drawCanvas(canvas, dataArray) {
        const canvasCtx = canvas.getContext('2d');
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / dataArray.length) * 2.5;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
            let barHeight = dataArray[i];
            barHeight = (barHeight / 255) * canvas.height;

            canvasCtx.fillStyle = `rgb(${barHeight + 100},50,50)`;
            canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    }

    function draw() {
        if (!analyserLeft || !analyserRight) {
            return;
        }

        const bufferLength = analyserLeft.frequencyBinCount;
        const dataArrayLeft = new Uint8Array(bufferLength);
        const dataArrayRight = new Uint8Array(bufferLength);

        analyserLeft.getByteFrequencyData(dataArrayLeft);
        analyserRight.getByteFrequencyData(dataArrayRight);

        drawCanvas(canvasLeft, dataArrayLeft);
        drawCanvas(canvasRight, dataArrayRight);

        animationFrameId = requestAnimationFrame(draw);
    }

    function setupAudio() {
        const audio = document.querySelector('audio');

        if (!audio) {
            if (source) {
                source.disconnect();
                source = null;
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }
            }
            return;
        }

        if (source && currentAudioElement !== audio) {
            source.disconnect();
            source = null;
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        }

        if (!source) {
            try {
                source = audioContext.createMediaElementSource(audio);
                currentAudioElement = audio;
            } catch (error) {
                console.error("Error creating MediaElementSource:", error);
                return;
            }

            const splitter = audioContext.createChannelSplitter(2);
            analyserLeft = audioContext.createAnalyser();
            analyserRight = audioContext.createAnalyser();

            source.connect(splitter);
            splitter.connect(analyserLeft, 0);
            splitter.connect(analyserRight, 1);

            source.connect(audioContext.destination);

            analyserLeft.fftSize = 256;
            analyserRight.fftSize = 256;

            draw();
        }
    }


    mutePageButton.onclick = () => {
        const audioElements = document.querySelectorAll('audio');
        audioElements.forEach(audio => {
            audio.muted = !audio.muted;
        });
        mutePageButton.textContent = audioElements[0].muted ? "Unmute Page" : "Mute Page";
    };

    const observer = new MutationObserver(setupAudio);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    setupAudio();
})();
