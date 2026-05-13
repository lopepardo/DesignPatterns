## Patrón creacional 4: Prototype

### 1. Qué problema intenta resolver

Prototype intenta resolver el problema de crear nuevos objetos a partir de otros objetos existentes, especialmente cuando construirlos desde cero es costoso, repetitivo o depende de una configuración ya preparada.

La idea aparece cuando tienes un objeto que ya tiene una estructura, configuración o estado base, y quieres crear otro parecido sin reconstruirlo manualmente.

Por ejemplo:

```ts
const defaultInvoice = {
  currency: "COP",
  country: "CO",
  taxRate: 0.19,
  language: "es",
};
```

Ahora quieres crear facturas usando esa base:

```ts
const invoice = {
  currency: "COP",
  country: "CO",
  taxRate: 0.19,
  language: "es",
  customerName: "Ana",
  amount: 120000,
};
```

Podrías repetir todos los campos cada vez, pero eso duplica conocimiento. Prototype propone partir de un objeto existente y crear una copia adaptada.

La pregunta central es:

“¿Cómo creo nuevos objetos reutilizando un objeto base ya configurado, sin depender de una clase concreta ni reconstruir todo desde cero?”

---

### 2. Qué idea propone como solución

La solución conceptual es usar un objeto existente como prototipo para crear nuevos objetos.

En vez de decir:

```ts
const invoice = new Invoice(...muchosDatos);
```

puedes decir:

```ts
const invoice = clone(defaultInvoice);
```

y luego ajustar lo necesario.

En el patrón GoF clásico, el objeto prototipo suele tener un método `clone()`:

```ts
const copy = original.clone();
```

Pero en JavaScript y TypeScript hay algo especial: el lenguaje ya tiene prototipos en su modelo de objetos. Eso puede confundir un poco.

Hay dos ideas relacionadas, pero no idénticas:

Prototype como patrón GoF: crear objetos copiando otros objetos existentes.

Prototype como mecanismo de JavaScript: objetos que delegan propiedades mediante la cadena de prototipos.

En esta explicación nos interesa principalmente el patrón GoF, pero vale la pena ver ambos porque TypeScript compila a JavaScript y vive en ese ecosistema.

---

### 3. Cómo se ve aplicado en TypeScript y otros lenguajes

#### Versión simple en TypeScript con spread

En TypeScript, muchas veces Prototype se expresa con copia de objetos:

```ts
type Invoice = {
  currency: string;
  country: string;
  taxRate: number;
  language: string;
  customerName: string;
  amount: number;
};

const invoicePrototype = {
  currency: "COP",
  country: "CO",
  taxRate: 0.19,
  language: "es",
};

const invoice: Invoice = {
  ...invoicePrototype,
  customerName: "Ana",
  amount: 120000,
};
```

Aquí `invoicePrototype` funciona como una base. No necesitas una clase ni un método `clone()`.

Esto es común en TypeScript porque los objetos literales son expresivos y el spread operator hace que la copia superficial sea sencilla.

Pero hay que notar algo importante: esto hace una copia superficial.

---

#### Problema con copias superficiales

Mira este ejemplo:

```ts
const defaultConfig = {
  theme: "dark",
  notifications: {
    email: true,
    sms: false,
  },
};

const userConfig = {
  ...defaultConfig,
};

userConfig.notifications.email = false;

console.log(defaultConfig.notifications.email); // false
```

Aunque copiaste `defaultConfig`, el objeto interno `notifications` sigue siendo compartido.

Esto puede causar bugs sutiles.

Para evitarlo, puedes copiar también los objetos internos:

```ts
const userConfig = {
  ...defaultConfig,
  notifications: {
    ...defaultConfig.notifications,
  },
};
```

O usar `structuredClone` cuando sea apropiado:

```ts
const userConfig = structuredClone(defaultConfig);
```

`structuredClone` hace una copia profunda de muchos tipos de datos comunes, aunque no sirve para todo: por ejemplo, no clona funciones de la manera que quizá esperarías.

---

#### Prototype con función factory en TypeScript

Una opción más segura es encapsular la copia:

