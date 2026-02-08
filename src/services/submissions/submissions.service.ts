import { submissionMockService } from "./submissions.mock";
import { submissionApiService } from "./submissions.api";
import { USE_MOCK } from "@/config/app.config";

export const submissionService = USE_MOCK ? submissionMockService : submissionApiService;
