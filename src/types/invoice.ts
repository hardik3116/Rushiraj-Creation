export interface InvoiceItem {
  id: string;
  name: string;
  pchNo: string;
  hsnSac: string;
  qty: number;
  unit: string;
  rate: number;
  discount: number;
  discountType: 'percent' | 'amount';
  taxRate: number;
}

export interface BankDetail {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}

export interface InvoiceData {
  // Company (From)
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyState: string;
  companyPincode: string;
  companyPhone: string;
  companyGstin: string;
  companyPan: string;
  companyLogoUrl: string; // NEW

  // Bill To
  clientName: string;
  clientAddress: string;
  clientCity: string;
  clientState: string;
  clientPincode: string;
  clientPhone: string;
  clientGstin: string;
  clientPan: string;

  // Invoice Details
  invoiceNumber: string;
  invoiceDate: string;

  // Signature
  signatureUrl: string; // NEW

  // Items
  items: InvoiceItem[];

  // Bank
  bank: BankDetail;

  // Terms
  terms: string[];

  // Tax type
  igst: boolean;
}

// Delivery Challan type (separate bill)
export interface ChallanItem {
  id: string;
  srNo: string;
  particulars: string;
  qty: string;
  rate: number;
  amount: number;
}

export interface ChallanData {
  from: string;
  to: string;
  challanNo: string;
  orderNo: string;
  date: string;
  items: ChallanItem[];
  totalAmount: number;
  receivedBy: string;
  signatureUrl: string;
}

export const defaultInvoiceData: InvoiceData = {
  companyName: 'ANGEL ENTERPRISE',
  companyAddress: '118, Mahatma Industrial Estate, Varachha Road Surat',
  companyCity: 'Surat',
  companyState: 'Gujarat',
  companyPincode: '395006',
  companyPhone: '9712768318',
  companyGstin: '24EXCPS4838H2Z5',
  companyPan: 'EXCPS4838H',
  companyLogoUrl: '',

  clientName: 'LABDHI DESIGNER',
  clientAddress: 'D-2190, MILLENNIUM TEXTILE MARKET, RING ROAD SURAT',
  clientCity: 'Surat',
  clientState: 'Gujarat',
  clientPincode: '395002',
  clientPhone: '9712768318',
  clientGstin: '24ABBPJ6393H1ZN',
  clientPan: 'ABBPJ6393H',

  invoiceNumber: 'AE-187',
  invoiceDate: '2026-02-10',

  signatureUrl: '',

  items: [
    {
      id: '1',
      name: 'DIGITAL',
      pchNo: 'P CH NO:76',
      hsnSac: '',
      qty: 377,
      unit: 'Pcs',
      rate: 150,
      discount: 5,
      discountType: 'percent',
      taxRate: 5,
    },
    {
      id: '2',
      name: 'ZARKHAN',
      pchNo: 'P CH NO:87',
      hsnSac: '',
      qty: 475,
      unit: 'Pcs',
      rate: 200,
      discount: 5,
      discountType: 'percent',
      taxRate: 5,
    },
  ],

  bank: {
    bankName: 'THE VARACHHA CO-OP BANK LTD',
    accountNumber: '00130111471559',
    ifscCode: 'VARA0289001',
  },

  terms: [
    'Goods once sold will not be accepted return',
    'In case of late payment interest 18% p.a. will be levied',
    'Subject to Surat Jurisdiction. E & O.E',
  ],

  igst: false,
};

export const defaultChallanData: ChallanData = {
  from: 'K.M. CREATION',
  to: 'RUSHIRAJ CREATION',
  challanNo: '10',
  orderNo: '',
  date: new Date().toISOString().split('T')[0],
  items: [
    { id: '1', srNo: '1', particulars: 'pic', qty: '', rate: 96, amount: 96 },
    { id: '2', srNo: '2', particulars: 'pic', qty: '', rate: 79, amount: 79 },
    { id: '3', srNo: '3', particulars: 'pic', qty: '', rate: 97, amount: 97 },
  ],
  totalAmount: 2744,
  receivedBy: '',
  signatureUrl: '',
};
