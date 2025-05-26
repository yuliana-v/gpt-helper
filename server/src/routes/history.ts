import { Router, Request, Response } from "express";
import { historyService } from "../services/historyService";
import { HistoryFilter } from "../db/models/HistoryModel";
import { ValidationError, NotFoundError } from "../errors/AppError";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();

interface SearchQueryParams {
  q?: string;
  from?: string;
  to?: string;
}

interface DateRangeQueryParams {
  from?: string;
  to?: string;
}

function parseDateRange(params: DateRangeQueryParams): Partial<HistoryFilter> {
  const filter: Partial<HistoryFilter> = {};
  
  if (params.from) {
    const fromDate = new Date(params.from);
    if (isNaN(fromDate.getTime())) {
      throw new ValidationError(`Invalid 'from' date: ${params.from}`);
    }
    filter.from = fromDate;
  }
  
  if (params.to) {
    const toDate = new Date(params.to);
    if (isNaN(toDate.getTime())) {
      throw new ValidationError(`Invalid 'to' date: ${params.to}`);
    }
    filter.to = toDate;
  }
  
  return filter;
}

router.get("/search", asyncHandler(async (req: Request<{}, {}, {}, SearchQueryParams>, res: Response) => {
  const { q, from, to } = req.query;

  if (!q || typeof q !== "string" || q.trim().length < 2) {
    throw new ValidationError("Query string 'q' is required and must be at least 2 characters.");
  }

  const dateFilter = parseDateRange({ from, to });
  const results = await historyService.getHistory({
    searchQuery: q,
    ...dateFilter
  });
  res.json(results);
}));

router.get("/", asyncHandler(async (req: Request<{}, {}, {}, DateRangeQueryParams>, res: Response) => {
  const { from, to } = req.query;
  const dateFilter = parseDateRange({ from, to });
  const results = await historyService.getHistory(dateFilter);
  res.json(results);
}));

router.get("/:type", asyncHandler(async (
  req: Request<{ type: string }, {}, {}, DateRangeQueryParams>,
  res: Response
) => {
  const { type } = req.params;
  const { from, to } = req.query;

  if (!["comment", "test", "analysis"].includes(type)) {
    throw new ValidationError("Invalid type. Use comment, test, or analysis.");
  }

  const dateFilter = parseDateRange({ from, to });
  const results = await historyService.getHistory({
    type: type as 'comment' | 'test' | 'analysis',
    ...dateFilter
  });
  res.json(results);
}));

router.get("/entry/:id", asyncHandler(async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const { id } = req.params;
  const entry = await historyService.getHistoryById(id);
  
  if (!entry) {
    throw new NotFoundError(`History entry with ID ${id} not found`);
  }
  
  res.json(entry);
}));

export default router;
