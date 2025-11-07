import { useState } from "react";
import { LayoutDashboard, Package, Users, CreditCard, MessageSquare, Settings } from "lucide-react";
import Overview from "@/components/admin/Overview";
import OffersManagement from "@/components/admin/OffersManagement";
import ReferralsManagement from "@/components/admin/ReferralsManagement";
import PayoutsManagement from "@/components/admin/PayoutsManagement";
import ChatControl from "@/components/admin/ChatControl";
import AdminSettings from "@/components/admin/AdminSettings";

type AdminSection = "overview" | "offers" | "referrals" | "payouts" | "chat" | "settings";

const Admin = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");

  const sections = [
    { id: "overview" as AdminSection, label: "Overview", icon: LayoutDashboard },
    { id: "offers" as AdminSection, label: "Offers", icon: Package },
    { id: "referrals" as AdminSection, label: "Referrals", icon: Users },
    { id: "payouts" as AdminSection, label: "Payouts", icon: CreditCard },
    { id: "chat" as AdminSection, label: "Chat Control", icon: MessageSquare },
    { id: "settings" as AdminSection, label: "Settings", icon: Settings },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <Overview />;
      case "offers":
        return <OffersManagement />;
      case "referrals":
        return <ReferralsManagement />;
      case "payouts":
        return <PayoutsManagement />;
      case "chat":
        return <ChatControl />;
      case "settings":
        return <AdminSettings />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile tabs */}
      <div className="md:hidden sticky top-0 z-10 bg-card border-b border-border">
        <div className="flex overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap transition-colors ${
                activeSection === section.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground"
              }`}
            >
              <section.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop layout */}
      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-64 min-h-screen bg-card border-r border-border">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-primary">Refo Admin</h1>
          </div>
          <nav className="px-3 space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  activeSection === section.id
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <section.icon className="h-5 w-5" />
                <span className="font-medium">{section.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">{renderSection()}</div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
