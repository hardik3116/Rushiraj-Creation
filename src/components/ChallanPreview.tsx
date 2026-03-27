import React from 'react';
import type { ChallanData } from '../types/invoice';

interface Props {
  data: ChallanData;
}

// ─── Exact pixel budget for A4 (794 × 1123px) ───
// A4 container padding: 20px top + 20px bottom = 40px
// Copy labels: 2 × 14px = 28px
// Cut separator: 30px (14px margin × 2 + 2px line)
// Available for 2 challans: 1123 - 40 - 28 - 30 = 1025px → ~512px each
// Fixed 10 visible table rows to keep both challans identical height

const MIN_ROWS = 10; // always show 10 rows (data + empty padding)
const ROW_H = 22;    // each row height

const ChallanSingle = ({ data }: Props) => {
  const formatDate = (d: string) => {
    if (!d) return '';
    const dt = new Date(d);
    return `${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()}`;
  };

  const total = data.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  // Only show first MIN_ROWS items max — rest won't fit on one A4
  const visibleItems = data.items.slice(0, MIN_ROWS);
  const padRows = Math.max(0, MIN_ROWS - visibleItems.length);

  // shared cell style helper
  const cell = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    border: '1px solid #2a5c8a',
    padding: '2px 6px',
    fontSize: '12px',
    fontFamily: 'Arial, sans-serif',
    ...extra,
  });

  return (
    <div style={{
      width: '100%',
      fontFamily: "'Inter', Arial, sans-serif",
      fontSize: '12px',
      color: '#111',
      border: '1.5px solid #2a5c8a',
      boxSizing: 'border-box',
      background: '#fff',
    }}>
      {/* ── Title ── */}
      <div style={{
        background: '#d8eaf8',
        borderBottom: '1.5px solid #2a5c8a',
        textAlign: 'center',
        padding: '4px 0',
        fontWeight: 800,
        fontSize: '16px',
        letterSpacing: '0.07em',
        color: '#1a3a6e',
      }}>
        DELIVERY CHALLAN
      </div>

      {/* ── TO / FROM ── */}
      <div style={{ display: 'flex', borderBottom: '1px solid #2a5c8a' }}>
        <div style={{ flex: 1, padding: '4px 10px', borderRight: '1px solid #2a5c8a' }}>
          <div style={{ fontSize: '9px', color: '#555', fontWeight: 700, marginBottom: '1px' }}>TO :</div>
          <div style={{ fontWeight: 700, fontSize: '13px', color: '#111' }}>{data.to}</div>
        </div>
        <div style={{ flex: 1, padding: '4px 10px', position: 'relative' }}>
          <div style={{ fontSize: '9px', color: '#555', fontWeight: 700, marginBottom: '1px' }}>FROM :</div>
          <div style={{ fontWeight: 700, fontSize: '13px', color: '#111' }}>{data.from}</div>
          {data.challanNo && (
            <div style={{
              position: 'absolute', top: '5px', right: '10px',
              border: '1.5px solid #2a5c8a', borderRadius: '13px',
              minWidth: '26px', height: '26px', padding: '0 6px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '11px', color: '#1a3a6e',
              background: '#fff', boxSizing: 'border-box', whiteSpace: 'nowrap'
            }}>
              {data.challanNo}
            </div>
          )}
        </div>
      </div>

      {/* ── Order / Date ── */}
      <div style={{ display: 'flex', borderBottom: '1px solid #2a5c8a', padding: '3px 10px', gap: '24px', fontSize: '12px' }}>
        <div>ORDER No. <span style={{ borderBottom: '1px solid #555', display: 'inline-block', minWidth: '60px', fontWeight: 600 }}>{data.orderNo}</span></div>
        <div>DATE: <strong>{formatDate(data.date)}</strong></div>
      </div>

      {/* ── Challan No ── */}
      <div style={{ borderBottom: '1px solid #2a5c8a', padding: '3px 10px', fontSize: '12px' }}>
        CHALLAN No. <span style={{ borderBottom: '1px solid #555', display: 'inline-block', minWidth: '60px', fontWeight: 700 }}>{data.challanNo}</span>
      </div>

      {/* ── Notice ── */}
      <div style={{ borderBottom: '1px solid #2a5c8a', padding: '2px 10px', fontSize: '9px', color: '#444', textAlign: 'center', background: '#f8fbff' }}>
        PLEASE RECEIVE THE FOLLOWING GOODS IN GOOD ORDER &amp; CONDITION.
      </div>

      {/* ── Items Table ── */}
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <colgroup>
          <col style={{ width: '62px' }} />
          <col />
          <col style={{ width: '65px' }} />
          <col style={{ width: '78px' }} />
        </colgroup>
        <thead>
          <tr>
            <th style={cell({ textAlign: 'center', background: '#d8eaf8', fontWeight: 700 })}>Quantity</th>
            <th style={cell({ textAlign: 'center', background: '#d8eaf8', fontWeight: 700 })}>PARTICULARS</th>
            <th style={cell({ textAlign: 'center', background: '#d8eaf8', fontWeight: 700 })}>Rate</th>
            <th style={cell({ textAlign: 'center', background: '#d8eaf8', fontWeight: 700 })}>Amount ₹.</th>
          </tr>
        </thead>
        <tbody>
          {visibleItems.map((item) => (
            <tr key={item.id}>
              <td style={cell({ textAlign: 'center', height: `${ROW_H}px`, fontWeight: 500 })}>{item.qty}</td>
              <td style={cell({ fontWeight: 500, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' })}>{item.particulars}</td>
              <td style={cell({ textAlign: 'right', fontWeight: 600 })}>{item.rate || ''}</td>
              <td style={cell({ textAlign: 'right', fontWeight: 600 })}>{item.amount || ''}</td>
            </tr>
          ))}
          {Array.from({ length: padRows }).map((_, i) => (
            <tr key={`pad-${i}`}>
              <td style={cell({ height: `${ROW_H}px` })}>&nbsp;</td>
              <td style={cell({})}>&nbsp;</td>
              <td style={cell({})}>&nbsp;</td>
              <td style={cell({})}>&nbsp;</td>
            </tr>
          ))}
          {/* Total */}
          <tr>
            <td colSpan={3} style={cell({ textAlign: 'right', fontWeight: 700, fontSize: '12px', background: '#f8fbff', padding: '3px 8px' })}>
              Total
            </td>
            <td style={cell({ textAlign: 'right', fontWeight: 800, fontSize: '12px', background: '#d8eaf8', padding: '3px 8px' })}>
              {total > 0 ? total.toLocaleString('en-IN') : ''}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ── Footer ── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '5px 10px', borderTop: '1px solid #2a5c8a' }}>
        <div style={{ fontSize: '9px', color: '#555', maxWidth: '320px', lineHeight: 1.3 }}>
          This receipt form should be signed by the person having authority and return
          it to bearer. No complaints will be entertained if the same are received after
          24 hours after delivery.
        </div>
        <div style={{ textAlign: 'center', minWidth: '90px' }}>
          {data.signatureUrl ? (
            <img src={data.signatureUrl} alt="sig" style={{ height: '28px', maxWidth: '80px', objectFit: 'contain', display: 'block', margin: '0 auto 2px' }} />
          ) : (
            <div style={{ height: '28px' }} />
          )}
          <div style={{ fontSize: '9px', borderTop: '1px solid #555', paddingTop: '2px' }}>Received by</div>
        </div>
      </div>
    </div>
  );
};

// ── A4 wrapper: exact 794×1123px with 2 identical challans ──
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
        padding: '20px 32px',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', Arial, sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* Copy 1 */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ fontSize: '9px', color: '#aaa', textAlign: 'right', marginBottom: '2px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Copy 1</div>
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
        <div style={{ fontSize: '9px', color: '#aaa', textAlign: 'right', marginBottom: '2px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Copy 2</div>
        <ChallanSingle data={data} />
      </div>
    </div>
  );
});

ChallanPreview.displayName = 'ChallanPreview';
