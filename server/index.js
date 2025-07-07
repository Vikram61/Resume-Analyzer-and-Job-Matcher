const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require("child_process");


const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

//Setting up multer to store uploads

const storage = multer.diskStorage({
    destination : (req,file,cb) =>{
        const dir = "uploads";
        if(!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null,dir);
    },
    filename : (req,file,cb) =>{
        cb(null,Date.now()+path.extname(file.originalname));
    },
});

const upload = multer({storage})

app.post("/api/upload", upload.single("resume"),(req,res) =>{
    if(!req.file) {
        return res.status(400).json({message : "No file uploaded"});
    }
    const filePath = path.join(__dirname,"uploads",req.file.filename);
    console.log("Uploaded",filePath);

    //Running the python script to get output

   exec( `python ../analyzer/resume_parser.py "${filePath}"`,(error,stdout,stderr) => {

    if(error){
        console.error(error.message);
        return res.status(500).json({message : "Error parsing resume"});
    }

    if(stderr) console.error(stderr);

    const skills = stdout.trim() ? stdout.trim().split(",") : [];
    res.json({message : "File parsed successfully",skills})

   });
});

const { spawn } = require("child_process");

app.post("/api/match", (req, res) => {
  const { resumeSkills, jobDescription } = req.body;

  if (!resumeSkills || !jobDescription) {
    return res.status(400).json({ message: "Missing data" });
  }

  const pythonProcess = spawn("python", ["../analyzer/description_parser.py"]);

  let output = "";
  let errorOutput = "";

  pythonProcess.stdout.on("data", (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0 || errorOutput) {
      console.error("Python error:", errorOutput);
      return res.status(500).json({ message: "Error parsing job description" });
    }

    const jobSkills = output.trim() ? output.trim().split(",") : [];
    const matchedSkills = jobSkills.filter(skill => resumeSkills.includes(skill));
    const missingSkills = jobSkills.filter(skill => !resumeSkills.includes(skill));
    const matchPercentage = jobSkills.length
      ? Math.round((matchedSkills.length / jobSkills.length) * 100)
      : 0;

    res.json({ matchPercentage, matchedSkills, missingSkills });
  });

  // 👇 Send job description to Python via stdin
  pythonProcess.stdin.write(jobDescription);
  pythonProcess.stdin.end();
});
app.post("/api/suggest", (req, res) => {
  const { resumeSkills } = req.body;

  if (!resumeSkills || resumeSkills.length === 0) {
    return res.status(400).json({ message: "No skills provided" });
  }

  exec(`python ../analyzer/role_suggester.py "${resumeSkills.join(',')}"`, (error, stdout, stderr) => {
    if (error) {
      console.error("Error suggesting roles:", error.message);
      return res.status(500).json({ message: "Failed to suggest roles" });
    }

    if (stderr) console.error(stderr);

    const roles = stdout.trim().split("\n").map(line => {
      const [role, match] = line.split(":");
      return { role, match: parseInt(match) };
    });

    res.json({ suggestedRoles: roles });
  });
});


app.listen(PORT,()=>{
    console.log(`Server listening to port ${PORT}`)
});