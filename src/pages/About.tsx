import { Card } from "@/components/ui/card";
import { Train, Target, Users, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-foreground mb-6">
              About <span className="text-secondary">RailPredict AI</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Revolutionizing train ticket booking with AI-powered predictions and real-time tracking
            </p>
          </div>

          {/* Mission Section */}
          <Card className="p-8 mb-8 bg-gradient-card shadow-lg border-primary/10">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  At RailPredict AI, we're on a mission to eliminate uncertainty in train travel. 
                  Using advanced artificial intelligence and machine learning, we analyze historical 
                  data and real-time patterns to provide accurate waitlist confirmation predictions, 
                  helping millions of travelers plan their journeys with confidence.
                </p>
              </div>
            </div>
          </Card>

          {/* What We Do */}
          <Card className="p-8 mb-8 bg-gradient-card shadow-lg border-primary/10">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Train className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">What We Do</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  RailPredict AI combines cutting-edge technology with comprehensive railway data to provide:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span><strong className="text-foreground">AI-Powered Predictions:</strong> Advanced algorithms analyze patterns to predict waitlist confirmations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span><strong className="text-foreground">Real-Time Tracking:</strong> Live PNR status updates and train availability information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span><strong className="text-foreground">Smart Recommendations:</strong> Intelligent suggestions for alternative routes and dates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span><strong className="text-foreground">Instant Notifications:</strong> Timely alerts when your ticket status changes</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Why Choose Us */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 bg-gradient-card shadow-lg border-primary/10">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">95%+ Accuracy</h3>
                  <p className="text-muted-foreground">
                    Our AI models achieve over 95% accuracy in predicting waitlist confirmations, 
                    backed by years of railway data analysis.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-lg border-primary/10">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">2M+ Users Trust Us</h3>
                  <p className="text-muted-foreground">
                    Over 2 million travelers rely on RailPredict AI for their journey planning, 
                    making confident travel decisions every day.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Vision */}
          <Card className="p-8 bg-gradient-primary text-primary-foreground shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="leading-relaxed">
              We envision a future where every traveler can plan their journey with complete confidence. 
              Through continuous innovation in AI and data science, we're building a platform that not 
              only predicts outcomes but also provides actionable insights, making train travel more 
              accessible, predictable, and stress-free for everyone across India.
            </p>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
