# Patrón de comportamiento 5: Mediator

## Qué problema intenta resolver

Mediator intenta resolver el problema de comunicación desordenada entre muchos objetos, módulos o componentes que necesitan coordinarse entre sí.

Imagina una interfaz con varios elementos:

```txt
input de búsqueda
lista de resultados
botón de limpiar
filtros
contador de resultados
paginación
```

Una solución directa sería que cada componente conozca a los demás:

```ts
searchInput.onChange(() => {
  resultsList.update();
  clearButton.enable();
  resultCounter.update();
  pagination.reset();
});

filters.onChange(() => {
  resultsList.update();
  resultCounter.update();
  pagination.reset();
});

clearButton.onClick(() => {
  searchInput.clear();
  filters.clear();
  resultsList.update();
  resultCounter.update();
});
```

Esto puede crecer mal porque todos empiezan a depender de todos.

El problema no es que los objetos colaboren. El problema es que la colaboración se vuelve una red difícil de entender:

```txt
A habla con B, C y D
B habla con A y C
C habla con A, B y D
D habla con todos
```

Mediator responde a esta pregunta:

> ¿Cómo coordino la comunicación entre varios objetos sin que todos tengan que conocerse directamente entre sí?

---

## Qué idea propone como solución

La idea central es introducir un objeto o módulo intermediario que coordina las interacciones.

En vez de esto:

```txt
Componente A → Componente B
Componente A → Componente C
Componente B → Componente C
Componente C → Componente A
```

tienes esto:

```txt
Componente A → Mediator
Componente B → Mediator
Componente C → Mediator
Mediator → coordina qué debe pasar
```

Los componentes ya no necesitan conocer a todos los demás. Solo notifican eventos o acciones al mediador.

Por ejemplo:

```ts
mediator.notify("searchChanged", query);
```

Y el mediador decide:

```txt
actualizar resultados
reiniciar paginación
activar botón limpiar
actualizar contador
```

Con SOLID ayuda con:

- **SRP** si separa la lógica de coordinación de los componentes individuales.
- **DIP** porque los componentes dependen de una abstracción de comunicación, no de otros componentes concretos.
- **OCP** si agregar nuevos componentes o eventos no obliga a modificar todos los componentes existentes.

Pero tiene un riesgo claro: el mediador puede convertirse en un objeto gigante que concentra demasiada lógica.

---

## Ejemplo de mal uso o mala interpretación

Un mal uso común es crear un mediador que se convierte en “Dios del sistema”.

```ts
class AppMediator {
  login() {}
  logout() {}
  createOrder() {}
  refundPayment() {}
  updateInventory() {}
  renderDashboard() {}
  sendEmail() {}
  generateReport() {}
}
```

Esto concentra demasiadas responsabilidades. En vez de reducir acoplamiento, crea un centro enorme y difícil de mantener.

Mejor tener mediadores específicos:

```txt
LoginMediator
CheckoutMediator
SearchPageMediator
ChatRoom
```

Otro mal uso es usar Mediator cuando una relación directa es más clara.

Si un botón solo necesita llamar a una función:

```ts
button.onClick(saveDocument);
```

no necesitas necesariamente:

```ts
button.onClick(() => mediator.notify("saveButtonClicked"));
```

Mediador tiene sentido cuando hay coordinación real entre varias piezas, no cuando solo quieres evitar una llamada directa simple.

Otro problema aparece cuando el mediador contiene demasiadas reglas de negocio que deberían vivir en el dominio.

Por ejemplo:

```ts
checkoutMediator.calculateTaxes();
checkoutMediator.validateInventory();
checkoutMediator.applyFraudRules();
```

Puede ser correcto en una capa de aplicación, pero si esas reglas son centrales al negocio, quizás deberían estar en servicios o entidades del dominio, no mezcladas con coordinación de UI.

---

## Cuándo conviene aplicarlo y cuándo puede ser innecesario o excesivo

Conviene aplicarlo cuando:

- Hay varios componentes que necesitan coordinarse.
- Las dependencias entre ellos empiezan a formar una red compleja.
- Quieres evitar que cada componente conozca a todos los demás.
- La lógica de interacción pertenece a un flujo común.
- Quieres centralizar coordinación sin meterla en cada componente individual.

Casos típicos:

- Formularios complejos.
- Pantallas con muchos componentes relacionados.
- Salas de chat.
- Workflows de checkout.
- Coordinación entre módulos de UI.
- Sistemas de eventos controlados.
- Componentes de escritorio, como diálogos con muchos controles.

Por ejemplo:

```txt
Cambiar el país afecta ciudades disponibles, costo de envío, moneda, impuestos y métodos de pago.
```

Ahí un mediador puede ser útil.

---

Puede ser innecesario cuando:

- Solo hay dos objetos con una relación simple.
- Una llamada directa es clara y suficiente.
- El mediador solo reenvía llamadas sin aportar coordinación.
- El flujo se vuelve más difícil de seguir por centralizar demasiado.
- El mediador empieza a absorber responsabilidades de dominio, infraestructura y UI al mismo tiempo.

Por ejemplo:

```ts
userRepository.save(user);
```

No necesita un mediador si no hay múltiples participantes coordinándose.

---

> [!IMPORTANT]
> **Mediator centraliza la coordinación entre varios objetos o componentes para evitar una red de dependencias directas entre ellos**. En TypeScript puede ser una clase, una función, un módulo, un store, un controlador o un componente padre. Conviene cuando hay interacción compleja real; puede ser excesivo cuando solo reemplaza llamadas directas simples.
