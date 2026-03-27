import { useRef, useState } from 'react';
import { Plus, Trash2, Upload, Sparkles } from 'lucide-react';
import type { InvoiceData, InvoiceItem } from '../types/invoice';

interface Props {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

const inputCls = 'w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm bg-white text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder:text-gray-400';
const labelCls = 'block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest';

function getNextItemId() {
  return Date.now().toString();
}

function Section({ title, num, children }: { title: string, num: number, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="border-b border-gray-200 pb-5 mb-5 last:border-0 last:pb-0 last:mb-0">
      <div 
        className="flex items-center gap-3 cursor-pointer mb-4 select-none hover:opacity-80 transition-opacity"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-5 h-5 rounded-full bg-[#1e293b] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
          {num}
        </div>
        <h3 className="text-[13px] font-bold text-[#1e293b] flex-1">{title}</h3>
      </div>
      {isOpen && <div className="space-y-4 pl-1">{children}</div>}
    </div>
  );
}

export function InvoiceForm({ data, onChange }: Props) {
  const set = (field: keyof InvoiceData, value: unknown) => onChange({ ...data, [field]: value });
  
  const setBank = (field: string, value: string) => onChange({ ...data, bank: { ...data.bank, [field]: value } });
  const setPaid = (field: string, value: string) => onChange({ ...data, paidDetails: { ...data.paidDetails, [field]: value } });

  const setItem = (id: string, updates: Partial<InvoiceItem>) => {
    onChange({
      ...data,
      items: data.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    });
  };

  const addItem = () => {
    onChange({
      ...data,
      items: [
        ...data.items,
        {
          id: getNextItemId(),
          name: '',
          pchNo: '',
          hsnSac: '',
          qty: 0,
          unit: 'Pcs',
          rate: 0,
          discount: 0,
          discountType: 'percent',
          taxRate: 5,
        },
      ],
    });
  };

  const removeItem = (id: string) => {
    if (data.items.length <= 1) return;
    onChange({ ...data, items: data.items.filter((item) => item.id !== id) });
  };

  const updateTerm = (index: number, value: string) => {
    const newTerms = [...data.terms];
    newTerms[index] = value;
    set('terms', newTerms);
  };
  
  const addTerm = () => set('terms', [...data.terms, '']);
  const removeTerm = (index: number) => set('terms', data.terms.filter((_, i) => i !== index));

  return (
    <div className="bg-white p-5 rounded-sm shadow-sm border border-gray-200 max-w-xl mx-auto h-full overflow-y-auto" style={{ maxHeight: '90vh' }}>
      
      {/* Form Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-[15px] font-bold text-gray-800">Invoice Details</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">Fill in the details to generate your invoice</p>
        </div>
        <button className="px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-sm text-[11px] font-bold hover:bg-indigo-100 flex items-center gap-1.5 transition-colors">
          <Sparkles size={12} className="text-indigo-600" /> AI Scan
        </button>
      </div>

      <div className="space-y-1">
        
        {/* 1. Company (From) */}
        <Section num={1} title="Company (From)">
          <div>
            <label className={labelCls}>Company Name</label>
            <input className={inputCls} placeholder="RUSHIRAJ CREATION" value={data.companyName} onChange={e => set('companyName', e.target.value)} />
          </div>

          <div>
            <label className={labelCls}>Address</label>
            <input className={inputCls} placeholder="E-196, Matrushakti Society..." value={data.companyAddress} onChange={e => set('companyAddress', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div><label className={labelCls}>City</label><input className={inputCls} placeholder="Surat" value={data.companyCity} onChange={e => set('companyCity', e.target.value)} /></div>
            <div><label className={labelCls}>State</label><input className={inputCls} placeholder="Gujarat" value={data.companyState} onChange={e => set('companyState', e.target.value)} /></div>
            <div><label className={labelCls}>Pincode</label><input className={inputCls} placeholder="395006" value={data.companyPincode} onChange={e => set('companyPincode', e.target.value)} /></div>
            <div><label className={labelCls}>Phone</label><input className={inputCls} placeholder="96246 57000" value={data.companyPhone} onChange={e => set('companyPhone', e.target.value)} /></div>
            <div><label className={labelCls}>GSTIN</label><input className={inputCls} placeholder="24AQPPD..." value={data.companyGstin} onChange={e => set('companyGstin', e.target.value)} /></div>
            <div><label className={labelCls}>PAN</label><input className={inputCls} placeholder="AQPPD..." value={data.companyPan} onChange={e => set('companyPan', e.target.value)} /></div>
          </div>
        </Section>

        {/* 2. Invoice Details */}
        <Section num={2} title="Invoice Details">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Bill No.</label><input className={inputCls} placeholder="4" value={data.invoiceNumber} onChange={e => set('invoiceNumber', e.target.value)} /></div>
            <div><label className={labelCls}>Bill Date</label><input type="date" className={inputCls} value={data.invoiceDate} onChange={e => set('invoiceDate', e.target.value)} /></div>
          </div>
          <div className="flex items-center gap-2 mt-3 pl-1">
            <input type="checkbox" id="igst" checked={data.igst} onChange={e => set('igst', e.target.checked)} className="w-4 h-4 rounded-sm border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
            <label htmlFor="igst" className="text-[11px] font-bold text-gray-600 block pt-0.5 cursor-pointer select-none">USE IGST (INTER-STATE)</label>
          </div>
        </Section>

        {/* 3. Bill To (Client) */}
        <Section num={3} title="Bill To (Client)">
          <div>
            <label className={labelCls}>Client Name</label>
            <input className={inputCls} placeholder="AARADHYA SAREES" value={data.clientName} onChange={e => set('clientName', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Address</label>
            <input className={inputCls} placeholder="G-6, De-Ventura Textile Hub..." value={data.clientAddress} onChange={e => set('clientAddress', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div><label className={labelCls}>City</label><input className={inputCls} placeholder="Surat" value={data.clientCity} onChange={e => set('clientCity', e.target.value)} /></div>
            <div><label className={labelCls}>State</label><input className={inputCls} placeholder="Gujarat" value={data.clientState} onChange={e => set('clientState', e.target.value)} /></div>
            <div><label className={labelCls}>Pincode</label><input className={inputCls} placeholder="395002" value={data.clientPincode} onChange={e => set('clientPincode', e.target.value)} /></div>
            <div><label className={labelCls}>Phone</label><input className={inputCls} placeholder="9624657000" value={data.clientPhone} onChange={e => set('clientPhone', e.target.value)} /></div>
            <div><label className={labelCls}>GSTIN</label><input className={inputCls} placeholder="24AHCP..." value={data.clientGstin} onChange={e => set('clientGstin', e.target.value)} /></div>
            <div><label className={labelCls}>PAN</label><input className={inputCls} placeholder="AHCP..." value={data.clientPan} onChange={e => set('clientPan', e.target.value)} /></div>
          </div>
        </Section>

        {/* 4. Items / Products */}
        <Section num={4} title="Items / Products">
          <div className="space-y-4">
            {data.items.map((item, idx) => (
              <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-sm p-4 relative">
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold text-slate-700">Item #{idx + 1}</span>
                  <button onClick={() => removeItem(item.id)} disabled={data.items.length <= 1} className="text-red-400 hover:text-red-600 transition-colors p-1" title="Remove Item">
                    <Trash2 size={14} className={data.items.length <= 1 ? "opacity-50 cursor-not-allowed" : ""} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                  <div className="col-span-2">
                    <label className={labelCls}>Description Of Goods</label>
                    <input className={inputCls} placeholder="Sarees Job Work" value={item.name} onChange={e => setItem(item.id, { name: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelCls}>P.Ch.No.</label>
                    <input className={inputCls} placeholder="1090" value={item.pchNo} onChange={e => setItem(item.id, { pchNo: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelCls}>HSN</label>
                    <input className={inputCls} placeholder="540752" value={item.hsnSac} onChange={e => setItem(item.id, { hsnSac: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelCls}>Quantity</label>
                    <input type="number" className={inputCls} placeholder="e.g. 274" value={item.qty || ''} onChange={e => setItem(item.id, { qty: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className={labelCls}>Rate (₹)</label>
                    <input type="number" className={inputCls} placeholder="e.g. 75" value={item.rate || ''} onChange={e => setItem(item.id, { rate: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className={labelCls}>Discount %</label>
                    <input type="number" className={inputCls} placeholder="e.g. 5" value={item.discount || ''} onChange={e => setItem(item.id, { discount: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className={labelCls}>Tax %</label>
                    <div className="relative">
                      <select className={`${inputCls} appearance-none pr-8 cursor-pointer`} value={item.taxRate} onChange={e => setItem(item.id, { taxRate: Number(e.target.value) })}>
                        <option value={0}>0%</option>
                        <option value={5}>5%</option>
                        <option value={12}>12%</option>
                        <option value={18}>18%</option>
                        <option value={28}>28%</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
          <button onClick={addItem} className="mt-4 w-full flex items-center justify-center gap-2 rounded-sm border border-dashed border-gray-300 py-2.5 text-[12px] font-bold text-indigo-500 hover:bg-indigo-50 hover:border-indigo-200 transition-colors">
            <Plus size={14} /> Add Item
          </button>
        </Section>



        {/* 6. Bank Details */}
        <Section num={6} title="Bank Details">
           <div className="space-y-3">
             <div><label className={labelCls}>Bank Name</label><input className={inputCls} placeholder="THE VARACHHA CO-OP BANK LTD" value={data.bank?.bankName || ''} onChange={e => setBank('bankName', e.target.value)} /></div>
             <div><label className={labelCls}>Account Number</label><input className={inputCls} placeholder="00130111471559" value={data.bank?.accountNumber || ''} onChange={e => setBank('accountNumber', e.target.value)} /></div>
             <div><label className={labelCls}>IFSC Code</label><input className={inputCls} placeholder="VARA0289001" value={data.bank?.ifscCode || ''} onChange={e => setBank('ifscCode', e.target.value)} /></div>
           </div>
        </Section>

        {/* 7. Authorised Signature */}
        <Section num={7} title="Authorised Signature">
           <div>
             <label className={labelCls}>Signature</label>
             <label className="border border-dashed border-gray-300 rounded-sm p-3 h-[42px] flex items-center justify-center text-[11px] font-semibold text-gray-400 gap-2 cursor-pointer hover:bg-gray-50 transition-colors w-full cursor-pointer relative overflow-hidden">
               <Upload size={14} /> {data.signatureUrl ? 'Change Signature Image' : 'Upload Signature Image'}
               <input 
                 type="file" 
                 accept="image/*" 
                 className="hidden" 
                 onChange={(e) => {
                   const file = e.target.files?.[0];
                   if (file) {
                     const reader = new FileReader();
                     reader.onloadend = () => {
                       set('signatureUrl', reader.result as string);
                     };
                     reader.readAsDataURL(file);
                   }
                 }} 
               />
             </label>
             {data.signatureUrl && (
               <div className="mt-2 flex justify-between items-center">
                 <img src={data.signatureUrl} alt="Signature" className="h-8 object-contain" />
                 <button onClick={() => set('signatureUrl', '')} className="text-[10px] font-bold text-red-400 flex items-center gap-1 hover:text-red-500">
                   <Trash2 size={12} /> Remove
                 </button>
               </div>
             )}
           </div>
        </Section>

        {/* 8. Terms & Conditions */}
        <Section num={8} title="Terms & Conditions">
           <div className="space-y-2">
             {data.terms.map((term, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <div className="w-6 flex justify-center text-[11px] font-bold text-gray-400">({idx + 1})</div>
                  <input className={inputCls} value={term} onChange={e => updateTerm(idx, e.target.value)} />
                  <button onClick={() => removeTerm(idx)} className="text-red-400 hover:text-red-600 transition-colors bg-red-50 p-1.5 rounded-sm" title="Remove Term">
                    <Trash2 size={14}/>
                  </button>
                </div>
             ))}
             <button onClick={addTerm} className="mt-3 w-full flex items-center justify-center gap-2 rounded-sm border border-dashed border-gray-300 py-2.5 text-[11px] font-bold text-gray-500 hover:bg-gray-50 transition-colors">
               <Plus size={13} /> Add Term
             </button>
           </div>
        </Section>

      </div>
    </div>
  );
}
