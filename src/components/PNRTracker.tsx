import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Train, Calendar, User, MapPin } from "lucide-react";
import { toast } from "sonner";

const PNRTracker = () => {
  const [pnr, setPnr] = useState("");
  const [pnrStatus, setPnrStatus] = useState<{
    trainNumber: string;
    trainName: string;
    date: string;
    from: string;
    to: string;
    status: "CNF" | "WL" | "RAC";
    statusNumber: string;
    coach: string;
    berth: string;
  } | null>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate PNR status
    const statuses: Array<"CNF" | "WL" | "RAC"> = ["CNF", "WL", "RAC"];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    setPnrStatus({
      trainNumber: "12301",
      trainName: "Rajdhani Express",
      date: "15-Dec-2025",
      from: "New Delhi (NDLS)",
      to: "Mumbai Central (BCT)",
      status: randomStatus,
      statusNumber: randomStatus === "CNF" ? "" : randomStatus === "WL" ? "8" : "12",
      coach: "A1",
      berth: "23"
    });

    toast.success("PNR Status Retrieved", {
      description: "This is demo data. Connect to Indian Railways API for live status."
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CNF":
        return <Badge className="bg-success text-success-foreground px-3 py-1">Confirmed</Badge>;
      case "WL":
        return <Badge className="bg-warning text-warning-foreground px-3 py-1">Waitlist</Badge>;
      case "RAC":
        return <Badge className="bg-destructive text-destructive-foreground px-3 py-1">RAC</Badge>;
      default:
        return null;
    }
  };

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Track Your PNR Status
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time PNR tracking with berth information and confirmation updates
          </p>
        </div>

        <Card className="p-8 bg-gradient-card shadow-lg border-primary/10">
          <form onSubmit={handleTrack} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="pnr" className="text-foreground font-medium text-lg">
                Enter 10-Digit PNR Number
              </Label>
              <Input
                id="pnr"
                type="text"
                placeholder="e.g., 1234567890"
                value={pnr}
                onChange={(e) => setPnr(e.target.value)}
                maxLength={10}
                className="border-border focus:ring-primary text-lg py-6"
                required
              />
            </div>

            <Button 
              type="submit" 
              size="lg"
              className="w-full bg-secondary hover:bg-secondary-light text-secondary-foreground font-semibold py-6 shadow-md hover:shadow-lg transition-all"
            >
              <Search className="w-5 h-5 mr-2" />
              Track PNR
            </Button>
          </form>

          {pnrStatus && (
            <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="h-px bg-border" />
              
              {/* Train Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Train className="w-6 h-6 text-primary" />
                    <div>
                      <div className="font-semibold text-lg text-foreground">
                        {pnrStatus.trainNumber} - {pnrStatus.trainName}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {pnrStatus.date}
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(pnrStatus.status)}
                </div>

                {/* Journey Route */}
                <div className="flex items-center gap-4 py-4">
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-1">From</div>
                    <div className="font-semibold text-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      {pnrStatus.from}
                    </div>
                  </div>
                  <div className="text-2xl text-muted-foreground">→</div>
                  <div className="flex-1 text-right">
                    <div className="text-sm text-muted-foreground mb-1">To</div>
                    <div className="font-semibold text-foreground flex items-center gap-2 justify-end">
                      {pnrStatus.to}
                      <MapPin className="w-4 h-4 text-secondary" />
                    </div>
                  </div>
                </div>

                {/* Seat Details */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Card className="p-4 bg-muted/50 border-primary/20">
                    <div className="text-sm text-muted-foreground mb-1">Status</div>
                    <div className="font-bold text-lg text-foreground">
                      {pnrStatus.status} {pnrStatus.statusNumber}
                    </div>
                  </Card>
                  <Card className="p-4 bg-muted/50 border-primary/20">
                    <div className="text-sm text-muted-foreground mb-1">Coach</div>
                    <div className="font-bold text-lg text-foreground">{pnrStatus.coach}</div>
                  </Card>
                  <Card className="p-4 bg-muted/50 border-primary/20">
                    <div className="text-sm text-muted-foreground mb-1">Berth</div>
                    <div className="font-bold text-lg text-foreground">{pnrStatus.berth}</div>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
};

export default PNRTracker;
