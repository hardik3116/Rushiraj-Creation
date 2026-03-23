import React from 'react';
import type { ChallanData } from '../types/invoice';

interface Props {
  data: ChallanData;
}

// Each challan must fit within 470px so two + separator fit in A4 (1123px total)
// Budget: 1123px - 2×25px padding = 1073px available
// Per challan: 470px × 2 = 940px + 30px separator + 2×16px copy labels = ~1004px ✓
const ChallanSingle = ({ data }: Props) => {
  const formatDate = (d: string) => {
    if (!d) return '';
    const dt = new Date(d);
    return `${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()}`;
  };

  const total = data.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  // Fixed row height so 8 rows fill exactly the right space
  const ROW_H = 24;
  const padRows = Math.max(0, 8 - data.items.length);

  return (
    <div style={{
      width: '100%',
      fontFamily: 'Arial, sans-serif',
      fontSize: '11px',
      color: '#1a1a1a',
      border: '1.5px solid #2a5c8a',
      boxSizing: 'border-box',
      background: '#fff',
    }}>
      {/* ── Title ── */}
      <div style={{
        background: '#d8eaf8',
        borderBottom: '1.5px solid #2a5c8a',
        textAlign: 'center',
        padding: '5px 0',
        fontWeight: 800,
        fontSize: '16px',
        letterSpacing: '0.07em',
        color: '#1a3a6e',
      }}>
        DELIVERY CHALLAN
      </div>

      {/* ── FROM / TO ── */}
      <div style={{ display: 'flex', borderBottom: '1px solid #2a5c8a' }}>
        <div style={{ flex: 1, padding: '5px 12px', borderRight: '1px solid #2a5c8a' }}>
          <div style={{ fontSize: '9px', color: '#555', fontWeight: 600, marginBottom: '2px' }}>FROM :</div>
          <div style={{ fontWeight: 700, fontSize: '13px' }}>{data.from}</div>
        </div>
        <div style={{ flex: 1, padding: '5px 12px', position: 'relative' }}>
          <div style={{ fontSize: '9px', color: '#555', fontWeight: 600, marginBottom: '2px' }}>TO :</div>
          <div style={{ fontWeight: 700, fontSize: '13px' }}>{data.to}</div>
          {data.challanNo && (
            <div style={{
              position: 'absolute', top: '6px', right: '10px',
              border: '1.5px solid #2a5c8a', borderRadius: '50%',
              width: '28px', height: '28px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '11px', color: '#1a3a6e',
              background: '#fff',
            }}>
              {data.challanNo}
            </div>
          )}
        </div>
      </div>

      {/* ── Order / Date ── */}
      <div style={{ display: 'flex', borderBottom: '1px solid #2a5c8a', padding: '4px 12px', gap: '30px' }}>
        <div>ORDER No. <span style={{ borderBottom: '1px solid #555', display: 'inline-block', minWidth: '70px', fontWeight: 600 }}>{data.orderNo}</span></div>
        <div>DATE: <strong>{formatDate(data.date)}</strong></div>
      </div>

      {/* ── Challan No ── */}
      <div style={{ borderBottom: '1px solid #2a5c8a', padding: '4px 12px' }}>
        CHALLAN No. <span style={{ borderBottom: '1px solid #555', display: 'inline-block', minWidth: '60px', fontWeight: 700 }}>{data.challanNo}</span>
      </div>

      {/* ── Notice ── */}
      <div style={{ borderBottom: '1px solid #2a5c8a', padding: '3px 12px', fontSize: '9px', color: '#444', textAlign: 'center', background: '#f8fbff' }}>
        PLEASE RECEIVE THE FOLLOWING GOODS IN GOOD ORDER &amp; CONDITION.
      </div>

      {/* ── Items Table ── */}
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <colgroup>
          <col style={{ width: '70px' }} />
          <col />
          <col style={{ width: '65px' }} />
          <col style={{ width: '78px' }} />
        </colgroup>
        <thead>
          <tr>
            <th style={{ border: '1px solid #2a5c8a', padding: '4px 6px', textAlign: 'center', background: '#d8eaf8', fontSize: '11px', fontWeight: 700 }}>Quantity</th>
            <th style={{ border: '1px solid #2a5c8a', padding: '4px 6px', textAlign: 'center', background: '#d8eaf8', fontSize: '11px', fontWeight: 700 }}>PARTICULARS</th>
            <th style={{ border: '1px solid #2a5c8a', padding: '4px 6px', textAlign: 'center', background: '#d8eaf8', fontSize: '11px', fontWeight: 700 }}>Rate</th>
            <th style={{ border: '1px solid #2a5c8a', padding: '4px 6px', textAlign: 'center', background: '#d8eaf8', fontSize: '11px', fontWeight: 700 }}>Amount ₹.</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item) => (
            <tr key={item.id}>
              <td style={{ border: '1px solid #2a5c8a', padding: '3px 6px', textAlign: 'center', height: `${ROW_H}px`, fontSize: '11px', overflow: 'hidden' }}>{item.qty}</td>
              <td style={{ border: '1px solid #2a5c8a', padding: '3px 6px', fontSize: '11px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{item.particulars}</td>
              <td style={{ border: '1px solid #2a5c8a', padding: '3px 6px', textAlign: 'right', fontSize: '11px' }}>{item.rate || ''}</td>
              <td style={{ border: '1px solid #2a5c8a', padding: '3px 6px', textAlign: 'right', fontSize: '11px' }}>{item.amount || ''}</td>
            </tr>
          ))}
          {Array.from({ length: padRows }).map((_, i) => (
            <tr key={`pad-${i}`}>
              <td style={{ border: '1px solid #2a5c8a', height: `${ROW_H}px` }}>&nbsp;</td>
              <td style={{ border: '1px solid #2a5c8a' }}>&nbsp;</td>
              <td style={{ border: '1px solid #2a5c8a' }}>&nbsp;</td>
              <td style={{ border: '1px solid #2a5c8a' }}>&nbsp;</td>
            </tr>
          ))}
          {/* Total */}
          <tr>
            <td colSpan={3} style={{ border: '1px solid #2a5c8a', padding: '4px 8px', textAlign: 'right', fontWeight: 700, fontSize: '12px', background: '#f8fbff' }}>
              Total
            </td>
            <td style={{ border: '1px solid #2a5c8a', padding: '4px 8px', textAlign: 'right', fontWeight: 800, fontSize: '12px', background: '#d8eaf8' }}>
              {total > 0 ? total.toLocaleString('en-IN') : ''}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ── Footer ── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '6px 12px', borderTop: '1px solid #2a5c8a' }}>
        <div style={{ fontSize: '9px', color: '#555', maxWidth: '340px', lineHeight: 1.4 }}>
          This receipt form should be signed by the person having authority and return
          it to bearer. No complaints will be entertained if the same are received after
          24 hours after delivery.
        </div>
        <div style={{ textAlign: 'center', minWidth: '100px' }}>
          {data.signatureUrl ? (
            <img src={data.signatureUrl} alt="sig" style={{ height: '30px', maxWidth: '90px', objectFit: 'contain', display: 'block', margin: '0 auto 2px' }} />
          ) : (
            <div style={{ height: '30px' }} />
          )}
          <div style={{ fontSize: '9px', borderTop: '1px solid #555', paddingTop: '2px' }}>Received by</div>
        </div>
      </div>
    </div>
  );
};

