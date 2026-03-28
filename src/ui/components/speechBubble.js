/**
 * Creates a speech bubble entry for the conversation overlay.
 *
 * @param {string} speakerName - Display name of the speaker
 * @param {string} spriteUrl   - URL for the speaker's small avatar image
 * @returns {{ el: HTMLElement, appendChunk: (chunk: string) => void, finalize: () => void }}
 */
export function createSpeechBubble(speakerName, spriteUrl) {
  const bubble = document.createElement('div');
  bubble.className = 'speech-bubble';

  const header = document.createElement('div');
  header.className = 'bubble-header';

  const avatar = document.createElement('img');
  avatar.className = 'bubble-avatar';
  avatar.src = spriteUrl;
  avatar.alt = speakerName;

  const name = document.createElement('span');
  name.className = 'bubble-name';
  name.textContent = speakerName;

  header.appendChild(avatar);
  header.appendChild(name);

  const text = document.createElement('div');
  text.className = 'bubble-text';

  bubble.appendChild(header);
  bubble.appendChild(text);

  let buffer = '';

  return {
    el: bubble,

    appendChunk(chunk) {
      buffer += chunk;
      // Strip leading whitespace so a leading newline from the LLM
      // doesn't appear as a blank gap below the speaker name.
      text.textContent = buffer.replace(/^\s+/, '');
    },

    finalize() {
      buffer = buffer.trim();
      text.textContent = buffer;
      bubble.classList.add('bubble-complete');
    },
  };
}
