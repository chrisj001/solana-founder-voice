"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { 
  PublicKey, 
  Transaction, 
} from "@solana/web3.js";
import { 
  getAssociatedTokenAddress, 
  createTransferInstruction, 
  getAccount,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  Wallet, 
  ShieldCheck,
  ExternalLink,
  ChevronLeft,
  Download,
  Info
} from "lucide-react";
import Link from "next/link";

const AUDD_MINT = new PublicKey("AUDDttiEpCydTm7joUMbYddm72jAWXZnCpPZtDoxqBSw");

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
  merchantAddress: string;
}

export default function PayInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const item = localStorage.getItem(`invoice-${resolvedParams.id}`);
    if (item) {
      setInvoice(JSON.parse(item));
    }
  }, [resolvedParams.id]);

  const handlePayment = async () => {
    if (!publicKey || !invoice) return;
    setIsPaying(true);
    setError(null);

    try {
      if (!invoice.merchantAddress) {
        throw new Error("This invoice is missing a valid merchant address. It may have been created without a connected wallet.");
      }
      
      const merchantPubKey = new PublicKey(invoice.merchantAddress);
      const amount = parseFloat(invoice.amount);
      
      const payerATA = await getAssociatedTokenAddress(AUDD_MINT, publicKey);
      const merchantATA = await getAssociatedTokenAddress(AUDD_MINT, merchantPubKey);

      const transaction = new Transaction();

      try {
        await getAccount(connection, merchantATA);
      } catch (e) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            publicKey,
            merchantATA,
            merchantPubKey,
            AUDD_MINT
          )
        );
      }

      const decimals = 6; 
      transaction.add(
        createTransferInstruction(
          payerATA,
          merchantATA,
          publicKey,
          BigInt(Math.floor(amount * Math.pow(10, decimals)))
        )
      );

      const signature = await sendTransaction(transaction, connection);
      setTxHash(signature);

      const latestBlockhash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        signature,
        ...latestBlockhash,
      });

      const updatedInvoice = { ...invoice, status: "paid" as const };
      localStorage.setItem(`invoice-${invoice.id}`, JSON.stringify(updatedInvoice));
      setInvoice(updatedInvoice);

    } catch (err: any) {
      console.error("Payment failed", err);
      setError(err.message || "Payment failed. Please check your balance and try again.");
    } finally {
      setIsPaying(false);
    }
  };

  if (!invoice) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold">Invoice Not Found</h1>
          <Link href="/" className="text-emerald-400 hover:underline">Return to Dashboard</Link>
        </div>
      </main>
    );
  }

  const isExpired = new Date(invoice.expiryDate) < new Date() && invoice.status !== 'paid';

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-muted hover:text-white transition-colors group text-sm font-bold uppercase tracking-widest">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Hub
        </Link>
        <div className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest ${
          invoice.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
          isExpired ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
          'bg-blue-500/10 text-blue-400 border border-blue-500/20'
        }`}>
          {invoice.status === 'paid' ? <ShieldCheck className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
          {invoice.status === 'paid' ? 'Settled' : isExpired ? 'Expired' : 'Awaiting Payment'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Invoice Details */}
        <div className="lg:col-span-3 space-y-8">
          <div className="glass p-10 rounded-[3rem] shadow-2xl space-y-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
              <h2 className="text-6xl font-black opacity-[0.03] select-none uppercase tracking-tighter">INVOICE</h2>
            </div>

            <div className="flex justify-between items-start relative">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Merchant Client</p>
                <h1 className="text-4xl font-black text-foreground leading-none">{invoice.client}</h1>
                <p className="text-sm font-mono text-muted">{invoice.reference}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Issue Date</p>
                <p className="font-bold text-lg">{new Date(invoice.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-card-border via-card-border/50 to-transparent w-full" />

            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Service Description</p>
                <p className="text-xl font-medium leading-relaxed text-foreground/90">{invoice.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Due Date</p>
                  <p className="font-bold">{new Date(invoice.expiryDate).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Currency</p>
                  <p className="font-bold text-emerald-400">AUDD (1:1 AUD)</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-mono">${invoice.baseAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">GST (10%)</span>
                  <span className="font-mono">${invoice.gstAmount}</span>
                </div>
              </div>
              <div className="h-px bg-white/5 w-full" />
              <div className="flex justify-between items-end">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-1">Total Settlement</p>
                <p className="text-5xl font-black text-white">
                  {invoice.amount} <span className="text-xl font-bold text-emerald-400 tracking-widest ml-1">AUDD</span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-2xl border-l-4 border-l-emerald-500 flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h3 className="font-bold text-sm">Real-world Settlement</h3>
                <p className="text-[11px] text-muted leading-relaxed">AUDD is Australian Dollar infrastructure, fully backed and compliant for corporate use.</p>
              </div>
            </div>
            <div className="glass p-6 rounded-2xl border-l-4 border-l-blue-500 flex items-start gap-4">
              <Info className="w-6 h-6 text-blue-400 shrink-0" />
              <div>
                <h3 className="font-bold text-sm">Gas Efficient</h3>
                <p className="text-[11px] text-muted leading-relaxed">Transactions on Solana cost less than $0.01, saving you 3-5% vs credit card networks.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Action */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-10 rounded-[3rem] shadow-2xl space-y-8 flex flex-col items-center text-center sticky top-12">
            <div className="bg-emerald-500/10 p-6 rounded-full ring-8 ring-emerald-500/5 animate-pulse">
              <Wallet className="w-12 h-12 text-emerald-400" />
            </div>
            
            <div className="space-y-3">
              <h2 className="text-2xl font-black">Finalize Payment</h2>
              <p className="text-sm text-muted leading-relaxed">Securely settle this invoice on the Solana blockchain using your AUDD balance.</p>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-card-border to-transparent" />

            {!publicKey ? (
              <div className="w-full space-y-6">
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">Connection Required</p>
                </div>
                <div className="flex justify-center">
                  <WalletMultiButton />
                </div>
              </div>
            ) : invoice.status === 'paid' ? (
              <div className="w-full space-y-6">
                <div className="bg-emerald-500/10 p-8 rounded-[2rem] border border-emerald-500/20 space-y-4">
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-xl font-black text-emerald-400">Payment Complete</p>
                </div>
                
                <div className="space-y-4">
                  <button className="w-full glass hover:bg-white/10 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all">
                    <Download className="w-4 h-4" /> Download Tax Receipt
                  </button>
                  {txHash && (
                    <a 
                      href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 text-xs font-black text-muted hover:text-white transition-colors uppercase tracking-[0.2em]"
                    >
                      Verify on Explorer <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <Link 
                  href="/"
                  className="w-full bg-emerald-500 text-white p-5 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20"
                >
                  Return to Dashboard <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            ) : (
              <div className="w-full space-y-8">
                <div className="space-y-2 text-left">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1">Payer Address</p>
                  <p className="font-mono text-[10px] truncate bg-background/50 p-4 rounded-xl border border-card-border">
                    {publicKey.toBase58()}
                  </p>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isPaying || isExpired}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white p-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 transition-all shadow-2xl shadow-emerald-500/20 active:scale-95"
                >
                  {isPaying ? (
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Settle {invoice.amount} AUDD
                    </>
                  )}
                </button>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-left animate-shake">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                    <p className="text-xs font-bold text-red-400 leading-tight">{error}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}