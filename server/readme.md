# 🧠 GPT CodeGen Backend

This is the backend service for the GPT CodeGen assistant. It connects to a local Ollama LLM, stores prompt history, and exposes endpoints for code comment generation, test generation, static analysis, and more.

---

## 🚀 Features

- 🔐 Firebase-based authentication (token verification via middleware)
- 🧠 LLM integration with Ollama (e.g. Phi, CodeLlama, Mistral)
- 💾 PostgreSQL logging of prompts, responses, types, and users
- 📄 RESTful API with history, filtering, and search
- 🔍 Keyword + date range search
- 📚 TypeScript + Express architecture

---

## 📦 Setup

### 1. Install Dependencies

```bash
cd server
npm install
