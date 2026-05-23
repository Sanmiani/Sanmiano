# n8n REST API Reference

**Base URL (Matt's instance):** `https://lufnet.app.n8n.cloud/api/v1`

## Auth

All requests require an API key header. Generate one in n8n: **Settings → n8n API → Create API Key**.

```
X-N8N-API-KEY: <your-api-key>
```

Store in `.env` as `N8N_API_KEY=` (not yet added — add when needed).

---

## Key Endpoints

### Workflows

| Method | Path | What it does |
|---|---|---|
| `GET` | `/workflows` | List all workflows |
| `GET` | `/workflows/{id}` | Get a specific workflow |
| `POST` | `/workflows` | Create a workflow |
| `PATCH` | `/workflows/{id}` | Update a workflow |
| `DELETE` | `/workflows/{id}` | Delete a workflow |
| `POST` | `/workflows/{id}/activate` | Activate (enable) a workflow |
| `POST` | `/workflows/{id}/deactivate` | Deactivate (disable) a workflow |

**List workflows example:**
```python
import requests, os

headers = {"X-N8N-API-KEY": os.getenv("N8N_API_KEY")}
r = requests.get("https://lufnet.app.n8n.cloud/api/v1/workflows", headers=headers)
workflows = r.json()["data"]
```

**Useful query params for GET /workflows:**
- `?active=true` — only active workflows
- `?limit=50` — up to 250 per page
- `?cursor=<cursor>` — pagination cursor from `nextCursor` in response

### Executions

| Method | Path | What it does |
|---|---|---|
| `GET` | `/executions` | List executions (recent runs) |
| `GET` | `/executions/{id}` | Get a specific execution with full data |
| `DELETE` | `/executions/{id}` | Delete an execution record |
| `POST` | `/executions/{id}/retry` | Retry a failed execution |

**List executions example:**
```python
params = {
    "workflowId": "123",   # filter by workflow
    "status": "error",      # error | success | waiting | running | canceled
    "limit": 20
}
r = requests.get("https://lufnet.app.n8n.cloud/api/v1/executions",
                 headers=headers, params=params)
```

**Response includes:** `id`, `status`, `startedAt`, `stoppedAt`, `workflowId`, `workflowName`, `mode`.

### Trigger a Workflow (Webhook node)

Workflows with a **Webhook trigger** don't use the API — they expose their own URL:

```
POST https://lufnet.app.n8n.cloud/webhook/<path>
Content-Type: application/json

{"topic": "sleep habits", "platform": "instagram"}
```

Find the path in n8n under the Webhook node settings. This is how Claude triggers the content batch workflow.

---

## Pagination

Responses with lists return:
```json
{
  "data": [...],
  "nextCursor": "abc123"   // null if no more pages
}
```

Pass `?cursor=abc123` to get the next page.

---

## Common Status Values

| Status | Meaning |
|---|---|
| `success` | Completed without error |
| `error` | Failed — check logs |
| `waiting` | Paused (waiting for input or timer) |
| `running` | Currently executing |
| `canceled` | Manually stopped |

---

## Matt's Use Cases

| What you want | How |
|---|---|
| See if the Sunday batch ran | `GET /executions?workflowId=<id>&status=success` |
| Retry a failed content workflow | `POST /executions/{id}/retry` |
| Activate a new workflow after editing | `POST /workflows/{id}/activate` |
| List all active workflows | `GET /workflows?active=true` |
| Trigger content generation | `POST` to the workflow's Webhook URL |

---

## Notes

- API requires n8n **version 0.198+** (cloud is always up to date).
- Credentials (API keys for other services stored in n8n) are accessible via `GET /credentials` but values are never returned — only metadata.
- The `n8n-mcp` package connected via `.mcp.json` provides a higher-level interface for running workflows from Claude. Use the MCP tool for most tasks; hit the REST API directly only for monitoring or management.

**Docs:** https://docs.n8n.io/api/
