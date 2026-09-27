// --- Web Audio API Synth (Cozy Lo-Fi Music Box & Click SFX) ---
class AudioController {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.isMuted = true;
    this.timer = null;
    this.noteIndex = 0;
    
    // Soothing melody frequencies (Pentatonic Scale C Major / A Minor)
    this.melody = [
      523.25, 659.25, 783.99, 1046.50, // C5, E5, G5, C6
      880.00, 659.25, 587.33, 523.25,  // A5, E5, D5, C5
      659.25, 783.99, 880.00, 659.25,  // E5, G5, A5, E5
      587.33, 523.25, 440.00, 523.25   // D5, C5, A4, C5
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.init();
    if (this.isMuted) {
      this.isMuted = false;
      this.startMusic();
      return true;
    } else {
      this.isMuted = true;
      this.stopMusic();
      return false;
    }
  }

  playClickSFX() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {
      console.warn('Audio click error:', e);
    }
  }

  startMusic() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      this.playNote(this.melody[this.noteIndex]);
      this.noteIndex = (this.noteIndex + 1) % this.melody.length;
    }, 600);
  }

  stopMusic() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  playNote(freq) {
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle'; // Soft music box / kalimba timbre
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.2);
    } catch (e) {
      console.warn('Audio note error:', e);
    }
  }
}

const audioCtrl = new AudioController();

// =========================================================================
// EmailJS Configuration
// Replace these placeholder values with your own EmailJS credentials:
// - PUBLIC_KEY: Found under Account > API Keys in EmailJS dashboard
// - SERVICE_ID: Found under Email Services in EmailJS dashboard
// - TEMPLATE_ID: Found under Email Templates in EmailJS dashboard
// =========================================================================
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY_HERE";
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID_HERE";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID_HERE";

// Initialize EmailJS if public key is configured
if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY_HERE") {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

// --- Screen Navigation Logic ---
let selectedFlower = null;
let selectedAnswer = null;

