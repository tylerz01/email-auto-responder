For this project, I built an AI-powered Email Reply Generator with a React frontend and a Java Spring Boot backend.

The application takes two inputs from the user: the original email content and a selected tone for the reply—like Formal, Casual, or Friendly.

On the backend, I created a Spring Boot controller to receive these inputs via a REST API. A dedicated service class then builds a prompt and sends a request to the Gemini AI model using Spring’s WebClient. The AI processes the input and returns a smart, tone-matched email reply.

On the frontend, I used React along with Material UI for a clean and responsive interface. I used Axios to handle the API requests, sending the email content and tone to the backend and displaying the generated reply.

This project helped me strengthen my skills in full-stack development, especially in API integration, React UI design, and connecting AI services with real-world applications.