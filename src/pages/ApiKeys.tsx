import { useState } from "react";
import { useApiKeys, useCreateApiKey, useDeleteApiKey } from "@/services/apiKeys";
import { useToast } from "@/hooks/use-toast";
import { ApiKey } from "@shared/schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useWebhooks, useCreateWebhook, useDeleteWebhook } from "@/services/apiKeys";
import { Webhook } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const apiKeyFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
});

const webhookFormSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  eventType: z.string().min(1, "Event type is required"),
  active: z.boolean().default(true),
});

type ApiKeyFormValues = z.infer<typeof apiKeyFormSchema>;
type WebhookFormValues = z.infer<typeof webhookFormSchema>;

export default function ApiKeys() {
  const { toast } = useToast();
  const [isCreateKeyOpen, setIsCreateKeyOpen] = useState(false);
  const [isCreateWebhookOpen, setIsCreateWebhookOpen] = useState(false);
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  
  const { data: apiKeysData, isLoading: isLoadingApiKeys } = useApiKeys();
  const { mutate: createApiKey, isPending: isCreatingApiKey } = useCreateApiKey();
  const { mutate: deleteApiKey, isPending: isDeletingApiKey } = useDeleteApiKey();
  
  const { data: webhooksData, isLoading: isLoadingWebhooks } = useWebhooks();
  const { mutate: createWebhook, isPending: isCreatingWebhook } = useCreateWebhook();
  const { mutate: deleteWebhook, isPending: isDeletingWebhook } = useDeleteWebhook();

  const apiKeyForm = useForm<ApiKeyFormValues>({
    resolver: zodResolver(apiKeyFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const webhookForm = useForm<WebhookFormValues>({
    resolver: zodResolver(webhookFormSchema),
    defaultValues: {
      url: "",
      eventType: "transaction.created",
      active: true,
    },
  });

  const onCreateApiKey = (data: ApiKeyFormValues) => {
    createApiKey(data, {
      onSuccess: (response) => {
        toast({
          title: "API Key created",
          description: "Your new API key has been created successfully",
        });
        setNewApiKey(response.data?.key);
        apiKeyForm.reset();
      },
      onError: (error) => {
        toast({
          title: "Failed to create API Key",
          description: error.message || "An error occurred",
          variant: "destructive",
        });
      },
    });
  };

  const onDeleteApiKey = (id: number) => {
    if (confirm("Are you sure you want to delete this API key? This action cannot be undone.")) {
      deleteApiKey(id, {
        onSuccess: () => {
          toast({
            title: "API Key deleted",
            description: "The API key has been deleted successfully",
          });
        },
        onError: (error) => {
          toast({
            title: "Failed to delete API Key",
            description: error.message || "An error occurred",
            variant: "destructive",
          });
        },
      });
    }
  };

  const onCreateWebhook = (data: WebhookFormValues) => {
    createWebhook(data, {
      onSuccess: () => {
        toast({
          title: "Webhook created",
          description: "Your new webhook has been created successfully",
        });
        setIsCreateWebhookOpen(false);
        webhookForm.reset();
      },
      onError: (error) => {
        toast({
          title: "Failed to create webhook",
          description: error.message || "An error occurred",
          variant: "destructive",
        });
      },
    });
  };

  const onDeleteWebhook = (id: number) => {
    if (confirm("Are you sure you want to delete this webhook? This action cannot be undone.")) {
      deleteWebhook(id, {
        onSuccess: () => {
          toast({
            title: "Webhook deleted",
            description: "The webhook has been deleted successfully",
          });
        },
        onError: (error) => {
          toast({
            title: "Failed to delete webhook",
            description: error.message || "An error occurred",
            variant: "destructive",
          });
        },
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">API Keys & Webhooks</h1>
      </div>

      <Tabs defaultValue="apikeys" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="apikeys">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="apikeys">
          <div className="mb-4 flex justify-end">
            <Dialog open={isCreateKeyOpen} onOpenChange={setIsCreateKeyOpen}>
              <DialogTrigger asChild>
                <Button className="bg-amber-gold hover:bg-amber-600">
                  Create New API Key
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New API Key</DialogTitle>
                  <DialogDescription>
                    Give your API key a descriptive name to identify its usage.
                  </DialogDescription>
                </DialogHeader>

                {newApiKey ? (
                  <div className="py-4">
                    <p className="mb-2 text-sm text-gray-600">
                      Your new API key has been created. Please copy it now as you won't be able to see it again.
                    </p>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={newApiKey}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(newApiKey);
                          toast({
                            title: "Copied to clipboard",
                            description: "The API key has been copied to your clipboard",
                          });
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Form {...apiKeyForm}>
                    <form onSubmit={apiKeyForm.handleSubmit(onCreateApiKey)} className="space-y-4">
                      <FormField
                        control={apiKeyForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Production API Key" {...field} />
                            </FormControl>
                            <FormDescription>
                              This is how you'll identify this API key in your dashboard.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsCreateKeyOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="bg-amber-gold hover:bg-amber-600"
                          disabled={isCreatingApiKey}
                        >
                          {isCreatingApiKey ? "Creating..." : "Create API Key"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                )}
              </DialogContent>
            </Dialog>
          </div>

          {isLoadingApiKeys ? (
            <div className="flex justify-center items-center py-12">
              <svg
                className="animate-spin h-8 w-8 text-amber-gold"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : !apiKeysData?.data || apiKeysData.data.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">No API keys found. Create your first one.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {apiKeysData.data.map((apiKey: ApiKey) => (
                <Card key={apiKey.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{apiKey.name}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => onDeleteApiKey(apiKey.id)}
                        disabled={isDeletingApiKey}
                      >
                        Delete
                      </Button>
                    </div>
                    <CardDescription>
                      Created on {new Date(apiKey.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="font-mono text-sm text-gray-600">
                        {apiKey.key.substring(0, 8)}...
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2 text-sm">Active</span>
                        <Switch checked={apiKey.active} disabled />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="webhooks">
          <div className="mb-4 flex justify-end">
            <Dialog open={isCreateWebhookOpen} onOpenChange={setIsCreateWebhookOpen}>
              <DialogTrigger asChild>
                <Button className="bg-amber-gold hover:bg-amber-600">
                  Create New Webhook
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Webhook</DialogTitle>
                  <DialogDescription>
                    Add a webhook URL to receive events from your stablecoin wallet.
                  </DialogDescription>
                </DialogHeader>

                <Form {...webhookForm}>
                  <form onSubmit={webhookForm.handleSubmit(onCreateWebhook)} className="space-y-4">
                    <FormField
                      control={webhookForm.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Webhook URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/webhook" {...field} />
                          </FormControl>
                          <FormDescription>
                            The URL where we'll send webhook events.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={webhookForm.control}
                      name="eventType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Type</FormLabel>
                          <FormControl>
                            <select
                              className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-gold focus:border-amber-gold"
                              {...field}
                            >
                              <option value="transaction.created">Transaction Created</option>
                              <option value="transaction.completed">Transaction Completed</option>
                              <option value="transaction.failed">Transaction Failed</option>
                            </select>
                          </FormControl>
                          <FormDescription>
                            Select the event type you want to receive notifications for.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={webhookForm.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Active</FormLabel>
                            <FormDescription>
                              Enable or disable this webhook.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCreateWebhookOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-amber-gold hover:bg-amber-600"
                        disabled={isCreatingWebhook}
                      >
                        {isCreatingWebhook ? "Creating..." : "Create Webhook"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoadingWebhooks ? (
            <div className="flex justify-center items-center py-12">
              <svg
                className="animate-spin h-8 w-8 text-amber-gold"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : !webhooksData?.data || webhooksData.data.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">No webhooks found. Create your first one.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {webhooksData.data.map((webhook: Webhook) => (
                <Card key={webhook.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg break-all">{webhook.url}</CardTitle>
                        <CardDescription>
                          Created on {new Date(webhook.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => onDeleteWebhook(webhook.id)}
                        disabled={isDeletingWebhook}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        {webhook.eventType}
                      </span>
                      <div className="flex items-center">
                        <span className="mr-2 text-sm">Active</span>
                        <Switch checked={webhook.active} disabled />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
