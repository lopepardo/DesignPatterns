## Patrón creacional 2: Abstract Factory

### Qué problema intenta resolver

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

Quizá técnicamente funciona, pero visualmente o **conceptualmente** es inconsistente.

Abstract Factory responde a esta pregunta:

> ¿Cómo creo varios objetos relacionados garantizando que pertenezcan a la misma familia?

---

### Qué idea propone como solución

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

- Factory Method suele crear **un tipo de producto**.
- Abstract Factory crea **varios productos relacionados**.

En términos de SOLID:

- Ayuda con **DIP**, porque el código cliente depende de abstracciones, no de implementaciones concretas.
- Puede ayudar con **OCP**, porque puedes agregar una nueva familia sin cambiar mucho el código cliente.

Pero también puede tensionar OCP en otra dirección: si agregas un nuevo tipo de producto a la familia, quizá tengas que modificar todas las fábricas existentes.

Por ejemplo, si agregas `createTooltip()`, todas las fábricas de tema tienen que implementarlo.

---

### Ejemplo de mal uso o mala interpretación

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

Si conceptualmente produce una **familia de objetos relacionados**, ya estás aplicando la idea.

---

### Cuándo conviene aplicarlo y cuándo puede ser innecesario

Conviene aplicarlo cuando tienes familias de objetos que deben ser compatibles entre sí. Casos típicos:

- Temas visuales: claro, oscuro, alto contraste.
- Componentes por plataforma: web, iOS, Android, desktop.
- Proveedores externos: Stripe, Mercado Pago, PayPal.
- Infraestructura por entorno: local, staging, producción.
- Drivers o adaptadores: MySQL, PostgreSQL, SQLite.
- Formatos de exportación: PDF, HTML, Markdown, CSV, si cada formato requiere varias piezas coordinadas.

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

- Solo estás creando un único objeto.
- No hay riesgo real de mezclar piezas incompatibles.
- La familia de productos cambia demasiado seguido y cada cambio obliga a modificar todas las fábricas.
- La abstracción hace más difícil leer el flujo.
- El sistema es pequeño y un objeto de configuración resolvería mejor el problema.

Por ejemplo, para temas visuales simples en frontend, quizá no necesitas Abstract Factory:

```ts id="m9g5u2"
const theme = {
  buttonClass: "bg-black text-white",
  modalClass: "bg-neutral-900",
};
```

En React, muchas veces un `ThemeProvider`, configuración, composición de componentes o props pueden ser más naturales que una Abstract Factory formal.

---

> [!IMPORTANT]
> **Abstract Factory no trata solo de crear objetos; trata de crear conjuntos coherentes de objetos relacionados**. En TypeScript, muchas veces se expresa mejor como un objeto de funciones creadoras que como una jerarquía pesada de clases.
