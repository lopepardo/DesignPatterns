// type BillingService = {
//   getInvoice(id: string): Promise<string>;
//   refund(invoiceId: string): Promise<void>;
// };
type BillingService = {
  getInvoice(id: string): string | undefined;
  refund(invoiceId: string): void;
};

export const billingService: BillingService = {
  // async getInvoice(id) {
  getInvoice(id) {
    return `Factura ${id}`;
  },

  // async refund(invoiceId) {
  refund(invoiceId) {
    console.log(`Reembolsando factura ${invoiceId}`);
  },
};

export type User = {
  id: string;
  permissions: string[];
};

export const createBillingPermissionProxy = (
  service: BillingService,
  user: User,
): BillingService => {
  return {
    // async getInvoice(id) {
    getInvoice(id) {
      if (!user.permissions.includes("billing:read")) {
        console.log("No puedes leer facturas");
        return;
      }

      return service.getInvoice(id);
    },

    // async refund(invoiceId) {
    refund(invoiceId) {
      if (!user.permissions.includes("billing:refund")) {
        console.log("No puedes hacer reembolsos");
        return;
      }

      return service.refund(invoiceId);
    },
  };
};
