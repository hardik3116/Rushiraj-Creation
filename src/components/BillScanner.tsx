import { useState, useRef } from 'react';
import { Scan, Upload, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { blink } from '../blink/client';
import type { InvoiceData } from '../types/invoice';

interface Props {
  onExtracted: (partial: Partial<InvoiceData>) => void;
  onClose: () => void;
}

interface ExtractedBill {
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  clientName?: string;
  clientAddress?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  items?: Array<{ name: string; qty: number; rate: number; unit: string }>;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
}

export function BillScanner({ onExtracted, onClose }: Props) {
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ExtractedBill | null>(null);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setImgFile(file);
    setResult(null);
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => setImgPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleFile(file);
  };

  const handleScan = async () => {
    if (!imgFile) return;
    setScanning(true);
    setError('');
    try {
      // Upload to get HTTPS URL
      const { publicUrl } = await blink.storage.upload(
        imgFile,
        `bill-scans/${Date.now()}.${imgFile.name.split('.').pop()}`
      );

      // AI vision extraction
      const { text } = await blink.ai.generateText({
        messages: [{
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are a bill/invoice data extraction expert. Analyze this bill/invoice/challan image and extract all visible data.

Return ONLY a valid JSON object (no markdown, no explanation) with these fields (use null for missing):
{
  "companyName": "company/sender name",
  "companyAddress": "full address",
  "companyPhone": "phone number",
  "clientName": "client/receiver/bill-to name",
  "clientAddress": "client address",
  "invoiceNumber": "invoice/challan/bill number",
  "invoiceDate": "date in YYYY-MM-DD format",
  "items": [
    { "name": "item name/particulars", "qty": number, "rate": number, "unit": "Pcs" }
  ],
  "bankName": "bank name if visible",
  "accountNumber": "account number if visible",
  "ifscCode": "IFSC code if visible"
}

Extract all text carefully including handwritten text. For amounts/rates, extract the numeric value only.`
            },
            { type: 'image', image: publicUrl }
          ]
        }]
      });

      // Parse JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Could not extract data from image');
      const extracted: ExtractedBill = JSON.parse(jsonMatch[0]);
      setResult(extracted);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Scan failed';
      if (msg.includes('401') || msg.includes('Unauthorized') || msg.includes('auth')) {
        blink.auth.login(window.location.href);
        return;
      }
      setError('Could not scan bill. Please try a clearer image.');
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  const handleApply = () => {
    if (!result) return;
    const partial: Partial<InvoiceData> = {};
    if (result.companyName) partial.companyName = result.companyName;
    if (result.companyAddress) partial.companyAddress = result.companyAddress;
    if (result.companyPhone) partial.companyPhone = result.companyPhone;
    if (result.clientName) partial.clientName = result.clientName;
    if (result.clientAddress) partial.clientAddress = result.clientAddress;
    if (result.invoiceNumber) partial.invoiceNumber = result.invoiceNumber;
    if (result.invoiceDate) partial.invoiceDate = result.invoiceDate;
    if (result.items && result.items.length > 0) {
      partial.items = result.items.map((item, i) => ({
        id: String(Date.now() + i),
        name: item.name || '',
        pchNo: '',
        hsnSac: '',
        qty: Number(item.qty) || 0,
        unit: item.unit || 'Pcs',
        rate: Number(item.rate) || 0,
        discount: 0,
        discountType: 'percent' as const,
        taxRate: 5,
      }));
    }
    if (result.bankName || result.accountNumber || result.ifscCode) {
      partial.bank = {
        bankName: result.bankName || '',
        accountNumber: result.accountNumber || '',
        ifscCode: result.ifscCode || '',
      };
    }
    onExtracted(partial);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg border border-border animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Scan size={16} className="text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">AI Bill Scanner</h2>
              <p className="text-xs text-muted-foreground">Upload a photo of your bill to auto-fill the form</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Upload zone */}
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => !imgPreview && fileRef.current?.click()}
            className={`rounded-xl border-2 border-dashed transition-colors cursor-pointer ${imgPreview ? 'border-primary/40' : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5'}`}
          >
            {imgPreview ? (
              <div className="relative">
                <img src={imgPreview} alt="bill" className="w-full max-h-64 object-contain rounded-xl p-2" />
                <button
                  onClick={(e) => { e.stopPropagation(); setImgPreview(null); setImgFile(null); setResult(null); }}
                  className="absolute top-3 right-3 w-7 h-7 rounded-full bg-destructive text-white flex items-center justify-center shadow hover:opacity-90 transition-opacity"
                >
                  <X size={13} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center py-10 px-4 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Upload size={20} className="text-primary" />
                </div>
                <p className="text-sm font-semibold text-foreground mb-1">Drop your bill photo here</p>
                <p className="text-xs text-muted-foreground">or click to browse — JPG, PNG, HEIC supported</p>
              </div>
            )}
          </div>

          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />

          {/* Scan button */}
          {imgPreview && !result && (
            <button
              onClick={handleScan}
              disabled={scanning}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-60"
            >
              {scanning ? (
                <><Loader2 size={16} className="animate-spin" /> Scanning with AI...</>
              ) : (
                <><Scan size={16} /> Scan & Extract Data</>
              )}
            </button>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          {/* Result preview */}
          {result && (
            <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <CheckCircle size={16} className="text-green-600" />
                Data Extracted Successfully
              </div>
              <div className="space-y-1 text-xs">
                {result.companyName && <div><span className="text-muted-foreground">Company:</span> <strong>{result.companyName}</strong></div>}
                {result.clientName && <div><span className="text-muted-foreground">Client:</span> <strong>{result.clientName}</strong></div>}
                {result.invoiceNumber && <div><span className="text-muted-foreground">Invoice #:</span> <strong>{result.invoiceNumber}</strong></div>}
                {result.invoiceDate && <div><span className="text-muted-foreground">Date:</span> <strong>{result.invoiceDate}</strong></div>}
                {result.items && result.items.length > 0 && (
                  <div><span className="text-muted-foreground">Items found:</span> <strong>{result.items.length}</strong></div>
                )}
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleApply}
                  className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Apply to Form
                </button>
                <button
                  onClick={() => { setResult(null); setImgPreview(null); setImgFile(null); }}
                  className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors"
                >
                  Rescan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
