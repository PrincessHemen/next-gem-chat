"use client";

import { useState, useEffect } from "react";
import Chatbot from "../components/Chatbot";  // Adjust the path if necessary
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const ChatPage = () => {
    const [darkMode, setDarkMode] = useState(false);
    const user = useSelector((state: RootState) => state.auth.user); // Retrieve user from Redux

    // Toggle between dark mode and light mode
    const handleToggle = () => {
        setDarkMode(!darkMode);
    };

    // Update class on the body element for global styling
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center px-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <button
                className="mb-6 px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleToggle}
            >
                Toggle {darkMode ? 'Light' : 'Dark'} Mode
            </button>

            <div className={`shadow-lg rounded-lg p-8 max-w-lg w-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                <h1 className="text-3xl font-bold text-center mb-6">Chat with Our AI Bot</h1>

                {user && <p className="mb-4 text-center">Welcome, {user.displayName}!</p>} {/* Display the user's name */}

                <Chatbot />  {/* Rendering your Chatbot component */}
            </div>
        </div>
    );
};

export default ChatPage;
