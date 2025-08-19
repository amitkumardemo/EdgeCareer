// app/lib/aiCareerGuidance.js

// Placeholder API endpoint (replace with your actual API URL)
const API_ENDPOINT = "https://api.example.com/career-guidance"; // Replace with your API URL

/**
 * Fetches AI-powered career guidance based on user skills.
 * @param {string} skills - The skills input by the user (e.g., "JavaScript, Python")
 * @returns {Promise<Object>} - Object containing careerPaths and recommendation
 */
export const getAICareerGuidance = async (skills) => {
  try {
    const response = await fetch('${API_ENDPOINT}?skills=${encodeURIComponent(skills)}', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add your API key or authentication token if required
        // "Authorization": "Bearer YOUR_API_KEY"
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch career guidance");
    }

    const data = await response.json();
    return {
      careerPaths: data.careerPaths || [],
      recommendation: data.recommendation || "No recommendation available.",
    };
  } catch (error) {
    console.error("Error fetching career guidance:", error);
    return {
      careerPaths: [],
      recommendation: "Unable to get career guidance at this time. Please try again later.",
    };
  }
};

/**
 * Preprocesses skills input to ensure consistent formatting.
 * @param {string} skills - Raw skills input
 * @returns {string} - Cleaned skills string
 */
export const preprocessSkills = (skills) => {
  return skills
    .trim()
    .toLowerCase()
    .split(",")
    .map((skill) => skill.trim())
    .filter((skill) => skill.length > 0)
    .join(", ");
};