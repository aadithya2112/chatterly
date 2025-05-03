"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CopyIcon,
  CheckIcon,
  Loader2,
  ArrowRight,
  MessageSquare,
  Code,
  Globe,
  CheckCircle2,
  Clock,
} from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function CreateWidget() {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState<"api" | "config" | "attribute" | null>(
    null
  );
  const [scriptType, setScriptType] = useState<"config" | "data-attribute">(
    "config"
  );
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  // Function to validate domain with protocol
  const isValidDomain = (domain: string): boolean => {
    const domainRegex =
      /^(https?:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;
    return domainRegex.test(domain);
  };

  const handleCreateWidget = async () => {
    if (!name || !domain) {
      toast.error("Please fill out all fields.");
      return;
    }

    if (!isValidDomain(domain)) {
      toast.error(
        "Please enter a valid domain with the protocol (e.g., https://example.com)."
      );
      return;
    }

    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("You are not logged in. Please log in to continue.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/sites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, domain }),
      });

      const data = await response.json();

      if (data.success) {
        setApiKey(data.apiKey);
        setActiveStep(2);
        toast.success("Widget created successfully!");
      } else {
        toast.error(data.error || "Failed to create widget.");
      }
    } catch (error) {
      console.error("Error creating widget:", error);
      toast.error("An error occurred while creating the widget.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, type: "api" | "config" | "attribute") => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(null), 2000);
    });
  };

  // Get the script URL based on domain
  const getScriptUrl = () => {
    // You can customize this logic based on your deployment strategy
    return "https://widget.chatcraft.com/widget.js";
  };

  // Generate config-style embed code
  const getConfigEmbed = () => {
    return `<script>
  window.ChatWidgetConfig = {
    apiKey: "${apiKey}"
  };
</script>

<script src="${getScriptUrl()}"></script>`;
  };

  // Generate data-attribute style embed code
  const getDataAttributeEmbed = () => {
    return `<script src="${getScriptUrl()}" data-api-key="${apiKey}"></script>`;
  };

  // Widget preview
  const renderWidgetPreview = () => {
    return (
      <div className="relative h-[400px] w-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border">
        <div className="absolute top-0 left-0 right-0 h-8 bg-gray-200 dark:bg-gray-700 flex items-center px-3 gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
          <div className="ml-4 text-xs text-gray-600 dark:text-gray-300">
            {domain || "example.com"}
          </div>
        </div>

        <div className="pt-8 h-full relative">
          {/* Example content */}
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-400 max-w-xs">
              <Globe className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Your website content will appear here</p>
              <p className="text-xs mt-2">
                The chat widget will appear in the bottom right corner
              </p>
            </div>
          </div>

          {/* Chat button */}
          <div className="absolute bottom-4 right-4 h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg flex items-center justify-center z-10 cursor-pointer">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>

          {/* Sample message bubble */}
          <div className="absolute bottom-[72px] right-4 bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4 w-64 cursor-pointer">
            <p className="text-sm font-medium mb-2">👋 Need help?</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Click to chat with our assistant
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Create Widget"
        text="Design and implement your custom AI chat widget."
        badge={activeStep === 2 ? "Widget Created!" : undefined}
      ></DashboardHeader>

      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm text-muted-foreground">
          Creating new widget
        </span>
      </div>

      {activeStep === 1 ? (
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Widget Configuration</CardTitle>
              <CardDescription>
                Set up your widget's basic details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Widget Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Main Website Chat"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    A friendly name to identify this widget in your dashboard
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domain" className="text-sm font-medium">
                    Website Domain
                  </Label>
                  <Input
                    id="domain"
                    placeholder="https://example.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the full URL including https:// or http://
                  </p>
                </div>

                <Separator />

                <div className="pt-2">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                    <h3 className="text-sm font-medium flex items-center text-blue-700 dark:text-blue-400 mb-2">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Default Appearance
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Your widget will use our default appearance settings.
                      Customization options will be available in a future
                      update.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={handleCreateWidget}
                disabled={loading || !name || !domain}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create Widget
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  See how your widget will appear on your website
                </CardDescription>
              </CardHeader>
              <CardContent>{renderWidgetPreview()}</CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                <p>This is a preview of the default widget appearance.</p>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="max-w-md mx-auto">
            <div className="p-8 text-center bg-green-50 dark:bg-green-900/20 rounded-full w-32 h-32 mx-auto mb-6">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">
              Your widget is ready!
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              Follow the steps below to add the chat widget to your website.
            </p>
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm font-normal py-1">
                  Step 1
                </Badge>
                Copy your API key
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Your API Key</Label>
                <div className="flex gap-2">
                  <Input
                    value={apiKey || ""}
                    readOnly
                    className="font-mono text-sm flex-1"
                  />
                  <Button
                    variant="secondary"
                    onClick={() => handleCopy(apiKey!, "api")}
                    className="w-28"
                  >
                    {copied === "api" ? (
                      <>
                        <CheckIcon className="h-4 w-4 mr-2" />
                        Copied
                      </>
                    ) : (
                      <>
                        <CopyIcon className="h-4 w-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Keep this key secure. It authorizes your widget to connect to
                  your account.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm font-normal py-1">
                  Step 2
                </Badge>
                Add the code to your website
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="config"
                onValueChange={(val) => setScriptType(val as any)}
              >
                <TabsList className="mb-4">
                  <TabsTrigger value="config">
                    <Code className="h-4 w-4 mr-2" />
                    Config Method
                  </TabsTrigger>
                  <TabsTrigger value="data-attribute">
                    <Code className="h-4 w-4 mr-2" />
                    Attribute Method
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="config">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">
                          Configuration Object
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Add this code before the closing body tag.
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleCopy(getConfigEmbed(), "config")}
                      >
                        {copied === "config" ? (
                          <CheckIcon className="h-4 w-4 mr-2" />
                        ) : (
                          <CopyIcon className="h-4 w-4 mr-2" />
                        )}
                        {copied === "config" ? "Copied" : "Copy Code"}
                      </Button>
                    </div>
                    <div className="relative rounded-md overflow-hidden">
                      <SyntaxHighlighter
                        language="html"
                        style={atomOneDark}
                        customStyle={{
                          borderRadius: "0.375rem",
                          padding: "1rem",
                          fontSize: "0.875rem",
                          margin: 0,
                        }}
                      >
                        {getConfigEmbed()}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="data-attribute">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Data Attributes</p>
                        <p className="text-sm text-muted-foreground">
                          Add this script tag before the closing body tag.
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleCopy(getDataAttributeEmbed(), "attribute")
                        }
                      >
                        {copied === "attribute" ? (
                          <CheckIcon className="h-4 w-4 mr-2" />
                        ) : (
                          <CopyIcon className="h-4 w-4 mr-2" />
                        )}
                        {copied === "attribute" ? "Copied" : "Copy Code"}
                      </Button>
                    </div>
                    <div className="relative rounded-md overflow-hidden">
                      <SyntaxHighlighter
                        language="html"
                        style={atomOneDark}
                        customStyle={{
                          borderRadius: "0.375rem",
                          padding: "1rem",
                          fontSize: "0.875rem",
                          margin: 0,
                        }}
                      >
                        {getDataAttributeEmbed()}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm font-normal py-1">
                  Step 3
                </Badge>
                Test your widget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">
                  After adding the widget to your website, visit your site to
                  test that the chat widget appears correctly. You can view your
                  widget's performance in your dashboard.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setActiveStep(1)}
                    className="sm:w-auto"
                  >
                    Create Another Widget
                  </Button>
                  <Link href={"/dashboard"}>
                    <Button className="sm:w-auto">Go to Dashboard</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardShell>
  );
}
