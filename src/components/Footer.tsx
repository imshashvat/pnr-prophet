import { Train } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Train className="w-8 h-8 text-secondary" />
              <span className="text-2xl font-bold">TrainPredictor AI</span>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed max-w-md">
              Advanced AI-powered platform for predicting train ticket confirmations, 
              checking availability, and tracking PNR status in real-time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-secondary transition-colors">Check Availability</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Track PNR</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Predictions</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">API Access</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-secondary transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center text-primary-foreground/70">
          <p>&copy; 2025 TrainPredictor AI. Built with advanced machine learning algorithms.</p>
          <p className="text-sm mt-2">Disclaimer: This is a demo platform. For official bookings, please visit Indian Railways.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
