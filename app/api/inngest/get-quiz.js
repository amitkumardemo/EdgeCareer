import { generateQuiz } from "@/actions/interview";

export default async function handler(req, res) {
  const { domain, difficulty } = req.query;

  try {
    const quizQuestions = await generateQuiz(domain, difficulty);
    res.status(200).json(quizQuestions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching quiz" });
  }
}
