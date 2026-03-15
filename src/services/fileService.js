export const fileService = {
  // Configurable base URL — empty string in browser (uses Vite proxy), set to full URL in tests
  _base: '',

  async getConfig() {
    const res = await fetch(`${this._base}/api/config`);
    if (!res.ok) throw new Error(`getConfig failed: ${res.status}`);
    return res.json();
  },

  async getMemory(character) {
    const res = await fetch(`${this._base}/api/memory/${character}`);
    if (!res.ok) throw new Error(`getMemory failed: ${res.status}`);
    return res.text();
  },

  async setMemory(character, content) {
    const res = await fetch(`${this._base}/api/memory/${character}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error(`setMemory failed: ${res.status}`);
    return res.json();
  },

  async getPersonality(character) {
    const res = await fetch(`${this._base}/api/personality/${character}`);
    if (!res.ok) throw new Error(`getPersonality failed: ${res.status}`);
    return res.text();
  },

  async setPersonality(character, content) {
    const res = await fetch(`${this._base}/api/personality/${character}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error(`setPersonality failed: ${res.status}`);
    return res.json();
  },

  async saveConversationLog(type, day, content) {
    const res = await fetch(`${this._base}/api/conversations/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ day, content }),
    });
    if (!res.ok) throw new Error(`saveConversationLog failed: ${res.status}`);
    const data = await res.json();
    return data.filename;
  },

  async listConversationLogs(type) {
    const res = await fetch(`${this._base}/api/conversations/${type}`);
    if (!res.ok) throw new Error(`listConversationLogs failed: ${res.status}`);
    return res.json();
  },

  async getRoomInfluence(room) {
    const res = await fetch(`${this._base}/api/room-influence/${room}`);
    if (!res.ok) throw new Error(`getRoomInfluence failed: ${res.status}`);
    return res.text();
  },
};
