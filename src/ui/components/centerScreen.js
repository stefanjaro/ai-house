import { createSpeechBubble } from './speechBubble.js';

const SPRITE_URLS = {
  husband: '/assets/sprites/husband.png',
  wife: '/assets/sprites/wife.png',
  poltergeist: '/assets/sprites/poltergeist.png',
};

const ROOM_IMAGES = {
  bedroom: '/assets/rooms/bedroom.png',
  kitchen: '/assets/rooms/kitchen.png',
  'living-room': '/assets/rooms/living-room.png',
  'mystery-room': '/assets/rooms/mystery-room.png',
};

const CHARACTER_NAMES = {
  husband: 'The Husband',
  wife: 'The Wife',
  poltergeist: 'The Poltergeist',
};

/**
 * Creates the center screen DOM element and returns a controller object.
 *
 * @returns {{ el: HTMLElement, controller: CenterScreenController }}
 */
export function createCenterScreen() {
  const section = document.createElement('div');
  section.id = 'center-screen';

  // Room background
  const bg = document.createElement('img');
  bg.className = 'room-background';
  bg.alt = 'Room';

  // Sprites layer
  const spritesLayer = document.createElement('div');
  spritesLayer.className = 'sprites-layer';

  // Conversation overlay (speech bubbles scroll here)
  const overlay = document.createElement('div');
  overlay.className = 'conversation-overlay';

  // Spacer pushes bubbles to the bottom when there are few messages
  const overlaySpacer = document.createElement('div');
  overlaySpacer.className = 'overlay-spacer';

  // Full-screen overlay for transitions (day start, sleep, selections)
  const transitionOverlay = document.createElement('div');
  transitionOverlay.className = 'transition-overlay hidden';

  // Click-to-proceed prompt
  const clickPrompt = document.createElement('div');
  clickPrompt.className = 'click-prompt hidden';
  clickPrompt.textContent = 'Click anywhere to continue';

  overlay.appendChild(overlaySpacer);

  section.appendChild(bg);
  section.appendChild(spritesLayer);
  section.appendChild(overlay);
  section.appendChild(transitionOverlay);
  section.appendChild(clickPrompt);

  // ── Controller ────────────────────────────────────────────────────────────

  let activeBubble = null;
  let currentSpeaker = null;

  function scrollToBottomIfNear() {
    const threshold = 80;
    const distFromBottom = overlay.scrollHeight - overlay.scrollTop - overlay.clientHeight;
    if (distFromBottom <= threshold) {
      overlay.scrollTop = overlay.scrollHeight;
    }
  }

  const controller = {
    /**
     * Show today's random selections before any conversation.
     * @param {{ coupleRoom, poltergeistRoom, poltergeistTarget, conversationStarter }} today
     * @param {object} names - { husband, wife, poltergeist } display names
     */
    showSelections(today, names = {}) {
      const husbandName = names.husband || 'The Husband';
      const wifeName = names.wife || 'The Wife';
      const poltergeistName = names.poltergeist || 'The Poltergeist';

      const targetName = today.poltergeistTarget === 'husband' ? husbandName : wifeName;

      const html = `
        <div class="selections-box">
          <div class="selections-title">Day Begins</div>
          <div class="selections-row">
            <span class="sel-label">Couple's room:</span>
            <span class="sel-value">${_formatRoom(today.coupleRoom)}</span>
          </div>
          <div class="selections-row">
            <span class="sel-label">Poltergeist lurks in:</span>
            <span class="sel-value">${_formatRoom(today.poltergeistRoom)}</span>
          </div>
          <div class="selections-row">
            <span class="sel-label">Poltergeist targets:</span>
            <span class="sel-value">${targetName}</span>
          </div>
        </div>
      `;
      transitionOverlay.innerHTML = html;
      transitionOverlay.className = 'transition-overlay selections-overlay';
      overlay.innerHTML = '';
    },

    /**
     * Fade in a room background and show character sprites.
     * @param {string} roomName - key in ROOM_IMAGES
     * @param {string[]} sprites - array of character keys
     */
    showRoom(roomName, sprites) {
      // Clear conversation overlay for the new scene, then restore spacer
      overlay.innerHTML = '';
      overlay.appendChild(overlaySpacer);
      activeBubble = null;
      currentSpeaker = null;

      // Hide transition overlay
      transitionOverlay.className = 'transition-overlay hidden';

      // Swap background with fade
      bg.classList.remove('fade-in');
      bg.src = ROOM_IMAGES[roomName] ?? ROOM_IMAGES['living-room'];
      // Force reflow so the animation re-triggers
      void bg.offsetWidth;
      bg.classList.add('fade-in');

      // Set sprites
      spritesLayer.innerHTML = '';
      sprites.forEach((charKey) => {
        const img = document.createElement('img');
        img.className = 'character-sprite fade-in';
        img.src = SPRITE_URLS[charKey] ?? '';
        img.alt = CHARACTER_NAMES[charKey] ?? charKey;
        spritesLayer.appendChild(img);
      });
    },

    /**
     * Called when a new speaker's turn starts.
     * Creates a new speech bubble in the overlay.
     */
    onTurnStart(speakerKey, names = {}) {
      if (activeBubble) {
        activeBubble.finalize();
      }

      const displayName = names[speakerKey] || CHARACTER_NAMES[speakerKey] || speakerKey;
      const spriteUrl = SPRITE_URLS[speakerKey] ?? '';
      activeBubble = createSpeechBubble(displayName, spriteUrl);
      currentSpeaker = speakerKey;
      overlay.appendChild(activeBubble.el);
      overlay.scrollTop = overlay.scrollHeight;
    },

    /**
     * Append a streaming text chunk to the active bubble.
     */
    onChunk(speakerKey, chunk) {
      if (activeBubble && currentSpeaker === speakerKey) {
        activeBubble.appendChunk(chunk);
        scrollToBottomIfNear();
      }
    },

    /**
     * Mark the active bubble as complete.
     */
    onTurnComplete() {
      if (activeBubble) {
        activeBubble.finalize();
        activeBubble = null;
        currentSpeaker = null;
      }
    },

    /**
     * Show the sleep transition overlay.
     */
    showSleep() {
      transitionOverlay.innerHTML = '<div class="sleep-text">The house falls quiet...</div>';
      transitionOverlay.className = 'transition-overlay sleep-overlay';
    },

    /**
     * Show a "Day X begins" overlay.
     */
    showDayTransition(day) {
      transitionOverlay.innerHTML = `<div class="day-transition-text">Day ${day}</div>`;
      transitionOverlay.className = 'transition-overlay day-transition-overlay';
    },

    /**
     * Shows the click-to-proceed prompt and returns a Promise that resolves
     * when the user clicks anywhere on the center screen.
     * @returns {Promise<void>}
     */
    awaitClick() {
      return new Promise((resolve) => {
        clickPrompt.classList.remove('hidden');

        const handler = () => {
          clickPrompt.classList.add('hidden');
          section.removeEventListener('click', handler);
          resolve();
        };

        section.addEventListener('click', handler);
      });
    },
  };

  return { el: section, controller };
}

function _formatRoom(room) {
  return room
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
