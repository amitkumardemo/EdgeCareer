"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { generateCoverLetter } from "@/actions/cover-letter";
import { coverLetterSchema } from "@/app/lib/schema";


// TEMP INLINE schema (replace with import if needed)
const schema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  tone: z.enum(["professional", "friendly", "enthusiastic"]),
  companyName: z.string().min(1, "Company Name is required"),
  jobTitle: z.string().min(1, "Job Title is required"),
  jobDescription: z.string().min(10, "Job Description is too short"),
});

export default function CoverLetterGenerator() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: generating,
    fn: generateLetterFn,
    data: generatedLetter,
  } = useFetch(generateCoverLetter);

  const onSubmit = async (data) => {
    console.log("🧾 Form Submitted With:", data);
    try {
      await generateLetterFn(data);
    } catch (error) {
      console.error("🔥 Error:", error);
      toast.error(error.message || "Error generating cover letter");
    }
  };

  useEffect(() => {
    if (generatedLetter) {
      console.log("✅ Got letter:", generatedLetter);
      toast.success("Cover letter generated!");
      router.push(`/ai-cover-letter/${generatedLetter.id}`);
      reset();
    }
  }, [generatedLetter]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Cover Letter</CardTitle>
          <CardDescription>Fill the fields and click submit</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input {...register("fullName")} />
                {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
              </div>
              <div>
                <Label>Tone</Label>
                <select {...register("tone")} className="w-full border p-2 rounded">
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="enthusiastic">Enthusiastic</option>
                </select>
                {errors.tone && <p className="text-red-500 text-sm">{errors.tone.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Company Name</Label>
                <Input {...register("companyName")} />
                {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName.message}</p>}
              </div>
              <div>
                <Label>Job Title</Label>
                <Input {...register("jobTitle")} />
                {errors.jobTitle && <p className="text-red-500 text-sm">{errors.jobTitle.message}</p>}
              </div>
            </div>

            <div>
              <Label>Job Description</Label>
              <Textarea {...register("jobDescription")} className="h-32" />
              {errors.jobDescription && <p className="text-red-500 text-sm">{errors.jobDescription.message}</p>}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={generating}>
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Cover Letter"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
