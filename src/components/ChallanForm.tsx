import { Plus, Trash2, Upload } from 'lucide-react';
import { useRef } from 'react';
import type { ChallanData, ChallanItem } from '../types/invoice';
import { blink } from '../blink/client';

interface Props {
  data: ChallanData;
  onChange: (data: ChallanData) => void;
}

const inputCls = "w-full px-3 py-2 text-sm border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors";
const labelCls = "block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide";

export function ChallanForm({ data, onChange }: Props) {
  const set = (field: keyof ChallanData, value: unknown) => onChange({ ...data, [field]: value });
  const sigRef = useRef<HTMLInputElement>(null);

  const setItem = (id: string, updates: Partial<ChallanItem>) => {
    onChange({
      ...data,
      items: data.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    });
  };

  const addItem = () => {
    onChange({
      ...data,
      items: [
        ...data.items,
        { id: Date.now().toString(), srNo: String(data.items.length + 1), particulars: '', qty: '', rate: 0, amount: 0 },
      ],
    });
  };

  const removeItem = (id: string) => {
    if (data.items.length <= 1) return;
    onChange({ ...data, items: data.items.filter((i) => i.id !== id) });
  };

  const handleSignatureUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => set('signatureUrl', e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5">
      {/* From / To */}
      <section>
        <h3 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">1</span>
          From &amp; To
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>From (Sender)</label>
            <input className={inputCls} value={data.from} onChange={e => set('from', e.target.value)} placeholder="K.M. CREATION" />
          </div>
          <div>
            <label className={labelCls}>To (Receiver)</label>
            <input className={inputCls} value={data.to} onChange={e => set('to', e.target.value)} placeholder="RUSHIRAJ CREATION" />
          </div>
        </div>
      </section>

      {/* Challan Details */}
      <section>
        <h3 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">2</span>
          Challan Details
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>Challan No.</label>
            <input className={inputCls} value={data.challanNo} onChange={e => set('challanNo', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Order No.</label>
            <input className={inputCls} value={data.orderNo} onChange={e => set('orderNo', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Date</label>
            <input type="date" className={inputCls} value={data.date} onChange={e => set('date', e.target.value)} />
          </div>
        </div>
      </section>

      {/* Items */}
      <section>
        <h3 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">3</span>
          Items
        </h3>
        <div className="space-y-2">
          {data.items.map((item, idx) => (
            <div key={item.id} className="bg-secondary/40 rounded-lg p-3 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-muted-foreground">#{idx + 1}</span>
                <button onClick={() => removeItem(item.id)} className="text-destructive hover:bg-destructive/10 p-1 rounded" disabled={data.items.length <= 1}>
                  <Trash2 size={13} />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-2">
                  <label className={labelCls}>Particulars</label>
                  <input className={inputCls} value={item.particulars} onChange={e => setItem(item.id, { particulars: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Qty</label>
                  <input className={inputCls} value={item.qty} onChange={e => setItem(item.id, { qty: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Rate</label>
                  <input type="number" className={inputCls} value={item.rate || ''} onChange={e => {
                    const r = parseFloat(e.target.value) || 0;
                    setItem(item.id, { rate: r, amount: r });
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addItem}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-md border-2 border-dashed border-primary/40 text-primary text-sm font-semibold hover:bg-primary/5 transition-colors"
        >
          <Plus size={16} /> Add Item
        </button>
      </section>

      {/* Signature */}
      <section>
        <h3 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">4</span>
          Signature (optional)
        </h3>
        {data.signatureUrl ? (
          <div className="flex items-center gap-3">
            <img src={data.signatureUrl} alt="sig" className="h-12 w-auto rounded border border-border bg-white p-1" />
            <button onClick={() => set('signatureUrl', '')} className="text-xs text-destructive hover:underline">Remove</button>
          </div>
        ) : (
          <>
            <input ref={sigRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleSignatureUpload(e.target.files[0]); }} />
            <button onClick={() => sigRef.current?.click()} className="flex items-center gap-2 px-3 py-2 rounded-md border border-dashed border-muted-foreground/40 text-sm text-muted-foreground hover:bg-muted/50 transition-colors">
              <Upload size={14} /> Upload Signature Image
            </button>
          </>
        )}
      </section>
    </div>
  );
}
