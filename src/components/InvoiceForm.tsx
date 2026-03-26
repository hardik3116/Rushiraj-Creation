// import { useRef } from 'react';
// import { Plus, Trash2, Upload, X } from 'lucide-react';
// import type { InvoiceData, InvoiceItem } from '../types/invoice';

// interface Props {
//   data: InvoiceData;
//   onChange: (data: InvoiceData) => void;
// }

// const inputCls = "w-full px-3 py-2 text-sm border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors";
// const labelCls = "block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide";

// function ImageUploadField({
//   label, value, onChange, placeholder
// }: { label: string; value: string; onChange: (url: string) => void; placeholder?: string }) {
//   const inputRef = useRef<HTMLInputElement>(null);

//   const handleFile = (file: File) => {
//     const reader = new FileReader();
//     reader.onload = (e) => onChange(e.target?.result as string);
//     reader.readAsDataURL(file);
//   };

//   return (
//     <div>
//       <label className={labelCls}>{label}</label>
//       {value ? (
//         <div className="flex items-center gap-3 p-2 rounded-md border border-border bg-muted/20">
//           <img src={value} alt={label} className="h-10 w-auto object-contain rounded border border-border bg-white p-0.5" />
//           <span className="text-xs text-muted-foreground flex-1 truncate">{label} uploaded</span>
//           <button onClick={() => onChange('')} className="p-1 rounded hover:bg-destructive/10 text-destructive transition-colors">
//             <X size={13} />
//           </button>
//         </div>
//       ) : (
//         <>
//           <input
//             ref={inputRef}
//             type="file"
//             accept="image/*"
//             className="hidden"
//             onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
//           />
//           <button
//             onClick={() => inputRef.current?.click()}
//             className="w-full flex items-center gap-2 px-3 py-2 rounded-md border border-dashed border-muted-foreground/30 text-sm text-muted-foreground hover:bg-muted/30 hover:border-primary/40 transition-colors"
//           >
//             <Upload size={14} />
//             {placeholder || `Upload ${label}`}
//           </button>
//         </>
//       )}
//     </div>
//   );
// }

// export function InvoiceForm({ data, onChange }: Props) {
//   const set = (field: keyof InvoiceData, value: unknown) => {
//     onChange({ ...data, [field]: value });
//   };

//   const setItem = (id: string, field: keyof InvoiceItem, value: unknown) => {
//     onChange({
//       ...data,
//       items: data.items.map((item) =>
//         item.id === id ? { ...item, [field]: value } : item
//       ),
//     });
//   };

//   const addItem = () => {
//     const newItem: InvoiceItem = {
//       id: Date.now().toString(),
//       name: '',
//       pchNo: '',
//       hsnSac: '',
//       qty: 0,
//       unit: 'Pcs',
//       rate: 0,
//       discount: 5,
//       discountType: 'percent',
//       taxRate: 5,
//     };
//     onChange({ ...data, items: [...data.items, newItem] });
//   };

//   const removeItem = (id: string) => {
//     if (data.items.length <= 1) return;
//     onChange({ ...data, items: data.items.filter((i) => i.id !== id) });
//   };

