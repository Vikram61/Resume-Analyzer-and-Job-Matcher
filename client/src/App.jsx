import { useState, useEffect } from "react";
import axios from "axios";
import './App.css';


function App() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState("");
  const [skills, setSkills] = useState([]);
  const [jobDesc, setJobDesc] = useState("");
  const [matchData, setMatchdata] = useState(null);
  const [suggestedRoles, setSuggestedRoles] = useState([]);

  useEffect(() => {
    if (skills.length > 0) {
      axios
        .post("http://localhost:5000/api/suggest", { resumeSkills: skills })
        .then((res) => {
          setSuggestedRoles(res.data.suggestedRoles);
        })
        .catch((err) => console.error("Error fetching roles", err));
    }
  }, [skills]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResponse("");
    setSkills([]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a resume file first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await axios.post("http://localhost:5000/api/upload", formData);
      setResponse(res.data.message);
      setSkills(res.data.skills || []);
    } catch (error) {
      console.error("Upload failed:", error);
      setResponse("Error uploading file.");
      setSkills([]);
    }
  };

  const handleMatch = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/match", {
        resumeSkills: skills,
        jobDescription: jobDesc,
      });
      setMatchdata(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 py-10 px-4 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 space-y-10 border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 drop-shadow-md">
           Resume Analyzer & Job Matcher
        </h1>

        {/* Resume Upload */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-blue-600">Upload Resume</h2>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-100 file:text-blue-700"
          />

          <button
            onClick={handleUpload}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Upload & Extract Skills
          </button>

          {response && <p className="text-green-600 font-medium">{response}</p>}

          {skills.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-4 shadow-sm">
              <h3 className="text-xl font-semibold text-blue-700 mb-2"> Extracted Skills</h3>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 text-sm rounded-full border border-blue-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Job Description Matching */}
        <section className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-semibold text-green-600">🔍 Job Description Matching</h2>
          <textarea
            rows={6}
            placeholder="Paste job description here..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <button
            onClick={handleMatch}
            disabled={skills.length === 0}
            className={`w-full py-2 px-4 text-white font-semibold rounded-lg transition ${
              skills.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Match with Resume
          </button>

          {matchData && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 space-y-2 shadow-sm">
              <h3 className="text-lg font-bold text-green-700"> Match: {matchData.matchPercentage}%</h3>
              <p>
                <strong>Matched Skills:</strong>{" "}
                <span className="text-gray-700">{matchData.matchedSkills.join(", ") || "None"}</span>
              </p>
              <p>
                <strong>Missing Skills:</strong>{" "}
                <span className="text-gray-700">
                  {matchData.missingSkills.join(", ") || "None "}
                </span>
              </p>
            </div>
          )}
        </section>

        {/* Suggested Roles */}
        {suggestedRoles.length > 0 && (
          <section className="border-t pt-8 space-y-4">
            <h2 className="text-2xl font-semibold text-purple-600">💼 Suggested Job Roles</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {suggestedRoles.map((role, idx) => (
                <li key={idx} className="ml-2">
                  <span className="font-medium">{role.role}</span> —{" "}
                  <span className="text-sm text-gray-500">{role.match}% match</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
