# Patrón estructural 1: Adapter

## 1. Qué problema intenta resolver

Adapter intenta resolver un problema muy común: tienes dos piezas de código que podrían colaborar, pero sus interfaces no coinciden.

Por ejemplo, tu aplicación espera trabajar con un servicio de pagos así:

```ts
type PaymentProcessor = {
  pay(amount: number): Promise<void>;
};
```

Pero una librería externa funciona así:

```ts
class ExternalPaymentSDK {
  makePayment(valueInCents: number): Promise<boolean> {
    // ...
  }
}
```

Tu código espera `pay(amount)`, pero la librería ofrece `makePayment(valueInCents)`.

Podrías modificar toda tu aplicación para ajustarte al SDK externo, pero eso acoplaría tu lógica interna a una herramienta concreta.

Adapter responde a esta pregunta:

**“¿Cómo hago que una interfaz incompatible pueda ser usada como si tuviera la interfaz que mi sistema espera?”**

El problema no es que una interfaz sea “mala” y otra “buena”. El problema es que no encajan.

---

## 2. Qué idea propone como solución

La solución conceptual es crear una capa intermedia que traduzca una interfaz a otra.

Tu aplicación habla con una interfaz propia:

```ts
processor.pay(100);
```

El adapter recibe esa llamada y la transforma en la llamada que entiende el sistema externo:

```ts
externalSdk.makePayment(10000);
```

El cliente no necesita saber que debajo hay una librería externa con nombres, formatos o convenciones distintas.

La estructura conceptual es:

```ts
Cliente → Interfaz esperada → Adapter → Servicio incompatible
```

Adapter ayuda bastante con **DIP** porque tu código de alto nivel puede depender de una abstracción propia, no directamente de una librería externa.

También puede ayudar con **OCP**, porque puedes integrar nuevas implementaciones creando nuevos adapters sin reescribir toda la lógica cliente.

Pero cuidado: Adapter no debe usarse para esconder desorden interno innecesariamente. Su valor aparece cuando hay una frontera real entre dos modelos o interfaces.

---

## 3. Cómo se ve aplicado en TypeScript y otros lenguajes

### Ejemplo simple en TypeScript

Supongamos que tu dominio espera esto:

```ts
type PaymentProcessor = {
  pay(amount: number): Promise<void>;
};
```

Pero tienes un SDK externo:

```ts
class ExternalPaymentSDK {
  async makePayment(valueInCents: number): Promise<boolean> {
    console.log(`Pagando ${valueInCents} centavos`);
    return true;
  }
}
```

Creamos un adapter:

```ts
class ExternalPaymentAdapter implements PaymentProcessor {
  constructor(private sdk: ExternalPaymentSDK) {}

  async pay(amount: number): Promise<void> {
    const valueInCents = amount * 100;

    const success = await this.sdk.makePayment(valueInCents);

    if (!success) {
      throw new Error("El pago falló");
    }
  }
}
```

Uso:

```ts
async function checkout(processor: PaymentProcessor) {
  await processor.pay(150);
}

const sdk = new ExternalPaymentSDK();
const processor = new ExternalPaymentAdapter(sdk);

checkout(processor);
```

La función `checkout` no sabe que existe `ExternalPaymentSDK`. Solo conoce `PaymentProcessor`.

Eso es importante: el adapter protege tu código de detalles externos.

---

## Adapter sin clases en TypeScript

En TypeScript muchas veces no necesitas una clase. Puedes adaptar con una función.

```ts
type PaymentProcessor = {
  pay(amount: number): Promise<void>;
};

class ExternalPaymentSDK {
  async makePayment(valueInCents: number): Promise<boolean> {
    console.log(`Pagando ${valueInCents} centavos`);
    return true;
  }
}

function createPaymentAdapter(sdk: ExternalPaymentSDK): PaymentProcessor {
  return {
    async pay(amount: number) {
      const success = await sdk.makePayment(amount * 100);

      if (!success) {
        throw new Error("El pago falló");
      }
    },
  };
}
```

