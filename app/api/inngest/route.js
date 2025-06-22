import { serve } from "inngest/next";

import { inngest } from "@/lib/inngest/client";
import { generateIndustryInsights } from "@/lib/inngest/function";
import { dailyEngagementReminder } from "@/lib/inngest/reminder";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [generateIndustryInsights, dailyEngagementReminder],
});
