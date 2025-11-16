import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone } from "lucide-react";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email("Invalid email format").max(255, "Email too long"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128, "Password too long")
});

const phoneSchema = z.string().regex(/^\+[1-9]\d{1,14}$/, "Invalid phone format (use +country code)");

const otpSchema = z.string().length(6, "OTP must be 6 digits").regex(/^\d{6}$/, "OTP must contain only digits");

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEmailAuth = async (isSignUp: boolean) => {
    try {
      setLoading(true);
      
      // Validate input
      const result = emailSchema.safeParse({ email, password });
      if (!result.success) {
        toast({
          title: "Validation Error",
          description: result.error.errors[0].message,
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (error) throw error;
        toast({
          title: "Success!",
          description: "Check your email to confirm your account.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneAuth = async () => {
    try {
      setLoading(true);
      
      if (!otpSent) {
        // Validate phone number
        const phoneResult = phoneSchema.safeParse(phone);
        if (!phoneResult.success) {
          toast({
            title: "Validation Error",
            description: phoneResult.error.errors[0].message,
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        
        const { error } = await supabase.auth.signInWithOtp({
          phone,
        });
        if (error) throw error;
        setOtpSent(true);
        toast({
          title: "OTP Sent",
          description: "Check your phone for the verification code.",
        });
      } else {
        // Validate OTP
        const otpResult = otpSchema.safeParse(otp);
        if (!otpResult.success) {
          toast({
            title: "Validation Error",
            description: otpResult.error.errors[0].message,
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        
        const { error } = await supabase.auth.verifyOtp({
          phone,
          token: otp,
          type: "sms",
        });
        if (error) throw error;
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-accent to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-primary mb-2">Welcome to Refo</h1>
          <p className="text-muted-foreground">Start earning rewards today</p>
        </div>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="email">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="phone">
              <Phone className="w-4 h-4 mr-2" />
              Mobile OTP
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => handleEmailAuth(false)}
                disabled={loading}
              >
                Sign In
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleEmailAuth(true)}
                disabled={loading}
              >
                Sign Up
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="phone" className="space-y-4">
            {!otpSent ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={handlePhoneAuth}
                  disabled={loading}
                >
                  Send OTP
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={handlePhoneAuth}
                  disabled={loading}
                >
                  Verify OTP
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setOtpSent(false)}
                >
                  Change Number
                </Button>
              </>
            )}
          </TabsContent>
        </Tabs>

      </Card>
    </div>
  );
};

export default Login;
