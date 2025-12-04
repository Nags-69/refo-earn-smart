import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BottomNav from "@/components/BottomNav";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  CheckCircle2, Star, Shield, ArrowRight, Download, 
  Smartphone, Wallet, Users, Trophy, Zap, Clock, 
  CreditCard, Gift, TrendingUp, Sparkles
} from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import ScrollCard from "@/components/ScrollCard";

const Index = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      setShowAuthModal(true);
    }
  };

  const appCategories = [
    { name: "Finance Apps", count: "25+", icon: CreditCard, color: "text-emerald-500" },
    { name: "Gaming Apps", count: "40+", icon: Trophy, color: "text-amber-500" },
    { name: "Shopping Apps", count: "30+", icon: Gift, color: "text-pink-500" },
    { name: "Social Apps", count: "20+", icon: Users, color: "text-blue-500" },
  ];

  const stats = [
    { value: "₹5L+", label: "Total Paid Out" },
    { value: "500+", label: "Happy Users" },
    { value: "100+", label: "Active Offers" },
    { value: "24hrs", label: "Avg Payout Time" },
  ];

  return (
    <>
      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        onSuccess={() => {
          setShowAuthModal(false);
          navigate("/dashboard");
        }}
      />
      
      <AnimatedBackground />
      
      <div className="relative z-10 min-h-screen pb-24">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 py-12">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm px-5 py-2.5 rounded-full border border-border/50 shadow-lg">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium">Join 500+ users earning daily</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tight leading-tight">
              Download.
              <br />
              <span className="bg-gradient-to-r from-primary via-pink-500 to-amber-500 bg-clip-text text-transparent">
                Earn.
              </span>
              <br />
              Repeat.
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Turn your smartphone into a money machine. Download apps, complete simple tasks, 
              and watch your earnings grow. <span className="text-foreground font-medium">No fees. No hassle. Just rewards.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-10 py-7 text-xl font-bold shadow-2xl hover:shadow-primary/25 transition-all hover:scale-105"
              >
                Start Earning Now
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
              <p className="text-sm text-muted-foreground">Free forever • No credit card</p>
            </div>
            
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-3xl mx-auto">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stacked Cards Section */}
        <section className="relative px-4">
          <div className="relative" style={{ height: '300vh' }}>
            {/* Card 1: How It Works */}
            <ScrollCard index={0} totalCards={3}>
              <div className="bg-card/90 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl p-8 md:p-12 lg:p-16">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
                      <Zap className="w-3 h-3 mr-1" />
                      How It Works
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold">
                      Three Simple Steps to
                      <span className="text-primary"> Start Earning</span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      No experience needed. No investment required. Just follow these easy steps 
                      and start making money from your phone today.
                    </p>
                    <Button onClick={handleGetStarted} size="lg" className="rounded-full">
                      Get Started <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    {[
                      {
                        step: "01",
                        icon: Download,
                        title: "Browse & Download",
                        desc: "Explore our curated list of high-paying apps. Pick any offer that interests you and download the app.",
                      },
                      {
                        step: "02",
                        icon: Smartphone,
                        title: "Complete Tasks",
                        desc: "Follow simple instructions like signing up, making a first transaction, or reaching a game level.",
                      },
                      {
                        step: "03",
                        icon: Wallet,
                        title: "Get Paid Instantly",
                        desc: "Upload your proof, get verified within 24 hours, and withdraw to UPI or bank account.",
                      },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 p-4 rounded-2xl bg-background/50 border border-border/30 hover:border-primary/30 transition-colors">
                        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                          <item.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-primary">{item.step}</span>
                            <h3 className="font-semibold text-lg">{item.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollCard>

            {/* Card 2: App Categories */}
            <ScrollCard index={1} totalCards={3}>
              <div className="bg-gradient-to-br from-card/95 via-card/90 to-primary/5 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl p-8 md:p-12 lg:p-16">
                <div className="text-center mb-12">
                  <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 px-4 py-1.5 mb-4">
                    <Trophy className="w-3 h-3 mr-1" />
                    Top Earning Categories
                  </Badge>
                  <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                    100+ Apps Waiting
                    <span className="text-primary"> For You</span>
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    From finance to gaming, shopping to social — earn rewards from apps you'd probably use anyway.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  {appCategories.map((cat, i) => (
                    <div 
                      key={i} 
                      className="group p-6 rounded-2xl bg-background/60 border border-border/30 hover:border-primary/40 hover:shadow-lg transition-all cursor-pointer"
                    >
                      <cat.icon className={`w-10 h-10 ${cat.color} mb-4 group-hover:scale-110 transition-transform`} />
                      <h3 className="font-semibold text-lg mb-1">{cat.name}</h3>
                      <p className="text-2xl font-bold text-primary">{cat.count}</p>
                      <p className="text-xs text-muted-foreground">Active Offers</p>
                    </div>
                  ))}
                </div>

                <div className="bg-background/50 rounded-2xl p-6 md:p-8 border border-border/30">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                      <h3 className="text-2xl font-bold mb-2">Popular Apps Right Now</h3>
                      <p className="text-muted-foreground">
                        PhonePe, Google Pay, Groww, Upstox, Dream11, MPL, Amazon, Flipkart & many more...
                      </p>
                    </div>
                    <Button onClick={handleGetStarted} size="lg" className="rounded-full whitespace-nowrap">
                      View All Offers <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollCard>

            {/* Card 3: Why Choose Us */}
            <ScrollCard index={2} totalCards={3}>
              <div className="bg-card/90 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl p-8 md:p-12 lg:p-16">
                <div className="text-center mb-12">
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-4 py-1.5 mb-4">
                    <Shield className="w-3 h-3 mr-1" />
                    Why Refo
                  </Badge>
                  <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                    Built for
                    <span className="text-primary"> Earners Like You</span>
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    We're not just another rewards app. We're your partner in building a side income stream.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {[
                    {
                      icon: Shield,
                      title: "100% Secure",
                      desc: "Your data is encrypted. We never share your information with third parties.",
                      color: "text-emerald-500",
                    },
                    {
                      icon: Clock,
                      title: "Fast Payouts",
                      desc: "Get paid within 24-48 hours. No minimum waiting period for withdrawals.",
                      color: "text-blue-500",
                    },
                    {
                      icon: CreditCard,
                      title: "Zero Fees",
                      desc: "Keep 100% of your earnings. No hidden charges, no deductions ever.",
                      color: "text-amber-500",
                    },
                    {
                      icon: Users,
                      title: "Refer & Earn",
                      desc: "Invite friends and earn bonus rewards when they complete tasks.",
                      color: "text-pink-500",
                    },
                    {
                      icon: TrendingUp,
                      title: "Track Progress",
                      desc: "Real-time dashboard showing your earnings, tasks, and leaderboard rank.",
                      color: "text-purple-500",
                    },
                    {
                      icon: Gift,
                      title: "Daily Bonuses",
                      desc: "Streak rewards, badges, and surprise bonuses for active users.",
                      color: "text-red-500",
                    },
                  ].map((feature, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-background/50 border border-border/30 hover:border-primary/30 transition-all group">
                      <feature.icon className={`w-8 h-8 ${feature.color} mb-4 group-hover:scale-110 transition-transform`} />
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Badge variant="secondary" className="px-5 py-2.5 text-sm">
                    <Star className="w-4 h-4 text-amber-500 mr-2" />
                    4.9/5 User Rating
                  </Badge>
                  <Badge variant="secondary" className="px-5 py-2.5 text-sm">
                    <Shield className="w-4 h-4 text-emerald-500 mr-2" />
                    Verified Payments
                  </Badge>
                  <Badge variant="secondary" className="px-5 py-2.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 mr-2" />
                    500+ Users Paid
                  </Badge>
                </div>
              </div>
            </ScrollCard>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Ready to Start
              <span className="text-primary"> Earning?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of users who are already making money with Refo. It takes less than 2 minutes to get started.
            </p>
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-12 py-7 text-xl font-bold shadow-2xl hover:shadow-primary/25 transition-all hover:scale-105"
            >
              Create Free Account
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-card/80 backdrop-blur-sm border-t border-border/50">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-heading font-bold">Refo</h3>
                <p className="text-sm text-muted-foreground">
                  India's most trusted rewards platform. Download apps, earn real money.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Secure
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    <Shield className="w-3 h-3 mr-1" />
                    No Fees
                  </Badge>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Platform</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><button onClick={handleGetStarted} className="hover:text-foreground transition-colors">Browse Offers</button></li>
                  <li><button onClick={handleGetStarted} className="hover:text-foreground transition-colors">Dashboard</button></li>
                  <li><button onClick={handleGetStarted} className="hover:text-foreground transition-colors">Leaderboard</button></li>
                  <li><button onClick={handleGetStarted} className="hover:text-foreground transition-colors">Wallet</button></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">FAQs</a></li>
                  <li><button onClick={handleGetStarted} className="hover:text-foreground transition-colors">AI Assistant</button></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Refund Policy</a></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Refo. All rights reserved. Made with ❤️ for earners across India.
              </p>
            </div>
          </div>
        </footer>

        <BottomNav />
      </div>
    </>
  );
};

export default Index;
