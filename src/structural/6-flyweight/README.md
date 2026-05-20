# Patrón estructural 6: Flyweight

## 1. Qué problema intenta resolver

Flyweight intenta resolver un problema de **uso excesivo de memoria** cuando una aplicación crea muchísimos objetos parecidos que comparten gran parte de sus datos.

Imagina un editor de mapas con miles de árboles:

```ts
const trees = [
  { x: 10, y: 20, type: "oak", color: "green", texture: "oak.png" },
  { x: 15, y: 25, type: "oak", color: "green", texture: "oak.png" },
  { x: 40, y: 80, type: "oak", color: "green", texture: "oak.png" },
];
```

Cada árbol tiene datos únicos:

```txt
x, y
```

Pero también tiene datos repetidos:

```txt
type, color, texture
```

Si tienes 100.000 árboles y cada uno guarda su propia textura, color, modelo 3D o configuración pesada, estás duplicando información innecesariamente.

Flyweight responde a esta pregunta:

**“¿Cómo puedo representar muchos objetos similares compartiendo la parte común entre ellos?”**

---

## 2. Qué idea propone como solución

La idea central es separar el estado de un objeto en dos partes:

### Estado intrínseco

Es la parte compartida, común, reutilizable.

Por ejemplo:

```txt
tipo de árbol
color
textura
modelo 3D
```

### Estado extrínseco

Es la parte única, contextual, que cambia por cada instancia.

Por ejemplo:

```txt
posición x
posición y
altura específica
rotación
```

En vez de crear 100.000 objetos completos, creas pocos objetos compartidos:

```txt
TreeType("oak", "green", "oak.png")
TreeType("pine", "dark-green", "pine.png")
```

Y luego cada árbol individual apunta a uno de esos tipos:

```txt
Tree(x: 10, y: 20, type: oakTreeType)
Tree(x: 15, y: 25, type: oakTreeType)
Tree(x: 40, y: 80, type: oakTreeType)
```

La estructura conceptual sería:

```txt
Muchos objetos pequeños → comparten → pocos objetos pesados
```

Con SOLID:

Flyweight puede ayudar con **SRP**, porque separa los datos compartidos de los datos contextuales.

También puede apoyar **OCP** si puedes agregar nuevos tipos compartidos sin modificar el código cliente.

Pero no debe aplicarse solo por “diseño bonito”. Es un patrón principalmente motivado por rendimiento y memoria. Si no tienes muchos objetos o datos pesados repetidos, probablemente sobra.

---

## 3. Cómo se ve aplicado en TypeScript y otros lenguajes

## Ejemplo base en TypeScript

Supongamos que queremos dibujar árboles.

Primero definimos el objeto compartido:

```ts
type TreeType = {
  name: string;
  color: string;
  texture: string;
  draw(x: number, y: number): void;
};
```

Creamos una función para construir un tipo de árbol:

```ts
function createTreeType(
  name: string,
  color: string,
  texture: string,
): TreeType {
  return {
    name,
    color,
    texture,

    draw(x: number, y: number) {
      console.log(`Dibujando ${name} en (${x}, ${y}) con textura ${texture}`);
    },
  };
}
```

Ahora una instancia concreta de árbol solo guarda su estado único:

```ts
type Tree = {
  x: number;
  y: number;
  type: TreeType;
};
```

Uso:

```ts
const oakType = createTreeType("Oak", "green", "oak.png");

const treeA: Tree = {
  x: 10,
  y: 20,
  type: oakType,
};

const treeB: Tree = {
  x: 40,
  y: 90,
  type: oakType,
};

treeA.type.draw(treeA.x, treeA.y);
treeB.type.draw(treeB.x, treeB.y);
```

`treeA` y `treeB` tienen posiciones distintas, pero comparten el mismo `TreeType`.

---

## Agregando una factory de Flyweights

Normalmente Flyweight usa una factory para reutilizar objetos compartidos.

```ts
type TreeType = {
  name: string;
  color: string;
  texture: string;
  draw(x: number, y: number): void;
};

class TreeTypeFactory {
  private treeTypes = new Map<string, TreeType>();

  getTreeType(name: string, color: string, texture: string): TreeType {
    const key = `${name}-${color}-${texture}`;

    const existing = this.treeTypes.get(key);

    if (existing) {
      return existing;
    }

    const treeType: TreeType = {
      name,
      color,
      texture,

      draw(x, y) {
        console.log(`Dibujando ${name} en (${x}, ${y}) con textura ${texture}`);
      },
    };

    this.treeTypes.set(key, treeType);

    return treeType;
  }

  count(): number {
    return this.treeTypes.size;
  }
}
```

