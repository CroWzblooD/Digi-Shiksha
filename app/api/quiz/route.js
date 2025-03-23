import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function POST(request) {
  try {
    const body = await request.json();

    if (body.action !== 'generate-quiz') {
      return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }

    const { prompt, category, language, questionCount, questionType } = body;

    if (!prompt) {
      return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 });
    }

    const inputData = JSON.stringify({
      prompt,
      category: category || 'General Knowledge',
      language: language || 'English',
      questionCount: questionCount || 5,
      questionType: questionType || 'multiple-choice',
    });

    const scriptPath = path.join(process.cwd(), 'backend', 'quiz_generator_agent.py');

    if (!fs.existsSync(scriptPath)) {
      console.error(`Script not found at path: ${scriptPath}`);
      return NextResponse.json(
        { success: false, error: 'Quiz generator script not found' },
        { status: 500 }
      );
    }

    // Spawn the Python process with the correct working directory
    const pythonProcess = spawn('python', [scriptPath], {
      cwd: path.dirname(scriptPath), // Set to the directory containing quiz_generator_agent.py
    });

    let outputData = '';
    let errorData = '';

    pythonProcess.stdin.write(inputData + '\n');
    pythonProcess.stdin.end();

    pythonProcess.stdout.on('data', (data) => {
      outputData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
      console.error('Python stderr:', data.toString());
    });

    const result = await new Promise((resolve, reject) => {
      pythonProcess.on('close', (code) => {
        console.log('Raw Python output:', outputData);

        if (code !== 0) {
          reject(new Error(`Python process exited with code ${code}: ${errorData}`));
        } else {
          try {
            const jsonData = JSON.parse(outputData.trim());
            resolve(jsonData);
          } catch (error) {
            const jsonMatch = outputData.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              try {
                const jsonData = JSON.parse(jsonMatch[0]);
                resolve(jsonData);
              } catch (innerError) {
                reject(new Error(`Failed to parse extracted JSON: ${innerError.message}`));
              }
            } else {
              reject(new Error('Failed to find valid JSON in Python output'));
            }
          }
        }
      });
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}