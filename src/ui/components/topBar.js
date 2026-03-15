export function createTopBar() {
  const bar = document.createElement('div');
  bar.id = 'top-bar';

  const dayDisplay = document.createElement('span');
  dayDisplay.className = 'day-display';
  dayDisplay.textContent = 'Day 1 of 10';

  bar.appendChild(dayDisplay);
  return bar;
}

export function updateDayDisplay(dayNumber) {
  const el = document.querySelector('.day-display');
  if (el) el.textContent = `Day ${dayNumber} of 10`;
}
