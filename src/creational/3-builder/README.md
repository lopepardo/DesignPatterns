## Patrón creacional 3: Builder

### 1. Qué problema intenta resolver

Builder intenta resolver el problema de construir objetos complejos paso a paso, especialmente cuando hay muchas opciones, variantes o reglas de construcción.

El problema suele aparecer cuando un constructor o una función empieza a recibir demasiados parámetros:

```ts
const report = new Report(
  "Ventas Q1",
  true,
  false,
  "pdf",
  "es",
  ["summary", "charts"],
  "admin",
  true,
);
```

Este código es difícil de leer. ¿Qué significa `true`? ¿Qué significa `false`? ¿En qué orden van los argumentos?

También aparece cuando un objeto necesita construirse en etapas:

```ts
const report = new Report();
report.setTitle("Ventas Q1");
report.enableCharts();
report.setFormat("pdf");
report.setLanguage("es");
report.validate();
```

Eso puede ser flexible, pero también puede dejar el objeto en estados inválidos si alguien olvida un paso importante.

Builder responde a esta pregunta:

“¿Cómo construyo un objeto complejo de manera clara, controlada y flexible, sin llenar el constructor de parámetros ni exponer un objeto incompleto?”

---

### 2. Qué idea propone como solución

La idea central es separar el proceso de construcción del objeto final.

En vez de construir el objeto completo de una sola vez con un constructor enorme, usas un builder que va recolectando las decisiones de construcción:

```ts
const report = new ReportBuilder()
  .withTitle("Ventas Q1")
  .withCharts()
  .asPdf()
  .inSpanish()
  .build();
```

El objeto `ReportBuilder` no necesariamente es el producto final. Es una herramienta temporal para armarlo.

Builder suele tener dos objetivos:

Hacer más legible la construcción.

Centralizar reglas de validación o ensamblaje antes de producir el objeto final.

La llamada importante suele ser:

```ts
.build()
```

Ese método representa el momento en que el objeto queda completo y listo para usarse.

Con SOLID, Builder puede ayudar al **Single Responsibility Principle** porque separa la responsabilidad de construir un objeto de la responsabilidad de usarlo. También puede apoyar **Open/Closed** si permite agregar variantes de construcción sin llenar el código cliente de condicionales.

Pero cuidado: Builder también puede ser ruido si el objeto es simple.

---

### 3. Cómo se ve aplicado en TypeScript y otros lenguajes

#### Versión simple en TypeScript con objeto de configuración

Antes de crear un Builder formal, en TypeScript muchas veces basta con usar un objeto de opciones.

```ts
type ReportFormat = "pdf" | "html";

type ReportOptions = {
  title: string;
  format: ReportFormat;
  includeCharts?: boolean;
  includeSummary?: boolean;
  language?: "es" | "en";
};

function createReport(options: ReportOptions) {
  return {
    title: options.title,
    format: options.format,
    includeCharts: options.includeCharts ?? false,
    includeSummary: options.includeSummary ?? true,
    language: options.language ?? "es",
  };
}

const report = createReport({
  title: "Ventas Q1",
  format: "pdf",
  includeCharts: true,
});
```

Esto ya resuelve muchos problemas del constructor con demasiados argumentos.

En TypeScript, esta forma suele ser preferible cuando:

El objeto no tiene demasiadas etapas.

La validación es simple.

No necesitas encadenamiento.

No hay un proceso de construcción complejo.

---

#### Builder con clase en TypeScript

Ahora veamos una versión más formal.

```ts
type ReportFormat = "pdf" | "html";
type Language = "es" | "en";

type Report = {
  title: string;
  format: ReportFormat;
  language: Language;
  includeCharts: boolean;
  includeSummary: boolean;
};

class ReportBuilder {
  private title?: string;
  private format: ReportFormat = "pdf";
  private language: Language = "es";
  private includeCharts = false;
  private includeSummary = true;

  withTitle(title: string): this {
    this.title = title;
    return this;
  }

  asPdf(): this {
    this.format = "pdf";
    return this;
  }

  asHtml(): this {
    this.format = "html";
    return this;
  }

  inSpanish(): this {
    this.language = "es";
    return this;
  }

  inEnglish(): this {
    this.language = "en";
    return this;
  }

  withCharts(): this {
    this.includeCharts = true;
    return this;
  }

  withoutSummary(): this {
    this.includeSummary = false;
    return this;
  }

  build(): Report {
    if (!this.title) {
      throw new Error("El reporte necesita un título");
    }

    return {
      title: this.title,
      format: this.format,
      language: this.language,
      includeCharts: this.includeCharts,
      includeSummary: this.includeSummary,
    };
  }
}

const report = new ReportBuilder()
  .withTitle("Ventas Q1")
  .withCharts()
  .asPdf()
  .inSpanish()
  .build();
```

