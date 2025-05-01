"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { toast } from "sonner";

export default function CreateWidget() {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [apiKey, setApiKey] = useState<string | null>(null);

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
    }
  };

  const handleCopy = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey).then(() => {
        toast.success("API Key copied to clipboard!");
      });
    }
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
            <Label htmlFor="name">Widget Name</Label>
            <Input
              id="name"
              placeholder="Main Website Chat"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="domain">Website Domain</Label>
            <Input
              id="domain"
              placeholder="https://example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
          </div>
        </div>
        <Button className="w-full" onClick={handleCreateWidget}>
          Create Widget
        </Button>

        {apiKey && (
          <div className="space-y-6 mt-6 bg-gray-50 p-4 rounded-lg shadow">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Your API Key</Label>
                <div className="flex items-center space-x-2">
                  <Input value={apiKey} readOnly className="flex-1" />
                  <Button variant="outline" onClick={handleCopy}>
                    Copy
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Embed Script</Label>
                <div className="p-3 border rounded bg-gray-100 text-sm">
                  <code>
                    {`<script src="https://example.com/widget.js" data-api-key="${apiKey}"></script>`}
                  </code>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
