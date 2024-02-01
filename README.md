# WebGL.ts

## Introducción

Bienvenidos al proyecto WebGL.ts, desarrollado en el marco de la asignatura de Gráficos 3D del Máster Universitario en Gráficos por Computador de la Universidad Rey Juan Carlos (URJC). Este proyecto se enfoca en la creación y manipulación de gráficos 3D a través de un motor basado en WebGL, destacando su simplicidad y eficacia en el ámbito educativo. La interactividad es un pilar fundamental de este proyecto, permitiendo a los usuarios experimentar directamente con las variables de distintos shaders. El objetivo es proporcionar una comprensión clara y aplicada de los conceptos clave en gráficos 3D, haciendo hincapié en la importancia de la visualización y manipulación en tiempo real.

Para complementar y modernizar la estructura del proyecto, se ha optado por la utilización de Node.js, Webpack y TypeScript. Esta decisión técnica no solo aporta a la actualización del proceso de desarrollo, sino que también garantiza una mayor robustez y escalabilidad en comparación con el uso tradicional de JavaScript. Esta combinación de tecnologías avanzadas proporciona una base sólida para el desarrollo de aplicaciones gráficas en la web, ofreciendo a los estudiantes y desarrolladores una plataforma eficiente y de fácil acceso para explorar el vasto mundo de los gráficos por computador. En resumen, WebGL.ts se presenta como una herramienta educativa y práctica, ideal para aquellos interesados en profundizar en el fascinante campo de los gráficos 3D a través de tecnologías web modernas.

## Requisitos Previos

Antes de instalar y ejecutar este proyecto, asegúrate de tener instalado:

- Node.js (versión 20 o superior)
- npm (que generalmente se instala con Node.js)

## Instalación

Para instalar y ejecutar este proyecto en tu máquina local, sigue estos pasos:

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tuicher/WebGL.ts
   cd WebGL.ts
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Ejecuta el proyecto:
   ```bash
   npm start
   ```
Esto iniciará el servidor local y debería abrir automáticamente el proyecto en tu navegador. Si no se abre automáticamente, puedes acceder a él visitando http://localhost:3000 en tu navegador (o el puerto especificado en tu configuración).

## Arquitectura
Durante el desarrollo de WebGl.ts, se ha incorporado un robusto conjunto de clases auxiliares especialmente diseñadas para enriquecer y simplificar la experiencia de programación. Estas clases no solo ofrecen una capa de abstracción crucial para interactuar con el motor de WebGL sino que también proveen un conjunto de herramientas esenciales para el manejo de operaciones matemáticas complejas, la gestión de componentes gráficos y la carga eficiente de recursos. A continuación, se detalla el papel y la contribución de cada clase en el ecosistema de WebGl.ts:

#### Matemáticas
- __Vector3__: Esta clase es fundamental para la representación y manipulación de vectores en un espacio tridimensional. Esta clase fue creada para servir como snippet futuro, ya que maneja todas las operaciones típicas de los vectores utilizando las peculizaridades de formato de WebGL.
- __Quaternion__: Esencial para la representación de rotaciones y orientaciones dentro del espacio 3D.
#### Entidades del Motor
- __Camera__: Básica en cualquier motor de render esta clase actúa como el ojo a través del cual se visualiza el mundo virtual.
- __Transform__: Fundamental para definir la posición, rotación y escala de los objetos dentro de la escena.
- __ShaderLoader__ y __TextureLoader__: Realizan la descarga y carga de los distintos recursos.

## Render

Para efectuar el renderizado de una escena utilizando WebGL.ts, se requiere la creación de un objeto de JavaScript con todos los distintos elementos presentes en la escena. Este objeto actúa como un punto central de acceso para los valores que serán utilizados por las diversas funciones de renderizado. La estructura de este objeto es muy importante, ya que dicta cómo se organizan los recursos tales como mallas (meshes), texturas, materiales (shaders), y luces, facilitando su manejo y procesamiento durante la fase de renderizado. A continuación, se detalla un esquema de cómo podría organizarse este objeto.

```javascript
let resources = {
    objects: [
        {
            mesh: new OBJ.Mesh(objMesh),
            texture: 'colorTexture',
            transform: new Transform(new Vector3([0.0, 0.0, 0.0])),
            shader: 'material'
        },
    ],
    textures: {
        colorTexture: {
            src: flatColor,
            texture: undefined
        },
    },
    shaders: {
        'material': {
            vertShader: vertex,
            fragShader: fragment,
            attributes: ['aVertexPosition', 'aTextureCoord', /* otros atributos aquí */],
            uniforms: ['uProjViewMatrix', 'uModelMatrix', /* otras uniformidades aquí */],
            program: null,
        },
    },
    lights: [
        {
            position: lightPos,
            color: lightColor
        }
    ]
}
```
Con los recursos ya definidos, el proceso de renderizado se simplifica enormemente. Esto se debe a que basta con invocar al método InitScene(), proporcionándole la estructura previamente establecida, y el método se encargará de inicializar, compilar y cargar en la tarjeta gráfica los distintos datos necesarios para el dibujo de la escena. Una vez que esta carga concluye, se inicia el bucle de renderizado.

## Resultados
Escena 1 - Comparativa entre las tecnicas de sobreado local Blinn-Phong, Flat, Gouraud y Phong
![captura_1](https://github.com/tuicher/WebGL.ts/assets/26395726/a63b1826-8856-4bd7-a576-b087455c6647)\
Escena 2 - Comparativa entre un sombreado de Phonng con Bump Mapping y uno de Blinn-Phong
![captura_2](https://github.com/tuicher/WebGL.ts/assets/26395726/d70a7ac2-0a88-4f57-8c1f-7ca85b571af7)

## Lineas futuras
A lo largo del desarrollo, se ha puesto un énfasis particular en la arquitectura web y en cómo se presentan los recursos disponibles. Esto ha llevado a identificar las siguientes direcciones futuras para continuar mejorando el proyecto:
- __Incrementar la abstacción__: Se propone crear una clase '_Renderer_' que centralice toda la funcionalidad relacionada con el renderizado. Esta clase actuaría como un punto unificado para gestionar los procesos de dibujo, permitiendo una interacción más sencilla y directa con la escena.
- __Deferred Shading__: Se busca aumenta la funcionalidad de este '_Renderer_' capaz de ejecutar múltiples pasadas de renderizado. Este enfoque permitiría manejar de manera más eficiente las luces y sombras en escenas complejas, mejorando el rendimiento y la calidad visual del renderizado.
