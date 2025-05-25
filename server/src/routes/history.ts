import { Router } from "express";
import { pool } from "../db/client";

const router = Router();

router.get("/search", async (req, res) => {
  const { q, from, to } = req.query;

  if (!q || typeof q !== "string" || q.trim().length < 2) {
    return res.status(400).json({ error: "Query string 'q' is required and must be at least 2 characters." });
  }

  const filters = [
    `(prompt ILIKE $1 OR input_code ILIKE $1 OR response ILIKE $1)`
  ];
  const values: any[] = [`%${q}%`];
  let paramIndex = 2;

  if (from) {
    filters.push(`created_at >= $${paramIndex++}`);
    values.push(from);
  }

  if (to) {
    filters.push(`created_at <= $${paramIndex++}`);
    values.push(to);
  }

  const whereClause = `WHERE ${filters.join(" AND ")}`;

  try {
    const result = await pool.query(
      `
      SELECT * FROM llm_history
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT 50
      `,
      values
    );
    res.json(result.rows);
  } catch (err: any) {
    console.error("❌ Search failed:", err.message);
    res.status(500).json({ error: "Failed to search history." });
  }
});

router.get("/", async (req, res) => {
  const { from, to } = req.query;

  const filters: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (from) {
    filters.push(`created_at >= $${paramIndex++}`);
    values.push(from);
  }

  if (to) {
    filters.push(`created_at <= $${paramIndex++}`);
    values.push(to);
  }

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

  const query = `
    SELECT * FROM llm_history
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT 50
  `;

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err: any) {
    console.error("❌ Failed to fetch filtered history:", err.message);
    res.status(500).json({ error: "Failed to fetch history." });
  }
});

router.get("/:type", async (req, res) => {
  const { type } = req.params;
  const { from, to } = req.query;

  if (!["comment", "test", "analysis"].includes(type)) {
    return res.status(400).json({ error: "Invalid type. Use comment, test, or analysis." });
  }

  const filters = [`type = $1`];
  const values: any[] = [type];
  let paramIndex = 2;

  if (from) {
    filters.push(`created_at >= $${paramIndex++}`);
    values.push(from);
  }

  if (to) {
    filters.push(`created_at <= $${paramIndex++}`);
    values.push(to);
  }

  const whereClause = `WHERE ${filters.join(" AND ")}`;

  try {
    const result = await pool.query(
      `
      SELECT * FROM llm_history
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT 50
      `,
      values
    );
    res.json(result.rows);
  } catch (err: any) {
    console.error("❌ Failed to fetch filtered history:", err.message);
    res.status(500).json({ error: "Failed to fetch filtered history" });
  }
});

router.get("/entry/:id", async (req, res) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ error: "Invalid ID. Must be a numeric value." });
  }

  try {
    const result = await pool.query("SELECT * FROM llm_history WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "History entry not found." });
    }

    res.json(result.rows[0]);
  } catch (err: any) {
    console.error("❌ Failed to fetch history by ID:", err.message);
    res.status(500).json({ error: "Failed to fetch history entry." });
  }
});


export default router;
