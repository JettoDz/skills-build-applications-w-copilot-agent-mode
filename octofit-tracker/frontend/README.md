# OctoFit Tracker Frontend

This React 19 + Vite presentation tier reads backend endpoints from a Codespaces-aware base URL.

## Environment Variable

Define `VITE_CODESPACE_NAME` in `octofit-tracker/frontend/.env.local`.

Example:

```bash
VITE_CODESPACE_NAME=your-codespace-name
```

When this variable is set, the app calls APIs using:

```text
https://${VITE_CODESPACE_NAME}-8000.app.github.dev/api/[component]/
```

When `VITE_CODESPACE_NAME` is not set, the app safely falls back to:

```text
http://localhost:8000/api/[component]/
```

This prevents malformed URLs such as `https://undefined-8000.app.github.dev`.
