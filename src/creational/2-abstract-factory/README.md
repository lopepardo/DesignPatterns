## Patrón creacional 2: Abstract Factory

### 1. Qué problema intenta resolver

Factory Method se enfocaba en crear un objeto concreto sin acoplar al cliente a su clase específica.

**Abstract Factory va un paso más allá:** intenta resolver la creación de **familias de objetos relacionados** que deben funcionar bien juntos.

El problema aparece cuando tu sistema no necesita elegir una sola implementación, sino un conjunto completo de piezas compatibles.

Por ejemplo, imagina una app con distintos temas visuales:

```ts id="puh3d2"
const button = new LightButton();
const modal = new LightModal();
const input = new LightInput();
```

Eso funciona mientras todo sea `Light`.

Pero luego aparece un tema oscuro:

```ts id="rgwn0p"
const button = new DarkButton();
const modal = new DarkModal();
const input = new DarkInput();
```

El problema no es solo crear objetos. El problema es evitar combinaciones incorrectas:

```ts id="9s5fmr"
const button = new LightButton();
const modal = new DarkModal();
const input = new LightInput();
```

Quizá técnicamente funciona, pero visualmente o conceptualmente es inconsistente.

Abstract Factory responde a esta pregunta:

“¿Cómo creo varios objetos relacionados garantizando que pertenezcan a la misma familia?”

---

### 2. Qué idea propone como solución

La solución conceptual es crear una fábrica abstracta que produzca varios tipos de objetos relacionados.

En vez de pedir directamente:

```ts id="xh8t56"
const button = new LightButton();
const modal = new LightModal();
```

pides una fábrica de una familia:

```ts id="trqt2t"
const uiFactory = createLightThemeFactory();

const button = uiFactory.createButton();
const modal = uiFactory.createModal();
```

O:

```ts id="2r0ng1"
const uiFactory = createDarkThemeFactory();

const button = uiFactory.createButton();
const modal = uiFactory.createModal();
```

La fábrica concreta decide qué variantes crear, pero el cliente solo conoce la interfaz general.

La diferencia clave con Factory Method es esta:

Factory Method suele crear **un tipo de producto**.

Abstract Factory crea **varios productos relacionados**.

En términos de SOLID:

Ayuda con **DIP**, porque el código cliente depende de abstracciones, no de implementaciones concretas.

Puede ayudar con **OCP**, porque puedes agregar una nueva familia sin cambiar mucho el código cliente.

Pero también puede tensionar OCP en otra dirección: si agregas un nuevo tipo de producto a la familia, quizá tengas que modificar todas las fábricas existentes.

Por ejemplo, si agregas `createTooltip()`, todas las fábricas de tema tienen que implementarlo.

---

### 3. Cómo se ve aplicado en TypeScript y otros lenguajes

#### Versión idiomática en TypeScript con objetos y funciones

En TypeScript no necesitas necesariamente clases. Una familia de productos puede representarse con un objeto que agrupa funciones creadoras.

```ts id="9qlpbk"
type Button = {
  render(): string;
};

type Modal = {
  render(): string;
};

type UIThemeFactory = {
  createButton(): Button;
  createModal(): Modal;
};

const lightThemeFactory: UIThemeFactory = {
  createButton() {
    return {
      render: () => "Botón claro",
    };
  },

  createModal() {
    return {
      render: () => "Modal claro",
    };
  },
};

const darkThemeFactory: UIThemeFactory = {
  createButton() {
    return {
      render: () => "Botón oscuro",
    };
  },

  createModal() {
    return {
      render: () => "Modal oscuro",
    };
  },
};

function renderSettingsPage(factory: UIThemeFactory) {
  const button = factory.createButton();
  const modal = factory.createModal();

  console.log(button.render());
  console.log(modal.render());
}

renderSettingsPage(lightThemeFactory);
renderSettingsPage(darkThemeFactory);
```

Aquí el cliente no sabe si los productos son claros u oscuros. Solo sabe que la fábrica produce un botón y un modal compatibles.

---

#### Selección dinámica de familia

Podrías elegir la fábrica según configuración:

```ts id="huc3he"
type Theme = "light" | "dark";

const factories: Record<Theme, UIThemeFactory> = {
  light: lightThemeFactory,
  dark: darkThemeFactory,
};

function getThemeFactory(theme: Theme): UIThemeFactory {
  return factories[theme];
}

const factory = getThemeFactory("dark");

renderSettingsPage(factory);
```

Esto evita que el resto de la aplicación se llene de condicionales:

