export function getMemoryItems(memoryText) {
  return memoryText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export function applyMemoryUpdate(currentItems, newItems, discardedItems, maxItems) {
  const afterDiscard = currentItems.filter((item) => !discardedItems.includes(item));
  const result = [...afterDiscard, ...newItems];

  if (result.length > maxItems) {
    throw new Error(
      `Memory update would exceed max capacity of ${maxItems}. ` +
      `Result has ${result.length} items. Discard more items before adding new ones.`
    );
  }

  return result;
}

export function formatMemoryFile(items) {
  if (items.length === 0) return '';
  return items.join('\n') + '\n';
}

export function isAtCapacity(items, maxItems) {
  return items.length >= maxItems;
}
