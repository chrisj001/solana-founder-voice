"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import { ArrowLeft, Send, User, DollarSign, FileText, Hash, Calendar, Percent, ShieldCheck } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";

export default function CreateInvoicePage() {
  const router = useRouter();
  const { publicKey } = useWallet();

  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");
  const [includeGST, setIncludeGST] = useState(true);
  const [expiryDays, setExpiryDays] = useState("30");
  const [isLoading, setIsLoading] = useState(false);

  // Generate a random reference number on load
  useEffect(() => {
    setReference(`INV-${Math.floor(100000 + Math.random() * 900000)}`);
  }, []);

  const calculateTotal = () => {
    const base = parseFloat(amount) || 0;
    return includeGST ? base * 1.1 : base;
  };

  const handleCreateInvoice = async () => {
    if (!client || !amount || !description) return;
    setIsLoading(true);

    const invoiceId = uuidv4();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(expiryDays));

    const invoice = {
      id: invoiceId,
      client,
      amount: calculateTotal().toFixed(2),
      baseAmount: parseFloat(amount).toFixed(2),
      gstAmount: (calculateTotal() - (parseFloat(amount) || 0)).toFixed(2),
      description,
      reference,
      status: "pending",
      createdAt: new Date().toISOString(),
      expiryDate: expiryDate.toISOString(),
      merchantAddress: publicKey?.toBase58(),
    };

    localStorage.setItem(`invoice-${invoiceId}`, JSON.stringify(invoice));
    
    await new Promise(resolve => setTimeout(resolve, 800));
    router.push(`/pay/${invoiceId}`);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Create Invoice</h1>
          <p className="text-muted text-lg">Professional settlement for Australian businesses.</p>
        </div>
        <div className="glass px-4 py-2 rounded-xl border border-emerald-500/20 text-emerald-400 text-sm font-bold flex items-center gap-2">
          <Percent className="w-4 h-4" /> 10% GST Ready
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-8 rounded-3xl shadow-2xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted flex items-center gap-2">
                  <User className="w-4 h-4" /> Client Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Canva Pty Ltd"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  className="w-full bg-background/50 border border-card-border p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted flex items-center gap-2">
                  <Hash className="w-4 h-4" /> Reference Number
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full bg-background/50 border border-card-border p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted flex items-center gap-2">
                <FileText className="w-4 h-4" /> Description of Services
              </label>
              <textarea
                placeholder="Product development, consulting, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-background/50 border border-card-border p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Base Amount (AUDD)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-background/50 border border-card-border p-4 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-xl font-bold"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-xl font-medium">$</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Expiry (Terms)
                </label>
                <select 
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(e.target.value)}
                  className="w-full bg-background/50 border border-card-border p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none"
                >
                  <option value="7">Net 7 Days</option>
                  <option value="14">Net 14 Days</option>
                  <option value="30">Net 30 Days</option>
                  <option value="60">Net 60 Days</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="space-y-6">
          <div className="glass p-8 rounded-3xl shadow-2xl space-y-6">
            <h3 className="font-bold text-xl">Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span>${(parseFloat(amount) || 0).toFixed(2)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted">
                  <input 
                    type="checkbox" 
                    id="gst" 
                    checked={includeGST}
                    onChange={(e) => setIncludeGST(e.target.checked)}
                    className="accent-emerald-500 w-4 h-4"
                  />
                  <label htmlFor="gst" className="text-sm">Include GST (10%)</label>
                </div>
                <span>${(includeGST ? (parseFloat(amount) || 0) * 0.1 : 0).toFixed(2)}</span>
              </div>

              <div className="h-px bg-card-border" />
              
              <div className="flex justify-between items-end">
                <span className="font-bold text-lg">Total AUDD</span>
                <span className="text-3xl font-black text-emerald-400">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCreateInvoice}
              disabled={isLoading || !client || !amount || !description || !publicKey}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-500/20 active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {publicKey ? "Issue Invoice" : "Connect Wallet to Issue"}
                </>
              )}
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-4">
            <div className="flex gap-4">
              <div className="p-2 bg-blue-500/20 rounded-lg h-fit">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-blue-400">Compliance Notice</p>
                <p className="text-xs text-muted leading-relaxed">
                  AUDD is a fully backed AUD stablecoin. Invoices generated here are compliant with digital asset settlement standards in Australia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}