```ts id="85zebg"
if (theme === "dark") {
  // crear botón oscuro
} else {
  // crear botón claro
}
```

La decisión se concentra en un punto.

---

#### Versión con clases en TypeScript

La versión más cercana al GoF clásico se ve así:

```ts id="u9z8b7"
interface Button {
  render(): string;
}

interface Modal {
  render(): string;
}

interface UIThemeFactory {
  createButton(): Button;
  createModal(): Modal;
}

class LightButton implements Button {
  render(): string {
    return "Botón claro";
  }
}

class LightModal implements Modal {
  render(): string {
    return "Modal claro";
  }
}

class DarkButton implements Button {
  render(): string {
    return "Botón oscuro";
  }
}

class DarkModal implements Modal {
  render(): string {
    return "Modal oscuro";
  }
}

class LightThemeFactory implements UIThemeFactory {
  createButton(): Button {
    return new LightButton();
  }

  createModal(): Modal {
    return new LightModal();
  }
}

class DarkThemeFactory implements UIThemeFactory {
  createButton(): Button {
    return new DarkButton();
  }

  createModal(): Modal {
    return new DarkModal();
  }
}

function renderPage(factory: UIThemeFactory) {
  const button = factory.createButton();
  const modal = factory.createModal();

  console.log(button.render());
  console.log(modal.render());
}

renderPage(new DarkThemeFactory());
```

Esta forma puede ser útil si los productos tienen estado interno, herencia real, métodos complejos o integración con frameworks que favorecen clases.

Pero en TypeScript, si solo estás devolviendo comportamiento simple, puede ser más expresivo usar objetos y funciones.

---

#### Ejemplo más realista: proveedores de pago

Supón que tienes varios proveedores de pago. Cada proveedor requiere objetos compatibles entre sí: un procesador de pagos, un validador de webhook y un formateador de recibos.

```ts id="hqhkeu"
type PaymentProcessor = {
  charge(amount: number): Promise<void>;
};

type WebhookValidator = {
  validate(payload: unknown): boolean;
};

type ReceiptFormatter = {
  format(amount: number): string;
};

type PaymentProviderFactory = {
  createProcessor(): PaymentProcessor;
  createWebhookValidator(): WebhookValidator;
  createReceiptFormatter(): ReceiptFormatter;
};
```

Stripe:

```ts id="4ih540"
const stripeFactory: PaymentProviderFactory = {
  createProcessor() {
    return {
      async charge(amount) {
        console.log(`Cobrando ${amount} con Stripe`);
      },
    };
  },

  createWebhookValidator() {
    return {
      validate(payload) {
        console.log("Validando webhook de Stripe");
        return true;
      },
    };
  },

  createReceiptFormatter() {
    return {
      format(amount) {
        return `Recibo Stripe por $${amount}`;
      },
    };
  },
};
```

Mercado Pago:

```ts id="hd5vkc"
const mercadoPagoFactory: PaymentProviderFactory = {
  createProcessor() {
    return {
      async charge(amount) {
        console.log(`Cobrando ${amount} con Mercado Pago`);
      },
    };
  },

  createWebhookValidator() {
    return {
      validate(payload) {
        console.log("Validando webhook de Mercado Pago");
        return true;
      },
    };
  },

  createReceiptFormatter() {
    return {
      format(amount) {
        return `Recibo Mercado Pago por $${amount}`;
      },
    };
  },
};
```

Uso:

```ts id="qvw6lf"
async function checkout(factory: PaymentProviderFactory) {
  const processor = factory.createProcessor();
  const receiptFormatter = factory.createReceiptFormatter();

  await processor.charge(100);

  const receipt = receiptFormatter.format(100);
  console.log(receipt);
}

checkout(stripeFactory);
checkout(mercadoPagoFactory);
```

Lo importante es que no mezclas accidentalmente:

```ts id="4f8eyh"
const processor = stripeFactory.createProcessor();
const validator = mercadoPagoFactory.createWebhookValidator();
```

El diseño te empuja a usar piezas de la misma familia.

---

#### Comparación con Java

En Java se suele expresar con interfaces y clases:

```java id="xr8ek3"
interface Button {
    String render();
}

interface Modal {
    String render();
}

interface UIThemeFactory {
    Button createButton();
    Modal createModal();
}

class LightThemeFactory implements UIThemeFactory {
    public Button createButton() {
        return new LightButton();
    }

    public Modal createModal() {
        return new LightModal();
    }
}
```

Java hace natural esta estructura porque las interfaces nominales y las clases son el camino habitual.

