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

        {/* Stacked Cards Section - How It Works */}
        <section className="relative px-4 pb-16">
          <div className="text-center mb-8">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 mb-4">
              <Zap className="w-3 h-3 mr-1" />
              How It Works
            </Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold">
              Three Simple Steps
            </h2>
          </div>

          {/* Step 1 */}
          <div className="h-[80vh]">
            <ScrollCard index={0}>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-3xl border border-blue-100 dark:border-blue-900/50 shadow-xl overflow-hidden">
                <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 items-center min-h-[400px]">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
                        01
                      </div>
                      <span className="text-sm font-medium tracking-widest text-blue-600 dark:text-blue-400">STEP</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
                      Browse & Download
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Explore our curated list of high-paying apps. Pick any offer that interests you and download the app directly from Play Store.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-500" />
                        <span className="text-foreground">100+ Verified Offers</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-500" />
                        <span className="text-foreground">Direct Play Store Links</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-500" />
                        <span className="text-foreground">Clear Reward Information</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-40 h-40 md:w-56 md:h-56 rounded-3xl bg-blue-500 flex items-center justify-center shadow-2xl">
                      <Download className="w-20 h-20 md:w-28 md:h-28 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollCard>
          </div>

          {/* Step 2 */}
          <div className="h-[80vh]">
            <ScrollCard index={1}>
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-3xl border border-emerald-100 dark:border-emerald-900/50 shadow-xl overflow-hidden">
                <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 items-center min-h-[400px]">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg">
                        02
                      </div>
                      <span className="text-sm font-medium tracking-widest text-emerald-600 dark:text-emerald-400">STEP</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
                      Complete Tasks
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Follow the simple instructions provided for each offer. Tasks include signing up, making a first transaction, or reaching a game level.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span className="text-foreground">Easy Step-by-Step Guide</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span className="text-foreground">No Special Skills Needed</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span className="text-foreground">Quick Completion Time</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-40 h-40 md:w-56 md:h-56 rounded-3xl bg-emerald-500 flex items-center justify-center shadow-2xl">
                      <Smartphone className="w-20 h-20 md:w-28 md:h-28 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollCard>
          </div>

          {/* Step 3 */}
          <div className="h-[80vh]">
            <ScrollCard index={2}>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-3xl border border-purple-100 dark:border-purple-900/50 shadow-xl overflow-hidden">
                <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 items-center min-h-[400px]">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-lg">
                        03
                      </div>
                      <span className="text-sm font-medium tracking-widest text-purple-600 dark:text-purple-400">STEP</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
                      Get Paid Instantly
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Once your task is verified, the reward is instantly credited to your Refo wallet. Withdraw your earnings via UPI, Bank Transfer, or Gift Cards starting from just ₹50.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-purple-500" />
                        <span className="text-foreground">Instant Withdrawals</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-purple-500" />
                        <span className="text-foreground">Multiple Payment Methods</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-purple-500" />
                        <span className="text-foreground">Low Minimum Payout</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-40 h-40 md:w-56 md:h-56 rounded-3xl bg-purple-500 flex items-center justify-center shadow-2xl">
                      <CreditCard className="w-20 h-20 md:w-28 md:h-28 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollCard>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-4 py-1.5 mb-4">
                <Shield className="w-3 h-3 mr-1" />
                Why Refo
              </Badge>
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                Built for
                <span className="text-primary"> Earners Like You</span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Shield, title: "100% Secure", desc: "Your data is encrypted. We never share your information.", color: "text-emerald-500" },
                { icon: Clock, title: "Fast Payouts", desc: "Get paid within 24-48 hours. No waiting period.", color: "text-blue-500" },
                { icon: CreditCard, title: "Zero Fees", desc: "Keep 100% of your earnings. No hidden charges.", color: "text-amber-500" },
                { icon: Users, title: "Refer & Earn", desc: "Invite friends and earn bonus rewards.", color: "text-pink-500" },
                { icon: TrendingUp, title: "Track Progress", desc: "Real-time dashboard showing your earnings.", color: "text-purple-500" },
                { icon: Gift, title: "Daily Bonuses", desc: "Streak rewards and surprise bonuses.", color: "text-red-500" },
              ].map((feature, i) => (
                <div key={i} className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all group">
                  <feature.icon className={`w-8 h-8 ${feature.color} mb-4 group-hover:scale-110 transition-transform`} />
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
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
