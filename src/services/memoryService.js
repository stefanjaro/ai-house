import { llmService } from './llmService.js';
import { fileService } from './fileService.js';
import { applyMemoryUpdate, formatMemoryFile, getMemoryItems } from '../engine/memoryEngine.js';

function buildPrompt({ personality, currentMemory, dayConversations, maxNewItems, maxTotalItems }) {
  const memoryList =
    currentMemory.length > 0
      ? currentMemory.map((item, i) => `${i + 1}. ${item}`).join('\n')
      : '(none yet)';

  const conversationBlock =
    dayConversations.length > 0
      ? dayConversations.join('\n\n---\n\n')
      : '(no conversations today)';

  const systemPrompt = `You are reflecting on the day as a character with the following personality:

${personality}

These memories are ALREADY saved. Do NOT repeat them:
${memoryList}

Your task: review today's conversations and decide what NEW things to remember that are not already in your memory above.
- Choose up to ${maxNewItems} genuinely new memories not already listed above.
- If you have nothing new to add, leave NEW MEMORIES empty.
- If adding new memories would push the total above ${maxTotalItems}, you MUST also list existing items to discard (copy their text exactly).
- You may only discard as many items as needed to stay within the ${maxTotalItems} limit.

Respond ONLY in this exact format:

NEW MEMORIES:
1. <first new memory>
2. <second new memory>

DISCARD:
1. <exact text of existing memory to remove>`;

  const userPrompt = `Today's conversations:\n\n${conversationBlock}`;

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];
}

function parseResponse(responseText) {
  const newItems = [];
  const discardItems = [];

  const newSection = responseText.match(/NEW MEMORIES:\s*([\s\S]*?)(?:\nDISCARD:|$)/i);
  if (newSection) {
    const lines = newSection[1].split('\n');
    for (const line of lines) {
      const match = line.trim().match(/^\d+\.\s+(.+)/);
      if (match) newItems.push(match[1].trim());
    }
  }

  const discardSection = responseText.match(/DISCARD:\s*([\s\S]*?)$/i);
  if (discardSection) {
    const lines = discardSection[1].split('\n');
    for (const line of lines) {
      const match = line.trim().match(/^\d+\.\s+(.+)/);
      if (match) discardItems.push(match[1].trim());
    }
  }

  return { newItems, discardItems };
}

export const memoryService = {
  async reflectAndUpdate({
    character,
    dayConversations,
    config,
    personality,
    currentMemory,
    maxNewItems,
    maxTotalItems,
    onThought,
    onComplete,
  }) {
    const messages = buildPrompt({
      personality,
      currentMemory,
      dayConversations,
      maxNewItems,
      maxTotalItems,
    });

    let updatedItems;

    await llmService.streamCompletion({
      endpoint: config.endpoint,
      apiKey: config.apiKey,
      model: config.model,
      messages,
      onChunk: (chunk) => onThought(chunk),
      onComplete: (fullText) => {
        const { newItems, discardItems } = parseResponse(fullText);
        const deduped = newItems.filter((item) => !currentMemory.includes(item));
        try {
          updatedItems = applyMemoryUpdate(currentMemory, deduped, discardItems, maxTotalItems);
        } catch (err) {
          console.warn(`[memoryService] Memory update failed for ${character}: ${err.message}. Keeping original memory.`);
          updatedItems = [...currentMemory];
        }
      },
    });

    const updatedMemoryText = formatMemoryFile(updatedItems);
    await fileService.setMemory(character, updatedMemoryText);
    onComplete(updatedMemoryText);
  },
};
