import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            <span className="text-xl font-bold">ChatWidget</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Embed Chat Widgets on Your Website
            </h1>
            <p className="text-xl text-muted-foreground max-w-[800px] mb-8">
              Create customizable chat widgets that connect your users with
              AI-powered responses. Monitor conversations and gain insights
              through our analytics dashboard.
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
        <section className="py-20 bg-muted">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-lg">
                <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Create a Widget</h3>
                <p className="text-muted-foreground">
                  Set up your chat widget with custom colors, messages, and AI
                  integration.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg">
                <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Embed on Your Site</h3>
                <p className="text-muted-foreground">
                  Add a simple script tag to your website to display the chat
                  widget.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg">
                <div className="bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Monitor Conversations
                </h3>
                <p className="text-muted-foreground">
                  Track user interactions and gain insights through the
                  dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <span className="font-semibold">ChatWidget</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 ChatWidget. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
