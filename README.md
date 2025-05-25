📦 Stack

React + TypeScript + Vite

Chakra UI

Firebase Auth (client + server)

Axios + JWT auth header interceptor



📘 API Endpoints
| Method | Path                    | Description                                   |
| ------ | ----------------------- | --------------------------------------------- |
| POST   | `/generate`             | Generate code with prompt & log it            |
| GET    | `/history`              | View all history (with `from`, `to`)          |
| GET    | `/history/:type`        | Filter by type: `comment`, `test`, `analysis` |
| GET    | `/history/search?q=...` | Search keyword in prompt/code/response        |
| GET    | `/history/entry/:id`    | Fetch a single entry by ID                    |



🧭 Pages
| Path                 | Description                   |
| -------------------- | ----------------------------- |
| `/`                  | Prompt interface (generate)   |
| `/history`           | View history + filters        |
| `/history/entry/:id` | Detail view of one result     |
| `/search`            | Keyword and date-range search |
