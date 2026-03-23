import React from 'react';
import type { InvoiceData } from '../types/invoice';
import { calcItem, calcTotals, numberToWords } from '../lib/calculations';

interface Props {
  data: InvoiceData;
}

export const InvoicePreview = React.forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const totals = calcTotals(data.items, data.igst);

  const fmt = (n: number) =>
    n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const formatDate = (d: string) => {
    if (!d) return '';
    const dt = new Date(d);
    return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div
      ref={ref}
      id="invoice-preview"
      style={{
        width: '794px',
        minHeight: '1123px',
        backgroundColor: '#ffffff',
        fontFamily: "'DM Sans', Arial, sans-serif",
        fontSize: '13px',
        color: '#1a1a1a',
        padding: '28px 32px',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        {/* Company logo + info */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', flex: 1 }}>
          {/* Logo */}
          {data.companyLogoUrl ? (
            <img
              src={data.companyLogoUrl}
              alt="Company Logo"
              style={{ width: '60px', height: '60px', objectFit: 'contain', borderRadius: '6px', flexShrink: 0 }}
            />
          ) : (
            <div style={{
              width: '56px', height: '56px', borderRadius: '8px',
              background: '#1a3a6e', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'white', fontWeight: 700,
              fontSize: '20px', flexShrink: 0,
            }}>
              {data.companyName.charAt(0)}
            </div>
          )}
          <div>
            <div style={{ fontWeight: 700, fontSize: '20px', color: '#1a1a1a', lineHeight: 1.2 }}>
              {data.companyName}
            </div>
            <div style={{ color: '#374151', fontSize: '12px', marginTop: '3px', lineHeight: 1.5 }}>
              {data.companyAddress}, {data.companyCity}, {data.companyPincode},
              <br />{data.companyState}
              <br />Phone: {data.companyPhone}
            </div>
          </div>
        </div>
        {/* GSTIN/PAN */}
        <div style={{ textAlign: 'right', fontSize: '12px', lineHeight: 1.8 }}>
          <div><span style={{ color: '#6b7280' }}>GSTIN:</span> <strong>{data.companyGstin}</strong></div>
          <div><span style={{ color: '#6b7280' }}>PAN:</span> <strong>{data.companyPan}</strong></div>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '2px solid #1a3a6e', marginBottom: '14px' }} />

      {/* Bill To + Invoice Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', marginBottom: '20px' }}>
        {/* Bill To */}
        <div style={{ flex: 1, background: '#f8f9fc', borderRadius: '6px', padding: '12px 14px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontWeight: 700, fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
            Bill To
          </div>
          <div style={{ fontWeight: 700, fontSize: '14px', color: '#1a1a1a', marginBottom: '4px' }}>
            {data.clientName}
          </div>
          <div style={{ fontSize: '12px', color: '#374151', lineHeight: 1.6 }}>
            {data.clientAddress}, {data.clientCity}, {data.clientPincode},<br />
            {data.clientState}
          </div>
          {data.clientPhone && (
            <div style={{ fontSize: '12px', color: '#374151', marginTop: '4px' }}>Mo: {data.clientPhone}</div>
          )}
          {data.clientGstin && (
            <div style={{ fontSize: '12px', color: '#374151', marginTop: '2px' }}>
              GSTIN: {data.clientGstin}&nbsp;&nbsp;PAN: {data.clientPan}
            </div>
          )}
        </div>

        {/* Invoice Box */}
        <div style={{ width: '200px', background: '#f8f9fc', borderRadius: '6px', padding: '12px 14px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontWeight: 700, fontSize: '16px', color: '#1a3a6e', marginBottom: '10px' }}>Invoice</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ fontSize: '11px', color: '#6b7280', paddingBottom: '4px' }}>Number:</td>
                <td style={{ fontSize: '12px', fontWeight: 700, textAlign: 'right', paddingBottom: '4px' }}>{data.invoiceNumber}</td>
              </tr>
              <tr>
                <td style={{ fontSize: '11px', color: '#6b7280' }}>Date:</td>
                <td style={{ fontSize: '12px', fontWeight: 600, textAlign: 'right' }}>{formatDate(data.invoiceDate)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Items Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th style={{ width: '28px', background: '#1a3a6e', color: 'white', padding: '8px 6px', border: '1px solid #1a3a6e', fontSize: '12px', textAlign: 'center' }}>#</th>
            <th style={{ background: '#1a3a6e', color: 'white', padding: '8px 8px', border: '1px solid #1a3a6e', fontSize: '12px', textAlign: 'left' }}>Item</th>
            <th style={{ width: '60px', background: '#1a3a6e', color: 'white', padding: '8px 6px', border: '1px solid #1a3a6e', fontSize: '12px', textAlign: 'center' }}>Qty</th>
            <th style={{ width: '70px', background: '#1a3a6e', color: 'white', padding: '8px 6px', border: '1px solid #1a3a6e', fontSize: '12px', textAlign: 'right' }}>Rate</th>
            <th style={{ width: '100px', background: '#1a3a6e', color: 'white', padding: '8px 6px', border: '1px solid #1a3a6e', fontSize: '12px', textAlign: 'right' }}>Discount</th>
            <th style={{ width: '80px', background: '#1a3a6e', color: 'white', padding: '8px 6px', border: '1px solid #1a3a6e', fontSize: '12px', textAlign: 'right' }}>Amount</th>
            <th style={{ width: '90px', background: '#1a3a6e', color: 'white', padding: '8px 6px', border: '1px solid #1a3a6e', fontSize: '12px', textAlign: 'right' }}>Taxes</th>
            <th style={{ width: '85px', background: '#1a3a6e', color: 'white', padding: '8px 6px', border: '1px solid #1a3a6e', fontSize: '12px', textAlign: 'right' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, idx) => {
            const c = calcItem(item);
            return (
              <tr key={item.id} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8f9fc' }}>
                <td style={{ border: '1px solid #d0d7e8', padding: '7px 6px', textAlign: 'center', fontSize: '12px' }}>{idx + 1}</td>
                <td style={{ border: '1px solid #d0d7e8', padding: '7px 8px', fontSize: '12px' }}>
                  <div style={{ fontWeight: 600 }}>{item.name}</div>
                  {item.pchNo && <div style={{ fontSize: '11px', color: '#6b7280' }}>{item.pchNo}</div>}
                </td>
                <td style={{ border: '1px solid #d0d7e8', padding: '7px 6px', textAlign: 'center', fontSize: '12px' }}>
                  {item.qty} {item.unit}
                </td>
                <td style={{ border: '1px solid #d0d7e8', padding: '7px 6px', textAlign: 'right', fontSize: '12px' }}>
                  {fmt(item.rate)}
                </td>
                <td style={{ border: '1px solid #d0d7e8', padding: '7px 6px', textAlign: 'right', fontSize: '12px' }}>
                  {fmt(c.discountAmount)} ({item.discount}{item.discountType === 'percent' ? '%' : ''})
                </td>
                <td style={{ border: '1px solid #d0d7e8', padding: '7px 6px', textAlign: 'right', fontSize: '12px' }}>
                  {fmt(c.taxableAmount)}
                </td>
                <td style={{ border: '1px solid #d0d7e8', padding: '7px 6px', textAlign: 'right', fontSize: '12px' }}>
                  {fmt(c.taxAmount)} ({item.taxRate}%)
                </td>
                <td style={{ border: '1px solid #d0d7e8', padding: '7px 6px', textAlign: 'right', fontSize: '12px', fontWeight: 600 }}>
                  {fmt(c.total)}
                </td>
              </tr>
            );
          })}
          {data.items.length < 5 && Array.from({ length: 5 - data.items.length }).map((_, i) => (
            <tr key={`empty-${i}`}>
              <td style={{ border: '1px solid #d0d7e8', padding: '20px 6px' }}></td>
              <td style={{ border: '1px solid #d0d7e8' }}></td>
              <td style={{ border: '1px solid #d0d7e8' }}></td>
              <td style={{ border: '1px solid #d0d7e8' }}></td>
              <td style={{ border: '1px solid #d0d7e8' }}></td>
              <td style={{ border: '1px solid #d0d7e8' }}></td>
              <td style={{ border: '1px solid #d0d7e8' }}></td>
              <td style={{ border: '1px solid #d0d7e8' }}></td>
            </tr>
          ))}
          <tr>
            <td colSpan={8} style={{ border: '1px solid #d0d7e8', padding: '7px 8px', textAlign: 'right', fontSize: '12px', fontWeight: 700, background: '#eef2f7' }}>
              Total qty &nbsp; {totals.totalQty}(Pcs)
            </td>
          </tr>
        </tbody>
      </table>

      {/* Summary section */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        {/* Left: Words + HSN + Bank */}
        <div style={{ flex: 1 }}>
          <div style={{ background: '#f8f9fc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px 12px', marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Net Payable in Words</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#1a1a1a' }}>{numberToWords(totals.netPayable)}</div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12px', fontSize: '11px' }}>
            <thead>
              <tr>
                <th style={{ background: '#1a3a6e', color: 'white', padding: '6px 8px', border: '1px solid #1a3a6e', textAlign: 'left' }}>HSN/SAC</th>
                <th style={{ background: '#1a3a6e', color: 'white', padding: '6px 8px', border: '1px solid #1a3a6e', textAlign: 'right' }}>Taxable Amount</th>
                {data.igst ? (
                  <th style={{ background: '#1a3a6e', color: 'white', padding: '6px 8px', border: '1px solid #1a3a6e', textAlign: 'right' }}>IGST</th>
                ) : (
                  <>
                    <th style={{ background: '#1a3a6e', color: 'white', padding: '6px 8px', border: '1px solid #1a3a6e', textAlign: 'right' }}>CGST</th>
                    <th style={{ background: '#1a3a6e', color: 'white', padding: '6px 8px', border: '1px solid #1a3a6e', textAlign: 'right' }}>SGST</th>
                  </>
                )}
                <th style={{ background: '#1a3a6e', color: 'white', padding: '6px 8px', border: '1px solid #1a3a6e', textAlign: 'right' }}>Tax Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #d0d7e8', padding: '5px 8px' }}>Without HSN</td>
                <td style={{ border: '1px solid #d0d7e8', padding: '5px 8px', textAlign: 'right' }}>{fmt(totals.taxableAmount)}</td>
                {data.igst ? (
                  <td style={{ border: '1px solid #d0d7e8', padding: '5px 8px', textAlign: 'right' }}>{fmt(totals.igst)} (5%)</td>
                ) : (
                  <>
                    <td style={{ border: '1px solid #d0d7e8', padding: '5px 8px', textAlign: 'right' }}>{fmt(totals.cgst)} (2.5%)</td>
                    <td style={{ border: '1px solid #d0d7e8', padding: '5px 8px', textAlign: 'right' }}>{fmt(totals.sgst)} (2.5%)</td>
                  </>
                )}
                <td style={{ border: '1px solid #d0d7e8', padding: '5px 8px', textAlign: 'right' }}>{fmt(totals.totalTax)}</td>
              </tr>
              <tr style={{ fontWeight: 700, background: '#eef2f7' }}>
                <td style={{ border: '1px solid #d0d7e8', padding: '5px 8px' }}>Total</td>
                <td style={{ border: '1px solid #d0d7e8', padding: '5px 8px', textAlign: 'right' }}>{fmt(totals.taxableAmount)}</td>
                {data.igst ? (
                  <td style={{ border: '1px solid #d0d7e8', padding: '5px 8px', textAlign: 'right' }}>{fmt(totals.igst)}</td>
                ) : (
                  <>
                    <td style={{ border: '1px solid #d0d7e8', padding: '5px 8px', textAlign: 'right' }}>{fmt(totals.cgst)}</td>
                    <td style={{ border: '1px solid #d0d7e8', padding: '5px 8px', textAlign: 'right' }}>{fmt(totals.sgst)}</td>
                  </>
                )}
                <td style={{ border: '1px solid #d0d7e8', padding: '5px 8px', textAlign: 'right' }}>{fmt(totals.totalTax)}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ fontSize: '11px', color: '#374151', marginBottom: '12px' }}>
            Tax amount in words: <em>{numberToWords(totals.totalTax)}</em>
          </div>

          {data.bank.bankName && (
            <div style={{ fontSize: '12px', lineHeight: 1.6 }}>
              <div style={{ fontWeight: 700, marginBottom: '2px' }}>Bank detail</div>
              <div>Bank: {data.bank.bankName}</div>
              {data.bank.accountNumber && <div>A/C NUMBER : {data.bank.accountNumber} IFSC CODE: {data.bank.ifscCode}</div>}
            </div>
          )}
        </div>

        {/* Right: Summary box */}
        <div style={{ width: '210px', flexShrink: 0 }}>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
            {[
              { label: 'Basic Amount', value: `₹ ${fmt(totals.basicAmount)}` },
              { label: 'Discount', value: `₹ -${fmt(totals.totalDiscount)}` },
              ...(data.igst
                ? [{ label: 'IGST', value: `₹ ${fmt(totals.igst)}` }]
                : [
                    { label: 'CGST', value: `₹ ${fmt(totals.cgst)}` },
                    { label: 'SGST', value: `₹ ${fmt(totals.sgst)}` },
                  ]),
              { label: 'Round off', value: `₹ ${fmt(totals.roundOff)}` },
            ].map(({ label, value }) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '7px 12px', borderBottom: '1px solid #e2e8f0',
                fontSize: '12px',
              }}>
                <span style={{ color: '#374151' }}>{label}</span>
                <span style={{ fontWeight: 500 }}>{value}</span>
              </div>
            ))}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '10px 12px', background: '#1a3a6e', color: 'white',
            }}>
              <span style={{ fontWeight: 700, fontSize: '13px' }}>Net payable</span>
              <span style={{ fontWeight: 800, fontSize: '15px' }}>₹ {totals.netPayable.toLocaleString('en-IN')}.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms + Authorized Signature */}
      <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', marginBottom: '12px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '12px', marginBottom: '4px' }}>Terms and Conditions</div>
          {data.terms.map((t, i) => (
            <div key={i} style={{ fontSize: '11px', color: '#374151', marginBottom: '2px' }}>({i + 1}) {t}</div>
          ))}
        </div>
        <div style={{ textAlign: 'center', minWidth: '160px' }}>
          {data.signatureUrl ? (
            <img
              src={data.signatureUrl}
              alt="Signature"
              style={{ height: '48px', maxWidth: '150px', objectFit: 'contain', marginBottom: '8px' }}
            />
          ) : (
            <div style={{ height: '48px', marginBottom: '8px' }}></div>
          )}
          <div style={{ borderTop: '1px solid #374151', paddingTop: '4px', fontSize: '11px', color: '#6b7280' }}>
            Authorised Signature<br />For {data.companyName}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '10px', color: '#9ca3af', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
        Generated using Bill PDF Tool
      </div>
    </div>
  );
});

InvoicePreview.displayName = 'InvoicePreview';
