"use client";

import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState([
    { role: 'system', content: 'I am Sam, a helpful AI assistant. How can I assist you today?' },
  ]);
  const [userInput, setUserInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (userInput.trim() === '') return;

    try {
      // Initialize the model
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string);
      const model = await genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Generate response content
      const result = await model.generateContent(userInput);
      const assistantResponse = result.response.text();  // Extract the response text

      // Update the chat history with the user's input and AI's response
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: 'user', content: userInput },  // Add user message to history
        { role: 'assistant', content: assistantResponse },  // Add AI response to history
      ]);

      setUserInput('');  // Clear the input field
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  return (
    <div className="chatbot">
      <ul className="mb-4">
        {chatHistory.map((message, index) => (
          <li key={index} className={`message ${message.role}`}>
            <div className={`p-2 rounded-lg mb-2 ${message.role === 'user' ? 'bg-blue-200 self-end' : 'bg-gray-200 self-start'}`}>
              <p>{message.content}</p>
            </div>
          </li>
        ))}
        <div ref={chatEndRef} />
      </ul>
      <div className="input-container flex flex-col sm:flex-row sm:space-x-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Enter your message"
          className="border border-gray-300 p-2 rounded-md flex-grow mb-2 sm:mb-0"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
