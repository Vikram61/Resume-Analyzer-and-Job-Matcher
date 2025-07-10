import importlib.util
import subprocess
import sys
import spacy

model_name = "en_core_web_sm"
if importlib.util.find_spec(model_name) is None: # type: ignore
    subprocess.run(["python", "-m", "spacy", "download", model_name])
nlp=spacy.load("en_core_web_sm")


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

def extract_keywords(text):
    doc = nlp(text.lower())
    tokens=set()

    for token in doc:

        if not token.is_punct and not token.is_stop:
            tokens.add(token.text.lower())
    
    return [skill for skill in SKILLS if skill.lower() in tokens]


if __name__ == "__main__":
    job_description = sys.stdin.read()
    keywords = extract_keywords(job_description)
    print(",".join(keywords))