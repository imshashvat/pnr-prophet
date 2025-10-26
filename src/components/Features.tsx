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
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
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
                className="p-6 bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/10"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
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