Uso:

```ts
const processor = createPaymentAdapter(new ExternalPaymentSDK());

await processor.pay(150);
```

Esta versión suele sentirse más natural en TypeScript cuando solo necesitas transformar una interfaz.

---

## Ejemplo práctico: adaptar una API externa

Tu aplicación quizá quiere trabajar con usuarios así:

```ts
type User = {
  id: string;
  fullName: string;
  email: string;
};
```

Pero una API externa devuelve esto:

```ts
type ExternalUserResponse = {
  user_id: number;
  first_name: string;
  last_name: string;
  contact: {
    email_address: string;
  };
};
```

Puedes crear un adapter de datos:

```ts
function adaptExternalUser(response: ExternalUserResponse): User {
  return {
    id: String(response.user_id),
    fullName: `${response.first_name} ${response.last_name}`,
    email: response.contact.email_address,
  };
}
```

Uso:

```ts
const externalUser: ExternalUserResponse = {
  user_id: 123,
  first_name: "Ana",
  last_name: "Gómez",
  contact: {
    email_address: "ana@example.com",
  },
};

const user = adaptExternalUser(externalUser);
```

Aquí el adapter no es una clase. Es una función de traducción.

Esto es muy común en TypeScript: adaptar DTOs externos a modelos internos.

---

## Adapter para APIs del navegador

Supón que tu código espera una interfaz genérica de almacenamiento:

```ts
type StoragePort = {
  get(key: string): string | null;
  set(key: string, value: string): void;
};
```

`localStorage` ya tiene una interfaz parecida, pero no exactamente igual si quieres controlar nombres o serialización.

```ts
function createLocalStorageAdapter(prefix: string): StoragePort {
  return {
    get(key: string) {
      return localStorage.getItem(`${prefix}:${key}`);
    },

    set(key: string, value: string) {
      localStorage.setItem(`${prefix}:${key}`, value);
    },
  };
}
```

Uso:

```ts
const storage = createLocalStorageAdapter("my-app");

storage.set("token", "abc123");
const token = storage.get("token");
```

El resto de tu aplicación no depende directamente de `localStorage`.

Eso facilita pruebas:

```ts
function createMemoryStorage(): StoragePort {
  const data = new Map<string, string>();

  return {
    get(key) {
      return data.get(key) ?? null;
    },

    set(key, value) {
      data.set(key, value);
    },
  };
}
```

Puedes usar `createMemoryStorage()` en tests sin tocar el navegador.

---

## Comparación con Java

En Java, Adapter suele aparecer con clases e interfaces explícitas.

```java
interface PaymentProcessor {
    void pay(int amount);
}

class ExternalPaymentSdk {
    boolean makePayment(int valueInCents) {
        System.out.println("Pagando " + valueInCents + " centavos");
        return true;
    }
}

class ExternalPaymentAdapter implements PaymentProcessor {
    private final ExternalPaymentSdk sdk;

    ExternalPaymentAdapter(ExternalPaymentSdk sdk) {
        this.sdk = sdk;
    }

    public void pay(int amount) {
        boolean success = sdk.makePayment(amount * 100);

        if (!success) {
            throw new RuntimeException("El pago falló");
        }
    }
}
```

En Java, la forma con clase es natural porque las interfaces son nominales y las clases tienen más peso en el diseño.

En TypeScript, la misma idea puede ser una clase, una función o un objeto literal.

---

## Comparación con Python

En Python puede verse muy simple:

```python
class ExternalPaymentSDK:
    def make_payment(self, value_in_cents):
        print(f"Pagando {value_in_cents} centavos")
        return True

class PaymentAdapter:
    def __init__(self, sdk):
        self.sdk = sdk

    def pay(self, amount):
        success = self.sdk.make_payment(amount * 100)

        if not success:
            raise Exception("El pago falló")
```

Pero también puede ser una función:

```python
def adapt_payment_sdk(sdk):
    return {
        "pay": lambda amount: sdk.make_payment(amount * 100)
    }
```

