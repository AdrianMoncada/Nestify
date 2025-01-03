import React from "react";
import { X } from "lucide-react";
export function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <main className="w-[400px] h-[550px] bg-white rounded-[24px] shadow-lg flex flex-col p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <img
            src="https://placehold.co/120x30/4B83F2/ffffff/svg?text=APP+LOGO"
            alt="App Logo"
            className="h-[30px]"
          />
          <button className="text-[#4B83F2] hover:text-[#3B73E2] transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex justify-center mb-8">
          <img
            src="https://placehold.co/160x160/4B83F2/ffffff/svg?text=OWL"
            alt="Mascot"
            className="w-32 h-32"
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-left">
          Build and Grow with Nestify
        </h1>
        <p className="text-gray-600 mb-6 text-sm text-left">
          Your productivity takes shape here. Save your progress and build your
          habitat with Nestify.
        </p>
        <button className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-[16px] bg-[#4B83F2] hover:bg-[#3B73E2] text-white transition-colors mb-3">
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="currentColor"
            />
          </svg>
          Continue with Google
        </button>
        <button className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-[16px] border border-gray-200 hover:bg-gray-50 transition-colors">
          Continue with Email
        </button>
        <div className="mt-auto text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="#" className="text-[#4B83F2] hover:underline">
            Log In
          </a>
        </div>
      </main>
    </div>
  );
}