Esta versión mejora la legibilidad cuando hay muchas combinaciones posibles.

También permite centralizar reglas:

```ts
build(): Report {
  if (!this.title) {
    throw new Error("El reporte necesita un título");
  }

  if (this.format === "html" && this.includeCharts) {
    // validar si se permite o no
  }

  return { ... };
}
```

---

#### Builder funcional en TypeScript

No necesitas una clase para tener un Builder. Puedes usar closures:

```ts
type ReportFormat = "pdf" | "html";
type Language = "es" | "en";

type Report = {
  title: string;
  format: ReportFormat;
  language: Language;
  includeCharts: boolean;
};

function reportBuilder() {
  const state: Partial<Report> = {
    format: "pdf",
    language: "es",
    includeCharts: false,
  };

  return {
    withTitle(title: string) {
      state.title = title;
      return this;
    },

    asHtml() {
      state.format = "html";
      return this;
    },

    withCharts() {
      state.includeCharts = true;
      return this;
    },

    build(): Report {
      if (!state.title) {
        throw new Error("El reporte necesita un título");
      }

      return {
        title: state.title,
        format: state.format ?? "pdf",
        language: state.language ?? "es",
        includeCharts: state.includeCharts ?? false,
      };
    },
  };
}

const report = reportBuilder()
  .withTitle("Ventas Q1")
  .withCharts()
  .asHtml()
  .build();
```

Esto expresa la misma idea sin clases.

Aunque tiene un detalle importante: usar `this` en objetos literales puede volverse frágil si extraes métodos. En TypeScript real, para builders funcionales complejos, puede convenir devolver nuevas versiones del builder o usar funciones puras.

---

#### Builder inmutable en TypeScript

Una versión más funcional evita mutar estado interno:

```ts
type ReportFormat = "pdf" | "html";

type Report = {
  title: string;
  format: ReportFormat;
  includeCharts: boolean;
};

type ReportDraft = Partial<Report>;

function createReportBuilder(draft: ReportDraft = {}) {
  return {
    withTitle(title: string) {
      return createReportBuilder({ ...draft, title });
    },

    asPdf() {
      return createReportBuilder({ ...draft, format: "pdf" });
    },

    asHtml() {
      return createReportBuilder({ ...draft, format: "html" });
    },

    withCharts() {
      return createReportBuilder({ ...draft, includeCharts: true });
    },

    build(): Report {
      if (!draft.title) {
        throw new Error("Falta el título");
      }

      return {
        title: draft.title,
        format: draft.format ?? "pdf",
        includeCharts: draft.includeCharts ?? false,
      };
    },
  };
}

const report = createReportBuilder()
  .withTitle("Ventas Q1")
  .asPdf()
  .withCharts()
  .build();
```

Esta versión evita efectos secundarios, pero crea más objetos intermedios. En la mayoría de apps eso no importa, pero conviene saberlo.

---

#### Comparación con Java

En Java, Builder es muy común porque los constructores con muchos parámetros son incómodos y el lenguaje no tiene objetos literales como TypeScript.

```java
class Report {
    private final String title;
    private final String format;
    private final boolean includeCharts;

    private Report(Builder builder) {
        this.title = builder.title;
        this.format = builder.format;
        this.includeCharts = builder.includeCharts;
    }

    static class Builder {
        private String title;
        private String format = "pdf";
        private boolean includeCharts = false;

        Builder withTitle(String title) {
            this.title = title;
            return this;
        }

        Builder asHtml() {
            this.format = "html";
            return this;
        }

        Builder withCharts() {
            this.includeCharts = true;
            return this;
        }

        Report build() {
            if (title == null) {
                throw new IllegalStateException("Falta el título");
            }

            return new Report(this);
        }
    }
}
```

Uso:

