console.log("----------------- 1: Chain of Responsibility -----------------");
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

console.log("------------------------- 2. Command ------------------------");
import {
  Button,
  CopyCommand,
  PasteCommand,
  TextEditor,
} from "./2-command/command-oo.js";
import { createButton, editor as editor2 } from "./2-command/command.js";

console.log("\n---------------------- Command OO ----------------------\n");
const editor = new TextEditor();

const copyButton = new Button(new CopyCommand(editor));
const pasteButton = new Button(new PasteCommand(editor));

copyButton.click();
pasteButton.click();

console.log("\n------------------------ Command ------------------------\n");
const copyButton2 = createButton(() => editor2.copy());
const pasteButton2 = createButton(() => editor2.paste());

copyButton2.click();
pasteButton2.click();

console.log("\n------------------------------------------------------------\n");
