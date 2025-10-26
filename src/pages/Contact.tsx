import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message Sent!", {
      description: "We'll get back to you within 24 hours."
    });
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Get In <span className="text-secondary">Touch</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Info Cards */}
            <Card className="p-6 bg-gradient-card shadow-lg border-primary/10 hover:shadow-xl transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Email Us</h3>
                <p className="text-muted-foreground mb-2">Our team is here to help</p>
                <a href="mailto:support@railpredict.ai" className="text-secondary hover:text-secondary-light font-medium">
                  support@railpredict.ai
                </a>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-lg border-primary/10 hover:shadow-xl transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-secondary/10 rounded-full mb-4">
                  <Phone className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Call Us</h3>
                <p className="text-muted-foreground mb-2">Mon-Fri from 8am to 8pm</p>
                <a href="tel:+911234567890" className="text-secondary hover:text-secondary-light font-medium">
                  +91 123-456-7890
                </a>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-lg border-primary/10 hover:shadow-xl transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Visit Us</h3>
                <p className="text-muted-foreground mb-2">Come say hello at our office</p>
                <p className="text-secondary font-medium">
                  Mumbai, India
                </p>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="p-8 bg-gradient-card shadow-lg border-primary/10">
            <h2 className="text-3xl font-bold text-foreground mb-6 text-center">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="border-border focus:ring-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="border-border focus:ring-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 1234567890"
                    className="border-border focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-foreground font-medium">
                    Subject *
                  </Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="How can we help?"
                    className="border-border focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-foreground font-medium">
                  Message *
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us more about your inquiry..."
                  className="border-border focus:ring-primary min-h-[150px]"
                  required
                />
              </div>

              <Button 
                type="submit"
                size="lg"
                className="w-full bg-secondary hover:bg-secondary-light text-secondary-foreground font-semibold py-6 shadow-md hover:shadow-lg transition-all"
              >
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
