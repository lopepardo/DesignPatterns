console.log("-------------------- 1: Factory Method ---------------------\n");
import { createNotification } from "./1-factory-method/factory-method.js";
import {
  EmailNotificationCreator,
  SmsNotificationCreator,
} from "./1-factory-method/factory-method-oo.js";
import { createNotificationRegistered } from "./1-factory-method/factory-register.js";

console.log("-------------------- Factory Method ---------------------");
const notification = createNotification("email");
notification.send("Tu pedido fue confirmado");
const notification2 = createNotification("sms");
notification2.send("Tu pedido fue confirmado");

console.log("-------------------- Factory Method OO ---------------------");
const creator = new EmailNotificationCreator();
creator.notify("Bienvenida");
const creator2 = new SmsNotificationCreator();
creator2.notify("Tu pedido fue confirmado");

console.log("------------------ Factory Method Register -------------------");
const notificationRegistered = createNotificationRegistered("email");
notificationRegistered.send("Tu pedido fue confirmado");
const notificationRegistered2 = createNotificationRegistered("push");
notificationRegistered2.send("Tienes una nueva notificación");

console.log("\n------------------------------------------------------------\n");

console.log("-------------------- 2: Abstract Factory ---------------------\n");
import {
  getThemeFactory,
  renderSettingsPage,
} from "./2-abstract-factory/abstract-factory.js";

console.log("-------------------- Abstract Factory ---------------------");
const factoryDark = getThemeFactory("dark");
renderSettingsPage(factoryDark);
const factoryLight = getThemeFactory("light");
renderSettingsPage(factoryLight);

console.log("-------------------- Abstract Factory OO ---------------------");
import {
  renderPage,
  DarkThemeFactory,
  LightThemeFactory,
} from "./2-abstract-factory/abstract-factory-oo.js";

renderPage(new DarkThemeFactory());
renderPage(new LightThemeFactory());

console.log("---------------- Abstract Factory Real example ----------------");
import {
  checkout,
  stripeFactory,
  mercadoPagoFactory,
} from "./2-abstract-factory/abstract-factory-real.js";

checkout(stripeFactory);
//checkout(mercadoPagoFactory);

console.log("\n------------------------------------------------------------\n");

console.log("------------------------ 3: Builder -------------------------\n");
import { createReport } from "./3-builder/builder.js";
import { ReportBuilder } from "./3-builder/builder-oo.js";

console.log("------------------------ Builder -------------------------");
const report = createReport({
  title: "Ventas Q1",
  format: "pdf",
  includeCharts: true,
});
console.log(report);

console.log("-------------------- Builder OO ---------------------");
const report2 = new ReportBuilder()
  .withTitle("Ventas Q1")
  .withCharts()
  .asPdf()
  .inSpanish()
  .build();
console.log(report2);

console.log("\n------------------------------------------------------------\n");

console.log("-------------------- 4: Prototype ---------------------\n");
import { ReportTemplate } from "./4-prototype/prototype-oo.js";
import {
  blackFridayPrototype,
  cloneCampaign,
} from "./4-prototype/prototype-real.js";

console.log("-------------------- Prototype OO ---------------------");
const quarterlyTemplate = new ReportTemplate(
  "Reporte trimestral",
  ["Resumen", "Ventas", "Conclusiones"],
  true,
);

const customReport = quarterlyTemplate.clone();
customReport.title = "Reporte Q1";
customReport.sections.push("Anexos");
console.log(customReport);

console.log("----------------- Prototype Real example -------------------");
const cyberMondayCampaign = cloneCampaign(blackFridayPrototype, {
  subject: "Cyber Monday empezó",
  utmCampaign: "cyber-monday",
});
console.log(cyberMondayCampaign);

console.log("\n------------------------------------------------------------\n");

console.log("-------------------- 5: Singleton ---------------------\n");

import { logger } from "./5-singleton/singleton.js";
import { logger as loggerOO } from "./5-singleton/singleton-oo.js";
import { getDatabaseConnection } from "./5-singleton/singleton-lazy.js";

console.log("-------------------- Singleton ------------------------\n");
logger.info("Pedido creado");
logger.error("Error al procesar el pago");

console.log("-------------------- Singleton OO ---------------------\n");

loggerOO.info("Aplicación iniciada");
loggerOO.error("Error al cargar configuración");

console.log("-------------------- Singleton Lazy ---------------------\n");

const db = getDatabaseConnection();
const users = db.query("SELECT * FROM users");
console.log(users);

console.log("\n------------------------------------------------------------\n");
