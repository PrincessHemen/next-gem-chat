"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { auth, signInWithGoogle } from './lib/Firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/redux/store';
import { login, logout } from '../app/redux/slices/authSlice';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user); // Retrieve user from Redux
  const parallaxRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setIsDarkMode(storedTheme === 'dark');
      document.documentElement.classList.add(storedTheme);
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (parallaxRef.current) {
        const { innerWidth, innerHeight } = window;
        const xPos = (e.clientX / innerWidth) - 0.5;
        const yPos = (e.clientY / innerHeight) - 0.5;
        parallaxRef.current.style.transform = `translate(${xPos * 40}px, ${yPos * 40}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(login(user)); // Store the user in Redux
      } else {
        dispatch(logout());
      }
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      unsubscribe();
    };
  }, [dispatch]);

  const toggleDarkMode = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.remove(isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleSignIn = async () => {
    await signInWithGoogle();
  };

  const handleSignOut = async () => {
    await signOut(auth);
    dispatch(logout());
    router.push('/'); // Redirect to home page after logout
    alert('You have been logged out.');
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <button
        onClick={toggleDarkMode}
        className={`fixed top-5 right-5 py-2 px-4 rounded-lg border ${isDarkMode ? 'border-white text-white' : 'border-gray-800 text-gray-800'} hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 z-20`}>
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>

      <div className="relative z-10 max-w-md w-full text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Welcome to Our AI Chatbot</h1>

        {user ? (
          <>
            <p className="mb-4">Welcome, {user.displayName}!</p> {/* Display the user's name */}
            <Link href="/chat">
              <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200">
                Go to Chat
              </button>
            </Link>
            <button 
              onClick={handleSignOut}
              className="w-full py-2 px-4 mt-4 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors duration-200">
              Log Out
            </button>
          </>
        ) : (
          <button 
            onClick={handleSignIn}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200">
            Sign in with Google
          </button>
        )}
      </div>

      <div ref={parallaxRef} className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={isDarkMode ? '/parallax2.jpg' : '/parallax.jpg'}
          alt="Background image"
          fill
          priority={true}
          className="parallax-image object-cover"
        />
      </div>
    </div>
  );
};

export default HomePage;
