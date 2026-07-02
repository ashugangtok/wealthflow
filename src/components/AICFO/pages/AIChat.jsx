import React, { useState } from 'react';
import {
  Box,
  Card,
  TextField,
  IconButton,
  Typography,
  Chip,
  Avatar,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Hi! I\'m your AI CFO assistant. I can answer questions about your financial data. Try asking me things like: "Where did my money go?" or "Compare June with May"',
    },
  ]);
  const [input, setInput] = useState('');

  const suggestions = [
    'Where did my money go?',
    'Compare June with May',
    'How much did I spend on Amazon?',
    'Can I afford a new bike?',
    'How much did I spend on groceries?',
    'Which subscriptions should I cancel?',
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: input,
    };

    const aiResponse = {
      id: messages.length + 2,
      sender: 'ai',
      text: 'Based on your financial data... (AI analysis would go here)',
    };

    setMessages([...messages, userMessage, aiResponse]);
    setInput('');
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        AI Financial Assistant
      </Typography>

      {/* Chat Area */}
      <Card sx={{ mb: 3, height: 400, overflow: 'auto', p: 2, background: 'rgba(102, 126, 234, 0.02)' }}>
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              mb: 2,
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            {message.sender === 'ai' && (
              <Avatar sx={{ mr: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                🤖
              </Avatar>
            )}
            <Box
              sx={{
                maxWidth: '70%',
                p: 2,
                borderRadius: 2,
                background: message.sender === 'user' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f3f4f6',
                color: message.sender === 'user' ? 'white' : 'inherit',
              }}
            >
              <Typography variant="body2">{message.text}</Typography>
            </Box>
            {message.sender === 'user' && (
              <Avatar sx={{ ml: 1, background: '#06b6d4' }}>
                👤
              </Avatar>
            )}
          </Box>
        ))}
      </Card>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
            Try asking:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {suggestions.map((suggestion, index) => (
              <Chip
                key={index}
                label={suggestion}
                onClick={() => {
                  setInput(suggestion);
                }}
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Input Area */}
      <Card sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Ask about your finances..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSend();
              }
            }}
            variant="outlined"
            size="small"
          />
          <IconButton
            onClick={handleSend}
            disabled={!input.trim()}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              '&:hover': { opacity: 0.9 },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Card>

      {/* Info Card */}
      <Card sx={{ mt: 3, p: 3, background: 'rgba(139, 92, 246, 0.1)' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          ℹ️ About AI Chat
        </Typography>
        <Typography variant="caption" color="textSecondary">
          The AI assistant uses your uploaded financial statements to answer questions. It can analyze spending patterns,
          compare months, and provide personalized financial insights based on your real data.
        </Typography>
      </Card>
    </Box>
  );
};

export default AIChat;
