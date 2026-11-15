# RadarEmpleo · página de presentación

Web de una sola página para presentar [RadarEmpleo](https://github.com/eduardolar/RadarEmpleo).
HTML, CSS y JavaScript sin dependencias; solo carga las fuentes de Google Fonts.

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
- `_capturas/`: capturas de la propia página para revisarla; no hace falta publicarlas.

## Publicar en GitHub Pages

Subir el contenido de esta carpeta a un repositorio (sin `_capturas/` si no se quieren) y activar
Pages desde la rama principal, carpeta raíz. Todas las rutas son relativas.
