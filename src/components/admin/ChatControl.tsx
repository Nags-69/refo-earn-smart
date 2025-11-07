import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ChatControl = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Chat Control</h2>
      <Card>
        <CardHeader>
          <CardTitle>User Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg mb-2">Chat Control Coming Soon</p>
            <p className="text-sm">
              This section will allow you to view and manage user conversations,
              take over chats, and respond as Refo Assistant.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatControl;
