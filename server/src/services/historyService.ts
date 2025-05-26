import { historyModel, HistoryEntry, HistoryCreateInput, HistoryFilter, DatabaseError } from "../db/models/HistoryModel";
import { GenerationRequest } from "../types";

export async function logHistory(entry: GenerationRequest & { result: string }) {
  try {
    const historyEntry: HistoryCreateInput = {
      user_id: entry.user,
      prompt: entry.prompt,
      input_code: entry.code,
      module: entry.module,
      function_name: entry.functionName,
      type: entry.type,
      response: entry.result,
      model: entry.model,
      offline: entry.offline
    };

    return await historyModel.create(historyEntry);
  } catch (err) {
    console.error("❌ Failed to log history:", err);
    throw err instanceof DatabaseError ? err : new DatabaseError("Failed to log history", err);
  }
}

export class HistoryService {
  async getHistory(filters: HistoryFilter = {}) {
    try {
      return await historyModel.find(filters);
    } catch (err) {
      console.error("❌ Failed to fetch history:", err);
      throw err instanceof DatabaseError ? err : new DatabaseError("Failed to fetch history", err);
    }
  }

  async getHistoryById(id: string) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new Error("Invalid ID. Must be a numeric value.");
    }

    try {
      const entry = await historyModel.findById(numericId);
      if (!entry) {
        throw new Error("History entry not found");
      }
      return entry;
    } catch (err) {
      console.error("❌ Failed to fetch history by ID:", err);
      throw err instanceof DatabaseError ? err : new DatabaseError("Failed to fetch history by ID", err);
    }
  }

  async getHistoryCount(filters: HistoryFilter = {}) {
    try {
      return await historyModel.count(filters);
    } catch (err) {
      console.error("❌ Failed to count history entries:", err);
      throw err instanceof DatabaseError ? err : new DatabaseError("Failed to count history entries", err);
    }
  }

  async deleteHistoryEntry(id: string) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new Error("Invalid ID. Must be a numeric value.");
    }

    try {
      const deleted = await historyModel.deleteById(numericId);
      if (!deleted) {
        throw new Error("History entry not found");
      }
      return true;
    } catch (err) {
      console.error("❌ Failed to delete history entry:", err);
      throw err instanceof DatabaseError ? err : new DatabaseError("Failed to delete history entry", err);
    }
  }
}

export const historyService = new HistoryService();
