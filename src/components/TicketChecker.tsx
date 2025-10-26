import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Calendar, MapPin, Users } from "lucide-react";
import { toast } from "sonner";

const TicketChecker = () => {
  const [formData, setFormData] = useState({
    trainNumber: "",
    from: "",
    to: "",
    date: "",
    classType: "3A",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Checking availability...", {
      description: "This is a demo. Connect to Indian Railways API for live data."
    });
  };

  return (
    <section className="py-20 px-4 bg-railway-grid relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 pointer-events-none" />
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Live Ticket Availability
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Check real-time seat availability and waitlist status for any train
          </p>
        </div>

        <Card className="p-8 glass-card shadow-xl border-primary/20 hover:shadow-2xl transition-all duration-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Train Number */}
              <div className="space-y-2">
                <Label htmlFor="trainNumber" className="text-foreground font-medium flex items-center gap-2">
                  <Search className="w-4 h-4 text-primary" />
                  Train Number
                </Label>
                <Input
                  id="trainNumber"
                  placeholder="e.g., 12345"
                  value={formData.trainNumber}
                  onChange={(e) => setFormData({ ...formData, trainNumber: e.target.value })}
                  className="border-border focus:ring-primary"
                  required
                />
              </div>

              {/* Journey Date */}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-foreground font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Journey Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="border-border focus:ring-primary"
                  required
                />
              </div>

              {/* From Station */}
              <div className="space-y-2">
                <Label htmlFor="from" className="text-foreground font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  From Station
                </Label>
                <Input
                  id="from"
                  placeholder="e.g., NDLS (New Delhi)"
                  value={formData.from}
                  onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                  className="border-border focus:ring-primary"
                  required
                />
              </div>

              {/* To Station */}
              <div className="space-y-2">
                <Label htmlFor="to" className="text-foreground font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-secondary" />
                  To Station
                </Label>
                <Input
                  id="to"
                  placeholder="e.g., BCT (Mumbai Central)"
                  value={formData.to}
                  onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                  className="border-border focus:ring-primary"
                  required
                />
              </div>

              {/* Class Type */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="classType" className="text-foreground font-medium flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Class
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {["3A", "2A", "1A", "SL"].map((cls) => (
                    <Button
                      key={cls}
                      type="button"
                      variant={formData.classType === cls ? "default" : "outline"}
                      onClick={() => setFormData({ ...formData, classType: cls })}
                      className={formData.classType === cls ? "bg-primary hover:bg-primary-light" : ""}
                    >
                      {cls}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              size="lg"
              className="w-full bg-secondary hover:bg-secondary-light text-secondary-foreground font-semibold py-6 shadow-md hover:shadow-lg transition-all"
            >
              <Search className="w-5 h-5 mr-2" />
              Check Availability
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default TicketChecker;
