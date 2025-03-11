import React, { useEffect, useState, useRef } from "react";
import { Menu, User, Settings, LogOut, ExternalLink } from "lucide-react";
import { supabase } from '../../lib/supabase'; // Adjust import path as needed
import { useNavigate } from 'react-router-dom';

interface MenuButtonProps {
  enabledOptions?: {
    profile?: boolean;
    settings?: boolean;
    logout?: boolean;
    mellowtel?: boolean;
  };
}

export const HamburgerMenu = ({
  enabledOptions = {
    profile: false,
    settings: false,
    logout: true,
    mellowtel: true, // Habilitado por defecto
  },
}: MenuButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      // Clear local storage
      await chrome.storage.local.remove([
        'session', 
        'userId', 
        'ecosystem', 
        'species', 
        'userSpecieCollection', 
        'selectionState', 
        'rewardState',
        'timerState',
        'appState'
      ]);

      // Navigate to login screen
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Optionally show an error message to the user
    }
  };

  // Función para abrir la configuración de Mellowtel
  const openMellowtelSettings = () => {
    try {
      // Enviar mensaje al background script para abrir la configuración
      chrome.runtime.sendMessage({ type: 'OPEN_MELLOWTEL_SETTINGS' }, (response) => {
        if (response && response.success) {
          console.log("Mellowtel settings request successful");
        } else {
          console.error("Failed to open Mellowtel settings");
        }
      });
      setIsOpen(false); // Cerrar el menú después de hacer clic
    } catch (error) {
      console.error("Error requesting to open Mellowtel settings:", error);
    }
  };

  return (
    <div ref={menuRef} className="absolute top-0 right-3 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group flex items-center justify-center w-9 h-9 
                   rounded-xl border-2 border-[#784E2F] hover:border-[#957F66]
                   bg-white
                   shadow-[0_6px_0_#784E2F] hover:shadow-[0_6px_0_#957F66]
                   active:shadow-[0_2px_0_#784E2F] active:translate-y-[4px]
                   transition-all duration-200 ease-in-out"
      >
        <Menu
          className={`w-5 h-5 text-[#784E2F] group-hover:text-[#957F66] transition-all duration-500
                     ${isOpen ? "rotate-[360deg]" : "rotate-0"}`}
        />
      </button>
      {isOpen && (
        <div
          className="absolute top-0 right-[calc(100%+0.5rem)] w-40
                      bg-white
                      border border-[#784E2F]/20
                      rounded-xl shadow-lg
                      overflow-hidden
                      z-50"
        >
          <div className="flex flex-col">
            <button
              disabled={!enabledOptions.profile}
              className={`flex items-center gap-2 px-3 py-2.5
                             text-sm text-[#784E2F]
                             transition-colors duration-200
                             ${enabledOptions.profile ? "hover:bg-[#957F66]/20" : "opacity-50 cursor-not-allowed"}`}
            >
              <User size={16} />
              <span>Profile</span>
            </button>
            <button
              disabled={!enabledOptions.settings}
              className={`flex items-center gap-2 px-3 py-2.5
                             text-sm text-[#784E2F]
                             transition-colors duration-200
                             ${enabledOptions.settings ? "hover:bg-[#957F66]/20" : "opacity-50 cursor-not-allowed"}`}
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>
            {enabledOptions.mellowtel && (
              <button
                onClick={openMellowtelSettings}
                className="flex items-center gap-2 px-3 py-2.5
                           text-sm text-[#784E2F]
                           transition-colors duration-200
                           hover:bg-[#957F66]/20"
              >
                <ExternalLink size={16} />
                <span>Mellowtel</span>
              </button>
            )}
            <button
              onClick={handleLogout}
              disabled={!enabledOptions.logout}
              className={`flex items-center gap-2 px-3 py-2.5
                             text-sm text-[#B33B3B]
                             transition-colors duration-200
                             ${enabledOptions.logout ? "hover:bg-[#957F66]/20 hover:text-red-700" : "opacity-50 cursor-not-allowed"}`}
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

