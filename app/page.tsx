"use client";

import { useState } from 'react';

// Define types to satisfy TypeScript and ensure data consistency
interface StoryPage {
  text: string;
  question: string;
  options: string[];
}

interface Story {
  title: string;
  pages: StoryPage[];
}

export default function CircleTimeApp() {
  // --- State Management ---
  const [studentName, setStudentName] = useState("");
  const [ageGroup, setAgeGroup] = useState("3-4");
  const [topic, setTopic] = useState("");
  const [page, setPage] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [story, setStory] = useState<Story | null>(null);

  // --- API Logic ---
  const handleStart = async () => {
    if (!studentName || !topic) {
      alert("Please enter a name and a topic for the class!");
      return;
    }

    setIsLoading(true);
    try {
      // Calling our internal API route that connects to DeepSeek
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName, ageGroup, topic })
      });

      if (!response.ok) throw new Error("Failed to fetch story");

      const data: Story = await response.json();
      setStory(data);
      setIsStarted(true);
    } catch (error) {
      console.error("Story Generation Error:", error);
      alert("The magic book is stuck! Let's try clicking 'Start' again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsStarted(false);
    setStory(null);
    setPage(0);
  };

  // --- View 1: Teacher Dashboard ---
  if (!isStarted) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 p-6">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border-4 border-blue-400 max-w-md w-full">
          <h1 className="text-3xl font-black text-blue-600 mb-2 text-center">CircleTime AI</h1>
          <p className="text-gray-500 text-center mb-8 font-medium">Create a story for your lesson</p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Student&apos;s Name:</label>
              <input
                type="text"
                placeholder="e.g. Leo"
                className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-blue-400 outline-none text-gray-800 transition-colors"
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Today&apos;s Topic:</label>
              <input
                type="text"
                placeholder="e.g. A rainy day in Shanghai"
                className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-blue-400 outline-none text-gray-800 transition-colors"
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Learning Level:</label>
              <select
                className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-blue-400 outline-none text-gray-800 transition-colors bg-white"
                onChange={(e) => setAgeGroup(e.target.value)}
              >
                <option value="3-4">Early Years (Ages 3-4)</option>
                <option value="5-6">Pre-K / K3 (Ages 5-6)</option>
              </select>
            </div>

            <button
              onClick={handleStart}
              disabled={isLoading}
              className={`w-full text-white font-black text-lg py-5 rounded-2xl transition-all shadow-lg active:scale-95 flex justify-center items-center ${
                isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center gap-3">
                  <span className="animate-spin text-2xl">✨</span> Writing Story...
                </span>
              ) : (
                "Start Circle Time 🚀"
              )}
            </button>
          </div>
        </div>
      </main>
    );
  }

// --- View 2: Interactive Story Theater ---

  // 1. Safety Guard: Check if story and pages exist before accessing index
  const hasPages = story?.pages && story.pages.length > 0;
  const currentPage = hasPages ? story.pages[page] : null;

  // 2. Fallback UI: If started but data is missing, show a recovery screen
  if (isStarted && !currentPage) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-6">
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center border-4 border-red-200 max-w-sm">
          <div className="text-6xl mb-4">😵</div>
          <p className="text-xl font-bold text-gray-800 mb-6">The storybook is empty!</p>
          <button
            onClick={handleReset}
            className="bg-blue-500 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-600 transition-all"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // 3. Main Story Render
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-4 md:p-10">
      <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border-[12px] border-yellow-400 max-w-2xl w-full text-center relative">

        {/* Progress indicator */}
        <div className="absolute top-6 right-8 text-yellow-500 font-bold text-sm uppercase tracking-widest">
          Page {page + 1} of {story?.pages?.length || 0}
        </div>

        {/* Visual Placeholder */}
        <div className="text-[120px] mb-10 drop-shadow-sm">🌟</div>

        <h2 className="text-sm font-bold text-blue-300 mb-4 uppercase tracking-[0.3em]">
          {story?.title}
        </h2>

        {/* Story Text */}
        <p className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 leading-tight min-h-[150px] flex items-center justify-center">
          {currentPage?.text}
        </p>

        {/* Interaction Box */}
        <div className="bg-blue-50 p-8 rounded-[2rem] border-4 border-dashed border-blue-200">
          <p className="text-lg font-bold mb-6 text-blue-800">{currentPage?.question}</p>

          <div className="flex flex-wrap gap-4 justify-center">
            {currentPage?.options?.map((option: string) => (
              <button
                key={option}
                onClick={() => {
                  if (story && page < story.pages.length - 1) {
                    setPage(page + 1);
                  } else {
                    alert("The End! Great job listening!");
                    handleReset();
                  }
                }}
                className="bg-white border-4 border-blue-500 text-blue-600 px-10 py-4 rounded-full font-black text-xl hover:bg-blue-500 hover:text-white transition-all shadow-xl hover:shadow-blue-200 active:scale-95"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleReset}
          className="mt-10 text-gray-300 hover:text-red-400 text-xs font-bold uppercase tracking-widest transition-colors"
        >
          ✕ End Story
        </button>
      </div>
    </main>
  );
}
