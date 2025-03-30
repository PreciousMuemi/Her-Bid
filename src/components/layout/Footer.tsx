
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer id="contact" className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Her<span className="text-secondary">Bid</span></h3>
            <p className="text-primary-foreground/80 max-w-xs">
              Transforming how women access large contracts by combining collective bidding, 
              secure payments, and skill validation.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-primary-foreground/80 hover:text-secondary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="#features" className="text-primary-foreground/80 hover:text-secondary transition-colors">Features</Link>
              </li>
              <li>
                <Link to="#how-it-works" className="text-primary-foreground/80 hover:text-secondary transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="#contact" className="text-primary-foreground/80 hover:text-secondary transition-colors">Contact</Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">Success Stories</Link>
              </li>
              <li>
                <Link to="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">Blog</Link>
              </li>
              <li>
                <Link to="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">Support</Link>
              </li>
              <li>
                <Link to="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="flex-shrink-0 mt-1 text-secondary" />
                <span className="text-primary-foreground/80">123 Business Avenue, City, Country</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="flex-shrink-0 text-secondary" />
                <a href="mailto:contact@herbid.com" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  contact@herbid.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="flex-shrink-0 text-secondary" />
                <a href="tel:+1234567890" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-primary-foreground/20 text-center">
          <p className="text-sm text-primary-foreground/60">
            &copy; {currentYear} HerBid. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
