import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Star, Shield, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import OfferCard from "@/components/OfferCard";
import BottomNav from "@/components/BottomNav";

const Index = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkAuth();
    loadOffers();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setIsLoggedIn(true);
      navigate("/dashboard");
    }
  };

  const loadOffers = async () => {
    const { data } = await supabase
      .from("offers")
      .select("*")
      .eq("is_public", true)
      .eq("status", "active")
      .limit(10);
    
    if (data) setOffers(data);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent to-secondary">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-sm font-medium">500+ users already paid</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight">
              Download apps.
              <br />
              <span className="text-primary">Earn rewards.</span>
              <br />
              Simple.
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Complete simple tasks, earn real money. No hidden fees, no hassle.
            </p>
            
            <Button
              size="lg"
              onClick={() => navigate("/login")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            {/* Trust Chips */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Badge variant="secondary" className="px-4 py-2">
                <Star className="w-4 h-4 text-primary mr-1" />
                4.9/5 Rating
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Shield className="w-4 h-4 text-success mr-1" />
                No Fees
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <CheckCircle2 className="w-4 h-4 text-success mr-1" />
                500+ Paid Users
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Top Offers Section */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-heading font-bold mb-2">Top Offers</h2>
          <p className="text-muted-foreground">Start earning with these popular offers</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {offers.length > 0 ? (
            offers.map((offer: any) => (
              <OfferCard
                key={offer.id}
                title={offer.title}
                description={offer.description}
                logoUrl={offer.logo_url}
                reward={offer.reward}
                category={offer.category}
                onStartTask={() => navigate("/login")}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No offers available at the moment
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/50 mt-12 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">About</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">FAQ</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            © 2025 Refo. All rights reserved.
          </p>
        </div>
      </footer>

      {isLoggedIn && <BottomNav />}
    </div>
  );
};

export default Index;
