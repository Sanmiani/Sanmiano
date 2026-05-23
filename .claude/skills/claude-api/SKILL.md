---
name: claude-api
description: Use this skill when building applications with the Anthropic API (Claude). Covers model selection, SDK usage, tool use, streaming, managed agents, and best practices.
license: MIT
---

# Claude API Skill

This skill provides guidance for building applications with the Anthropic API.

## Default Model

**claude-opus-4-7** — Use this as the default unless the user specifies otherwise or the use case calls for a lighter model.

Model tiers:
- **Opus 4.7** (`claude-opus-4-7`): Most capable, best for complex reasoning
- **Sonnet 4.6** (`claude-sonnet-4-6`): Balanced capability and speed
- **Haiku 4.5** (`claude-haiku-4-5-20251001`): Fastest, most economical

## SDK Setup

```python
import anthropic

client = anthropic.Anthropic(api_key="your-api-key")

message = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello, Claude"}
    ]
)
print(message.content[0].text)
```

## Tool Use

```python
tools = [
    {
        "name": "get_weather",
        "description": "Get current weather for a location",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {"type": "string", "description": "City and country"}
            },
            "required": ["location"]
        }
    }
]

response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": "What's the weather in Lagos?"}]
)
```

## Streaming

```python
with client.messages.stream(
    model="claude-opus-4-7",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a long essay"}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

## When to Use Managed Agents vs. Claude API

- **Claude API directly**: Single-turn or simple multi-turn conversations, tool use with predictable flow
- **Managed Agents**: Complex multi-step tasks requiring planning, parallel tool calls, or persistent state across many turns

## Best Practices

- Always set `max_tokens` explicitly
- Use system prompts to set context and persona
- Handle rate limits with exponential backoff
- Never hardcode API keys — use environment variables
- Prefer streaming for long responses to improve perceived latency
