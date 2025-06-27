import { db } from "@/lib/prisma";
import { inngest } from "./client";

// Daily engagement reminder cron job
// Fires every day at 09:00 IST (03:30 UTC) and sends an event for each user that still has pending tasks.
// You can subscribe to the `reminder.sent` event elsewhere (email worker, push notification etc.)
export const dailyEngagementReminder = inngest.createFunction(
  {
    id: "daily-engagement-reminder",
    name: "Daily Engagement Reminder",
    concurrency: { limit: 1 },
  },
  { cron: "0 9 * * *", tz: "Asia/Kolkata" },
  async ({ step }) => {
  
    const users = await step.run("Fetch users with pending tasks", async () => {
      return db.user.findMany({
        where: {
          roadmaps: {
            some: {
              status: "active",
              milestones: {
                some: {
                  tasks: {
                    some: {
                      completed: false,
                    },
                  },
                },
              },
            },
          },
        },
        select: {
          id: true,
          email: true,
          name: true,
          roadmaps: {
            where: { status: "active" },
            select: {
              id: true,
              title: true,
              milestones: {
                select: {
                  tasks: {
                    where: { completed: false },
                    select: { id: true },
                  },
                },
              },
            },
          },
        },
      });
    });


    for (const user of users) {
      const pendingTasks = user.roadmaps.flatMap((r) =>
        r.milestones.flatMap((m) => m.tasks)
      ).length;


      if (pendingTasks === 0) continue;

      await step.sendEvent("reminder.sent", {
        name: "User Engagement Reminder",
        userId: user.id,
        data: {
          pendingTasks,
          email: user.email,
          name: user.name,
        },
      });
    }
  }
);
