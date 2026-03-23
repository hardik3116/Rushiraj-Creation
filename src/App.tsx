import { useState, useRef } from 'react';
import { Download, Eye, FileText, Scan, ChevronLeft, Printer, ReceiptText } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoicePreview } from './components/InvoicePreview';
import { ChallanForm } from './components/ChallanForm';
import { ChallanPreview } from './components/ChallanPreview';
import { BillScanner } from './components/BillScanner';
import type { InvoiceData, ChallanData } from './types/invoice';
import { defaultInvoiceData, defaultChallanData } from './types/invoice';

type Tab = 'invoice' | 'challan';

export default function App() {
  const [tab, setTab] = useState<Tab>('invoice');
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(defaultInvoiceData);
  const [challanData, setChallanData] = useState<ChallanData>(defaultChallanData);
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form');
  const [showScanner, setShowScanner] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Hidden refs — always mounted at full size for accurate PDF capture
  const invoicePdfRef = useRef<HTMLDivElement>(null);
  const challanPdfRef = useRef<HTMLDivElement>(null);

  const fileName = tab === 'invoice'
    ? `Invoice-${invoiceData.invoiceNumber || 'draft'}.pdf`
    : `Challan-${challanData.challanNo || 'draft'}.pdf`;

  const handleDownload = async () => {
    const el = tab === 'invoice' ? invoicePdfRef.current : challanPdfRef.current;
    if (!el) return;
    setDownloading(true);
    try {
      // Capture the hidden full-size element
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 794,
        windowWidth: 794,
        onclone: (document) => {
          // Ensure the cloned element is visible for capture
          const element = document.getElementById(el.id);
          if (element) {
            element.style.opacity = '1';
            element.style.visibility = 'visible';
          }
        }
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      // Use mm units — A4 is exactly 210×297mm
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pageW = 210; // mm
      const pageH = 297; // mm

      // Image height in mm, proportional to canvas aspect ratio
      const imgH = pageW * (canvas.height / canvas.width);

      if (imgH <= pageH + 0.5) {
        // Fits on one page — stretch to fill full A4
        pdf.addImage(imgData, 'JPEG', 0, 0, pageW, Math.min(imgH, pageH));
      } else {
        // Multi-page (invoice can be long)
        let y = 0;
        let pg = 0;
        while (y < imgH - 0.5) {
          if (pg > 0) pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, -y, pageW, imgH);
          y += pageH;
          pg++;
        }
      }
      pdf.save(fileName);
    } catch (e) { console.error(e); }
    finally { setDownloading(false); }
  };

  const handleScannedData = (partial: Partial<InvoiceData>) => {
    setInvoiceData(prev => ({ ...prev, ...partial }));
  };

  const previewScale = () => {
    if (typeof window === 'undefined') return 0.65;
    const w = window.innerWidth;
    if (w >= 1280) return 0.72;
    if (w >= 1024) return 0.60;
    return 0.55;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ═══ HIDDEN PDF CAPTURE ELEMENTS ═══
          Always mounted at exact 794px width, off-screen.
          html2canvas reads these for pixel-perfect PDF generation. */}
      <div
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: '794px',
          zIndex: -1,
          opacity: 1,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <InvoicePreview ref={invoicePdfRef} data={invoiceData} />
        <ChallanPreview ref={challanPdfRef} data={challanData} />
      </div>

      {/* ─── TOP NAV ─── */}
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-5 h-14 flex items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <FileText size={15} className="text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-foreground leading-none">Rushiraj Creation</h1>
              <p className="text-[10px] text-muted-foreground mt-0.5">Professional Invoice &amp; Challan Generator</p>
            </div>
            <span className="sm:hidden text-sm font-bold text-foreground">Bill PDF</span>
          </div>

          {/* Tab switcher (desktop) */}
          <div className="hidden md:flex items-center bg-muted rounded-lg p-1 gap-1">
            <button
              onClick={() => setTab('invoice')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${tab === 'invoice' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <ReceiptText size={14} /> Invoice
            </button>
            <button
              onClick={() => setTab('challan')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${tab === 'challan' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Printer size={14} /> Delivery Challan
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {tab === 'invoice' && (
              <button
                onClick={() => setShowScanner(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <Scan size={14} /> Scan Bill
              </button>
            )}
            {/* Mobile view toggle */}
            <div className="flex md:hidden items-center bg-muted rounded-lg p-1 gap-1">
              <button
                onClick={() => setMobileView('form')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${mobileView === 'form' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
              >
                Form
              </button>
              <button
                onClick={() => setMobileView('preview')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${mobileView === 'preview' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
              >
                <Eye size={11} /> Preview
              </button>
            </div>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-60 whitespace-nowrap"
            >
              <Download size={14} />
              <span className="hidden sm:inline">{downloading ? 'Generating...' : 'Download PDF'}</span>
              <span className="sm:hidden">PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── MOBILE TAB BAR ─── */}
      <div className="md:hidden sticky top-14 z-30 bg-card border-b border-border px-3 py-2 flex items-center gap-2">
        <div className="flex items-center bg-muted rounded-lg p-1 gap-1 flex-1">
          <button
            onClick={() => setTab('invoice')}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-xs font-semibold transition-all ${tab === 'invoice' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
          >
            <ReceiptText size={12} /> Invoice
          </button>
          <button
            onClick={() => setTab('challan')}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-xs font-semibold transition-all ${tab === 'challan' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
          >
            <Printer size={12} /> Challan
          </button>
        </div>
        {tab === 'invoice' && (
          <button
            onClick={() => setShowScanner(true)}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs font-semibold border border-primary/20 hover:bg-primary/20 transition-colors"
          >
            <Scan size={13} /> Scan
          </button>
        )}
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 max-w-screen-2xl mx-auto w-full px-3 sm:px-5 py-4">

        {/* ─── DESKTOP: side-by-side ─── */}
        <div className="hidden md:flex gap-5 h-full">
          {/* Form Panel */}
          <div className="w-[360px] lg:w-[400px] xl:w-[420px] shrink-0">
            <div className="bg-card rounded-xl border border-border shadow-sm h-full flex flex-col">
              <div className="px-4 py-3 border-b border-border bg-secondary/40 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    {tab === 'invoice' ? 'Invoice Details' : 'Challan Details'}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Fill in the details to generate your {tab}</p>
                </div>
                {tab === 'invoice' && (
                  <button
                    onClick={() => setShowScanner(true)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors border border-primary/20"
                  >
                    <Scan size={12} /> AI Scan
                  </button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {tab === 'invoice'
                  ? <InvoiceForm data={invoiceData} onChange={setInvoiceData} />
                  : <ChallanForm data={challanData} onChange={setChallanData} />
                }
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="flex-1 min-w-0">
            <div className="bg-card rounded-xl border border-border shadow-sm h-full flex flex-col">
              <div className="px-4 py-3 border-b border-border bg-secondary/40 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-sm font-bold text-foreground">Live Preview</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {tab === 'invoice' ? `Invoice #${invoiceData.invoiceNumber}` : `Challan #${challanData.challanNo}`} — Updates in real time
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-60"
                >
                  <Download size={13} />
                  {downloading ? 'Generating...' : 'Download PDF'}
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4 bg-muted/30">
                <div style={{
                  transform: `scale(${previewScale()})`,
                  transformOrigin: 'top left',
                  width: '794px',
                }}>
                  <div className="shadow-2xl rounded-sm overflow-hidden">
                    {tab === 'invoice'
                      ? <InvoicePreview data={invoiceData} />
                      : <ChallanPreview data={challanData} />
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── MOBILE: toggle form/preview ─── */}
        <div className="md:hidden">
          {mobileView === 'form' ? (
            <div className="bg-card rounded-xl border border-border shadow-sm">
              <div className="p-4">
                {tab === 'invoice'
                  ? <InvoiceForm data={invoiceData} onChange={setInvoiceData} />
                  : <ChallanForm data={challanData} onChange={setChallanData} />
                }
              </div>
              <div className="sticky bottom-0 p-3 bg-card border-t border-border">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-60"
                >
                  <Download size={16} />
                  {downloading ? 'Generating...' : 'Download PDF'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/40">
                <div className="text-sm font-bold text-foreground">Preview</div>
                <button onClick={() => setMobileView('form')} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                  <ChevronLeft size={13} /> Back to form
                </button>
              </div>
              <div className="overflow-auto p-3 bg-muted/30">
                <div style={{ transform: 'scale(0.42)', transformOrigin: 'top left', width: '794px', height: '0' }}>
                  <div className="shadow-xl rounded-sm overflow-hidden" style={{ height: 'auto' }}>
                    {tab === 'invoice'
                      ? <InvoicePreview data={invoiceData} />
                      : <ChallanPreview data={challanData} />
                    }
                  </div>
                </div>
                <div style={{ height: `${1123 * 0.42 + 20}px` }} />
              </div>
              <div className="p-3 border-t border-border">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-60"
                >
                  <Download size={16} />
                  {downloading ? 'Generating...' : 'Download PDF'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── AI Bill Scanner Modal ─── */}
      {showScanner && (
        <BillScanner
          onExtracted={handleScannedData}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
