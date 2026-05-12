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

console.log("-------------------- 3: Builder ---------------------\n");
