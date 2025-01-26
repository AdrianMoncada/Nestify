import React from "react";
import { X } from "lucide-react";
import CloudBackground from "../../assets/animations/CloudBackground";
import {Button} from "../../components/button/Button";
import loginImage from "../../assets/img/Robin.png";
export default function LoginScreen() {
  return (
        <div className="relative z-10 w-full h-full p-6 flex flex-col items-center">
          <div className="w-56 h-56 mb-4 flex items-center justify-center">
            <img src={loginImage} alt="loginImage" className="w-full h-full object-cover rounded-[24px]"/>
          </div>
          <h2 className="text-lg font-medium text-brown mb-1">
            Build and Grow with Nestify
          </h2>
          <p className="text-sm text-brown/90 text-center mb-6 font-normal">
            Your productivity takes shape here. Save your progress and build
            your habitat with Nestify
          </p>
          <div className="w-full mb-3">
            <div className="relative">
              {/* Login Buttons */}
          <Button variant="standardNeutral">
            Continue with Google
          </Button>
          <Button variant="standardNeutral">
            Continue with Email
          </Button>
            </div>
          </div>
          <div className="text-xs text-brown">
            Already have an account?{" "}
            <a
              href="#"
              className="text-brown font-medium hover:opacity-80 transition-opacity"
            >
              Log in
            </a>
          </div>
        </div>
      
    
  );
}
