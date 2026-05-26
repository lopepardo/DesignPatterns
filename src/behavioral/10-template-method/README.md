# Patrón de comportamiento 10: Template Method

## Qué problema intenta resolver

Template Method intenta resolver el problema de tener varios procesos que comparten una misma estructura general, pero cambian algunos pasos específicos.

Por ejemplo, imagina un proceso para generar reportes:

```txt
1. obtener datos
2. transformar datos
3. renderizar reporte
4. exportar resultado
```

Distintos reportes pueden seguir la misma secuencia, pero cambiar detalles:

```txt
Reporte de ventas:
  obtiene ventas
  calcula totales
  exporta CSV

Reporte de inventario:
  obtiene productos
  calcula stock
  exporta PDF
```

Una solución ingenua sería duplicar toda la estructura:

```ts
function generateSalesReport() {
  const data = getSalesData();
  const transformed = transformSalesData(data);
  const output = renderSalesReport(transformed);
  return exportCsv(output);
}

function generateInventoryReport() {
  const data = getInventoryData();
  const transformed = transformInventoryData(data);
  const output = renderInventoryReport(transformed);
  return exportPdf(output);
}
```

Hay duplicación en la estructura del algoritmo.

Template Method responde a esta pregunta:

> ¿Cómo defino el esqueleto de un algoritmo una sola vez, permitiendo que algunos pasos sean personalizados?

---

## Qué idea propone como solución

La idea central es separar:

```txt
estructura fija del proceso
de
pasos variables del proceso
```

En la versión GoF clásica, una clase base define el método plantilla:

```ts
generate() {
  const data = this.fetchData();
  const transformed = this.transform(data);
  const output = this.render(transformed);
  return this.export(output);
}
```

Y las subclases implementan algunos pasos:

```ts
fetchData()
transform()
render()
export()
```

El método plantilla controla el orden. Las subclases no deciden la secuencia completa; solo completan partes específicas.

Con SOLID ayuda con:

- **OCP**, porque puedes crear nuevas variantes del algoritmo sin modificar el esqueleto base.
- **SRP**, porque el flujo común queda separado de los detalles específicos.

Pero hay una advertencia importante: Template Method se basa en **herencia**. En TypeScript, muchas veces una solución con composición, funciones y estrategias puede ser más flexible y más simple.

---

## Ejemplo de mal uso o mala interpretación

Un mal uso común es forzar herencia cuando la composición sería más clara.

```ts
abstract class BaseService {
  execute() {
    this.before();
    this.doWork();
    this.after();
  }

  protected abstract doWork(): void;

  protected before(): void {}
  protected after(): void {}
}
```

Si solo tienes una o dos variantes simples, quizá esto es más pesado que pasar una función:

```ts
function executeWithLogging(work: () => void) {
  console.log("Antes");
  work();
  console.log("Después");
}
```

Otro mal uso es crear una clase base demasiado grande:

```ts
abstract class BaseImporter {
  read() {}
  parse() {}
  validate() {}
  normalize() {}
  enrich() {}
  deduplicate() {}
  save() {}
  notify() {}
  audit() {}
  rollback() {}
}
```

Si muchas subclases solo usan algunos pasos y dejan otros vacíos, la abstracción probablemente está mal.

También puede violar LSP si las subclases rompen expectativas del algoritmo base.

Por ejemplo, si una subclase redefine un hook y evita validar datos críticos, el proceso completo puede quedar inconsistente.

---

## Cuándo conviene aplicarlo y cuándo puede ser innecesario o excesivo

Conviene aplicarlo cuando:

- Tienes varios algoritmos con la misma estructura general.
- Quieres evitar duplicar el orden de pasos.
- Algunos pasos cambian entre variantes.
- Quieres controlar la secuencia desde un lugar central.
- Hay invariantes del proceso que no deberían cambiar.

Casos típicos:

- Importadores de datos.
- Generadores de reportes.
- Procesadores de archivos.
- Pipelines de validación.
- Algoritmos de build/deploy.
- Flujos de scraping.
- Procesamiento de pagos con pasos comunes.
- Testing frameworks con setup, ejecución y teardown.

Por ejemplo:

```txt
setup → execute → cleanup
```

es un caso natural para Template Method.

---

Puede ser innecesario cuando:

- Solo hay una variante.
- La estructura común no es estable.
- Los pasos personalizados son demasiados.
- La herencia vuelve el diseño rígido.
- Una función de orden superior o composición de estrategias expresa mejor el flujo.
- El algoritmo no tiene invariantes importantes que proteger.

Por ejemplo:

```ts
const result = parseCsv(content);
```

no necesita Template Method si solo estás parseando CSV sin flujo común reutilizable.

---

> [!IMPORTANT]
> **Template Method define el esqueleto de un algoritmo y deja que algunos pasos varíen**. En su forma clásica usa herencia, pero en TypeScript muchas veces conviene expresarlo con funciones, objetos de configuración, composición o estrategias. Es útil cuando el flujo común es estable; puede ser excesivo cuando solo introduce una clase base rígida sin una necesidad real.
