from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Load semantic model
model = SentenceTransformer("all-MiniLM-L6-v2")  # Lightweight and fast

def skill_gap_analysis(resume_skills, job_description_text):
    # Step 1: Extract candidate job skills (noun phrases)
    job_doc = nlp(job_description_text)
    job_skills = set(chunk.text.lower().strip() for chunk in job_doc.noun_chunks if 1 < len(chunk.text.strip()) < 50)

    # Step 2: Encode skills semantically
    resume_vecs = model.encode(list(resume_skills))
    job_vecs = model.encode(list(job_skills))

    # Step 3: Compute cosine similarity matrix
    sim_matrix = cosine_similarity(resume_vecs, job_vecs)

    present_skills = []
    missing_skills = []

    for i, rskill in enumerate(resume_skills):
        # If resume skill is semantically similar to any job skill (score > 0.6)
        max_sim = np.max(sim_matrix[i])
        if max_sim > 0.6:
            present_skills.append(rskill)

    for j, jskill in enumerate(job_skills):
        max_sim = np.max(sim_matrix[:, j])
        if max_sim < 0.6:
            missing_skills.append(jskill)

    return {
        "resume_skills": resume_skills,
        "job_skills_extracted": list(job_skills),
        "present_in_resume": present_skills,
        "missing_from_resume": missing_skills
    }
