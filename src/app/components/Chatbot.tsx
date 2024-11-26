// components/Chatbot.tsx

"use client";

import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai'; 
import { LeakyBucket } from '../lib/leakyBucket'; // LeakyBucket class
import { useAppSelector } from '../redux/store'; // Custom hook to access Redux state

// Initialize the Leaky Bucket instance with 10 requests per minute
const rateLimitPerMinute = 10;
const refillRate = 1;
const leakyBucket = new LeakyBucket(rateLimitPerMinute, refillRate);

const Chatbot = () => {
    const [chatHistory, setChatHistory] = useState([
        { role: 'system', content: 'I am Sọrọ, a helpful AI assistant. How can I assist you today?' },
    ]);
    const [userInput, setUserInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Get the current user's ID from the Redux store
    const user = useAppSelector(state => state.auth.user);
    const userId = user ? user.uid : null; // Get user ID if user is logged in

    const sendMessage = async () => {
        if (userInput.trim() === '' || !userId) return;

        // Check if a token can be consumed before proceeding
        if (!leakyBucket.consumeToken()) {
            alert("Rate limit exceeded. Please wait before sending another message.");
            return; // Exit if rate limit is exceeded
        }

        try {
            const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string);
            const model = await genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const result = await model.generateContent(userInput);
            const assistantResponse = result.response.text();

            // Update chat history with user input and assistant response
            setChatHistory((prevHistory) => [
                ...prevHistory,
                { role: 'user', content: userInput },
                { role: 'assistant', content: assistantResponse },
            ]);

            // Reset user input
            setUserInput('');
        } catch (error) {
            if (error instanceof Error) {
                // Check for network-related errors
                if (error.message.includes('NetworkError')) {
                    alert("Network connection is unstable. Please check your internet connection.");
                } else {
                    alert("An error occurred while generating the response. Please try again later.");
                }
                console.error("Error with generating response:", error);
            } else {
                // Handle cases where the error is not an instance of Error
                console.error("Unknown error type:", error);
            }
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

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    return (
        <div className="chatbot">
            <ul className="mb-4">
                {chatHistory.map((message, index) => (
                    <li key={index} className={`message ${message.role}`}>
                        <div className={`p-2 rounded-lg mb-2 ${message.role === 'user' ? 'bg-blue-200 text-gray-800' : 'bg-gray-200 text-gray-800'}`}>
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
                    className="border border-gray-300 p-2 rounded-md flex-grow mb-2 sm:mb-0 text-gray-800 bg-white resize-none"
                    rows={1}
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