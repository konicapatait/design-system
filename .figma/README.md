# `.figma/` — Figma → token sync

Driven by [`scripts/figma-tokens.mjs`](../scripts/figma-tokens.mjs) (see the
`figma-tokens` skill, or `npm run figma:diff` / `figma:apply` / `figma:verify`).

| Path | What |
| --- | --- |
| `figma-tokens.config.json` | name aliases, role namespaces, dimension namespaces, write targets. Keep in sync with `libs/tokens/src`. |
| `fixtures/variables.local.sample.json` | **checked-in stub** of `GET /v1/files/:key/variables/local`. Used when `FIGMA_TOKEN` is unset. Shaped to exercise every diff class (ok / add / change / remove / naming). |
| `snapshot.json` | git-ignored — last `figma:pull` result (normalised). |

## Live Figma

```bash
export FIGMA_TOKEN=<personal access token>   # figma.com → Settings → Security → personal access tokens (scope: file_variables:read)
export FIGMA_FILE_KEY=<key from the file URL: figma.com/design/<KEY>/...>
npm run figma:diff
```

Without those two env vars every command uses the fixture and prints a `! …using
fixture` banner.

The **Dev Mode MCP** (`get_variable_defs`, `get_design_context`) is the better
route for *component* work; this REST path is for bulk *variable* sync.