//   return (
//     <div className="space-y-6">
//       {/* Company Info */}
//       <section>
//         <h3 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border flex items-center gap-2">
//           <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">1</span>
//           Company (From)
//         </h3>
//         <div className="grid grid-cols-2 gap-3">
//           <div className="col-span-2">
//             <label className={labelCls}>Company Name</label>
//             <input className={inputCls} value={data.companyName} onChange={e => set('companyName', e.target.value)} placeholder="Your Company Name" />
//           </div>
//           <div className="col-span-2">
//             <ImageUploadField
//               label="Company Logo"
//               value={data.companyLogoUrl}
//               onChange={url => set('companyLogoUrl', url)}
//               placeholder="Upload Company Logo (PNG/JPG)"
//             />
//           </div>
//           <div className="col-span-2">
//             <label className={labelCls}>Address</label>
//             <input className={inputCls} value={data.companyAddress} onChange={e => set('companyAddress', e.target.value)} placeholder="Street address" />
//           </div>
//           <div>
//             <label className={labelCls}>City</label>
//             <input className={inputCls} value={data.companyCity} onChange={e => set('companyCity', e.target.value)} />
//           </div>
//           <div>
//             <label className={labelCls}>State</label>
//             <input className={inputCls} value={data.companyState} onChange={e => set('companyState', e.target.value)} />
//           </div>
//           <div>
//             <label className={labelCls}>Pincode</label>
//             <input className={inputCls} value={data.companyPincode} onChange={e => set('companyPincode', e.target.value)} />
//           </div>
//           <div>
//             <label className={labelCls}>Phone</label>
//             <input className={inputCls} value={data.companyPhone} onChange={e => set('companyPhone', e.target.value)} />
//           </div>
//           <div>
//             <label className={labelCls}>GSTIN</label>
//             <input className={inputCls} value={data.companyGstin} onChange={e => set('companyGstin', e.target.value)} />
//           </div>
//           <div>
//             <label className={labelCls}>PAN</label>
//             <input className={inputCls} value={data.companyPan} onChange={e => set('companyPan', e.target.value)} />
//           </div>
//         </div>
//       </section>

//       {/* Invoice Details */}
//       <section>
//         <h3 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border flex items-center gap-2">
//           <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">2</span>
//           Invoice Details
//         </h3>
//         <div className="grid grid-cols-2 gap-3">
//           <div>
//             <label className={labelCls}>Invoice No.</label>
//             <input className={inputCls} value={data.invoiceNumber} onChange={e => set('invoiceNumber', e.target.value)} placeholder="AE-001" />
//           </div>
//           <div>
//             <label className={labelCls}>Invoice Date</label>
//             <input type="date" className={inputCls} value={data.invoiceDate} onChange={e => set('invoiceDate', e.target.value)} />
//           </div>
//         </div>
//         <div className="mt-3 flex items-center gap-2">
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input
//               type="checkbox"
//               checked={data.igst}
//               onChange={e => set('igst', e.target.checked)}
//               className="w-4 h-4 rounded accent-primary"
//             />
//             <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Use IGST (Inter-State)</span>
//           </label>
//         </div>
//       </section>

//       {/* Bill To */}
//       <section>
//         <h3 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border flex items-center gap-2">
//           <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">3</span>
//           Bill To (Client)
//         </h3>
//         <div className="grid grid-cols-2 gap-3">
//           <div className="col-span-2">
//             <label className={labelCls}>Client Name</label>
//             <input className={inputCls} value={data.clientName} onChange={e => set('clientName', e.target.value)} />
//           </div>
//           <div className="col-span-2">
//             <label className={labelCls}>Address</label>
//             <input className={inputCls} value={data.clientAddress} onChange={e => set('clientAddress', e.target.value)} />
//           </div>
//           <div>
//             <label className={labelCls}>City</label>
//             <input className={inputCls} value={data.clientCity} onChange={e => set('clientCity', e.target.value)} />
//           </div>
//           <div>
//             <label className={labelCls}>State</label>
//             <input className={inputCls} value={data.clientState} onChange={e => set('clientState', e.target.value)} />
//           </div>
//           <div>
//             <label className={labelCls}>Pincode</label>
//             <input className={inputCls} value={data.clientPincode} onChange={e => set('clientPincode', e.target.value)} />
//           </div>
//           <div>
//             <label className={labelCls}>Phone</label>
//             <input className={inputCls} value={data.clientPhone} onChange={e => set('clientPhone', e.target.value)} />
//           </div>
//           <div>
//             <label className={labelCls}>GSTIN</label>
//             <input className={inputCls} value={data.clientGstin} onChange={e => set('clientGstin', e.target.value)} />
//           </div>
//           <div>
//             <label className={labelCls}>PAN</label>
//             <input className={inputCls} value={data.clientPan} onChange={e => set('clientPan', e.target.value)} />
//           </div>
//         </div>
//       </section>