TypeScript, por su tipado estructural, permite usar objetos que “tienen la forma correcta” sin declarar toda una jerarquía.

---

#### Comparación con Go

Go no tiene clases en el mismo sentido, pero puedes lograr la idea con interfaces y structs:

```go id="3oa2pb"
type Button interface {
	Render() string
}

type Modal interface {
	Render() string
}

type UIThemeFactory interface {
	CreateButton() Button
	CreateModal() Modal
}
```

La fábrica concreta implementaría esos métodos.

Go suele favorecer composición e interfaces pequeñas, así que una Abstract Factory demasiado grande puede sentirse pesada.

---

### 4. Ejemplo de mal uso o mala interpretación

Un mal uso común es usar Abstract Factory cuando solo necesitas crear una cosa.

Por ejemplo:

```ts id="i68olx"
type UserFactory = {
  createUser(): User;
  createAdminUser(): User;
  createGuestUser(): User;
};
```

Esto podría ser simplemente varias funciones o una factory simple. No necesariamente hay una “familia de objetos relacionados”.

Otro mal uso es crear una fábrica abstracta gigantesca:

```ts id="e86p4b"
type AppFactory = {
  createButton(): Button;
  createModal(): Modal;
  createLogger(): Logger;
  createDatabase(): Database;
  createPaymentProcessor(): PaymentProcessor;
  createEmailSender(): EmailSender;
  createAnalytics(): Analytics;
  createCache(): Cache;
};
```

Eso puede violar el principio de responsabilidad única. La fábrica se convierte en un contenedor global de dependencias mal organizado.

También puede llevar a una falsa sensación de diseño limpio. Aunque todo esté “abstraído”, podrías estar escondiendo una dependencia global enorme.

Otro error frecuente es pensar que Abstract Factory siempre requiere herencia. No. En TypeScript, una simple estructura como esta puede ser suficiente:

```ts id="g7asja"
const factory = {
  createButton: () => ({ render: () => "Botón" }),
  createModal: () => ({ render: () => "Modal" }),
};
```

Si conceptualmente produce una familia de objetos relacionados, ya estás aplicando la idea.

---

### 5. Cuándo conviene aplicarlo y cuándo puede ser innecesario

Conviene aplicarlo cuando tienes familias de objetos que deben ser compatibles entre sí.

Casos típicos:

Temas visuales: claro, oscuro, alto contraste.

Componentes por plataforma: web, iOS, Android, desktop.

Proveedores externos: Stripe, Mercado Pago, PayPal.

Infraestructura por entorno: local, staging, producción.

Drivers o adaptadores: MySQL, PostgreSQL, SQLite.

Formatos de exportación: PDF, HTML, Markdown, CSV, si cada formato requiere varias piezas coordinadas.

Por ejemplo:

```ts id="3bcaiz"
const reportFactory = getReportFactory("pdf");

const renderer = reportFactory.createRenderer();
const formatter = reportFactory.createFormatter();
const exporter = reportFactory.createExporter();
```

Tiene sentido si esas piezas están conectadas conceptualmente.

---

Puede ser innecesario o excesivo cuando:

Solo estás creando un único objeto.

No hay riesgo real de mezclar piezas incompatibles.

La familia de productos cambia demasiado seguido y cada cambio obliga a modificar todas las fábricas.

La abstracción hace más difícil leer el flujo.

El sistema es pequeño y un objeto de configuración resolvería mejor el problema.

Por ejemplo, para temas visuales simples en frontend, quizá no necesitas Abstract Factory:

```ts id="m9g5u2"
const theme = {
  buttonClass: "bg-black text-white",
  modalClass: "bg-neutral-900",
};
```

En React, muchas veces un `ThemeProvider`, configuración, composición de componentes o props pueden ser más naturales que una Abstract Factory formal.

---

### 6. Analogía sencilla

Imagina que estás amoblando una casa.

No quieres comprar una silla moderna, una mesa colonial y una lámpara futurista si buscas que todo combine. Entonces eliges una colección completa: “línea minimalista”, “línea rústica” o “línea industrial”.

Cada colección produce varios objetos: silla, mesa, lámpara, sofá. Lo importante es que todos pertenecen al mismo estilo.

Abstract Factory funciona igual: eliges una familia, y a partir de esa familia creas varias piezas compatibles.

---

La idea clave: **Abstract Factory no trata solo de crear objetos; trata de crear conjuntos coherentes de objetos relacionados**. En TypeScript, muchas veces se expresa mejor como un objeto de funciones creadoras que como una jerarquía pesada de clases.
