console.log("----------------- 1: Chain of Responsibility -----------------\n");
import {
  BillingHandler,
  GeneralHandler,
  TechnicalHandler,
} from "./1-chain-of-responsibility/chain-of-responsibility-oo.js";
import {
  composeHandlers,
  createOrder,
  requireAdmin,
  requireAuth,
} from "./1-chain-of-responsibility/chain-of-responsibility.js";
import {
  applyDiscount,
  applyTaxes,
  calculateFinalTotal,
  pipe,
} from "./1-chain-of-responsibility/chain-of-responsibility-pipeline.js";

console.log("\n--------------- Chain of Responsibility OO ----------------\n");
const billing = new BillingHandler();
const technical = new TechnicalHandler();
const general = new GeneralHandler();

billing.setNext(technical).setNext(general);
console.log(billing);

const result = billing.handle({
  type: "technical",
  message: "No puedo iniciar sesión",
});
console.log(result);

console.log("\n----------------- Chain of Responsibility ------------------\n");
const handler = composeHandlers([requireAuth, requireAdmin], createOrder);

const result2 = await handler({
  user: {
    id: "u1",
    role: "customer",
  },
});
console.log(result2);

console.log("\n------------ Chain of Responsibility Pipeline -------------\n");
const order = pipe(
  {
    id: "order-1",
    total: 100000,
  },
  [applyDiscount, applyTaxes, calculateFinalTotal],
);
console.log(order);

console.log("\n------------------------------------------------------------\n");
