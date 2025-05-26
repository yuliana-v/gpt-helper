import { pool } from "../client";
import { QueryResult } from "pg";

export interface HistoryEntry {
  id: number;
  user_id: string;
  prompt: string;
  input_code: string;
  module: string;
  function_name: string;
  type: 'comment' | 'test' | 'analysis';
  response: string;
  model: string;
  created_at: Date;
  offline: boolean;
}

export interface HistoryCreateInput {
  user_id: string;
  prompt: string;
  input_code: string;
  module: string;
  function_name: string;
  type: 'comment' | 'test' | 'analysis';
  response: string;
  model: string;
  offline?: boolean;
}

export interface HistoryFilter {
  type?: 'comment' | 'test' | 'analysis';
  from?: Date;
  to?: Date;
  searchQuery?: string;
  userId?: string;
  limit?: number;
  offset?: number;
}

export class DatabaseError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class HistoryModel {
  private static instance: HistoryModel;
  private readonly tableName = 'llm_history';

  private constructor() {}

  static getInstance(): HistoryModel {
    if (!HistoryModel.instance) {
      HistoryModel.instance = new HistoryModel();
    }
    return HistoryModel.instance;
  }

  private buildWhereClause(filters: HistoryFilter): { clause: string; values: any[] } {
    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (filters.type) {
      conditions.push(`type = $${paramIndex++}`);
      values.push(filters.type);
    }

    if (filters.userId) {
      conditions.push(`user_id = $${paramIndex++}`);
      values.push(filters.userId);
    }

    if (filters.searchQuery) {
      conditions.push(`(
        prompt ILIKE $${paramIndex} OR 
        input_code ILIKE $${paramIndex} OR 
        response ILIKE $${paramIndex}
      )`);
      values.push(`%${filters.searchQuery}%`);
      paramIndex++;
    }

    if (filters.from) {
      conditions.push(`created_at >= $${paramIndex++}`);
      values.push(filters.from);
    }

    if (filters.to) {
      conditions.push(`created_at <= $${paramIndex++}`);
      values.push(filters.to);
    }

    return {
      clause: conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
      values
    };
  }

  async create(entry: HistoryCreateInput): Promise<HistoryEntry> {
    const query = `
      INSERT INTO ${this.tableName}
      (user_id, prompt, input_code, module, function_name, type, response, model, offline)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      entry.user_id,
      entry.prompt,
      entry.input_code,
      entry.module,
      entry.function_name,
      entry.type,
      entry.response,
      entry.model,
      entry.offline || false
    ];

    try {
      const result = await pool.query<HistoryEntry>(query, values);
      return result.rows[0];
    } catch (err) {
      throw new DatabaseError('Failed to create history entry', err);
    }
  }

  async findById(id: number): Promise<HistoryEntry | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
    
    try {
      const result = await pool.query<HistoryEntry>(query, [id]);
      return result.rows[0] || null;
    } catch (err) {
      throw new DatabaseError('Failed to fetch history entry by ID', err);
    }
  }

  async find(filters: HistoryFilter = {}): Promise<HistoryEntry[]> {
    const { clause, values } = this.buildWhereClause(filters);
    const limit = filters.limit || 50;
    const offset = filters.offset || 0;

    const query = `
      SELECT * FROM ${this.tableName}
      ${clause}
      ORDER BY created_at DESC
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
    `;

    try {
      const result = await pool.query<HistoryEntry>(query, [...values, limit, offset]);
      return result.rows;
    } catch (err) {
      throw new DatabaseError('Failed to fetch history entries', err);
    }
  }

  async count(filters: HistoryFilter = {}): Promise<number> {
    const { clause, values } = this.buildWhereClause(filters);
    const query = `
      SELECT COUNT(*) as total
      FROM ${this.tableName}
      ${clause}
    `;

    try {
      const result = await pool.query<{ total: string }>(query, values);
      return parseInt(result.rows[0].total, 10);
    } catch (err) {
      throw new DatabaseError('Failed to count history entries', err);
    }
  }

  async deleteById(id: number): Promise<boolean> {
    const query = `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING id`;
    
    try {
      const result = await pool.query(query, [id]);
      return (result.rowCount ?? 0) > 0;
    } catch (err) {
      throw new DatabaseError('Failed to delete history entry', err);
    }
  }
}

export const historyModel = HistoryModel.getInstance(); 