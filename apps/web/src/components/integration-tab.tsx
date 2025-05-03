import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { WidgetDetails } from "@/app/dashboard/widget/[id]/page";

interface IntegrationTabProps {
  widget: WidgetDetails;
}

export function IntegrationTab({ widget }: IntegrationTabProps) {
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [scriptCopied, setScriptCopied] = useState(false);

  const copyApiKey = () => {
    if (widget?.apiKey) {
      navigator.clipboard.writeText(widget.apiKey);
      setApiKeyCopied(true);
      toast.success("API key copied to clipboard!");
      setTimeout(() => setApiKeyCopied(false), 2000);
    }
  };

  const copyScript = () => {
    const script = getEmbedCode();
    navigator.clipboard.writeText(script);
    setScriptCopied(true);
    toast.success("Installation code copied to clipboard!");
    setTimeout(() => setScriptCopied(false), 2000);
  };

  const getEmbedCode = () => {
    return `<script>
  window.ChatWidgetConfig = {
    apiKey: "${widget.apiKey}"
  };
</script>

<script src="https://cdn.chatwidget.com/embed.js"></script>`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Widget Integration</CardTitle>
        <CardDescription>
          Integration code and settings for your chat widget
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">API Key</Label>
            <Button variant="outline" size="sm" onClick={copyApiKey}>
              {apiKeyCopied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <div className="rounded-md bg-muted p-3">
            <code className="text-sm font-mono">{widget.apiKey}</code>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Installation Code</Label>
            <Button variant="outline" size="sm" onClick={copyScript}>
              {scriptCopied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Code
                </>
              )}
            </Button>
          </div>
          <div className="rounded-md overflow-hidden">
            <SyntaxHighlighter
              language="html"
              style={atomOneDark}
              customStyle={{
                margin: 0,
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
              }}
            >
              {getEmbedCode()}
            </SyntaxHighlighter>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Add this code before the closing body tag of your HTML.
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
          <h3 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">
            Implementation Guide
          </h3>
          <ol className="text-sm text-muted-foreground list-decimal pl-5 space-y-1">
            <li>Copy the installation code above</li>
            <li>
              Paste it just before the closing{" "}
              <code className="bg-muted px-1 py-0.5 rounded">
                &lt;/body&gt;
              </code>{" "}
              tag in your HTML
            </li>
            <li>The widget will automatically appear on your website</li>
            <li>
              Conversations and user data will be collected in this dashboard
            </li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
