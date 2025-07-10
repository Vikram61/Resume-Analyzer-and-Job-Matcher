import sys
import os
import docx
from pdfminer.high_level import extract_text
import spacy
import subprocess
import importlib.util
model_name = "en_core_web_sm"
if importlib.util.find_spec(model_name) is None: # type: ignore
    subprocess.run(["python", "-m", "spacy", "download", model_name])

nlp = spacy.load("en_core_web_sm")

SKILLS = [
    # Programming Languages
    "python", "java", "c", "c++", "javascript", "typescript", "kotlin", "swift",
    "go", "ruby", "rust", "php", "r", "matlab", "scala", "perl", "bash", "haskell",

    # Web Development
    "html", "css", "sass", "less", "bootstrap", "tailwind css",

    # Frontend Libraries & Frameworks
    "react", "angular", "vue", "svelte", "next.js", "nuxt.js", "redux",

    # Backend Frameworks
    "node.js", "express", "django", "flask", "spring boot", "laravel", "ruby on rails", "fastapi",

    # Databases
    "mysql", "postgresql", "sqlite", "mongodb", "redis", "cassandra", "elasticsearch",

    # DevOps & Cloud
    "docker", "kubernetes", "aws", "azure", "gcp", "jenkins", "gitlab ci", "github actions", "terraform", "ansible", "nginx","html5","css3"

    # Version Control
    "git", "svn",

    # Data Science & Machine Learning
    "pandas", "numpy", "matplotlib", "seaborn", "scikit-learn", "tensorflow", "keras", "pytorch", "xgboost", "lightgbm", "openai", "huggingface", "mlflow",

    # Natural Language Processing
    "nltk", "spacy", "transformers", "bert", "gpt",

    # Testing
    "jest", "mocha", "chai", "pytest", "junit", "cypress", "selenium", "postman",

    # Operating Systems & Tools
    "linux", "windows", "macos", "bash", "powershell", "vim", "visual studio code", "intellij",

    # Softwares / Tools
    "jira", "figma", "postman", "notion", "slack", "trello", "microsoft office", "excel",

    # CS Fundamentals
    "data structures", "algorithms", "object oriented programming", "computer networks",
    "operating systems", "databases", "system design", "software engineering",

    # Cybersecurity
    "kali linux", "metasploit", "wireshark", "nmap", "burp suite", "ethical hacking",

    # Mobile Development
    "react native", "flutter", "android", "ios", "swiftui", "jetpack compose"
]


def extract_text_from_file(filepath):
    ext = os.path.splitext(filepath)[1].lower()

    if ext == ".pdf":
        try:
            return extract_text(filepath)
        except Exception as e:
            
            return ""
    elif ext in [".docx", ".doc"]:
        try:
            doc = docx.Document(filepath)
            return "\n".join([para.text for para in doc.paragraphs])
        except Exception as e:
            print("[ERROR] DOCX parsing failed:", e)
            return ""
    else:
        
        return ""

def extract_keywords(text):

    if not text.strip():
        
        return []

    doc = nlp(text.lower())
    tokens = set()

    for token in doc:
        if not token.is_stop and not token.is_punct:
            tokens.add(token.lemma_.lower())

    

    found = []
    for skill in SKILLS:
        if skill.lower() in tokens:
            found.append(skill)

    
    return found

if __name__ == "__main__":
    try:
        filepath = sys.argv[1]
      
        text = extract_text_from_file(filepath)
        
        keywords = extract_keywords(text)
        print(",".join(keywords))
    except Exception as e:
        print(f"[FATAL ERROR] {str(e)}")
