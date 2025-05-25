CREATE TABLE IF NOT EXISTS llm_history (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  prompt TEXT,
  input_code TEXT,
  module TEXT,
  model TEXT,
  function_name TEXT,
  type TEXT,
  response TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
