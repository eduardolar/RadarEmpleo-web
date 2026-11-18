# RadarEmpleo · página de presentación

## [→ Verla publicada: eduardolar.github.io/RadarEmpleo-web](https://eduardolar.github.io/RadarEmpleo-web/)

Web de una sola página para presentar [RadarEmpleo](https://github.com/eduardolar/RadarEmpleo).
HTML, CSS y JavaScript sin dependencias; las fuentes van alojadas en `fonts/`.

## Verla en local

```bash
python -m http.server 8090 --bind 127.0.0.1
```

y abrir http://127.0.0.1:8090/

## Estructura

- `index.html`: la página.
- `css/estilos.css`: estilos (identidad de `docs/DISENO.md` de la app).
- `js/main.js`: menú, parallax del hero, apariciones al hacer scroll, cifras y pestañas.
- `img/`: capturas en WebP (con datos de ejemplo) y el logo.
- `fonts/`: Bricolage Grotesque, JetBrains Mono y Roboto en woff2 (subconjunto latin), cada una
  con su licencia SIL OFL 1.1.

La carpeta `_capturas/` (capturas de la propia página para revisarla) está en `.gitignore`: se
queda en local y no se publica.

Los estilos, el script, las imágenes y las fuentes se enlazan con `?v=AAAAMMDD-N`: al cambiarlos,
sube la versión en `index.html` (y en las `url()` de las fuentes de `css/estilos.css`) para que
nadie vea la copia vieja de la caché. El tablero claro u oscuro toma la versión de la imagen inicial
(`main.js` la copia), así que basta con cambiarla en `index.html`.

## Publicar en GitHub Pages

Pages sirve la rama principal, carpeta raíz. Todas las rutas son relativas.