//       {/* Items */}
//       <section>
//         <h3 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border flex items-center gap-2">
//           <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">4</span>
//           Items / Products
//         </h3>
//         <div className="space-y-3">
//           {data.items.map((item, idx) => (
//             <div key={item.id} className="bg-secondary/40 rounded-lg p-3 border border-border">
//               <div className="flex items-center justify-between mb-2">
//                 <span className="text-xs font-bold text-muted-foreground">Item #{idx + 1}</span>
//                 <button
//                   onClick={() => removeItem(item.id)}
//                   className="text-destructive hover:bg-destructive/10 p-1 rounded transition-colors"
//                   disabled={data.items.length <= 1}
//                 >
//                   <Trash2 size={14} />
//                 </button>
//               </div>
//               <div className="grid grid-cols-2 gap-2">
//                 <div className="col-span-2">
//                   <label className={labelCls}>Item Name</label>
//                   <input className={inputCls} value={item.name} onChange={e => setItem(item.id, 'name', e.target.value)} placeholder="e.g. DIGITAL" />
//                 </div>
//                 <div>
//                   <label className={labelCls}>P.CH No.</label>
//                   <input className={inputCls} value={item.pchNo} onChange={e => setItem(item.id, 'pchNo', e.target.value)} placeholder="P CH NO:76" />
//                 </div>
//                 <div>
//                   <label className={labelCls}>Unit</label>
//                   <select className={inputCls} value={item.unit} onChange={e => setItem(item.id, 'unit', e.target.value)}>
//                     <option>Pcs</option>
//                     <option>Mtrs</option>
//                     <option>Kg</option>
//                     <option>Box</option>
//                     <option>Nos</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className={labelCls}>Quantity</label>
//                   <input type="number" className={inputCls} value={item.qty} onChange={e => setItem(item.id, 'qty', parseFloat(e.target.value) || 0)} />
//                 </div>
//                 <div>
//                   <label className={labelCls}>Rate (₹)</label>
//                   <input type="number" className={inputCls} value={item.rate} onChange={e => setItem(item.id, 'rate', parseFloat(e.target.value) || 0)} />
//                 </div>
//                 <div>
//                   <label className={labelCls}>Discount %</label>
//                   <input type="number" className={inputCls} value={item.discount} onChange={e => setItem(item.id, 'discount', parseFloat(e.target.value) || 0)} />
//                 </div>
//                 <div>
//                   <label className={labelCls}>Tax %</label>
//                   <select className={inputCls} value={item.taxRate} onChange={e => setItem(item.id, 'taxRate', parseFloat(e.target.value))}>
//                     <option value={0}>0%</option>
//                     <option value={5}>5%</option>
//                     <option value={12}>12%</option>
//                     <option value={18}>18%</option>
//                     <option value={28}>28%</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//         <button
//           onClick={addItem}
//           className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-md border-2 border-dashed border-primary/40 text-primary text-sm font-semibold hover:bg-primary/5 transition-colors"
//         >
//           <Plus size={16} /> Add Item
//         </button>
//       </section>

//       {/* Bank Details */}
//       <section>
//         <h3 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border flex items-center gap-2">
//           <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">5</span>
//           Bank Details
//         </h3>
//         <div className="grid grid-cols-1 gap-3">
//           <div>
//             <label className={labelCls}>Bank Name</label>
//             <input className={inputCls} value={data.bank.bankName} onChange={e => set('bank', { ...data.bank, bankName: e.target.value })} />
//           </div>
//           <div>
//             <label className={labelCls}>Account Number</label>
//             <input className={inputCls} value={data.bank.accountNumber} onChange={e => set('bank', { ...data.bank, accountNumber: e.target.value })} />
//           </div>
//           <div>
//             <label className={labelCls}>IFSC Code</label>
//             <input className={inputCls} value={data.bank.ifscCode} onChange={e => set('bank', { ...data.bank, ifscCode: e.target.value })} />
//           </div>
//         </div>
//       </section>

//       {/* Signature */}
//       <section>
//         <h3 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border flex items-center gap-2">
//           <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">6</span>
//           Authorised Signature
//         </h3>
//         <ImageUploadField
//           label="Signature"
//           value={data.signatureUrl}
//           onChange={url => set('signatureUrl', url)}
//           placeholder="Upload Signature Image"
//         />
//       </section>

