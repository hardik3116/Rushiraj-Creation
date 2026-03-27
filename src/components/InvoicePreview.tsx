import React from 'react';
import type { InvoiceData } from '../types/invoice';
import { numberToWords } from '../utils/numberToWords';

interface Props {
  data: InvoiceData;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const InvoicePreview = React.forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const totalQty = data.items.reduce((sum, item) => sum + item.qty, 0);
  const basicAmount = data.items.reduce((sum, item) => sum + (item.qty * item.rate), 0);
  const discountAmount = data.items.reduce((sum, item) => {
    if (item.discountType === 'percent') {
      return sum + ((item.qty * item.rate) * (item.discount / 100));
    }
    return sum + (item.discount);
  }, 0);

  const taxableAmount = basicAmount - discountAmount;
  
  const totalTaxAmount = data.items.reduce((sum, item) => {
    const itemBasic = item.qty * item.rate;
    const itemDiscount = item.discountType === 'percent' 
      ? itemBasic * (item.discount / 100) 
      : item.discount;
    const itemTaxable = itemBasic - itemDiscount;
    return sum + (itemTaxable * (item.taxRate / 100));
  }, 0);

  const cgstAmount = data.igst ? 0 : totalTaxAmount / 2;
  const sgstAmount = data.igst ? 0 : totalTaxAmount / 2;
  const igstAmount = data.igst ? totalTaxAmount : 0;
  const totalRaw = taxableAmount + totalTaxAmount;
  const netPayable = Math.round(totalRaw);
  const roundOff = netPayable - totalRaw;

  const hsnMap: Record<string, { taxable: number, taxRate: number }> = {};
  data.items.forEach(item => {
    const key = item.hsnSac || 'Without HSN';
    if (!hsnMap[key]) {
      hsnMap[key] = { taxable: 0, taxRate: item.taxRate };
    }
    const itemBasic = item.qty * item.rate;
    const itemDiscount = item.discountType === 'percent' 
      ? itemBasic * (item.discount / 100) 
      : item.discount;
    hsnMap[key].taxable += (itemBasic - itemDiscount);
  });

