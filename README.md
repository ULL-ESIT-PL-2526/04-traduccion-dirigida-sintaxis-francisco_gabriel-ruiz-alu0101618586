# Práctica de laboratorio de PL #2. GitHub y Entornos de Desarrollo

Esta es la quinta práctica de la asignatura **Procesadores de Lenguajes** (curso 2025-2026), perteneciente al [Grado en Ingeniería Informática](https://www.ull.es/grados/ingenieria-informatica/) de [La Universidad de La Laguna](https://www.ull.es/).

El objetivo principal de esta práctica es comprender y profundizar en el concepto de una **traducción dirigida por sintaxis**, además de cómo se correlaciona con la **gramática**, **derivaciones**, **parse trees** y la **definición dirigida por sintaxis** (_Syntax Directed Definition_ - $SDD$).

## Estructura de un informe

Todo informe sigue la siguiente metodología, estructurándose de la siguiente forma:

1. Título
2. Objetivos
3. Contexto
4. Metodología
5. Desarrollo
6. Resultados

## Objetivos

El objetivo fundamental de esta práctica es la resolución de conflictos jerárquicos en una gramática aritmética utilizando **Jison**. De forma específica, se persiguen los siguientes hitos:

* **Identificar la ambigüedad** en una gramática plana y cómo afecta al orden de evaluación semántica.
* **Estratificar la gramática** introduciendo nuevos símbolos no terminales para forzar niveles de precedencia (suma < multiplicación < potencia).
* **Manejar la asociatividad** mediante recursividad a la izquierda (para operaciones aditivas y multiplicativas) y recursividad a la derecha (para la potencia).
* **Implementar el reconocimiento de paréntesis** para alterar dinámicamente la prioridad de las operaciones.
* **Consolidar el flujo de pruebas** mediante la creación de baterías de tests en Jest que validen tanto números enteros como flotantes.

## Contexto

Este informe documenta la quinta práctica de la asignatura **Procesadores de Lenguajes** (curso 2025-2026). Esta asignatura forma parte del [Grado en Ingeniería Informática](https://www.ull.es/grados/ingenieria-informatica/) de la [Universidad de La Laguna (ULL)](https://www.ull.es/). Partiendo de una calculadora simple con gramática ambigua, se ha evolucionado el traductor para que respete los convenios matemáticos universales.

## Metodología

La metodología empleada se basa en el ciclo de vida del desarrollo definido en la asignatura:

1.  **Gestión por Incidencias:** Se ha convertido cada ejercicio de la práctica en una *issue* de GitHub, utilizando el número del ejercicio como título y lo solicitado como descripción.
2. **Uso de ramas `dev` y `doc`:** El desarrollo técnico se ha realizado en una rama de desarrollo separada (`dev`), mientras que la documentación se ha gestionado en la rama `doc`.
3. **Generación de código:** Se ha utilizado el generador **Jison** para transformar la especificación gramatical (`.jison`) en código JavaScript ejecutable (`parser.js`).
4. **Pruebas con Jest:** Se ha empleado **Jest** para verificar la corrección de la precedencia y la correcta gestión de los números de punto flotante.

## Desarrollo

Respondamos a las cuestiones teóricas planteadas en el Ejercicio 1.

### 1.1 Escriba la derivación para cada una de las frases.

Escribamos la derivación de cada una de las frases:
* Frase `4.0-2.0*3.0` :

$$L \Rightarrow E \text{ eof} \Rightarrow E \text{ op } T \text{ eof} \Rightarrow E \text{ op } T \text{ op } T \text{ eof} \Rightarrow T \text{ op } T \text{ op } T \text{ eof} \Rightarrow number \text{ op } T \text{ op } T \text{ eof} \Rightarrow number \text{ op } number \text{ op } T \text{ eof} \Rightarrow number \text{ op } number \text{ op } number \text{ eof} $$

* Frase `2**3**2` :

$$L \Rightarrow E \text{ eof} \Rightarrow E \text{ op } T \text{ eof} \Rightarrow E \text{ op } T \text{ op } T \text{ eof} \Rightarrow T \text{ op } T \text{ op } T \text{ eof} \Rightarrow number \text{ op } T \text{ op } T \text{ eof} \Rightarrow number \text{ op } number \text{ op } T \text{ eof} \Rightarrow number \text{ op } number \text{ op } number \text{ eof} $$

* Frase `7-4/2` :

$$L \Rightarrow E \text{ eof} \Rightarrow E \text{ op } T \text{ eof} \Rightarrow E \text{ op } T \text{ op } T \text{ eof} \Rightarrow T \text{ op } T \text{ op } T \text{ eof} \Rightarrow number \text{ op } T \text{ op } T \text{ eof} \Rightarrow number \text{ op } number \text{ op } T \text{ eof} \Rightarrow number \text{ op } number \text{ op } number \text{ eof} $$


### 1.2 Escriba el árbol de análisis sintáctico (_parse tree_) para cada una de las frases.

Escribamos el _parse tree_ para cada una de las frases. Para cada token `number`, situaremos debajo a qué número de la expresión corresponde (no confundir con _annotated parser tree_, es sólo una ayuda para comprender un poco mejor el ábol y el porqué de su 'fallo', que detallaremos en el apartado 1.3).

* Frase `4.0-2.0*3.0` :

```text
           L
         /   \
        E     eof
      / | \
     E  op  T
   / | \    |
  E  op  T  number
  |      |   
  T    number 3.0
  |     
number  2.0

 4.0
```

* Frase `2**3**2` :

```text
           L
         /   \
        E     eof
      / | \
     E  op  T
   / | \    |
  E  op  T  number
  |      |
  T    number 2
  |
number   3

  2
```

* Frase `7-4/2` :

```text
           L
         /   \
        E     eof
      / | \
     E  op  T
   / | \    |
  E  op  T  number
  |      |
  T    number 2
  |
number   4

  7
```

### 1.3. ¿En qué orden se evaluan las acciones semánticas para cada una de las frases? Nótese que la evaluación a la que da lugar la sdd para las frases no se corresponde con los convenios de evaluación establecidos en matemáticas y los lenguajes de programación.

Al observar estos árboles, queda claro por qué la evaluación se considera incorrecta según las matemáticas:

* El árbol es **asociativo a la izquierda**. Esto significa que la operación que esté más a la izquierda en la frase siempre quedará en la parte más baja del árbol.
* Como las acciones semánticas se ejecutan en **post-orden** (bottom-up), primero se evalúa lo que está más abajo (el orden de evaluación no es correcto).
* La consecuencia la vemos reflejada por ejemplo en la frase `7 - 4 / 2`, donde la resta está más abajo que la división. Por tanto, el programa hará primero `(7 - 4)` y luego `3 / 2`, dando como resultado `1.5` en lugar de `5`.

## Resultados

La realización de esta práctica ha permitido obtener los siguientes resultados técnicos:

* **Eliminación de la ambigüedad:** El parser ahora genera un único árbol de análisis sintáctico correcto para cualquier expresión aritmética estándar.
* **Asociatividad Correcta:** Se ha validado mediante tests que la potencia opera de derecha a izquierda, mientras que el resto de operaciones lo hacen de izquierda a derecha.
* **SDD Evolucionada:** La definición dirigida por la sintaxis es ahora capaz de manejar tokens específicos (`OPAD`, `OPMU`, `OPOW`) en lugar de un token genérico `OP`.
* **Cobertura de Tests:** Se ha logrado pasar con éxito una suite de tests que incluye:
  * 6 casos de precedencia con enteros.
  * 6 casos de precedencia con flotantes.
  * 4 casos de paréntesis anidados y complejos.



El resultado final es una calculadora robusta que cumple con los estándares de evaluación de lenguajes de programación modernos.