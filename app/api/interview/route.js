import { NextResponse } from 'next/server';
import path from 'path';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';

// Store a reference to the long-running Python process
let pythonProcess = null;
let isProcessStarting = false;

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
    console.log('Starting Python interview agent process...');
    
    // Get the absolute path to the Python script
    const scriptPath = path.join(process.cwd(), 'backend', 'interview_agent.py');
    console.log(`Script path: ${scriptPath}`);
    
    // Check if the script exists
    try {
      await fs.access(scriptPath);
    } catch (error) {
      console.error(`Error: Python script not found at ${scriptPath}`);
      isProcessStarting = false;
      throw new Error(`Python script not found at ${scriptPath}`);
    }
    
    // Start the Python process
    pythonProcess = spawn('python', [scriptPath, '--interactive']);
    
    // Handle process output
    pythonProcess.stdout.on('data', (data) => {
      console.log(`Python stdout: ${data}`);
    });
    
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python stderr: ${data}`);
    });
    
    // Handle process exit
    pythonProcess.on('close', (code) => {
      console.log(`Python process exited with code ${code}`);
      pythonProcess = null;
    });
    
    // Wait for the process to start
    await new Promise(resolve => setTimeout(resolve, 2000));
    
  } catch (error) {
    console.error('Error starting Python process:', error);
    isProcessStarting = false;
    throw error;
  }
  
  isProcessStarting = false;
}

async function sendRequestToPython(data) {
    return new Promise((resolve, reject) => {
      try {
        const scriptPath = path.join(process.cwd(), 'aixplain_examples', 'interview_agent.py');
        const process = spawn('python', [scriptPath]);
        
        let responseData = '';
        let errorData = '';
        
        process.stdout.on('data', (data) => {
          responseData += data.toString();
        });
        
        process.stderr.on('data', (data) => {
          errorData += data.toString();
          console.error(`Python stderr: ${data}`);
        });
        
        process.on('close', (code) => {
          if (code === 0) {
            try {
              const jsonResponse = JSON.parse(responseData);
              if (jsonResponse.questions) {
                resolve(jsonResponse);
              } else if (jsonResponse.error) {
                reject(new Error(jsonResponse.error));
              } else {
                reject(new Error('Unexpected response format from Python script'));
              }
            } catch (error) {
              reject(new Error(`Failed to parse JSON response: ${responseData}`));
            }
          } else {
            reject(new Error(`Python process exited with code ${code}: ${errorData}`));
          }
        });
        
        process.stdin.write(JSON.stringify(data));
        process.stdin.end();
      } catch (error) {
        reject(error);
      }
    });
  }
  
  export async function POST(request) {
    try {
      const body = await request.json();
      const { jobDetails, companyInfo, questionType = 'general' } = body;
      
      if (!jobDetails || !companyInfo) {
        return NextResponse.json({ success: false, error: 'Job details and company information are required' }, { status: 400 });
      }
      
      const data = {
        job_details: jobDetails,
        company_info: companyInfo,
        question_type: questionType
      };
      
      const response = await sendRequestToPython(data);
      
      return NextResponse.json({ 
        success: true, 
        questions: response.questions,
        timestamp: response.timestamp || new Date().toISOString()
      });
    } catch (error) {
      console.error('Interview API error:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message || 'An error occurred while generating interview questions' 
      }, { status: 500 });
    }
  }