/**
 * Live end-to-end test for Phase 06 — Memory System.
 * Requires: npm run server (in a separate terminal) + a valid config.json
 *
 * Run with: npm run test:memory
 */

import { fileService } from '../src/services/fileService.js';
import { memoryService } from '../src/services/memoryService.js';
import { getMemoryItems } from '../src/engine/memoryEngine.js';

fileService._base = 'http://localhost:3001';

const CHARACTER = 'husband';
const MAX_NEW_ITEMS = 5;
const MAX_TOTAL_ITEMS = 20;

// A fake conversation transcript to reflect on
const FAKE_CONVERSATIONS = [
  `Arthur: The harvest festival approaches. I find myself wondering whether Eleanor truly enjoys such events or merely tolerates them for my sake.
Eleanor: My lord, you need not wonder. I have always delighted in the music and the dancing, though I confess I wish you would join me on the floor more often.
Arthur: Perhaps this year I shall make the attempt. For you.
Eleanor: I shall hold you to that promise, husband.`,
];

console.log(`\nLive Memory Reflection Test — Character: ${CHARACTER}`);
console.log('─'.repeat(60));

const config = await fileService.getConfig();
const personality = await fileService.getPersonality(CHARACTER);
const memoryText = await fileService.getMemory(CHARACTER);
const currentMemory = getMemoryItems(memoryText);

console.log(`\nCurrent memory (${currentMemory.length} items):`);
if (currentMemory.length === 0) {
  console.log('  (empty)');
} else {
  currentMemory.forEach((item, i) => console.log(`  ${i + 1}. ${item}`));
}

console.log('\nStreaming reflection thoughts:\n');

await memoryService.reflectAndUpdate({
  character: CHARACTER,
  dayConversations: FAKE_CONVERSATIONS,
  config: config[CHARACTER],
  personality,
  currentMemory,
  maxNewItems: MAX_NEW_ITEMS,
  maxTotalItems: MAX_TOTAL_ITEMS,
  onThought: (chunk) => process.stdout.write(chunk),
  onComplete: (updatedMemoryText) => {
    const updatedItems = getMemoryItems(updatedMemoryText);
    console.log('\n\n' + '─'.repeat(60));
    console.log(`Memory updated. New total: ${updatedItems.length} items.`);
    console.log('\nUpdated memory:');
    updatedItems.forEach((item, i) => console.log(`  ${i + 1}. ${item}`));
    console.log('\nCheck data/memory/husband-memory.md to confirm the file was written.');
  },
});