Ahora usamos esa factory:

```ts
type Tree = {
  x: number;
  y: number;
  type: TreeType;
};

const factory = new TreeTypeFactory();

const trees: Tree[] = [];

trees.push({
  x: 10,
  y: 20,
  type: factory.getTreeType("Oak", "green", "oak.png"),
});

trees.push({
  x: 30,
  y: 60,
  type: factory.getTreeType("Oak", "green", "oak.png"),
});

trees.push({
  x: 80,
  y: 100,
  type: factory.getTreeType("Pine", "dark-green", "pine.png"),
});

console.log(factory.count()); // 2
```

Aunque hay tres árboles, solo hay dos tipos compartidos.

---

## Versión más funcional en TypeScript

No necesitas una clase para la factory. Puedes usar una función con closure:

```ts
type TreeType = {
  name: string;
  color: string;
  texture: string;
};

function createTreeTypeRegistry() {
  const cache = new Map<string, TreeType>();

  return {
    get(name: string, color: string, texture: string): TreeType {
      const key = JSON.stringify({ name, color, texture });

      const existing = cache.get(key);

      if (existing) {
        return existing;
      }

      const treeType = {
        name,
        color,
        texture,
      };

      cache.set(key, treeType);

      return treeType;
    },

    size() {
      return cache.size;
    },
  };
}
```

Uso:

```ts
const registry = createTreeTypeRegistry();

const oakA = registry.get("Oak", "green", "oak.png");
const oakB = registry.get("Oak", "green", "oak.png");

console.log(oakA === oakB); // true
```

La comparación da `true` porque ambos apuntan al mismo objeto compartido.

---

## Ejemplo práctico: formato de texto

Un caso clásico es un editor de texto.

Imagina que cada carácter guardara toda su configuración:

```ts
type Character = {
  value: string;
  fontFamily: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  color: string;
  x: number;
  y: number;
};
```

Si tienes un documento enorme, muchos caracteres comparten el mismo estilo.

Podrías separar el estilo compartido:

```ts
type TextStyle = {
  fontFamily: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  color: string;
};
```

Y el carácter específico:

```ts
type Character = {
  value: string;
  x: number;
  y: number;
  style: TextStyle;
};
```

Factory de estilos:

```ts
function createTextStyleRegistry() {
  const styles = new Map<string, TextStyle>();

  return {
    getStyle(style: TextStyle): TextStyle {
      const key = JSON.stringify(style);

      const existing = styles.get(key);

      if (existing) {
        return existing;
      }

      styles.set(key, style);
      return style;
    },
  };
}
```

Uso:

```ts
const styleRegistry = createTextStyleRegistry();

const normalStyle = styleRegistry.getStyle({
  fontFamily: "Inter",
  fontSize: 16,
  bold: false,
  italic: false,
  color: "black",
});

const chars: Character[] = [
  { value: "H", x: 0, y: 0, style: normalStyle },
  { value: "o", x: 8, y: 0, style: normalStyle },
  { value: "l", x: 16, y: 0, style: normalStyle },
  { value: "a", x: 24, y: 0, style: normalStyle },
];
```

Los caracteres son distintos, pero comparten el mismo objeto `normalStyle`.

---

## Ejemplo práctico: productos con datos compartidos

Supón que tienes muchas líneas de pedido.

Cada línea tiene datos únicos:

```txt
cantidad
precio final
descuento aplicado
```

Pero muchas comparten el mismo producto base:

```txt
nombre
marca
categoría
peso
imagen
descripción
```

Puedes modelarlo así:

```ts
type ProductInfo = {
  id: string;
  name: string;
  brand: string;
  category: string;
};

type OrderItem = {
  product: ProductInfo;
  quantity: number;
  finalPrice: number;
};
```

En vez de duplicar `ProductInfo` en cada item, todos los items que pertenecen al mismo producto pueden referenciar el mismo objeto.

Esto puede ser útil si trabajas con catálogos grandes, inventarios, renderizado de listas o procesamiento masivo.

---

## Comparación con Java

En Java, Flyweight suele verse con una factory que cachea instancias:

```java
class TreeType {
    private final String name;
    private final String color;
    private final String texture;

    TreeType(String name, String color, String texture) {
        this.name = name;
        this.color = color;
        this.texture = texture;
    }

    void draw(int x, int y) {
        System.out.println("Dibujando " + name + " en " + x + ", " + y);
    }
}
```

Factory:

