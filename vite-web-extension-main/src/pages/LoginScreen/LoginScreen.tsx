import React from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import CloudBackground from "../../assets/animations/CloudBackground";
import { Button } from "../../components/button/Button";
import loginImage from "../../assets/img/Robin.png";
import { supabase, getUserData } from "../../lib/supabase";
import { JumpingBird } from "@src/assets/animations/JumpingBird";
import { CheckCircle } from 'lucide-react';

export default function LoginScreen() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    console.log('Attempting Google login...');
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: chrome.identity.getRedirectURL(),
        },
      });

      if (error) throw error;

      if (data.url) {
        await chrome.tabs.create({ url: data.url });
      }
    } catch (error) {
      console.error('Error during Google login:', error);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6">
      {/* Welcome Message */}
      <h1 className="text-4xl font-bold text-brown mb-2 tracking-wider">Nestify</h1>

      {/* Bird Animation */}
      <div className="w-64 h-64 flex items-center justify-center mb-2">
        <JumpingBird />
      </div>

      {/* Main Title */}
      <h2 className="text-2xl font-semibold text-brown mb-2 text-center">
        Build and Grow with Nestify
      </h2>
      <ul className="text-base font-semibold text-brown/80 text-center space-y-2 mb-2">
  <li className="inline-flex items-center space-x-2">
    <CheckCircle color="#FDD176" />
    <span>Stay productive with focus timers</span>
  </li>
  <li className="inline-flex items-center space-x-2">
    <CheckCircle color="#FDD176" />
    <span>Grow your virtual ecosystem</span>
  </li>
</ul>


      {/* Login Button */}
      <Button variant="primary" onClick={handleGoogleLogin}>
        Continue with Google
      </Button>
    </div>
  );
}