//       {/* Terms */}
//       <section>
//         <h3 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border flex items-center gap-2">
//           <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">7</span>
//           Terms &amp; Conditions
//         </h3>
//         <div className="space-y-2">
//           {data.terms.map((term, i) => (
//             <div key={i} className="flex gap-2">
//               <span className="text-xs text-muted-foreground mt-2 w-4 shrink-0">({i + 1})</span>
//               <input
//                 className={inputCls}
//                 value={term}
//                 onChange={e => {
//                   const terms = [...data.terms];
//                   terms[i] = e.target.value;
//                   set('terms', terms);
//                 }}
//               />
//               <button
//                 onClick={() => set('terms', data.terms.filter((_, j) => j !== i))}
//                 className="text-destructive hover:bg-destructive/10 p-1 rounded transition-colors mt-1"
//               >
//                 <Trash2 size={13} />
//               </button>
//             </div>
//           ))}
//           <button
//             onClick={() => set('terms', [...data.terms, ''])}
//             className="w-full flex items-center justify-center gap-2 py-2 rounded-md border border-dashed border-muted-foreground/30 text-muted-foreground text-xs hover:bg-muted/50 transition-colors"
//           >
//             <Plus size={13} /> Add Term
//           </button>
//         </div>
//       </section>
//     </div>
//   );
// }

import { useRef } from 'react';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import type { InvoiceData, InvoiceItem, PaidDetails } from '../types/invoice';

