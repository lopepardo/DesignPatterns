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
  createNotification,
  createUrgentNotification,
  emailSender,
  smsSender,
} from "./2-bridge/bridge.js";
import {
  EmailSender,
  Notification,
  SmsSender,
  UrgentNotification,
} from "./2-bridge/bridge-oo.js";
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

console.log("-------------------- 3: Composite ---------------------\n");
import {
  type FileSystemNode,
  getSize,
  printNode,
} from "./3-composite/composite.js";
import { File, Folder } from "./3-composite/composite-oo.js";

console.log("-------------------- Composite ---------------------\n");
const root: FileSystemNode = {
  kind: "folder",
  name: "root",
  children: [
    {
      kind: "file",
      name: "a.txt",
      size: 10,
    },
    {
      kind: "folder",
      name: "images",
      children: [
        {
          kind: "file",
          name: "photo.png",
          size: 500,
        },
      ],
    },
  ],
};

printNode(root);
console.log(`Total size of root: ${getSize(root)} KB`);

console.log("-------------------- Composite OO ---------------------\n");
const root2 = new Folder("root");
root2.add(new File("a.txt", 10));
root2.add(new File("b.txt", 20));

const images = new Folder("images");
images.add(new File("photo.png", 500));
images.add(new File("logo.svg", 30));

root2.add(images);

root2.print();
console.log(`Total size of root: ${root2.getSize()} KB`);
console.log(`Total size of images: ${images.getSize()} KB`);

console.log("\n------------------------------------------------------------\n");

console.log("-------------------- 4: Decorator ---------------------\n");
import {
  emailNotifier,
  withLogging,
  withUppercase,
} from "./4-decorator/decorator.js";
import {
  EmailNotifier,
  LoggingNotifier,
  RetryNotifier,
} from "./4-decorator/decorator-oo.js";
import {
  getUserHandler,
  withErrorHandling,
  withTiming,
} from "./4-decorator/decorator-middleware.js";

console.log("\n-------------------- Decorator ---------------------\n");
const notifier = withLogging(withUppercase(emailNotifier));
notifier.send("Mensaje de prueba");

const notifier2 = withUppercase(withLogging(emailNotifier));
notifier2.send("Otro mensaje de prueba");

console.log("\n------------------- Decorator OO ---------------------\n");
const notifier3 = new LoggingNotifier(new RetryNotifier(new EmailNotifier()));

notifier3.send("Bienvenida");

console.log("\n---------------- Decorator middleware ---------------------\n");
const request = new Request("https://www.getusers.com/user/123");
const handler = withErrorHandling(withTiming(getUserHandler));

console.log(handler(request));

console.log("\n------------------------------------------------------------\n");

console.log("-------------------- 5: Facade ---------------------\n");
import {
  createCheckoutFacade,
  inventory,
  payment,
  orders,
  email,
} from "./5-facade/facade.js";
import { CheckoutFacade } from "./5-facade/facade-oo.js";
import {
  externalPdfLibrary,
  createPdfFacade,
} from "./5-facade/facade-report.js";

console.log("\n-------------------- Facade ---------------------\n");
const checkoutFacade = createCheckoutFacade({
  inventory,
  payment,
  orders,
  email,
});

const orderId = checkoutFacade.placeOrder({
  customerId: "customer-1",
  productId: "product-1",
  amount: 100000,
});
console.log(`Pedido realizado con ID: ${orderId}`);

console.log("\n-------------------- Facade OO ---------------------\n");
const checkout2 = new CheckoutFacade(inventory, payment, orders, email);

const orderId2 = checkout2.placeOrder({
  customerId: "customer-1",
  productId: "product-1",
  amount: 100000,
});
console.log(`Pedido realizado con ID: ${orderId2}`);

console.log("\n--------------------- Facade OO report ---------------------\n");
const pdfFacade = createPdfFacade(externalPdfLibrary);
const pdf = pdfFacade.createReportPdf({
  title: "Ventas Q1",
  rows: [["Producto", "Total"]],
});
console.log("PDF generado:", pdf);

console.log("\n------------------------------------------------------------\n");

console.log("-------------------- 6: Flyweight ---------------------\n");
import { createTreeTypeRegistry, type Tree } from "./6-flyweight/flyweight.js";
import { TreeTypeFactory, type TreeOO } from "./6-flyweight/flyweight-oo.js";

console.log("\n-------------------- Flyweight ---------------------\n");
const registry = createTreeTypeRegistry();

const trees: Tree[] = [];

trees.push({
  x: 10,
  y: 20,
  type: registry.get("Oak", "green", "oak.png"),
});

trees.push({
  x: 30,
  y: 60,
  type: registry.get("Oak", "green", "oak.png"),
});

trees.push({
  x: 80,
  y: 100,
  type: registry.get("Pine", "dark-green", "pine.png"),
});

console.log(`Arboles creados: ${trees.length}`);
console.log(`Tipos de árboles en el registro: ${registry.size()}`);

console.log("\n-------------------- Flyweight OO ---------------------\n");
const factory = new TreeTypeFactory();

const trees2: TreeOO[] = [];

trees2.push({
  x: 10,
  y: 20,
  type: factory.getTreeType("Oak", "green", "oak.png"),
});

trees2.push({
  x: 30,
  y: 60,
  type: factory.getTreeType("Oak", "green", "oak.png"),
});

trees2.push({
  x: 80,
  y: 100,
  type: factory.getTreeType("Pine", "dark-green", "pine.png"),
});

console.log(`Arboles creados: ${trees2.length}`);
console.log(`Tipos de árboles en la fábrica: ${factory.count()}`);

console.log("\n------------------------------------------------------------\n");

console.log("-------------------- 7: Proxy ---------------------\n");
import {
  billingService,
  createBillingPermissionProxy,
  type User,
} from "./7-proxy/proxy.js";
import { type Image, LazyImageProxy } from "./7-proxy/proxy-oo.js";

console.log("\n-------------------- Proxy ---------------------\n");
const user1: User = {
  id: "u1",
  permissions: ["billing:read"],
};

const securedBilling = createBillingPermissionProxy(billingService, user1);

const invoice = securedBilling.getInvoice("inv-1"); // ok
console.log("Factura obtenida:", invoice);
const refund = securedBilling.refund("inv-1"); // error
console.log("Reembolso realizado:", refund);

console.log("\n-------------------- Proxy OO ---------------------\n");
const image: Image = new LazyImageProxy("photo.png");

console.log("Imagen creada, pero aún no cargada");

image.display(); // carga y muestra
image.display(); // solo muestra

console.log("\n------------------------------------------------------------\n");
