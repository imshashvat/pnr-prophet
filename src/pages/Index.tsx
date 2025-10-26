import Hero from "@/components/Hero";
import TicketChecker from "@/components/TicketChecker";
import WaitlistPredictor from "@/components/WaitlistPredictor";
import PNRTracker from "@/components/PNRTracker";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <TicketChecker />
      <WaitlistPredictor />
      <PNRTracker />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
