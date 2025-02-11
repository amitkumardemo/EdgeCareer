import axios from "axios";

const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText";
const API_KEY = process.env.GEMINI_API_KEY;

// 📌 Function to Get ATS Score Based on Resume Content
export async function getAtsScore(resumeText) {
    try {
        const response = await axios.post(
            `${API_URL}?key=${API_KEY}`,
            {
                prompt: `Analyze the following resume for ATS compatibility and provide a score from 1 to 100 with improvement tips:\n\n${resumeText}`,
                max_tokens: 300
            }
        );

        return response.data.candidates?.[0]?.output || "No response from AI.";
    } catch (error) {
        console.error("Error analyzing ATS Score:", error);
        return "Error retrieving ATS score.";
    }
}
export async function getJobSuggestions(resumeText) {
    try {
        const response = await axios.post(
            `${API_URL}?key=${API_KEY}`,
            {
                prompt: `Based on the following resume, suggest the top 5 job roles that match the candidate's skills:\n\n${resumeText}`,
                max_tokens: 200
            }
        );

        return response.data.candidates?.[0]?.output.split("\n") || ["No job recommendations found."];
    } catch (error) {
        console.error("Error fetching job recommendations:", error);
        return ["Error retrieving jobs."];
    }
}

