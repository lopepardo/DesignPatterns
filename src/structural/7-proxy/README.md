# Patrón estructural 7: Proxy

## Qué problema intenta resolver

Proxy intenta resolver el problema de controlar el acceso a un objeto, recurso o servicio sin cambiar la interfaz con la que el cliente interactúa.

Imagina que tienes un servicio pesado:

```ts id="f3ufh8"
const image = new HighResolutionImage("photo.png");
image.display();
```

Crear esa imagen puede ser costoso. Quizá carga un archivo enorme, consulta red o reserva memoria. Pero tal vez el usuario nunca la visualiza.

Proxy responde a esta pregunta:

> ¿Cómo puedo poner un intermediario delante de un objeto para controlar cuándo y cómo se accede a él, manteniendo la misma interfaz?

El cliente cree que habla con el objeto real, pero en realidad habla con un representante.

---

## Qué idea propone como solución

La idea central es crear un objeto que tenga la misma interfaz que el objeto real, pero que controle el acceso a este.

Estructura conceptual:

```txt id="q2tncp"
Cliente → Proxy → Objeto real
```

El proxy puede hacer varias cosas:

- crear el objeto real solo cuando se necesita;
- verificar permisos;
- guardar en caché;
- controlar acceso remoto;
- registrar llamadas;
- limitar frecuencia;
- validar entrada;
- ocultar detalles de red o infraestructura.

La clave es que el cliente no cambia demasiado:

```ts id="bcyv12"
image.display();
```

Da igual si `image` es el objeto real o un proxy.

Con SOLID, Proxy puede ayudar con:

- **SRP**, porque separa la lógica de acceso de la lógica principal del objeto real.
- **OCP**, porque agregas control de acceso sin modificar el objeto real.
- **DIP**, si el cliente depende de una interfaz común.

Pero igual que Decorator, demasiadas capas pueden volver difícil entender qué está pasando.

---

## Ejemplo de mal uso o mala interpretación

Un mal uso común es usar Proxy para esconder efectos secundarios importantes.

```ts id="b9f31o"
const user = userProxy.name;
```

Si esa lectura aparentemente simple dispara una llamada HTTP, modifica estado global o lanza errores inesperados, el código puede volverse difícil de razonar.

Eso no significa que los proxies remotos estén mal, pero conviene hacer explícitos los límites cuando importan.

Otro mal uso es agregar proxies en capas excesivas:

```txt id="7s1msy"
Client → AuthProxy → CacheProxy → LoggingProxy → RetryProxy → RemoteProxy → Service
```

Puede ser válido, pero también puede complicar depuración, tracing y manejo de errores.

Otro error es usar `Proxy` nativo de JavaScript para tareas simples donde una función normal sería más clara.

```ts id="77mdgl"
const proxy = new Proxy(config, {
  get(target, property) {
    return target[property];
  },
});
```

Si no estás interceptando algo significativo, probablemente sobra.

También es peligroso que el proxy cambie el contrato esperado.

```ts id="0b8hps"
const cachedService = createCachedExchangeRateProxy(service);
```

Si el servicio real siempre devuelve datos actualizados, pero el proxy devuelve datos viejos sin que el cliente lo sepa, puede haber bugs. El caché debe estar alineado con las expectativas del dominio.

---

## Cuándo conviene aplicarlo y cuándo puede ser innecesario o excesivo

Conviene aplicarlo cuando necesitas controlar acceso sin cambiar la interfaz.

Casos típicos:

- Lazy loading.
- Permisos y protección.
- Caching.
- Rate limiting.
- Acceso remoto.
- Inicialización costosa.
- Objetos pesados.
- Auditoría de acceso.
- Transacciones.
- Reactividad o tracking de cambios.

Por ejemplo:

```ts id="dtob1c"
const service = createRateLimitedProxy(realService);
```

puede tener sentido si quieres proteger una API externa.

---

Puede ser innecesario cuando:

- El objeto real es simple y barato.
- No necesitas controlar acceso.
- El proxy oculta efectos secundarios importantes.
- La interfaz se vuelve engañosa.
- Una función explícita sería más clara.

Por ejemplo, si quieres cargar datos remotos, esto puede ser más transparente:

```ts id="rzadwz"
await fetchUser(id);
```

que hacer parecer que es una simple propiedad:

```ts id="eyii3b"
user.name;
```

cuando en realidad puede disparar una operación remota.

---

> [!IMPORTANT]
> **Proxy conserva la interfaz del objeto real, pero controla el acceso a él**. En TypeScript puede implementarse con clases, funciones que envuelven objetos, closures o el `Proxy` nativo de JavaScript. La pregunta importante no es “¿puedo envolver esto?”, sino “¿necesito controlar el acceso de una forma que justifique esta capa?”.
