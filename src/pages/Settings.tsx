import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/hooks/use-theme";

const businessProfileSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  email: z.string().email("Please enter a valid email"),
  billingContact: z.string().min(1, "Billing contact is required"),
});

const solanaWalletSchema = z.object({
  walletAddress: z.string()
    .min(32, "Solana wallet address must be at least 32 characters")
    .max(44, "Solana wallet address cannot exceed 44 characters")
    .regex(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, "Invalid Solana wallet address format"),
});

type BusinessProfileFormValues = z.infer<typeof businessProfileSchema>;
type SolanaWalletFormValues = z.infer<typeof solanaWalletSchema>;

export default function Settings() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [isWithdrawalEnabled, setIsWithdrawalEnabled] = useState(false);
  
  // Business profile form
  const businessProfileForm = useForm<BusinessProfileFormValues>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      companyName: "Acme Corporation",
      email: "admin@acmecorp.com",
      billingContact: "John Doe (finance@acmecorp.com)",
    },
  });

  // Solana wallet form
  const solanaWalletForm = useForm<SolanaWalletFormValues>({
    resolver: zodResolver(solanaWalletSchema),
    defaultValues: {
      walletAddress: "",
    },
  });

  const onSaveBusinessProfile = (data: BusinessProfileFormValues) => {
    toast({
      title: "Business profile updated",
      description: "Your business profile information has been updated successfully.",
    });
  };

  const onSaveSolanaWallet = (data: SolanaWalletFormValues) => {
    toast({
      title: "Withdrawal wallet saved",
      description: "Your Solana wallet address has been saved successfully.",
    });
    setIsWithdrawalEnabled(true);
  };

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="profile" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Business Profile</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="withdrawal">Withdrawal Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Business Profile</CardTitle>
              <CardDescription>
                Manage your business information and contact details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...businessProfileForm}>
                <form onSubmit={businessProfileForm.handleSubmit(onSaveBusinessProfile)} className="space-y-4">
                  <FormField
                    control={businessProfileForm.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={businessProfileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter business email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={businessProfileForm.control}
                    name="billingContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Billing Contact</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter billing contact" {...field} />
                        </FormControl>
                        <FormDescription>
                          Name and email for billing-related communications.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="mt-4 bg-amber-gold hover:bg-amber-600">
                    Save Changes
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="text-lg font-medium">Dark Mode</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Toggle between light and dark themes
                  </p>
                </div>
                <Switch 
                  checked={theme === "dark"} 
                  onCheckedChange={handleThemeChange} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawal">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Settings</CardTitle>
              <CardDescription>
                Configure your Solana wallet address for stablecoin withdrawals.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...solanaWalletForm}>
                <form onSubmit={solanaWalletForm.handleSubmit(onSaveSolanaWallet)} className="space-y-4">
                  <FormField
                    control={solanaWalletForm.control}
                    name="walletAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Solana Wallet Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your Solana wallet address" {...field} />
                        </FormControl>
                        <FormDescription>
                          This wallet address will be used for all on-chain withdrawals from your stablecoin balance.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="pt-4">
                    <Button type="submit" className="bg-amber-gold hover:bg-amber-600">
                      Save Wallet Address
                    </Button>
                  </div>
                </form>
              </Form>

              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Enable Withdrawals</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Toggle to enable or disable on-chain withdrawals
                    </p>
                  </div>
                  <Switch 
                    checked={isWithdrawalEnabled} 
                    onCheckedChange={setIsWithdrawalEnabled} 
                    disabled={!solanaWalletForm.getValues().walletAddress}
                  />
                </div>
                {!solanaWalletForm.getValues().walletAddress && (
                  <p className="text-sm text-amber-600 mt-2">
                    You must set a valid Solana wallet address before enabling withdrawals.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}