import React from "react";
import { X } from "lucide-react";
import CloudBackground from "../../assets/animations/CloudBackground";
import {Button} from "../../components/button/Button";

export default function LoginScreen() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="w-[400px] h-[550px] relative border-4 border-[#784E2F] rounded-[24px] overflow-hidden">
        <div className="absolute inset-0 bg-[#CFF1D8]">
          <CloudBackground />
        </div>
        <div className="relative z-10 w-full h-full p-6 flex flex-col items-center">
          <div className="w-56 h-56 mb-4 rounded-[24px] border-2 border-[#784E2F] bg-white/50 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-[#784E2F]/10 border-2 border-[#784E2F]"></div>
          </div>
          <h2 className="text-lg font-medium text-[#784E2F] mb-1">
            Build and Grow with Nestify
          </h2>
          <p className="text-sm text-[#784E2F]/90 text-center mb-6 font-normal">
            Your productivity takes shape here. Save your progress and build
            your habitat with Nestify.
          </p>
          <div className="w-full mb-3">
            <div className="relative">
              {/* Login Buttons */}
          <Button variant="primary" icon="google" className="mb-3">
            Continue with Google
          </Button>
          <Button variant="primary" className="mb-6">
            Continue with Email
          </Button>
              <div className="w-full h-12 absolute top-3 -z-10 bg-[#E6B449] rounded-3xl border-2 border-[#784E2F]"></div>
            </div>
          </div>
          <div className="text-xs text-[#784E2F]">
            Already have an account?{" "}
            <a
              href="#"
              className="text-[#784E2F] font-medium hover:opacity-80 transition-opacity"
            >
              Log in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
