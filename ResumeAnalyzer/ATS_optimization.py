from sklearn.feature_extraction.text import TfidfVectorizer

def ats_keyword_optimizer(resume_text, job_description_text, top_n=10):
    # Combine into corpus
    corpus = [job_description_text, resume_text]
    vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2), max_df=0.85)

    tfidf_matrix = vectorizer.fit_transform(corpus)
    feature_names = vectorizer.get_feature_names_out()

    jd_vector = tfidf_matrix[0].toarray()[0]
    resume_vector = tfidf_matrix[1].toarray()[0]

    keyword_scores = []
    present_keywords = []

    for i in range(len(feature_names)):
        score_diff = jd_vector[i] - resume_vector[i]
        if jd_vector[i] > 0:
            if score_diff > 0.02:  # Missing or low-weighted
                keyword_scores.append((feature_names[i], score_diff))
            elif resume_vector[i] > 0:
                present_keywords.append(feature_names[i])

    # Sort by impact
    keyword_scores = sorted(keyword_scores, key=lambda x: x[1], reverse=True)
    top_missing = keyword_scores[:top_n]

    # Generate recommendations
    recommendations = [
        f"🔍 *Add or emphasize*: **'{kw}'** (Highly relevant to job role)" for kw, _ in top_missing
    ]

    return {
        "ats_analysis_summary": {
            "missing_keywords_count": len(top_missing),
            "present_keywords_count": len(present_keywords)
        },
        "missing_keywords": [kw for kw, _ in top_missing],
        "present_keywords": present_keywords,
        "recommendations": recommendations
    }
