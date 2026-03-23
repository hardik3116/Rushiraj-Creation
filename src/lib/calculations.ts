import type { InvoiceItem } from '../types/invoice';

export interface ItemCalc {
  basicAmount: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  total: number;
}

export function calcItem(item: InvoiceItem): ItemCalc {
  const basicAmount = item.qty * item.rate;
  const discountAmount =
    item.discountType === 'percent'
      ? basicAmount * (item.discount / 100)
      : item.discount;
  const taxableAmount = basicAmount - discountAmount;
  const taxAmount = taxableAmount * (item.taxRate / 100);
  const total = taxableAmount + taxAmount;
  return { basicAmount, discountAmount, taxableAmount, taxAmount, total };
}

export interface InvoiceTotals {
  basicAmount: number;
  totalDiscount: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  roundOff: number;
  netPayable: number;
  totalQty: number;
}

export function calcTotals(items: InvoiceItem[], useIgst: boolean): InvoiceTotals {
  let basicAmount = 0;
  let totalDiscount = 0;
  let taxableAmount = 0;
  let totalTax = 0;
  let totalQty = 0;

  items.forEach((item) => {
    const c = calcItem(item);
    basicAmount += c.basicAmount;
    totalDiscount += c.discountAmount;
    taxableAmount += c.taxableAmount;
    totalTax += c.taxAmount;
    totalQty += item.qty;
  });

  const cgst = useIgst ? 0 : totalTax / 2;
  const sgst = useIgst ? 0 : totalTax / 2;
  const igst = useIgst ? totalTax : 0;

  const rawNet = taxableAmount + totalTax;
  const roundOff = Math.round(rawNet) - rawNet;
  const netPayable = Math.round(rawNet);

  return {
    basicAmount,
    totalDiscount,
    taxableAmount,
    cgst,
    sgst,
    igst,
    totalTax,
    roundOff,
    netPayable,
    totalQty,
  };
}

export function numberToWords(n: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convert(num: number): string {
    if (num === 0) return '';
    if (num < 20) return ones[num] + ' ';
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '') + ' ';
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred ' + convert(num % 100);
    if (num < 100000) return convert(Math.floor(num / 1000)) + 'Thousand ' + convert(num % 1000);
    if (num < 10000000) return convert(Math.floor(num / 100000)) + 'Lacs ' + convert(num % 100000);
    return convert(Math.floor(num / 10000000)) + 'Crore ' + convert(num % 10000000);
  }

  const intPart = Math.floor(n);
  const decPart = Math.round((n - intPart) * 100);
  let result = convert(intPart).trim() + ' Rupees';
  if (decPart > 0) {
    result += ' ' + convert(decPart).trim() + ' Paisa';
  }
  return result + ' Only';
}
