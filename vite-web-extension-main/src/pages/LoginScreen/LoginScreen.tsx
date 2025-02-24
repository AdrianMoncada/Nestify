import React from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import CloudBackground from "../../assets/animations/CloudBackground";
import { Button } from "../../components/button/Button";
import loginImage from "../../assets/img/Robin.png";
import { supabase, getUserData } from "../../lib/supabase";

export default function LoginScreen() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    console.log('Ingreso a handleGoogleLogin...');
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
          <Button 
            variant="primary"
            onClick={handleGoogleLogin}
          >
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
