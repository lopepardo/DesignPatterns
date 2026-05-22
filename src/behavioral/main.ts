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

console.log("---------------------- 3. Interpreter ------------------------");
import {
  AndExpression,
  CountryIsExpression,
  IsPremiumExpression,
  MinimumAgeExpression,
  OrExpression,
  type User,
} from "./3-interpreter/interpreter-oo.js";
import {
  and,
  countryIs,
  isPremium,
  minimumAge,
  or,
} from "./3-interpreter/interpreter.js";
import {
  evaluateDiscountRule,
  type DiscountRule,
} from "./3-interpreter/interpreter-discount.js";

console.log("\n---------------------- Interpreter OO ----------------------\n");
// (user.isPremium AND user.country == "CO") OR user.age >= 65
const rule = new OrExpression(
  new AndExpression(new IsPremiumExpression(), new CountryIsExpression("CO")),
  new MinimumAgeExpression(65),
);

const user: User = {
  age: 70,
  country: "MX",
  isPremium: false,
};

console.log("¿El usuario cumple la regla?", rule.interpret(user));

console.log("\n---------------------- Interpreter ----------------------\n");
const rule2 = or(and(isPremium, countryIs("CO")), minimumAge(65));

const user2: User = {
  age: 30,
  country: "CO",
  isPremium: true,
};

console.log("¿El usuario cumple la regla?", rule2(user2));

console.log("\n------------------ Interpreter discount ------------------\n");
const discountRule: DiscountRule = {
  type: "and",
  rules: [
    {
      type: "customerIsPremium",
    },
    {
      type: "totalGreaterThan",
      amount: 100000,
    },
    {
      type: "categoryIs",
      category: "fashion",
    },
  ],
};

const applies = evaluateDiscountRule(discountRule, {
  total: 150000,
  category: "fashion",
  customer: {
    isPremium: true,
    country: "CO",
  },
});

console.log("¿Aplica el descuento?", applies);

console.log("\n------------------------------------------------------------\n");

console.log("------------------------- 4. Iterator ------------------------");
import { TaskCollection } from "./4-iterator/iterator-oo.js";
import { TaskCollectionTs } from "./4-iterator/iterator.js";
import {
  traverseDepthFirst,
  type CategoryNode,
} from "./4-iterator/iterator-tree.js";

console.log("\n----------------------- Iterator OO -----------------------\n");
const tasks = new TaskCollection();

tasks.add({ id: "1", title: "Estudiar TypeScript" });
tasks.add({ id: "2", title: "Practicar patrones" });

const iterator = tasks.createIterator();

while (iterator.hasNext()) {
  const task = iterator.next();
  console.log(task);
}

console.log("\n------------------------- Iterator ------------------------\n");
const tasks2 = new TaskCollectionTs();

tasks2.add({ id: "1", title: "Estudiar TypeScript" });
tasks2.add({ id: "2", title: "Practicar patrones" });

for (const task of tasks2) {
  console.log(task);
}

console.log("\n------------------------------------------------------------\n");
const catalog: CategoryNode = {
  name: "Tienda",
  children: [
    {
      name: "Ropa",
      children: [
        { name: "Camisas", children: [] },
        { name: "Zapatos", children: [] },
      ],
    },
    {
      name: "Tecnología",
      children: [{ name: "Celulares", children: [] }],
    },
  ],
};

for (const category of traverseDepthFirst(catalog)) {
  console.log(
    category.children.length > 0 ? category.name : `- ${category.name}`,
  );
}

console.log("\n------------------------------------------------------------\n");

console.log("------------------------- 5. Mediator ------------------------");
import {
  TextInput,
  Button as Button2,
  LoginMediator,
} from "./5-mediator/mediator-oo.js";
import { createLoginMediator } from "./5-mediator/mediator.js";

console.log("\n----------------------- Mediator OO ----------------------\n");
const submitButton = new Button2();

let mediator: LoginMediator;

const emailInput = new TextInput("email", {
  notify: (...args) => mediator.notify(...args),
});

const passwordInput = new TextInput("password", {
  notify: (...args) => mediator.notify(...args),
});

mediator = new LoginMediator(emailInput, passwordInput, submitButton);

emailInput.setValue("ana@example.com");
submitButton.click();
passwordInput.setValue("123456");
submitButton.click();

console.log("\n------------------------- Mediator ------------------------\n");
const loginMediator = createLoginMediator();

loginMediator.updateEmail("ana@example.com");
loginMediator.submit();
loginMediator.updatePassword("123456");
loginMediator.submit();

console.log("\n------------------------------------------------------------\n");

console.log("----------------------- 6. Memento -----------------------\n");
import {
  EditorHistory,
  TextEditor as TextEditorMemento,
} from "./6-memento/memento-oo.js";
import {
  StateHistory,
  updateContent,
  type DocumentState,
} from "./6-memento/memento.js";

console.log("\n----------------------- Memento OO -----------------------\n");
const editor3 = new TextEditorMemento();
const history = new EditorHistory();

history.push(editor3.save());

editor3.type("Hola");
console.log(editor3.getContent());
history.push(editor3.save());

editor3.type(" mundo");
console.log(editor3.getContent());

const previous = history.pop();
if (previous) {
  editor3.restore(previous);
}
console.log(editor3.getContent());

console.log("\n------------------------- Memento ------------------------\n");
let documentState: DocumentState = {
  title: "Documento",
  content: "",
};

const history2 = new StateHistory<DocumentState>();

history2.push(documentState);
documentState = updateContent(documentState, "Hola");
console.log(documentState.content);

history2.push(documentState);

documentState = updateContent(documentState, "Hola mundo");
console.log(documentState.content);

const previous2 = history2.pop();
if (previous2) {
  documentState = previous2;
}
console.log(documentState.content);
