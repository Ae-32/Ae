// EmailJS Credentials
const EMAILJS_PUBLIC_KEY = "vNlM_WY2yBHyXPYB1";
const EMAILJS_SERVICE_ID = "service_egdpyn1";
const EMAILJS_TEMPLATE_ID = "template_jg4tybj";

// Initialize EmailJS
if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

// App State
let selectedFlower = null;
let selectedAnswer = null;

// Screen Switcher
function showScreen(screenId) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(s => s.classList.remove('active'));

  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Navigation
  const btnGetStarted = document.getElementById('btnGetStarted');
  if (btnGetStarted) btnGetStarted.addEventListener('click', () => showScreen('screen-2'));

  const btnSure = document.getElementById('btnSure');
  const btnBye2 = document.getElementById('btnBye2');
  if (btnSure) btnSure.addEventListener('click', () => showScreen('screen-3'));
  if (btnBye2) btnBye2.addEventListener('click', () => showScreen('screen-goodbye'));

  const btnContinue3 = document.getElementById('btnContinue3');
  if (btnContinue3) btnContinue3.addEventListener('click', () => showScreen('screen-4'));

  // Flower Choice
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

  const btnContinue5 = document.getElementById('btnContinue5');
  const btnContinue6 = document.getElementById('btnContinue6');
  if (btnContinue5) btnContinue5.addEventListener('click', () => showScreen('screen-7'));
  if (btnContinue6) btnContinue6.addEventListener('click', () => showScreen('screen-7'));

  // Ready Check
  const btnProceed = document.getElementById('btnProceed');
  const btnExit7 = document.getElementById('btnExit7');
  if (btnProceed) btnProceed.addEventListener('click', () => showScreen('screen-8'));
  if (btnExit7) btnExit7.addEventListener('click', () => showScreen('screen-goodbye'));

  // Main Question & Answer Selection
  const btnNopeOver = document.getElementById('btnNopeOver');
  const btnYesChance = document.getElementById('btnYesChance');
  const explanationInput = document.getElementById('explanationText');
  const explainCatImg = document.getElementById('explainCatImg');

  if (btnNopeOver) {
    btnNopeOver.addEventListener('click', () => {
      selectedAnswer = "Nope, It’s over.";
      if (explanationInput) explanationInput.placeholder = "Mind sharing why?";
      if (explainCatImg) {
        explainCatImg.src = "assets/WhiteCat/No.png";
        explainCatImg.className = "box-cat-img sitting-no";
      }
      showScreen('screen-explain');
    });
  }

  if (btnYesChance) {
    btnYesChance.addEventListener('click', () => {
      selectedAnswer = "Yes (there is still a chance)";
      if (explanationInput) explanationInput.placeholder = "Can we talk in person?";
      if (explainCatImg) {
        explainCatImg.src = "assets/WhiteCat/Yes.png";
        explainCatImg.className = "box-cat-img peeking-yes";
      }
      showScreen('screen-explain');
    });
  }

  const btnBackExplain = document.getElementById('btnBackExplain');
  if (btnBackExplain) btnBackExplain.addEventListener('click', () => showScreen('screen-8'));

  // Explanation -> Confirmation Screen
  const btnSendExplanation = document.getElementById('btnSendExplanation');
  const confirmChoiceText = document.getElementById('confirmChoiceText');
  const confirmMessageText = document.getElementById('confirmMessageText');

  if (btnSendExplanation) {
    btnSendExplanation.addEventListener('click', () => {
      const userMessage = explanationInput ? explanationInput.value.trim() : "";
      if (confirmChoiceText) confirmChoiceText.textContent = selectedAnswer || "No answer selected";
      if (confirmMessageText) confirmMessageText.textContent = userMessage || "(No message provided)";
      showScreen('screen-confirm');
    });
  }

  const btnEditConfirm = document.getElementById('btnEditConfirm');
  if (btnEditConfirm) btnEditConfirm.addEventListener('click', () => showScreen('screen-explain'));

  // Final Send via EmailJS
  const btnFinalSend = document.getElementById('btnFinalSend');

  if (btnFinalSend) {
    btnFinalSend.addEventListener('click', () => {
      const userMessage = explanationInput ? explanationInput.value.trim() : "";

      btnFinalSend.disabled = true;
      const originalText = btnFinalSend.textContent;
      btnFinalSend.textContent = 'Sending...';

      const templateParams = {
        answer: selectedAnswer || "No answer selected",
        message: userMessage
      };

      const goToOutcomeScreen = () => {
        btnFinalSend.disabled = false;
        btnFinalSend.textContent = originalText;
        if (selectedAnswer === "Nope, It’s over.") {
          showScreen('screen-9');
        } else {
          showScreen('screen-10');
        }
      };

      if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY) {
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY)
          .then((res) => {
            console.log('Response sent successfully via EmailJS!', res.status, res.text);
            goToOutcomeScreen();
          })
          .catch((err) => {
            console.error('EmailJS Error:', err);
            goToOutcomeScreen();
          });
      } else {
        setTimeout(goToOutcomeScreen, 400);
      }
    });
  }

  // Close Window Helper
  function closeSite() {
    try {
      window.close();
      window.open('', '_self', '');
      window.close();
    } catch (e) {
      console.warn('Window close error:', e);
    }
    setTimeout(() => {
      try {
        window.location.href = "about:blank";
      } catch (e) {
        document.body.innerHTML = "";
      }
    }, 100);
  }

  const btnOkay9 = document.getElementById('btnOkay9');
  const btnOkay10 = document.getElementById('btnOkay10');
  if (btnOkay9) btnOkay9.addEventListener('click', closeSite);
  if (btnOkay10) btnOkay10.addEventListener('click', closeSite);

  // Restart Flow
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
