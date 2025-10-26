import { Button } from "@/components/ui/button";
import { Train, Menu } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-xl font-bold text-primary hover:text-primary-light transition-colors"
          >
            <Train className="w-6 h-6 text-secondary" />
            <span>RailPredict AI</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate("/")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("ticket-checker")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Services
            </button>
            <button
              onClick={() => navigate("/track-pnr")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Track PNR
            </button>
            <button
              onClick={() => navigate("/about")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              About
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Contact
            </button>
            <Button 
              onClick={() => scrollToSection("ticket-checker")}
              className="bg-secondary hover:bg-secondary-light text-secondary-foreground"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-border">
            <button
              onClick={() => { navigate("/"); setIsOpen(false); }}
              className="block w-full text-left px-4 py-2 text-foreground hover:bg-muted rounded-md transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("ticket-checker")}
              className="block w-full text-left px-4 py-2 text-foreground hover:bg-muted rounded-md transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => { navigate("/track-pnr"); setIsOpen(false); }}
              className="block w-full text-left px-4 py-2 text-foreground hover:bg-muted rounded-md transition-colors"
            >
              Track PNR
            </button>
            <button
              onClick={() => { navigate("/about"); setIsOpen(false); }}
              className="block w-full text-left px-4 py-2 text-foreground hover:bg-muted rounded-md transition-colors"
            >
              About
            </button>
            <button
              onClick={() => { navigate("/contact"); setIsOpen(false); }}
              className="block w-full text-left px-4 py-2 text-foreground hover:bg-muted rounded-md transition-colors"
            >
              Contact
            </button>
            <div className="px-4 pt-2">
              <Button 
                onClick={() => scrollToSection("ticket-checker")}
                className="w-full bg-secondary hover:bg-secondary-light text-secondary-foreground"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
