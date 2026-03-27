import React, { useState, useEffect } from 'react';
import { Download, Eye, FileText, Printer, ReceiptText } from 'lucide-react';
import type { InvoiceData, ChallanData } from '../types/invoice';

interface BillHistoryProps {
  onViewBill: (type: 'invoice' | 'challan', data: InvoiceData | ChallanData) => void;
}

export const BillHistory: React.FC<BillHistoryProps> = ({ onViewBill }) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [challans, setChallans] = useState<ChallanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const [invoiceRes, challanRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/invoices`),
        fetch(`${API_BASE_URL}/api/challans`)
      ]);

      if (!invoiceRes.ok || !challanRes.ok) {
        throw new Error('Failed to fetch bills');
      }

      const invoiceData = await invoiceRes.json();
      const challanData = await challanRes.json();

      setInvoices(invoiceData);
      setChallans(challanData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading bill history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-destructive">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Bill History</h2>
        <p className="text-muted-foreground mt-1">View all saved invoices and challans</p>
      </div>

      {/* Invoices Section */}
      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="px-4 py-3 border-b border-border bg-secondary/40">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <ReceiptText size={20} />
            Invoices ({invoices.length})
          </h3>
        </div>
        <div className="p-4">
          {invoices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No invoices saved yet
            </div>
          ) : (
            <div className="space-y-3">
              {invoices.map((invoice, index) => (
                <div key={`${invoice.invoiceNumber}-${index}`} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">
                      Invoice #{invoice.invoiceNumber}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {invoice.clientName} • {formatDate(invoice.invoiceDate)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewBill('invoice', invoice)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Challans Section */}
      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="px-4 py-3 border-b border-border bg-secondary/40">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <FileText size={20} />
            Challans ({challans.length})
          </h3>
        </div>
        <div className="p-4">
          {challans.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No challans saved yet
            </div>
          ) : (
            <div className="space-y-3">
              {challans.map((challan, index) => (
                <div key={`${challan.challanNo}-${index}`} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">
                      Challan #{challan.challanNo}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {challan.to} • {formatDate(challan.date)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewBill('challan', challan)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};