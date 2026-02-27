# Práctica de laboratorio de PL #2. GitHub y Entornos de Desarrollo

Esta es la cuarta práctica de la asignatura **Procesadores de Lenguajes** (curso 2025-2026), perteneciente al [Grado en Ingeniería Informática](https://www.ull.es/grados/ingenieria-informatica/) de [La Universidad de La Laguna](https://www.ull.es/).

El objetivo principal de esta práctica es comprender y profundizar en el concepto de un **analizador léxico**, además de cómo se correlaciona con el **analizador sintáctico** y la **definición dirigida por sintaxis** (_Syntax Directed Definition_ - $SDD$).

## Estructura de un informe

Todo informe sigue la siguiente metodología, estructurándose de la siguiente forma:

1. Título
2. Objetivos
3. Contexto
4. Metodología
5. Desarrollo
6. Resultados

## Objetivos

El objetivo fundamental de esta práctica es la implementación de una calculadora funcional utilizando **Jison**, integrando conceptos fundamentales de la teoría de lenguajes. De forma específica, se persiguen los siguientes hitos:

* **Comprender el flujo de datos** entre el analizador léxico (*lexer*) y el analizador sintáctico (*parser*).
* **Implementar una Definición Dirigida por la Sintaxis (SDD)** para realizar cálculos aritméticos durante el proceso de reconocimiento sintáctico.
* **Manejar la precedencia y asociatividad** de operadores mediante la estructura de la gramática y el orden de las reglas léxicas.
* **Extender las capacidades de un lenguaje** existente mediante la modificación de expresiones regulares para reconocer nuevos tipos de datos (números en punto flotante) y elementos sintácticos (comentarios).
* **Familiarizarse con entornos de pruebas** automatizadas utilizando Jest para garantizar la robustez del traductor.

## Contexto

Este informe documenta la cuarta práctica de la asignatura **Procesadores de Lenguajes** (curso 2025-2026). Esta asignatura forma parte del [Grado en Ingeniería Informática](https://www.ull.es/grados/ingenieria-informatica/) de la [Universidad de La Laguna (ULL)](https://www.ull.es/).

Jison es un generador de analizadores sintácticos, y...

## Metodología

La metodología empleada se basa en el ciclo de vida del desarrollo definido en la asignatura:

1.  **Gestión por Incidencias:** Se ha convertido cada ejercicio de la práctica en una *issue* de GitHub, utilizando el número del ejercicio como título y lo solicitado como descripción.
2. **Uso de ramas `dev` y `doc`:** El desarrollo técnico se ha realizado en una rama de desarrollo separada (`dev`), mientras que la documentación se ha gestionado en la rama `doc`.
3. **Generación de código:** Se ha utilizado el generador **Jison** para transformar la especificación gramatical (`.jison`) en código JavaScript ejecutable (`parser.js`).
4. **Pruebas con Jest:** Se ha empleado **Jest** para verificar que cada cambio en la gramática o en el lexer no introdujera regresiones y que los nuevos requisitos (punto flotante y comentarios) funcionaran según lo esperado.

## Desarrollo

Respondamos a las cuestiones teóricas planteadas en el Ejercicio 2.

### 2.1. Describa la diferencia entre `/* skip whitespace */` y devolver un _token_.

La expresión regular `\s+` reconoce el lexema de espacios en blanco (ya sean espacios `' '` o tabuladores). Es un patrón especial porque no tiene asociado un _token_ (no devuelve ninguno), y tampoco tiene atributo.

Si analizamos los patrones de `grammar.jison`, nos damos cuenta de que todos los patrones (a excepción del anteriormente comentado) conllevan la acción de devolver un _token_:
```lex
\s+                   { /* skip whitespace */; }
[0-9]+                { return 'NUMBER';       }
"**"                  { return 'OP';           }
[-+*/]                { return 'OP';           }
<<EOF>>               { return 'EOF';          }
.                     { return 'INVALID';      }
```
Por ejemplo, el patrón `[0-9]+` devuelve un token de tipo `'NUMBER'`.

Cuando dejamos el bloque vacío, el analizador léxico reinicia su búsqueda internamente sin salir de su función. Por otra parte, cuando hacemos `return`, la función del analizador léxico termina y devuelve el control al analizador sintáctico.

### 2.2. Escriba la secuencia exacta de _tokens_ producidos para la entrada `123**45+@`.

`'NUMBER'`, `'OP'`, `'NUMBER'`, `OP`, `INVALID`.

Nota importante: no se llega a producir el _token_ `EOF` puesto que el parser, al recibir el _token_ `INVALID`, lanza una excepción y detiene el programa.

Si modificamos el fichero `grammar.jison` para que imprima con console.log un string representativo de los tokens antes de retornarlos, este es el resultado que lo evidencia:
```
> p.parse("123**45+@")
NUMBER
OP
NUMBER
OP
INVALID
Uncaught Error: Parse error on line 1:
123**45+@
--------^
Expecting 'NUMBER', got 'INVALID'
    at Parser.parseError (/home/usuario/practicas/04-traduccion-dirigida-sintaxis-francisco_gabriel-ruiz-alu0101618586/src/parser.js:106:21)
    at Parser.parse (/home/usuario/practicas/04-traduccion-dirigida-sintaxis-francisco_gabriel-ruiz-alu0101618586/src/parser.js:173:22)
    at exports.parse (/home/usuario/practicas/04-traduccion-dirigida-sintaxis-francisco_gabriel-ruiz-alu0101618586/src/parser.js:618:51) {
  hash: {
    text: '@',
    token: 'INVALID',
    line: 0,
    loc: { first_line: 1, last_line: 1, first_column: 7, last_column: 8 },
    expected: [ "'NUMBER'" ]
  }
}
```

### 2.3. Indique por qué `**` debe aparecer antes que `[-+*/]`.

Es crucial que `**` aparezca antes que `[-+*/]` puesto que si esto fuera al revés, el operador `**` jamás sería reconocido. Si el orden fuera al revés, tal que:
```lex
[-+*/]                { return 'OP';           }
"**"                  { return 'OP';           }
```

Si se introdujera la entrada `**`, el analizador léxico primero reconocería la primera estrella `*` y la asociaría con el token `'OP'`. Se la entregaría al analizador sintáctico, que posteriormente pedirá otro token (_get token_) y el analizador leerá la segunda estrella `*`, asociándola con otro token `OP` y entregándosela.

Este comportamiento no es deseado, ya que para nuestra calculadora, el operador `**` no debe interpretarse como dos operadores `*` uno al lado del otro, sino como un operador en sí.

### 2.4. Explique cuándo se devuelve `EOF`.

Se devuelve el token `EOF` cuando el analizador léxico llegue al final del fichero (es decir, cuando detecta el fin de flujo), y por tanto, no tenga más caracteres que leer (y po ende, entregar al parser/analizador sintáctico). `<<EOF>>` es el patrón especial que detecta el fin de flujo (End of File).

### 2.5. Explique por qué existe la regla `.` que devuelve `INVALID`.

Esta regla es importantísima puesto que permite identificar caracteres no válidos. Recordemos que, en expresiones regulares, `.` representa a un caracter cualquiera. Al introducir esta regla al final, nos aseguramos de que el analizador léxico haya intentado emparejar al caracter actualmente siendo leído con cualquier otro token mediante los patrones definidos. Si se diera el caso de que ninguno coincide, este último patrón nos permite crear un token `INVALID`, entregárselo al parser y poder señalarle que se ha leído un caracter no válido.

En este caso, un caracter no válido podría ser una palabra, tal que `a`.

## Resultados

La realización de esta práctica ha permitido validar el funcionamiento de un sistema de traducción dirigido por la sintaxis mediante **Jison**, alcanzando los siguientes hitos:

* **Implementación de la Calculadora:** Se ha logrado un procesador funcional que no solo reconoce la sintaxis, sino que ejecuta cálculos aritméticos en tiempo real mediante una **SDD (Definición Dirigida por Sintaxis)**.
* **Extensión del Léxico:**
  * **Comentarios:** Se implementó la regla `"//"[^\n]*` para ignorar anotaciones de una sola línea, permitiendo documentar la entrada sin afectar el cálculo.
  * **Punto Flotante:** Se expandió el reconocimiento de números con la regex `[0-9]+(\.[0-9]+)?([eE][-+]?[0-9]+)?`, dando soporte a decimales y notación científica (ej. `2.35e-3`).
* **Robustez mediante Pruebas (Jest):**
  * Se superaron **31 tests** que cubren desde operaciones básicas hasta casos de borde (*edge cases*).
  * Se verificó que el lexer se recupera correctamente tras un comentario mediante el uso de saltos de línea (`\n`).
  * Se validó la jerarquía de operadores, asegurando que `**` tiene prioridad sobre los caracteres individuales `*`.
  * Se validó el uso correcto de números en punto flotante.