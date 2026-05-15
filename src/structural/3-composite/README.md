# Patrón estructural 3: Composite

## 1. Qué problema intenta resolver

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

**“¿Cómo puedo tratar objetos individuales y composiciones de objetos de manera uniforme?”**

---

## 2. Qué idea propone como solución

La idea central es definir una interfaz común para dos tipos de elementos:

1. **Leaf**, la hoja o elemento individual.
2. **Composite**, el contenedor que agrupa otros elementos.

Ambos implementan la misma interfaz.

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

Composite puede ayudar con **OCP**, porque puedes agregar nuevos tipos de componentes sin cambiar el código que los usa, siempre que respeten la interfaz común.

También se relaciona con **LSP**, porque un composite debería poder usarse donde se espera un componente. Si una carpeta y un archivo implementan la misma interfaz, el cliente no debería romperse al recibir cualquiera de los dos.

Pero hay que tener cuidado: no siempre es correcto forzar que hojas y contenedores tengan exactamente las mismas operaciones.

---

## 3. Cómo se ve aplicado en TypeScript y otros lenguajes

### Ejemplo clásico en TypeScript: sistema de archivos

Primero definimos una interfaz común:

```ts
type FileSystemItem = {
  getName(): string;
  getSize(): number;
  print(indent?: number): void;
};
```

Ahora una hoja: `File`.

```ts
class File implements FileSystemItem {
  constructor(
    private name: string,
    private size: number,
  ) {}

  getName(): string {
    return this.name;
  }

  getSize(): number {
    return this.size;
  }

  print(indent = 0): void {
    console.log(`${" ".repeat(indent)}- ${this.name} (${this.size} KB)`);
  }
}
```

Y ahora el composite: `Folder`.

```ts
class Folder implements FileSystemItem {
  private children: FileSystemItem[] = [];

  constructor(private name: string) {}

  add(item: FileSystemItem): void {
    this.children.push(item);
  }

  getName(): string {
    return this.name;
  }

  getSize(): number {
    return this.children.reduce((total, child) => total + child.getSize(), 0);
  }

  print(indent = 0): void {
    console.log(`${" ".repeat(indent)}+ ${this.name}/`);

    for (const child of this.children) {
      child.print(indent + 2);
    }
  }
}
```

Uso:

```ts
const root = new Folder("root");

root.add(new File("a.txt", 10));
root.add(new File("b.txt", 20));

const images = new Folder("images");
images.add(new File("photo.png", 500));
images.add(new File("logo.svg", 30));

root.add(images);

root.print();
console.log(root.getSize()); // 560
```

El cliente puede llamar:

```ts
root.getSize();
root.print();
```

sin preocuparse de si dentro hay archivos, carpetas o más subcarpetas.

---

### Versión más idiomática en TypeScript con objetos

No siempre necesitas clases. Puedes representar Composite con tipos discriminados.

```ts
type FileNode = {
  kind: "file";
  name: string;
  size: number;
};

type FolderNode = {
  kind: "folder";
  name: string;
  children: FileSystemNode[];
};

type FileSystemNode = FileNode | FolderNode;
```

Ahora puedes escribir funciones que operan sobre ambos:

```ts
function getSize(node: FileSystemNode): number {
  if (node.kind === "file") {
    return node.size;
  }

  return node.children.reduce((total, child) => total + getSize(child), 0);
}
```

Y para imprimir:

```ts
function printNode(node: FileSystemNode, indent = 0): void {
  if (node.kind === "file") {
    console.log(`${" ".repeat(indent)}- ${node.name} (${node.size} KB)`);
    return;
  }

  console.log(`${" ".repeat(indent)}+ ${node.name}/`);

  for (const child of node.children) {
    printNode(child, indent + 2);
  }
}
```

Uso:

```ts
const root: FileSystemNode = {
  kind: "folder",
  name: "root",
  children: [
    {
      kind: "file",
      name: "a.txt",
      size: 10,
    },
    {
      kind: "folder",
      name: "images",
      children: [
        {
          kind: "file",
          name: "photo.png",
          size: 500,
        },
      ],
    },
  ],
};

console.log(getSize(root)); // 510
printNode(root);
```

Esta versión es muy natural en TypeScript.

No estamos usando polimorfismo con clases, sino con uniones discriminadas y recursión. Conceptualmente sigue siendo Composite: hay nodos simples y nodos compuestos formando un árbol.

---

### Diferencia importante: Composite orientado a objetos vs datos + funciones

En la versión con clases, cada objeto sabe cómo comportarse:

```ts
item.getSize();
item.print();
```

En la versión funcional, los datos están separados de las operaciones:

```ts
getSize(item);
printNode(item);
```

Ninguna opción es universalmente superior.

La versión con clases puede ser útil cuando quieres encapsular comportamiento junto con estado.

La versión con datos y funciones puede ser mejor cuando quieres estructuras serializables, fáciles de transformar o compatibles con APIs, JSON, Redux, React, etc.

En TypeScript, esta segunda forma suele ser muy común.

---

### Ejemplo práctico: menú de navegación

Composite también aplica a menús.

Un menú puede tener enlaces individuales y submenús.

```ts
type MenuLink = {
  kind: "link";
  label: string;
  url: string;
};

type MenuGroup = {
  kind: "group";
  label: string;
  children: MenuItem[];
};

type MenuItem = MenuLink | MenuGroup;
```

