import { Card } from "@/components/ui/card";
import { Brain, TrendingUp, Bell, MapPin, BarChart3, Calendar } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Prediction Engine",
    description: "Advanced machine learning analyzes historical patterns to predict confirmation chances with 95%+ accuracy."
  },
  {
    icon: TrendingUp,
    title: "Real-Time Updates",
    description: "Live tracking of PNR status, waitlist movement, and seat availability across all trains."
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Get instant alerts when your ticket status changes or better alternatives become available."
  },
  {
    icon: MapPin,
    title: "Route Visualization",
    description: "Interactive maps showing complete train routes with station details and timings."
  },
  {
    icon: BarChart3,
    title: "Historical Trends",
    description: "Analyze past confirmation patterns and seasonal trends for better travel planning."
  },
  {
    icon: Calendar,
    title: "Alternate Suggestions",
    description: "Smart recommendations for alternative trains, dates, and classes with better confirmation odds."
  }
];

const Features = () => {
  return (
    <section className="py-20 px-4 bg-railway-grid relative overflow-hidden">
      {/* Subtle mesh gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background pointer-events-none" />
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Powerful Features for Smart Travel
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to make informed decisions about your train journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="p-6 glass-card hover:shadow-glow transition-all duration-500 hover:-translate-y-2 border-primary/20 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-purple flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
