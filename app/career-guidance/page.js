// app/career-guidance/page.js
"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAICareerGuidance, preprocessSkills } from "@/lib/aiCareerGuidance";

export default function CareerGuidance() {
  const [skills, setSkills] = useState("");
  const [guidance, setGuidance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const processedSkills = preprocessSkills(skills);
    const result = await getAICareerGuidance(processedSkills);
    setGuidance(result);
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>AI Career Guidance</title>
      </Head>
      <h1 className="text-2xl font-bold mb-4">AI-Powered Career Guidance</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="Enter your skills (e.g., JavaScript, Python)"
          className="border p-2 mr-2"
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Get Guidance"}
        </Button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {guidance && (
        <Card>
          <CardContent className="pt-4">
            <h2 className="text-xl font-semibold">Recommended Career Paths:</h2>
            {guidance.careerPaths && guidance.careerPaths.length > 0 ? (
              <ul>
                {guidance.careerPaths.map((path, index) => (
                  <li key={index}>{path}</li>
                ))}
              </ul>
            ) : (
              <p>No career paths found.</p>
            )}
            <p>{guidance.recommendation}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}