Render simple:

```ts
function renderMenu(item: MenuItem): string {
  if (item.kind === "link") {
    return `<a href="${item.url}">${item.label}</a>`;
  }

  const childrenHtml = item.children.map(renderMenu).join("");

  return `
    <section>
      <h3>${item.label}</h3>
      ${childrenHtml}
    </section>
  `;
}
```

Uso:

```ts
const menu: MenuItem = {
  kind: "group",
  label: "Cuenta",
  children: [
    {
      kind: "link",
      label: "Perfil",
      url: "/profile",
    },
    {
      kind: "group",
      label: "Configuración",
      children: [
        {
          kind: "link",
          label: "Seguridad",
          url: "/settings/security",
        },
      ],
    },
  ],
};

const html = renderMenu(menu);
```

Aquí un grupo puede contener links o más grupos. Esa recursividad es el corazón del patrón Composite.

---

### Ejemplo práctico en React

React usa una idea muy relacionada con Composite. Un componente puede contener otros componentes mediante `children`.

```tsx
type CardProps = {
  title: string;
  children: React.ReactNode;
};

function Card({ title, children }: CardProps) {
  return (
    <section>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}
```

Uso:

```tsx
<Card title="Perfil">
  <p>Ana Gómez</p>
  <button>Editar</button>
</Card>
```

El componente `Card` no necesita saber exactamente qué hijos contiene. Puede recibir texto, botones, formularios, otros componentes, etc.

No es el Composite GoF clásico en forma pura, pero conceptualmente comparte la idea: componer estructuras grandes a partir de piezas más pequeñas que pueden anidarse.

---

### Comparación con Java

En Java, Composite suele verse así:

```java
interface FileSystemItem {
    String getName();
    int getSize();
    void print(String indent);
}
```

Hoja:

```java
class File implements FileSystemItem {
    private String name;
    private int size;

    File(String name, int size) {
        this.name = name;
        this.size = size;
    }

    public String getName() {
        return name;
    }

    public int getSize() {
        return size;
    }

    public void print(String indent) {
        System.out.println(indent + "- " + name);
    }
}
```

Composite:

```java
class Folder implements FileSystemItem {
    private String name;
    private List<FileSystemItem> children = new ArrayList<>();

    Folder(String name) {
        this.name = name;
    }

    void add(FileSystemItem item) {
        children.add(item);
    }

    public String getName() {
        return name;
    }

    public int getSize() {
        return children.stream()
            .mapToInt(FileSystemItem::getSize)
            .sum();
    }

    public void print(String indent) {
        System.out.println(indent + "+ " + name);

        for (FileSystemItem child : children) {
            child.print(indent + "  ");
        }
    }
}
```

Java favorece esta implementación con interfaces y clases.

---

### Comparación con Python

En Python podrías hacerlo con clases:

```python
class File:
    def __init__(self, name, size):
        self.name = name
        self.size = size

    def get_size(self):
        return self.size


class Folder:
    def __init__(self, name):
        self.name = name
        self.children = []

    def add(self, item):
        self.children.append(item)

    def get_size(self):
        return sum(child.get_size() for child in self.children)
```

O con diccionarios y funciones recursivas:

```python
def get_size(node):
    if node["kind"] == "file":
        return node["size"]

    return sum(get_size(child) for child in node["children"])
```

De nuevo, la idea conceptual es más importante que la forma orientada a objetos.

---

## 4. Ejemplo de mal uso o mala interpretación

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

## 5. Cuándo conviene aplicarlo y cuándo puede ser innecesario o excesivo

Conviene aplicarlo cuando tienes estructuras tipo árbol o jerarquías parte-todo.

Casos típicos:

Sistemas de archivos.

Menús anidados.

Componentes UI.

Árboles de categorías.

Organigramas.

Expresiones matemáticas.

Documentos con secciones, subsecciones y párrafos.

Escenas gráficas en videojuegos o editores visuales.

Reglas de negocio compuestas.

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

La estructura es plana.

No necesitas tratar grupos e individuos de manera uniforme.

No hay recursión.

La interfaz común obliga a métodos inválidos para algunos elementos.

Una simple colección basta.

Por ejemplo:

```ts
const products = [productA, productB, productC];
```

Eso no necesita Composite a menos que los productos puedan contener subproductos, bundles, categorías anidadas o estructuras recursivas.

---

## 6. Analogía sencilla

Imagina una empresa.

Una persona individual puede reportar su costo salarial.

Un equipo puede reportar su costo total sumando el costo de todas las personas que lo componen.

Una división puede reportar su costo total sumando los costos de varios equipos.

Desde fuera, puedes preguntar:

```txt
¿Cuánto cuesta esta unidad?
```

Y no importa si la unidad es una persona, un equipo o una división. Cada una sabe responder de acuerdo con su estructura.

Eso es Composite: tratar elementos individuales y grupos bajo una misma idea.

---

La idea clave: **Composite sirve para modelar estructuras jerárquicas donde las partes individuales y los grupos pueden usarse de manera uniforme**. En TypeScript, puede implementarse con clases e interfaces, pero también de forma muy natural con tipos discriminados, objetos y funciones recursivas.
