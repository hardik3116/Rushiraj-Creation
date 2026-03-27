// export interface InvoiceItem {
//   id: string;
//   name: string;
//   pchNo: string;
//   hsnSac: string;
//   qty: number;
//   unit: string;
//   rate: number;
//   discount: number;
//   discountType: 'percent' | 'amount';
//   taxRate: number;
// }

// export interface BankDetail {
//   bankName: string;
//   accountNumber: string;
//   ifscCode: string;
// }

// export interface InvoiceData {
//   // Company (From)
//   companyName: string;
//   companyAddress: string;
//   companyCity: string;
//   companyState: string;
//   companyPincode: string;
//   companyPhone: string;
//   companyGstin: string;
//   companyPan: string;
//   companyLogoUrl: string; // NEW

//   // Bill To
//   clientName: string;
//   clientAddress: string;
//   clientCity: string;
//   clientState: string;
//   clientPincode: string;
//   clientPhone: string;
//   clientGstin: string;
//   clientPan: string;

//   // Invoice Details
//   invoiceNumber: string;
//   invoiceDate: string;

//   // Signature
//   signatureUrl: string; // NEW

//   // Items
//   items: InvoiceItem[];

//   // Bank
//   bank: BankDetail;

//   // Terms
//   terms: string[];

//   // Tax type
//   igst: boolean;
// }

// // Delivery Challan type (separate bill)
// export interface ChallanItem {
//   id: string;
//   srNo: string;
//   particulars: string;
//   qty: string;
//   rate: number;
//   amount: number;
// }

// export interface ChallanData {
//   from: string;
//   to: string;
//   challanNo: string;
//   orderNo: string;
//   date: string;
//   items: ChallanItem[];
//   totalAmount: number;
//   receivedBy: string;
//   signatureUrl: string;
// }

// export const defaultInvoiceData: InvoiceData = {
//   companyName: 'आradhya SAREES',
//   companyAddress: 'E-196, Matrushakti Society, Nr Nandanvan Society,Punagam,Surat',
//   companyCity: 'Surat',
//   companyState: 'Gujarat',
//   companyPincode: '395006',
//   companyPhone: '9737712101 | 8469464128',
//   companyGstin: '24AQPPD4620G2',
//   companyPan: 'AQPPD4620G',
//   companyLogoUrl: '',

//   clientName: 'LABDHI DESIGNER',
//   clientAddress: 'D-2190, MILLENNIUM TEXTILE MARKET, RING ROAD SURAT',
//   clientCity: 'Surat',
//   clientState: 'Gujarat',
//   clientPincode: '395002',
//   clientPhone: '9712768318',
//   clientGstin: '24ABBPJ6393H1ZN',
//   clientPan: 'ABBPJ6393H',

//   invoiceNumber: 'AE-187',
//   invoiceDate: '2026-02-10',

//   signatureUrl: '',

//   items: [
//     {
//       id: '1',
//       name: 'DIGITAL',
//       pchNo: 'P CH NO:76',
//       hsnSac: '',
//       qty: 377,
//       unit: 'Pcs',
//       rate: 150,
//       discount: 5,
//       discountType: 'percent',
//       taxRate: 5,
//     },
//     {
//       id: '2',
//       name: 'ZARKHAN',
//       pchNo: 'P CH NO:87',
//       hsnSac: '',
//       qty: 475,
//       unit: 'Pcs',
//       rate: 200,
//       discount: 5,
//       discountType: 'percent',
//       taxRate: 5,
//     },
//   ],

//   bank: {
//     bankName: 'THE VARACHHA CO-OP BANK LTD',
//     accountNumber: '00130111471559',
//     ifscCode: 'VARA0289001',
//   },

//   terms: [
//     'Goods once sold will not be accepted return',
//     'In case of late payment interest 18% p.a. will be levied',
//     'Subject to Surat Jurisdiction. E & O.E',
//   ],

//   igst: false,
// };

// export const defaultChallanData: ChallanData = {
//   from: 'K.M. CREATION',
//   to: 'RUSHIRAJ CREATION',
//   challanNo: '10',
//   orderNo: '',
//   date: new Date().toISOString().split('T')[0],
//   items: [
//     { id: '1', srNo: '1', particulars: 'pic', qty: '', rate: 96, amount: 96 },
//     { id: '2', srNo: '2', particulars: 'pic', qty: '', rate: 79, amount: 79 },
//     { id: '3', srNo: '3', particulars: 'pic', qty: '', rate: 97, amount: 97 },
//   ],
//   totalAmount: 2744,
//   receivedBy: '',
//   signatureUrl: '',
// };
export interface InvoiceItem {
  id: string;
  name: string;         // Description of Goods
  pchNo: string;        // P.Ch.No.
  hsnSac: string;       // HSN
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

export interface PaidDetails {
  amount: string;
  chequeNo: string;
  bank: string;
  date: string;
  totalAmountInWords: string;
  tds: string;
  totalPayRs: string;
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
  signatureUrl: string;

  // Items
  items: InvoiceItem[];

  // Bank
  bank: BankDetail;

  // Paid Details
  paidDetails: PaidDetails;

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
  companyName: 'RUSHIRAJ CREATION',
  companyAddress: 'E-196 MATRUSHKTI SOCIETY NR NANDANVAN SOCIETY PUNAGAM',
  companyCity: 'SURAT',
  companyState: 'GUJARAT',
  companyPincode: '395010',
  companyPhone: '96246 57000',
  companyGstin: '24AQPPD4620G2Z3',
  companyPan: 'AQPPD4620G',

  clientName: 'AARADHYA SAREES',
  clientAddress: 'G-6 DE-VENTURA TEXTILE HUB RING ROAD',
  clientCity: 'SURAT',
  clientState: 'GUJARAT',
  clientPincode: '395002',
  clientPhone: '9737712101',
  clientGstin: '24AHCPN8413B1ZT',
  clientPan: 'AHCPN8413H',

  invoiceNumber: 'RC-01',
  invoiceDate: '2026-03-06',

  signatureUrl: '',

  items: [
    {
      id: '1',
      name: 'Lace Work',
      pchNo: '01',
      hsnSac: '540752',
      qty: 0,
      unit: 'Pcs',
      rate: 0,
      discount: 5,
      discountType: 'percent',
      taxRate: 5,
    }
  ],

  bank: {
    bankName: 'THE VARACHHA CO-OP BANK LTD',
    accountNumber: '01230110423255',
    ifscCode: 'VARA0289012',
  },

  paidDetails: {
    amount: '',
    chequeNo: '',
    bank: '',
    date: '',
    totalAmountInWords: '',
    tds: '',
    totalPayRs: '',
  },

  terms: [
    'Any Complaint for goods should be made within 2 Days.',
    'Interest @24% per Annual will be charged after due date of the bill.',
    'Subject to SURAT Jurisdiction.',
  ],

  igst: false,
};

export const defaultChallanData: ChallanData = {
  from: 'RUSHIRAJ CREATION',
  to: 'K.M. CREATION',
  challanNo: 'RC-01',
  orderNo: '',
  date: new Date().toISOString().split('T')[0],
  items: [

  ],
  totalAmount: 0,
  receivedBy: '',
  signatureUrl: '',
};
