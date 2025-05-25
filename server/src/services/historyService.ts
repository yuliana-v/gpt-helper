import { pool } from "../db/client";
import { GenerationRequest } from "../types";

export async function logHistory(entry: GenerationRequest & { result: string }) {
  const query = `
    INSERT INTO llm_history
    (user_id, prompt, input_code, module, function_name, type, response, model)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `;

  const values = [
    entry.user,
    entry.prompt,
    entry.code,
    entry.module,
    entry.functionName,
    entry.type,
    entry.result,
    entry.model
  ];

  console.log("VALUES FOR THE DB", values);

  await pool.query(query, values);
}
