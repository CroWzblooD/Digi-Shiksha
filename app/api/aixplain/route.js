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
    console.log('Starting Python agent process...');
    
    // Get the absolute path to the Python script
    const scriptPath = path.join(process.cwd(), 'aixplain_examples', 'basic_agent.py');
    console.log(`Script path: ${scriptPath}`);
    
    // Check if the script exists
    try {
      await fs.access(scriptPath);
      console.log(`Script exists at ${scriptPath}`);
    } catch (err) {
      console.error(`Script does not exist at ${scriptPath}`);
      throw new Error(`Python script not found at ${scriptPath}`);
    }
    
    // Start the Python process with server mode flag
    console.log('Spawning Python process with --server-mode flag');
    const env = {
      ...process.env,
      TEAM_API_KEY: process.env.TEAM_API_KEY || "2eb83ad6363d95600bc76329a38d5d63bc62d9130f2a9d66833746497793ca91",
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
      const output = data.toString().trim();
      console.log(`Python agent stdout: ${output}`);
    });
    
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python agent stderr: ${data.toString().trim()}`);
    });
    
    // Wait for the process to be ready before continuing
    await new Promise((resolve, reject) => {
      const readyCheck = (data) => {
        const output = data.toString();
        console.log(`Checking for ready message: ${output.substring(0, 50)}...`);
        
        if (output.includes('AIXplain agent server is running')) {
          pythonProcess.stdout.removeListener('data', readyCheck);
          resolve();
        } else if (output.includes('Starting in interactive mode')) {
          // The script is not running in server mode
          console.error('Python script started in interactive mode instead of server mode');
          pythonProcess.kill();
          reject(new Error('Python script not in server mode'));
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
    
    console.log('Python agent process started and ready');
    pythonProcess.on('close', (code) => {
      console.log(`Python agent process exited with code ${code}`);
      pythonProcess = null;
    });
    
    pythonProcess.on('error', (err) => {
      console.error(`Failed to start Python agent: ${err}`);
      pythonProcess = null;
    });
    
    // Wait a bit to ensure the process is ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Python agent process started and ready');
  } catch (error) {
    console.error('Error starting Python agent:', error);
    pythonProcess = null;
  } finally {
    isProcessStarting = false;
  }
}

// Start the Python process when the server starts
ensurePythonProcessRunning().catch(err => {
  console.error('Failed to start Python agent on server startup:', err);
});

export async function POST(req) {
  try {
    const { prompt, feature, language } = await req.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }
    
    console.log(`Received request - Feature: ${feature}, Language: ${language}`);
    console.log(`Prompt: ${prompt.substring(0, 100)}...`);
    
    // Prepare the prompt based on the feature and language
    let enhancedPrompt = prompt;
    
    if (feature === 'translation') {
      enhancedPrompt = `Translate the following text to ${language}: ${prompt}`;
    } else if (feature === 'voice') {
      enhancedPrompt = `Create a voice script about: ${prompt}. Make it suitable for audio narration.`;
    } else if (feature === 'quiz') {
      enhancedPrompt = `Create a 5-question quiz about: ${prompt}. Include multiple choice answers and indicate the correct answer.`;
    } else if (prompt.toLowerCase().includes('image') || prompt.toLowerCase().includes('picture') || prompt.toLowerCase().includes('generate a image') || prompt.toLowerCase().includes('create a image')) {
      enhancedPrompt = `Generate an image about: ${prompt}. Return the image URL in the format: [IMAGE_URL:url_here]`;
    }
    
    // Add language instruction if not English and not translation feature
    if (language !== 'English' && feature !== 'translation') {
      enhancedPrompt = `Please respond in ${language} language: ${enhancedPrompt}`;
    }
    
    // Ensure Python process is running
    await ensurePythonProcessRunning();
    
    if (!pythonProcess || pythonProcess.killed) {
      return NextResponse.json(
        { error: 'Failed to start Python agent' },
        { status: 500 }
      );
    }
    
    // Generate a unique request ID
    const requestId = Date.now().toString();
    
    // Send the request to the Python process
    const request = {
      prompt: enhancedPrompt,
      requestId: requestId,
      language: language
    };
    
    // Ensure UTF-8 encoding when writing to stdin
    pythonProcess.stdin.write(JSON.stringify(request) + '\n', 'utf8');
    
    // Wait for the response
    const response = await new Promise((resolve, reject) => {
      let responseData = '';
      let responseTimeout = setTimeout(() => {
        reject(new Error('Response timeout'));
      }, 120000); // Increase timeout to 120 seconds for image generation
      
      const responseHandler = (data) => {
        const chunk = data.toString();
        responseData += chunk;
        
        // Check if the response is complete
        if (responseData.includes('RESPONSE_COMPLETE')) {
          // Clean up the response
          const cleanedResponse = responseData.replace('RESPONSE_COMPLETE', '').trim();
          
          clearTimeout(responseTimeout);
          pythonProcess.stdout.removeListener('data', responseHandler);
          resolve(cleanedResponse);
        }
      };
      
      pythonProcess.stdout.on('data', responseHandler);
    });
    
    // Process the response to fix formatting issues
    const formattedResponse = processResponse(response);
    
    return NextResponse.json({ response: formattedResponse });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}

// Function to process and clean up the response
function processResponse(response) {
  // Remove any processing messages
  let processed = response.replace(/Processing request.*?\.\.\./g, '');
  
  // Check for image URLs in the response
  const imageUrlRegex = /\[IMAGE_URL:\s*<a\s+href="([^"]+)"[^>]*>([^<]+)<\/a>\]/g;
  let match = imageUrlRegex.exec(processed);
  
  if (match) {
    // Extract the image URL
    const imageUrl = match[1];
    const imageAlt = match[2] || "Generated image";
    
    // Return a structured response with the image URL
    return {
      text: processed.replace(match[0], '').trim(),
      images: [{
        url: imageUrl,
        alt: imageAlt
      }],
      containsImages: true
    };
  }
  
  // If no image URL found, continue with regular text processing
  // Convert markdown-style bold to HTML bold for proper rendering
  processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert bullet points with � or * to proper bullet points
  processed = processed.replace(/[�*]\s+/g, '• ');
  
  // Ensure proper paragraph spacing
  processed = processed.replace(/\n{3,}/g, '\n\n');
  
  return processed;
}