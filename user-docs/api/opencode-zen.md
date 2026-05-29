# Example for GPT-5.4-Nano (Non-Thinking Model)

## Request Body

```
curl https://opencode.ai/zen/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADD_API_KEY_HERE" \
  -d '{
    "model": "gpt-5.4-nano",
    "input": [
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
  "id": "resp_06bdfe912318dbef0069ee12ed7f48819bb028bef29fe2313e",
  "object": "response",
  "created_at": 1777210093,
  "status": "completed",
  "background": false,
  "billing": {
    "payer": "developer"
  },
  "completed_at": 1777210094,
  "error": null,
  "frequency_penalty": 0,
  "incomplete_details": null,
  "instructions": null,
  "max_output_tokens": null,
  "max_tool_calls": null,
  "model": "gpt-5.4-nano-2026-03-17",
  "moderation": null,
  "output": [
    {
      "id": "msg_06bdfe912318dbef0069ee12edbd74819ba5abd320943f9fdd",
      "type": "message",
      "status": "completed",
      "content": [
        {
          "type": "output_text",
          "annotations": [],
          "logprobs": [],
          "text": "Hello! 👋 How can I help you today?"
        }
      ],
      "phase": "final_answer",
      "role": "assistant"
    }
  ],
  "parallel_tool_calls": true,
  "presence_penalty": 0,
  "previous_response_id": null,
  "prompt_cache_key": null,
  "prompt_cache_retention": "in_memory",
  "reasoning": {
    "effort": "none",
    "summary": null
  },
  "safety_identifier": "wrk_01KHEK2GWW86AXBVQ2J4H6RK0R",
  "service_tier": "default",
  "store": true,
  "temperature": 1,
  "text": {
    "format": {
      "type": "text"
    },
    "verbosity": "medium"
  },
  "tool_choice": "auto",
  "tools": [],
  "top_logprobs": 0,
  "top_p": 0.98,
  "truncation": "disabled",
  "usage": {
    "input_tokens": 18,
    "input_tokens_details": {
      "cached_tokens": 0
    },
    "output_tokens": 15,
    "output_tokens_details": {
      "reasoning_tokens": 0
    },
    "total_tokens": 33
  },
  "user": null,
  "metadata": {},
  "cost": "0.00002235"
}
```