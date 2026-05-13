type Invoice = {
  currency: string;
  country: string;
  taxRate: number;
  language: string;
  customerName: string;
  amount: number;
};

const invoicePrototype = {
  currency: "COP",
  country: "CO",
  taxRate: 0.19,
  language: "es",
};

const invoice: Invoice = {
  ...invoicePrototype,
  customerName: "Ana",
  amount: 120000,
};
console.log(invoice);