```java
class TreeTypeFactory {
    private Map<String, TreeType> cache = new HashMap<>();

    TreeType getTreeType(String name, String color, String texture) {
        String key = name + color + texture;

        if (!cache.containsKey(key)) {
            cache.put(key, new TreeType(name, color, texture));
        }

        return cache.get(key);
    }
}
```

Java lo expresa muy bien con clases porque el patrón originalmente se pensó en ese contexto.

---

## Comparación con Python

En Python podrías hacerlo con un diccionario:

```python
class TreeType:
    def __init__(self, name, color, texture):
        self.name = name
        self.color = color
        self.texture = texture

    def draw(self, x, y):
        print(f"Dibujando {self.name} en ({x}, {y})")


class TreeTypeFactory:
    def __init__(self):
        self.cache = {}

    def get_tree_type(self, name, color, texture):
        key = (name, color, texture)

        if key not in self.cache:
            self.cache[key] = TreeType(name, color, texture)

        return self.cache[key]
```

Uso:

```python
factory = TreeTypeFactory()

oak_a = factory.get_tree_type("Oak", "green", "oak.png")
oak_b = factory.get_tree_type("Oak", "green", "oak.png")

print(oak_a is oak_b)  # True
```

La idea es la misma: reutilizar objetos compartidos.

---

## 4. Ejemplo de mal uso o mala interpretación

Un mal uso común es aplicar Flyweight sin necesidad real.

```ts
type User = {
  id: string;
  name: string;
};
```

Si tienes unos pocos usuarios, no necesitas una factory para compartir nombres, roles o datos comunes. Sería complejidad innecesaria.

Otro mal uso es compartir estado que debería ser independiente.

Por ejemplo:

```ts
type TreeType = {
  name: string;
  color: string;
  texture: string;
  health: number;
};
```

`health` no debería estar en `TreeType` si cada árbol puede tener salud distinta.

Si compartes eso, todos los árboles del mismo tipo tendrían la misma salud, lo cual probablemente es incorrecto.

La separación correcta sería:

```ts
type TreeType = {
  name: string;
  color: string;
  texture: string;
};

type Tree = {
  x: number;
  y: number;
  health: number;
  type: TreeType;
};
```

Otro error frecuente es esconder demasiado la identidad compartida. Si el objeto compartido es mutable, un cambio puede afectar a muchas instancias.

```ts
const oakType = factory.getTreeType("Oak", "green", "oak.png");

oakType.color = "red";
```

Ahora todos los árboles que comparten `oakType` podrían verse rojos.

Por eso los flyweights deberían ser idealmente **inmutables**.

En TypeScript puedes reforzarlo con `Readonly`:

```ts
type TreeType = Readonly<{
  name: string;
  color: string;
  texture: string;
}>;
```

---

## 5. Cuándo conviene aplicarlo y cuándo puede ser innecesario o excesivo

Conviene aplicarlo cuando:

Tienes una cantidad muy grande de objetos.

Muchos objetos comparten datos repetidos.

Los datos compartidos son relativamente pesados.

Puedes separar claramente estado intrínseco y extrínseco.

La memoria o el rendimiento son una preocupación real.

Casos típicos:

Editores gráficos.

Videojuegos.

Mapas con miles de objetos.

Editores de texto.

Renderizado de documentos.

Catálogos grandes.

Sistemas con muchos objetos de configuración repetida.

Por ejemplo:

```txt
100.000 árboles
10 tipos de árbol
```

Ahí Flyweight tiene sentido.

---

Puede ser innecesario cuando:

Hay pocos objetos.

Los objetos son pequeños.

La optimización no está justificada.

El estado compartido y el estado único no se separan claramente.

La mutabilidad compartida puede introducir bugs.

El patrón hace el código más difícil de leer que el problema original.

Por ejemplo:

```ts
const button = {
  label: "Guardar",
  variant: "primary",
};
```

No necesitas Flyweight para eso.

---

## 6. Analogía sencilla

Imagina un teatro.

Hay 1.000 sillas, pero no necesitas guardar el diseño completo de cada silla por separado.

Muchas sillas comparten el mismo modelo:

```txt
silla estándar roja
silla premium negra
silla accesible azul
```

Cada silla individual solo necesita saber:

```txt
fila
número
estado de reserva
```

El diseño de la silla se comparte.

Flyweight funciona igual: muchos objetos individuales comparten una parte común para ahorrar memoria.

---

La idea clave: **Flyweight separa lo compartido de lo individual para evitar duplicar datos en grandes cantidades de objetos**. En TypeScript suele implementarse con objetos compartidos, mapas de caché, registros o factories. Es útil cuando hay una razón real de memoria o rendimiento; si no, puede ser una optimización prematura.
