import re
import spacy
import pdfplumber
import phonenumbers
from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline
import docx

# Use the best available transformer model for NER (DeBERTa-v3-large fine-tuned for NER)
hf_model_name = "Jean-Baptiste/roberta-large-ner-english"
tokenizer = AutoTokenizer.from_pretrained(hf_model_name)
model = AutoModelForTokenClassification.from_pretrained(hf_model_name)
ner_pipeline = pipeline("ner", model=model, tokenizer=tokenizer, aggregation_strategy="simple")

# Use spaCy for fallback and linguistic features
nlp = spacy.load("en_core_web_trf")  # Transformer-based spaCy model


def parse_resume_from_pdf(pdf_path):
    parsed_data = {
        "name": None,
        "email": None,
        "phone": None,
        "skills": [],
        "education": [],
        "experience": [],
        "certifications": [],
        "achievements": []
    }

    full_text = ""
    headings = []

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            words = page.extract_words(extra_attrs=["size", "fontname"])
            prev_font_size = None
            for word in words:
                text = word["text"].strip()
                font_size = word["size"]
                if prev_font_size and font_size - prev_font_size > 1:
                    headings.append((text.lower(), len(full_text)))
                elif text.isupper() and len(text) < 30:
                    headings.append((text.lower(), len(full_text)))
                full_text += " " + text
                prev_font_size = font_size

    # --- Deep NLP Extraction using HuggingFace NER ---
    ner_results = ner_pipeline(full_text)
    entities = {"PER": [], "ORG": [], "LOC": [], "MISC": []}
    for ent in ner_results:
        label = ent["entity_group"]
        entities.setdefault(label, []).append(ent["word"])

    # 1. Extract Name (PERSON)
    if entities.get("PER"):
        parsed_data["name"] = " ".join(entities["PER"][0:2])  # Take first two tokens as name
    else:
        # Fallback to spaCy
        doc = nlp(full_text)
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                parsed_data["name"] = ent.text
                break

    # 2. Extract Email
    email_match = re.findall(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", full_text)
    parsed_data["email"] = email_match[0] if email_match else None

    # 3. Extract Phone
    for match in phonenumbers.PhoneNumberMatcher(full_text, "IN"):
        parsed_data["phone"] = phonenumbers.format_number(match.number, phonenumbers.PhoneNumberFormat.E164)
        break

    # 4. Extract Skills, Education, Experience, Certifications, Achievements
    parsed_data["skills"] = extract_skills_transformer(full_text, ner_results)
    parsed_data["education"] = extract_education_transformer(full_text, ner_results)
    parsed_data["experience"] = extract_experience_transformer(full_text, ner_results)
    parsed_data["certifications"] = extract_certifications_transformer(full_text, ner_results)
    parsed_data["achievements"] = extract_awards_and_achievements(full_text)

    return parsed_data


def extract_skills_transformer(text, ner_results):
    # Use MISC and ORG entities as possible skills, fallback to noun chunks
    skills = set()
    for ent in ner_results:
        if ent["entity_group"] in ["MISC", "ORG"] and len(ent["word"]) > 2:
            skills.add(ent["word"].strip())
    # Fallback to noun chunks
    if not skills:
        doc = nlp(text)
        for chunk in doc.noun_chunks:
            chunk_text = chunk.text.strip().lower()
            if 2 < len(chunk_text) < 50 and re.search(r'\b([a-zA-Z]+)\b', chunk_text):
                skills.add(chunk_text)
    return list(skills)


def extract_education_transformer(text, ner_results):
    # Look for education keywords and ORG entities
    education_keywords = ["bachelor", "master", "phd", "mba", "m.tech", "b.tech", "university", "college", "school"]
    education = set()
    for ent in ner_results:
        if ent["entity_group"] == "ORG" and any(kw in ent["word"].lower() for kw in education_keywords):
            education.add(ent["word"].strip())
    # Fallback to keyword search
    lines = text.split("\n")
    for line in lines:
        lower_line = line.lower()
        if any(kw in lower_line for kw in education_keywords):
            education.add(line.strip())
    return list(education)


def extract_experience_transformer(text, ner_results):
    # Look for experience-related keywords and ORG entities
    experience_keywords = ["worked", "experience", "role", "intern", "company", "employer", "position"]
    experience = set()
    lines = text.split("\n")
    for line in lines:
        lower_line = line.lower()
        if any(kw in lower_line for kw in experience_keywords):
            experience.add(line.strip())
    return list(experience)


def extract_certifications_transformer(text, ner_results):
    cert_keywords = ["certified", "certification", "course", "diploma", "certificate"]
    certifications = set()
    lines = text.split("\n")
    for line in lines:
        lower_line = line.lower()
        if any(kw in lower_line for kw in cert_keywords):
            certifications.add(line.strip())
    return list(certifications)


def extract_awards_and_achievements(text):
    achievement_keywords = [
        "achievement", "achievements", "award", "awards",
        "honor", "honours", "honors", "recognition", "recognized",
        "winner", "won", "prize", "awarded", "recipient", "best"
    ]
    achievements = []
    lines = text.split("\n")
    for line in lines:
        lower_line = line.strip().lower()
        if any(kw in lower_line for kw in achievement_keywords):
            achievements.append(line.strip())
    return list(set(achievements))


def extract_text_from_docx(docx_path):
    doc = docx.Document(docx_path)
    full_text = []
    for para in doc.paragraphs:
        full_text.append(para.text)
    return '\n'.join(full_text)


def parse_resume_from_txt(txt_path):
    with open(txt_path, 'r', encoding='utf-8') as f:
        return f.read()


def parse_resume(file_path, file_type):
    """
    file_type: 'pdf', 'docx', or 'txt'
    """
    if file_type == 'pdf':
        return parse_resume_from_pdf(file_path)
    elif file_type == 'docx':
        text = extract_text_from_docx(file_path)
    elif file_type == 'txt':
        text = parse_resume_from_txt(file_path)
    else:
        raise ValueError('Unsupported file type')
    return parse_resume_from_text(text)


def parse_resume_from_text(full_text):
    parsed_data = {
        "name": None,
        "email": None,
        "phone": None,
        "skills": [],
        "education": [],
        "experience": [],
        "certifications": [],
        "achievements": []
    }
    # --- Deep NLP Extraction using HuggingFace NER ---
    ner_results = ner_pipeline(full_text)
    entities = {"PER": [], "ORG": [], "LOC": [], "MISC": []}
    for ent in ner_results:
        label = ent["entity_group"]
        entities.setdefault(label, []).append(ent["word"])
    # 1. Extract Name (PERSON)
    if entities.get("PER"):
        parsed_data["name"] = " ".join(entities["PER"][0:2])  # Take first two tokens as name
    else:
        # Fallback to spaCy
        doc = nlp(full_text)
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                parsed_data["name"] = ent.text
                break
    # 2. Extract Email
    email_match = re.findall(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", full_text)
    parsed_data["email"] = email_match[0] if email_match else None
    # 3. Extract Phone
    for match in phonenumbers.PhoneNumberMatcher(full_text, "IN"):
        parsed_data["phone"] = phonenumbers.format_number(match.number, phonenumbers.PhoneNumberFormat.E164)
        break
    # 4. Extract Skills, Education, Experience, Certifications, Achievements
    parsed_data["skills"] = extract_skills_transformer(full_text, ner_results)
    parsed_data["education"] = extract_education_transformer(full_text, ner_results)
    parsed_data["experience"] = extract_experience_transformer(full_text, ner_results)
    parsed_data["certifications"] = extract_certifications_transformer(full_text, ner_results)
    parsed_data["achievements"] = extract_awards_and_achievements(full_text)

    return parsed_data