Python, como TypeScript, permite soluciones más ligeras que una jerarquía clásica.

---

## 4. Ejemplo de mal uso o mala interpretación

Un mal uso común es crear adapters cuando las interfaces ya son suficientemente compatibles.

```ts
type Logger = {
  info(message: string): void;
};

const consoleLogger: Logger = {
  info(message) {
    console.log(message);
  },
};
```

Esto es suficiente. No necesitas necesariamente:

```ts
class ConsoleLoggerAdapter implements Logger {
  info(message: string): void {
    console.log(message);
  }
}
```

La clase no aporta mucho si no hay traducción real.

Otro mal uso es convertir Adapter en un lugar donde se mezclan demasiadas responsabilidades.

```ts
class PaymentAdapter {
  async pay(amount: number) {
    // validar carrito
    // calcular descuentos
    // consultar base de datos
    // convertir moneda
    // llamar SDK externo
    // enviar email
    // registrar auditoría
  }
}
```

Eso ya no es solo un adapter. Ahí hay lógica de negocio, persistencia, notificaciones y pagos mezclados.

Un adapter debería traducir entre interfaces. Puede hacer transformaciones necesarias, pero no debería convertirse en el centro de la aplicación.

También es mala idea dejar que el modelo externo invada tu dominio:

```ts
async function checkout(sdk: ExternalPaymentSDK) {
  await sdk.makePayment(15000);
}
```

Esto parece simple, pero ahora tu caso de uso depende directamente de una librería concreta. Si mañana cambias de proveedor, tendrás que tocar más código.

Una versión mejor:

```ts
async function checkout(processor: PaymentProcessor) {
  await processor.pay(150);
}
```

Y afuera decides qué adapter usar.

---

## 5. Cuándo conviene aplicarlo y cuándo puede ser innecesario o excesivo

Conviene aplicarlo cuando:

Tienes que integrar una librería externa con una interfaz distinta.

Quieres proteger tu dominio de detalles externos.

Necesitas transformar formatos de datos.

Quieres reemplazar una implementación sin tocar el código cliente.

Quieres facilitar pruebas usando implementaciones falsas o en memoria.

Casos típicos:

APIs externas.

SDKs de pago.

Clientes HTTP.

Sistemas de almacenamiento.

Servicios de email.

Integraciones con analytics.

Conversión entre DTOs externos y modelos internos.

Ejemplo razonable:

```ts
type EmailSender = {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
};
```

Aunque el proveedor externo tenga algo como:

```ts
provider.messages.create({
  destination: to,
  title: subject,
  htmlBody: body,
});
```

Tu aplicación no necesita depender de esa forma concreta.

---

Puede ser innecesario cuando:

La interfaz externa ya coincide con lo que necesitas.

El código es pequeño y no hay intención real de reemplazo.

La adaptación agrega más complejidad que claridad.

Solo estás envolviendo métodos sin cambiar nada.

Por ejemplo:

```ts
const logger = console;
```

Si eso basta para tu caso, no necesitas un `ConsoleAdapter`.

También puede ser excesivo crear adapters para cada función interna del sistema. Adapter tiene más sentido en fronteras: entre tu código y algo externo, o entre dos módulos con modelos distintos.

---

## 6. Analogía sencilla

Imagina que viajas a otro país y tu cargador no encaja en el enchufe.

El cargador funciona. El enchufe también funciona. El problema es que sus formas no coinciden.

Usas un adaptador.

El adaptador no cambia la electricidad de fondo ni reescribe tu cargador. Solo traduce la conexión para que dos cosas incompatibles puedan trabajar juntas.

Adapter en software hace lo mismo: permite que tu código use algo existente sin acoplarse directamente a su forma original.

---

La idea clave: **Adapter no es envolver por envolver; es traducir una interfaz incompatible a una interfaz que tu sistema sí quiere usar**. En TypeScript, muchas veces una función de adaptación o un objeto literal es más claro que una clase formal.
