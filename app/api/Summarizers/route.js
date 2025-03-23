// app/api/Summarizers/route.js

import { NextResponse } from "next/server";
import path from "path";
import { spawn } from "child_process";

// Python process state
let pythonProcess = null;
let isProcessStarting = false;
let responseBuffer = "";
let currentResolve = null;

// Language mapping
const languageMapping = {
  English: "en",
  Hindi: "hi",
  Bengali: "bn",
  Tamil: "ta",
  Telugu: "te",
  Marathi: "mr",
  Gujarati: "gu"
};

async function ensurePythonProcessRunning() {
  if (pythonProcess && !pythonProcess.killed) return;
  if (isProcessStarting) {
    let attempts = 0;
    while (isProcessStarting && attempts < 10) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      attempts++;
    }
    if (pythonProcess && !pythonProcess.killed) return;
  }

  isProcessStarting = true;
  try {
    const scriptPath = path.join(process.cwd(), "aixplain_examples", "language_summarizer.py");
    pythonProcess = spawn("python", [scriptPath], {
      env: { ...process.env, PYTHONIOENCODING: "utf-8" },
      stdio: ["pipe", "pipe", "pipe"]
    });

    pythonProcess.stdout.on("data", (data) => {
      const output = data.toString();
      console.log(`Python stdout: ${output}`);  // Log all stdout
      if (output.includes("RESPONSE_COMPLETE")) {
        responseBuffer += output;
        const jsonMatch = responseBuffer.match(/\{[\s\S]*\}/);
        const jsonPart = jsonMatch ? jsonMatch[0] : '{"error": "No JSON found"}';
        responseBuffer = "";
        if (currentResolve) {
          try {
            currentResolve(JSON.parse(jsonPart));
          } catch (error) {
            currentResolve({ error: "Failed to parse response" });
          }
          currentResolve = null;
        }
      } else {
        responseBuffer += output;
      }
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python stderr: ${data.toString()}`);  // Log all stderr
    });

    pythonProcess.on("close", (code) => {
      console.log(`Python process exited with code ${code}`);
      pythonProcess = null;
    });

    await new Promise((resolve) => {
      pythonProcess.stdout.on("data", (data) => {
        if (data.toString().includes("Language summarizer agent is running")) {
          resolve();
        }
      });
      setTimeout(resolve, 5000); // Fallback timeout
    });
  } catch (error) {
    console.error("Error starting Python process:", error);
    pythonProcess = null;
  } finally {
    isProcessStarting = false;
  }
}

async function sendRequest(request) {
  await ensurePythonProcessRunning();
  return new Promise((resolve) => {
    currentResolve = resolve;
    pythonProcess.stdin.write(JSON.stringify(request) + "\n");
  });
}

export async function POST(request) {
  try {
    const { prompt, language, summaryLevel } = await request.json();
    if (!prompt || !language || !summaryLevel) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const langCode = languageMapping[language] || "en";
    const result = await sendRequest({ prompt, language: langCode, summaryLevel });

    if (result.error) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, summary: result.summary });
  } catch (error) {
    console.error("Summarization error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

process.on("SIGINT", () => {
  if (pythonProcess) pythonProcess.kill();
  process.exit(0);
});
process.on("SIGTERM", () => {
  if (pythonProcess) pythonProcess.kill();
  process.exit(0);
});