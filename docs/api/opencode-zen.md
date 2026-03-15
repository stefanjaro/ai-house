# Example for Kimi K2 (Non-Thinking Model)

## Request Body

```
curl https://opencode.ai/zen/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "kimi-k2",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "Hello!"
      }
    ]
  }'
```

# Response Body

```json
{
  "id": "chatcmpl-c6bef299fd4a45c08666055495977c12",
  "choices": [
    {
      "index": 0,
      "message": {
        "content": "Hello! How can I help you today?",
        "role": "assistant"
      },
      "finish_reason": "stop"
    }
  ],
  "created": 1773582097,
  "model": "moonshotai/Kimi-K2-Instruct-0905",
  "object": "chat.completion",
  "usage": {
    "prompt_tokens": 19,
    "completion_tokens": 10,
    "total_tokens": 29,
    "prompt_tokens_details": {
      "audio_tokens": 0,
      "cached_tokens": 0
    },
    "completion_tokens_details": {
      "accepted_prediction_tokens": 0,
      "audio_tokens": 0,
      "reasoning_tokens": 0,
      "rejected_prediction_tokens": 0
    }
  },
  "cost": "0.00003260"
}
```

# Example for Kimi K2.5 (Thinking Model)

## Request Body

```
curl https://opencode.ai/zen/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "kimi-k2.5",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "Hello!"
      }
    ]
  }'
```

## Response Body

```json
{
  "id": "bfcccf27-96ca-4bbc-a9c1-1301699d4c1b",
  "object": "chat.completion",
  "created": 1773582299,
  "model": "accounts/fireworks/models/kimi-k2p5",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?",
        "reasoning_content": "The user just said \"Hello!\" in a friendly manner. This is a simple greeting. I should respond warmly and helpfully, asking how I can assist them today. Since this is the first interaction, I should introduce myself briefly and invite them to ask whatever they need.\n\nI don't need to overthink this - a standard friendly greeting response is appropriate. I should be concise but welcoming."
      },
      "finish_reason": "stop",
      "token_ids": null
    }
  ],
  "usage": {
    "prompt_tokens": 20,
    "total_tokens": 109,
    "completion_tokens": 89,
    "prompt_tokens_details": {
      "cached_tokens": 0
    }
  },
  "prompt_token_ids": null,
  "cost": "0.00027900"
}
```