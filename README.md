How We Solved the Problem Statement/Objective

Our goal was to bridge the healthcare gap in rural India by leveraging AI-driven technologies. We built an AI-powered healthcare ecosystem that provides accessible, affordable, and effective medical assistance to rural populations. This solution integrates AI-driven telemedicine, symptom analysis, local health worker training, alternative treatment recommendations, and a smart medicine supply chain. Multilingual support and offline accessibility further ensure improved healthcare outcomes and reduced mortality rates in underserved areas.

Project Description

This project is a comprehensive educational platform designed to empower students, parents, and educators with advanced tools for learning and career preparation. The platform leverages state-of-the-art AI technologies to transform visual content into text, generate quizzes and interview questions, and produce concise educational summaries. In addition to these smart content generation features, the platform offers secure authentication, efficient data management, an interactive performance dashboard, and location-based services for discovering nearby schools and upcoming opportunities. Together, these capabilities create an ecosystem that enhances educational engagement and streamlines content management for a modern learning experience.

Project Features Overview

Cloud OCR & Summarization
Functionality:
Users select an image from their device which gets uploaded to Cloudinary; the service returns a link to that image, and an AI-powered OCR service extracts text. A Python-based agent then generates concise educational summaries using deepseek from the extracted text.

Flow:

Input:

User selects and uploads an image.

Processing:

The image is uploaded to Cloudinary, which returns a public URL.

The URL is sent to a Next.js API endpoint that calls an AIxplain OCR service.

The endpoint polls until the OCR process completes and retrieves the extracted text.

The extracted text is passed to a Python summarizer agent (using deepseek) to generate an educational summary.

Output:

A JSON response with the summarized text is returned to the user.

Interview Agent
Functionality:
This feature generates tailored interview questions based on provided job details and company information. It serves as a virtual interviewer to help students practice for interviews when they don't have a peer available. It asks for mic and camera permissions; during the interview, it allows the student only one minute per question, monitors facial expressions (e.g., pauses), and uses Gemini for speech-to-text conversion to capture the answer. Another OpenAI ChatGPT model then evaluates the answer and generates a performance report.

Flow:

Input:

User provides job details and company information via a form.

The system requests mic and camera permissions before starting the interview.

Processing:

The Next.js endpoint receives the input and ensures a Python interview agent is running.

The agent generates interview questions using the Gemini model.

During the interview, the student’s responses are time-limited (1 minute per question), and facial expressions are analyzed for pauses or hesitations.

The student’s spoken answers are converted to text using Gemini’s speech-to-text functionality.

An evaluation is performed using a ChatGPT model to grade the responses.

Output:

A detailed report grading the student’s performance is generated and returned to the user.

Quiz Generator
Functionality:
Users can create quizzes on any topic by providing a prompt, category, language, question count, and question type. The system leverages an AI agent (using the Gemini Flash model) to generate structured quiz questions in JSON format, ideal for multiple-choice or true/false assessments.

Flow:

Input:

User submits a JSON payload with quiz parameters (prompt, category, language, question count, and question type).

Processing:

The Next.js endpoint validates the input and spawns a Python process running the quiz generator agent.

The Python agent receives the input and uses the Gemini Flash model to generate quiz questions in a structured JSON format.

Output:

A JSON response containing the generated quiz questions is sent back to the user.

Educational Text Summarizer
Functionality:
Summarizes input text into clear, text-only educational summaries. The output is customizable by language and summary detail level (simple, detailed, or advanced) to suit various educational needs.

Flow:

Input:

User provides the text to be summarized along with preferences (language and summary level).

Processing:

The input is sent to a Next.js API endpoint that ensures a Python summarizer agent is running in server mode (using UTF-8 encoding).

The agent processes the text using a detailed prompt, generating a summary via an AI agent.

Output:

The summarized text is returned as a JSON response.

Authentication & ORM
Functionality:

Authentication: Implements Cleark for secure user authentication.

Database Management: Utilizes Drizzle as the ORM for efficient data handling and persistence.

Parent/Student Dashboard
Functionality:
Offers an interactive dashboard where parents and students can monitor performance metrics and track learning progress in real time.

Nearby Schools & Opportunities
Functionality:

Nearby Schools: Provides an interactive map for students to find nearby schools for online admissions.

Opportunities: Lists upcoming opportunities and events for teachers and students, keeping users informed about relevant career and educational events.

Team Members

Ashish K Choudhary

Kartikey Goel

Krishna

Kunal Maurya

Mohit Taneja

Vidhu Chaudhary