```java
Report report = new Report.Builder()
    .withTitle("Ventas Q1")
    .asHtml()
    .withCharts()
    .build();
```

En Java, el patrón Builder suele ser más justificable que en TypeScript porque el lenguaje no ofrece la misma ergonomía con objetos de opciones.

---

#### Comparación con Python

En Python muchas veces se usa una función con parámetros nombrados:

```python
def create_report(title, format="pdf", include_charts=False):
    return {
        "title": title,
        "format": format,
        "include_charts": include_charts,
    }

report = create_report(
    title="Ventas Q1",
    format="html",
    include_charts=True
)
```

Eso ya resuelve el problema de legibilidad. Por eso un Builder formal en Python puede ser excesivo salvo que la construcción sea realmente compleja.

---

### 4. Ejemplo de mal uso o mala interpretación

Un mal uso muy común es crear un Builder para objetos simples:

```ts
type User = {
  name: string;
  email: string;
};

class UserBuilder {
  private name?: string;
  private email?: string;

  withName(name: string): this {
    this.name = name;
    return this;
  }

  withEmail(email: string): this {
    this.email = email;
    return this;
  }

  build(): User {
    if (!this.name || !this.email) {
      throw new Error("Faltan datos");
    }

    return {
      name: this.name,
      email: this.email,
    };
  }
}

const user = new UserBuilder()
  .withName("Ana")
  .withEmail("ana@example.com")
  .build();
```

Esto probablemente es más complejo que:

```ts
const user: User = {
  name: "Ana",
  email: "ana@example.com",
};
```

Otro mal uso es usar Builder para permitir objetos inválidos durante demasiado tiempo.

```ts
const builder = new ReportBuilder();

builder.withCharts();

// Mucho tiempo después...
const report = builder.build();
```

Si el builder se pasa por muchas partes del sistema y va mutando, puede volverse difícil razonar sobre el estado.

También es mala señal si `build()` tiene demasiada lógica de negocio. El builder debe encargarse de construcción, no convertirse en el lugar donde vive toda la lógica del dominio.

---

### 5. Cuándo conviene aplicarlo y cuándo puede ser innecesario

Conviene aplicarlo cuando:

El objeto tiene muchos parámetros opcionales.

La construcción necesita varios pasos.

Hay reglas de validación antes de crear el objeto final.

Quieres una API fluida y legible.

Quieres evitar constructores enormes.

El objeto final debería ser inmutable, pero necesitas una fase flexible de construcción.

Ejemplos razonables:

Construcción de queries SQL.

Configuración de clientes HTTP.

Creación de reportes complejos.

Construcción de formularios dinámicos.

Configuración de pipelines.

Creación de objetos de prueba en tests.

Por ejemplo, en tests:

```ts
const user = createUserBuilder().withRole("admin").withVerifiedEmail().build();
```

Eso puede ser muy útil porque los datos de prueba suelen tener muchas variantes.

---

Puede ser innecesario cuando:

El objeto tiene pocos campos.

TypeScript puede expresar la construcción claramente con un objeto literal.

No hay reglas de construcción importantes.

El builder solo replica setters.

El patrón agrega más código que claridad.

Por ejemplo:

```ts
createProduct({
  name: "Camiseta",
  price: 50000,
});
```

es probablemente mejor que:

```ts
new ProductBuilder().withName("Camiseta").withPrice(50000).build();
```

---

### 6. Analogía sencilla

Imagina que vas a armar una hamburguesa personalizada.

No quieres decir todos los detalles en una sola frase larguísima:

“Dame una hamburguesa con pan integral, sin cebolla, con queso, doble carne, salsa especial, pepinillos, sin tomate, término medio…”

Es más claro construirla paso a paso:

Elige el pan.

Agrega la carne.

Agrega queso.

Quita cebolla.

Agrega salsa.

Confirma el pedido.

El Builder es esa ficha de pedido que se va completando paso a paso. La hamburguesa final no existe hasta que confirmas.

En código, ese momento es:

```ts
.build()
```

---

La idea clave: **Builder no es simplemente encadenar métodos; es separar y ordenar la construcción de un objeto complejo antes de producir un resultado final válido**. En TypeScript, muchas veces un objeto de configuración es suficiente. El Builder se justifica cuando la construcción tiene suficiente complejidad como para merecer una API propia.
