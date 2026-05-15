"use client";

import Link from "next/link";
import { 
  ShieldCheck, 
  TrendingUp, 
  Code2, 
  Users, 
  Zap, 
  Globe, 
  ArrowRight, 
  ChevronLeft,
  CheckCircle2,
  Lock,
  Cpu
} from "lucide-react";

export default function ProposalPage() {
  const criteria = [
    {
      title: "Strength & Originality",
      description: "Moving beyond simple payments to a complete 'Settlement Hub' with treasury insights and automated tax (GST) handling.",
      icon: <Zap className="w-6 h-6 text-yellow-400" />
    },
    {
      title: "Technical Feasibility",
      description: "Robust SPL Token integration with automated ATA management and support for the official AUDD mint.",
      icon: <Code2 className="w-6 h-6 text-blue-400" />
    },
    {
      title: "AUDD Understanding",
      description: "Deep integration of AUDD as a 1:1 backed AUD stablecoin, positioning it as the default settlement layer for AU businesses.",
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />
    }
  ];

  const roadmap = [
    { stage: "Phase 1: Settlement", status: "Completed", details: "On-chain invoicing and real-time AUDD transfers." },
    { stage: "Phase 2: Treasury", status: "In Progress", details: "Liquidity management and yield-bearing AUDD integration." },
    { stage: "Phase 3: Programmable", status: "Planned", details: "Streaming payroll and automated conditional settlement." }
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 py-16 space-y-24">
      {/* Navigation */}
      <Link href="/" className="flex items-center gap-2 text-muted hover:text-white transition-colors group text-sm font-bold uppercase tracking-widest">
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      {/* Hero Section */}
      <section className="space-y-8 text-center">
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest">
          Grant Application Proposal
        </div>
        <h1 className="text-7xl font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/20">
          AUDD Flow: <br />The Settlement Hub.
        </h1>
        <p className="text-xl text-muted max-w-2xl mx-auto leading-relaxed">
          Building the production-ready infrastructure to make AUDD the default asset for Australian business settlement on Solana.
        </p>
      </section>

      {/* Use Case Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {criteria.map((item, i) => (
          <div key={i} className="glass p-10 rounded-[3rem] space-y-6 border border-white/5 hover:border-white/10 transition-all group">
            <div className="bg-white/5 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </section>

      {/* The Problem & Solution */}
      <section className="glass p-12 rounded-[4rem] bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-white/5 space-y-12">
        <div className="max-w-3xl space-y-4">
          <h2 className="text-4xl font-black tracking-tight">Solving Real Business Friction.</h2>
          <p className="text-muted text-lg leading-relaxed">
            Australian businesses lose billions annually to credit card fees (1.5% - 3.5%) and slow settlement cycles (T+2). 
            AUDD Flow leverages Solana's speed and AUDD's stability to offer instant, sub-cent settlement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h4 className="font-black uppercase tracking-widest text-emerald-400 text-xs">The Tech Stack</h4>
            <ul className="space-y-4">
              {[
                "Next.js 16 (App Router) for high-performance frontend",
                "Solana Web3.js & SPL Token for secure on-chain logic",
                "Tailwind CSS 4 for bespoke, premium design",
                "Lucide for accessible iconography"
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> {text}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-black uppercase tracking-widest text-blue-400 text-xs">Compliance & Trust</h4>
            <div className="glass p-6 rounded-3xl space-y-4 bg-black/40">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-bold">Multi-Sig Compatible</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-bold">Australian GAAP Ready</span>
              </div>
              <div className="flex items-center gap-3">
                <Cpu className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-bold">Solana Mainnet Optimized</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-black">Roadmap to Mainnet</h2>
          <p className="text-muted uppercase tracking-widest text-xs font-bold">From Prototype to Production</p>
        </div>
        
        <div className="space-y-4">
          {roadmap.map((step, i) => (
            <div key={i} className="glass p-8 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-6 group">
              <div className="space-y-1">
                <h3 className="text-2xl font-black group-hover:text-emerald-400 transition-colors">{step.stage}</h3>
                <p className="text-muted text-sm">{step.details}</p>
              </div>
              <div className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
                step.status === 'Completed' ? 'bg-emerald-500 text-white' : 
                step.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' : 
                'bg-white/5 text-muted border border-white/5'
              }`}>
                {step.status}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA / Summary */}
      <section className="text-center py-20 space-y-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px]" />
        
        <div className="relative z-10 space-y-8">
          <h2 className="text-5xl font-black tracking-tight">Ready for AUDD Grant Evaluation.</h2>
          <p className="text-muted max-w-xl mx-auto leading-relaxed">
            AUDD Flow isn't just an app; it's the missing link in Australian digital commerce. 
            We are ready to ship and scale.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/" 
              className="bg-white text-black px-12 py-5 rounded-[2rem] font-black text-lg hover:scale-105 transition-all shadow-2xl"
            >
              Explore the App
            </Link>
            <a 
              href="mailto:builders@audd.com" 
              className="glass px-12 py-5 rounded-[2rem] font-black text-lg hover:bg-white/10 transition-all flex items-center gap-3"
            >
              Contact Builder <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-muted text-xs font-bold uppercase tracking-[0.3em]">
        <p>© 2026 AUDD Flow Infrastructure</p>
        <div className="flex gap-8">
          <span className="hover:text-white transition-colors cursor-pointer">Documentation</span>
          <span className="hover:text-white transition-colors cursor-pointer">Security Audit</span>
          <span className="hover:text-white transition-colors cursor-pointer">Github</span>
        </div>
      </footer>
    </main>
  );
}
