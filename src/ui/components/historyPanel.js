export function createHistoryPanel() {
  const panel = document.createElement('div');
  panel.id = 'right-panel';

  const heading = document.createElement('div');
  heading.className = 'panel-heading';
  heading.textContent = 'History';

  const content = document.createElement('div');
  content.className = 'panel-content';
  content.textContent = 'Conversation history will appear here.';

  panel.appendChild(heading);
  panel.appendChild(content);

  return panel;
}