function showScreen(screenId) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(s => s.classList.remove('active'));

  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Audio Mute Toggle Button
  const audioBtn = document.getElementById('audioToggleBtn');
  const audioIcon = document.getElementById('audioIcon');
  const audioText = document.getElementById('audioText');

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const active = audioCtrl.toggle();
      if (active) {
        audioIcon.textContent = '🔊';
        audioText.textContent = 'Music On';
      } else {
        audioIcon.textContent = '🔇';
        audioText.textContent = 'Music Off';
      }
    });
  }

  // Play click SFX on all button clicks
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Auto-init audio context on first user interaction if enabled
      audioCtrl.init();
      audioCtrl.playClickSFX();
    });
  });

  // Navigation Event Listeners
  // Screen 1 -> Screen 2
  const btnGetStarted = document.getElementById('btnGetStarted');
  if (btnGetStarted) {
    btnGetStarted.addEventListener('click', () => showScreen('screen-2'));
  }

  // Screen 2
  const btnSure = document.getElementById('btnSure');
  const btnBye2 = document.getElementById('btnBye2');
  if (btnSure) btnSure.addEventListener('click', () => showScreen('screen-3'));
  if (btnBye2) btnBye2.addEventListener('click', () => showScreen('screen-goodbye'));

  // Screen 3 -> Screen 4
  const btnContinue3 = document.getElementById('btnContinue3');
  if (btnContinue3) {
    btnContinue3.addEventListener('click', () => showScreen('screen-4'));
  }

  // Screen 4 (Flower Choice)
  const btnTulips = document.getElementById('btnTulips');
  const btnLavender = document.getElementById('btnLavender');
  if (btnTulips) {
    btnTulips.addEventListener('click', () => {
      selectedFlower = 'Tulips';
      showScreen('screen-5');
    });
  }
  if (btnLavender) {
    btnLavender.addEventListener('click', () => {
      selectedFlower = 'Lavender';
      showScreen('screen-6');
    });
  }

  // Screen 5 & Screen 6 -> Screen 7
  const btnContinue5 = document.getElementById('btnContinue5');
  const btnContinue6 = document.getElementById('btnContinue6');
  if (btnContinue5) btnContinue5.addEventListener('click', () => showScreen('screen-7'));
  if (btnContinue6) btnContinue6.addEventListener('click', () => showScreen('screen-7'));

  // Screen 7 (Proceed to Question)
  const btnProceed = document.getElementById('btnProceed');
  const btnExit7 = document.getElementById('btnExit7');
  if (btnProceed) btnProceed.addEventListener('click', () => showScreen('screen-8'));
  if (btnExit7) btnExit7.addEventListener('click', () => showScreen('screen-goodbye'));

  // Screen 8 (Main Clarification Question) -> Explanation Screen (Survey.pdf Page 8, 9, 10)
  const btnNopeOver = document.getElementById('btnNopeOver');
  const btnYesChance = document.getElementById('btnYesChance');
  const explanationInput = document.getElementById('explanationText');
  const explainCatImg = document.getElementById('explainCatImg');

  if (btnNopeOver) {
    btnNopeOver.addEventListener('click', () => {
      selectedAnswer = "Nope, It’s over.";
      if (explanationInput) explanationInput.placeholder = "Mind sharing why?";
      if (explainCatImg) explainCatImg.src = "assets/WhiteCat/Gemini_Generated_Image_w679euw679euw679-removebg-preview.png";
      showScreen('screen-explain');
    });
  }

  if (btnYesChance) {
    btnYesChance.addEventListener('click', () => {
      selectedAnswer = "Yes (there is still a chance)";
      if (explanationInput) explanationInput.placeholder = "Can we talk in person?";
      if (explainCatImg) explainCatImg.src = "assets/WhiteCat/Gemini_Generated_Image_qgvzsoqgvzsoqgvz-removebg-preview.png";
      showScreen('screen-explain');
    });
  }

  // Explanation Screen -> Send via EmailJS -> Outcome Screen
  const btnSendExplanation = document.getElementById('btnSendExplanation');

  if (btnSendExplanation) {
    btnSendExplanation.addEventListener('click', () => {
      const userMessage = explanationInput ? explanationInput.value.trim() : "";

      // UI Loading State
      btnSendExplanation.disabled = true;
      const originalText = btnSendExplanation.textContent;
      btnSendExplanation.textContent = 'Sending...';

      const templateParams = {
        answer: selectedAnswer || "No answer selected",
        message: userMessage
      };

      const goToOutcomeScreen = () => {
        btnSendExplanation.disabled = false;
        btnSendExplanation.textContent = originalText;
        if (selectedAnswer === "Nope, It’s over.") {
          showScreen('screen-9');
        } else {
          showScreen('screen-10');
        }
      };

      // Check if EmailJS is properly configured with user credentials
      const isConfigured = typeof emailjs !== 'undefined' && 
        EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY_HERE" && 
        EMAILJS_SERVICE_ID !== "YOUR_SERVICE_ID_HERE" && 
        EMAILJS_TEMPLATE_ID !== "YOUR_TEMPLATE_ID_HERE";

      if (isConfigured) {
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
          .then(() => {
            console.log('Response sent successfully via EmailJS!');
            goToOutcomeScreen();
          })
          .catch((err) => {
            console.error('EmailJS Error:', err);
            goToOutcomeScreen();
          });
      } else {
        console.warn('EmailJS credentials placeholders detected. Parameters ready to send:', templateParams);
        setTimeout(() => {
          goToOutcomeScreen();
        }, 400);
      }
    });
  }

  // Final Screens (Okay buttons)
  const btnOkay9 = document.getElementById('btnOkay9');
  const btnOkay10 = document.getElementById('btnOkay10');
  if (btnOkay9) btnOkay9.addEventListener('click', () => showScreen('screen-goodbye'));
  if (btnOkay10) btnOkay10.addEventListener('click', () => showScreen('screen-goodbye'));

  // Goodbye Screen Restart
  const btnRestart = document.getElementById('btnRestart');
  if (btnRestart) {
    btnRestart.addEventListener('click', () => {
      selectedAnswer = null;
      selectedFlower = null;
      if (explanationInput) explanationInput.value = "";
      showScreen('screen-1');
    });
  }
});
