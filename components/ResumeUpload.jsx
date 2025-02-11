import { useState } from "react";
import { getAtsScore } from "@/utils/geminiApi";

export default function ResumeUpload() {
    const [resumeText, setResumeText] = useState("");
    const [atsScore, setAtsScore] = useState("");

    const analyzeResume = async () => {
        if (!resumeText.trim()) {
            alert("Please paste or upload a resume!");
            return;
        }

        const result = await getAtsScore(resumeText);
        setAtsScore(result);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">📄 AI Resume ATS Checker</h2>

            <textarea
                className="w-full h-40 p-2 border rounded"
                placeholder="Paste your resume here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
            ></textarea>

            <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={analyzeResume}
            >
                Check ATS Score
            </button>

            {atsScore && (
                <div className="mt-4 p-4 border rounded bg-gray-100">
                    <h3 className="text-lg font-semibold">ATS Score & Suggestions:</h3>
                    <p>{atsScore}</p>
                </div>
            )}
        </div>
    );
}
import { getJobSuggestions } from "@/utils/geminiApi";

const [jobRecommendations, setJobRecommendations] = useState([]);

const fetchJobRoles = async () => {
    if (!resumeText.trim()) {
        alert("Please provide a resume first!");
        return;
    }

    const jobs = await getJobSuggestions(resumeText);
    setJobRecommendations(jobs);
};

return (
    <div>
        <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded" onClick={fetchJobRoles}>
            Get Job Suggestions
        </button>

        {jobRecommendations.length > 0 && (
            <ul className="mt-4 p-4 border rounded bg-gray-100">
                <h3 className="text-lg font-semibold">Recommended Job Roles:</h3>
                {jobRecommendations.map((job, index) => (
                    <li key={index}>✅ {job}</li>
                ))}
            </ul>
        )}
    </div>
);
