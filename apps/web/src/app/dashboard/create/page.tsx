"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyIcon, CheckIcon, Loader2 } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { cn } from "@/lib/utils";

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

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Create Widget"
        text="Easily configure a new chat widget for your website."
      />

      <div className="space-y-6">
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
        </div>

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
            "Create Widget"
          )}
        </Button>

        {apiKey && (
          <div className="space-y-6 mt-6 bg-muted/50 p-6 rounded-lg border">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Your API Key</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(apiKey, "api")}
                    className="h-8"
                  >
                    {copied === "api" ? (
                      <CheckIcon className="h-4 w-4 mr-2" />
                    ) : (
                      <CopyIcon className="h-4 w-4 mr-2" />
                    )}
                    {copied === "api" ? "Copied" : "Copy"}
                  </Button>
                </div>
                <Input value={apiKey} readOnly className="font-mono text-sm" />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Embed Script</Label>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Add this code before the closing body tag.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(getConfigEmbed(), "config")}
                    >
                      {copied === "config" ? (
                        <CheckIcon className="h-4 w-4 mr-2" />
                      ) : (
                        <CopyIcon className="h-4 w-4 mr-2" />
                      )}
                      {copied === "config" ? "Copied" : "Copy"}
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
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
