console.log("-------------------- 1: Adapter ---------------------\n");
import {
  createPaymentAdapter,
  ExternalPaymentSDK,
} from "./1-adapter/adapter.js";
import { checkout, ExternalPaymentAdapter } from "./1-adapter/adapter-oo.js";
import {
  adaptExternalUser,
  type ExternalUserResponse,
} from "./1-adapter/adpater-api.js";

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
