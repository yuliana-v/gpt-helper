export interface GenerationRequest {
    user: string;
    prompt: string;
    code: string;
    module: string;
    functionName: string;
    model: string;
    type: "comment" | "test" | "analysis";
  }
  