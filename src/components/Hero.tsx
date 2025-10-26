import { Button } from "@/components/ui/button";
import { Search, TrendingUp, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroTrain from "@/assets/hero-train.jpg";

const Hero = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroTrain} 
          alt="Modern Indian Railway Train" 
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 mx-auto text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/10 backdrop-blur-sm border border-primary-light/30 rounded-full">
            <TrendingUp className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-primary-foreground">
              AI-Powered Prediction Engine
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground leading-tight">
            Know Your Train Ticket's
            <span className="block bg-gradient-to-r from-secondary via-secondary-light to-secondary bg-clip-text text-transparent">
              Confirmation Chances
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
            Advanced AI analyzes live data to predict waitlist confirmations, check availability, 
            and track PNR status in real-time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              onClick={() => scrollToSection("ticket-checker")}
              className="bg-secondary hover:bg-secondary-light text-secondary-foreground px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-glow transition-all"
            >
              <Search className="w-5 h-5 mr-2" />
              Check Availability
            </Button>
            <Button 
              size="lg" 
              onClick={() => navigate("/track-pnr")}
              className="bg-primary hover:bg-primary-light text-primary-foreground border-2 border-primary-light px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-glow transition-all"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Track PNR
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div className="space-y-2 p-4 bg-card/20 backdrop-blur-sm rounded-lg border border-primary-foreground/20">
              <div className="text-3xl md:text-4xl font-bold text-secondary drop-shadow-lg">95%+</div>
              <div className="text-sm text-primary-foreground font-medium">Accuracy Rate</div>
            </div>
            <div className="space-y-2 p-4 bg-card/20 backdrop-blur-sm rounded-lg border border-primary-foreground/20">
              <div className="text-3xl md:text-4xl font-bold text-secondary drop-shadow-lg">2M+</div>
              <div className="text-sm text-primary-foreground font-medium">Predictions Made</div>
            </div>
            <div className="space-y-2 p-4 bg-card/20 backdrop-blur-sm rounded-lg border border-primary-foreground/20">
              <div className="text-3xl md:text-4xl font-bold text-secondary drop-shadow-lg">24/7</div>
              <div className="text-sm text-primary-foreground font-medium">Live Tracking</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default Hero;
