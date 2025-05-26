import { Router, Request, Response } from "express";
import { historyService } from "../services/historyService";
import { HistoryFilter } from "../db/models/HistoryModel";
import { ValidationError, NotFoundError } from "../errors/AppError";
import { asyncHandler } from "../middleware/errorHandler";
import {
  validateSearchParams,
  validateDateRange,
  validateHistoryType,
  validateHistoryId
} from "../middleware/validation";
import {
  SearchParams,
  DateRangeParams,
  HistoryTypeParams,
  HistoryIdParams,
  HistoryResponse,
  HistoryEntryResponse,
  SearchResponse
} from "../types/api";

const router = Router();

function parseDateRange(params: Partial<DateRangeParams>): Partial<HistoryFilter> {
  const filter: Partial<HistoryFilter> = {};
  
  if (params.from) {
    filter.from = new Date(params.from);
  }
  
  if (params.to) {
    filter.to = new Date(params.to);
  }
  
  return filter;
}

router.get(
  "/search",
  validateSearchParams,
  asyncHandler(async (
    req: Request<{}, SearchResponse, {}, SearchParams>,
    res: Response<SearchResponse>
  ) => {
    const { q, from, to } = req.query;
    const dateFilter = parseDateRange({ from, to });
    
    const [results, total] = await Promise.all([
      historyService.getHistory({
        searchQuery: q,
        ...dateFilter
      }),
      historyService.getHistoryCount({
        searchQuery: q,
        ...dateFilter
      })
    ]);

    const limit = 50;
    const offset = 0;

    res.json({
      data: results,
      pagination: {
        total,
        limit,
        offset,
        hasMore: total > offset + limit
      }
    });
  })
);

router.get(
  "/",
  validateDateRange,
  asyncHandler(async (
    req: Request<{}, HistoryResponse, {}, DateRangeParams>,
    res: Response<HistoryResponse>
  ) => {
    const { from, to } = req.query;
    const dateFilter = parseDateRange({ from, to });
    
    const [results, total] = await Promise.all([
      historyService.getHistory(dateFilter),
      historyService.getHistoryCount(dateFilter)
    ]);

    const limit = 50;
    const offset = 0;

    res.json({
      data: results,
      pagination: {
        total,
        limit,
        offset,
        hasMore: total > offset + limit
      }
    });
  })
);

router.get(
  "/:type",
  validateHistoryType,
  validateDateRange,
  asyncHandler(async (
    req: Request<HistoryTypeParams, HistoryResponse, {}, DateRangeParams>,
    res: Response<HistoryResponse>
  ) => {
    const { type } = req.params;
    const { from, to } = req.query;
    const dateFilter = parseDateRange({ from, to });
    
    const [results, total] = await Promise.all([
      historyService.getHistory({
        type: type as 'comment' | 'test' | 'analysis',
        ...dateFilter
      }),
      historyService.getHistoryCount({
        type: type as 'comment' | 'test' | 'analysis',
        ...dateFilter
      })
    ]);

    const limit = 50;
    const offset = 0;

    res.json({
      data: results,
      pagination: {
        total,
        limit,
        offset,
        hasMore: total > offset + limit
      }
    });
  })
);

router.get(
  "/entry/:id",
  validateHistoryId,
  asyncHandler(async (
    req: Request<HistoryIdParams, HistoryEntryResponse>,
    res: Response<HistoryEntryResponse>
  ) => {
    const { id } = req.params;
    const entry = await historyService.getHistoryById(id);
    
    if (!entry) {
      throw new NotFoundError(`History entry with ID ${id} not found`);
    }
    
    res.json(entry);
  })
);

export default router;
