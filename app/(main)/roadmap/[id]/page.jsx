"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function RoadmapDetailPage() {
  const { id } = useParams();
  const { data, error, mutate } = useSWR(() => `/api/roadmap/${id}`, fetcher);

  if (error) return <p className="text-destructive">Failed to load</p>;
  if (!data) return <p>Loading...</p>;

  async function handleCompleteTask(taskId) {
    const res = await fetch(`/api/roadmap/${id}/milestones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId }),
    });
    if (res.ok) {
      toast.success("Task marked complete!");
      mutate();
    } else {
      toast.error("Failed");
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <Link href="/roadmap" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
        <ChevronLeft className="h-4 w-4" /> Back to roadmaps
      </Link>
      <h1 className="text-3xl font-bold text-center">{data.title}</h1>
      <Accordion type="single" collapsible className="space-y-4">
        {data.milestones.map((m) => {
          const totalTasks = m.tasks.length;
          const completed = m.tasks.filter((t) => t.completed).length;
          const pct = totalTasks ? Math.round((completed / totalTasks) * 100) : 0;
          return (
            <AccordionItem key={m.id} value={m.id} className="border rounded-lg p-4 bg-card">
              <AccordionTrigger>
                <div className="w-full text-left">
                  <p className="font-medium">{m.title}</p>
                  <Progress value={pct} className="mt-2" />
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                {m.tasks.map((t) => (
                  <div className="flex justify-between items-center border p-3 rounded-lg bg-muted">
                    <div>
                      <p className={t.completed ? "line-through" : ""}>{t.title}</p>
                      {t.resourceUrl && (
                        <a
                          href={t.resourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-primary underline"
                        >
                          Resource
                        </a>
                      )}
                    </div>
                    {!t.completed && (
                      <Button size="sm" onClick={() => handleCompleteTask(t.id)}>
                        Mark Done
                      </Button>
                    )}
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
