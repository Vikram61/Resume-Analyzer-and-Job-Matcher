

import sys

roles_skills_map = {
    "Frontend Developer": ["html", "css", "javascript", "react", "redux", "tailwind css", "vue", "angular"],
    "Backend Developer": ["node.js", "express", "mongodb", "mysql", "django", "flask", "rest api"],
    "Full Stack Developer": ["html", "css", "javascript", "react", "node.js", "express", "mongodb"],
    "Data Scientist": ["python", "pandas", "numpy", "matplotlib", "scikit-learn", "tensorflow", "keras"],
    "ML Engineer": ["python", "tensorflow", "pytorch", "scikit-learn", "mlflow"],
    "DevOps Engineer": ["docker", "kubernetes", "jenkins", "aws", "terraform", "ansible"],
    "Cybersecurity Analyst": ["kali linux", "nmap", "wireshark", "metasploit", "burp suite"],
    "Mobile App Developer": ["android", "kotlin", "flutter", "react native", "swift"],
}

def suggest_roles(resume_skills):
    from role_suggester import roles_skills_map
    suggestions = []

    for role, required_skills in roles_skills_map.items():
        match_count = len([skill for skill in required_skills if skill in resume_skills])
        match_percentage = int((match_count / len(required_skills)) * 100)

        if match_percentage >= 40:  # You can tweak this threshold
            suggestions.append({
                "role": role,
                "match": match_percentage
            })

    suggestions.sort(key=lambda x: x["match"], reverse=True)
    return suggestions

if __name__ == "__main__":
    resume_skills = sys.argv[1].split(",")
    suggestions = suggest_roles(resume_skills)
    for s in suggestions:
        print(f'{s["role"]}:{s["match"]}')