  return (
    <div ref={ref} id="invoice-preview" className="bg-white w-[794px] min-h-[1123px] print:min-h-0 pb-8 pt-8 px-8 box-border text-[12px] text-[#111] mx-auto relative print:w-full print:h-auto print:overflow-hidden print:pb-2" style={{ fontFamily: "'Inter', Arial, sans-serif" }}>
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#1E3A8A] text-white flex flex-col items-center justify-center font-bold text-[22px] rounded-sm leading-none">
            {data.companyName.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase().split('').map((char, idx) => (
              <span key={idx} className={idx === 1 ? "ml-1.5" : ""}>{char}</span>
            ))}
          </div>
          <div>
            <h1 className="m-0 text-[#1E3A8A] font-bold text-2xl leading-tight">{data.companyName}</h1>
            <p className="m-0 text-gray-700 text-[12px] mt-1 pr-10">{data.companyAddress}, {data.companyCity}, {data.companyPincode}, {data.companyState}</p>
            <p className="m-0 text-gray-700 text-[12px] font-semibold mt-0.5">Phone: {data.companyPhone}</p>
          </div>
        </div>
        <div className="text-right text-[11px] text-gray-600 whitespace-nowrap mt-1 leading-tight">
          <div className="mb-0.5"><span className="font-bold text-gray-800">GSTIN:</span> {data.companyGstin}</div>
          <div><span className="font-bold text-gray-800">PAN:</span> {data.companyPan}</div>
        </div>
      </div>
      
      <div className="border-t-[3px] border-[#1E3A8A] mb-4"></div>

      {/* BILL TO & INVOICE DETAILS */}
      <div className="flex justify-between mb-6">
        <div className="flex-1 pr-4">
          <div className="text-[11px] text-gray-500 font-bold mb-2 uppercase tracking-wide">BILL TO</div>
          <h2 className="m-0 font-bold text-base text-gray-900 mb-1.5">{data.clientName}</h2>
          <p className="m-0 text-gray-700 text-[13px] leading-snug">{data.clientAddress}, {data.clientCity}, {data.clientPincode},<br/>{data.clientState}</p>
          <p className="m-0 text-gray-700 text-[13px] font-semibold mt-1.5">Mo: {data.clientPhone}</p>
          <div className="flex gap-4 text-gray-700 text-[12px] mt-1.5">
             <span>GSTIN: <span className="text-gray-900 font-bold">{data.clientGstin}</span></span>
             <span>PAN: <span className="text-gray-900 font-bold">{data.clientPan}</span></span>
          </div>
        </div>
        <div className="w-72 bg-gray-50 p-4 rounded-sm border border-gray-200">
          <h3 className="m-0 text-[#1E3A8A] font-bold text-[15px] mb-3">Invoice</h3>
          <div className="flex justify-between mb-2.5 pb-2.5 border-b border-gray-200">
            <span className="text-gray-600 text-[13px]">Number:</span>
            <span className="font-bold text-[14px] text-gray-900">{data.invoiceNumber.padStart(2, '0')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 text-[13px]">Date:</span>
            <span className="font-bold text-[14px] text-gray-900">{formatDate(data.invoiceDate)}</span>
          </div>
        </div>
      </div>

      {/* ITEMS TABLE */}
      <table className="w-full border-collapse mb-1 text-[12px]">
        <thead>
          <tr className="bg-[#1E3A8A] text-white">
            <th className="py-2.5 px-2 text-left w-10 border border-[#1E3A8A]">#</th>
            <th className="py-2.5 px-2 text-left border border-[#1E3A8A]">Item</th>
            <th className="py-2.5 px-2 text-center w-20 border border-[#1E3A8A]">Qty</th>
            <th className="py-2.5 px-2 text-right w-20 border border-[#1E3A8A]">Rate</th>
            <th className="py-2.5 px-2 text-right w-28 border border-[#1E3A8A]">Discount</th>
            <th className="py-2.5 px-2 text-right w-24 border border-[#1E3A8A]">Amount</th>
            <th className="py-2.5 px-2 text-right w-28 border border-[#1E3A8A]">Taxes</th>
            <th className="py-2.5 px-2 text-right w-28 border border-[#1E3A8A]">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => {
             const itemBasic = item.qty * item.rate;
             const itemDiscount = item.discountType === 'percent' ? itemBasic * (item.discount / 100) : item.discount;
             const itemTaxable = itemBasic - itemDiscount;
             const itemTax = itemTaxable * (item.taxRate / 100);
             const itemTotal = itemTaxable + itemTax;
             return (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-2.5 px-2 border-l border-gray-200 align-top text-gray-700">{index + 1}</td>
                <td className="py-2.5 px-2 align-top">
                  <div className="font-bold text-[13px] text-gray-900">{item.name}</div>
                  {item.pchNo && <div className="text-[11px] font-semibold text-gray-500 mt-1">P.CH NO: {item.pchNo}</div>}
                </td>
                <td className="py-2.5 px-2 text-center align-top whitespace-nowrap text-gray-800 font-semibold">{item.qty} {item.unit}</td>
                <td className="py-2.5 px-2 text-right align-top text-gray-800">{item.rate.toFixed(2)}</td>
                <td className="py-2.5 px-2 text-right align-top text-gray-800">{itemDiscount.toLocaleString('en-IN', {minimumFractionDigits:2})} <span className="text-gray-500 font-medium">({item.discount}%)</span></td>
                <td className="py-2.5 px-2 text-right align-top text-gray-800">{itemTaxable.toLocaleString('en-IN', {minimumFractionDigits:2})}</td>
                <td className="py-2.5 px-2 text-right align-top text-gray-800">{itemTax.toLocaleString('en-IN', {minimumFractionDigits:2})} <span className="text-gray-500 font-medium">({item.taxRate}%)</span></td>
                <td className="py-2.5 px-2 text-right border-r border-gray-200 font-bold align-top text-[13px] text-gray-900">{itemTotal.toLocaleString('en-IN', {minimumFractionDigits:2})}</td>
              </tr>
            )
          })}
          {Array.from({length: Math.max(0, 4 - data.items.length)}).map((_, i) => (
            <tr key={`empty-${i}`} className="border-b border-gray-200 h-[40px]">
              <td className="border-l border-gray-200"></td>
              <td></td><td></td><td></td><td></td><td></td><td></td>
              <td className="border-r border-gray-200"></td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* TOTAL QTY ROW */}
      <div className="flex justify-end bg-gray-50 border border-gray-200 py-2.5 px-3 text-[12px] font-bold mb-5 text-gray-800">
        Total qty {totalQty}({data.items[0]?.unit || 'Pcs'})
      </div>

      <div className="flex gap-5">
        {/* LEFT COLUMN - HSN, Payable in words */}
        <div className="flex-1">
           <div className="border border-gray-200 rounded-sm mb-5">
              <div className="bg-gray-50 p-2.5 text-[11px] text-gray-600 font-bold uppercase tracking-wide border-b border-gray-200">
                NET PAYABLE IN WORDS
              </div>
              <div className="p-3 font-bold text-[14px] text-gray-900 leading-snug">
                {numberToWords(netPayable)}
              </div>
           </div>

           {/* HSN TABLE */}
           <table className="w-full border-collapse text-[11px] mb-3">
             <thead>
               <tr className="bg-[#1E3A8A] text-white">
                 <th className="py-2 px-2 text-left border border-[#1E3A8A]">HSN/SAC</th>
                 <th className="py-2 px-2 text-right border border-[#1E3A8A]">Taxable Amount</th>
                 {!data.igst && (
                   <>
                     <th className="py-2 px-2 text-right border border-[#1E3A8A]">CGST</th>
                     <th className="py-2 px-2 text-right border border-[#1E3A8A]">SGST</th>
                   </>
                 )}
                 {data.igst && <th className="py-2 px-2 text-right border border-[#1E3A8A]">IGST</th>}
                 <th className="py-2 px-2 text-right border border-[#1E3A8A]">Tax Amount</th>
               </tr>
             </thead>
             <tbody>
               {Object.entries(hsnMap).map(([hsn, val]) => {
                  const taxHalf = (val.taxable * (val.taxRate/100)) / 2;
                  const taxFull = taxHalf * 2;
                  return (
                    <tr key={hsn} className="border-b border-gray-200 h-8 text-gray-800">
                      <td className="py-1.5 px-2 border-l border-gray-200 font-semibold">{hsn}</td>
                      <td className="py-1.5 px-2 text-right">{val.taxable.toLocaleString('en-IN', {minimumFractionDigits:2})}</td>
                      {!data.igst && (
                        <>
                          <td className="py-1.5 px-2 text-right">{taxHalf.toLocaleString('en-IN', {minimumFractionDigits:2})} <span className="text-gray-500 font-medium">({val.taxRate/2}%)</span></td>
                          <td className="py-1.5 px-2 text-right">{taxHalf.toLocaleString('en-IN', {minimumFractionDigits:2})} <span className="text-gray-500 font-medium">({val.taxRate/2}%)</span></td>
                        </>
                      )}
                      {data.igst && (
                        <td className="py-1.5 px-2 text-right">{taxFull.toLocaleString('en-IN', {minimumFractionDigits:2})} <span className="text-gray-500 font-medium">({val.taxRate}%)</span></td>
                      )}
                      <td className="py-1.5 px-2 text-right border-r border-gray-200 font-semibold">{taxFull.toLocaleString('en-IN', {minimumFractionDigits:2})}</td>
                    </tr>
                  )
               })}
               <tr className="bg-gray-50 font-bold text-gray-900 h-8 text-[12px]">
                 <td className="py-1.5 px-2 border-l border-gray-200 border-b border-gray-200">Total</td>
                 <td className="py-1.5 px-2 text-right border-b border-gray-200">{taxableAmount.toLocaleString('en-IN', {minimumFractionDigits:2})}</td>
                 {!data.igst && (
                   <>
                     <td className="py-1.5 px-2 text-right border-b border-gray-200">{cgstAmount.toLocaleString('en-IN', {minimumFractionDigits:2})}</td>
                     <td className="py-1.5 px-2 text-right border-b border-gray-200">{sgstAmount.toLocaleString('en-IN', {minimumFractionDigits:2})}</td>
                   </>
                 )}
                 {data.igst && <td className="py-1.5 px-2 text-right border-b border-gray-200">{igstAmount.toLocaleString('en-IN', {minimumFractionDigits:2})}</td>}
                 <td className="py-1.5 px-2 text-right border-r border-gray-200 border-b border-gray-200">{totalTaxAmount.toLocaleString('en-IN', {minimumFractionDigits:2})}</td>
               </tr>
             </tbody>
           </table>
           
           <div className="text-[12px] text-gray-600 mb-8 italic">
             Tax amount in words: <span className="font-bold text-gray-800 not-italic">{numberToWords(totalTaxAmount)}</span>
           </div>

           {/* BANK DETAILS */}
           {data.bank && (data.bank.bankName || data.bank.accountNumber || data.bank.ifscCode) && (
             <div className="mt-5 border border-gray-200 rounded-sm p-3">
               <div className="font-bold text-[12px] text-[#1E3A8A] mb-2 uppercase tracking-wide border-b border-gray-100 pb-1">Bank Details</div>
               <div className="text-[11px] text-gray-800 space-y-1">
                 {data.bank.bankName && <div><span className="font-semibold text-gray-600 w-24 inline-block">Bank Name:</span> <span className="font-bold">{data.bank.bankName}</span></div>}
                 {data.bank.accountNumber && <div><span className="font-semibold text-gray-600 w-24 inline-block">Account No:</span> <span className="font-bold">{data.bank.accountNumber}</span></div>}
                 {data.bank.ifscCode && <div><span className="font-semibold text-gray-600 w-24 inline-block">IFSC Code:</span> <span className="font-bold">{data.bank.ifscCode}</span></div>}
               </div>
             </div>
           )}

           {/* TERMS */}
           <div className="mt-5">
             <div className="font-bold text-[12px] text-gray-800 mb-1.5">Terms and Conditions</div>
             <ol className="m-0 pl-4 text-[11px] text-gray-700 space-y-1 list-none font-medium">
               {data.terms.map((term, i) => (
                 <li key={i}>({i+1}) {term}</li>
               ))}
             </ol>
           </div>
        </div>

        {/* RIGHT COLUMN - Totals */}
        <div className="w-72 flex flex-col justify-between">
           <div className="border border-gray-200 rounded-sm overflow-hidden text-[13px]">
             <div className="flex justify-between py-2 px-3 border-b border-gray-200">
               <span className="text-gray-700 font-semibold">Basic Amount</span>
               <span className="font-bold text-gray-900">₹ {basicAmount.toLocaleString('en-IN', {minimumFractionDigits:2})}</span>
             </div>
             <div className="flex justify-between py-2 px-3 border-b border-gray-200">
               <span className="text-gray-700 font-semibold">Discount</span>
               <span className="font-bold text-red-600">-₹ {discountAmount.toLocaleString('en-IN', {minimumFractionDigits:2})}</span>
             </div>
             {!data.igst ? (
               <>
                 <div className="flex justify-between py-2 px-3 border-b border-gray-200">
                   <span className="text-gray-700 font-semibold">CGST</span>
                   <span className="font-bold text-gray-900">₹ {cgstAmount.toLocaleString('en-IN', {minimumFractionDigits:2})}</span>
                 </div>
                 <div className="flex justify-between py-2 px-3 border-b border-gray-200">
                   <span className="text-gray-700 font-semibold">SGST</span>
                   <span className="font-bold text-gray-900">₹ {sgstAmount.toLocaleString('en-IN', {minimumFractionDigits:2})}</span>
                 </div>
               </>
             ) : (
               <div className="flex justify-between py-2 px-3 border-b border-gray-200">
                 <span className="text-gray-700 font-semibold">IGST</span>
                 <span className="font-bold text-gray-900">₹ {igstAmount.toLocaleString('en-IN', {minimumFractionDigits:2})}</span>
               </div>
             )}
             <div className="flex justify-between py-2 px-3 border-b border-gray-200">
               <span className="text-gray-700 font-semibold">Round off</span>
               <span className="font-bold text-gray-900">₹ {roundOff > 0 ? '' : ''}{roundOff.toFixed(2)}</span>
             </div>
             <div className="flex justify-between py-3 px-3 bg-[#1E3A8A] text-white font-bold text-[15px]">
               <span>Net payable</span>
               <span>₹ {netPayable.toLocaleString('en-IN', {minimumFractionDigits:2})}</span>
             </div>
           </div>

           <div className="text-right mt-12 pb-4">
             <div className="text-[12px] text-gray-700 font-semibold mb-2">Authorised Signature</div>
             <div className="h-16 flex items-end justify-end mb-1">
               {data.signatureUrl ? (
                 <img src={data.signatureUrl} alt="Signature" className="max-h-16 max-w-[180px] object-contain rounded-sm" />
               ) : null}
             </div>
             <div className="border-t border-gray-400 pt-1.5 inline-block text-[11px] font-bold text-gray-600 uppercase tracking-wide min-w-[200px] text-center">
               For {data.companyName}
             </div>
           </div>
        </div>
      </div>
      
      <div className="absolute bottom-5 left-0 right-0 text-center text-[10px] font-semibold text-gray-400">
        Generated using Bill PDF Tool
      </div>

    </div>
  );
});

InvoicePreview.displayName = 'InvoicePreview';
