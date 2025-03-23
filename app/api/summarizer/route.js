import { NextResponse } from 'next/server';
import path from 'path';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';

// Store a reference to the long-running Python process
let pythonProcess = null;
let isProcessStarting = false;
let responseBuffer = '';
let currentResolve = null;

// Function to ensure the Python process is running
async function ensurePythonProcessRunning() {
  if (pythonProcess && !pythonProcess.killed) {
    return; // Process already running
  }
  
  if (isProcessStarting) {
    // Wait for the process to start
    let attempts = 0;
    while (isProcessStarting && attempts < 10) {
      await new Promise(resolve => setTimeout(resolve, 500));
      attempts++;
    }
    if (pythonProcess && !pythonProcess.killed) {
      return; // Process started successfully
    }
  }
  
  isProcessStarting = true;
  
  try {
    console.log('Starting Python summarizer agent process...');
    
    // Get the absolute path to the Python script
    const scriptPath = path.join(process.cwd(), 'aixplain_examples', 'summarizer_agent.py');
    console.log(`Script path: ${scriptPath}`);
    
    // Check if the script exists
    try {
      await fs.access(scriptPath);
      console.log(`Script exists at ${scriptPath}`);
    } catch (err) {
      console.error(`Script does not exist at ${scriptPath}`);
      throw new Error(`Python script not found at ${scriptPath}`);
    }
    
    // Start the Python process with server mode flag and hardcoded API keys
    console.log('Spawning Python process with --server-mode flag');
    const env = {
      ...process.env,
      // Directly embed API keys
      TEAM_API_KEY: process.env.TEAM_API_KEY || "7fc748c9f7eb0f1a2ad2e356ab54c5176c0d2965ea1f6bd49599c10444f90785",
      GEMINI2_FLASH_ID: process.env.GEMINI2_FLASH_ID || "6759db476eb56303857a07c1",
      STABLE_DIFFUSION_ID: process.env.STABLE_DIFFUSION_ID || "64aee5824d34b1221e70ac07",
      PYTHONIOENCODING: "utf-8"  // Force Python to use UTF-8 for stdin/stdout
    };
    
    pythonProcess = spawn('python', [scriptPath, '--server-mode'], { 
      env,
      stdio: ['pipe', 'pipe', 'pipe'],
      encoding: 'utf8'  // Ensure Node.js uses UTF-8 encoding
    });
    
    // Set up better logging for process communication
    pythonProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`Python summarizer stdout: ${output.trim()}`);
      
      // Check if this is a complete response
      if (output.includes('RESPONSE_COMPLETE')) {
        responseBuffer += output;
        
        // Extract only the JSON part from the response
        let jsonPart = '';
        try {
          // Look for a JSON object in the response buffer
          const jsonMatch = responseBuffer.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            jsonPart = jsonMatch[0];
            console.log("Extracted JSON:", jsonPart.substring(0, 100) + "...");
          } else {
            throw new Error("No JSON object found in response");
          }
        } catch (extractError) {
          console.error("Error extracting JSON:", extractError);
          jsonPart = '{"error": "Failed to extract JSON from response"}';
        }
        
        responseBuffer = '';
        
        if (currentResolve) {
          try {
            const parsedResponse = JSON.parse(jsonPart);
            currentResolve(parsedResponse);
          } catch (error) {
            console.error('Error parsing JSON response:', error);
            currentResolve({ error: 'Failed to parse response from summarizer' });
          }
          currentResolve = null;
        }
      } else {
        responseBuffer += output;
      }
    });
    
    // Handle errors
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python summarizer stderr: ${data.toString().trim()}`);
    });
    
    // Handle process exit
    pythonProcess.on('close', (code) => {
      console.log(`Python summarizer process exited with code ${code}`);
      pythonProcess = null;
    });
    
    // Wait for the process to be ready before continuing
    await new Promise((resolve, reject) => {
      const readyCheck = (data) => {
        const output = data.toString();
        console.log(`Checking for ready message: ${output.substring(0, 50)}...`);
        
        if (output.includes('AIXplain summarizer agent is running')) {
          pythonProcess.stdout.removeListener('data', readyCheck);
          resolve();
        }
      };
      
      const errorCheck = (data) => {
        const error = data.toString();
        console.error(`Python startup error: ${error}`);
        if (error.includes('error') || error.includes('Error')) {
          pythonProcess.stderr.removeListener('data', errorCheck);
          reject(new Error(`Python startup error: ${error}`));
        }
      };
      
      pythonProcess.stdout.on('data', readyCheck);
      pythonProcess.stderr.on('data', errorCheck);
      
      // Set a timeout in case the ready message never comes
      setTimeout(() => {
        // Check if pythonProcess is still valid before removing listeners
        if (pythonProcess) {
          pythonProcess.stdout.removeListener('data', readyCheck);
          pythonProcess.stderr.removeListener('data', errorCheck);
        }
        console.log('Timeout waiting for Python process ready message, continuing anyway');
        resolve();
      }, 10000);
    });
    
    // Wait a bit to ensure the process is ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Python summarizer process started and ready');
  } catch (error) {
    console.error('Error starting Python summarizer:', error);
    pythonProcess = null;
  } finally {
    isProcessStarting = false;
  }
}

// Function to send a request to the Python process and get a response
async function sendRequest(request) {
  await ensurePythonProcessRunning();
  
  return new Promise((resolve) => {
    // Store the resolve function to be called when we get a response
    currentResolve = resolve;
    
    // Send the request to the Python process
    const requestStr = JSON.stringify(request);
    console.log(`Sending request to summarizer: ${requestStr.substring(0, 100)}${requestStr.length > 100 ? '...' : ''}`);
    pythonProcess.stdin.write(requestStr + '\n');
  });
}

// API route handler
export async function POST(req) {
  try {
    // Parse the request body
    const body = await req.json();
    const { type } = body;

    if (type === 'generate_quiz') {
      const { prompt, category, language = 'English', questionCount = 5, questionType = 'multiple-choice' } = body;
      
      // Validate the quiz generation request
      if (!prompt) {
        return NextResponse.json({ 
          error: 'Missing required field: prompt',
          response: 'Please provide content to generate quiz questions.'
        }, { status: 400 });
      }
      
      console.log(`Quiz generation request received: language=${language}, category=${category}, questionCount=${questionCount}`);
      
      // Send the request to the Python process
      const result = await sendRequest({
        type: 'generate_quiz',
        prompt,
        category,
        language,
        questionCount,
        questionType,
        requestId: Math.random().toString(36).substring(2, 15)
      });
      
      // Check for errors
      if (result.error) {
        console.error(`Error from quiz generator: ${result.error}`);
        return NextResponse.json({ 
          error: result.error,
          response: result.response || 'An error occurred while generating the quiz.'
        }, { status: 500 });
      }
      
      // Return the successful response
      return NextResponse.json(result);
      
    } else {
      // Handle existing summarization logic
      const { prompt, language = 'English', summaryLevel = 'simple' } = body;
      
      // Validate the summarization request
      if (!prompt) {
        return NextResponse.json({ 
          error: 'Missing required field: prompt',
          response: 'Please provide content to summarize.'
        }, { status: 400 });
      }
      
      console.log(`Summarizer request received: language=${language}, summaryLevel=${summaryLevel}`);
      console.log(`Content length: ${prompt.length} characters`);
      
      // Send the request to the Python process
      const result = await sendRequest({
        prompt,
        language,
        summaryLevel,
        requestId: Math.random().toString(36).substring(2, 15)
      });
      
      // Check for errors
      if (result.error) {
        console.error(`Error from summarizer: ${result.error}`);
        return NextResponse.json({ 
          error: result.error,
          response: result.response || 'An error occurred while generating the summary.'
        }, { status: 500 });
      }
      
      // Return the successful response
      return NextResponse.json(result);
    }
    
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ 
      error: error.message,
      response: 'An unexpected error occurred while processing your request.'
    }, { status: 500 });
  }
}

// Handle process cleanup on server shutdown
if (typeof process !== 'undefined') {
  process.on('SIGINT', () => {
    console.log('Shutting down summarizer process...');
    if (pythonProcess) {
      pythonProcess.kill();
    }
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('Shutting down summarizer process...');
    if (pythonProcess) {
      pythonProcess.kill();
    }
    process.exit(0);
  });
}

