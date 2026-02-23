"use client";
import { useState } from 'react';

export default function CircleTimeApp() {
  const [studentName, setStudentName] = useState("the class");
  const [ageGroup, setAgeGroup] = useState("3-4");
  const [page, setPage] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  const storyData = [
    {
      text: `Look! Look out the window, ${studentName}! It is rain. Rain, rain, rain.`,
      image: "🌧️",
      question: "What is falling from the sky?",
      options: ["Sun", "Rain"]
    },
    {
      text: `Hold your umbrella, ${studentName}! It is a big yellow umbrella. We are dry!`,
      image: "☂️",
      question: "Is the umbrella red or yellow?",
      options: ["Yellow", "Red"]
    }
  ];

  if (!isStarted) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 p-6">
        <div className="bg-white p-10 rounded-3xl shadow-2xl border-4 border-blue-400 max-w-md w-full">
          <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">Teacher Dashboard</h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Student&apos;s Name:</label>
              <input
                type="text"
                placeholder="e.g. Leo"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none"
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Target Age:</label>
              <select
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none"
                onChange={(e) => setAgeGroup(e.target.value)}
              >
                <option value="3-4">Ages 3-4 (Simple)</option>
                <option value="5-6">Ages 5-6 (Advanced)</option>
              </select>
            </div>

            <button
              onClick={() => setIsStarted(true)}
              className="w-full bg-blue-500 text-white font-bold py-4 rounded-2xl hover:bg-blue-600 transition-all shadow-lg active:scale-95 mt-4"
            >
              Start Circle Time 🚀
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl border-8 border-yellow-400 max-w-xl w-full text-center">
        <div className="text-9xl mb-8">{storyData[page].image}</div>
        <p className="text-3xl font-bold text-gray-800 mb-8 leading-tight">{storyData[page].text}</p>

        <div className="bg-blue-100 p-6 rounded-2xl border-2 border-blue-300">
          <p className="text-xl font-semibold mb-6 text-blue-900">{storyData[page].question}</p>
          <div className="flex gap-4 justify-center">
            {storyData[page].options.map((option) => (
              <button
                key={option}
                onClick={() => setPage(page === 0 ? 1 : 0)}
                className="bg-white border-4 border-blue-500 text-blue-500 px-8 py-3 rounded-full font-black text-lg hover:bg-blue-500 hover:text-white transition-all shadow-md active:scale-95"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => {setIsStarted(false); setPage(0);}}
          className="mt-8 text-gray-400 hover:text-gray-600 text-sm font-bold underline"
        >
          ← Change Student
        </button>
      </div>
    </main>
  );
}
