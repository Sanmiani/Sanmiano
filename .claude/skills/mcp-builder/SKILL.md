---
name: mcp-builder
description: Use this skill to build MCP (Model Context Protocol) servers that enable Claude to interact with external services. TypeScript preferred. Four-phase process: research, implement, review, evaluate.
license: MIT
---

# MCP Server Development Guide

This skill teaches how to build high-quality MCP servers. Server quality is measured by how effectively it helps LLMs accomplish real-world tasks.

## Four-Phase Development Process

### Phase 1: Deep Research and Planning

**Study the MCP Protocol:**
- Start at: `https://modelcontextprotocol.io/sitemap.xml`
- Fetch specific pages with `.md` suffix for markdown versions
- Review specification overviews, transport mechanisms, and tool definitions

**Recommended Tech Stack:**
- **Language:** TypeScript (superior SDK support, AI-friendly syntax, strong typing)
- **Transport:** Streamable HTTP for remote servers; stdio for local ones
- **Architecture:** Stateless JSON preferred over stateful streaming

**Plan Your Implementation:**
- Review the target service's API documentation
- Identify key endpoints and authentication requirements
- List endpoints to implement — prioritize common operations
- Use consistent, action-oriented naming conventions (e.g., `github_create_issue`)

### Phase 2: Implementation

**Project Structure:**
- Set up shared utilities: API clients with authentication, error handlers, response formatters, pagination support

**Build Tools:**
- Define input schemas using Zod (TypeScript) or Pydantic (Python)
- Include constraints, descriptions, and field examples
- Define output schemas for structured data
- Write concise tool descriptions with parameter details
- Use proper error handling with actionable messages
- Support pagination where applicable
- Add annotations: `readOnlyHint`, `destructiveHint`, etc.

### Phase 3: Review and Test

**Code Quality Checks:**
- Eliminate code duplication
- Ensure consistent error handling
- Maintain full type coverage
- Verify clear tool descriptions

**Build and Test:**
```bash
npm run build  # TypeScript
npx @modelcontextprotocol/inspector  # Test with MCP Inspector
```

### Phase 4: Create Evaluations

Build comprehensive evaluations using 10 realistic, complex questions that test multi-tool workflows. Each question must be:
- Independent
- Read-only where possible
- Complex (requiring multiple tools)
- Realistic (real-world use cases)
- Verifiable with a stable answer

## MCP Design Principles

- **Comprehensive coverage**: When uncertain, prioritize comprehensive API endpoint coverage
- **Consistent naming**: Use action-oriented prefixes (`service_verb_noun`)
- **Balance**: Mix broad API coverage with specialized workflow tools
- **Security**: Never log credentials; validate all inputs; use environment variables for secrets
