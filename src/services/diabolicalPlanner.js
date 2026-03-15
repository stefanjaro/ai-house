import { llmService } from './llmService.js';

export const diabolicalPlanner = {
  async runMonologue({ config, personality, memory, previousPlan, onChunk, onComplete }) {
    const { endpoint, apiKey, model } = config.poltergeist;

    const systemPrompt = [
      personality,
      '',
      'MEMORY:',
      memory || '(No memories yet.)',
      '',
      'INSTRUCTIONS:',
      'You are alone in your dark chamber. Deliver a short theatrical monologue (no more than 150 words).',
      'Reflect on what happened today and reveal your diabolical plan for tomorrow.',
      'Speak as if plotting aloud to an unseen audience. Be cunning, gleeful, and sinister.',
    ].join('\n');

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(previousPlan
        ? [{ role: 'assistant', content: previousPlan }]
        : []),
      { role: 'user', content: 'The day is over. Retreat to your chamber and deliver your monologue.' },
    ];

    await llmService.streamCompletion({ endpoint, apiKey, model, messages, onChunk, onComplete });
  },
};
