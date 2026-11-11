# Micro:bit Heroes — Grado cuarto

Videojuego educativo de superhéroes para repasar la micro:bit, su matriz LED y botones, servomotor, acelerómetro y sensor PIR de movimiento, sensor de humedad del suelo, música y programación MakeCode.

## Juego

Abrir `index.html`. El código usa `bank.js` y no necesita base de datos ni Google Sheets.

- Cinco mundos con cinco villanos.
- Cuatro preguntas aleatorias por mundo tomadas de 12 preguntas diferentes; 60 en total.
- Un minijuego de combate entre cada pregunta: caminar A/D o flechas, saltar W/↑, poder con Espacio; controles táctiles incluidos.
- Calificación de 0,0 a 5,0 mostrada al final (20 preguntas, cada acierto = 0,25).
- Nombre, nota y comprobante disponibles al terminar. Solo la mejor nota se recuerda localmente en ese navegador.
- Sonidos generados localmente con Web Audio API. No hay registro remoto de estudiantes.

## Diferencia importante entre sensores

El acelerómetro es interno y detecta agitación o inclinación de **la tarjeta**. El sensor PIR es externo y detecta movimiento cercano de personas/animales. El sensor de humedad del suelo suele ser externo; para usarlo se debe probar el rango de lecturas del modelo específico.