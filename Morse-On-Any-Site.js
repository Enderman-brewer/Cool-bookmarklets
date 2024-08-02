javascript:(function Morse_CodeInjection_main() {
  const container = document.createElement('div');
  container.id = 'Morse_CodeInjection_container';
  container.style.position = 'absolute';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.padding = '10px';
  container.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  container.style.zIndex = '1000'; // Ensures the container stays on top

  const slider = document.createElement('input');
  slider.id = 'Morse_CodeInjection_slider';
  slider.type = 'range';
  slider.min = 100;
  slider.max = 1000;
  slider.value = 500;

  const infoText = document.createElement('span');
  infoText.id = 'Morse_CodeInjection_infoText';
  infoText.textContent = 'Press S to play sound, or slide the slider to change the frequency';
  infoText.style.color = 'white';
  infoText.style.marginLeft = '10px';

  container.appendChild(slider);
  container.appendChild(infoText);

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  let oscillator = null;

  document.addEventListener('keydown', Morse_CodeInjection_handleKeydown);
  document.addEventListener('keyup', Morse_CodeInjection_handleKeyup);

  function Morse_CodeInjection_startOscillator() {
    if (!oscillator) {
      oscillator = audioCtx.createOscillator();
      oscillator.type = 'square';
      oscillator.frequency.value = slider.value;

      const gainNode = audioCtx.createGain();
      gainNode.gain.value = 0.5; // Adjust volume as needed

      oscillator.connect(gainNode).connect(audioCtx.destination);
      oscillator.start();
    }
  }

  function Morse_CodeInjection_stopOscillator() {
    if (oscillator) {
      oscillator.stop();
      oscillator.disconnect();
      oscillator = null;
    }
  }

  function Morse_CodeInjection_updatePosition() {
    container.style.top = `${window.scrollY}px`;
  }

  function Morse_CodeInjection_handleKeydown(event) {
    if (event.key === 's') {
      Morse_CodeInjection_startOscillator();
    }
    if (event.key === 'Escape') {
      Morse_CodeInjection_unload();
    }
  }

  function Morse_CodeInjection_handleKeyup(event) {
    if (event.key === 's') {
      Morse_CodeInjection_stopOscillator();
    }
  }

  function Morse_CodeInjection_unload() {
    // Remove elements with IDs starting with "Morse_CodeInjection_"
    const elements = document.querySelectorAll('[id^="Morse_CodeInjection_"]');
    elements.forEach(el => el.remove());

    // Remove event listeners
    document.removeEventListener('keydown', Morse_CodeInjection_handleKeydown);
    document.removeEventListener('keyup', Morse_CodeInjection_handleKeyup);
    window.removeEventListener('scroll', Morse_CodeInjection_updatePosition);
  }

  window.addEventListener('scroll', Morse_CodeInjection_updatePosition);
  Morse_CodeInjection_updatePosition(); // Initial position

  document.body.appendChild(container);
})();
