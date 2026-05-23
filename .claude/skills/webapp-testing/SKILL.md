---
name: webapp-testing
description: Toolkit for interacting with and testing local web applications using Playwright. Verifies frontend functionality, debugs UI behavior, captures screenshots, and reads browser logs.
license: MIT
---

# Web Application Testing

Use native Python Playwright scripts to test local web applications.

**Helper Scripts:**
- `scripts/with_server.py` — Manages server lifecycle (supports multiple servers)

**Always run scripts with `--help` first** before reading source code.

## Decision Tree

```
User task → Is it static HTML?
    ├─ Yes → Read HTML file directly to identify selectors
    │         └─ Write Playwright script using selectors
    │
    └─ No (dynamic webapp) → Is the server already running?
        ├─ No → Run: python scripts/with_server.py --help
        │        Then use helper + write Playwright script
        │
        └─ Yes → Reconnaissance-then-action:
            1. Navigate and wait for networkidle
            2. Screenshot or inspect DOM
            3. Identify selectors from rendered state
            4. Execute actions with discovered selectors
```

## Using with_server.py

```bash
# Single server
python scripts/with_server.py --server "npm run dev" --port 5173 -- python automation.py

# Multiple servers
python scripts/with_server.py \
  --server "cd backend && python server.py" --port 3000 \
  --server "cd frontend && npm run dev" --port 5173 \
  -- python automation.py
```

## Playwright Script Pattern

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)  # Always headless
    page = browser.new_page()
    page.goto('http://localhost:5173')
    page.wait_for_load_state('networkidle')  # CRITICAL: Wait for JS
    
    # Reconnaissance
    page.screenshot(path='/tmp/inspect.png', full_page=True)
    
    # Action
    page.click('button[data-testid="submit"]')
    page.wait_for_selector('.success-message')
    
    browser.close()
```

## Common Pitfall

Do NOT inspect the DOM before waiting for `networkidle` on dynamic apps. Always call `page.wait_for_load_state('networkidle')` first.

## Best Practices

- Use `sync_playwright()` for synchronous scripts
- Always close the browser when done
- Use descriptive selectors: `text=`, `role=`, CSS, or IDs
- Add appropriate waits: `page.wait_for_selector()` or `page.wait_for_timeout()`
- Use bundled scripts as black boxes — invoke via `--help`, don't read source

## Reference Files in `examples/`

- `element_discovery.py` — Discovering buttons, links, inputs
- `static_html_automation.py` — Using file:// URLs for local HTML
- `console_logging.py` — Capturing console logs
