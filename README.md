# PROG 02 API examples (CS160)

Small, runnable examples of calling a language model on the Nov 3, 2026 California ballot measures.
Each example is one HTML page plus one short JS file. The page shows the exact prompt it sends,
the model's answer, and OpenRouter's full JSON reply (tokens and cost included).

> Class examples. Not official voter information.

## Run it

1. Copy `js/config.local.example.js` to `js/config.local.js` and paste your OpenRouter key in.
   Keep your key private: don't share or hand in `js/config.local.js`.
2. Serve the folder (browsers block `fetch()` from `file://`):

   ```bash
   python3 -m http.server 8000
   ```

3. Open http://localhost:8000

## Files

| file | what it is |
|---|---|
| `js/openrouter.js` | `askModel(prompt)`: the one function that calls the API. The model is set at the top. |
| `examples/01-summarize.*` | Pick a measure and a length; the model summarizes the legal text. |
| `js/fk.js` | Flesch–Kincaid reading level (no AI). |
| `examples/02-reading-level.*` | Compute a measure's reading level. No AI. |
| `examples/03-spending.*` | Ask OpenRouter how much your key has spent (`GET /api/v1/key`). Free. |
| `examples/04-reading-level-rewrite.*` | The model rewrites a measure for a chosen grade; `fk.js` checks what grade it actually wrote. |
| `examples/05-topic.*` | The model reads Prop 4 and explains what it means for one topic, "My Taxes": what the text says, then a labelled AI opinion. |
| `data/datapack.json` | The ballot measures. Each has `label` (e.g. `"Prop 4"`) and `fullText`, the legal text; words in `[DELETED: ...]` are being removed from the law. `official` holds the state's own summary: show it to people, but don't send it to the model. |
| `pack.offices` (in `datapack.json`) | The five offices on the ballot, from the PROG 02 handout. Not used by these examples yet. |

## Adding an example

Copy `examples/01-summarize.html` and `.js`, rename them, change `buildPrompt`, and add a link in `index.html`.
