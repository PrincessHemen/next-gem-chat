"use client" 

import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Link from 'next/link'; // Import Link for navigation

const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState([
    { role: 'system', content: 'I am Sọrọ, a helpful AI assistant. How can I assist you today?' },
  ]);
  const [userInput, setUserInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const sendMessage = async () => {
    if (userInput.trim() === '') return;

    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string);
      const model = await genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(userInput);
      const assistantResponse = result.response.text();

      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: 'user', content: userInput },
        { role: 'assistant', content: assistantResponse },
      ]);

      setUserInput('');
      resetHeight(); // Reset height after sending the message
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent new line on Enter
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
    adjustHeight();
  };

  const adjustHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'; // Reset height
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`; // Set to scroll height
    }
  };

  const resetHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'; // Reset to default height
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
            <div className={`p-2 rounded-lg mb-2 ${message.role === 'user' ? 'bg-blue-200 text-gray-800 dark:bg-blue-600 dark:text-gray-200 self-end' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 self-start'}`}>
              <p>{message.content}</p>
            </div>
          </li>
        ))}
        <div ref={chatEndRef} />
      </ul>

      {/* Input and Send Button */}
      <div className="input-container flex flex-col sm:flex-row sm:space-x-2">
        <textarea
          ref={inputRef}
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Enter your message"
          className="border border-gray-300 dark:border-gray-600 p-2 rounded-md flex-grow mb-2 sm:mb-0 text-gray-800 dark:text-gray-300 bg-white dark:bg-gray-800 resize-none"
          rows={1}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Send
        </button>
      </div>

      {/* Back to Home Button */}
      <div className="mt-4">
        <Link href="/">
          <button className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition-colors">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Chatbot;
