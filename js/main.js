// RadarEmpleo · página de presentación
// Sin dependencias: menú, parallax del hero, apariciones al hacer scroll, cifras y pestañas.
(() => {
  'use strict';

  const raiz = document.documentElement;
  const movReducido = window.matchMedia('(prefers-reduced-motion: reduce)');
  const punteroFino = window.matchMedia('(pointer: fine) and (min-width: 1024px)');

  /* ---------- Menú en el móvil ---------- */
  const nav = document.querySelector('.nav');
  const botonMenu = document.querySelector('.nav-menu');
  const cerrarMenu = () => {
    nav.classList.remove('abierta');
    botonMenu.setAttribute('aria-expanded', 'false');
  };
  botonMenu.addEventListener('click', () => {
    const abierta = nav.classList.toggle('abierta');
    botonMenu.setAttribute('aria-expanded', String(abierta));
  });
  nav.querySelectorAll('.nav-enlaces a').forEach((a) => a.addEventListener('click', cerrarMenu));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('abierta')) {
      cerrarMenu();
      botonMenu.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('abierta') && !nav.contains(e.target)) cerrarMenu();
  });

  /* ---------- Enlace activo según la sección ---------- */
  const enlacesNav = [...document.querySelectorAll('.nav-enlaces a')];
  if ('IntersectionObserver' in window) {
    const obsSecciones = new IntersectionObserver((entradas) => {
      entradas.forEach((en) => {
        if (!en.isIntersecting) return;
        enlacesNav.forEach((a) => {
          const activo = a.getAttribute('href') === '#' + en.target.id;
          a.classList.toggle('activo', activo);
          if (activo) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['inicio', 'que-hace', 'por-que', 'como', 'hablamos'].forEach((id) => {
      const s = document.getElementById(id);
      if (s) obsSecciones.observe(s);
    });
  }

  /* ---------- Parallax del hero ---------- */
  const hero = document.querySelector('.hero');
  const contenidoHero = document.querySelector('.hero-contenido');
  const capas = [...hero.querySelectorAll('[data-prof]')].map((el) => ({ el, prof: parseFloat(el.dataset.prof) || 0 }));
  const raton = { x: 0, y: 0, ax: 0, ay: 0 };
  let pendiente = false;

  const limpiar = () => {
    capas.forEach(({ el }) => {
      el.style.removeProperty('--py');
      el.style.removeProperty('--mx');
      el.style.removeProperty('--my');
    });
    contenidoHero.style.transform = '';
    contenidoHero.style.opacity = '';
  };

  const pintar = () => {
    pendiente = false;
    if (movReducido.matches) { limpiar(); return; }
    const y = window.scrollY;
    const alto = hero.offsetHeight;
    if (y > alto * 1.3) return; // fuera de la vista: no hace falta mover nada

    // El ratón se suaviza para que no dé tirones
    raton.ax += (raton.x - raton.ax) * 0.08;
    raton.ay += (raton.y - raton.ay) * 0.08;

    capas.forEach(({ el, prof }) => {
      el.style.setProperty('--py', (-y * prof).toFixed(1) + 'px');
      el.style.setProperty('--mx', (raton.ax * prof * 40).toFixed(1) + 'px');
      el.style.setProperty('--my', (raton.ay * prof * 40).toFixed(1) + 'px');
    });
    const avance = Math.min(y / alto, 1);
    contenidoHero.style.transform = `translate3d(0, ${(y * 0.32).toFixed(1)}px, 0) scale(${(1 - avance * 0.06).toFixed(3)})`;
    contenidoHero.style.opacity = String(Math.max(0, 1 - avance * 1.25).toFixed(3));

    if (Math.abs(raton.x - raton.ax) > 0.002 || Math.abs(raton.y - raton.ay) > 0.002) pedir();
  };
  const pedir = () => {
    if (!pendiente) { pendiente = true; requestAnimationFrame(pintar); }
  };

  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir);
  hero.addEventListener('pointermove', (e) => {
    if (!punteroFino.matches) return;
    raton.x = e.clientX / window.innerWidth - 0.5;
    raton.y = e.clientY / window.innerHeight - 0.5;
    pedir();
  });
  hero.addEventListener('pointerleave', () => { raton.x = 0; raton.y = 0; pedir(); });
  movReducido.addEventListener('change', pedir);
  pedir();

  /* ---------- Pausar las animaciones en bucle ---------- */
  const botonPausa = document.querySelector('.pausar');
  const iconoPausa = botonPausa.querySelector('[aria-hidden]');
  botonPausa.addEventListener('click', () => {
    const pausado = raiz.classList.toggle('pausado');
    const texto = pausado ? 'Reanudar animaciones' : 'Pausar animaciones';
    botonPausa.setAttribute('aria-label', texto);
    botonPausa.title = texto;
    iconoPausa.textContent = pausado ? '▶' : '❚❚';
  });

  /* ---------- Apariciones y cifras ---------- */
  const formatear = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const contar = (el) => {
    const fin = parseInt(el.dataset.cuenta, 10);
    const prefijo = el.dataset.prefijo || '';
    if (movReducido.matches || !fin) return;
    const duracion = 1300;
    const inicio = performance.now();
    const paso = (ahora) => {
      const t = Math.min((ahora - inicio) / duracion, 1);
      const suave = 1 - Math.pow(1 - t, 3);
      el.textContent = prefijo + formatear(Math.round(fin * suave));
      if (t < 1) requestAnimationFrame(paso);
      else el.textContent = prefijo + formatear(fin);
    };
    requestAnimationFrame(paso);
  };

  const revelables = [...document.querySelectorAll('.revela')];
  if ('IntersectionObserver' in window && !movReducido.matches) {
    // Lo que ya está en pantalla (recarga a mitad, entrar con #ancla) se queda quieto.
    // Se espera a «load» y dos fotogramas: entonces el navegador ya ha devuelto el
    // scroll a donde estaba; hasta ese momento todo se ve sin animar. El salto a un
    // #ancla es suave y empieza después, así que con ancla se fija todo lo que queda
    // por encima de ella o en su misma pantalla.
    const enPantalla = (el) => {
      const r = el.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight;
    };
    const fijar = (el) => {
      el.classList.add('visible', 'ya-visible');
      el.querySelectorAll('[data-cuenta]').forEach((c) => {
        c.textContent = (c.dataset.prefijo || '') + formatear(parseInt(c.dataset.cuenta, 10));
      });
    };
    const empezar = () => {
      let id = '';
      try { id = decodeURIComponent(location.hash.slice(1)); } catch { /* ancla mal escrita */ }
      const ancla = id ? document.getElementById(id) : null;
      const limite = ancla ? ancla.getBoundingClientRect().top + window.innerHeight : -Infinity;
      const pendientes = revelables.filter((el) => {
        if (!enPantalla(el) && el.getBoundingClientRect().top >= limite) return true;
        fijar(el);
        return false;
      });
      // El contenido se ve sin esta clase; con ella, cada bloque entra animado al asomar
      raiz.classList.add('anima-revela');
      const obs = new IntersectionObserver((entradas) => {
        entradas.forEach((en) => {
          if (!en.isIntersecting) return;
          obs.unobserve(en.target);
          en.target.classList.add('visible');
          en.target.querySelectorAll('[data-cuenta]').forEach(contar);
        });
      }, { threshold: 0 });
      pendientes.forEach((el) => obs.observe(el));
    };
    const trasDosFotogramas = () => requestAnimationFrame(() => requestAnimationFrame(empezar));
    if (document.readyState === 'complete') trasDosFotogramas();
    else window.addEventListener('load', trasDosFotogramas, { once: true });
  } else {
    revelables.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- Pestañas de «Qué hace» ---------- */
  const lista = document.querySelector('[role="tablist"]');
  const pestanas = [...lista.querySelectorAll('[role="tab"]')];
  const paneles = pestanas.map((p) => document.getElementById(p.getAttribute('aria-controls')));

  const activar = (i, conFoco) => {
    const n = (i + pestanas.length) % pestanas.length;
    pestanas.forEach((p, j) => {
      const sel = j === n;
      p.setAttribute('aria-selected', String(sel));
      p.tabIndex = sel ? 0 : -1;
      paneles[j].hidden = !sel;
    });
    const panel = paneles[n];
    panel.classList.remove('entra');
    void panel.offsetWidth; // reinicia la animación
    panel.classList.add('entra');
    if (conFoco) pestanas[n].focus();
    // Que la pestaña elegida se vea dentro de la barra, sin mover la página
    const p = pestanas[n];
    const izq = p.offsetLeft - lista.offsetLeft;
    if (izq < lista.scrollLeft || izq + p.offsetWidth > lista.scrollLeft + lista.clientWidth) {
      lista.scrollLeft = izq - (lista.clientWidth - p.offsetWidth) / 2;
    }
  };
  const actual = () => pestanas.findIndex((p) => p.getAttribute('aria-selected') === 'true');

  pestanas.forEach((p, i) => {
    p.addEventListener('click', () => activar(i, false));
    p.addEventListener('keydown', (e) => {
      const teclas = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: pestanas.length - 1 };
      if (e.key in teclas) {
        e.preventDefault();
        activar(teclas[e.key], true);
      }
    });
  });
  document.querySelectorAll('[data-mover]').forEach((b) => {
    b.addEventListener('click', () => activar(actual() + parseInt(b.dataset.mover, 10), false));
  });

  /* ---------- Tablero claro / oscuro ---------- */
  const imgTablero = document.getElementById('img-tablero');
  const ampliarTablero = document.getElementById('ampliar-tablero');
  // La versión de caché (?v=…) de la imagen inicial vale también para la otra
  const versionTablero = new URL(imgTablero.src).search;
  document.querySelectorAll('.modo-boton').forEach((b) => {
    b.addEventListener('click', () => {
      const modo = b.dataset.modo;
      document.querySelectorAll('.modo-boton').forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
      const src = `img/tablero-${modo}.webp${versionTablero}`;
      imgTablero.src = src;
      imgTablero.alt = modo === 'claro' ? imgTablero.dataset.altClaro : imgTablero.dataset.altOscuro;
      ampliarTablero.href = src;
    });
  });
})();
