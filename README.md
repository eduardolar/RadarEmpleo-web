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
- `js/main.js`: menú, parallax del hero, apariciones al hacer scroll, cifras, pestañas y vídeos.
- `video/`: los vídeos en bucle de la app (`inicio`, `tablero`, `radar`, `importar` y `movil`),
  cada uno en WebM y MP4 y con su póster en WebP.
- `img/`: las capturas que quedan (Estadísticas y dos del móvil, en WebP), el logo y la imagen
  para redes.
- `fonts/`: Bricolage Grotesque, JetBrains Mono y Roboto en woff2 (subconjunto latin), cada una
  con su licencia SIL OFL 1.1.

La carpeta `_capturas/` (capturas de la propia página para revisarla) está en `.gitignore`: se
queda en local y no se publica.

## Los vídeos

Están grabados con la app real funcionando en local, sobre una base de datos temporal con datos
inventados: las empresas, las ofertas, las fechas y los documentos son de ejemplo. No llevan audio.
Los de escritorio miden 1280×800 y el del móvil, 720×1558.

En la página no llevan `autoplay` ni `poster`: `main.js` reproduce cada vídeo solo mientras se ve
(y solo el de la pestaña activa) y lo pausa al salir de la pantalla; con «reducir movimiento» no
arranca ninguno solo. El póster va como fondo del propio `<video>` para que solo se descargue el
de los vídeos que se ven. Los `.gif` de la grabación no se publican.

Los estilos, el script, las imágenes, los vídeos y las fuentes se enlazan con `?v=AAAAMMDD-N`: al
cambiarlos, sube la versión en `index.html` (y en las `url()` de las fuentes de `css/estilos.css`)
para que nadie vea la copia vieja de la caché. Los pósters de los vídeos van en el `style` de cada
`<video>`, también con su `?v=`.

## Publicar en GitHub Pages

Pages sirve la rama principal, carpeta raíz. Todas las rutas son relativas.