// ── A4 wrapper: exact 794×1123px with 2 challans ──
export const ChallanPreview = React.forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  return (
    <div
      ref={ref}
      id="challan-preview"
      style={{
        width: '794px',
        height: '1123px',
        backgroundColor: '#ffffff',
        boxSizing: 'border-box',
        padding: '22px 32px',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden', // hard clip — nothing spills outside A4
      }}
    >
      {/* Copy 1 */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ fontSize: '9px', color: '#aaa', textAlign: 'right', marginBottom: '3px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Copy 1</div>
        <ChallanSingle data={data} />
      </div>

      {/* Cut-here separator */}
      <div style={{ flexShrink: 0, position: 'relative', margin: '14px 0', borderTop: '1.5px dashed #999' }}>
        <span style={{
          position: 'absolute', left: '50%', top: '-9px',
          transform: 'translateX(-50%)',
          background: '#fff', padding: '0 12px',
          fontSize: '10px', color: '#888', fontStyle: 'italic',
        }}>
          ✂ &nbsp;Cut Here&nbsp; ✂
        </span>
      </div>

      {/* Copy 2 */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ fontSize: '9px', color: '#aaa', textAlign: 'right', marginBottom: '3px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Copy 2</div>
        <ChallanSingle data={data} />
      </div>
    </div>
  );
});

ChallanPreview.displayName = 'ChallanPreview';
