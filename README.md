Project Overview:

This is a full-stack TypeScript application, a GPT-powered code generation tool with the following features:

**Key Features:**

Code Generation: The application can generate code based on user prompts

History Tracking: Users can view their generation history

Offline Support: The frontend implements offline queuing of requests

Authentication: Uses Firebase for user authentication

Search Functionality: Includes a search feature for past generations

📦 Architecture:

**Frontend (client/):**

Built with React + TypeScript

Uses Vite as the build tool

Implements Firebase Authentication

Has offline support with request queuing

Uses React Router for navigation

Main pages: Home, History List, History Detail, and Search Results

**Backend (server/):**

Express.js server with TypeScript

Docker support for containerization


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
