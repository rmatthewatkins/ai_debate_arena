# 🎭 AI Debate Arena

A web application that pits Claude AI, ChatGPT, and Gemini against each other in structured debates. Each AI believes the others are human participants.

## Features

- **Three-Way Debates**: Judge, Plaintiff (For), and Defendant (Against) roles
- **Role Switching**: Toggle which AI plays which role
- **Authentic Interactions**: Each AI thinks it's debating with humans
- **Clean UI**: Simple, intuitive interface for managing debates

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Keys

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```
CLAUDE_API_KEY=your_actual_claude_key
OPENAI_API_KEY=your_actual_openai_key
GEMINI_API_KEY=your_actual_gemini_key
PORT=3000
```

### 3. Get API Keys

- **Claude API**: https://console.anthropic.com/
- **OpenAI API**: https://platform.openai.com/api-keys
- **Gemini API**: https://makersuite.google.com/app/apikey

### 4. Run the Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

### 5. Open the Frontend

Open `index.html` in your browser, or serve it using:

```bash
npx serve .
```

Then navigate to the provided URL.

## How to Use

1. **Enter a Debate Topic** (e.g., "Should AI be regulated by governments?")
2. **Set Turns per Debater** (1-10): Controls how many times each participant speaks before the judge makes a final decision
   - For example, 3 turns = 9 total turns (3 plaintiff + 3 defendant + 3 judge rounds)
3. **Assign Roles**: Choose which AI plays Judge, Plaintiff, or Defendant
4. **Start Debate**: Click "Start Debate"
5. **Progress Turns**: Click "Next Turn" to let each AI speak in sequence
6. **Final Judgment**: After all turns are complete, the judge delivers a final verdict declaring the winner

## Debate Flow

The debate follows this pattern (example with 3 turns per debater):
1. **Turn 1**: Plaintiff opens (FOR the topic)
2. **Turn 2**: Defendant responds (AGAINST the topic)
3. **Turn 3**: Judge comments/questions
4. **Turn 4**: Plaintiff continues argument
5. **Turn 5**: Defendant counters
6. **Turn 6**: Judge provides feedback
7. **Turn 7**: Plaintiff final argument
8. **Turn 8**: Defendant final argument
9. **Turn 9**: Judge's comments
10. **Final Turn**: Judge delivers verdict and declares winner 🏆

## Project Structure

```
ai-debate-arena/
├── server.js           # Express backend with API integrations
├── index.html          # Frontend UI
├── package.json        # Dependencies
├── .env.example        # Environment variables template
└── README.md          # This file
```

## Notes

- Each AI maintains its own conversation history
- The system prompts make each AI believe others are human
- The judge, plaintiff, and defendant each have role-specific instructions
- Make sure to use different AIs for each role (the app prevents duplicates)

## Troubleshooting

**CORS Issues**: If you encounter CORS errors, make sure the backend is running and the `API_URL` in the frontend matches your server address.

**API Errors**: Check that all API keys are valid and have sufficient credits/quota.

**Model Availability**: The app uses `gpt-4` for ChatGPT and `gemini-pro` for Gemini. Adjust model names in `server.js` if needed.
