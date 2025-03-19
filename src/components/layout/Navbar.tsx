
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { CustomButton } from '../ui/CustomButton';
import { useThemeStore } from '@/store/themeStore';

const Navbar = ({ dashboard = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || dashboard ? 'bg-[#050A30]/90 backdrop-blur-md shadow-sm py-4 text-white' : 'bg-transparent py-6 text-foreground'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center"
          >
            <span className={`font-bold text-2xl ${dashboard || isScrolled ? 'text-white' : 'text-primary'}`}>Her<span className={`${dashboard || isScrolled ? 'text-pink-300' : 'text-secondary'}`}>Bid</span></span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {!dashboard && (
              <>
                <Link to="/" className={`hover:text-primary transition-colors ${isScrolled ? 'text-white' : 'text-foreground'}`}>Home</Link>
                <Link to="#features" className={`hover:text-primary transition-colors ${isScrolled ? 'text-white' : 'text-foreground'}`}>Features</Link>
                <Link to="#how-it-works" className={`hover:text-primary transition-colors ${isScrolled ? 'text-white' : 'text-foreground'}`}>How it Works</Link>
                <Link to="#contact" className={`hover:text-primary transition-colors ${isScrolled ? 'text-white' : 'text-foreground'}`}>Contact</Link>
              </>
            )}
          </div>
          
          {/* Call to Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!dashboard && (
              <>
                <CustomButton 
                  variant="ghost" 
                  size="default"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Sign In
                </CustomButton>
                <CustomButton 
                  variant="default" 
                  size="default"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Get Started
                </CustomButton>
              </>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-white/10 transition-colors mr-2"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            {!dashboard && (
              <button 
                className={`${isScrolled ? 'text-white' : 'text-foreground'}`}
                onClick={toggleMenu}
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && !dashboard && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg shadow-lg animate-scale-in">
          <div className="container mx-auto px-4 py-6 space-y-4">
            <Link to="/" className="block py-2 text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="#features" className="block py-2 text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Features</Link>
            <Link to="#how-it-works" className="block py-2 text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>How it Works</Link>
            <Link to="#contact" className="block py-2 text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            <div className="pt-4 flex flex-col space-y-3">
              <CustomButton 
                variant="ghost" 
                size="default"
                onClick={() => window.location.href = '/dashboard'}
              >
                Sign In
              </CustomButton>
              <CustomButton 
                variant="default" 
                size="default"
                onClick={() => window.location.href = '/dashboard'}
              >
                Get Started
              </CustomButton>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
