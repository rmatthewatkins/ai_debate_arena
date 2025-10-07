const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// API configurations
const APIs = {
  claude: {
    endpoint: 'https://api.anthropic.com/v1/messages',
    headers: {
      'x-api-key': process.env.CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    }
  },
  chatgpt: {
    endpoint: 'https://api.openai.com/v1/chat/completions',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    }
  },
  gemini: {
    endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
    headers: {
      'Content-Type': 'application/json'
    }
  }
};

// System prompts for each role
const rolePrompts = {
  judge: "You are a fair and impartial judge in a debate. You are speaking with two human debaters - a plaintiff and a defendant. Listen to both sides, ask clarifying questions, and ultimately make a reasoned judgment. Be professional and objective.",
  judgeFinal: "You are a fair and impartial judge in a debate. You have heard arguments from both the plaintiff and defendant (both humans). Now you must provide your FINAL JUDGMENT. Declare a clear winner (either Plaintiff or Defendant) and explain your reasoning based on the strength of arguments, evidence, and persuasiveness.",
  plaintiff: "You are a human debater arguing FOR the given topic. You are in a debate with another human (the defendant) and a human judge is moderating. Present strong arguments, respond to counterpoints, and be persuasive. Stay in character as a human debater.",
  defendant: "You are a human debater arguing AGAINST the given topic. You are in a debate with another human (the plaintiff) and a human judge is moderating. Present strong counterarguments, challenge the plaintiff's points, and be persuasive. Stay in character as a human debater."
};

async function callClaude(messages, role, topic, isFinalJudgment = false) {
  const promptKey = (isFinalJudgment && role === 'judge') ? 'judgeFinal' : role;
  const systemPrompt = `${rolePrompts[promptKey]}\n\nDebate topic: "${topic}"`;
  
  const response = await axios.post(APIs.claude.endpoint, {
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }))
  }, { headers: APIs.claude.headers });
  
  return response.data.content[0].text;
}

async function callChatGPT(messages, role, topic, isFinalJudgment = false) {
  const promptKey = (isFinalJudgment && role === 'judge') ? 'judgeFinal' : role;
  const systemPrompt = `${rolePrompts[promptKey]}\n\nDebate topic: "${topic}"`;
  
  const response = await axios.post(APIs.chatgpt.endpoint, {
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ],
    max_tokens: 1024
  }, { headers: APIs.chatgpt.headers });
  
  return response.data.choices[0].message.content;
}

async function callGemini(messages, role, topic, isFinalJudgment = false) {
  const promptKey = (isFinalJudgment && role === 'judge') ? 'judgeFinal' : role;
  const systemPrompt = `${rolePrompts[promptKey]}\n\nDebate topic: "${topic}"`;
  
  const conversationHistory = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));
  
  const response = await axios.post(APIs.gemini.endpoint, {
    contents: [
      { role: 'user', parts: [{ text: systemPrompt }] },
      ...conversationHistory
    ],
    generationConfig: {
      maxOutputTokens: 1024
    }
  }, { headers: APIs.gemini.headers });
  
  return response.data.candidates[0].content.parts[0].text;
}

app.post('/api/debate', async (req, res) => {
  try {
    const { ai, role, messages, topic, isFinalJudgment = false } = req.body;
    
    let response;
    switch(ai) {
      case 'claude':
        response = await callClaude(messages, role, topic, isFinalJudgment);
        break;
      case 'chatgpt':
        response = await callChatGPT(messages, role, topic, isFinalJudgment);
        break;
      case 'gemini':
        response = await callGemini(messages, role, topic, isFinalJudgment);
        break;
      default:
        return res.status(400).json({ error: 'Invalid AI selection' });
    }
    
    res.json({ response });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'API call failed', 
      details: error.response?.data || error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
