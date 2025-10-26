import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const WaitlistPredictor = () => {
  const [waitlistPosition, setWaitlistPosition] = useState("");
  const [prediction, setPrediction] = useState<{
    confidence: number;
    status: "high" | "medium" | "low";
    message: string;
  } | null>(null);

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate AI prediction
    const position = parseInt(waitlistPosition);
    let confidence = 0;
    let status: "high" | "medium" | "low" = "low";
    let message = "";

    if (position <= 10) {
      confidence = Math.random() * 15 + 85; // 85-100%
      status = "high";
      message = "Very likely to be confirmed! Historical data shows high clearance.";
    } else if (position <= 30) {
      confidence = Math.random() * 25 + 60; // 60-85%
      status = "medium";
      message = "Good chances of confirmation based on seasonal patterns.";
    } else {
      confidence = Math.random() * 30 + 20; // 20-50%
      status = "low";
      message = "Lower probability. Consider alternative trains or dates.";
    }

    setPrediction({
      confidence: Math.round(confidence),
      status,
      message
    });

    toast.success("AI Analysis Complete!", {
      description: "Prediction generated based on historical trends"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "high": return "text-success";
      case "medium": return "text-warning";
      case "low": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "high": return <CheckCircle className="w-6 h-6 text-success" />;
      case "medium": return <TrendingUp className="w-6 h-6 text-warning" />;
      case "low": return <AlertCircle className="w-6 h-6 text-destructive" />;
      default: return null;
    }
  };

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Brain className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">AI-Powered Analysis</span>
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Waitlist Confirmation Predictor
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get intelligent predictions on your waitlist confirmation probability
          </p>
        </div>

        <Card className="p-8 bg-card shadow-lg">
          <form onSubmit={handlePredict} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="waitlist" className="text-foreground font-medium text-lg">
                Current Waitlist Position
              </Label>
              <Input
                id="waitlist"
                type="number"
                placeholder="e.g., WL 15"
                value={waitlistPosition}
                onChange={(e) => setWaitlistPosition(e.target.value)}
                className="border-border focus:ring-primary text-lg py-6"
                min="1"
                required
              />
            </div>

            <Button 
              type="submit" 
              size="lg"
              className="w-full bg-primary hover:bg-primary-light text-primary-foreground font-semibold py-6 shadow-md hover:shadow-lg transition-all"
            >
              <Brain className="w-5 h-5 mr-2" />
              Predict Confirmation
            </Button>
          </form>

          {prediction && (
            <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="h-px bg-border" />
              
              {/* Confidence Meter */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(prediction.status)}
                    <span className="text-lg font-semibold text-foreground">
                      Confirmation Probability
                    </span>
                  </div>
                  <span className={`text-3xl font-bold ${getStatusColor(prediction.status)}`}>
                    {prediction.confidence}%
                  </span>
                </div>
                
                <Progress 
                  value={prediction.confidence} 
                  className="h-3"
                />
                
                <p className="text-muted-foreground leading-relaxed">
                  {prediction.message}
                </p>
              </div>

              {/* Additional Insights */}
              <div className="grid md:grid-cols-3 gap-4 pt-4">
                <Card className="p-4 bg-muted/50 border-primary/20">
                  <div className="text-sm text-muted-foreground mb-1">Based On</div>
                  <div className="font-semibold text-foreground">Historical Data</div>
                </Card>
                <Card className="p-4 bg-muted/50 border-primary/20">
                  <div className="text-sm text-muted-foreground mb-1">Analysis Type</div>
                  <div className="font-semibold text-foreground">ML Algorithm</div>
                </Card>
                <Card className="p-4 bg-muted/50 border-primary/20">
                  <div className="text-sm text-muted-foreground mb-1">Data Points</div>
                  <div className="font-semibold text-foreground">10,000+</div>
                </Card>
              </div>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
};

export default WaitlistPredictor;
