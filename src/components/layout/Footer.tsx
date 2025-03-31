
import React from "react";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "@/store/themeStore";
import { Github, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <footer className={`w-full ${isDark ? 'bg-[#0A155A] text-white' : 'bg-gray-50 text-gray-800'} mt-auto`}>
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              HerBid
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Empowering women-led businesses through blockchain-powered consortium building and bidding.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className={`text-gray-400 hover:${isDark ? 'text-pink-400' : 'text-purple-600'}`}>
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className={`text-gray-400 hover:${isDark ? 'text-pink-400' : 'text-purple-600'}`}>
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className={`text-gray-400 hover:${isDark ? 'text-pink-400' : 'text-purple-600'}`}>
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className={`text-gray-400 hover:${isDark ? 'text-pink-400' : 'text-purple-600'}`}>
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Platform
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('/create-consortium')}
                  className={`text-sm ${isDark ? 'text-gray-300 hover:text-pink-300' : 'text-gray-600 hover:text-purple-600'}`}
                >
                  Create Consortium
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/manage-escrow')}
                  className={`text-sm ${isDark ? 'text-gray-300 hover:text-pink-300' : 'text-gray-600 hover:text-purple-600'}`}
                >
                  Manage Escrow
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/token-management')}
                  className={`text-sm ${isDark ? 'text-gray-300 hover:text-pink-300' : 'text-gray-600 hover:text-purple-600'}`}
                >
                  Token Management
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://docs.hedera.com/guides"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm ${isDark ? 'text-gray-300 hover:text-pink-300' : 'text-gray-600 hover:text-purple-600'}`}
                >
                  Hedera Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://metamask.io/faqs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm ${isDark ? 'text-gray-300 hover:text-pink-300' : 'text-gray-600 hover:text-purple-600'}`}
                >
                  MetaMask Guide
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`text-sm ${isDark ? 'text-gray-300 hover:text-pink-300' : 'text-gray-600 hover:text-purple-600'}`}
                >
                  Consortium Building Guide
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className={`text-sm ${isDark ? 'text-gray-300 hover:text-pink-300' : 'text-gray-600 hover:text-purple-600'}`}
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`text-sm ${isDark ? 'text-gray-300 hover:text-pink-300' : 'text-gray-600 hover:text-purple-600'}`}
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`text-sm ${isDark ? 'text-gray-300 hover:text-pink-300' : 'text-gray-600 hover:text-purple-600'}`}
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} mt-8 pt-6 flex flex-col md:flex-row justify-between items-center`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            &copy; {new Date().getFullYear()} HerBid. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li>
                <a
                  href="#"
                  className={`text-xs ${isDark ? 'text-gray-400 hover:text-pink-300' : 'text-gray-600 hover:text-purple-600'}`}
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`text-xs ${isDark ? 'text-gray-400 hover:text-pink-300' : 'text-gray-600 hover:text-purple-600'}`}
                >
                  Terms
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`text-xs ${isDark ? 'text-gray-400 hover:text-pink-300' : 'text-gray-600 hover:text-purple-600'}`}
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
