"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { 
  Plus, 
  CreditCard, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Download,
  Filter,
  ArrowRight
} from "lucide-react";

interface Invoice {
  id: string;
  client: string;
  amount: string;
  baseAmount: string;
  gstAmount: string;
  description: string;
  reference: string;
  status: "pending" | "paid";
  createdAt: string;
  expiryDate: string;
}

export default function Dashboard() {
  const { publicKey } = useWallet();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "paid">("all");

  useEffect(() => {
    const allInvoices: Invoice[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("invoice-")) {
        const item = localStorage.getItem(key);
        if (item) {
          allInvoices.push(JSON.parse(item));
        }
      }
    }
    setInvoices(allInvoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, []);

  const filteredInvoices = invoices.filter(inv => filter === "all" || inv.status === filter);

  const totalRevenue = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((acc, inv) => acc + parseFloat(inv.amount), 0);

  const pendingRevenue = invoices
    .filter((inv) => inv.status === "pending")
    .reduce((acc, inv) => acc + parseFloat(inv.amount), 0);

  const savings = totalRevenue * 0.025;

  const exportToCSV = () => {
    const headers = ["Reference", "Client", "Amount (AUDD)", "GST", "Date", "Status"];
    const rows = invoices.map(inv => [
      inv.reference,
      inv.client,
      inv.amount,
      inv.gstAmount,
      new Date(inv.createdAt).toLocaleDateString(),
      inv.status
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `AUDD_Flow_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!publicKey) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[90vh] gap-12 px-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-700" />

        <div className="text-center space-y-6 max-w-3xl z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold animate-bounce">
            <ShieldCheck className="w-4 h-4" /> Trusted by Australian Builders
          </div>
          <h1 className="text-6xl font-black tracking-tight sm:text-7xl bg-clip-text text-transparent bg-gradient-to-br from-white via-emerald-200 to-blue-400 leading-tight">
            The Future of <br /> AUD Settlement.
          </h1>
          <p className="text-xl text-muted leading-relaxed">
            AUDD Flow is the production-ready infrastructure for real-world Australian digital finance. 
            Automate your settlement, reduce fees, and unlock programmable money on Solana.
          </p>
        </div>
        
        <div className="glass p-10 rounded-[2.5rem] flex flex-col items-center gap-8 shadow-2xl border border-white/10 z-10 max-w-md w-full">
          <div className="bg-emerald-500/20 p-5 rounded-3xl">
            <TrendingUp className="w-12 h-12 text-emerald-400" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold">Merchant Access</h3>
            <p className="text-muted text-sm px-4">Securely connect your Solana wallet to access your settlement dashboard.</p>
          </div>
          <WalletMultiButton />
          <Link href="/proposal" className="text-xs text-muted hover:text-emerald-400 transition-colors uppercase tracking-widest font-bold">
            View Grant Proposal →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-5xl font-black text-foreground">AUDD Flow</h1>
            <span className="px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Alpha</span>
          </div>
          <p className="text-muted text-lg">Infrastructure for the Digital Australian Dollar.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="/create" 
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-emerald-500/20 active:scale-95 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Issue Invoice
          </Link>
          <WalletMultiButton />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass p-8 rounded-3xl space-y-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-16 h-16 text-emerald-400" />
          </div>
          <p className="text-sm font-bold text-muted uppercase tracking-widest">Settled Revenue</p>
          <div className="space-y-1">
            <p className="text-4xl font-black text-foreground">{totalRevenue.toLocaleString()} <span className="text-lg text-emerald-400">AUDD</span></p>
            <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12.5% this month
            </p>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl space-y-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock className="w-16 h-16 text-blue-400" />
          </div>
          <p className="text-sm font-bold text-muted uppercase tracking-widest">In Flight</p>
          <div className="space-y-1">
            <p className="text-4xl font-black text-foreground">{pendingRevenue.toLocaleString()} <span className="text-lg text-blue-400">AUDD</span></p>
            <p className="text-xs text-muted font-bold">{invoices.filter(i => i.status === 'pending').length} pending invoices</p>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl space-y-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldCheck className="w-16 h-16 text-purple-400" />
          </div>
          <p className="text-sm font-bold text-muted uppercase tracking-widest">Fees Saved</p>
          <div className="space-y-1">
            <p className="text-4xl font-black text-foreground">${savings.toLocaleString()} <span className="text-lg text-purple-400">AUDD</span></p>
            <p className="text-xs text-purple-400 font-bold italic">Vs Traditional Rails</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-blue-600 p-8 rounded-3xl space-y-4 shadow-2xl shadow-emerald-500/10">
          <p className="text-sm font-bold text-white/70 uppercase tracking-widest">Treasury Yield</p>
          <div className="space-y-1">
            <p className="text-4xl font-black text-white">4.25% <span className="text-lg text-white/70">APY</span></p>
            <p className="text-xs text-white/90 font-bold">On-chain AUD Liquidity</p>
          </div>
          <button className="w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-xl text-xs font-bold transition-all border border-white/10">
            Manage Treasury
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-foreground">Recent Settlement</h2>
            <div className="flex items-center gap-2 glass p-1 rounded-xl">
              <button 
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'all' ? 'bg-white/10 text-white' : 'text-muted hover:text-foreground'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter("pending")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'pending' ? 'bg-blue-500/20 text-blue-400' : 'text-muted hover:text-foreground'}`}
              >
                Pending
              </button>
              <button 
                onClick={() => setFilter("paid")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'text-muted hover:text-foreground'}`}
              >
                Paid
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredInvoices.length === 0 ? (
              <div className="glass p-20 rounded-[3rem] text-center space-y-6">
                <div className="bg-muted/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto ring-8 ring-muted/5">
                  <Download className="w-10 h-10 text-muted" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">No settlement history</h3>
                  <p className="text-muted max-w-xs mx-auto">Start issuing invoices in AUDD to build your on-chain financial footprint.</p>
                </div>
              </div>
            ) : (
              filteredInvoices.map((invoice) => (
                <Link 
                  key={invoice.id} 
                  href={`/pay/${invoice.id}`}
                  className="glass glass-hover p-8 rounded-[2rem] flex flex-col sm:flex-row sm:items-center justify-between gap-6 group relative overflow-hidden"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${invoice.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                      {invoice.status === 'paid' ? <CheckCircle2 className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
                    </div>
                    <div>
                      <h3 className="font-black text-xl group-hover:text-emerald-400 transition-colors">{invoice.client}</h3>
                      <p className="text-sm text-muted font-mono">{invoice.reference}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-12">
                    <div className="text-right space-y-1">
                      <p className="text-2xl font-black">{parseFloat(invoice.amount).toLocaleString()} AUDD</p>
                      <p className="text-[10px] text-muted font-black uppercase tracking-widest italic">
                        {invoice.status === 'paid' ? 'Settled On-chain' : `Due ${new Date(invoice.expiryDate).toLocaleDateString()}`}
                      </p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-full group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 group-hover:translate-x-2">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass p-8 rounded-[2.5rem] space-y-6">
            <h3 className="text-xl font-black flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Compliance Hub
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted">Solana Program</p>
                <p className="text-xs font-mono truncate">AUDDttiEpCydTm7joUMbYddm72jAWXZnCpPZtDoxqBSw</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted">Backing Attestation</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">1:1 AUD Reserved</span>
                  <ArrowUpRight className="w-3 h-3 text-muted" />
                </div>
              </div>
            </div>
            <button 
              onClick={exportToCSV}
              className="w-full bg-white text-black py-4 rounded-2xl font-black text-sm hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Export Report (CSV)
            </button>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 space-y-4">
            <h3 className="text-xl font-black">Programmable AUDD</h3>
            <p className="text-sm text-muted leading-relaxed">
              Unlock streaming payments and automated payroll for your Australian team. AUDD Flow is ready for programmable money.
            </p>
            <Link href="/proposal" className="inline-flex items-center gap-2 text-blue-400 font-bold text-xs hover:underline uppercase tracking-widest">
              Learn more <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}