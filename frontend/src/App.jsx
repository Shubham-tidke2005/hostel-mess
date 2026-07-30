import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-xl p-10">
        <h1 className="text-4xl font-bold text-blue-600">
          Tailwind CSS is Working 🚀
        </h1>

        <p className="mt-4 text-gray-600">
          Hostel & Mess Management System
        </p>

        <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          Get Started
        </button>
      </div>
    </div>
  );
}

export default App;