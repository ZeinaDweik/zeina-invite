/* ============================================================
   SCRIPT.JS — Zeina's Graduation Party Invitation
   Handles: Start, Replay, Calendar download
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const startOverlay    = document.getElementById('startOverlay');
  const startBtn        = document.getElementById('startBtn');
  const inviteStage     = document.getElementById('inviteStage');
  const btnReplay       = document.getElementById('btnReplay');
  const btnCalendar     = document.getElementById('btnCalendar');
  const bgMusic         = document.getElementById('bgMusic');
  const soundToggle     = document.getElementById('soundToggle');

  // If user prefers reduced motion, skip straight to end
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    startOverlay && startOverlay.classList.add('hidden');
    inviteStage  && inviteStage.classList.add('finished');
  }

  /* ── Play animation with cover transition ── */
  function playAnimationWithTransition() {
    if (startOverlay.classList.contains('transitioning')) return;

    if (bgMusic) {
      bgMusic.play().catch(e => console.log('Autoplay blocked:', e));
    }

    // Step 1: Drop pink string to touch disco ball (takes 0.7s)
    startOverlay.classList.add('transitioning');

    // Step 2: Pull up overlay & start Scene 1 animation in background
    setTimeout(() => {
      startOverlay.classList.add('pull-up');

      inviteStage.classList.remove('play-anim', 'finished');
      void inviteStage.offsetWidth;
      inviteStage.classList.add('play-anim');

      // Lock interaction during main animation
      setTimeout(() => {
        inviteStage.classList.add('finished');
      }, 18000);
    }, 700);

    // Step 3: Set display: none on overlay after slide transition finishes
    setTimeout(() => {
      startOverlay.classList.add('hidden');
    }, 1900);
  }

  /* ── Direct play (for Replay button) ── */
  function playAnimationDirectly() {
    if (bgMusic) {
      bgMusic.play().catch(e => console.log('Autoplay blocked:', e));
    }
    inviteStage.classList.remove('play-anim', 'finished');
    void inviteStage.offsetWidth;
    inviteStage.classList.add('play-anim');

    setTimeout(() => {
      inviteStage.classList.add('finished');
    }, 18000);
  }

  /* ── Start button ── */
  if (startBtn) {
    startBtn.addEventListener('click', playAnimationWithTransition);
  }

  /* ── Replay button ── */
  if (btnReplay) {
    btnReplay.addEventListener('click', playAnimationDirectly);
  }

  /* ── Add to Calendar (.ics download) ── */
  if (btnCalendar) {
    btnCalendar.addEventListener('click', () => {
      const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Zeina Graduation Party//Invite//EN',
        'BEGIN:VEVENT',
        'UID:zeina-graduation-party-2026@invite',
        'DTSTAMP:20260701T000000Z',
        'DTSTART:20260801T190000',
        'DTEND:20260801T235900',
        "SUMMARY:Zeina's Graduation Party 🎓",
        'DESCRIPTION:JOIN THE CELEBRATION! The Royal Occasion – Al Qastal.',
        'LOCATION:The Royal Occasion, Al Qastal',
        'END:VEVENT',
        'END:VCALENDAR',
      ];

      const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
      const url  = URL.createObjectURL(blob);
      const a    = Object.assign(document.createElement('a'), {
        href: url, download: 'Zeina_Graduation_Party.ics'
      });
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  /* ── RSVP Form Interactive Logic ── */
  const btnRsvpYes    = document.getElementById('btnRsvpYes');
  const btnRsvpNo     = document.getElementById('btnRsvpNo');
  const rsvpName      = document.getElementById('rsvpName');
  const btnSubmitRSVP = document.getElementById('btnSubmitRSVP');
  let rsvpStatus      = 'yes';

  if (btnRsvpYes && btnRsvpNo) {
    btnRsvpYes.addEventListener('click', () => {
      btnRsvpYes.classList.add('selected');
      btnRsvpNo.classList.remove('selected');
      rsvpStatus = 'yes';
    });

    btnRsvpNo.addEventListener('click', () => {
      btnRsvpNo.classList.add('selected');
      btnRsvpYes.classList.remove('selected');
      rsvpStatus = 'no';
    });
  }

  if (btnSubmitRSVP) {
    btnSubmitRSVP.addEventListener('click', () => {
      const name = rsvpName.value.trim();
      if (!name) {
        rsvpName.style.borderColor = '#e11d48'; // Red warning border
        rsvpName.focus();
        
        // Shake micro-animation for invalid input
        rsvpName.animate([
          { transform: 'translateX(0)' },
          { transform: 'translateX(-6px)' },
          { transform: 'translateX(6px)' },
          { transform: 'translateX(-4px)' },
          { transform: 'translateX(4px)' },
          { transform: 'translateX(0)' }
        ], { duration: 300, easing: 'ease-in-out' });
        return;
      }
      rsvpName.style.borderColor = ''; // Reset border

      // Visual feedback: show sending status
      btnSubmitRSVP.disabled = true;
      btnSubmitRSVP.textContent = 'Sending...';
      rsvpName.disabled = true;
      if (btnRsvpYes) btnRsvpYes.disabled = true;
      if (btnRsvpNo) btnRsvpNo.disabled = true;

      // Update UI helper function
      const showSuccessState = () => {
        const rsvpFormContent = document.getElementById('rsvpFormContent');
        const rsvpSuccessContent = document.getElementById('rsvpSuccessContent');
        const rsvpSuccessText = document.getElementById('rsvpSuccessText');
        
        if (rsvpFormContent && rsvpSuccessContent && rsvpSuccessText) {
          rsvpFormContent.style.display = 'none';
          rsvpSuccessContent.style.display = 'flex';
          
          if (rsvpStatus === 'yes') {
            rsvpSuccessText.textContent = "Thank you for being part of my special day! 🎓✨";
          } else {
            rsvpSuccessText.textContent = "Sorry you couldn't make it! We will miss you! 💖";
          }
        }
      };

      // Silent Background Submission
      // (Paste your Google Sheet Web App URL inside the quotes below)
      const webhookUrl = 'https://script.google.com/macros/s/AKfycbz1yIy6ZH02lyo92DsI1VYea2Ruz7-QnumcK_7NDSdwT3x8vwl_p4-gXDPFJbjlBGVSAw/exec'; 
      
      if (webhookUrl) {
        fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors', // prevents CORS block errors on google apps scripts redirects
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name, status: rsvpStatus })
        })
        .then(() => {
          showSuccessState();
        })
        .catch(e => {
          console.error("Submission failed:", e);
          // proceed to success state so guest is not stuck
          showSuccessState();
        });
      } else {
        // local simulation if webhook is not set yet
        setTimeout(showSuccessState, 600);
      }
    });
  }

  /* ── Sound Toggle Logic ── */
  const SOUND_ON_SVG = `<svg class="sound-icon-svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
  </svg>`;
  const SOUND_OFF_SVG = `<svg class="sound-icon-svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
  </svg>`;

  if (soundToggle && bgMusic) {
    soundToggle.addEventListener('click', () => {
      // If paused (e.g. toggled before clicking Open), trigger play
      if (bgMusic.paused) {
        bgMusic.play().catch(e => console.log('Autoplay check:', e));
      }

      bgMusic.muted = !bgMusic.muted;
      soundToggle.innerHTML = bgMusic.muted ? SOUND_OFF_SVG : SOUND_ON_SVG;
    });
  }

});
