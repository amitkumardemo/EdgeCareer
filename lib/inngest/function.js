import { db } from "@/lib/prisma";
import { inngest } from "./client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { encryptData } from "@/lib/encryption";
import { spawn } from "child_process";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateIndustryInsights = inngest.createFunction(
  { name: "Generate Industry Insights" },
  { cron: "0 0 * * 0" }, // Run every Sunday at midnight
  async ({ event, step }) => {
    const industries = await step.run("Fetch industries", async () => {
      return await db.industryInsight.findMany({
        select: { industry: true },
      });
    });

    for (const { industry } of industries) {
      const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

      const res = await step.ai.wrap(
        "gemini",
        async (p) => {
          return await model.generateContent(p);
        },
        prompt
      );

      const text = res.response.candidates[0].content.parts[0].text || "";
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

      const insights = JSON.parse(cleanedText);

      await step.run(`Update ${industry} insights`, async () => {
        await db.industryInsight.update({
          where: { industry },
          data: {
            ...insights,
            lastUpdated: new Date(),
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
      });
    }
  }
);

async function callPythonParser(fileBuffer) {
  return new Promise((resolve, reject) => {
    const python = spawn("python", ["ResumeAnalyzer/ResumeParser.py", "--stdin"]);
    let result = "";
    python.stdin.write(fileBuffer);
    python.stdin.end();
    python.stdout.on("data", (data) => (result += data));
    python.stderr.on("data", (err) => reject(err.toString()));
    python.on("close", () => resolve(JSON.parse(result)));
  });
}

export const processResumeBatch = inngest.createFunction(
  { id: "resume-batch-processor" },
  { event: "resume.parse" },
  async ({ event }) => {
    const { userId, files } = event.data;
    for (const file of files) {
      // 1. NLP Parsing (Python)
      const parsed = await callPythonParser(file.buffer);
      // 2. Insights Engine (Gemini API)
      const prompt = `Analyze this resume JSON and provide: \n- ATS keyword suggestions\n- Gap analysis (missing skills/experience)\n- Top strengths\n- Recommendations for improvement\nResume JSON: ${JSON.stringify(parsed)}\nRespond in JSON with keys: keywords, gaps, strengths, recommendations.`;
      const result = await model.generateContent(prompt);
      const insights = JSON.parse(result.response.text().trim());
      // 3. Encrypt and store
      const encrypted = encryptData({ parsed, insights });
      await db.resume.create({
        data: {
          userId,
          content: encrypted,
        },
      });
    }
    return { status: "done" };
  }
);
