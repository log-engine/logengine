"use client"

import React from 'react'
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Check, Github, Zap, Shield, Database, Activity, Code2, Cloud, Server, Terminal, ArrowRight, Star } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />

        <div className="container relative mx-auto px-4 py-32 md:py-40">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col items-center text-center gap-8">
              {/* Badge */}
              <Badge variant="outline" className="border-primary/50 bg-primary/10 text-primary px-4 py-1.5 text-sm font-medium">
                <Terminal className="h-3 w-3 mr-2 inline" />
                Open Source • Self-Hosted • Production Ready
              </Badge>

              {/* Main Title */}
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                  Log Management
                </span>
                <br />
                <span className="text-primary">for Developers</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
                High-performance centralized logging with <span className="text-primary font-semibold">gRPC</span>, <span className="text-primary font-semibold">RabbitMQ</span>, and <span className="text-primary font-semibold">PostgreSQL</span>.
                Self-host or use our cloud. No vendor lock-in.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Button size="lg" className="text-lg px-8 h-14 bg-primary hover:bg-primary/90 group">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 h-14 border-primary/30 hover:border-primary hover:bg-primary/5" asChild>
                  <Link href="https://github.com/log-engine/logengine" target="_blank">
                    <Star className="mr-2 h-5 w-5" />
                    Star on GitHub
                  </Link>
                </Button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Usage Section */}
      <section className="py-32 border-b">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4">Simple Integration</Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Start Logging in <span className="text-primary">3 Lines</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Available for TypeScript, Go, Python, and more. Install, configure, log.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Languages Grid - 2x2 grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* TypeScript */}
              <Card className="p-6 border-primary/20 bg-card/50 hover:border-primary/50 transition-all">
                <div className="mb-4">
                  <h3 className="text-xl font-bold">TypeScript / JavaScript</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Install</div>
                    <div className="bg-muted/80 p-3 rounded-lg font-mono text-xs">
                      npm install @logengine/engine
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Usage</div>
                    <div className="bg-muted/80 p-3 rounded-lg font-mono text-xs">
                      <div><span className="text-primary">import</span> {'{ createPlatformLogger }'} <span className="text-primary">from</span> <span className="text-amber-500">&quot;@logengine/engine&quot;</span></div>
                      <div className="mt-2">
                        <div>const appLog = createPlatformLogger{'({'}</div>
                        <div className="pl-2">host: <span className="text-amber-500">&quot;grpc.logengine.io&quot;</span>,</div>
                        <div className="pl-2">apiKey: <span className="text-amber-500">&quot;your-api-key&quot;</span></div>
                        <div>{'})'}</div>
                      </div>
                      <div className="mt-2">appLog.<span className="text-primary">info</span>(<span className="text-amber-500">&quot;Hello&quot;</span>)</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Go */}
              <Card className="p-6 border-primary/20 bg-card/50 hover:border-primary/50 transition-all">
                <div className="mb-4">
                  <h3 className="text-xl font-bold">Go</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Install</div>
                    <div className="bg-muted/80 p-3 rounded-lg font-mono text-xs">
                      go get github.com/logengine/sdk
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Usage</div>
                    <div className="bg-muted/80 p-3 rounded-lg font-mono text-xs">
                      <div><span className="text-primary">import</span> <span className="text-amber-500">&quot;github.com/logengine/sdk&quot;</span></div>
                      <div className="mt-2">
                        <div>appLog := sdk.CreatePlateformLogger(</div>
                        <div className="pl-2"><span className="text-amber-500">&quot;grpc.logengine.io&quot;</span>,</div>
                        <div className="pl-2"><span className="text-amber-500">&quot;xxx&quot;</span></div>
                        <div>)</div>
                      </div>
                      <div className="mt-2">appLog.<span className="text-primary">Info</span>(<span className="text-amber-500">&quot;Hello&quot;</span>)</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Python */}
              <Card className="p-6 border-primary/20 bg-card/50 hover:border-primary/50 transition-all">
                <div className="mb-4">
                  <h3 className="text-xl font-bold">Python</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Install</div>
                    <div className="bg-muted/80 p-3 rounded-lg font-mono text-xs">
                      pip install logengine-sdk
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Usage</div>
                    <div className="bg-muted/80 p-3 rounded-lg font-mono text-xs">
                      <div><span className="text-primary">from</span> logengine <span className="text-primary">import</span> create_plateform_logger</div>
                      <div className="mt-2">
                        <div>app_log = create_plateform_logger(</div>
                        <div className="pl-2"><span className="text-amber-500">&quot;grpc.logengine.io&quot;</span>,</div>
                        <div className="pl-2"><span className="text-amber-500">&quot;your-aki-key&quot;</span></div>
                        <div>)</div>
                      </div>
                      <div className="mt-2">app_log.<span className="text-primary">info</span>(<span className="text-amber-500">&quot;Hello&quot;</span>)</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Rust */}
              <Card className="p-6 border-primary/20 bg-card/50 hover:border-primary/50 transition-all">
                <div className="mb-4">
                  <h3 className="text-xl font-bold">Rust</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Install</div>
                    <div className="bg-muted/80 p-3 rounded-lg font-mono text-xs">
                      cargo add logengine
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Usage</div>
                    <div className="bg-muted/80 p-3 rounded-lg font-mono text-xs">
                      <div><span className="text-primary">use</span> logengine::CreatePlateformLogger;</div>
                      <div className="mt-2">
                        <div><span className="text-primary">let</span> appLog = CreatePlateformLogger::new(</div>
                        <div className="pl-2"><span className="text-amber-500">&quot;grpc.logengine.io&quot;</span>,</div>
                        <div className="pl-2"><span className="text-amber-500">&quot;your-api-key&quot;</span></div>
                        <div>);</div>
                      </div>
                      <div className="mt-2">appLog.<span className="text-primary">info</span>(<span className="text-amber-500">&quot;Hello&quot;</span>);</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 border-b bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Built for <span className="text-primary">Performance</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Production-ready features that scale with your infrastructure
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
              <CardHeader className="pb-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">gRPC Performance</CardTitle>
                <CardDescription className="text-base">
                  Lightning-fast binary protocol. Handle <span className="text-primary font-semibold">10,000+ logs/sec</span> with sub-5ms latency.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
              <CardHeader className="pb-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Enterprise Security</CardTitle>
                <CardDescription className="text-base">
                  API key auth, rate limiting, strict validation. <span className="text-primary font-semibold">Production-grade</span> security out of the box.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
              <CardHeader className="pb-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Async Processing</CardTitle>
                <CardDescription className="text-base">
                  RabbitMQ message queue with <span className="text-primary font-semibold">automatic retry</span> and exponential backoff.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
              <CardHeader className="pb-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">PostgreSQL Storage</CardTitle>
                <CardDescription className="text-base">
                  Robust relational database with JSONB. <span className="text-primary font-semibold">Full SQL power</span> for complex queries.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
              <CardHeader className="pb-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Server className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Zero Data Loss</CardTitle>
                <CardDescription className="text-base">
                  Graceful shutdown, queue persistence. <span className="text-primary font-semibold">Battle-tested</span> for production workloads.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
              <CardHeader className="pb-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Code2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Developer First</CardTitle>
                <CardDescription className="text-base">
                  SDKs, docs, Docker Compose. <span className="text-primary font-semibold">Get started in 5 minutes</span> with one command.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-32 border-b">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4">Architecture</Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              How it <span className="text-primary">Works</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Event-driven architecture with async processing
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-8">
            {/* Architecture Diagram */}
            <Card className="p-8 border-primary/20 bg-gradient-to-br from-card to-muted/20">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                <div className="text-center">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all rounded-lg" />
                    <div className="relative bg-card border-2 border-primary/30 rounded-xl p-6 hover:border-primary transition-all">
                      <Code2 className="h-10 w-10 text-primary mx-auto mb-3" />
                      <div className="font-mono text-sm font-bold">Your App</div>
                      <div className="text-xs text-muted-foreground mt-1">SDK Client</div>
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex justify-center">
                  <ArrowRight className="h-6 w-6 text-primary" />
                </div>

                <div className="text-center">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all rounded-lg" />
                    <div className="relative bg-card border-2 border-primary/30 rounded-xl p-6 hover:border-primary transition-all">
                      <Zap className="h-10 w-10 text-primary mx-auto mb-3" />
                      <div className="font-mono text-sm font-bold">gRPC Server</div>
                      <div className="text-xs text-primary mt-1">:30001</div>
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex justify-center">
                  <ArrowRight className="h-6 w-6 text-primary" />
                </div>

                <div className="text-center">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all rounded-lg" />
                    <div className="relative bg-card border-2 border-primary/30 rounded-xl p-6 hover:border-primary transition-all">
                      <Activity className="h-10 w-10 text-primary mx-auto mb-3" />
                      <div className="font-mono text-sm font-bold">RabbitMQ</div>
                      <div className="text-xs text-muted-foreground mt-1">Queue</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center my-6">
                <div className="h-8 w-0.5 bg-gradient-to-b from-primary to-primary/50" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all rounded-lg" />
                    <div className="relative bg-card border-2 border-primary/30 rounded-xl p-6 hover:border-primary transition-all">
                      <Server className="h-10 w-10 text-primary mx-auto mb-3" />
                      <div className="font-mono text-sm font-bold">Consumer</div>
                      <div className="text-xs text-muted-foreground mt-1">Worker</div>
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex justify-center">
                  <ArrowRight className="h-6 w-6 text-primary" />
                </div>

                <div className="text-center">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all rounded-lg" />
                    <div className="relative bg-card border-2 border-primary/30 rounded-xl p-6 hover:border-primary transition-all">
                      <Database className="h-10 w-10 text-primary mx-auto mb-3" />
                      <div className="font-mono text-sm font-bold">PostgreSQL</div>
                      <div className="text-xs text-primary mt-1">:5432</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 border-b bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4">Pricing</Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Choose Your <span className="text-primary">Deployment</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Self-host for free or let us manage it for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Self-Hosted */}
            <Card className="relative border-primary/30 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Server className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-3xl">Self-Hosted</CardTitle>
                </div>
                <div className="text-5xl font-bold mb-3">
                  $0
                  <span className="text-lg font-normal text-muted-foreground ml-2">/forever</span>
                </div>
                <CardDescription className="text-base">
                  Deploy on your infrastructure, keep full control
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mb-8">
                  {[
                    'Unlimited logs & applications',
                    'Full source code access',
                    'MIT License - commercial use',
                    'Community support',
                    'Your data stays with you'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full h-12 bg-primary hover:bg-primary/90" asChild>
                  <Link href="https://github.com/log-engine/logengine" target="_blank">
                    <Github className="mr-2 h-5 w-5" />
                    Get Started
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Cloud */}
            <Card className="relative border-primary bg-gradient-to-br from-card to-primary/5">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="px-6 py-1.5 bg-primary text-primary-foreground">Coming Soon</Badge>
              </div>
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Cloud className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-3xl">Cloud</CardTitle>
                </div>
                <div className="text-5xl font-bold mb-3">
                  $29
                  <span className="text-lg font-normal text-muted-foreground ml-2">/month</span>
                </div>
                <CardDescription className="text-base">
                  Fully managed, zero maintenance required
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mb-8">
                  {[
                    'Managed infrastructure',
                    'Automatic updates & scaling',
                    'Advanced analytics dashboard',
                    'Priority support & SLA',
                    '99.9% uptime guarantee'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full h-12" variant="secondary" disabled>
                  Join Waitlist
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-7xl font-bold mb-8">
              Ready to <span className="text-primary">Start Logging</span>?
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join developers building better applications with LogEngine
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-10 h-14 bg-primary hover:bg-primary/90 group" asChild>
                <Link href="https://github.com/log-engine/logengine" target="_blank">
                  <Github className="mr-2 h-5 w-5" />
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-10 h-14 border-primary/30 hover:border-primary" asChild>
                <Link href="https://github.com/log-engine/logengine/blob/main/QUICKSTART.md" target="_blank">
                  Read Documentation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="h-6 w-6 text-primary" />
                <h3 className="font-bold text-xl">LogEngine</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Open-source log management built for developers who care about performance and reliability.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="https://github.com/log-engine/logengine" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">GitHub</Link></li>
                <li><Link href="https://github.com/log-engine/logengine/blob/main/CONTRIBUTING.md" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">Contributing</Link></li>
                <li><Link href="https://github.com/log-engine/logengine/blob/main/QUICKSTART.md" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">Quick Start</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="https://github.com/log-engine/logengine/blob/main/LICENSE" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">MIT License</Link></li>
                <li><Link href="https://github.com/log-engine/logengine/blob/main/SECURITY.md" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 LogEngine. Built with <span className="text-primary">❤</span> by the open-source community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
