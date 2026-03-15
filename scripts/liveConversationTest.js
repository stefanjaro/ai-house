/**
 * Live end-to-end test for Phase 05.
 * Requires: npm run server (in a separate terminal) + a valid config.json
 *
 * Run with: npm run test:live
 */

import { fileService } from '../src/services/fileService.js';
import { conversationOrchestrator } from '../src/services/conversationOrchestrator.js';

fileService._base = 'http://localhost:3001';

console.log('Loading config and content...\n');

const config = await fileService.getConfig();
const personalities = {
  husband: await fileService.getPersonality('husband'),
  wife: await fileService.getPersonality('wife'),
};
const memories = {
  husband: await fileService.getMemory('husband'),
  wife: await fileService.getMemory('wife'),
};
const roomInfluence = await fileService.getRoomInfluence('bedroom');

console.log(`Running a couple conversation in the bedroom (max 4 turns)...\n`);
console.log('─'.repeat(50));

await conversationOrchestrator.runConversation({
  participants: ['husband', 'wife'],
  room: 'bedroom',
  config,
  personalities,
  memories,
  roomInfluence,
  maxTurns: 4,
  day: 0,
  logType: 'couple',
  onTurnStart: (speaker) => {
    process.stdout.write(`\n[${config[speaker].name}]: `);
  },
  onChunk: (_speaker, chunk) => {
    process.stdout.write(chunk);
  },
  onTurnComplete: () => {
    process.stdout.write('\n');
  },
  onConversationComplete: () => {
    console.log('\n' + '─'.repeat(50));
    console.log('Conversation complete. Check data/husband-wife-conversations/ for the log file.');
  },
});
