// import type { InvoiceItem } from '../types/invoice';

import { InvoiceItem } from "@/types/invoice";

export const calcItem = (item: InvoiceItem) => {
  const basicAmount = item.qty * item.rate;
  let discountAmount = 0;
  if (item.discountType === 'percent') {
    discountAmount = (basicAmount * item.discount) / 100;
  } else {
    discountAmount = item.discount;
  }
  const taxableAmount = basicAmount - discountAmount;
  const taxAmount = (taxableAmount * item.taxRate) / 100;
  return {
    basicAmount,
    discountAmount,
    taxableAmount,
    taxAmount,
    total: taxableAmount + taxAmount
  };
};

export const calcTotals = (items: InvoiceItem[], igst: boolean) => {
  let basicAmount = 0;
  let totalDiscount = 0;
  let taxableAmount = 0;
  let totalTax = 0;

  items.forEach(item => {
    const c = calcItem(item);
    basicAmount += c.basicAmount;
    totalDiscount += c.discountAmount;
    taxableAmount += c.taxableAmount;
    totalTax += c.taxAmount;
  });

  const netPayable = taxableAmount + totalTax;

  if (igst) {
    return {
      basicAmount,
      totalDiscount,
      taxableAmount,
      igst: totalTax,
      cgst: 0,
      sgst: 0,
      netPayable
    };
  } else {
    return {
      basicAmount,
      totalDiscount,
      taxableAmount,
      igst: 0,
      cgst: totalTax / 2,
      sgst: totalTax / 2,
      netPayable
    };
  }
};

export function numberToWords(num: number) {
  const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
  const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  const n = ('000000000' + num.toFixed(2)).substr(-12).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})(\d{2})$/);
  if (!n) return '';
  let str = '';
  str += (Number(n[1]) !== 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
  str += (Number(n[2]) !== 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
  str += (Number(n[3]) !== 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
  str += (Number(n[4]) !== 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
  str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
  return str.toUpperCase();
}