```ts
type NotificationSettings = {
  email: boolean;
  sms: boolean;
};

type UserConfig = {
  theme: "light" | "dark";
  language: "es" | "en";
  notifications: NotificationSettings;
};

const defaultUserConfig: UserConfig = {
  theme: "dark",
  language: "es",
  notifications: {
    email: true,
    sms: false,
  },
};

function createUserConfig(overrides: Partial<UserConfig> = {}): UserConfig {
  return {
    ...defaultUserConfig,
    ...overrides,
    notifications: {
      ...defaultUserConfig.notifications,
      ...overrides.notifications,
    },
  };
}

const config = createUserConfig({
  language: "en",
  notifications: {
    sms: true,
  },
});
```

Aquí el prototipo sigue siendo `defaultUserConfig`, pero la creación está protegida por una función.

Esto suele ser más conveniente que dejar spreads repetidos por toda la app.

---

#### Prototype con método clone

La versión más cercana al GoF clásico sería:

```ts
interface Prototype<T> {
  clone(): T;
}

class ReportTemplate implements Prototype<ReportTemplate> {
  constructor(
    public title: string,
    public sections: string[],
    public includeCharts: boolean,
  ) {}

  clone(): ReportTemplate {
    return new ReportTemplate(
      this.title,
      [...this.sections],
      this.includeCharts,
    );
  }
}

const quarterlyTemplate = new ReportTemplate(
  "Reporte trimestral",
  ["Resumen", "Ventas", "Conclusiones"],
  true,
);

const customReport = quarterlyTemplate.clone();
customReport.title = "Reporte Q1";
customReport.sections.push("Anexos");
```

Aquí `clone()` permite controlar qué se copia y cómo.

La línea importante es:

```ts
[...this.sections];
```

Si hubiéramos usado directamente `this.sections`, ambos reportes compartirían el mismo arreglo.

---

#### Prototype usando Object.create

JavaScript también permite crear un objeto que delega en otro:

```ts
const baseUser = {
  role: "customer",
  canBuy: true,
};

const premiumUser = Object.create(baseUser);
premiumUser.role = "premium";
premiumUser.canAccessPremiumSupport = true;

console.log(premiumUser.canBuy); // true
```

Aquí `premiumUser` no copia todas las propiedades de `baseUser`; delega en él mediante la cadena de prototipos.

Esto es poderoso, pero en aplicaciones TypeScript modernas se usa menos para modelar dominio cotidiano porque puede hacer menos explícito de dónde vienen las propiedades.

Para el patrón Prototype, normalmente es más claro pensar en “clonar/copiar” que en “delegar por prototype chain”, salvo que estés trabajando cerca del modelo nativo de JavaScript.

---

#### Ejemplo práctico: plantillas de campañas

Supón que tienes campañas de marketing con una configuración base:

```ts
type Campaign = {
  channel: "email" | "sms";
  language: "es" | "en";
  tracking: {
    utmSource: string;
    utmCampaign: string;
  };
  content: {
    subject: string;
    body: string;
  };
};

const blackFridayPrototype: Campaign = {
  channel: "email",
  language: "es",
  tracking: {
    utmSource: "newsletter",
    utmCampaign: "black-friday",
  },
  content: {
    subject: "Oferta especial",
    body: "Aprovecha nuestros descuentos.",
  },
};

function cloneCampaign(
  prototype: Campaign,
  overrides: {
    subject?: string;
    body?: string;
    utmCampaign?: string;
  },
): Campaign {
  return {
    ...prototype,
    tracking: {
      ...prototype.tracking,
      utmCampaign: overrides.utmCampaign ?? prototype.tracking.utmCampaign,
    },
    content: {
      ...prototype.content,
      subject: overrides.subject ?? prototype.content.subject,
      body: overrides.body ?? prototype.content.body,
    },
  };
}

const cyberMondayCampaign = cloneCampaign(blackFridayPrototype, {
  subject: "Cyber Monday empezó",
  utmCampaign: "cyber-monday",
});
```

Aquí Prototype te evita construir toda la campaña desde cero cada vez.

---

#### Comparación con Java

En Java, Prototype suele aparecer con `clone()`, aunque el mecanismo nativo `Cloneable` ha sido históricamente criticado por ser incómodo y propenso a errores.

Una versión conceptual sería:

```java
class ReportTemplate {
    private String title;
    private List<String> sections;

    public ReportTemplate(String title, List<String> sections) {
        this.title = title;
        this.sections = sections;
    }

    public ReportTemplate copy() {
        return new ReportTemplate(
            this.title,
            new ArrayList<>(this.sections)
        );
    }
}
```

