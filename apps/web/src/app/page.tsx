import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  MessageSquare,
  CheckCircle,
  BarChart2,
  Settings,
  Zap,
  LayoutDashboard,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { AuthButtons } from "@/components/auth-button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="container mx-auto px-6 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-500 to-violet-500 p-1 rounded-md">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
              Chatterly
            </span>
          </div>
          <AuthButtons />
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-50 to-violet-50 dark:from-background dark:via-background dark:to-purple-900/10 -z-10"></div>
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-blue-400/10 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-purple-400/10 blur-3xl"></div>
          <div className="absolute top-1/3 right-1/3 w-40 h-40 rounded-full bg-pink-400/10 blur-3xl"></div>

          <div className="container mx-auto px-6 py-20 md:py-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col space-y-8">
                <div>
                  <span className="inline-block font-medium text-sm px-4 py-1 rounded-full bg-blue-100 text-blue-700 mb-6">
                    Intelligent Customer Support
                  </span>
                  <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
                    Engage Visitors with{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                      Smart Chat
                    </span>{" "}
                    Widgets
                  </h1>
                  <p className="text-xl text-muted-foreground mb-8 max-w-lg">
                    Create customizable AI-powered chat widgets that connect
                    with your users 24/7. Gain valuable insights through our
                    advanced analytics dashboard.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/sign-up">
                    <Button
                      size="lg"
                      className="gap-2 text-md px-8 font-medium bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 border-0"
                    >
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button
                      size="lg"
                      variant="outline"
                      className="gap-2 text-md font-medium border-blue-400 text-blue-700 dark:text-blue-400"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-6 flex-wrap">
                  <p className="text-sm font-medium flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> No
                    credit card required
                  </p>
                  <p className="text-sm font-medium flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Free
                    tier available
                  </p>
                  <p className="text-sm font-medium flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> 24/7
                    support
                  </p>
                </div>
              </div>

              <div className="relative hidden md:block">
                <div className="absolute -left-10 -top-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-violet-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>

                <div className="bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 border rounded-xl shadow-2xl p-5 max-w-md mx-auto relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <div className="bg-gradient-to-r from-blue-500 to-violet-500 p-1 rounded-md w-8 h-8 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-semibold">Chatterly</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-xs text-muted-foreground">
                        Online
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-950/50 p-3 rounded-lg rounded-tl-none max-w-[80%] border-l-4 border-blue-400">
                      <p>How can I help with your website today?</p>
                    </div>
                    <div className="bg-violet-50 dark:bg-violet-950/50 p-3 rounded-lg rounded-tr-none max-w-[80%] ml-auto border-r-4 border-violet-400">
                      <p>I'd like to know more about your pricing plans</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950/50 p-3 rounded-lg rounded-tl-none max-w-[90%] border-l-4 border-blue-400">
                      <p>
                        Of course! We offer three plans: Basic ($29/mo), Pro
                        ($79/mo), and Enterprise (custom). The Basic plan
                        includes up to 500 chats/month and basic analytics.
                        Would you like me to explain the features of each plan?
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 relative">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="w-full rounded-full border px-4 py-3 pr-12 dark:bg-gray-700/50"
                      disabled
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-violet-500 text-white p-1 rounded-full">
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                POWERFUL FEATURES
              </span>
              <h2 className="text-3xl font-bold mt-3 mb-4">
                Everything You Need for Modern Support
              </h2>
              <p className="text-lg text-muted-foreground">
                Our widgets come with everything you need to provide excellent
                customer support and boost conversions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-blue-100 dark:border-blue-900 transition-all duration-300 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-14 h-14 flex items-center justify-center rounded-lg mb-6 shadow-md shadow-blue-200 dark:shadow-blue-900/30">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">AI-Powered Responses</h3>
                <p className="text-muted-foreground">
                  Automate responses to common questions with our intelligent
                  AI.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-teal-100 dark:border-teal-900 transition-all duration-300 hover:shadow-md hover:border-teal-300 dark:hover:border-teal-700">
                <div className="bg-gradient-to-r from-teal-500 to-teal-600 w-14 h-14 flex items-center justify-center rounded-lg mb-6 shadow-md shadow-teal-200 dark:shadow-teal-900/30">
                  <BarChart2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Detailed Analytics</h3>
                <p className="text-muted-foreground">
                  Track conversation metrics, user satisfaction, and identify
                  opportunities for improvement.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-amber-100 dark:border-amber-900 transition-all duration-300 hover:shadow-md hover:border-amber-300 dark:hover:border-amber-700">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 w-14 h-14 flex items-center justify-center rounded-lg mb-6 shadow-md shadow-amber-200 dark:shadow-amber-900/30">
                  <LayoutDashboard className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Unified Dashboard</h3>
                <p className="text-muted-foreground">
                  Manage all your chats in one place with our intuitive
                  dashboard that works across all your devices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="py-20 bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950/20 dark:to-violet-950/20"
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-violet-600 dark:text-violet-400 font-semibold">
                SIMPLE PROCESS
              </span>
              <h2 className="text-3xl font-bold mt-3 mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get up and running with ChatWidget in minutes, not hours
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connection lines for desktop */}
              <div className="hidden md:block absolute top-24 left-1/3 right-1/3 h-1 bg-gradient-to-r from-blue-400 to-violet-400"></div>

              <div className="relative bg-white dark:bg-gray-800 p-8 rounded-xl border shadow-md">
                <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-200 dark:shadow-blue-900/30 z-10">
                  1
                </div>
                <div className="pt-7">
                  <h3 className="text-xl font-bold mt-4 mb-3 text-center">
                    Create a Widget
                  </h3>
                  <p className="text-muted-foreground text-center">
                    Set up your chat widget with custom colors, messages, and AI
                    integration through our intuitive dashboard.
                  </p>
                </div>
              </div>

              <div className="relative bg-white dark:bg-gray-800 p-8 rounded-xl border shadow-md">
                <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-violet-500 to-violet-600 text-white w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-violet-200 dark:shadow-violet-900/30 z-10">
                  2
                </div>
                <div className="pt-7">
                  <h3 className="text-xl font-bold mt-4 mb-3 text-center">
                    Embed on Your Site
                  </h3>
                  <p className="text-muted-foreground text-center">
                    Add our lightweight script to your website with a simple
                    copy-paste. No coding knowledge required.
                  </p>
                </div>
              </div>

              <div className="relative bg-white dark:bg-gray-800 p-8 rounded-xl border shadow-md">
                <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-teal-500 to-teal-600 text-white w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-teal-200 dark:shadow-teal-900/30 z-10">
                  3
                </div>
                <div className="pt-7">
                  <h3 className="text-xl font-bold mt-4 mb-3 text-center">
                    Monitor Conversations
                  </h3>
                  <p className="text-muted-foreground text-center">
                    Track user interactions, analyze patterns, and optimize your
                    responses through the comprehensive dashboard.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16 text-center">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 border-0"
                >
                  Start Building Your Widget <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-violet-500/10 -z-10"></div>
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-violet-400/10 rounded-full blur-3xl"></div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-blue-100 dark:border-blue-900">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-6 py-2 rounded-full font-medium shadow-md">
                Ready to Get Started?
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mt-6 mb-6">
                Transform Your Customer Interactions Today
              </h2>
              <p className="text-lg mb-8 text-muted-foreground">
                Start engaging with your website visitors in a more meaningful
                way.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    className="gap-2 px-8 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 border-0"
                  >
                    Get Started for Free <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                {/* <Link href="/pricing">
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400"
                  >
                    View Pricing Plans
                  </Button>
                </Link> */}
              </div>
              <p className="mt-6 text-sm text-muted-foreground flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                No credit card required. Free plan available with basic
                features.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-900 pt-16 pb-8 border-t border-blue-100 dark:border-blue-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-violet-500 p-1 rounded-md">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                  ChatWidget
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Intelligent chat solutions for modern websites. Transform your
                customer support today.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-blue-800 dark:text-blue-300">
                Product
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/features"
                    className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/documentation"
                    className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-violet-800 dark:text-violet-300">
                Legal
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/privacy"
                    className="text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-100 dark:border-blue-900 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 ChatWidget. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