interface Props {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

const inputCls = "w-full px-3 py-2 text-sm border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors";
const labelCls = "block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide";

function ImageUploadField({
  label, value, onChange, placeholder
}: { label: string; value: string; onChange: (url: string) => void; placeholder?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full">
      <label className={labelCls}>{label}</label>
      {value ? (
        <div className="flex items-center gap-3 p-2 rounded-md border border-border bg-muted/20 w-full">
          <img src={value} alt={label} className="h-10 w-auto object-contain rounded border border-border bg-white p-0.5" />
          <span className="text-xs text-muted-foreground flex-1 truncate">{label} uploaded</span>
          <button onClick={() => onChange('')} className="p-1 rounded hover:bg-destructive/10 text-destructive transition-colors">
            <X size={13} />
          </button>
        </div>
      ) : (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
          />
          <button
            onClick={() => inputRef.current?.click()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md border border-dashed border-muted-foreground/30 text-sm text-muted-foreground hover:bg-muted/30 hover:border-primary/40 transition-colors"
          >
            <Upload size={14} />
            {placeholder || `Upload ${label}`}
          </button>
        </>
      )}
    </div>
  );
}

export function InvoiceForm({ data, onChange }: Props) {
  const set = (field: keyof InvoiceData, value: unknown) => {
    onChange({ ...data, [field]: value });
  };

  const setItem = (id: string, field: keyof InvoiceItem, value: unknown) => {
    onChange({
      ...data,
      items: data.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const setPaid = (field: keyof PaidDetails, value: string) => {
    onChange({ ...data, paidDetails: { ...data.paidDetails, [field]: value } });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      name: '',
      pchNo: '',
      hsnSac: '',
      qty: 0,
      unit: 'Pcs',
      rate: 0,
      discount: 5,
      discountType: 'percent',
      taxRate: 5,
    };
    onChange({ ...data, items: [...data.items, newItem] });
  };

  const removeItem = (id: string) => {
    if (data.items.length <= 1) return;
    onChange({ ...data, items: data.items.filter((i) => i.id !== id) });
  };

  return (
    <div className="space-y-6">
      {/* Company Info */}
      <section>
        <h3 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">1</span>
          Company (From)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className={labelCls}>Company Name</label>
            <input className={inputCls} value={data.companyName} onChange={e => set('companyName', e.target.value)} placeholder="Your Company Name" />
          </div>
          <div className="col-span-1 md:col-span-1">
            <ImageUploadField
              label="Logo (Left)"
              value={data.companyLogoLeftUrl}
              onChange={url => set('companyLogoLeftUrl', url)}
              placeholder="Upload Left Logo"
            />
          </div>
          <div className="col-span-1 md:col-span-1">
            <ImageUploadField
              label="Logo (Right)"
              value={data.companyLogoRightUrl}
              onChange={url => set('companyLogoRightUrl', url)}
              placeholder="Upload Right Logo"
            />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Address</label>
            <input className={inputCls} value={data.companyAddress} onChange={e => set('companyAddress', e.target.value)} placeholder="Street address" />
          </div>
          <div>
            <label className={labelCls}>City</label>
            <input className={inputCls} value={data.companyCity} onChange={e => set('companyCity', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>State</label>
            <input className={inputCls} value={data.companyState} onChange={e => set('companyState', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Pincode</label>
            <input className={inputCls} value={data.companyPincode} onChange={e => set('companyPincode', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input className={inputCls} value={data.companyPhone} onChange={e => set('companyPhone', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>GSTIN</label>
            <input className={inputCls} value={data.companyGstin} onChange={e => set('companyGstin', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>PAN</label>
            <input className={inputCls} value={data.companyPan} onChange={e => set('companyPan', e.target.value)} />
          </div>
        </div>
      </section>

      {/* Invoice Details */}
      <section>
        <h3 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">2</span>
          Invoice Details
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Bill No.</label>
            <input className={inputCls} value={data.invoiceNumber} onChange={e => set('invoiceNumber', e.target.value)} placeholder="AE-001" />
          </div>
          <div>
            <label className={labelCls}>Bill Date</label>
            <input type="date" className={inputCls} value={data.invoiceDate} onChange={e => set('invoiceDate', e.target.value)} />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.igst}
              onChange={e => set('igst', e.target.checked)}
              className="w-4 h-4 rounded accent-primary"
            />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Use IGST (Inter-State)</span>
          </label>
        </div>
      </section>

      {/* Bill To */}
      <section>
        <h3 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">3</span>
          Bill To (Client)
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className={labelCls}>Client Name</label>
            <input className={inputCls} value={data.clientName} onChange={e => set('clientName', e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Address</label>
            <input className={inputCls} value={data.clientAddress} onChange={e => set('clientAddress', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>City</label>
            <input className={inputCls} value={data.clientCity} onChange={e => set('clientCity', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>State</label>
            <input className={inputCls} value={data.clientState} onChange={e => set('clientState', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Pincode</label>
            <input className={inputCls} value={data.clientPincode} onChange={e => set('clientPincode', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input className={inputCls} value={data.clientPhone} onChange={e => set('clientPhone', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>GSTIN</label>
            <input className={inputCls} value={data.clientGstin} onChange={e => set('clientGstin', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>PAN</label>
            <input className={inputCls} value={data.clientPan} onChange={e => set('clientPan', e.target.value)} />
          </div>
        </div>
      </section>

      {/* Items */}
      <section>
        <h3 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">4</span>
          Items / Products
        </h3>
        <div className="space-y-3">
          {data.items.map((item, idx) => (
            <div key={item.id} className="bg-secondary/40 rounded-lg p-3 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-muted-foreground">Item #{idx + 1}</span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-destructive hover:bg-destructive/10 p-1 rounded transition-colors"
                  disabled={data.items.length <= 1}
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <label className={labelCls}>Description of Goods</label>
                  <input className={inputCls} value={item.name} onChange={e => setItem(item.id, 'name', e.target.value)} placeholder="e.g. Sarees Job Work" />
                </div>
                <div>
                  <label className={labelCls}>P.Ch.No.</label>
                  <input className={inputCls} value={item.pchNo} onChange={e => setItem(item.id, 'pchNo', e.target.value)} placeholder="1090" />
                </div>
                <div>
                  <label className={labelCls}>HSN</label>
                  <input className={inputCls} value={item.hsnSac} onChange={e => setItem(item.id, 'hsnSac', e.target.value)} placeholder="540752" />
                </div>
                <div>
                  <label className={labelCls}>Quantity</label>
                  <input type="number" className={inputCls} value={item.qty || ''} onChange={e => setItem(item.id, 'qty', parseFloat(e.target.value) || 0)} />
                </div>
                <div>
                  <label className={labelCls}>Rate (₹)</label>
                  <input type="number" className={inputCls} value={item.rate || ''} onChange={e => setItem(item.id, 'rate', parseFloat(e.target.value) || 0)} />
                </div>
                <div>
                  <label className={labelCls}>Discount %</label>
                  <input type="number" className={inputCls} value={item.discount || ''} onChange={e => setItem(item.id, 'discount', parseFloat(e.target.value) || 0)} />
                </div>
                <div>
                  <label className={labelCls}>Tax %</label>
                  <select className={inputCls} value={item.taxRate} onChange={e => setItem(item.id, 'taxRate', parseFloat(e.target.value))}>
                    <option value={0}>0%</option>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                    <option value={28}>28%</option>
                  </select>
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

      {/* Paid Details */}
      <section>
        <h3 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">5</span>
          Paid Details
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Amount</label>
            <input className={inputCls} value={data.paidDetails.amount} onChange={e => setPaid('amount', e.target.value)} placeholder="e.g. 20000" />
          </div>
          <div>
            <label className={labelCls}>Cheque No.</label>
            <input className={inputCls} value={data.paidDetails.chequeNo} onChange={e => setPaid('chequeNo', e.target.value)} placeholder="Cheque number" />
          </div>
          <div>
            <label className={labelCls}>Bank</label>
            <input className={inputCls} value={data.paidDetails.bank} onChange={e => setPaid('bank', e.target.value)} placeholder="Bank name" />
          </div>
          <div>
            <label className={labelCls}>Date</label>
            <input type="date" className={inputCls} value={data.paidDetails.date} onChange={e => setPaid('date', e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Total Amount in Words (blank = auto)</label>
            <input className={inputCls} value={data.paidDetails.totalAmountInWords} onChange={e => setPaid('totalAmountInWords', e.target.value)} placeholder="Leave blank to auto-calculate" />
          </div>
          <div>
            <label className={labelCls}>TDS</label>
            <input className={inputCls} value={data.paidDetails.tds} onChange={e => setPaid('tds', e.target.value)} placeholder="TDS amount" />
          </div>
          <div>
            <label className={labelCls}>Total Pay Rs.</label>
            <input className={inputCls} value={data.paidDetails.totalPayRs} onChange={e => setPaid('totalPayRs', e.target.value)} placeholder="Final payable" />
          </div>
        </div>
      </section>

      {/* Bank Details */}
      <section>
        <h3 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">6</span>
          Bank Details
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className={labelCls}>Bank Name</label>
            <input className={inputCls} value={data.bank.bankName} onChange={e => set('bank', { ...data.bank, bankName: e.target.value })} />
          </div>
          <div>
            <label className={labelCls}>Account Number</label>
            <input className={inputCls} value={data.bank.accountNumber} onChange={e => set('bank', { ...data.bank, accountNumber: e.target.value })} />
          </div>
          <div>
            <label className={labelCls}>IFSC Code</label>
            <input className={inputCls} value={data.bank.ifscCode} onChange={e => set('bank', { ...data.bank, ifscCode: e.target.value })} />
          </div>
        </div>
      </section>

      {/* Signature */}
      <section>
        <h3 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">7</span>
          Authorised Signature
        </h3>
        <ImageUploadField
          label="Signature"
          value={data.signatureUrl}
          onChange={url => set('signatureUrl', url)}
          placeholder="Upload Signature Image"
        />
      </section>

      {/* Terms */}
      <section>
        <h3 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">8</span>
          Terms &amp; Conditions
        </h3>
        <div className="space-y-2">
          {data.terms.map((term, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-xs text-muted-foreground mt-2 w-4 shrink-0">({i + 1})</span>
              <input
                className={inputCls}
                value={term}
                onChange={e => {
                  const terms = [...data.terms];
                  terms[i] = e.target.value;
                  set('terms', terms);
                }}
              />
              <button
                onClick={() => set('terms', data.terms.filter((_, j) => j !== i))}
                className="text-destructive hover:bg-destructive/10 p-1 rounded transition-colors mt-1"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <button
            onClick={() => set('terms', [...data.terms, ''])}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-md border border-dashed border-muted-foreground/30 text-muted-foreground text-xs hover:bg-muted/50 transition-colors"
          >
            <Plus size={13} /> Add Term
          </button>
        </div>
      </section>
    </div>
  );
}
