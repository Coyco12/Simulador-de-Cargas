# Simulador de Cargas Eléctricas, Fuerza y Campo Eléctrico

## Integrantes:

* Gutierrez Soto Alan Alberto
* Favila Arellano Jacqueline Yuliana
* Rodríguez Yañez Santiago Gabriel

## Descripción del simulador:
El proyecto es un simulador interactivo para trabajar con cargas eléctricas, fuerza y campo eléctrico. Fue desarrollado con HTML, CSS y JavaScript con el uso del API Canvas API para poder dibujar en pantalla.

El simulador permite agregar varias cargas con distintas magnitudes, positivas o negativas, visualizarlas sobre un plano de trabajo y observar una representación de las fuerzas electroestáticas generadas sobre ellas-

Además, el simulador permite medir el campo eléctrico en un punto a partir de la interacción de las cargas.

Las cargas y el punto del campo eléctrico pueden ser borrados individualemente o todos juntos.

## Características

* Creación de cargas positivas y negativas
* Colocación de las cargas en la posición deseada con el uso del ratón
* Medición de una carga con el uso del ratón
* Medición de fuerza y campo a la vez
* Visualización de la dirección de la fuerza y el campo
* Notificaciones flotantes de problemas con el uso del simulador

# Instalación
**No requiere de instalación de dependencias.**

El repositorio puede ser clonado o descargado, la página es estática, de modo que puede ser ejecutado en la mayoría de exploradores tan solo abriendo index.html una vez ya descargado.

## Uso del simulador:
Al abrirlo será persentado con el título de la página, debajo del lado derecho se encuentra el área de trabajo y del lado izquierdo el panel de trabajo.

Para comenzar a trabajar en el área de trabajo, primero, desde el panel se debe seleccionar una dimensión (1D o 2D), la cuál modificará cómo se pueden colocar las cargas. <BR> Además se debe elegir el valor que se le dará a la carga, el valor se elige escribiendolo en el recuadro, usando un signo negativo antes de los números si se desea que la carga sea negativa. Debajo del recuadro para darle valor a la carga hay un cuadro de selección, con el que se puede elegir darle o no un prefijo al valor de la carga para hacerla más pequeña <Br> Si no se seleccionó una dimensión o si la carga no tiene valor o es 0, aparecerá una notificación flotante indicándolo. La notificación desaparece después de 3 segundos.

Una vez que la carga ya tiene dimensión y magnitud es posible colocarla sobre el área de trabajo, para colocar una carga solo es necesario elegir su posición con el ratón y dar click sobre el área de trabajo, se creará un círculo representando la carga, si la carga es positiva, el círculo será rojo con un signo "**+**" en su interior, si la carga es negativa, el círuclo será azúl y con un signo "**-**". Al crear la carga se mantienen los datos del panel, de modo que es posible crear múltimples cargas con el mismo valor rápidamente. <BR>No es posible colocar una carga dentro o muy creca de otra e intentarlo resultará en una notificación flotante avisándolo.

  Al presionar el botón "Borrar carga" se mantendrá activado al presionarlo, volverlo a presionar lo desactiva, mientras esté activado, al presionar sobre una carga, esta será eliminada.<BR>El botón "Limpiar espacio" sirve para borrar todas las cargas de la pantalla.<BR> Cambiar de dimensión borra todas las cargas de la pantalla.

  El botón "Analizar Fuerza Neta" se qeuda activado al presionarlo
