import { useState } from 'react';
import { Api, type PnrResponse } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Search, Clock, MapPin as MapPinIcon, Bell } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const TrackPNR = () => {
  const navigate = useNavigate();
  const [pnr, setPnr] = useState('');
  const [status, setStatus] = useState<PnrResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pnr.length !== 10) {
      toast.error("Invalid PNR", {
        description: "Please enter a valid 10-digit PNR number"
      });
      return;
    }
    
    setLoading(true);
    setError('');
    setStatus(null);
    try {
      const data = await Api.pnr(pnr);
      setStatus(data);
      toast.success("PNR Status Retrieved", { description: "Your ticket status has been updated" });
    } catch (e: any) {
      setError('Failed to fetch PNR details');
    } finally {
      setLoading(false);
    }
  };

  const handleEnableNotifications = async () => {
    const recipient = window.prompt('Enter your email or phone for alerts');
    if (!recipient) return;
    try {
      const channel = recipient.includes('@') ? 'email' : 'sms';
      await Api.notify({
        channel,
        recipient,
        message: `Subscribe PNR ${pnr}`,
        // extra fields for subscription creation
        // @ts-ignore - backend will accept these extra fields
        subscribe: true,
        // @ts-ignore
        pnr,
        // Optional threshold example (comment out if not needed)
        // threshold: 0.8,
      } as any);
      toast.success('Notifications Enabled', { description: 'You will be notified on updates.' });
    } catch (e) {
      toast.error('Failed to enable notifications');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-foreground hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Track Your PNR Status
            </h1>
            <p className="text-lg text-muted-foreground">
              Get real-time updates on your train ticket confirmation status
            </p>
          </div>

          <Card className="p-8 bg-gradient-card shadow-lg border-primary/10">
            <form onSubmit={handleTrack} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="pnr" className="text-foreground font-medium flex items-center gap-2">
                  <Search className="w-4 h-4 text-primary" />
                  PNR Number
                </Label>
                <Input
                  id="pnr"
                  type="text"
                  value={pnr}
                  onChange={(e) => setPnr(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit PNR"
                  className="border-border focus:ring-primary text-lg"
                  maxLength={10}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Enter the 10-digit PNR number from your ticket
                </p>
              </div>

              <Button 
                type="submit" 
                size="lg"
                disabled={loading}
                className="w-full bg-secondary hover:bg-secondary-light text-secondary-foreground font-semibold py-6 shadow-md hover:shadow-lg transition-all"
              >
                <Search className="w-5 h-5 mr-2" />
                {loading ? 'Tracking...' : 'Track PNR Status'}
              </Button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                {error}
              </div>
            )}

            {status && (
              <div className="mt-8 space-y-6">
                <div className="p-6 bg-card border border-border rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-foreground font-semibold">Current Status:</span>
                    <span className="text-2xl font-bold text-secondary">{status.current_status}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Coach/Berth</p>
                        <p className="font-semibold text-foreground">{status.coach}/{status.berth}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Last Update</p>
                        <p className="font-semibold text-foreground">{status.history?.[status.history.length-1]?.time}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-card border border-border rounded-lg shadow-sm">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Status History
                  </h3>
                  <ul className="space-y-2">
                    {status.history.map((h, i) => (
                      <li key={i} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                        <span className="text-foreground font-medium">{h.status}</span>
                        <span className="text-sm text-muted-foreground">{h.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  onClick={handleEnableNotifications}
                  className="w-full bg-success hover:bg-success/90 text-success-foreground"
                  size="lg"
                >
                  <Bell className="w-5 h-5 mr-2" />
                  Enable Notifications
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TrackPNR;
