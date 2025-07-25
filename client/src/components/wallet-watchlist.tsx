import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Bell, TrendingUp, TrendingDown } from "lucide-react";
import { formatAddress } from "@/lib/ethos-client";

interface WatchedWallet {
  id: string;
  name: string;
  address: string;
  trustScore: number;
  change: number;
  avatar: string;
  alertsEnabled: boolean;
}

export function WalletWatchlist() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  
  // Mock watchlist data - in production this would come from the backend
  const [watchlist, setWatchlist] = useState<WatchedWallet[]>([
    {
      id: '1',
      name: '@alice_crypto',
      address: '0x742d35Cc6634C0532925a3b8D427C23e6b82B20d',
      trustScore: 92,
      change: 3,
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64',
      alertsEnabled: true,
    },
    {
      id: '2',
      name: '@bob_defi',
      address: '0x9876543210987654321098765432109876543210',
      trustScore: 67,
      change: -5,
      avatar: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64',
      alertsEnabled: true,
    },
  ]);

  const toggleWalletAlerts = (id: string) => {
    setWatchlist(prev => prev.map(wallet => 
      wallet.id === id 
        ? { ...wallet, alertsEnabled: !wallet.alertsEnabled }
        : wallet
    ));
  };

  return (
    <section className="mb-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Watchlist</h3>
            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Wallet
            </Button>
          </div>
          
          {/* Add Wallet Form */}
          {showAddForm && (
            <div className="mb-4 p-4 border rounded-lg space-y-3">
              <Input placeholder="Enter wallet address or handle" />
              <div className="flex space-x-2">
                <Button size="sm">Add to Watchlist</Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          {/* Watchlist Items */}
          <div className="space-y-3">
            {watchlist.map((wallet) => (
              <div 
                key={wallet.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-xl hover:bg-muted/70 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={wallet.avatar} alt={wallet.name} />
                    <AvatarFallback>
                      {wallet.name.slice(1, 3).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{wallet.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatAddress(wallet.address)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">
                      {wallet.trustScore}
                    </div>
                    <div className={`text-xs flex items-center ${
                      wallet.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {wallet.change > 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {wallet.change > 0 ? '+' : ''}{wallet.change}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 ${
                      wallet.alertsEnabled ? 'text-orange-500' : 'text-muted-foreground'
                    }`}
                    onClick={() => toggleWalletAlerts(wallet.id)}
                  >
                    <Bell className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Alert Settings */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                Smart Alerts
              </span>
              <Switch
                checked={alertsEnabled}
                onCheckedChange={setAlertsEnabled}
              />
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-400">
              Get notified when trust scores change by ±5 points
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