Muchos equipos prefieren un método `copy()` o un constructor de copia antes que depender de `Cloneable`.

---

#### Comparación con Kotlin

Kotlin tiene una característica muy relacionada: las `data class` tienen método `copy()` automáticamente.

```kotlin
data class UserConfig(
    val theme: String,
    val language: String
)

val defaultConfig = UserConfig(
    theme = "dark",
    language = "es"
)

val englishConfig = defaultConfig.copy(language = "en")
```

Esto expresa Prototype de forma muy limpia: tomar un objeto existente y producir otro parecido con algunos cambios.

---

#### Comparación con Python

En Python puedes usar `copy.copy` o `copy.deepcopy`:

```python
import copy

default_config = {
    "theme": "dark",
    "notifications": {
        "email": True
    }
}

user_config = copy.deepcopy(default_config)
user_config["notifications"]["email"] = False
```

La distinción entre copia superficial y profunda también es muy importante en Python.

---

### 4. Ejemplo de mal uso o mala interpretación

Un mal uso típico es copiar objetos sin entender si la copia es superficial o profunda.

```ts
const original = {
  name: "Plan básico",
  features: ["email", "support"],
};

const copy = {
  ...original,
};

copy.features.push("analytics");

console.log(original.features);
// ["email", "support", "analytics"]
```

Esto puede sorprender porque `features` es el mismo arreglo en ambos objetos.

Otro mal uso es utilizar Prototype para evitar pensar en el modelo correcto.

Por ejemplo, si tienes objetos que se clonan y luego se mutan por todas partes:

```ts
const order2 = cloneOrder(order1);
order2.customer.address.city = "Bogotá";
order2.items[0].price = 0;
order2.status = "paid";
```

Quizá el problema real no es de creación, sino de control de invariantes, inmutabilidad o separación de responsabilidades.

También puede ser mala idea usar `Object.create` para “heredar” datos de negocio cuando una composición explícita sería más clara.

```ts
const colombianInvoice = Object.create(baseInvoice);
```

Esto puede dificultar depuración y serialización, porque algunas propiedades no están directamente en el objeto sino en su prototipo.

---

### 5. Cuándo conviene aplicarlo y cuándo puede ser innecesario

Conviene aplicarlo cuando:

Crear el objeto desde cero es costoso o repetitivo.

Tienes configuraciones base que se reutilizan con pequeñas variaciones.

Quieres crear objetos sin acoplarte a una clase concreta.

El objeto base representa una plantilla.

Necesitas preservar una estructura común pero permitir cambios puntuales.

Casos típicos:

Plantillas de documentos.

Configuraciones por defecto.

Datos de prueba.

Campañas de marketing.

Objetos gráficos en videojuegos o editores visuales.

Copias de formularios o layouts.

Por ejemplo, en tests es muy común:

```ts
const adminUser = createUser({
  role: "admin",
});
```

Internamente, `createUser` suele partir de un prototipo de usuario válido y sobrescribir algunos campos.

---

Puede ser innecesario o excesivo cuando:

El objeto es simple y se puede crear directamente.

No hay una plantilla real.

La copia introduce más riesgo que claridad.

El objeto tiene muchas referencias internas mutables difíciles de copiar bien.

El dominio necesita reglas fuertes de construcción que encajan mejor con Builder o factories.

Por ejemplo:

```ts
const point = { x: 10, y: 20 };
```

No necesitas Prototype para eso.

---

### 6. Analogía sencilla

Imagina que tienes una plantilla de contrato.

No escribes cada contrato desde cero. Tomas una versión base, haces una copia y cambias el nombre del cliente, la fecha y algunos detalles.

La plantilla original te ahorra trabajo y mantiene consistencia.

Prototype funciona igual: partes de un objeto ya preparado y creas otro parecido, ajustando lo necesario.

Pero hay que tener cuidado: si en vez de hacer una copia real, varias personas editan el mismo documento compartido, los cambios de una afectan a las demás. Ese es el equivalente a una copia superficial mal entendida.

---

La idea clave: **Prototype trata de crear objetos nuevos a partir de objetos existentes**. En TypeScript, esto suele expresarse con spread, funciones de copia, `structuredClone`, métodos `clone()` o datos base con overrides. Lo más importante no es la sintaxis, sino entender qué se comparte, qué se copia y qué invariantes deben protegerse.
