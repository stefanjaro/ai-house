export const llmService = {
  async streamCompletion({ endpoint, apiKey, model, messages, onChunk, onComplete }) {
    const base = endpoint.replace(/\/chat\/completions\/?$/, '').replace(/\/$/, '');
    const res = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages, stream: true }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`LLM request failed: ${res.status} — ${text}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep incomplete last line

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const raw = line.slice(6).trim();
        if (raw === '[DONE]') continue;

        try {
          const parsed = JSON.parse(raw);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            onChunk(content);
            fullText += content;
          }
        } catch {
          // skip malformed lines
        }
      }
    }

    onComplete(fullText);
  },
};
