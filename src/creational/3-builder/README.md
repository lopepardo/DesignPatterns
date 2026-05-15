## Patrón creacional 3: Builder

### Qué problema intenta resolver

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

> ¿Cómo construyo un objeto complejo de manera clara, controlada y flexible, sin llenar el constructor de parámetros ni exponer un objeto incompleto?

---

### Qué idea propone como solución

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

- Hacer más legible la construcción.
- Centralizar reglas de validación o ensamblaje antes de producir el objeto final.

La llamada importante suele ser:

```ts
.build()
```

Ese método representa el momento en que el objeto queda completo y listo para usarse.

Con SOLID, Builder puede ayudar con:

- **Single Responsibility Principle** separa la responsabilidad de construir un objeto de la responsabilidad de usarlo.
- **Open/Closed** permite agregar variantes de construcción sin llenar el código cliente de condicionales.

Pero cuidado: Builder también puede ser ruido si el objeto es simple.

---

### Ejemplo de mal uso o mala interpretación

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

### Cuándo conviene aplicarlo y cuándo puede ser innecesario

Conviene aplicarlo cuando:

- El objeto tiene muchos parámetros opcionales.
- La construcción necesita varios pasos.
- Hay reglas de validación antes de crear el objeto final.
- Quieres una API fluida y legible.
- Quieres evitar constructores enormes.
- El objeto final debería ser inmutable, pero necesitas una fase flexible de construcción.

Ejemplos razonables:

- Construcción de queries SQL.
- Configuración de clientes HTTP.
- Creación de reportes complejos.
- Construcción de formularios dinámicos.
- Configuración de pipelines.
- Creación de objetos de prueba en tests.

Por ejemplo, en tests:

```ts
const user = createUserBuilder().withRole("admin").withVerifiedEmail().build();
```

Eso puede ser muy útil porque los datos de prueba suelen tener muchas variantes.

---

Puede ser innecesario cuando:

- El objeto tiene pocos campos. TypeScript puede expresar la construcción claramente con un objeto literal.
- No hay reglas de construcción importantes.
- El builder solo replica setters.
- El patrón agrega más código que claridad.

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

> [!IMPORTANT]
> **Builder no es simplemente encadenar métodos; es separar y ordenar la construcción de un objeto complejo antes de producir un resultado final válido**. En TypeScript, muchas veces un objeto de configuración es suficiente. El Builder se justifica cuando la construcción tiene suficiente complejidad como para merecer una API propia.
