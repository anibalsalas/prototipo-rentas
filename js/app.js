/* Aplicación: plantilla única de página, barra, menú, rutas y pantallas globales.
   Las pantallas de negocio se registran en R.vistas['CON-01'] = function (ctx) { … }
   desde js/pantallas/*.js (etapas 3 a 6). Si no existe, se muestra la ficha de diseño. */
(function (R) {
  'use strict';
  var esc = R.esc, $ = function (s) { return document.querySelector(s); };
  R.vistas = R.vistas || {};
  var ESCALAS = [0.875, 1, 1.125, 1.25];

  /* =================== Barra superior =================== */
  function pintarBarra() {
    var perfil = R.perfilActual();
    var vivos = R.contarVivos(R.pendientes);
    $('#barra').innerHTML =
      '<button type="button" class="btn-barra btn-menu-movil" id="btn-menu-movil" aria-controls="menu" aria-expanded="false">' + R.icono('menu') + '<span>Menú</span></button>' +
      '<a class="barra__marca" href="#/inicio"><img src="img/logo-placeholder.svg" alt="Logo de la Municipalidad (marcador de posición)"><span>' + esc(R.config.sistema) + '</span></a>' +
      '<form class="barra__buscar" role="search" id="form-buscar"><label for="buscar-global" class="sr-only">Buscar módulo o pantalla</label>' +
      R.icono('buscar') + '<input id="buscar-global" type="search" placeholder="Buscar módulo o pantalla" autocomplete="off"></form>' +
      '<div class="barra__grupo">' +
      '<span class="barra__par"><label for="sel-ejercicio">Ejercicio</label><select id="sel-ejercicio">' + R.config.ejercicios.map(function (a) { return '<option' + (a === R.config.ejercicio ? ' selected' : '') + '>' + a + '</option>'; }).join('') + '</select></span>' +
      (R.cliente() ? usuarioBarra(perfil) :
      '<span class="barra__par"><label for="sel-perfil">Perfil</label><select id="sel-perfil">' + (perfil ? '' : '<option value="">Elegir…</option>') +
      R.perfiles.map(function (p) { return '<option value="' + p.id + '"' + (perfil && perfil.id === p.id ? ' selected' : '') + '>' + esc(p.nombre) + '</option>'; }).join('') + '</select></span>') +
      '<span role="group" aria-label="Tamaño del texto"><button type="button" class="btn-barra" id="btn-texto-menos" aria-label="Reducir tamaño del texto">A−</button> ' +
      '<button type="button" class="btn-barra" id="btn-texto-mas" aria-label="Aumentar tamaño del texto">A+</button></span>' +
      (R.cliente() ? '<button type="button" class="btn-barra" id="btn-salir">' + R.icono('salir') + 'Cerrar sesión</button>' :
      '<a class="btn-barra" href="#/pendientes">' + R.icono('rombo') + 'Pendientes <span class="contador" aria-label="' + vivos + ' abiertos">' + vivos + '</span></a>') +
      '</div>';
  }
  function usuarioBarra(perfil) {
    var s = R.sesion(), nombre = s && s.nombre ? s.nombre : 'Usuario de demostración';
    var ini = nombre.split(' ').map(function (x) { return x.charAt(0); }).join('').slice(0, 2).toUpperCase();
    return '<a class="barra__usuario" href="#/perfil" title="Ver o cambiar el perfil"><span class="avatar" aria-hidden="true">' + esc(ini) + '</span>' +
      '<span class="barra__usuario-txt"><strong>' + esc(nombre) + '</strong><span>' + esc(perfil ? perfil.nombre : 'Sin perfil') + '</span></span></a>';
  }

  /* =================== Menú lateral =================== */
  function pintarMenu(ctx) {
    var perfil = R.perfilActual(), colapsado = R.leer('menuColapsado', false);
    var menu = $('#menu');
    menu.classList.toggle('menu--colapsado', !!colapsado);
    var h = '<div class="menu__cabecera"><a class="btn btn--chico" href="#/inicio">' + R.icono('flechaIzq') + '<span class="menu__texto-btn">Inicio</span></a>' +
      '<button type="button" class="btn btn--chico btn--terciario btn-colapsar" id="btn-colapsar" aria-pressed="' + !!colapsado + '" aria-label="' + (colapsado ? 'Expandir menú' : 'Contraer menú') + '">' + R.icono(colapsado ? 'expandir' : 'colapsar') + '</button></div>';
    h += '<ul><li><a class="menu__item' + (ctx.ruta === 'inicio' ? ' activo' : '') + '" href="#/inicio" title="Inicio">' + R.icono('inicio') + '<span class="menu__texto">Inicio</span></a></li>' +
      (R.cliente() ? '' :
      '<li><a class="menu__item' + (ctx.ruta === 'pendientes' ? ' activo' : '') + '" href="#/pendientes" title="Panel de pendientes"' + (ctx.ruta === 'pendientes' ? ' aria-current="page"' : '') + '>' + R.icono('rombo') + '<span class="menu__texto">Panel de pendientes</span></a></li>' +
      '<li><a class="menu__item' + (ctx.ruta === 'cuestionario' ? ' activo' : '') + '" href="#/cuestionario" title="Cuestionario para la Municipalidad"' + (ctx.ruta === 'cuestionario' ? ' aria-current="page"' : '') + '>' + R.icono('info') + '<span class="menu__texto">Cuestionario para la Municipalidad</span></a></li>') + '</ul>';
    R.secciones.forEach(function (s) {
      h += '<div class="menu__grupo"><div class="menu__titulo" id="mg-' + s.id + '">' + esc(s.titulo) + '</div><ul aria-labelledby="mg-' + s.id + '">';
      R.modulos.filter(function (m) { return m.seccion === s.id; }).forEach(function (m) {
        var acc = R.acceso(m, perfil && perfil.id), activo = ctx.modulo && ctx.modulo.id === m.id;
        var motivo = acc === 'ninguno' ? R.motivoSinPermiso(m) : (acc === 'lectura' ? 'Solo consulta' : '');
        h += '<li><a class="menu__item' + (acc === 'ninguno' ? ' sin-permiso' : '') + (activo ? ' activo' : '') + '" href="#/' + m.id + '" title="' + esc(m.nombre + (motivo ? ' · ' + motivo : '')) + '"' +
          (activo && !ctx.pantalla ? ' aria-current="page"' : '') + '>' + R.icono(m.icono) + '<span class="menu__texto">' + esc(m.nombre) + '</span>' +
          (acc === 'ninguno' ? '<span class="menu__candado">' + R.icono('candado') + '</span><span class="sr-only">. ' + esc(motivo) + '</span>' : '') + '</a>';
        if (activo && m.pantallas.length > 1) {
          h += '<ul class="menu__sub">' + m.pantallas.map(function (p) {
            var act = ctx.pantalla && ctx.pantalla.id === p.id;
            return '<li><a class="menu__item' + (act ? ' activo' : '') + '" href="#/' + m.id + '/' + p.slug + '"' + (act ? ' aria-current="page"' : '') + '><span class="menu__texto">' + esc(p.nombre) + '</span></a></li>';
          }).join('') + '</ul>';
        }
        h += '</li>';
      });
      h += '</ul></div>';
    });
    menu.innerHTML = h;
  }

  /* =================== Plantilla única de página =================== */
  /* o: { migas:[{t,href}], titulo, pantallaId, incr, rf:[], subtitulo, para, acciones, contenido } */
  function pagina(o) {
    var h = '<nav class="migas" aria-label="Migas de pan"><ol>' + o.migas.map(function (m, i) {
      var ult = i === o.migas.length - 1;
      return '<li>' + (ult || !m.href ? '<span' + (ult ? ' aria-current="page"' : '') + '>' + esc(m.t) + '</span>' : '<a href="' + m.href + '">' + esc(m.t) + '</a>') + '</li>';
    }).join('') + '</ol></nav>';
    h += '<header class="encabezado"><div class="encabezado__titulo"><h1 id="titulo-pagina" tabindex="-1">' + esc(o.titulo) + '</h1>' +
      (R.cliente() ? '' : '<span class="encabezado__meta">' + (o.pantallaId ? '<span class="mono">' + esc(o.pantallaId) + '</span>' : '') +
      (o.incr && o.incr !== '—' ? R.insIncr(o.incr) : '') + (o.rf && o.rf.length ? '<span title="Requisitos que cubre">' + esc(o.rf.join(' · ')) + '</span>' : '') + '</span>') + '</div>' +
      (o.subtitulo ? '<p class="subtitulo">' + o.subtitulo + '</p>' : '') +
      '<p class="para-que">' + R.icono('info') + '<span><strong>Para qué sirve esta pantalla:</strong> ' + esc(o.para) + '</span></p></header>';
    if (o.acciones) h += '<div class="acciones" role="toolbar" aria-label="Acciones de la pantalla">' + o.acciones + '</div>';
    h += '<div class="cuerpo">' + o.contenido + '</div>';
    return h;
  }
  R.pagina = pagina;

  function pintarPie(pantallaId, etapa) {
    var vivos = pantallaId ? R.contarVivos(R.pendientesDePantalla(pantallaId)) : 0;
    if (R.cliente()) {
      $('#pie').innerHTML =
        '<span>Demostración con datos de ejemplo</span>' +
        '<span>Fecha de referencia: ' + R.fmt.fecha(R.config.fechaCorte) + '</span>' +
        '<span>Ámbito: ' + esc(R.config.ambito) + ' ' + R.pend('PE-003') + '</span>' +
        '<span class="pie__fin"><a href="#/glosario">Glosario</a></span>';
      return;
    }
    $('#pie').innerHTML =
      '<span>Estado: prototipo navegable' + (etapa ? ' · ' + esc(etapa) : '') + '</span>' +
      '<span>Fecha de corte: ' + R.fmt.fecha(R.config.fechaCorte) + '</span>' +
      '<span>Ámbito: ' + esc(R.config.ambito) + ' ' + R.pend('PE-003') + '</span>' +
      '<span class="ficticio">Cifras y personas ficticias</span>' +
      (pantallaId ? '<a href="#/pendientes?pantalla=' + esc(pantallaId) + '">' + R.icono('rombo') + ' ' + vivos + ' pendiente' + (vivos === 1 ? '' : 's') + ' de enero en esta pantalla</a>' : '') +
      '<span class="pie__fin"><a href="#/cuestionario">Cuestionario</a><a href="#/glosario">Glosario</a><a href="#/componentes">Componentes</a><span class="micro">v' + esc(R.config.version) + '</span></span>';
  }

  /* =================== Rutas =================== */
  function parsear() {
    var raw = (location.hash || '#/inicio').replace(/^#\/?/, '');
    var q = {}, partes = raw.split('?');
    if (partes[1]) partes[1].split('&').forEach(function (kv) { var a = kv.split('='); q[decodeURIComponent(a[0])] = decodeURIComponent(a[1] || ''); });
    var seg = partes[0].split('/').filter(Boolean);
    return { seg: seg, q: q, ruta: seg[0] || 'inicio' };
  }

  function render() {
    var r = parsear();
    if (r.q.como && R.perfilPorId(r.q.como)) { R._perfil = r.q.como; if (!R.cliente()) R.guardar('perfil', r.q.como); }
    var perfil = R.perfilActual();
    if (R.cliente() && (r.ruta === 'pendientes' || r.ruta === 'cuestionario')) { location.replace('#/inicio'); return; }
    if (!perfil && r.ruta !== 'perfil' && r.ruta !== 'ingreso') {
      location.replace((R.cliente() ? '#/ingreso' : '#/perfil') + '?volver=' + encodeURIComponent(location.hash.replace(/^#\/?/, '') || 'inicio')); return;
    }
    R._tablas = {};
    var ctx = { ruta: r.ruta, q: r.q, seg: r.seg, perfil: perfil, modulo: null, pantalla: null };
    var out, sinMenu = false, pantallaPie = null, etapa = 'etapa 2';
    var GLOBAL = { ingreso: vIngreso, perfil: vPerfil, inicio: vInicio, pendientes: vPendientes, cuestionario: vNecesitamos, glosario: vGlosario, componentes: vComponentes, error: vError };
    if (GLOBAL[r.ruta]) {
      out = GLOBAL[r.ruta](ctx);
      sinMenu = r.ruta === 'perfil' || r.ruta === 'inicio' || r.ruta === 'ingreso';
      pantallaPie = ({ perfil: 'GEN-01', inicio: 'GEN-02', pendientes: 'GEN-03', glosario: 'GEN-04', componentes: 'GEN-06', error: 'GEN-05', ingreso: 'GEN-07', cuestionario: 'GEN-08' })[r.ruta];
    } else {
      var m = R.modulo(r.ruta);
      if (!m) { out = vError(ctx, 'no-encontrado'); pantallaPie = 'GEN-05'; }
      else {
        ctx.modulo = m;
        var slug = r.seg[1] || (m.pantallas.length === 1 ? m.pantallas[0].slug : null);
        var p = slug ? m.pantallas.filter(function (x) { return x.slug === slug; })[0] : null;
        ctx.param = r.seg[2] || null;
        if (slug && !p) { out = vError(ctx, 'no-encontrado'); pantallaPie = 'GEN-05'; }
        else if (!p) { out = vPortada(ctx); }
        else { ctx.pantalla = p; out = vPantalla(ctx); pantallaPie = p.id; etapa = R.vistas[p.id] ? 'diseñada en la etapa ' + p.etapa : 'se diseña en la etapa ' + p.etapa; }
      }
    }
    document.querySelector('.marco').classList.toggle('marco--sin-menu', sinMenu);
    document.body.classList.toggle('en-ingreso', r.ruta === 'ingreso');
    pintarBarra();
    if (!sinMenu) pintarMenu(ctx);
    $('#principal').innerHTML = out.html;
    pintarPie(pantallaPie, etapa);
    R.montarTablas();
    if (out.despues) out.despues();
    envolverTablas();
    document.title = out.titulo + (R.cliente() ? ' · Sistema de Rentas (demostración)' : ' · Rentas (prototipo, equipo)');
    cerrarMenuMovil();
    var h1 = $('#titulo-pagina');
    if (h1 && R._yaInicio) h1.focus();
    $('#vivo').textContent = out.titulo;
    R._yaInicio = true;
    window.scrollTo(0, 0);
  }
  R.render = render;

  /* Toda tabla sin contenedor propio se envuelve para que se desplace dentro de sí misma en pantallas angostas. */
  function envolverTablas() {
    document.querySelectorAll('#principal table').forEach(function (t) {
      if (t.closest('.tabla-marco, .tabla-desplazable')) return;
      var w = document.createElement('div'); w.className = 'tabla-desplazable';
      t.parentNode.insertBefore(w, t); w.appendChild(t);
    });
  }
  if (window.MutationObserver) {
    var pendienteEnvolver = false;
    new MutationObserver(function () {
      if (pendienteEnvolver) return; pendienteEnvolver = true;
      setTimeout(function () { pendienteEnvolver = false; envolverTablas(); }, 0);
    }).observe(document.getElementById('principal') || document.body, { childList: true, subtree: true });
  }

  /* =================== GEN-07 Ingreso al sistema =================== */
  /* Usuarios de demostración: personas ficticias. En el sistema real la identidad la valida el servidor
     (contraseña con hash, segundo factor y bloqueo por intentos); aquí no se guarda ninguna contraseña. */
  var USUARIOS_DEMO = [
    { usuario: 'operador.demo', nombre: 'Olga Demo', perfil: 'operador' },
    { usuario: 'cajero.demo', nombre: 'Carlos Ejemplo', perfil: 'cajero' },
    { usuario: 'fiscal.demo', nombre: 'Fiorella Prueba', perfil: 'fiscalizador' },
    { usuario: 'coactivo.demo', nombre: 'Elmer Demo', perfil: 'ejecutor' },
    { usuario: 'supervisor.demo', nombre: 'Sara Ejemplo', perfil: 'supervisor' },
    { usuario: 'gerencia.demo', nombre: 'Gabriel Prueba', perfil: 'gerencia' },
    { usuario: 'admin.demo', nombre: 'Andrea Demo', perfil: 'admin' },
    { usuario: 'auditor.demo', nombre: 'Aurelio Ejemplo', perfil: 'auditor' }
  ];
  R.usuariosDemo = USUARIOS_DEMO;
  function vIngreso(ctx) {
    var volver = ctx.q.volver || 'inicio';
    var html = '<div class="ingreso">' +
      '<section class="ingreso__marca" aria-label="Presentación del sistema"><div class="ingreso__marca-in">' +
        '<img class="ingreso__logo" src="img/logo-placeholder.svg" alt="Logo de la Municipalidad (marcador de posición)">' +
        '<p class="ingreso__entidad">Municipalidad Provincial de Utcubamba</p>' +
        '<p class="ingreso__sistema">' + esc(R.config.sistema) + '</p>' +
        '<ul class="ingreso__puntos">' +
          '<li>' + R.icono('libro') + '<span>Estado de cuenta claro, con cada pago y cada interés explicados.</span></li>' +
          '<li>' + R.icono('candado') + '<span>Cada persona ve solo lo que su cargo le permite, y todo queda registrado.</span></li>' +
          '<li>' + R.icono('chispa') + '<span>Asistencia con IA que sugiere y nunca decide sola.</span></li>' +
        '</ul>' +
        '<p class="ingreso__nota">Demostración con datos de ejemplo</p>' +
      '</div></section>' +
      '<section class="ingreso__panel" aria-labelledby="titulo-pagina"><div class="ingreso__tarjeta">' +
        '<h1 id="titulo-pagina" tabindex="-1">Ingresar al sistema</h1>' +
        '<p class="texto-2" id="ing-sub">Usa tu usuario institucional.</p>' +
        '<div id="ing-error" class="ingreso__error" role="alert" hidden></div>' +
        '<form id="form-ingreso" novalidate>' +
          '<div id="paso-credenciales">' +
            '<div class="campo"><label for="ing-usuario">Usuario</label><div class="ingreso__control">' + R.icono('persona') +
              '<input id="ing-usuario" name="usuario" autocomplete="username" autocapitalize="none" spellcheck="false" required aria-describedby="ing-ayuda-u"></div>' +
              '<span class="ayuda" id="ing-ayuda-u">Por ejemplo: cajero.demo</span></div>' +
            '<div class="campo"><label for="ing-clave">Contraseña</label><div class="ingreso__control">' + R.icono('candado') +
              '<input id="ing-clave" name="clave" type="password" autocomplete="current-password" required aria-describedby="ing-ayuda-c">' +
              '<button type="button" class="ingreso__ver" id="ing-ver" aria-pressed="false" aria-controls="ing-clave">Mostrar</button></div>' +
              '<span class="ayuda" id="ing-ayuda-c">En la demostración sirve cualquier contraseña de 8 caracteres o más.</span></div>' +
            '<div class="ingreso__fila"><a href="#/ingreso" id="ing-olvido">¿Olvidaste tu contraseña?</a></div>' +
            '<button type="submit" class="btn btn--primario ingreso__boton" id="ing-continuar">Continuar</button>' +
          '</div>' +
          '<div id="paso-codigo" hidden>' +
            '<p class="pequeno" id="ing-para"></p>' +
            '<div class="campo"><label for="ing-codigo">Código de verificación</label>' +
              '<input id="ing-codigo" class="ingreso__codigo" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" aria-describedby="ing-ayuda-cod">' +
              '<span class="ayuda" id="ing-ayuda-cod">Seis dígitos enviados a tu correo institucional. En la demostración sirve cualquier código de 6 dígitos.</span></div>' +
            '<button type="submit" class="btn btn--primario ingreso__boton" id="ing-entrar">Ingresar</button>' +
            '<button type="button" class="btn btn--terciario ingreso__boton" id="ing-atras">' + R.icono('flechaIzq') + 'Volver</button>' +
          '</div>' +
        '</form>' +
        '<details class="ingreso__demo" open><summary>Usuarios de demostración</summary>' +
          '<p class="micro">Elige uno para completar el usuario y la contraseña. Cada usuario tiene un perfil distinto.</p>' +
          '<ul>' + USUARIOS_DEMO.map(function (u) {
            var pf = R.perfilPorId(u.perfil);
            return '<li><button type="button" class="ingreso__chip" data-usuario-demo="' + u.usuario + '"><strong>' + esc(pf.nombre) + '</strong><span>' + esc(u.usuario) + '</span></button></li>';
          }).join('') + '</ul></details>' +
        '<p class="micro ingreso__pie">Tu sesión se cierra al cerrar esta pestaña. El sistema no guarda contraseñas en el navegador.</p>' +
      '</div></section></div>';
    return { titulo: 'Ingresar al sistema', html: html, despues: function () {
      var paso = 1, elegido = null;
      var err = $('#ing-error');
      function error(t) { err.textContent = t; err.hidden = !t; }
      function buscar(u) { u = (u || '').trim().toLowerCase(); return USUARIOS_DEMO.filter(function (x) { return x.usuario === u; })[0]; }
      $('#ing-ver').addEventListener('click', function () {
        var c = $('#ing-clave'), ver = c.type === 'password';
        c.type = ver ? 'text' : 'password'; this.textContent = ver ? 'Ocultar' : 'Mostrar'; this.setAttribute('aria-pressed', String(ver));
      });
      $('#ing-olvido').addEventListener('click', function (e) { e.preventDefault(); R.avisar('info', 'Recuperar contraseña', 'En el sistema real se envía un enlace al correo institucional registrado.'); });
      document.querySelectorAll('[data-usuario-demo]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (paso === 2) irPaso(1);
          $('#ing-usuario').value = b.getAttribute('data-usuario-demo'); $('#ing-clave').value = 'demostracion';
          error(''); $('#ing-continuar').focus();
        });
      });
      function irPaso(n) {
        paso = n;
        $('#paso-credenciales').hidden = n !== 1; $('#paso-codigo').hidden = n !== 2;
        $('#ing-sub').textContent = n === 1 ? 'Usa tu usuario institucional.' : 'Paso 2 de 2: confirma que eres tú.';
        if (n === 2) { $('#ing-codigo').value = ''; $('#ing-codigo').focus(); } else $('#ing-usuario').focus();
      }
      $('#ing-atras').addEventListener('click', function () { error(''); irPaso(1); });
      $('#ing-codigo').addEventListener('input', function () { this.value = this.value.replace(/\D/g, '').slice(0, 6); });
      $('#form-ingreso').addEventListener('submit', function (e) {
        e.preventDefault();
        if (paso === 1) {
          var u = $('#ing-usuario').value, c = $('#ing-clave').value;
          if (!u.trim() || !c) { error('Escribe tu usuario y tu contraseña.'); (u.trim() ? $('#ing-clave') : $('#ing-usuario')).focus(); return; }
          elegido = buscar(u);
          if (!elegido || c.length < 8) { error('El usuario o la contraseña no son correctos.'); $('#ing-clave').focus(); return; }
          error(''); $('#ing-para').textContent = 'Enviamos un código de 6 dígitos al correo de ' + elegido.nombre + ' (ficticio).';
          irPaso(2); return;
        }
        var cod = $('#ing-codigo').value;
        if (!/^[0-9]{6}$/.test(cod)) { error('El código tiene 6 dígitos.'); $('#ing-codigo').focus(); return; }
        R.fijarSesion({ usuario: elegido.usuario, nombre: elegido.nombre, perfil: elegido.perfil });
        R._perfil = elegido.perfil;
        location.hash = '#/' + (volver.indexOf('ingreso') === 0 || volver.indexOf('perfil') === 0 ? 'inicio' : volver);
        R.avisar('exito', 'Hola, ' + elegido.nombre, 'Ingresaste con el perfil ' + R.perfilPorId(elegido.perfil).nombre + '.');
      });
      if (ctx.q.salio) R.avisar('info', 'Sesión cerrada', 'Puedes volver a ingresar cuando quieras.');
      $('#ing-usuario').focus();
    } };
  }

  function cerrarSesion() {
    R.fijarSesion(null); R._perfil = null;
    location.hash = '#/ingreso?salio=1';
  }

  /* =================== GEN-01 Selector de perfil =================== */
  function vPerfil(ctx) {
    var actual = R.perfilActual();
    var g = R.pantalla('GEN-01').pantalla;
    var html = pagina({
      migas: [{ t: 'Inicio', href: '#/inicio' }, { t: 'Perfil' }], titulo: 'Elige tu perfil', pantallaId: 'GEN-01', incr: g.incr, rf: g.rf,
      subtitulo: 'El perfil cambia las tarjetas, el menú y las acciones que verás.',
      para: g.para,
      contenido: R.aviso('info', 'Es una demostración', 'En el sistema real los permisos los decide el servidor por acción, recurso y ámbito. Aquí el perfil solo cambia lo que se ve. Los nombres de los perfiles se confirman en enero ' + R.pend('PE-002') + '.') +
        '<ul class="perfiles" style="margin-top:var(--s-5)">' + R.perfiles.map(function (p) {
          return '<li><button type="button" class="panel perfil-op" data-perfil="' + p.id + '" aria-pressed="' + !!(actual && actual.id === p.id) + '">' +
            '<h2>' + esc(p.nombre) + '</h2>' + (p.añadido ? (R.cliente() ? '' : '<span class="insignia insignia--info">Añadido por el diseño</span> ') + R.pend('PE-005') : '') +
            '<p class="pequeno texto-2" style="margin-top:var(--s-2)">' + esc(p.descripcion) + '</p>' +
            '<p class="pequeno"><strong>Puede:</strong> ' + esc(p.puede.join('; ')) + '.</p>' +
            '<p class="pequeno" style="margin:0"><strong>No puede:</strong> ' + esc(p.noPuede.join('; ')) + '.</p>' +
            (p.nota ? '<p class="micro" style="margin:var(--s-2) 0 0">' + esc(p.nota) + '</p>' : '') + '</button></li>';
        }).join('') + '</ul>'
    });
    return { titulo: 'Elige tu perfil', html: html };
  }

  /* =================== GEN-02 Inicio =================== */
  function vInicio(ctx) {
    var perfil = ctx.perfil, g = R.pantalla('GEN-02').pantalla, q = ctx.q.q || '';
    var vivos = R.contarVivos(R.pendientes);
    var flujo = '<section class="flujo" aria-labelledby="t-flujo"><div class="flujo__titulo"><h2 id="t-flujo">Flujo central</h2>' +
      '<span class="pequeno texto-2">' + (R.cliente() ? 'Recorrido completo con una contribuyente de ejemplo' : 'Con la contribuyente ficticia Ana Prueba Quispe (CTB-000101)') + '</span></div><ol>' +
      R.flujo.map(function (f) {
        var m = R.modulo(f.modulo), acc = R.acceso(m, perfil.id);
        var motivo = acc === 'ninguno' ? R.motivoSinPermiso(m) : '';
        return '<li><a class="paso' + (acc === 'ninguno' ? ' sin-permiso' : '') + '" href="#/' + f.ruta + '"' + (motivo ? ' title="' + esc(motivo) + '"' : '') + '>' +
          '<span class="paso__n" aria-hidden="true">' + f.n + '</span>' + esc(f.nombre) + (motivo ? R.icono('candado') + '<span class="sr-only">. ' + esc(motivo) + '</span>' : '') + '</a></li>';
      }).join('') + '</ol></section>';

    var secciones = R.secciones.map(function (s) {
      var mods = R.modulos.filter(function (m) { return m.seccion === s.id; });
      return '<section class="seccion-inicio" data-seccion="' + s.id + '" aria-labelledby="sec-' + s.id + '"><h2 id="sec-' + s.id + '">' + esc(s.titulo) +
        (s.id === 'ia' ? ' <span class="insignia insignia--ia">' + R.icono('chispa') + 'Siempre con revisión humana</span>' : '') + '</h2>' +
        '<p>' + esc(s.desc) + '</p><ul class="cards">' + mods.map(function (m) { return tarjeta(m, perfil); }).join('') + '</ul></section>';
    }).join('');

    var html = pagina({
      migas: [{ t: 'Inicio' }], titulo: 'Inicio', pantallaId: 'GEN-02', incr: g.incr, rf: g.rf,
      subtitulo: (R.cliente() && R.sesion() ? 'Hola, ' + esc(R.sesion().nombre) + '. Ingresaste con el perfil <strong>' + esc(perfil.nombre) + '</strong>. <a href="#/ingreso">Ingresar con otro usuario</a>'
        : 'Buenos días. Estás usando el perfil <strong>' + esc(perfil.nombre) + '</strong>. <a href="#/perfil">Cambiar perfil</a>'),
      para: g.para,
      acciones: '<a class="btn btn--primario" href="#/cuenta/estado/' + R.config.contribuyenteDemo + '">' + R.icono('libro') + 'Ir al estado de cuenta</a>' +
        (R.cliente() ? '' : '<a class="btn" href="#/pendientes">' + R.icono('rombo') + 'Panel de pendientes (' + vivos + ')</a><a class="btn" href="#/cuestionario">' + R.icono('info') + 'Cuestionario</a>') +
        '<a class="btn btn--terciario" href="#/glosario">Glosario</a>',
      contenido:
        '<div class="bienvenida"><div class="bienvenida__fila"><span>Ámbito: ' + esc(R.config.ambito) + ' ' + R.pend('PE-003') + '</span>' +
        '<span>Ejercicio ' + R.config.ejercicio + '</span><span>' + (R.cliente() ? 'Fecha de referencia ' : 'Fecha de corte ') + R.fmt.fecha(R.config.fechaCorte) + '</span>' + R.ficticio() +
        '<span>Logo y colores ' + (R.cliente() ? 'oficiales ' : 'provisionales ') + R.pend('PE-001') + '</span></div>' +
        '<div class="buscador-inicio"><label for="buscar-inicio" class="sr-only">Buscar módulo o pantalla</label>' + R.icono('buscar') +
        '<input id="buscar-inicio" type="search" placeholder="Buscar módulo o pantalla (por ejemplo: recibo, REC, DJ)" value="' + esc(q) + '" aria-describedby="buscar-estado" autocomplete="off"></div>' +
        '<p id="buscar-estado" class="pequeno texto-2" aria-live="polite" style="margin:0"></p><div id="coincidencias" class="coincidencias"></div></div>' +
        flujo + '<div id="secciones-inicio">' + secciones + '</div>' +
        '<div id="sin-resultados" hidden>' + R.estadoVacio('buscar', 'No encontramos módulos con ese texto', 'Prueba con otra palabra, por ejemplo «caja», «predio» o «coactivo».') + '</div>'
    });
    return { titulo: 'Inicio', html: html, despues: function () {
      var inp = $('#buscar-inicio');
      inp.addEventListener('input', function () { filtrarInicio(inp.value); });
      if (q) { filtrarInicio(q); inp.focus(); }
    } };
  }

  function tarjeta(m, perfil) {
    var acc = R.acceso(m, perfil.id), pend = R.contarVivos(R.pendientesDeModulo(m)), n = m.pantallas.length;
    var cls = 'card' + (acc === 'ninguno' ? ' card--sin-permiso' : '') + (m.estado === 'ia' ? ' card--ia' : '') + (m.estado === 'confirmar' ? ' card--confirmar' : '');
    return '<li data-modulo="' + m.id + '" data-texto="' + esc(R.normalizar([m.nombre, m.desc, m.sinonimos].concat(m.pantallas.map(function (p) { return p.nombre + ' ' + p.id; })).join(' '))) + '">' +
      '<a class="' + cls + '" href="#/' + m.id + '">' +
      '<span class="card__atenuable"><span class="card__icono">' + R.icono(m.icono, 'icono-lg') + '</span></span>' +
      '<span class="card__atenuable card__nombre">' + esc(m.nombre) + '</span>' +
      '<span class="card__atenuable card__desc">' + esc(m.desc) + '</span>' +
      '<span class="card__atenuable card__meta">' + (R.cliente() ? '' : '<span>' + n + ' pantalla' + (n === 1 ? '' : 's') + '</span>') + R.insIncr(m.incr) + R.insEstadoModulo(m.estado) +
      (acc === 'lectura' ? '<span class="insignia insignia--lectura">Solo consulta</span>' : '') + '</span>' +
      (R.cliente() ? '' : '<span class="card__pend' + (pend ? '' : ' card__pend--cero') + '">' + R.icono('rombo') + pend + ' pendiente' + (pend === 1 ? '' : 's') + ' de enero</span>') +
      (acc === 'ninguno' ? '<span class="card__motivo">' + R.icono('candado') + esc(R.motivoSinPermiso(m)) + '</span>' : '') +
      '</a></li>';
  }

  function filtrarInicio(texto) {
    var t = R.normalizar(texto.trim()), visibles = 0;
    document.querySelectorAll('#secciones-inicio [data-modulo]').forEach(function (li) {
      var ok = !t || li.getAttribute('data-texto').indexOf(t) >= 0;
      li.hidden = !ok; if (ok) visibles++;
    });
    document.querySelectorAll('#secciones-inicio .seccion-inicio').forEach(function (s) {
      s.hidden = !s.querySelector('[data-modulo]:not([hidden])');
    });
    $('#sin-resultados').hidden = visibles > 0;
    var coinc = $('#coincidencias'), estado = $('#buscar-estado');
    if (!t) { coinc.innerHTML = ''; estado.textContent = ''; return; }
    var pant = [];
    R.modulos.forEach(function (m) { m.pantallas.forEach(function (p) {
      if (R.normalizar(p.nombre + ' ' + p.id + ' ' + p.para + ' ' + m.sinonimos).indexOf(t) >= 0) pant.push({ m: m, p: p });
    }); });
    estado.textContent = visibles + ' módulo' + (visibles === 1 ? '' : 's') + ' y ' + pant.length + ' pantalla' + (pant.length === 1 ? '' : 's') + ' coinciden con «' + texto.trim() + '».';
    coinc.innerHTML = pant.length ? '<h2 class="pequeno" style="font-size:var(--t-etiqueta)">Pantallas que coinciden</h2>' + pant.slice(0, 12).map(function (x) {
      return '<a href="#/' + x.m.id + '/' + x.p.slug + '"><span class="mono micro">' + x.p.id + '</span> ' + esc(x.p.nombre) + ' <span class="micro">· ' + esc(x.m.nombre) + '</span></a>';
    }).join('') : '';
  }

  /* =================== Portada de módulo =================== */
  function vPortada(ctx) {
    var m = ctx.modulo, acc = R.acceso(m, ctx.perfil.id), s = R.seccion(m.seccion);
    var avisoAcc = acc === 'ninguno'
      ? R.aviso('alerta', 'Tu perfil no puede usar este módulo', esc(R.motivoSinPermiso(m)) + '. Tu perfil actual: ' + esc(ctx.perfil.nombre) + '. Puedes ver qué contiene, pero no abrir sus pantallas. <a href="#/perfil">Cambiar perfil</a>')
      : acc === 'lectura' ? R.aviso('info', 'Solo consulta', 'Con tu perfil puedes ver la información de este módulo, pero sus acciones aparecen deshabilitadas.') : '';
    var filas = m.pantallas.map(function (p) {
      var pv = R.contarVivos(R.pendientesDePantalla(p.id));
      return { id: p.id, nombre: p.nombre, para: p.para, incr: p.incr, rf: p.rf.join(', '), pend: pv, etapa: p.etapa, slug: p.slug, sensible: p.sensible };
    });
    var tabla = R.tabla('pantallas-' + m.id, {
      caption: 'Pantallas del módulo ' + m.nombre, porPagina: 10, filas: filas,
      columnas: (R.cliente() ? [] : [
        { clave: 'id', titulo: 'ID', orden: true, render: function (f) { return '<span class="mono">' + f.id + '</span>'; } }]).concat([
        { clave: 'nombre', titulo: 'Pantalla', orden: true, render: function (f) {
          return (acc === 'ninguno' ? esc(f.nombre) + ' <span class="micro">' + R.icono('candado') + '</span>' : '<a href="#/' + m.id + '/' + f.slug + '">' + esc(f.nombre) + '</a>') +
            (f.sensible ? ' <span class="insignia insignia--error" title="Acción sensible: confirmación y auditoría">Sensible</span>' : ''); } },
        { clave: 'para', titulo: 'Para qué sirve' }]).concat(R.cliente() ? [] : [
        { clave: 'incr', titulo: 'Incremento', orden: true, render: function (f) { return R.insIncr(f.incr); } },
        { clave: 'rf', titulo: 'Requisitos', render: function (f) { return '<span class="micro">' + esc(f.rf) + '</span>'; } },
        { clave: 'pend', titulo: 'Pendientes', tipo: 'num', orden: true, render: function (f) { return f.pend ? '<a href="#/pendientes?pantalla=' + f.id + '">' + f.pend + '</a>' : '0'; } },
        { clave: 'etapa', titulo: 'Diseño', orden: true, render: function (f) { return R.vistas[f.id] ? R.ins('Diseñada', 'exito') : R.ins('Etapa ' + f.etapa, 'neutra'); } }
      ])
    });
    var pend = R.pendientesDeModulo(m);
    var html = pagina({
      migas: [{ t: 'Inicio', href: '#/inicio' }, { t: s.titulo }, { t: m.nombre }], titulo: m.nombre, incr: m.incr,
      subtitulo: esc(m.desc), para: R.cliente() ? 'Ver qué pantallas tiene este módulo, para qué sirve cada una y quién lo usa.' : 'Ver las pantallas de ' + m.nombre.toLowerCase() + ', qué requisitos cubren y qué falta confirmar.',
      acciones: (acc !== 'ninguno' ? '<a class="btn btn--primario" href="#/' + m.id + '/' + m.pantallas[0].slug + '">Abrir ' + esc(m.pantallas[0].nombre.toLowerCase()) + '</a>' : '<a class="btn btn--primario" href="#/perfil">Cambiar perfil</a>') +
        (R.cliente() ? '' : '<a class="btn" href="#/pendientes?modulo=' + m.id + '">' + R.icono('rombo') + 'Pendientes del módulo (' + R.contarVivos(pend) + ')</a>') +
        '<span class="acciones__fin">' + R.insEstadoModulo(m.estado) + '</span>',
      contenido: avisoAcc + '<section class="panel" aria-labelledby="t-pant"><h2 id="t-pant">Pantallas</h2>' + tabla + '</section>' +
        '<section class="panel" aria-labelledby="t-perm"><h2 id="t-perm">Quién lo usa</h2><p class="pequeno">' +
        '<strong>Acceso completo:</strong> ' + (m.total.length ? m.total.map(function (id) { return esc(R.perfilPorId(id).nombre); }).join(', ') : (R.cliente() ? 'por definir' : 'ninguno en el prototipo')) + '.<br>' +
        '<strong>Solo consulta:</strong> ' + (m.lectura.length ? m.lectura.map(function (id) { return esc(R.perfilPorId(id).nombre); }).join(', ') : 'ninguno') + '.</p>' +
        '<p class="micro" style="margin:0">' + (R.cliente() ? 'Los permisos se configuran por cargo. Además de ocultar opciones, el sistema valida cada acción antes de ejecutarla.' : 'Asignación de demostración. Ocultar o atenuar el menú no reemplaza el control de acceso del servidor.') + '</p></section>'
    });
    return { titulo: m.nombre, html: html };
  }

  /* =================== Especificación para desarrollo (solo vista equipo) =================== */
  function specBloque(p) {
    if (R.cliente()) return '';
    var sp = (R.specs || {})[p.id];
    var lista = function (t, arr) { return arr && arr.length ? '<h3 style="margin-top:var(--s-3)">' + t + '</h3><ul class="lista-simple pequeno">' + arr.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : ''; };
    var pend = R.pendientesDePantalla(p.id);
    var cuerpo = !sp ? '<p class="pequeno texto-2">Especificación detallada por completar. Requisitos: ' + esc(p.rf.join(', ')) + '.</p>' :
      R.dl([['Requisitos', esc(p.rf.join(', '))], ['Caso de uso', esc(sp.uc || '—')], ['Reglas de negocio', esc((sp.rn || []).join(', ') || '—')], ['Incremento', esc(p.incr)]]) +
      '<h3 style="margin-top:var(--s-3)">API</h3><table><thead><tr><th scope="col">Operación</th><th scope="col">Método y ruta</th><th scope="col">Estado</th></tr></thead><tbody>' +
      sp.api.map(function (a) { return '<tr><td class="mono">' + esc(a[0]) + '</td><td class="mono">' + esc(a[1]) + '</td><td>' + (a[2] === 'contrato' ? R.ins('En contracts/openapi.yaml', 'exito') : R.ins('Propuesto: agregar al contrato', 'alerta')) + '</td></tr>'; }).join('') + '</tbody></table>' +
      lista('Tablas (data/modelo.dbml)', sp.datos) + lista('Permisos (docs/08)', sp.permisos) + lista('Validaciones y reglas que programar', sp.validaciones) +
      lista('Estados', sp.estados) + lista('Pruebas de aceptación', sp.pruebas) + (sp.notas ? '<p class="pequeno" style="margin-top:var(--s-3)"><strong>Notas:</strong> ' + esc(sp.notas) + '</p>' : '');
    return '<details class="desplegable spec-dev"><summary>' + R.icono('engranaje') + ' Especificación para desarrollo · ' + esc(p.id) + '</summary><div>' + cuerpo +
      (pend.length ? lista('Pendientes que condicionan esta pantalla', pend.map(function (x) { return x.id + ' · ' + x.descripcion + ' (' + x.fuente + ')'; })) : '') + '</div></details>';
  }

  /* =================== Pantalla de negocio =================== */
  function vPantalla(ctx) {
    var m = ctx.modulo, p = ctx.pantalla, acc = R.acceso(m, ctx.perfil.id), s = R.seccion(m.seccion);
    ctx.acceso = acc;
    var migas = m.pantallas.length > 1
      ? [{ t: 'Inicio', href: '#/inicio' }, { t: m.nombre, href: '#/' + m.id }, { t: p.nombre }]
      : [{ t: 'Inicio', href: '#/inicio' }, { t: s.titulo }, { t: p.nombre }];
    if (acc === 'ninguno') {
      return { titulo: p.nombre, html: pagina({ migas: migas, titulo: p.nombre, pantallaId: p.id, incr: p.incr, rf: p.rf, para: p.para,
        contenido: '<div class="panel">' + R.estadoVacio('candado', 'Esta pantalla requiere otro perfil',
          esc(R.motivoSinPermiso(m)) + '. Tu perfil actual: <strong>' + esc(ctx.perfil.nombre) + '</strong>. ' + (R.cliente() ? 'El sistema bloquea el acceso aunque se intente entrar por otro camino.' : 'En el sistema real, el servidor respondería «sin permiso» aunque se escriba la dirección directamente.'),
          '<a class="btn btn--primario" href="#/perfil">Cambiar perfil</a> <a class="btn" href="#/inicio">Volver a Inicio</a>') + '</div>' +
          R.bloquePendientes(p.id) }) };
    }
    var vista = R.vistas[p.id];
    if (vista) {
      var v = vista(ctx) || {};
      return { titulo: v.titulo || p.nombre, despues: v.despues, html: pagina({ migas: migas, titulo: v.titulo || p.nombre, pantallaId: p.id, incr: p.incr, rf: p.rf,
        subtitulo: v.subtitulo, para: p.para, acciones: v.acciones, contenido: (acc === 'lectura' && m.seccion !== 'alc' ? R.aviso('info', 'Solo consulta', 'Tu perfil puede ver esta pantalla; las acciones que cambian datos están deshabilitadas.') : '') + v.contenido + specBloque(p) }) };
    }
    /* Ficha de diseño (pantalla aún no diseñada en detalle) */
    if (R.cliente()) {
      return { titulo: p.nombre, html: pagina({ migas: migas, titulo: p.nombre, para: p.para,
        acciones: (m.pantallas.length > 1 ? '<a class="btn" href="#/' + m.id + '">' + R.icono('flechaIzq') + 'Volver a ' + esc(m.nombre) + '</a>' : '') + '<a class="btn btn--terciario" href="#/inicio">Volver a Inicio</a>',
        contenido: '<div class="panel">' + R.estadoVacio('documento', 'Pantalla en preparación', 'Esta pantalla se mostrará completa en la próxima versión de la demostración.') + '</div>' + R.bloquePendientes(p.id) }) };
    }
    var html = pagina({
      migas: migas, titulo: p.nombre, pantallaId: p.id, incr: p.incr, rf: p.rf, para: p.para,
      subtitulo: 'Pantalla planificada. Su diseño detallado se construye en la etapa ' + p.etapa + '.',
      acciones: '<button type="button" class="btn btn--primario" disabled aria-disabled="true">Acción principal (etapa ' + p.etapa + ')</button>' +
        (m.pantallas.length > 1 ? '<a class="btn" href="#/' + m.id + '">' + R.icono('flechaIzq') + 'Volver a ' + esc(m.nombre) + '</a>' : '') +
        '<a class="btn btn--terciario" href="#/inicio">Volver a Inicio</a>',
      contenido: '<div class="panel">' + R.estadoVacio('documento', 'Diseño detallado en la etapa ' + p.etapa,
        'Esta pantalla ya existe en el mapa del prototipo. Su contenido (tablas, formularios y estados) se agrega en la etapa ' + p.etapa + '. Consulta <span class="mono">docs/prototipo-equipo/mapa-pantallas.md</span>.') + '</div>' +
        '<div class="rejilla-2"><section class="panel"><h2>Qué cubrirá</h2><ul class="lista-simple">' +
        p.rf.map(function (rf) { return '<li class="pequeno"><span class="mono">' + esc(rf) + '</span></li>'; }).join('') + '</ul></section>' +
        '<section class="panel"><h2>Pendientes de enero</h2>' + (R.pendientesDePantalla(p.id).length
          ? '<ul class="lista-simple">' + R.pendientesDePantalla(p.id).map(function (x) { return '<li class="pequeno">' + R.pend(x.id) + ' ' + esc(x.descripcion) + '</li>'; }).join('') + '</ul>'
          : '<p class="pequeno texto-2">Esta pantalla no tiene pendientes registrados.</p>') + '</section></div>' + specBloque(p)
    });
    return { titulo: p.nombre, html: html };
  }

  /* =================== GEN-03 Panel de pendientes =================== */
  function vPendientes(ctx) {
    var g = R.pantalla('GEN-03').pantalla;
    var cuenta = { 'abierto': 0, 'en-consulta': 0, 'cerrado': 0, 'no-activable': 0 };
    R.pendientes.forEach(function (p) { cuenta[p.estado]++; });
    var modulosConPend = [{ id: 'transversal', nombre: 'Transversal' }].concat(R.modulos.filter(function (m) { return R.pendientesDeModulo(m).length; }));
    var kpis = '<div class="kpis">' + Object.keys(cuenta).map(function (k) {
      return '<div class="kpi"><div class="kpi__etiqueta">' + R.ESTADOS_PEND[k].t + '</div><div class="kpi__valor">' + cuenta[k] + '</div><div class="kpi__contexto">de ' + R.pendientes.length + ' registrados</div></div>';
    }).join('') + '</div>';
    var filtros = '<form class="filtros" id="filtros-pend" aria-label="Filtros de pendientes">' +
      '<div class="campo"><label for="f-modulo">Módulo</label><select id="f-modulo"><option value="">Todos</option>' + modulosConPend.map(function (m) { return '<option value="' + m.id + '"' + (ctx.q.modulo === m.id ? ' selected' : '') + '>' + esc(m.nombre) + '</option>'; }).join('') + '</select></div>' +
      '<div class="campo"><label for="f-estado">Estado</label><select id="f-estado"><option value="">Todos</option>' + Object.keys(R.ESTADOS_PEND).map(function (k) { return '<option value="' + k + '"' + (ctx.q.estado === k ? ' selected' : '') + '>' + R.ESTADOS_PEND[k].t + '</option>'; }).join('') + '</select></div>' +
      '<div class="campo"><label for="f-pantalla">Pantalla (ID)</label><input id="f-pantalla" value="' + esc(ctx.q.pantalla || '') + '" placeholder="Ej.: CTA-01"></div>' +
      '<div class="campo" style="flex:1"><label for="f-texto">Buscar</label><input id="f-texto" type="search" value="' + esc(ctx.q.id || '') + '" placeholder="Texto, PE-xxx, P-xxx o B01"></div>' +
      '<button type="reset" class="btn btn--terciario">Limpiar filtros</button></form>';
    var tabla = R.tabla('tabla-pend', {
      caption: 'Pendientes de enero', porPagina: 15, filas: [], ordenInicial: 'id',
      vacio: { titulo: 'No hay pendientes con esos filtros', texto: 'Quita algún filtro o usa «Limpiar filtros».' },
      columnas: [
        { clave: 'id', titulo: 'ID', orden: true, render: function (p) { return R.pend(p.id, true); } },
        { clave: 'estado', titulo: 'Estado', orden: true, render: function (p) { var e = R.ESTADOS_PEND[p.estado]; return '<span class="insignia ' + e.c + '">' + e.t + '</span>' + (p.cierre ? '<div class="micro">' + esc(p.cierre) + '</div>' : ''); } },
        { clave: 'descripcion', titulo: 'Pendiente', orden: true },
        { clave: 'moduloNombre', titulo: 'Módulo', orden: true },
        { clave: 'pantallasTxt', titulo: 'Pantallas', render: function (p) { return p.pantallas.map(function (x) { return '<a class="mono" href="' + R.rutaPantalla(x) + '">' + x + '</a>'; }).join(', '); } },
        { clave: 'paraCliente', titulo: 'Pregunta para la Municipalidad', render: function (p) { return '<span class="pequeno">' + esc(p.paraCliente || '—') + '</span>'; } },
        { clave: 'pregunta', titulo: 'ID de pregunta', orden: true, render: function (p) { return p.pregunta.indexOf('por asignar') >= 0 ? '<span class="micro">' + esc(p.pregunta) + '</span>' : '<strong class="mono">' + esc(p.pregunta) + '</strong>'; } },
        { clave: 'fuente', titulo: 'Fuente', render: function (p) { return '<span class="micro">' + esc(p.fuente) + '</span>'; } },
        { clave: 'responsable', titulo: 'Responsable sugerido', orden: true }
      ]
    });
    var html = pagina({
      migas: [{ t: 'Inicio', href: '#/inicio' }, { t: 'Panel de pendientes' }], titulo: 'Panel de pendientes', pantallaId: 'GEN-03', rf: [],
      subtitulo: 'Todo lo que depende de una respuesta o un dato de la Municipalidad.',
      para: g.para,
      acciones: '<button type="button" class="btn btn--primario" id="btn-csv">' + R.icono('descargar') + 'Descargar lista (CSV)</button>' +
        '<a class="btn" href="#/cuestionario">' + R.icono('info') + 'Ver como cuestionario</a>' +
        '<span class="acciones__fin pequeno texto-2">Para cambiar un estado, edita <span class="mono">data/pendientes.js</span>.</span>',
      contenido: kpis + '<section class="panel" aria-labelledby="t-lista"><h2 id="t-lista">Lista</h2>' + filtros + '<div style="margin-top:var(--s-4)">' + tabla + '</div></section>' +
        R.aviso('info', 'Sobre las preguntas P-xxx', 'El cuestionario a la Municipalidad no está en el repositorio. Solo se conocen los IDs que cita la matriz de brechas (P-003, P-008, P-027, P-036, P-037, P-054, P-060, P-083, P-103). Los demás pendientes dicen «P-xxx por asignar» hasta que llegue el cuestionario.')
    });
    return { titulo: 'Panel de pendientes', html: html, despues: function () {
      var form = $('#filtros-pend');
      function aplicar() {
        var mod = $('#f-modulo').value, est = $('#f-estado').value, pan = $('#f-pantalla').value.trim().toUpperCase(), tx = R.normalizar($('#f-texto').value.trim());
        var filas = R.pendientes.filter(function (p) {
          if (mod && p.modulo !== mod && !(R.modulo(mod) && R.pendientesDeModulo(R.modulo(mod)).indexOf(p) >= 0)) return false;
          if (est && p.estado !== est) return false;
          if (pan && p.pantallas.join(' ').indexOf(pan) < 0) return false;
          if (tx && R.normalizar([p.id, p.descripcion, p.fuente, p.pregunta, p.responsable, p.paraCliente].join(' ')).indexOf(tx) < 0) return false;
          return true;
        }).map(function (p) {
          var m = R.modulo(p.modulo);
          return Object.assign({}, p, { moduloNombre: m ? m.nombre : 'Transversal', pantallasTxt: p.pantallas.join(', ') });
        });
        R.tablaDatos('tabla-pend', filas);
        R._filasPend = filas;
      }
      form.addEventListener('input', aplicar);
      form.addEventListener('change', aplicar);
      form.addEventListener('submit', function (e) { e.preventDefault(); });
      form.addEventListener('reset', function () { setTimeout(aplicar, 0); });
      aplicar();
      $('#btn-csv').addEventListener('click', function () {
        var cols = ['id', 'modulo', 'pantallas', 'descripcion', 'paraCliente', 'fuente', 'pregunta', 'responsable', 'estado', 'cierre'];
        var csv = '﻿' + cols.join(';') + '\n' + R._filasPend.map(function (p) {
          return cols.map(function (c) { var v = c === 'pantallas' ? p.pantallas.join(', ') : p[c]; return '"' + String(v).replace(/"/g, '""') + '"'; }).join(';');
        }).join('\n');
        var a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
        a.download = 'pendientes-enero.csv'; document.body.appendChild(a); a.click(); a.remove();
        R.avisar('exito', 'Lista descargada', R._filasPend.length + ' pendientes en pendientes-enero.csv');
      });
    } };
  }

  /* =================== GEN-08 Cuestionario para la Municipalidad (vista equipo) =================== */
  function vNecesitamos(ctx) {
    var grupos = [{ id: 'transversal', titulo: 'General' }].concat(R.secciones.map(function (s) { return { id: s.id, titulo: s.titulo }; }));
    function grupoDe(p) { var m = R.modulo(p.modulo); return m ? m.seccion : 'transversal'; }
    var vivos = R.contarVivos(R.pendientes), conf = R.pendientes.filter(function (p) { return p.estado === 'cerrado'; }).length;
    var filtroSel = ctx.q.modulo ? ((R.modulo(ctx.q.modulo) || {}).seccion || '') : '';
    var cuerpo = grupos.map(function (g) {
      var lista = R.pendientes.filter(function (p) { return grupoDe(p) === g.id; });
      if (!lista.length) return '';
      return '<section class="panel" data-grupo="' + g.id + '"' + (filtroSel && filtroSel !== g.id ? ' hidden' : '') + '><h2>' + esc(g.titulo) + '</h2><ol class="lista-simple">' + lista.map(function (p) {
        var m = R.modulo(p.modulo);
        var est = p.estado === 'cerrado' ? R.ins('Confirmado', 'exito') : p.estado === 'no-activable' ? R.ins('No se aplicará', 'neutra') : R.ins('Por confirmar', 'alerta');
        var donde = p.pantallas.map(function (x) { var i = R.pantalla(x); return i ? '<a href="' + R.rutaPantalla(x) + '">' + esc(i.pantalla.nombre) + '</a>' : ''; }).join(', ');
        return '<li data-t="' + esc(R.normalizar(p.id + ' ' + p.paraCliente + ' ' + (m ? m.nombre : ''))) + '" style="margin-bottom:var(--s-3)"><div>' + R.pend(p.id, true) + ' ' + esc(p.paraCliente) + ' ' + est + '</div>' +
          '<div class="micro">' + (m ? esc(m.nombre) + ' · ' : '') + 'Se ve en: ' + donde + ' · Área sugerida: ' + esc(p.responsable) + '</div></li>';
      }).join('') + '</ol></section>';
    }).join('');
    var g8 = R.pantalla('GEN-08').pantalla;
    var html = pagina({
      migas: [{ t: 'Inicio', href: '#/inicio' }, { t: 'Cuestionario para la Municipalidad' }], titulo: 'Cuestionario para la Municipalidad', pantallaId: 'GEN-08', incr: g8.incr, rf: g8.rf,
      subtitulo: 'Las preguntas en lenguaje del cliente, agrupadas por área. Se envían o se imprimen para la reunión de enero; no aparecen en la versión del cliente.',
      para: g8.para,
      acciones: '<button type="button" class="btn btn--primario" id="btn-imprimir">Imprimir cuestionario</button><a class="btn" href="#/pendientes">' + R.icono('rombo') + 'Panel de pendientes</a>',
      contenido: '<div class="kpis"><div class="kpi"><div class="kpi__etiqueta">Por confirmar</div><div class="kpi__valor">' + vivos + '</div><div class="kpi__contexto">preguntas</div></div>' +
        '<div class="kpi"><div class="kpi__etiqueta">Confirmadas</div><div class="kpi__valor">' + conf + '</div><div class="kpi__contexto">ya resueltas</div></div></div>' +
        '<div class="filtros"><div class="campo"><label for="f-area">Área</label><select id="f-area"><option value="">Todas</option>' +
        grupos.map(function (g) { return '<option value="' + g.id + '"' + (filtroSel === g.id ? ' selected' : '') + '>' + esc(g.titulo) + '</option>'; }).join('') + '</select></div>' +
        '<div class="campo" style="flex:1"><label for="f-txt">Buscar</label><input id="f-txt" type="search" placeholder="Por ejemplo: caja, interés, formato"></div></div>' +
        '<div id="lista-preg">' + cuerpo + '</div><p id="preg-vacio" class="texto-2" hidden>No hay preguntas con ese texto.</p>'
    });
    return { titulo: 'Cuestionario para la Municipalidad', html: html, despues: function () {
      function aplicar() {
        var a = $('#f-area').value, t = R.normalizar($('#f-txt').value), total = 0;
        document.querySelectorAll('#lista-preg [data-grupo]').forEach(function (sec) {
          var n = 0;
          sec.querySelectorAll('li').forEach(function (li) { var ok = !t || li.getAttribute('data-t').indexOf(t) >= 0; li.hidden = !ok; if (ok) n++; });
          sec.hidden = (a && sec.getAttribute('data-grupo') !== a) || !n; if (!sec.hidden) total += n;
        });
        $('#preg-vacio').hidden = total > 0;
      }
      $('#f-area').addEventListener('change', aplicar); $('#f-txt').addEventListener('input', aplicar);
      $('#btn-imprimir').addEventListener('click', function () { window.print(); });
    } };
  }

  /* =================== GEN-04 Glosario =================== */
  function vGlosario() {
    var g = R.pantalla('GEN-04').pantalla, claves = Object.keys(R.glosario).sort(function (a, b) { return a.localeCompare(b, 'es'); });
    var html = pagina({
      migas: [{ t: 'Inicio', href: '#/inicio' }, { t: 'Glosario' }], titulo: 'Glosario', pantallaId: 'GEN-04', rf: g.rf, para: g.para,
      subtitulo: 'Explicaciones breves. No reemplazan la norma.',
      contenido: '<div class="panel"><div class="campo" style="max-width:28rem"><label for="f-glos">Buscar término</label><input id="f-glos" type="search"></div>' +
        '<dl class="glosario" id="lista-glos">' + claves.map(function (k) { return '<div data-t="' + esc(R.normalizar(k + ' ' + R.glosario[k])) + '"><dt>' + esc(k) + '</dt><dd>' + esc(R.glosario[k]) + '</dd></div>'; }).join('') + '</dl>' +
        '<p id="glos-vacio" class="texto-2" hidden>No hay términos con ese texto.</p></div>'
    });
    return { titulo: 'Glosario', html: html, despues: function () {
      $('#f-glos').addEventListener('input', function (e) {
        var t = R.normalizar(e.target.value), n = 0;
        document.querySelectorAll('#lista-glos > div').forEach(function (d) { var ok = d.getAttribute('data-t').indexOf(t) >= 0; d.hidden = !ok; if (ok) n++; });
        $('#glos-vacio').hidden = n > 0;
      });
    } };
  }

  /* =================== GEN-05 Error / no encontrado =================== */
  function vError(ctx, tipo) {
    var g = R.pantalla('GEN-05').pantalla, corr = R.correlacion();
    var titulo = tipo === 'no-encontrado' ? 'No encontramos esta pantalla' : 'Algo no salió como esperábamos';
    var html = pagina({
      migas: [{ t: 'Inicio', href: '#/inicio' }, { t: 'Error' }], titulo: titulo, pantallaId: 'GEN-05', incr: g.incr, rf: g.rf, para: g.para,
      contenido: '<div class="panel">' + R.estadoVacio('alerta', titulo,
        (tipo === 'no-encontrado' ? 'La dirección no corresponde a ninguna pantalla del prototipo. Revisa el enlace o vuelve a Inicio.' : 'Intenta de nuevo en unos segundos.') +
        '<br><span class="micro">Código de seguimiento: <span class="mono">' + corr + '</span> (ficticio)</span>',
        '<a class="btn btn--primario" href="#/inicio">Volver a Inicio</a>') + '</div>'
    });
    return { titulo: titulo, html: html };
  }

  /* =================== GEN-06 Componentes =================== */
  function vComponentes() {
    var g = R.pantalla('GEN-06').pantalla;
    var filas = [
      { concepto: 'Impuesto predial 2027 · cuota 1', periodo: '2027-02-27', principal: 18050, interes: 0, total: 18050, estado: 'Pendiente' },
      { concepto: 'Arbitrios 2025 · limpieza', periodo: '2025-06-30', principal: 9600, interes: 1245, total: 10845, estado: 'En valor' },
      { concepto: 'Multa tributaria 2025', periodo: '2025-09-15', principal: 27500, interes: 980, total: 28480, estado: 'En coactivo' }
    ];
    var tabla = R.tabla('demo-tabla', { caption: 'Tabla de ejemplo', porPagina: 2, filas: filas, columnas: [
      { clave: 'concepto', titulo: 'Concepto', orden: true }, { clave: 'periodo', titulo: 'Vencimiento', tipo: 'fecha', orden: true },
      { clave: 'principal', titulo: 'Principal', tipo: 'moneda', orden: true }, { clave: 'interes', titulo: 'Interés', tipo: 'moneda', orden: true },
      { clave: 'total', titulo: 'Total', tipo: 'moneda', orden: true },
      { clave: 'estado', titulo: 'Estado', render: function (f) { return R.ins(f.estado, f.estado === 'Pendiente' ? 'alerta' : f.estado === 'En valor' ? 'info' : 'error'); } }],
      totales: function (fs) { var t = fs.reduce(function (a, f) { return a + f.total; }, 0); return '<tr><td colspan="4">Total</td><td class="num">' + R.fmt.moneda(t) + '</td><td></td></tr>'; } });
    var html = pagina({
      migas: [{ t: 'Inicio', href: '#/inicio' }, { t: 'Componentes' }], titulo: 'Componentes del prototipo', pantallaId: 'GEN-06', para: g.para,
      subtitulo: 'Referencia viva de <span class="mono">guia-estilo.md</span>. Todos los montos son ficticios.',
      acciones: '<button type="button" class="btn btn--primario" id="demo-dialogo">Probar acción sensible</button><button type="button" class="btn">Secundario</button>' +
        '<button type="button" class="btn btn--terciario">Terciario</button><button type="button" class="btn" disabled>Deshabilitado</button>' +
        '<span class="acciones__fin"><button type="button" class="btn btn--peligro" id="demo-peligro">Peligro</button></span>',
      contenido:
        '<section class="panel"><h2>Insignias y términos</h2><p>' + R.insIncr('P1-B') + ' ' + R.insEstadoModulo('alcance') + ' ' + R.insEstadoModulo('confirmar') + ' ' + R.insEstadoModulo('ia') + ' ' +
        R.ins('Pagado', 'exito') + ' ' + R.ins('Por vencer', 'alerta') + ' ' + R.ins('En coactivo', 'error') + ' ' + R.ins('En valor', 'info') + ' ' + R.pend('PE-070') + ' ' + R.ficticio() + '</p>' +
        '<p>Términos con explicación al pasar el cursor o al enfocar: ' + R.term('TIM') + ', ' + R.term('IPM') + ', ' + R.term('REC') + ' y ' + R.term('Extorno', 'extorno') + '.</p></section>' +
        '<div class="kpis"><div class="kpi"><div class="kpi__etiqueta">Recaudación confirmada</div><div class="kpi__valor">' + R.fmt.moneda(12345678) + '</div><div class="kpi__contexto">Al ' + R.fmt.fecha(R.config.fechaCorte) + ' · ' + R.ficticio() + '</div></div>' +
        '<div class="kpi"><div class="kpi__etiqueta">Importe conciliado</div><div class="kpi__valor texto-2" style="font-size:var(--t-cuerpo)">Aún no hay movimientos</div><div class="kpi__contexto">Estado vacío: no se inventa un 0</div></div></div>' +
        '<section class="panel"><h2>Tabla</h2>' + tabla + '</section>' +
        '<section class="panel"><h2>Avisos</h2><div style="display:grid;gap:var(--s-2)">' + R.aviso('info', 'Información', 'Texto de ayuda.') + R.aviso('exito', 'Pago registrado', 'Recibo 001-000123 (ficticio).') +
        R.aviso('alerta', 'Cotización por vencer', 'Vence en 10 minutos.') + R.aviso('error', 'No pudimos verificar el pago', 'Código de seguimiento corr-000000000000.') +
        R.aviso('pend', 'PARAMETRO_NO_HABILITADO', 'Falta la TIM vigente ' + R.pend('PE-070') + '. Puedes simular, no emitir.') + '</div>' +
        '<p style="margin-top:var(--s-3)"><button type="button" class="btn btn--chico" id="demo-toast">Mostrar aviso emergente</button></p></section>' +
        '<section class="panel"><h2>Formulario</h2><form class="form-rejilla" onsubmit="return false"><div class="campo"><label for="d1">Número de DNI <span class="obligatorio">(obligatorio)</span></label><input id="d1" value="9900010" aria-invalid="true" aria-describedby="d1-a d1-e"><span class="ayuda" id="d1-a">8 dígitos. Ficticio: 99000101–99000199.</span><span class="error" id="d1-e">' + R.icono('error') + 'Escribe 8 dígitos para el DNI.</span></div>' +
        '<div class="campo"><label for="d2">Tipo de persona</label><select id="d2"><option>Natural</option><option>Jurídica</option></select></div></form></section>' +
        '<section class="panel"><h2>Pestañas</h2>' + R.pestanas('demo', [{ id: 'a', t: 'Resumen', html: '<p>Contenido de la primera pestaña.</p>' }, { id: 'b', t: 'Bienes', html: '<p>Contenido de la segunda.</p>' }, { id: 'c', t: 'Historial', html: '<p>Contenido de la tercera.</p>' }]) + '</section>' +
        '<section class="panel panel--ia"><h2>' + R.icono('chispa') + ' Sugerencia: una persona decide</h2><p class="pequeno">Panel de IA de ejemplo. Muestra el motivo, la regla o fuente y la confianza.</p>' +
        '<p><button type="button" class="btn btn--chico">Aceptar y abrir caso</button> <button type="button" class="btn btn--chico btn--terciario">Descartar</button> <button type="button" class="btn btn--chico btn--terciario">Reportar error</button></p></section>' +
        '<div id="demo-resultado"></div>'
    });
    return { titulo: 'Componentes del prototipo', html: html, despues: function () {
      $('#demo-toast').addEventListener('click', function () { R.avisar('exito', 'Aviso emergente', 'Se cierra solo en 6 segundos.'); });
      function demo(peligro) {
        R.confirmarSensible({ titulo: peligro ? 'Extornar pago (demostración)' : 'Publicar parámetro (demostración)', accion: peligro ? 'Extornar ' + R.fmt.moneda(12000) : 'Publicar versión',
          peligro: peligro, recurso: peligro ? 'pago PAG-DEMO-0001' : 'parametro TIM_MUNICIPAL v-demo',
          resumen: [['Qué cambia', peligro ? 'Se crea un asiento inverso; el recibo original se conserva' : 'La versión pasa de Revisado a Publicado'], ['Importe', peligro ? R.fmt.moneda(12000) + ' ' + R.ficticio() : '—']],
          aprobador: { perfil: 'supervisor' }, solicitante: peligro ? 'cajero' : 'operador',
          alConfirmar: function (huella) { $('#demo-resultado').innerHTML = R.aviso('exito', 'Operación registrada (simulada)', 'ID de operación OP-DEMO-0001.') + huella; R.avisar('exito', 'Listo', 'Operación simulada registrada.'); } });
      }
      $('#demo-dialogo').addEventListener('click', function () { demo(false); });
      $('#demo-peligro').addEventListener('click', function () { demo(true); });
    } };
  }

  /* =================== Pantallas «Alcance por confirmar» (ALC-01..07) =================== */
  R.modulos.filter(function (m) { return m.seccion === 'alc'; }).forEach(function (m) {
    var p = m.pantallas[0];
    R.vistas[p.id] = function () {
      var a = R.alcance[m.id];
      if (R.cliente()) {
        return {
          titulo: m.nombre,
          subtitulo: esc(m.desc),
          acciones: '<a class="btn btn--primario" href="#/' + m.id + '/' + m.pantallas[1].slug + '">Ver ' + esc(m.pantallas[1].nombre.toLowerCase()) + '</a>' +
            '<span class="acciones__fin">' + R.insEstadoModulo('confirmar') + '</span>',
          contenido: R.aviso('info', 'Módulo por confirmar', 'Les mostramos cómo funcionaría. Se incluye si la Municipalidad lo confirma y nos envía la información necesaria.') +
            '<div class="rejilla-2"><section class="panel"><h2>Qué es</h2><p>' + esc(a.queEs) + '</p><h3>Cómo funcionará</h3><ul class="lista-simple">' +
            a.comoFunciona.map(function (x) { return '<li class="pequeno">' + esc(x) + '</li>'; }).join('') + '</ul></section>' +
            '<section class="panel"><h2>Pantallas del módulo</h2><ul class="lista-simple">' + m.pantallas.slice(1).map(function (x) {
              return '<li><a href="#/' + m.id + '/' + x.slug + '">' + esc(x.nombre) + '</a><div class="pequeno texto-2">' + esc(x.para) + '</div></li>'; }).join('') + '</ul>' +
            '<h3 style="margin-top:var(--s-4)">Quién lo cobra</h3><p class="pequeno" style="margin:0">' + esc(a.competenciaCliente) + '</p></section></div>' +
            R.bloquePendientes(p.id, 'Lo que necesitamos que nos confirmen')
        };
      }
      return {
        titulo: m.nombre,
        subtitulo: 'Alcance por confirmar. Presentación sin diseño detallado.',
        acciones: '<button type="button" class="btn btn--primario" disabled aria-disabled="true">Emisión deshabilitada</button>' +
          '<a class="btn" href="#/pendientes?modulo=' + m.id + '">' + R.icono('rombo') + 'Ver pendientes</a>' +
          '<span class="acciones__fin">' + R.insEstadoModulo('confirmar') + '</span>',
        contenido: R.aviso('alerta', 'Módulo por confirmar', 'No se diseña a fondo hasta confirmar su alcance y sustento. No se emite ni se cobra.') +
          '<div class="rejilla-2"><section class="panel"><h2>Qué es</h2><p>' + esc(a.queEs) + '</p><h3>Qué dice el TdR o el SRS</h3><p class="pequeno">' + esc(a.tdr) + '</p>' +
          '<h3>Competencia y norma</h3><p class="pequeno" style="margin:0">' + esc(a.competencia) + '</p></section>' +
          '<section class="panel"><h2>Lo que se sabe</h2><ul class="lista-simple">' + a.seSabe.map(function (x) { return '<li class="pequeno">' + esc(x) + '</li>'; }).join('') + '</ul>' +
          '<h3 style="margin-top:var(--s-4)">Lo que falta</h3><ul class="lista-simple">' + a.falta.map(function (x) { return '<li class="pequeno">' + esc(x) + '</li>'; }).join('') + '</ul></section></div>' +
          R.bloquePendientes(p.id)
      };
    };
  });

  /* =================== Eventos globales =================== */
  var menuMovilAbierto = false;
  function cerrarMenuMovil() {
    if (!menuMovilAbierto) return;
    $('#menu').classList.remove('abierto'); var v = $('.velo'); if (v) v.remove();
    var b = $('#btn-menu-movil'); if (b) { b.setAttribute('aria-expanded', 'false'); b.focus(); }
    menuMovilAbierto = false;
  }
  function abrirMenuMovil() {
    if ($('.marco').classList.contains('marco--sin-menu')) { location.hash = '#/inicio'; return; }
    $('#menu').classList.add('abierto');
    var v = document.createElement('div'); v.className = 'velo'; v.addEventListener('click', cerrarMenuMovil); document.body.appendChild(v);
    $('#btn-menu-movil').setAttribute('aria-expanded', 'true');
    var f = $('#menu a, #menu button'); if (f) f.focus();
    menuMovilAbierto = true;
  }

  document.addEventListener('click', function (ev) {
    var t = ev.target;
    if (t.closest('#btn-menu-movil')) { menuMovilAbierto ? cerrarMenuMovil() : abrirMenuMovil(); return; }
    if (t.closest('#btn-colapsar')) { R.guardar('menuColapsado', !R.leer('menuColapsado', false)); render(); var b = $('#btn-colapsar'); if (b) b.focus(); return; }
    if (t.closest('#btn-texto-mas') || t.closest('#btn-texto-menos')) {
      var i = ESCALAS.indexOf(R.leer('escala', 1)); if (i < 0) i = 1;
      i = Math.max(0, Math.min(ESCALAS.length - 1, i + (t.closest('#btn-texto-mas') ? 1 : -1)));
      R.guardar('escala', ESCALAS[i]); aplicarEscala();
      R.avisar('info', 'Tamaño del texto', Math.round(ESCALAS[i] * 100) + ' %'); return;
    }
    if (t.closest('#btn-salir')) { cerrarSesion(); return; }
    var po = t.closest('[data-perfil]');
    if (po) { fijarPerfil(po.getAttribute('data-perfil'), parsear().q.volver); }
  });
  document.addEventListener('change', function (ev) {
    if (ev.target.id === 'sel-perfil' && ev.target.value) fijarPerfil(ev.target.value);
    if (ev.target.id === 'sel-ejercicio') R.avisar('info', 'Ejercicio ' + ev.target.value, 'En el prototipo los datos de ejemplo no cambian con el ejercicio.');
  });
  document.addEventListener('submit', function (ev) {
    if (ev.target.id === 'form-buscar') { ev.preventDefault(); location.hash = '#/inicio?q=' + encodeURIComponent($('#buscar-global').value); }
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && menuMovilAbierto) cerrarMenuMovil();
    if (ev.key === 'Tab' && menuMovilAbierto) {
      var f = $('#menu').querySelectorAll('a, button'), pr = f[0], ul = f[f.length - 1];
      if (ev.shiftKey && document.activeElement === pr) { ev.preventDefault(); ul.focus(); }
      else if (!ev.shiftKey && document.activeElement === ul) { ev.preventDefault(); pr.focus(); }
    }
  });

  function fijarPerfil(id, volver) {
    R._perfil = id;
    if (R.cliente()) { var s = R.sesion() || { usuario: 'demo', nombre: 'Usuario de demostración' }; s.perfil = id; R.fijarSesion(s); }
    else R.guardar('perfil', id);
    var p = R.perfilPorId(id);
    if (volver && volver !== 'perfil' && volver.indexOf('perfil') !== 0) location.hash = '#/' + volver;
    else if (parsear().ruta === 'perfil') location.hash = '#/inicio';
    else render();
    R.avisar('info', 'Perfil cambiado', 'Ahora usas el perfil ' + p.nombre + '.');
  }
  function aplicarEscala() { document.documentElement.style.setProperty('--escala', R.leer('escala', 1)); }

  window.addEventListener('hashchange', render);
  document.addEventListener('DOMContentLoaded', function () { aplicarEscala(); render(); });
})(window.RENTAS = window.RENTAS || {});
