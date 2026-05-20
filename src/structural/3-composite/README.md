# Patrón estructural 3: Composite

## Qué problema intenta resolver

Composite intenta resolver el problema de trabajar de forma uniforme con objetos individuales y grupos de objetos.

El caso típico aparece cuando tienes una estructura jerárquica o en árbol.

Por ejemplo, imagina un sistema de archivos:

```txt
carpeta/
  archivo-a.txt
  archivo-b.txt
  subcarpeta/
    archivo-c.txt
```

Un archivo es una unidad individual.
Una carpeta contiene archivos y otras carpetas.

Pero muchas operaciones son conceptualmente similares:

```ts
getSize()
rename()
moveTo()
print()
delete()
```

Sería incómodo que el código cliente tuviera que preguntar constantemente:

```ts
if (item is File) {
  // tratar como archivo
}

if (item is Folder) {
  // recorrer hijos
}
```

Composite responde a esta pregunta:

> ¿Cómo puedo tratar objetos individuales y composiciones de objetos de manera uniforme?

---

## Qué idea propone como solución

La idea central es definir una interfaz común para dos tipos de elementos:

1. **Leaf**, la hoja o elemento individual.
2. **Composite**, el contenedor que agrupa otros elementos.

**Ambos implementan la misma interfaz.**

Por ejemplo:

```ts
type FileSystemItem = {
  getSize(): number;
};
```

Un archivo implementa `getSize()` devolviendo su propio tamaño.

Una carpeta implementa `getSize()` sumando el tamaño de sus hijos.

Desde fuera, el cliente puede hacer esto:

```ts
item.getSize();
```

sin saber si `item` es un archivo o una carpeta.

La estructura conceptual es:

```txt
Component
├── Leaf
└── Composite
    ├── Leaf
    ├── Leaf
    └── Composite
        └── Leaf
```

Con SOLID:

- **OCP**, porque puedes agregar nuevos tipos de componentes sin cambiar el código que los usa, siempre que respeten la interfaz común.

- **LSP**, porque un composite debería poder usarse donde se espera un componente. Si una carpeta y un archivo implementan la misma interfaz, el cliente no debería romperse al recibir cualquiera de los dos.

Pero hay que tener cuidado: no siempre es correcto forzar que hojas y contenedores tengan exactamente las mismas operaciones.

---

## Ejemplo de mal uso o mala interpretación

Un mal uso frecuente es forzar una interfaz común que no tiene sentido para todos los elementos.

Por ejemplo:

```ts
interface FileSystemItem {
  getSize(): number;
  add(item: FileSystemItem): void;
  remove(item: FileSystemItem): void;
}
```

Esto obliga a que un archivo implemente `add` y `remove`, aunque un archivo no puede contener hijos.

Entonces terminas con algo así:

```ts
class File implements FileSystemItem {
  add(item: FileSystemItem): void {
    throw new Error("Un archivo no puede contener elementos");
  }

  remove(item: FileSystemItem): void {
    throw new Error("Un archivo no puede contener elementos");
  }

  getSize(): number {
    return 10;
  }
}
```

Esto es problemático desde LSP: si el cliente espera un `FileSystemItem`, podría llamar `add`, pero algunos objetos fallan en runtime.

Hay dos formas de manejarlo.

Una opción es separar interfaces:

```ts
type FileSystemItem = {
  getSize(): number;
};

type ContainerItem = FileSystemItem & {
  add(item: FileSystemItem): void;
  remove(item: FileSystemItem): void;
};
```

Así no obligas a las hojas a implementar operaciones que no tienen sentido.

Otra opción es aceptar una interfaz común amplia, pero solo cuando el dominio realmente lo justifica. En TypeScript, suele ser preferible ser explícito y no fingir que todos pueden hacer lo mismo.

---

Otro mal uso es usar Composite para estructuras que no son realmente jerárquicas.

Por ejemplo, una lista plana de usuarios:

```ts
const users = [{ name: "Ana" }, { name: "Luis" }];
```

No necesitas Composite ahí. Basta con un array.

Composite se justifica cuando hay anidamiento, recursión o relación parte-todo.

---

## Cuándo conviene aplicarlo y cuándo puede ser innecesario o excesivo

Conviene aplicarlo cuando tienes estructuras tipo árbol o jerarquías parte-todo.

Casos típicos:

- Sistemas de archivos.
- Menús anidados.
- Componentes UI.
- Árboles de categorías.
- Organigramas.
- Expresiones matemáticas.
- Documentos con secciones, subsecciones y párrafos.
- Escenas gráficas en videojuegos o editores visuales.
- Reglas de negocio compuestas.

Por ejemplo, una regla puede ser simple:

```ts
const isAdult = user.age >= 18;
```

O compuesta:

```ts
AND(isAdult, hasVerifiedEmail, OR(isAdmin, hasSubscription));
```

Esto también puede modelarse como Composite.

---

Puede ser innecesario cuando:

- La estructura es plana.
- No necesitas tratar grupos e individuos de manera uniforme.
- No hay recursión.
- La interfaz común obliga a métodos inválidos para algunos elementos.
- Una simple colección basta.

Por ejemplo:

```ts
const products = [productA, productB, productC];
```

Eso no necesita Composite a menos que los productos puedan contener subproductos, bundles, categorías anidadas o estructuras recursivas.

---

> [!IMPORTANT]
> **Composite sirve para modelar estructuras jerárquicas donde las partes individuales y los grupos pueden usarse de manera uniforme**. En TypeScript, puede implementarse con clases e interfaces, pero también de forma muy natural con tipos discriminados, objetos y funciones recursivas.
