# Patrón de comportamiento 1: Chain of Responsibility

## Qué problema intenta resolver

Chain of Responsibility intenta resolver el problema de procesar una solicitud a través de una serie de posibles manejadores, sin que el emisor tenga que saber cuál de ellos la resolverá.

Imagina una solicitud HTTP que debe pasar por varias etapas:

```txt id="ykfckb"
validar autenticación
validar permisos
validar body
aplicar rate limit
ejecutar handler final
```

Una opción ingenua sería meter todo en una función enorme:

```ts id="1kk35r"
async function handleRequest(request: Request) {
  if (!isAuthenticated(request)) {
    return new Response("No autenticado", { status: 401 });
  }

  if (!hasPermission(request)) {
    return new Response("No autorizado", { status: 403 });
  }

  if (!isValidBody(request)) {
    return new Response("Body inválido", { status: 400 });
  }

  return createOrder(request);
}
```

Esto puede funcionar, pero conforme crecen las reglas, el flujo se vuelve rígido y difícil de reordenar, reutilizar o extender.

Chain of Responsibility responde a esta pregunta:

> ¿Cómo permito que una solicitud pase por una cadena de manejadores, donde cada uno decide si la procesa, la rechaza o la pasa al siguiente?

---

## Qué idea propone como solución

La idea central es conectar varios handlers en una cadena.

Cada handler tiene una responsabilidad limitada. Puede:

1. Procesar la solicitud y terminar la cadena.
2. Rechazar la solicitud.
3. Modificar o enriquecer la solicitud y pasarla al siguiente handler.
4. Simplemente pasarla al siguiente.

Conceptualmente:

```txt id="29a6gb"
Request → Handler A → Handler B → Handler C → Resultado
```

El emisor no sabe qué handler responderá. Solo entrega la solicitud al inicio de la cadena.

Esto conecta con SOLID:

- **SRP**: cada handler tiene una responsabilidad específica.
- **OCP**: puedes agregar, quitar o reordenar handlers sin reescribir toda la lógica.
- **DIP**: el cliente puede depender de una abstracción de handler, no de implementaciones concretas.

Pero también hay riesgos: si la cadena es demasiado implícita, puede ser difícil saber qué manejador resolvió o bloqueó la solicitud.

---

## Ejemplo de mal uso o mala interpretación

Un mal uso común es crear una cadena cuando un `switch` simple sería más claro.

```ts id="3fc39s"
function handle(request: SupportRequest) {
  switch (request.type) {
    case "billing":
      return handleBilling(request);
    case "technical":
      return handleTechnical(request);
    case "general":
      return handleGeneral(request);
  }
}
```

Si la lógica es simple y cerrada, esto puede ser perfectamente correcto.

No necesitas una cadena de clases solo para evitar un `switch`.

Otro mal uso es hacer una cadena donde el orden es crítico pero no está claro.

```ts id="tp33kp"
const chain = [normalizeInput, validateSignature, parseBody, checkPermissions];
```

Si `validateSignature` depende del body crudo, pero `normalizeInput` lo modifica antes, puedes introducir errores difíciles de detectar.

En cadenas, el orden debe ser explícito y estar bien documentado.

Otro problema aparece cuando nadie sabe qué handler respondió. Si eso importa para debugging, conviene agregar trazabilidad:

```ts id="bjtksr"
console.log("Ejecutando handler:", handler.name);
```

o usar nombres explícitos en la configuración.

---

## Cuándo conviene aplicarlo y cuándo puede ser innecesario o excesivo

Conviene aplicarlo cuando:

- Una solicitud puede ser procesada por distintos manejadores.
- Quieres desacoplar el emisor del receptor.
- Quieres poder reordenar, agregar o quitar pasos.
- Cada paso tiene una responsabilidad clara.
- El flujo puede detenerse antes de llegar al final.

Casos típicos:

- Middlewares HTTP.
- Validaciones.
- Autorización.
- Procesamiento de eventos.
- Manejo de soporte o tickets.
- Pipelines de importación.
- Filtros.
- Reglas de negocio encadenadas.

Por ejemplo:

```ts id="272z3q"
request → parseJson → authenticate → authorize → validate → execute
```

es un caso natural.

---

Puede ser innecesario cuando:

- Hay un único manejador.
- La selección es simple y un `switch` es más legible.
- El orden de la cadena es confuso.
- Los handlers están demasiado acoplados entre sí.
- La cadena oculta demasiado el flujo.
- El patrón obliga a partir una lógica que conceptualmente es una sola operación.

Por ejemplo, si tienes tres validaciones simples dentro de una función pequeña, no necesitas necesariamente tres handlers separados.

---

> [!IMPORTANT]
> **Chain of Responsibility permite procesar una solicitud mediante una secuencia de handlers desacoplados, donde cada uno puede manejar, detener o pasar la solicitud al siguiente**. En TypeScript, suele expresarse muy bien con funciones, middlewares, pipelines y composición, no necesariamente con clases enlazadas.
