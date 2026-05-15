console.log("-------------------- 1: Adapter ---------------------\n");
import {
  createPaymentAdapter,
  ExternalPaymentSDK,
} from "./1-adapter/adapter.js";
import { checkout, ExternalPaymentAdapter } from "./1-adapter/adapter-oo.js";
import {
  adaptExternalUser,
  type ExternalUserResponse,
} from "./1-adapter/adapter-api.js";

console.log("-------------------- Adapter ---------------------");
const processor = createPaymentAdapter(new ExternalPaymentSDK());

// await processor.pay(150);
processor.pay(150);

console.log("--------------------   Adapter OO ---------------------\n");
const sdk = new ExternalPaymentSDK();
const processor2 = new ExternalPaymentAdapter(sdk);

checkout(processor2);

console.log("\n-------------------- Adapter API ---------------------\n");
const externalUser: ExternalUserResponse = {
  user_id: 123,
  first_name: "Ana",
  last_name: "Gómez",
  contact: {
    email_address: "ana@example.com",
  },
};
console.log("Respuesta externa:", externalUser);

const user = adaptExternalUser(externalUser);
console.log("Usuario adaptado:", user);

console.log("\n------------------------------------------------------------\n");

console.log("-------------------- 2: Bridge ---------------------\n");
import {
  EmailSender,
  Notification,
  SmsSender,
  UrgentNotification,
} from "./2-bridge/bridge-oo.js";
import {
  createNotification,
  createUrgentNotification,
  emailSender,
  smsSender,
} from "./2-bridge/bridge.js";
import {
  csvExporter,
  htmlExporter,
  SalesReport,
} from "./2-bridge/bridge-report.js";

console.log("---------------------- bridge -----------------------\n");
const notification = createNotification(emailSender);
notification.notify("ana@example.com", "Bienvenida");

const urgentNotification = createUrgentNotification(smsSender);
urgentNotification.notify("+573001112233", "Código de seguridad");

console.log("---------------------- bridge OO -----------------------\n");
const emailNotification = new Notification(new EmailSender());
emailNotification.notify("ana@example.com", "Tu pedido fue enviado");

const smsNotification = new Notification(new SmsSender());
smsNotification.notify("+573001112233", "Tu pedido fue enviado");

const urgentSms = new UrgentNotification(new SmsSender());
urgentSms.notify("+573001112233", "Tu cuenta requiere verificación");

console.log("\n---------------------- bridge report -----------------------\n");
const csvSalesReport = new SalesReport(csvExporter);
console.log(csvSalesReport.generate());

const htmlSalesReport = new SalesReport(htmlExporter);
console.log(htmlSalesReport.generate());

console.log("\n------------------------------------------------------------\n");
