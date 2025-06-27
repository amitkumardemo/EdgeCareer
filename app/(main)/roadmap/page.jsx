"use client";
import React from "react";
import { Trash2 } from "lucide-react";

import useSWR from "swr";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";

const fetcher = (url) => fetch(url).then((r) => {
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
});

export default function RoadmapListPage() {
  const { data, error, isLoading, mutate } = useSWR("/api/roadmap", fetcher);
  const [open, setOpen] = React.useState(false);
  const [targetRole, setTargetRole] = React.useState("");
  const [customTitle, setCustomTitle] = React.useState("");
  const [weeks, setWeeks] = React.useState(12);
  const [deleteId, setDeleteId] = React.useState(null);
  const router = useRouter();

  async function handleDelete(id) {
    setDeleteId(id);
  }

  async function submitGenerate() {

    const res = await fetch("/api/roadmap/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetRole, title: customTitle || undefined, durationWeeks: weeks }),
    });
    if (res.ok) {
      const roadmap = await res.json();
      setOpen(false);
      setTargetRole("");
      setCustomTitle("");
      mutate();
      router.push(`/roadmap/${roadmap.id}`);
    } else {
      alert("Failed to generate roadmap");
    }
  }

  if (error) return <p className="text-destructive">Failed to load</p>;
  if (isLoading) return <p>Loading...</p>;

  return (
    <>
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Roadmaps</h1>
        <Button onClick={() => setOpen(true)}>Generate new</Button>
      </div>
      {Array.isArray(data) && data.length === 0 && <p>No roadmaps yet.</p>}
      <div className="grid md:grid-cols-2 gap-6">
        {Array.isArray(data) && data.map((rm) => {
          const totalTasks = rm.milestones.reduce((sum, m) => sum + m.tasks.length, 0);
          const completedTasks = rm.milestones.reduce(
            (sum, m) => sum + m.tasks.filter((t) => t.completed).length,
            0
          );
          const pct = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

          return (
            <Card key={rm.id}>
              <CardHeader className="relative">
                <CardTitle>{rm.title}</CardTitle>
                <button
                  onClick={() => handleDelete(rm.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-600"
                  aria-label="Delete roadmap"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Target role: {rm.targetRole}</p>
                <Progress value={pct} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{completedTasks} / {totalTasks} tasks</span>
                  <span>{pct}%</span>
                </div>
                <Button asChild className="w-full mt-2">
                  <Link href={`/roadmap/${rm.id}`}>View details</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>

    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Roadmap</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            type="text"
            autoFocus
            placeholder="Target role (e.g. Frontend Engineer)"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Custom title (optional)"
            className="mt-2"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
          />
          <div className="mt-2">
            <label className="text-sm font-medium">Duration (weeks)</label>
            <select
              className="mt-1 w-full border rounded p-2 bg-background"
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
            >
              {[4,8,12,16,24].map((w)=> (<option key={w} value={w}>{w} weeks</option>))}
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submitGenerate} disabled={!targetRole.trim()}>
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete roadmap?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={async () => {
              const res = await fetch(`/api/roadmap/${deleteId}/delete`, { method: "DELETE" });
              if (res.ok) {
                setDeleteId(null);
                mutate();
              } else {
                alert("Failed to delete");
              }
            }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </> );
}
