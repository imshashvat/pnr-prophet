import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TicketChecker from "@/components/TicketChecker";
import WaitlistPredictor from "@/components/WaitlistPredictor";
import PNRTracker from "@/components/PNRTracker";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <div id="ticket-checker">
        <TicketChecker />
      </div>
      <div id="waitlist-predictor">
        <WaitlistPredictor />
      </div>
      <div id="pnr-tracker">
        <PNRTracker />
      </div>
      <div id="features">
        <Features />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
